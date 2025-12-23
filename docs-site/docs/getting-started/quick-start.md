---
sidebar_position: 3
title: "Quick Start"
description: "Get up and running quickly with scorm-again - basic usage examples for SCORM 1.2 and SCORM 2004"
---

# Quick Start

This guide will help you create your first SCORM API instance and understand the basic usage patterns.

## Creating a SCORM 1.2 API Instance

Here's the simplest way to create and use a SCORM 1.2 API:

### Browser (with script tag)

```javascript
// Create API with basic settings
const settings = {
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit'
};

// Create and attach to window for SCORM content discovery
window.API = new Scorm12API(settings);

// The SCORM content can now find and use the API
// It will call: window.API.LMSInitialize("")
```

### ES Module

```javascript
import { Scorm12API } from 'scorm-again/scorm12';

const settings = {
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit'
};

// Attach to window for SCORM content to discover
window.API = new Scorm12API(settings);
```

## Creating a SCORM 2004 API Instance

SCORM 2004 follows a similar pattern:

### Browser (with script tag)

```javascript
// Create API with basic settings
const settings = {
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit'
};

// Create and attach to window for SCORM content discovery
window.API_1484_11 = new Scorm2004API(settings);

// The SCORM content can now find and use the API
// It will call: window.API_1484_11.Initialize("")
```

### ES Module

```javascript
import { Scorm2004API } from 'scorm-again/scorm2004';

const settings = {
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit'
};

// Attach to window for SCORM content to discover
window.API_1484_11 = new Scorm2004API(settings);
```

## Essential Settings

Here are the most important settings to get started:

### autocommit

When `true`, the API automatically saves data to the LMS after a configurable delay (default 60 seconds). This reduces the risk of data loss if the learner closes the browser window.

```javascript
const settings = {
  autocommit: true,
  autocommitSeconds: 60  // Save after 60 seconds of inactivity
};
```

### lmsCommitUrl

The URL endpoint where SCORM data should be sent when committing. If not provided, the API will log all calls to the console but won't persist data.

```javascript
const settings = {
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit'
};
```

### logLevel

Control how verbose the logging should be:

```javascript
const settings = {
  logLevel: 'DEBUG'  // Options: 'DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'
};
```

Or use numeric values:

```javascript
const settings = {
  logLevel: 1  // 1=DEBUG, 2=INFO, 3=WARN, 4=ERROR, 5=NONE
};
```

## Complete Basic Example

Here's a complete example that demonstrates the typical setup:

```javascript
import { Scorm2004API } from 'scorm-again/scorm2004';

// Configure the API
const settings = {
  autocommit: true,
  autocommitSeconds: 60,
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
  logLevel: 'INFO'
};

// Create and attach to window
const api = new Scorm2004API(settings);
window.API_1484_11 = api;

// Listen for events (optional but recommended)
api.on('Initialize', () => {
  console.log('SCORM content initialized');
});

api.on('SetValue.cmi.completion_status', (cmiElement, value) => {
  console.log('Completion status changed to:', value);
});

api.on('Terminate', () => {
  console.log('SCORM session terminated');
});

// The SCORM content will now be able to communicate with the LMS
```

## Loading Initial Data

Before the SCORM content initializes, you can pre-load data from your LMS:

### Setting Individual Values

```javascript
// Set learner information
window.API_1484_11.cmi.learner_id = "12345";
window.API_1484_11.cmi.learner_name = "John Doe";

// Set previous progress
window.API_1484_11.cmi.completion_status = "incomplete";
window.API_1484_11.cmi.suspend_data = "bookmark=page5";
```

### Loading from JSON

```javascript
const initialData = {
  learner_id: "12345",
  learner_name: "John Doe",
  completion_status: "incomplete",
  suspend_data: "bookmark=page5",
  score: {
    scaled: 0.75
  }
};

window.API_1484_11.loadFromJSON(initialData);
```

### Loading from Flattened JSON

```javascript
const flattenedData = {
  "cmi.learner_id": "12345",
  "cmi.learner_name": "John Doe",
  "cmi.completion_status": "incomplete",
  "cmi.suspend_data": "bookmark=page5",
  "cmi.score.scaled": "0.75"
};

window.API_1484_11.loadFromFlattenedJSON(flattenedData);
```

## API Discovery Pattern

:::important
SCORM content expects to find the API on the `window` object. This is part of the SCORM specification's API Discovery Algorithm.
:::

For SCORM 1.2, content looks for `window.API`:
```javascript
window.API = new Scorm12API(settings);
```

For SCORM 2004, content looks for `window.API_1484_11`:
```javascript
window.API_1484_11 = new Scorm2004API(settings);
```

If your SCORM player runs in a different frame or window hierarchy, you may need to implement the full API discovery algorithm. See the [SCORM API Discovery Algorithms](https://scorm.com/scorm-explained/technical-scorm/run-time/api-discovery-algorithms/) documentation for details.

## Accessing CMI Data

You can directly access the CMI data stored by the API:

### SCORM 1.2
```javascript
const studentName = window.API.cmi.core.student_name;
const lessonStatus = window.API.cmi.core.lesson_status;
const score = window.API.cmi.core.score.raw;
```

### SCORM 2004
```javascript
const learnerName = window.API_1484_11.cmi.learner_name;
const completionStatus = window.API_1484_11.cmi.completion_status;
const scoreScaled = window.API_1484_11.cmi.score.scaled;
```

## TypeScript Example

For TypeScript projects, you get full type support:

```typescript
import { Scorm2004API, Settings } from 'scorm-again';

// Settings are fully typed
const settings: Settings = {
  autocommit: true,
  autocommitSeconds: 60,
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
  logLevel: 'INFO'
};

const api = new Scorm2004API(settings);
window.API_1484_11 = api;

// Event handlers are typed
api.on('SetValue.cmi.completion_status', (cmiElement: string, value: string) => {
  console.log(`${cmiElement} set to ${value}`);
});
```

## Data Commit Formats

scorm-again supports three different formats for sending data to your LMS:

### JSON Format (default)
```javascript
const settings = {
  dataCommitFormat: 'json'  // Default
};
// Sends: { "cmi": { "learner_id": "123", "completion_status": "completed" } }
```

### Flattened Format
```javascript
const settings = {
  dataCommitFormat: 'flattened'
};
// Sends: { "cmi.learner_id": "123", "cmi.completion_status": "completed" }
```

### Query Parameters Format
```javascript
const settings = {
  dataCommitFormat: 'params'
};
// Sends: ?cmi.learner_id=123&cmi.completion_status=completed
```

## Next Steps

Now that you understand the basics, you can:

- Explore [advanced configuration options](/docs/configuration/settings-reference)
- Learn about [event listeners](/docs/lms-integration/api-events-reference) for building custom UI
- Review [LMS integration patterns](/docs/lms-integration/integration-guide)
- Understand [cross-frame communication](/docs/lms-integration/cross-frame-communication) for sandboxed iframes
- Check out the API reference for [SCORM 1.2](/docs/api-reference/scorm12-api) or [SCORM 2004](/docs/api-reference/scorm2004-api)

For a complete list of settings and their descriptions, see the [Settings Reference](/docs/configuration/settings-reference).
