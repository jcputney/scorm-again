import { describe, expect, it } from "vitest";
import { ValidationService, validationService } from "../../src/services/ValidationService";
import { BaseScormValidationError } from "../../src/exceptions";
import { scorm12_errors } from "../../src";
import { Scorm12ValidationError } from "../../src/exceptions/scorm12_exceptions";
import { scorm12_regex } from "../../src/constants/regex";

describe("ValidationService", () => {
  // Since we can't stub ES modules directly, we'll test the actual implementation
  // with known valid and invalid inputs

  describe("validateScore", () => {
    // Create a custom error class for testing
    class TestValidationError extends BaseScormValidationError {
      constructor(CMIElement: string, errorCode: number) {
        super(CMIElement, errorCode);
        Object.setPrototypeOf(this, TestValidationError.prototype);
      }
    }

    it("should return true for valid score values", () => {
      // Valid decimal regex and no range check
      const result = validationService.validateScore(
        "api",
        "80",
        "^[0-9]+(\\.[0-9]+)?$", // Simple decimal regex
        false,
        101,
        102,
        TestValidationError,
      );
      expect(result).toBe(true);
    });

    it("should throw an error for invalid score format", () => {
      expect(() => {
        validationService.validateScore(
          "api",
          "invalid",
          "^[0-9]+(\\.[0-9]+)?$", // Simple decimal regex
          false,
          101,
          102,
          TestValidationError,
        );
      }).toThrow();
    });

    it("should reject values that match scorm12_regex.CMIDecimal incorrectly", () => {
      expect(() => {
        validationService.validateScore(
          "api",
          "10a3",
          scorm12_regex.CMIDecimal,
          scorm12_regex.score_range,
          101,
          102,
          TestValidationError,
        );
      }).toThrow(TestValidationError);
    });
  });

  describe("validateScorm12Audio", () => {
    it("should return true for valid audio values", () => {
      // Valid audio values are integers 0-100
      const result = validationService.validateScorm12Audio("api", "50");
      expect(result).toBe(true);
    });

    it("should throw an error for invalid audio values", () => {
      // Non-integer value
      expect(() => {
        validationService.validateScorm12Audio("api", "invalid");
      }).toThrow();

      // Out of range value
      expect(() => {
        validationService.validateScorm12Audio("api", "101");
      }).toThrow();
    });
  });

  describe("validateScorm12Language", () => {
    it("should return true for valid language values", () => {
      // Any string up to 256 characters is valid
      const result = validationService.validateScorm12Language("api", "en-US");
      expect(result).toBe(true);
    });

    it("should throw an error for invalid language values", () => {
      // Create a string longer than 256 characters
      const longString = "a".repeat(257);
      expect(() => {
        validationService.validateScorm12Language("api", longString);
      }).toThrow();
    });
  });

  describe("validateScorm12Speed", () => {
    it("should return true for valid speed values", () => {
      // Valid speed values are integers -100 to 100
      const result = validationService.validateScorm12Speed("api", "50");
      expect(result).toBe(true);
    });

    it("should throw an error for invalid speed values", () => {
      // Non-integer value
      expect(() => {
        validationService.validateScorm12Speed("api", "invalid");
      }).toThrow();

      // Out of range value
      expect(() => {
        validationService.validateScorm12Speed("api", "101");
      }).toThrow();
    });
  });

  describe("validateScorm12Text", () => {
    it("should return true for valid text values", () => {
      // Valid text values are integers -1 to 1
      const result = validationService.validateScorm12Text("api", "0");
      expect(result).toBe(true);
    });

    it("should throw an error for invalid text values", () => {
      // Non-integer value
      expect(() => {
        validationService.validateScorm12Text("api", "invalid");
      }).toThrow();

      // Out of range value
      expect(() => {
        validationService.validateScorm12Text("api", "2");
      }).toThrow();
    });
  });

  describe("validateReadOnly", () => {
    it("should not throw an error when initialized is false", () => {
      expect(() => {
        validationService.validateReadOnly("api", false);
      }).not.toThrow();
    });

    it("should throw a Scorm12ValidationError when initialized is true", () => {
      expect(() => {
        validationService.validateReadOnly("api", true);
      }).toThrow(Scorm12ValidationError);

      try {
        validationService.validateReadOnly("api", true);
      } catch (error) {
        expect(error.errorCode).toBe(scorm12_errors.READ_ONLY_ELEMENT);
      }
    });
  });

  describe("Singleton Instance", () => {
    it("should export a singleton instance of ValidationService", () => {
      expect(validationService).toBeInstanceOf(ValidationService);
    });
  });
});
