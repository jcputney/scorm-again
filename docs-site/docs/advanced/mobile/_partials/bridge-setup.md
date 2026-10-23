## Shared bridge

All the mobile guides use the same bridge script. It runs inside the WebView before the course, creates the scorm-again API, and sends logs and events to your native code.

1. Copy `dist/scorm-again.min.js` from the scorm-again package into your app. This full bundle defines both `window.Scorm12API` and `window.Scorm2004API`.
2. Copy the bridge script below into your app as `mobile-bridge.js`.
3. Write a configuration script, `config.js`, for each launch.
4. Run the three scripts in that order, before any course script: the bundle, the configuration, then the bridge.

The bridge puts the API on `window.API` for SCORM 1.2, or on `window.API_1484_11` for SCORM 2004. Do not call `Initialize` from native code. The course calls it.

<<< @/examples/mobile-bridge.js

This is an example `config.js`. Use the commit URL, course ID and learner data from your LMS. Build the file with a JSON serializer rather than by pasting strings into JavaScript.

```javascript
window.scormBridgeConfig = {
  version: "2004",
  settings: {
    lmsCommitUrl: "https://lms.example.com/scorm/commit",
    enableOfflineSupport: true,
    courseId: "course-123",
    logLevel: 3, // 1 DEBUG, 2 INFO, 3 WARN, 4 ERROR (the default), 5 NONE
  },
  cmi: { learner_id: "learner-123" },
};
```

For SCORM 1.2, set `version` to `"1.2"` and use `cmi: { core: { student_id: "learner-123" } }`. The `cmi` object is optional. The bridge passes it to `loadFromJSON` before the course starts.

Offline support needs:

- localStorage turned on in the WebView, and the same page origin on every launch, because the queue of unsent commits lives in localStorage
- the same `courseId` and learner id on every launch. Unsent commits are kept per course and learner, and `Initialize` restores them.
- a commit endpoint that answers with a 2xx status. If the body is JSON with a `result` field, such as `{"result":"true","errorCode":0}`, that field decides whether the commit succeeded.
- CORS and authentication on the commit endpoint that accept requests from the page origin
- the course files stored on the device, if the course must open without a connection

## Messages and connectivity

The bridge sends each message to native code as a JSON string. Parse it in your message handler.

| Message        | Example                                                                     |
| -------------- | --------------------------------------------------------------------------- |
| Log line       | `{"type":"log","level":3,"message":"..."}`                                  |
| API call       | `{"type":"event","name":"Commit"}`                                          |
| Commit failure | `{"type":"event","name":"CommitError","errorCode":101,"context":{...}}`     |
| Offline sync   | `{"type":"event","name":"OfflineDataSynced"}`                               |

The API call names are `Initialize`, `Commit` and `Terminate` for SCORM 2004, and `LMSInitialize`, `LMSCommit` and `LMSFinish` for SCORM 1.2. A `Commit` message only means the course called Commit. It does not mean the LMS stored the data.

Each offline sync sends `OfflineDataSyncing` when it starts, then `OfflineDataSynced` or `OfflineDataSyncFailed`.

The bridge has no network code of its own. When the device goes online or offline, run this script in the window that holds the API, with the current value of `online`:

```javascript
window.dispatchEvent(new CustomEvent("scorm-again:network-status", { detail: { online: false } }));
```

Send the current status again when the `Initialize` message arrives, so a device that starts offline is handled. When `online` becomes `true`, scorm-again replays the queued commits by itself. Do not call its internal storage or sync methods.
