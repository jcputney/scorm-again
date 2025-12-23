import { Activity } from "../activity";
import { RollupChildFilter } from "../rollup/rollup_child_filter";

/**
 * Event callback function type
 */
export type EventCallback = (eventType: string, data?: unknown) => void;

/**
 * Rollup state log entry
 */
export interface RollupStateLogEntry {
  activity: string;
  timestamp: string;
  state: {
    measureStatus: boolean;
    measure: number;
    satisfiedStatus: boolean;
    completionStatus: string;
  };
}

/**
 * RollupStateValidator - Validates rollup state consistency across the activity tree
 * Implements SCORM 2004 rollup state validation
 *
 * This class is responsible for validating that rollup states are consistent
 * and valid before and after processing. It can detect inconsistencies between
 * parent and child activity states.
 *
 * @spec Priority 5 Gap: Rollup state validation
 */
export class RollupStateValidator {
  private rollupStateLog: RollupStateLogEntry[] = [];
  private childFilter: RollupChildFilter;
  private eventCallback: EventCallback | null;

  /**
   * Create a new RollupStateValidator
   *
   * @param childFilter - RollupChildFilter instance for filtering children
   * @param eventCallback - Optional callback for firing events
   */
  constructor(childFilter: RollupChildFilter, eventCallback?: EventCallback) {
    this.childFilter = childFilter;
    this.eventCallback = eventCallback || null;
  }

  /**
   * Validate rollup state consistency across the activity tree
   * Ensures that rollup states are consistent and valid before processing
   *
   * @param rootActivity - The root activity to validate from
   * @returns True if state is consistent, false otherwise
   */
  public validateRollupStateConsistency(rootActivity: Activity): boolean {
    try {
      this.eventCallback?.("rollup_validation_started", {
        activityId: rootActivity.id,
        timestamp: new Date().toISOString(),
      });

      const inconsistencies: string[] = [];

      // Validate the entire tree recursively
      this.validateActivityRollupState(rootActivity, inconsistencies);

      if (inconsistencies.length > 0) {
        this.eventCallback?.("rollup_state_inconsistencies", {
          activityId: rootActivity.id,
          inconsistencies,
          count: inconsistencies.length,
        });
        return false;
      }

      this.eventCallback?.("rollup_validation_completed", {
        activityId: rootActivity.id,
        result: "consistent",
      });
      return true;
    } catch (error) {
      this.eventCallback?.("rollup_validation_error", {
        activityId: rootActivity.id,
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Validate rollup state for a single activity
   *
   * @param activity - The activity to validate
   * @param inconsistencies - Array to collect inconsistencies into
   */
  public validateActivityRollupState(activity: Activity, inconsistencies: string[]): void {
    const activityId = activity.id;

    // Check measure status consistency
    if (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure === null) {
      inconsistencies.push(
        `Activity ${activityId}: measure status true but normalized measure is null`,
      );
    }

    // Check satisfaction status consistency with measure (only when success status is known)
    if (
      activity.objectiveMeasureStatus &&
      activity.scaledPassingScore !== null &&
      activity.successStatus !== "unknown"
    ) {
      const expectedSatisfied =
        activity.objectiveNormalizedMeasure >= activity.scaledPassingScore;
      if (activity.objectiveSatisfiedStatus !== expectedSatisfied) {
        inconsistencies.push(
          `Activity ${activityId}: satisfaction status inconsistent with measure`,
        );
      }
    }

    // Check rollup controls consistency
    const controls = activity.sequencingControls;
    // Note: Having rollup data without rollup controls enabled is valid (data from content)
    // We only flag it as inconsistent if the data seems to be from rollup
    if (!controls.rollupObjectiveSatisfied && !controls.rollupProgressCompletion) {
      // Only flag as inconsistent if this is a cluster with children
      // (leaf activities can have data set by content)
      if (activity.children.length > 0) {
        if (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure !== 0) {
          // Cluster has measure data but rollup is disabled - this could be inconsistent
          // unless it was set explicitly by content (which is unusual but valid)
        }
      }
    }

    // Check rollup consideration consistency (RB.1.4 enhancement)
    // Validate that consideration settings are appropriate for activity state
    if (activity.requiredForSatisfied === "ifAttempted" && activity.attemptCount === 0) {
      // Activity requires being attempted but hasn't been attempted
      // This is valid - just means it won't contribute to rollup yet
    }

    if (
      activity.requiredForSatisfied === "ifNotSuspended" &&
      activity.isSuspended &&
      activity.attemptCount > 0
    ) {
      // Activity is suspended and won't contribute to satisfied rollup
      // This is valid - just means it's temporarily excluded
    }

    if (activity.requiredForSatisfied === "ifNotSkipped" && activity.wasSkipped) {
      // Activity was skipped and won't contribute to satisfied rollup
      // This is valid - just means it's excluded
    }

    // Check children consistency and their rollup contributions
    const children = activity.getAvailableChildren();

    // Validate parent's rolled-up state matches children's contributions
    if (children.length > 0 && controls.rollupObjectiveSatisfied) {
      const satisfiedChildren = children.filter(
        (child) =>
          this.childFilter.checkChildForRollupSubprocess(child, "objective", "satisfied") &&
          this.childFilter.isChildSatisfiedForRollup(child),
      );

      const notSatisfiedChildren = children.filter(
        (child) =>
          this.childFilter.checkChildForRollupSubprocess(child, "objective", "notSatisfied") &&
          !this.childFilter.isChildSatisfiedForRollup(child),
      );

      // If all contributing children are satisfied, parent should be satisfied
      if (satisfiedChildren.length > 0 && notSatisfiedChildren.length === 0) {
        if (
          activity.objectiveSatisfiedStatus === false &&
          activity.rollupRules.rules.length === 0
        ) {
          inconsistencies.push(
            `Activity ${activityId}: all children satisfied but parent is not satisfied (no rollup rules to override)`,
          );
        }
      }
    }

    if (children.length > 0 && controls.rollupProgressCompletion) {
      const completedChildren = children.filter(
        (child) =>
          this.childFilter.checkChildForRollupSubprocess(child, "progress", "completed") &&
          this.childFilter.isChildCompletedForRollup(child),
      );

      const incompleteChildren = children.filter(
        (child) =>
          this.childFilter.checkChildForRollupSubprocess(child, "progress", "incomplete") &&
          !this.childFilter.isChildCompletedForRollup(child),
      );

      // If all contributing children are completed, parent should be completed
      if (completedChildren.length > 0 && incompleteChildren.length === 0) {
        if (
          activity.completionStatus !== "completed" &&
          activity.rollupRules.rules.length === 0
        ) {
          inconsistencies.push(
            `Activity ${activityId}: all children completed but parent is incomplete (no rollup rules to override)`,
          );
        }
      }
    }

    // Recursively validate children
    for (const child of children) {
      this.validateActivityRollupState(child, inconsistencies);
    }

    // Log validation state
    this.rollupStateLog.push({
      activity: activityId,
      timestamp: new Date().toISOString(),
      state: {
        measureStatus: activity.objectiveMeasureStatus,
        measure: activity.objectiveNormalizedMeasure,
        satisfiedStatus: activity.objectiveSatisfiedStatus,
        completionStatus: activity.completionStatus,
      },
    });
  }

  /**
   * Get rollup state log
   *
   * @returns Array of rollup state log entries
   */
  public getRollupStateLog(): RollupStateLogEntry[] {
    return [...this.rollupStateLog];
  }

  /**
   * Clear rollup state log
   */
  public clearRollupStateLog(): void {
    this.rollupStateLog = [];
  }
}
