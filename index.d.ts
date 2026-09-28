// Type definitions for scorm-again
// Project: https://github.com/jcputney/scorm-again

// Main APIs
export { default as Scorm12API } from "./dist/types/Scorm12API.js";
export { default as Scorm2004API } from "./dist/types/Scorm2004API.js";
export { default as CrossFrameAPI } from "./dist/types/CrossFrameAPI.js";
export { default as CrossFrameLMS } from "./dist/types/CrossFrameLMS.js";

// Re-export all other types
export * from "./dist/types/BaseAPI.js";
export * from "./dist/types/constants/api_constants.js";
export * from "./dist/types/constants/error_codes.js";
export * from "./dist/types/constants/enums.js";
export * from "./dist/types/constants/language_constants.js";
export * from "./dist/types/constants/regex.js";
export * from "./dist/types/constants/response_constants.js";
export * from "./dist/types/utilities/index.js";
export * from "./dist/types/exceptions/index.js";
export * from "./dist/types/types/api_types.js";

// CMI Types
export * from "./dist/types/cmi/scorm12/cmi.js";
export * from "./dist/types/cmi/scorm2004/cmi.js";
export * from "./dist/types/cmi/scorm2004/adl.js";

// Service Types
export * from "./dist/types/interfaces/services.js";
