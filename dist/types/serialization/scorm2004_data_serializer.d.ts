import { CMI } from "../cmi/scorm2004/cmi.js";
import { CommitObject, Settings } from "../types/api_types.js";
import { StringKeyMap } from "../utilities/index.js";
import { SequencingService } from "../services/SequencingService.js";
import { GlobalObjectiveManager } from "../objectives/global_objective_manager.js";
import { ADL } from "../cmi/scorm2004/adl.js";
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