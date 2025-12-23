---
sidebar_position: 3
title: Cross-Frame Communication
description: Guide for using scorm-again with SCORM content running in sandboxed iframes for secure cross-origin communication.
---
# Cross-Frame Communication

This guide explains how to use scorm-again with SCORM content running in sandboxed iframes, enabling secure cross-origin communication between your LMS and content frames.

## When to Use Cross-Frame Communication

Use this architecture when:
- Content runs in a sandboxed `<iframe>` for security isolation
- Content is served from a different origin than your LMS
- You need to prevent content from accessing parent window directly
- Corporate security policies require frame isolation

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    LMS Frame (Parent)                        │
│                   lms.example.com                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              CrossFrameLMS                           │    │
│  │  - Holds real Scorm12API or Scorm2004API            │    │
│  │  - Listens for postMessage from child               │    │
│  │  - Executes API calls and sends responses           │    │
│  └─────────────────────────────────────────────────────┘    │
│                           ▲                                  │
│                           │ postMessage                      │
│                           ▼                                  │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           Content Frame (Child iframe)              │    │
│  │              content.cdn.com                         │    │
│  │  ┌───────────────────────────────────────────┐      │    │
│  │  │            CrossFrameAPI                   │      │    │
│  │  │  - Proxy that mimics SCORM API            │      │    │
│  │  │  - Returns cached values synchronously    │      │    │
│  │  │  - Sends postMessage to parent async      │      │    │
│  │  │  - Updates cache when response arrives    │      │    │
│  │  └───────────────────────────────────────────┘      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

## Components

### CrossFrameLMS (Parent Frame)

The `CrossFrameLMS` class runs in your LMS frame. It:
1. Wraps your real SCORM API instance
2. Listens for postMessage requests from child frames
3. Executes the requested API methods
4. Sends results back via postMessage

### CrossFrameAPI (Child Frame)

The `CrossFrameAPI` class runs in the content frame. It:
1. Provides a SCORM-compatible API interface
2. Returns cached values synchronously (SCORM requires synchronous API)
3. Sends postMessage to parent for actual operations
4. Updates its cache when responses arrive

## Setup

### Step 1: Parent Frame (LMS)

In your LMS launch page that contains the iframe:

```html
<script src="scorm-again.min.js"></script>
<script>
  // Create the real API
  const api = new Scorm2004API({
    lmsCommitUrl: "/api/scorm/commit",
    // ... your settings
  });

  // Initialize with learner data
  api.loadFromJSON({
    "cmi.learner_id": "student123",
    "cmi.learner_name": "John Doe"
  });

  // Wrap with CrossFrameLMS
  // Restrict to specific content origin for security
  const crossFrame = new CrossFrameLMS(api, "https://content.cdn.com");
</script>

<iframe
  id="content-frame"
  src="https://content.cdn.com/course/index.html"
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

### Step 2: Child Frame (Content)

In the content's launch page:

```html
<script src="cross-frame-api.min.js"></script>
<script>
  // Create the proxy API
  // It will automatically attach to window.API (SCORM 1.2)
  // or window.API_1484_11 (SCORM 2004)
  const api = new CrossFrameAPI("https://lms.example.com", window.parent);

  // The content can now use standard SCORM calls
  // These return synchronously but update asynchronously
  api.Initialize("");
  const name = api.GetValue("cmi.learner_name"); // Returns cached value
  api.SetValue("cmi.score.raw", "85");
  api.Commit("");
  api.Terminate("");
</script>
```

## Configuration Options

### CrossFrameLMS Constructor

```typescript
new CrossFrameLMS(api: IBaseAPI, targetOrigin?: string)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `api` | IBaseAPI | required | The real SCORM API instance |
| `targetOrigin` | string | `"*"` | Allowed origin for messages. Use specific origin in production! |

### CrossFrameAPI Constructor

```typescript
new CrossFrameAPI(targetOrigin?: string, targetWindow?: Window)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `targetOrigin` | string | `"*"` | Origin of the parent LMS frame |
| `targetWindow` | Window | `window.parent` | The parent window to communicate with |

## Security Considerations

### Origin Validation

**Always specify explicit origins in production:**

```javascript
// UNSAFE - accepts messages from any origin
const crossFrame = new CrossFrameLMS(api, "*");

// SAFE - only accepts messages from specific origin
const crossFrame = new CrossFrameLMS(api, "https://content.cdn.com");
```

### Sandbox Attributes

Use appropriate iframe sandbox attributes:

```html
<!-- Minimal permissions for SCORM content -->
<iframe
  src="..."
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

| Attribute | Purpose |
|-----------|---------|
| `allow-scripts` | Required for SCORM content to run |
| `allow-same-origin` | Required for content to access its own origin |
| `allow-forms` | Only if content has form submissions |

### Message Sanitization

The CrossFrameAPI automatically:
- Removes function parameters (non-cloneable)
- Validates message structure before processing
- Logs warnings for dropped parameters

## How It Works

### Synchronous Facade Pattern

SCORM requires synchronous API calls, but postMessage is asynchronous. CrossFrameAPI solves this with a cache:

1. **SetValue calls**: Cache updated immediately, then sent to parent
2. **GetValue calls**: Return cached value immediately, then refresh cache from parent
3. **Initialize/Terminate/Commit**: Return "true" immediately, sync full state async

```javascript
// When content calls:
api.SetValue("cmi.score.raw", "85");

// CrossFrameAPI:
// 1. Updates local cache immediately
// 2. Returns "true" synchronously
// 3. Sends postMessage to parent (async)
// 4. Parent executes real SetValue
// 5. Parent sends result back
// 6. CrossFrameAPI updates cache with any server-side changes
```

### Message Protocol

Messages use a simple request/response protocol:

**Request (child → parent):**
```typescript
{
  messageId: "cfapi-1702745234567-0",  // Unique ID for correlation
  method: "SetValue",                   // API method name
  params: ["cmi.score.raw", "85"]       // Method parameters
}
```

**Response (parent → child):**
```typescript
{
  messageId: "cfapi-1702745234567-0",  // Matching request ID
  result: "true",                       // Method return value
  error?: { message: string, stack?: string }  // Only on error
}
```

### Timeout Handling

Requests timeout after 5 seconds:

```javascript
// CrossFrameAPI handles timeouts internally
// If parent doesn't respond in 5 seconds:
// - Promise rejects with timeout error
// - Error is captured and cached
// - GetLastError() returns appropriate error code
```

## Complete Example

### LMS Launch Page (parent.html)

```html
<!DOCTYPE html>
<html>
<head>
  <title>LMS - Course Launch</title>
  <script src="scorm-again.min.js"></script>
</head>
<body>
  <h1>Course: Introduction to SCORM</h1>
  <div id="progress">Progress: <span id="status">Not started</span></div>

  <iframe
    id="content-frame"
    src="https://content.cdn.com/course/index.html"
    sandbox="allow-scripts allow-same-origin"
    style="width: 100%; height: 600px; border: 1px solid #ccc;"
  ></iframe>

  <script>
    // Create and configure the real API
    const api = new Scorm2004API({
      lmsCommitUrl: "/api/scorm/commit",
      autocommit: true,
      autocommitSeconds: 30
    });

    // Load learner data from your LMS backend
    api.loadFromJSON({
      "cmi.learner_id": "student_12345",
      "cmi.learner_name": "Jane Smith",
      "cmi.entry": "ab-initio",
      "cmi.mode": "normal",
      "cmi.credit": "credit"
    });

    // Listen for status changes
    api.on("SetValue.cmi.completion_status", function(element, value) {
      document.getElementById("status").textContent = value;
    });

    // Create cross-frame bridge
    const crossFrame = new CrossFrameLMS(api, "https://content.cdn.com");

    console.log("LMS ready, waiting for content...");
  </script>
</body>
</html>
```

### Content Launch Page (content/index.html)

```html
<!DOCTYPE html>
<html>
<head>
  <title>SCORM Content</title>
  <script src="cross-frame-api.min.js"></script>
</head>
<body>
  <h1>Welcome to the Course</h1>
  <p>Learner: <span id="learner-name">Loading...</span></p>
  <button onclick="markComplete()">Mark Complete</button>

  <script>
    // Create proxy API pointing to LMS parent
    const api = new CrossFrameAPI("https://lms.example.com", window.parent);

    // Standard SCORM initialization
    api.Initialize("");

    // Get learner name (returns cached/empty initially, updates async)
    document.getElementById("learner-name").textContent =
      api.GetValue("cmi.learner_name") || "Loading...";

    // Refresh after async update
    setTimeout(function() {
      document.getElementById("learner-name").textContent =
        api.GetValue("cmi.learner_name");
    }, 1000);

    function markComplete() {
      api.SetValue("cmi.completion_status", "completed");
      api.SetValue("cmi.success_status", "passed");
      api.SetValue("cmi.score.scaled", "1.0");
      api.Commit("");
      api.Terminate("");
      alert("Course completed!");
    }
  </script>
</body>
</html>
```

## Troubleshooting

### Messages Not Received

**Symptom:** Content calls API but nothing happens in LMS

**Causes:**
1. Origin mismatch - Check that origins match exactly (including protocol and port)
2. Sandbox blocking - Ensure `allow-scripts` and `allow-same-origin` are set
3. Wrong target window - Verify `targetWindow` parameter

**Debug:**
```javascript
// In content frame, check if messages are being sent
window.addEventListener("message", function(e) {
  console.log("Content received:", e.data, "from:", e.origin);
});
```

### Cached Values Stale

**Symptom:** GetValue returns old/empty values

**Cause:** The synchronous return uses cached values; async update hasn't completed

**Solution:** Use a small delay for critical reads, or listen for value changes:
```javascript
api.Initialize("");
// Wait briefly for initial cache population
setTimeout(function() {
  const name = api.GetValue("cmi.learner_name");
  console.log("Name:", name);
}, 500);
```

### Timeout Errors

**Symptom:** Errors about method timeout

**Causes:**
1. Parent frame not loaded yet
2. CrossFrameLMS not initialized
3. Network issues between frames

**Solution:** Ensure parent is fully loaded before content makes API calls:
```javascript
// In content, wait for ready signal or use delay
window.addEventListener("load", function() {
  setTimeout(function() {
    api.Initialize("");
  }, 100);
});
```

## Limitations

1. **Initial GetValue returns empty**: First GetValue call returns cached (empty) value until async response arrives
2. **No real-time sync**: Cache updates are eventual, not immediate
3. **5-second timeout**: Long operations may timeout
4. **Function parameters dropped**: Callbacks cannot be passed through postMessage

## Related Documentation

- [LMS Integration Guide](./integration-guide.md) - Main integration guide
- [API Events Reference](./api-events-reference.md) - All available events
- [Offline Support](/docs/advanced/offline-support) - Offline capabilities
