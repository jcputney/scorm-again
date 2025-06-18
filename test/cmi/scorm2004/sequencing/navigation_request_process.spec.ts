import { describe, it, expect, beforeEach } from "vitest";
import {
  OverallSequencingProcess,
  NavigationRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { 
  SequencingProcess,
  SequencingRequestType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_process";
import { RollupProcess } from "../../../../src/cmi/scorm2004/sequencing/rollup_process";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";

describe("Navigation Request Process (NB.2.1)", () => {
  let overallProcess: OverallSequencingProcess;
  let activityTree: ActivityTree;
  let sequencingProcess: SequencingProcess;
  let rollupProcess: RollupProcess;
  let root: Activity;
  let child1: Activity;
  let child2: Activity;
  let grandchild1: Activity;
  let grandchild2: Activity;

  beforeEach(() => {
    // Create comprehensive activity tree
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

    // Set default sequencing controls
    root.sequencingControls.flow = true;
    root.sequencingControls.choice = true;
    child1.sequencingControls.flow = true;
    child1.sequencingControls.choice = true;
    child2.sequencingControls.flow = false;  // Leaf activity - no flow
    child2.sequencingControls.choice = true;

    sequencingProcess = new SequencingProcess(activityTree);
    rollupProcess = new RollupProcess();
    
    overallProcess = new OverallSequencingProcess(
      activityTree,
      sequencingProcess,
      rollupProcess
    );
  });

  describe("NB.2.1-1: Start Request Validation", () => {
    it("should validate START when no current activity exists", () => {
      expect(activityTree.currentActivity).toBeNull();
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);
      
      expect(result.valid).toBe(true);
      expect(result.exception).toBeNull();
    });

    it("should reject START when current activity exists", () => {
      activityTree.currentActivity = grandchild1;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-1");
    });
  });

  describe("NB.2.1-2 & NB.2.1-3: Resume All Request Validation", () => {
    it("should validate RESUME_ALL with suspended activity and no current", () => {
      activityTree.suspendedActivity = grandchild1;
      activityTree.currentActivity = null;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);
      
      expect(result.valid).toBe(true);
      expect(result.targetActivity).toBe(grandchild1);
    });

    it("should reject RESUME_ALL when current activity exists", () => {
      activityTree.currentActivity = grandchild1;
      activityTree.suspendedActivity = grandchild2;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-2");
    });

    it("should reject RESUME_ALL when no suspended activity", () => {
      activityTree.currentActivity = null;
      activityTree.suspendedActivity = null;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.RESUME_ALL);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-3");
    });
  });

  describe("NB.2.1-4 & NB.2.1-5: Continue Request Validation", () => {
    it("should validate CONTINUE with current activity and flow enabled", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = false; // Terminated
      child1.sequencingControls.flow = true;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
      
      expect(result.valid).toBe(true);
    });

    it("should reject CONTINUE when no current activity", () => {
      activityTree.currentActivity = null;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-4");
    });

    it("should reject CONTINUE when parent flow is false", () => {
      activityTree.currentActivity = grandchild1;
      child1.sequencingControls.flow = false;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-5");
    });

    it("should reject CONTINUE when current is root (no parent)", () => {
      activityTree.currentActivity = root;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-5");
    });
  });

  describe("NB.2.1-6, NB.2.1-7 & NB.2.1-8: Previous Request Validation", () => {
    it("should validate PREVIOUS with proper conditions", () => {
      activityTree.currentActivity = grandchild2;
      grandchild2.isActive = false;
      child1.sequencingControls.flow = true;
      child1.sequencingControls.forwardOnly = false;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.PREVIOUS);
      
      expect(result.valid).toBe(true);
    });

    it("should reject PREVIOUS when no current activity", () => {
      activityTree.currentActivity = null;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.PREVIOUS);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-6");
    });

    it("should reject PREVIOUS when parent flow is false", () => {
      activityTree.currentActivity = grandchild1;
      child1.sequencingControls.flow = false;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.PREVIOUS);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-7");
    });

    it("should reject PREVIOUS when forwardOnly is true", () => {
      activityTree.currentActivity = grandchild2;
      child1.sequencingControls.flow = true;
      child1.sequencingControls.forwardOnly = true;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.PREVIOUS);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-8");
    });
  });

  describe("NB.2.1-9, NB.2.1-10 & NB.2.1-11: Choice Request Validation", () => {
    it("should validate CHOICE with valid target", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = false;
      root.sequencingControls.choice = true;
      child1.sequencingControls.choice = true;
      child2.sequencingControls.choice = true;
      
      // Ensure target activity passes all checks
      child2.isAvailable = true;
      child2.isHiddenFromChoice = false;
      child2.attemptLimit = null; // No attempt limit
      child2.attemptCount = 0;    // No attempts yet
      
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.CHOICE,
        "module2"
      );
      
      expect(result.valid).toBe(true);
    });

    it("should reject CHOICE without target ID", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.CHOICE);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-9");
    });

    it("should reject CHOICE with non-existent target", () => {
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.CHOICE,
        "nonexistent"
      );
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-10");
    });

    it("should reject CHOICE when common ancestor disallows choice", () => {
      activityTree.currentActivity = grandchild1;
      child1.sequencingControls.choice = false; // Disallow choice at parent level
      
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.CHOICE,
        "lesson2"
      );
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-11");
    });

    it("should allow CHOICE from null current activity", () => {
      activityTree.currentActivity = null;
      
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.CHOICE,
        "lesson1"
      );
      
      expect(result.valid).toBe(true);
      // Should not require termination when no current activity
    });
  });

  describe("NB.2.1-12: Jump Request Validation", () => {
    it("should validate JUMP with valid target", () => {
      const result = overallProcess.processNavigationRequest(
        NavigationRequestType.JUMP,
        "lesson2"
      );
      
      expect(result.valid).toBe(true);
    });

    it("should reject JUMP without target ID", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.JUMP);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-12");
    });
  });

  describe("NB.2.1-13 & NB.2.1-14: Exit Request Validation", () => {
    it("should validate EXIT with current activity", () => {
      activityTree.currentActivity = grandchild1;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);
      
      expect(result.valid).toBe(true);
    });

    it("should convert EXIT to EXIT_ALL at root", () => {
      activityTree.currentActivity = root;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);
      
      expect(result.valid).toBe(true);
      // Internal termination request should be EXIT_ALL
    });

    it("should reject EXIT without current activity", () => {
      activityTree.currentActivity = null;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-13");
    });

    it("should validate EXIT_ALL with current activity", () => {
      activityTree.currentActivity = grandchild1;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT_ALL);
      
      expect(result.valid).toBe(true);
    });

    it("should reject EXIT_ALL without current activity", () => {
      activityTree.currentActivity = null;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.EXIT_ALL);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-14");
    });
  });

  describe("NB.2.1-15 & NB.2.1-16: Abandon Request Validation", () => {
    it("should validate ABANDON with current activity", () => {
      activityTree.currentActivity = grandchild1;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.ABANDON);
      
      expect(result.valid).toBe(true);
    });

    it("should reject ABANDON without current activity", () => {
      activityTree.currentActivity = null;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.ABANDON);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-15");
    });

    it("should validate ABANDON_ALL with current activity", () => {
      activityTree.currentActivity = grandchild1;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.ABANDON_ALL);
      
      expect(result.valid).toBe(true);
    });

    it("should reject ABANDON_ALL without current activity", () => {
      activityTree.currentActivity = null;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.ABANDON_ALL);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-16");
    });
  });

  describe("NB.2.1-17: Suspend All Request Validation", () => {
    it("should validate SUSPEND_ALL with current activity", () => {
      activityTree.currentActivity = grandchild1;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);
      
      expect(result.valid).toBe(true);
    });

    it("should reject SUSPEND_ALL without current activity", () => {
      activityTree.currentActivity = null;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.SUSPEND_ALL);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-17");
    });
  });

  describe("NB.2.1-18: Invalid Navigation Request", () => {
    it("should reject invalid navigation request type", () => {
      const result = overallProcess.processNavigationRequest("INVALID" as NavigationRequestType);
      
      expect(result.valid).toBe(false);
      expect(result.exception).toBe("NB.2.1-18");
    });
  });

  describe("Navigation Request Result Mapping", () => {
    it("should map START to proper sequencing request", () => {
      const result = overallProcess.processNavigationRequest(NavigationRequestType.START);
      
      expect(result.valid).toBe(true);
      // Should result in START sequencing request
    });

    it("should map CONTINUE to EXIT + CONTINUE sequencing requests", () => {
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = false;
      child1.sequencingControls.flow = true;
      
      const result = overallProcess.processNavigationRequest(NavigationRequestType.CONTINUE);
      
      expect(result.valid).toBe(true);
      // Should result in EXIT termination + CONTINUE sequencing
    });

    it("should map CHOICE appropriately based on current activity", () => {
      // With current activity - needs termination
      activityTree.currentActivity = grandchild1;
      grandchild1.isActive = false;
      
      let result = overallProcess.processNavigationRequest(
        NavigationRequestType.CHOICE,
        "lesson2"
      );
      
      expect(result.valid).toBe(true);
      
      // Without current activity - no termination needed
      activityTree.currentActivity = null;
      
      result = overallProcess.processNavigationRequest(
        NavigationRequestType.CHOICE,
        "lesson1"
      );
      
      expect(result.valid).toBe(true);
    });
  });
});