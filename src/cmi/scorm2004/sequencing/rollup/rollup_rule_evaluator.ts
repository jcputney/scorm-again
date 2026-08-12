import { Activity } from "../activity";
import { RollupActionType, RollupConsiderationType, RollupRule } from "../rollup_rules";
import { RollupChildFilter } from "./rollup_child_filter";

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

  /**
   * Create a new RollupRuleEvaluator
   *
   * @param childFilter - RollupChildFilter instance for filtering children
   */
  constructor(childFilter: RollupChildFilter) {
    this.childFilter = childFilter;
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

    // Count children that meet the rule conditions
    // IMPORTANT: Only count children that BOTH pass consideration check AND condition check
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
        if (this.evaluateRollupConditionsSubprocess(child, rule)) {
          satisfiedCount++;
        }
      }
    }

    // Apply childActivitySet independently from the atLeast thresholds. RollupRule initializes
    // those numeric fields to zero, so treating their presence as the discriminator makes "any"
    // and "none" rules vacuously true even when no child matches.
    // @spec SCORM 2004 4th Ed. SN RB.1.4 and TR RU-02a / RU-02b
    switch (rule.consideration) {
      case RollupConsiderationType.ALL:
        return contributingChildren > 0 && satisfiedCount === contributingChildren;
      case RollupConsiderationType.ANY:
        return satisfiedCount > 0;
      case RollupConsiderationType.NONE:
        return contributingChildren > 0 && satisfiedCount === 0;
      case RollupConsiderationType.AT_LEAST_COUNT:
        return satisfiedCount >= rule.minimumCount;
      case RollupConsiderationType.AT_LEAST_PERCENT: {
        const percent =
          contributingChildren > 0 ? (satisfiedCount / contributingChildren) * 100 : 0;
        return contributingChildren > 0 && percent >= rule.minimumPercent;
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
    // If no conditions are specified, the rule always applies
    if (rule.conditions.length === 0) {
      return true;
    }

    // Rollup conditions default to an "all" combination. childActivitySet controls how matching
    // children are counted; it does not change how this individual child's conditions combine.
    // @spec SCORM 2004 4th Ed. SN RB.1.4.1
    return rule.conditions.every((condition) => condition.evaluate(child));
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
