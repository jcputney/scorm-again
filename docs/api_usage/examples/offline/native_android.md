# Using scorm-again with Native Android for Offline Learning

This guide demonstrates how to implement SCORM content in a native Android application with offline support using scorm-again.

## Prerequisites

- Android Studio
- Basic knowledge of Android development
- Understanding of SCORM packages

## Project Setup

### 1. Configure Your Android Project

Create a new Android project or use an existing one. Make sure your `build.gradle` file includes the necessary dependencies:

```gradle
// app/build.gradle
dependencies {
    // WebView dependencies
    implementation 'androidx.webkit:webkit:1.8.0'
    
    // For network connectivity monitoring
    implementation 'androidx.core:core-ktx:1.12.0'
    
    // Zip handling (for extracting SCORM packages)
    implementation 'net.lingala.zip4j:zip4j:2.11.5'
    
    // Lifecycle components
    implementation 'androidx.lifecycle:lifecycle-runtime-ktx:2.6.2'
    implementation 'androidx.lifecycle:lifecycle-viewmodel-ktx:2.6.2'
}
```

### 2. Add Necessary Permissions

Modify your `AndroidManifest.xml` to include permissions for internet access and external storage:

```xml
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- For API level 28 and below -->
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    
    <application
        ...
        android:requestLegacyExternalStorage="true">
        ...
    </application>
</manifest>
```

### 3. Create Directory Structure for Assets

Place the scorm-again.js file in your assets folder:

```
/app/src/main/assets
  /scorm-again
    /api
      scorm-again.js
```

## Implementation

### 1. Create a Network Connectivity Monitor

This class will help track the device's online/offline status:

```kotlin
import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow

class NetworkConnectivityMonitor(private val context: Context) {
    private val connectivityManager = 
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    
    fun isNetworkAvailable(): Boolean {
        val network = connectivityManager.activeNetwork
        val capabilities = connectivityManager.getNetworkCapabilities(network)
        return capabilities != null && (
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
            capabilities.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR)
        )
    }
    
    fun observeNetworkConnectivity(): Flow<Boolean> = callbackFlow {
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

### 2. Create a SCORM File Manager

This class handles file operations for your SCORM content:

```kotlin
import android.content.Context
import android.os.Environment
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import net.lingala.zip4j.ZipFile
import java.io.File
import java.io.FileOutputStream

class ScormFileManager(private val context: Context) {
    companion object {
        private const val SCORM_API_ASSET_PATH = "scorm-again/api/scorm-again.js"
        private const val EXTERNAL_SCORM_DIR = "ScormContent"
    }
    
    // Base directory for storing SCORM content
    fun getScormBaseDirectory(): File {
        val baseDir = File(
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOCUMENTS),
            EXTERNAL_SCORM_DIR
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
    
    // Get the API path
    fun getScormApiPath(): String {
        val apiFile = copyScormApiToExternal()
        return "file://${apiFile.absolutePath}"
    }
    
    // Get the course URL for WebView loading
    fun getCourseUrl(courseId: String): String {
        return "file://${getCourseDirectory(courseId).absolutePath}/index.html"
    }
    
    // Copy the SCORM API from assets to external storage
    private fun copyScormApiToExternal(): File {
        val apiDir = File(getScormBaseDirectory(), "api")
        if (!apiDir.exists()) {
            apiDir.mkdirs()
        }
        
        val apiFile = File(apiDir, "scorm-again.js")
        if (!apiFile.exists()) {
            context.assets.open(SCORM_API_ASSET_PATH).use { input ->
                FileOutputStream(apiFile).use { output ->
                    input.copyTo(output)
                }
            }
        }
        
        return apiFile
    }
    
    // Extract a SCORM package to the course directory
    suspend fun extractScormPackage(courseId: String, zipFilePath: String): Boolean = withContext(Dispatchers.IO) {
        try {
            val courseDir = getCourseDirectory(courseId)
            // Clear existing content if needed
            if (courseDir.exists() && courseDir.listFiles()?.isNotEmpty() == true) {
                courseDir.deleteRecursively()
                courseDir.mkdirs()
            }
            
            // Extract the zip file
            ZipFile(zipFilePath).extractAll(courseDir.absolutePath)
            
            // Verify extraction worked (check for index.html)
            return@withContext File(courseDir, "index.html").exists()
        } catch (e: Exception) {
            e.printStackTrace()
            return@withContext false
        }
    }
    
    // Check if a course is already extracted
    fun isCourseExtracted(courseId: String): Boolean {
        val courseDir = getCourseDirectory(courseId)
        return courseDir.exists() && 
               File(courseDir, "index.html").exists()
    }
}
```

### 3. Create a SCORM WebView Wrapper

This class handles the WebView configuration and JavaScript interactions:

```kotlin
import android.annotation.SuppressLint
import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleObserver
import androidx.lifecycle.OnLifecycleEvent
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import org.json.JSONObject

class ScormWebViewWrapper(
    private val context: Context,
    private val webView: WebView,
    private val lifecycle: Lifecycle
) : LifecycleObserver {
    
    init {
        lifecycle.addObserver(this)
        setupWebView()
    }
    
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
        
        webView.addJavascriptInterface(jsInterface, "AndroidBridge")
        
        awaitClose {
            webView.removeJavascriptInterface("AndroidBridge")
        }
    }
    
    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
        }
        
        webView.webChromeClient = WebChromeClient()
        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // You can add additional functionality here when the page loads
            }
        }
    }
    
    fun loadCourse(courseUrl: String) {
        webView.loadUrl(courseUrl)
    }
    
    fun injectScormAgain(apiPath: String, courseId: String, isOnline: Boolean) {
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
                        window.AndroidBridge.postMessage(JSON.stringify({
                            type: 'log',
                            message: message,
                            level: level
                        }));
                    }
                });
                
                window.API.on('OfflineDataSynced', function() {
                    window.AndroidBridge.postMessage(JSON.stringify({
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
    
    fun syncOfflineData() {
        val js = """
            if (window.API && window.API._offlineStorageService) {
                window.API._offlineStorageService.syncOfflineData().then(function(success) {
                    window.AndroidBridge.postMessage(JSON.stringify({
                        type: 'sync',
                        status: success ? 'success' : 'failed'
                    }));
                });
            }
        """.trimIndent()
        
        webView.evaluateJavascript(js, null)
    }
    
    fun getMessages(): Flow<ScormMessage> = messageFlow
    
    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun cleanup() {
        webView.loadUrl("about:blank")
    }
}

sealed class ScormMessage {
    data class Log(val message: String, val level: Int) : ScormMessage()
    data class Sync(val success: Boolean) : ScormMessage()
    data class Error(val message: String) : ScormMessage()
}
```

### 4. Create a ViewModel for SCORM Player

```kotlin
import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch

class ScormPlayerViewModel(
    application: Application,
    private val courseId: String
) : AndroidViewModel(application) {
    
    private val fileManager = ScormFileManager(application)
    private val networkMonitor = NetworkConnectivityMonitor(application)
    
    private val _state = MutableStateFlow<ScormPlayerState>(ScormPlayerState.Loading)
    val state: StateFlow<ScormPlayerState> = _state
    
    private val _isOnline = MutableStateFlow(true)
    val isOnline: StateFlow<Boolean> = _isOnline
    
    init {
        viewModelScope.launch {
            // Monitor network connectivity
            networkMonitor.observeNetworkConnectivity().collect { isConnected ->
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
            // Check if course is already extracted
            if (fileManager.isCourseExtracted(courseId)) {
                val apiPath = fileManager.getScormApiPath()
                val coursePath = fileManager.getCourseUrl(courseId)
                
                _state.value = ScormPlayerState.Ready(
                    apiPath = apiPath,
                    coursePath = coursePath
                )
            } else {
                _state.value = ScormPlayerState.NeedsDownload
            }
        } catch (e: Exception) {
            _state.value = ScormPlayerState.Error(e.message ?: "Unknown error")
        }
    }
    
    fun extractCourse(zipFilePath: String) {
        viewModelScope.launch {
            _state.value = ScormPlayerState.Loading
            
            val extractResult = fileManager.extractScormPackage(courseId, zipFilePath)
            
            if (extractResult) {
                val apiPath = fileManager.getScormApiPath()
                val coursePath = fileManager.getCourseUrl(courseId)
                
                _state.value = ScormPlayerState.Ready(
                    apiPath = apiPath,
                    coursePath = coursePath
                )
            } else {
                _state.value = ScormPlayerState.Error("Failed to extract SCORM package")
            }
        }
    }
    
    fun syncOfflineData(webView: ScormWebViewWrapper) {
        if (_isOnline.value) {
            webView.syncOfflineData()
        }
    }
}

sealed class ScormPlayerState {
    object Loading : ScormPlayerState()
    object NeedsDownload : ScormPlayerState()
    data class Ready(val apiPath: String, val coursePath: String) : ScormPlayerState()
    data class Error(val message: String) : ScormPlayerState()
}
```

### 5. Create the SCORM Player Activity

```kotlin
import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.webkit.WebView
import android.widget.Toast
import androidx.activity.viewModels
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch

class ScormPlayerActivity : AppCompatActivity() {
    
    companion object {
        private const val PERMISSIONS_REQUEST_CODE = 100
        private const val COURSE_ID_EXTRA = "course_id"
        private const val ZIP_PATH_EXTRA = "zip_path"
    }
    
    private lateinit var webView: WebView
    private lateinit var scormWebViewWrapper: ScormWebViewWrapper
    
    private val viewModel: ScormPlayerViewModel by viewModels {
        val courseId = intent.getStringExtra(COURSE_ID_EXTRA) ?: "default_course"
        ScormPlayerViewModelFactory(application, courseId)
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Set the layout
        setContentView(R.layout.activity_scorm_player)
        
        // Request permissions if needed
        requestPermissionsIfNeeded()
        
        // Initialize WebView
        webView = findViewById(R.id.webView)
        scormWebViewWrapper = ScormWebViewWrapper(this, webView, lifecycle)
        
        // Observe ViewModel states
        observeViewModelState()
        
        // Extract the course if zip path was provided
        intent.getStringExtra(ZIP_PATH_EXTRA)?.let { zipPath ->
            viewModel.extractCourse(zipPath)
        }
        
        // Observe WebView messages
        lifecycleScope.launch {
            scormWebViewWrapper.getMessages().collect { message ->
                handleScormMessage(message)
            }
        }
    }
    
    private fun handleScormMessage(message: ScormMessage) {
        when (message) {
            is ScormMessage.Log -> {
                // Log SCORM messages
                if (message.level >= 3) { // Error or warning
                    Toast.makeText(this, message.message, Toast.LENGTH_SHORT).show()
                }
            }
            is ScormMessage.Sync -> {
                val messageText = if (message.success) {
                    "SCORM data synchronized successfully"
                } else {
                    "Failed to synchronize some SCORM data"
                }
                Toast.makeText(this, messageText, Toast.LENGTH_SHORT).show()
            }
            is ScormMessage.Error -> {
                Toast.makeText(this, message.message, Toast.LENGTH_SHORT).show()
            }
        }
    }
    
    private fun observeViewModelState() {
        lifecycleScope.launch {
            viewModel.state.collect { state ->
                when (state) {
                    is ScormPlayerState.Loading -> {
                        // Show loading indicator
                    }
                    is ScormPlayerState.NeedsDownload -> {
                        // Show download prompt or handle as needed
                        // For this example, we assume the ZIP is provided via intent
                    }
                    is ScormPlayerState.Ready -> {
                        // Load the course
                        scormWebViewWrapper.loadCourse(state.coursePath)
                        
                        // Wait for page to load, then inject scorm-again
                        webView.webViewClient = object : android.webkit.WebViewClient() {
                            override fun onPageFinished(view: WebView?, url: String?) {
                                super.onPageFinished(view, url)
                                
                                viewLifecycleScope.launch {
                                    viewModel.isOnline.collect { isOnline ->
                                        // Inject scorm-again with current online status
                                        scormWebViewWrapper.injectScormAgain(
                                            apiPath = state.apiPath,
                                            courseId = viewModel.courseId,
                                            isOnline = isOnline
                                        )
                                        
                                        // Try to sync when back online
                                        if (isOnline) {
                                            scormWebViewWrapper.syncOfflineData()
                                        }
                                    }
                                }
                            }
                        }
                    }
                    is ScormPlayerState.Error -> {
                        Toast.makeText(this@ScormPlayerActivity, state.message, Toast.LENGTH_LONG).show()
                    }
                }
            }
        }
    }
    
    private fun requestPermissionsIfNeeded() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(
                    this,
                    Manifest.permission.WRITE_EXTERNAL_STORAGE
                ) != PackageManager.PERMISSION_GRANTED
            ) {
                ActivityCompat.requestPermissions(
                    this,
                    arrayOf(
                        Manifest.permission.WRITE_EXTERNAL_STORAGE,
                        Manifest.permission.READ_EXTERNAL_STORAGE
                    ),
                    PERMISSIONS_REQUEST_CODE
                )
            }
        }
    }
    
    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<out String>,
        grantResults: IntArray
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == PERMISSIONS_REQUEST_CODE && grantResults.isNotEmpty() &&
            grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            // Permissions granted, reload the content
            viewModel.initializeScormContent()
        } else {
            // Permissions denied, show error
            Toast.makeText(
                this,
                "Storage permissions are required for offline SCORM content",
                Toast.LENGTH_LONG
            ).show()
            finish()
        }
    }
}

class ScormPlayerViewModelFactory(
    private val application: Application,
    private val courseId: String
) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(ScormPlayerViewModel::class.java)) {
            return ScormPlayerViewModel(application, courseId) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
```

### 6. Create the Layout XML

```xml
<!-- res/layout/activity_scorm_player.xml -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <WebView
        android:id="@+id/webView"
        android:layout_width="0dp"
        android:layout_height="0dp"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <ProgressBar
        android:id="@+id/progressBar"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:visibility="gone"
        app:layout_constraintBottom_toBottomOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

## Advanced Usage

### 1. Handling Downloaded SCORM Packages

To handle downloaded packages, create a download manager:

```kotlin
import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.os.Environment
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import java.io.File

class ScormDownloadManager(private val context: Context) {
    private val downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
    
    private val _downloadState = MutableStateFlow<DownloadState>(DownloadState.Idle)
    val downloadState: StateFlow<DownloadState> = _downloadState
    
    private var downloadId: Long = -1
    private var courseId: String = ""
    
    // Broadcast receiver to listen for download completion
    private val downloadReceiver = object : BroadcastReceiver() {
        override fun onReceive(context: Context?, intent: Intent?) {
            val id = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1)
            if (id == downloadId) {
                val query = DownloadManager.Query().setFilterById(downloadId)
                val cursor = downloadManager.query(query)
                
                if (cursor.moveToFirst()) {
                    val statusIndex = cursor.getColumnIndex(DownloadManager.COLUMN_STATUS)
                    val status = cursor.getInt(statusIndex)
                    
                    when (status) {
                        DownloadManager.STATUS_SUCCESSFUL -> {
                            val uriIndex = cursor.getColumnIndex(DownloadManager.COLUMN_LOCAL_URI)
                            val downloadedFileUri = cursor.getString(uriIndex)
                            val file = File(Uri.parse(downloadedFileUri).path!!)
                            
                            _downloadState.value = DownloadState.Completed(
                                courseId = courseId,
                                filePath = file.absolutePath
                            )
                        }
                        DownloadManager.STATUS_FAILED -> {
                            val reasonIndex = cursor.getColumnIndex(DownloadManager.COLUMN_REASON)
                            val reason = cursor.getInt(reasonIndex)
                            _downloadState.value = DownloadState.Failed("Download failed: $reason")
                        }
                    }
                }
                cursor.close()
                
                // Unregister after handling
                context?.unregisterReceiver(this)
            }
        }
    }
    
    fun downloadScormPackage(courseId: String, downloadUrl: String) {
        this.courseId = courseId
        
        // Register receiver for download completion
        context.registerReceiver(
            downloadReceiver,
            IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE)
        )
        
        // Create download request
        val request = DownloadManager.Request(Uri.parse(downloadUrl)).apply {
            setTitle("Downloading SCORM Course: $courseId")
            setDescription("Downloading learning content")
            setDestinationInExternalPublicDir(
                Environment.DIRECTORY_DOWNLOADS,
                "$courseId.zip"
            )
            setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
        }
        
        // Start download
        downloadId = downloadManager.enqueue(request)
        _downloadState.value = DownloadState.InProgress(downloadId)
    }
    
    // Cancel ongoing download
    fun cancelDownload() {
        if (downloadId != -1L) {
            downloadManager.remove(downloadId)
            _downloadState.value = DownloadState.Cancelled
        }
    }
}

sealed class DownloadState {
    object Idle : DownloadState()
    data class InProgress(val downloadId: Long) : DownloadState()
    data class Completed(val courseId: String, val filePath: String) : DownloadState()
    data class Failed(val reason: String) : DownloadState()
    object Cancelled : DownloadState()
}
```

### 2. Handling Scoped Storage (Android 10+)

For Android 10 and above, modify your code to comply with scoped storage:

```kotlin
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import androidx.annotation.RequiresApi

@RequiresApi(Build.VERSION_CODES.Q)
fun createScormDirectoryWithScopedStorage(context: Context, courseId: String): Uri? {
    val contentValues = ContentValues().apply {
        put(MediaStore.MediaColumns.DISPLAY_NAME, courseId)
        put(MediaStore.MediaColumns.MIME_TYPE, "application/zip")
        put(MediaStore.MediaColumns.RELATIVE_PATH, "Documents/ScormContent")
    }
    
    return context.contentResolver.insert(
        MediaStore.Files.getContentUri("external"),
        contentValues
    )
}
```

### 3. Enhanced File Management with Storage Access Framework

For more user control, implement SAF (Storage Access Framework):

```kotlin
import android.app.Activity
import android.content.Intent
import android.net.Uri
import androidx.activity.result.contract.ActivityResultContracts

// In your activity:
private val createDocumentLauncher = registerForActivityResult(
    ActivityResultContracts.StartActivityForResult()
) { result ->
    if (result.resultCode == Activity.RESULT_OK) {
        result.data?.data?.let { uri ->
            // Save URI permission for future access
            context.contentResolver.takePersistableUriPermission(
                uri,
                Intent.FLAG_GRANT_READ_URI_PERMISSION or Intent.FLAG_GRANT_WRITE_URI_PERMISSION
            )
            
            // Use the URI for file operations
            extractScormPackageToUri(uri, zipFilePath)
        }
    }
}

// Launch file picker
fun selectDestinationForScormPackage(courseId: String) {
    val intent = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
        addCategory(Intent.CATEGORY_OPENABLE)
        type = "application/zip"
        putExtra(Intent.EXTRA_TITLE, "$courseId.zip")
    }
    createDocumentLauncher.launch(intent)
}
```

## SCORM API Configuration

The scorm-again API is configured with these settings for offline support:

```javascript
{
  enableOfflineSupport: true,  // Enable offline capabilities
  courseId: 'courseId',        // Unique identifier for the course
  autocommit: true,            // Automatically commit data
  syncOnInitialize: true,      // Try to sync when the API initializes
  syncOnTerminate: true,       // Try to sync when the API terminates
  logLevel: 4,                 // Detailed logging for debugging
}
```

## Performance Considerations

### 1. Memory Management

- Implement proper lifecycle management for WebView
- Handle configuration changes appropriately
- Dispose of resources when the activity is destroyed

```kotlin
override fun onDestroy() {
    super.onDestroy()
    webView.destroy()
}
```

### 2. WebView Configuration Optimization

For better performance, consider these additional WebView settings:

```kotlin
webView.settings.apply {
    // Cache optimization
    cacheMode = WebSettings.LOAD_DEFAULT
    
    // Limit DOM storage size for large courses
    setDomStorageEnabled(true)
    
    // Disable features not needed
    blockNetworkImage = false
    loadsImagesAutomatically = true
    
    // Hardware acceleration
    setRenderPriority(WebSettings.RenderPriority.HIGH)
}
```

### 3. Large File Handling

For large SCORM packages, use chunked file operations:

```kotlin
private suspend fun unzipLargeFile(zipFilePath: String, destinationPath: String) = withContext(Dispatchers.IO) {
    val buffer = ByteArray(1024 * 8) // 8KB buffer
    
    ZipFile(zipFilePath).use { zipFile ->
        val entries = zipFile.entries
        while (entries.hasMoreElements()) {
            val entry = entries.nextElement()
            val entryPath = File(destinationPath, entry.name)
            
            // Create parent directories if needed
            entryPath.parentFile?.mkdirs()
            
            if (!entry.isDirectory) {
                zipFile.getInputStream(entry).use { input ->
                    FileOutputStream(entryPath).use { output ->
                        var len: Int
                        while (input.read(buffer).also { len = it } > 0) {
                            output.write(buffer, 0, len)
                            // Allow cancellation check here
                            yield()
                        }
                    }
                }
            }
        }
    }
}
```

## Security Considerations

### 1. Content Validation

Always validate SCORM packages before loading them:

```kotlin
fun validateScormPackage(courseDir: File): Boolean {
    val manifestFile = File(courseDir, "imsmanifest.xml")
    val indexFile = File(courseDir, "index.html")
    
    if (!manifestFile.exists() || !indexFile.exists()) {
        return false
    }
    
    try {
        // Parse the manifest to validate SCORM version and structure
        val manifestContent = manifestFile.readText()
        return manifestContent.contains("adlcp:scormType") || 
               manifestContent.contains("imsss:sequencing")
    } catch (e: Exception) {
        return false
    }
}
```

### 2. WebView Security

Implement additional security measures for WebView:

```kotlin
// Restrict WebView to only access the course directory
webView.webViewClient = object : WebViewClient() {
    override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
        url?.let {
            if (!it.startsWith("file:///") || 
                !it.contains(courseId)) {
                // Block navigation to external resources
                return true
            }
        }
        return false
    }
}
```

## Troubleshooting

### Common Issues and Solutions

1. **WebView not loading local files**
   - Check file permissions
   - Verify correct file:// path formatting
   - Ensure WebView settings allow file access

2. **JavaScript communication problems**
   - Verify JavascriptInterface is properly added
   - Check that method has @JavascriptInterface annotation
   - Ensure method parameters match JavaScript call

3. **Storage permission issues**
   - For Android 6+: Request permissions at runtime
   - For Android 10+: Use Storage Access Framework
   - For Android 11+: Consider using MediaStore API

4. **Offline data not syncing**
   - Check network connectivity monitoring
   - Verify scorm-again configurations
   - Inspect JavaScript console logs for errors

## Conclusion

This native Android implementation provides a robust solution for implementing SCORM content with offline support. By utilizing the Android WebView with the scorm-again library and implementing proper file and network management, you can deliver a seamless learning experience even when users are offline. The implementation handles course downloading, storage, and synchronization in a way that works across different Android versions and respects modern storage requirements. 