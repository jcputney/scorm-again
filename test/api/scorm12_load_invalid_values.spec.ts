import { afterEach, describe, expect, it, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import { LogLevelEnum } from "../../src/constants/enums";

describe("SCORM 1.2 loading invalid values", () => {
  afterEach(() => vi.restoreAllMocks());

  it.each(["loadFromJSON", "loadFromFlattenedJSON"] as const)(
    "%s skips invalid leaves, warns, and preserves the previous error",
    (method) => {
      const api = new Scorm12API({ autocommit: false, logLevel: 1 });
      const log = vi.spyOn(api, "apiLog");
      api.LMSGetValue("cmi.core.lesson_location");
      expect(api.LMSGetLastError()).toBe("301");

      const json =
        method === "loadFromJSON"
          ? {
              core: { student_id: "learner", lesson_status: "bogus", lesson_location: "next" },
              suspend_data: "saved",
            }
          : {
              "cmi.core.student_id": "learner",
              "cmi.core.lesson_status": "bogus",
              "cmi.core.lesson_location": "next",
              "cmi.suspend_data": "saved",
            };
      expect(() => api[method](json)).not.toThrow();
      expect(api.LMSGetLastError()).toBe("301");
      expect(log).toHaveBeenCalledWith(
        "loadFromJSON",
        expect.stringContaining("Skipped invalid value for cmi.core.lesson_status"),
        LogLevelEnum.WARN,
      );

      expect(api.LMSInitialize("")).toBe("true");
      expect(api.LMSGetValue("cmi.core.student_id")).toBe("learner");
      expect(api.LMSGetValue("cmi.core.lesson_location")).toBe("next");
      expect(api.LMSGetValue("cmi.suspend_data")).toBe("saved");
      expect(api.LMSGetValue("cmi.core.lesson_status")).toBe("not attempted");
    },
  );
});
