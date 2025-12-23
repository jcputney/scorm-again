---
sidebar_position: 2
title: "SCORM 2004 API"
description: "Complete API reference for the Scorm2004API class - methods, properties, error codes, sequencing, and usage examples"
---

# SCORM 2004 API Reference

The `Scorm2004API` class implements the SCORM 2004 4th Edition Run-Time Environment (RTE) specification. This class provides all eight required API methods, sequencing support, global objectives, and utility methods for data management and event handling.

## Constructor

### `new Scorm2004API(settings?: Settings)`

Creates a new SCORM 2004 API instance.

**Parameters:**
- `settings` (optional): [`Settings`](/docs/configuration/settings-reference) object to configure API behavior

**Example:**

```javascript
import { Scorm2004API } from 'scorm-again/scorm2004';

const api = new Scorm2004API({
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
  logLevel: 'INFO'
});

// Attach to window for SCORM content discovery
window.API_1484_11 = api;
```

**With Sequencing:**

```javascript
const api = new Scorm2004API({
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/commit',
  sequencing: {
    activityTree: {
      id: 'root',
      title: 'Course',
      children: [
        { id: 'module1', title: 'Module 1' },
        { id: 'module2', title: 'Module 2' }
      ]
    }
  }
});
```

## Core SCORM Methods

These are the eight required API methods defined in the SCORM 2004 specification.

### `Initialize(param: string): string`

Begins a communication session with the LMS.

**Parameters:**
- `param`: Must be an empty string (`""`) per SCORM 2004 specification

**Returns:**
- `"true"` on success
- `"false"` on failure

**SCORM Specification:**
Per SCORM 2004 RTE Section 3.1.2.1:
- Parameter must be empty string
- Returns "true" on success, "false" on failure
- Sets error 103 if already initialized
- Sets error 104 if already terminated
- Sets error 101 if parameter is not an empty string
- Initializes the CMI data model for the current attempt

**Example:**

```javascript
const result = window.API_1484_11.Initialize("");
if (result === "true") {
  console.log("API initialized successfully");
}
```

**See Also:**
- [Error Codes](#error-codes)

---

### `Terminate(param: string): string`

Ends the communication session and persists data to the LMS.

**Parameters:**
- `param`: Must be an empty string (`""`) per SCORM 2004 specification

**Returns:**
- `"true"` on success
- `"false"` on failure

**SCORM Specification:**
Per SCORM 2004 RTE Section 3.1.2.2:
- Parameter must be empty string
- Commits all data to persistent storage
- Sets error 112 if not initialized
- Sets error 113 if already terminated
- Sets error 101 if parameter is not an empty string
- Processes navigation requests set via `adl.nav.request`

**Example:**

```javascript
const result = window.API_1484_11.Terminate("");
if (result === "true") {
  console.log("Session ended successfully");
}
```

**Navigation Processing:**

The Terminate method processes any pending navigation request set via `adl.nav.request`:

```javascript
// Set navigation request
window.API_1484_11.SetValue("adl.nav.request", "continue");

// Terminate will process the "continue" request
window.API_1484_11.Terminate("");
// Fires "SequenceNext" event
```

**See Also:**
- [Sequencing Methods](#sequencing-methods)
- [Navigation Events](/docs/configuration/event-listeners#navigation-event-listeners)

---

### `GetValue(element: string): string`

Retrieves a value from the CMI data model.

**Parameters:**
- `element`: The CMI element path (e.g., `"cmi.completion_status"`)

**Returns:**
- The value of the element as a string
- Empty string if element has no value or an error occurred

**SCORM Specification:**
Per SCORM 2004 RTE Section 3.1.2.3:
- Returns the value of the specified CMI element
- Returns empty string if element has no value
- Sets error 122 if not initialized
- Sets error 123 if already terminated
- Sets error 401 if element is not implemented (invalid element)
- Sets error 405 if element is write-only
- Sets error 403 if element is not initialized

**Example:**

```javascript
const learnerId = window.API_1484_11.GetValue("cmi.learner_id");
const score = window.API_1484_11.GetValue("cmi.score.scaled");
const status = window.API_1484_11.GetValue("cmi.completion_status");
```

**Common Elements:**
- `cmi.learner_id` - Learner identifier
- `cmi.learner_name` - Learner name
- `cmi.completion_status` - Completion status (completed, incomplete, unknown)
- `cmi.success_status` - Success status (passed, failed, unknown)
- `cmi.score.scaled` - Scaled score (-1.0 to 1.0)
- `cmi.location` - Bookmark location
- `cmi.suspend_data` - Suspended state data
- `cmi.progress_measure` - Progress measure (0.0 to 1.0)

**Automatic Evaluation:**

Some elements are automatically evaluated based on other values:

```javascript
// If completion_threshold and progress_measure are set,
// completion_status is automatically calculated
api.SetValue("cmi.completion_threshold", "0.8");
api.SetValue("cmi.progress_measure", "0.9");
const status = api.GetValue("cmi.completion_status"); // Returns "completed"

// If scaled_passing_score and score.scaled are set,
// success_status is automatically calculated
api.SetValue("cmi.scaled_passing_score", "0.7");
api.SetValue("cmi.score.scaled", "0.85");
const success = api.GetValue("cmi.success_status"); // Returns "passed"
```

---

### `SetValue(element: string, value: any): string`

Sets a value in the CMI data model.

**Parameters:**
- `element`: The CMI element path (e.g., `"cmi.completion_status"`)
- `value`: The value to set

**Returns:**
- `"true"` on success
- `"false"` on failure

**SCORM Specification:**
Per SCORM 2004 RTE Section 3.1.2.4:
- Sets the value of the specified CMI element
- Sets error 132 if not initialized
- Sets error 133 if terminated
- Sets error 401 if element is not implemented (invalid element)
- Sets error 403 if element is read-only
- Sets error 406 if incorrect data type
- Triggers autocommit if enabled

**Example:**

```javascript
window.API_1484_11.SetValue("cmi.completion_status", "completed");
window.API_1484_11.SetValue("cmi.success_status", "passed");
window.API_1484_11.SetValue("cmi.score.scaled", "0.85");
window.API_1484_11.SetValue("cmi.location", "page5");
window.API_1484_11.SetValue("cmi.suspend_data", JSON.stringify({ page: 5 }));
```

**Setting Objectives:**

```javascript
// Add an objective
window.API_1484_11.SetValue("cmi.objectives.0.id", "obj_1");
window.API_1484_11.SetValue("cmi.objectives.0.success_status", "passed");
window.API_1484_11.SetValue("cmi.objectives.0.score.scaled", "0.9");
window.API_1484_11.SetValue("cmi.objectives.0.completion_status", "completed");
```

**See Also:**
- [SCORM 2004 Data Model Guide](/docs/scorm-standards/scorm2004-guide)

---

### `Commit(param: string): string`

Requests immediate persistence of data to the LMS.

**Parameters:**
- `param`: Must be an empty string (`""`) per SCORM 2004 specification

**Returns:**
- `"true"` on success
- `"false"` on failure

**SCORM Specification:**
Per SCORM 2004 RTE Section 3.1.2.5:
- Parameter must be empty string
- Requests immediate persistence of all data since last commit
- Sets error 142 if not initialized
- Sets error 143 if terminated
- Sets error 391 if commit failed
- Does not terminate the communication session

**Example:**

```javascript
window.API_1484_11.SetValue("cmi.score.scaled", "0.85");
const result = window.API_1484_11.Commit("");
if (result === "true") {
  console.log("Data saved successfully");
}
```

**Note:** If `autocommit` is enabled in settings, explicit commits may not be necessary.

---

### `GetLastError(): string`

Returns the error code from the last API call.

**Returns:**
- Error code as a string (e.g., `"0"`, `"103"`, `"401"`)
- `"0"` if no error occurred

**SCORM Specification:**
Per SCORM 2004 RTE Section 3.1.2.6:
- Returns the error code from the last API call
- Returns "0" if no error occurred
- Can be called at any time (even before Initialize)
- Does not change the current error state
- Should be called after each API call to check for errors

**Example:**

```javascript
window.API_1484_11.SetValue("cmi.completion_status", "invalid_value");
const errorCode = window.API_1484_11.GetLastError();
if (errorCode !== "0") {
  console.log("Error occurred:", errorCode);
}
```

**See Also:**
- [Error Codes](#error-codes)

---

### `GetErrorString(errorCode: string | number): string`

Returns a short description for an error code.

**Parameters:**
- `errorCode`: The error code to get the description for

**Returns:**
- Short error description (maximum 255 characters per SCORM spec)
- Empty string if error code is not recognized

**SCORM Specification:**
Per SCORM 2004 RTE Section 3.1.2.7:
- Returns a textual description for the specified error code
- Can be called at any time (even before Initialize)
- Does not change the current error state
- Used to provide user-friendly error messages

**Example:**

```javascript
const errorCode = window.API_1484_11.GetLastError();
if (errorCode !== "0") {
  const errorString = window.API_1484_11.GetErrorString(errorCode);
  console.log(`Error ${errorCode}: ${errorString}`);
}
```

---

### `GetDiagnostic(errorCode: string | number): string`

Returns detailed diagnostic information for an error.

**Parameters:**
- `errorCode`: The error code to get diagnostic information for (pass empty string for last error)

**Returns:**
- Detailed diagnostic information (maximum 255 characters per SCORM spec)
- Empty string if no diagnostic information is available

**SCORM Specification:**
Per SCORM 2004 RTE Section 3.1.2.8:
- Returns detailed diagnostic information for the specified error code
- Implementation-specific; can include additional context or debugging info
- Can be called at any time (even before Initialize)
- Does not change the current error state
- Used for debugging and troubleshooting

**Example:**

```javascript
const errorCode = window.API_1484_11.GetLastError();
if (errorCode !== "0") {
  const diagnostic = window.API_1484_11.GetDiagnostic(errorCode);
  console.log(`Diagnostic: ${diagnostic}`);
}
```

## Sequencing Methods

SCORM 2004 includes advanced sequencing and navigation capabilities. Navigation requests are set via `adl.nav.request` and processed during `Terminate()`.

### Navigation Requests

Set navigation requests using `SetValue("adl.nav.request", request)`:

**Available Requests:**
- `"continue"` - Move to the next activity (fires `SequenceNext` event)
- `"previous"` - Move to the previous activity (fires `SequencePrevious` event)
- `"{target=activity_id}choice"` - Navigate to a specific activity (fires `SequenceChoice` event)
- `"{target=activity_id}jump"` - Jump to a specific activity (fires `SequenceJump` event)
- `"exit"` - Exit the current activity (fires `SequenceExit` event)
- `"exitAll"` - Exit all activities and end the session (fires `SequenceExitAll` event)
- `"abandon"` - Abandon the current activity (fires `SequenceAbandon` event)
- `"abandonAll"` - Abandon all activities (fires `SequenceAbandonAll` event)
- `"suspendAll"` - Suspend all activities
- `"_none_"` - No navigation request

**Example:**

```javascript
// Navigate to next activity
window.API_1484_11.SetValue("adl.nav.request", "continue");
window.API_1484_11.Terminate(""); // Processes the navigation request

// Navigate to specific activity
window.API_1484_11.SetValue("adl.nav.request", "{target=lesson_2}choice");
window.API_1484_11.Terminate("");

// Exit all activities
window.API_1484_11.SetValue("adl.nav.request", "exitAll");
window.API_1484_11.Terminate("");
```

### Checking Navigation Validity

Before setting a navigation request, you can check if it's valid:

```javascript
// Check if choice to specific activity is valid
const isValid = window.API_1484_11.GetValue(
  "adl.nav.request_valid.choice.{target=lesson_2}"
);

if (isValid === "true") {
  window.API_1484_11.SetValue("adl.nav.request", "{target=lesson_2}choice");
}
```

### Sequencing Events

When navigation requests are processed, corresponding events are fired:

- `SequenceNext` - Move to next activity
- `SequencePrevious` - Move to previous activity
- `SequenceChoice` - Navigate to chosen activity (target ID passed as parameter)
- `SequenceJump` - Jump to activity (target ID passed as parameter)
- `SequenceExit` - Exit current activity
- `SequenceExitAll` - Exit all activities
- `SequenceAbandon` - Abandon current activity
- `SequenceAbandonAll` - Abandon all activities
- `SequenceRetry` - Retry current activity
- `SequenceRetryAll` - Retry from root activity
- `ActivityDelivered` - Activity ready for delivery (activity passed as parameter)
- `SequencingComplete` - Sequencing process completed (result passed as parameter)
- `SequencingError` - Sequencing error occurred (error passed as parameter)

**Example:**

```javascript
// Listen for navigation events
api.on("SequenceNext", () => {
  console.log("Moving to next activity");
  // LMS should load the next SCO
});

api.on("SequenceChoice", (event, target) => {
  console.log(`Navigating to activity: ${target}`);
  // LMS should load the specified SCO
});

api.on("ActivityDelivered", (event, activity) => {
  console.log("Deliver activity:", activity.id);
  // LMS should launch the SCO
});
```

**Important:** The LMS is responsible for actually launching/switching SCOs based on these navigation events. The API handles all sequencing logic but does not control the actual content delivery.

**See Also:**
- [Sequencing Configuration](/docs/advanced/sequencing)
- [API Events Reference](/docs/lms-integration/api-events-reference)

## Utility Methods

These methods provide additional functionality for data management and API control.

### `loadFromJSON(json: object): void`

Loads CMI data from a hierarchical JSON object.

**Parameters:**
- `json`: A JavaScript object containing CMI data in hierarchical format

**Example:**

```javascript
api.loadFromJSON({
  learner_id: "12345",
  learner_name: "John Doe",
  completion_status: "incomplete",
  score: {
    scaled: 0.85,
    min: 0,
    max: 100,
    raw: 85
  },
  objectives: [
    {
      id: "obj1",
      success_status: "passed",
      score: { scaled: 0.9 }
    }
  ]
});
```

**See Also:**
- [Data Formats](/docs/configuration/data-formats)

---

### `loadFromFlattenedJSON(json: object): void`

Loads CMI data from a flattened JSON object.

**Parameters:**
- `json`: An object with keys representing CMI element paths

**Example:**

```javascript
api.loadFromFlattenedJSON({
  "cmi.learner_id": "12345",
  "cmi.learner_name": "John Doe",
  "cmi.completion_status": "incomplete",
  "cmi.score.scaled": "0.85",
  "cmi.objectives.0.id": "obj1",
  "cmi.objectives.0.success_status": "passed"
});
```

---

### `getCurrentTotalTime(): string`

Calculates and returns the current total time in ISO 8601 duration format.

**Returns:**
- Total time string in SCORM 2004 format (ISO 8601, e.g., "PT1H23M45S")

**Example:**

```javascript
const totalTime = api.getCurrentTotalTime();
console.log("Total time:", totalTime); // "PT1H23M45S"
```

**Note:** This combines the initial `total_time` with the current `session_time`.

---

### `reset(settings?: Settings): void`

Resets the API to its initial state, optionally applying new settings.

**Parameters:**
- `settings` (optional): New settings to merge with existing settings

**Example:**

```javascript
// Reset to default state
api.reset();

// Reset with new settings
api.reset({
  logLevel: 'DEBUG',
  autocommit: false
});
```

**Important for Sequenced Courses:**

When using sequencing, `reset()` clears SCO-specific data but preserves:
- Global objectives
- Sequencing state (current activity, activity tree)
- Navigation state

For a complete reset including sequencing state, you need to create a new API instance.

**Warning:** This clears SCO-specific CMI data and resets to uninitialized state.

## Event Methods

These methods allow you to attach listeners to API events.

### `on(event: string, callback: Function): void`

Attaches an event listener to a specific SCORM event.

**Parameters:**
- `event`: Event name (e.g., `"Initialize"`, `"SetValue"`, `"Commit"`)
- `callback`: Function to call when the event occurs

**Available Events:**
- `Initialize` - Called when API is initialized
- `Terminate` - Called when API is terminated
- `GetValue` - Called when a value is retrieved
- `SetValue` - Called when a value is set
- `Commit` - Called when data is committed
- `GetLastError` - Called when error code is requested
- `GetErrorString` - Called when error string is requested
- `GetDiagnostic` - Called when diagnostic is requested
- Sequencing events (see [Sequencing Methods](#sequencing-methods))

**Example:**

```javascript
// Listen for initialization
api.on("Initialize", () => {
  console.log("SCORM API initialized");
});

// Listen for specific CMI element changes
api.on("SetValue.cmi.completion_status", (element, value) => {
  console.log(`Completion status changed to: ${value}`);
});

// Listen for any SetValue call using wildcard
api.on("SetValue.cmi.*", (element, value) => {
  console.log(`${element} set to ${value}`);
});

// Listen for commits
api.on("Commit", () => {
  console.log("Data committed to LMS");
});

// Listen for navigation events
api.on("SequenceNext", () => {
  console.log("Navigating to next activity");
});
```

**See Also:**
- [Event Listeners Guide](/docs/configuration/event-listeners)
- [API Events Reference](/docs/lms-integration/api-events-reference)

---

### `off(event: string, callback: Function): void`

Removes a specific event listener.

**Parameters:**
- `event`: Event name
- `callback`: The callback function to remove (must be the same reference used in `on()`)

**Example:**

```javascript
const myCallback = () => console.log("Initialized");
api.on("Initialize", myCallback);

// Later, remove the listener
api.off("Initialize", myCallback);
```

---

### `clear(event: string): void`

Removes all listeners for a specific event.

**Parameters:**
- `event`: Event name

**Example:**

```javascript
// Remove all Initialize listeners
api.clear("Initialize");
```

## Properties

### `cmi`

The CMI data model object containing all SCORM 2004 data elements.

**Type:** `CMI`

**Example:**

```javascript
// Direct property access
console.log(api.cmi.learner_name);
console.log(api.cmi.completion_status);

// Modify properties directly (use SetValue instead for proper SCORM compliance)
api.cmi.score.scaled = "0.85";
```

**Structure:**
```typescript
cmi: {
  _version: string;
  comments_from_learner: Array<Comment>;
  comments_from_lms: Array<Comment>;
  completion_status: string;
  completion_threshold: string;
  credit: string;
  entry: string;
  exit: string;
  interactions: Array<Interaction>;
  launch_data: string;
  learner_id: string;
  learner_name: string;
  learner_preference: {
    audio_level: string;
    language: string;
    delivery_speed: string;
    audio_captioning: string;
  };
  location: string;
  max_time_allowed: string;
  mode: string;
  objectives: Array<Objective>;
  progress_measure: string;
  scaled_passing_score: string;
  score: {
    scaled: string;
    raw: string;
    min: string;
    max: string;
  };
  session_time: string;
  success_status: string;
  suspend_data: string;
  time_limit_action: string;
  total_time: string;
}
```

**See Also:**
- [SCORM 2004 Data Model Guide](/docs/scorm-standards/scorm2004-guide)

---

### `adl`

The ADL data object containing SCORM 2004 extensions.

**Type:** `ADL`

**Example:**

```javascript
// Access ADL data
console.log(api.adl.nav.request);

// Set navigation request
api.SetValue("adl.nav.request", "continue");
```

**Structure:**
```typescript
adl: {
  nav: {
    request: string; // Navigation request (write-only)
    request_valid: {
      continue: string;
      previous: string;
      choice: Object; // Dynamic validation for choice targets
      jump: Object;   // Dynamic validation for jump targets
    };
  };
  data: Array<{
    id: string;
    store: string;
  }>;
}
```

## Error Codes

SCORM 2004 defines the following error codes:

| Code | Name | Description |
|------|------|-------------|
| 0 | No Error | No error occurred, the previous API call was successful |
| 101 | General Exception | No specific error code exists to describe the error |
| 102 | General Initialization Failure | Call to Initialize failed for an unknown reason |
| 103 | Already Initialized | Call to Initialize failed because Initialize was already called |
| 104 | Content Instance Terminated | Call to Initialize failed because Terminate was already called |
| 111 | General Termination Failure | Call to Terminate failed for an unknown reason |
| 112 | Termination Before Initialization | Call to Terminate failed because it was made before Initialize |
| 113 | Termination After Termination | Call to Terminate failed because Terminate was already called |
| 122 | Retrieve Data Before Initialization | Call to GetValue failed because it was made before Initialize |
| 123 | Retrieve Data After Termination | Call to GetValue failed because it was made after Terminate |
| 132 | Store Data Before Initialization | Call to SetValue failed because it was made before Initialize |
| 133 | Store Data After Termination | Call to SetValue failed because it was made after Terminate |
| 142 | Commit Before Initialization | Call to Commit failed because it was made before Initialize |
| 143 | Commit After Termination | Call to Commit failed because it was made after Terminate |
| 201 | General Argument Error | An invalid argument was passed to an API method |
| 301 | General Get Failure | Indicates a failed GetValue call where no other specific error code is applicable |
| 351 | General Set Failure | Indicates a failed SetValue call where no other specific error code is applicable |
| 391 | General Commit Failure | Indicates a failed Commit call where no other specific error code is applicable |
| 401 | Undefined Data Model Element | The data model element name passed to GetValue or SetValue is not valid |
| 402 | Unimplemented Data Model Element | The data model element is valid but not implemented by this LMS |
| 403 | Data Model Element Value Not Initialized | Attempt to read a data model element that has not been initialized |
| 404 | Data Model Element Is Read Only | SetValue was called with a read-only data model element |
| 405 | Data Model Element Is Write Only | GetValue was called on a write-only data model element |
| 406 | Data Model Element Type Mismatch | SetValue was called with a value inconsistent with the element's data format |
| 407 | Data Model Element Value Out Of Range | The numeric value supplied is outside the allowed range |
| 408 | Data Model Dependency Not Established | A prerequisite element was not set before the dependent element |

**Example Usage:**

```javascript
const result = api.SetValue("cmi.completion_status", "completed");
if (result === "false") {
  const errorCode = api.GetLastError();
  const errorString = api.GetErrorString(errorCode);
  const diagnostic = api.GetDiagnostic(errorCode);

  console.error(`Error ${errorCode}: ${errorString}`);
  console.error(`Details: ${diagnostic}`);
}
```

## Global Objectives

SCORM 2004 supports global objectives that persist across SCO transitions and can be shared between activities via objective mappings.

**Configuration:**

```javascript
const api = new Scorm2004API({
  globalObjectiveIds: ['course_objective_1', 'module_1_objective'],
  sequencing: {
    // ... sequencing configuration with mapInfo
  }
});
```

**LMS Integration:**

Global objectives must be stored separately by the LMS and synchronized across all SCOs in the package. The LMS extracts objective mappings from `<imsss:mapInfo>` elements in the manifest.

**See Also:**
- [Sequencing Configuration](/docs/advanced/sequencing)
- [LMS Integration Guide](/docs/lms-integration/integration-guide)

## TypeScript Types

```typescript
import { Scorm2004API, Settings } from 'scorm-again';

const settings: Settings = {
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/commit',
  logLevel: 'INFO'
};

const api: Scorm2004API = new Scorm2004API(settings);
```

## Related Documentation

- [SCORM 2004 Guide](/docs/scorm-standards/scorm2004-guide) - Complete SCORM 2004 data model
- [Settings Reference](/docs/configuration/settings-reference) - All available configuration options
- [Event Listeners](/docs/configuration/event-listeners) - Event system documentation
- [Sequencing](/docs/advanced/sequencing) - SCORM 2004 sequencing and navigation
- [LMS Integration](/docs/lms-integration/integration-guide) - LMS integration guide
- [Multi-SCO Support](/docs/lms-integration/multi-sco-support) - Multi-SCO navigation utilities
