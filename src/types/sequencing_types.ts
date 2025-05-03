/**
 * Types for SCORM 2004 sequencing configuration
 */

import { RuleActionType, RuleConditionOperator, RuleConditionType } from "../cmi/scorm2004/sequencing/sequencing_rules";
import {
  RollupActionType,
  RollupConditionType,
  RollupConsiderationType
} from "../cmi/scorm2004/sequencing/rollup_rules";

/**
 * Settings for an activity in the activity tree
 */
export type ActivitySettings = {
  id: string;
  title: string;
  children?: ActivitySettings[];
  isVisible?: boolean;
  isActive?: boolean;
  isSuspended?: boolean;
  isCompleted?: boolean;
};

/**
 * Settings for a rule condition
 */
export type RuleConditionSettings = {
  condition: RuleConditionType;
  operator?: RuleConditionOperator;
  parameters?: Record<string, any>;
};

/**
 * Settings for a sequencing rule
 */
export type SequencingRuleSettings = {
  action: RuleActionType;
  conditionCombination?: RuleConditionOperator;
  conditions: RuleConditionSettings[];
};

/**
 * Settings for sequencing rules
 */
export type SequencingRulesSettings = {
  preConditionRules?: SequencingRuleSettings[];
  exitConditionRules?: SequencingRuleSettings[];
  postConditionRules?: SequencingRuleSettings[];
};

/**
 * Settings for sequencing controls
 */
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

/**
 * Settings for a rollup condition
 */
export type RollupConditionSettings = {
  condition: RollupConditionType;
  parameters?: Record<string, any>;
};

/**
 * Settings for a rollup rule
 */
export type RollupRuleSettings = {
  action: RollupActionType;
  consideration?: RollupConsiderationType;
  minimumCount?: number;
  minimumPercent?: number;
  conditions: RollupConditionSettings[];
};

/**
 * Settings for rollup rules
 */
export type RollupRulesSettings = {
  rules: RollupRuleSettings[];
};

/**
 * Settings for SCORM 2004 sequencing
 */
export type SequencingSettings = {
  activityTree?: ActivitySettings;
  sequencingRules?: SequencingRulesSettings;
  sequencingControls?: SequencingControlsSettings;
  rollupRules?: RollupRulesSettings;
};
