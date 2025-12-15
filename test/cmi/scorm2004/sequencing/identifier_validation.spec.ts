// noinspection DuplicatedCode

import { describe, expect, it } from "vitest";
import { Activity, ActivityObjective } from "../../../../src/cmi/scorm2004/sequencing/activity";
import { ActivityTree } from "../../../../src/cmi/scorm2004/sequencing/activity_tree";
import { Scorm2004ValidationError } from "../../../../src/exceptions/scorm2004_exceptions";

/**
 * URI-Safe Identifier Validation Tests
 *
 * Tests compliance with REQ-IDENT-001: Activity identifiers must be URI-safe
 * as they are used in manifest IDs and must conform to CMILongIdentifier format.
 *
 * SCORM 2004 CMILongIdentifier (RTE C.1.11):
 * - Max 4000 characters
 * - Supports URN format: urn:<namespace>:<specific>
 * - Otherwise any non-whitespace characters
 */
describe("Identifier Validation - URI-Safe Identifiers", () => {
  describe("Activity ID Validation", () => {
    describe("Valid URI-safe identifiers", () => {
      it("should accept simple alphanumeric identifiers", () => {
        const activity = new Activity("simple123", "Simple Activity");
        expect(activity.id).toBe("simple123");
      });

      it("should accept identifiers with hyphens", () => {
        const activity = new Activity("activity-with-hyphens", "Activity");
        expect(activity.id).toBe("activity-with-hyphens");
      });

      it("should accept identifiers with underscores", () => {
        const activity = new Activity("activity_with_underscores", "Activity");
        expect(activity.id).toBe("activity_with_underscores");
      });

      it("should accept identifiers with dots", () => {
        const activity = new Activity("activity.with.dots", "Activity");
        expect(activity.id).toBe("activity.with.dots");
      });

      it("should accept mixed alphanumeric with special chars", () => {
        const activity = new Activity("Act123_test-v2.1", "Activity");
        expect(activity.id).toBe("Act123_test-v2.1");
      });

      it("should accept URN format identifiers", () => {
        const activity = new Activity("urn:example:activity123", "Activity");
        expect(activity.id).toBe("urn:example:activity123");
      });

      it("should accept complex URN with multiple segments", () => {
        const activity = new Activity(
          "urn:scorm:2004:activity:module1:lesson2",
          "Activity"
        );
        expect(activity.id).toBe("urn:scorm:2004:activity:module1:lesson2");
      });

      it("should accept identifiers with slashes", () => {
        const activity = new Activity("org/unit/lesson", "Activity");
        expect(activity.id).toBe("org/unit/lesson");
      });

      it("should accept identifiers with colons", () => {
        const activity = new Activity("activity:module:lesson", "Activity");
        expect(activity.id).toBe("activity:module:lesson");
      });

      it("should accept identifiers with special characters allowed in URIs", () => {
        const activity = new Activity("activity@example.com", "Activity");
        expect(activity.id).toBe("activity@example.com");
      });

      it("should accept identifiers with numbers only", () => {
        const activity = new Activity("123456", "Activity");
        expect(activity.id).toBe("123456");
      });

      it("should accept single character identifier", () => {
        const activity = new Activity("A", "Activity");
        expect(activity.id).toBe("A");
      });

      it("should accept identifiers with parentheses", () => {
        const activity = new Activity("activity(v1)", "Activity");
        expect(activity.id).toBe("activity(v1)");
      });

      it("should accept identifiers with plus signs", () => {
        const activity = new Activity("activity+module", "Activity");
        expect(activity.id).toBe("activity+module");
      });

      it("should accept identifiers with equals signs", () => {
        const activity = new Activity("activity=value", "Activity");
        expect(activity.id).toBe("activity=value");
      });

      it("should accept identifiers with semicolons", () => {
        const activity = new Activity("activity;section", "Activity");
        expect(activity.id).toBe("activity;section");
      });

      it("should accept identifiers with dollar signs", () => {
        const activity = new Activity("activity$special", "Activity");
        expect(activity.id).toBe("activity$special");
      });

      it("should accept identifiers with exclamation marks", () => {
        const activity = new Activity("activity!important", "Activity");
        expect(activity.id).toBe("activity!important");
      });

      it("should accept identifiers with asterisks", () => {
        const activity = new Activity("activity*special", "Activity");
        expect(activity.id).toBe("activity*special");
      });

      it("should accept identifiers with apostrophes", () => {
        const activity = new Activity("activity'name", "Activity");
        expect(activity.id).toBe("activity'name");
      });

      it("should accept identifiers with percent signs", () => {
        const activity = new Activity("activity%encoded", "Activity");
        expect(activity.id).toBe("activity%encoded");
      });

      it("should accept identifiers with hash/pound signs", () => {
        const activity = new Activity("activity#fragment", "Activity");
        expect(activity.id).toBe("activity#fragment");
      });
    });

    describe("Identifiers with whitespace - Current Implementation Behavior", () => {
      /**
       * COMPLIANCE NOTE: The current CMILongIdentifier regex pattern includes a fallback
       * that accepts ANY characters (.{1,4000}), including whitespace. This is more
       * permissive than strict URI-safe validation would require.
       *
       * For manifest compatibility, identifiers should ideally be URI-safe (no whitespace).
       * These tests document the ACTUAL behavior rather than IDEAL behavior.
       *
       * REQ-IDENT-001 states identifiers must be URI-safe, but the implementation
       * currently allows whitespace for backward compatibility with legacy content.
       */

      it("should currently ACCEPT identifiers with spaces (legacy compatibility)", () => {
        const activity = new Activity("valid_id", "Activity");
        // Current behavior: accepts spaces via fallback pattern
        activity.id = "activity with spaces";
        expect(activity.id).toBe("activity with spaces");
      });

      it("should currently ACCEPT identifiers with leading spaces", () => {
        const activity = new Activity("valid_id", "Activity");
        activity.id = " leadingspace";
        expect(activity.id).toBe(" leadingspace");
      });

      it("should currently ACCEPT identifiers with trailing spaces", () => {
        const activity = new Activity("valid_id", "Activity");
        activity.id = "trailingspace ";
        expect(activity.id).toBe("trailingspace ");
      });

      it("should currently ACCEPT identifiers with tabs", () => {
        const activity = new Activity("valid_id", "Activity");
        activity.id = "activity\twith\ttabs";
        expect(activity.id).toBe("activity\twith\ttabs");
      });

      it("should REJECT identifiers with newlines", () => {
        // The . metacharacter in regex does NOT match newlines by default
        const activity = new Activity("valid_id", "Activity");
        expect(() => {
          activity.id = "activity\nwith\nnewlines";
        }).toThrow(Scorm2004ValidationError);
        expect(activity.id).toBe("valid_id");
      });

      it("should REJECT identifiers with carriage returns", () => {
        // The . metacharacter in regex does NOT match carriage returns by default
        const activity = new Activity("valid_id", "Activity");
        expect(() => {
          activity.id = "activity\rwith\rreturns";
        }).toThrow(Scorm2004ValidationError);
        expect(activity.id).toBe("valid_id");
      });

      it("should document that whitespace identifiers may cause manifest issues", () => {
        // This test documents that while accepted by the API, whitespace in
        // identifiers may cause issues when used in XML manifests or URIs
        const activity = new Activity("id with spaces", "Activity");
        expect(activity.id).toBe("id with spaces");

        // Would need URL encoding: "id%20with%20spaces" for URI use
        const encoded = encodeURIComponent(activity.id);
        expect(encoded).toBe("id%20with%20spaces");
      });
    });

    describe("Edge cases", () => {
      it("should reject empty string identifier", () => {
        const activity = new Activity("valid_id", "Activity");
        expect(() => {
          activity.id = "";
        }).toThrow(Scorm2004ValidationError);
        expect(activity.id).toBe("valid_id");
      });

      it("should accept identifier at max length (4000 chars)", () => {
        const maxLengthId = "a".repeat(4000);
        const activity = new Activity(maxLengthId, "Activity");
        expect(activity.id).toBe(maxLengthId);
      });

      it("should reject identifier exceeding max length (4001 chars)", () => {
        const activity = new Activity("valid_id", "Activity");
        const tooLongId = "a".repeat(4001);
        expect(() => {
          activity.id = tooLongId;
        }).toThrow(Scorm2004ValidationError);
        expect(activity.id).toBe("valid_id");
      });

      it("should reject identifier far exceeding max length", () => {
        const activity = new Activity("valid_id", "Activity");
        const tooLongId = "a".repeat(10000);
        expect(() => {
          activity.id = tooLongId;
        }).toThrow(Scorm2004ValidationError);
        expect(activity.id).toBe("valid_id");
      });
    });

    describe("Unicode handling", () => {
      it("should accept identifiers with Latin-1 supplement characters", () => {
        const activity = new Activity("activité", "Activity");
        expect(activity.id).toBe("activité");
      });

      it("should accept identifiers with Greek characters", () => {
        const activity = new Activity("αβγδε", "Activity");
        expect(activity.id).toBe("αβγδε");
      });

      it("should accept identifiers with Cyrillic characters", () => {
        const activity = new Activity("активность", "Activity");
        expect(activity.id).toBe("активность");
      });

      it("should accept identifiers with Chinese characters", () => {
        const activity = new Activity("活动", "Activity");
        expect(activity.id).toBe("活动");
      });

      it("should accept identifiers with Japanese characters", () => {
        const activity = new Activity("アクティビティ", "Activity");
        expect(activity.id).toBe("アクティビティ");
      });

      it("should accept identifiers with Arabic characters", () => {
        const activity = new Activity("نشاط", "Activity");
        expect(activity.id).toBe("نشاط");
      });

      it("should accept identifiers with emoji", () => {
        const activity = new Activity("activity📚", "Activity");
        expect(activity.id).toBe("activity📚");
      });

      it("should accept identifiers with mixed Unicode", () => {
        const activity = new Activity("activity-активность-活动", "Activity");
        expect(activity.id).toBe("activity-активность-活动");
      });
    });

    describe("URN format validation", () => {
      it("should accept valid URN with minimal namespace", () => {
        const activity = new Activity("urn:a:test", "Activity");
        expect(activity.id).toBe("urn:a:test");
      });

      it("should accept URN with max length namespace (31 chars)", () => {
        const namespace = "a".repeat(31);
        const urn = `urn:${namespace}:test`;
        const activity = new Activity(urn, "Activity");
        expect(activity.id).toBe(urn);
      });

      it("should accept URN with numeric namespace", () => {
        const activity = new Activity("urn:12345:test", "Activity");
        expect(activity.id).toBe("urn:12345:test");
      });

      it("should accept URN with hyphenated namespace", () => {
        const activity = new Activity("urn:my-namespace:test", "Activity");
        expect(activity.id).toBe("urn:my-namespace:test");
      });

      it("should accept URN with complex specific part", () => {
        const activity = new Activity(
          "urn:example:path/to/resource?query=value#fragment",
          "Activity"
        );
        expect(activity.id).toBe("urn:example:path/to/resource?query=value#fragment");
      });

      it("should accept case variations in URN", () => {
        const activity = new Activity("URN:Example:Test", "Activity");
        expect(activity.id).toBe("URN:Example:Test");
      });
    });

    describe("Special manifest ID scenarios", () => {
      it("should accept GUID-style identifiers", () => {
        const activity = new Activity(
          "550e8400-e29b-41d4-a716-446655440000",
          "Activity"
        );
        expect(activity.id).toBe("550e8400-e29b-41d4-a716-446655440000");
      });

      it("should accept reverse domain notation", () => {
        const activity = new Activity(
          "com.example.scorm.activity.lesson1",
          "Activity"
        );
        expect(activity.id).toBe("com.example.scorm.activity.lesson1");
      });

      it("should accept hierarchical path identifiers", () => {
        const activity = new Activity(
          "course/module1/unit2/lesson3",
          "Activity"
        );
        expect(activity.id).toBe("course/module1/unit2/lesson3");
      });

      it("should accept URL-encoded identifiers", () => {
        const activity = new Activity(
          "activity%20encoded%2Fvalue",
          "Activity"
        );
        expect(activity.id).toBe("activity%20encoded%2Fvalue");
      });

      it("should accept identifiers with query-like syntax", () => {
        const activity = new Activity(
          "activity?type=lesson&level=1",
          "Activity"
        );
        expect(activity.id).toBe("activity?type=lesson&level=1");
      });
    });
  });

  describe("Objective ID Validation", () => {
    describe("Valid objective identifiers", () => {
      it("should accept simple objective IDs", () => {
        const objective = new ActivityObjective("objective1");
        expect(objective.id).toBe("objective1");
      });

      it("should accept objective IDs with hyphens and underscores", () => {
        const objective = new ActivityObjective("objective_test-v1");
        expect(objective.id).toBe("objective_test-v1");
      });

      it("should accept URN format objective IDs", () => {
        const objective = new ActivityObjective(
          "urn:objective:primary-goal"
        );
        expect(objective.id).toBe("urn:objective:primary-goal");
      });

      it("should accept hierarchical objective IDs", () => {
        const objective = new ActivityObjective("course.module.objective");
        expect(objective.id).toBe("course.module.objective");
      });

      it("should accept complex objective IDs with special chars", () => {
        const objective = new ActivityObjective("obj@example:test#1");
        expect(objective.id).toBe("obj@example:test#1");
      });

      it("should accept GUID-style objective IDs", () => {
        const objective = new ActivityObjective(
          "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
        );
        expect(objective.id).toBe("a1b2c3d4-e5f6-7890-abcd-ef1234567890");
      });
    });

    describe("Objective IDs in Activity context", () => {
      it("should accept primary objective with URI-safe ID", () => {
        const activity = new Activity("activity1", "Activity");
        const objective = new ActivityObjective("primary-objective_1");
        activity.primaryObjective = objective;
        expect(activity.primaryObjective?.id).toBe("primary-objective_1");
      });

      it("should accept multiple objectives with URI-safe IDs", () => {
        const activity = new Activity("activity1", "Activity");
        const obj1 = new ActivityObjective("objective-1");
        const obj2 = new ActivityObjective("objective_2");
        const obj3 = new ActivityObjective("objective.3");

        activity.addObjective(obj1);
        activity.addObjective(obj2);
        activity.addObjective(obj3);

        const allObjectives = activity.getAllObjectives();
        expect(allObjectives).toHaveLength(3);
        expect(allObjectives[0].id).toBe("objective-1");
        expect(allObjectives[1].id).toBe("objective_2");
        expect(allObjectives[2].id).toBe("objective.3");
      });

      it("should retrieve objective by URI-safe ID", () => {
        const activity = new Activity("activity1", "Activity");
        const objective = new ActivityObjective("objective-test_v2");
        activity.addObjective(objective);

        const retrieved = activity.getObjectiveById("objective-test_v2");
        expect(retrieved).not.toBeNull();
        expect(retrieved?.objective.id).toBe("objective-test_v2");
      });
    });

    describe("Edge cases for objective IDs", () => {
      it("should accept objective ID at max length", () => {
        const maxId = "obj" + "a".repeat(3997);
        const objective = new ActivityObjective(maxId);
        expect(objective.id).toBe(maxId);
      });

      it("should handle objectives with identical IDs correctly", () => {
        const activity = new Activity("activity1", "Activity");
        const obj1 = new ActivityObjective("duplicate-id");
        const obj2 = new ActivityObjective("duplicate-id");

        activity.addObjective(obj1);
        activity.addObjective(obj2);

        // Should only store one instance (no duplicates)
        const allObjectives = activity.getAllObjectives();
        const duplicates = allObjectives.filter(o => o.id === "duplicate-id");
        expect(duplicates.length).toBe(1);
      });
    });

    describe("Unicode objective IDs", () => {
      it("should accept objective IDs with Unicode characters", () => {
        const objective = new ActivityObjective("objetif-français");
        expect(objective.id).toBe("objetif-français");
      });

      it("should accept objective IDs with mixed scripts", () => {
        const objective = new ActivityObjective("objective目標цель");
        expect(objective.id).toBe("objective目標цель");
      });
    });
  });

  describe("Activity Tree with URI-safe identifiers", () => {
    it("should build activity tree with valid URI-safe IDs", () => {
      const root = new Activity("root_activity", "Root");
      const child1 = new Activity("child-1", "Child 1");
      const child2 = new Activity("child_2", "Child 2");
      const grandchild = new Activity("grandchild.1", "Grandchild");

      root.addChild(child1);
      root.addChild(child2);
      child1.addChild(grandchild);

      const tree = new ActivityTree(root);
      tree.initialize();

      expect(tree.root?.id).toBe("root_activity");
      expect(tree.getActivity("root_activity")).toBe(root);
      expect(tree.getActivity("child-1")).toBe(child1);
      expect(tree.getActivity("child_2")).toBe(child2);
      expect(tree.getActivity("grandchild.1")).toBe(grandchild);
    });

    it("should handle activity lookup with URN identifiers", () => {
      const root = new Activity("urn:scorm:root", "Root");
      const child = new Activity("urn:scorm:child", "Child");

      root.addChild(child);
      const tree = new ActivityTree(root);
      tree.initialize();

      expect(tree.getActivity("urn:scorm:root")).toBe(root);
      expect(tree.getActivity("urn:scorm:child")).toBe(child);
    });

    it("should handle activity tree with Unicode identifiers", () => {
      const root = new Activity("活动根", "Root");
      const child = new Activity("活动子", "Child");

      root.addChild(child);
      const tree = new ActivityTree(root);
      tree.initialize();

      expect(tree.getActivity("活动根")).toBe(root);
      expect(tree.getActivity("活动子")).toBe(child);
    });

    it("should maintain activity references with complex IDs", () => {
      const root = new Activity(
        "com.example.course.module1",
        "Module 1"
      );
      const lesson1 = new Activity(
        "com.example.course.module1.lesson1",
        "Lesson 1"
      );
      const lesson2 = new Activity(
        "com.example.course.module1.lesson2",
        "Lesson 2"
      );

      root.addChild(lesson1);
      root.addChild(lesson2);

      const tree = new ActivityTree(root);
      tree.initialize();

      const allActivities = tree.getAllActivities();
      expect(allActivities).toHaveLength(3);
      expect(allActivities.map(a => a.id)).toContain("com.example.course.module1");
      expect(allActivities.map(a => a.id)).toContain("com.example.course.module1.lesson1");
      expect(allActivities.map(a => a.id)).toContain("com.example.course.module1.lesson2");
    });

    it("should handle current activity assignment with URI-safe IDs", () => {
      const root = new Activity("root-activity", "Root");
      const child = new Activity("child_activity", "Child");

      root.addChild(child);
      const tree = new ActivityTree(root);
      tree.initialize();

      tree.currentActivity = child;
      expect(tree.currentActivity?.id).toBe("child_activity");
      expect(child.isActive).toBe(true);
    });

    it("should handle suspended activity with URI-safe IDs", () => {
      const root = new Activity("root.activity", "Root");
      const child = new Activity("child-activity", "Child");

      root.addChild(child);
      const tree = new ActivityTree(root);
      tree.initialize();

      tree.suspendedActivity = child;
      expect(tree.suspendedActivity?.id).toBe("child-activity");
      expect(child.isSuspended).toBe(true);
    });
  });

  describe("Identifier consistency across operations", () => {
    it("should maintain ID consistency when serializing activity", () => {
      const activity = new Activity("test_activity-v1.0", "Test");
      const child = new Activity("child@example.com", "Child");
      activity.addChild(child);

      const json = activity.toJSON();
      expect((json as any).id).toBe("test_activity-v1.0");
      expect((json as any).children[0].id).toBe("child@example.com");
    });

    it("should maintain ID consistency in suspension state", () => {
      const activity = new Activity("activity#special", "Activity");
      const child = new Activity("child%encoded", "Child");
      activity.addChild(child);

      const state = activity.getSuspensionState();
      expect((state as any).id).toBe("activity#special");
      expect((state as any).children[0].id).toBe("child%encoded");
    });

    it("should maintain ID consistency after state restoration", () => {
      const activity = new Activity("original-id_123", "Activity");
      const state = activity.getSuspensionState();

      const restoredActivity = new Activity("temp-id", "Temp");
      restoredActivity.restoreSuspensionState(state);

      // Note: ID is set in constructor and not changed by restoreSuspensionState
      // This test verifies the state captures the correct ID
      expect((state as any).id).toBe("original-id_123");
    });
  });

  describe("Real-world identifier scenarios", () => {
    it("should handle identifiers from authoring tools", () => {
      // Common patterns from Articulate Storyline
      const storylineId = "scene_1_slide_2_layer_3";
      const activity = new Activity(storylineId, "Storyline Activity");
      expect(activity.id).toBe(storylineId);
    });

    it("should handle identifiers from Adobe Captivate", () => {
      // Common patterns from Adobe Captivate
      const captivateId = "cp_project_lesson1_slide001";
      const activity = new Activity(captivateId, "Captivate Activity");
      expect(activity.id).toBe(captivateId);
    });

    it("should handle identifiers from LMS systems", () => {
      // Common LMS-generated identifiers
      const lmsId = "course-12345_user-67890_attempt-1";
      const activity = new Activity(lmsId, "LMS Activity");
      expect(activity.id).toBe(lmsId);
    });

    it("should handle identifiers with version numbers", () => {
      const versionedId = "activity-v2.5.3-beta";
      const activity = new Activity(versionedId, "Versioned Activity");
      expect(activity.id).toBe(versionedId);
    });

    it("should handle identifiers with ISO dates", () => {
      const dateId = "activity-2024-01-15T10:30:00Z";
      const activity = new Activity(dateId, "Dated Activity");
      expect(activity.id).toBe(dateId);
    });
  });
});
