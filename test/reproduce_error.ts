import { Scorm2004API } from "../src/Scorm2004API";
import { scorm2004_errors } from "../src/constants/error_codes";
import { LogLevelEnum } from "../src/constants/enums";

// Create a SCORM 2004 API instance
const api = new Scorm2004API({ logLevel: LogLevelEnum.DEBUG });

// Initialize the API
api.lmsInitialize();

// Test Case 1: Invalid true-false interaction value
console.log("\n=== Test Case 1: Invalid true-false interaction value ===");
api.lmsSetValue("cmi.interactions.0.id", "interaction_1");
api.lmsSetValue("cmi.interactions.0.type", "true-false");
api.lmsSetValue("cmi.interactions.0.correct_responses.0.pattern", "invalid_value");
let errorCode = api.lmsGetLastError();
console.log(`Error code: ${errorCode}`);
console.log(`Expected: ${scorm2004_errors.TYPE_MISMATCH}`);
console.log(`Is correct: ${errorCode === String(scorm2004_errors.TYPE_MISMATCH)}`);

// Test Case 2: Invalid timestamp format
console.log("\n=== Test Case 2: Invalid timestamp format ===");
api.lmsSetValue("cmi.interactions.0.timestamp", "invalid_timestamp");
errorCode = api.lmsGetLastError();
console.log(`Error code: ${errorCode}`);
console.log(`Expected: ${scorm2004_errors.TYPE_MISMATCH}`);
console.log(`Is correct: ${errorCode === String(scorm2004_errors.TYPE_MISMATCH)}`);

// Test Case 3: Invalid score value (should be between 0 and 1)
console.log("\n=== Test Case 3: Invalid score value ===");
api.lmsSetValue("cmi.score.scaled", "2.0");
errorCode = api.lmsGetLastError();
console.log(`Error code: ${errorCode}`);
console.log(`Expected: ${scorm2004_errors.VALUE_OUT_OF_RANGE}`);
console.log(`Is correct: ${errorCode === String(scorm2004_errors.VALUE_OUT_OF_RANGE)}`);

// Test Case 4: Setting a value for a read-only element
console.log("\n=== Test Case 4: Setting a read-only element ===");
api.lmsSetValue("cmi.completion_status", "invalid");
errorCode = api.lmsGetLastError();
console.log(`Error code: ${errorCode}`);
console.log(
  `Expected: ${scorm2004_errors.TYPE_MISMATCH} or ${scorm2004_errors.VALUE_OUT_OF_RANGE}`,
);
console.log(`Is TYPE_MISMATCH: ${errorCode === String(scorm2004_errors.TYPE_MISMATCH)}`);
console.log(`Is VALUE_OUT_OF_RANGE: ${errorCode === String(scorm2004_errors.VALUE_OUT_OF_RANGE)}`);

// Test Case 5: Setting a value for a non-existent CMI element
console.log("\n=== Test Case 5: Setting a value for a non-existent CMI element ===");
api.lmsSetValue("cmi.non_existent_element", "some_value");
errorCode = api.lmsGetLastError();
console.log(`Error code: ${errorCode}`);
console.log(`Expected: ${scorm2004_errors.UNDEFINED_DATA_MODEL}`);
console.log(`Is correct: ${errorCode === String(scorm2004_errors.UNDEFINED_DATA_MODEL)}`);
console.log(`Is GENERAL: ${errorCode === String(scorm2004_errors.GENERAL)}`);

// Test Case 6: Setting an incorrect value type for an existing element
console.log("\n=== Test Case 6: Setting an incorrect value type for an existing element ===");
api.lmsSetValue("cmi.success_status", "invalid_status");
errorCode = api.lmsGetLastError();
console.log(`Error code: ${errorCode}`);
console.log(`Expected: ${scorm2004_errors.TYPE_MISMATCH}`);
console.log(`Is correct: ${errorCode === String(scorm2004_errors.TYPE_MISMATCH)}`);
console.log(`Is GENERAL: ${errorCode === String(scorm2004_errors.GENERAL)}`);
