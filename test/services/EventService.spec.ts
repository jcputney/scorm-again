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

    // SVC-EVT-02: Test clear() should remove ALL listeners when no CMIElement specified
    it("should clear all listeners for a function name when no CMIElement specified (SVC-EVT-02)", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      // Register listeners: one generic, two with specific CMI elements
      eventService.on("SetValue", callback1); // null CMIElement
      eventService.on("SetValue.cmi.score.scaled", callback2); // specific CMIElement
      eventService.on("SetValue.cmi.score.raw", callback3); // specific CMIElement

      // Clear all "SetValue" listeners (no CMIElement specified)
      eventService.clear("SetValue");

      // Process listeners - none should be called
      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");
      eventService.processListeners("SetValue", "cmi.score.raw", "80");
      eventService.processListeners("SetValue", "cmi.other", "value");

      // All callbacks should NOT be called since we cleared all SetValue listeners
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
      expect(callback3).not.toHaveBeenCalled();
    });

    it("should clear only specific CMIElement listeners when CMIElement is specified", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      // Register listeners
      eventService.on("SetValue", callback1); // null CMIElement
      eventService.on("SetValue.cmi.score.scaled", callback2); // specific CMIElement
      eventService.on("SetValue.cmi.score.raw", callback3); // specific CMIElement

      // Clear only "SetValue.cmi.score.scaled" listeners
      eventService.clear("SetValue.cmi.score.scaled");

      // Process listeners
      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");
      eventService.processListeners("SetValue", "cmi.score.raw", "80");

      // callback1 should be called for both (null CMIElement matches all)
      expect(callback1).toHaveBeenCalledTimes(2);
      // callback2 should NOT be called (it was cleared)
      expect(callback2).not.toHaveBeenCalled();
      // callback3 should be called once (for cmi.score.raw)
      expect(callback3).toHaveBeenCalledOnce();
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

    it("should handle SequencePrevious event correctly", () => {
      const callback = vi.fn();
      eventService.on("SequencePrevious", callback);

      eventService.processListeners("SequencePrevious", undefined, "previous");

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith("previous");
    });

    it("should handle SequenceExit event correctly", () => {
      const callback = vi.fn();
      eventService.on("SequenceExit", callback);

      eventService.processListeners("SequenceExit", undefined, "exit");

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith("exit");
    });

    it("should handle CommitError with null value", () => {
      const callback = vi.fn();
      eventService.on("CommitError", callback);

      eventService.processListeners("CommitError", undefined, null);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(null);
    });

    it("should handle CommitError with undefined value", () => {
      const callback = vi.fn();
      eventService.on("CommitError", callback);

      eventService.processListeners("CommitError", undefined, undefined);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(undefined);
    });

    it("should handle Sequence event with null value", () => {
      const callback = vi.fn();
      eventService.on("SequenceChoice", callback);

      eventService.processListeners("SequenceChoice", undefined, null);

      expect(callback).toHaveBeenCalledOnce();
      expect(callback).toHaveBeenCalledWith(null);
    });

    it("should handle CommitSuccess with CMIElement (should ignore it)", () => {
      const callback = vi.fn();
      eventService.on("CommitSuccess", callback);

      // CommitSuccess should ignore CMIElement and value
      eventService.processListeners("CommitSuccess", "cmi.score.scaled", "0.8");

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

    // SVC-EVT-01: Test parseListenerName with empty string should return null
    it("should not register listeners for empty string listener names (SVC-EVT-01)", () => {
      const callback = vi.fn();

      // Try to register with empty string
      eventService.on("", callback);

      // Since parseListenerName returns null for empty strings,
      // the listener should NOT be registered
      eventService.processListeners("");

      // The callback should NOT be called
      expect(callback).not.toHaveBeenCalled();
    });

    it("should handle off() when no listeners exist for the function", () => {
      const callback = vi.fn();

      // Try to remove a listener that was never added
      eventService.off("NonExistentEvent", callback);

      // Should not throw an error
      expect(() => {
        eventService.processListeners("NonExistentEvent");
      }).not.toThrow();
    });

    it("should handle off() when listener does not exist in the array", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      // Add only callback1
      eventService.on("TestEvent", callback1);

      // Try to remove callback2 which was never added
      eventService.off("TestEvent", callback2);

      // callback1 should still be registered
      eventService.processListeners("TestEvent");
      expect(callback1).toHaveBeenCalledOnce();
    });

    it("should handle clear() with empty listener name in space-separated list", () => {
      const callback = vi.fn();

      // Register a listener
      eventService.on("TestEvent", callback);

      // Try to clear with an empty string in the list (should be skipped by parseListenerName)
      eventService.clear("TestEvent ");

      // The listener should still be cleared
      eventService.processListeners("TestEvent");
      expect(callback).not.toHaveBeenCalled();
    });

    it("should handle clear() when function name does not exist in map", () => {
      // Try to clear a function that has no listeners
      eventService.clear("NonExistentFunction");

      // Should not throw an error
      expect(() => {
        eventService.processListeners("NonExistentFunction");
      }).not.toThrow();
    });

    it("should process listeners when no listeners are registered for the function", () => {
      // Try to process listeners for a function that has no listeners
      eventService.processListeners("NonExistentFunction", "cmi.element", "value");

      // Should not throw an error and apiLog should be called
      expect(apiLogSpy).toHaveBeenCalled();
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
