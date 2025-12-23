import { Activity } from "../activity";
import { RollupChildFilter } from "./rollup_child_filter";

/**
 * Options for measure rollup calculation
 */
export interface MeasureRollupOptions {
  /**
   * Enable threshold bias for weighted calculations
   * When true, applies small bonuses/penalties based on passing threshold comparison
   */
  enableThresholdBias?: boolean;
}

/**
 * Event callback function type
 */
export type EventCallback = (eventType: string, data?: unknown) => void;

/**
 * MeasureRollupProcessor - Handles measure (score) rollup operations
 * Implements SCORM 2004 RB.1.1 (Measure Rollup Process) and RB.1.1.b (Completion Measure Rollup)
 *
 * This class is responsible for calculating rolled-up objective measures
 * from child activities to parent clusters using weighted averaging.
 *
 * @spec SN Book: RB.1.1 (Measure Rollup Process)
 * @spec SN Book: RB.1.1.b (Completion Measure Rollup Process)
 */
export class MeasureRollupProcessor {
  private childFilter: RollupChildFilter;
  private eventCallback: EventCallback | null;

  /**
   * Create a new MeasureRollupProcessor
   *
   * @param childFilter - RollupChildFilter instance for filtering children
   * @param eventCallback - Optional callback for firing events
   */
  constructor(childFilter: RollupChildFilter, eventCallback?: EventCallback) {
    this.childFilter = childFilter;
    this.eventCallback = eventCallback || null;
  }

  /**
   * Measure Rollup Process
   * Rolls up objective measure (score) from children to parent
   * Uses complex weighted measure calculation
   *
   * @spec SN Book: RB.1.1 (Measure Rollup Process)
   * @param activity - The parent activity
   * @returns Array of identified activity clusters (for cross-cluster processing)
   */
  public measureRollupProcess(activity: Activity): Activity[] {
    if (!activity.sequencingControls.rollupObjectiveSatisfied) {
      return [];
    }

    const children = activity.getAvailableChildren();
    if (children.length === 0) {
      return [];
    }

    const rollupConsiderations = activity.rollupConsiderations;
    const contributingChildren = children.filter((child) => {
      if (!this.childFilter.checkChildForRollupSubprocess(child, "measure")) {
        return false;
      }
      if (!child.objectiveMeasureStatus || child.objectiveNormalizedMeasure === null) {
        return false;
      }
      if (
        !rollupConsiderations.measureSatisfactionIfActive &&
        (child.activityAttemptActive || child.isActive)
      ) {
        return false;
      }
      return true;
    });

    if (contributingChildren.length === 0) {
      activity.objectiveMeasureStatus = false;
      return [];
    }

    const complexWeightedMeasure = this.calculateComplexWeightedMeasure(
      activity,
      contributingChildren,
      { enableThresholdBias: false },
    );
    activity.objectiveNormalizedMeasure = complexWeightedMeasure;
    activity.objectiveMeasureStatus = true;

    // Return identified clusters for cross-cluster processing
    return this.identifyActivityClusters(contributingChildren);
  }

  /**
   * Completion Measure Rollup Process
   * Rolls up attemptCompletionAmount from children to parent using weighted averaging
   * 4th Edition Addition: Supports completion measure rollup for progress tracking
   *
   * @spec SN Book: RB.1.1.b (Completion Measure Rollup Process)
   * @param activity - The parent activity
   */
  public completionMeasureRollupProcess(activity: Activity): void {
    const children = activity.getAvailableChildren();
    if (children.length === 0) {
      return;
    }

    const contributingChildren = children.filter((child) => {
      return child.attemptCompletionAmountStatus;
    });

    if (contributingChildren.length === 0) {
      activity.attemptCompletionAmountStatus = false;
      return;
    }

    let totalWeightedMeasure = 0;
    let totalWeight = 0;

    for (const child of contributingChildren) {
      totalWeightedMeasure += child.attemptCompletionAmount * child.progressWeight;
      totalWeight += child.progressWeight;
    }

    if (totalWeight > 0) {
      activity.attemptCompletionAmount = totalWeightedMeasure / totalWeight;
      activity.attemptCompletionAmountStatus = true;
    }
  }

  /**
   * Calculate Complex Weighted Measure
   * Handles complex objective weighting scenarios with dependency chains
   * Supports weighted rollup calculations with various adjustment factors
   *
   * @spec Priority 5 Gap Implementation
   * @param activity - The parent activity
   * @param children - Child activities to weight
   * @param options - Configuration options for the calculation
   * @returns Calculated weighted measure
   */
  public calculateComplexWeightedMeasure(
    activity: Activity,
    children: Activity[],
    options?: MeasureRollupOptions,
  ): number {
    let totalWeightedMeasure = 0;
    let totalWeight = 0;
    const weightingLog: Array<{ childId: string; measure: number; weight: number }> = [];
    const enableBias = options?.enableThresholdBias ?? true;

    for (const child of children) {
      if (!this.childFilter.checkChildForRollupSubprocess(child, "measure")) {
        continue;
      }

      if (child.objectiveMeasureStatus && child.objectiveNormalizedMeasure !== null) {
        // Handle complex weighting scenarios
        const baseWeight = child.sequencingControls.objectiveMeasureWeight;
        const adjustedWeight = this.calculateAdjustedWeight(child, baseWeight, enableBias);
        const contribution = child.objectiveNormalizedMeasure * adjustedWeight;

        totalWeightedMeasure += contribution;
        totalWeight += adjustedWeight;

        weightingLog.push({
          childId: child.id,
          measure: child.objectiveNormalizedMeasure,
          weight: adjustedWeight,
        });
      }
    }

    this.eventCallback?.("complex_weighting_calculated", {
      activityId: activity.id,
      weightingDetails: weightingLog,
      totalWeight,
      totalWeightedMeasure,
      result: totalWeight > 0 ? totalWeightedMeasure / totalWeight : 0,
    });

    return totalWeight > 0 ? totalWeightedMeasure / totalWeight : 0;
  }

  /**
   * Calculate adjusted weight for complex weighting scenarios
   * Applies various adjustment factors based on activity state
   *
   * @param child - Child activity to calculate weight for
   * @param baseWeight - Base weight from sequencing controls
   * @param enableBias - Whether to apply threshold bias adjustments
   * @returns Adjusted weight value
   */
  public calculateAdjustedWeight(
    child: Activity,
    baseWeight: number,
    enableBias: boolean = true,
  ): number {
    let adjustedWeight = baseWeight;

    // Factor in completion status
    if (child.completionStatus !== "completed") {
      adjustedWeight *= 0.8; // Reduce weight for incomplete activities
    }

    // Factor in attempt count (penalize multiple attempts)
    if (child.attemptCount > 1) {
      const attemptPenalty = Math.max(0.5, 1 - (child.attemptCount - 1) * 0.1);
      adjustedWeight *= attemptPenalty;
    }

    // Factor in time limits if exceeded
    if (child.hasAttemptLimitExceeded()) {
      adjustedWeight *= 0.6; // Significant penalty for exceeding limits
    }

    // Bias by relation to passing threshold when available
    if (enableBias && child.objectiveMeasureStatus) {
      const threshold = child.scaledPassingScore ?? 0.7;
      if (child.objectiveNormalizedMeasure >= threshold) {
        adjustedWeight *= 1.05; // small boost for above-threshold performance
      } else {
        adjustedWeight *= 0.95; // small penalty for below-threshold performance
      }
    }

    return Math.max(0, adjustedWeight); // Ensure non-negative weight
  }

  /**
   * Identify Activity Clusters
   * Identifies clusters among child activities for cross-cluster dependency processing
   *
   * @param children - Child activities to analyze
   * @returns Array of identified clusters
   */
  public identifyActivityClusters(children: Activity[]): Activity[] {
    const clusters: Activity[] = [];

    for (const child of children) {
      // An activity is considered a cluster if it has children and flow controls
      if (child.children.length > 0 && child.sequencingControls.flow) {
        clusters.push(child);
      }
    }

    return clusters;
  }
}
