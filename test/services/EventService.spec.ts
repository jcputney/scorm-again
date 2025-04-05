import { beforeEach, describe, it } from "mocha";
import { expect } from "expect";
import * as sinon from "sinon";
import { EventService } from "../../src/services/EventService";
import { LogLevelEnum } from "../../src/constants/enums";

describe("EventService", () => {
  let eventService: EventService;
  let apiLogStub: sinon.SinonStub;

  beforeEach(() => {
    // Create a stub for the apiLog function
    apiLogStub = sinon.stub();

    // Create a new instance for each test
    eventService = new EventService(apiLogStub);
  });

  describe("on", () => {
    it("should add a listener for a simple event", () => {
      // Arrange
      const callback = sinon.spy();

      // Act
      eventService.on("initialize", callback);

      // Assert
      expect(apiLogStub.calledOnce).toBe(true);
      expect(
        apiLogStub.calledWith("on", "Added event listener: 1", LogLevelEnum.INFO, "initialize"),
      ).toBe(true);
    });

    it("should add a listener for an event with a CMI element", () => {
      // Arrange
      const callback = sinon.spy();

      // Act
      eventService.on("setValue.cmi.core.student_id", callback);

      // Assert
      expect(apiLogStub.calledOnce).toBe(true);
      expect(
        apiLogStub.calledWith("on", "Added event listener: 1", LogLevelEnum.INFO, "setValue"),
      ).toBe(true);
    });

    it("should add multiple listeners for space-separated events", () => {
      // Arrange
      const callback = sinon.spy();

      // Act
      eventService.on("initialize terminate", callback);

      // Assert
      expect(apiLogStub.calledTwice).toBe(true);
      expect(
        apiLogStub.firstCall.calledWith(
          "on",
          "Added event listener: 1",
          LogLevelEnum.INFO,
          "initialize",
        ),
      ).toBe(true);
      expect(
        apiLogStub.secondCall.calledWith(
          "on",
          "Added event listener: 2",
          LogLevelEnum.INFO,
          "terminate",
        ),
      ).toBe(true);
    });

    it("should not add a listener if callback is not provided", () => {
      // Act
      eventService.on("initialize", null);

      // Assert
      expect(apiLogStub.called).toBe(false);
    });

    it("should not add a functional listener for invalid event names", () => {
      // Arrange
      const callback = sinon.spy();

      // Act - try to add a listener with an invalid event name
      eventService.on("   ", callback);

      // Try to trigger the listener with a valid event name
      eventService.processListeners("initialize");

      // Assert - verify the callback was not called
      expect(callback.called).toBe(false);
    });
  });

  describe("off", () => {
    it("should remove a listener for a simple event", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("initialize", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.off("initialize", callback);

      // Assert
      expect(apiLogStub.calledOnce).toBe(true);
      expect(
        apiLogStub.calledWith("off", "Removed event listener: 0", LogLevelEnum.INFO, "initialize"),
      ).toBe(true);
    });

    it("should remove a listener for an event with a CMI element", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("setValue.cmi.core.student_id", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.off("setValue.cmi.core.student_id", callback);

      // Assert
      expect(apiLogStub.calledOnce).toBe(true);
      expect(
        apiLogStub.calledWith("off", "Removed event listener: 0", LogLevelEnum.INFO, "setValue"),
      ).toBe(true);
    });

    it("should remove multiple listeners for space-separated events", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("initialize terminate", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.off("initialize terminate", callback);

      // Assert
      expect(apiLogStub.calledTwice).toBe(true);
      expect(
        apiLogStub.firstCall.calledWith(
          "off",
          "Removed event listener: 1",
          LogLevelEnum.INFO,
          "initialize",
        ),
      ).toBe(true);
      expect(
        apiLogStub.secondCall.calledWith(
          "off",
          "Removed event listener: 0",
          LogLevelEnum.INFO,
          "terminate",
        ),
      ).toBe(true);
    });

    it("should not remove a listener if callback is not provided", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("initialize", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.off("initialize", null);

      // Assert
      expect(apiLogStub.called).toBe(false);
    });

    it("should not remove a listener if event name is invalid", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("initialize", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.off(".", callback);

      // Assert
      expect(apiLogStub.called).toBe(false);
    });

    it("should not remove a listener if it doesn't exist", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("initialize", callback1);
      apiLogStub.resetHistory();

      // Act
      eventService.off("initialize", callback2);

      // Assert
      expect(apiLogStub.called).toBe(false);
    });
  });

  describe("clear", () => {
    it("should clear all listeners for a simple event", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("initialize", callback1);
      eventService.on("initialize", callback2);

      // Act
      eventService.clear("initialize");

      // Process listeners to verify they were cleared
      eventService.processListeners("initialize");

      // Assert
      expect(callback1.called).toBe(false);
      expect(callback2.called).toBe(false);
    });

    it("should clear all listeners for an event with a CMI element", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("setValue.cmi.core.student_id", callback);

      // Act
      eventService.clear("setValue.cmi.core.student_id");

      // Process listeners to verify they were cleared
      eventService.processListeners("setValue", "cmi.core.student_id");

      // Assert
      expect(callback.called).toBe(false);
    });

    it("should clear multiple listeners for space-separated events", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("initialize", callback1);
      eventService.on("terminate", callback2);

      // Act
      eventService.clear("initialize terminate");

      // Process listeners to verify they were cleared
      eventService.processListeners("initialize");
      eventService.processListeners("terminate");

      // Assert
      expect(callback1.called).toBe(false);
      expect(callback2.called).toBe(false);
    });

    it("should not clear listeners if event name is invalid", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("initialize", callback);

      // Act
      eventService.clear(".");

      // Process listeners to verify they were not cleared
      eventService.processListeners("initialize");

      // Assert
      expect(callback.called).toBe(true);
    });
  });

  describe("processListeners", () => {
    it("should call the callback for a matching simple event", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("initialize", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.processListeners("initialize");

      // Assert
      expect(callback.calledOnce).toBe(true);
      expect(
        apiLogStub.calledWith(
          "processListeners",
          "Processing listener: initialize",
          LogLevelEnum.DEBUG,
          undefined,
        ),
      ).toBe(true);
    });

    it("should call the callback for a matching event with a CMI element", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("setValue.cmi.core.student_id", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.processListeners("setValue", "cmi.core.student_id", "123");

      // Assert
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith("cmi.core.student_id", "123")).toBe(true);
    });

    it("should call the callback for a matching event with a wildcard CMI element", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("setValue.cmi.core.*", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.processListeners("setValue", "cmi.core.student_id", "123");

      // Assert
      expect(callback.calledOnce).toBe(true);
      expect(callback.calledWith("cmi.core.student_id", "123")).toBe(true);
    });

    it("should not call the callback for a non-matching event", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("initialize", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.processListeners("terminate");

      // Assert
      expect(callback.called).toBe(false);
    });

    it("should not call the callback for a non-matching CMI element", () => {
      // Arrange
      const callback = sinon.spy();
      eventService.on("setValue.cmi.core.student_id", callback);
      apiLogStub.resetHistory();

      // Act
      eventService.processListeners("setValue", "cmi.core.student_name", "John Doe");

      // Assert
      expect(callback.called).toBe(false);
    });
  });

  describe("reset", () => {
    it("should clear all listeners", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      eventService.on("initialize", callback1);
      eventService.on("terminate", callback2);

      // Act
      eventService.reset();

      // Process listeners to verify they were cleared
      eventService.processListeners("initialize");
      eventService.processListeners("terminate");

      // Assert
      expect(callback1.called).toBe(false);
      expect(callback2.called).toBe(false);
    });
  });
});
