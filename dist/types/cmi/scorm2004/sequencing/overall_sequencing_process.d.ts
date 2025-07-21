import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingProcess, SequencingRequestType } from "./sequencing_process";
import { RollupProcess } from "./rollup_process";
import { ADLNav } from "../adl";
export declare enum NavigationRequestType {
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
    NOT_VALID = "_none_"
}
export declare class NavigationRequestResult {
    valid: boolean;
    terminationRequest: SequencingRequestType | null;
    sequencingRequest: SequencingRequestType | null;
    targetActivityId: string | null;
    exception: string | null;
    constructor(valid?: boolean, terminationRequest?: SequencingRequestType | null, sequencingRequest?: SequencingRequestType | null, targetActivityId?: string | null, exception?: string | null);
}
export declare class DeliveryRequest {
    valid: boolean;
    targetActivity: Activity | null;
    exception: string | null;
    constructor(valid?: boolean, targetActivity?: Activity | null, exception?: string | null);
}
export declare class OverallSequencingProcess {
    private activityTree;
    private sequencingProcess;
    private rollupProcess;
    private adlNav;
    private contentDelivered;
    constructor(activityTree: ActivityTree, sequencingProcess: SequencingProcess, rollupProcess: RollupProcess, adlNav?: ADLNav | null);
    processNavigationRequest(navigationRequest: NavigationRequestType, targetActivityId?: string | null): DeliveryRequest;
    private navigationRequestProcess;
    private terminationRequestProcess;
    private deliveryRequestProcess;
    private contentDeliveryEnvironmentProcess;
    private clearSuspendedActivitySubprocess;
    private endAttemptProcess;
    private updateNavigationValidity;
    private findCommonAncestor;
    hasContentBeenDelivered(): boolean;
    resetContentDelivered(): void;
    private exitActionRulesSubprocess;
    private terminateAllActivities;
    private terminateDescendentAttemptsProcess;
}
//# sourceMappingURL=overall_sequencing_process.d.ts.map