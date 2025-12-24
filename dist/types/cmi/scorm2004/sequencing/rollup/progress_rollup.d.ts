import { Activity } from "../activity";
import { RollupChildFilter } from "./rollup_child_filter";
import { RollupRuleEvaluator } from "./rollup_rule_evaluator";
import { ObjectiveRollupProcessor } from "./objective_rollup";
export type EventCallback = (eventType: string, data?: unknown) => void;
export declare class ProgressRollupProcessor {
    private childFilter;
    private ruleEvaluator;
    private objectiveProcessor;
    private eventCallback;
    constructor(childFilter: RollupChildFilter, ruleEvaluator: RollupRuleEvaluator, objectiveProcessor: ObjectiveRollupProcessor, eventCallback?: EventCallback);
    activityProgressRollupProcess(activity: Activity): void;
    activityProgressRollupUsingMeasure(activity: Activity): boolean;
}
//# sourceMappingURL=progress_rollup.d.ts.map