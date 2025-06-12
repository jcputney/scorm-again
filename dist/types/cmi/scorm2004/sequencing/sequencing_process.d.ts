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
    constructor(activityTree: ActivityTree, sequencingRules: SequencingRules, sequencingControls: SequencingControls, adlNav?: ADLNav | null);
    sequencingRequestProcess(request: SequencingRequestType, targetActivityId?: string | null): SequencingResult;
    private startSequencingRequestProcess;
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
    private flowActivityTraversalSubprocess;
    private checkActivityProcess;
    private terminateDescendentAttemptsProcess;
    private isActivityInTree;
    private findCommonAncestor;
}
