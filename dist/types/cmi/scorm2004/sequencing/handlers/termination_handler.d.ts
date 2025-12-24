import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { SequencingProcess, SequencingRequestType, PostConditionResult } from "../sequencing_process";
import { RollupProcess } from "../rollup_process";
import { CMIDataForTransfer } from "./rte_data_transfer";
export { CMIDataForTransfer } from "./rte_data_transfer";
export interface TerminationResult {
    terminationRequest: SequencingRequestType;
    sequencingRequest: SequencingRequestType | null;
    exception: string | null;
    valid: boolean;
}
export interface TerminationHandlerOptions {
    getCMIData?: () => CMIDataForTransfer;
    is4thEdition?: boolean;
}
export declare class TerminationHandler {
    private activityTree;
    private sequencingProcess;
    private rollupProcess;
    private globalObjectiveMap;
    private eventCallback;
    private getCMIData;
    private is4thEdition;
    private invalidateCacheCallback;
    private _rteDataTransferService;
    constructor(activityTree: ActivityTree, sequencingProcess: SequencingProcess, rollupProcess: RollupProcess, globalObjectiveMap: Map<string, any>, eventCallback?: ((eventType: string, data?: any) => void) | null, options?: TerminationHandlerOptions);
    setInvalidateCacheCallback(callback: () => void): void;
    processTerminationRequest(request: SequencingRequestType, hasSequencingRequest?: boolean, exitType?: string): TerminationResult;
    handleExitTermination(currentActivity: Activity, hasSequencingRequest: boolean): TerminationResult;
    private handleExit;
    private handleExitAll;
    private handleAbandon;
    private handleAbandonAll;
    private handleSuspendAll;
    private processSuspendAllRequest;
    evaluateExitRules(activity: Activity, recursionDepth?: number): {
        action: string | null;
        recursionDepth: number;
    };
    evaluatePostConditions(activity: Activity): PostConditionResult;
    private handleMultiLevelExit;
    private processExitAtLevel;
    cleanupSuspendedActivity(): void;
    private terminateAll;
    terminateDescendants(activity: Activity): void;
    private exitActionRulesSubprocess;
    clearSuspendedActivity(): void;
    endAttempt(activity: Activity): void;
    private fireEvent;
}
//# sourceMappingURL=termination_handler.d.ts.map