import { Activity } from "../activity";
import { MeasureRollupProcessor } from "./measure_rollup";
import { ObjectiveRollupProcessor } from "./objective_rollup";
import { ProgressRollupProcessor } from "./progress_rollup";
export type EventCallback = (eventType: string, data?: unknown) => void;
export declare class CrossClusterProcessor {
    private measureProcessor;
    private objectiveProcessor;
    private progressProcessor;
    private eventCallback;
    private processingClusters;
    constructor(measureProcessor: MeasureRollupProcessor, objectiveProcessor: ObjectiveRollupProcessor, progressProcessor: ProgressRollupProcessor, eventCallback?: EventCallback);
    processCrossClusterDependencies(activity: Activity, clusters: Activity[], depth?: number): void;
    identifyActivityClusters(children: Activity[]): Activity[];
    analyzeCrossClusterDependencies(cluster: Activity, dependencyMap: Map<string, string[]>): void;
    resolveDependencyOrder(dependencyMap: Map<string, string[]>): string[];
    processClusterRollup(cluster: Activity, depth?: number): void;
}
//# sourceMappingURL=cross_cluster_processor.d.ts.map