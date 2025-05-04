import { describe, it, expect, beforeEach, vi } from "vitest";
import { CMIEvaluation, CMIEvaluationCommentsObject } from "../../../src/cmi/aicc/evaluation";

describe("CMIEvaluation", () => {
  let evaluation: CMIEvaluation;

  beforeEach(() => {
    evaluation = new CMIEvaluation();
  });

  it("should initialize properly", () => {
    expect(evaluation).toBeDefined();
    expect(evaluation.comments).toBeDefined();
  });

  it("should have initialized property set to false by default", () => {
    // @ts-ignore - accessing private property for testing
    expect(evaluation._initialized).toBe(false);
  });

  it("should call initialize on comments when initialized", () => {
    const spy = vi.spyOn(evaluation.comments, "initialize");
    
    evaluation.initialize();
    
    expect(spy).toHaveBeenCalled();
    // @ts-ignore - accessing private property for testing
    expect(evaluation._initialized).toBe(true);
  });

  it("should reset properly", () => {
    evaluation.initialize();
    // @ts-ignore - accessing private property for testing
    expect(evaluation._initialized).toBe(true);
    
    const spy = vi.spyOn(evaluation.comments, "reset");
    
    evaluation.reset();
    
    expect(spy).toHaveBeenCalled();
    // @ts-ignore - accessing private property for testing
    expect(evaluation._initialized).toBe(false);
  });

  it("should convert to JSON correctly", () => {
    const json = evaluation.toJSON();
    
    expect(json).toEqual({
      comments: evaluation.comments
    });
  });
});

describe("CMIEvaluationCommentsObject", () => {
  let commentsObject: CMIEvaluationCommentsObject;

  beforeEach(() => {
    commentsObject = new CMIEvaluationCommentsObject();
  });

  it("should initialize with empty values", () => {
    expect(commentsObject.content).toBe("");
    expect(commentsObject.location).toBe("");
    expect(commentsObject.time).toBe("");
  });

  it("should set and get content correctly", () => {
    commentsObject.content = "Test comment content";
    expect(commentsObject.content).toBe("Test comment content");
  });

  it("should set and get location correctly", () => {
    commentsObject.location = "Test location";
    expect(commentsObject.location).toBe("Test location");
  });

  it("should set and get time correctly", () => {
    commentsObject.time = "12:30:45";
    expect(commentsObject.time).toBe("12:30:45");
  });

  it("should reject invalid content format", () => {
    expect(() => {
      // Create a very long string (> 256 chars)
      const longContent = "a".repeat(257);
      commentsObject.content = longContent;
    }).toThrow();
  });

  it("should reject invalid location format", () => {
    expect(() => {
      // Create a very long string (> 256 chars)
      const longLocation = "a".repeat(257);
      commentsObject.location = longLocation;
    }).toThrow();
  });

  it("should reject invalid time format", () => {
    expect(() => {
      commentsObject.time = "invalid time";
    }).toThrow();
  });

  it("should reset all values", () => {
    commentsObject.content = "Test content";
    commentsObject.location = "Test location";
    commentsObject.time = "12:30:45";
    
    commentsObject.reset();
    
    expect(commentsObject.content).toBe("");
    expect(commentsObject.location).toBe("");
    expect(commentsObject.time).toBe("");
  });

  it("should convert to JSON correctly", () => {
    commentsObject.content = "Test content";
    commentsObject.location = "Test location";
    commentsObject.time = "12:30:45";
    
    const json = commentsObject.toJSON();
    
    expect(json).toEqual({
      content: "Test content",
      location: "Test location",
      time: "12:30:45"
    });
  });
}); 