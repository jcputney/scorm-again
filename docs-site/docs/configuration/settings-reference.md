---
sidebar_position: 1
title: "Settings Reference"
description: "Complete reference for all SCORM API configuration settings"
---

# Settings Reference

The APIs include several settings to customize the functionality of each API. Settings are passed when creating a new API instance.

## Basic Usage

```javascript
const settings = {
  autocommit: true,
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
  logLevel: 'DEBUG'
};

// SCORM 1.2
window.API = new Scorm12API(settings);

// SCORM 2004
window.API_1484_11 = new Scorm2004API(settings);
```

## Settings Table

### General Settings

| Setting | Default | Type | Description |
|---------|---------|------|-------------|
| `autocommit` | `false` | boolean | Determines whether the API schedules an autocommit to the LMS after setting a value. |
| `autocommitSeconds` | `10` | number | Number of seconds to wait before autocommitting. Timer is restarted if another value is set. |
| `sendFullCommit` | `true` | boolean | Determines whether the API sends the full CMI object as part of the commit, or if it only sends the fields that actually contain values. |
| `renderCommonCommitFields` | `false` | boolean | Emits a structured commit object with summary fields and `runtimeData`. SCORM 2004 structured commits also include the sequencing `globalObjectives` snapshot. |
| `selfReportSessionTime` | `false` | boolean | Measures elapsed time from `Initialize()` and uses it instead of relying on SCO-reported `session_time`. |
| `alwaysSendTotalTime` | `false` | boolean | Should the API always send `total_time` when committing to the LMS. |

### HTTP/Network Settings

| Setting | Default | Type | Description |
|---------|---------|------|-------------|
| `lmsCommitUrl` | `false` | string \| false | The URL endpoint of the LMS where data should be sent upon commit. If no value is provided, modules will run as usual, but all method calls will be logged to the console. |
| `throttleCommits` | `false` | boolean | When enabled, throttles commit requests by delaying them 500ms, allowing rapid changes to be batched into a single commit. Only works when `useAsynchronousCommits=true`. Cannot be used with synchronous commits. |
| `useAsynchronousCommits` | `false` | boolean | Use async HTTP requests (legacy behavior). **Not SCORM compliant.** May cause data loss. Only use for specific legacy use cases. |
| `commitRequestDataType` | `'application/json;charset=UTF-8'` | string | This setting is provided in case your LMS expects a different content type or character set. |
| `fetchMode` | `'cors'` | string | The fetch mode to use when sending requests to the LMS. Options: `'cors'`, `'no-cors'`, `'same-origin'`, `'navigate'`. |
| `asyncModeBeaconBehavior` | `'never'` | string | In asynchronous mode, controls when to use Beacon instead of fetch: `'always'`, `'on-terminate'`, or `'never'`. Synchronous mode always uses Beacon for termination commits. |
| `xhrWithCredentials` | `false` | boolean | Sets the withCredentials flag on the request to the LMS. |
| `xhrHeaders` | `{}` | object | This allows setting of additional headers on the request to the LMS where the key should be the header name and the value is the value of the header you want to send. |
| `httpService` | `null` | IHttpService \| null | Advanced: Inject custom HTTP service implementation. Overrides `useAsynchronousCommits`. |
| `terminateCommitParam` | `undefined` | string | When set, the terminate-time commit's URL gets `?<name>=true` appended (or `&<name>=true` if `lmsCommitUrl` already has a query string), letting the server distinguish the final commit from heartbeat commits. Applies to normal terminate commits, sendBeacon terminate commits, and offline replays of a terminate commit. |
| `terminateCommitPayloadField` | `undefined` | string | When set, the terminate-time commit's payload gets `<name>: true` added (object formats) or `<name>=true` appended (`params` format). Independent of `terminateCommitParam`; either or both may be used. |
| `terminationCommitContentType` | `'text/plain;charset=UTF-8'` | string | Content type for Beacon termination commits. Use asynchronous fetch with `asyncModeBeaconBehavior: 'never'` for cross-origin JSON or custom authorization headers. |
| `includeCommitSequence` | `false` | boolean | When enabled, every commit payload includes a `commitSequence` field with a monotonically increasing number assigned when the commit is captured. Offline-replayed commits keep their original sequence, so servers can reject stale, out-of-order commits. |

### Data Format Settings

| Setting | Default | Type | Description |
|---------|---------|------|-------------|
| `dataCommitFormat` | `'json'` | string | Format for sending data to the LMS. Options: `'json'`, `'flattened'`, `'params'`. See [Data Formats](./data-formats.md) for details. |
| `requestHandler` | function | function | A function to transform the commit object before sending it to `lmsCommitUrl`. Receives an optional second `CommitMetadata` argument (`{ isTerminateCommit, trigger, sequence }`); existing one-argument handlers keep working unchanged. By default it's the identity function (no transformation). |
| `responseHandler` | function | async function | Custom response handler for async fetch Response objects. Called when `useAsynchronousCommits=true`. The APIs expect the result from the LMS to be in the format: `{ "result": true, "errorCode": 0 }` (errorCode is optional). |
| `xhrResponseHandler` | function | function | Custom response handler for synchronous XMLHttpRequest responses. Called when `useAsynchronousCommits=false`. |

### Logging Settings

| Setting | Default | Type | Description |
|---------|---------|------|-------------|
| `logLevel` | `4` | number \| string | By default, the APIs only log error messages. Options: `1` or `'DEBUG'`, `2` or `'INFO'`, `3` or `'WARN'`, `4` or `'ERROR'`, `5` or `'NONE'`. |
| `onLogMessage` | function | function | A function to be called whenever a message is logged. Defaults to `console.{error,warn,info,debug,log}`. |

### SCORM 1.2 Specific Settings

| Setting | Default | Type | Description |
|---------|---------|------|-------------|
| `mastery_override` | `false` | boolean | Used to override a module's `cmi.core.lesson_status` so that a pass/fail is determined based on a mastery score and the user's raw score, rather than using whatever status is provided by the module. An example of this would be if a module is published using a `Complete/Incomplete` final status, but the LMS always wants to receive a `Passed/Failed` for quizzes, then we can use this setting to override the given final status. |
| `autoCompleteLessonStatus` | `false` | boolean | Controls termination behaviour for SCOs that never set `cmi.core.lesson_status`. When false (default), the API leaves the status as `incomplete`; when true, it restores the legacy behaviour of auto-upgrading to `completed`. |

### SCORM 2004 Specific Settings

| Setting | Default | Type | Description |
|---------|---------|------|-------------|
| `autoProgress` | `false` | boolean | In case Sequencing is being used, you can tell the API to automatically throw the `SequenceNext` event. |
| `scoItemIds` | `[]` | string[] | A list of valid SCO IDs to be used for choice/jump sequence validation. If a `sequencing` configuration is provided with an activity tree, this list will be automatically populated with all activity IDs from the tree. |
| `scoItemIdValidator` | `false` | false \| function | A function to be called during choice/jump sequence checks to determine if a SCO ID is valid. Could be used to call an API to check validity. |
| `globalObjectiveIds` | `[]` | string[] | Host-defined objective IDs exposed directly as global CMI rows. Manifest `<imsss:mapInfo>` targets are discovered from the activity tree and should not be duplicated here. |
| `sequencing` | `null` | SequencingSettings \| null | Configuration for SCORM 2004 sequencing, including activity tree, sequencing rules, sequencing controls, and rollup rules. **This data must be extracted by the LMS from the package's imsmanifest.xml file.** See the [Sequencing Configuration documentation](../advanced/sequencing.md) for details on the required format and LMS integration requirements. |
| `sequencingStatePersistence` | `undefined` | SequencingStatePersistenceConfig | Callbacks and options for activity tracking state. Set `autoLoadOnInitialize: false` when the LMS explicitly awaits a preload before initial delivery. |

### Offline Support Settings

| Setting | Default | Type | Description |
|---------|---------|------|-------------|
| `enableOfflineSupport` | `false` | boolean | Enable offline support for storing and syncing data when offline. |
| `courseId` | `undefined` | string | Unique identifier for the course (required when offline support is enabled). |
| `syncOnInitialize` | `true` | boolean | Attempt to sync data when initializing API. |
| `syncOnTerminate` | `true` | boolean | Attempt to sync data when terminating API. |
| `maxSyncAttempts` | `5` | number | Maximum number of attempts to sync an item. |

## Setting Examples

### TypeScript Usage

```typescript
import { Scorm2004API, Settings } from 'scorm-again';

// Create an instance with typed settings
const settings: Settings = {
  autocommit: true,
  logLevel: 'DEBUG',
  lmsCommitUrl: 'https://your-lms.com/api/commit'
};

const api = new Scorm2004API(settings);
```

### Minimal Configuration

```javascript
// Run without LMS - all calls logged to console
const api = new Scorm12API({
  logLevel: 'DEBUG'
});
```

### Production Configuration

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
  autocommit: true,
  autocommitSeconds: 30,
  sendFullCommit: false,
  logLevel: 'ERROR',
  xhrHeaders: {
    'Authorization': 'Bearer YOUR_TOKEN'
  }
});
```

### Offline Support Configuration

```javascript
const api = new Scorm12API({
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
  autocommit: true,
  enableOfflineSupport: true,
  courseId: 'COURSE-12345',
  syncOnInitialize: true,
  syncOnTerminate: true,
  maxSyncAttempts: 5
});
```

### SCORM 2004 with Sequencing

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
  autoProgress: true,
  selfReportSessionTime: true,
  renderCommonCommitFields: true,
  sequencing: {
    autoRollupOnCMIChange: false,
    activityTree: {
      id: 'root',
      title: 'Course',
      children: [
        {
          id: 'module1',
          title: 'Module 1',
          children: [
            { id: 'lesson1', title: 'Lesson 1' },
            { id: 'lesson2', title: 'Lesson 2' }
          ]
        }
      ]
    }
  }
});
```

## Related Documentation

- [Data Formats](./data-formats.md) - Details on data commit formats
- [Event Listeners](./event-listeners.md) - Event system documentation
- [Sequencing Configuration](../advanced/sequencing.md) - SCORM 2004 sequencing setup
