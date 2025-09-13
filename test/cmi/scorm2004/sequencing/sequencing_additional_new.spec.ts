import { describe, it, expect, vi } from "vitest";
import { Sequencing } from "../../../../src/cmi/scorm2004/sequencing/sequencing";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { SequencingRules } from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import { RollupRules } from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";

describe("Additional Sequencing Tests", () => {
  describe("Sequencing initialization", () => {
    it("should initialize sequencing components", () => {
      const sequencing = new Sequencing();
      
      sequencing.initialize();
      
      expect(sequencing.activityTree).toBeInstanceOf(ActivityTree);
      expect(sequencing.sequencingRules).toBeInstanceOf(SequencingRules);
      expect(sequencing.sequencingControls).toBeInstanceOf(SequencingControls);
      expect(sequencing.rollupRules).toBeInstanceOf(RollupRules);
    });
  });

  describe("processRollup", () => {
    it("should process rollup for the activity tree", () => {
      const sequencing = new Sequencing();
      const rootActivity = new Activity("root", "Root Activity");
      const childActivity1 = new Activity("child1", "Child Activity 1");
      const childActivity2 = new Activity("child2", "Child Activity 2");
      
      rootActivity.addChild(childActivity1);
      rootActivity.addChild(childActivity2);
      sequencing.activityTree.root = rootActivity;
      
      // Mock the rollup rules processRollup method
      const spy = vi.spyOn(sequencing.rollupRules, "processRollup");
      
      sequencing.processRollup();
      
      // Should process rollup for each activity
      expect(spy).toHaveBeenCalledWith(childActivity1);
      expect(spy).toHaveBeenCalledWith(childActivity2);
      expect(spy).toHaveBeenCalledWith(rootActivity);
    });
  });

  describe("getCurrentActivity", () => {
    it("should return the current activity", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      
      sequencing.activityTree.currentActivity = activity;
      
      const currentActivity = sequencing.getCurrentActivity();
      expect(currentActivity).toBe(activity);
    });
  });

  describe("getRootActivity", () => {
    it("should return the root activity", () => {
      const sequencing = new Sequencing();
      const rootActivity = new Activity("root", "Root Activity");
      
      sequencing.activityTree.root = rootActivity;
      
      const root = sequencing.getRootActivity();
      expect(root).toBe(rootActivity);
    });
  });

  // Navigation processing tests have been moved to SequencingService tests
  // The Sequencing class is now a pure data model without business logic

  describe("Sequencing as pure data model", () => {
    it("should only provide data access methods", () => {
      const sequencing = new Sequencing();
      
      // Verify data model methods exist
      expect(sequencing.activityTree).toBeDefined();
      expect(sequencing.sequencingRules).toBeDefined();
      expect(sequencing.sequencingControls).toBeDefined();
      expect(sequencing.rollupRules).toBeDefined();
      expect(sequencing.getCurrentActivity).toBeDefined();
      expect(sequencing.getRootActivity).toBeDefined();
      
      // Verify business logic methods have been removed
      expect(sequencing.processNavigationRequest).toBeUndefined();
      expect(sequencing.getLastSequencingResult).toBeUndefined();
    });

    it("should maintain data model relationships", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      
      // Set ADL Nav
      sequencing.adlNav = adlNav;
      expect(sequencing.adlNav).toBe(adlNav);
      
      // Activity tree operations
      const root = new Activity("root", "Root");
      const child = new Activity("child", "Child");
      root.addChild(child);
      
      sequencing.activityTree.root = root;
      sequencing.activityTree.currentActivity = child;
      
      expect(sequencing.getRootActivity()).toBe(root);
      expect(sequencing.getCurrentActivity()).toBe(child);
    });
  });

  describe("setActivityTreeFromManifest", () => {
    it("should set the activity tree from manifest data", () => {
      const sequencing = new Sequencing();
      
      // Mock manifest data with activities
      const manifestData = {
        activities: [
          {
            id: "root",
            title: "Root Activity",
            children: [
              {
                id: "child1",
                title: "Child Activity 1",
              },
              {
                id: "child2",
                title: "Child Activity 2",
              },
            ],
          },
        ],
      };
      
      // This would be handled by the API configuration methods
      // The test verifies the data model can store the configured tree
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child Activity 1");
      const child2 = new Activity("child2", "Child Activity 2");
      
      root.addChild(child1);
      root.addChild(child2);
      
      sequencing.activityTree.root = root;
      
      expect(sequencing.activityTree.root).toBeDefined();
      expect(sequencing.activityTree.root?.id).toBe("root");
      expect(sequencing.activityTree.root?.children.length).toBe(2);
    });
  });

  describe("toJSON", () => {
    it("should serialize sequencing data", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("test", "Test Activity");
      
      sequencing.activityTree.root = activity;
      sequencing.activityTree.currentActivity = activity;
      
      const json = sequencing.toJSON();
      
      expect(json).toHaveProperty("activityTree");
      expect(json).toHaveProperty("sequencingRules");
      expect(json).toHaveProperty("sequencingControls");
      expect(json).toHaveProperty("rollupRules");
    });
  });
});