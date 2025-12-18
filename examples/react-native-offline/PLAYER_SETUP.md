# SCORM Player Setup

## Overview

The SCORM Player screen (`app/player/[courseId].tsx`) displays SCORM content in a WebView and integrates with scorm-again for offline support.

## Features

### 1. Header Bar
- **Back Button**: Confirms before exiting the course
- **Course Title**: Displays the course name (loaded from courseId)
- **Network Status Icon**: Shows wifi (online) or wifi-off (offline)
- **Sync Indicator**: Animated spinner when syncing data

### 2. WebView Integration
- Loads course index.html from local filesystem
- Injects scorm-again.js before content loads
- Configures SCORM API with offline support enabled
- Proper file access permissions for local content

### 3. Network Status Bridge
- Monitors network using `@react-native-community/netinfo`
- Dispatches `scorm-again:network-status` custom event to WebView
- Updates UI in real-time when network status changes

### 4. Communication Bridge
- Receives postMessage from WebView for:
  - Log messages from scorm-again
  - Sync status updates (OfflineDataSyncing, OfflineDataSynced, OfflineDataSyncFailed)
- Shows alerts on successful/failed sync

## File Structure

```
app/player/[courseId].tsx          # Main player screen
src/components/SyncIndicator.tsx   # Animated sync icon component
assets/scorm-again/                # scorm-again library
  scorm2004.min.js                 # SCORM 2004 API implementation
assets/courses/                    # Downloaded courses
  [courseId]/                      # Each course in its own directory
    index.html                     # Course entry point
    imsmanifest.xml               # SCORM manifest
    ...                           # Course files
```

## SCORM API Initialization

The player injects the following JavaScript before the course content loads:

```javascript
// Load scorm-again.js
var scormScript = document.createElement('script');
scormScript.src = 'file://[path-to-scorm2004.min.js]';

scormScript.onload = function() {
  // Initialize SCORM 2004 API with offline support
  window.API_1484_11 = new window.Scorm2004API({
    enableOfflineSupport: true,
    courseId: '[courseId]',
    autocommit: true,
    autocommitSeconds: 60,
    logLevel: 4,
    lmsCommitUrl: 'http://localhost:3000/api/scorm/commit',
  });

  // Listen for sync events
  window.API_1484_11.on('OfflineDataSyncing', function() { ... });
  window.API_1484_11.on('OfflineDataSynced', function() { ... });
  window.API_1484_11.on('OfflineDataSyncFailed', function(error) { ... });
};

document.head.appendChild(scormScript);
```

## WebView Configuration

The WebView is configured with these essential props:

```javascript
<WebView
  javaScriptEnabled={true}
  domStorageEnabled={true}
  allowFileAccess={true}
  allowFileAccessFromFileURLs={true}
  allowUniversalAccessFromFileURLs={true}
  source={{ uri: `file://${coursePath}/index.html` }}
  injectedJavaScriptBeforeContentLoaded={getInjectionScript()}
  originWhitelist={['*']}
  mixedContentMode="always"
  mediaPlaybackRequiresUserAction={false}
/>
```

## Network Status Updates

The player listens to network changes and dispatches events to the WebView:

```javascript
NetInfo.addEventListener((state) => {
  const online = state.isConnected ?? false;

  // Dispatch to WebView
  webViewRef.current.injectJavaScript(`
    window.dispatchEvent(new CustomEvent('scorm-again:network-status', {
      detail: { online: ${online} }
    }));
  `);
});
```

The scorm-again library automatically listens for this event and triggers sync when coming back online.

## Error Handling

The player handles several error scenarios:

1. **Course Not Found**: Shows error screen if courseId doesn't exist
2. **Missing index.html**: Shows error if course entry point is missing
3. **Missing SCORM Library**: Shows error if scorm2004.min.js not found
4. **WebView Errors**: Logs errors and shows alert to user

## Building for Production

1. Ensure scorm2004.min.js is copied to assets/scorm-again/ during build:
   ```bash
   cp dist/scorm2004.min.js examples/react-native-offline/assets/scorm-again/
   ```

2. For Expo builds, the asset will be bundled automatically

3. For native builds, ensure the file is included in the bundle

## Testing

1. Launch the app in development mode:
   ```bash
   cd examples/react-native-offline
   npm start
   ```

2. Navigate to a course using the player:
   ```
   /player/minimal-test
   ```

3. Test offline functionality:
   - Enable airplane mode
   - Interact with course
   - Disable airplane mode
   - Verify sync occurs

4. Check logs:
   - React Native logs show network status changes
   - WebView console logs are forwarded to React Native
   - SCORM API calls are logged at level 4

## Customization

### Change SCORM Version

To use SCORM 1.2 instead:

1. Copy scorm12.min.js to assets:
   ```bash
   cp dist/scorm12.min.js examples/react-native-offline/assets/scorm-again/
   ```

2. Update the injection script to use `Scorm12API` and `window.API`

### Adjust Autocommit

Change autocommit settings in the injection script:

```javascript
window.API_1484_11 = new window.Scorm2004API({
  autocommit: false,  // Disable autocommit
  // OR
  autocommitSeconds: 120,  // Commit every 2 minutes
});
```

### Custom LMS URL

Update the `lmsCommitUrl` in the injection script to point to your LMS endpoint:

```javascript
window.API_1484_11 = new window.Scorm2004API({
  lmsCommitUrl: 'https://your-lms.com/api/scorm/commit',
});
```

## Troubleshooting

### Course Not Loading

1. Check that course files exist at `${FileSystem.documentDirectory}courses/${courseId}/`
2. Verify index.html exists in the course directory
3. Check WebView console for errors

### SCORM API Not Found

1. Verify scorm2004.min.js exists at `assets/scorm-again/scorm2004.min.js`
2. Check injection script is running (look for console logs)
3. Verify file permissions allow loading local scripts

### Offline Sync Not Working

1. Check network status is being detected correctly
2. Verify OfflineStorageService is configured in scorm-again
3. Check browser/WebView localStorage is enabled
4. Look for sync errors in the logs

### Performance Issues

1. Use minified version (scorm2004.min.js) in production
2. Disable verbose logging (set logLevel: 2)
3. Increase autocommit interval to reduce saves
4. Profile WebView using Chrome DevTools (for Android)
