// Type definitions for scorm-again
// Project: https://github.com/jcputney/scorm-again

// Main APIs
export { default as Scorm12API } from "./dist/types/Scorm12API";
export { default as Scorm2004API } from "./dist/types/Scorm2004API";
export { default as AICC } from "./dist/types/AICC";
export { default as CrossFrameAPI } from "./dist/types/CrossFrameAPI";
export { default as CrossFrameLMS } from "./dist/types/CrossFrameLMS";

// Re-export all other types
export * from "./dist/types/BaseAPI";
export * from "./dist/types/constants/api_constants";
export * from "./dist/types/constants/error_codes";
export * from "./dist/types/constants/enums";
export * from "./dist/types/constants/language_constants";
export * from "./dist/types/constants/regex";
export * from "./dist/types/constants/response_constants";
export * from "./dist/types/utilities";
export * from "./dist/types/exceptions";
export * from "./dist/types/types/api_types";

// CMI Types
export * from "./dist/types/cmi/aicc/cmi";
export * from "./dist/types/cmi/scorm12/cmi";
export * from "./dist/types/cmi/scorm2004/cmi";
export * from "./dist/types/cmi/scorm2004/adl";

// Service Types
export * from "./dist/types/interfaces/services";