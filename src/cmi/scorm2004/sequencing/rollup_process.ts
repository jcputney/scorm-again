import { Activity } from "./activity";
import { RollupChildFilter } from "./rollup/rollup_child_filter";
import { RollupRuleEvaluator } from "./rollup/rollup_rule_evaluator";
import { MeasureRollupProcessor, MeasureRollupOptions } from "./rollup/measure_rollup";
import { ObjectiveRollupProcessor } from "./rollup/objective_rollup";
import { ProgressRollupProcessor } from "./rollup/progress_rollup";
import { DurationRollupProcessor } from "./rollup/duration_rollup";
import { CrossClusterProcessor } from "./rollup/cross_cluster_processor";
import {
  GlobalObjectiveSynchronizer,
  GlobalObjective,
} from "./objectives/global_objective_synchronizer";
import { RollupStateValidator } from "./validation/rollup_state_validator";

/**
 * Event callback function type
 */
export type EventCallback = (eventType: string, data?: unknown) => void;

/**
 * Enhanced Rollup Process implementation for SCORM 2004 sequencing
 * Priority 5 Gap: Comprehensive rollup with global objective mapping and complex weighting
 *
 * This class serves as the orchestrator for all rollup operations, delegating
 * specific functionality to specialized processor classes:
 *
 * - RollupChildFilter: Child activity filtering for rollup
 * - RollupRuleEvaluator: Rollup rule evaluation
 * - MeasureRollupProcessor: Measure (score) rollup
 * - ObjectiveRollupProcessor: Objective satisfaction rollup
 * - ProgressRollupProcessor: Progress (completion) rollup
 * - DurationRollupProcessor: Duration aggregation rollup
 * - GlobalObjectiveSynchronizer: Global objective synchronization
 * - RollupStateValidator: State consistency validation
 * - CrossClusterProcessor: Cross-cluster dependency handling
 *
 * @spec SN Book: RB.1.5 (Overall Rollup Process)
 */
export class RollupProcess {
  private childFilter: RollupChildFilter;
  private ruleEvaluator: RollupRuleEvaluator;
  private measureProcessor: MeasureRollupProcessor;
  private objectiveProcessor: ObjectiveRollupProcessor;
  private progressProcessor: ProgressRollupProcessor;
  private durationProcessor: DurationRollupProcessor;
  private globalObjectiveSynchronizer: GlobalObjectiveSynchronizer;
  private stateValidator: RollupStateValidator;
  private crossClusterProcessor: CrossClusterProcessor;
  private eventCallback: EventCallback | null;

  /**
   * Create a new RollupProcess orchestrator
   *
   * @param eventCallback - Optional callback for firing events
   */
  constructor(eventCallback?: EventCallback) {
    this.eventCallback = eventCallback || null;

    // Initialize all processors with proper dependency injection
    this.childFilter = new RollupChildFilter();
    this.ruleEvaluator = new RollupRuleEvaluator(this.childFilter);
    this.measureProcessor = new MeasureRollupProcessor(this.childFilter, eventCallback);
    this.objectiveProcessor = new ObjectiveRollupProcessor(
      this.childFilter,
      this.ruleEvaluator,
      eventCallback,
    );
    this.progressProcessor = new ProgressRollupProcessor(
      this.childFilter,
      this.ruleEvaluator,
      this.objectiveProcessor,
      eventCallback,
    );
    this.durationProcessor = new DurationRollupProcessor(eventCallback);
    this.globalObjectiveSynchronizer = new GlobalObjectiveSynchronizer(eventCallback);
    this.stateValidator = new RollupStateValidator(this.childFilter, eventCallback);
    this.crossClusterProcessor = new CrossClusterProcessor(
      this.measureProcessor,
      this.objectiveProcessor,
      this.progressProcessor,
      eventCallback,
    );
  }

  /**
   * Overall Rollup Process
   * Performs rollup from a given activity up through its ancestors
   * OPTIMIZATION: Stops propagating rollup when status stops changing (SCORM 2004 4.6.1)
   *
   * @spec SN Book: RB.1.5 (Overall Rollup Process)
   * @param activity - The activity to start rollup from
   * @returns Array of activities that had status changes
   */
  public overallRollupProcess(activity: Activity): Activity[] {
    const affectedActivities: Activity[] = [];
    let currentActivity: Activity | null = activity.parent; // Start from parent, not the activity itself
    let onlyDurationRollup = false;
    let isFirst = true;

    // Process rollup up the tree from parent to root
    while (currentActivity) {
      // Duration rollup happens FIRST, ALWAYS for cluster activities
      // This happens even when optimization is active for other rollup types
      if (currentActivity.children.length > 0) {
        this.durationProcessor.durationRollupProcess(currentActivity);
      }

      if (!onlyDurationRollup) {
        // Capture status BEFORE rollup
        const beforeStatus = currentActivity.captureRollupStatus();

        // Only perform rollup if the activity tracks status
        if (
          currentActivity.sequencingControls.rollupObjectiveSatisfied ||
          currentActivity.sequencingControls.rollupProgressCompletion
        ) {
          // Step 1: Measure Rollup Process (RB.1.1)
          if (currentActivity.children.length > 0) {
            const clusters = this.measureProcessor.measureRollupProcess(currentActivity);
            // Step 1b: Completion Measure Rollup Process (RB.1.1 b)
            this.measureProcessor.completionMeasureRollupProcess(currentActivity);

            // Process cross-cluster dependencies if dealing with multiple clusters
            if (clusters.length > 1) {
              this.crossClusterProcessor.processCrossClusterDependencies(
                currentActivity,
                clusters,
              );
            }
          }

          // Step 2: Objective Rollup Process (RB.1.2)
          if (currentActivity.sequencingControls.rollupObjectiveSatisfied) {
            this.objectiveProcessor.objectiveRollupProcess(currentActivity);
          }

          // Step 3: Activity Progress Rollup Process (RB.1.3)
          if (currentActivity.sequencingControls.rollupProgressCompletion) {
            this.progressProcessor.activityProgressRollupProcess(currentActivity);
          }
        }

        // Capture status AFTER rollup
        const afterStatus = currentActivity.captureRollupStatus();

        // OPTIMIZATION: Check if anything changed (skip first iteration)
        // The first activity always gets processed regardless of change
        if (!isFirst) {
          const changed = !Activity.compareRollupStatus(beforeStatus, afterStatus);
          if (!changed) {
            // No changes detected - activate optimization
            this.eventCallback?.("rollup_optimization_activated", {
              activityId: currentActivity.id,
              depth: affectedActivities.length,
            });
            onlyDurationRollup = true;
          }
        }

        // Add to affected activities if status changed or is first iteration
        if (isFirst || !Activity.compareRollupStatus(beforeStatus, afterStatus)) {
          affectedActivities.push(currentActivity);
        }
      }

      // Move up the tree
      currentActivity = currentActivity.parent;
      isFirst = false;
    }

    return affectedActivities;
  }

  // ============================================================================
  // Public API Methods - Delegate to specialized processors
  // ============================================================================

  /**
   * Validate rollup state consistency across the activity tree
   *
   * @param rootActivity - The root activity to validate from
   * @returns True if state is consistent, false otherwise
   */
  public validateRollupStateConsistency(rootActivity: Activity): boolean {
    return this.stateValidator.validateRollupStateConsistency(rootActivity);
  }

  /**
   * Process global objective mapping for shared objectives
   *
   * @param activity - The root activity to start processing from
   * @param globalObjectives - Global objective map
   */
  public processGlobalObjectiveMapping(
    activity: Activity,
    globalObjectives: Map<string, GlobalObjective>,
  ): void {
    this.globalObjectiveSynchronizer.processGlobalObjectiveMapping(activity, globalObjectives);
  }

  /**
   * Calculate complex weighted measure for an activity
   *
   * @param activity - The parent activity
   * @param children - Child activities to weight
   * @param options - Configuration options
   * @returns Calculated weighted measure
   */
  public calculateComplexWeightedMeasure(
    activity: Activity,
    children: Activity[],
    options?: MeasureRollupOptions,
  ): number {
    return this.measureProcessor.calculateComplexWeightedMeasure(activity, children, options);
  }

  /**
   * Handle cross-cluster dependencies in rollup
   *
   * @param activity - The activity to process
   * @param clusters - Related activity clusters
   */
  public processCrossClusterDependencies(activity: Activity, clusters: Activity[]): void {
    this.crossClusterProcessor.processCrossClusterDependencies(activity, clusters);
  }

  // ============================================================================
  // Accessor methods for individual processors (for advanced use cases)
  // ============================================================================

  /**
   * Get the child filter processor
   */
  public getChildFilter(): RollupChildFilter {
    return this.childFilter;
  }

  /**
   * Get the rule evaluator processor
   */
  public getRuleEvaluator(): RollupRuleEvaluator {
    return this.ruleEvaluator;
  }

  /**
   * Get the measure rollup processor
   */
  public getMeasureProcessor(): MeasureRollupProcessor {
    return this.measureProcessor;
  }

  /**
   * Get the objective rollup processor
   */
  public getObjectiveProcessor(): ObjectiveRollupProcessor {
    return this.objectiveProcessor;
  }

  /**
   * Get the progress rollup processor
   */
  public getProgressProcessor(): ProgressRollupProcessor {
    return this.progressProcessor;
  }

  /**
   * Get the duration rollup processor
   */
  public getDurationProcessor(): DurationRollupProcessor {
    return this.durationProcessor;
  }

  /**
   * Get the global objective synchronizer
   */
  public getGlobalObjectiveSynchronizer(): GlobalObjectiveSynchronizer {
    return this.globalObjectiveSynchronizer;
  }

  /**
   * Get the state validator
   */
  public getStateValidator(): RollupStateValidator {
    return this.stateValidator;
  }

  /**
   * Get the cross-cluster processor
   */
  public getCrossClusterProcessor(): CrossClusterProcessor {
    return this.crossClusterProcessor;
  }
}
