import { describe, it, expect, beforeEach } from "vitest";
import {
  OverallSequencingProcess,
  NavigationRequestType,
  NavigationRequestResult,
  DeliveryRequest,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import {
  SequencingProcess,
  SequencingRequestType,
  SequencingResult,
  DeliveryRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";
import {
  SelectionTiming,
  RandomizationTiming,
  SequencingControls,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import { SequencingRules } from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("Overall Sequencing Process (OP.1)", () => {
  let overallProcess: OverallSequencingProcess;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let adlNav: ADLNav;
  let root: Activity;
  let child1: Activity;
  let child2: Activity;
  let grandchild1: Activity;
  let grandchild2: Activity;

  beforeEach(() => {
    // Create activity tree
    activityTree = new ActivityTree();
    root = new Activity("root", "Course");
    child1 = new Activity("module1", "Module 1");
    child2 = new Activity("module2", "Module 2");
    grandchild1 = new Activity("lesson1", "Lesson 1");
    grandchild2 = new Activity("lesson2", "Lesson 2");

    root.addChild(child1);
    root.addChild(child2);
    child1.addChild(grandchild1);
    child1.addChild(grandchild2);
    
    activityTree.root = root;

    // Enable flow for traversal (only on clusters, not leaves)
    root.sequencingControls.flow = true;
    child1.sequencingControls.flow = true;
    // child2 has no children, so it's a leaf and should NOT have flow=true
    // grandchild1 and grandchild2 are leaves, should NOT have flow=true (GAP-15)

    // Initialize sequencing components
    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    adlNav = new ADLNav();

    overallProcess = new OverallSequencingProcess(
      activityTree,
      sequencingProcess,
      rollupProcess,
      adlNav
    );
  });

  describe("processNavigationRequest", () => {
    describe("START navigation", () => {
      it("should successfully start a new session", () => {
        const result = overallProcess.processNavigationRequest(NavigationRequestType.START);
        
        expect(result.valid).toBe(true);
        expect(result.targetActivity).toBeDefined();
        expect(result.targetActivity).toBe(grandchild1); // Should flow to first leaf
        expect(result.exception).toBeNull();
      });

      it("should fail START if session already started", () => {
        activityTree.currentActivity = grandchild1;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.START);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-1");
      });
    });

    describe("RESUME_ALL navigation", () => {
      it("should successfully resume a suspended session", () => {
        grandchild1.isSuspended = true;
        activityTree.suspendedActivity = grandchild1;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);
        
        expect(result.valid).toBe(true);
        expect(result.targetActivity).toBe(grandchild1);
      });

      it("should fail RESUME_ALL if no suspended activity", () => {
        const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-3");
      });

      it("should fail RESUME_ALL if current activity exists", () => {
        activityTree.currentActivity = grandchild1;
        activityTree.suspendedActivity = grandchild2;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-2");
      });
    });

    describe("CONTINUE navigation", () => {
      it("should successfully continue to next activity", () => {
        activityTree.currentActivity = grandchild1;
        grandchild1.isActive = false; // Terminated
        child1.sequencingControls.flow = true;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
        
        expect(result.valid).toBe(true);
        expect(result.targetActivity).toBe(grandchild2);
      });

      it("should fail CONTINUE if no current activity", () => {
        const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-4");
      });

      it("should fail CONTINUE if parent flow is false", () => {
        activityTree.currentActivity = grandchild1;
        child1.sequencingControls.flow = false;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-5");
      });
    });

    describe("PREVIOUS navigation", () => {
      it("should successfully go to previous activity", () => {
        activityTree.currentActivity = grandchild2;
        grandchild2.isActive = false; // Terminated
        child1.sequencingControls.flow = true;
        child1.sequencingControls.forwardOnly = false;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.PREVIOUS);
        
        expect(result.valid).toBe(true);
        expect(result.targetActivity).toBe(grandchild1);
      });

      it("should fail PREVIOUS if forwardOnly is true", () => {
        activityTree.currentActivity = grandchild2;
        child1.sequencingControls.flow = true;
        child1.sequencingControls.forwardOnly = true;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.PREVIOUS);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-8");
      });
    });

    describe("CHOICE navigation", () => {
      it("should successfully choose target activity", () => {
        activityTree.currentActivity = grandchild1;
        grandchild1.isActive = false; // Terminated
        root.sequencingControls.choice = true;
        child1.sequencingControls.choice = true;
        
        const result = overallProcess.processNavigationRequest(
          NavigationRequestType.CHOICE,
          "lesson2"
        );
        
        expect(result.valid).toBe(true);
        expect(result.targetActivity).toBe(grandchild2);
      });

      it("should fail CHOICE without target", () => {
        const result = overallProcess.processNavigationRequest(NavigationRequestType.CHOICE);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-9");
      });

      it("should fail CHOICE if target doesn't exist", () => {
        const result = overallProcess.processNavigationRequest(
          NavigationRequestType.CHOICE,
          "nonexistent"
        );
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-10");
      });

      it("should fail CHOICE if common ancestor doesn't allow choice", () => {
        activityTree.currentActivity = grandchild1;
        child1.sequencingControls.choice = false;
        
        const result = overallProcess.processNavigationRequest(
          NavigationRequestType.CHOICE,
          "lesson2"
        );
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-11");
      });
    });

    describe("EXIT navigation", () => {
      it("should successfully exit current activity", () => {
        activityTree.currentActivity = grandchild1;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);
        
        expect(result.valid).toBe(true);
        expect(result.exception).toBeNull();
      });

      it("should convert to EXIT_ALL if at root", () => {
        activityTree.currentActivity = root;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);
        
        expect(result.valid).toBe(true);
        // The termination request should be EXIT_ALL
      });

      it("should fail EXIT if no current activity", () => {
        const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-13");
      });
    });

    describe("ABANDON navigation", () => {
      it("should successfully abandon current activity", () => {
        activityTree.currentActivity = grandchild1;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.ABANDON);
        
        expect(result.valid).toBe(true);
      });

      it("should fail ABANDON if no current activity", () => {
        const result = overallProcess.processNavigationRequest(NavigationRequestType.ABANDON);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-15");
      });
    });

    describe("SUSPEND_ALL navigation", () => {
      it("should successfully suspend all activities", () => {
        activityTree.currentActivity = grandchild1;
        
        const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);
        
        expect(result.valid).toBe(true);
      });

      it("should fail SUSPEND_ALL if no current activity", () => {
        const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);
        
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-17");
      });
    });
  });

  describe("Integration with sub-processes", () => {
    it("should properly chain through NB.2.1 → TB.2.3 → SB.2.12 → DB.1.1 → DB.2", () => {
      // Start navigation should flow through all processes
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);
      
      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBeDefined();
      expect(overallProcess.hasContentBeenDelivered()).toBe(true);
    });

    it("should handle termination during navigation", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = true;
      child1.sequencingControls.flow = true;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
      
      // Should terminate current activity and deliver next
      expect(result.valid).toBe(true);
      expect(grandchild1.isActive).toBe(false);
    });

    it("should clear suspended activity when delivering different activity", () => {
      grandchild1.isSuspended = true;
      activityTree.suspendedActivity = grandchild1;
      activityTree.currentActivity = null;
      
      // Choose a different activity
      root.sequencingControls.choice = true;
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.CHOICE,
        "module2"
      );
      
      expect(result.valid).toBe(true);
      expect(grandchild1.isSuspended).toBe(false);
      expect(activityTree.suspendedActivity).toBeNull();
    });

    it("should update ADL navigation validity after delivery", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);
      
      expect(result.valid).toBe(true);
      // ADL nav request validity should be updated
      // Note: Due to readonly constraints, we can't directly test the values
    });
  });

  describe("Persisted selection/randomization state", () => {
    it("should resume suspended leaf within pre-selected cluster", () => {
      const customTree = new ActivityTree();
      const customRoot = new Activity("root", "Root");

      const cluster = new Activity("cluster", "Cluster");
      const childVisible = new Activity("childVisible", "Visible Leaf");
      const childHidden = new Activity("childHidden", "Hidden Leaf");

      customRoot.sequencingControls.flow = true;
      customRoot.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      customRoot.sequencingControls.selectCount = 1;
      customRoot.sequencingControls.selectionCountStatus = true;
      customRoot.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      customRoot.sequencingControls.randomizeChildren = true;
      customRoot.sequencingControls.reorderChildren = true;
      customRoot.sequencingControls.choice = true;

      cluster.sequencingControls.flow = true;
      cluster.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      cluster.sequencingControls.selectCount = 1;
      cluster.sequencingControls.selectionCountStatus = true;
      cluster.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      cluster.sequencingControls.randomizeChildren = true;
      cluster.sequencingControls.reorderChildren = true;
      cluster.sequencingControls.choice = true;

      cluster.addChild(childVisible);
      cluster.addChild(childHidden);
      customRoot.addChild(cluster);

      customRoot.setChildOrder(["cluster"]);
      cluster.setChildOrder(["childVisible", "childHidden"]);

      cluster.setProcessedChildren([childVisible]);
      customRoot.setProcessedChildren([cluster]);

      childVisible.isHiddenFromChoice = false;
      childVisible.isAvailable = true;
      childHidden.isHiddenFromChoice = true;
      childHidden.isAvailable = false;
      cluster.isHiddenFromChoice = false;
      cluster.isAvailable = true;

      childVisible.isSuspended = true;
      customTree.root = customRoot;

      const customSequencingProcess = new SequencingProcess(
        customTree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav(),
      );
      const customOverall = new OverallSequencingProcess(
        customTree,
        customSequencingProcess,
        new RollupProcess(),
        new ADLNav(),
      );

      customTree.suspendedActivity = childVisible;
      customTree.currentActivity = null;

      const resumeResult = customOverall.processNavigationRequest(NavigationRequestType.RESUME_ALL);

      expect(resumeResult.valid).toBe(true);
      expect(resumeResult.targetActivity).toBe(childVisible);
      expect(cluster.getAvailableChildren().map((child) => child.id)).toEqual(["childVisible"]);
    });

    it("should enforce selection visibility for CHOICE navigation after restore", () => {
      const customTree = new ActivityTree();
      const customRoot = new Activity("root", "Root");

      const cluster = new Activity("cluster", "Cluster");
      const childVisible = new Activity("childVisible", "Visible Leaf");
      const childHidden = new Activity("childHidden", "Hidden Leaf");

      customRoot.sequencingControls.flow = true;
      customRoot.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      customRoot.sequencingControls.selectCount = 1;
      customRoot.sequencingControls.selectionCountStatus = true;
      customRoot.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      customRoot.sequencingControls.randomizeChildren = true;
      customRoot.sequencingControls.reorderChildren = true;
      customRoot.sequencingControls.choice = true;

      cluster.sequencingControls.flow = true;
      cluster.sequencingControls.selectionTiming = SelectionTiming.ONCE;
      cluster.sequencingControls.selectCount = 1;
      cluster.sequencingControls.selectionCountStatus = true;
      cluster.sequencingControls.randomizationTiming = RandomizationTiming.ONCE;
      cluster.sequencingControls.randomizeChildren = true;
      cluster.sequencingControls.reorderChildren = true;
      cluster.sequencingControls.choice = true;

      cluster.addChild(childVisible);
      cluster.addChild(childHidden);
      customRoot.addChild(cluster);

      customRoot.setChildOrder(["cluster"]);
      cluster.setChildOrder(["childVisible", "childHidden"]);

      cluster.setProcessedChildren([childVisible]);
      customRoot.setProcessedChildren([cluster]);

      childVisible.isHiddenFromChoice = false;
      childVisible.isAvailable = true;
      childHidden.isHiddenFromChoice = true;
      childHidden.isAvailable = false;
      cluster.isHiddenFromChoice = false;
      cluster.isAvailable = true;

      customTree.root = customRoot;

      const customSequencingProcess = new SequencingProcess(
        customTree,
        new SequencingRules(),
        new SequencingControls(),
        new ADLNav(),
      );
      const customOverall = new OverallSequencingProcess(
        customTree,
        customSequencingProcess,
        new RollupProcess(),
        new ADLNav(),
      );

      customTree.currentActivity = null;

      const hiddenChoice = customOverall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        "childHidden",
      );
      expect(hiddenChoice.valid).toBe(false);
      expect(hiddenChoice.exception).toBe("NB.2.1-11");

      const visibleChoice = customOverall.processNavigationRequest(
        NavigationRequestType.CHOICE,
        "childVisible",
      );
      expect(visibleChoice.valid).toBe(true);
      expect(visibleChoice.targetActivity).toBe(childVisible);
    });
  });

  describe("Hide LMS UI directives", () => {
    it("should union default and activity directives when updating navigation", () => {
      const customActivityTree = new ActivityTree();
      const rootActivity = new Activity("root", "Root");
      const childActivity = new Activity("child", "Child");

      rootActivity.addChild(childActivity);
      rootActivity.sequencingControls.flow = true;
      // childActivity is a leaf, should NOT have flow=true
      rootActivity.hideLmsUi = ["continue"];
      childActivity.hideLmsUi = ["previous"];

      customActivityTree.root = rootActivity;

      const sequencingProcess = new SequencingProcess(customActivityTree);
      const rollupProcess = new RollupProcess();
      const adlNav = new ADLNav();

      const events: any[] = [];
      const process = new OverallSequencingProcess(
        customActivityTree,
        sequencingProcess,
        rollupProcess,
        adlNav,
        (eventType, data) => {
          if (eventType === "onNavigationValidityUpdate") {
            events.push(data);
          }
        },
        { defaultHideLmsUi: ["exit"] },
      );

      const result = process.processNavigationRequest(NavigationRequestType.START);
      expect(result.valid).toBe(true);
      expect(events.length).toBeGreaterThan(0);
      const lastEvent = events[events.length - 1];
      expect(lastEvent.hideLmsUi).toEqual(["continue", "previous", "exit"]);
    });
  });

  describe("Error handling", () => {
    it("should handle invalid navigation request type", () => {
      const result = overallProcess.processNavigationRequest("invalid" as NavigationRequestType);

      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-18");
    });

    it("should handle delivery failure", () => {
      // Create a cluster activity (non-leaf) that can't be delivered
      const cluster = new Activity("cluster", "Cluster");
      const leaf = new Activity("leaf", "Leaf");
      cluster.addChild(leaf);

      activityTree.root = cluster;
      activityTree.currentActivity = null;

      // Try to deliver the cluster directly (should fail)
      cluster.isAvailable = false; // Make children unavailable
      leaf.isAvailable = false;

      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);

      expect(result.valid).toBe(false);
    });
  });

  describe("GAP-06: SUSPEND_ALL Path Processing", () => {
    describe("Basic suspend path processing", () => {
      it("should suspend all ancestors from current activity to root", () => {
        // Arrange: Set grandchild1 as current and active
        activityTree.currentActivity = grandchild1;
        grandchild1.isActive = true;

        // Act: Suspend all
        const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

        // Assert: All activities in path should be suspended
        expect(result.valid).toBe(true);

        // Grandchild (current activity) should be suspended
        expect(grandchild1.isSuspended).toBe(true);
        expect(grandchild1.isActive).toBe(false);

        // Parent should be suspended
        expect(child1.isSuspended).toBe(true);
        expect(child1.isActive).toBe(false);

        // Root should be suspended
        expect(root.isSuspended).toBe(true);
        expect(root.isActive).toBe(false);

        // Suspended activity reference should be set to current
        expect(activityTree.suspendedActivity).toBe(grandchild1);

        // TB.2.3 5.6: Current activity should move to root
        expect(activityTree.currentActivity).toBe(root);
      });

      it("should suspend entire path for deeply nested activity (3+ levels)", () => {
        // Arrange: Create deeper tree
        const deepTree = new ActivityTree();
        const level0 = new Activity("level0", "Level 0");
        const level1 = new Activity("level1", "Level 1");
        const level2 = new Activity("level2", "Level 2");
        const level3 = new Activity("level3", "Level 3");
        const level4 = new Activity("level4", "Level 4");

        level0.addChild(level1);
        level1.addChild(level2);
        level2.addChild(level3);
        level3.addChild(level4);

        deepTree.root = level0;
        deepTree.currentActivity = level4;
        level4.isActive = true;

        // Enable flow for deep tree traversal (only on clusters, not leaves)
        level0.sequencingControls.flow = true;
        level1.sequencingControls.flow = true;
        level2.sequencingControls.flow = true;
        level3.sequencingControls.flow = true;
        // level4 is a leaf, should NOT have flow=true

        const deepProcess = new OverallSequencingProcess(
          deepTree,
          new SequencingProcess(deepTree),
          rollupProcess,
          adlNav
        );

        // Act: Suspend all
        const result = deepProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

        // Assert: All 5 levels should be suspended
        expect(result.valid).toBe(true);
        expect(level4.isSuspended).toBe(true);
        expect(level4.isActive).toBe(false);
        expect(level3.isSuspended).toBe(true);
        expect(level3.isActive).toBe(false);
        expect(level2.isSuspended).toBe(true);
        expect(level2.isActive).toBe(false);
        expect(level1.isSuspended).toBe(true);
        expect(level1.isActive).toBe(false);
        expect(level0.isSuspended).toBe(true);
        expect(level0.isActive).toBe(false);

        expect(deepTree.suspendedActivity).toBe(level4);
        expect(deepTree.currentActivity).toBe(level0);
      });

      it("should handle suspend when current activity is root (single element path)", () => {
        // Arrange: Set root as current and active
        activityTree.currentActivity = root;
        root.isActive = true;

        // Act: Suspend all
        const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

        // Assert: Root should be suspended
        expect(result.valid).toBe(true);
        expect(root.isSuspended).toBe(true);
        expect(root.isActive).toBe(false);
        expect(activityTree.suspendedActivity).toBe(root);
        expect(activityTree.currentActivity).toBe(root);
      });

      it("should not affect sibling activities outside the path", () => {
        // Arrange: Set grandchild1 as current, ensure sibling is active
        activityTree.currentActivity = grandchild1;
        grandchild1.isActive = true;
        grandchild2.isActive = true;
        child2.isActive = true;

        // Act: Suspend all
        const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

        // Assert: Path from grandchild1 to root is suspended
        expect(result.valid).toBe(true);
        expect(grandchild1.isSuspended).toBe(true);
        expect(child1.isSuspended).toBe(true);
        expect(root.isSuspended).toBe(true);

        // Siblings should NOT be affected
        expect(grandchild2.isSuspended).toBe(false);
        expect(grandchild2.isActive).toBe(true);
        expect(child2.isSuspended).toBe(false);
        expect(child2.isActive).toBe(true);
      });
    });

    describe("Resume after suspend", () => {
      it("should properly restore suspended activity after RESUME_ALL", () => {
        // Arrange: Suspend grandchild1 with full path
        activityTree.currentActivity = grandchild1;
        grandchild1.isActive = true;

        overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

        // Verify suspend worked
        expect(grandchild1.isSuspended).toBe(true);
        expect(child1.isSuspended).toBe(true);
        expect(root.isSuspended).toBe(true);
        expect(activityTree.suspendedActivity).toBe(grandchild1);
        expect(activityTree.currentActivity).toBe(root);

        // Simulate session termination and new session (Terminate/Initialize cycle)
        // During termination, currentActivity is cleared
        activityTree.currentActivity = null;

        // Act: Resume in new session
        const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);

        // Assert: Should resume to suspended activity
        expect(result.valid).toBe(true);
        expect(result.targetActivity).toBe(grandchild1);

        // After delivery, suspended state should be cleared by clearSuspendedActivitySubprocess
        // which walks the same path and clears isSuspended flags
      });

      it("should clear suspended state from all ancestors on delivery", () => {
        // Arrange: Manually set up suspended path (simulating state after session restart)
        grandchild1.isSuspended = true;
        child1.isSuspended = true;
        root.isSuspended = true;
        activityTree.suspendedActivity = grandchild1;
        activityTree.currentActivity = null;

        // Act: Resume (which triggers delivery and clearSuspendedActivitySubprocess)
        const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);

        // Assert: Suspended state should be cleared
        expect(result.valid).toBe(true);
        expect(grandchild1.isSuspended).toBe(false);
        expect(child1.isSuspended).toBe(false);
        expect(root.isSuspended).toBe(false);
        expect(activityTree.suspendedActivity).toBeNull();
      });
    });

    describe("Edge cases and validation", () => {
      it("should handle null current activity gracefully", () => {
        // Arrange: No current activity
        activityTree.currentActivity = null;

        // Act: Try to suspend all (should be caught by navigation validation)
        const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

        // Assert: Should fail validation
        expect(result.valid).toBe(false);
        expect(result.exception).toBe("NB.2.1-17");
      });

      it("should suspend even if current activity is not active", () => {
        // Arrange: Current activity is set but not active
        activityTree.currentActivity = grandchild1;
        grandchild1.isActive = false;

        // Act: Suspend all
        const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

        // Assert: Should still suspend (reference allows this)
        expect(result.valid).toBe(true);
        expect(grandchild1.isSuspended).toBe(true);
        expect(child1.isSuspended).toBe(true);
        expect(root.isSuspended).toBe(true);
      });

      it("should suspend already suspended activity and its ancestors", () => {
        // Arrange: Current activity already suspended
        activityTree.currentActivity = grandchild1;
        grandchild1.isSuspended = true;
        grandchild1.isActive = true;

        // Act: Suspend all again
        const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

        // Assert: Should work (idempotent)
        expect(result.valid).toBe(true);
        expect(grandchild1.isSuspended).toBe(true);
        expect(child1.isSuspended).toBe(true);
        expect(root.isSuspended).toBe(true);
      });
    });

    describe("Symmetric behavior with clearSuspendedActivitySubprocess", () => {
      it("should mirror the cleanup logic that walks path to clear flags", () => {
        // This test verifies that handleSuspendAllRequest sets the same flags
        // that clearSuspendedActivitySubprocess clears

        // Arrange: Set up suspended path manually
        activityTree.currentActivity = grandchild1;
        grandchild1.isActive = true;

        // Act: Suspend all (sets flags on path)
        overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);

        // Assert: Verify all ancestors have isSuspended set
        expect(grandchild1.isSuspended).toBe(true);
        expect(child1.isSuspended).toBe(true);
        expect(root.isSuspended).toBe(true);

        // Now trigger cleanup by delivering a different activity
        activityTree.currentActivity = null;
        root.sequencingControls.choice = true;
        child2.sequencingControls.choice = true;

        const result = overallProcess.processNavigationRequest(
          NavigationRequestType.CHOICE,
          "module2"
        );

        // Assert: clearSuspendedActivitySubprocess should have cleared all flags
        expect(result.valid).toBe(true);
        expect(grandchild1.isSuspended).toBe(false);
        expect(child1.isSuspended).toBe(false);
        expect(root.isSuspended).toBe(false);
        expect(activityTree.suspendedActivity).toBeNull();
      });
    });
  });
});
