import { Scorm12API as Scorm12Impl } from "./src/Scorm12API";
import { CMI as Scorm12CMI } from "./src/cmi/scorm12/cmi";
import { NAV as Scorm12NAV } from "./src/cmi/scorm12/nav";
import { CMI as Scorm2004CMI } from "./src/cmi/scorm2004/cmi";
import { ADL as Scorm2004ADL } from "./src/cmi/scorm2004/adl";
import { Settings } from "./src/types/api_types";
import { Scorm2004API as Scorm2004Impl } from "./src/Scorm2004API";
import { AICC as AICCImpl } from "./src/AICC";

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

  loadFromJSON: (json: any, CMIElement?: string) => void;
  loadFromFlattenedJSON: (json: any, CMIElement?: string) => void;
  on: (listenerName: string, callback: Function) => void;
  off: (listenerName: string, callback: Function) => void;
  clear: (listenerName: string) => void;


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
  GetErrorString: (CMIErrorCode: string) => string;
  GetDiagnostic: (CMIErrorCode: string) => string;

  loadFromJSON: (json: any, CMIElement?: string) => void;
  loadFromFlattenedJSON: (json: any, CMIElement?: string) => void;
  on: (listenerName: string, callback: Function) => void;
  off: (listenerName: string, callback: Function) => void;
  clear: (listenerName: string) => void;


  /**
   * Called when the API needs to be reset
   */
  reset(settings?: Settings): void;
}

declare class AICC extends AICCImpl {
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

  loadFromJSON: (json: any, CMIElement?: string) => void;
  loadFromFlattenedJSON: (json: any, CMIElement?: string) => void;
  on: (listenerName: string, callback: Function) => void;
  off: (listenerName: string, callback: Function) => void;
  clear: (listenerName: string) => void;


  /**
   * Called when the API needs to be reset
   */
  reset(settings?: Settings): void;
}

export { Scorm12API, Scorm2004API, AICC, Settings };
