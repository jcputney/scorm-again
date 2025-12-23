import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import Scorm2004API from "../../src/Scorm2004API";
import {
  PlayerEventAdapter,
  NavigationState,
  ScoStatus,
  CourseProgress,
  ScoDelivery,
  SessionEndReason,
  SessionEndData,
  PlayerEventAdapterCallbacks,
} from "../../src/utilities/PlayerEventAdapter";
import { LogLevelEnum } from "../../src/constants/enums";

describe("PlayerEventAdapter", () => {
  describe("Constructor and Initialization", () => {
    describe("SCORM 1.2", () => {
      let api: Scorm12API;
      let callbacks: PlayerEventAdapterCallbacks;

      beforeEach(() => {
        api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
        callbacks = {
          onNavigationStateChange: vi.fn(),
          onScoStatusChange: vi.fn(),
          onCourseProgressChange: vi.fn(),
          onScoDelivery: vi.fn(),
          onSessionEnd: vi.fn(),
        };
      });

      it("should construct with SCORM 1.2 API", () => {
        const adapter = new PlayerEventAdapter(api, callbacks);
        expect(adapter).toBeInstanceOf(PlayerEventAdapter);
      });

      it("should construct with empty callbacks", () => {
        const adapter = new PlayerEventAdapter(api, {});
        expect(adapter).toBeInstanceOf(PlayerEventAdapter);
      });

      it("should construct with config", () => {
        const adapter = new PlayerEventAdapter(api, callbacks, {
          scoDefinitions: [
            { id: "sco1", title: "SCO 1", launchUrl: "/sco1.html" },
            { id: "sco2", title: "SCO 2", launchUrl: "/sco2.html" },
          ],
          getCurrentScoId: () => "sco1",
        });
        expect(adapter).toBeInstanceOf(PlayerEventAdapter);
      });

      it("should detect SCORM 1.2 API correctly", () => {
        const adapter = new PlayerEventAdapter(api, callbacks);
        // Access private property via type assertion for testing
        expect((adapter as any).isScorm2004).toBe(false);
      });

      it("should set up event listeners on construction", () => {
        const onSpy = vi.spyOn(api, "on");
        new PlayerEventAdapter(api, callbacks);
        expect(onSpy).toHaveBeenCalled();
      });
    });

    describe("SCORM 2004", () => {
      let api: Scorm2004API;
      let callbacks: PlayerEventAdapterCallbacks;

      beforeEach(() => {
        api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
        callbacks = {
          onNavigationStateChange: vi.fn(),
          onScoStatusChange: vi.fn(),
          onCourseProgressChange: vi.fn(),
          onScoDelivery: vi.fn(),
          onSessionEnd: vi.fn(),
        };
      });

      it("should construct with SCORM 2004 API", () => {
        const adapter = new PlayerEventAdapter(api, callbacks);
        expect(adapter).toBeInstanceOf(PlayerEventAdapter);
      });

      it("should detect SCORM 2004 API correctly", () => {
        const adapter = new PlayerEventAdapter(api, callbacks);
        expect((adapter as any).isScorm2004).toBe(true);
      });
    });
  });

  describe("SCORM 1.2 Event Handling", () => {
    let api: Scorm12API;
    let callbacks: PlayerEventAdapterCallbacks;
    let adapter: PlayerEventAdapter;
    let currentScoId: string | null;

    beforeEach(() => {
      api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      currentScoId = "sco1";
      callbacks = {
        onNavigationStateChange: vi.fn(),
        onScoStatusChange: vi.fn(),
        onCourseProgressChange: vi.fn(),
        onScoDelivery: vi.fn(),
        onSessionEnd: vi.fn(),
      };
      adapter = new PlayerEventAdapter(api, callbacks, {
        scoDefinitions: [
          { id: "sco1", title: "SCO 1", launchUrl: "/sco1.html" },
          { id: "sco2", title: "SCO 2", launchUrl: "/sco2.html" },
          { id: "sco3", title: "SCO 3", launchUrl: "/sco3.html" },
        ],
        getCurrentScoId: () => currentScoId,
      });
    });

    afterEach(() => {
      adapter.destroy();
    });

    it("should emit status change on LMSSetValue for lesson_status", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "completed");

      expect(callbacks.onScoStatusChange).toHaveBeenCalled();
      expect(callbacks.onScoStatusChange).toHaveBeenCalledWith("sco1", expect.any(Object));
    });

    it("should emit status change on LMSSetValue for score", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.score.raw", "85");

      expect(callbacks.onScoStatusChange).toHaveBeenCalled();
      expect(callbacks.onCourseProgressChange).toHaveBeenCalled();
    });

    it("should not emit status change if no current SCO ID", () => {
      currentScoId = null;
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "completed");

      expect(callbacks.onScoStatusChange).not.toHaveBeenCalled();
    });

    it("should emit course progress change on LMSCommit", () => {
      api.LMSInitialize("");
      vi.clearAllMocks();
      api.LMSCommit("");

      expect(callbacks.onCourseProgressChange).toHaveBeenCalled();
    });

    it("should emit navigation state change on LMSFinish", () => {
      api.LMSInitialize("");
      vi.clearAllMocks();
      api.LMSFinish("");

      expect(callbacks.onNavigationStateChange).toHaveBeenCalled();
    });

    it("should provide correct navigation state for first SCO", () => {
      currentScoId = "sco1";
      api.LMSInitialize("");
      api.LMSFinish("");

      expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith({
        canPrevious: false,
        canNext: true,
        canExit: true,
        choices: ["sco1", "sco2", "sco3"],
        validRequests: [],
      });
    });

    it("should provide correct navigation state for middle SCO", () => {
      currentScoId = "sco2";
      api.LMSInitialize("");
      api.LMSFinish("");

      expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith({
        canPrevious: true,
        canNext: true,
        canExit: true,
        choices: ["sco1", "sco2", "sco3"],
        validRequests: [],
      });
    });

    it("should provide correct navigation state for last SCO", () => {
      currentScoId = "sco3";
      api.LMSInitialize("");
      api.LMSFinish("");

      expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith({
        canPrevious: true,
        canNext: false,
        canExit: true,
        choices: ["sco1", "sco2", "sco3"],
        validRequests: [],
      });
    });

    it("should handle navigation state when no SCO definitions", () => {
      const adapterNoConfig = new PlayerEventAdapter(api, callbacks, {
        getCurrentScoId: () => "sco1",
      });
      api.LMSInitialize("");
      api.LMSFinish("");

      expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith({
        canPrevious: false,
        canNext: false,
        canExit: true,
        choices: [],
        validRequests: [],
      });

      adapterNoConfig.destroy();
    });
  });

  describe("SCORM 2004 Event Handling", () => {
    let api: Scorm2004API;
    let callbacks: PlayerEventAdapterCallbacks;
    let adapter: PlayerEventAdapter;
    let currentScoId: string | null;

    beforeEach(() => {
      api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      currentScoId = "sco1";
      callbacks = {
        onNavigationStateChange: vi.fn(),
        onScoStatusChange: vi.fn(),
        onCourseProgressChange: vi.fn(),
        onScoDelivery: vi.fn(),
        onSessionEnd: vi.fn(),
      };
      adapter = new PlayerEventAdapter(api, callbacks, {
        scoDefinitions: [
          { id: "sco1", title: "SCO 1", launchUrl: "/sco1.html" },
          { id: "sco2", title: "SCO 2", launchUrl: "/sco2.html" },
        ],
        getCurrentScoId: () => currentScoId,
      });
    });

    afterEach(() => {
      adapter.destroy();
    });

    it("should emit status change on SetValue for completion_status", () => {
      api.Initialize();
      api.SetValue("cmi.completion_status", "completed");

      expect(callbacks.onScoStatusChange).toHaveBeenCalled();
      expect(callbacks.onScoStatusChange).toHaveBeenCalledWith("sco1", expect.any(Object));
    });

    it("should emit status change on SetValue for success_status", () => {
      api.Initialize();
      api.SetValue("cmi.success_status", "passed");

      expect(callbacks.onScoStatusChange).toHaveBeenCalled();
      expect(callbacks.onCourseProgressChange).toHaveBeenCalled();
    });

    it("should emit status change on SetValue for score", () => {
      api.Initialize();
      api.SetValue("cmi.score.scaled", "0.85");

      expect(callbacks.onScoStatusChange).toHaveBeenCalled();
      expect(callbacks.onCourseProgressChange).toHaveBeenCalled();
    });

    it("should not emit status change if no current SCO ID", () => {
      currentScoId = null;
      api.Initialize();
      api.SetValue("cmi.completion_status", "completed");

      expect(callbacks.onScoStatusChange).not.toHaveBeenCalled();
    });
  });

  describe("Sequencing Event Handlers", () => {
    let api: Scorm2004API;
    let callbacks: PlayerEventAdapterCallbacks;
    let adapter: PlayerEventAdapter;

    beforeEach(() => {
      api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      callbacks = {
        onNavigationStateChange: vi.fn(),
        onScoStatusChange: vi.fn(),
        onCourseProgressChange: vi.fn(),
        onScoDelivery: vi.fn(),
        onSessionEnd: vi.fn(),
      };
      adapter = new PlayerEventAdapter(api, callbacks, {
        scoDefinitions: [
          { id: "sco1", title: "SCO 1", launchUrl: "/sco1.html" },
          { id: "sco2", title: "SCO 2", launchUrl: "/sco2.html" },
        ],
      });
    });

    afterEach(() => {
      adapter.destroy();
    });

    describe("handleNavigationValidityUpdate", () => {
      it("should emit navigation state with valid requests", () => {
        adapter.handleNavigationValidityUpdate({
          validRequests: ["previous", "continue", "exit"],
        });

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith({
          canPrevious: true,
          canNext: true,
          canExit: true,
          choices: [],
          validRequests: ["previous", "continue", "exit"],
        });
      });

      it("should parse choice targets from valid requests", () => {
        adapter.handleNavigationValidityUpdate({
          validRequests: ["choice {target=sco1}", "choice {target=sco2}", "continue"],
        });

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith({
          canPrevious: false,
          canNext: true,
          canExit: false,
          choices: ["sco1", "sco2"],
          validRequests: ["choice {target=sco1}", "choice {target=sco2}", "continue"],
        });
      });

      it("should handle exitAll as canExit", () => {
        adapter.handleNavigationValidityUpdate({
          validRequests: ["exitAll"],
        });

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith({
          canPrevious: false,
          canNext: false,
          canExit: true,
          choices: [],
          validRequests: ["exitAll"],
        });
      });

      it("should handle empty valid requests", () => {
        adapter.handleNavigationValidityUpdate({
          validRequests: [],
        });

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith({
          canPrevious: false,
          canNext: false,
          canExit: false,
          choices: [],
          validRequests: [],
        });
      });

      it("should filter out invalid choice targets", () => {
        adapter.handleNavigationValidityUpdate({
          validRequests: ["choice {target=sco1}", "choice", "choice {invalid}"],
        });

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            choices: ["sco1"],
          }),
        );
      });
    });

    describe("handleActivityDelivery", () => {
      it("should emit SCO delivery with activity data", () => {
        adapter.handleActivityDelivery({
          id: "sco1",
          title: "Test Activity",
          resourceIdentifier: "/test.html",
          parameters: "param1=value1",
        });

        expect(callbacks.onScoDelivery).toHaveBeenCalledWith({
          id: "sco1",
          title: "Test Activity",
          launchUrl: "/sco1.html",
          parameters: "param1=value1",
        });
      });

      it("should use SCO definition for launch URL if available", () => {
        adapter.handleActivityDelivery({
          id: "sco2",
          resourceIdentifier: "/override.html",
        });

        expect(callbacks.onScoDelivery).toHaveBeenCalledWith({
          id: "sco2",
          title: "SCO 2",
          launchUrl: "/sco2.html",
          parameters: "",
        });
      });

      it("should fall back to resourceIdentifier if no SCO definition", () => {
        adapter.handleActivityDelivery({
          id: "sco999",
          resourceIdentifier: "/fallback.html",
        });

        expect(callbacks.onScoDelivery).toHaveBeenCalledWith({
          id: "sco999",
          title: "sco999",
          launchUrl: "/fallback.html",
          parameters: "",
        });
      });

      it("should use activity ID as title if no title provided", () => {
        adapter.handleActivityDelivery({
          id: "activity123",
        });

        expect(callbacks.onScoDelivery).toHaveBeenCalledWith({
          id: "activity123",
          title: "activity123",
          launchUrl: "",
          parameters: "",
        });
      });

      it("should handle missing optional fields", () => {
        adapter.handleActivityDelivery({
          id: "sco1",
        });

        expect(callbacks.onScoDelivery).toHaveBeenCalledWith({
          id: "sco1",
          title: "SCO 1",
          launchUrl: "/sco1.html",
          parameters: "",
        });
      });
    });

    describe("handleRollupComplete", () => {
      it("should emit status change and course progress change", () => {
        adapter.handleRollupComplete({ id: "sco1" });

        expect(callbacks.onScoStatusChange).toHaveBeenCalledWith("sco1", expect.any(Object));
        expect(callbacks.onCourseProgressChange).toHaveBeenCalled();
      });
    });

    describe("handleSequencingSessionEnd", () => {
      it("should emit session end with complete reason", () => {
        adapter.handleSequencingSessionEnd({
          reason: "complete",
        });

        expect(callbacks.onSessionEnd).toHaveBeenCalledWith(
          "complete",
          expect.objectContaining({
            progress: expect.any(Object),
          }),
        );
      });

      it("should emit session end with suspend reason", () => {
        adapter.handleSequencingSessionEnd({
          reason: "suspend",
        });

        expect(callbacks.onSessionEnd).toHaveBeenCalledWith("suspend", expect.any(Object));
      });

      it("should emit session end with exit reason", () => {
        adapter.handleSequencingSessionEnd({
          reason: "exit",
        });

        expect(callbacks.onSessionEnd).toHaveBeenCalledWith("exit", expect.any(Object));
      });

      it("should handle exitAll as exit reason", () => {
        adapter.handleSequencingSessionEnd({
          reason: "exitAll",
        });

        expect(callbacks.onSessionEnd).toHaveBeenCalledWith("exit", expect.any(Object));
      });

      it("should emit session end with abandon reason", () => {
        adapter.handleSequencingSessionEnd({
          reason: "abandon",
        });

        expect(callbacks.onSessionEnd).toHaveBeenCalledWith("abandon", expect.any(Object));
      });

      it("should handle abandonAll as abandon reason", () => {
        adapter.handleSequencingSessionEnd({
          reason: "abandonAll",
        });

        expect(callbacks.onSessionEnd).toHaveBeenCalledWith("abandon", expect.any(Object));
      });

      it("should default to exit for unknown reason", () => {
        adapter.handleSequencingSessionEnd({
          reason: "unknown_reason",
        });

        expect(callbacks.onSessionEnd).toHaveBeenCalledWith("exit", expect.any(Object));
      });

      it("should include exception and navigation request in data", () => {
        adapter.handleSequencingSessionEnd({
          reason: "complete",
          exception: "SB.2.1-1",
          navigationRequest: "continue",
        });

        expect(callbacks.onSessionEnd).toHaveBeenCalledWith(
          "complete",
          expect.objectContaining({
            exception: "SB.2.1-1",
            navigationRequest: "continue",
            progress: expect.any(Object),
          }),
        );
      });
    });
  });

  describe("Status Extraction - SCORM 1.2", () => {
    let api: Scorm12API;
    let callbacks: PlayerEventAdapterCallbacks;
    let adapter: PlayerEventAdapter;

    beforeEach(() => {
      api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      callbacks = {
        onScoStatusChange: vi.fn(),
      };
      adapter = new PlayerEventAdapter(api, callbacks, {
        getCurrentScoId: () => "sco1",
      });
    });

    afterEach(() => {
      adapter.destroy();
    });

    it("should extract status from SCORM 1.2 lesson_status - not attempted", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "not attempted");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.completion).toBe("not attempted");
      expect(status.success).toBe("unknown");
    });

    it("should extract status from SCORM 1.2 lesson_status - incomplete", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "incomplete");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.completion).toBe("incomplete");
      expect(status.success).toBe("unknown");
    });

    it("should extract status from SCORM 1.2 lesson_status - completed", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "completed");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.completion).toBe("completed");
      expect(status.success).toBe("unknown");
    });

    it("should extract status from SCORM 1.2 lesson_status - passed", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "passed");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.completion).toBe("completed");
      expect(status.success).toBe("passed");
    });

    it("should extract status from SCORM 1.2 lesson_status - failed", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "failed");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.completion).toBe("completed");
      expect(status.success).toBe("failed");
    });

    it("should extract status from SCORM 1.2 lesson_status - browsed", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "browsed");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.completion).toBe("incomplete");
      expect(status.success).toBe("unknown");
    });

    it("should extract score from SCORM 1.2", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.score.raw", "85");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.score).toBe(85);
      expect(status.scaledScore).toBe(null);
    });

    it("should extract location from SCORM 1.2", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_location", "page5");

      const value = api.LMSGetValue("cmi.core.lesson_location");
      expect(value).toBe("page5");
    });

    it("should handle missing score in SCORM 1.2", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "incomplete");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      // When score.raw is not set, it defaults to "" and parseFloat("") returns NaN
      expect(status.score).toBeNaN();
    });
  });

  describe("Status Extraction - SCORM 2004", () => {
    let api: Scorm2004API;
    let callbacks: PlayerEventAdapterCallbacks;
    let adapter: PlayerEventAdapter;

    beforeEach(() => {
      api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      callbacks = {
        onScoStatusChange: vi.fn(),
      };
      adapter = new PlayerEventAdapter(api, callbacks, {
        getCurrentScoId: () => "sco1",
      });
    });

    afterEach(() => {
      adapter.destroy();
    });

    it("should extract completion_status from SCORM 2004", () => {
      api.Initialize();
      api.SetValue("cmi.completion_status", "completed");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.completion).toBe("completed");
    });

    it("should extract success_status from SCORM 2004", () => {
      api.Initialize();
      api.SetValue("cmi.success_status", "passed");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.success).toBe("passed");
    });

    it("should extract raw score from SCORM 2004", () => {
      api.Initialize();
      api.SetValue("cmi.score.raw", "85");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.score).toBe(85);
    });

    it("should extract scaled score from SCORM 2004", () => {
      api.Initialize();
      api.SetValue("cmi.score.scaled", "0.85");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      expect(status.scaledScore).toBe(0.85);
    });

    it("should extract location from SCORM 2004", () => {
      api.Initialize();
      api.SetValue("cmi.location", "page5");

      const value = api.GetValue("cmi.location");
      expect(value).toBe("page5");
    });

    it("should handle missing scores in SCORM 2004", () => {
      api.Initialize();
      api.SetValue("cmi.completion_status", "incomplete");

      const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
      // When score.raw/scaled is not set, it defaults to "" and parseFloat("") returns NaN
      expect(status.score).toBeNaN();
      expect(status.scaledScore).toBeNaN();
    });
  });

  describe("Time Parsing", () => {
    let api: Scorm12API;
    let adapter: PlayerEventAdapter;

    beforeEach(() => {
      api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      adapter = new PlayerEventAdapter(
        api,
        {
          onScoStatusChange: vi.fn(),
        },
        {
          getCurrentScoId: () => "sco1",
        },
      );
    });

    afterEach(() => {
      adapter.destroy();
    });

    describe("SCORM 1.2 Time Format (CMITimespan)", () => {
      it("should parse basic time format", () => {
        const result = (adapter as any).parseTime12("0000:00:30.00");
        expect(result).toBe(30);
      });

      it("should parse time with minutes", () => {
        const result = (adapter as any).parseTime12("0000:05:30.00");
        expect(result).toBe(330); // 5*60 + 30
      });

      it("should parse time with hours", () => {
        const result = (adapter as any).parseTime12("0001:30:45.00");
        expect(result).toBe(5445); // 1*3600 + 30*60 + 45
      });

      it("should parse time with centiseconds", () => {
        const result = (adapter as any).parseTime12("0000:00:30.50");
        expect(result).toBe(30.5);
      });

      it("should handle four-digit hours", () => {
        const result = (adapter as any).parseTime12("1234:56:78.90");
        // 1234*3600 + 56*60 + 78 + 0.9 = 4442400 + 3360 + 78 + 0.9 = 4445838.9
        expect(result).toBe(4445838.9);
      });

      it("should handle invalid time format", () => {
        const result = (adapter as any).parseTime12("invalid");
        expect(result).toBe(0);
      });

      it("should handle time without centiseconds", () => {
        const result = (adapter as any).parseTime12("0000:00:30");
        expect(result).toBe(30);
      });
    });

    describe("SCORM 2004 Time Format (ISO 8601 Duration)", () => {
      it("should parse seconds only", () => {
        const result = (adapter as any).parseTime2004("PT30S");
        expect(result).toBe(30);
      });

      it("should parse minutes and seconds", () => {
        const result = (adapter as any).parseTime2004("PT5M30S");
        expect(result).toBe(330); // 5*60 + 30
      });

      it("should parse hours, minutes, and seconds", () => {
        const result = (adapter as any).parseTime2004("PT1H30M45S");
        expect(result).toBe(5445); // 1*3600 + 30*60 + 45
      });

      it("should parse days", () => {
        const result = (adapter as any).parseTime2004("P1DT0H0M0S");
        expect(result).toBe(86400); // 1*86400
      });

      it("should parse fractional seconds", () => {
        const result = (adapter as any).parseTime2004("PT30.5S");
        expect(result).toBe(30.5);
      });

      it("should handle zero duration", () => {
        const result = (adapter as any).parseTime2004("PT0S");
        expect(result).toBe(0);
      });

      it("should handle P0DT0H0M0S format", () => {
        const result = (adapter as any).parseTime2004("P0DT0H0M0S");
        expect(result).toBe(0);
      });

      it("should handle invalid duration format", () => {
        const result = (adapter as any).parseTime2004("invalid");
        expect(result).toBe(0);
      });

      it("should parse complex duration", () => {
        const result = (adapter as any).parseTime2004("P2DT3H15M30.5S");
        expect(result).toBe(184530.5); // 2*86400 + 3*3600 + 15*60 + 30.5
      });
    });
  });

  describe("Course Progress Calculation", () => {
    let api: Scorm12API;
    let callbacks: PlayerEventAdapterCallbacks;
    let adapter: PlayerEventAdapter;

    beforeEach(() => {
      api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      callbacks = {
        onCourseProgressChange: vi.fn(),
      };
      adapter = new PlayerEventAdapter(api, callbacks, {
        scoDefinitions: [
          { id: "sco1", title: "SCO 1", launchUrl: "/sco1.html" },
          { id: "sco2", title: "SCO 2", launchUrl: "/sco2.html" },
          { id: "sco3", title: "SCO 3", launchUrl: "/sco3.html" },
        ],
        getCurrentScoId: () => "sco1",
      });
    });

    afterEach(() => {
      adapter.destroy();
    });

    it("should calculate course progress with SCO definitions", () => {
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "completed");

      const progress = (callbacks.onCourseProgressChange as any).mock.calls[0][0] as CourseProgress;
      expect(progress).toEqual({
        completionPct: 0,
        avgScore: null,
        totalTime: 0,
        overallStatus: "not attempted",
        completedCount: 0,
        totalCount: 3,
      });
    });

    it("should handle course progress with no SCO definitions", () => {
      // Destroy the existing adapter first to avoid conflicts
      adapter.destroy();

      const callbacksNew = {
        onCourseProgressChange: vi.fn(),
      };
      const adapterNoScos = new PlayerEventAdapter(api, callbacksNew, {
        getCurrentScoId: () => "sco1",
      });
      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "completed");

      const progress = (callbacksNew.onCourseProgressChange as any).mock
        .calls[0][0] as CourseProgress;
      expect(progress.totalCount).toBe(0);

      adapterNoScos.destroy();
    });
  });

  describe("Cleanup", () => {
    let api: Scorm12API;
    let callbacks: PlayerEventAdapterCallbacks;
    let adapter: PlayerEventAdapter;

    beforeEach(() => {
      api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      callbacks = {
        onNavigationStateChange: vi.fn(),
        onScoStatusChange: vi.fn(),
        onCourseProgressChange: vi.fn(),
      };
      adapter = new PlayerEventAdapter(api, callbacks, {
        getCurrentScoId: () => "sco1",
      });
    });

    it("should remove all event listeners on destroy", () => {
      const offSpy = vi.spyOn(api, "off");
      adapter.destroy();

      expect(offSpy).toHaveBeenCalled();
    });

    it("should not emit events after destroy", () => {
      adapter.destroy();
      vi.clearAllMocks();

      api.LMSInitialize("");
      api.LMSSetValue("cmi.core.lesson_status", "completed");

      expect(callbacks.onScoStatusChange).not.toHaveBeenCalled();
      expect(callbacks.onCourseProgressChange).not.toHaveBeenCalled();
    });

    it("should allow multiple destroy calls", () => {
      adapter.destroy();
      adapter.destroy();
      // Should not throw
    });

    it("should clear cleanup functions array", () => {
      adapter.destroy();
      expect((adapter as any).cleanupFns).toEqual([]);
    });
  });

  describe("Edge Cases", () => {
    describe("Missing Callbacks", () => {
      let api: Scorm12API;

      beforeEach(() => {
        api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      });

      it("should not throw if callback is undefined", () => {
        const adapter = new PlayerEventAdapter(api, {});

        expect(() => {
          api.LMSInitialize("");
          api.LMSSetValue("cmi.core.lesson_status", "completed");
          api.LMSFinish("");
        }).not.toThrow();

        adapter.destroy();
      });

      it("should not throw if specific callback is missing", () => {
        const adapter = new PlayerEventAdapter(api, {
          onScoStatusChange: vi.fn(),
          // Missing onCourseProgressChange
        });

        expect(() => {
          api.LMSInitialize("");
          api.LMSSetValue("cmi.core.lesson_status", "completed");
        }).not.toThrow();

        adapter.destroy();
      });
    });

    describe("Invalid Status Values", () => {
      let api: Scorm12API;
      let callbacks: PlayerEventAdapterCallbacks;
      let adapter: PlayerEventAdapter;

      beforeEach(() => {
        api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
        callbacks = {
          onScoStatusChange: vi.fn(),
        };
        adapter = new PlayerEventAdapter(api, callbacks, {
          getCurrentScoId: () => "sco1",
        });
      });

      afterEach(() => {
        adapter.destroy();
      });

      it("should map unknown lesson_status to unknown", () => {
        api.LMSInitialize("");
        // Mock the internal lesson_status to return an invalid value
        // This simulates corrupted data or edge case scenarios
        vi.spyOn(api.cmi.core, "lesson_status", "get").mockReturnValue("invalid_status");

        // Manually call the emit method
        (adapter as any).emitScoStatusChange("sco1");

        const status = (callbacks.onScoStatusChange as any).mock.calls[0][1] as ScoStatus;
        expect(status.completion).toBe("unknown");
        expect(status.success).toBe("unknown");
      });
    });

    describe("Navigation with Invalid SCO ID", () => {
      let api: Scorm12API;
      let callbacks: PlayerEventAdapterCallbacks;

      beforeEach(() => {
        api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
        callbacks = {
          onNavigationStateChange: vi.fn(),
        };
      });

      it("should handle navigation when current SCO not in definitions", () => {
        const adapter = new PlayerEventAdapter(api, callbacks, {
          scoDefinitions: [
            { id: "sco1", title: "SCO 1", launchUrl: "/sco1.html" },
            { id: "sco2", title: "SCO 2", launchUrl: "/sco2.html" },
          ],
          getCurrentScoId: () => "sco999", // Not in list
        });

        api.LMSInitialize("");
        api.LMSFinish("");

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith({
          canPrevious: false,
          // canNext is true because idx=-1 (not found) and -1 < scos.length-1
          canNext: true,
          canExit: true,
          choices: ["sco1", "sco2"],
          validRequests: [],
        });

        adapter.destroy();
      });
    });

    describe("Choice Target Parsing Edge Cases", () => {
      let api: Scorm2004API;
      let callbacks: PlayerEventAdapterCallbacks;
      let adapter: PlayerEventAdapter;

      beforeEach(() => {
        api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
        callbacks = {
          onNavigationStateChange: vi.fn(),
        };
        adapter = new PlayerEventAdapter(api, callbacks);
      });

      afterEach(() => {
        adapter.destroy();
      });

      it("should handle choice without target", () => {
        adapter.handleNavigationValidityUpdate({
          validRequests: ["choice"],
        });

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            choices: [],
          }),
        );
      });

      it("should handle malformed choice target", () => {
        adapter.handleNavigationValidityUpdate({
          validRequests: ["choice {target=}", "choice {=sco1}"],
        });

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            choices: [],
          }),
        );
      });

      it("should handle choice with nested braces", () => {
        adapter.handleNavigationValidityUpdate({
          validRequests: ["choice {target=sco{1}}"],
        });

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            choices: ["sco{1"],
          }),
        );
      });

      it("should handle multiple choices with same target", () => {
        adapter.handleNavigationValidityUpdate({
          validRequests: ["choice {target=sco1}", "choice {target=sco1}", "choice {target=sco2}"],
        });

        expect(callbacks.onNavigationStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            choices: ["sco1", "sco1", "sco2"],
          }),
        );
      });
    });
  });
});
