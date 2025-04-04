# AICC API Examples

This document provides comprehensive examples for using the AICC API in SCORM Again.

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

<!-- Option 2: Include only the AICC API -->
<script type="text/javascript" src="/dist/aicc.js"></script>
```

### Initializing the API

```javascript
// Option 1: Using the full library
import { AICC } from 'scorm-again';

// Option 2: Using only the AICC API
import { AICC } from 'scorm-again/dist/aicc';

// Create settings object
const settings = {
  lmsCommitUrl: 'https://your-lms.com/commit',
  autocommit: true,
  logLevel: 2  // INFO level
};

// Initialize the API
window.API = new AICC(settings);
```

## Initialization and Termination

### Initialize the AICC Session

```javascript
// Initialize the AICC session
const result = window.API.LMSInitialize('');
console.log('Initialization result:', result); // Should return "true"

// Check if initialized
if (window.API.isInitialized()) {
  console.log('AICC API is initialized and ready to use');
}
```

### Terminate the AICC Session

```javascript
// Terminate the AICC session
const result = window.API.LMSFinish('');
console.log('Termination result:', result); // Should return "true"

// Check if terminated
if (window.API.isTerminated()) {
  console.log('AICC API session has been terminated');
}
```

## Setting and Getting Values

### Setting Student Information

```javascript
// Set student ID
window.API.LMSSetValue('cmi.core.student_id', '12345');

// Set student name
window.API.LMSSetValue('cmi.core.student_name', 'John Doe');

// Commit the changes
window.API.LMSCommit('');
```

### Getting Student Information

```javascript
// Get student ID
const studentId = window.API.LMSGetValue('cmi.core.student_id');
console.log('Student ID:', studentId);

// Get student name
const studentName = window.API.LMSGetValue('cmi.core.student_name');
console.log('Student Name:', studentName);
```

### Setting and Getting Lesson Status

```javascript
// Set lesson status
window.API.LMSSetValue('cmi.core.lesson_status', 'completed');

// Get lesson status
const lessonStatus = window.API.LMSGetValue('cmi.core.lesson_status');
console.log('Lesson Status:', lessonStatus);
```

## Tracking Student Progress

### Setting Score

```javascript
// Set raw score
window.API.LMSSetValue('cmi.core.score.raw', '85');

// Set min score
window.API.LMSSetValue('cmi.core.score.min', '0');

// Set max score
window.API.LMSSetValue('cmi.core.score.max', '100');

// Commit the changes
window.API.LMSCommit('');
```

### Setting Lesson Location

```javascript
// Set lesson location (bookmark)
window.API.LMSSetValue('cmi.core.lesson_location', 'page_5');

// Get lesson location
const lessonLocation = window.API.LMSGetValue('cmi.core.lesson_location');
console.log('Lesson Location:', lessonLocation);
```

### Setting Session Time

```javascript
// Set session time (format: HH:MM:SS)
window.API.LMSSetValue('cmi.core.session_time', '01:30:00');
```

## Handling Interactions

### Recording a Multiple Choice Question

```javascript
// Set interaction ID
window.API.LMSSetValue('cmi.interactions.0.id', 'question1');

// Set interaction type
window.API.LMSSetValue('cmi.interactions.0.type', 'choice');

// Set student response
window.API.LMSSetValue('cmi.interactions.0.student_response', 'a,c');

// Set correct response
window.API.LMSSetValue('cmi.interactions.0.correct_responses.0.pattern', 'a,c');

// Set result
window.API.LMSSetValue('cmi.interactions.0.result', 'correct');

// Set weighting
window.API.LMSSetValue('cmi.interactions.0.weighting', '1');

// Set latency (time taken to answer)
window.API.LMSSetValue('cmi.interactions.0.latency', '00:01:30');

// Commit the changes
window.API.LMSCommit('');
```

### Recording a Fill-in Question

```javascript
// Set interaction ID
window.API.LMSSetValue('cmi.interactions.1.id', 'question2');

// Set interaction type
window.API.LMSSetValue('cmi.interactions.1.type', 'fill-in');

// Set student response
window.API.LMSSetValue('cmi.interactions.1.student_response', 'Paris');

// Set correct response
window.API.LMSSetValue('cmi.interactions.1.correct_responses.0.pattern', 'Paris');

// Set result
window.API.LMSSetValue('cmi.interactions.1.result', 'correct');

// Commit the changes
window.API.LMSCommit('');
```

## Using Event Listeners

### Adding Event Listeners

```javascript
// Listen for LMSInitialize
window.API.on('LMSInitialize', function () {
    console.log('LMSInitialize was called');
});

// Listen for LMSSetValue on a specific element
window.API.on('LMSSetValue.cmi.core.lesson_status', function (element, value) {
    console.log(`Lesson status changed to: ${value}`);
});

// Listen for any LMSSetValue call
window.API.on('LMSSetValue.*', function (element, value) {
    console.log(`Element ${element} set to: ${value}`);
});
```

### Removing Event Listeners

```javascript
// Define a callback function
function initCallback() {
    console.log('LMSInitialize was called');
}

// Add the listener
window.API.on('LMSInitialize', initCallback);

// Later, remove the specific listener
window.API.off('LMSInitialize', initCallback);

// Or clear all listeners for an event
window.API.clear('LMSInitialize');
```

## Advanced Configuration

### Custom Response Handler

```javascript
const settings = {
  lmsCommitUrl: 'https://your-lms.com/commit',
  responseHandler: function(response) {
    const responseObj = JSON.parse(response.text());
    return {
      result: responseObj.success,
      errorCode: responseObj.error
    };
  }
};

window.API = new AICC(settings);
```

### Custom Request Handler

```javascript
const settings = {
  lmsCommitUrl: 'https://your-lms.com/commit',
  requestHandler: function(commitObject) {
    // Add custom fields or modify the commit object
    commitObject.custom_field = 'custom_value';
    return commitObject;
  }
};

window.API = new AICC(settings);
```

### Custom Logging

```javascript
const settings = {
  logLevel: 2, // INFO level
  onLogMessage: function(level, message) {
    // Send logs to a custom logging service
    customLoggingService.log(`[${level}] ${message}`);
  }
};

window.API = new AICC(settings);
```

### Pre-loading Data

```javascript
// Initialize API
window.API = new AICC();

// Pre-load student data
window.API.cmi.core.student_id = '12345';
window.API.cmi.core.student_name = 'John Doe';
window.API.cmi.core.entry = 'resume';
window.API.cmi.core.lesson_location = 'page_5';
window.API.cmi.core.lesson_status = 'incomplete';
window.API.cmi.core.score.raw = '75';

// Or load from JSON
const studentData = {
    'cmi.core.student_id': '12345',
    'cmi.core.student_name': 'John Doe',
    'cmi.core.entry': 'resume',
    'cmi.core.lesson_location': 'page_5',
    'cmi.core.lesson_status': 'incomplete',
    'cmi.core.score.raw': '75'
};

window.API.loadFromFlattenedJSON(studentData);

// Now initialize the session
window.API.LMSInitialize('');
```