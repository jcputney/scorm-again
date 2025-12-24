import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { GlobalObjectiveService } from "../services/global_objective_service";
import { RollupProcess } from "../rollup_process";
import { ADLNav } from "../../adl";
import { HideLmsUiItem, AuxiliaryResource } from "../../../../types/sequencing_types";
export interface ActivityStateData {
    id: string;
    title: string;
    isActive: boolean;
    isSuspended: boolean;
    isCompleted: boolean;
    completionStatus: string;
    successStatus: string;
    attemptCount: number;
    attemptCompletionAmount: number;
    attemptAbsoluteDuration: string;
    attemptExperiencedDuration: string;
    activityAbsoluteDuration: string;
    activityExperiencedDuration: string;
    objectiveSatisfiedStatus: boolean;
    objectiveMeasureStatus: boolean;
    objectiveNormalizedMeasure: number;
    progressMeasure: number | null;
    progressMeasureStatus: boolean;
    isAvailable: boolean;
    isHiddenFromChoice: boolean;
    location: string;
    attemptAbsoluteStartTime: string | null;
    objectives: any;
    auxiliaryResources: AuxiliaryResource[];
    selectionRandomizationState: {
        selectionCountStatus: boolean;
        reorderChildren: boolean;
        childOrder: string[];
        selectedChildIds: string[];
        hiddenFromChoiceChildIds: string[];
    };
}
export interface NavigationState {
    request: string;
    requestValid: {
        continue: string;
        previous: string;
        choice: string;
        jump: string;
        exit: string;
        exitAll: string;
        abandon: string;
        abandonAll: string;
        suspendAll: string;
    };
    hideLmsUi: HideLmsUiItem[];
    auxiliaryResources: AuxiliaryResource[];
}
export interface SequencingState {
    version: string;
    timestamp: string;
    contentDelivered: boolean;
    currentActivity: string | null;
    suspendedActivity: string | null;
    activityStates: Record<string, ActivityStateData>;
    navigationState: NavigationState | null;
    globalObjectiveMap: Record<string, any>;
}
export interface SuspensionState {
    activityTree: any;
    currentActivityId: string | null;
    suspendedActivityId: string | null;
    globalObjectives: Record<string, any>;
    timestamp: string;
}
export declare class SequencingStateManager {
    private activityTree;
    private globalObjectiveService;
    private rollupProcess;
    private adlNav;
    private eventCallback;
    private getEffectiveHideLmsUiCallback;
    private getEffectiveAuxiliaryResourcesCallback;
    private contentDeliveredGetter;
    private contentDeliveredSetter;
    constructor(activityTree: ActivityTree, globalObjectiveService: GlobalObjectiveService, rollupProcess: RollupProcess, adlNav?: ADLNav | null, eventCallback?: ((eventType: string, data?: any) => void) | null);
    setGetEffectiveHideLmsUiCallback(callback: (activity: Activity | null) => HideLmsUiItem[]): void;
    setGetEffectiveAuxiliaryResourcesCallback(callback: (activity: Activity | null) => AuxiliaryResource[]): void;
    setContentDeliveredAccessors(getter: () => boolean, setter: (value: boolean) => void): void;
    getState(): SequencingState;
    restoreState(state: SequencingState): boolean;
    private serializeActivities;
    private deserializeActivities;
    private getNavigationState;
    private restoreNavigationState;
    getSuspensionState(): SuspensionState;
    restoreSuspensionState(state: SuspensionState): void;
    private fireEvent;
}
//# sourceMappingURL=sequencing_state_manager.d.ts.map