import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  SequencingStatePersistence,
  PersistenceContext,
} from "../../src/persistence/sequencing_state_persistence";
import {
  GlobalObjectiveManager,
  GlobalObjectiveContext,
} from "../../src/objectives/global_objective_manager";
import { CMIObjectivesObject } from "../../src/cmi/scorm2004/objectives";
import { ADL } from "../../src/cmi/scorm2004/adl";
import { Sequencing } from "../../src/cmi/scorm2004/sequencing/sequencing";
import { SequencingService } from "../../src/services/SequencingService";
import { Settings, SequencingStateMetadata } from "../../src/types/api_types";
import { LogLevelEnum } from "../../src/constants/enums";

// Helper to create mock ADL
function createMockADL(): ADL {
  return {
    nav: {
      request: "_none_",
      request_valid: {},
    },
  } as unknown as ADL;
}

// Helper to create mock sequencing
function createMockSequencing(currentActivity?: { id: string }): Sequencing {
  return {
    getCurrentActivity: vi.fn().mockReturnValue(currentActivity ?? null),
  } as unknown as Sequencing;
}

// Helper to create mock overall process
function createMockOverallProcess(options?: {
  sequencingState?: any;
  contentDelivered?: boolean;
  globalObjectiveMap?: Map<string, any>;
}) {
  return {
    getSequencingState: vi.fn().mockReturnValue(options?.sequencingState ?? {}),
    hasContentBeenDelivered: vi.fn().mockReturnValue(options?.contentDelivered ?? false),
    restoreSequencingState: vi.fn(),
    setContentDelivered: vi.fn(),
    getGlobalObjectiveMap: vi.fn().mockReturnValue(options?.globalObjectiveMap ?? new Map()),
    getGlobalObjectiveMapSnapshot: vi.fn().mockReturnValue({}),
    updateGlobalObjective: vi.fn(),
  };
}

// Helper to create mock sequencing service
function createMockSequencingService(overallProcess?: ReturnType<typeof createMockOverallProcess>) {
  return {
    getOverallSequencingProcess: vi.fn().mockReturnValue(overallProcess ?? null),
  } as unknown as SequencingService;
}

// Helper to create mock settings
function createMockSettings(
  persistenceConfig?: Partial<Settings["sequencingStatePersistence"]>,
): Settings {
  return {
    sequencingStatePersistence: persistenceConfig
      ? {
          stateVersion: "1.0",
          persistence: {
            saveState: vi.fn().mockResolvedValue(true),
            loadState: vi.fn().mockResolvedValue(null),
          },
          ...persistenceConfig,
        }
      : undefined,
    courseId: "test-course",
  } as Settings;
}

// Helper to create persistence context
function createMockPersistenceContext(overrides?: Partial<PersistenceContext>): PersistenceContext {
  return {
    getSettings: vi.fn().mockReturnValue(createMockSettings()),
    apiLog: vi.fn(),
    adl: createMockADL(),
    sequencing: createMockSequencing(),
    sequencingService: null,
    learnerId: "test-learner",
    ...overrides,
  };
}

// Helper to create mock global objective manager context
function createMockGOMContext(): GlobalObjectiveContext {
  return {
    getSettings: vi.fn().mockReturnValue({ globalObjectiveIds: [] }),
    cmi: {
      objectives: {
        findObjectiveById: vi.fn().mockReturnValue(null),
        childArray: [],
      },
    } as any,
    sequencing: null,
    sequencingService: null,
    commonSetCMIValue: vi.fn().mockReturnValue("true"),
  };
}

describe("SequencingStatePersistence", () => {
  let persistence: SequencingStatePersistence;
  let mockContext: PersistenceContext;
  let mockGOM: GlobalObjectiveManager;

  beforeEach(() => {
    mockContext = createMockPersistenceContext();
    mockGOM = new GlobalObjectiveManager(createMockGOMContext());
    persistence = new SequencingStatePersistence(mockContext, mockGOM);
  });

  describe("constructor", () => {
    it("should create persistence with context and GOM", () => {
      expect(persistence).toBeDefined();
    });
  });

  describe("saveSequencingState", () => {
    it("should return false when no persistence config", async () => {
      const result = await persistence.saveSequencingState();

      expect(result).toBe(false);
      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "saveSequencingState",
        "No persistence configuration provided",
        LogLevelEnum.WARN,
      );
    });

    it("should save state successfully", async () => {
      const saveFn = vi.fn().mockResolvedValue(true);
      const settings = createMockSettings({
        persistence: {
          saveState: saveFn,
          loadState: vi.fn(),
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.saveSequencingState();

      expect(result).toBe(true);
      expect(saveFn).toHaveBeenCalled();
    });

    it("should include metadata in save", async () => {
      const saveFn = vi.fn().mockResolvedValue(true);
      const settings = createMockSettings({
        persistence: {
          saveState: saveFn,
          loadState: vi.fn(),
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      await persistence.saveSequencingState({ attemptNumber: 5 });

      expect(saveFn).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          learnerId: "test-learner",
          courseId: "test-course",
          attemptNumber: 5,
        }),
      );
    });

    it("should compress data when enabled", async () => {
      const saveFn = vi.fn().mockResolvedValue(true);
      const settings = createMockSettings({
        compress: true,
        persistence: {
          saveState: saveFn,
          loadState: vi.fn(),
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      await persistence.saveSequencingState();

      const savedData = saveFn.mock.calls[0][0];
      // Compressed data should be base64 encoded
      expect(savedData).not.toContain("{"); // Not plain JSON
    });

    it("should not compress when disabled", async () => {
      const saveFn = vi.fn().mockResolvedValue(true);
      const settings = createMockSettings({
        compress: false,
        persistence: {
          saveState: saveFn,
          loadState: vi.fn(),
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      await persistence.saveSequencingState();

      const savedData = saveFn.mock.calls[0][0];
      expect(savedData).toContain("{"); // Plain JSON
    });

    it("should fail when exceeding size limit", async () => {
      const saveFn = vi.fn().mockResolvedValue(true);
      const settings = createMockSettings({
        compress: false,
        maxStateSize: 10, // Very small limit
        persistence: {
          saveState: saveFn,
          loadState: vi.fn(),
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.saveSequencingState();

      expect(result).toBe(false);
      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "saveSequencingState",
        expect.stringContaining("exceeds limit"),
        LogLevelEnum.ERROR,
      );
    });

    it("should log when debugPersistence is enabled", async () => {
      const saveFn = vi.fn().mockResolvedValue(true);
      const settings = createMockSettings({
        debugPersistence: true,
        persistence: {
          saveState: saveFn,
          loadState: vi.fn(),
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      await persistence.saveSequencingState();

      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "saveSequencingState",
        expect.stringContaining("succeeded"),
        LogLevelEnum.INFO,
      );
    });

    it("should handle save failure", async () => {
      const saveFn = vi.fn().mockResolvedValue(false);
      const settings = createMockSettings({
        debugPersistence: true,
        persistence: {
          saveState: saveFn,
          loadState: vi.fn(),
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.saveSequencingState();

      expect(result).toBe(false);
      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "saveSequencingState",
        expect.stringContaining("failed"),
        LogLevelEnum.WARN,
      );
    });

    it("should handle save exception", async () => {
      const saveFn = vi.fn().mockRejectedValue(new Error("Save error"));
      const settings = createMockSettings({
        persistence: {
          saveState: saveFn,
          loadState: vi.fn(),
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.saveSequencingState();

      expect(result).toBe(false);
      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "saveSequencingState",
        expect.stringContaining("Save error"),
        LogLevelEnum.ERROR,
      );
    });

    it("should handle non-Error exception", async () => {
      const saveFn = vi.fn().mockRejectedValue("string error");
      const settings = createMockSettings({
        persistence: {
          saveState: saveFn,
          loadState: vi.fn(),
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.saveSequencingState();

      expect(result).toBe(false);
    });
  });

  describe("loadSequencingState", () => {
    it("should return false when no persistence config", async () => {
      const result = await persistence.loadSequencingState();

      expect(result).toBe(false);
      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "loadSequencingState",
        "No persistence configuration provided",
        LogLevelEnum.WARN,
      );
    });

    it("should return false when no state data", async () => {
      const loadFn = vi.fn().mockResolvedValue(null);
      const settings = createMockSettings({
        debugPersistence: true,
        persistence: {
          saveState: vi.fn(),
          loadState: loadFn,
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.loadSequencingState();

      expect(result).toBe(false);
      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "loadSequencingState",
        "No sequencing state found to load",
        LogLevelEnum.INFO,
      );
    });

    it("should load and decompress state", async () => {
      const stateData = JSON.stringify({ version: "1.0" });
      const compressedData = btoa(encodeURIComponent(stateData));
      const loadFn = vi.fn().mockResolvedValue(compressedData);
      const settings = createMockSettings({
        compress: true,
        persistence: {
          saveState: vi.fn(),
          loadState: loadFn,
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.loadSequencingState();

      expect(result).toBe(true);
    });

    it("should load uncompressed state", async () => {
      const stateData = JSON.stringify({ version: "1.0" });
      const loadFn = vi.fn().mockResolvedValue(stateData);
      const settings = createMockSettings({
        compress: false,
        persistence: {
          saveState: vi.fn(),
          loadState: loadFn,
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.loadSequencingState();

      expect(result).toBe(true);
    });

    it("should log when debugPersistence is enabled", async () => {
      const stateData = JSON.stringify({ version: "1.0" });
      const loadFn = vi.fn().mockResolvedValue(stateData);
      const settings = createMockSettings({
        compress: false,
        debugPersistence: true,
        persistence: {
          saveState: vi.fn(),
          loadState: loadFn,
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      await persistence.loadSequencingState();

      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "loadSequencingState",
        expect.stringContaining("succeeded"),
        LogLevelEnum.INFO,
      );
    });

    it("should handle load exception", async () => {
      const loadFn = vi.fn().mockRejectedValue(new Error("Load error"));
      const settings = createMockSettings({
        persistence: {
          saveState: vi.fn(),
          loadState: loadFn,
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.loadSequencingState();

      expect(result).toBe(false);
      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "loadSequencingState",
        expect.stringContaining("Load error"),
        LogLevelEnum.ERROR,
      );
    });

    it("should handle non-Error exception", async () => {
      const loadFn = vi.fn().mockRejectedValue("string error");
      const settings = createMockSettings({
        persistence: {
          saveState: vi.fn(),
          loadState: loadFn,
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      const result = await persistence.loadSequencingState();

      expect(result).toBe(false);
    });

    it("should use provided metadata", async () => {
      const loadFn = vi.fn().mockResolvedValue(JSON.stringify({ version: "1.0" }));
      const settings = createMockSettings({
        compress: false,
        persistence: {
          saveState: vi.fn(),
          loadState: loadFn,
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      await persistence.loadSequencingState({ attemptNumber: 3 });

      expect(loadFn).toHaveBeenCalledWith(
        expect.objectContaining({
          attemptNumber: 3,
        }),
      );
    });
  });

  describe("serializeSequencingState", () => {
    it("should serialize basic state", () => {
      const result = persistence.serializeSequencingState();
      const parsed = JSON.parse(result);

      expect(parsed.version).toBe("1.0");
      expect(parsed.timestamp).toBeDefined();
      expect(parsed.globalObjectives).toEqual([]);
      expect(parsed.adlNavState).toEqual({
        request: "_none_",
        request_valid: {},
      });
    });

    it("should include global objectives", () => {
      const objective = new CMIObjectivesObject();
      objective.id = "obj1";
      mockGOM.globalObjectives = [objective];

      const result = persistence.serializeSequencingState();
      const parsed = JSON.parse(result);

      expect(parsed.globalObjectives).toHaveLength(1);
    });

    it("should include sequencing state from service", () => {
      const mockOverallProcess = createMockOverallProcess({
        sequencingState: { currentActivityId: "act1" },
        contentDelivered: true,
      });
      const mockService = createMockSequencingService(mockOverallProcess);
      mockContext.sequencingService = mockService;
      mockContext.sequencing = createMockSequencing({ id: "current-activity" });

      const result = persistence.serializeSequencingState();
      const parsed = JSON.parse(result);

      expect(parsed.sequencing).toEqual({ currentActivityId: "act1" });
      expect(parsed.contentDelivered).toBe(true);
      expect(parsed.currentActivityId).toBe("current-activity");
    });

    it("should capture global objective map from process", () => {
      const globalObjectiveMap = new Map();
      globalObjectiveMap.set("global1", { id: "global1" });
      const mockOverallProcess = createMockOverallProcess({
        globalObjectiveMap,
      });
      (
        mockOverallProcess.getGlobalObjectiveMapSnapshot as ReturnType<typeof vi.fn>
      ).mockReturnValue({
        global1: { id: "global1", satisfiedStatus: true },
      });
      const mockService = createMockSequencingService(mockOverallProcess);
      mockContext.sequencingService = mockService;

      const result = persistence.serializeSequencingState();
      const parsed = JSON.parse(result);

      expect(parsed.globalObjectiveMap).toBeDefined();
    });

    it("should fallback to GOM snapshot when no process", () => {
      const objective = new CMIObjectivesObject();
      objective.id = "fallback";
      mockGOM.globalObjectives = [objective];

      const result = persistence.serializeSequencingState();
      const parsed = JSON.parse(result);

      expect(parsed.globalObjectiveMap).toBeDefined();
    });
  });

  describe("deserializeSequencingState", () => {
    it("should deserialize basic state", () => {
      const stateData = JSON.stringify({ version: "1.0" });

      const result = persistence.deserializeSequencingState(stateData);

      expect(result).toBe(true);
    });

    it("should warn on version mismatch", () => {
      const stateData = JSON.stringify({ version: "2.0" });
      const settings = createMockSettings({
        stateVersion: "1.0",
        persistence: { saveState: vi.fn(), loadState: vi.fn() },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      persistence.deserializeSequencingState(stateData);

      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "deserializeSequencingState",
        expect.stringContaining("version mismatch"),
        LogLevelEnum.WARN,
      );
    });

    it("should restore sequencing state to service", () => {
      const mockOverallProcess = createMockOverallProcess();
      const mockService = createMockSequencingService(mockOverallProcess);
      mockContext.sequencingService = mockService;

      const stateData = JSON.stringify({
        version: "1.0",
        sequencing: { currentActivityId: "act1" },
        contentDelivered: true,
      });

      persistence.deserializeSequencingState(stateData);

      expect(mockOverallProcess.restoreSequencingState).toHaveBeenCalledWith({
        currentActivityId: "act1",
      });
      expect(mockOverallProcess.setContentDelivered).toHaveBeenCalledWith(true);
    });

    it("should not call setContentDelivered if false", () => {
      const mockOverallProcess = createMockOverallProcess();
      const mockService = createMockSequencingService(mockOverallProcess);
      mockContext.sequencingService = mockService;

      const stateData = JSON.stringify({
        version: "1.0",
        sequencing: {},
        contentDelivered: false,
      });

      persistence.deserializeSequencingState(stateData);

      expect(mockOverallProcess.setContentDelivered).not.toHaveBeenCalled();
    });

    it("should restore global objectives from array", () => {
      const stateData = JSON.stringify({
        version: "1.0",
        globalObjectives: [{ id: "obj1", success_status: "passed" }],
      });

      persistence.deserializeSequencingState(stateData);

      expect(mockGOM.globalObjectives).toHaveLength(1);
      expect(mockGOM.globalObjectives[0].id).toBe("obj1");
    });

    it("should skip objectives without id from array", () => {
      const stateData = JSON.stringify({
        version: "1.0",
        globalObjectives: [{ success_status: "passed" }], // No id
      });

      persistence.deserializeSequencingState(stateData);

      expect(mockGOM.globalObjectives).toHaveLength(0);
    });

    it("should restore global objectives from map", () => {
      const stateData = JSON.stringify({
        version: "1.0",
        globalObjectiveMap: {
          obj1: { id: "obj1", satisfiedStatusKnown: true, satisfiedStatus: true },
        },
      });

      persistence.deserializeSequencingState(stateData);

      expect(mockGOM.globalObjectives).toHaveLength(1);
    });

    it("should skip objectives without id from map", () => {
      const stateData = JSON.stringify({
        version: "1.0",
        globalObjectiveMap: {
          obj1: { satisfiedStatusKnown: true },
        },
      });

      persistence.deserializeSequencingState(stateData);

      // Should create objective with key as id
      expect(mockGOM.globalObjectives).toHaveLength(1);
      expect(mockGOM.globalObjectives[0].id).toBe("obj1");
    });

    it("should not duplicate objectives from array and map", () => {
      const stateData = JSON.stringify({
        version: "1.0",
        globalObjectives: [{ id: "shared" }],
        globalObjectiveMap: {
          shared: { id: "shared", satisfiedStatusKnown: true },
        },
      });

      persistence.deserializeSequencingState(stateData);

      expect(mockGOM.globalObjectives).toHaveLength(1);
    });

    it("should restore ADL nav state", () => {
      const stateData = JSON.stringify({
        version: "1.0",
        adlNavState: {
          request: "continue",
          request_valid: { continue: true },
        },
      });

      persistence.deserializeSequencingState(stateData);

      expect(mockContext.adl.nav.request).toBe("continue");
      expect(mockContext.adl.nav.request_valid).toEqual({ continue: true });
    });

    it("should use defaults for missing ADL nav values", () => {
      const stateData = JSON.stringify({
        version: "1.0",
        adlNavState: {},
      });

      persistence.deserializeSequencingState(stateData);

      expect(mockContext.adl.nav.request).toBe("_none_");
      expect(mockContext.adl.nav.request_valid).toEqual({});
    });

    it("should handle parse error", () => {
      const result = persistence.deserializeSequencingState("invalid json");

      expect(result).toBe(false);
      expect(mockContext.apiLog).toHaveBeenCalledWith(
        "deserializeSequencingState",
        expect.stringContaining("Error"),
        LogLevelEnum.ERROR,
      );
    });

    it("should copy globalObjectiveMap to sequencing state when missing", () => {
      const mockOverallProcess = createMockOverallProcess();
      const mockService = createMockSequencingService(mockOverallProcess);
      mockContext.sequencingService = mockService;

      const stateData = JSON.stringify({
        version: "1.0",
        globalObjectiveMap: { obj1: { id: "obj1" } },
        sequencing: { currentActivityId: "act1" },
      });

      persistence.deserializeSequencingState(stateData);

      // Should have copied globalObjectiveMap to sequencing state
      expect(mockOverallProcess.restoreSequencingState).toHaveBeenCalledWith(
        expect.objectContaining({
          globalObjectiveMap: { obj1: { id: "obj1" } },
        }),
      );
    });
  });

  describe("compressStateData", () => {
    it("should compress data using base64", () => {
      const data = '{"test": "value"}';

      const result = persistence.compressStateData(data);

      expect(result).toBe(btoa(encodeURIComponent(data)));
    });
  });

  describe("decompressStateData", () => {
    it("should decompress base64 data", () => {
      const original = '{"test": "value"}';
      const compressed = btoa(encodeURIComponent(original));

      const result = persistence.decompressStateData(compressed);

      expect(result).toBe(original);
    });

    it("should return original data if decompression fails", () => {
      const invalidBase64 = "not-valid-base64!!!";

      const result = persistence.decompressStateData(invalidBase64);

      expect(result).toBe(invalidBase64);
    });
  });

  describe("integration scenarios", () => {
    it("should round-trip state through save and load", async () => {
      let savedData: string | null = null;

      const saveFn = vi.fn().mockImplementation((data) => {
        savedData = data;
        return Promise.resolve(true);
      });
      const loadFn = vi.fn().mockImplementation(() => Promise.resolve(savedData));

      const settings = createMockSettings({
        compress: false,
        persistence: {
          saveState: saveFn,
          loadState: loadFn,
        },
      });
      mockContext.getSettings = vi.fn().mockReturnValue(settings);

      // Add some global objectives
      const objective = new CMIObjectivesObject();
      objective.id = "round-trip-obj";
      objective.success_status = "passed";
      mockGOM.globalObjectives = [objective];

      // Save state
      const saveResult = await persistence.saveSequencingState();
      expect(saveResult).toBe(true);

      // Clear objectives
      mockGOM.globalObjectives = [];

      // Load state
      const loadResult = await persistence.loadSequencingState();
      expect(loadResult).toBe(true);

      // Verify objectives restored
      expect(mockGOM.globalObjectives).toHaveLength(1);
      expect(mockGOM.globalObjectives[0].id).toBe("round-trip-obj");
    });

    it("should handle complete state with all components", () => {
      const mockOverallProcess = createMockOverallProcess({
        sequencingState: {
          currentActivityId: "act1",
          suspendedActivityId: "act2",
        },
        contentDelivered: true,
      });
      const mockService = createMockSequencingService(mockOverallProcess);
      mockContext.sequencingService = mockService;
      mockContext.sequencing = createMockSequencing({ id: "current-act" });
      mockContext.adl.nav.request = "continue";
      mockContext.adl.nav.request_valid = { continue: true, previous: false };

      const objective = new CMIObjectivesObject();
      objective.id = "global-obj";
      mockGOM.globalObjectives = [objective];

      // Serialize
      const serialized = persistence.serializeSequencingState();
      const parsed = JSON.parse(serialized);

      expect(parsed.sequencing).toEqual({
        currentActivityId: "act1",
        suspendedActivityId: "act2",
      });
      expect(parsed.contentDelivered).toBe(true);
      expect(parsed.currentActivityId).toBe("current-act");
      expect(parsed.globalObjectives).toHaveLength(1);
      expect(parsed.adlNavState.request).toBe("continue");
    });
  });
});
