import { describe, it, expect, beforeEach } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingProcess, SequencingRequestType } from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";

describe("Retry Sequencing Request Process - Exception Handling (SB.2.10)", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;

  beforeEach(() => {
    activityTree = new ActivityTree();
  });

  describe("SB.2.10-1: Current activity not defined", () => {
    it("should return exception when no current activity exists", () => {
      const root = new Activity("root", "Root Activity");
      activityTree.root = root;
      sequencingProcess = new SequencingProcess(activityTree);

      // Ensure no current activity
      activityTree.currentActivity = null;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBe("SB.2.12-1"); // This is caught at SB.2.12 level
      expect(result.deliveryRequest).toBe("doNotDeliver");
      expect(result.targetActivity).toBeNull();
    });
  });

  describe("SB.2.10-2: Activity is still active or suspended", () => {
    it("should return SB.2.10-2 exception when activity is still active", () => {
      const root = new Activity("root", "Root Activity");
      const activity = new Activity("activity1", "Activity 1");
      root.addChild(activity);
      activityTree.root = root;
      activityTree.currentActivity = activity;
      sequencingProcess = new SequencingProcess(activityTree);

      // Set activity as active
      activity.isActive = true;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBe("SB.2.10-2");
      expect(result.deliveryRequest).toBe("doNotDeliver");
      expect(result.targetActivity).toBeNull();
    });

    it("should return SB.2.10-2 exception when activity is suspended", () => {
      const root = new Activity("root", "Root Activity");
      const activity = new Activity("activity1", "Activity 1");
      root.addChild(activity);
      activityTree.root = root;
      activityTree.currentActivity = activity;
      sequencingProcess = new SequencingProcess(activityTree);

      // Set activity as suspended
      activity.isSuspended = true;
      activity.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBe("SB.2.10-2");
      expect(result.deliveryRequest).toBe("doNotDeliver");
      expect(result.targetActivity).toBeNull();
    });
  });

  describe("SB.2.10-3: Flow subprocess returned false (nothing to deliver)", () => {
    it("should return SB.2.10-3 when retrying a cluster with no deliverable children", () => {
      const root = new Activity("root", "Root Activity");
      const cluster = new Activity("cluster", "Cluster Activity");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(cluster);
      cluster.addChild(child1);
      activityTree.root = root;
      activityTree.currentActivity = cluster;
      sequencingProcess = new SequencingProcess(activityTree);

      // Mark cluster as not active (required for retry)
      cluster.isActive = false;
      cluster.isSuspended = false;

      // Make child unavailable so flow subprocess fails
      child1.isAvailable = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBe("SB.2.10-3");
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });

    it("should return SB.2.10-3 when retrying a cluster with flow disabled", () => {
      const root = new Activity("root", "Root Activity");
      const cluster = new Activity("cluster", "Cluster Activity");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(cluster);
      cluster.addChild(child1);
      activityTree.root = root;
      activityTree.currentActivity = cluster;
      sequencingProcess = new SequencingProcess(activityTree);

      // Mark cluster as not active (required for retry)
      cluster.isActive = false;
      cluster.isSuspended = false;

      // Disable flow on cluster (prevents flow subprocess from finding child)
      cluster.sequencingControls.flow = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBe("SB.2.10-3");
      expect(result.deliveryRequest).toBe("doNotDeliver");
    });
  });

  describe("Successful retry scenarios", () => {
    it("should successfully retry a leaf activity", () => {
      const root = new Activity("root", "Root Activity");
      const activity = new Activity("activity1", "Activity 1");
      root.addChild(activity);
      activityTree.root = root;
      activityTree.currentActivity = activity;
      sequencingProcess = new SequencingProcess(activityTree);

      // Mark activity as completed (not active, not suspended)
      activity.isActive = false;
      activity.isSuspended = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBeNull();
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(activity);
    });

    it("should successfully retry a cluster with available children", () => {
      const root = new Activity("root", "Root Activity");
      const cluster = new Activity("cluster", "Cluster Activity");
      const child1 = new Activity("child1", "Child 1");

      root.addChild(cluster);
      cluster.addChild(child1);
      activityTree.root = root;
      activityTree.currentActivity = cluster;
      sequencingProcess = new SequencingProcess(activityTree);

      // Mark cluster as not active (required for retry)
      cluster.isActive = false;
      cluster.isSuspended = false;

      // Ensure flow is enabled and child is available
      cluster.sequencingControls.flow = true;
      child1.isAvailable = true;
      // Leaf activities should have flow = false
      child1.sequencingControls.flow = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBeNull();
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(child1); // Should deliver the child, not the cluster
    });
  });

  describe("Edge cases", () => {
    it("should handle retry when activity has been terminated", () => {
      const root = new Activity("root", "Root Activity");
      const activity = new Activity("activity1", "Activity 1");
      root.addChild(activity);
      activityTree.root = root;
      activityTree.currentActivity = activity;
      sequencingProcess = new SequencingProcess(activityTree);

      // Terminate activity (isActive = false is the result of termination)
      activity.isActive = false;
      activity.isSuspended = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBeNull();
      expect(result.deliveryRequest).toBe("deliver");
      expect(result.targetActivity).toBe(activity);
    });

    it("should handle retry when cluster has multiple children", () => {
      const root = new Activity("root", "Root Activity");
      const cluster = new Activity("cluster", "Cluster Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      root.addChild(cluster);
      cluster.addChild(child1);
      cluster.addChild(child2);
      activityTree.root = root;
      activityTree.currentActivity = cluster;
      sequencingProcess = new SequencingProcess(activityTree);

      // Mark cluster as not active
      cluster.isActive = false;
      cluster.isSuspended = false;

      // Enable flow on cluster, disable on leaves
      cluster.sequencingControls.flow = true;
      child1.isAvailable = true;
      child1.sequencingControls.flow = false;
      child2.isAvailable = true;
      child2.sequencingControls.flow = false;

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.RETRY);

      expect(result.exception).toBeNull();
      expect(result.deliveryRequest).toBe("deliver");
      // Should deliver first available child
      expect(result.targetActivity).toBe(child1);
    });
  });
});
