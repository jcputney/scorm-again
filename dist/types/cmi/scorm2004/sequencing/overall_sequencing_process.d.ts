import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingProcess, SequencingRequestType } from "./sequencing_process";
import { RollupProcess } from "./rollup_process";
import { ADLNav } from "../adl";
import { AuxiliaryResource, HideLmsUiItem } from "../../../types/sequencing_types";
import { NavigationPredictions } from "./navigation_look_ahead";
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
export interface TerminationRequestResult {
    terminationRequest: SequencingRequestType;
    sequencingRequest: SequencingRequestType | null;
    exception: string | null;
    valid: boolean;
}
export interface CMIDataForTransfer {
    completion_status?: string;
    success_status?: string;
    score?: {
        scaled?: string;
        raw?: string;
        min?: string;
        max?: string;
    };
    progress_measure?: string;
    objectives?: Array<{
        id: string;
        success_status?: string;
        completion_status?: string;
        score?: {
            scaled?: string;
            raw?: string;
            min?: string;
            max?: string;
        };
        progress_measure?: string;
    }>;
}
export declare class OverallSequencingProcess {
    private static readonly HIDE_LMS_UI_ORDER;
    private activityTree;
    private sequencingProcess;
    private rollupProcess;
    private adlNav;
    private contentDelivered;
    private _deliveryInProgress;
    private eventCallback;
    private globalObjectiveMap;
    private now;
    private enhancedDeliveryValidation;
    private defaultHideLmsUi;
    private defaultAuxiliaryResources;
    private getCMIData;
    private is4thEdition;
    private navigationLookAhead;
    constructor(activityTree: ActivityTree, sequencingProcess: SequencingProcess, rollupProcess: RollupProcess, adlNav?: ADLNav | null, eventCallback?: ((eventType: string, data?: any) => void) | null, options?: {
        now?: () => Date;
        enhancedDeliveryValidation?: boolean;
        defaultHideLmsUi?: HideLmsUiItem[];
        defaultAuxiliaryResources?: AuxiliaryResource[];
        getCMIData?: () => CMIDataForTransfer;
        is4thEdition?: boolean;
    });
    processNavigationRequest(navigationRequest: NavigationRequestType, targetActivityId?: string | null, exitType?: string): DeliveryRequest;
    private navigationRequestProcess;
    private terminationRequestProcess;
    private handleExitTermination;
    private handleExitAllTermination;
    private handleAbandonTermination;
    private handleAbandonAllTermination;
    private handleSuspendAllTermination;
    private enhancedExitActionRulesSubprocess;
    private integratePostConditionRulesSubprocess;
    private handleMultiLevelExitActions;
    private processExitActionsAtLevel;
    private performComplexSuspendedActivityCleanup;
    private handleSuspendAllRequest;
    private deliveryRequestProcess;
    private contentDeliveryEnvironmentProcess;
    private initializeActivityForDelivery;
    private setupActivityAttemptTracking;
    private fireActivityDeliveryEvent;
    private fireEvent;
    private clearSuspendedActivitySubprocess;
    private endAttemptProcess;
    private transferRteDataToActivity;
    private transferPrimaryObjectiveData;
    private transferNonPrimaryObjectiveData;
    private normalizeScore;
    updateNavigationValidity(): void;
    synchronizeGlobalObjectives(): void;
    private getEffectiveHideLmsUi;
    private getEffectiveAuxiliaryResources;
    private findCommonAncestor;
    hasContentBeenDelivered(): boolean;
    isDeliveryInProgress(): boolean;
    resetContentDelivered(): void;
    setContentDelivered(value: boolean): void;
    private exitActionRulesSubprocess;
    private terminateAllActivities;
    private limitConditionsCheckProcess;
    private getActivityPath;
    private checkActivityProcess;
    private terminateDescendentAttemptsProcess;
    getSequencingState(): any;
    restoreSequencingState(state: any): boolean;
    private serializeActivityStates;
    private deserializeActivityStates;
    private getNavigationState;
    private restoreNavigationState;
    private validateComplexChoicePath;
    private validateForwardOnlyConstraints;
    private validateConstrainChoiceControls;
    private validateChoiceSetConstraints;
    private isActivityDisabled;
    private findChildContaining;
    private activityContains;
    private validateAncestorConstraints;
    private requiresNewActivation;
    private branchHasActiveAttempt;
    private helperIsActivityMandatory;
    private helperIsActivityCompleted;
    private evaluatePreConditionRulesForChoice;
    private validateActivityTreeStateConsistency;
    private validateResourceConstraints;
    private validateConcurrentDeliveryPrevention;
    private validateActivityDependencies;
    private isActivityPartOfTree;
    private getActiveActivities;
    private collectActiveActivities;
    private getActivityRequiredResources;
    private isResourceAvailable;
    private checkSystemResourceLimits;
    private hasPendingDeliveryRequests;
    private isDeliveryLocked;
    private getActivityPrerequisites;
    private isPrerequisiteSatisfied;
    private getObjectiveDependencies;
    private isObjectiveDependencySatisfied;
    private getSequencingRuleDependencies;
    private parseDurationToMinutes;
    private initializeGlobalObjectiveMap;
    private collectGlobalObjectives;
    getGlobalObjectiveMap(): Map<string, any>;
    getGlobalObjectiveMapSnapshot(): Record<string, any>;
    restoreGlobalObjectiveMapSnapshot(snapshot: Record<string, any>): void;
    updateGlobalObjective(objectiveId: string, objectiveData: any): void;
    private serializeGlobalObjectiveMap;
    private restoreGlobalObjectiveMap;
    getSuspensionState(): object;
    restoreSuspensionState(state: any): void;
    getNavigationLookAhead(): NavigationPredictions;
    predictContinueEnabled(): boolean;
    predictPreviousEnabled(): boolean;
    predictChoiceEnabled(activityId: string): boolean;
    getAvailableChoices(): string[];
    invalidateNavigationCache(): void;
    applyDeliveryControls(activity: Activity): void;
}
//# sourceMappingURL=overall_sequencing_process.d.ts.map