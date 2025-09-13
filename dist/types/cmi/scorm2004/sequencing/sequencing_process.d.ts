import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingRules } from "./sequencing_rules";
import { SequencingControls } from "./sequencing_controls";
import { ADLNav } from "../adl";
export declare enum SequencingRequestType {
    START = "start",
    RESUME_ALL = "resumeAll",
    CONTINUE = "continue",
    PREVIOUS = "previous",
    CHOICE = "choice",
    JUMP = "jump",
    EXIT = "exit",
    EXIT_ALL = "exitAll",
    ABANDON = "abandon",
    ABANDON_ALL = "abandonAll",
    SUSPEND_ALL = "suspendAll",
    RETRY = "retry",
    RETRY_ALL = "retryAll"
}
export declare enum DeliveryRequestType {
    DELIVER = "deliver",
    DO_NOT_DELIVER = "doNotDeliver"
}
export declare class SequencingResult {
    deliveryRequest: DeliveryRequestType;
    targetActivity: Activity | null;
    exception: string | null;
    constructor(deliveryRequest?: DeliveryRequestType, targetActivity?: Activity | null, exception?: string | null);
}
export declare class SequencingProcess {
    private activityTree;
    private sequencingRules;
    private sequencingControls;
    private adlNav;
    private now;
    private getAttemptElapsedSecondsHook;
    private getActivityElapsedSecondsHook;
    constructor(activityTree: ActivityTree, sequencingRules?: SequencingRules | null, sequencingControls?: SequencingControls | null, adlNav?: ADLNav | null, options?: {
        now?: () => Date;
        getAttemptElapsedSeconds?: (activity: Activity) => number;
        getActivityElapsedSeconds?: (activity: Activity) => number;
    });
    sequencingRequestProcess(request: SequencingRequestType, targetActivityId?: string | null): SequencingResult;
    private startSequencingRequestProcess;
    private findFirstDeliverableActivity;
    private resumeAllSequencingRequestProcess;
    private continueSequencingRequestProcess;
    private previousSequencingRequestProcess;
    private choiceSequencingRequestProcess;
    private jumpSequencingRequestProcess;
    private exitSequencingRequestProcess;
    private exitAllSequencingRequestProcess;
    private abandonSequencingRequestProcess;
    private abandonAllSequencingRequestProcess;
    private suspendAllSequencingRequestProcess;
    private retrySequencingRequestProcess;
    private retryAllSequencingRequestProcess;
    private ensureSelectionAndRandomization;
    private flowActivityTraversalSubprocess;
    private checkActivityProcess;
    private terminateDescendentAttemptsProcess;
    private exitActionRulesSubprocess;
    private processDeferredExitAction;
    private postConditionRulesSubprocess;
    private validateSequencingRequest;
    private validateRequestSpecificConstraints;
    private limitConditionsCheckProcess;
    private parseISO8601Duration;
    private sequencingRulesCheckProcess;
    private sequencingRulesCheckSubprocess;
    private isActivityInTree;
    private findCommonAncestor;
    private flowSubprocess;
    private flowTreeTraversalSubprocess;
    private choiceFlowSubprocess;
    private choiceFlowTreeTraversalSubprocess;
    private enhancedChoiceActivityTraversalSubprocess;
    private choiceActivityTraversalSubprocess;
    evaluatePostConditionRules(activity: Activity): SequencingRequestType | null;
    private validateChoiceFlowConstraints;
    private meetsChoiceFlowConstraints;
    private validateChoiceTraversalConstraints;
    private validateConstrainedChoiceBoundaries;
    private validateConstrainChoiceForFlow;
    private evaluateConstrainChoiceForTraversal;
    private evaluateForwardOnlyForChoice;
    private checkConstrainedChoiceBoundary;
    private getCurrentActivity;
    private isActivityAvailableForChoice;
    private isActivityMandatory;
    private isActivityCompleted;
    private validateActivityChoiceState;
    private hasBackwardChoiceException;
    private hasChoiceBoundaryViolation;
    private evaluateRuleConditions;
    private getAttemptElapsedSeconds;
}
//# sourceMappingURL=sequencing_process.d.ts.map