import { describe, expect, it } from "vitest";
import Scorm2004API from "../../../../src/Scorm2004API";
import { LogLevelEnum } from "../../../../src/constants/enums";

const SX07A_ACTIVITY_TREE = {
  id: "SX-07a",
  title: "SX-07a",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      sequencingControls: {
        choice: false,
        flow: true,
        forwardOnly: true,
      },
      children: [
        {
          id: "activity_2",
          title: "Activity 2",
          sequencingRules: {
            preConditionRules: [
              {
                action: "skip",
                conditionCombination: "all",
                conditions: [
                  {
                    condition: "completed",
                    operator: "not",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "activity_3",
          title: "Activity 3",
        },
        {
          id: "activity_4",
          title: "Activity 4",
        },
      ],
    },
    {
      id: "activity_5",
      title: "Activity 5",
    },
  ],
};

function createApi(): Scorm2004API {
  return new Scorm2004API({
    autocommit: false,
    logLevel: LogLevelEnum.NONE,
    sequencing: {
      activityTree: SX07A_ACTIVITY_TREE,
    },
  });
}

function currentActivityId(api: Scorm2004API): string | null {
  return api.getSequencingState().currentActivity?.id ?? null;
}

function prepareNextVisit(api: Scorm2004API): void {
  api.reset();
  expect(api.lmsInitialize("")).toBe("true");
}

function terminateWithNavigationRequest(
  api: Scorm2004API,
  request: "_continue" | "_previous",
  cmiUpdates: Array<[string, string]> = [],
): string | null {
  expect(cmiUpdates.map(([element, value]) => api.lmsSetValue(element, value))).toEqual(
    cmiUpdates.map(() => "true"),
  );
  expect(api.lmsSetValue("adl.nav.request", request)).toBe("true");
  expect(api.lmsFinish("")).toBe("true");
  return currentActivityId(api);
}

describe("ADL CTS SX-07a forwardOnly backward traversal", () => {
  /**
   * ADL CTS SX-07a regression: per SN book SB.2.1, backward flow onto a
   * forwardOnly cluster enters the first available child and reverses direction.
   */
  it("walks a forwardOnly cluster forward after PREVIOUS enters it from the right", () => {
    const api = createApi();

    expect(api.lmsInitialize("")).toBe("true");
    expect(currentActivityId(api)).toBe("activity_2");

    expect(
      terminateWithNavigationRequest(api, "_continue", [
        ["cmi.completion_status", "incomplete"],
      ]),
    ).toBe("activity_3");

    prepareNextVisit(api);
    expect(currentActivityId(api)).toBe("activity_3");
    expect(terminateWithNavigationRequest(api, "_continue")).toBe("activity_4");

    prepareNextVisit(api);
    expect(currentActivityId(api)).toBe("activity_4");
    expect(terminateWithNavigationRequest(api, "_continue")).toBe("activity_5");

    prepareNextVisit(api);
    expect(currentActivityId(api)).toBe("activity_5");
    const deliveredActivity = terminateWithNavigationRequest(api, "_previous");

    expect(deliveredActivity).not.toBe("activity_4");
    expect(deliveredActivity).not.toBe("activity_2");
    expect(deliveredActivity).toBe("activity_3");
  });
});
