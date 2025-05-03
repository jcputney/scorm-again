import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EventService } from "../../src/services/EventService";

describe("EventService", () => {
  let eventService: EventService;
  let apiLogSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    apiLogSpy = vi.fn();
    eventService = new EventService(apiLogSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic Event Registration and Triggering", () => {
    it("should register and trigger a simple event listener", () => {
      const callback = vi.fn();
      eventService.on("TestEvent", callback);

      eventService.processListeners("TestEvent");

      expect(callback).toHaveBeenCalledOnce();
    });

    it("should register and trigger multiple event listeners for the same event", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      eventService.on("TestEvent", callback1);
      eventService.on("TestEvent", callback2);

      eventService.processListeners("TestEvent");

      expect(callback1).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();
    });

    it("should register and trigger event listeners with CMI element filtering", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      eventService.on("SetValue.cmi.score.scaled", callback1);
      eventService.on("SetValue.cmi.score.raw", callback2);

      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");
      eventService.processListeners("SetValue", "cmi.score.raw", "80");

      expect(callback1).toHaveBeenCalledOnce();
      expect(callback1).toHaveBeenCalledWith("cmi.score.scaled", "0.8");
      expect(callback2).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledWith("cmi.score.raw", "80");
    });
  });

  describe("Event Removal", () => {
    it("should remove a specific event listener", () => {
      const callback = vi.fn();
      eventService.on("TestEvent", callback);
      eventService.off("TestEvent", callback);

      eventService.processListeners("TestEvent");

      expect(callback).not.toHaveBeenCalled();
    });

    it("should clear all listeners for a specific event", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      eventService.on("TestEvent", callback1);
      eventService.on("TestEvent", callback2);
      eventService.clear("TestEvent");

      eventService.processListeners("TestEvent");

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });

    it("should only remove the specified listener when multiple exist", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      eventService.on("TestEvent", callback1);
      eventService.on("TestEvent", callback2);
      eventService.off("TestEvent", callback1);

      eventService.processListeners("TestEvent");

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledOnce();
    });
  });

  describe("Wildcard Event Matching", () => {
    it("should match events with wildcard patterns", () => {
      const callback = vi.fn();
      eventService.on("SetValue.cmi.score.*", callback);

      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");
      eventService.processListeners("SetValue", "cmi.score.raw", "80");
      eventService.processListeners("SetValue", "cmi.score.min", "0");
      eventService.processListeners("SetValue", "cmi.score.max", "100");

      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback).toHaveBeenNthCalledWith(1, "cmi.score.scaled", "0.8");
      expect(callback).toHaveBeenNthCalledWith(2, "cmi.score.raw", "80");
      expect(callback).toHaveBeenNthCalledWith(3, "cmi.score.min", "0");
      expect(callback).toHaveBeenNthCalledWith(4, "cmi.score.max", "100");
    });

    it("should not match events that don't match the wildcard pattern", () => {
      const callback = vi.fn();
      eventService.on("SetValue.cmi.score.*", callback);

      eventService.processListeners("SetValue", "cmi.completion_status", "completed");

      expect(callback).not.toHaveBeenCalled();
    });

    it("should handle wildcard patterns at different positions", () => {
      const callback = vi.fn();
      // The EventService only supports wildcards at the end of the pattern
      eventService.on("SetValue.cmi.interactions.0.*", callback);

      eventService.processListeners("SetValue", "cmi.interactions.0.result", "correct");
      eventService.processListeners("SetValue", "cmi.interactions.0.type", "choice");
      eventService.processListeners("SetValue", "cmi.interactions.1.result", "incorrect");

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(1, "cmi.interactions.0.result", "correct");
      expect(callback).toHaveBeenNthCalledWith(2, "cmi.interactions.0.type", "choice");
    });
  });

  describe("Multiple Event Registration", () => {
    it("should register multiple events in a single call", () => {
      const callback = vi.fn();
      eventService.on("Initialize SetValue.cmi.score.scaled", callback);

      eventService.processListeners("Initialize");
      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenNthCalledWith(2, "cmi.score.scaled", "0.8");
    });

    it("should handle removal of multiple events registered in a single call", () => {
      const callback = vi.fn();
      eventService.on("Initialize SetValue.cmi.score.scaled", callback);
      eventService.off("Initialize SetValue.cmi.score.scaled", callback);

      eventService.processListeners("Initialize");
      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");

      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe("Special Event Types", () => {
    it("should handle Sequence events correctly", () => {
      const callback = vi.fn();
      eventService.on("SequenceNext", callback);

      eventService.processListeners("SequenceNext", undefined, "next");

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith("next");
    });

    it("should handle CommitError events correctly", () => {
      const callback = vi.fn();
      eventService.on("CommitError", callback);

      eventService.processListeners("CommitError", undefined, 101);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(101);
    });

    it("should handle CommitSuccess events correctly", () => {
      const callback = vi.fn();
      eventService.on("CommitSuccess", callback);

      eventService.processListeners("CommitSuccess");

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty event names gracefully", () => {
      const callback = vi.fn();

      eventService.on("", callback);

      // The parseListenerName method returns null for empty strings,
      // so no listener is registered and processListeners doesn't throw
      eventService.processListeners("");

      // No assertion needed, just checking it doesn't throw
    });

    it("should handle null callbacks gracefully", () => {
      eventService.on("TestEvent", null as any);
      eventService.processListeners("TestEvent");

      // No assertion needed, just checking it doesn't throw
    });

    it("should handle undefined CMI elements gracefully", () => {
      const callback = vi.fn();
      eventService.on("SetValue", callback);

      eventService.processListeners("SetValue", undefined, "value");

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(undefined, "value");
    });
  });

  describe("Reset Functionality", () => {
    it("should clear all listeners when reset is called", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      eventService.on("TestEvent1", callback1);
      eventService.on("TestEvent2", callback2);

      eventService.reset();
      eventService.processListeners("TestEvent1");
      eventService.processListeners("TestEvent2");

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
    });

    it("should allow registering new listeners after reset", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      eventService.on("TestEvent", callback1);
      eventService.reset();
      eventService.on("TestEvent", callback2);

      eventService.processListeners("TestEvent");

      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledOnce();
    });
  });
});
