import { beforeEach, describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";

describe("BeforeTerminate Event", () => {
  // Mock localStorage for tests that use offline support
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: vi.fn((key: string) => {
        return store[key] || null;
      }),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value.toString();
      }),
      clear: vi.fn(() => {
        store = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
    };
  })();

  beforeEach(() => {
    // Mock navigator.sendBeacon
    global.navigator.sendBeacon = vi.fn().mockReturnValue(true);

    // Mock localStorage using vi.stubGlobal (same approach as OfflineStorageService.spec.ts)
    vi.stubGlobal("localStorage", localStorageMock);
    localStorageMock.clear();
  });

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
