// Test script to verify that setting an invalid timestamp value returns error code 406
// Run this script in a browser after loading the SCORM API

// Initialize the API
window.API_1484_11.Initialize("");

// Try to set an invalid timestamp value
const result = window.API_1484_11.SetValue("cmi.interactions.0.timestamp", "328457jh");

// Check the error code
const errorCode = window.API_1484_11.GetLastError();
console.log(`Error code: ${errorCode}`);

// Verify that the error code is 406 (TYPE_MISMATCH)
if (errorCode === "406") {
  console.log("Test passed: Error code is 406 (TYPE_MISMATCH) as expected");
} else {
  console.log(`Test failed: Error code is ${errorCode}, expected 406 (TYPE_MISMATCH)`);
}