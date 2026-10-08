import { getDeliveryGeneration } from "../cmi/scorm2004/sequencing/delivery_generation";
import { Activity } from "../cmi/scorm2004/sequencing/activity";
import {
  SequencingResult,
  DeliveryRequestType,
} from "../cmi/scorm2004/sequencing/sequencing_process";
import { EventService } from "./EventService";
import { LoggingService } from "./LoggingService";
import { IEventService, ILoggingService } from "../interfaces/services";

/**
 * Interface for activity delivery callbacks
 */
export interface ActivityDeliveryCallbacks {
  onDeliverActivity?: (activity: Activity) => void;
  onUnloadActivity?: (activity: Activity) => void;
  onSequencingComplete?: (result: SequencingResult) => void;
  onSequencingError?: (error: string) => void;
}

/**
 * Service for managing activity delivery in SCORM 2004
 */
export class ActivityDeliveryService {
  private eventService: IEventService;
  private loggingService: ILoggingService;
  private callbacks: ActivityDeliveryCallbacks;
  private currentDeliveredActivity: Activity | null = null;
  private currentDeliveredAttemptCount: number | null = null;
  private currentDeliveredGeneration: number | null = null;
  private pendingDelivery: Activity | null = null;

  constructor(
    eventService: IEventService,
    loggingService: ILoggingService,
    callbacks: ActivityDeliveryCallbacks = {},
  ) {
    this.eventService = eventService;
    this.loggingService = loggingService;
    this.callbacks = callbacks;
  }

  /**
   * Process a sequencing result and handle activity delivery
   * @param {SequencingResult} result - The sequencing result to process
   */
  public processSequencingResult(result: SequencingResult): void {
    // Log the sequencing result
    if (result.exception) {
      this.loggingService.error(`Sequencing error: ${result.exception}`);
      this.callbacks.onSequencingError?.(result.exception);
      return;
    }

    // Handle delivery request
    if (result.deliveryRequest === DeliveryRequestType.DELIVER && result.targetActivity) {
      this.deliverActivity(result.targetActivity);
    } else {
      // No delivery requested
      this.loggingService.info("Sequencing completed with no delivery request");
    }

    // Notify sequencing complete
    this.callbacks.onSequencingComplete?.(result);
  }

  /**
   * Unload the previous content and notify the host once per DB.2 delivery,
   * including resumed deliveries of the same attempt. Duplicate processing is skipped.
   * @param {Activity} activity - The activity to deliver
   */
  private deliverActivity(activity: Activity): void {
    const generation = getDeliveryGeneration(activity);
    // @spec SCORM 2004 4th Ed. SN DB.2: every delivery launches content, including
    // a resumed attempt (SCORM 2004 4th Ed. RTE 4.2.7: entry=resume). Only skip
    // repeated processing when no new DB.2 delivery has occurred.
    if (
      this.currentDeliveredActivity === activity &&
      this.currentDeliveredAttemptCount === activity.attemptCount &&
      this.currentDeliveredGeneration === generation
    ) {
      this.loggingService.info(`Skipping delivery - activity already delivered: ${activity.id}`);
      return;
    }

    // Host contract: release the previously delivered content before announcing the new
    // delivery. This also applies when DB.2 resumes the same activity's attempt, because the
    // host must relaunch its content (SCORM 2004 4th Ed. RTE 4.2.7: entry=resume).
    if (this.currentDeliveredActivity) {
      this.unloadActivity(this.currentDeliveredActivity);
    }

    // Mark the activity as pending delivery
    this.pendingDelivery = activity;

    // Log delivery
    this.loggingService.info(`Delivering activity: ${activity.id} - ${activity.title}`);

    // Publish the delivery state before either callback or event observers run. Generic
    // ActivityDelivery listeners may inspect both the activity and this service's state.
    this.currentDeliveredActivity = activity;
    this.currentDeliveredAttemptCount = activity.attemptCount;
    this.currentDeliveredGeneration = generation;
    this.pendingDelivery = null;
    activity.isActive = true;

    // Let API-owned delivery bookkeeping install the new activity's launch-static state before
    // generic ActivityDelivery observers inspect the public API model.
    this.callbacks.onDeliverActivity?.(activity);

    // Fire delivery event
    this.eventService.processListeners("ActivityDelivery", activity.id, activity);
  }

  /**
   * Unload an activity
   * @param {Activity} activity - The activity to unload
   */
  private unloadActivity(activity: Activity): void {
    // Log unload
    this.loggingService.info(`Unloading activity: ${activity.id} - ${activity.title}`);

    // Fire unload event
    this.eventService.processListeners("ActivityUnload", activity.id, activity);

    // Call unload callback
    this.callbacks.onUnloadActivity?.(activity);

    // Mark activity as inactive
    activity.isActive = false;
  }

  /**
   * Get the currently delivered activity
   * @return {Activity | null}
   */
  public getCurrentDeliveredActivity(): Activity | null {
    return this.currentDeliveredActivity;
  }

  /**
   * Get the pending delivery activity
   * @return {Activity | null}
   */
  public getPendingDelivery(): Activity | null {
    return this.pendingDelivery;
  }

  /**
   * Update delivery callbacks
   * @param {ActivityDeliveryCallbacks} callbacks - The new callbacks
   */
  public updateCallbacks(callbacks: ActivityDeliveryCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * Reset the delivery service
   */
  public reset(): void {
    if (this.currentDeliveredActivity) {
      this.unloadActivity(this.currentDeliveredActivity);
    }
    this.currentDeliveredActivity = null;
    this.currentDeliveredAttemptCount = null;
    this.currentDeliveredGeneration = null;
    this.pendingDelivery = null;
  }
}
