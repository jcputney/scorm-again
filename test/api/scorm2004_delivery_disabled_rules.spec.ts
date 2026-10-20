import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { NavigationRequestType } from "../../src/cmi/scorm2004/sequencing/overall_sequencing_process";

const rule = (action = "disabled", condition = "always") => ({
  action,
  conditions: [{ condition }],
});

function fixture(rules = [rule()], clusterRules = [rule()]) {
  const api = new Scorm2004API({
    logLevel: 5,
    selfReportSessionTime: false,
    sequencing: {
      activityTree: {
        id: "course",
        sequencingControls: { flow: true, choice: true },
        children: [
          { id: "lesson" },
          { id: "locked", sequencingRules: { preConditionRules: rules } },
          {
            id: "cluster",
            sequencingControls: { flow: true, choice: true },
            sequencingRules: { preConditionRules: clusterRules },
            children: [{ id: "nested" }],
          },
          { id: "normal" },
        ],
      },
    },
  });
  expect(api.Initialize("")).toBe("true");
  const process = api.getSequencingService()!.getOverallSequencingProcess()!;
  return { api, process };
}

describe("SCORM 2004 delivery Disabled rules (UP.5)", () => {
  it.each([
    [NavigationRequestType.JUMP, "locked", "DB.1.1-3"],
    [NavigationRequestType.JUMP, "nested", "DB.1.1-3"],
    [NavigationRequestType.CHOICE, "nested", "NB.2.1-11"],
  ])("rejects %s to %s without changing the current activity", (request, target, exception) => {
    const { api, process } = fixture();
    const before = api.getSequencingState().currentActivity;
    expect(
      process.processNavigationRequest(request as NavigationRequestType, target),
    ).toMatchObject({
      valid: false,
      exception,
    });
    expect(api.getSequencingState().currentActivity).toBe(before);
  });

  it("evaluates conditional Disabled rules against the target's attempt state", () => {
    const { api, process } = fixture([rule("disabled", "attempted")]);
    expect(process.processNavigationRequest(NavigationRequestType.JUMP, "locked").valid).toBe(true);
    expect(api.getSequencingState().currentActivity.id).toBe("locked");
    expect(process.processNavigationRequest(NavigationRequestType.JUMP, "normal").valid).toBe(true);
    expect(process.processNavigationRequest(NavigationRequestType.JUMP, "locked")).toMatchObject({
      valid: false,
      exception: "DB.1.1-3",
    });
    expect(api.getSequencingState().currentActivity.id).toBe("normal");
  });

  it("does not let a preceding Skip rule hide a matching Disabled rule", () => {
    const { process } = fixture([rule("skip"), rule()]);
    expect(process.processNavigationRequest(NavigationRequestType.JUMP, "locked")).toMatchObject({
      valid: false,
      exception: "DB.1.1-3",
    });
  });

  it("delivers a normal leaf", () => {
    const { api, process } = fixture();
    expect(process.processNavigationRequest(NavigationRequestType.JUMP, "normal").valid).toBe(true);
    expect(api.getSequencingState().currentActivity.id).toBe("normal");
  });

  it("continues past a skipped leaf", () => {
    const { api, process } = fixture([rule("skip")], [rule("skip")]);
    expect(process.processNavigationRequest(NavigationRequestType.CONTINUE).valid).toBe(true);
    expect(api.getSequencingState().currentActivity.id).toBe("normal");
  });
});
