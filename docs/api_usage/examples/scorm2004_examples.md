# SCORM 2004 API Examples

This document provides comprehensive examples for using the SCORM 2004 API in scorm-again.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Initialization and Termination](#initialization-and-termination)
3. [Setting and Getting Values](#setting-and-getting-values)
4. [Tracking Student Progress](#tracking-student-progress)
5. [Handling Interactions](#handling-interactions)
6. [Using Event Listeners](#using-event-listeners)
7. [Sequencing and Navigation](#sequencing-and-navigation)
8. [Advanced Configuration](#advanced-configuration)

## Basic Setup

### Including the API

```html
<!-- Option 1: Include the full library -->
<script type="text/javascript" src="/dist/scorm-again.js"></script>

<!-- Option 2: Include only the SCORM 2004 API -->
<script type="text/javascript" src="/dist/scorm2004.js"></script>
```

### Initializing the API

```javascript
// Option 1: Using the full library
import { Scorm2004API } from "scorm-again";

// Option 2: Using only the SCORM 2004 API
import { Scorm2004API } from "scorm-again/dist/scorm2004";

// Create settings object
const settings = {
   lmsCommitUrl: "https://your-lms.com/commit",
   autocommit: true,
   logLevel: 2, // INFO level
   autoProgress: false, // Set to true to automatically throw SequenceNext event
};

// Initialize the API
window.API_1484_11 = new Scorm2004API(settings);
```

## Initialization and Termination

### Initialize the SCORM Session

```javascript
// Initialize the SCORM session
const result = window.API_1484_11.Initialize("");
console.log("Initialization result:", result); // Should return "true"

// Check if initialized
if (window.API_1484_11.isInitialized()) {
   console.log("SCORM 2004 API is initialized and ready to use");
}
```

### Terminate the SCORM Session

```javascript
// Terminate the SCORM session
const result = window.API_1484_11.Terminate("");
console.log("Termination result:", result); // Should return "true"

// Check if terminated
if (window.API_1484_11.isTerminated()) {
   console.log("SCORM 2004 API session has been terminated");
}
```

## Setting and Getting Values

### Setting Learner Information

```javascript
// Set learner ID
window.API_1484_11.SetValue("cmi.learner_id", "12345");

// Set learner name
window.API_1484_11.SetValue("cmi.learner_name", "John Doe");

// Set learner preference for language
window.API_1484_11.SetValue("cmi.learner_preference.language", "en-US");

// Commit the changes
window.API_1484_11.Commit("");
```

### Getting Learner Information

```javascript
// Get learner ID
const learnerId = window.API_1484_11.GetValue("cmi.learner_id");
console.log("Learner ID:", learnerId);

// Get learner name
const learnerName = window.API_1484_11.GetValue("cmi.learner_name");
console.log("Learner Name:", learnerName);

// Get learner preference for language
const language = window.API_1484_11.GetValue("cmi.learner_preference.language");
console.log("Language Preference:", language);
```

### Setting and Getting Completion Status

```javascript
// Set completion status (valid values: 'completed', 'incomplete', 'not attempted', 'unknown')
window.API_1484_11.SetValue("cmi.completion_status", "completed");

// Get completion status
const completionStatus = window.API_1484_11.GetValue("cmi.completion_status");
console.log("Completion Status:", completionStatus);
```

### Setting and Getting Success Status

```javascript
// Set success status (valid values: 'passed', 'failed', 'unknown')
window.API_1484_11.SetValue("cmi.success_status", "passed");

// Get success status
const successStatus = window.API_1484_11.GetValue("cmi.success_status");
console.log("Success Status:", successStatus);
```

## Tracking Student Progress

### Setting Score

```javascript
// Set scaled score (between -1.0 and 1.0, typically 0.0 to 1.0)
window.API_1484_11.SetValue("cmi.score.scaled", "0.85");

// Set raw score
window.API_1484_11.SetValue("cmi.score.raw", "85");

// Set min score
window.API_1484_11.SetValue("cmi.score.min", "0");

// Set max score
window.API_1484_11.SetValue("cmi.score.max", "100");

// Commit the changes
window.API_1484_11.Commit("");
```

### Setting Progress Measure

```javascript
// Set progress measure (between 0.0 and 1.0)
window.API_1484_11.SetValue("cmi.progress_measure", "0.75");

// Get progress measure
const progressMeasure = window.API_1484_11.GetValue("cmi.progress_measure");
console.log("Progress Measure:", progressMeasure);
```

### Setting Location

```javascript
// Set location (bookmark)
window.API_1484_11.SetValue("cmi.location", "page_5");

// Get location
const location = window.API_1484_11.GetValue("cmi.location");
console.log("Location:", location);
```

### Setting Session Time

```javascript
// Set session time (format: ISO 8601 duration format, e.g., PT1H30M5S for 1 hour, 30 minutes, 5 seconds)
window.API_1484_11.SetValue("cmi.session_time", "PT1H30M0S");
```

### Using Suspend Data

```javascript
// Set suspend data (for storing custom state information)
const suspendData = JSON.stringify({
   lastPage: 5,
   quizAttempts: 2,
   userSelections: [1, 3, 4],
   completedModules: ["intro", "chapter1", "chapter2"],
});
window.API_1484_11.SetValue("cmi.suspend_data", suspendData);

// Get suspend data
const retrievedSuspendData = window.API_1484_11.GetValue("cmi.suspend_data");
const parsedData = JSON.parse(retrievedSuspendData);
console.log("Last Page:", parsedData.lastPage);
console.log("Completed Modules:", parsedData.completedModules);
```

## Handling Interactions

### Recording a Multiple Choice Question

```javascript
// Set interaction ID
window.API_1484_11.SetValue("cmi.interactions.0.id", "question1");

// Set interaction type (valid types: 'true-false', 'choice', 'fill-in', 'long-fill-in', 'matching', 'performance', 'sequencing', 'likert', 'numeric', 'other')
window.API_1484_11.SetValue("cmi.interactions.0.type", "choice");

// Set learner response
window.API_1484_11.SetValue("cmi.interactions.0.learner_response", "a[,]c");

// Set correct response
window.API_1484_11.SetValue("cmi.interactions.0.correct_responses.0.pattern", "a[,]c");

// Set result
window.API_1484_11.SetValue("cmi.interactions.0.result", "correct");

// Set description
window.API_1484_11.SetValue(
    "cmi.interactions.0.description",
    "Which of the following are primary colors?",
);

// Set timestamp
window.API_1484_11.SetValue("cmi.interactions.0.timestamp", "2023-04-01T14:30:00");

// Set weighting
window.API_1484_11.SetValue("cmi.interactions.0.weighting", "1");

// Set latency (time taken to answer, in ISO 8601 format)
window.API_1484_11.SetValue("cmi.interactions.0.latency", "PT1M30S");

// Commit the changes
window.API_1484_11.Commit("");
```

### Recording a True/False Question

```javascript
// Set interaction ID
window.API_1484_11.SetValue("cmi.interactions.1.id", "question2");

// Set interaction type
window.API_1484_11.SetValue("cmi.interactions.1.type", "true-false");

// Set learner response
window.API_1484_11.SetValue("cmi.interactions.1.learner_response", "true");

// Set correct response
window.API_1484_11.SetValue("cmi.interactions.1.correct_responses.0.pattern", "true");

// Set result
window.API_1484_11.SetValue("cmi.interactions.1.result", "correct");

// Commit the changes
window.API_1484_11.Commit("");
```

### Recording a Fill-in Question

```javascript
// Set interaction ID
window.API_1484_11.SetValue("cmi.interactions.2.id", "question3");

// Set interaction type
window.API_1484_11.SetValue("cmi.interactions.2.type", "fill-in");

// Set learner response
window.API_1484_11.SetValue("cmi.interactions.2.learner_response", "Paris");

// Set correct response (case insensitive match)
window.API_1484_11.SetValue(
    "cmi.interactions.2.correct_responses.0.pattern",
    "{case_matters=false}Paris",
);

// Set result
window.API_1484_11.SetValue("cmi.interactions.2.result", "correct");

// Commit the changes
window.API_1484_11.Commit("");
```

### Recording a Matching Question

```javascript
// Set interaction ID
window.API_1484_11.SetValue("cmi.interactions.3.id", "question4");

// Set interaction type
window.API_1484_11.SetValue("cmi.interactions.3.type", "matching");

// Set learner response (format: source.target,source.target)
window.API_1484_11.SetValue("cmi.interactions.3.learner_response", "a[.]1[,]b[.]2[,]c[.]3");

// Set correct response
window.API_1484_11.SetValue(
    "cmi.interactions.3.correct_responses.0.pattern",
    "a[.]1[,]b[.]2[,]c[.]3",
);

// Set result
window.API_1484_11.SetValue("cmi.interactions.3.result", "correct");

// Commit the changes
window.API_1484_11.Commit("");
```

## Using Event Listeners

### Adding Event Listeners

```javascript
// Listen for Initialize
window.API_1484_11.on("Initialize", function () {
   console.log("Initialize was called");
});

// Listen for SetValue on a specific element
window.API_1484_11.on("SetValue.cmi.completion_status", function (element, value) {
   console.log(`Completion status changed to: ${value}`);
});

// Listen for any SetValue call
window.API_1484_11.on("SetValue.*", function (element, value) {
   console.log(`Element ${element} set to: ${value}`);
});

// Listen for Commit
window.API_1484_11.on("Commit", function () {
   console.log("Data was committed to the LMS");
});

// Listen for Terminate
window.API_1484_11.on("Terminate", function () {
   console.log("Session is being terminated");
});
```

### Removing Event Listeners

```javascript
// Define a callback function
function initCallback() {
   console.log("Initialize was called");
}

// Add the listener
window.API_1484_11.on("Initialize", initCallback);

// Later, remove the specific listener
window.API_1484_11.off("Initialize", initCallback);

// Or clear all listeners for an event
window.API_1484_11.clear("Initialize");
```

## Sequencing and Navigation

### Using Sequencing Commands

```javascript
// Continue to the next activity
window.API_1484_11.SequenceNext("");

// Go back to the previous activity
window.API_1484_11.SequencePrevious("");

// Jump to a specific activity
window.API_1484_11.SequenceChoice("module3");

// Exit the current activity
window.API_1484_11.SequenceExit("");

// Exit all activities
window.API_1484_11.SequenceExitAll("");

// Abandon the current activity
window.API_1484_11.SequenceAbandon("");

// Abandon all activities
window.API_1484_11.SequenceAbandonAll("");
```

### Setting Up Sequencing Validation

```javascript
const settings = {
   scoItemIds: ["intro", "chapter1", "chapter2", "chapter3", "quiz"],
   scoItemIdValidator: function (scoId) {
      // Custom validation logic
      return settings.scoItemIds.includes(scoId);
   },
};

window.API_1484_11 = new Scorm2004API(settings);

// Now when SequenceChoice is called, it will validate the SCO ID
```

## Advanced Configuration

### Custom Response Handler

```javascript
const settings = {
   lmsCommitUrl: "https://your-lms.com/commit",
   responseHandler: function (response) {
      const responseObj = JSON.parse(response.text());
      return {
         result: responseObj.success,
         errorCode: responseObj.error,
      };
   },
};

window.API_1484_11 = new Scorm2004API(settings);
```

### Custom Request Handler

```javascript
const settings = {
   lmsCommitUrl: "https://your-lms.com/commit",
   requestHandler: function (commitObject) {
      // Add custom fields or modify the commit object
      commitObject.custom_field = "custom_value";
      return commitObject;
   },
};

window.API_1484_11 = new Scorm2004API(settings);
```

### Custom Logging

```javascript
const settings = {
   logLevel: 2, // INFO level
   onLogMessage: function (level, message) {
      // Send logs to a custom logging service
      customLoggingService.log(`[${level}] ${message}`);
   },
};

window.API_1484_11 = new Scorm2004API(settings);
```

### Auto Progress Configuration

```javascript
const settings = {
   autoProgress: true, // Automatically throw SequenceNext event after completion
};

window.API_1484_11 = new Scorm2004API(settings);

// When the content is completed, the API will automatically call SequenceNext
window.API_1484_11.SetValue("cmi.completion_status", "completed");
window.API_1484_11.SetValue("cmi.success_status", "passed");
window.API_1484_11.Commit("");
// SequenceNext will be automatically called
```

### Pre-loading Data

```javascript
// Initialize API
window.API_1484_11 = new Scorm2004API();

// Pre-load learner data
window.API_1484_11.cmi.learner_id = "12345";
window.API_1484_11.cmi.learner_name = "John Doe";
window.API_1484_11.cmi.entry = "resume";
window.API_1484_11.cmi.location = "page_5";
window.API_1484_11.cmi.completion_status = "incomplete";
window.API_1484_11.cmi.success_status = "unknown";
window.API_1484_11.cmi.score.raw = "75";
window.API_1484_11.cmi.score.scaled = "0.75";

// Or load from JSON
const learnerData = {
   "cmi.learner_id": "12345",
   "cmi.learner_name": "John Doe",
   "cmi.entry": "resume",
   "cmi.location": "page_5",
   "cmi.completion_status": "incomplete",
   "cmi.success_status": "unknown",
   "cmi.score.raw": "75",
   "cmi.score.scaled": "0.75",
};

window.API_1484_11.loadFromFlattenedJSON(learnerData);

// Now initialize the session
window.API_1484_11.Initialize("");
```

### Self-Reporting Session Time

```javascript
const settings = {
   selfReportSessionTime: true,
};

window.API_1484_11 = new Scorm2004API(settings);

// The API will automatically track session time
// and report it when Terminate is called
```

### Data Commit Format Configuration

```javascript
const settings = {
   lmsCommitUrl: "https://your-lms.com/commit",
   dataCommitFormat: "flattened", // Options: 'json', 'flattened', 'params'
   sendFullCommit: false, // Only send fields that contain values
};

window.API_1484_11 = new Scorm2004API(settings);

// When Commit is called, data will be sent in the specified format
```
