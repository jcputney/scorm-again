import { Activity } from "./activity";
export declare class RollupProcess {
    private rollupStateLog;
    private eventCallback;
    constructor(eventCallback?: (eventType: string, data?: any) => void);
    overallRollupProcess(activity: Activity): Activity[];
    private measureRollupProcess;
    private objectiveRollupProcess;
    private syncPrimaryObjectiveFromActivity;
    private objectiveRollupUsingRules;
    private objectiveRollupUsingMeasure;
    private objectiveRollupUsingDefault;
    private completionMeasureRollupProcess;
    private activityProgressRollupUsingMeasure;
    private activityProgressRollupProcess;
    private durationRollupProcess;
    private getTrackableChildren;
    private checkChildForRollupSubprocess;
    private filterChildrenForRequirement;
    private shouldIncludeChildForRollup;
    private isChildSatisfiedForRollup;
    private isChildCompletedForRollup;
    private evaluateRollupRule;
    private evaluateRollupConditionsSubprocess;
    validateRollupStateConsistency(rootActivity: Activity): boolean;
    processGlobalObjectiveMapping(activity: Activity, globalObjectives: Map<string, any>): void;
    private collectActivitiesRecursive;
    private syncGlobalObjectivesWritePhase;
    private syncGlobalObjectivesReadPhase;
    calculateComplexWeightedMeasure(activity: Activity, children: Activity[], options?: {
        enableThresholdBias?: boolean;
    }): number;
    processCrossClusterDependencies(activity: Activity, clusters: Activity[]): void;
    private validateActivityRollupState;
    private synchronizeGlobalObjectives;
    private calculateAdjustedWeight;
    private analyzeCrossClusterDependencies;
    private resolveDependencyOrder;
    private processClusterRollup;
    private getActivityObjectives;
    private syncObjectiveState;
    private updateActivityAttemptData;
    private getLocalObjectiveState;
    private ensureGlobalObjectiveEntry;
    private createDefaultMapInfo;
    private identifyActivityClusters;
}
//# sourceMappingURL=rollup_process.d.ts.map