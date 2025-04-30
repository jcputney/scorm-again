import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";

describe("Event Handling", () => {
  let api: Scorm2004API;
  let eventCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Set up fetch mocks for HTTP requests
    vi.stubGlobal("fetch", vi.fn());

    (fetch as ReturnType<typeof vi.fn>).mockImplementation((url) => {
      if (url.toString().includes("/scorm2004/error")) {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ result: "false", errorCode: 101 }),
        } as Response);
      }

      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ result: "true", errorCode: 0 }),
      } as Response);
    });

    api = new Scorm2004API({
      logLevel: LogLevelEnum.NONE,
      lmsCommitUrl: "/scorm2004",
    });
    eventCallback = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("Basic Event Registration", () => {
    it("should register and trigger a simple event listener", () => {
      // Arrange
      api.on("Initialize", eventCallback);

      // Act
      api.Initialize();

      // Assert
      expect(eventCallback).toHaveBeenCalledOnce();
    });

    it("should register and trigger multiple event listeners for the same event", () => {
      // Arrange
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      api.on("Initialize", callback1);
      api.on("Initialize", callback2);

      // Act
      api.Initialize();

      // Assert
      expect(callback1).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledOnce();
    });

    it("should register and trigger event listeners with CMI element filtering", () => {
      // Arrange
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      api.on("SetValue.cmi.score.scaled", callback1);
      api.on("SetValue.cmi.score.raw", callback2);
      api.Initialize();

      // Act
      api.SetValue("cmi.score.scaled", "0.8");
      api.SetValue("cmi.score.raw", "80");

      // Assert
      expect(callback1).toHaveBeenCalledOnce();
      expect(callback1).toHaveBeenCalledWith("cmi.score.scaled", "0.8");
      expect(callback2).toHaveBeenCalledOnce();
      expect(callback2).toHaveBeenCalledWith("cmi.score.raw", "80");
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
      expect(eventCallback).not.toHaveBeenCalled();
    });

    it("should clear all listeners for a specific event", () => {
      // Arrange
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      api.on("Initialize", callback1);
      api.on("Initialize", callback2);
      api.clear("Initialize");

      // Act
      api.Initialize();

      // Assert
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).not.toHaveBeenCalled();
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
      const navCallback = vi.fn();
      api.on("SequenceNext", navCallback);
      api.Initialize();

      // Set up server response for navigation request
      vi.stubGlobal("fetch", vi.fn());

      (fetch as ReturnType<typeof vi.fn>).mockImplementation((url) => {
        if (url.toString().includes("/scorm2004")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                result: "true",
                errorCode: 0,
                navRequest: {
                  name: "SequenceNext",
                  data: "next",
                },
              }),
          } as Response);
        }

        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ result: "false", errorCode: 101 }),
        } as Response);
      });

      // Act
      await api.internalFinish();

      // Wait for the next tick to allow event processing
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(navCallback).toHaveBeenCalledOnce();
      expect(navCallback.mock.calls[0][0]).toBe("next");
    });

    it("should trigger navigation events based on adl.nav.request", async () => {
      // Arrange
      const navCallback = vi.fn();
      api.on("SequenceChoice", navCallback);
      api.Initialize();

      // Set up server response for navigation request
      vi.stubGlobal("fetch", vi.fn());

      (fetch as ReturnType<typeof vi.fn>).mockImplementation((url) => {
        if (url.toString().includes("/scorm2004")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                result: "true",
                errorCode: 0,
                navRequest: {
                  name: "SequenceChoice",
                  data: "activity_1",
                },
              }),
          } as Response);
        }

        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ result: "false", errorCode: 101 }),
        } as Response);
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
      expect(navCallback).toHaveBeenCalledOnce();
      expect(navCallback.mock.calls[0][0]).toBe("activity_1");
    });
  });

  describe("Commit Events", () => {
    it("should trigger CommitSuccess event on successful commit", async () => {
      // Arrange
      const successCallback = vi.fn();
      const errorCallback = vi.fn();
      api.on("CommitSuccess", successCallback);
      api.on("CommitError", errorCallback);
      api.Initialize();

      // Set up server response for successful commit
      vi.stubGlobal("fetch", vi.fn());

      (fetch as ReturnType<typeof vi.fn>).mockImplementation((url) => {
        if (url.toString().includes("/scorm2004")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
                result: "true",
                errorCode: 0,
                commitObject: {
                  completionStatus: "completed",
                  successStatus: "passed",
                  totalTimeSeconds: 0,
                  runtimeData: {},
                },
              }),
          } as Response);
        }

        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ result: "false", errorCode: 101 }),
        } as Response);
      });

      // Act
      await api.storeData(false);

      // Wait for the next tick to allow event processing
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(successCallback).toHaveBeenCalledOnce();
      expect(errorCallback).not.toHaveBeenCalled();
    });

    it("should trigger CommitError event on failed commit", async () => {
      // Arrange
      const successCallback = vi.fn();
      const errorCallback = vi.fn();
      api.on("CommitSuccess", successCallback);
      api.on("CommitError", errorCallback);
      api.Initialize();
      api.settings.lmsCommitUrl = "/scorm2004/error";

      // Set up server response for failed commit
      vi.stubGlobal("fetch", vi.fn());

      (fetch as ReturnType<typeof vi.fn>).mockImplementation((url) => {
        if (url.toString().includes("/scorm2004/error")) {
          return Promise.resolve({
            ok: false,
            status: 500,
            json: () =>
              Promise.resolve({
                result: "false",
                errorCode: 101,
                errorMessage: "General error",
              }),
          } as Response);
        }

        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ result: "false", errorCode: 101 }),
        } as Response);
      });

      // Act
      await api.storeData(false);

      // Wait for the next tick to allow event processing
      await new Promise((resolve) => setTimeout(resolve, 0));

      // Assert
      expect(successCallback).not.toHaveBeenCalled();
      expect(errorCallback).toHaveBeenCalledOnce();
      expect(errorCallback.mock.calls[0][0]).toBe(101);
    });
  });

  describe("Wildcard Event Matching", () => {
    it("should match events with wildcard patterns", () => {
      // Arrange
      const callback = vi.fn();
      api.on("SetValue.cmi.score.*", callback);
      api.Initialize();

      // Set up server response for successful commit
      vi.stubGlobal("fetch", vi.fn());

      (fetch as ReturnType<typeof vi.fn>).mockImplementation((url) => {
        if (url.toString().includes("/scorm2004")) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () =>
              Promise.resolve({
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
          } as Response);
        }

        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ result: "false", errorCode: 101 }),
        } as Response);
      });

      // Act
      api.SetValue("cmi.score.scaled", "0.8");
      api.SetValue("cmi.score.raw", "80");
      api.SetValue("cmi.score.min", "0");
      api.SetValue("cmi.score.max", "100");

      // Assert
      expect(callback).toHaveBeenCalledTimes(4);
      expect(callback.mock.calls[0]).toEqual(["cmi.score.scaled", "0.8"]);
      expect(callback.mock.calls[1]).toEqual(["cmi.score.raw", "80"]);
      expect(callback.mock.calls[2]).toEqual(["cmi.score.min", "0"]);
      expect(callback.mock.calls[3]).toEqual(["cmi.score.max", "100"]);
    });
  });

  describe("Multiple Event Registration", () => {
    it("should register multiple events in a single call", () => {
      // Arrange
      const callback = vi.fn();
      api.on("Initialize SetValue.cmi.score.scaled", callback);

      // Act
      api.Initialize();
      api.SetValue("cmi.score.scaled", "0.8");

      // Assert
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith("cmi.score.scaled", "0.8");
    });
  });
});
