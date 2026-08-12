import { describe, expect, it, vi } from "vitest";
import { GlobalObjectiveManager } from "../../src/objectives/global_objective_manager";
import {
  DataSerializerContext,
  Scorm2004DataSerializer,
} from "../../src/serialization/scorm2004_data_serializer";

describe("Scorm2004DataSerializer", () => {
  it("commits the existing global objective map without ending the activity attempt", () => {
    const snapshot = {
      "gObj-SX11": {
        id: "gObj-SX11",
        rawScore: "7",
        rawScoreKnown: true,
        minScore: "1",
        minScoreKnown: true,
        maxScore: "3.3333",
        maxScoreKnown: true,
        progressMeasure: 0.011,
        progressMeasureKnown: true,
      },
    };
    const syncCmiToSequencingActivity = vi.fn();
    const captureGlobalObjectiveSnapshot = vi.fn().mockReturnValue(snapshot);
    const globalObjectiveManager = {
      syncCmiToSequencingActivity,
      captureGlobalObjectiveSnapshot,
    } as unknown as GlobalObjectiveManager;
    const context = {
      getSettings: () => ({ autoPopulateCommitMetadata: false }),
      cmi: {
        completion_status: "unknown",
        success_status: "unknown",
        score: { getScoreObject: () => ({}) },
        getCurrentTotalTime: () => "PT0S",
      },
      sequencingService: null,
      renderCMIToJSONObject: () => ({ cmi: {} }),
    } as unknown as DataSerializerContext;

    const commit = new Scorm2004DataSerializer(context, globalObjectiveManager).renderCommitObject(
      false,
      true,
    );

    expect(syncCmiToSequencingActivity).not.toHaveBeenCalled();
    expect(captureGlobalObjectiveSnapshot).toHaveBeenCalledOnce();
    expect(commit.globalObjectives).toEqual(snapshot);
  });
});
