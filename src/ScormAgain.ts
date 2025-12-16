import Scorm12API from "./Scorm12API";
import Scorm2004API from "./Scorm2004API";

// Explicitly assign to window for global usage
if (typeof window !== "undefined") {
  window.Scorm12API = Scorm12API;
  window.Scorm2004API = Scorm2004API;
}
