import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingRules, RuleActionType } from "./sequencing_rules";
import { SequencingControls } from "./sequencing_controls";
import { ADLNav } from "../adl";

/**
 * Enum for sequencing request types
 */
export enum SequencingRequestType {
  START = "start",
  RESUME_ALL = "resumeAll",
  CONTINUE = "continue",
  PREVIOUS = "previous",
  CHOICE = "choice",
  JUMP = "jump",
  EXIT = "exit",
  EXIT_ALL = "exitAll",
  ABANDON = "abandon",
  ABANDON_ALL = "abandonAll",
  SUSPEND_ALL = "suspendAll",
  RETRY = "retry",
  RETRY_ALL = "retryAll",
}

/**
 * Enum for delivery request types
 */
export enum DeliveryRequestType {
  DELIVER = "deliver",
  DO_NOT_DELIVER = "doNotDeliver",
}

/**
 * Class representing the result of a sequencing process
 */
export class SequencingResult {
  public deliveryRequest: DeliveryRequestType;
  public targetActivity: Activity | null;
  public exception: string | null;

  constructor(
    deliveryRequest: DeliveryRequestType = DeliveryRequestType.DO_NOT_DELIVER,
    targetActivity: Activity | null = null,
    exception: string | null = null,
  ) {
    this.deliveryRequest = deliveryRequest;
    this.targetActivity = targetActivity;
    this.exception = exception;
  }
}

/**
 * Class implementing SCORM 2004 sequencing processes
 */
export class SequencingProcess {
  private activityTree: ActivityTree;
  private sequencingRules: SequencingRules;
  private sequencingControls: SequencingControls;
  private adlNav: ADLNav | null;

  constructor(
    activityTree: ActivityTree,
    sequencingRules: SequencingRules,
    sequencingControls: SequencingControls,
    adlNav: ADLNav | null = null,
  ) {
    this.activityTree = activityTree;
    this.sequencingRules = sequencingRules;
    this.sequencingControls = sequencingControls;
    this.adlNav = adlNav;
  }

  /**
   * Main Sequencing Request Process (SB.2.12)
   * This is the main entry point for all navigation requests
   * @param {SequencingRequestType} request - The sequencing request
   * @param {string} targetActivityId - The target activity ID (for choice/jump)
   * @return {SequencingResult} - The result of the sequencing process
   */
  public sequencingRequestProcess(
    request: SequencingRequestType,
    targetActivityId: string | null = null,
  ): SequencingResult {
    // Initialize result
    const result = new SequencingResult();

    // Get current activity
    const currentActivity = this.activityTree.currentActivity;
    const suspendedActivity = this.activityTree.suspendedActivity;

    // Process based on request type
    switch (request) {
      case SequencingRequestType.START:
        return this.startSequencingRequestProcess();

      case SequencingRequestType.RESUME_ALL:
        return this.resumeAllSequencingRequestProcess();

      case SequencingRequestType.CONTINUE:
        if (!currentActivity) {
          result.exception = "SB.2.12-1"; // No current activity
          return result;
        }
        return this.continueSequencingRequestProcess(currentActivity);

      case SequencingRequestType.PREVIOUS:
        if (!currentActivity) {
          result.exception = "SB.2.12-1"; // No current activity
          return result;
        }
        return this.previousSequencingRequestProcess(currentActivity);

      case SequencingRequestType.CHOICE:
        if (!targetActivityId) {
          result.exception = "SB.2.12-5"; // No target specified
          return result;
        }
        return this.choiceSequencingRequestProcess(targetActivityId, currentActivity);

      case SequencingRequestType.JUMP:
        if (!targetActivityId) {
          result.exception = "SB.2.12-5"; // No target specified
          return result;
        }
        return this.jumpSequencingRequestProcess(targetActivityId);

      case SequencingRequestType.EXIT:
        if (!currentActivity) {
          result.exception = "SB.2.12-1"; // No current activity
          return result;
        }
        return this.exitSequencingRequestProcess(currentActivity);

      case SequencingRequestType.EXIT_ALL:
        if (!currentActivity) {
          result.exception = "SB.2.12-1"; // No current activity
          return result;
        }
        return this.exitAllSequencingRequestProcess();

      case SequencingRequestType.ABANDON:
        if (!currentActivity) {
          result.exception = "SB.2.12-1"; // No current activity
          return result;
        }
        return this.abandonSequencingRequestProcess(currentActivity);

      case SequencingRequestType.ABANDON_ALL:
        if (!currentActivity) {
          result.exception = "SB.2.12-1"; // No current activity
          return result;
        }
        return this.abandonAllSequencingRequestProcess();

      case SequencingRequestType.SUSPEND_ALL:
        if (!currentActivity) {
          result.exception = "SB.2.12-1"; // No current activity
          return result;
        }
        return this.suspendAllSequencingRequestProcess(currentActivity);

      case SequencingRequestType.RETRY:
        if (!currentActivity) {
          result.exception = "SB.2.12-1"; // No current activity
          return result;
        }
        return this.retrySequencingRequestProcess(currentActivity);

      case SequencingRequestType.RETRY_ALL:
        return this.retryAllSequencingRequestProcess();

      default:
        result.exception = "SB.2.12-6"; // Undefined sequencing request
        return result;
    }
  }

  /**
   * Start Sequencing Request Process (SB.2.5)
   * Determines the first activity to deliver when starting
   * @return {SequencingResult}
   */
  private startSequencingRequestProcess(): SequencingResult {
    const result = new SequencingResult();
    const root = this.activityTree.root;

    if (!root) {
      result.exception = "SB.2.5-1"; // No activity tree
      return result;
    }

    // Check if sequencing session has already begun
    if (this.activityTree.currentActivity !== null) {
      result.exception = "SB.2.5-2"; // Sequencing session already begun
      return result;
    }

    // Flow from root to find first available activity
    const flowResult = this.flowActivityTraversalSubprocess(
      root,
      true, // direction forward
      true, // consider children (we want to flow into the root's children)
      FlowSubprocessMode.FORWARD,
    );

    if (!flowResult) {
      result.exception = "SB.2.5-3"; // No activity available
      return result;
    }

    // Deliver the identified activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = flowResult;
    return result;
  }

  /**
   * Resume All Sequencing Request Process (SB.2.6)
   * Resumes a suspended session
   * @return {SequencingResult}
   */
  private resumeAllSequencingRequestProcess(): SequencingResult {
    const result = new SequencingResult();
    const suspendedActivity = this.activityTree.suspendedActivity;

    if (!suspendedActivity) {
      result.exception = "SB.2.6-1"; // No suspended activity
      return result;
    }

    if (this.activityTree.currentActivity !== null) {
      result.exception = "SB.2.6-2"; // Current activity already defined
      return result;
    }

    // Deliver the suspended activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = suspendedActivity;
    return result;
  }

  /**
   * Continue Sequencing Request Process (SB.2.7)
   * Processes continue navigation request
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  private continueSequencingRequestProcess(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // Check if the current activity has been terminated
    if (!currentActivity.isActive) {
      result.exception = "SB.2.7-1"; // Current activity not terminated
      return result;
    }

    // Flow from current activity to find next
    const flowResult = this.flowActivityTraversalSubprocess(
      currentActivity,
      false, // direction not forward (from current)
      false, // don't consider children
      FlowSubprocessMode.FORWARD,
    );

    if (!flowResult) {
      result.exception = "SB.2.7-2"; // No activity available
      return result;
    }

    // Check if we can deliver the activity
    const checkResult = this.checkActivityProcess(flowResult);
    if (!checkResult) {
      // End the attempt on the current activity
      this.terminateDescendentAttemptsProcess(currentActivity);
      // Sequencing ends with no delivery
      return result;
    }

    // Deliver the identified activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = flowResult;
    return result;
  }

  /**
   * Previous Sequencing Request Process (SB.2.8)
   * Processes previous navigation request
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  private previousSequencingRequestProcess(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // Check if the current activity has been terminated
    if (!currentActivity.isActive) {
      result.exception = "SB.2.8-1"; // Current activity not terminated
      return result;
    }

    // Flow from current activity to find previous
    const flowResult = this.flowActivityTraversalSubprocess(
      currentActivity,
      false, // direction not forward (from current)
      false, // don't consider children
      FlowSubprocessMode.BACKWARD,
    );

    if (!flowResult) {
      result.exception = "SB.2.8-2"; // No activity available
      return result;
    }

    // Check if we can deliver the activity
    const checkResult = this.checkActivityProcess(flowResult);
    if (!checkResult) {
      // End the attempt on the current activity
      this.terminateDescendentAttemptsProcess(currentActivity);
      // Sequencing ends with no delivery
      return result;
    }

    // Deliver the identified activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = flowResult;
    return result;
  }

  /**
   * Choice Sequencing Request Process (SB.2.9)
   * Processes choice navigation request
   * @param {string} targetActivityId - The target activity ID
   * @param {Activity | null} currentActivity - The current activity
   * @return {SequencingResult}
   */
  private choiceSequencingRequestProcess(
    targetActivityId: string,
    currentActivity: Activity | null,
  ): SequencingResult {
    const result = new SequencingResult();

    // Find the target activity
    let targetActivity = this.activityTree.getActivity(targetActivityId);
    if (!targetActivity) {
      result.exception = "SB.2.9-1"; // Target activity does not exist
      return result;
    }

    // Check if target is in the activity tree
    if (!this.isActivityInTree(targetActivity)) {
      result.exception = "SB.2.9-2"; // Target activity not in tree
      return result;
    }

    // Cannot choose the root activity
    if (targetActivity === this.activityTree.root) {
      result.exception = "SB.2.9-3"; // Cannot choose root
      return result;
    }

    // Path to root validation
    let activity: Activity | null = targetActivity;
    while (activity) {
      if (activity.isHiddenFromChoice) {
        result.exception = "SB.2.9-4"; // Activity hidden from choice
        return result;
      }

      // Check if choice control is constrained
      if (activity.parent && !activity.parent.sequencingControls.choice) {
        result.exception = "SB.2.9-5"; // Choice control is not allowed
        return result;
      }

      activity = activity.parent;
    }

    // Check if current activity needs to be terminated
    if (currentActivity && currentActivity.isActive) {
      result.exception = "SB.2.9-6"; // Current activity not terminated
      return result;
    }

    // Find common ancestor
    const commonAncestor = this.findCommonAncestor(currentActivity, targetActivity);

    // Terminate descendent attempts from common ancestor
    if (currentActivity) {
      this.terminateDescendentAttemptsProcess(commonAncestor || this.activityTree.root!);
    }

    // Form the activity path from target to common ancestor
    const activityPath: Activity[] = [];
    activity = targetActivity;
    while (activity && activity !== commonAncestor) {
      activityPath.unshift(activity);
      activity = activity.parent;
    }

    // Evaluate each activity in the path
    for (const pathActivity of activityPath) {
      if (!this.checkActivityProcess(pathActivity)) {
        // Sequencing ends with no delivery
        return result;
      }
    }

    // If target is not a leaf, flow forward to find a leaf
    if (targetActivity.children.length > 0) {
      const flowResult = this.flowActivityTraversalSubprocess(
        targetActivity,
        true, // direction forward
        true, // consider children
        FlowSubprocessMode.FORWARD,
      );

      if (!flowResult) {
        result.exception = "SB.2.9-7"; // No activity available from target
        return result;
      }

      targetActivity = flowResult;
    }

    // Deliver the identified activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = targetActivity;
    return result;
  }

  /**
   * Jump Sequencing Request Process (SB.2.13)
   * Processes jump navigation request - SCORM 2004 4th Edition
   * @param {string} targetActivityId - The target activity ID
   * @return {SequencingResult}
   */
  private jumpSequencingRequestProcess(targetActivityId: string): SequencingResult {
    const result = new SequencingResult();

    // Find the target activity
    const targetActivity = this.activityTree.getActivity(targetActivityId);
    if (!targetActivity) {
      result.exception = "SB.2.13-1"; // Target activity does not exist
      return result;
    }

    // Check if target is in the activity tree
    if (!this.isActivityInTree(targetActivity)) {
      result.exception = "SB.2.13-2"; // Target activity not in tree
      return result;
    }

    // Check if target is available
    if (!targetActivity.isAvailable) {
      result.exception = "SB.2.13-3"; // Target not available
      return result;
    }

    // Deliver the target activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = targetActivity;
    return result;
  }

  /**
   * Exit Sequencing Request Process
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  private exitSequencingRequestProcess(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // Check if exit is allowed
    if (!currentActivity.parent) {
      result.exception = "SB.2.11-1"; // Exit not allowed - no parent
      return result;
    }
    
    // Check parent's sequencing controls
    if (!currentActivity.parent.sequencingControls.choiceExit) {
      result.exception = "SB.2.11-2"; // Exit not allowed by sequencing controls
      return result;
    }

    // Terminate current activity
    this.terminateDescendentAttemptsProcess(currentActivity);

    return result;
  }

  /**
   * Exit All Sequencing Request Process
   * @return {SequencingResult}
   */
  private exitAllSequencingRequestProcess(): SequencingResult {
    const result = new SequencingResult();

    // Terminate all activities
    if (this.activityTree.root) {
      this.terminateDescendentAttemptsProcess(this.activityTree.root);
    }

    return result;
  }

  /**
   * Abandon Sequencing Request Process
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  private abandonSequencingRequestProcess(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // Set current activity as abandoned
    currentActivity.isActive = false;
    this.activityTree.currentActivity = currentActivity.parent;

    return result;
  }

  /**
   * Abandon All Sequencing Request Process
   * @return {SequencingResult}
   */
  private abandonAllSequencingRequestProcess(): SequencingResult {
    const result = new SequencingResult();

    // Abandon all activities
    this.activityTree.currentActivity = null;

    return result;
  }

  /**
   * Suspend All Sequencing Request Process
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  private suspendAllSequencingRequestProcess(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // Check if suspend is allowed
    if (currentActivity !== this.activityTree.root) {
      currentActivity.isSuspended = true;
      this.activityTree.suspendedActivity = currentActivity;
      this.activityTree.currentActivity = null;
    } else {
      result.exception = "SB.2.15-1"; // Cannot suspend root
    }

    return result;
  }

  /**
   * Retry Sequencing Request Process
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  private retrySequencingRequestProcess(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // Terminate current activity
    this.terminateDescendentAttemptsProcess(currentActivity);

    // Increment attempt count
    currentActivity.incrementAttemptCount();

    // Deliver the activity again
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = currentActivity;
    return result;
  }

  /**
   * Retry All Sequencing Request Process
   * @return {SequencingResult}
   */
  private retryAllSequencingRequestProcess(): SequencingResult {
    // Restart from the root
    return this.startSequencingRequestProcess();
  }

  /**
   * Flow Activity Traversal Subprocess (SB.2.1)
   * Identifies the next activity in the activity tree
   */
  private flowActivityTraversalSubprocess(
    activity: Activity,
    _direction: boolean,
    considerChildren: boolean,
    mode: FlowSubprocessMode,
  ): Activity | null {
    if (mode === FlowSubprocessMode.FORWARD) {
      // If we should consider children and the activity has children
      if (considerChildren && activity.children.length > 0) {
        // Flow to first child
        return activity.children[0] || null;
      }
      
      // Try to get next sibling
      let nextSibling = this.activityTree.getNextSibling(activity);
      if (nextSibling) {
        return nextSibling;
      }
      
      // No next sibling, traverse up the tree
      let parent = activity.parent;
      while (parent) {
        nextSibling = this.activityTree.getNextSibling(parent);
        if (nextSibling) {
          return nextSibling;
        }
        parent = parent.parent;
      }
      
      return null;
    } else {
      // Backward flow
      const previousSibling = this.activityTree.getPreviousSibling(activity);
      if (previousSibling) {
        // If the previous sibling has children, flow to the last child
        if (previousSibling.children.length > 0) {
          let lastChild: Activity | undefined = previousSibling.children[previousSibling.children.length - 1];
          // Continue flowing to the last descendant
          while (lastChild && lastChild.children.length > 0) {
            lastChild = lastChild.children[lastChild.children.length - 1];
          }
          return lastChild || null;
        }
        return previousSibling;
      }
      
      // No previous sibling, return parent
      return activity.parent;
    }
  }

  /**
   * Check Activity Process (SB.2.3)
   * Validates if an activity can be delivered
   */
  private checkActivityProcess(activity: Activity): boolean {
    // Check if activity is available
    if (!activity.isAvailable) {
      return false;
    }

    // Check limit conditions
    if (activity.hasAttemptLimitExceeded()) {
      return false;
    }

    // Evaluate pre-condition rules
    const preConditionResult = this.sequencingRules.evaluatePreConditionRules(activity);
    return preConditionResult !== RuleActionType.SKIP && 
           preConditionResult !== RuleActionType.DISABLED;
  }

  /**
   * Terminate Descendent Attempts Process (SB.2.4)
   * Ends attempts on an activity and its descendants
   */
  private terminateDescendentAttemptsProcess(activity: Activity): void {
    // End attempt on the activity
    activity.isActive = false;

    // Recursively terminate descendants
    for (const child of activity.children) {
      this.terminateDescendentAttemptsProcess(child);
    }
  }

  /**
   * Check if activity is in the activity tree
   */
  private isActivityInTree(activity: Activity): boolean {
    return this.activityTree.getAllActivities().includes(activity);
  }

  /**
   * Find common ancestor of two activities
   */
  private findCommonAncestor(activity1: Activity | null, activity2: Activity | null): Activity | null {
    if (!activity1 || !activity2) {
      return null;
    }

    // Get ancestors of activity1
    const ancestors1: Activity[] = [];
    let current: Activity | null = activity1;
    while (current) {
      ancestors1.push(current);
      current = current.parent;
    }

    // Find first common ancestor
    current = activity2;
    while (current) {
      if (ancestors1.includes(current)) {
        return current;
      }
      current = current.parent;
    }

    return null;
  }
}

/**
 * Enum for flow subprocess modes
 */
enum FlowSubprocessMode {
  FORWARD = "forward",
  BACKWARD = "backward",
}