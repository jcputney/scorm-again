import AICCImpl from "./AICC";
import Scorm12Impl from "./Scorm12API";
import Scorm2004Impl from "./Scorm2004API";

const Scorm12API = Scorm12Impl;
const Scorm2004API = Scorm2004Impl;
const AICC = AICCImpl;

export { Scorm12API, Scorm2004API, AICC };
