# Quick Start Templates for Offline SCORM

This document provides minimal, working examples to get you started quickly with offline SCORM support in various platforms.

## React Native - Minimal Example

```jsx
// App.js - Minimal React Native SCORM Player
import React, { useEffect, useRef } from 'react';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

const MinimalScormPlayer = () => {
  const webViewRef = useRef(null);

  useEffect(() => {
    // Listen for network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      if (webViewRef.current) {
        webViewRef.current.injectJavaScript(`
          if (window.API && window.API._offlineStorageService) {
            window.API._offlineStorageService.isDeviceOnline = function() {
              return ${state.isConnected};
            };
          }
        `);
      }
    });

    return () => unsubscribe();
  }, []);

  const onLoadEnd = () => {
    // Inject SCORM API
    webViewRef.current.injectJavaScript(`
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/scorm-again@latest/dist/scorm-again.js';
      script.onload = function() {
        window.API = new window.ScormAgain.Scorm2004API({
          enableOfflineSupport: true,
          courseId: 'demo-course',
          autocommit: true
        });
      };
      document.head.appendChild(script);
    `);
  };

  return (
    <WebView
      ref={webViewRef}
      source={{ uri: 'https://your-scorm-content.com' }}
      onLoadEnd={onLoadEnd}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    />
  );
};

export default MinimalScormPlayer;
```

## Flutter - Minimal Example

```dart
// main.dart - Minimal Flutter SCORM Player
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:connectivity_plus/connectivity_plus.dart';

class MinimalScormPlayer extends StatefulWidget {
  @override
  _MinimalScormPlayerState createState() => _MinimalScormPlayerState();
}

class _MinimalScormPlayerState extends State<MinimalScormPlayer> {
  late WebViewController _controller;
  bool _isOnline = true;

  @override
  void initState() {
    super.initState();

    // Monitor connectivity
    Connectivity().onConnectivityChanged.listen((result) {
      setState(() {
        _isOnline = result != ConnectivityResult.none;
      });
      _updateOnlineStatus();
    });

    // Setup WebView
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setNavigationDelegate(NavigationDelegate(
        onPageFinished: (url) => _injectScormAPI(),
      ))
      ..loadRequest(Uri.parse('https://your-scorm-content.com'));
  }

  void _injectScormAPI() {
    _controller.runJavaScript('''
      var script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/scorm-again@latest/dist/scorm-again.js';
      script.onload = function() {
        window.API = new window.ScormAgain.Scorm2004API({
          enableOfflineSupport: true,
          courseId: 'demo-course',
          autocommit: true
        });
      };
      document.head.appendChild(script);
    ''');
  }

  void _updateOnlineStatus() {
    _controller.runJavaScript('''
      if (window.API && window.API._offlineStorageService) {
        window.API._offlineStorageService.isDeviceOnline = function() {
          return $_isOnline;
        };
      }
    ''');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SCORM Player'),
        backgroundColor: _isOnline ? Colors.green : Colors.red,
      ),
      body: WebViewWidget(controller: _controller),
    );
  }
}
```

## iOS Swift - Minimal Example

```swift
// MinimalScormViewController.swift
import UIKit
import WebKit

class MinimalScormViewController: UIViewController, WKNavigationDelegate {
    private var webView: WKWebView!
    private var isOnline = true

    override func viewDidLoad() {
        super.viewDidLoad()
        setupWebView()
        loadScormContent()
        monitorConnectivity()
    }

    private func setupWebView() {
        let config = WKWebViewConfiguration()
        config.preferences.javaScriptEnabled = true

        webView = WKWebView(frame: view.bounds, configuration: config)
        webView.navigationDelegate = self
        view.addSubview(webView)
    }

    private func loadScormContent() {
        let url = URL(string: "https://your-scorm-content.com")!
        webView.load(URLRequest(url: url))
    }

    private func monitorConnectivity() {
        // Simplified - use Reachability in production
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(networkChanged),
            name: .connectivityChanged,
            object: nil
        )
    }

    @objc private func networkChanged() {
        updateOnlineStatus()
    }

    private func updateOnlineStatus() {
        let script = """
            if (window.API && window.API._offlineStorageService) {
                window.API._offlineStorageService.isDeviceOnline = function() {
                    return \(isOnline);
                };
            }
        """
        webView.evaluateJavaScript(script)
    }

    // MARK: - WKNavigationDelegate
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        let script = """
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/scorm-again@latest/dist/scorm-again.js';
            script.onload = function() {
                window.API = new window.ScormAgain.Scorm2004API({
                    enableOfflineSupport: true,
                    courseId: 'demo-course',
                    autocommit: true
                });
            };
            document.head.appendChild(script);
        """
        webView.evaluateJavaScript(script)
    }
}
```

## Android Kotlin - Minimal Example

```kotlin
// MinimalScormActivity.kt
class MinimalScormActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private var isOnline = true

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scorm)

        setupWebView()
        loadScormContent()
        monitorConnectivity()
    }

    private fun setupWebView() {
        webView = findViewById(R.id.webview)
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
        }

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                injectScormAPI()
            }
        }
    }

    private fun loadScormContent() {
        webView.loadUrl("https://your-scorm-content.com")
    }

    private fun injectScormAPI() {
        val script = """
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/scorm-again@latest/dist/scorm-again.js';
            script.onload = function() {
                window.API = new window.ScormAgain.Scorm2004API({
                    enableOfflineSupport: true,
                    courseId: 'demo-course',
                    autocommit: true
                });
            };
            document.head.appendChild(script);
        """
        webView.evaluateJavaScript(script, null)
    }

    private fun monitorConnectivity() {
        val connectivityManager = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val networkCallback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                isOnline = true
                updateOnlineStatus()
            }

            override fun onLost(network: Network) {
                isOnline = false
                updateOnlineStatus()
            }
        }

        connectivityManager.registerDefaultNetworkCallback(networkCallback)
    }

    private fun updateOnlineStatus() {
        runOnUiThread {
            val script = """
                if (window.API && window.API._offlineStorageService) {
                    window.API._offlineStorageService.isDeviceOnline = function() {
                        return $isOnline;
                    };
                }
            """
            webView.evaluateJavaScript(script, null)
        }
    }
}
```

## Web/Browser - Minimal Example

```html
<!DOCTYPE html>
<html>
<head>
    <title>Minimal SCORM Player</title>
    <script src="https://cdn.jsdelivr.net/npm/scorm-again@latest/dist/scorm-again.js"></script>
</head>
<body>
    <div id="scorm-content">
        <!-- Your SCORM content goes here -->
        <iframe src="your-scorm-content/index.html" width="100%" height="600px"></iframe>
    </div>

    <script>
        // Initialize SCORM API with offline support
        window.API = new window.ScormAgain.Scorm2004API({
            enableOfflineSupport: true,
            courseId: 'demo-course',
            autocommit: true,
            lmsCommitUrl: 'https://your-lms.com/api/scorm/commit'
        });

        // Monitor online/offline status
        window.addEventListener('online', () => {
            console.log('Back online - syncing data...');
        });

        window.addEventListener('offline', () => {
            console.log('Gone offline - storing data locally...');
        });

        // Listen for sync events
        window.API.on('OfflineDataSynced', () => {
            console.log('Offline data synchronized successfully!');
        });
    </script>
</body>
</html>
```

## Next Steps

1. **Choose your platform** from the examples above
2. **Install dependencies** as shown in the full platform guides
3. **Replace placeholder URLs** with your actual SCORM content
4. **Test offline functionality** by disconnecting from the internet
5. **Refer to the comprehensive guides** for production features

For complete, production-ready implementations, see the detailed platform-specific guides in this directory.