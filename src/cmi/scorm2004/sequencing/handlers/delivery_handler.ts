import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { RollupProcess } from "../rollup_process";
import { SelectionRandomization } from "../selection_randomization";
import { ADLNav } from "../../adl";
import {
  AuxiliaryResource,
  HideLmsUiItem,
  HIDE_LMS_UI_TOKENS,
} from "../../../../types/sequencing_types";

/**
 * Represents a delivery request result
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
 * Content activity data for delivery
 */
export interface ContentActivityData {
  hideLmsUi: HideLmsUiItem[];
  auxiliaryResources: AuxiliaryResource[];
  location: string;
  credit: string;
  launchData: string;
  maxTimeAllowed: string;
  completionThreshold: string;
  timeLimitAction: string;
}

/**
 * Options for configuring the DeliveryHandler
 */
export interface DeliveryHandlerOptions {
  now?: () => Date;
  defaultHideLmsUi?: HideLmsUiItem[];
  defaultAuxiliaryResources?: AuxiliaryResource[];
}

/**
 * DeliveryHandler
 *
 * Handles all delivery-related processing for the SCORM 2004 sequencing engine.
 * Extracted from OverallSequencingProcess to follow Single Responsibility Principle.
 *
 * Responsibilities:
 * - Process delivery requests (validate activity for delivery)
 * - Content delivery environment process (initialize activity for delivery)
 * - Get content activity data (hideLmsUi, auxiliary resources, etc.)
 * - Manage activity path processing
 *
 * @spec SN Book: DB.1.1 (Delivery Request Process)
 * @spec SN Book: DB.2 (Content Delivery Environment Process)
 */
export class DeliveryHandler {
  private static readonly HIDE_LMS_UI_ORDER: HideLmsUiItem[] = [...HIDE_LMS_UI_TOKENS];
  private activityTree: ActivityTree;
  private rollupProcess: RollupProcess;
  private globalObjectiveMap: Map<string, any>;
  private adlNav: ADLNav | null;
  private eventCallback: ((eventType: string, data?: any) => void) | null;
  private now: () => Date;
  private defaultHideLmsUi: HideLmsUiItem[];
  private defaultAuxiliaryResources: AuxiliaryResource[];
  private _deliveryInProgress: boolean = false;
  private contentDelivered: boolean = false;
  private checkActivityCallback: ((activity: Activity) => boolean) | null = null;
  private invalidateCacheCallback: (() => void) | null = null;
  private updateNavigationValidityCallback: (() => void) | null = null;
  private clearSuspendedActivityCallback: (() => void) | null = null;

  constructor(
    activityTree: ActivityTree,
    rollupProcess: RollupProcess,
    globalObjectiveMap: Map<string, any>,
    adlNav: ADLNav | null = null,
    eventCallback: ((eventType: string, data?: any) => void) | null = null,
    options?: DeliveryHandlerOptions
  ) {
    this.activityTree = activityTree;
    this.rollupProcess = rollupProcess;
    this.globalObjectiveMap = globalObjectiveMap;
    this.adlNav = adlNav;
    this.eventCallback = eventCallback;
    this.now = options?.now || (() => new Date());
    this.defaultHideLmsUi = options?.defaultHideLmsUi
      ? [...options.defaultHideLmsUi]
      : [];
    this.defaultAuxiliaryResources = options?.defaultAuxiliaryResources
      ? options.defaultAuxiliaryResources.map((resource) => ({ ...resource }))
      : [];
  }

  /**
   * Set callback to check activity validity
   */
  public setCheckActivityCallback(callback: (activity: Activity) => boolean): void {
    this.checkActivityCallback = callback;
  }

  /**
   * Set callback to invalidate navigation cache after state changes
   */
  public setInvalidateCacheCallback(callback: () => void): void {
    this.invalidateCacheCallback = callback;
  }

  /**
   * Set callback to update navigation validity
   */
  public setUpdateNavigationValidityCallback(callback: () => void): void {
    this.updateNavigationValidityCallback = callback;
  }

  /**
   * Set callback to clear suspended activity
   */
  public setClearSuspendedActivityCallback(callback: () => void): void {
    this.clearSuspendedActivityCallback = callback;
  }

  /**
   * Check if content delivery is currently in progress
   * Used to prevent re-entrant termination requests during delivery
   */
  public isDeliveryInProgress(): boolean {
    return this._deliveryInProgress;
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
   * Set content delivered flag
   * @param {boolean} value - The value to set
   */
  public setContentDelivered(value: boolean): void {
    this.contentDelivered = value;
  }

  /**
   * Delivery Request Process
   * Validates if an activity can be delivered
   * @spec SN Book: DB.1.1 (Delivery Request Process)
   * @param {Activity} activity - The activity to deliver
   * @return {DeliveryRequest} - The delivery validation result
   */
  public processDeliveryRequest(activity: Activity): DeliveryRequest {
    // Enhanced logging for debugging
    this.fireEvent("onDeliveryRequestProcessing", {
      activity: activity.id,
      timestamp: new Date().toISOString(),
    });

    // Check if activity is a cluster (has children)
    // Note: Only activities with children are considered clusters. The 'flow' control
    // is only relevant for controlling navigation through a parent's children and does
    // not affect whether a leaf activity can be delivered.
    if (activity.children.length > 0) {
      return new DeliveryRequest(false, null, "DB.1.1-1");
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
      const checkResult = this.checkActivityCallback
        ? this.checkActivityCallback(pathActivity)
        : true;
      if (!checkResult) {
        // Activity check failed - cannot deliver
        return new DeliveryRequest(false, null, "DB.1.1-3");
      }
    }

    // Activity is a true leaf and passes all checks - can be delivered
    return new DeliveryRequest(true, activity);
  }

  /**
   * Content Delivery Environment Process
   * Handles the delivery of content to the learner
   * @spec SN Book: DB.2 (Content Delivery Environment Process)
   * @param {Activity} activity - The activity to deliver
   */
  public contentDeliveryEnvironmentProcess(activity: Activity): void {
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
        if (this.clearSuspendedActivityCallback) {
          this.clearSuspendedActivityCallback();
        }
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
          // (Randomization at specification-required process points)
          // This occurs after activity.isActive is set and attempt count is incremented
          SelectionRandomization.applySelectionAndRandomization(
            pathActivity,
            pathActivity.attemptCount <= 1
          );
        }
      }

      // Step 4: Set the activity as current
      this.activityTree.currentActivity = activity;

      // Step 5: Initialize attempt for the delivered activity
      this.initializeForDelivery(activity);

      // Step 6: Set up activity attempt tracking information
      this.setupAttemptTracking(activity);

      // Step 7: Mark that content has been delivered
      this.contentDelivered = true;

      // Step 8: Update navigation validity if ADL nav is available
      if (this.adlNav && this.updateNavigationValidityCallback) {
        this.updateNavigationValidityCallback();
      }

      // Step 9: Fire activity delivery event
      this.fireDeliveryEvent(activity);
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
  private initializeForDelivery(activity: Activity): void {
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
  private setupAttemptTracking(activity: Activity): void {
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
        language: "",
      };
    }
  }

  /**
   * Fire Activity Delivery Event
   * Notify listeners that an activity has been delivered
   * @param {Activity} activity - The activity that was delivered
   */
  private fireDeliveryEvent(activity: Activity): void {
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
   * Get effective hideLmsUi for an activity
   * Merges default and activity-specific hideLmsUi directives
   * @param {Activity | null} activity - The activity
   * @return {HideLmsUiItem[]} - Ordered list of hideLmsUi directives
   */
  public getEffectiveHideLmsUi(activity: Activity | null): HideLmsUiItem[] {
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

    return DeliveryHandler.HIDE_LMS_UI_ORDER.filter((directive) =>
      seen.has(directive)
    );
  }

  /**
   * Get effective auxiliary resources for an activity
   * Merges default and activity-specific resources
   * @param {Activity | null} activity - The activity
   * @return {AuxiliaryResource[]} - Merged auxiliary resources
   */
  public getEffectiveAuxiliaryResources(
    activity: Activity | null
  ): AuxiliaryResource[] {
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
   * Get content activity data for a delivered activity
   * @param {Activity} activity - The activity
   * @return {ContentActivityData} - Content activity data
   */
  public getContentActivityData(activity: Activity): ContentActivityData {
    return {
      hideLmsUi: this.getEffectiveHideLmsUi(activity),
      auxiliaryResources: this.getEffectiveAuxiliaryResources(activity),
      location: activity.location || "",
      credit: activity.credit || "credit",
      launchData: activity.launchData || "",
      maxTimeAllowed: activity.attemptAbsoluteDurationLimit || "",
      completionThreshold: activity.completionThreshold?.toString() || "",
      timeLimitAction: activity.timeLimitAction || "continue,no message",
    };
  }

  /**
   * Get Activity Path (Helper for DB.1.1)
   * Forms the activity path from root to target activity, inclusive
   * @param {Activity} activity - The target activity
   * @param {boolean} includeActivity - Whether to include the target in the path
   * @return {Activity[]} - Array of activities from root to target
   */
  public getActivityPath(
    activity: Activity,
    includeActivity: boolean = true
  ): Activity[] {
    const path: Activity[] = [];
    let current: Activity | null = activity;

    // Walk up from target to root
    while (current !== null) {
      path.unshift(current); // Add to beginning of array
      current = current.parent;
    }

    // Remove target activity if not included
    if (!includeActivity && path.length > 0) {
      path.pop();
    }

    return path;
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
