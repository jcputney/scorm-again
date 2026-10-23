## Local launcher

Use a launcher page when the WebView has no reliable way to run a script at document start. The launcher loads the bundle, configuration and bridge with ordinary script tags, then loads the course in an iframe. Script tags without `async` or `defer` run before the browser reaches the iframe, so the API is ready when the course looks for it. SCORM content searches its parent windows for the API.

Serve the launcher, the scripts and the course from the app's local HTTP server, on one origin that stays the same between launches. Set up the native message channel before you open the launcher.

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="scorm-again.min.js"></script>
    <script src="config.js"></script>
    <script src="mobile-bridge.js"></script>
  </head>
  <body>
    <iframe src="course/shared/launchpage.html" title="Course"></iframe>
  </body>
</html>
```

Run connectivity updates in the launcher window, because that is where the API is.
