import { Activity } from "../activity";
import { RollupActionType } from "../rollup_rules";
import { CompletionStatus } from "../../../../constants/enums";
import { RollupChildFilter } from "./rollup_child_filter";
import { RollupRuleEvaluator } from "./rollup_rule_evaluator";
import { ObjectiveRollupProcessor } from "./objective_rollup";

/**
 * Event callback function type
 */
export type EventCallback = (eventType: string, data?: unknown) => void;

/**
 * ProgressRollupProcessor - Handles activity progress (completion) rollup operations
 * Implements SCORM 2004 RB.1.3 (Activity Progress Rollup Process)
 *
 * This class is responsible for determining completion status for parent
 * activities based on their children's states using measure-based evaluation,
 * rules, or default rollup logic.
 *
 * @spec SN Book: RB.1.3 (Activity Progress Rollup Process)
 * @spec SN Book: RB.1.3.a (Activity Progress Rollup Using Measure)
 */
export class ProgressRollupProcessor {
  private childFilter: RollupChildFilter;
  private ruleEvaluator: RollupRuleEvaluator;
  private objectiveProcessor: ObjectiveRollupProcessor;
  private eventCallback: EventCallback | null;

  /**
   * Create a new ProgressRollupProcessor
   *
   * @param childFilter - RollupChildFilter instance for filtering children
   * @param ruleEvaluator - RollupRuleEvaluator instance for evaluating rules
   * @param objectiveProcessor - ObjectiveRollupProcessor for syncing objectives
   * @param eventCallback - Optional callback for firing events
   */
  constructor(
    childFilter: RollupChildFilter,
    ruleEvaluator: RollupRuleEvaluator,
    objectiveProcessor: ObjectiveRollupProcessor,
    eventCallback?: EventCallback,
  ) {
    this.childFilter = childFilter;
    this.ruleEvaluator = ruleEvaluator;
    this.objectiveProcessor = objectiveProcessor;
    this.eventCallback = eventCallback || null;
  }

  /**
   * Activity Progress Rollup Process
   * Determines activity completion status
   * Tries measure-based rollup first, then rules-based, then default
   *
   * @spec SN Book: RB.1.3 (Activity Progress Rollup Process)
   * @param activity - The parent activity
   */
  public activityProgressRollupProcess(activity: Activity): void {
    // Try measure-based rollup first (RB.1.3 a)
    if (this.activityProgressRollupUsingMeasure(activity)) {
      return;
    }

    // Continue with rules-based rollup (original implementation)
    const rollupRules = activity.rollupRules;

    // Get completion rules
    const completedRules = rollupRules.rules.filter(
      (rule) => rule.action === RollupActionType.COMPLETED,
    );

    const incompleteRules = rollupRules.rules.filter(
      (rule) => rule.action === RollupActionType.INCOMPLETE,
    );

    // Evaluate completed rules first
    for (const rule of completedRules) {
      if (this.ruleEvaluator.evaluateRollupRule(activity, rule)) {
        activity.completionStatus = CompletionStatus.COMPLETED;
        this.objectiveProcessor.syncPrimaryObjectiveFromActivity(activity);
        return;
      }
    }

    // Then evaluate incomplete rules
    for (const rule of incompleteRules) {
      if (this.ruleEvaluator.evaluateRollupRule(activity, rule)) {
        activity.completionStatus = CompletionStatus.INCOMPLETE;
        this.objectiveProcessor.syncPrimaryObjectiveFromActivity(activity);
        return;
      }
    }

    // @spec SN Book: RB.1.3.b (Activity Progress Rollup Using Rules) - once the
    // activity's manifest defines any completed/incomplete-action rollup rule,
    // those rules are the sole determinant of this activity's progress status.
    // Activity Progress Rollup Using Default only applies to an activity that
    // defines NO completion-type rollup rules at all; it is not a fallback for
    // a pass where the defined rules simply didn't fire. If neither rule fired
    // this pass, the activity's completion status is left unchanged (same
    // principle already enforced for the global-objective completion shortcut
    // in GlobalObjectiveSynchronizer.updateActivityAttemptData's
    // hasCompletionRollupRules guard).
    if (completedRules.length > 0 || incompleteRules.length > 0) {
      return;
    }

    // Default: completed if all tracked children are completed
    // For default rollup, use INTERSECTION of both consideration filters.
    // A child must pass BOTH requiredForCompleted AND requiredForIncomplete
    // to contribute to the rollup. This ensures symmetric exclusion.
    const children = activity.getAvailableChildren();
    const contributors = children.filter(
      (child) =>
        this.childFilter.checkChildForRollupSubprocess(child, "progress", "completed") &&
        this.childFilter.checkChildForRollupSubprocess(child, "progress", "incomplete"),
    );

    if (contributors.length === 0) {
      activity.completionStatus = CompletionStatus.INCOMPLETE;
      this.objectiveProcessor.syncPrimaryObjectiveFromActivity(activity);
      return;
    }

    // Default progress rollup logic, partitioned by whether each contributor's
    // completion status is actually KNOWN (RB.1.4.2) rather than simply
    // defaulting to "not completed" because it was never attempted this parent
    // attempt:
    // - Parent is "incomplete" if ANY known contributor is incomplete
    // - Parent is "completed" if ALL contributors are known and completed
    // - Otherwise (no known-incomplete contributor, but at least one
    //   contributor's completion status is unknown) this subprocess has no
    //   information to report, so the activity's completion status is left as-is.
    // @spec SN Book: RB.1.3 (Activity Progress Rollup Using Default: completed
    // if all children completed, incomplete if any child incomplete - unknown
    // does not count as either)
    // @spec SN Book: RB.1.4 (Rollup Rule Check: unknown does not evaluate True
    // for "any")
    // @spec SN Book: RB.1.4.2 (Check Child For Rollup Subprocess)
    let sawUnknownContributor = false;
    for (const child of contributors) {
      if (!this.childFilter.isChildCompletionStatusKnownForRollup(child)) {
        sawUnknownContributor = true;
        continue;
      }

      if (!this.childFilter.isChildCompletedForRollup(child)) {
        activity.completionStatus = CompletionStatus.INCOMPLETE;
        this.objectiveProcessor.syncPrimaryObjectiveFromActivity(activity);
        return;
      }
    }

    if (sawUnknownContributor) {
      return;
    }

    activity.completionStatus = CompletionStatus.COMPLETED;
    this.objectiveProcessor.syncPrimaryObjectiveFromActivity(activity);
  }

  /**
   * Activity Progress Rollup Using Measure
   * Determines completion status using attemptCompletionAmount threshold comparison
   * 4th Edition Addition: Measure-based completion determination
   *
   * @spec SN Book: RB.1.3.a (Activity Progress Rollup Using Measure)
   * @param activity - The activity to evaluate
   * @returns True if measure-based evaluation was applied, false otherwise
   */
  public activityProgressRollupUsingMeasure(activity: Activity): boolean {
    // Only apply if completedByMeasure is enabled
    if (!activity.completedByMeasure) {
      return false;
    }

    // Check if we have valid completion amount data
    if (!activity.attemptCompletionAmountStatus) {
      activity.completionStatus = CompletionStatus.UNKNOWN;
      this.objectiveProcessor.syncPrimaryObjectiveFromActivity(activity);
      return true;
    }

    // Compare completion amount against threshold
    if (activity.attemptCompletionAmount >= activity.minProgressMeasure) {
      activity.completionStatus = CompletionStatus.COMPLETED;
    } else {
      activity.completionStatus = CompletionStatus.INCOMPLETE;
    }

    this.objectiveProcessor.syncPrimaryObjectiveFromActivity(activity);
    return true;
  }
}
