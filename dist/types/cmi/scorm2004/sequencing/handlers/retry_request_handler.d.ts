import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { FlowTraversalService } from "../traversal/flow_traversal_service";
import { SequencingResult } from "../rules/sequencing_request_types";
export declare class RetryRequestHandler {
    private activityTree;
    private traversalService;
    constructor(activityTree: ActivityTree, traversalService: FlowTraversalService);
    handleRetry(currentActivity: Activity): SequencingResult;
    handleRetryAll(): SequencingResult;
    private terminateDescendentAttempts;
}
//# sourceMappingURL=retry_request_handler.d.ts.map