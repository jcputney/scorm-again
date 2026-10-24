---
sidebar_position: 6
title: Kotlin Multiplatform
description: Implement offline SCORM support in Kotlin Multiplatform apps with shared business logic
---

# Kotlin Multiplatform mobile integration

This guide shows how to run SCORM content with scorm-again in a Kotlin Multiplatform WebView, with offline support. The bridge script and its configuration are the same on every platform. Only the native setup differs.

<!--@include: ./_partials/bridge-setup.md-->

## Native setup

Keep the bundle, configuration and bridge text, and the message parsing, in shared code. Each platform view adds the scripts at document start, before it loads the course.

- On Android, use the code from the [Android guide](./android-native#native-setup). It checks `WebViewFeature.DOCUMENT_START_SCRIPT`, adds the scripts with `WebViewCompat.addDocumentStartJavaScript`, and receives messages on `AndroidBridge`. Send connectivity changes with `WebView.evaluateJavascript` on the UI thread.
- On iOS, use the code from the [iOS guide](./ios-native#native-setup). It adds a `WKUserScript` at `.atDocumentStart` for the main frame only, and receives messages on `scormBridge`. Send connectivity changes with `WKWebView.evaluateJavaScript` on the main thread.

Pass each received JSON string to your shared message handler, and release the connectivity callbacks when you close the player.

<!--@include: ./_partials/host-page.md-->

<!--@include: ./_partials/troubleshooting.md-->

### Kotlin Multiplatform notes

The [Android notes](./android-native#android-notes) and [iOS notes](./ios-native#ios-notes) apply to each platform view.
