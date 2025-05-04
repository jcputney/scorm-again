import { describe, it, expect } from "vitest";
import { check12ValidFormat, check12ValidRange } from "../../../src/cmi/scorm12/validation";
import { Scorm12ValidationError } from "../../../src/exceptions/scorm12_exceptions";
import { scorm12_errors } from "../../../src/constants/error_codes";

describe("check12ValidFormat", () => {
  const CMIElement = "cmi.test";
  
  it("should return true for valid format", () => {
    const result = check12ValidFormat(CMIElement, "valid", "valid");
    expect(result).toBe(true);
  });
  
  it("should throw an error for invalid format", () => {
    const regex = "^[0-9]+$";
    const invalidValue = "abc";
    
    expect(() => {
      check12ValidFormat(CMIElement, invalidValue, regex);
    }).toThrow(Scorm12ValidationError);
  });
  
  it("should handle empty string when allowed", () => {
    const regex = "^[0-9]+$";
    const emptyValue = "";
    
    const result = check12ValidFormat(CMIElement, emptyValue, regex, true);
    expect(result).toBe(true);
  });
  
  it("should throw an error for empty string when not allowed", () => {
    const regex = "^[0-9]+$";
    const emptyValue = "";
    
    expect(() => {
      check12ValidFormat(CMIElement, emptyValue, regex, false);
    }).toThrow(Scorm12ValidationError);
  });
});

describe("check12ValidRange", () => {
  const CMIElement = "cmi.test";
  
  it("should return true for valid range", () => {
    const rangePattern = "0#100";
    const validValue = 50;
    
    const result = check12ValidRange(CMIElement, validValue, rangePattern);
    expect(result).toBe(true);
  });
  
  it("should throw an error for value out of range", () => {
    const rangePattern = "0#100";
    const invalidValue = 150;
    
    expect(() => {
      check12ValidRange(CMIElement, invalidValue, rangePattern);
    }).toThrow(Scorm12ValidationError);
    
    try {
      check12ValidRange(CMIElement, invalidValue, rangePattern);
    } catch (error) {
      expect(error).toBeInstanceOf(Scorm12ValidationError);
      expect((error as Scorm12ValidationError).errorCode).toBe(scorm12_errors.VALUE_OUT_OF_RANGE);
    }
  });
  
  it("should throw an error for empty string when not allowed", () => {
    const rangePattern = "0#100";
    const emptyValue = "";
    
    expect(() => {
      check12ValidRange(CMIElement, emptyValue, rangePattern, false);
    }).toThrow(Scorm12ValidationError);
    
    try {
      check12ValidRange(CMIElement, emptyValue, rangePattern, false);
    } catch (error) {
      expect(error).toBeInstanceOf(Scorm12ValidationError);
      expect((error as Scorm12ValidationError).errorCode).toBe(scorm12_errors.VALUE_OUT_OF_RANGE);
    }
  });
  
  it("should handle empty string when allowed", () => {
    const rangePattern = "0#100";
    const emptyValue = "";
    
    const result = check12ValidRange(CMIElement, emptyValue, rangePattern, true);
    expect(result).toBe(true);
  });
  
  it("should handle string values within range", () => {
    const rangePattern = "0#100";
    const validValue = "50";
    
    const result = check12ValidRange(CMIElement, validValue, rangePattern);
    expect(result).toBe(true);
  });
  
  it("should throw an error for non-numeric string values", () => {
    const rangePattern = "0#100";
    const invalidValue = "abc";
    
    expect(() => {
      check12ValidRange(CMIElement, invalidValue, rangePattern);
    }).toThrow(Scorm12ValidationError);
  });
}); 