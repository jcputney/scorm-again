## Troubleshooting

### The course cannot find the API

- Check that the bundle, configuration and bridge run before the course's first script. A script added after the page has loaded is too late.
- Check that `version` in the configuration matches the course. SCORM 2004 courses look for `window.API_1484_11`, and SCORM 1.2 courses look for `window.API`.
- Check the WebView console. The bridge throws an error if `version` is missing or wrong.
- Use the full `scorm-again.min.js` bundle. The bridge needs the global for the course's SCORM version.

### Commits do not reach the LMS

- Check that `lmsCommitUrl` is set. Without it, scorm-again does not send or queue anything.
- Check that the endpoint accepts requests from the page origin (CORS) and accepts your authentication.
- Watch for `CommitError` messages, and for log lines at level 3 (WARN) or 4 (ERROR).

### Offline commits are lost

- Check that localStorage is turned on and that the page origin is the same on every launch. A new origin starts with an empty queue.
- Check that every launch uses the same `courseId` and learner id. Commits for another course or learner stay queued, but they are not replayed or restored.

### Alerts do not appear

Some courses use `alert()` or `confirm()`, for example to confirm exit. A WebView shows these dialogs only if the app handles them.
