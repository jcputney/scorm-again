import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  GlobalObjectiveManager,
  GlobalObjectiveContext,
} from "../../src/objectives/global_objective_manager";
import { CMIObjectivesObject } from "../../src/cmi/scorm2004/objectives";
import { SuccessStatus, CompletionStatus } from "../../src/constants/enums";
import { GlobalObjectiveMapEntry, Settings } from "../../src/types/api_types";
import { SequencingService } from "../../src/services/SequencingService";
import { OverallSequencingProcess } from "../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import { Sequencing } from "../../src/cmi/scorm2004/sequencing/sequencing";
import {
  createMockGlobalObjectiveContext,
  createMockOverallProcess,
} from "../helpers/mock-factories";

describe("GlobalObjectiveManager", () => {
  let manager: GlobalObjectiveManager;
  let mockContext: GlobalObjectiveContext;

  beforeEach(() => {
    mockContext = createMockGlobalObjectiveContext();
    manager = new GlobalObjectiveManager(mockContext);
  });

  describe("constructor", () => {
    it("should create manager with context", () => {
      expect(manager).toBeDefined();
      expect(manager.globalObjectives).toEqual([]);
    });
  });

  describe("globalObjectives getter/setter", () => {
    it("should return empty array initially", () => {
      expect(manager.globalObjectives).toEqual([]);
    });

    it("should set and get global objectives", () => {
      const objectives: CMIObjectivesObject[] = [
        { id: "obj1" } as CMIObjectivesObject,
        { id: "obj2" } as CMIObjectivesObject,
      ];

      manager.globalObjectives = objectives;

      expect(manager.globalObjectives).toEqual(objectives);
    });
  });

  describe("updateSequencingService", () => {
    it("should update sequencing service reference", () => {
      const mockService = {} as SequencingService;

      manager.updateSequencingService(mockService);

      expect(mockContext.sequencingService).toBe(mockService);
    });

    it("should set to null", () => {
      mockContext.sequencingService = {} as SequencingService;

      manager.updateSequencingService(null);

      expect(mockContext.sequencingService).toBeNull();
    });
  });

  describe("syncGlobalObjectiveIdsFromSequencing", () => {
    it("should return early when no sequencing service", () => {
      manager.syncGlobalObjectiveIdsFromSequencing();

      expect(mockContext.getSettings).not.toHaveBeenCalled();
    });

    it("should return early when no overall process", () => {
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(null),
      } as unknown as SequencingService;

      manager.syncGlobalObjectiveIdsFromSequencing();

      expect(mockContext.getSettings).not.toHaveBeenCalled();
    });

    it("should return early when no global objective map", () => {
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(createMockOverallProcess()),
      } as unknown as SequencingService;

      manager.syncGlobalObjectiveIdsFromSequencing();

      expect(mockContext.getSettings).not.toHaveBeenCalled();
    });

    it("should merge global objective IDs from map", () => {
      const globalObjectiveMap = new Map<string, GlobalObjectiveMapEntry>();
      globalObjectiveMap.set("global1", {} as GlobalObjectiveMapEntry);
      globalObjectiveMap.set("global2", {} as GlobalObjectiveMapEntry);

      const settings: Settings = { globalObjectiveIds: ["existing1"] } as Settings;
      mockContext.getSettings = vi.fn().mockReturnValue(settings);
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi
          .fn()
          .mockReturnValue(createMockOverallProcess({ globalObjectiveMap })),
      } as unknown as SequencingService;

      manager.syncGlobalObjectiveIdsFromSequencing();

      expect(settings.globalObjectiveIds).toContain("existing1");
      expect(settings.globalObjectiveIds).toContain("global1");
      expect(settings.globalObjectiveIds).toContain("global2");
    });

    it("should handle empty existing globalObjectiveIds", () => {
      const globalObjectiveMap = new Map<string, GlobalObjectiveMapEntry>();
      globalObjectiveMap.set("newGlobal", {} as GlobalObjectiveMapEntry);

      const settings: Settings = { globalObjectiveIds: undefined } as unknown as Settings;
      mockContext.getSettings = vi.fn().mockReturnValue(settings);
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi
          .fn()
          .mockReturnValue(createMockOverallProcess({ globalObjectiveMap })),
      } as unknown as SequencingService;

      manager.syncGlobalObjectiveIdsFromSequencing();

      expect(settings.globalObjectiveIds).toContain("newGlobal");
    });
  });

  describe("restoreGlobalObjectivesToCMI", () => {
    it("should return early when no global objectives", () => {
      manager.restoreGlobalObjectivesToCMI();

      expect(mockContext.commonSetCMIValue).not.toHaveBeenCalled();
    });

    it("should skip objectives without id", () => {
      manager.globalObjectives = [{ id: "" } as CMIObjectivesObject];

      manager.restoreGlobalObjectivesToCMI();

      expect(mockContext.commonSetCMIValue).not.toHaveBeenCalled();
    });

    it("should skip null objectives", () => {
      manager.globalObjectives = [null as unknown as CMIObjectivesObject];

      manager.restoreGlobalObjectivesToCMI();

      expect(mockContext.commonSetCMIValue).not.toHaveBeenCalled();
    });

    it("should skip existing objectives", () => {
      manager.globalObjectives = [{ id: "existing" } as CMIObjectivesObject];
      (mockContext.cmi.objectives.findObjectiveById as ReturnType<typeof vi.fn>).mockReturnValue({
        id: "existing",
      });

      manager.restoreGlobalObjectivesToCMI();

      expect(mockContext.commonSetCMIValue).not.toHaveBeenCalled();
    });

    it("should restore objective with id only", () => {
      manager.globalObjectives = [
        {
          id: "obj1",
          success_status: "unknown",
          completion_status: "unknown",
          score: { scaled: "", raw: "", min: "", max: "" },
          progress_measure: "",
          description: "",
        } as CMIObjectivesObject,
      ];

      manager.restoreGlobalObjectivesToCMI();

      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.id",
        "obj1",
      );
      // Should only set id since other values are default
      expect(mockContext.commonSetCMIValue).toHaveBeenCalledTimes(1);
    });

    it("should restore objective with all properties", () => {
      manager.globalObjectives = [
        {
          id: "obj1",
          success_status: "passed",
          completion_status: "completed",
          score: { scaled: "0.85", raw: "85", min: "0", max: "100" },
          progress_measure: "0.9",
          description: "Test Objective",
        } as CMIObjectivesObject,
      ];

      manager.restoreGlobalObjectivesToCMI();

      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.id",
        "obj1",
      );
      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.success_status",
        "passed",
      );
      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.completion_status",
        "completed",
      );
      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.score.scaled",
        "0.85",
      );
      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.score.raw",
        "85",
      );
      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.score.min",
        "0",
      );
      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.score.max",
        "100",
      );
      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.progress_measure",
        "0.9",
      );
      expect(mockContext.commonSetCMIValue).toHaveBeenCalledWith(
        "RestoreGlobalObjective",
        true,
        "cmi.objectives.0.description",
        "Test Objective",
      );
    });

    it("should skip null score values", () => {
      manager.globalObjectives = [
        {
          id: "obj1",
          success_status: "unknown",
          completion_status: "unknown",
          score: { scaled: null, raw: null, min: null, max: null },
          progress_measure: null,
          description: "",
        } as unknown as CMIObjectivesObject,
      ];

      manager.restoreGlobalObjectivesToCMI();

      expect(mockContext.commonSetCMIValue).toHaveBeenCalledTimes(1); // Only id
    });
  });

  describe("updateGlobalObjectiveFromCMI", () => {
    it("should return early when no objectiveId", () => {
      manager.updateGlobalObjectiveFromCMI("", {} as CMIObjectivesObject);

      // Should not have called any methods
    });

    it("should return early when no sequencing service", () => {
      manager.updateGlobalObjectiveFromCMI("obj1", {} as CMIObjectivesObject);

      // Should not have called any methods
    });

    it("should return early when no overall process", () => {
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(null),
      } as unknown as SequencingService;

      manager.updateGlobalObjectiveFromCMI("obj1", {} as CMIObjectivesObject);
    });

    it("should create fallback entry when objective not in map", () => {
      const mockProcess = createMockOverallProcess() as unknown as OverallSequencingProcess;
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(mockProcess),
      } as unknown as SequencingService;

      const objective: CMIObjectivesObject = {
        id: "newObj",
        success_status: "passed",
      } as CMIObjectivesObject;

      manager.updateGlobalObjectiveFromCMI("newObj", objective);

      expect(mockProcess.updateGlobalObjective).toHaveBeenCalledWith(
        "newObj",
        expect.objectContaining({ id: "newObj" }),
      );
    });

    it("should update existing objective with success status", () => {
      const globalObjectiveMap = new Map<string, GlobalObjectiveMapEntry>();
      globalObjectiveMap.set("existingObj", {} as GlobalObjectiveMapEntry);
      const mockProcess = createMockOverallProcess({
        globalObjectiveMap,
      }) as unknown as OverallSequencingProcess;
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(mockProcess),
      } as unknown as SequencingService;

      const objective: CMIObjectivesObject = {
        id: "existingObj",
        success_status: SuccessStatus.PASSED,
      } as CMIObjectivesObject;

      manager.updateGlobalObjectiveFromCMI("existingObj", objective);

      expect(mockProcess.updateGlobalObjective).toHaveBeenCalledWith(
        "existingObj",
        expect.objectContaining({
          satisfiedStatus: true,
          satisfiedStatusKnown: true,
        }),
      );
    });

    it("should update existing objective with failed status", () => {
      const globalObjectiveMap = new Map<string, GlobalObjectiveMapEntry>();
      globalObjectiveMap.set("obj", {} as GlobalObjectiveMapEntry);
      const mockProcess = createMockOverallProcess({
        globalObjectiveMap,
      }) as unknown as OverallSequencingProcess;
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(mockProcess),
      } as unknown as SequencingService;

      const objective: CMIObjectivesObject = {
        id: "obj",
        success_status: SuccessStatus.FAILED,
      } as CMIObjectivesObject;

      manager.updateGlobalObjectiveFromCMI("obj", objective);

      expect(mockProcess.updateGlobalObjective).toHaveBeenCalledWith(
        "obj",
        expect.objectContaining({
          satisfiedStatus: false,
          satisfiedStatusKnown: true,
        }),
      );
    });

    it("should update existing objective with normalized measure", () => {
      const globalObjectiveMap = new Map<string, GlobalObjectiveMapEntry>();
      globalObjectiveMap.set("obj", {} as GlobalObjectiveMapEntry);
      const mockProcess = createMockOverallProcess({
        globalObjectiveMap,
      }) as unknown as OverallSequencingProcess;
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(mockProcess),
      } as unknown as SequencingService;

      const objective: CMIObjectivesObject = {
        id: "obj",
        score: { scaled: "0.75" },
      } as CMIObjectivesObject;

      manager.updateGlobalObjectiveFromCMI("obj", objective);

      expect(mockProcess.updateGlobalObjective).toHaveBeenCalledWith(
        "obj",
        expect.objectContaining({
          normalizedMeasure: 0.75,
          normalizedMeasureKnown: true,
        }),
      );
    });

    it("should update existing objective with progress measure", () => {
      const globalObjectiveMap = new Map<string, GlobalObjectiveMapEntry>();
      globalObjectiveMap.set("obj", {} as GlobalObjectiveMapEntry);
      const mockProcess = createMockOverallProcess({
        globalObjectiveMap,
      }) as unknown as OverallSequencingProcess;
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(mockProcess),
      } as unknown as SequencingService;

      const objective: CMIObjectivesObject = {
        id: "obj",
        progress_measure: "0.5",
      } as CMIObjectivesObject;

      manager.updateGlobalObjectiveFromCMI("obj", objective);

      expect(mockProcess.updateGlobalObjective).toHaveBeenCalledWith(
        "obj",
        expect.objectContaining({
          progressMeasure: 0.5,
          progressMeasureKnown: true,
        }),
      );
    });

    it("should update existing objective with completion status", () => {
      const globalObjectiveMap = new Map<string, GlobalObjectiveMapEntry>();
      globalObjectiveMap.set("obj", {} as GlobalObjectiveMapEntry);
      const mockProcess = createMockOverallProcess({
        globalObjectiveMap,
      }) as unknown as OverallSequencingProcess;
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(mockProcess),
      } as unknown as SequencingService;

      const objective: CMIObjectivesObject = {
        id: "obj",
        completion_status: CompletionStatus.COMPLETED,
      } as CMIObjectivesObject;

      manager.updateGlobalObjectiveFromCMI("obj", objective);

      expect(mockProcess.updateGlobalObjective).toHaveBeenCalledWith(
        "obj",
        expect.objectContaining({
          completionStatus: CompletionStatus.COMPLETED,
          completionStatusKnown: true,
        }),
      );
    });

    it("should not update when no values changed", () => {
      const globalObjectiveMap = new Map<string, GlobalObjectiveMapEntry>();
      globalObjectiveMap.set("obj", {} as GlobalObjectiveMapEntry);
      const mockProcess = createMockOverallProcess({
        globalObjectiveMap,
      }) as unknown as OverallSequencingProcess;
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue(mockProcess),
      } as unknown as SequencingService;

      const objective: CMIObjectivesObject = {
        id: "obj",
        success_status: SuccessStatus.UNKNOWN,
        completion_status: CompletionStatus.UNKNOWN,
      } as CMIObjectivesObject;

      manager.updateGlobalObjectiveFromCMI("obj", objective);

      expect(mockProcess.updateGlobalObjective).not.toHaveBeenCalled();
    });
  });

  describe("buildObjectiveMapEntryFromCMI", () => {
    it("should build basic entry with defaults", () => {
      const objective: CMIObjectivesObject = { id: "obj1" } as CMIObjectivesObject;

      const entry = manager.buildObjectiveMapEntryFromCMI(objective);

      expect(entry.id).toBe("obj1");
      expect(entry.satisfiedStatusKnown).toBe(false);
      expect(entry.normalizedMeasureKnown).toBe(false);
      expect(entry.progressMeasureKnown).toBe(false);
      expect(entry.completionStatusKnown).toBe(false);
      expect(entry.readSatisfiedStatus).toBe(true);
      expect(entry.writeSatisfiedStatus).toBe(true);
    });

    it("should set satisfied status for passed", () => {
      const objective: CMIObjectivesObject = {
        id: "obj1",
        success_status: SuccessStatus.PASSED,
      } as CMIObjectivesObject;

      const entry = manager.buildObjectiveMapEntryFromCMI(objective);

      expect(entry.satisfiedStatus).toBe(true);
      expect(entry.satisfiedStatusKnown).toBe(true);
    });

    it("should set satisfied status for failed", () => {
      const objective: CMIObjectivesObject = {
        id: "obj1",
        success_status: SuccessStatus.FAILED,
      } as CMIObjectivesObject;

      const entry = manager.buildObjectiveMapEntryFromCMI(objective);

      expect(entry.satisfiedStatus).toBe(false);
      expect(entry.satisfiedStatusKnown).toBe(true);
    });

    it("should set normalized measure", () => {
      const objective: CMIObjectivesObject = {
        id: "obj1",
        score: { scaled: "0.9" },
      } as CMIObjectivesObject;

      const entry = manager.buildObjectiveMapEntryFromCMI(objective);

      expect(entry.normalizedMeasure).toBe(0.9);
      expect(entry.normalizedMeasureKnown).toBe(true);
    });

    it("should set progress measure", () => {
      const objective: CMIObjectivesObject = {
        id: "obj1",
        progress_measure: "0.6",
      } as CMIObjectivesObject;

      const entry = manager.buildObjectiveMapEntryFromCMI(objective);

      expect(entry.progressMeasure).toBe(0.6);
      expect(entry.progressMeasureKnown).toBe(true);
    });

    it("should set completion status", () => {
      const objective: CMIObjectivesObject = {
        id: "obj1",
        completion_status: CompletionStatus.COMPLETED,
      } as CMIObjectivesObject;

      const entry = manager.buildObjectiveMapEntryFromCMI(objective);

      expect(entry.completionStatus).toBe(CompletionStatus.COMPLETED);
      expect(entry.completionStatusKnown).toBe(true);
    });
  });

  describe("buildCMIObjectivesFromMap", () => {
    it("should return empty array for null/invalid snapshot", () => {
      expect(
        manager.buildCMIObjectivesFromMap(
          null as unknown as Record<string, GlobalObjectiveMapEntry>,
        ),
      ).toEqual([]);
      expect(
        manager.buildCMIObjectivesFromMap(
          undefined as unknown as Record<string, GlobalObjectiveMapEntry>,
        ),
      ).toEqual([]);
      expect(
        manager.buildCMIObjectivesFromMap(
          "invalid" as unknown as Record<string, GlobalObjectiveMapEntry>,
        ),
      ).toEqual([]);
    });

    it("should skip invalid entries", () => {
      const snapshot: Record<string, GlobalObjectiveMapEntry> = {
        valid: { id: "valid" } as GlobalObjectiveMapEntry,
        invalid: null as unknown as GlobalObjectiveMapEntry,
        alsoInvalid: "string" as unknown as GlobalObjectiveMapEntry,
      };

      const result = manager.buildCMIObjectivesFromMap(snapshot);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("valid");
    });

    it("should build objective with satisfied status true", () => {
      const snapshot: Record<string, GlobalObjectiveMapEntry> = {
        obj1: {
          id: "obj1",
          satisfiedStatusKnown: true,
          satisfiedStatus: true,
        } as GlobalObjectiveMapEntry,
      };

      const result = manager.buildCMIObjectivesFromMap(snapshot);

      expect(result[0].success_status).toBe(SuccessStatus.PASSED);
    });

    it("should build objective with satisfied status false", () => {
      const snapshot: Record<string, GlobalObjectiveMapEntry> = {
        obj1: {
          id: "obj1",
          satisfiedStatusKnown: true,
          satisfiedStatus: false,
        } as GlobalObjectiveMapEntry,
      };

      const result = manager.buildCMIObjectivesFromMap(snapshot);

      expect(result[0].success_status).toBe(SuccessStatus.FAILED);
    });

    it("should build objective with normalized measure", () => {
      const snapshot: Record<string, GlobalObjectiveMapEntry> = {
        obj1: {
          id: "obj1",
          normalizedMeasureKnown: true,
          normalizedMeasure: 0.85,
        } as GlobalObjectiveMapEntry,
      };

      const result = manager.buildCMIObjectivesFromMap(snapshot);

      expect(result[0].score.scaled).toBe("0.85");
    });

    it("should build objective with progress measure", () => {
      const snapshot: Record<string, GlobalObjectiveMapEntry> = {
        obj1: {
          id: "obj1",
          progressMeasureKnown: true,
          progressMeasure: 0.7,
        } as GlobalObjectiveMapEntry,
      };

      const result = manager.buildCMIObjectivesFromMap(snapshot);

      expect(result[0].progress_measure).toBe("0.7");
    });

    it("should build objective with completion status", () => {
      const snapshot: Record<string, GlobalObjectiveMapEntry> = {
        obj1: {
          id: "obj1",
          completionStatusKnown: true,
          completionStatus: "completed",
        } as GlobalObjectiveMapEntry,
      };

      const result = manager.buildCMIObjectivesFromMap(snapshot);

      expect(result[0].completion_status).toBe("completed");
    });

    it("should use key as id when entry has no id", () => {
      const snapshot: Record<string, GlobalObjectiveMapEntry> = {
        myKey: {
          satisfiedStatusKnown: false,
        } as GlobalObjectiveMapEntry,
      };

      const result = manager.buildCMIObjectivesFromMap(snapshot);

      expect(result[0].id).toBe("myKey");
    });
  });

  describe("buildCMIObjectiveFromJSON", () => {
    it("should return empty objective for null/invalid data", () => {
      const result1 = manager.buildCMIObjectiveFromJSON(null);
      const result2 = manager.buildCMIObjectiveFromJSON(undefined);
      const result3 = manager.buildCMIObjectiveFromJSON("invalid");

      expect(result1).toBeInstanceOf(CMIObjectivesObject);
      expect(result2).toBeInstanceOf(CMIObjectivesObject);
      expect(result3).toBeInstanceOf(CMIObjectivesObject);
    });

    it("should build objective with id", () => {
      const result = manager.buildCMIObjectiveFromJSON({ id: "testId" });

      expect(result.id).toBe("testId");
    });

    it("should build objective with success_status", () => {
      const result = manager.buildCMIObjectiveFromJSON({ success_status: "passed" });

      expect(result.success_status).toBe("passed");
    });

    it("should build objective with completion_status", () => {
      const result = manager.buildCMIObjectiveFromJSON({ completion_status: "completed" });

      expect(result.completion_status).toBe("completed");
    });

    it("should build objective with progress_measure", () => {
      const result = manager.buildCMIObjectiveFromJSON({ progress_measure: "0.5" });

      expect(result.progress_measure).toBe("0.5");
    });

    it("should skip empty progress_measure", () => {
      const result = manager.buildCMIObjectiveFromJSON({ progress_measure: "" });

      expect(result.progress_measure).toBe("");
    });

    it("should build objective with description", () => {
      const result = manager.buildCMIObjectiveFromJSON({ description: "Test Description" });

      expect(result.description).toBe("Test Description");
    });

    it("should build objective with score scaled as string", () => {
      const result = manager.buildCMIObjectiveFromJSON({ score: { scaled: "0.8" } });

      expect(result.score.scaled).toBe("0.8");
    });

    it("should build objective with score scaled as number", () => {
      const result = manager.buildCMIObjectiveFromJSON({ score: { scaled: 0.8 } });

      expect(result.score.scaled).toBe("0.8");
    });

    it("should skip empty score scaled", () => {
      const result = manager.buildCMIObjectiveFromJSON({ score: { scaled: "" } });

      expect(result.score.scaled).toBe("");
    });

    it("should build objective with score raw as string", () => {
      const result = manager.buildCMIObjectiveFromJSON({ score: { raw: "80" } });

      expect(result.score.raw).toBe("80");
    });

    it("should build objective with score raw as number", () => {
      const result = manager.buildCMIObjectiveFromJSON({ score: { raw: 80 } });

      expect(result.score.raw).toBe("80");
    });

    it("should build objective with score min as string", () => {
      const result = manager.buildCMIObjectiveFromJSON({ score: { min: "0" } });

      expect(result.score.min).toBe("0");
    });

    it("should build objective with score min as number", () => {
      const result = manager.buildCMIObjectiveFromJSON({ score: { min: 0 } });

      expect(result.score.min).toBe("0");
    });

    it("should build objective with score max as string", () => {
      const result = manager.buildCMIObjectiveFromJSON({ score: { max: "100" } });

      expect(result.score.max).toBe("100");
    });

    it("should build objective with score max as number", () => {
      const result = manager.buildCMIObjectiveFromJSON({ score: { max: 100 } });

      expect(result.score.max).toBe("100");
    });

    it("should handle non-finite numbers", () => {
      const result = manager.buildCMIObjectiveFromJSON({
        score: {
          scaled: Infinity,
          raw: NaN,
          min: -Infinity,
        },
      });

      expect(result.score.scaled).toBe("");
      expect(result.score.raw).toBe("");
      expect(result.score.min).toBe("");
    });
  });

  describe("captureGlobalObjectiveSnapshot", () => {
    it("should return empty snapshot when no process and no global objectives", () => {
      const result = manager.captureGlobalObjectiveSnapshot();

      expect(result).toEqual({});
    });

    it("should capture from provided process", () => {
      const mockProcess = {
        getGlobalObjectiveMapSnapshot: vi.fn().mockReturnValue({
          obj1: { id: "obj1", satisfiedStatus: true },
        }),
      } as unknown as OverallSequencingProcess;

      const result = manager.captureGlobalObjectiveSnapshot(mockProcess);

      expect(result.obj1).toBeDefined();
      expect(result.obj1.satisfiedStatus).toBe(true);
    });

    it("should capture from sequencing service if no process provided", () => {
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue({
          getGlobalObjectiveMapSnapshot: vi.fn().mockReturnValue({
            obj1: { id: "obj1" },
          }),
        }),
      } as unknown as SequencingService;

      const result = manager.captureGlobalObjectiveSnapshot();

      expect(result.obj1).toBeDefined();
    });

    it("should include global objectives not in process snapshot", () => {
      manager.globalObjectives = [
        { id: "globalObj", success_status: SuccessStatus.PASSED } as CMIObjectivesObject,
      ];

      const result = manager.captureGlobalObjectiveSnapshot();

      expect(result.globalObj).toBeDefined();
    });

    it("should not overwrite process snapshot with global objectives", () => {
      mockContext.sequencingService = {
        getOverallSequencingProcess: vi.fn().mockReturnValue({
          getGlobalObjectiveMapSnapshot: vi.fn().mockReturnValue({
            shared: { id: "shared", satisfiedStatus: true },
          }),
        }),
      } as unknown as SequencingService;

      manager.globalObjectives = [
        { id: "shared", success_status: SuccessStatus.FAILED } as CMIObjectivesObject,
      ];

      const result = manager.captureGlobalObjectiveSnapshot();

      // Process snapshot should take precedence
      expect(result.shared.satisfiedStatus).toBe(true);
    });

    it("should skip global objectives without id", () => {
      manager.globalObjectives = [
        { id: "", success_status: SuccessStatus.PASSED } as CMIObjectivesObject,
      ];

      const result = manager.captureGlobalObjectiveSnapshot();

      expect(Object.keys(result)).toHaveLength(0);
    });
  });

  describe("parseObjectiveNumber", () => {
    it("should return null for null/undefined", () => {
      expect(manager.parseObjectiveNumber(null)).toBeNull();
      expect(manager.parseObjectiveNumber(undefined)).toBeNull();
    });

    it("should return finite numbers directly", () => {
      expect(manager.parseObjectiveNumber(0.5)).toBe(0.5);
      expect(manager.parseObjectiveNumber(0)).toBe(0);
      expect(manager.parseObjectiveNumber(-1)).toBe(-1);
    });

    it("should return null for non-finite numbers", () => {
      expect(manager.parseObjectiveNumber(Infinity)).toBeNull();
      expect(manager.parseObjectiveNumber(-Infinity)).toBeNull();
      expect(manager.parseObjectiveNumber(NaN)).toBeNull();
    });

    it("should parse string numbers", () => {
      expect(manager.parseObjectiveNumber("0.5")).toBe(0.5);
      expect(manager.parseObjectiveNumber("100")).toBe(100);
    });

    it("should return null for non-parseable strings", () => {
      expect(manager.parseObjectiveNumber("abc")).toBeNull();
      expect(manager.parseObjectiveNumber("")).toBeNull();
    });
  });

  describe("syncCmiToSequencingActivity", () => {
    it("should return early when no sequencing", () => {
      mockContext.sequencing = null;

      manager.syncCmiToSequencingActivity(CompletionStatus.COMPLETED, SuccessStatus.PASSED);

      // Should not throw and just return
    });

    it("should return early when no current activity", () => {
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue(null),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(CompletionStatus.COMPLETED, SuccessStatus.PASSED);
    });

    it("should return early when no primary objective", () => {
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue({}),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(CompletionStatus.COMPLETED, SuccessStatus.PASSED);
    });

    it("should update activity on passed success status", () => {
      const primaryObjective = {
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        measureStatus: false,
        completionStatus: CompletionStatus.UNKNOWN,
      };
      const activity = {
        primaryObjective,
        objectiveMeasureStatus: false,
        objectiveSatisfiedStatus: false,
        objectiveSatisfiedStatusKnown: false,
      };
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue(activity),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(CompletionStatus.UNKNOWN, SuccessStatus.PASSED);

      expect(primaryObjective.satisfiedStatus).toBe(true);
      expect(primaryObjective.satisfiedStatusKnown).toBe(true);
      expect(primaryObjective.measureStatus).toBe(true);
      expect(activity.objectiveMeasureStatus).toBe(true);
      expect(activity.objectiveSatisfiedStatus).toBe(true);
      expect(activity.objectiveSatisfiedStatusKnown).toBe(true);
    });

    it("should update activity on failed success status", () => {
      const primaryObjective = {
        satisfiedStatus: true,
        satisfiedStatusKnown: false,
        measureStatus: false,
        completionStatus: CompletionStatus.UNKNOWN,
      };
      const activity = {
        primaryObjective,
        objectiveMeasureStatus: false,
        objectiveSatisfiedStatus: true,
        objectiveSatisfiedStatusKnown: false,
      };
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue(activity),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(CompletionStatus.UNKNOWN, SuccessStatus.FAILED);

      expect(primaryObjective.satisfiedStatus).toBe(false);
      expect(activity.objectiveSatisfiedStatus).toBe(false);
    });

    it("should not update on unknown success status", () => {
      const primaryObjective = {
        satisfiedStatus: true,
        satisfiedStatusKnown: true,
        measureStatus: true,
        completionStatus: CompletionStatus.UNKNOWN,
      };
      const activity = {
        primaryObjective,
        objectiveMeasureStatus: true,
        objectiveSatisfiedStatus: true,
        objectiveSatisfiedStatusKnown: true,
      };
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue(activity),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(CompletionStatus.UNKNOWN, SuccessStatus.UNKNOWN);

      // Values should remain unchanged
      expect(primaryObjective.satisfiedStatus).toBe(true);
    });

    it("should update completion status", () => {
      const primaryObjective = {
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        measureStatus: false,
        completionStatus: CompletionStatus.UNKNOWN,
      };
      const activity = {
        primaryObjective,
        objectiveMeasureStatus: false,
        objectiveSatisfiedStatus: false,
        objectiveSatisfiedStatusKnown: false,
      };
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue(activity),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(CompletionStatus.COMPLETED, SuccessStatus.UNKNOWN);

      expect(primaryObjective.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should not update on unknown completion status", () => {
      const primaryObjective = {
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        measureStatus: false,
        completionStatus: CompletionStatus.COMPLETED,
      };
      const activity = {
        primaryObjective,
        objectiveMeasureStatus: false,
        objectiveSatisfiedStatus: false,
        objectiveSatisfiedStatusKnown: false,
      };
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue(activity),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(CompletionStatus.UNKNOWN, SuccessStatus.UNKNOWN);

      expect(primaryObjective.completionStatus).toBe(CompletionStatus.COMPLETED);
    });

    it("should update normalized measure from score", () => {
      const primaryObjective = {
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        measureStatus: false,
        completionStatus: CompletionStatus.UNKNOWN,
        normalizedMeasure: 0,
      };
      const activity = {
        primaryObjective,
        objectiveMeasureStatus: false,
        objectiveSatisfiedStatus: false,
        objectiveSatisfiedStatusKnown: false,
      };
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue(activity),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(CompletionStatus.UNKNOWN, SuccessStatus.UNKNOWN, {
        scaled: 0.85,
      });

      expect(primaryObjective.normalizedMeasure).toBe(0.85);
      expect(primaryObjective.measureStatus).toBe(true);
    });

    it("should handle undefined score object", () => {
      const primaryObjective = {
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        measureStatus: false,
        completionStatus: CompletionStatus.UNKNOWN,
        normalizedMeasure: 0.5,
      };
      const activity = {
        primaryObjective,
        objectiveMeasureStatus: true,
        objectiveSatisfiedStatus: false,
        objectiveSatisfiedStatusKnown: false,
      };
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue(activity),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(
        CompletionStatus.UNKNOWN,
        SuccessStatus.UNKNOWN,
        undefined,
      );

      expect(primaryObjective.normalizedMeasure).toBe(0.5); // Unchanged
    });

    it("should handle null scaled in score object", () => {
      const primaryObjective = {
        satisfiedStatus: false,
        satisfiedStatusKnown: false,
        measureStatus: false,
        completionStatus: CompletionStatus.UNKNOWN,
        normalizedMeasure: 0.5,
      };
      const activity = {
        primaryObjective,
        objectiveMeasureStatus: true,
        objectiveSatisfiedStatus: false,
        objectiveSatisfiedStatusKnown: false,
      };
      mockContext.sequencing = {
        getCurrentActivity: vi.fn().mockReturnValue(activity),
      } as unknown as Sequencing;

      manager.syncCmiToSequencingActivity(CompletionStatus.UNKNOWN, SuccessStatus.UNKNOWN, {
        scaled: null,
      });

      expect(primaryObjective.normalizedMeasure).toBe(0.5); // Unchanged
    });
  });

  describe("findOrCreateGlobalObjective", () => {
    it("should find existing objective", () => {
      const existingObj = new CMIObjectivesObject();
      existingObj.id = "existingId";
      manager.globalObjectives = [existingObj];

      const result = manager.findOrCreateGlobalObjective("existingId");

      expect(result.index).toBe(0);
      expect(result.objective).toBe(existingObj);
    });

    it("should create new objective when not found", () => {
      const result = manager.findOrCreateGlobalObjective("newId");

      expect(result.index).toBe(0);
      expect(result.objective.id).toBe("newId");
      expect(manager.globalObjectives).toHaveLength(1);
    });

    it("should append new objective to existing array", () => {
      const existingObj = new CMIObjectivesObject();
      existingObj.id = "existing";
      manager.globalObjectives = [existingObj];

      const result = manager.findOrCreateGlobalObjective("newId");

      expect(result.index).toBe(1);
      expect(result.objective.id).toBe("newId");
      expect(manager.globalObjectives).toHaveLength(2);
    });
  });

  describe("integration scenarios", () => {
    it("should handle complete objective lifecycle", () => {
      // Create objective
      const { objective } = manager.findOrCreateGlobalObjective("lifecycle-test");

      // Simulate updating from CMI
      objective.success_status = SuccessStatus.PASSED;
      objective.score = { scaled: "0.9" } as any;

      // Capture snapshot
      const snapshot = manager.captureGlobalObjectiveSnapshot();

      expect(snapshot["lifecycle-test"]).toBeDefined();
      expect(snapshot["lifecycle-test"].satisfiedStatus).toBe(true);
      expect(snapshot["lifecycle-test"].normalizedMeasure).toBe(0.9);
    });
  });
});
