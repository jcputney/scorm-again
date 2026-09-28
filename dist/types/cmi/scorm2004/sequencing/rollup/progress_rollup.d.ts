import { Activity } from "../activity.js";
import { RollupChildFilter } from "./rollup_child_filter.js";
import { RollupRuleEvaluator } from "./rollup_rule_evaluator.js";
import { ObjectiveRollupProcessor } from "./objective_rollup.js";
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