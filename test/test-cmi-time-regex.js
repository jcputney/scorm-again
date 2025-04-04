// Test script to verify the CMITime regex pattern

// Example timestamp that should match
const timestamp = "2025-04-02T18:49:50.328Z";

// Create a simple regex that matches ISO 8601 dates with optional milliseconds
const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,6})?(Z|[+-]\d{2}:\d{2})?$/;

// Test if the timestamp matches the pattern
const isMatch = regex.test(timestamp);

console.log(`Testing timestamp: ${timestamp}`);
console.log(`Matches CMITime regex: ${isMatch}`);

// Test other valid timestamps
const validTimestamps = [
  "2023-01-01T00:00:00Z",
  "2023-01-01T00:00:00.1Z",
  "2023-01-01T00:00:00.12Z",
  "2023-01-01T00:00:00.123Z",
  "2023-01-01T00:00:00+01:00",
  "2023-01-01T00:00:00-01:00",
  "2023-01-01T00:00:00.123+01:00",
  "2023-01-01T00:00:00.123-01:00"
];

console.log("\nTesting other valid timestamps:");
validTimestamps.forEach(ts => {
  const matches = regex.test(ts);
  console.log(`${ts}: ${matches}`);
});
