import { describe, it, expect, vi, beforeEach } from "vitest";
import Scorm12API from "../../src/Scorm12API";

describe("BeforeTerminate Event", () => {
  beforeEach(() => {
    // Mock navigator.sendBeacon
    global.navigator.sendBeacon = vi.fn().mockReturnValue(true);
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
