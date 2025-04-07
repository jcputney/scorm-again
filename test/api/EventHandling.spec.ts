import { expect } from "expect";
import { afterEach, beforeEach, describe, it } from "mocha";
import * as sinon from "sinon";
import { Scorm2004API } from "../../src/Scorm2004API";
import { global_constants } from "../../src/constants/api_constants";
import { LogLevelEnum } from "../../src/constants/enums";
import Pretender from "fetch-pretender";

describe("Event Handling", () => {
  let api: Scorm2004API;
  let eventCallback: sinon.SinonSpy;
  let server: Pretender;

  beforeEach(() => {
    // Set up a mock server for HTTP requests
    server = new Pretender();
    server.post("/scorm2004", () => {
      return [
        200,
        { "Content-Type": "application/json" },
        JSON.stringify({ result: "true", errorCode: 0 }),
      ];
    });
    server.post("/scorm2004/error", () => {
      return [
        500,
        { "Content-Type": "application/json" },
        JSON.stringify({ result: "false", errorCode: 101 }),
      ];
    });

    api = new Scorm2004API({
      logLevel: LogLevelEnum.NONE,
      lmsCommitUrl: "/scorm2004",
    });
    eventCallback = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
    server.shutdown();
  });

  describe("Basic Event Registration", () => {
    it("should register and trigger a simple event listener", () => {
      // Arrange
      api.on("Initialize", eventCallback);

      // Act
      api.Initialize();

      // Assert
      expect(eventCallback.calledOnce).toBe(true);
    });

    it("should register and trigger multiple event listeners for the same event", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      api.on("Initialize", callback1);
      api.on("Initialize", callback2);

      // Act
      api.Initialize();

      // Assert
      expect(callback1.calledOnce).toBe(true);
      expect(callback2.calledOnce).toBe(true);
    });

    it("should register and trigger event listeners with CMI element filtering", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      api.on("SetValue.cmi.score.scaled", callback1);
      api.on("SetValue.cmi.score.raw", callback2);
      api.Initialize();

      // Act
      api.SetValue("cmi.score.scaled", "0.8");
      api.SetValue("cmi.score.raw", "80");

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
      api.on("Initialize", eventCallback);
      api.off("Initialize", eventCallback);

      // Act
      api.Initialize();

      // Assert
      expect(eventCallback.notCalled).toBe(true);
    });

    it("should clear all listeners for a specific event", () => {
      // Arrange
      const callback1 = sinon.spy();
      const callback2 = sinon.spy();
      api.on("Initialize", callback1);
      api.on("Initialize", callback2);
      api.clear("Initialize");

      // Act
      api.Initialize();

      // Assert
      expect(callback1.notCalled).toBe(true);
      expect(callback2.notCalled).toBe(true);
    });
  });

  describe("SCORM 2004 Specific Events", () => {
    it("should trigger SequenceNext event on autoProgress", async () => {
      // Arrange
      api = new Scorm2004API({
        logLevel: LogLevelEnum.NONE,
        autoProgress: true,
        lmsCommitUrl: "/scorm2004",
      });
      const navCallback = sinon.spy();
      api.on("SequenceNext", navCallback);
      api.Initialize();

      // Set up server response for navigation request
      server.post("/scorm2004", () => {
        return [
          200,
          { "Content-Type": "application/json" },
          JSON.stringify({
            result: "true",
            errorCode: 0,
            navRequest: {
              name: "SequenceNext",
              data: "next",
            },
          }),
        ];
      });

      // Act
      await api.internalFinish();

      // Wait for the next tick to allow event processing
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(navCallback.calledOnce).toBe(true);
      expect(navCallback.firstCall.args[0]).toBe("next");
    });

    it("should trigger navigation events based on adl.nav.request", async () => {
      // Arrange
      const navCallback = sinon.spy();
      api.on("SequenceChoice", navCallback);
      api.Initialize();

      // Set up server response for navigation request
      server.post("/scorm2004", () => {
        return [
          200,
          { "Content-Type": "application/json" },
          JSON.stringify({
            result: "true",
            errorCode: 0,
            navRequest: {
              name: "SequenceChoice",
              data: "activity_1",
            },
          }),
        ];
      });

      // Act
      const target = "activity_1";
      const navRequest = `{target=${target}}choice`;
      api.SetValue("adl.nav.request", navRequest);

      // Wait for the next tick to allow event processing
      await new Promise((resolve) => setTimeout(resolve, 0));

      await api.internalFinish();

      // Wait for the next tick to allow event processing
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(navCallback.calledOnce).toBe(true);
      expect(navCallback.firstCall.args[0]).toBe("activity_1");
    });
  });

  describe("Commit Events", () => {
    it("should trigger CommitSuccess event on successful commit", async () => {
      // Arrange
      const successCallback = sinon.spy();
      const errorCallback = sinon.spy();
      api.on("CommitSuccess", successCallback);
      api.on("CommitError", errorCallback);
      api.Initialize();

      // Set up server response for successful commit
      server.post("/scorm2004", () => {
        return [
          200,
          { "Content-Type": "application/json" },
          JSON.stringify({
            result: "true",
            errorCode: 0,
            commitObject: {
              completionStatus: "completed",
              successStatus: "passed",
              totalTimeSeconds: 0,
              runtimeData: {},
            },
          }),
        ];
      });

      // Act
      await api.storeData(false);

      // Wait for the next tick to allow event processing
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(successCallback.calledOnce).toBe(true);
      expect(errorCallback.notCalled).toBe(true);
    });

    it("should trigger CommitError event on failed commit", async () => {
      // Arrange
      const successCallback = sinon.spy();
      const errorCallback = sinon.spy();
      api.on("CommitSuccess", successCallback);
      api.on("CommitError", errorCallback);
      api.Initialize();
      api.settings.lmsCommitUrl = "/scorm2004/error";

      // Set up server response for failed commit
      server.post("/scorm2004/error", () => {
        return [
          500,
          { "Content-Type": "application/json" },
          JSON.stringify({
            result: "false",
            errorCode: 101,
            errorMessage: "General error",
          }),
        ];
      });

      // Act
      await api.storeData(false);

      // Wait for the next tick to allow event processing
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(successCallback.notCalled).toBe(true);
      expect(errorCallback.calledOnce).toBe(true);
      expect(errorCallback.firstCall.args[0]).toBe(101);
    });
  });

  describe("Wildcard Event Matching", () => {
    it("should match events with wildcard patterns", () => {
      // Arrange
      const callback = sinon.spy();
      api.on("SetValue.cmi.score.*", callback);
      api.Initialize();

      // Set up server response for successful commit
      server.post("/scorm2004", () => {
        return [
          200,
          { "Content-Type": "application/json" },
          JSON.stringify({
            result: "true",
            errorCode: 0,
            commitObject: {
              completionStatus: "completed",
              successStatus: "passed",
              totalTimeSeconds: 0,
              runtimeData: {
                "cmi.score.scaled": "0.8",
                "cmi.score.raw": "80",
                "cmi.score.min": "0",
                "cmi.score.max": "100",
              },
            },
          }),
        ];
      });

      // Act
      api.SetValue("cmi.score.scaled", "0.8");
      api.SetValue("cmi.score.raw", "80");
      api.SetValue("cmi.score.min", "0");
      api.SetValue("cmi.score.max", "100");

      // Assert
      expect(callback.callCount).toBe(4);
      expect(callback.getCall(0).args).toEqual(["cmi.score.scaled", "0.8"]);
      expect(callback.getCall(1).args).toEqual(["cmi.score.raw", "80"]);
      expect(callback.getCall(2).args).toEqual(["cmi.score.min", "0"]);
      expect(callback.getCall(3).args).toEqual(["cmi.score.max", "100"]);
    });
  });

  describe("Multiple Event Registration", () => {
    it("should register multiple events in a single call", () => {
      // Arrange
      const callback = sinon.spy();
      api.on("Initialize SetValue.cmi.score.scaled", callback);

      // Act
      api.Initialize();
      api.SetValue("cmi.score.scaled", "0.8");

      // Assert
      expect(callback.callCount).toBe(2);
      expect(callback.calledWith("cmi.score.scaled", "0.8")).toBe(true);
    });
  });
});
