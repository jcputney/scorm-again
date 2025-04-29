import { afterEach, describe, expect, it, vi } from "vitest";

import { Sequencing } from "../../../../src/cmi/scorm2004/sequencing/sequencing";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  RuleActionType,
  SequencingRules,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import { RollupRules } from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";
import { Scorm2004ValidationError } from "../../../../src/exceptions/scorm2004_exceptions";

describe("Sequencing", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("constructor", () => {
    it("should initialize with default values", () => {
      const sequencing = new Sequencing();

      expect(sequencing.activityTree).toBeInstanceOf(ActivityTree);
      expect(sequencing.sequencingRules).toBeInstanceOf(SequencingRules);
      expect(sequencing.sequencingControls).toBeInstanceOf(SequencingControls);
      expect(sequencing.rollupRules).toBeInstanceOf(RollupRules);
      expect(sequencing.adlNav).toBe(null);
    });
  });

  describe("initialize", () => {
    it("should initialize all components", () => {
      const sequencing = new Sequencing();

      const activityTreeInitializeSpy = vi.spyOn(sequencing.activityTree, "initialize");
      const sequencingRulesInitializeSpy = vi.spyOn(sequencing.sequencingRules, "initialize");
      const sequencingControlsInitializeSpy = vi.spyOn(sequencing.sequencingControls, "initialize");
      const rollupRulesInitializeSpy = vi.spyOn(sequencing.rollupRules, "initialize");

      sequencing.initialize();

      expect(activityTreeInitializeSpy).toHaveBeenCalled();
      expect(sequencingRulesInitializeSpy).toHaveBeenCalled();
      expect(sequencingControlsInitializeSpy).toHaveBeenCalled();
      expect(rollupRulesInitializeSpy).toHaveBeenCalled();
      expect(sequencing.initialized).toBe(true);

      activityTreeInitializeSpy.mockRestore();
      sequencingRulesInitializeSpy.mockRestore();
      sequencingControlsInitializeSpy.mockRestore();
      rollupRulesInitializeSpy.mockRestore();
    });
  });

  describe("reset", () => {
    it("should reset all components", () => {
      const sequencing = new Sequencing();

      const activityTreeResetSpy = vi.spyOn(sequencing.activityTree, "reset");
      const sequencingRulesResetSpy = vi.spyOn(sequencing.sequencingRules, "reset");
      const sequencingControlsResetSpy = vi.spyOn(sequencing.sequencingControls, "reset");
      const rollupRulesResetSpy = vi.spyOn(sequencing.rollupRules, "reset");

      sequencing.reset();

      expect(activityTreeResetSpy).toHaveBeenCalled();
      expect(sequencingRulesResetSpy).toHaveBeenCalled();
      expect(sequencingControlsResetSpy).toHaveBeenCalled();
      expect(rollupRulesResetSpy).toHaveBeenCalled();
      expect(sequencing.initialized).toBe(false);

      activityTreeResetSpy.mockRestore();
      sequencingRulesResetSpy.mockRestore();
      sequencingControlsResetSpy.mockRestore();
      rollupRulesResetSpy.mockRestore();
    });
  });

  describe("property getters and setters", () => {
    it("should set and get activityTree property", () => {
      const sequencing = new Sequencing();
      const activityTree = new ActivityTree();

      sequencing.activityTree = activityTree;

      expect(sequencing.activityTree).toBe(activityTree);
    });

    it("should throw error if activityTree is not an ActivityTree", () => {
      const sequencing = new Sequencing();

      expect(() => {
        sequencing.activityTree = "not an activity tree" as any;
      }).toThrow(Scorm2004ValidationError);
    });

    it("should set and get sequencingRules property", () => {
      const sequencing = new Sequencing();
      const sequencingRules = new SequencingRules();

      sequencing.sequencingRules = sequencingRules;

      expect(sequencing.sequencingRules).toBe(sequencingRules);
    });

    it("should throw error if sequencingRules is not a SequencingRules", () => {
      const sequencing = new Sequencing();

      expect(() => {
        sequencing.sequencingRules = "not sequencing rules" as any;
      }).toThrow(Scorm2004ValidationError);
    });

    it("should set and get sequencingControls property", () => {
      const sequencing = new Sequencing();
      const sequencingControls = new SequencingControls();

      sequencing.sequencingControls = sequencingControls;

      expect(sequencing.sequencingControls).toBe(sequencingControls);
    });

    it("should throw error if sequencingControls is not a SequencingControls", () => {
      const sequencing = new Sequencing();

      expect(() => {
        sequencing.sequencingControls = "not sequencing controls" as any;
      }).toThrow(Scorm2004ValidationError);
    });

    it("should set and get rollupRules property", () => {
      const sequencing = new Sequencing();
      const rollupRules = new RollupRules();

      sequencing.rollupRules = rollupRules;

      expect(sequencing.rollupRules).toBe(rollupRules);
    });

    it("should throw error if rollupRules is not a RollupRules", () => {
      const sequencing = new Sequencing();

      expect(() => {
        sequencing.rollupRules = "not rollup rules" as any;
      }).toThrow(Scorm2004ValidationError);
    });

    it("should set and get adlNav property", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();

      sequencing.adlNav = adlNav;

      expect(sequencing.adlNav).toBe(adlNav);
    });
  });

  describe("processNavigationRequest", () => {
    it("should return false if adlNav is null", () => {
      const sequencing = new Sequencing();

      expect(sequencing.processNavigationRequest("continue")).toBe(false);
    });

    it("should return false if currentActivity is null", () => {
      const sequencing = new Sequencing();
      sequencing.adlNav = new ADLNav();

      expect(sequencing.processNavigationRequest("continue")).toBe(false);
    });

    it("should set the navigation request on adlNav", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const adlNavRequestSpy = vi.spyOn(adlNav, "request", "set");

      sequencing.processNavigationRequest("continue");

      expect(adlNavRequestSpy).toHaveBeenCalledWith("continue");
    });

    it("should evaluate pre-condition rules", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const evaluatePreConditionRulesSpy = vi.spyOn(
        sequencing.sequencingRules,
        "evaluatePreConditionRules",
      );

      sequencing.processNavigationRequest("continue");

      expect(evaluatePreConditionRulesSpy).toHaveBeenCalledWith(activity);

      evaluatePreConditionRulesSpy.mockRestore();
    });

    it("should return false if pre-condition rules return SKIP", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const spy = vi
        .spyOn(sequencing.sequencingRules, "evaluatePreConditionRules")
        .mockImplementation(() => {
          return RuleActionType.SKIP;
        });

      expect(sequencing.processNavigationRequest("continue")).toBe(false);

      spy.mockRestore();
    });

    it("should call processContinueRequest for continue request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const processContinueRequestSpy = vi.spyOn(sequencing, "processContinueRequest");

      sequencing.processNavigationRequest("continue");

      expect(processContinueRequestSpy).toHaveBeenCalledWith(activity);

      processContinueRequestSpy.mockRestore();
    });

    it("should call processPreviousRequest for previous request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const processPreviousRequestSpy = vi.spyOn(sequencing, "processPreviousRequest");

      sequencing.processNavigationRequest("previous");

      expect(processPreviousRequestSpy).toHaveBeenCalledWith(activity);

      processPreviousRequestSpy.mockRestore();
    });
  });

  describe("processContinueRequest", () => {
    it("should return false if forward navigation is not allowed", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(false);

      expect(sequencing.processContinueRequest(activity)).toBe(false);
    });

    it("should return false if there is no next activity", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockReturnValue(null);

      expect(sequencing.processContinueRequest(activity)).toBe(false);
    });

    it("should evaluate exit condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockReturnValue(nextActivity);

      const evaluateExitConditionRulesSpy = vi.spyOn(
        sequencing.sequencingRules,
        "evaluateExitConditionRules",
      );

      sequencing.processContinueRequest(activity);

      expect(evaluateExitConditionRulesSpy).toHaveBeenCalledWith(activity);
    });

    it("should set next activity as current activity", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockImplementation(
        () => true,
      );
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockImplementation(() => nextActivity);

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      sequencing.processContinueRequest(activity);

      expect(currentActivitySpy).toHaveBeenCalledWith(nextActivity);
    });

    it("should evaluate post-condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");

      const controlsSpy = vi
        .spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed")
        .mockImplementation(() => true);
      const activitySpy = vi
        .spyOn(sequencing.activityTree, "getNextSibling")
        .mockImplementation(() => nextActivity);

      const evaluatePostConditionRulesSpy = vi.spyOn(
        sequencing.sequencingRules,
        "evaluatePostConditionRules",
      );

      sequencing.processContinueRequest(activity);

      expect(evaluatePostConditionRulesSpy).toHaveBeenCalledWith(nextActivity);

      evaluatePostConditionRulesSpy.mockRestore();
      controlsSpy.mockRestore();
      activitySpy.mockRestore();
    });
  });

  describe("processRollup", () => {
    it("should do nothing if root is null", () => {
      const sequencing = new Sequencing();

      const processRollupSpy = vi.spyOn(sequencing.rollupRules, "processRollup");

      sequencing.processRollup();

      expect(processRollupSpy.mock.calls.length === 0).toBe(true);

      processRollupSpy.mockRestore();
    });

    it("should process rollup for the root activity", () => {
      const sequencing = new Sequencing();
      const root = new Activity("root", "Root Activity");

      sequencing.activityTree.root = root;

      const processRollupSpy = vi.spyOn(sequencing.rollupRules, "processRollup");

      sequencing.processRollup();

      expect(processRollupSpy).toHaveBeenCalledWith(root);

      processRollupSpy.mockRestore();
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation of the sequencing object", () => {
      const sequencing = new Sequencing();

      const result = sequencing.toJSON() as any;

      expect(result).toHaveProperty("activityTree");
      expect(result).toHaveProperty("sequencingRules");
      expect(result).toHaveProperty("sequencingControls");
      expect(result).toHaveProperty("rollupRules");
      expect(result.activityTree).toBe(sequencing.activityTree);
      expect(result.sequencingRules).toBe(sequencing.sequencingRules);
      expect(result.sequencingControls).toBe(sequencing.sequencingControls);
      expect(result.rollupRules).toBe(sequencing.rollupRules);
    });
  });
});
