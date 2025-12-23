import {
  Activity,
  ActivityObjective,
  ObjectiveMapInfo,
} from "../cmi/scorm2004/sequencing/activity";
import {
  ActivitySettings,
  ObjectiveSettings,
  SelectionRandomizationStateSettings,
  SequencingCollectionSettings,
} from "../types/sequencing_types";
import { SequencingConfigurationBuilder } from "./sequencing_configuration_builder";

/**
 * Builds and configures SCORM 2004 activity trees from settings
 *
 * This class is responsible for:
 * - Creating activities from settings
 * - Extracting activity IDs from the tree
 * - Creating activity objectives from settings
 * - Managing selection randomization state
 */
export class ActivityTreeBuilder {
  private sequencingCollections: Record<string, SequencingCollectionSettings>;
  private sequencingConfigBuilder: SequencingConfigurationBuilder;

  constructor(
    collections?: Record<string, SequencingCollectionSettings>,
    sequencingConfigBuilder?: SequencingConfigurationBuilder,
  ) {
    this.sequencingCollections = collections || {};
    this.sequencingConfigBuilder = sequencingConfigBuilder || new SequencingConfigurationBuilder();
  }

  /**
   * Updates the sequencing collections
   * @param {Record<string, SequencingCollectionSettings>} collections - The new collections
   */
  setSequencingCollections(collections: Record<string, SequencingCollectionSettings>): void {
    this.sequencingCollections = collections;
  }

  /**
   * Create an activity from settings
   * @param {ActivitySettings} activitySettings - The activity settings
   * @return {Activity} - The created activity
   */
  createActivity(activitySettings: ActivitySettings): Activity {
    // Create activity
    const activity = new Activity(activitySettings.id, activitySettings.title);

    const selectionStates: SelectionRandomizationStateSettings[] = [];
    const collectionRefs = this.sequencingConfigBuilder.normalizeCollectionRefs(
      activitySettings.sequencingCollectionRefs,
    );

    for (const ref of collectionRefs) {
      const collection = this.sequencingCollections[ref];
      if (collection) {
        this.sequencingConfigBuilder.applySequencingCollection(
          activity,
          collection,
          selectionStates,
        );
      }
    }

    // Set activity properties
    if (activitySettings.isVisible !== undefined) {
      activity.isVisible = activitySettings.isVisible;
    }
    if (activitySettings.isActive !== undefined) {
      activity.isActive = activitySettings.isActive;
    }
    if (activitySettings.isSuspended !== undefined) {
      activity.isSuspended = activitySettings.isSuspended;
    }
    if (activitySettings.isCompleted !== undefined) {
      activity.isCompleted = activitySettings.isCompleted;
    }
    if (activitySettings.isHiddenFromChoice !== undefined) {
      activity.isHiddenFromChoice = activitySettings.isHiddenFromChoice;
    }
    if (activitySettings.isAvailable !== undefined) {
      activity.isAvailable = activitySettings.isAvailable;
    }
    if (activitySettings.attemptLimit !== undefined) {
      activity.attemptLimit = activitySettings.attemptLimit;
    }
    if (activitySettings.attemptAbsoluteDurationLimit !== undefined) {
      activity.attemptAbsoluteDurationLimit = activitySettings.attemptAbsoluteDurationLimit;
    }
    if (activitySettings.activityAbsoluteDurationLimit !== undefined) {
      activity.activityAbsoluteDurationLimit = activitySettings.activityAbsoluteDurationLimit;
    }
    if (activitySettings.timeLimitAction !== undefined) {
      activity.timeLimitAction = activitySettings.timeLimitAction;
    }
    if (activitySettings.timeLimitDuration !== undefined) {
      activity.timeLimitDuration = activitySettings.timeLimitDuration;
    }
    if (activitySettings.beginTimeLimit !== undefined) {
      activity.beginTimeLimit = activitySettings.beginTimeLimit;
    }
    if (activitySettings.endTimeLimit !== undefined) {
      activity.endTimeLimit = activitySettings.endTimeLimit;
    }

    if (activitySettings.primaryObjective) {
      const primaryObjective = this.createActivityObjectiveFromSettings(
        activitySettings.primaryObjective,
        true,
      );
      activity.primaryObjective = primaryObjective;
      if (primaryObjective.minNormalizedMeasure !== null) {
        activity.scaledPassingScore = primaryObjective.minNormalizedMeasure;
      }
    }

    if (activitySettings.objectives) {
      for (const objectiveSettings of activitySettings.objectives) {
        const isPrimary = objectiveSettings.isPrimary === true;
        const objective = this.createActivityObjectiveFromSettings(objectiveSettings, isPrimary);
        if (isPrimary) {
          activity.primaryObjective = objective;
        } else {
          activity.addObjective(objective);
        }
      }
    }

    if (activitySettings.sequencingControls) {
      this.sequencingConfigBuilder.applySequencingControlsSettings(
        activity.sequencingControls,
        activitySettings.sequencingControls,
      );
    }

    if (activitySettings.sequencingRules) {
      this.sequencingConfigBuilder.applySequencingRulesSettings(
        activity.sequencingRules,
        activitySettings.sequencingRules,
      );
    }

    if (activitySettings.rollupRules) {
      this.sequencingConfigBuilder.applyRollupRulesSettings(
        activity.rollupRules,
        activitySettings.rollupRules,
      );
    }

    if (activitySettings.rollupConsiderations) {
      activity.applyRollupConsiderations(activitySettings.rollupConsiderations);
    }

    if (activitySettings.hideLmsUi) {
      const mergedHide = this.sequencingConfigBuilder.mergeHideLmsUi(
        activity.hideLmsUi,
        activitySettings.hideLmsUi,
      );
      if (mergedHide.length > 0) {
        activity.hideLmsUi = mergedHide;
      }
    }

    if (activitySettings.auxiliaryResources) {
      const sanitizedAux = this.sequencingConfigBuilder.sanitizeAuxiliaryResources(
        activitySettings.auxiliaryResources,
      );
      if (sanitizedAux.length > 0) {
        activity.auxiliaryResources = this.sequencingConfigBuilder.mergeAuxiliaryResources(
          activity.auxiliaryResources,
          sanitizedAux,
        );
      }
    }

    // Create child activities
    if (activitySettings.children) {
      for (const childSettings of activitySettings.children) {
        const childActivity = this.createActivity(childSettings);
        activity.addChild(childActivity);
      }
    }

    if (activitySettings.selectionRandomizationState) {
      selectionStates.push(
        this.sequencingConfigBuilder.cloneSelectionRandomizationState(
          activitySettings.selectionRandomizationState,
        ),
      );
    }

    for (const state of selectionStates) {
      this.sequencingConfigBuilder.applySelectionRandomizationState(activity, state);
    }

    return activity;
  }

  /**
   * Extract all activity IDs from an activity and its children
   * @param {Activity} activity - The activity to extract IDs from
   * @return {string[]} - Array of activity IDs
   */
  extractActivityIds(activity: Activity): string[] {
    const ids = [activity.id];

    // Recursively extract IDs from children
    for (const child of activity.children) {
      ids.push(...this.extractActivityIds(child));
    }

    return ids;
  }

  /**
   * Create an activity objective from settings
   * @param {ObjectiveSettings} objectiveSettings - The objective settings
   * @param {boolean} isPrimary - Whether this is a primary objective
   * @return {ActivityObjective} - The created objective
   */
  createActivityObjectiveFromSettings(
    objectiveSettings: ObjectiveSettings,
    isPrimary: boolean,
  ): ActivityObjective {
    const mapInfo: ObjectiveMapInfo[] = (objectiveSettings.mapInfo || []).map((info) => ({
      targetObjectiveID: info.targetObjectiveID,
      readSatisfiedStatus: info.readSatisfiedStatus ?? false,
      readNormalizedMeasure: info.readNormalizedMeasure ?? false,
      writeSatisfiedStatus: info.writeSatisfiedStatus ?? false,
      writeNormalizedMeasure: info.writeNormalizedMeasure ?? false,
      readCompletionStatus: info.readCompletionStatus ?? false,
      writeCompletionStatus: info.writeCompletionStatus ?? false,
      readProgressMeasure: info.readProgressMeasure ?? false,
      writeProgressMeasure: info.writeProgressMeasure ?? false,
      readRawScore: info.readRawScore ?? false,
      writeRawScore: info.writeRawScore ?? false,
      readMinScore: info.readMinScore ?? false,
      writeMinScore: info.writeMinScore ?? false,
      readMaxScore: info.readMaxScore ?? false,
      writeMaxScore: info.writeMaxScore ?? false,
      updateAttemptData: info.updateAttemptData ?? false,
    }));

    return new ActivityObjective(objectiveSettings.objectiveID, {
      description: objectiveSettings.description ?? null,
      satisfiedByMeasure: objectiveSettings.satisfiedByMeasure ?? false,
      minNormalizedMeasure: objectiveSettings.minNormalizedMeasure ?? null,
      mapInfo,
      isPrimary,
    });
  }
}
