import { SuccessStatus } from "../../../../constants/enums";
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

    // @spec IMS Simple Sequencing 1.0 RB.1.2: "measure-based computation, a
    // rule-based computation or an alternative default rule-based computation,
    // applied in that order"; SM.6 Objective Satisfied by Measure: "in place of
    // any other method". ADL SRTE SeqRollupRuleset.java ignores rule results
    // when the measure threshold has already decided the status.
    if (activity.primaryObjective?.satisfiedByMeasure) {
      const measureResult = this.objectiveRollupUsingMeasure(activity);
      if (measureResult === null) {
        activity.objectiveSatisfiedStatusKnown = false;
        activity.successStatus = SuccessStatus.UNKNOWN;
      } else {
        activity.objectiveSatisfiedStatus = measureResult;
      }
      this.syncPrimaryObjectiveFromActivity(activity);
      return;
    }

    const ruleResult = this.objectiveRollupUsingRules(activity, rollupRules.rules);
    if (ruleResult !== null) {
      activity.objectiveSatisfiedStatus = ruleResult;
      // Rule-based rollup determines satisfaction only, not measure status.
      this.syncPrimaryObjectiveFromActivity(activity);
    }

    // @spec SN Book: RB.1.2.b - once the activity defines any satisfied or
    // notSatisfied rollup rule, those rules alone determine satisfaction.
    // Default rollup is not a fallback when the defined rules do not fire;
    // in that case, the activity's satisfaction status is left unchanged.
    if (
      rollupRules.rules.some(
        (rule) =>
          rule.action === RollupActionType.SATISFIED ||
          rule.action === RollupActionType.NOT_SATISFIED,
      )
    ) {
      return;
    }

    // Finally, use default rollup (RB.1.2.c)
    // @spec SN Book: RB.1.4 (Rollup Rule Check) - an unknown default-rollup result
    // (null) means this subprocess has no information to contribute, so the
    // activity's existing satisfaction status must be left untouched, exactly
    // like the rules branch above.
    const defaultResult = this.objectiveRollupUsingDefault(activity);
    if (defaultResult !== null) {
      activity.objectiveSatisfiedStatus = defaultResult;
      // Do NOT set objectiveMeasureStatus here - default rollup doesn't involve measures
      // Per SCORM 2004 SN Book RB.1.2.c, only satisfaction status is determined by default rollup
      this.syncPrimaryObjectiveFromActivity(activity);
    }
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
    const primaryObjective = activity.primaryObjective;
    if (
      !primaryObjective?.satisfiedByMeasure ||
      !activity.objectiveMeasureStatus ||
      activity.scaledPassingScore === null
    ) {
      return null;
    }

    // @spec SN Book: RB.1.2.a step 3.1.2.1 - defer measure satisfaction while active.
    if (activity.isActive && !activity.rollupConsiderations.measureSatisfactionIfActive) {
      return null;
    }

    return activity.objectiveNormalizedMeasure >= activity.scaledPassingScore;
  }

  /**
   * Objective Rollup Using Default
   * For default rollup (no explicit rules), the "not satisfied" check uses the
   * children that pass requiredForNotSatisfied, and the "satisfied" check uses
   * the children that pass requiredForSatisfied.
   *
   * A contributing child's objective status may itself be unknown (e.g. it has
   * never been attempted in this parent attempt). Per RB.1.4 (Rollup Rule
   * Check), an unknown status must not evaluate True for either the "any not
   * satisfied" or the "all satisfied" check, so this returns `null` - "no
   * information" - rather than collapsing an unknown child into "not
   * satisfied".
   *
   * @spec SN Book: RB.1.2.c (Objective Rollup Using Default)
   * @spec SN Book: RB.1.4 (Rollup Rule Check: unknown does not evaluate True for
   * "any")
   * @spec SN Book: RB.1.4.2 (Check Child For Rollup Subprocess)
   * @param activity - The parent activity
   * @returns True if every child included for "satisfied" is known-satisfied,
   * otherwise false if any child included for "not satisfied" is
   * known-not-satisfied, otherwise null (no information to roll up)
   */
  public objectiveRollupUsingDefault(activity: Activity): boolean | null {
    const children = activity.getAvailableChildren();
    // @spec SN Book: RB.1.2.c / RB.1.4 - with no children at all, this
    // subprocess has no information to contribute.
    if (children.length === 0) {
      return null;
    }

    // @spec SN Book: RB.1.4.2 - filter children separately for each rollup action.
    const notSatisfiedChildren = this.childFilter.filterChildrenForRequirement(
      children,
      "objective",
      "notSatisfied",
    );
    const satisfiedChildren = this.childFilter.filterChildrenForRequirement(
      children,
      "objective",
      "satisfied",
    );

    // @spec SN Book: RB.1.4 step 1.2.4 - an empty bag cannot fire an action.
    if (notSatisfiedChildren.length === 0 && satisfiedChildren.length === 0) {
      return null;
    }

    let result: boolean | null = null;
    if (
      notSatisfiedChildren.some(
        (child) =>
          this.childFilter.isChildObjectiveStatusKnownForRollup(child) &&
          !this.childFilter.isChildSatisfiedForRollup(child),
      )
    ) {
      result = false;
    }

    // @spec SN Book: RB.1.2.b - satisfied overrides not satisfied when both fire.
    if (
      satisfiedChildren.length > 0 &&
      satisfiedChildren.every(
        (child) =>
          this.childFilter.isChildObjectiveStatusKnownForRollup(child) &&
          this.childFilter.isChildSatisfiedForRollup(child),
      )
    ) {
      result = true;
    }

    return result;
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
