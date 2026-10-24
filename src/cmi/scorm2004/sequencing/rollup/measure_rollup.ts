import { Activity } from "../activity";
import { RollupChildFilter } from "./rollup_child_filter";

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
  /**
   * Create a new MeasureRollupProcessor
   *
   * @param _childFilter - Retained for constructor compatibility
   * @param _eventCallback - Retained for constructor compatibility
   */
  constructor(_childFilter: RollupChildFilter, _eventCallback?: EventCallback) {}

  /**
   * Measure Rollup Process
   * Rolls up objective measure (score) from children to parent
   * Uses each counted child's configured objective measure weight
   *
   * @spec SN Book: RB.1.1 (Measure Rollup Process)
   * @param activity - The parent activity
   */
  public measureRollupProcess(activity: Activity): void {
    const children = activity.getAvailableChildren();
    if (children.length === 0) {
      // No available child means no valid data, so the parent's measure is unknown.
      activity.objectiveMeasureStatus = false;
      return;
    }

    let counted = 0;
    let total = 0;
    let validData = false;

    for (const child of children) {
      if (child.sequencingControls.tracked === false) {
        continue;
      }
      // RB.1.1 gates on Tracked only. Objective info from an earlier parent attempt is unknown
      // (useCurrentAttemptObjectiveInfo): the child keeps its weight but not its score.
      const hasKnownMeasure =
        child.objectiveInfoAvailableInCurrentParentAttempt !== false &&
        child.objectiveMeasureStatus &&
        child.objectiveNormalizedMeasure !== null;
      const weight = child.sequencingControls.objectiveMeasureWeight;
      if (weight <= 0) {
        continue;
      }
      counted += weight;
      if (hasKnownMeasure) {
        total += weight * child.objectiveNormalizedMeasure;
        validData = true;
      }
    }

    if (!validData) {
      // No known child measure means the parent's measure is unknown (4th Ed valid-data step).
      // The ADL SRTE sequencer has no such step and reports 0 here; we follow the spec text.
      activity.objectiveMeasureStatus = false;
    } else if (counted > 0) {
      activity.objectiveNormalizedMeasure = total / counted;
      activity.objectiveMeasureStatus = true;
    } else {
      activity.objectiveMeasureStatus = false;
    }
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

    const trackedChildren = children.filter((child) => child.sequencingControls.tracked);
    const contributingChildren = trackedChildren.filter(
      (child) =>
        child.progressInfoAvailableInCurrentParentAttempt !== false &&
        child.attemptCompletionAmountStatus,
    );

    if (contributingChildren.length === 0) {
      activity.attemptCompletionAmountStatus = false;
      return;
    }

    let totalWeightedMeasure = 0;
    let totalWeight = 0;

    // @spec SCORM 2004 4th Ed. SN RB.1.1.b: every tracked child's Progress
    // Weight participates in the denominator. A child whose Attempt Completion
    // Amount Status is false contributes no amount to the numerator.
    for (const child of trackedChildren) {
      if (
        child.progressInfoAvailableInCurrentParentAttempt !== false &&
        child.attemptCompletionAmountStatus
      ) {
        totalWeightedMeasure += child.attemptCompletionAmount * child.progressWeight;
      }
      totalWeight += child.progressWeight;
    }

    if (totalWeight > 0) {
      activity.attemptCompletionAmount = totalWeightedMeasure / totalWeight;
      activity.attemptCompletionAmountStatus = true;
    }
  }
}
