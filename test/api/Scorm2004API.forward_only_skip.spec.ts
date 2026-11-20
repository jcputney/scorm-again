import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { ActivitySettings, SequencingRulesSettings } from "../../src/types/sequencing_types";

const leaf = (n: number) => ({ id: `activity_${n}`, title: `Activity ${n}` });
const skipIfAttemptedIncomplete: SequencingRulesSettings = {
  preConditionRules: [
    {
      action: "skip",
      conditionCombination: "all",
      conditions: [{ condition: "attempted" }, { condition: "completed", operator: "not" }],
    },
  ],
};
const skippable = (n: number) => ({ ...leaf(n), sequencingRules: skipIfAttemptedIncomplete });

// CM-03b: the organization's own controlMode replaces the forwardOnly control
// from its IDRef collection, so only Activity 4 is forwardOnly.
const cm03b: ActivitySettings = {
  id: "CM-03b",
  title: "CM-03b",
  sequencingControls: { choice: false, flow: true },
  children: [
    {
      ...leaf(1),
      sequencingControls: { choice: false, flow: true },
      children: [leaf(2), leaf(3)],
    },
    {
      ...leaf(4),
      sequencingControls: { choice: false, flow: true, forwardOnly: true },
      children: [skippable(5), skippable(6), skippable(7)],
    },
    leaf(8),
  ],
};

describe("ADL CM-03b forwardOnly cluster with skip rules (#1797)", () => {
  /** @spec ADL CM-03b manifest and Act2V1 through Act2V2 commands. */
  it("leaves a forwardOnly cluster backwards when previous skips all its children", () => {
    const delivered: string[] = [];
    const api = new Scorm2004API({
      logLevel: 5,
      sequencing: {
        activityTree: cm03b,
        eventListeners: { onActivityDelivery: (activity) => delivered.push(activity.id) },
      },
    });
    const visit = (request: string | null, completion?: string) => {
      expect(api.Initialize("")).toBe("true");
      if (completion) expect(api.SetValue("cmi.completion_status", completion)).toBe("true");
      if (request === "previous" && delivered.at(-1) === "activity_8") {
        expect(api.GetValue("adl.nav.request_valid.previous")).toBe("true");
      }
      if (request) expect(api.SetValue("adl.nav.request", request)).toBe("true");
      expect(api.SetValue("cmi.exit", "normal")).toBe("true");
      expect(api.Terminate("")).toBe("true");
      api.reset();
    };

    api.processNavigationRequest("start");
    visit("continue"); // Act2V1
    visit("continue"); // Act3V1
    visit("continue", "incomplete"); // Act5V1
    visit("continue", "incomplete"); // Act6V1
    visit("continue", "incomplete"); // Act7V1
    expect(delivered).toEqual([
      "activity_2",
      "activity_3",
      "activity_5",
      "activity_6",
      "activity_7",
      "activity_8",
    ]);
    visit("previous"); // Act8V1: 7, 6 and 5 are skipped, so flow leaves Activity 4 backwards
    expect(delivered.at(-1)).toBe("activity_3");
    visit("previous"); // Act3V2
    expect(delivered.at(-1)).toBe("activity_2");
  });
});
