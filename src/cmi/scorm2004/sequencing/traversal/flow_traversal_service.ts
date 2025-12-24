import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { RuleEvaluationEngine } from "../rules/rule_evaluation_engine";
import {
  FlowSubprocessResult,
  FlowSubprocessMode
} from "../rules/sequencing_request_types";
import { SelectionRandomization } from "../selection_randomization";

/**
 * Result of flow tree traversal
 */
export interface FlowTreeTraversalResult {
  activity: Activity | null;
  endSequencingSession: boolean;
  exception?: string;
}

/**
 * FlowTraversalService - Handles tree traversal for flow-based navigation
 *
 * This class extracts the flow traversal logic from SequencingProcess:
 * - SB.2.1: Flow Tree Traversal Subprocess
 * - SB.2.2: Flow Activity Traversal Subprocess
 * - SB.2.3: Flow Subprocess
 * - Activity checking and delivery validation
 *
 * Flow traversal is used for:
 * - CONTINUE navigation (forward flow)
 * - PREVIOUS navigation (backward flow)
 * - Finding the first deliverable activity from a cluster
 */
export class FlowTraversalService {
  constructor(
    private activityTree: ActivityTree,
    private ruleEngine: RuleEvaluationEngine
  ) {}

  /**
   * Flow Subprocess (SB.2.3)
   * Traverses the activity tree in the specified direction to find a deliverable activity
   * @param {Activity} fromActivity - The activity to flow from
   * @param {FlowSubprocessMode} direction - The flow direction
   * @return {FlowSubprocessResult} - Result containing the deliverable activity
   */
  public flowSubprocess(
    fromActivity: Activity,
    direction: FlowSubprocessMode
  ): FlowSubprocessResult {
    let candidateActivity: Activity | null = fromActivity;
    let firstIteration = true;
    let lastCandidateHadNoChildren = false;

    while (candidateActivity) {
      const traversalResult = this.flowTreeTraversalSubprocess(
        candidateActivity,
        direction,
        firstIteration
      );

      if (!traversalResult.activity) {
        let exceptionCode: string | null = null;
        if (traversalResult.exception) {
          exceptionCode = traversalResult.exception;
        } else if (direction === FlowSubprocessMode.BACKWARD) {
          exceptionCode = "SB.2.1-3";
        } else if (lastCandidateHadNoChildren) {
          exceptionCode = "SB.2.1-2";
        }

        return new FlowSubprocessResult(
          candidateActivity,
          false,
          exceptionCode,
          traversalResult.endSequencingSession
        );
      }

      lastCandidateHadNoChildren =
        traversalResult.activity.children.length > 0 &&
        traversalResult.activity.getAvailableChildren().length === 0;

      const deliverable = this.flowActivityTraversalSubprocess(
        traversalResult.activity,
        direction === FlowSubprocessMode.FORWARD,
        true,
        direction
      );

      if (deliverable) {
        return new FlowSubprocessResult(deliverable, true, null, false);
      }

      candidateActivity = traversalResult.activity;
      firstIteration = false;
    }

    return new FlowSubprocessResult(null, false, null, false);
  }

  /**
   * Flow Tree Traversal Subprocess (SB.2.1)
   * Traverses the activity tree to find the next activity in the specified direction
   * @param {Activity} fromActivity - The activity to traverse from
   * @param {FlowSubprocessMode} direction - The traversal direction
   * @param {boolean} skipChildren - Whether to skip checking children
   * @return {FlowTreeTraversalResult} - The next activity and flags
   */
  public flowTreeTraversalSubprocess(
    fromActivity: Activity,
    direction: FlowSubprocessMode,
    skipChildren: boolean = false
  ): FlowTreeTraversalResult {
    if (direction === FlowSubprocessMode.FORWARD) {
      return this.traverseForward(fromActivity, skipChildren);
    } else {
      return this.traverseBackward(fromActivity);
    }
  }

  /**
   * Traverse forward in the activity tree
   * @param {Activity} fromActivity - Starting activity
   * @param {boolean} skipChildren - Whether to skip children
   * @return {FlowTreeTraversalResult}
   */
  private traverseForward(
    fromActivity: Activity,
    skipChildren: boolean
  ): FlowTreeTraversalResult {
    // Check if we're at the last activity
    if (skipChildren && this.isActivityLastOverall(fromActivity)) {
      // Terminate all descendent attempts at root
      if (this.activityTree.root) {
        this.terminateDescendentAttempts(this.activityTree.root);
      }
      return { activity: null, endSequencingSession: true };
    }

    // Check children first
    if (!skipChildren) {
      this.ensureSelectionAndRandomization(fromActivity);
      const children = fromActivity.getAvailableChildren();
      if (children.length > 0) {
        return { activity: children[0] || null, endSequencingSession: false };
      }
    }

    // No children, try to get next sibling
    let current: Activity | null = fromActivity;
    while (current) {
      const nextSibling = this.activityTree.getNextSibling(current);
      if (nextSibling) {
        return { activity: nextSibling, endSequencingSession: false };
      }
      current = current.parent;
    }

    // Reached end of tree
    if (this.activityTree.root) {
      this.terminateDescendentAttempts(this.activityTree.root);
    }
    return { activity: null, endSequencingSession: true };
  }

  /**
   * Traverse backward in the activity tree
   * @param {Activity} fromActivity - Starting activity
   * @return {FlowTreeTraversalResult}
   */
  private traverseBackward(fromActivity: Activity): FlowTreeTraversalResult {
    // Check forwardOnly constraint
    if (fromActivity.parent && fromActivity.parent.sequencingControls.forwardOnly) {
      return { activity: null, endSequencingSession: false, exception: "SB.2.1-4" };
    }

    // Try to get previous sibling
    const previousSibling = this.activityTree.getPreviousSibling(fromActivity);
    if (previousSibling) {
      return {
        activity: this.getLastDescendant(previousSibling),
        endSequencingSession: false
      };
    }

    // No previous sibling, try going up to parent
    let current: Activity | null = fromActivity;
    let ancestorIterations = 0;
    const maxIterations = 10000;

    while (current && current.parent) {
      if (++ancestorIterations > maxIterations) {
        throw new Error("Infinite loop detected in backward traversal");
      }

      const parentPreviousSibling = this.activityTree.getPreviousSibling(current.parent);
      if (parentPreviousSibling) {
        return {
          activity: this.getLastDescendant(parentPreviousSibling),
          endSequencingSession: false
        };
      }
      current = current.parent;
    }

    // Reached beginning of tree
    return { activity: null, endSequencingSession: false };
  }

  /**
   * Get the last descendant of an activity
   * @param {Activity} activity - The activity
   * @return {Activity} - The last descendant
   */
  private getLastDescendant(activity: Activity): Activity {
    let lastDescendant = activity;
    let iterations = 0;
    const maxIterations = 10000;

    while (true) {
      if (++iterations > maxIterations) {
        throw new Error("Infinite loop detected while getting last descendant");
      }

      this.ensureSelectionAndRandomization(lastDescendant);
      const children = lastDescendant.getAvailableChildren();
      if (children.length === 0) {
        break;
      }

      const lastChild = children[children.length - 1];
      if (!lastChild) break;
      lastDescendant = lastChild;
    }

    return lastDescendant;
  }

  /**
   * Flow Activity Traversal Subprocess (SB.2.2)
   * Checks if an activity can be delivered and flows into clusters if needed
   * @param {Activity} activity - The activity to check
   * @param {boolean} _direction - Direction (unused but part of spec)
   * @param {boolean} considerChildren - Whether to consider children
   * @param {FlowSubprocessMode} mode - The flow mode
   * @return {Activity | null} - The deliverable activity or null
   */
  public flowActivityTraversalSubprocess(
    activity: Activity,
    _direction: boolean,
    considerChildren: boolean,
    mode: FlowSubprocessMode
  ): Activity | null {
    // Check flow control
    const parent = activity.parent;
    if (parent && !parent.sequencingControls.flow) {
      return null;
    }

    // Check availability
    if (!activity.isAvailable) {
      return null;
    }

    // Check stopForwardTraversal for forward direction
    if (mode === FlowSubprocessMode.FORWARD &&
        activity.sequencingControls.stopForwardTraversal) {
      return null;
    }

    // If it's a cluster and we should consider children, try to flow into it
    if (considerChildren) {
      this.ensureSelectionAndRandomization(activity);
      const availableChildren = activity.getAvailableChildren();

      for (const child of availableChildren) {
        const deliverable = this.flowActivityTraversalSubprocess(
          child,
          mode === FlowSubprocessMode.FORWARD,
          true,
          mode
        );
        if (deliverable) {
          return deliverable;
        }
      }
    }

    // If it's a leaf, check if it can be delivered
    if (activity.children.length === 0) {
      if (this.checkActivityProcess(activity)) {
        return activity;
      }
      return null;
    }

    return null;
  }

  /**
   * Check Activity Process (SB.2.3)
   * Validates if an activity can be delivered
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if activity can be delivered
   */
  public checkActivityProcess(activity: Activity): boolean {
    // Check availability
    if (!activity.isAvailable) {
      return false;
    }

    // For leaf activities, check visibility
    if (activity.children.length === 0 && !activity.isVisible) {
      return false;
    }

    // Check limit conditions
    if (this.ruleEngine.checkLimitConditions(activity)) {
      return false;
    }

    // Check pre-condition rules
    const deliveryCheck = this.ruleEngine.canDeliverActivity(activity);
    activity.wasSkipped = deliveryCheck.wasSkipped;

    return deliveryCheck.canDeliver;
  }

  /**
   * Ensure selection and randomization is applied to an activity
   * @param {Activity} activity - The activity to process
   */
  public ensureSelectionAndRandomization(activity: Activity): void {
    if (
      activity.getAvailableChildren() === activity.children &&
      (SelectionRandomization.isSelectionNeeded(activity) ||
       SelectionRandomization.isRandomizationNeeded(activity))
    ) {
      SelectionRandomization.applySelectionAndRandomization(activity, activity.isNewAttempt);
    }
  }

  /**
   * Check if activity is the last activity in the tree (forward preorder)
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if last in tree
   */
  private isActivityLastOverall(activity: Activity): boolean {
    if (activity.children.length > 0) {
      return false;
    }

    let current: Activity | null = activity;
    while (current) {
      if (this.activityTree.getNextSibling(current)) {
        return false;
      }
      current = current.parent;
    }

    return true;
  }

  /**
   * Terminate descendent attempts (simplified version)
   * Full version with exit rules is in SequencingProcess
   * @param {Activity} activity - The activity
   */
  private terminateDescendentAttempts(activity: Activity): void {
    activity.isActive = false;
    for (const child of activity.children) {
      this.terminateDescendentAttempts(child);
    }
  }

  /**
   * Find the first deliverable activity from a cluster
   * Used for START and RETRY_ALL requests
   * @param {Activity} cluster - The cluster activity
   * @return {Activity | null} - The first deliverable activity
   */
  public findFirstDeliverableActivity(cluster: Activity): Activity | null {
    // If the cluster itself is a leaf (no children), check if it can be delivered
    if (cluster.children.length === 0) {
      if (this.checkActivityProcess(cluster)) {
        return cluster;
      }
      return null;
    }

    // Otherwise, look for a deliverable child
    this.ensureSelectionAndRandomization(cluster);
    const availableChildren = cluster.getAvailableChildren();

    for (const child of availableChildren) {
      const deliverable = this.flowActivityTraversalSubprocess(
        child,
        true,
        true,
        FlowSubprocessMode.FORWARD
      );
      if (deliverable) {
        return deliverable;
      }
    }

    return null;
  }

  /**
   * Can activity be delivered (public wrapper)
   * @param {Activity} activity - The activity
   * @return {boolean} - True if can be delivered
   */
  public canDeliver(activity: Activity): boolean {
    return this.checkActivityProcess(activity);
  }
}
