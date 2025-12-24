import { SequencingStateMetadata, Settings } from "../types/api_types";
import { ADL } from "../cmi/scorm2004/adl";
import { Sequencing } from "../cmi/scorm2004/sequencing/sequencing";
import { GlobalObjectiveManager } from "../objectives/global_objective_manager";
import { SequencingService } from "../services/SequencingService";
export type ApiLogFn = (method: string, message: string, level: number) => void;
export interface PersistenceContext {
    getSettings: () => Settings;
    apiLog: ApiLogFn;
    adl: ADL;
    sequencing: Sequencing;
    sequencingService: SequencingService | null;
    learnerId: string;
}
export declare class SequencingStatePersistence {
    private context;
    private globalObjectiveManager;
    constructor(context: PersistenceContext, globalObjectiveManager: GlobalObjectiveManager);
    saveSequencingState(metadata?: Partial<SequencingStateMetadata>): Promise<boolean>;
    loadSequencingState(metadata?: Partial<SequencingStateMetadata>): Promise<boolean>;
    serializeSequencingState(): string;
    deserializeSequencingState(stateData: string): boolean;
    compressStateData(data: string): string;
    decompressStateData(data: string): string;
}
//# sourceMappingURL=sequencing_state_persistence.d.ts.map