import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import {
  RuleActionType,
  RuleConditionOperator,
  SequencingRule,
  SequencingRules
} from "./sequencing_rules";
import { SequencingControls } from "./sequencing_controls";
import { ADLNav } from "../adl";
import { getDurationAsSeconds } from "../../../utilities";
import { scorm2004_regex } from "../../../constants/regex";
import { SelectionRandomization } from "./selection_randomization";

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
    exception: string | null = null
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
    this.getAttemptElapsedSecondsHook = (options?.getAttemptElapsedSeconds as
      | ((activity: Activity) => number)
      | undefined);
    this.getActivityElapsedSecondsHook = (options?.getActivityElapsedSeconds as
      | ((activity: Activity) => number)
      | undefined);
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

    // For START, we need to flow into the activity tree from the root
    // Start with the root and find first deliverable leaf activity
    const deliverableActivity = this.findFirstDeliverableActivity(root);

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

    if (!flowResult) {
      result.exception = "SB.2.7-2"; // No activity available
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
    if (currentActivity.isActive) {
      result.exception = "SB.2.8-1"; // Current activity not terminated
      return result;
    }

    // Check if flow is allowed from the current activity's parent
    if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
      result.exception = "SB.2.8-2"; // No activity available (flow disabled)
      return result;
    }

    // Check if backward flow is allowed (forwardOnly control)
    if (currentActivity.parent && currentActivity.parent.sequencingControls.forwardOnly) {
      result.exception = "SB.2.8-2"; // No activity available (backward flow disabled)
      return result;
    }

    // Flow from current activity to find previous using flow subprocess
    const flowResult = this.flowSubprocess(currentActivity, FlowSubprocessMode.BACKWARD);

    if (!flowResult) {
      result.exception = "SB.2.8-2"; // No activity available
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
      this.ensureSelectionAndRandomization(targetActivity);
      const availableChildren = targetActivity.getAvailableChildren();

      const flowResult = this.flowActivityTraversalSubprocess(
        targetActivity,
        true, // direction forward
        true, // consider children
        FlowSubprocessMode.FORWARD
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
    if (activity.getAvailableChildren() === activity.children &&
      (SelectionRandomization.isSelectionNeeded(activity) ||
        SelectionRandomization.isRandomizationNeeded(activity))) {
      SelectionRandomization.applySelectionAndRandomization(activity, activity.isNewAttempt);
    }
  }

  /**
   * Flow Activity Traversal Subprocess (SB.2.2)
   * Checks if an activity can be delivered and flows into clusters if needed
   */
  private flowActivityTraversalSubprocess(
    activity: Activity,
    _direction: boolean,
    considerChildren: boolean,
    mode: FlowSubprocessMode
  ): Activity | null {
    // Check if the activity is available
    if (!activity.isAvailable) {
      return null;
    }

    // Check sequencing control modes
    const parent = activity.parent;
    if (parent && !parent.sequencingControls.flow) {
      return null;
    }

    // Activity is a cluster, try to flow into it to find a deliverable leaf
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

    // If activity is a leaf (no children), check if it can be delivered
    if (activity.children.length === 0) {
      // Check if this activity was intended to be a cluster but is empty
      // A cluster typically has flow control enabled
      if (activity.sequencingControls.flow) {
        // This appears to be an empty cluster, not a true leaf
        return null;
      }

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
   */
  private checkActivityProcess(activity: Activity): boolean {
    // Check if activity is available
    if (!activity.isAvailable) {
      return false;
    }

    // Check limit conditions (UP.1)
    if (this.limitConditionsCheckProcess(activity)) {
      return false; // Activity violates limit conditions
    }

    // Check pre-condition rules using UP.2
    const preConditionResult = this.sequencingRulesCheckProcess(
      activity,
      activity.sequencingRules.preConditionRules
    );

    return preConditionResult !== RuleActionType.SKIP &&
      preConditionResult !== RuleActionType.DISABLED;
  }

  /**
   * Terminate Descendent Attempts Process (SB.2.4)
   * Ends attempts on an activity and its descendants
   */
  private terminateDescendentAttemptsProcess(activity: Activity, skipExitRules: boolean = false): void {
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
    if (exitAction === RuleActionType.EXIT ||
      exitAction === RuleActionType.EXIT_PARENT ||
      exitAction === RuleActionType.EXIT_ALL) {
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
          const anyActive = allActivities.some(a => a.isActive);
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
      RuleActionType.STOP_FORWARD_TRAVERSAL,
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
  private validateSequencingRequest(request: SequencingRequestType, targetActivityId: string | null): {
    valid: boolean,
    exception: string | null
  } {
    // Validate request type
    const validRequestTypes = Object.values(SequencingRequestType);
    if (!validRequestTypes.includes(request)) {
      return { valid: false, exception: "SB.2.12-6" };
    }

    // Validate target activity ID for choice and jump requests
    if ((request === SequencingRequestType.CHOICE || request === SequencingRequestType.JUMP) && !targetActivityId) {
      return { valid: false, exception: "SB.2.12-5" };
    }

    // Additional request-specific validation
    const requestSpecificValidation = this.validateRequestSpecificConstraints(request, targetActivityId);
    if (!requestSpecificValidation.valid) {
      return requestSpecificValidation;
    }

    return { valid: true, exception: null };
  }

  /**
   * Validate Request-Specific Constraints
   * @param {SequencingRequestType} request - The sequencing request
   * @param {string | null} targetActivityId - Target activity ID
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateRequestSpecificConstraints(request: SequencingRequestType, targetActivityId: string | null): {
    valid: boolean,
    exception: string | null
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
          return { valid: false, exception: "SB.2.12-1" };
        }
        break;
      case SequencingRequestType.CHOICE:
        if (targetActivityId) {
          const targetActivity = this.activityTree.getActivity(targetActivityId);
          if (!targetActivity) {
            return { valid: false, exception: "SB.2.9-1" };
          }
        }
        break;
      case SequencingRequestType.JUMP:
        if (targetActivityId) {
          const targetActivity = this.activityTree.getActivity(targetActivityId);
          if (!targetActivity) {
            return { valid: false, exception: "SB.2.13-1" };
          }
        }
        break;
    }

    return { valid: true, exception: null };
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
    if (activity.attemptAbsoluteDurationLimit !== null) {
      const attemptDurationMs = this.parseISO8601Duration(activity.attemptExperiencedDuration);
      const attemptLimitMs = this.parseISO8601Duration(activity.attemptAbsoluteDurationLimit);

      if (attemptDurationMs >= attemptLimitMs) {
        return true; // Attempt duration limit exceeded
      }
    }

    // Check activity absolute duration limit
    if (activity.activityAbsoluteDurationLimit !== null) {
      const activityDurationMs = this.parseISO8601Duration(activity.activityExperiencedDuration);
      const activityLimitMs = this.parseISO8601Duration(activity.activityAbsoluteDurationLimit);

      if (activityDurationMs >= activityLimitMs) {
        return true; // Activity duration limit exceeded
      }
    }

    return false; // No limit conditions violated
  }

  /**
   * Parse ISO 8601 duration to milliseconds
   * @param {string} duration - ISO 8601 duration string
   * @return {number} - Duration in milliseconds
   * @private
   */
  private parseISO8601Duration(duration: string): number {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/;
    const matches = duration.match(regex);

    if (!matches) {
      return 0;
    }

    const hours = parseInt(matches[1] || "0", 10);
    const minutes = parseInt(matches[2] || "0", 10);
    const seconds = parseFloat(matches[3] || "0");

    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }

  /**
   * Sequencing Rules Check Process (UP.2)
   * General process for evaluating a set of sequencing rules
   * @param {Activity} activity - The activity to evaluate rules for
   * @param {SequencingRule[]} rules - The rules to evaluate
   * @return {RuleActionType | null} - The action to take, or null if no rules apply
   * @private
   */
  private sequencingRulesCheckProcess(activity: Activity, rules: SequencingRule[]): RuleActionType | null {
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
    } else if (conditionCombination === "any" || conditionCombination === RuleConditionOperator.OR) {
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

  /**
   * Flow Subprocess (SB.2.3)
   * Traverses the activity tree in the specified direction to find a deliverable activity
   * @param {Activity} fromActivity - The activity to flow from
   * @param {FlowSubprocessMode} direction - The flow direction
   * @return {Activity | null} - The next deliverable activity, or null if none found
   */
  private flowSubprocess(fromActivity: Activity, direction: FlowSubprocessMode): Activity | null {
    let candidateActivity: Activity | null = fromActivity;
    let firstIteration = true;

    // Keep traversing until we find a deliverable activity or run out of candidates
    while (candidateActivity) {
      // Get next candidate using flow tree traversal
      // On first iteration, we want to skip the current activity's children
      const nextCandidate = this.flowTreeTraversalSubprocess(
        candidateActivity,
        direction,
        firstIteration
      );

      if (!nextCandidate) {
        // No more candidates
        return null;
      }

      // Check if this candidate can be delivered
      const deliverable = this.flowActivityTraversalSubprocess(
        nextCandidate,
        direction === FlowSubprocessMode.FORWARD,
        true, // consider children
        direction
      );

      if (deliverable) {
        return deliverable;
      }

      // Continue with next candidate
      candidateActivity = nextCandidate;
      firstIteration = false;
    }

    return null;
  }


  /**
   * Flow Tree Traversal Subprocess (SB.2.1)
   * Traverses the activity tree to find the next activity in the specified direction
   * @param {Activity} fromActivity - The activity to traverse from
   * @param {FlowSubprocessMode} direction - The traversal direction
   * @param {boolean} skipChildren - Whether to skip checking children (for continuing from current)
   * @return {Activity | null} - The next activity in the tree, or null if none
   */
  private flowTreeTraversalSubprocess(
    fromActivity: Activity,
    direction: FlowSubprocessMode,
    skipChildren: boolean = false
  ): Activity | null {
    if (direction === FlowSubprocessMode.FORWARD) {
      // First, check if activity has children (unless we're skipping them)
      if (!skipChildren) {
        this.ensureSelectionAndRandomization(fromActivity);
        const children = fromActivity.getAvailableChildren();
        if (children.length > 0) {
          return children[0] || null;
        }
      }

      // No children, try to get next sibling
      let current: Activity | null = fromActivity;
      while (current) {
        const nextSibling = this.activityTree.getNextSibling(current);
        if (nextSibling) {
          return nextSibling;
        }
        // No next sibling, move up to parent
        current = current.parent;
      }
    } else {
      // Backward direction
      // Try to get previous sibling
      const previousSibling = this.activityTree.getPreviousSibling(fromActivity);
      if (previousSibling) {
        // If previous sibling has children, go to the last descendant
        let lastDescendant = previousSibling;
        while (true) {
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

      // No previous sibling at this level, try going up to parent and then its previous sibling
      let current: Activity | null = fromActivity;
      while (current && current.parent) {
        const parentPreviousSibling = this.activityTree.getPreviousSibling(current.parent);
        if (parentPreviousSibling) {
          // Found a previous sibling of an ancestor, go to its last descendant
          let lastDescendant = parentPreviousSibling;
          while (true) {
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
        // Move up to grandparent
        current = current.parent;
      }

      return null; // Reached beginning of tree
    }

    return null;
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
      const deliverable = this.enhancedChoiceActivityTraversalSubprocess(child);
      if (deliverable) {
        return deliverable;
      }
    }

    return null;
  }

  /**
   * Enhanced Choice Activity Traversal Subprocess (SB.2.4)
   * Priority 3 Gap: Choice Activity Traversal with stopForwardTraversal and forwardOnly checks
   * @param {Activity} activity - The activity to check and possibly traverse
   * @return {Activity | null} - A deliverable activity, or null if none found
   */
  private enhancedChoiceActivityTraversalSubprocess(activity: Activity): Activity | null {
    // Check if activity is available
    if (!activity.isAvailable) {
      return null;
    }

    // Check if activity is hidden from choice
    if (activity.isHiddenFromChoice) {
      return null;
    }

    // Enhanced constraint checks including stopForwardTraversal and forwardOnly
    const traversalValidation = this.validateChoiceTraversalConstraints(activity);
    if (!traversalValidation.canTraverse) {
      return null;
    }

    // If it's a leaf, check if it can be delivered
    if (activity.children.length === 0) {
      if (this.checkActivityProcess(activity)) {
        return activity;
      }
      return null;
    }

    // If it's a cluster, traverse into it with enhanced validation
    if (traversalValidation.canTraverseInto) {
      return this.choiceFlowTreeTraversalSubprocess(activity);
    }

    return null;
  }

  /**
   * Original Choice Activity Traversal Subprocess for backwards compatibility
   */
  private choiceActivityTraversalSubprocess(activity: Activity): Activity | null {
    return this.enhancedChoiceActivityTraversalSubprocess(activity);
  }

  /**
   * Evaluate post-condition rules for the current activity
   * This should be called after an activity has been delivered and the learner has interacted with it
   * @param {Activity} activity - The activity to evaluate
   * @return {SequencingRequestType | null} - The sequencing request to process, if any
   */
  public evaluatePostConditionRules(activity: Activity): SequencingRequestType | null {
    const postAction = this.postConditionRulesSubprocess(activity);

    if (!postAction) {
      return null;
    }

    // Map post-condition actions to sequencing requests
    switch (postAction) {
      case RuleActionType.EXIT_PARENT:
        // Exit parent will be handled by exit action rules
        return SequencingRequestType.EXIT;

      case RuleActionType.EXIT_ALL:
        return SequencingRequestType.EXIT_ALL;

      case RuleActionType.RETRY:
        return SequencingRequestType.RETRY;

      case RuleActionType.RETRY_ALL:
        return SequencingRequestType.RETRY_ALL;

      case RuleActionType.CONTINUE:
        return SequencingRequestType.CONTINUE;

      case RuleActionType.PREVIOUS:
        return SequencingRequestType.PREVIOUS;

      case RuleActionType.STOP_FORWARD_TRAVERSAL:
        // Set traversal limiter on controls; not a navigation request
        activity.sequencingControls.stopForwardTraversal = true;
        return null;

      default:
        return null;
    }
  }

  /**
   * Validate Choice Flow Constraints
   * Priority 3 Gap: Choice Flow Tree Traversal constraint validation
   * @param {Activity} fromActivity - Activity to traverse from
   * @param {Activity[]} children - Available children
   * @return {{valid: boolean, validChildren: Activity[]}} - Validation result
   */
  private validateChoiceFlowConstraints(fromActivity: Activity, children: Activity[]): {
    valid: boolean,
    validChildren: Activity[]
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
    canTraverse: boolean,
    canTraverseInto: boolean
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

    return { canTraverse, canTraverseInto };
  }

  /**
   * Validate Constrained Choice Boundaries
   * Priority 3 Gap: Proper choice boundary checking
   * @param {Activity | null} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateConstrainedChoiceBoundaries(currentActivity: Activity | null, targetActivity: Activity): {
    valid: boolean,
    exception: string | null
  } {
    // Path to root validation with enhanced constraint checking
    let activity: Activity | null = targetActivity;
    while (activity) {
      if (activity.isHiddenFromChoice) {
        return { valid: false, exception: "SB.2.9-4" }; // Activity hidden from choice
      }

      // Enhanced choice control validation
      if (activity.parent && !activity.parent.sequencingControls.choice) {
        return { valid: false, exception: "SB.2.9-5" }; // Choice control is not allowed
      }

      // Check constrained choice boundaries
      if (activity.parent?.sequencingControls.constrainChoice) {
        const boundaryCheck = this.checkConstrainedChoiceBoundary(currentActivity, activity, activity.parent);
        if (!boundaryCheck.valid) {
          return boundaryCheck;
        }
      }

      activity = activity.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Helper methods for enhanced choice processing
   */
  private validateConstrainChoiceForFlow(activity: Activity, parent: Activity): boolean {
    // Implement specific constrainChoice logic for flow scenarios according to SCORM 2004

    // If constrainChoice is false, no restrictions apply
    if (!parent.sequencingControls || !parent.sequencingControls.constrainChoice) {
      return true;
    }

    // When constrainChoice is true, choices are restricted based on flow direction
    const children = parent.children;
    if (!children || children.length === 0) {
      return true;
    }

    const targetIndex = children.indexOf(activity);
    if (targetIndex === -1) {
      return false; // Activity not found in parent's children
    }

    // Get the current activity in the flow
    const currentActivity = this.getCurrentActivity(parent);
    if (!currentActivity) {
      // No current activity, allow choice to first available activity
      return this.isActivityAvailableForChoice(activity);
    }

    const currentIndex = children.indexOf(currentActivity);
    if (currentIndex === -1) {
      return false; // Current activity not found
    }

    // Check flow direction constraints
    if (parent.sequencingControls.flow) {
      // In forward flow mode with constrainChoice, only allow:
      // 1. Next activity in sequence
      // 2. Previously completed activities if forwardOnly is false

      if (targetIndex === currentIndex + 1) {
        // Next activity - allow if available
        return this.isActivityAvailableForChoice(activity);
      }

      if (targetIndex < currentIndex && !parent.sequencingControls.forwardOnly) {
        // Previous activity - allow if it was completed
        return activity.completionStatus === "completed" ||
          activity.completionStatus === "passed";
      }

      // All other choices are constrained
      return false;
    } else {
      // Non-flow mode - constrainChoice limits to completed/available activities
      return this.isActivityAvailableForChoice(activity) &&
        (activity.completionStatus === "completed" ||
          activity.completionStatus === "unknown" ||
          activity.completionStatus === "incomplete");
    }
  }

  private evaluateConstrainChoiceForTraversal(activity: Activity): boolean {
    // Implement constrainChoice evaluation for traversal according to SCORM 2004

    if (!activity.parent) {
      return true; // Root activity has no traversal constraints
    }

    const parent = activity.parent;

    // If constrainChoice is false, traversal is allowed
    if (!parent.sequencingControls || !parent.sequencingControls.constrainChoice) {
      return true;
    }

    // When constrainChoice is true, traversal must respect choice constraints
    // This is evaluated during navigation request processing

    const siblings = parent.children;
    if (!siblings || siblings.length === 0) {
      return true;
    }

    const activityIndex = siblings.indexOf(activity);
    if (activityIndex === -1) {
      return false; // Activity not found in siblings
    }

    // Check if this activity can be reached through constrained choice
    // 1. Check if activity is available for choice
    if (!this.isActivityAvailableForChoice(activity)) {
      return false;
    }

    // 2. Check traversal path constraints
    if (parent.sequencingControls.flow) {
      // In flow mode, check if we can traverse to this activity
      const currentActivity = this.getCurrentActivity(parent);
      if (currentActivity) {
        const currentIndex = siblings.indexOf(currentActivity);

        // If forwardOnly is true, can only traverse forward
        if (parent.sequencingControls.forwardOnly && activityIndex < currentIndex) {
          return false;
        }

        // Check if there are any blocking activities between current and target
        if (currentIndex < activityIndex) {
          // Forward traversal - check for mandatory intermediate activities
          for (let i = currentIndex + 1; i < activityIndex; i++) {
            const intermediateActivity = siblings[i];
            if (intermediateActivity &&
              this.isActivityMandatory(intermediateActivity) &&
              !this.isActivityCompleted(intermediateActivity)) {
              return false; // Cannot skip mandatory incomplete activity
            }
          }
        }
      }
    }

    // 3. Check specific choice constraints based on activity state
    return this.validateActivityChoiceState(activity);
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
      if (activity.completionStatus === "completed" ||
        activity.completionStatus === "passed") {
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

  private checkConstrainedChoiceBoundary(currentActivity: Activity | null, activity: Activity, parent: Activity): {
    valid: boolean,
    exception: string | null
  } {
    // Implement boundary checking logic for constrained choice according to SCORM 2004

    try {
      // If no current activity, choice to any available activity is valid
      if (!currentActivity) {
        if (this.isActivityAvailableForChoice(activity)) {
          return { valid: true, exception: null };
        } else {
          return { valid: false, exception: "Activity not available for choice" };
        }
      }

      // Check if parent has constrainChoice enabled
      if (!parent.sequencingControls || !parent.sequencingControls.constrainChoice) {
        // No constraints - just check basic availability
        if (this.isActivityAvailableForChoice(activity)) {
          return { valid: true, exception: null };
        } else {
          return { valid: false, exception: "Activity not available for choice" };
        }
      }

      const siblings = parent.children;
      if (!siblings || siblings.length === 0) {
        return { valid: true, exception: null };
      }

      const currentIndex = siblings.indexOf(currentActivity);
      const targetIndex = siblings.indexOf(activity);

      if (currentIndex === -1 || targetIndex === -1) {
        return { valid: false, exception: "Activity not found in parent structure" };
      }

      // Check flow and forwardOnly constraints
      if (parent.sequencingControls.flow) {
        // Flow mode constraints
        if (parent.sequencingControls.forwardOnly && targetIndex < currentIndex) {
          // Backward navigation in forwardOnly flow
          if (activity.completionStatus !== "completed" &&
            activity.completionStatus !== "passed") {
            return { valid: false, exception: "Forward-only constraint violated" };
          }
        }

        // Check if we're skipping mandatory activities
        if (targetIndex > currentIndex) {
          for (let i = currentIndex + 1; i < targetIndex; i++) {
            const intermediateActivity = siblings[i];
            if (intermediateActivity &&
              this.isActivityMandatory(intermediateActivity) &&
              !this.isActivityCompleted(intermediateActivity)) {
              return { valid: false, exception: "Cannot skip mandatory incomplete activity" };
            }
          }
        }
      }

      // Check choice boundaries based on completion and availability
      if (!this.isActivityAvailableForChoice(activity)) {
        return { valid: false, exception: "Activity not available for choice" };
      }

      // Check for specific boundary violations
      if (this.hasChoiceBoundaryViolation(currentActivity, activity, parent)) {
        return { valid: false, exception: "Choice boundary constraint violation" };
      }

      // All boundary checks passed
      return { valid: true, exception: null };

    } catch (error) {
      return { valid: false, exception: `Boundary check error: ${error}` };
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
    return activity.isVisible &&
      !activity.isHiddenFromChoice &&
      activity.isAvailable &&
      (activity.sequencingControls ? activity.sequencingControls.choice : true);
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

    // Check for explicit mandatory flag or default to true for flow sequences
    return (activity as any).mandatory !== false;
  }

  private isActivityCompleted(activity: Activity): boolean {
    // Check if activity is completed
    return activity.completionStatus === "completed" ||
      activity.completionStatus === "passed" ||
      activity.successStatus === "passed";
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
        if (rule.action === RuleActionType.DISABLED || rule.action === RuleActionType.HIDE_FROM_CHOICE) {
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

  private hasChoiceBoundaryViolation(currentActivity: Activity, targetActivity: Activity, parent: Activity): boolean {
    // Check for specific boundary violations

    // Check for time-based constraints
    if (targetActivity.timeLimitAction && targetActivity.beginTimeLimit) {
      const now = new Date();
      const beginTime = new Date(targetActivity.beginTimeLimit);
      if (now < beginTime) {
        return true; // Not yet available
      }
    }

    if (targetActivity.endTimeLimit) {
      const now = new Date();
      const endTime = new Date(targetActivity.endTimeLimit);
      if (now > endTime) {
        return true; // No longer available
      }
    }

    // Check for attempt limit violations
    return !!(targetActivity.attemptLimit &&
      targetActivity.attemptCount >= targetActivity.attemptLimit);
  }

  private evaluateRuleConditions(conditions: any[], activity: Activity, combinationMode: string = "all"): boolean {
    // Full SCORM 2004 rule condition evaluation
    if (conditions.length === 0) {
      return true; // No conditions means always true
    }

    // Evaluate each condition and collect results
    const conditionResults: boolean[] = [];
    
    for (const condition of conditions) {
      const conditionType = condition.condition || condition.conditionType;
      let result = false;

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
          result = activity.objectiveSatisfiedStatus === true;
          break;
        case "objectiveStatusKnown":
          result = activity.objectiveMeasureStatus === true;
          break;
        case "objectiveMeasureKnown":
          result = activity.objectiveMeasureStatus === true;
          break;
        case "objectiveMeasureGreaterThan":
          if (activity.objectiveMeasureStatus) {
            const threshold = condition.measureThreshold || 0;
            result = activity.objectiveNormalizedMeasure > threshold;
          }
          break;
        case "objectiveMeasureLessThan":
          if (activity.objectiveMeasureStatus) {
            const threshold = condition.measureThreshold || 0;
            result = activity.objectiveNormalizedMeasure < threshold;
          }
          break;
        case "progressKnown":
          result = activity.completionStatus !== "unknown";
          break;
        case "attemptLimitExceeded":
          result = activity.hasAttemptLimitExceeded();
          break;
        case "timeLimitExceeded": {
          const limit = activity.timeLimitDuration;
          if (!limit) {
            result = false;
            break;
          }
          const limitSeconds = getDurationAsSeconds(limit, scorm2004_regex.CMITimespan);
          let elapsedSeconds = 0;
          // Prefer LMS-provided hook
          if (this.getAttemptElapsedSecondsHook) {
            try {
              elapsedSeconds = this.getAttemptElapsedSecondsHook(activity) || 0;
            } catch (_) {
              elapsedSeconds = 0;
            }
          } else if (activity.attemptAbsoluteStartTime) {
            const start = new Date(activity.attemptAbsoluteStartTime).getTime();
            const nowMs = this.now().getTime();
            if (!Number.isNaN(start) && nowMs > start) {
              elapsedSeconds = Math.max(0, (nowMs - start) / 1000);
            }
          }
          result = elapsedSeconds > limitSeconds && limitSeconds > 0;
          break;
        }
        case "outsideAvailableTimeRange":
          // Check if current time is outside available time range
          if (activity.beginTimeLimit || activity.endTimeLimit) {
            const now = new Date();
            if (activity.beginTimeLimit) {
              const beginDate = new Date(activity.beginTimeLimit);
              if (now < beginDate) result = true;
            }
            if (activity.endTimeLimit) {
              const endDate = new Date(activity.endTimeLimit);
              if (now > endDate) result = true;
            }
          }
          break;
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
      return conditionResults.every(result => result);
    } else if (combinationMode === "any" || combinationMode === "or") {
      // At least one condition must be true (OR logic)
      return conditionResults.some(result => result);
    } else {
      // Default to AND logic if combination mode is unknown
      return conditionResults.every(result => result);
    }
  }

  /**
   * Get elapsed attempt seconds for an activity using hook or timestamps
   */
  private getAttemptElapsedSeconds(activity: Activity): number {
    if (this.getAttemptElapsedSecondsHook) {
      try { return this.getAttemptElapsedSecondsHook(activity) || 0; } catch { return 0; }
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
}

/**
 * Enum for flow subprocess modes
 */
enum FlowSubprocessMode {
  FORWARD = "forward",
  BACKWARD = "backward",
}
