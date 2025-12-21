import { describe, expect, it } from "vitest";
import { checkValidFormat, checkValidRange } from "../../../src/cmi/common/validation";
import { Scorm12ValidationError } from "../../../src/exceptions/scorm12_exceptions";
import { scorm12_errors } from "../../../src";

describe("checkValidFormat", () => {
  const CMIElement = "cmi.test";

  it("should return true for valid format", () => {
    const result = checkValidFormat(CMIElement, "valid", "valid", scorm12_errors.TYPE_MISMATCH, Scorm12ValidationError);
    expect(result).toBe(true);
  });

  it("should throw an error for invalid format", () => {
    const regex = "^[0-9]+$";
    const invalidValue = "abc";

    expect(() => {
      checkValidFormat(CMIElement, invalidValue, regex, scorm12_errors.TYPE_MISMATCH, Scorm12ValidationError);
    }).toThrow(Scorm12ValidationError);
  });

  it("should handle empty string when allowed", () => {
    const regex = "^[0-9]+$";
    const emptyValue = "";

    const result = checkValidFormat(CMIElement, emptyValue, regex, scorm12_errors.TYPE_MISMATCH, Scorm12ValidationError, true);
    expect(result).toBe(true);
  });

  it("should return false for non-string values including undefined", () => {
    const regex = "^[0-9]+$";

    // These should return false, not throw, because typeof check catches them
    const result = checkValidFormat(CMIElement, undefined as any, regex, scorm12_errors.TYPE_MISMATCH, Scorm12ValidationError);
    expect(result).toBe(false);
  });

  it("should handle undefined via typeof check without redundant check (COM-VAL-01)", () => {
    const regex = "^[0-9]+$";

    // The typeof value !== "string" check on line 24-26 should catch undefined
    // The check on line 32 for value === undefined is redundant
    const result = checkValidFormat(CMIElement, undefined as any, regex, scorm12_errors.TYPE_MISMATCH, Scorm12ValidationError);
    expect(result).toBe(false);
  });

  it("should return false for non-string values (null, number, object)", () => {
    const regex = "^[0-9]+$";

    expect(checkValidFormat(CMIElement, null as any, regex, scorm12_errors.TYPE_MISMATCH, Scorm12ValidationError)).toBe(false);
    expect(checkValidFormat(CMIElement, 123 as any, regex, scorm12_errors.TYPE_MISMATCH, Scorm12ValidationError)).toBe(false);
    expect(checkValidFormat(CMIElement, {} as any, regex, scorm12_errors.TYPE_MISMATCH, Scorm12ValidationError)).toBe(false);
  });
});

describe("checkValidRange", () => {
  const CMIElement = "cmi.test";

  it("should return true for value within range", () => {
    const rangePattern = "0#100";
    const validValue = 50;

    const result = checkValidRange(CMIElement, validValue, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError);
    expect(result).toBe(true);
  });

  it("should throw an error for value out of range", () => {
    const rangePattern = "0#100";
    const invalidValue = 150;

    expect(() => {
      checkValidRange(CMIElement, invalidValue, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError);
    }).toThrow(Scorm12ValidationError);
  });

  it("should handle range with no minimum bound (COM-VAL-02)", () => {
    const rangePattern = "#100"; // No minimum, max 100

    // These should all pass - any value up to 100
    expect(checkValidRange(CMIElement, 0, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);
    expect(checkValidRange(CMIElement, 50, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);
    expect(checkValidRange(CMIElement, 100, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);
    expect(checkValidRange(CMIElement, -50, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);

    // This should fail - exceeds maximum
    expect(() => {
      checkValidRange(CMIElement, 101, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError);
    }).toThrow(Scorm12ValidationError);
  });

  it("should handle range with no maximum bound", () => {
    const rangePattern = "0#"; // Min 0, no maximum

    // These should all pass - any value >= 0
    expect(checkValidRange(CMIElement, 0, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);
    expect(checkValidRange(CMIElement, 100, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);
    expect(checkValidRange(CMIElement, 1000000, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);

    // This should fail - below minimum
    expect(() => {
      checkValidRange(CMIElement, -1, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError);
    }).toThrow(Scorm12ValidationError);
  });

  it("should handle range with wildcard maximum", () => {
    const rangePattern = "0#*"; // Min 0, no maximum (wildcard)

    // These should all pass
    expect(checkValidRange(CMIElement, 0, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);
    expect(checkValidRange(CMIElement, 999999, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);
  });

  it("should handle both bounds present", () => {
    const rangePattern = "10#90";

    expect(checkValidRange(CMIElement, 10, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);
    expect(checkValidRange(CMIElement, 50, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);
    expect(checkValidRange(CMIElement, 90, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError)).toBe(true);

    expect(() => {
      checkValidRange(CMIElement, 9, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError);
    }).toThrow(Scorm12ValidationError);

    expect(() => {
      checkValidRange(CMIElement, 91, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError);
    }).toThrow(Scorm12ValidationError);
  });
});
