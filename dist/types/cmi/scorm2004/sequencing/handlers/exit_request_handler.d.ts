import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { RuleEvaluationEngine } from "../rules/rule_evaluation_engine";
import { SequencingResult } from "../rules/sequencing_request_types";
export declare class ExitRequestHandler {
    private activityTree;
    private ruleEngine;
    constructor(activityTree: ActivityTree, ruleEngine: RuleEvaluationEngine);
    handleExit(currentActivity: Activity): SequencingResult;
    handleExitAll(): SequencingResult;
    handleAbandon(currentActivity: Activity): SequencingResult;
    handleAbandonAll(): SequencingResult;
    handleSuspendAll(currentActivity: Activity): SequencingResult;
    terminateDescendentAttempts(activity: Activity, skipExitRules?: boolean): void;
    private processDeferredExitAction;
}
//# sourceMappingURL=exit_request_handler.d.ts.map