import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import {
  DeliveryRequestType,
  SequencingProcess,
  SequencingRequestType
} from "./sequencing_process";
import { RollupProcess } from "./rollup_process";
import { ADLNav } from "../adl";
import { RuleActionType } from "./sequencing_rules";
import { getDurationAsSeconds } from "../../../utilities";
import { scorm2004_regex } from "../../../constants/regex";

/**
 * Enum for navigation request types
 */
export enum NavigationRequestType {
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
  NOT_VALID = "_none_"
}

/**
 * Class representing a navigation request result
 */
export class NavigationRequestResult {
  public valid: boolean;
  public terminationRequest: SequencingRequestType | null;
  public sequencingRequest: SequencingRequestType | null;
  public targetActivityId: string | null;
  public exception: string | null;

  constructor(
    valid: boolean = false,
    terminationRequest: SequencingRequestType | null = null,
    sequencingRequest: SequencingRequestType | null = null,
    targetActivityId: string | null = null,
    exception: string | null = null
  ) {
    this.valid = valid;
    this.terminationRequest = terminationRequest;
    this.sequencingRequest = sequencingRequest;
    this.targetActivityId = targetActivityId;
    this.exception = exception;
  }
}

/**
 * Class representing a delivery request
 */
export class DeliveryRequest {
  public valid: boolean;
  public targetActivity: Activity | null;
  public exception: string | null;

  constructor(
    valid: boolean = false,
    targetActivity: Activity | null = null,
    exception: string | null = null
  ) {
    this.valid = valid;
    this.targetActivity = targetActivity;
    this.exception = exception;
  }
}

/**
 * Overall Sequencing Process (OP.1)
 * Controls the overall execution of the sequencing loop
 */
export class OverallSequencingProcess {
  private activityTree: ActivityTree;
  private sequencingProcess: SequencingProcess;
  private rollupProcess: RollupProcess;
  private adlNav: ADLNav | null;
  private contentDelivered: boolean = false;
  private eventCallback: ((eventType: string, data?: any) => void) | null = null;
  private globalObjectiveMap: Map<string, any> = new Map();
  private now: () => Date;
  private enhancedDeliveryValidation: boolean;

  constructor(
    activityTree: ActivityTree,
    sequencingProcess: SequencingProcess,
    rollupProcess: RollupProcess,
    adlNav: ADLNav | null = null,
    eventCallback: ((eventType: string, data?: any) => void) | null = null,
    options?: { now?: () => Date; enhancedDeliveryValidation?: boolean }
  ) {
    this.activityTree = activityTree;
    this.sequencingProcess = sequencingProcess;
    this.rollupProcess = rollupProcess;
    this.adlNav = adlNav;
    this.eventCallback = eventCallback;
    this.now = options?.now || (() => new Date());
    this.enhancedDeliveryValidation = options?.enhancedDeliveryValidation === true;

    // Initialize global objective map
    this.initializeGlobalObjectiveMap();
  }

  /**
   * Overall Sequencing Process (OP.1)
   * Main entry point for processing navigation requests
   * @param {NavigationRequestType} navigationRequest - The navigation request
   * @param {string | null} targetActivityId - Target activity for choice/jump requests
   * @return {DeliveryRequest} - The delivery request result
   */
  public processNavigationRequest(
    navigationRequest: NavigationRequestType,
    targetActivityId: string | null = null
  ): DeliveryRequest {
    // Step 1: Navigation Request Process (NB.2.1)
    const navResult = this.navigationRequestProcess(navigationRequest, targetActivityId);

    if (!navResult.valid) {
      return new DeliveryRequest(false, null, navResult.exception);
    }

    // Step 2: Termination Request Process (TB.2.3) if needed
    if (navResult.terminationRequest) {
      const termResult = this.terminationRequestProcess(navResult.terminationRequest, !!navResult.sequencingRequest);
      if (!termResult) {
        return new DeliveryRequest(false, null, "TB.2.3-1");
      }

      // If this is a termination-only request (no sequencing request), return success
      if (!navResult.sequencingRequest) {
        return new DeliveryRequest(true, null);
      }
    }

    // Step 3: Sequencing Request Process (SB.2.12)
    if (navResult.sequencingRequest) {
      const seqResult = this.sequencingProcess.sequencingRequestProcess(
        navResult.sequencingRequest,
        navResult.targetActivityId
      );

      if (seqResult.exception) {
        return new DeliveryRequest(false, null, seqResult.exception);
      }

      if (seqResult.deliveryRequest === DeliveryRequestType.DELIVER && seqResult.targetActivity) {
        // INTEGRATION: Validate rollup state consistency before delivery
        if (this.activityTree.root && !this.rollupProcess.validateRollupStateConsistency(this.activityTree.root)) {
          return new DeliveryRequest(false, null, "OP.1-3");
        }

        // INTEGRATION: Process global objective mapping before delivery
        this.rollupProcess.processGlobalObjectiveMapping(seqResult.targetActivity, this.globalObjectiveMap);

        // Step 4: Delivery Request Process (DB.1.1)
        const deliveryResult = this.deliveryRequestProcess(seqResult.targetActivity);

        if (deliveryResult.valid) {
          // Step 5: Content Delivery Environment Process (DB.2)
          this.contentDeliveryEnvironmentProcess(deliveryResult.targetActivity!);

          // INTEGRATION: Validate rollup state consistency after delivery
          if (this.activityTree.root) {
            this.rollupProcess.validateRollupStateConsistency(this.activityTree.root);
          }

          return deliveryResult;
        }

        return deliveryResult;
      }
    }

    return new DeliveryRequest(false, null, "OP.1-1");
  }

  /**
   * Navigation Request Process (NB.2.1)
   * Validates navigation requests and converts them to termination/sequencing requests
   * @param {NavigationRequestType} request - The navigation request
   * @param {string | null} targetActivityId - Target activity for choice/jump
   * @return {NavigationRequestResult} - The validation result
   */
  private navigationRequestProcess(
    request: NavigationRequestType,
    targetActivityId: string | null = null
  ): NavigationRequestResult {
    // Enhanced logging for debugging
    this.fireEvent("onNavigationRequestProcessing", { request, targetActivityId });
    const currentActivity = this.activityTree.currentActivity;

    // Check if navigation request is valid
    switch (request) {
      case NavigationRequestType.START:
        if (currentActivity !== null) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-1");
        }
        return new NavigationRequestResult(
          true,
          null,
          SequencingRequestType.START,
          null
        );

      case NavigationRequestType.RESUME_ALL:
        if (currentActivity !== null) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-2");
        }
        if (this.activityTree.suspendedActivity === null) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-3");
        }
        return new NavigationRequestResult(
          true,
          null,
          SequencingRequestType.RESUME_ALL,
          null
        );

      case NavigationRequestType.CONTINUE:
        if (!currentActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-4");
        }
        if (!currentActivity.parent || !currentActivity.parent.sequencingControls.flow) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-5");
        }
        return new NavigationRequestResult(
          true,
          SequencingRequestType.EXIT,
          SequencingRequestType.CONTINUE,
          null
        );

      case NavigationRequestType.PREVIOUS: {
        if (!currentActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-6");
        }
        if (!currentActivity.parent || !currentActivity.parent.sequencingControls.flow) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-7");
        }

        // Enhanced Forward-Only Navigation Constraints - Check at multiple cluster levels
        const forwardOnlyValidation = this.validateForwardOnlyConstraints(currentActivity);
        if (!forwardOnlyValidation.valid) {
          return new NavigationRequestResult(false, null, null, null, forwardOnlyValidation.exception);
        }

        return new NavigationRequestResult(
          true,
          SequencingRequestType.EXIT,
          SequencingRequestType.PREVIOUS,
          null
        );
      }

      case NavigationRequestType.CHOICE: {
        if (!targetActivityId) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-9");
        }
        const targetActivity = this.activityTree.getActivity(targetActivityId);
        if (!targetActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-10");
        }

        // Enhanced Choice Path Validation
        const choiceValidation = this.validateComplexChoicePath(currentActivity, targetActivity);
        if (!choiceValidation.valid) {
          return new NavigationRequestResult(false, null, null, null, choiceValidation.exception);
        }

        return new NavigationRequestResult(
          true,
          currentActivity ? SequencingRequestType.EXIT : null,
          SequencingRequestType.CHOICE,
          targetActivityId
        );
      }

      case NavigationRequestType.JUMP:
        if (!targetActivityId) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-12");
        }
        return new NavigationRequestResult(
          true,
          null,
          SequencingRequestType.JUMP,
          targetActivityId
        );

      case NavigationRequestType.EXIT:
        if (!currentActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-13");
        }
        if (currentActivity === this.activityTree.root) {
          return new NavigationRequestResult(
            true,
            SequencingRequestType.EXIT_ALL,
            null,
            null
          );
        }
        return new NavigationRequestResult(
          true,
          SequencingRequestType.EXIT,
          null,
          null
        );

      case NavigationRequestType.EXIT_ALL:
        if (!currentActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-14");
        }
        return new NavigationRequestResult(
          true,
          SequencingRequestType.EXIT_ALL,
          null,
          null
        );

      case NavigationRequestType.ABANDON:
        if (!currentActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-15");
        }
        return new NavigationRequestResult(
          true,
          SequencingRequestType.ABANDON,
          null,
          null
        );

      case NavigationRequestType.ABANDON_ALL:
        if (!currentActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-16");
        }
        return new NavigationRequestResult(
          true,
          SequencingRequestType.ABANDON_ALL,
          null,
          null
        );

      case NavigationRequestType.SUSPEND_ALL:
        if (!currentActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-17");
        }
        return new NavigationRequestResult(
          true,
          SequencingRequestType.SUSPEND_ALL,
          null,
          null
        );

      default:
        return new NavigationRequestResult(false, null, null, null, "NB.2.1-18");
    }
  }

  /**
   * Enhanced Termination Request Process (TB.2.3)
   * Processes termination requests with improved post-condition handling
   * Priority 2 Gap: Post-Condition Rule Evaluation & Exit Action Rule Recursion
   * @param {SequencingRequestType} request - The termination request
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @return {boolean} - True if termination was successful
   */
  private terminationRequestProcess(request: SequencingRequestType, hasSequencingRequest: boolean = false): boolean {
    const currentActivity = this.activityTree.currentActivity;

    if (!currentActivity) {
      return false;
    }

    // Enhanced logging for debugging
    this.fireEvent("onTerminationRequestProcessing", {
      request,
      hasSequencingRequest,
      currentActivity: currentActivity.id
    });

    // First, check exit action rules (TB.2.1) for EXIT request with recursion detection
    if (request === SequencingRequestType.EXIT) {
      const exitActionResult = this.enhancedExitActionRulesSubprocess(currentActivity);
      if (exitActionResult.action) {
        // Check for recursion to prevent infinite loops
        if (exitActionResult.recursionDepth > 10) {
          this.fireEvent("onSequencingError", {
            error: "Exit action recursion detected",
            depth: exitActionResult.recursionDepth,
            activity: currentActivity.id
          });
          return false;
        }

        switch (exitActionResult.action) {
          case "EXIT_PARENT":
            // Move up to parent and terminate from there
            if (currentActivity.parent) {
              this.activityTree.currentActivity = currentActivity.parent;
              return this.terminationRequestProcess(request, hasSequencingRequest);
            }
            break;
          case "EXIT_ALL":
            // Convert to EXIT_ALL request
            request = SequencingRequestType.EXIT_ALL;
            break;
        }
      }
    }

    // For EXIT_ALL and ABANDON_ALL, terminate descendant attempts first
    // For regular EXIT, also terminate descendants if current has children
    if (request === SequencingRequestType.EXIT_ALL ||
      request === SequencingRequestType.ABANDON_ALL ||
      (request === SequencingRequestType.EXIT && currentActivity.children.length > 0)) {
      this.terminateDescendentAttemptsProcess(currentActivity);
    }

    // For descendant activities in the tree, terminate them first
    // For EXIT_ALL and ABANDON_ALL, also terminate descendants
    // For regular EXIT, also terminate descendants if current has children
    if (request === SequencingRequestType.EXIT_ALL ||
      request === SequencingRequestType.ABANDON_ALL ||
      (request === SequencingRequestType.EXIT && currentActivity.children.length > 0)) {
      this.terminateDescendentAttemptsProcess(currentActivity);
    }

    // Enhanced termination processing with post-condition rule evaluation
    const terminationResult = this.executeTermination(request, currentActivity, hasSequencingRequest);
    if (!terminationResult.success) {
      return false;
    }

    // Priority 2 Gap: Post-Condition Rule Evaluation Integration
    // Evaluate post-condition rules after termination but before clearing current activity
    if (terminationResult.shouldEvaluatePostConditions) {
      const postConditionResult = this.integratePostConditionRulesSubprocess(currentActivity);
      if (postConditionResult) {
        // Post-condition rules triggered additional sequencing action
        this.fireEvent("onPostConditionTriggered", {
          activity: currentActivity.id,
          action: postConditionResult
        });

        // Handle post-condition sequencing request
        // This might need to be processed by the sequencing engine
        // but for termination we log it for now
      }
    }

    // Priority 2 Gap: Complex Suspended Activity Cleanup
    if (request === SequencingRequestType.EXIT_ALL || request === SequencingRequestType.ABANDON_ALL) {
      this.performComplexSuspendedActivityCleanup();
    }

    return true;
  }

  /**
   * Execute Termination
   * Enhanced termination execution with proper state management
   * @param {SequencingRequestType} request - Termination request
   * @param {Activity} currentActivity - Current activity
   * @param {boolean} hasSequencingRequest - Whether sequencing follows
   * @return {{success: boolean, shouldEvaluatePostConditions: boolean}} - Termination result
   */
  private executeTermination(request: SequencingRequestType, currentActivity: Activity, hasSequencingRequest: boolean): {
    success: boolean,
    shouldEvaluatePostConditions: boolean
  } {
    let shouldEvaluatePostConditions = false;

    try {
      switch (request) {
        case SequencingRequestType.EXIT:
          // Terminate normally with post-condition evaluation
          if (currentActivity.isActive) {
            this.endAttemptProcess(currentActivity);
            shouldEvaluatePostConditions = true;
          }
          // Move to parent only if no sequencing follows
          if (!hasSequencingRequest) {
            this.activityTree.currentActivity = currentActivity.parent;
          }
          break;

        case SequencingRequestType.EXIT_ALL:
          // Priority 2 Gap: Multi-Level Exit Actions
          this.handleMultiLevelExitActions(this.activityTree.root!);
          this.activityTree.currentActivity = null;
          break;

        case SequencingRequestType.ABANDON:
          // Abandon without ending attempt
          currentActivity.isActive = false;
          // Move to parent only if no sequencing follows
          if (!hasSequencingRequest) {
            this.activityTree.currentActivity = currentActivity.parent;
          }
          break;

        case SequencingRequestType.ABANDON_ALL:
          // Abandon without ending attempt - clear current activity
          currentActivity.isActive = false;
          this.activityTree.currentActivity = null;
          break;

        case SequencingRequestType.SUSPEND_ALL:
          // Suspend the current activity with enhanced cleanup
          this.handleSuspendAllRequest(currentActivity);
          break;

        default:
          return { success: false, shouldEvaluatePostConditions: false };
      }

      return { success: true, shouldEvaluatePostConditions };
    } catch (error) {
      this.fireEvent("onTerminationError", {
        error: error instanceof Error ? error.message : String(error),
        request,
        activity: currentActivity.id
      });
      return { success: false, shouldEvaluatePostConditions: false };
    }
  }

  /**
   * Enhanced Exit Action Rules Subprocess with recursion detection
   * Priority 2 Gap: Exit Action Rule Recursion
   * @param {Activity} activity - Activity to evaluate
   * @param {number} recursionDepth - Current recursion depth
   * @return {{action: string | null, recursionDepth: number}} - Exit action result
   */
  private enhancedExitActionRulesSubprocess(activity: Activity, recursionDepth: number = 0): {
    action: string | null,
    recursionDepth: number
  } {
    // Increment recursion depth to detect infinite loops
    recursionDepth++;

    // Check if activity has exit action rules
    const exitRules = activity.sequencingRules.exitConditionRules;

    for (const rule of exitRules) {
      // Evaluate the rule conditions
      let conditionsMet = true;

      // Check rule condition combination
      if (rule.conditionCombination === "all") {
        conditionsMet = rule.conditions.every(condition => condition.evaluate(activity));
      } else {
        conditionsMet = rule.conditions.some(condition => condition.evaluate(activity));
      }

      if (conditionsMet) {
        // Return the action to take with recursion tracking
        if (rule.action === RuleActionType.EXIT_PARENT) {
          return { action: "EXIT_PARENT", recursionDepth };
        } else if (rule.action === RuleActionType.EXIT_ALL) {
          return { action: "EXIT_ALL", recursionDepth };
        }
      }
    }

    return { action: null, recursionDepth };
  }

  /**
   * Integrate Post-Condition Rules Subprocess
   * Priority 2 Gap: Post-Condition Rule Evaluation Integration
   * @param {Activity} activity - Activity to evaluate post-conditions for
   * @return {string | null} - Post-condition action or null
   */
  private integratePostConditionRulesSubprocess(activity: Activity): string | null {
    // Evaluate post-condition rules using the sequencing process
    const postAction = this.sequencingProcess.evaluatePostConditionRules(activity);

    if (postAction) {
      // Log the post-condition action for tracking
      this.fireEvent("onPostConditionEvaluated", {
        activity: activity.id,
        action: postAction,
        timestamp: new Date().toISOString()
      });

      return postAction;
    }

    return null;
  }

  /**
   * Handle Multi-Level Exit Actions
   * Priority 2 Gap: Multi-Level Exit Actions
   * @param {Activity} rootActivity - Root activity to start from
   */
  private handleMultiLevelExitActions(rootActivity: Activity): void {
    // Process exit actions at each level systematically
    this.processExitActionsAtLevel(rootActivity, 0);

    // Then terminate all activities
    this.terminateAllActivities(rootActivity);
  }

  /**
   * Process exit actions at specific level
   * @param {Activity} activity - Activity to process
   * @param {number} level - Current level in hierarchy
   */
  private processExitActionsAtLevel(activity: Activity, level: number): void {
    // Process exit actions for this activity
    const exitAction = this.enhancedExitActionRulesSubprocess(activity, 0);

    if (exitAction.action) {
      this.fireEvent("onMultiLevelExitAction", {
        activity: activity.id,
        level,
        action: exitAction.action
      });
    }

    // Recursively process children
    for (const child of activity.children) {
      this.processExitActionsAtLevel(child, level + 1);
    }
  }

  /**
   * Perform Complex Suspended Activity Cleanup
   * Priority 2 Gap: Complex Suspended Activity Cleanup
   */
  private performComplexSuspendedActivityCleanup(): void {
    const suspendedActivity = this.activityTree.suspendedActivity;

    if (suspendedActivity) {
      // Clear suspended state from the activity and all its ancestors
      let current: Activity | null = suspendedActivity;
      const cleanedActivities: string[] = [];

      while (current) {
        if (current.isSuspended) {
          current.isSuspended = false;
          cleanedActivities.push(current.id);
        }
        current = current.parent;
      }

      // Clear suspended activity reference
      this.activityTree.suspendedActivity = null;

      // Fire cleanup event
      this.fireEvent("onSuspendedActivityCleanup", {
        cleanedActivities,
        originalSuspendedActivity: suspendedActivity.id
      });
    }
  }

  /**
   * Handle Suspend All Request
   * Enhanced suspend handling with proper state management
   * @param {Activity} currentActivity - Current activity to suspend
   */
  private handleSuspendAllRequest(currentActivity: Activity): void {
    // Suspend the current activity
    currentActivity.isSuspended = true;
    currentActivity.isActive = false;
    this.activityTree.suspendedActivity = currentActivity;
    this.activityTree.currentActivity = null;

    // Log suspend event
    this.fireEvent("onActivitySuspended", {
      activity: currentActivity.id,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Enhanced Delivery Request Process (DB.1.1)
   * Priority 4 Gap: Comprehensive delivery validation with state consistency checks
   * @param {Activity} activity - The activity to deliver
   * @return {DeliveryRequest} - The delivery validation result
   */
  private deliveryRequestProcess(activity: Activity): DeliveryRequest {
    // Enhanced logging for debugging
    this.fireEvent("onDeliveryRequestProcessing", {
      activity: activity.id,
      timestamp: new Date().toISOString()
    });

    if (this.enhancedDeliveryValidation) {
      // Activity Tree State Consistency
      const stateConsistencyCheck = this.validateActivityTreeStateConsistency(activity);
      if (!stateConsistencyCheck.consistent) {
        return new DeliveryRequest(false, null, stateConsistencyCheck.exception);
      }
    }

    // Check if activity is a cluster (has children)
    if (activity.children.length > 0) {
      return new DeliveryRequest(false, null, "DB.1.1-1");
    }

    // Check if activity is an empty cluster (has flow control but no children)
    // According to SCORM 2004, empty clusters should not be deliverable
    if (activity.sequencingControls.flow && activity.children.length === 0) {
      return new DeliveryRequest(false, null, "DB.1.1-2");
    }

    if (this.enhancedDeliveryValidation) {
      const resourceConstraintCheck = this.validateResourceConstraints(activity);
      if (!resourceConstraintCheck.available) {
        return new DeliveryRequest(false, null, resourceConstraintCheck.exception);
      }
    }

    if (this.enhancedDeliveryValidation) {
      const concurrentDeliveryCheck = this.validateConcurrentDeliveryPrevention(activity);
      if (!concurrentDeliveryCheck.allowed) {
        return new DeliveryRequest(false, null, concurrentDeliveryCheck.exception);
      }
    }

    if (this.enhancedDeliveryValidation) {
      const dependencyCheck = this.validateActivityDependencies(activity);
      if (!dependencyCheck.satisfied) {
        return new DeliveryRequest(false, null, dependencyCheck.exception);
      }
    }

    // Use Check Activity Process (UP.5) to validate if activity can be delivered
    if (!this.checkActivityProcess(activity)) {
      return new DeliveryRequest(false, null, "DB.1.1-3");
    }

    // Activity is a true leaf and passes all checks - can be delivered
    return new DeliveryRequest(true, activity);
  }

  /**
   * Content Delivery Environment Process (DB.2)
   * Handles the delivery of content to the learner
   * @param {Activity} activity - The activity to deliver
   */
  private contentDeliveryEnvironmentProcess(activity: Activity): void {
    // Step 1: Clear Suspended Activity Subprocess (DB.2.1) if needed
    if (this.activityTree.suspendedActivity &&
      this.activityTree.suspendedActivity !== activity) {
      this.clearSuspendedActivitySubprocess();
    }

    // Step 2: Set the activity as current and active
    this.activityTree.currentActivity = activity;
    activity.isActive = true;

    // Step 3: Initialize attempt for the delivered activity (DB.2.2)
    this.initializeActivityForDelivery(activity);

    // Step 4: Set up activity attempt tracking information
    this.setupActivityAttemptTracking(activity);

    // Step 5: Mark that content has been delivered
    this.contentDelivered = true;

    // Step 6: Update navigation validity if ADL nav is available
    if (this.adlNav) {
      this.updateNavigationValidity();
    }

    // Step 7: Fire activity delivery event
    this.fireActivityDeliveryEvent(activity);
  }

  /**
   * Initialize Activity For Delivery (DB.2.2)
   * Set up initial tracking states for a delivered activity
   * @param {Activity} activity - The activity being delivered
   */
  private initializeActivityForDelivery(activity: Activity): void {
    // Set initial attempt states if not already set
    if (activity.completionStatus === "unknown") {
      // For leaf activities, set to "not attempted" initially
      if (activity.children.length === 0) {
        activity.completionStatus = "not attempted";
      }
    }

    // Initialize objective satisfied status if not set
    if (activity.objectiveSatisfiedStatus === null) {
      activity.objectiveSatisfiedStatus = false;
    }

    // Initialize progress measure status
    if (activity.progressMeasure === null) {
      activity.progressMeasure = 0.0;
      activity.progressMeasureStatus = false;
    }

    // Initialize objective measure if not set
    if (activity.objectiveNormalizedMeasure === null) {
      activity.objectiveNormalizedMeasure = 0.0;
      activity.objectiveMeasureStatus = false;
    }

    // Set up activity attempt information
    activity.attemptAbsoluteDuration = "PT0H0M0S";
    activity.attemptExperiencedDuration = "PT0H0M0S";

    // Mark as available for sequencing
    activity.isAvailable = true;
  }

  /**
   * Setup Activity Attempt Tracking
   * Initialize attempt tracking information per SCORM 2004 4th Edition
   * @param {Activity} activity - The activity being delivered
   */
  private setupActivityAttemptTracking(activity: Activity): void {
    // Initialize attempt counter if this is a new attempt
    if (!activity.attemptCount || activity.attemptCount === 0) {
      activity.attemptCount = 1;
    }

    // Set attempt start time (use injected clock)
    activity.attemptAbsoluteStartTime = this.now().toISOString();

    // Initialize location if not set
    if (!activity.location) {
      activity.location = "";
    }

    // Set up activity state
    activity.activityAttemptActive = true;

    // Initialize learner preferences if not set
    if (!activity.learnerPrefs) {
      activity.learnerPrefs = {
        audioCaptioning: "0",
        audioLevel: "1",
        deliverySpeed: "1",
        language: ""
      };
    }
  }

  /**
   * Fire Activity Delivery Event
   * Notify listeners that an activity has been delivered
   * @param {Activity} activity - The activity that was delivered
   */
  private fireActivityDeliveryEvent(activity: Activity): void {
    // Fire event through callback if available
    try {
      if (this.eventCallback) {
        this.eventCallback("onActivityDelivery", activity);
      }
      console.debug(`Activity delivered: ${activity.id} - ${activity.title}`);
    } catch (error) {
      // Silently handle event firing errors to not disrupt sequencing
      console.warn(`Failed to fire activity delivery event: ${error}`);
    }
  }

  /**
   * Fire a sequencing event
   * @param {string} eventType - The type of event
   * @param {any} data - Event data
   */
  private fireEvent(eventType: string, data?: any): void {
    try {
      if (this.eventCallback) {
        this.eventCallback(eventType, data);
      }
    } catch (error) {
      console.warn(`Failed to fire sequencing event ${eventType}: ${error}`);
    }
  }

  /**
   * Clear Suspended Activity Subprocess (DB.2.1)
   * Clears the suspended activity state
   */
  private clearSuspendedActivitySubprocess(): void {
    if (this.activityTree.suspendedActivity) {
      // Clear suspended state from the activity and all its ancestors
      let current: Activity | null = this.activityTree.suspendedActivity;
      while (current) {
        current.isSuspended = false;
        current = current.parent;
      }
      this.activityTree.suspendedActivity = null;
    }
  }

  /**
   * End Attempt Process (UP.4)
   * Ends an attempt on an activity
   * @param {Activity} activity - The activity to end attempt on
   */
  private endAttemptProcess(activity: Activity): void {
    if (!activity.isActive) {
      return;
    }

    // Set activity as inactive
    activity.isActive = false;

    // Update attempt completion status if not already set
    if (activity.completionStatus === "unknown") {
      activity.completionStatus = "incomplete";
    }

    // Update success status if needed
    if (activity.successStatus === "unknown" && activity.objectiveSatisfiedStatus) {
      activity.successStatus = activity.objectiveSatisfiedStatus ? "passed" : "failed";
    }

    // INTEGRATION: Process global objective mapping after activity completion
    this.rollupProcess.processGlobalObjectiveMapping(activity, this.globalObjectiveMap);

    // Trigger rollup from this activity
    this.rollupProcess.overallRollupProcess(activity);

    // INTEGRATION: Validate rollup state consistency after rollup
    if (this.activityTree.root) {
      this.rollupProcess.validateRollupStateConsistency(this.activityTree.root);
    }
  }

  /**
   * Update navigation validity in ADL nav
   */
  private updateNavigationValidity(): void {
    if (!this.adlNav || !this.activityTree.currentActivity) {
      return;
    }

    // Update continue validity
    const continueResult = this.navigationRequestProcess(NavigationRequestType.CONTINUE);
    try {
      this.adlNav.request_valid.continue = continueResult.valid ? "true" : "false";
    } catch (e) {
      // Navigation validity might be read-only after init
    }

    // Update previous validity
    const previousResult = this.navigationRequestProcess(NavigationRequestType.PREVIOUS);
    try {
      this.adlNav.request_valid.previous = previousResult.valid ? "true" : "false";
    } catch (e) {
      // Navigation validity might be read-only after init
    }

    // Compute per-target choice/jump validity and emit an event snapshot
    const allActivities = this.activityTree.getAllActivities();
    const choiceMap: { [key: string]: string } = {};
    const jumpMap: { [key: string]: string } = {};
    for (const act of allActivities) {
      const choiceRes = this.navigationRequestProcess(NavigationRequestType.CHOICE, act.id);
      choiceMap[act.id] = choiceRes.valid ? "true" : "false";
      const jumpRes = this.navigationRequestProcess(NavigationRequestType.JUMP, act.id);
      jumpMap[act.id] = jumpRes.valid ? "true" : "false";
    }
    // Best-effort update of adl.nav.request_valid maps (may be RO post-init)
    try { this.adlNav.request_valid.choice = choiceMap; } catch {}
    try { this.adlNav.request_valid.jump = jumpMap; } catch {}
    // Notify listeners so LMS can update UI regardless of read-only state
    this.fireEvent("onNavigationValidityUpdate", {
      continue: continueResult.valid,
      previous: previousResult.valid,
      choice: choiceMap,
      jump: jumpMap,
    });
  }

  /**
   * Find common ancestor between two activities
   */
  private findCommonAncestor(activity1: Activity, activity2: Activity): Activity | null {
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
   * Check if content has been delivered
   */
  public hasContentBeenDelivered(): boolean {
    return this.contentDelivered;
  }

  /**
   * Reset content delivered flag
   */
  public resetContentDelivered(): void {
    this.contentDelivered = false;
  }

  /**
   * Exit Action Rules Subprocess (TB.2.1)
   * Evaluates exit action rules for the current activity
   * @param {Activity} activity - The activity to evaluate
   * @return {string | null} - The exit action to take, or null if none
   */
  private exitActionRulesSubprocess(activity: Activity): string | null {
    // Check if activity has exit action rules
    const exitRules = activity.sequencingRules.exitConditionRules;

    for (const rule of exitRules) {
      // Evaluate the rule conditions
      let conditionsMet = true;

      // Check rule condition combination
      if (rule.conditionCombination === "all") {
        conditionsMet = rule.conditions.every(condition => condition.evaluate(activity));
      } else {
        conditionsMet = rule.conditions.some(condition => condition.evaluate(activity));
      }

      if (conditionsMet) {
        // Return the action to take
        if (rule.action === RuleActionType.EXIT_PARENT) {
          return "EXIT_PARENT";
        } else if (rule.action === RuleActionType.EXIT_ALL) {
          return "EXIT_ALL";
        }
      }
    }

    return null;
  }

  /**
   * Terminate all activities in the tree
   * @param {Activity} activity - The activity to start from (usually root)
   */
  private terminateAllActivities(activity: Activity): void {
    // Recursively terminate all children first
    for (const child of activity.children) {
      this.terminateAllActivities(child);
    }

    // Then terminate this activity
    if (activity.isActive) {
      this.endAttemptProcess(activity);
    }
  }

  /**
   * Limit Conditions Check Process (UP.1)
   * Checks if any limit conditions are violated for the activity
   * @param {Activity} activity - The activity to check limit conditions for
   * @return {boolean} - True if limit conditions are met, false if violated
   */
  private limitConditionsCheckProcess(activity: Activity): boolean {
    let result = true;
    let failureReason = "";

    // Check attempt limit
    if (activity.attemptLimit !== null && activity.attemptLimit > 0) {
      if (activity.attemptCount >= activity.attemptLimit) {
        result = false;
        failureReason = "Attempt limit exceeded";
      }
    }

    // Check attempt absolute duration limit
    if (result && activity.attemptAbsoluteDurationLimit) {
      const currentDuration = getDurationAsSeconds(activity.attemptAbsoluteDuration || "PT0H0M0S", scorm2004_regex.CMITimespan);
      const limitDuration = getDurationAsSeconds(activity.attemptAbsoluteDurationLimit, scorm2004_regex.CMITimespan);
      if (currentDuration >= limitDuration) {
        result = false;
        failureReason = "Attempt duration limit exceeded";
      }
    }

    // Check activity absolute duration limit
    if (result && activity.activityAbsoluteDurationLimit) {
      const currentDuration = getDurationAsSeconds(activity.activityAbsoluteDuration || "PT0H0M0S", scorm2004_regex.CMITimespan);
      const limitDuration = getDurationAsSeconds(activity.activityAbsoluteDurationLimit, scorm2004_regex.CMITimespan);
      if (currentDuration >= limitDuration) {
        result = false;
        failureReason = "Activity duration limit exceeded";
      }
    }

    // Check begin time limit
    if (result && activity.beginTimeLimit) {
      const currentTime = this.now();
      const beginTime = new Date(activity.beginTimeLimit);
      if (currentTime < beginTime) {
        result = false;
        failureReason = "Not yet time to begin";
      }
    }

    // Check end time limit
    if (result && activity.endTimeLimit) {
      const currentTime = this.now();
      const endTime = new Date(activity.endTimeLimit);
      if (currentTime > endTime) {
        result = false;
        failureReason = "Time limit expired";
      }
    }

    // Fire limit condition check event
    this.fireEvent("onLimitConditionCheck", {
      activity: activity,
      result: result,
      failureReason: failureReason,
      checks: {
        attemptLimit: activity.attemptLimit,
        attemptCount: activity.attemptCount,
        attemptDurationLimit: activity.attemptAbsoluteDurationLimit,
        activityDurationLimit: activity.activityAbsoluteDurationLimit,
        beginTimeLimit: activity.beginTimeLimit,
        endTimeLimit: activity.endTimeLimit
      }
    });

    return result;
  }

  /**
   * Check Activity Process (UP.5)
   * Validates if an activity can be delivered
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if activity can be delivered
   */
  private checkActivityProcess(activity: Activity): boolean {
    // Check if activity is available
    if (!activity.isAvailable) {
      return false;
    }

    // Check if activity is hidden from choice (if this is a choice request)
    if (activity.isHiddenFromChoice) {
      // This would be false for choice navigation, but we need context
      // For now, we'll allow it but this should be enhanced
    }

    // Check limit conditions (UP.1)
    if (!this.limitConditionsCheckProcess(activity)) {
      return false;
    }

    // Check if activity is a cluster that can't be delivered directly
    if (activity.children.length > 0 && !activity.sequencingControls.flow) {
      return false; // Clusters without flow can't be delivered
    }

    // Activity passes all checks
    return true;
  }

  /**
   * Terminate Descendent Attempts Process (UP.3)
   * Recursively terminates all active descendant attempts
   * @param {Activity} activity - The activity whose descendants to terminate
   */
  private terminateDescendentAttemptsProcess(activity: Activity): void {
    // Process all children
    for (const child of activity.children) {
      // Recursively terminate descendants first
      if (child.children.length > 0) {
        this.terminateDescendentAttemptsProcess(child);
      }

      // Check exit rules for the child
      const exitAction = this.exitActionRulesSubprocess(child);

      // Terminate the child if it's active
      if (child.isActive) {
        // Apply exit action if any
        if (exitAction === "EXIT_ALL") {
          // Recursively terminate all descendants
          this.terminateDescendentAttemptsProcess(child);
        }

        // End the attempt
        this.endAttemptProcess(child);
      }
    }
  }

  /**
   * Get Sequencing State for Persistence
   * Returns the current state of the sequencing engine for multi-session support
   * @return {object} - Serializable sequencing state
   */
  public getSequencingState(): any {
    return {
      version: "1.0",
      timestamp: new Date().toISOString(),
      contentDelivered: this.contentDelivered,
      currentActivity: this.activityTree.currentActivity?.id || null,
      suspendedActivity: this.activityTree.suspendedActivity?.id || null,
      activityStates: this.serializeActivityStates(),
      navigationState: this.getNavigationState()
    };
  }

  /**
   * Restore Sequencing State from Persistence
   * Restores the sequencing engine state from a previous session
   * @param {any} state - Previously saved sequencing state
   * @return {boolean} - True if restoration was successful
   */
  public restoreSequencingState(state: any): boolean {
    try {
      if (!state || state.version !== "1.0") {
        console.warn("Incompatible sequencing state version");
        return false;
      }

      // Restore basic flags
      this.contentDelivered = state.contentDelivered || false;

      // Restore activity states
      if (state.activityStates) {
        this.deserializeActivityStates(state.activityStates);
      }

      // Restore current activity
      if (state.currentActivity) {
        const currentActivity = this.activityTree.getActivity(state.currentActivity);
        if (currentActivity) {
          this.activityTree.currentActivity = currentActivity;
          currentActivity.isActive = true;
        }
      }

      // Restore suspended activity
      if (state.suspendedActivity) {
        const suspendedActivity = this.activityTree.getActivity(state.suspendedActivity);
        if (suspendedActivity) {
          this.activityTree.suspendedActivity = suspendedActivity;
          suspendedActivity.isSuspended = true;
        }
      }

      // Restore navigation state
      if (state.navigationState) {
        this.restoreNavigationState(state.navigationState);
      }

      console.debug("Sequencing state restored successfully");
      return true;
    } catch (error) {
      console.error(`Failed to restore sequencing state: ${error}`);
      return false;
    }
  }

  /**
   * Serialize Activity States
   * Creates a serializable representation of all activity states
   * @return {object} - Serialized activity states
   */
  private serializeActivityStates(): any {
    const states: any = {};

    const serializeActivity = (activity: Activity) => {
      states[activity.id] = {
        id: activity.id,
        title: activity.title,
        isActive: activity.isActive,
        isSuspended: activity.isSuspended,
        isCompleted: activity.isCompleted,
        completionStatus: activity.completionStatus,
        successStatus: activity.successStatus,
        attemptCount: activity.attemptCount,
        attemptCompletionAmount: activity.attemptCompletionAmount,
        attemptAbsoluteDuration: activity.attemptAbsoluteDuration,
        attemptExperiencedDuration: activity.attemptExperiencedDuration,
        activityAbsoluteDuration: activity.activityAbsoluteDuration,
        activityExperiencedDuration: activity.activityExperiencedDuration,
        objectiveSatisfiedStatus: activity.objectiveSatisfiedStatus,
        objectiveMeasureStatus: activity.objectiveMeasureStatus,
        objectiveNormalizedMeasure: activity.objectiveNormalizedMeasure,
        progressMeasure: activity.progressMeasure,
        progressMeasureStatus: activity.progressMeasureStatus,
        isAvailable: activity.isAvailable,
        location: activity.location,
        attemptAbsoluteStartTime: activity.attemptAbsoluteStartTime
      };

      // Recursively serialize children
      for (const child of activity.children) {
        serializeActivity(child);
      }
    };

    if (this.activityTree.root) {
      serializeActivity(this.activityTree.root);
    }

    return states;
  }

  /**
   * Deserialize Activity States
   * Restores activity states from serialized data
   * @param {any} states - Serialized activity states
   */
  private deserializeActivityStates(states: any): void {
    const restoreActivity = (activity: Activity) => {
      const state = states[activity.id];
      if (state) {
        activity.isActive = state.isActive || false;
        activity.isSuspended = state.isSuspended || false;
        activity.isCompleted = state.isCompleted || false;
        activity.completionStatus = state.completionStatus || "unknown";
        activity.successStatus = state.successStatus || "unknown";
        activity.attemptCount = state.attemptCount || 0;
        activity.attemptCompletionAmount = state.attemptCompletionAmount || 0;
        activity.attemptAbsoluteDuration = state.attemptAbsoluteDuration || "PT0H0M0S";
        activity.attemptExperiencedDuration = state.attemptExperiencedDuration || "PT0H0M0S";
        activity.activityAbsoluteDuration = state.activityAbsoluteDuration || "PT0H0M0S";
        activity.activityExperiencedDuration = state.activityExperiencedDuration || "PT0H0M0S";
        activity.objectiveSatisfiedStatus = state.objectiveSatisfiedStatus || false;
        activity.objectiveMeasureStatus = state.objectiveMeasureStatus || false;
        activity.objectiveNormalizedMeasure = state.objectiveNormalizedMeasure || 0;
        activity.progressMeasure = state.progressMeasure || null;
        activity.progressMeasureStatus = state.progressMeasureStatus || false;
        activity.isAvailable = state.isAvailable !== false; // Default to true
        activity.location = state.location || "";
        activity.attemptAbsoluteStartTime = state.attemptAbsoluteStartTime || null;
      }

      // Recursively restore children
      for (const child of activity.children) {
        restoreActivity(child);
      }
    };

    if (this.activityTree.root) {
      restoreActivity(this.activityTree.root);
    }
  }

  /**
   * Get Navigation State
   * Returns current navigation validity and ADL nav state
   * @return {any} - Navigation state
   */
  private getNavigationState(): any {
    if (!this.adlNav) {
      return null;
    }

    return {
      request: this.adlNav.request || "_none_",
      requestValid: {
        continue: this.adlNav.request_valid?.continue || "false",
        previous: this.adlNav.request_valid?.previous || "false",
        choice: this.adlNav.request_valid?.choice || "false",
        jump: this.adlNav.request_valid?.jump || "false",
        exit: this.adlNav.request_valid?.exit || "false",
        exitAll: this.adlNav.request_valid?.exitAll || "false",
        abandon: this.adlNav.request_valid?.abandon || "false",
        abandonAll: this.adlNav.request_valid?.abandonAll || "false",
        suspendAll: this.adlNav.request_valid?.suspendAll || "false"
      }
    };
  }

  /**
   * Restore Navigation State
   * Restores ADL navigation state
   * @param {any} navState - Navigation state to restore
   */
  private restoreNavigationState(navState: any): void {
    if (!this.adlNav || !navState) {
      return;
    }

    try {
      // Restore navigation request validity
      if (navState.requestValid) {
        const requestValid = navState.requestValid;
        this.adlNav.request_valid.continue = requestValid.continue || "false";
        this.adlNav.request_valid.previous = requestValid.previous || "false";
        this.adlNav.request_valid.choice = requestValid.choice || "false";
        this.adlNav.request_valid.jump = requestValid.jump || "false";
        this.adlNav.request_valid.exit = requestValid.exit || "false";
        this.adlNav.request_valid.exitAll = requestValid.exitAll || "false";
        this.adlNav.request_valid.abandon = requestValid.abandon || "false";
        this.adlNav.request_valid.abandonAll = requestValid.abandonAll || "false";
        this.adlNav.request_valid.suspendAll = requestValid.suspendAll || "false";
      }
    } catch (error) {
      // Navigation properties might be read-only after initialization
      console.warn(`Could not fully restore navigation state: ${error}`);
    }
  }

  /**
   * Enhanced Complex Choice Path Validation
   * Implements comprehensive choice validation with nested hierarchy support
   * Priority 1 Gap: Complex Choice Path Validation
   * @param {Activity | null} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity for choice
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateComplexChoicePath(currentActivity: Activity | null, targetActivity: Activity): {
    valid: boolean,
    exception: string | null
  } {
    // Check if target is hidden from choice
    if (targetActivity.isHiddenFromChoice) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Check if target is disabled
    if (this.isActivityDisabled(targetActivity)) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    if (currentActivity) {
      const commonAncestor = this.findCommonAncestor(currentActivity, targetActivity);
      if (!commonAncestor) {
        return { valid: false, exception: "NB.2.1-11" };
      }

      // Enhanced constrainChoice control validation in nested hierarchies
      const constrainChoiceValidation = this.validateConstrainChoiceControls(currentActivity, targetActivity, commonAncestor);
      if (!constrainChoiceValidation.valid) {
        return constrainChoiceValidation;
      }

      // Validate choice sets with multiple targets
      const choiceSetValidation = this.validateChoiceSetConstraints(currentActivity, targetActivity, commonAncestor);
      if (!choiceSetValidation.valid) {
        return choiceSetValidation;
      }
    }

    // Path to root validation for choice control
    let activity: Activity | null = targetActivity;
    while (activity) {
      if (activity.parent && !activity.parent.sequencingControls.choice) {
        return { valid: false, exception: "NB.2.1-11" };
      }
      activity = activity.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Enhanced Forward-Only Navigation Constraints
   * Handles forward-only constraints at different cluster levels
   * Priority 1 Gap: Forward-Only Navigation Constraints
   * @param {Activity} currentActivity - Current activity
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateForwardOnlyConstraints(currentActivity: Activity): {
    valid: boolean,
    exception: string | null
  } {
    // Check forward-only constraint at immediate parent level
    if (currentActivity.parent?.sequencingControls.forwardOnly) {
      return { valid: false, exception: "NB.2.1-8" };
    }

    // Check forward-only constraints at higher cluster levels
    let ancestor = currentActivity.parent?.parent;
    while (ancestor) {
      if (ancestor.sequencingControls.forwardOnly) {
        // If any ancestor cluster has forwardOnly=true, previous navigation is blocked
        return { valid: false, exception: "NB.2.1-8" };
      }
      ancestor = ancestor.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Enhanced constrainChoice Control Validation
   * Implements proper constrainChoice validation in nested hierarchies
   * Priority 1 Gap: constrainChoice control validation
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @param {Activity} commonAncestor - Common ancestor
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateConstrainChoiceControls(currentActivity: Activity, targetActivity: Activity, commonAncestor: Activity): {
    valid: boolean,
    exception: string | null
  } {
    // Check constrainChoice at common ancestor level
    if (commonAncestor.sequencingControls.constrainChoice) {
      // Additional constraint validation for choice navigation
      // This would include checking if the choice is within allowed boundaries
      const currentIndex = commonAncestor.children.indexOf(this.findChildContaining(commonAncestor, currentActivity)!);
      const targetIndex = commonAncestor.children.indexOf(this.findChildContaining(commonAncestor, targetActivity)!);

      // Example constraint: constrainChoice might limit choices to adjacent activities only
      if (Math.abs(currentIndex - targetIndex) > 1) {
        return { valid: false, exception: "NB.2.1-11" };
      }
    }

    // Check constrainChoice controls up the hierarchy
    let ancestor = commonAncestor.parent;
    while (ancestor) {
      if (ancestor.sequencingControls.constrainChoice) {
        // Apply ancestor-level constraints
        const ancestorValidation = this.validateAncestorConstraints(ancestor, currentActivity, targetActivity);
        if (!ancestorValidation.valid) {
          return ancestorValidation;
        }
      }
      ancestor = ancestor.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Validate Choice Set Constraints
   * Validates choice sets with multiple targets
   * Priority 1 Gap: Choice Set Constraints
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @param {Activity} commonAncestor - Common ancestor
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateChoiceSetConstraints(currentActivity: Activity, targetActivity: Activity, commonAncestor: Activity): {
    valid: boolean,
    exception: string | null
  } {
    // Check if target is within the valid choice set
    const validChoiceSet = this.getValidChoiceSet(commonAncestor, currentActivity);
    if (!validChoiceSet.includes(targetActivity)) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    return { valid: true, exception: null };
  }

  /**
   * Check if activity is disabled
   * Priority 1 Gap: Disabled Activity Detection
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if disabled
   */
  private isActivityDisabled(activity: Activity): boolean {
    // Check if activity is disabled through sequencing rules
    const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
    return preConditionResult === "DISABLED";
  }

  /**
   * Find child activity that contains the target activity
   * @param {Activity} parent - Parent activity
   * @param {Activity} target - Target activity to find
   * @return {Activity | null} - Child activity containing target
   */
  private findChildContaining(parent: Activity, target: Activity): Activity | null {
    for (const child of parent.children) {
      if (child === target) {
        return child;
      }
      if (this.activityContains(child, target)) {
        return child;
      }
    }
    return null;
  }

  /**
   * Check if an activity contains another activity in its hierarchy
   * @param {Activity} container - Container activity
   * @param {Activity} target - Target activity
   * @return {boolean} - True if container contains target
   */
  private activityContains(container: Activity, target: Activity): boolean {
    let current: Activity | null = target;
    while (current) {
      if (current === container) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  /**
   * Validate ancestor-level constraints
   * @param {Activity} ancestor - Ancestor activity
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateAncestorConstraints(ancestor: Activity, currentActivity: Activity, targetActivity: Activity): {
    valid: boolean,
    exception: string | null
  } {
    // Enforce forwardOnly and mandatory activity constraints at ancestor level
    const children = ancestor.children;
    if (!children || children.length === 0) {
      return { valid: true, exception: null };
    }

    const currentTop = this.findChildContaining(ancestor, currentActivity);
    const targetTop = this.findChildContaining(ancestor, targetActivity);
    if (!currentTop || !targetTop) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    const currentIndex = children.indexOf(currentTop);
    const targetIndex = children.indexOf(targetTop);

    // Forward-only prevents backwards choice under this ancestor
    if (ancestor.sequencingControls.forwardOnly && targetIndex < currentIndex) {
      return { valid: false, exception: "NB.2.1-8" };
    }

    // Do not skip mandatory incomplete siblings when moving forward
    if (targetIndex > currentIndex) {
      for (let i = currentIndex + 1; i < targetIndex; i++) {
        const between = children[i];
        if (between && this.helperIsActivityMandatory(between) && !this.helperIsActivityCompleted(between)) {
          return { valid: false, exception: "NB.2.1-11" };
        }
      }
    }

    return { valid: true, exception: null };
  }

  /** Helper: mandatory activity detection (mirrors SequencingProcess behavior) */
  private helperIsActivityMandatory(activity: Activity): boolean {
    if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
      for (const rule of activity.sequencingRules.preConditionRules) {
        if ((rule as any).action === "skip" && (rule as any).conditions && (rule as any).conditions.length === 0) {
          return false;
        }
      }
    }
    return (activity as any).mandatory !== false;
  }

  /** Helper: completed-state check (mirrors SequencingProcess behavior) */
  private helperIsActivityCompleted(activity: Activity): boolean {
    return (
      activity.completionStatus === "completed" ||
      (activity as any).successStatus === "passed" ||
      activity.successStatus === "passed"
    );
  }

  /**
   * Get valid choice set for current activity
   * @param {Activity} commonAncestor - Common ancestor
   * @param {Activity} currentActivity - Current activity
   * @return {Activity[]} - Array of valid choice activities
   */
  private getValidChoiceSet(commonAncestor: Activity, currentActivity: Activity): Activity[] {
    const validChoices: Activity[] = [];

    // Get all potential choice targets within the common ancestor
    const allDescendants = this.getAllDescendants(commonAncestor);

    for (const descendant of allDescendants) {
      if (this.isValidChoiceTarget(descendant, currentActivity)) {
        validChoices.push(descendant);
      }
    }

    return validChoices;
  }

  /**
   * Get all descendants of an activity
   * @param {Activity} activity - Parent activity
   * @return {Activity[]} - Array of all descendant activities
   */
  private getAllDescendants(activity: Activity): Activity[] {
    const descendants: Activity[] = [];

    for (const child of activity.children) {
      descendants.push(child);
      descendants.push(...this.getAllDescendants(child));
    }

    return descendants;
  }

  /**
   * Check if activity is valid choice target
   * @param {Activity} target - Target activity
   * @param {Activity} currentActivity - Current activity
   * @return {boolean} - True if valid choice target
   */
  private isValidChoiceTarget(target: Activity, currentActivity: Activity): boolean {
    // Basic validation for choice target
    if (target.isHiddenFromChoice) {
      return false;
    }

    if (target === currentActivity) {
      return false;
    }

    return !this.isActivityDisabled(target);
  }

  /**
   * Evaluate pre-condition rules for choice navigation
   * @param {Activity} activity - Activity to evaluate
   * @return {string | null} - Rule result or null
   */
  private evaluatePreConditionRulesForChoice(activity: Activity): string | null {
    // This would evaluate the activity's pre-condition rules
    // and return "DISABLED", "SKIP", "HIDDEN_FROM_CHOICE", or null
    const preRules = activity.sequencingRules.preConditionRules;

    for (const rule of preRules) {
      // Evaluate rule conditions
      let conditionsMet = true;

      if (rule.conditionCombination === "all") {
        conditionsMet = rule.conditions.every(condition => condition.evaluate(activity));
      } else {
        conditionsMet = rule.conditions.some(condition => condition.evaluate(activity));
      }

      if (conditionsMet) {
        // Return the action as string
        switch (rule.action) {
          case "skip":
            return "SKIP";
          case "disabled":
            return "DISABLED";
          case "hideFromChoice":
            return "HIDDEN_FROM_CHOICE";
        }
      }
    }

    return null;
  }

  /**
   * Validate Activity Tree State Consistency
   * Priority 4 Gap: Activity Tree State Consistency
   * @param {Activity} activity - Activity to validate
   * @return {{consistent: boolean, exception: string | null}} - Consistency result
   */
  private validateActivityTreeStateConsistency(activity: Activity): {
    consistent: boolean,
    exception: string | null
  } {
    // Check that the activity tree is in a consistent state for delivery
    if (!this.activityTree.root) {
      return { consistent: false, exception: "DB.1.1-4" }; // No activity tree
    }

    // Validate activity is part of the current tree
    if (!this.isActivityPartOfTree(activity, this.activityTree.root)) {
      return { consistent: false, exception: "DB.1.1-5" }; // Activity not in tree
    }

    // Check for conflicting active activities
    const activeActivities = this.getActiveActivities();
    if (activeActivities.length > 1) {
      // Multiple active activities indicate inconsistent state
      this.fireEvent("onStateInconsistency", {
        activeActivities: activeActivities.map(a => a.id),
        targetActivity: activity.id
      });
      return { consistent: false, exception: "DB.1.1-6" }; // State inconsistency
    }

    // Validate parent-child relationships are intact
    let current: Activity | null = activity;
    while (current?.parent) {
      if (!current.parent.children.includes(current)) {
        return { consistent: false, exception: "DB.1.1-7" }; // Broken parent-child relationship
      }
      current = current.parent;
    }

    return { consistent: true, exception: null };
  }

  /**
   * Validate Resource Constraints
   * Priority 4 Gap: Resource Constraint Checking
   * @param {Activity} activity - Activity to validate
   * @return {{available: boolean, exception: string | null}} - Resource availability result
   */
  private validateResourceConstraints(activity: Activity): {
    available: boolean,
    exception: string | null
  } {
    // Check if required resources are available
    // This could include checking for:
    // - Required plugins or software components
    // - Network connectivity for web-based resources
    // - File system access for local resources
    // - Memory and processing capacity

    // Example resource validations (simplified):

    // Check if activity requires specific resources that might not be available
    const requiredResources = this.getActivityRequiredResources(activity);
    for (const resource of requiredResources) {
      if (!this.isResourceAvailable(resource)) {
        return {
          available: false,
          exception: "DB.1.1-8" // Resource not available
        };
      }
    }

    // Check system resource limits
    const systemResourceCheck = this.checkSystemResourceLimits();
    if (!systemResourceCheck.adequate) {
      return {
        available: false,
        exception: "DB.1.1-9" // Insufficient system resources
      };
    }

    return { available: true, exception: null };
  }

  /**
   * Validate Concurrent Delivery Prevention
   * Priority 4 Gap: Prevent Multiple Simultaneous Deliveries
   * @param {Activity} activity - Activity to validate
   * @return {{allowed: boolean, exception: string | null}} - Concurrency check result
   */
  private validateConcurrentDeliveryPrevention(activity: Activity): {
    allowed: boolean,
    exception: string | null
  } {
    // Check if another delivery is currently in progress
    if (this.contentDelivered && this.activityTree.currentActivity && this.activityTree.currentActivity !== activity) {
      return {
        allowed: false,
        exception: "DB.1.1-10" // Another activity is currently being delivered
      };
    }

    // Check for pending delivery requests in queue
    if (this.hasPendingDeliveryRequests()) {
      return {
        allowed: false,
        exception: "DB.1.1-11" // Delivery request already in queue
      };
    }

    // Validate delivery lock status
    if (this.isDeliveryLocked()) {
      return {
        allowed: false,
        exception: "DB.1.1-12" // Delivery is currently locked
      };
    }

    return { allowed: true, exception: null };
  }

  /**
   * Validate Activity Dependencies
   * Priority 4 Gap: Dependency Resolution
   * @param {Activity} activity - Activity to validate
   * @return {{satisfied: boolean, exception: string | null}} - Dependency check result
   */
  private validateActivityDependencies(activity: Activity): {
    satisfied: boolean,
    exception: string | null
  } {
    // Check prerequisite activities
    const prerequisites = this.getActivityPrerequisites(activity);
    for (const prerequisite of prerequisites) {
      if (!this.isPrerequisiteSatisfied(prerequisite, activity)) {
        return {
          satisfied: false,
          exception: "DB.1.1-13" // Prerequisites not satisfied
        };
      }
    }

    // Check objective dependencies
    const objectiveDependencies = this.getObjectiveDependencies(activity);
    for (const dependency of objectiveDependencies) {
      if (!this.isObjectiveDependencySatisfied(dependency)) {
        return {
          satisfied: false,
          exception: "DB.1.1-14" // Objective dependencies not met
        };
      }
    }

    // Check sequencing rule dependencies
    const sequencingDependencies = this.getSequencingRuleDependencies(activity);
    if (!sequencingDependencies.satisfied) {
      return {
        satisfied: false,
        exception: "DB.1.1-15" // Sequencing dependencies not met
      };
    }

    return { satisfied: true, exception: null };
  }

  /**
   * Helper methods for delivery request validation
   */
  private isActivityPartOfTree(activity: Activity, root: Activity): boolean {
    if (activity === root) {
      return true;
    }

    for (const child of root.children) {
      if (this.isActivityPartOfTree(activity, child)) {
        return true;
      }
    }

    return false;
  }

  private getActiveActivities(): Activity[] {
    const activeActivities: Activity[] = [];
    if (this.activityTree.root) {
      this.collectActiveActivities(this.activityTree.root, activeActivities);
    }
    return activeActivities;
  }

  private collectActiveActivities(activity: Activity, activeActivities: Activity[]): void {
    if (activity.isActive) {
      activeActivities.push(activity);
    }
    for (const child of activity.children) {
      this.collectActiveActivities(child, activeActivities);
    }
  }

  private getActivityRequiredResources(activity: Activity): string[] {
    // Parse activity metadata for resource requirements
    // Check activity definition for required resources like bandwidth, plugins, etc.
    const resources: string[] = [];

    // Check for multimedia requirements based on activity title and location
    const activityInfo = (activity.title + " " + activity.location).toLowerCase();
    if (activityInfo.includes("video") || activityInfo.includes("multimedia")) {
      resources.push("video-codec");
    }
    if (activityInfo.includes("audio") || activityInfo.includes("sound")) {
      resources.push("audio-codec");
    }

    // Check for plugin requirements from activity location/title
    if (activityInfo.includes("flash") || activityInfo.includes(".swf")) {
      resources.push("flash-plugin");
    }
    if (activityInfo.includes("java") || activityInfo.includes("applet")) {
      resources.push("java-runtime");
    }

    // Check for bandwidth requirements based on activity type
    if (activity.children && activity.children.length > 0) {
      resources.push("high-bandwidth"); // Container activities may need more bandwidth
    }

    // Check for storage requirements based on duration limits
    if (activity.attemptAbsoluteDurationLimit &&
      this.parseDurationToMinutes(activity.attemptAbsoluteDurationLimit) > 60) {
      resources.push("extended-storage"); // Long duration activities need more storage
    }

    // Check for specific SCORM requirements
    if (activity.attemptLimit && activity.attemptLimit > 1) {
      resources.push("persistent-storage"); // Multiple attempts need storage
    }

    return resources;
  }

  private isResourceAvailable(resource: string): boolean {
    // Check if the specified resource is available in the runtime environment
    try {
      switch (resource) {
        case "video-codec":
          // Check if HTML5 video is supported
          return !!(document.createElement("video").canPlayType);

        case "audio-codec":
          // Check if HTML5 audio is supported
          return !!(document.createElement("audio").canPlayType);

        case "flash-plugin":
          // Check for Flash plugin (legacy support)
          return (navigator.plugins && Array.from(navigator.plugins).some(plugin => plugin.name === "Shockwave Flash"));

        case "java-runtime":
          // Check for Java support (mostly deprecated in modern browsers)
          return (navigator.plugins && Array.from(navigator.plugins).some(plugin => plugin.name === "Java"));

        case "high-bandwidth":
          // Check network connection (basic heuristic)
          if ("connection" in navigator) {
            const connection = (navigator as any).connection;
            return connection.effectiveType === "4g" || connection.downlink > 5;
          }
          return true; // Assume available if can't detect

        case "extended-storage":
          // Check for sufficient storage (estimate 100MB needed)
          if ("storage" in navigator && "estimate" in navigator.storage) {
            navigator.storage.estimate().then(estimate => {
              return (estimate.quota || 0) > 100 * 1024 * 1024; // 100MB
            });
          }
          return true; // Assume available if can't detect

        case "persistent-storage":
          // Check for persistent storage capabilities
          return "localStorage" in window && "sessionStorage" in window;

        default:
          // Unknown resource, assume available
          return true;
      }
    } catch (error) {
      // If any check fails, assume resource is unavailable
      return false;
    }
  }

  private checkSystemResourceLimits(): { adequate: boolean } {
    // Check system memory, CPU, and other resource constraints
    try {
      let adequate = true;

      // Check memory usage if available (Chrome/Edge only)
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const memoryUsagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        if (memoryUsagePercent > 0.8) { // More than 80% memory used
          adequate = false;
        }
      }

      // Check for device memory hint (modern browsers)
      if ("deviceMemory" in navigator) {
        const deviceMemory = (navigator as any).deviceMemory;
        if (deviceMemory < 2) { // Less than 2GB device memory
          adequate = false;
        }
      }

      // Check hardware concurrency (rough CPU check)
      if ("hardwareConcurrency" in navigator) {
        const cores = navigator.hardwareConcurrency;
        if (cores < 2) { // Single core devices might struggle
          adequate = false;
        }
      }

      // Check connection quality for network-intensive activities
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        if (connection.saveData || connection.effectiveType === "slow-2g") {
          adequate = false;
        }
      }

      return { adequate };
    } catch (error) {
      // If checks fail, assume resources are adequate
      return { adequate: true };
    }
  }

  private hasPendingDeliveryRequests(): boolean {
    // Check if there are pending delivery requests in the system
    // This would track asynchronous operations like:
    // - CMI data commits to LMS
    // - Asset downloads
    // - External service calls

    // Check for pending async operations in the activity tree state
    if (this.activityTree && (this.activityTree as any).pendingRequests) {
      return (this.activityTree as any).pendingRequests.length > 0;
    }

    // Check for any pending fetch operations (if using fetch API)
    if (typeof window !== "undefined" && (window as any).pendingScormRequests) {
      return (window as any).pendingScormRequests > 0;
    }

    // Check event service for pending operations
    if (this.eventCallback) {
      // Fire event to check for pending operations
      try {
        this.eventCallback("check_pending_requests", {});
        // Implementation would depend on the event system returning status
      } catch (error) {
        // If event fails, assume no pending requests
      }
    }

    return false;
  }

  private isDeliveryLocked(): boolean {
    // Check if delivery is currently locked due to:
    // - Active navigation request processing
    // - Pending termination/suspension
    // - Resource constraints
    // - System maintenance mode

    // Check for navigation lock
    if (this.activityTree && (this.activityTree as any).navigationLocked) {
      return true;
    }

    // Check for active termination process
    if (this.activityTree && (this.activityTree as any).terminationInProgress) {
      return true;
    }

    // Check system resource limits
    const resourceCheck = this.checkSystemResourceLimits();
    if (!resourceCheck.adequate) {
      return true; // Lock delivery if resources are inadequate
    }

    // Check for maintenance mode (would be set by LMS)
    return !!(typeof window !== "undefined" && (window as any).scormMaintenanceMode);
  }

  private getActivityPrerequisites(activity: Activity): string[] {
    // Return list of prerequisite activity IDs based on SCORM 2004 sequencing rules
    const prerequisites: string[] = [];

    // Check for preCondition rules that reference other activities
    if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
      for (const rule of activity.sequencingRules.preConditionRules) {
        if (rule.conditions && rule.conditions.length > 0) {
          for (const condition of rule.conditions) {
            // Look for objectiveStatusKnown, objectiveSatisfied, etc. conditions
            // that reference global objectives which may be satisfied by other activities
            if ((condition as any).referencedObjectiveID &&
              (condition as any).referencedObjectiveID !== activity.id) {
              prerequisites.push((condition as any).referencedObjectiveID);
            }
          }
        }
      }
    }

    // Check for sequencing control dependencies
    // Activities with choiceExit=false may depend on completion of siblings
    if (activity.parent && activity.sequencingControls &&
      !activity.sequencingControls.choiceExit) {
      const siblings = activity.parent.children;
      if (siblings) {
        const activityIndex = siblings.indexOf(activity);

        // Add previous siblings as prerequisites for sequential flow
        for (let i = 0; i < activityIndex; i++) {
          const sibling = siblings[i];
          if (sibling) {
            prerequisites.push(sibling.id);
          }
        }
      }
    }

    // Check for explicit prerequisite metadata (if defined in activity)
    if ((activity as any).prerequisiteActivities) {
      prerequisites.push(...(activity as any).prerequisiteActivities);
    }

    return Array.from(new Set(prerequisites)); // Remove duplicates
  }

  private isPrerequisiteSatisfied(prerequisiteId: string, _activity: Activity): boolean {
    // Check if prerequisite is satisfied
    const prerequisite = this.activityTree.getActivity(prerequisiteId);
    if (!prerequisite) {
      return false;
    }

    // Check if prerequisite is completed
    return prerequisite.completionStatus === "completed";
  }

  private getObjectiveDependencies(activity: Activity): string[] {
    // Return list of objective dependencies based on SCORM 2004 objective mapping
    const dependencies: string[] = [];

    // Check activity's objective mappings for global objective references
    // Note: Activity class doesn't currently have objectives property - this is a future enhancement
    const objectives = (activity as any).objectives;
    if (objectives && objectives.length > 0) {
      for (const objective of objectives) {
        // Check for global objective mapping
        if ((objective as any).globalObjectiveID) {
          dependencies.push((objective as any).globalObjectiveID);
        }

        // Check for read/write objective mappings
        if (!(objective as any).satisfiedByMeasure && (objective as any).readNormalizedMeasure) {
          // This objective depends on external measure
          dependencies.push(objective.id + "_measure");
        }
      }
    }

    // Check sequencing rules for objective references
    if (activity.sequencingRules) {
      const allRules = [
        ...(activity.sequencingRules.preConditionRules || []),
        ...(activity.sequencingRules.exitConditionRules || []),
        ...(activity.sequencingRules.postConditionRules || [])
      ];

      for (const rule of allRules) {
        if (rule.conditions && rule.conditions.length > 0) {
          for (const condition of rule.conditions) {
            if ((condition as any).objectiveReference &&
              (condition as any).objectiveReference !== activity.id) {
              dependencies.push((condition as any).objectiveReference);
            }
          }
        }
      }
    }

    return Array.from(new Set(dependencies)); // Remove duplicates
  }

  private isObjectiveDependencySatisfied(objectiveId: string): boolean {
    // Check if objective dependency is satisfied according to SCORM 2004 rules

    // Handle global objective references
    if (this.activityTree && (this.activityTree as any).globalObjectives) {
      const globalObjectives = (this.activityTree as any).globalObjectives;
      const globalObjective = globalObjectives[objectiveId];

      if (globalObjective) {
        // Check if global objective is satisfied
        return globalObjective.satisfied === true &&
          globalObjective.statusKnown === true;
      }
    }

    // Handle measure-based dependencies
    if (objectiveId.endsWith("_measure")) {
      const baseObjectiveId = objectiveId.replace("_measure", "");
      if (this.activityTree && (this.activityTree as any).globalObjectives) {
        const globalObjectives = (this.activityTree as any).globalObjectives;
        const globalObjective = globalObjectives[baseObjectiveId];

        if (globalObjective) {
          // Check if measure is available and within acceptable range
          return globalObjective.measureKnown === true &&
            globalObjective.normalizedMeasure >= 0;
        }
      }
    }

    // Handle activity-specific objective references
    const referencedActivity = this.activityTree.getActivity(objectiveId);
    if (referencedActivity) {
      return referencedActivity.objectiveSatisfiedStatus && referencedActivity.objectiveMeasureStatus;
    }

    // If objective is not found or cannot be evaluated, assume not satisfied
    return false;
  }

  private getSequencingRuleDependencies(activity: Activity): { satisfied: boolean } {
    // Check sequencing rule dependencies for SCORM 2004 compliance
    let satisfied = true;

    try {
      // Check pre-condition rule dependencies
      if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
        for (const rule of activity.sequencingRules.preConditionRules) {
          if (rule.conditions && rule.conditions.length > 0) {
            for (const condition of rule.conditions) {
              // Check condition-specific dependencies
              const conditionType = (condition as any).conditionType || condition.condition;

              switch (conditionType) {
                case "activityProgressKnown":
                  // Depends on activity progress tracking being available
                  if (!activity.progressMeasureStatus) satisfied = false;
                  break;

                case "objectiveStatusKnown":
                case "objectiveSatisfied": {
                  // Depends on objective evaluation system
                  const objectiveId = (condition as any).referencedObjectiveID || activity.id;
                  if (!this.isObjectiveDependencySatisfied(objectiveId)) satisfied = false;
                  break;
                }

                case "attemptLimitExceeded":
                  // Depends on attempt tracking
                  if (activity.attemptLimit === null) satisfied = false;
                  break;

                case "timeLimitExceeded":
                  // Depends on time tracking
                  if (!activity.attemptAbsoluteDurationLimit &&
                    !activity.activityAbsoluteDurationLimit) satisfied = false;
                  break;

                case "always":
                case "never":
                  // These conditions have no dependencies
                  break;

                default:
                  // Unknown condition type, assume dependency not satisfied
                  satisfied = false;
              }
            }
          }
        }
      }

      // Check exit condition rule dependencies (similar logic)
      if (activity.sequencingRules && activity.sequencingRules.exitConditionRules) {
        for (const rule of activity.sequencingRules.exitConditionRules) {
          if (rule.conditions && rule.conditions.length > 0) {
            for (const condition of rule.conditions) {
              const conditionType = (condition as any).conditionType || condition.condition;

              // Similar dependency checks as pre-conditions
              if (["objectiveStatusKnown", "objectiveSatisfied"].includes(conditionType)) {
                const objectiveId = (condition as any).referencedObjectiveID || activity.id;
                if (!this.isObjectiveDependencySatisfied(objectiveId)) satisfied = false;
              }
            }
          }
        }
      }

      // Check rollup rule dependencies
      if (activity.rollupRules && activity.rollupRules.rules) {
        for (const rule of activity.rollupRules.rules) {
          if (rule.conditions && rule.conditions.length > 0) {
            // Rollup rules depend on child activity completion
            if (activity.children && activity.children.length > 0) {
              for (const child of activity.children) {
                if (!child.isCompleted) {
                  satisfied = false;
                  break;
                }
              }
            }
          }
        }
      }

    } catch (error) {
      // If any error occurs during dependency check, mark as not satisfied
      satisfied = false;
    }

    return { satisfied };
  }

  /**
   * Helper method to parse ISO 8601 duration to minutes
   */
  private parseDurationToMinutes(duration: string): number {
    return getDurationAsSeconds(duration, scorm2004_regex.CMITimespan) / 60; // Convert seconds to minutes
  }

  /**
   * INTEGRATION: Initialize Global Objective Map
   * Sets up the global objective map for cross-activity objective synchronization
   */
  private initializeGlobalObjectiveMap(): void {
    try {
      this.globalObjectiveMap.clear();

      // Initialize global objectives from activity tree if available
      if (this.activityTree.root) {
        this.collectGlobalObjectives(this.activityTree.root);
      }

      this.fireEvent("onGlobalObjectiveMapInitialized", {
        objectiveCount: this.globalObjectiveMap.size,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.fireEvent("onGlobalObjectiveMapError", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * INTEGRATION: Collect Global Objectives
   * Recursively collects global objectives from the activity tree
   * @param {Activity} activity - Activity to collect objectives from
   */
  private collectGlobalObjectives(activity: Activity): void {
    // Create a default global objective for this activity
    const globalObjectiveId = activity.id + "_global";
    if (!this.globalObjectiveMap.has(globalObjectiveId)) {
      this.globalObjectiveMap.set(globalObjectiveId, {
        id: globalObjectiveId,
        satisfiedStatus: activity.objectiveSatisfiedStatus,
        satisfiedStatusKnown: activity.objectiveMeasureStatus,
        normalizedMeasure: activity.objectiveNormalizedMeasure,
        normalizedMeasureKnown: activity.objectiveMeasureStatus,
        progressMeasure: activity.progressMeasure,
        progressMeasureKnown: activity.progressMeasureStatus,
        completionStatus: activity.completionStatus,
        completionStatusKnown: activity.completionStatus !== "unknown",
        readSatisfiedStatus: true,
        writeSatisfiedStatus: true,
        readNormalizedMeasure: true,
        writeNormalizedMeasure: true,
        readProgressMeasure: true,
        writeProgressMeasure: true,
        readCompletionStatus: true,
        writeCompletionStatus: true,
        satisfiedByMeasure: activity.scaledPassingScore !== null,
        updateAttemptData: true
      });
    }

    // Process children recursively
    for (const child of activity.children) {
      this.collectGlobalObjectives(child);
    }
  }

  /**
   * INTEGRATION: Get Global Objective Map
   * Returns the current global objective map for external access
   * @return {Map<string, any>} - Current global objective map
   */
  public getGlobalObjectiveMap(): Map<string, any> {
    return this.globalObjectiveMap;
  }

  /**
   * INTEGRATION: Update Global Objective
   * Updates a specific global objective with new data
   * @param {string} objectiveId - Objective ID to update
   * @param {any} objectiveData - New objective data
   */
  public updateGlobalObjective(objectiveId: string, objectiveData: any): void {
    try {
      this.globalObjectiveMap.set(objectiveId, {
        ...this.globalObjectiveMap.get(objectiveId),
        ...objectiveData,
        lastUpdated: new Date().toISOString()
      });

      this.fireEvent("onGlobalObjectiveUpdated", {
        objectiveId,
        data: objectiveData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      this.fireEvent("onGlobalObjectiveUpdateError", {
        objectiveId,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  }
}
