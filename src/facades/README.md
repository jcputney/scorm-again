# Cross-Frame Facade for SCORM APIs

This directory contains facade implementations for the SCORM APIs, including a cross-frame facade that allows communication between frames from different domains using the postMessage API.

## Synchronous Operation

The CrossFrameFacade now supports both asynchronous (Promise-based) and synchronous operation. This is particularly important for SCORM modules that expect the traditional synchronous SCORM API behavior.

The synchronous API methods (like `lmsInitialize()`, `lmsGetValue()`, etc.) return immediate results while performing asynchronous operations in the background. This makes the CrossFrameFacade compatible with traditional SCORM modules that expect synchronous behavior, even though the underlying cross-frame communication is inherently asynchronous.

For example, instead of:
```javascript
const result = await api.getValue("cmi.core.student_name");
```

You can now use:
```javascript
const result = api.lmsGetValue("cmi.core.student_name");
```

The synchronous methods follow the naming conventions of the traditional SCORM APIs:
- SCORM 1.2: `lmsInitialize()`, `lmsFinish()`, `lmsGetValue()`, etc.
- SCORM 2004: `LMSInitialize()`, `LMSFinish()`, `LMSGetValue()`, etc.

## CrossFrameFacade

The CrossFrameFacade provides a way to use the SCORM APIs across different frames, even when they're from different domains. This is useful when an e-learning module and the API are loaded into separate frames from different domains.

### Components

- **CrossFrameServer**: Runs in the parent frame where the API is initialized. It listens for messages from the client-side facade and proxies them to the actual API.
- **CrossFrameClient**: Runs in the child frame where the module is loaded. It sends messages to the server-side facade and provides the same interface as the actual API. It can also act as a proxy for nested child frames.
- **ICrossFrameFacade**: Interface that defines the API contract for the CrossFrameClient.

### Usage

#### Parent Frame (LMS)

```javascript
import { createCrossFrameServer } from "scorm-again";

// Create a cross-frame server for SCORM 1.2
const crossFrameServer = createCrossFrameServer("1.2", {
  autocommit: true,
  logLevel: 1,
  mastery_override: false,
}, {
  // Initial data
  cmi: {
    core: {
      student_id: "123456",
      student_name: "John Doe",
      lesson_status: "not attempted",
      // ...
    },
    // ...
  },
});

// Load the module in an iframe
document.getElementById("moduleFrame").src = "path/to/module.html";
```

#### Child Frame (Module)

The CrossFrameClient provides both asynchronous and synchronous APIs. You can choose the one that best fits your needs.

##### Asynchronous API (Promise-based)

```javascript
import { createCrossFrameClient } from "scorm-again";

// Create a cross-frame client
const api = createCrossFrameClient();

// Use the asynchronous API with Promises or async/await
async function initializeModule() {
  try {
    // Initialize the API
    const initialized = await api.initialize();
    if (initialized) {
      console.log("API initialized successfully");

      // Get the learner name
      const learnerName = await api.getValue("cmi.core.student_name") ||
                         await api.getValue("cmi.learner_name");

      // Set a value
      await api.setValue("cmi.core.lesson_status", "completed");

      // Commit changes
      await api.commit();

      // Terminate the session
      await api.terminate();
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

// Initialize the module when the page loads
window.onload = initializeModule;
```

##### Synchronous API (Traditional SCORM style)

```javascript
import { createCrossFrameClient } from "scorm-again";

// Create a cross-frame client
const api = createCrossFrameClient();

// Use the synchronous API just like the traditional SCORM API
function initializeModule() {
  // Initialize the API
  if (api.lmsInitialize() === "true") {
    console.log("API initialized successfully");

    // Get the learner name
    const learnerName = api.lmsGetValue("cmi.core.student_name") ||
                       api.LMSGetValue("cmi.learner_name");

    // Set a value
    api.lmsSetValue("cmi.core.lesson_status", "completed");

    // Commit changes
    api.lmsCommit();

    // Terminate the session
    api.lmsFinish();
  } else {
    console.error("Failed to initialize API");
  }
}

// Initialize the module when the page loads
window.onload = initializeModule;
```

The synchronous API works by returning immediate results while performing asynchronous operations in the background. This makes it compatible with traditional SCORM modules that expect synchronous behavior.

### API

#### CrossFrameServer

```typescript
createCrossFrameServer(
  apiType: "2004" | "1.2" | "AICC" = "2004",
  settings?: Settings,
  startingData?: StringKeyMap,
  targetOrigin?: string
): CrossFrameServer
```

- **apiType**: The type of SCORM API to use (default: "2004")
- **settings**: Configuration settings for the API
- **startingData**: Initial data to load into the API
- **targetOrigin**: The target origin for postMessage (default: "*")

#### CrossFrameClient

```typescript
createCrossFrameClient(targetOrigin?: string): CrossFrameClient
```

- **targetOrigin**: The target origin for postMessage (default: "*")

#### ICrossFrameFacade

The CrossFrameClient implements the ICrossFrameFacade interface, which provides both asynchronous and synchronous methods for SCORM 1.2 and SCORM 2004 APIs:

##### Asynchronous Methods (SCORM 1.2)
- **initialize()**: Initialize the SCORM API
- **terminate()**: Terminate the SCORM API
- **getValue(element: string)**: Get a value from the SCORM API
- **setValue(element: string, value: any)**: Set a value in the SCORM API
- **commit()**: Commit changes to the LMS
- **getLastError()**: Get the last error code
- **getErrorString(errorCode: string | number)**: Get the error string for an error code
- **getDiagnostic(errorCode: string | number)**: Get diagnostic information for an error code

##### Asynchronous Methods (SCORM 2004)
- **Initialize()**: Initialize the SCORM API
- **Terminate()**: Terminate the SCORM API
- **GetValue(element: string)**: Get a value from the SCORM API
- **SetValue(element: string, value: any)**: Set a value in the SCORM API
- **Commit()**: Commit changes to the LMS
- **GetLastError()**: Get the last error code
- **GetErrorString(errorCode: string | number)**: Get the error string for an error code
- **GetDiagnostic(errorCode: string | number)**: Get diagnostic information for an error code

##### Synchronous Methods (SCORM 1.2)
- **lmsInitialize()**: Initialize the SCORM API
- **lmsFinish()**: Terminate the SCORM API
- **lmsGetValue(element: string)**: Get a value from the SCORM API
- **lmsSetValue(element: string, value: any)**: Set a value in the SCORM API
- **lmsCommit()**: Commit changes to the LMS
- **lmsGetLastError()**: Get the last error code
- **lmsGetErrorString(errorCode: string | number)**: Get the error string for an error code
- **lmsGetDiagnostic(errorCode: string | number)**: Get diagnostic information for an error code

##### Synchronous Methods (SCORM 2004)
- **LMSInitialize()**: Initialize the SCORM API
- **LMSFinish()**: Terminate the SCORM API
- **LMSGetValue(element: string)**: Get a value from the SCORM API
- **LMSSetValue(element: string, value: any)**: Set a value in the SCORM API
- **LMSCommit()**: Commit changes to the LMS
- **LMSGetLastError()**: Get the last error code
- **LMSGetErrorString(errorCode: string | number)**: Get the error string for an error code
- **LMSGetDiagnostic(errorCode: string | number)**: Get diagnostic information for an error code

##### Common Methods
- **isInitialized()**: Check if the API is currently initialized (asynchronous)
- **getIsInitialized()**: Check if the API is currently initialized (synchronous)
- **on(event: string, callback: Function)**: Register an event listener
- **off(event: string, callback: Function)**: Remove an event listener

### Nested Frame Support

The CrossFrameFacade also supports nested frames, where the e-learning module is loaded in a frame that is nested within another frame. This is useful when you have a complex application structure with multiple levels of frames from different domains.

#### Nested Frame Structure

```
Main Window (LMS domain)
|_ SCORM API (1.2 or 2004) attached to `window`
|_ CrossFrameServer is loaded, acting as proxy for API
|_ Frame A (CDN domain)
   |_ CrossFrameClient is loaded, which acts as local API for module
   |_ Frame B (CDN domain)
       |_ e-learning module content, communicates with CrossFrameClient, thinking it is the SCORM API
```

In this structure:
1. The Main Window contains the SCORM API and the CrossFrameServer
2. Frame A contains the CrossFrameClient, which communicates with the CrossFrameServer in the Main Window
3. Frame B contains the e-learning module, which communicates with the CrossFrameClient in Frame A

The CrossFrameClient in Frame A acts as a bridge, forwarding messages from the e-learning module in Frame B to the CrossFrameServer in the Main Window, and forwarding responses and events back to the e-learning module.

#### Setting Up Nested Frames

1. In the Main Window, create a CrossFrameServer:
   ```javascript
   const crossFrameServer = createCrossFrameServer("2004");
   ```

2. In Frame A, create a CrossFrameClient:
   ```javascript
   const crossFrameClient = createCrossFrameClient();
   ```

3. In Frame B, create another CrossFrameClient that will communicate with the CrossFrameClient in Frame A:
   ```javascript
   const api = createCrossFrameClient();
   ```

The e-learning module in Frame B can now use the `api` object just like it would use the regular SCORM API, and the messages will be forwarded through Frame A to the Main Window and back.

### Example

See the example wrapper files in the `test/integration/wrappers` directory:

- `scorm12-wrapper-cross-frame.html`: Example wrapper for SCORM 1.2
- `scorm2004-wrapper-cross-frame.html`: Example wrapper for SCORM 2004
- `aicc-wrapper-cross-frame.html`: Example wrapper for AICC
- `sample-cross-frame-module.html`: Example module that uses the CrossFrameClient

### Security Considerations

The CrossFrameFacade uses the postMessage API for cross-frame communication, which is designed to be secure for cross-origin communication. However, you should be aware of the following security considerations:

- By default, the targetOrigin is set to "*", which allows communication with any origin. In a production environment, you should set this to the specific origin of the other frame to prevent malicious sites from intercepting or sending messages.
- The CrossFrameServer will process any message that has the expected format, so make sure that only trusted modules are loaded in the iframe.
- The CrossFrameClient will process any message that has the expected format, so make sure that it's only used with trusted parent frames.
