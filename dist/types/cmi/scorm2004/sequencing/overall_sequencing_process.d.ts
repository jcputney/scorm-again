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
    private eventCallback;
    private globalObjectiveMap;
    private now;
    private enhancedDeliveryValidation;
    constructor(activityTree: ActivityTree, sequencingProcess: SequencingProcess, rollupProcess: RollupProcess, adlNav?: ADLNav | null, eventCallback?: ((eventType: string, data?: any) => void) | null, options?: {
        now?: () => Date;
        enhancedDeliveryValidation?: boolean;
    });
    processNavigationRequest(navigationRequest: NavigationRequestType, targetActivityId?: string | null): DeliveryRequest;
    private navigationRequestProcess;
    private terminationRequestProcess;
    private executeTermination;
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
    private updateNavigationValidity;
    private findCommonAncestor;
    hasContentBeenDelivered(): boolean;
    resetContentDelivered(): void;
    private exitActionRulesSubprocess;
    private terminateAllActivities;
    private limitConditionsCheckProcess;
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
    private helperIsActivityMandatory;
    private helperIsActivityCompleted;
    private getValidChoiceSet;
    private getAllDescendants;
    private isValidChoiceTarget;
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
    updateGlobalObjective(objectiveId: string, objectiveData: any): void;
}
//# sourceMappingURL=overall_sequencing_process.d.ts.map