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
import { default as CrossFrameLMSImpl } from "./src/CrossFrameLMS";
import { IBaseAPI } from "./src/interfaces/IBaseAPI";

// Import implementations for extending
import { Scorm12API as Scorm12APIImpl } from "./dist/types/Scorm12API";
import { Scorm2004API as Scorm2004APIImpl } from "./dist/types/Scorm2004API";
import { AICC as AICCImpl } from "./dist/types/AICC";
import { Settings } from "./dist/types/types/api_types";

// Declare the main API classes
declare class Scorm12API extends Scorm12APIImpl {
  constructor(settings?: Settings);
}

declare class Scorm2004API extends Scorm2004APIImpl {
  constructor(settings?: Settings);
}

declare class AICC extends AICCImpl {
  constructor(settings?: Settings);
}

declare class CrossFrameAPI extends CrossFrameAPIImpl {
  constructor(targetOrigin?: string, targetWindow?: Window);
}

declare class CrossFrameLMS extends CrossFrameLMSImpl {
  constructor(api: IBaseAPI, targetOrigin?: string);
}

export { Scorm12API, Scorm2004API, AICC, Settings, CrossFrameAPI, CrossFrameLMS };
