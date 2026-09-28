import { Activity } from "../activity.js";
import { ActivityTree } from "../activity_tree.js";
import { FlowTraversalService } from "../traversal/flow_traversal_service.js";
import { SequencingResult } from "../rules/sequencing_request_types.js";
export declare class RetryRequestHandler {
    private activityTree;
    private traversalService;
    constructor(activityTree: ActivityTree, traversalService: FlowTraversalService);
    handleRetry(currentActivity: Activity): SequencingResult;
    handleRetryAll(): SequencingResult;
    private terminateDescendentAttempts;
}
//# sourceMappingURL=retry_request_handler.d.ts.map