/**
 * PlayerEventAdapter
 *
 * Framework-agnostic adapter that wraps scorm-again API events
 * into high-level callbacks for player UI integration.
 *
 * @example
 * ```javascript
 * import { PlayerEventAdapter } from 'scorm-again/utilities/PlayerEventAdapter';
 *
 * const adapter = new PlayerEventAdapter(api, {
 *   onNavigationStateChange: (state) => updateNavButtons(state),
 *   onScoStatusChange: (scoId, status) => updateMenuItem(scoId, status),
 *   onCourseProgressChange: (progress) => updateProgressBar(progress),
 *   onScoDelivery: (sco) => loadContent(sco),
 *   onSessionEnd: (reason, data) => showCompletionScreen(reason, data),
 * });
 * ```
 */

import Scorm12API from "../Scorm12API";
import Scorm2004API from "../Scorm2004API";

// =============================================================================
// Types
// =============================================================================

export interface NavigationState {
  /** Whether previous navigation is available */
  canPrevious: boolean;
  /** Whether next/continue navigation is available */
  canNext: boolean;
  /** Whether exit is available */
  canExit: boolean;
  /** Available choice targets (activity IDs) for SCORM 2004 sequencing */
  choices: string[];
  /** Raw valid requests from sequencing engine */
  validRequests: string[];
}

export interface ScoStatus {
  /** Completion status (SCORM 2004) or derived from lesson_status (SCORM 1.2) */
  completion: "not attempted" | "incomplete" | "completed" | "unknown";
  /** Success status (SCORM 2004) or derived from lesson_status (SCORM 1.2) */
  success: "passed" | "failed" | "unknown";
  /** Raw score (0-100 scale) */
  score: number | null;
  /** Scaled score (0-1 scale, SCORM 2004 only) */
  scaledScore: number | null;
  /** Bookmark location */
  location: string;
  /** Total time spent in this SCO */
  timeSpent: number; // seconds
}

export interface CourseProgress {
  /** Completion percentage (0-100) */
  completionPct: number;
  /** Average score across completed SCOs */
  avgScore: number | null;
  /** Total time spent in course */
  totalTime: number; // seconds
  /** Overall course status */
  overallStatus: "not attempted" | "incomplete" | "completed" | "passed" | "failed";
  /** Number of completed SCOs */
  completedCount: number;
  /** Total number of SCOs */
  totalCount: number;
}

export interface ScoDelivery {
  /** SCO/Activity identifier */
  id: string;
  /** SCO title */
  title: string;
  /** URL to launch */
  launchUrl: string;
  /** Launch parameters */
  parameters: string;
}

export type SessionEndReason = "complete" | "suspend" | "exit" | "timeout" | "abandon";

export interface SessionEndData {
  /** Sequencing exception code if any */
  exception?: string | undefined;
  /** Navigation request that triggered end */
  navigationRequest?: string | undefined;
  /** Final course progress */
  progress: CourseProgress;
}

export interface PlayerEventAdapterCallbacks {
  /** Called when navigation availability changes */
  onNavigationStateChange?: (state: NavigationState) => void;
  /** Called when a SCO's status changes */
  onScoStatusChange?: (scoId: string, status: ScoStatus) => void;
  /** Called when overall course progress changes */
  onCourseProgressChange?: (progress: CourseProgress) => void;
  /** Called when a SCO should be delivered/launched */
  onScoDelivery?: (sco: ScoDelivery) => void;
  /** Called when the learning session ends */
  onSessionEnd?: (reason: SessionEndReason, data: SessionEndData) => void;
}

export interface PlayerEventAdapterConfig {
  /** SCO definitions for SCORM 1.2 / simple 2004 (required if no sequencing) */
  scoDefinitions?: Array<{
    id: string;
    title: string;
    launchUrl: string;
  }>;
  /** Current SCO ID tracker (for non-sequenced modes) */
  getCurrentScoId?: () => string | null;
}

// =============================================================================
// Adapter Implementation
// =============================================================================

export class PlayerEventAdapter {
  private api: Scorm12API | Scorm2004API;
  private callbacks: PlayerEventAdapterCallbacks;
  private config: PlayerEventAdapterConfig;
  private isScorm2004: boolean;
  private cleanupFns: Array<() => void> = [];

  constructor(
    api: Scorm12API | Scorm2004API,
    callbacks: PlayerEventAdapterCallbacks,
    config: PlayerEventAdapterConfig = {},
  ) {
    this.api = api;
    this.callbacks = callbacks;
    this.config = config;
    this.isScorm2004 = "Initialize" in api;

    this.setupEventListeners();
  }

  // ---------------------------------------------------------------------------
  // Setup
  // ---------------------------------------------------------------------------

  private setupEventListeners(): void {
    if (this.isScorm2004) {
      this.setupScorm2004Listeners();
    } else {
      this.setupScorm12Listeners();
    }
  }

  private setupScorm12Listeners(): void {
    const api = this.api as Scorm12API;

    // Status changes
    const onSetValue = (element: string, value: string) => {
      const scoId = this.config.getCurrentScoId?.();
      if (!scoId) return;

      if (element.startsWith("cmi.core.lesson_status") || element.startsWith("cmi.core.score")) {
        this.emitScoStatusChange(scoId);
        this.emitCourseProgressChange();
      }
    };

    api.on("LMSSetValue", onSetValue);
    this.cleanupFns.push(() => api.off("LMSSetValue", onSetValue));

    // Commit triggers progress recalculation
    const onCommit = () => {
      this.emitCourseProgressChange();
    };

    api.on("LMSCommit", onCommit);
    this.cleanupFns.push(() => api.off("LMSCommit", onCommit));

    // Finish triggers navigation update
    const onFinish = () => {
      this.emitNavigationStateChange();
    };

    api.on("LMSFinish", onFinish);
    this.cleanupFns.push(() => api.off("LMSFinish", onFinish));
  }

  private setupScorm2004Listeners(): void {
    const api = this.api as Scorm2004API;

    // Status changes
    const onSetValue = (element: string, value: string) => {
      const scoId = this.config.getCurrentScoId?.();
      if (!scoId) return;

      if (
        element === "cmi.completion_status" ||
        element === "cmi.success_status" ||
        element.startsWith("cmi.score")
      ) {
        this.emitScoStatusChange(scoId);
        this.emitCourseProgressChange();
      }
    };

    api.on("SetValue", onSetValue);
    this.cleanupFns.push(() => api.off("SetValue", onSetValue));

    // Sequencing events (if sequencing is enabled)
    // These are configured via settings.sequencing.eventListeners
    // but we provide wrapper methods to emit our callbacks
  }

  // ---------------------------------------------------------------------------
  // Sequencing Event Wrappers (call from sequencing config)
  // ---------------------------------------------------------------------------

  /**
   * Call this from sequencing.eventListeners.onNavigationValidityUpdate
   */
  handleNavigationValidityUpdate(data: { validRequests: string[] }): void {
    const validRequests = data.validRequests || [];

    const state: NavigationState = {
      canPrevious: validRequests.includes("previous"),
      canNext: validRequests.includes("continue"),
      canExit: validRequests.includes("exit") || validRequests.includes("exitAll"),
      choices: validRequests
        .filter((r) => r.includes("choice"))
        .map((r) => {
          const match = r.match(/\{target=([^}]+)\}/);
          return match ? match[1] : "";
        })
        .filter((id): id is string => Boolean(id)),
      validRequests,
    };

    this.callbacks.onNavigationStateChange?.(state);
  }

  /**
   * Call this from sequencing.eventListeners.onActivityDelivery
   */
  handleActivityDelivery(activity: {
    id: string;
    title?: string;
    resourceIdentifier?: string;
    parameters?: string;
  }): void {
    // Look up launch URL from config or activity
    const scoDef = this.config.scoDefinitions?.find((s) => s.id === activity.id);

    const delivery: ScoDelivery = {
      id: activity.id,
      title: activity.title || scoDef?.title || activity.id,
      launchUrl: scoDef?.launchUrl || activity.resourceIdentifier || "",
      parameters: activity.parameters || "",
    };

    this.callbacks.onScoDelivery?.(delivery);
  }

  /**
   * Call this from sequencing.eventListeners.onRollupComplete
   */
  handleRollupComplete(activity: { id: string }): void {
    this.emitScoStatusChange(activity.id);
    this.emitCourseProgressChange();
  }

  /**
   * Call this from sequencing.eventListeners.onSequencingSessionEnd
   */
  handleSequencingSessionEnd(data: {
    reason: string;
    exception?: string;
    navigationRequest?: string;
  }): void {
    const reasonMap: Record<string, SessionEndReason> = {
      complete: "complete",
      suspend: "suspend",
      exit: "exit",
      exitAll: "exit",
      abandon: "abandon",
      abandonAll: "abandon",
    };

    const reason = reasonMap[data.reason] || "exit";

    this.callbacks.onSessionEnd?.(reason, {
      exception: data.exception,
      navigationRequest: data.navigationRequest,
      progress: this.calculateCourseProgress(),
    });
  }

  // ---------------------------------------------------------------------------
  // Emit Helpers
  // ---------------------------------------------------------------------------

  private emitNavigationStateChange(): void {
    // For non-sequenced mode, determine nav state from SCO list
    const scoId = this.config.getCurrentScoId?.();
    const scos = this.config.scoDefinitions || [];

    if (!scoId || scos.length === 0) {
      this.callbacks.onNavigationStateChange?.({
        canPrevious: false,
        canNext: false,
        canExit: true,
        choices: [],
        validRequests: [],
      });
      return;
    }

    const idx = scos.findIndex((s) => s.id === scoId);

    this.callbacks.onNavigationStateChange?.({
      canPrevious: idx > 0,
      canNext: idx < scos.length - 1,
      canExit: true,
      choices: scos.map((s) => s.id),
      validRequests: [],
    });
  }

  private emitScoStatusChange(scoId: string): void {
    const status = this.getScoStatus(scoId);
    this.callbacks.onScoStatusChange?.(scoId, status);
  }

  private emitCourseProgressChange(): void {
    const progress = this.calculateCourseProgress();
    this.callbacks.onCourseProgressChange?.(progress);
  }

  // ---------------------------------------------------------------------------
  // Status Extraction
  // ---------------------------------------------------------------------------

  private getScoStatus(scoId: string): ScoStatus {
    const cmi = (this.api as any).cmi;

    if (this.isScorm2004) {
      return {
        completion: cmi?.completion_status || "unknown",
        success: cmi?.success_status || "unknown",
        score: cmi?.score?.raw != null ? parseFloat(cmi.score.raw) : null,
        scaledScore: cmi?.score?.scaled != null ? parseFloat(cmi.score.scaled) : null,
        location: cmi?.location || "",
        timeSpent: this.parseTime2004(cmi?.total_time || "PT0S"),
      };
    } else {
      const lessonStatus = cmi?.core?.lesson_status || "not attempted";
      return {
        completion: this.mapLessonStatusToCompletion(lessonStatus),
        success: this.mapLessonStatusToSuccess(lessonStatus),
        score: cmi?.core?.score?.raw != null ? parseFloat(cmi.core.score.raw) : null,
        scaledScore: null,
        location: cmi?.core?.lesson_location || "",
        timeSpent: this.parseTime12(cmi?.core?.total_time || "0000:00:00.00"),
      };
    }
  }

  private mapLessonStatusToCompletion(status: string): ScoStatus["completion"] {
    const map: Record<string, ScoStatus["completion"]> = {
      "not attempted": "not attempted",
      incomplete: "incomplete",
      completed: "completed",
      passed: "completed",
      failed: "completed",
      browsed: "incomplete",
    };
    return map[status] || "unknown";
  }

  private mapLessonStatusToSuccess(status: string): ScoStatus["success"] {
    if (status === "passed") return "passed";
    if (status === "failed") return "failed";
    return "unknown";
  }

  private calculateCourseProgress(): CourseProgress {
    // This is a simplified implementation
    // In production, you'd track state across all SCOs
    const scos = this.config.scoDefinitions || [];

    return {
      completionPct: 0,
      avgScore: null,
      totalTime: 0,
      overallStatus: "not attempted",
      completedCount: 0,
      totalCount: scos.length,
    };
  }

  private parseTime12(time: string): number {
    const match = time.match(/^(\d{2,4}):(\d{2}):(\d{2})(?:\.(\d{1,2}))?$/);
    if (!match) return 0;
    const [, h = "0", m = "0", s = "0", cs = "0"] = match;
    return parseInt(h, 10) * 3600 + parseInt(m, 10) * 60 + parseInt(s, 10) + parseInt(cs, 10) / 100;
  }

  private parseTime2004(duration: string): number {
    const match = duration.match(/^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?$/);
    if (!match) return 0;
    const [, d = 0, h = 0, m = 0, s = 0] = match;
    return +d * 86400 + +h * 3600 + +m * 60 + +s;
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  /**
   * Remove all event listeners. Call when destroying the player.
   */
  destroy(): void {
    for (const cleanup of this.cleanupFns) {
      cleanup();
    }
    this.cleanupFns = [];
  }
}

export default PlayerEventAdapter;
