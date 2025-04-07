import { describe, it } from "mocha";
import { expect } from "expect";
import { Scorm2004API } from "../../src/Scorm2004API";
import { Activity } from "../../src/cmi/scorm2004/sequencing/activity";
import {
  SequencingRule,
  RuleConditionType,
  RuleActionType,
  RuleConditionOperator,
} from "../../src/cmi/scorm2004/sequencing/sequencing_rules";
import {
  RollupRule,
  RollupConditionType,
  RollupActionType,
  RollupConsiderationType,
} from "../../src/cmi/scorm2004/sequencing/rollup_rules";

describe("Sequencing Configuration", () => {
  describe("Activity Tree Configuration", () => {
    it("should configure the activity tree based on settings", () => {
      // Create API with sequencing settings
      const api = new Scorm2004API({
        sequencing: {
          activityTree: {
            id: "root",
            title: "Course",
            children: [
              {
                id: "module1",
                title: "Module 1",
                children: [
                  {
                    id: "lesson1",
                    title: "Lesson 1",
                  },
                  {
                    id: "lesson2",
                    title: "Lesson 2",
                  },
                ],
              },
              {
                id: "module2",
                title: "Module 2",
                children: [
                  {
                    id: "lesson3",
                    title: "Lesson 3",
                  },
                  {
                    id: "lesson4",
                    title: "Lesson 4",
                  },
                ],
              },
            ],
          },
        },
      });

      // Access the sequencing object and activity tree
      const sequencing = (api as any)._sequencing;
      const activityTree = sequencing.activityTree;

      // Verify the root activity
      expect(activityTree.root).toBeDefined();
      expect(activityTree.root.id).toBe("root");
      expect(activityTree.root.title).toBe("Course");

      // Verify the children
      expect(activityTree.root.children.length).toBe(2);

      // Verify module1
      const module1 = activityTree.root.children[0];
      expect(module1.id).toBe("module1");
      expect(module1.title).toBe("Module 1");
      expect(module1.children.length).toBe(2);

      // Verify module1's children
      expect(module1.children[0].id).toBe("lesson1");
      expect(module1.children[0].title).toBe("Lesson 1");
      expect(module1.children[1].id).toBe("lesson2");
      expect(module1.children[1].title).toBe("Lesson 2");

      // Verify module2
      const module2 = activityTree.root.children[1];
      expect(module2.id).toBe("module2");
      expect(module2.title).toBe("Module 2");
      expect(module2.children.length).toBe(2);

      // Verify module2's children
      expect(module2.children[0].id).toBe("lesson3");
      expect(module2.children[0].title).toBe("Lesson 3");
      expect(module2.children[1].id).toBe("lesson4");
      expect(module2.children[1].title).toBe("Lesson 4");
    });

    it("should configure activity properties", () => {
      // Create API with sequencing settings
      const api = new Scorm2004API({
        sequencing: {
          activityTree: {
            id: "root",
            title: "Course",
            isVisible: false,
            isActive: true,
            isSuspended: true,
            isCompleted: true,
          },
        },
      });

      // Access the sequencing object and activity tree
      const sequencing = (api as any)._sequencing;
      const activityTree = sequencing.activityTree;

      // Verify the root activity properties
      expect(activityTree.root.isVisible).toBe(false);
      expect(activityTree.root.isActive).toBe(true);
      expect(activityTree.root.isSuspended).toBe(true);
      expect(activityTree.root.isCompleted).toBe(true);
    });
  });

  describe("Sequencing Rules Configuration", () => {
    it("should configure sequencing rules based on settings", () => {
      // Create API with sequencing settings
      const api = new Scorm2004API({
        sequencing: {
          sequencingRules: {
            preConditionRules: [
              {
                action: RuleActionType.SKIP,
                conditionCombination: RuleConditionOperator.AND,
                conditions: [
                  {
                    condition: RuleConditionType.COMPLETED,
                    operator: RuleConditionOperator.NOT,
                  },
                ],
              },
            ],
            exitConditionRules: [
              {
                action: RuleActionType.EXIT_PARENT,
                conditions: [
                  {
                    condition: RuleConditionType.COMPLETED,
                  },
                ],
              },
            ],
            postConditionRules: [
              {
                action: RuleActionType.CONTINUE,
                conditions: [
                  {
                    condition: RuleConditionType.COMPLETED,
                  },
                ],
              },
            ],
          },
        },
      });

      // Access the sequencing object and sequencing rules
      const sequencing = (api as any)._sequencing;
      const sequencingRules = sequencing.sequencingRules;

      // Verify pre-condition rules
      expect(sequencingRules.preConditionRules.length).toBe(1);
      expect(sequencingRules.preConditionRules[0].action).toBe(RuleActionType.SKIP);
      expect(sequencingRules.preConditionRules[0].conditionCombination).toBe(
        RuleConditionOperator.AND,
      );
      expect(sequencingRules.preConditionRules[0].conditions.length).toBe(1);
      expect(sequencingRules.preConditionRules[0].conditions[0].condition).toBe(
        RuleConditionType.COMPLETED,
      );
      expect(sequencingRules.preConditionRules[0].conditions[0].operator).toBe(
        RuleConditionOperator.NOT,
      );

      // Verify exit condition rules
      expect(sequencingRules.exitConditionRules.length).toBe(1);
      expect(sequencingRules.exitConditionRules[0].action).toBe(RuleActionType.EXIT_PARENT);
      expect(sequencingRules.exitConditionRules[0].conditions.length).toBe(1);
      expect(sequencingRules.exitConditionRules[0].conditions[0].condition).toBe(
        RuleConditionType.COMPLETED,
      );

      // Verify post-condition rules
      expect(sequencingRules.postConditionRules.length).toBe(1);
      expect(sequencingRules.postConditionRules[0].action).toBe(RuleActionType.CONTINUE);
      expect(sequencingRules.postConditionRules[0].conditions.length).toBe(1);
      expect(sequencingRules.postConditionRules[0].conditions[0].condition).toBe(
        RuleConditionType.COMPLETED,
      );
    });
  });

  describe("Sequencing Controls Configuration", () => {
    it("should configure sequencing controls based on settings", () => {
      // Create API with sequencing settings
      const api = new Scorm2004API({
        sequencing: {
          sequencingControls: {
            enabled: false,
            choiceExit: false,
            flow: true,
            forwardOnly: true,
            useCurrentAttemptObjectiveInfo: false,
            useCurrentAttemptProgressInfo: false,
            preventActivation: true,
            constrainChoice: true,
            rollupObjectiveSatisfied: false,
            rollupProgressCompletion: false,
            objectiveMeasureWeight: 0.5,
          },
        },
      });

      // Access the sequencing object and sequencing controls
      const sequencing = (api as any)._sequencing;
      const sequencingControls = sequencing.sequencingControls;

      // Verify sequencing controls
      expect(sequencingControls.enabled).toBe(false);
      expect(sequencingControls.choiceExit).toBe(false);
      expect(sequencingControls.flow).toBe(true);
      expect(sequencingControls.forwardOnly).toBe(true);
      expect(sequencingControls.useCurrentAttemptObjectiveInfo).toBe(false);
      expect(sequencingControls.useCurrentAttemptProgressInfo).toBe(false);
      expect(sequencingControls.preventActivation).toBe(true);
      expect(sequencingControls.constrainChoice).toBe(true);
      expect(sequencingControls.rollupObjectiveSatisfied).toBe(false);
      expect(sequencingControls.rollupProgressCompletion).toBe(false);
      expect(sequencingControls.objectiveMeasureWeight).toBe(0.5);
    });
  });

  describe("Rollup Rules Configuration", () => {
    it("should configure rollup rules based on settings", () => {
      // Create API with sequencing settings
      const api = new Scorm2004API({
        sequencing: {
          rollupRules: {
            rules: [
              {
                action: RollupActionType.COMPLETED,
                consideration: RollupConsiderationType.ALL,
                conditions: [
                  {
                    condition: RollupConditionType.COMPLETED,
                  },
                ],
              },
              {
                action: RollupActionType.SATISFIED,
                consideration: RollupConsiderationType.AT_LEAST_COUNT,
                minimumCount: 2,
                conditions: [
                  {
                    condition: RollupConditionType.SATISFIED,
                  },
                ],
              },
            ],
          },
        },
      });

      // Access the sequencing object and rollup rules
      const sequencing = (api as any)._sequencing;
      const rollupRules = sequencing.rollupRules;

      // Verify rollup rules
      expect(rollupRules.rules.length).toBe(2);

      // Verify first rule
      expect(rollupRules.rules[0].action).toBe(RollupActionType.COMPLETED);
      expect(rollupRules.rules[0].consideration).toBe(RollupConsiderationType.ALL);
      expect(rollupRules.rules[0].conditions.length).toBe(1);
      expect(rollupRules.rules[0].conditions[0].condition).toBe(RollupConditionType.COMPLETED);

      // Verify second rule
      expect(rollupRules.rules[1].action).toBe(RollupActionType.SATISFIED);
      expect(rollupRules.rules[1].consideration).toBe(RollupConsiderationType.AT_LEAST_COUNT);
      expect(rollupRules.rules[1].minimumCount).toBe(2);
      expect(rollupRules.rules[1].conditions.length).toBe(1);
      expect(rollupRules.rules[1].conditions[0].condition).toBe(RollupConditionType.SATISFIED);
    });
  });
});
