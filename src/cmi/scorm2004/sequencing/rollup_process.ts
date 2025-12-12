import {
  Activity,
  ActivityObjective,
  ObjectiveMapInfo,
  RollupConsiderationsConfig,
  RollupConsiderationRequirement,
} from "./activity";
import { RollupActionType, RollupConsiderationType, RollupRule } from "./rollup_rules";
import { CompletionStatus, SuccessStatus } from "../../../constants/enums";

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
   * @param {Activity} activity - The activity to start rollup from
   */
  public overallRollupProcess(activity: Activity): void {
    let currentActivity: Activity | null = activity;

    // Process rollup up the tree until we reach the root
    while (currentActivity && currentActivity.parent) {
      const parent: Activity = currentActivity.parent;

      // Only perform rollup if the parent tracks status
      if (parent.sequencingControls.rollupObjectiveSatisfied ||
        parent.sequencingControls.rollupProgressCompletion) {

        // Step 1: Measure Rollup Process (RB.1.1)
        this.measureRollupProcess(parent);

        // Step 2: Objective Rollup Process (RB.1.2)
        if (parent.sequencingControls.rollupObjectiveSatisfied) {
          this.objectiveRollupProcess(parent);
        }

        // Step 3: Activity Progress Rollup Process (RB.1.3)
        if (parent.sequencingControls.rollupProgressCompletion) {
          this.activityProgressRollupProcess(parent);
        }
      }

      // Move up the tree
      currentActivity = parent;
    }
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
      { enableThresholdBias: false },
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
      return;
    }

    // Then, try rollup using measure (RB.1.2.a)
    const measureResult = this.objectiveRollupUsingMeasure(activity);
    if (measureResult !== null) {
      activity.objectiveSatisfiedStatus = measureResult;
      return;
    }

    // Finally, use default rollup (RB.1.2.c)
    activity.objectiveSatisfiedStatus = this.objectiveRollupUsingDefault(activity);
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
   * @param {Activity} activity - The parent activity
   * @return {boolean} - True if all tracked children are satisfied
   */
  private objectiveRollupUsingDefault(activity: Activity): boolean {
    const children = activity.getAvailableChildren();
    if (children.length === 0) {
      return false;
    }

    const contributors = children.filter((child) =>
      this.checkChildForRollupSubprocess(child, "objective"),
    );
    if (contributors.length === 0) {
      return false;
    }

    const considerations = activity.rollupConsiderations;

    const notSatisfiedCandidates = this.filterChildrenForRequirement(
      contributors,
      considerations.requiredForNotSatisfied,
      "objective",
      "notSatisfied",
      considerations,
    );

    if (notSatisfiedCandidates.some((child) => !this.isChildSatisfiedForRollup(child))) {
      return false;
    }

    const satisfiedCandidates = this.filterChildrenForRequirement(
      contributors,
      considerations.requiredForSatisfied,
      "objective",
      "satisfied",
      considerations,
    );

    if (satisfiedCandidates.length === 0) {
      return false;
    }

    return satisfiedCandidates.every((child) => this.isChildSatisfiedForRollup(child));
  }

  /**
   * Activity Progress Rollup Process (RB.1.3)
   * Determines activity completion status
   * @param {Activity} activity - The parent activity
   */
  private activityProgressRollupProcess(activity: Activity): void {
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
        return;
      }
    }

    // Then evaluate incomplete rules
    for (const rule of incompleteRules) {
      if (this.evaluateRollupRule(activity, rule)) {
        activity.completionStatus = "incomplete";
        return;
      }
    }

    // Default: completed if all tracked children are completed
    const children = activity.getAvailableChildren();
    const contributors = children.filter((child) =>
      this.checkChildForRollupSubprocess(child, "progress"),
    );

    const considerations = activity.rollupConsiderations;

    const incompleteCandidates = this.filterChildrenForRequirement(
      contributors,
      considerations.requiredForIncomplete,
      "progress",
      "incomplete",
      considerations,
    );

    if (incompleteCandidates.some((child) => !this.isChildCompletedForRollup(child))) {
      activity.completionStatus = "incomplete";
      return;
    }

    const completedCandidates = this.filterChildrenForRequirement(
      contributors,
      considerations.requiredForCompleted,
      "progress",
      "completed",
      considerations,
    );

    const evaluationSet = completedCandidates.length > 0 ? completedCandidates : contributors;

    const allCompleted = evaluationSet.length === 0 || evaluationSet.every((child) => this.isChildCompletedForRollup(child));

    activity.completionStatus = allCompleted ? "completed" : "incomplete";
  }

  /**
   * Check Child For Rollup Subprocess (RB.1.4.2)
   * Determines if a child activity contributes to rollup
   * @param {Activity} child - The child activity to check
   * @param {string} rollupType - Type of rollup ("measure", "objective", "progress")
   * @return {boolean} - True if child contributes to rollup
   */
  private checkChildForRollupSubprocess(child: Activity, rollupType: string): boolean {
    // Check if child is tracked
    switch (rollupType) {
      case "measure":
      case "objective":
        if (!child.sequencingControls.rollupObjectiveSatisfied) {
          return false;
        }
        break;
      case "progress":
        if (!child.sequencingControls.rollupProgressCompletion) {
          return false;
        }
        break;
    }

    // Check if child is available for rollup
    if (!child.isAvailable) {
      return false;
    }

    // Additional checks can be added here based on rollup configuration

    return true;
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
    _mode: "satisfied" | "notSatisfied" | "completed" | "incomplete",
    considerations: RollupConsiderationsConfig,
  ): boolean {
    if (!this.checkChildForRollupSubprocess(child, rollupType)) {
      return false;
    }

    if (
      rollupType === "objective" &&
      !considerations.measureSatisfactionIfActive &&
      (child.activityAttemptActive || child.isActive)
    ) {
      return false;
    }

    switch (requirement) {
      case "ifAttempted":
        if (!(child.attemptCount > 0 || child.activityAttemptActive || child.isActive)) {
          return false;
        }
        break;
      case "ifNotSkipped":
        if (child.wasSkipped) {
          return false;
        }
        break;
      case "ifNotSuspended":
        if (child.isSuspended) {
          return false;
        }
        break;
      default:
        break;
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
    for (const child of children) {
      // Check if child contributes based on rule action
      let contributes = false;
      switch (rule.action) {
        case RollupActionType.SATISFIED:
        case RollupActionType.NOT_SATISFIED:
          contributes = this.checkChildForRollupSubprocess(child, "objective");
          break;
        case RollupActionType.COMPLETED:
        case RollupActionType.INCOMPLETE:
          contributes = this.checkChildForRollupSubprocess(child, "progress");
          break;
      }

      if (contributes) {
        contributingChildren++;

        // Evaluate rule conditions for this child using RB.1.4.1
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
   * @param {Activity} activity - The activity to process objectives for
   * @param {Map<string, any>} globalObjectives - Global objective map
   */
  public processGlobalObjectiveMapping(activity: Activity, globalObjectives: Map<string, any>): void {
    try {
      this.eventCallback?.("global_objective_processing_started", {
        activityId: activity.id,
        globalObjectiveCount: globalObjectives.size
      });

      // Process shared objectives for this activity
      this.synchronizeGlobalObjectives(activity, globalObjectives);

      // Process children recursively
      const children = activity.children;
      for (const child of children) {
        this.processGlobalObjectiveMapping(child, globalObjectives);
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
    if (!controls.rollupObjectiveSatisfied && !controls.rollupProgressCompletion) {
      // Activity doesn't contribute to rollup but has rollup data
      if (activity.objectiveMeasureStatus || activity.completionStatus !== "unknown") {
        inconsistencies.push(`Activity ${activityId}: has rollup data but rollup controls disabled`);
      }
    }

    // Check children consistency
    const children = activity.getAvailableChildren();
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
        this.eventCallback?.("circular_dependency_detected", { activityId: id });
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

      // Read from global to local using map info directives
      if (globalObjective.readSatisfiedStatus && globalObjective.satisfiedStatusKnown) {
        objective.satisfiedStatus = globalObjective.satisfiedStatus;
        objective.measureStatus = true;
      }

      // Read normalized measure
      if (globalObjective.readNormalizedMeasure && globalObjective.normalizedMeasureKnown) {
        objective.normalizedMeasure = globalObjective.normalizedMeasure;
        objective.measureStatus = true;

        if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
          const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
          objective.satisfiedStatus = globalObjective.normalizedMeasure >= threshold;
        }
      }

      if (globalObjective.readProgressMeasure && globalObjective.progressMeasureKnown) {
        objective.progressMeasure = globalObjective.progressMeasure;
        objective.progressMeasureStatus = true;
      }

      if (globalObjective.readCompletionStatus && globalObjective.completionStatusKnown) {
        objective.completionStatus = globalObjective.completionStatus as CompletionStatus;
      }

      if (objective.isPrimary) {
        objective.applyToActivity(activity);
      }

      // Write from local to global using map info directives
      if (globalObjective.writeSatisfiedStatus && objective.measureStatus) {
        globalObjective.satisfiedStatus = objective.satisfiedStatus;
        globalObjective.satisfiedStatusKnown = true;
      }

      if (globalObjective.writeNormalizedMeasure && objective.measureStatus) {
        globalObjective.normalizedMeasure = objective.normalizedMeasure;
        globalObjective.normalizedMeasureKnown = true;

        if (globalObjective.satisfiedByMeasure || objective.satisfiedByMeasure) {
          const threshold = objective.minNormalizedMeasure ?? activity.scaledPassingScore ?? 0.7;
          globalObjective.satisfiedStatus = objective.normalizedMeasure >= threshold;
          globalObjective.satisfiedStatusKnown = true;
        }
      }

      if (globalObjective.writeCompletionStatus && objective.completionStatus !== CompletionStatus.UNKNOWN) {
        globalObjective.completionStatus = objective.completionStatus;
        globalObjective.completionStatusKnown = true;
      }

      if (globalObjective.writeProgressMeasure && objective.progressMeasureStatus) {
        globalObjective.progressMeasure = objective.progressMeasure;
        globalObjective.progressMeasureKnown = true;
      }

      if (globalObjective.updateAttemptData) {
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
      if (globalObjective.satisfiedStatusKnown && globalObjective.satisfiedStatus) {
        // If global objective is satisfied, update local completion data
        if (activity.completionStatus === "unknown" || activity.completionStatus === "incomplete") {
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
      globalObjectives.set(targetId, {
        id: targetId,
        satisfiedStatus: objective.satisfiedStatus,
        satisfiedStatusKnown: objective.measureStatus,
        normalizedMeasure: objective.normalizedMeasure,
        normalizedMeasureKnown: objective.measureStatus,
        progressMeasure: objective.progressMeasure,
        progressMeasureKnown: objective.progressMeasureStatus,
        completionStatus: objective.completionStatus,
        completionStatusKnown: objective.completionStatus !== CompletionStatus.UNKNOWN,
        readSatisfiedStatus: mapInfo.readSatisfiedStatus ?? false,
        writeSatisfiedStatus: mapInfo.writeSatisfiedStatus ?? false,
        readNormalizedMeasure: mapInfo.readNormalizedMeasure ?? false,
        writeNormalizedMeasure: mapInfo.writeNormalizedMeasure ?? false,
        readCompletionStatus: mapInfo.readCompletionStatus ?? false,
        writeCompletionStatus: mapInfo.writeCompletionStatus ?? false,
        readProgressMeasure: mapInfo.readProgressMeasure ?? false,
        writeProgressMeasure: mapInfo.writeProgressMeasure ?? false,
        readRawScore: mapInfo.readRawScore ?? false,
        writeRawScore: mapInfo.writeRawScore ?? false,
        readMinScore: mapInfo.readMinScore ?? false,
        writeMinScore: mapInfo.writeMinScore ?? false,
        readMaxScore: mapInfo.readMaxScore ?? false,
        writeMaxScore: mapInfo.writeMaxScore ?? false,
        satisfiedByMeasure: objective.satisfiedByMeasure,
        minNormalizedMeasure: objective.minNormalizedMeasure,
        updateAttemptData: mapInfo.updateAttemptData ?? objective.isPrimary,
      });
    }

    return globalObjectives.get(targetId);
  }

  private createDefaultMapInfo(objective: ActivityObjective): ObjectiveMapInfo {
    return {
      targetObjectiveID: objective.id,
      readSatisfiedStatus: true,
      writeSatisfiedStatus: true,
      readNormalizedMeasure: true,
      writeNormalizedMeasure: true,
      readCompletionStatus: true,
      writeCompletionStatus: true,
      readProgressMeasure: true,
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
