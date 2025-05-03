import { describe, expect, it } from "vitest";
import * as fc from "fast-check";
import { checkValidFormat, checkValidRange } from "../../src/cmi/common/validation";
import { BaseScormValidationError } from "../../src/exceptions";

// Custom error class for testing
class TestValidationError extends BaseScormValidationError {
  constructor(CMIElement: string, errorCode: number) {
    super(CMIElement, errorCode);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, TestValidationError.prototype);
  }
}

describe("Validation Property-based Tests", () => {
  describe("checkValidFormat", () => {
    // Test that any string matching a regex pattern passes validation
    it("should accept any string that matches the regex pattern", () => {
      fc.assert(
        fc.property(
          // Generate strings that match a simple digit pattern
          fc.stringMatching(/^[0-9]+$/),
          (validString) => {
            // This should not throw an error
            const result = checkValidFormat(
              "api",
              validString,
              "^[0-9]+$",
              101,
              TestValidationError,
            );
            expect(result).toBe(true);
          },
        ),
      );
    });

    // Test that any string not matching a regex pattern fails validation
    it("should reject any string that doesn't match the regex pattern", () => {
      fc.assert(
        fc.property(
          // Generate strings that don't match a simple digit pattern
          fc.string().filter((s) => !/^[0-9]+$/.test(s) && s !== ""),
          (invalidString) => {
            // This should throw an error
            expect(() => {
              checkValidFormat("api", invalidString, "^[0-9]+$", 101, TestValidationError);
            }).toThrow(TestValidationError);
          },
        ),
      );
    });

    // Test that empty strings are handled correctly based on allowEmptyString parameter
    it("should handle empty strings based on allowEmptyString parameter", () => {
      // When allowEmptyString is true, empty string should be accepted
      expect(checkValidFormat("api", "", "^[0-9]+$", 101, TestValidationError, true)).toBe(true);

      // When allowEmptyString is false or undefined, empty string should be rejected
      expect(() => {
        checkValidFormat("api", "", "^[0-9]+$", 101, TestValidationError, false);
      }).toThrow(TestValidationError);

      expect(() => {
        checkValidFormat("api", "", "^[0-9]+$", 101, TestValidationError);
      }).toThrow(TestValidationError);
    });

    // Test that non-string values are handled appropriately
    it("should handle non-string values appropriately", () => {
      fc.assert(
        fc.property(
          // Generate non-string values that don't stringify to valid patterns
          fc.oneof(
            fc.boolean(),
            fc.object(),
            fc.array(fc.anything()),
            fc.constant(null),
            fc.constant(undefined),
          ),
          (nonStringValue) => {
            // This should either return false or throw an error
            try {
              const result = checkValidFormat(
                "api",
                // eslint-disable-next-line
                // @ts-ignore
                nonStringValue,
                "^[0-9]+$",
                101,
                TestValidationError,
              );
              // If it doesn't throw, it should return false
              expect(result).toBe(false);
            } catch (error) {
              // If it throws, it should be a TestValidationError
              expect(error).toBeInstanceOf(TestValidationError);
            }
          },
        ),
      );
    });
  });

  describe("checkValidRange", () => {
    // Test that any number within a range passes validation
    it("should accept any number within the specified range", () => {
      fc.assert(
        fc.property(
          // Generate numbers between 1 and 100
          fc.integer({ min: 1, max: 100 }),
          (validNumber) => {
            // This should not throw an error
            const result = checkValidRange(
              "api",
              validNumber.toString(),
              "1#100",
              102,
              TestValidationError,
            );
            expect(result).toBe(true);
          },
        ),
      );
    });

    // Test that any number below the range fails validation
    it("should reject any number below the specified range", () => {
      fc.assert(
        fc.property(
          // Generate numbers below 1
          fc.integer({ max: 0 }),
          (invalidNumber) => {
            // This should throw an error
            expect(() => {
              checkValidRange("api", invalidNumber.toString(), "1#100", 102, TestValidationError);
            }).toThrow(TestValidationError);
          },
        ),
      );
    });

    // Test that any number above the range fails validation
    it("should reject any number above the specified range", () => {
      fc.assert(
        fc.property(
          // Generate numbers above 100
          fc.integer({ min: 101 }),
          (invalidNumber) => {
            // This should throw an error
            expect(() => {
              checkValidRange("api", invalidNumber.toString(), "1#100", 102, TestValidationError);
            }).toThrow(TestValidationError);
          },
        ),
      );
    });

    // Test that the upper bound can be '*' (unlimited)
    it("should accept any number above the lower bound when upper bound is '*'", () => {
      fc.assert(
        fc.property(
          // Generate numbers above 1
          fc.integer({ min: 1 }),
          (validNumber) => {
            // This should not throw an error
            const result = checkValidRange(
              "api",
              validNumber.toString(),
              "1#*",
              102,
              TestValidationError,
            );
            expect(result).toBe(true);
          },
        ),
      );
    });
  });
});
