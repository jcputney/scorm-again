import { Activity } from "../activity.js";
import { RollupChildFilter } from "./rollup_child_filter.js";
export type EventCallback = (eventType: string, data?: unknown) => void;
export declare class MeasureRollupProcessor {
    constructor(_childFilter: RollupChildFilter, _eventCallback?: EventCallback);
    measureRollupProcess(activity: Activity): void;
    completionMeasureRollupProcess(activity: Activity): void;
}
//# sourceMappingURL=measure_rollup.d.ts.map