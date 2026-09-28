import { Activity } from "../activity.js";
import { ActivityTree } from "../activity_tree.js";
import { GlobalObjective } from "./global_objective_synchronizer.js";
export declare class ObjectiveEvaluationContext {
    private activityTree;
    private globalObjectives;
    private synchronizer;
    private treeQueries;
    constructor(activityTree: ActivityTree, globalObjectives: Map<string, GlobalObjective>);
    project(activity: Activity, target?: Activity): Activity;
}
//# sourceMappingURL=objective_evaluation_context.d.ts.map