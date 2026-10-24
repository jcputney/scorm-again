---
sidebar_position: 5
title: Xamarin/MAUI
description: Implement offline SCORM support in .NET MAUI applications using WebView
---

# Xamarin and .NET MAUI mobile integration

This guide shows how to run SCORM content with scorm-again in a MAUI WebView, with offline support. The bridge script and its configuration are the same on every platform. Only the native setup differs.

<!--@include: ./_partials/bridge-setup.md-->

## Native setup

The MAUI `WebView` cannot register a script to run at document start on every platform, so open the local launcher described below. Set up the message channel in each platform's WebView handler before you set `Source` to the launcher URL.

On Android, turn on JavaScript and DOM storage, and register this receiver with `platformWebView.AddJavascriptInterface(new ScormChannel(), "CSharpBridge")`.

```csharp
public sealed class ScormChannel : Java.Lang.Object
{
    [Android.Webkit.JavascriptInterface]
    [Java.Interop.Export("postMessage")]
    public void PostMessage(string json)
    {
        using var message = System.Text.Json.JsonDocument.Parse(json);
        System.Diagnostics.Debug.WriteLine(message.RootElement.ToString());
    }
}
```

On iOS, register a `csharpBridge` message handler on the configuration's content controller before the handler creates its `WKWebView`. Keep the receiver alive while the view exists, and remove it when you close the view. The bridge sends strings on both platforms.

```csharp
public sealed class ScormMessageHandler : Foundation.NSObject, WebKit.IWKScriptMessageHandler
{
    public void DidReceiveScriptMessage(WebKit.WKUserContentController controller,
                                       WebKit.WKScriptMessage message)
    {
        using var payload = System.Text.Json.JsonDocument.Parse(message.Body.ToString());
        System.Diagnostics.Debug.WriteLine(payload.RootElement.ToString());
    }
}

// In the iOS handler, before constructing WKWebView with this configuration:
configuration.UserContentController.AddScriptMessageHandler(receiver, "csharpBridge");
```

Here `receiver` is a `ScormMessageHandler`. Then open the launcher, and send connectivity changes to it:

```csharp
webView.Source = localLauncherUrl;
// From the native connectivity callback, on the UI thread:
await webView.EvaluateJavaScriptAsync(script);
```

Here `webView` is the MAUI `WebView` and `script` is the connectivity script above. Unsubscribe from connectivity changes when the player closes. In Xamarin.Forms, register the same platform channels in a WebView renderer.

<!--@include: ./_partials/local-launcher.md-->

<!--@include: ./_partials/troubleshooting.md-->

### MAUI notes

- On Android, turn on DOM storage in the platform WebView settings. Without it, localStorage is not available and nothing can be queued.
- The Java method must be exported as lowercase `postMessage`, as in the code above, because that is the name the bridge calls.
- If dialogs do not appear, check that the platform handlers still use a `WebChromeClient` on Android and a `WKUIDelegate` on iOS.
