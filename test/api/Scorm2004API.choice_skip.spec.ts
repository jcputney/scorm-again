import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { ActivitySettings } from "../../src/types/sequencing_types";

const leaf = (n: number): ActivitySettings => ({
  id: `activity_${n}`,
  title: `Activity ${n}`,
  sequencingControls: { flow: false },
});
// Transcribed from LMSTestPackage_CM-04b/c/imsmanifest.xml, including default Flow=false.
function tree(c: boolean): ActivitySettings {
  const sco = (n: number): ActivitySettings => ({
    ...leaf(n),
    ...(c ? { hideLmsUi: ["continue", "previous", "suspendAll"] } : {}),
  });
  return {
    id: c ? "CM-04c" : "CM-04b",
    title: c ? "CM-04c" : "CM-04b",
    sequencingControls: { flow: !c },
    children: [
      {
        ...leaf(1),
        id: c ? "activity" : "activity_1",
        sequencingControls: { flow: true },
        children: [sco(2), sco(3)],
      },
      { ...leaf(4), children: [sco(5), sco(6), sco(7)] },
      {
        ...leaf(8),
        children: [
          sco(9),
          {
            ...leaf(10),
            sequencingControls: { flow: true },
            children: [
              {
                ...leaf(11),
                id: c ? "Activity" : "activity_11",
                sequencingControls: { flow: true },
                sequencingRules: {
                  preConditionRules: [{ conditions: [{ condition: "attempted" }], action: "skip" }],
                },
                children: [sco(12), { ...sco(13), id: c ? "activitY" : "activity_13" }],
              },
              sco(14),
            ],
          },
        ],
      },
      sco(15),
    ],
  };
}
function session(activityTree: ActivitySettings) {
  const delivered: string[] = [];
  const api = new Scorm2004API({
    logLevel: 5,
    sequencing: {
      activityTree,
      eventListeners: { onActivityDelivery: (activity) => delivered.push(activity.id) },
    },
  });
  const initialize = () => {
    api.reset();
    expect(api.Initialize("")).toBe("true");
  };
  const terminate = (request?: string) => {
    expect(api.SetValue("cmi.exit", "normal")).toBe("true");
    if (request) expect(api.SetValue("adl.nav.request", request)).toBe("true");
    expect(api.Terminate("")).toBe("true");
  };
  const valid = (property: string, answer: boolean, request?: string, target?: string) => {
    expect(api.GetValue(`adl.nav.request_valid.${property}`), property).toBe(String(answer));
    if (request) {
      const probe = session(activityTree);
      expect(probe.api.deserializeSequencingState(api.serializeSequencingState())).toBe(true);
      expect(probe.api.processNavigationRequest(request, target), `actual ${property}`).toBe(
        answer,
      );
    }
  };
  return { api, delivered, initialize, terminate, valid };
}

describe("ADL choice and skip regressions (#1798)", () => {
  /** @spec ADL CM-04b Act12V1 CUI: choosing Activity 10 skips attempted Activity 11. */
  it("checks cluster skip rules before descending to their children", () => {
    const { api, delivered, initialize, terminate } = session(tree(false));
    expect(api.processNavigationRequest("start")).toBe(true);
    initialize();
    terminate();
    expect(api.processNavigationRequest("choice", "activity_11")).toBe(true);
    initialize();
    terminate();
    expect(api.processNavigationRequest("choice", "activity_10")).toBe(true);
    expect(delivered).toEqual(["activity_2", "activity_12", "activity_14"]);
  });

  /** @spec ADL CM-04b manifest, all deliveries, GET commands and Act2V1/Act15V1 UIQ/UIA. */
  it("flows past an attempted cluster and reports the actual Previous result", () => {
    const { api, delivered, initialize, terminate, valid } = session(tree(false));
    expect(api.processNavigationRequest("start")).toBe(true);
    const expected = [
      "activity_2",
      "activity_12",
      "activity_14",
      "activity_2",
      "activity_15",
      "activity_6",
    ];
    const targets = ["activity_11", "activity_10", "CM-04b", "activity_15", "activity_6"];
    for (let i = 0; i < expected.length; i++) {
      expect(delivered).toEqual(expected.slice(0, i + 1));
      initialize();
      if (i === 0 || i === 1 || i === 4) {
        valid("continue", true);
        valid("previous", false, "previous");
        for (const n of i === 4 ? [3] : [2, 3, 6, 9, 12, 15]) {
          valid(`choice.{target=activity_${n}}`, true, "choice", `activity_${n}`);
        }
        if (i === 0) valid("choice.{target=activity_11}", true, "choice", "activity_11");
      }
      terminate();
      expect(
        api.processNavigationRequest(i < targets.length ? "choice" : "exitAll", targets[i]),
      ).toBe(true);
    }
    expect(delivered).toEqual(expected);
  });

  /** @spec ADL CM-04c manifest and all Act12V1 through Act13V1 commands; identifiers are case-sensitive. */
  it("chooses the skipped cluster itself but skips it when descending from its parent", () => {
    const { api, delivered, initialize, terminate } = session(tree(true));
    expect(api.processNavigationRequest("choice", "activity_10")).toBe(true);
    const expected = ["activity_12", "activity_12", "activity_2", "activity_14", "activitY"];
    const targets = ["Activity", "activity", "activity_10", "activitY"];
    for (let i = 0; i < expected.length; i++) {
      expect(delivered).toEqual(expected.slice(0, i + 1));
      initialize();
      terminate(i < targets.length ? `{target=${targets[i]}}choice` : "exitAll");
    }
    expect(delivered).toEqual(expected);
  });
});
