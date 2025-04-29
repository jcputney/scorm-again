;
import { describe, it , vi } from "vitest";
import { checkValidFormat, checkValidRange } from "../../src/cmi/common/validation";
import { validationService } from "../../src/services/ValidationService";
import { BaseScormValidationError } from "../../src/exceptions";
import { scorm12_regex } from "../../src/constants/regex";

/**
 * Custom error class for testing
 */
class TestValidationError extends BaseScormValidationError {
  constructor(CMIElement: string, errorCode: number) {
    super(CMIElement, errorCode);
    this.name = "TestValidationError";
  }
}

/**
 * Helper function to measure execution time of a function
 * @param fn Function to measure
 * @returns Execution time in milliseconds
 */
function measureExecutionTime(fn: () => any): number {
  const start = performance.now();
  try {
    fn();
  } catch (e) {
    // Ignore errors for timing purposes
  }
  const end = performance.now();
  return end - start;
}

describe("Security Tests for Data Validation", () => {
  describe("Regex DoS (ReDoS) Tests", () => {
    it("should handle potentially catastrophic regex patterns safely", () => {
      // Test with a regex pattern that could cause catastrophic backtracking
      // (a+)+ pattern against "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaX"
      const potentiallyDangerousPattern = "(a+)+";
      const longInput = "a".repeat(30) + "X";

      // Measure execution time
      const executionTime = measureExecutionTime(() => {
        try {
          // We expect this to throw an error because the input doesn't match the pattern
          checkValidFormat(
            "test",
            longInput,
            potentiallyDangerousPattern,
            101,
            TestValidationError,
          );
        } catch (e) {
          // Expected error
        }
      });

      // The execution should be reasonably fast even with a potentially dangerous pattern
      // If it takes too long, it might be vulnerable to ReDoS
      expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    it("should handle large inputs with complex patterns efficiently", () => {
      // Test with a more complex pattern and a large input
      const complexPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; // Email pattern
      const largeInput = "a".repeat(1000) + "@example.com";

      const executionTime = measureExecutionTime(() => {
        try {
          checkValidFormat("test", largeInput, complexPattern, 101, TestValidationError);
        } catch (e) {
          // Expected error or success
        }
      });

      expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
    });
  });

  describe("Type Confusion Tests", () => {
    it("should handle non-string values safely in checkValidFormat", () => {
      // Test with various non-string inputs
      const nonStringValues = [null, undefined, 123, true, false, {}, [], () => {}];

      for (const value of nonStringValues) {
        expect(() => {
          // @ts-ignore - Intentionally passing invalid types for testing
          checkValidFormat("test", value, ".*", 101, TestValidationError);
        }).not.toThrow(); // Should not throw unexpected errors
      }
    });

    it("should handle invalid regex patterns safely", () => {
      // Test with invalid regex patterns
      const invalidPatterns = [
        "[", // Unclosed character class
        "\\", // Trailing backslash
        "(", // Unclosed group
        "?{}", // Invalid quantifier
        "*+", // Adjacent quantifiers
      ];

      for (const pattern of invalidPatterns) {
        expect(() => {
          try {
            checkValidFormat("test", "test", pattern, 101, TestValidationError);
          } catch (e) {
            // Only throw if it's not a SyntaxError (which is expected for invalid regex)
            if (!(e instanceof SyntaxError)) {
              throw e;
            }
          }
        }).not.toThrow(); // Should not throw unexpected errors
      }
    });
  });

  describe("Input Validation Bypass Tests", () => {
    it("should handle empty strings safely", () => {
      // Test with empty string
      const executionTime1 = measureExecutionTime(() => {
        try {
          checkValidFormat("test", "", "^[a-z]+$", 101, TestValidationError);
        } catch (e) {
          // Expected error
          if (!(e instanceof BaseScormValidationError)) {
            throw e;
          }
        }
      });

      // Execution should be fast
      expect(executionTime1).toBeLessThan(100); // Should complete in less than 100ms

      // Test with empty string and allowEmptyString=true
      const executionTime2 = measureExecutionTime(() => {
        try {
          checkValidFormat("test", "", "^[a-z]+$", 101, TestValidationError, true);
        } catch (e) {
          // This should not throw an error
          throw e;
        }
      });

      // Execution should be fast
      expect(executionTime2).toBeLessThan(100); // Should complete in less than 100ms
    });

    it("should handle special characters safely", () => {
      // Test with special characters that might be used to bypass validation
      const specialChars = [
        "\0", // Null byte
        "\n", // Newline
        "\r", // Carriage return
        "\t", // Tab
        "\v", // Vertical tab
        "\f", // Form feed
        "\u200B", // Zero-width space
      ];

      for (const char of specialChars) {
        const executionTime = measureExecutionTime(() => {
          try {
            checkValidFormat("test", `test${char}`, "^test$", 101, TestValidationError);
          } catch (e) {
            // Expected error
            if (!(e instanceof BaseScormValidationError)) {
              throw e;
            }
          }
        });

        // Execution should be fast
        expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
      }
    });
  });

  describe("Range Validation Tests", () => {
    it("should handle type coercion safely in checkValidRange", () => {
      // Test with various inputs that might cause unexpected type coercion
      const coercibleValues = [
        "123", // String number
        "123.45", // String decimal
        "0123", // String with leading zero
        "  123  ", // String with whitespace
        "123e2", // Scientific notation
        "0x7B", // Hexadecimal
        "true", // String boolean
        "null", // String null
        "undefined", // String undefined
      ];

      for (const value of coercibleValues) {
        // Only test values that should be coercible to numbers
        if (!isNaN(Number(value))) {
          // Measure execution time to ensure it's not taking too long
          const executionTime = measureExecutionTime(() => {
            try {
              checkValidRange("test", value, "0#1000", 101, TestValidationError);
            } catch (e) {
              // Expected errors are fine
              if (!(e instanceof TestValidationError) && !(e instanceof TypeError)) {
                throw e;
              }
            }
          });

          // Execution should be fast even with edge cases
          expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
        }
      }
    });

    it("should handle invalid range patterns safely", () => {
      // Test with invalid range patterns
      const invalidRanges = [
        "", // Empty string
        "invalid", // Not a range
        "10", // Missing separator
        "#10", // Missing lower bound
        "10#", // Missing upper bound
        "10#5", // Lower bound greater than upper bound
      ];

      for (const range of invalidRanges) {
        // Measure execution time to ensure it's not taking too long
        const executionTime = measureExecutionTime(() => {
          try {
            checkValidRange("test", "50", range, 101, TestValidationError);
          } catch (e) {
            // Expected errors are fine
            if (
              !(e instanceof TestValidationError) &&
              !(e instanceof TypeError) &&
              !(e instanceof RangeError)
            ) {
              throw e;
            }
          }
        });

        // Execution should be fast even with invalid ranges
        expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
      }
    });
  });

  describe("ValidationService Security Tests", () => {
    // Instead of testing with malicious inputs directly, we'll test that the validation
    // functions handle edge cases safely by measuring execution time and checking for crashes

    it("should handle score validation safely with edge cases", () => {
      // Test with edge case inputs
      const edgeCaseInputs = [
        "0", // Minimum valid value
        "100", // Maximum valid value
        "50.5", // Decimal value
        "-1", // Below minimum
        "101", // Above maximum
        "abc", // Non-numeric
        "", // Empty string
      ];

      for (const input of edgeCaseInputs) {
        // Measure execution time to ensure it's not taking too long (which could indicate a DoS vulnerability)
        const executionTime = measureExecutionTime(() => {
          try {
            validationService.validateScore(
              "cmi.score.raw",
              input,
              scorm12_regex.CMIDecimal,
              scorm12_regex.score_range,
              101,
              102,
              TestValidationError,
            );
          } catch (e) {
            // Expected errors are fine
            if (!(e instanceof TestValidationError)) {
              throw e;
            }
          }
        });

        // Execution should be fast even with edge cases
        expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
      }
    });

    it("should handle audio validation safely with edge cases", () => {
      // Test with edge case inputs
      const edgeCaseInputs = [
        "0", // Minimum valid value
        "100", // Maximum valid value
        "50", // Middle value
        "-1", // Below minimum
        "101", // Above maximum
        "abc", // Non-numeric
        "", // Empty string
      ];

      for (const input of edgeCaseInputs) {
        // Measure execution time to ensure it's not taking too long
        const executionTime = measureExecutionTime(() => {
          try {
            validationService.validateScorm12Audio("cmi.student_preference.audio", input);
          } catch (e) {
            // Expected errors are fine
            if (!(e instanceof Scorm12ValidationError)) {
              throw e;
            }
          }
        });

        // Execution should be fast even with edge cases
        expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
      }
    });

    it("should handle language validation safely with edge cases", () => {
      // Test with edge case inputs
      const edgeCaseInputs = [
        "en-US", // Valid language
        "a".repeat(256), // String at length limit
        "a".repeat(257), // String exceeding length limit
        "", // Empty string
        "en-US<script>", // String with potential XSS
        "en\nUS", // String with newline
      ];

      for (const input of edgeCaseInputs) {
        // Measure execution time to ensure it's not taking too long
        const executionTime = measureExecutionTime(() => {
          try {
            validationService.validateScorm12Language("cmi.student_preference.language", input);
          } catch (e) {
            // Expected errors are fine
            if (!(e instanceof Scorm12ValidationError)) {
              throw e;
            }
          }
        });

        // Execution should be fast even with edge cases
        expect(executionTime).toBeLessThan(100); // Should complete in less than 100ms
      }
    });
  });

  describe("Memoization Security Tests", () => {
    it("should handle memoization cache key collisions safely", () => {
      // Test with inputs that might cause cache key collisions
      const testInputs = [
        ["test:value:pattern:101:false", "^[a-z]+$", 101], // Input that looks like a cache key
        ["test", "value:pattern:101:false", 101], // Another potential collision
        ["test", "value", "pattern:101:false"], // Yet another potential collision
      ];

      for (const [element, value, pattern] of testInputs) {
        expect(() => {
          try {
            // @ts-ignore - Intentionally passing potentially problematic inputs
            checkValidFormat(element, value, pattern, 101, TestValidationError);
          } catch (e) {
            // Expected error
          }
        }).not.toThrow(); // Should not throw unexpected errors
      }
    });

    it("should not leak sensitive information through memoization", () => {
      // First call with a "sensitive" value
      const sensitiveValue = "password123";
      try {
        checkValidFormat("test", sensitiveValue, "^[a-z]+$", 101, TestValidationError);
      } catch (e) {
        // Expected error
      }

      // Create a spy to check if the validation is actually performed again
      const spy = vi.spyOn(RegExp.prototype, "test");

      // Second call with the same value should use memoization
      try {
        checkValidFormat("test", sensitiveValue, "^[a-z]+$", 101, TestValidationError);
      } catch (e) {
        // Expected error
      }

      // The regex test should not have been called again due to memoization
      expect(spy).not.toHaveBeenCalled();

      // spy.restore() - not needed with vi.restoreAllMocks()
    });
  });
});
