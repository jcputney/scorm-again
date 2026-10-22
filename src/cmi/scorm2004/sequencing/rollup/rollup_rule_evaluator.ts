import { Activity } from "../activity";
import {
  normalizeMinimumPercent,
  RollupActionType,
  RollupConditionCombination,
  RollupConsiderationType,
  RollupRule,
} from "../rollup_rules";
import { RollupChildFilter } from "./rollup_child_filter";
import { AttemptElapsedSecondsHook } from "../time_conditions";
import { RuleConditionEvaluation, kleeneAnd, kleeneOr } from "../sequencing_rules";

/**
 * The clock time-based rollup conditions are evaluated with
 * (timeLimitExceeded, outsideAvailableTimeRange).
 */
export interface RollupClockOptions {
  /** The evaluating process's clock; defaults to the system clock. */
  now?: (() => Date) | undefined;
  /** Reports elapsed attempt seconds; see the `getAttemptElapsedSeconds` setting. */
  getAttemptElapsedSeconds?: AttemptElapsedSecondsHook | undefined;
}

/**
 * RollupRuleEvaluator - Handles evaluation of rollup rules
 * Implements SCORM 2004 RB.1.4 (Rollup Rule Check) and RB.1.4.1 (Evaluate Rollup Conditions Subprocess)
 *
 * This class is responsible for evaluating rollup rules against child activities
 * and determining if rule conditions are met.
 *
 * @spec SN Book: RB.1.4 (Rollup Rule Check)
 * @spec SN Book: RB.1.4.1 (Evaluate Rollup Conditions Subprocess)
 */
export class RollupRuleEvaluator {
  private childFilter: RollupChildFilter;
  private now: () => Date;
  private getAttemptElapsedSeconds: AttemptElapsedSecondsHook | null;

  /**
   * Create a new RollupRuleEvaluator
   *
   * @param childFilter - RollupChildFilter instance for filtering children
   * @param clock - Clock for time-based rollup conditions
   */
  constructor(childFilter: RollupChildFilter, clock: RollupClockOptions = {}) {
    this.childFilter = childFilter;
    this.now = clock.now || (() => new Date());
    this.getAttemptElapsedSeconds = clock.getAttemptElapsedSeconds || null;
  }

  /**
   * Evaluate a rollup rule
   * Determines if a rollup rule applies to an activity based on its children
   *
   * @spec SN Book: RB.1.4 (Rollup Rule Check)
   * @param activity - The parent activity
   * @param rule - The rule to evaluate
   * @returns True if the rule applies
   */
  public evaluateRollupRule(activity: Activity, rule: RollupRule): boolean {
    const children = activity.getAvailableChildren();
    let contributingChildren = 0;
    let satisfiedCount = 0;
    let unknownCount = 0;

    // Count true and unknown results among included children.
    for (const child of children) {
      // Step 1: Check if child is included based on consideration settings (RB.1.4.2)
      let isIncluded = false;
      switch (rule.action) {
        case RollupActionType.SATISFIED:
          isIncluded = this.childFilter.checkChildForRollupSubprocess(
            child,
            "objective",
            "satisfied",
          );
          break;
        case RollupActionType.NOT_SATISFIED:
          isIncluded = this.childFilter.checkChildForRollupSubprocess(
            child,
            "objective",
            "notSatisfied",
          );
          break;
        case RollupActionType.COMPLETED:
          isIncluded = this.childFilter.checkChildForRollupSubprocess(
            child,
            "progress",
            "completed",
          );
          break;
        case RollupActionType.INCOMPLETE:
          isIncluded = this.childFilter.checkChildForRollupSubprocess(
            child,
            "progress",
            "incomplete",
          );
          break;
      }

      // Step 2: Only count if child is included by consideration settings
      if (isIncluded) {
        contributingChildren++;

        // Step 3: Evaluate rule conditions for this child using RB.1.4.1
        const result = this.evaluateRollupConditionsThreeValued(child, rule);
        if (result === true) {
          satisfiedCount++;
        } else if (result === "unknown") {
          unknownCount++;
        }
      }
    }

    // Apply childActivitySet independently from the atLeast thresholds. RollupRule initializes
    // those numeric fields to zero, so treating their presence as the discriminator makes "any"
    // and "none" rules vacuously true even when no child matches.
    // @spec SCORM 2004 4th Ed. SN RB.1.4 and TR RU-02a / RU-02b
    // Preserve empty included-set behavior; the ADL fork differs here.
    switch (rule.consideration) {
      case RollupConsiderationType.ALL:
        return contributingChildren > 0 && satisfiedCount === contributingChildren;
      case RollupConsiderationType.ANY:
        return satisfiedCount > 0;
      case RollupConsiderationType.NONE:
        return contributingChildren > 0 && satisfiedCount === 0 && unknownCount === 0;
      case RollupConsiderationType.AT_LEAST_COUNT:
        return (
          (contributingChildren === 0 || unknownCount < contributingChildren) &&
          satisfiedCount >= rule.minimumCount
        );
      case RollupConsiderationType.AT_LEAST_PERCENT: {
        const fraction = contributingChildren > 0 ? satisfiedCount / contributingChildren : 0;
        return (
          contributingChildren > 0 &&
          unknownCount < contributingChildren &&
          fraction >= normalizeMinimumPercent(rule.minimumPercent)
        );
      }
      default:
        return false;
    }
  }

  /**
   * Evaluate Rollup Conditions Subprocess
   * Evaluates if rollup rule conditions are met for a given activity
   *
   * @spec SN Book: RB.1.4.1 (Evaluate Rollup Conditions Subprocess)
   * @param child - The child activity to evaluate
   * @param rule - The rollup rule containing conditions to evaluate
   * @returns True if all conditions are met, false otherwise
   */
  public evaluateRollupConditionsSubprocess(child: Activity, rule: RollupRule): boolean {
    return this.evaluateRollupConditionsThreeValued(child, rule) === true;
  }

  /**
   * Combine conditions while preserving missing tracking information.
   * @spec SCORM 2004 4th Ed. SN RB.1.4.1
   */
  public evaluateRollupConditionsThreeValued(
    child: Activity,
    rule: RollupRule,
  ): RuleConditionEvaluation {
    if (rule.conditions.length === 0) {
      return true;
    }

    const results = rule.conditions.map((condition) =>
      condition.evaluateThreeValued(child, this.now, this.getAttemptElapsedSeconds),
    );
    return rule.conditionCombination === RollupConditionCombination.ALL
      ? kleeneAnd(results)
      : kleeneOr(results);
  }

  /**
   * Evaluate rules for a specific action type
   * Finds and evaluates all rules matching the specified action
   *
   * @param activity - The parent activity
   * @param rules - Array of rollup rules to evaluate
   * @param actionType - The action type to filter by
   * @returns True if any matching rule applies, false if none apply, null if no matching rules
   */
  public evaluateRulesForAction(
    activity: Activity,
    rules: RollupRule[],
    actionType: RollupActionType,
  ): boolean | null {
    const matchingRules = rules.filter((rule) => rule.action === actionType);

    if (matchingRules.length === 0) {
      return null;
    }

    for (const rule of matchingRules) {
      if (this.evaluateRollupRule(activity, rule)) {
        return true;
      }
    }

    return false;
  }
}
