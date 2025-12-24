import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { FlowTraversalService } from "../traversal/flow_traversal_service";
import { SequencingResult } from "../rules/sequencing_request_types";
export declare class FlowRequestHandler {
    private activityTree;
    private traversalService;
    constructor(activityTree: ActivityTree, traversalService: FlowTraversalService);
    handleStart(): SequencingResult;
    handleResumeAll(): SequencingResult;
    handleContinue(currentActivity: Activity): SequencingResult;
    handlePrevious(currentActivity: Activity): SequencingResult;
    private checkForwardOnlyViolation;
}
//# sourceMappingURL=flow_request_handler.d.ts.map