---
sidebar_position: 2
title: SCORM 1.2 Guide
description: Comprehensive guide for implementing and using the SCORM 1.2 API with practical examples
---

# SCORM 1.2 API Examples

This document provides comprehensive examples for using the SCORM 1.2 API in scorm-again.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Initialization and Termination](#initialization-and-termination)
3. [Setting and Getting Values](#setting-and-getting-values)
4. [Tracking Student Progress](#tracking-student-progress)
5. [Handling Interactions](#handling-interactions)
6. [Using Event Listeners](#using-event-listeners)
7. [Advanced Configuration](#advanced-configuration)

## Basic Setup

### Including the API

```html
<!-- Option 1: Include the full library -->
<script type="text/javascript" src="/dist/scorm-again.js"></script>

<!-- Option 2: Include only the SCORM 1.2 API -->
<script type="text/javascript" src="/dist/scorm12.js"></script>
```

### Initializing the API

```javascript
// Option 1: Using the full library
import { Scorm12API } from "scorm-again";

// Option 2: Using only the SCORM 1.2 API
import { Scorm12API } from "scorm-again/dist/scorm12";

// Create settings object
const settings = {
   lmsCommitUrl: "https://your-lms.com/commit",
   autocommit: true,
   logLevel: 2, // INFO level
   mastery_override: true, // Override lesson_status based on score and mastery score
};

// Initialize the API
window.API = new Scorm12API(settings);
```

## Initialization and Termination

### Initialize the SCORM Session

```javascript
// Initialize the SCORM session
const result = window.API.LMSInitialize("");
console.log("Initialization result:", result); // Should return "true"

// Check if initialized
if (window.API.isInitialized()) {
   console.log("SCORM 1.2 API is initialized and ready to use");
}
```

### Terminate the SCORM Session

```javascript
// Terminate the SCORM session
const result = window.API.LMSFinish("");
console.log("Termination result:", result); // Should return "true"

// Check if terminated
if (window.API.isTerminated()) {
   console.log("SCORM 1.2 API session has been terminated");
}
```

## Setting and Getting Values

### Setting Student Information

```javascript
// Set student ID
window.API.LMSSetValue("cmi.core.student_id", "12345");

// Set student name
window.API.LMSSetValue("cmi.core.student_name", "John Doe");

// Commit the changes
window.API.LMSCommit("");
```

### Getting Student Information

```javascript
// Get student ID
const studentId = window.API.LMSGetValue("cmi.core.student_id");
console.log("Student ID:", studentId);

// Get student name
const studentName = window.API.LMSGetValue("cmi.core.student_name");
console.log("Student Name:", studentName);
```

### Setting and Getting Lesson Status

```javascript
// Set lesson status (valid values: 'passed', 'completed', 'failed', 'incomplete', 'browsed', 'not attempted')
window.API.LMSSetValue("cmi.core.lesson_status", "completed");

// Get lesson status
const lessonStatus = window.API.LMSGetValue("cmi.core.lesson_status");
console.log("Lesson Status:", lessonStatus);
```

## Tracking Student Progress

### Setting Score

```javascript
// Set raw score
window.API.LMSSetValue("cmi.core.score.raw", "85");

// Set min score
window.API.LMSSetValue("cmi.core.score.min", "0");

// Set max score
window.API.LMSSetValue("cmi.core.score.max", "100");

// Set mastery score (if using mastery_override)
window.API.LMSSetValue("cmi.student_data.mastery_score", "70");

// Commit the changes
window.API.LMSCommit("");
```

### Setting Lesson Location

```javascript
// Set lesson location (bookmark)
window.API.LMSSetValue("cmi.core.lesson_location", "page_5");

// Get lesson location
const lessonLocation = window.API.LMSGetValue("cmi.core.lesson_location");
console.log("Lesson Location:", lessonLocation);
```

### Setting Session Time

```javascript
// Set session time (format: HH:MM:SS)
window.API.LMSSetValue("cmi.core.session_time", "01:30:00");
```

### Using Suspend Data

```javascript
// Set suspend data (for storing custom state information)
const suspendData = JSON.stringify({
   lastPage: 5,
   quizAttempts: 2,
   userSelections: [1, 3, 4],
});
window.API.LMSSetValue("cmi.suspend_data", suspendData);

// Get suspend data
const retrievedSuspendData = window.API.LMSGetValue("cmi.suspend_data");
const parsedData = JSON.parse(retrievedSuspendData);
console.log("Last Page:", parsedData.lastPage);
```

## Handling Interactions

### Recording a Multiple Choice Question

```javascript
// Set interaction ID
window.API.LMSSetValue("cmi.interactions.0.id", "question1");

// Set interaction type (valid types: 'true-false', 'choice', 'fill-in', 'matching', 'performance', 'sequencing', 'likert', 'numeric')
window.API.LMSSetValue("cmi.interactions.0.type", "choice");

// Set student response
window.API.LMSSetValue("cmi.interactions.0.student_response", "a,c");

// Set correct response
window.API.LMSSetValue("cmi.interactions.0.correct_responses.0.pattern", "a,c");

// Set result
window.API.LMSSetValue("cmi.interactions.0.result", "correct");

// Set weighting
window.API.LMSSetValue("cmi.interactions.0.weighting", "1");

// Set latency (time taken to answer)
window.API.LMSSetValue("cmi.interactions.0.latency", "00:01:30");

// Commit the changes
window.API.LMSCommit("");
```

### Recording a True/False Question

```javascript
// Set interaction ID
window.API.LMSSetValue("cmi.interactions.1.id", "question2");

// Set interaction type
window.API.LMSSetValue("cmi.interactions.1.type", "true-false");

// Set student response
window.API.LMSSetValue("cmi.interactions.1.student_response", "t");

// Set correct response
window.API.LMSSetValue("cmi.interactions.1.correct_responses.0.pattern", "t");

// Set result
window.API.LMSSetValue("cmi.interactions.1.result", "correct");

// Commit the changes
window.API.LMSCommit("");
```

### Recording a Fill-in Question

```javascript
// Set interaction ID
window.API.LMSSetValue("cmi.interactions.2.id", "question3");

// Set interaction type
window.API.LMSSetValue("cmi.interactions.2.type", "fill-in");

// Set student response
window.API.LMSSetValue("cmi.interactions.2.student_response", "Paris");

// Set correct response
window.API.LMSSetValue("cmi.interactions.2.correct_responses.0.pattern", "Paris");

// Set result
window.API.LMSSetValue("cmi.interactions.2.result", "correct");

// Commit the changes
window.API.LMSCommit("");
```

## Using Event Listeners

### Adding Event Listeners

```javascript
// Listen for LMSInitialize
window.API.on("LMSInitialize", function () {
   console.log("LMSInitialize was called");
});

// Listen for LMSSetValue on a specific element
window.API.on("LMSSetValue.cmi.core.lesson_status", function (element, value) {
   console.log(`Lesson status changed to: ${value}`);
});

// Listen for any LMSSetValue call
window.API.on("LMSSetValue.*", function (element, value) {
   console.log(`Element ${element} set to: ${value}`);
});

// Listen for LMSCommit
window.API.on("LMSCommit", function () {
   console.log("Data was committed to the LMS");
});
```

### Removing Event Listeners

```javascript
// Define a callback function
function initCallback() {
   console.log("LMSInitialize was called");
}

// Add the listener
window.API.on("LMSInitialize", initCallback);

// Later, remove the specific listener
window.API.off("LMSInitialize", initCallback);

// Or clear all listeners for an event
window.API.clear("LMSInitialize");
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

window.API = new Scorm12API(settings);
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

window.API = new Scorm12API(settings);
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

window.API = new Scorm12API(settings);
```

### Using Mastery Override

```javascript
const settings = {
   mastery_override: true,
};

window.API = new Scorm12API(settings);

// Set mastery score
window.API.LMSSetValue("cmi.student_data.mastery_score", "70");

// Set raw score
window.API.LMSSetValue("cmi.core.score.raw", "85");

// The API will automatically set lesson_status to 'passed'
// since the raw score (85) is greater than the mastery score (70)

// If you set a raw score below the mastery score:
window.API.LMSSetValue("cmi.core.score.raw", "65");
// The API will automatically set lesson_status to 'failed'
```

### Pre-loading Data

```javascript
// Initialize API
window.API = new Scorm12API();

// Pre-load student data
window.API.cmi.core.student_id = "12345";
window.API.cmi.core.student_name = "John Doe";
window.API.cmi.core.entry = "resume";
window.API.cmi.core.lesson_location = "page_5";
window.API.cmi.core.lesson_status = "incomplete";
window.API.cmi.core.score.raw = "75";

// Or load from JSON
const studentData = {
   "cmi.core.student_id": "12345",
   "cmi.core.student_name": "John Doe",
   "cmi.core.entry": "resume",
   "cmi.core.lesson_location": "page_5",
   "cmi.core.lesson_status": "incomplete",
   "cmi.core.score.raw": "75",
};

window.API.loadFromFlattenedJSON(studentData);

// Now initialize the session
window.API.LMSInitialize("");
```

### Self-Reporting Session Time

```javascript
const settings = {
   selfReportSessionTime: true,
};

window.API = new Scorm12API(settings);

// The API will automatically track session time
// and report it when LMSFinish is called
```
