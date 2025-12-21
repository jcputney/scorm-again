import {Activity} from "./activity";
import {ActivityTree} from "./activity_tree";
import {
  RuleActionType,
  RuleConditionOperator,
  SequencingRule,
  SequencingRules
} from "./sequencing_rules";
import {SequencingControls} from "./sequencing_controls";
import {ADLNav} from "../adl";
import {getDurationAsSeconds} from "../../../utilities";
import {scorm2004_regex} from "../../../constants/regex";
import {SelectionRandomization} from "./selection_randomization";

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
  EXIT_PARENT = "exitParent",
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
  public endSequencingSession: boolean;

  constructor(
      deliveryRequest: DeliveryRequestType = DeliveryRequestType.DO_NOT_DELIVER,
      targetActivity: Activity | null = null,
      exception: string | null = null,
      endSequencingSession: boolean = false
  ) {
    this.deliveryRequest = deliveryRequest;
    this.targetActivity = targetActivity;
    this.exception = exception;
    this.endSequencingSession = endSequencingSession;
  }
}

/**
 * Result of Post-Condition Rule Evaluation (TB.2.2)
 * Contains both sequencing and termination requests from post-condition rules
 */
export interface PostConditionResult {
  sequencingRequest: SequencingRequestType | null;
  terminationRequest: SequencingRequestType | null;
}

/**
 * Result of Flow Subprocess (SB.2.3)
 * Used internally to propagate endSequencingSession flag through flow processes
 */
class FlowSubprocessResult {
  public identifiedActivity: Activity | null;
  public deliverable: boolean;
  public exception: string | null;
  public endSequencingSession: boolean;

  constructor(
      identifiedActivity: Activity | null,
      deliverable: boolean,
      exception: string | null = null,
      endSequencingSession: boolean = false
  ) {
    this.identifiedActivity = identifiedActivity;
    this.deliverable = deliverable;
    this.exception = exception;
    this.endSequencingSession = endSequencingSession;
  }
}

/**
 * Result of Choice Traversal Subprocess (SB.2.4)
 * Used internally to propagate exception information from choice traversal
 */
class ChoiceTraversalResult {
  public activity: Activity | null;
  public exception: string | null;

  constructor(activity: Activity | null, exception: string | null = null) {
    this.activity = activity;
    this.exception = exception;
  }
}

/**
 * Class implementing SCORM 2004 sequencing processes
 */
export class SequencingProcess {
  private activityTree: ActivityTree;
  private sequencingRules: SequencingRules | null;
  private sequencingControls: SequencingControls | null;
  private adlNav: ADLNav | null;
  private now: () => Date;
  private getAttemptElapsedSecondsHook: ((activity: Activity) => number) | undefined;
  private getActivityElapsedSecondsHook: ((activity: Activity) => number) | undefined;

  constructor(
      activityTree: ActivityTree,
      sequencingRules?: SequencingRules | null,
      sequencingControls?: SequencingControls | null,
      adlNav: ADLNav | null = null,
      options?: {
        now?: () => Date;
        getAttemptElapsedSeconds?: (activity: Activity) => number;
        getActivityElapsedSeconds?: (activity: Activity) => number;
      }
  ) {
    this.activityTree = activityTree;
    this.sequencingRules = sequencingRules || null;
    this.sequencingControls = sequencingControls || null;
    this.adlNav = adlNav;
    this.now = options?.now || (() => new Date());
    this.getAttemptElapsedSecondsHook = options?.getAttemptElapsedSeconds as
        | ((activity: Activity) => number)
        | undefined;
    this.getActivityElapsedSecondsHook = options?.getActivityElapsedSeconds as
        | ((activity: Activity) => number)
        | undefined;
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
      targetActivityId: string | null = null
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
   * Uses Flow Activity Traversal Subprocess (SB.2.2) to respect flow controls
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

    // Use Flow Activity Traversal Subprocess to find first deliverable activity
    // This ensures flow controls (flow=true, stopForwardTraversal) are respected
    // Start from root, forward direction, consider children
    const deliverableActivity = this.flowActivityTraversalSubprocess(
        root,
        true, // direction: forward
        true, // considerChildren: true
        FlowSubprocessMode.FORWARD
    );

    if (!deliverableActivity) {
      result.exception = "SB.2.5-3"; // No activity available
      return result;
    }

    // Deliver the identified activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = deliverableActivity;
    return result;
  }

  /**
   * Find First Deliverable Activity
   * Recursively searches from the given activity to find the first deliverable leaf
   * @deprecated This method is deprecated - use flowActivityTraversalSubprocess instead
   * @param {Activity} activity - The activity to start searching from
   * @return {Activity | null} - The first deliverable activity, or null if none found
   */
  private findFirstDeliverableActivity(activity: Activity): Activity | null {
    // Check if this activity can be delivered (leaf activity)
    if (activity.children.length === 0) {
      // This is a leaf - check if it can be delivered
      if (this.checkActivityProcess(activity)) {
        return activity;
      }
      return null;
    }

    // This is a cluster - look through children for deliverable activity
    this.ensureSelectionAndRandomization(activity);
    const children = activity.getAvailableChildren();

    for (const child of children) {
      const deliverable = this.findFirstDeliverableActivity(child);
      if (deliverable) {
        return deliverable;
      }
    }

    return null;
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
    if (currentActivity.isActive) {
      result.exception = "SB.2.7-1"; // Current activity not terminated
      return result;
    }

    // Check if flow is allowed from the current activity's parent
    if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
      result.exception = "SB.2.7-2"; // No activity available (flow disabled)
      return result;
    }

    // Flow from current activity to find next using flow subprocess
    const flowResult = this.flowSubprocess(currentActivity, FlowSubprocessMode.FORWARD);

    if (!flowResult.deliverable) {
      // SB.2.7 step 4.1: Propagate exception and endSequencingSession flag
      result.exception = flowResult.exception || "SB.2.7-2";
      result.endSequencingSession = flowResult.endSequencingSession;
      return result;
    }

    // Deliver the identified activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = flowResult.identifiedActivity;
    result.endSequencingSession = false;
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
    if (currentActivity.isActive) {
      result.exception = "SB.2.8-1"; // Current activity not terminated
      return result;
    }

    // Check if flow is allowed from the current activity's parent
    if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
      result.exception = "SB.2.8-2"; // No activity available (flow disabled)
      return result;
    }

    // Enhanced multi-level forwardOnly validation
    // Check forwardOnly constraint at ALL ancestor levels, not just immediate parent
    const forwardOnlyViolation = this.checkForwardOnlyViolationAtAllLevels(currentActivity);
    if (forwardOnlyViolation) {
      result.exception = forwardOnlyViolation.exception;
      return result;
    }

    // Flow from current activity to find previous using flow subprocess
    const flowResult = this.flowSubprocess(currentActivity, FlowSubprocessMode.BACKWARD);

    if (!flowResult.deliverable) {
      // SB.2.8 step 4.1: Propagate exception and endSequencingSession flag
      result.exception = flowResult.exception || "SB.2.8-2";
      result.endSequencingSession = flowResult.endSequencingSession;
      return result;
    }

    // Deliver the identified activity
    result.deliveryRequest = DeliveryRequestType.DELIVER;
    result.targetActivity = flowResult.identifiedActivity;
    result.endSequencingSession = false;
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
      currentActivity: Activity | null
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

    // Early availability check before expensive operations
    if (!targetActivity.isAvailable) {
      result.exception = "SB.2.9-7";
      return result;
    }

    // Check choiceExit constraint at ALL ancestor levels (SB.2.9-8)
    // Walk from current activity to root, checking for choiceExit=false
    // If found AND ancestor is active, target must be a descendant of that ancestor (cannot exit that subtree)
    // Per SCORM spec: choiceExit only applies when we're actively IN that ancestor's subtree
    if (currentActivity) {
      let currentAncestor: Activity | null = currentActivity.parent;
      while (currentAncestor) {
        // choiceExit only applies when the ancestor is ACTIVE
        // An inactive ancestor means we're not truly "in" that subtree from a sequencing perspective
        if (currentAncestor.isActive && !currentAncestor.sequencingControls.choiceExit) {
          // choiceExit is false at this active ancestor
          // Check if target is a descendant of this ancestor
          if (!this.isActivity1AParentOfActivity2(currentAncestor, targetActivity)) {
            result.exception = "SB.2.9-8";
            return result;
          }
          // If target is within this subtree, we can stop checking choiceExit at higher levels
          // since we're not exiting this ancestor's subtree
          break;
        }
        currentAncestor = currentAncestor.parent;
      }
    }

    // Find common ancestor
    const commonAncestor = this.findCommonAncestor(currentActivity, targetActivity);

    // SB.2.9: Validate choice against ALL ancestor constraints (constrainChoice, forwardOnly, preventActivation)
    // Walk from target's parent up checking each ancestor's constraints
    let ancestorActivity: Activity | null = targetActivity.parent;
    while (ancestorActivity) {
      // Find which child of this ancestor contains current and target
      const targetChild = this.findChildInPathToActivity(ancestorActivity, targetActivity);
      const currentChild = currentActivity
          ? this.findChildInPathToActivity(ancestorActivity, currentActivity)
          : null;

      // If both current and target are children of this ancestor, check constraints
      if (targetChild && currentChild) {
        const siblings = ancestorActivity.children;
        const targetIndex = siblings.indexOf(targetChild);
        const currentIndex = siblings.indexOf(currentChild);

        if (targetIndex !== -1 && currentIndex !== -1) {
          // Priority 1: Check forwardOnly constraint FIRST (higher priority)
          // Per SCORM 2004 spec, forwardOnly blocks ALL backward navigation regardless of completion
          if (ancestorActivity.sequencingControls.forwardOnly && targetIndex < currentIndex) {
            result.exception = "SB.2.9-5"; // Choice not allowed (forwardOnly)
            return result;
          }

          // Priority 2: Check mandatory activities being skipped
          if (targetIndex > currentIndex) {
            for (let i = currentIndex + 1; i < targetIndex; i++) {
              const intermediateChild = siblings[i];
              if (
                  intermediateChild &&
                  this.isActivityMandatory(intermediateChild) &&
                  !this.isActivityCompleted(intermediateChild)
              ) {
                result.exception = "SB.2.9-6"; // Cannot skip mandatory incomplete
                return result;
              }
            }
          }

          // Priority 3: Check constrainChoice constraint
          if (ancestorActivity.sequencingControls.constrainChoice) {
            // Check if trying to skip beyond next sibling in forward direction
            if (targetIndex > currentIndex + 1) {
              result.exception = "SB.2.9-7"; // Constrained choice - cannot skip forward
              return result;
            }

            // Check if trying to go backward to incomplete activity
            if (targetIndex < currentIndex) {
              if (
                  targetActivity.completionStatus !== "completed" &&
                  targetActivity.completionStatus !== "passed"
              ) {
                result.exception = "SB.2.9-7"; // Constrained choice - backward to incomplete
                return result;
              }
            }
          }
        }
      }

      // Check preventActivation constraint
      if (ancestorActivity.sequencingControls.preventActivation) {
        // preventActivation blocks choice to activities that haven't been attempted
        if (targetActivity.attemptCount === 0 && !targetActivity.isActive) {
          result.exception = "SB.2.9-6"; // Prevent activation
          return result;
        }
      }

      ancestorActivity = ancestorActivity.parent;
    }

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

    // If target is not a leaf, use choice flow subprocess to find a deliverable leaf
    // This uses enhanced validation per SB.2.9.1, SB.2.9.2, and SB.2.4
    if (targetActivity.children.length > 0) {
      const flowResult = this.choiceFlowSubprocess(targetActivity, commonAncestor);

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
   * Retry Sequencing Request Process (SB.2.10)
   * @param {Activity} currentActivity - The current activity
   * @return {SequencingResult}
   */
  private retrySequencingRequestProcess(currentActivity: Activity): SequencingResult {
    const result = new SequencingResult();

    // SB.2.10 step 2: Check if activity is still active or suspended
    if (currentActivity.isActive || currentActivity.isSuspended) {
      result.exception = "SB.2.10-2"; // Activity is still active or suspended
      return result;
    }

    // SB.2.10 step 3: If current activity is not a leaf (is a cluster)
    if (currentActivity.children.length > 0) {
      // SB.2.10 step 3.1: Apply flow subprocess to find deliverable activity
      // We need to find a deliverable child within the cluster
      this.ensureSelectionAndRandomization(currentActivity);
      const availableChildren = currentActivity.getAvailableChildren();

      let deliverableActivity: Activity | null = null;

      // Try each child using flowActivityTraversalSubprocess
      for (const child of availableChildren) {
        deliverableActivity = this.flowActivityTraversalSubprocess(
            child,
            true, // direction: forward
            true, // considerChildren: true
            FlowSubprocessMode.FORWARD
        );
        if (deliverableActivity) {
          break;
        }
      }

      // SB.2.10 step 3.2: If flow subprocess returned false (no deliverable found)
      if (!deliverableActivity) {
        result.exception = "SB.2.10-3"; // Flow subprocess returned false (nothing to deliver)
        return result;
      }

      // SB.2.10 step 3.3: Deliver the activity identified by flow subprocess
      result.deliveryRequest = DeliveryRequestType.DELIVER;
      result.targetActivity = deliverableActivity;
      return result;
    }

    // SB.2.10 step 4: Activity is a leaf - terminate and deliver it again
    this.terminateDescendentAttemptsProcess(currentActivity);

    // NOTE: Attempt count increment removed here
    // The increment happens in contentDeliveryEnvironmentProcess() at line 1028
    // Incrementing here caused a double-increment bug on RETRY requests

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
    // Clear current activity to allow restart
    this.activityTree.currentActivity = null;

    // Restart from the root
    return this.startSequencingRequestProcess();
  }

  /**
   * Ensure selection and randomization is applied to an activity
   * @param {Activity} activity - The activity to process
   */
  private ensureSelectionAndRandomization(activity: Activity): void {
    // Check if processing is needed
    if (
        activity.getAvailableChildren() === activity.children &&
        (SelectionRandomization.isSelectionNeeded(activity) ||
            SelectionRandomization.isRandomizationNeeded(activity))
    ) {
      SelectionRandomization.applySelectionAndRandomization(activity, activity.isNewAttempt);
    }
  }

  /**
   * Flow Activity Traversal Subprocess
   * Checks if an activity can be delivered and flows into clusters if needed
   * @spec SN Book: UP.1 (Utility Process - Flow Activity Traversal Subprocess)
   * @spec Reference: SB.2.2
   */
  private flowActivityTraversalSubprocess(
      activity: Activity,
      _direction: boolean,
      considerChildren: boolean,
      mode: FlowSubprocessMode
  ): Activity | null {
    // SB.2.2 Step 1: Check sequencing control modes (flow control check)
    const parent = activity.parent;
    if (parent && !parent.sequencingControls.flow) {
      return null;
    }

    // SB.2.2 Step 2: Check if the activity is available
    if (!activity.isAvailable) {
      return null;
    }

    // SB.2.2 Step 3: Check stopForwardTraversal flag for forward direction
    if (mode === FlowSubprocessMode.FORWARD && activity.sequencingControls.stopForwardTraversal) {
      // Cannot traverse into this activity's children in forward direction
      return null;
    }

    // SB.2.2 Step 4: Activity is a cluster, try to flow into it to find a deliverable leaf
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

    // SB.2.2 Step 5: If activity is a leaf (no children), check if it can be delivered
    // Note: The 'flow' control is only relevant for parent activities controlling navigation
    // through their children. For leaf activities, 'flow' is meaningless and should not
    // affect deliverability.
    if (activity.children.length === 0) {
      const canDeliver = this.checkActivityProcess(activity);
      if (canDeliver) {
        return activity;
      }
      return null;
    }

    return null;
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

    // For leaf activities, check visibility
    // Note: isVisible only affects deliverability of leaf activities, not cluster traversal.
    // Invisible clusters (isVisible=false) can still be traversed by flow navigation - they
    // just won't appear in the TOC. This is a common SCORM pattern for grouping content.
    if (activity.children.length === 0 && !activity.isVisible) {
      return false;
    }

    // Check limit conditions (UP.1)
    const limitViolated = this.limitConditionsCheckProcess(activity);
    if (limitViolated) {
      return false; // Activity violates limit conditions
    }

    // Check pre-condition rules using UP.2
    const preConditionResult = this.sequencingRulesCheckProcess(
        activity,
        activity.sequencingRules.preConditionRules
    );

    activity.wasSkipped = preConditionResult === RuleActionType.SKIP;

    return (
        preConditionResult !== RuleActionType.SKIP && preConditionResult !== RuleActionType.DISABLED
    );
  }

  /**
   * Terminate Descendent Attempts Process (SB.2.4)
   * Ends attempts on an activity and its descendants
   */
  private terminateDescendentAttemptsProcess(
      activity: Activity,
      skipExitRules: boolean = false
  ): void {
    // Apply Exit Action Rules (TB.2.1) first to check for exit actions
    let exitAction = null;
    if (!skipExitRules) {
      exitAction = this.exitActionRulesSubprocess(activity);
    }

    // End attempt on the activity
    activity.isActive = false;

    // Recursively terminate descendants
    // Use all children here, not just available ones, since we need to terminate all
    for (const child of activity.children) {
      this.terminateDescendentAttemptsProcess(child, skipExitRules);
    }

    // Process deferred exit actions after termination to avoid recursion
    if (exitAction && !skipExitRules) {
      this.processDeferredExitAction(exitAction, activity);
    }
  }

  /**
   * Exit Action Rules Subprocess (TB.2.1)
   * Evaluates the exit condition rules for an activity
   * @param {Activity} activity - The activity to evaluate exit rules for
   * @return {RuleActionType | null} - The exit action to process, if any
   * @private
   */
  private exitActionRulesSubprocess(activity: Activity): RuleActionType | null {
    // Evaluate exit condition rules using UP.2
    const exitAction = this.sequencingRulesCheckProcess(
        activity,
        activity.sequencingRules.exitConditionRules
    );

    // Only certain actions are valid for exit condition rules
    if (
        exitAction === RuleActionType.EXIT ||
        exitAction === RuleActionType.EXIT_PARENT ||
        exitAction === RuleActionType.EXIT_ALL
    ) {
      return exitAction;
    }

    return null;
  }

  /**
   * Process deferred exit action after termination
   * @param {RuleActionType} exitAction - The exit action to process
   * @param {Activity} activity - The activity that triggered the exit action
   * @private
   */
  private processDeferredExitAction(exitAction: RuleActionType, activity: Activity): void {
    switch (exitAction) {
      case RuleActionType.EXIT:
        // Exit terminates the current attempt on the activity
        // Already handled by terminateDescendentAttemptsProcess
        break;

      case RuleActionType.EXIT_PARENT:
        // Exit parent terminates the current attempt on the parent activity
        if (activity.parent && activity.parent.isActive) {
          this.terminateDescendentAttemptsProcess(activity.parent, true);
        }
        break;

      case RuleActionType.EXIT_ALL:
        // Exit all terminates all activities
        if (this.activityTree.root && this.activityTree.root !== activity) {
          // Only process if we haven't already terminated the root
          const allActivities = this.activityTree.getAllActivities();
          const anyActive = allActivities.some((a) => a.isActive);
          if (anyActive) {
            this.terminateDescendentAttemptsProcess(this.activityTree.root, true);
          }
        }
        break;
    }
  }

  /**
   * Post Condition Rules Subprocess (TB.2.2)
   * Evaluates the post-condition rules for an activity after delivery
   * @param {Activity} activity - The activity to evaluate post-condition rules for
   * @return {RuleActionType | null} - The action to take, if any
   * @private
   */
  private postConditionRulesSubprocess(activity: Activity): RuleActionType | null {
    // Evaluate post-condition rules using UP.2
    const postAction = this.sequencingRulesCheckProcess(
        activity,
        activity.sequencingRules.postConditionRules
    );

    // Only certain actions are valid for post-condition rules
    const validActions = [
      RuleActionType.EXIT_PARENT,
      RuleActionType.EXIT_ALL,
      RuleActionType.RETRY,
      RuleActionType.RETRY_ALL,
      RuleActionType.CONTINUE,
      RuleActionType.PREVIOUS,
      RuleActionType.STOP_FORWARD_TRAVERSAL
    ];

    if (postAction && validActions.includes(postAction)) {
      return postAction;
    }

    return null;
  }

  /**
   * Validate Sequencing Request
   * Priority 3 Gap: Comprehensive sequencing request validation
   * @param {SequencingRequestType} request - The sequencing request
   * @param {string | null} targetActivityId - Target activity ID
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateSequencingRequest(
      request: SequencingRequestType,
      targetActivityId: string | null
  ): {
    valid: boolean;
    exception: string | null;
  } {
    // Validate request type
    const validRequestTypes = Object.values(SequencingRequestType);
    if (!validRequestTypes.includes(request)) {
      return {valid: false, exception: "SB.2.12-6"};
    }

    // Validate target activity ID for choice and jump requests
    if (
        (request === SequencingRequestType.CHOICE || request === SequencingRequestType.JUMP) &&
        !targetActivityId
    ) {
      return {valid: false, exception: "SB.2.12-5"};
    }

    // Additional request-specific validation
    const requestSpecificValidation = this.validateRequestSpecificConstraints(
        request,
        targetActivityId
    );
    if (!requestSpecificValidation.valid) {
      return requestSpecificValidation;
    }

    return {valid: true, exception: null};
  }

  /**
   * Validate Request-Specific Constraints
   * @param {SequencingRequestType} request - The sequencing request
   * @param {string | null} targetActivityId - Target activity ID
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateRequestSpecificConstraints(
      request: SequencingRequestType,
      targetActivityId: string | null
  ): {
    valid: boolean;
    exception: string | null;
  } {
    const currentActivity = this.activityTree.currentActivity;

    switch (request) {
      case SequencingRequestType.CONTINUE:
      case SequencingRequestType.PREVIOUS:
      case SequencingRequestType.EXIT:
      case SequencingRequestType.EXIT_ALL:
      case SequencingRequestType.ABANDON:
      case SequencingRequestType.ABANDON_ALL:
      case SequencingRequestType.SUSPEND_ALL:
      case SequencingRequestType.RETRY:
        if (!currentActivity) {
          return {valid: false, exception: "SB.2.12-1"};
        }
        break;
      case SequencingRequestType.CHOICE:
        if (targetActivityId) {
          const targetActivity = this.activityTree.getActivity(targetActivityId);
          if (!targetActivity) {
            return {valid: false, exception: "SB.2.9-1"};
          }
        }
        break;
      case SequencingRequestType.JUMP:
        if (targetActivityId) {
          const targetActivity = this.activityTree.getActivity(targetActivityId);
          if (!targetActivity) {
            return {valid: false, exception: "SB.2.13-1"};
          }
        }
        break;
    }

    return {valid: true, exception: null};
  }

  /**
   * Limit Conditions Check Process (UP.1)
   * Checks if an activity has exceeded its limit conditions (attempt limit or duration limits)
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if limit conditions are violated, false otherwise
   * @private
   */
  private limitConditionsCheckProcess(activity: Activity): boolean {
    // Check attempt limit
    if (activity.attemptLimit !== null && activity.attemptCount >= activity.attemptLimit) {
      return true; // Attempt limit exceeded
    }

    // Check attempt absolute duration limit
    // A limit of 0 (or "PT0H0M0S") is treated as "no limit" per IMS SS spec
    if (activity.attemptAbsoluteDurationLimit !== null) {
      const attemptLimitMs = this.parseISO8601Duration(activity.attemptAbsoluteDurationLimit);
      // Only check if there's an actual non-zero limit
      if (attemptLimitMs > 0) {
        const attemptDurationMs = this.parseISO8601Duration(activity.attemptExperiencedDuration);
        if (attemptDurationMs >= attemptLimitMs) {
          return true; // Attempt duration limit exceeded
        }
      }
    }

    // Check activity absolute duration limit
    // A limit of 0 (or "PT0H0M0S") is treated as "no limit" per IMS SS spec
    if (activity.activityAbsoluteDurationLimit !== null) {
      const activityLimitMs = this.parseISO8601Duration(activity.activityAbsoluteDurationLimit);
      // Only check if there's an actual non-zero limit
      if (activityLimitMs > 0) {
        const activityDurationMs = this.parseISO8601Duration(activity.activityExperiencedDuration);
        if (activityDurationMs >= activityLimitMs) {
          return true; // Activity duration limit exceeded
        }
      }
    }

    return false; // No limit conditions violated
  }

  /**
   * Parse ISO 8601 duration to milliseconds
   * Supports full ISO 8601 duration format with years, months, weeks, days, hours, minutes, and seconds
   * Reference: SCORM 2004 4th Edition ValidTimeInterval function
   * @param {string} duration - ISO 8601 duration string (e.g., "P1Y2M3DT4H5M6.5S")
   * @return {number} - Duration in milliseconds (returns 0 for invalid strings)
   * @private
   */
  private parseISO8601Duration(duration: string): number {
    // Validate input
    if (!duration || typeof duration !== "string") {
      return 0;
    }

    // Full ISO 8601 duration regex supporting all components
    // Format: P[nY][nM][nW][nD][T[nH][nM][n.nS]]
    // Regex from reference implementation: /^P(\d+Y)?(\d+M)?(\d+D)?(T(\d+H)?(\d+M)?(\d+(.\d\d?)?S)?)?$/
    const regex =
        /^P(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)W)?(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

    const matches = duration.match(regex);

    if (!matches) {
      return 0;
    }

    // Invalid cases from reference implementation
    if (duration === "P") {
      return 0;
    }
    if (duration.endsWith("T")) {
      return 0;
    }

    // Extract components (with decimal support)
    const years = parseFloat(matches[1] || "0");
    const months = parseFloat(matches[2] || "0");
    const weeks = parseFloat(matches[3] || "0");
    const days = parseFloat(matches[4] || "0");
    const hours = parseFloat(matches[5] || "0");
    const minutes = parseFloat(matches[6] || "0");
    const seconds = parseFloat(matches[7] || "0");

    // Convert to milliseconds
    // Using approximate conversions for years and months
    // 1 year = 365.25 days (accounting for leap years)
    // 1 month = 30.44 days (average month length)
    let totalMs = 0;
    totalMs += years * 365.25 * 24 * 3600 * 1000;
    totalMs += months * 30.44 * 24 * 3600 * 1000;
    totalMs += weeks * 7 * 24 * 3600 * 1000;
    totalMs += days * 24 * 3600 * 1000;
    totalMs += hours * 3600 * 1000;
    totalMs += minutes * 60 * 1000;
    totalMs += seconds * 1000;

    return totalMs;
  }

  /**
   * Sequencing Rules Check Process (UP.2)
   * General process for evaluating a set of sequencing rules
   * @param {Activity} activity - The activity to evaluate rules for
   * @param {SequencingRule[]} rules - The rules to evaluate
   * @return {RuleActionType | null} - The action to take, or null if no rules apply
   * @private
   */
  private sequencingRulesCheckProcess(
      activity: Activity,
      rules: SequencingRule[]
  ): RuleActionType | null {
    // Evaluate each rule in order
    for (const rule of rules) {
      // Use the Sequencing Rules Check Subprocess (UP.2.1) to evaluate
      if (this.sequencingRulesCheckSubprocess(activity, rule)) {
        // Rule condition(s) met, return the action
        return rule.action;
      }
    }

    // No rules applied
    return null;
  }

  /**
   * Sequencing Rules Check Subprocess (UP.2.1)
   * Evaluates individual sequencing rule conditions
   * @param {Activity} activity - The activity to evaluate the rule for
   * @param {SequencingRule} rule - The rule to evaluate
   * @return {boolean} - True if all rule conditions are met
   * @private
   */
  private sequencingRulesCheckSubprocess(activity: Activity, rule: SequencingRule): boolean {
    // If no conditions, the rule always applies
    if (rule.conditions.length === 0) {
      return true;
    }

    // Evaluate based on condition combination
    const conditionCombination = rule.conditionCombination;

    if (conditionCombination === "all" || conditionCombination === RuleConditionOperator.AND) {
      // All conditions must be true
      return rule.conditions.every((condition) => {
        // Log evaluation for debugging
        return condition.evaluate(activity);
      });
    } else if (
        conditionCombination === "any" ||
        conditionCombination === RuleConditionOperator.OR
    ) {
      // At least one condition must be true
      return rule.conditions.some((condition) => {
        // Log evaluation for debugging
        return condition.evaluate(activity);
      });
    }

    // Unknown combination, default to false
    return false;
  }

  /**
   * Check if activity is in the activity tree
   */
  private isActivityInTree(activity: Activity): boolean {
    return this.activityTree.getAllActivities().includes(activity);
  }

  /**
   * Check if activity1 is a parent (ancestor) of activity2
   * Used for choiceExit validation to determine if target is within a subtree
   * @param {Activity} activity1 - Potential parent/ancestor activity
   * @param {Activity} activity2 - Potential child/descendant activity
   * @return {boolean} - True if activity1 is an ancestor of activity2
   */
  private isActivity1AParentOfActivity2(activity1: Activity, activity2: Activity): boolean {
    let current: Activity | null = activity2;
    while (current) {
      if (current === activity1) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  /**
   * Find common ancestor of two activities
   */
  private findCommonAncestor(
      activity1: Activity | null,
      activity2: Activity | null
  ): Activity | null {
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

  /**
   * Flow Subprocess
   * Traverses the activity tree in the specified direction to find a deliverable activity
   * @spec SN Book: UP.2 (Utility Process - Flow Sub-Process)
   * @spec Reference: SB.2.3
   * @param {Activity} fromActivity - The activity to flow from
   * @param {FlowSubprocessMode} direction - The flow direction
   * @return {FlowSubprocessResult} - Result containing the deliverable activity and session end flag
   */
  private flowSubprocess(
      fromActivity: Activity,
      direction: FlowSubprocessMode
  ): FlowSubprocessResult {
    let candidateActivity: Activity | null = fromActivity;
    let firstIteration = true;
    let lastCandidateHadNoChildren = false;

    // Keep traversing until we find a deliverable activity or run out of candidates
    while (candidateActivity) {
      // Get next candidate using flow tree traversal
      // On first iteration, we want to skip the current activity's children
      const traversalResult = this.flowTreeTraversalSubprocess(
          candidateActivity,
          direction,
          firstIteration
      );

      if (!traversalResult.activity) {
        // No more candidates - propagate endSequencingSession flag from traversal
        // SB.2.3 step 3.1: Exit with no deliverable activity and endSequencingSession flag
        // Set appropriate exception code based on direction and reason
        let exceptionCode: string | null = null;
        if (traversalResult.exception) {
          // Use exception from traversal (e.g., SB.2.1-4 for forwardOnly violation)
          exceptionCode = traversalResult.exception;
        } else if (direction === FlowSubprocessMode.BACKWARD) {
          exceptionCode = "SB.2.1-3"; // Reached beginning of course
        } else if (lastCandidateHadNoChildren) {
          exceptionCode = "SB.2.1-2"; // No available children to deliver
        }
        return new FlowSubprocessResult(
            candidateActivity,
            false,
            exceptionCode,
            traversalResult.endSequencingSession
        );
      }

      // Track if this activity is a cluster with no available children
      lastCandidateHadNoChildren =
          traversalResult.activity.children.length > 0 &&
          traversalResult.activity.getAvailableChildren().length === 0;

      // Check if this candidate can be delivered
      const deliverable = this.flowActivityTraversalSubprocess(
          traversalResult.activity,
          direction === FlowSubprocessMode.FORWARD,
          true, // consider children
          direction
      );

      if (deliverable) {
        // Found a deliverable activity
        return new FlowSubprocessResult(deliverable, true, null, false);
      }

      // Continue with next candidate
      candidateActivity = traversalResult.activity;
      firstIteration = false;
    }

    // Should not reach here, but return safe default
    return new FlowSubprocessResult(null, false, null, false);
  }

  /**
   * Flow Tree Traversal Subprocess
   * Traverses the activity tree to find the next activity in the specified direction
   * @spec SN Book: UP.3 (Utility Process - Flow Tree Traversal Subprocess)
   * @spec Reference: SB.2.1
   * @param {Activity} fromActivity - The activity to traverse from
   * @param {FlowSubprocessMode} direction - The traversal direction
   * @param {boolean} skipChildren - Whether to skip checking children (for continuing from current)
   * @return {{ activity: Activity | null; endSequencingSession: boolean; exception?: string }} - The next activity, session end flag, and optional exception
   */
  private flowTreeTraversalSubprocess(
      fromActivity: Activity,
      direction: FlowSubprocessMode,
      skipChildren: boolean = false
  ): { activity: Activity | null; endSequencingSession: boolean; exception?: string } {
    if (direction === FlowSubprocessMode.FORWARD) {
      // SB.2.1 step 3.1: Check if we're at the last activity in forward traversal
      // Before checking children, see if this is already the last activity overall
      if (skipChildren && this.isActivityLastOverall(fromActivity)) {
        // SB.2.1 step 3.1.1: Terminate all descendent attempts at root
        if (this.activityTree.root) {
          this.terminateDescendentAttemptsProcess(this.activityTree.root);
        }
        // SB.2.1 step 3.1.2: Exit with endSequencingSession = true
        return {activity: null, endSequencingSession: true};
      }

      // First, check if activity has children (unless we're skipping them)
      if (!skipChildren) {
        this.ensureSelectionAndRandomization(fromActivity);
        const children = fromActivity.getAvailableChildren();
        if (children.length > 0) {
          return {activity: children[0] || null, endSequencingSession: false};
        }
      }

      // No children, try to get next sibling
      let current: Activity | null = fromActivity;
      while (current) {
        const nextSibling = this.activityTree.getNextSibling(current);
        if (nextSibling) {
          return {activity: nextSibling, endSequencingSession: false};
        }
        // No next sibling, move up to parent
        current = current.parent;
      }

      // Reached end of tree in forward direction
      // SB.2.1 step 3.1.1: Terminate all descendent attempts at root
      if (this.activityTree.root) {
        this.terminateDescendentAttemptsProcess(this.activityTree.root);
      }
      // SB.2.1 step 3.1.2: Exit with endSequencingSession = true
      return {activity: null, endSequencingSession: true};
    } else {
      // Backward direction

      // SB.2.1-4: Check if forwardOnly constraint prevents backward traversal
      if (fromActivity.parent && fromActivity.parent.sequencingControls.forwardOnly) {
        return {activity: null, endSequencingSession: false, exception: "SB.2.1-4"};
      }

      // Try to get previous sibling
      const previousSibling = this.activityTree.getPreviousSibling(fromActivity);
      if (previousSibling) {
        // If previous sibling has children, go to the last descendant
        let lastDescendant = previousSibling;
        let descendIterations = 0;
        const maxDescendIterations = 10000; // Safety limit for descending
        while (true) {
          if (++descendIterations > maxDescendIterations) {
            throw new Error(
              `[SEQ-PROC] Infinite loop detected in backward traversal (descending to last child). ` +
              `Exceeded ${maxDescendIterations} iterations. Tree may have circular references.`
            );
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
        return {activity: lastDescendant, endSequencingSession: false};
      }

      // No previous sibling at this level, try going up to parent and then its previous sibling
      let current: Activity | null = fromActivity;
      let ancestorIterations = 0;
      const maxAncestorIterations = 10000; // Safety limit for ascending
      while (current && current.parent) {
        if (++ancestorIterations > maxAncestorIterations) {
          throw new Error(
            `[SEQ-PROC] Infinite loop detected in backward traversal (ascending to ancestors). ` +
            `Exceeded ${maxAncestorIterations} iterations. Tree may have circular references.`
          );
        }
        const parentPreviousSibling = this.activityTree.getPreviousSibling(current.parent);
        if (parentPreviousSibling) {
          // Found a previous sibling of an ancestor, go to its last descendant
          let lastDescendant = parentPreviousSibling;
          let descendIterations = 0;
          const maxDescendIterations = 10000; // Safety limit for descending
          while (true) {
            if (++descendIterations > maxDescendIterations) {
              throw new Error(
                `[SEQ-PROC] Infinite loop detected in backward traversal (descending to last child). ` +
                `Exceeded ${maxDescendIterations} iterations. Tree may have circular references.`
              );
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
          return {activity: lastDescendant, endSequencingSession: false};
        }
        // Move up to grandparent
        current = current.parent;
      }

      // Reached beginning of tree (backward direction does NOT end session)
      return {activity: null, endSequencingSession: false};
    }
  }

  /**
   * Choice Flow Subprocess (SB.2.9.1)
   * Handles the flow logic specific to choice navigation requests
   * @param {Activity} targetActivity - The target activity for the choice
   * @param {Activity | null} commonAncestor - The common ancestor between current and target
   * @return {Activity | null} - The activity to deliver, or null if flow fails
   */
  private choiceFlowSubprocess(
      targetActivity: Activity,
      commonAncestor: Activity | null
  ): Activity | null {
    // If target is a leaf, it's the delivery candidate
    if (targetActivity.children.length === 0) {
      return targetActivity;
    }

    // If target is a cluster, use choice flow tree traversal
    return this.choiceFlowTreeTraversalSubprocess(targetActivity);
  }

  /**
   * Enhanced Choice Flow Tree Traversal Subprocess (SB.2.9.2)
   * Priority 3 Gap: Choice Flow Tree Traversal with complete constraint validation
   * @param {Activity} fromActivity - The cluster activity to traverse from
   * @return {Activity | null} - A leaf activity for delivery, or null if none found
   */
  private choiceFlowTreeTraversalSubprocess(fromActivity: Activity): Activity | null {
    // Apply selection and randomization
    this.ensureSelectionAndRandomization(fromActivity);
    const children = fromActivity.getAvailableChildren();

    // Enhanced constraint validation for choice flow tree traversal
    const constraintValidation = this.validateChoiceFlowConstraints(fromActivity, children);
    if (!constraintValidation.valid) {
      return null;
    }

    // Find the first available child that can be delivered
    for (const child of constraintValidation.validChildren) {
      // Check if child can be delivered or traverse into it
      const traversalResult = this.enhancedChoiceActivityTraversalSubprocess(child);
      if (traversalResult.activity) {
        return traversalResult.activity;
      }
      // Note: Exception information is intentionally not propagated here
      // as we continue searching through siblings. The exception would only
      // be relevant if no children are deliverable (handled by caller).
    }

    return null;
  }

  /**
   * Enhanced Choice Activity Traversal Subprocess (SB.2.4)
   * Priority 3 Gap: Choice Activity Traversal with stopForwardTraversal and forwardOnly checks
   * @param {Activity} activity - The activity to check and possibly traverse
   * @param {boolean} isBackwardTraversal - Whether this is a backward traversal (default: false)
   * @return {ChoiceTraversalResult} - Result with deliverable activity or exception
   */
  private enhancedChoiceActivityTraversalSubprocess(
      activity: Activity,
      isBackwardTraversal: boolean = false
  ): ChoiceTraversalResult {
    // SB.2.4-3: Cannot walk backward from root of activity tree
    if (isBackwardTraversal && activity === this.activityTree.root) {
      return new ChoiceTraversalResult(null, "SB.2.4-3");
    }

    // Check if activity is available
    if (!activity.isAvailable) {
      return new ChoiceTraversalResult(null, null);
    }

    // Check if activity is hidden from choice
    if (activity.isHiddenFromChoice) {
      return new ChoiceTraversalResult(null, null);
    }

    // SB.2.4-1: Check if stopForwardTraversal rule evaluates to true
    if (activity.sequencingControls && activity.sequencingControls.stopForwardTraversal) {
      return new ChoiceTraversalResult(null, "SB.2.4-1");
    }

    // Enhanced constraint checks including stopForwardTraversal and forwardOnly
    const traversalValidation = this.validateChoiceTraversalConstraints(activity);
    if (!traversalValidation.canTraverse) {
      return new ChoiceTraversalResult(null, null);
    }

    // If it's a leaf, check if it can be delivered
    if (activity.children.length === 0) {
      if (this.checkActivityProcess(activity)) {
        return new ChoiceTraversalResult(activity, null);
      }
      return new ChoiceTraversalResult(null, null);
    }

    // SB.2.4-2: Constrained choice requires forward traversal from leaf
    // If parent has constrainChoice enabled and we're at a cluster (not a leaf),
    // we need to ensure we can traverse forward into children
    if (
        activity.parent?.sequencingControls.constrainChoice &&
        !traversalValidation.canTraverseInto
    ) {
      return new ChoiceTraversalResult(null, "SB.2.4-2");
    }

    // If it's a cluster, traverse into it with enhanced validation
    if (traversalValidation.canTraverseInto) {
      const flowResult = this.choiceFlowTreeTraversalSubprocess(activity);
      return new ChoiceTraversalResult(flowResult, null);
    }

    return new ChoiceTraversalResult(null, null);
  }

  /**
   * Original Choice Activity Traversal Subprocess for backwards compatibility
   */
  private choiceActivityTraversalSubprocess(activity: Activity): Activity | null {
    const result = this.enhancedChoiceActivityTraversalSubprocess(activity);
    return result.activity;
  }

  /**
   * Evaluate post-condition rules for the current activity
   * This should be called after an activity has been delivered and the learner has interacted with it
   * @param {Activity} activity - The activity to evaluate
   * @return {PostConditionResult} - The post-condition result with sequencing and termination requests
   */
  public evaluatePostConditionRules(activity: Activity): PostConditionResult {
    const postAction = this.postConditionRulesSubprocess(activity);

    if (!postAction) {
      return {
        sequencingRequest: null,
        terminationRequest: null
      };
    }

    // Map post-condition actions to sequencing and termination requests
    switch (postAction) {
      case RuleActionType.EXIT_PARENT:
        // EXIT_PARENT is a termination request that moves to parent
        return {
          sequencingRequest: null,
          terminationRequest: SequencingRequestType.EXIT_PARENT
        };

      case RuleActionType.EXIT_ALL:
        // EXIT_ALL is both a termination request and potentially a sequencing request
        return {
          sequencingRequest: null,
          terminationRequest: SequencingRequestType.EXIT_ALL
        };

      case RuleActionType.RETRY:
        return {
          sequencingRequest: SequencingRequestType.RETRY,
          terminationRequest: null
        };

      case RuleActionType.RETRY_ALL:
        // RETRY_ALL includes EXIT_ALL termination
        return {
          sequencingRequest: SequencingRequestType.RETRY,
          terminationRequest: SequencingRequestType.EXIT_ALL
        };

      case RuleActionType.CONTINUE:
        return {
          sequencingRequest: SequencingRequestType.CONTINUE,
          terminationRequest: null
        };

      case RuleActionType.PREVIOUS:
        return {
          sequencingRequest: SequencingRequestType.PREVIOUS,
          terminationRequest: null
        };

      case RuleActionType.STOP_FORWARD_TRAVERSAL:
        // Set traversal limiter on controls; not a navigation request
        activity.sequencingControls.stopForwardTraversal = true;
        return {
          sequencingRequest: null,
          terminationRequest: null
        };

      default:
        return {
          sequencingRequest: null,
          terminationRequest: null
        };
    }
  }

  /**
   * Validate Choice Flow Constraints
   * Priority 3 Gap: Choice Flow Tree Traversal constraint validation
   * @param {Activity} fromActivity - Activity to traverse from
   * @param {Activity[]} children - Available children
   * @return {{valid: boolean, validChildren: Activity[]}} - Validation result
   */
  private validateChoiceFlowConstraints(
      fromActivity: Activity,
      children: Activity[]
  ): {
    valid: boolean;
    validChildren: Activity[];
  } {
    const validChildren: Activity[] = [];

    for (const child of children) {
      // Check if child meets all choice flow constraints
      if (this.meetsChoiceFlowConstraints(child, fromActivity)) {
        validChildren.push(child);
      }
    }

    return {
      valid: validChildren.length > 0,
      validChildren
    };
  }

  /**
   * Check if activity meets choice flow constraints
   * @param {Activity} activity - Activity to check
   * @param {Activity} parent - Parent activity
   * @return {boolean} - True if constraints are met
   */
  private meetsChoiceFlowConstraints(activity: Activity, parent: Activity): boolean {
    // Check basic availability
    if (!activity.isAvailable || activity.isHiddenFromChoice) {
      return false;
    }

    // Check parent constraint controls
    if (parent.sequencingControls.constrainChoice) {
      // Apply constrain choice logic specific to flow
      return this.validateConstrainChoiceForFlow(activity, parent);
    }

    return true;
  }

  /**
   * Validate Choice Traversal Constraints
   * Priority 3 Gap: stopForwardTraversal and forwardOnly checks
   * @param {Activity} activity - Activity to validate
   * @return {{canTraverse: boolean, canTraverseInto: boolean}} - Traversal permissions
   */
  private validateChoiceTraversalConstraints(activity: Activity): {
    canTraverse: boolean;
    canTraverseInto: boolean;
  } {
    let canTraverse = true;
    let canTraverseInto = true;

    // Check constrain choice control
    if (activity.parent?.sequencingControls.constrainChoice) {
      // Apply constrainChoice logic that might prevent traversal
      canTraverse = this.evaluateConstrainChoiceForTraversal(activity);
    }

    // Check stopForwardTraversal control (if implemented in sequencing controls)
    if (activity.sequencingControls && activity.sequencingControls.stopForwardTraversal) {
      canTraverseInto = false;
    }

    // Check forwardOnly control in parent context
    if (activity.parent?.sequencingControls.forwardOnly) {
      // forwardOnly might restrict certain types of choice traversal
      // depending on the current position and target
      canTraverseInto = this.evaluateForwardOnlyForChoice(activity);
    }

    return {canTraverse, canTraverseInto};
  }

  /**
   * Validate Constrained Choice Boundaries
   * Priority 3 Gap: Proper choice boundary checking
   * @param {Activity | null} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateConstrainedChoiceBoundaries(
      currentActivity: Activity | null,
      targetActivity: Activity
  ): {
    valid: boolean;
    exception: string | null;
  } {
    // Path to root validation with enhanced constraint checking
    let activity: Activity | null = targetActivity;
    while (activity) {
      if (activity.isHiddenFromChoice) {
        return {valid: false, exception: "SB.2.9-4"}; // Activity hidden from choice
      }

      // Enhanced choice control validation
      if (activity.parent && !activity.parent.sequencingControls.choice) {
        return {valid: false, exception: "SB.2.9-5"}; // Choice control is not allowed
      }

      // Check constrained choice boundaries
      if (activity.parent?.sequencingControls.constrainChoice) {
        const boundaryCheck = this.checkConstrainedChoiceBoundary(
            currentActivity,
            activity,
            activity.parent
        );
        if (!boundaryCheck.valid) {
          return boundaryCheck;
        }
      }

      activity = activity.parent;
    }

    return {valid: true, exception: null};
  }

  /**
   * Helper methods for enhanced choice processing
   */
  private validateConstrainChoiceForFlow(activity: Activity, parent: Activity): boolean {
    // SB.2.9 - Validate constrained choice for flow scenarios according to SCORM 2004

    // If constrainChoice is false, no restrictions apply
    if (!parent.sequencingControls || !parent.sequencingControls.constrainChoice) {
      return true;
    }

    // When constrainChoice is true, choices are restricted based on flow direction
    const children = parent.children;
    if (!children || children.length === 0) {
      return true;
    }

    // Get sibling index of target activity
    const targetIndex = children.indexOf(activity);
    if (targetIndex === -1) {
      return false; // Activity not found in parent's children
    }

    // Get the current activity within this parent's children
    const currentActivity = this.getCurrentActivity(parent);
    if (!currentActivity) {
      // No current activity in this cluster, allow choice to first available activity
      return this.isActivityAvailableForChoice(activity);
    }

    const currentIndex = children.indexOf(currentActivity);
    if (currentIndex === -1) {
      // Current activity not in this cluster, allow choice
      return true;
    }

    // Check flow direction constraints per SCORM 2004 SB.2.9
    if (parent.sequencingControls.flow) {
      // In forward flow mode with constrainChoice:
      // 1. Can choose next activity in sequence
      // 2. Can choose previously completed activities if forwardOnly is false
      // 3. Cannot skip forward beyond next sibling
      // 4. Cannot skip backward if forwardOnly is true

      // Check forwardOnly constraint interaction
      if (parent.sequencingControls.forwardOnly && targetIndex < currentIndex) {
        // Backward navigation blocked by forwardOnly
        // Exception: allow if target was previously completed
        if (activity.completionStatus === "completed" || activity.completionStatus === "passed") {
          return true;
        }
        return false;
      }

      // Forward direction (or same position)
      if (targetIndex >= currentIndex) {
        // Can only choose immediate next sibling or current
        if (targetIndex === currentIndex || targetIndex === currentIndex + 1) {
          return this.isActivityAvailableForChoice(activity);
        }
        // Cannot skip forward beyond next sibling
        return false;
      }

      // Backward direction (forwardOnly is false per check above)
      if (targetIndex < currentIndex) {
        // Allow backward choice to previously completed activities
        return (
            (activity.completionStatus === "completed" || activity.completionStatus === "passed") &&
            this.isActivityAvailableForChoice(activity)
        );
      }

      return false;
    } else {
      // Non-flow mode with constrainChoice
      // Constrain to completed or available activities only
      return (
          this.isActivityAvailableForChoice(activity) &&
          (activity.completionStatus === "completed" ||
              activity.completionStatus === "unknown" ||
              activity.completionStatus === "incomplete")
      );
    }
  }

  private evaluateConstrainChoiceForTraversal(activity: Activity): boolean {
    // SB.2.9 - Evaluate constrainChoice for traversal according to SCORM 2004
    // This method validates traversal at ALL ancestor levels, not just immediate parent

    if (!activity.parent) {
      return true; // Root activity has no traversal constraints
    }

    // Check constraint at ALL ancestor levels (multi-level validation)
    let currentAncestor: Activity | null = activity.parent;
    while (currentAncestor) {
      // If any ancestor has constrainChoice, validate at that level
      if (
          currentAncestor.sequencingControls &&
          currentAncestor.sequencingControls.constrainChoice
      ) {
        // Find which child of this ancestor is in the path to target
        const ancestorChildren = currentAncestor.children;
        const childInPath = this.findChildInPathToActivity(currentAncestor, activity);

        if (childInPath) {
          const childIndex = ancestorChildren.indexOf(childInPath);

          // Get current activity at this ancestor level
          const currentAtLevel = this.getCurrentActivity(currentAncestor);

          if (currentAtLevel) {
            const currentIndex = ancestorChildren.indexOf(currentAtLevel);

            if (currentIndex !== -1 && childIndex !== -1) {
              // Check mandatory intermediate activities
              if (currentIndex < childIndex) {
                // Forward traversal - check for mandatory incomplete activities
                for (let i = currentIndex + 1; i < childIndex; i++) {
                  const intermediateActivity = ancestorChildren[i];
                  if (
                      intermediateActivity &&
                      this.isActivityMandatory(intermediateActivity) &&
                      !this.isActivityCompleted(intermediateActivity)
                  ) {
                    return false; // Cannot skip mandatory incomplete activity
                  }
                }
              }

              // Check forwardOnly constraint
              if (currentAncestor.sequencingControls.forwardOnly && childIndex < currentIndex) {
                // Backward traversal blocked by forwardOnly
                // Exception: allow if child path leads to completed activity
                if (!this.isActivityCompleted(activity)) {
                  return false;
                }
              }
            }
          }
        }
      }

      currentAncestor = currentAncestor.parent;
    }

    // Check basic activity availability and state
    if (!this.isActivityAvailableForChoice(activity)) {
      return false;
    }

    // Validate activity choice state (pre-conditions, etc.)
    return this.validateActivityChoiceState(activity);
  }

  /**
   * Find which child of ancestor is in the path to the target activity
   * Used for multi-level constraint validation
   */
  private findChildInPathToActivity(ancestor: Activity, target: Activity): Activity | null {
    let current: Activity | null = target;

    while (current && current.parent) {
      if (current.parent === ancestor) {
        return current;
      }
      current = current.parent;
    }

    return null;
  }

  private evaluateForwardOnlyForChoice(activity: Activity): boolean {
    // Implement forwardOnly evaluation for choice scenarios according to SCORM 2004

    if (!activity.parent) {
      return true; // Root activity has no forwardOnly constraints
    }

    const parent = activity.parent;

    // If forwardOnly is false, choice is allowed in any direction
    if (!parent.sequencingControls || !parent.sequencingControls.forwardOnly) {
      return true;
    }

    // When forwardOnly is true, restrict backward navigation choices
    const siblings = parent.children;
    if (!siblings || siblings.length === 0) {
      return true;
    }

    const targetIndex = siblings.indexOf(activity);
    if (targetIndex === -1) {
      return false; // Activity not found in siblings
    }

    // Find the current activity to determine navigation direction
    const currentActivity = this.getCurrentActivity(parent);
    if (!currentActivity) {
      // No current activity, allow choice to any available activity
      return this.isActivityAvailableForChoice(activity);
    }

    const currentIndex = siblings.indexOf(currentActivity);
    if (currentIndex === -1) {
      return true; // Current activity not found, allow choice
    }

    // ForwardOnly constraint: only allow choice to activities at or after current position
    if (targetIndex < currentIndex) {
      // Backward choice - check for exceptions

      // Exception 1: Allow choice to previously completed activities if they are choice-enabled
      if (activity.completionStatus === "completed" || activity.completionStatus === "passed") {
        // Check if the activity allows choice even in forwardOnly mode
        if (activity.sequencingControls && activity.sequencingControls.choice) {
          return true;
        }
      }

      // Exception 2: Allow choice if there's a specific choice rule allowing backward navigation
      if (this.hasBackwardChoiceException(activity, parent)) {
        return true;
      }

      // Otherwise, forwardOnly constraint blocks backward choice
      return false;
    }

    // Forward or current position choice - allowed
    return this.isActivityAvailableForChoice(activity);
  }

  private checkConstrainedChoiceBoundary(
      currentActivity: Activity | null,
      activity: Activity,
      parent: Activity
  ): {
    valid: boolean;
    exception: string | null;
  } {
    // SB.2.9 - Complete boundary checking logic for constrained choice according to SCORM 2004

    try {
      // If no current activity, choice to any available activity is valid
      if (!currentActivity) {
        if (this.isActivityAvailableForChoice(activity)) {
          return {valid: true, exception: null};
        } else {
          return {valid: false, exception: "SB.2.9-7"}; // Activity not available
        }
      }

      // Check if parent has constrainChoice enabled
      if (!parent.sequencingControls || !parent.sequencingControls.constrainChoice) {
        // No constraints - just check basic availability
        if (this.isActivityAvailableForChoice(activity)) {
          return {valid: true, exception: null};
        } else {
          return {valid: false, exception: "SB.2.9-7"}; // Activity not available
        }
      }

      const siblings = parent.children;
      if (!siblings || siblings.length === 0) {
        return {valid: true, exception: null};
      }

      const currentIndex = siblings.indexOf(currentActivity);
      const targetIndex = siblings.indexOf(activity);

      if (currentIndex === -1 || targetIndex === -1) {
        return {valid: false, exception: "SB.2.9-2"}; // Activity not in tree
      }

      // Check flow and forwardOnly constraints
      if (parent.sequencingControls.flow) {
        // Flow mode constraints with complete forwardOnly boundary validation
        if (parent.sequencingControls.forwardOnly && targetIndex < currentIndex) {
          // SB.2.9-5: Backward navigation in forwardOnly flow
          // Exception: allow if target was previously completed
          if (activity.completionStatus !== "completed" && activity.completionStatus !== "passed") {
            return {valid: false, exception: "SB.2.9-5"}; // Choice not allowed (forwardOnly)
          }
        }

        // Check if we're skipping mandatory activities (forward direction)
        if (targetIndex > currentIndex) {
          for (let i = currentIndex + 1; i < targetIndex; i++) {
            const intermediateActivity = siblings[i];
            if (
                intermediateActivity &&
                this.isActivityMandatory(intermediateActivity) &&
                !this.isActivityCompleted(intermediateActivity)
            ) {
              // SB.2.9-6: Cannot skip mandatory incomplete activity
              return {valid: false, exception: "SB.2.9-6"};
            }
          }
        }

        // Check if we're skipping mandatory activities (backward direction)
        // This handles the case where backward is allowed but we can't skip mandatory
        if (targetIndex < currentIndex && !parent.sequencingControls.forwardOnly) {
          for (let i = targetIndex + 1; i < currentIndex; i++) {
            const intermediateActivity = siblings[i];
            if (
                intermediateActivity &&
                this.isActivityMandatory(intermediateActivity) &&
                !this.isActivityCompleted(intermediateActivity)
            ) {
              // Cannot skip mandatory incomplete activity even when going backward
              return {valid: false, exception: "SB.2.9-6"};
            }
          }
        }

        // ConstrainChoice in flow mode: can only choose immediate next or completed previous
        if (targetIndex > currentIndex + 1) {
          // Trying to skip forward beyond next sibling
          return {valid: false, exception: "SB.2.9-7"}; // Constrained choice violation
        }
      }

      // Check choice boundaries based on completion and availability
      if (!this.isActivityAvailableForChoice(activity)) {
        return {valid: false, exception: "Activity not available for choice"};
      }

      // Check for specific boundary violations
      if (this.hasChoiceBoundaryViolation(currentActivity, activity, parent)) {
        return {valid: false, exception: "Choice boundary constraint violation"};
      }

      // All boundary checks passed
      return {valid: true, exception: null};
    } catch (error) {
      return {valid: false, exception: `Boundary check error: ${error}`};
    }
  }

  /**
   * Helper methods for constraint validation
   */
  private getCurrentActivity(parent: Activity): Activity | null {
    // Find the currently active activity within the parent
    if (parent.children) {
      for (const child of parent.children) {
        if (child.isActive) {
          return child;
        }
      }
    }
    return null;
  }

  private isActivityAvailableForChoice(activity: Activity): boolean {
    // Check if activity is available for choice according to SCORM 2004 rules
    return (
        activity.isVisible &&
        !activity.isHiddenFromChoice &&
        activity.isAvailable &&
        (activity.sequencingControls ? activity.sequencingControls.choice : true)
    );
  }

  private isActivityMandatory(activity: Activity): boolean {
    // Check if activity is mandatory (cannot be skipped)
    // In SCORM 2004, this is typically determined by sequencing rules
    if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
      for (const rule of activity.sequencingRules.preConditionRules) {
        if (rule.action === "skip" && rule.conditions && rule.conditions.length === 0) {
          return false; // Has unconditional skip rule, not mandatory
        }
      }
    }

    // Check for explicit mandatory flag. Default to false (not mandatory) unless explicitly set
    // Activities are only mandatory if explicitly marked as such
    return (activity as any).mandatory === true;
  }

  private isActivityCompleted(activity: Activity): boolean {
    // Check if activity is completed
    return (
        activity.completionStatus === "completed" ||
        activity.completionStatus === "passed" ||
        activity.successStatus === "passed"
    );
  }

  private validateActivityChoiceState(activity: Activity): boolean {
    // Validate activity state for choice according to SCORM 2004

    // Check basic availability
    if (!this.isActivityAvailableForChoice(activity)) {
      return false;
    }

    // Check pre-condition rules
    if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
      for (const rule of activity.sequencingRules.preConditionRules) {
        if (
            rule.action === RuleActionType.DISABLED ||
            rule.action === RuleActionType.HIDE_FROM_CHOICE
        ) {
          // Check if conditions are met for disabling/hiding
          const combinationMode = (rule as any).conditionCombination || "all";
          if (this.evaluateRuleConditions(rule.conditions || [], activity, combinationMode)) {
            return false;
          }
        }
      }
    }

    return true;
  }

  private hasBackwardChoiceException(activity: Activity, parent: Activity): boolean {
    // Check for exceptions that allow backward choice in forwardOnly mode

    // Check for specific sequencing rules that allow backward navigation
    if (parent.sequencingRules && parent.sequencingRules.preConditionRules) {
      for (const rule of parent.sequencingRules.preConditionRules) {
        if (rule.action === "exitParent" || rule.action === "retry") {
          // These actions might allow backward navigation
          const combinationMode = (rule as any).conditionCombination || "all";
          return this.evaluateRuleConditions(rule.conditions || [], activity, combinationMode);
        }
      }
    }

    // Check for explicit backward navigation permissions
    return (activity as any).allowBackwardChoice === true;
  }

  private hasChoiceBoundaryViolation(
      currentActivity: Activity,
      targetActivity: Activity,
      parent: Activity
  ): boolean {
    // Check for specific boundary violations

    // Check for time-based constraints (use this.now() for testability)
    if (targetActivity.timeLimitAction && targetActivity.beginTimeLimit) {
      const now = this.now();
      const beginTime = new Date(targetActivity.beginTimeLimit);
      if (now < beginTime) {
        return true; // Not yet available
      }
    }

    if (targetActivity.endTimeLimit) {
      const now = this.now();
      const endTime = new Date(targetActivity.endTimeLimit);
      if (now > endTime) {
        return true; // No longer available
      }
    }

    // Check for attempt limit violations
    return !!(
        targetActivity.attemptLimit && targetActivity.attemptCount >= targetActivity.attemptLimit
    );
  }

  private evaluateRuleConditions(
      conditions: any[],
      activity: Activity,
      combinationMode: string = "all"
  ): boolean {
    // Full SCORM 2004 rule condition evaluation
    if (conditions.length === 0) {
      return true; // No conditions means always true
    }

    // Evaluate each condition and collect results
    const conditionResults: boolean[] = [];

    for (const condition of conditions) {
      const conditionType = condition.condition || condition.conditionType;
      let result = false;
      const referencedObjectiveId = condition.referencedObjective;
      const referencedObjective =
          referencedObjectiveId && activity.objectives
              ? activity.objectives.find((obj) => obj.id === referencedObjectiveId) ||
              (activity.primaryObjective?.id === referencedObjectiveId
                  ? activity.primaryObjective
                  : null)
              : null;

      switch (conditionType) {
        case "always":
          result = true;
          break;
        case "never":
          result = false;
          break;
        case "activityAttempted":
        case "attempted":
          result = activity.attemptCount > 0;
          break;
        case "activityCompleted":
        case "completed":
          result = this.isActivityCompleted(activity);
          break;
        case "satisfied":
          result = referencedObjective
              ? referencedObjective.satisfiedStatus === true
              : activity.objectiveSatisfiedStatus === true;
          break;
        case "objectiveStatusKnown":
        case "objectiveMeasureKnown":
          result = referencedObjective
              ? referencedObjective.measureStatus === true
              : activity.objectiveMeasureStatus === true;
          break;
        case "objectiveMeasureGreaterThan":
          if (
              referencedObjective
                  ? referencedObjective.measureStatus
                  : activity.objectiveMeasureStatus
          ) {
            const threshold = condition.measureThreshold || 0;
            const measure = referencedObjective
                ? referencedObjective.normalizedMeasure
                : activity.objectiveNormalizedMeasure;
            result = measure > threshold;
          }
          break;
        case "objectiveMeasureLessThan":
          if (
              referencedObjective
                  ? referencedObjective.measureStatus
                  : activity.objectiveMeasureStatus
          ) {
            const threshold = condition.measureThreshold || 0;
            const measure = referencedObjective
                ? referencedObjective.normalizedMeasure
                : activity.objectiveNormalizedMeasure;
            result = measure < threshold;
          }
          break;
        case "progressKnown":
          result = activity.completionStatus !== "unknown";
          break;
        case "attemptLimitExceeded":
          result = activity.hasAttemptLimitExceeded();
          break;
        case "timeLimitExceeded": {
          // Enhanced time limit checking with support for both attempt and activity duration limits
          // Handles missing/invalid durations gracefully and supports sub-second precision

          // Check timeLimitDuration (primary time limit for the condition)
          let limit = activity.timeLimitDuration;

          // Fallback to attemptAbsoluteDurationLimit if timeLimitDuration is not set
          if (!limit && activity.attemptAbsoluteDurationLimit) {
            limit = activity.attemptAbsoluteDurationLimit;
          }

          // No limit means condition is false
          if (!limit) {
            result = false;
            break;
          }

          // Parse limit - getDurationAsSeconds handles invalid strings gracefully (returns 0)
          const limitSeconds = getDurationAsSeconds(
              limit,
              scorm2004_regex.CMITimespan
          );

          // Invalid or zero limit means condition is false
          if (limitSeconds <= 0) {
            result = false;
            break;
          }

          let elapsedSeconds = 0;

          // Strategy 1: Prefer LMS-provided hook for accurate time tracking
          if (this.getAttemptElapsedSecondsHook) {
            try {
              const hookResult = this.getAttemptElapsedSecondsHook(activity);
              // Ensure we have a valid number
              if (
                  typeof hookResult === "number" &&
                  !Number.isNaN(hookResult) &&
                  hookResult >= 0
              ) {
                elapsedSeconds = hookResult;
              }
            } catch (error) {
              // Hook failed, fall through to timestamp-based calculation
              elapsedSeconds = 0;
            }
          }

          // Strategy 2: Calculate from attemptAbsoluteStartTime if hook not available or failed
          if (elapsedSeconds === 0 && activity.attemptAbsoluteStartTime) {
            try {
              const start = new Date(activity.attemptAbsoluteStartTime).getTime();
              const nowMs = this.now().getTime();

              // Validate timestamps before calculating
              if (!Number.isNaN(start) && !Number.isNaN(nowMs) && nowMs >= start) {
                // Use precise millisecond calculation, then convert to seconds
                elapsedSeconds = (nowMs - start) / 1000;
              }
            } catch (error) {
              // Invalid date, default to 0
              elapsedSeconds = 0;
            }
          }

          // Time limit is exceeded if elapsed time is strictly greater than limit
          // Both values must be positive for a valid comparison
          result = elapsedSeconds > limitSeconds;
          break;
        }
        case "outsideAvailableTimeRange": {
          // Enhanced time range checking with timezone-aware date comparisons
          // Handles ISO 8601 date strings with timezone offsets
          result = false; // Default to false (inside range)

          // Get current time using injected clock for testability
          const now = this.now();

          // Check begin time limit (activity not yet available)
          if (activity.beginTimeLimit) {
            try {
              // Parse ISO 8601 date string (may include timezone offset like +05:00)
              const beginDate = new Date(activity.beginTimeLimit);

              // Validate the parsed date
              if (!Number.isNaN(beginDate.getTime())) {
                // If current time is before begin time, we're outside the range
                if (now < beginDate) {
                  result = true;
                }
              }
            } catch (error) {
              // Invalid date format - treat as no begin limit
            }
          }

          // Check end time limit (activity no longer available)
          // Only check if we haven't already determined we're outside the range
          if (!result && activity.endTimeLimit) {
            try {
              // Parse ISO 8601 date string (may include timezone offset like -08:00)
              const endDate = new Date(activity.endTimeLimit);

              // Validate the parsed date
              if (!Number.isNaN(endDate.getTime())) {
                // If current time is after end time, we're outside the range
                if (now > endDate) {
                  result = true;
                }
              }
            } catch (error) {
              // Invalid date format - treat as no end limit
            }
          }

          // Edge cases handled:
          // - Only beginTimeLimit defined: false if now >= begin, true if now < begin
          // - Only endTimeLimit defined: false if now <= end, true if now > end
          // - Both defined: false if begin <= now <= end, true otherwise
          // - Neither defined: false (always inside non-existent range)
          break;
        }
        default:
          // For unknown conditions, assume false for safety
          result = false;
          break;
      }

      // Apply NOT operator if present
      if (condition.operator === "not" || condition.not === true) {
        result = !result;
      }

      conditionResults.push(result);
    }

    // Combine results based on combination mode
    if (combinationMode === "all" || combinationMode === "and") {
      // All conditions must be true (AND logic)
      return conditionResults.every((result) => result);
    } else if (combinationMode === "any" || combinationMode === "or") {
      // At least one condition must be true (OR logic)
      return conditionResults.some((result) => result);
    } else {
      // Default to AND logic if combination mode is unknown
      return conditionResults.every((result) => result);
    }
  }

  /**
   * Get elapsed attempt seconds for an activity using hook or timestamps
   */
  private getAttemptElapsedSeconds(activity: Activity): number {
    if (this.getAttemptElapsedSecondsHook) {
      try {
        return this.getAttemptElapsedSecondsHook(activity) || 0;
      } catch {
        return 0;
      }
    }
    if (activity.attemptAbsoluteStartTime) {
      const start = new Date(activity.attemptAbsoluteStartTime).getTime();
      const nowMs = this.now().getTime();
      if (!Number.isNaN(start) && nowMs > start) {
        return Math.max(0, (nowMs - start) / 1000);
      }
    }
    return 0;
  }

  /**
   * Check if activity is the last activity in a forward preorder tree traversal
   * Per SB.2.1 step 3.1: An activity is last overall if it's a leaf with no next siblings
   * anywhere in its ancestor chain
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if this is the last activity in the tree
   */
  private isActivityLastOverall(activity: Activity): boolean {
    // An activity is last overall if:
    // 1. It's a leaf (no children)
    // 2. It has no next sibling
    // 3. None of its ancestors have next siblings

    if (activity.children.length > 0) {
      return false; // Not a leaf
    }

    let current: Activity | null = activity;
    while (current) {
      if (this.activityTree.getNextSibling(current)) {
        return false; // Has a next sibling somewhere in the ancestor chain
      }
      current = current.parent;
    }

    return true; // No next siblings anywhere - this is the last activity
  }

  /**
   * Check forwardOnly violation at ALL ancestor levels (multi-level validation)
   * This is critical for complex activity trees where forwardOnly may be set at different levels
   * Returns the first violation found, or null if no violations
   * @param {Activity} fromActivity - The activity to check from
   * @return {{exception: string} | null} - Violation info or null
   */
  private checkForwardOnlyViolationAtAllLevels(
      fromActivity: Activity
  ): { exception: string } | null {
    // Walk up the ancestor chain checking forwardOnly at each level
    let current: Activity | null = fromActivity.parent;

    while (current) {
      if (current.sequencingControls.forwardOnly) {
        // SB.2.9-5: forwardOnly violation at this ancestor level
        return {exception: "SB.2.9-5"};
      }
      current = current.parent;
    }

    return null; // No violations found
  }

  /**
   * Check if an activity can be delivered (public wrapper for checkActivityProcess)
   * Used by NavigationLookAhead to properly evaluate preConditionRules
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if the activity can be delivered
   */
  public canActivityBeDelivered(activity: Activity): boolean {
    return this.checkActivityProcess(activity);
  }

  /**
   * Validate navigation request before expensive operations
   * Provides early validation to catch invalid requests quickly
   * @param {SequencingRequestType} request - The navigation request
   * @param {string | null} targetActivityId - Target activity ID for choice/jump
   * @param {Activity | null} currentActivity - Current activity
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  public validateNavigationRequest(
      request: SequencingRequestType,
      targetActivityId: string | null = null,
      currentActivity: Activity | null = null
  ): { valid: boolean; exception: string | null } {
    // Basic request type validation
    const validRequestTypes = Object.values(SequencingRequestType);
    if (!validRequestTypes.includes(request)) {
      return {valid: false, exception: "SB.2.12-6"};
    }

    // Validate based on request type
    switch (request) {
      case SequencingRequestType.CONTINUE:
      case SequencingRequestType.PREVIOUS: {
        if (!currentActivity) {
          return {valid: false, exception: "SB.2.12-1"};
        }
        if (currentActivity.isActive) {
          return {
            valid: false,
            exception: request === SequencingRequestType.CONTINUE ? "SB.2.7-1" : "SB.2.8-1"
          };
        }
        // Pre-check flow control
        if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
          return {
            valid: false,
            exception: request === SequencingRequestType.CONTINUE ? "SB.2.7-2" : "SB.2.8-2"
          };
        }
        // Pre-check forwardOnly for PREVIOUS
        if (request === SequencingRequestType.PREVIOUS) {
          const forwardOnlyViolation = this.checkForwardOnlyViolationAtAllLevels(currentActivity);
          if (forwardOnlyViolation) {
            return {valid: false, exception: forwardOnlyViolation.exception};
          }
        }
        break;
      }

      case SequencingRequestType.CHOICE: {
        if (!targetActivityId) {
          return {valid: false, exception: "SB.2.12-5"};
        }
        const targetActivity = this.activityTree.getActivity(targetActivityId);
        if (!targetActivity) {
          return {valid: false, exception: "SB.2.9-1"};
        }
        // Early validation of choice path
        const choicePathValidation = this.validateChoicePathConstraints(
            currentActivity,
            targetActivity
        );
        if (!choicePathValidation.valid) {
          return choicePathValidation;
        }
        // Check if target activity is disabled by precondition rules (SB.2.3)
        // This includes attemptLimitExceeded and other limit conditions
        if (!this.checkActivityProcess(targetActivity)) {
          return {valid: false, exception: "SB.2.9-6"}; // Activity is disabled
        }
        // Additional check for hiddenFromChoice precondition rule (SB.2.3)
        // This is separate from checkActivityProcess because hiddenFromChoice
        // only affects choice navigation, not flow navigation
        const preConditionResult = this.sequencingRulesCheckProcess(
            targetActivity,
            targetActivity.sequencingRules.preConditionRules
        );
        if (preConditionResult === RuleActionType.HIDE_FROM_CHOICE) {
          return {valid: false, exception: "SB.2.9-4"}; // Activity is hidden from choice
        }
        break;
      }

      case SequencingRequestType.JUMP: {
        if (!targetActivityId) {
          return {valid: false, exception: "SB.2.12-5"};
        }
        const jumpTarget = this.activityTree.getActivity(targetActivityId);
        if (!jumpTarget) {
          return {valid: false, exception: "SB.2.13-1"};
        }
        break;
      }

      default:
        // Other requests have their own validation in their respective methods
        break;
    }

    return {valid: true, exception: null};
  }

  /**
   * Validate choice path constraints across ALL ancestors
   * Checks forwardOnly, constrainChoice, preventActivation, choiceExit, and hiddenFromChoice at each level
   * @param {Activity | null} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity for choice
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateChoicePathConstraints(
      currentActivity: Activity | null,
      targetActivity: Activity
  ): { valid: boolean; exception: string | null } {
    // Basic tree membership check
    if (!this.isActivityInTree(targetActivity)) {
      return {valid: false, exception: "SB.2.9-2"};
    }

    // Cannot choose root
    if (targetActivity === this.activityTree.root) {
      return {valid: false, exception: "SB.2.9-3"};
    }

    // Check if hidden from choice along path to root
    let activity: Activity | null = targetActivity;
    while (activity) {
      if (activity.isHiddenFromChoice) {
        return {valid: false, exception: "SB.2.9-4"};
      }

      // Check choice control at each ancestor
      if (activity.parent && !activity.parent.sequencingControls.choice) {
        return {valid: false, exception: "SB.2.9-5"};
      }

      activity = activity.parent;
    }

    // If no current activity, just check availability
    if (!currentActivity) {
      if (!targetActivity.isAvailable) {
        return {valid: false, exception: "SB.2.9-7"};
      }
      return {valid: true, exception: null};
    }

    // Check choiceExit constraint at ALL ancestor levels
    // Walk from current activity to root, checking for choiceExit=false
    // If found AND ancestor is active, target must be a descendant of that ancestor (cannot exit that subtree)
    // Per SCORM spec: choiceExit only applies when we're actively IN that ancestor's subtree
    let currentAncestor: Activity | null = currentActivity.parent;
    while (currentAncestor) {
      // choiceExit only applies when the ancestor is ACTIVE
      if (currentAncestor.isActive && !currentAncestor.sequencingControls.choiceExit) {
        // choiceExit is false at this active ancestor
        // Check if target is a descendant of this ancestor
        if (!this.isActivity1AParentOfActivity2(currentAncestor, targetActivity)) {
          return {valid: false, exception: "SB.2.9-8"};
        }
        // If target is within this subtree, we can stop checking choiceExit at higher levels
        // since we're not exiting this ancestor's subtree
        break;
      }
      currentAncestor = currentAncestor.parent;
    }

    // Enhanced multi-level validation of ALL ancestor constraints
    let ancestorActivity: Activity | null = targetActivity.parent;
    while (ancestorActivity) {
      const validation = this.validateConstraintsAtAncestorLevel(
          ancestorActivity,
          currentActivity,
          targetActivity
      );
      if (!validation.valid) {
        return validation;
      }
      ancestorActivity = ancestorActivity.parent;
    }

    return {valid: true, exception: null};
  }

  /**
   * Validate constraints at a specific ancestor level
   * Checks forwardOnly, constrainChoice, and preventActivation for this ancestor
   * @param {Activity} ancestor - The ancestor to check constraints for
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateConstraintsAtAncestorLevel(
      ancestor: Activity,
      currentActivity: Activity,
      targetActivity: Activity
  ): { valid: boolean; exception: string | null } {
    // Find which children of this ancestor contain current and target
    const targetChild = this.findChildInPathToActivity(ancestor, targetActivity);
    const currentChild = this.findChildInPathToActivity(ancestor, currentActivity);

    // Only validate if both current and target are descendants of this ancestor
    if (!targetChild || !currentChild) {
      return {valid: true, exception: null};
    }

    const siblings = ancestor.children;
    const targetIndex = siblings.indexOf(targetChild);
    const currentIndex = siblings.indexOf(currentChild);

    if (targetIndex === -1 || currentIndex === -1) {
      return {valid: true, exception: null};
    }

    // Priority 1: Check forwardOnly constraint (highest priority)
    if (ancestor.sequencingControls.forwardOnly && targetIndex < currentIndex) {
      return {valid: false, exception: "SB.2.9-5"};
    }

    // Priority 2: Check mandatory activities being skipped
    if (targetIndex > currentIndex) {
      for (let i = currentIndex + 1; i < targetIndex; i++) {
        const intermediateChild = siblings[i];
        if (
            intermediateChild &&
            this.isActivityMandatory(intermediateChild) &&
            !this.isActivityCompleted(intermediateChild)
        ) {
          return {valid: false, exception: "SB.2.9-6"};
        }
      }
    }

    // Priority 3: Check constrainChoice constraint
    if (ancestor.sequencingControls.constrainChoice) {
      // Cannot skip forward beyond next sibling
      if (targetIndex > currentIndex + 1) {
        return {valid: false, exception: "SB.2.9-7"};
      }

      // Cannot go backward to incomplete activity
      if (targetIndex < currentIndex) {
        if (
            targetActivity.completionStatus !== "completed" &&
            targetActivity.completionStatus !== "passed"
        ) {
          return {valid: false, exception: "SB.2.9-7"};
        }
      }
    }

    // Check preventActivation constraint at this level
    if (ancestor.sequencingControls.preventActivation) {
      if (targetActivity.attemptCount === 0 && !targetActivity.isActive) {
        return {valid: false, exception: "SB.2.9-6"};
      }
    }

    return {valid: true, exception: null};
  }

  /**
   * Get all available activities that can be selected via choice navigation
   * Excludes activities that are:
   * - Hidden from choice (isHiddenFromChoice = true)
   * - Not available (isAvailable = false)
   * - Outside choiceExit=false boundaries
   * - Blocked by other sequencing constraints
   *
   * This method is useful for UIs that need to show available navigation options
   *
   * @return {Activity[]} - Array of activities available for choice
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

      // Skip if hidden from choice
      if (activity.isHiddenFromChoice) {
        continue;
      }

      // Skip if not available
      if (!activity.isAvailable) {
        continue;
      }

      // Skip if not visible
      if (!activity.isVisible) {
        continue;
      }

      // Check if choice is allowed by parent
      if (activity.parent && !activity.parent.sequencingControls.choice) {
        continue;
      }

      // If there's a current activity, check choiceExit constraints
      if (currentActivity) {
        let blocked = false;
        let currentAncestor: Activity | null = currentActivity.parent;

        while (currentAncestor) {
          // choiceExit only applies when the ancestor is ACTIVE
          if (currentAncestor.isActive && !currentAncestor.sequencingControls.choiceExit) {
            // choiceExit is false at this active ancestor - can only choose activities within this subtree
            if (!this.isActivity1AParentOfActivity2(currentAncestor, activity)) {
              blocked = true;
              break;
            }
            // Within the subtree, stop checking higher levels
            break;
          }
          currentAncestor = currentAncestor.parent;
        }

        if (blocked) {
          continue;
        }
      }

      // Validate the full choice path
      const validation = this.validateChoicePathConstraints(currentActivity, activity);
      if (validation.valid) {
        availableActivities.push(activity);
      }
    }

    return availableActivities;
  }
}

/**
 * Enum for flow subprocess modes
 */
enum FlowSubprocessMode {
  FORWARD = "forward",
  BACKWARD = "backward",
}
