import { beforeEach, describe, expect, it } from "vitest";
import { CMIPaths, CMIPathsObject } from "../../../src/cmi/aicc/paths";

describe("CMIPaths", () => {
  let paths: CMIPaths;

  beforeEach(() => {
    paths = new CMIPaths();
  });

  it("should initialize properly", () => {
    expect(paths).toBeDefined();
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(paths._cmi_element).toBe("cmi.paths");
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(paths.__children).toBeDefined();
  });

  it("should handle array operations", () => {
    // Test array functionality
    const pathsObj = new CMIPathsObject();
    paths.childArray.push(pathsObj);

    expect(paths._count).toBe(1);
    expect(paths.childArray.length).toBe(1);
    expect(paths.childArray[0]).toBe(pathsObj);
  });

  it("should not allow setting _children", () => {
    expect(() => {
      paths._children = "invalid";
    }).toThrow();
  });

  it("should not allow setting _count", () => {
    expect(() => {
      paths._count = 5;
    }).toThrow();
  });

  it("should convert to JSON correctly", () => {
    const pathsObj = new CMIPathsObject();
    pathsObj.location_id = "location1";
    paths.childArray.push(pathsObj);

    const json = paths.toJSON();
    expect(json).toBeDefined();
    // eslint-disable-next-line
    // @ts-ignore - accessing JSON by index
    expect(json["0"]).toBe(pathsObj);
  });
});

describe("CMIPathsObject", () => {
  let pathsObject: CMIPathsObject;

  beforeEach(() => {
    pathsObject = new CMIPathsObject();
  });

  it("should initialize with empty values", () => {
    // noinspection DuplicatedCode
    expect(pathsObject.location_id).toBe("");
    expect(pathsObject.date).toBe("");
    expect(pathsObject.time).toBe("");
    expect(pathsObject.status).toBe("");
    expect(pathsObject.why_left).toBe("");
    expect(pathsObject.time_in_element).toBe("");
  });

  it("should set and get location_id correctly", () => {
    pathsObject.location_id = "location1";
    expect(pathsObject.location_id).toBe("location1");
  });

  it("should reject invalid location_id format", () => {
    expect(() => {
      // Create a very long string (> 256 chars)
      pathsObject.location_id = "a".repeat(257);
    }).toThrow();
  });

  it("should set and get date correctly", () => {
    pathsObject.date = "2023-01-15";
    expect(pathsObject.date).toBe("2023-01-15");
  });

  it("should reject invalid date format", () => {
    expect(() => {
      // Create a very long string (> 256 chars)
      pathsObject.date = "a".repeat(257);
    }).toThrow();
  });

  it("should set and get time correctly", () => {
    pathsObject.time = "12:30:45";
    expect(pathsObject.time).toBe("12:30:45");
  });

  it("should reject invalid time format", () => {
    expect(() => {
      pathsObject.time = "invalid time";
    }).toThrow();
  });

  it("should set and get status correctly", () => {
    pathsObject.status = "completed";
    expect(pathsObject.status).toBe("completed");

    pathsObject.status = "incomplete";
    expect(pathsObject.status).toBe("incomplete");
  });

  it("should reject invalid status values", () => {
    expect(() => {
      pathsObject.status = "invalid_status";
    }).toThrow();
  });

  it("should set and get why_left correctly", () => {
    pathsObject.why_left = "User choice";
    expect(pathsObject.why_left).toBe("User choice");
  });

  it("should reject invalid why_left format", () => {
    expect(() => {
      // Create a very long string (> 256 chars)
      pathsObject.why_left = "a".repeat(257);
    }).toThrow();
  });

  it("should set and get time_in_element correctly", () => {
    pathsObject.time_in_element = "00:15:30";
    expect(pathsObject.time_in_element).toBe("00:15:30");
  });

  it("should reject invalid time_in_element format", () => {
    expect(() => {
      pathsObject.time_in_element = "invalid time";
    }).toThrow();
  });

  it("should reset all values", () => {
    pathsObject.location_id = "location1";
    pathsObject.date = "2023-01-15";
    pathsObject.time = "12:30:45";
    pathsObject.status = "completed";
    pathsObject.why_left = "User choice";
    pathsObject.time_in_element = "00:15:30";

    pathsObject.reset();

    // noinspection DuplicatedCode
    expect(pathsObject.location_id).toBe("");
    expect(pathsObject.date).toBe("");
    expect(pathsObject.time).toBe("");
    expect(pathsObject.status).toBe("");
    expect(pathsObject.why_left).toBe("");
    expect(pathsObject.time_in_element).toBe("");
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(pathsObject._initialized).toBe(false);
  });

  it("should convert to JSON correctly", () => {
    pathsObject.location_id = "location1";
    pathsObject.date = "2023-01-15";
    pathsObject.time = "12:30:45";
    pathsObject.status = "completed";
    pathsObject.why_left = "User choice";
    pathsObject.time_in_element = "00:15:30";

    const json = pathsObject.toJSON();

    expect(json).toEqual({
      location_id: "location1",
      date: "2023-01-15",
      time: "12:30:45",
      status: "completed",
      why_left: "User choice",
      time_in_element: "00:15:30",
    });

    // Verify jsonString flag is reset
    // eslint-disable-next-line
    // @ts-ignore - accessing private property for testing
    expect(pathsObject.jsonString).toBe(false);
  });
});
