import { CompletionStatus, SuccessStatus } from "../constants/enums";

export type Settings = {
  autocommit?: boolean;
  autocommitSeconds?: number;
  asyncCommit?: boolean;
  sendFullCommit?: boolean;
  lmsCommitUrl?: boolean | string;
  dataCommitFormat?: string;
  commitRequestDataType?: string;
  autoProgress?: boolean;
  logLevel?: number;
  selfReportSessionTime?: boolean;
  alwaysSendTotalTime?: boolean;
  strict_errors?: boolean;
  xhrHeaders?: RefObject;
  xhrWithCredentials?: boolean;
  responseHandler?: (response: Response) => Promise<ResultObject>;
  requestHandler?: (commitObject: any) => any;
  onLogMessage?: (messageLevel: number, logMessage: string) => void;
  scoItemIds?: string[];
  scoItemIdValidator?: false | ((scoItemId: string) => boolean);
  mastery_override?: boolean;
  renderCommonCommitFields?: boolean;
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
