# SCORM-Compliant HTTP Service Design

**Date:** 2025-11-13
**Status:** Approved

## Executive Summary

Refactor the HttpService to provide SCORM-compliant synchronous commits by default, while maintaining backward compatibility with the legacy asynchronous behavior. The current implementation always returns success to the SCO without waiting for actual LMS responses, violating SCORM's error-reporting contract.

## Problem Statement

### Current Behavior (Non-Compliant)

The current implementation has a critical SCORM compliance issue in `Scorm12API.ts:157-159`:

```typescript
lmsCommit(): string {
  if (this.settings.throttleCommits) {
    this.scheduleCommit(500, "LMSCommit");
  } else {
    (async () => {
      await this.commit("LMSCommit", false);
    })();
  }
  return global_constants.SCORM_TRUE; // Always returns success immediately!
}
```

The method fires an async operation but immediately returns `SCORM_TRUE` without waiting for the actual HTTP result. The SCO never learns if the commit actually failed, which can cause data loss.

### SCORM Requirement

SCORM 1.2 specification requires that API methods return "true" or "false" based on actual success/failure. The current async implementation violates this contract.

## Solution Architecture

### Two HTTP Service Implementations

**1. SynchronousHttpService (default, SCORM-compliant)**
- Uses synchronous XMLHttpRequest for standard commits
- Returns `ResultObject` directly (no Promises)
- During termination (`immediate=true`): uses `sendBeacon()` (fire-and-forget)
- Cannot be throttled - each commit blocks until complete
- Complies with SCORM error-reporting requirements

**2. AsynchronousHttpService (legacy compatibility)**
- Renamed from current `HttpService`
- Uses async fetch/beacon with background execution
- Returns optimistic success `ResultObject` immediately
- Can be throttled (existing behavior)
- **Not SCORM-compliant** - warns users about data loss risk
- Preserved for legacy applications that depend on async behavior

### Interface Changes

```typescript
// src/interfaces/services.ts
export interface IHttpService {
  processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean,
    apiLog: Function,
    processListeners: Function,
  ): ResultObject;  // Changed from Promise<ResultObject>

  updateSettings(settings: InternalSettings): void;
}
```

### Settings Configuration

```typescript
// New settings
Settings = {
  useAsynchronousCommits: false,     // default: synchronous (SCORM-compliant)
  throttleCommits: false,            // forced to false when useAsynchronousCommits=false
  httpService: null,                 // optional: inject custom IHttpService implementation
  responseHandler: async (response: Response) => Promise<ResultObject>,  // for fetch
  xhrResponseHandler: (xhr: XMLHttpRequest) => ResultObject,             // for XHR
}
```

**Validation Rules:**
- If `useAsynchronousCommits = false` and `throttleCommits = true` → log warning and force `throttleCommits = false`
- If `httpService` is provided → use it directly (advanced users)
- If `httpService` is null → auto-select based on `useAsynchronousCommits` flag

### BaseAPI Changes

Remove all `async`/`await` from the commit chain:

```typescript
// Before (async)
async commit(callbackName: string, checkTerminated: boolean): Promise<string>
async terminate(callbackName: string, checkTerminated: boolean): Promise<string>
abstract storeData(_calculateTotalTime: boolean): Promise<ResultObject>

// After (synchronous)
commit(callbackName: string, checkTerminated: boolean): string
terminate(callbackName: string, checkTerminated: boolean): string
abstract storeData(_calculateTotalTime: boolean): ResultObject
```

### Event-Based Offline Sync

Move offline sync out of terminate's critical path:

```typescript
// Fire event before termination
this.processListeners("BeforeTerminate");

// Then proceed with synchronous commit
const result = this.storeData(true);

// OfflineStorageService listens and syncs in background
this._eventService.on("BeforeTerminate", () => {
  if (this._offlineStorageService?.isDeviceOnline()) {
    this._offlineStorageService.syncOfflineData()
      .then(() => this.processListeners("OfflineDataSynced"))
      .catch(() => this.processListeners("OfflineDataSyncFailed"));
  }
});
```

## Implementation Details

### SynchronousHttpService

```typescript
export class SynchronousHttpService implements IHttpService {
  processHttpRequest(...): ResultObject {
    if (immediate) {
      // Termination: use sendBeacon (fire-and-forget)
      const beaconSuccess = this.performBeacon(url, params);
      return {
        result: beaconSuccess ? "true" : "false",
        errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL
      };
    }

    // Standard commit: synchronous XHR (blocks until complete)
    return this.performSyncXHR(url, params);
  }

  private performSyncXHR(url: string, params: ...): ResultObject {
    const { body, contentType } = this._prepareRequestBody(params);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false); // false = synchronous!
    xhr.setRequestHeader("Content-Type", contentType);

    // Apply headers and credentials from settings
    Object.entries(this.settings.xhrHeaders).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });
    if (this.settings.xhrWithCredentials) {
      xhr.withCredentials = true;
    }

    try {
      xhr.send(body);
      return this.settings.xhrResponseHandler(xhr);
    } catch (e) {
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL || 101,
        errorMessage: e instanceof Error ? e.message : String(e),
      };
    }
  }
}
```

### AsynchronousHttpService

```typescript
export class AsynchronousHttpService implements IHttpService {
  processHttpRequest(...): ResultObject {
    // Fire request in background - don't wait for result
    this._performAsyncRequest(url, params, immediate, apiLog, processListeners);

    // Immediately return optimistic success
    return {
      result: global_constants.SCORM_TRUE,
      errorCode: 0,
    };
  }

  private async _performAsyncRequest(...): Promise<void> {
    try {
      const processedParams = this.settings.requestHandler(params);
      const response = immediate && this.settings.useBeaconInsteadOfFetch !== "never"
        ? await this.performBeacon(url, processedParams)
        : await this.performFetch(url, processedParams);

      const result = await this.settings.responseHandler(response);

      // Trigger listeners based on actual result (after API method returns)
      if (this._isSuccessResponse(response, result)) {
        processListeners("CommitSuccess");
      } else {
        processListeners("CommitError", undefined, result.errorCode);
      }
    } catch (e) {
      apiLog("processHttpRequest", `Async request failed: ${e.message}`, LogLevelEnum.ERROR);
      processListeners("CommitError");
    }
  }
}
```

### Response Handler Split

Two separate handlers to accommodate sync vs async parsing:

```typescript
// Default async handler for fetch Response
responseHandler: async function (response: Response): Promise<ResultObject> {
  let httpResult = null;
  try {
    httpResult = await response.json();
  } catch (e) {
    // Parsing failed
  }

  if (httpResult === null || !httpResult.hasOwnProperty("result")) {
    return {
      result: response.status === 200 ? global_constants.SCORM_TRUE : global_constants.SCORM_FALSE,
      errorCode: response.status === 200 ? 0 : 101,
    };
  }
  return {
    result: httpResult.result,
    errorCode: httpResult.errorCode || (httpResult.result === global_constants.SCORM_TRUE ? 0 : 101),
  };
}

// Default sync handler for XMLHttpRequest
xhrResponseHandler: function (xhr: XMLHttpRequest): ResultObject {
  let httpResult = null;
  if (xhr.status >= 200 && xhr.status <= 299) {
    try {
      httpResult = JSON.parse(xhr.responseText);
    } catch (e) {
      // Parsing failed, but status was success
    }

    if (httpResult === null || !httpResult.hasOwnProperty("result")) {
      return { result: global_constants.SCORM_TRUE, errorCode: 0 };
    }
    return {
      result: httpResult.result,
      errorCode: httpResult.errorCode || (httpResult.result === global_constants.SCORM_TRUE ? 0 : 101),
    };
  }
  return { result: global_constants.SCORM_FALSE, errorCode: 101 };
}
```

### Service Selection in BaseAPI

```typescript
// Constructor
protected constructor(error_codes: ErrorCode, settings?: Settings, httpService?: IHttpService, ...) {
  // Merge settings
  if (settings) {
    this.settings = { ...DefaultSettings, ...settings } as InternalSettings;
  }

  // VALIDATION: Enforce throttleCommits incompatibility
  if (!this.settings.useAsynchronousCommits && this.settings.throttleCommits) {
    this.apiLog(
      "constructor",
      "throttleCommits cannot be used with synchronous commits. Setting throttleCommits to false.",
      LogLevelEnum.WARN
    );
    this.settings.throttleCommits = false;
  }

  // HTTP SERVICE SELECTION
  if (httpService) {
    this._httpService = httpService;
  } else if (this.settings.httpService) {
    this._httpService = this.settings.httpService;
  } else {
    if (this.settings.useAsynchronousCommits) {
      this.apiLog(
        "constructor",
        "WARNING: useAsynchronousCommits=true is not SCORM compliant. " +
        "Commit failures will not be reported to the SCO, which may cause data loss. " +
        "This setting should only be used for specific legacy compatibility cases.",
        LogLevelEnum.WARN
      );
      this._httpService = new AsynchronousHttpService(this.settings, this._error_codes);
    } else {
      this._httpService = new SynchronousHttpService(this.settings, this._error_codes);
    }
  }
}
```

## Testing Strategy

### Unit Tests

**SynchronousHttpService:**
- Sync XHR with successful response (2xx)
- Sync XHR with HTTP error (4xx, 5xx)
- Sync XHR with network error/exception
- sendBeacon on `immediate=true`
- xhrResponseHandler invocation
- Request transformation and header application

**AsynchronousHttpService:**
- Async fetch returns immediate optimistic success
- CommitSuccess event fires after successful background request
- CommitError event fires after failed background request
- responseHandler invocation
- Beacon vs fetch selection on immediate flag

**BaseAPI Integration:**
- `useAsynchronousCommits=false` selects SynchronousHttpService
- `useAsynchronousCommits=true` selects AsynchronousHttpService and logs warning
- `throttleCommits` validation (forced to false when sync)
- `httpService` injection overrides auto-selection
- `commit()` returns actual result synchronously with sync service
- `commit()` returns immediate success with async service
- BeforeTerminate event fires before termination commit

## Migration Guide

### For Existing Users (Default Behavior Changes)

**v3.x (current):**
```javascript
const api = new Scorm12API({
  lmsCommitUrl: "/commit"
});
// Commits were always async, always returned "true" immediately
```

**v4.x (after this change):**
```javascript
const api = new Scorm12API({
  lmsCommitUrl: "/commit"
});
// Commits are now synchronous by default (SCORM-compliant)
// LMSCommit() will block until server responds
// Returns actual "true"/"false" based on LMS response
```

### To Preserve Legacy Async Behavior

```javascript
const api = new Scorm12API({
  lmsCommitUrl: "/commit",
  useAsynchronousCommits: true  // Opt-in to legacy behavior
});
// WARNING will be logged about SCORM non-compliance
```

### Custom Response Handling

Users with custom `responseHandler` need to add `xhrResponseHandler`:

```javascript
const api = new Scorm12API({
  lmsCommitUrl: "/commit",

  // Async handler for fetch (when using useAsynchronousCommits: true)
  responseHandler: async (response) => {
    const data = await response.json();
    return { result: data.success ? "true" : "false", errorCode: data.code };
  },

  // NEW: Sync handler for XHR (when using useAsynchronousCommits: false, default)
  xhrResponseHandler: (xhr) => {
    const data = JSON.parse(xhr.responseText);
    return { result: data.success ? "true" : "false", errorCode: data.code };
  }
});
```

## Breaking Changes

1. **Default behavior is now synchronous** - commits block until LMS responds
2. **`commit()` and `terminate()` are no longer async** - signature changed from `Promise<string>` to `string`
3. **`storeData()` is no longer async** - signature changed from `Promise<ResultObject>` to `ResultObject`
4. **New required setting**: `xhrResponseHandler` (with sensible default)
5. **Offline sync moved to event-based** - no longer blocks terminate

## Benefits

1. **SCORM Compliance** - API methods now correctly report actual success/failure
2. **Data Integrity** - SCOs can detect and handle commit failures
3. **Backward Compatibility** - Legacy async behavior available via opt-in flag
4. **Clear Separation** - Two distinct implementations for two distinct use cases
5. **Event-Driven Offline Sync** - Cleaner architecture, doesn't block termination

## References

- SCORM 1.2 Run-Time Environment, ADL, §3.3 (LMSFinish, LMSCommit return values)
- Existing compliance review: `docs/scorm12_compliance_review.md`
