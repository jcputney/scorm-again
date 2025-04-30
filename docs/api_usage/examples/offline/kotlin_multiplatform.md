# Using scorm-again with Kotlin Multiplatform for Offline Learning

This guide demonstrates how to implement SCORM content in a Kotlin Multiplatform Mobile (KMM) application with offline support using scorm-again.

## Prerequisites

- Kotlin Multiplatform Mobile (KMM) setup
- Android Studio with KMM plugin installed
- Xcode (for iOS development)
- Basic knowledge of Kotlin, Swift, and Android development
- Understanding of SCORM packages

## Setup

### 1. Create a KMM Project

First, create a new KMM project in Android Studio:

1. Go to File → New → New Project
2. Select "Kotlin Multiplatform App" template
3. Configure your project settings and click Finish

### 2. Add Dependencies

Add the necessary dependencies to your project:

#### Shared Module (commonMain)

In your `shared/build.gradle.kts` file:

```kotlin
kotlin {
    // ...

    sourceSets {
        commonMain {
            dependencies {
                // Coroutines for async operations
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3")
                
                // Ktor for networking
                implementation("io.ktor:ktor-client-core:2.3.5")
                implementation("io.ktor:ktor-client-content-negotiation:2.3.5")
                implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.5")
                
                // Settings/Preferences storage
                implementation("com.russhwolf:multiplatform-settings:1.1.0")
                
                // KMM file operations
                implementation("io.github.krisbitney:kmm-file:0.2.1")
            }
        }
        androidMain {
            dependencies {
                // Android-specific dependencies
                implementation("io.ktor:ktor-client-android:2.3.5")
                implementation("androidx.webkit:webkit:1.8.0")
            }
        }
        iosMain {
            dependencies {
                // iOS-specific dependencies
                implementation("io.ktor:ktor-client-darwin:2.3.5")
            }
        }
    }
}
```

#### Android App Module

In your `androidApp/build.gradle.kts`:

```kotlin
dependencies {
    // ...
    implementation("androidx.webkit:webkit:1.8.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.6.2")
    // For network connectivity monitoring
    implementation("androidx.core:core-ktx:1.12.0")
}
```

### 3. Project Structure

Create a directory structure for storing SCORM content:

```
/androidApp/src/main/assets
  /scorm-again
    /api
      scorm-again.js
  /courses
    /course1
      (Unzipped SCORM content)

/iosApp/scorm-again
  /api
    scorm-again.js
  /courses
    /course1
      (Unzipped SCORM content)
```

### 4. Loading From External Storage

For production applications, it's recommended to load SCORM modules from external/shared storage rather than bundling them within your app:

#### Android Implementation

For Android, use the shared external storage to store downloaded SCORM packages:

```kotlin
// shared/src/androidMain/kotlin/com/example/scormapp/ExternalStorageManager.kt
package com.example.scormapp

import android.content.Context
import android.os.Environment
import java.io.File

class ExternalStorageManager(private val context: Context) {
    // Base directory for storing SCORM content
    fun getScormBaseDirectory(): File {
        val baseDir = File(
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS),
            "ScormContent"
        )
        if (!baseDir.exists()) {
            baseDir.mkdirs()
        }
        return baseDir
    }
    
    // Directory for a specific course
    fun getCourseDirectory(courseId: String): File {
        val courseDir = File(getScormBaseDirectory(), courseId)
        if (!courseDir.exists()) {
            courseDir.mkdirs()
        }
        return courseDir
    }
    
    // Get the course URL for WebView loading
    fun getCourseUrl(courseId: String): String {
        return "file://${getCourseDirectory(courseId).absolutePath}/index.html"
    }
}
```

Add the necessary permissions to your `AndroidManifest.xml`:

```xml
<manifest ...>
    <!-- For API level 28 and below -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    
    <!-- For API level 29+ -->
    <application
        ...
        android:requestLegacyExternalStorage="true">
        ...
    </application>
</manifest>
```

For Android 10+ (API level 29+), you'll need to handle the scoped storage changes:

```kotlin
// Check and request permissions
private fun checkStoragePermissions() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        // Android 11+: Use MediaStore API or request MANAGE_EXTERNAL_STORAGE
        if (!Environment.isExternalStorageManager()) {
            val intent = Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION)
            val uri = Uri.fromParts("package", context.packageName, null)
            intent.data = uri
            startActivity(intent)
        }
    } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
        // Android 6-10: Request runtime permissions
        if (ContextCompat.checkSelfPermission(
                context,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                context as Activity,
                arrayOf(Manifest.permission.WRITE_EXTERNAL_STORAGE),
                STORAGE_PERMISSION_CODE
            )
        }
    }
}
```

#### iOS Implementation

For iOS, use the shared document directory or app group container:

```swift
// iosApp/iosApp/ExternalStorageManager.swift
import Foundation

class ExternalStorageManager {
    // Get the shared documents directory
    static func getSharedDocumentsDirectory() -> URL {
        // For app groups, use this:
        // return FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.com.example.scormapp")!
        
        // Or for a standard documents directory:
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return paths[0]
    }
    
    // Get the base SCORM directory
    static func getScormBaseDirectory() -> URL {
        let baseDir = getSharedDocumentsDirectory().appendingPathComponent("ScormContent")
        if !FileManager.default.fileExists(atPath: baseDir.path) {
            try? FileManager.default.createDirectory(at: baseDir, withIntermediateDirectories: true)
        }
        return baseDir
    }
    
    // Get a specific course directory
    static func getCourseDirectory(courseId: String) -> URL {
        let courseDir = getScormBaseDirectory().appendingPathComponent(courseId)
        if !FileManager.default.fileExists(atPath: courseDir.path) {
            try? FileManager.default.createDirectory(at: courseDir, withIntermediateDirectories: true)
        }
        return courseDir
    }
    
    // Get the course URL for WebView loading
    static func getCourseUrl(courseId: String) -> URL {
        return getCourseDirectory(courseId).appendingPathComponent("index.html")
    }
}
```

Add the necessary entitlements for shared containers if using app groups:

```xml
<dict>
    <key>com.apple.security.application-groups</key>
    <array>
        <string>group.com.example.scormapp</string>
    </array>
</dict>
```

#### Update the ScormFileManager

Modify the `ScormFileManager` interface to support external storage:

```kotlin
// shared/src/commonMain/kotlin/com/example/scormapp/ScormFileManager.kt
interface ScormFileManager {
    // ... existing methods
    
    // Add methods for external storage
    suspend fun extractScormPackageToExternalStorage(courseId: String, sourceZipPath: String): Boolean
    fun getExternalCoursePath(courseId: String): String
    suspend fun listExternalCourses(): List<String>
}
```

Then implement these methods in the platform-specific classes to use the external storage managers.

#### Best Practices for External Storage

1. **Course Download Management**:
   - Download SCORM packages to a temporary directory first
   - Validate the package before extracting to the external storage
   - Implement resume capability for large downloads

2. **User Permissions**:
   - Request permissions at runtime with clear explanations
   - Handle permission denials gracefully
   - Provide alternative storage options if external storage isn't available

3. **Storage Management**:
   - Allow users to delete courses to free up space
   - Implement a cache cleaning mechanism
   - Monitor available storage space before downloads

4. **Content Security**:
   - Validate SCORM packages before loading
   - Consider encrypting sensitive content
   - Implement integrity checks for modified content

By loading SCORM content from external storage, you'll improve your app's flexibility and avoid storage limitations imposed on app-specific directories.

## Implementation

### 1. Create Shared Network Connectivity Monitor

First, create a shared interface for network monitoring:

```kotlin
// shared/src/commonMain/kotlin/com/example/scormapp/NetworkConnectivity.kt
package com.example.scormapp

import kotlinx.coroutines.flow.Flow

interface NetworkConnectivity {
    fun isNetworkAvailable(): Boolean
    fun observeNetworkConnectivity(): Flow<Boolean>
}
```

Now implement platform-specific versions:

```kotlin
// shared/src/androidMain/kotlin/com/example/scormapp/NetworkConnectivityAndroid.kt
package com.example.scormapp

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow

class NetworkConnectivityAndroid(private val context: Context) : NetworkConnectivity {
    private val connectivityManager = 
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    
    override fun isNetworkAvailable(): Boolean {
        val network = connectivityManager.activeNetwork
        val capabilities = connectivityManager.getNetworkCapabilities(network)
        return capabilities != null && (
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
        )
    }
    
    override fun observeNetworkConnectivity(): Flow<Boolean> = callbackFlow {
        val callback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                trySend(true)
            }
            
            override fun onLost(network: Network) {
                trySend(false)
            }
        }
        
        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()
            
        connectivityManager.registerNetworkCallback(request, callback)
        
        // Initial value
        trySend(isNetworkAvailable())
        
        awaitClose {
            connectivityManager.unregisterNetworkCallback(callback)
        }
    }
}
```

```swift
// shared/src/iosMain/kotlin/com/example/scormapp/NetworkConnectivityIOS.kt
package com.example.scormapp

import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import platform.Foundation.NSNotificationCenter
import platform.Foundation.NSOperationQueue
import platform.Foundation.defaultCenter
import platform.SystemConfiguration.SCNetworkReachabilityCreateWithName
import platform.SystemConfiguration.SCNetworkReachabilityFlags
import platform.SystemConfiguration.SCNetworkReachabilityGetFlags
import platform.SystemConfiguration.kSCNetworkReachabilityFlagsConnectionRequired
import platform.SystemConfiguration.kSCNetworkReachabilityFlagsReachable
import platform.darwin.dispatch_get_main_queue
import platform.darwin.dispatch_sync

class NetworkConnectivityIOS : NetworkConnectivity {
    override fun isNetworkAvailable(): Boolean {
        val reachability = SCNetworkReachabilityCreateWithName(null, "www.apple.com")
            ?: return false
        
        var flags = 0U
        var result = false
        
        dispatch_sync(dispatch_get_main_queue()) {
            result = SCNetworkReachabilityGetFlags(reachability, flags.ptr) &&
                    flags and kSCNetworkReachabilityFlagsReachable.toUInt() != 0U &&
                    flags and kSCNetworkReachabilityFlagsConnectionRequired.toUInt() == 0U
        }
        
        return result
    }
    
    override fun observeNetworkConnectivity(): Flow<Boolean> = callbackFlow {
        val observer = NSNotificationCenter.defaultCenter.addObserverForName(
            "kNetworkReachabilityChangedNotification",
            null,
            NSOperationQueue.mainQueue
        ) { _ ->
            trySend(isNetworkAvailable())
        }
        
        // Initial value
        trySend(isNetworkAvailable())
        
        awaitClose {
            NSNotificationCenter.defaultCenter.removeObserver(observer)
        }
    }
}
```

### 2. Create a File Operations Manager

```kotlin
// shared/src/commonMain/kotlin/com/example/scormapp/ScormFileManager.kt
package com.example.scormapp

import io.github.krisbitney.file.File
import io.github.krisbitney.file.FileSystem
import kotlinx.coroutines.flow.Flow

interface ScormFileManager {
    suspend fun copyScormApiToLocal()
    suspend fun extractScormPackageToLocal(courseId: String): Boolean
    fun getScormApiPath(): String
    fun getCoursePath(courseId: String): String
    suspend fun fileExists(path: String): Boolean
}

class ScormFileManagerImpl(private val fileSystem: FileSystem) : ScormFileManager {
    private val localScormApiPath = "scorm-again/api"
    private val localCoursesPath = "scorm-again/courses"
    
    override suspend fun copyScormApiToLocal() {
        // Create directory if it doesn't exist
        val apiDir = File(localScormApiPath, fileSystem)
        if (!apiDir.exists()) {
            apiDir.mkdirs()
        }
        
        // Copy API file from assets to local storage
        val apiJsFile = File("$localScormApiPath/scorm-again.js", fileSystem)
        if (!apiJsFile.exists()) {
            val assetContent = fileSystem.readAssetFile("scorm-again/api/scorm-again.js")
            apiJsFile.writeBytes(assetContent)
        }
    }
    
    override suspend fun extractScormPackageToLocal(courseId: String): Boolean {
        val courseDir = File("$localCoursesPath/$courseId", fileSystem)
        if (!courseDir.exists()) {
            courseDir.mkdirs()
            
            // Copy course files - implementation depends on whether course is in assets
            // or needs to be unzipped from a .zip file
            try {
                // Simple implementation: copy index.html
                val indexFile = File("$localCoursesPath/$courseId/index.html", fileSystem)
                val assetContent = fileSystem.readAssetFile("courses/$courseId/index.html")
                indexFile.writeBytes(assetContent)
                
                // In a real implementation, you would copy all course files or extract a zip
                
                return true
            } catch (e: Exception) {
                return false
            }
        }
        return true
    }
    
    override fun getScormApiPath(): String {
        return fileSystem.getFileUrl("$localScormApiPath/scorm-again.js")
    }
    
    override fun getCoursePath(courseId: String): String {
        return fileSystem.getDirectoryUrl("$localCoursesPath/$courseId")
    }
    
    override suspend fun fileExists(path: String): Boolean {
        return File(path, fileSystem).exists()
    }
}
```

### 3. Create a WebView Interface

```kotlin
// shared/src/commonMain/kotlin/com/example/scormapp/ScormWebView.kt
package com.example.scormapp

import kotlinx.coroutines.flow.Flow

interface ScormWebView {
    fun loadCourse(courseUrl: String)
    fun injectScormAgain(apiPath: String, courseId: String, isOnline: Boolean)
    fun syncOfflineData()
    fun getMessages(): Flow<ScormMessage>
}

sealed class ScormMessage {
    data class Log(val message: String, val level: Int) : ScormMessage()
    data class Sync(val success: Boolean) : ScormMessage()
    data class Error(val message: String) : ScormMessage()
}
```

### 4. Implement ScormWebView for Android

```kotlin
// shared/src/androidMain/kotlin/com/example/scormapp/ScormWebViewAndroid.kt
package com.example.scormapp

import android.annotation.SuppressLint
import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import org.json.JSONObject

class ScormWebViewAndroid(
    private val context: Context,
    private val webView: WebView
) : ScormWebView {
    private val messageFlow = callbackFlow<ScormMessage> {
        val jsInterface = object {
            @JavascriptInterface
            fun postMessage(message: String) {
                try {
                    val jsonMessage = JSONObject(message)
                    when (jsonMessage.getString("type")) {
                        "log" -> {
                            trySend(
                                ScormMessage.Log(
                                    jsonMessage.getString("message"),
                                    jsonMessage.getInt("level")
                                )
                            )
                        }
                        "sync" -> {
                            trySend(
                                ScormMessage.Sync(
                                    jsonMessage.getString("status") == "success"
                                )
                            )
                        }
                        else -> trySend(ScormMessage.Error("Unknown message type"))
                    }
                } catch (e: Exception) {
                    trySend(ScormMessage.Error(e.message ?: "Unknown error"))
                }
            }
        }
        
        webView.addJavascriptInterface(jsInterface, "KotlinBridge")
        
        awaitClose {
            webView.removeJavascriptInterface("KotlinBridge")
        }
    }
    
    @SuppressLint("SetJavaScriptEnabled")
    override fun loadCourse(courseUrl: String) {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
        }
        
        webView.loadUrl(courseUrl)
    }
    
    override fun injectScormAgain(apiPath: String, courseId: String, isOnline: Boolean) {
        val js = """
            var scormAgainScript = document.createElement('script');
            scormAgainScript.src = '$apiPath';
            scormAgainScript.onload = function() {
                window.API = new window.ScormAgain.SCORM2004API({
                    enableOfflineSupport: true,
                    courseId: '$courseId',
                    autocommit: true,
                    autocommitSeconds: 60,
                    syncOnInitialize: true,
                    syncOnTerminate: true,
                    logLevel: 4,
                    onLogMessage: function(message, level) {
                        window.KotlinBridge.postMessage(JSON.stringify({
                            type: 'log',
                            message: message,
                            level: level
                        }));
                    }
                });
                
                window.API.on('OfflineDataSynced', function() {
                    window.KotlinBridge.postMessage(JSON.stringify({
                        type: 'sync',
                        status: 'success'
                    }));
                });
                
                window.API._offlineStorageService.isDeviceOnline = function() {
                    return $isOnline;
                };
            };
            document.head.appendChild(scormAgainScript);
        """.trimIndent()
        
        webView.evaluateJavascript(js, null)
    }
    
    override fun syncOfflineData() {
        val js = """
            if (window.API && window.API._offlineStorageService) {
                window.API._offlineStorageService.syncOfflineData().then(function(success) {
                    window.KotlinBridge.postMessage(JSON.stringify({
                        type: 'sync',
                        status: success ? 'success' : 'failed'
                    }));
                });
            }
        """.trimIndent()
        
        webView.evaluateJavascript(js, null)
    }
    
    override fun getMessages(): Flow<ScormMessage> = messageFlow
}
```

### 5. Implement ScormWebView for iOS

Create the iOS implementation using the Swift interop:

```swift
// iosApp/iosApp/ScormWebView.swift
import WebKit
import Shared

class ScormWebViewIOS: NSObject, WKScriptMessageHandler, ObservableObject {
    private var webView: WKWebView
    private var messageCallback: ((String) -> Void)? = nil
    
    init(messageCallback: @escaping (String) -> Void) {
        let configuration = WKWebViewConfiguration()
        let userContentController = WKUserContentController()
        configuration.userContentController = userContentController
        
        self.webView = WKWebView(frame: .zero, configuration: configuration)
        self.messageCallback = messageCallback
        
        super.init()
        
        userContentController.add(self, name: "kotlinBridge")
    }
    
    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        if let messageBody = message.body as? String {
            messageCallback?(messageBody)
        }
    }
    
    func getWebView() -> WKWebView {
        return webView
    }
    
    func loadCourse(url: URL) {
        webView.load(URLRequest(url: url))
    }
    
    func injectScormAgain(apiPath: String, courseId: String, isOnline: Bool) {
        let js = """
        var scormAgainScript = document.createElement('script');
        scormAgainScript.src = '\(apiPath)';
        scormAgainScript.onload = function() {
            window.API = new window.ScormAgain.SCORM2004API({
                enableOfflineSupport: true,
                courseId: '\(courseId)',
                autocommit: true,
                autocommitSeconds: 60,
                syncOnInitialize: true,
                syncOnTerminate: true,
                logLevel: 4,
                onLogMessage: function(message, level) {
                    window.webkit.messageHandlers.kotlinBridge.postMessage(JSON.stringify({
                        type: 'log',
                        message: message,
                        level: level
                    }));
                }
            });
            
            window.API.on('OfflineDataSynced', function() {
                window.webkit.messageHandlers.kotlinBridge.postMessage(JSON.stringify({
                    type: 'sync',
                    status: 'success'
                }));
            });
            
            window.API._offlineStorageService.isDeviceOnline = function() {
                return \(isOnline);
            };
        };
        document.head.appendChild(scormAgainScript);
        """
        
        webView.evaluateJavaScript(js, completionHandler: nil)
    }
    
    func syncOfflineData() {
        let js = """
        if (window.API && window.API._offlineStorageService) {
            window.API._offlineStorageService.syncOfflineData().then(function(success) {
                window.webkit.messageHandlers.kotlinBridge.postMessage(JSON.stringify({
                    type: 'sync',
                    status: success ? 'success' : 'failed'
                }));
            });
        }
        """
        
        webView.evaluateJavaScript(js, completionHandler: nil)
    }
}
```

Now create the Kotlin wrapper for this class:

```kotlin
// shared/src/iosMain/kotlin/com/example/scormapp/ScormWebViewIOS.kt
package com.example.scormapp

import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import platform.Foundation.NSURL
import org.json.JSONObject

class ScormWebViewIOS : ScormWebView {
    private val webView = ScormWebViewIOS { message ->
        try {
            val jsonMessage = JSONObject(message)
            when (jsonMessage.getString("type")) {
                "log" -> {
                    messageCallback?.invoke(
                        ScormMessage.Log(
                            jsonMessage.getString("message"),
                            jsonMessage.getInt("level")
                        )
                    )
                }
                "sync" -> {
                    messageCallback?.invoke(
                        ScormMessage.Sync(
                            jsonMessage.getString("status") == "success"
                        )
                    )
                }
                else -> messageCallback?.invoke(ScormMessage.Error("Unknown message type"))
            }
        } catch (e: Exception) {
            messageCallback?.invoke(ScormMessage.Error(e.message ?: "Unknown error"))
        }
    }
    
    private var messageCallback: ((ScormMessage) -> Unit)? = null
    
    private val messageFlow = callbackFlow<ScormMessage> {
        messageCallback = { message ->
            trySend(message)
        }
        
        awaitClose {
            messageCallback = null
        }
    }
    
    override fun loadCourse(courseUrl: String) {
        webView.loadCourse(url = NSURL(string = courseUrl))
    }
    
    override fun injectScormAgain(apiPath: String, courseId: String, isOnline: Boolean) {
        webView.injectScormAgain(apiPath = apiPath, courseId = courseId, isOnline = isOnline)
    }
    
    override fun syncOfflineData() {
        webView.syncOfflineData()
    }
    
    override fun getMessages(): Flow<ScormMessage> = messageFlow
}
```

### 6. Create a ScormPlayerViewModel in the Shared Module

```kotlin
// shared/src/commonMain/kotlin/com/example/scormapp/ScormPlayerViewModel.kt
package com.example.scormapp

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch

class ScormPlayerViewModel(
    private val courseId: String,
    private val fileManager: ScormFileManager,
    private val networkConnectivity: NetworkConnectivity
) {
    private val viewModelScope = CoroutineScope(SupervisorJob() + Dispatchers.Main)
    
    private val _state = MutableStateFlow<ScormPlayerState>(ScormPlayerState.Loading)
    val state: StateFlow<ScormPlayerState> = _state
    
    private val _isOnline = MutableStateFlow(true)
    val isOnline: StateFlow<Boolean> = _isOnline
    
    init {
        viewModelScope.launch {
            // Monitor network connectivity
            networkConnectivity.observeNetworkConnectivity().collect { isConnected ->
                _isOnline.value = isConnected
            }
        }
        
        // Initialize the course
        viewModelScope.launch {
            initializeScormContent()
        }
    }
    
    private suspend fun initializeScormContent() {
        _state.value = ScormPlayerState.Loading
        
        try {
            // Copy SCORM API to local storage
            fileManager.copyScormApiToLocal()
            
            // Extract SCORM package
            val extractResult = fileManager.extractScormPackageToLocal(courseId)
            
            if (extractResult) {
                val apiPath = fileManager.getScormApiPath()
                val coursePath = fileManager.getCoursePath(courseId)
                
                _state.value = ScormPlayerState.Ready(
                    apiPath = apiPath,
                    coursePath = coursePath
                )
            } else {
                _state.value = ScormPlayerState.Error("Failed to extract SCORM package")
            }
        } catch (e: Exception) {
            _state.value = ScormPlayerState.Error(e.message ?: "Unknown error")
        }
    }
    
    fun syncOfflineData(webView: ScormWebView) {
        if (_isOnline.value) {
            webView.syncOfflineData()
        }
    }
}

sealed class ScormPlayerState {
    object Loading : ScormPlayerState()
    data class Ready(val apiPath: String, val coursePath: String) : ScormPlayerState()
    data class Error(val message: String) : ScormPlayerState()
}
```

### 7. Implement the Android UI

```kotlin
// androidApp/src/main/java/com/example/scormapp/android/ScormPlayerActivity.kt
package com.example.scormapp.android

import android.os.Bundle
import android.webkit.WebView
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material.CircularProgressIndicator
import androidx.compose.material.Icon
import androidx.compose.material.IconButton
import androidx.compose.material.Surface
import androidx.compose.material.Text
import androidx.compose.material.TopAppBar
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Sync
import androidx.compose.material.icons.filled.WifiOff
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import com.example.scormapp.NetworkConnectivityAndroid
import com.example.scormapp.ScormFileManagerImpl
import com.example.scormapp.ScormMessage
import com.example.scormapp.ScormPlayerState
import com.example.scormapp.ScormPlayerViewModel
import com.example.scormapp.ScormWebViewAndroid
import io.github.krisbitney.file.AndroidFileSystem
import kotlinx.coroutines.flow.collect

class ScormPlayerActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val courseId = intent.getStringExtra("courseId") ?: "course1"
        
        val fileSystem = AndroidFileSystem(this)
        val fileManager = ScormFileManagerImpl(fileSystem)
        val networkConnectivity = NetworkConnectivityAndroid(this)
        
        val viewModel = ScormPlayerViewModel(
            courseId = courseId,
            fileManager = fileManager,
            networkConnectivity = networkConnectivity
        )
        
        setContent {
            ScormPlayerScreen(viewModel = viewModel)
        }
    }
}

@Composable
fun ScormPlayerScreen(viewModel: ScormPlayerViewModel) {
    val state by viewModel.state.collectAsState()
    val isOnline by viewModel.isOnline.collectAsState()
    
    Column {
        TopAppBar(
            title = { Text("SCORM Course Player") },
            actions = {
                Icon(
                    imageVector = if (isOnline) Icons.Default.Wifi else Icons.Default.WifiOff,
                    contentDescription = if (isOnline) "Online" else "Offline"
                )
                IconButton(
                    onClick = { /* Sync data */ },
                    enabled = isOnline
                ) {
                    Icon(Icons.Default.Sync, contentDescription = "Sync")
                }
            }
        )
        
        when (val currentState = state) {
            is ScormPlayerState.Loading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            }
            is ScormPlayerState.Ready -> {
                AndroidView(
                    factory = { context ->
                        WebView(context).apply {
                            val webView = this
                            val scormWebView = ScormWebViewAndroid(context, webView)
                            
                            // Load the course
                            scormWebView.loadCourse(currentState.coursePath + "/index.html")
                            
                            // Inject scorm-again when the page is loaded
                            webView.webViewClient = object : android.webkit.WebViewClient() {
                                override fun onPageFinished(view: WebView?, url: String?) {
                                    super.onPageFinished(view, url)
                                    scormWebView.injectScormAgain(
                                        apiPath = currentState.apiPath,
                                        courseId = courseId,
                                        isOnline = isOnline
                                    )
                                }
                            }
                            
                            // Collect messages from the WebView
                            LaunchedEffect(scormWebView) {
                                scormWebView.getMessages().collect { message ->
                                    when (message) {
                                        is ScormMessage.Log -> {
                                            println("SCORM Log: ${message.message}")
                                        }
                                        is ScormMessage.Sync -> {
                                            val messageText = if (message.success) {
                                                "SCORM data synchronized successfully"
                                            } else {
                                                "Failed to synchronize some SCORM data"
                                            }
                                            Toast.makeText(context, messageText, Toast.LENGTH_SHORT).show()
                                        }
                                        is ScormMessage.Error -> {
                                            Toast.makeText(context, message.message, Toast.LENGTH_SHORT).show()
                                        }
                                    }
                                }
                            }
                            
                            // Sync data when back online
                            LaunchedEffect(isOnline) {
                                if (isOnline) {
                                    scormWebView.syncOfflineData()
                                }
                            }
                        }
                    },
                    modifier = Modifier.fillMaxSize()
                )
            }
            is ScormPlayerState.Error -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text("Error: ${currentState.message}")
                }
            }
        }
    }
}
```

### 8. Implement the iOS UI

```swift
// iosApp/iosApp/ScormPlayerView.swift
import SwiftUI
import Shared
import WebKit

struct ScormPlayerView: View {
    @ObservedObject private var viewModel: ScormPlayerViewModelWrapper
    @ObservedObject private var webViewBridge = ScormWebViewBridge()
    
    init(courseId: String) {
        let fileSystem = IOSFileSystem()
        let fileManager = ScormFileManagerImpl(fileSystem: fileSystem)
        let networkConnectivity = NetworkConnectivityIOS()
        
        viewModel = ScormPlayerViewModelWrapper(
            viewModel: ScormPlayerViewModel(
                courseId: courseId,
                fileManager: fileManager,
                networkConnectivity: networkConnectivity
            )
        )
    }
    
    var body: some View {
        NavigationView {
            ZStack {
                switch viewModel.state {
                case .loading:
                    ProgressView("Loading...")
                case .ready(let apiPath, let coursePath):
                    ScormWebContainer(
                        apiPath: apiPath,
                        coursePath: coursePath,
                        courseId: viewModel.courseId,
                        isOnline: viewModel.isOnline,
                        bridge: webViewBridge
                    )
                case .error(let message):
                    Text("Error: \(message)")
                default:
                    Text("Unknown state")
                }
            }
            .navigationTitle("SCORM Course")
            .navigationBarItems(
                trailing: HStack {
                    Image(systemName: viewModel.isOnline ? "wifi" : "wifi.slash")
                    
                    Button(action: {
                        if viewModel.isOnline {
                            webViewBridge.webView?.syncOfflineData()
                        }
                    }) {
                        Image(systemName: "arrow.clockwise")
                    }
                    .disabled(!viewModel.isOnline)
                }
            )
        }
        .alert(item: $webViewBridge.alertMessage) { message in
            Alert(
                title: Text(message.title),
                message: Text(message.message),
                dismissButton: .default(Text("OK"))
            )
        }
    }
}

class ScormWebViewBridge: ObservableObject {
    @Published var webView: ScormWebViewIOS?
    @Published var alertMessage: AlertMessage?
    
    struct AlertMessage: Identifiable {
        let id = UUID()
        let title: String
        let message: String
    }
}

struct ScormWebContainer: UIViewRepresentable {
    let apiPath: String
    let coursePath: String
    let courseId: String
    let isOnline: Bool
    let bridge: ScormWebViewBridge
    
    func makeUIView(context: Context) -> WKWebView {
        let scormWebView = ScormWebViewIOS { message in
            DispatchQueue.main.async {
                do {
                    let jsonData = message.data(using: .utf8)!
                    let json = try JSONSerialization.jsonObject(with: jsonData, options: []) as! [String: Any]
                    
                    switch json["type"] as! String {
                    case "log":
                        print("SCORM Log: \(json["message"] as! String)")
                    case "sync":
                        let success = (json["status"] as! String) == "success"
                        self.bridge.alertMessage = AlertMessage(
                            title: success ? "Sync Complete" : "Sync Failed",
                            message: success ? "SCORM data synchronized successfully" : "Failed to synchronize some SCORM data"
                        )
                    default:
                        break
                    }
                } catch {
                    print("Error parsing message: \(error)")
                }
            }
        }
        
        bridge.webView = scormWebView
        let webView = scormWebView.getWebView()
        
        // Load the course
        if let url = URL(string: coursePath + "/index.html") {
            scormWebView.loadCourse(url: url)
        }
        
        return webView
    }
    
    func updateUIView(_ webView: WKWebView, context: Context) {
        // Inject scorm-again when the page is loaded
        bridge.webView?.injectScormAgain(
            apiPath: apiPath,
            courseId: courseId,
            isOnline: isOnline
        )
        
        // If back online, try to sync data
        if isOnline {
            bridge.webView?.syncOfflineData()
        }
    }
}

class ScormPlayerViewModelWrapper: ObservableObject {
    private let viewModel: ScormPlayerViewModel
    @Published var state: ScormPlayerStateKt = ScormPlayerStateKt.Loading()
    @Published var isOnline: Bool = true
    let courseId: String
    
    init(viewModel: ScormPlayerViewModel) {
        self.viewModel = viewModel
        self.courseId = viewModel.courseId
        
        // Observe state changes
        viewModel.state.watch { [weak self] state in
            self?.state = state
        }
        
        // Observe online status
        viewModel.isOnline.watch { [weak self] isOnline in
            self?.isOnline = isOnline
        }
    }
}
```

## Key Features of This Implementation

### 1. Shared Code Management

- Implements a common interface for platform-specific functionality
- Uses Kotlin Multiplatform to share business logic
- Keeps platform-specific UI implementations separate

### 2. Network Connectivity Monitoring

- Creates a shared interface for network monitoring
- Implements platform-specific connectivity monitoring
- Automatically syncs data when the device comes back online

### 3. File Operations

- Uses a cross-platform file library for consistent file operations
- Manages extraction and copying of SCORM content
- Provides local file access for offline use

### 4. WebView Integration

- Wraps platform-specific WebView implementations
- Handles JavaScript-to-Kotlin/Swift communication
- Injects the scorm-again API into the WebView

### 5. scorm-again Configuration

The scorm-again API is initialized with these key settings:

```javascript
{
  enableOfflineSupport: true,  // Enable offline capabilities
  courseId: 'course1',         // Unique identifier for the course
  autocommit: true,            // Automatically commit data
  syncOnInitialize: true,      // Try to sync when the API initializes
  syncOnTerminate: true,       // Try to sync when the API terminates
}
```

## Performance Considerations

### 1. Memory Management

- Clean up resources when the WebView is no longer needed
- Unregister network listeners when the view is destroyed
- Manage coroutine scopes properly to avoid memory leaks

### 2. File Operations

- Consider using background dispatchers for file operations
- Cache file paths to avoid repeated file system access
- Use efficient file copying techniques, especially for large SCORM packages

### 3. WebView Configuration

- Configure WebView settings appropriately for your content needs
- Consider disabling features not required by your SCORM content
- Use hardware acceleration for better performance

## Security Considerations

### 1. Content Validation

As with other platforms, always validate SCORM packages before loading them:

```kotlin
suspend fun validateScormPackage(courseId: String): Boolean {
    val indexHtmlPath = "$localCoursesPath/$courseId/index.html"
    val manifestPath = "$localCoursesPath/$courseId/imsmanifest.xml"
    
    return fileSystem.exists(indexHtmlPath) && fileSystem.exists(manifestPath)
}
```

### 2. Data Protection

For sensitive SCORM data, consider implementing encrypted storage:

```kotlin
// In your shared module
interface SecureStorage {
    suspend fun storeSecurely(key: String, data: String)
    suspend fun retrieveSecurely(key: String): String?
}

// Platform-specific implementations would use KeyStore on Android
// and KeyChain on iOS for secure storage
```

## Troubleshooting

### Common Issues

1. **WebView JavaScript Bridge Communication**
   - Ensure message handlers are properly registered
   - Check that JavaScript interfaces are correctly implemented
   - Verify the bridge name matches in both directions

2. **File Access Issues**
   - Verify file paths are correct and accessible
   - Check that necessary permissions are granted
   - Ensure assets are properly bundled with the application

3. **Platform-Specific Issues**
   - For Android: Check manifest permissions
   - For iOS: Verify App Transport Security settings allow local file access

4. **Kotlin Multiplatform Integration**
   - Ensure Kotlin-Native memory management is handled correctly
   - Check Kotlin-Swift interop for any type conversion issues
   - Verify common code is actually shared correctly between platforms

## Conclusion

This Kotlin Multiplatform implementation provides a robust cross-platform solution for implementing SCORM content with offline support. By sharing core business logic while leveraging platform-specific capabilities for WebView and file operations, you can deliver a consistent learning experience across both Android and iOS platforms. 