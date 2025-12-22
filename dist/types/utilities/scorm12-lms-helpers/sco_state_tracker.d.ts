import { ScoState, ScoStateChangeEvent } from "./types";
export type StateChangeListener = (event: ScoStateChangeEvent) => void;
export declare class ScoStateTracker {
    private _states;
    private _listeners;
    constructor(initialStates?: ScoState[]);
    initializeSco(id: string, title: string, masteryScore?: number): void;
    getScoState(scoId: string): ScoState | undefined;
    getAllStates(): ScoState[];
    updateFromCmiData(scoId: string, cmiData: ScormCmiData): void;
    markLaunched(scoId: string): void;
    isCompleted(scoId: string): boolean;
    isPassed(scoId: string): boolean;
    isFailed(scoId: string): boolean;
    hasBeenAttempted(scoId: string): boolean;
    getNormalizedScore(scoId: string): number | undefined;
    onStateChange(listener: StateChangeListener): () => void;
    exportState(): ScoState[];
    importState(states: ScoState[]): void;
    clear(): void;
    private _createDefaultState;
    private _normalizeStatus;
    private _updateScore;
    private _emitChange;
}
export interface ScormCmiData {
    core?: {
        lesson_status?: string;
        lesson_location?: string;
        exit?: string;
        session_time?: string;
        score?: {
            raw?: number | string;
            min?: number | string;
            max?: number | string;
        };
    };
    suspend_data?: string;
}
//# sourceMappingURL=sco_state_tracker.d.ts.map