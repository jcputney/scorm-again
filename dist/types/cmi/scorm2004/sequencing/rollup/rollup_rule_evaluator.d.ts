import { Activity } from "../activity";
import { RollupActionType, RollupRule } from "../rollup_rules";
import { RollupChildFilter } from "./rollup_child_filter";
export declare class RollupRuleEvaluator {
    private childFilter;
    constructor(childFilter: RollupChildFilter);
    evaluateRollupRule(activity: Activity, rule: RollupRule): boolean;
    evaluateRollupConditionsSubprocess(child: Activity, rule: RollupRule): boolean;
    evaluateRulesForAction(activity: Activity, rules: RollupRule[], actionType: RollupActionType): boolean | null;
}
//# sourceMappingURL=rollup_rule_evaluator.d.ts.map