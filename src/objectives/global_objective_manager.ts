import { CMIObjectivesObject } from "../cmi/scorm2004/objectives";
import { CMI } from "../cmi/scorm2004/cmi";
import { OverallSequencingProcess } from "../cmi/scorm2004/sequencing/overall_sequencing_process";
import { GlobalObjectiveMapEntry, ScoreObject, Settings } from "../types/api_types";
import { SequencingService } from "../services/SequencingService";
import { CompletionStatus, SuccessStatus } from "../constants/enums";
import { Sequencing } from "../cmi/scorm2004/sequencing/sequencing";

/**
 * Common set CMI value function type
 */
export type CommonSetCMIValueFn = (
  methodName: string,
  throwError: boolean,
  CMIElement: string,
  value: any,
) => string;

/**
 * Context interface for global objective operations
 */
export interface GlobalObjectiveContext {
  getSettings: () => Settings;
  cmi: CMI;
  sequencing: Sequencing | null;
  sequencingService: SequencingService | null;
  commonSetCMIValue: CommonSetCMIValueFn;
}

/**
 * Manages global objectives for SCORM 2004
 *
 * This class is responsible for:
 * - Managing the global objectives array that persists across SCO transitions
 * - Restoring global objectives to CMI after initialization
 * - Syncing global objective IDs from sequencing service
 * - Updating global objectives from CMI data
 * - Building objective map entries
 * - Capturing global objective snapshots
 */
export class GlobalObjectiveManager {
  private _globalObjectives: CMIObjectivesObject[] = [];
  private context: GlobalObjectiveContext;

  constructor(context: GlobalObjectiveContext) {
    this.context = context;
  }

  /**
   * Get global objectives array
   *
   * Global objectives persist across SCO transitions and are used for cross-activity
   * objective tracking via mapInfo (SCORM 2004 SN Book SB.2.4).
   *
   * @return {CMIObjectivesObject[]} Array of global objective objects
   */
  get globalObjectives(): CMIObjectivesObject[] {
    return this._globalObjectives;
  }

  /**
   * Set global objectives array (for deserialization)
   * @param {CMIObjectivesObject[]} objectives - Array of objectives to set
   */
  set globalObjectives(objectives: CMIObjectivesObject[]) {
    this._globalObjectives = objectives;
  }

  /**
   * Update the sequencing service reference
   * @param {SequencingService | null} service - The sequencing service instance
   */
  updateSequencingService(service: SequencingService | null): void {
    this.context.sequencingService = service;
  }

  /**
   * Syncs global objective IDs from the sequencing service's globalObjectiveMap
   * to settings.globalObjectiveIds. This ensures that objectives referenced via
   * mapInfo in the activity tree are recognized as global objectives when
   * setCMIValue is called.
   *
   * Per SCORM 2004 SN Book SB.2.4, global objectives must persist across SCO
   * transitions and be available for cross-activity objective tracking.
   */
  syncGlobalObjectiveIdsFromSequencing(): void {
    if (!this.context.sequencingService) {
      return;
    }

    const overallProcess = this.context.sequencingService.getOverallSequencingProcess();
    if (!overallProcess) {
      return;
    }

    const globalObjectiveMap = overallProcess.getGlobalObjectiveMap();
    if (!globalObjectiveMap || globalObjectiveMap.size === 0) {
      return;
    }

    // Extract global objective IDs from the map
    const globalIds = Array.from(globalObjectiveMap.keys());

    // Merge with any existing globalObjectiveIds from settings
    const settings = this.context.getSettings();
    const existingIds = settings.globalObjectiveIds || [];
    const mergedIds = Array.from(new Set(existingIds.concat(globalIds)));

    // Update settings with the merged list
    settings.globalObjectiveIds = mergedIds;
  }

  /**
   * Restores global objectives from _globalObjectives to cmi.objectives
   * This is called after Initialize to ensure global objectives are accessible
   * to the content via cmi.objectives.n.id, cmi.objectives.n.success_status, etc.
   *
   * Per SCORM 2004 SN Book SB.2.4, global objectives must persist across SCO
   * transitions and be accessible to content via the CMI data model.
   */
  restoreGlobalObjectivesToCMI(): void {
    if (this._globalObjectives.length === 0) {
      return;
    }

    // Restore each global objective to cmi.objectives
    for (let i = 0; i < this._globalObjectives.length; i++) {
      const globalObj = this._globalObjectives[i];
      if (!globalObj || !globalObj.id) {
        continue;
      }

      // Check if this objective already exists in cmi.objectives
      const existingObjective = this.context.cmi.objectives.findObjectiveById(globalObj.id);
      if (existingObjective) {
        // Objective already exists, skip to avoid duplicates
        continue;
      }

      // Add the global objective to cmi.objectives
      const index = this.context.cmi.objectives.childArray.length;

      // Set the objective ID first (this creates the objective in the array)
      this.context.commonSetCMIValue(
        "RestoreGlobalObjective",
        true,
        `cmi.objectives.${index}.id`,
        globalObj.id,
      );

      // Restore other properties if they have values
      if (globalObj.success_status && globalObj.success_status !== "unknown") {
        this.context.commonSetCMIValue(
          "RestoreGlobalObjective",
          true,
          `cmi.objectives.${index}.success_status`,
          globalObj.success_status,
        );
      }

      if (globalObj.completion_status && globalObj.completion_status !== "unknown") {
        this.context.commonSetCMIValue(
          "RestoreGlobalObjective",
          true,
          `cmi.objectives.${index}.completion_status`,
          globalObj.completion_status,
        );
      }

      if (globalObj.score.scaled !== "" && globalObj.score.scaled !== null) {
        this.context.commonSetCMIValue(
          "RestoreGlobalObjective",
          true,
          `cmi.objectives.${index}.score.scaled`,
          globalObj.score.scaled,
        );
      }

      if (globalObj.score.raw !== "" && globalObj.score.raw !== null) {
        this.context.commonSetCMIValue(
          "RestoreGlobalObjective",
          true,
          `cmi.objectives.${index}.score.raw`,
          globalObj.score.raw,
        );
      }

      if (globalObj.score.min !== "" && globalObj.score.min !== null) {
        this.context.commonSetCMIValue(
          "RestoreGlobalObjective",
          true,
          `cmi.objectives.${index}.score.min`,
          globalObj.score.min,
        );
      }

      if (globalObj.score.max !== "" && globalObj.score.max !== null) {
        this.context.commonSetCMIValue(
          "RestoreGlobalObjective",
          true,
          `cmi.objectives.${index}.score.max`,
          globalObj.score.max,
        );
      }

      if (globalObj.progress_measure !== "" && globalObj.progress_measure !== null) {
        this.context.commonSetCMIValue(
          "RestoreGlobalObjective",
          true,
          `cmi.objectives.${index}.progress_measure`,
          globalObj.progress_measure,
        );
      }

      if (globalObj.description !== "") {
        this.context.commonSetCMIValue(
          "RestoreGlobalObjective",
          true,
          `cmi.objectives.${index}.description`,
          globalObj.description,
        );
      }
    }
  }

  /**
   * Updates the global objective map in the sequencing service from CMI objective data.
   *
   * This method synchronizes global objectives between:
   * - _globalObjectives array (persists across SCO transitions)
   * - Sequencing service global objective map (used for sequencing decisions)
   *
   * When a SCO writes to a global objective via SetValue, this method ensures
   * the sequencing service is updated so that sequencing rules can evaluate
   * the objective status correctly.
   *
   * According to SCORM 2004 SN Book SB.2.4, global objectives must be synchronized
   * across all activities that reference them via mapInfo.
   *
   * @param {string} objectiveId - The global objective ID
   * @param {CMIObjectivesObject} objective - The CMI objective object with updated values
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - global objectives synchronize CMI objective data
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw/min/max score fields synchronize independently
   */
  updateGlobalObjectiveFromCMI(objectiveId: string, objective: CMIObjectivesObject): void {
    if (!objectiveId || !this.context.sequencingService) {
      return;
    }

    const overallProcess = this.context.sequencingService.getOverallSequencingProcess();
    if (!overallProcess) {
      return;
    }

    const map = overallProcess.getGlobalObjectiveMap();
    if (!map.has(objectiveId)) {
      const fallbackEntry = this.buildObjectiveMapEntryFromCMI(objective);
      overallProcess.updateGlobalObjective(objectiveId, fallbackEntry);
      return;
    }

    const updatePayload: Record<string, any> = {};

    if (objective.success_status && objective.success_status !== SuccessStatus.UNKNOWN) {
      updatePayload.satisfiedStatus = objective.success_status === SuccessStatus.PASSED;
      updatePayload.satisfiedStatusKnown = true;
    }

    const normalizedMeasure = this.parseObjectiveNumber(objective.score?.scaled);
    if (normalizedMeasure !== null) {
      updatePayload.normalizedMeasure = normalizedMeasure;
      updatePayload.normalizedMeasureKnown = true;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw score
    // updates independently of scaled, min, and max score fields.
    if (objective.score?.raw !== undefined && objective.score.raw !== "") {
      updatePayload.rawScore = objective.score.raw;
      updatePayload.rawScoreKnown = true;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - min score
    // updates independently of raw, scaled, and max score fields.
    if (objective.score?.min !== undefined && objective.score.min !== "") {
      updatePayload.minScore = objective.score.min;
      updatePayload.minScoreKnown = true;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - max score
    // updates independently of raw, scaled, and min score fields.
    if (objective.score?.max !== undefined && objective.score.max !== "") {
      updatePayload.maxScore = objective.score.max;
      updatePayload.maxScoreKnown = true;
    }

    const progressMeasure = this.parseObjectiveNumber(objective.progress_measure);
    if (progressMeasure !== null) {
      updatePayload.progressMeasure = progressMeasure;
      updatePayload.progressMeasureKnown = true;
    }

    if (objective.completion_status && objective.completion_status !== CompletionStatus.UNKNOWN) {
      updatePayload.completionStatus = objective.completion_status;
      updatePayload.completionStatusKnown = true;
    }

    if (Object.keys(updatePayload).length === 0) {
      return;
    }

    overallProcess.updateGlobalObjective(objectiveId, updatePayload);
  }

  /**
   * Builds a map entry from the given CMI objectives object to a standardized GlobalObjectiveMapEntry.
   *
   * @param {CMIObjectivesObject} objective - The CMI objectives object containing data about a specific learning objective.
   * @return {GlobalObjectiveMapEntry} An object containing mapped properties and their values based on the provided objective.
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - global objective map entries capture objective state
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw/min/max score entries carry per-field known flags
   */
  buildObjectiveMapEntryFromCMI(objective: CMIObjectivesObject): GlobalObjectiveMapEntry {
    const entry: GlobalObjectiveMapEntry = {
      id: objective.id,
      satisfiedStatusKnown: false,
      normalizedMeasureKnown: false,
      rawScore: "",
      rawScoreKnown: false,
      minScore: "",
      minScoreKnown: false,
      maxScore: "",
      maxScoreKnown: false,
      progressMeasureKnown: false,
      completionStatusKnown: false,
      readSatisfiedStatus: true,
      writeSatisfiedStatus: true,
      readNormalizedMeasure: true,
      writeNormalizedMeasure: true,
      readCompletionStatus: true,
      writeCompletionStatus: true,
      readProgressMeasure: true,
      writeProgressMeasure: true,
      readRawScore: true,
      writeRawScore: true,
      readMinScore: true,
      writeMinScore: true,
      readMaxScore: true,
      writeMaxScore: true,
    };

    if (objective.success_status && objective.success_status !== SuccessStatus.UNKNOWN) {
      entry.satisfiedStatus = objective.success_status === SuccessStatus.PASSED;
      entry.satisfiedStatusKnown = true;
    }

    const normalizedMeasure = this.parseObjectiveNumber(objective.score?.scaled);
    if (normalizedMeasure !== null) {
      entry.normalizedMeasure = normalizedMeasure;
      entry.normalizedMeasureKnown = true;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw score
    // snapshot state carries its own known flag.
    if (objective.score?.raw !== undefined && objective.score.raw !== "") {
      entry.rawScore = objective.score.raw;
      entry.rawScoreKnown = true;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - min score
    // snapshot state carries its own known flag.
    if (objective.score?.min !== undefined && objective.score.min !== "") {
      entry.minScore = objective.score.min;
      entry.minScoreKnown = true;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - max score
    // snapshot state carries its own known flag.
    if (objective.score?.max !== undefined && objective.score.max !== "") {
      entry.maxScore = objective.score.max;
      entry.maxScoreKnown = true;
    }

    const progressMeasure = this.parseObjectiveNumber(objective.progress_measure);
    if (progressMeasure !== null) {
      entry.progressMeasure = progressMeasure;
      entry.progressMeasureKnown = true;
    }

    if (objective.completion_status && objective.completion_status !== CompletionStatus.UNKNOWN) {
      entry.completionStatus = objective.completion_status;
      entry.completionStatusKnown = true;
    }

    return entry;
  }

  /**
   * Constructs an array of `CMIObjectivesObject` instances from a given snapshot map.
   *
   * @param {Record<string, GlobalObjectiveMapEntry>} snapshot - A map where each entry represents objective data
   *                                         with various properties that may include
   *                                         satisfied status, progress measure, completion status, etc.
   * @return {CMIObjectivesObject[]} An array of `CMIObjectivesObject` instances built
   *                                  from the provided snapshot map. Returns an empty array
   *                                  if the snapshot is invalid or no valid objectives can be created.
   *
   * @spec SCORM 2004 4th Ed. SN 3.10.3 - global objective snapshots restore CMI objective state
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw/min/max score known fields restore independently
   */
  buildCMIObjectivesFromMap(
    snapshot: Record<string, GlobalObjectiveMapEntry>,
  ): CMIObjectivesObject[] {
    const objectives: CMIObjectivesObject[] = [];
    if (!snapshot || typeof snapshot !== "object") {
      return objectives;
    }

    for (const [objectiveId, entry] of Object.entries(snapshot)) {
      if (!entry || typeof entry !== "object") {
        continue;
      }
      const objective = new CMIObjectivesObject();
      objective.id = entry.id ?? objectiveId;

      if (entry.satisfiedStatusKnown === true) {
        objective.success_status = entry.satisfiedStatus
          ? SuccessStatus.PASSED
          : SuccessStatus.FAILED;
      }

      const normalizedMeasure = this.parseObjectiveNumber(entry.normalizedMeasure);
      if (entry.normalizedMeasureKnown === true && normalizedMeasure !== null) {
        objective.score.scaled = String(normalizedMeasure);
      }

      // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw score
      // restores only when its known flag is true.
      if (entry.rawScoreKnown === true) {
        objective.score.raw = String(entry.rawScore ?? "");
      }

      // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - min score
      // restores only when its known flag is true.
      if (entry.minScoreKnown === true) {
        objective.score.min = String(entry.minScore ?? "");
      }

      // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - max score
      // restores only when its known flag is true.
      if (entry.maxScoreKnown === true) {
        objective.score.max = String(entry.maxScore ?? "");
      }

      const progressMeasure = this.parseObjectiveNumber(entry.progressMeasure);
      if (entry.progressMeasureKnown === true && progressMeasure !== null) {
        objective.progress_measure = String(progressMeasure);
      }

      if (entry.completionStatusKnown === true && typeof entry.completionStatus === "string") {
        objective.completion_status = entry.completionStatus;
      }

      objectives.push(objective);
    }

    return objectives;
  }

  /**
   * Constructs a `CMIObjectivesObject` instance from the provided JSON data.
   *
   * @param {any} data - The JSON data used to populate the `CMIObjectivesObject`. If the input is invalid or missing, an empty `CMIObjectivesObject` instance is returned.
   * @return {CMIObjectivesObject} A populated `CMIObjectivesObject` instance based on the input data. Returns a default object if the input does not contain valid fields.
   */
  buildCMIObjectiveFromJSON(data: any): CMIObjectivesObject {
    const objective = new CMIObjectivesObject();
    if (!data || typeof data !== "object") {
      return objective;
    }

    if (typeof data.id === "string") {
      objective.id = data.id;
    }

    if (typeof data.success_status === "string") {
      objective.success_status = data.success_status;
    }

    if (typeof data.completion_status === "string") {
      objective.completion_status = data.completion_status;
    }

    if (typeof data.progress_measure === "string" && data.progress_measure !== "") {
      objective.progress_measure = data.progress_measure;
    }

    if (typeof data.description === "string") {
      objective.description = data.description;
    }

    const score = data.score;
    if (score && typeof score === "object") {
      if (typeof score.scaled === "string" && score.scaled !== "") {
        objective.score.scaled = score.scaled;
      } else if (typeof score.scaled === "number" && Number.isFinite(score.scaled)) {
        objective.score.scaled = String(score.scaled);
      }

      if (typeof score.raw === "string" && score.raw !== "") {
        objective.score.raw = score.raw;
      } else if (typeof score.raw === "number" && Number.isFinite(score.raw)) {
        objective.score.raw = String(score.raw);
      }

      if (typeof score.min === "string" && score.min !== "") {
        objective.score.min = score.min;
      } else if (typeof score.min === "number" && Number.isFinite(score.min)) {
        objective.score.min = String(score.min);
      }

      if (typeof score.max === "string" && score.max !== "") {
        objective.score.max = score.max;
      } else if (typeof score.max === "number" && Number.isFinite(score.max)) {
        objective.score.max = String(score.max);
      }
    }

    return objective;
  }

  /**
   * Captures the global objective snapshot by collecting data from the provided overall process
   * or the internally managed sequencing service if no process is provided.
   *
   * @param {OverallSequencingProcess | null} [overallProcess] - An optional parameter representing the overall sequencing process. If not provided, it attempts to use the internal sequencing service.
   * @return {Record<string, GlobalObjectiveMapEntry>} A record containing the snapshot of the global objectives, with each objective's identifier as the key and its corresponding data as the value.
   */
  captureGlobalObjectiveSnapshot(
    overallProcess?: OverallSequencingProcess | null,
  ): Record<string, GlobalObjectiveMapEntry> {
    const snapshot: Record<string, GlobalObjectiveMapEntry> = {};

    const process =
      overallProcess ?? this.context.sequencingService?.getOverallSequencingProcess() ?? null;
    if (process) {
      const processSnapshot = process.getGlobalObjectiveMapSnapshot();
      for (const [id, data] of Object.entries(processSnapshot)) {
        snapshot[id] = { ...data };
      }
    }

    for (const objective of this._globalObjectives) {
      if (!objective.id || snapshot[objective.id]) {
        continue;
      }
      snapshot[objective.id] = this.buildObjectiveMapEntryFromCMI(objective);
    }

    return snapshot;
  }

  /**
   * Parses the given value into a finite number if possible, otherwise returns null.
   *
   * @param {any} value - The input value to be parsed into a number.
   * @return {number | null} The parsed finite number if the input is valid, otherwise null.
   */
  parseObjectiveNumber(value: any): number | null {
    if (value === null || value === undefined) {
      return null;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    const parsed = parseFloat(String(value));
    return Number.isFinite(parsed) ? parsed : null;
  }

  /**
   * Synchronize CMI runtime data to the current sequencing activity
   * When cmi.success_status or cmi.completion_status are set, update the
   * current activity's primary objective accordingly
   *
   * @param {CompletionStatus} completionStatus
   * @param {SuccessStatus} successStatus
   * @param {ScoreObject} scoreObject
   *
   * @spec SCORM 2004 4th Ed. RTE-to-SN Data Transfer - CMI score data updates the current primary objective
   * @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw/min/max score data is available for write maps
   */
  syncCmiToSequencingActivity(
    completionStatus: CompletionStatus,
    successStatus: SuccessStatus,
    scoreObject?: ScoreObject,
  ): void {
    if (!this.context.sequencing) {
      return;
    }

    const currentActivity = this.context.sequencing.getCurrentActivity();
    if (!currentActivity || !currentActivity.primaryObjective) {
      return;
    }

    const primaryObjective = currentActivity.primaryObjective;

    // Update primary objective satisfied status based on cmi.success_status
    if (successStatus !== SuccessStatus.UNKNOWN) {
      primaryObjective.satisfiedStatus = successStatus === SuccessStatus.PASSED;
      primaryObjective.satisfiedStatusKnown = true;
      primaryObjective.measureStatus = true;
      currentActivity.objectiveMeasureStatus = true;
      currentActivity.objectiveSatisfiedStatus = successStatus === SuccessStatus.PASSED;
      currentActivity.objectiveSatisfiedStatusKnown = true;
    }

    // Update primary objective completion status based on cmi.completion_status
    if (completionStatus !== CompletionStatus.UNKNOWN) {
      primaryObjective.completionStatus = completionStatus;
    }

    // Update normalized measure if score is provided
    if (scoreObject?.scaled !== undefined && scoreObject.scaled !== null) {
      primaryObjective.normalizedMeasure = scoreObject.scaled;
      primaryObjective.measureStatus = true;
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - raw score is
    // available to raw-score write maps independently of scaled score.
    if (scoreObject?.raw !== undefined && scoreObject.raw !== null) {
      primaryObjective.rawScore = String(scoreObject.raw);
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - min score is
    // available to min-score write maps independently of scaled score.
    if (scoreObject?.min !== undefined && scoreObject.min !== null) {
      primaryObjective.minScore = String(scoreObject.min);
    }

    // @spec SCORM 2004 4th Ed. ADLSEQ objectives extension - max score is
    // available to max-score write maps independently of scaled score.
    if (scoreObject?.max !== undefined && scoreObject.max !== null) {
      primaryObjective.maxScore = String(scoreObject.max);
    }
  }

  /**
   * Find or create a global objective by ID
   * @param {string} objectiveId - The objective ID
   * @return {{ index: number; objective: CMIObjectivesObject }} The index and objective
   */
  findOrCreateGlobalObjective(objectiveId: string): {
    index: number;
    objective: CMIObjectivesObject;
  } {
    let index = this._globalObjectives.findIndex((obj) => obj.id === objectiveId);

    if (index === -1) {
      index = this._globalObjectives.length;
      const newGlobalObjective = new CMIObjectivesObject();
      newGlobalObjective.id = objectiveId;
      this._globalObjectives.push(newGlobalObjective);
    }

    return { index, objective: this._globalObjectives[index]! };
  }
}
