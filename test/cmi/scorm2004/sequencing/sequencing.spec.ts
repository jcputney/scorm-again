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
import { ADLNav } from "../../../../src";
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

    it("should return false if pre-condition rules return DISABLED", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const spy = vi
        .spyOn(sequencing.sequencingRules, "evaluatePreConditionRules")
        .mockImplementation(() => {
          return RuleActionType.DISABLED;
        });

      expect(sequencing.processNavigationRequest("continue")).toBe(false);

      spy.mockRestore();
    });

    it("should return false if pre-condition rules return HIDE_FROM_CHOICE", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const spy = vi
        .spyOn(sequencing.sequencingRules, "evaluatePreConditionRules")
        .mockImplementation(() => {
          return RuleActionType.HIDE_FROM_CHOICE;
        });

      expect(sequencing.processNavigationRequest("continue")).toBe(false);

      spy.mockRestore();
    });

    it("should return false if pre-condition rules return STOP_FORWARD_TRAVERSAL", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const spy = vi
        .spyOn(sequencing.sequencingRules, "evaluatePreConditionRules")
        .mockImplementation(() => {
          return RuleActionType.STOP_FORWARD_TRAVERSAL;
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

    it("should call processExitRequest for exit request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const processExitRequestSpy = vi.spyOn(sequencing, "processExitRequest");

      sequencing.processNavigationRequest("exit");

      expect(processExitRequestSpy).toHaveBeenCalledWith(activity);

      processExitRequestSpy.mockRestore();
    });

    it("should call processExitAllRequest for exitAll request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const processExitAllRequestSpy = vi.spyOn(sequencing, "processExitAllRequest");

      sequencing.processNavigationRequest("exitAll");

      expect(processExitAllRequestSpy).toHaveBeenCalled();

      processExitAllRequestSpy.mockRestore();
    });

    it("should call processAbandonRequest for abandon request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const processAbandonRequestSpy = vi.spyOn(sequencing, "processAbandonRequest");

      sequencing.processNavigationRequest("abandon");

      expect(processAbandonRequestSpy).toHaveBeenCalledWith(activity);

      processAbandonRequestSpy.mockRestore();
    });

    it("should call processAbandonAllRequest for abandonAll request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const processAbandonAllRequestSpy = vi.spyOn(sequencing, "processAbandonAllRequest");

      sequencing.processNavigationRequest("abandonAll");

      expect(processAbandonAllRequestSpy).toHaveBeenCalled();

      processAbandonAllRequestSpy.mockRestore();
    });

    it("should call processSuspendAllRequest for suspendAll request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const processSuspendAllRequestSpy = vi.spyOn(sequencing, "processSuspendAllRequest");

      sequencing.processNavigationRequest("suspendAll");

      expect(processSuspendAllRequestSpy).toHaveBeenCalledWith(activity);

      processSuspendAllRequestSpy.mockRestore();
    });

    it("should return false for choice request without implementation", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      // The choice request currently returns false as it's not implemented
      const result = sequencing.processNavigationRequest("choice");

      expect(result).toBe(false);
    });

    it("should throw an error for unknown request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      expect(() => sequencing.processNavigationRequest("unknownRequest")).toThrow();
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

    it("should handle EXIT_PARENT action from exit condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const parentActivity = new Activity("parent", "Parent Activity");
      const nextActivity = new Activity("next", "Next Activity");

      // eslint-disable-next-line
      // @ts-ignore
      activity._parent = parentActivity;

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockReturnValue(nextActivity);
      vi.spyOn(sequencing.sequencingRules, "evaluateExitConditionRules").mockReturnValue(
        RuleActionType.EXIT_PARENT,
      );

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processContinueRequest(activity);

      expect(result).toBe(true);
      expect(currentActivitySpy).toHaveBeenCalledWith(parentActivity);
    });

    it("should handle EXIT_ALL action from exit condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockReturnValue(nextActivity);
      vi.spyOn(sequencing.sequencingRules, "evaluateExitConditionRules").mockReturnValue(
        RuleActionType.EXIT_ALL,
      );

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processContinueRequest(activity);

      expect(result).toBe(true);
      expect(currentActivitySpy).toHaveBeenCalledWith(null);
    });

    it("should handle RETRY action from post condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockReturnValue(nextActivity);
      vi.spyOn(sequencing.sequencingRules, "evaluatePostConditionRules").mockReturnValue(
        RuleActionType.RETRY,
      );

      const incrementAttemptCountSpy = vi.spyOn(nextActivity, "incrementAttemptCount");

      const result = sequencing.processContinueRequest(activity);

      expect(result).toBe(true);
      expect(incrementAttemptCountSpy).toHaveBeenCalled();
    });

    it("should handle RETRY_ALL action from post condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");
      const allActivities = [activity, nextActivity];

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockReturnValue(nextActivity);
      vi.spyOn(sequencing.sequencingRules, "evaluatePostConditionRules").mockReturnValue(
        RuleActionType.RETRY_ALL,
      );
      vi.spyOn(sequencing.activityTree, "getAllActivities").mockReturnValue(allActivities);

      const incrementAttemptCountSpy1 = vi.spyOn(activity, "incrementAttemptCount");
      const incrementAttemptCountSpy2 = vi.spyOn(nextActivity, "incrementAttemptCount");

      const result = sequencing.processContinueRequest(activity);

      expect(result).toBe(true);
      expect(incrementAttemptCountSpy1).toHaveBeenCalled();
      expect(incrementAttemptCountSpy2).toHaveBeenCalled();
    });
  });

  describe("processPreviousRequest", () => {
    it("should return false if backward navigation is not allowed", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(false);

      expect(sequencing.processPreviousRequest(activity)).toBe(false);
    });

    it("should return false if there is no previous activity", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getPreviousSibling").mockReturnValue(null);

      expect(sequencing.processPreviousRequest(activity)).toBe(false);
    });

    it("should evaluate exit condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const previousActivity = new Activity("previous", "Previous Activity");

      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getPreviousSibling").mockReturnValue(previousActivity);

      const evaluateExitConditionRulesSpy = vi.spyOn(
        sequencing.sequencingRules,
        "evaluateExitConditionRules",
      );

      sequencing.processPreviousRequest(activity);

      expect(evaluateExitConditionRulesSpy).toHaveBeenCalledWith(activity);
    });

    it("should set previous activity as current activity", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const previousActivity = new Activity("previous", "Previous Activity");

      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getPreviousSibling").mockReturnValue(previousActivity);

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      sequencing.processPreviousRequest(activity);

      expect(currentActivitySpy).toHaveBeenCalledWith(previousActivity);
    });

    it("should evaluate post-condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const previousActivity = new Activity("previous", "Previous Activity");

      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getPreviousSibling").mockReturnValue(previousActivity);

      const evaluatePostConditionRulesSpy = vi.spyOn(
        sequencing.sequencingRules,
        "evaluatePostConditionRules",
      );

      sequencing.processPreviousRequest(activity);

      expect(evaluatePostConditionRulesSpy).toHaveBeenCalledWith(previousActivity);
    });

    it("should handle EXIT_PARENT action from exit condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const parentActivity = new Activity("parent", "Parent Activity");
      const previousActivity = new Activity("previous", "Previous Activity");

      // eslint-disable-next-line
      // @ts-ignore
      activity._parent = parentActivity;

      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getPreviousSibling").mockReturnValue(previousActivity);
      vi.spyOn(sequencing.sequencingRules, "evaluateExitConditionRules").mockReturnValue(
        RuleActionType.EXIT_PARENT,
      );

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processPreviousRequest(activity);

      expect(result).toBe(true);
      expect(currentActivitySpy).toHaveBeenCalledWith(parentActivity);
    });
  });

  describe("processExitRequest", () => {
    it("should return false if choice exit is not allowed", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      vi.spyOn(sequencing.sequencingControls, "choiceExit", "get").mockReturnValue(false);

      expect(sequencing.processExitRequest(activity)).toBe(false);
    });

    it("should return false if activity has no parent", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      vi.spyOn(sequencing.sequencingControls, "choiceExit", "get").mockReturnValue(true);

      expect(sequencing.processExitRequest(activity)).toBe(false);
    });

    it("should set parent as current activity", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const parentActivity = new Activity("parent", "Parent Activity");

      // eslint-disable-next-line
      // @ts-ignore
      activity._parent = parentActivity;

      vi.spyOn(sequencing.sequencingControls, "choiceExit", "get").mockReturnValue(true);
      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processExitRequest(activity);

      expect(result).toBe(true);
      expect(currentActivitySpy).toHaveBeenCalledWith(parentActivity);
    });
  });

  describe("processExitAllRequest", () => {
    it("should return false if choice exit is not allowed", () => {
      const sequencing = new Sequencing();

      vi.spyOn(sequencing.sequencingControls, "choiceExit", "get").mockReturnValue(false);

      expect(sequencing.processExitAllRequest()).toBe(false);
    });

    it("should set current activity to null", () => {
      const sequencing = new Sequencing();

      vi.spyOn(sequencing.sequencingControls, "choiceExit", "get").mockReturnValue(true);
      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processExitAllRequest();

      expect(result).toBe(true);
      expect(currentActivitySpy).toHaveBeenCalledWith(null);
    });
  });

  describe("processAbandonRequest", () => {
    it("should return false if activity has no parent", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      expect(sequencing.processAbandonRequest(activity)).toBe(false);
    });

    it("should set parent as current activity without processing exit rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const parentActivity = new Activity("parent", "Parent Activity");

      // eslint-disable-next-line
      // @ts-ignore
      activity._parent = parentActivity;

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");
      const evaluateExitConditionRulesSpy = vi.spyOn(
        sequencing.sequencingRules,
        "evaluateExitConditionRules",
      );

      const result = sequencing.processAbandonRequest(activity);

      expect(result).toBe(true);
      expect(currentActivitySpy).toHaveBeenCalledWith(parentActivity);
      expect(evaluateExitConditionRulesSpy).not.toHaveBeenCalled();
    });
  });

  describe("processAbandonAllRequest", () => {
    it("should set current activity to null without processing exit rules", () => {
      const sequencing = new Sequencing();

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processAbandonAllRequest();

      expect(result).toBe(true);
      expect(currentActivitySpy).toHaveBeenCalledWith(null);
    });
  });

  describe("processSuspendAllRequest", () => {
    it("should set suspended activity and clear current activity", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      const suspendedActivitySpy = vi.spyOn(sequencing.activityTree, "suspendedActivity", "set");
      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processSuspendAllRequest(activity);

      expect(result).toBe(true);
      expect(suspendedActivitySpy).toHaveBeenCalledWith(activity);
      expect(currentActivitySpy).toHaveBeenCalledWith(null);
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
      const processRollupRecursiveSpy = vi.spyOn(sequencing as any, "_processRollupRecursive");

      sequencing.processRollup();

      expect(processRollupRecursiveSpy).toHaveBeenCalledWith(root);

      processRollupSpy.mockRestore();
      processRollupRecursiveSpy.mockRestore();
    });
  });

  describe("_processRollupRecursive", () => {
    it("should process rollup for children first, then for the activity", () => {
      const sequencing = new Sequencing();
      const root = new Activity("root", "Root Activity");
      const child1 = new Activity("child1", "Child 1");
      const child2 = new Activity("child2", "Child 2");

      // Add children using the addChild method
      root.addChild(child1);
      root.addChild(child2);

      const processRollupSpy = vi.spyOn(sequencing.rollupRules, "processRollup");

      (sequencing as any)._processRollupRecursive(root);

      // Should process children first, then root
      expect(processRollupSpy).toHaveBeenNthCalledWith(1, child1);
      expect(processRollupSpy).toHaveBeenNthCalledWith(2, child2);
      expect(processRollupSpy).toHaveBeenNthCalledWith(3, root);

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
