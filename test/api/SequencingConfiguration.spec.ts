import { describe, it } from "vitest";

import Scorm2004API from "../../src/Scorm2004API";
import { SelectionRandomization } from "../../src/cmi/scorm2004/sequencing/selection_randomization";
import {
  RuleActionType,
  RuleConditionOperator,
  RuleConditionType,
} from "../../src/cmi/scorm2004/sequencing/sequencing_rules";
import {
  RollupActionType,
  RollupConditionType,
  RollupConsiderationType,
} from "../../src/cmi/scorm2004/sequencing/rollup_rules";
import {
  RandomizationTiming,
  SelectionTiming,
} from "../../src/cmi/scorm2004/sequencing/sequencing_controls";

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

    it("should configure ADL rollup considerations for activities", () => {
      const api = new Scorm2004API({
        sequencing: {
          activityTree: {
            id: "root",
            title: "Course",
            rollupConsiderations: {
              requiredForSatisfied: "ifAttempted",
              requiredForNotSatisfied: "ifNotSkipped",
              requiredForCompleted: "ifNotSuspended",
              requiredForIncomplete: "ifAttempted",
              measureSatisfactionIfActive: false,
            },
            children: [
              {
                id: "lesson",
                title: "Lesson",
                rollupConsiderations: {
                  requiredForSatisfied: "ifNotSuspended",
                  measureSatisfactionIfActive: true,
                },
              },
            ],
          },
        },
      });

      const sequencing = (api as any)._sequencing;
      const rootActivity = sequencing.activityTree.root;
      const child = rootActivity.children[0];

      expect(rootActivity.rollupConsiderations).toMatchObject({
        requiredForSatisfied: "ifAttempted",
        requiredForNotSatisfied: "ifNotSkipped",
        requiredForCompleted: "ifNotSuspended",
        requiredForIncomplete: "ifAttempted",
        measureSatisfactionIfActive: false,
      });

      expect(child.rollupConsiderations).toMatchObject({
        requiredForSatisfied: "ifNotSuspended",
        requiredForNotSatisfied: "always",
        requiredForCompleted: "always",
        requiredForIncomplete: "always",
        measureSatisfactionIfActive: true,
      });
    });

    it("should configure auxiliary resources", () => {
      const api = new Scorm2004API({
        sequencing: {
          auxiliaryResources: [
            { resourceId: "urn:scorm-again:help", purpose: "help" },
            { resourceId: "urn:scorm-again:glossary", purpose: "glossary" },
          ],
          activityTree: {
            id: "root",
            title: "Root",
            auxiliaryResources: [{ resourceId: "urn:scorm-again:root-notes", purpose: "notes" }],
            children: [
              {
                id: "child",
                title: "Child",
                auxiliaryResources: [{ resourceId: "urn:scorm-again:child-job-aid", purpose: "job-aid" }],
              },
            ],
          },
        },
      });

      const sequencing = (api as any)._sequencing;
      expect(sequencing.auxiliaryResources).toEqual([
        { resourceId: "urn:scorm-again:help", purpose: "help" },
        { resourceId: "urn:scorm-again:glossary", purpose: "glossary" },
      ]);

      const root = sequencing.activityTree.root;
      expect(root.auxiliaryResources).toEqual([
        { resourceId: "urn:scorm-again:root-notes", purpose: "notes" },
      ]);

      const child = root.children[0];
      expect(child.auxiliaryResources).toEqual([
        { resourceId: "urn:scorm-again:child-job-aid", purpose: "job-aid" },
      ]);
    });

    it("should configure hideLmsUi directives", () => {
      const api = new Scorm2004API({
        sequencing: {
          hideLmsUi: ["continue", "exit", "continue"],
          activityTree: {
            id: "root",
            title: "Root",
            hideLmsUi: ["previous", "invalid" as any],
            children: [
              {
                id: "child",
                title: "Child",
                hideLmsUi: ["abandon", "exit", "abandon"],
              },
            ],
          },
        },
      });

      const sequencing = (api as any)._sequencing;
      expect(sequencing.hideLmsUi).toEqual(["continue", "exit"]);

      const root = sequencing.activityTree.root;
      expect(root.hideLmsUi).toEqual(["previous"]);

      const child = root.children[0];
      expect(child.hideLmsUi).toEqual(["abandon", "exit"]);
    });

    it("should apply sequencing collections to activities", () => {
      const api = new Scorm2004API({
        sequencing: {
          hideLmsUi: ["exit"],
          collections: {
            clusterDefaults: {
              sequencingControls: {
                flow: true,
                choice: false,
              },
              sequencingRules: {
                preConditionRules: [
                  {
                    action: RuleActionType.SKIP,
                    conditions: [
                      {
                        condition: RuleConditionType.COMPLETED,
                        operator: RuleConditionOperator.NOT,
                      },
                    ],
                  },
                ],
              },
              hideLmsUi: ["continue"],
            },
            leafSelection: {
              selectionRandomizationState: {
                childOrder: ["leaf1", "leaf2"],
                selectedChildIds: ["leaf1"],
                hiddenFromChoiceChildIds: ["leaf2"],
              },
            },
          },
          activityTree: {
            id: "root",
            title: "Root",
            sequencingCollectionRefs: "clusterDefaults",
            sequencingControls: {
              choice: true,
            },
            children: [
              {
                id: "cluster",
                title: "Cluster",
                sequencingCollectionRefs: ["clusterDefaults", "leafSelection"],
                children: [
                  { id: "leaf1", title: "Leaf 1" },
                  { id: "leaf2", title: "Leaf 2" },
                ],
              },
            ],
          },
        },
      });

      const sequencing = (api as any)._sequencing;
      const root = sequencing.activityTree.root;
      const cluster = root.children[0];

      expect(root.sequencingControls.flow).toBe(true);
      expect(root.sequencingControls.choice).toBe(true);
      expect(root.sequencingControls.choiceExit).toBe(true);
      expect(root.hideLmsUi).toEqual(["continue"]);

      expect(cluster.sequencingControls.flow).toBe(true);
      expect(cluster.sequencingControls.choice).toBe(false);
      expect(cluster.sequencingControls.choiceExit).toBe(true);
      expect(cluster.sequencingRules.preConditionRules.length).toBe(1);
      expect(cluster.hideLmsUi).toEqual(["continue"]);

      expect(cluster.children.map((child: any) => child.id)).toEqual(["leaf1", "leaf2"]);
      expect(cluster.getAvailableChildren().map((child: any) => child.id)).toEqual(["leaf1"]);
    });

    it("should allow multiple activities to reuse the same collections", () => {
      const api = new Scorm2004API({
        sequencing: {
          collections: {
            leafDefaults: {
              sequencingControls: {
                flow: true,
                choice: false,
              },
              hideLmsUi: ["continue"],
              selectionRandomizationState: {
                childOrder: ["leafA", "leafB"],
                selectedChildIds: ["leafA"],
              },
            },
          },
          activityTree: {
            id: "root",
            title: "Root",
            children: [
              {
                id: "cluster1",
                title: "Cluster 1",
                sequencingCollectionRefs: "leafDefaults",
                children: [
                  { id: "leafA", title: "Leaf A" },
                  { id: "leafB", title: "Leaf B" },
                ],
              },
              {
                id: "cluster2",
                title: "Cluster 2",
                sequencingCollectionRefs: "leafDefaults",
                children: [
                  { id: "leafC", title: "Leaf C" },
                  { id: "leafD", title: "Leaf D" },
                ],
              },
            ],
          },
        },
      });

      const sequencing = (api as any)._sequencing;
      const root = sequencing.activityTree.root;
      const cluster1 = root.children[0];
      const cluster2 = root.children[1];

      expect(cluster1.sequencingControls.flow).toBe(true);
      expect(cluster1.sequencingControls.choice).toBe(false);
      expect(cluster1.hideLmsUi).toEqual(["continue"]);
      const availableCluster1 = SelectionRandomization.applySelectionAndRandomization(cluster1, false);
      expect(availableCluster1.map((child: any) => child.id)).toEqual(["leafA"]);

      expect(cluster2.sequencingControls.flow).toBe(true);
      expect(cluster2.sequencingControls.choice).toBe(false);
      expect(cluster2.hideLmsUi).toEqual(["continue"]);
      const availableCluster2 = SelectionRandomization.applySelectionAndRandomization(cluster2, false);
      expect(availableCluster2.map((child: any) => child.id)).toEqual([]);
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
            choice: false,
            choiceExit: false,
            flow: true,
            forwardOnly: true,
            useCurrentAttemptObjectiveInfo: false,
            useCurrentAttemptProgressInfo: false,
            preventActivation: true,
            constrainChoice: true,
            stopForwardTraversal: true,
            rollupObjectiveSatisfied: false,
            rollupProgressCompletion: false,
            objectiveMeasureWeight: 0.5,
            selectionTiming: SelectionTiming.ONCE,
            selectCount: 2,
          randomizeChildren: true,
          randomizationTiming: RandomizationTiming.ON_EACH_NEW_ATTEMPT,
          selectionCountStatus: true,
          reorderChildren: true,
        },
      },
    });

      // Access the sequencing object and sequencing controls
      const sequencing = (api as any)._sequencing;
      const sequencingControls = sequencing.sequencingControls;

      // Verify sequencing controls
      expect(sequencingControls.enabled).toBe(false);
      expect(sequencingControls.choice).toBe(false);
      expect(sequencingControls.choiceExit).toBe(false);
      expect(sequencingControls.flow).toBe(true);
      expect(sequencingControls.forwardOnly).toBe(true);
      expect(sequencingControls.useCurrentAttemptObjectiveInfo).toBe(false);
      expect(sequencingControls.useCurrentAttemptProgressInfo).toBe(false);
      expect(sequencingControls.preventActivation).toBe(true);
      expect(sequencingControls.constrainChoice).toBe(true);
      expect(sequencingControls.stopForwardTraversal).toBe(true);
      expect(sequencingControls.rollupObjectiveSatisfied).toBe(false);
      expect(sequencingControls.rollupProgressCompletion).toBe(false);
      expect(sequencingControls.objectiveMeasureWeight).toBe(0.5);
      expect(sequencingControls.selectionTiming).toBe(SelectionTiming.ONCE);
      expect(sequencingControls.selectCount).toBe(2);
      expect(sequencingControls.randomizeChildren).toBe(true);
      expect(sequencingControls.randomizationTiming).toBe(
        RandomizationTiming.ON_EACH_NEW_ATTEMPT,
      );
      expect(sequencingControls.selectionCountStatus).toBe(true);
      expect(sequencingControls.reorderChildren).toBe(true);
    });
  });

  describe("Per-activity sequencing control overrides", () => {
    it("should apply selection and randomization fields to individual activities", () => {
      const api = new Scorm2004API({
        sequencing: {
          activityTree: {
            id: "root",
            title: "Root",
            sequencingControls: {
              selectionTiming: SelectionTiming.ON_EACH_NEW_ATTEMPT,
              selectCount: 1,
              randomizeChildren: true,
              randomizationTiming: RandomizationTiming.ONCE,
              selectionCountStatus: true,
            },
            children: [
              {
                id: "child1",
                title: "Child 1",
              },
              {
                id: "child2",
                title: "Child 2",
              },
            ],
          },
        },
      });

      const sequencing = (api as any)._sequencing;
      const rootActivity = sequencing.activityTree.root;

      expect(rootActivity.sequencingControls.selectionTiming).toBe(
        SelectionTiming.ON_EACH_NEW_ATTEMPT,
      );
      expect(rootActivity.sequencingControls.selectCount).toBe(1);
      expect(rootActivity.sequencingControls.randomizeChildren).toBe(true);
      expect(rootActivity.sequencingControls.randomizationTiming).toBe(
        RandomizationTiming.ONCE,
      );
      expect(rootActivity.sequencingControls.selectionCountStatus).toBe(true);
    });

    it("should apply selection randomization state to activity children", () => {
      const api = new Scorm2004API({
        sequencing: {
          activityTree: {
            id: "root",
            title: "Root",
            sequencingControls: {
              selectionTiming: SelectionTiming.ONCE,
              selectCount: 2,
              randomizeChildren: true,
              randomizationTiming: RandomizationTiming.ONCE,
            },
            selectionRandomizationState: {
              selectionCountStatus: true,
              reorderChildren: true,
              childOrder: ["child3", "child1", "child2"],
              selectedChildIds: ["child3", "child1"],
              hiddenFromChoiceChildIds: ["child2"],
            },
            children: [
              { id: "child1", title: "Child 1" },
              { id: "child2", title: "Child 2" },
              { id: "child3", title: "Child 3" },
            ],
          },
        },
      });

      const sequencing = (api as any)._sequencing;
      const rootActivity = sequencing.activityTree.root;

      expect(rootActivity.children.map((child: any) => child.id)).toEqual([
        "child3",
        "child1",
        "child2",
      ]);
      expect(rootActivity.sequencingControls.selectionCountStatus).toBe(true);
      expect(rootActivity.sequencingControls.reorderChildren).toBe(true);

      const availableIds = rootActivity.getAvailableChildren().map((child: any) => child.id);
      expect(availableIds).toEqual(["child3", "child1"]);

      const hiddenChild = rootActivity.children[2];
      expect(hiddenChild.id).toBe("child2");
      expect(hiddenChild.isHiddenFromChoice).toBe(true);
      expect(hiddenChild.isAvailable).toBe(false);
    });
  });

  describe("Activity limit configuration", () => {
    it("should configure limit conditions for activities", () => {
      const api = new Scorm2004API({
        sequencing: {
          activityTree: {
            id: "root",
            title: "Root",
            attemptLimit: 3,
            attemptAbsoluteDurationLimit: "PT10M",
            activityAbsoluteDurationLimit: "PT1H",
            timeLimitAction: "exit",
            timeLimitDuration: "PT5M",
            beginTimeLimit: "2025-01-01T00:00:00Z",
            endTimeLimit: "2025-12-31T23:59:59Z",
          },
        },
      });

      const sequencing = (api as any)._sequencing;
      const rootActivity = sequencing.activityTree.root;

      expect(rootActivity.attemptLimit).toBe(3);
      expect(rootActivity.attemptAbsoluteDurationLimit).toBe("PT10M");
      expect(rootActivity.activityAbsoluteDurationLimit).toBe("PT1H");
      expect(rootActivity.timeLimitAction).toBe("exit");
      expect(rootActivity.timeLimitDuration).toBe("PT5M");
      expect(rootActivity.beginTimeLimit).toBe("2025-01-01T00:00:00Z");
      expect(rootActivity.endTimeLimit).toBe("2025-12-31T23:59:59Z");
    });
  });

  describe("Objective configuration", () => {
    it("should configure primary and additional objectives with map info", () => {
      const api = new Scorm2004API({
        sequencing: {
          activityTree: {
            id: "root",
            title: "Root",
            primaryObjective: {
              objectiveID: "obj-primary",
              satisfiedByMeasure: true,
              minNormalizedMeasure: 0.8,
              mapInfo: [
                {
                  targetObjectiveID: "GLOBAL_PRIMARY",
                  readSatisfiedStatus: true,
                  writeSatisfiedStatus: true,
                  readNormalizedMeasure: true,
                  writeNormalizedMeasure: true,
                  updateAttemptData: true,
                },
              ],
            },
            objectives: [
              {
                objectiveID: "obj-additional",
                mapInfo: [
                  {
                    targetObjectiveID: "GLOBAL_ADDITIONAL",
                    writeNormalizedMeasure: true,
                  },
                ],
              },
            ],
          },
        },
      });

      const sequencing = (api as any)._sequencing;
      const root = sequencing.activityTree.root;
      const primaryObjective = root.primaryObjective;
      const additionalObjectives = root.objectives;

      expect(primaryObjective).toBeTruthy();
      expect(primaryObjective?.id).toBe("obj-primary");
      expect(primaryObjective?.satisfiedByMeasure).toBe(true);
      expect(primaryObjective?.minNormalizedMeasure).toBe(0.8);
      expect(root.scaledPassingScore).toBe(0.8);
      expect(primaryObjective?.mapInfo.length).toBe(1);
      expect(primaryObjective?.mapInfo[0]).toMatchObject({
        targetObjectiveID: "GLOBAL_PRIMARY",
        readSatisfiedStatus: true,
        writeSatisfiedStatus: true,
        readNormalizedMeasure: true,
        writeNormalizedMeasure: true,
        updateAttemptData: true,
      });

      expect(additionalObjectives.length).toBe(1);
      expect(additionalObjectives[0].id).toBe("obj-additional");
      expect(additionalObjectives[0].mapInfo[0]).toMatchObject({
        targetObjectiveID: "GLOBAL_ADDITIONAL",
        writeNormalizedMeasure: true,
      });
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
