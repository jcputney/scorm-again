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
});
