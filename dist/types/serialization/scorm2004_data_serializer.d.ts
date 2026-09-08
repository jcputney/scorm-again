import { CMI } from "../cmi/scorm2004/cmi";
import { CommitObject, Settings } from "../types/api_types";
import { StringKeyMap } from "../utilities";
import { SequencingService } from "../services/SequencingService";
import { GlobalObjectiveManager } from "../objectives/global_objective_manager";
import { ADL } from "../cmi/scorm2004/adl";
export type RenderCMIToJSONFn = () => StringKeyMap;
export interface DataSerializerContext {
    getSettings: () => Settings;
    cmi: CMI;
    adl?: ADL;
    sequencingService: SequencingService | null;
    renderCMIToJSONObject: RenderCMIToJSONFn;
}
export declare class Scorm2004DataSerializer {
    private context;
    private globalObjectiveManager;
    constructor(context: DataSerializerContext, globalObjectiveManager?: GlobalObjectiveManager | null);
    setGlobalObjectiveManager(manager: GlobalObjectiveManager): void;
    updateSequencingService(service: SequencingService | null): void;
    renderCommitCMI(terminateCommit: boolean, includeTotalTime?: boolean): StringKeyMap | Array<any>;
    private renderCMIExport;
    private captureSharedData;
    renderCommitObject(terminateCommit: boolean, includeTotalTime?: boolean): CommitObject;
    determineEntryValue(previousExit: string, hasSuspendData: boolean): string;
}
//# sourceMappingURL=scorm2004_data_serializer.d.ts.map