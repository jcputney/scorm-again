import { CMIObjectivesObject } from "../cmi/scorm2004/objectives";
import { CMI } from "../cmi/scorm2004/cmi";
import { OverallSequencingProcess } from "../cmi/scorm2004/sequencing/overall_sequencing_process";
import { GlobalObjectiveMapEntry, ScoreObject, Settings } from "../types/api_types";
import { SequencingService } from "../services/SequencingService";
import { CompletionStatus, SuccessStatus } from "../constants/enums";
import { Sequencing } from "../cmi/scorm2004/sequencing/sequencing";
export type CommonSetCMIValueFn = (methodName: string, throwError: boolean, CMIElement: string, value: any) => string;
export interface GlobalObjectiveContext {
    getSettings: () => Settings;
    cmi: CMI;
    sequencing: Sequencing | null;
    sequencingService: SequencingService | null;
    commonSetCMIValue: CommonSetCMIValueFn;
}
export declare class GlobalObjectiveManager {
    private _globalObjectives;
    private context;
    constructor(context: GlobalObjectiveContext);
    get globalObjectives(): CMIObjectivesObject[];
    set globalObjectives(objectives: CMIObjectivesObject[]);
    updateSequencingService(service: SequencingService | null): void;
    syncGlobalObjectiveIdsFromSequencing(): void;
    restoreGlobalObjectivesToCMI(): void;
    updateGlobalObjectiveFromCMI(objectiveId: string, objective: CMIObjectivesObject): void;
    buildObjectiveMapEntryFromCMI(objective: CMIObjectivesObject): GlobalObjectiveMapEntry;
    buildCMIObjectivesFromMap(snapshot: Record<string, GlobalObjectiveMapEntry>): CMIObjectivesObject[];
    buildCMIObjectiveFromJSON(data: any): CMIObjectivesObject;
    captureGlobalObjectiveSnapshot(overallProcess?: OverallSequencingProcess | null): Record<string, GlobalObjectiveMapEntry>;
    parseObjectiveNumber(value: any): number | null;
    syncCmiToSequencingActivity(completionStatus: CompletionStatus, successStatus: SuccessStatus, scoreObject?: ScoreObject): void;
    findOrCreateGlobalObjective(objectiveId: string): {
        index: number;
        objective: CMIObjectivesObject;
    };
}
//# sourceMappingURL=global_objective_manager.d.ts.map