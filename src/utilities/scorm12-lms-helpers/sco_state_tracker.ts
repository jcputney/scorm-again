/**
 * SCORM 1.2 SCO State Tracker
 *
 * Tracks the runtime state of all SCOs in a multi-SCO course.
 * Designed to be updated from Scorm12API events and persisted by the LMS.
 *
 * @example
 * ```typescript
 * const tracker = new ScoStateTracker();
 *
 * // Initialize from LMS database on course launch
 * tracker.initializeFromPersistedData(lmsData);
 *
 * // Update when SCO commits data
 * api.on('LMSCommit', (data) => {
 *   tracker.updateFromCmiData(currentScoId, data.cmi);
 * });
 *
 * // Get state for persistence
 * const stateToSave = tracker.exportState();
 * ```
 */

import {
  ScoState,
  ScoScore,
  LessonStatus,
  ExitAction,
  ScoStateChangeEvent,
} from "./types";
import { addScormTime } from "./time_utilities";

/**
 * Event listener type for state changes
 */
export type StateChangeListener = (event: ScoStateChangeEvent) => void;

/**
 * Tracks runtime state for all SCOs in a multi-SCO SCORM 1.2 course
 */
export class ScoStateTracker {
  private _states: Map<string, ScoState> = new Map();
  private _listeners: Set<StateChangeListener> = new Set();

  /**
   * Create a new state tracker
   * @param initialStates Optional initial states to populate
   */
  constructor(initialStates?: ScoState[]) {
    if (initialStates) {
      for (const state of initialStates) {
        this._states.set(state.id, { ...state });
      }
    }
  }

  /**
   * Initialize or register a SCO with default state
   */
  initializeSco(id: string, title: string, masteryScore?: number): void {
    if (!this._states.has(id)) {
      this._states.set(id, this._createDefaultState(id, title, masteryScore));
    }
  }

  /**
   * Get the state of a specific SCO
   */
  getScoState(scoId: string): ScoState | undefined {
    const state = this._states.get(scoId);
    return state ? { ...state } : undefined;
  }

  /**
   * Get all SCO states
   */
  getAllStates(): ScoState[] {
    return Array.from(this._states.values()).map((s) => ({ ...s }));
  }

  /**
   * Update SCO state from CMI data (typically called after LMSCommit)
   *
   * @param scoId The SCO being updated
   * @param cmiData The CMI data object from the API
   */
  updateFromCmiData(scoId: string, cmiData: ScormCmiData): void {
    let state = this._states.get(scoId);
    const previousState = state ? { ...state } : null;

    if (!state) {
      state = this._createDefaultState(scoId, scoId);
      this._states.set(scoId, state);
    }

    const changedFields: Array<keyof ScoState> = [];

    // Update lesson status
    if (cmiData.core?.lesson_status) {
      const newStatus = this._normalizeStatus(cmiData.core.lesson_status);
      if (newStatus !== state.lessonStatus) {
        state.lessonStatus = newStatus;
        changedFields.push("lessonStatus");
      }
    }

    // Update score
    const scoreChanged = this._updateScore(state, cmiData);
    if (scoreChanged) {
      changedFields.push("score");
    }

    // Update session time
    if (cmiData.core?.session_time) {
      if (cmiData.core.session_time !== state.sessionTime) {
        state.sessionTime = cmiData.core.session_time;
        changedFields.push("sessionTime");

        // Accumulate total time
        const newTotal = addScormTime(
          state.totalTime,
          cmiData.core.session_time,
        );
        if (newTotal !== state.totalTime) {
          state.totalTime = newTotal;
          changedFields.push("totalTime");
        }
      }
    }

    // Update exit action
    if (cmiData.core?.exit !== undefined) {
      const exit = (cmiData.core.exit || "") as ExitAction;
      if (exit !== state.exitAction) {
        state.exitAction = exit;
        changedFields.push("exitAction");
      }
    }

    // Update suspend data
    if (cmiData.suspend_data !== undefined) {
      if (cmiData.suspend_data !== state.suspendData) {
        state.suspendData = cmiData.suspend_data;
        changedFields.push("suspendData");
      }
    }

    // Update lesson location
    if (cmiData.core?.lesson_location !== undefined) {
      if (cmiData.core.lesson_location !== state.lessonLocation) {
        state.lessonLocation = cmiData.core.lesson_location;
        changedFields.push("lessonLocation");
      }
    }

    // Update access time
    state.lastAccessTime = new Date();
    if (!state.hasBeenLaunched) {
      state.hasBeenLaunched = true;
      state.firstLaunchTime = new Date();
      changedFields.push("hasBeenLaunched", "firstLaunchTime");
    }

    // Emit change event
    if (changedFields.length > 0) {
      this._emitChange({
        scoId,
        previousState,
        currentState: { ...state },
        changedFields,
      });
    }
  }

  /**
   * Mark a SCO as launched (call when SCO is actually launched)
   */
  markLaunched(scoId: string): void {
    const state = this._states.get(scoId);
    if (state) {
      const previousState = { ...state };
      const changedFields: Array<keyof ScoState> = [];

      state.attemptCount++;
      changedFields.push("attemptCount");

      if (!state.hasBeenLaunched) {
        state.hasBeenLaunched = true;
        state.firstLaunchTime = new Date();
        changedFields.push("hasBeenLaunched", "firstLaunchTime");
      }

      state.lastAccessTime = new Date();
      changedFields.push("lastAccessTime");

      // Reset session time for new attempt
      state.sessionTime = "0000:00:00.00";

      this._emitChange({
        scoId,
        previousState,
        currentState: { ...state },
        changedFields,
      });
    }
  }

  /**
   * Check if a SCO is completed (passed, completed, or failed)
   */
  isCompleted(scoId: string): boolean {
    const state = this._states.get(scoId);
    if (!state) return false;
    return ["passed", "completed", "failed"].includes(state.lessonStatus);
  }

  /**
   * Check if a SCO is passed
   */
  isPassed(scoId: string): boolean {
    const state = this._states.get(scoId);
    return state?.lessonStatus === "passed";
  }

  /**
   * Check if a SCO is failed
   */
  isFailed(scoId: string): boolean {
    const state = this._states.get(scoId);
    return state?.lessonStatus === "failed";
  }

  /**
   * Check if a SCO has been attempted (launched at least once)
   */
  hasBeenAttempted(scoId: string): boolean {
    const state = this._states.get(scoId);
    return state?.hasBeenLaunched ?? false;
  }

  /**
   * Get normalized score (0-1) for a SCO
   */
  getNormalizedScore(scoId: string): number | undefined {
    const state = this._states.get(scoId);
    return state?.score.scaled;
  }

  /**
   * Add a listener for state changes
   */
  onStateChange(listener: StateChangeListener): () => void {
    this._listeners.add(listener);
    return () => this._listeners.delete(listener);
  }

  /**
   * Export all states for persistence
   */
  exportState(): ScoState[] {
    return this.getAllStates();
  }

  /**
   * Import states from persisted data
   */
  importState(states: ScoState[]): void {
    this._states.clear();
    for (const state of states) {
      this._states.set(state.id, {
        ...state,
        // Restore dates from serialization
        firstLaunchTime: state.firstLaunchTime
          ? new Date(state.firstLaunchTime)
          : undefined,
        lastAccessTime: state.lastAccessTime
          ? new Date(state.lastAccessTime)
          : undefined,
      });
    }
  }

  /**
   * Clear all tracked states
   */
  clear(): void {
    this._states.clear();
  }

  // Private helpers

  private _createDefaultState(
    id: string,
    title: string,
    masteryScore?: number,
  ): ScoState {
    return {
      id,
      title,
      lessonStatus: "not attempted",
      score: {},
      totalTime: "0000:00:00.00",
      sessionTime: "0000:00:00.00",
      masteryScore,
      exitAction: "",
      suspendData: "",
      lessonLocation: "",
      attemptCount: 0,
      hasBeenLaunched: false,
    };
  }

  private _normalizeStatus(status: string): LessonStatus {
    const normalized = status.toLowerCase().trim();
    const validStatuses: LessonStatus[] = [
      "passed",
      "completed",
      "failed",
      "incomplete",
      "browsed",
      "not attempted",
    ];
    return validStatuses.includes(normalized as LessonStatus)
      ? (normalized as LessonStatus)
      : "not attempted";
  }

  private _updateScore(state: ScoState, cmiData: ScormCmiData): boolean {
    let changed = false;
    const score = state.score;

    if (cmiData.core?.score?.raw !== undefined) {
      const raw = parseFloat(String(cmiData.core.score.raw));
      if (!isNaN(raw) && raw !== score.raw) {
        score.raw = raw;
        changed = true;
      }
    }

    if (cmiData.core?.score?.min !== undefined) {
      const min = parseFloat(String(cmiData.core.score.min));
      if (!isNaN(min) && min !== score.min) {
        score.min = min;
        changed = true;
      }
    }

    if (cmiData.core?.score?.max !== undefined) {
      const max = parseFloat(String(cmiData.core.score.max));
      if (!isNaN(max) && max !== score.max) {
        score.max = max;
        changed = true;
      }
    }

    // Calculate scaled score
    if (score.raw !== undefined) {
      const min = score.min ?? 0;
      const max = score.max ?? 100;
      if (max > min) {
        score.scaled = (score.raw - min) / (max - min);
      }
    }

    return changed;
  }

  private _emitChange(event: ScoStateChangeEvent): void {
    for (const listener of this._listeners) {
      try {
        listener(event);
      } catch (e) {
        console.error("Error in state change listener:", e);
      }
    }
  }
}

/**
 * Minimal CMI data structure for state updates
 * This matches the shape of data from Scorm12API
 */
export interface ScormCmiData {
  core?: {
    lesson_status?: string;
    lesson_location?: string;
    exit?: string;
    session_time?: string;
    score?: {
      raw?: number | string;
      min?: number | string;
      max?: number | string;
    };
  };
  suspend_data?: string;
}
