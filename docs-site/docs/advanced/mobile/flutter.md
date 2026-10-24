---
sidebar_position: 2
title: Flutter
description: Implement offline SCORM support in Flutter applications using WebView
---

# Flutter mobile integration

This guide shows how to run SCORM content with scorm-again in a Flutter WebView, with offline support. The bridge script and its configuration are the same on every platform. Only the native setup differs.

<!--@include: ./_partials/bridge-setup.md-->

## Native setup

Use `webview_flutter` with a JavaScript channel named `ScormBridge`. Its controller cannot register a script to run at document start, so open the local launcher described below.

```dart
final controller = WebViewController()
  ..setJavaScriptMode(JavaScriptMode.unrestricted)
  ..addJavaScriptChannel(
    'ScormBridge',
    onMessageReceived: (JavaScriptMessage message) {
      final payload = jsonDecode(message.message);
      debugPrint('$payload');
    },
  );
await controller.loadRequest(Uri.parse(localLauncherUrl));
// In your widget:
// WebViewWidget(controller: controller)
```

This needs `dart:convert` and `package:webview_flutter/webview_flutter.dart`. In your connectivity listener, call `controller.runJavaScript(script)` with the connectivity script, and cancel the subscription when you close the player.

<!--@include: ./_partials/local-launcher.md-->

<!--@include: ./_partials/troubleshooting.md-->

### Flutter notes

- Keep `JavaScriptMode.unrestricted`. Without it, no script runs.
- To show `alert()` and `confirm()`, register handlers with `setOnJavaScriptAlertDialog` and `setOnJavaScriptConfirmDialog` on the `WebViewController`.
