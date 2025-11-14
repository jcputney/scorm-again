# SCORM-Compliant HTTP Service Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refactor HttpService to provide SCORM-compliant synchronous commits by default while maintaining backward compatibility with asynchronous behavior.

**Architecture:** Split HttpService into two implementations - SynchronousHttpService (default) using synchronous XMLHttpRequest, and AsynchronousHttpService (legacy) using async fetch. Remove async/await from the entire commit chain to enable synchronous error reporting to SCOs.

**Tech Stack:** TypeScript, XMLHttpRequest, Fetch API, Vitest (testing)

---

## Task 1: Update IHttpService Interface

**Files:**
- Modify: `src/interfaces/services.ts:16-40`

**Step 1: Write failing test for synchronous return type**

Create: `test/services/IHttpService.spec.ts`

```typescript
import { describe, it, expect } from "vitest";
import { IHttpService } from "../../src/interfaces/services";
import { ResultObject } from "../../src/types/api_types";
import { global_constants } from "../../src/constants/api_constants";

describe("IHttpService Interface", () => {
  it("should define processHttpRequest with synchronous ResultObject return", () => {
    // Create a mock implementation
    const mockService: IHttpService = {
      processHttpRequest: () => ({
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      }),
      updateSettings: () => {},
    };

    const result = mockService.processHttpRequest(
      "http://test.com",
      {},
      false,
      () => {},
      () => {},
    );

    // Should return ResultObject directly, not Promise
    expect(result).toHaveProperty("result");
    expect(result).toHaveProperty("errorCode");
    expect(result.result).toBe(global_constants.SCORM_TRUE);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- test/services/IHttpService.spec.ts`
Expected: FAIL - test file doesn't exist yet

**Step 3: Update IHttpService interface**

Modify: `src/interfaces/services.ts:16-40`

```typescript
/**
 * Interface for HTTP service
 */
export interface IHttpService {
  /**
   * Send the request to the LMS
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @param {boolean} immediate - Whether to send the request immediately
   * @param {Function} apiLog - Function to log API messages
   * @param {Function} processListeners - Function to process event listeners
   * @return {ResultObject} - The result of the request (synchronous)
   */
  processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean,
    apiLog: (
      functionName: string,
      message: any,
      messageLevel: LogLevelEnum,
      CMIElement?: string,
    ) => void,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void,
  ): ResultObject;

  /**
   * Update the service settings
   * @param {Settings} settings - The new settings
   */
  updateSettings(settings: Settings): void;
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- test/services/IHttpService.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/interfaces/services.ts test/services/IHttpService.spec.ts
git commit -m "feat: update IHttpService to return synchronous ResultObject"
```

---

## Task 2: Add New Settings Types

**Files:**
- Modify: `src/types/api_types.ts:8-89`

**Step 1: Write failing test for new settings**

Create: `test/types/new_settings.spec.ts`

```typescript
import { describe, it, expect } from "vitest";
import { Settings, InternalSettings } from "../../src/types/api_types";

describe("New HTTP Service Settings", () => {
  it("should allow useAsynchronousCommits in Settings", () => {
    const settings: Settings = {
      useAsynchronousCommits: false,
    };
    expect(settings.useAsynchronousCommits).toBe(false);
  });

  it("should allow httpService in Settings", () => {
    const settings: Settings = {
      httpService: null,
    };
    expect(settings.httpService).toBeNull();
  });

  it("should allow xhrResponseHandler in Settings", () => {
    const settings: Settings = {
      xhrResponseHandler: (xhr: XMLHttpRequest) => ({
        result: "true",
        errorCode: 0,
      }),
    };
    expect(typeof settings.xhrResponseHandler).toBe("function");
  });

  it("should require useAsynchronousCommits in InternalSettings", () => {
    const settings: InternalSettings = {
      useAsynchronousCommits: false,
    } as InternalSettings;
    expect(settings.useAsynchronousCommits).toBeDefined();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- test/types/new_settings.spec.ts`
Expected: FAIL - properties don't exist on types

**Step 3: Add new properties to Settings type**

Modify: `src/types/api_types.ts` - Add to Settings type (after line 11):

```typescript
export type Settings = {
  autocommit?: boolean | undefined;
  autocommitSeconds?: number | undefined;
  throttleCommits?: boolean | undefined;
  useAsynchronousCommits?: boolean | undefined;
  sendFullCommit?: boolean | undefined;
  lmsCommitUrl?: boolean | string | undefined;
  dataCommitFormat?: string | undefined;
  commitRequestDataType?: string | undefined;
  autoProgress?: boolean | undefined;
  logLevel?: number | undefined;
  selfReportSessionTime?: boolean | undefined;
  alwaysSendTotalTime?: boolean | undefined;
  renderCommonCommitFields?: boolean | undefined;
  autoCompleteLessonStatus?: boolean | undefined;
  strict_errors?: boolean | undefined;
  xhrHeaders?: Record<string, string> | undefined;
  xhrWithCredentials?: boolean | undefined;
  fetchMode?: RequestMode | undefined;
  useBeaconInsteadOfFetch?: "always" | "never" | "onTerminationOnly" | undefined;
  responseHandler?: ((response: Response) => Promise<ResultObject>) | undefined;
  xhrResponseHandler?: ((xhr: XMLHttpRequest) => ResultObject) | undefined;
  requestHandler?: ((commitObject: any) => any) | undefined;
  onLogMessage?: ((messageLevel: LogLevel, logMessage: string) => void) | undefined;
  mastery_override?: boolean | undefined;
  scoItemIds?: string[] | undefined;
  scoItemIdValidator?: boolean | undefined;
  globalObjectiveIds?: string[] | undefined;
  enableOfflineSupport?: boolean | undefined;
  courseId?: string | undefined;
  syncOnInitialize?: boolean | undefined;
  syncOnTerminate?: boolean | undefined;
  maxSyncAttempts?: number | undefined;
  httpService?: IHttpService | null | undefined;
};
```

**Step 4: Add new properties to InternalSettings type**

Modify: `src/types/api_types.ts` - Add to InternalSettings type (after line 53):

```typescript
export type InternalSettings = {
  autocommit: boolean;
  autocommitSeconds: number;
  throttleCommits: boolean;
  useAsynchronousCommits: boolean;
  sendFullCommit: boolean;
  lmsCommitUrl: string | boolean;
  dataCommitFormat: string;
  commitRequestDataType: string;
  autoProgress: boolean;
  logLevel: number;
  selfReportSessionTime: boolean;
  alwaysSendTotalTime: boolean;
  renderCommonCommitFields: boolean;
  autoCompleteLessonStatus: boolean;
  strict_errors: boolean;
  xhrHeaders: Record<string, string>;
  xhrWithCredentials: boolean;
  fetchMode: RequestMode;
  useBeaconInsteadOfFetch: "always" | "never" | "onTerminationOnly";
  responseHandler: (response: Response) => Promise<ResultObject>;
  xhrResponseHandler: (xhr: XMLHttpRequest) => ResultObject;
  requestHandler: (commitObject: any) => any;
  onLogMessage: (messageLevel: LogLevel, logMessage: string) => void;
  mastery_override?: boolean;
  scoItemIds: string[];
  scoItemIdValidator: boolean;
  globalObjectiveIds: string[];
  enableOfflineSupport: boolean;
  courseId: string;
  syncOnInitialize: boolean;
  syncOnTerminate: boolean;
  maxSyncAttempts: number;
  httpService: IHttpService | null;
};
```

**Step 5: Run test to verify it passes**

Run: `npm test -- test/types/new_settings.spec.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/types/api_types.ts test/types/new_settings.spec.ts
git commit -m "feat: add useAsynchronousCommits, httpService, and xhrResponseHandler settings"
```

---

## Task 3: Update Default Settings

**Files:**
- Modify: `src/constants/default_settings.ts:8-89`

**Step 1: Write test for new default settings**

Modify: `test/types/api_types.spec.ts` - Add new tests after existing ones:

```typescript
it("should have useAsynchronousCommits default to false", () => {
  expect(DefaultSettings.useAsynchronousCommits).toBe(false);
});

it("should have httpService default to null", () => {
  expect(DefaultSettings.httpService).toBeNull();
});

it("should have xhrResponseHandler default function", () => {
  expect(typeof DefaultSettings.xhrResponseHandler).toBe("function");
});

it("xhrResponseHandler should parse successful XHR response", () => {
  const mockXHR = {
    status: 200,
    responseText: '{"result":"true","errorCode":0}',
  } as XMLHttpRequest;

  const result = DefaultSettings.xhrResponseHandler(mockXHR);
  expect(result.result).toBe("true");
  expect(result.errorCode).toBe(0);
});

it("xhrResponseHandler should handle failed XHR response", () => {
  const mockXHR = {
    status: 500,
    responseText: "",
  } as XMLHttpRequest;

  const result = DefaultSettings.xhrResponseHandler(mockXHR);
  expect(result.result).toBe(global_constants.SCORM_FALSE);
  expect(result.errorCode).toBe(101);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- test/types/api_types.spec.ts`
Expected: FAIL - properties don't exist on DefaultSettings

**Step 3: Add new defaults to DefaultSettings**

Modify: `src/constants/default_settings.ts:8-89`

```typescript
import { InternalSettings, LogLevel, ResultObject } from "../types/api_types";
import { global_constants } from "./api_constants";
import { LogLevelEnum } from "./enums";

/**
 * Default settings for the SCORM API
 */
export const DefaultSettings: InternalSettings = {
  autocommit: false,
  autocommitSeconds: 10,
  throttleCommits: false,
  useAsynchronousCommits: false,
  sendFullCommit: true,
  lmsCommitUrl: false,
  dataCommitFormat: "json",
  commitRequestDataType: "application/json;charset=UTF-8",
  autoProgress: false,
  logLevel: LogLevelEnum.ERROR,
  selfReportSessionTime: false,
  alwaysSendTotalTime: false,
  renderCommonCommitFields: false,
  autoCompleteLessonStatus: false,
  strict_errors: true,
  xhrHeaders: {},
  xhrWithCredentials: false,
  fetchMode: "cors",
  useBeaconInsteadOfFetch: "never",
  responseHandler: async function (response: Response): Promise<ResultObject> {
    if (typeof response !== "undefined") {
      let httpResult = null;

      // Handle both text() and json() response methods
      try {
        if (typeof response.json === "function") {
          httpResult = await response.json();
        } else if (typeof response.text === "function") {
          const responseText = await response.text();
          if (responseText) {
            httpResult = JSON.parse(responseText);
          }
        }
      } catch (e) {
        // If parsing fails, continue with null httpResult
      }

      if (httpResult === null || !{}.hasOwnProperty.call(httpResult, "result")) {
        if (response.status === 200) {
          return {
            result: global_constants.SCORM_TRUE,
            errorCode: 0,
          };
        } else {
          return {
            result: global_constants.SCORM_FALSE,
            errorCode: 101,
          };
        }
      } else {
        return {
          result: httpResult.result,
          errorCode: httpResult.errorCode
            ? httpResult.errorCode
            : httpResult.result === global_constants.SCORM_TRUE
              ? 0
              : 101,
        };
      }
    }
    return {
      result: global_constants.SCORM_FALSE,
      errorCode: 101,
    };
  },
  xhrResponseHandler: function (xhr: XMLHttpRequest): ResultObject {
    if (typeof xhr !== "undefined") {
      let httpResult = null;

      if (xhr.status >= 200 && xhr.status <= 299) {
        try {
          httpResult = JSON.parse(xhr.responseText);
        } catch (e) {
          // Parsing failed, but status was success
        }

        if (httpResult === null || !{}.hasOwnProperty.call(httpResult, "result")) {
          return { result: global_constants.SCORM_TRUE, errorCode: 0 };
        }
        return {
          result: httpResult.result,
          errorCode: httpResult.errorCode
            ? httpResult.errorCode
            : httpResult.result === global_constants.SCORM_TRUE
              ? 0
              : 101,
        };
      } else {
        return { result: global_constants.SCORM_FALSE, errorCode: 101 };
      }
    }
    return { result: global_constants.SCORM_FALSE, errorCode: 101 };
  },
  requestHandler: function (commitObject) {
    return commitObject;
  },
  onLogMessage: defaultLogHandler,
  scoItemIds: [],
  scoItemIdValidator: false,
  globalObjectiveIds: [],

  // Offline support settings
  enableOfflineSupport: false,
  courseId: "",
  syncOnInitialize: true,
  syncOnTerminate: true,
  maxSyncAttempts: 5,

  // HTTP service settings
  httpService: null,
};
```

**Step 4: Run test to verify it passes**

Run: `npm test -- test/types/api_types.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/constants/default_settings.ts test/types/api_types.spec.ts
git commit -m "feat: add default values for new HTTP service settings"
```

---

## Task 4: Create SynchronousHttpService

**Files:**
- Create: `src/services/SynchronousHttpService.ts`
- Create: `test/services/SynchronousHttpService.spec.ts`

**Step 1: Write failing test for SynchronousHttpService**

Create: `test/services/SynchronousHttpService.spec.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SynchronousHttpService } from "../../src/services/SynchronousHttpService";
import { DefaultSettings } from "../../src/constants/default_settings";
import { scorm12_error_codes } from "../../src/constants/error_codes";
import { global_constants } from "../../src/constants/api_constants";
import { LogLevelEnum } from "../../src/constants/enums";

describe("SynchronousHttpService", () => {
  let service: SynchronousHttpService;
  let mockApiLog: any;
  let mockProcessListeners: any;

  beforeEach(() => {
    service = new SynchronousHttpService(DefaultSettings, scorm12_error_codes);
    mockApiLog = vi.fn();
    mockProcessListeners = vi.fn();
  });

  describe("processHttpRequest - synchronous mode", () => {
    it("should use sync XHR when immediate=false", () => {
      // Mock XMLHttpRequest
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      global.XMLHttpRequest = vi.fn(() => mockXHR) as any;

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockXHR.open).toHaveBeenCalledWith("POST", "http://test.com/commit", false);
      expect(result.result).toBe("true");
      expect(result.errorCode).toBe(0);
    });

    it("should handle XHR success response", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      global.XMLHttpRequest = vi.fn(() => mockXHR) as any;

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe("true");
      expect(result.errorCode).toBe(0);
    });

    it("should handle XHR error response", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 500,
        statusText: "Internal Server Error",
        responseText: "",
      };
      global.XMLHttpRequest = vi.fn(() => mockXHR) as any;

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(101);
    });

    it("should handle XHR network error", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(() => {
          throw new Error("Network error");
        }),
      };
      global.XMLHttpRequest = vi.fn(() => mockXHR) as any;

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe(global_constants.SCORM_FALSE);
      expect(result.errorCode).toBe(101);
    });
  });

  describe("processHttpRequest - immediate mode", () => {
    it("should use sendBeacon when immediate=true", () => {
      const mockBeacon = vi.fn().mockReturnValue(true);
      global.navigator.sendBeacon = mockBeacon;

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        true,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockBeacon).toHaveBeenCalled();
      expect(result.result).toBe("true");
      expect(result.errorCode).toBe(0);
    });

    it("should handle sendBeacon failure", () => {
      const mockBeacon = vi.fn().mockReturnValue(false);
      global.navigator.sendBeacon = mockBeacon;

      const result = service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        true,
        mockApiLog,
        mockProcessListeners,
      );

      expect(result.result).toBe("false");
      expect(result.errorCode).toBe(101);
    });
  });

  describe("headers and credentials", () => {
    it("should apply custom headers from settings", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
      };
      global.XMLHttpRequest = vi.fn(() => mockXHR) as any;

      const customSettings = {
        ...DefaultSettings,
        xhrHeaders: { Authorization: "Bearer token123" },
      };
      service.updateSettings(customSettings);

      service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockXHR.setRequestHeader).toHaveBeenCalledWith("Authorization", "Bearer token123");
    });

    it("should set withCredentials when enabled", () => {
      const mockXHR = {
        open: vi.fn(),
        setRequestHeader: vi.fn(),
        send: vi.fn(),
        status: 200,
        responseText: '{"result":"true","errorCode":0}',
        withCredentials: false,
      };
      global.XMLHttpRequest = vi.fn(() => mockXHR) as any;

      const customSettings = {
        ...DefaultSettings,
        xhrWithCredentials: true,
      };
      service.updateSettings(customSettings);

      service.processHttpRequest(
        "http://test.com/commit",
        { cmi: {} },
        false,
        mockApiLog,
        mockProcessListeners,
      );

      expect(mockXHR.withCredentials).toBe(true);
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- test/services/SynchronousHttpService.spec.ts`
Expected: FAIL - SynchronousHttpService class doesn't exist

**Step 3: Implement SynchronousHttpService**

Create: `src/services/SynchronousHttpService.ts`

```typescript
import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { global_constants } from "../constants/api_constants";
import { IHttpService } from "../interfaces/services";
import { ErrorCode } from "../constants/error_codes";
import { StringKeyMap } from "../utilities";

/**
 * Service for handling synchronous HTTP communication with the LMS
 * Uses synchronous XMLHttpRequest for SCORM-compliant error reporting
 */
export class SynchronousHttpService implements IHttpService {
  private settings: InternalSettings;
  private error_codes: ErrorCode;

  /**
   * Constructor for SynchronousHttpService
   * @param {InternalSettings} settings - The settings object
   * @param {ErrorCode} error_codes - The error codes object
   */
  constructor(settings: InternalSettings, error_codes: ErrorCode) {
    this.settings = settings;
    this.error_codes = error_codes;
  }

  /**
   * Sends synchronous HTTP requests to the LMS
   * @param {string} url - The URL endpoint to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
   * @param {boolean} immediate - Whether this is a termination commit (use sendBeacon)
   * @param {Function} apiLog - Function to log API messages with appropriate levels
   * @param {Function} processListeners - Function to trigger event listeners for commit events
   * @return {ResultObject} - The result of the request (synchronous)
   */
  processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean = false,
    apiLog: (functionName: string, message: any, messageLevel: number, CMIElement?: string) => void,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void,
  ): ResultObject {
    if (immediate) {
      // Termination: use sendBeacon (fire-and-forget, best effort)
      return this._handleImmediateRequest(url, params);
    }

    // Standard commit: synchronous XHR (blocks until complete)
    return this._performSyncXHR(url, params);
  }

  /**
   * Handles an immediate request using sendBeacon
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @return {ResultObject} - The result based on beacon success
   * @private
   */
  private _handleImmediateRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
  ): ResultObject {
    const requestPayload = this.settings.requestHandler(params) ?? params;
    const { body, contentType } = this._prepareRequestBody(requestPayload);

    const beaconSuccess = navigator.sendBeacon(url, new Blob([body], { type: contentType }));

    return {
      result: beaconSuccess ? "true" : "false",
      errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL || 101,
    };
  }

  /**
   * Performs a synchronous XMLHttpRequest
   * @param {string} url - The URL to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @return {ResultObject} - The result of the request
   * @private
   */
  private _performSyncXHR(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
  ): ResultObject {
    const requestPayload = this.settings.requestHandler(params) ?? params;
    const { body, contentType } = this._prepareRequestBody(requestPayload);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, false); // false = synchronous!

    // Set headers
    xhr.setRequestHeader("Content-Type", contentType);
    Object.entries(this.settings.xhrHeaders).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    // Set credentials
    if (this.settings.xhrWithCredentials) {
      xhr.withCredentials = true;
    }

    try {
      xhr.send(body);
      return this.settings.xhrResponseHandler(xhr);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this.error_codes.GENERAL || 101,
        errorMessage: message,
      };
    }
  }

  /**
   * Prepares the request body and content type based on params type
   * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
   * @return {Object} - Object containing body and contentType
   * @private
   */
  private _prepareRequestBody(params: CommitObject | StringKeyMap | Array<any>): {
    body: string;
    contentType: string;
  } {
    const body = params instanceof Array ? params.join("&") : JSON.stringify(params);
    const contentType =
      params instanceof Array
        ? "application/x-www-form-urlencoded"
        : this.settings.commitRequestDataType;

    return { body, contentType };
  }

  /**
   * Updates the service settings
   * @param {InternalSettings} settings - The new settings
   */
  updateSettings(settings: InternalSettings): void {
    this.settings = settings;
  }
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- test/services/SynchronousHttpService.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/services/SynchronousHttpService.ts test/services/SynchronousHttpService.spec.ts
git commit -m "feat: implement SynchronousHttpService with sync XHR and sendBeacon"
```

---

## Task 5: Rename HttpService to AsynchronousHttpService

**Files:**
- Rename: `src/services/HttpService.ts` → `src/services/AsynchronousHttpService.ts`
- Modify: `test/services/HttpService.spec.ts` → rename and update

**Step 1: Create test file for AsynchronousHttpService**

Run: `cp test/services/HttpService.spec.ts test/services/AsynchronousHttpService.spec.ts`

Modify: `test/services/AsynchronousHttpService.spec.ts` - Update imports and class name:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AsynchronousHttpService } from "../../src/services/AsynchronousHttpService";
// ... rest of imports stay the same

describe("AsynchronousHttpService", () => {
  let service: AsynchronousHttpService;
  // ... rest of setup

  beforeEach(() => {
    service = new AsynchronousHttpService(DefaultSettings, scorm12_error_codes);
    // ... rest of setup
  });

  it("should return immediate success for async commits", () => {
    const result = service.processHttpRequest(
      "http://test.com/commit",
      { cmi: {} },
      false,
      mockApiLog,
      mockProcessListeners,
    );

    // Should return immediately with success
    expect(result.result).toBe(global_constants.SCORM_TRUE);
    expect(result.errorCode).toBe(0);
  });

  // Keep existing tests but verify they test async behavior
  // ... rest of tests
});
```

**Step 2: Rename and update HttpService.ts**

Run: `git mv src/services/HttpService.ts src/services/AsynchronousHttpService.ts`

Modify: `src/services/AsynchronousHttpService.ts` - Update class name and behavior:

```typescript
import { CommitObject, InternalSettings, ResultObject } from "../types/api_types";
import { global_constants } from "../constants/api_constants";
import { LogLevelEnum } from "../constants/enums";
import { IHttpService } from "../interfaces/services";
import { ErrorCode } from "../constants/error_codes";
import { StringKeyMap } from "../utilities";

/**
 * Service for handling asynchronous HTTP communication with the LMS
 * WARNING: Not SCORM-compliant - always returns immediate success
 */
export class AsynchronousHttpService implements IHttpService {
  private settings: InternalSettings;
  private error_codes: ErrorCode;

  constructor(settings: InternalSettings, error_codes: ErrorCode) {
    this.settings = settings;
    this.error_codes = error_codes;
  }

  /**
   * Sends HTTP requests asynchronously to the LMS
   * Returns immediate success - actual result handled via events
   * @param {string} url - The URL endpoint to send the request to
   * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
   * @param {boolean} immediate - Whether to send the request immediately without waiting
   * @param {Function} apiLog - Function to log API messages with appropriate levels
   * @param {Function} processListeners - Function to trigger event listeners for commit events
   * @return {ResultObject} - Immediate optimistic success result
   */
  processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean = false,
    apiLog: (
      functionName: string,
      message: any,
      messageLevel: LogLevelEnum,
      CMIElement?: string,
    ) => void,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void,
  ): ResultObject {
    // Fire request in background - don't wait for result
    this._performAsyncRequest(url, params, immediate, apiLog, processListeners);

    // Immediately return optimistic success
    return {
      result: global_constants.SCORM_TRUE,
      errorCode: 0,
    };
  }

  /**
   * Performs the async request in the background
   * @private
   */
  private async _performAsyncRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean,
    apiLog: (
      functionName: string,
      message: any,
      messageLevel: LogLevelEnum,
      CMIElement?: string,
    ) => void,
    processListeners: (functionName: string, CMIElement?: string, value?: any) => void,
  ): Promise<void> {
    try {
      const processedParams = this.settings.requestHandler(params) as
        | CommitObject
        | StringKeyMap
        | Array<any>;

      let response: Response;
      if (immediate && this.settings.useBeaconInsteadOfFetch !== "never") {
        response = await this.performBeacon(url, processedParams);
      } else {
        response = await this.performFetch(url, processedParams);
      }

      const result = await this.transformResponse(response, processListeners);

      // Trigger listeners based on actual result (after API method returns)
      if (this._isSuccessResponse(response, result)) {
        processListeners("CommitSuccess");
      } else {
        processListeners("CommitError", undefined, result.errorCode);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      apiLog("processHttpRequest", `Async request failed: ${message}`, LogLevelEnum.ERROR);
      processListeners("CommitError");
    }
  }

  // Keep all existing private methods unchanged:
  // - performFetch
  // - performBeacon
  // - transformResponse
  // - _prepareRequestBody
  // - _isSuccessResponse
  // ... (copy from original HttpService.ts)

  updateSettings(settings: InternalSettings): void {
    this.settings = settings;
  }
}
```

**Step 3: Update all imports in codebase**

Modify: `src/BaseAPI.ts:16`

```typescript
import { AsynchronousHttpService } from "./services/AsynchronousHttpService";
import { SynchronousHttpService } from "./services/SynchronousHttpService";
```

**Step 4: Run tests to verify rename worked**

Run: `npm test -- test/services/AsynchronousHttpService.spec.ts`
Expected: PASS

**Step 5: Commit**

```bash
git add src/services/AsynchronousHttpService.ts test/services/AsynchronousHttpService.spec.ts src/BaseAPI.ts
git rm src/services/HttpService.ts test/services/HttpService.spec.ts
git commit -m "refactor: rename HttpService to AsynchronousHttpService"
```

---

## Task 6: Update BaseAPI Constructor for Service Selection

**Files:**
- Modify: `src/BaseAPI.ts:63-158`

**Step 1: Write test for service selection logic**

Create: `test/api/BaseAPI.httpservice.spec.ts`

```typescript
import { describe, it, expect, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import { SynchronousHttpService } from "../../src/services/SynchronousHttpService";
import { AsynchronousHttpService } from "../../src/services/AsynchronousHttpService";

describe("BaseAPI HTTP Service Selection", () => {
  it("should use SynchronousHttpService by default", () => {
    const api = new Scorm12API();
    // Access private _httpService via reflection
    const service = (api as any)._httpService;
    expect(service).toBeInstanceOf(SynchronousHttpService);
  });

  it("should use AsynchronousHttpService when useAsynchronousCommits=true", () => {
    const api = new Scorm12API({ useAsynchronousCommits: true });
    const service = (api as any)._httpService;
    expect(service).toBeInstanceOf(AsynchronousHttpService);
  });

  it("should warn when useAsynchronousCommits=true", () => {
    const warnSpy = vi.spyOn(console, "warn");
    new Scorm12API({ useAsynchronousCommits: true });
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("WARNING: useAsynchronousCommits=true is not SCORM compliant"),
    );
    warnSpy.mockRestore();
  });

  it("should use injected httpService from settings", () => {
    const customService = new SynchronousHttpService(
      {} as any,
      {} as any,
    );
    const api = new Scorm12API({ httpService: customService });
    const service = (api as any)._httpService;
    expect(service).toBe(customService);
  });

  it("should use injected httpService from constructor", () => {
    const customService = new AsynchronousHttpService(
      {} as any,
      {} as any,
    );
    const api = new Scorm12API({}, customService);
    const service = (api as any)._httpService;
    expect(service).toBe(customService);
  });

  it("should force throttleCommits=false when useAsynchronousCommits=false", () => {
    const warnSpy = vi.spyOn(console, "warn");
    const api = new Scorm12API({
      useAsynchronousCommits: false,
      throttleCommits: true,
    });
    expect((api as any).settings.throttleCommits).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("throttleCommits cannot be used with synchronous commits"),
    );
    warnSpy.mockRestore();
  });

  it("should allow throttleCommits=true when useAsynchronousCommits=true", () => {
    const api = new Scorm12API({
      useAsynchronousCommits: true,
      throttleCommits: true,
    });
    expect((api as any).settings.throttleCommits).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- test/api/BaseAPI.httpservice.spec.ts`
Expected: FAIL - validation and service selection not implemented

**Step 3: Implement service selection in BaseAPI constructor**

Modify: `src/BaseAPI.ts:63-158`

```typescript
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
) {
  if (new.target === BaseAPI) {
    throw new TypeError("Cannot construct BaseAPI instances directly");
  }
  this.currentState = global_constants.STATE_NOT_INITIALIZED;

  this._error_codes = error_codes;

  if (settings) {
    this.settings = {
      ...DefaultSettings,
      ...settings,
    } as InternalSettings;
  }

  // VALIDATION: Enforce throttleCommits incompatibility with sync commits
  if (!this.settings.useAsynchronousCommits && this.settings.throttleCommits) {
    this.apiLog(
      "constructor",
      "throttleCommits cannot be used with synchronous commits. Setting throttleCommits to false.",
      LogLevelEnum.WARN,
    );
    this.settings.throttleCommits = false;
  }

  // Initialize and configure LoggingService
  this._loggingService = loggingService || getLoggingService();
  this._loggingService.setLogLevel(this.settings.logLevel);

  // If settings include a custom onLogMessage function, use it as the log handler
  if (this.settings.onLogMessage) {
    this._loggingService.setLogHandler(this.settings.onLogMessage);
  } else {
    this._loggingService.setLogHandler(defaultLogHandler);
  }

  // HTTP SERVICE SELECTION
  if (httpService) {
    // Constructor injection (for tests)
    this._httpService = httpService;
  } else if (this.settings.httpService) {
    // Settings injection (advanced users)
    this._httpService = this.settings.httpService;
  } else {
    // Auto-select based on useAsynchronousCommits
    if (this.settings.useAsynchronousCommits) {
      this.apiLog(
        "constructor",
        "WARNING: useAsynchronousCommits=true is not SCORM compliant. " +
          "Commit failures will not be reported to the SCO, which may cause data loss. " +
          "This setting should only be used for specific legacy compatibility cases.",
        LogLevelEnum.WARN,
      );
      this._httpService = new AsynchronousHttpService(this.settings, this._error_codes);
    } else {
      this._httpService = new SynchronousHttpService(this.settings, this._error_codes);
    }
  }

  // ... rest of constructor unchanged
}
```

**Step 4: Add missing imports**

Modify: `src/BaseAPI.ts:16-20`

```typescript
import { SynchronousHttpService } from "./services/SynchronousHttpService";
import { AsynchronousHttpService } from "./services/AsynchronousHttpService";
```

**Step 5: Run test to verify it passes**

Run: `npm test -- test/api/BaseAPI.httpservice.spec.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/BaseAPI.ts test/api/BaseAPI.httpservice.spec.ts
git commit -m "feat: add HTTP service selection with validation in BaseAPI constructor"
```

---

## Task 7: Remove Async from Commit Chain

**Files:**
- Modify: `src/BaseAPI.ts:382,475,654`
- Modify: `src/Scorm12API.ts:365`
- Modify: `src/Scorm2004API.ts` (similar to Scorm12API)
- Modify: `src/AICC.ts` (similar to Scorm12API)

**Step 1: Write test for synchronous commit**

Modify: `test/api/Scorm12API.spec.ts` - Add new test:

```typescript
it("should return actual commit result synchronously", () => {
  const mockService = {
    processHttpRequest: vi.fn().mockReturnValue({
      result: global_constants.SCORM_FALSE,
      errorCode: 101,
    }),
    updateSettings: vi.fn(),
  };

  const scorm12API = api(
    {
      lmsCommitUrl: "http://test.com/commit",
    },
    mockService,
  );
  scorm12API.lmsInitialize();

  const result = scorm12API.lmsCommit();

  // Should return actual failure synchronously
  expect(result).toBe(global_constants.SCORM_FALSE);
  expect(scorm12API.lmsGetLastError()).toBe("101");
});

it("should return success when commit succeeds", () => {
  const mockService = {
    processHttpRequest: vi.fn().mockReturnValue({
      result: global_constants.SCORM_TRUE,
      errorCode: 0,
    }),
    updateSettings: vi.fn(),
  };

  const scorm12API = api(
    {
      lmsCommitUrl: "http://test.com/commit",
    },
    mockService,
  );
  scorm12API.lmsInitialize();

  const result = scorm12API.lmsCommit();

  expect(result).toBe(global_constants.SCORM_TRUE);
  expect(scorm12API.lmsGetLastError()).toBe("0");
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- test/api/Scorm12API.spec.ts -t "should return actual commit result"`
Expected: FAIL - lmsCommit still returns immediate success

**Step 3: Update abstract storeData signature**

Modify: `src/BaseAPI.ts:382`

```typescript
/**
 * Attempts to store the data to the LMS, logs data if no LMS configured
 * APIs that inherit BaseAPI should override this function
 *
 * @param {boolean} _calculateTotalTime
 * @return {ResultObject}
 * @abstract
 */
abstract storeData(_calculateTotalTime: boolean): ResultObject;
```

**Step 4: Update commit method to be synchronous**

Modify: `src/BaseAPI.ts:654-720`

```typescript
/**
 * Orders LMS to store all content parameters
 * @param {string} callbackName
 * @param {boolean} checkTerminated
 * @return {string}
 */
commit(callbackName: string, checkTerminated: boolean = false): string {
  this.clearScheduledCommit();

  let returnValue = global_constants.SCORM_FALSE;

  if (
    this.checkState(
      checkTerminated,
      this._error_codes.COMMIT_BEFORE_INIT ?? 0,
      this._error_codes.COMMIT_AFTER_TERM ?? 0,
    )
  ) {
    const result = this.storeData(false);
    if ((result.errorCode ?? 0) > 0) {
      // Log detailed error information before throwing SCORM error
      if (result.errorMessage) {
        this.apiLog(
          "commit",
          `Commit failed with error: ${result.errorMessage}`,
          LogLevelEnum.ERROR,
        );
      }
      if (result.errorDetails) {
        this.apiLog(
          "commit",
          `Error details: ${JSON.stringify(result.errorDetails)}`,
          LogLevelEnum.DEBUG,
        );
      }
      this.throwSCORMError("api", result.errorCode);
    }
    returnValue = result?.result ?? global_constants.SCORM_FALSE;

    this.apiLog(callbackName, " Result: " + returnValue, LogLevelEnum.DEBUG, "HttpRequest");

    if (checkTerminated) this.lastErrorCode = "0";

    this.processListeners(callbackName);

    // Fire async offline sync in background if needed
    if (
      this.settings.enableOfflineSupport &&
      this._offlineStorageService &&
      this._offlineStorageService.isDeviceOnline() &&
      this._courseId
    ) {
      this._offlineStorageService.hasPendingOfflineData(this._courseId).then((hasPendingData) => {
        if (hasPendingData) {
          this.apiLog(callbackName, "Syncing pending offline data", LogLevelEnum.INFO);
          this._offlineStorageService?.syncOfflineData().then((syncSuccess) => {
            if (syncSuccess) {
              this.apiLog(callbackName, "Successfully synced offline data", LogLevelEnum.INFO);
              this.processListeners("OfflineDataSynced");
            } else {
              this.apiLog(callbackName, "Failed to sync some offline data", LogLevelEnum.WARN);
            }
          });
        }
      });
    }
  }

  this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
  this.clearSCORMError(returnValue);

  return returnValue;
}
```

**Step 5: Update terminate method to be synchronous**

Modify: `src/BaseAPI.ts:475-538`

```typescript
/**
 * Terminates the current run of the API
 * @param {string} callbackName
 * @param {boolean} checkTerminated
 * @return {string}
 */
terminate(callbackName: string, checkTerminated: boolean): string {
  let returnValue = global_constants.SCORM_FALSE;

  if (
    this.checkState(
      checkTerminated,
      this._error_codes.TERMINATION_BEFORE_INIT ?? 0,
      this._error_codes.MULTIPLE_TERMINATION ?? 0,
    )
  ) {
    this.currentState = global_constants.STATE_TERMINATED;

    // Fire BeforeTerminate event for offline sync
    this.processListeners("BeforeTerminate");

    const result: ResultObject = this.storeData(true);
    if ((result.errorCode ?? 0) > 0) {
      // Log detailed error information before throwing SCORM error
      if (result.errorMessage) {
        this.apiLog(
          "terminate",
          `Terminate failed with error: ${result.errorMessage}`,
          LogLevelEnum.ERROR,
        );
      }
      if (result.errorDetails) {
        this.apiLog(
          "terminate",
          `Error details: ${JSON.stringify(result.errorDetails)}`,
          LogLevelEnum.DEBUG,
        );
      }
      this.throwSCORMError("api", result.errorCode ?? 0);
    }
    returnValue = result?.result ?? global_constants.SCORM_FALSE;

    if (checkTerminated) this.lastErrorCode = "0";

    returnValue = global_constants.SCORM_TRUE;
    this.processListeners(callbackName);
  }

  this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
  this.clearSCORMError(returnValue);

  return returnValue;
}
```

**Step 6: Update processHttpRequest to be synchronous**

Modify: `src/BaseAPI.ts:1319-1363`

```typescript
/**
 * Process an HTTP request
 *
 * @param {string} url - The URL to send the request to
 * @param {CommitObject | StringKeyMap | Array<any>} params - The parameters to send
 * @param {boolean} immediate - Whether to send the request immediately without waiting
 * @returns {ResultObject} - The result of the request
 */
processHttpRequest(
  url: string,
  params: CommitObject | StringKeyMap | Array<any>,
  immediate: boolean = false,
): ResultObject {
  // If offline support is enabled and device is offline, store data locally instead of sending
  if (
    this.settings.enableOfflineSupport &&
    this._offlineStorageService &&
    !this._offlineStorageService.isDeviceOnline() &&
    this._courseId
  ) {
    this.apiLog(
      "processHttpRequest",
      "Device is offline, storing data locally",
      LogLevelEnum.INFO,
    );

    if (params && typeof params === "object" && "cmi" in params) {
      // Store offline - fire async but return optimistic success
      this._offlineStorageService.storeOffline(this._courseId, params as CommitObject);
      return {
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      };
    } else {
      this.apiLog(
        "processHttpRequest",
        "Invalid commit data format for offline storage",
        LogLevelEnum.ERROR,
      );
      return {
        result: global_constants.SCORM_FALSE,
        errorCode: this._error_codes.GENERAL ?? 101,
      };
    }
  }

  // Otherwise, proceed with HTTP request (synchronous or async based on service)
  return this._httpService.processHttpRequest(
    url,
    params,
    immediate,
    (functionName, message, level, element) => this.apiLog(functionName, message, level, element),
    (functionName, CMIElement, value) => this.processListeners(functionName, CMIElement, value),
  );
}
```

**Step 7: Update Scorm12API.storeData to be synchronous**

Modify: `src/Scorm12API.ts:365-413`

```typescript
/**
 * Attempts to store the data to the LMS
 *
 * @param {boolean} terminateCommit
 * @return {ResultObject}
 */
storeData(terminateCommit: boolean): ResultObject {
  if (terminateCommit) {
    const originalStatus = this.cmi.core.lesson_status;
    if (
      !this.cmi.core.lesson_status ||
      (!this.statusSetByModule && this.cmi.core.lesson_status === "not attempted")
    ) {
      this.cmi.core.lesson_status = this.settings.autoCompleteLessonStatus
        ? "completed"
        : "incomplete";
    }

    if (this.cmi.core.lesson_mode === "normal") {
      if (this.cmi.core.credit === "credit") {
        if (
          this.settings.mastery_override &&
          this.cmi.student_data.mastery_score !== "" &&
          this.cmi.core.score.raw !== ""
        ) {
          this.cmi.core.lesson_status =
            parseFloat(this.cmi.core.score.raw) >= parseFloat(this.cmi.student_data.mastery_score)
              ? "passed"
              : "failed";
        }
      }
    } else if (this.cmi.core.lesson_mode === "browse") {
      if (
        ((this.startingData?.cmi as any)?.core?.lesson_status || "") === "" &&
        originalStatus === "not attempted"
      ) {
        this.cmi.core.lesson_status = "browsed";
      }
    }
  }

  const commitObject = this.getCommitObject(terminateCommit);
  if (typeof this.settings.lmsCommitUrl === "string") {
    return this.processHttpRequest(
      this.settings.lmsCommitUrl,
      commitObject,
      terminateCommit,
    );
  } else {
    return {
      result: global_constants.SCORM_TRUE,
      errorCode: 0,
    };
  }
}
```

**Step 8: Update Scorm12API.lmsCommit to be synchronous**

Modify: `src/Scorm12API.ts:149-163`

```typescript
/**
 * LMSCommit function from SCORM 1.2 Spec
 *
 * @return {string} bool
 */
lmsCommit(): string {
  if (this.settings.throttleCommits) {
    this.scheduleCommit(500, "LMSCommit");
    return global_constants.SCORM_TRUE;
  } else {
    return this.commit("LMSCommit", false);
  }
}
```

**Step 9: Update Scorm2004API and AICC similarly**

Modify: `src/Scorm2004API.ts` - Same changes as Scorm12API
Modify: `src/AICC.ts` - Same changes as Scorm12API

**Step 10: Run tests to verify changes**

Run: `npm test -- test/api/Scorm12API.spec.ts -t "should return actual commit result"`
Expected: PASS

**Step 11: Commit**

```bash
git add src/BaseAPI.ts src/Scorm12API.ts src/Scorm2004API.ts src/AICC.ts test/api/Scorm12API.spec.ts
git commit -m "refactor: remove async/await from commit chain for synchronous execution"
```

---

## Task 8: Add BeforeTerminate Event for Offline Sync

**Files:**
- Modify: `src/BaseAPI.ts:123-157`

**Step 1: Write test for BeforeTerminate event**

Create: `test/events/BeforeTerminate.spec.ts`

```typescript
import { describe, it, expect, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import { DefaultSettings } from "../../src/constants/default_settings";

describe("BeforeTerminate Event", () => {
  it("should fire BeforeTerminate event before termination commit", () => {
    const mockListener = vi.fn();
    const api = new Scorm12API({
      lmsCommitUrl: "http://test.com/commit",
    });

    api.on("BeforeTerminate", mockListener);
    api.lmsInitialize();
    api.lmsFinish();

    expect(mockListener).toHaveBeenCalled();
  });

  it("should fire BeforeTerminate before commit happens", () => {
    const callOrder: string[] = [];
    const api = new Scorm12API({
      lmsCommitUrl: "http://test.com/commit",
    });

    api.on("BeforeTerminate", () => {
      callOrder.push("BeforeTerminate");
    });

    api.on("LMSFinish", () => {
      callOrder.push("LMSFinish");
    });

    api.lmsInitialize();
    api.lmsFinish();

    expect(callOrder).toEqual(["BeforeTerminate", "LMSFinish"]);
  });

  it("should allow offline sync listener to attach to BeforeTerminate", () => {
    const offlineSyncMock = vi.fn();
    const api = new Scorm12API({
      lmsCommitUrl: "http://test.com/commit",
      enableOfflineSupport: true,
      courseId: "test-course",
    });

    // Simulate offline storage service listener
    api.on("BeforeTerminate", () => {
      offlineSyncMock();
    });

    api.lmsInitialize();
    api.lmsFinish();

    expect(offlineSyncMock).toHaveBeenCalled();
  });
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- test/events/BeforeTerminate.spec.ts`
Expected: FAIL - BeforeTerminate event not fired

**Step 3: Update OfflineStorageService to listen for BeforeTerminate**

Modify: `src/BaseAPI.ts:123-157` - Add event listener setup in constructor:

```typescript
// Initialize Offline Storage service if enabled
if (this.settings.enableOfflineSupport) {
  this._offlineStorageService =
    offlineStorageService ||
    new OfflineStorageService(
      this.settings,
      this._error_codes,
      (functionName, message, level, element) =>
        this.apiLog(functionName, message, level, element),
    );

  if (this.settings.courseId) {
    this._courseId = this.settings.courseId;
  }

  // Set up offline sync on BeforeTerminate event
  if (this.settings.syncOnTerminate) {
    this._eventService.on("BeforeTerminate", () => {
      if (this._offlineStorageService?.isDeviceOnline() && this._courseId) {
        this._offlineStorageService
          .hasPendingOfflineData(this._courseId)
          .then((hasPendingData) => {
            if (hasPendingData) {
              this.apiLog(
                "BeforeTerminate",
                "Syncing pending offline data before termination",
                LogLevelEnum.INFO,
              );
              return this._offlineStorageService?.syncOfflineData();
            }
          })
          .then((syncSuccess) => {
            if (syncSuccess) {
              this.processListeners("OfflineDataSynced");
            } else {
              this.processListeners("OfflineDataSyncFailed");
            }
          })
          .catch((error) => {
            this.apiLog(
              "BeforeTerminate",
              `Error syncing offline data: ${error}`,
              LogLevelEnum.ERROR,
            );
            this.processListeners("OfflineDataSyncFailed");
          });
      }
    });
  }

  // Check for offline data to restore on initialization
  if (this._offlineStorageService && this._courseId) {
    this._offlineStorageService
      .getOfflineData(this._courseId)
      .then((offlineData) => {
        if (offlineData) {
          this.apiLog("constructor", "Found offline data to restore", LogLevelEnum.INFO);
          this.loadFromJSON(offlineData.runtimeData);
        }
      })
      .catch((error) => {
        this.apiLog(
          "constructor",
          `Error retrieving offline data: ${error}`,
          LogLevelEnum.ERROR,
        );
      });
  }
}
```

**Step 4: Verify BeforeTerminate is already fired in terminate method**

Check: `src/BaseAPI.ts:475-538` - Should already have:

```typescript
// Fire BeforeTerminate event for offline sync
this.processListeners("BeforeTerminate");
```

**Step 5: Run test to verify it passes**

Run: `npm test -- test/events/BeforeTerminate.spec.ts`
Expected: PASS

**Step 6: Commit**

```bash
git add src/BaseAPI.ts test/events/BeforeTerminate.spec.ts
git commit -m "feat: add BeforeTerminate event for event-based offline sync"
```

---

## Task 9: Update Existing Tests

**Files:**
- Modify: `test/services/HttpService.spec.ts` → Delete (renamed to AsynchronousHttpService.spec.ts)
- Modify: Multiple test files that use async/await with commit

**Step 1: Find all tests using await with commit**

Run: `grep -r "await.*commit\|await.*lmsCommit\|await.*lmsFinish" test/ --include="*.spec.ts"`

**Step 2: Update tests to remove await from commit calls**

For each test file found, update from:
```typescript
await api.lmsCommit();
```

To:
```typescript
api.lmsCommit();
```

**Step 3: Update mock HTTP service in tests**

Modify test files to return ResultObject directly instead of Promise:

```typescript
// Before
const mockService = {
  processHttpRequest: vi.fn().mockResolvedValue({
    result: global_constants.SCORM_TRUE,
    errorCode: 0,
  }),
};

// After
const mockService = {
  processHttpRequest: vi.fn().mockReturnValue({
    result: global_constants.SCORM_TRUE,
    errorCode: 0,
  }),
};
```

**Step 4: Run all tests**

Run: `npm test`
Expected: PASS (all tests)

**Step 5: Commit**

```bash
git add test/
git commit -m "test: update tests to use synchronous commit API"
```

---

## Task 10: Update Documentation

**Files:**
- Modify: `README.md`
- Modify: `CLAUDE.md`

**Step 1: Update README.md settings table**

Modify: `README.md` - Update settings table section:

```markdown
### Settings

| Setting | Default | Values | Description |
|---------|---------|--------|-------------|
| useAsynchronousCommits | false | true/false | Use async HTTP requests (legacy behavior). **Not SCORM compliant.** May cause data loss. Only use for specific legacy use cases. |
| throttleCommits | false | true/false | Throttle commit requests by delaying them 500ms. Only works when `useAsynchronousCommits=true`. Cannot be used with synchronous commits. |
| httpService | null | IHttpService | Advanced: Inject custom HTTP service implementation. Overrides `useAsynchronousCommits`. |
| xhrResponseHandler | (function) | function(xhr) => ResultObject | Custom response handler for synchronous XMLHttpRequest responses. Called when `useAsynchronousCommits=false`. |
| responseHandler | (function) | async function(response) => Promise<ResultObject> | Custom response handler for async fetch Response objects. Called when `useAsynchronousCommits=true`. |
```

Add migration section:

```markdown
## Migration from v3.x to v4.x

### Breaking Changes

**Default commit behavior is now synchronous (SCORM-compliant)**

In v3.x, all commits were asynchronous and always returned success immediately, regardless of actual LMS response. This violated SCORM specifications.

In v4.x, commits are **synchronous by default** and return actual success/failure from the LMS.

**Impact:**
- `LMSCommit()` and `LMSFinish()` now block until the LMS responds
- Actual errors are now reported to the SCO
- Better data integrity and SCORM compliance

**To preserve legacy async behavior:**

```javascript
const api = new Scorm12API({
  lmsCommitUrl: "/commit",
  useAsynchronousCommits: true  // Opt-in to legacy behavior
});
// WARNING will be logged about SCORM non-compliance
```

**Note:** When using `useAsynchronousCommits=true`, `throttleCommits` can be enabled. With synchronous commits (default), throttling is not supported and will be automatically disabled with a warning.
```

**Step 2: Update CLAUDE.md**

Modify: `CLAUDE.md` - Add to architecture section:

```markdown
### HTTP Service Architecture

The project provides two HTTP service implementations:

- **SynchronousHttpService** (default) - SCORM-compliant using synchronous XMLHttpRequest
  - Blocks until LMS responds
  - Returns actual success/failure to SCO
  - Uses `sendBeacon()` for termination commits
  - Cannot be throttled

- **AsynchronousHttpService** (legacy) - Not SCORM-compliant
  - Returns immediate optimistic success
  - Actual result handled via events (CommitSuccess/CommitError)
  - Can be throttled
  - Should only be used for specific legacy compatibility

Selection is automatic based on `useAsynchronousCommits` setting, or can be overridden via `httpService` setting.
```

**Step 3: Run linter**

Run: `npm run lint:fix`
Expected: No errors

**Step 4: Commit**

```bash
git add README.md CLAUDE.md
git commit -m "docs: update documentation for synchronous HTTP service changes"
```

---

## Task 11: Final Verification

**Files:**
- All modified files

**Step 1: Run full test suite**

Run: `npm test`
Expected: All tests pass

**Step 2: Run coverage report**

Run: `npm run test:coverage`
Expected: Coverage maintained or improved

**Step 3: Build the project**

Run: `npm run build:all`
Expected: Build succeeds with no errors

**Step 4: Run linter**

Run: `npm run lint`
Expected: No linting errors

**Step 5: Manual verification**

Create test file: `manual-test.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>SCORM Sync Test</title>
  <script src="dist/scorm12.js"></script>
</head>
<body>
  <h1>SCORM Synchronous Commit Test</h1>
  <button onclick="testSync()">Test Sync Commit</button>
  <button onclick="testAsync()">Test Async Commit (Legacy)</button>
  <pre id="output"></pre>

  <script>
    function log(msg) {
      document.getElementById('output').textContent += msg + '\n';
    }

    function testSync() {
      log('=== Testing Synchronous Commit (Default) ===');
      const api = new Scorm12API({
        lmsCommitUrl: 'https://httpstat.us/500', // Will fail
      });
      api.lmsInitialize();
      const result = api.lmsCommit();
      log('Commit result: ' + result);
      log('Error: ' + api.lmsGetLastError());
      log('Should be "false" and error "101"');
    }

    function testAsync() {
      log('\n=== Testing Asynchronous Commit (Legacy) ===');
      const api = new Scorm12API({
        lmsCommitUrl: 'https://httpstat.us/500',
        useAsynchronousCommits: true,
      });
      api.lmsInitialize();
      const result = api.lmsCommit();
      log('Commit result: ' + result);
      log('Error: ' + api.lmsGetLastError());
      log('Should be "true" and error "0" (optimistic)');
    }
  </script>
</body>
</html>
```

Open in browser and verify:
- Sync mode returns actual error
- Async mode returns optimistic success
- Console shows warning for async mode

**Step 6: Final commit**

```bash
git add manual-test.html
git commit -m "test: add manual verification test for sync vs async commits"
```

---

## Completion Checklist

- [ ] IHttpService interface updated to return synchronous ResultObject
- [ ] New settings types added (useAsynchronousCommits, httpService, xhrResponseHandler)
- [ ] Default settings updated with new values
- [ ] SynchronousHttpService implemented with sync XHR and sendBeacon
- [ ] HttpService renamed to AsynchronousHttpService
- [ ] BaseAPI constructor implements service selection with validation
- [ ] Async/await removed from entire commit chain
- [ ] BeforeTerminate event added for offline sync
- [ ] All existing tests updated for synchronous API
- [ ] Documentation updated (README.md, CLAUDE.md)
- [ ] All tests passing
- [ ] Build succeeds
- [ ] Linter passes
- [ ] Manual verification complete

---

## Estimated Time

- **Total:** ~3-4 hours
- **Per task:** 15-30 minutes each
- **Testing:** ~30 minutes
- **Documentation:** ~20 minutes
