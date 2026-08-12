import { describe, expect, it, vi } from "vitest";
import Scorm2004API from "../../../../src/Scorm2004API";
import { LogLevelEnum } from "../../../../src/constants/enums";

const OBJECTIVE_SEEDING_TREE = {
  id: "objective-seeding",
  title: "Objective Seeding",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
      },
      objectives: [
        {
          objectiveID: "SECONDARYOBJ",
        },
      ],
    },
    {
      id: "activity_2",
      title: "Activity 2",
      primaryObjective: {
        objectiveID: "NEXTPRIMARY",
      },
      objectives: [
        {
          objectiveID: "NEXTSECONDARY",
        },
      ],
    },
  ],
};

const ANONYMOUS_PRIMARY_TREE = {
  id: "anonymous-primary",
  title: "Anonymous Primary",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      primaryObjective: {} as any,
    },
  ],
};

const MANUAL_START_LAUNCH_DATA_TREE = {
  id: "manual-start-launch-data",
  title: "Manual Start Launch Data",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      completionThreshold: {
        completedByMeasure: true,
        minProgressMeasure: 0.75,
      },
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
      },
    },
  ],
};

const TERMINATION_COMMIT_OBJECTIVE_TREE = {
  id: "termination-commit-objectives",
  title: "Termination Commit Objectives",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      objectives: [
        {
          objectiveID: "local-objective",
          mapInfo: [
            {
              targetObjectiveID: "global-objective",
              writeSatisfiedStatus: true,
            },
          ],
        },
      ],
    },
    {
      id: "activity_2",
      title: "Activity 2",
    },
  ],
};

const SX_11B_COMPLETION_CLEAR_TREE = {
  id: "sx-11b-completion-clear",
  title: "SX-11b Completion Clear",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: ["activity_1", "activity_2"].map((id) => ({
    id,
    title: id,
    primaryObjective: {},
    objectives: [
      {
        objectiveID: "obj",
        mapInfo: [
          {
            targetObjectiveID: "gObj-SX11",
            readCompletionStatus: true,
            writeCompletionStatus: true,
          },
        ],
      },
    ],
  })),
};

const RESTORED_PRECONDITION_OBJECTIVE_TREE = {
  id: "restored-precondition-objectives",
  title: "Restored Precondition Objectives",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      primaryObjective: {
        objectiveID: "local-objective",
        mapInfo: [
          {
            targetObjectiveID: "global-objective",
            readSatisfiedStatus: true,
            writeSatisfiedStatus: false,
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
                referencedObjective: "local-objective",
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
};

const OB_10A_TREE = {
  id: "OB-10a",
  title: "OB-10a",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
      },
    },
    {
      id: "activity_2",
      title: "Activity 2",
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
        mapInfo: [
          {
            targetObjectiveID: "gObj-OB10a-1",
            writeSatisfiedStatus: true,
          },
          {
            targetObjectiveID: "gObj-OB10a-2",
            writeRawScore: true,
            writeMinScore: true,
            writeMaxScore: true,
            writeCompletionStatus: true,
            writeProgressMeasure: true,
          },
        ],
      },
    },
    {
      id: "activity_3",
      title: "Activity 3",
      deliveryControls: {
        tracked: false,
      },
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
        mapInfo: [
          {
            targetObjectiveID: "gObj-OB10a-1",
          },
          {
            targetObjectiveID: "gObj-OB10a-2",
          },
        ],
      },
    },
    {
      id: "activity_4",
      title: "Activity 4",
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
      },
    },
  ],
};

function createOb10aCompletionReadTree(activity2AdlMapOverrides: Record<string, boolean>) {
  return {
    id: "OB-10a-completion",
    title: "OB-10a Completion",
    sequencingControls: {
      choice: false,
      flow: true,
    },
    children: [
      {
        id: "activity_1",
        title: "Activity 1",
        primaryObjective: {
          objectiveID: "PRIMARYOBJ",
          mapInfo: [
            {
              targetObjectiveID: "gObj-OB10a-1",
              readSatisfiedStatus: false,
              writeSatisfiedStatus: true,
            },
            {
              targetObjectiveID: "gObj-OB10a-2",
              readRawScore: false,
              readMinScore: false,
              readMaxScore: false,
              readCompletionStatus: false,
              readProgressMeasure: false,
              writeRawScore: true,
              writeMinScore: true,
              writeMaxScore: true,
              writeCompletionStatus: true,
              writeProgressMeasure: true,
            },
          ],
        },
      },
      {
        id: "activity_2",
        title: "Activity 2",
        primaryObjective: {
          objectiveID: "PRIMARYOBJ",
          mapInfo: [
            {
              targetObjectiveID: "gObj-OB10a-1",
              writeSatisfiedStatus: true,
            },
            {
              targetObjectiveID: "gObj-OB10a-2",
              writeRawScore: true,
              writeMinScore: true,
              writeMaxScore: true,
              writeCompletionStatus: true,
              writeProgressMeasure: true,
              ...activity2AdlMapOverrides,
            },
          ],
        },
      },
    ],
  };
}

function createOb10aTrackedWriteTree(activity1DeliveryControls?: { tracked?: boolean }) {
  return {
    id: "OB-10a-tracked-writes",
    title: "OB-10a Tracked Writes",
    sequencingControls: {
      choice: false,
      flow: true,
    },
    children: [
      {
        id: "activity_1",
        title: "Activity 1",
        ...(activity1DeliveryControls ? { deliveryControls: activity1DeliveryControls } : {}),
        primaryObjective: {
          objectiveID: "PRIMARYOBJ",
          mapInfo: [
            {
              targetObjectiveID: "gObj-OB10a-1",
              readSatisfiedStatus: false,
              writeSatisfiedStatus: true,
            },
            {
              targetObjectiveID: "gObj-OB10a-2",
              readRawScore: false,
              readMinScore: false,
              readMaxScore: false,
              readCompletionStatus: false,
              readProgressMeasure: false,
              writeRawScore: true,
              writeMinScore: true,
              writeMaxScore: true,
              writeCompletionStatus: true,
              writeProgressMeasure: true,
            },
          ],
        },
      },
      {
        id: "activity_2",
        title: "Activity 2",
        primaryObjective: {
          objectiveID: "PRIMARYOBJ",
          mapInfo: [
            {
              targetObjectiveID: "gObj-OB10a-1",
              writeSatisfiedStatus: true,
            },
            {
              targetObjectiveID: "gObj-OB10a-2",
              writeRawScore: true,
              writeMinScore: true,
              writeMaxScore: true,
              writeCompletionStatus: true,
              writeProgressMeasure: true,
            },
          ],
        },
      },
      {
        id: "activity_3",
        title: "Activity 3",
        deliveryControls: {
          tracked: false,
        },
        primaryObjective: {
          objectiveID: "PRIMARYOBJ",
          mapInfo: [
            {
              targetObjectiveID: "gObj-OB10a-1",
            },
            {
              targetObjectiveID: "gObj-OB10a-2",
              writeRawScore: false,
              writeMinScore: false,
              writeMaxScore: false,
              writeCompletionStatus: false,
              writeProgressMeasure: false,
            },
          ],
        },
      },
    ],
  };
}

const OB_10A_FAILED_SUCCESS_TREE = {
  id: "OB-10a-failed-success",
  title: "OB-10a Failed Success",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
      },
    },
    {
      id: "activity_2",
      title: "Activity 2",
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
        mapInfo: [
          {
            targetObjectiveID: "gObj-OB10a-1",
            writeSatisfiedStatus: true,
          },
        ],
      },
    },
    {
      id: "activity_3",
      title: "Activity 3",
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
        mapInfo: [
          {
            targetObjectiveID: "gObj-OB10a-1",
          },
        ],
      },
    },
  ],
};

const OB_10C_TRACKED_WRITE_TREE = {
  id: "OB-10c",
  title: "OB-10c",
  sequencingControls: {
    choice: false,
    flow: true,
  },
  children: [
    {
      id: "activity_1",
      title: "Activity 1",
      deliveryControls: {
        tracked: false,
      },
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
        mapInfo: [
          {
            targetObjectiveID: "gObj-OB10c",
            readSatisfiedStatus: false,
            writeSatisfiedStatus: true,
          },
        ],
      },
    },
    {
      id: "activity_2",
      title: "Activity 2",
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
        mapInfo: [
          {
            targetObjectiveID: "gObj-OB10c",
            writeSatisfiedStatus: true,
          },
        ],
      },
    },
    {
      id: "activity_3",
      title: "Activity 3",
      deliveryControls: {
        tracked: false,
      },
      primaryObjective: {
        objectiveID: "PRIMARYOBJ",
        mapInfo: [
          {
            targetObjectiveID: "gObj-OB10c",
          },
        ],
      },
    },
  ],
};

function createApi(activityTree: object): Scorm2004API {
  return new Scorm2004API({
    autocommit: false,
    logLevel: LogLevelEnum.NONE,
    sequencing: {
      activityTree: activityTree as any,
    },
  });
}

function prepareNextVisit(api: Scorm2004API): void {
  api.reset();
  expect(api.lmsInitialize("")).toBe("true");
}

function continueToNextActivity(api: Scorm2004API): void {
  expect(api.lmsSetValue("cmi.exit", "normal")).toBe("true");
  expect(api.lmsSetValue("adl.nav.request", "_continue")).toBe("true");
  expect(api.lmsFinish("")).toBe("true");
}

function returnToPreviousActivity(api: Scorm2004API): void {
  expect(api.lmsSetValue("cmi.exit", "normal")).toBe("true");
  expect(api.lmsSetValue("adl.nav.request", "_previous")).toBe("true");
  expect(api.lmsFinish("")).toBe("true");
}

function commitThenContinueToNextActivity(api: Scorm2004API): void {
  expect(api.lmsCommit("")).toBe("true");
  expect(api.lmsSetValue("adl.nav.request", "_continue")).toBe("true");
  expect(api.lmsCommit("")).toBe("true");
  expect(api.lmsSetValue("cmi.exit", "normal")).toBe("true");
  expect(api.lmsFinish("")).toBe("true");
}

function terminateVisitThenContinue(api: Scorm2004API): void {
  expect(api.lmsFinish("")).toBe("true");
  expect(api.processNavigationRequest("continue")).toBe(true);
}

function findObjectiveIndex(api: Scorm2004API, objectiveId: string): number {
  const count = Number(api.lmsGetValue("cmi.objectives._count"));
  for (let index = 0; index < count; index++) {
    if (api.lmsGetValue(`cmi.objectives.${index}.id`) === objectiveId) {
      return index;
    }
  }

  return -1;
}

function childActivity(api: Scorm2004API, activityId: string) {
  return api
    .getSequencingState()
    .rootActivity?.children.find((activity) => activity.id === activityId);
}

function globalObjective(api: Scorm2004API, objectiveId: string): any {
  return api
    .getSequencingService()
    ?.getOverallSequencingProcess()
    ?.getGlobalObjectiveMap()
    .get(objectiveId);
}

describe("SCORM 2004 sequencing objective delivery seeding", () => {
  it("seeds primary and secondary objective ids for the delivered activity", () => {
    const api = createApi(OBJECTIVE_SEEDING_TREE);

    expect(api.lmsInitialize("")).toBe("true");

    expect(api.lmsGetValue("cmi.objectives._count")).toBe("2");
    expect(api.lmsGetValue("cmi.objectives.0.id")).toBe("PRIMARYOBJ");
    expect(api.lmsGetValue("cmi.objectives.1.id")).toBe("SECONDARYOBJ");
    expect(api.lmsGetValue("cmi.objectives.0.success_status")).toBe("unknown");
  });

  it("does not seed an anonymous primary objective", () => {
    const api = createApi(ANONYMOUS_PRIMARY_TREE);

    expect(api.lmsInitialize("")).toBe("true");

    expect(api.lmsGetValue("cmi.objectives._count")).toBe("0");
  });

  it("seeds the next delivered activity's objective ids on a fresh CMI", () => {
    const api = createApi(OBJECTIVE_SEEDING_TREE);

    expect(api.lmsInitialize("")).toBe("true");
    continueToNextActivity(api);
    prepareNextVisit(api);

    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    expect(api.lmsGetValue("cmi.objectives._count")).toBe("2");
    expect(api.lmsGetValue("cmi.objectives.0.id")).toBe("NEXTPRIMARY");
    expect(api.lmsGetValue("cmi.objectives.1.id")).toBe("NEXTSECONDARY");
    expect(api.lmsGetValue("cmi.objectives.0.success_status")).toBe("unknown");
  });

  it("seeds a read map before the delivered objective becomes the next writer", () => {
    const api = createApi({
      id: "read-write-objective-map",
      title: "Read/write objective map",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      children: [
        {
          id: "activity_1",
          title: "Activity 1",
          objectives: [
            {
              objectiveID: "writer",
              mapInfo: [
                {
                  targetObjectiveID: "global-objective",
                  readSatisfiedStatus: true,
                  readNormalizedMeasure: true,
                  writeSatisfiedStatus: true,
                  writeNormalizedMeasure: true,
                },
              ],
            },
          ],
        },
        {
          id: "activity_2",
          title: "Activity 2",
          objectives: [
            {
              objectiveID: "reader-writer",
              mapInfo: [
                {
                  targetObjectiveID: "global-objective",
                  readSatisfiedStatus: true,
                  readNormalizedMeasure: true,
                  writeSatisfiedStatus: true,
                  writeNormalizedMeasure: true,
                },
              ],
            },
          ],
        },
      ],
    });

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.lmsSetValue("cmi.objectives.0.success_status", "passed")).toBe("true");
    expect(api.lmsSetValue("cmi.objectives.0.score.scaled", "0.5")).toBe("true");
    continueToNextActivity(api);
    prepareNextVisit(api);

    const objectiveIndex = findObjectiveIndex(api, "reader-writer");
    expect(objectiveIndex).not.toBe(-1);
    // @spec SCORM 2004 4th Ed. SN 3.10.3: read and write mapInfo flags are independent;
    // delivery reads the prior global value before local writes can update it.
    expect(api.lmsGetValue(`cmi.objectives.${objectiveIndex}.success_status`)).toBe("passed");
    expect(api.lmsGetValue(`cmi.objectives.${objectiveIndex}.score.scaled`)).toBe("0.5");
  });

  it("writes an explicitly unknown objective satisfaction status to the global map", () => {
    const api = createApi({
      id: "explicit-unknown-objective-status",
      title: "Explicit unknown objective status",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      children: [
        {
          id: "activity_1",
          title: "Activity 1",
          objectives: [
            {
              objectiveID: "writer",
              mapInfo: [
                {
                  targetObjectiveID: "global-objective",
                  writeSatisfiedStatus: true,
                  writeNormalizedMeasure: true,
                },
              ],
            },
          ],
        },
        {
          id: "activity_2",
          title: "Activity 2",
          objectives: [
            {
              objectiveID: "reader-writer",
              mapInfo: [
                {
                  targetObjectiveID: "global-objective",
                  readSatisfiedStatus: true,
                  readNormalizedMeasure: true,
                  writeSatisfiedStatus: true,
                  writeNormalizedMeasure: true,
                },
              ],
            },
          ],
        },
        {
          id: "activity_3",
          title: "Activity 3",
          objectives: [
            {
              objectiveID: "reader",
              mapInfo: [
                {
                  targetObjectiveID: "global-objective",
                  readSatisfiedStatus: true,
                  readNormalizedMeasure: true,
                },
              ],
            },
          ],
        },
      ],
    });

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.lmsSetValue("cmi.objectives.0.success_status", "passed")).toBe("true");
    expect(api.lmsSetValue("cmi.objectives.0.score.scaled", "0.5")).toBe("true");
    continueToNextActivity(api);
    prepareNextVisit(api);

    expect(api.lmsGetValue("cmi.objectives.0.success_status")).toBe("passed");
    expect(api.lmsSetValue("cmi.objectives.0.success_status", "unknown")).toBe("true");
    expect(api.lmsSetValue("cmi.objectives.0.score.scaled", "0.8")).toBe("true");
    continueToNextActivity(api);
    expect(globalObjective(api, "global-objective")).toMatchObject({
      satisfiedStatusKnown: false,
      normalizedMeasure: 0.8,
      normalizedMeasureKnown: true,
    });

    prepareNextVisit(api);
    // @spec SCORM 2004 4th Ed. RTE 4.2.17 / SN 3.10.3: an explicit unknown
    // status clears satisfaction knowledge without clearing the objective measure.
    expect(api.lmsGetValue("cmi.objectives.0.success_status")).toBe("unknown");
    expect(api.lmsGetValue("cmi.objectives.0.score.scaled")).toBe("0.8");
  });

  it("clears an SX-11b mapped completion status when content writes unknown", () => {
    const api = createApi(SX_11B_COMPLETION_CLEAR_TREE);

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");
    let objectiveIndex = findObjectiveIndex(api, "obj");
    expect(objectiveIndex).not.toBe(-1);
    expect(api.lmsGetValue(`cmi.objectives.${objectiveIndex}.completion_status`)).toBe("unknown");
    expect(api.lmsSetValue(`cmi.objectives.${objectiveIndex}.completion_status`, "completed")).toBe(
      "true",
    );

    continueToNextActivity(api);
    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    objectiveIndex = findObjectiveIndex(api, "obj");
    expect(api.lmsGetValue(`cmi.objectives.${objectiveIndex}.completion_status`)).toBe("completed");
    expect(
      api.lmsSetValue(`cmi.objectives.${objectiveIndex}.completion_status`, "incomplete"),
    ).toBe("true");

    returnToPreviousActivity(api);
    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");
    objectiveIndex = findObjectiveIndex(api, "obj");
    expect(api.lmsGetValue(`cmi.objectives.${objectiveIndex}.completion_status`)).toBe(
      "incomplete",
    );
    expect(api.lmsSetValue(`cmi.objectives.${objectiveIndex}.completion_status`, "unknown")).toBe(
      "true",
    );

    continueToNextActivity(api);
    expect(globalObjective(api, "gObj-SX11")).toMatchObject({
      completionStatus: "unknown",
      completionStatusKnown: false,
    });
    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    objectiveIndex = findObjectiveIndex(api, "obj");
    // @spec SCORM 2004 4th Ed. RTE 4.2.17 / SN 3.10.3: an explicit
    // objective completion status of unknown clears the mapped global status.
    expect(api.lmsGetValue(`cmi.objectives.${objectiveIndex}.completion_status`)).toBe("unknown");
  });

  it("carries content-reported session time across sequenced SCO visits", () => {
    const api = createApi({
      id: "ob-14a-total-time",
      title: "OB-14a Total Time",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      children: [
        { id: "activity_1", title: "Activity 1" },
        { id: "activity_2", title: "Activity 2" },
      ],
    });

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");
    expect(api.lmsSetValue("cmi.session_time", "PT1H0.15S")).toBe("true");

    continueToNextActivity(api);
    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    expect(api.lmsGetValue("cmi.total_time")).toBe("PT1H0.15S");

    returnToPreviousActivity(api);
    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");
    expect(api.lmsSetValue("cmi.session_time", "PT23H0.4S")).toBe("true");

    continueToNextActivity(api);
    prepareNextVisit(api);
    // @spec SCORM 2004 4th Ed. RTE 4.2.24 / 4.2.28: the LMS adds each
    // completed learner session to the cumulative total exposed to later SCOs.
    expect(api.lmsGetValue("cmi.total_time")).toBe("P1DT0.55S");
  });

  it("keeps satisfaction unknown when a primary objective writes only a scaled measure", () => {
    const api = createApi({
      id: "measure-only-primary-objective",
      title: "Measure-only primary objective",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      children: [
        {
          id: "activity_1",
          title: "Activity 1",
          sequencingControls: {
            objectiveSetByContent: true,
          },
          primaryObjective: {
            objectiveID: "writer",
            mapInfo: [
              {
                targetObjectiveID: "global-objective",
                writeSatisfiedStatus: true,
                writeNormalizedMeasure: true,
              },
            ],
          },
        },
        {
          id: "activity_2",
          title: "Activity 2",
          primaryObjective: {
            objectiveID: "reader",
            mapInfo: [
              {
                targetObjectiveID: "global-objective",
                readSatisfiedStatus: true,
                readNormalizedMeasure: true,
              },
            ],
          },
        },
      ],
    });

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.lmsSetValue("cmi.score.scaled", "0.7")).toBe("true");

    const activity1 = childActivity(api, "activity_1");
    // @spec SCORM 2004 4th Ed. SN TB.2.3 / UP.4 - RTE values transfer
    // to sequencing at End Attempt, not immediately on SetValue.
    expect(activity1?.primaryObjective?.measureStatus).toBe(false);
    expect(activity1?.primaryObjective?.progressStatus).toBe(false);
    expect(activity1?.objectiveSatisfiedStatusKnown).toBe(false);

    continueToNextActivity(api);
    expect(globalObjective(api, "global-objective")).toMatchObject({
      normalizedMeasure: 0.7,
      normalizedMeasureKnown: true,
      satisfiedStatusKnown: false,
    });

    prepareNextVisit(api);
    const objectiveIndex = findObjectiveIndex(api, "reader");
    expect(objectiveIndex).not.toBe(-1);
    expect(api.lmsGetValue(`cmi.objectives.${objectiveIndex}.score.scaled`)).toBe("0.7");
    expect(api.lmsGetValue(`cmi.objectives.${objectiveIndex}.success_status`)).toBe("unknown");
  });

  it("does not publish a local objective directly to a same-named global map target", () => {
    const api = createApi({
      id: "local-global-id-collision",
      title: "Local/global objective ID collision",
      sequencingControls: {
        choice: false,
        flow: true,
      },
      children: [
        {
          id: "activity_1",
          title: "Activity 1",
          objectives: [
            {
              objectiveID: "source",
              mapInfo: [
                {
                  targetObjectiveID: "colliding-id",
                  writeSatisfiedStatus: true,
                },
              ],
            },
          ],
        },
        {
          id: "activity_2",
          title: "Activity 2",
          objectives: [
            {
              objectiveID: "colliding-id",
              mapInfo: [
                {
                  targetObjectiveID: "different-global",
                  writeSatisfiedStatus: true,
                },
              ],
            },
          ],
        },
        {
          id: "activity_3",
          title: "Activity 3",
        },
      ],
    });

    expect(api.lmsInitialize("")).toBe("true");
    continueToNextActivity(api);
    prepareNextVisit(api);

    const objectiveIndex = findObjectiveIndex(api, "colliding-id");
    expect(objectiveIndex).not.toBe(-1);
    expect(api.lmsSetValue(`cmi.objectives.${objectiveIndex}.success_status`, "passed")).toBe(
      "true",
    );

    // @spec SCORM 2004 4th Ed. SN 3.10.3: a local objective writes only through
    // its own mapInfo, even when its ID matches some other global map target.
    expect(globalObjective(api, "colliding-id")).toMatchObject({
      satisfiedStatusKnown: false,
    });

    continueToNextActivity(api);
    expect(globalObjective(api, "different-global")).toMatchObject({
      satisfiedStatus: true,
      satisfiedStatusKnown: true,
    });
    expect(globalObjective(api, "colliding-id")).toMatchObject({
      satisfiedStatusKnown: false,
    });
  });

  it("includes termination objective-map writes in the content-driven Terminate commit", () => {
    const api = new Scorm2004API({
      autocommit: false,
      dataCommitFormat: "json",
      lmsCommitUrl: "https://lms.example.test/commit",
      logLevel: LogLevelEnum.NONE,
      renderCommonCommitFields: true,
      sequencing: {
        activityTree: TERMINATION_COMMIT_OBJECTIVE_TREE as any,
      },
    });
    const requestSpy = vi
      .spyOn(api, "processHttpRequest")
      .mockReturnValue({ result: "true", errorCode: 0 });

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.lmsSetValue("cmi.objectives.0.success_status", "passed")).toBe("true");
    expect(api.lmsSetValue("cmi.exit", "normal")).toBe("true");
    expect(api.lmsSetValue("adl.nav.request", "_continue")).toBe("true");
    expect(api.lmsFinish("")).toBe("true");

    const commit = requestSpy.mock.calls[0]?.[1] as any;
    expect(commit.globalObjectives["global-objective"]).toMatchObject({
      satisfiedStatus: true,
      satisfiedStatusKnown: true,
    });
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
  });

  it("applies restored global objectives before initial precondition evaluation", () => {
    const api = createApi(RESTORED_PRECONDITION_OBJECTIVE_TREE);

    api.restoreGlobalObjectiveSnapshot({
      "global-objective": {
        id: "global-objective",
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        normalizedMeasureKnown: false,
      },
    });

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
  });

  it("seeds launch-static CMI data when an LMS manually starts sequencing before Initialize", () => {
    const api = createApi(MANUAL_START_LAUNCH_DATA_TREE);
    const sequencingService = api.getSequencingService();

    // Encodes ADL CTS LMSTestPackage_OB-10a launch expectation and SCORM 2004
    // 4th Ed. RTE 4.2.5 / 4.2.17 launch-time initialization requirements.
    expect(sequencingService?.processNavigationRequest("start")).toBe(true);

    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");
    expect(api.cmi.completion_threshold).toBe("0.75");
    expect(api.cmi.objectives.childArray).toHaveLength(1);
    expect(api.cmi.objectives.childArray[0]).toMatchObject({ id: "PRIMARYOBJ" });
  });

  it("seeds OB-10a read-mapped satisfied status and raw score for the delivered activity", () => {
    const api = createApi(OB_10A_TREE);

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");
    continueToNextActivity(api);

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    expect(api.lmsSetValue("cmi.success_status", "failed")).toBe("true");
    expect(api.lmsSetValue("cmi.score.raw", "256.78")).toBe("true");
    expect(api.lmsSetValue("cmi.score.min", "0")).toBe("true");
    expect(api.lmsSetValue("cmi.score.max", "500")).toBe("true");
    expect(api.lmsSetValue("cmi.completion_status", "incomplete")).toBe("true");
    expect(api.lmsSetValue("cmi.progress_measure", "0.25")).toBe("true");
    continueToNextActivity(api);

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_3");

    // Encodes ADL CTS LMSTestPackage_OB-10a plus SCORM 2004 4th Ed. RTE
    // 4.2.17 and SN 3.10.3 / ADLSEQ objective read maps: mapped global
    // objective state seeds the delivered SCO's CMI objective view at launch.
    const primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.success_status`)).toBe(
      "failed",
    );
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.score.raw`)).toBe("256.78");
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.score.min`)).toBe("0");
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.score.max`)).toBe("500");
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.completion_status`)).toBe(
      "incomplete",
    );
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.progress_measure`)).toBe(
      "0.25",
    );
  });

  it("keeps OB-10a completion unknown when activity_2 explicitly disables the completion read map", () => {
    const api = createApi(
      createOb10aCompletionReadTree({
        readCompletionStatus: false,
      }),
    );

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");

    continueToNextActivity(api);
    prepareNextVisit(api);

    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    const primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);

    // Encodes SCORM 2004 4th Ed. SN 3.10.3 Table 3.10.3a and the ADLSEQ
    // readCompletionStatus extension: an explicit false read map suppresses
    // the mapped global completion value even though activity_1 wrote it.
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.completion_status`)).toBe(
      "unknown",
    );
  });

  it("uses the OB-10a omitted readCompletionStatus default to seed completed from the global objective", () => {
    const api = createApi(createOb10aCompletionReadTree({}));

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");

    continueToNextActivity(api);
    prepareNextVisit(api);

    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    const primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);

    // Encodes the same ADLSEQ mapInfo default table: omitted readCompletionStatus
    // defaults to true and therefore reads the completed global value.
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.completion_status`)).toBe(
      "completed",
    );
  });

  it("seeds OB-10a activity_3 success as failed after activity_2 writes a known false satisfied status", () => {
    const api = createApi(OB_10A_FAILED_SUCCESS_TREE);

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");
    continueToNextActivity(api);

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    expect(api.lmsSetValue("cmi.success_status", "failed")).toBe("true");

    const activity2 = childActivity(api, "activity_2");
    // The explicit failure remains in CMI until End Attempt transfers it.
    // @spec SCORM 2004 4th Ed. SN TB.2.3 / UP.4
    expect(activity2?.primaryObjective?.progressStatus).toBe(false);
    expect(activity2?.primaryObjective?.satisfiedStatus).toBe(false);
    expect(activity2?.primaryObjective?.measureStatus).toBe(false);

    continueToNextActivity(api);

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_3");
    const primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);

    // Encodes SCORM 2004 4th Ed. SN objective tracking semantics: Objective
    // Progress Status known with Objective Satisfied Status false maps to
    // cmi.objectives.n.success_status = failed, not unknown.
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.success_status`)).toBe(
      "failed",
    );
  });

  it("keeps the tracked OB-10c writer authoritative for an untracked reader", () => {
    const api = createApi(OB_10C_TRACKED_WRITE_TREE);

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");
    expect(api.lmsSetValue("cmi.success_status", "passed")).toBe("true");
    continueToNextActivity(api);
    expect(globalObjective(api, "gObj-OB10c")).toMatchObject({
      satisfiedStatusKnown: false,
    });

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    expect(api.lmsSetValue("cmi.success_status", "failed")).toBe("true");
    continueToNextActivity(api);

    // @spec SCORM 2004 4th Ed. SN 3.13.1 / 3.10.3: an untracked activity
    // cannot write tracking data, while a tracked activity's failed status is
    // available through a read map even when the receiving activity is untracked.
    expect(globalObjective(api, "gObj-OB10c")).toMatchObject({
      satisfiedStatus: false,
      satisfiedStatusKnown: true,
    });

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_3");
    const primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.success_status`)).toBe(
      "failed",
    );
  });

  it("keeps the tracked OB-10c writer authoritative across sequencing-state restores", async () => {
    const savedState: { value: string | null } = { value: null };
    const persistence = {
      saveState: async (stateData: string) => {
        savedState.value = stateData;
        return true;
      },
      loadState: async () => savedState.value,
      clearState: async () => {
        savedState.value = null;
        return true;
      },
    };
    const createPersistedApi = () =>
      new Scorm2004API({
        autocommit: false,
        logLevel: LogLevelEnum.NONE,
        sequencing: {
          activityTree: OB_10C_TRACKED_WRITE_TREE as any,
        },
        sequencingStatePersistence: {
          persistence,
          autoSaveOn: "never",
          compress: false,
        },
      });
    const metadata = {
      learnerId: "ob10c-learner",
      courseId: "ob10c-course",
    };

    const activity1Api = createPersistedApi();
    expect(activity1Api.lmsInitialize("")).toBe("true");
    expect(activity1Api.lmsSetValue("cmi.success_status", "passed")).toBe("true");
    commitThenContinueToNextActivity(activity1Api);
    expect(await activity1Api.saveSequencingState(metadata)).toBe(true);

    const activity2Api = createPersistedApi();
    expect(await activity2Api.loadSequencingState(metadata)).toBe(true);
    expect(activity2Api.lmsInitialize("")).toBe("true");
    expect(activity2Api.getSequencingState().currentActivity?.id).toBe("activity_2");
    expect(activity2Api.lmsSetValue("cmi.success_status", "failed")).toBe("true");
    commitThenContinueToNextActivity(activity2Api);

    // @spec SCORM 2004 4th Ed. SN 3.13.1 / 4.2 - restoring prior activity
    // state must not let an untracked writer replace the current tracked write.
    expect(globalObjective(activity2Api, "gObj-OB10c")).toMatchObject({
      satisfiedStatus: false,
      satisfiedStatusKnown: true,
    });
    expect(await activity2Api.saveSequencingState(metadata)).toBe(true);

    const activity3Api = createPersistedApi();
    expect(await activity3Api.loadSequencingState(metadata)).toBe(true);
    expect(activity3Api.lmsInitialize("")).toBe("true");
    expect(activity3Api.getSequencingState().currentActivity?.id).toBe("activity_3");
    const primaryObjectiveIndex = findObjectiveIndex(activity3Api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);
    expect(activity3Api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.success_status`)).toBe(
      "failed",
    );
  });

  it("does not write global objectives from untracked OB-10a activity_1", () => {
    const api = createApi(createOb10aTrackedWriteTree({ tracked: false }));

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");

    continueToNextActivity(api);

    expect(globalObjective(api, "gObj-OB10a-2")).toMatchObject({
      rawScoreKnown: false,
      minScoreKnown: false,
      maxScoreKnown: false,
      progressMeasureKnown: false,
      completionStatusKnown: false,
    });
    expect(globalObjective(api, "gObj-OB10a-1")).toMatchObject({
      satisfiedStatusKnown: false,
    });

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    const primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);

    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.success_status`)).toBe(
      "unknown",
    );
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.completion_status`)).toBe(
      "unknown",
    );
  });

  it("still lets tracked activity_2 write status and raw score for untracked activity_3 reads", () => {
    const api = createApi(createOb10aTrackedWriteTree({ tracked: false }));

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");
    continueToNextActivity(api);

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    expect(api.lmsSetValue("cmi.success_status", "failed")).toBe("true");
    expect(api.lmsSetValue("cmi.score.raw", "256.78")).toBe("true");
    continueToNextActivity(api);

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_3");
    const primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);

    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.success_status`)).toBe(
      "failed",
    );
    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.score.raw`)).toBe("256.78");
  });

  it("seeds OB-10a activity_3 from the real Act2V1 per-objective primary objective writes", () => {
    const api = createApi(createOb10aTrackedWriteTree({ tracked: false }));

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");

    let primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);

    // ADL CTS LMSTestPackage_OB-10a Act1V1 doSetValue commands, copied
    // verbatim from scorm-cts/dist/scripts/OB-10a.json.
    expect(
      api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.success_status`, "passed"),
    ).toBe("true");
    expect(api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.score.raw`, "0.8")).toBe(
      "true",
    );
    expect(api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.score.min`, "-100.3")).toBe(
      "true",
    );
    expect(api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.score.max`, "1984")).toBe(
      "true",
    );
    expect(
      api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.completion_status`, "not attempted"),
    ).toBe("true");
    expect(api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.progress_measure`, "1.0")).toBe(
      "true",
    );
    expect(api.lmsSetValue("cmi.exit", "normal")).toBe("true");
    terminateVisitThenContinue(api);

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);

    // ADL CTS LMSTestPackage_OB-10a Act2V1 doSetValue commands. The CTS
    // writes the primary objective through cmi.objectives.&PRIMARYOBJ&, not
    // top-level cmi.success_status or cmi.score.
    expect(
      api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.success_status`, "failed"),
    ).toBe("true");
    expect(api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.score.raw`, "256.78")).toBe(
      "true",
    );
    expect(api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.score.min`, "254")).toBe(
      "true",
    );
    expect(api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.score.max`, "0.8")).toBe(
      "true",
    );
    expect(
      api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.completion_status`, "completed"),
    ).toBe("true");
    expect(api.lmsSetValue(`cmi.objectives.${primaryObjectiveIndex}.progress_measure`, "0.5")).toBe(
      "true",
    );
    expect(api.lmsSetValue("cmi.exit", "normal")).toBe("true");
    terminateVisitThenContinue(api);

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_3");
    primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);

    // @spec SCORM 2004 4th Ed. RTE 4.2.17 - cmi.objectives.n is initialized
    // from sequencing objective data for the delivered SCO.
    // @spec SCORM 2004 4th Ed. SN 3.10.3 and ADLSEQ objectives extension -
    // mapped satisfied/score/completion/progress writes transfer through the
    // local objective map to the mapped global objective, then seed read maps.
    expect
      .soft(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.success_status`))
      .toBe("failed");
    expect
      .soft(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.score.raw`))
      .toBe("256.78");
    expect.soft(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.score.min`)).toBe("254");
    expect.soft(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.score.max`)).toBe("0.8");
    expect
      .soft(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.completion_status`))
      .toBe("completed");
    expect
      .soft(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.progress_measure`))
      .toBe("0.5");
  });

  it("writes OB-10a globals when activity_1 uses the default tracked delivery control", () => {
    const api = createApi(createOb10aTrackedWriteTree());

    expect(api.lmsInitialize("")).toBe("true");
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_1");

    continueToNextActivity(api);
    expect(globalObjective(api, "gObj-OB10a-2")).toMatchObject({
      completionStatus: "completed",
      completionStatusKnown: true,
    });

    prepareNextVisit(api);
    expect(api.getSequencingState().currentActivity?.id).toBe("activity_2");
    const primaryObjectiveIndex = findObjectiveIndex(api, "PRIMARYOBJ");
    expect(primaryObjectiveIndex).not.toBe(-1);

    expect(api.lmsGetValue(`cmi.objectives.${primaryObjectiveIndex}.completion_status`)).toBe(
      "completed",
    );
  });
});
