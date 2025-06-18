import { Activity } from "./activity";
import { RollupRules, RollupRule, RollupActionType, RollupConsiderationType } from "./rollup_rules";

/**
 * Rollup Process implementation for SCORM 2004 sequencing
 * Handles all rollup operations including measure, objective, and progress rollup
 */
export class RollupProcess {
  /**
   * Overall Rollup Process (RB.1.5)
   * Performs rollup from a given activity up through its ancestors
   * @param {Activity} activity - The activity to start rollup from
   */
  public overallRollupProcess(activity: Activity): void {
    let currentActivity: Activity | null = activity;

    // Process rollup up the tree until we reach the root
    while (currentActivity && currentActivity.parent) {
      const parent = currentActivity.parent;

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

    let totalWeightedMeasure = 0;
    let totalWeight = 0;

    // Calculate weighted average of children's measures
    for (const child of children) {
      // Check if child contributes to rollup
      if (!this.checkChildForRollupSubprocess(child, "measure")) {
        continue;
      }

      if (child.objectiveMeasureStatus && child.objectiveNormalizedMeasure !== null) {
        const weight = child.sequencingControls.objectiveMeasureWeight;
        totalWeightedMeasure += child.objectiveNormalizedMeasure * weight;
        totalWeight += weight;
      }
    }

    // Set parent's measure if we have valid data
    if (totalWeight > 0) {
      activity.objectiveNormalizedMeasure = totalWeightedMeasure / totalWeight;
      activity.objectiveMeasureStatus = true;
    } else {
      activity.objectiveMeasureStatus = false;
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
    const defaultResult = this.objectiveRollupUsingDefault(activity);
    activity.objectiveSatisfiedStatus = defaultResult;
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
      rule.action === RollupActionType.SATISFIED && 
      rule.childActivitySet === "all"
    );
    
    const notSatisfiedRules = rules.filter(rule => 
      rule.action === RollupActionType.NOT_SATISFIED && 
      rule.childActivitySet === "all"
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
    
    // If no children, not satisfied
    if (children.length === 0) {
      return false;
    }

    // Check if all tracked children are satisfied
    for (const child of children) {
      if (this.checkChildForRollupSubprocess(child, "objective")) {
        if (!child.objectiveSatisfiedStatus) {
          return false;
        }
      }
    }

    return true;
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
      rule.action === RollupActionType.COMPLETED && 
      rule.childActivitySet === "all"
    );
    
    const incompleteRules = rollupRules.rules.filter(rule => 
      rule.action === RollupActionType.INCOMPLETE && 
      rule.childActivitySet === "all"
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
    let allCompleted = true;

    for (const child of children) {
      if (this.checkChildForRollupSubprocess(child, "progress")) {
        if (child.completionStatus !== "completed") {
          allCompleted = false;
          break;
        }
      }
    }

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

    // Apply minimum count/percent logic
    if (rule.minimumCount !== null) {
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
}