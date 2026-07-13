import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import { DefaultSettings } from "../../src/constants/default_settings";
import { CompletionStatus, LogLevelEnum, SuccessStatus } from "../../src/constants/enums";
import { scorm12_errors } from "../../src/constants/error_codes";
import { OfflineStorageService } from "../../src/services/OfflineStorageService";
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

const installSuccessfulXHR = (): void => {
  const xhr = {
    open: vi.fn(),
    setRequestHeader: vi.fn(),
    send: vi.fn(),
    status: 200,
    responseText: JSON.stringify({ result: "true", errorCode: 0 }),
  };
  vi.stubGlobal("XMLHttpRequest", function MockXMLHttpRequest() {
    return xhr;
  } as unknown as typeof XMLHttpRequest);
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
    const fetchStub = vi.spyOn(global, "fetch").mockResolvedValue(successfulResponse());
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
    expect(fetchStub).toHaveBeenCalledWith(
      "https://example.com/commit?final=true",
      expect.any(Object),
    );
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
});
