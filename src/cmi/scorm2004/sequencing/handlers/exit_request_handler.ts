import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { RuleEvaluationEngine } from "../rules/rule_evaluation_engine";
import { SequencingResult } from "../rules/sequencing_request_types";
import { RuleActionType } from "../sequencing_rules";

/**
 * ExitRequestHandler - Handles exit and termination sequencing requests
 *
 * This handler manages:
 * - EXIT: Exit the current activity
 * - EXIT_ALL: Exit all activities
 * - ABANDON: Abandon the current activity
 * - ABANDON_ALL: Abandon all activities
 * - SUSPEND_ALL: Suspend all activities
 */
export class ExitRequestHandler {
  constructor(
    private activityTree: ActivityTree,
    private ruleEngine: RuleEvaluationEngine
  ) {}

  /**
   * Exit Sequencing Request Process (SB.2.11)
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  public handleExit(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // Check if exit is allowed
    if (!currentActivity.parent) {
      result.exception = "SB.2.11-1";
      return result;
    }

    // Check parent's sequencing controls
    if (!currentActivity.parent.sequencingControls.choiceExit) {
      result.exception = "SB.2.11-2";
      return result;
    }

    // Terminate current activity
    this.terminateDescendentAttempts(currentActivity);

    return result;
  }

  /**
   * Exit All Sequencing Request Process
   * @return {SequencingResult}
   */
  public handleExitAll(): SequencingResult {
    const result = new SequencingResult();

    // Terminate all activities
    if (this.activityTree.root) {
      this.terminateDescendentAttempts(this.activityTree.root);
    }

    return result;
  }

  /**
   * Abandon Sequencing Request Process
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  public handleAbandon(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // Set current activity as abandoned
    currentActivity.isActive = false;
    this.activityTree.currentActivity = currentActivity.parent;

    return result;
  }

  /**
   * Abandon All Sequencing Request Process
   * @return {SequencingResult}
   */
  public handleAbandonAll(): SequencingResult {
    const result = new SequencingResult();

    // Abandon all activities
    this.activityTree.currentActivity = null;

    return result;
  }

  /**
   * Suspend All Sequencing Request Process (SB.2.15)
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  public handleSuspendAll(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // Cannot suspend root
    if (currentActivity === this.activityTree.root) {
      result.exception = "SB.2.15-1";
      return result;
    }

    // Suspend the current activity
    currentActivity.isSuspended = true;
    this.activityTree.suspendedActivity = currentActivity;
    this.activityTree.currentActivity = null;

    return result;
  }

  /**
   * Terminate descendent attempts with exit rule evaluation
   * @param {Activity} activity - The activity
   * @param {boolean} skipExitRules - Whether to skip exit rules
   */
  public terminateDescendentAttempts(
    activity: Activity,
    skipExitRules: boolean = false
  ): void {
    // Apply Exit Action Rules (TB.2.1)
    let exitAction = null;
    if (!skipExitRules) {
      exitAction = this.ruleEngine.evaluateExitRules(activity);
    }

    // End attempt on the activity
    activity.isActive = false;

    // Recursively terminate descendants
    for (const child of activity.children) {
      this.terminateDescendentAttempts(child, skipExitRules);
    }

    // Process deferred exit actions
    if (exitAction && !skipExitRules) {
      this.processDeferredExitAction(exitAction, activity);
    }
  }

  /**
   * Process deferred exit action
   * @param {RuleActionType} exitAction - The exit action
   * @param {Activity} activity - The activity
   */
  private processDeferredExitAction(exitAction: RuleActionType, activity: Activity): void {
    switch (exitAction) {
      case RuleActionType.EXIT:
        // Already handled by terminateDescendentAttempts
        break;

      case RuleActionType.EXIT_PARENT:
        if (activity.parent && activity.parent.isActive) {
          this.terminateDescendentAttempts(activity.parent, true);
        }
        break;

      case RuleActionType.EXIT_ALL:
        if (this.activityTree.root && this.activityTree.root !== activity) {
          const allActivities = this.activityTree.getAllActivities();
          const anyActive = allActivities.some((a) => a.isActive);
          if (anyActive) {
            this.terminateDescendentAttempts(this.activityTree.root, true);
          }
        }
        break;
    }
  }
}
