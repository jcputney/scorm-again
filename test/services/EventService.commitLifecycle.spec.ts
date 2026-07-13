import { beforeEach, describe, expect, it, vi } from "vitest";
import { EventService } from "../../src/services/EventService";
import { CommitEventContext } from "../../src/types/api_types";

describe("EventService commit lifecycle context", () => {
  let eventService: EventService;

  beforeEach(() => {
    eventService = new EventService(vi.fn());
  });

  it("passes CommitSuccess context as argument zero", () => {
    const callback = vi.fn();
    const context: CommitEventContext = {
      url: "https://example.com/commit",
      trigger: "manual",
      isTerminateCommit: false,
      sequence: 1,
    };
    eventService.on("CommitSuccess", callback);

    eventService.processListeners("CommitSuccess", undefined, undefined, context);

    expect(callback).toHaveBeenCalledExactlyOnceWith(context);
  });

  it("keeps the CommitError code at argument zero and appends context", () => {
    const callback = vi.fn();
    const context: CommitEventContext = {
      url: "https://example.com/commit",
      trigger: "manual",
      isTerminateCommit: false,
      sequence: 1,
      errorCode: 391,
    };
    eventService.on("CommitError", callback);

    eventService.processListeners("CommitError", undefined, 391, context);

    expect(callback).toHaveBeenCalledExactlyOnceWith(391, context);
  });

  it("preserves the legacy zero-context callback shapes", () => {
    const successCallback = vi.fn();
    const errorCallback = vi.fn();
    eventService.on("CommitSuccess", successCallback);
    eventService.on("CommitError", errorCallback);

    eventService.processListeners("CommitSuccess");
    eventService.processListeners("CommitError", undefined, 391);

    expect(successCallback).toHaveBeenCalledExactlyOnceWith();
    expect(errorCallback).toHaveBeenCalledExactlyOnceWith(391);
  });
});
