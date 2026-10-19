import { describe, expect, it } from "vitest";
import Scorm12API from "../../src/Scorm12API";

describe("SCORM 1.2 interaction values", () => {
  it.each(["student_response", "correct_responses.0.pattern"])(
    "accepts multiline %s",
    (element) => {
      const api = new Scorm12API({ autocommit: false, logLevel: 5 });
      expect(api.LMSInitialize("")).toBe("true");
      expect(api.LMSSetValue("cmi.interactions.0.id", "q1")).toBe("true");
      expect(api.LMSSetValue("cmi.interactions.0.type", "fill-in")).toBe("true");
      expect(api.LMSSetValue(`cmi.interactions.0.${element}`, "line one\nline two")).toBe("true");
      expect(api.LMSGetLastError()).toBe("0");
    },
  );
});
