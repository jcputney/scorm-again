# Offline Support for scorm-again

This document explains how to use the offline support feature in scorm-again, which allows SCORM modules to function without an active internet connection and sync data back to the LMS when connectivity is restored.

## Overview

The offline support feature enables:

1. Running SCORM modules locally on a device without network connectivity
2. Automatically storing SCORM data locally when offline
3. Synchronizing data back to the LMS when the network connection is re-established
4. Ideal for mobile applications, remote areas, or unreliable network conditions

## Configuration

To enable offline support, you need to set several options when creating your SCORM API:

```javascript
// Example configuration
const settings = {
  // Standard settings
  lmsCommitUrl: "https://your-lms.com/api/scorm/commit",
  autocommit: true,
  
  // Offline support settings
  enableOfflineSupport: true,  // Enable offline support
  courseId: "COURSE-12345",    // Unique identifier for the course
  syncOnInitialize: true,      // Attempt to sync data when initializing API
  syncOnTerminate: true,       // Attempt to sync data when terminating API
  maxSyncAttempts: 5           // Maximum number of attempts to sync an item
};

// Create the API with offline support
const api = new Scorm12API(settings);
```

### Offline Support Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `enableOfflineSupport` | `false` | Master switch to enable/disable offline functionality |
| `courseId` | `""` | Unique identifier for the course or content module |
| `syncOnInitialize` | `true` | Whether to try syncing offline data when the API initializes |
| `syncOnTerminate` | `true` | Whether to try syncing offline data when the API terminates |
| `maxSyncAttempts` | `5` | Maximum number of sync attempts for each data item |

## How It Works

### Automatic Mode Switching

The API automatically detects network connectivity status and switches between online and offline modes:

- When online, data is sent directly to the LMS as usual
- When offline, data is stored locally in the browser's localStorage
- When connection is restored, data is synchronized back to the LMS

### Synchronization Events

The API triggers events during synchronization that you can listen for:

```javascript
// Listen for offline data sync events
api.on('OfflineDataSynced', () => {
  console.log('Successfully synchronized offline data to LMS');
});

// Listen for online/offline status changes
window.addEventListener('online', () => {
  console.log('Device is back online, scorm-again will attempt to sync');
});

window.addEventListener('offline', () => {
  console.log('Device is offline, scorm-again will store data locally');
});
```

## Mobile Applications Integration

To use offline support in a mobile application:

1. **WebView Integration**: Use a WebView to load your SCORM content and scorm-again
2. **Configuration**: Set up the API with offline support enabled
3. **Storage Access**: Ensure your WebView allows localStorage access
4. **Network Handling**: Configure the app to handle network status changes properly

### React Native Example

```javascript
import React from 'react';
import { WebView } from 'react-native-webview';
import NetInfo from '@react-native-community/netinfo';

const ScormPlayer = () => {
  // Inject the network status into the WebView
  const injectNetworkStatus = (isConnected) => {
    const script = `
      window.navigator.onLine = ${isConnected};
      const event = new Event('${isConnected ? 'online' : 'offline'}');
      window.dispatchEvent(event);
    `;
    if (webviewRef.current) {
      webviewRef.current.injectJavaScript(script);
    }
  };
  
  // Listen for network changes
  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      injectNetworkStatus(state.isConnected);
    });
    
    return () => unsubscribe();
  }, []);
  
  const webviewRef = React.useRef(null);
  
  return (
    <WebView
      ref={webviewRef}
      source={{ uri: 'https://your-domain.com/scorm-content/' }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      originWhitelist={['*']}
      onMessage={(event) => {
        // Handle messages from the WebView if needed
      }}
    />
  );
};

export default ScormPlayer;
```

## Detailed Mobile Framework Examples

For more comprehensive examples of implementing offline support in various mobile frameworks, please refer to these detailed guides:

- [React Native Implementation](api_usage/examples/offline/react_native.md)
- [Flutter Implementation](api_usage/examples/offline/flutter.md)
- [iOS Native Implementation](api_usage/examples/offline/ios_native.md)
- [Native Android Implementation](api_usage/examples/offline/native_android.md)
- [Xamarin/MAUI Implementation](api_usage/examples/offline/xamarin_maui.md)
- [Kotlin Multiplatform Implementation](api_usage/examples/offline/kotlin_multiplatform.md)

## Limitations and Considerations

1. **Storage Limits**: localStorage typically has a 5-10MB limit, which may affect large courses
2. **Security**: Data is stored unencrypted in localStorage by default
3. **Data Persistence**: Mobile apps may clear localStorage in certain scenarios
4. **Conflict Resolution**: The API uses a timestamp-based approach; latest data wins
5. **Connectivity Detection**: Some browsers may have delayed connectivity status updates

## Best Practices

1. Always provide a meaningful `courseId` to properly identify offline data
2. Consider implementing additional local storage mechanisms for very large courses
3. Test thoroughly in various connectivity scenarios
4. Implement proper error handling for sync failures
5. Consider implementing your own encryption for sensitive data

## Troubleshooting

If you encounter issues with offline support:

1. **Data Not Syncing**: Verify network connectivity and check browser console for errors
2. **Storage Errors**: Check localStorage limits and browser permissions
3. **Course Not Loading Offline**: Ensure all resources are locally available
4. **Mobile Integration Issues**: Verify WebView configuration and JavaScript bridging 