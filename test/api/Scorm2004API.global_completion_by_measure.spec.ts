import { describe, expect, it } from "vitest";
import Scorm2004API from "../../src/Scorm2004API";
import { ActivitySettings } from "../../src/types/sequencing_types";
import {
  RuleActionType,
  RuleConditionType,
} from "../../src/cmi/scorm2004/sequencing/sequencing_rules";

/** @spec ADL CTS CO-02a and CO-05b: Act1V1 -> Act3V1 -> Exit. */
describe("global completion tracking delivery", () => {
  it.each([false, true])("delivers ADL order with untracked cluster=%s", (untracked) => {
    const targetObjectiveID = untracked ? "gObj-CO05b" : "gObj-CO02a";
    const readMap = {
      targetObjectiveID,
      readSatisfiedStatus: false,
      readNormalizedMeasure: false,
      readCompletionStatus: true,
      readProgressMeasure: true,
    };
    const rules = {
      preConditionRules: [
        {
          action: RuleActionType.SKIP,
          conditions: [
            {
              condition: untracked
                ? RuleConditionType.ACTIVITY_PROGRESS_KNOWN
                : RuleConditionType.COMPLETED,
            },
          ],
        },
      ],
    };
    const reader: ActivitySettings = {
      id: "activity_2",
      title: "Activity 2",
      primaryObjective: { objectiveID: "PRIMARYOBJ", mapInfo: [readMap] },
      completionThreshold: { completedByMeasure: true, minProgressMeasure: untracked ? 0.4 : 0.5 },
      ...(untracked
        ? {
            sequencingControls: { choice: false, flow: true },
            deliveryControls: { tracked: false },
            sequencingRules: rules,
            children: [
              {
                id: "activity_3",
                title: "Activity 3",
                objectives: [{ objectiveID: "obj", mapInfo: [readMap] }],
              },
              { id: "activity_4", title: "Activity 4" },
              { id: "activity_5", title: "Activity 5" },
            ],
          }
        : { sequencingIdRef: "seqcol-CO02a-1" }),
    };
    const tree: ActivitySettings = {
      id: "course",
      title: "Course",
      sequencingControls: { choice: false, flow: true },
      children: [
        {
          id: "activity_1",
          title: "Activity 1",
          primaryObjective: {
            objectiveID: "PRIMARYOBJ",
            mapInfo: [{ ...readMap, writeCompletionStatus: true, writeProgressMeasure: true }],
          },
        },
        reader,
        { id: untracked ? "activity_6" : "activity_3", title: "Last activity" },
      ],
    };
    const delivered: string[] = [];
    const api = new Scorm2004API({
      logLevel: 5,
      sequencing: {
        activityTree: tree,
        collections: { "seqcol-CO02a-1": { sequencingRules: rules } },
        eventListeners: {
          onActivityDelivery: (activity) => {
            delivered.push(activity.id);
          },
        },
      },
    });
    const built = api.adl.sequencing.activityTree.getActivity("activity_2")!;
    expect(built.completedByMeasure).toBe(true);
    expect(built.minProgressMeasure).toBe(untracked ? 0.4 : 0.5);
    expect(built.sequencingRules.preConditionRules[0].conditions[0].condition).toBe(
      rules.preConditionRules[0].conditions[0].condition,
    );
    expect(built.primaryObjective?.mapInfo[0]).toMatchObject(readMap);
    expect(built.sequencingControls.tracked).toBe(!untracked);
    expect(api.processNavigationRequest("start")).toBe(true);
    expect(api.Initialize("")).toBe("true");
    const count = Number(api.GetValue("cmi.objectives._count"));
    const index = Array.from({ length: count }, (_, i) => i).find(
      (i) => api.GetValue(`cmi.objectives.${i}.id`) === "PRIMARYOBJ",
    );
    expect(index).toBeDefined();
    const writes = untracked
      ? [
          ["completion_status", "completed"],
          ["progress_measure", "0.50"],
        ]
      : [
          ["progress_measure", "0.8"],
          ["completion_status", "incomplete"],
        ];
    for (const [field, value] of writes) {
      expect(api.SetValue(`cmi.objectives.${index}.${field}`, value!)).toBe("true");
    }
    expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
    expect(api.SetValue("cmi.exit", "normal")).toBe("true");
    expect(api.Terminate("")).toBe("true");
    expect(delivered).toEqual(["activity_1", "activity_3"]);
    api.reset();
    expect(api.Initialize("")).toBe("true");
    expect(api.SetValue("cmi.exit", "normal")).toBe("true");
    expect(api.Terminate("")).toBe("true");
    expect(delivered).toEqual(["activity_1", "activity_3"]);
  });
});
