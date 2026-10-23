import { Activity } from "./activity.js";
import { RollupChildFilter } from "./rollup/rollup_child_filter.js";
import { RollupClockOptions, RollupRuleEvaluator } from "./rollup/rollup_rule_evaluator.js";
import { MeasureRollupProcessor } from "./rollup/measure_rollup.js";
import { ObjectiveRollupProcessor } from "./rollup/objective_rollup.js";
import { ProgressRollupProcessor } from "./rollup/progress_rollup.js";
import { DurationRollupProcessor } from "./rollup/duration_rollup.js";
import { GlobalObjectiveSynchronizer, GlobalObjective, GlobalObjectiveWriteTargets } from "./objectives/global_objective_synchronizer.js";
import { RollupStateValidator } from "./validation/rollup_state_validator.js";
export type EventCallback = (eventType: string, data?: unknown) => void;
export declare class RollupProcess {
    readonly childContributionControlsApplyToParent = true;
    private childFilter;
    private ruleEvaluator;
    private measureProcessor;
    private objectiveProcessor;
    private progressProcessor;
    private durationProcessor;
    private globalObjectiveSynchronizer;
    private stateValidator;
    private eventCallback;
    constructor(eventCallback?: EventCallback, clock?: RollupClockOptions);
    overallRollupProcess(activity: Activity, globalObjectives?: Map<string, GlobalObjective>): Activity[];
    validateRollupStateConsistency(rootActivity: Activity): boolean;
    processGlobalObjectiveMapping(activity: Activity, globalObjectives: Map<string, GlobalObjective>): void;
    syncTerminatedActivityObjectives(activity: Activity, globalObjectives: Map<string, GlobalObjective>): GlobalObjectiveWriteTargets;
    syncActivityObjectivesFromGlobals(activity: Activity, globalObjectives: Map<string, GlobalObjective>): boolean;
    syncFreshlyWrittenObjectivesToActiveAncestor(activity: Activity, globalObjectives: Map<string, GlobalObjective>, writeTargets: GlobalObjectiveWriteTargets): boolean;
    getChildFilter(): RollupChildFilter;
    getRuleEvaluator(): RollupRuleEvaluator;
    getMeasureProcessor(): MeasureRollupProcessor;
    getObjectiveProcessor(): ObjectiveRollupProcessor;
    getProgressProcessor(): ProgressRollupProcessor;
    getDurationProcessor(): DurationRollupProcessor;
    getGlobalObjectiveSynchronizer(): GlobalObjectiveSynchronizer;
    getStateValidator(): RollupStateValidator;
}
//# sourceMappingURL=rollup_process.d.ts.map