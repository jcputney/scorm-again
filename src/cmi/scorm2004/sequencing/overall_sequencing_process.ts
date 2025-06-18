import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingProcess, SequencingRequestType, SequencingResult, DeliveryRequestType } from "./sequencing_process";
import { RollupProcess } from "./rollup_process";
import { ADLNav } from "../adl";

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

  constructor(
    activityTree: ActivityTree,
    sequencingProcess: SequencingProcess,
    rollupProcess: RollupProcess,
    adlNav: ADLNav | null = null
  ) {
    this.activityTree = activityTree;
    this.sequencingProcess = sequencingProcess;
    this.rollupProcess = rollupProcess;
    this.adlNav = adlNav;
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
      const termResult = this.terminationRequestProcess(navResult.terminationRequest);
      if (!termResult) {
        return new DeliveryRequest(false, null, "TB.2.3-1");
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
        // Step 4: Delivery Request Process (DB.1.1)
        const deliveryResult = this.deliveryRequestProcess(seqResult.targetActivity);
        
        if (deliveryResult.valid) {
          // Step 5: Content Delivery Environment Process (DB.2)
          this.contentDeliveryEnvironmentProcess(deliveryResult.targetActivity!);
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

      case NavigationRequestType.PREVIOUS:
        if (!currentActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-6");
        }
        if (!currentActivity.parent || !currentActivity.parent.sequencingControls.flow) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-7");
        }
        if (currentActivity.parent.sequencingControls.forwardOnly) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-8");
        }
        return new NavigationRequestResult(
          true,
          SequencingRequestType.EXIT,
          SequencingRequestType.PREVIOUS,
          null
        );

      case NavigationRequestType.CHOICE: {
        if (!targetActivityId) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-9");
        }
        const targetActivity = this.activityTree.getActivity(targetActivityId);
        if (!targetActivity) {
          return new NavigationRequestResult(false, null, null, null, "NB.2.1-10");
        }
        if (currentActivity) {
          const commonAncestor = this.findCommonAncestor(currentActivity, targetActivity);
          if (!commonAncestor || !commonAncestor.sequencingControls.choice) {
            return new NavigationRequestResult(false, null, null, null, "NB.2.1-11");
          }
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
   * Termination Request Process (TB.2.3)
   * Processes termination requests
   * @param {SequencingRequestType} request - The termination request
   * @return {boolean} - True if termination was successful
   */
  private terminationRequestProcess(request: SequencingRequestType): boolean {
    const currentActivity = this.activityTree.currentActivity;
    
    if (!currentActivity) {
      return false;
    }

    // Apply appropriate termination based on request type
    switch (request) {
      case SequencingRequestType.EXIT:
      case SequencingRequestType.EXIT_ALL:
        // Terminate normally
        if (currentActivity.isActive) {
          this.endAttemptProcess(currentActivity);
        }
        break;

      case SequencingRequestType.ABANDON:
      case SequencingRequestType.ABANDON_ALL:
        // Abandon without ending attempt
        currentActivity.isActive = false;
        break;

      case SequencingRequestType.SUSPEND_ALL:
        // Suspend the current activity
        currentActivity.isSuspended = true;
        currentActivity.isActive = false;
        this.activityTree.suspendedActivity = currentActivity;
        break;

      default:
        return false;
    }

    // Clear current activity for exit all and abandon all
    if (request === SequencingRequestType.EXIT_ALL || 
        request === SequencingRequestType.ABANDON_ALL) {
      this.activityTree.currentActivity = null;
    }

    return true;
  }

  /**
   * Delivery Request Process (DB.1.1)
   * Validates if an activity can be delivered
   * @param {Activity} activity - The activity to deliver
   * @return {DeliveryRequest} - The delivery validation result
   */
  private deliveryRequestProcess(activity: Activity): DeliveryRequest {
    // Check if activity is a leaf
    if (activity.children.length > 0) {
      return new DeliveryRequest(false, null, "DB.1.1-1");
    }

    // Additional delivery checks can be added here
    // For now, if it's a leaf activity, it can be delivered
    return new DeliveryRequest(true, activity);
  }

  /**
   * Content Delivery Environment Process (DB.2)
   * Handles the delivery of content to the learner
   * @param {Activity} activity - The activity to deliver
   */
  private contentDeliveryEnvironmentProcess(activity: Activity): void {
    // Clear suspended activity if delivering a new activity
    if (this.activityTree.suspendedActivity && 
        this.activityTree.suspendedActivity !== activity) {
      this.clearSuspendedActivitySubprocess();
    }

    // Set the activity as current and active
    this.activityTree.currentActivity = activity;
    activity.isActive = true;
    
    // Mark that content has been delivered
    this.contentDelivered = true;

    // Update navigation validity if ADL nav is available
    if (this.adlNav) {
      this.updateNavigationValidity();
    }
  }

  /**
   * Clear Suspended Activity Subprocess (DB.2.1)
   * Clears the suspended activity state
   */
  private clearSuspendedActivitySubprocess(): void {
    if (this.activityTree.suspendedActivity) {
      this.activityTree.suspendedActivity.isSuspended = false;
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

    // Trigger rollup from this activity
    this.rollupProcess.overallRollupProcess(activity);
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
}