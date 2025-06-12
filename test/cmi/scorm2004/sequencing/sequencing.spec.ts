// noinspection DuplicatedCode

import { describe, expect, it, vi, beforeEach } from "vitest";
import { Sequencing } from "../../../../src/cmi/scorm2004/sequencing/sequencing";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { SequencingRules } from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import { ADLNav } from "../../../../src";

describe("Sequencing", () => {
  let sequencing: Sequencing;

  beforeEach(() => {
    sequencing = new Sequencing();
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      expect(sequencing).toBeDefined();
      expect(sequencing.activityTree).toBeInstanceOf(ActivityTree);
      expect(sequencing.sequencingRules).toBeInstanceOf(SequencingRules);
      expect(sequencing.sequencingControls).toBeInstanceOf(SequencingControls);
      expect(sequencing.adlNav).toBeNull();
    });
  });

  describe("initialize", () => {
    it("should initialize all components", () => {
      const initSpy = vi.spyOn(sequencing.activityTree, "initialize");
      sequencing.initialize();
      expect(initSpy).toHaveBeenCalled();
    });
  });

  describe("reset", () => {
    it("should reset all components", () => {
      const resetSpy = vi.spyOn(sequencing.activityTree, "reset");
      sequencing.reset();
      expect(resetSpy).toHaveBeenCalled();
    });
  });

  describe("processNavigationRequest", () => {
    it("should return false if sequencing process is not initialized", () => {
      const result = sequencing.processNavigationRequest("continue");
      expect(result).toBe(false);
    });

    it("should process valid navigation request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      // Set up a simple activity tree
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      
      root.addChild(child1);
      root.addChild(child2);
      
      sequencing.activityTree.root = root;
      
      const result = sequencing.processNavigationRequest("start");
      expect(typeof result).toBe("boolean");
    });

    it("should handle continue navigation request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      
      root.addChild(child1);
      root.addChild(child2);
      
      sequencing.activityTree.root = root;
      sequencing.activityTree.currentActivity = child1;
      child1.isActive = false; // Activity has been terminated
      
      const result = sequencing.processNavigationRequest("continue");
      expect(typeof result).toBe("boolean");
    });

    it("should handle previous navigation request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      
      root.addChild(child1);
      root.addChild(child2);
      
      sequencing.activityTree.root = root;
      sequencing.activityTree.currentActivity = child2;
      child2.isActive = false; // Activity has been terminated
      
      const result = sequencing.processNavigationRequest("previous");
      expect(typeof result).toBe("boolean");
    });

    it("should handle choice navigation request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      
      root.addChild(child1);
      root.addChild(child2);
      
      sequencing.activityTree.root = root;
      
      const result = sequencing.processNavigationRequest("choice", "child2");
      expect(typeof result).toBe("boolean");
    });

    it("should handle exit navigation request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      
      root.addChild(child1);
      
      sequencing.activityTree.root = root;
      sequencing.activityTree.currentActivity = child1;
      
      const result = sequencing.processNavigationRequest("exit");
      expect(typeof result).toBe("boolean");
    });

    it("should handle suspend navigation request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      
      root.addChild(child1);
      
      sequencing.activityTree.root = root;
      sequencing.activityTree.currentActivity = child1;
      
      const result = sequencing.processNavigationRequest("suspendAll");
      expect(typeof result).toBe("boolean");
    });

    it("should handle jump navigation request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      
      root.addChild(child1);
      root.addChild(child2);
      
      sequencing.activityTree.root = root;
      
      const result = sequencing.processNavigationRequest("jump", "child2");
      expect(typeof result).toBe("boolean");
    });

    it("should handle retry navigation request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      
      root.addChild(child1);
      
      sequencing.activityTree.root = root;
      sequencing.activityTree.currentActivity = child1;
      child1.isActive = true;
      
      const result = sequencing.processNavigationRequest("retry");
      expect(typeof result).toBe("boolean");
    });

    it("should return false for invalid navigation request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const result = sequencing.processNavigationRequest("invalid");
      expect(result).toBe(false);
    });
  });

  describe("getLastSequencingResult", () => {
    it("should return null if no sequencing result", () => {
      const result = sequencing.getLastSequencingResult();
      expect(result).toBeNull();
    });

    it("should return last sequencing result after navigation", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      
      root.addChild(child1);
      
      sequencing.activityTree.root = root;
      
      sequencing.processNavigationRequest("start");
      
      const result = sequencing.getLastSequencingResult();
      expect(result).toBeDefined();
      expect(result?.deliveryRequest).toBeDefined();
    });
  });

  describe("getCurrentActivity", () => {
    it("should return current activity from activity tree", () => {
      const activity = new Activity("test", "Test Activity");
      sequencing.activityTree.currentActivity = activity;
      
      expect(sequencing.getCurrentActivity()).toBe(activity);
    });

    it("should return null if no current activity", () => {
      expect(sequencing.getCurrentActivity()).toBeNull();
    });
  });

  describe("getRootActivity", () => {
    it("should return root activity from activity tree", () => {
      const root = new Activity("root", "Root Activity");
      sequencing.activityTree.root = root;
      
      expect(sequencing.getRootActivity()).toBe(root);
    });

    it("should return null if no root activity", () => {
      expect(sequencing.getRootActivity()).toBeNull();
    });
  });

  describe("processRollup", () => {
    it("should process rollup for the entire activity tree", () => {
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const grandChild = new Activity("grandchild", "Grand Child");
      
      root.addChild(child1);
      root.addChild(child2);
      child1.addChild(grandChild);
      
      sequencing.activityTree.root = root;
      
      // Spy on the rollup rules processRollup method
      const processRollupSpy = vi.spyOn(sequencing.rollupRules, "processRollup");
      
      sequencing.processRollup();
      
      // Should be called for all activities (grandChild, child1, child2, root)
      expect(processRollupSpy).toHaveBeenCalledTimes(4);
      expect(processRollupSpy).toHaveBeenCalledWith(grandChild);
      expect(processRollupSpy).toHaveBeenCalledWith(child1);
      expect(processRollupSpy).toHaveBeenCalledWith(child2);
      expect(processRollupSpy).toHaveBeenCalledWith(root);
    });

    it("should handle empty activity tree gracefully", () => {
      // No root activity set
      sequencing.activityTree.root = null;
      
      const processRollupSpy = vi.spyOn(sequencing.rollupRules, "processRollup");
      
      sequencing.processRollup();
      
      // Should not call processRollup if no root
      expect(processRollupSpy).not.toHaveBeenCalled();
    });

    it("should process rollup in bottom-up order", () => {
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");
      const grandChild1 = new Activity("grandchild1", "Grand Child 1");
      const grandChild2 = new Activity("grandchild2", "Grand Child 2");
      
      root.addChild(child1);
      root.addChild(child2);
      child1.addChild(grandChild1);
      child1.addChild(grandChild2);
      
      sequencing.activityTree.root = root;
      
      const callOrder: Activity[] = [];
      const processRollupSpy = vi.spyOn(sequencing.rollupRules, "processRollup")
        .mockImplementation((activity: Activity) => {
          callOrder.push(activity);
        });
      
      sequencing.processRollup();
      
      // Should process children before parents
      expect(callOrder).toEqual([grandChild1, grandChild2, child1, child2, root]);
    });
  });

  describe("setter validations", () => {
    it("should throw error for invalid activityTree type", () => {
      expect(() => {
        sequencing.activityTree = "invalid" as any;
      }).toThrow();
    });

    it("should throw error for invalid sequencingRules type", () => {
      expect(() => {
        sequencing.sequencingRules = "invalid" as any;
      }).toThrow();
    });

    it("should throw error for invalid sequencingControls type", () => {
      expect(() => {
        sequencing.sequencingControls = "invalid" as any;
      }).toThrow();
    });

    it("should throw error for invalid rollupRules type", () => {
      expect(() => {
        sequencing.rollupRules = "invalid" as any;
      }).toThrow();
    });

    it("should accept valid activityTree", () => {
      const newActivityTree = new ActivityTree();
      expect(() => {
        sequencing.activityTree = newActivityTree;
      }).not.toThrow();
      expect(sequencing.activityTree).toBe(newActivityTree);
    });

    it("should accept valid sequencingRules", () => {
      const newSequencingRules = new SequencingRules();
      expect(() => {
        sequencing.sequencingRules = newSequencingRules;
      }).not.toThrow();
      expect(sequencing.sequencingRules).toBe(newSequencingRules);
    });

    it("should accept valid sequencingControls", () => {
      const newSequencingControls = new SequencingControls();
      expect(() => {
        sequencing.sequencingControls = newSequencingControls;
      }).not.toThrow();
      expect(sequencing.sequencingControls).toBe(newSequencingControls);
    });
  });

  describe("updateNavigationRequestValidity", () => {
    it("should handle try-catch blocks for navigation validity setting", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      
      root.addChild(child1);
      sequencing.activityTree.root = root;
      sequencing.activityTree.currentActivity = child1;
      
      // Initialize the adlNav to trigger read-only behavior
      adlNav.initialize();
      
      // This should not throw even though setting validity fails
      expect(() => {
        sequencing.processNavigationRequest("start");
      }).not.toThrow();
    });
  });

  describe("adlNav setter", () => {
    it("should create sequencing process when adlNav is set", () => {
      const adlNav = new ADLNav();
      
      sequencing.adlNav = adlNav;
      
      expect(sequencing.adlNav).toBe(adlNav);
      // Should have created a sequencing process
      expect(sequencing['_sequencingProcess']).toBeDefined();
    });

    it("should handle null adlNav", () => {
      sequencing.adlNav = null;
      
      expect(sequencing.adlNav).toBeNull();
    });
  });

  describe("edge cases in processNavigationRequest", () => {
    it("should handle malformed choice request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      sequencing.activityTree.root = root;
      
      // Malformed choice request without proper target
      const result = sequencing.processNavigationRequest("{target=choice");
      expect(result).toBe(false);
    });

    it("should handle malformed jump request", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      sequencing.activityTree.root = root;
      
      // Malformed jump request without proper target
      const result = sequencing.processNavigationRequest("{target=jump");
      expect(result).toBe(false);
    });

    it("should parse choice request with target correctly", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      root.addChild(child1);
      sequencing.activityTree.root = root;
      
      const result = sequencing.processNavigationRequest("{target=child1}choice");
      expect(typeof result).toBe("boolean");
    });

    it("should parse jump request with target correctly", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      root.addChild(child1);
      sequencing.activityTree.root = root;
      
      const result = sequencing.processNavigationRequest("{target=child1}jump");
      expect(typeof result).toBe("boolean");
    });
  });

  describe("toJSON", () => {
    it("should return JSON representation", () => {
      const json = sequencing.toJSON();
      
      expect(json).toHaveProperty("activityTree");
      expect(json).toHaveProperty("sequencingRules");
      expect(json).toHaveProperty("sequencingControls");
      expect(json).toHaveProperty("adlNav");
    });
  });
});