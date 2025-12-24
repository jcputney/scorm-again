import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { ActivityTreeQueries } from "../utils/activity_tree_queries";
export interface ConstraintValidationResult {
    valid: boolean;
    exception: string | null;
}
export interface ChoiceValidationOptions {
    checkAvailability?: boolean;
}
export declare class ChoiceConstraintValidator {
    private activityTree;
    private treeQueries;
    constructor(activityTree: ActivityTree, treeQueries: ActivityTreeQueries);
    validateChoice(currentActivity: Activity | null, targetActivity: Activity, options?: ChoiceValidationOptions): ConstraintValidationResult;
    validatePathToRoot(targetActivity: Activity): ConstraintValidationResult;
    validateChoiceExit(currentActivity: Activity, targetActivity: Activity): ConstraintValidationResult;
    validateAncestorConstraints(currentActivity: Activity, targetActivity: Activity): ConstraintValidationResult;
    private validateConstraintsAtLevel;
    checkForwardOnlyViolation(fromActivity: Activity): ConstraintValidationResult;
    isAvailableForChoice(activity: Activity): boolean;
    validateFlowConstraints(fromActivity: Activity, children: Activity[]): {
        valid: boolean;
        validChildren: Activity[];
    };
    meetsFlowConstraints(activity: Activity, parent: Activity): boolean;
    private validateConstrainChoiceForFlow;
    validateTraversalConstraints(activity: Activity): {
        canTraverse: boolean;
        canTraverseInto: boolean;
    };
    private evaluateConstrainChoiceForTraversal;
    private evaluateForwardOnlyForChoice;
    hasTimeBoundaryViolation(targetActivity: Activity, now: Date): boolean;
    hasAttemptLimitViolation(targetActivity: Activity): boolean;
}
//# sourceMappingURL=choice_constraint_validator.d.ts.map