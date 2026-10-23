---
sidebar_position: 4
title: Android Native
description: Implement offline SCORM support in native Android apps using Kotlin and WebView
---

# Android Native mobile integration

This guide shows how to run SCORM content with scorm-again in a Android WebView, with offline support. The bridge script and its configuration are the same on every platform. Only the native setup differs.

<!--@include: ./_partials/bridge-setup.md-->

## Native setup

Use `WebViewCompat.addDocumentStartJavaScript` from AndroidX WebKit. It runs a script before the page's own scripts. Check `WebViewFeature.DOCUMENT_START_SCRIPT` first, because older WebView versions do not support it. Do not inject from `onPageFinished`: by then the course has already looked for the API. The bridge sends messages to the `AndroidBridge` object.

```kotlin
class ScormChannel {
    @android.webkit.JavascriptInterface
    fun postMessage(json: String) {
        val message = org.json.JSONObject(json)
        android.util.Log.d("SCORM", message.toString())
    }
}

webView.settings.javaScriptEnabled = true
webView.settings.domStorageEnabled = true
webView.addJavascriptInterface(ScormChannel(), "AndroidBridge")
if (WebViewFeature.isFeatureSupported(WebViewFeature.DOCUMENT_START_SCRIPT)) {
    WebViewCompat.addDocumentStartJavaScript(
        webView,
        "if (window === window.top) {\n" +
            bundleText + "\n" + configText + "\n" + bridgeText + "\n}",
        setOf("https://courses.example.com")
    )
    webView.loadUrl(courseUrl)
} else {
    webView.loadUrl(localLauncherUrl)
}
```

The `window === window.top` check keeps the script out of the course iframe. `WebViewCompat` and `WebViewFeature` come from `androidx.webkit`. Read the bundle, the configuration and the bridge into strings before this code runs.

Register a `ConnectivityManager.NetworkCallback`, and from it call `webView.post { webView.evaluateJavascript(script, null) }` with the connectivity script. Only expose the `AndroidBridge` object to course content you trust, and remove it when you close the player.

<!--@include: ./_partials/host-page.md-->

<!--@include: ./_partials/troubleshooting.md-->

### Android notes

- If the device's WebView does not support `WebViewFeature.DOCUMENT_START_SCRIPT`, the code above opens a [local launcher](./flutter#local-launcher) instead.
- The allowed origin passed to `addDocumentStartJavaScript` must match the host page origin exactly, including the scheme and port.
- Keep `domStorageEnabled` set to `true`. Without it, localStorage is not available and nothing can be queued.
- To show `alert()` and `confirm()`, set a `WebChromeClient` on the web view, for example `webView.webChromeClient = WebChromeClient()`.
