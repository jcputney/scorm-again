import {
  CompletionStatus,
  LogLevelEnum,
  SuccessStatus,
} from "../constants/enums";
import { StringKeyMap } from "../utilities";

/**
 * Base settings type with all properties optional
 */
export type Settings = {
  autocommit?: boolean;
  autocommitSeconds?: number;
  asyncCommit?: boolean;
  sendFullCommit?: boolean;
  lmsCommitUrl?: boolean | string;
  dataCommitFormat?: string;
  commitRequestDataType?: string;
  autoProgress?: boolean;
  logLevel?: LogLevel;
  selfReportSessionTime?: boolean;
  alwaysSendTotalTime?: boolean;
  strict_errors?: boolean;
  xhrHeaders?: StringKeyMap;
  xhrWithCredentials?: boolean;
  fetchMode?: "cors" | "no-cors" | "same-origin" | "navigate";
  responseHandler?: (response: Response) => Promise<ResultObject>;
  requestHandler?: (commitObject: unknown) => unknown;
  onLogMessage?: (messageLevel: LogLevel, logMessage: string) => void;
  mastery_override?: boolean;
  renderCommonCommitFields?: boolean;
  scoItemIds?: string[];
  scoItemIdValidator?: false | ((scoItemId: string) => boolean);
  globalObjectiveIds?: string[];
};

/**
 * Settings type with all properties required
 */
export type RequiredSettings = Required<Settings>;

/**
 * Settings type with specific properties required
 */
export type CoreSettings = Pick<
  Settings,
  "autocommit" | "asyncCommit" | "logLevel" | "strict_errors"
>;

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
  result: string;
  errorCode: number;
  navRequest?: string | StringKeyMap;
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
export type LogLevel =
  | NumericLogLevel
  | StringNumericLogLevel
  | NamedLogLevel
  | LogLevelEnum
  | undefined;
