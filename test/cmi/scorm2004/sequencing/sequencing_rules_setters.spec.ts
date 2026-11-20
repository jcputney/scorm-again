import { describe, expect, it } from "vitest";
import {
  RuleActionType,
  SequencingRule,
} from "../../../../src/cmi/scorm2004/sequencing/sequencing_rules";

describe("Sequencing Rules Setters", () => {
  describe("action setter", () => {
    it("should set the action property", () => {
      const rule = new SequencingRule();

      // Initial value should be null (default)
      expect(rule.action).toBe(RuleActionType.SKIP);

      // Set to a new value
      rule.action = RuleActionType.CONTINUE;
      expect(rule.action).toBe("continue");

      // Set to another value
      rule.action = RuleActionType.EXIT;
      expect(rule.action).toBe("exit");

      // Set back to null
      // eslint-disable-next-line
      // @ts-ignore
      rule.action = null;
      expect(rule.action).toBe(null);
    });
  });
});
