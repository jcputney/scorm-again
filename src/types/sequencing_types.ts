/**
 * Types for SCORM 2004 sequencing configuration
 */

import {
  RuleActionType,
  RuleConditionOperator,
  RuleConditionType,
} from "../cmi/scorm2004/sequencing/sequencing_rules";
import {
  RollupActionType,
  RollupConditionType,
  RollupConsiderationType,
} from "../cmi/scorm2004/sequencing/rollup_rules";
import {
  RandomizationTiming,
  SelectionTiming,
} from "../cmi/scorm2004/sequencing/sequencing_controls";

export const HIDE_LMS_UI_TOKENS = [
  "continue",
  "previous",
  "exit",
  "exitAll",
  "abandon",
  "abandonAll",
  "suspendAll",
] as const;

export type HideLmsUiItem = (typeof HIDE_LMS_UI_TOKENS)[number];

export type AuxiliaryResourceSettings = {
  resourceId: string;
  purpose: string;
};

export type AuxiliaryResource = AuxiliaryResourceSettings;

/**
 * Settings for an activity in the activity tree
 */
export type AdlRollupConsiderationRequirement =
  | "always"
  | "ifAttempted"
  | "ifNotSkipped"
  | "ifNotSuspended";

export type AdlRollupConsiderationsSettings = {
  requiredForSatisfied?: AdlRollupConsiderationRequirement;
  requiredForNotSatisfied?: AdlRollupConsiderationRequirement;
  requiredForCompleted?: AdlRollupConsiderationRequirement;
  requiredForIncomplete?: AdlRollupConsiderationRequirement;
  measureSatisfactionIfActive?: boolean;
};

export type ActivitySettings = {
  id: string;
  title: string;
  children?: ActivitySettings[];
  isVisible?: boolean;
  isActive?: boolean;
  isSuspended?: boolean;
  isCompleted?: boolean;
  isHiddenFromChoice?: boolean;
  isAvailable?: boolean;
  attemptLimit?: number | null;
  attemptAbsoluteDurationLimit?: string | null;
  activityAbsoluteDurationLimit?: string | null;
  timeLimitAction?: string | null;
  timeLimitDuration?: string | null;
  beginTimeLimit?: string | null;
  endTimeLimit?: string | null;
  primaryObjective?: ObjectiveSettings;
  objectives?: ObjectiveSettings[];
  // Optional per-activity sequencing configuration
  sequencingRules?: SequencingRulesSettings;
  sequencingControls?: SequencingControlsSettings;
  rollupRules?: RollupRulesSettings;
  rollupConsiderations?: AdlRollupConsiderationsSettings;
  selectionRandomizationState?: SelectionRandomizationStateSettings;
  hideLmsUi?: HideLmsUiItem[];
  sequencingCollectionRefs?: string | string[];
  auxiliaryResources?: AuxiliaryResourceSettings[];
};

/**
 * Settings for objective map info entries
 */
export type ObjectiveMapInfoSettings = {
  targetObjectiveID: string;
  readSatisfiedStatus?: boolean;
  readNormalizedMeasure?: boolean;
  writeSatisfiedStatus?: boolean;
  writeNormalizedMeasure?: boolean;
  readCompletionStatus?: boolean;
  writeCompletionStatus?: boolean;
  readProgressMeasure?: boolean;
  writeProgressMeasure?: boolean;
  readRawScore?: boolean;
  writeRawScore?: boolean;
  readMinScore?: boolean;
  writeMinScore?: boolean;
  readMaxScore?: boolean;
  writeMaxScore?: boolean;
  updateAttemptData?: boolean;
};

/**
 * Settings for activity objectives
 */
export type ObjectiveSettings = {
  objectiveID: string;
  description?: string;
  isPrimary?: boolean;
  satisfiedByMeasure?: boolean;
  minNormalizedMeasure?: number | null;
  mapInfo?: ObjectiveMapInfoSettings[];
};

/**
 * Settings for a rule condition
 */
export type RuleConditionSettings = {
  condition: RuleConditionType;
  operator?: RuleConditionOperator;
  referencedObjective?: string;
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
  choice?: boolean;
  choiceExit?: boolean;
  flow?: boolean;
  forwardOnly?: boolean;
  useCurrentAttemptObjectiveInfo?: boolean;
  useCurrentAttemptProgressInfo?: boolean;
  preventActivation?: boolean;
  constrainChoice?: boolean;
  stopForwardTraversal?: boolean;
  rollupObjectiveSatisfied?: boolean;
  rollupProgressCompletion?: boolean;
  objectiveMeasureWeight?: number;
  selectionTiming?: SelectionTiming;
  selectCount?: number | null;
  randomizeChildren?: boolean;
  randomizationTiming?: RandomizationTiming;
  selectionCountStatus?: boolean;
  reorderChildren?: boolean;
};

export type SelectionRandomizationStateSettings = {
  childOrder?: string[];
  selectedChildIds?: string[];
  hiddenFromChoiceChildIds?: string[];
  selectionCountStatus?: boolean;
  reorderChildren?: boolean;
};

export type SequencingCollectionSettings = {
  sequencingControls?: SequencingControlsSettings;
  sequencingRules?: SequencingRulesSettings;
  rollupRules?: RollupRulesSettings;
  rollupConsiderations?: AdlRollupConsiderationsSettings;
  selectionRandomizationState?: SelectionRandomizationStateSettings;
  hideLmsUi?: HideLmsUiItem[];
  auxiliaryResources?: AuxiliaryResourceSettings[];
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
  hideLmsUi?: HideLmsUiItem[];
  auxiliaryResources?: AuxiliaryResourceSettings[];
  collections?: Record<string, SequencingCollectionSettings>;

  // Runtime sequencing configuration
  autoRollupOnCMIChange?: boolean;
  autoProgressOnCompletion?: boolean;
  validateNavigationRequests?: boolean;
  enableEventSystem?: boolean;
  logLevel?: "debug" | "info" | "warn" | "error";
  eventListeners?: SequencingEventListeners;
};

/**
 * Interface for sequencing event listeners (re-exported for convenience)
 */
export interface SequencingEventListeners {
  onSequencingStart?: (activity: any) => void;
  onSequencingEnd?: () => void;
  onActivityDelivery?: (activity: any) => void;
  onActivityUnload?: (activity: any) => void;
  onNavigationRequest?: (request: string, target?: string) => void;
  onRollupComplete?: (activity: any) => void;
  onSequencingError?: (error: string, context?: string) => void;
  onSequencingSessionEnd?: (data: {
    reason: string;
    exception?: string | null;
    navigationRequest?: string;
  }) => void;
}
