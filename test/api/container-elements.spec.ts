import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import Scorm12API from "../../src/Scorm12API";
import { LogLevelEnum } from "../../src/constants/enums";

const containers2004 = [
  "cmi",
  "cmi.objectives",
  "cmi.interactions",
  "cmi.comments_from_learner",
  "cmi.comments_from_lms",
  "cmi.learner_preference",
  "cmi.score",
  "adl",
  "adl.nav",
];
const containers12 = ["cmi", "cmi.core", "cmi.interactions", "cmi.objectives"];

describe("Public container element access", () => {
  for (const version of ["2004", "1.2"] as const) {
    const setup = () => {
      const api =
        version === "2004"
          ? new Scorm2004API({ logLevel: LogLevelEnum.NONE })
          : new Scorm12API({ logLevel: LogLevelEnum.NONE });
      const set = (path: string, value: string) =>
        api instanceof Scorm2004API ? api.SetValue(path, value) : api.LMSSetValue(path, value);
      const error = () =>
        api instanceof Scorm2004API ? api.GetLastError() : api.LMSGetLastError();
      if (api instanceof Scorm2004API) api.Initialize("");
      else api.LMSInitialize("");
      return { api, set, error };
    };

    for (const index of ["0x", "00", "+0", "0e2", " 0"]) {
      it(`${version} protects existing containers at index ${JSON.stringify(index)}`, () => {
        const { api, set, error } = setup();
        expect(set("cmi.objectives.0.id", "objective")).toBe("true");
        expect(set("cmi.objectives.0.score.raw", "12")).toBe("true");
        const row = api.cmi.objectives.childArray[0];
        const before = JSON.stringify(row);
        expect(set(`cmi.objectives.${index}.score`, "illegal")).toBe("false");
        expect(error()).toBe("401");
        expect(api.cmi.objectives.childArray[0]).toBe(row);
        expect(JSON.stringify(row)).toBe(before);
      });
    }

    for (const path of [
      "cmi.objectives.0.score",
      "cmi.interactions.0.objectives.0",
      "cmi.interactions.0.correct_responses.0",
    ]) {
      it(`${version} rejects missing container ${path} without creating rows`, () => {
        const { api, set, error } = setup();
        expect(set(path, "illegal")).toBe("false");
        expect(error()).toBe("401");
        expect(api.cmi.objectives._count).toBe(0);
        expect(api.cmi.interactions._count).toBe(0);
      });
    }

    it(`${version} still creates missing rows for valid leaves`, () => {
      const { api, set } = setup();
      expect(set("cmi.objectives.0.id", "objective")).toBe("true");
      expect(set("cmi.objectives.0.score.raw", "12")).toBe("true");
      expect(set("cmi.interactions.0.id", "interaction")).toBe("true");
      expect(set("cmi.interactions.0.objectives.0.id", "objective")).toBe("true");
      expect(set("cmi.interactions.0.type", "true-false")).toBe("true");
      expect(
        set("cmi.interactions.0.correct_responses.0.pattern", version === "2004" ? "true" : "t"),
      ).toBe("true");
      expect(api.cmi.objectives._count).toBe(1);
      expect(api.cmi.interactions._count).toBe(1);
      expect(api.cmi.interactions.childArray[0]?.objectives._count).toBe(1);
      expect(api.cmi.interactions.childArray[0]?.correct_responses._count).toBe(1);
    });
  }

  /** @spec SCORM 2004 RTE: collection records and their score subtrees are containers. */
  it("preserves materialized rows, LMS loading, and internal container reads", () => {
    const api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
    api.loadFromJSON({ cmi: { objectives: [{ id: "objective", score: { raw: "12" } }] } });
    api.Initialize("");
    expect(api.getCMIValue("cmi")).toBe(api.cmi);
    for (const element of ["cmi.objectives.0", "cmi.objectives.0.score"]) {
      expect(api.SetValue(element, "illegal")).toBe("false");
      expect(api.GetLastError()).toBe("401");
      expect(api.GetValue(element)).toBe("");
      expect(api.GetLastError()).toBe("401");
      expect(api.GetValue("cmi.objectives.0.score.raw")).toBe("12");
      expect(api.GetLastError()).toBe("0");
    }
    expect(api.SetValue("cmi.interactions.0.id", "interaction")).toBe("true");
    expect(api.GetValue("cmi.interactions.0.id")).toBe("interaction");
    expect(api.GetValue("cmi.interactions._count")).toBe("1");
    expect(api.GetLastError()).toBe("0");
  });

  /** @spec SCORM 2004 RTE DMI: containers are undefined data model elements (401). */
  for (const element of containers2004) {
    for (const method of ["SetValue", "GetValue"] as const) {
      it(`2004 ${method} rejects ${element} without changing the model`, () => {
        const api = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
        api.Initialize("");
        const before = JSON.stringify(api.cmi);
        const adl = api.adl;
        const adlBefore = JSON.stringify(api.adl);
        expect(
          method === "SetValue" ? api.SetValue(element, "illegal") : api.GetValue(element),
        ).toBe(method === "SetValue" ? "false" : "");
        expect(api.GetLastError()).toBe("401");
        expect(JSON.stringify(api.cmi)).toBe(before);
        expect(api.adl).toBe(adl);
        expect(JSON.stringify(api.adl)).toBe(adlBefore);
        expect(api.SetValue("cmi.location", "after")).toBe("true");
        expect(api.GetValue("cmi.location")).toBe("after");
        expect(api.GetLastError()).toBe("0");
      });
    }
  }

  /** @spec SCORM 1.2 RTE: container access uses the unknown-element error. */
  for (const element of [...containers12, "cmi.core.nonexistent"]) {
    for (const method of ["LMSSetValue", "LMSGetValue"] as const) {
      it(`1.2 ${method} rejects ${element} without changing the model`, () => {
        const api = new Scorm12API({ logLevel: LogLevelEnum.NONE });
        api.LMSInitialize("");
        const before = JSON.stringify(api.cmi);
        expect(
          method === "LMSSetValue" ? api.LMSSetValue(element, "illegal") : api.LMSGetValue(element),
        ).toBe(method === "LMSSetValue" ? "false" : "");
        expect(api.LMSGetLastError()).toBe("401");
        expect(JSON.stringify(api.cmi)).toBe(before);
        expect(api.LMSSetValue("cmi.core.lesson_location", "after")).toBe("true");
        expect(api.LMSGetValue("cmi.core.lesson_location")).toBe("after");
        expect(api.LMSGetLastError()).toBe("0");
      });
    }
  }
});
