## Course host page

Open a small host page from the course origin, and load the course in an iframe inside it. `courseUrl` in the native code above is the URL of this host page. Many course wrappers declare their own global `API` variable, which would replace the scorm-again API if the course ran in the same window. SCORM content searches its parent windows for the API, so the course finds the one in the host page.

```html
<!doctype html>
<html>
  <body>
    <iframe src="course/shared/launchpage.html" title="Course"></iframe>
  </body>
</html>
```

The host page needs no script tags. The document-start script adds the bundle, configuration and bridge before the iframe loads. Run that script in the top window only, so the iframe does not create a second API. Keep the host page and the course on the same origin.
