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

    // Apply minimum count/percent logic OR consideration type
    if (rule.consideration === RollupConsiderationType.ALL) {
      // For ALL consideration, all contributing children must satisfy
      return contributingChildren > 0 && satisfiedCount === contributingChildren;
    } else if (rule.minimumCount !== null) {
      return satisfiedCount >= rule.minimumCount;
    } else if (rule.minimumPercent !== null) {
      const percent = contributingChildren > 0 ? satisfiedCount / contributingChildren : 0;
      return percent >= rule.minimumPercent;
    }

    // Default: all contributing children must satisfy
    return contributingChildren > 0 && satisfiedCount === contributingChildren;
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

    // Evaluate based on the rule's consideration type
    switch (rule.consideration) {
      case RollupConsiderationType.ALL:
        // All conditions must be met
        return rule.conditions.every((condition) => condition.evaluate(child));

      case RollupConsiderationType.ANY:
        // At least one condition must be met
        return rule.conditions.some((condition) => condition.evaluate(child));

      case RollupConsiderationType.NONE:
        // No conditions should be met
        return !rule.conditions.some((condition) => condition.evaluate(child));

      case RollupConsiderationType.AT_LEAST_COUNT:
      case RollupConsiderationType.AT_LEAST_PERCENT:
        // These are handled at the rule level, not condition level
        // For individual condition evaluation, treat as ALL
        return rule.conditions.every((condition) => condition.evaluate(child));

      default:
        // Unknown consideration type, default to false
        return false;
    }
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
