import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { ActivityTreeQueries } from "../utils/activity_tree_queries";
import { GlobalObjective, GlobalObjectiveSynchronizer } from "./global_objective_synchronizer";

/**
 * Disposable objective state for evaluating a possible branch change.
 * @spec SCORM 2004 SN 4th Ed. SB.2.2 / SB.2.9 / DB.1.1 - validation must not commit UP.3/UP.4.
 * @spec SCORM 2004 SN 4th Ed. SM.7 - read maps see the departing clusters' current rolled-up values.
 */
export class ObjectiveEvaluationContext {
  private synchronizer = new GlobalObjectiveSynchronizer();
  private treeQueries: ActivityTreeQueries;

  constructor(
    private activityTree: ActivityTree,
    private globalObjectives: Map<string, GlobalObjective>,
  ) {
    this.treeQueries = new ActivityTreeQueries(activityTree);
  }

  /**
   * Overlay the old branch's write maps on copied global entries, then read them
   * into a disposable candidate. No end-attempt, rollup or live writer runs here.
   * @spec SCORM 2004 SN 4th Ed. UP.3 / SM.7 - exclude the common ancestor and preserve live attempt state.
   */
  public project(activity: Activity, target: Activity = activity): Activity {
    const current = this.activityTree.currentActivity;
    const commonAncestor = this.treeQueries.findCommonAncestor(current, target);
    if (!current || current === commonAncestor) {
      return activity;
    }

    const leaving: Activity[] = [];
    let ancestor = current.parent;
    while (ancestor && ancestor !== commonAncestor) {
      if (ancestor.isActive) leaving.push(ancestor);
      ancestor = ancestor.parent;
    }
    if (leaving.length === 0) return activity;

    const projectedGlobals = new Map(this.globalObjectives);
    for (const cluster of leaving) {
      for (const objective of cluster.getAllObjectives()) {
        for (const map of objective.mapInfo) {
          const targetId = map.targetObjectiveID || objective.id;
          const entry = projectedGlobals.get(targetId);
          if (entry) projectedGlobals.set(targetId, { ...entry });
        }
      }
      // Reuse SM.7 field/unknown semantics on copies of BOTH sides. The writer
      // clears dirty flags only on this disposable objective view.
      this.synchronizer.syncTerminatedActivityWritePhase(
        cluster.createObjectiveEvaluationView(),
        projectedGlobals,
      );
    }

    const view = activity.createObjectiveEvaluationView();
    this.synchronizer.syncGlobalObjectivesReadPhase(view, projectedGlobals);
    return view;
  }
}
