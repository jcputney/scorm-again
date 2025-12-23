import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { GlobalObjectiveService } from "../services/global_objective_service";
import { RollupProcess } from "../rollup_process";
import { ADLNav } from "../../adl";
import { HideLmsUiItem, AuxiliaryResource } from "../../../../types/sequencing_types";

/**
 * Activity state for serialization
 */
export interface ActivityStateData {
  id: string;
  title: string;
  isActive: boolean;
  isSuspended: boolean;
  isCompleted: boolean;
  completionStatus: string;
  successStatus: string;
  attemptCount: number;
  attemptCompletionAmount: number;
  attemptAbsoluteDuration: string;
  attemptExperiencedDuration: string;
  activityAbsoluteDuration: string;
  activityExperiencedDuration: string;
  objectiveSatisfiedStatus: boolean;
  objectiveMeasureStatus: boolean;
  objectiveNormalizedMeasure: number;
  progressMeasure: number | null;
  progressMeasureStatus: boolean;
  isAvailable: boolean;
  isHiddenFromChoice: boolean;
  location: string;
  attemptAbsoluteStartTime: string | null;
  objectives: any;
  auxiliaryResources: AuxiliaryResource[];
  selectionRandomizationState: {
    selectionCountStatus: boolean;
    reorderChildren: boolean;
    childOrder: string[];
    selectedChildIds: string[];
    hiddenFromChoiceChildIds: string[];
  };
}

/**
 * Navigation state for serialization
 */
export interface NavigationState {
  request: string;
  requestValid: {
    continue: string;
    previous: string;
    choice: string;
    jump: string;
    exit: string;
    exitAll: string;
    abandon: string;
    abandonAll: string;
    suspendAll: string;
  };
  hideLmsUi: HideLmsUiItem[];
  auxiliaryResources: AuxiliaryResource[];
}

/**
 * Complete sequencing state for persistence
 */
export interface SequencingState {
  version: string;
  timestamp: string;
  contentDelivered: boolean;
  currentActivity: string | null;
  suspendedActivity: string | null;
  activityStates: Record<string, ActivityStateData>;
  navigationState: NavigationState | null;
  globalObjectiveMap: Record<string, any>;
}

/**
 * Suspension state for persistence
 */
export interface SuspensionState {
  activityTree: any;
  currentActivityId: string | null;
  suspendedActivityId: string | null;
  globalObjectives: Record<string, any>;
  timestamp: string;
}

/**
 * SequencingStateManager
 *
 * Manages sequencing state persistence for the SCORM 2004 sequencing engine.
 * Extracted from OverallSequencingProcess to follow Single Responsibility Principle.
 *
 * Responsibilities:
 * - Get/Restore sequencing state for multi-session support
 * - Serialize/Deserialize activity states
 * - Get/Restore navigation state
 * - Get/Restore suspension state
 *
 * @spec SN Book: State Persistence
 */
export class SequencingStateManager {
  private activityTree: ActivityTree;
  private globalObjectiveService: GlobalObjectiveService;
  private rollupProcess: RollupProcess;
  private adlNav: ADLNav | null;
  private eventCallback: ((eventType: string, data?: any) => void) | null;
  private getEffectiveHideLmsUiCallback:
    | ((activity: Activity | null) => HideLmsUiItem[])
    | null = null;
  private getEffectiveAuxiliaryResourcesCallback:
    | ((activity: Activity | null) => AuxiliaryResource[])
    | null = null;
  private contentDeliveredGetter: (() => boolean) | null = null;
  private contentDeliveredSetter: ((value: boolean) => void) | null = null;

  constructor(
    activityTree: ActivityTree,
    globalObjectiveService: GlobalObjectiveService,
    rollupProcess: RollupProcess,
    adlNav: ADLNav | null = null,
    eventCallback: ((eventType: string, data?: any) => void) | null = null
  ) {
    this.activityTree = activityTree;
    this.globalObjectiveService = globalObjectiveService;
    this.rollupProcess = rollupProcess;
    this.adlNav = adlNav;
    this.eventCallback = eventCallback;
  }

  /**
   * Set callback to get effective hideLmsUi
   */
  public setGetEffectiveHideLmsUiCallback(
    callback: (activity: Activity | null) => HideLmsUiItem[]
  ): void {
    this.getEffectiveHideLmsUiCallback = callback;
  }

  /**
   * Set callback to get effective auxiliary resources
   */
  public setGetEffectiveAuxiliaryResourcesCallback(
    callback: (activity: Activity | null) => AuxiliaryResource[]
  ): void {
    this.getEffectiveAuxiliaryResourcesCallback = callback;
  }

  /**
   * Set getter/setter for content delivered flag
   */
  public setContentDeliveredAccessors(
    getter: () => boolean,
    setter: (value: boolean) => void
  ): void {
    this.contentDeliveredGetter = getter;
    this.contentDeliveredSetter = setter;
  }

  /**
   * Get Sequencing State for Persistence
   * Returns the current state of the sequencing engine for multi-session support
   * @return {SequencingState} - Serializable sequencing state
   */
  public getState(): SequencingState {
    return {
      version: "1.0",
      timestamp: new Date().toISOString(),
      contentDelivered: this.contentDeliveredGetter
        ? this.contentDeliveredGetter()
        : false,
      currentActivity: this.activityTree.currentActivity?.id || null,
      suspendedActivity: this.activityTree.suspendedActivity?.id || null,
      activityStates: this.serializeActivities(),
      navigationState: this.getNavigationState(),
      globalObjectiveMap: this.globalObjectiveService.getSnapshot(),
    };
  }

  /**
   * Restore Sequencing State from Persistence
   * Restores the sequencing engine state from a previous session
   * @param {SequencingState} state - Previously saved sequencing state
   * @return {boolean} - True if restoration was successful
   */
  public restoreState(state: SequencingState): boolean {
    try {
      if (!state || state.version !== "1.0") {
        console.warn("Incompatible sequencing state version");
        return false;
      }

      // Restore basic flags
      if (this.contentDeliveredSetter) {
        this.contentDeliveredSetter(state.contentDelivered || false);
      }

      // Restore global objective map before applying local state so reads use persisted data
      if (state.globalObjectiveMap) {
        this.globalObjectiveService.restoreSnapshot(state.globalObjectiveMap);
      }

      // Restore activity states
      if (state.activityStates) {
        this.deserializeActivities(state.activityStates);
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
        this.globalObjectiveService.synchronize(
          this.activityTree.root,
          this.rollupProcess
        );
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
   * @return {Record<string, ActivityStateData>} - Serialized activity states
   */
  private serializeActivities(): Record<string, ActivityStateData> {
    const states: Record<string, ActivityStateData> = {};

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
            .map((child) => child.id),
        },
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
   * @param {Record<string, ActivityStateData>} states - Serialized activity states
   */
  private deserializeActivities(states: Record<string, ActivityStateData>): void {
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
        activity.attemptAbsoluteDuration =
          state.attemptAbsoluteDuration || "PT0H0M0S";
        activity.attemptExperiencedDuration =
          state.attemptExperiencedDuration || "PT0H0M0S";
        activity.activityAbsoluteDuration =
          state.activityAbsoluteDuration || "PT0H0M0S";
        activity.activityExperiencedDuration =
          state.activityExperiencedDuration || "PT0H0M0S";
        activity.objectiveSatisfiedStatus = state.objectiveSatisfiedStatus || false;
        activity.objectiveMeasureStatus = state.objectiveMeasureStatus || false;
        activity.objectiveNormalizedMeasure = state.objectiveNormalizedMeasure || 0;
        activity.progressMeasure = state.progressMeasure ?? 0;
        activity.progressMeasureStatus = state.progressMeasureStatus || false;
        activity.isAvailable = state.isAvailable !== false; // Default to true
        activity.isHiddenFromChoice = state.isHiddenFromChoice === true;
        activity.location = state.location || "";
        activity.attemptAbsoluteStartTime = state.attemptAbsoluteStartTime || "";
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
          sequencingControls.selectionCountStatus =
            selectionState.selectionCountStatus;
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

        activity.setProcessedChildren(
          activity.children.filter((child) => child.isAvailable)
        );
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
   * @return {NavigationState | null} - Navigation state
   */
  private getNavigationState(): NavigationState | null {
    if (!this.adlNav) {
      return null;
    }

    const hideLmsUi = this.getEffectiveHideLmsUiCallback
      ? this.getEffectiveHideLmsUiCallback(this.activityTree.currentActivity)
      : [];

    const auxiliaryResources = this.getEffectiveAuxiliaryResourcesCallback
      ? this.getEffectiveAuxiliaryResourcesCallback(
          this.activityTree.currentActivity
        )
      : [];

    return {
      request: this.adlNav.request || "_none_",
      requestValid: {
        continue: this.adlNav.request_valid?.continue || "false",
        previous: this.adlNav.request_valid?.previous || "false",
        // choice and jump are dynamically evaluated at runtime, so we store "unknown"
        choice: "unknown",
        jump: "unknown",
        exit: this.adlNav.request_valid?.exit || "false",
        exitAll: this.adlNav.request_valid?.exitAll || "false",
        abandon: this.adlNav.request_valid?.abandon || "false",
        abandonAll: this.adlNav.request_valid?.abandonAll || "false",
        suspendAll: this.adlNav.request_valid?.suspendAll || "false",
      },
      hideLmsUi,
      auxiliaryResources,
    };
  }

  /**
   * Restore Navigation State
   * Restores ADL navigation state
   * @param {NavigationState} navState - Navigation state to restore
   */
  private restoreNavigationState(navState: NavigationState): void {
    if (!this.adlNav || !navState) {
      return;
    }

    try {
      // Restore navigation request validity
      if (navState.requestValid) {
        const requestValid = navState.requestValid;
        this.adlNav.request_valid.continue = requestValid.continue || "false";
        this.adlNav.request_valid.previous = requestValid.previous || "false";
        // Note: choice and jump are class instances with dynamic behavior,
        // they are evaluated at runtime based on the activity tree state,
        // so we don't restore them from persisted state
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
   * Get complete suspension state including activity tree and global objectives
   * Captures all state needed to restore sequencing after suspend/resume
   * @return {SuspensionState} - Complete suspension state
   */
  public getSuspensionState(): SuspensionState {
    const state: SuspensionState = {
      activityTree: this.activityTree.root
        ? this.activityTree.root.getSuspensionState()
        : null,
      currentActivityId: this.activityTree.currentActivity?.id || null,
      suspendedActivityId: this.activityTree.suspendedActivity?.id || null,
      globalObjectives: this.globalObjectiveService.getSnapshot(),
      timestamp: new Date().toISOString(),
    };

    this.fireEvent("onSuspensionStateCaptured", {
      hasActivityTree: !!state.activityTree,
      currentActivityId: state.currentActivityId,
      suspendedActivityId: state.suspendedActivityId,
      globalObjectiveCount: Object.keys(state.globalObjectives).length,
      timestamp: state.timestamp,
    });

    return state;
  }

  /**
   * Restore complete suspension state including activity tree and global objectives
   * Restores all state needed to resume from suspended state
   * @param {SuspensionState} state - Suspension state to restore
   */
  public restoreSuspensionState(state: SuspensionState): void {
    if (!state) {
      this.fireEvent("onSuspensionStateRestoreError", {
        error: "No suspension state provided",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    try {
      // Restore global objectives first
      if (state.globalObjectives) {
        this.globalObjectiveService.restoreSnapshot(state.globalObjectives);
      }

      // Restore activity tree state
      if (state.activityTree && this.activityTree.root) {
        this.activityTree.root.restoreSuspensionState(state.activityTree);
      }

      // Restore current and suspended activity references
      if (state.currentActivityId) {
        const currentActivity = this.activityTree.getActivity(
          state.currentActivityId
        );
        if (currentActivity) {
          this.activityTree.currentActivity = currentActivity;
        }
      }

      if (state.suspendedActivityId) {
        const suspendedActivity = this.activityTree.getActivity(
          state.suspendedActivityId
        );
        if (suspendedActivity) {
          this.activityTree.suspendedActivity = suspendedActivity;
        }
      }

      this.fireEvent("onSuspensionStateRestored", {
        currentActivityId: state.currentActivityId,
        suspendedActivityId: state.suspendedActivityId,
        globalObjectiveCount: state.globalObjectives
          ? Object.keys(state.globalObjectives).length
          : 0,
        originalTimestamp: state.timestamp,
        restoreTimestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.fireEvent("onSuspensionStateRestoreError", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
      throw error;
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
      console.warn(`Failed to fire state manager event ${eventType}: ${error}`);
    }
  }
}
