import { BaseCMI } from "../../common/base_cmi";
import { Activity } from "./activity";
export declare enum RollupActionType {
    SATISFIED = "satisfied",
    NOT_SATISFIED = "notSatisfied",
    COMPLETED = "completed",
    INCOMPLETE = "incomplete"
}
export declare enum RollupConditionType {
    SATISFIED = "satisfied",
    OBJECTIVE_STATUS_KNOWN = "objectiveStatusKnown",
    OBJECTIVE_MEASURE_KNOWN = "objectiveMeasureKnown",
    OBJECTIVE_MEASURE_GREATER_THAN = "objectiveMeasureGreaterThan",
    OBJECTIVE_MEASURE_LESS_THAN = "objectiveMeasureLessThan",
    COMPLETED = "completed",
    PROGRESS_KNOWN = "progressKnown",
    ATTEMPTED = "attempted",
    NOT_ATTEMPTED = "notAttempted",
    ALWAYS = "always"
}
export declare enum RollupConsiderationType {
    ALL = "all",
    ANY = "any",
    NONE = "none",
    AT_LEAST_COUNT = "atLeastCount",
    AT_LEAST_PERCENT = "atLeastPercent"
}
export declare class RollupCondition extends BaseCMI {
    private _condition;
    private _parameters;
    constructor(condition?: RollupConditionType, parameters?: Map<string, any>);
    reset(): void;
    get condition(): RollupConditionType;
    set condition(condition: RollupConditionType);
    get parameters(): Map<string, any>;
    set parameters(parameters: Map<string, any>);
    evaluate(activity: Activity): boolean;
    toJSON(): object;
}
export declare class RollupRule extends BaseCMI {
    private _conditions;
    private _action;
    private _consideration;
    private _minimumCount;
    private _minimumPercent;
    constructor(action?: RollupActionType, consideration?: RollupConsiderationType, minimumCount?: number, minimumPercent?: number);
    reset(): void;
    get conditions(): RollupCondition[];
    addCondition(condition: RollupCondition): void;
    removeCondition(condition: RollupCondition): boolean;
    get action(): RollupActionType;
    set action(action: RollupActionType);
    get consideration(): RollupConsiderationType;
    set consideration(consideration: RollupConsiderationType);
    get minimumCount(): number;
    set minimumCount(minimumCount: number);
    get minimumPercent(): number;
    set minimumPercent(minimumPercent: number);
    evaluate(children: Activity[]): boolean;
    toJSON(): object;
}
export declare class RollupRules extends BaseCMI {
    private _rules;
    constructor();
    reset(): void;
    get rules(): RollupRule[];
    addRule(rule: RollupRule): void;
    removeRule(rule: RollupRule): boolean;
    processRollup(activity: Activity): void;
    private _defaultCompletionRollup;
    private _objectiveRollupUsingMeasure;
    private _defaultSuccessRollup;
    toJSON(): object;
}
