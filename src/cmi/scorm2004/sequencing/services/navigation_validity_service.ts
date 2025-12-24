import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { SequencingProcess, SequencingRequestType } from "../sequencing_process";
import { RuleActionType } from "../sequencing_rules";
import { ADLNav } from "../../adl";
import { NavigationLookAhead, NavigationPredictions } from "../navigation_look_ahead";
import { HideLmsUiItem } from "../../../../types/sequencing_types";

/**
 * Enum for navigation request types
 */
export enum NavigationRequestType {
  START = "start",
  RESUME_ALL = "resumeAll",
  CONTINUE = "continue",
  PREVIOUS = "previous",
  CHOICE = "choice",
  JUMP = "jump",
  EXIT = "exit",
  EXIT_ALL = "exitAll",
  ABANDON = "abandon",
  ABANDON_ALL = "abandonAll",
  SUSPEND_ALL = "suspendAll",
  NOT_VALID = "_none_",
}

/**
 * Class representing a navigation request result
 */
export class NavigationRequestResult {
  public valid: boolean;
  public terminationRequest: SequencingRequestType | null;
  public sequencingRequest: SequencingRequestType | null;
  public targetActivityId: string | null;
  public exception: string | null;

  constructor(
    valid: boolean = false,
    terminationRequest: SequencingRequestType | null = null,
    sequencingRequest: SequencingRequestType | null = null,
    targetActivityId: string | null = null,
    exception: string | null = null
  ) {
    this.valid = valid;
    this.terminationRequest = terminationRequest;
    this.sequencingRequest = sequencingRequest;
    this.targetActivityId = targetActivityId;
    this.exception = exception;
  }
}

/**
 * NavigationValidityService
 *
 * Handles all navigation validation for the SCORM 2004 sequencing engine.
 * Extracted from OverallSequencingProcess to follow Single Responsibility Principle.
 *
 * Responsibilities:
 * - Validate navigation requests
 * - Check choice path constraints
 * - Validate forward-only constraints
 * - Update navigation validity in ADL nav
 * - Manage navigation look-ahead predictions
 *
 * @spec SN Book: NB.2.1 (Navigation Request Process)
 */
export class NavigationValidityService {
  private activityTree: ActivityTree;
  private sequencingProcess: SequencingProcess;
  private adlNav: ADLNav | null;
  private eventCallback: ((eventType: string, data?: any) => void) | null;
  private navigationLookAhead: NavigationLookAhead;
  private getEffectiveHideLmsUiCallback:
    | ((activity: Activity | null) => HideLmsUiItem[])
    | null = null;

  constructor(
    activityTree: ActivityTree,
    sequencingProcess: SequencingProcess,
    adlNav: ADLNav | null = null,
    eventCallback: ((eventType: string, data?: any) => void) | null = null
  ) {
    this.activityTree = activityTree;
    this.sequencingProcess = sequencingProcess;
    this.adlNav = adlNav;
    this.eventCallback = eventCallback;
    this.navigationLookAhead = new NavigationLookAhead(activityTree, sequencingProcess);
  }

  /**
   * Set callback to get effective hideLmsUi
   */
  public setGetEffectiveHideLmsUiCallback(
    callback: (activity: Activity | null) => HideLmsUiItem[]
  ): void {
    this.getEffectiveHideLmsUiCallback = callback;
  }

  /**
   * Get the navigation look-ahead instance
   */
  public getNavigationLookAhead(): NavigationLookAhead {
    return this.navigationLookAhead;
  }

  /**
   * Navigation Request Process
   * Validates navigation requests and converts them to termination/sequencing requests
   * @spec SN Book: NB.2.1 (Navigation Request Process)
   * @param {NavigationRequestType} request - The navigation request
   * @param {string | null} targetActivityId - Target activity for choice/jump
   * @return {NavigationRequestResult} - The validation result
   */
  public validateRequest(
    request: NavigationRequestType,
    targetActivityId: string | null = null
  ): NavigationRequestResult {
    // Enhanced logging for debugging
    this.fireEvent("onNavigationRequestProcessing", { request, targetActivityId });
    const currentActivity = this.activityTree.currentActivity;

    // Check if navigation request is valid
    switch (request) {
      case NavigationRequestType.START:
        return this.validateStartRequest(currentActivity);

      case NavigationRequestType.RESUME_ALL:
        return this.validateResumeRequest(currentActivity);

      case NavigationRequestType.CONTINUE:
        return this.validateContinueRequest(currentActivity);

      case NavigationRequestType.PREVIOUS:
        return this.validatePreviousRequest(currentActivity);

      case NavigationRequestType.CHOICE:
        return this.validateChoiceRequest(currentActivity, targetActivityId);

      case NavigationRequestType.JUMP:
        return this.validateJumpRequest(targetActivityId);

      case NavigationRequestType.EXIT:
        return this.validateExitRequest(currentActivity);

      case NavigationRequestType.EXIT_ALL:
        return this.validateExitAllRequest(currentActivity);

      case NavigationRequestType.ABANDON:
        return this.validateAbandonRequest(currentActivity);

      case NavigationRequestType.ABANDON_ALL:
        return this.validateAbandonAllRequest(currentActivity);

      case NavigationRequestType.SUSPEND_ALL:
        return this.validateSuspendAllRequest(currentActivity);

      default:
        return new NavigationRequestResult(false, null, null, null, "NB.2.1-18");
    }
  }

  /**
   * Validate START request
   */
  private validateStartRequest(
    currentActivity: Activity | null
  ): NavigationRequestResult {
    if (currentActivity !== null) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-1");
    }
    return new NavigationRequestResult(
      true,
      null,
      SequencingRequestType.START,
      null
    );
  }

  /**
   * Validate RESUME_ALL request
   */
  private validateResumeRequest(
    currentActivity: Activity | null
  ): NavigationRequestResult {
    if (currentActivity !== null) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-2");
    }
    if (this.activityTree.suspendedActivity === null) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-3");
    }
    return new NavigationRequestResult(
      true,
      null,
      SequencingRequestType.RESUME_ALL,
      null
    );
  }

  /**
   * Validate CONTINUE request
   */
  private validateContinueRequest(
    currentActivity: Activity | null
  ): NavigationRequestResult {
    if (!currentActivity) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-4");
    }
    if (
      !currentActivity.parent ||
      !currentActivity.parent.sequencingControls.flow
    ) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-5");
    }

    // Per NB.2.1 Step 3.2.1: Only terminate if current activity is active
    const continueTerminationRequest = currentActivity.isActive
      ? SequencingRequestType.EXIT
      : null;

    return new NavigationRequestResult(
      true,
      continueTerminationRequest,
      SequencingRequestType.CONTINUE,
      null
    );
  }

  /**
   * Validate PREVIOUS request
   */
  private validatePreviousRequest(
    currentActivity: Activity | null
  ): NavigationRequestResult {
    if (!currentActivity) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-6");
    }
    if (
      !currentActivity.parent ||
      !currentActivity.parent.sequencingControls.flow
    ) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-7");
    }

    // Enhanced Forward-Only Navigation Constraints - Check at multiple cluster levels
    const forwardOnlyValidation =
      this.validateForwardOnlyConstraints(currentActivity);
    if (!forwardOnlyValidation.valid) {
      return new NavigationRequestResult(
        false,
        null,
        null,
        null,
        forwardOnlyValidation.exception
      );
    }

    // Per NB.2.1 Step 4.2.1.1: Only terminate if current activity is active
    const previousTerminationRequest = currentActivity.isActive
      ? SequencingRequestType.EXIT
      : null;

    return new NavigationRequestResult(
      true,
      previousTerminationRequest,
      SequencingRequestType.PREVIOUS,
      null
    );
  }

  /**
   * Validate CHOICE request
   */
  private validateChoiceRequest(
    currentActivity: Activity | null,
    targetActivityId: string | null
  ): NavigationRequestResult {
    if (!targetActivityId) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-9");
    }
    const targetActivity = this.activityTree.getActivity(targetActivityId);
    if (!targetActivity) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-10");
    }

    // Enhanced Choice Path Validation
    const choiceValidation = this.validateChoicePath(
      currentActivity,
      targetActivity
    );
    if (!choiceValidation.valid) {
      return new NavigationRequestResult(
        false,
        null,
        null,
        null,
        choiceValidation.exception
      );
    }

    // Per NB.2.1 Step 7.1.1.4: Only return EXIT if current activity is active
    return new NavigationRequestResult(
      true,
      currentActivity?.isActive ? SequencingRequestType.EXIT : null,
      SequencingRequestType.CHOICE,
      targetActivityId
    );
  }

  /**
   * Validate JUMP request
   */
  private validateJumpRequest(
    targetActivityId: string | null
  ): NavigationRequestResult {
    if (!targetActivityId) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-12");
    }
    return new NavigationRequestResult(
      true,
      null,
      SequencingRequestType.JUMP,
      targetActivityId
    );
  }

  /**
   * Validate EXIT request
   */
  private validateExitRequest(
    currentActivity: Activity | null
  ): NavigationRequestResult {
    if (!currentActivity) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-13");
    }
    if (currentActivity === this.activityTree.root) {
      return new NavigationRequestResult(
        true,
        SequencingRequestType.EXIT_ALL,
        null,
        null
      );
    }
    return new NavigationRequestResult(
      true,
      SequencingRequestType.EXIT,
      null,
      null
    );
  }

  /**
   * Validate EXIT_ALL request
   */
  private validateExitAllRequest(
    currentActivity: Activity | null
  ): NavigationRequestResult {
    if (!currentActivity) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-14");
    }
    return new NavigationRequestResult(
      true,
      SequencingRequestType.EXIT_ALL,
      null,
      null
    );
  }

  /**
   * Validate ABANDON request
   */
  private validateAbandonRequest(
    currentActivity: Activity | null
  ): NavigationRequestResult {
    if (!currentActivity) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-15");
    }
    return new NavigationRequestResult(
      true,
      SequencingRequestType.ABANDON,
      null,
      null
    );
  }

  /**
   * Validate ABANDON_ALL request
   */
  private validateAbandonAllRequest(
    currentActivity: Activity | null
  ): NavigationRequestResult {
    if (!currentActivity) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-16");
    }
    return new NavigationRequestResult(
      true,
      SequencingRequestType.ABANDON_ALL,
      null,
      null
    );
  }

  /**
   * Validate SUSPEND_ALL request
   */
  private validateSuspendAllRequest(
    currentActivity: Activity | null
  ): NavigationRequestResult {
    if (!currentActivity) {
      return new NavigationRequestResult(false, null, null, null, "NB.2.1-17");
    }
    return new NavigationRequestResult(
      true,
      SequencingRequestType.SUSPEND_ALL,
      null,
      null
    );
  }

  /**
   * Enhanced Complex Choice Path Validation
   * Implements comprehensive choice validation with nested hierarchy support
   * @param {Activity | null} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity for choice
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  public validateChoicePath(
    currentActivity: Activity | null,
    targetActivity: Activity
  ): { valid: boolean; exception: string | null } {
    // Check if target is hidden from choice or otherwise unavailable
    // Per NB.2.1 Step 7.1.1.1: Only check static properties here, not preconditions
    // Preconditions that depend on rollup state are evaluated later in SB.2.3 (Check Activity)
    if (targetActivity.isHiddenFromChoice) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Check availability and precondition rules (DISABLED, HIDE_FROM_CHOICE)
    // Per NB.2.1: Target activity must be available for choice navigation
    if (!targetActivity.isAvailable) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Check if target is disabled by precondition rules (e.g., DISABLED action with ALWAYS condition)
    if (this.isActivityDisabled(targetActivity)) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    if (currentActivity) {
      const commonAncestor = this.findCommonAncestor(
        currentActivity,
        targetActivity
      );
      if (!commonAncestor) {
        return { valid: false, exception: "NB.2.1-11" };
      }

      // Validate choiceExit controls along the current activity path
      // Per NB.2.1 Step 7.1.1.2.3.1: Only check active ancestors from current to common ancestor (exclusive)
      let node: Activity | null = currentActivity;
      while (node && node !== commonAncestor) {
        // Only validate choiceExit if the activity is active
        if (
          node.isActive === true &&
          node.sequencingControls &&
          node.sequencingControls.choiceExit === false
        ) {
          if (
            targetActivity !== node &&
            !this.activityContains(node, targetActivity)
          ) {
            return { valid: false, exception: "NB.2.1-11" };
          }
        }
        node = node.parent;
      }

      // Enhanced constrainChoice control validation in nested hierarchies
      const constrainChoiceValidation = this.validateConstrainChoice(
        currentActivity,
        targetActivity,
        commonAncestor
      );
      if (!constrainChoiceValidation.valid) {
        return constrainChoiceValidation;
      }

      // Validate choice sets with multiple targets
      const choiceSetValidation = this.validateChoiceSet(
        currentActivity,
        targetActivity,
        commonAncestor
      );
      if (!choiceSetValidation.valid) {
        return choiceSetValidation;
      }
    }

    // Path to root validation for choice control
    let activity: Activity | null = targetActivity;
    while (activity) {
      if (activity.parent && !activity.parent.sequencingControls.choice) {
        return { valid: false, exception: "NB.2.1-11" };
      }
      activity = activity.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Enhanced Forward-Only Navigation Constraints
   * Handles forward-only constraints at different cluster levels
   * @param {Activity} currentActivity - Current activity
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  public validateForwardOnlyConstraints(currentActivity: Activity): {
    valid: boolean;
    exception: string | null;
  } {
    // Check forward-only constraint at immediate parent level
    if (currentActivity.parent?.sequencingControls.forwardOnly) {
      return { valid: false, exception: "NB.2.1-8" };
    }

    // Check forward-only constraints at higher cluster levels
    let ancestor = currentActivity.parent?.parent;
    while (ancestor) {
      if (ancestor.sequencingControls.forwardOnly) {
        // If any ancestor cluster has forwardOnly=true, previous navigation is blocked
        return { valid: false, exception: "NB.2.1-8" };
      }
      ancestor = ancestor.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Enhanced constrainChoice Control Validation
   * Implements proper constrainChoice validation in nested hierarchies
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @param {Activity} commonAncestor - Common ancestor
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateConstrainChoice(
    currentActivity: Activity,
    targetActivity: Activity,
    commonAncestor: Activity
  ): { valid: boolean; exception: string | null } {
    // Check constrainChoice at the common ancestor and above in the path
    let ancestor: Activity | null = commonAncestor;
    while (ancestor) {
      if (
        ancestor.sequencingControls?.constrainChoice ||
        ancestor.sequencingControls?.preventActivation
      ) {
        const currentBranch = this.findChildContaining(
          ancestor,
          currentActivity
        );
        if (!currentBranch) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        if (targetActivity === ancestor) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        const targetBranch = this.findChildContaining(ancestor, targetActivity);
        if (!targetBranch) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        if (
          ancestor.sequencingControls?.constrainChoice &&
          targetBranch !== currentBranch
        ) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        if (
          ancestor.sequencingControls?.preventActivation &&
          targetBranch !== currentBranch
        ) {
          if (this.requiresNewActivation(targetBranch, targetActivity)) {
            return { valid: false, exception: "NB.2.1-11" };
          }
        }
      }

      ancestor = ancestor.parent;
    }

    return this.validateAncestors(commonAncestor, currentActivity, targetActivity);
  }

  /**
   * Validate Choice Set Constraints
   * Validates choice sets with multiple targets
   * @param {Activity} _currentActivity - Current activity (unused but part of interface)
   * @param {Activity} targetActivity - Target activity
   * @param {Activity} commonAncestor - Common ancestor
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateChoiceSet(
    _currentActivity: Activity,
    targetActivity: Activity,
    commonAncestor: Activity
  ): { valid: boolean; exception: string | null } {
    // Check if target is within the valid choice set
    // Ensure the target is contained within the common ancestor's subtree
    if (
      !this.activityContains(commonAncestor, targetActivity) &&
      targetActivity !== commonAncestor
    ) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Walk from target up to (but not including) the common ancestor ensuring availability
    // Per NB.2.1: Check availability, visibility, and precondition rules
    let node: Activity | null = targetActivity;
    while (node && node !== commonAncestor) {
      if (
        !node.isAvailable ||
        node.isHiddenFromChoice ||
        this.isActivityDisabled(node)
      ) {
        return { valid: false, exception: "NB.2.1-11" };
      }
      node = node.parent;
    }

    return { valid: true, exception: null };
  }

  /**
   * Check if activity is disabled
   * @param {Activity} activity - Activity to check
   * @return {boolean} - True if disabled
   */
  public isActivityDisabled(activity: Activity): boolean {
    if (!activity.isAvailable) {
      return true;
    }

    if (activity.isHiddenFromChoice) {
      return true;
    }

    const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
    if (!preConditionResult) {
      return false;
    }

    return (
      preConditionResult === RuleActionType.DISABLED ||
      preConditionResult === RuleActionType.HIDE_FROM_CHOICE ||
      preConditionResult === RuleActionType.STOP_FORWARD_TRAVERSAL
    );
  }

  /**
   * Find child activity that contains the target activity
   * @param {Activity} parent - Parent activity
   * @param {Activity} target - Target activity to find
   * @return {Activity | null} - Child activity containing target
   */
  public findChildContaining(
    parent: Activity,
    target: Activity
  ): Activity | null {
    for (const child of parent.children) {
      if (child === target) {
        return child;
      }
      if (this.activityContains(child, target)) {
        return child;
      }
    }
    return null;
  }

  /**
   * Check if an activity contains another activity in its hierarchy
   * @param {Activity} container - Container activity
   * @param {Activity} target - Target activity
   * @return {boolean} - True if container contains target
   */
  public activityContains(container: Activity, target: Activity): boolean {
    let current: Activity | null = target;
    while (current) {
      if (current === container) {
        return true;
      }
      current = current.parent;
    }
    return false;
  }

  /**
   * Find common ancestor between two activities
   */
  public findCommonAncestor(
    activity1: Activity,
    activity2: Activity
  ): Activity | null {
    // Get ancestors of activity1
    const ancestors1: Activity[] = [];
    let current: Activity | null = activity1;
    while (current) {
      ancestors1.push(current);
      current = current.parent;
    }

    // Find first common ancestor
    current = activity2;
    while (current) {
      if (ancestors1.includes(current)) {
        return current;
      }
      current = current.parent;
    }

    return null;
  }

  /**
   * Validate ancestor-level constraints
   * @param {Activity} ancestor - Ancestor activity
   * @param {Activity} currentActivity - Current activity
   * @param {Activity} targetActivity - Target activity
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  private validateAncestors(
    ancestor: Activity,
    currentActivity: Activity,
    targetActivity: Activity
  ): { valid: boolean; exception: string | null } {
    // Enforce forwardOnly and mandatory activity constraints at ancestor level
    const children = ancestor.children;
    if (!children || children.length === 0) {
      return { valid: true, exception: null };
    }

    const currentTop = this.findChildContaining(ancestor, currentActivity);
    const targetTop = this.findChildContaining(ancestor, targetActivity);
    if (!currentTop || !targetTop) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    const currentIndex = children.indexOf(currentTop);
    const targetIndex = children.indexOf(targetTop);

    // Forward-only prevents backwards choice under this ancestor
    if (ancestor.sequencingControls.forwardOnly && targetIndex < currentIndex) {
      return { valid: false, exception: "NB.2.1-8" };
    }

    const traversalStopIndex = children.findIndex(
      (child) => child?.sequencingControls.stopForwardTraversal
    );

    // Current branch flagged stopForwardTraversal blocks moving past it
    if (
      currentTop.sequencingControls.stopForwardTraversal &&
      targetIndex > currentIndex
    ) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Stop forward traversal on siblings earlier than target also blocks progression
    if (traversalStopIndex !== -1 && targetIndex > traversalStopIndex) {
      return { valid: false, exception: "NB.2.1-11" };
    }

    // Do not skip mandatory incomplete siblings when moving forward ONLY if forwardOnly=true
    // Per SCORM 2004 spec: When choice=true and forwardOnly=false, learner can select any activity
    // The mandatory sibling constraint only applies to forced-sequential navigation patterns
    if (targetIndex > currentIndex && ancestor.sequencingControls.forwardOnly) {
      for (let i = currentIndex + 1; i < targetIndex; i++) {
        const between = children[i];
        if (!between) {
          continue;
        }

        if (between.sequencingControls.stopForwardTraversal) {
          return { valid: false, exception: "NB.2.1-11" };
        }

        if (
          this.isActivityMandatory(between) &&
          !this.isActivityCompleted(between)
        ) {
          return { valid: false, exception: "NB.2.1-11" };
        }
      }
    }

    return { valid: true, exception: null };
  }

  private requiresNewActivation(
    branchRoot: Activity,
    targetActivity: Activity
  ): boolean {
    if (this.branchHasActiveAttempt(branchRoot)) {
      return false;
    }

    if (targetActivity.activityAttemptActive || targetActivity.isActive) {
      return false;
    }

    return true;
  }

  private branchHasActiveAttempt(activity: Activity): boolean {
    if (activity.activityAttemptActive || activity.isActive) {
      return true;
    }

    for (const child of activity.children) {
      if (this.branchHasActiveAttempt(child)) {
        return true;
      }
    }

    return false;
  }

  /** Helper: mandatory activity detection (mirrors SequencingProcess behavior) */
  private isActivityMandatory(activity: Activity): boolean {
    if (!activity.isAvailable || activity.isHiddenFromChoice) {
      return false;
    }

    const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
    if (
      preConditionResult === RuleActionType.SKIP ||
      preConditionResult === RuleActionType.DISABLED ||
      preConditionResult === RuleActionType.HIDE_FROM_CHOICE ||
      preConditionResult === RuleActionType.STOP_FORWARD_TRAVERSAL
    ) {
      return false;
    }

    if (this.isActivityDisabled(activity)) {
      return false;
    }

    return (activity as any).mandatory !== false;
  }

  /** Helper: completed-state check (mirrors SequencingProcess behavior) */
  private isActivityCompleted(activity: Activity): boolean {
    if (!activity.isAvailable || activity.isHiddenFromChoice) {
      return true;
    }

    const preConditionResult = this.evaluatePreConditionRulesForChoice(activity);
    if (
      preConditionResult === RuleActionType.SKIP ||
      preConditionResult === RuleActionType.DISABLED ||
      preConditionResult === RuleActionType.HIDE_FROM_CHOICE ||
      preConditionResult === RuleActionType.STOP_FORWARD_TRAVERSAL
    ) {
      return true;
    }

    if (this.isActivityDisabled(activity)) {
      return true;
    }

    return (
      activity.completionStatus === "completed" ||
      (activity as any).successStatus === "passed" ||
      activity.successStatus === "passed"
    );
  }

  /**
   * Evaluate pre-condition rules for choice navigation
   * @param {Activity} activity - Activity to evaluate
   * @return {string | null} - Rule result or null
   */
  private evaluatePreConditionRulesForChoice(
    activity: Activity
  ): RuleActionType | string | null {
    if (!activity.sequencingRules) {
      return null;
    }

    const action = activity.sequencingRules.evaluatePreConditionRules(activity);
    if (action) {
      return action;
    }

    return null;
  }

  /**
   * Update navigation validity in ADL nav
   * Called after activity delivery and after rollup to update navigation button states
   */
  public updateNavigationValidity(): void {
    if (!this.adlNav || !this.activityTree.currentActivity) {
      return;
    }

    // Invalidate look-ahead cache to ensure fresh calculations
    this.navigationLookAhead.invalidateCache();

    // Use NavigationLookAhead for Continue/Previous validity
    // This properly evaluates preConditionRules on target activities
    const continueValid = this.navigationLookAhead.predictContinueEnabled();
    try {
      this.adlNav.request_valid.continue = continueValid ? "true" : "false";
    } catch (e) {
      // Navigation validity might be read-only after init
    }

    const previousValid = this.navigationLookAhead.predictPreviousEnabled();
    try {
      this.adlNav.request_valid.previous = previousValid ? "true" : "false";
    } catch (e) {
      // Navigation validity might be read-only after init
    }

    // Compute per-target choice/jump validity and emit an event snapshot
    const allActivities = this.activityTree.getAllActivities();
    const choiceMap: { [key: string]: string } = {};
    const jumpMap: { [key: string]: string } = {};
    for (const act of allActivities) {
      const choiceRes = this.validateRequest(
        NavigationRequestType.CHOICE,
        act.id
      );
      choiceMap[act.id] = choiceRes.valid ? "true" : "false";
      const jumpRes = this.validateRequest(NavigationRequestType.JUMP, act.id);
      jumpMap[act.id] = jumpRes.valid ? "true" : "false";
    }
    // Best-effort update of adl.nav.request_valid maps (may be RO post-init)
    try {
      this.adlNav.request_valid.choice = choiceMap;
    } catch (e) {
      // Ignore read-only constraints on nav request_valid during runtime
    }
    try {
      this.adlNav.request_valid.jump = jumpMap;
    } catch (e) {
      // Ignore read-only constraints on nav request_valid during runtime
    }

    // Get effective hideLmsUi
    const hideLmsUi = this.getEffectiveHideLmsUiCallback
      ? this.getEffectiveHideLmsUiCallback(this.activityTree.currentActivity)
      : [];

    // Notify listeners so LMS can update UI regardless of read-only state
    this.fireEvent("onNavigationValidityUpdate", {
      continue: continueValid,
      previous: previousValid,
      choice: choiceMap,
      jump: jumpMap,
      hideLmsUi,
    });
  }

  /**
   * Get navigation look-ahead predictions
   * Provides UI with navigation button states before user interaction
   * @return {NavigationPredictions} - Current navigation predictions
   */
  public getAllPredictions(): NavigationPredictions {
    return this.navigationLookAhead.getAllPredictions();
  }

  /**
   * Predict if Continue navigation would succeed
   * @return {boolean} - True if Continue would succeed
   */
  public predictContinueEnabled(): boolean {
    return this.navigationLookAhead.predictContinueEnabled();
  }

  /**
   * Predict if Previous navigation would succeed
   * @return {boolean} - True if Previous would succeed
   */
  public predictPreviousEnabled(): boolean {
    return this.navigationLookAhead.predictPreviousEnabled();
  }

  /**
   * Predict if choice to specific activity would succeed
   * @param {string} activityId - Target activity ID
   * @return {boolean} - True if choice would succeed
   */
  public predictChoiceEnabled(activityId: string): boolean {
    return this.navigationLookAhead.predictChoiceEnabled(activityId);
  }

  /**
   * Get list of all activities that can be chosen
   * @return {string[]} - Array of activity IDs available for choice
   */
  public getAvailableChoices(): string[] {
    return this.navigationLookAhead.getAvailableChoices();
  }

  /**
   * Invalidate navigation prediction cache
   * Called when state changes that affect navigation
   */
  public invalidateCache(): void {
    this.navigationLookAhead.invalidateCache();
  }

  /**
   * Fire a sequencing event
   * @param {string} eventType - The type of event
   * @param {any} data - Event data
   */
  private fireEvent(eventType: string, data?: any): void {
    try {
      if (this.eventCallback) {
        this.eventCallback(eventType, data);
      }
    } catch (error) {
      console.warn(`Failed to fire sequencing event ${eventType}: ${error}`);
    }
  }
}
