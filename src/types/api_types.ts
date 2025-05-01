import {
  CompletionStatus,
  LogLevelEnum,
  SuccessStatus,
} from "../constants/enums";

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
  xhrHeaders?: RefObject;
  xhrWithCredentials?: boolean;
  fetchMode?: "cors" | "no-cors" | "same-origin" | "navigate";
  responseHandler?: (response: Response) => Promise<ResultObject>;
  requestHandler?: (commitObject: any) => any;
  onLogMessage?: (messageLevel: LogLevel, logMessage: string) => void;
  mastery_override?: boolean;
  renderCommonCommitFields?: boolean;
  scoItemIds?: string[];
  scoItemIdValidator?: false | ((scoItemId: string) => boolean);
  globalObjectiveIds?: string[];
};

export type InternalSettings = {
  autocommit: boolean;
  autocommitSeconds: number;
  asyncCommit: boolean;
  sendFullCommit: boolean;
  lmsCommitUrl: boolean | string;
  dataCommitFormat: string;
  commitRequestDataType: string;
  autoProgress: boolean;
  logLevel: LogLevel;
  selfReportSessionTime: boolean;
  renderCommonCommitFields?: boolean;
  scoItemIds?: string[];
  scoItemIdValidator?: false | ((scoItemId: string) => boolean);
  globalObjectiveIds?: string[];
  alwaysSendTotalTime: boolean;
  strict_errors: boolean;
  xhrHeaders: RefObject;
  xhrWithCredentials: boolean;
  mastery_override?: boolean;
  fetchMode: "cors" | "no-cors" | "same-origin" | "navigate";
  responseHandler: (response: Response) => Promise<ResultObject>;
  requestHandler: (commitObject: any) => any;
  onLogMessage: (messageLevel: LogLevel, logMessage: string) => void;
};

export type RefObject = {
  [key: string]: any;
};

export type ResultObject = {
  result: string;
  errorCode: number;
  navRequest?: string;
};

export type ScoreObject = {
  raw?: number;
  min?: number;
  max?: number;
  scaled?: number;
};

export type CommitObject = {
  successStatus: SuccessStatus;
  completionStatus: CompletionStatus;
  totalTimeSeconds: number;
  runtimeData: RefObject;
  score?: ScoreObject;
};

export type LogLevel =
  | 1
  | 2
  | 3
  | 4
  | 5
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "DEBUG"
  | "INFO"
  | "WARN"
  | "ERROR"
  | "NONE"
  | LogLevelEnum;
