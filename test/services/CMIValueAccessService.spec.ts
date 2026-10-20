import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";

describe("CMIValueAccessService navigation targets", () => {
  it("reads a dotted choice target after setting it", () => {
    const api = new Scorm2004API();
    const element = "adl.nav.request_valid.choice.{target=mod.1}";
    expect(api.setCMIValue(element, "true")).toBe("true");
    expect(api.getCMIValue(element)).toBe("true");
    expect(api.GetLastError()).toBe("0");
  });
});
