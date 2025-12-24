import { Activity } from "./activity";
import { RollupChildFilter } from "./rollup/rollup_child_filter";
import { RollupRuleEvaluator } from "./rollup/rollup_rule_evaluator";
import { MeasureRollupProcessor, MeasureRollupOptions } from "./rollup/measure_rollup";
import { ObjectiveRollupProcessor } from "./rollup/objective_rollup";
import { ProgressRollupProcessor } from "./rollup/progress_rollup";
import { DurationRollupProcessor } from "./rollup/duration_rollup";
import { CrossClusterProcessor } from "./rollup/cross_cluster_processor";
import { GlobalObjectiveSynchronizer, GlobalObjective } from "./objectives/global_objective_synchronizer";
import { RollupStateValidator } from "./validation/rollup_state_validator";
export type EventCallback = (eventType: string, data?: unknown) => void;
export declare class RollupProcess {
    private childFilter;
    private ruleEvaluator;
    private measureProcessor;
    private objectiveProcessor;
    private progressProcessor;
    private durationProcessor;
    private globalObjectiveSynchronizer;
    private stateValidator;
    private crossClusterProcessor;
    private eventCallback;
    constructor(eventCallback?: EventCallback);
    overallRollupProcess(activity: Activity): Activity[];
    validateRollupStateConsistency(rootActivity: Activity): boolean;
    processGlobalObjectiveMapping(activity: Activity, globalObjectives: Map<string, GlobalObjective>): void;
    calculateComplexWeightedMeasure(activity: Activity, children: Activity[], options?: MeasureRollupOptions): number;
    processCrossClusterDependencies(activity: Activity, clusters: Activity[]): void;
    getChildFilter(): RollupChildFilter;
    getRuleEvaluator(): RollupRuleEvaluator;
    getMeasureProcessor(): MeasureRollupProcessor;
    getObjectiveProcessor(): ObjectiveRollupProcessor;
    getProgressProcessor(): ProgressRollupProcessor;
    getDurationProcessor(): DurationRollupProcessor;
    getGlobalObjectiveSynchronizer(): GlobalObjectiveSynchronizer;
    getStateValidator(): RollupStateValidator;
    getCrossClusterProcessor(): CrossClusterProcessor;
}
//# sourceMappingURL=rollup_process.d.ts.map