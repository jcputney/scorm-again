---
sidebar_position: 1
title: React Native
description: Implement offline SCORM support in React Native applications using WebView
---

# React Native mobile integration

This guide shows how to run SCORM content with scorm-again in a React Native WebView, with offline support. The bridge script and its configuration are the same on every platform. Only the native setup differs.

<!--@include: ./_partials/bridge-setup.md-->

## Native setup

Use `react-native-webview` and its `injectedJavaScriptBeforeContentLoaded` prop, which runs a script in the top window before the page's own scripts. Read the bundle, the configuration and the bridge into strings before you render the player. The bridge sends messages through `window.ReactNativeWebView`, which `onMessage` receives.

```jsx
function ScormPlayer({ bundleText, configText, bridgeText, courseUrl, webViewRef }) {
  return (
    <WebView
      ref={webViewRef}
      source={{ uri: courseUrl }}
      javaScriptEnabled
      domStorageEnabled
      injectedJavaScriptBeforeContentLoaded={
        bundleText + "\n" + configText + "\n" + bridgeText + "\ntrue;"
      }
      onMessage={(event) => {
        const message = JSON.parse(event.nativeEvent.data);
        console.log(message);
      }}
    />
  );
}
```

`WebView` comes from `react-native-webview`. In your NetInfo listener, call `webViewRef.current.injectJavaScript(script + "\ntrue;")` with the connectivity script above, and unsubscribe when the component unmounts.

The [`examples/react-native-offline`](https://github.com/jcputney/scorm-again/tree/master/examples/react-native-offline) app in the repository uses this setup. It serves courses from a local HTTP server, includes a small test course, and commits to the mock LMS from the integration tests.

<!--@include: ./_partials/host-page.md-->

<!--@include: ./_partials/troubleshooting.md-->

### React Native notes

- On Android, `injectedJavaScriptBeforeContentLoaded` can run after the page's first scripts on some WebView versions. If the course cannot find the API on Android, use a [local launcher](./flutter#local-launcher) instead.
- `react-native-webview` shows `alert()` and `confirm()` dialogs on iOS and Android without extra code.
