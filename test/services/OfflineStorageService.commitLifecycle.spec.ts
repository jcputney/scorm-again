import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import Scorm2004API from "../../src/Scorm2004API";
import { DefaultSettings } from "../../src/constants/default_settings";
import { CompletionStatus, LogLevelEnum, SuccessStatus } from "../../src/constants/enums";
import { scorm12_errors } from "../../src/constants/error_codes";
import { OfflineStorageService } from "../../src/services/OfflineStorageService";
import { IHttpService } from "../../src/interfaces/services";
import { CommitMetadata, CommitObject, InternalSettings } from "../../src/types/api_types";

const createStorage = (): Storage => {
  const values = new Map<string, string>();
  return {
    get length() {
      return values.size;
    },
    clear: () => values.clear(),
    getItem: (key: string) => values.get(key) ?? null,
    key: (index: number) => Array.from(values.keys())[index] ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
};

const createCommit = (commitSequence?: number): CommitObject => ({
  successStatus: SuccessStatus.UNKNOWN,
  completionStatus: CompletionStatus.UNKNOWN,
  totalTimeSeconds: 0,
  runtimeData: { cmi: {} },
  ...(commitSequence !== undefined ? { commitSequence } : {}),
});

const successfulResponse = (): Response =>
  new Response(JSON.stringify({ result: "true", errorCode: 0 }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });

const installSuccessfulXHR = () => {
  const xhr = {
    open: vi.fn(),
    setRequestHeader: vi.fn(),
    onload: null as (() => void) | null,
    send: vi.fn(() => xhr.onload?.()),
    status: 200,
    responseText: JSON.stringify({ result: "true", errorCode: 0 }),
  };
  vi.stubGlobal("XMLHttpRequest", function MockXMLHttpRequest() {
    return xhr;
  } as unknown as typeof XMLHttpRequest);
  return xhr;
};

describe("OfflineStorageService commit lifecycle", () => {
  const services: OfflineStorageService[] = [];

  beforeEach(() => {
    vi.stubGlobal("localStorage", createStorage());
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    for (const service of services.splice(0)) {
      service.destroy();
    }
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("replays terminate metadata, original sequence, and the terminate query marker", async () => {
    vi.stubGlobal("navigator", { onLine: true, sendBeacon: vi.fn() });
    const requestHandler = vi.fn((data: unknown, _metadata?: CommitMetadata) => data);
    const fetchStub = vi.spyOn(global, "fetch").mockResolvedValue(successfulResponse());
    const service = new OfflineStorageService(
      {
        ...DefaultSettings,
        courseId: "course-1",
        lmsCommitUrl: "https://example.com/commit?token=abc",
        requestHandler,
        terminateCommitParam: "final",
      } as InternalSettings,
      scorm12_errors,
      vi.fn(),
    );
    services.push(service);
    const commit = createCommit();
    service.storeOffline("course-1", commit, { isTerminateCommit: true, sequence: 7 });

    await expect(service.syncOfflineData()).resolves.toBe(true);

    expect(requestHandler).toHaveBeenCalledExactlyOnceWith(commit, {
      isTerminateCommit: true,
      trigger: "offline-replay",
      sequence: 7,
    });
    expect(commit).not.toHaveProperty("commitSequence");
    expect(fetchStub).toHaveBeenCalledWith(
      "https://example.com/commit?token=abc&final=true",
      expect.any(Object),
    );
  });

  it("captures and replays an API termination with all opt-in markers", async () => {
    vi.stubGlobal("navigator", { onLine: false, sendBeacon: vi.fn() });
    const requestHandler = vi.fn((data: unknown, _metadata?: CommitMetadata) => data);
    const xhr = installSuccessfulXHR();
    const api = new Scorm12API({
      courseId: "course-1",
      enableOfflineSupport: true,
      includeCommitSequence: true,
      lmsCommitUrl: "https://example.com/commit",
      logLevel: LogLevelEnum.NONE,
      requestHandler,
      syncOnInitialize: false,
      syncOnTerminate: false,
      terminateCommitParam: "final",
      terminateCommitPayloadField: "isFinal",
    });
    expect(api.lmsInitialize()).toBe("true");
    const offlineStorage = api["_offlineStorageService"] as OfflineStorageService;
    services.push(offlineStorage);

    expect(api.lmsFinish()).toBe("true");
    expect(requestHandler).not.toHaveBeenCalled();

    offlineStorage["isOnline"] = true;
    await expect(offlineStorage.syncOfflineData()).resolves.toBe(true);

    expect(requestHandler).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ commitSequence: 1, isFinal: true }),
      {
        isTerminateCommit: true,
        trigger: "offline-replay",
        sequence: 1,
      },
    );
    expect(xhr.open).toHaveBeenCalledWith("POST", "https://example.com/commit?final=true", true);
    expect(xhr.send).toHaveBeenCalledTimes(1);
  });

  it("replays the capture-time sequence after later online commits advance the API counter", async () => {
    vi.stubGlobal("navigator", { onLine: false, sendBeacon: vi.fn() });
    installSuccessfulXHR();
    const capturedMetadata: CommitMetadata[] = [];
    const capturedPayloads: unknown[] = [];
    const requestHandler = vi.fn((data: unknown, metadata?: CommitMetadata) => {
      if (metadata) capturedMetadata.push(metadata);
      capturedPayloads.push(data);
      return data;
    });
    vi.spyOn(global, "fetch").mockResolvedValue(successfulResponse());
    const api = new Scorm12API({
      courseId: "course-1",
      enableOfflineSupport: true,
      includeCommitSequence: true,
      lmsCommitUrl: "https://example.com/commit",
      logLevel: LogLevelEnum.NONE,
      requestHandler,
      syncOnInitialize: false,
      syncOnTerminate: false,
    });
    expect(api.lmsInitialize()).toBe("true");
    const offlineStorage = api["_offlineStorageService"] as OfflineStorageService;
    services.push(offlineStorage);

    expect(api.lmsCommit()).toBe("true");
    expect(api.pendingCommitCount).toBe(0);

    offlineStorage["isOnline"] = true;
    expect(api.lmsCommit()).toBe("true");
    await expect(offlineStorage.syncOfflineData()).resolves.toBe(true);

    expect(capturedMetadata).toEqual([
      { isTerminateCommit: false, trigger: "manual", sequence: 2 },
      { isTerminateCommit: false, trigger: "offline-replay", sequence: 1 },
    ]);
    expect(capturedPayloads[0]).toEqual(expect.objectContaining({ commitSequence: 2 }));
    expect(capturedPayloads[1]).toEqual(expect.objectContaining({ commitSequence: 1 }));
  });

  it.each([
    ["no commit event", [], 1, false],
    ["CommitSuccess", ["CommitSuccess"], 0, true],
  ])("settles a deferred replay that sends %s", async (_label, events, remaining, synced) => {
    vi.stubGlobal("navigator", { onLine: true, sendBeacon: vi.fn() });
    // A deferring service reports each settled request through onRequestComplete.
    const httpService = {
      reportsRequestCompletion: true,
      processHttpRequest: vi.fn(
        (
          _url: string,
          _params: unknown,
          _immediate: boolean,
          _apiLog: unknown,
          processListeners: (event: string) => void,
          _metadata?: CommitMetadata,
          onRequestComplete?: () => void,
        ) => {
          setTimeout(() => {
            for (const event of events) processListeners(event);
            onRequestComplete?.();
          });
          return { result: "true", errorCode: 0 };
        },
      ),
    } as unknown as IHttpService;
    const service = new OfflineStorageService(
      {
        ...DefaultSettings,
        courseId: "course-1",
        lmsCommitUrl: "https://example.com/commit",
      } as InternalSettings,
      scorm12_errors,
      vi.fn(),
      httpService,
    );
    services.push(service);
    service.storeOffline("course-1", createCommit());

    await expect(service.syncOfflineData()).resolves.toBe(synced);

    expect(httpService.processHttpRequest).toHaveBeenCalledOnce();
    expect(service.getPendingOfflineData("course-1", "")).toHaveLength(remaining);
  });

  describe.each([
    ["SCORM 1.2", Scorm12API],
    ["SCORM 2004", Scorm2004API],
  ] as const)("%s sync events", (_name, API) => {
    it.each(["Initialize", "Commit", "BeforeTerminate", "online", "network-status", "direct"])(
      "emits one ordered success pair for %s",
      async (entry) => {
        vi.stubGlobal("navigator", { onLine: true, sendBeacon: vi.fn(() => true) });
        installSuccessfulXHR();
        const api = new API({
          courseId: "course-1",
          enableOfflineSupport: true,
          lmsCommitUrl: "https://example.com/commit",
          logLevel: LogLevelEnum.NONE,
          syncOnInitialize: entry === "Initialize",
          syncOnTerminate: entry === "BeforeTerminate",
        });
        const service = api["_offlineStorageService"] as OfflineStorageService;
        services.push(service);
        const events: string[] = [];
        for (const event of ["OfflineDataSyncing", "OfflineDataSynced", "OfflineDataSyncFailed"]) {
          api.on(event, () => events.push(event));
        }
        if (entry !== "Initialize") expect(api.lmsInitialize()).toBe("true");
        service.storeOffline("course-1", createCommit());

        if (entry === "Initialize") expect(api.lmsInitialize()).toBe("true");
        if (entry === "Commit") expect(api.lmsCommit()).toBe("true");
        if (entry === "BeforeTerminate") expect(api.lmsFinish()).toBe("true");
        if (entry === "online" || entry === "network-status") {
          service["isOnline"] = false;
          window.dispatchEvent(
            entry === "online"
              ? new Event("online")
              : new CustomEvent("scorm-again:network-status", { detail: { online: true } }),
          );
        }
        if (entry === "direct") await expect(service.syncOfflineData()).resolves.toBe(true);

        await vi.waitFor(() => expect(events).toEqual(["OfflineDataSyncing", "OfflineDataSynced"]));
        expect(await service.hasPendingOfflineData("course-1")).toBe(false);
      },
    );
  });

  it.each(["partial", "dropped", "throw", "read"])(
    "emits one failure pair and resolves false for a %s failure",
    async (failure) => {
      vi.stubGlobal("navigator", { onLine: true });
      const emit = vi.fn();
      const service = new OfflineStorageService(
        {
          ...DefaultSettings,
          courseId: "course-1",
          lmsCommitUrl: "https://example.com/commit",
        } as InternalSettings,
        scorm12_errors,
        vi.fn(),
        undefined,
        () => "",
        emit,
      );
      services.push(service);
      service.storeOffline("course-1", createCommit());
      if (failure === "partial") service.storeOffline("course-1", createCommit());
      const send = vi.spyOn(service as any, "sendDataToLMS");
      send.mockResolvedValueOnce({ result: "true", errorCode: 0 });
      send.mockResolvedValueOnce({ result: "false", errorCode: 101 });
      if (failure === "dropped") {
        const queue = JSON.parse(localStorage.getItem("scorm_again_sync_queue")!);
        queue[0].syncAttempts = 5;
        localStorage.setItem("scorm_again_sync_queue", JSON.stringify(queue));
      }
      if (failure === "throw") {
        vi.spyOn(service as any, "saveToStorage").mockImplementation(() => {
          throw new Error("Storage failure");
        });
      }

      if (failure === "read") {
        vi.spyOn(service as any, "getFromStorage").mockImplementation(() => {
          throw new Error("Storage read failure");
        });
      }

      await expect(service.syncOfflineData()).resolves.toBe(false);
      expect(emit.mock.calls).toEqual([["OfflineDataSyncing"], ["OfflineDataSyncFailed"]]);
      if (failure === "partial") {
        const queue = JSON.parse(localStorage.getItem("scorm_again_sync_queue")!);
        expect(queue).toEqual([expect.objectContaining({ courseId: "course-1", syncAttempts: 1 })]);
      }
      if (failure === "dropped") {
        expect(send).not.toHaveBeenCalled();
        expect(await service.hasPendingOfflineData("course-1")).toBe(false);
      }
    },
  );

  it("skips empty, other-learner, offline, and overlapping calls without emitting events", async () => {
    vi.stubGlobal("navigator", { onLine: true });
    const emit = vi.fn();
    const service = new OfflineStorageService(
      { ...DefaultSettings, courseId: "course-1" } as InternalSettings,
      scorm12_errors,
      vi.fn(),
      undefined,
      () => "",
      emit,
    );
    services.push(service);
    await expect(service.syncOfflineData()).resolves.toBe(false);
    service.storeOffline("course-1", createCommit(), { learnerId: "other" });
    await expect(service.hasPendingOfflineData("course-1")).resolves.toBe(false);
    await expect(service.syncOfflineData()).resolves.toBe(false);
    service.storeOffline("course-1", createCommit());
    service["isOnline"] = false;
    await expect(service.syncOfflineData()).resolves.toBe(false);
    expect(emit).not.toHaveBeenCalled();

    service["isOnline"] = true;
    let finish!: (value: { result: string; errorCode: number }) => void;
    vi.spyOn(service as any, "sendDataToLMS").mockReturnValue(
      new Promise((resolve) => {
        finish = resolve;
      }),
    );
    const running = service.syncOfflineData();
    expect(emit.mock.calls).toEqual([["OfflineDataSyncing"]]);
    await expect(service.syncOfflineData()).resolves.toBe(false);
    expect(emit.mock.calls).toEqual([["OfflineDataSyncing"]]);
    finish({ result: "true", errorCode: 0 });
    await expect(running).resolves.toBe(true);
    expect(emit.mock.calls).toEqual([["OfflineDataSyncing"], ["OfflineDataSynced"]]);
  });
});
