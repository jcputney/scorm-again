---
sidebar_position: 2
title: Flutter
description: Implement offline SCORM support in Flutter applications using WebView
---

# Using scorm-again with Flutter for Offline Learning

This guide demonstrates how to implement SCORM content in a Flutter application with offline support
using scorm-again.

## Prerequisites

- Flutter SDK installed
- Basic knowledge of Flutter development
- Understanding of SCORM packages

## Setup

### 1. Add Dependencies

First, add the necessary dependencies to your `pubspec.yaml` file:

```yaml
dependencies:
   flutter:
      sdk: flutter
   webview_flutter: ^4.4.2
   path_provider: ^2.1.1
   connectivity_plus: ^5.0.1
   shared_preferences: ^2.2.2
   archive: ^3.4.9
   permission_handler: ^10.4.5  # Add for external storage access
   external_path: ^1.0.3  # Add for accessing external storage paths
```

### 2. Project Structure

Create a directory structure for storing SCORM content:

```
/assets
  /scorm-again
    /api
      scorm-again.js (Copy the scorm-again.js here)
  /courses
    /course1
      (Unzipped SCORM content)
```

### 3. Using External Storage (Recommended)

For production applications, it's best to load SCORM content from the device's external storage
rather than app-specific directories. This approach:

- Allows larger courses to be stored without impacting app storage limits
- Enables sharing courses between apps
- Facilitates easier content management

Here's how to implement external storage support:

#### Request Storage Permissions

First, add the necessary permissions to your app:

**Android**: Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Required for API level 28 and below -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <!-- For API 29+ and scoped storage -->
    <application
        android:requestLegacyExternalStorage="true"
        ...
    </application>
</manifest>
```

**iOS**: Add to `ios/Runner/Info.plist`:

```xml
<key>NSDocumentsFolderUsageDescription</key>
<string>Access to documents folder is required to store and load SCORM content</string>
```

#### Implement External Storage Access

Create a service to handle external storage operations:

```dart
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:external_path/external_path.dart';
import 'package:archive/archive.dart';

class ScormStorageService {
   /// Get the base external storage directory for SCORM content
   Future<Directory> getScormExternalDirectory() async {
      String? basePath;

      // Handle platform differences
      if (Platform.isAndroid) {
         // Request storage permission
         await Permission.storage.request();
         if (await Permission.storage.isDenied) {
            throw Exception('Storage permission is required');
         }

         // Get the Downloads directory on Android
         basePath = await ExternalPath.getExternalStoragePublicDirectory(
            ExternalPath.DIRECTORY_DOWNLOADS
         );
      } else if (Platform.isIOS) {
         // On iOS, use Documents directory
         final directory = await getApplicationDocumentsDirectory();
         basePath = directory.path;
      } else {
         throw Exception('Unsupported platform');
      }

      // Create SCORM content directory
      final scormDir = Directory('$basePath/ScormContent');
      if (!await scormDir.exists()) {
         await scormDir.create(recursive: true);
      }

      return scormDir;
   }

   /// Get directory for a specific course
   Future<Directory> getCourseDirectory(String courseId) async {
      final baseDir = await getScormExternalDirectory();
      final courseDir = Directory('${baseDir.path}/$courseId');

      if (!await courseDir.exists()) {
         await courseDir.create(recursive: true);
      }

      return courseDir;
   }

   /// Extract a SCORM package to external storage
   Future<bool> extractScormPackage(File zipFile, String courseId) async {
      try {
         final courseDir = await getCourseDirectory(courseId);

         // Read the zip file
         final bytes = await zipFile.readAsBytes();
         final archive = ZipDecoder().decodeBytes(bytes);

         // Extract all files
         for (final file in archive) {
            final filename = file.name;
            if (file.isFile) {
               final data = file.content as List<int>;
               File('${courseDir.path}/$filename')
                  ..createSync(recursive: true)
                  ..writeAsBytesSync(data);
            } else {
               await Directory('${courseDir.path}/$filename').create(recursive: true);
            }
         }

         return true;
      } catch (e) {
         print('Error extracting SCORM package: $e');
         return false;
      }
   }

   /// List available courses in external storage
   Future<List<String>> listCourses() async {
      try {
         final baseDir = await getScormExternalDirectory();
         final courses = <String>[];

         await for (final entity in baseDir.list()) {
            if (entity is Directory) {
               // Check if it's a valid SCORM course
               final indexFile = File('${entity.path}/index.html');
               if (await indexFile.exists()) {
                  courses.add(entity.path.split('/').last);
               }
            }
         }

         return courses;
      } catch (e) {
         print('Error listing courses: $e');
         return [];
      }
   }

   /// Get the URL for loading a course in a WebView
   String getCourseUrl(Directory courseDir) {
      return 'file://${courseDir.path}/index.html';
   }
}
```

#### Update the SCORM Player to Use External Storage

Modify your SCORM player to load content from external storage:

```dart
class _ScormPlayerScreenState extends State<ScormPlayerScreen> {
   late WebViewController _controller;
   bool _isLoading = true;
   bool _isOnline = true;
   final String _courseId = 'course1';
   final ScormStorageService _storageService = ScormStorageService();

   @override
   void initState() {
      super.initState();
      _checkConnectivity();
      _setupWebView();
   }

   Future<void> _checkConnectivity() async {
      var connectivityResult = await Connectivity().checkConnectivity();
      setState(() {
         _isOnline = connectivityResult != ConnectivityResult.none;
      });

      // Listen for connectivity changes
      Connectivity().onConnectivityChanged.listen((ConnectivityResult result) {
         setState(() {
            _isOnline = result != ConnectivityResult.none;
         });

         if (_isOnline) {
            _syncOfflineData();
         }
      });
   }

   Future<void> _setupWebView() async {
      try {
         // Get the API directory from the app's documents directory
         final apiDir = await _prepareApiFiles();

         // Get the course directory from external storage
         final courseDir = await _storageService.getCourseDirectory(_courseId);

         // Create WebView controller
         _controller = WebViewController()
            ..setJavaScriptMode(JavaScriptMode.unrestricted)
            ..setBackgroundColor(const Color(0x00000000))
            ..setNavigationDelegate(
               NavigationDelegate(
                  onPageFinished: (String url) {
                     setState(() {
                        _isLoading = false;
                     });
                     _injectScormAgain(apiDir);
                  },
               ),
            )
            ..addJavaScriptChannel(
               'ScormBridge',
               onMessageReceived: (JavaScriptMessage message) {
                  _handleScormMessage(message.message);
               },
            );

         // Load the course from external storage
         final courseUrl = _storageService.getCourseUrl(courseDir);
         _controller.loadRequest(Uri.parse(courseUrl));
      } catch (e) {
         print('Error setting up WebView: $e');
         setState(() {
            _isLoading = false;
         });
      }
   }

   Future<String> _prepareApiFiles() async {
      final documentsDir = await getApplicationDocumentsDirectory();
      final apiDir = '${documentsDir.path}/scorm-again/api';
      final apiDirObj = Directory(apiDir);

      if (!await apiDirObj.exists()) {
         await apiDirObj.create(recursive: true);
         await _copyAssetToFile(
            'assets/scorm-again/api/scorm-again.js',
            '$apiDir/scorm-again.js'
         );
      }

      return apiDir;
   }

   Future<void> _copyAssetToFile(String assetPath, String filePath) async {
      final data = await rootBundle.load(assetPath);
      final buffer = data.buffer;
      final file = File(filePath);
      await file.writeAsBytes(
          buffer.asUint8List(data.offsetInBytes, data.lengthInBytes)
      );
   }

   Future<void> _injectScormAgain(String apiDir) async {
      // Inject scorm-again JavaScript API
      await _controller.runJavaScript('''
      var scormAgainScript = document.createElement('script');
      scormAgainScript.src = 'file://$apiDir/scorm-again.js';
      scormAgainScript.onload = function() {
        // Initialize scorm-again with offline support
        window.API = new window.ScormAgain.SCORM2004API({
          enableOfflineSupport: true,
          courseId: '$_courseId',
          autocommit: true,
          autocommitSeconds: 60,
          syncOnInitialize: true,
          syncOnTerminate: true,
          logLevel: 4,
          onLogMessage: function(message, level) {
            window.ScormBridge.postMessage(JSON.stringify({
              type: 'log',
              message: message,
              level: level
            }));
          }
        });

        // Notify when offline data is synced
        window.API.on('OfflineDataSynced', function() {
          window.ScormBridge.postMessage(JSON.stringify({
            type: 'sync',
            status: 'success'
          }));
        });

        // Store connection status in scorm-again
        // TODO: This will be replaced with the new event API pattern in a future update
        window.API._offlineStorageService.isDeviceOnline = function() {
          return ${_isOnline};
        };
      };
      document.head.appendChild(scormAgainScript);
    ''');
   }

   void _handleScormMessage(String message) {
      final data = json.decode(message);

      if (data['type'] == 'log') {
         print('SCORM Log: ${data['message']}');
      } else if (data['type'] == 'sync') {
         ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('SCORM data synchronized successfully')),
         );
      }
   }

   Future<void> _syncOfflineData() async {
      if (_isOnline) {
         await _controller.runJavaScript('''
        if (window.API && window.API._offlineStorageService) {
          window.API._offlineStorageService.syncOfflineData().then(function(success) {
            window.ScormBridge.postMessage(JSON.stringify({
              type: 'sync',
              status: success ? 'success' : 'failed'
            }));
          });
        }
      ''');
      }
   }

   @override
   Widget build(BuildContext context) {
      return Scaffold(
         appBar: AppBar(
            title: const Text('SCORM Course Player'),
            actions: [
               Icon(_isOnline ? Icons.wifi : Icons.wifi_off),
               IconButton(
                  icon: const Icon(Icons.sync),
                  onPressed: _isOnline ? _syncOfflineData : null,
               )
            ],
         ),
         body: Stack(
            children: [
               WebViewWidget(controller: _controller),
               if (_isLoading)
                  const Center(
                     child: CircularProgressIndicator(),
                  ),
            ],
         ),
      );
   }
}
```

## Key Features of This Implementation

### 1. Local HTTP Server (Recommended)

For best compatibility with SCORM packages, serve content through a local HTTP server rather than using `file://` URLs directly. This avoids CORS issues and ensures all JavaScript APIs work correctly.

Use `flutter_inappwebview` with its built-in local server, or the `shelf` package for a custom HTTP server implementation.

### 2. Offline Support

- Detects device connectivity status and updates the scorm-again API accordingly
- Automatically syncs data when the device comes online
- Provides visual feedback on connectivity status

### 3. Local Content Storage

- Copies scorm-again API to local storage
- Extracts SCORM content to local storage
- Loads content from local files rather than remote URLs

### 4. scorm-again Configuration

The scorm-again API is initialized with these key settings:

```json
{
   "enableOfflineSupport": true,
   // Enable offline capabilities
   "courseId": "course1",
   // Unique identifier for the course
   "autocommit": true,
   // Automatically commit data
   "syncOnInitialize": true,
   // Try to sync when the API initializes
   "syncOnTerminate": true
   // Try to sync when the API terminates
}
```

### 5. Communication Bridge

- Uses JavaScript channels to communicate between Flutter and the WebView
- Logs SCORM activity in the Flutter app
- Provides feedback when data is synced

## Additional Considerations

### Security

For security in production apps, consider:

- Validating SCORM packages before loading
- Implementing user authentication
- Encrypting locally stored SCORM data

### Performance

For larger SCORM packages:

- Consider loading SCORM content on demand
- Implement caching strategies
- Optimize WebView performance with appropriate settings

### Testing

Test your implementation with:

- Various connectivity scenarios (online, offline, intermittent)
- Different SCORM package types (SCORM 1.2, SCORM 2004)
- Various device types and screen sizes

## Troubleshooting

### Common Issues

1. **WebView not displaying content**: Ensure file paths are correct and that you have permissions
   to access local storage.

2. **JavaScript not executing**: Verify that JavaScript is enabled in the WebView settings.

3. **SCORM API not connecting**: Check browser console logs for any errors in the scorm-again
   initialization.

4. **Synchronization failures**: Verify your connectivity detection is working correctly and that
   the scorm-again API is properly configured.

### Critical: SCORM API Not Found ("Unable to find an API adapter")

Many SCORM courses use a standard API discovery algorithm that searches `window.parent` for the API. In a WebView, `window.parent === window`, which causes the search to fail. Additionally, many courses declare `var API = null;` at global scope, overwriting any API you've set.

**Solution**: Inject JavaScript early using `onWebViewCreated` to set up APIs and override `window.parent`:

```dart
await _controller.runJavaScript('''
  // Initialize both SCORM APIs
  var apiSettings = { autocommit: true, logLevel: 4 };

  // SCORM 2004
  window.API_1484_11 = new window.Scorm2004API(apiSettings);

  // SCORM 1.2 with getter protection (prevents 'var API = null' overwrite)
  var scorm12Instance = new window.Scorm12API(apiSettings);
  window._scorm12APIInstance = scorm12Instance;
  Object.defineProperty(window, 'API', {
    get: function() { return window._scorm12APIInstance; },
    set: function(val) { /* ignore */ },
    configurable: false
  });

  // Override window.parent for API discovery
  Object.defineProperty(window, 'parent', {
    get: function() {
      return {
        API_1484_11: window.API_1484_11,
        API: window._scorm12APIInstance,
        parent: null
      };
    },
    configurable: true
  });
''');
```

**Important**: Use the full `scorm-again.min.js` bundle (not `scorm2004.min.js`) to support both SCORM 1.2 and SCORM 2004 courses.

This pattern is critical for WebView environments where the standard API discovery algorithm fails.

### Alerts Not Displaying

WebView dialogs may not show. Forward them to native via JavaScript channels:

```dart
// In your JavaScript injection
window.alert = function(msg) {
  window.ScormBridge.postMessage(JSON.stringify({
    type: 'alert', message: String(msg)
  }));
};
```

Handle in your `onMessageReceived` callback to show a Flutter dialog.

## Conclusion

This implementation provides a robust foundation for implementing SCORM content in Flutter
applications with offline support. By leveraging scorm-again's offline capabilities, you can deliver
effective mobile learning experiences regardless of connectivity status.
