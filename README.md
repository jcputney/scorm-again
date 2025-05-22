[![Github Actions](https://img.shields.io/github/actions/workflow/status/jcputney/scorm-again/main.yml?style=for-the-badge "Build Status")](https://github.com/jcputney/scorm-again/actions)
[![Codecov](https://img.shields.io/codecov/c/github/jcputney/scorm-again?style=for-the-badge "Code Coverage")](https://codecov.io/gh/jcputney/scorm-again)
![jsDelivr hits (npm)](https://img.shields.io/jsdelivr/npm/hy/scorm-again?style=for-the-badge&label=jsDelivr%20Downloads)
![NPM Downloads](https://img.shields.io/npm/dy/scorm-again?style=for-the-badge&label=npm%20Downloads)
![npm bundle size](https://img.shields.io/bundlephobia/min/scorm-again?style=for-the-badge)
[![npm](https://img.shields.io/npm/v/scorm-again?color=%2344cc11&style=for-the-badge)](https://www.npmjs.com/package/scorm-again)
![GitHub License](https://img.shields.io/github/license/jcputney/scorm-again?style=for-the-badge)
[![donate](https://img.shields.io/badge/paypal-donate-success?style=for-the-badge)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=NF5MPZJAV26LE)

# scorm-again

This project was created to modernize the SCORM JavaScript runtime, and to provide a stable, tested
platform for running AICC, SCORM 1.2, and SCORM 2004 modules. This module is designed to be LMS
agnostic, and is written to be able to be run without a backing LMS, logging all function calls and
data instead of committing, if an LMS endpoint is not configured.

## What is this not and what doesn't it do?

1. This is not an LMS
1. This does not handle the uploading and verification of SCORM/AICC modules (if you need a way to
   verify and parse modules, I have written a library in Java that can be used to
   extract the manifest and other
   metadata: [jcputney/elearning-module-parser](https://github.com/jcputney/elearning-module-parser))
1. This library does not setup communication between an external AICC module and an LMS.
1. This project is not complete! I'm still working on SCORM 2004 sequencing and testing

## Cross-Frame Communication

> **Note:** The Cross-Frame Communication feature is available in scorm-again v3.0.0+
> It’s implemented with a cache-first shim (no SharedArrayBuffer) and a Proxy-based façade.

### Purpose of CrossFrameLMS and CrossFrameAPI

The Cross-Frame Communication feature lets SCORM content run inside sandboxed or cross-origin
iframes while still talking to the real SCORM API in the parent frame. It’s ideal when:

- Loading SCORM content in a sandboxed iframe for extra security
- Your app has a multi-frame architecture (e.g. host frame + content frame)
- You need to avoid cross-origin restrictions between content and the LMS
- You want to isolate SCORM runtime calls from your main application logic

There are two core pieces:

1. **CrossFrameLMS**
   - Lives in the **parent** frame where the real SCORM API is initialized
   - Listens for `postMessage` calls from child frames
   - Invokes the actual SCORM methods (Initialize, GetValue, SetValue, Commit, Terminate, etc.)
   - Posts back `{ messageId, result, error }`

2. **CrossFrameAPI**
   - Lives in the **child** (content) frame and replaces the global `API` / `API_1484_11`
   - Uses a JavaScript `Proxy` so you don’t need to predefine every SCORM method
   - **Synchronously** returns cached values or defaults for `GetValue`, `Initialize`, `Commit`,
     `SetValue`, `Finish`, etc.
   - **Asynchronously** sends a `postMessage` to refresh the cache and update `GetLastError` behind
     the scenes
   - Caches the current state of the CMI object in the child frame, so that most calls are
     synchronous and accurate
   - Handles the `LMSInitialize` and `LMSFinish` calls to the LMS in the parent frame
  - Falls back gracefully in all browsers (including IE11) without blocking the main thread

Both constructors accept an optional **origin** parameter.
`CrossFrameLMS(api, origin)` validates incoming messages against the child's
origin (default `"*"`), while `CrossFrameAPI(origin, targetWindow)` uses the
origin when posting messages to the parent (also default `"*"`).

### How to Use Cross-Frame Communication

#### In the Parent Frame (LMS host)

```javascript
import CrossFrameLMS from 'scorm-again/cross-frame-lms';
import {Scorm12API} from 'scorm-again/scorm12';

const api = new Scorm12API({
   autocommit: true,
   logLevel: 1
});

// Create the server-side facade
// Allow messages from the child frame's origin
new CrossFrameLMS(api, 'https://child.example.com');
```

#### In the Child Frame (SCORM content)

```javascript
import CrossFrameAPI from 'scorm-again/cross-frame-api';

// Replace the global API with the cross-frame client
// Send messages to the parent LMS frame
window.API = window.API_1484_11 = new CrossFrameAPI('https://parent.example.com');

window.API.LMSInitialize();
window.API.LMSSetValue('cmi.core.lesson_status', 'completed');
window.API.LMSCommit();
```

### Notes

- No SharedArrayBuffer or Atomics; everything is async under the hood, but sync from the SCORM
  module’s perspective.
- Works in modern browsers and IE11.
- For guaranteed Finish/Terminate delivery on unload, consider using `navigator.sendBeacon`.

## Offline Support

scorm-again provides robust offline capabilities that allow SCORM content to function without an
active internet connection. This is particularly valuable for mobile applications, remote areas with
limited connectivity, or scenarios with unreliable network conditions.

> **Note:** The Offline Support feature is currently being developed for scorm-again
> v3.0.0.
>
> I may consider splitting it out as a plugin to keep browser package size down.

### Key Features

- Run SCORM modules locally without network connectivity
- Automatically store SCORM data locally when offline
- Synchronize data back to the LMS when connectivity is restored
- Works seamlessly across multiple platforms and devices

### How to Enable Offline Support

```javascript
// Example configuration with offline support
const settings = {
   // Standard settings
   lmsCommitUrl: "https://your-lms.com/api/scorm/commit",
   autocommit: true,

   // Offline support settings
   enableOfflineSupport: true,  // Enable offline support
   courseId: "COURSE-12345",    // Unique identifier for the course
   syncOnInitialize: true,      // Attempt to sync data when initializing API
   syncOnTerminate: true,       // Attempt to sync data when terminating API
   maxSyncAttempts: 5           // Maximum number of attempts to sync an item
};

// Create the API with offline support
const api = new Scorm12API(settings);
```

### Mobile Framework Integration

scorm-again provides detailed implementation examples for various mobile frameworks:

- React Native
- Flutter
- iOS (Native)
- Android (Native)
- Xamarin/MAUI
- Kotlin Multiplatform

For detailed implementation guides and examples, see
our [offline support documentation](docs/offline_support.md).

## Documentation

### API Usage Documentation

- **API Examples**
   - [AICC API Examples](docs/api_usage/examples/aicc_examples.md)
   - [SCORM 1.2 API Examples](docs/api_usage/examples/scorm12_examples.md)
   - [SCORM 2004 API Examples](docs/api_usage/examples/scorm2004_examples.md)
- [Common Use Cases](docs/api_usage/use_cases/common_use_cases.md)
- [Troubleshooting Guide](docs/api_usage/troubleshooting/troubleshooting_guide.md)

### Developer Documentation

- [Development Workflow](docs/developer/development_workflow.md)
- [Contribution Guidelines](docs/developer/contribution_guidelines.md)
- [Testing Strategy](docs/developer/testing_strategy.md)
- [Method Standards](docs/method_standards.md)

### Bundle Size Optimization

To reduce the bundle size for production deployments:

1. **Use Production Builds**:
   ```bash
   npm run build:prod
   # or
   npm run build:all:prod
   ```
   This disables source maps unless NODE_ENV is set to 'production'.

2. **Use Minified Versions**:
   Always use the `.min.js` versions in production for smaller file sizes.

3. **Import Specific APIs**:
   Import only the specific API you need rather than the entire library:
   ```javascript
   // Instead of
   import {Scorm2004API} from 'scorm-again';

   // Use
   import {Scorm2004API} from 'scorm-again/scorm2004/min';
   ```

4. **Modern Browsers**:
   If you don't need IE11 support, consider using the ESM versions for modern browsers:
   ```javascript
   import {Scorm2004API} from 'scorm-again/scorm2004/min';
   ```

### Style Guide

- [TypeScript Style Guide](.junie/guidelines.md)

### Setup

To begin with, you include either the `scorm-again.js` or `scorm-again.min.js` file on your
launching page:

```html

<script type="text/javascript" src="/dist/scorm-again.js"></script>
```

Or, if you would like to only pull in one API, you include either the `aicc.js`, `scorm12.js` or
`scorm2004.js` files or their minified versions on your launching page:

```html

<script type="text/javascript" src="/dist/scorm2004.js"></script>
```

#### NPM/Yarn with ES Modules (ESM)

**Installing the package:**

```sh
npm install scorm-again
# or
yarn add scorm-again
```

#### CommonJS (Node.js or bundlers with CommonJS support)

**Importing the legacy build:**

```javascript
// Full library
const {AICC, Scorm12API, Scorm2004API} = require('scorm-again');

// Individual APIs
const {AICC} = require('scorm-again/aicc');
const {Scorm12API} = require('scorm-again/scorm12');
const {Scorm2004API} = require('scorm-again/scorm2004');
```

#### TypeScript Usage

TypeScript types are included with the package:

```typescript
import {AICC, Scorm12API, Scorm2004API} from 'scorm-again';
import {Settings} from 'scorm-again'; // Import types

// Create an instance with typed settings
const settings: Settings = {
   autocommit: true,
   logLevel: 'DEBUG'
};

const api = new Scorm2004API(settings);
```

#### Usage Examples

**Creating an API instance:**

```javascript
// Browser (after including the script)
const settings = {
   autocommit: true,
   lmsCommitUrl: 'https://your-lms.com/commit'
};

// AICC
window.API = new AICC(settings);

// SCORM 1.2
window.API = new Scorm12API(settings);

// SCORM 2004
window.API_1484_11 = new Scorm2004API(settings);
```

**Module usage with ES imports:**

```javascript
import {Scorm2004API} from 'scorm-again/scorm2004';

const settings = {
   autocommit: true,
   lmsCommitUrl: 'https://your-lms.com/commit'
};

// Create and attach to window for SCORM content to discover
window.API_1484_11 = new Scorm2004API(settings);

// Listen for events
window.API_1484_11.on('Initialize', () => {
   console.log('SCORM API initialized');
});
```

### A Note About API Discovery

Before creating a ticket about your module not being able to communicate with the LMS, please make
sure you've looked
over my examples in the `gh-pages` branch, as well as reading
the [SCORM API Discovery Algorithms](https://scorm.com/scorm-explained/technical-scorm/run-time/api-discovery-algorithms/)
page. I get that some of this stuff can be hard to implement at first, but I can't give an example
for every possible
way this library can be loaded into your application. The main thing to remember is that it should
always be attached to
the `window` object, because that's where modules are supposed to look.

### Available Settings

The APIs include several settings to customize the functionality of each API:

| Setting                    |             Default              |                                                      Values                                                       | Description                                                                                                                                                                                                                                                                                                                                                                                                                                             |
|----------------------------|:--------------------------------:|:-----------------------------------------------------------------------------------------------------------------:|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `autocommit`               |              false               |                                                    true/false                                                     | Determines whether the API schedules an autocommit to the LMS after setting a value.                                                                                                                                                                                                                                                                                                                                                                    |
| `autocommitSeconds`        |                60                |                                                        int                                                        | Number of seconds to wait before autocommiting. Timer is restarted if another value is set.                                                                                                                                                                                                                                                                                                                                                             |
| `asyncCommit`              |              false               |                                                    true/false                                                     | Determines whether the API should send the request to the `lmsCommitUrl` asynchronously.                                                                                                                                                                                                                                                                                                                                                                |
| `sendFullCommit`           |               true               |                                                    true/false                                                     | Determines whether the API sends the full CMI object as part of the commit, or of it only sends the fields that actually contains values.                                                                                                                                                                                                                                                                                                               |
| `lmsCommitUrl`             |              false               |                                                        url                                                        | The URL endpoint of the LMS where data should be sent upon commit. If no value is provided, modules will run as usual, but all method calls will be logged to the console.                                                                                                                                                                                                                                                                              |
| `dataCommitFormat`         |              `json`              |                                           `json`, `flattened`, `params`                                           | `json` will send a JSON object to the lmsCommitUrl in the format of <br>`{'cmi': {'core': {...}}`<br><br> `flattened` will send the data in the format <br>`{'cmi.core.exit': 'suspend', 'cmi.core.mode': 'normal'...}`<br><br> `params` will send the data as <br>`?cmi.core.exit=suspend&cmi.core.mode=normal...`                                                                                                                                     |
| `commitRequestDataType`    | 'application/json;charset=UTF-8' |                                                      string                                                       | This setting is provided in case your LMS expects a different content type or character set.                                                                                                                                                                                                                                                                                                                                                            |
| `renderCommonCommitFields` |              false               |                                                    true/false                                                     | Determines whether the API should render the common fields in the commit object. Common fields are `successStatus`, `completionStatus`, `totalTimeSeconds`, `score`, and `runtimeData`. The `runtimeData` field contains the render CMI object. This allows for easier processing on the LMS.                                                                                                                                                           |
| `autoProgress`             |              false               |                                                    true/false                                                     | In case Sequencing is being used, you can tell the API to automatically throw the `SequenceNext` event.                                                                                                                                                                                                                                                                                                                                                 |
| `logLevel`                 |                4                 | number \| string \| LogLevelEnum<br><br>`1` => DEBUG<br>`2` => INFO<br>`3` => WARN<br>`4` => ERROR<br>`5` => NONE | By default, the APIs only log error messages.                                                                                                                                                                                                                                                                                                                                                                                                           |
| `mastery_override`         |              false               |                                                    true/false                                                     | (SCORM 1.2) Used to override a module's `cmi.core.lesson_status` so that a pass/fail is determined based on a mastery score and the user's raw score, rather than using whatever status is provided by the module. An example of this would be if a module is published using a `Complete/Incomplete` final status, but the LMS always wants to receive a `Passed/Failed` for quizzes, then we can use this setting to override the given final status. |
| `selfReportSessionTime`    |              false               |                                                    true/false                                                     | Should the API override the default `session_time` reported by the module? Useful when modules don't properly report time.                                                                                                                                                                                                                                                                                                                              |
| `alwaysSendTotalTime`      |              false               |                                                    true/false                                                     | Should the API always send `total_time` when committing to the LMS                                                                                                                                                                                                                                                                                                                                                                                      |
| `fetchMode`                |              'cors'              |                                   'cors', 'no-cors', 'same-origin', 'navigate'                                    | The fetch mode to use when sending requests to the LMS.                                                                                                                                                                                                                                                                                                                                                                                                 |
| `useBeaconInsteadOfFetch`  |             'never'              |                                         'always', 'on-terminate', 'never'                                         | Controls when to use the Beacon API instead of fetch for HTTP requests. 'always' uses Beacon for all requests, 'on-terminate' uses Beacon only for final commit during page unload, 'never' always uses fetch.                                                                                                                                                                                                                                          |
| `xhrWithCredentials`       |              false               |                                                    true/false                                                     | Sets the withCredentials flag on the request to the LMS                                                                                                                                                                                                                                                                                                                                                                                                 |
| `xhrHeaders`               |                {}                |                                                      Object                                                       | This allows setting of additional headers on the request to the LMS where the key should be the header name and the value is the value of the header you want to send                                                                                                                                                                                                                                                                                   |
| `responseHandler`          |             function             |                                                                                                                   | A function to properly transform the response from the LMS to the correct format. The APIs expect the result from the LMS to be in the following format (errorCode is optional): `{ "result": true, "errorCode": 0 }`                                                                                                                                                                                                                                   |
| `requestHandler`           |             function             |                                                                                                                   | A function to transform the commit object before sending it to `lmsCommitUrl`. By default it's the identity function (no transformation).                                                                                                                                                                                                                                                                                                               |
| `onLogMessage`             |             function             |                                                                                                                   | A function to be called whenever a message is logged. Defaults to console.{error,warn,info,debug,log}                                                                                                                                                                                                                                                                                                                                                   |
| `scoItemIds`               |                []                |                                                     string[]                                                      | A list of valid SCO IDs to be used for choice/jump sequence validation. If a `sequencing` configuration is provided with an activity tree, this list will be automatically populated with all activity IDs from the tree.                                                                                                                                                                                                                               |
| `scoItemIdValidator`       |              false               |                                                 false / function                                                  | A function to be called during choice/jump sequence checks to determine if a SCO ID is valid. Could be used to call an API to check validity.                                                                                                                                                                                                                                                                                                           |
| `globalObjectiveIds`       |                []                |                                                     string[]                                                      | (SCORM 2004) A list of objective IDs that are considered "global" and should be shared across SCOs.                                                                                                                                                                                                                                                                                                                                                     |
| `sequencing`               |               null               |                                                SequencingSettings                                                 | (SCORM 2004) Configuration for SCORM 2004 sequencing, including activity tree, sequencing rules, sequencing controls, and rollup rules. See the [Sequencing Configuration documentation](docs/sequencing_configuration.md) for details.                                                                                                                                                                                                                 |

## Settings Function Examples

### responseHandler

The responseHandler function is used to transform the response from the LMS to the correct format.
The APIs expect the
result from the LMS to be in the following format (errorCode is optional):
`{ "result": true, "errorCode": 0 }`

```javascript
var settings = {
   responseHandler: async function (response: Response): Promise<ResultObject> {
      const responseObj = await response.json();
      return {
         result: responseObj.success,
         errorCode: responseObj.error
      };
   }
};
```

### requestHandler

The requestHandler function is used to transform the commit object before sending it to
`lmsCommitUrl`. By default, it's
the identity function (no transformation).

```javascript
var settings = {
   requestHandler: function (commitObject: CommitObject): CommitObject {
      commitObject.cmi.core.lesson_status = 'completed';
      return commitObject;
   }
};
```

### onLogMessage

The onLogMessage function is used to log messages. By default, it logs messages to the console.

```javascript
var settings = {
   onLogMessage: function (messageLevel: LogLevel, logMessage: string): void {
      console.log(`[${messageLevel}] ${logMessage}`);
   }
};
```

## Initial Values

If you want to initially load data from your backend API, you must do it before launching your
SCORM/AICC player. After
the player has initialized, you will not be able to change any read-only values.

You can initialize your variables on the CMI object individually:

```javascript
window.API_1484_11.cmi.learner_id = "123";
```

You can also initialize the CMI object in bulk by supplying a JSON object. Note that it can be a
partial CMI JSON
object:

```javascript
window.API_1484_11.loadFromJSON(json);
```

<details>
  <summary>Example JSON input</summary>

```javascript
var json = {
   learner_id: "123",
   learner_name: "Bob The Builder",
   suspend_data:
       "viewed=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31|lastviewedslide=31|7#1##,3,3,3,7,3,3,7,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,11#0#b5e89fbb-7cfb-46f0-a7cb-758165d3fe7e=236~262~2542812732762722742772682802752822882852892872832862962931000~3579~32590001001010101010101010101001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001010010010010010010010010011010010010010010010010010010010010112101021000171000~236a71d398e-4023-4967-88fe-1af18721422d06passed6failed000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000105wrong110000000000000000000000000000000000~3185000000000000000000000000000000000000000000000000000000000000000000000000000000000~283~2191w11~21113101w41689~256~2100723031840~21007230314509062302670~2110723031061120000000000000000000~240~234531618~21601011000100000002814169400,#-1",
   interactions: {
      0: {
         id: "Question14_1",
         type: "choice",
         timestamp: "2018-08-26T11:05:21",
         weighting: "1",
         learner_response: "HTH",
         result: "wrong",
         latency: "PT2M30S",
         objectives: {
            0: {
               id: "Question14_1",
            },
         },
         correct_responses: {
            0: {
               pattern: "CPR",
            },
         },
      },
   },
};
```

</details>

Another option for initializing the CMI object in bulk is by supplying a "flattened" JSON object.
Note that it can be a
partial CMI JSON object:

```javascript
window.API_1484_11.loadFromFlattenedJSON(json);
```

<details>
  <summary>Example flattened JSON input</summary>

```javascript
var json = {
   "cmi.learner_id": "123",
   "cmi.learner_name": "Bob The Builder",
   "cmi.suspend_data": "viewed=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31|lastviewedslide=31|7#1##,3,3,3,7,3,3,7,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,11#0#b5e89fbb-7cfb-46f0-a7cb-758165d3fe7e=236~262~2542812732762722742772682802752822882852892872832862962931000~3579~32590001001010101010101010101001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001001010010010010010010010010011010010010010010010010010010010010112101021000171000~236a71d398e-4023-4967-88fe-1af18721422d06passed6failed000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000105wrong110000000000000000000000000000000000~3185000000000000000000000000000000000000000000000000000000000000000000000000000000000~283~2191w11~21113101w41689~256~2100723031840~21007230314509062302670~2110723031061120000000000000000000~240~234531618~21601011000100000002814169400,#-1",
   "cmi.interactions.0.id": "Question14_1",
   "cmi.interactions.0.type": "choice",
   "cmi.interactions.0.timestamp": "2018-08-26T11:05:21",
   "cmi.interactions.0.weighting": "1",
   "cmi.interactions.0.learner_response": "HTH",
   "cmi.interactions.0.result": "wrong",
   "cmi.interactions.0.latency": "PT2M30S",
   "cmi.interactions.0.objectives.0.id": "Question14_1",
   "cmi.interactions.0.objectives.0.correct_responses.0.pattern": "CPR"
};
```

</details>

### Accessing CMI Data

The CMI data stored by the API can be accessed directly through the `API.cmi` object or
`API_1484_11.cmi` object. For
example, to get the Student Name in SCORM 1.2, you would do the following:

```javascript
var studentName = window.API.cmi.core.student_name;
```

### SCORM 1.2 and AICC Listeners

For convenience, hooks are available for all the SCORM 1.2/AICC API Signature functions:
`LMSInitialize`,
`LMSFinish`,
`LMSGetValue`,
`LMSSetValue`,
`LMSCommit`,
`LMSGetLastError`,
`LMSGetErrorString`,
`LMSGetDiagnostic`,
`SequenceNext`,
`SequencePrevious`

You can add your hook into these by adding a listener to the `window.API` object:

```javascript
window.API.on("LMSInitialize", function () {
   // callback function body
});
```

You can also listen for events on specific SCORM CMI elements:

```javascript
window.API.on("LMSSetValue.cmi.core.student_id", function (CMIElement, value) {
   // callback function body
});
```

Finally, you can listen for events using a wildcard:

```javascript
window.API.on("LMSSetValue.cmi.*", function (CMIElement, value) {
   // callback function body
});
```

You also have to ability to remove specific callback listeners:

```javascript
window.API.off("LMSInitialize", callback);
```

Or, you can clear all callbacks for a particular event:

```javascript
window.API.clear("LMSInitialize");
```

### SCORM 2004 Listeners

For convenience, hooks are available for all the SCORM API Signature functions:
`Initialize`,
`Terminate`,
`GetValue`,
`SetValue`,
`Commit`,
`GetLastError`,
`GetErrorString`,
`GetDiagnostic`,
`SequenceNext`,
`SequencePrevious`,
`SequenceChoice`,
`SequenceExit`,
`SequenceExitAll`,
`SequenceAbandon`,
`SequenceAbandonAll`

You can add your hook into these by adding a listener to the `window.API_1484_11` object:

```javascript
window.API_1484_11.on("Initialize", function () {
   // callback function body
});
```

You can also listen for events on specific SCORM CMI elements:

```javascript
window.API_1484_11.on("SetValue.cmi.learner_id ", function (CMIElement, value) {
   // callback function body
});
```

Finally, you can listen for events using a wildcard:

```javascript
window.API_1484_11.on("SetValue.cmi.* ", function (CMIElement, value) {
   // callback function body
});
```

You also have to ability to remove specific callback listeners:

```javascript
window.API_1484_11.off("Initialize", callback);
```

Or, you can clear all callbacks for a particular event:

```javascript
window.API_1484_11.clear("Initialize");
```

### Total Time Calculation

The APIs provide a convenience method `getCurrentTotalTime()` that can be used for calculating the
current `total_time`
value, based on the current `session_time` and the `total_time` supplied when the module was
launched. This works for
both ISO 8601 duration time formats in SCORM 2004 as well as the HH:MM:SS format in SCORM 1.2 and
AICC, and outputs the
correct format based on the version used.

### Completion Status

The APIs will calculate the proper completion status to send back to an LMS. This status is usually
based on completion
threshold, progress measure, and lesson mode, but please see the `mastery_override` setting for how
statuses can be
changed based on scores, as well.

### Sequencing

SCORM 2004 sequencing allows you to control the flow of content in a SCORM package. It defines how
learners navigate between activities, how activities are ordered, and how the status of activities
is determined based on the status of their children.

The scorm-again library provides a comprehensive implementation of SCORM 2004 sequencing, which can
be configured through the API settings. To configure sequencing, you need to provide a `sequencing`
object in the settings when creating a SCORM 2004 API instance:

```javascript
import {Scorm2004API} from "scorm-again";

const api = new Scorm2004API({
   // Other settings...
   sequencing: {
      // Sequencing configuration...
   },
});
```

The `sequencing` object can contain the following properties:

- `activityTree`: Configures the activity tree, which defines the hierarchy of activities in the
  SCORM package.
- `sequencingRules`: Configures the sequencing rules, which define how navigation between activities
  is controlled.
- `sequencingControls`: Configures the sequencing controls, which define general behavior for
  sequencing.
- `rollupRules`: Configures the rollup rules, which define how the status of parent activities is
  determined based on the status of their children.

Here's a basic example of configuring an activity tree:

```javascript
sequencing = {
   activityTree: {
      id: 'root',
      title: 'Course',
      children: [
         {
            id: 'module1',
            title: 'Module 1',
            children: [
               {
                  id: 'lesson1',
                  title: 'Lesson 1'
               },
               {
                  id: 'lesson2',
                  title: 'Lesson 2'
               }
            ]
         }
      ]
   }
}
```

For more detailed information and examples, see
the [Sequencing Configuration documentation](docs/sequencing_configuration.md).

## Project Architecture

scorm-again is designed with a modular architecture that separates concerns and promotes
maintainability:

- **Core APIs**: Separate implementations for AICC, SCORM 1.2, and SCORM 2004
- **Service Layer**: Modular services for HTTP communication, validation, logging, and data
  serialization
- **CMI Data Models**: Structured data models for each SCORM/AICC version
- **Event System**: Comprehensive event listeners for tracking API interactions

The project follows object-oriented principles with TypeScript, emphasizing type safety and clear
interfaces between components.

### Bundle Size Optimization

scorm-again is optimized for minimal bundle size while maintaining compatibility with both legacy
and modern browsers:

- **Code Splitting**: Common code is extracted into shared chunks to reduce duplication
- **Tree Shaking**: Unused code is eliminated from the final bundles
- **Minification**: All production builds are minified to reduce size
- **ES Module Support**: ES modules enable better tree shaking by modern bundlers
- **Separate Entry Points**: Import only what you need with granular entry points

These optimizations result in significantly smaller bundle sizes, especially when importing only the
specific standard you need.

## Compatibility

scorm-again is compatible with:

- **Browsers**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **IE11**: Requires a fetch polyfill
- **Node.js**: For server-side processing or testing
- **LMS Systems**: Compatible with any LMS that supports AICC, SCORM 1.2, or SCORM 2004

## Security Considerations

When implementing scorm-again, consider these security best practices:

- Always validate data coming from external sources before passing it to the API
- Be cautious with the content of `suspend_data` as it may contain sensitive information
- Use HTTPS for all LMS communications to prevent data interception
- Review the `xhrHeaders` and `responseHandler` settings for potential security implications

## Performance Considerations

For optimal performance:

- Use the specific API version you need (aicc.js, scorm12.js, or scorm2004.js) instead of the full
  library
- Use the minified versions of the bundles (*.min.js) for production environments
- Import only the specific standard you need to reduce bundle size:
  ```javascript
  // Instead of importing the full library
  import { Scorm12API } from 'scorm-again';

  // Import only the specific standard you need
  import { Scorm12API } from 'scorm-again/scorm12';

  // Or use the minified version for even smaller bundle size
  import { Scorm12API } from 'scorm-again/scorm12/min';
  ```
- Consider setting `autocommit` to `true` with a reasonable `autocommitSeconds` value to balance
  network traffic
- Large datasets should be compressed before storing in `suspend_data`
- For mobile devices, optimize network usage by carefully managing commit frequency

## Community and Support

- **GitHub Issues**: For bug reports and feature requests
- **Pull Requests**: Contributions are welcome following
  the [contribution guidelines](docs/developer/contribution_guidelines.md)
- **Discussions**: Use GitHub Discussions for questions and community support

## Version History

For a complete list of changes, see
the [releases page](https://github.com/jcputney/scorm-again/releases) on GitHub.

## Roadmap

Future plans for scorm-again include:

- Improved test coverage
- Potential support for TinCan/xAPI/CMI5
- Performance optimizations
- Enhanced documentation and examples

## Credits and Thanks!

This project was heavily influenced by
the [simplify-scorm](https://github.com/gabrieldoty/simplify-scorm) project by
@gabrieldoty, but ended up being pretty much a ground-up rewrite. The big influence from this
project was the inclusion
of event listeners.

I also drew from the [Moodle SCORM module](https://github.com/moodle/moodle/tree/master/mod/scorm),
but avoided directly
copying their code because it is...not very clean.

## Contributing

I welcome any and all feedback and contributions to this project! The project has comprehensive
documentation for contributors:

- [Development Workflow](docs/developer/development_workflow.md): Setting up your environment and
  development process
- [Contribution Guidelines](docs/developer/contribution_guidelines.md): Standards and expectations
  for contributions
- [Testing Strategy](docs/developer/testing_strategy.md): How to write and run tests
- [CONTRIBUTING.md](CONTRIBUTING.md): Quick start guide for contributors

### Setup and Development

You will need `node` installed on your local machine, and you'll have to run `npm install` in the
repo directory before
starting development.

To run a build, you need to just run the `npm run build:all` command in the root of the project.

Similarly, to run the tests, you just run the `npm test` command.

Before submitting pull requests, please also run `eslint ./src --fix` against your code first,
otherwise your pull
request build could fail.

## License

scorm-again is released under the MIT License. See the [LICENSE](LICENSE) file for details.
