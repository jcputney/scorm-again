import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import Scorm2004API from "../../src/Scorm2004API";
import { global_constants } from "../../src/constants/api_constants";
import { DefaultSettings } from "../../src/constants/default_settings";
import { LogLevelEnum } from "../../src/constants/enums";
import { scorm12_errors } from "../../src/constants/error_codes";
import { IHttpService } from "../../src/interfaces/services";
import { AsynchronousHttpService } from "../../src/services/AsynchronousHttpService";
import {
  CommitMetadata,
  CommitObject,
  InternalSettings,
  ResultObject,
  Settings,
} from "../../src/types/api_types";
import { StringKeyMap } from "../../src/utilities";

type CapturedRequest = {
  url: string;
  params: CommitObject | StringKeyMap | Array<any>;
  immediate: boolean;
  metadata?: CommitMetadata;
};

class RecordingHttpService implements IHttpService {
  readonly requests: CapturedRequest[] = [];

  processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean,
    _apiLog: Parameters<IHttpService["processHttpRequest"]>[3],
    _processListeners: Parameters<IHttpService["processHttpRequest"]>[4],
    metadata?: CommitMetadata,
    _onRequestComplete?: () => void,
  ): ResultObject {
    this.requests.push({ url, params, immediate, metadata });
    return { result: global_constants.SCORM_TRUE, errorCode: 0 };
  }

  updateSettings(_settings: Settings): void {}
}

class DefaultParameterHttpService implements IHttpService {
  metadata?: CommitMetadata;

  processHttpRequest(
    _url: string,
    _params: CommitObject | StringKeyMap | Array<any>,
    _immediate: boolean = false,
    _apiLog: Parameters<IHttpService["processHttpRequest"]>[3],
    _processListeners: Parameters<IHttpService["processHttpRequest"]>[4],
    metadata?: CommitMetadata,
  ): ResultObject {
    this.metadata = metadata;
    return { result: global_constants.SCORM_TRUE, errorCode: 0 };
  }

  updateSettings(_settings: Settings): void {}
}

class DeferringHttpService implements IHttpService {
  readonly reportsRequestCompletion?: boolean;
  private onRequestComplete?: () => void;

  constructor(reportsRequestCompletion: boolean) {
    if (reportsRequestCompletion) {
      this.reportsRequestCompletion = true;
    }
  }

  processHttpRequest(
    _url: string,
    _params: CommitObject | StringKeyMap | Array<any>,
    _immediate: boolean,
    _apiLog: Parameters<IHttpService["processHttpRequest"]>[3],
    _processListeners: Parameters<IHttpService["processHttpRequest"]>[4],
    _metadata?: CommitMetadata,
    onRequestComplete?: () => void,
  ): ResultObject {
    this.onRequestComplete = onRequestComplete;
    return { result: global_constants.SCORM_TRUE, errorCode: 0 };
  }

  complete(): void {
    this.onRequestComplete?.();
  }

  updateSettings(_settings: Settings): void {}
}

class LegacyForwardingAsyncHttpService extends AsynchronousHttpService {
  override processHttpRequest(
    url: string,
    params: CommitObject | StringKeyMap | Array<any>,
    immediate: boolean = false,
    apiLog: Parameters<IHttpService["processHttpRequest"]>[3],
    processListeners: Parameters<IHttpService["processHttpRequest"]>[4],
  ): ResultObject {
    return super.processHttpRequest(url, params, immediate, apiLog, processListeners);
  }
}

const createDeferred = <T>() => {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });
  return { promise, reject, resolve };
};

const createResponse = (
  result: string = global_constants.SCORM_TRUE,
  errorCode = 0,
  status = 200,
): Response =>
  new Response(JSON.stringify({ result, errorCode }), {
    status,
    headers: { "Content-Type": "application/json" },
  });

const installSuccessfulXHR = (): void => {
  const xhr = {
    open: vi.fn(),
    setRequestHeader: vi.fn(),
    send: vi.fn(),
    status: 200,
    responseText: JSON.stringify({ result: global_constants.SCORM_TRUE, errorCode: 0 }),
  };

  vi.stubGlobal("XMLHttpRequest", function MockXMLHttpRequest() {
    return xhr;
  } as unknown as typeof XMLHttpRequest);
};

const initialize = (api: Scorm12API): Scorm12API => {
  expect(api.lmsInitialize()).toBe(global_constants.SCORM_TRUE);
  return api;
};

const createAsyncApi = (settings: Settings = {}): Scorm12API =>
  initialize(
    new Scorm12API({
      lmsCommitUrl: "https://example.com/commit",
      logLevel: LogLevelEnum.NONE,
      useAsynchronousCommits: true,
      ...settings,
    }),
  );

describe("commit lifecycle", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe("pending commits", () => {
    it("counts a synchronous commit until its response handler returns", () => {
      installSuccessfulXHR();
      let countInsideResponseHandler = -1;
      const apiRef: { current?: Scorm12API } = {};
      const api = initialize(
        new Scorm12API({
          lmsCommitUrl: "https://example.com/commit",
          logLevel: LogLevelEnum.NONE,
          xhrResponseHandler: () => {
            countInsideResponseHandler = apiRef.current?.pendingCommitCount ?? -1;
            return { result: global_constants.SCORM_TRUE, errorCode: 0 };
          },
        }),
      );
      apiRef.current = api;

      expect(api.lmsCommit()).toBe(global_constants.SCORM_TRUE);

      expect(countInsideResponseHandler).toBe(1);
      expect(api.pendingCommitCount).toBe(0);
    });

    it("stays pending until an asynchronous request completes", async () => {
      const response = createDeferred<Response>();
      vi.spyOn(global, "fetch").mockReturnValue(response.promise);
      const api = createAsyncApi();

      api.lmsCommit();

      expect(api.pendingCommitCount).toBe(1);
      response.resolve(createResponse());
      await api.whenCommitsSettled();
      expect(api.pendingCommitCount).toBe(0);
    });

    it("settles an async subclass that forwards only legacy parameters to super", async () => {
      const response = createDeferred<Response>();
      vi.spyOn(global, "fetch").mockReturnValue(response.promise);
      const settings: InternalSettings = {
        ...DefaultSettings,
        lmsCommitUrl: "https://example.com/commit",
        logLevel: LogLevelEnum.NONE,
        useAsynchronousCommits: true,
      };
      const service = new LegacyForwardingAsyncHttpService(settings, scorm12_errors);
      const api = initialize(new Scorm12API(settings, service));
      const listener = vi.fn();
      api.on("CommitSuccess", listener);

      api.lmsCommit();
      const settled = api.whenCommitsSettled();
      let settledResolved = false;
      void settled.then(() => {
        settledResolved = true;
      });
      expect(api.pendingCommitCount).toBe(1);

      response.resolve(createResponse());
      await vi.waitFor(() => {
        expect(listener).toHaveBeenCalledOnce();
      });
      await Promise.resolve();

      expect(api.pendingCommitCount).toBe(0);
      expect(settledResolved).toBe(true);
      await settled;
    });

    it("does not drain until every concurrent async commit completes", async () => {
      const firstResponse = createDeferred<Response>();
      const secondResponse = createDeferred<Response>();
      vi.spyOn(global, "fetch")
        .mockReturnValueOnce(firstResponse.promise)
        .mockReturnValueOnce(secondResponse.promise);
      const api = createAsyncApi();
      api.lmsCommit();
      api.lmsCommit();
      const allSettled = api.whenCommitsSettled();
      let allSettledResolved = false;
      void allSettled.then(() => {
        allSettledResolved = true;
      });

      expect(api.pendingCommitCount).toBe(2);
      firstResponse.resolve(createResponse());
      await vi.waitFor(() => {
        expect(api.pendingCommitCount).toBe(1);
      });
      expect(allSettledResolved).toBe(false);

      secondResponse.resolve(createResponse());
      await allSettled;
      expect(api.pendingCommitCount).toBe(0);
    });

    it("settles an injected legacy-style service when it returns", () => {
      const service = new RecordingHttpService();
      const api = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
          },
          service,
        ),
      );

      api.lmsCommit();

      expect(service.requests).toHaveLength(1);
      expect(api.pendingCommitCount).toBe(0);
    });

    it("uses reportsRequestCompletion to govern deferred custom-service settlement", async () => {
      const unreportedService = new DeferringHttpService(false);
      const unreportedApi = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
          },
          unreportedService,
        ),
      );

      unreportedApi.lmsCommit();

      expect(unreportedApi.pendingCommitCount).toBe(0);
      await expect(unreportedApi.whenCommitsSettled()).resolves.toBeUndefined();
      unreportedService.complete();
      expect(unreportedApi.pendingCommitCount).toBe(0);
      await expect(unreportedApi.whenCommitsSettled()).resolves.toBeUndefined();

      const reportedService = new DeferringHttpService(true);
      const reportedApi = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
          },
          reportedService,
        ),
      );

      reportedApi.lmsCommit();
      const reportedSettled = reportedApi.whenCommitsSettled();
      let reportedSettledResolved = false;
      void reportedSettled.then(() => {
        reportedSettledResolved = true;
      });

      await Promise.resolve();
      expect(reportedApi.pendingCommitCount).toBe(1);
      expect(reportedSettledResolved).toBe(false);

      reportedService.complete();
      await reportedSettled;
      expect(reportedApi.pendingCommitCount).toBe(0);
    });

    it("settles the offline-storage branch synchronously", async () => {
      const api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      api.settings = { enableOfflineSupport: true };
      const pendingCountsInsideStorage: number[] = [];
      const storeOffline = vi.fn(
        (
          _courseId: string,
          _params: CommitObject,
          _metadata?: { isTerminateCommit?: boolean; sequence?: number },
        ): ResultObject => {
          pendingCountsInsideStorage.push(api.pendingCommitCount);
          return { result: global_constants.SCORM_TRUE, errorCode: 0 };
        },
      );
      Reflect.set(api, "_offlineStorageService", {
        isDeviceOnline: vi.fn().mockReturnValue(false),
        storeOffline,
      });
      Reflect.set(api, "_courseId", "course-1");

      const result = api.processHttpRequest("https://example.com/commit", { cmi: {} });

      expect(result).toEqual({ result: global_constants.SCORM_TRUE, errorCode: 0 });
      expect(pendingCountsInsideStorage).toEqual([1]);
      expect(api.pendingCommitCount).toBe(0);
      await expect(api.whenCommitsSettled()).resolves.toBeUndefined();
    });
  });

  describe("whenCommitsSettled", () => {
    it("resolves immediately while idle", async () => {
      const api = new Scorm12API({ logLevel: LogLevelEnum.NONE });

      await expect(api.whenCommitsSettled()).resolves.toBeUndefined();
    });

    it("resolves every concurrent waiter when an async commit drains", async () => {
      const response = createDeferred<Response>();
      vi.spyOn(global, "fetch").mockReturnValue(response.promise);
      const api = createAsyncApi();
      api.lmsCommit();
      const waiterOne = api.whenCommitsSettled();
      const waiterTwo = api.whenCommitsSettled();
      let waiterResolved = false;
      void waiterOne.then(() => {
        waiterResolved = true;
      });

      await Promise.resolve();
      expect(waiterResolved).toBe(false);
      response.resolve(createResponse());

      await Promise.all([waiterOne, waiterTwo]);
      expect(api.pendingCommitCount).toBe(0);
    });

    it("resolves on timeout without pretending a hung commit drained", async () => {
      vi.useFakeTimers();
      const response = createDeferred<Response>();
      vi.spyOn(global, "fetch").mockReturnValue(response.promise);
      const api = createAsyncApi();
      api.lmsCommit();
      const timedWait = api.whenCommitsSettled({ timeoutMs: 5 });
      let timedWaitResolved = false;
      void timedWait.then(() => {
        timedWaitResolved = true;
      });

      await vi.advanceTimersByTimeAsync(4);
      expect(timedWaitResolved).toBe(false);
      await vi.advanceTimersByTimeAsync(1);
      await expect(timedWait).resolves.toBeUndefined();
      expect(api.pendingCommitCount).toBe(1);

      response.resolve(createResponse());
      await api.whenCommitsSettled();
      expect(api.pendingCommitCount).toBe(0);
    });
  });

  describe("commit events", () => {
    it("delivers context as argument zero for async success", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue(createResponse());
      const api = createAsyncApi();
      const listener = vi.fn();
      api.on("CommitSuccess", listener);

      api.lmsCommit();
      await api.whenCommitsSettled();

      expect(listener).toHaveBeenCalledExactlyOnceWith({
        url: "https://example.com/commit",
        trigger: "manual",
        isTerminateCommit: false,
        sequence: 1,
      });
    });

    it("keeps the error code at argument zero and appends failure context", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue(
        createResponse(global_constants.SCORM_FALSE, 391, 500),
      );
      const api = createAsyncApi();
      const listener = vi.fn();
      api.on("CommitError", listener);

      api.lmsCommit();
      await api.whenCommitsSettled();

      expect(listener).toHaveBeenCalledExactlyOnceWith(391, {
        url: "https://example.com/commit",
        trigger: "manual",
        isTerminateCommit: false,
        sequence: 1,
        errorCode: 391,
      });
    });

    it("reports error 391 with context when fetch throws", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("network failed"));
      const api = new Scorm2004API({
        lmsCommitUrl: "https://example.com/commit",
        logLevel: LogLevelEnum.NONE,
        useAsynchronousCommits: true,
      });
      expect(api.lmsInitialize()).toBe(global_constants.SCORM_TRUE);
      const listener = vi.fn();
      api.on("CommitError", listener);

      api.lmsCommit();
      await api.whenCommitsSettled();

      expect(listener).toHaveBeenCalledExactlyOnceWith(391, {
        url: "https://example.com/commit",
        trigger: "manual",
        isTerminateCommit: false,
        sequence: 1,
        errorCode: 391,
      });
    });
  });

  describe("terminate signaling", () => {
    it("adds the terminate query and payload markers only to termination", () => {
      const service = new RecordingHttpService();
      const api = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
            terminateCommitParam: "final",
            terminateCommitPayloadField: "isFinal",
          },
          service,
        ),
      );

      api.lmsCommit();
      api.lmsFinish();

      expect(service.requests).toHaveLength(2);
      expect(service.requests[0]?.url).toBe("https://example.com/commit");
      expect(service.requests[0]?.params).not.toHaveProperty("isFinal");
      expect(service.requests[0]?.metadata).toEqual({
        isTerminateCommit: false,
        trigger: "manual",
        sequence: 1,
      });
      expect(service.requests[1]?.url).toBe("https://example.com/commit?final=true");
      expect(service.requests[1]?.params).toHaveProperty("isFinal", true);
      expect(service.requests[1]?.metadata).toEqual({
        isTerminateCommit: true,
        trigger: "terminate",
        sequence: 2,
      });
    });

    it("uses an ampersand when the commit URL already has a query", () => {
      const service = new RecordingHttpService();
      const api = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit?token=abc",
            logLevel: LogLevelEnum.NONE,
            terminateCommitParam: "final",
          },
          service,
        ),
      );

      api.lmsFinish();

      expect(service.requests[0]?.url).toBe("https://example.com/commit?token=abc&final=true");
    });

    it("adds configured markers to copied array payloads", () => {
      const service = new RecordingHttpService();
      const api = new Scorm12API(
        {
          includeCommitSequence: true,
          logLevel: LogLevelEnum.NONE,
          terminateCommitPayloadField: "isFinal",
        },
        service,
      );
      const params = ["cmi.location=page-1"];

      api.processHttpRequest("https://example.com/commit", params, true, "terminate");

      expect(params).toEqual(["cmi.location=page-1"]);
      expect(service.requests[0]?.params).toEqual([
        "cmi.location=page-1",
        "isFinal=true",
        "commitSequence=1",
      ]);
    });

    it("encodes hostile terminate field names in array payloads", () => {
      const service = new RecordingHttpService();
      const api = new Scorm12API(
        {
          logLevel: LogLevelEnum.NONE,
          terminateCommitPayloadField: "final flag&x=1",
        },
        service,
      );

      api.processHttpRequest("https://example.com/commit", [], true, "terminate");

      expect(service.requests[0]?.params).toEqual(["final%20flag%26x%3D1=true"]);
    });
  });

  describe("request metadata and commit sequences", () => {
    it("passes metadata to a custom service whose immediate parameter has a default", () => {
      const service = new DefaultParameterHttpService();
      const api = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
          },
          service,
        ),
      );

      expect(service.processHttpRequest.length).toBe(2);
      api.lmsCommit();

      expect(service.metadata).toEqual({
        isTerminateCommit: false,
        trigger: "manual",
        sequence: 1,
      });
    });

    it("passes increasing sync metadata and opt-in payload sequence values", () => {
      installSuccessfulXHR();
      const requestHandler = vi.fn((payload: unknown, _metadata?: CommitMetadata) => payload);
      const api = initialize(
        new Scorm12API({
          includeCommitSequence: true,
          lmsCommitUrl: "https://example.com/commit",
          logLevel: LogLevelEnum.NONE,
          requestHandler,
        }),
      );

      api.lmsCommit();
      api.lmsCommit();
      api.lmsCommit();

      expect(requestHandler.mock.calls.map(([, metadata]) => metadata?.sequence)).toEqual([
        1, 2, 3,
      ]);
      expect(requestHandler.mock.calls.map(([payload]) => payload)).toEqual([
        expect.objectContaining({ commitSequence: 1 }),
        expect.objectContaining({ commitSequence: 2 }),
        expect.objectContaining({ commitSequence: 3 }),
      ]);
      expect(requestHandler.mock.calls[0]?.[1]).toEqual({
        isTerminateCommit: false,
        trigger: "manual",
        sequence: 1,
      });
    });

    it("passes increasing async metadata and supports one-argument legacy handlers", async () => {
      vi.spyOn(global, "fetch").mockImplementation(async () => createResponse());
      const metadata: CommitMetadata[] = [];
      const legacyHandler = (payload: unknown): unknown => payload;
      const requestHandler = vi.fn((payload: unknown, commitMetadata?: CommitMetadata) => {
        if (commitMetadata) metadata.push(commitMetadata);
        return legacyHandler(payload);
      });
      const api = createAsyncApi({
        includeCommitSequence: true,
        requestHandler,
      });

      api.lmsCommit();
      api.lmsCommit();
      api.lmsCommit();
      await api.whenCommitsSettled();

      expect(metadata).toEqual([
        { isTerminateCommit: false, trigger: "manual", sequence: 1 },
        { isTerminateCommit: false, trigger: "manual", sequence: 2 },
        { isTerminateCommit: false, trigger: "manual", sequence: 3 },
      ]);
      expect(requestHandler.mock.calls.map(([payload]) => payload)).toEqual([
        expect.objectContaining({ commitSequence: 1 }),
        expect.objectContaining({ commitSequence: 2 }),
        expect.objectContaining({ commitSequence: 3 }),
      ]);

      installSuccessfulXHR();
      const oneArgumentHandler = vi.fn(legacyHandler);
      const legacyApi = initialize(
        new Scorm12API({
          lmsCommitUrl: "https://example.com/commit",
          logLevel: LogLevelEnum.NONE,
          requestHandler: oneArgumentHandler,
        }),
      );
      expect(legacyApi.lmsCommit()).toBe(global_constants.SCORM_TRUE);
      expect(oneArgumentHandler).toHaveBeenCalledOnce();
    });

    it("passes terminate metadata through the synchronous sendBeacon path", () => {
      const sendBeacon = vi.fn().mockReturnValue(true);
      vi.stubGlobal("navigator", { onLine: true, sendBeacon });
      const requestHandler = vi.fn((payload: unknown, _metadata?: CommitMetadata) => payload);
      const api = initialize(
        new Scorm12API({
          lmsCommitUrl: "https://example.com/commit",
          logLevel: LogLevelEnum.NONE,
          requestHandler,
        }),
      );

      expect(api.lmsFinish()).toBe(global_constants.SCORM_TRUE);

      expect(requestHandler).toHaveBeenCalledExactlyOnceWith(expect.any(Object), {
        isTerminateCommit: true,
        trigger: "terminate",
        sequence: 1,
      });
      expect(sendBeacon).toHaveBeenCalledOnce();
    });

    it("does not add commitSequence to payloads unless opted in", () => {
      const service = new RecordingHttpService();
      const api = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
          },
          service,
        ),
      );

      api.lmsCommit();

      expect(service.requests[0]?.params).not.toHaveProperty("commitSequence");
      expect(service.requests[0]?.metadata?.sequence).toBe(1);
    });

    it("keeps sequence monotonic across reset", () => {
      const service = new RecordingHttpService();
      const api = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
          },
          service,
        ),
      );
      api.lmsCommit();

      api.reset();
      api.lmsInitialize();
      api.lmsCommit();

      expect(service.requests.map(({ metadata }) => metadata?.sequence)).toEqual([1, 2]);
    });
  });

  describe("trigger classification", () => {
    it("classifies manual, scheduled, and termination commits", async () => {
      vi.useFakeTimers();
      const manualService = new RecordingHttpService();
      const manualApi = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
          },
          manualService,
        ),
      );
      manualApi.lmsCommit();

      const scheduledService = new RecordingHttpService();
      const scheduledApi = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
          },
          scheduledService,
        ),
      );
      scheduledApi.scheduleCommit(10, "LMSCommit");
      await vi.advanceTimersByTimeAsync(10);

      const terminateService = new RecordingHttpService();
      const terminateApi = initialize(
        new Scorm12API(
          {
            lmsCommitUrl: "https://example.com/commit",
            logLevel: LogLevelEnum.NONE,
          },
          terminateService,
        ),
      );
      terminateApi.lmsFinish();

      expect(manualService.requests[0]?.metadata?.trigger).toBe("manual");
      expect(scheduledService.requests[0]?.metadata?.trigger).toBe("autocommit");
      expect(terminateService.requests[0]?.metadata?.trigger).toBe("terminate");
    });
  });
});
