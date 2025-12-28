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

    api.SetValue("cmi.objectives.0.id", "GLOBAL_PRIMARY");
    api.SetValue("cmi.objectives.0.success_status", "passed");
    api.SetValue("cmi.objectives.0.score.scaled", "0.82");

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
