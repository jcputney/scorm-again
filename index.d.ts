// Re-export all types from the generated declarations
export * from "./dist/types/Scorm12API";
export * from "./dist/types/Scorm2004API";
export * from "./dist/types/AICC";
export * from "./dist/types/types/api_types";
export * from "./dist/types/constants/enums";
export * from "./dist/types/constants/error_codes";
export * from "./dist/types/constants/api_constants";
export * from "./dist/types/exceptions";
export * from "./dist/types/exceptions/scorm12_exceptions";
export * from "./dist/types/exceptions/scorm2004_exceptions";
export * from "./dist/types/exceptions/aicc_exceptions";

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

// Export the main API classes and commonly used types
export { Scorm12API, Scorm2004API, AICC, Settings };