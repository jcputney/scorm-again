import { BaseCMI } from "../../common/base_cmi";
import { Activity } from "./activity";
export declare enum RuleConditionOperator {
    NOT = "not",
    AND = "and",
    OR = "or"
}
export declare enum RuleConditionType {
    SATISFIED = "satisfied",
    OBJECTIVE_STATUS_KNOWN = "objectiveStatusKnown",
    OBJECTIVE_MEASURE_KNOWN = "objectiveMeasureKnown",
    OBJECTIVE_MEASURE_GREATER_THAN = "objectiveMeasureGreaterThan",
    OBJECTIVE_MEASURE_LESS_THAN = "objectiveMeasureLessThan",
    COMPLETED = "completed",
    PROGRESS_KNOWN = "progressKnown",
    ATTEMPTED = "attempted",
    ATTEMPT_LIMIT_EXCEEDED = "attemptLimitExceeded",
    TIME_LIMIT_EXCEEDED = "timeLimitExceeded",
    OUTSIDE_AVAILABLE_TIME_RANGE = "outsideAvailableTimeRange",
    ALWAYS = "always"
}
export declare enum RuleActionType {
    SKIP = "skip",
    DISABLED = "disabled",
    HIDE_FROM_CHOICE = "hideFromChoice",
    STOP_FORWARD_TRAVERSAL = "stopForwardTraversal",
    EXIT_PARENT = "exitParent",
    EXIT_ALL = "exitAll",
    RETRY = "retry",
    RETRY_ALL = "retryAll",
    CONTINUE = "continue",
    PREVIOUS = "previous",
    EXIT = "exit"
}
export declare class RuleCondition extends BaseCMI {
    private _condition;
    private _operator;
    private _parameters;
    constructor(condition?: RuleConditionType, operator?: RuleConditionOperator | null, parameters?: Map<string, any>);
    reset(): void;
    get condition(): RuleConditionType;
    set condition(condition: RuleConditionType);
    get operator(): RuleConditionOperator | null;
    set operator(operator: RuleConditionOperator | null);
    get parameters(): Map<string, any>;
    set parameters(parameters: Map<string, any>);
    evaluate(activity: Activity): boolean;
    private evaluateTimeLimitExceeded;
    private evaluateOutsideAvailableTimeRange;
    private parseISO8601Duration;
    toJSON(): object;
}
export declare class SequencingRule extends BaseCMI {
    private _conditions;
    private _action;
    private _conditionCombination;
    constructor(action?: RuleActionType, conditionCombination?: string | RuleConditionOperator);
    reset(): void;
    get conditions(): RuleCondition[];
    addCondition(condition: RuleCondition): void;
    removeCondition(condition: RuleCondition): boolean;
    get action(): RuleActionType;
    set action(action: RuleActionType);
    get conditionCombination(): string | RuleConditionOperator;
    set conditionCombination(conditionCombination: string | RuleConditionOperator);
    evaluate(activity: Activity): boolean;
    toJSON(): object;
}
export declare class SequencingRules extends BaseCMI {
    private _preConditionRules;
    private _exitConditionRules;
    private _postConditionRules;
    constructor();
    reset(): void;
    get preConditionRules(): SequencingRule[];
    addPreConditionRule(rule: SequencingRule): void;
    get exitConditionRules(): SequencingRule[];
    addExitConditionRule(rule: SequencingRule): void;
    get postConditionRules(): SequencingRule[];
    addPostConditionRule(rule: SequencingRule): void;
    evaluatePreConditionRules(activity: Activity): RuleActionType | null;
    evaluateExitConditionRules(activity: Activity): RuleActionType | null;
    evaluatePostConditionRules(activity: Activity): RuleActionType | null;
    toJSON(): object;
}
