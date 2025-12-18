# SCORM Player - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Files Created
```
✅ app/player/[courseId].tsx          (Main player screen)
✅ src/components/SyncIndicator.tsx   (Animated sync icon)
✅ assets/scorm-again/scorm2004.min.js (SCORM library)
```

### 2. Navigate to Player
```typescript
// From any screen
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/player/minimal-test');  // Launch test course
router.push(`/player/${courseId}`);   // Launch any course
```

### 3. Test the Player
```bash
# Start the app
cd examples/react-native-offline
npm start

# Then navigate to: /player/minimal-test
```

### 4. Try These Features

**Online Mode:**
1. Load the course
2. Click through pages
3. Complete the quiz
4. Progress saves automatically

**Offline Mode:**
1. Enable airplane mode
2. Continue using the course
3. Data queues in localStorage
4. Disable airplane mode
5. Watch automatic sync occur

**Network Status:**
- Watch wifi icon change with network
- See sync indicator spin during sync
- Get success alert after sync

## 🎯 Key Features

| Feature | Description |
|---------|-------------|
| **Network Monitoring** | Real-time wifi icon updates |
| **Offline Support** | Full SCORM API works offline |
| **Auto Sync** | Syncs when network returns |
| **Progress Save** | Auto-commits every 60 seconds |
| **Error Handling** | Graceful fallbacks for errors |
| **Loading States** | Spinner while course loads |
| **Theme Support** | Light/dark mode compatible |

## 📱 UI Components

```
┌─────────────────────────────────────┐
│ [←] Course Title   [wifi] [sync]   │  Header
├─────────────────────────────────────┤
│                                     │
│                                     │
│         SCORM Course Content        │  WebView
│                                     │
│                                     │
└─────────────────────────────────────┘
```

## 🔧 Configuration

Located in the injection script at line 166-173:

```typescript
window.API_1484_11 = new window.Scorm2004API({
  enableOfflineSupport: true,    // Enable offline features
  courseId: '${courseId}',       // Unique course identifier
  autocommit: true,              // Auto-save progress
  autocommitSeconds: 60,         // Save interval (seconds)
  logLevel: 4,                   // Detailed logging
  lmsCommitUrl: 'http://...',   // LMS endpoint URL
});
```

## 🔍 Debugging

### View Console Logs
```bash
# React Native logs
npx react-native log-android  # Android
npx react-native log-ios      # iOS

# Or use Expo
npm start
# Then press 'j' to open debugger
```

### Common Issues

**Course Not Loading?**
```typescript
// Check these paths exist:
${FileSystem.documentDirectory}/courses/${courseId}/index.html
${FileSystem.bundleDirectory}/assets/scorm-again/scorm2004.min.js
```

**Sync Not Working?**
```typescript
// Check network status detection:
NetInfo.fetch().then(state => {
  console.log('Connected:', state.isConnected);
  console.log('Type:', state.type);
});
```

**WebView Errors?**
```typescript
// Enable debugging in WebView:
<WebView
  onError={(e) => console.log('Error:', e.nativeEvent)}
  onHttpError={(e) => console.log('HTTP Error:', e.nativeEvent)}
/>
```

## 📚 More Information

- **Setup Details:** See `PLAYER_SETUP.md`
- **Architecture:** See `PLAYER_ARCHITECTURE.md`
- **Implementation:** See `PLAYER_IMPLEMENTATION.md`
- **Full Summary:** See `PLAYER_SUMMARY.md`

## 🎓 Example Course

A complete test course is included:
- **Location:** `assets/courses/minimal-test/`
- **Features:** Multi-page, quiz, scoring, offline support
- **Size:** Under 50KB
- **Launch:** Navigate to `/player/minimal-test`

## ✅ Checklist

Before using the player in production:

- [ ] Test online mode works
- [ ] Test offline mode works  
- [ ] Test sync after offline
- [ ] Verify error handling
- [ ] Check loading states
- [ ] Test back button
- [ ] Verify theme support
- [ ] Check on both iOS/Android

## 🔐 Security Notes

- WebView has file access (required for local content)
- SCORM library loaded from bundled assets
- LocalStorage scoped to WebView origin
- Network requests use configured LMS URL
- No remote code execution

## 🎨 Customization

### Change Sync Interval
```typescript
// In injection script
autocommitSeconds: 120,  // Save every 2 minutes
```

### Change LMS URL
```typescript
// In injection script
lmsCommitUrl: 'https://your-lms.com/api/scorm',
```

### Disable Auto-Commit
```typescript
// In injection script
autocommit: false,  // Manual commit only
```

### Adjust Logging
```typescript
// In injection script
logLevel: 2,  // 1=error, 2=warn, 3=info, 4=debug
```

## 📞 Need Help?

1. Check documentation files
2. Review console logs
3. Test with minimal-test course
4. Verify file paths
5. Check network connectivity

## 🎉 You're Ready!

The SCORM Player is fully implemented and ready to use. Just navigate to `/player/${courseId}` and it will handle the rest!
