import {BaseCMI} from "../../common/base_cmi";
import {Activity} from "./activity";
import {Scorm2004ValidationError} from "../../../exceptions/scorm2004_exceptions";
import {scorm2004_errors} from "../../../constants/error_codes";
import {CompletionStatus, SuccessStatus} from "../../../constants/enums";

/**
 * Enum for rollup action types
 */
export enum RollupActionType {
  SATISFIED = "satisfied",
  NOT_SATISFIED = "notSatisfied",
  COMPLETED = "completed",
  INCOMPLETE = "incomplete",
}

/**
 * Enum for rollup condition types
 */
export enum RollupConditionType {
  SATISFIED = "satisfied",
  OBJECTIVE_STATUS_KNOWN = "objectiveStatusKnown",
  OBJECTIVE_MEASURE_KNOWN = "objectiveMeasureKnown",
  OBJECTIVE_MEASURE_GREATER_THAN = "objectiveMeasureGreaterThan",
  OBJECTIVE_MEASURE_LESS_THAN = "objectiveMeasureLessThan",
  COMPLETED = "completed",
  PROGRESS_KNOWN = "progressKnown",
  ATTEMPTED = "attempted",
  NOT_ATTEMPTED = "notAttempted",
  ALWAYS = "always",
}

/**
 * Enum for rollup consideration types
 */
export enum RollupConsiderationType {
  ALL = "all",
  ANY = "any",
  NONE = "none",
  AT_LEAST_COUNT = "atLeastCount",
  AT_LEAST_PERCENT = "atLeastPercent",
}

/**
 * Class representing a rollup condition
 */
export class RollupCondition extends BaseCMI {
  private _condition: RollupConditionType = RollupConditionType.ALWAYS;
  private _parameters: Map<string, any> = new Map();

  /**
   * Constructor for RollupCondition
   * @param {RollupConditionType} condition - The condition type
   * @param {Map<string, any>} parameters - Additional parameters for the condition
   */
  constructor(
    condition: RollupConditionType = RollupConditionType.ALWAYS,
    parameters: Map<string, any> = new Map(),
  ) {
    super("rollupCondition");
    this._condition = condition;
    this._parameters = parameters;
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
  }

  /**
   * Getter for condition
   * @return {RollupConditionType}
   */
  get condition(): RollupConditionType {
    return this._condition;
  }

  /**
   * Setter for condition
   * @param {RollupConditionType} condition
   */
  set condition(condition: RollupConditionType) {
    this._condition = condition;
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
    switch (this._condition) {
      case RollupConditionType.SATISFIED:
        return activity.successStatus === SuccessStatus.PASSED;
      case RollupConditionType.OBJECTIVE_STATUS_KNOWN:
        return activity.objectiveMeasureStatus;
      case RollupConditionType.OBJECTIVE_MEASURE_KNOWN:
        return activity.objectiveMeasureStatus;
      case RollupConditionType.OBJECTIVE_MEASURE_GREATER_THAN: {
        const greaterThanValue = this._parameters.get("threshold") || 0;
        return (
          activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure > greaterThanValue
        );
      }
      case RollupConditionType.OBJECTIVE_MEASURE_LESS_THAN: {
        const lessThanValue = this._parameters.get("threshold") || 0;
        return (
          activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure < lessThanValue
        );
      }
      case RollupConditionType.COMPLETED:
        return activity.isCompleted;
      case RollupConditionType.PROGRESS_KNOWN:
        return activity.completionStatus !== CompletionStatus.UNKNOWN;
      case RollupConditionType.ATTEMPTED:
        return activity.attemptCount > 0;
      case RollupConditionType.NOT_ATTEMPTED:
        return activity.attemptCount === 0;
      case RollupConditionType.ALWAYS:
        return true;
      default:
        return false;
    }
  }

  /**
   * toJSON for RollupCondition
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      condition: this._condition,
      parameters: Object.fromEntries(this._parameters),
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing a rollup rule
 */
export class RollupRule extends BaseCMI {
  private _conditions: RollupCondition[] = [];
  private _action: RollupActionType = RollupActionType.SATISFIED;
  private _consideration: RollupConsiderationType = RollupConsiderationType.ALL;
  private _minimumCount: number = 0;
  private _minimumPercent: number = 0;

  /**
   * Constructor for RollupRule
   * @param {RollupActionType} action - The action to take when the rule conditions are met
   * @param {RollupConsiderationType} consideration - How to consider child activities
   * @param {number} minimumCount - The minimum count for AT_LEAST_COUNT consideration
   * @param {number} minimumPercent - The minimum percent for AT_LEAST_PERCENT consideration
   */
  constructor(
    action: RollupActionType = RollupActionType.SATISFIED,
    consideration: RollupConsiderationType = RollupConsiderationType.ALL,
    minimumCount: number = 0,
    minimumPercent: number = 0,
  ) {
    super("rollupRule");
    this._action = action;
    this._consideration = consideration;
    this._minimumCount = minimumCount;
    this._minimumPercent = minimumPercent;
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._conditions = [];
  }

  /**
   * Getter for conditions
   * @return {RollupCondition[]}
   */
  get conditions(): RollupCondition[] {
    return this._conditions;
  }

  /**
   * Add a condition to the rule
   * @param {RollupCondition} condition - The condition to add
   */
  addCondition(condition: RollupCondition): void {
    if (!(condition instanceof RollupCondition)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".conditions",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._conditions.push(condition);
  }

  /**
   * Remove a condition from the rule
   * @param {RollupCondition} condition - The condition to remove
   * @return {boolean} - True if the condition was removed, false otherwise
   */
  removeCondition(condition: RollupCondition): boolean {
    const index = this._conditions.indexOf(condition);
    if (index !== -1) {
      this._conditions.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Getter for action
   * @return {RollupActionType}
   */
  get action(): RollupActionType {
    return this._action;
  }

  /**
   * Setter for action
   * @param {RollupActionType} action
   */
  set action(action: RollupActionType) {
    this._action = action;
  }

  /**
   * Getter for consideration
   * @return {RollupConsiderationType}
   */
  get consideration(): RollupConsiderationType {
    return this._consideration;
  }

  /**
   * Setter for consideration
   * @param {RollupConsiderationType} consideration
   */
  set consideration(consideration: RollupConsiderationType) {
    this._consideration = consideration;
  }

  /**
   * Getter for minimumCount
   * @return {number}
   */
  get minimumCount(): number {
    return this._minimumCount;
  }

  /**
   * Setter for minimumCount
   * @param {number} minimumCount
   */
  set minimumCount(minimumCount: number) {
    if (minimumCount >= 0) {
      this._minimumCount = minimumCount;
    }
  }

  /**
   * Getter for minimumPercent
   * @return {number}
   */
  get minimumPercent(): number {
    return this._minimumPercent;
  }

  /**
   * Setter for minimumPercent
   * @param {number} minimumPercent
   */
  set minimumPercent(minimumPercent: number) {
    if (minimumPercent >= 0 && minimumPercent <= 100) {
      this._minimumPercent = minimumPercent;
    }
  }

  /**
   * Evaluate the rule for a set of child activities
   * @param {Activity[]} children - The child activities to evaluate the rule for
   * @return {boolean} - True if the rule conditions are met, false otherwise
   */
  evaluate(children: Activity[]): boolean {
    if (children.length === 0) {
      return false;
    }

    // Filter children that meet all conditions
    const matchingChildren = children.filter((child) => {
      return this._conditions.every((condition) => condition.evaluate(child));
    });

    // Apply consideration
    switch (this._consideration) {
      case RollupConsiderationType.ALL:
        return matchingChildren.length === children.length;
      case RollupConsiderationType.ANY:
        return matchingChildren.length > 0;
      case RollupConsiderationType.NONE:
        return matchingChildren.length === 0;
      case RollupConsiderationType.AT_LEAST_COUNT:
        return matchingChildren.length >= this._minimumCount;
      case RollupConsiderationType.AT_LEAST_PERCENT: {
        const percent = (matchingChildren.length / children.length) * 100;
        return percent >= this._minimumPercent;
      }
      default:
        return false;
    }
  }

  /**
   * toJSON for RollupRule
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      conditions: this._conditions,
      action: this._action,
      consideration: this._consideration,
      minimumCount: this._minimumCount,
      minimumPercent: this._minimumPercent,
    };
    delete this.jsonString;
    return result;
  }
}

/**
 * Class representing a collection of rollup rules
 */
export class RollupRules extends BaseCMI {
  private _rules: RollupRule[] = [];

  /**
   * Constructor for RollupRules
   */
  constructor() {
    super("rollupRules");
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._rules = [];
  }

  /**
   * Getter for rules
   * @return {RollupRule[]}
   */
  get rules(): RollupRule[] {
    return this._rules;
  }

  /**
   * Add a rule
   * @param {RollupRule} rule - The rule to add
   */
  addRule(rule: RollupRule): void {
    if (!(rule instanceof RollupRule)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".rules",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._rules.push(rule);
  }

  /**
   * Remove a rule
   * @param {RollupRule} rule - The rule to remove
   * @return {boolean} - True if the rule was removed, false otherwise
   */
  removeRule(rule: RollupRule): boolean {
    const index = this._rules.indexOf(rule);
    if (index !== -1) {
      this._rules.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Process rollup for an activity
   * @param {Activity} activity - The activity to process rollup for
   */
  processRollup(activity: Activity): void {
    if (!activity || activity.children.length === 0) {
      return;
    }

    const children = activity.children;
    let completionRollup = false;
    let successRollup = false;

    // Process each rule
    for (const rule of this._rules) {
      if (rule.evaluate(children)) {
        switch (rule.action) {
          case RollupActionType.SATISFIED:
            activity.successStatus = SuccessStatus.PASSED;
            successRollup = true;
            break;
          case RollupActionType.NOT_SATISFIED:
            activity.successStatus = SuccessStatus.FAILED;
            successRollup = true;
            break;
          case RollupActionType.COMPLETED:
            activity.completionStatus = CompletionStatus.COMPLETED;
            activity.isCompleted = true;
            completionRollup = true;
            break;
          case RollupActionType.INCOMPLETE:
            activity.completionStatus = CompletionStatus.INCOMPLETE;
            activity.isCompleted = false;
            completionRollup = true;
            break;
        }
      }
    }

    // If no rules applied for completion, use default rollup
    if (!completionRollup) {
      this._defaultCompletionRollup(activity, children);
    }

    // If no rules applied for success, use default rollup
    if (!successRollup) {
      this._defaultSuccessRollup(activity, children);
    }
  }

  /**
   * Default completion rollup
   * @param {Activity} activity - The activity to process rollup for
   * @param {Activity[]} children - The child activities
   * @private
   */
  private _defaultCompletionRollup(activity: Activity, children: Activity[]): void {
    // If all children are completed, mark the parent as completed
    const allCompleted = children.every((child) => child.isCompleted);
    if (allCompleted) {
      activity.completionStatus = CompletionStatus.COMPLETED;
      activity.isCompleted = true;
    } else {
      // If any child is incomplete, mark the parent as incomplete
      const anyIncomplete = children.some(
        (child) => child.completionStatus === CompletionStatus.INCOMPLETE,
      );
      if (anyIncomplete) {
        activity.completionStatus = CompletionStatus.INCOMPLETE;
        activity.isCompleted = false;
      }
    }
  }

  /**
   * Default success rollup
   * @param {Activity} activity - The activity to process rollup for
   * @param {Activity[]} children - The child activities
   * @private
   */
  private _defaultSuccessRollup(activity: Activity, children: Activity[]): void {
    // If all children are satisfied, mark the parent as satisfied
    const allSatisfied = children.every((child) => child.successStatus === SuccessStatus.PASSED);
    if (allSatisfied) {
      activity.successStatus = SuccessStatus.PASSED;
    } else {
      // If any child is not satisfied, mark the parent as not satisfied
      const anyNotSatisfied = children.some(
        (child) => child.successStatus === SuccessStatus.FAILED,
      );
      if (anyNotSatisfied) {
        activity.successStatus = SuccessStatus.FAILED;
      }
    }
  }

  /**
   * toJSON for RollupRules
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      rules: this._rules,
    };
    delete this.jsonString;
    return result;
  }
}
