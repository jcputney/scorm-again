import { beforeEach, describe, expect, it } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import Scorm2004API from "../../src/Scorm2004API";
import { LogLevelEnum } from "../../src/constants/enums";
import { scorm12_errors, scorm2004_errors } from "../../src/constants/error_codes";

/**
 * Tests for D1, D2, D3 - Initialize/Terminate/Commit Argument Validation
 *
 * SCORM Specification Requirements:
 * - Initialize: SCORM 1.2 RTE 3.4.3.1, SCORM 2004 RTE 3.1.2.1
 * - Terminate: SCORM 1.2 RTE 3.4.3.2, SCORM 2004 RTE 3.1.2.2
 * - Commit: SCORM 1.2 RTE 3.4.4.1, SCORM 2004 RTE 3.1.2.5
 *
 * All three methods must accept exactly one parameter which must be an empty string.
 * Error Code: 201 (ARGUMENT_ERROR) for both SCORM 1.2 and SCORM 2004
 */

describe("SCORM 1.2 Argument Validation", () => {
  let scorm12API: Scorm12API;

  beforeEach(() => {
    scorm12API = new Scorm12API({ logLevel: LogLevelEnum.NONE });
  });

  describe("LMSInitialize argument validation", () => {
    it("should succeed when called with empty string", () => {
      const result = scorm12API.LMSInitialize("");
      expect(result).toBe("true");
      expect(scorm12API.LMSGetLastError()).toBe("0");
    });

    it("should succeed when called with no argument (defaults to empty string)", () => {
      const result = scorm12API.LMSInitialize();
      expect(result).toBe("true");
      expect(scorm12API.LMSGetLastError()).toBe("0");
    });

    it("should fail with error 201 when called with non-empty string", () => {
      const result = scorm12API.LMSInitialize("foo");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });

    it("should fail with error 201 when called with whitespace", () => {
      const result = scorm12API.LMSInitialize(" ");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });

    it("should fail with error 201 when called with any non-empty value", () => {
      const result = scorm12API.LMSInitialize("0");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });
  });

  describe("LMSFinish argument validation", () => {
    beforeEach(() => {
      scorm12API.LMSInitialize("");
    });

    it("should succeed when called with empty string", () => {
      const result = scorm12API.LMSFinish("");
      expect(result).toBe("true");
      expect(scorm12API.LMSGetLastError()).toBe("0");
    });

    it("should succeed when called with no argument (defaults to empty string)", () => {
      // Re-initialize for this test
      scorm12API = new Scorm12API({ logLevel: LogLevelEnum.NONE });
      scorm12API.LMSInitialize();
      const result = scorm12API.LMSFinish();
      expect(result).toBe("true");
      expect(scorm12API.LMSGetLastError()).toBe("0");
    });

    it("should fail with error 201 when called with non-empty string", () => {
      const result = scorm12API.LMSFinish("bar");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });

    it("should fail with error 201 when called with whitespace", () => {
      const result = scorm12API.LMSFinish(" ");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });
  });

  describe("LMSCommit argument validation", () => {
    beforeEach(() => {
      scorm12API.LMSInitialize("");
    });

    it("should succeed when called with empty string", () => {
      const result = scorm12API.LMSCommit("");
      expect(result).toBe("true");
      expect(scorm12API.LMSGetLastError()).toBe("0");
    });

    it("should succeed when called with no argument (defaults to empty string)", () => {
      const result = scorm12API.LMSCommit();
      expect(result).toBe("true");
      expect(scorm12API.LMSGetLastError()).toBe("0");
    });

    it("should fail with error 201 when called with non-empty string", () => {
      const result = scorm12API.LMSCommit("baz");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });

    it("should fail with error 201 when called with whitespace", () => {
      const result = scorm12API.LMSCommit("\t");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });
  });
});

describe("SCORM 2004 Argument Validation", () => {
  let scorm2004API: Scorm2004API;

  beforeEach(() => {
    scorm2004API = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
  });

  describe("Initialize argument validation", () => {
    it("should succeed when called with empty string", () => {
      const result = scorm2004API.Initialize("");
      expect(result).toBe("true");
      expect(scorm2004API.GetLastError()).toBe("0");
    });

    it("should succeed when called with no argument (defaults to empty string)", () => {
      const result = scorm2004API.Initialize();
      expect(result).toBe("true");
      expect(scorm2004API.GetLastError()).toBe("0");
    });

    it("should fail with error 201 when called with non-empty string", () => {
      const result = scorm2004API.Initialize("foo");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });

    it("should fail with error 201 when called with whitespace", () => {
      const result = scorm2004API.Initialize(" ");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });

    it("should fail with error 201 when called with any non-empty value", () => {
      const result = scorm2004API.Initialize("test");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });
  });

  describe("Terminate argument validation", () => {
    beforeEach(() => {
      scorm2004API.Initialize("");
    });

    it("should succeed when called with empty string", () => {
      const result = scorm2004API.Terminate("");
      expect(result).toBe("true");
      expect(scorm2004API.GetLastError()).toBe("0");
    });

    it("should succeed when called with no argument (defaults to empty string)", () => {
      // Re-initialize for this test
      scorm2004API = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
      scorm2004API.Initialize();
      const result = scorm2004API.Terminate();
      expect(result).toBe("true");
      expect(scorm2004API.GetLastError()).toBe("0");
    });

    it("should fail with error 201 when called with non-empty string", () => {
      const result = scorm2004API.Terminate("invalid");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });

    it("should fail with error 201 when called with whitespace", () => {
      const result = scorm2004API.Terminate(" ");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });
  });

  describe("Commit argument validation", () => {
    beforeEach(() => {
      scorm2004API.Initialize("");
    });

    it("should succeed when called with empty string", () => {
      const result = scorm2004API.Commit("");
      expect(result).toBe("true");
      expect(scorm2004API.GetLastError()).toBe("0");
    });

    it("should succeed when called with no argument (defaults to empty string)", () => {
      const result = scorm2004API.Commit();
      expect(result).toBe("true");
      expect(scorm2004API.GetLastError()).toBe("0");
    });

    it("should fail with error 201 when called with non-empty string", () => {
      const result = scorm2004API.Commit("data");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });

    it("should fail with error 201 when called with whitespace", () => {
      const result = scorm2004API.Commit("\n");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });
  });
});

describe("Argument validation edge cases", () => {
  describe("SCORM 1.2 - Argument validation should happen before other checks", () => {
    let scorm12API: Scorm12API;

    beforeEach(() => {
      scorm12API = new Scorm12API({ logLevel: LogLevelEnum.NONE });
    });

    it("LMSInitialize with invalid argument should return 201 even when already initialized", () => {
      scorm12API.LMSInitialize("");
      const result = scorm12API.LMSInitialize("invalid");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });

    it("LMSFinish with invalid argument should return 201 even when not initialized", () => {
      const result = scorm12API.LMSFinish("invalid");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });

    it("LMSCommit with invalid argument should return 201 even when not initialized", () => {
      const result = scorm12API.LMSCommit("invalid");
      expect(result).toBe("false");
      expect(scorm12API.LMSGetLastError()).toBe(String(scorm12_errors.ARGUMENT_ERROR));
    });
  });

  describe("SCORM 2004 - Argument validation should happen before other checks", () => {
    let scorm2004API: Scorm2004API;

    beforeEach(() => {
      scorm2004API = new Scorm2004API({ logLevel: LogLevelEnum.NONE });
    });

    it("Initialize with invalid argument should return 201 even when already initialized", () => {
      scorm2004API.Initialize("");
      const result = scorm2004API.Initialize("invalid");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });

    it("Terminate with invalid argument should return 201 even when not initialized", () => {
      const result = scorm2004API.Terminate("invalid");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });

    it("Commit with invalid argument should return 201 even when not initialized", () => {
      const result = scorm2004API.Commit("invalid");
      expect(result).toBe("false");
      expect(scorm2004API.GetLastError()).toBe(String(scorm2004_errors.ARGUMENT_ERROR));
    });
  });
});
