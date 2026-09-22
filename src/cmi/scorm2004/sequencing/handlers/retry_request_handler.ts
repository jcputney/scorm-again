import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { FlowTraversalService } from "../traversal/flow_traversal_service";
import {
  SequencingResult,
  DeliveryRequestType
} from "../rules/sequencing_request_types";

/**
 * RetryRequestHandler - Handles retry sequencing requests
 *
 * This handler manages:
 * - RETRY: Retry the current activity
 * - RETRY_ALL: Retry from the beginning
 */
export class RetryRequestHandler {
  constructor(
    private activityTree: ActivityTree,
    private traversalService: FlowTraversalService
  ) {}

  /**
   * Retry Sequencing Request Process (SB.2.10)
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   * @spec SN Book: SB.2.10 step 3 (Retry Sequencing Request Process) - apply Flow once to a cluster and preserve its failure.
   */
  public handleRetry(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // SB.2.10 step 2: Check if activity is still active or suspended
    if (currentActivity.isActive || currentActivity.isSuspended) {
      result.exception = "SB.2.10-2";
      return result;
    }

    // SB.2.10 step 3: If current activity is not a leaf (is a cluster)
    // @spec SN Book: SB.2.10 step 3; SB.2.2 steps 3, 5.1 - only Skip may advance past a candidate within the retried cluster.
    if (currentActivity.children.length > 0) {
      const flowResult = this.traversalService.findFirstDeliverableActivityResult(
        currentActivity,
        currentActivity,
      );

      // @spec SN Book: SB.2.10 step 3.2 - preserve the Flow Subprocess exception when present.
      if (!flowResult.deliverable || !flowResult.identifiedActivity) {
        result.exception = flowResult.exception || "SB.2.10-3";
        return result;
      }

      // SB.2.10 step 3.3: Deliver the activity identified by flow subprocess
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = flowResult.identifiedActivity;
      return result;
    }

    // SB.2.10 step 4: Activity is a leaf - terminate and deliver it again
    this.terminateDescendentAttempts(currentActivity);

    // Deliver the activity again
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = currentActivity;
    return result;
  }

  /**
   * Retry All Sequencing Request Process
   * Clears current activity and restarts from the root
   * @return {SequencingResult}
   * @spec SN Book: SB.2.10; SB.2.5 steps 3.2, 3.2.1 - restart with one Forward Flow Subprocess and retain its exception.
   */
  public handleRetryAll(): SequencingResult {
    // Clear current activity to allow restart
    this.activityTree.currentActivity = null;

    // Find first deliverable activity from root
    if (!this.activityTree.root) {
      const result = new SequencingResult();
      result.exception = "SB.2.10-1";
      return result;
    }

    const flowResult = this.traversalService.findFirstDeliverableActivityResult(
      this.activityTree.root,
    );

    const result = new SequencingResult();
    // @spec SN Book: SB.2.10 step 3.2; SB.2.2 step 5.1 - report blocked flow instead of trying a later child.
    if (!flowResult.deliverable || !flowResult.identifiedActivity) {
      result.exception = flowResult.exception || "SB.2.10-3";
      return result;
    }

    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = flowResult.identifiedActivity;
    return result;
  }

  /**
   * Terminate descendent attempts (simplified)
   * @param {Activity} activity - The activity
   */
  private terminateDescendentAttempts(activity: Activity): void {
    activity.isActive = false;
    for (const child of activity.children) {
      this.terminateDescendentAttempts(child);
    }
  }
}
