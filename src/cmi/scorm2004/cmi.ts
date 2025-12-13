import { BaseRootCMI } from "../common/base_cmi";
import { CMILearnerPreference } from "./learner_preference";
import { CMIInteractions } from "./interactions";
import { Scorm2004CMIScore } from "./score";
import { CMICommentsFromLearner, CMICommentsFromLMS } from "./comments";
import { CMIObjectives } from "./objectives";
import { CMIMetadata } from "./metadata";
import { CMILearner } from "./learner";
import { CMIStatus } from "./status";
import { CMISession } from "./session";
import { CMIContent } from "./content";
import { CMISettings } from "./settings";
import { CMIThresholds } from "./thresholds";

/**
 * Class representing cmi object for SCORM 2004
 *
 * Per SCORM 2004 RTE Section 4.1:
 * - Enhanced data model with additional elements vs SCORM 1.2
 * - Separate completion_status and success_status tracking
 * - Progress measure (0-1 scale) for completion tracking
 * - Scaled scores (-1 to 1) with threshold support
 * - Language support via LangString types
 * - Comments from learner and LMS with timestamps
 * - Enhanced interactions with better type validation
 * - Global objectives support for cross-SCO tracking
 *
 * @extends BaseRootCMI
 */
export class CMI extends BaseRootCMI {
  /**
   * Constructor for the SCORM 2004 cmi object
   * @param {boolean} initialized
   */
  constructor(initialized: boolean = false) {
    super("cmi");
    this.metadata = new CMIMetadata();
    this.learner = new CMILearner();
    this.status = new CMIStatus();
    this.session = new CMISession();
    this.content = new CMIContent();
    this.settings = new CMISettings();
    this.thresholds = new CMIThresholds();
    this.learner_preference = new CMILearnerPreference();
    this.score = new Scorm2004CMIScore();
    this.comments_from_learner = new CMICommentsFromLearner();
    this.comments_from_lms = new CMICommentsFromLMS();
    this.interactions = new CMIInteractions();
    this.objectives = new CMIObjectives();
    if (initialized) this.initialize();
  }

  // New component classes
  private metadata: CMIMetadata;
  private learner: CMILearner;
  private status: CMIStatus;
  private session: CMISession;
  private content: CMIContent;
  private settings: CMISettings;
  private thresholds: CMIThresholds;

  // Original complex objects
  public learner_preference: CMILearnerPreference;
  public score: Scorm2004CMIScore;
  public comments_from_learner: CMICommentsFromLearner;
  public comments_from_lms: CMICommentsFromLMS;
  public interactions: CMIInteractions;
  public objectives: CMIObjectives;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    // Initialize new component classes
    this.metadata?.initialize();
    this.learner?.initialize();
    this.status?.initialize();
    this.session?.initialize();
    this.content?.initialize();
    this.settings?.initialize();
    this.thresholds?.initialize();

    // Initialize original complex objects
    this.learner_preference?.initialize();
    this.score?.initialize();
    this.comments_from_learner?.initialize();
    this.comments_from_lms?.initialize();
    this.interactions?.initialize();
    this.objectives?.initialize();
  }

  /**
   * Called when API is moving to another SCO
   * 
   * Resets SCO-specific CMI data while preserving global objectives.
   * 
   * The objectives.reset(false) call resets individual objective objects
   * but maintains the array structure. Global objectives stored in
   * Scorm2004API._globalObjectives are preserved separately and are not
   * affected by this reset.
   * 
   * This aligns with SCORM 2004 Sequencing and Navigation (SN) Book:
   * - Content Delivery Environment Process (DB.2) requires reset between SCOs
   * - Global objectives (via mapInfo) must persist across SCO transitions
   * - SCO-specific data (location, entry, session, interactions) must be reset
   */
  reset() {
    this._initialized = false;

    // Reset new component classes
    this.metadata?.reset();
    this.learner?.reset();
    this.status?.reset();
    this.session?.reset();
    this.content?.reset();
    this.settings?.reset();
    this.thresholds?.reset();

    // Reset original complex objects
    // objectives.reset(false) - false means keep array structure, reset individual objectives
    // This allows global objectives to persist while SCO-specific objectives are reset
    this.objectives?.reset(false);
    this.interactions?.reset(true);
    this.score?.reset();
    this.comments_from_learner?.reset();
    this.comments_from_lms?.reset();
    this.learner_preference?.reset();
  }

  /**
   * Getter for __version
   * @return {string}
   * @private
   */
  get _version(): string {
    return this.metadata._version;
  }

  /**
   * Setter for __version. Just throws an error.
   * @param {string} _version
   * @private
   */
  set _version(_version: string) {
    this.metadata._version = _version;
  }

  /**
   * Getter for __children
   * @return {string}
   * @private
   */
  get _children(): string {
    return this.metadata._children;
  }

  /**
   * Setter for __children. Just throws an error.
   * @param {number} _children
   * @private
   */
  set _children(_children: number) {
    this.metadata._children = _children;
  }

  /**
   * Getter for _completion_status
   * @return {string}
   */
  get completion_status(): string {
    return this.status.completion_status;
  }

  /**
   * Setter for _completion_status
   * @param {string} completion_status
   */
  set completion_status(completion_status: string) {
    this.status.completion_status = completion_status;
  }

  /**
   * Getter for _completion_threshold
   * @return {string}
   */
  get completion_threshold(): string {
    return this.thresholds.completion_threshold;
  }

  /**
   * Setter for _completion_threshold. Can only be called before initialization.
   * @param {string} completion_threshold
   */
  set completion_threshold(completion_threshold: string) {
    this.thresholds.completion_threshold = completion_threshold;
  }

  /**
   * Getter for _credit
   * @return {string}
   */
  get credit(): string {
    return this.settings.credit;
  }

  /**
   * Setter for _credit. Can only be called before initialization.
   * @param {string} credit
   */
  set credit(credit: string) {
    this.settings.credit = credit;
  }

  /**
   * Getter for _entry
   * @return {string}
   */
  get entry(): string {
    return this.session.entry;
  }

  /**
   * Setter for _entry. Can only be called before initialization.
   * @param {string} entry
   */
  set entry(entry: string) {
    this.session.entry = entry;
  }

  /**
   * Getter for _exit. Should only be called during JSON export.
   * @return {string}
   */
  get exit(): string {
    this.session.jsonString = this.jsonString;
    return this.session.exit;
  }

  /**
   * Setter for _exit
   * @param {string} exit
   */
  set exit(exit: string) {
    this.session.exit = exit;
  }

  /**
   * Getter for _launch_data
   * @return {string}
   */
  get launch_data(): string {
    return this.content.launch_data;
  }

  /**
   * Setter for _launch_data. Can only be called before initialization.
   * @param {string} launch_data
   */
  set launch_data(launch_data: string) {
    this.content.launch_data = launch_data;
  }

  /**
   * Getter for _learner_id
   * @return {string}
   */
  get learner_id(): string {
    return this.learner.learner_id;
  }

  /**
   * Setter for _learner_id. Can only be called before initialization.
   * @param {string} learner_id
   */
  set learner_id(learner_id: string) {
    this.learner.learner_id = learner_id;
  }

  /**
   * Getter for _learner_name
   * @return {string}
   */
  get learner_name(): string {
    return this.learner.learner_name;
  }

  /**
   * Setter for _learner_name. Can only be called before initialization.
   * @param {string} learner_name
   */
  set learner_name(learner_name: string) {
    this.learner.learner_name = learner_name;
  }

  /**
   * Getter for _location
   * @return {string}
   */
  get location(): string {
    return this.content.location;
  }

  /**
   * Setter for _location
   * @param {string} location
   */
  set location(location: string) {
    this.content.location = location;
  }

  /**
   * Getter for _max_time_allowed
   * @return {string}
   */
  get max_time_allowed(): string {
    return this.settings.max_time_allowed;
  }

  /**
   * Setter for _max_time_allowed. Can only be called before initialization.
   * @param {string} max_time_allowed
   */
  set max_time_allowed(max_time_allowed: string) {
    this.settings.max_time_allowed = max_time_allowed;
  }

  /**
   * Getter for _mode
   * @return {string}
   */
  get mode(): string {
    return this.settings.mode;
  }

  /**
   * Setter for _mode. Can only be called before initialization.
   * @param {string} mode
   */
  set mode(mode: string) {
    this.settings.mode = mode;
  }

  /**
   * Getter for _progress_measure
   * @return {string}
   */
  get progress_measure(): string {
    return this.status.progress_measure;
  }

  /**
   * Setter for _progress_measure
   * @param {string} progress_measure
   */
  set progress_measure(progress_measure: string) {
    this.status.progress_measure = progress_measure;
  }

  /**
   * Getter for _scaled_passing_score
   * @return {string}
   */
  get scaled_passing_score(): string {
    return this.thresholds.scaled_passing_score;
  }

  /**
   * Setter for _scaled_passing_score. Can only be called before initialization.
   * @param {string} scaled_passing_score
   */
  set scaled_passing_score(scaled_passing_score: string) {
    this.thresholds.scaled_passing_score = scaled_passing_score;
  }

  /**
   * Getter for _session_time. Should only be called during JSON export.
   * @return {string}
   */
  get session_time(): string {
    this.session.jsonString = this.jsonString;
    return this.session.session_time;
  }

  /**
   * Setter for _session_time
   * @param {string} session_time
   */
  set session_time(session_time: string) {
    this.session.session_time = session_time;
  }

  /**
   * Getter for _success_status
   * @return {string}
   */
  get success_status(): string {
    return this.status.success_status;
  }

  /**
   * Setter for _success_status
   * @param {string} success_status
   */
  set success_status(success_status: string) {
    this.status.success_status = success_status;
  }

  /**
   * Getter for _suspend_data
   * @return {string}
   */
  get suspend_data(): string {
    return this.content.suspend_data;
  }

  /**
   * Setter for _suspend_data
   * @param {string} suspend_data
   */
  set suspend_data(suspend_data: string) {
    this.content.suspend_data = suspend_data;
  }

  /**
   * Getter for _time_limit_action
   * @return {string}
   */
  get time_limit_action(): string {
    return this.settings.time_limit_action;
  }

  /**
   * Setter for _time_limit_action. Can only be called before initialization.
   * @param {string} time_limit_action
   */
  set time_limit_action(time_limit_action: string) {
    this.settings.time_limit_action = time_limit_action;
  }

  /**
   * Getter for _total_time
   * @return {string}
   */
  get total_time(): string {
    return this.session.total_time;
  }

  /**
   * Setter for _total_time. Can only be called before initialization.
   * @param {string} total_time
   */
  set total_time(total_time: string) {
    this.session.total_time = total_time;
  }

  /**
   * Adds the current session time to the existing total time.
   *
   * @return {string} ISO8601 Duration
   */
  getCurrentTotalTime(): string {
    return this.session.getCurrentTotalTime(this.start_time);
  }

  /**
   * toJSON for cmi
   *
   * @return {
   *    {
   *      comments_from_learner: CMICommentsFromLearner,
   *      comments_from_lms: CMICommentsFromLMS,
   *      completion_status: string,
   *      completion_threshold: string,
   *      credit: string,
   *      entry: string,
   *      exit: string,
   *      interactions: CMIInteractions,
   *      launch_data: string,
   *      learner_id: string,
   *      learner_name: string,
   *      learner_preference: CMILearnerPreference,
   *      location: string,
   *      max_time_allowed: string,
   *      mode: string,
   *      objectives: CMIObjectives,
   *      progress_measure: string,
   *      scaled_passing_score: string,
   *      score: Scorm2004CMIScore,
   *      session_time: string,
   *      success_status: string,
   *      suspend_data: string,
   *      time_limit_action: string
   *    }
   *  }
   */
  toJSON(): {
    comments_from_learner: CMICommentsFromLearner;
    comments_from_lms: CMICommentsFromLMS;
    completion_status: string;
    completion_threshold: string;
    credit: string;
    entry: string;
    exit: string;
    interactions: CMIInteractions;
    launch_data: string;
    learner_id: string;
    learner_name: string;
    learner_preference: CMILearnerPreference;
    location: string;
    max_time_allowed: string;
    mode: string;
    objectives: CMIObjectives;
    progress_measure: string;
    scaled_passing_score: string;
    score: Scorm2004CMIScore;
    session_time: string;
    success_status: string;
    suspend_data: string;
    time_limit_action: string;
  } {
    this.jsonString = true;

    // Set jsonString flag on component classes that need it
    this.session.jsonString = true;

    const result = {
      comments_from_learner: this.comments_from_learner,
      comments_from_lms: this.comments_from_lms,
      completion_status: this.completion_status,
      completion_threshold: this.completion_threshold,
      credit: this.credit,
      entry: this.entry,
      exit: this.exit,
      interactions: this.interactions,
      launch_data: this.launch_data,
      learner_id: this.learner_id,
      learner_name: this.learner_name,
      learner_preference: this.learner_preference,
      location: this.location,
      max_time_allowed: this.max_time_allowed,
      mode: this.mode,
      objectives: this.objectives,
      progress_measure: this.progress_measure,
      scaled_passing_score: this.scaled_passing_score,
      score: this.score,
      session_time: this.session_time,
      success_status: this.success_status,
      suspend_data: this.suspend_data,
      time_limit_action: this.time_limit_action,
    };

    // Clean up jsonString flags
    this.jsonString = false;
    this.session.jsonString = false;

    return result;
  }
}
