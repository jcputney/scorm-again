/**
 * SCORM 1.2 LMS Helper Types
 *
 * These types support LMS developers implementing multi-SCO course management.
 * They are designed to work alongside the Scorm12API, not replace it.
 */

/**
 * SCORM 1.2 Lesson Status values
 */
export type LessonStatus =
  | "passed"
  | "completed"
  | "failed"
  | "incomplete"
  | "browsed"
  | "not attempted";

/**
 * SCORM 1.2 Exit values that indicate what the SCO wants to do next
 */
export type ExitAction = "time-out" | "suspend" | "logout" | "";

/**
 * Score data from a SCO
 */
export interface ScoScore {
  raw?: number;
  min?: number;
  max?: number;
  /** Calculated normalized score (0-1) based on raw/min/max */
  scaled?: number;
}

/**
 * Complete state of a single SCO
 */
export interface ScoState {
  /** Unique identifier for this SCO */
  id: string;
  /** Display title */
  title: string;
  /** Current lesson status */
  lessonStatus: LessonStatus;
  /** Score data */
  score: ScoScore;
  /** Total time spent (SCORM 1.2 format: HH:MM:SS.SS) */
  totalTime: string;
  /** Session time from current/last attempt */
  sessionTime: string;
  /** Mastery score threshold (0-100) - if set, determines pass/fail */
  masteryScore?: number | undefined;
  /** Exit action from last LMSFinish */
  exitAction: ExitAction;
  /** Suspend data for resuming */
  suspendData: string;
  /** Lesson location bookmark */
  lessonLocation: string;
  /** Number of attempts on this SCO */
  attemptCount: number;
  /** Timestamp of first launch */
  firstLaunchTime?: Date | undefined;
  /** Timestamp of last activity */
  lastAccessTime?: Date | undefined;
  /** Whether this SCO has ever been launched */
  hasBeenLaunched: boolean;
}

/**
 * Definition of a SCO in the course structure (from manifest)
 */
export interface ScoDefinition {
  /** Unique identifier */
  id: string;
  /** Display title */
  title: string;
  /** Launch URL */
  launchUrl: string;
  /** Mastery score threshold (0-100) */
  masteryScore?: number;
  /** Maximum time allowed (SCORM format) */
  maxTimeAllowed?: string;
  /** What to do when time limit is exceeded */
  timeLimitAction?: "exit,message" | "exit,no message" | "continue,message" | "continue,no message";
  /** Order in sequence (0-based) */
  sequenceIndex: number;
  /** Custom metadata from manifest */
  metadata?: Record<string, unknown>;
}

/**
 * Navigation suggestion returned after processing exit
 */
export interface NavigationSuggestion {
  /** Suggested action */
  action: "continue" | "previous" | "choice" | "suspend" | "exit" | "retry";
  /** Target SCO ID if action is continue/previous/choice */
  targetScoId?: string;
  /** Reason for this suggestion */
  reason: string;
}

/**
 * Options for course rollup calculations
 */
export interface RollupOptions {
  /** How to calculate course score from SCO scores */
  scoreMethod: "average" | "weighted" | "highest" | "lowest" | "sum" | "last";
  /** Weights for weighted scoring (scoId -> weight) */
  weights?: Map<string, number>;
  /** How to determine course completion */
  completionMethod: "all" | "any" | "percentage";
  /** Percentage threshold for 'percentage' completion method */
  completionThreshold?: number;
  /** How to determine course pass/fail */
  statusMethod: "all_passed" | "any_passed" | "score_threshold" | "completion_only";
  /** Score threshold for 'score_threshold' status method */
  passingScore?: number;
  /** Which statuses count as "completed" for rollup */
  completedStatuses?: LessonStatus[];
}

/**
 * Result of course rollup calculation
 */
export interface CourseRollupResult {
  /** Calculated course score (0-100) */
  score?: number | undefined;
  /** Course completion percentage (0-100) */
  completionPercentage: number;
  /** Overall course status */
  status: LessonStatus;
  /** Total time across all SCOs */
  totalTime: string;
  /** Number of SCOs completed */
  completedCount: number;
  /** Total number of SCOs */
  totalCount: number;
  /** Detailed breakdown by SCO */
  scoResults: Array<{
    id: string;
    title: string;
    status: LessonStatus;
    score?: number | undefined;
    contributedToCompletion: boolean;
  }>;
}

/**
 * Event data emitted during SCO state changes
 */
export interface ScoStateChangeEvent {
  scoId: string;
  previousState: ScoState | null;
  currentState: ScoState;
  changedFields: Array<keyof ScoState>;
}

/**
 * Default rollup options
 */
export const DEFAULT_ROLLUP_OPTIONS: RollupOptions = {
  scoreMethod: "average",
  completionMethod: "all",
  statusMethod: "all_passed",
  completedStatuses: ["passed", "completed", "failed"],
};
