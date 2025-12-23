import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { DeliveryRequestType, SequencingProcess, SequencingRequestType } from "./sequencing_process";
import { RollupProcess } from "./rollup_process";
import { ADLNav } from "../adl";
import { CompletionStatus, SuccessStatus } from "../../../constants/enums";
import { AuxiliaryResource, HideLmsUiItem } from "../../../types/sequencing_types";
import { NavigationLookAhead, NavigationPredictions } from "./navigation_look_ahead";

// Import extracted components
import {
  TerminationHandler,
  type TerminationResult,
  type CMIDataForTransfer,
} from "./handlers/termination_handler";
import {
  DeliveryHandler,
  DeliveryRequest,
  type ContentActivityData,
} from "./handlers/delivery_handler";
import {
  NavigationValidityService,
  NavigationRequestType,
  type NavigationRequestResult,
} from "./services/navigation_validity_service";
import { GlobalObjectiveService } from "./services/global_objective_service";
import {
  SequencingStateManager,
  type SequencingState,
  type SuspensionState,
} from "./state/sequencing_state_manager";
import { DeliveryValidator } from "./validation/delivery_validator";

// Re-export types for backward compatibility
// Using 'export type' for type-only exports since esbuild strips interfaces
export { NavigationRequestType, DeliveryRequest };
export type {
  NavigationRequestResult,
  CMIDataForTransfer,
  ContentActivityData,
  SequencingState,
  SuspensionState,
};
export type { TerminationResult as TerminationRequestResult };

/**
 * Options for configuring the OverallSequencingProcess
 */
export interface OverallSequencingProcessOptions {
  now?: () => Date;
  enhancedDeliveryValidation?: boolean;
  defaultHideLmsUi?: HideLmsUiItem[];
  defaultAuxiliaryResources?: AuxiliaryResource[];
  getCMIData?: () => CMIDataForTransfer;
  is4thEdition?: boolean;
}

/**
 * Overall Sequencing Process
 *
 * Coordinates the overall execution of the SCORM 2004 sequencing loop.
 * This class has been refactored to delegate to specialized handlers and services:
 *
 * - TerminationHandler: Handles termination requests (EXIT, EXIT_ALL, SUSPEND_ALL, etc.)
 * - DeliveryHandler: Handles content delivery and environment setup
 * - NavigationValidityService: Validates navigation requests
 * - GlobalObjectiveService: Manages global objectives
 * - SequencingStateManager: Handles state persistence
 * - DeliveryValidator: Validates delivery preconditions
 *
 * @spec SN Book: OP.1 (Overall Sequencing Process)
 */
export class OverallSequencingProcess {
  // Core dependencies
  private activityTree: ActivityTree;
  private sequencingProcess: SequencingProcess;
  private rollupProcess: RollupProcess;
  private adlNav: ADLNav | null;
  private eventCallback: ((eventType: string, data?: any) => void) | null = null;

  // Extracted services
  private terminationHandler: TerminationHandler;
  private deliveryHandler: DeliveryHandler;
  private navigationValidityService: NavigationValidityService;
  private globalObjectiveService: GlobalObjectiveService;
  private stateManager: SequencingStateManager;
  private deliveryValidator: DeliveryValidator;
  private navigationLookAhead: NavigationLookAhead;

  // Configuration
  private enhancedDeliveryValidation: boolean;
  private is4thEdition: boolean;

  constructor(
    activityTree: ActivityTree,
    sequencingProcess: SequencingProcess,
    rollupProcess: RollupProcess,
    adlNav: ADLNav | null = null,
    eventCallback: ((eventType: string, data?: any) => void) | null = null,
    options?: OverallSequencingProcessOptions
  ) {
    this.activityTree = activityTree;
    this.sequencingProcess = sequencingProcess;
    this.rollupProcess = rollupProcess;
    this.adlNav = adlNav;
    this.eventCallback = eventCallback;
    this.enhancedDeliveryValidation = options?.enhancedDeliveryValidation === true;
    this.is4thEdition = options?.is4thEdition || false;

    // Initialize global objective service
    this.globalObjectiveService = new GlobalObjectiveService(eventCallback || undefined);
    this.globalObjectiveService.initialize(activityTree.root);

    // Initialize delivery validator
    // Build options object conditionally to satisfy exactOptionalPropertyTypes
    const deliveryValidatorOptions: { now?: () => Date } = {};
    if (options?.now) {
      deliveryValidatorOptions.now = options.now;
    }
    this.deliveryValidator = new DeliveryValidator(
      activityTree,
      eventCallback,
      deliveryValidatorOptions
    );

    // Initialize termination handler
    // Build options object conditionally to satisfy exactOptionalPropertyTypes
    const terminationOptions: { getCMIData?: () => CMIDataForTransfer; is4thEdition?: boolean } = {};
    if (options?.getCMIData) {
      terminationOptions.getCMIData = options.getCMIData;
    }
    if (options?.is4thEdition !== undefined) {
      terminationOptions.is4thEdition = options.is4thEdition;
    }
    this.terminationHandler = new TerminationHandler(
      activityTree,
      sequencingProcess,
      rollupProcess,
      this.globalObjectiveService.getMap(),
      eventCallback,
      terminationOptions
    );

    // Initialize delivery handler
    // Build options object conditionally to satisfy exactOptionalPropertyTypes
    const deliveryOptions: {
      now?: () => Date;
      defaultHideLmsUi?: HideLmsUiItem[];
      defaultAuxiliaryResources?: AuxiliaryResource[];
    } = {};
    if (options?.now) {
      deliveryOptions.now = options.now;
    }
    if (options?.defaultHideLmsUi) {
      deliveryOptions.defaultHideLmsUi = options.defaultHideLmsUi;
    }
    if (options?.defaultAuxiliaryResources) {
      deliveryOptions.defaultAuxiliaryResources = options.defaultAuxiliaryResources;
    }
    this.deliveryHandler = new DeliveryHandler(
      activityTree,
      rollupProcess,
      this.globalObjectiveService.getMap(),
      adlNav,
      eventCallback,
      deliveryOptions
    );

    // Initialize navigation validity service
    this.navigationValidityService = new NavigationValidityService(
      activityTree,
      sequencingProcess,
      adlNav,
      eventCallback
    );

    // Initialize state manager
    this.stateManager = new SequencingStateManager(
      activityTree,
      this.globalObjectiveService,
      rollupProcess,
      adlNav,
      eventCallback
    );

    // Use the shared navigation look-ahead from NavigationValidityService
    // This ensures cache invalidation affects the same instance used for predictions
    this.navigationLookAhead = this.navigationValidityService.getNavigationLookAhead();

    // Set up cross-component callbacks
    this.setupCallbacks();
  }

  /**
   * Set up callbacks between components
   */
  private setupCallbacks(): void {
    // Set up termination handler callbacks
    this.terminationHandler.setInvalidateCacheCallback(() => {
      this.navigationLookAhead.invalidateCache();
    });

    // Set up delivery handler callbacks
    this.deliveryHandler.setCheckActivityCallback((activity) =>
      this.deliveryValidator.checkActivity(activity)
    );
    this.deliveryHandler.setInvalidateCacheCallback(() => {
      this.navigationLookAhead.invalidateCache();
    });
    this.deliveryHandler.setUpdateNavigationValidityCallback(() => {
      this.navigationValidityService.updateNavigationValidity();
    });
    this.deliveryHandler.setClearSuspendedActivityCallback(() => {
      this.terminationHandler.clearSuspendedActivity();
    });

    // Set up delivery validator callbacks
    this.deliveryValidator.setContentDeliveredGetter(() =>
      this.deliveryHandler.hasContentBeenDelivered()
    );

    // Set up navigation validity service callbacks
    this.navigationValidityService.setGetEffectiveHideLmsUiCallback((activity) =>
      this.deliveryHandler.getEffectiveHideLmsUi(activity)
    );

    // Set up state manager callbacks
    this.stateManager.setGetEffectiveHideLmsUiCallback((activity) =>
      this.deliveryHandler.getEffectiveHideLmsUi(activity)
    );
    this.stateManager.setGetEffectiveAuxiliaryResourcesCallback((activity) =>
      this.deliveryHandler.getEffectiveAuxiliaryResources(activity)
    );
    this.stateManager.setContentDeliveredAccessors(
      () => this.deliveryHandler.hasContentBeenDelivered(),
      (value) => this.deliveryHandler.setContentDelivered(value)
    );
  }

  /**
   * Overall Sequencing Process
   * Main entry point for processing navigation requests
   * @spec SN Book: OP.1 (Overall Sequencing Process)
   * @param {NavigationRequestType} navigationRequest - The navigation request
   * @param {string | null} targetActivityId - Target activity for choice/jump requests
   * @param {string} exitType - The cmi.exit value (logout, normal, suspend, time-out, or empty)
   * @return {DeliveryRequest} - The delivery request result
   */
  public processNavigationRequest(
    navigationRequest: NavigationRequestType,
    targetActivityId: string | null = null,
    exitType?: string
  ): DeliveryRequest {
    // Step 1: Navigation Request Process (NB.2.1)
    const navResult = this.navigationValidityService.validateRequest(
      navigationRequest,
      targetActivityId
    );

    if (!navResult.valid) {
      return new DeliveryRequest(false, null, navResult.exception);
    }

    // Step 2: Termination Request Process (TB.2.3) if needed
    if (navResult.terminationRequest) {
      const hadSequencingRequest = !!navResult.sequencingRequest;
      const termResult = this.terminationHandler.processTerminationRequest(
        navResult.terminationRequest,
        hadSequencingRequest,
        exitType
      );

      if (!termResult.valid) {
        return new DeliveryRequest(false, null, termResult.exception || "TB.2.3-1");
      }

      // Per TB.2.3 Step 3.6/4.5: Post-condition sequencing request overrides navigation request
      if (termResult.sequencingRequest !== null) {
        if (
          hadSequencingRequest ||
          termResult.sequencingRequest !== SequencingRequestType.EXIT
        ) {
          navResult.sequencingRequest = termResult.sequencingRequest;
        }
      }

      // If this is a termination-only request (no sequencing request), return success
      if (!navResult.sequencingRequest) {
        // For EXIT_ALL and ABANDON_ALL, fire session end event
        if (
          navResult.terminationRequest === SequencingRequestType.EXIT_ALL ||
          navResult.terminationRequest === SequencingRequestType.ABANDON_ALL
        ) {
          this.fireEvent("onSequencingSessionEnd", {
            reason:
              navResult.terminationRequest === SequencingRequestType.EXIT_ALL
                ? "exit_all"
                : "abandon_all",
            navigationRequest: navigationRequest,
          });
        }
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
          navigationRequest: navigationRequest,
        });

        // Return delivery request indicating session end
        return new DeliveryRequest(
          false,
          null,
          seqResult.exception || "SESSION_ENDED"
        );
      }

      if (seqResult.exception) {
        return new DeliveryRequest(false, null, seqResult.exception);
      }

      if (
        seqResult.deliveryRequest === DeliveryRequestType.DELIVER &&
        seqResult.targetActivity
      ) {
        // INTEGRATION: Validate rollup state consistency before delivery
        if (this.activityTree.root) {
          const isConsistent = this.rollupProcess.validateRollupStateConsistency(
            this.activityTree.root
          );
          if (!isConsistent) {
            this.fireEvent("onSequencingDebug", {
              message: "Rollup state inconsistency detected before delivery",
              activityId: this.activityTree.root.id,
            });
          }
        }

        // INTEGRATION: Process global objective mapping before delivery
        this.rollupProcess.processGlobalObjectiveMapping(
          seqResult.targetActivity,
          this.globalObjectiveService.getMap()
        );

        // Step 4: Delivery Request Process (DB.1.1)
        return this.processDelivery(seqResult.targetActivity);
      }
    }

    return new DeliveryRequest(false, null, "OP.1-1");
  }

  /**
   * Process delivery of an activity
   * @param {Activity} targetActivity - The activity to deliver
   * @return {DeliveryRequest} - The delivery result
   */
  private processDelivery(targetActivity: Activity): DeliveryRequest {
    // Enhanced delivery validation if enabled
    if (this.enhancedDeliveryValidation) {
      const stateCheck = this.deliveryValidator.validateTreeConsistency(targetActivity);
      if (!stateCheck.consistent) {
        return new DeliveryRequest(false, null, stateCheck.exception);
      }

      const resourceCheck = this.deliveryValidator.validateResources(targetActivity);
      if (!resourceCheck.available) {
        return new DeliveryRequest(false, null, resourceCheck.exception);
      }

      const concurrentCheck =
        this.deliveryValidator.validateConcurrentDelivery(targetActivity);
      if (!concurrentCheck.allowed) {
        return new DeliveryRequest(false, null, concurrentCheck.exception);
      }

      const dependencyCheck =
        this.deliveryValidator.validateDependencies(targetActivity);
      if (!dependencyCheck.satisfied) {
        return new DeliveryRequest(false, null, dependencyCheck.exception);
      }
    }

    // Standard delivery request process
    const deliveryResult = this.deliveryHandler.processDeliveryRequest(targetActivity);

    if (deliveryResult.valid) {
      // Step 5: Content Delivery Environment Process (DB.2)
      this.deliveryHandler.contentDeliveryEnvironmentProcess(deliveryResult.targetActivity!);

      // Invalidate navigation predictions after activity change
      this.navigationLookAhead.invalidateCache();

      // INTEGRATION: Validate rollup state consistency after delivery
      if (this.activityTree.root) {
        this.rollupProcess.validateRollupStateConsistency(this.activityTree.root);
      }
    }

    return deliveryResult;
  }

  // ========== Public API Methods ==========

  /**
   * Check if content has been delivered
   */
  public hasContentBeenDelivered(): boolean {
    return this.deliveryHandler.hasContentBeenDelivered();
  }

  /**
   * Check if content delivery is currently in progress
   */
  public isDeliveryInProgress(): boolean {
    return this.deliveryHandler.isDeliveryInProgress();
  }

  /**
   * Reset content delivered flag
   */
  public resetContentDelivered(): void {
    this.deliveryHandler.resetContentDelivered();
  }

  /**
   * Set content delivered flag
   * @param {boolean} value - The value to set
   */
  public setContentDelivered(value: boolean): void {
    this.deliveryHandler.setContentDelivered(value);
  }

  /**
   * Update navigation validity in ADL nav
   */
  public updateNavigationValidity(): void {
    this.navigationValidityService.updateNavigationValidity();
  }

  /**
   * Synchronize global objectives from activity states
   */
  public synchronizeGlobalObjectives(): void {
    this.globalObjectiveService.synchronize(
      this.activityTree.root,
      this.rollupProcess
    );
  }

  /**
   * Get the global objective map
   * @return {Map<string, any>} - Current global objective map
   */
  public getGlobalObjectiveMap(): Map<string, any> {
    return this.globalObjectiveService.getMap();
  }

  /**
   * Get a snapshot of the global objective map
   * @return {Record<string, any>} - Plain-object snapshot
   */
  public getGlobalObjectiveMapSnapshot(): Record<string, any> {
    return this.globalObjectiveService.getSnapshot();
  }

  /**
   * Restore global objective map from snapshot
   * @param {Record<string, any>} snapshot - Snapshot to restore
   */
  public restoreGlobalObjectiveMapSnapshot(snapshot: Record<string, any>): void {
    this.globalObjectiveService.restoreSnapshot(snapshot);
  }

  /**
   * Update a specific global objective
   * @param {string} objectiveId - Objective ID
   * @param {any} objectiveData - New objective data
   */
  public updateGlobalObjective(objectiveId: string, objectiveData: any): void {
    this.globalObjectiveService.updateObjective(objectiveId, objectiveData);
  }

  /**
   * Get Sequencing State for Persistence
   * @return {SequencingState} - Serializable sequencing state
   */
  public getSequencingState(): SequencingState {
    return this.stateManager.getState();
  }

  /**
   * Restore Sequencing State from Persistence
   * @param {SequencingState} state - State to restore
   * @return {boolean} - True if successful
   */
  public restoreSequencingState(state: SequencingState): boolean {
    return this.stateManager.restoreState(state);
  }

  /**
   * Get complete suspension state
   * @return {SuspensionState} - Complete suspension state
   */
  public getSuspensionState(): SuspensionState {
    return this.stateManager.getSuspensionState();
  }

  /**
   * Restore complete suspension state
   * @param {SuspensionState} state - Suspension state to restore
   */
  public restoreSuspensionState(state: SuspensionState): void {
    this.stateManager.restoreSuspensionState(state);
  }

  /**
   * Get navigation look-ahead predictions
   * @return {NavigationPredictions} - Current navigation predictions
   */
  public getNavigationLookAhead(): NavigationPredictions {
    return this.navigationValidityService.getAllPredictions();
  }

  /**
   * Predict if Continue navigation would succeed
   * @return {boolean} - True if Continue would succeed
   */
  public predictContinueEnabled(): boolean {
    return this.navigationValidityService.predictContinueEnabled();
  }

  /**
   * Predict if Previous navigation would succeed
   * @return {boolean} - True if Previous would succeed
   */
  public predictPreviousEnabled(): boolean {
    return this.navigationValidityService.predictPreviousEnabled();
  }

  /**
   * Predict if choice to specific activity would succeed
   * @param {string} activityId - Target activity ID
   * @return {boolean} - True if choice would succeed
   */
  public predictChoiceEnabled(activityId: string): boolean {
    return this.navigationValidityService.predictChoiceEnabled(activityId);
  }

  /**
   * Get list of all activities that can be chosen
   * @return {string[]} - Array of activity IDs available for choice
   */
  public getAvailableChoices(): string[] {
    return this.navigationValidityService.getAvailableChoices();
  }

  /**
   * Invalidate navigation prediction cache
   */
  public invalidateNavigationCache(): void {
    this.navigationValidityService.invalidateCache();
  }

  /**
   * Apply delivery controls for auto-completion and auto-satisfaction
   * @param {Activity} activity - The activity to apply delivery controls to
   */
  public applyDeliveryControls(activity: Activity): void {
    // Auto-completion when completionSetByContent is false
    if (!activity.sequencingControls.completionSetByContent) {
      if (activity.completionStatus === CompletionStatus.UNKNOWN) {
        activity.completionStatus = CompletionStatus.COMPLETED;
        activity.wasAutoCompleted = true;
      }
    }

    // Auto-satisfaction when objectiveSetByContent is false
    if (!activity.sequencingControls.objectiveSetByContent) {
      if (activity.successStatus === SuccessStatus.UNKNOWN) {
        activity.successStatus = SuccessStatus.PASSED;
        activity.wasAutoSatisfied = true;
      }
    }
  }

  /**
   * Get effective hideLmsUi for an activity
   * @param {Activity | null} activity - The activity
   * @return {HideLmsUiItem[]} - Ordered list of hideLmsUi directives
   */
  public getEffectiveHideLmsUi(activity: Activity | null): HideLmsUiItem[] {
    return this.deliveryHandler.getEffectiveHideLmsUi(activity);
  }

  /**
   * Get effective auxiliary resources for an activity
   * @param {Activity | null} activity - The activity
   * @return {AuxiliaryResource[]} - Merged auxiliary resources
   */
  public getEffectiveAuxiliaryResources(
    activity: Activity | null
  ): AuxiliaryResource[] {
    return this.deliveryHandler.getEffectiveAuxiliaryResources(activity);
  }

  /**
   * Get content activity data for a delivered activity
   * @param {Activity} activity - The activity
   * @return {ContentActivityData} - Content activity data
   */
  public getContentActivityData(activity: Activity): ContentActivityData {
    return this.deliveryHandler.getContentActivityData(activity);
  }

  // ========== Backward Compatibility Delegations ==========
  // These methods delegate to the extracted handlers for backward compatibility

  /**
   * Termination Request Process
   * Delegates to TerminationHandler for backward compatibility
   * @spec SN Book: TB.2.3 (Termination Request Process)
   * @param {SequencingRequestType} request - The termination request
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @param {string} exitType - The cmi.exit value
   * @return {TerminationResult} - Termination result with sequencing request
   */
  public terminationRequestProcess(
    request: SequencingRequestType,
    hasSequencingRequest: boolean,
    exitType?: string
  ): TerminationResult {
    return this.terminationHandler.processTerminationRequest(
      request,
      hasSequencingRequest,
      exitType
    );
  }

  /**
   * Content Delivery Environment Process
   * Delegates to DeliveryHandler for backward compatibility
   * @spec SN Book: DB.2 (Content Delivery Environment Process)
   * @param {Activity} activity - The activity to initialize for delivery
   */
  public contentDeliveryEnvironmentProcess(activity: Activity): void {
    this.deliveryHandler.contentDeliveryEnvironmentProcess(activity);
  }

  /**
   * End Attempt Process
   * Delegates to TerminationHandler for backward compatibility
   * @spec SN Book: UP.4 (End Attempt Process)
   * @param {Activity} activity - The activity whose attempt is ending
   */
  public endAttemptProcess(activity: Activity): void {
    this.terminationHandler.endAttempt(activity);
  }

  /**
   * Handle EXIT Termination
   * Delegates to TerminationHandler for backward compatibility
   * @param {Activity} currentActivity - The activity being terminated
   * @param {boolean} hasSequencingRequest - Whether a sequencing request follows
   * @return {TerminationResult} - The termination result
   */
  public handleExitTermination(
    currentActivity: Activity,
    hasSequencingRequest: boolean
  ): TerminationResult {
    return this.terminationHandler.handleExitTermination(
      currentActivity,
      hasSequencingRequest
    );
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
