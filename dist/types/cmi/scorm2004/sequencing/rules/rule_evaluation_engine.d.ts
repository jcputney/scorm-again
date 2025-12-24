import { Activity } from "../activity";
import { SequencingRule, RuleActionType } from "../sequencing_rules";
import { SequencingRequestType } from "./sequencing_request_types";
export { SequencingRequestType };
export interface PostConditionResult {
    sequencingRequest: SequencingRequestType | null;
    terminationRequest: SequencingRequestType | null;
}
export interface RuleEvaluationOptions {
    now?: (() => Date) | undefined;
    getAttemptElapsedSecondsHook?: ((activity: Activity) => number) | undefined;
}
export declare class RuleEvaluationEngine {
    private now;
    private getAttemptElapsedSecondsHook;
    constructor(options?: RuleEvaluationOptions);
    checkSequencingRules(activity: Activity, rules: SequencingRule[]): RuleActionType | null;
    checkRuleSubprocess(activity: Activity, rule: SequencingRule): boolean;
    evaluateExitRules(activity: Activity): RuleActionType | null;
    evaluatePostConditionAction(activity: Activity): RuleActionType | null;
    evaluatePostConditions(activity: Activity): PostConditionResult;
    checkLimitConditions(activity: Activity): boolean;
    parseDuration(duration: string): number;
    getElapsedSeconds(activity: Activity): number;
    isTimeLimitExceeded(activity: Activity): boolean;
    isOutsideAvailableTimeRange(activity: Activity): boolean;
    canDeliverActivity(activity: Activity): {
        canDeliver: boolean;
        wasSkipped: boolean;
    };
}
//# sourceMappingURL=rule_evaluation_engine.d.ts.map