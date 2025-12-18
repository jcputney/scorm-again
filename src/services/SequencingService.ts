import {Activity} from "../cmi/scorm2004/sequencing/activity";
import {Sequencing} from "../cmi/scorm2004/sequencing/sequencing";
import {RollupProcess} from "../cmi/scorm2004/sequencing/rollup_process";
import {
  DeliveryRequest,
  NavigationRequestType,
  OverallSequencingProcess,
} from "../cmi/scorm2004/sequencing/overall_sequencing_process";
import {
  DeliveryRequestType,
  SequencingProcess,
  SequencingResult,
} from "../cmi/scorm2004/sequencing/sequencing_process";
import {IEventService, ILoggingService} from "../interfaces/services";
import {ActivityDeliveryCallbacks, ActivityDeliveryService} from "./ActivityDeliveryService";
import {CMI} from "../cmi/scorm2004/cmi";
import {ADL} from "../cmi/scorm2004/adl";
import {global_constants} from "../constants/api_constants";
import {RuleCondition} from "../cmi/scorm2004/sequencing/sequencing_rules";
import {AuxiliaryResource, HideLmsUiItem} from "../types/sequencing_types";

/**
 * Interface for sequencing event listeners
 */
export interface SequencingEventListeners {
  onSequencingStart?: (activity: Activity) => void;
  onSequencingEnd?: () => void;
  onActivityDelivery?: (activity: Activity) => void;
  onActivityUnload?: (activity: Activity) => void;
  onNavigationRequest?: (request: string, target?: string) => void;
  onRollupComplete?: (activity: Activity) => void;
  onSequencingError?: (error: string, context?: string) => void;
  // Enhanced debugging events
  onSequencingDebug?: (event: string, data?: any) => void;
  onActivityAttemptStart?: (activity: Activity) => void;
  onActivityAttemptEnd?: (activity: Activity) => void;
  onLimitConditionCheck?: (activity: Activity, result: boolean) => void;
  onNavigationValidityUpdate?: (validity: any) => void;
  onSequencingStateChange?: (state: any) => void;
}

/**
 * Interface for sequencing configuration
 */
export interface SequencingConfiguration {
  autoRollupOnCMIChange?: boolean;
  autoProgressOnCompletion?: boolean;
  validateNavigationRequests?: boolean;
  enableEventSystem?: boolean;
  logLevel?: "debug" | "info" | "warn" | "error";
  // Time providers/hooks (LMS can override)
  now?: () => Date;
  getAttemptElapsedSeconds?: (activity: Activity) => number;
  getActivityElapsedSeconds?: (activity: Activity) => number;
}

/**
 * Comprehensive SCORM 2004 Sequencing Service
 * Handles all aspects of sequencing integration with runtime API calls
 */
export class SequencingService {
  private sequencing: Sequencing;
  private cmi: CMI;
  private adl: ADL;
  private eventService: IEventService;
  private loggingService: ILoggingService;
  private activityDeliveryService: ActivityDeliveryService;
  private rollupProcess: RollupProcess;
  private overallSequencingProcess: OverallSequencingProcess | null = null;
  private sequencingProcess: SequencingProcess | null = null;

  private eventListeners: SequencingEventListeners = {};
  private configuration: SequencingConfiguration;
  private isInitialized: boolean = false;
  private isSequencingActive: boolean = false;
  private lastCMIValues: Map<string, any> = new Map();
  private lastSequencingResult: SequencingResult | null = null;

  constructor(
      sequencing: Sequencing,
      cmi: CMI,
      adl: ADL,
      eventService: IEventService,
      loggingService: ILoggingService,
      configuration: SequencingConfiguration = {},
  ) {
    this.sequencing = sequencing;
    this.cmi = cmi;
    this.adl = adl;
    this.eventService = eventService;
    this.loggingService = loggingService;

    // Default configuration
    this.configuration = {
      autoRollupOnCMIChange: true,
      autoProgressOnCompletion: false,
      validateNavigationRequests: true,
      enableEventSystem: true,
      logLevel: "info",
      now: () => new Date(),
      ...configuration,
    };

    // Create activity delivery service
    const deliveryCallbacks: ActivityDeliveryCallbacks = {
      onDeliverActivity: (activity) => this.handleActivityDelivery(activity),
      onUnloadActivity: (activity) => this.handleActivityUnload(activity),
      onSequencingComplete: (result) => this.handleSequencingComplete(result),
      onSequencingError: (error) => this.handleSequencingError(error),
    };

    this.activityDeliveryService = new ActivityDeliveryService(
        eventService,
        loggingService,
        deliveryCallbacks,
    );

    this.rollupProcess = new RollupProcess();
    // Propagate time provider to rule evaluation (time-based conditions)
    if (this.configuration.now) {
      RuleCondition.setNowProvider(this.configuration.now);
    }
    this.setupCMIChangeWatchers();
  }

  /**
   * Initialize the sequencing service
   * Called when SCORM API Initialize() is called
   */
  public initialize(): string {
    try {
      this.log("info", "Initializing sequencing service");

      // Initialize sequencing components
      if (!this.sequencing.initialized) {
        this.sequencing.initialize();
      }

      // Set up ADL Nav connection
      this.sequencing.adlNav = this.adl.nav;

      // Create sequencing processes if we have an activity tree
      if (this.sequencing.activityTree.root) {
        const seqOptions: {
          now?: () => Date;
          getAttemptElapsedSeconds?: (a: Activity) => number;
          getActivityElapsedSeconds?: (a: Activity) => number;
        } = {};
        if (this.configuration.now) seqOptions.now = this.configuration.now;
        if (this.configuration.getAttemptElapsedSeconds)
          seqOptions.getAttemptElapsedSeconds = this.configuration.getAttemptElapsedSeconds;
        if (this.configuration.getActivityElapsedSeconds)
          seqOptions.getActivityElapsedSeconds = this.configuration.getActivityElapsedSeconds;

        this.sequencingProcess = new SequencingProcess(
            this.sequencing.activityTree,
            this.sequencing.sequencingRules,
            this.sequencing.sequencingControls,
            this.adl.nav,
            seqOptions,
        );

        const overallOptions: {
          now?: () => Date;
          enhancedDeliveryValidation?: boolean;
          defaultHideLmsUi?: HideLmsUiItem[];
          defaultAuxiliaryResources?: AuxiliaryResource[];
          getCMIData?: () => any;
          is4thEdition?: boolean;
        } = {};
        if (this.configuration.now) overallOptions.now = this.configuration.now;
        overallOptions.defaultHideLmsUi = [...this.sequencing.hideLmsUi];
        if (this.sequencing.auxiliaryResources.length > 0) {
          overallOptions.defaultAuxiliaryResources = this.sequencing.auxiliaryResources.map(
              (resource) => ({
                resourceId: resource.resourceId,
                purpose: resource.purpose,
              }),
          );
        }

        // Provide CMI data callback for RTE data transfer
        overallOptions.getCMIData = () => this.getCMIDataForTransfer();

        this.overallSequencingProcess = new OverallSequencingProcess(
            this.sequencing.activityTree,
            this.sequencingProcess,
            this.rollupProcess,
            this.adl.nav,
            (eventType: string, data?: any) => this.handleSequencingProcessEvent(eventType, data),
            overallOptions,
        );

        // Store reference on sequencing object for access from ADL nav
        this.sequencing.overallSequencingProcess = this.overallSequencingProcess;

        this.log("info", "Sequencing processes created");
      }

      // Mark service initialized before processing navigation so auto-start requests are honored
      this.isInitialized = true;

      // Start automatic sequencing if configured
      if (this.shouldAutoStartSequencing()) {
        this.startSequencing();
      }

      // Initialize CMI tracking
      this.initializeCMITracking();
      this.fireEvent("onSequencingStart", this.sequencing.getCurrentActivity());

      this.log("info", "Sequencing service initialized successfully");
      return global_constants.SCORM_TRUE;
    } catch (error) {
      const errorMsg = `Failed to initialize sequencing service: ${error}`;
      this.log("error", errorMsg);
      this.fireEvent("onSequencingError", errorMsg, "initialization");
      return global_constants.SCORM_FALSE;
    }
  }

  /**
   * Terminate the sequencing service
   * Called when SCORM API Terminate() is called
   */
  public terminate(): string {
    try {
      this.log("info", "Terminating sequencing service");

      // Trigger final rollup for the current activity
      this.triggerFinalRollup();

      // End sequencing session
      this.endSequencing();

      this.isInitialized = false;
      this.fireEvent("onSequencingEnd");

      this.log("info", "Sequencing service terminated successfully");
      return global_constants.SCORM_TRUE;
    } catch (error) {
      const errorMsg = `Failed to terminate sequencing service: ${error}`;
      this.log("error", errorMsg);
      this.fireEvent("onSequencingError", errorMsg, "termination");
      return global_constants.SCORM_FALSE;
    }
  }

  /**
   * Process a navigation request
   * Implements the complete Overall Sequencing Process (OP.1)
   * @param {string} request - The navigation request
   * @param {string} targetActivityId - Optional target activity ID for choice/jump requests
   * @param {string} exitType - Optional cmi.exit value (logout, normal, suspend, time-out, or empty)
   */
  public processNavigationRequest(
      request: string,
      targetActivityId?: string,
      exitType?: string,
  ): boolean {
    if (!this.isInitialized || !this.overallSequencingProcess) {
      this.log("warn", `Navigation request '${request}' ignored - sequencing not initialized`);
      return false;
    }

    try {
      this.log(
          "info",
          `Processing navigation request: ${request}${targetActivityId ? ` (target: ${targetActivityId})` : ""}${exitType ? ` (exit: ${exitType})` : ""}`,
      );

      // Fire navigation request event
      this.fireEvent("onNavigationRequest", request, targetActivityId);

      // Parse the request to NavigationRequestType
      const navRequestType = this.parseNavigationRequest(request);
      if (navRequestType === null) {
        this.log("warn", `Invalid navigation request: ${request}`);
        return false;
      }

      // Process the navigation request through Overall Sequencing Process
      const deliveryRequest: DeliveryRequest =
          this.overallSequencingProcess.processNavigationRequest(
              navRequestType,
              targetActivityId || null,
              exitType,
          );

      const sequencingResult: SequencingResult = {
        deliveryRequest: deliveryRequest.valid
            ? DeliveryRequestType.DELIVER
            : DeliveryRequestType.DO_NOT_DELIVER,
        targetActivity: deliveryRequest.targetActivity,
        exception: deliveryRequest.exception || null,
        endSequencingSession: false,
      };

      // Store the result
      this.lastSequencingResult = sequencingResult;

      // Handle the delivery request
      if (deliveryRequest.valid && deliveryRequest.targetActivity) {
        // Process delivery through activity delivery service
        this.activityDeliveryService.processSequencingResult(sequencingResult);

        // Update navigation validity for the new current activity
        // This ensures Continue/Previous buttons are correctly enabled/disabled
        this.overallSequencingProcess.updateNavigationValidity();

        this.log(
            "info",
            `Navigation request '${request}' resulted in activity delivery: ${deliveryRequest.targetActivity.id}`,
        );
        return true;
      } else {
        // No delivery requested or invalid
        if (deliveryRequest.exception) {
          this.log("warn", `Navigation request '${request}' failed: ${deliveryRequest.exception}`);
          this.fireEvent("onSequencingError", deliveryRequest.exception, "navigation");
        } else {
          this.log("info", `Navigation request '${request}' completed with no activity delivery`);
        }
        return deliveryRequest.valid;
      }
    } catch (error) {
      const errorMsg = `Error processing navigation request '${request}': ${error}`;
      this.log("error", errorMsg);
      this.fireEvent("onSequencingError", errorMsg, "navigation");
      return false;
    }
  }

  /**
   * Trigger rollup when CMI values change
   * Called automatically when tracked CMI values are updated
   */
  public triggerRollupOnCMIChange(cmiElement: string, oldValue: any, newValue: any): void {
    if (!this.configuration.autoRollupOnCMIChange || !this.isInitialized) {
      return;
    }

    // Only trigger rollup for specific CMI elements that affect sequencing
    const rollupTriggeringElements = [
      "cmi.completion_status",
      "cmi.success_status",
      "cmi.score.scaled",
      "cmi.score.raw",
      "cmi.score.min",
      "cmi.score.max",
      "cmi.progress_measure",
      "cmi.objectives.n.success_status",
      "cmi.objectives.n.completion_status",
      "cmi.objectives.n.score.scaled",
    ];

    if (!rollupTriggeringElements.some((element) => cmiElement.startsWith(element))) {
      return;
    }

    try {
      this.log(
          "debug",
          `Triggering rollup due to CMI change: ${cmiElement} = ${newValue} (was ${oldValue})`,
      );

      // Get current activity
      const currentActivity = this.sequencing.getCurrentActivity();
      if (!currentActivity) {
        this.log("debug", "No current activity for rollup");
        return;
      }

      // Update activity status based on CMI changes
      this.updateActivityFromCMI(currentActivity);

      // Trigger rollup process
      this.rollupProcess.overallRollupProcess(currentActivity);

      // Synchronize global objectives after rollup (required for cross-activity preconditions)
      if (this.overallSequencingProcess) {
        this.overallSequencingProcess.synchronizeGlobalObjectives();
      }

      // Update navigation validity after rollup (preconditions may have changed)
      if (this.overallSequencingProcess) {
        this.overallSequencingProcess.updateNavigationValidity();
      }

      this.fireEvent("onRollupComplete", currentActivity);

      this.log("debug", `Rollup completed for activity: ${currentActivity.id}`);
    } catch (error) {
      const errorMsg = `Error during rollup on CMI change: ${error}`;
      this.log("error", errorMsg);
      this.fireEvent("onSequencingError", errorMsg, "rollup");
    }
  }

  /**
   * Set event listeners for sequencing events
   */
  public setEventListeners(listeners: SequencingEventListeners): void {
    this.eventListeners = {...this.eventListeners, ...listeners};
    this.log("debug", "Sequencing event listeners updated");
  }

  /**
   * Update sequencing configuration
   */
  public updateConfiguration(config: Partial<SequencingConfiguration>): void {
    this.configuration = {...this.configuration, ...config};
    this.log("debug", "Sequencing configuration updated");
  }

  /**
   * Get the current sequencing state
   */
  public getSequencingState(): {
    isInitialized: boolean;
    isActive: boolean;
    currentActivity: Activity | null;
    rootActivity: Activity | null;
    lastSequencingResult: SequencingResult | null;
  } {
    return {
      isInitialized: this.isInitialized,
      isActive: this.isSequencingActive,
      currentActivity: this.sequencing.getCurrentActivity(),
      rootActivity: this.sequencing.getRootActivity(),
      lastSequencingResult: this.lastSequencingResult,
    };
  }

  /**
   * Get the overall sequencing process instance
   * @return {OverallSequencingProcess | null} The overall sequencing process or null if not initialized
   */
  public getOverallSequencingProcess(): OverallSequencingProcess | null {
    return this.overallSequencingProcess;
  }

  /**
   * Check if content delivery is currently in progress
   * Used to prevent re-entrant termination requests during delivery
   * @return {boolean} True if delivery is in progress
   */
  public isDeliveryInProgress(): boolean {
    return this.overallSequencingProcess?.isDeliveryInProgress() ?? false;
  }

  // Private helper methods

  /**
   * Set up watchers for CMI value changes
   */
  private setupCMIChangeWatchers(): void {
    // We'll hook into the setter methods to detect changes
    // This would typically be done by modifying the CMI setters
    // For now, we'll track changes when values are set
  }

  /**
   * Initialize CMI tracking by storing current values
   */
  private initializeCMITracking(): void {
    // Store initial CMI values for change detection
    this.lastCMIValues.set("cmi.completion_status", this.cmi.completion_status);
    this.lastCMIValues.set("cmi.success_status", this.cmi.success_status);
    this.lastCMIValues.set("cmi.progress_measure", this.cmi.progress_measure);

    if (this.cmi.score) {
      this.lastCMIValues.set("cmi.score.scaled", this.cmi.score.scaled);
      this.lastCMIValues.set("cmi.score.raw", this.cmi.score.raw);
    }
  }

  /**
   * Check if sequencing should auto-start
   */
  private shouldAutoStartSequencing(): boolean {
    // Auto-start if we have a root activity and no current activity
    return !!(this.sequencing.activityTree.root && !this.sequencing.getCurrentActivity());
  }

  /**
   * Start automatic sequencing
   */
  private startSequencing(): void {
    if (!this.overallSequencingProcess) {
      return;
    }

    try {
      // Process a "start" navigation request to begin sequencing
      const startResult = this.processNavigationRequest("start");
      if (startResult) {
        this.isSequencingActive = true;
        this.log("info", "Automatic sequencing started");
      }
    } catch (error) {
      this.log("error", `Failed to start automatic sequencing: ${error}`);
    }
  }

  /**
   * End sequencing session
   */
  private endSequencing(): void {
    this.isSequencingActive = false;
    this.activityDeliveryService.reset();
  }

  /**
   * Trigger final rollup on termination
   */
  private triggerFinalRollup(): void {
    try {
      const currentActivity = this.sequencing.getCurrentActivity();
      if (currentActivity) {
        // Update activity with final CMI values
        this.updateActivityFromCMI(currentActivity);

        // Trigger rollup
        this.rollupProcess.overallRollupProcess(currentActivity);

        // Synchronize global objectives after final rollup
        if (this.overallSequencingProcess) {
          this.overallSequencingProcess.synchronizeGlobalObjectives();
        }

        this.log("info", "Final rollup completed");
      }
    } catch (error) {
      this.log("error", `Error during final rollup: ${error}`);
    }
  }

  /**
   * Update activity properties from current CMI values
   */
  private updateActivityFromCMI(activity: Activity): void {
    // Update completion status
    if (this.cmi.completion_status !== "unknown") {
      activity.completionStatus = this.cmi.completion_status as
          | "completed"
          | "incomplete"
          | "not attempted"
          | "unknown";
      // Mark that content has set completion status
      activity.attemptProgressStatus = true;
    }

    // Update success status
    if (this.cmi.success_status !== "unknown") {
      activity.successStatus = this.cmi.success_status as "passed" | "failed" | "unknown";
      activity.objectiveSatisfiedStatus = this.cmi.success_status === "passed";
      // Set measureStatus to true since we now have a known satisfied status
      activity.objectiveMeasureStatus = true;
      // Mark that content has set objective satisfaction status
      if (activity.primaryObjective) {
        activity.primaryObjective.progressStatus = true;
      }
    }

    // Update progress measure
    if (this.cmi.progress_measure !== "") {
      const progressMeasure = parseFloat(this.cmi.progress_measure);
      if (!isNaN(progressMeasure)) {
        activity.progressMeasure = progressMeasure;
        activity.progressMeasureStatus = true;
      }
    }

    // Update score information
    if (this.cmi.score && this.cmi.score.scaled !== "") {
      const scaledScore = parseFloat(this.cmi.score.scaled);
      if (!isNaN(scaledScore)) {
        activity.objectiveNormalizedMeasure = scaledScore;
        activity.objectiveMeasureStatus = true;
        // Mark that content has set objective measure (which affects satisfaction)
        if (activity.primaryObjective) {
          activity.primaryObjective.progressStatus = true;
        }
      }
    }

    // Sync primary objective with activity state for global objective mapping
    if (activity.primaryObjective) {
      activity.primaryObjective.updateFromActivity(activity);
    }
  }

  /**
   * Get CMI data for RTE data transfer to activity state
   * This method provides all CMI data to the sequencing process for transfer
   * @return {Object} - CMI data formatted for transfer
   */
  private getCMIDataForTransfer(): any {
    const cmiData: any = {
      completion_status: this.cmi.completion_status,
      success_status: this.cmi.success_status,
      progress_measure: this.cmi.progress_measure,
      score: {
        scaled: this.cmi.score?.scaled || "",
        raw: this.cmi.score?.raw || "",
        min: this.cmi.score?.min || "",
        max: this.cmi.score?.max || "",
      },
      objectives: [],
    };

    // Transfer all CMI objectives
    if (this.cmi.objectives && this.cmi.objectives.childArray) {
      for (const cmiObjective of this.cmi.objectives.childArray) {
        if (cmiObjective.id) {
          cmiData.objectives.push({
            id: cmiObjective.id,
            success_status: cmiObjective.success_status,
            completion_status: cmiObjective.completion_status,
            progress_measure: cmiObjective.progress_measure,
            score: {
              scaled: cmiObjective.score?.scaled || "",
              raw: cmiObjective.score?.raw || "",
              min: cmiObjective.score?.min || "",
              max: cmiObjective.score?.max || "",
            },
          });
        }
      }
    }

    return cmiData;
  }

  /**
   * Parse navigation request string to NavigationRequestType
   */
  private parseNavigationRequest(request: string): NavigationRequestType | null {
    // Normalize SCORM nav request tokens (e.g., _continue, _previous)
    let normalizedRequest = request;
    if (normalizedRequest.startsWith("_") && normalizedRequest !== "_none_") {
      normalizedRequest = normalizedRequest.substring(1);
    }

    // Handle choice and jump with targets
    if (request.includes("choice")) {
      return NavigationRequestType.CHOICE;
    }
    if (request.includes("jump")) {
      return NavigationRequestType.JUMP;
    }

    // Handle standard navigation requests
    switch (normalizedRequest) {
      case "start":
        return NavigationRequestType.START;
      case "resumeAll":
        return NavigationRequestType.RESUME_ALL;
      case "continue":
        return NavigationRequestType.CONTINUE;
      case "previous":
        return NavigationRequestType.PREVIOUS;
      case "exit":
        return NavigationRequestType.EXIT;
      case "exitAll":
        return NavigationRequestType.EXIT_ALL;
      case "abandon":
        return NavigationRequestType.ABANDON;
      case "abandonAll":
        return NavigationRequestType.ABANDON_ALL;
      case "suspendAll":
        return NavigationRequestType.SUSPEND_ALL;
      case "_none_":
        return NavigationRequestType.NOT_VALID;
      default:
        return null;
    }
  }

  /**
   * Handle activity delivery event
   */
  private handleActivityDelivery(activity: Activity): void {
    this.log("info", `Activity delivered: ${activity.id} - ${activity.title}`);
    this.fireEvent("onActivityDelivery", activity);
  }

  /**
   * Handle activity unload event
   */
  private handleActivityUnload(activity: Activity): void {
    this.log("info", `Activity unloaded: ${activity.id} - ${activity.title}`);
    this.fireEvent("onActivityUnload", activity);
  }

  /**
   * Handle sequencing completion event
   */
  private handleSequencingComplete(result: SequencingResult): void {
    this.log("debug", "Sequencing completed", result);
  }

  /**
   * Handle sequencing error event
   */
  private handleSequencingError(error: string): void {
    this.log("error", `Sequencing error: ${error}`);
    this.fireEvent("onSequencingError", error, "sequencing");
  }

  /**
   * Fire an event to registered listeners with enhanced error handling
   */
  private fireEvent(eventType: keyof SequencingEventListeners, ...args: any[]): void {
    if (!this.configuration.enableEventSystem) {
      return;
    }

    // Only fire debug event for non-debug events to prevent recursion
    if (eventType !== "onSequencingDebug") {
      this.fireDebugEvent(`${eventType} fired`, {eventType, argsLength: args.length});
    }

    try {
      // Fire to internal listeners first
      const listener = this.eventListeners[eventType];
      if (listener && typeof listener === "function") {
        try {
          (listener as any)(...args);
          this.log("debug", `Internal listener for ${eventType} executed successfully`);
        } catch (listenerError) {
          this.log("error", `Internal listener for ${eventType} failed: ${listenerError}`);
          // Don't let listener errors stop event propagation
        }
      }

      // Fire through the event service for broader integration
      try {
        this.eventService.processListeners(`Sequencing.${eventType}`, args[0], ...args.slice(1));
        this.log("debug", `Event service listeners for ${eventType} processed`);
      } catch (eventServiceError) {
        // Event service might not be properly initialized in test contexts
        // This is not a critical error for sequencing functionality
        this.log("warn", `Event service failed for ${eventType}: ${eventServiceError}`);
      }

      // Fire to external global listeners if available
      try {
        if (typeof window !== "undefined" && (window as any).scormSequencingEvents) {
          const globalListeners = (window as any).scormSequencingEvents;
          if (globalListeners[eventType] && typeof globalListeners[eventType] === "function") {
            globalListeners[eventType](...args);
            this.log("debug", `Global listener for ${eventType} executed`);
          }
        }
      } catch (globalError) {
        this.log("warn", `Global listener for ${eventType} failed: ${globalError}`);
      }
    } catch (error) {
      this.log("error", `Critical error firing event ${eventType}: ${error}`);
    }
  }

  /**
   * Fire a debug event with detailed information
   */
  private fireDebugEvent(event: string, data?: any): void {
    try {
      // Direct execution to avoid recursion through fireEvent
      const listener = this.eventListeners["onSequencingDebug"];
      if (listener && typeof listener === "function") {
        listener(event, {
          timestamp: new Date().toISOString(),
          ...data,
        });
      }

      // Also fire through event service directly
      try {
        this.eventService.processListeners("Sequencing.onSequencingDebug", event, {
          timestamp: new Date().toISOString(),
          ...data,
        });
      } catch (eventServiceError) {
        // Silent fail for event service debug events
      }
    } catch (error) {
      // Silent fail for debug events to avoid recursion
      console.debug(`Debug event failed: ${error}`);
    }
  }

  /**
   * Fire activity attempt start event
   */
  public fireActivityAttemptStart(activity: Activity): void {
    this.fireEvent("onActivityAttemptStart", activity);
    this.fireDebugEvent("Activity attempt started", {
      activityId: activity.id,
      title: activity.title,
      attemptCount: activity.attemptCount,
    });
  }

  /**
   * Fire activity attempt end event
   */
  public fireActivityAttemptEnd(activity: Activity): void {
    this.fireEvent("onActivityAttemptEnd", activity);
    this.fireDebugEvent("Activity attempt ended", {
      activityId: activity.id,
      title: activity.title,
      completionStatus: activity.completionStatus,
      successStatus: activity.successStatus,
    });
  }

  /**
   * Fire limit condition check event
   */
  public fireLimitConditionCheck(activity: Activity, result: boolean): void {
    this.fireEvent("onLimitConditionCheck", activity, result);
    this.fireDebugEvent("Limit condition check", {
      activityId: activity.id,
      result,
      attemptCount: activity.attemptCount,
      attemptLimit: activity.attemptLimit,
    });
  }

  /**
   * Fire navigation validity update event
   */
  public fireNavigationValidityUpdate(validity: any): void {
    this.fireEvent("onNavigationValidityUpdate", validity);
    this.fireDebugEvent("Navigation validity updated", {validity});
  }

  /**
   * Fire sequencing state change event
   */
  public fireSequencingStateChange(state: any): void {
    this.fireEvent("onSequencingStateChange", state);
    this.fireDebugEvent("Sequencing state changed", {stateKeys: Object.keys(state)});
  }

  /**
   * Handle events from the sequencing process
   */
  private handleSequencingProcessEvent(eventType: string, data?: any): void {
    try {
      switch (eventType) {
        case "onActivityDelivery":
          this.fireEvent("onActivityDelivery", data);
          break;
        case "onLimitConditionCheck":
          this.fireLimitConditionCheck(data.activity, data.result);
          break;
        case "onActivityAttemptStart":
          this.fireActivityAttemptStart(data);
          break;
        case "onActivityAttemptEnd":
          this.fireActivityAttemptEnd(data);
          break;
        case "onNavigationValidityUpdate":
          this.fireNavigationValidityUpdate(data);
          break;
        default:
          // Pass through unknown events as debug events
          this.fireDebugEvent(`Sequencing process event: ${eventType}`, data);
      }
    } catch (error) {
      this.log("error", `Error handling sequencing process event ${eventType}: ${error}`);
    }
  }

  /**
   * Log message with appropriate level
   */
  private log(level: "debug" | "info" | "warn" | "error", message: string, data?: any): void {
    const logLevels = ["debug", "info", "warn", "error"];
    const configLevel = this.configuration.logLevel || "info";

    if (logLevels.indexOf(level) >= logLevels.indexOf(configLevel)) {
      switch (level) {
        case "debug":
          this.loggingService.debug(
              `[Sequencing] ${message}${data ? ` - ${JSON.stringify(data)}` : ""}`,
          );
          break;
        case "info":
          this.loggingService.info(
              `[Sequencing] ${message}${data ? ` - ${JSON.stringify(data)}` : ""}`,
          );
          break;
        case "warn":
          this.loggingService.warn(
              `[Sequencing] ${message}${data ? ` - ${JSON.stringify(data)}` : ""}`,
          );
          break;
        case "error":
          this.loggingService.error(
              `[Sequencing] ${message}${data ? ` - ${JSON.stringify(data)}` : ""}`,
          );
          break;
      }
    }
  }
}
