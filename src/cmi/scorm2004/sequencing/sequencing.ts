import { BaseCMI } from "../../common/base_cmi";
import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { RuleActionType, SequencingRules } from "./sequencing_rules";
import { SequencingControls } from "./sequencing_controls";
import { RollupRules } from "./rollup_rules";
import { ADLNav } from "../adl";
import { Scorm2004ValidationError } from "../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../constants/error_codes";

/**
 * Class representing SCORM 2004 sequencing
 */
export class Sequencing extends BaseCMI {
  private _activityTree: ActivityTree;
  private _sequencingRules: SequencingRules;
  private _sequencingControls: SequencingControls;
  private _rollupRules: RollupRules;
  private _adlNav: ADLNav | null = null;

  /**
   * Constructor for Sequencing
   */
  constructor() {
    super("sequencing");
    this._activityTree = new ActivityTree();
    this._sequencingRules = new SequencingRules();
    this._sequencingControls = new SequencingControls();
    this._rollupRules = new RollupRules();
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this._activityTree.initialize();
    this._sequencingRules.initialize();
    this._sequencingControls.initialize();
    this._rollupRules.initialize();
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._activityTree.reset();
    this._sequencingRules.reset();
    this._sequencingControls.reset();
    this._rollupRules.reset();
  }

  /**
   * Getter for activityTree
   * @return {ActivityTree}
   */
  get activityTree(): ActivityTree {
    return this._activityTree;
  }

  /**
   * Setter for activityTree
   * @param {ActivityTree} activityTree
   */
  set activityTree(activityTree: ActivityTree) {
    if (!(activityTree instanceof ActivityTree)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".activityTree",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._activityTree = activityTree;
  }

  /**
   * Getter for sequencingRules
   * @return {SequencingRules}
   */
  get sequencingRules(): SequencingRules {
    return this._sequencingRules;
  }

  /**
   * Setter for sequencingRules
   * @param {SequencingRules} sequencingRules
   */
  set sequencingRules(sequencingRules: SequencingRules) {
    if (!(sequencingRules instanceof SequencingRules)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".sequencingRules",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._sequencingRules = sequencingRules;
  }

  /**
   * Getter for sequencingControls
   * @return {SequencingControls}
   */
  get sequencingControls(): SequencingControls {
    return this._sequencingControls;
  }

  /**
   * Setter for sequencingControls
   * @param {SequencingControls} sequencingControls
   */
  set sequencingControls(sequencingControls: SequencingControls) {
    if (!(sequencingControls instanceof SequencingControls)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".sequencingControls",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._sequencingControls = sequencingControls;
  }

  /**
   * Getter for rollupRules
   * @return {RollupRules}
   */
  get rollupRules(): RollupRules {
    return this._rollupRules;
  }

  /**
   * Setter for rollupRules
   * @param {RollupRules} rollupRules
   */
  set rollupRules(rollupRules: RollupRules) {
    if (!(rollupRules instanceof RollupRules)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".rollupRules",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._rollupRules = rollupRules;
  }

  /**
   * Getter for adlNav
   * @return {ADLNav | null}
   */
  get adlNav(): ADLNav | null {
    return this._adlNav;
  }

  /**
   * Setter for adlNav
   * @param {ADLNav | null} adlNav
   */
  set adlNav(adlNav: ADLNav | null) {
    this._adlNav = adlNav;
  }

  /**
   * Process navigation request
   * @param {string} request - The navigation request
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processNavigationRequest(request: string): boolean {
    if (!this._adlNav) {
      return false;
    }

    // Set the navigation request
    this._adlNav.request = request;

    // Get the current activity
    const currentActivity = this._activityTree.currentActivity;
    if (!currentActivity) {
      return false;
    }

    // Evaluate pre-condition rules
    const preConditionAction = this._sequencingRules.evaluatePreConditionRules(currentActivity);
    if (preConditionAction) {
      // Handle pre-condition action
      switch (preConditionAction) {
        case RuleActionType.SKIP:
          // Skip this activity
          return false;
        case RuleActionType.DISABLED:
          // Disable this activity
          return false;
        case RuleActionType.HIDE_FROM_CHOICE:
          // Hide this activity from choice
          return false;
        case RuleActionType.STOP_FORWARD_TRAVERSAL:
          // Stop forward traversal
          return false;
        default:
          break;
      }
    }

    // Process the navigation request based on the request type
    switch (request) {
      case "continue":
        return this.processContinueRequest(currentActivity);
      case "previous":
        return this.processPreviousRequest(currentActivity);
      case "choice":
        // Choice navigation would require additional parameters
        return false;
      case "exit":
        return this.processExitRequest(currentActivity);
      case "exitAll":
        return this.processExitAllRequest();
      case "abandon":
        return this.processAbandonRequest(currentActivity);
      case "abandonAll":
        return this.processAbandonAllRequest();
      case "suspendAll":
        return this.processSuspendAllRequest(currentActivity);
      case "resumeAll":
        return this.processResumeAllRequest();
      default:
        return false;
    }
  }

  /**
   * Process continue request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processContinueRequest(currentActivity: Activity): boolean {
    // Check if continue is allowed
    if (!this._sequencingControls.isForwardNavigationAllowed()) {
      return false;
    }

    // Get the next activity
    const nextActivity = this._activityTree.getNextSibling(currentActivity);
    if (!nextActivity) {
      return false;
    }

    // Evaluate exit condition rules
    const exitConditionAction = this._sequencingRules.evaluateExitConditionRules(currentActivity);
    if (exitConditionAction) {
      // Handle exit condition action
      switch (exitConditionAction) {
        case RuleActionType.EXIT_PARENT: {
          // Exit to parent
          const parent = currentActivity.parent;
          if (parent) {
            this._activityTree.currentActivity = parent;
            return true;
          }
          return false;
        }
        case RuleActionType.EXIT_ALL:
          // Exit all
          this._activityTree.currentActivity = null;
          return true;
        default:
          break;
      }
    }

    // Set the next activity as current
    this._activityTree.currentActivity = nextActivity;

    // Evaluate post-condition rules
    const postConditionAction = this._sequencingRules.evaluatePostConditionRules(nextActivity);
    if (postConditionAction) {
      // Handle post-condition action
      switch (postConditionAction) {
        case RuleActionType.RETRY:
          // Retry this activity
          nextActivity.incrementAttemptCount();
          return true;
        case RuleActionType.RETRY_ALL:
          // Retry all activities
          this._activityTree.getAllActivities().forEach((activity) => {
            activity.incrementAttemptCount();
          });
          return true;
        case RuleActionType.CONTINUE:
          // Continue to next activity
          return this.processContinueRequest(nextActivity);
        case RuleActionType.PREVIOUS:
          // Go to previous activity
          return this.processPreviousRequest(nextActivity);
        case RuleActionType.EXIT:
          // Exit this activity
          this._activityTree.currentActivity = currentActivity;
          return true;
        default:
          break;
      }
    }

    return true;
  }

  /**
   * Process previous request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processPreviousRequest(currentActivity: Activity): boolean {
    // Check if backward navigation is allowed
    if (!this._sequencingControls.isBackwardNavigationAllowed()) {
      return false;
    }

    // Get the previous activity
    const previousActivity = this._activityTree.getPreviousSibling(currentActivity);
    if (!previousActivity) {
      return false;
    }

    // Evaluate exit condition rules
    const exitConditionAction = this._sequencingRules.evaluateExitConditionRules(currentActivity);
    if (exitConditionAction) {
      // Handle exit condition action
      switch (exitConditionAction) {
        case RuleActionType.EXIT_PARENT: {
          // Exit to parent
          const parent = currentActivity.parent;
          if (parent) {
            this._activityTree.currentActivity = parent;
            return true;
          }
          return false;
        }
        case RuleActionType.EXIT_ALL:
          // Exit all
          this._activityTree.currentActivity = null;
          return true;
        default:
          break;
      }
    }

    // Set the previous activity as current
    this._activityTree.currentActivity = previousActivity;

    // Evaluate post-condition rules
    const postConditionAction = this._sequencingRules.evaluatePostConditionRules(previousActivity);
    if (postConditionAction) {
      // Handle post-condition action
      switch (postConditionAction) {
        case RuleActionType.RETRY:
          // Retry this activity
          previousActivity.incrementAttemptCount();
          return true;
        case RuleActionType.RETRY_ALL:
          // Retry all activities
          this._activityTree.getAllActivities().forEach((activity) => {
            activity.incrementAttemptCount();
          });
          return true;
        case RuleActionType.CONTINUE:
          // Continue to next activity
          return this.processContinueRequest(previousActivity);
        case RuleActionType.PREVIOUS:
          // Go to previous activity
          return this.processPreviousRequest(previousActivity);
        case RuleActionType.EXIT:
          // Exit this activity
          this._activityTree.currentActivity = currentActivity;
          return true;
        default:
          break;
      }
    }

    return true;
  }

  /**
   * Process exit request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processExitRequest(currentActivity: Activity): boolean {
    // Check if exit is allowed
    if (!this._sequencingControls.choiceExit) {
      return false;
    }

    // Get the parent activity
    const parent = currentActivity.parent;
    if (!parent) {
      return false;
    }

    // Set the parent activity as current
    this._activityTree.currentActivity = parent;

    return true;
  }

  /**
   * Process exit all request
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processExitAllRequest(): boolean {
    // Check if exit is allowed
    if (!this._sequencingControls.choiceExit) {
      return false;
    }

    // Set no activity as current
    this._activityTree.currentActivity = null;

    return true;
  }

  /**
   * Process abandon request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processAbandonRequest(currentActivity: Activity): boolean {
    // Get the parent activity
    const parent = currentActivity.parent;
    if (!parent) {
      return false;
    }

    // Set the parent activity as current without processing exit rules
    this._activityTree.currentActivity = parent;

    return true;
  }

  /**
   * Process abandon all request
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processAbandonAllRequest(): boolean {
    // Set no activity as current without processing exit rules
    this._activityTree.currentActivity = null;

    return true;
  }

  /**
   * Process suspend all request
   * @param {Activity} currentActivity - The current activity
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processSuspendAllRequest(currentActivity: Activity): boolean {
    // Set the current activity as suspended
    this._activityTree.suspendedActivity = currentActivity;
    this._activityTree.currentActivity = null;

    return true;
  }

  /**
   * Process resume all request
   * @return {boolean} - True if the request is valid, false otherwise
   */
  processResumeAllRequest(): boolean {
    // Get the suspended activity
    const suspendedActivity = this._activityTree.suspendedActivity;
    if (!suspendedActivity) {
      return false;
    }

    // Set the suspended activity as current
    this._activityTree.currentActivity = suspendedActivity;
    this._activityTree.suspendedActivity = null;

    return true;
  }

  /**
   * Process rollup for the entire activity tree
   */
  processRollup(): void {
    // Get the root activity
    const root = this._activityTree.root;
    if (!root) {
      return;
    }

    // Process rollup from the bottom up
    this._processRollupRecursive(root);
  }

  /**
   * Process rollup recursively
   * @param {Activity} activity - The activity to process rollup for
   * @private
   */
  private _processRollupRecursive(activity: Activity): void {
    // Process rollup for children first
    for (const child of activity.children) {
      this._processRollupRecursive(child);
    }

    // Process rollup for this activity
    this._rollupRules.processRollup(activity);
  }

  /**
   * toJSON for Sequencing
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      activityTree: this._activityTree,
      sequencingRules: this._sequencingRules,
      sequencingControls: this._sequencingControls,
      rollupRules: this._rollupRules,
    };
    delete this.jsonString;
    return result;
  }
}
