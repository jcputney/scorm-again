import { describe, expect, it, vi } from "vitest";

import Scorm2004API from "../../src/Scorm2004API";
import { SequencingStateMetadata, Settings } from "../../src/types/api_types";
import { SelectionRandomization } from "../../src/cmi/scorm2004/sequencing/selection_randomization";
import {
  RandomizationTiming,
  SelectionTiming,
} from "../../src/cmi/scorm2004/sequencing/sequencing_controls";

const metadata: SequencingStateMetadata = {
  learnerId: "learner-1",
  courseId: "course-1",
};

describe("SCORM 2004 sequencing persistence", () => {
  it("defaults to auto-saving sequencing state on Commit", async () => {
    const saveState = vi.fn().mockResolvedValue(true);
    const api = new Scorm2004API({
      sequencing: {
        activityTree: {
          id: "root",
          children: [{ id: "sco1" }],
        },
      },
      sequencingStatePersistence: {
        persistence: {
          saveState,
          loadState: vi.fn().mockResolvedValue(null),
        },
        autoLoadOnInitialize: false,
        compress: false,
      },
    });

    expect(api.Initialize("")).toBe("true");
    expect(api.Commit("")).toBe("true");
    await vi.waitFor(() => expect(saveState).toHaveBeenCalledOnce());
  });

  it("auto-saves the post-navigation state when content terminates", async () => {
    const saveState = vi.fn().mockResolvedValue(true);
    const delivered: string[] = [];
    const api = new Scorm2004API({
      sequencing: {
        activityTree: {
          id: "root",
          sequencingControls: { flow: true },
          children: [{ id: "sco1" }, { id: "sco2" }],
        },
        eventListeners: {
          onActivityDelivery: (activity) => delivered.push(activity.id),
        },
      },
      sequencingStatePersistence: {
        persistence: {
          saveState,
          loadState: vi.fn().mockResolvedValue(null),
        },
        autoLoadOnInitialize: false,
        autoSaveOn: "navigate",
        compress: false,
      },
    });

    expect(api.Initialize("")).toBe("true");
    expect(delivered.at(-1)).toBe("sco1");
    expect(api.SetValue("adl.nav.request", "continue")).toBe("true");
    expect(api.Terminate("")).toBe("true");
    await vi.waitFor(() => expect(saveState).toHaveBeenCalledOnce());

    const [stateData] = saveState.mock.calls[0];
    expect(JSON.parse(stateData).currentActivityId).toBe("sco2");
    expect(delivered.at(-1)).toBe("sco2");
  });

  it("allows an LMS to suppress the Initialize-time state load after preloading", async () => {
    const loadState = vi.fn().mockResolvedValue(null);
    const api = new Scorm2004API({
      sequencing: {
        activityTree: {
          id: "root",
          children: [{ id: "sco1" }],
        },
      },
      sequencingStatePersistence: {
        persistence: {
          saveState: vi.fn().mockResolvedValue(true),
          loadState,
        },
        autoLoadOnInitialize: false,
        compress: false,
      },
    });

    // @spec SCORM 2004 4th Ed. SN 4.2 Tracking Model Persistence - a host-controlled
    // preload must be the only snapshot applied before the first delivery.
    await expect(api.loadSequencingState(metadata)).resolves.toBe(false);
    expect(api.Initialize("")).toBe("true");
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(loadState).toHaveBeenCalledTimes(1);
  });

  it("persists and restores global objective map state", async () => {
    const inMemoryState: { value: string | null } = { value: null };
    const persistence = {
      saveState: async (stateData: string, _metadata: SequencingStateMetadata) => {
        inMemoryState.value = stateData;
        return true;
      },
      loadState: async (_metadata: SequencingStateMetadata) => inMemoryState.value,
      clearState: async (_metadata: SequencingStateMetadata) => {
        inMemoryState.value = null;
        return true;
      },
    };

    const settings: Settings = {
      globalObjectiveIds: ["GLOBAL_PRIMARY"],
      sequencing: {
        activityTree: {
          id: "root",
          title: "Root",
          children: [
            {
              id: "sco1",
              title: "SCO 1",
              primaryObjective: {
                objectiveID: "SCO_PRIMARY",
                satisfiedByMeasure: true,
                minNormalizedMeasure: 0.7,
                mapInfo: [
                  {
                    targetObjectiveID: "GLOBAL_PRIMARY",
                    readSatisfiedStatus: true,
                    writeSatisfiedStatus: true,
                    readNormalizedMeasure: true,
                    writeNormalizedMeasure: true,
                  },
                ],
              },
            },
          ],
        },
      },
      sequencingStatePersistence: {
        persistence,
        autoSaveOn: "never",
        compress: false,
      },
    };

    const api = new Scorm2004API(settings);
    expect(api.Initialize("")).toBe("true");

    expect(api.GetValue("cmi.objectives.0.id")).toBe("SCO_PRIMARY");

    api.SetValue("cmi.objectives.1.id", "GLOBAL_PRIMARY");
    api.SetValue("cmi.objectives.1.success_status", "passed");
    api.SetValue("cmi.objectives.1.score.scaled", "0.82");

    const saved = await api.saveSequencingState(metadata);
    expect(saved).toBe(true);
    expect(inMemoryState.value).toBeTruthy();

    const persistedState = JSON.parse(inMemoryState.value!);
    expect(Array.isArray(persistedState.globalObjectives)).toBe(true);
    expect(persistedState.globalObjectives[0]?.id).toBe("GLOBAL_PRIMARY");
    expect(persistedState.globalObjectiveMap?.GLOBAL_PRIMARY?.normalizedMeasure).toBeCloseTo(
      0.82,
      5,
    );

    const api2 = new Scorm2004API(settings);
    expect(api2.Initialize("")).toBe("true");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const restoredObjectives = (api2 as any)._globalObjectives as Array<any>;
    const restored = restoredObjectives.find((objective) => objective.id === "GLOBAL_PRIMARY");
    expect(restored).toBeDefined();
    expect(restored?.success_status).toBe("passed");
    expect(restored?.score.scaled).toBe("0.82");

    const overallProcess = (api2 as any)._sequencingService?.getOverallSequencingProcess();
    const globalMap = overallProcess?.getGlobalObjectiveMap();
    const globalEntry = globalMap?.get("GLOBAL_PRIMARY");
    expect(globalEntry).toBeDefined();
    expect(globalEntry?.normalizedMeasure).toBeCloseTo(0.82, 5);
    expect(globalEntry?.satisfiedStatus).toBe(true);
  });

  it("restores a host-declared direct global row for a different delivered activity", async () => {
    const inMemoryState: { value: string | null } = { value: null };
    const persistence = {
      saveState: async (stateData: string) => {
        inMemoryState.value = stateData;
        return true;
      },
      loadState: async () => inMemoryState.value,
      clearState: async () => {
        inMemoryState.value = null;
        return true;
      },
    };
    const settings: Settings = {
      globalObjectiveIds: ["HOST_GLOBAL"],
      sequencing: {
        activityTree: {
          id: "root",
          title: "Root",
          children: [
            {
              id: "sco1",
              title: "SCO 1",
              primaryObjective: { objectiveID: "SCO1_PRIMARY" },
            },
            {
              id: "sco2",
              title: "SCO 2",
              primaryObjective: { objectiveID: "SCO2_PRIMARY" },
            },
          ],
        },
      },
      sequencingStatePersistence: {
        persistence,
        autoSaveOn: "never",
        compress: false,
      },
    };

    const api = new Scorm2004API(settings);
    expect(api.Initialize("")).toBe("true");
    expect(api.GetValue("cmi.objectives.0.id")).toBe("SCO1_PRIMARY");
    expect(api.SetValue("cmi.objectives.1.id", "HOST_GLOBAL")).toBe("true");
    expect(api.SetValue("cmi.objectives.1.score.scaled", "0.82")).toBe("true");
    expect(await api.saveSequencingState(metadata)).toBe(true);

    const api2 = new Scorm2004API(settings);
    expect(await api2.loadSequencingState(metadata)).toBe(true);
    expect(api2.processNavigationRequest("choice", "sco2")).toBe(true);
    expect(api2.Initialize("")).toBe("true");

    // @spec SCORM 2004 4th Ed. RTE 4.2.17 / SN 3.10.3 - only the delivered
    // activity's local objective plus the host's explicit direct-global extension are exposed.
    expect(api2.GetValue("cmi.objectives._count")).toBe("2");
    expect(api2.GetValue("cmi.objectives.0.id")).toBe("SCO2_PRIMARY");
    expect(api2.GetValue("cmi.objectives.1.id")).toBe("HOST_GLOBAL");
    expect(api2.GetValue("cmi.objectives.1.score.scaled")).toBe("0.82");
  });

  it("persists auxiliary resource metadata", async () => {
    const inMemoryState: { value: string | null } = { value: null };
    const persistence = {
      saveState: async (stateData: string, _metadata: SequencingStateMetadata) => {
        inMemoryState.value = stateData;
        return true;
      },
      loadState: async (_metadata: SequencingStateMetadata) => inMemoryState.value,
      clearState: async (_metadata: SequencingStateMetadata) => {
        inMemoryState.value = null;
        return true;
      },
    };

    const settings: Settings = {
      sequencing: {
        auxiliaryResources: [{ resourceId: "urn:scorm-again:help", purpose: "help" }],
        activityTree: {
          id: "root",
          title: "Root",
          auxiliaryResources: [{ resourceId: "urn:scorm-again:root-notes", purpose: "notes" }],
          children: [
            {
              id: "child",
              title: "Child",
              auxiliaryResources: [
                { resourceId: "urn:scorm-again:child-job-aid", purpose: "job-aid" },
              ],
            },
          ],
        },
      },
      sequencingStatePersistence: {
        persistence,
        autoSaveOn: "never",
        compress: false,
      },
    };

    const api = new Scorm2004API(settings);
    expect(api.Initialize("")).toBe("true");

    const saved = await api.saveSequencingState(metadata);
    expect(saved).toBe(true);
    expect(inMemoryState.value).toBeTruthy();

    const persistedState = JSON.parse(inMemoryState.value!);
    const rootState = persistedState.sequencing.activityStates.root;
    expect(rootState.auxiliaryResources).toEqual([
      { resourceId: "urn:scorm-again:root-notes", purpose: "notes" },
    ]);
    const childState = persistedState.sequencing.activityStates.child;
    expect(childState.auxiliaryResources).toEqual([
      { resourceId: "urn:scorm-again:child-job-aid", purpose: "job-aid" },
    ]);

    const api2 = new Scorm2004API(settings);
    expect(api2.Initialize("")).toBe("true");
    await new Promise((resolve) => setTimeout(resolve, 0));

    const sequencing2 = (api2 as any)._sequencing;
    expect(sequencing2.auxiliaryResources).toEqual([
      { resourceId: "urn:scorm-again:help", purpose: "help" },
    ]);

    const restoredRoot = sequencing2.activityTree.root;
    expect(restoredRoot.auxiliaryResources).toEqual([
      { resourceId: "urn:scorm-again:root-notes", purpose: "notes" },
    ]);
    const restoredChild = restoredRoot.children[0];
    expect(restoredChild.auxiliaryResources).toEqual([
      { resourceId: "urn:scorm-again:child-job-aid", purpose: "job-aid" },
    ]);
  });

  it("persists and restores selection/randomization state", async () => {
    const mathSpy = vi.spyOn(Math, "random");
    mathSpy
      .mockReturnValueOnce(0.1)
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.6)
      .mockReturnValueOnce(0.2);

    try {
      const inMemoryState: { value: string | null } = { value: null };
      const persistence = {
        saveState: async (stateData: string, _metadata: SequencingStateMetadata) => {
          inMemoryState.value = stateData;
          return true;
        },
        loadState: async (_metadata: SequencingStateMetadata) => inMemoryState.value,
        clearState: async (_metadata: SequencingStateMetadata) => {
          inMemoryState.value = null;
          return true;
        },
      };

      const settings: Settings = {
        sequencing: {
          activityTree: {
            id: "root",
            title: "Root",
            sequencingControls: {
              selectionTiming: SelectionTiming.ONCE,
              selectCount: 2,
              randomizeChildren: true,
              randomizationTiming: RandomizationTiming.ONCE,
            },
            children: [
              { id: "child1", title: "Child 1" },
              { id: "child2", title: "Child 2" },
              { id: "child3", title: "Child 3" },
            ],
          },
        },
        sequencingStatePersistence: {
          persistence,
          autoSaveOn: "never",
          compress: false,
        },
      };

      const api = new Scorm2004API(settings);
      expect(api.Initialize("")).toBe("true");

      const sequencing = (api as any)._sequencing;
      const rootActivity = sequencing.activityTree.root;
      SelectionRandomization.applySelectionAndRandomization(rootActivity, false);

      const availableIds = rootActivity.getAvailableChildren().map((child: any) => child.id);
      expect(availableIds).toEqual(["child3", "child1"]);
      expect(rootActivity.children.map((child: any) => child.id)).toEqual([
        "child3",
        "child1",
        "child2",
      ]);

      const saved = await api.saveSequencingState(metadata);
      expect(saved).toBe(true);
      expect(inMemoryState.value).toBeTruthy();

      const persistedState = JSON.parse(inMemoryState.value!);
      const sequencingState = persistedState.sequencing;
      expect(sequencingState).toBeDefined();
      const rootState = sequencingState.activityStates.root;
      expect(rootState.selectionRandomizationState.selectionCountStatus).toBe(true);
      expect(rootState.selectionRandomizationState.reorderChildren).toBe(true);
      expect(rootState.selectionRandomizationState.childOrder).toEqual([
        "child3",
        "child1",
        "child2",
      ]);
      expect(rootState.selectionRandomizationState.selectedChildIds).toEqual(["child3", "child1"]);
      expect(rootState.selectionRandomizationState.hiddenFromChoiceChildIds).toEqual(["child2"]);

      const api2 = new Scorm2004API(settings);
      expect(api2.Initialize("")).toBe("true");
      await new Promise((resolve) => setTimeout(resolve, 0));

      const sequencing2 = (api2 as any)._sequencing;
      const restoredRoot = sequencing2.activityTree.root;
      expect(restoredRoot.children.map((child: any) => child.id)).toEqual([
        "child3",
        "child1",
        "child2",
      ]);
      expect(restoredRoot.getAvailableChildren().map((child: any) => child.id)).toEqual([
        "child3",
        "child1",
      ]);
      const hiddenChild = restoredRoot.children[2];
      expect(hiddenChild.id).toBe("child2");
      expect(hiddenChild.isHiddenFromChoice).toBe(true);
      expect(hiddenChild.isAvailable).toBe(false);
      expect(restoredRoot.sequencingControls.selectionCountStatus).toBe(true);
      expect(restoredRoot.sequencingControls.reorderChildren).toBe(true);
    } finally {
      mathSpy.mockRestore();
    }
  });

  it("round-trips complete suspension details through fresh APIs", async () => {
    const inMemoryState: { value: string | null } = { value: null };
    const delivered: string[] = [];
    const persistence = {
      saveState: async (stateData: string) => {
        inMemoryState.value = stateData;
        return true;
      },
      loadState: async () => inMemoryState.value,
      clearState: async () => {
        inMemoryState.value = null;
        return true;
      },
    };
    const settings: Settings = {
      sequencing: {
        eventListeners: {
          onActivityDelivery: (activity) => delivered.push(activity.id),
        },
        activityTree: {
          id: "root",
          children: [
            {
              id: "child1",
              primaryObjective: { objectiveID: "PRIMARY" },
            },
            { id: "child2" },
          ],
        },
      },
      sequencingStatePersistence: {
        persistence,
        autoLoadOnInitialize: false,
        autoSaveOn: "never",
        compress: false,
      },
    };

    const api = new Scorm2004API(settings);
    expect(api.Initialize("")).toBe("true");

    const sequencing = (api as any)._sequencing;
    const activityTree = sequencing.activityTree;
    const root = activityTree.root;
    const child = root.children[0];
    const child2 = root.children[1];

    child.attemptAbsoluteDurationValue = "PT1H2M3S";
    child.attemptExperiencedDurationValue = "PT4H5M6S";
    child.activityAbsoluteDurationValue = "PT7H8M9S";
    child.activityExperiencedDurationValue = "PT10H11M12S";
    child.activityStartTimestampUtc = "2026-01-01T01:02:03.000Z";
    child.attemptStartTimestampUtc = "2026-01-01T04:05:06.000Z";
    child.attemptProgressStatus = true;
    child.attemptCount = 3;
    root.setProcessedChildren([child2, child]);

    child.objectiveSatisfiedStatus = false;
    child.objectiveSatisfiedStatusKnown = false;
    child.objectiveMeasureStatus = true;
    child.objectiveNormalizedMeasure = 0.42;
    child.primaryObjective.initializeScoreFromCMI({
      rawScore: "42",
      minScore: "0",
      maxScore: "100",
    });
    activityTree.currentActivity = null;
    activityTree.suspendedActivity = null;

    await expect(api.saveSequencingState(metadata)).resolves.toBe(true);
    const persisted = JSON.parse(inMemoryState.value as string);
    expect(persisted.suspensionState).toBeDefined();
    expect(persisted.suspensionState.currentActivityId).toBeNull();
    expect(persisted.suspensionState.suspendedActivityId).toBeNull();
    expect(persisted.suspensionState.activityTree.children[0]).toMatchObject({
      attemptAbsoluteDurationValue: "PT1H2M3S",
      attemptExperiencedDurationValue: "PT4H5M6S",
      activityAbsoluteDurationValue: "PT7H8M9S",
      activityExperiencedDurationValue: "PT10H11M12S",
      activityStartTimestampUtc: "2026-01-01T01:02:03.000Z",
      attemptStartTimestampUtc: "2026-01-01T04:05:06.000Z",
      attemptProgressStatus: true,
    });
    expect(persisted.suspensionState.activityTree.processedChildren).toEqual(["child2", "child1"]);
    // A sparse native snapshot may retain only the envelope and complete
    // suspension tree; verify restoration does not rely on flattened activityStates.
    persisted.sequencing.activityStates = {};
    inMemoryState.value = JSON.stringify(persisted);

    const api2 = new Scorm2004API(settings);
    expect(api2.Initialize("")).toBe("true");
    await expect(api2.loadSequencingState(metadata)).resolves.toBe(true);

    const sequencing2 = (api2 as any)._sequencing;
    const restoredTree = sequencing2.activityTree;
    const restoredChild = restoredTree.root.children[0];
    expect(restoredTree.currentActivity).toBeNull();
    expect(restoredTree.suspendedActivity).toBeNull();
    expect(restoredChild.attemptAbsoluteDurationValue).toBe("PT1H2M3S");
    expect(restoredChild.attemptExperiencedDurationValue).toBe("PT4H5M6S");
    expect(restoredChild.activityAbsoluteDurationValue).toBe("PT7H8M9S");
    expect(restoredChild.activityExperiencedDurationValue).toBe("PT10H11M12S");
    expect(restoredChild.activityStartTimestampUtc).toBe("2026-01-01T01:02:03.000Z");
    expect(restoredChild.attemptStartTimestampUtc).toBe("2026-01-01T04:05:06.000Z");
    expect(restoredChild.attemptProgressStatus).toBe(true);
    expect(restoredTree.root.getAvailableChildren().map((activity: any) => activity.id)).toEqual([
      "child2",
      "child1",
    ]);
    expect(restoredChild.objectiveSatisfiedStatusKnown).toBe(false);
    expect(restoredChild.primaryObjective.satisfiedStatusKnown).toBe(false);
    expect(restoredChild.primaryObjective.rawScore).toBe("42");
    expect(restoredChild.primaryObjective.minScore).toBe("0");
    expect(restoredChild.primaryObjective.maxScore).toBe("100");
    expect(restoredChild.primaryObjective.isDirty("satisfiedStatus")).toBe(false);
    expect(restoredChild.primaryObjective.isDirty("rawScore")).toBe(false);

    // The persisted processed order drives the next delivery without mutating
    // the manifest child order.
    expect(restoredTree.root.children.map((activity: any) => activity.id)).toEqual([
      "child1",
      "child2",
    ]);
    expect(api2.processNavigationRequest("start")).toBe(true);
    expect(delivered.at(-1)).toBe("child2");
  });

  it("clears explicit null pointers from a legacy envelope", () => {
    const source = new Scorm2004API({
      sequencing: { activityTree: { id: "root", children: [{ id: "child" }] } },
    });
    source.Initialize("");
    const state = JSON.parse(source.serializeSequencingState());
    delete state.suspensionState;
    state.sequencing.currentActivity = null;
    state.sequencing.suspendedActivity = null;

    const restored = new Scorm2004API({
      sequencing: { activityTree: { id: "root", children: [{ id: "child" }] } },
    });
    restored.Initialize("");
    expect(restored.deserializeSequencingState(JSON.stringify(state))).toBe(true);

    const restoredTree = (restored as any)._sequencing.activityTree;
    expect(restoredTree.currentActivity).toBeNull();
    expect(restoredTree.suspendedActivity).toBeNull();
  });

  it("preserves selected order when resuming a sparse native snapshot", async () => {
    const inMemoryState: { value: string | null } = { value: null };
    const delivered: string[] = [];
    const persistence = {
      saveState: async (stateData: string) => {
        inMemoryState.value = stateData;
        return true;
      },
      loadState: async () => inMemoryState.value,
      clearState: async () => true,
    };
    const settings: Settings = {
      sequencing: {
        eventListeners: {
          onActivityDelivery: (activity) => delivered.push(activity.id),
        },
        activityTree: {
          id: "root",
          sequencingControls: {
            flow: true,
            selectionTiming: SelectionTiming.ON_EACH_NEW_ATTEMPT,
            selectCount: 2,
            randomizeChildren: true,
            randomizationTiming: RandomizationTiming.ON_EACH_NEW_ATTEMPT,
          },
          children: [{ id: "child1" }, { id: "child2" }, { id: "child3" }],
        },
      },
      sequencingStatePersistence: {
        persistence,
        autoLoadOnInitialize: false,
        autoSaveOn: "never",
        compress: false,
      },
    };

    const source = new Scorm2004API(settings);
    expect(source.Initialize("")).toBe("true");
    const sourceTree = (source as any)._sequencing.activityTree;
    const sourceRoot = sourceTree.root;
    const sourceChild1 = sourceRoot.children.find((activity: any) => activity.id === "child1");
    const sourceChild2 = sourceRoot.children.find((activity: any) => activity.id === "child2");
    const sourceChild3 = sourceRoot.children.find((activity: any) => activity.id === "child3");
    sourceRoot.setChildOrder(["child1", "child2", "child3"]);
    sourceRoot.attemptCount = 1;
    sourceRoot.isActive = false;
    sourceRoot.isSuspended = true;
    sourceChild1.isAvailable = true;
    sourceChild2.isAvailable = false;
    sourceChild2.isHiddenFromChoice = true;
    sourceChild3.isAvailable = true;
    sourceRoot.setProcessedChildren([sourceChild1, sourceChild3]);
    sourceTree.currentActivity = null;
    sourceTree.suspendedActivity = sourceChild1;

    const state = JSON.parse(source.serializeSequencingState());
    state.sequencing.activityStates = {};
    inMemoryState.value = JSON.stringify(state);

    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
    try {
      const restored = new Scorm2004API(settings);
      expect(restored.Initialize("")).toBe("true");
      delivered.length = 0;
      await expect(restored.loadSequencingState(metadata)).resolves.toBe(true);

      const restoredTree = (restored as any)._sequencing.activityTree;
      expect(restoredTree.root.children.map((activity: any) => activity.id)).toEqual([
        "child1",
        "child2",
        "child3",
      ]);
      expect(restoredTree.root.getAvailableChildren().map((activity: any) => activity.id)).toEqual([
        "child1",
        "child3",
      ]);
      expect(restoredTree.suspendedActivity?.id).toBe("child1");

      expect(restored.processNavigationRequest("resumeAll")).toBe(true);
      expect(restoredTree.currentActivity?.id).toBe("child1");
      expect(restoredTree.root.getAvailableChildren().map((activity: any) => activity.id)).toEqual([
        "child1",
        "child3",
      ]);

      expect(restored.Terminate("")).toBe("true");
      expect(restored.processNavigationRequest("continue")).toBe(true);
      expect(restoredTree.currentActivity?.id).toBe("child3");
    } finally {
      randomSpy.mockRestore();
    }
  });

  it("persists sequencing collection-derived state", async () => {
    const inMemoryState: { value: string | null } = { value: null };
    const persistence = {
      saveState: async (stateData: string, _metadata: SequencingStateMetadata) => {
        inMemoryState.value = stateData;
        return true;
      },
      loadState: async (_metadata: SequencingStateMetadata) => inMemoryState.value,
      clearState: async (_metadata: SequencingStateMetadata) => {
        inMemoryState.value = null;
        return true;
      },
    };

    const settings: Settings = {
      sequencing: {
        hideLmsUi: ["exit"],
        collections: {
          clusterDefaults: {
            sequencingControls: {
              flow: true,
              choice: false,
            },
            hideLmsUi: ["continue"],
            selectionRandomizationState: {
              childOrder: ["leafA", "leafB"],
              selectedChildIds: ["leafA"],
              hiddenFromChoiceChildIds: ["leafB"],
            },
          },
        },
        activityTree: {
          id: "root",
          title: "Root",
          sequencingCollectionRefs: "clusterDefaults",
          sequencingControls: {
            choice: true,
          },
          children: [
            {
              id: "cluster",
              title: "Cluster",
              sequencingCollectionRefs: "clusterDefaults",
              children: [
                { id: "leafA", title: "Leaf A" },
                { id: "leafB", title: "Leaf B" },
              ],
            },
            {
              id: "cluster2",
              title: "Cluster 2",
              sequencingCollectionRefs: "clusterDefaults",
              children: [
                { id: "leafC", title: "Leaf C" },
                { id: "leafD", title: "Leaf D" },
              ],
            },
          ],
        },
      },
      sequencingStatePersistence: {
        persistence,
        autoSaveOn: "never",
        compress: false,
      },
    };

    const api = new Scorm2004API(settings);
    expect(api.Initialize("")).toBe("true");

    const sequencing = (api as any)._sequencing;
    const cluster = sequencing.activityTree.root.children[0];
    const clusterTwo = sequencing.activityTree.root.children[1];
    SelectionRandomization.applySelectionAndRandomization(cluster, false);
    SelectionRandomization.applySelectionAndRandomization(clusterTwo, false);

    const saved = await api.saveSequencingState(metadata);
    expect(saved).toBe(true);
    expect(inMemoryState.value).toBeTruthy();

    const api2 = new Scorm2004API(settings);
    expect(api2.Initialize("")).toBe("true");
    const loaded = await api2.loadSequencingState(metadata);
    expect(loaded).toBe(true);

    const sequencing2 = (api2 as any)._sequencing;
    const restoredRoot = sequencing2.activityTree.root;
    const restoredCluster = restoredRoot.children[0];
    const restoredClusterTwo = restoredRoot.children[1];

    const restoredAvailable1 = SelectionRandomization.applySelectionAndRandomization(
      restoredCluster,
      false,
    );
    expect(restoredCluster.sequencingControls.flow).toBe(true);
    expect(restoredCluster.sequencingControls.choice).toBe(false);
    expect(restoredCluster.hideLmsUi).toEqual(["continue"]);
    expect(restoredAvailable1.map((child: any) => child.id)).toEqual(["leafA"]);

    const restoredAvailable2 = SelectionRandomization.applySelectionAndRandomization(
      restoredClusterTwo,
      false,
    );
    expect(restoredClusterTwo.sequencingControls.flow).toBe(true);
    expect(restoredClusterTwo.sequencingControls.choice).toBe(false);
    expect(restoredClusterTwo.hideLmsUi).toEqual(["continue"]);
    expect(restoredAvailable2.map((child: any) => child.id)).toEqual([]);
  });

  it("should restore contentDelivered flag from serialized state", () => {
    const api = new Scorm2004API({ sequencingStatePersistence: { enabled: true } });
    api.configureSequencing({
      activityTree: { id: "root" },
    });
    api.lmsInitialize();

    // Get state with contentDelivered at top level but NOT in nested sequencing
    const serialized = api.serializeSequencingState();
    const state = JSON.parse(serialized);
    state.contentDelivered = true;
    // Explicitly remove it from nested sequencing to test top-level restoration
    if (state.sequencing) {
      state.sequencing.contentDelivered = false;
    }

    // Create new API and restore
    const api2 = new Scorm2004API({ sequencingStatePersistence: { enabled: true } });
    api2.configureSequencing({
      activityTree: { id: "root" },
    });
    api2.lmsInitialize();
    api2.deserializeSequencingState(JSON.stringify(state));

    const sequencing = api2.getSequencingService()?.getOverallSequencingProcess();
    expect(sequencing?.hasContentBeenDelivered()).toBe(true);
  });
});
