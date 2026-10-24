## Local launcher

Use a launcher page when the WebView has no reliable way to run a script at document start. The launcher loads the bundle, configuration and bridge with ordinary script tags, then loads the course in an iframe. Script tags without `async` or `defer` run before the browser reaches the iframe, so the API is ready when the course looks for it. SCORM content searches its parent windows for the API.

Serve the launcher, the scripts and the course from a local HTTP server in the app, at a fixed loopback address such as `http://127.0.0.1:8080/launcher.html`. `localLauncherUrl` in the native code above is this URL. Keep the address and port the same between launches. The WebView keeps localStorage per origin, and the origin includes the port, so a launcher on a new port cannot see data queued earlier. Set up the native message channel before you open the launcher.

Both platforms limit plain HTTP, even to the device itself:

- On Android, apps that target API level 28 or higher block cleartext HTTP by default. Allow it for the loopback address only: add `<domain-config cleartextTrafficPermitted="true"><domain>127.0.0.1</domain></domain-config>` to a network security config, and point `android:networkSecurityConfig` in the manifest at it. Android 17 (API level 37) and later allow cleartext to loopback addresses by default.
- On iOS 17 and later, App Transport Security blocks HTTP to IP addresses. Set `NSAllowsLocalNetworking` to `YES` in the app's `NSAppTransportSecurity` settings. It allows local addresses without turning off App Transport Security for other hosts.

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
