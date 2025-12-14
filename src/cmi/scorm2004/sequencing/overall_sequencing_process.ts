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
import { CompletionStatus } from "../../../constants/enums";
import {
  AuxiliaryResource,
  HIDE_LMS_UI_TOKENS,
  HideLmsUiItem
} from "../../../types/sequencing_types";
import { SelectionRandomization } from "./selection_randomization";

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
 * Result of Termination Request Process (TB.2.3)
 * Contains the termination result, sequencing request, and validity
 */
export interface TerminationRequestResult {
  terminationRequest: SequencingRequestType;
  sequencingRequest: SequencingRequestType | null;
  exception: string | null;
  valid: boolean;
}

/**
 * Overall Sequencing Process (OP.1)
 * Controls the overall execution of the sequencing loop
 */
/**
 * Interface for CMI data provided to sequencing process for RTE data transfer
 */
export interface CMIDataForTransfer {
  completion_status?: string;
  success_status?: string;
  score?: {
    scaled?: string;
    raw?: string;
    min?: string;
    max?: string;
  };
  progress_measure?: string;
  objectives?: Array<{
    id: string;
    success_status?: string;
    completion_status?: string;
    score?: {
      scaled?: string;
      raw?: string;
      min?: string;
      max?: string;
    };
    progress_measure?: string;
  }>;
}

export class OverallSequencingProcess {
  private static readonly HIDE_LMS_UI_ORDER: HideLmsUiItem[] = [...HIDE_LMS_UI_TOKENS];
  private activityTree: ActivityTree;
  private sequencingProcess: SequencingProcess;
  private rollupProcess: RollupProcess;
  private adlNav: ADLNav | null;
  private contentDelivered: boolean = false;
  private _deliveryInProgress: boolean = false; // Tracks when we're in contentDeliveryEnvironmentProcess
  private eventCallback: ((eventType: string, data?: any) => void) | null = null;
  private globalObjectiveMap: Map<string, any> = new Map();
  private now: () => Date;
  private enhancedDeliveryValidation: boolean;
  private defaultHideLmsUi: HideLmsUiItem[];
  private defaultAuxiliaryResources: AuxiliaryResource[];
  private getCMIData: (() => CMIDataForTransfer) | null = null;
  private is4thEdition: boolean = false;

  constructor(
    activityTree: ActivityTree,
    sequencingProcess: SequencingProcess,
    rollupProcess: RollupProcess,
    adlNav: ADLNav | null = null,
    eventCallback: ((eventType: string, data?: any) => void) | null = null,
    options?: {
      now?: () => Date;
      enhancedDeliveryValidation?: boolean;
      defaultHideLmsUi?: HideLmsUiItem[];
      defaultAuxiliaryResources?: AuxiliaryResource[];
      getCMIData?: () => CMIDataForTransfer;
      is4thEdition?: boolean;
    }
  ) {
    this.activityTree = activityTree;
    this.sequencingProcess = sequencingProcess;
    this.rollupProcess = rollupProcess;
    this.adlNav = adlNav;
    this.eventCallback = eventCallback;
    this.now = options?.now || (() => new Date());
    this.enhancedDeliveryValidation = options?.enhancedDeliveryValidation === true;
    this.defaultHideLmsUi = options?.defaultHideLmsUi ? [...options.defaultHideLmsUi] : [];
    this.defaultAuxiliaryResources = options?.defaultAuxiliaryResources
      ? options.defaultAuxiliaryResources.map((resource) => ({ ...resource }))
      : [];
    this.getCMIData = options?.getCMIData || null;
    this.is4thEdition = options?.is4thEdition || false;

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
      const hadSequencingRequest = !!navResult.sequencingRequest;
      const termResult = this.terminationRequestProcess(navResult.terminationRequest, hadSequencingRequest);
      if (!termResult.valid) {
        return new DeliveryRequest(false, null, termResult.exception || "TB.2.3-1");
      }

      // Per TB.2.3 Step 3.6/4.5: Post-condition sequencing request overrides navigation request
      // Only override if:
      // 1. There was a navigation sequencing request to override, OR
      // 2. Post-condition returned a navigation request (CONTINUE, RETRY, PREVIOUS) not a cleanup request (EXIT)
      if (termResult.sequencingRequest !== null) {
        if (hadSequencingRequest || termResult.sequencingRequest !== SequencingRequestType.EXIT) {
          navResult.sequencingRequest = termResult.sequencingRequest;
        }
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

      // OP.1 step 1.4.3: Check if sequencing session should end
      if (seqResult.endSequencingSession) {
        this.fireEvent("onSequencingSessionEnd", {
          reason: "end_of_content",
          exception: seqResult.exception,
          navigationRequest: navigationRequest
        });

        // Return delivery request indicating session end
        return new DeliveryRequest(false, null, seqResult.exception || "SESSION_ENDED");
      }

      if (seqResult.exception) {
        return new DeliveryRequest(false, null, seqResult.exception);
      }

      if (seqResult.deliveryRequest === DeliveryRequestType.DELIVER && seqResult.targetActivity) {
        // INTEGRATION: Validate rollup state consistency before delivery
        if (this.activityTree.root) {
          const isConsistent = this.rollupProcess.validateRollupStateConsistency(this.activityTree.root);
          if (!isConsistent) {
            this.fireEvent("onSequencingDebug", {
              message: "Rollup state inconsistency detected before delivery",
              activityId: this.activityTree.root.id
            });
          }
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

      case NavigationRequestType.CONTINUE: {
        if (!currentActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-4");
        }
        if (!currentActivity.parent || !currentActivity.parent.sequencingControls.flow) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-5");
        }

        // Per NB.2.1 Step 3.2.1: Only terminate if current activity is active
        const continueTerminationRequest = currentActivity.isActive
          ? SequencingRequestType.EXIT
          : null;

        return new NavigationRequestResult(
          true,
          continueTerminationRequest,
          SequencingRequestType.CONTINUE,
          null
        );
      }

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

        // Per NB.2.1 Step 4.2.1.1: Only terminate if current activity is active
        const previousTerminationRequest = currentActivity.isActive
          ? SequencingRequestType.EXIT
          : null;

        return new NavigationRequestResult(
          true,
          previousTerminationRequest,
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

        // Per NB.2.1 Step 7.1.1.4: Only return EXIT if current activity is active
        return new NavigationRequestResult(
          true,
          currentActivity?.isActive ? SequencingRequestType.EXIT : null,
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
   * Processes termination requests with post-condition loop for EXIT_PARENT handling
   * GAP-02: Implements missing post-condition loop per SCORM 2004 3rd Edition TB.2.3
   * @param {SequencingRequestType} request - The termination request
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @return {TerminationRequestResult} - Termination result with sequencing request
   */
  private terminationRequestProcess(
    request: SequencingRequestType,
    hasSequencingRequest: boolean = false
  ): TerminationRequestResult {
    const currentActivity = this.activityTree.currentActivity;

    if (!currentActivity) {
      return {
        terminationRequest: request,
        sequencingRequest: null,
        exception: "TB.2.3-1",
        valid: false
      };
    }

    // TB.2.3-2: Check if trying to terminate already-terminated activity
    if ((request === SequencingRequestType.EXIT ||
        request === SequencingRequestType.ABANDON) &&
      !currentActivity.isActive) {
      return {
        terminationRequest: request,
        sequencingRequest: null,
        exception: "TB.2.3-2",
        valid: false
      };
    }

    // Enhanced logging for debugging
    this.fireEvent("onTerminationRequestProcessing", {
      request,
      hasSequencingRequest,
      currentActivity: currentActivity.id
    });

    // Handle different termination types
    switch (request) {
      case SequencingRequestType.EXIT:
        return this.handleExitTermination(currentActivity, hasSequencingRequest);

      case SequencingRequestType.EXIT_ALL:
        return this.handleExitAllTermination(currentActivity);

      case SequencingRequestType.ABANDON:
        return this.handleAbandonTermination(currentActivity, hasSequencingRequest);

      case SequencingRequestType.ABANDON_ALL:
        return this.handleAbandonAllTermination(currentActivity);

      case SequencingRequestType.SUSPEND_ALL:
        return this.handleSuspendAllTermination(currentActivity);

      default:
        return {
          terminationRequest: request,
          sequencingRequest: null,
          exception: "TB.2.3-7",
          valid: false
        };
    }
  }

  /**
   * Handle EXIT termination with post-condition loop (TB.2.3 step 3)
   * GAP-02: Implements the do-while loop for EXIT_PARENT cascading
   * @param {Activity} currentActivity - The current activity
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @return {TerminationRequestResult} - The termination result
   */
  private handleExitTermination(
    currentActivity: Activity,
    hasSequencingRequest: boolean
  ): TerminationRequestResult {
    // TB.2.3 step 3.0: For cluster activities, terminate descendant attempts first
    if (currentActivity.children.length > 0) {
      this.terminateDescendentAttemptsProcess(currentActivity);
    }

    // TB.2.3 step 3.1: Apply End Attempt Process
    this.endAttemptProcess(currentActivity);

    // TB.2.3 step 3.2: Apply Sequencing Exit Action Rules Subprocess
    const exitActionResult = this.enhancedExitActionRulesSubprocess(currentActivity);
    if (exitActionResult.action === "EXIT_ALL") {
      // Exit action changed termination to EXIT_ALL
      return this.handleExitAllTermination(currentActivity);
    } else if (exitActionResult.action === "EXIT_PARENT") {
      // Exit action requests exit from parent
      if (currentActivity.parent) {
        // Move to parent and end its attempt
        this.activityTree.currentActivity = currentActivity.parent;
        this.endAttemptProcess(this.activityTree.currentActivity);
      }
      // Continue to post-condition evaluation on the new current activity (parent or original)
    }

    // TB.2.3 step 3.3: POST-CONDITION LOOP
    let processedExit = false;
    let postConditionResult: import("./sequencing_process").PostConditionResult;

    do {
      // TB.2.3 step 3.3.1: Set processedExit to false
      processedExit = false;

      // TB.2.3 step 3.3.2: Apply Sequencing Post Condition Rules Subprocess
      postConditionResult = this.integratePostConditionRulesSubprocess(
        this.activityTree.currentActivity || currentActivity
      );

      // TB.2.3 step 3.3.3: If returns EXIT_ALL, change termination type and break
      if (postConditionResult.terminationRequest === SequencingRequestType.EXIT_ALL) {
        this.fireEvent("onPostConditionExitAll", {
          activity: (this.activityTree.currentActivity || currentActivity).id
        });
        return this.handleExitAllTermination(this.activityTree.root!);
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
            valid: false
          };
        } else {
          // TB.2.3 step 3.3.4.1: Move to parent
          this.activityTree.currentActivity = current.parent;

          // TB.2.3 step 3.3.4.1.2: Apply End Attempt Process to parent
          this.endAttemptProcess(this.activityTree.currentActivity);

          // TB.2.3 step 3.3.4.1.3: Set processedExit = true to continue loop
          processedExit = true;

          this.fireEvent("onPostConditionExitParent", {
            fromActivity: current.id,
            toActivity: this.activityTree.currentActivity.id
          });
        }
      }

      // TB.2.3 step 3.3.5: Check if at root without retry
      const atRoot = (this.activityTree.currentActivity || currentActivity) === this.activityTree.root;
      if (atRoot && postConditionResult.sequencingRequest !== SequencingRequestType.RETRY) {
        // Return EXIT sequencing request (ends session)
        return {
          terminationRequest: SequencingRequestType.EXIT,
          sequencingRequest: SequencingRequestType.EXIT,
          exception: null,
          valid: true
        };
      }

    } while (processedExit);

    // TB.2.3 step 3.6: Return sequencing request from post-condition
    // Move to parent if no sequencing request follows (neither original nor post-condition)
    if (!hasSequencingRequest && !postConditionResult.sequencingRequest) {
      const current = this.activityTree.currentActivity || currentActivity;
      if (current.parent) {
        // Set parent as current without using setter (which would auto-activate)
        // The parent should remain inactive if it was terminated by the EXIT_PARENT cascade
        (this.activityTree as any)._currentActivity = current.parent;
      }
    }

    return {
      terminationRequest: SequencingRequestType.EXIT,
      sequencingRequest: postConditionResult.sequencingRequest,
      exception: null,
      valid: true
    };
  }

  /**
   * Handle EXIT_ALL termination (TB.2.3 step 4)
   * @param {Activity} currentActivity - The current activity
   * @return {TerminationRequestResult} - The termination result
   */
  private handleExitAllTermination(currentActivity: Activity): TerminationRequestResult {
    // TB.2.3 step 4.1: Terminate descendant attempts from root
    if (this.activityTree.root) {
      this.handleMultiLevelExitActions(this.activityTree.root);
    }

    // TB.2.3 step 4.2: End attempt on root
    if (this.activityTree.root) {
      this.endAttemptProcess(this.activityTree.root);
    }

    // TB.2.3 step 4.3: Clear current activity
    this.activityTree.currentActivity = null;

    // Clean up suspended activities
    this.performComplexSuspendedActivityCleanup();

    // TB.2.3 step 4.4: Return EXIT sequencing request (ends session)
    return {
      terminationRequest: SequencingRequestType.EXIT_ALL,
      sequencingRequest: SequencingRequestType.EXIT,
      exception: null,
      valid: true
    };
  }

  /**
   * Handle ABANDON termination (TB.2.3 step 6)
   * @param {Activity} currentActivity - The current activity
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @return {TerminationRequestResult} - The termination result
   */
  private handleAbandonTermination(
    currentActivity: Activity,
    hasSequencingRequest: boolean
  ): TerminationRequestResult {
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
      valid: true
    };
  }

  /**
   * Handle ABANDON_ALL termination (TB.2.3 step 7)
   * @param {Activity} currentActivity - The current activity
   * @return {TerminationRequestResult} - The termination result
   */
  private handleAbandonAllTermination(currentActivity: Activity): TerminationRequestResult {
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
        valid: false
      };
    }

    // TB.2.3 step 7.3: For each activity in the activity path, set not active
    for (const activity of activityPath) {
      activity.isActive = false;
    }

    // TB.2.3 step 7.4: Clear current activity
    this.activityTree.currentActivity = null;

    // Clean up suspended activities
    this.performComplexSuspendedActivityCleanup();

    return {
      terminationRequest: SequencingRequestType.ABANDON_ALL,
      sequencingRequest: null,
      exception: null,
      valid: true
    };
  }

  /**
   * Handle SUSPEND_ALL termination (TB.2.3 step 5)
   * Implements TB.2.3 steps 5.1-5.7 for SUSPEND_ALL processing
   * @param {Activity} currentActivity - The current activity
   * @return {TerminationRequestResult} - The termination result
   */
  private handleSuspendAllTermination(currentActivity: Activity): TerminationRequestResult {
    // TB.2.3 steps 5.1-5.6: Suspend current activity and all ancestors, set current to root
    const suspendResult = this.handleSuspendAllRequest(currentActivity);

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
      valid: true
    };
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
   * @return {import("./sequencing_process").PostConditionResult} - Post-condition result with sequencing and termination requests
   */
  private integratePostConditionRulesSubprocess(activity: Activity): import("./sequencing_process").PostConditionResult {
    // Evaluate post-condition rules using the sequencing process
    const postResult = this.sequencingProcess.evaluatePostConditionRules(activity);

    if (postResult.sequencingRequest || postResult.terminationRequest) {
      // Log the post-condition action for tracking
      this.fireEvent("onPostConditionEvaluated", {
        activity: activity.id,
        sequencingRequest: postResult.sequencingRequest,
        terminationRequest: postResult.terminationRequest,
        timestamp: new Date().toISOString()
      });
    }

    return postResult;
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
   * Implements TB.2.3 steps 5.1-5.6 from SCORM 2004 reference
   * Suspends all activities in the path from current activity to root
   * @param {Activity} currentActivity - Current activity to suspend
   * @return {TerminationRequestResult} - Result with validation status
   */
  private handleSuspendAllRequest(currentActivity: Activity): TerminationRequestResult {
    const rootActivity = this.activityTree.root;

    // TB.2.3 5.1: Validation - Check if current activity is defined
    if (!currentActivity || !rootActivity) {
      this.fireEvent("onSuspendError", {
        exception: "TB.2.3-1",
        message: "No current activity to suspend",
        activity: currentActivity?.id
      });
      return {
        terminationRequest: SequencingRequestType.SUSPEND_ALL,
        sequencingRequest: null,
        exception: "TB.2.3-1",
        valid: false
      };
    }

    // TB.2.3-3: Check if trying to suspend inactive/unsuspended root activity
    if (currentActivity === rootActivity && !currentActivity.isActive && !currentActivity.isSuspended) {
      this.fireEvent("onSuspendError", {
        exception: "TB.2.3-3",
        message: "Nothing to suspend (root activity)",
        activity: currentActivity.id
      });
      return {
        terminationRequest: SequencingRequestType.SUSPEND_ALL,
        sequencingRequest: null,
        exception: "TB.2.3-3",
        valid: false
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
        activity: suspendedActivity?.id
      });
      return {
        terminationRequest: SequencingRequestType.SUSPEND_ALL,
        sequencingRequest: null,
        exception: "TB.2.3-5",
        valid: false
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
      suspendedPath: activityPath.map(a => a.id),
      pathLength: activityPath.length,
      timestamp: new Date().toISOString()
    });

    // Return success
    return {
      terminationRequest: SequencingRequestType.SUSPEND_ALL,
      sequencingRequest: null,
      exception: null,
      valid: true
    };
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

    // DB.1.1 Step 2: Form the activity path from root to target, inclusive
    const activityPath = this.getActivityPath(activity, true);

    // DB.1.1 Step 3: Check if path is empty (shouldn't happen with valid tree but per spec)
    if (activityPath.length === 0) {
      return new DeliveryRequest(false, null, "DB.1.1-2");
    }

    // DB.1.1 Step 4: For each activity in the path, apply Check Activity Process (UP.5)
    // This ensures no ancestor violates limit conditions, preconditions, or is disabled
    for (const pathActivity of activityPath) {
      // Check Activity Process returns true if activity is VALID
      if (!this.checkActivityProcess(pathActivity)) {
        // Activity check failed - cannot deliver
        return new DeliveryRequest(false, null, "DB.1.1-3");
      }
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
    // Mark that delivery is in progress to prevent re-entrant termination requests
    // This handles the case where the old content's unload handler fires during delivery
    // and calls Terminate, which would otherwise re-terminate the newly delivered activity
    this._deliveryInProgress = true;

    try {
      // Step 1: Check if we're resuming before clearing suspended state
      // Capture suspended state of delivered activity BEFORE clearSuspendedActivitySubprocess
      const isResuming = activity.isSuspended;

      // Step 2: Clear Suspended Activity Subprocess (DB.2.1) if needed
      // Clear suspended state whether we're resuming the suspended activity
      // or delivering a different activity (abandoning the suspended session)
      if (this.activityTree.suspendedActivity) {
        this.clearSuspendedActivitySubprocess();
      }

      // Step 3: Process activity path and initialize tracking data (DB.2.2)
      // Get the full path from root to delivered activity
      const activityPath = this.getActivityPath(activity, true);

      // Process each activity in the path (root to leaf)
      for (const pathActivity of activityPath) {
        // Only process activities that are not already active
        if (!pathActivity.isActive) {
          if (isResuming || pathActivity.isSuspended) {
            // Resuming: clear suspended flag but don't increment attempt
            pathActivity.isSuspended = false;
          } else {
            // New attempt: increment attempt count
            pathActivity.incrementAttemptCount();
          }
          pathActivity.isActive = true;

          // Step 3.1: Apply selection and randomization per SCORM 2004 3rd Edition DB.2
          // (GAP-17: Randomization at specification-required process points)
          // This occurs after activity.isActive is set and attempt count is incremented
          SelectionRandomization.applySelectionAndRandomization(pathActivity, pathActivity.attemptCount <= 1);
        }
      }

      // Step 4: Set the activity as current
      this.activityTree.currentActivity = activity;

      // Step 5: Initialize attempt for the delivered activity
      this.initializeActivityForDelivery(activity);

      // Step 6: Set up activity attempt tracking information
      this.setupActivityAttemptTracking(activity);

      // Step 7: Mark that content has been delivered
      this.contentDelivered = true;

      // Step 8: Update navigation validity if ADL nav is available
      if (this.adlNav) {
        this.updateNavigationValidity();
      }

      // Step 9: Fire activity delivery event
      this.fireActivityDeliveryEvent(activity);
    } finally {
      // Clear delivery in progress flag
      this._deliveryInProgress = false;
    }
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
    // Note: Attempt count is now incremented in contentDeliveryEnvironmentProcess
    // during activity path processing, so we don't increment it here

    activity.wasSkipped = false;

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

    // GAP-19: Transfer RTE data to activity state BEFORE auto-completion logic
    // This ensures that CMI data set by content is properly transferred to activity objectives
    this.transferRteDataToActivity(activity);

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
                timestamp: new Date().toISOString()
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
                  timestamp: new Date().toISOString()
                });
              }
            }
          }
        }
      }
    } else {
      // [UP.4]2. Else (The activity has children)
      // [UP.4]2.1. Update suspended status based on children
      const hasSuspendedChildren = activity.children.some(child => child.isSuspended);
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

    // INTEGRATION: Process global objective mapping after activity completion
    const mappingRoot = this.activityTree.root || activity;
    this.rollupProcess.processGlobalObjectiveMapping(mappingRoot, this.globalObjectiveMap);

    // Trigger rollup from this activity
    this.rollupProcess.overallRollupProcess(activity);

    // INTEGRATION: Validate rollup state consistency after rollup
    if (this.activityTree.root) {
      this.rollupProcess.validateRollupStateConsistency(this.activityTree.root);
    }

    // Apply selection and randomization per SCORM 2004 3rd Edition UP.4
    // (GAP-17: Randomization at specification-required process points)
    // This occurs after rollup processing completes
    SelectionRandomization.applySelectionAndRandomization(activity, false);
  }

  /**
   * GAP-19: Transfer RTE Data to Activity (Full Implementation)
   * Transfers ALL CMI data from runtime environment to activity state
   * Called at the start of endAttemptProcess to ensure proper data transfer
   *
   * This implements:
   * - Primary objective data transfer (completion, success, score)
   * - Non-primary objective data transfer by ID matching
   * - Change tracking to prevent overwriting global objectives
   * - Score normalization (ScaleRawScore)
   * - 4th Edition specific handling
   *
   * @param {Activity} activity - The activity to transfer data to
   */
  private transferRteDataToActivity(activity: Activity): void {
    if (!this.getCMIData) {
      // No CMI data provider, skip transfer
      return;
    }

    const cmiData = this.getCMIData();
    if (!cmiData) {
      return;
    }

    // Transfer primary objective data (cmi.* level)
    this.transferPrimaryObjectiveData(activity, cmiData);

    // Transfer non-primary objectives (cmi.objectives[n])
    this.transferNonPrimaryObjectiveData(activity, cmiData);

    this.fireEvent("onRteDataTransfer", {
      activityId: activity.id,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Transfer primary objective data from CMI to activity
   * @param {Activity} activity - The activity to transfer data to
   * @param {CMIDataForTransfer} cmiData - CMI data from runtime
   */
  private transferPrimaryObjectiveData(activity: Activity, cmiData: CMIDataForTransfer): void {
    // Transfer completion status
    if (cmiData.completion_status && cmiData.completion_status !== "unknown") {
      activity.completionStatus = cmiData.completion_status as CompletionStatus;
      activity.attemptProgressStatus = true;
    }

    // Transfer success status
    if (cmiData.success_status && cmiData.success_status !== "unknown") {
      const successStatus = cmiData.success_status === "passed";
      activity.objectiveSatisfiedStatus = successStatus;
      activity.successStatus = cmiData.success_status as "passed" | "failed" | "unknown";

      if (activity.primaryObjective) {
        activity.primaryObjective.satisfiedStatus = successStatus;
        activity.primaryObjective.progressStatus = true;
      }
    }

    // Transfer score (with normalization support)
    if (cmiData.score) {
      const normalizedScore = this.normalizeScore(cmiData.score);
      if (normalizedScore !== null) {
        activity.objectiveNormalizedMeasure = normalizedScore;
        activity.objectiveMeasureStatus = true;

        if (activity.primaryObjective) {
          activity.primaryObjective.normalizedMeasure = normalizedScore;
          activity.primaryObjective.measureStatus = true;
        }
      }
    }

    // Transfer progress measure
    if (cmiData.progress_measure && cmiData.progress_measure !== "") {
      const progressMeasure = parseFloat(cmiData.progress_measure);
      if (!isNaN(progressMeasure)) {
        activity.progressMeasure = progressMeasure;
        activity.progressMeasureStatus = true;

        if (activity.primaryObjective) {
          activity.primaryObjective.progressMeasure = progressMeasure;
          activity.primaryObjective.progressMeasureStatus = true;
        }
      }
    }
  }

  /**
   * Transfer non-primary objective data from CMI to activity objectives
   * Only transfers changed values to protect global objectives
   * @param {Activity} activity - The activity to transfer data to
   * @param {CMIDataForTransfer} cmiData - CMI data from runtime
   */
  private transferNonPrimaryObjectiveData(activity: Activity, cmiData: CMIDataForTransfer): void {
    if (!cmiData.objectives || cmiData.objectives.length === 0) {
      return;
    }

    for (const cmiObjective of cmiData.objectives) {
      if (!cmiObjective.id) {
        continue;
      }

      // Find matching activity objective by ID
      const activityObjectiveMatch = activity.getObjectiveById(cmiObjective.id);
      if (!activityObjectiveMatch || activityObjectiveMatch.isPrimary) {
        // Skip if not found or if it's the primary objective (already handled)
        continue;
      }

      const activityObjective = activityObjectiveMatch.objective;

      // Transfer success status (only if changed during runtime)
      if (cmiObjective.success_status && cmiObjective.success_status !== "unknown") {
        const successStatus = cmiObjective.success_status === "passed";
        activityObjective.satisfiedStatus = successStatus;
        activityObjective.progressStatus = true;
      }

      // Transfer completion status
      if (cmiObjective.completion_status && cmiObjective.completion_status !== "unknown") {
        activityObjective.completionStatus = cmiObjective.completion_status as CompletionStatus;
      }

      // Transfer score (with normalization)
      if (cmiObjective.score) {
        const normalizedScore = this.normalizeScore(cmiObjective.score);
        if (normalizedScore !== null) {
          activityObjective.normalizedMeasure = normalizedScore;
          activityObjective.measureStatus = true;
        }
      }

      // Transfer progress measure
      if (cmiObjective.progress_measure && cmiObjective.progress_measure !== "") {
        const progressMeasure = parseFloat(cmiObjective.progress_measure);
        if (!isNaN(progressMeasure)) {
          activityObjective.progressMeasure = progressMeasure;
          activityObjective.progressMeasureStatus = true;
        }
      }
    }
  }

  /**
   * Normalize score from raw/min/max if scaled is not available
   * Implements ScaleRawScore process
   * @param {Object} score - Score object with scaled, raw, min, max
   * @return {number | null} - Normalized score or null if cannot normalize
   */
  private normalizeScore(score: {
    scaled?: string;
    raw?: string;
    min?: string;
    max?: string;
  }): number | null {
    // If scaled score exists, use it directly
    if (score.scaled && score.scaled !== "") {
      const scaled = parseFloat(score.scaled);
      if (!isNaN(scaled)) {
        return scaled;
      }
    }

    // If no scaled score, try to calculate from raw/min/max
    if (score.raw && score.raw !== "" &&
      score.min && score.min !== "" &&
      score.max && score.max !== "") {
      const raw = parseFloat(score.raw);
      const min = parseFloat(score.min);
      const max = parseFloat(score.max);

      if (!isNaN(raw) && !isNaN(min) && !isNaN(max) && max > min) {
        // ScaleRawScore formula: scaled = (raw - min) / (max - min)
        const normalized = (raw - min) / (max - min);

        // Clamp to [-1, 1] range per SCORM spec
        return Math.max(-1, Math.min(1, normalized));
      }
    }

    return null;
  }

  /**
   * Update navigation validity in ADL nav
   * Called after activity delivery and after rollup to update navigation button states
   */
  public updateNavigationValidity(): void {
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
    try {
      this.adlNav.request_valid.choice = choiceMap;
    } catch (e) {
      // Ignore read-only constraints on nav request_valid during runtime
    }
    try {
      this.adlNav.request_valid.jump = jumpMap;
    } catch (e) {
      // Ignore read-only constraints on nav request_valid during runtime
    }
    // Notify listeners so LMS can update UI regardless of read-only state
    this.fireEvent("onNavigationValidityUpdate", {
      continue: continueResult.valid,
      previous: previousResult.valid,
      choice: choiceMap,
      jump: jumpMap,
      hideLmsUi: this.getEffectiveHideLmsUi(this.activityTree.currentActivity)
    });
  }

  /**
   * Synchronize global objectives from activity states
   * Called after CMI changes that affect objective status to update global objective mappings
   * This ensures that preconditions based on global objectives are properly evaluated
   */
  public synchronizeGlobalObjectives(): void {
    if (!this.activityTree.root) {
      return;
    }

    // Process global objective mapping from root to synchronize all activities
    this.rollupProcess.processGlobalObjectiveMapping(this.activityTree.root, this.globalObjectiveMap);
  }

  private getEffectiveHideLmsUi(activity: Activity | null): HideLmsUiItem[] {
    const seen = new Set<HideLmsUiItem>();

    for (const directive of this.defaultHideLmsUi) {
      seen.add(directive);
    }

    let current: Activity | null = activity;
    while (current) {
      for (const directive of current.hideLmsUi) {
        seen.add(directive);
      }
      current = current.parent;
    }

    return OverallSequencingProcess.HIDE_LMS_UI_ORDER.filter((directive) => seen.has(directive));
  }

  private getEffectiveAuxiliaryResources(activity: Activity | null): AuxiliaryResource[] {
    const merged = new Map<string, AuxiliaryResource>();

    for (const resource of this.defaultAuxiliaryResources) {
      if (resource.resourceId) {
        merged.set(resource.resourceId, { ...resource });
      }
    }

    const lineage: Activity[] = [];
    let current: Activity | null = activity;
    while (current) {
      lineage.push(current);
      current = current.parent;
    }

    for (const node of lineage.reverse()) {
      for (const resource of node.auxiliaryResources) {
        if (resource.resourceId) {
          merged.set(resource.resourceId, { ...resource });
        }
      }
    }

    return Array.from(merged.values());
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
   * Check if content delivery is currently in progress
   * Used to prevent re-entrant termination requests during delivery
   */
  public isDeliveryInProgress(): boolean {
    return this._deliveryInProgress;
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
   * Get Activity Path (Helper for DB.1.1)
   * Forms the activity path from root to target activity, inclusive
   * @param {Activity} activity - The target activity
   * @param {boolean} includeActivity - Whether to include the target in the path
   * @return {Activity[]} - Array of activities from root to target
   */
  private getActivityPath(activity: Activity, includeActivity: boolean = true): Activity[] {
    const path: Activity[] = [];
    let current: Activity | null = activity;

    // Walk up from target to root
    while (current !== null) {
      path.unshift(current);  // Add to beginning of array
      current = current.parent;
    }

    // Remove target activity if not included
    if (!includeActivity && path.length > 0) {
      path.pop();
    }

    return path;
  }

  /**
   * Check Activity Process (UP.5)
   * Validates if an activity can be delivered based on sequencing rules and limit conditions
   * Note: Cluster/leaf validation is handled in DB.1.1 Step 1, not here
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if activity is valid (not disabled, limits not violated)
   */
  private checkActivityProcess(activity: Activity): boolean {
    // UP.5 Step 1-2: Check if activity is disabled by sequencing rules
    // In scorm-again, isAvailable serves as the proxy for disabled status
    if (!activity.isAvailable) {
      return false;
    }

    // UP.5 Step 3-4: Check limit conditions (UP.1)
    if (!this.limitConditionsCheckProcess(activity)) {
      return false;
    }

    // Note: We intentionally do NOT check isHiddenFromChoice or cluster status here
    // - isHiddenFromChoice is validated in navigation/choice processes
    // - Cluster validation is handled in DB.1.1 Step 1 (only target activity)

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
      navigationState: this.getNavigationState(),
      globalObjectiveMap: this.serializeGlobalObjectiveMap()
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

      // Restore global objective map before applying local state so reads use persisted data
      if (state.globalObjectiveMap) {
        this.restoreGlobalObjectiveMap(state.globalObjectiveMap);
      }

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

      // Re-run global objective synchronization to ensure map and activities align after restore
      if (this.activityTree.root) {
        this.rollupProcess.processGlobalObjectiveMapping(this.activityTree.root, this.globalObjectiveMap);
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
        isHiddenFromChoice: activity.isHiddenFromChoice,
        location: activity.location,
        attemptAbsoluteStartTime: activity.attemptAbsoluteStartTime,
        objectives: activity.getObjectiveStateSnapshot(),
        auxiliaryResources: activity.auxiliaryResources,
        selectionRandomizationState: {
          selectionCountStatus: activity.sequencingControls.selectionCountStatus,
          reorderChildren: activity.sequencingControls.reorderChildren,
          childOrder: activity.children.map((child) => child.id),
          selectedChildIds: activity.children
            .filter((child) => child.isAvailable)
            .map((child) => child.id),
          hiddenFromChoiceChildIds: activity.children
            .filter((child) => child.isHiddenFromChoice)
            .map((child) => child.id)
        }
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
        activity.isHiddenFromChoice = state.isHiddenFromChoice === true;
        activity.location = state.location || "";
        activity.attemptAbsoluteStartTime = state.attemptAbsoluteStartTime || null;
        if (Array.isArray(state.auxiliaryResources)) {
          activity.auxiliaryResources = state.auxiliaryResources;
        }
        if (state.objectives) {
          activity.applyObjectiveStateSnapshot(state.objectives);
        }
      }

      // Recursively restore children
      for (const child of activity.children) {
        restoreActivity(child);
      }

      if (state?.selectionRandomizationState) {
        const selectionState = state.selectionRandomizationState;
        const sequencingControls = activity.sequencingControls;

        if (selectionState.selectionCountStatus !== undefined) {
          sequencingControls.selectionCountStatus = selectionState.selectionCountStatus;
        }

        if (selectionState.reorderChildren !== undefined) {
          sequencingControls.reorderChildren = selectionState.reorderChildren;
        }

        if (selectionState.childOrder && selectionState.childOrder.length > 0) {
          activity.setChildOrder(selectionState.childOrder);
        }

        const selectedSet = Array.isArray(selectionState.selectedChildIds)
          ? new Set(selectionState.selectedChildIds)
          : null;
        const hiddenSet = Array.isArray(selectionState.hiddenFromChoiceChildIds)
          ? new Set(selectionState.hiddenFromChoiceChildIds)
          : null;

        if (selectedSet || hiddenSet) {
          for (const child of activity.children) {
            if (selectedSet) {
              const isSelected = selectedSet.has(child.id);
              child.isAvailable = isSelected;
              if (!hiddenSet) {
                child.isHiddenFromChoice = !isSelected;
              }
            }

            if (hiddenSet) {
              child.isHiddenFromChoice = hiddenSet.has(child.id);
            }
          }
        }

        activity.setProcessedChildren(activity.children.filter((child) => child.isAvailable));
      } else {
        activity.resetProcessedChildren();
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
      },
      hideLmsUi: this.getEffectiveHideLmsUi(this.activityTree.currentActivity),
      auxiliaryResources: this.getEffectiveAuxiliaryResources(this.activityTree.currentActivity)
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
   * @param {Activity | null} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity for choice
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateComplexChoicePath(currentActivity: Activity | null, targetActivity: Activity): {
    valid: boolean,
    exception: string | null
  } {
    // Check if target is hidden from choice or otherwise unavailable
    if (targetActivity.isHiddenFromChoice) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Check if target is disabled (pre-condition rules, availability, etc.)
    if (this.isActivityDisabled(targetActivity)) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    if (currentActivity) {
      const commonAncestor = this.findCommonAncestor(currentActivity, targetActivity);
      if (!commonAncestor) {
        return { valid: false, exception: "NB.2.1-11" };
      }

      // Validate choiceExit controls along the current activity path
      // Per NB.2.1 Step 7.1.1.2.3.1: Only check active ancestors from current to common ancestor (exclusive)
      let node: Activity | null = currentActivity;
      while (node && node !== commonAncestor) {
        // Only validate choiceExit if the activity is active
        if (node.isActive === true && node.sequencingControls && node.sequencingControls.choiceExit === false) {
          if (targetActivity !== node && !this.activityContains(node, targetActivity)) {
            return { valid: false, exception: "NB.2.1-11" };
          }
        }
        node = node.parent;
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
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @param {Activity} commonAncestor - Common ancestor
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateConstrainChoiceControls(currentActivity: Activity, targetActivity: Activity, commonAncestor: Activity): {
    valid: boolean,
    exception: string | null
  } {
    // Check constrainChoice at the common ancestor and above in the path
    let ancestor: Activity | null = commonAncestor;
    while (ancestor) {
      if (ancestor.sequencingControls?.constrainChoice || ancestor.sequencingControls?.preventActivation) {
        const currentBranch = this.findChildContaining(ancestor, currentActivity);
        if (!currentBranch) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        if (targetActivity === ancestor) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        const targetBranch = this.findChildContaining(ancestor, targetActivity);
        if (!targetBranch) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        if (ancestor.sequencingControls?.constrainChoice && targetBranch !== currentBranch) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        if (ancestor.sequencingControls?.preventActivation && targetBranch !== currentBranch) {
          if (this.requiresNewActivation(targetBranch, targetActivity)) {
            return { valid: false, exception: "NB.2.1-11" };
          }
        }
      }

      ancestor = ancestor.parent;
    }

    return this.validateAncestorConstraints(commonAncestor, currentActivity, targetActivity);
  }

  /**
   * Validate Choice Set Constraints
   * Validates choice sets with multiple targets
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
    // Ensure the target is contained within the common ancestor's subtree
    if (!this.activityContains(commonAncestor, targetActivity) && targetActivity !== commonAncestor) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Walk from target up to (but not including) the common ancestor ensuring availability
    let node: Activity | null = targetActivity;
    while (node && node !== commonAncestor) {
      if (!node.isAvailable || node.isHiddenFromChoice || this.isActivityDisabled(node)) {
        return { valid: false, exception: "NB.2.1-11" };
      }
      node = node.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Check if activity is disabled
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if disabled
   */
  private isActivityDisabled(activity: Activity): boolean {
    if (!activity.isAvailable) {
      return true;
    }

    if (activity.isHiddenFromChoice) {
      return true;
    }

    const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
    if (!preConditionResult) {
      return false;
    }

    return (
      preConditionResult === RuleActionType.DISABLED ||
      preConditionResult === RuleActionType.HIDE_FROM_CHOICE ||
      preConditionResult === RuleActionType.STOP_FORWARD_TRAVERSAL ||
      preConditionResult === "DISABLED" ||
      preConditionResult === "HIDDEN_FROM_CHOICE" ||
      preConditionResult === "STOP_FORWARD_TRAVERSAL"
    );
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

    const traversalStopIndex = children.findIndex((child) => child?.sequencingControls.stopForwardTraversal);

    // Current branch flagged stopForwardTraversal blocks moving past it
    if (
      currentTop.sequencingControls.stopForwardTraversal &&
      targetIndex > currentIndex
    ) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Stop forward traversal on siblings earlier than target also blocks progression
    if (traversalStopIndex !== -1 && targetIndex > traversalStopIndex) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Do not skip mandatory incomplete siblings when moving forward
    if (targetIndex > currentIndex) {
      for (let i = currentIndex + 1; i < targetIndex; i++) {
        const between = children[i];
        if (!between) {
          continue;
        }

        if (between.sequencingControls.stopForwardTraversal) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        if (this.helperIsActivityMandatory(between) && !this.helperIsActivityCompleted(between)) {
          return { valid: false, exception: "NB.2.1-11" };
        }
      }
    }

    return { valid: true, exception: null };
  }

  private requiresNewActivation(branchRoot: Activity, targetActivity: Activity): boolean {
    if (this.branchHasActiveAttempt(branchRoot)) {
      return false;
    }

    if (targetActivity.activityAttemptActive || targetActivity.isActive) {
      return false;
    }

    return true;
  }

  private branchHasActiveAttempt(activity: Activity): boolean {
    if (activity.activityAttemptActive || activity.isActive) {
      return true;
    }

    for (const child of activity.children) {
      if (this.branchHasActiveAttempt(child)) {
        return true;
      }
    }

    return false;
  }

  /** Helper: mandatory activity detection (mirrors SequencingProcess behavior) */
  private helperIsActivityMandatory(activity: Activity): boolean {
    if (!activity.isAvailable || activity.isHiddenFromChoice) {
      return false;
    }

    const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
    if (
      preConditionResult === RuleActionType.SKIP ||
      preConditionResult === RuleActionType.DISABLED ||
      preConditionResult === RuleActionType.HIDE_FROM_CHOICE ||
      preConditionResult === RuleActionType.STOP_FORWARD_TRAVERSAL ||
      preConditionResult === "SKIP" ||
      preConditionResult === "DISABLED" ||
      preConditionResult === "HIDDEN_FROM_CHOICE" ||
      preConditionResult === "STOP_FORWARD_TRAVERSAL"
    ) {
      return false;
    }

    if (this.isActivityDisabled(activity)) {
      return false;
    }

    return (activity as any).mandatory !== false;
  }

  /** Helper: completed-state check (mirrors SequencingProcess behavior) */
  private helperIsActivityCompleted(activity: Activity): boolean {
    if (!activity.isAvailable || activity.isHiddenFromChoice) {
      return true;
    }

    const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
    if (
      preConditionResult === RuleActionType.SKIP ||
      preConditionResult === RuleActionType.DISABLED ||
      preConditionResult === RuleActionType.HIDE_FROM_CHOICE ||
      preConditionResult === RuleActionType.STOP_FORWARD_TRAVERSAL ||
      preConditionResult === "SKIP" ||
      preConditionResult === "DISABLED" ||
      preConditionResult === "HIDDEN_FROM_CHOICE" ||
      preConditionResult === "STOP_FORWARD_TRAVERSAL"
    ) {
      return true;
    }

    if (this.isActivityDisabled(activity)) {
      return true;
    }

    return (
      activity.completionStatus === "completed" ||
      (activity as any).successStatus === "passed" ||
      activity.successStatus === "passed"
    );
  }

  /**
   * Evaluate pre-condition rules for choice navigation
   * @param {Activity} activity - Activity to evaluate
   * @return {string | null} - Rule result or null
   */
  private evaluatePreConditionRulesForChoice(activity: Activity): RuleActionType | string | null {
    if (!activity.sequencingRules) {
      return null;
    }

    const action = activity.sequencingRules.evaluatePreConditionRules(activity);
    if (action) {
      return action;
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
    const objectives = activity.getAllObjectives();

    if (objectives.length === 0) {
      const defaultId = `${activity.id}_default_objective`;
      if (!this.globalObjectiveMap.has(defaultId)) {
        this.globalObjectiveMap.set(defaultId, {
          id: defaultId,
          satisfiedStatus: activity.objectiveSatisfiedStatus,
          satisfiedStatusKnown: activity.objectiveMeasureStatus,
          normalizedMeasure: activity.objectiveNormalizedMeasure,
          normalizedMeasureKnown: activity.objectiveMeasureStatus,
          progressMeasure: activity.progressMeasure,
          progressMeasureKnown: activity.progressMeasureStatus,
          completionStatus: activity.completionStatus,
          completionStatusKnown: activity.completionStatus !== CompletionStatus.UNKNOWN,
          readSatisfiedStatus: true,
          writeSatisfiedStatus: true,
          readNormalizedMeasure: true,
          writeNormalizedMeasure: true,
          readCompletionStatus: true,
          writeCompletionStatus: true,
          readProgressMeasure: true,
          writeProgressMeasure: true,
          satisfiedByMeasure: activity.scaledPassingScore !== null,
          minNormalizedMeasure: activity.scaledPassingScore,
          updateAttemptData: true
        });
      }
    }

    for (const objective of objectives) {
      const mapInfos = objective.mapInfo.length > 0
        ? objective.mapInfo
        : [{
          targetObjectiveID: objective.id,
          readSatisfiedStatus: true,
          writeSatisfiedStatus: true,
          readNormalizedMeasure: true,
          writeNormalizedMeasure: true,
          readProgressMeasure: true,
          writeProgressMeasure: true,
          readCompletionStatus: true,
          writeCompletionStatus: true,
          updateAttemptData: objective.isPrimary
        }];

      for (const mapInfo of mapInfos) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        if (!this.globalObjectiveMap.has(targetId)) {
          this.globalObjectiveMap.set(targetId, {
            id: targetId,
            satisfiedStatus: objective.satisfiedStatus,
            satisfiedStatusKnown: objective.measureStatus,
            normalizedMeasure: objective.normalizedMeasure,
            normalizedMeasureKnown: objective.measureStatus,
            progressMeasure: objective.progressMeasure,
            progressMeasureKnown: objective.progressMeasureStatus,
            completionStatus: objective.completionStatus,
            completionStatusKnown: objective.completionStatus !== CompletionStatus.UNKNOWN,
            readSatisfiedStatus: mapInfo.readSatisfiedStatus ?? false,
            writeSatisfiedStatus: mapInfo.writeSatisfiedStatus ?? false,
            readNormalizedMeasure: mapInfo.readNormalizedMeasure ?? false,
            writeNormalizedMeasure: mapInfo.writeNormalizedMeasure ?? false,
            readProgressMeasure: mapInfo.readProgressMeasure ?? false,
            writeProgressMeasure: mapInfo.writeProgressMeasure ?? false,
            readCompletionStatus: mapInfo.readCompletionStatus ?? false,
            writeCompletionStatus: mapInfo.writeCompletionStatus ?? false,
            readRawScore: mapInfo.readRawScore ?? false,
            writeRawScore: mapInfo.writeRawScore ?? false,
            readMinScore: mapInfo.readMinScore ?? false,
            writeMinScore: mapInfo.writeMinScore ?? false,
            readMaxScore: mapInfo.readMaxScore ?? false,
            writeMaxScore: mapInfo.writeMaxScore ?? false,
            satisfiedByMeasure: objective.satisfiedByMeasure,
            minNormalizedMeasure: objective.minNormalizedMeasure,
            updateAttemptData: mapInfo.updateAttemptData ?? objective.isPrimary
          });
        }
      }
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
   * INTEGRATION: Snapshot the Global Objective Map
   * Provides a serializable copy for persistence consumers
   * @return {Record<string, any>} - Plain-object snapshot of global objectives
   */
  public getGlobalObjectiveMapSnapshot(): Record<string, any> {
    return this.serializeGlobalObjectiveMap();
  }

  /**
   * INTEGRATION: Restore Global Objective Map
   * Replaces the current map contents with persisted data
   * @param {Record<string, any>} snapshot - Serialized global objective map
   */
  public restoreGlobalObjectiveMapSnapshot(snapshot: Record<string, any>): void {
    this.restoreGlobalObjectiveMap(snapshot);
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

  private serializeGlobalObjectiveMap(): Record<string, any> {
    const serialized: Record<string, any> = {};
    this.globalObjectiveMap.forEach((data, id) => {
      serialized[id] = { ...data };
    });
    return serialized;
  }

  private restoreGlobalObjectiveMap(mapData: Record<string, any>): void {
    this.globalObjectiveMap.clear();
    if (!mapData) {
      return;
    }
    for (const [id, data] of Object.entries(mapData)) {
      this.globalObjectiveMap.set(id, { ...data });
    }
  }
}
