# Migration Guide: scorm-again v2.6.5 → v3.0.0

Version 3.0.0 is a major release with significant architectural changes. This guide covers all breaking changes and provides migration steps.

## Table of Contents

- [Critical Breaking Changes](#critical-breaking-changes)
- [High-Impact Changes](#high-impact-changes)
- [Medium-Impact Changes](#medium-impact-changes)
- [New Features](#new-features)
- [Migration Checklist](#migration-checklist)
- [Settings Migration Reference](#settings-migration-reference)

---

## Critical Breaking Changes

These changes will cause immediate failures if not addressed.

### 1. AICC Support Completely Removed

**Impact:** Any code using AICC will break immediately.

**What was removed:**
- `AICC` class export
- All AICC CMI data models (`cmi.student_demographics`, `cmi.evaluation`, `cmi.paths`, `cmi.tries`)
- AICC build artifacts (`aicc.js`, `aicc.min.js`)
- AICC TypeScript definitions
- AICC exception handling

```javascript
// v2.6.5
import { AICC } from 'scorm-again';
window.API = new AICC({ lmsCommitUrl: '/commit' });

// v3.0.0 - AICC removed, use SCORM 1.2 instead
import { Scorm12API } from 'scorm-again';
window.API = new Scorm12API({ lmsCommitUrl: '/commit' });
```

**Options:**
- Pin to v2.6.8 for continued AICC support
- Migrate AICC content to SCORM 1.2 or SCORM 2004
- Fork v2.6.8 for custom AICC maintenance

---

### 2. HTTP Commit Behavior Changed to Synchronous (SCORM-Compliant)

**Impact:** Default commit behavior changed from async to sync. This is the most significant behavioral change.

| Aspect | v2.6.5 (Async) | v3.0.0 (Sync - Default) |
|--------|----------------|-------------------------|
| `LMSCommit()` returns | `"true"` immediately | Blocks until LMS responds |
| Error reporting | Via events only | Actual error returned to SCO |
| SCORM compliant | No | Yes |
| Can be throttled | Yes | No |

**To preserve v2.6.5 behavior (not recommended):**
```javascript
// v2.6.5
const api = new Scorm12API({
  lmsCommitUrl: '/commit',
  asyncCommit: true  // OLD setting name
});

// v3.0.0 - Legacy async mode
const api = new Scorm12API({
  lmsCommitUrl: '/commit',
  useAsynchronousCommits: true,  // NEW - enables async
  throttleCommits: true          // NEW - renamed from asyncCommit
});
// Warning will be logged about SCORM non-compliance
```

**To use SCORM-compliant sync (recommended):**
```javascript
// v3.0.0 - Default behavior
const api = new Scorm12API({
  lmsCommitUrl: '/commit'
  // useAsynchronousCommits defaults to false
});

// Now you can handle commit errors properly
const result = api.LMSCommit("");
if (result === "false") {
  const errorCode = api.LMSGetLastError();
  console.error("Commit failed:", errorCode);
}
```

---

### 3. Setting Renamed: `asyncCommit` → `throttleCommits` + `useAsynchronousCommits`

**Impact:** The `asyncCommit` setting is deprecated but still works with a warning.

```javascript
// v2.6.5
{ asyncCommit: true }  // Enabled async + throttling

// v3.0.0 - Old setting still works (with deprecation warning)
{ asyncCommit: true }  // Automatically enables useAsynchronousCommits + throttleCommits

// v3.0.0 - Recommended new settings
{
  useAsynchronousCommits: true,  // Enable async HTTP (NOT SCORM-compliant)
  throttleCommits: true          // Enable 500ms throttling (requires async)
}
```

**Backwards Compatibility:** If you use `asyncCommit: true` without specifying the new settings, scorm-again will automatically enable both `useAsynchronousCommits` and `throttleCommits`, and log a deprecation warning. This provides a smooth migration path, but you should update your code before the next major version.

**Note:** `throttleCommits` only works when `useAsynchronousCommits: true`. With synchronous commits (default), throttling is automatically disabled.

---

### 4. API Methods Changed from Async to Sync

**Impact:** Code using `await` on these methods will need adjustment.

| Method | v2.6.5 | v3.0.0 |
|--------|--------|--------|
| `terminate()` | `async` → `Promise<string>` | `sync` → `string` |
| `commit()` | `async` → `Promise<string>` | `sync` → `string` |
| `storeData()` | `async` → `Promise<ResultObject>` | `sync` → `ResultObject` |
| `processHttpRequest()` | `async` → `Promise<ResultObject>` | `sync` → `ResultObject` |

```javascript
// v2.6.5
const result = await api.commit("", true);

// v3.0.0
const result = api.commit("", true);  // No await needed
```

---

### 5. `throwSCORMError()` Signature Changed

**Impact:** Custom code calling this method will break.

```javascript
// v2.6.5
throwSCORMError(errorNumber: number, message?: string)

// v3.0.0 - CMIElement added as first parameter
throwSCORMError(CMIElement: string | undefined, errorNumber: number, message?: string)
```

---

### 6. `internalFinish()` Method Removed

**Impact:** Custom subclasses calling this method will break.

```javascript
// v2.6.5
await api.internalFinish();  // Existed

// v3.0.0
// Method removed - logic moved to lmsFinish()
```

---

## High-Impact Changes

These changes are likely to affect most users upgrading.

### 7. CMI and Setting Default Value Changes

**SCORM 1.2 `mastery_override` setting (IMPORTANT):**
```javascript
// v2.6.5: false (LMS does NOT override lesson_status based on score)
// v3.0.0: true  (LMS WILL override lesson_status based on mastery score - per SCORM 1.2 spec)
```

This means if a learner's score meets or exceeds the mastery score, `lesson_status` will automatically be set to `passed` (or `failed` if below). To preserve v2.6.5 behavior:
```javascript
const api = new Scorm12API({ mastery_override: false });
```

**SCORM 2004 `cmi.total_time`:**
```javascript
// v2.6.5: "" (empty string)
// v3.0.0: "PT0S" (ISO 8601 duration for 0 seconds)
```

**SCORM 2004 `cmi.completion_status` on reset:**
```javascript
// v2.6.5: "incomplete"
// v3.0.0: "unknown" (more spec-compliant)
```

### 8. Validation Error Constructors Changed

All validation errors now include the CMI element path for better debugging:

```javascript
// v2.6.5
new Scorm12ValidationError(errorCode)

// v3.0.0
new Scorm12ValidationError(CMIElement, errorCode)
```

### 9. BaseCMI Constructor Changed

```javascript
// v2.6.5
class MyCMI extends BaseCMI {
  constructor() { super(); }
}

// v3.0.0 - cmi_element path required
class MyCMI extends BaseCMI {
  constructor() { super("cmi.custom"); }
}
```

### 10. BaseAPI Constructor Signature Extended

```javascript
// v2.6.5
protected constructor(error_codes: ErrorCode, settings?: Settings)

// v3.0.0 - Service injection support added
protected constructor(
  error_codes: ErrorCode,
  settings?: Settings,
  httpService?: IHttpService,
  eventService?: IEventService,
  serializationService?: ISerializationService,
  cmiDataService?: ICMIDataService,
  errorHandlingService?: IErrorHandlingService,
  loggingService?: ILoggingService,
  offlineStorageService?: IOfflineStorageService,
)
```

### 11. Public Properties Removed from BaseAPI

These properties have been internalized to services:

```javascript
// v2.6.5 - Public properties
api.listenerArray           // Accessible
api.apiLogLevel             // Accessible
api.selfReportSessionTime   // Accessible

// v3.0.0 - These are no longer directly accessible
```

### 12. Enum Values Changed to Uppercase

```javascript
// v2.6.5
CompletionStatus.completed   // lowercase
SuccessStatus.passed         // lowercase

// v3.0.0
CompletionStatus.COMPLETED   // UPPERCASE
SuccessStatus.PASSED         // UPPERCASE
```

### 13. API Methods Now Accept Optional Parameter

Per SCORM specification, `LMSInitialize()`, `LMSFinish()`, and `LMSCommit()` now accept an optional parameter that **must be an empty string** if provided:

```javascript
// v2.6.5 - No parameter
api.LMSInitialize();
api.LMSFinish();
api.LMSCommit();

// v3.0.0 - Parameter optional, but must be empty string if provided
api.LMSInitialize("");      // OK
api.LMSInitialize();        // OK (defaults to "")
api.LMSInitialize("test");  // ERROR 310 (Argument Error), returns "false"
```

Same applies to SCORM 2004: `Initialize("")`, `Terminate("")`, `Commit("")`.

**TypeScript signatures changed:**
```typescript
// v2.6.5
LMSInitialize: () => string;
LMSFinish: () => string;
LMSCommit: () => string;

// v3.0.0
LMSInitialize: (parameter?: string) => string;
LMSFinish: (parameter?: string) => string;
LMSCommit: (parameter?: string) => string;
```

---

## Medium-Impact Changes

These changes may affect some users depending on their implementation.

### 15. SCORM 1.2 Validation Now Stricter

New validation added to previously unvalidated fields:

- `cmi.student_data.mastery_score` - Now validates as CMIDecimal (0-100)
- `cmi.core.credit` - Now validates against CMICredit regex
- `cmi.core.entry` - Now validates against CMIEntry regex
- `cmi.core.lesson_mode` - Now validates against CMILessonMode regex
- `cmi.core.exit` - Accepts "normal" (SCORM 2004 value) with warning, normalizes to ""

### 16. `setStartTime()` Can Only Be Called Once

```javascript
// v2.6.5 - Could be called multiple times
api.cmi.setStartTime();
api.cmi.setStartTime();  // Overwrites previous

// v3.0.0 - Throws error on second call
api.cmi.setStartTime();
api.cmi.setStartTime();  // ERROR: "Start time has already been set."
```

### 17. SCORM 2004 `adl.data` Validation Stricter

```javascript
// adl.data.n.id is READ-ONLY after Initialize()
api.SetValue("adl.data.0.id", "data1");
api.Initialize("");
api.SetValue("adl.data.0.id", "data2");  // ERROR 404 (Read Only)

// adl.data.n.store requires id to be set first
api.SetValue("adl.data.0.store", "value");  // ERROR 408 (Dependency Not Established)
api.SetValue("adl.data.0.id", "data1");     // Set id first
api.SetValue("adl.data.0.store", "value");  // Now OK

// Reading uninitialized store returns error
api.GetValue("adl.data.0.store");  // ERROR 403 if never set
```

### 18. Type Changes: `RefObject` → `StringKeyMap`

```typescript
// v2.6.5
type RefObject = { [key: string]: any };
xhrHeaders?: RefObject;

// v3.0.0 - More type-safe
type StringKeyMap = Record<string, unknown>;
xhrHeaders?: StringKeyMap;
```

### 19. Regex Pattern Changes

Most patterns are now more permissive:

| Pattern | v2.6.5 | v3.0.0 |
|---------|--------|--------|
| CMIString256/4096 | `^.{0,n}$` | `^[\s\S]{0,n}$` (includes newlines) |
| CMITime | No centiseconds | Supports `.xx` centiseconds |
| CMIDecimal | 3 digits before decimal | 10 digits before decimal |
| SCORM 1.2 suspend_data | 4096 chars max | 64000 chars max |
| SCORM 2004 year range | 1970-2038 | 1970-9999 |

---

## New Features

These are non-breaking additions available in v3.0.0.

### 20. CrossFrame Communication

New feature for sandboxed iframe SCORM content:
- `CrossFrameAPI` - Child frame proxy with synchronous API
- `CrossFrameLMS` - Parent frame wrapper with rate limiting
- Heartbeat monitoring for connection status
- Event system for connection/rate limit events

See [Cross-Frame Communication](https://jcputney.github.io/scorm-again/docs/lms-integration/cross-frame-communication) for details.

### 21. SCORM 2004 Sequencing Engine

Complete implementation of SCORM 2004 4th Edition sequencing:
- Activity tree management
- Navigation request processing (`continue`, `previous`, `choice`, `jump`, etc.)
- Sequencing rules (pre/post/exit conditions)
- Rollup rules for status propagation
- Global objectives across SCOs
- Selection & randomization

**Note:** If you don't configure sequencing, behavior is unchanged from v2.6.5.

### 22. Offline Storage Support

New settings for offline operation:
- `enableOfflineSupport` - Enable offline data storage
- `syncOnInitialize` - Sync when API initializes
- `syncOnTerminate` - Sync when API terminates
- `maxSyncAttempts` - Maximum retry attempts

### 23. sendBeacon for Termination

**In synchronous mode (default):** Termination commits automatically use `navigator.sendBeacon()` for reliable delivery during page unload. This is hardcoded behavior and cannot be disabled.

**In asynchronous mode:** The `asyncModeBeaconBehavior` setting controls when sendBeacon is used:
- `"never"` (default) - Always use fetch API
- `"on-terminate"` - Use sendBeacon for termination commits only
- `"always"` - Use sendBeacon for all commits

### 24. New Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `useAsynchronousCommits` | `boolean` | `false` | Use async HTTP (NOT SCORM-compliant) |
| `throttleCommits` | `boolean` | `false` | Throttle rapid commits (requires async) |
| `asyncModeBeaconBehavior` | `string` | `"never"` | When to use sendBeacon in async mode |
| `enableOfflineSupport` | `boolean` | `false` | Enable offline storage |
| `courseId` | `string` | `""` | Course identifier for offline storage |
| `scoId` | `string` | `""` | SCO identifier for multi-SCO courses |
| `httpService` | `IHttpService` | `null` | Custom HTTP service |
| `sequencing` | `object` | `undefined` | SCORM 2004 sequencing config |
| `autoCompleteLessonStatus` | `boolean` | `false` | SCORM 1.2: Auto-complete status on terminate |
| `globalStudentPreferences` | `boolean` | `false` | SCORM 1.2: Share learner prefs across SCOs |

---

## Migration Checklist

### Critical (Must Fix Before Upgrading)

- [ ] Remove all AICC imports and usage
- [ ] Remove `await` from `commit()`, `terminate()`, `storeData()` calls
- [ ] Update `throwSCORMError()` calls to include CMIElement parameter
- [ ] Update custom BaseCMI subclass constructors to pass cmi_element

### Recommended (Backwards Compatible But Deprecated)

- [ ] Replace `asyncCommit` with `useAsynchronousCommits` + `throttleCommits` (still works with warning)
- [ ] Replace `useBeaconInsteadOfFetch` with `asyncModeBeaconBehavior` (still works with warning)

### High Priority

- [ ] Test commit behavior - commits now block by default
- [ ] Set `mastery_override: false` if you need v2.6.5 SCORM 1.2 behavior
- [ ] Update enum references to UPPERCASE (`COMPLETED`, `PASSED`, etc.)
- [ ] Review custom error handling for new error format
- [ ] Test `cmi.total_time` handling - now defaults to "PT0S" for SCORM 2004

### Medium Priority

- [ ] Review code accessing removed public properties (`listenerArray`, etc.)
- [ ] Test SCORM 1.2 content with stricter validation
- [ ] Update TypeScript types from `RefObject` to `StringKeyMap`
- [ ] Review `setStartTime()` usage - can only be called once now
- [ ] Test SCORM 2004 `adl.data` usage for compliance

### Optional (Consider New Features)

- [ ] Enable offline support for disconnected scenarios
- [ ] Evaluate CrossFrame for sandboxed iframes
- [ ] Explore SCORM 2004 sequencing for multi-SCO courses
- [ ] Use tree-shakeable imports (`import Scorm12API from 'scorm-again/scorm12'`)

---

## Settings Migration Reference

| v2.6.5 Setting | v3.0.0 Replacement |
|----------------|-------------------|
| `asyncCommit: true` | `useAsynchronousCommits: true, throttleCommits: true` |
| `asyncCommit: false` | (default - no change needed) |
| `useBeaconInsteadOfFetch` | `asyncModeBeaconBehavior` (only affects async mode) |

| New v3.0.0 Settings | Default | Purpose |
|---------------------|---------|---------|
| `useAsynchronousCommits` | `false` | Enable async HTTP (legacy mode) |
| `throttleCommits` | `false` | Batch rapid commits with 500ms delay |
| `asyncModeBeaconBehavior` | `"never"` | Use sendBeacon in async mode |
| `enableOfflineSupport` | `false` | Enable offline storage |
| `httpService` | `null` | Inject custom HTTP service |
| `sequencing` | `undefined` | SCORM 2004 sequencing config |
| `xhrResponseHandler` | (built-in) | Handler for sync XHR responses |
| `autoCompleteLessonStatus` | `false` | Auto-complete SCORM 1.2 lesson_status |
| `globalStudentPreferences` | `false` | Share learner prefs across SCOs |

---

## Need Help?

- [GitHub Issues](https://github.com/jcputney/scorm-again/issues) - Report bugs or ask questions
- [Documentation](docs/) - Detailed feature documentation
- [Examples](docs/examples/) - Code examples and integration guides
