import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { FlowTraversalService } from "../traversal/flow_traversal_service";
import {
  SequencingResult,
  DeliveryRequestType,
  FlowSubprocessMode
} from "../rules/sequencing_request_types";

/**
 * FlowRequestHandler - Handles flow-based sequencing requests
 *
 * This handler manages:
 * - START: Start a new sequencing session
 * - RESUME_ALL: Resume a suspended sequencing session
 * - CONTINUE: Navigate to the next activity (forward flow)
 * - PREVIOUS: Navigate to the previous activity (backward flow)
 */
export class FlowRequestHandler {
  constructor(
    private activityTree: ActivityTree,
    private traversalService: FlowTraversalService
  ) {}

  /**
   * Start Sequencing Request Process (SB.2.5)
   * Initiates a new sequencing session from the root
   * @return {SequencingResult}
   */
  public handleStart(): SequencingResult {
    const result = new SequencingResult();

    // Check if there's already a current activity
    if (this.activityTree.currentActivity) {
      result.exception = "SB.2.5-1";
      return result;
    }

    // Check if there's a root
    if (!this.activityTree.root) {
      result.exception = "SB.2.5-2";
      return result;
    }

    // Find the first deliverable activity
    const deliverableActivity = this.traversalService.findFirstDeliverableActivity(
      this.activityTree.root
    );

    if (!deliverableActivity) {
      result.exception = "SB.2.5-3";
      return result;
    }

    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = deliverableActivity;
    return result;
  }

  /**
   * Resume All Sequencing Request Process (SB.2.6)
   * Resumes a suspended sequencing session
   * @return {SequencingResult}
   */
  public handleResumeAll(): SequencingResult {
    const result = new SequencingResult();

    // Check if there's a suspended activity
    if (!this.activityTree.suspendedActivity) {
      result.exception = "SB.2.6-1";
      return result;
    }

    // Check if there's already a current activity
    if (this.activityTree.currentActivity) {
      result.exception = "SB.2.6-2";
      return result;
    }

    // Resume the suspended activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = this.activityTree.suspendedActivity;
    return result;
  }

  /**
   * Continue Sequencing Request Process (SB.2.7)
   * Navigates to the next activity in forward flow
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  public handleContinue(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // SB.2.7-1: Activity must be terminated (not active)
    if (currentActivity.isActive) {
      result.exception = "SB.2.7-1";
      return result;
    }

    // SB.2.7-2: Check flow control
    if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
      result.exception = "SB.2.7-2";
      return result;
    }

    // Use flow subprocess to find next deliverable
    const flowResult = this.traversalService.flowSubprocess(
      currentActivity,
      FlowSubprocessMode.FORWARD
    );

    // Check for end of session
    if (flowResult.endSequencingSession) {
      result.endSequencingSession = true;
      return result;
    }

    // Check if we found a deliverable activity
    if (!flowResult.deliverable || !flowResult.identifiedActivity) {
      result.exception = flowResult.exception || "SB.2.7-3";
      return result;
    }

    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = flowResult.identifiedActivity;
    return result;
  }

  /**
   * Previous Sequencing Request Process (SB.2.8)
   * Navigates to the previous activity in backward flow
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  public handlePrevious(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // SB.2.8-1: Activity must be terminated (not active)
    if (currentActivity.isActive) {
      result.exception = "SB.2.8-1";
      return result;
    }

    // SB.2.8-2: Check flow control
    if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
      result.exception = "SB.2.8-2";
      return result;
    }

    // Check forwardOnly at all ancestor levels
    const forwardOnlyViolation = this.checkForwardOnlyViolation(currentActivity);
    if (forwardOnlyViolation) {
      result.exception = forwardOnlyViolation;
      return result;
    }

    // Use flow subprocess to find previous deliverable
    const flowResult = this.traversalService.flowSubprocess(
      currentActivity,
      FlowSubprocessMode.BACKWARD
    );

    // Check if we found a deliverable activity
    if (!flowResult.deliverable || !flowResult.identifiedActivity) {
      result.exception = flowResult.exception || "SB.2.8-3";
      return result;
    }

    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = flowResult.identifiedActivity;
    return result;
  }

  /**
   * Check forwardOnly violation at all ancestor levels
   * @param {Activity} activity - The activity to check
   * @return {string | null} - Exception code or null
   */
  private checkForwardOnlyViolation(activity: Activity): string | null {
    let current: Activity | null = activity.parent;

    while (current) {
      if (current.sequencingControls.forwardOnly) {
        return "SB.2.9-5";
      }
      current = current.parent;
    }

    return null;
  }
}
