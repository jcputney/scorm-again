// Test script to directly verify the regex pattern
const fs = require('fs');
const path = require('path');

// Read the regex.ts file
const regexFile = fs.readFileSync(path.join(__dirname, '../src/constants/regex.ts'), 'utf8');

// Extract the CMITime regex pattern
const cmiTimeRegexMatch = regexFile.match(/CMITime:\s*"([^"]+)"/);
if (!cmiTimeRegexMatch) {
  console.error('Could not find CMITime regex pattern in the file');
  process.exit(1);
}

const cmiTimeRegex = cmiTimeRegexMatch[1];
console.log('CMITime regex pattern:', cmiTimeRegex);

// Create a RegExp object from the pattern
const regex = new RegExp(cmiTimeRegex);

// Test the example timestamp
const timestamp = "2025-04-02T18:49:50.328Z";
const isMatch = regex.test(timestamp);

console.log(`Testing timestamp: ${timestamp}`);
console.log(`Matches CMITime regex: ${isMatch}`);

// Test other timestamps
const timestamps = [
  "2019-06-25",
  "2019-06-25T23:59",
  "2019-06-25T23:59:59.99",
  "2019-06-25T23:59:59.999",
  "1970-01-01",
  "2019-06-25T",
  "2019-06-25T25:59:59.99",
  "2019-13-31",
  "1969-12-31",
  "-00:00:30",
  "0:50:30",
  "23:00:30."
];

console.log('\nTesting other timestamps:');
timestamps.forEach(ts => {
  const matches = regex.test(ts);
  console.log(`${ts}: ${matches}`);
});