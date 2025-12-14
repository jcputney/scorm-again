import { describe, it, expect, beforeEach } from "vitest";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  SequencingProcess,
  SequencingRequestType,
  DeliveryRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";

describe("Navigation Validity - Complex Activity States", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;

  beforeEach(() => {
    activityTree = new ActivityTree();
  });

  describe("Multi-level forwardOnly validation", () => {
    it("should detect forwardOnly violation at root level", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.forwardOnly = true;
      root.sequencingControls.flow = true;

      const activityA = new Activity("a", "Activity A", false);
      const activityB = new Activity("b", "Activity B", false);
      const activityC = new Activity("c", "Activity C", false);

      root.addChild(activityA);
      root.addChild(activityB);
      root.addChild(activityC);

      activityTree.root = root;
      activityTree.currentActivity = activityB;
      activityB.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.exception).toBe("SB.2.9-5");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should detect forwardOnly violation at intermediate level", () => {
      const root = new Activity("root", "Root", false);
      const cluster = new Activity("cluster", "Cluster", false);
      cluster.sequencingControls = new SequencingControls();
      cluster.sequencingControls.forwardOnly = true;
      cluster.sequencingControls.flow = true;

      const activityA = new Activity("a", "Activity A", false);
      const activityB = new Activity("b", "Activity B", false);
      const activityC = new Activity("c", "Activity C", false);

      root.addChild(cluster);
      cluster.addChild(activityA);
      cluster.addChild(activityB);
      cluster.addChild(activityC);

      activityTree.root = root;
      activityTree.currentActivity = activityB;
      activityB.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.exception).toBe("SB.2.9-5");
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
    });

    it("should handle mixed forwardOnly settings across levels", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.forwardOnly = false;

      const cluster = new Activity("cluster", "Cluster", false);
      cluster.sequencingControls = new SequencingControls();
      cluster.sequencingControls.forwardOnly = true;
      cluster.sequencingControls.flow = true;

      const activityA = new Activity("a", "Activity A", false);
      const activityB = new Activity("b", "Activity B", false);

      root.addChild(cluster);
      cluster.addChild(activityA);
      cluster.addChild(activityB);

      activityTree.root = root;
      activityTree.currentActivity = activityB;
      activityB.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.exception).toBe("SB.2.9-5");
    });

    it("should allow backward navigation when no forwardOnly constraints exist", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.flow = true;

      const activityA = new Activity("a", "Activity A", false);
      const activityB = new Activity("b", "Activity B", false);

      root.addChild(activityA);
      root.addChild(activityB);

      activityTree.root = root;
      activityTree.currentActivity = activityB;
      activityB.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity).toBe(activityA);
      expect(result.exception).toBeNull();
    });
  });

  describe("Complex choice path validation", () => {
    it("should validate choice path crossing multiple clusters", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.choice = true;

      const clusterA = new Activity("clusterA", "Cluster A", false);
      clusterA.sequencingControls = new SequencingControls();
      clusterA.sequencingControls.choice = true;

      const clusterB = new Activity("clusterB", "Cluster B", false);
      clusterB.sequencingControls = new SequencingControls();
      clusterB.sequencingControls.choice = true;

      const a1 = new Activity("a1", "A1", false);
      const a2 = new Activity("a2", "A2", false);
      const b1 = new Activity("b1", "B1", false);
      const b2 = new Activity("b2", "B2", false);

      root.addChild(clusterA);
      root.addChild(clusterB);
      clusterA.addChild(a1);
      clusterA.addChild(a2);
      clusterB.addChild(b1);
      clusterB.addChild(b2);

      activityTree.root = root;
      activityTree.currentActivity = a2;
      a2.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "b1",
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("b1");
    });

    it("should reject choice when forwardOnly is set at intermediate level", () => {
      const root = new Activity("root", "Root", false);
      const cluster = new Activity("cluster", "Cluster", false);
      cluster.sequencingControls = new SequencingControls();
      cluster.sequencingControls.choice = true;
      cluster.sequencingControls.forwardOnly = true;

      const a = new Activity("a", "A", false);
      const b = new Activity("b", "B", false);
      const c = new Activity("c", "C", false);

      root.addChild(cluster);
      cluster.addChild(a);
      cluster.addChild(b);
      cluster.addChild(c);

      activityTree.root = root;
      activityTree.currentActivity = c;
      c.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "a",
      );

      expect(result.exception).toBe("SB.2.9-5");
    });

    it("should handle constrainChoice at multiple levels", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.constrainChoice = true;

      const clusterA = new Activity("clusterA", "Cluster A", false);
      clusterA.sequencingControls = new SequencingControls();
      clusterA.sequencingControls.constrainChoice = true;
      clusterA.sequencingControls.choice = true;

      const a1 = new Activity("a1", "A1", false);
      const a2 = new Activity("a2", "A2", false);
      const a3 = new Activity("a3", "A3", false);

      root.addChild(clusterA);
      clusterA.addChild(a1);
      clusterA.addChild(a2);
      clusterA.addChild(a3);

      activityTree.root = root;
      activityTree.currentActivity = a1;
      a1.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "a3",
      );

      expect(result.exception).toBe("SB.2.9-7");
    });

    it("should handle preventActivation with complex tree structure", () => {
      const root = new Activity("root", "Root", false);
      const cluster = new Activity("cluster", "Cluster", false);
      cluster.sequencingControls = new SequencingControls();
      cluster.sequencingControls.preventActivation = true;
      cluster.sequencingControls.choice = true;

      const a = new Activity("a", "A", false);
      const b = new Activity("b", "B", false);
      a.attemptCount = 1;
      b.attemptCount = 0;

      root.addChild(cluster);
      cluster.addChild(a);
      cluster.addChild(b);

      activityTree.root = root;
      activityTree.currentActivity = a;
      a.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "b",
      );

      expect(result.exception).toBe("SB.2.9-6");
    });
  });

  describe("Navigation request pre-validation", () => {
    it("should pre-validate and catch invalid CONTINUE request early", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.flow = false;

      const a = new Activity("a", "A", false);
      root.addChild(a);

      activityTree.root = root;
      activityTree.currentActivity = a;
      a.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const validation = sequencingProcess.validateNavigationRequest(
        SequencingRequestType.CONTINUE,
        null,
        a,
      );

      expect(validation.valid).toBe(false);
      expect(validation.exception).toBe("SB.2.7-2");
    });

    it("should pre-validate and catch forwardOnly violation for PREVIOUS", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.flow = true;
      root.sequencingControls.forwardOnly = true;

      const a = new Activity("a", "A", false);
      const b = new Activity("b", "B", false);

      root.addChild(a);
      root.addChild(b);

      activityTree.root = root;
      activityTree.currentActivity = b;
      b.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const validation = sequencingProcess.validateNavigationRequest(
        SequencingRequestType.PREVIOUS,
        null,
        b,
      );

      expect(validation.valid).toBe(false);
      expect(validation.exception).toBe("SB.2.9-5");
    });

    it("should pre-validate choice to non-existent activity", () => {
      const root = new Activity("root", "Root", false);
      const a = new Activity("a", "A", false);

      root.addChild(a);

      activityTree.root = root;
      activityTree.currentActivity = a;

      sequencingProcess = new SequencingProcess(activityTree);

      const validation = sequencingProcess.validateNavigationRequest(
        SequencingRequestType.CHOICE,
        "nonexistent",
        a,
      );

      expect(validation.valid).toBe(false);
      expect(validation.exception).toBe("SB.2.9-1");
    });

    it("should validate successfully for valid navigation request", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.flow = true;

      const a = new Activity("a", "A", false);
      const b = new Activity("b", "B", false);

      root.addChild(a);
      root.addChild(b);

      activityTree.root = root;
      activityTree.currentActivity = a;
      a.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const validation = sequencingProcess.validateNavigationRequest(
        SequencingRequestType.CONTINUE,
        null,
        a,
      );

      expect(validation.valid).toBe(true);
      expect(validation.exception).toBeNull();
    });
  });

  describe("Edge cases", () => {
    it("should handle deeply nested activities (4+ levels)", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.forwardOnly = true;
      root.sequencingControls.flow = true;

      const l1 = new Activity("l1", "Level 1", false);
      l1.sequencingControls = new SequencingControls();
      l1.sequencingControls.forwardOnly = true;
      l1.sequencingControls.flow = true;

      const l2 = new Activity("l2", "Level 2", false);
      l2.sequencingControls = new SequencingControls();
      l2.sequencingControls.flow = true;

      const l3a = new Activity("l3a", "Level 3A", false);
      const l3b = new Activity("l3b", "Level 3B", false);

      root.addChild(l1);
      l1.addChild(l2);
      l2.addChild(l3a);
      l2.addChild(l3b);

      activityTree.root = root;
      activityTree.currentActivity = l3b;
      l3b.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(SequencingRequestType.PREVIOUS);

      expect(result.exception).toBe("SB.2.9-5");
    });

    it("should handle choice to sibling of ancestor", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.choice = true;

      const clusterA = new Activity("clusterA", "Cluster A", false);
      clusterA.sequencingControls = new SequencingControls();
      clusterA.sequencingControls.choice = true;

      const clusterB = new Activity("clusterB", "Cluster B", false);
      clusterB.sequencingControls = new SequencingControls();
      clusterB.sequencingControls.choice = true;

      const a1 = new Activity("a1", "A1", false);
      const a2 = new Activity("a2", "A2", false);
      const b1 = new Activity("b1", "B1", false);

      root.addChild(clusterA);
      root.addChild(clusterB);
      clusterA.addChild(a1);
      clusterA.addChild(a2);
      clusterB.addChild(b1);

      activityTree.root = root;
      activityTree.currentActivity = a2;
      a2.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "b1",
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("b1");
    });

    it("should return correct exception codes at each validation level", () => {
      const root = new Activity("root", "Root", false);
      const a = new Activity("a", "A", false);

      root.addChild(a);

      activityTree.root = root;

      sequencingProcess = new SequencingProcess(activityTree);

      const validation1 = sequencingProcess.validateNavigationRequest(
        SequencingRequestType.CHOICE,
        "root",
        null,
      );
      expect(validation1.exception).toBe("SB.2.9-3");

      a.isHiddenFromChoice = true;
      const validation2 = sequencingProcess.validateNavigationRequest(
        SequencingRequestType.CHOICE,
        "a",
        null,
      );
      expect(validation2.exception).toBe("SB.2.9-4");
    });

    it("should handle Continue/Previous across forwardOnly boundaries", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.flow = true;

      const cluster = new Activity("cluster", "Cluster", false);
      cluster.sequencingControls = new SequencingControls();
      cluster.sequencingControls.flow = true;
      cluster.sequencingControls.forwardOnly = true;

      const a = new Activity("a", "A", false);
      const b = new Activity("b", "B", false);

      root.addChild(cluster);
      cluster.addChild(a);
      cluster.addChild(b);

      activityTree.root = root;
      activityTree.currentActivity = b;
      b.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const prevResult = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.PREVIOUS,
      );
      expect(prevResult.exception).toBe("SB.2.9-5");

      activityTree.currentActivity = a;
      a.isActive = false;
      const contResult = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CONTINUE,
      );
      expect(contResult.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(contResult.targetActivity).toBe(b);
    });
  });

  describe("Cross-cluster navigation", () => {
    it("should properly handle forwardOnly when navigating across clusters", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.choice = true;

      const clusterA = new Activity("clusterA", "Cluster A", false);
      clusterA.sequencingControls = new SequencingControls();
      clusterA.sequencingControls.choice = true;
      clusterA.sequencingControls.forwardOnly = true;

      const clusterB = new Activity("clusterB", "Cluster B", false);
      clusterB.sequencingControls = new SequencingControls();
      clusterB.sequencingControls.choice = true;

      const a1 = new Activity("a1", "A1", false);
      const a2 = new Activity("a2", "A2", false);
      const b1 = new Activity("b1", "B1", false);
      const b2 = new Activity("b2", "B2", false);

      root.addChild(clusterA);
      root.addChild(clusterB);
      clusterA.addChild(a1);
      clusterA.addChild(a2);
      clusterB.addChild(b1);
      clusterB.addChild(b2);

      activityTree.root = root;
      activityTree.currentActivity = b1;
      b1.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "a1",
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DELIVER);
      expect(result.targetActivity?.id).toBe("a1");
    });

    it("should validate constraints when navigating between nested clusters", () => {
      const root = new Activity("root", "Root", false);
      root.sequencingControls = new SequencingControls();
      root.sequencingControls.choice = true;

      const clusterA = new Activity("clusterA", "Cluster A", false);
      clusterA.sequencingControls = new SequencingControls();
      clusterA.sequencingControls.choice = true;

      const clusterB = new Activity("clusterB", "Cluster B", false);
      clusterB.sequencingControls = new SequencingControls();
      clusterB.sequencingControls.choice = true;
      clusterB.sequencingControls.constrainChoice = true;

      const b1 = new Activity("b1", "B1", false);
      const b2 = new Activity("b2", "B2", false);
      const b3 = new Activity("b3", "B3", false);
      const a2 = new Activity("a2", "A2", false);

      root.addChild(clusterA);
      clusterA.addChild(clusterB);
      clusterA.addChild(a2);
      clusterB.addChild(b1);
      clusterB.addChild(b2);
      clusterB.addChild(b3);

      activityTree.root = root;
      activityTree.currentActivity = b1;
      b1.isActive = false;

      sequencingProcess = new SequencingProcess(activityTree);

      const result = sequencingProcess.sequencingRequestProcess(
        SequencingRequestType.CHOICE,
        "b3",
      );

      expect(result.exception).toBe("SB.2.9-7");
    });
  });
});
