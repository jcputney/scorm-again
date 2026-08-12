import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { RuleEvaluationEngine } from "../rules/rule_evaluation_engine";
import { FlowSubprocessResult, FlowSubprocessMode } from "../rules/sequencing_request_types";
export interface FlowTreeTraversalResult {
    activity: Activity | null;
    endSequencingSession: boolean;
    exception?: string;
    direction?: FlowSubprocessMode;
    forwardOnlyCluster?: Activity;
}
export declare class FlowTraversalService {
    private activityTree;
    private ruleEngine;
    private endAttemptCallback;
    constructor(activityTree: ActivityTree, ruleEngine: RuleEvaluationEngine);
    setEndAttemptCallback(callback: (activity: Activity) => void): void;
    flowSubprocess(fromActivity: Activity, direction: FlowSubprocessMode): FlowSubprocessResult;
    flowTreeTraversalSubprocess(fromActivity: Activity, direction: FlowSubprocessMode, skipChildren?: boolean, forwardTraversalBoundary?: Activity | null): FlowTreeTraversalResult;
    private traverseForward;
    private endActiveClusterAttempt;
    private traverseBackward;
    private getBackwardTraversalEntry;
    private isDescendantOfOrSelf;
    flowActivityTraversalSubprocess(activity: Activity, _direction: boolean, considerChildren: boolean, mode: FlowSubprocessMode, forwardTraversalBoundary?: Activity | null): Activity | null;
    private continueFlowActivityTraversal;
    private checkSkippedRuleSet;
    checkActivityProcess(activity: Activity): boolean;
    ensureSelectionAndRandomization(activity: Activity): void;
    private isActivityLastOverall;
    private terminateDescendentAttempts;
    findFirstDeliverableActivity(cluster: Activity): Activity | null;
    canDeliver(activity: Activity): boolean;
}
//# sourceMappingURL=flow_traversal_service.d.ts.map