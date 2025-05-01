import { BaseCMI } from "../../common/base_cmi";
import { Activity } from "./activity";
import { Scorm2004ValidationError } from "../../../exceptions/scorm2004_exceptions";
import { scorm2004_errors } from "../../../constants/error_codes";

/**
 * Class representing the SCORM 2004 activity tree
 */
export class ActivityTree extends BaseCMI {
  private _root: Activity | null = null;
  private _currentActivity: Activity | null = null;
  private _suspendedActivity: Activity | null = null;
  private _activities: Map<string, Activity> = new Map();

  /**
   * Constructor for ActivityTree
   */
  constructor() {
    super("activityTree");
  }

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    if (this._root) {
      this._root.initialize();
    }
  }

  /**
   * Called when the API needs to be reset
   */
  reset() {
    this._initialized = false;
    this._currentActivity = null;
    this._suspendedActivity = null;
    if (this._root) {
      this._root.reset();
    }
  }

  /**
   * Getter for root
   * @return {Activity | null}
   */
  get root(): Activity | null {
    return this._root;
  }

  /**
   * Setter for root
   * @param {Activity} root
   */
  set root(root: Activity | null) {
    if (root !== null && !(root instanceof Activity)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".root",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }
    this._root = root;
    if (root) {
      this._activities.set(root.id, root);
      this._addActivitiesToMap(root);
    }
  }

  /**
   * Recursively add activities to the activities map
   * @param {Activity} activity
   * @private
   */
  private _addActivitiesToMap(activity: Activity): void {
    for (const child of activity.children) {
      this._activities.set(child.id, child);
      this._addActivitiesToMap(child);
    }
  }

  /**
   * Getter for currentActivity
   * @return {Activity | null}
   */
  get currentActivity(): Activity | null {
    return this._currentActivity;
  }

  /**
   * Setter for currentActivity
   * @param {Activity | null} activity
   */
  set currentActivity(activity: Activity | null) {
    if (activity !== null && !(activity instanceof Activity)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".currentActivity",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }

    // If there's already a current activity, deactivate it
    if (this._currentActivity) {
      this._currentActivity.isActive = false;
    }

    // Set the new current activity and activate it
    this._currentActivity = activity;
    if (activity) {
      activity.isActive = true;
    }
  }

  /**
   * Getter for suspendedActivity
   * @return {Activity | null}
   */
  get suspendedActivity(): Activity | null {
    return this._suspendedActivity;
  }

  /**
   * Setter for suspendedActivity
   * @param {Activity | null} activity
   */
  set suspendedActivity(activity: Activity | null) {
    if (activity !== null && !(activity instanceof Activity)) {
      throw new Scorm2004ValidationError(
        this._cmi_element + ".suspendedActivity",
        scorm2004_errors.TYPE_MISMATCH,
      );
    }

    // If there's already a suspended activity, unsuspend it
    if (this._suspendedActivity) {
      this._suspendedActivity.isSuspended = false;
    }

    // Set the new suspended activity and mark it as suspended
    this._suspendedActivity = activity;
    if (activity) {
      activity.isSuspended = true;
    }
  }

  /**
   * Get an activity by ID
   * @param {string} id - The ID of the activity to get
   * @return {Activity | undefined} - The activity with the given ID, or undefined if not found
   */
  getActivity(id: string): Activity | undefined {
    return this._activities.get(id);
  }

  /**
   * Get all activities in the tree
   * @return {Activity[]} - An array of all activities in the tree
   */
  getAllActivities(): Activity[] {
    return Array.from(this._activities.values());
  }

  /**
   * Get the parent of an activity
   * @param {Activity} activity - The activity to get the parent of
   * @return {Activity | null} - The parent of the activity, or null if it has no parent
   */
  getParent(activity: Activity): Activity | null {
    return activity.parent;
  }

  /**
   * Get the children of an activity
   * @param {Activity} activity - The activity to get the children of
   * @return {Activity[]} - An array of the activity's children
   */
  getChildren(activity: Activity): Activity[] {
    return activity.children;
  }

  /**
   * Get the siblings of an activity
   * @param {Activity} activity - The activity to get the siblings of
   * @return {Activity[]} - An array of the activity's siblings
   */
  getSiblings(activity: Activity): Activity[] {
    if (!activity.parent) {
      return [];
    }
    return activity.parent.children.filter((child) => child !== activity);
  }

  /**
   * Get the next sibling of an activity
   * @param {Activity} activity - The activity to get the next sibling of
   * @return {Activity | null} - The next sibling of the activity, or null if it has no next sibling
   */
  getNextSibling(activity: Activity): Activity | null {
    if (!activity.parent) {
      return null;
    }
    const siblings = activity.parent.children;
    const index = siblings.indexOf(activity);
    if (index === -1 || index === siblings.length - 1) {
      return null;
    }
    return siblings[index + 1];
  }

  /**
   * Get the previous sibling of an activity
   * @param {Activity} activity - The activity to get the previous sibling of
   * @return {Activity | null} - The previous sibling of the activity, or null if it has no previous sibling
   */
  getPreviousSibling(activity: Activity): Activity | null {
    if (!activity.parent) {
      return null;
    }
    const siblings = activity.parent.children;
    const index = siblings.indexOf(activity);
    if (index <= 0) {
      return null;
    }
    return siblings[index - 1];
  }

  /**
   * Get the first child of an activity
   * @param {Activity} activity - The activity to get the first child of
   * @return {Activity | null} - The first child of the activity, or null if it has no children
   */
  getFirstChild(activity: Activity): Activity | null {
    if (activity.children.length === 0) {
      return null;
    }
    return activity.children[0];
  }

  /**
   * Get the last child of an activity
   * @param {Activity} activity - The activity to get the last child of
   * @return {Activity | null} - The last child of the activity, or null if it has no children
   */
  getLastChild(activity: Activity): Activity | null {
    if (activity.children.length === 0) {
      return null;
    }
    return activity.children[activity.children.length - 1];
  }

  /**
   * Get the common ancestor of two activities
   * @param {Activity} activity1 - The first activity
   * @param {Activity} activity2 - The second activity
   * @return {Activity | null} - The common ancestor of the two activities, or null if they have no common ancestor
   */
  getCommonAncestor(activity1: Activity, activity2: Activity): Activity | null {
    // Get the path from the root to activity1
    const path1: Activity[] = [];
    let current: Activity | null = activity1;
    while (current) {
      path1.unshift(current);
      current = current.parent;
    }

    // Check if activity2 is in the path from the root to activity1
    current = activity2;
    while (current) {
      if (path1.includes(current)) {
        return current;
      }
      current = current.parent;
    }

    return null;
  }

  /**
   * toJSON for ActivityTree
   * @return {object}
   */
  toJSON(): object {
    this.jsonString = true;
    const result = {
      root: this._root,
      currentActivity: this._currentActivity ? this._currentActivity.id : null,
      suspendedActivity: this._suspendedActivity ? this._suspendedActivity.id : null,
    };
    this.jsonString = false;
    return result;
  }
}
