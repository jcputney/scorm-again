# SCORM Player Architecture

## Component Hierarchy

```
PlayerScreen (app/player/[courseId].tsx)
├── Header
│   ├── BackButton
│   ├── CourseTitle
│   └── StatusIndicators
│       ├── NetworkIcon (wifi/wifi-off)
│       └── SyncIndicator (animated)
│
└── WebView
    ├── InjectedScript (scorm-again API)
    └── CourseContent (index.html)
        ├── SCORM API Wrapper (scorm-api.js)
        └── Course Logic (content.js)
```

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PlayerScreen Component                   │  │
│  │                                                        │  │
│  │  State:                                               │  │
│  │  - isOnline: boolean                                  │  │
│  │  - isSyncing: boolean                                 │  │
│  │  - courseTitle: string                                │  │
│  │  - coursePath: string                                 │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │         Network Status Monitor                 │  │  │
│  │  │         (@react-native-community/netinfo)      │  │  │
│  │  │                                                 │  │  │
│  │  │  NetInfo.addEventListener() ──┐                │  │  │
│  │  └────────────────────────────────┼────────────────┘  │  │
│  │                                   │                   │  │
│  │                                   ▼                   │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │              WebView Bridge                     │  │  │
│  │  │                                                 │  │  │
│  │  │  injectJavaScript() ───► window.dispatchEvent()│  │  │
│  │  │                          'scorm-again:network-  │  │  │
│  │  │                           status'               │  │  │
│  │  │                                                 │  │  │
│  │  │  onMessage() ◄────────── postMessage()         │  │  │
│  │  │    - sync status                               │  │  │
│  │  │    - log messages                              │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────┬───────────────────────────────────┘
                          │
                          │ injectedJavaScriptBeforeContentLoaded
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    WebView Context                           │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Injection Script                          │  │
│  │                                                       │  │
│  │  1. Load scorm2004.min.js from file://              │  │
│  │  2. Create window.API_1484_11 instance               │  │
│  │  3. Configure offline support                        │  │
│  │  4. Register event listeners:                        │  │
│  │     - OfflineDataSyncing                            │  │
│  │     - OfflineDataSynced                             │  │
│  │     - OfflineDataSyncFailed                         │  │
│  │  5. Override console.log                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         scorm-again Library                          │  │
│  │         (scorm2004.min.js)                           │  │
│  │                                                       │  │
│  │  window.API_1484_11 = {                              │  │
│  │    Initialize(),                                     │  │
│  │    Terminate(),                                      │  │
│  │    GetValue(),                                       │  │
│  │    SetValue(),                                       │  │
│  │    Commit(),                                         │  │
│  │    ...                                               │  │
│  │  }                                                   │  │
│  │                                                       │  │
│  │  OfflineStorageService {                             │  │
│  │    - localStorage for offline data                   │  │
│  │    - Queue commits when offline                      │  │
│  │    - Sync when online                                │  │
│  │  }                                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          Course Content (index.html)                 │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │     SCORM API Wrapper (scorm-api.js)           │  │  │
│  │  │                                                 │  │  │
│  │  │  window.SCORM = {                               │  │  │
│  │  │    findAPI() ───► Search window hierarchy       │  │  │
│  │  │    initialize() ───► API_1484_11.Initialize()   │  │  │
│  │  │    getValue() ───► API_1484_11.GetValue()       │  │  │
│  │  │    setValue() ───► API_1484_11.SetValue()       │  │  │
│  │  │    commit() ───► API_1484_11.Commit()           │  │  │
│  │  │  }                                              │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │                          │                            │  │
│  │                          ▼                            │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │        Course Logic (content.js)               │  │  │
│  │  │                                                 │  │  │
│  │  │  - Page navigation                              │  │  │
│  │  │  - Quiz handling                                │  │  │
│  │  │  - Progress tracking                            │  │  │
│  │  │  - CMI data display                             │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Event Flow

### Network Status Change

```
NetInfo detects change
    │
    ├─► Update isOnline state
    │
    └─► injectJavaScript()
            │
            └─► window.dispatchEvent('scorm-again:network-status')
                    │
                    └─► OfflineStorageService listens
                            │
                            ├─► If online: trigger sync
                            └─► If offline: queue commits
```

### SCORM Data Commit (Online)

```
Course calls SCORM.setValue()
    │
    └─► window.SCORM.setValue()
            │
            └─► window.API_1484_11.SetValue()
                    │
                    ├─► Update CMI data model
                    └─► Trigger autocommit (if enabled)
                            │
                            └─► window.API_1484_11.Commit()
                                    │
                                    ├─► Send HTTP request to LMS
                                    └─► Return success/failure
```

### SCORM Data Commit (Offline)

```
Course calls SCORM.setValue()
    │
    └─► window.SCORM.setValue()
            │
            └─► window.API_1484_11.SetValue()
                    │
                    ├─► Update CMI data model
                    └─► Trigger autocommit (if enabled)
                            │
                            └─► window.API_1484_11.Commit()
                                    │
                                    ├─► Detect offline status
                                    ├─► Save to localStorage
                                    ├─► Queue for later sync
                                    └─► Return optimistic success
```

### Offline Data Sync (Coming Back Online)

```
NetInfo detects online
    │
    └─► Dispatch 'scorm-again:network-status' { online: true }
            │
            └─► OfflineStorageService.sync()
                    │
                    ├─► Emit 'OfflineDataSyncing' event
                    │       │
                    │       └─► postMessage({ type: 'sync', status: 'start' })
                    │               │
                    │               └─► setIsSyncing(true)
                    │
                    ├─► Retrieve queued commits from localStorage
                    ├─► Send HTTP requests to LMS
                    │
                    ├─► On success:
                    │   ├─► Clear localStorage
                    │   ├─► Emit 'OfflineDataSynced' event
                    │   │       │
                    │   │       └─► postMessage({ type: 'sync', status: 'success' })
                    │   │               │
                    │   │               ├─► setIsSyncing(false)
                    │   │               └─► Alert.alert('Sync Complete')
                    │   └─► Return success
                    │
                    └─► On error:
                        ├─► Keep data in localStorage
                        ├─► Emit 'OfflineDataSyncFailed' event
                        │       │
                        │       └─► postMessage({ type: 'sync', status: 'error' })
                        │               │
                        │               ├─► setIsSyncing(false)
                        │               └─► Alert.alert('Sync Failed')
                        └─► Retry later
```

## File System Structure

```
${documentDirectory}                     (App's writable directory)
└── courses/
    ├── minimal-test/                    (Test course)
    │   ├── index.html                   (Entry point)
    │   ├── imsmanifest.xml              (SCORM manifest)
    │   ├── scorm-api.js                 (API wrapper)
    │   ├── content.js                   (Course logic)
    │   └── styles.css                   (Course styles)
    │
    └── [courseId]/                      (Downloaded courses)
        ├── index.html
        ├── imsmanifest.xml
        └── ... (course files)

${bundleDirectory}                       (App's read-only bundle)
└── assets/
    ├── scorm-again/
    │   └── scorm2004.min.js             (SCORM library)
    │
    └── courses/
        └── minimal-test/                (Bundled test course)
            └── ... (course files)
```

## State Management

### PlayerScreen Component State

```typescript
interface PlayerState {
  // Network status from NetInfo
  isOnline: boolean;                     

  // Sync status from WebView events
  isSyncing: boolean;                    

  // Course metadata
  courseTitle: string;                   
  coursePath: string | null;             
  scormAgainPath: string | null;         

  // Loading and error states
  isLoading: boolean;                    
  error: string | null;                  
}
```

### SCORM API State (in WebView)

```typescript
interface ScormState {
  // API state
  initialized: boolean;                  
  
  // CMI data model (managed by scorm-again)
  cmi: {
    completion_status: string;
    success_status: string;
    score: {
      scaled: number;
      raw: number;
      min: number;
      max: number;
    };
    location: string;
    suspend_data: string;
    // ... more CMI elements
  };
  
  // Offline storage
  offlineQueue: Commit[];                
  lastSyncTime: number;                  
}
```

## Security Considerations

1. **File Access**
   - WebView has full file system access via `allowFileAccess`
   - Only loads content from trusted local directories
   - No remote content execution without user consent

2. **Network Requests**
   - LMS URL is configured in injection script
   - Uses HTTPS for production
   - No sensitive data in URL parameters

3. **LocalStorage**
   - Used for offline data storage
   - Scoped to WebView origin
   - Cleared after successful sync

4. **Script Injection**
   - Injection script runs before content
   - No user-provided code execution
   - Template literals properly escaped

## Performance Optimizations

1. **Lazy Loading**
   - SCORM library loaded only when needed
   - Course files loaded on-demand by WebView

2. **Caching**
   - WebView caches loaded resources
   - LocalStorage persists between sessions

3. **Debouncing**
   - Autocommit throttles save operations
   - Network status checks are debounced

4. **Memory Management**
   - WebView released when screen unmounts
   - Event listeners properly cleaned up
   - Refs used to avoid re-renders
