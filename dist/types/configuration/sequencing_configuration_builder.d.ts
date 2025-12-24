import { SequencingControls } from "../cmi/scorm2004/sequencing/sequencing_controls";
import { SequencingRule, SequencingRules } from "../cmi/scorm2004/sequencing/sequencing_rules";
import { RollupRule, RollupRules } from "../cmi/scorm2004/sequencing/rollup_rules";
import { AuxiliaryResource, AuxiliaryResourceSettings, HideLmsUiItem, RollupRuleSettings, RollupRulesSettings, SelectionRandomizationStateSettings, SequencingCollectionSettings, SequencingControlsSettings, SequencingRuleSettings, SequencingRulesSettings } from "../types/sequencing_types";
import { Activity } from "../cmi/scorm2004/sequencing/activity";
export declare class SequencingConfigurationBuilder {
    applySequencingControlsSettings(target: SequencingControls, settings: SequencingControlsSettings): void;
    applySequencingRulesSettings(target: SequencingRules, settings: SequencingRulesSettings): void;
    createSequencingRule(ruleSettings: SequencingRuleSettings): SequencingRule;
    applyRollupRulesSettings(target: RollupRules, settings: RollupRulesSettings): void;
    createRollupRule(ruleSettings: RollupRuleSettings): RollupRule;
    sanitizeSequencingCollections(collections?: Record<string, SequencingCollectionSettings>): Record<string, SequencingCollectionSettings>;
    normalizeCollectionRefs(refs?: string | string[]): string[];
    applySequencingCollection(activity: Activity, collection: SequencingCollectionSettings, selectionStates: SelectionRandomizationStateSettings[]): void;
    sanitizeHideLmsUi(items: HideLmsUiItem[] | undefined): HideLmsUiItem[];
    mergeHideLmsUi(current: HideLmsUiItem[], additional?: HideLmsUiItem[]): HideLmsUiItem[];
    sanitizeAuxiliaryResources(resources?: AuxiliaryResourceSettings[]): AuxiliaryResource[];
    mergeAuxiliaryResources(existing: AuxiliaryResource[] | undefined, additions: AuxiliaryResource[] | undefined): AuxiliaryResource[];
    cloneSelectionRandomizationState(state: SelectionRandomizationStateSettings): SelectionRandomizationStateSettings;
    applySelectionRandomizationState(activity: Activity, state: SelectionRandomizationStateSettings): void;
}
//# sourceMappingURL=sequencing_configuration_builder.d.ts.map