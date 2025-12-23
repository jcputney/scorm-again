---
sidebar_position: 1
title: "SCORM 1.2 API"
description: "Complete API reference for the Scorm12API class - methods, properties, error codes, and usage examples"
---

# SCORM 1.2 API Reference

The `Scorm12API` class implements the SCORM 1.2 Run-Time Environment (RTE) specification. This class provides all eight required API methods as well as utility methods for data management and event handling.

## Constructor

### `new Scorm12API(settings?: Settings)`

Creates a new SCORM 1.2 API instance.

**Parameters:**
- `settings` (optional): [`Settings`](/docs/configuration/settings-reference) object to configure API behavior

**Example:**

```javascript
import { Scorm12API } from 'scorm-again/scorm12';

const api = new Scorm12API({
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
  logLevel: 'INFO'
});

// Attach to window for SCORM content discovery
window.API = api;
```

## Core SCORM Methods

These are the eight required API methods defined in the SCORM 1.2 specification.

### `LMSInitialize(param: string): string`

Begins a communication session with the LMS.

**Parameters:**
- `param`: Must be an empty string (`""`) per SCORM 1.2 specification

**Returns:**
- `"true"` on success
- `"false"` on failure

**SCORM Specification:**
Per SCORM 1.2 RTE Section 3.4.3.1:
- Parameter must be empty string
- Returns "true" on success, "false" on failure
- Sets error 101 if already initialized
- Sets error 101 if already terminated
- Initializes `cmi.core.lesson_status` to "not attempted" if not already set

**Example:**

```javascript
const result = window.API.LMSInitialize("");
if (result === "true") {
  console.log("API initialized successfully");
}
```

**See Also:**
- [Error Codes](#error-codes)

---

### `LMSFinish(param: string): string`

Ends the communication session and persists data to the LMS.

**Parameters:**
- `param`: Must be an empty string (`""`) per SCORM 1.2 specification

**Returns:**
- `"true"` on success
- `"false"` on failure

**SCORM Specification:**
Per SCORM 1.2 RTE Section 3.4.3.2:
- Parameter must be empty string
- Commits all data to persistent storage
- Sets error 101 if not initialized
- Sets error 101 if already terminated
- Processes navigation events (continue/previous) if `nav.event` is set

**Example:**

```javascript
const result = window.API.LMSFinish("");
if (result === "true") {
  console.log("Session ended successfully");
}
```

**See Also:**
- [Navigation Events](/docs/configuration/event-listeners#navigation-event-listeners)

---

### `LMSGetValue(element: string): string`

Retrieves a value from the CMI data model.

**Parameters:**
- `element`: The CMI element path (e.g., `"cmi.core.score.raw"`)

**Returns:**
- The value of the element as a string
- Empty string if element has no value or an error occurred

**SCORM Specification:**
Per SCORM 1.2 RTE Section 3.4.3.3:
- Returns the value of the specified CMI element
- Returns empty string if element has no value
- Sets error 101 if not initialized
- Sets error 301 if element is not implemented (invalid element)
- Sets error 201 if element is write-only
- Sets error 202 if element is not initialized

**Example:**

```javascript
const studentName = window.API.LMSGetValue("cmi.core.student_name");
const score = window.API.LMSGetValue("cmi.core.score.raw");
const status = window.API.LMSGetValue("cmi.core.lesson_status");
```

**Common Elements:**
- `cmi.core.student_id` - Learner identifier
- `cmi.core.student_name` - Learner name
- `cmi.core.lesson_status` - Current completion status
- `cmi.core.score.raw` - Raw score value
- `cmi.core.lesson_location` - Bookmark location
- `cmi.suspend_data` - Suspended state data

---

### `LMSSetValue(element: string, value: any): string`

Sets a value in the CMI data model.

**Parameters:**
- `element`: The CMI element path (e.g., `"cmi.core.lesson_status"`)
- `value`: The value to set

**Returns:**
- `"true"` on success
- `"false"` on failure

**SCORM Specification:**
Per SCORM 1.2 RTE Section 3.4.3.4:
- Sets the value of the specified CMI element
- Sets error 101 if not initialized
- Sets error 301 if element is not implemented (invalid element)
- Sets error 351 if element exceeds maximum length
- Sets error 201 if element is read-only
- Sets error 405 if incorrect data type
- Triggers autocommit if enabled

**Example:**

```javascript
window.API.LMSSetValue("cmi.core.lesson_status", "completed");
window.API.LMSSetValue("cmi.core.score.raw", "85");
window.API.LMSSetValue("cmi.core.lesson_location", "page5");
window.API.LMSSetValue("cmi.suspend_data", JSON.stringify({ page: 5, answers: [...] }));
```

**See Also:**
- [SCORM 1.2 Data Model Guide](/docs/scorm-standards/scorm12-guide)

---

### `LMSCommit(param: string): string`

Requests immediate persistence of data to the LMS.

**Parameters:**
- `param`: Must be an empty string (`""`) per SCORM 1.2 specification

**Returns:**
- `"true"` on success
- `"false"` on failure

**SCORM Specification:**
Per SCORM 1.2 RTE Section 3.4.4.1:
- Parameter must be empty string
- Requests persistence of all data set since last successful commit
- Sets error 101 if not initialized
- Sets error 391 if commit failed
- Does not terminate the communication session

**Example:**

```javascript
window.API.LMSSetValue("cmi.core.score.raw", "85");
const result = window.API.LMSCommit("");
if (result === "true") {
  console.log("Data saved successfully");
}
```

**Note:** If `autocommit` is enabled in settings, explicit commits may not be necessary.

---

### `LMSGetLastError(): string`

Returns the error code from the last API call.

**Returns:**
- Error code as a string (e.g., `"0"`, `"101"`, `"301"`)
- `"0"` if no error occurred

**SCORM Specification:**
Per SCORM 1.2 RTE Section 3.4.4.2:
- Returns the error code that resulted from the last API call
- Returns "0" if no error occurred
- Can be called at any time (even before LMSInitialize)
- Does not change the current error state
- Should be called after each API call to check for errors

**Example:**

```javascript
window.API.LMSSetValue("cmi.core.lesson_status", "invalid_value");
const errorCode = window.API.LMSGetLastError();
if (errorCode !== "0") {
  console.log("Error occurred:", errorCode);
}
```

**See Also:**
- [Error Codes](#error-codes)

---

### `LMSGetErrorString(errorCode: string): string`

Returns a short description for an error code.

**Parameters:**
- `errorCode`: The error code to get the description for

**Returns:**
- Short error description (maximum 255 characters per SCORM spec)
- Empty string if error code is not recognized

**SCORM Specification:**
Per SCORM 1.2 RTE Section 3.4.4.3:
- Returns a textual description for the specified error code
- Can be called at any time (even before LMSInitialize)
- Does not change the current error state
- Used to provide user-friendly error messages

**Example:**

```javascript
const errorCode = window.API.LMSGetLastError();
if (errorCode !== "0") {
  const errorString = window.API.LMSGetErrorString(errorCode);
  console.log(`Error ${errorCode}: ${errorString}`);
}
```

---

### `LMSGetDiagnostic(errorCode: string): string`

Returns detailed diagnostic information for an error.

**Parameters:**
- `errorCode`: The error code to get diagnostic information for (pass empty string for last error)

**Returns:**
- Detailed diagnostic information (maximum 255 characters per SCORM spec)
- Empty string if no diagnostic information is available

**SCORM Specification:**
Per SCORM 1.2 RTE Section 3.4.4.4:
- Returns detailed diagnostic information for the specified error code
- Implementation-specific; can include additional context or debugging info
- Can be called at any time (even before LMSInitialize)
- Does not change the current error state
- Used for debugging and troubleshooting

**Example:**

```javascript
const errorCode = window.API.LMSGetLastError();
if (errorCode !== "0") {
  const diagnostic = window.API.LMSGetDiagnostic(errorCode);
  console.log(`Diagnostic: ${diagnostic}`);
}
```

## Utility Methods

These methods provide additional functionality for data management and API control.

### `loadFromJSON(json: object): void`

Loads CMI data from a hierarchical JSON object.

**Parameters:**
- `json`: A JavaScript object containing CMI data in hierarchical format

**Example:**

```javascript
api.loadFromJSON({
  core: {
    student_id: "12345",
    student_name: "John Doe",
    lesson_status: "incomplete",
    score: {
      raw: 85,
      min: 0,
      max: 100
    }
  },
  objectives: [
    {
      id: "obj1",
      status: "passed",
      score: { raw: 90 }
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
  "cmi.core.student_id": "12345",
  "cmi.core.student_name": "John Doe",
  "cmi.core.lesson_status": "incomplete",
  "cmi.core.score.raw": "85",
  "cmi.objectives.0.id": "obj1",
  "cmi.objectives.0.status": "passed"
});
```

---

### `getCurrentTotalTime(): string`

Calculates and returns the current total time in HH:MM:SS format.

**Returns:**
- Total time string in SCORM 1.2 format (HH:MM:SS)

**Example:**

```javascript
const totalTime = api.getCurrentTotalTime();
console.log("Total time:", totalTime); // "01:23:45"
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

**Warning:** This clears all current CMI data and resets to uninitialized state.

## Event Methods

These methods allow you to attach listeners to API events.

### `on(event: string, callback: Function): void`

Attaches an event listener to a specific SCORM event.

**Parameters:**
- `event`: Event name (e.g., `"LMSInitialize"`, `"LMSSetValue"`, `"LMSCommit"`)
- `callback`: Function to call when the event occurs

**Available Events:**
- `LMSInitialize` - Called when API is initialized
- `LMSFinish` - Called when API is terminated
- `LMSGetValue` - Called when a value is retrieved
- `LMSSetValue` - Called when a value is set
- `LMSCommit` - Called when data is committed
- `LMSGetLastError` - Called when error code is requested
- `LMSGetErrorString` - Called when error string is requested
- `LMSGetDiagnostic` - Called when diagnostic is requested
- `SequenceNext` - Called for "next" navigation
- `SequencePrevious` - Called for "previous" navigation

**Example:**

```javascript
// Listen for initialization
api.on("LMSInitialize", () => {
  console.log("SCORM API initialized");
});

// Listen for specific CMI element changes
api.on("LMSSetValue.cmi.core.lesson_status", (element, value) => {
  console.log(`Status changed to: ${value}`);
});

// Listen for any SetValue call using wildcard
api.on("LMSSetValue.cmi.*", (element, value) => {
  console.log(`${element} set to ${value}`);
});

// Listen for commits
api.on("LMSCommit", () => {
  console.log("Data committed to LMS");
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
api.on("LMSInitialize", myCallback);

// Later, remove the listener
api.off("LMSInitialize", myCallback);
```

---

### `clear(event: string): void`

Removes all listeners for a specific event.

**Parameters:**
- `event`: Event name

**Example:**

```javascript
// Remove all LMSInitialize listeners
api.clear("LMSInitialize");
```

## Properties

### `cmi`

The CMI data model object containing all SCORM 1.2 data elements.

**Type:** `CMI`

**Example:**

```javascript
// Direct property access
console.log(api.cmi.core.student_name);
console.log(api.cmi.core.lesson_status);

// Modify properties directly (use LMSSetValue instead for proper SCORM compliance)
api.cmi.core.score.raw = "85";
```

**Structure:**
```typescript
cmi: {
  core: {
    student_id: string;
    student_name: string;
    lesson_location: string;
    credit: string;
    lesson_status: string;
    entry: string;
    score: {
      raw: string;
      min: string;
      max: string;
    };
    total_time: string;
    lesson_mode: string;
    exit: string;
    session_time: string;
  };
  suspend_data: string;
  launch_data: string;
  comments: string;
  objectives: Array<Objective>;
  student_data: {
    mastery_score: string;
    max_time_allowed: string;
    time_limit_action: string;
  };
  student_preference: {
    audio: string;
    language: string;
    speed: string;
    text: string;
  };
  interactions: Array<Interaction>;
}
```

**See Also:**
- [SCORM 1.2 Data Model Guide](/docs/scorm-standards/scorm12-guide)

## Error Codes

SCORM 1.2 defines the following error codes:

| Code | Name | Description |
|------|------|-------------|
| 0 | No Error | No error occurred, the previous API call was successful |
| 101 | General Exception | No specific error code exists to describe the error |
| 201 | Invalid Argument Error | An argument represents an invalid data model element or is otherwise incorrect |
| 202 | Element Cannot Have Children | LMSGetValue was called with a data model element name that ends in "_children" for a data model element that does not support the "_children" suffix |
| 203 | Element Not An Array | LMSGetValue was called with a data model element name that ends in "_count" for a data model element that does not support the "_count" suffix |
| 301 | Not Initialized | An API call was made before the call to LMSInitialize |
| 401 | Not Implemented Error | The data model element indicated in a call to LMSGetValue or LMSSetValue is valid, but was not implemented by this LMS |
| 402 | Invalid Set Value, Element Is A Keyword | LMSSetValue was called on a data model element that represents a keyword (elements that end in "_children" and "_count") |
| 403 | Element Is Read Only | LMSSetValue was called with a data model element that can only be read |
| 404 | Element Is Write Only | LMSGetValue was called on a data model element that can only be written to |
| 405 | Incorrect Data Type | LMSSetValue was called with a value that is not consistent with the data format of the supplied data model element |
| 407 | Element Value Out Of Range | The numeric value supplied to a LMSSetValue call is outside of the numeric range allowed for the supplied data model element |
| 408 | Data Model Dependency Not Established | Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element |

**Example Usage:**

```javascript
const result = api.LMSSetValue("cmi.core.lesson_status", "completed");
if (result === "false") {
  const errorCode = api.LMSGetLastError();
  const errorString = api.LMSGetErrorString(errorCode);
  const diagnostic = api.LMSGetDiagnostic(errorCode);

  console.error(`Error ${errorCode}: ${errorString}`);
  console.error(`Details: ${diagnostic}`);
}
```

## Static Methods

### `clearGlobalPreferences(): void`

Clears the global learner preferences storage (when `globalStudentPreferences` setting is enabled).

**Example:**

```javascript
// Clear global preferences shared across SCO instances
Scorm12API.clearGlobalPreferences();
```

**See Also:**
- [Settings Reference - globalStudentPreferences](/docs/configuration/settings-reference)

## TypeScript Types

```typescript
import { Scorm12API, Settings } from 'scorm-again';

const settings: Settings = {
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/commit',
  logLevel: 'INFO'
};

const api: Scorm12API = new Scorm12API(settings);
```

## Related Documentation

- [SCORM 1.2 Guide](/docs/scorm-standards/scorm12-guide) - Complete SCORM 1.2 data model
- [Settings Reference](/docs/configuration/settings-reference) - All available configuration options
- [Event Listeners](/docs/configuration/event-listeners) - Event system documentation
- [LMS Integration](/docs/lms-integration/integration-guide) - LMS integration guide
- [Multi-SCO Support](/docs/lms-integration/multi-sco-support) - Multi-SCO navigation utilities
