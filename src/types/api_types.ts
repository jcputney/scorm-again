import { CompletionStatus, LogLevelEnum, SuccessStatus } from "../constants/enums";
import { StringKeyMap } from "../utilities";
import { SequencingSettings } from "./sequencing_types";
import type { IHttpService } from "../interfaces/services";

/**
 * Base settings type with all properties optional
 */
export type Settings = {
  autocommit?: boolean | undefined;
  autocommitSeconds?: number | undefined;
  throttleCommits?: boolean | undefined;
  useAsynchronousCommits?: boolean | undefined;
  /**
   * @deprecated Use `useAsynchronousCommits` and `throttleCommits` instead.
   * Setting this to true will enable both useAsynchronousCommits and throttleCommits.
   */
  asyncCommit?: boolean | undefined;
  sendFullCommit?: boolean | undefined;
  lmsCommitUrl?: boolean | string | undefined;
  dataCommitFormat?: string | undefined;
  commitRequestDataType?: string | undefined;
  autoProgress?: boolean | undefined;
  logLevel?: LogLevel | undefined;
  selfReportSessionTime?: boolean | undefined;
  alwaysSendTotalTime?: boolean | undefined;
  strict_errors?: boolean | undefined;
  xhrHeaders?: StringKeyMap | undefined;
  xhrWithCredentials?: boolean | undefined;
  fetchMode?: "cors" | "no-cors" | "same-origin" | "navigate" | undefined;
  responseHandler?: ((response: Response) => Promise<ResultObject>) | undefined;
  xhrResponseHandler?: ((xhr: XMLHttpRequest) => ResultObject) | undefined;
  requestHandler?: ((commitObject: unknown) => unknown) | undefined;
  onLogMessage?: ((messageLevel: LogLevel, logMessage: string) => void) | undefined;
  mastery_override?: boolean | undefined;
  score_overrides_status?: boolean | undefined;
  completion_status_on_failed?: "completed" | "incomplete" | undefined;
  renderCommonCommitFields?: boolean | undefined;
  autoCompleteLessonStatus?: boolean | undefined;
  scoItemIds?: string[] | undefined;
  scoItemIdValidator?: false | ((scoItemId: string) => boolean) | undefined;
  globalObjectiveIds?: string[] | undefined;
  sequencing?: SequencingSettings | undefined;
  /**
   * Controls when sendBeacon is used instead of fetch for async HTTP commits.
   * Only applies when useAsynchronousCommits is true.
   * - "always": Use sendBeacon for all commits
   * - "on-terminate": Use sendBeacon only for termination commits
   * - "never": Always use fetch API
   *
   * Note: In synchronous mode (default), termination always uses sendBeacon
   * and regular commits use synchronous XMLHttpRequest - this setting is ignored.
   */
  asyncModeBeaconBehavior?: "always" | "on-terminate" | "never" | undefined;

  // Offline support settings
  enableOfflineSupport?: boolean | undefined;
  courseId?: string | undefined;
  syncOnInitialize?: boolean | undefined;
  syncOnTerminate?: boolean | undefined;
  maxSyncAttempts?: number | undefined;

  // Multi-SCO support settings
  scoId?: string | undefined;
  autoPopulateCommitMetadata?: boolean | undefined;

  // Sequencing state persistence settings
  sequencingStatePersistence?: SequencingStatePersistenceConfig | undefined;

  // HTTP service settings
  httpService?: IHttpService | null | undefined;

  // Global learner preferences settings
  globalStudentPreferences?: boolean | undefined;
};

/**
 * Settings type with all properties required
 */
export type InternalSettings = {
  autocommit: boolean;
  autocommitSeconds: number;
  throttleCommits: boolean;
  useAsynchronousCommits: boolean;
  sendFullCommit: boolean;
  lmsCommitUrl: string | boolean;
  dataCommitFormat: string;
  commitRequestDataType: string;
  autoProgress: boolean;
  logLevel: LogLevel;
  selfReportSessionTime: boolean;
  renderCommonCommitFields: boolean;
  autoCompleteLessonStatus: boolean;
  alwaysSendTotalTime: boolean;
  strict_errors: boolean;
  xhrHeaders: StringKeyMap;
  xhrWithCredentials: boolean;
  fetchMode: "cors" | "no-cors" | "same-origin" | "navigate";
  responseHandler: (response: Response) => Promise<ResultObject>;
  xhrResponseHandler: (xhr: XMLHttpRequest) => ResultObject;
  requestHandler: (commitObject: unknown) => unknown;
  onLogMessage?: ((messageLevel: LogLevel, logMessage: string) => void) | undefined;
  mastery_override?: boolean | undefined;
  score_overrides_status?: boolean | undefined;
  completion_status_on_failed?: "completed" | "incomplete" | undefined;
  scoItemIds?: string[] | undefined;
  scoItemIdValidator?: false | ((scoItemId: string) => boolean) | undefined;
  globalObjectiveIds?: string[] | undefined;
  sequencing?: SequencingSettings | undefined;
  asyncModeBeaconBehavior: "always" | "on-terminate" | "never";

  // Offline support settings
  enableOfflineSupport?: boolean | undefined;
  courseId?: string | undefined;
  syncOnInitialize?: boolean | undefined;
  syncOnTerminate?: boolean | undefined;
  maxSyncAttempts?: number | undefined;

  // Multi-SCO support settings
  scoId?: string | undefined;
  autoPopulateCommitMetadata?: boolean | undefined;

  // Sequencing state persistence settings
  sequencingStatePersistence?: SequencingStatePersistenceConfig | undefined;

  // HTTP service settings
  httpService: IHttpService | null;

  // Global learner preferences settings
  globalStudentPreferences?: boolean | undefined;
};

export type RefObject = {
  [key: string]: any;
};

/**
 * Represents a value that can be stored in a reference.
 * This is a recursive type that can contain primitive values or arrays of RefValues.
 */
export type RefValue = string | number | boolean | null | undefined | RefArray;

/**
 * An array of RefValue objects.
 * Using ReadonlyArray for better immutability support.
 */
export type RefArray = ReadonlyArray<RefValue>;

/**
 * Represents the result of an API operation.
 */
export type ResultObject = {
  result: string | boolean;
  errorCode: number;
  navRequest?: string | StringKeyMap;
  errorMessage?: string;
  errorDetails?: string;
};

/**
 * Represents a read-only result object.
 */
export type ReadonlyResultObject = Readonly<ResultObject>;

/**
 * Represents a score with optional components.
 */
export type ScoreObject = {
  raw?: number;
  min?: number;
  max?: number;
  scaled?: number;
};

/**
 * Represents a score with all components required.
 */
export type CompleteScoreObject = Required<ScoreObject>;

/**
 * Represents a commit object sent to the LMS.
 */
export type CommitObject = {
  successStatus: SuccessStatus;
  completionStatus: CompletionStatus;
  totalTimeSeconds: number;
  runtimeData: StringKeyMap;
  score?: ScoreObject;
  commitId?: string;
  courseId?: string;
  scoId?: string;
  learnerId?: string;
  learnerName?: string;
  sessionId?: string;
  activityId?: string;
  attempt?: number;
};

/**
 * Represents a commit object with a required score.
 */
export type CommitObjectWithScore = CommitObject & { score: ScoreObject };

/**
 * Numeric log levels
 */
export type NumericLogLevel = 1 | 2 | 3 | 4 | 5;

/**
 * String representations of numeric log levels
 */
export type StringNumericLogLevel = "1" | "2" | "3" | "4" | "5";

/**
 * Named log levels
 */
export type NamedLogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "NONE";

/**
 * All possible log level values
 */
export type LogLevel = NumericLogLevel | StringNumericLogLevel | NamedLogLevel | LogLevelEnum;

/**
 * Metadata for sequencing state operations
 */
export type SequencingStateMetadata = {
  /** Unique identifier for the learner */
  learnerId: string;
  /** Course/SCO identifier */
  courseId: string;
  /** Optional attempt number */
  attemptNumber?: number;
  /** Timestamp of last update */
  lastUpdated?: string;
  /** State format version for compatibility */
  version?: string;
};

/**
 * Callback interface for LMS state persistence operations
 */
export type SequencingStatePersistence = {
  /**
   * Save sequencing state to persistent storage
   * @param stateData - Serialized sequencing state
   * @param metadata - Additional context about the state
   * @returns Promise resolving to success status
   */
  saveState: (stateData: string, metadata: SequencingStateMetadata) => Promise<boolean>;

  /**
   * Load sequencing state from persistent storage
   * @param metadata - Context for loading the correct state
   * @returns Promise resolving to serialized state or null if not found
   */
  loadState: (metadata: SequencingStateMetadata) => Promise<string | null>;

  /**
   * Optional: Clear/delete sequencing state
   * @param metadata - Context for the state to clear
   * @returns Promise resolving to success status
   */
  clearState?: (metadata: SequencingStateMetadata) => Promise<boolean>;
};

/**
 * Configuration for sequencing state persistence
 */
export type SequencingStatePersistenceConfig = {
  /** LMS callback interface */
  persistence: SequencingStatePersistence;
  /** When to auto-save state (default: 'commit') */
  autoSaveOn?: "commit" | "setValue" | "navigate" | "never";
  /** Compress state data (default: true) */
  compress?: boolean;
  /** Maximum state size in bytes (default: 50KB) */
  maxStateSize?: number;
  /** State format version (default: '1.0') */
  stateVersion?: string;
  /** Debug logging for persistence operations */
  debugPersistence?: boolean;
};

/**
 * Represents an entry in the global objective map used for SCORM 2004 sequencing.
 * This structure stores objective state information including satisfaction status,
 * measures, and completion status along with flags indicating which properties
 * are known and which can be read/written.
 */
export type GlobalObjectiveMapEntry = {
  /** Unique identifier for the objective */
  id?: string;
  /** Whether the objective was satisfied (passed) */
  satisfiedStatus?: boolean;
  /** Whether the satisfied status is known/set */
  satisfiedStatusKnown?: boolean;
  /** Normalized measure value (typically -1 to 1) */
  normalizedMeasure?: number;
  /** Whether the normalized measure is known/set */
  normalizedMeasureKnown?: boolean;
  /** Progress measure value (typically 0 to 1) */
  progressMeasure?: number;
  /** Whether the progress measure is known/set */
  progressMeasureKnown?: boolean;
  /** Completion status string (e.g., 'completed', 'incomplete') */
  completionStatus?: string;
  /** Whether the completion status is known/set */
  completionStatusKnown?: boolean;
  /** Whether satisfied status can be read */
  readSatisfiedStatus?: boolean;
  /** Whether satisfied status can be written */
  writeSatisfiedStatus?: boolean;
  /** Whether normalized measure can be read */
  readNormalizedMeasure?: boolean;
  /** Whether normalized measure can be written */
  writeNormalizedMeasure?: boolean;
  /** Whether progress measure can be read */
  readProgressMeasure?: boolean;
  /** Whether progress measure can be written */
  writeProgressMeasure?: boolean;
  /** Whether completion status can be read */
  readCompletionStatus?: boolean;
  /** Whether completion status can be written */
  writeCompletionStatus?: boolean;
  /** Timestamp of last update */
  lastUpdated?: string;
};
