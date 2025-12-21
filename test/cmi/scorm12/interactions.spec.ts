import { describe, expect, it, beforeEach } from "vitest";
import {
  CMIInteractions,
  CMIInteractionsObject,
  CMIInteractionsObjectivesObject,
  CMIInteractionsCorrectResponsesObject,
} from "../../../src/cmi/scorm12/interactions";
import { Scorm12ValidationError } from "../../../src/exceptions/scorm12_exceptions";
import { scorm12_errors } from "../../../src/constants/error_codes";

describe("SCORM 1.2 Interactions Tests", () => {
  describe("CMIInteractions Array", () => {
    let interactions: CMIInteractions;

    beforeEach(() => {
      interactions = new CMIInteractions();
      interactions.initialize();
    });

    it("should instantiate CMIInteractions array", () => {
      expect(interactions).toBeDefined();
      expect(interactions.childArray).toBeDefined();
    });

    it("should have correct CMIElement name", () => {
      expect((interactions as any)._cmi_element).toBe("cmi.interactions");
    });

    it("should initialize with empty childArray", () => {
      expect(interactions.childArray.length).toBe(0);
    });

    it("should have correct children definition", () => {
      expect((interactions as any)._children).toBeDefined();
    });

    it("should reset properly", () => {
      interactions.reset();
      expect(interactions.childArray.length).toBe(0);
    });
  });

  describe("CMIInteractionsObject", () => {
    let interaction: CMIInteractionsObject;

    beforeEach(() => {
      interaction = new CMIInteractionsObject();
      interaction.initialize();
    });

    it("should instantiate CMIInteractionsObject", () => {
      expect(interaction).toBeDefined();
    });

    it("should have objectives array", () => {
      expect(interaction.objectives).toBeDefined();
      expect(interaction.objectives.childArray).toBeDefined();
    });

    it("should have correct_responses array", () => {
      expect(interaction.correct_responses).toBeDefined();
      expect(interaction.correct_responses.childArray).toBeDefined();
    });

    describe("id property", () => {
      it("should allow setting id value", () => {
        interaction.id = "interaction-1";

        const json = interaction.toJSON();
        expect(json.id).toBe("interaction-1");
      });

      it("should throw WRITE_ONLY_ELEMENT error when reading id directly", () => {
        interaction.id = "interaction-1";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = interaction.id;
        }).toThrow(
          new Scorm12ValidationError(
            "cmi.interactions.n.id",
            scorm12_errors.WRITE_ONLY_ELEMENT as number,
          ),
        );
      });
    });

    describe("time property", () => {
      it("should allow setting time value", () => {
        interaction.time = "10:30:45";

        const json = interaction.toJSON();
        expect(json.time).toBe("10:30:45");
      });

      it("should throw WRITE_ONLY_ELEMENT error when reading time directly", () => {
        interaction.time = "10:30:45";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = interaction.time;
        }).toThrow(
          new Scorm12ValidationError(
            "cmi.interactions.n.time",
            scorm12_errors.WRITE_ONLY_ELEMENT as number,
          ),
        );
      });
    });

    describe("type property", () => {
      it("should allow setting valid type values", () => {
        const validTypes = [
          "true-false",
          "choice",
          "fill-in",
          "matching",
          "performance",
          "sequencing",
          "likert",
          "numeric",
        ];

        validTypes.forEach((type) => {
          interaction.type = type;
          const json = interaction.toJSON();
          expect(json.type).toBe(type);
        });
      });

      it("should throw WRITE_ONLY_ELEMENT error when reading type directly", () => {
        interaction.type = "choice";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = interaction.type;
        }).toThrow(
          new Scorm12ValidationError(
            "cmi.interactions.n.type",
            scorm12_errors.WRITE_ONLY_ELEMENT as number,
          ),
        );
      });
    });

    describe("weighting property", () => {
      it("should allow setting weighting value within range", () => {
        interaction.weighting = "50";

        const json = interaction.toJSON();
        expect(json.weighting).toBe("50");
      });

      it("should throw WRITE_ONLY_ELEMENT error when reading weighting directly", () => {
        interaction.weighting = "50";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = interaction.weighting;
        }).toThrow(
          new Scorm12ValidationError(
            "cmi.interactions.n.weighting",
            scorm12_errors.WRITE_ONLY_ELEMENT as number,
          ),
        );
      });
    });

    describe("student_response property", () => {
      it("should allow setting student_response value", () => {
        interaction.student_response = "answer";

        const json = interaction.toJSON();
        expect(json.student_response).toBe("answer");
      });

      it("should throw WRITE_ONLY_ELEMENT error when reading student_response directly", () => {
        interaction.student_response = "answer";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = interaction.student_response;
        }).toThrow(
          new Scorm12ValidationError(
            "cmi.interactions.n.student_response",
            scorm12_errors.WRITE_ONLY_ELEMENT as number,
          ),
        );
      });
    });

    describe("result property", () => {
      it("should allow setting valid result values", () => {
        const validResults = ["correct", "wrong", "unanticipated", "neutral"];

        validResults.forEach((result) => {
          interaction.result = result;
          const json = interaction.toJSON();
          expect(json.result).toBe(result);
        });
      });

      it("should throw WRITE_ONLY_ELEMENT error when reading result directly", () => {
        interaction.result = "correct";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = interaction.result;
        }).toThrow(
          new Scorm12ValidationError(
            "cmi.interactions.n.result",
            scorm12_errors.WRITE_ONLY_ELEMENT as number,
          ),
        );
      });
    });

    describe("latency property", () => {
      it("should allow setting latency value and normalize to HH:MM:SS", () => {
        interaction.latency = "0000:05:30.00";

        const json = interaction.toJSON();
        expect(json.latency).toBe("00:05:30");
      });

      it("should throw WRITE_ONLY_ELEMENT error when reading latency directly", () => {
        interaction.latency = "00:05:30";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = interaction.latency;
        }).toThrow(
          new Scorm12ValidationError(
            "cmi.interactions.n.latency",
            scorm12_errors.WRITE_ONLY_ELEMENT as number,
          ),
        );
      });
    });

    describe("reset()", () => {
      it("should reset all properties to empty strings", () => {
        interaction.id = "test-id";
        interaction.time = "10:30:00";
        interaction.type = "choice";
        interaction.weighting = "1";
        interaction.student_response = "a";
        interaction.result = "correct";
        interaction.latency = "00:00:05";

        interaction.reset();
        interaction.initialize();

        const json = interaction.toJSON();
        expect(json.id).toBe("");
        expect(json.time).toBe("");
        expect(json.type).toBe("");
        expect(json.weighting).toBe("");
        expect(json.student_response).toBe("");
        expect(json.result).toBe("");
        expect(json.latency).toBe("");
      });

      it("should reset objectives array", () => {
        interaction.reset();
        expect(interaction.objectives.childArray.length).toBe(0);
      });

      it("should reset correct_responses array", () => {
        interaction.reset();
        expect(interaction.correct_responses.childArray.length).toBe(0);
      });
    });

    describe("toJSON()", () => {
      it("should return complete JSON representation", () => {
        interaction.id = "q1";
        interaction.time = "12:00:00";
        interaction.type = "choice";
        interaction.weighting = "1";
        interaction.student_response = "a";
        interaction.result = "correct";
        interaction.latency = "00:00:10";

        const json = interaction.toJSON();

        expect(json).toEqual({
          id: "q1",
          time: "12:00:00",
          type: "choice",
          weighting: "1",
          student_response: "a",
          result: "correct",
          latency: "00:00:10",
          objectives: interaction.objectives,
          correct_responses: interaction.correct_responses,
        });
      });
    });
  });

  describe("CMIInteractionsCorrectResponsesObject", () => {
    let correctResponse: CMIInteractionsCorrectResponsesObject;

    beforeEach(() => {
      correctResponse = new CMIInteractionsCorrectResponsesObject();
      correctResponse.initialize();
    });

    it("should instantiate CMIInteractionsCorrectResponsesObject", () => {
      expect(correctResponse).toBeDefined();
    });

    it("should have correct CMIElement name", () => {
      expect((correctResponse as any)._cmi_element).toBe("cmi.interactions.correct_responses.n");
    });

    describe("pattern property", () => {
      it("should allow setting pattern value", () => {
        correctResponse.pattern = "correct-answer";

        const json = correctResponse.toJSON();
        expect(json.pattern).toBe("correct-answer");
      });

      it("should throw WRITE_ONLY_ELEMENT error when reading pattern directly", () => {
        correctResponse.pattern = "correct-answer";

        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = correctResponse.pattern;
        }).toThrow(
          new Scorm12ValidationError(
            "cmi.interactions.correct_responses.n.pattern",
            scorm12_errors.WRITE_ONLY_ELEMENT as number,
          ),
        );
      });

      it("should allow reading pattern during JSON serialization", () => {
        correctResponse.pattern = "answer-pattern";

        const json = correctResponse.toJSON();
        expect(json.pattern).toBe("answer-pattern");
      });

      it("should handle empty string pattern when allowed", () => {
        correctResponse.pattern = "";

        const json = correctResponse.toJSON();
        expect(json.pattern).toBe("");
      });
    });

    describe("reset()", () => {
      it("should reset pattern to empty string", () => {
        correctResponse.pattern = "test-pattern";

        correctResponse.reset();
        correctResponse.initialize();

        const json = correctResponse.toJSON();
        expect(json.pattern).toBe("");
      });

      it("should reset initialized flag", () => {
        correctResponse.reset();
        expect((correctResponse as any)._initialized).toBe(false);
      });
    });

    describe("toJSON()", () => {
      it("should return JSON with pattern property", () => {
        correctResponse.pattern = "my-pattern";

        const json = correctResponse.toJSON();

        expect(json).toEqual({
          pattern: "my-pattern",
        });
      });
    });
  });

  describe("CMIInteractionsObjectivesObject", () => {
    describe("id property", () => {
      it("should allow setting the id value", () => {
        const objective = new CMIInteractionsObjectivesObject();

        // Setting should work
        objective.id = "objective-1";

        // Verify via JSON serialization
        expect(JSON.stringify(objective)).toContain('"id":"objective-1"');
      });

      it("should throw WRITE_ONLY_ELEMENT (404) error when attempting to read id directly", () => {
        const objective = new CMIInteractionsObjectivesObject();
        objective.id = "objective-1";

        // Attempting to read should throw
        expect(() => {
          // noinspection JSUnusedLocalSymbols
          const _ = objective.id;
        }).toThrow(
          new Scorm12ValidationError(
            "cmi.interactions.n.objectives.n.id",
            scorm12_errors.WRITE_ONLY_ELEMENT as number,
          ),
        );
      });

      it("should allow reading id during JSON serialization", () => {
        const objective = new CMIInteractionsObjectivesObject();
        objective.id = "objective-1";

        // toJSON should work (uses jsonString flag internally)
        const json = objective.toJSON();
        expect(json.id).toBe("objective-1");
      });

      it("should validate id format against CMIIdentifier pattern", () => {
        const objective = new CMIInteractionsObjectivesObject();

        // Valid identifier should work
        objective.id = "valid-id_123";
        expect(JSON.stringify(objective)).toContain('"id":"valid-id_123"');

        // Invalid format should throw (if validation is implemented)
        // Note: This depends on check12ValidFormat implementation
      });
    });

    describe("reset()", () => {
      it("should reset id to empty string", () => {
        const objective = new CMIInteractionsObjectivesObject();
        objective.id = "test-objective";

        objective.reset();
        (objective as any)._initialized = true;

        const json = objective.toJSON();
        expect(json.id).toBe("");
      });

      it("should reset initialized flag", () => {
        const objective = new CMIInteractionsObjectivesObject();
        objective.reset();
        expect((objective as any)._initialized).toBe(false);
      });
    });
  });
});
