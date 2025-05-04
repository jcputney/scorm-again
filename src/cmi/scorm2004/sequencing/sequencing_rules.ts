import { BaseCMI } from "../../common/base_cmi";
import { Activity } from "./activity";
import { Scorm2004ValidationError } from "../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../constants/error_codes";
import { SuccessStatus } from "../../../constants/enums";

/**
 * Enum for rule condition operators
 */
export enum RuleConditionOperator {
  NOT = "not",
  AND = "and",
  OR = "or",
}

/**
 * Enum for rule condition types
 */
export enum RuleConditionType {
  SATISFIED = "satisfied",
  OBJECTIVE_STATUS_KNOWN = "objectiveStatusKnown",
  OBJECTIVE_MEASURE_KNOWN = "objectiveMeasureKnown",
  OBJECTIVE_MEASURE_GREATER_THAN = "objectiveMeasureGreaterThan",
  OBJECTIVE_MEASURE_LESS_THAN = "objectiveMeasureLessThan",
  COMPLETED = "completed",
  PROGRESS_KNOWN = "progressKnown",
  ATTEMPTED = "attempted",
  ATTEMPT_LIMIT_EXCEEDED = "attemptLimitExceeded",
  TIME_LIMIT_EXCEEDED = "timeLimitExceeded",
  OUTSIDE_AVAILABLE_TIME_RANGE = "outsideAvailableTimeRange",
  ALWAYS = "always",
}

/**
 * Enum for rule action types
 */
export enum RuleActionType {
  SKIP = "skip",
  DISABLED = "disabled",
  HIDE_FROM_CHOICE = "hideFromChoice",
  STOP_FORWARD_TRAVERSAL = "stopForwardTraversal",
  EXIT_PARENT = "exitParent",
  EXIT_ALL = "exitAll",
  RETRY = "retry",
  RETRY_ALL = "retryAll",
  CONTINUE = "continue",
  PREVIOUS = "previous",
  EXIT = "exit",
}

/**
 * Class representing a sequencing rule condition
 */
export class RuleCondition extends BaseCMI {
  private _condition: RuleConditionType = RuleConditionType.ALWAYS;
  private _operator: RuleConditionOperator | null = null;
  private _parameters: Map<string, any> = new Map();

  /**
   * Constructor for RuleCondition
   * @param {RuleConditionType} condition - The condition type
   * @param {RuleConditionOperator | null} operator - The operator (null for no operator)
   * @param {Map<string, any>} parameters - Additional parameters for the condition
   */
  constructor(
    condition: RuleConditionType = RuleConditionType.ALWAYS,
    operator: RuleConditionOperator | null = null,
    parameters: Map<string, any> = new Map(),
  ) {
    super("ruleCondition");
    this._condition = condition;
    this._operator = operator;
    this._parameters = parameters;
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._condition = RuleConditionType.ALWAYS;
    this._operator = null;
    this._parameters = new Map();
  }

  /**
   * Getter for condition
   * @return {RuleConditionType}
   */
  get condition(): RuleConditionType {
    return this._condition;
  }

  /**
   * Setter for condition
   * @param {RuleConditionType} condition
   */
  set condition(condition: RuleConditionType) {
    this._condition = condition;
  }

  /**
   * Getter for operator
   * @return {RuleConditionOperator | null}
   */
  get operator(): RuleConditionOperator | null {
    return this._operator;
  }

  /**
   * Setter for operator
   * @param {RuleConditionOperator | null} operator
   */
  set operator(operator: RuleConditionOperator | null) {
    this._operator = operator;
  }

  /**
   * Getter for parameters
   * @return {Map<string, any>}
   */
  get parameters(): Map<string, any> {
    return this._parameters;
  }

  /**
   * Setter for parameters
   * @param {Map<string, any>} parameters
   */
  set parameters(parameters: Map<string, any>) {
    this._parameters = parameters;
  }

  /**
   * Evaluate the condition for an activity
   * @param {Activity} activity - The activity to evaluate the condition for
   * @return {boolean} - True if the condition is met, false otherwise
   */
  evaluate(activity: Activity): boolean {
    let result = false;
    switch (this._condition) {
      case RuleConditionType.SATISFIED:
        result = activity.successStatus === SuccessStatus.PASSED;
        break;
      case RuleConditionType.OBJECTIVE_STATUS_KNOWN:
        result = !!activity.objectiveMeasureStatus;
        break;
      case RuleConditionType.OBJECTIVE_MEASURE_KNOWN:
        result = !!activity.objectiveMeasureStatus;
        break;
      case RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN: {
        const greaterThanValue = this._parameters.get("threshold") || 0;
        result =
          activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure > greaterThanValue;
        break;
      }
      case RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN: {
        const lessThanValue = this._parameters.get("threshold") || 0;
        result =
          activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure < lessThanValue;
        break;
      }
      case RuleConditionType.COMPLETED:
        result = activity.isCompleted;
        break;
      case RuleConditionType.PROGRESS_KNOWN:
        result = activity.completionStatus !== "unknown";
        break;
      case RuleConditionType.ATTEMPTED:
        result = activity.attemptCount > 0;
        break;
      case RuleConditionType.ATTEMPT_LIMIT_EXCEEDED: {
        const attemptLimit = this._parameters.get("attemptLimit") || 0;
        result = activity.attemptCount >= attemptLimit;
        break;
      }
      case RuleConditionType.TIME_LIMIT_EXCEEDED:
        // Time limit exceeded would require additional tracking
        result = false;
        break;
      case RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE:
        // Outside available time range would require additional tracking
        result = false;
        break;
      case RuleConditionType.ALWAYS:
        result = true;
        break;
      default:
        result = false;
        break;
    }

    if (this._operator === RuleConditionOperator.NOT) {
      result = !result;
    }

    return result;
  }

  /**
   * toJSON for RuleCondition
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      condition: this._condition,
      operator: this._operator,
      parameters: Object.fromEntries(this._parameters),
    };
    this.jsonString = false;
    return result;
  }
}

/**
 * Class representing a sequencing rule
 */
export class SequencingRule extends BaseCMI {
  private _conditions: RuleCondition[] = [];
  private _action: RuleActionType = RuleActionType.SKIP;
  private _conditionCombination: string | RuleConditionOperator = RuleConditionOperator.AND;

  /**
   * Constructor for SequencingRule
   * @param {RuleActionType} action - The action to take when the rule conditions are met
   * @param {string | RuleConditionOperator} conditionCombination - How to combine multiple conditions ("all"/"and" or "any"/"or")
   */
  constructor(
    action: RuleActionType = RuleActionType.SKIP,
    conditionCombination: string | RuleConditionOperator = RuleConditionOperator.AND,
  ) {
    super("sequencingRule");
    this._action = action;
    this._conditionCombination = conditionCombination;
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._conditions = [];
    this._action = RuleActionType.SKIP;
    this._conditionCombination = RuleConditionOperator.AND;
  }

  /**
   * Getter for conditions
   * @return {RuleCondition[]}
   */
  get conditions(): RuleCondition[] {
    return this._conditions;
  }

  /**
   * Add a condition to the rule
   * @param {RuleCondition} condition - The condition to add
   */
  addCondition(condition: RuleCondition): void {
    // noinspection SuspiciousTypeOfGuard
    if (!(condition instanceof RuleCondition)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".conditions",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    // Check if the condition is already in the array
    if (!this._conditions.includes(condition)) {
      this._conditions.push(condition);
    }
  }

  /**
   * Remove a condition from the rule
   * @param {RuleCondition} condition - The condition to remove
   * @return {boolean} - True if the condition was removed, false otherwise
   */
  removeCondition(condition: RuleCondition): boolean {
    // noinspection SuspiciousTypeOfGuard
    if (!(condition instanceof RuleCondition)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".conditions",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    const index = this._conditions.indexOf(condition);
    if (index !== -1) {
      this._conditions.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Getter for action
   * @return {RuleActionType}
   */
  get action(): RuleActionType {
    return this._action;
  }

  /**
   * Setter for action
   * @param {RuleActionType} action
   */
  set action(action: RuleActionType) {
    this._action = action;
  }

  /**
   * Getter for conditionCombination
   * @return {string | RuleConditionOperator}
   */
  get conditionCombination(): string | RuleConditionOperator {
    return this._conditionCombination;
  }

  /**
   * Setter for conditionCombination
   * @param {string | RuleConditionOperator} conditionCombination
   */
  set conditionCombination(conditionCombination: string | RuleConditionOperator) {
    this._conditionCombination = conditionCombination;
  }

  /**
   * Evaluate the rule for an activity
   * @param {Activity} activity - The activity to evaluate the rule for
   * @return {boolean} - True if the rule conditions are met, false otherwise
   */
  evaluate(activity: Activity): boolean {
    if (this._conditions.length === 0) {
      return true;
    }

    if (
      this._conditionCombination === "all" ||
      this._conditionCombination === RuleConditionOperator.AND
    ) {
      return this._conditions.every((condition) => condition.evaluate(activity));
    } else if (
      this._conditionCombination === "any" ||
      this._conditionCombination === RuleConditionOperator.OR
    ) {
      return this._conditions.some((condition) => condition.evaluate(activity));
    }

    return false;
  }

  /**
   * toJSON for SequencingRule
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      conditions: this._conditions,
      action: this._action,
      conditionCombination: this._conditionCombination,
    };
    this.jsonString = false;
    return result;
  }
}

/**
 * Class representing a collection of sequencing rules
 */
export class SequencingRules extends BaseCMI {
  private _preConditionRules: SequencingRule[] = [];
  private _exitConditionRules: SequencingRule[] = [];
  private _postConditionRules: SequencingRule[] = [];

  /**
   * Constructor for SequencingRules
   */
  constructor() {
    super("sequencingRules");
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._preConditionRules = [];
    this._exitConditionRules = [];
    this._postConditionRules = [];
  }

  /**
   * Getter for preConditionRules
   * @return {SequencingRule[]}
   */
  get preConditionRules(): SequencingRule[] {
    return this._preConditionRules;
  }

  /**
   * Add a pre-condition rule
   * @param {SequencingRule} rule - The rule to add
   */
  addPreConditionRule(rule: SequencingRule): void {
    // noinspection SuspiciousTypeOfGuard
    if (!(rule instanceof SequencingRule)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".preConditionRules",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._preConditionRules.push(rule);
  }

  /**
   * Getter for exitConditionRules
   * @return {SequencingRule[]}
   */
  get exitConditionRules(): SequencingRule[] {
    return this._exitConditionRules;
  }

  /**
   * Add an exit condition rule
   * @param {SequencingRule} rule - The rule to add
   */
  addExitConditionRule(rule: SequencingRule): void {
    // noinspection SuspiciousTypeOfGuard
    if (!(rule instanceof SequencingRule)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".exitConditionRules",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._exitConditionRules.push(rule);
  }

  /**
   * Getter for postConditionRules
   * @return {SequencingRule[]}
   */
  get postConditionRules(): SequencingRule[] {
    return this._postConditionRules;
  }

  /**
   * Add a post-condition rule
   * @param {SequencingRule} rule - The rule to add
   */
  addPostConditionRule(rule: SequencingRule): void {
    // noinspection SuspiciousTypeOfGuard
    if (!(rule instanceof SequencingRule)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".postConditionRules",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._postConditionRules.push(rule);
  }

  /**
   * Evaluate pre-condition rules for an activity
   * @param {Activity} activity - The activity to evaluate the rules for
   * @return {RuleActionType | null} - The action to take, or null if no rules are met
   */
  evaluatePreConditionRules(activity: Activity): RuleActionType | null {
    for (const rule of this._preConditionRules) {
      if (rule.evaluate(activity)) {
        return rule.action;
      }
    }
    return null;
  }

  /**
   * Evaluate exit condition rules for an activity
   * @param {Activity} activity - The activity to evaluate the rules for
   * @return {RuleActionType | null} - The action to take, or null if no rules are met
   */
  evaluateExitConditionRules(activity: Activity): RuleActionType | null {
    for (const rule of this._exitConditionRules) {
      if (rule.evaluate(activity)) {
        return rule.action;
      }
    }
    return null;
  }

  /**
   * Evaluate post-condition rules for an activity
   * @param {Activity} activity - The activity to evaluate the rules for
   * @return {RuleActionType | null} - The action to take, or null if no rules are met
   */
  evaluatePostConditionRules(activity: Activity): RuleActionType | null {
    for (const rule of this._postConditionRules) {
      if (rule.evaluate(activity)) {
        return rule.action;
      }
    }
    return null;
  }

  /**
   * toJSON for SequencingRules
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      preConditionRules: this._preConditionRules,
      exitConditionRules: this._exitConditionRules,
      postConditionRules: this._postConditionRules,
    };
    this.jsonString = false;
    return result;
  }
}
