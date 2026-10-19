import { beforeEach, describe, expect, it } from "vitest";
import Scorm12API from "../../src/Scorm12API";

const createAPI = () => new Scorm12API({ autocommit: false, logLevel: 5 });

describe("SCORM 1.2 decimal values", () => {
  let api: Scorm12API;

  beforeEach(() => {
    api = createAPI();
    expect(api.LMSInitialize("")).toBe("true");
    expect(api.LMSSetValue("cmi.interactions.0.id", "question-1")).toBe("true");
  });

  it.each(["-1", "-0.5", "1000", "1234567890", ".5", "5.", "0", "correct", "wrong", "incorrect"])(
    "accepts result %j",
    (value) => {
      expect(api.LMSSetValue("cmi.interactions.0.result", value)).toBe("true");
      expect(api.LMSGetLastError()).toBe("0");
      expect(api.cmi.interactions.childArray[0].toJSON().result).toBe(
        value === "incorrect" ? "wrong" : value,
      );
    },
  );

  it.each([".", "-", "-.", "12345678901", "abc"])("rejects result %j with 405", (value) => {
    expect(api.LMSSetValue("cmi.interactions.0.result", value)).toBe("false");
    expect(api.LMSGetLastError()).toBe("405");
  });

  it.each(["150", "-150", "1000", "", "0.5"])("accepts weighting %j", (value) => {
    expect(api.LMSSetValue("cmi.interactions.0.weighting", value)).toBe("true");
    expect(api.LMSGetLastError()).toBe("0");
    expect(api.cmi.interactions.childArray[0].toJSON().weighting).toBe(value);
  });

  it.each([".", "-", "-.", "abc"])("rejects weighting %j with 405", (value) => {
    expect(api.LMSSetValue("cmi.interactions.0.weighting", value)).toBe("false");
    expect(api.LMSGetLastError()).toBe("405");
  });

  describe.each(["raw", "min", "max"])("score.%s", (field) => {
    it.each(["", "50"])("still accepts %j", (value) => {
      expect(api.LMSSetValue(`cmi.core.score.${field}`, value)).toBe("true");
      expect(api.LMSGetLastError()).toBe("0");
      expect(api.LMSGetValue(`cmi.core.score.${field}`)).toBe(value);
    });

    it.each([".", "-", "101", "-1"])("still rejects %j", (value) => {
      expect(api.LMSSetValue(`cmi.core.score.${field}`, value)).toBe("false");
      expect(api.LMSGetLastError()).toBe("405");
    });
  });

  it.each(["", "50"])("preserves LMS-side mastery_score %j", (value) => {
    const freshAPI = createAPI();
    freshAPI.cmi.student_data.mastery_score = "80";
    freshAPI.cmi.student_data.mastery_score = value;
    expect(freshAPI.LMSInitialize("")).toBe("true");
    expect(freshAPI.LMSGetValue("cmi.student_data.mastery_score")).toBe(value);
    expect(freshAPI.LMSGetLastError()).toBe("0");
    expect(freshAPI.LMSSetValue("cmi.student_data.mastery_score", "50")).toBe("false");
    expect(freshAPI.LMSGetLastError()).toBe("403");
  });

  it.each([".", "-", "101", "-1"])("rejects invalid LMS-side mastery_score %j", (value) => {
    const freshAPI = createAPI();
    freshAPI.cmi.student_data.mastery_score = "80";
    expect(() => {
      freshAPI.cmi.student_data.mastery_score = value;
    }).toThrow();
    expect(freshAPI.LMSInitialize("")).toBe("true");
    expect(freshAPI.LMSGetValue("cmi.student_data.mastery_score")).toBe("80");
  });

  it("preserves recorded session_time when a blank is set", () => {
    expect(api.LMSSetValue("cmi.core.session_time", "00:10:00")).toBe("true");
    expect(api.LMSSetValue("cmi.core.session_time", "")).toBe("true");
    expect(api.LMSGetLastError()).toBe("0");
    expect(api.cmi.core.toJSON().session_time).toBe("00:10:00");
  });

  it("accepts blank session_time on a fresh API", () => {
    expect(api.LMSSetValue("cmi.core.session_time", "")).toBe("true");
    expect(api.LMSGetLastError()).toBe("0");
  });
});
