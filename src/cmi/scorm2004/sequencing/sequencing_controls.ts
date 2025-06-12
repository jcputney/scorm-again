import { BaseCMI } from "../../common/base_cmi";

/**
 * Class representing SCORM 2004 sequencing controls
 */
export class SequencingControls extends BaseCMI {
  // Sequencing Control Modes
  private _enabled: boolean = true;
  private _choice: boolean = true;
  private _choiceExit: boolean = true;
  private _flow: boolean = false;
  private _forwardOnly: boolean = false;
  private _useCurrentAttemptObjectiveInfo: boolean = true;
  private _useCurrentAttemptProgressInfo: boolean = true;

  // Constrain Choice Controls
  private _preventActivation: boolean = false;
  private _constrainChoice: boolean = false;

  // Rollup Controls
  private _rollupObjectiveSatisfied: boolean = true;
  private _rollupProgressCompletion: boolean = true;
  private _objectiveMeasureWeight: number = 1.0;

  /**
   * Constructor for SequencingControls
   */
  constructor() {
    super("sequencingControls");
  }

  /**
   * Reset the sequencing controls to their default values
   */
  reset() {
    this._initialized = false;
    this._enabled = true;
    this._choice = true;
    this._choiceExit = true;
    this._flow = false;
    this._forwardOnly = false;
    this._useCurrentAttemptObjectiveInfo = true;
    this._useCurrentAttemptProgressInfo = true;
    this._preventActivation = false;
    this._constrainChoice = false;
    this._rollupObjectiveSatisfied = true;
    this._rollupProgressCompletion = true;
    this._objectiveMeasureWeight = 1.0;
  }

  /**
   * Getter for enabled
   * @return {boolean}
   */
  get enabled(): boolean {
    return this._enabled;
  }

  /**
   * Setter for enabled
   * @param {boolean} enabled
   */
  set enabled(enabled: boolean) {
    this._enabled = enabled;
  }

  /**
   * Getter for choice
   * @return {boolean}
   */
  get choice(): boolean {
    return this._choice;
  }

  /**
   * Setter for choice
   * @param {boolean} choice
   */
  set choice(choice: boolean) {
    this._choice = choice;
  }

  /**
   * Getter for choiceExit
   * @return {boolean}
   */
  get choiceExit(): boolean {
    return this._choiceExit;
  }

  /**
   * Setter for choiceExit
   * @param {boolean} choiceExit
   */
  set choiceExit(choiceExit: boolean) {
    this._choiceExit = choiceExit;
  }

  /**
   * Getter for flow
   * @return {boolean}
   */
  get flow(): boolean {
    return this._flow;
  }

  /**
   * Setter for flow
   * @param {boolean} flow
   */
  set flow(flow: boolean) {
    this._flow = flow;
  }

  /**
   * Getter for forwardOnly
   * @return {boolean}
   */
  get forwardOnly(): boolean {
    return this._forwardOnly;
  }

  /**
   * Setter for forwardOnly
   * @param {boolean} forwardOnly
   */
  set forwardOnly(forwardOnly: boolean) {
    this._forwardOnly = forwardOnly;
  }

  /**
   * Getter for useCurrentAttemptObjectiveInfo
   * @return {boolean}
   */
  get useCurrentAttemptObjectiveInfo(): boolean {
    return this._useCurrentAttemptObjectiveInfo;
  }

  /**
   * Setter for useCurrentAttemptObjectiveInfo
   * @param {boolean} useCurrentAttemptObjectiveInfo
   */
  set useCurrentAttemptObjectiveInfo(useCurrentAttemptObjectiveInfo: boolean) {
    this._useCurrentAttemptObjectiveInfo = useCurrentAttemptObjectiveInfo;
  }

  /**
   * Getter for useCurrentAttemptProgressInfo
   * @return {boolean}
   */
  get useCurrentAttemptProgressInfo(): boolean {
    return this._useCurrentAttemptProgressInfo;
  }

  /**
   * Setter for useCurrentAttemptProgressInfo
   * @param {boolean} useCurrentAttemptProgressInfo
   */
  set useCurrentAttemptProgressInfo(useCurrentAttemptProgressInfo: boolean) {
    this._useCurrentAttemptProgressInfo = useCurrentAttemptProgressInfo;
  }

  /**
   * Getter for preventActivation
   * @return {boolean}
   */
  get preventActivation(): boolean {
    return this._preventActivation;
  }

  /**
   * Setter for preventActivation
   * @param {boolean} preventActivation
   */
  set preventActivation(preventActivation: boolean) {
    this._preventActivation = preventActivation;
  }

  /**
   * Getter for constrainChoice
   * @return {boolean}
   */
  get constrainChoice(): boolean {
    return this._constrainChoice;
  }

  /**
   * Setter for constrainChoice
   * @param {boolean} constrainChoice
   */
  set constrainChoice(constrainChoice: boolean) {
    this._constrainChoice = constrainChoice;
  }

  /**
   * Getter for rollupObjectiveSatisfied
   * @return {boolean}
   */
  get rollupObjectiveSatisfied(): boolean {
    return this._rollupObjectiveSatisfied;
  }

  /**
   * Setter for rollupObjectiveSatisfied
   * @param {boolean} rollupObjectiveSatisfied
   */
  set rollupObjectiveSatisfied(rollupObjectiveSatisfied: boolean) {
    this._rollupObjectiveSatisfied = rollupObjectiveSatisfied;
  }

  /**
   * Getter for rollupProgressCompletion
   * @return {boolean}
   */
  get rollupProgressCompletion(): boolean {
    return this._rollupProgressCompletion;
  }

  /**
   * Setter for rollupProgressCompletion
   * @param {boolean} rollupProgressCompletion
   */
  set rollupProgressCompletion(rollupProgressCompletion: boolean) {
    this._rollupProgressCompletion = rollupProgressCompletion;
  }

  /**
   * Getter for objectiveMeasureWeight
   * @return {number}
   */
  get objectiveMeasureWeight(): number {
    return this._objectiveMeasureWeight;
  }

  /**
   * Setter for objectiveMeasureWeight
   * @param {number} objectiveMeasureWeight
   */
  set objectiveMeasureWeight(objectiveMeasureWeight: number) {
    if (objectiveMeasureWeight >= 0 && objectiveMeasureWeight <= 1) {
      this._objectiveMeasureWeight = objectiveMeasureWeight;
    }
  }

  /**
   * Check if choice navigation is allowed
   * @return {boolean} - True if choice navigation is allowed, false otherwise
   */
  isChoiceNavigationAllowed(): boolean {
    return this._enabled && !this._constrainChoice;
  }

  /**
   * Check if flow navigation is allowed
   * @return {boolean} - True if flow navigation is allowed, false otherwise
   */
  isFlowNavigationAllowed(): boolean {
    return this._enabled && this._flow;
  }

  /**
   * Check if forward navigation is allowed
   * @return {boolean} - True if forward navigation is allowed, false otherwise
   */
  isForwardNavigationAllowed(): boolean {
    // Forward navigation (Continue request) is only valid when flow mode is
    // enabled. The forwardOnly flag simply restricts backward navigation and
    // does not affect the ability to move forward when flow is disabled.
    return this._enabled && this._flow;
  }

  /**
   * Check if backward navigation is allowed
   * @return {boolean} - True if backward navigation is allowed, false otherwise
   */
  isBackwardNavigationAllowed(): boolean {
    // Previous navigation is also part of flow based navigation and should only
    // be permitted when flow mode is enabled and forwardOnly does not restrict
    // going backwards.
    return this._enabled && this._flow && !this._forwardOnly;
  }

  /**
   * toJSON for SequencingControls
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      enabled: this._enabled,
      choice: this._choice,
      choiceExit: this._choiceExit,
      flow: this._flow,
      forwardOnly: this._forwardOnly,
      useCurrentAttemptObjectiveInfo: this._useCurrentAttemptObjectiveInfo,
      useCurrentAttemptProgressInfo: this._useCurrentAttemptProgressInfo,
      preventActivation: this._preventActivation,
      constrainChoice: this._constrainChoice,
      rollupObjectiveSatisfied: this._rollupObjectiveSatisfied,
      rollupProgressCompletion: this._rollupProgressCompletion,
      objectiveMeasureWeight: this._objectiveMeasureWeight,
    };
    this.jsonString = false;
    return result;
  }
}
