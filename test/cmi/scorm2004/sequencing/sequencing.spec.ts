import { describe, it } from "mocha";
import { expect } from "expect";
import * as sinon from "sinon";
import { Sequencing } from "../../../../src/cmi/scorm2004/sequencing/sequencing";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Activity } from "../../../../src/cmi/scorm2004/sequencing/activity";
import {
  SequencingRules,
  RuleActionType,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";
import { SequencingControls } from "../../../../src/cmi/scorm2004/sequencing/sequencing_controls";
import { RollupRules } from "../../../../src/cmi/scorm2004/sequencing/rollup_rules";
import { ADLNav } from "../../../../src/cmi/scorm2004/adl";
import { Scorm2004ValidationError } from "../../../../src/exceptions/scorm2004_exceptions";

describe("Sequencing", () => {
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

      const activityTreeInitializeSpy = sinon.spy(sequencing.activityTree, "initialize");
      const sequencingRulesInitializeSpy = sinon.spy(sequencing.sequencingRules, "initialize");
      const sequencingControlsInitializeSpy = sinon.spy(
        sequencing.sequencingControls,
        "initialize",
      );
      const rollupRulesInitializeSpy = sinon.spy(sequencing.rollupRules, "initialize");

      sequencing.initialize();

      expect(activityTreeInitializeSpy.called).toBe(true);
      expect(sequencingRulesInitializeSpy.called).toBe(true);
      expect(sequencingControlsInitializeSpy.called).toBe(true);
      expect(rollupRulesInitializeSpy.called).toBe(true);
      expect(sequencing.initialized).toBe(true);

      activityTreeInitializeSpy.restore();
      sequencingRulesInitializeSpy.restore();
      sequencingControlsInitializeSpy.restore();
      rollupRulesInitializeSpy.restore();
    });
  });

  describe("reset", () => {
    it("should reset all components", () => {
      const sequencing = new Sequencing();

      const activityTreeResetSpy = sinon.spy(sequencing.activityTree, "reset");
      const sequencingRulesResetSpy = sinon.spy(sequencing.sequencingRules, "reset");
      const sequencingControlsResetSpy = sinon.spy(sequencing.sequencingControls, "reset");
      const rollupRulesResetSpy = sinon.spy(sequencing.rollupRules, "reset");

      sequencing.reset();

      expect(activityTreeResetSpy.called).toBe(true);
      expect(sequencingRulesResetSpy.called).toBe(true);
      expect(sequencingControlsResetSpy.called).toBe(true);
      expect(rollupRulesResetSpy.called).toBe(true);
      expect(sequencing.initialized).toBe(false);

      activityTreeResetSpy.restore();
      sequencingRulesResetSpy.restore();
      sequencingControlsResetSpy.restore();
      rollupRulesResetSpy.restore();
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
      const adlNav = new ADLNav();

      sequencing.adlNav = adlNav;

      expect(sequencing.processNavigationRequest("continue")).toBe(false);
    });

    it("should set the navigation request on adlNav", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const adlNavRequestSpy = sinon.spy(adlNav, "request", ["set"]);

      sequencing.processNavigationRequest("continue");

      expect(adlNavRequestSpy.set.calledWith("continue")).toBe(true);

      adlNavRequestSpy.set.restore();
    });

    it("should evaluate pre-condition rules", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const evaluatePreConditionRulesSpy = sinon.spy(
        sequencing.sequencingRules,
        "evaluatePreConditionRules",
      );

      sequencing.processNavigationRequest("continue");

      expect(evaluatePreConditionRulesSpy.calledWith(activity)).toBe(true);

      evaluatePreConditionRulesSpy.restore();
    });

    it("should return false if pre-condition rules return SKIP", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      sinon
        .stub(sequencing.sequencingRules, "evaluatePreConditionRules")
        .returns(RuleActionType.SKIP);

      expect(sequencing.processNavigationRequest("continue")).toBe(false);

      (sequencing.sequencingRules.evaluatePreConditionRules as sinon.SinonStub).restore();
    });

    it("should call processContinueRequest for continue request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const processContinueRequestSpy = sinon.spy(sequencing, "processContinueRequest");

      sequencing.processNavigationRequest("continue");

      expect(processContinueRequestSpy.calledWith(activity)).toBe(true);

      processContinueRequestSpy.restore();
    });

    it("should call processPreviousRequest for previous request", () => {
      const sequencing = new Sequencing();
      const adlNav = new ADLNav();
      const activity = new Activity("activity", "Activity");

      sequencing.adlNav = adlNav;
      sequencing.activityTree.currentActivity = activity;

      const processPreviousRequestSpy = sinon.spy(sequencing, "processPreviousRequest");

      sequencing.processNavigationRequest("previous");

      expect(processPreviousRequestSpy.calledWith(activity)).toBe(true);

      processPreviousRequestSpy.restore();
    });
  });

  describe("processContinueRequest", () => {
    it("should return false if forward navigation is not allowed", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      sinon.stub(sequencing.sequencingControls, "isForwardNavigationAllowed").returns(false);

      expect(sequencing.processContinueRequest(activity)).toBe(false);

      (sequencing.sequencingControls.isForwardNavigationAllowed as sinon.SinonStub).restore();
    });

    it("should return false if there is no next activity", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");

      sinon.stub(sequencing.sequencingControls, "isForwardNavigationAllowed").returns(true);
      sinon.stub(sequencing.activityTree, "getNextSibling").returns(null);

      expect(sequencing.processContinueRequest(activity)).toBe(false);

      (sequencing.sequencingControls.isForwardNavigationAllowed as sinon.SinonStub).restore();
      (sequencing.activityTree.getNextSibling as sinon.SinonStub).restore();
    });

    it("should evaluate exit condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");

      sinon.stub(sequencing.sequencingControls, "isForwardNavigationAllowed").returns(true);
      sinon.stub(sequencing.activityTree, "getNextSibling").returns(nextActivity);

      const evaluateExitConditionRulesSpy = sinon.spy(
        sequencing.sequencingRules,
        "evaluateExitConditionRules",
      );

      sequencing.processContinueRequest(activity);

      expect(evaluateExitConditionRulesSpy.calledWith(activity)).toBe(true);

      evaluateExitConditionRulesSpy.restore();
      (sequencing.sequencingControls.isForwardNavigationAllowed as sinon.SinonStub).restore();
      (sequencing.activityTree.getNextSibling as sinon.SinonStub).restore();
    });

    it("should set next activity as current activity", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");

      sinon.stub(sequencing.sequencingControls, "isForwardNavigationAllowed").returns(true);
      sinon.stub(sequencing.activityTree, "getNextSibling").returns(nextActivity);

      const currentActivitySpy = sinon.spy(sequencing.activityTree, "currentActivity", ["set"]);

      sequencing.processContinueRequest(activity);

      expect(currentActivitySpy.set.calledWith(nextActivity)).toBe(true);

      currentActivitySpy.set.restore();
      (sequencing.sequencingControls.isForwardNavigationAllowed as sinon.SinonStub).restore();
      (sequencing.activityTree.getNextSibling as sinon.SinonStub).restore();
    });

    it("should evaluate post-condition rules", () => {
      const sequencing = new Sequencing();
      const activity = new Activity("activity", "Activity");
      const nextActivity = new Activity("next", "Next Activity");

      sinon.stub(sequencing.sequencingControls, "isForwardNavigationAllowed").returns(true);
      sinon.stub(sequencing.activityTree, "getNextSibling").returns(nextActivity);

      const evaluatePostConditionRulesSpy = sinon.spy(
        sequencing.sequencingRules,
        "evaluatePostConditionRules",
      );

      sequencing.processContinueRequest(activity);

      expect(evaluatePostConditionRulesSpy.calledWith(nextActivity)).toBe(true);

      evaluatePostConditionRulesSpy.restore();
      (sequencing.sequencingControls.isForwardNavigationAllowed as sinon.SinonStub).restore();
      (sequencing.activityTree.getNextSibling as sinon.SinonStub).restore();
    });
  });

  describe("processRollup", () => {
    it("should do nothing if root is null", () => {
      const sequencing = new Sequencing();

      const processRollupSpy = sinon.spy(sequencing.rollupRules, "processRollup");

      sequencing.processRollup();

      expect(processRollupSpy.called).toBe(false);

      processRollupSpy.restore();
    });

    it("should process rollup for the root activity", () => {
      const sequencing = new Sequencing();
      const root = new Activity("root", "Root Activity");

      sequencing.activityTree.root = root;

      const processRollupSpy = sinon.spy(sequencing.rollupRules, "processRollup");

      sequencing.processRollup();

      expect(processRollupSpy.calledWith(root)).toBe(true);

      processRollupSpy.restore();
    });
  });

  describe("toJSON", () => {
    it("should return a JSON representation of the sequencing object", () => {
      const sequencing = new Sequencing();

      const result = sequencing.toJSON();

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
