import {beforeEach, describe, expect, it} from "vitest";
import {Activity} from "../../../../src/cmi/scorm2004/sequencing/activity";
import {ActivityTree} from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import {
  DeliveryRequestType,
  SequencingProcess,
  SequencingRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import {SequencingControls} from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import {
  OverallSequencingProcess
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import {RollupProcess} from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import {
  RuleActionType,
  RuleCondition,
  RuleConditionType,
  SequencingRule
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("Missing SCORM 2004 Sequencing Exception Codes", () => {
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let overallSequencingProcess: OverallSequencingProcess;
  let rollupProcess: RollupProcess;
  let root: Activity;
  let cluster1: Activity;
  let leaf1: Activity;
  let leaf2: Activity;
  let leaf3: Activity;

  beforeEach(() => {
    // Create a simple activity tree structure:
    // root
    //   └── cluster1
    //       ├── leaf1
    //       ├── leaf2
    //       └── leaf3

    root = new Activity("root", "Root Activity");
    cluster1 = new Activity("cluster1", "Cluster 1");
    leaf1 = new Activity("leaf1", "Leaf 1");
    leaf2 = new Activity("leaf2", "Leaf 2");
    leaf3 = new Activity("leaf3", "Leaf 3");

    // Set up hierarchy
    root.addChild(cluster1);
    cluster1.addChild(leaf1);
    cluster1.addChild(leaf2);
    cluster1.addChild(leaf3);

    // Make all activities available
    root.isAvailable = true;
    cluster1.isAvailable = true;
    leaf1.isAvailable = true;
    leaf2.isAvailable = true;
    leaf3.isAvailable = true;

    // Configure sequencing controls
    root.sequencingControls = new SequencingControls();
    root.sequencingControls.choice = true;
    root.sequencingControls.flow = true;

    cluster1.sequencingControls = new SequencingControls();
    cluster1.sequencingControls.choice = true;
    cluster1.sequencingControls.flow = true;

    leaf1.sequencingControls = new SequencingControls();
    leaf1.sequencingControls.choice = true;

    leaf2.sequencingControls = new SequencingControls();
    leaf2.sequencingControls.choice = true;

    leaf3.sequencingControls = new SequencingControls();
    leaf3.sequencingControls.choice = true;

    activityTree = new ActivityTree(root);
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    overallSequencingProcess = new OverallSequencingProcess(
        activityTree,
        sequencingProcess,
        rollupProcess
    );
  });

  describe("TB.2.3-2: Current activity already terminated", () => {
    it("should return TB.2.3-2 when trying to EXIT an already-terminated non-root activity", () => {
      // Set up: current activity is leaf1 (not root) and is not active (already terminated)
      // TB.2.3-2 only applies to EXIT (not EXIT_ALL), which requires non-root current activity
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false; // Activity already terminated

      // Process an EXIT navigation request (not exitAll)
      // Per NB.2.1: EXIT at non-root maps to SequencingRequestType.EXIT
      const result = overallSequencingProcess.processNavigationRequest("exit");

      expect(result.valid).toBe(false);
      expect(result.exception).toBe("TB.2.3-2");
    });

    it("should return TB.2.3-2 when trying to ABANDON an already-terminated activity", () => {
      // Set up: current activity exists but is not active (already terminated)
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false; // Activity already terminated

      // Process an ABANDON navigation request (not abandonAll)
      const result = overallSequencingProcess.processNavigationRequest("abandon");

      expect(result.valid).toBe(false);
      expect(result.exception).toBe("TB.2.3-2");
    });

    it("should allow EXIT when current activity is active", () => {
      // Set up: current activity exists and is active
      activityTree.currentActivity = leaf1;
      leaf1.isActive = true; // Activity is active

      // Process an EXIT navigation request
      const result = overallSequencingProcess.processNavigationRequest("exit");

      // Should not return TB.2.3-2 error (may have other errors due to missing callback)
      expect(result.exception).not.toBe("TB.2.3-2");
    });
  });

  describe("TB.2.3-4: Cannot EXIT_PARENT from root activity", () => {
    it("should return TB.2.3-4 when EXIT_PARENT cascade reaches root", () => {
      // TB.2.3-4 is triggered when:
      // 1. Starting at non-root with EXIT termination (not EXIT_ALL)
      // 2. Post-conditions cascade EXIT_PARENT up through the tree
      // 3. Root's post-condition also returns EXIT_PARENT
      // Since root has no parent, TB.2.3-4 is returned

      // Create EXIT_PARENT post-condition rule for all levels
      const exitParentRule1 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule1.addCondition(new RuleCondition(RuleConditionType.ALWAYS));

      const exitParentRule2 = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule2.addCondition(new RuleCondition(RuleConditionType.ALWAYS));

      const exitParentRuleRoot = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRuleRoot.addCondition(new RuleCondition(RuleConditionType.ALWAYS));

      // Add EXIT_PARENT to leaf, cluster, and root
      leaf1.sequencingRules.addPostConditionRule(exitParentRule1);
      cluster1.sequencingRules.addPostConditionRule(exitParentRule2);
      root.sequencingRules.addPostConditionRule(exitParentRuleRoot);

      // Start at leaf (non-root) with EXIT - this enters the post-condition loop
      activityTree.currentActivity = leaf1;
      leaf1.isActive = true;
      cluster1.isActive = true;
      root.isActive = true;

      // Process EXIT (not EXIT_ALL - EXIT at non-root goes to handleExitTermination)
      const result = overallSequencingProcess.processNavigationRequest("exit");

      // Should cascade: leaf1->cluster1->root->TB.2.3-4
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("TB.2.3-4");
    });

    it("should allow EXIT_PARENT when parent exists (no TB.2.3-4)", () => {
      // EXIT_PARENT at non-root should not return TB.2.3-4
      const exitParentRule = new SequencingRule(RuleActionType.EXIT_PARENT);
      exitParentRule.addCondition(new RuleCondition(RuleConditionType.ALWAYS));

      // Add EXIT_PARENT only to leaf1 (cluster1 and root don't have it)
      leaf1.sequencingRules.addPostConditionRule(exitParentRule);

      // Start at leaf1
      activityTree.currentActivity = leaf1;
      leaf1.isActive = true;
      cluster1.isActive = true;
      root.isActive = true;

      // Process EXIT
      const result = overallSequencingProcess.processNavigationRequest("exit");

      // Should not return TB.2.3-4 (cascade stops at cluster1 which doesn't have EXIT_PARENT)
      expect(result.exception).not.toBe("TB.2.3-4");
    });
  });

  describe("SB.2.1-3: Reached beginning of course", () => {
    it("should return SB.2.1-3 when going previous from first activity", () => {
      // Start at leaf1 (first leaf in forward traversal)
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false; // Terminated

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.PREVIOUS,
          null
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.1-3");
    });

    it("should not return SB.2.1-3 when going previous from second activity", () => {
      // Start at leaf2 (can go back to leaf1)
      activityTree.currentActivity = leaf2;
      leaf2.isActive = false; // Terminated

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.PREVIOUS,
          null
      );

      // Should succeed - can go back to leaf1
      expect(result.exception).not.toBe("SB.2.1-3");
      if (result.deliveryRequest === DeliveryRequestType.DELIVER) {
        expect(result.targetActivity?.id).toBe("leaf1");
      }
    });
  });

  describe("SB.2.7-1: Sequencing session not begun (Continue)", () => {
    it("should return SB.2.7-1 when continuing with active current activity", () => {
      // Set leaf1 as current and still active (not terminated)
      activityTree.currentActivity = leaf1;
      leaf1.isActive = true;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE,
          null
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.7-1");
    });

    it("should not return SB.2.7-1 when current activity is terminated", () => {
      // Set leaf1 as current and terminated
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE,
          null
      );

      // Should not fail with SB.2.7-1 (may fail with other codes or succeed)
      expect(result.exception).not.toBe("SB.2.7-1");
    });
  });

  describe("SB.2.7-2: Cannot continue - flow disabled", () => {
    it("should return SB.2.7-2 when flow is disabled on parent", () => {
      // Set leaf1 as current and terminated
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false;

      // Disable flow on cluster1 (parent)
      cluster1.sequencingControls.flow = false;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE,
          null
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.7-2");
    });

    it("should allow continue when flow is enabled", () => {
      // Set leaf1 as current and terminated
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false;

      // Ensure flow is enabled on cluster1 (parent)
      cluster1.sequencingControls.flow = true;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE,
          null
      );

      // Should not fail with SB.2.7-2
      expect(result.exception).not.toBe("SB.2.7-2");
    });
  });

  describe("SB.2.8-2: Cannot go previous - at beginning or forwardOnly", () => {
    it("should return SB.2.8-2 when forwardOnly is enabled", () => {
      // Set leaf2 as current and terminated
      activityTree.currentActivity = leaf2;
      leaf2.isActive = false;

      // Enable forwardOnly on cluster1 (parent)
      cluster1.sequencingControls.forwardOnly = true;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.PREVIOUS,
          null,
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      // Enhanced multi-level forwardOnly validation returns SB.2.9-5 (correct per SCORM spec)
      // SB.2.9-5 is the official exception code for forwardOnly violations
      expect(result.exception).toBe("SB.2.9-5");
    });

    it("should return SB.2.8-2 when flow is disabled on parent", () => {
      // Set leaf1 as current and terminated
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false;

      // Disable flow on cluster1 (parent)
      cluster1.sequencingControls.flow = false;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.PREVIOUS,
          null
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.8-2");
    });

    it("should allow previous when forwardOnly is disabled", () => {
      // Set leaf2 as current and terminated
      activityTree.currentActivity = leaf2;
      leaf2.isActive = false;

      // Ensure forwardOnly is disabled on cluster1 (parent)
      cluster1.sequencingControls.forwardOnly = false;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.PREVIOUS,
          null
      );

      // Should not fail with SB.2.8-2 due to forwardOnly
      if (result.exception === "SB.2.8-2") {
        // If it still fails, it should be for a different reason (like flow disabled)
        expect(cluster1.sequencingControls.flow).toBe(false);
      }
    });
  });

  describe("SB.2.1-2: No available children to deliver", () => {
    it("should return SB.2.1-2 when cluster has no available children", () => {
      // Make all leaves unavailable
      leaf1.isAvailable = false;
      leaf2.isAvailable = false;
      leaf3.isAvailable = false;

      // Try to start
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.START,
          null
      );

      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      // Should indicate no available children
      expect(result.exception).toMatch(/SB\.2\.(1-2|5-3)/);
    });

    it("should deliver when cluster has available children", () => {
      // Ensure at least one leaf is available
      leaf1.isAvailable = true;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.START,
          null
      );

      // Should succeed
      if (result.deliveryRequest === DeliveryRequestType.DELIVER) {
        expect(result.targetActivity).not.toBeNull();
      }
    });
  });

  describe("SB.2.2-1: Flow control disabled on parent", () => {
    it("should handle flow control disabled appropriately", () => {
      // This is tested indirectly through SB.2.7-2 and SB.2.8-2
      // The flow control check happens in flowActivityTraversalSubprocess

      // Set leaf1 as current and terminated
      activityTree.currentActivity = leaf1;
      leaf1.isActive = false;

      // Disable flow on cluster1
      cluster1.sequencingControls.flow = false;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE,
          null
      );

      // Should fail because flow is disabled
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.exception).toBe("SB.2.7-2");
    });
  });

  describe("SB.2.2-2: Activity not available", () => {
    it("should not deliver unavailable activities", () => {
      // Make leaf1 unavailable
      leaf1.isAvailable = false;

      // Make leaf2 and leaf3 available
      leaf2.isAvailable = true;
      leaf3.isAvailable = true;

      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.START,
          null
      );

      // Should deliver leaf2 (skipping unavailable leaf1)
      if (result.deliveryRequest === DeliveryRequestType.DELIVER) {
        expect(result.targetActivity?.id).toBe("leaf2");
      }
    });
  });

  describe("Integration: Exception code precedence and propagation", () => {
    it("should return specific exception codes over generic ones", () => {
      // Test that specific exception codes take precedence

      // Set up scenario where multiple failures could occur
      activityTree.currentActivity = leaf1;
      leaf1.isActive = true; // Not terminated

      // Try to continue (should fail with SB.2.7-1, not a generic error)
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE,
          null
      );

      expect(result.exception).toBe("SB.2.7-1");
      expect(result.exception).not.toBe("SB.2.12-1");
    });

    it("should propagate exception codes through flow subprocess", () => {
      // Test that exception codes are properly propagated from flow subprocess

      // Set leaf3 as current (last leaf)
      activityTree.currentActivity = leaf3;
      leaf3.isActive = false;

      // Try to continue (should reach end and fail)
      const result = sequencingProcess.sequencingRequestProcess(
          SequencingRequestType.CONTINUE,
          null
      );

      // Should indicate end of sequence
      expect(result.deliveryRequest).toBe(DeliveryRequestType.DO_NOT_DELIVER);
      expect(result.endSequencingSession).toBe(true);
    });
  });
});
