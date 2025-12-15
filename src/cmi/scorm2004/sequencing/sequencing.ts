import { BaseCMI } from "../../common/base_cmi";
import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingRules } from "./sequencing_rules";
import { SequencingControls } from "./sequencing_controls";
import { RollupRules } from "./rollup_rules";
import { ADLNav } from "../adl";
import { Scorm2004ValidationError } from "../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../constants/error_codes";
import { AuxiliaryResource, HideLmsUiItem } from "../../../types/sequencing_types";

// Forward declaration to avoid circular dependency
 
type OverallSequencingProcessType = any;

/**
 * Class representing SCORM 2004 sequencing
 */
export class Sequencing extends BaseCMI {
  private _activityTree: ActivityTree;
  private _sequencingRules: SequencingRules;
  private _sequencingControls: SequencingControls;
  private _rollupRules: RollupRules;
  private _adlNav: ADLNav | null = null;
  private _hideLmsUi: HideLmsUiItem[] = [];
  private _auxiliaryResources: AuxiliaryResource[] = [];
  private _overallSequencingProcess: OverallSequencingProcessType | null = null;

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
    this._hideLmsUi = [];
    this._auxiliaryResources = [];
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

  get hideLmsUi(): HideLmsUiItem[] {
    return [...this._hideLmsUi];
  }

  set hideLmsUi(items: HideLmsUiItem[]) {
    this._hideLmsUi = [...items];
  }

  get auxiliaryResources(): AuxiliaryResource[] {
    return this._auxiliaryResources.map((resource) => ({ ...resource }));
  }

  set auxiliaryResources(resources: AuxiliaryResource[]) {
    this._auxiliaryResources = resources.map((resource) => ({ ...resource }));
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

  }

  /**
   * Getter for overallSequencingProcess
   * @return {any | null}
   */
  get overallSequencingProcess(): OverallSequencingProcessType | null {
    return this._overallSequencingProcess;
  }

  /**
   * Setter for overallSequencingProcess
   * @param {any | null} process
   */
  set overallSequencingProcess(process: OverallSequencingProcessType | null) {
    this._overallSequencingProcess = process;
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
