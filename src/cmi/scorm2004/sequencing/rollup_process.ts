import {
  Activity,
  ActivityObjective,
  ObjectiveMapInfo,
  RollupConsiderationRequirement,
  RollupConsiderationsConfig,
} from "./activity";
import {RollupActionType, RollupConsiderationType, RollupRule} from "./rollup_rules";
import {CompletionStatus, SuccessStatus} from "../../../constants/enums";
import {scorm2004_regex} from "../../../constants/regex";
import {getDurationAsSeconds, getSecondsAsISODuration} from "../../../utilities";

/**
 * Enhanced Rollup Process implementation for SCORM 2004 sequencing
 * Priority 5 Gap: Comprehensive rollup with global objective mapping and complex weighting
 * Handles all rollup operations including measure, objective, and progress rollup
 */
export class RollupProcess {
  private rollupStateLog: Array<{ activity: string, timestamp: string, state: any }> = [];
  private eventCallback: ((eventType: string, data?: any) => void) | null = null;

  constructor(eventCallback?: (eventType: string, data?: any) => void) {
    this.eventCallback = eventCallback || null;
  }

  /**
   * Overall Rollup Process (RB.1.5)
   * Performs rollup from a given activity up through its ancestors
   * OPTIMIZATION: Stops propagating rollup when status stops changing (SCORM 2004 4.6.1)
   * @param {Activity} activity - The activity to start rollup from
   * @return {Activity[]} - Array of activities that had status changes
   */
  public overallRollupProcess(activity: Activity): Activity[] {
    const affectedActivities: Activity[] = [];
    let currentActivity: Activity | null = activity.parent; // Start from parent, not the activity itself
    let onlyDurationRollup = false;
    let isFirst = true;

    // Process rollup up the tree from parent to root
    while (currentActivity) {
      // Duration rollup happens FIRST, ALWAYS for cluster activities
      // This happens even when optimization is active for other rollup types
      if (currentActivity.children.length > 0) {
        this.durationRollupProcess(currentActivity);
      }

      if (!onlyDurationRollup) {
        // Capture status BEFORE rollup
        const beforeStatus = currentActivity.captureRollupStatus();

        // Only perform rollup if the activity tracks status
        if (currentActivity.sequencingControls.rollupObjectiveSatisfied ||
            currentActivity.sequencingControls.rollupProgressCompletion) {

          // Step 1: Measure Rollup Process (RB.1.1)
          if (currentActivity.children.length > 0) {
            this.measureRollupProcess(currentActivity);
            // Step 1b: Completion Measure Rollup Process (RB.1.1 b)
            this.completionMeasureRollupProcess(currentActivity);
          }

          // Step 2: Objective Rollup Process (RB.1.2)
          if (currentActivity.sequencingControls.rollupObjectiveSatisfied) {
            this.objectiveRollupProcess(currentActivity);
          }

          // Step 3: Activity Progress Rollup Process (RB.1.3)
          if (currentActivity.sequencingControls.rollupProgressCompletion) {
            this.activityProgressRollupProcess(currentActivity);
          }
        }

        // Capture status AFTER rollup
        const afterStatus = currentActivity.captureRollupStatus();

        // OPTIMIZATION: Check if anything changed (skip first iteration)
        // The first activity always gets processed regardless of change
        if (!isFirst) {
          const changed = !Activity.compareRollupStatus(beforeStatus, afterStatus);
          if (!changed) {
            // No changes detected - activate optimization
            this.eventCallback?.("rollup_optimization_activated", {
              activityId: currentActivity.id,
              depth: affectedActivities.length
            });
            onlyDurationRollup = true;
          }
        }

        // Add to affected activities if status changed or is first iteration
        if (isFirst || !Activity.compareRollupStatus(beforeStatus, afterStatus)) {
          affectedActivities.push(currentActivity);
        }
      }

      // Move up the tree
      currentActivity = currentActivity.parent;
      isFirst = false;
    }

    return affectedActivities;
  }

  /**
   * Measure Rollup Process (RB.1.1)
   * Rolls up objective measure (score) from children to parent
   * INTEGRATION: Uses complex weighted measure calculation
   * @param {Activity} activity - The parent activity
   */
  private measureRollupProcess(activity: Activity): void {
    if (!activity.sequencingControls.rollupObjectiveSatisfied) {
      return;
    }

    const children = activity.getAvailableChildren();
    if (children.length === 0) {
      return;
    }

    const rollupConsiderations = activity.rollupConsiderations;
    const contributingChildren = children.filter((child) => {
      if (!this.checkChildForRollupSubprocess(child, "measure")) {
        return false;
      }
      if (!child.objectiveMeasureStatus || child.objectiveNormalizedMeasure === null) {
        return false;
      }
      if (!rollupConsiderations.measureSatisfactionIfActive && (child.activityAttemptActive || child.isActive)) {
        return false;
      }
      return true;
    });

    if (contributingChildren.length === 0) {
      activity.objectiveMeasureStatus = false;
      return;
    }

    const complexWeightedMeasure = this.calculateComplexWeightedMeasure(
        activity,
        contributingChildren,
        {enableThresholdBias: false},
    );
    activity.objectiveNormalizedMeasure = complexWeightedMeasure;
    activity.objectiveMeasureStatus = true;

    // INTEGRATION: Process cross-cluster dependencies if dealing with activity clusters
    const clusters = this.identifyActivityClusters(contributingChildren);
    if (clusters.length > 1) {
      this.processCrossClusterDependencies(activity, clusters);
    }
  }

  /**
   * Objective Rollup Process (RB.1.2)
   * Determines objective satisfaction status using rules, measure, or default
   * @param {Activity} activity - The parent activity
   */
  private objectiveRollupProcess(activity: Activity): void {
    const rollupRules = activity.rollupRules;

    // First, try rollup using rules (RB.1.2.b)
    const ruleResult = this.objectiveRollupUsingRules(activity, rollupRules.rules);
    if (ruleResult !== null) {
      activity.objectiveSatisfiedStatus = ruleResult;
      // Do NOT set objectiveMeasureStatus here - rule-based rollup doesn't involve measures
      // Per SCORM 2004 SN Book RB.1.2.b, only satisfaction status is determined by rules
      this.syncPrimaryObjectiveFromActivity(activity);
      return;
    }

    // Then, try rollup using measure (RB.1.2.a)
    const measureResult = this.objectiveRollupUsingMeasure(activity);
    if (measureResult !== null) {
      activity.objectiveSatisfiedStatus = measureResult;
      // measureStatus is already true from measureRollupProcess (which ran first)
      this.syncPrimaryObjectiveFromActivity(activity);
      return;
    }

    // Finally, use default rollup (RB.1.2.c)
    activity.objectiveSatisfiedStatus = this.objectiveRollupUsingDefault(activity);
    // Do NOT set objectiveMeasureStatus here - default rollup doesn't involve measures
    // Per SCORM 2004 SN Book RB.1.2.c, only satisfaction status is determined by default rollup
    this.syncPrimaryObjectiveFromActivity(activity);
  }

  /**
   * Sync primary objective status from activity properties
   * Ensures the primary objective reflects the activity's rollup-derived status
   */
  private syncPrimaryObjectiveFromActivity(activity: Activity): void {
    if (activity.primaryObjective) {
      activity.primaryObjective.satisfiedStatus = activity.objectiveSatisfiedStatus;
      activity.primaryObjective.satisfiedStatusKnown = activity.objectiveSatisfiedStatusKnown;
      activity.primaryObjective.measureStatus = activity.objectiveMeasureStatus;
      activity.primaryObjective.normalizedMeasure = activity.objectiveNormalizedMeasure;
      activity.primaryObjective.progressMeasure = activity.progressMeasure;
      activity.primaryObjective.progressMeasureStatus = activity.progressMeasureStatus;
      activity.primaryObjective.completionStatus = activity.completionStatus;
    }
  }

  /**
   * Objective Rollup Using Rules (RB.1.2.b)
   * @param {Activity} activity - The parent activity
   * @param {RollupRule[]} rules - The rollup rules to evaluate
   * @return {boolean | null} - True if satisfied, false if not, null if no rule applies
   */
  private objectiveRollupUsingRules(activity: Activity, rules: RollupRule[]): boolean | null {
    // Get satisfied and not satisfied rules
    const satisfiedRules = rules.filter(rule =>
        rule.action === RollupActionType.SATISFIED
    );

    const notSatisfiedRules = rules.filter(rule =>
        rule.action === RollupActionType.NOT_SATISFIED
    );

    // Evaluate satisfied rules first
    for (const rule of satisfiedRules) {
      if (this.evaluateRollupRule(activity, rule)) {
        return true;
      }
    }

    // Then evaluate not satisfied rules
    for (const rule of notSatisfiedRules) {
      if (this.evaluateRollupRule(activity, rule)) {
        return false;
      }
    }

    return null;
  }

  /**
   * Objective Rollup Using Measure (RB.1.2.a)
   * @param {Activity} activity - The parent activity
   * @return {boolean | null} - True if satisfied, false if not, null if no measure
   */
  private objectiveRollupUsingMeasure(activity: Activity): boolean | null {
    if (!activity.objectiveMeasureStatus || activity.scaledPassingScore === null) {
      return null;
    }

    return activity.objectiveNormalizedMeasure >= activity.scaledPassingScore;
  }

  /**
   * Objective Rollup Using Default (RB.1.2.c)
   * For default rollup (no explicit rules), a child is included only if it
   * passes BOTH requiredForSatisfied AND requiredForNotSatisfied considerations.
   * This ensures symmetric exclusion: setting either consideration excludes
   * the child from the entire objective rollup evaluation.
   * @param {Activity} activity - The parent activity
   * @return {boolean} - True if all tracked children are satisfied
   */
  private objectiveRollupUsingDefault(activity: Activity): boolean {
    const children = activity.getAvailableChildren();
    if (children.length === 0) {
      return false;
    }

    const considerations = activity.rollupConsiderations;

    // For default rollup, use INTERSECTION of both consideration filters.
    // A child must pass BOTH requiredForSatisfied AND requiredForNotSatisfied
    // to contribute to the rollup. This ensures that setting either
    // consideration (e.g., ifNotSuspended, ifNotSkipped) excludes the child
    // from the entire default objective rollup evaluation.
    const contributors = children.filter((child) => {
      // Check both consideration filters
      if (!this.checkChildForRollupSubprocess(child, "objective", "satisfied") ||
          !this.checkChildForRollupSubprocess(child, "objective", "notSatisfied")) {
        return false;
      }

      // Check parent-level measureSatisfactionIfActive setting
      if (!considerations.measureSatisfactionIfActive &&
          (child.activityAttemptActive || child.isActive)) {
        return false;
      }

      return true;
    });

    if (contributors.length === 0) {
      return false;
    }

    // Default rollup logic:
    // - Parent is "not satisfied" if ANY contributor is not satisfied
    // - Parent is "satisfied" if ALL contributors are satisfied
    if (contributors.some((child) => !this.isChildSatisfiedForRollup(child))) {
      return false;
    }

    return contributors.every((child) => this.isChildSatisfiedForRollup(child));
  }

  /**
   * Completion Measure Rollup Process (RB.1.1 b)
   * Rolls up attemptCompletionAmount from children to parent using weighted averaging
   * 4th Edition Addition: Supports completion measure rollup for progress tracking
   * @param {Activity} activity - The parent activity
   */
  private completionMeasureRollupProcess(activity: Activity): void {
    const children = activity.getAvailableChildren();
    if (children.length === 0) {
      return;
    }

    const contributingChildren = children.filter((child) => {
      return child.attemptCompletionAmountStatus;
    });

    if (contributingChildren.length === 0) {
      activity.attemptCompletionAmountStatus = false;
      return;
    }

    let totalWeightedMeasure = 0;
    let totalWeight = 0;

    for (const child of contributingChildren) {
      totalWeightedMeasure += child.attemptCompletionAmount * child.progressWeight;
      totalWeight += child.progressWeight;
    }

    if (totalWeight > 0) {
      activity.attemptCompletionAmount = totalWeightedMeasure / totalWeight;
      activity.attemptCompletionAmountStatus = true;
    }
  }

  /**
   * Activity Progress Rollup Using Measure (RB.1.3 a)
   * Determines completion status using attemptCompletionAmount threshold comparison
   * 4th Edition Addition: Measure-based completion determination
   * @param {Activity} activity - The activity to evaluate
   * @return {boolean} - True if measure-based evaluation was applied, false otherwise
   */
  private activityProgressRollupUsingMeasure(activity: Activity): boolean {
    // Only apply if completedByMeasure is enabled
    if (!activity.completedByMeasure) {
      return false;
    }

    // Check if we have valid completion amount data
    if (!activity.attemptCompletionAmountStatus) {
      activity.completionStatus = CompletionStatus.UNKNOWN;
      this.syncPrimaryObjectiveFromActivity(activity);
      return true;
    }

    // Compare completion amount against threshold
    if (activity.attemptCompletionAmount >= activity.minProgressMeasure) {
      activity.completionStatus = CompletionStatus.COMPLETED;
    } else {
      activity.completionStatus = CompletionStatus.INCOMPLETE;
    }

    this.syncPrimaryObjectiveFromActivity(activity);
    return true;
  }

  /**
   * Activity Progress Rollup Process (RB.1.3)
   * Determines activity completion status
   * MODIFIED: Now tries measure-based rollup first
   * @param {Activity} activity - The parent activity
   */
  private activityProgressRollupProcess(activity: Activity): void {
    // Try measure-based rollup first (RB.1.3 a)
    if (this.activityProgressRollupUsingMeasure(activity)) {
      return;
    }

    // Continue with rules-based rollup (original implementation)
    const rollupRules = activity.rollupRules;

    // Get completion rules
    const completedRules = rollupRules.rules.filter(rule =>
        rule.action === RollupActionType.COMPLETED
    );

    const incompleteRules = rollupRules.rules.filter(rule =>
        rule.action === RollupActionType.INCOMPLETE
    );

    // Evaluate completed rules first
    for (const rule of completedRules) {
      if (this.evaluateRollupRule(activity, rule)) {
        activity.completionStatus = "completed";
        this.syncPrimaryObjectiveFromActivity(activity);
        return;
      }
    }

    // Then evaluate incomplete rules
    for (const rule of incompleteRules) {
      if (this.evaluateRollupRule(activity, rule)) {
        activity.completionStatus = "incomplete";
        this.syncPrimaryObjectiveFromActivity(activity);
        return;
      }
    }

    // Default: completed if all tracked children are completed
    // For default rollup, use INTERSECTION of both consideration filters.
    // A child must pass BOTH requiredForCompleted AND requiredForIncomplete
    // to contribute to the rollup. This ensures symmetric exclusion.
    const children = activity.getAvailableChildren();
    const contributors = children.filter((child) =>
        this.checkChildForRollupSubprocess(child, "progress", "completed") &&
        this.checkChildForRollupSubprocess(child, "progress", "incomplete"),
    );

    if (contributors.length === 0) {
      activity.completionStatus = "incomplete";
      this.syncPrimaryObjectiveFromActivity(activity);
      return;
    }

    // Default progress rollup logic:
    // - Parent is "incomplete" if ANY contributor is incomplete
    // - Parent is "completed" if ALL contributors are completed
    if (contributors.some((child) => !this.isChildCompletedForRollup(child))) {
      activity.completionStatus = "incomplete";
      this.syncPrimaryObjectiveFromActivity(activity);
      return;
    }

    activity.completionStatus = "completed";
    this.syncPrimaryObjectiveFromActivity(activity);
  }

  /**
   * Duration Rollup Process
   * Aggregates duration information from child activities to parent cluster
   * Called ALWAYS for cluster activities, even when other rollup is skipped due to optimization
   * Reference: Overall Rollup Process [RB.1.5] - duration rollup happens before optimization check
   *
   * @param {Activity} activity - The parent cluster activity
   */
  private durationRollupProcess(activity: Activity): void {
    // Only process cluster activities (non-leaf)
    if (activity.children.length === 0) {
      return;
    }

    const children = activity.getAvailableChildren();

    // No children available, nothing to rollup
    if (children.length === 0) {
      return;
    }

    let earliestChildActivityStartTimestampUtc: string | null = null;
    let earliestChildAttemptStartTimestampUtc: string | null = null;
    let latestChildEndDate: Date | null = null;
    let latestAttemptChildEndDate: Date | null = null;

    // Aggregate experienced durations (in seconds for easier math)
    let childrenActivityExperiencedDurationSeconds = 0;
    let childrenAttemptExperiencedDurationSeconds = 0;

    // Process each child
    for (const child of children) {
      // Track earliest activity start timestamp
      if (child.activityStartTimestampUtc) {
        if (!earliestChildActivityStartTimestampUtc ||
            child.activityStartTimestampUtc < earliestChildActivityStartTimestampUtc) {
          earliestChildActivityStartTimestampUtc = child.activityStartTimestampUtc;
        }
      }

      // Track latest activity end date
      if (child.activityEndedDate) {
        if (!latestChildEndDate || child.activityEndedDate > latestChildEndDate) {
          latestChildEndDate = child.activityEndedDate;
        }
      }

      // Aggregate activity experienced duration
      // Use Value field if available (for cluster activities), otherwise use regular field (for leaf activities)
      const activityDuration = child.activityExperiencedDurationValue !== "PT0H0M0S"
          ? child.activityExperiencedDurationValue
          : child.activityExperiencedDuration;

      if (activityDuration && activityDuration !== "PT0H0M0S") {
        childrenActivityExperiencedDurationSeconds += getDurationAsSeconds(
            activityDuration,
            scorm2004_regex.CMITimespan
        );
      }

      // Check if child is in same attempt as parent
      // (child attempt started after or at same time as parent attempt start)
      const isChildInSameAttempt = !activity.attemptStartTimestampUtc ||
          (child.attemptStartTimestampUtc &&
              child.attemptStartTimestampUtc >= activity.attemptStartTimestampUtc);

      if (isChildInSameAttempt) {
        // Track earliest attempt start timestamp
        if (child.attemptStartTimestampUtc) {
          if (!earliestChildAttemptStartTimestampUtc ||
              child.attemptStartTimestampUtc < earliestChildAttemptStartTimestampUtc) {
            earliestChildAttemptStartTimestampUtc = child.attemptStartTimestampUtc;
          }
        }

        // Track latest attempt end date
        if (child.activityEndedDate) {
          if (!latestAttemptChildEndDate ||
              child.activityEndedDate > latestAttemptChildEndDate) {
            latestAttemptChildEndDate = child.activityEndedDate;
          }
        }

        // Aggregate attempt experienced duration
        // Use Value field if available (for cluster activities), otherwise use regular field (for leaf activities)
        const attemptDuration = child.attemptExperiencedDurationValue !== "PT0H0M0S"
            ? child.attemptExperiencedDurationValue
            : child.attemptExperiencedDuration;

        if (attemptDuration && attemptDuration !== "PT0H0M0S") {
          childrenAttemptExperiencedDurationSeconds += getDurationAsSeconds(
              attemptDuration,
              scorm2004_regex.CMITimespan
          );
        }
      }
    }

    // Update parent activity timestamps and durations if we found any child data
    if (earliestChildActivityStartTimestampUtc !== null) {
      // Set earliest start timestamps
      activity.activityStartTimestampUtc = earliestChildActivityStartTimestampUtc;

      if (!activity.attemptStartTimestampUtc && earliestChildAttemptStartTimestampUtc) {
        activity.attemptStartTimestampUtc = earliestChildAttemptStartTimestampUtc;
      }

      // Set latest end date
      activity.activityEndedDate = latestChildEndDate;

      // Calculate absolute durations (wall clock time)
      if (latestChildEndDate && activity.activityStartTimestampUtc) {
        const startDate = new Date(activity.activityStartTimestampUtc);
        const durationMs = latestChildEndDate.getTime() - startDate.getTime();
        const durationSeconds = Math.max(0, durationMs / 1000);
        activity.activityAbsoluteDurationValue = getSecondsAsISODuration(durationSeconds);
      }

      if (latestAttemptChildEndDate && activity.attemptStartTimestampUtc) {
        const startDate = new Date(activity.attemptStartTimestampUtc);
        const durationMs = latestAttemptChildEndDate.getTime() - startDate.getTime();
        const durationSeconds = Math.max(0, durationMs / 1000);
        activity.attemptAbsoluteDurationValue = getSecondsAsISODuration(durationSeconds);
      }

      // Set aggregated experienced durations
      activity.activityExperiencedDurationValue = getSecondsAsISODuration(
          childrenActivityExperiencedDurationSeconds
      );
      activity.attemptExperiencedDurationValue = getSecondsAsISODuration(
          childrenAttemptExperiencedDurationSeconds
      );

      // Fire event for monitoring
      this.eventCallback?.("duration_rollup_completed", {
        activityId: activity.id,
        activityAbsoluteDuration: activity.activityAbsoluteDurationValue,
        attemptAbsoluteDuration: activity.attemptAbsoluteDurationValue,
        activityExperiencedDuration: activity.activityExperiencedDurationValue,
        attemptExperiencedDuration: activity.attemptExperiencedDurationValue,
        childCount: children.length
      });
    }
  }

  /**
   * Get trackable children for rollup operations
   * Filters out activities with tracked=false from rollup calculations
   * @param {Activity} activity - The parent activity
   * @return {Activity[]} - Array of trackable children
   */
  private getTrackableChildren(activity: Activity): Activity[] {
    return activity.children.filter(child =>
        child.sequencingControls.tracked !== false
    );
  }

  /**
   * Check Child For Rollup Subprocess (RB.1.4.2)
   * Determines if a child activity contributes to rollup based on its individual consideration settings
   * This implements the full SCORM 2004 RB.1.4.2 specification
   * @param {Activity} child - The child activity to check
   * @param {string} rollupType - Type of rollup ("measure", "objective", "progress")
   * @param {string} [rollupAction] - Specific rollup action (satisfied, notSatisfied, completed, incomplete)
   * @return {boolean} - True if child contributes to rollup
   */
  private checkChildForRollupSubprocess(
      child: Activity,
      rollupType: string,
      rollupAction?: string
  ): boolean {
    // First check if child is tracked
    if (child.sequencingControls.tracked === false) {
      return false;
    }

    let included = false;

    // RB.1.4.2 Step 2: Check for objective rollup (satisfied/notSatisfied)
    if (rollupType === "measure" || rollupType === "objective") {
      // Step 2.1: Check if child tracks objective rollup
      if (!child.sequencingControls.rollupObjectiveSatisfied) {
        return false;
      }

      // Step 2.1.1: Default to included
      included = true;

      // Get the child's individual consideration requirements
      const requiredForSatisfied = child.requiredForSatisfied;
      const requiredForNotSatisfied = child.requiredForNotSatisfied;

      // Step 2.1.2: Check ifNotSuspended consideration
      if (
          (rollupAction === "satisfied" && requiredForSatisfied === "ifNotSuspended") ||
          (rollupAction === "notSatisfied" && requiredForNotSatisfied === "ifNotSuspended")
      ) {
        // Step 2.1.2.1: Exclude if not attempted or if attempted and suspended
        if (!child.attemptProgressStatus || (child.attemptCount > 0 && child.isSuspended)) {
          included = false;
        }
      }
      // Step 2.1.3: Check ifAttempted consideration
      else if (
          (rollupAction === "satisfied" && requiredForSatisfied === "ifAttempted") ||
          (rollupAction === "notSatisfied" && requiredForNotSatisfied === "ifAttempted")
      ) {
        // Step 2.1.3.1.1: Exclude if not attempted
        if (!child.attemptProgressStatus || child.attemptCount === 0) {
          included = false;
        }
      }
      // Step 2.1.3.2: Check ifNotSkipped consideration
      else if (
          (rollupAction === "satisfied" && requiredForSatisfied === "ifNotSkipped") ||
          (rollupAction === "notSatisfied" && requiredForNotSatisfied === "ifNotSkipped")
      ) {
        // Step 2.1.3.2.1: Exclude if activity is skipped
        if (child.wasSkipped) {
          included = false;
        }
      }
      // "always" is the default - activity is included
    }

    // RB.1.4.2 Step 3: Check for progress rollup (completed/incomplete)
    if (rollupType === "progress") {
      // Step 3.1: Check if child tracks progress rollup
      if (!child.sequencingControls.rollupProgressCompletion) {
        return false;
      }

      // Step 3.1.1: Default to included
      included = true;

      // Get the child's individual consideration requirements
      const requiredForCompleted = child.requiredForCompleted;
      const requiredForIncomplete = child.requiredForIncomplete;

      // Step 3.1.2: Check ifNotSuspended consideration
      if (
          (rollupAction === "completed" && requiredForCompleted === "ifNotSuspended") ||
          (rollupAction === "incomplete" && requiredForIncomplete === "ifNotSuspended")
      ) {
        // Step 3.1.2.1: Exclude if not attempted or if attempted and suspended
        if (!child.attemptProgressStatus || (child.attemptCount > 0 && child.isSuspended)) {
          included = false;
        }
      }
      // Step 3.1.3: Check ifAttempted consideration
      else if (
          (rollupAction === "completed" && requiredForCompleted === "ifAttempted") ||
          (rollupAction === "incomplete" && requiredForIncomplete === "ifAttempted")
      ) {
        // Step 3.1.3.1.1: Exclude if not attempted
        if (!child.attemptProgressStatus || child.attemptCount === 0) {
          included = false;
        }
      }
      // Step 3.1.3.2: Check ifNotSkipped consideration
      else if (
          (rollupAction === "completed" && requiredForCompleted === "ifNotSkipped") ||
          (rollupAction === "incomplete" && requiredForIncomplete === "ifNotSkipped")
      ) {
        // Step 3.1.3.2.1: Exclude if activity is skipped
        if (child.wasSkipped) {
          included = false;
        }
      }
      // "always" is the default - activity is included
    }

    // Check if child is available for rollup (additional safety check)
    if (included && !child.isAvailable) {
      return false;
    }

    return included;
  }

  private filterChildrenForRequirement(
      children: Activity[],
      requirement: RollupConsiderationRequirement,
      rollupType: "objective" | "progress",
      mode: "satisfied" | "notSatisfied" | "completed" | "incomplete",
      considerations: RollupConsiderationsConfig,
  ): Activity[] {
    return children.filter((child) =>
        this.shouldIncludeChildForRollup(child, requirement, rollupType, mode, considerations),
    );
  }

  private shouldIncludeChildForRollup(
      child: Activity,
      requirement: RollupConsiderationRequirement,
      rollupType: "objective" | "progress",
      mode: "satisfied" | "notSatisfied" | "completed" | "incomplete",
      considerations: RollupConsiderationsConfig,
  ): boolean {
    // Use the enhanced RB.1.4.2 implementation with rollupAction parameter
    if (!this.checkChildForRollupSubprocess(child, rollupType, mode)) {
      return false;
    }

    // Check parent-level measureSatisfactionIfActive setting
    if (
        rollupType === "objective" &&
        !considerations.measureSatisfactionIfActive &&
        (child.activityAttemptActive || child.isActive)
    ) {
      return false;
    }

    return true;
  }

  private isChildSatisfiedForRollup(child: Activity): boolean {
    if (child.objectiveSatisfiedStatus === true) {
      return true;
    }

    if (child.objectiveSatisfiedStatus === false) {
      return false;
    }

    if (child.successStatus === SuccessStatus.PASSED) {
      return true;
    }

    if (child.successStatus === SuccessStatus.FAILED) {
      return false;
    }

    return false;
  }

  private isChildCompletedForRollup(child: Activity): boolean {
    if (child.completionStatus === "completed" || child.isCompleted) {
      return true;
    }

    return false;
  }

  /**
   * Evaluate a rollup rule
   * @param {Activity} activity - The parent activity
   * @param {RollupRule} rule - The rule to evaluate
   * @return {boolean} - True if the rule applies
   */
  private evaluateRollupRule(activity: Activity, rule: RollupRule): boolean {
    const children = activity.getAvailableChildren();
    let contributingChildren = 0;
    let satisfiedCount = 0;

    // Count children that meet the rule conditions
    // IMPORTANT: Only count children that BOTH pass consideration check AND condition check
    for (const child of children) {
      // Step 1: Check if child is included based on consideration settings (RB.1.4.2)
      let isIncluded = false;
      switch (rule.action) {
        case RollupActionType.SATISFIED:
          isIncluded = this.checkChildForRollupSubprocess(child, "objective", "satisfied");
          break;
        case RollupActionType.NOT_SATISFIED:
          isIncluded = this.checkChildForRollupSubprocess(child, "objective", "notSatisfied");
          break;
        case RollupActionType.COMPLETED:
          isIncluded = this.checkChildForRollupSubprocess(child, "progress", "completed");
          break;
        case RollupActionType.INCOMPLETE:
          isIncluded = this.checkChildForRollupSubprocess(child, "progress", "incomplete");
          break;
      }

      // Step 2: Only count if child is included by consideration settings
      if (isIncluded) {
        contributingChildren++;

        // Step 3: Evaluate rule conditions for this child using RB.1.4.1
        if (this.evaluateRollupConditionsSubprocess(child, rule)) {
          satisfiedCount++;
        }
      }
    }

    // Apply minimum count/percent logic OR consideration type
    if (rule.consideration === RollupConsiderationType.ALL) {
      // For ALL consideration, all contributing children must satisfy
      return contributingChildren > 0 && satisfiedCount === contributingChildren;
    } else if (rule.minimumCount !== null) {
      return satisfiedCount >= rule.minimumCount;
    } else if (rule.minimumPercent !== null) {
      const percent = contributingChildren > 0 ? (satisfiedCount / contributingChildren) : 0;
      return percent >= rule.minimumPercent;
    }

    // Default: all contributing children must satisfy
    return contributingChildren > 0 && satisfiedCount === contributingChildren;
  }

  /**
   * Evaluate Rollup Conditions Subprocess (RB.1.4.1)
   * Evaluates if rollup rule conditions are met for a given activity
   * @param {Activity} child - The child activity to evaluate
   * @param {RollupRule} rule - The rollup rule containing conditions to evaluate
   * @return {boolean} - True if all conditions are met, false otherwise
   */
  private evaluateRollupConditionsSubprocess(child: Activity, rule: RollupRule): boolean {
    // If no conditions are specified, the rule always applies
    if (rule.conditions.length === 0) {
      return true;
    }

    // Evaluate based on the rule's consideration type
    switch (rule.consideration) {
      case RollupConsiderationType.ALL:
        // All conditions must be met
        return rule.conditions.every(condition => condition.evaluate(child));

      case RollupConsiderationType.ANY:
        // At least one condition must be met
        return rule.conditions.some(condition => condition.evaluate(child));

      case RollupConsiderationType.NONE:
        // No conditions should be met
        return !rule.conditions.some(condition => condition.evaluate(child));

      case RollupConsiderationType.AT_LEAST_COUNT:
      case RollupConsiderationType.AT_LEAST_PERCENT:
        // These are handled at the rule level, not condition level
        // For individual condition evaluation, treat as ALL
        return rule.conditions.every(condition => condition.evaluate(child));

      default:
        // Unknown consideration type, default to false
        return false;
    }
  }

  /**
   * Priority 5 Gap: Validate rollup state consistency across the activity tree
   * Ensures that rollup states are consistent and valid before processing
   * @param {Activity} rootActivity - The root activity to validate from
   * @return {boolean} - True if state is consistent, false otherwise
   */
  public validateRollupStateConsistency(rootActivity: Activity): boolean {
    try {
      this.eventCallback?.("rollup_validation_started", {
        activityId: rootActivity.id,
        timestamp: new Date().toISOString()
      });

      const inconsistencies: string[] = [];

      // Validate the entire tree recursively
      this.validateActivityRollupState(rootActivity, inconsistencies);

      if (inconsistencies.length > 0) {
        this.eventCallback?.("rollup_state_inconsistencies", {
          activityId: rootActivity.id,
          inconsistencies,
          count: inconsistencies.length
        });
        return false;
      }

      this.eventCallback?.("rollup_validation_completed", {
        activityId: rootActivity.id,
        result: "consistent"
      });
      return true;
    } catch (error) {
      this.eventCallback?.("rollup_validation_error", {
        activityId: rootActivity.id,
        error: error instanceof Error ? error.message : String(error)
      });
      return false;
    }
  }

  /**
   * Priority 5 Gap: Process global objective mapping for shared objectives
   * Handles cross-activity objective synchronization and global state management
   *
   * IMPORTANT: Uses two-pass approach to ensure correct synchronization order:
   * 1. WRITE pass: All activities write their local state TO global objectives
   * 2. READ pass: All activities read FROM global objectives into local state
   *
   * This ensures that when activity A writes to a global and activity B reads from it,
   * B will see A's data regardless of tree traversal order.
   *
   * @param {Activity} activity - The root activity to start processing from
   * @param {Map<string, any>} globalObjectives - Global objective map
   */
  public processGlobalObjectiveMapping(activity: Activity, globalObjectives: Map<string, any>): void {
    try {
      this.eventCallback?.("global_objective_processing_started", {
        activityId: activity.id,
        globalObjectiveCount: globalObjectives.size
      });

      // Collect all activities in the tree for two-pass processing
      const allActivities: Activity[] = [];
      this.collectActivitiesRecursive(activity, allActivities);

      // Pass 1: WRITE - All activities write their local state to global objectives
      // This ensures all writes happen before any reads
      for (const act of allActivities) {
        this.syncGlobalObjectivesWritePhase(act, globalObjectives);
      }

      // Pass 2: READ - All activities read from global objectives into local state
      // Now reads can see all writes from all activities
      for (const act of allActivities) {
        this.syncGlobalObjectivesReadPhase(act, globalObjectives);
      }

      this.eventCallback?.("global_objective_processing_completed", {
        activityId: activity.id,
        processedObjectives: globalObjectives.size
      });
    } catch (error) {
      this.eventCallback?.("global_objective_processing_error", {
        activityId: activity.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Collect all activities in the tree recursively
   */
  private collectActivitiesRecursive(activity: Activity, result: Activity[]): void {
    result.push(activity);
    for (const child of activity.children) {
      this.collectActivitiesRecursive(child, result);
    }
  }

  /**
   * Write phase: Write local objective state TO global objectives
   */
  private syncGlobalObjectivesWritePhase(activity: Activity, globalObjectives: Map<string, any>): void {
    const objectives = activity.getAllObjectives();

    for (const objective of objectives) {
      const mapInfos = objective.mapInfo.length > 0
          ? objective.mapInfo
          : [this.createDefaultMapInfo(objective)];

      for (const mapInfo of mapInfos) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const globalObjective = this.ensureGlobalObjectiveEntry(globalObjectives, targetId, objective, mapInfo);

        // Only do WRITE operations in this phase
        // Only write if the objective property has been modified (dirty flag set)
        if (mapInfo.writeSatisfiedStatus && objective.measureStatus && objective.isDirty('satisfiedStatus')) {
          globalObjective.satisfiedStatus = objective.satisfiedStatus;
          globalObjective.satisfiedStatusKnown = true;
          objective.clearDirty('satisfiedStatus');
        }

        if (mapInfo.writeNormalizedMeasure && objective.measureStatus && objective.isDirty('normalizedMeasure')) {
          globalObjective.normalizedMeasure = objective.normalizedMeasure;
          globalObjective.normalizedMeasureKnown = true;
          objective.clearDirty('normalizedMeasure');

          if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
            const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
            globalObjective.satisfiedStatus = objective.normalizedMeasure >= threshold;
            globalObjective.satisfiedStatusKnown = true;
          }
        }

        if (mapInfo.writeCompletionStatus && objective.completionStatus !== CompletionStatus.UNKNOWN && objective.isDirty('completionStatus')) {
          globalObjective.completionStatus = objective.completionStatus;
          globalObjective.completionStatusKnown = true;
          objective.clearDirty('completionStatus');
        }

        if (mapInfo.writeProgressMeasure && objective.progressMeasureStatus && objective.isDirty('progressMeasure')) {
          globalObjective.progressMeasure = objective.progressMeasure;
          globalObjective.progressMeasureKnown = true;
          objective.clearDirty('progressMeasure');
        }

        if (mapInfo.updateAttemptData) {
          this.updateActivityAttemptData(activity, globalObjective, objective);
        }
      }
    }
  }

  /**
   * Read phase: Read FROM global objectives into local state
   */
  private syncGlobalObjectivesReadPhase(activity: Activity, globalObjectives: Map<string, any>): void {
    const objectives = activity.getAllObjectives();

    for (const objective of objectives) {
      const mapInfos = objective.mapInfo.length > 0
          ? objective.mapInfo
          : [this.createDefaultMapInfo(objective)];

      for (const mapInfo of mapInfos) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const globalObjective = globalObjectives.get(targetId);

        if (!globalObjective) continue;

        const isPrimary = objective.isPrimary;

        // Only do READ operations in this phase
        if (mapInfo.readSatisfiedStatus && globalObjective.satisfiedStatusKnown) {
          objective.satisfiedStatus = globalObjective.satisfiedStatus;
          objective.measureStatus = true;
        }

        if (mapInfo.readNormalizedMeasure && globalObjective.normalizedMeasureKnown) {
          objective.normalizedMeasure = globalObjective.normalizedMeasure;
          objective.measureStatus = true;

          if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
            const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
            objective.satisfiedStatus = globalObjective.normalizedMeasure >= threshold;
          }
        }

        if (mapInfo.readProgressMeasure && globalObjective.progressMeasureKnown) {
          objective.progressMeasure = globalObjective.progressMeasure;
          objective.progressMeasureStatus = true;
        }

        if (mapInfo.readCompletionStatus && globalObjective.completionStatusKnown) {
          objective.completionStatus = globalObjective.completionStatus as CompletionStatus;
        }

        // Apply primary objective changes to activity
        if (isPrimary) {
          objective.applyToActivity(activity);
        }

        // Fire synchronization event for monitoring/logging
        this.eventCallback?.("objective_synchronized", {
          activityId: activity.id,
          objectiveId: objective.id,
          globalState: globalObjective,
          synchronizationTime: new Date().toISOString()
        });
      }
    }
  }

  /**
   * Priority 5 Gap: Handle complex objective weighting scenarios
   * Supports weighted rollup calculations with complex dependency chains
   * INTEGRATION: Now properly integrated into measureRollupProcess
   * @param {Activity} activity - The parent activity
   * @param {Activity[]} children - Child activities to weight
   * @return {number} - Calculated weighted measure
   */
  public calculateComplexWeightedMeasure(
      activity: Activity,
      children: Activity[],
      options?: { enableThresholdBias?: boolean }
  ): number {
    let totalWeightedMeasure = 0;
    let totalWeight = 0;
    const weightingLog: Array<{ childId: string, measure: number, weight: number }> = [];
    const enableBias = options?.enableThresholdBias ?? true;

    for (const child of children) {
      if (!this.checkChildForRollupSubprocess(child, "measure")) {
        continue;
      }

      if (child.objectiveMeasureStatus && child.objectiveNormalizedMeasure !== null) {
        // Handle complex weighting scenarios
        const baseWeight = child.sequencingControls.objectiveMeasureWeight;
        const adjustedWeight = this.calculateAdjustedWeight(child, baseWeight, enableBias);
        const contribution = child.objectiveNormalizedMeasure * adjustedWeight;

        totalWeightedMeasure += contribution;
        totalWeight += adjustedWeight;

        weightingLog.push({
          childId: child.id,
          measure: child.objectiveNormalizedMeasure,
          weight: adjustedWeight
        });
      }
    }

    this.eventCallback?.("complex_weighting_calculated", {
      activityId: activity.id,
      weightingDetails: weightingLog,
      totalWeight,
      totalWeightedMeasure,
      result: totalWeight > 0 ? totalWeightedMeasure / totalWeight : 0
    });

    return totalWeight > 0 ? totalWeightedMeasure / totalWeight : 0;
  }

  /**
   * Priority 5 Gap: Handle cross-cluster dependencies in rollup
   * Manages dependencies between activity clusters for accurate rollup
   * INTEGRATION: Now properly integrated into rollup process
   * @param {Activity} activity - The activity to process
   * @param {Activity[]} clusters - Related activity clusters
   */
  public processCrossClusterDependencies(activity: Activity, clusters: Activity[]): void {
    try {
      this.eventCallback?.("cross_cluster_processing_started", {
        activityId: activity.id,
        clusterCount: clusters.length
      });

      const dependencyMap = new Map<string, string[]>();

      // Build dependency map across clusters
      for (const cluster of clusters) {
        this.analyzeCrossClusterDependencies(cluster, dependencyMap);
      }

      // Process dependencies in correct order
      const processOrder = this.resolveDependencyOrder(dependencyMap);

      for (const clusterId of processOrder) {
        const cluster = clusters.find(c => c.id === clusterId);
        if (cluster) {
          this.processClusterRollup(cluster);
        }
      }

      this.eventCallback?.("cross_cluster_processing_completed", {
        activityId: activity.id,
        processedClusters: processOrder.length,
        dependencyMap: Array.from(dependencyMap.entries())
      });
    } catch (error) {
      this.eventCallback?.("cross_cluster_processing_error", {
        activityId: activity.id,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  // Helper Methods for Priority 5 Gap Implementation

  /**
   * Validate rollup state for a single activity
   */
  private validateActivityRollupState(activity: Activity, inconsistencies: string[]): void {
    const activityId = activity.id;

    // Check measure status consistency
    if (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure === null) {
      inconsistencies.push(`Activity ${activityId}: measure status true but normalized measure is null`);
    }

    // Check satisfaction status consistency with measure (only when success status is known)
    if (
        activity.objectiveMeasureStatus &&
        activity.scaledPassingScore !== null &&
        activity.successStatus !== "unknown"
    ) {
      const expectedSatisfied = activity.objectiveNormalizedMeasure >= activity.scaledPassingScore;
      if (activity.objectiveSatisfiedStatus !== expectedSatisfied) {
        inconsistencies.push(`Activity ${activityId}: satisfaction status inconsistent with measure`);
      }
    }

    // Check rollup controls consistency
    const controls = activity.sequencingControls;
    // Note: Having rollup data without rollup controls enabled is valid (data from content)
    // We only flag it as inconsistent if the data seems to be from rollup
    if (!controls.rollupObjectiveSatisfied && !controls.rollupProgressCompletion) {
      // Only flag as inconsistent if this is a cluster with children
      // (leaf activities can have data set by content)
      if (activity.children.length > 0) {
        if (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure !== 0) {
          // Cluster has measure data but rollup is disabled - this could be inconsistent
          // unless it was set explicitly by content (which is unusual but valid)
        }
      }
    }

    // Check rollup consideration consistency (RB.1.4 enhancement)
    // Validate that consideration settings are appropriate for activity state
    if (activity.requiredForSatisfied === "ifAttempted" && activity.attemptCount === 0) {
      // Activity requires being attempted but hasn't been attempted
      // This is valid - just means it won't contribute to rollup yet
    }

    if (activity.requiredForSatisfied === "ifNotSuspended" && activity.isSuspended && activity.attemptCount > 0) {
      // Activity is suspended and won't contribute to satisfied rollup
      // This is valid - just means it's temporarily excluded
    }

    if (activity.requiredForSatisfied === "ifNotSkipped" && activity.wasSkipped) {
      // Activity was skipped and won't contribute to satisfied rollup
      // This is valid - just means it's excluded
    }

    // Check children consistency and their rollup contributions
    const children = activity.getAvailableChildren();

    // Validate parent's rolled-up state matches children's contributions
    if (children.length > 0 && controls.rollupObjectiveSatisfied) {
      const satisfiedChildren = children.filter(child =>
          this.checkChildForRollupSubprocess(child, "objective", "satisfied") &&
          this.isChildSatisfiedForRollup(child)
      );

      const notSatisfiedChildren = children.filter(child =>
          this.checkChildForRollupSubprocess(child, "objective", "notSatisfied") &&
          !this.isChildSatisfiedForRollup(child)
      );

      // If all contributing children are satisfied, parent should be satisfied
      if (satisfiedChildren.length > 0 && notSatisfiedChildren.length === 0) {
        if (activity.objectiveSatisfiedStatus === false && activity.rollupRules.rules.length === 0) {
          inconsistencies.push(
              `Activity ${activityId}: all children satisfied but parent is not satisfied (no rollup rules to override)`
          );
        }
      }
    }

    if (children.length > 0 && controls.rollupProgressCompletion) {
      const completedChildren = children.filter(child =>
          this.checkChildForRollupSubprocess(child, "progress", "completed") &&
          this.isChildCompletedForRollup(child)
      );

      const incompleteChildren = children.filter(child =>
          this.checkChildForRollupSubprocess(child, "progress", "incomplete") &&
          !this.isChildCompletedForRollup(child)
      );

      // If all contributing children are completed, parent should be completed
      if (completedChildren.length > 0 && incompleteChildren.length === 0) {
        if (activity.completionStatus !== "completed" && activity.rollupRules.rules.length === 0) {
          inconsistencies.push(
              `Activity ${activityId}: all children completed but parent is incomplete (no rollup rules to override)`
          );
        }
      }
    }

    // Recursively validate children
    for (const child of children) {
      this.validateActivityRollupState(child, inconsistencies);
    }

    // Log validation state
    this.rollupStateLog.push({
      activity: activityId,
      timestamp: new Date().toISOString(),
      state: {
        measureStatus: activity.objectiveMeasureStatus,
        measure: activity.objectiveNormalizedMeasure,
        satisfiedStatus: activity.objectiveSatisfiedStatus,
        completionStatus: activity.completionStatus
      }
    });
  }

  /**
   * Synchronize global objectives with activity-specific objectives
   */
  private synchronizeGlobalObjectives(activity: Activity, globalObjectives: Map<string, any>): void {
    const objectives = activity.getAllObjectives();

    for (const objective of objectives) {
      const mapInfos = objective.mapInfo.length > 0
          ? objective.mapInfo
          : [this.createDefaultMapInfo(objective)];

      for (const mapInfo of mapInfos) {
        const targetId = mapInfo.targetObjectiveID || objective.id;
        const globalObjective = this.ensureGlobalObjectiveEntry(globalObjectives, targetId, objective, mapInfo);
        this.syncObjectiveState(activity, objective, mapInfo, globalObjective);
      }
    }
  }

  /**
   * Calculate adjusted weight for complex weighting scenarios
   */
  private calculateAdjustedWeight(child: Activity, baseWeight: number, enableBias: boolean = true): number {
    let adjustedWeight = baseWeight;

    // Factor in completion status
    if (child.completionStatus !== "completed") {
      adjustedWeight *= 0.8; // Reduce weight for incomplete activities
    }

    // Factor in attempt count (penalize multiple attempts)
    if (child.attemptCount > 1) {
      const attemptPenalty = Math.max(0.5, 1 - (child.attemptCount - 1) * 0.1);
      adjustedWeight *= attemptPenalty;
    }

    // Factor in time limits if exceeded
    if (child.hasAttemptLimitExceeded()) {
      adjustedWeight *= 0.6; // Significant penalty for exceeding limits
    }

    // Bias by relation to passing threshold when available
    if (enableBias && child.objectiveMeasureStatus) {
      const threshold = child.scaledPassingScore ?? 0.7;
      if (child.objectiveNormalizedMeasure >= threshold) {
        adjustedWeight *= 1.05; // small boost for above-threshold performance
      } else {
        adjustedWeight *= 0.95; // small penalty for below-threshold performance
      }
    }

    return Math.max(0, adjustedWeight); // Ensure non-negative weight
  }

  /**
   * Analyze cross-cluster dependencies
   */
  private analyzeCrossClusterDependencies(cluster: Activity, dependencyMap: Map<string, string[]>): void {
    // Build dependency relationships based on sequencing rules and prerequisites
    const dependencies: string[] = [];

    // Check sequencing rules for dependencies
    const sequencingRules = cluster.sequencingRules;
    // Implementation would analyze rules to identify dependencies

    dependencyMap.set(cluster.id, dependencies);
  }

  /**
   * Resolve dependency processing order
   */
  private resolveDependencyOrder(dependencyMap: Map<string, string[]>): string[] {
    const resolved: string[] = [];
    const resolving: Set<string> = new Set();

    const resolve = (id: string): void => {
      if (resolved.includes(id)) return;
      if (resolving.has(id)) {
        // Circular dependency detected - log warning and continue
        this.eventCallback?.("circular_dependency_detected", {activityId: id});
        return;
      }

      resolving.add(id);
      const dependencies = dependencyMap.get(id) || [];

      for (const depId of dependencies) {
        resolve(depId);
      }

      resolving.delete(id);
      resolved.push(id);
    };

    for (const id of Array.from(dependencyMap.keys())) {
      resolve(id);
    }

    return resolved;
  }

  /**
   * Process rollup for a specific cluster
   */
  private processClusterRollup(cluster: Activity): void {
    // Perform standard rollup process for the cluster
    this.measureRollupProcess(cluster);

    if (cluster.sequencingControls.rollupObjectiveSatisfied) {
      this.objectiveRollupProcess(cluster);
    }

    if (cluster.sequencingControls.rollupProgressCompletion) {
      this.activityProgressRollupProcess(cluster);
    }
  }

  /**
   * Get activity objectives (implementation depends on objective model)
   */
  private getActivityObjectives(activity: Activity): string[] {
    return activity.getAllObjectives().map((objective) => objective.id);
  }

  /**
   * Synchronize objective state between local and global according to SCORM 2004 specification
   */
  private syncObjectiveState(
      activity: Activity,
      objective: ActivityObjective,
      mapInfo: ObjectiveMapInfo,
      globalObjective: any,
  ): void {
    try {
      const isPrimary = objective.isPrimary;
      const localObjective = this.getLocalObjectiveState(activity, objective, isPrimary);

      // Read from global to local using THIS ACTIVITY'S mapInfo directives
      // Each activity has its own read permissions for the global objective
      if (mapInfo.readSatisfiedStatus && globalObjective.satisfiedStatusKnown) {
        objective.satisfiedStatus = globalObjective.satisfiedStatus;
        objective.measureStatus = true;
      }

      // Read normalized measure
      if (mapInfo.readNormalizedMeasure && globalObjective.normalizedMeasureKnown) {
        objective.normalizedMeasure = globalObjective.normalizedMeasure;
        objective.measureStatus = true;

        if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
          const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
          objective.satisfiedStatus = globalObjective.normalizedMeasure >= threshold;
        }
      }

      if (mapInfo.readProgressMeasure && globalObjective.progressMeasureKnown) {
        objective.progressMeasure = globalObjective.progressMeasure;
        objective.progressMeasureStatus = true;
      }

      if (mapInfo.readCompletionStatus && globalObjective.completionStatusKnown) {
        objective.completionStatus = globalObjective.completionStatus as CompletionStatus;
      }

      if (objective.isPrimary) {
        objective.applyToActivity(activity);
      }

      // Write from local to global using THIS ACTIVITY'S mapInfo directives
      // Each activity has its own write permissions for the global objective
      if (mapInfo.writeSatisfiedStatus && objective.measureStatus) {
        globalObjective.satisfiedStatus = objective.satisfiedStatus;
        globalObjective.satisfiedStatusKnown = true;
      }

      if (mapInfo.writeNormalizedMeasure && objective.measureStatus) {
        globalObjective.normalizedMeasure = objective.normalizedMeasure;
        globalObjective.normalizedMeasureKnown = true;

        if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
          const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
          globalObjective.satisfiedStatus = objective.normalizedMeasure >= threshold;
          globalObjective.satisfiedStatusKnown = true;
        }
      }

      if (mapInfo.writeCompletionStatus && objective.completionStatus !== CompletionStatus.UNKNOWN) {
        globalObjective.completionStatus = objective.completionStatus;
        globalObjective.completionStatusKnown = true;
      }

      if (mapInfo.writeProgressMeasure && objective.progressMeasureStatus) {
        globalObjective.progressMeasure = objective.progressMeasure;
        globalObjective.progressMeasureKnown = true;
      }

      if (mapInfo.updateAttemptData) {
        this.updateActivityAttemptData(activity, globalObjective, objective);
      }

      // Fire synchronization event for monitoring/logging
      this.eventCallback?.("objective_synchronized", {
        activityId: activity.id,
        objectiveId: objective.id,
        localState: localObjective,
        globalState: globalObjective,
        synchronizationTime: new Date().toISOString()
      });

    } catch (error) {
      // Log synchronization error but don't fail the rollup process
      this.eventCallback?.("objective_sync_error", {
        activityId: activity.id,
        objectiveId: objective.id,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Update activity attempt data based on global objective state
   */
  private updateActivityAttemptData(
      activity: Activity,
      globalObjective: any,
      objective: ActivityObjective,
  ): void {
    try {
      if (!objective.isPrimary && !globalObjective.updateAttemptData) {
        return;
      }

      // Update attempt completion based on global objective satisfaction
      // Only if completion is NOT controlled by rollup rules
      const hasCompletionRollupRules = activity.rollupRules.rules.some(
        rule => rule.action === "completed" || rule.action === "incomplete"
      );

      if (globalObjective.satisfiedStatusKnown && globalObjective.satisfiedStatus) {
        // If global objective is satisfied, update local completion data
        // UNLESS the activity has explicit rollup rules for completion
        if (!hasCompletionRollupRules &&
            (activity.completionStatus === "unknown" || activity.completionStatus === "incomplete")) {
          activity.completionStatus = "completed";
        }

        // Update success status based on objective satisfaction
        if (activity.successStatus === "unknown") {
          activity.successStatus = "passed";
        }
      }

      // Update attempt count if global objective indicates new attempt
      if (globalObjective.attemptCount && globalObjective.attemptCount > activity.attemptCount) {
        activity.attemptCount = globalObjective.attemptCount;
      }

      // Update completion amount based on progress measure
      if (globalObjective.progressMeasureKnown && globalObjective.progressMeasure !== undefined) {
        activity.attemptCompletionAmount = globalObjective.progressMeasure;
      }

      // Update absolute duration from global timing data
      if (globalObjective.attemptAbsoluteDuration) {
        activity.attemptAbsoluteDuration = globalObjective.attemptAbsoluteDuration;
      }

      if (globalObjective.attemptExperiencedDuration) {
        activity.attemptExperiencedDuration = globalObjective.attemptExperiencedDuration;
      }

      // Update activity-level durations
      if (globalObjective.activityAbsoluteDuration) {
        activity.activityAbsoluteDuration = globalObjective.activityAbsoluteDuration;
      }

      if (globalObjective.activityExperiencedDuration) {
        activity.activityExperiencedDuration = globalObjective.activityExperiencedDuration;
      }

      // Update location if provided by global state
      if (globalObjective.location !== undefined) {
        activity.location = globalObjective.location;
      }

      // Update suspension state based on global objective
      if (globalObjective.suspendData !== undefined) {
        activity.isSuspended = globalObjective.suspendData.length > 0;
      }

    } catch (error) {
      // Log attempt data update error
      this.eventCallback?.("attempt_data_update_error", {
        activityId: activity.id,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Get local objective state
   */
  private getLocalObjectiveState(activity: Activity, objective: ActivityObjective, isPrimary: boolean): any {
    if (isPrimary) {
      return {
        id: objective.id,
        satisfiedStatus: activity.objectiveSatisfiedStatus,
        measureStatus: activity.objectiveMeasureStatus,
        normalizedMeasure: activity.objectiveNormalizedMeasure,
        progressMeasure: activity.progressMeasure,
        progressMeasureStatus: activity.progressMeasureStatus,
        completionStatus: activity.completionStatus,
        scaledPassingScore: activity.scaledPassingScore,
      };
    }

    return {
      id: objective.id,
      satisfiedStatus: objective.satisfiedStatus,
      measureStatus: objective.measureStatus,
      normalizedMeasure: objective.normalizedMeasure,
      progressMeasure: objective.progressMeasure,
      progressMeasureStatus: objective.progressMeasureStatus,
      completionStatus: objective.completionStatus,
      scaledPassingScore: objective.minNormalizedMeasure,
    };
  }

  private ensureGlobalObjectiveEntry(
      globalObjectives: Map<string, any>,
      targetId: string,
      objective: ActivityObjective,
      mapInfo: ObjectiveMapInfo,
  ): any {
    if (!globalObjectives.has(targetId)) {
      // Create new entry if global objective doesn't exist
      // NOTE: The read/write flags stored here are for reference only.
      // Each activity uses its OWN mapInfo for read/write decisions in syncObjectiveState.
      globalObjectives.set(targetId, {
        id: targetId,
        satisfiedStatus: objective.satisfiedStatus,
        satisfiedStatusKnown: objective.satisfiedStatusKnown,
        normalizedMeasure: objective.normalizedMeasure,
        normalizedMeasureKnown: objective.measureStatus,
        progressMeasure: objective.progressMeasure,
        progressMeasureKnown: objective.progressMeasureStatus,
        completionStatus: objective.completionStatus,
        completionStatusKnown: objective.completionStatus !== CompletionStatus.UNKNOWN,
        satisfiedByMeasure: objective.satisfiedByMeasure,
        minNormalizedMeasure: objective.minNormalizedMeasure,
      });
    }

    return globalObjectives.get(targetId);
  }

  private createDefaultMapInfo(objective: ActivityObjective): ObjectiveMapInfo {
    // Default map info should only WRITE to global objectives, not READ
    // Reading should only happen when explicitly configured via mapInfo
    // This prevents unintended overwrites of RTE-transferred data
    return {
      targetObjectiveID: objective.id,
      readSatisfiedStatus: false,
      writeSatisfiedStatus: true,
      readNormalizedMeasure: false,
      writeNormalizedMeasure: true,
      readCompletionStatus: false,
      writeCompletionStatus: true,
      readProgressMeasure: false,
      writeProgressMeasure: true,
      updateAttemptData: objective.isPrimary,
    };
  }

  /**
   * INTEGRATION: Identify Activity Clusters
   * Identifies clusters among child activities for cross-cluster dependency processing
   * @param {Activity[]} children - Child activities to analyze
   * @return {Activity[]} - Array of identified clusters
   */
  private identifyActivityClusters(children: Activity[]): Activity[] {
    const clusters: Activity[] = [];

    for (const child of children) {
      // An activity is considered a cluster if it has children and flow controls
      if (child.children.length > 0 && child.sequencingControls.flow) {
        clusters.push(child);
      }
    }

    return clusters;
  }

}
