import { Activity } from "../activity";
import { RollupActionType, RollupRule } from "../rollup_rules";
import { RollupChildFilter } from "./rollup_child_filter";
import { RollupRuleEvaluator } from "./rollup_rule_evaluator";

/**
 * Event callback function type
 */
export type EventCallback = (eventType: string, data?: unknown) => void;

/**
 * ObjectiveRollupProcessor - Handles objective satisfaction rollup operations
 * Implements SCORM 2004 RB.1.2 (Objective Rollup Process)
 *
 * This class is responsible for determining objective satisfaction status
 * for parent activities based on their children's states using rules,
 * measure-based evaluation, or default rollup logic.
 *
 * @spec SN Book: RB.1.2 (Objective Rollup Process)
 * @spec SN Book: RB.1.2.a (Objective Rollup Using Measure)
 * @spec SN Book: RB.1.2.b (Objective Rollup Using Rules)
 * @spec SN Book: RB.1.2.c (Objective Rollup Using Default)
 */
export class ObjectiveRollupProcessor {
  private childFilter: RollupChildFilter;
  private ruleEvaluator: RollupRuleEvaluator;
  private eventCallback: EventCallback | null;

  /**
   * Create a new ObjectiveRollupProcessor
   *
   * @param childFilter - RollupChildFilter instance for filtering children
   * @param ruleEvaluator - RollupRuleEvaluator instance for evaluating rules
   * @param eventCallback - Optional callback for firing events
   */
  constructor(
    childFilter: RollupChildFilter,
    ruleEvaluator: RollupRuleEvaluator,
    eventCallback?: EventCallback,
  ) {
    this.childFilter = childFilter;
    this.ruleEvaluator = ruleEvaluator;
    this.eventCallback = eventCallback || null;
  }

  /**
   * Objective Rollup Process
   * Determines objective satisfaction status using rules, measure, or default
   *
   * @spec SN Book: RB.1.2 (Objective Rollup Process)
   * @param activity - The parent activity
   */
  public objectiveRollupProcess(activity: Activity): void {
    const rollupRules = activity.rollupRules;

    // First, try rollup using rules (RB.1.2.b)
    const ruleResult = this.objectiveRollupUsingRules(activity, rollupRules.rules);
    if (ruleResult !== null) {
      activity.objectiveSatisfiedStatus = ruleResult;
      // Do NOT set objectiveMeasureStatus here - rule-based rollup doesn't involve measures
      // Per SCORM 2004 SN Book RB.1.2.b, only satisfaction status is determined by rules
      this.syncPrimaryObjectiveFromActivity(activity);
      return;
    }

    // Then, try rollup using measure (RB.1.2.a)
    const measureResult = this.objectiveRollupUsingMeasure(activity);
    if (measureResult !== null) {
      activity.objectiveSatisfiedStatus = measureResult;
      // measureStatus is already true from measureRollupProcess (which ran first)
      this.syncPrimaryObjectiveFromActivity(activity);
      return;
    }

    // Finally, use default rollup (RB.1.2.c)
    activity.objectiveSatisfiedStatus = this.objectiveRollupUsingDefault(activity);
    // Do NOT set objectiveMeasureStatus here - default rollup doesn't involve measures
    // Per SCORM 2004 SN Book RB.1.2.c, only satisfaction status is determined by default rollup
    this.syncPrimaryObjectiveFromActivity(activity);
  }

  /**
   * Objective Rollup Using Rules
   * Evaluates rollup rules to determine objective satisfaction
   *
   * @spec SN Book: RB.1.2.b (Objective Rollup Using Rules)
   * @param activity - The parent activity
   * @param rules - The rollup rules to evaluate
   * @returns True if satisfied, false if not, null if no rule applies
   */
  public objectiveRollupUsingRules(activity: Activity, rules: RollupRule[]): boolean | null {
    // Get satisfied and not satisfied rules
    const satisfiedRules = rules.filter((rule) => rule.action === RollupActionType.SATISFIED);

    const notSatisfiedRules = rules.filter(
      (rule) => rule.action === RollupActionType.NOT_SATISFIED,
    );

    // Evaluate satisfied rules first
    for (const rule of satisfiedRules) {
      if (this.ruleEvaluator.evaluateRollupRule(activity, rule)) {
        return true;
      }
    }

    // Then evaluate not satisfied rules
    for (const rule of notSatisfiedRules) {
      if (this.ruleEvaluator.evaluateRollupRule(activity, rule)) {
        return false;
      }
    }

    return null;
  }

  /**
   * Objective Rollup Using Measure
   * Determines satisfaction based on objective measure vs passing score
   *
   * @spec SN Book: RB.1.2.a (Objective Rollup Using Measure)
   * @param activity - The parent activity
   * @returns True if satisfied, false if not, null if no measure
   */
  public objectiveRollupUsingMeasure(activity: Activity): boolean | null {
    if (!activity.objectiveMeasureStatus || activity.scaledPassingScore === null) {
      return null;
    }

    return activity.objectiveNormalizedMeasure >= activity.scaledPassingScore;
  }

  /**
   * Objective Rollup Using Default
   * For default rollup (no explicit rules), a child is included only if it
   * passes BOTH requiredForSatisfied AND requiredForNotSatisfied considerations.
   * This ensures symmetric exclusion: setting either consideration excludes
   * the child from the entire objective rollup evaluation.
   *
   * @spec SN Book: RB.1.2.c (Objective Rollup Using Default)
   * @param activity - The parent activity
   * @returns True if all tracked children are satisfied
   */
  public objectiveRollupUsingDefault(activity: Activity): boolean {
    const children = activity.getAvailableChildren();
    if (children.length === 0) {
      return false;
    }

    const considerations = activity.rollupConsiderations;

    // For default rollup, use INTERSECTION of both consideration filters.
    // A child must pass BOTH requiredForSatisfied AND requiredForNotSatisfied
    // to contribute to the rollup. This ensures that setting either
    // consideration (e.g., ifNotSuspended, ifNotSkipped) excludes the child
    // from the entire default objective rollup evaluation.
    const contributors = children.filter((child) => {
      // Check both consideration filters
      if (
        !this.childFilter.checkChildForRollupSubprocess(child, "objective", "satisfied") ||
        !this.childFilter.checkChildForRollupSubprocess(child, "objective", "notSatisfied")
      ) {
        return false;
      }

      // Check parent-level measureSatisfactionIfActive setting
      if (
        !considerations.measureSatisfactionIfActive &&
        (child.activityAttemptActive || child.isActive)
      ) {
        return false;
      }

      return true;
    });

    if (contributors.length === 0) {
      return false;
    }

    // Default rollup logic:
    // - Parent is "not satisfied" if ANY contributor is not satisfied
    // - Parent is "satisfied" if ALL contributors are satisfied
    if (contributors.some((child) => !this.childFilter.isChildSatisfiedForRollup(child))) {
      return false;
    }

    return contributors.every((child) => this.childFilter.isChildSatisfiedForRollup(child));
  }

  /**
   * Sync primary objective status from activity properties
   * Ensures the primary objective reflects the activity's rollup-derived status
   *
   * Note: This method is intentionally public as it is used by other rollup
   * processors (e.g., ProgressRollupProcessor) to synchronize primary objective
   * state after modifying activity completion status.
   *
   * @param activity - The activity to sync
   */
  public syncPrimaryObjectiveFromActivity(activity: Activity): void {
    if (activity.primaryObjective) {
      activity.primaryObjective.satisfiedStatus = activity.objectiveSatisfiedStatus;
      activity.primaryObjective.satisfiedStatusKnown = activity.objectiveSatisfiedStatusKnown;
      activity.primaryObjective.measureStatus = activity.objectiveMeasureStatus;
      activity.primaryObjective.normalizedMeasure = activity.objectiveNormalizedMeasure;
      activity.primaryObjective.progressMeasure = activity.progressMeasure;
      activity.primaryObjective.progressMeasureStatus = activity.progressMeasureStatus;
      activity.primaryObjective.completionStatus = activity.completionStatus;
    }
  }
}
