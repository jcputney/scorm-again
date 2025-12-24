import { Activity, ActivityObjective, ObjectiveMapInfo } from "../activity";
import { CompletionStatus } from "../../../../constants/enums";
export type EventCallback = (eventType: string, data?: unknown) => void;
export interface GlobalObjective {
    id: string;
    satisfiedStatus: boolean;
    satisfiedStatusKnown: boolean;
    normalizedMeasure: number;
    normalizedMeasureKnown: boolean;
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
export interface LocalObjectiveState {
    id: string;
    satisfiedStatus: boolean;
    measureStatus: boolean;
    normalizedMeasure: number;
    progressMeasure: number;
    progressMeasureStatus: boolean;
    completionStatus: CompletionStatus;
    scaledPassingScore: number | null;
}
export declare class GlobalObjectiveSynchronizer {
    private eventCallback;
    constructor(eventCallback?: EventCallback);
    processGlobalObjectiveMapping(activity: Activity, globalObjectives: Map<string, GlobalObjective>): void;
    collectActivitiesRecursive(activity: Activity, result: Activity[]): void;
    syncGlobalObjectivesWritePhase(activity: Activity, globalObjectives: Map<string, GlobalObjective>): void;
    syncGlobalObjectivesReadPhase(activity: Activity, globalObjectives: Map<string, GlobalObjective>): void;
    synchronizeGlobalObjectives(activity: Activity, globalObjectives: Map<string, GlobalObjective>): void;
    syncObjectiveState(activity: Activity, objective: ActivityObjective, mapInfo: ObjectiveMapInfo, globalObjective: GlobalObjective): void;
    ensureGlobalObjectiveEntry(globalObjectives: Map<string, GlobalObjective>, targetId: string, objective: ActivityObjective): GlobalObjective;
    createDefaultMapInfo(objective: ActivityObjective): ObjectiveMapInfo;
    getLocalObjectiveState(activity: Activity, objective: ActivityObjective, isPrimary: boolean): LocalObjectiveState;
    updateActivityAttemptData(activity: Activity, globalObjective: GlobalObjective, objective: ActivityObjective): void;
}
//# sourceMappingURL=global_objective_synchronizer.d.ts.map