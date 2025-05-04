import { beforeEach, describe, expect, it, vi } from "vitest";
import { CMITries, CMITriesObject } from "../../../src/cmi/aicc/tries";

describe("CMITries", () => {
  let tries: CMITries;

  beforeEach(() => {
    tries = new CMITries();
  });

  it("should initialize properly", () => {
    expect(tries).toBeDefined();
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(tries._cmi_element).toBe("cmi.student_data.tries");
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(tries.__children).toBeDefined();
  });

  it("should handle array operations", () => {
    // Test array functionality
    const triesObj = new CMITriesObject();
    tries.childArray.push(triesObj);

    expect(tries._count).toBe(1);
    expect(tries.childArray.length).toBe(1);
    expect(tries.childArray[0]).toBe(triesObj);
  });

  it("should not allow setting _children", () => {
    expect(() => {
      tries._children = "invalid";
    }).toThrow();
  });

  it("should not allow setting _count", () => {
    expect(() => {
      tries._count = 5;
    }).toThrow();
  });
});

describe("CMITriesObject", () => {
  let triesObject: CMITriesObject;

  beforeEach(() => {
    triesObject = new CMITriesObject();
  });

  it("should initialize with empty values", () => {
    expect(triesObject.status).toBe("");
    expect(triesObject.time).toBe("");
    expect(triesObject.score).toBeDefined();
  });

  it("should set and get status correctly", () => {
    triesObject.status = "completed";
    expect(triesObject.status).toBe("completed");

    triesObject.status = "incomplete";
    expect(triesObject.status).toBe("incomplete");
  });

  it("should reject invalid status values", () => {
    expect(() => {
      triesObject.status = "invalid_status";
    }).toThrow();
  });

  it("should set and get time correctly", () => {
    triesObject.time = "12:30:45";
    expect(triesObject.time).toBe("12:30:45");
  });

  it("should reject invalid time format", () => {
    expect(() => {
      triesObject.time = "invalid time";
    }).toThrow();
  });

  it("should initialize score property", () => {
    expect(triesObject.score).toBeDefined();
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(triesObject.score._cmi_element).toBe("cmi.student_data.tries.n.score");
  });

  it("should initialize when API is initialized", () => {
    const spy = vi.spyOn(triesObject.score, "initialize");

    triesObject.initialize();

    expect(spy).toHaveBeenCalled();
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(triesObject._initialized).toBe(true);
  });

  it("should reset all values", () => {
    triesObject.status = "completed";
    triesObject.time = "12:30:45";
    triesObject.initialize();

    const spy = vi.spyOn(triesObject.score, "reset");

    triesObject.reset();

    expect(triesObject.status).toBe("");
    expect(triesObject.time).toBe("");
    expect(spy).toHaveBeenCalled();
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(triesObject._initialized).toBe(false);
  });

  it("should convert to JSON correctly", () => {
    triesObject.status = "completed";
    triesObject.time = "12:30:45";

    const json = triesObject.toJSON();

    expect(json).toEqual({
      status: "completed",
      time: "12:30:45",
      score: triesObject.score,
    });

    // Verify jsonString flag is reset
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(triesObject.jsonString).toBe(false);
  });
});
