import { ActivityTree } from "./activity_tree";
import { SequencingProcess } from "./sequencing_process";
export interface NavigationPredictions {
    continueEnabled: boolean;
    previousEnabled: boolean;
    availableChoices: string[];
}
export declare class NavigationLookAhead {
    private activityTree;
    private sequencingProcess;
    private cache;
    private isDirty;
    constructor(activityTree: ActivityTree, sequencingProcess: SequencingProcess);
    predictContinueEnabled(): boolean;
    predictPreviousEnabled(): boolean;
    predictChoiceEnabled(activityId: string): boolean;
    getAvailableChoices(): string[];
    getAllPredictions(): NavigationPredictions;
    invalidateCache(): void;
    updateCache(): void;
    private ensureCacheValid;
    private recalculateCache;
    private predictContinueInternal;
    private hasAvailableNextActivity;
    private predictPreviousInternal;
    private hasAvailablePreviousActivity;
    private calculateAvailableChoicesFromRoot;
    private calculateAvailableChoices;
    private recursivelyCheckChoiceAvailability;
    private isActivityPotentiallyDeliverableForward;
    private isActivityPotentiallyDeliverableBackward;
    private calculateTreeStateHash;
    private getActivityTreeStateSignature;
    private collectActivitySignatures;
}
//# sourceMappingURL=navigation_look_ahead.d.ts.map