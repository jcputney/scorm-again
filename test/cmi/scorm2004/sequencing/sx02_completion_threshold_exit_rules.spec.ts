import { describe, expect, it } from "vitest";
import Scorm2004API from "../../../../src/Scorm2004API";
import { LogLevelEnum } from "../../../../src/constants/enums";

const SX02_ACTIVITY_TREE = {
  id: "SX-02",
  title: "SX-02",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
    },
    {
      id: "activity_2",
      title: "Activity 2",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      sequencingRules: {
        exitConditionRules: [
          {
            action: "exit",
            conditionCombination: "any",
            conditions: [
              {
                condition: "satisfied",
              },
            ],
          },
        ],
        postConditionRules: [
          {
            action: "previous",
            conditionCombination: "any",
            conditions: [
              {
                condition: "satisfied",
              },
            ],
          },
        ],
      },
      rollupRules: {
        rules: [
          {
            action: "satisfied",
            consideration: "all",
            conditions: [
              {
                condition: "completed",
              },
            ],
          },
        ],
      },
      children: [
        {
          id: "activity_3",
          title: "Activity 3",
          completionThreshold: {
            completedByMeasure: true,
            minProgressMeasure: 0.5,
          },
        },
        {
          id: "activity_4",
          title: "Activity 4",
        },
        {
          id: "activity_5",
          title: "Activity 5",
          completionThreshold: {
            completedByMeasure: true,
            minProgressMeasure: 0.75,
          },
        },
      ],
    },
    {
      id: "activity_6",
      title: "Activity 6",
    },
  ],
};

function createApi(): Scorm2004API {
  return new Scorm2004API({
    autocommit: false,
    logLevel: LogLevelEnum.NONE,
    sequencing: {
      activityTree: SX02_ACTIVITY_TREE,
    },
  });
}

function prepareNextVisit(api: Scorm2004API): void {
  api.reset();
  expect(api.lmsInitialize("")).toBe("true");
}

function currentActivityId(api: Scorm2004API): string | null {
  return api.getSequencingState().currentActivity?.id ?? null;
}

function activityById(api: Scorm2004API, id: string): any {
  const findActivity = (activity: any): any => {
    if (!activity) return null;
    if (activity.id === id) return activity;
    for (const child of activity.children ?? []) {
      const result = findActivity(child);
      if (result) return result;
    }
    return null;
  };

  return findActivity(api.getSequencingState().rootActivity);
}

function visitAndContinue(api: Scorm2004API, cmiUpdates: Array<[string, string]>): string | null {
  expect(cmiUpdates.map(([element, value]) => api.lmsSetValue(element, value))).toEqual(
    cmiUpdates.map(() => "true"),
  );
  expect(api.lmsSetValue("adl.nav.request", "_continue")).toBe("true");
  expect(api.lmsFinish("")).toBe("true");
  return currentActivityId(api);
}

describe("ADL CTS SX-02 completion threshold and exit rules", () => {
  it("derives completedByMeasure completion and applies ancestor exit/post-condition sequencing", () => {
    const api = createApi();

    expect(api.lmsInitialize("")).toBe("true");
    expect(currentActivityId(api)).toBe("activity_1");

    expect(visitAndContinue(api, [["cmi.exit", "normal"]])).toBe("activity_3");

    prepareNextVisit(api);
    expect(currentActivityId(api)).toBe("activity_3");
    expect(
      visitAndContinue(api, [
        ["cmi.completion_status", "incomplete"],
        ["cmi.progress_measure", "0.5"],
        ["cmi.exit", "normal"],
      ]),
    ).toBe("activity_4");
    expect(activityById(api, "activity_3").completionStatus).toBe("completed");
    expect(activityById(api, "activity_3").attemptCompletionAmountStatus).toBe(true);
    expect(activityById(api, "activity_3").attemptCompletionAmount).toBe(0.5);

    prepareNextVisit(api);
    expect(currentActivityId(api)).toBe("activity_4");
    expect(
      visitAndContinue(api, [
        ["cmi.success_status", "failed"],
        ["cmi.exit", "normal"],
      ]),
    ).toBe("activity_5");

    prepareNextVisit(api);
    expect(currentActivityId(api)).toBe("activity_5");
    expect(
      visitAndContinue(api, [
        ["cmi.progress_measure", "0.9"],
        ["cmi.exit", "normal"],
      ]),
    ).toBe("activity_1");
    expect(activityById(api, "activity_2").objectiveSatisfiedStatus).toBe(true);
  });
});
