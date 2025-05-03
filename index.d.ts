import { default as Scorm12Impl } from "./src/Scorm12API";
import { CMI as AICCCMI } from "./src/cmi/aicc/cmi";
import { CMI as Scorm12CMI } from "./src/cmi/scorm12/cmi";
import { NAV as Scorm12NAV } from "./src/cmi/scorm12/nav";
import { CMI as Scorm2004CMI } from "./src/cmi/scorm2004/cmi";
import { ADL as Scorm2004ADL } from "./src/cmi/scorm2004/adl";
import { Settings } from "./src/types/api_types";
import { default as Scorm2004Impl } from "./src/Scorm2004API";
import { default as AICCImpl } from "./src/AICC";
import { default as CrossFrameAPIImpl } from "./src/CrossFrameAPI";

declare class Scorm12API extends Scorm12Impl {
  constructor(settings?: Settings);

  cmi: Scorm12CMI;
  nav: Scorm12NAV;
  LMSInitialize: () => string;
  LMSFinish: () => string;
  LMSGetValue: (CMIElement: string) => string;
  LMSSetValue: (CMIElement: string, value: any) => string;
  LMSCommit: () => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (CMIErrorCode: string) => string;
  LMSGetDiagnostic: (CMIErrorCode: string) => string;

  /**
   * Called when the API needs to be reset
   */
  reset(settings?: Settings): void;
}

declare class Scorm2004API extends Scorm2004Impl {
  constructor(settings?: Settings);

  cmi: Scorm2004CMI;
  adl: Scorm2004ADL;
  Initialize: () => string;
  Terminate: () => string;
  GetValue: (CMIElement: string) => string;
  SetValue: (CMIElement: string, value: any) => string;
  Commit: () => string;
  GetLastError: () => string;
  GetErrorString: (CMIErrorCode: string | number) => string;
  GetDiagnostic: (CMIErrorCode: string | number) => string;

  /**
   * Called when the API needs to be reset
   */
  reset(settings?: Settings): void;
}

declare class AICC extends AICCImpl {
  constructor(settings?: Settings);

  cmi: AICCCMI;
  nav: Scorm12NAV;
  LMSInitialize: () => string;
  LMSFinish: () => string;
  LMSGetValue: (CMIElement: string) => string;
  LMSSetValue: (CMIElement: string, value: any) => string;
  LMSCommit: () => string;
  LMSGetLastError: () => string;
  LMSGetErrorString: (CMIErrorCode: string) => string;
  LMSGetDiagnostic: (CMIErrorCode: string) => string;

  /**
   * Called when the API needs to be reset
   */
  reset(settings?: Settings): void;
}

declare class CrossFrameAPI extends CrossFrameAPIImpl {
  constructor(settings?: Settings);

  LMSInitialize: () => Promise<boolean>;
  LMSFinish: () => Promise<boolean>;
  LMSGetValue: (CMIElement: string) => Promise<string>;
  LMSSetValue: (CMIElement: string, value: any) => Promise<boolean>;
  LMSCommit: () => Promise<boolean>;
  LMSGetLastError: () => Promise<string>;
  LMSGetErrorString: (CMIErrorCode: string) => Promise<string>;
  LMSGetDiagnostic: (CMIErrorCode: string) => Promise<string>;
  Initialize: () => Promise<boolean>;
  Terminate: () => Promise<boolean>;
  GetValue: (CMIElement: string) => Promise<string>;
  SetValue: (CMIElement: string, value: any) => Promise<boolean>;
  Commit: () => Promise<boolean>;
  GetLastError: () => Promise<string>;
  GetErrorString: (CMIErrorCode: string | number) => Promise<string>;
  GetDiagnostic: (CMIErrorCode: string | number) => Promise<string>;
}

export { Scorm12API, Scorm2004API, AICC, Settings, CrossFrameAPI, CrossFrameLMS };
