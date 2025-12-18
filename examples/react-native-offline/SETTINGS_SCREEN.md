# Settings Screen Documentation

## Overview

The Settings screen provides comprehensive control and monitoring of the React Native offline SCORM player. It includes network status monitoring, sync management, storage controls, debug tools, and quick access to documentation.

## Features

### 1. Network Status Section
- Real-time network connectivity indicator (Online/Offline)
- Connection type display (WiFi, Cellular, etc.)
- Visual status with color-coded icons
- Uses `@react-native-community/netinfo` for reliable network detection

### 2. Sync Section
- **Sync Now Button**: Manually trigger synchronization of offline data
  - Disabled when offline or already syncing
  - Shows loading indicator during sync operation
  - Broadcasts sync event to all active WebViews
- **Pending Items Count**: Displays number of items waiting to sync (currently shows "Unknown" - requires WebView integration)
- **Last Sync Time**: Shows when the last sync was performed

### 3. Storage Section
- **Total Storage Used**: Displays formatted size of all downloaded courses
- **Clear All Courses**: Removes all downloaded course content
  - Confirmation dialog prevents accidental deletion
  - Updates storage display after clearing

### 4. Debug Section
- **App Version**: Displays version from expo config
- **scorm-again Version**: Shows the library version being used
- **Debug Logs Toggle**: Enable/disable debug logging
- **Log Viewer**:
  - Expandable/collapsible log viewer
  - Color-coded log levels (info, warn, error)
  - Shows timestamps for each log entry
  - Scrollable list with max 100 recent entries
  - Clear logs button

### 5. About Section
- **GitHub Link**: Opens the scorm-again repository
- **Documentation Link**: Opens the project documentation

## Services

### SyncManager (`src/services/SyncManager.ts`)

Singleton service managing synchronization and debug logging.

**Methods:**
```typescript
triggerSync(): Promise<void>
// Triggers a manual sync by writing a timestamp to AsyncStorage
// that WebViews can monitor

getPendingCount(): number | null
// Returns pending sync count (currently null - future enhancement)

getLastSyncTime(): Promise<Date | null>
// Retrieves the last successful sync timestamp

updateLastSyncTime(): Promise<void>
// Updates the last sync timestamp

addLog(message: string, level: 'info' | 'warn' | 'error'): void
// Adds a log entry to the debug log

getLogs(): LogEntry[]
// Retrieves all stored log entries

clearLogs(): Promise<void>
// Clears all debug logs

isDebugEnabled(): Promise<boolean>
// Checks if debug mode is enabled

setDebugEnabled(enabled: boolean): Promise<void>
// Enables or disables debug mode
```

### StorageService (`src/services/StorageService.ts`)

Singleton service managing file system operations.

**Methods:**
```typescript
getTotalStorageUsed(): Promise<number>
// Calculates total bytes used by all downloaded courses

clearAllCourses(): Promise<void>
// Deletes all downloaded course content

formatBytes(bytes: number): string
// Formats byte count into human-readable string (Bytes, KB, MB, GB)
```

### SyncContext (`src/contexts/SyncContext.tsx`)

React context for managing sync state across the application.

**Usage:**
```typescript
import { SyncProvider, useSyncContext } from '@/src/contexts/SyncContext';

// Wrap your app with SyncProvider
<SyncProvider>
  <YourApp />
</SyncProvider>

// In components, use the hook
const { shouldSync, markSyncComplete, triggerSync } = useSyncContext();

// Check if sync was triggered from Settings
if (shouldSync) {
  // Perform sync operation
  await performSync();
  markSyncComplete();
}
```

## Installation

1. **Install Required Dependencies:**

The settings screen requires these packages (already added to package.json):
```json
{
  "@react-native-async-storage/async-storage": "~2.1.0",
  "@react-native-community/netinfo": "11.x",
  "@expo/vector-icons": "^14.0.0",
  "expo-constants": "~17.0.0",
  "expo-file-system": "~18.0.0"
}
```

Run `npm install` to install the new AsyncStorage dependency.

2. **Wrap Your App with SyncProvider:**

In your root layout file (`app/_layout.tsx`), wrap your app with the SyncProvider:

```tsx
import { SyncProvider } from '../src/contexts/SyncContext';

export default function RootLayout() {
  return (
    <SyncProvider>
      {/* Your existing app structure */}
    </SyncProvider>
  );
}
```

## Integration with Player Screen

To make the Player screen respond to sync triggers, use the SyncContext:

```tsx
import { useSyncContext } from '../../src/contexts/SyncContext';

export default function PlayerScreen() {
  const { shouldSync, markSyncComplete } = useSyncContext();

  useEffect(() => {
    if (shouldSync) {
      // Trigger sync in your WebView or SCORM API
      // For example, inject JavaScript to call API.Commit()
      webViewRef.current?.injectJavaScript(`
        if (window.API_1484_11 && window.API_1484_11.Commit) {
          window.API_1484_11.Commit('');
        }
      `);

      // Mark as complete after sync
      markSyncComplete();
    }
  }, [shouldSync, markSyncComplete]);

  // ... rest of your component
}
```

## Pull-to-Refresh

The Settings screen includes pull-to-refresh functionality that:
- Reloads all settings data
- Updates storage information
- Refreshes sync status
- Reloads debug logs

Simply pull down on the screen to refresh all data.

## Styling

The screen uses a clean, modern design with:
- Card-based sections with subtle shadows
- Color-coded status indicators
- iOS-style action buttons
- Responsive layouts that work on all screen sizes
- Light background with white cards for visual separation

## Future Enhancements

1. **Pending Items Count**: Implement WebView communication to read localStorage and count pending queue items
2. **Sync Progress**: Show detailed progress during sync operations
3. **Storage Breakdown**: Display storage usage per course
4. **Advanced Debug Options**: Network request logging, cache inspection
5. **Export Logs**: Allow exporting debug logs for support purposes
6. **Theme Support**: Add dark mode support
7. **Language Settings**: Add internationalization options

## Troubleshooting

### AsyncStorage Not Working
If AsyncStorage is not installed properly, you may see import errors. Run:
```bash
npm install @react-native-async-storage/async-storage
expo prebuild --clean
```

### Network Status Always Shows Offline
Ensure `@react-native-community/netinfo` is properly configured:
```bash
npm install @react-native-community/netinfo
expo prebuild --clean
```

### Sync Button Not Working
Check that:
1. Network is connected
2. SyncProvider is wrapping your app
3. Player screen is listening to sync triggers
4. SCORM API is properly initialized

## License

This example is part of the scorm-again project and follows the MIT license.
