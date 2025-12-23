---
sidebar_position: 2
title: "Event Listeners"
description: "Event system documentation for SCORM API interactions"
---

# Event Listeners

The scorm-again library provides a comprehensive event system that allows you to listen for and respond to all SCORM API interactions. This is useful for tracking learner activity, updating UI elements, logging, and implementing custom behaviors.

## Overview

Event listeners can be registered on the API object using the `on()` method. You can listen for:

- **API method calls** - `Initialize`, `Terminate`, `GetValue`, `SetValue`, `Commit`, etc.
- **CMI element changes** - Specific data elements like `cmi.core.lesson_status`
- **Wildcard patterns** - All elements under a namespace like `cmi.*`
- **Navigation events** - Sequencing navigation requests (SCORM 2004 only)

## Listener Methods

### Adding Listeners

Use the `on()` method to add an event listener:

```javascript
window.API.on(eventName, callbackFunction);
```

### Removing Listeners

Use the `off()` method to remove a specific callback:

```javascript
window.API.off(eventName, callbackFunction);
```

### Clearing All Listeners

Use the `clear()` method to remove all callbacks for an event:

```javascript
window.API.clear(eventName);
```

## SCORM 1.2 Event Listeners

### Available Events

The following events are available for SCORM 1.2:

- `LMSInitialize` - Called when the API is initialized
- `LMSFinish` - Called when the API is terminated
- `LMSGetValue` - Called when a value is retrieved
- `LMSSetValue` - Called when a value is set
- `LMSCommit` - Called when data is committed
- `LMSGetLastError` - Called when the last error is retrieved
- `LMSGetErrorString` - Called when an error string is retrieved
- `LMSGetDiagnostic` - Called when diagnostic information is retrieved
- `SequenceNext` - (If using navigation) Called when moving to next activity
- `SequencePrevious` - (If using navigation) Called when moving to previous activity

### Basic Example

```javascript
// Listen for initialization
window.API.on("LMSInitialize", function() {
  console.log("SCORM API initialized");
});

// Listen for completion
window.API.on("LMSFinish", function() {
  console.log("SCORM session ended");
});

// Listen for commits
window.API.on("LMSCommit", function() {
  console.log("Data committed to LMS");
});
```

### Listening to Specific CMI Elements

You can listen for changes to specific CMI elements:

```javascript
// Listen for lesson status changes
window.API.on("LMSSetValue.cmi.core.lesson_status", function(CMIElement, value) {
  console.log(`Lesson status changed to: ${value}`);
});

// Listen for score changes
window.API.on("LMSSetValue.cmi.core.score.raw", function(CMIElement, value) {
  console.log(`Score set to: ${value}`);
});

// Listen for suspend data changes
window.API.on("LMSSetValue.cmi.suspend_data", function(CMIElement, value) {
  console.log(`Suspend data updated: ${value}`);
});
```

### Wildcard Listeners

Use the `*` wildcard to listen for all elements under a namespace:

```javascript
// Listen for any value being set in cmi.core
window.API.on("LMSSetValue.cmi.core.*", function(CMIElement, value) {
  console.log(`${CMIElement} set to ${value}`);
});

// Listen for all SetValue calls
window.API.on("LMSSetValue.cmi.*", function(CMIElement, value) {
  console.log(`CMI element ${CMIElement} changed to ${value}`);
});
```

### Removing Listeners

```javascript
// Define callback function
const initCallback = function() {
  console.log("Initialized");
};

// Add listener
window.API.on("LMSInitialize", initCallback);

// Remove specific callback
window.API.off("LMSInitialize", initCallback);

// Or clear all callbacks for an event
window.API.clear("LMSInitialize");
```

## SCORM 2004 Event Listeners

### Available Events

The following events are available for SCORM 2004:

**Basic API Methods:**
- `Initialize` - Called when the API is initialized
- `Terminate` - Called when the API is terminated
- `GetValue` - Called when a value is retrieved
- `SetValue` - Called when a value is set
- `Commit` - Called when data is committed
- `GetLastError` - Called when the last error is retrieved
- `GetErrorString` - Called when an error string is retrieved
- `GetDiagnostic` - Called when diagnostic information is retrieved

**Navigation Methods:**
- `SequenceNext` - Navigate to the next activity
- `SequencePrevious` - Navigate to the previous activity
- `SequenceChoice` - Navigate to a specific activity
- `SequenceJump` - Jump to a specific activity
- `SequenceExit` - Exit the current activity
- `SequenceExitAll` - Exit all activities and end the session
- `SequenceAbandon` - Abandon the current activity
- `SequenceAbandonAll` - Abandon all activities
- `SequenceRetry` - Retry the current activity
- `SequenceRetryAll` - Retry from the root activity
- `ActivityDelivered` - An activity is ready for delivery
- `SequencingComplete` - Sequencing process completed
- `SequencingError` - Sequencing error occurred

### Basic Example

```javascript
// Listen for initialization
window.API_1484_11.on("Initialize", function() {
  console.log("SCORM 2004 API initialized");
});

// Listen for termination
window.API_1484_11.on("Terminate", function() {
  console.log("SCORM 2004 session ended");
});

// Listen for commits
window.API_1484_11.on("Commit", function() {
  console.log("Data committed to LMS");
});
```

### Listening to Specific CMI Elements

```javascript
// Listen for completion status changes
window.API_1484_11.on("SetValue.cmi.completion_status", function(CMIElement, value) {
  console.log(`Completion status: ${value}`);
});

// Listen for success status changes
window.API_1484_11.on("SetValue.cmi.success_status", function(CMIElement, value) {
  console.log(`Success status: ${value}`);
});

// Listen for learner ID access
window.API_1484_11.on("GetValue.cmi.learner_id", function(CMIElement, value) {
  console.log(`Learner ID accessed: ${value}`);
});

// Listen for score changes
window.API_1484_11.on("SetValue.cmi.score.scaled", function(CMIElement, value) {
  console.log(`Scaled score set to: ${value}`);
});
```

### Wildcard Listeners

```javascript
// Listen for all cmi.score changes
window.API_1484_11.on("SetValue.cmi.score.*", function(CMIElement, value) {
  console.log(`Score element ${CMIElement} changed to ${value}`);
});

// Listen for all SetValue calls
window.API_1484_11.on("SetValue.cmi.*", function(CMIElement, value) {
  console.log(`${CMIElement} = ${value}`);
});

// Listen for all interactions
window.API_1484_11.on("SetValue.cmi.interactions.*", function(CMIElement, value) {
  console.log(`Interaction data: ${CMIElement} = ${value}`);
});
```

### Navigation Event Listeners

Navigation events are particularly important when implementing SCORM 2004 sequencing:

```javascript
// Listen for next activity request
window.API_1484_11.on("SequenceNext", function() {
  console.log("Moving to next activity");
  // LMS should load the next SCO
});

// Listen for previous activity request
window.API_1484_11.on("SequencePrevious", function() {
  console.log("Moving to previous activity");
  // LMS should load the previous SCO
});

// Listen for choice navigation (with target)
window.API_1484_11.on("SequenceChoice", function(targetActivityId) {
  console.log(`Choice navigation to: ${targetActivityId}`);
  // LMS should load the specified SCO
});

// Listen for activity delivery
window.API_1484_11.on("ActivityDelivered", function(activity) {
  console.log(`Delivering activity: ${activity.id}`);
  // LMS should launch the specified activity
});

// Listen for exit
window.API_1484_11.on("SequenceExit", function() {
  console.log("Exiting current activity");
  // LMS should handle exit logic
});

// Listen for exit all
window.API_1484_11.on("SequenceExitAll", function() {
  console.log("Exiting all activities");
  // LMS should end the session
});
```

### Removing Listeners

```javascript
// Define callback function
const terminateCallback = function() {
  console.log("Terminated");
};

// Add listener
window.API_1484_11.on("Terminate", terminateCallback);

// Remove specific callback
window.API_1484_11.off("Terminate", terminateCallback);

// Or clear all callbacks for an event
window.API_1484_11.clear("Terminate");
```

## Practical Examples

### Updating UI Based on Progress

```javascript
// SCORM 1.2
window.API.on("LMSSetValue.cmi.core.lesson_status", function(CMIElement, value) {
  const statusElement = document.getElementById('lesson-status');
  if (statusElement) {
    statusElement.textContent = value;
    statusElement.className = `status-${value}`;
  }
});

// SCORM 2004
window.API_1484_11.on("SetValue.cmi.completion_status", function(CMIElement, value) {
  updateProgressBar(value);
});

function updateProgressBar(status) {
  const progressBar = document.getElementById('progress-bar');
  if (status === 'completed') {
    progressBar.style.width = '100%';
    progressBar.classList.add('complete');
  }
}
```

### Logging All Interactions

```javascript
// Log all API calls
const logEvent = function(eventName) {
  return function(...args) {
    console.log(`[${new Date().toISOString()}] ${eventName}:`, args);
  };
};

window.API_1484_11.on("Initialize", logEvent("Initialize"));
window.API_1484_11.on("Terminate", logEvent("Terminate"));
window.API_1484_11.on("GetValue", logEvent("GetValue"));
window.API_1484_11.on("SetValue", logEvent("SetValue"));
window.API_1484_11.on("Commit", logEvent("Commit"));
```

### Custom Analytics Tracking

```javascript
// Track completion events
window.API.on("LMSSetValue.cmi.core.lesson_status", function(CMIElement, value) {
  if (value === 'completed' || value === 'passed') {
    // Send to analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'scorm_completion', {
        'event_category': 'SCORM',
        'event_label': 'Lesson Completed',
        'value': 1
      });
    }
  }
});

// Track quiz scores
window.API_1484_11.on("SetValue.cmi.score.scaled", function(CMIElement, value) {
  // Send score to analytics
  if (typeof gtag !== 'undefined') {
    gtag('event', 'scorm_score', {
      'event_category': 'SCORM',
      'event_label': 'Quiz Score',
      'value': parseFloat(value) * 100
    });
  }
});
```

### Validation and Warnings

```javascript
// Warn if suspend data is getting large
window.API.on("LMSSetValue.cmi.suspend_data", function(CMIElement, value) {
  const maxSize = 4096; // SCORM 1.2 limit
  if (value.length > maxSize) {
    console.warn(`Suspend data exceeds recommended size: ${value.length} > ${maxSize}`);
  }
});

// Validate score is in valid range
window.API_1484_11.on("SetValue.cmi.score.scaled", function(CMIElement, value) {
  const score = parseFloat(value);
  if (score < -1 || score > 1) {
    console.error(`Invalid scaled score: ${score}. Must be between -1 and 1.`);
  }
});
```

### Implementing Auto-Save Indicator

```javascript
let saveIndicator;
let saveTimeout;

window.API_1484_11.on("SetValue.cmi.*", function() {
  // Show "saving..." indicator
  if (!saveIndicator) {
    saveIndicator = document.getElementById('save-indicator');
  }

  if (saveIndicator) {
    saveIndicator.textContent = 'Saving...';
    saveIndicator.style.display = 'block';
  }

  // Clear existing timeout
  clearTimeout(saveTimeout);
});

window.API_1484_11.on("Commit", function() {
  // Change to "saved" after commit
  if (saveIndicator) {
    saveIndicator.textContent = 'Saved';

    // Hide after 2 seconds
    saveTimeout = setTimeout(function() {
      saveIndicator.style.display = 'none';
    }, 2000);
  }
});
```

## Best Practices

### 1. Clean Up Listeners

Always remove listeners when they're no longer needed to prevent memory leaks:

```javascript
// Store reference to callback
const myCallback = function() { /* ... */ };

// Add listener
window.API.on("LMSCommit", myCallback);

// Remove when done
window.API.off("LMSCommit", myCallback);
```

### 2. Use Specific Listeners When Possible

Prefer specific element listeners over wildcards for better performance:

```javascript
// Good - specific
window.API.on("LMSSetValue.cmi.core.lesson_status", handleStatus);

// Less efficient - wildcard
window.API.on("LMSSetValue.cmi.*", function(element, value) {
  if (element === "cmi.core.lesson_status") {
    handleStatus(element, value);
  }
});
```

### 3. Avoid Heavy Processing in Listeners

Keep listener callbacks lightweight to avoid blocking:

```javascript
// Good - async processing
window.API.on("LMSCommit", function() {
  setTimeout(function() {
    // Heavy processing here
    updateComplexUI();
  }, 0);
});
```

### 4. Handle Errors Gracefully

```javascript
window.API.on("LMSSetValue.cmi.core.lesson_status", function(element, value) {
  try {
    updateUI(value);
  } catch (error) {
    console.error("Error in event listener:", error);
  }
});
```

## Related Documentation

- [Settings Reference](./settings-reference.md) - Configuration options
- [Data Formats](./data-formats.md) - Data commit formats
