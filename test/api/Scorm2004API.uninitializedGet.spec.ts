import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import Scorm12API from "../../src/Scorm12API";
import { LogLevelEnum } from "../../src/constants/enums";
import { Settings, StringKeyMap } from "../../src";

/**
 * Regression coverage for ADL conformance finding #2: per IEEE 1484.11.2 /
 * SCORM 2004 RTE, GetValue of an implemented, writable element that has no
 * spec-defined default must return "" with error 403 (VALUE_NOT_INITIALIZED)
 * when read before it has ever been set. The fix gates this at the public
 * GetValue boundary (Scorm2004API.checkUninitializedGet); these tests pin the
 * boundary's behaviour, including the edges the fixture corpus does not reach.
 */

const init2004 = (startingData?: StringKeyMap, settings?: Settings): Scorm2004API => {
  const api = new Scorm2004API({ logLevel: LogLevelEnum.NONE, ...settings });
  api.loadFromJSON(startingData ?? {}, "");
  api.lmsInitialize();
  return api;
};

const getLogLevelsForElement = (
  onLogMessage: ReturnType<typeof vi.fn>,
  element: string,
): unknown[] =>
  onLogMessage.mock.calls
    .filter(([, logMessage]) => logMessage.includes(element))
    .map(([messageLevel]) => messageLevel);

describe("SCORM 2004 GetValue 403 (VALUE_NOT_INITIALIZED)", () => {
  describe("read before set → 403 for no-default elements", () => {
    const elements = [
      "cmi.suspend_data",
      "cmi.location",
      "cmi.scaled_passing_score",
      "cmi.max_time_allowed",
      "cmi.completion_threshold",
      "cmi.progress_measure",
      "cmi.score.scaled",
      "cmi.score.raw",
      "cmi.score.min",
      "cmi.score.max",
    ];

    it.each(elements)("%s returns '' and error 403", (element) => {
      const api = init2004();
      expect(api.lmsGetValue(element)).toBe("");
      expect(api.lmsGetLastError()).toBe("403");
    });
  });

  describe("array-child no-default elements → 403", () => {
    it("objectives.N.{score.*,progress_measure,description} after the objective exists", () => {
      const api = init2004();
      api.lmsSetValue("cmi.objectives.0.id", "obj-1");

      for (const sub of [
        "cmi.objectives.0.score.scaled",
        "cmi.objectives.0.score.raw",
        "cmi.objectives.0.score.min",
        "cmi.objectives.0.score.max",
        "cmi.objectives.0.progress_measure",
        "cmi.objectives.0.description",
      ]) {
        expect(api.lmsGetValue(sub), sub).toBe("");
        expect(api.lmsGetLastError(), sub).toBe("403");
      }
    });

    it("interactions.N.* after the interaction exists", () => {
      const api = init2004();
      api.lmsSetValue("cmi.interactions.0.id", "int-1");
      api.lmsSetValue("cmi.interactions.0.type", "true-false");

      for (const sub of [
        "cmi.interactions.0.weighting",
        "cmi.interactions.0.timestamp",
        "cmi.interactions.0.result",
        "cmi.interactions.0.latency",
        "cmi.interactions.0.learner_response",
        "cmi.interactions.0.description",
      ]) {
        expect(api.lmsGetValue(sub), sub).toBe("");
        expect(api.lmsGetLastError(), sub).toBe("403");
      }
    });

    it("comments_from_learner.N.timestamp after the comment exists", () => {
      const api = init2004();
      api.lmsSetValue("cmi.comments_from_learner.0.comment", "hi");
      expect(api.lmsGetValue("cmi.comments_from_learner.0.timestamp")).toBe("");
      expect(api.lmsGetLastError()).toBe("403");
    });
  });

  describe("logging severity", () => {
    it("logs an uninitialized no-default element at WARN by default", () => {
      const onLogMessage = vi.fn();
      const api = init2004(undefined, {
        logLevel: LogLevelEnum.WARN,
        onLogMessage,
      });
      onLogMessage.mockClear();

      expect(api.lmsGetValue("cmi.suspend_data")).toBe("");
      expect(api.lmsGetLastError()).toBe("403");
      expect(getLogLevelsForElement(onLogMessage, "cmi.suspend_data")).toEqual([
        LogLevelEnum.WARN,
        LogLevelEnum.WARN,
      ]);
    });

    it.each(["ERROR", LogLevelEnum.ERROR] as const)(
      "logs an uninitialized no-default element at the configured %s level",
      (uninitializedGetLogLevel) => {
        const onLogMessage = vi.fn();
        const api = init2004(undefined, {
          logLevel: LogLevelEnum.WARN,
          uninitializedGetLogLevel,
          onLogMessage,
        });
        onLogMessage.mockClear();

        expect(api.lmsGetValue("cmi.location")).toBe("");
        expect(api.lmsGetLastError()).toBe("403");
        expect(getLogLevelsForElement(onLogMessage, "cmi.location")).toEqual([
          uninitializedGetLogLevel,
          uninitializedGetLogLevel,
        ]);
      },
    );

    it("keeps out-of-range collection reads at ERROR", () => {
      const onLogMessage = vi.fn();
      const api = init2004(undefined, {
        logLevel: LogLevelEnum.WARN,
        onLogMessage,
      });
      api.lmsSetValue("cmi.objectives.0.id", "obj-1");
      onLogMessage.mockClear();

      expect(api.lmsGetValue("cmi.objectives.5.id")).toBe("");
      expect(api.lmsGetLastError()).toBe("403");
      expect(getLogLevelsForElement(onLogMessage, "cmi.objectives.5.id")).toEqual([
        LogLevelEnum.ERROR,
        LogLevelEnum.ERROR,
      ]);
    });
  });

  describe("once written → returns the value with error 0", () => {
    it("SetValue then GetValue round-trips a no-default element", () => {
      const api = init2004();
      expect(api.lmsSetValue("cmi.suspend_data", "state=5")).toBe("true");
      expect(api.lmsGetValue("cmi.suspend_data")).toBe("state=5");
      expect(api.lmsGetLastError()).toBe("0");
    });

    it("an explicit SetValue(x, '') reads back as '' with error 0 (not 403)", () => {
      const api = init2004();
      expect(api.lmsSetValue("cmi.suspend_data", "")).toBe("true");
      expect(api.lmsGetValue("cmi.suspend_data")).toBe("");
      expect(api.lmsGetLastError()).toBe("0");
    });

    it("a launch-seeded (loadFromJSON) value reads back with error 0", () => {
      const api = init2004({ cmi: { scaled_passing_score: "0.7" } });
      expect(api.lmsGetValue("cmi.scaled_passing_score")).toBe("0.7");
      expect(api.lmsGetLastError()).toBe("0");
    });
  });

  describe("elements with a spec-defined default are unaffected", () => {
    it.each([
      ["cmi.completion_status", "unknown"],
      ["cmi.success_status", "unknown"],
    ])("%s returns its default '%s' with error 0", (element, expected) => {
      const api = init2004();
      expect(api.lmsGetValue(element)).toBe(expected);
      expect(api.lmsGetLastError()).toBe("0");
    });

    it("objectives.N.success_status keeps its 'unknown' default (no 403)", () => {
      const api = init2004();
      api.lmsSetValue("cmi.objectives.0.id", "obj-1");
      expect(api.lmsGetValue("cmi.objectives.0.success_status")).toBe("unknown");
      expect(api.lmsGetLastError()).toBe("0");
    });
  });
});

describe("SCORM 1.2 GetValue is unchanged by the 403 gate", () => {
  it("read-before-set of a core element returns '' with error 0, not 403", () => {
    const api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
    api.lmsInitialize();
    expect(api.lmsGetValue("cmi.core.lesson_location")).toBe("");
    expect(api.lmsGetLastError()).toBe("0");
  });
});
