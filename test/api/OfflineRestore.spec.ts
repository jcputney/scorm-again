import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import Scorm2004API from "../../src/Scorm2004API";
import { AsynchronousHttpService } from "../../src/services/AsynchronousHttpService";
import { OfflineStorageService } from "../../src/services/OfflineStorageService";
import { Settings } from "../../src/types/api_types";

const queueKey = "scorm_again_sync_queue";
const snapshotKey = "scorm_again_offline_data_course";
const formats = ["json", "flattened", "params"] as const;

describe("Offline commit, restore and replay", () => {
  let online = false;
  let requests: { body: string; headers: Record<string, string>; async: boolean }[];
  let success = true;
  let xhrFailure: "onerror" | "ontimeout" | undefined;
  const apis: (Scorm12API | Scorm2004API)[] = [];
  const settings = (): Settings => ({
    enableOfflineSupport: true,
    courseId: "course",
    lmsCommitUrl: "https://example.com/commit",
    syncOnInitialize: false,
    syncOnTerminate: false,
    autocommit: false,
    logLevel: 5,
    xhrResponseHandler: () => ({
      result: success ? "true" : "false",
      errorCode: success ? 0 : 101,
    }),
  });
  const create = (version: string, extra: Settings = {}) => {
    const api =
      version === "1.2"
        ? new Scorm12API({ ...settings(), ...extra })
        : new Scorm2004API({ ...settings(), ...extra });
    apis.push(api);
    return api;
  };

  beforeEach(() => {
    localStorage.clear();
    online = false;
    success = true;
    xhrFailure = undefined;
    requests = [];
    vi.spyOn(navigator, "onLine", "get").mockImplementation(() => online);
    vi.stubGlobal(
      "XMLHttpRequest",
      class {
        headers: Record<string, string> = {};
        async = false;
        onload?: () => void;
        onerror?: () => void;
        ontimeout?: () => void;
        open(_method: string, _url: string, async: boolean) {
          this.async = async;
        }
        setRequestHeader(key: string, value: string) {
          this.headers[key] = value;
        }
        send(body: string) {
          requests.push({ body, headers: this.headers, async: this.async });
          if (this.async)
            queueMicrotask(() => (xhrFailure ? this[xhrFailure]?.() : this.onload?.()));
        }
      },
    );
  });

  afterEach(() => {
    for (const api of apis.splice(0)) (api as any)._offlineStorageService?.destroy();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  for (const version of ["1.2", "2004"]) {
    for (const dataCommitFormat of formats) {
      for (const renderCommonCommitFields of [true, false]) {
        it(`${version}: stores and replays ${dataCommitFormat}, common fields ${renderCommonCommitFields}`, async () => {
          const extra = {
            dataCommitFormat,
            renderCommonCommitFields,
            xhrHeaders: { "X-Course": "course" },
            xhrWithCredentials: true,
          };
          const offlineApi = create(version, extra);
          expect(offlineApi.lmsInitialize()).toBe("true");
          offlineApi.lmsSetValue("cmi.suspend_data", "saved &= value");
          expect(offlineApi.lmsCommit()).toBe("true");
          const queued = JSON.parse(localStorage.getItem(queueKey)!);
          expect(queued).toHaveLength(1);
          expect(queued[0].data).toEqual(offlineApi.getCommitObject(false));
          expect(requests).toHaveLength(0);

          online = true;
          const liveApi = create(version, { ...extra, enableOfflineSupport: false });
          liveApi.loadFromJSON({ cmi: { suspend_data: "saved &= value" } });
          liveApi.lmsInitialize();
          expect(liveApi.lmsCommit()).toBe("true");
          const service = (offlineApi as any)._offlineStorageService as OfflineStorageService;
          (service as any).isOnline = true;
          await service.syncOfflineData();
          expect(requests).toHaveLength(2);
          expect(requests[0].async).toBe(false);
          expect(requests[1]).toEqual({ ...requests[0], async: true });
          expect(localStorage.getItem(snapshotKey)).toBeNull();
          expect(JSON.parse(localStorage.getItem(queueKey)!)).toEqual([]);
        });

        if (dataCommitFormat !== "params") {
          it(`${version}: restores ${dataCommitFormat}, common fields ${renderCommonCommitFields} before CMI initialization`, () => {
            const extra = { dataCommitFormat, renderCommonCommitFields };
            const first = create(version, extra);
            const identity =
              version === "1.2"
                ? { core: { student_id: "offline-id" } }
                : { learner_id: "offline-id" };
            first.loadFromJSON({ cmi: { ...identity, suspend_data: "offline" } });
            first.lmsInitialize();
            first.lmsCommit();
            const restored = create(version, extra);
            restored.loadFromJSON({ cmi: { suspend_data: "LMS" } });
            expect(restored.lmsInitialize()).toBe("true");
            expect(restored.lmsGetValue("cmi.suspend_data")).toBe("offline");
            expect(
              restored.lmsGetValue(version === "1.2" ? "cmi.core.student_id" : "cmi.learner_id"),
            ).toBe("offline-id");
          });
        }
      }
    }

    for (const dataCommitFormat of ["json", "flattened"] as const) {
      it(`${version}: restores all partial ${dataCommitFormat} commits without metadata`, () => {
        const extra: Settings = {
          sendFullCommit: false,
          dataCommitFormat,
          includeCommitSequence: true,
          terminateCommitParam: "final",
        };
        const first = create(version, extra);
        first.lmsInitialize();
        first.lmsSetValue("cmi.suspend_data", "earlier");
        first.lmsCommit();
        if (version === "2004") {
          first.lmsSetValue("cmi.location", "later");
        }
        if (version === "1.2") {
          first.lmsSetValue("cmi.core.lesson_location", "later");
        }
        first.lmsCommit();
        const queue = JSON.parse(localStorage.getItem(queueKey)!);
        for (const item of queue) {
          item.data.final = true;
        }
        queue.unshift({ courseId: "course", data: null });
        localStorage.setItem(queueKey, JSON.stringify(queue));
        const restored = create(version, extra);
        const log = vi.spyOn(restored, "apiLog");
        expect(restored.lmsInitialize()).toBe("true");
        expect(restored.lmsGetValue("cmi.suspend_data")).toBe("earlier");
        expect(
          restored.lmsGetValue(version === "1.2" ? "cmi.core.lesson_location" : "cmi.location"),
        ).toBe("later");
        const errors = log.mock.calls.filter((call) => call[2] === 4);
        expect(errors).toHaveLength(1);
        expect(errors[0][1]).toContain("Error restoring offline data");
      });
    }

    it(`${version}: ignores stale snapshots and other courses`, () => {
      localStorage.setItem(snapshotKey, JSON.stringify({ cmi: { suspend_data: "stale" } }));
      for (const queue of [[], [{ courseId: "other", data: {} }]]) {
        localStorage.setItem(queueKey, JSON.stringify(queue));
        const api = create(version);
        api.loadFromJSON({ cmi: { suspend_data: "LMS" } });
        expect(api.lmsInitialize()).toBe("true");
        expect(api.lmsGetValue("cmi.suspend_data")).toBe("LMS");
      }
    });

    it(`${version}: skips params restore without failing Initialize`, () => {
      const first = create(version, { dataCommitFormat: "params" });
      first.lmsInitialize();
      first.lmsSetValue("cmi.suspend_data", "offline");
      first.lmsCommit();
      const restored = create(version);
      restored.loadFromJSON({ cmi: { suspend_data: "LMS" } });
      expect(restored.lmsInitialize()).toBe("true");
      expect(restored.lmsGetValue("cmi.suspend_data")).toBe("LMS");
    });
  }

  for (const event of ["onerror", "ontimeout"] as const) {
    it(`returns commit failure for async XHR ${event}`, async () => {
      const api = create("2004");
      xhrFailure = event;
      const result = await (api as any)._httpService.performAsyncRequest(
        "https://example.com/commit",
        { cmi: { suspend_data: "saved" } },
      );
      expect(result).toEqual({ result: "false", errorCode: 391 });
    });
  }

  it("retains synchronous-service replay when xhrResponseHandler rejects the reply", async () => {
    const api = create("2004");
    api.lmsInitialize();
    api.lmsCommit();
    const service = (api as any)._offlineStorageService as OfflineStorageService;
    (service as any).isOnline = true;
    success = false;
    await service.syncOfflineData();
    expect(requests[0].async).toBe(true);
    expect(JSON.parse(localStorage.getItem(queueKey)!)).toHaveLength(1);
  });

  it("keeps async replay pending until the configured service emits completion", async () => {
    let complete!: (value: { result: string; errorCode: number }) => void;
    const responseHandler = vi.fn(
      () => new Promise<{ result: string; errorCode: number }>((resolve) => (complete = resolve)),
    );
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ status: 200 }));
    const process = vi.spyOn(AsynchronousHttpService.prototype, "processHttpRequest");
    const api = create("2004", { useAsynchronousCommits: true, responseHandler });
    api.lmsInitialize();
    api.lmsCommit();
    const service = (api as any)._offlineStorageService as OfflineStorageService;
    (service as any).isOnline = true;
    let settled = false;
    const replay = service.syncOfflineData().then(() => (settled = true));
    await vi.waitFor(() => expect(responseHandler).toHaveBeenCalledOnce());
    expect(process).toHaveBeenCalledOnce();
    expect(settled).toBe(false);
    expect(JSON.parse(localStorage.getItem(queueKey)!)).toHaveLength(1);
    complete({ result: "true", errorCode: 0 });
    await replay;
    expect(JSON.parse(localStorage.getItem(queueKey)!)).toEqual([]);
  });

  it("waits for async replay results and retains failed commits", async () => {
    const requestHandler = vi.fn((data) => data);
    const responseHandler = vi.fn(async () => ({
      result: success ? "true" : "false",
      errorCode: 0,
    }));
    const fetchMock = vi.fn().mockResolvedValue({ status: 200 });
    vi.stubGlobal("fetch", fetchMock);
    const api = create("2004", { useAsynchronousCommits: true, requestHandler, responseHandler });
    api.lmsInitialize();
    api.lmsCommit();
    const service = (api as any)._offlineStorageService as OfflineStorageService;
    (service as any).isOnline = true;
    success = false;
    await service.syncOfflineData();
    expect(JSON.parse(localStorage.getItem(queueKey)!)).toHaveLength(1);
    expect(localStorage.getItem(snapshotKey)).not.toBeNull();
    success = true;
    await service.syncOfflineData();
    expect(JSON.parse(localStorage.getItem(queueKey)!)).toEqual([]);
    expect(localStorage.getItem(snapshotKey)).toBeNull();
    expect(responseHandler).toHaveBeenCalledTimes(2);
    expect(requestHandler).toHaveBeenCalledTimes(2);
    expect(requestHandler).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ trigger: "offline-replay" }),
    );
  });

  it("clears only snapshots for courses whose queues empty", async () => {
    const api = create("1.2");
    api.lmsInitialize();
    api.lmsCommit();
    const service = (api as any)._offlineStorageService as OfflineStorageService;
    service.storeOffline("other", { cmi: { suspend_data: "other" } });
    (service as any).isOnline = true;
    success = false;
    await service.syncOfflineData();
    expect(localStorage.getItem(snapshotKey)).not.toBeNull();
    expect(JSON.parse(localStorage.getItem(queueKey)!)).toHaveLength(2);
    let call = 0;
    api.settings = {
      xhrResponseHandler: () => ({ result: ++call === 1 ? "true" : "false", errorCode: 0 }),
    };
    await service.syncOfflineData();
    expect(localStorage.getItem(snapshotKey)).toBeNull();
    expect(localStorage.getItem("scorm_again_offline_data_other")).not.toBeNull();
    expect(JSON.parse(localStorage.getItem(queueKey)!)).toHaveLength(1);
  });
});
