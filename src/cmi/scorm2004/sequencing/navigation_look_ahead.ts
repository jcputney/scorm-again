import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingProcess, SequencingRequestType } from "./sequencing_process";

/**
 * Interface for navigation prediction cache entry
 */
interface NavigationPredictionCache {
  continueEnabled: boolean;
  previousEnabled: boolean;
  availableChoices: Set<string>;
  choiceEnabledMap: Map<string, boolean>;
  treeStateHash: string;
}

/**
 * Interface for navigation predictions result
 */
export interface NavigationPredictions {
  continueEnabled: boolean;
  previousEnabled: boolean;
  availableChoices: string[];
}

/**
 * NavigationLookAhead class
 * Provides look-ahead navigation prediction for SCORM 2004 sequencing.
 * This allows UI to show correct button states before user clicks.
 *
 * Performance target: <10ms for full tree prediction on 50+ activity course
 */
export class NavigationLookAhead {
  private activityTree: ActivityTree;
  private sequencingProcess: SequencingProcess;
  private cache: NavigationPredictionCache | null = null;
  private isDirty: boolean = true;

  constructor(activityTree: ActivityTree, sequencingProcess: SequencingProcess) {
    this.activityTree = activityTree;
    this.sequencingProcess = sequencingProcess;
  }

  /**
   * Predict if Continue navigation would succeed from current activity
   * @return {boolean} - True if Continue would succeed, false otherwise
   */
  public predictContinueEnabled(): boolean {
    this.ensureCacheValid();
    return this.cache?.continueEnabled ?? false;
  }

  /**
   * Predict if Previous navigation would succeed from current activity
   * @return {boolean} - True if Previous would succeed, false otherwise
   */
  public predictPreviousEnabled(): boolean {
    this.ensureCacheValid();
    return this.cache?.previousEnabled ?? false;
  }

  /**
   * Predict if choice to specific activity would succeed
   * @param {string} activityId - Target activity ID
   * @return {boolean} - True if choice would succeed, false otherwise
   */
  public predictChoiceEnabled(activityId: string): boolean {
    this.ensureCacheValid();
    return this.cache?.choiceEnabledMap.get(activityId) ?? false;
  }

  /**
   * Get list of all activity IDs that can be chosen
   * @return {string[]} - Array of activity IDs that can be chosen
   */
  public getAvailableChoices(): string[] {
    this.ensureCacheValid();
    return Array.from(this.cache?.availableChoices ?? []);
  }

  /**
   * Get all navigation predictions at once
   * @return {NavigationPredictions} - Navigation predictions object
   */
  public getAllPredictions(): NavigationPredictions {
    this.ensureCacheValid();
    return {
      continueEnabled: this.cache?.continueEnabled ?? false,
      previousEnabled: this.cache?.previousEnabled ?? false,
      availableChoices: Array.from(this.cache?.availableChoices ?? []),
    };
  }

  /**
   * Invalidate the cache to force recalculation on next access
   * Should be called after:
   * - Activity change
   * - Rollup process
   * - Objective changes
   * - Attempt changes
   */
  public invalidateCache(): void {
    this.isDirty = true;
  }

  /**
   * Force immediate cache update (useful for testing)
   */
  public updateCache(): void {
    this.isDirty = true;
    this.ensureCacheValid();
  }

  /**
   * Ensure cache is valid, recalculating if needed
   * @private
   */
  private ensureCacheValid(): void {
    const currentTreeHash = this.calculateTreeStateHash();

    if (this.isDirty || !this.cache || this.cache.treeStateHash !== currentTreeHash) {
      this.recalculateCache(currentTreeHash);
      this.isDirty = false;
    }
  }

  /**
   * Recalculate all navigation predictions
   * @param {string} treeStateHash - Current tree state hash
   * @private
   */
  private recalculateCache(treeStateHash: string): void {
    const currentActivity = this.activityTree.currentActivity;

    // Initialize cache
    this.cache = {
      continueEnabled: false,
      previousEnabled: false,
      availableChoices: new Set<string>(),
      choiceEnabledMap: new Map<string, boolean>(),
      treeStateHash,
    };

    // Edge case: no current activity
    if (!currentActivity) {
      // Can only choose activities from root level
      this.calculateAvailableChoicesFromRoot();
      return;
    }

    // Predict Continue
    this.cache.continueEnabled = this.predictContinueInternal(currentActivity);

    // Predict Previous
    this.cache.previousEnabled = this.predictPreviousInternal(currentActivity);

    // Calculate available choices for all activities
    this.calculateAvailableChoices();
  }

  /**
   * Predict if Continue would succeed from the given activity
   * @param {Activity} currentActivity - Current activity
   * @return {boolean} - True if Continue would succeed
   * @private
   */
  private predictContinueInternal(currentActivity: Activity): boolean {
    // Check basic flow control requirements
    if (!currentActivity.parent) {
      return false;
    }

    // Flow must be enabled on the parent to use Continue
    if (!currentActivity.parent.sequencingControls.flow) {
      return false;
    }

    // Check if there's a potential next activity
    // We can't fully simulate the flow process without side effects,
    // so we do a simplified check
    return this.hasAvailableNextActivity(currentActivity);
  }

  /**
   * Check if there's an available next activity in flow
   * @param {Activity} currentActivity - Current activity
   * @return {boolean} - True if next activity exists
   * @private
   */
  private hasAvailableNextActivity(currentActivity: Activity): boolean {
    const parent = currentActivity.parent;
    if (!parent) {
      return false;
    }

    const siblings = parent.children;
    const currentIndex = siblings.indexOf(currentActivity);

    if (currentIndex === -1) {
      return false;
    }

    // Check if there's any sibling after current
    if (currentIndex < siblings.length - 1) {
      // Check if there's a deliverable activity after this one
      // Uses full preConditionRule evaluation for forward navigation
      for (let i = currentIndex + 1; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling && this.isActivityPotentiallyDeliverableForward(sibling)) {
          return true;
        }
      }
    }

    // Check if parent can be exited and has a next sibling
    if (parent.parent && parent.sequencingControls.flow) {
      return this.hasAvailableNextActivity(parent);
    }

    return false;
  }

  /**
   * Predict if Previous would succeed from the given activity
   * @param {Activity} currentActivity - Current activity
   * @return {boolean} - True if Previous would succeed
   * @private
   */
  private predictPreviousInternal(currentActivity: Activity): boolean {
    // Check basic flow control requirements
    if (!currentActivity.parent) {
      return false;
    }

    // Flow must be enabled on the parent to use Previous
    if (!currentActivity.parent.sequencingControls.flow) {
      return false;
    }

    // forwardOnly blocks Previous navigation
    if (currentActivity.parent.sequencingControls.forwardOnly) {
      return false;
    }

    // Check if there's a potential previous activity
    return this.hasAvailablePreviousActivity(currentActivity);
  }

  /**
   * Check if there's an available previous activity in flow
   * @param {Activity} currentActivity - Current activity
   * @return {boolean} - True if previous activity exists
   * @private
   */
  private hasAvailablePreviousActivity(currentActivity: Activity): boolean {
    const parent = currentActivity.parent;
    if (!parent) {
      return false;
    }

    const siblings = parent.children;
    const currentIndex = siblings.indexOf(currentActivity);

    if (currentIndex === -1) {
      return false;
    }

    // Check if there's any sibling before current
    if (currentIndex > 0) {
      // Check if there's a deliverable activity before this one
      // Uses simpler check for backward navigation (reviewing previously visited content)
      for (let i = currentIndex - 1; i >= 0; i--) {
        const sibling = siblings[i];
        if (sibling && this.isActivityPotentiallyDeliverableBackward(sibling)) {
          return true;
        }
      }
    }

    // Check if we can go to parent's previous sibling
    if (parent.parent && parent.sequencingControls.flow && !parent.sequencingControls.forwardOnly) {
      return this.hasAvailablePreviousActivity(parent);
    }

    return false;
  }

  /**
   * Calculate available choices from root (when no current activity)
   * @private
   */
  private calculateAvailableChoicesFromRoot(): void {
    if (!this.cache || !this.activityTree.root) {
      return;
    }

    // When no current activity, no choices are available yet
    // User must start the course first
    // Do not populate any choices
  }

  /**
   * Calculate all available choices in the tree
   * @private
   */
  private calculateAvailableChoices(): void {
    if (!this.cache || !this.activityTree.root) {
      return;
    }

    const root = this.activityTree.root;
    this.recursivelyCheckChoiceAvailability(root);
  }

  /**
   * Recursively check choice availability for activity and its descendants
   * @param {Activity} activity - Activity to check
   * @private
   */
  private recursivelyCheckChoiceAvailability(activity: Activity): void {
    if (!this.cache) {
      return;
    }

    const currentActivity = this.activityTree.currentActivity;

    // Check if this activity can be chosen
    const validation = this.sequencingProcess.validateNavigationRequest(
      SequencingRequestType.CHOICE,
      activity.id,
      currentActivity
    );

    const isChoiceEnabled = validation.valid;

    this.cache.choiceEnabledMap.set(activity.id, isChoiceEnabled);

    if (isChoiceEnabled) {
      this.cache.availableChoices.add(activity.id);
    }

    // Recursively check children
    if (activity.children) {
      for (const child of activity.children) {
        this.recursivelyCheckChoiceAvailability(child);
      }
    }
  }

  /**
   * Check if activity is potentially deliverable for forward navigation (Continue)
   * This properly evaluates preConditionRules to determine if the activity can be delivered
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if potentially deliverable
   * @private
   */
  private isActivityPotentiallyDeliverableForward(activity: Activity): boolean {
    // isHiddenFromChoice blocks both choice and flow navigation
    if (activity.isHiddenFromChoice || !activity.isAvailable) {
      return false;
    }

    // For leaf activities, use the full check that evaluates preConditionRules
    // isVisible only affects deliverability of leaf activities, not cluster traversal
    if (activity.children.length === 0) {
      if (!activity.isVisible) {
        return false;
      }
      return this.sequencingProcess.canActivityBeDelivered(activity);
    }

    // For clusters, check if any child is potentially deliverable
    // Note: Invisible clusters (isVisible=false) can still be traversed by flow navigation
    // - they just won't appear in the TOC. This is a common pattern for grouping content.
    for (const child of activity.children) {
      if (this.isActivityPotentiallyDeliverableForward(child)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if activity is potentially deliverable for backward navigation (Previous)
   * This uses a simpler check that doesn't fully evaluate preConditionRules
   * since we're typically going back to a previously visited activity
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if potentially deliverable
   * @private
   */
  private isActivityPotentiallyDeliverableBackward(activity: Activity): boolean {
    // isHiddenFromChoice blocks both choice and flow navigation
    if (activity.isHiddenFromChoice || !activity.isAvailable) {
      return false;
    }

    // For leaf activities, isVisible must be true to deliver
    if (activity.children.length === 0) {
      // For backward navigation, we use a simpler check since the activity was likely
      // already delivered before (the learner is going back to review)
      return activity.isVisible;
    }

    // For clusters, check if any child is potentially deliverable
    // Note: Invisible clusters can still be traversed by flow navigation
    for (const child of activity.children) {
      if (this.isActivityPotentiallyDeliverableBackward(child)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Calculate a hash of the tree state for cache invalidation
   * @return {string} - Hash representing current tree state
   * @private
   */
  private calculateTreeStateHash(): string {
    const currentActivity = this.activityTree.currentActivity;
    const suspendedActivity = this.activityTree.suspendedActivity;

    // Create a simple hash from key state elements
    const parts: string[] = [
      currentActivity?.id ?? "none",
      suspendedActivity?.id ?? "none",
      this.getActivityTreeStateSignature(),
    ];

    return parts.join("|");
  }

  /**
   * Get a signature of the activity tree state
   * @return {string} - Signature of tree state
   * @private
   */
  private getActivityTreeStateSignature(): string {
    if (!this.activityTree.root) {
      return "empty";
    }

    // Create a signature based on important activity states
    const signatures: string[] = [];
    this.collectActivitySignatures(this.activityTree.root, signatures);

    return signatures.join(":");
  }

  /**
   * Recursively collect activity signatures
   * @param {Activity} activity - Activity to process
   * @param {string[]} signatures - Array to collect signatures
   * @private
   */
  private collectActivitySignatures(activity: Activity, signatures: string[]): void {
    // Include key state elements that affect navigation
    const sig = [
      activity.id,
      activity.isActive ? "A" : "-",
      activity.isSuspended ? "S" : "-",
      activity.completionStatus,
      activity.successStatus,
      activity.attemptCount.toString(),
    ].join("");

    signatures.push(sig);

    // Process children
    if (activity.children) {
      for (const child of activity.children) {
        this.collectActivitySignatures(child, signatures);
      }
    }
  }
}
