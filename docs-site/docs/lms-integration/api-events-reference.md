---
sidebar_position: 5
title: API Events Reference
description: Complete reference for all events available in scorm-again APIs, their payloads, and usage patterns.
---
# API Events Reference

This reference documents all events available in scorm-again APIs, their payloads, and usage patterns.

## Event System Overview

### Registering Listeners

Use the `on()` method to register event listeners:

```javascript
// Basic event listener
api.on("Initialize", function() {
  console.log("SCO initialized");
});

// With callback receiving data
api.on("SetValue", function(element, value) {
  console.log(`${element} set to ${value}`);
});
```

### Removing Listeners

Use the `off()` method to remove event listeners:

```javascript
const myCallback = function(element, value) {
  console.log(`${element} = ${value}`);
};

// Register
api.on("SetValue", myCallback);

// Later, remove
api.off("SetValue", myCallback);
```

### Event Naming Conventions

Events follow the API method names:
- **SCORM 1.2**: `LMSInitialize`, `LMSFinish`, `LMSGetValue`, `LMSSetValue`, `LMSCommit`
- **SCORM 2004**: `Initialize`, `Terminate`, `GetValue`, `SetValue`, `Commit`

---

## Listener Patterns

### Standard Listeners

Listen to any API method call:

```javascript
api.on("SetValue", function(element, value) {
  // Fires on ANY SetValue call
});
```

### Wildcard Listeners

Match multiple events using dot notation:

```javascript
// Listen to all SetValue calls for score elements
api.on("SetValue.cmi.score.*", function(element, value) {
  console.log(`Score updated: ${element} = ${value}`);
});

// Listen to all SetValue calls
api.on("SetValue.*", function(element, value) {
  // Fires on every SetValue
});
```

### Element-Specific Listeners

Listen to specific CMI elements:

```javascript
// SCORM 1.2: Listen only to lesson_status changes
api.on("LMSSetValue.cmi.core.lesson_status", function(element, value) {
  console.log(`Status changed to: ${value}`);
});

// SCORM 2004: Listen only to completion_status changes
api.on("SetValue.cmi.completion_status", function(element, value) {
  updateProgressUI(value);
});
```

---

## Core API Events

### SCORM 1.2 Events

| Event | Fires When | Callback Signature |
|-------|------------|-------------------|
| `LMSInitialize` | SCO calls LMSInitialize() | `function()` |
| `LMSFinish` | SCO calls LMSFinish() | `function()` |
| `LMSGetValue` | SCO calls LMSGetValue() | `function(element)` |
| `LMSSetValue` | SCO calls LMSSetValue() | `function(element, value)` |
| `LMSCommit` | SCO calls LMSCommit() | `function()` |
| `LMSGetLastError` | SCO calls LMSGetLastError() | `function()` |
| `LMSGetErrorString` | SCO calls LMSGetErrorString() | `function(errorCode)` |
| `LMSGetDiagnostic` | SCO calls LMSGetDiagnostic() | `function(errorCode)` |

### SCORM 2004 Events

| Event | Fires When | Callback Signature |
|-------|------------|-------------------|
| `Initialize` | SCO calls Initialize() | `function()` |
| `Terminate` | SCO calls Terminate() | `function()` |
| `GetValue` | SCO calls GetValue() | `function(element)` |
| `SetValue` | SCO calls SetValue() | `function(element, value)` |
| `Commit` | SCO calls Commit() | `function()` |
| `GetLastError` | SCO calls GetLastError() | `function()` |
| `GetErrorString` | SCO calls GetErrorString() | `function(errorCode)` |
| `GetDiagnostic` | SCO calls GetDiagnostic() | `function(errorCode)` |

---

## Commit Events

### BeforeTerminate

Fires immediately before termination processing begins. Use for cleanup or final data sync.

```javascript
api.on("BeforeTerminate", function() {
  // Perform cleanup before termination
  saveAdditionalAnalytics();
});
```

### CommitSuccess

Fires when a commit to the LMS succeeds (internal event, not typically used by LMS integrators).

### CommitError

Fires when a commit to the LMS fails (internal event, not typically used by LMS integrators).

---

## Offline Events

These events fire when offline support is enabled (`enableOfflineSupport: true`).

### OfflineDataSynced

Fires when queued offline data successfully syncs to the server.

```javascript
api.on("OfflineDataSynced", function() {
  showNotification("Data synchronized successfully");
});
```

### OfflineDataSyncFailed

Fires when offline data sync fails after all retry attempts.

```javascript
api.on("OfflineDataSyncFailed", function() {
  showNotification("Sync failed - data saved locally", "warning");
});
```

---

## Navigation Events

### SequenceNext

Fires when SCORM 2004 content requests navigation to the next activity.

```javascript
api.on("SequenceNext", function() {
  // Handle navigation to next SCO
  loadNextActivity();
});
```

### SequencePrevious

Fires when SCORM 2004 content requests navigation to the previous activity.

```javascript
api.on("SequencePrevious", function() {
  // Handle navigation to previous SCO
  loadPreviousActivity();
});
```

---

## Sequencing Events (SCORM 2004 Only)

These events are configured via `settings.sequencing.eventListeners` and provide detailed insight into the sequencing engine.

### Configuration

```javascript
const api = new Scorm2004API({
  sequencing: {
    eventListeners: {
      onActivityDelivery: function(activity) {
        console.log("Deliver activity:", activity.id);
      },
      onSequencingError: function(error, context) {
        console.error("Sequencing error:", error, context);
      }
    }
  }
});
```

### Sequencing Event Reference

| Event | Fires When | Payload |
|-------|------------|---------|
| `onSequencingStart` | Sequencing session begins | `activity` object |
| `onSequencingEnd` | Sequencing session ends | None |
| `onActivityDelivery` | Activity ready for delivery | `activity` object |
| `onActivityUnload` | Activity being unloaded | `activity` object |
| `onNavigationRequest` | Navigation request received | `request: string, target?: string` |
| `onRollupComplete` | Rollup calculation finished | `activity` object |
| `onSequencingError` | Sequencing error occurred | `error: string, context?: string` |
| `onSequencingSessionEnd` | Session ending | `{ reason, exception?, navigationRequest? }` |
| `onAutoCompletion` | Auto-completion triggered | `{ activity: string, completionStatus: string }` |
| `onAutoSatisfaction` | Auto-satisfaction triggered | `{ activity: string, satisfiedStatus: boolean }` |
| `onPostConditionExitParent` | Exit parent post-condition | `{ activity: string }` |
| `onPostConditionExitAll` | Exit all post-condition | `{ activity: string }` |
| `onTerminationRequestProcessing` | Processing termination | `{ request, hasSequencingRequest, currentActivity }` |
| `onNavigationRequestProcessing` | Processing navigation | `{ request, targetActivityId }` |
| `onPostConditionEvaluated` | Post-condition evaluated | `{ activity, result, iteration }` |
| `onMultiLevelExitAction` | Multi-level exit | `{ activity: string }` |
| `onSuspendedActivityCleanup` | Cleaning suspended activity | `{ activity: string }` |
| `onSuspendError` | Suspend operation failed | `{ activity, error }` |
| `onActivitySuspended` | Activity suspended | `{ activity: string }` |
| `onDeliveryRequestProcessing` | Processing delivery | `{ request, target }` |
| `onNavigationValidityUpdate` | Navigation validity changed | `{ currentActivity, validRequests[] }` |
| `onLimitConditionCheck` | Limit condition checked | `{ activity, limitType, exceeded }` |
| `onStateInconsistency` | State inconsistency detected | `{ activity, issue }` |
| `onGlobalObjectiveMapInitialized` | Global objectives initialized | `{ count: number }` |
| `onGlobalObjectiveMapError` | Global objective error | `{ error: string }` |
| `onGlobalObjectiveUpdated` | Global objective updated | `{ objectiveId, field, value }` |
| `onGlobalObjectiveUpdateError` | Global objective update failed | `{ objectiveId, error }` |
| `onSequencingDebug` | Debug information | `{ message, context? }` |

### Detailed Sequencing Event Examples

#### onActivityDelivery

The most commonly used sequencing event. Fires when an activity should be delivered to the learner.

```javascript
onActivityDelivery: function(activity) {
  // activity contains:
  // - id: Activity identifier from manifest
  // - title: Activity title
  // - resourceIdentifier: Resource to launch
  // - parameters: Launch parameters

  const launchUrl = buildLaunchUrl(activity.resourceIdentifier, activity.parameters);
  loadContentFrame(launchUrl);
}
```

#### onNavigationValidityUpdate

Fires when available navigation options change. Use to update navigation UI.

```javascript
onNavigationValidityUpdate: function(data) {
  // data.currentActivity: Current activity ID or null
  // data.validRequests: Array of valid navigation requests
  //   e.g., ["continue", "previous", "choice", "exit"]

  updateNavButtons({
    nextEnabled: data.validRequests.includes("continue"),
    prevEnabled: data.validRequests.includes("previous"),
    exitEnabled: data.validRequests.includes("exit")
  });
}
```

#### onSequencingSessionEnd

Fires when the sequencing session is ending. Use for cleanup or final state persistence.

```javascript
onSequencingSessionEnd: function(data) {
  // data.reason: Why session ended ("complete", "suspend", "exit", "abandon")
  // data.exception: Sequencing exception code if any
  // data.navigationRequest: The navigation request that triggered end

  if (data.reason === "complete") {
    showCompletionScreen();
  } else if (data.reason === "suspend") {
    showResumePrompt();
  }
}
```

---

## Multiple Listener Registration

You can register the same callback for multiple events:

```javascript
function logApiCall(element, value) {
  analytics.track("scorm_api_call", { element, value });
}

// Register for multiple events
api.on("SetValue", logApiCall);
api.on("GetValue", logApiCall);
api.on("Commit", logApiCall);
```

---

## Cleanup Patterns

Always clean up listeners when the content unloads to prevent memory leaks:

```javascript
const listeners = {
  onSetValue: function(element, value) { /* ... */ },
  onTerminate: function() { /* ... */ }
};

// Register
api.on("SetValue", listeners.onSetValue);
api.on("Terminate", listeners.onTerminate);

// Cleanup on unload
window.addEventListener("unload", function() {
  api.off("SetValue", listeners.onSetValue);
  api.off("Terminate", listeners.onTerminate);
});
```

---

## Related Documentation

- [LMS Integration Guide](./integration-guide.md) - Main integration guide
- [Settings Reference](/docs/configuration/settings-reference) - All configuration options
- [Sequencing Configuration](/docs/advanced/sequencing) - SCORM 2004 sequencing setup
