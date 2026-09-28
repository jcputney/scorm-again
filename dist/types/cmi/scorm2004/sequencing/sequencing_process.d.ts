import { Activity } from "./activity.js";
import { ActivityTree } from "./activity_tree.js";
import { SequencingRules } from "./sequencing_rules.js";
import { SequencingControls } from "./sequencing_controls.js";
import { ADLNav } from "../adl.js";
import { ActivityTreeQueries } from "./utils/activity_tree_queries.js";
import { ChoiceConstraintValidator } from "./validators/choice_constraint_validator.js";
import { RuleEvaluationEngine } from "./rules/rule_evaluation_engine.js";
import type { PostConditionResult } from "./rules/rule_evaluation_engine.js";
import { FlowTraversalService } from "./traversal/flow_traversal_service.js";
import { SequencingRequestType, DeliveryRequestType, SequencingResult } from "./rules/sequencing_request_types.js";
export { SequencingRequestType, DeliveryRequestType, SequencingResult };
export type { PostConditionResult };
export interface SequencingProcessOptions {
    now?: () => Date;
    getAttemptElapsedSeconds?: (activity: Activity) => number;
    getActivityElapsedSeconds?: (activity: Activity) => number;
}
export declare class SequencingProcess {
    private activityTree;
    private treeQueries;
    private constraintValidator;
    private ruleEngine;
    private traversalService;
    private activityEvaluationCallback;
    private flowHandler;
    private choiceHandler;
    private exitHandler;
    private retryHandler;
    private _now;
    get now(): () => Date;
    set now(fn: () => Date);
    private _getAttemptElapsedSecondsHook;
    get getAttemptElapsedSecondsHook(): ((activity: Activity) => number) | undefined;
    set getAttemptElapsedSecondsHook(fn: ((activity: Activity) => number) | undefined);
    constructor(activityTree: ActivityTree, _sequencingRules?: SequencingRules | null, _sequencingControls?: SequencingControls | null, _adlNav?: ADLNav | null, options?: SequencingProcessOptions);
    sequencingRequestProcess(request: SequencingRequestType, targetActivityId?: string | null): SequencingResult;
    evaluatePostConditionRules(activity: Activity): PostConditionResult;
    canActivityBeDelivered(activity: Activity): boolean;
    validateNavigationRequest(request: SequencingRequestType, targetActivityId?: string | null, currentActivity?: Activity | null): {
        valid: boolean;
        exception: string | null;
    };
    getAvailableChoices(): Activity[];
    getTreeQueries(): ActivityTreeQueries;
    getConstraintValidator(): ChoiceConstraintValidator;
    getRuleEngine(): RuleEvaluationEngine;
    getTraversalService(): FlowTraversalService;
    setActivityEvaluationCallback(callback: (activity: Activity, target: Activity) => Activity): void;
    private applyTraversalCallbacks;
}
//# sourceMappingURL=sequencing_process.d.ts.map