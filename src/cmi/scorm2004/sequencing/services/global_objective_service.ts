import { Activity } from "../activity";
import { RollupProcess } from "../rollup_process";
import { CompletionStatus } from "../../../../constants/enums";

/**
 * GlobalObjectiveService
 *
 * Manages global objectives for the SCORM 2004 sequencing engine.
 * Extracted from OverallSequencingProcess to follow Single Responsibility Principle.
 *
 * Responsibilities:
 * - Initialize global objective map from activity tree
 * - Collect global objectives from activities
 * - Get/Set/Update global objectives
 * - Serialize/Restore global objective state for persistence
 * - Synchronize global objectives with activity states
 *
 * @spec SN Book: Global Objectives
 */
export class GlobalObjectiveService {
  private globalObjectiveMap: Map<string, any> = new Map();
  private eventCallback: ((eventType: string, data?: any) => void) | null = null;

  constructor(eventCallback?: (eventType: string, data?: any) => void) {
    this.eventCallback = eventCallback || null;
  }

  /**
   * Initialize Global Objective Map
   * Sets up the global objective map for cross-activity objective synchronization
   * @param {Activity | null} root - Root activity to initialize from
   */
  public initialize(root: Activity | null): void {
    try {
      this.globalObjectiveMap.clear();

      // Initialize global objectives from activity tree if available
      if (root) {
        this.collectObjectives(root);
      }

      this.fireEvent("onGlobalObjectiveMapInitialized", {
        objectiveCount: this.globalObjectiveMap.size,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.fireEvent("onGlobalObjectiveMapError", {
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Collect Global Objectives
   * Recursively collects global objectives from the activity tree
   * @param {Activity} activity - Activity to collect objectives from
   */
  private collectObjectives(activity: Activity): void {
    const objectives = activity.getAllObjectives();

    if (objectives.length === 0) {
      const defaultId = `${activity.id}_default_objective`;
      if (!this.globalObjectiveMap.has(defaultId)) {
        this.globalObjectiveMap.set(defaultId, {
          id: defaultId,
          satisfiedStatus: activity.objectiveSatisfiedStatus,
          satisfiedStatusKnown: activity.objectiveMeasureStatus,
          normalizedMeasure: activity.objectiveNormalizedMeasure,
          normalizedMeasureKnown: activity.objectiveMeasureStatus,
          progressMeasure: activity.progressMeasure,
          progressMeasureKnown: activity.progressMeasureStatus,
          completionStatus: activity.completionStatus,
          completionStatusKnown: activity.completionStatus !== CompletionStatus.UNKNOWN,
          readSatisfiedStatus: true,
          writeSatisfiedStatus: true,
          readNormalizedMeasure: true,
          writeNormalizedMeasure: true,
          readCompletionStatus: true,
          writeCompletionStatus: true,
          readProgressMeasure: true,
          writeProgressMeasure: true,
          satisfiedByMeasure: activity.scaledPassingScore !== null,
          minNormalizedMeasure: activity.scaledPassingScore,
          updateAttemptData: true,
        });
      }
    }

    for (const objective of objectives) {
      const mapInfos =
        objective.mapInfo.length > 0
          ? objective.mapInfo
          : [
              {
                targetObjectiveID: objective.id,
                readSatisfiedStatus: true,
                writeSatisfiedStatus: true,
                readNormalizedMeasure: true,
                writeNormalizedMeasure: true,
                readProgressMeasure: true,
                writeProgressMeasure: true,
                readCompletionStatus: true,
                writeCompletionStatus: true,
                updateAttemptData: objective.isPrimary,
              },
            ];

      for (const mapInfo of mapInfos) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        if (!this.globalObjectiveMap.has(targetId)) {
          this.globalObjectiveMap.set(targetId, {
            id: targetId,
            satisfiedStatus: objective.satisfiedStatus,
            satisfiedStatusKnown: objective.measureStatus,
            normalizedMeasure: objective.normalizedMeasure,
            normalizedMeasureKnown: objective.measureStatus,
            progressMeasure: objective.progressMeasure,
            progressMeasureKnown: objective.progressMeasureStatus,
            completionStatus: objective.completionStatus,
            completionStatusKnown:
              objective.completionStatus !== CompletionStatus.UNKNOWN,
            readSatisfiedStatus: mapInfo.readSatisfiedStatus ?? false,
            writeSatisfiedStatus: mapInfo.writeSatisfiedStatus ?? false,
            readNormalizedMeasure: mapInfo.readNormalizedMeasure ?? false,
            writeNormalizedMeasure: mapInfo.writeNormalizedMeasure ?? false,
            readProgressMeasure: mapInfo.readProgressMeasure ?? false,
            writeProgressMeasure: mapInfo.writeProgressMeasure ?? false,
            readCompletionStatus: mapInfo.readCompletionStatus ?? false,
            writeCompletionStatus: mapInfo.writeCompletionStatus ?? false,
            readRawScore: mapInfo.readRawScore ?? false,
            writeRawScore: mapInfo.writeRawScore ?? false,
            readMinScore: mapInfo.readMinScore ?? false,
            writeMinScore: mapInfo.writeMinScore ?? false,
            readMaxScore: mapInfo.readMaxScore ?? false,
            writeMaxScore: mapInfo.writeMaxScore ?? false,
            satisfiedByMeasure: objective.satisfiedByMeasure,
            minNormalizedMeasure: objective.minNormalizedMeasure,
            updateAttemptData: mapInfo.updateAttemptData ?? objective.isPrimary,
          });
        }
      }
    }

    // Process children recursively
    for (const child of activity.children) {
      this.collectObjectives(child);
    }
  }

  /**
   * Get Global Objective Map
   * Returns the current global objective map for external access
   * @return {Map<string, any>} - Current global objective map
   */
  public getMap(): Map<string, any> {
    return this.globalObjectiveMap;
  }

  /**
   * Snapshot the Global Objective Map
   * Provides a serializable copy for persistence consumers
   * @return {Record<string, any>} - Plain-object snapshot of global objectives
   */
  public getSnapshot(): Record<string, any> {
    return this.serialize();
  }

  /**
   * Restore Global Objective Map
   * Replaces the current map contents with persisted data
   * @param {Record<string, any>} snapshot - Serialized global objective map
   */
  public restoreSnapshot(snapshot: Record<string, any>): void {
    this.restore(snapshot);
  }

  /**
   * Update Global Objective
   * Updates a specific global objective with new data
   * @param {string} objectiveId - Objective ID to update
   * @param {any} objectiveData - New objective data
   */
  public updateObjective(objectiveId: string, objectiveData: any): void {
    try {
      this.globalObjectiveMap.set(objectiveId, {
        ...this.globalObjectiveMap.get(objectiveId),
        ...objectiveData,
        lastUpdated: new Date().toISOString(),
      });

      this.fireEvent("onGlobalObjectiveUpdated", {
        objectiveId,
        data: objectiveData,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      this.fireEvent("onGlobalObjectiveUpdateError", {
        objectiveId,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Synchronize global objectives from activity states
   * Called after CMI changes that affect objective status to update global objective mappings
   * This ensures that preconditions based on global objectives are properly evaluated
   * @param {Activity | null} root - Root activity to synchronize from
   * @param {RollupProcess} rollupProcess - Rollup process for mapping
   */
  public synchronize(root: Activity | null, rollupProcess: RollupProcess): void {
    if (!root) {
      return;
    }

    // Process global objective mapping from root to synchronize all activities
    rollupProcess.processGlobalObjectiveMapping(root, this.globalObjectiveMap);
  }

  /**
   * Get a specific global objective by ID
   * @param {string} objectiveId - The objective ID
   * @return {any | undefined} - The objective data or undefined
   */
  public getObjective(objectiveId: string): any | undefined {
    return this.globalObjectiveMap.get(objectiveId);
  }

  /**
   * Check if a global objective exists
   * @param {string} objectiveId - The objective ID
   * @return {boolean} - True if exists
   */
  public hasObjective(objectiveId: string): boolean {
    return this.globalObjectiveMap.has(objectiveId);
  }

  /**
   * Get all global objective IDs
   * @return {string[]} - Array of objective IDs
   */
  public getObjectiveIds(): string[] {
    return Array.from(this.globalObjectiveMap.keys());
  }

  /**
   * Get the count of global objectives
   * @return {number} - Number of global objectives
   */
  public getObjectiveCount(): number {
    return this.globalObjectiveMap.size;
  }

  /**
   * Clear all global objectives
   */
  public clear(): void {
    this.globalObjectiveMap.clear();
    this.fireEvent("onGlobalObjectiveMapCleared", {
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Serialize the global objective map
   * @return {Record<string, any>} - Serialized global objectives
   */
  private serialize(): Record<string, any> {
    const serialized: Record<string, any> = {};
    this.globalObjectiveMap.forEach((data, id) => {
      serialized[id] = { ...data };
    });
    return serialized;
  }

  /**
   * Restore the global objective map from serialized data
   * @param {Record<string, any>} mapData - Serialized global objective map
   */
  private restore(mapData: Record<string, any>): void {
    this.globalObjectiveMap.clear();
    if (!mapData) {
      return;
    }
    for (const [id, data] of Object.entries(mapData)) {
      this.globalObjectiveMap.set(id, { ...data });
    }
    this.fireEvent("onGlobalObjectiveMapRestored", {
      objectiveCount: this.globalObjectiveMap.size,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Fire a sequencing event
   * @param {string} eventType - The type of event
   * @param {any} data - Event data
   */
  private fireEvent(eventType: string, data?: any): void {
    try {
      if (this.eventCallback) {
        this.eventCallback(eventType, data);
      }
    } catch (error) {
      console.warn(`Failed to fire global objective event ${eventType}: ${error}`);
    }
  }
}
