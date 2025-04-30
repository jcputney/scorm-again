import { describe, it, vi } from "vitest";
import * as fc from "fast-check";
import { validationService } from "../../src/services/ValidationService";
import { BaseScormValidationError } from "../../src/exceptions"; // Custom error class for testing

// Custom error class for testing
class TestValidationError extends BaseScormValidationError {
  constructor(CMIElement: string, errorCode: number) {
    super(CMIElement, errorCode);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TestValidationError.prototype);
  }
}

describe("ValidationService Property-based Tests", () => {
  describe("validateScore", () => {
    // Test that any valid decimal string within range passes validation
    it("should accept any valid decimal string within range", () => {
      fc.assert(
        fc.property(
          // Generate decimal strings between 0 and 100 in standard decimal format
          fc.integer({ min: 0, max: 100 }).map((n) => n.toString()),
          (validScore) => {
            // This should not throw an error
            const result = validationService.validateScore(
              "api",
              validScore,
              "^[0-9]+(\\.[0-9]+)?$", // Simple decimal regex
              "0#100", // Range from 0 to 100
              101, // Invalid type error code
              102, // Invalid range error code
              TestValidationError,
            );
            expect(result).toBe(true);
          },
        ),
      );
    });

    // Test that any string that's not a valid decimal fails validation
    it("should reject any string that's not a valid decimal", () => {
      fc.assert(
        fc.property(
          // Generate strings that are not valid decimals
          fc.string().filter((s) => !/^[0-9]+(\.[0-9]+)?$/.test(s) && s !== ""),
          (invalidScore) => {
            // This should throw an error
            expect(() => {
              validationService.validateScore(
                "api",
                invalidScore,
                "^[0-9]+(\\.[0-9]+)?$", // Simple decimal regex
                "0#100", // Range from 0 to 100
                101, // Invalid type error code
                102, // Invalid range error code
                TestValidationError,
              );
            }).toThrow(TestValidationError);
          },
        ),
      );
    });

    // Test that any decimal outside the range fails validation
    it("should reject any decimal outside the range", () => {
      fc.assert(
        fc.property(
          // Generate integers outside the range 0-100
          fc.oneof(
            fc.integer({ max: -1 }).map((n) => n.toString()), // Below 0
            fc.integer({ min: 101 }).map((n) => n.toString()), // Above 100
          ),
          (outOfRangeScore) => {
            // This should throw an error
            expect(() => {
              validationService.validateScore(
                "api",
                outOfRangeScore,
                "^[0-9]+(\\.[0-9]+)?$", // Simple decimal regex
                "0#100", // Range from 0 to 100
                101, // Invalid type error code
                102, // Invalid range error code
                TestValidationError,
              );
            }).toThrow();
          },
        ),
      );
    });
  });

  describe("validateScorm12Audio", () => {
    // Test that any integer between -1 and 100 passes validation
    it("should accept any integer between -1 and 100", () => {
      fc.assert(
        fc.property(
          // Generate integers between -1 and 100
          fc.integer({ min: -1, max: 100 }).map((n) => n.toString()),
          (validAudio) => {
            // This should not throw an error
            const result = validationService.validateScorm12Audio("api", validAudio);
            expect(result).toBe(true);
          },
        ),
      );
    });

    // Test that any string that's not a valid integer fails validation
    it("should reject any string that's not a valid integer", () => {
      fc.assert(
        fc.property(
          // Generate strings that are not valid integers
          fc.string().filter((s) => !/^-?\d+$/.test(s) && s !== ""),
          (invalidAudio) => {
            // This should throw an error
            expect(() => {
              validationService.validateScorm12Audio("api", invalidAudio);
            }).toThrow();
          },
        ),
      );
    });

    // Test that any integer outside the range -1 to 100 fails validation
    it("should reject any integer outside the range -1 to 100", () => {
      fc.assert(
        fc.property(
          // Generate integers outside the range -1 to 100
          fc.oneof(
            fc.integer({ max: -2 }).map((n) => n.toString()), // Below -1
            fc.integer({ min: 101 }).map((n) => n.toString()), // Above 100
          ),
          (outOfRangeAudio) => {
            // This should throw an error
            expect(() => {
              validationService.validateScorm12Audio("api", outOfRangeAudio);
            }).toThrow();
          },
        ),
      );
    });
  });

  describe("validateScorm12Language", () => {
    // Test that any non-empty string up to 256 characters passes validation
    it("should accept any non-empty string up to 256 characters", () => {
      fc.assert(
        fc.property(
          // Generate non-empty strings up to 256 characters
          fc.string({ minLength: 1, maxLength: 256 }),
          (validLanguage) => {
            // This should not throw an error
            const result = validationService.validateScorm12Language("api", validLanguage);
            expect(result).toBe(true);
          },
        ),
      );
    });

    // Test that empty strings are rejected
    it("should reject empty strings", () => {
      expect(() => {
        validationService.validateScorm12Language("api", "");
      }).toThrow();
    });

    // Test that any string longer than 256 characters fails validation
    it("should reject any string longer than 256 characters", () => {
      fc.assert(
        fc.property(
          // Generate strings longer than 256 characters
          fc.string({ minLength: 257 }),
          (invalidLanguage) => {
            // This should throw an error
            expect(() => {
              validationService.validateScorm12Language("api", invalidLanguage);
            }).toThrow();
          },
        ),
      );
    });
  });

  describe("validateScorm12Speed", () => {
    // Test that any integer between -100 and 100 passes validation
    it("should accept any integer between -100 and 100", () => {
      fc.assert(
        fc.property(
          // Generate integers between -100 and 100
          fc.integer({ min: -100, max: 100 }).map((n) => n.toString()),
          (validSpeed) => {
            // This should not throw an error
            const result = validationService.validateScorm12Speed("api", validSpeed);
            expect(result).toBe(true);
          },
        ),
      );
    });

    // Test that any string that's not a valid integer fails validation
    it("should reject any string that's not a valid integer", () => {
      fc.assert(
        fc.property(
          // Generate strings that are not valid integers
          fc.string().filter((s) => !/^-?\d+$/.test(s) && s !== ""),
          (invalidSpeed) => {
            // This should throw an error
            expect(() => {
              validationService.validateScorm12Speed("api", invalidSpeed);
            }).toThrow();
          },
        ),
      );
    });

    // Test that any integer outside the range -100 to 100 fails validation
    it("should reject any integer outside the range -100 to 100", () => {
      fc.assert(
        fc.property(
          // Generate integers outside the range -100 to 100
          fc.oneof(
            fc.integer({ max: -101 }).map((n) => n.toString()), // Below -100
            fc.integer({ min: 101 }).map((n) => n.toString()), // Above 100
          ),
          (outOfRangeSpeed) => {
            // This should throw an error
            expect(() => {
              validationService.validateScorm12Speed("api", outOfRangeSpeed);
            }).toThrow();
          },
        ),
      );
    });
  });

  describe("validateScorm12Text", () => {
    // Test that any integer between -1 and 1 passes validation
    it("should accept any integer between -1 and 1", () => {
      fc.assert(
        fc.property(
          // Generate integers between -1 and 1
          fc.integer({ min: -1, max: 1 }).map((n) => n.toString()),
          (validText) => {
            // This should not throw an error
            const result = validationService.validateScorm12Text("api", validText);
            expect(result).toBe(true);
          },
        ),
      );
    });

    // Test that any string that's not a valid integer fails validation
    it("should reject any string that's not a valid integer", () => {
      fc.assert(
        fc.property(
          // Generate strings that are not valid integers
          fc.string().filter((s) => !/^-?\d+$/.test(s) && s !== ""),
          (invalidText) => {
            // This should throw an error
            expect(() => {
              validationService.validateScorm12Text("api", invalidText);
            }).toThrow();
          },
        ),
      );
    });

    // Test that any integer outside the range -1 to 1 fails validation
    it("should reject any integer outside the range -1 to 1", () => {
      fc.assert(
        fc.property(
          // Generate integers outside the range -1 to 1
          fc.oneof(
            fc.integer({ max: -2 }).map((n) => n.toString()), // Below -1
            fc.integer({ min: 2 }).map((n) => n.toString()), // Above 1
          ),
          (outOfRangeText) => {
            // This should throw an error
            expect(() => {
              validationService.validateScorm12Text("api", outOfRangeText);
            }).toThrow();
          },
        ),
      );
    });
  });

  describe("validateReadOnly", () => {
    // Test that when initialized is false, no error is thrown
    it("should not throw an error when initialized is false", () => {
      // This should not throw an error
      expect(() => {
        validationService.validateReadOnly("api", false);
      }).not.toThrow();
    });

    // Test that when initialized is true, an error is thrown
    it("should throw an error when initialized is true", () => {
      // This should throw an error
      expect(() => {
        validationService.validateReadOnly("api", true);
      }).toThrow();
    });
  });
});
