---
sidebar_position: 3
title: iOS Native
description: Implement offline SCORM support in native iOS apps using Swift and WKWebView
---

# iOS Native mobile integration

This guide shows how to run SCORM content with scorm-again in a iOS WebView, with offline support. The bridge script and its configuration are the same on every platform. Only the native setup differs.

<!--@include: ./_partials/bridge-setup.md-->

## Native setup

Add the bundle, the configuration and the bridge as one `WKUserScript` that runs at `.atDocumentStart` in the main frame only. Register the `scormBridge` message handler before you create the web view. In this example, `self` implements `WKScriptMessageHandler`.

```swift
let content = WKUserContentController()
content.add(self, name: "scormBridge")
let source = bundleText + "\n" + configText + "\n" + bridgeText
content.addUserScript(WKUserScript(
    source: source, injectionTime: .atDocumentStart, forMainFrameOnly: true
))
let configuration = WKWebViewConfiguration()
configuration.userContentController = content
let webView = WKWebView(frame: .zero, configuration: configuration)
webView.load(URLRequest(url: courseURL))

func userContentController(_ userContentController: WKUserContentController,
                           didReceive message: WKScriptMessage) {
    guard let json = message.body as? String,
          let data = json.data(using: .utf8) else { return }
    let payload = try? JSONSerialization.jsonObject(with: data)
    print(payload as Any)
}
```

Watch connectivity with `NWPathMonitor`, and pass the connectivity script to `webView.evaluateJavaScript` on the main thread. Remove the script message handler when you close the player, because `WKUserContentController` keeps a strong reference to it.

<!--@include: ./_partials/host-page.md-->

<!--@include: ./_partials/troubleshooting.md-->

### iOS notes

- Use the default website data store, `WKWebsiteDataStore.default()`. A non-persistent data store loses the queue when the app closes.
- To show `alert()`, set a `WKUIDelegate` on the web view and implement `webView(_:runJavaScriptAlertPanelWithMessage:initiatedByFrame:completionHandler:)`. Implement the confirm panel method as well for `confirm()`.
