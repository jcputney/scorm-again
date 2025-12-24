import { Activity } from "../activity";
export interface CMIDataForTransfer {
    completion_status?: string;
    success_status?: string;
    score?: {
        scaled?: string;
        raw?: string;
        min?: string;
        max?: string;
    };
    progress_measure?: string;
    objectives?: Array<{
        id: string;
        success_status?: string;
        completion_status?: string;
        score?: {
            scaled?: string;
            raw?: string;
            min?: string;
            max?: string;
        };
        progress_measure?: string;
    }>;
}
export interface ScoreData {
    scaled?: string;
    raw?: string;
    min?: string;
    max?: string;
}
export interface RteTransferEventData {
    activityId: string;
    timestamp: string;
}
export interface RteDataTransferContext {
    getCMIData: (() => CMIDataForTransfer | null) | null;
    fireEvent: (eventType: string, data?: RteTransferEventData) => void;
}
export declare class RteDataTransferService {
    private context;
    constructor(context: RteDataTransferContext);
    transferRteData(activity: Activity): void;
    transferPrimaryObjective(activity: Activity, cmiData: CMIDataForTransfer): void;
    transferNonPrimaryObjectives(activity: Activity, cmiData: CMIDataForTransfer): void;
    normalizeScore(score: ScoreData): number | null;
}
//# sourceMappingURL=rte_data_transfer.d.ts.map