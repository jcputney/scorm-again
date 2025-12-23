import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";

/**
 * Utility class for querying and traversing the activity tree
 * Extracted from SequencingProcess to reduce class size and improve maintainability
 *
 * This class provides helper methods for:
 * - Tree traversal and ancestor lookups
 * - Activity relationship queries (parent/child/sibling)
 * - Activity state and completion checks
 * - Common ancestor calculations
 */
export class ActivityTreeQueries {
  constructor(private activityTree: ActivityTree) {}

  /**
   * Check if activity is in the activity tree
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if activity is in the tree
   */
  public isInTree(activity: Activity): boolean {
    return this.activityTree.getAllActivities().includes(activity);
  }

  /**
   * Check if activity1 is a parent (ancestor) of activity2
   * Used for choiceExit validation to determine if target is within a subtree
   * @param {Activity} ancestor - Potential parent/ancestor activity
   * @param {Activity} descendant - Potential child/descendant activity
   * @return {boolean} - True if ancestor is an ancestor of descendant
   */
  public isAncestorOf(ancestor: Activity, descendant: Activity): boolean {
    let current: Activity | null = descendant;
    while (current) {
      if (current === ancestor) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  /**
   * Find common ancestor of two activities
   * @param {Activity | null} activity1 - First activity
   * @param {Activity | null} activity2 - Second activity
   * @return {Activity | null} - Common ancestor or null
   */
  public findCommonAncestor(
    activity1: Activity | null,
    activity2: Activity | null
  ): Activity | null {
    if (!activity1 || !activity2) {
      return null;
    }

    // Get ancestors of activity1
    const ancestors1: Activity[] = [];
    let current: Activity | null = activity1;
    while (current) {
      ancestors1.push(current);
      current = current.parent;
    }

    // Find first common ancestor
    current = activity2;
    while (current) {
      if (ancestors1.includes(current)) {
        return current;
      }
      current = current.parent;
    }

    return null;
  }

  /**
   * Find which child of ancestor is in the path to the target activity
   * Used for multi-level constraint validation
   * @param {Activity} ancestor - The ancestor activity
   * @param {Activity} target - The target activity
   * @return {Activity | null} - The child in the path, or null
   */
  public findChildInPath(ancestor: Activity, target: Activity): Activity | null {
    let current: Activity | null = target;

    while (current && current.parent) {
      if (current.parent === ancestor) {
        return current;
      }
      current = current.parent;
    }

    return null;
  }

  /**
   * Check if activity is the last activity in a forward preorder tree traversal
   * Per SB.2.1 step 3.1: An activity is last overall if it's a leaf with no next siblings
   * anywhere in its ancestor chain
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if this is the last activity in the tree
   */
  public isLastInTree(activity: Activity): boolean {
    // An activity is last overall if:
    // 1. It's a leaf (no children)
    // 2. It has no next sibling
    // 3. None of its ancestors have next siblings

    if (activity.children.length > 0) {
      return false; // Not a leaf
    }

    let current: Activity | null = activity;
    while (current) {
      if (this.activityTree.getNextSibling(current)) {
        return false; // Has a next sibling somewhere in the ancestor chain
      }
      current = current.parent;
    }

    return true; // No next siblings anywhere - this is the last activity
  }

  /**
   * Find the currently active activity within a parent's children
   * @param {Activity} parent - The parent activity
   * @return {Activity | null} - The active child or null
   */
  public getCurrentInParent(parent: Activity): Activity | null {
    if (parent.children) {
      for (const child of parent.children) {
        if (child.isActive) {
          return child;
        }
      }
    }
    return null;
  }

  /**
   * Check if activity is mandatory (cannot be skipped)
   * In SCORM 2004, this is typically determined by sequencing rules
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if activity is mandatory
   */
  public isMandatory(activity: Activity): boolean {
    // Check if activity has an unconditional skip rule (not mandatory)
    if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
      for (const rule of activity.sequencingRules.preConditionRules) {
        if (rule.action === "skip" && rule.conditions && rule.conditions.length === 0) {
          return false; // Has unconditional skip rule, not mandatory
        }
      }
    }

    // Check for explicit mandatory flag. Default to false (not mandatory) unless explicitly set
    // Activities are only mandatory if explicitly marked as such
    return (activity as any).mandatory === true;
  }

  /**
   * Check if activity is completed
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if activity is completed
   */
  public isCompleted(activity: Activity): boolean {
    return (
      activity.completionStatus === "completed" ||
      activity.completionStatus === "passed" ||
      activity.successStatus === "passed"
    );
  }

  /**
   * Check if activity is available for choice according to SCORM 2004 rules
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if activity is available for choice
   */
  public isAvailableForChoice(activity: Activity): boolean {
    return (
      activity.isVisible &&
      !activity.isHiddenFromChoice &&
      activity.isAvailable &&
      (activity.sequencingControls ? activity.sequencingControls.choice : true)
    );
  }

  /**
   * Get all ancestors of an activity from child to root
   * @param {Activity} activity - The activity to get ancestors for
   * @return {Activity[]} - Array of ancestors from immediate parent to root
   */
  public getAncestors(activity: Activity): Activity[] {
    const ancestors: Activity[] = [];
    let current = activity.parent;
    while (current) {
      ancestors.push(current);
      current = current.parent;
    }
    return ancestors;
  }

  /**
   * Get the path from an activity to the root
   * @param {Activity} activity - The activity
   * @return {Activity[]} - Array from the activity to root (inclusive)
   */
  public getPathToRoot(activity: Activity): Activity[] {
    const path: Activity[] = [activity];
    let current = activity.parent;
    while (current) {
      path.push(current);
      current = current.parent;
    }
    return path;
  }

  /**
   * Check if an activity is a leaf (has no children)
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if activity is a leaf
   */
  public isLeaf(activity: Activity): boolean {
    return activity.children.length === 0;
  }

  /**
   * Check if an activity is a cluster (has children)
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if activity is a cluster
   */
  public isCluster(activity: Activity): boolean {
    return activity.children.length > 0;
  }

  /**
   * Get the depth of an activity in the tree (root = 0)
   * @param {Activity} activity - Activity to get depth for
   * @return {number} - Depth in tree
   */
  public getDepth(activity: Activity): number {
    let depth = 0;
    let current = activity.parent;
    while (current) {
      depth++;
      current = current.parent;
    }
    return depth;
  }
}
