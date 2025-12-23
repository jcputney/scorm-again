import {
  Activity,
  RollupConsiderationRequirement,
  RollupConsiderationsConfig,
} from "../activity";
import { SuccessStatus } from "../../../../constants/enums";

/**
 * Type of rollup operation being performed
 */
export type RollupType = "measure" | "objective" | "progress";

/**
 * Rollup action for consideration filtering
 */
export type RollupAction = "satisfied" | "notSatisfied" | "completed" | "incomplete";

/**
 * RollupChildFilter - Handles child activity filtering for rollup operations
 * Implements SCORM 2004 RB.1.4.2 (Check Child For Rollup Subprocess)
 *
 * This class is responsible for determining which child activities should
 * contribute to rollup calculations based on their tracking settings and
 * rollup consideration requirements.
 *
 * @spec SN Book: RB.1.4.2 (Check Child For Rollup Subprocess)
 */
export class RollupChildFilter {
  /**
   * Check Child For Rollup Subprocess
   * Determines if a child activity contributes to rollup based on its individual consideration settings
   * This implements the full SCORM 2004 RB.1.4.2 specification
   *
   * @spec SN Book: RB.1.4.2 (Check Child For Rollup Subprocess)
   * @param child - The child activity to check
   * @param rollupType - Type of rollup ("measure", "objective", "progress")
   * @param rollupAction - Specific rollup action (satisfied, notSatisfied, completed, incomplete)
   * @returns True if child contributes to rollup
   */
  public checkChildForRollupSubprocess(
    child: Activity,
    rollupType: RollupType,
    rollupAction?: RollupAction,
  ): boolean {
    // First check if child is tracked
    if (child.sequencingControls.tracked === false) {
      return false;
    }

    let included = false;

    // RB.1.4.2 Step 2: Check for objective rollup (satisfied/notSatisfied)
    if (rollupType === "measure" || rollupType === "objective") {
      // Step 2.1: Check if child tracks objective rollup
      if (!child.sequencingControls.rollupObjectiveSatisfied) {
        return false;
      }

      // Step 2.1.1: Default to included
      included = true;

      // Get the child's individual consideration requirements
      const requiredForSatisfied = child.requiredForSatisfied;
      const requiredForNotSatisfied = child.requiredForNotSatisfied;

      // Step 2.1.2: Check ifNotSuspended consideration
      if (
        (rollupAction === "satisfied" && requiredForSatisfied === "ifNotSuspended") ||
        (rollupAction === "notSatisfied" && requiredForNotSatisfied === "ifNotSuspended")
      ) {
        // Step 2.1.2.1: Exclude if not attempted or if attempted and suspended
        if (!child.attemptProgressStatus || (child.attemptCount > 0 && child.isSuspended)) {
          included = false;
        }
      }
      // Step 2.1.3: Check ifAttempted consideration
      else if (
        (rollupAction === "satisfied" && requiredForSatisfied === "ifAttempted") ||
        (rollupAction === "notSatisfied" && requiredForNotSatisfied === "ifAttempted")
      ) {
        // Step 2.1.3.1.1: Exclude if not attempted
        if (!child.attemptProgressStatus || child.attemptCount === 0) {
          included = false;
        }
      }
      // Step 2.1.3.2: Check ifNotSkipped consideration
      else if (
        (rollupAction === "satisfied" && requiredForSatisfied === "ifNotSkipped") ||
        (rollupAction === "notSatisfied" && requiredForNotSatisfied === "ifNotSkipped")
      ) {
        // Step 2.1.3.2.1: Exclude if activity is skipped
        if (child.wasSkipped) {
          included = false;
        }
      }
      // "always" is the default - activity is included
    }

    // RB.1.4.2 Step 3: Check for progress rollup (completed/incomplete)
    if (rollupType === "progress") {
      // Step 3.1: Check if child tracks progress rollup
      if (!child.sequencingControls.rollupProgressCompletion) {
        return false;
      }

      // Step 3.1.1: Default to included
      included = true;

      // Get the child's individual consideration requirements
      const requiredForCompleted = child.requiredForCompleted;
      const requiredForIncomplete = child.requiredForIncomplete;

      // Step 3.1.2: Check ifNotSuspended consideration
      if (
        (rollupAction === "completed" && requiredForCompleted === "ifNotSuspended") ||
        (rollupAction === "incomplete" && requiredForIncomplete === "ifNotSuspended")
      ) {
        // Step 3.1.2.1: Exclude if not attempted or if attempted and suspended
        if (!child.attemptProgressStatus || (child.attemptCount > 0 && child.isSuspended)) {
          included = false;
        }
      }
      // Step 3.1.3: Check ifAttempted consideration
      else if (
        (rollupAction === "completed" && requiredForCompleted === "ifAttempted") ||
        (rollupAction === "incomplete" && requiredForIncomplete === "ifAttempted")
      ) {
        // Step 3.1.3.1.1: Exclude if not attempted
        if (!child.attemptProgressStatus || child.attemptCount === 0) {
          included = false;
        }
      }
      // Step 3.1.3.2: Check ifNotSkipped consideration
      else if (
        (rollupAction === "completed" && requiredForCompleted === "ifNotSkipped") ||
        (rollupAction === "incomplete" && requiredForIncomplete === "ifNotSkipped")
      ) {
        // Step 3.1.3.2.1: Exclude if activity is skipped
        if (child.wasSkipped) {
          included = false;
        }
      }
      // "always" is the default - activity is included
    }

    // Check if child is available for rollup (additional safety check)
    if (included && !child.isAvailable) {
      return false;
    }

    return included;
  }

  /**
   * Filter children based on rollup requirement
   *
   * @param children - Child activities to filter
   * @param _requirement - The rollup requirement (not directly used but kept for API compatibility)
   * @param rollupType - Type of rollup ("objective" | "progress")
   * @param mode - Rollup action mode
   * @param considerations - Parent-level rollup considerations config
   * @returns Filtered array of children that should contribute to rollup
   */
  public filterChildrenForRequirement(
    children: Activity[],
    _requirement: RollupConsiderationRequirement,
    rollupType: "objective" | "progress",
    mode: RollupAction,
    considerations: RollupConsiderationsConfig,
  ): Activity[] {
    return children.filter((child) =>
      this.shouldIncludeChildForRollup(child, _requirement, rollupType, mode, considerations),
    );
  }

  /**
   * Check if a specific child should be included in rollup
   *
   * @param child - Child activity to check
   * @param _requirement - The rollup requirement (not directly used but kept for API compatibility)
   * @param rollupType - Type of rollup ("objective" | "progress")
   * @param mode - Rollup action mode
   * @param considerations - Parent-level rollup considerations config
   * @returns True if child should be included
   */
  public shouldIncludeChildForRollup(
    child: Activity,
    _requirement: RollupConsiderationRequirement,
    rollupType: "objective" | "progress",
    mode: RollupAction,
    considerations: RollupConsiderationsConfig,
  ): boolean {
    // Use the enhanced RB.1.4.2 implementation with rollupAction parameter
    if (!this.checkChildForRollupSubprocess(child, rollupType, mode)) {
      return false;
    }

    // Check parent-level measureSatisfactionIfActive setting
    if (
      rollupType === "objective" &&
      !considerations.measureSatisfactionIfActive &&
      (child.activityAttemptActive || child.isActive)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Check if child is satisfied for rollup
   * Evaluates objective satisfaction status and success status
   *
   * @param child - Child activity to check
   * @returns True if child is considered satisfied
   */
  public isChildSatisfiedForRollup(child: Activity): boolean {
    if (child.objectiveSatisfiedStatus === true) {
      return true;
    }

    if (child.objectiveSatisfiedStatus === false) {
      return false;
    }

    if (child.successStatus === SuccessStatus.PASSED) {
      return true;
    }

    if (child.successStatus === SuccessStatus.FAILED) {
      return false;
    }

    return false;
  }

  /**
   * Check if child is completed for rollup
   * Evaluates completion status
   *
   * @param child - Child activity to check
   * @returns True if child is considered completed
   */
  public isChildCompletedForRollup(child: Activity): boolean {
    if (child.completionStatus === "completed" || child.isCompleted) {
      return true;
    }

    return false;
  }

  /**
   * Get trackable children for rollup operations
   * Filters out activities with tracked=false from rollup calculations
   *
   * @param activity - The parent activity
   * @returns Array of trackable children
   */
  public getTrackableChildren(activity: Activity): Activity[] {
    return activity.children.filter((child) => child.sequencingControls.tracked !== false);
  }
}
