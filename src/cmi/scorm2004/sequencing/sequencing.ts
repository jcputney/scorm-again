import { BaseCMI } from "../../common/base_cmi";
import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingRules } from "./sequencing_rules";
import { SequencingControls } from "./sequencing_controls";
import { RollupRules } from "./rollup_rules";
import { ADLNav } from "../adl";
import { Scorm2004ValidationError } from "../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../constants/error_codes";
import {
  SequencingProcess,
  SequencingRequestType,
  SequencingResult,
  DeliveryRequestType,
} from "./sequencing_process";

/**
 * Class representing SCORM 2004 sequencing
 */
export class Sequencing extends BaseCMI {
  private _activityTree: ActivityTree;
  private _sequencingRules: SequencingRules;
  private _sequencingControls: SequencingControls;
  private _rollupRules: RollupRules;
  private _adlNav: ADLNav | null = null;
  private _sequencingProcess: SequencingProcess | null = null;
  private _lastSequencingResult: SequencingResult | null = null;

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
    
    // Initialize sequencing process if ADL Nav is available
    if (this._adlNav) {
      this._sequencingProcess = new SequencingProcess(
        this._activityTree,
        this._sequencingRules,
        this._sequencingControls,
        this._adlNav,
      );
    }
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
    // noinspection SuspiciousTypeOfGuard
    if (!(activityTree instanceof ActivityTree)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".activityTree",
        scorm2004_errors.TYPE_MISMATCH as number,
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
    // noinspection SuspiciousTypeOfGuard
    if (!(sequencingRules instanceof SequencingRules)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".sequencingRules",
        scorm2004_errors.TYPE_MISMATCH as number,
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
    // noinspection SuspiciousTypeOfGuard
    if (!(sequencingControls instanceof SequencingControls)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".sequencingControls",
        scorm2004_errors.TYPE_MISMATCH as number,
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
    // noinspection SuspiciousTypeOfGuard
    if (!(rollupRules instanceof RollupRules)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".rollupRules",
        scorm2004_errors.TYPE_MISMATCH as number,
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
    
    // Update sequencing process with new ADL Nav
    if (adlNav) {
      this._sequencingProcess = new SequencingProcess(
        this._activityTree,
        this._sequencingRules,
        this._sequencingControls,
        adlNav,
      );
    }
  }

  /**
   * Get the last sequencing result
   * @return {SequencingResult | null}
   */
  get lastSequencingResult(): SequencingResult | null {
    return this._lastSequencingResult;
  }

  /**
   * Process navigation request using the new sequencing process
   * @param {string} request - The navigation request
   * @param {string | null} targetActivityId - Target activity ID for choice/jump requests
   * @return {boolean} - True if the request is valid and results in delivery, false otherwise
   */
  processNavigationRequest(request: string, targetActivityId: string | null = null): boolean {
    if (!this._sequencingProcess || !this._adlNav) {
      return false;
    }

    // Parse choice and jump requests to extract target
    if (request.includes("choice") && request.includes("{target=")) {
      const match = request.match(/\{target=([^}]+)\}/);
      if (match) {
        targetActivityId = match[1] || null;
        request = "choice";
      }
    } else if (request.includes("jump") && request.includes("{target=")) {
      const match = request.match(/\{target=([^}]+)\}/);
      if (match) {
        targetActivityId = match[1] || null;
        request = "jump";
      }
    }

    // Map string request to SequencingRequestType
    let requestType: SequencingRequestType;
    switch (request) {
      case "start":
        requestType = SequencingRequestType.START;
        break;
      case "resumeAll":
        requestType = SequencingRequestType.RESUME_ALL;
        break;
      case "continue":
        requestType = SequencingRequestType.CONTINUE;
        break;
      case "previous":
        requestType = SequencingRequestType.PREVIOUS;
        break;
      case "choice":
        requestType = SequencingRequestType.CHOICE;
        break;
      case "jump":
        requestType = SequencingRequestType.JUMP;
        break;
      case "exit":
        requestType = SequencingRequestType.EXIT;
        break;
      case "exitAll":
        requestType = SequencingRequestType.EXIT_ALL;
        break;
      case "abandon":
        requestType = SequencingRequestType.ABANDON;
        break;
      case "abandonAll":
        requestType = SequencingRequestType.ABANDON_ALL;
        break;
      case "suspendAll":
        requestType = SequencingRequestType.SUSPEND_ALL;
        break;
      case "retry":
        requestType = SequencingRequestType.RETRY;
        break;
      case "retryAll":
        requestType = SequencingRequestType.RETRY_ALL;
        break;
      default:
        return false;
    }

    // Process the sequencing request
    const result = this._sequencingProcess.sequencingRequestProcess(requestType, targetActivityId);
    this._lastSequencingResult = result;

    // Update navigation request validity
    if (result.exception) {
      // Don't modify _choice and _jump as they are target-specific objects
      // Note: These setters may throw if already initialized, but that's expected behavior
      try {
        this._adlNav.request_valid.continue = "false";
        this._adlNav.request_valid.previous = "false";
      } catch (e) {
        // Expected when already initialized - navigation validity is read-only after init
      }
      return false;
    }

    // Update navigation request validity based on current state
    this.updateNavigationRequestValidity();

    // Return true if delivery is requested
    return result.deliveryRequest === DeliveryRequestType.DELIVER;
  }

  /**
   * Update navigation request validity based on current state
   */
  private updateNavigationRequestValidity(): void {
    if (!this._adlNav || !this._sequencingProcess) {
      return;
    }

    // Check continue validity
    const continueResult = this._sequencingProcess.sequencingRequestProcess(
      SequencingRequestType.CONTINUE,
    );
    try {
      this._adlNav.request_valid.continue = !continueResult.exception ? "true" : "false";
    } catch (e) {
      // Expected when already initialized - navigation validity is read-only after init
    }

    // Check previous validity
    const previousResult = this._sequencingProcess.sequencingRequestProcess(
      SequencingRequestType.PREVIOUS,
    );
    try {
      this._adlNav.request_valid.previous = !previousResult.exception ? "true" : "false";
    } catch (e) {
      // Expected when already initialized - navigation validity is read-only after init
    }

    // Choice and jump are target-specific and handled separately
    // They are objects that map target IDs to NAVBoolean values
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
   * Get the last sequencing result
   * @return {SequencingResult | null}
   */
  getLastSequencingResult(): SequencingResult | null {
    return this._lastSequencingResult;
  }

  /**
   * Get the current activity
   * @return {Activity | null}
   */
  getCurrentActivity(): Activity | null {
    return this._activityTree.currentActivity;
  }

  /**
   * Get the root activity
   * @return {Activity | null}
   */
  getRootActivity(): Activity | null {
    return this._activityTree.root;
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
      adlNav: this._adlNav,
    };
    this.jsonString = false;
    return result;
  }
}
