/**
 * SCORM 1.2 Simple Sequencer
 *
 * Provides navigation helpers for multi-SCO SCORM 1.2 courses.
 * This is a simple linear sequencer - for prerequisite handling,
 * use your LMS's existing prerequisite system.
 *
 * @example
 * ```typescript
 * const sequencer = new Scorm12Sequencer(scoDefinitions, stateTracker);
 *
 * // Handle continue button
 * const nextSco = sequencer.getNextSco(currentScoId);
 * if (nextSco) {
 *   launchSco(nextSco);
 * }
 *
 * // Process exit action from SCO
 * const suggestion = sequencer.processExitAction(currentScoId, 'suspend');
 * ```
 */

import { ScoDefinition, NavigationSuggestion, ExitAction } from "./types";
import { ScoStateTracker } from "./sco_state_tracker";

/**
 * Callback type for filtering available SCOs
 * Return true if the SCO should be available for navigation
 */
export type ScoAvailabilityFilter = (
  sco: ScoDefinition,
  tracker: ScoStateTracker,
) => boolean;

/**
 * Simple linear sequencer for SCORM 1.2 multi-SCO courses
 */
export class Scorm12Sequencer {
  private _scoList: ScoDefinition[];
  private _stateTracker: ScoStateTracker;
  private _scoById: Map<string, ScoDefinition>;
  private _availabilityFilter: ScoAvailabilityFilter | undefined;

  /**
   * Create a new sequencer
   *
   * @param scoList List of SCO definitions in sequence order
   * @param stateTracker State tracker instance
   * @param availabilityFilter Optional filter for SCO availability (e.g., for prerequisites)
   */
  constructor(
    scoList: ScoDefinition[],
    stateTracker: ScoStateTracker,
    availabilityFilter?: ScoAvailabilityFilter,
  ) {
    // Sort by sequence index
    this._scoList = [...scoList].sort(
      (a, b) => a.sequenceIndex - b.sequenceIndex,
    );
    this._stateTracker = stateTracker;
    this._scoById = new Map(this._scoList.map((sco) => [sco.id, sco]));
    this._availabilityFilter = availabilityFilter;

    // Initialize state tracker with all SCOs
    for (const sco of this._scoList) {
      this._stateTracker.initializeSco(sco.id, sco.title, sco.masteryScore);
    }
  }

  /**
   * Set or update the availability filter
   * Use this to integrate your LMS's prerequisite system
   *
   * @example
   * ```typescript
   * sequencer.setAvailabilityFilter((sco, tracker) => {
   *   return myLms.checkPrerequisites(sco.id);
   * });
   * ```
   */
  setAvailabilityFilter(filter: ScoAvailabilityFilter): void {
    this._availabilityFilter = filter;
  }

  /**
   * Get the next SCO in sequence after the given SCO
   *
   * @param currentScoId Current SCO ID (or null for first)
   * @returns Next SCO definition or null if at end
   */
  getNextSco(currentScoId: string | null): ScoDefinition | null {
    if (!currentScoId) {
      // Return first available SCO
      return this._getFirstAvailableSco();
    }

    const currentIndex = this._scoList.findIndex(
      (sco) => sco.id === currentScoId,
    );
    if (currentIndex === -1) {
      return null;
    }

    // Find next available SCO
    for (let i = currentIndex + 1; i < this._scoList.length; i++) {
      const sco = this._scoList[i];
      if (sco && this._isAvailable(sco)) {
        return sco;
      }
    }

    return null;
  }

  /**
   * Get the previous SCO in sequence before the given SCO
   *
   * @param currentScoId Current SCO ID
   * @returns Previous SCO definition or null if at beginning
   */
  getPreviousSco(currentScoId: string): ScoDefinition | null {
    const currentIndex = this._scoList.findIndex(
      (sco) => sco.id === currentScoId,
    );
    if (currentIndex <= 0) {
      return null;
    }

    // Find previous available SCO
    for (let i = currentIndex - 1; i >= 0; i--) {
      const sco = this._scoList[i];
      if (sco && this._isAvailable(sco)) {
        return sco;
      }
    }

    return null;
  }

  /**
   * Get a SCO by ID
   */
  getSco(scoId: string): ScoDefinition | undefined {
    return this._scoById.get(scoId);
  }

  /**
   * Get all SCO definitions
   */
  getAllScos(): ScoDefinition[] {
    return [...this._scoList];
  }

  /**
   * Get all currently available SCOs (passing availability filter)
   */
  getAvailableScos(): ScoDefinition[] {
    return this._scoList.filter((sco) => this._isAvailable(sco));
  }

  /**
   * Get all SCOs that have not been completed
   */
  getIncompleteScos(): ScoDefinition[] {
    return this._scoList.filter(
      (sco) => !this._stateTracker.isCompleted(sco.id),
    );
  }

  /**
   * Check if there is a next SCO available
   */
  hasNext(currentScoId: string): boolean {
    return this.getNextSco(currentScoId) !== null;
  }

  /**
   * Check if there is a previous SCO available
   */
  hasPrevious(currentScoId: string): boolean {
    return this.getPreviousSco(currentScoId) !== null;
  }

  /**
   * Check if a specific SCO is available for navigation
   */
  isScoAvailable(scoId: string): boolean {
    const sco = this._scoById.get(scoId);
    return sco ? this._isAvailable(sco) : false;
  }

  /**
   * Process an exit action from a SCO and get navigation suggestion
   *
   * @param scoId The SCO that just exited
   * @param exitValue The cmi.core.exit value from the SCO
   * @returns Navigation suggestion for the LMS
   */
  processExitAction(
    scoId: string,
    exitValue: ExitAction | string,
  ): NavigationSuggestion {
    const sco = this._scoById.get(scoId);
    const state = this._stateTracker.getScoState(scoId);

    if (!sco || !state) {
      return {
        action: "exit",
        reason: "Unknown SCO",
      };
    }

    // Process based on exit value
    switch (exitValue) {
      case "suspend":
        return {
          action: "suspend",
          targetScoId: scoId,
          reason: "SCO requested suspend - learner can resume later",
        };

      case "logout":
        return {
          action: "exit",
          reason: "SCO requested logout - end session",
        };

      case "time-out":
        return this._handleTimeOut(sco, state.lessonStatus);

      case "": // Normal exit
      default:
        return this._handleNormalExit(sco, state.lessonStatus);
    }
  }

  /**
   * Get the first SCO that should be launched when course starts
   */
  getStartingSco(): ScoDefinition | null {
    // Check if any SCO was suspended
    for (const sco of this._scoList) {
      const state = this._stateTracker.getScoState(sco.id);
      if (
        state?.exitAction === "suspend" &&
        state.lessonStatus === "incomplete"
      ) {
        if (this._isAvailable(sco)) {
          return sco;
        }
      }
    }

    // Otherwise return first incomplete, or first available
    return this._getFirstIncompleteSco() ?? this._getFirstAvailableSco();
  }

  /**
   * Get progress information
   */
  getProgress(): {
    completed: number;
    total: number;
    percentage: number;
    currentIndex: number;
  } {
    const completed = this._scoList.filter((sco) =>
      this._stateTracker.isCompleted(sco.id),
    ).length;

    return {
      completed,
      total: this._scoList.length,
      percentage:
        this._scoList.length > 0
          ? Math.round((completed / this._scoList.length) * 100)
          : 0,
      currentIndex: -1, // LMS should track current SCO
    };
  }

  // Private helpers

  private _isAvailable(sco: ScoDefinition): boolean {
    if (this._availabilityFilter) {
      return this._availabilityFilter(sco, this._stateTracker);
    }
    return true; // Default: all SCOs available
  }

  private _getFirstAvailableSco(): ScoDefinition | null {
    for (const sco of this._scoList) {
      if (this._isAvailable(sco)) {
        return sco;
      }
    }
    return null;
  }

  private _getFirstIncompleteSco(): ScoDefinition | null {
    for (const sco of this._scoList) {
      if (!this._stateTracker.isCompleted(sco.id) && this._isAvailable(sco)) {
        return sco;
      }
    }
    return null;
  }

  private _handleNormalExit(
    sco: ScoDefinition,
    status: string,
  ): NavigationSuggestion {
    // If failed, might want to retry
    if (status === "failed") {
      return {
        action: "retry",
        targetScoId: sco.id,
        reason: "SCO failed - consider allowing retry",
      };
    }

    // If completed/passed, suggest continue
    if (status === "completed" || status === "passed") {
      const nextSco = this.getNextSco(sco.id);
      if (nextSco) {
        return {
          action: "continue",
          targetScoId: nextSco.id,
          reason: "SCO completed - proceed to next",
        };
      } else {
        return {
          action: "exit",
          reason: "Course complete - no more SCOs",
        };
      }
    }

    // Incomplete - normal exit
    return {
      action: "exit",
      reason: "SCO exited normally while incomplete",
    };
  }

  private _handleTimeOut(
    sco: ScoDefinition,
    status: string,
  ): NavigationSuggestion {
    // Check time limit action from manifest
    const action = sco.timeLimitAction ?? "continue,message";

    if (action.startsWith("exit")) {
      if (status === "completed" || status === "passed") {
        const nextSco = this.getNextSco(sco.id);
        if (nextSco) {
          return {
            action: "continue",
            targetScoId: nextSco.id,
            reason: "Time limit exceeded, moving to next SCO",
          };
        }
      }
      return {
        action: "exit",
        reason: "Time limit exceeded - exit course",
      };
    }

    // Continue action - learner can stay
    return {
      action: "continue",
      targetScoId: sco.id,
      reason: "Time limit exceeded but continue allowed",
    };
  }
}
