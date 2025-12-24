import { Activity } from "../activity";
import { RollupChildFilter } from "../rollup/rollup_child_filter";
export type EventCallback = (eventType: string, data?: unknown) => void;
export interface RollupStateLogEntry {
    activity: string;
    timestamp: string;
    state: {
        measureStatus: boolean;
        measure: number;
        satisfiedStatus: boolean;
        completionStatus: string;
    };
}
export declare class RollupStateValidator {
    private rollupStateLog;
    private childFilter;
    private eventCallback;
    constructor(childFilter: RollupChildFilter, eventCallback?: EventCallback);
    validateRollupStateConsistency(rootActivity: Activity): boolean;
    validateActivityRollupState(activity: Activity, inconsistencies: string[]): void;
    getRollupStateLog(): RollupStateLogEntry[];
    clearRollupStateLog(): void;
}
//# sourceMappingURL=rollup_state_validator.d.ts.map