import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { SequencingProcess, SequencingRequestType } from "../sequencing_process";
import { ADLNav } from "../../adl";
import { NavigationLookAhead, NavigationPredictions } from "../navigation_look_ahead";
import { HideLmsUiItem } from "../../../../types/sequencing_types";
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
export declare class NavigationValidityService {
    private activityTree;
    private sequencingProcess;
    private adlNav;
    private eventCallback;
    private navigationLookAhead;
    private getEffectiveHideLmsUiCallback;
    constructor(activityTree: ActivityTree, sequencingProcess: SequencingProcess, adlNav?: ADLNav | null, eventCallback?: ((eventType: string, data?: any) => void) | null);
    setGetEffectiveHideLmsUiCallback(callback: (activity: Activity | null) => HideLmsUiItem[]): void;
    getNavigationLookAhead(): NavigationLookAhead;
    validateRequest(request: NavigationRequestType, targetActivityId?: string | null): NavigationRequestResult;
    private validateStartRequest;
    private validateResumeRequest;
    private validateContinueRequest;
    private validatePreviousRequest;
    private validateChoiceRequest;
    private validateJumpRequest;
    private validateExitRequest;
    private validateExitAllRequest;
    private validateAbandonRequest;
    private validateAbandonAllRequest;
    private validateSuspendAllRequest;
    validateChoicePath(currentActivity: Activity | null, targetActivity: Activity): {
        valid: boolean;
        exception: string | null;
    };
    validateForwardOnlyConstraints(currentActivity: Activity): {
        valid: boolean;
        exception: string | null;
    };
    private validateConstrainChoice;
    private validateChoiceSet;
    isActivityDisabled(activity: Activity): boolean;
    findChildContaining(parent: Activity, target: Activity): Activity | null;
    activityContains(container: Activity, target: Activity): boolean;
    findCommonAncestor(activity1: Activity, activity2: Activity): Activity | null;
    private validateAncestors;
    private requiresNewActivation;
    private branchHasActiveAttempt;
    private isActivityMandatory;
    private isActivityCompleted;
    private evaluatePreConditionRulesForChoice;
    updateNavigationValidity(): void;
    getAllPredictions(): NavigationPredictions;
    predictContinueEnabled(): boolean;
    predictPreviousEnabled(): boolean;
    predictChoiceEnabled(activityId: string): boolean;
    getAvailableChoices(): string[];
    invalidateCache(): void;
    private fireEvent;
}
//# sourceMappingURL=navigation_validity_service.d.ts.map