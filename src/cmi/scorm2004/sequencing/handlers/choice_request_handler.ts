import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { ActivityTreeQueries } from "../utils/activity_tree_queries";
import { ChoiceConstraintValidator } from "../validators/choice_constraint_validator";
import { FlowTraversalService } from "../traversal/flow_traversal_service";
import {
  SequencingResult,
  DeliveryRequestType,
  ChoiceTraversalResult
} from "../rules/sequencing_request_types";

/**
 * ChoiceRequestHandler - Handles choice-based sequencing requests
 *
 * This handler manages:
 * - CHOICE: Navigate to a specific activity selected by the learner
 * - JUMP: Navigate directly to a specific activity (4th Edition)
 *
 * Choice navigation is more complex than flow navigation because it must
 * validate many constraints at each ancestor level.
 */
export class ChoiceRequestHandler {
  constructor(
    private activityTree: ActivityTree,
    private constraintValidator: ChoiceConstraintValidator,
    private traversalService: FlowTraversalService,
    private treeQueries: ActivityTreeQueries
  ) {}

  /**
   * Choice Sequencing Request Process (SB.2.9)
   * Processes a choice navigation request to a specific activity
   * @param {string} targetActivityId - The target activity ID
   * @param {Activity | null} currentActivity - Current activity (may be null)
   * @return {SequencingResult}
   */
  public handleChoice(
    targetActivityId: string,
    currentActivity: Activity | null
  ): SequencingResult {
    const result = new SequencingResult();

    // Find the target activity
    const targetActivity = this.activityTree.getActivity(targetActivityId);
    if (!targetActivity) {
      result.exception = "SB.2.9-1";
      return result;
    }

    // SB.2.9-6: Check if current activity is terminated
    if (currentActivity && currentActivity.isActive) {
      result.exception = "SB.2.9-6";
      return result;
    }

    // Validate choice constraints
    const validation = this.constraintValidator.validateChoice(
      currentActivity,
      targetActivity,
      { checkAvailability: true }
    );

    if (!validation.valid) {
      result.exception = validation.exception;
      return result;
    }

    // Find common ancestor
    const commonAncestor = this.treeQueries.findCommonAncestor(
      currentActivity,
      targetActivity
    );

    // Terminate descendent attempts from common ancestor
    if (currentActivity) {
      this.terminateDescendentAttemptsProcess(
        commonAncestor || this.activityTree.root!
      );
    }

    // Form the activity path from target to common ancestor
    const activityPath = this.buildActivityPath(targetActivity, commonAncestor);

    // Evaluate each activity in the path
    for (const pathActivity of activityPath) {
      if (!this.traversalService.checkActivityProcess(pathActivity)) {
        // Sequencing ends with no delivery
        return result;
      }
    }

    // If target is not a leaf, use choice flow to find a deliverable leaf
    let deliveryTarget = targetActivity;
    if (targetActivity.children.length > 0) {
      const flowResult = this.choiceFlowSubprocess(targetActivity);

      if (!flowResult) {
        result.exception = "SB.2.9-7";
        return result;
      }

      deliveryTarget = flowResult;
    }

    // Deliver the identified activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = deliveryTarget;
    return result;
  }

  /**
   * Jump Sequencing Request Process (SB.2.13)
   * Processes a jump navigation request (SCORM 2004 4th Edition)
   * Jump bypasses most sequencing rules
   * @param {string} targetActivityId - The target activity ID
   * @return {SequencingResult}
   */
  public handleJump(targetActivityId: string): SequencingResult {
    const result = new SequencingResult();

    // Find the target activity
    const targetActivity = this.activityTree.getActivity(targetActivityId);
    if (!targetActivity) {
      result.exception = "SB.2.13-1";
      return result;
    }

    // Check if target is in the activity tree
    if (!this.treeQueries.isInTree(targetActivity)) {
      result.exception = "SB.2.13-2";
      return result;
    }

    // Check if target is available
    if (!targetActivity.isAvailable) {
      result.exception = "SB.2.13-3";
      return result;
    }

    // Deliver the target activity directly
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = targetActivity;
    return result;
  }

  /**
   * Get all activities available for choice navigation
   * @return {Activity[]} - Array of available activities
   */
  public getAvailableChoices(): Activity[] {
    const allActivities = this.activityTree.getAllActivities();
    const currentActivity = this.activityTree.currentActivity;
    const availableActivities: Activity[] = [];

    for (const activity of allActivities) {
      // Skip root activity
      if (activity === this.activityTree.root) {
        continue;
      }

      // Skip if hidden, unavailable, or invisible
      if (activity.isHiddenFromChoice || !activity.isAvailable || !activity.isVisible) {
        continue;
      }

      // Check if choice is allowed by parent
      if (activity.parent && !activity.parent.sequencingControls.choice) {
        continue;
      }

      // Validate the full choice path
      const validation = this.constraintValidator.validateChoice(currentActivity, activity);
      if (validation.valid) {
        availableActivities.push(activity);
      }
    }

    return availableActivities;
  }

  /**
   * Build the activity path from target to common ancestor
   * @param {Activity} targetActivity - Target activity
   * @param {Activity | null} commonAncestor - Common ancestor
   * @return {Activity[]} - Path of activities
   */
  private buildActivityPath(
    targetActivity: Activity,
    commonAncestor: Activity | null
  ): Activity[] {
    const activityPath: Activity[] = [];
    let activity: Activity | null = targetActivity;

    while (activity && activity !== commonAncestor) {
      activityPath.unshift(activity);
      activity = activity.parent;
    }

    return activityPath;
  }

  /**
   * Choice Flow Subprocess (SB.2.9.1)
   * Handles the flow logic specific to choice navigation requests
   * @param {Activity} targetActivity - The target activity for the choice
   * @return {Activity | null} - The activity to deliver, or null if flow fails
   */
  private choiceFlowSubprocess(targetActivity: Activity): Activity | null {
    // If target is a leaf, it's the delivery candidate
    if (targetActivity.children.length === 0) {
      return targetActivity;
    }

    // If target is a cluster, traverse to find a deliverable leaf
    return this.choiceFlowTreeTraversal(targetActivity);
  }

  /**
   * Choice Flow Tree Traversal (SB.2.9.2)
   * Traverses into a cluster to find a deliverable leaf
   * @param {Activity} fromActivity - The cluster to traverse from
   * @return {Activity | null} - A leaf activity for delivery, or null
   */
  private choiceFlowTreeTraversal(fromActivity: Activity): Activity | null {
    this.traversalService.ensureSelectionAndRandomization(fromActivity);
    const children = fromActivity.getAvailableChildren();

    // Validate children against constraints
    const validChildren = this.constraintValidator.validateFlowConstraints(
      fromActivity,
      children
    );

    if (!validChildren.valid) {
      return null;
    }

    // Find the first deliverable child
    for (const child of validChildren.validChildren) {
      const traversalResult = this.enhancedChoiceTraversal(child);
      if (traversalResult.activity) {
        return traversalResult.activity;
      }
    }

    return null;
  }

  /**
   * Enhanced Choice Activity Traversal (SB.2.4)
   * Traverses with stopForwardTraversal and forwardOnly checks
   * @param {Activity} activity - The activity to traverse
   * @param {boolean} isBackwardTraversal - Whether this is backward traversal
   * @return {ChoiceTraversalResult} - Result with activity or exception
   */
  private enhancedChoiceTraversal(
    activity: Activity,
    isBackwardTraversal: boolean = false
  ): ChoiceTraversalResult {
    // Cannot walk backward from root
    if (isBackwardTraversal && activity === this.activityTree.root) {
      return new ChoiceTraversalResult(null, "SB.2.4-3");
    }

    // Check availability
    if (!activity.isAvailable) {
      return new ChoiceTraversalResult(null, null);
    }

    // Check hidden from choice
    if (activity.isHiddenFromChoice) {
      return new ChoiceTraversalResult(null, null);
    }

    // Check stopForwardTraversal
    if (activity.sequencingControls && activity.sequencingControls.stopForwardTraversal) {
      return new ChoiceTraversalResult(null, "SB.2.4-1");
    }

    // Validate traversal constraints
    const traversalValidation = this.constraintValidator.validateTraversalConstraints(activity);
    if (!traversalValidation.canTraverse) {
      return new ChoiceTraversalResult(null, null);
    }

    // If it's a leaf, check if it can be delivered
    if (activity.children.length === 0) {
      if (this.traversalService.checkActivityProcess(activity)) {
        return new ChoiceTraversalResult(activity, null);
      }
      return new ChoiceTraversalResult(null, null);
    }

    // Check constrainChoice for clusters
    if (
      activity.parent?.sequencingControls.constrainChoice &&
      !traversalValidation.canTraverseInto
    ) {
      return new ChoiceTraversalResult(null, "SB.2.4-2");
    }

    // Traverse into cluster
    if (traversalValidation.canTraverseInto) {
      const flowResult = this.choiceFlowTreeTraversal(activity);
      return new ChoiceTraversalResult(flowResult, null);
    }

    return new ChoiceTraversalResult(null, null);
  }

  /**
   * Terminate descendent attempts (simplified)
   * @param {Activity} activity - The activity
   */
  private terminateDescendentAttemptsProcess(activity: Activity): void {
    activity.isActive = false;
    for (const child of activity.children) {
      this.terminateDescendentAttemptsProcess(child);
    }
  }
}
