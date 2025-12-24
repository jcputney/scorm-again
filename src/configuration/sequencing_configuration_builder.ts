import { SequencingControls } from "../cmi/scorm2004/sequencing/sequencing_controls";
import {
  RuleCondition,
  SequencingRule,
  SequencingRules,
} from "../cmi/scorm2004/sequencing/sequencing_rules";
import { RollupCondition, RollupRule, RollupRules } from "../cmi/scorm2004/sequencing/rollup_rules";
import {
  AuxiliaryResource,
  AuxiliaryResourceSettings,
  HIDE_LMS_UI_TOKENS,
  HideLmsUiItem,
  RollupConditionSettings,
  RollupRuleSettings,
  RollupRulesSettings,
  RuleConditionSettings,
  SelectionRandomizationStateSettings,
  SequencingCollectionSettings,
  SequencingControlsSettings,
  SequencingRuleSettings,
  SequencingRulesSettings,
} from "../types/sequencing_types";
import { Activity } from "../cmi/scorm2004/sequencing/activity";

/**
 * Builds and configures SCORM 2004 sequencing rules, controls, and collections
 *
 * This class is responsible for:
 * - Applying sequencing controls settings
 * - Creating and configuring sequencing rules
 * - Creating and configuring rollup rules
 * - Sanitizing sequencing collections
 * - Managing HideLmsUi and auxiliary resources
 */
export class SequencingConfigurationBuilder {
  /**
   * Applies the given sequencing controls settings to the specified target.
   *
   * @param {SequencingControls} target - The target object where sequencing control settings will be applied.
   * @param {SequencingControlsSettings} settings - An object containing the sequencing control settings to be applied to the target.
   * @return {void} - No return value as the method modifies the target object directly.
   */
  applySequencingControlsSettings(
    target: SequencingControls,
    settings: SequencingControlsSettings,
  ): void {
    if (settings.enabled !== undefined) {
      target.enabled = settings.enabled;
    }
    if (settings.choice !== undefined) {
      target.choice = settings.choice;
    }
    if (settings.choiceExit !== undefined) {
      target.choiceExit = settings.choiceExit;
    }
    if (settings.flow !== undefined) {
      target.flow = settings.flow;
    }
    if (settings.forwardOnly !== undefined) {
      target.forwardOnly = settings.forwardOnly;
    }
    if (settings.useCurrentAttemptObjectiveInfo !== undefined) {
      target.useCurrentAttemptObjectiveInfo = settings.useCurrentAttemptObjectiveInfo;
    }
    if (settings.useCurrentAttemptProgressInfo !== undefined) {
      target.useCurrentAttemptProgressInfo = settings.useCurrentAttemptProgressInfo;
    }
    if (settings.preventActivation !== undefined) {
      target.preventActivation = settings.preventActivation;
    }
    if (settings.constrainChoice !== undefined) {
      target.constrainChoice = settings.constrainChoice;
    }
    if (settings.stopForwardTraversal !== undefined) {
      target.stopForwardTraversal = settings.stopForwardTraversal;
    }
    if (settings.rollupObjectiveSatisfied !== undefined) {
      target.rollupObjectiveSatisfied = settings.rollupObjectiveSatisfied;
    }
    if (settings.rollupProgressCompletion !== undefined) {
      target.rollupProgressCompletion = settings.rollupProgressCompletion;
    }
    if (settings.objectiveMeasureWeight !== undefined) {
      target.objectiveMeasureWeight = settings.objectiveMeasureWeight;
    }
    if (settings.selectionTiming !== undefined) {
      target.selectionTiming = settings.selectionTiming;
    }
    if (settings.selectCount !== undefined) {
      target.selectCount = settings.selectCount;
    }
    if (settings.randomizeChildren !== undefined) {
      target.randomizeChildren = settings.randomizeChildren;
    }
    if (settings.randomizationTiming !== undefined) {
      target.randomizationTiming = settings.randomizationTiming;
    }
    if (settings.selectionCountStatus !== undefined) {
      target.selectionCountStatus = settings.selectionCountStatus;
    }
    if (settings.reorderChildren !== undefined) {
      target.reorderChildren = settings.reorderChildren;
    }
    if (settings.completionSetByContent !== undefined) {
      target.completionSetByContent = settings.completionSetByContent;
    }
    if (settings.objectiveSetByContent !== undefined) {
      target.objectiveSetByContent = settings.objectiveSetByContent;
    }
  }

  /**
   * Applies the sequencing rules settings to the specified target object.
   *
   * @param {SequencingRules} target The target object where the sequencing rules will be applied.
   * @param {SequencingRulesSettings} settings The settings object containing the sequencing rules to be applied. If null or undefined, no rules will be applied.
   * @return {void} This method does not return a value.
   */
  applySequencingRulesSettings(target: SequencingRules, settings: SequencingRulesSettings): void {
    if (!settings) {
      return;
    }

    if (settings.preConditionRules) {
      for (const ruleSettings of settings.preConditionRules) {
        const rule = this.createSequencingRule(ruleSettings);
        target.addPreConditionRule(rule);
      }
    }

    if (settings.exitConditionRules) {
      for (const ruleSettings of settings.exitConditionRules) {
        const rule = this.createSequencingRule(ruleSettings);
        target.addExitConditionRule(rule);
      }
    }

    if (settings.postConditionRules) {
      for (const ruleSettings of settings.postConditionRules) {
        const rule = this.createSequencingRule(ruleSettings);
        target.addPostConditionRule(rule);
      }
    }
  }

  /**
   * Create a sequencing rule from settings
   * @param {SequencingRuleSettings} ruleSettings - The sequencing rule settings
   * @return {SequencingRule} - The created sequencing rule
   */
  createSequencingRule(ruleSettings: SequencingRuleSettings): SequencingRule {
    // Create rule
    const rule = new SequencingRule(ruleSettings.action, ruleSettings.conditionCombination);

    // Add conditions
    for (const conditionSettings of ruleSettings.conditions) {
      const condition = new RuleCondition(
        conditionSettings.condition,
        conditionSettings.operator,
        new Map(Object.entries(conditionSettings.parameters || {})),
      );
      if (conditionSettings.referencedObjective) {
        condition.referencedObjective = conditionSettings.referencedObjective;
      }
      rule.addCondition(condition);
    }

    return rule;
  }

  /**
   * Applies rollup rules settings to the specified target object.
   * This method processes the provided settings and adds the corresponding
   * rollup rules to the target.
   *
   * @param {RollupRules} target - The target object where rollup rules will be applied.
   * @param {RollupRulesSettings} settings - The settings containing the rollup rules to be applied.
   * @return {void} This method does not return a value.
   */
  applyRollupRulesSettings(target: RollupRules, settings: RollupRulesSettings): void {
    if (!settings?.rules) {
      return;
    }

    for (const ruleSettings of settings.rules) {
      const rule = this.createRollupRule(ruleSettings);
      target.addRule(rule);
    }
  }

  /**
   * Create a rollup rule from settings
   * @param {RollupRuleSettings} ruleSettings - The rollup rule settings
   * @return {RollupRule} - The created rollup rule
   */
  createRollupRule(ruleSettings: RollupRuleSettings): RollupRule {
    // Create rule
    const rule = new RollupRule(
      ruleSettings.action,
      ruleSettings.consideration,
      ruleSettings.minimumCount,
      ruleSettings.minimumPercent,
    );

    // Add conditions
    for (const conditionSettings of ruleSettings.conditions) {
      const condition = new RollupCondition(
        conditionSettings.condition,
        new Map(Object.entries(conditionSettings.parameters || {})),
      );
      rule.addCondition(condition);
    }

    return rule;
  }

  /**
   * Sanitizes and processes a collection of sequencing settings. This involves ensuring that
   * the IDs are trimmed and non-empty, cloning objects deeply to ensure immutability,
   * and sanitizing each subset of sequencing configurations.
   *
   * @param {Record<string, SequencingCollectionSettings>} [collections] -
   *        A record of sequencing collection settings where keys are collection IDs
   *        and values are the associated configuration to be sanitized.
   *
   * @return {Record<string, SequencingCollectionSettings>}
   *         A sanitized record of sequencing collection settings, with processed and
   *         cloned settings for immutability and validity.
   */
  sanitizeSequencingCollections(
    collections?: Record<string, SequencingCollectionSettings>,
  ): Record<string, SequencingCollectionSettings> {
    if (!collections) {
      return {};
    }

    const sanitized: Record<string, SequencingCollectionSettings> = {};
    for (const [id, collection] of Object.entries(collections)) {
      const trimmedId = id.trim();
      if (!trimmedId) {
        continue;
      }

      const sanitizedCollection: SequencingCollectionSettings = {};

      if (collection.sequencingControls) {
        sanitizedCollection.sequencingControls = { ...collection.sequencingControls };
      }
      if (collection.sequencingRules) {
        const ruleClone = (rule: SequencingRuleSettings): SequencingRuleSettings => {
          const cloned: SequencingRuleSettings = {
            action: rule.action,
            conditions: rule.conditions.map((condition) => {
              const clonedCondition: RuleConditionSettings = {
                condition: condition.condition,
              };
              if (condition.operator !== undefined) {
                clonedCondition.operator = condition.operator;
              }
              if (condition.parameters) {
                clonedCondition.parameters = { ...condition.parameters };
              }
              if (condition.referencedObjective !== undefined) {
                clonedCondition.referencedObjective = condition.referencedObjective;
              }
              return clonedCondition;
            }),
          };
          if (rule.conditionCombination !== undefined) {
            cloned.conditionCombination = rule.conditionCombination;
          }
          return cloned;
        };

        sanitizedCollection.sequencingRules = {};
        if (collection.sequencingRules.preConditionRules) {
          sanitizedCollection.sequencingRules.preConditionRules =
            collection.sequencingRules.preConditionRules.map(ruleClone);
        }
        if (collection.sequencingRules.exitConditionRules) {
          sanitizedCollection.sequencingRules.exitConditionRules =
            collection.sequencingRules.exitConditionRules.map(ruleClone);
        }
        if (collection.sequencingRules.postConditionRules) {
          sanitizedCollection.sequencingRules.postConditionRules =
            collection.sequencingRules.postConditionRules.map(ruleClone);
        }
      }

      if (collection.rollupRules) {
        sanitizedCollection.rollupRules = {
          rules: collection.rollupRules.rules?.map((rule) => {
            const clonedRule: RollupRuleSettings = {
              action: rule.action,
              conditions: rule.conditions.map((condition) => {
                const clonedCondition: RollupConditionSettings = {
                  condition: condition.condition,
                };
                if (condition.parameters) {
                  clonedCondition.parameters = { ...condition.parameters };
                }
                return clonedCondition;
              }),
            };
            if (rule.consideration !== undefined) {
              clonedRule.consideration = rule.consideration;
            }
            if (rule.minimumCount !== undefined) {
              clonedRule.minimumCount = rule.minimumCount;
            }
            if (rule.minimumPercent !== undefined) {
              clonedRule.minimumPercent = rule.minimumPercent;
            }
            return clonedRule;
          }),
        };
      }

      if (collection.rollupConsiderations) {
        sanitizedCollection.rollupConsiderations = { ...collection.rollupConsiderations };
      }

      if (collection.selectionRandomizationState) {
        sanitizedCollection.selectionRandomizationState = this.cloneSelectionRandomizationState(
          collection.selectionRandomizationState,
        );
      }

      if (collection.hideLmsUi) {
        sanitizedCollection.hideLmsUi = this.sanitizeHideLmsUi(collection.hideLmsUi);
      }

      if (collection.auxiliaryResources) {
        sanitizedCollection.auxiliaryResources = this.sanitizeAuxiliaryResources(
          collection.auxiliaryResources,
        );
      }

      sanitized[trimmedId] = sanitizedCollection;
    }

    return sanitized;
  }

  /**
   * Normalizes the provided collection references into an array of unique, trimmed strings.
   * Removes duplicates and trims whitespace from each reference.
   *
   * @param {string | string[]} [refs] - A single reference string or an array of reference strings to be normalized.
   *                                      If not provided, defaults to an empty array.
   * @return {string[]} An array of unique and trimmed strings representing normalized collection references.
   */
  normalizeCollectionRefs(refs?: string | string[]): string[] {
    if (!refs) {
      return [];
    }

    const raw = Array.isArray(refs) ? refs : [refs];
    const seen = new Set<string>();
    const result: string[] = [];

    for (const ref of raw) {
      const trimmed = ref.trim();
      if (!trimmed || seen.has(trimmed)) {
        continue;
      }
      seen.add(trimmed);
      result.push(trimmed);
    }

    return result;
  }

  /**
   * Applies the sequencing configuration from the given collection to the specified activity.
   *
   * @param {Activity} activity - The activity to which the sequencing collection settings will be applied.
   * @param {SequencingCollectionSettings} collection - The collection of sequencing settings to apply to the activity.
   * @param {SelectionRandomizationStateSettings[]} selectionStates - The list of selection randomization state objects, which may be modified during this process.
   * @return {void} This method does not return a value.
   */
  applySequencingCollection(
    activity: Activity,
    collection: SequencingCollectionSettings,
    selectionStates: SelectionRandomizationStateSettings[],
  ): void {
    if (!collection) {
      return;
    }

    if (collection.sequencingControls) {
      this.applySequencingControlsSettings(
        activity.sequencingControls,
        collection.sequencingControls,
      );
    }

    if (collection.sequencingRules) {
      this.applySequencingRulesSettings(activity.sequencingRules, collection.sequencingRules);
    }

    if (collection.rollupRules) {
      this.applyRollupRulesSettings(activity.rollupRules, collection.rollupRules);
    }

    if (collection.rollupConsiderations) {
      activity.applyRollupConsiderations(collection.rollupConsiderations);
    }

    if (collection.hideLmsUi) {
      const merged = this.mergeHideLmsUi(activity.hideLmsUi, collection.hideLmsUi);
      if (merged.length > 0) {
        activity.hideLmsUi = merged;
      }
    }

    if (collection.auxiliaryResources) {
      const sanitizedAux = this.sanitizeAuxiliaryResources(collection.auxiliaryResources);
      if (sanitizedAux.length > 0) {
        activity.auxiliaryResources = this.mergeAuxiliaryResources(
          activity.auxiliaryResources,
          sanitizedAux,
        );
      }
    }

    if (collection.selectionRandomizationState) {
      selectionStates.push(
        this.cloneSelectionRandomizationState(collection.selectionRandomizationState),
      );
    }
  }

  /**
   * Filters and sanitizes a list of items by removing duplicates and ensuring
   * only valid items are included according to a predefined set of valid tokens.
   *
   * @param {HideLmsUiItem[] | undefined} items - The list of items to be sanitized.
   * Can be undefined, in which case an empty array is returned.
   * @return {HideLmsUiItem[]} The sanitized list of unique and valid items.
   */
  sanitizeHideLmsUi(items: HideLmsUiItem[] | undefined): HideLmsUiItem[] {
    if (!items) {
      return [];
    }

    const valid = new Set(HIDE_LMS_UI_TOKENS);
    const seen = new Set<HideLmsUiItem>();
    const sanitized: HideLmsUiItem[] = [];

    for (const item of items) {
      if (valid.has(item) && !seen.has(item)) {
        seen.add(item);
        sanitized.push(item);
      }
    }

    return sanitized;
  }

  /**
   * Merges the current array of HideLmsUiItem objects with an optional additional array,
   * and sanitizes the combined result.
   *
   * @param {HideLmsUiItem[]} current - The current array of HideLmsUiItem objects.
   * @param {HideLmsUiItem[]} [additional] - An optional array of additional HideLmsUiItem objects to merge.
   * @return {HideLmsUiItem[]} The sanitized merged array of HideLmsUiItem objects.
   */
  mergeHideLmsUi(current: HideLmsUiItem[], additional?: HideLmsUiItem[]): HideLmsUiItem[] {
    if (!additional || additional.length === 0) {
      return current;
    }
    return this.sanitizeHideLmsUi([...current, ...additional]);
  }

  /**
   * Sanitizes and filters the given auxiliary resources by removing duplicates,
   * trimming unnecessary whitespace, and ensuring valid data integrity.
   *
   * @param {AuxiliaryResourceSettings[]} [resources] - An optional array of auxiliary resource settings
   *     that include details such as resource ID and purpose.
   * @return {AuxiliaryResource[]} - A sanitized array of auxiliary resources, each containing
   *     valid resource IDs and purposes, with duplicates and invalid entries removed.
   */
  sanitizeAuxiliaryResources(resources?: AuxiliaryResourceSettings[]): AuxiliaryResource[] {
    if (!resources) {
      return [];
    }

    const seen = new Set<string>();
    const sanitized: AuxiliaryResource[] = [];

    for (const resource of resources) {
      if (!resource) continue;

      // Type-safe null/undefined checks before calling trim()
      if (!resource.resourceId || typeof resource.resourceId !== "string") continue;
      if (!resource.purpose || typeof resource.purpose !== "string") continue;

      const resourceId = resource.resourceId.trim();
      const purpose = resource.purpose.trim();

      if (!resourceId || !purpose) continue;

      const key = `${resourceId}::${purpose}`;
      if (!seen.has(key)) {
        seen.add(key);
        sanitized.push({ resourceId, purpose });
      }
    }

    return sanitized;
  }

  /**
   * Merges two arrays of auxiliary resources, removing duplicates based on their resource identifiers.
   *
   * @param {AuxiliaryResource[] | undefined} existing - The existing array of auxiliary resources. This can be undefined.
   * @param {AuxiliaryResource[] | undefined} additions - The array of new auxiliary resources to add. This can be undefined.
   * @return {AuxiliaryResource[]} A new array containing unique auxiliary resources from both input arrays, filtered by their resource identifiers.
   */
  mergeAuxiliaryResources(
    existing: AuxiliaryResource[] | undefined,
    additions: AuxiliaryResource[] | undefined,
  ): AuxiliaryResource[] {
    const merged: AuxiliaryResource[] = [];
    const seen = new Set<string>();

    for (const resource of [...(existing ?? []), ...(additions ?? [])]) {
      if (!resource) {
        continue;
      }
      const resourceId = resource.resourceId;
      if (!resourceId || seen.has(resourceId)) {
        continue;
      }
      seen.add(resourceId);
      merged.push({ resourceId, purpose: resource.purpose });
    }

    return merged;
  }

  /**
   * Clones the given SelectionRandomizationStateSettings object, creating a new object with identical properties.
   *
   * @param {SelectionRandomizationStateSettings} state - The SelectionRandomizationStateSettings object to be cloned.
   * @return {SelectionRandomizationStateSettings} A new instance of SelectionRandomizationStateSettings with the same properties as the input object.
   */
  cloneSelectionRandomizationState(
    state: SelectionRandomizationStateSettings,
  ): SelectionRandomizationStateSettings {
    const clone: SelectionRandomizationStateSettings = {};
    if (state.childOrder) {
      clone.childOrder = [...state.childOrder];
    }
    if (state.selectedChildIds) {
      clone.selectedChildIds = [...state.selectedChildIds];
    }
    if (state.hiddenFromChoiceChildIds) {
      clone.hiddenFromChoiceChildIds = [...state.hiddenFromChoiceChildIds];
    }
    if (state.selectionCountStatus !== undefined) {
      clone.selectionCountStatus = state.selectionCountStatus;
    }
    if (state.reorderChildren !== undefined) {
      clone.reorderChildren = state.reorderChildren;
    }
    return clone;
  }

  /**
   * Applies the selection randomization state to the given activity by updating its sequencing controls
   * and configuring visibility, availability, and order of its child elements.
   *
   * @param {Activity} activity - The activity to which the selection randomization state is applied.
   * @param {SelectionRandomizationStateSettings} state - The settings object defining the selection
   * randomization state, including properties for selection count status, child order, reorder controls,
   * selected child IDs, and hidden child IDs.
   * @return {void} This method does not return a value.
   */
  applySelectionRandomizationState(
    activity: Activity,
    state: SelectionRandomizationStateSettings,
  ): void {
    const sequencingControls = activity.sequencingControls;

    if (state.selectionCountStatus !== undefined) {
      sequencingControls.selectionCountStatus = state.selectionCountStatus;
    }

    if (state.reorderChildren !== undefined) {
      sequencingControls.reorderChildren = state.reorderChildren;
    }

    const selectedSet = state.selectedChildIds ? new Set(state.selectedChildIds) : null;
    const hiddenSet = state.hiddenFromChoiceChildIds
      ? new Set(state.hiddenFromChoiceChildIds)
      : null;

    if (state.childOrder && state.childOrder.length > 0) {
      activity.setChildOrder(state.childOrder);
    }

    let selectionTouched = false;

    if (selectedSet || hiddenSet) {
      for (const child of activity.children) {
        if (selectedSet) {
          const isSelected = selectedSet.has(child.id);
          child.isAvailable = isSelected;
          if (!hiddenSet) {
            child.isHiddenFromChoice = !isSelected;
          }
          selectionTouched = true;
        }

        if (hiddenSet) {
          child.isHiddenFromChoice = hiddenSet.has(child.id);
          selectionTouched = true;
        }
      }
    }

    const shouldSetProcessedChildren =
      selectionTouched ||
      !!selectedSet ||
      state.selectionCountStatus !== undefined ||
      state.reorderChildren !== undefined ||
      (state.childOrder && state.childOrder.length > 0);

    if (shouldSetProcessedChildren) {
      activity.setProcessedChildren(activity.children.filter((child) => child.isAvailable));
    }
  }
}
