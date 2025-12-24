import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
export declare class ActivityTreeQueries {
    private activityTree;
    constructor(activityTree: ActivityTree);
    isInTree(activity: Activity): boolean;
    isAncestorOf(ancestor: Activity, descendant: Activity): boolean;
    findCommonAncestor(activity1: Activity | null, activity2: Activity | null): Activity | null;
    findChildInPath(ancestor: Activity, target: Activity): Activity | null;
    isLastInTree(activity: Activity): boolean;
    getCurrentInParent(parent: Activity): Activity | null;
    isMandatory(activity: Activity): boolean;
    isCompleted(activity: Activity): boolean;
    isAvailableForChoice(activity: Activity): boolean;
    getAncestors(activity: Activity): Activity[];
    getPathToRoot(activity: Activity): Activity[];
    isLeaf(activity: Activity): boolean;
    isCluster(activity: Activity): boolean;
    getDepth(activity: Activity): number;
}
//# sourceMappingURL=activity_tree_queries.d.ts.map