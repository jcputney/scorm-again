import { describe, expect, it, vi } from "vitest";
import { GlobalObjectiveManager } from "../../src/objectives/global_objective_manager";
import {
  DataSerializerContext,
  Scorm2004DataSerializer,
} from "../../src/serialization/scorm2004_data_serializer";
import { SequencingService } from "../../src/services/SequencingService";

describe("Scorm2004DataSerializer", () => {
  it("uses the course root only for terminate commit status", () => {
    const context = {
      getSettings: () => ({ autoPopulateCommitMetadata: false, dataCommitFormat: "json" }),
      cmi: {
        completion_status: "incomplete",
        success_status: "unknown",
        score: { getScoreObject: () => ({}) },
        getCurrentTotalTime: () => "PT0S",
      },
      sequencingService: {
        getSequencingState: () => ({
          rootActivity: {
            completionStatus: "completed",
            successStatus: "passed",
          },
        }),
      } as unknown as SequencingService,
      renderCMIToJSONObject: () => ({
        cmi: {
          completion_status: "incomplete",
          success_status: "unknown",
        },
      }),
    } as unknown as DataSerializerContext;
    const serializer = new Scorm2004DataSerializer(context);

    const ordinaryCommit = serializer.renderCommitObject(false);
    const terminateCommit = serializer.renderCommitObject(true);

    expect(ordinaryCommit.completionStatus).toBe("incomplete");
    expect(ordinaryCommit.successStatus).toBe("unknown");
    expect(terminateCommit.completionStatus).toBe("completed");
    expect(terminateCommit.successStatus).toBe("passed");
    expect(terminateCommit.runtimeData.cmi).toMatchObject({
      completion_status: "incomplete",
      success_status: "unknown",
    });
  });

  it("keeps an incomplete course root when the active SCO is complete", () => {
    const context = {
      getSettings: () => ({ autoPopulateCommitMetadata: false, dataCommitFormat: "json" }),
      cmi: {
        completion_status: "completed",
        success_status: "passed",
        score: { getScoreObject: () => ({ scaled: 1 }) },
        getCurrentTotalTime: () => "PT0S",
      },
      sequencingService: {
        getSequencingState: () => ({
          rootActivity: {
            completionStatus: "incomplete",
            successStatus: "unknown",
          },
        }),
      } as unknown as SequencingService,
      renderCMIToJSONObject: () => ({
        cmi: {
          completion_status: "completed",
          success_status: "passed",
        },
      }),
    } as unknown as DataSerializerContext;

    const commit = new Scorm2004DataSerializer(context).renderCommitObject(true);

    expect(commit.completionStatus).toBe("incomplete");
    expect(commit.successStatus).toBe("unknown");
    expect(commit.runtimeData.cmi).toMatchObject({
      completion_status: "completed",
      success_status: "passed",
    });
  });

  it("uses the rolled-up course score for a terminate commit", () => {
    const context = {
      getSettings: () => ({ autoPopulateCommitMetadata: false, dataCommitFormat: "json" }),
      cmi: {
        completion_status: "incomplete",
        success_status: "unknown",
        score: { getScoreObject: () => ({}) },
        getCurrentTotalTime: () => "PT0S",
      },
      sequencingService: {
        getSequencingState: () => ({
          rootActivity: {
            completionStatus: "completed",
            successStatus: "passed",
            objectiveMeasureStatus: true,
            objectiveNormalizedMeasure: 1,
            primaryObjective: null,
          },
        }),
      } as unknown as SequencingService,
      renderCMIToJSONObject: () => ({
        cmi: {
          completion_status: "incomplete",
          success_status: "unknown",
          score: { scaled: "", raw: "", min: "", max: "" },
        },
      }),
    } as unknown as DataSerializerContext;
    const serializer = new Scorm2004DataSerializer(context);

    expect(serializer.renderCommitObject(false).score).toEqual({});
    expect(serializer.renderCommitObject(true).score).toEqual({ scaled: 1 });
  });

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
