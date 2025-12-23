import { SequencingStateMetadata, Settings } from "../types/api_types";
import { CMIObjectivesObject } from "../cmi/scorm2004/objectives";
import { ADL } from "../cmi/scorm2004/adl";
import { Sequencing } from "../cmi/scorm2004/sequencing/sequencing";
import { GlobalObjectiveManager } from "../objectives/global_objective_manager";
import { SequencingService } from "../services/SequencingService";
import { LogLevelEnum } from "../constants/enums";

/**
 * Logging function type
 */
export type ApiLogFn = (method: string, message: string, level: number) => void;

/**
 * Context interface for persistence operations
 */
export interface PersistenceContext {
  settings: Settings;
  apiLog: ApiLogFn;
  adl: ADL;
  sequencing: Sequencing;
  sequencingService: SequencingService | null;
  learnerId: string;
}

/**
 * Handles persistence of SCORM 2004 sequencing state
 *
 * This class is responsible for:
 * - Saving sequencing state to persistent storage
 * - Loading sequencing state from persistent storage
 * - Serializing sequencing state to JSON
 * - Deserializing sequencing state from JSON
 * - Compressing and decompressing state data
 */
export class SequencingStatePersistence {
  private context: PersistenceContext;
  private globalObjectiveManager: GlobalObjectiveManager;

  constructor(context: PersistenceContext, globalObjectiveManager: GlobalObjectiveManager) {
    this.context = context;
    this.globalObjectiveManager = globalObjectiveManager;
  }

  /**
   * Save current sequencing state to persistent storage
   * @param {Partial<SequencingStateMetadata>} metadata - Optional metadata override
   * @return {Promise<boolean>} Promise resolving to success status
   */
  async saveSequencingState(metadata?: Partial<SequencingStateMetadata>): Promise<boolean> {
    if (!this.context.settings.sequencingStatePersistence) {
      this.context.apiLog(
        "saveSequencingState",
        "No persistence configuration provided",
        LogLevelEnum.WARN,
      );
      return false;
    }

    try {
      const stateData = this.serializeSequencingState();
      const fullMetadata: SequencingStateMetadata = {
        learnerId: this.context.learnerId || "unknown",
        courseId: this.context.settings.courseId || "unknown",
        attemptNumber: 1,
        lastUpdated: new Date().toISOString(),
        version: this.context.settings.sequencingStatePersistence.stateVersion || "1.0",
        ...metadata,
      };

      const config = this.context.settings.sequencingStatePersistence;
      let dataToSave = stateData;

      // Compress if enabled (using simple base64 encoding for now)
      if (config.compress !== false) {
        dataToSave = this.compressStateData(stateData);
      }

      // Check size limits
      if (config.maxStateSize && dataToSave.length > config.maxStateSize) {
        throw new Error(`State size ${dataToSave.length} exceeds limit ${config.maxStateSize}`);
      }

      const success = await config.persistence.saveState(dataToSave, fullMetadata);

      if (config.debugPersistence) {
        this.context.apiLog(
          "saveSequencingState",
          `State save ${success ? "succeeded" : "failed"}: size=${dataToSave.length}`,
          success ? LogLevelEnum.INFO : LogLevelEnum.WARN,
        );
      }

      return success;
    } catch (error) {
      this.context.apiLog(
        "saveSequencingState",
        `Error saving sequencing state: ${error instanceof Error ? error.message : String(error)}`,
        LogLevelEnum.ERROR,
      );
      return false;
    }
  }

  /**
   * Load sequencing state from persistent storage
   * @param {Partial<SequencingStateMetadata>} metadata - Optional metadata override
   * @return {Promise<boolean>} Promise resolving to success status
   */
  async loadSequencingState(metadata?: Partial<SequencingStateMetadata>): Promise<boolean> {
    if (!this.context.settings.sequencingStatePersistence) {
      this.context.apiLog(
        "loadSequencingState",
        "No persistence configuration provided",
        LogLevelEnum.WARN,
      );
      return false;
    }

    try {
      const fullMetadata: SequencingStateMetadata = {
        learnerId: this.context.learnerId || "unknown",
        courseId: this.context.settings.courseId || "unknown",
        attemptNumber: 1,
        version: this.context.settings.sequencingStatePersistence.stateVersion || "1.0",
        ...metadata,
      };

      const config = this.context.settings.sequencingStatePersistence;
      const stateData = await config.persistence.loadState(fullMetadata);

      if (!stateData) {
        if (config.debugPersistence) {
          this.context.apiLog(
            "loadSequencingState",
            "No sequencing state found to load",
            LogLevelEnum.INFO,
          );
        }
        return false;
      }

      // Decompress if needed
      let dataToLoad = stateData;
      if (config.compress !== false) {
        dataToLoad = this.decompressStateData(stateData);
      }

      const success = this.deserializeSequencingState(dataToLoad);

      if (config.debugPersistence) {
        this.context.apiLog(
          "loadSequencingState",
          `State load ${success ? "succeeded" : "failed"}: size=${stateData.length}`,
          success ? LogLevelEnum.INFO : LogLevelEnum.WARN,
        );
      }

      return success;
    } catch (error) {
      this.context.apiLog(
        "loadSequencingState",
        `Error loading sequencing state: ${error instanceof Error ? error.message : String(error)}`,
        LogLevelEnum.ERROR,
      );
      return false;
    }
  }

  /**
   * Serialize current sequencing state to JSON string
   * @return {string} Serialized state
   */
  serializeSequencingState(): string {
    const state: any = {
      version: this.context.settings.sequencingStatePersistence?.stateVersion || "1.0",
      timestamp: new Date().toISOString(),
      sequencing: null,
      currentActivityId: null,
      globalObjectives: this.globalObjectiveManager.globalObjectives.map((obj) => obj.toJSON()),
      globalObjectiveMap: {},
      adlNavState: {
        request: this.context.adl.nav.request,
        request_valid: this.context.adl.nav.request_valid,
      },
      contentDelivered: false,
    };

    // Get sequencing state from overall sequencing process if available
    if (this.context.sequencingService) {
      const overallProcess = this.context.sequencingService.getOverallSequencingProcess();
      if (overallProcess) {
        // Use the getSequencingState method from overall_sequencing_process
        const sequencingState = overallProcess.getSequencingState();
        state.sequencing = sequencingState;
        state.contentDelivered = overallProcess.hasContentBeenDelivered();
        state.globalObjectiveMap =
          this.globalObjectiveManager.captureGlobalObjectiveSnapshot(overallProcess);
      }

      // Get current activity
      const currentActivity = this.context.sequencing.getCurrentActivity();
      if (currentActivity) {
        state.currentActivityId = currentActivity.id;
      }
    }

    if (!state.globalObjectiveMap || Object.keys(state.globalObjectiveMap).length === 0) {
      state.globalObjectiveMap = this.globalObjectiveManager.captureGlobalObjectiveSnapshot();
    }

    return JSON.stringify(state);
  }

  /**
   * Deserialize sequencing state from JSON string
   * @param {string} stateData - Serialized state data
   * @return {boolean} Success status
   */
  deserializeSequencingState(stateData: string): boolean {
    try {
      const state = JSON.parse(stateData);

      // Version compatibility check
      const expectedVersion =
        this.context.settings.sequencingStatePersistence?.stateVersion || "1.0";
      if (state.version !== expectedVersion) {
        this.context.apiLog(
          "deserializeSequencingState",
          `State version mismatch: ${state.version} vs expected ${expectedVersion}`,
          LogLevelEnum.WARN,
        );
      }

      // If persistence stored the global objective map separately, ensure it is available to the sequencing state
      if (state.globalObjectiveMap && state.sequencing && !state.sequencing.globalObjectiveMap) {
        state.sequencing.globalObjectiveMap = state.globalObjectiveMap;
      }

      // Restore sequencing state
      if (state.sequencing && this.context.sequencingService) {
        const overallProcess = this.context.sequencingService.getOverallSequencingProcess();
        if (overallProcess) {
          overallProcess.restoreSequencingState(state.sequencing);

          // Restore content delivered flag
          if (state.contentDelivered) {
            overallProcess.setContentDelivered(true);
          }
        }
      }

      // Restore global objectives
      const restoredObjectives = new Map<string, CMIObjectivesObject>();

      if (Array.isArray(state.globalObjectives)) {
        for (const objData of state.globalObjectives) {
          const objective = this.globalObjectiveManager.buildCMIObjectiveFromJSON(objData);
          if (objective.id) {
            restoredObjectives.set(objective.id, objective);
          }
        }
      }

      if (state.globalObjectiveMap && typeof state.globalObjectiveMap === "object") {
        const objectivesFromMap = this.globalObjectiveManager.buildCMIObjectivesFromMap(
          state.globalObjectiveMap,
        );
        for (const objective of objectivesFromMap) {
          if (!objective.id) {
            continue;
          }
          if (!restoredObjectives.has(objective.id)) {
            restoredObjectives.set(objective.id, objective);
          }
        }
      }

      if (restoredObjectives.size > 0) {
        this.globalObjectiveManager.globalObjectives = Array.from(restoredObjectives.values());
        this.globalObjectiveManager.globalObjectives.forEach((objective) => {
          if (objective.id) {
            this.globalObjectiveManager.updateGlobalObjectiveFromCMI(objective.id, objective);
          }
        });
      }

      // Restore ADL nav state
      if (state.adlNavState) {
        this.context.adl.nav.request = state.adlNavState.request || "_none_";
        this.context.adl.nav.request_valid = state.adlNavState.request_valid || {};
      }

      return true;
    } catch (error) {
      this.context.apiLog(
        "deserializeSequencingState",
        `Error deserializing sequencing state: ${error instanceof Error ? error.message : String(error)}`,
        LogLevelEnum.ERROR,
      );
      return false;
    }
  }

  /**
   * Simple compression using base64 encoding
   * @param {string} data - Data to compress
   * @return {string} Compressed data
   */
  compressStateData(data: string): string {
    // For now, just use base64 encoding
    // In a real implementation, you might use a library like lz-string
    if (typeof btoa !== "undefined") {
      return btoa(encodeURIComponent(data));
    }
    return data;
  }

  /**
   * Simple decompression from base64
   * @param {string} data - Data to decompress
   * @return {string} Decompressed data
   */
  decompressStateData(data: string): string {
    // For now, just use base64 decoding
    // In a real implementation, you might use a library like lz-string
    if (typeof atob !== "undefined") {
      try {
        return decodeURIComponent(atob(data));
      } catch {
        return data;
      }
    }
    return data;
  }
}
