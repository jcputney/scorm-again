import { Activity } from "../activity";
import { RollupRule } from "../rollup_rules";
import { RollupChildFilter } from "./rollup_child_filter";
import { RollupRuleEvaluator } from "./rollup_rule_evaluator";
export type EventCallback = (eventType: string, data?: unknown) => void;
export declare class ObjectiveRollupProcessor {
    private childFilter;
    private ruleEvaluator;
    private eventCallback;
    constructor(childFilter: RollupChildFilter, ruleEvaluator: RollupRuleEvaluator, eventCallback?: EventCallback);
    objectiveRollupProcess(activity: Activity): void;
    objectiveRollupUsingRules(activity: Activity, rules: RollupRule[]): boolean | null;
    objectiveRollupUsingMeasure(activity: Activity): boolean | null;
    objectiveRollupUsingDefault(activity: Activity): boolean;
    syncPrimaryObjectiveFromActivity(activity: Activity): void;
}
//# sourceMappingURL=objective_rollup.d.ts.map