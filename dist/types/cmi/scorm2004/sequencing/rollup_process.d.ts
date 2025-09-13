import { Activity } from "./activity";
export declare class RollupProcess {
    private rollupStateLog;
    private eventCallback;
    constructor(eventCallback?: (eventType: string, data?: any) => void);
    overallRollupProcess(activity: Activity): void;
    private measureRollupProcess;
    private objectiveRollupProcess;
    private objectiveRollupUsingRules;
    private objectiveRollupUsingMeasure;
    private objectiveRollupUsingDefault;
    private activityProgressRollupProcess;
    private checkChildForRollupSubprocess;
    private evaluateRollupRule;
    private evaluateRollupConditionsSubprocess;
    validateRollupStateConsistency(rootActivity: Activity): boolean;
    processGlobalObjectiveMapping(activity: Activity, globalObjectives: Map<string, any>): void;
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
    private identifyActivityClusters;
}
//# sourceMappingURL=rollup_process.d.ts.map