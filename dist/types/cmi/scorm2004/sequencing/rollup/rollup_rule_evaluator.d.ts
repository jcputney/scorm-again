import { Activity } from "../activity.js";
import { RollupActionType, RollupRule } from "../rollup_rules.js";
import { RollupChildFilter } from "./rollup_child_filter.js";
import { AttemptElapsedSecondsHook } from "../time_conditions.js";
import { RuleConditionEvaluation } from "../sequencing_rules.js";
export interface RollupClockOptions {
    now?: (() => Date) | undefined;
    getAttemptElapsedSeconds?: AttemptElapsedSecondsHook | undefined;
}
export declare class RollupRuleEvaluator {
    private childFilter;
    private now;
    private getAttemptElapsedSeconds;
    constructor(childFilter: RollupChildFilter, clock?: RollupClockOptions);
    evaluateRollupRule(activity: Activity, rule: RollupRule): boolean;
    evaluateRollupConditionsSubprocess(child: Activity, rule: RollupRule): boolean;
    evaluateRollupConditionsThreeValued(child: Activity, rule: RollupRule): RuleConditionEvaluation;
    evaluateRulesForAction(activity: Activity, rules: RollupRule[], actionType: RollupActionType): boolean | null;
}
//# sourceMappingURL=rollup_rule_evaluator.d.ts.map