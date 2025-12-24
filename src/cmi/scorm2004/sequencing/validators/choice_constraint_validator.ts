import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { ActivityTreeQueries } from "../utils/activity_tree_queries";

/**
 * Result of constraint validation
 */
export interface ConstraintValidationResult {
  valid: boolean;
  exception: string | null;
}

/**
 * Options for choice validation
 */
export interface ChoiceValidationOptions {
  checkAvailability?: boolean;
}

/**
 * ChoiceConstraintValidator - Consolidates ALL choice constraint validation logic
 *
 * This class extracts and unifies the constraint validation logic that was previously
 * duplicated in 5+ places within SequencingProcess. It provides a single source of truth
 * for validating choice navigation requests.
 *
 * Key validations performed:
 * - Path to root validation (hidden from choice, choice control)
 * - choiceExit constraint checking at all ancestor levels
 * - forwardOnly constraint validation
 * - constrainChoice boundary validation
 * - preventActivation constraint checking
 * - Mandatory activity skipping detection
 */
export class ChoiceConstraintValidator {
  constructor(
    private activityTree: ActivityTree,
    private treeQueries: ActivityTreeQueries
  ) {}

  /**
   * Main entry point - consolidates ALL constraint validation for choice navigation
   * @param {Activity | null} currentActivity - Current activity (may be null if no session started)
   * @param {Activity} targetActivity - Target activity for the choice
   * @param {ChoiceValidationOptions} options - Validation options
   * @return {ConstraintValidationResult} - Validation result with exception if invalid
   */
  public validateChoice(
    currentActivity: Activity | null,
    targetActivity: Activity,
    options: ChoiceValidationOptions = {}
  ): ConstraintValidationResult {
    // Step 1: Basic tree membership check
    if (!this.treeQueries.isInTree(targetActivity)) {
      return { valid: false, exception: "SB.2.9-2" };
    }

    // Step 2: Cannot choose the root activity
    if (targetActivity === this.activityTree.root) {
      return { valid: false, exception: "SB.2.9-3" };
    }

    // Step 3: Path to root validation - check hidden from choice and choice control
    const pathValidation = this.validatePathToRoot(targetActivity);
    if (!pathValidation.valid) {
      return pathValidation;
    }

    // Step 4: Check availability if requested
    if (options.checkAvailability && !targetActivity.isAvailable) {
      return { valid: false, exception: "SB.2.9-7" };
    }

    // Step 5: If no current activity, basic validation is sufficient
    if (!currentActivity) {
      return { valid: true, exception: null };
    }

    // Step 6: Check choiceExit constraints at all ancestor levels
    const choiceExitValidation = this.validateChoiceExit(currentActivity, targetActivity);
    if (!choiceExitValidation.valid) {
      return choiceExitValidation;
    }

    // Step 7: Validate constraints at all ancestor levels
    const ancestorValidation = this.validateAncestorConstraints(
      currentActivity,
      targetActivity
    );
    if (!ancestorValidation.valid) {
      return ancestorValidation;
    }

    return { valid: true, exception: null };
  }

  /**
   * Validate path to root - check hidden from choice and choice control
   * @param {Activity} targetActivity - Target activity
   * @return {ConstraintValidationResult} - Validation result
   */
  public validatePathToRoot(targetActivity: Activity): ConstraintValidationResult {
    let activity: Activity | null = targetActivity;
    while (activity) {
      // Check if activity is hidden from choice
      if (activity.isHiddenFromChoice) {
        return { valid: false, exception: "SB.2.9-4" };
      }

      // Check if parent allows choice
      if (activity.parent && !activity.parent.sequencingControls.choice) {
        return { valid: false, exception: "SB.2.9-5" };
      }

      // Check preventActivation constraint at parent level
      // This applies even when there's no current activity
      if (activity.parent && activity.parent.sequencingControls.preventActivation) {
        // Target must have been previously attempted
        if (targetActivity.attemptCount === 0 && !targetActivity.isActive) {
          return { valid: false, exception: "SB.2.9-6" };
        }
      }

      activity = activity.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Validate choiceExit constraint at all ancestor levels
   * Per SCORM spec: choiceExit only applies when we're actively IN that ancestor's subtree
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @return {ConstraintValidationResult} - Validation result
   */
  public validateChoiceExit(
    currentActivity: Activity,
    targetActivity: Activity
  ): ConstraintValidationResult {
    // Walk from current activity to root, checking for choiceExit=false
    let currentAncestor: Activity | null = currentActivity.parent;

    while (currentAncestor) {
      // choiceExit only applies when the ancestor is ACTIVE
      if (currentAncestor.isActive && !currentAncestor.sequencingControls.choiceExit) {
        // choiceExit is false at this active ancestor
        // Check if target is a descendant of this ancestor
        if (!this.treeQueries.isAncestorOf(currentAncestor, targetActivity)) {
          return { valid: false, exception: "SB.2.9-8" };
        }
        // If target is within this subtree, we can stop checking higher levels
        break;
      }
      currentAncestor = currentAncestor.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Validate constraints at all ancestor levels
   * Checks forwardOnly, constrainChoice, preventActivation
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @return {ConstraintValidationResult} - Validation result
   */
  public validateAncestorConstraints(
    currentActivity: Activity,
    targetActivity: Activity
  ): ConstraintValidationResult {
    let ancestorActivity: Activity | null = targetActivity.parent;

    while (ancestorActivity) {
      const validation = this.validateConstraintsAtLevel(
        ancestorActivity,
        currentActivity,
        targetActivity
      );
      if (!validation.valid) {
        return validation;
      }
      ancestorActivity = ancestorActivity.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Validate constraints at a specific ancestor level
   * @param {Activity} ancestor - The ancestor to check
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @return {ConstraintValidationResult} - Validation result
   */
  private validateConstraintsAtLevel(
    ancestor: Activity,
    currentActivity: Activity,
    targetActivity: Activity
  ): ConstraintValidationResult {
    // Find which children of this ancestor contain current and target
    const targetChild = this.treeQueries.findChildInPath(ancestor, targetActivity);
    const currentChild = this.treeQueries.findChildInPath(ancestor, currentActivity);

    // Only validate if both current and target are descendants of this ancestor
    if (!targetChild || !currentChild) {
      return { valid: true, exception: null };
    }

    const siblings = ancestor.children;
    const targetIndex = siblings.indexOf(targetChild);
    const currentIndex = siblings.indexOf(currentChild);

    if (targetIndex === -1 || currentIndex === -1) {
      return { valid: true, exception: null };
    }

    // Priority 1: Check forwardOnly constraint (highest priority)
    // Per SCORM spec, forwardOnly blocks ALL backward navigation
    if (ancestor.sequencingControls.forwardOnly && targetIndex < currentIndex) {
      return { valid: false, exception: "SB.2.9-5" };
    }

    // Priority 2: Check mandatory activities being skipped (forward direction)
    if (targetIndex > currentIndex) {
      for (let i = currentIndex + 1; i < targetIndex; i++) {
        const intermediateChild = siblings[i];
        if (
          intermediateChild &&
          this.treeQueries.isMandatory(intermediateChild) &&
          !this.treeQueries.isCompleted(intermediateChild)
        ) {
          return { valid: false, exception: "SB.2.9-6" };
        }
      }
    }

    // Priority 3: Check constrainChoice constraint
    if (ancestor.sequencingControls.constrainChoice) {
      // Cannot skip forward beyond next sibling
      if (targetIndex > currentIndex + 1) {
        return { valid: false, exception: "SB.2.9-7" };
      }

      // Cannot go backward to incomplete activity
      if (targetIndex < currentIndex) {
        if (
          targetActivity.completionStatus !== "completed" &&
          (targetActivity.completionStatus as string) !== "passed"
        ) {
          return { valid: false, exception: "SB.2.9-7" };
        }
      }
    }

    // Check preventActivation constraint
    if (ancestor.sequencingControls.preventActivation) {
      if (targetActivity.attemptCount === 0 && !targetActivity.isActive) {
        return { valid: false, exception: "SB.2.9-6" };
      }
    }

    return { valid: true, exception: null };
  }

  /**
   * Check forwardOnly violation at ALL ancestor levels
   * This is critical for Previous request validation
   * @param {Activity} fromActivity - The activity to check from
   * @return {ConstraintValidationResult} - Violation info or valid result
   */
  public checkForwardOnlyViolation(fromActivity: Activity): ConstraintValidationResult {
    // Walk up the ancestor chain checking forwardOnly at each level
    let current: Activity | null = fromActivity.parent;

    while (current) {
      if (current.sequencingControls.forwardOnly) {
        return { valid: false, exception: "SB.2.9-5" };
      }
      current = current.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Validate activity is available for choice navigation
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if available for choice
   */
  public isAvailableForChoice(activity: Activity): boolean {
    return this.treeQueries.isAvailableForChoice(activity);
  }

  /**
   * Validate choice flow constraints for flow tree traversal
   * @param {Activity} fromActivity - Activity to traverse from
   * @param {Activity[]} children - Available children
   * @return {{ valid: boolean; validChildren: Activity[] }} - Valid children that meet constraints
   */
  public validateFlowConstraints(
    fromActivity: Activity,
    children: Activity[]
  ): { valid: boolean; validChildren: Activity[] } {
    const validChildren: Activity[] = [];

    for (const child of children) {
      if (this.meetsFlowConstraints(child, fromActivity)) {
        validChildren.push(child);
      }
    }

    return {
      valid: validChildren.length > 0,
      validChildren
    };
  }

  /**
   * Check if activity meets flow constraints
   * @param {Activity} activity - Activity to check
   * @param {Activity} parent - Parent activity
   * @return {boolean} - True if constraints are met
   */
  public meetsFlowConstraints(activity: Activity, parent: Activity): boolean {
    // Check basic availability
    if (!activity.isAvailable || activity.isHiddenFromChoice) {
      return false;
    }

    // Check parent constraint controls
    if (parent.sequencingControls.constrainChoice) {
      return this.validateConstrainChoiceForFlow(activity, parent);
    }

    return true;
  }

  /**
   * Validate constrainChoice for flow scenarios
   * @param {Activity} activity - Activity to validate
   * @param {Activity} parent - Parent activity
   * @return {boolean} - True if valid
   */
  private validateConstrainChoiceForFlow(activity: Activity, parent: Activity): boolean {
    // If constrainChoice is false, no restrictions apply
    if (!parent.sequencingControls || !parent.sequencingControls.constrainChoice) {
      return true;
    }

    const children = parent.children;
    if (!children || children.length === 0) {
      return true;
    }

    const targetIndex = children.indexOf(activity);
    if (targetIndex === -1) {
      return false;
    }

    // Get the current activity within this parent's children
    const currentActivity = this.treeQueries.getCurrentInParent(parent);
    if (!currentActivity) {
      // No current activity in this cluster, allow choice to first available
      return this.isAvailableForChoice(activity);
    }

    const currentIndex = children.indexOf(currentActivity);
    if (currentIndex === -1) {
      return true;
    }

    // Check flow direction constraints
    if (parent.sequencingControls.flow) {
      // forwardOnly check
      if (parent.sequencingControls.forwardOnly && targetIndex < currentIndex) {
        // Allow if previously completed
        if (activity.completionStatus === "completed" ||
            (activity.completionStatus as string) === "passed") {
          return true;
        }
        return false;
      }

      // Forward direction - can only choose immediate next sibling or current
      if (targetIndex >= currentIndex) {
        if (targetIndex === currentIndex || targetIndex === currentIndex + 1) {
          return this.isAvailableForChoice(activity);
        }
        return false;
      }

      // Backward direction (forwardOnly is false)
      if (targetIndex < currentIndex) {
        return (
          (activity.completionStatus === "completed" ||
           (activity.completionStatus as string) === "passed") &&
          this.isAvailableForChoice(activity)
        );
      }

      return false;
    } else {
      // Non-flow mode with constrainChoice
      return (
        this.isAvailableForChoice(activity) &&
        (activity.completionStatus === "completed" ||
         activity.completionStatus === "unknown" ||
         activity.completionStatus === "incomplete")
      );
    }
  }

  /**
   * Validate traversal constraints for choice navigation
   * @param {Activity} activity - Activity to validate
   * @return {{ canTraverse: boolean; canTraverseInto: boolean }} - Traversal permissions
   */
  public validateTraversalConstraints(activity: Activity): {
    canTraverse: boolean;
    canTraverseInto: boolean;
  } {
    let canTraverse = true;
    let canTraverseInto = true;

    // Check constrainChoice control
    if (activity.parent?.sequencingControls.constrainChoice) {
      canTraverse = this.evaluateConstrainChoiceForTraversal(activity);
    }

    // Check stopForwardTraversal control
    if (activity.sequencingControls && activity.sequencingControls.stopForwardTraversal) {
      canTraverseInto = false;
    }

    // Check forwardOnly control in parent context
    if (activity.parent?.sequencingControls.forwardOnly) {
      canTraverseInto = this.evaluateForwardOnlyForChoice(activity);
    }

    return { canTraverse, canTraverseInto };
  }

  /**
   * Evaluate constrainChoice for traversal
   * @param {Activity} activity - Activity to evaluate
   * @return {boolean} - True if traversal is allowed
   */
  private evaluateConstrainChoiceForTraversal(activity: Activity): boolean {
    if (!activity.parent) {
      return true;
    }

    // Check constraint at ALL ancestor levels
    let currentAncestor: Activity | null = activity.parent;
    while (currentAncestor) {
      if (
        currentAncestor.sequencingControls &&
        currentAncestor.sequencingControls.constrainChoice
      ) {
        const ancestorChildren = currentAncestor.children;
        const childInPath = this.treeQueries.findChildInPath(currentAncestor, activity);

        if (childInPath) {
          const childIndex = ancestorChildren.indexOf(childInPath);
          const currentAtLevel = this.treeQueries.getCurrentInParent(currentAncestor);

          if (currentAtLevel) {
            const currentIndex = ancestorChildren.indexOf(currentAtLevel);

            if (currentIndex !== -1 && childIndex !== -1) {
              // Check mandatory intermediate activities
              if (currentIndex < childIndex) {
                for (let i = currentIndex + 1; i < childIndex; i++) {
                  const intermediateActivity = ancestorChildren[i];
                  if (
                    intermediateActivity &&
                    this.treeQueries.isMandatory(intermediateActivity) &&
                    !this.treeQueries.isCompleted(intermediateActivity)
                  ) {
                    return false;
                  }
                }
              }

              // Check forwardOnly constraint
              if (currentAncestor.sequencingControls.forwardOnly && childIndex < currentIndex) {
                if (!this.treeQueries.isCompleted(activity)) {
                  return false;
                }
              }
            }
          }
        }
      }
      currentAncestor = currentAncestor.parent;
    }

    return this.isAvailableForChoice(activity);
  }

  /**
   * Evaluate forwardOnly for choice scenarios
   * @param {Activity} activity - Activity to evaluate
   * @return {boolean} - True if allowed
   */
  private evaluateForwardOnlyForChoice(activity: Activity): boolean {
    if (!activity.parent) {
      return true;
    }

    const parent = activity.parent;
    if (!parent.sequencingControls || !parent.sequencingControls.forwardOnly) {
      return true;
    }

    const siblings = parent.children;
    if (!siblings || siblings.length === 0) {
      return true;
    }

    const targetIndex = siblings.indexOf(activity);
    if (targetIndex === -1) {
      return false;
    }

    const currentActivity = this.treeQueries.getCurrentInParent(parent);
    if (!currentActivity) {
      return this.isAvailableForChoice(activity);
    }

    const currentIndex = siblings.indexOf(currentActivity);
    if (currentIndex === -1) {
      return true;
    }

    // ForwardOnly: only allow activities at or after current position
    if (targetIndex < currentIndex) {
      // Allow if completed and choice-enabled
      if (activity.completionStatus === "completed" ||
          (activity.completionStatus as string) === "passed") {
        if (activity.sequencingControls && activity.sequencingControls.choice) {
          return true;
        }
      }
      return false;
    }

    return this.isAvailableForChoice(activity);
  }

  /**
   * Check for time-based constraint boundary violations
   * @param {Activity} targetActivity - Target activity
   * @param {Date} now - Current time
   * @return {boolean} - True if there is a boundary violation
   */
  public hasTimeBoundaryViolation(targetActivity: Activity, now: Date): boolean {
    // Check begin time limit
    if (targetActivity.beginTimeLimit) {
      try {
        const beginTime = new Date(targetActivity.beginTimeLimit);
        if (now < beginTime) {
          return true; // Not yet available
        }
      } catch {
        // Invalid date format, no violation
      }
    }

    // Check end time limit
    if (targetActivity.endTimeLimit) {
      try {
        const endTime = new Date(targetActivity.endTimeLimit);
        if (now > endTime) {
          return true; // No longer available
        }
      } catch {
        // Invalid date format, no violation
      }
    }

    return false;
  }

  /**
   * Check for attempt limit violations
   * @param {Activity} targetActivity - Target activity
   * @return {boolean} - True if attempt limit exceeded
   */
  public hasAttemptLimitViolation(targetActivity: Activity): boolean {
    return !!(
      targetActivity.attemptLimit &&
      targetActivity.attemptCount >= targetActivity.attemptLimit
    );
  }
}
