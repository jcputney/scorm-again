import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

const path = "cmi.interactions.0.correct_responses.0.pattern";
const cases: [string, string, boolean][] = [
  ...[
    "{lang=bad!}Paris",
    "{lang=en_US}Paris",
    "{case_matters=yes}Paris",
    "{order_matters=maybe}Paris",
    "{lang=en-US}{case_matters=yes}Paris",
    "{lang=en}{case_matters=true}Paris",
    "{lang=en}{lang=fr}Paris",
    "a[,]{case_matters=true}b",
    "{case_matters=true}{case_matters=false}a",
  ].map((value): [string, string, boolean] => ["fill-in", value, false]),
  ["performance", "{order_matters=maybe}s[.]a", false],
  ["performance", "{case_matters=true}s[.]a", false],
  ["performance", "{lang=en}s[.]a", false],
  ["matching", "{case_matters=true}1[.]a", false],
  ["sequencing", "{order_matters=true}a[,]b", false],
  ["long-fill-in", "{lang=bad!}Paris", false],
  ["fill-in", "{lang=en-US}Paris", true],
  ["fill-in", "{case_matters=true}{order_matters=false}{lang=en}a[,]{lang=fr}b", true],
  ["fill-in", "{order_matters=false}{case_matters=true}Paris", true],
  ["long-fill-in", "{case_matters=true}{lang=en}Paris", true],
  ["performance", "{order_matters=true}s[.]a", true],
  ["fill-in", "Paris", true],
  ["long-fill-in", "Paris", true],
  ["performance", "s[.]a", true],
  ["matching", "1[.]a", true],
  ["sequencing", "a[,]b", true],
];

describe("correct response prefix parity", () => {
  it.each(cases)("%s %j accepted=%s on all write paths", (type, value, accepted) => {
    for (const mode of ["new", "overwrite", "load"]) {
      const api = new Scorm2004API({ autocommit: false, logLevel: 5 });
      const plain =
        type === "performance"
          ? "s[.]a"
          : type === "matching"
            ? "1[.]a"
            : type === "sequencing"
              ? "a[,]b"
              : "Paris";
      if (mode === "load") {
        expect(() =>
          api.loadFromJSON({
            interactions: [{ id: "q", type, correct_responses: [{ pattern: value }] }],
          }),
        ).not.toThrow();
        api.Initialize("");
        expect(api.GetLastError()).toBe("0");
      } else {
        api.Initialize("");
        api.SetValue("cmi.interactions.0.id", "q");
        api.SetValue("cmi.interactions.0.type", type);
        if (mode === "overwrite") expect(api.SetValue(path, plain)).toBe("true");
        expect(api.SetValue(path, value)).toBe(accepted ? "true" : "false");
        expect(api.GetLastError()).toBe(accepted ? "0" : "406");
      }
      if (accepted) expect(api.GetValue(path)).toBe(value);
      else if (mode === "overwrite") expect(api.GetValue(path)).toBe(plain);
      else expect(api.GetValue(path)).not.toBe(value);
    }
  });

  it.each([false, true])("skips invalid leaves and warns (flattened=%s)", (flattened) => {
    const api = new Scorm2004API({ autocommit: false, logLevel: 1 });
    const log = vi.spyOn(api, "apiLog");
    if (flattened) {
      api.loadFromFlattenedJSON({
        "cmi.learner_id": "learner",
        "cmi.invalid_field": "invalid",
        "cmi.interactions.0.id": "q",
        "cmi.interactions.0.type": "fill-in",
        [path]: "{lang=bad!}Paris",
        "cmi.location": "next",
        "cmi.interactions.1.id": "q2",
        "cmi.interactions.1.type": "fill-in",
        "cmi.interactions.1.correct_responses.0.pattern": "valid",
      });
    } else {
      api.loadFromJSON({
        learner_id: "learner",
        invalid_field: "invalid",
        interactions: [
          { id: "q", type: "fill-in", correct_responses: [{ pattern: "{lang=bad!}Paris" }] },
          { id: "q2", type: "fill-in", correct_responses: [{ pattern: "valid" }] },
        ],
        score: { scaled: "invalid" },
        location: "next",
      });
    }
    expect(log.mock.calls.some((call) => String(call[1]).includes("Skipped invalid value"))).toBe(
      true,
    );
    expect(api.lastErrorCode).toBe("0");
    api.Initialize("");
    expect(api.GetLastError()).toBe("0");
    expect(api.GetValue("cmi.learner_id")).toBe("learner");
    expect(api.GetValue("cmi.location")).toBe("next");
    expect(api.GetValue("cmi.interactions.1.correct_responses.0.pattern")).toBe("valid");
    expect(api.GetValue(path)).not.toBe("{lang=bad!}Paris");
  });

  it("keeps an earlier error code and does not skip valid leaves", () => {
    const api = new Scorm2004API({ autocommit: false, logLevel: 1 });
    api.GetValue("cmi.location");
    const earlier = api.GetLastError();
    expect(earlier).not.toBe("0");
    const log = vi.spyOn(api, "apiLog");
    api.loadFromJSON({ learner_id: "learner", location: "next" });
    expect(log.mock.calls.some((call) => String(call[1]).includes("Skipped invalid value"))).toBe(
      false,
    );
    expect(api.GetLastError()).toBe(earlier);
    api.Initialize("");
    expect(api.GetValue("cmi.learner_id")).toBe("learner");
    expect(api.GetValue("cmi.location")).toBe("next");
  });
});
