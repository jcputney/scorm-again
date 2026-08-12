import { Activity, ActivityObjective, ActivityObjectiveReadState, ObjectiveMapInfo } from "../activity";
import { CompletionStatus } from "../../../../constants/enums";
export type EventCallback = (eventType: string, data?: unknown) => void;
export interface GlobalObjective {
    id: string;
    satisfiedStatus: boolean;
    satisfiedStatusKnown: boolean;
    normalizedMeasure: number;
    normalizedMeasureKnown: boolean;
    rawScore: string;
    rawScoreKnown: boolean;
    minScore: string;
    minScoreKnown: boolean;
    maxScore: string;
    maxScoreKnown: boolean;
    progressMeasure: number;
    progressMeasureKnown: boolean;
    completionStatus: CompletionStatus;
    completionStatusKnown: boolean;
    satisfiedByMeasure: boolean;
    minNormalizedMeasure: number | null;
    attemptCount?: number;
    attemptAbsoluteDuration?: string;
    attemptExperiencedDuration?: string;
    activityAbsoluteDuration?: string;
    activityExperiencedDuration?: string;
    location?: string;
    suspendData?: string;
    updateAttemptData?: boolean;
}
export interface GlobalObjectiveWriteTargets {
    satisfiedStatus: Set<string>;
    normalizedMeasure: Set<string>;
}
interface GlobalObjectiveReadOptions {
    restrictToFreshWrites: boolean;
    allowSatisfiedStatus: boolean;
    allowNormalizedMeasure: boolean;
}
export interface LocalObjectiveState {
    id: string;
    satisfiedStatus: boolean;
    measureStatus: boolean;
    normalizedMeasure: number;
    rawScore: string;
    rawScoreKnown: boolean;
    minScore: string;
    minScoreKnown: boolean;
    maxScore: string;
    maxScoreKnown: boolean;
    progressMeasure: number;
    progressMeasureStatus: boolean;
    completionStatus: CompletionStatus;
    scaledPassingScore: number | null;
}
export declare class GlobalObjectiveSynchronizer {
    private eventCallback;
    constructor(eventCallback?: EventCallback);
    processGlobalObjectiveMapping(activity: Activity, globalObjectives: Map<string, GlobalObjective>): Activity[];
    collectActivitiesRecursive(activity: Activity, result: Activity[]): void;
    syncGlobalObjectivesWritePhase(activity: Activity, globalObjectives: Map<string, GlobalObjective>): void;
    syncTerminatedActivityWritePhase(activity: Activity, globalObjectives: Map<string, GlobalObjective>): GlobalObjectiveWriteTargets;
    syncGlobalObjectivesReadPhase(activity: Activity, globalObjectives: Map<string, GlobalObjective>): boolean;
    syncFreshlyWrittenGlobalObjectivesReadPhase(activity: Activity, globalObjectives: Map<string, GlobalObjective>, writeTargets: GlobalObjectiveWriteTargets): boolean;
    private syncGlobalObjectivesReadPhaseInternal;
    synchronizeGlobalObjectives(activity: Activity, globalObjectives: Map<string, GlobalObjective>): void;
    syncObjectiveState(activity: Activity, objective: ActivityObjective, mapInfo: ObjectiveMapInfo, globalObjective: GlobalObjective): void;
    static getGlobalObjectiveReadState(activity: Activity, objective: ActivityObjective, mapInfo: ObjectiveMapInfo, globalObjective: GlobalObjective, options?: GlobalObjectiveReadOptions): ActivityObjectiveReadState;
    private applyGlobalObjectiveReadState;
    ensureGlobalObjectiveEntry(globalObjectives: Map<string, GlobalObjective>, targetId: string, objective: ActivityObjective): GlobalObjective;
    createDefaultMapInfo(objective: ActivityObjective): ObjectiveMapInfo;
    private hasKnownSatisfiedStatus;
    private canWriteGlobalObjectives;
    getLocalObjectiveState(activity: Activity, objective: ActivityObjective, isPrimary: boolean): LocalObjectiveState;
    updateActivityAttemptData(activity: Activity, globalObjective: GlobalObjective, objective: ActivityObjective): void;
}
export {};
//# sourceMappingURL=global_objective_synchronizer.d.ts.map