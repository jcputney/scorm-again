import { beforeEach, describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

describe("SCORM 2004 data types", () => {
  let api: Scorm2004API;

  beforeEach(() => {
    api = new Scorm2004API({ autocommit: false, logLevel: 5 });
    expect(api.Initialize("")).toBe("true");
  });

  function set(element: string, value: string, accepted = true, roundTrip = true) {
    expect(api.SetValue(element, value)).toBe(accepted ? "true" : "false");
    expect(api.GetLastError()).toBe(accepted ? "0" : "406");
    if (accepted && roundTrip) {
      expect(api.GetValue(element)).toBe(value);
      expect(api.GetLastError()).toBe("0");
    }
  }

  function interaction(type = "fill-in") {
    set("cmi.interactions.0.id", "q0");
    set("cmi.interactions.0.type", type);
  }

  it.each([
    "2026-10-19T12:00:00Z",
    "2026-10-19T12:00:00-08:00",
    "2026-10-19T12:00+05:30",
    "2026-10-19T12:00Z",
    "2026-10-19T12:00+05",
    "2026-10-19T12:00-08",
    "2026-10-19T12:00:00.123456Z",
    "2026-10-19T12:00:00.5+08:00",
  ])("accepts timestamp %s", (value) => {
    interaction();
    set("cmi.interactions.0.timestamp", value);
  });

  it.each([
    "2026-10-19T25:00:00Z",
    "2026-10-19TZ",
    "2026-10-19T12Z",
    "2026-10-19T12:00:00.5|08:00",
    "2026-10-19T12:00:00Z:30",
    "2026-10-19T12:00:00.1234567Z",
    "1969-10-19T12:00:00Z",
  ])("rejects timestamp %s", (value) => {
    interaction();
    set("cmi.interactions.0.timestamp", value, false);
  });

  it.each([
    "en-GB-oxendict",
    "zh-Hans-CN-x-private",
    "sl-rozaj-biske",
    "en-a",
    "i-klingon",
    "haw",
    "fil",
    "sgn-US",
    "i-x",
    "",
  ])("accepts language %s", (value) => {
    set("cmi.learner_preference.language", value);
  });

  it.each(["e1-x", "en-", "en--GB", "toolongprimary-x", "en-abcdefghi"])(
    "rejects language %s",
    (value) => {
      set("cmi.learner_preference.language", value, false);
    },
  );

  for (const type of ["fill-in", "long-fill-in"]) {
    it.each(["{lang=haw}x", "{lang=en-GB-oxendict}Paris", "{lang=i-x}"])(
      `accepts ${type} pattern %s`,
      (value) => {
        interaction(type);
        set("cmi.interactions.0.correct_responses.0.pattern", value);
      },
    );
    it.each(["{lang=i-}", "{lang=bad!}x", "{lang=en--GB}x", "{lang=en-abcdefghi}x"])(
      `rejects ${type} pattern %s`,
      (value) => {
        interaction(type);
        set("cmi.interactions.0.correct_responses.0.pattern", value, false);
      },
    );
  }

  it.each(["{lang=zh-Hans-CN}x", "{lang=i-x}"])("accepts comment %s", (value) => {
    set("cmi.comments_from_learner.0.comment", value);
  });
  it.each(["{lang=bad!}x", "{lang=i-}"])("rejects comment %s", (value) => {
    set("cmi.comments_from_learner.0.comment", value, false);
  });

  it.each(["cmi.location", "cmi.comments_from_learner.0.location"])(
    "accepts empty %s",
    (element) => {
      set(element, "");
    },
  );
  it.each(["audio_level", "delivery_speed"])("accepts unbounded %s", (element) => {
    set(`cmi.learner_preference.${element}`, "1000");
  });
  it("still rejects zero delivery speed", () => {
    expect(api.SetValue("cmi.learner_preference.delivery_speed", "0")).toBe("false");
    expect(api.GetLastError()).toBe("407");
  });

  it.each([
    ["sequencing", "a[,]b[,]a"],
    ["fill-in", "Bob[,]Bob"],
    ["matching", "1[.]a[,]1[.]a"],
    ["performance", "s1[.]a[,]s1[.]a"],
    ["choice", "a[,]a"],
  ])("checks within-value duplicates for %s", (type, value) => {
    interaction(type);
    set("cmi.interactions.0.correct_responses.0.pattern", value, type !== "choice");
    set("cmi.interactions.0.learner_response", value, type !== "choice");
  });

  it.each(["{target=act.}choice", "{target=été}jump", "{target=a.b}choice"])(
    "accepts navigation %s",
    (value) => {
      set("adl.nav.request", value, true, false);
    },
  );
  it.each(["{target=}choice", "{target=a b}choice"])("rejects navigation %s", (value) => {
    set("adl.nav.request", value, false);
  });
  it.each(["a.b", "act.", "été"])("resolves request_valid for %s", (target) => {
    const baseline = api.GetValue("adl.nav.request_valid.choice.{target=act1}");
    expect(baseline).not.toBe("unknown");
    expect(api.GetValue(`adl.nav.request_valid.choice.{target=${target}}`)).toBe(baseline);
    expect(api.GetLastError()).toBe("0");
  });

  it("accepts LMS-set request_valid targets with the same identifier characters", () => {
    const fresh = new Scorm2004API({ autocommit: false, logLevel: 5 });
    expect(() => {
      fresh.adl.nav.request_valid.choice = { "{target=act.}": "true", "{target=été}": "false" };
    }).not.toThrow();
    expect(Object.keys(fresh.adl.nav.request_valid.choice.getAll())).toEqual([
      "{target=act.}",
      "{target=été}",
    ]);
  });

  it.each(["12345", "-1234567890"])("accepts result %s", (value) => {
    interaction();
    set("cmi.interactions.0.result", value);
  });
  it("rejects an eleven-digit result", () => {
    interaction();
    set("cmi.interactions.0.result", "12345678901", false);
  });
});
