import { Activity } from "../activity.js";
import { RollupActionType, RollupRule } from "../rollup_rules.js";
import { RollupChildFilter } from "./rollup_child_filter.js";
export declare class RollupRuleEvaluator {
    private childFilter;
    constructor(childFilter: RollupChildFilter);
    evaluateRollupRule(activity: Activity, rule: RollupRule): boolean;
    evaluateRollupConditionsSubprocess(child: Activity, rule: RollupRule): boolean;
    evaluateRulesForAction(activity: Activity, rules: RollupRule[], actionType: RollupActionType): boolean | null;
}
//# sourceMappingURL=rollup_rule_evaluator.d.ts.map