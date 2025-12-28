// noinspection DuplicatedCode

import { beforeEach, describe, expect, it, vi } from "vitest";
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

  describe("adlNav property", () => {
    it("should store and retrieve ADLNav reference", () => {
      const adlNav = new ADLNav();
      sequencing.adlNav = adlNav;
      expect(sequencing.adlNav).toBe(adlNav);
    });

    it("should allow setting adlNav to null", () => {
      sequencing.adlNav = null;
      expect(sequencing.adlNav).toBeNull();
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


  describe("adlNav setter", () => {
    it("should store ADLNav reference when set", () => {
      const adlNav = new ADLNav();

      sequencing.adlNav = adlNav;

      expect(sequencing.adlNav).toBe(adlNav);
    });

    it("should handle null adlNav", () => {
      sequencing.adlNav = null;

      expect(sequencing.adlNav).toBeNull();
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
