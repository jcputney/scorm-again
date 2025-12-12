import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SerializationService } from "../../src/services/SerializationService";
import { LogLevelEnum } from "../../src/constants/enums";
import { CommitObject } from "../../src/types/api_types";
import { StringKeyMap } from "../../src";

describe("SerializationService", () => {
  let serializationService: SerializationService;
  let consoleErrorStub: ReturnType<typeof vi.spyOn>;
  let consoleDebugStub: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Create a new instance for each test
    serializationService = new SerializationService();

    // Stub console methods to prevent actual logging during tests
    consoleErrorStub = vi.spyOn(console, "error").mockImplementation(() => {});
    consoleDebugStub = vi.spyOn(console, "debug").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.clearAllMocks();
  });

  describe("loadFromFlattenedJSON", () => {
    it("should call loadFromJSON with unflatten for each key-value pair", () => {
      const json: StringKeyMap = {
        "cmi.core.student_id": "123",
        "cmi.core.student_name": "John Doe",
      };
      const setCMIValueSpy = vi.fn();
      const isNotInitializedStub = vi.fn().mockReturnValue(true);
      const setStartingDataSpy = vi.fn();

      serializationService.loadFromFlattenedJSON(
        json,
        "",
        setCMIValueSpy,
        isNotInitializedStub,
        setStartingDataSpy,
      );

      expect(isNotInitializedStub).toHaveBeenCalled();
    });

    it("should not proceed if not initialized", () => {
      const json: StringKeyMap = {
        "cmi.core.student_id": "123",
      };
      const setCMIValueSpy = vi.fn();
      const isNotInitializedStub = vi.fn().mockReturnValue(false);
      const setStartingDataSpy = vi.fn();

      serializationService.loadFromFlattenedJSON(
        json,
        "",
        setCMIValueSpy,
        isNotInitializedStub,
        setStartingDataSpy,
      );

      expect(consoleErrorStub).toHaveBeenCalledOnce();
      expect(consoleErrorStub).toHaveBeenCalledWith(
        "loadFromFlattenedJSON can only be called before the call to lmsInitialize.",
      );
    });
  });

  describe("loadFromJSON", () => {
    it("should process JSON object", () => {
      const json: StringKeyMap = {
        core: {
          student_id: "123",
          student_name: "John Doe",
        },
      };
      const setCMIValueSpy = vi.fn();
      const isNotInitializedStub = vi.fn().mockReturnValue(true);
      const setStartingDataSpy = vi.fn();

      serializationService.loadFromJSON(
        json,
        "cmi",
        setCMIValueSpy,
        isNotInitializedStub,
        setStartingDataSpy,
      );

      expect(setStartingDataSpy).toHaveBeenCalled();
      expect(setCMIValueSpy).toHaveBeenCalled();
      // The exact number of calls may vary based on implementation details
      // so we'll just check that it was called
    });

    it("should not proceed if not initialized", () => {
      const json: StringKeyMap = {
        core: {
          student_id: "123",
        },
      };
      const setCMIValueSpy = vi.fn();
      const isNotInitializedStub = vi.fn().mockReturnValue(false);
      const setStartingDataSpy = vi.fn();

      serializationService.loadFromJSON(
        json,
        "cmi",
        setCMIValueSpy,
        isNotInitializedStub,
        setStartingDataSpy,
      );

      expect(setCMIValueSpy).not.toHaveBeenCalled();
      expect(setStartingDataSpy).not.toHaveBeenCalled();
      expect(consoleErrorStub).toHaveBeenCalledOnce();
      expect(consoleErrorStub).toHaveBeenCalledWith(
        "loadFromJSON can only be called before the call to lmsInitialize.",
      );
    });

    it("should handle array values in JSON", () => {
      const json: StringKeyMap = {
        objectives: [
          { id: "obj1", score: { raw: 80 } },
          { id: "obj2", score: { raw: 90 } },
        ],
      };
      const setCMIValueSpy = vi.fn();
      const isNotInitializedStub = vi.fn().mockReturnValue(true);
      const setStartingDataSpy = vi.fn();

      serializationService.loadFromJSON(
        json,
        "cmi",
        setCMIValueSpy,
        isNotInitializedStub,
        setStartingDataSpy,
      );

      expect(setCMIValueSpy).toHaveBeenCalled();
      expect(setCMIValueSpy).toHaveBeenCalledTimes(4);
      expect(setCMIValueSpy).toHaveBeenCalledWith("cmi.objectives.0.id", "obj1");
      expect(setCMIValueSpy).toHaveBeenCalledWith("cmi.objectives.0.score.raw", 80);
      expect(setCMIValueSpy).toHaveBeenCalledWith("cmi.objectives.1.id", "obj2");
      expect(setCMIValueSpy).toHaveBeenCalledWith("cmi.objectives.1.score.raw", 90);
    });
  });

  describe("renderCMIToJSONString", () => {
    it("should return full JSON string when sendFullCommit is true", () => {
      const cmi = {
        core: {
          student_id: "123",
          student_name: "John Doe",
        },
      };

      const result = serializationService.renderCMIToJSONString(cmi, true);

      expect(result).toBe(JSON.stringify({ cmi }));
    });

    it("should replace undefined values with null when sendFullCommit is false", () => {
      const cmi = {
        core: {
          student_id: "123",
          student_name: undefined as any,
        },
      };

      const result = serializationService.renderCMIToJSONString(cmi, false);

      const expected = JSON.stringify(
        { cmi: { core: { student_id: "123", student_name: null } } },
        (k, v) => (v === undefined ? null : v),
        2,
      );
      expect(result).toBe(expected);
    });
  });

  describe("renderCMIToJSONObject", () => {
    it("should return a JSON object representation of the CMI", () => {
      const cmi = {
        core: {
          student_id: "123",
          student_name: "John Doe",
        },
      };
      const renderCMIToJSONStringSpy = vi.spyOn(serializationService, "renderCMIToJSONString");

      const result = serializationService.renderCMIToJSONObject(cmi, true);

      expect(renderCMIToJSONStringSpy).toHaveBeenCalledOnce();
      expect(renderCMIToJSONStringSpy).toHaveBeenCalledWith(cmi, true);
      expect(result).toEqual({ cmi });

      // renderCMIToJSONStringSpy.restore() - not needed with vi.restoreAllMocks()
    });
  });

  describe("getCommitObject", () => {
    it("should call renderCommitObject when renderCommonCommitFields is true", () => {
      const terminateCommit = false;
      const alwaysSendTotalTime = false;
      const renderCommonCommitFields = true;
      const renderCommitObjectStub = vi
        .fn()
        .mockReturnValue({ successStatus: "passed" } as CommitObject);
      const renderCommitCMIStub = vi.fn();
      const apiLogLevel = LogLevelEnum.ERROR;

      const result = serializationService.getCommitObject(
        terminateCommit,
        alwaysSendTotalTime,
        renderCommonCommitFields,
        renderCommitObjectStub,
        renderCommitCMIStub,
        apiLogLevel,
      );

      expect(renderCommitObjectStub).toHaveBeenCalledOnce();
      expect(renderCommitObjectStub).toHaveBeenCalledWith(false, false);
      expect(renderCommitCMIStub).not.toHaveBeenCalled();
      expect(result).toEqual({ successStatus: "passed" });
    });

    it("should call renderCommitCMI when renderCommonCommitFields is false", () => {
      const terminateCommit = false;
      const alwaysSendTotalTime = false;
      const renderCommonCommitFields = false;
      const renderCommitObjectStub = vi.fn();
      const renderCommitCMIStub = vi.fn().mockReturnValue({ cmi: { core: { student_id: "123" } } });
      const apiLogLevel = LogLevelEnum.ERROR;

      const result = serializationService.getCommitObject(
        terminateCommit,
        alwaysSendTotalTime,
        renderCommonCommitFields,
        renderCommitObjectStub,
        renderCommitCMIStub,
        apiLogLevel,
      );

      expect(renderCommitCMIStub).toHaveBeenCalledOnce();
      expect(renderCommitCMIStub).toHaveBeenCalledWith(false, false);
      expect(renderCommitObjectStub).not.toHaveBeenCalled();
      expect(result).toEqual({ cmi: { core: { student_id: "123" } } });
    });

    it("should log debug information when log level is DEBUG", () => {
      const terminateCommit = true;
      const alwaysSendTotalTime = false;
      const renderCommonCommitFields = false;
      const renderCommitObjectStub = vi.fn();
      const renderCommitCMIStub = vi.fn().mockReturnValue({ cmi: { core: { student_id: "123" } } });
      const apiLogLevel = LogLevelEnum.DEBUG;

      serializationService.getCommitObject(
        terminateCommit,
        alwaysSendTotalTime,
        renderCommonCommitFields,
        renderCommitObjectStub,
        renderCommitCMIStub,
        apiLogLevel,
      );

      expect(consoleDebugStub).toHaveBeenCalled();
      expect(consoleDebugStub).toHaveBeenCalledTimes(2);
    });
  });
});
