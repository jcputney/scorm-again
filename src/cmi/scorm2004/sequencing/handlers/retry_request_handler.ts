import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { FlowTraversalService } from "../traversal/flow_traversal_service";
import {
  SequencingResult,
  DeliveryRequestType,
  FlowSubprocessMode
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
   */
  public handleRetry(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // SB.2.10 step 2: Check if activity is still active or suspended
    if (currentActivity.isActive || currentActivity.isSuspended) {
      result.exception = "SB.2.10-2";
      return result;
    }

    // SB.2.10 step 3: If current activity is not a leaf (is a cluster)
    if (currentActivity.children.length > 0) {
      // Apply flow subprocess to find deliverable activity
      this.traversalService.ensureSelectionAndRandomization(currentActivity);
      const availableChildren = currentActivity.getAvailableChildren();

      let deliverableActivity: Activity | null = null;

      // Try each child using flowActivityTraversalSubprocess
      for (const child of availableChildren) {
        deliverableActivity = this.traversalService.flowActivityTraversalSubprocess(
          child,
          true,
          true,
          FlowSubprocessMode.FORWARD
        );
        if (deliverableActivity) {
          break;
        }
      }

      // SB.2.10 step 3.2: If flow subprocess returned false
      if (!deliverableActivity) {
        result.exception = "SB.2.10-3";
        return result;
      }

      // SB.2.10 step 3.3: Deliver the activity identified by flow subprocess
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = deliverableActivity;
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

    const deliverableActivity = this.traversalService.findFirstDeliverableActivity(
      this.activityTree.root
    );

    const result = new SequencingResult();
    if (!deliverableActivity) {
      result.exception = "SB.2.10-3";
      return result;
    }

    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = deliverableActivity;
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
