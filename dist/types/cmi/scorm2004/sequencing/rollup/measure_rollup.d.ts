import { Activity } from "../activity";
import { RollupChildFilter } from "./rollup_child_filter";
export interface MeasureRollupOptions {
    enableThresholdBias?: boolean;
}
export type EventCallback = (eventType: string, data?: unknown) => void;
export declare class MeasureRollupProcessor {
    private childFilter;
    private eventCallback;
    constructor(childFilter: RollupChildFilter, eventCallback?: EventCallback);
    measureRollupProcess(activity: Activity): Activity[];
    completionMeasureRollupProcess(activity: Activity): void;
    calculateComplexWeightedMeasure(activity: Activity, children: Activity[], options?: MeasureRollupOptions): number;
    calculateAdjustedWeight(child: Activity, baseWeight: number, enableBias?: boolean): number;
    identifyActivityClusters(children: Activity[]): Activity[];
}
//# sourceMappingURL=measure_rollup.d.ts.map