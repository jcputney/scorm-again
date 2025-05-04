import { describe, expect, it, vi } from "vitest";
import { Sequencing } from "../../../../src/cmi/scorm2004/sequencing/sequencing";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { RuleActionType } from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { ADLNav } from "../../../../src";

describe("Additional Sequencing Tests", () => {
  describe("processNavigationRequest", () => {
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
    it("should handle CONTINUE post-condition action", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");
      const nextNextActivity = new Activity("nextNext", "Next Next Activity");

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getNextSibling")
        .mockReturnValueOnce(nextActivity)
        .mockReturnValueOnce(nextNextActivity);

      vi.spyOn(sequencing.sequencingRules, "evaluatePostConditionRules")
        .mockReturnValueOnce(RuleActionType.CONTINUE)
        .mockReturnValueOnce(null);

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processContinueRequest(activity);

      expect(result).toBe(true);
      // Should have set nextNextActivity as current (after continuing from nextActivity)
      expect(currentActivitySpy).toHaveBeenCalledWith(nextNextActivity);
    });

    it("should handle PREVIOUS post-condition action", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");
      const previousActivity = new Activity("previous", "Previous Activity");

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockReturnValue(nextActivity);
      vi.spyOn(sequencing.activityTree, "getPreviousSibling").mockReturnValue(previousActivity);

      vi.spyOn(sequencing.sequencingRules, "evaluatePostConditionRules")
        .mockReturnValueOnce(RuleActionType.PREVIOUS)
        .mockReturnValueOnce(null);

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processContinueRequest(activity);

      expect(result).toBe(true);
      // Should have set previousActivity as current (after going previous from nextActivity)
      expect(currentActivitySpy).toHaveBeenCalledWith(previousActivity);
    });

    it("should handle EXIT post-condition action", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");

      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockReturnValue(nextActivity);

      vi.spyOn(sequencing.sequencingRules, "evaluatePostConditionRules")
        .mockReturnValue(RuleActionType.EXIT);

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processContinueRequest(activity);

      expect(result).toBe(true);
      // Should have set original activity as current (after exiting from nextActivity)
      expect(currentActivitySpy).toHaveBeenCalledWith(activity);
    });
  });

  describe("processPreviousRequest", () => {
    it("should handle CONTINUE post-condition action", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const previousActivity = new Activity("previous", "Previous Activity");
      const nextActivity = new Activity("next", "Next Activity");

      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.sequencingControls, "isForwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getPreviousSibling").mockReturnValue(previousActivity);
      vi.spyOn(sequencing.activityTree, "getNextSibling").mockReturnValue(nextActivity);

      vi.spyOn(sequencing.sequencingRules, "evaluatePostConditionRules")
        .mockReturnValueOnce(RuleActionType.CONTINUE)
        .mockReturnValueOnce(null);

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processPreviousRequest(activity);

      expect(result).toBe(true);
      // Should have set nextActivity as current (after continuing from previousActivity)
      expect(currentActivitySpy).toHaveBeenCalledWith(nextActivity);
    });

    it("should handle PREVIOUS post-condition action", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const previousActivity = new Activity("previous", "Previous Activity");
      const previousPreviousActivity = new Activity("previousPrevious", "Previous Previous Activity");

      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getPreviousSibling")
        .mockReturnValueOnce(previousActivity)
        .mockReturnValueOnce(previousPreviousActivity);

      vi.spyOn(sequencing.sequencingRules, "evaluatePostConditionRules")
        .mockReturnValueOnce(RuleActionType.PREVIOUS)
        .mockReturnValueOnce(null);

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processPreviousRequest(activity);

      expect(result).toBe(true);
      // Should have set previousPreviousActivity as current (after going previous from previousActivity)
      expect(currentActivitySpy).toHaveBeenCalledWith(previousPreviousActivity);
    });

    it("should handle EXIT post-condition action", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const previousActivity = new Activity("previous", "Previous Activity");

      vi.spyOn(sequencing.sequencingControls, "isBackwardNavigationAllowed").mockReturnValue(true);
      vi.spyOn(sequencing.activityTree, "getPreviousSibling").mockReturnValue(previousActivity);

      vi.spyOn(sequencing.sequencingRules, "evaluatePostConditionRules")
        .mockReturnValue(RuleActionType.EXIT);

      const currentActivitySpy = vi.spyOn(sequencing.activityTree, "currentActivity", "set");

      const result = sequencing.processPreviousRequest(activity);

      expect(result).toBe(true);
      // Should have set original activity as current (after exiting from previousActivity)
      expect(currentActivitySpy).toHaveBeenCalledWith(activity);
    });
  });

  describe("_handleExitConditionAction", () => {
    it("should return false when EXIT_PARENT is returned but activity has no parent", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      vi.spyOn(sequencing.sequencingRules, "evaluateExitConditionRules")
        .mockReturnValue(RuleActionType.EXIT_PARENT);

      // Call the private method using type assertion
      const result = (sequencing as any)._handleExitConditionAction(activity);

      expect(result).toBe(false);
    });
  });
});
