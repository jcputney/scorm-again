import { describe, it } from "mocha";
import { expect } from "expect";
import {
  ValidationService,
  validationService,
} from "../../src/services/ValidationService";
import { BaseScormValidationError } from "../../src/exceptions";
import { scorm12_errors } from "../../src/constants/error_codes";
import { Scorm12ValidationError } from "../../src/exceptions/scorm12_exceptions";

describe("ValidationService", () => {
  // Since we can't stub ES modules directly, we'll test the actual implementation
  // with known valid and invalid inputs

  describe("validateScore", () => {
    // Create a custom error class for testing
    class TestValidationError extends BaseScormValidationError {
      constructor(errorCode: number) {
        super(errorCode, `Error ${errorCode}`);
      }
    }

    it("should return true for valid score values", () => {
      // Valid decimal regex and no range check
      const result = validationService.validateScore(
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
          "invalid",
          "^[0-9]+(\\.[0-9]+)?$", // Simple decimal regex
          false,
          101,
          102,
          TestValidationError,
        );
      }).toThrow();
    });
  });

  describe("validateScorm12Audio", () => {
    it("should return true for valid audio values", () => {
      // Valid audio values are integers 0-100
      const result = validationService.validateScorm12Audio("50");
      expect(result).toBe(true);
    });

    it("should throw an error for invalid audio values", () => {
      // Non-integer value
      expect(() => {
        validationService.validateScorm12Audio("invalid");
      }).toThrow();

      // Out of range value
      expect(() => {
        validationService.validateScorm12Audio("101");
      }).toThrow();
    });
  });

  describe("validateScorm12Language", () => {
    it("should return true for valid language values", () => {
      // Any string up to 256 characters is valid
      const result = validationService.validateScorm12Language("en-US");
      expect(result).toBe(true);
    });

    it("should throw an error for invalid language values", () => {
      // Create a string longer than 256 characters
      const longString = "a".repeat(257);
      expect(() => {
        validationService.validateScorm12Language(longString);
      }).toThrow();
    });
  });

  describe("validateScorm12Speed", () => {
    it("should return true for valid speed values", () => {
      // Valid speed values are integers -100 to 100
      const result = validationService.validateScorm12Speed("50");
      expect(result).toBe(true);
    });

    it("should throw an error for invalid speed values", () => {
      // Non-integer value
      expect(() => {
        validationService.validateScorm12Speed("invalid");
      }).toThrow();

      // Out of range value
      expect(() => {
        validationService.validateScorm12Speed("101");
      }).toThrow();
    });
  });

  describe("validateScorm12Text", () => {
    it("should return true for valid text values", () => {
      // Valid text values are integers -1 to 1
      const result = validationService.validateScorm12Text("0");
      expect(result).toBe(true);
    });

    it("should throw an error for invalid text values", () => {
      // Non-integer value
      expect(() => {
        validationService.validateScorm12Text("invalid");
      }).toThrow();

      // Out of range value
      expect(() => {
        validationService.validateScorm12Text("2");
      }).toThrow();
    });
  });

  describe("validateReadOnly", () => {
    it("should not throw an error when initialized is false", () => {
      // Act & Assert
      expect(() => {
        validationService.validateReadOnly(false);
      }).not.toThrow();
    });

    it("should throw a Scorm12ValidationError when initialized is true", () => {
      // Act & Assert
      expect(() => {
        validationService.validateReadOnly(true);
      }).toThrow(Scorm12ValidationError);

      try {
        validationService.validateReadOnly(true);
      } catch (error) {
        expect(error.errorCode).toBe(scorm12_errors.READ_ONLY_ELEMENT);
      }
    });
  });

  describe("Singleton Instance", () => {
    it("should export a singleton instance of ValidationService", () => {
      // Assert
      expect(validationService).toBeInstanceOf(ValidationService);
    });
  });
});
