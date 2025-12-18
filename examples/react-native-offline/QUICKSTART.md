# Quick Start Guide - Settings Screen

This guide will help you quickly get the Settings screen up and running in the React Native offline example.

## Installation (5 minutes)

1. **Install dependencies:**
```bash
cd examples/react-native-offline
npm install
```

2. **The Settings screen is already set up!** All required files are in place:
   - `/Users/putneyj/git/scorm-again/examples/react-native-offline/app/(tabs)/settings.tsx` - Main screen
   - `/Users/putneyj/git/scorm-again/examples/react-native-offline/src/services/SyncManager.ts` - Sync service
   - `/Users/putneyj/git/scorm-again/examples/react-native-offline/src/services/StorageService.ts` - Storage service
   - `/Users/putneyj/git/scorm-again/examples/react-native-offline/src/contexts/SyncContext.tsx` - Sync context
   - `/Users/putneyj/git/scorm-again/examples/react-native-offline/app/_layout.tsx` - Layout with SyncProvider

## Running the App

1. **Start the dev server:**
```bash
npm start
```

2. **Press `i` for iOS or `a` for Android**

3. **Navigate to the Settings tab** (gear icon in the bottom navigation)

## What You'll See

### Network Status
- Green WiFi icon when online
- Red WiFi icon when offline
- Connection type (WiFi, Cellular, etc.)

### Sync Section
- "Sync Now" button (blue when enabled, gray when offline)
- Pending items count (currently shows "Unknown")
- Last sync timestamp (shows "Never" initially)

### Storage Section
- Total storage used by courses (in Bytes/KB/MB/GB)
- Red "Clear All Courses" button

### Debug Section
- App version (from app.json)
- scorm-again version (3.0.0-alpha.1)
- Debug logs toggle switch
- Expandable log viewer with color-coded entries

### About Section
- GitHub link
- Documentation link

## Testing the Features

### Test Network Status
1. Enable airplane mode on your device/simulator
2. Watch the status change from "Online" to "Offline"
3. Icon color changes from green to red

### Test Sync
1. Make sure you're online
2. Tap "Sync Now"
3. You'll see a success alert
4. Last sync time updates
5. Check debug logs (if enabled) to see sync messages

### Test Debug Logs
1. Toggle "Show Debug Logs" to ON
2. Tap "Show Logs (X)" to expand the log viewer
3. You'll see logs from:
   - App initialization
   - Network changes
   - Sync operations
4. Tap "Clear" to remove all logs

### Test Storage
1. Storage shows "0 Bytes" initially (no courses downloaded yet)
2. Once you download courses, this will update
3. Tap "Clear All Courses" to remove everything
4. Confirm the destructive action

### Test Pull-to-Refresh
1. Pull down on the Settings screen
2. All data refreshes (storage, sync time, logs)

## Common Issues

### "Cannot find module '@react-native-async-storage/async-storage'"
**Solution:**
```bash
npm install
npx expo prebuild --clean
```

### "NetInfo is not available"
**Solution:**
```bash
npm install @react-native-community/netinfo
npx expo prebuild --clean
```

### "Sync Now button doesn't work"
**Check:**
1. Are you online? (button is disabled offline)
2. Is the SyncProvider wrapping your app? (check app/_layout.tsx)
3. Check debug logs for error messages

### "Storage always shows 0 Bytes"
**Reason:** No courses have been downloaded yet. This is expected initially. Once you implement course downloads in the Downloads tab, storage will update.

## Next Steps

### 1. Integrate with Player Screen
Make the Player respond to sync triggers:

```tsx
// In app/player/[courseId].tsx
import { useSyncContext } from '@/src/contexts/SyncContext';

const { shouldSync, markSyncComplete } = useSyncContext();

useEffect(() => {
  if (shouldSync) {
    // Trigger SCORM commit in WebView
    handleSync();
    markSyncComplete();
  }
}, [shouldSync]);
```

See [PLAYER_INTEGRATION_EXAMPLE.md](./PLAYER_INTEGRATION_EXAMPLE.md) for complete examples.

### 2. Add Logging Throughout Your App
Add meaningful logs to track what's happening:

```tsx
import syncManager from '@/src/services/SyncManager';

// In any component
syncManager.addLog('Course downloaded successfully', 'info');
syncManager.addLog('Network request failed', 'error');
syncManager.addLog('Outdated course version detected', 'warn');
```

### 3. Implement Pending Count
To show actual pending sync items, you'll need to:
1. Implement queue storage in your SCORM API wrapper
2. Read queue from localStorage via WebView
3. Update `getPendingCount()` in SyncManager

### 4. Customize Styling
All styles are in the settings.tsx StyleSheet. Modify:
- Colors (match your brand)
- Spacing and padding
- Card shadows and borders
- Font sizes

### 5. Add More Settings
Extend the Settings screen with:
- Language/locale selection
- Theme preference (light/dark mode)
- Auto-sync interval configuration
- Maximum storage limit
- Course auto-delete policy

## File Locations

All files are in `/Users/putneyj/git/scorm-again/examples/react-native-offline/`:

```
app/
  (tabs)/
    settings.tsx           ← Main settings screen UI
  _layout.tsx             ← SyncProvider wrapper

src/
  services/
    SyncManager.ts        ← Sync logic and logging
    StorageService.ts     ← File system operations
    index.ts              ← Service exports
  contexts/
    SyncContext.tsx       ← React context for sync state
    index.ts              ← Context exports

package.json              ← Dependencies (AsyncStorage added)
```

## Documentation

- **[SETTINGS_SCREEN.md](./SETTINGS_SCREEN.md)** - Complete feature documentation
- **[PLAYER_INTEGRATION_EXAMPLE.md](./PLAYER_INTEGRATION_EXAMPLE.md)** - Integration examples
- **[README.md](./README.md)** - Full project documentation

## Support

If you encounter issues:

1. **Check debug logs** in the Settings screen
2. **Review documentation** linked above
3. **Clear and rebuild**:
   ```bash
   rm -rf node_modules
   npm install
   npx expo prebuild --clean
   ```
4. **Open an issue** on the scorm-again GitHub repository

## Summary

You now have a fully functional Settings screen with:
- Network monitoring
- Sync management
- Storage controls
- Debug tools
- Documentation links

The screen is production-ready and can be customized to your needs. Start using it to monitor and manage your offline SCORM player!
