import { Activity } from "../activity.js";
import { ActivityTree } from "../activity_tree.js";
import { RuleEvaluationEngine } from "../rules/rule_evaluation_engine.js";
export interface StateConsistencyResult {
    consistent: boolean;
    exception: string | null;
}
export interface ResourceConstraintResult {
    available: boolean;
    exception: string | null;
}
export interface ConcurrentDeliveryResult {
    allowed: boolean;
    exception: string | null;
}
export interface DependencyResult {
    satisfied: boolean;
    exception: string | null;
}
export declare class DeliveryValidator {
    private activityTree;
    private eventCallback;
    private now;
    private contentDeliveredGetter;
    private ruleEngineProvider;
    constructor(activityTree: ActivityTree, eventCallback?: ((eventType: string, data?: any) => void) | null, options?: {
        now?: () => Date;
    }, ruleEngineProvider?: () => RuleEvaluationEngine);
    setContentDeliveredGetter(getter: () => boolean): void;
    validateTreeConsistency(activity: Activity): StateConsistencyResult;
    validateResources(activity: Activity): ResourceConstraintResult;
    validateConcurrentDelivery(activity: Activity): ConcurrentDeliveryResult;
    validateDependencies(activity: Activity): DependencyResult;
    checkActivity(activity: Activity, evaluationActivity?: Activity, emitEvent?: boolean): boolean;
    checkLimitConditions(activity: Activity, emitEvent?: boolean): boolean;
    private isActivityPartOfTree;
    private getActiveActivities;
    private collectActiveActivities;
    getRequiredResources(activity: Activity): string[];
    isResourceAvailable(resource: string): boolean;
    checkSystemLimits(): {
        adequate: boolean;
    };
    private hasPendingDeliveryRequests;
    private isDeliveryLocked;
    getPrerequisites(activity: Activity): string[];
    isPrerequisiteSatisfied(prerequisiteId: string, _activity: Activity): boolean;
    getObjectiveDependencies(activity: Activity): string[];
    isObjectiveDependencySatisfied(objectiveId: string): boolean;
    private getSequencingRuleDependencies;
    private parseDurationToMinutes;
    private fireEvent;
}
//# sourceMappingURL=delivery_validator.d.ts.map