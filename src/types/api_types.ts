export type Settings = {
  autocommit: boolean;
  autocommitSeconds: number;
  asyncCommit: boolean;
  sendFullCommit: boolean;
  lmsCommitUrl: boolean | string;
  dataCommitFormat: string;
  commitRequestDataType: string;
  autoProgress: boolean;
  logLevel: number;
  selfReportSessionTime: boolean;
  alwaysSendTotalTime: boolean;
  strict_errors: boolean;
  xhrHeaders: RefObject;
  xhrWithCredentials: boolean;
  responseHandler: (response: Response) => Promise<ResultObject>;
  requestHandler: (commitObject: any) => any;
  onLogMessage: (messageLevel: number, logMessage: string) => void;
  mastery_override?: boolean;
};

export type RefObject = {
  [key: string]: any;
};

export type ResultObject = {
  result: string;
  errorCode: number;
  navRequest?: string;
};
