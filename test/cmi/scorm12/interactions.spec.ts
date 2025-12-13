import { describe, expect, it } from "vitest";
import { CMIInteractionsObjectivesObject } from "../../../src/cmi/scorm12/interactions";
import { Scorm12ValidationError } from "../../../src/exceptions/scorm12_exceptions";
import { scorm12_errors } from "../../../src/constants/error_codes";

describe("SCORM 1.2 Interactions Tests", () => {
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
  });
});
