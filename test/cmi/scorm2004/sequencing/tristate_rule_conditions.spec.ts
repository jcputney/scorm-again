import { describe, expect, it } from "vitest";
import Scorm2004API from "../../../../src/Scorm2004API";
import { LogLevelEnum } from "../../../../src/constants/enums";

function createApi(activityTree: any): Scorm2004API {
  return new Scorm2004API({
    autocommit: false,
    logLevel: LogLevelEnum.NONE,
    sequencing: {
      activityTree,
    },
  });
}

function currentActivityId(api: Scorm2004API): string | null {
  return api.getSequencingState().currentActivity?.id ?? null;
}

function start(api: Scorm2004API): void {
  expect(api.lmsInitialize("")).toBe("true");
}

function continueFromCurrentActivity(
  api: Scorm2004API,
  cmiUpdates: Array<[string, string]>,
): string | null {
  expect(cmiUpdates.map(([element, value]) => api.lmsSetValue(element, value))).toEqual(
    cmiUpdates.map(() => "true"),
  );
  expect(api.lmsSetValue("adl.nav.request", "_continue")).toBe("true");
  expect(api.lmsFinish("")).toBe("true");
  return currentActivityId(api);
}

function prepareNextVisit(api: Scorm2004API): void {
  api.reset();
  start(api);
}

describe("SCORM 2004 tri-state sequencing rule conditions", () => {
  it("does not skip a fresh activity for not(completed) when completion status is unknown", () => {
    const api = createApi({
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
    });

    start(api);

    expect(currentActivityId(api)).toBe("activity_2");
  });

  it("does not skip a fresh read-mapped objective for not(satisfied) when satisfaction is unknown", () => {
    const api = createApi({
      id: "OB-03b",
      title: "OB-03b",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      children: [
        {
          id: "activity_1",
          title: "Activity 1",
          primaryObjective: {
            objectiveID: "activity_1_obj",
            mapInfo: [
              {
                targetObjectiveID: "global_obj",
              },
            ],
          },
          sequencingRules: {
            preConditionRules: [
              {
                action: "skip",
                conditionCombination: "all",
                conditions: [
                  {
                    condition: "satisfied",
                    operator: "not",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "activity_2",
          title: "Activity 2",
        },
      ],
    });

    start(api);

    expect(currentActivityId(api)).toBe("activity_1");
  });

  it("uses omitted mapInfo readSatisfiedStatus as true before evaluating satisfied preconditions", () => {
    const api = createApi({
      id: "OB-map-default",
      title: "OB map default",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      children: [
        {
          id: "writer",
          title: "Writer",
          primaryObjective: {
            objectiveID: "writer_obj",
            mapInfo: [
              {
                targetObjectiveID: "shared_global_obj",
                writeSatisfiedStatus: true,
              },
            ],
          },
        },
        {
          id: "reader",
          title: "Reader",
          primaryObjective: {
            objectiveID: "reader_obj",
            mapInfo: [
              {
                targetObjectiveID: "shared_global_obj",
              },
            ],
          },
          sequencingRules: {
            preConditionRules: [
              {
                action: "skip",
                conditionCombination: "all",
                conditions: [
                  {
                    condition: "satisfied",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "fallback",
          title: "Fallback",
        },
      ],
    });

    start(api);
    expect(currentActivityId(api)).toBe("writer");

    expect(
      continueFromCurrentActivity(api, [
        ["cmi.success_status", "passed"],
        ["cmi.exit", "normal"],
      ]),
    ).toBe("fallback");

    prepareNextVisit(api);
    expect(currentActivityId(api)).toBe("fallback");
  });

  it("does not skip when a read-mapped global has only a measure and no satisfied status", () => {
    const api = createApi({
      id: "OB-03b-measure-only-global",
      title: "OB-03b measure-only global",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      children: [
        {
          id: "measure_writer",
          title: "Measure Writer",
          primaryObjective: {
            objectiveID: "PRIMARYOBJ",
            satisfiedByMeasure: true,
            minNormalizedMeasure: 0.6,
            mapInfo: [
              {
                targetObjectiveID: "gObj-OB03-1",
                readSatisfiedStatus: false,
                writeSatisfiedStatus: false,
                writeNormalizedMeasure: true,
              },
            ],
          },
        },
        {
          id: "satisfied_reader",
          title: "Satisfied Reader",
          primaryObjective: {
            objectiveID: "PRIMARYOBJ",
            mapInfo: [
              {
                targetObjectiveID: "gObj-OB03-1",
              },
            ],
          },
          sequencingRules: {
            preConditionRules: [
              {
                action: "skip",
                conditionCombination: "all",
                conditions: [
                  {
                    condition: "satisfied",
                  },
                ],
              },
            ],
          },
        },
        {
          id: "fallback",
          title: "Fallback",
        },
      ],
    });

    start(api);
    expect(currentActivityId(api)).toBe("measure_writer");

    // Encodes ADL CTS LMSTestPackage_OB-03b mapInfo default-read shape and
    // SCORM 2004 4th Ed. SN 3.10.3 Table 3.10.3a separate satisfied vs measure maps.
    expect(
      continueFromCurrentActivity(api, [
        ["cmi.score.scaled", "1.0"],
        ["cmi.exit", "normal"],
      ]),
    ).toBe("satisfied_reader");
  });
});
