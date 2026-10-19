import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { Scorm2004ValidationError } from "../../src/exceptions/scorm2004_exceptions";

const values = {
  "{target=act1}": "true",
  "{target=act2}": "false",
  "{target=act3}": "unknown",
};
const createAPI = () => new Scorm2004API({ autocommit: false, logLevel: 5 });

describe("SCORM 2004 LMS request validity maps", () => {
  for (const request of ["choice", "jump"] as const) {
    it.each(["assignment", "JSON"])("reads %s entries for " + request, (source) => {
      const baseline = createAPI();
      baseline.Initialize("");
      const path = (target: string) => `adl.nav.request_valid.${request}.{target=${target}}`;
      const fallback = baseline.GetValue(path("other"));
      const api = createAPI();
      if (source === "assignment") {
        api.adl.nav.request_valid[request] = values;
      } else {
        api.loadFromJSON({ nav: { request_valid: { [request]: values } } }, "adl");
      }
      expect(api.adl.nav.request_valid[request].getStaticValue("act1")).toBe("true");
      expect(api.adl.nav.request_valid[request]._isTargetValid("act2")).toBe("false");
      expect(api.Initialize("")).toBe("true");
      for (const [target, value] of Object.entries(values)) {
        expect(api.GetValue(`adl.nav.request_valid.${request}.${target}`)).toBe(value);
      }
      expect(api.GetValue(path("other"))).toBe(fallback);
      expect(() => {
        api.adl.nav.request_valid[request] = values;
      }).toThrow(Scorm2004ValidationError);
      expect(api.SetValue(path("act1"), "false")).toBe("false");
      expect(api.GetLastError()).toBe("404");
      expect(api.GetValue(path("act1"))).toBe("true");
    });

    it("rejects invalid JSON values for " + request, () => {
      const api = createAPI();
      expect(() =>
        api.loadFromJSON(
          {
            nav: { request_valid: { [request]: { "{target=bad}": "invalid" } } },
          },
          "adl",
        ),
      ).toThrow(Scorm2004ValidationError);
      expect(api.adl.nav.request_valid[request].getStaticValue("bad")).toBeUndefined();
    });

    it("keeps bare keys invalid for " + request, () => {
      const api = createAPI();
      api.adl.nav.request_valid[request] = values;
      expect(() => {
        api.adl.nav.request_valid[request] = { act1: "false" };
      }).toThrow(Scorm2004ValidationError);
      expect(api.adl.nav.request_valid[request].getAll()).toEqual(values);
      expect(() => api.adl.nav.request_valid[request].setStaticValue("act4", "true")).toThrow();
    });

    it("uses the validator before the map for " + request, () => {
      const api = new Scorm2004API({ scoItemIdValidator: () => false, logLevel: 5 });
      api.adl.nav.request_valid[request] = values;
      api.Initialize("");
      expect(api.GetValue(`adl.nav.request_valid.${request}.{target=act1}`)).toBe("false");
    });

    it("uses SCO IDs only for missing entries for " + request, () => {
      const api = new Scorm2004API({ scoItemIds: ["act2", "other"], logLevel: 5 });
      api.adl.nav.request_valid[request] = values;
      api.Initialize("");
      expect(api.GetValue(`adl.nav.request_valid.${request}.{target=act2}`)).toBe("false");
      expect(api.GetValue(`adl.nav.request_valid.${request}.{target=act3}`)).toBe("unknown");
      expect(api.GetValue(`adl.nav.request_valid.${request}.{target=other}`)).toBe("true");
    });
  }

  it("does not store sequencing's bare-key maps during reset", () => {
    const api = new Scorm2004API({
      logLevel: 5,
      sequencing: {
        activityTree: {
          id: "root",
          sequencingControls: { flow: true, choice: true },
          children: [{ id: "act1" }, { id: "act2" }],
        },
      },
    });
    expect(api.processNavigationRequest("start")).toBe(true);
    api.reset();
    expect(api.adl.nav.request_valid.choice.getAll()).toEqual({});
    expect(api.adl.nav.request_valid.jump.getAll()).toEqual({});
  });

  it("uses live choice prediction before the map but keeps the jump map", () => {
    const api = createAPI();
    api.adl.nav.request_valid.choice = values;
    api.adl.nav.request_valid.jump = values;
    api.Initialize("");
    const predictChoiceEnabled = vi.fn().mockReturnValue(false);
    // Stub only the process consumed by GetValue, after initialization.
    Object.assign(api, { _sequencing: { overallSequencingProcess: { predictChoiceEnabled } } });
    expect(api.GetValue("adl.nav.request_valid.choice.{target=act1}")).toBe("false");
    expect(predictChoiceEnabled).toHaveBeenCalledWith("act1");
    expect(api.GetValue("adl.nav.request_valid.jump.{target=act1}")).toBe("true");
  });
});
