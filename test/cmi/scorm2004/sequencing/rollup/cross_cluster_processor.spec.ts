import { describe, expect, it, beforeEach, vi } from "vitest";
import { CrossClusterProcessor } from "../../../../../src/cmi/scorm2004/sequencing/rollup/cross_cluster_processor";
import { Activity } from "../../../../../src/cmi/scorm2004/sequencing/activity";
import { MeasureRollupProcessor } from "../../../../../src/cmi/scorm2004/sequencing/rollup/measure_rollup";
import { ObjectiveRollupProcessor } from "../../../../../src/cmi/scorm2004/sequencing/rollup/objective_rollup";
import { ProgressRollupProcessor } from "../../../../../src/cmi/scorm2004/sequencing/rollup/progress_rollup";
import {
  createMockActivity,
  createMockProcessors,
  getEventCallsByType,
} from "../../../../helpers/mock-factories";

describe("CrossClusterProcessor", () => {
  let processor: CrossClusterProcessor;
  let mockMeasureProcessor: MeasureRollupProcessor;
  let mockObjectiveProcessor: ObjectiveRollupProcessor;
  let mockProgressProcessor: ProgressRollupProcessor;
  let eventCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const processors = createMockProcessors();
    mockMeasureProcessor = processors.measureProcessor;
    mockObjectiveProcessor = processors.objectiveProcessor;
    mockProgressProcessor = processors.progressProcessor;

    eventCallback = vi.fn();

    processor = new CrossClusterProcessor(
      mockMeasureProcessor,
      mockObjectiveProcessor,
      mockProgressProcessor,
      eventCallback,
    );
  });

  describe("constructor", () => {
    it("should create processor with event callback", () => {
      const proc = new CrossClusterProcessor(
        mockMeasureProcessor,
        mockObjectiveProcessor,
        mockProgressProcessor,
        eventCallback,
      );

      expect(proc).toBeDefined();
    });

    it("should create processor without event callback", () => {
      const proc = new CrossClusterProcessor(
        mockMeasureProcessor,
        mockObjectiveProcessor,
        mockProgressProcessor,
      );

      expect(proc).toBeDefined();
    });
  });

  describe("processCrossClusterDependencies", () => {
    it("should process clusters and fire events", () => {
      const activity = createMockActivity({ id: "root" });
      const clusters = [
        createMockActivity({ id: "cluster1" }),
        createMockActivity({ id: "cluster2" }),
      ];

      processor.processCrossClusterDependencies(activity, clusters);

      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_processing_started",
        expect.objectContaining({
          activityId: "root",
          clusterCount: 2,
          depth: 0,
        }),
      );

      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_processing_completed",
        expect.objectContaining({
          activityId: "root",
          processedClusters: 2,
        }),
      );
    });

    it("should stop processing at max depth", () => {
      const activity = createMockActivity({ id: "deep" });
      const clusters: Activity[] = [];

      processor.processCrossClusterDependencies(activity, clusters, 10);

      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_max_depth_reached",
        expect.objectContaining({
          activityId: "deep",
          depth: 10,
          maxDepth: 10,
        }),
      );
    });

    it("should skip reentrant calls", () => {
      const activity = createMockActivity({ id: "reentrant" });
      const clusters: Activity[] = [];

      // Simulate first call being in progress by calling internally
      // We'll mock this by making the measureProcessor trigger re-entry
      let callCount = 0;
      (mockMeasureProcessor.measureRollupProcess as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          // Simulate reentry during processing
          processor.processCrossClusterDependencies(activity, clusters);
        }
        return [];
      });

      // Include a cluster that will trigger processing
      const cluster = createMockActivity({ id: "cluster1" });

      processor.processCrossClusterDependencies(activity, [cluster]);

      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_skip_reentrant",
        expect.objectContaining({
          activityId: "reentrant",
        }),
      );
    });

    it("should handle errors during processing", () => {
      const activity = createMockActivity({ id: "error-test" });
      const errorCluster = createMockActivity({ id: "error-cluster" });

      // Make measure processor throw an error
      (mockMeasureProcessor.measureRollupProcess as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw new Error("Test error");
      });

      processor.processCrossClusterDependencies(activity, [errorCluster]);

      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_processing_error",
        expect.objectContaining({
          activityId: "error-test",
          error: "Test error",
        }),
      );
    });

    it("should handle non-Error exceptions", () => {
      const activity = createMockActivity({ id: "error-test2" });
      const errorCluster = createMockActivity({ id: "error-cluster2" });

      // Make measure processor throw a non-Error
      (mockMeasureProcessor.measureRollupProcess as ReturnType<typeof vi.fn>).mockImplementation(() => {
        throw "string error";
      });

      processor.processCrossClusterDependencies(activity, [errorCluster]);

      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_processing_error",
        expect.objectContaining({
          activityId: "error-test2",
          error: "string error",
        }),
      );
    });

    it("should work without event callback", () => {
      const procNoCallback = new CrossClusterProcessor(
        mockMeasureProcessor,
        mockObjectiveProcessor,
        mockProgressProcessor,
      );

      const activity = createMockActivity({ id: "no-callback" });
      const clusters = [createMockActivity({ id: "cluster1" })];

      // Should not throw
      expect(() => {
        procNoCallback.processCrossClusterDependencies(activity, clusters);
      }).not.toThrow();
    });

    it("should process empty clusters array", () => {
      const activity = createMockActivity({ id: "empty" });

      processor.processCrossClusterDependencies(activity, []);

      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_processing_completed",
        expect.objectContaining({
          processedClusters: 0,
        }),
      );
    });
  });

  describe("identifyActivityClusters", () => {
    it("should identify clusters with children and flow", () => {
      const child1 = createMockActivity({ id: "child1" });
      const cluster = createMockActivity({
        id: "cluster",
        children: [child1] as Activity[],
        flow: true,
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: false,
      });
      const nonCluster = createMockActivity({
        id: "non-cluster",
        children: [],
        flow: true,
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: false,
      });
      const noFlowCluster = createMockActivity({
        id: "no-flow",
        children: [child1] as Activity[],
        flow: false,
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: false,
      });

      const result = processor.identifyActivityClusters([cluster, nonCluster, noFlowCluster]);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("cluster");
    });

    it("should return empty array when no clusters found", () => {
      const leaf1 = createMockActivity({ id: "leaf1", children: [] });
      const leaf2 = createMockActivity({ id: "leaf2", children: [] });

      const result = processor.identifyActivityClusters([leaf1, leaf2]);

      expect(result).toHaveLength(0);
    });
  });

  describe("analyzeCrossClusterDependencies", () => {
    it("should add cluster to dependency map", () => {
      const cluster = createMockActivity({
        id: "cluster1",
        sequencingRules: { preConditionRules: [] },
      });
      const dependencyMap = new Map<string, string[]>();

      processor.analyzeCrossClusterDependencies(cluster, dependencyMap);

      expect(dependencyMap.has("cluster1")).toBe(true);
      expect(dependencyMap.get("cluster1")).toEqual([]);
    });

    it("should handle cluster with precondition rules", () => {
      const cluster = createMockActivity({
        id: "cluster2",
        sequencingRules: { preConditionRules: [{ type: "test" }] },
      });
      const dependencyMap = new Map<string, string[]>();

      processor.analyzeCrossClusterDependencies(cluster, dependencyMap);

      expect(dependencyMap.has("cluster2")).toBe(true);
      // Currently dependencies are empty as rule analysis is not fully implemented
      expect(dependencyMap.get("cluster2")).toEqual([]);
    });
  });

  describe("resolveDependencyOrder", () => {
    it("should resolve simple dependency chain", () => {
      const dependencyMap = new Map<string, string[]>();
      dependencyMap.set("a", []);
      dependencyMap.set("b", ["a"]);
      dependencyMap.set("c", ["b"]);

      const result = processor.resolveDependencyOrder(dependencyMap);

      expect(result).toEqual(["a", "b", "c"]);
    });

    it("should resolve independent activities", () => {
      const dependencyMap = new Map<string, string[]>();
      dependencyMap.set("a", []);
      dependencyMap.set("b", []);
      dependencyMap.set("c", []);

      const result = processor.resolveDependencyOrder(dependencyMap);

      expect(result).toHaveLength(3);
      expect(result).toContain("a");
      expect(result).toContain("b");
      expect(result).toContain("c");
    });

    it("should detect circular dependencies", () => {
      const dependencyMap = new Map<string, string[]>();
      dependencyMap.set("a", ["c"]);
      dependencyMap.set("b", ["a"]);
      dependencyMap.set("c", ["b"]);

      const result = processor.resolveDependencyOrder(dependencyMap);

      expect(eventCallback).toHaveBeenCalledWith(
        "circular_dependency_detected",
        expect.objectContaining({
          activityId: expect.any(String),
        }),
      );

      // Should still return some order, even with circular deps
      expect(result.length).toBeGreaterThan(0);
    });

    it("should handle empty dependency map", () => {
      const dependencyMap = new Map<string, string[]>();

      const result = processor.resolveDependencyOrder(dependencyMap);

      expect(result).toEqual([]);
    });

    it("should handle dependency on non-existent activity", () => {
      const dependencyMap = new Map<string, string[]>();
      dependencyMap.set("a", ["nonexistent"]);

      // Should not throw
      const result = processor.resolveDependencyOrder(dependencyMap);

      expect(result).toContain("a");
    });
  });

  describe("processClusterRollup", () => {
    it("should call measure processor", () => {
      const cluster = createMockActivity({ id: "cluster" });

      processor.processClusterRollup(cluster);

      expect(mockMeasureProcessor.measureRollupProcess).toHaveBeenCalledWith(cluster);
    });

    it("should call objective processor when rollupObjectiveSatisfied is true", () => {
      const cluster = createMockActivity({
        id: "cluster",
        flow: false,
        rollupObjectiveSatisfied: true,
        rollupProgressCompletion: false,
      });

      processor.processClusterRollup(cluster);

      expect(mockObjectiveProcessor.objectiveRollupProcess).toHaveBeenCalledWith(cluster);
    });

    it("should not call objective processor when rollupObjectiveSatisfied is false", () => {
      const cluster = createMockActivity({
        id: "cluster",
        flow: false,
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: false,
      });

      processor.processClusterRollup(cluster);

      expect(mockObjectiveProcessor.objectiveRollupProcess).not.toHaveBeenCalled();
    });

    it("should call progress processor when rollupProgressCompletion is true", () => {
      const cluster = createMockActivity({
        id: "cluster",
        flow: false,
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: true,
      });

      processor.processClusterRollup(cluster);

      expect(mockProgressProcessor.activityProgressRollupProcess).toHaveBeenCalledWith(cluster);
    });

    it("should not call progress processor when rollupProgressCompletion is false", () => {
      const cluster = createMockActivity({
        id: "cluster",
        flow: false,
        rollupObjectiveSatisfied: false,
        rollupProgressCompletion: false,
      });

      processor.processClusterRollup(cluster);

      expect(mockProgressProcessor.activityProgressRollupProcess).not.toHaveBeenCalled();
    });

    it("should handle nested clusters by recursively calling processCrossClusterDependencies", () => {
      const nestedCluster1 = createMockActivity({ id: "nested1" });
      const nestedCluster2 = createMockActivity({ id: "nested2" });
      const cluster = createMockActivity({ id: "parent-cluster" });

      // Make measure processor return nested clusters
      (mockMeasureProcessor.measureRollupProcess as ReturnType<typeof vi.fn>).mockReturnValue([
        nestedCluster1,
        nestedCluster2,
      ]);

      processor.processClusterRollup(cluster, 0);

      // Should have called event for nested processing
      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_processing_started",
        expect.objectContaining({
          activityId: "parent-cluster",
          depth: 1,
        }),
      );
    });

    it("should not recursively process when only one nested cluster", () => {
      const nestedCluster = createMockActivity({ id: "nested" });
      const cluster = createMockActivity({ id: "parent-cluster" });

      // Make measure processor return single cluster
      (mockMeasureProcessor.measureRollupProcess as ReturnType<typeof vi.fn>).mockReturnValue([nestedCluster]);

      processor.processClusterRollup(cluster, 0);

      // Should not have called cross_cluster_processing_started for nested
      const startedCalls = getEventCallsByType(eventCallback, "cross_cluster_processing_started");
      expect(startedCalls).toHaveLength(0);
    });

    it("should increment depth for nested cluster processing", () => {
      const nestedCluster1 = createMockActivity({ id: "nested1" });
      const nestedCluster2 = createMockActivity({ id: "nested2" });
      const cluster = createMockActivity({ id: "parent" });

      (mockMeasureProcessor.measureRollupProcess as ReturnType<typeof vi.fn>).mockReturnValue([
        nestedCluster1,
        nestedCluster2,
      ]);

      processor.processClusterRollup(cluster, 5);

      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_processing_started",
        expect.objectContaining({
          depth: 6,
        }),
      );
    });
  });

  describe("integration scenarios", () => {
    it("should process complete cross-cluster scenario", () => {
      const leaf1 = createMockActivity({ id: "leaf1" });
      const leaf2 = createMockActivity({ id: "leaf2" });

      const cluster1 = createMockActivity({
        id: "cluster1",
        children: [leaf1] as Activity[],
        flow: true,
        rollupObjectiveSatisfied: true,
        rollupProgressCompletion: true,
      });

      const cluster2 = createMockActivity({
        id: "cluster2",
        children: [leaf2] as Activity[],
        flow: true,
        rollupObjectiveSatisfied: true,
        rollupProgressCompletion: true,
      });

      const root = createMockActivity({
        id: "root",
        children: [cluster1, cluster2] as Activity[],
      });

      // Identify clusters
      const clusters = processor.identifyActivityClusters(root.children);
      expect(clusters).toHaveLength(2);

      // Process cross-cluster dependencies
      processor.processCrossClusterDependencies(root, clusters);

      // Verify measure processor was called for each cluster
      expect(mockMeasureProcessor.measureRollupProcess).toHaveBeenCalledWith(cluster1);
      expect(mockMeasureProcessor.measureRollupProcess).toHaveBeenCalledWith(cluster2);

      // Verify objective processor was called for each cluster
      expect(mockObjectiveProcessor.objectiveRollupProcess).toHaveBeenCalledWith(cluster1);
      expect(mockObjectiveProcessor.objectiveRollupProcess).toHaveBeenCalledWith(cluster2);

      // Verify progress processor was called for each cluster
      expect(mockProgressProcessor.activityProgressRollupProcess).toHaveBeenCalledWith(cluster1);
      expect(mockProgressProcessor.activityProgressRollupProcess).toHaveBeenCalledWith(cluster2);
    });

    it("should handle deeply nested clusters up to max depth", () => {
      // Create nested structure that would exceed max depth
      const deepActivity = createMockActivity({ id: "deep" });

      // Setup mock to keep returning more clusters to force deep recursion
      let callCount = 0;
      (mockMeasureProcessor.measureRollupProcess as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount <= 15) {
          return [
            createMockActivity({ id: `nested-${callCount}-1` }),
            createMockActivity({ id: `nested-${callCount}-2` }),
          ];
        }
        return [];
      });

      const clusters = [
        createMockActivity({ id: "cluster1" }),
        createMockActivity({ id: "cluster2" }),
      ];

      processor.processCrossClusterDependencies(deepActivity, clusters);

      // Should have hit max depth at some point
      expect(eventCallback).toHaveBeenCalledWith(
        "cross_cluster_max_depth_reached",
        expect.objectContaining({
          maxDepth: 10,
        }),
      );
    });
  });
});
