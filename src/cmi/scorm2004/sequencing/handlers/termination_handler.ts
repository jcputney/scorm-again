import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { SequencingProcess, SequencingRequestType, PostConditionResult } from "../sequencing_process";
import { RollupProcess } from "../rollup_process";
import { RuleActionType } from "../sequencing_rules";
import { SelectionRandomization } from "../selection_randomization";
import {
  RteDataTransferService,
  RteDataTransferContext,
  CMIDataForTransfer,
} from "./rte_data_transfer";

// Re-export CMIDataForTransfer for backward compatibility
export { CMIDataForTransfer } from "./rte_data_transfer";

/**
 * Result of Termination Request Process
 * Contains the termination result, sequencing request, and validity
 * @spec SN Book: TB.2.3 (Termination Request Process)
 */
export interface TerminationResult {
  terminationRequest: SequencingRequestType;
  sequencingRequest: SequencingRequestType | null;
  exception: string | null;
  valid: boolean;
}

/**
 * Options for configuring the TerminationHandler
 */
export interface TerminationHandlerOptions {
  getCMIData?: () => CMIDataForTransfer;
  is4thEdition?: boolean;
}

/**
 * TerminationHandler
 *
 * Handles all termination-related processing for the SCORM 2004 sequencing engine.
 * Extracted from OverallSequencingProcess to follow Single Responsibility Principle.
 *
 * Responsibilities:
 * - Process termination requests (EXIT, EXIT_ALL, ABANDON, ABANDON_ALL, SUSPEND_ALL)
 * - Handle post-condition loops for EXIT_PARENT cascading
 * - End attempts and cleanup activity states
 * - Transfer RTE data to activity state
 *
 * @spec SN Book: TB.2.3 (Termination Request Process)
 */
export class TerminationHandler {
  private activityTree: ActivityTree;
  private sequencingProcess: SequencingProcess;
  private rollupProcess: RollupProcess;
  private globalObjectiveMap: Map<string, any>;
  private eventCallback: ((eventType: string, data?: any) => void) | null;
  private getCMIData: (() => CMIDataForTransfer) | null;
  private is4thEdition: boolean;
  private invalidateCacheCallback: (() => void) | null = null;
  private _rteDataTransferService: RteDataTransferService;

  constructor(
    activityTree: ActivityTree,
    sequencingProcess: SequencingProcess,
    rollupProcess: RollupProcess,
    globalObjectiveMap: Map<string, any>,
    eventCallback: ((eventType: string, data?: any) => void) | null = null,
    options?: TerminationHandlerOptions
  ) {
    this.activityTree = activityTree;
    this.sequencingProcess = sequencingProcess;
    this.rollupProcess = rollupProcess;
    this.globalObjectiveMap = globalObjectiveMap;
    this.eventCallback = eventCallback;
    this.getCMIData = options?.getCMIData || null;
    this.is4thEdition = options?.is4thEdition || false;

    // Initialize RTE data transfer service
    const rteContext: RteDataTransferContext = {
      getCMIData: this.getCMIData,
      fireEvent: (eventType: string, data?: any) => this.fireEvent(eventType, data),
    };
    this._rteDataTransferService = new RteDataTransferService(rteContext);
  }

  /**
   * Set callback to invalidate navigation cache after state changes
   */
  public setInvalidateCacheCallback(callback: () => void): void {
    this.invalidateCacheCallback = callback;
  }

  /**
   * Enhanced Termination Request Process
   * Processes termination requests with post-condition loop for EXIT_PARENT handling
   * Implements missing post-condition loop per SCORM 2004 3rd Edition TB.2.3
   * @spec SN Book: TB.2.3 (Termination Request Process)
   * @param {SequencingRequestType} request - The termination request
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @param {string} exitType - The cmi.exit value (logout, normal, suspend, time-out, or empty)
   * @return {TerminationResult} - Termination result with sequencing request
   */
  public processTerminationRequest(
    request: SequencingRequestType,
    hasSequencingRequest: boolean = false,
    exitType?: string
  ): TerminationResult {
    const currentActivity = this.activityTree.currentActivity;

    if (!currentActivity) {
      return {
        terminationRequest: request,
        sequencingRequest: null,
        exception: "TB.2.3-1",
        valid: false,
      };
    }

    // TB.2.3-2: Check if trying to terminate already-terminated activity
    if (
      (request === SequencingRequestType.EXIT ||
        request === SequencingRequestType.ABANDON) &&
      !currentActivity.isActive
    ) {
      return {
        terminationRequest: request,
        sequencingRequest: null,
        exception: "TB.2.3-2",
        valid: false,
      };
    }

    // Enhanced logging for debugging
    this.fireEvent("onTerminationRequestProcessing", {
      request,
      hasSequencingRequest,
      currentActivity: currentActivity.id,
      exitType,
    });

    // REQ-NAV-025: Handle logout exit - treat as exitAll navigation request
    if (exitType === "logout") {
      this.fireEvent("onSequencingDebug", {
        message: "cmi.exit='logout' detected, treating as EXIT_ALL",
        activityId: currentActivity.id,
      });
      return this.handleExitAll(currentActivity);
    }

    // Handle different termination types
    switch (request) {
      case SequencingRequestType.EXIT:
        return this.handleExit(currentActivity, hasSequencingRequest);

      case SequencingRequestType.EXIT_ALL:
        return this.handleExitAll(currentActivity);

      case SequencingRequestType.ABANDON:
        return this.handleAbandon(currentActivity, hasSequencingRequest);

      case SequencingRequestType.ABANDON_ALL:
        return this.handleAbandonAll(currentActivity);

      case SequencingRequestType.SUSPEND_ALL:
        return this.handleSuspendAll(currentActivity);

      default:
        return {
          terminationRequest: request,
          sequencingRequest: null,
          exception: "TB.2.3-7",
          valid: false,
        };
    }
  }

  /**
   * Handle EXIT termination with post-condition loop (TB.2.3 step 3)
   * Implements the do-while loop for EXIT_PARENT cascading
   * @param {Activity} currentActivity - The current activity
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @return {TerminationResult} - The termination result
   */
  /**
   * Handle EXIT termination for an activity
   * Made public for backward compatibility with tests
   * @param {Activity} currentActivity - The activity being terminated
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @return {TerminationResult} - The termination result
   */
  public handleExitTermination(
    currentActivity: Activity,
    hasSequencingRequest: boolean
  ): TerminationResult {
    return this.handleExit(currentActivity, hasSequencingRequest);
  }

  private handleExit(
    currentActivity: Activity,
    hasSequencingRequest: boolean
  ): TerminationResult {
    // TB.2.3 step 3.0: For cluster activities, terminate descendant attempts first
    if (currentActivity.children.length > 0) {
      this.terminateDescendants(currentActivity);
    }

    // TB.2.3 step 3.1: Apply End Attempt Process
    this.endAttempt(currentActivity);

    // TB.2.3 step 3.2: Apply Sequencing Exit Action Rules Subprocess
    const exitActionResult = this.evaluateExitRules(currentActivity);
    if (exitActionResult.action === "EXIT_ALL") {
      // Exit action changed termination to EXIT_ALL
      return this.handleExitAll(currentActivity);
    } else if (exitActionResult.action === "EXIT_PARENT") {
      // Exit action requests exit from parent
      if (currentActivity.parent) {
        // Move to parent and end its attempt
        this.activityTree.currentActivity = currentActivity.parent;
        this.endAttempt(this.activityTree.currentActivity);
      }
      // Continue to post-condition evaluation on the new current activity (parent or original)
    }

    // TB.2.3 step 3.3: POST-CONDITION LOOP
    let processedExit = false;
    let postConditionResult: PostConditionResult;

    do {
      // TB.2.3 step 3.3.1: Set processedExit to false
      processedExit = false;

      // TB.2.3 step 3.3.2: Apply Sequencing Post Condition Rules Subprocess
      postConditionResult = this.evaluatePostConditions(
        this.activityTree.currentActivity || currentActivity
      );

      // TB.2.3 step 3.3.3: If returns EXIT_ALL, change termination type and break
      if (postConditionResult.terminationRequest === SequencingRequestType.EXIT_ALL) {
        this.fireEvent("onPostConditionExitAll", {
          activity: (this.activityTree.currentActivity || currentActivity).id,
        });
        return this.handleExitAll(this.activityTree.root!);
      }

      // TB.2.3 step 3.3.4: If returns EXIT_PARENT, move up and continue loop
      if (postConditionResult.terminationRequest === SequencingRequestType.EXIT_PARENT) {
        const current = this.activityTree.currentActivity || currentActivity;

        if (!current.parent) {
          // TB.2.3-4: Cannot EXIT_PARENT from root
          return {
            terminationRequest: SequencingRequestType.EXIT_PARENT,
            sequencingRequest: null,
            exception: "TB.2.3-4",
            valid: false,
          };
        } else {
          // TB.2.3 step 3.3.4.1: Move to parent
          this.activityTree.currentActivity = current.parent;

          // TB.2.3 step 3.3.4.1.2: Apply End Attempt Process to parent
          this.endAttempt(this.activityTree.currentActivity);

          // TB.2.3 step 3.3.4.1.3: Set processedExit = true to continue loop
          processedExit = true;

          this.fireEvent("onPostConditionExitParent", {
            fromActivity: current.id,
            toActivity: this.activityTree.currentActivity.id,
          });
        }
      }

      // TB.2.3 step 3.3.5: Check if at root without retry
      // Only check atRoot when NOT in middle of EXIT_PARENT cascade (processedExit = false)
      // If processedExit is true, we need to continue loop to evaluate the new activity's post-conditions
      if (!processedExit) {
        const atRoot =
          (this.activityTree.currentActivity || currentActivity) ===
          this.activityTree.root;
        if (
          atRoot &&
          postConditionResult.sequencingRequest !== SequencingRequestType.RETRY
        ) {
          // Return EXIT sequencing request (ends session)
          return {
            terminationRequest: SequencingRequestType.EXIT,
            sequencingRequest: SequencingRequestType.EXIT,
            exception: null,
            valid: true,
          };
        }
      }
    } while (processedExit);

    // TB.2.3 step 3.6: Return sequencing request from post-condition
    // Move to parent if no sequencing request follows (neither original nor post-condition)
    if (!hasSequencingRequest && !postConditionResult.sequencingRequest) {
      const current = this.activityTree.currentActivity || currentActivity;
      if (current.parent) {
        // Set parent as current without activating it
        // The parent should remain inactive if it was terminated by the EXIT_PARENT cascade
        this.activityTree.setCurrentActivityWithoutActivation(current.parent);
      }
    }

    return {
      terminationRequest: SequencingRequestType.EXIT,
      sequencingRequest: postConditionResult.sequencingRequest,
      exception: null,
      valid: true,
    };
  }

  /**
   * Handle EXIT_ALL termination (TB.2.3 step 4)
   * @param {Activity} _currentActivity - The current activity (unused but kept for consistency)
   * @return {TerminationResult} - The termination result
   */
  private handleExitAll(_currentActivity: Activity): TerminationResult {
    // TB.2.3 step 4.1: Terminate descendant attempts from root
    if (this.activityTree.root) {
      this.handleMultiLevelExit(this.activityTree.root);
    }

    // TB.2.3 step 4.2: End attempt on root
    if (this.activityTree.root) {
      this.endAttempt(this.activityTree.root);
    }

    // TB.2.3 step 4.3: Clear current activity
    this.activityTree.currentActivity = null;

    // Clean up suspended activities
    this.cleanupSuspendedActivity();

    // TB.2.3 step 4.4: Return EXIT sequencing request (ends session)
    return {
      terminationRequest: SequencingRequestType.EXIT_ALL,
      sequencingRequest: SequencingRequestType.EXIT,
      exception: null,
      valid: true,
    };
  }

  /**
   * Handle ABANDON termination (TB.2.3 step 6)
   * @param {Activity} currentActivity - The current activity
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @return {TerminationResult} - The termination result
   */
  private handleAbandon(
    currentActivity: Activity,
    hasSequencingRequest: boolean
  ): TerminationResult {
    // TB.2.3 step 6.1: Set activity as not active (no attempt end)
    currentActivity.isActive = false;

    // TB.2.3 step 6.2: Move to parent if no sequencing follows
    if (!hasSequencingRequest) {
      this.activityTree.currentActivity = currentActivity.parent;
    }

    return {
      terminationRequest: SequencingRequestType.ABANDON,
      sequencingRequest: null,
      exception: null,
      valid: true,
    };
  }

  /**
   * Handle ABANDON_ALL termination (TB.2.3 step 7)
   * @param {Activity} currentActivity - The current activity
   * @return {TerminationResult} - The termination result
   */
  private handleAbandonAll(currentActivity: Activity): TerminationResult {
    // TB.2.3 step 7.1: Form the activity path from current to root
    const activityPath: Activity[] = [];
    let current: Activity | null = currentActivity;
    while (current !== null) {
      activityPath.push(current);
      current = current.parent;
    }

    // TB.2.3 step 7.2: If the activity path is empty
    if (activityPath.length === 0) {
      return {
        terminationRequest: SequencingRequestType.ABANDON_ALL,
        sequencingRequest: null,
        exception: "TB.2.3-6",
        valid: false,
      };
    }

    // TB.2.3 step 7.3: For each activity in the activity path, set not active
    for (const activity of activityPath) {
      activity.isActive = false;
    }

    // TB.2.3 step 7.4: Clear current activity
    this.activityTree.currentActivity = null;

    // Clean up suspended activities
    this.cleanupSuspendedActivity();

    return {
      terminationRequest: SequencingRequestType.ABANDON_ALL,
      sequencingRequest: null,
      exception: null,
      valid: true,
    };
  }

  /**
   * Handle SUSPEND_ALL termination (TB.2.3 step 5)
   * Implements TB.2.3 steps 5.1-5.7 for SUSPEND_ALL processing
   * @param {Activity} currentActivity - The current activity
   * @return {TerminationResult} - The termination result
   */
  private handleSuspendAll(currentActivity: Activity): TerminationResult {
    // TB.2.3 steps 5.1-5.6: Suspend current activity and all ancestors, set current to root
    const suspendResult = this.processSuspendAllRequest(currentActivity);

    // Check if suspend failed
    if (!suspendResult.valid) {
      return suspendResult;
    }

    // TB.2.3 5.7: Return EXIT sequencing request to end session
    // Note: Per SCORM spec, after SUSPEND_ALL returns EXIT, the session ends.
    // The content unloads and currentActivity is cleared during termination.
    // When RESUME_ALL is called in the next session, currentActivity will be null.

    return {
      terminationRequest: SequencingRequestType.SUSPEND_ALL,
      sequencingRequest: SequencingRequestType.EXIT,
      exception: null,
      valid: true,
    };
  }

  /**
   * Handle Suspend All Request
   * Implements TB.2.3 steps 5.1-5.6 from SCORM 2004 reference
   * Suspends all activities in the path from current activity to root
   * @param {Activity} currentActivity - Current activity to suspend
   * @return {TerminationResult} - Result with validation status
   */
  private processSuspendAllRequest(currentActivity: Activity): TerminationResult {
    const rootActivity = this.activityTree.root;

    // TB.2.3 5.1: Validation - Check if current activity is defined
    if (!currentActivity || !rootActivity) {
      this.fireEvent("onSuspendError", {
        exception: "TB.2.3-1",
        message: "No current activity to suspend",
        activity: currentActivity?.id,
      });
      return {
        terminationRequest: SequencingRequestType.SUSPEND_ALL,
        sequencingRequest: null,
        exception: "TB.2.3-1",
        valid: false,
      };
    }

    // TB.2.3-3: Check if trying to suspend inactive/unsuspended root activity
    if (
      currentActivity === rootActivity &&
      !currentActivity.isActive &&
      !currentActivity.isSuspended
    ) {
      this.fireEvent("onSuspendError", {
        exception: "TB.2.3-3",
        message: "Nothing to suspend (root activity)",
        activity: currentActivity.id,
      });
      return {
        terminationRequest: SequencingRequestType.SUSPEND_ALL,
        sequencingRequest: null,
        exception: "TB.2.3-3",
        valid: false,
      };
    }

    // TB.2.3 5.1-5.2: Set the suspended activity reference
    this.activityTree.suspendedActivity = currentActivity;

    // TB.2.3 5.3: Form activity path from current activity to root (inclusive)
    // We walk up the tree from current to root
    const suspendedActivity = currentActivity;
    const activityPath: Activity[] = [];
    let current: Activity | null = suspendedActivity;
    while (current !== null) {
      activityPath.push(current);
      current = current.parent;
    }

    // TB.2.3 5.4: Check if path is empty
    if (activityPath.length === 0) {
      this.fireEvent("onSuspendError", {
        exception: "TB.2.3-5",
        message: "Activity path is empty",
        activity: suspendedActivity?.id,
      });
      return {
        terminationRequest: SequencingRequestType.SUSPEND_ALL,
        sequencingRequest: null,
        exception: "TB.2.3-5",
        valid: false,
      };
    }

    // TB.2.3 5.5: For each activity in the path, suspend it
    // 5.5.1: Set Activity is Active = false
    // 5.5.2: Set Activity is Suspended = true
    for (const activity of activityPath) {
      activity.isActive = false;
      activity.isSuspended = true;
    }

    // TB.2.3 5.6: Set current activity to root of activity tree
    // Note: The ActivityTree setter automatically sets isActive = true,
    // but we need root to remain suspended, so we override it
    this.activityTree.currentActivity = rootActivity;
    rootActivity.isActive = false; // Keep root suspended

    // Log suspend event with full path information
    this.fireEvent("onActivitySuspended", {
      activity: suspendedActivity?.id,
      suspendedPath: activityPath.map((a) => a.id),
      pathLength: activityPath.length,
      timestamp: new Date().toISOString(),
    });

    // Return success
    return {
      terminationRequest: SequencingRequestType.SUSPEND_ALL,
      sequencingRequest: null,
      exception: null,
      valid: true,
    };
  }

  /**
   * Enhanced Exit Action Rules Subprocess with recursion detection
   * @param {Activity} activity - Activity to evaluate
   * @param {number} recursionDepth - Current recursion depth
   * @return {{action: string | null, recursionDepth: number}} - Exit action result
   */
  public evaluateExitRules(
    activity: Activity,
    recursionDepth: number = 0
  ): { action: string | null; recursionDepth: number } {
    // Increment recursion depth to detect infinite loops
    recursionDepth++;

    // Check if activity has exit action rules
    const exitRules = activity.sequencingRules.exitConditionRules;

    for (const rule of exitRules) {
      // Evaluate the rule conditions
      let conditionsMet: boolean;

      // Check rule condition combination
      if (rule.conditionCombination === "all") {
        conditionsMet = rule.conditions.every((condition) =>
          condition.evaluate(activity)
        );
      } else {
        conditionsMet = rule.conditions.some((condition) =>
          condition.evaluate(activity)
        );
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
   * @param {Activity} activity - Activity to evaluate post-conditions for
   * @return {PostConditionResult} - Post-condition result with sequencing and termination requests
   */
  public evaluatePostConditions(activity: Activity): PostConditionResult {
    // Evaluate post-condition rules using the sequencing process
    const postResult = this.sequencingProcess.evaluatePostConditionRules(activity);

    if (postResult.sequencingRequest || postResult.terminationRequest) {
      // Log the post-condition action for tracking
      this.fireEvent("onPostConditionEvaluated", {
        activity: activity.id,
        sequencingRequest: postResult.sequencingRequest,
        terminationRequest: postResult.terminationRequest,
        timestamp: new Date().toISOString(),
      });
    }

    return postResult;
  }

  /**
   * Handle Multi-Level Exit Actions
   * @param {Activity} rootActivity - Root activity to start from
   */
  private handleMultiLevelExit(rootActivity: Activity): void {
    // Process exit actions at each level systematically
    this.processExitAtLevel(rootActivity, 0);

    // Then terminate all activities
    this.terminateAll(rootActivity);
  }

  /**
   * Process exit actions at specific level
   * @param {Activity} activity - Activity to process
   * @param {number} level - Current level in hierarchy
   */
  private processExitAtLevel(activity: Activity, level: number): void {
    // Process exit actions for this activity
    const exitAction = this.evaluateExitRules(activity, 0);

    if (exitAction.action) {
      this.fireEvent("onMultiLevelExitAction", {
        activity: activity.id,
        level,
        action: exitAction.action,
      });
    }

    // Recursively process children
    for (const child of activity.children) {
      this.processExitAtLevel(child, level + 1);
    }
  }

  /**
   * Perform Complex Suspended Activity Cleanup
   */
  public cleanupSuspendedActivity(): void {
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
        originalSuspendedActivity: suspendedActivity.id,
      });
    }
  }

  /**
   * Terminate all activities in the tree
   * @param {Activity} activity - The activity to start from (usually root)
   */
  private terminateAll(activity: Activity): void {
    // Recursively terminate all children first
    for (const child of activity.children) {
      this.terminateAll(child);
    }

    // Then terminate this activity
    if (activity.isActive) {
      this.endAttempt(activity);
    }
  }

  /**
   * Terminate Descendent Attempts Process (UP.3)
   * Recursively terminates all active descendant attempts
   * @param {Activity} activity - The activity whose descendants to terminate
   */
  public terminateDescendants(activity: Activity): void {
    // Process all children
    for (const child of activity.children) {
      // Recursively terminate descendants first
      if (child.children.length > 0) {
        this.terminateDescendants(child);
      }

      // Check exit rules for the child
      const exitAction = this.exitActionRulesSubprocess(child);

      // Terminate the child if it's active
      if (child.isActive) {
        // Apply exit action if any
        if (exitAction === "EXIT_ALL") {
          // Recursively terminate all descendants
          this.terminateDescendants(child);
        }

        // End the attempt
        this.endAttempt(child);
      }
    }
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
      let conditionsMet: boolean;

      // Check rule condition combination
      if (rule.conditionCombination === "all") {
        conditionsMet = rule.conditions.every((condition) =>
          condition.evaluate(activity)
        );
      } else {
        conditionsMet = rule.conditions.some((condition) =>
          condition.evaluate(activity)
        );
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
   * Clear Suspended Activity Subprocess (DB.2.1)
   * Clears the suspended activity state
   */
  public clearSuspendedActivity(): void {
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
   * End Attempt Process
   * Ends an attempt on an activity
   * @spec SN Book: UP.4 (Utility Process - End Attempt Process)
   * @param {Activity} activity - The activity to end attempt on
   */
  public endAttempt(activity: Activity): void {
    if (!activity.isActive) {
      return;
    }

    // Transfer RTE data to activity state BEFORE auto-completion logic
    // This ensures that CMI data set by content is properly transferred to activity objectives
    this._rteDataTransferService.transferRteData(activity);

    // Set activity as inactive
    activity.isActive = false;
    activity.activityAttemptActive = false;

    // [UP.4]1. If the activity is a leaf Then
    if (activity.children.length === 0) {
      // [UP.4]1.1. If Tracked for the activity is True Then
      // Note: In SCORM 2004, all leaf activities are tracked by default
      const isTracked = true;

      if (isTracked) {
        // [UP.4]1.1.1. If the Activity is Suspended for the activity is False Then
        // (The sequencer will not affect the state of suspended activities)
        if (!activity.isSuspended) {
          // [UP.4]1.1.1.1. Auto-Completion Logic
          if (!activity.sequencingControls.completionSetByContent) {
            // [UP.4]1.1.1.1.1. If the Attempt Progress Status for the activity is False Then
            // (Did the content inform the sequencer of the activity's completion status?)
            if (!activity.attemptProgressStatus) {
              // [UP.4]1.1.1.1.1.1. Set the Attempt Progress Status for the activity to True
              activity.attemptProgressStatus = true;

              // [UP.4]1.1.1.1.1.2. Set the Attempt Completion Status for the activity to True
              activity.completionStatus = "completed";

              // Track that this was automatic
              activity.wasAutoCompleted = true;

              this.fireEvent("onAutoCompletion", {
                activityId: activity.id,
                timestamp: new Date().toISOString(),
              });
            }
          }

          // [UP.4]1.1.1.2. Auto-Satisfaction Logic
          if (!activity.sequencingControls.objectiveSetByContent) {
            // [UP.4]1.1.1.2.1. Get the primary objective
            const primaryObjective = activity.primaryObjective;

            if (primaryObjective) {
              // [UP.4]1.1.1.2.1.1.1. If the Objective Progress Status for the objective is False Then
              // (Did the content inform the sequencer of the activity's rolled-up objective status?)
              if (!primaryObjective.progressStatus) {
                // [UP.4]1.1.1.2.1.1.1.1. Set the Objective Progress Status for the objective to True
                primaryObjective.progressStatus = true;

                // [UP.4]1.1.1.2.1.1.1.2. Set the Objective Satisfied Status for the objective to True
                primaryObjective.satisfiedStatus = true;
                activity.objectiveSatisfiedStatus = true;
                activity.successStatus = "passed";

                // Track that this was automatic
                activity.wasAutoSatisfied = true;

                this.fireEvent("onAutoSatisfaction", {
                  activityId: activity.id,
                  timestamp: new Date().toISOString(),
                });
              }
            }
          }
        }
      }
    } else {
      // [UP.4]2. Else (The activity has children)
      // [UP.4]2.1. Update suspended status based on children
      const hasSuspendedChildren = activity.children.some((child) => child.isSuspended);
      activity.isSuspended = hasSuspendedChildren;
    }

    // Handle unknown statuses for activities that weren't auto-completed/satisfied
    // Update attempt completion status if not already set
    if (activity.completionStatus === "unknown") {
      activity.completionStatus = "incomplete";
    }

    // Update success status if needed
    if (activity.successStatus === "unknown" && activity.objectiveSatisfiedStatus) {
      activity.successStatus = activity.objectiveSatisfiedStatus ? "passed" : "failed";
    }

    // Sync global objectives then trigger rollup
    // This reads FROM global objectives INTO activities before rollup,
    // so rollup can use global objective state when calculating activity status
    const mappingRoot = this.activityTree.root || activity;
    this.rollupProcess.processGlobalObjectiveMapping(mappingRoot, this.globalObjectiveMap);

    // Trigger rollup after global objective sync
    // Rollup calculates satisfaction and completion based on children and global state
    this.rollupProcess.overallRollupProcess(activity);

    // IMPORTANT: We do NOT sync again after rollup because that would overwrite
    // the rollup results by reading from stale global objectives.
    // Global objectives will be updated on the NEXT activity's access when it
    // reads the parent's status via global objective mapping.

    // Invalidate navigation predictions after rollup
    if (this.invalidateCacheCallback) {
      this.invalidateCacheCallback();
    }

    // INTEGRATION: Validate rollup state consistency after rollup
    if (this.activityTree.root) {
      this.rollupProcess.validateRollupStateConsistency(this.activityTree.root);
    }

    // Apply selection and randomization per SCORM 2004 3rd Edition UP.4
    // (Randomization at specification-required process points)
    // This occurs after rollup processing completes
    SelectionRandomization.applySelectionAndRandomization(activity, false);
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
}
