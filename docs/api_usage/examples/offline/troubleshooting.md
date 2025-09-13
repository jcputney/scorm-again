# Offline SCORM Troubleshooting Guide

This guide helps you diagnose and fix common issues when implementing offline SCORM functionality with scorm-again.

## 🔍 Quick Diagnostics

### Check if Offline Support is Working

```javascript
// Test if offline support is enabled
console.log('Offline support enabled:', window.API._offlineStorageService ? 'Yes' : 'No');

// Check current online status
console.log('Device online:', navigator.onLine);

// Check if data is being stored offline
console.log('Offline items in storage:', Object.keys(localStorage).filter(key => key.includes('scorm_offline_')).length);

// Test sync functionality
if (window.API._offlineStorageService) {
  window.API._offlineStorageService.syncOfflineData().then(success => {
    console.log('Sync test result:', success ? 'Success' : 'Failed');
  });
}
```

## 🚨 Common Issues and Solutions

### 1. Offline Data Not Being Stored

**Symptoms:**
- Data disappears when going offline
- No items in localStorage with `scorm_offline_` prefix
- Console shows "Offline support not enabled"

**Solutions:**

```javascript
// ✅ Correct: Enable offline support
const api = new Scorm2004API({
  enableOfflineSupport: true,  // Must be true
  courseId: 'unique-course-id', // Must be provided
  autocommit: true
});

// ❌ Incorrect: Missing offline configuration
const api = new Scorm2004API({
  autocommit: true
  // Missing enableOfflineSupport and courseId
});
```

**Check localStorage permissions:**
```javascript
// Test if localStorage is available
try {
  localStorage.setItem('test', 'test');
  localStorage.removeItem('test');
  console.log('localStorage available');
} catch (e) {
  console.error('localStorage not available:', e);
}
```

### 2. Data Not Syncing When Back Online

**Symptoms:**
- Device shows as online but data doesn't sync
- Offline items remain in localStorage
- No network requests being made

**Solutions:**

```javascript
// ✅ Ensure proper online detection
window.addEventListener('online', () => {
  console.log('Device came online');
  if (window.API._offlineStorageService) {
    // Update the API's online status
    window.API._offlineStorageService.isDeviceOnline = () => true;
    // Trigger manual sync
    window.API._offlineStorageService.syncOfflineData();
  }
});

// ✅ For mobile apps, inject network status
function updateNetworkStatus(isOnline) {
  if (window.API && window.API._offlineStorageService) {
    window.API._offlineStorageService.isDeviceOnline = () => isOnline;
    if (isOnline) {
      window.API._offlineStorageService.syncOfflineData();
    }
  }
}
```

**Check LMS endpoint:**
```javascript
// Test if LMS endpoint is reachable
fetch('https://your-lms.com/api/scorm/commit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: true })
}).then(response => {
  console.log('LMS endpoint reachable:', response.ok);
}).catch(error => {
  console.error('LMS endpoint error:', error);
});
```

### 3. Mobile App WebView Issues

**Symptoms:**
- SCORM API not found in WebView
- JavaScript errors in mobile WebView
- Data not persisting between app sessions

**Solutions:**

**React Native:**
```jsx
// ✅ Correct WebView configuration
<WebView
  source={{ uri: 'your-scorm-content' }}
  javaScriptEnabled={true}
  domStorageEnabled={true}  // Essential for localStorage
  startInLoadingState={true}
  mixedContentMode="compatibility"
  allowsInlineMediaPlayback={true}
  onMessage={handleMessage}
/>
```

**Flutter:**
```dart
// ✅ Correct WebView setup
WebViewController()
  ..setJavaScriptMode(JavaScriptMode.unrestricted)
  ..setNavigationDelegate(NavigationDelegate(
    onPageFinished: (url) => injectScormAPI(),
  ))
  ..addJavaScriptChannel('ScormBridge',
    onMessageReceived: handleMessage)
```

**iOS Swift:**
```swift
// ✅ Correct WKWebView configuration
let config = WKWebViewConfiguration()
config.preferences.javaScriptEnabled = true
config.websiteDataStore = WKWebsiteDataStore.default()

let webView = WKWebView(frame: view.bounds, configuration: config)
```

### 4. External Storage Permission Issues

**Symptoms:**
- Cannot save courses to external storage
- Permission denied errors
- Files not accessible between app sessions

**Solutions:**

**Android (API 30+):**
```xml
<!-- Add to AndroidManifest.xml -->
<uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />

<application
    android:requestLegacyExternalStorage="true"
    android:preserveLegacyExternalStorage="true">
</application>
```

**iOS:**
```xml
<!-- Add to Info.plist -->
<key>NSDocumentsFolderUsageDescription</key>
<string>Access to documents is required to store SCORM courses</string>
```

**Runtime permission check:**
```javascript
// React Native
import { PermissionsAndroid } from 'react-native';

const requestStoragePermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};
```

### 5. CORS and Security Issues

**Symptoms:**
- Network requests blocked by CORS
- Content Security Policy violations
- Mixed content warnings

**Solutions:**

```javascript
// ✅ Configure proper CORS headers on your LMS
// Server-side (Express.js example)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// ✅ Use proper fetch configuration
const api = new Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
  fetchMode: 'cors',
  xhrHeaders: {
    'Content-Type': 'application/json'
  }
});
```

### 6. Large Course Content Issues

**Symptoms:**
- App crashes when loading large courses
- Out of memory errors
- Slow performance

**Solutions:**

```javascript
// ✅ Implement lazy loading
const loadCourseChunks = async (courseId) => {
  const chunkSize = 1024 * 1024; // 1MB chunks
  // Load course content in smaller pieces
  // Implementation depends on your storage strategy
};

// ✅ Use compression for stored data
const compressData = (data) => {
  // Use a compression library like pako or lz-string
  return LZString.compress(JSON.stringify(data));
};

// ✅ Clean up old course data
const cleanupOldCourses = () => {
  const maxCourses = 5;
  const courses = getStoredCourses();
  if (courses.length > maxCourses) {
    // Remove oldest courses
    courses.slice(maxCourses).forEach(course => {
      deleteCourse(course.id);
    });
  }
};
```

## 🔧 Debugging Tools

### Enable Debug Logging

```javascript
const api = new Scorm2004API({
  enableOfflineSupport: true,
  courseId: 'debug-course',
  logLevel: 1, // DEBUG level
  onLogMessage: (level, message) => {
    console.log(`[${level}] ${message}`);
    // Optionally send to remote logging service
  }
});
```

### Monitor Storage Usage

```javascript
function getStorageInfo() {
  const used = new Blob(Object.values(localStorage)).size;
  const quota = 5 * 1024 * 1024; // Typical 5MB limit

  return {
    used: used,
    quota: quota,
    percentage: (used / quota * 100).toFixed(2),
    available: quota - used
  };
}

console.log('Storage info:', getStorageInfo());
```

### Test Network Simulation

```javascript
// Simulate going offline/online for testing
function simulateOffline() {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: false
  });
  window.dispatchEvent(new Event('offline'));
}

function simulateOnline() {
  Object.defineProperty(navigator, 'onLine', {
    writable: true,
    value: true
  });
  window.dispatchEvent(new Event('online'));
}
```

## 📱 Platform-Specific Issues

### React Native

**Issue:** Metro bundler can't resolve scorm-again modules
```javascript
// ✅ Solution: Add to metro.config.js
module.exports = {
  resolver: {
    alias: {
      'scorm-again': require.resolve('scorm-again/dist/scorm-again.js'),
    },
  },
};
```

### Flutter

**Issue:** WebView not loading local files
```dart
// ✅ Solution: Use proper file:// URLs
String getLocalFileUrl(String filePath) {
  return Platform.isAndroid
    ? 'file:///android_asset/$filePath'
    : 'file://$filePath';
}
```

### iOS

**Issue:** WKWebView localStorage not persisting
```swift
// ✅ Solution: Configure data store properly
let config = WKWebViewConfiguration()
config.websiteDataStore = WKWebsiteDataStore.default()

// Ensure data persists
let dataStore = config.websiteDataStore
dataStore.httpCookieStore.setCookie(cookie) { /* completion */ }
```

### Android

**Issue:** WebView localStorage cleared on app restart
```kotlin
// ✅ Solution: Enable database storage
webView.settings.apply {
    javaScriptEnabled = true
    domStorageEnabled = true
    databaseEnabled = true
    setAppCacheEnabled(true)
}
```

## 🧪 Testing Strategies

### Automated Testing

```javascript
// Test offline functionality
describe('Offline SCORM', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();

    // Initialize API
    window.API = new Scorm2004API({
      enableOfflineSupport: true,
      courseId: 'test-course'
    });
  });

  it('should store data offline', () => {
    // Simulate offline
    simulateOffline();

    // Set SCORM data
    window.API.SetValue('cmi.completion_status', 'completed');
    window.API.Commit('');

    // Check localStorage
    const offlineKeys = Object.keys(localStorage)
      .filter(key => key.includes('scorm_offline_'));
    expect(offlineKeys.length).toBeGreaterThan(0);
  });

  it('should sync when online', async () => {
    // Add offline data
    localStorage.setItem('scorm_offline_test', JSON.stringify({
      data: { 'cmi.completion_status': 'completed' },
      timestamp: Date.now()
    }));

    // Simulate going online
    simulateOnline();

    // Wait for sync
    await window.API._offlineStorageService.syncOfflineData();

    // Check that offline data was cleared
    expect(localStorage.getItem('scorm_offline_test')).toBeNull();
  });
});
```

### Manual Testing Checklist

- [ ] Data persists when going offline
- [ ] Data syncs when coming back online
- [ ] App works without internet connection
- [ ] Large courses load without crashing
- [ ] Permissions are properly requested
- [ ] WebView configuration is correct
- [ ] Error handling works as expected
- [ ] Performance is acceptable

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the console** for error messages
2. **Enable debug logging** to see detailed information
3. **Review the platform-specific examples** for your framework
4. **Create a minimal reproduction** of the issue
5. **Open an issue** on GitHub with:
   - Platform and version information
   - Steps to reproduce
   - Console logs and error messages
   - Minimal code example

## 🔗 Additional Resources

- [Quick Start Templates](quick_start_templates.md) - Minimal working examples
- [React Native Example](react_native.md) - Complete implementation
- [Flutter Example](flutter.md) - Dart implementation
- [iOS Example](ios_native.md) - Swift implementation
- [Android Example](native_android.md) - Kotlin implementation
