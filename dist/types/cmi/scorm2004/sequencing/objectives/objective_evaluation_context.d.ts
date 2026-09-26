import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { GlobalObjective } from "./global_objective_synchronizer";
export declare class ObjectiveEvaluationContext {
    private activityTree;
    private globalObjectives;
    private synchronizer;
    private treeQueries;
    constructor(activityTree: ActivityTree, globalObjectives: Map<string, GlobalObjective>);
    project(activity: Activity, target?: Activity): Activity;
}
//# sourceMappingURL=objective_evaluation_context.d.ts.map