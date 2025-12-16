import Scorm12API from "./Scorm12API";
import Scorm2004API from "./Scorm2004API";

declare global {
  interface Window {
    Scorm12API: typeof Scorm12API;
    Scorm2004API: typeof Scorm2004API;
  }
}
