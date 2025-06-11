import { Activity } from "../cmi/scorm2004/sequencing/activity";
import {
  SequencingResult,
  DeliveryRequestType,
} from "../cmi/scorm2004/sequencing/sequencing_process";
import { EventService } from "./EventService";
import { LoggingService } from "./LoggingService";

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
  private eventService: EventService;
  private loggingService: LoggingService;
  private callbacks: ActivityDeliveryCallbacks;
  private currentDeliveredActivity: Activity | null = null;
  private pendingDelivery: Activity | null = null;

  constructor(
    eventService: EventService,
    loggingService: LoggingService,
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
   * Deliver an activity
   * @param {Activity} activity - The activity to deliver
   */
  private deliverActivity(activity: Activity): void {
    // If there's a currently delivered activity, unload it first
    if (this.currentDeliveredActivity && this.currentDeliveredActivity !== activity) {
      this.unloadActivity(this.currentDeliveredActivity);
    }

    // Mark the activity as pending delivery
    this.pendingDelivery = activity;

    // Log delivery
    this.loggingService.info(`Delivering activity: ${activity.id} - ${activity.title}`);

    // Fire delivery event
    this.eventService.processListeners("ActivityDelivery", activity.id, activity);

    // Call delivery callback
    this.callbacks.onDeliverActivity?.(activity);

    // Update current delivered activity
    this.currentDeliveredActivity = activity;
    this.pendingDelivery = null;

    // Mark activity as active
    activity.isActive = true;
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
    this.pendingDelivery = null;
  }
}
