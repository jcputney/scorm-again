import { RuleActionType, RuleConditionOperator, RuleConditionType } from "../cmi/scorm2004/sequencing/sequencing_rules";
import { RollupActionType, RollupConditionType, RollupConsiderationType } from "../cmi/scorm2004/sequencing/rollup_rules";
export type ActivitySettings = {
    id: string;
    title: string;
    children?: ActivitySettings[];
    isVisible?: boolean;
    isActive?: boolean;
    isSuspended?: boolean;
    isCompleted?: boolean;
    sequencingRules?: SequencingRulesSettings;
    sequencingControls?: SequencingControlsSettings;
    rollupRules?: RollupRulesSettings;
};
export type RuleConditionSettings = {
    condition: RuleConditionType;
    operator?: RuleConditionOperator;
    parameters?: Record<string, any>;
};
export type SequencingRuleSettings = {
    action: RuleActionType;
    conditionCombination?: RuleConditionOperator;
    conditions: RuleConditionSettings[];
};
export type SequencingRulesSettings = {
    preConditionRules?: SequencingRuleSettings[];
    exitConditionRules?: SequencingRuleSettings[];
    postConditionRules?: SequencingRuleSettings[];
};
export type SequencingControlsSettings = {
    enabled?: boolean;
    choiceExit?: boolean;
    flow?: boolean;
    forwardOnly?: boolean;
    useCurrentAttemptObjectiveInfo?: boolean;
    useCurrentAttemptProgressInfo?: boolean;
    preventActivation?: boolean;
    constrainChoice?: boolean;
    rollupObjectiveSatisfied?: boolean;
    rollupProgressCompletion?: boolean;
    objectiveMeasureWeight?: number;
};
export type RollupConditionSettings = {
    condition: RollupConditionType;
    parameters?: Record<string, any>;
};
export type RollupRuleSettings = {
    action: RollupActionType;
    consideration?: RollupConsiderationType;
    minimumCount?: number;
    minimumPercent?: number;
    conditions: RollupConditionSettings[];
};
export type RollupRulesSettings = {
    rules: RollupRuleSettings[];
};
export type SequencingSettings = {
    activityTree?: ActivitySettings;
    sequencingRules?: SequencingRulesSettings;
    sequencingControls?: SequencingControlsSettings;
    rollupRules?: RollupRulesSettings;
    autoRollupOnCMIChange?: boolean;
    autoProgressOnCompletion?: boolean;
    validateNavigationRequests?: boolean;
    enableEventSystem?: boolean;
    logLevel?: "debug" | "info" | "warn" | "error";
    eventListeners?: SequencingEventListeners;
};
export interface SequencingEventListeners {
    onSequencingStart?: (activity: any) => void;
    onSequencingEnd?: () => void;
    onActivityDelivery?: (activity: any) => void;
    onActivityUnload?: (activity: any) => void;
    onNavigationRequest?: (request: string, target?: string) => void;
    onRollupComplete?: (activity: any) => void;
    onSequencingError?: (error: string, context?: string) => void;
}
//# sourceMappingURL=sequencing_types.d.ts.map