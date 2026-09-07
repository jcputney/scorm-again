import { describe, expect, it } from "vitest";
import Scorm2004API from "../../../../src/Scorm2004API";
import { LogLevelEnum } from "../../../../src/constants/enums";

describe("asset-only default rollup", () => {
  it("completes a nested activity tree when forward flow reaches the end", () => {
    const clusterSizes = [6, 4, 5, 3];
    const activityTree = {
      id: "root",
      title: "Asset course",
      children: clusterSizes.map((size, clusterIndex) => ({
        id: `cluster-${clusterIndex + 1}`,
        title: `Cluster ${clusterIndex + 1}`,
        children: Array.from({ length: size }, (_, leafIndex) => ({
          id: `asset-${clusterIndex + 1}-${leafIndex + 1}`,
          title: `Asset ${clusterIndex + 1}.${leafIndex + 1}`,
        })),
      })),
    };
    const api = new Scorm2004API({
      autocommit: false,
      logLevel: LogLevelEnum.NONE,
      sequencing: { activityTree },
    });
    const sequencing = api.getSequencingService();

    expect(sequencing).not.toBeNull();
    expect(sequencing!.processNavigationRequest("start")).toBe(true);
    for (let clusterIndex = 0; clusterIndex < clusterSizes.length; clusterIndex += 1) {
      for (let leafIndex = 0; leafIndex < clusterSizes[clusterIndex]; leafIndex += 1) {
        expect(
          sequencing!.processNavigationRequest(
            "choice",
            `asset-${clusterIndex + 1}-${leafIndex + 1}`,
          ),
        ).toBe(true);
      }
    }
    expect(sequencing!.getSequencingState().currentActivity?.id).toBe("asset-4-3");
    expect(sequencing!.processNavigationRequest("choice", "asset-1-1")).toBe(true);
    for (let index = 1; index < 18; index += 1) {
      expect(sequencing!.processNavigationRequest("continue")).toBe(true);
    }

    expect(sequencing!.getSequencingState().currentActivity?.id).toBe("asset-4-3");
    expect(sequencing!.processNavigationRequest("continue")).toBe(true);

    const state = sequencing!.getSequencingState();
    expect(state.rootActivity?.children.map((child) => child.completionStatus)).toEqual([
      "completed",
      "completed",
      "completed",
      "completed",
    ]);
    expect(state.rootActivity?.children.map((child) => child.successStatus)).toEqual([
      "passed",
      "passed",
      "passed",
      "passed",
    ]);
    expect(state.rootActivity?.completionStatus).toBe("completed");
    expect(state.rootActivity?.successStatus).toBe("passed");

    const commit = api.renderCommitObject(true);
    expect(commit.completionStatus).toBe("completed");
    expect(commit.successStatus).toBe("passed");
  });
});
