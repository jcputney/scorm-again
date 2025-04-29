import AICCImpl from "./AICC";
import Scorm12Impl from "./Scorm12API";
import Scorm2004Impl from "./Scorm2004API";

// Export with the desired names
export const AICC = AICCImpl;
export const Scorm12API = Scorm12Impl;
export const Scorm2004API = Scorm2004Impl;

// Also export as default object for compatibility
export default {
  AICC: AICCImpl,
  Scorm12API: Scorm12Impl,
  Scorm2004API: Scorm2004Impl
};
