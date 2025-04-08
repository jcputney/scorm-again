import { expect } from "expect";
import { afterEach, beforeEach, describe, it } from "mocha";
import * as sinon from "sinon";
import { LogLevelEnum } from "../../src/constants/enums";
import { EventService } from "../../src/services/EventService";

describe("EventService", () => {
  let eventService: EventService;
  let apiLogSpy: sinon.SinonSpy;

  beforeEach(() => {
    apiLogSpy = sinon.spy();
    eventService = new EventService(apiLogSpy);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("Basic Event Registration and Triggering", () => {
    it("should register and trigger a simple event listener", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("TestEvent", callback);

      // Act
      eventService.processListeners("TestEvent");

      // Assert
      expect(callback.calledOnce).toBe(true);
    });

    it("should register and trigger multiple event listeners for the same event", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("TestEvent", callback1);
      eventService.on("TestEvent", callback2);

      // Act
      eventService.processListeners("TestEvent");

      // Assert
      expect(callback1.calledOnce).toBe(true);
      expect(callback2.calledOnce).toBe(true);
    });

    it("should register and trigger event listeners with CMI element filtering", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("SetValue.cmi.score.scaled", callback1);
      eventService.on("SetValue.cmi.score.raw", callback2);

      // Act
      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");
      eventService.processListeners("SetValue", "cmi.score.raw", "80");

      // Assert
      expect(callback1.calledOnce).toBe(true);
      expect(callback1.calledWith("cmi.score.scaled", "0.8")).toBe(true);
      expect(callback2.calledOnce).toBe(true);
      expect(callback2.calledWith("cmi.score.raw", "80")).toBe(true);
    });
  });

  describe("Event Removal", () => {
    it("should remove a specific event listener", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("TestEvent", callback);
      eventService.off("TestEvent", callback);

      // Act
      eventService.processListeners("TestEvent");

      // Assert
      expect(callback.notCalled).toBe(true);
    });

    it("should clear all listeners for a specific event", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("TestEvent", callback1);
      eventService.on("TestEvent", callback2);
      eventService.clear("TestEvent");

      // Act
      eventService.processListeners("TestEvent");

      // Assert
      expect(callback1.notCalled).toBe(true);
      expect(callback2.notCalled).toBe(true);
    });

    it("should only remove the specified listener when multiple exist", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("TestEvent", callback1);
      eventService.on("TestEvent", callback2);
      eventService.off("TestEvent", callback1);

      // Act
      eventService.processListeners("TestEvent");

      // Assert
      expect(callback1.notCalled).toBe(true);
      expect(callback2.calledOnce).toBe(true);
    });
  });

  describe("Wildcard Event Matching", () => {
    it("should match events with wildcard patterns", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("SetValue.cmi.score.*", callback);

      // Act
      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");
      eventService.processListeners("SetValue", "cmi.score.raw", "80");
      eventService.processListeners("SetValue", "cmi.score.min", "0");
      eventService.processListeners("SetValue", "cmi.score.max", "100");

      // Assert
      expect(callback.callCount).toBe(4);
      expect(callback.getCall(0).args).toEqual(["cmi.score.scaled", "0.8"]);
      expect(callback.getCall(1).args).toEqual(["cmi.score.raw", "80"]);
      expect(callback.getCall(2).args).toEqual(["cmi.score.min", "0"]);
      expect(callback.getCall(3).args).toEqual(["cmi.score.max", "100"]);
    });

    it("should not match events that don't match the wildcard pattern", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("SetValue.cmi.score.*", callback);

      // Act
      eventService.processListeners("SetValue", "cmi.completion_status", "completed");

      // Assert
      expect(callback.notCalled).toBe(true);
    });

    it("should handle wildcard patterns at different positions", () => {
      // Arrange
      const callback = sinon.spy();
      // The EventService only supports wildcards at the end of the pattern
      eventService.on("SetValue.cmi.interactions.0.*", callback);

      // Act
      eventService.processListeners("SetValue", "cmi.interactions.0.result", "correct");
      eventService.processListeners("SetValue", "cmi.interactions.0.type", "choice");
      eventService.processListeners("SetValue", "cmi.interactions.1.result", "incorrect");

      // Assert
      expect(callback.callCount).toBe(2);
      expect(callback.getCall(0).args).toEqual(["cmi.interactions.0.result", "correct"]);
      expect(callback.getCall(1).args).toEqual(["cmi.interactions.0.type", "choice"]);
    });
  });

  describe("Multiple Event Registration", () => {
    it("should register multiple events in a single call", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("Initialize SetValue.cmi.score.scaled", callback);

      // Act
      eventService.processListeners("Initialize");
      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");

      // Assert
      expect(callback.callCount).toBe(2);
      expect(callback.getCall(1).args).toEqual(["cmi.score.scaled", "0.8"]);
    });

    it("should handle removal of multiple events registered in a single call", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("Initialize SetValue.cmi.score.scaled", callback);
      eventService.off("Initialize SetValue.cmi.score.scaled", callback);

      // Act
      eventService.processListeners("Initialize");
      eventService.processListeners("SetValue", "cmi.score.scaled", "0.8");

      // Assert
      expect(callback.notCalled).toBe(true);
    });
  });

  describe("Special Event Types", () => {
    it("should handle Sequence events correctly", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("SequenceNext", callback);

      // Act
      eventService.processListeners("SequenceNext", undefined, "next");

      // Assert
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith("next")).toBe(true);
    });

    it("should handle CommitError events correctly", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("CommitError", callback);

      // Act
      eventService.processListeners("CommitError", undefined, 101);

      // Assert
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(101)).toBe(true);
    });

    it("should handle CommitSuccess events correctly", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("CommitSuccess", callback);

      // Act
      eventService.processListeners("CommitSuccess");

      // Assert
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith()).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty event names gracefully", () => {
      // Arrange
      const callback = sinon.spy();

      // Act - This should not throw an error
      eventService.on("", callback);

      // The parseListenerName method returns null for empty strings,
      // so no listener is registered and processListeners doesn't throw
      eventService.processListeners("");

      // No assertion needed, just checking it doesn't throw
    });

    it("should handle null callbacks gracefully", () => {
      // Act - This should not throw an error
      eventService.on("TestEvent", null as any);
      eventService.processListeners("TestEvent");

      // No assertion needed, just checking it doesn't throw
    });

    it("should handle undefined CMI elements gracefully", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("SetValue", callback);

      // Act
      eventService.processListeners("SetValue", undefined, "value");

      // Assert
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith(undefined, "value")).toBe(true);
    });
  });

  describe("Reset Functionality", () => {
    it("should clear all listeners when reset is called", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("TestEvent1", callback1);
      eventService.on("TestEvent2", callback2);

      // Act
      eventService.reset();
      eventService.processListeners("TestEvent1");
      eventService.processListeners("TestEvent2");

      // Assert
      expect(callback1.notCalled).toBe(true);
      expect(callback2.notCalled).toBe(true);
    });

    it("should allow registering new listeners after reset", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("TestEvent", callback1);
      eventService.reset();
      eventService.on("TestEvent", callback2);

      // Act
      eventService.processListeners("TestEvent");

      // Assert
      expect(callback1.notCalled).toBe(true);
      expect(callback2.calledOnce).toBe(true);
    });
  });
});
