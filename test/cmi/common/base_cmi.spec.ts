import { describe, it, expect, beforeEach, vi } from "vitest";
import { BaseCMI, BaseRootCMI } from "../../../src/cmi/common/base_cmi";

// Create a concrete implementation of BaseCMI for testing
class TestCMI extends BaseCMI {
  reset(): void {
    this._initialized = false;
  }
}

// Create a concrete implementation of BaseRootCMI for testing
class TestRootCMI extends BaseRootCMI {
  reset(): void {
    this._initialized = false;
  }

  getCurrentTotalTime(): string {
    return "PT1H30M5S";
  }
}

describe("BaseCMI", () => {
  let cmi: TestCMI;

  beforeEach(() => {
    cmi = new TestCMI("cmi.test");
  });

  it("should initialize correctly", () => {
    expect(cmi.initialized).toBe(false);
    cmi.initialize();
    expect(cmi.initialized).toBe(true);
  });

  it("should reset correctly", () => {
    cmi.initialize();
    expect(cmi.initialized).toBe(true);
    cmi.reset();
    expect(cmi.initialized).toBe(false);
  });

  it("should set start time correctly", () => {
    // Mock Date.now
    const mockDate = new Date(2022, 1, 1, 12, 0, 0);
    const mockTime = mockDate.getTime();
    vi.spyOn(Date.prototype, "getTime").mockReturnValue(mockTime);

    expect(cmi.start_time).toBeUndefined();
    cmi.setStartTime();
    expect(cmi.start_time).toBe(mockTime);

    // Restore mock
    vi.restoreAllMocks();
  });

  it("should have jsonString property set to false by default", () => {
    expect(cmi.jsonString).toBe(false);
  });
});

describe("BaseRootCMI", () => {
  let rootCMI: TestRootCMI;

  beforeEach(() => {
    rootCMI = new TestRootCMI("cmi.root");
  });

  it("should initialize correctly", () => {
    expect(rootCMI.initialized).toBe(false);
    rootCMI.initialize();
    expect(rootCMI.initialized).toBe(true);
  });

  it("should reset correctly", () => {
    rootCMI.initialize();
    expect(rootCMI.initialized).toBe(true);
    rootCMI.reset();
    expect(rootCMI.initialized).toBe(false);
  });

  it("should implement getCurrentTotalTime", () => {
    expect(rootCMI.getCurrentTotalTime()).toBe("PT1H30M5S");
  });
}); 