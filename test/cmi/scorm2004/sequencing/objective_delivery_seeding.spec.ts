import { describe, expect, it } from "vitest";
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
    expect(activity2?.primaryObjective?.progressStatus).toBe(true);
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
