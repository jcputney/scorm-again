import { describe, it, expect, beforeEach } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";

/**
 * GAP-20: Duration Rollup Tests
 * Tests for duration rollup functionality in cluster activities
 */
describe("GAP-20: Duration Rollup Process", () => {
  let rollupProcess: RollupProcess;

  beforeEach(() => {
    rollupProcess = new RollupProcess();
  });

  describe("Test 1: Leaf Activities Don't Rollup", () => {
    it("should not perform duration rollup on leaf activities (no children)", () => {
      const leaf = new Activity("leaf", "Leaf Activity");
      leaf.activityStartTimestampUtc = "2025-01-01T10:00:00Z";
      leaf.activityEndedDate = new Date("2025-01-01T10:05:00Z");
      leaf.attemptExperiencedDuration = "PT5M0S";

      // Trigger rollup on a leaf (should be a no-op)
      rollupProcess.overallRollupProcess(leaf);

      // Leaf's own values should remain unchanged
      expect(leaf.activityStartTimestampUtc).toBe("2025-01-01T10:00:00Z");
      expect(leaf.activityEndedDate).toEqual(new Date("2025-01-01T10:05:00Z"));
      expect(leaf.attemptExperiencedDuration).toBe("PT5M0S");

      // Value fields should still be at defaults since no rollup occurred
      expect(leaf.activityAbsoluteDurationValue).toBe("PT0H0M0S");
      expect(leaf.activityExperiencedDurationValue).toBe("PT0H0M0S");
    });
  });

  describe("Test 2: Parent Aggregates Durations from Children", () => {
    it("should aggregate experienced durations from all children", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);

      // Set child durations
      child1.activityStartTimestampUtc = "2025-01-01T10:00:00Z";
      child1.activityEndedDate = new Date("2025-01-01T10:05:00Z");
      child1.activityExperiencedDuration = "PT5M0S";
      child1.attemptExperiencedDuration = "PT5M0S";
      child1.attemptStartTimestampUtc = "2025-01-01T10:00:00Z";

      child2.activityStartTimestampUtc = "2025-01-01T10:02:00Z";
      child2.activityEndedDate = new Date("2025-01-01T10:07:00Z");
      child2.activityExperiencedDuration = "PT5M0S";
      child2.attemptExperiencedDuration = "PT5M0S";
      child2.attemptStartTimestampUtc = "2025-01-01T10:02:00Z";

      child3.activityStartTimestampUtc = "2025-01-01T10:01:00Z";
      child3.activityEndedDate = new Date("2025-01-01T10:06:00Z");
      child3.activityExperiencedDuration = "PT5M0S";
      child3.attemptExperiencedDuration = "PT5M0S";
      child3.attemptStartTimestampUtc = "2025-01-01T10:01:00Z";

      // Trigger rollup from first child
      rollupProcess.overallRollupProcess(child1);

      // Root should have aggregated experienced duration (sum: 5+5+5 = 15 minutes)
      expect(root.activityExperiencedDurationValue).toBe("PT15M");

      // Root should have aggregated attempt experienced duration
      expect(root.attemptExperiencedDurationValue).toBe("PT15M");
    });

    it("should calculate absolute duration from earliest start to latest end", () => {
      const root = new Activity("root", "Root");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const child3 = new Activity("child3", "Child 3");

      root.addChild(child1);
      root.addChild(child2);
      root.addChild(child3);

      // Children run at different times
      child1.activityStartTimestampUtc = "2025-01-01T10:00:00Z"; // Earliest
      child1.activityEndedDate = new Date("2025-01-01T10:05:00Z");
      child1.activityExperiencedDuration = "PT5M0S";

      child2.activityStartTimestampUtc = "2025-01-01T10:02:00Z";
      child2.activityEndedDate = new Date("2025-01-01T10:07:00Z"); // Latest
      child2.activityExperiencedDuration = "PT5M0S";

      child3.activityStartTimestampUtc = "2025-01-01T10:01:00Z";
      child3.activityEndedDate = new Date("2025-01-01T10:06:00Z");
      child3.activityExperiencedDuration = "PT5M0S";

      // Trigger rollup
      rollupProcess.overallRollupProcess(child1);

      // Root should have absolute duration from 10:00 to 10:07 (7 minutes wall clock)
      expect(root.activityAbsoluteDurationValue).toBe("PT7M");
    });
  });

  describe("Test 3: Timestamps Propagate Correctly", () => {
    it("should set parent's start timestamp to earliest child start", () => {
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      parent.addChild(child1);
      parent.addChild(child2);

      child1.activityStartTimestampUtc = "2025-01-01T10:05:00Z";
      child1.activityEndedDate = new Date("2025-01-01T10:10:00Z");
      child1.activityExperiencedDuration = "PT5M0S";

      child2.activityStartTimestampUtc = "2025-01-01T10:00:00Z"; // Earlier
      child2.activityEndedDate = new Date("2025-01-01T10:08:00Z");
      child2.activityExperiencedDuration = "PT8M0S";

      rollupProcess.overallRollupProcess(child1);

      // Parent should have earliest start timestamp
      expect(parent.activityStartTimestampUtc).toBe("2025-01-01T10:00:00Z");
    });

    it("should set parent's end date to latest child end", () => {
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      parent.addChild(child1);
      parent.addChild(child2);

      child1.activityStartTimestampUtc = "2025-01-01T10:00:00Z";
      child1.activityEndedDate = new Date("2025-01-01T10:05:00Z");
      child1.activityExperiencedDuration = "PT5M0S";

      child2.activityStartTimestampUtc = "2025-01-01T10:02:00Z";
      child2.activityEndedDate = new Date("2025-01-01T10:12:00Z"); // Latest
      child2.activityExperiencedDuration = "PT10M0S";

      rollupProcess.overallRollupProcess(child1);

      // Parent should have latest end date
      expect(parent.activityEndedDate).toEqual(new Date("2025-01-01T10:12:00Z"));
    });
  });

  describe("Test 4: Duration Rollup with Optimization", () => {
    it("should continue duration rollup even when other rollup is skipped", () => {
      // Create a three-level tree
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const leaf1 = new Activity("leaf1", "Leaf 1");

      root.addChild(cluster1);
      cluster1.addChild(leaf1);

      // Disable rollup controls to trigger optimization
      root.sequencingControls.rollupObjectiveSatisfied = false;
      root.sequencingControls.rollupProgressCompletion = false;
      cluster1.sequencingControls.rollupObjectiveSatisfied = false;
      cluster1.sequencingControls.rollupProgressCompletion = false;

      // Set leaf timing data
      leaf1.activityStartTimestampUtc = "2025-01-01T10:00:00Z";
      leaf1.activityEndedDate = new Date("2025-01-01T10:10:00Z");
      leaf1.activityExperiencedDuration = "PT10M0S";

      // Trigger rollup from leaf
      rollupProcess.overallRollupProcess(leaf1);

      // Duration should roll up to cluster1
      expect(cluster1.activityStartTimestampUtc).toBe("2025-01-01T10:00:00Z");
      expect(cluster1.activityEndedDate).toEqual(new Date("2025-01-01T10:10:00Z"));
      expect(cluster1.activityExperiencedDurationValue).toBe("PT10M");

      // Duration should continue rolling up to root (even with optimization)
      expect(root.activityStartTimestampUtc).toBe("2025-01-01T10:00:00Z");
      expect(root.activityEndedDate).toEqual(new Date("2025-01-01T10:10:00Z"));
      expect(root.activityExperiencedDurationValue).toBe("PT10M");
    });
  });

  describe("Test 5: Multiple Levels of Nesting", () => {
    it("should correctly rollup durations through multiple levels", () => {
      const root = new Activity("root", "Root");
      const cluster1 = new Activity("cluster1", "Cluster 1");
      const cluster2 = new Activity("cluster2", "Cluster 2");
      const leaf1 = new Activity("leaf1", "Leaf 1");
      const leaf2 = new Activity("leaf2", "Leaf 2");
      const leaf3 = new Activity("leaf3", "Leaf 3");

      root.addChild(cluster1);
      root.addChild(cluster2);
      cluster1.addChild(leaf1);
      cluster1.addChild(leaf2);
      cluster2.addChild(leaf3);

      // Set leaf durations
      leaf1.activityStartTimestampUtc = "2025-01-01T10:00:00Z";
      leaf1.activityEndedDate = new Date("2025-01-01T10:05:00Z");
      leaf1.activityExperiencedDuration = "PT5M0S";

      leaf2.activityStartTimestampUtc = "2025-01-01T10:03:00Z";
      leaf2.activityEndedDate = new Date("2025-01-01T10:08:00Z");
      leaf2.activityExperiencedDuration = "PT5M0S";

      leaf3.activityStartTimestampUtc = "2025-01-01T10:01:00Z";
      leaf3.activityEndedDate = new Date("2025-01-01T10:06:00Z");
      leaf3.activityExperiencedDuration = "PT6M0S";

      // Trigger rollup from leaf1 (should propagate all the way up)
      rollupProcess.overallRollupProcess(leaf1);

      // Check cluster1 (should aggregate leaf1 and leaf2)
      expect(cluster1.activityAbsoluteDurationValue).toBe("PT8M"); // 10:00 to 10:08
      expect(cluster1.activityExperiencedDurationValue).toBe("PT10M"); // 5+5

      // Trigger rollup from leaf3 to update cluster2
      rollupProcess.overallRollupProcess(leaf3);

      // Check cluster2 (should have leaf3's data)
      expect(cluster2.activityAbsoluteDurationValue).toBe("PT5M"); // 10:01 to 10:06
      expect(cluster2.activityExperiencedDurationValue).toBe("PT6M"); // 6

      // Check root (should aggregate from both clusters)
      // Root should span from earliest child (10:00 from cluster1) to latest (10:08 from cluster1)
      expect(root.activityAbsoluteDurationValue).toBe("PT8M");
      // Root's experienced duration should be sum of all descendants
      expect(root.activityExperiencedDurationValue).toBe("PT16M"); // 5+5+6
    });
  });

  describe("Test 6: Empty/Null Durations Handled Gracefully", () => {
    it("should handle children with no duration data", () => {
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      parent.addChild(child1);
      parent.addChild(child2);

      // child1 has no duration data
      // child2 has duration data
      child2.activityStartTimestampUtc = "2025-01-01T10:00:00Z";
      child2.activityEndedDate = new Date("2025-01-01T10:05:00Z");
      child2.activityExperiencedDuration = "PT5M0S";

      rollupProcess.overallRollupProcess(child1);

      // Parent should only use child2's data
      expect(parent.activityStartTimestampUtc).toBe("2025-01-01T10:00:00Z");
      expect(parent.activityEndedDate).toEqual(new Date("2025-01-01T10:05:00Z"));
      expect(parent.activityExperiencedDurationValue).toBe("PT5M");
    });

    it("should handle null timestamps gracefully", () => {
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      parent.addChild(child);

      // Child has experienced duration but no timestamps
      child.activityExperiencedDuration = "PT5M0S";

      rollupProcess.overallRollupProcess(child);

      // Parent should not crash, values should remain at defaults
      expect(parent.activityStartTimestampUtc).toBeNull();
      expect(parent.activityEndedDate).toBeNull();
      expect(parent.activityAbsoluteDurationValue).toBe("PT0H0M0S");
    });

    it("should handle empty duration strings", () => {
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      parent.addChild(child);

      child.activityStartTimestampUtc = "2025-01-01T10:00:00Z";
      child.activityEndedDate = new Date("2025-01-01T10:05:00Z");
      child.activityExperiencedDuration = "PT0H0M0S"; // Zero duration

      rollupProcess.overallRollupProcess(child);

      // Parent should still set timestamps but experienced duration should be zero
      expect(parent.activityStartTimestampUtc).toBe("2025-01-01T10:00:00Z");
      expect(parent.activityAbsoluteDurationValue).toBe("PT5M");
      expect(parent.activityExperiencedDurationValue).toBe("PT0S"); // Zero sum
    });
  });

  describe("Test 7: Attempt Filtering", () => {
    it("should only include children from same attempt in attempt duration", () => {
      const parent = new Activity("parent", "Parent");
      parent.attemptStartTimestampUtc = "2025-01-01T10:00:00Z";
      parent.attemptCount = 2;

      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      parent.addChild(child1);
      parent.addChild(child2);

      // child1 is from previous attempt (before parent's attempt start)
      child1.attemptStartTimestampUtc = "2025-01-01T09:00:00Z";
      child1.activityStartTimestampUtc = "2025-01-01T09:00:00Z";
      child1.activityEndedDate = new Date("2025-01-01T09:05:00Z");
      child1.attemptExperiencedDuration = "PT5M0S";
      child1.activityExperiencedDuration = "PT5M0S";

      // child2 is from current attempt (after parent's attempt start)
      child2.attemptStartTimestampUtc = "2025-01-01T10:01:00Z";
      child2.activityStartTimestampUtc = "2025-01-01T10:01:00Z";
      child2.activityEndedDate = new Date("2025-01-01T10:06:00Z");
      child2.attemptExperiencedDuration = "PT5M0S";
      child2.activityExperiencedDuration = "PT5M0S";

      rollupProcess.overallRollupProcess(child1);

      // Activity experienced duration should include both children
      expect(parent.activityExperiencedDurationValue).toBe("PT10M"); // 5+5

      // Attempt experienced duration should only include child2 (same attempt)
      expect(parent.attemptExperiencedDurationValue).toBe("PT5M"); // Only child2

      // Activity absolute duration should span from earliest to latest
      expect(parent.activityStartTimestampUtc).toBe("2025-01-01T09:00:00Z");
      expect(parent.activityAbsoluteDurationValue).toBe("PT1H6M"); // 09:00 to 10:06

      // Attempt absolute duration should only consider children in same attempt
      expect(parent.attemptAbsoluteDurationValue).toBe("PT6M"); // 10:00 to 10:06
    });
  });

  describe("Test 8: Edge Cases", () => {
    it("should handle cluster with single child", () => {
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      parent.addChild(child);

      child.activityStartTimestampUtc = "2025-01-01T10:00:00Z";
      child.activityEndedDate = new Date("2025-01-01T10:05:00Z");
      child.activityExperiencedDuration = "PT5M0S";

      rollupProcess.overallRollupProcess(child);

      // Parent should have same values as the single child
      expect(parent.activityStartTimestampUtc).toBe("2025-01-01T10:00:00Z");
      expect(parent.activityEndedDate).toEqual(new Date("2025-01-01T10:05:00Z"));
      expect(parent.activityAbsoluteDurationValue).toBe("PT5M");
      expect(parent.activityExperiencedDurationValue).toBe("PT5M");
    });

    it("should not rollup when parent has no children", () => {
      const parent = new Activity("parent", "Parent");

      rollupProcess.overallRollupProcess(parent);

      // Nothing should change
      expect(parent.activityStartTimestampUtc).toBeNull();
      expect(parent.activityEndedDate).toBeNull();
      expect(parent.activityAbsoluteDurationValue).toBe("PT0H0M0S");
    });

    it("should handle concurrent children (same start and end times)", () => {
      const parent = new Activity("parent", "Parent");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      parent.addChild(child1);
      parent.addChild(child2);

      // Both children run at exactly the same time
      const startTime = "2025-01-01T10:00:00Z";
      const endTime = new Date("2025-01-01T10:05:00Z");

      child1.activityStartTimestampUtc = startTime;
      child1.activityEndedDate = endTime;
      child1.activityExperiencedDuration = "PT5M0S";

      child2.activityStartTimestampUtc = startTime;
      child2.activityEndedDate = endTime;
      child2.activityExperiencedDuration = "PT5M0S";

      rollupProcess.overallRollupProcess(child1);

      // Absolute duration should be same as individual child (they overlap)
      expect(parent.activityAbsoluteDurationValue).toBe("PT5M");

      // Experienced duration should be sum (they're counted separately)
      expect(parent.activityExperiencedDurationValue).toBe("PT10M"); // 5+5
    });
  });

  describe("Test 9: Integration with Sequencing Controls", () => {
    it("should perform duration rollup regardless of sequencing controls", () => {
      const parent = new Activity("parent", "Parent");
      const child = new Activity("child", "Child");

      parent.addChild(child);

      // Disable all rollup controls
      const controls = new SequencingControls();
      controls.rollupObjectiveSatisfied = false;
      controls.rollupProgressCompletion = false;
      parent.sequencingControls = controls;

      child.activityStartTimestampUtc = "2025-01-01T10:00:00Z";
      child.activityEndedDate = new Date("2025-01-01T10:05:00Z");
      child.activityExperiencedDuration = "PT5M0S";

      rollupProcess.overallRollupProcess(child);

      // Duration rollup should happen even with controls disabled
      expect(parent.activityStartTimestampUtc).toBe("2025-01-01T10:00:00Z");
      expect(parent.activityEndedDate).toEqual(new Date("2025-01-01T10:05:00Z"));
      expect(parent.activityExperiencedDurationValue).toBe("PT5M");
    });
  });
});
