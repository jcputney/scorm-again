import { describe, expect, it } from "vitest";
import {
  CMIInteractionsCorrectResponsesObject,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
} from "../../src/cmi/scorm12/interactions";

describe("SCORM 1.2 Interactions Reset Tests", () => {
  describe("CMIInteractionsObject reset method", () => {
    it("should reset all properties to their default values", () => {
      const interaction = new CMIInteractionsObject();

      // Set some properties
      interaction.id = "interaction-1";
      interaction.time = "12:34:56";
      interaction.type = "true-false";
      interaction.weighting = "1.0";
      interaction.student_response = "true";
      interaction.result = "correct";
      interaction.latency = "00:01:30";

      // Add an objective
      const objective = new CMIInteractionsObjectivesObject();
      objective.id = "objective-1";
      interaction.objectives.childArray.push(objective);

      // Add a correct response
      const correctResponse = new CMIInteractionsCorrectResponsesObject();
      correctResponse.pattern = "true";
      interaction.correct_responses.childArray.push(correctResponse);

      // Verify properties are set using JSON.stringify since properties are write-only
      const json = JSON.stringify(interaction);
      expect(json).toContain('"id":"interaction-1"');
      expect(json).toContain('"time":"12:34:56"');
      expect(json).toContain('"type":"true-false"');
      expect(json).toContain('"weighting":"1.0"');
      expect(json).toContain('"student_response":"true"');
      expect(json).toContain('"result":"correct"');
      expect(json).toContain('"latency":"00:01:30"');
      expect(interaction.objectives._count).toBe(1);
      expect(interaction.correct_responses._count).toBe(1);

      // Reset the interaction
      interaction.reset();

      // Verify properties are reset using JSON.stringify since properties are write-only
      const resetJson = JSON.stringify(interaction);
      expect(resetJson).toContain('"id":""');
      expect(resetJson).toContain('"time":""');
      expect(resetJson).toContain('"type":""');
      expect(resetJson).toContain('"weighting":""');
      expect(resetJson).toContain('"student_response":""');
      expect(resetJson).toContain('"result":""');
      expect(resetJson).toContain('"latency":""');
      // The reset method doesn't clear the arrays, it just resets each item in the arrays
      expect(interaction.objectives._count).toBe(1);
      expect(interaction.correct_responses._count).toBe(1);
    });
  });

  describe("CMIInteractionsObjectivesObject reset method", () => {
    it("should reset the id to an empty string", () => {
      const objective = new CMIInteractionsObjectivesObject();

      // Set the id
      objective.id = "objective-1";

      // We can't directly check the id property because it's write-only
      // So we'll use JSON.stringify to check the value
      expect(JSON.stringify(objective)).toContain('"id":"objective-1"');

      // Reset the objective
      objective.reset();

      // Verify id is reset
      expect(JSON.stringify(objective)).toContain('"id":""');
    });
  });

  describe("CMIInteractionsCorrectResponsesObject reset method", () => {
    it("should reset the pattern to an empty string", () => {
      const correctResponse = new CMIInteractionsCorrectResponsesObject();

      // Set the pattern
      correctResponse.pattern = "true";

      // We can't directly check the pattern property because it's write-only
      // So we'll use JSON.stringify to check the value
      expect(JSON.stringify(correctResponse)).toContain('"pattern":"true"');

      // Reset the correct response
      correctResponse.reset();

      // Verify pattern is reset
      expect(JSON.stringify(correctResponse)).toContain('"pattern":""');
    });
  });
});
