import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { RuleEvaluationEngine } from "../rules/rule_evaluation_engine";
import { FlowSubprocessResult, FlowSubprocessMode } from "../rules/sequencing_request_types";
export interface FlowTreeTraversalResult {
    activity: Activity | null;
    endSequencingSession: boolean;
    exception?: string;
}
export declare class FlowTraversalService {
    private activityTree;
    private ruleEngine;
    constructor(activityTree: ActivityTree, ruleEngine: RuleEvaluationEngine);
    flowSubprocess(fromActivity: Activity, direction: FlowSubprocessMode): FlowSubprocessResult;
    flowTreeTraversalSubprocess(fromActivity: Activity, direction: FlowSubprocessMode, skipChildren?: boolean): FlowTreeTraversalResult;
    private traverseForward;
    private traverseBackward;
    private getLastDescendant;
    flowActivityTraversalSubprocess(activity: Activity, _direction: boolean, considerChildren: boolean, mode: FlowSubprocessMode): Activity | null;
    checkActivityProcess(activity: Activity): boolean;
    ensureSelectionAndRandomization(activity: Activity): void;
    private isActivityLastOverall;
    private terminateDescendentAttempts;
    findFirstDeliverableActivity(cluster: Activity): Activity | null;
    canDeliver(activity: Activity): boolean;
}
//# sourceMappingURL=flow_traversal_service.d.ts.map