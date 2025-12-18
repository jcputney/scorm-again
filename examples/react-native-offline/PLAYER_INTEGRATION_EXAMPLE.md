# Player Screen Integration Example

This document shows how to integrate the SyncContext with the Player screen to respond to manual sync triggers from the Settings screen.

## Example Implementation

```tsx
import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useSyncContext } from '../../src/contexts/SyncContext';
import SyncManager from '../../src/services/SyncManager';

export default function PlayerScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { shouldSync, markSyncComplete } = useSyncContext();
  const webViewRef = useRef<WebView>(null);

  // Listen for sync triggers from Settings screen
  useEffect(() => {
    if (shouldSync) {
      handleSync();
      markSyncComplete();
    }
  }, [shouldSync, markSyncComplete]);

  const handleSync = () => {
    SyncManager.addLog(`Sync triggered for course: ${courseId}`, 'info');

    // Attempt to commit data via SCORM 2004 API
    webViewRef.current?.injectJavaScript(`
      (function() {
        try {
          // Try SCORM 2004
          if (window.API_1484_11) {
            var result = window.API_1484_11.Commit('');
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'scormCommit',
              version: '2004',
              success: result === 'true'
            }));
            return;
          }

          // Try SCORM 1.2
          if (window.API) {
            var result = window.API.LMSCommit('');
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'scormCommit',
              version: '1.2',
              success: result === 'true'
            }));
            return;
          }

          // No API found
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'scormCommit',
            error: 'No SCORM API found'
          }));
        } catch (e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'scormCommit',
            error: e.toString()
          }));
        }
      })();
      true; // Required for iOS
    `);
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.type === 'scormCommit') {
        if (message.success) {
          SyncManager.addLog(
            `SCORM ${message.version} commit successful`,
            'info'
          );
        } else if (message.error) {
          SyncManager.addLog(
            `SCORM commit error: ${message.error}`,
            'error'
          );
        }
      }
    } catch (error) {
      SyncManager.addLog(
        `Error processing WebView message: ${error}`,
        'error'
      );
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: `file:///path/to/course/${courseId}/index.html` }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
```

## Alternative: Automatic Periodic Sync

If you want the Player to automatically sync periodically instead of only on manual trigger:

```tsx
useEffect(() => {
  // Manual sync from Settings
  if (shouldSync) {
    handleSync();
    markSyncComplete();
  }
}, [shouldSync, markSyncComplete]);

useEffect(() => {
  // Automatic periodic sync every 30 seconds
  const interval = setInterval(() => {
    handleSync();
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

## Integration with OfflineStorageService

If you're using the scorm-again OfflineStorageService, you can trigger sync like this:

```tsx
import { Scorm2004API } from 'scorm-again/scorm2004';

// When initializing the SCORM API
const api = new Scorm2004API({
  offlineStorage: {
    enabled: true,
    storageType: 'localStorage',
  },
});

// In your sync handler
const handleSync = async () => {
  // Trigger commit
  const result = api.commit();

  if (result === 'true') {
    SyncManager.addLog('SCORM data committed', 'info');

    // Trigger offline storage sync
    // The OfflineStorageService will automatically sync if online
    await SyncManager.updateLastSyncTime();
  } else {
    const error = api.GetLastError();
    SyncManager.addLog(`Commit failed: ${error}`, 'error');
  }
};
```

## Listening for Network Changes

You can also trigger sync when the device comes back online:

```tsx
import { useNetInfo } from '@react-native-community/netinfo';

export default function PlayerScreen() {
  const netInfo = useNetInfo();
  const wasOffline = useRef(false);

  useEffect(() => {
    if (wasOffline.current && netInfo.isConnected) {
      // Device just came back online
      SyncManager.addLog('Network restored, syncing...', 'info');
      handleSync();
    }
    wasOffline.current = !netInfo.isConnected;
  }, [netInfo.isConnected]);

  // ... rest of component
}
```

## Complete Example with All Features

```tsx
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useNetInfo } from '@react-native-community/netinfo';
import { useSyncContext } from '../../src/contexts/SyncContext';
import SyncManager from '../../src/services/SyncManager';

export default function PlayerScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { shouldSync, markSyncComplete } = useSyncContext();
  const netInfo = useNetInfo();
  const webViewRef = useRef<WebView>(null);
  const wasOffline = useRef(false);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Manual sync trigger from Settings
  useEffect(() => {
    if (shouldSync) {
      handleSync();
      markSyncComplete();
    }
  }, [shouldSync, markSyncComplete]);

  // Automatic sync when coming back online
  useEffect(() => {
    if (wasOffline.current && netInfo.isConnected) {
      SyncManager.addLog('Network restored, syncing pending data...', 'info');
      handleSync();
    }
    wasOffline.current = !netInfo.isConnected;
  }, [netInfo.isConnected]);

  // Periodic auto-sync (every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      if (netInfo.isConnected && !syncing) {
        handleSync();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [netInfo.isConnected, syncing]);

  const handleSync = () => {
    if (syncing) return;

    setSyncing(true);
    SyncManager.addLog(`Starting sync for course: ${courseId}`, 'info');

    webViewRef.current?.injectJavaScript(`
      (function() {
        try {
          let api = window.API_1484_11 || window.API;
          if (!api) {
            throw new Error('No SCORM API found');
          }

          let commitMethod = api.Commit || api.LMSCommit;
          let result = commitMethod.call(api, '');

          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'syncResult',
            success: result === 'true',
            timestamp: Date.now()
          }));
        } catch (e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'syncResult',
            success: false,
            error: e.toString()
          }));
        }
      })();
      true;
    `);
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);

      if (message.type === 'syncResult') {
        setSyncing(false);
        if (message.success) {
          SyncManager.addLog('Sync completed successfully', 'info');
          SyncManager.updateLastSyncTime();
        } else {
          SyncManager.addLog(
            `Sync failed: ${message.error || 'Unknown error'}`,
            'error'
          );
        }
      }
    } catch (error) {
      setSyncing(false);
      SyncManager.addLog(`Error processing message: ${error}`, 'error');
    }
  };

  const handleWebViewLoad = () => {
    setLoading(false);
    SyncManager.addLog(`Course ${courseId} loaded`, 'info');
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        source={{ uri: `file:///path/to/course/${courseId}/index.html` }}
        onMessage={handleWebViewMessage}
        onLoad={handleWebViewLoad}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.webview}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007aff" />
          <Text style={styles.loadingText}>Loading course...</Text>
        </View>
      )}

      {syncing && (
        <View style={styles.syncIndicator}>
          <ActivityIndicator size="small" color="#fff" />
          <Text style={styles.syncText}>Syncing...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  syncIndicator: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#007aff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  syncText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

## Testing

To test the sync integration:

1. Open the Player screen with a course
2. Go to the Settings screen
3. Enable "Show Debug Logs"
4. Tap "Sync Now"
5. Return to the Player screen (or check logs in Settings)
6. Verify that sync was triggered and logged

You should see log entries like:
- "Manual sync triggered"
- "Sync request broadcast to active sessions"
- "Starting sync for course: [courseId]"
- "Sync completed successfully" or error messages

## Notes

- The WebView must have `javaScriptEnabled={true}` for sync to work
- The SCORM API must be initialized before sync can be triggered
- Sync will fail gracefully if no SCORM API is found
- All sync operations are logged for debugging
- Network status is checked before attempting sync
