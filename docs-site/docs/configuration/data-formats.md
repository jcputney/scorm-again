---
sidebar_position: 3
title: "Data Formats"
description: "Data commit formats and handler functions"
---

# Data Formats

The scorm-again library supports multiple data commit formats for sending SCORM data to your LMS. You can also customize how data is sent and how responses are handled using handler functions.

## Data Commit Formats

The `dataCommitFormat` setting controls how SCORM data is formatted when sent to the LMS. Three formats are supported:

- **`json`** (default) - Hierarchical JSON object
- **`flattened`** - Flat key-value pairs with dot notation
- **`params`** - URL query string parameters

### JSON Format

The JSON format sends data as a hierarchical object matching the SCORM CMI structure.

**Configuration:**

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  dataCommitFormat: 'json'
});
```

**Example SCORM 1.2 JSON Output:**

```json
{
  "cmi": {
    "core": {
      "student_id": "12345",
      "student_name": "John Doe",
      "lesson_location": "page5",
      "lesson_status": "completed",
      "score": {
        "raw": "85",
        "min": "0",
        "max": "100"
      },
      "total_time": "00:15:30",
      "session_time": "00:05:30",
      "exit": "suspend"
    },
    "suspend_data": "bookmark=chapter3;progress=75",
    "launch_data": "",
    "comments": "",
    "comments_from_lms": ""
  }
}
```

**Example SCORM 2004 JSON Output:**

```json
{
  "cmi": {
    "learner_id": "12345",
    "learner_name": "John Doe",
    "location": "page5",
    "completion_status": "completed",
    "success_status": "passed",
    "score": {
      "scaled": "0.85",
      "raw": "85",
      "min": "0",
      "max": "100"
    },
    "total_time": "PT15M30S",
    "session_time": "PT5M30S",
    "exit": "suspend",
    "suspend_data": "bookmark=chapter3;progress=75"
  }
}
```

**Use Cases:**
- Modern REST APIs
- Easy to parse on the server
- Natural representation of SCORM data
- Works well with JSON-based databases

### Flattened Format

The flattened format sends data as a flat object with dot-notation keys.

**Configuration:**

```javascript
const api = new Scorm12API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  dataCommitFormat: 'flattened'
});
```

**Example SCORM 1.2 Flattened Output:**

```json
{
  "cmi.core.student_id": "12345",
  "cmi.core.student_name": "John Doe",
  "cmi.core.lesson_location": "page5",
  "cmi.core.lesson_status": "completed",
  "cmi.core.score.raw": "85",
  "cmi.core.score.min": "0",
  "cmi.core.score.max": "100",
  "cmi.core.total_time": "00:15:30",
  "cmi.core.session_time": "00:05:30",
  "cmi.core.exit": "suspend",
  "cmi.suspend_data": "bookmark=chapter3;progress=75"
}
```

**Example SCORM 2004 Flattened Output:**

```json
{
  "cmi.learner_id": "12345",
  "cmi.learner_name": "John Doe",
  "cmi.location": "page5",
  "cmi.completion_status": "completed",
  "cmi.success_status": "passed",
  "cmi.score.scaled": "0.85",
  "cmi.score.raw": "85",
  "cmi.score.min": "0",
  "cmi.score.max": "100",
  "cmi.total_time": "PT15M30S",
  "cmi.session_time": "PT5M30S",
  "cmi.exit": "suspend",
  "cmi.suspend_data": "bookmark=chapter3;progress=75"
}
```

**Use Cases:**
- Legacy LMS systems expecting flat data
- Simple storage in key-value databases
- Easy to map to database columns
- Simpler to process in some languages

### Params Format

The params format sends data as URL query string parameters.

**Configuration:**

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  dataCommitFormat: 'params'
});
```

**Example SCORM 1.2 Params Output:**

```
?cmi.core.student_id=12345&cmi.core.student_name=John%20Doe&cmi.core.lesson_location=page5&cmi.core.lesson_status=completed&cmi.core.score.raw=85&cmi.core.score.min=0&cmi.core.score.max=100&cmi.core.total_time=00:15:30&cmi.core.session_time=00:05:30&cmi.core.exit=suspend&cmi.suspend_data=bookmark%3Dchapter3%3Bprogress%3D75
```

**Example SCORM 2004 Params Output:**

```
?cmi.learner_id=12345&cmi.learner_name=John%20Doe&cmi.location=page5&cmi.completion_status=completed&cmi.success_status=passed&cmi.score.scaled=0.85&cmi.score.raw=85&cmi.score.min=0&cmi.score.max=100&cmi.total_time=PT15M30S&cmi.session_time=PT5M30S&cmi.exit=suspend&cmi.suspend_data=bookmark%3Dchapter3%3Bprogress%3D75
```

**Use Cases:**
- GET request endpoints
- Simple PHP `$_GET` processing
- Lightweight data transmission
- Legacy systems expecting query parameters

## Handler Functions

Handler functions allow you to customize how data is transformed before sending to the LMS and how responses are processed.

### requestHandler

The `requestHandler` function transforms the commit object before sending it to the LMS.

**Function Signature:**

```typescript
requestHandler: (commitObject: CommitObject) => CommitObject
```

**Default Behavior:**

By default, `requestHandler` is the identity function (no transformation).

**Example - Adding Custom Fields:**

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  requestHandler: function(commitObject) {
    // Add custom metadata
    commitObject.timestamp = new Date().toISOString();
    commitObject.courseId = 'COURSE-12345';
    commitObject.userId = 'USER-67890';

    return commitObject;
  }
});
```

**Example - Modifying SCORM Data:**

```javascript
const api = new Scorm12API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  requestHandler: function(commitObject) {
    // Force completion status
    if (commitObject.cmi.core.score.raw >= 80) {
      commitObject.cmi.core.lesson_status = 'passed';
    }

    // Compress suspend data
    if (commitObject.cmi.suspend_data) {
      commitObject.cmi.suspend_data = LZString.compress(
        commitObject.cmi.suspend_data
      );
    }

    return commitObject;
  }
});
```

**Example - Wrapping Data:**

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  requestHandler: function(commitObject) {
    // Wrap in API envelope
    return {
      type: 'scorm_commit',
      version: '2004',
      data: commitObject,
      metadata: {
        timestamp: Date.now(),
        clientVersion: '3.0.0'
      }
    };
  }
});
```

### responseHandler

The `responseHandler` function processes async fetch Response objects when `useAsynchronousCommits=true`.

**Function Signature:**

```typescript
responseHandler: async (response: Response) => Promise<ResultObject>
```

**Expected Return Format:**

```typescript
interface ResultObject {
  result: boolean;      // Required: true for success, false for failure
  errorCode?: number;   // Optional: SCORM error code
}
```

**Default Behavior:**

The default handler expects JSON in the format: `{ "result": true, "errorCode": 0 }`

**Example - Custom Response Format:**

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  useAsynchronousCommits: true,
  responseHandler: async function(response) {
    const responseObj = await response.json();

    // LMS returns: { "success": true, "error": 0 }
    return {
      result: responseObj.success,
      errorCode: responseObj.error
    };
  }
});
```

**Example - Handling Different Status Codes:**

```javascript
const api = new Scorm12API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  useAsynchronousCommits: true,
  responseHandler: async function(response) {
    if (!response.ok) {
      console.error('LMS commit failed:', response.status);
      return {
        result: false,
        errorCode: 101 // General exception
      };
    }

    const data = await response.json();
    return {
      result: data.success === true,
      errorCode: data.errorCode || 0
    };
  }
});
```

**Example - XML Response:**

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  useAsynchronousCommits: true,
  responseHandler: async function(response) {
    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const success = xmlDoc.querySelector('success')?.textContent === 'true';
    const errorCode = parseInt(
      xmlDoc.querySelector('errorCode')?.textContent || '0'
    );

    return {
      result: success,
      errorCode: errorCode
    };
  }
});
```

### xhrResponseHandler

The `xhrResponseHandler` function processes synchronous XMLHttpRequest responses when `useAsynchronousCommits=false` (default).

**Function Signature:**

```typescript
xhrResponseHandler: (xhr: XMLHttpRequest) => ResultObject
```

**Expected Return Format:**

```typescript
interface ResultObject {
  result: boolean;      // Required: true for success, false for failure
  errorCode?: number;   // Optional: SCORM error code
}
```

**Default Behavior:**

The default handler expects JSON in the format: `{ "result": true, "errorCode": 0 }`

**Example - Custom Response Format:**

```javascript
const api = new Scorm12API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  xhrResponseHandler: function(xhr) {
    if (xhr.status !== 200) {
      return {
        result: false,
        errorCode: 101
      };
    }

    const responseObj = JSON.parse(xhr.responseText);

    // LMS returns: { "success": true, "code": 0 }
    return {
      result: responseObj.success,
      errorCode: responseObj.code
    };
  }
});
```

**Example - Plain Text Response:**

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  xhrResponseHandler: function(xhr) {
    // LMS returns: "OK" or "ERROR"
    const success = xhr.responseText.trim() === 'OK';

    return {
      result: success,
      errorCode: success ? 0 : 101
    };
  }
});
```

**Example - XML Response:**

```javascript
const api = new Scorm12API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  xhrResponseHandler: function(xhr) {
    const xmlDoc = xhr.responseXML;

    const success = xmlDoc.querySelector('success')?.textContent === 'true';
    const errorCode = parseInt(
      xmlDoc.querySelector('errorCode')?.textContent || '0'
    );

    return {
      result: success,
      errorCode: errorCode
    };
  }
});
```

## Combining Formats and Handlers

You can combine data formats with handler functions for complete customization:

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  dataCommitFormat: 'flattened',

  requestHandler: function(commitObject) {
    // Add authentication token
    commitObject['auth_token'] = 'YOUR_TOKEN';

    // Add course metadata
    commitObject['course_id'] = 'COURSE-123';
    commitObject['sco_id'] = 'SCO-456';

    return commitObject;
  },

  xhrResponseHandler: function(xhr) {
    // Custom response parsing
    const data = JSON.parse(xhr.responseText);

    if (data.status === 'success') {
      return { result: true, errorCode: 0 };
    } else {
      console.error('Commit failed:', data.message);
      return { result: false, errorCode: data.errorCode || 101 };
    }
  }
});
```

## Common Use Cases

### Adding Authentication Headers

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  xhrHeaders: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'X-Course-ID': 'COURSE-123'
  }
});
```

### Compressing Suspend Data

```javascript
// Using LZ-String library
import LZString from 'lz-string';

const api = new Scorm12API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  requestHandler: function(commitObject) {
    if (commitObject.cmi.suspend_data) {
      commitObject.cmi.suspend_data = LZString.compressToBase64(
        commitObject.cmi.suspend_data
      );
    }
    return commitObject;
  }
});
```

### Encrypting Sensitive Data

```javascript
// Using CryptoJS library
import CryptoJS from 'crypto-js';

const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  requestHandler: function(commitObject) {
    const secretKey = 'YOUR_SECRET_KEY';

    // Encrypt suspend data
    if (commitObject.cmi.suspend_data) {
      commitObject.cmi.suspend_data = CryptoJS.AES.encrypt(
        commitObject.cmi.suspend_data,
        secretKey
      ).toString();
    }

    return commitObject;
  }
});
```

### Logging All Commits

```javascript
const api = new Scorm12API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  requestHandler: function(commitObject) {
    // Log to analytics
    console.log('Committing data:', commitObject);

    // Send to logging service
    fetch('https://analytics.example.com/log', {
      method: 'POST',
      body: JSON.stringify({
        event: 'scorm_commit',
        data: commitObject,
        timestamp: new Date().toISOString()
      })
    });

    return commitObject;
  }
});
```

### Handling Offline/Online

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/commit',
  xhrResponseHandler: function(xhr) {
    if (xhr.status === 0) {
      // Network error - likely offline
      console.warn('Offline - commit will retry when online');

      // Store for later
      const commitData = xhr.responseText;
      localStorage.setItem('pending_commit', commitData);

      // Return success to prevent error display
      return { result: true, errorCode: 0 };
    }

    // Normal processing
    const data = JSON.parse(xhr.responseText);
    return {
      result: data.result,
      errorCode: data.errorCode || 0
    };
  }
});
```

## Best Practices

### 1. Validate Response Format

Always validate the response format before processing:

```javascript
responseHandler: async function(response) {
  try {
    const data = await response.json();

    if (typeof data.result !== 'boolean') {
      console.error('Invalid response format');
      return { result: false, errorCode: 101 };
    }

    return {
      result: data.result,
      errorCode: data.errorCode || 0
    };
  } catch (error) {
    console.error('Failed to parse response:', error);
    return { result: false, errorCode: 101 };
  }
}
```

### 2. Don't Modify Original Objects

Create copies when transforming data:

```javascript
requestHandler: function(commitObject) {
  // Create a shallow copy
  const modified = { ...commitObject };

  // Add custom fields
  modified.timestamp = Date.now();

  return modified;
}
```

### 3. Handle Errors Gracefully

```javascript
xhrResponseHandler: function(xhr) {
  try {
    if (xhr.status >= 200 && xhr.status < 300) {
      const data = JSON.parse(xhr.responseText);
      return {
        result: data.success === true,
        errorCode: data.errorCode || 0
      };
    } else {
      console.error(`LMS returned status ${xhr.status}`);
      return { result: false, errorCode: 101 };
    }
  } catch (error) {
    console.error('Error processing response:', error);
    return { result: false, errorCode: 101 };
  }
}
```

### 4. Keep Handlers Simple

Avoid heavy processing in handlers to prevent blocking:

```javascript
// Good - lightweight
requestHandler: function(commitObject) {
  commitObject.timestamp = Date.now();
  return commitObject;
}

// Bad - heavy processing
requestHandler: function(commitObject) {
  // Don't do this - too much work
  for (let i = 0; i < 1000000; i++) {
    // Complex calculation
  }
  return commitObject;
}
```

## Related Documentation

- [Settings Reference](./settings-reference.md) - All configuration options
- [Event Listeners](./event-listeners.md) - Event system documentation
