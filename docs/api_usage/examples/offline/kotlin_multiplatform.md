# Using scorm-again with Kotlin Multiplatform for Offline Learning

This guide demonstrates how to implement SCORM content in a Kotlin Multiplatform (KMP) application with
offline support using scorm-again. KMP allows you to share business logic across Android and iOS while
using platform-native WebView implementations.

## Prerequisites

- Android Studio with Kotlin Multiplatform plugin
- Xcode for iOS development
- Basic knowledge of Kotlin Multiplatform development
- Understanding of SCORM packages

## Project Setup

### 1. Configure Version Catalog

Create or update your `gradle/libs.versions.toml` with the required dependencies:

```toml
[versions]
kotlin = "2.0.21"
agp = "8.7.0"
ktor = "3.0.0"
coroutines = "1.9.0"
serialization = "1.7.3"
sqldelight = "2.0.2"

[libraries]
# Coroutines
coroutines-core = { module = "org.jetbrains.kotlinx:kotlinx-coroutines-core", version.ref = "coroutines" }

# Serialization
serialization-json = { module = "org.jetbrains.kotlinx:kotlinx-serialization-json", version.ref = "serialization" }

# Ktor Client
ktor-client-core = { module = "io.ktor:ktor-client-core", version.ref = "ktor" }
ktor-client-okhttp = { module = "io.ktor:ktor-client-okhttp", version.ref = "ktor" }
ktor-client-darwin = { module = "io.ktor:ktor-client-darwin", version.ref = "ktor" }
ktor-client-content-negotiation = { module = "io.ktor:ktor-client-content-negotiation", version.ref = "ktor" }
ktor-serialization-json = { module = "io.ktor:ktor-serialization-kotlinx-json", version.ref = "ktor" }

# SQLDelight
sqldelight-runtime = { module = "app.cash.sqldelight:runtime", version.ref = "sqldelight" }
sqldelight-coroutines = { module = "app.cash.sqldelight:coroutines-extensions", version.ref = "sqldelight" }
sqldelight-android = { module = "app.cash.sqldelight:android-driver", version.ref = "sqldelight" }
sqldelight-native = { module = "app.cash.sqldelight:native-driver", version.ref = "sqldelight" }

[plugins]
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
androidApplication = { id = "com.android.application", version.ref = "agp" }
androidLibrary = { id = "com.android.library", version.ref = "agp" }
kotlinSerialization = { id = "org.jetbrains.kotlin.plugin.serialization", version.ref = "kotlin" }
sqldelight = { id = "app.cash.sqldelight", version.ref = "sqldelight" }
```

### 2. Configure Shared Module

Update your `shared/build.gradle.kts`:

```kotlin
plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.kotlinSerialization)
    alias(libs.plugins.androidLibrary)
    alias(libs.plugins.sqldelight)
}

kotlin {
    androidTarget()
    iosX64()
    iosArm64()
    iosSimulatorArm64()

    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation(libs.coroutines.core)
                implementation(libs.serialization.json)
                implementation(libs.ktor.client.core)
                implementation(libs.ktor.client.content.negotiation)
                implementation(libs.ktor.serialization.json)
                implementation(libs.sqldelight.runtime)
                implementation(libs.sqldelight.coroutines)
            }
        }
        val androidMain by getting {
            dependencies {
                implementation(libs.ktor.client.okhttp)
                implementation(libs.sqldelight.android)
            }
        }
        val iosMain by creating {
            dependsOn(commonMain)
            dependencies {
                implementation(libs.ktor.client.darwin)
                implementation(libs.sqldelight.native)
            }
        }
        val iosX64Main by getting { dependsOn(iosMain) }
        val iosArm64Main by getting { dependsOn(iosMain) }
        val iosSimulatorArm64Main by getting { dependsOn(iosMain) }
    }
}

android {
    namespace = "com.example.scormplayer.shared"
    compileSdk = 35

    defaultConfig {
        minSdk = 24
    }
}

sqldelight {
    databases {
        create("ScormDatabase") {
            packageName.set("com.example.scormplayer.db")
            schemaOutputDirectory.set(file("src/commonMain/sqldelight/schema"))
        }
    }
}
```

### 3. Project Structure

```
/shared
  /src
    /commonMain
      /kotlin
        /connectivity    # Network monitoring abstractions
        /db              # SQLDelight database access
        /scorm           # SCORM data models and sync logic
        /web             # WebView abstractions
      /sqldelight        # SQL schema files
    /androidMain
      /kotlin
        /connectivity    # Android ConnectivityManager implementation
        /db              # Android SQLite driver
        /web             # Android WebView implementation
    /iosMain
      /kotlin
        /connectivity    # iOS NWPathMonitor implementation
        /db              # iOS Native SQLite driver
        /web             # iOS WKWebView implementation
/androidApp
  /src/main
    /assets
      /scorm-again
        /api
          scorm-again.js
/iosApp
  /Resources
    /scorm-again
      /api
        scorm-again.js
```

## Implementation

### 1. Network Connectivity Monitoring (Shared)

Create a shared abstraction for network connectivity:

```kotlin
// shared/src/commonMain/kotlin/connectivity/ConnectivityObserver.kt
package connectivity

import kotlinx.coroutines.flow.Flow

enum class NetworkStatus {
    Available,
    Unavailable,
    Losing,
    Lost
}

interface ConnectivityObserver {
    val status: Flow<NetworkStatus>
    fun isCurrentlyAvailable(): Boolean
}

expect class ConnectivityObserverFactory {
    fun create(): ConnectivityObserver
}
```

#### Android Implementation

```kotlin
// shared/src/androidMain/kotlin/connectivity/ConnectivityObserver.android.kt
package connectivity

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.distinctUntilChanged

class AndroidConnectivityObserver(
    private val context: Context
) : ConnectivityObserver {

    private val connectivityManager =
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    override val status: Flow<NetworkStatus> = callbackFlow {
        val callback = object : ConnectivityManager.NetworkCallback() {
            override fun onAvailable(network: Network) {
                trySend(NetworkStatus.Available)
            }

            override fun onLosing(network: Network, maxMsToLive: Int) {
                trySend(NetworkStatus.Losing)
            }

            override fun onLost(network: Network) {
                trySend(NetworkStatus.Lost)
            }

            override fun onUnavailable() {
                trySend(NetworkStatus.Unavailable)
            }
        }

        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()

        connectivityManager.registerNetworkCallback(request, callback)

        // Send initial state
        trySend(if (isCurrentlyAvailable()) NetworkStatus.Available else NetworkStatus.Unavailable)

        awaitClose {
            connectivityManager.unregisterNetworkCallback(callback)
        }
    }.distinctUntilChanged()

    override fun isCurrentlyAvailable(): Boolean {
        val network = connectivityManager.activeNetwork
        val capabilities = connectivityManager.getNetworkCapabilities(network)
        return capabilities != null && (
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
        )
    }
}

actual class ConnectivityObserverFactory(
    private val context: Context
) {
    actual fun create(): ConnectivityObserver = AndroidConnectivityObserver(context)
}
```

#### iOS Implementation

```kotlin
// shared/src/iosMain/kotlin/connectivity/ConnectivityObserver.ios.kt
package connectivity

import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.flow.distinctUntilChanged
import platform.Network.nw_path_get_status
import platform.Network.nw_path_monitor_cancel
import platform.Network.nw_path_monitor_create
import platform.Network.nw_path_monitor_set_queue
import platform.Network.nw_path_monitor_set_update_handler
import platform.Network.nw_path_monitor_start
import platform.Network.nw_path_status_satisfied
import platform.darwin.dispatch_get_main_queue

class IOSConnectivityObserver : ConnectivityObserver {

    private var currentStatus: NetworkStatus = NetworkStatus.Available

    override val status: Flow<NetworkStatus> = callbackFlow {
        val monitor = nw_path_monitor_create()
        nw_path_monitor_set_queue(monitor, dispatch_get_main_queue())

        nw_path_monitor_set_update_handler(monitor) { path ->
            val reachable = nw_path_get_status(path) == nw_path_status_satisfied
            currentStatus = if (reachable) NetworkStatus.Available else NetworkStatus.Unavailable
            trySend(currentStatus)
        }

        nw_path_monitor_start(monitor)

        awaitClose {
            nw_path_monitor_cancel(monitor)
        }
    }.distinctUntilChanged()

    override fun isCurrentlyAvailable(): Boolean = currentStatus == NetworkStatus.Available
}

actual class ConnectivityObserverFactory {
    actual fun create(): ConnectivityObserver = IOSConnectivityObserver()
}
```

### 2. Local Storage with SQLDelight

Create the SQL schema for storing SCORM data:

```sql
-- shared/src/commonMain/sqldelight/com/example/scormplayer/db/ScormData.sq
CREATE TABLE scorm_data (
    course_id TEXT NOT NULL,
    element_key TEXT NOT NULL,
    element_value TEXT NOT NULL,
    timestamp INTEGER NOT NULL,
    synced INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (course_id, element_key)
);

selectAllForCourse:
SELECT * FROM scorm_data WHERE course_id = ?;

selectUnsynced:
SELECT * FROM scorm_data WHERE synced = 0;

insertOrReplace:
INSERT OR REPLACE INTO scorm_data (course_id, element_key, element_value, timestamp, synced)
VALUES (?, ?, ?, ?, ?);

markAsSynced:
UPDATE scorm_data SET synced = 1 WHERE course_id = ? AND element_key = ?;

deleteForCourse:
DELETE FROM scorm_data WHERE course_id = ?;

deleteAll:
DELETE FROM scorm_data;
```

Create the database driver factory:

```kotlin
// shared/src/commonMain/kotlin/db/DatabaseDriverFactory.kt
package db

import app.cash.sqldelight.db.SqlDriver

expect class DatabaseDriverFactory {
    fun createDriver(): SqlDriver
}
```

```kotlin
// shared/src/androidMain/kotlin/db/DatabaseDriverFactory.android.kt
package db

import android.content.Context
import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.android.AndroidSqliteDriver
import com.example.scormplayer.db.ScormDatabase

actual class DatabaseDriverFactory(
    private val context: Context
) {
    actual fun createDriver(): SqlDriver =
        AndroidSqliteDriver(ScormDatabase.Schema, context, "scorm.db")
}
```

```kotlin
// shared/src/iosMain/kotlin/db/DatabaseDriverFactory.ios.kt
package db

import app.cash.sqldelight.db.SqlDriver
import app.cash.sqldelight.driver.native.NativeSqliteDriver
import com.example.scormplayer.db.ScormDatabase

actual class DatabaseDriverFactory {
    actual fun createDriver(): SqlDriver =
        NativeSqliteDriver(ScormDatabase.Schema, "scorm.db")
}
```

Create a repository for SCORM data:

```kotlin
// shared/src/commonMain/kotlin/db/ScormDataRepository.kt
package db

import com.example.scormplayer.db.ScormDatabase
import com.example.scormplayer.db.Scorm_data
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.IO
import kotlinx.coroutines.withContext

class ScormDataRepository(
    driverFactory: DatabaseDriverFactory
) {
    private val database = ScormDatabase(driverFactory.createDriver())
    private val queries = database.scormDataQueries

    suspend fun saveData(
        courseId: String,
        key: String,
        value: String,
        synced: Boolean = false
    ) = withContext(Dispatchers.IO) {
        queries.insertOrReplace(
            course_id = courseId,
            element_key = key,
            element_value = value,
            timestamp = System.currentTimeMillis(),
            synced = if (synced) 1L else 0L
        )
    }

    suspend fun getDataForCourse(courseId: String): List<Scorm_data> =
        withContext(Dispatchers.IO) {
            queries.selectAllForCourse(courseId).executeAsList()
        }

    suspend fun getUnsyncedData(): List<Scorm_data> =
        withContext(Dispatchers.IO) {
            queries.selectUnsynced().executeAsList()
        }

    suspend fun markAsSynced(courseId: String, key: String) =
        withContext(Dispatchers.IO) {
            queries.markAsSynced(courseId, key)
        }

    suspend fun deleteForCourse(courseId: String) =
        withContext(Dispatchers.IO) {
            queries.deleteForCourse(courseId)
        }
}
```

### 3. WebView Abstraction (Shared)

Create a shared interface for WebView operations:

```kotlin
// shared/src/commonMain/kotlin/web/WebViewController.kt
package web

interface WebViewController {
    fun loadUrl(url: String)
    fun evaluateJavaScript(script: String, callback: (String?) -> Unit = {})
    fun addJavaScriptInterface(name: String, handler: (String) -> Unit)
}

interface WebViewDelegate {
    fun onPageFinished(url: String)
    fun onError(error: String)
}

expect class WebViewFactory {
    fun create(delegate: WebViewDelegate): WebViewController
}
```

#### Android WebView Implementation

```kotlin
// shared/src/androidMain/kotlin/web/WebViewController.android.kt
package web

import android.annotation.SuppressLint
import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient

class AndroidWebViewController(
    private val context: Context,
    private val delegate: WebViewDelegate
) : WebViewController {

    val webView: WebView = WebView(context).apply {
        setupWebView()
    }

    private val jsHandlers = mutableMapOf<String, (String) -> Unit>()

    @SuppressLint("SetJavaScriptEnabled")
    private fun WebView.setupWebView() {
        settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
        }

        webChromeClient = WebChromeClient()
        webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                url?.let { delegate.onPageFinished(it) }
            }

            override fun onReceivedError(
                view: WebView?,
                errorCode: Int,
                description: String?,
                failingUrl: String?
            ) {
                delegate.onError(description ?: "Unknown error")
            }
        }
    }

    override fun loadUrl(url: String) {
        webView.loadUrl(url)
    }

    override fun evaluateJavaScript(script: String, callback: (String?) -> Unit) {
        webView.evaluateJavascript(script) { result ->
            callback(result)
        }
    }

    override fun addJavaScriptInterface(name: String, handler: (String) -> Unit) {
        jsHandlers[name] = handler

        val jsInterface = object {
            @JavascriptInterface
            fun postMessage(message: String) {
                handler(message)
            }
        }

        webView.addJavascriptInterface(jsInterface, name)
    }
}

actual class WebViewFactory(
    private val context: Context
) {
    actual fun create(delegate: WebViewDelegate): WebViewController =
        AndroidWebViewController(context, delegate)
}
```

#### iOS WKWebView Implementation

```kotlin
// shared/src/iosMain/kotlin/web/WebViewController.ios.kt
package web

import kotlinx.cinterop.ExperimentalForeignApi
import platform.Foundation.NSURL
import platform.Foundation.NSURLRequest
import platform.WebKit.WKNavigation
import platform.WebKit.WKNavigationDelegateProtocol
import platform.WebKit.WKScriptMessage
import platform.WebKit.WKScriptMessageHandlerProtocol
import platform.WebKit.WKUserContentController
import platform.WebKit.WKWebView
import platform.WebKit.WKWebViewConfiguration
import platform.darwin.NSObject

@OptIn(ExperimentalForeignApi::class)
class IOSWebViewController(
    private val delegate: WebViewDelegate
) : WebViewController {

    private val configuration = WKWebViewConfiguration().apply {
        userContentController = WKUserContentController()
        preferences.javaScriptEnabled = true
    }

    val webView: WKWebView = WKWebView(
        frame = platform.CoreGraphics.CGRectZero.readValue(),
        configuration = configuration
    ).apply {
        navigationDelegate = NavigationDelegate(delegate)
    }

    private val messageHandlers = mutableMapOf<String, MessageHandler>()

    override fun loadUrl(url: String) {
        val nsUrl = NSURL.URLWithString(url) ?: return
        val request = NSURLRequest.requestWithURL(nsUrl)
        webView.loadRequest(request)
    }

    override fun evaluateJavaScript(script: String, callback: (String?) -> Unit) {
        webView.evaluateJavaScript(script) { result, error ->
            if (error != null) {
                callback(null)
            } else {
                callback(result?.toString())
            }
        }
    }

    override fun addJavaScriptInterface(name: String, handler: (String) -> Unit) {
        val messageHandler = MessageHandler(handler)
        messageHandlers[name] = messageHandler
        configuration.userContentController.addScriptMessageHandler(messageHandler, name)
    }

    private class NavigationDelegate(
        private val delegate: WebViewDelegate
    ) : NSObject(), WKNavigationDelegateProtocol {
        override fun webView(webView: WKWebView, didFinishNavigation: WKNavigation?) {
            webView.URL?.absoluteString?.let { delegate.onPageFinished(it) }
        }

        override fun webView(
            webView: WKWebView,
            didFailNavigation: WKNavigation?,
            withError: platform.Foundation.NSError
        ) {
            delegate.onError(withError.localizedDescription)
        }
    }

    private class MessageHandler(
        private val handler: (String) -> Unit
    ) : NSObject(), WKScriptMessageHandlerProtocol {
        override fun userContentController(
            userContentController: WKUserContentController,
            didReceiveScriptMessage: WKScriptMessage
        ) {
            val body = didReceiveScriptMessage.body
            handler(body.toString())
        }
    }
}

actual class WebViewFactory {
    actual fun create(delegate: WebViewDelegate): WebViewController =
        IOSWebViewController(delegate)
}
```

### 4. SCORM Player Manager (Shared)

Create a shared manager that coordinates all SCORM functionality:

```kotlin
// shared/src/commonMain/kotlin/scorm/ScormPlayerManager.kt
package scorm

import connectivity.ConnectivityObserver
import connectivity.NetworkStatus
import db.ScormDataRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable
import kotlinx.serialization.json.Json
import web.WebViewController
import web.WebViewDelegate

@Serializable
data class ScormMessage(
    val type: String,
    val message: String? = null,
    val level: Int? = null,
    val status: String? = null,
    val key: String? = null,
    val value: String? = null
)

class ScormPlayerManager(
    private val webViewController: WebViewController,
    private val connectivityObserver: ConnectivityObserver,
    private val repository: ScormDataRepository,
    private val courseId: String,
    private val apiPath: String,
    private val scope: CoroutineScope = CoroutineScope(Dispatchers.Main)
) {
    private var isOnline: Boolean = true
    private var onSyncComplete: ((Boolean) -> Unit)? = null
    private var onLogMessage: ((String, Int) -> Unit)? = null

    private val json = Json { ignoreUnknownKeys = true }

    init {
        observeConnectivity()
        setupJavaScriptBridge()
    }

    private fun observeConnectivity() {
        scope.launch {
            connectivityObserver.status.collectLatest { status ->
                isOnline = status == NetworkStatus.Available

                // Update the scorm-again API with current online status
                updateOnlineStatus(isOnline)

                // Try to sync when coming back online
                if (isOnline) {
                    syncOfflineData()
                }
            }
        }
    }

    private fun setupJavaScriptBridge() {
        webViewController.addJavaScriptInterface("ScormBridge") { message ->
            handleScormMessage(message)
        }
    }

    private fun handleScormMessage(messageJson: String) {
        try {
            val message = json.decodeFromString<ScormMessage>(messageJson)

            when (message.type) {
                "log" -> {
                    onLogMessage?.invoke(message.message ?: "", message.level ?: 0)
                }
                "sync" -> {
                    val success = message.status == "success"
                    onSyncComplete?.invoke(success)
                }
                "setValue" -> {
                    // Store data locally for offline support
                    message.key?.let { key ->
                        message.value?.let { value ->
                            scope.launch {
                                repository.saveData(courseId, key, value, synced = isOnline)
                            }
                        }
                    }
                }
            }
        } catch (e: Exception) {
            onLogMessage?.invoke("Error parsing SCORM message: ${e.message}", 1)
        }
    }

    fun injectScormAgain() {
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
                        window.ScormBridge.postMessage(JSON.stringify({
                            type: 'log',
                            message: message,
                            level: level
                        }));
                    }
                });

                window.API.on('OfflineDataSynced', function() {
                    window.ScormBridge.postMessage(JSON.stringify({
                        type: 'sync',
                        status: 'success'
                    }));
                });

                // TODO: This will be replaced with the new event API pattern in a future update
                window.API._offlineStorageService.isDeviceOnline = function() {
                    return $isOnline;
                };
            };
            document.head.appendChild(scormAgainScript);
        """.trimIndent()

        webViewController.evaluateJavaScript(js)
    }

    private fun updateOnlineStatus(online: Boolean) {
        val js = """
            if (window.API && window.API._offlineStorageService) {
                window.API._offlineStorageService.isDeviceOnline = function() {
                    return $online;
                };
            }
        """.trimIndent()

        webViewController.evaluateJavaScript(js)
    }

    fun syncOfflineData() {
        if (!isOnline) return

        val js = """
            if (window.API && window.API._offlineStorageService) {
                window.API._offlineStorageService.syncOfflineData().then(function(success) {
                    window.ScormBridge.postMessage(JSON.stringify({
                        type: 'sync',
                        status: success ? 'success' : 'failed'
                    }));
                });
            }
        """.trimIndent()

        webViewController.evaluateJavaScript(js)
    }

    fun setOnSyncComplete(callback: (Boolean) -> Unit) {
        onSyncComplete = callback
    }

    fun setOnLogMessage(callback: (String, Int) -> Unit) {
        onLogMessage = callback
    }

    fun isCurrentlyOnline(): Boolean = isOnline
}
```

### 5. File Management

Create platform-specific file management utilities:

```kotlin
// shared/src/commonMain/kotlin/storage/FileManager.kt
package storage

expect class FileManager {
    fun getScormApiPath(): String
    fun getCourseDirectory(courseId: String): String
    fun getCourseUrl(courseId: String): String
    fun isCourseAvailable(courseId: String): Boolean
}
```

```kotlin
// shared/src/androidMain/kotlin/storage/FileManager.android.kt
package storage

import android.content.Context
import android.os.Environment
import java.io.File
import java.io.FileOutputStream

actual class FileManager(
    private val context: Context
) {
    companion object {
        private const val SCORM_API_ASSET = "scorm-again/api/scorm-again.js"
        private const val EXTERNAL_SCORM_DIR = "ScormContent"
    }

    private val baseDir: File
        get() {
            val dir = File(
                Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS),
                EXTERNAL_SCORM_DIR
            )
            if (!dir.exists()) dir.mkdirs()
            return dir
        }

    actual fun getScormApiPath(): String {
        val apiDir = File(baseDir, "api")
        if (!apiDir.exists()) apiDir.mkdirs()

        val apiFile = File(apiDir, "scorm-again.js")
        if (!apiFile.exists()) {
            context.assets.open(SCORM_API_ASSET).use { input ->
                FileOutputStream(apiFile).use { output ->
                    input.copyTo(output)
                }
            }
        }

        return "file://${apiFile.absolutePath}"
    }

    actual fun getCourseDirectory(courseId: String): String {
        val courseDir = File(baseDir, "courses/$courseId")
        if (!courseDir.exists()) courseDir.mkdirs()
        return courseDir.absolutePath
    }

    actual fun getCourseUrl(courseId: String): String {
        return "file://${getCourseDirectory(courseId)}/index.html"
    }

    actual fun isCourseAvailable(courseId: String): Boolean {
        val indexFile = File(getCourseDirectory(courseId), "index.html")
        return indexFile.exists()
    }
}
```

```kotlin
// shared/src/iosMain/kotlin/storage/FileManager.ios.kt
package storage

import platform.Foundation.NSBundle
import platform.Foundation.NSDocumentDirectory
import platform.Foundation.NSFileManager
import platform.Foundation.NSURL
import platform.Foundation.NSUserDomainMask

actual class FileManager {

    private val fileManager = NSFileManager.defaultManager

    private val documentsDirectory: String
        get() {
            val paths = NSFileManager.defaultManager.URLsForDirectory(
                NSDocumentDirectory,
                NSUserDomainMask
            )
            return (paths.firstOrNull() as? NSURL)?.path ?: ""
        }

    private val scormBaseDir: String
        get() {
            val dir = "$documentsDirectory/ScormContent"
            if (!fileManager.fileExistsAtPath(dir)) {
                fileManager.createDirectoryAtPath(dir, true, null, null)
            }
            return dir
        }

    actual fun getScormApiPath(): String {
        // Copy from bundle to documents if needed
        val apiDir = "$scormBaseDir/api"
        if (!fileManager.fileExistsAtPath(apiDir)) {
            fileManager.createDirectoryAtPath(apiDir, true, null, null)
        }

        val apiFile = "$apiDir/scorm-again.js"
        if (!fileManager.fileExistsAtPath(apiFile)) {
            val bundlePath = NSBundle.mainBundle.pathForResource(
                "scorm-again/api/scorm-again",
                "js"
            )
            bundlePath?.let {
                fileManager.copyItemAtPath(it, apiFile, null)
            }
        }

        return "file://$apiFile"
    }

    actual fun getCourseDirectory(courseId: String): String {
        val courseDir = "$scormBaseDir/courses/$courseId"
        if (!fileManager.fileExistsAtPath(courseDir)) {
            fileManager.createDirectoryAtPath(courseDir, true, null, null)
        }
        return courseDir
    }

    actual fun getCourseUrl(courseId: String): String {
        return "file://${getCourseDirectory(courseId)}/index.html"
    }

    actual fun isCourseAvailable(courseId: String): Boolean {
        val indexPath = "${getCourseDirectory(courseId)}/index.html"
        return fileManager.fileExistsAtPath(indexPath)
    }
}
```

## Platform-Specific Usage

### Android App

```kotlin
// androidApp/src/main/java/.../ScormPlayerActivity.kt
package com.example.scormplayer.android

import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import connectivity.ConnectivityObserverFactory
import db.DatabaseDriverFactory
import db.ScormDataRepository
import scorm.ScormPlayerManager
import storage.FileManager
import web.WebViewDelegate
import web.WebViewFactory

class ScormPlayerActivity : ComponentActivity() {

    private lateinit var scormManager: ScormPlayerManager
    private val courseId = "course1"

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize dependencies
        val fileManager = FileManager(this)
        val connectivityFactory = ConnectivityObserverFactory(this)
        val dbFactory = DatabaseDriverFactory(this)
        val repository = ScormDataRepository(dbFactory)
        val webViewFactory = WebViewFactory(this)

        // Create WebView with delegate
        val webViewController = webViewFactory.create(object : WebViewDelegate {
            override fun onPageFinished(url: String) {
                scormManager.injectScormAgain()
            }

            override fun onError(error: String) {
                Toast.makeText(this@ScormPlayerActivity, error, Toast.LENGTH_LONG).show()
            }
        })

        // Set content view with the WebView
        val androidWebView = (webViewController as? web.AndroidWebViewController)?.webView
        setContentView(androidWebView)

        // Initialize SCORM manager
        scormManager = ScormPlayerManager(
            webViewController = webViewController,
            connectivityObserver = connectivityFactory.create(),
            repository = repository,
            courseId = courseId,
            apiPath = fileManager.getScormApiPath(),
            scope = lifecycleScope
        )

        // Set up callbacks
        scormManager.setOnSyncComplete { success ->
            val message = if (success) "Data synced successfully" else "Sync failed"
            Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
        }

        scormManager.setOnLogMessage { message, level ->
            if (level >= 3) { // Error or warning
                Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
            }
        }

        // Load course
        if (fileManager.isCourseAvailable(courseId)) {
            webViewController.loadUrl(fileManager.getCourseUrl(courseId))
        } else {
            Toast.makeText(this, "Course not found", Toast.LENGTH_LONG).show()
        }
    }
}
```

### iOS App (SwiftUI)

```swift
// iosApp/iosApp/ScormPlayerView.swift
import SwiftUI
import WebKit
import shared

struct ScormPlayerView: View {
    @StateObject private var viewModel = ScormPlayerViewModel()

    var body: some View {
        VStack {
            HStack {
                Text("SCORM Player")
                    .font(.headline)
                Spacer()
                Image(systemName: viewModel.isOnline ? "wifi" : "wifi.slash")
                Button(action: { viewModel.syncData() }) {
                    Image(systemName: "arrow.triangle.2.circlepath")
                }
                .disabled(!viewModel.isOnline)
            }
            .padding()

            WebViewWrapper(webView: viewModel.webView)
        }
        .onAppear {
            viewModel.loadCourse()
        }
        .alert("Sync Status", isPresented: $viewModel.showSyncAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(viewModel.syncMessage)
        }
    }
}

class ScormPlayerViewModel: ObservableObject {
    @Published var isOnline = true
    @Published var showSyncAlert = false
    @Published var syncMessage = ""

    let courseId = "course1"

    private let fileManager = FileManager_()
    private let connectivityFactory = ConnectivityObserverFactory()
    private let dbFactory = DatabaseDriverFactory()
    private var scormManager: ScormPlayerManager?

    private(set) var webView: WKWebView

    init() {
        let repository = ScormDataRepository(driverFactory: dbFactory)

        let delegate = WebViewDelegateImpl()
        let webViewController = WebViewFactory().create(delegate: delegate)
        self.webView = (webViewController as! IOSWebViewController).webView

        self.scormManager = ScormPlayerManager(
            webViewController: webViewController,
            connectivityObserver: connectivityFactory.create(),
            repository: repository,
            courseId: courseId,
            apiPath: fileManager.getScormApiPath(),
            scope: MainScope()
        )

        delegate.onPageFinished = { [weak self] _ in
            self?.scormManager?.injectScormAgain()
        }

        scormManager?.setOnSyncComplete { [weak self] success in
            DispatchQueue.main.async {
                self?.syncMessage = success ? "Data synced successfully" : "Sync failed"
                self?.showSyncAlert = true
            }
        }
    }

    func loadCourse() {
        if fileManager.isCourseAvailable(courseId: courseId) {
            let url = fileManager.getCourseUrl(courseId: courseId)
            if let nsUrl = URL(string: url) {
                webView.load(URLRequest(url: nsUrl))
            }
        }
    }

    func syncData() {
        scormManager?.syncOfflineData()
    }
}

class WebViewDelegateImpl: WebViewDelegate {
    var onPageFinished: ((String) -> Void)?

    func onPageFinished(url: String) {
        onPageFinished?(url)
    }

    func onError(error: String) {
        print("WebView error: \(error)")
    }
}

struct WebViewWrapper: UIViewRepresentable {
    let webView: WKWebView

    func makeUIView(context: Context) -> WKWebView {
        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {}
}
```

## Important: Local HTTP Server Recommended

For best compatibility with SCORM packages, serve content through a local HTTP server rather than using `file://` URLs directly. This avoids CORS issues and ensures all JavaScript APIs work correctly.

### Android Local Server

Use NanoHTTPD or AndroidAsync:

```kotlin
// Add to build.gradle
implementation("org.nanohttpd:nanohttpd:2.3.1")
```

```kotlin
class LocalContentServer(
    port: Int,
    private val rootDir: File
) : NanoHTTPD(port) {

    override fun serve(session: IHTTPSession): Response {
        val uri = session.uri.removePrefix("/")
        val file = File(rootDir, uri)

        return if (file.exists() && file.isFile) {
            val mimeType = getMimeType(file.name)
            newFixedLengthResponse(
                Response.Status.OK,
                mimeType,
                FileInputStream(file),
                file.length()
            )
        } else {
            newFixedLengthResponse(Response.Status.NOT_FOUND, "text/plain", "Not found")
        }
    }

    private fun getMimeType(fileName: String): String = when {
        fileName.endsWith(".html") -> "text/html"
        fileName.endsWith(".js") -> "application/javascript"
        fileName.endsWith(".css") -> "text/css"
        fileName.endsWith(".json") -> "application/json"
        else -> "application/octet-stream"
    }
}
```

### iOS Local Server

Use GCDWebServer via CocoaPods or Swift Package Manager:

```swift
import GCDWebServer

class LocalContentServer {
    private let server = GCDWebServer()

    func start(rootPath: String) -> Int {
        server.addGETHandler(
            forBasePath: "/",
            directoryPath: rootPath,
            indexFilename: "index.html",
            cacheAge: 0,
            allowRangeRequests: true
        )

        try? server.start(options: [
            GCDWebServerOption_Port: 0,
            GCDWebServerOption_BindToLocalhost: true
        ])

        return Int(server.port)
    }

    func stop() {
        server.stop()
    }

    var baseURL: String {
        return "http://localhost:\(server.port)"
    }
}
```

## scorm-again Configuration

The scorm-again API is initialized with these key settings for offline support:

```javascript
{
  enableOfflineSupport: true,  // Enable offline capabilities
  courseId: 'courseId',        // Unique identifier for the course
  autocommit: true,            // Automatically commit data
  autocommitSeconds: 60,       // Commit interval in seconds
  syncOnInitialize: true,      // Try to sync when the API initializes
  syncOnTerminate: true,       // Try to sync when the API terminates
  logLevel: 4,                 // Detailed logging for debugging
}
```

## Key Features

### 1. Shared Business Logic

- Network connectivity monitoring works identically across platforms
- SCORM data persistence uses SQLDelight for cross-platform database access
- Synchronization logic is shared, reducing code duplication

### 2. Platform-Native WebViews

- Android uses native WebView with full JavaScript bridge support
- iOS uses WKWebView with WKScriptMessageHandler for communication
- Both implementations provide the same interface to shared code

### 3. Offline-First Architecture

- Data is stored locally using SQLDelight before syncing
- Network status changes trigger automatic sync attempts
- Offline data is preserved across app restarts

### 4. Type-Safe Communication

- Kotlin serialization ensures type safety for JavaScript bridge messages
- Shared data models work across all platforms

## Advanced Topics

### Using Compose Multiplatform for UI

If using Compose Multiplatform, you can create a shared composable:

```kotlin
// shared/src/commonMain/kotlin/ui/ScormPlayerScreen.kt
@Composable
expect fun ScormWebView(
    url: String,
    onPageFinished: () -> Unit,
    modifier: Modifier = Modifier
)
```

### Dependency Injection with Koin

Set up Koin for cross-platform DI:

```kotlin
// shared/src/commonMain/kotlin/di/KoinModule.kt
val sharedModule = module {
    single { ScormDataRepository(get()) }
    factory { (courseId: String) ->
        ScormPlayerManager(
            webViewController = get(),
            connectivityObserver = get(),
            repository = get(),
            courseId = courseId,
            apiPath = get<FileManager>().getScormApiPath()
        )
    }
}
```

## Security Considerations

### 1. Content Validation

```kotlin
// shared/src/commonMain/kotlin/storage/ScormValidator.kt
object ScormValidator {
    fun validatePackage(courseDir: String): Boolean {
        // Check for required SCORM files
        val requiredFiles = listOf("index.html", "imsmanifest.xml")
        return requiredFiles.all { file ->
            // Platform-specific file existence check
            true // Implement per platform
        }
    }
}
```

### 2. WebView Security

Restrict WebView navigation to local content only:

```kotlin
// In Android WebViewClient
override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
    return url?.startsWith("file://") != true
}
```

## Troubleshooting

### Common Issues

1. **WebView not loading local files**
   - Ensure file permissions are properly configured on Android
   - Verify file paths are correct for each platform
   - Check that `allowFileAccessFromFileURLs` is enabled on Android

2. **JavaScript bridge not working**
   - Verify interface names match between Kotlin and JavaScript
   - On iOS, ensure WKUserContentController is properly configured
   - Check for threading issues (UI updates must be on main thread)

3. **SQLDelight schema errors**
   - Run `./gradlew generateSqlDelightInterface` after schema changes
   - Verify database version migrations are handled

4. **iOS WKWebView content not loading**
   - Add App Transport Security exceptions for local content
   - Verify bundle resources are correctly copied

### Critical: SCORM API Not Found ("Unable to find an API adapter")

Many SCORM courses use a standard API discovery algorithm that searches `window.parent` for the API. In a WebView, `window.parent === window`, which causes the search to fail. Additionally, many courses declare `var API = null;` at global scope, overwriting any API you've set.

**Solution**: Inject JavaScript early before content loads to set up APIs and override `window.parent`:

#### Android

```kotlin
webView.webViewClient = object : WebViewClient() {
    override fun onPageStarted(view: WebView?, url: String?, favicon: Bitmap?) {
        super.onPageStarted(view, url, favicon)

        val jsCode = """
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
        """.trimIndent()

        view?.evaluateJavascript(jsCode, null)
    }
}
```

#### iOS

```swift
// Add user script to inject early
let script = WKUserScript(
    source: """
    // Initialize both SCORM APIs
    var apiSettings = { autocommit: true, logLevel: 4 };

    // SCORM 2004
    window.API_1484_11 = new window.Scorm2004API(apiSettings);

    // SCORM 1.2 with getter protection
    var scorm12Instance = new window.Scorm12API(apiSettings);
    window._scorm12APIInstance = scorm12Instance;
    Object.defineProperty(window, 'API', {
      get: function() { return window._scorm12APIInstance; },
      set: function(val) { },
      configurable: false
    });

    // Override window.parent
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
    """,
    injectionTime: .atDocumentStart,
    forMainFrameOnly: true
)

configuration.userContentController.addUserScript(script)
```

**Important**: Use the full `scorm-again.min.js` bundle (not `scorm2004.min.js`) to support both SCORM 1.2 and SCORM 2004 courses.

See [Troubleshooting Guide](troubleshooting.md#3a-scorm-api-not-found-in-webview-critical) for detailed explanation.

### Alerts Not Displaying

WebView dialogs may not show natively. Forward them to the native layer:

```javascript
window.alert = function(msg) {
  window.ScormBridge.postMessage(JSON.stringify({
    type: 'alert', message: String(msg)
  }));
};
```

Handle in your JavaScript bridge callback to show native alerts.

## Conclusion

Kotlin Multiplatform provides an excellent foundation for building cross-platform SCORM players with
offline support. By sharing business logic, network monitoring, and data persistence while using
platform-native WebViews, you can deliver a consistent learning experience across Android and iOS
with significantly reduced code duplication.

The architecture outlined in this guide follows KMP best practices, using expect/actual declarations
for platform-specific implementations while keeping the core SCORM handling logic shared. Combined
with scorm-again's offline capabilities, this approach enables robust mobile learning experiences
regardless of network connectivity.

## References

- [Kotlin Multiplatform Documentation](https://kotlinlang.org/docs/multiplatform/multiplatform-introduce-your-team.html)
- [Create a multiplatform app using Ktor and SQLDelight](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-ktor-sqldelight.html)
- [SQLDelight for KMP](https://medium.com/@michalankiersztajn/sqldelight-kmp-kotlin-multiplatform-tutorial-e39ab460a348)
- [Kotlin Multiplatform in 2025](https://treinetic.com/kotlin-multiplatform-in-2025/)
