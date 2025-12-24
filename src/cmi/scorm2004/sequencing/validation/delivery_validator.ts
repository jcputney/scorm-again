import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { getDurationAsSeconds } from "../../../../utilities";
import { scorm2004_regex } from "../../../../constants/regex";

/**
 * Result of activity tree state consistency check
 */
export interface StateConsistencyResult {
  consistent: boolean;
  exception: string | null;
}

/**
 * Result of resource constraint check
 */
export interface ResourceConstraintResult {
  available: boolean;
  exception: string | null;
}

/**
 * Result of concurrent delivery check
 */
export interface ConcurrentDeliveryResult {
  allowed: boolean;
  exception: string | null;
}

/**
 * Result of activity dependency check
 */
export interface DependencyResult {
  satisfied: boolean;
  exception: string | null;
}

/**
 * DeliveryValidator
 *
 * Handles all delivery validation for the SCORM 2004 sequencing engine.
 * Extracted from OverallSequencingProcess to follow Single Responsibility Principle.
 *
 * Responsibilities:
 * - Validate activity tree state consistency
 * - Validate resource constraints
 * - Prevent concurrent delivery
 * - Validate activity dependencies
 * - Check activity process (UP.5)
 * - Limit conditions check process (UP.1)
 *
 * @spec SN Book: DB.1.1 (Delivery Request Process)
 * @spec SN Book: UP.1 (Limit Conditions Check Process)
 * @spec SN Book: UP.5 (Check Activity Process)
 */
export class DeliveryValidator {
  private activityTree: ActivityTree;
  private eventCallback: ((eventType: string, data?: any) => void) | null;
  private now: () => Date;
  private contentDeliveredGetter: (() => boolean) | null = null;

  constructor(
    activityTree: ActivityTree,
    eventCallback: ((eventType: string, data?: any) => void) | null = null,
    options?: { now?: () => Date }
  ) {
    this.activityTree = activityTree;
    this.eventCallback = eventCallback;
    this.now = options?.now || (() => new Date());
  }

  /**
   * Set getter for content delivered flag
   */
  public setContentDeliveredGetter(getter: () => boolean): void {
    this.contentDeliveredGetter = getter;
  }

  /**
   * Validate Activity Tree State Consistency
   * @param {Activity} activity - Activity to validate
   * @return {StateConsistencyResult} - Consistency result
   */
  public validateTreeConsistency(activity: Activity): StateConsistencyResult {
    // Check that the activity tree is in a consistent state for delivery
    if (!this.activityTree.root) {
      return { consistent: false, exception: "DB.1.1-4" }; // No activity tree
    }

    // Validate activity is part of the current tree
    if (!this.isActivityPartOfTree(activity, this.activityTree.root)) {
      return { consistent: false, exception: "DB.1.1-5" }; // Activity not in tree
    }

    // Check for conflicting active activities
    const activeActivities = this.getActiveActivities();
    if (activeActivities.length > 1) {
      // Multiple active activities indicate inconsistent state
      this.fireEvent("onStateInconsistency", {
        activeActivities: activeActivities.map((a) => a.id),
        targetActivity: activity.id,
      });
      return { consistent: false, exception: "DB.1.1-6" }; // State inconsistency
    }

    // Validate parent-child relationships are intact
    let current: Activity | null = activity;
    while (current?.parent) {
      if (!current.parent.children.includes(current)) {
        return { consistent: false, exception: "DB.1.1-7" }; // Broken parent-child relationship
      }
      current = current.parent;
    }

    return { consistent: true, exception: null };
  }

  /**
   * Validate Resource Constraints
   * @param {Activity} activity - Activity to validate
   * @return {ResourceConstraintResult} - Resource availability result
   */
  public validateResources(activity: Activity): ResourceConstraintResult {
    // Check if required resources are available
    const requiredResources = this.getRequiredResources(activity);
    for (const resource of requiredResources) {
      if (!this.isResourceAvailable(resource)) {
        return {
          available: false,
          exception: "DB.1.1-8", // Resource not available
        };
      }
    }

    // Check system resource limits
    const systemResourceCheck = this.checkSystemLimits();
    if (!systemResourceCheck.adequate) {
      return {
        available: false,
        exception: "DB.1.1-9", // Insufficient system resources
      };
    }

    return { available: true, exception: null };
  }

  /**
   * Validate Concurrent Delivery Prevention
   * @param {Activity} activity - Activity to validate
   * @return {ConcurrentDeliveryResult} - Concurrency check result
   */
  public validateConcurrentDelivery(activity: Activity): ConcurrentDeliveryResult {
    const contentDelivered = this.contentDeliveredGetter
      ? this.contentDeliveredGetter()
      : false;

    // Check if another delivery is currently in progress
    if (
      contentDelivered &&
      this.activityTree.currentActivity &&
      this.activityTree.currentActivity !== activity
    ) {
      return {
        allowed: false,
        exception: "DB.1.1-10", // Another activity is currently being delivered
      };
    }

    // Check for pending delivery requests in queue
    if (this.hasPendingDeliveryRequests()) {
      return {
        allowed: false,
        exception: "DB.1.1-11", // Delivery request already in queue
      };
    }

    // Validate delivery lock status
    if (this.isDeliveryLocked()) {
      return {
        allowed: false,
        exception: "DB.1.1-12", // Delivery is currently locked
      };
    }

    return { allowed: true, exception: null };
  }

  /**
   * Validate Activity Dependencies
   * @param {Activity} activity - Activity to validate
   * @return {DependencyResult} - Dependency check result
   */
  public validateDependencies(activity: Activity): DependencyResult {
    // Check prerequisite activities
    const prerequisites = this.getPrerequisites(activity);
    for (const prerequisite of prerequisites) {
      if (!this.isPrerequisiteSatisfied(prerequisite, activity)) {
        return {
          satisfied: false,
          exception: "DB.1.1-13", // Prerequisites not satisfied
        };
      }
    }

    // Check objective dependencies
    const objectiveDependencies = this.getObjectiveDependencies(activity);
    for (const dependency of objectiveDependencies) {
      if (!this.isObjectiveDependencySatisfied(dependency)) {
        return {
          satisfied: false,
          exception: "DB.1.1-14", // Objective dependencies not met
        };
      }
    }

    // Check sequencing rule dependencies
    const sequencingDependencies = this.getSequencingRuleDependencies(activity);
    if (!sequencingDependencies.satisfied) {
      return {
        satisfied: false,
        exception: "DB.1.1-15", // Sequencing dependencies not met
      };
    }

    return { satisfied: true, exception: null };
  }

  /**
   * Check Activity Process (UP.5)
   * Validates if an activity can be delivered based on sequencing rules and limit conditions
   * Note: Cluster/leaf validation is handled in DB.1.1 Step 1, not here
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if activity is valid (not disabled, limits not violated)
   */
  public checkActivity(activity: Activity): boolean {
    // UP.5 Step 1-2: Check if activity is disabled by sequencing rules
    // In scorm-again, isAvailable serves as the proxy for disabled status
    if (!activity.isAvailable) {
      return false;
    }

    // UP.5 Step 3-4: Check limit conditions (UP.1)
    if (!this.checkLimitConditions(activity)) {
      return false;
    }

    // Note: We intentionally do NOT check isHiddenFromChoice or cluster status here
    // - isHiddenFromChoice is validated in navigation/choice processes
    // - Cluster validation is handled in DB.1.1 Step 1 (only target activity)

    // Activity passes all checks
    return true;
  }

  /**
   * Limit Conditions Check Process (UP.1)
   * Checks if any limit conditions are violated for the activity
   * @param {Activity} activity - The activity to check limit conditions for
   * @return {boolean} - True if limit conditions are met, false if violated
   */
  public checkLimitConditions(activity: Activity): boolean {
    let result = true;
    let failureReason = "";

    // Check attempt limit
    if (activity.attemptLimit !== null && activity.attemptLimit > 0) {
      if (activity.attemptCount >= activity.attemptLimit) {
        result = false;
        failureReason = "Attempt limit exceeded";
      }
    }

    // Check attempt absolute duration limit
    // A limit of 0 (or "PT0H0M0S") is treated as "no limit" per IMS SS spec
    if (result && activity.attemptAbsoluteDurationLimit) {
      const limitDuration = getDurationAsSeconds(
        activity.attemptAbsoluteDurationLimit,
        scorm2004_regex.CMITimespan
      );
      // Only check if there's an actual non-zero limit
      if (limitDuration > 0) {
        const currentDuration = getDurationAsSeconds(
          activity.attemptAbsoluteDuration || "PT0H0M0S",
          scorm2004_regex.CMITimespan
        );
        if (currentDuration >= limitDuration) {
          result = false;
          failureReason = "Attempt duration limit exceeded";
        }
      }
    }

    // Check activity absolute duration limit
    // A limit of 0 (or "PT0H0M0S") is treated as "no limit" per IMS SS spec
    if (result && activity.activityAbsoluteDurationLimit) {
      const limitDuration = getDurationAsSeconds(
        activity.activityAbsoluteDurationLimit,
        scorm2004_regex.CMITimespan
      );
      // Only check if there's an actual non-zero limit
      if (limitDuration > 0) {
        const currentDuration = getDurationAsSeconds(
          activity.activityAbsoluteDuration || "PT0H0M0S",
          scorm2004_regex.CMITimespan
        );
        if (currentDuration >= limitDuration) {
          result = false;
          failureReason = "Activity duration limit exceeded";
        }
      }
    }

    // Check begin time limit
    if (result && activity.beginTimeLimit) {
      const currentTime = this.now();
      const beginTime = new Date(activity.beginTimeLimit);
      if (currentTime < beginTime) {
        result = false;
        failureReason = "Not yet time to begin";
      }
    }

    // Check end time limit
    if (result && activity.endTimeLimit) {
      const currentTime = this.now();
      const endTime = new Date(activity.endTimeLimit);
      if (currentTime > endTime) {
        result = false;
        failureReason = "Time limit expired";
      }
    }

    // Fire limit condition check event
    this.fireEvent("onLimitConditionCheck", {
      activity: activity,
      result: result,
      failureReason: failureReason,
      checks: {
        attemptLimit: activity.attemptLimit,
        attemptCount: activity.attemptCount,
        attemptDurationLimit: activity.attemptAbsoluteDurationLimit,
        activityDurationLimit: activity.activityAbsoluteDurationLimit,
        beginTimeLimit: activity.beginTimeLimit,
        endTimeLimit: activity.endTimeLimit,
      },
    });

    return result;
  }

  /**
   * Check if activity is part of tree
   */
  private isActivityPartOfTree(activity: Activity, root: Activity): boolean {
    if (activity === root) {
      return true;
    }

    for (const child of root.children) {
      if (this.isActivityPartOfTree(activity, child)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Get all active activities in the tree
   */
  private getActiveActivities(): Activity[] {
    const activeActivities: Activity[] = [];
    if (this.activityTree.root) {
      this.collectActiveActivities(this.activityTree.root, activeActivities);
    }
    return activeActivities;
  }

  private collectActiveActivities(
    activity: Activity,
    activeActivities: Activity[]
  ): void {
    if (activity.isActive) {
      activeActivities.push(activity);
    }
    for (const child of activity.children) {
      this.collectActiveActivities(child, activeActivities);
    }
  }

  /**
   * Get required resources for activity
   */
  public getRequiredResources(activity: Activity): string[] {
    // Parse activity metadata for resource requirements
    const resources: string[] = [];

    // Check for multimedia requirements based on activity title and location
    const activityInfo = (activity.title + " " + activity.location).toLowerCase();
    if (activityInfo.includes("video") || activityInfo.includes("multimedia")) {
      resources.push("video-codec");
    }
    if (activityInfo.includes("audio") || activityInfo.includes("sound")) {
      resources.push("audio-codec");
    }

    // Check for plugin requirements from activity location/title
    if (activityInfo.includes("flash") || activityInfo.includes(".swf")) {
      resources.push("flash-plugin");
    }
    if (activityInfo.includes("java") || activityInfo.includes("applet")) {
      resources.push("java-runtime");
    }

    // Check for bandwidth requirements based on activity type
    if (activity.children && activity.children.length > 0) {
      resources.push("high-bandwidth"); // Container activities may need more bandwidth
    }

    // Check for storage requirements based on duration limits
    if (
      activity.attemptAbsoluteDurationLimit &&
      this.parseDurationToMinutes(activity.attemptAbsoluteDurationLimit) > 60
    ) {
      resources.push("extended-storage"); // Long duration activities need more storage
    }

    // Check for specific SCORM requirements
    if (activity.attemptLimit && activity.attemptLimit > 1) {
      resources.push("persistent-storage"); // Multiple attempts need storage
    }

    return resources;
  }

  /**
   * Check if resource is available
   */
  public isResourceAvailable(resource: string): boolean {
    try {
      switch (resource) {
        case "video-codec":
          // Check if HTML5 video is supported
          return !!(document.createElement("video").canPlayType);

        case "audio-codec":
          // Check if HTML5 audio is supported
          return !!(document.createElement("audio").canPlayType);

        case "flash-plugin":
          // Check for Flash plugin (legacy support)
          return (
            navigator.plugins &&
            Array.from(navigator.plugins).some(
              (plugin) => plugin.name === "Shockwave Flash"
            )
          );

        case "java-runtime":
          // Check for Java support (mostly deprecated in modern browsers)
          return (
            navigator.plugins &&
            Array.from(navigator.plugins).some((plugin) => plugin.name === "Java")
          );

        case "high-bandwidth":
          // Check network connection (basic heuristic)
          if ("connection" in navigator) {
            const connection = (navigator as any).connection;
            return connection.effectiveType === "4g" || connection.downlink > 5;
          }
          return true; // Assume available if can't detect

        case "extended-storage":
          // Assume storage is available for SCORM content
          return true;

        case "persistent-storage":
          // Check for persistent storage capabilities
          return "localStorage" in window && "sessionStorage" in window;

        default:
          // Unknown resource, assume available
          return true;
      }
    } catch (error) {
      // If any check fails, assume resource is unavailable
      return false;
    }
  }

  /**
   * Check system resource limits
   */
  public checkSystemLimits(): { adequate: boolean } {
    try {
      let adequate = true;

      // Check memory usage if available (Chrome/Edge only)
      if ("memory" in performance) {
        const memory = (performance as any).memory;
        const memoryUsagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        if (memoryUsagePercent > 0.8) {
          // More than 80% memory used
          adequate = false;
        }
      }

      // Check for device memory hint (modern browsers)
      if ("deviceMemory" in navigator) {
        const deviceMemory = (navigator as any).deviceMemory;
        if (deviceMemory < 2) {
          // Less than 2GB device memory
          adequate = false;
        }
      }

      // Check hardware concurrency (rough CPU check)
      if ("hardwareConcurrency" in navigator) {
        const cores = navigator.hardwareConcurrency;
        if (cores < 2) {
          // Single core devices might struggle
          adequate = false;
        }
      }

      // Check connection quality for network-intensive activities
      if ("connection" in navigator) {
        const connection = (navigator as any).connection;
        if (connection.saveData || connection.effectiveType === "slow-2g") {
          adequate = false;
        }
      }

      return { adequate };
    } catch (error) {
      // If checks fail, assume resources are adequate
      return { adequate: true };
    }
  }

  private hasPendingDeliveryRequests(): boolean {
    // Check if there are pending delivery requests in the system
    if (this.activityTree && (this.activityTree as any).pendingRequests) {
      return (this.activityTree as any).pendingRequests.length > 0;
    }

    // Check for any pending fetch operations (if using fetch API)
    if (typeof window !== "undefined" && (window as any).pendingScormRequests) {
      return (window as any).pendingScormRequests > 0;
    }

    return false;
  }

  private isDeliveryLocked(): boolean {
    // Check for navigation lock
    if (this.activityTree && (this.activityTree as any).navigationLocked) {
      return true;
    }

    // Check for active termination process
    if (this.activityTree && (this.activityTree as any).terminationInProgress) {
      return true;
    }

    // Check system resource limits
    const resourceCheck = this.checkSystemLimits();
    if (!resourceCheck.adequate) {
      return true;
    }

    // Check for maintenance mode (would be set by LMS)
    return !!(
      typeof window !== "undefined" && (window as any).scormMaintenanceMode
    );
  }

  /**
   * Get activity prerequisites
   */
  public getPrerequisites(activity: Activity): string[] {
    const prerequisites: string[] = [];

    // Check for preCondition rules that reference other activities
    if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
      for (const rule of activity.sequencingRules.preConditionRules) {
        if (rule.conditions && rule.conditions.length > 0) {
          for (const condition of rule.conditions) {
            if (
              (condition as any).referencedObjectiveID &&
              (condition as any).referencedObjectiveID !== activity.id
            ) {
              prerequisites.push((condition as any).referencedObjectiveID);
            }
          }
        }
      }
    }

    // Check for sequencing control dependencies
    if (
      activity.parent &&
      activity.sequencingControls &&
      !activity.sequencingControls.choiceExit
    ) {
      const siblings = activity.parent.children;
      if (siblings) {
        const activityIndex = siblings.indexOf(activity);

        // Add previous siblings as prerequisites for sequential flow
        for (let i = 0; i < activityIndex; i++) {
          const sibling = siblings[i];
          if (sibling) {
            prerequisites.push(sibling.id);
          }
        }
      }
    }

    // Check for explicit prerequisite metadata (if defined in activity)
    if ((activity as any).prerequisiteActivities) {
      prerequisites.push(...(activity as any).prerequisiteActivities);
    }

    return Array.from(new Set(prerequisites)); // Remove duplicates
  }

  /**
   * Check if prerequisite is satisfied
   */
  public isPrerequisiteSatisfied(
    prerequisiteId: string,
    _activity: Activity
  ): boolean {
    const prerequisite = this.activityTree.getActivity(prerequisiteId);
    if (!prerequisite) {
      return false;
    }

    return prerequisite.completionStatus === "completed";
  }

  /**
   * Get objective dependencies
   */
  public getObjectiveDependencies(activity: Activity): string[] {
    const dependencies: string[] = [];

    // Check activity's objective mappings for global objective references
    const objectives = (activity as any).objectives;
    if (objectives && objectives.length > 0) {
      for (const objective of objectives) {
        if ((objective as any).globalObjectiveID) {
          dependencies.push((objective as any).globalObjectiveID);
        }

        if (
          !(objective as any).satisfiedByMeasure &&
          (objective as any).readNormalizedMeasure
        ) {
          dependencies.push(objective.id + "_measure");
        }
      }
    }

    // Check sequencing rules for objective references
    if (activity.sequencingRules) {
      const allRules = [
        ...(activity.sequencingRules.preConditionRules || []),
        ...(activity.sequencingRules.exitConditionRules || []),
        ...(activity.sequencingRules.postConditionRules || []),
      ];

      for (const rule of allRules) {
        if (rule.conditions && rule.conditions.length > 0) {
          for (const condition of rule.conditions) {
            if (
              (condition as any).objectiveReference &&
              (condition as any).objectiveReference !== activity.id
            ) {
              dependencies.push((condition as any).objectiveReference);
            }
          }
        }
      }
    }

    return Array.from(new Set(dependencies)); // Remove duplicates
  }

  /**
   * Check if objective dependency is satisfied
   */
  public isObjectiveDependencySatisfied(objectiveId: string): boolean {
    // Handle global objective references
    if (this.activityTree && (this.activityTree as any).globalObjectives) {
      const globalObjectives = (this.activityTree as any).globalObjectives;
      const globalObjective = globalObjectives[objectiveId];

      if (globalObjective) {
        return (
          globalObjective.satisfied === true &&
          globalObjective.statusKnown === true
        );
      }
    }

    // Handle measure-based dependencies
    if (objectiveId.endsWith("_measure")) {
      const baseObjectiveId = objectiveId.replace("_measure", "");
      if (this.activityTree && (this.activityTree as any).globalObjectives) {
        const globalObjectives = (this.activityTree as any).globalObjectives;
        const globalObjective = globalObjectives[baseObjectiveId];

        if (globalObjective) {
          return (
            globalObjective.measureKnown === true &&
            globalObjective.normalizedMeasure >= 0
          );
        }
      }
    }

    // Handle activity-specific objective references
    const referencedActivity = this.activityTree.getActivity(objectiveId);
    if (referencedActivity) {
      return (
        referencedActivity.objectiveSatisfiedStatus &&
        referencedActivity.objectiveMeasureStatus
      );
    }

    // If objective is not found or cannot be evaluated, assume not satisfied
    return false;
  }

  private getSequencingRuleDependencies(activity: Activity): { satisfied: boolean } {
    let satisfied = true;

    try {
      // Check pre-condition rule dependencies
      if (activity.sequencingRules && activity.sequencingRules.preConditionRules) {
        for (const rule of activity.sequencingRules.preConditionRules) {
          if (rule.conditions && rule.conditions.length > 0) {
            for (const condition of rule.conditions) {
              const conditionType =
                (condition as any).conditionType || condition.condition;

              switch (conditionType) {
                case "activityProgressKnown":
                  if (!activity.progressMeasureStatus) satisfied = false;
                  break;

                case "objectiveStatusKnown":
                case "objectiveSatisfied": {
                  const objectiveId =
                    (condition as any).referencedObjectiveID || activity.id;
                  if (!this.isObjectiveDependencySatisfied(objectiveId))
                    satisfied = false;
                  break;
                }

                case "attemptLimitExceeded":
                  if (activity.attemptLimit === null) satisfied = false;
                  break;

                case "timeLimitExceeded":
                  if (
                    !activity.attemptAbsoluteDurationLimit &&
                    !activity.activityAbsoluteDurationLimit
                  )
                    satisfied = false;
                  break;

                case "always":
                case "never":
                  // These conditions have no dependencies
                  break;

                default:
                  // Unknown condition type, assume dependency not satisfied
                  satisfied = false;
              }
            }
          }
        }
      }

      // Check exit condition rule dependencies (similar logic)
      if (activity.sequencingRules && activity.sequencingRules.exitConditionRules) {
        for (const rule of activity.sequencingRules.exitConditionRules) {
          if (rule.conditions && rule.conditions.length > 0) {
            for (const condition of rule.conditions) {
              const conditionType =
                (condition as any).conditionType || condition.condition;

              if (
                ["objectiveStatusKnown", "objectiveSatisfied"].includes(
                  conditionType
                )
              ) {
                const objectiveId =
                  (condition as any).referencedObjectiveID || activity.id;
                if (!this.isObjectiveDependencySatisfied(objectiveId))
                  satisfied = false;
              }
            }
          }
        }
      }

      // Check rollup rule dependencies
      if (activity.rollupRules && activity.rollupRules.rules) {
        for (const rule of activity.rollupRules.rules) {
          if (rule.conditions && rule.conditions.length > 0) {
            // Rollup rules depend on child activity completion
            if (activity.children && activity.children.length > 0) {
              for (const child of activity.children) {
                if (!child.isCompleted) {
                  satisfied = false;
                  break;
                }
              }
            }
          }
        }
      }
    } catch (error) {
      // If any error occurs during dependency check, mark as not satisfied
      satisfied = false;
    }

    return { satisfied };
  }

  /**
   * Helper method to parse ISO 8601 duration to minutes
   */
  private parseDurationToMinutes(duration: string): number {
    return getDurationAsSeconds(duration, scorm2004_regex.CMITimespan) / 60;
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
      console.warn(`Failed to fire delivery validator event ${eventType}: ${error}`);
    }
  }
}
