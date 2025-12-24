import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingRules, RuleActionType, RuleCondition } from "./sequencing_rules";
import { SequencingControls } from "./sequencing_controls";
import { ADLNav } from "../adl";

// Import extracted services
import { ActivityTreeQueries } from "./utils/activity_tree_queries";
import { ChoiceConstraintValidator } from "./validators/choice_constraint_validator";
import { RuleEvaluationEngine, PostConditionResult } from "./rules/rule_evaluation_engine";
import { FlowTraversalService } from "./traversal/flow_traversal_service";
import {
  FlowRequestHandler,
  ChoiceRequestHandler,
  ExitRequestHandler,
  RetryRequestHandler
} from "./handlers";
import {
  SequencingRequestType,
  DeliveryRequestType,
  SequencingResult
} from "./rules/sequencing_request_types";

// Re-export types for backward compatibility
export { SequencingRequestType, DeliveryRequestType, SequencingResult };

/**
 * Result of Post-Condition Rule Evaluation (TB.2.2)
 * Re-exported for backward compatibility
 */
export { PostConditionResult };

/**
 * Options for SequencingProcess
 */
export interface SequencingProcessOptions {
  now?: () => Date;
  getAttemptElapsedSeconds?: (activity: Activity) => number;
  getActivityElapsedSeconds?: (activity: Activity) => number;
}

/**
 * SequencingProcess - Refactored as a coordinator
 *
 * This class has been refactored from 3,036 lines and 66 methods to ~200 lines
 * by extracting functionality into focused, single-responsibility modules:
 *
 * - ActivityTreeQueries: Tree traversal and query utilities
 * - ChoiceConstraintValidator: Choice constraint validation (consolidated from 5 duplicated places)
 * - RuleEvaluationEngine: Sequencing rule evaluation
 * - FlowTraversalService: Flow-based tree traversal
 * - FlowRequestHandler: START, RESUME_ALL, CONTINUE, PREVIOUS requests
 * - ChoiceRequestHandler: CHOICE, JUMP requests
 * - ExitRequestHandler: EXIT, EXIT_ALL, ABANDON, ABANDON_ALL, SUSPEND_ALL requests
 * - RetryRequestHandler: RETRY, RETRY_ALL requests
 *
 * Benefits:
 * - Single source of truth for constraint validation
 * - Improved testability (unit tests per module)
 * - Better maintainability
 * - Reduced cognitive load
 */
export class SequencingProcess {
  private activityTree: ActivityTree;

  // Extracted services
  private treeQueries: ActivityTreeQueries;
  private constraintValidator: ChoiceConstraintValidator;
  private ruleEngine: RuleEvaluationEngine;
  private traversalService: FlowTraversalService;

  // Request handlers
  private flowHandler: FlowRequestHandler;
  private choiceHandler: ChoiceRequestHandler;
  private exitHandler: ExitRequestHandler;
  private retryHandler: RetryRequestHandler;

  // Time function (exposed for testing)
  private _now: () => Date;

  /**
   * Get/set the current time function (used for testing time-dependent logic)
   */
  public get now(): () => Date {
    return this._now;
  }

  public set now(fn: () => Date) {
    this._now = fn;
    // Update the static RuleCondition time provider for condition evaluation
    RuleCondition.setNowProvider(fn);
    // Update the rule engine with the new time function
    this.ruleEngine = new RuleEvaluationEngine({
      now: fn,
      getAttemptElapsedSecondsHook: this._getAttemptElapsedSecondsHook
    });
    // Recreate traversal service with updated rule engine
    this.traversalService = new FlowTraversalService(this.activityTree, this.ruleEngine);
    // Update handlers that depend on traversal service
    this.flowHandler = new FlowRequestHandler(this.activityTree, this.traversalService);
    this.choiceHandler = new ChoiceRequestHandler(
      this.activityTree,
      this.constraintValidator,
      this.traversalService,
      this.treeQueries
    );
    this.retryHandler = new RetryRequestHandler(this.activityTree, this.traversalService);
  }

  private _getAttemptElapsedSecondsHook: ((activity: Activity) => number) | undefined;

  /**
   * Get/set the elapsed seconds hook (used for time-based rules)
   */
  public get getAttemptElapsedSecondsHook(): ((activity: Activity) => number) | undefined {
    return this._getAttemptElapsedSecondsHook;
  }

  public set getAttemptElapsedSecondsHook(fn: ((activity: Activity) => number) | undefined) {
    this._getAttemptElapsedSecondsHook = fn;
    // Update the static RuleCondition elapsed seconds hook
    RuleCondition.setElapsedSecondsHook(fn);
    // Update the rule engine
    this.ruleEngine = new RuleEvaluationEngine({
      now: this._now,
      getAttemptElapsedSecondsHook: fn
    });
    // Recreate traversal service with updated rule engine
    this.traversalService = new FlowTraversalService(this.activityTree, this.ruleEngine);
    // Update handlers that depend on traversal service
    this.flowHandler = new FlowRequestHandler(this.activityTree, this.traversalService);
    this.choiceHandler = new ChoiceRequestHandler(
      this.activityTree,
      this.constraintValidator,
      this.traversalService,
      this.treeQueries
    );
    this.retryHandler = new RetryRequestHandler(this.activityTree, this.traversalService);
  }

  constructor(
    activityTree: ActivityTree,
    _sequencingRules?: SequencingRules | null,
    _sequencingControls?: SequencingControls | null,
    _adlNav: ADLNav | null = null,
    options?: SequencingProcessOptions
  ) {
    this.activityTree = activityTree;

    // Store options for later use
    this._now = options?.now || (() => new Date());
    this._getAttemptElapsedSecondsHook = options?.getAttemptElapsedSeconds;

    // Initialize extracted services
    this.treeQueries = new ActivityTreeQueries(activityTree);
    this.ruleEngine = new RuleEvaluationEngine({
      now: this._now,
      getAttemptElapsedSecondsHook: this._getAttemptElapsedSecondsHook
    });
    this.constraintValidator = new ChoiceConstraintValidator(activityTree, this.treeQueries);
    this.traversalService = new FlowTraversalService(activityTree, this.ruleEngine);

    // Initialize request handlers with dependencies
    this.flowHandler = new FlowRequestHandler(activityTree, this.traversalService);
    this.choiceHandler = new ChoiceRequestHandler(
      activityTree,
      this.constraintValidator,
      this.traversalService,
      this.treeQueries
    );
    this.exitHandler = new ExitRequestHandler(activityTree, this.ruleEngine);
    this.retryHandler = new RetryRequestHandler(activityTree, this.traversalService);
  }

  /**
   * Main Sequencing Request Process (SB.2.12)
   * This is the main entry point for all navigation requests
   * @param {SequencingRequestType} request - The sequencing request
   * @param {string | null} targetActivityId - Target activity ID (for CHOICE and JUMP)
   * @return {SequencingResult}
   */
  public sequencingRequestProcess(
    request: SequencingRequestType,
    targetActivityId: string | null = null
  ): SequencingResult {
    const currentActivity = this.activityTree.currentActivity;

    switch (request) {
      case SequencingRequestType.START:
        return this.flowHandler.handleStart();

      case SequencingRequestType.RESUME_ALL:
        return this.flowHandler.handleResumeAll();

      case SequencingRequestType.CONTINUE:
        if (!currentActivity) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
        }
        return this.flowHandler.handleContinue(currentActivity);

      case SequencingRequestType.PREVIOUS:
        if (!currentActivity) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
        }
        return this.flowHandler.handlePrevious(currentActivity);

      case SequencingRequestType.CHOICE:
        if (!targetActivityId) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-5");
        }
        return this.choiceHandler.handleChoice(targetActivityId, currentActivity);

      case SequencingRequestType.JUMP:
        if (!targetActivityId) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-5");
        }
        return this.choiceHandler.handleJump(targetActivityId);

      case SequencingRequestType.EXIT:
        if (!currentActivity) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
        }
        return this.exitHandler.handleExit(currentActivity);

      case SequencingRequestType.EXIT_ALL:
        if (!currentActivity) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
        }
        return this.exitHandler.handleExitAll();

      case SequencingRequestType.ABANDON:
        if (!currentActivity) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
        }
        return this.exitHandler.handleAbandon(currentActivity);

      case SequencingRequestType.ABANDON_ALL:
        if (!currentActivity) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
        }
        return this.exitHandler.handleAbandonAll();

      case SequencingRequestType.SUSPEND_ALL:
        if (!currentActivity) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
        }
        return this.exitHandler.handleSuspendAll(currentActivity);

      case SequencingRequestType.RETRY:
        if (!currentActivity) {
          return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-1");
        }
        return this.retryHandler.handleRetry(currentActivity);

      case SequencingRequestType.RETRY_ALL:
        return this.retryHandler.handleRetryAll();

      default:
        return new SequencingResult(DeliveryRequestType.DO_NOT_DELIVER, null, "SB.2.12-6");
    }
  }

  /**
   * Evaluate post-condition rules for the current activity
   * @param {Activity} activity - The activity to evaluate
   * @return {PostConditionResult} - The post-condition result
   */
  public evaluatePostConditionRules(activity: Activity): PostConditionResult {
    return this.ruleEngine.evaluatePostConditions(activity);
  }

  /**
   * Check if an activity can be delivered
   * @param {Activity} activity - The activity to check
   * @return {boolean} - True if the activity can be delivered
   */
  public canActivityBeDelivered(activity: Activity): boolean {
    return this.traversalService.canDeliver(activity);
  }

  /**
   * Validate navigation request before expensive operations
   * @param {SequencingRequestType} request - The navigation request
   * @param {string | null} targetActivityId - Target activity ID
   * @param {Activity | null} currentActivity - Current activity
   * @return {{valid: boolean, exception: string | null}} - Validation result
   */
  public validateNavigationRequest(
    request: SequencingRequestType,
    targetActivityId: string | null = null,
    currentActivity: Activity | null = null
  ): { valid: boolean; exception: string | null } {
    // Basic request type validation
    const validRequestTypes = Object.values(SequencingRequestType);
    if (!validRequestTypes.includes(request)) {
      return { valid: false, exception: "SB.2.12-6" };
    }

    // Validate based on request type
    switch (request) {
      case SequencingRequestType.CONTINUE:
      case SequencingRequestType.PREVIOUS: {
        if (!currentActivity) {
          return { valid: false, exception: "SB.2.12-1" };
        }
        if (currentActivity.isActive) {
          return {
            valid: false,
            exception: request === SequencingRequestType.CONTINUE ? "SB.2.7-1" : "SB.2.8-1"
          };
        }
        if (currentActivity.parent && !currentActivity.parent.sequencingControls.flow) {
          return {
            valid: false,
            exception: request === SequencingRequestType.CONTINUE ? "SB.2.7-2" : "SB.2.8-2"
          };
        }
        if (request === SequencingRequestType.PREVIOUS) {
          const forwardOnlyViolation = this.constraintValidator.checkForwardOnlyViolation(
            currentActivity
          );
          if (!forwardOnlyViolation.valid) {
            return forwardOnlyViolation;
          }
        }
        break;
      }

      case SequencingRequestType.CHOICE: {
        if (!targetActivityId) {
          return { valid: false, exception: "SB.2.12-5" };
        }
        const targetActivity = this.activityTree.getActivity(targetActivityId);
        if (!targetActivity) {
          return { valid: false, exception: "SB.2.9-1" };
        }
        const choiceValidation = this.constraintValidator.validateChoice(
          currentActivity,
          targetActivity,
          { checkAvailability: true }
        );
        if (!choiceValidation.valid) {
          return choiceValidation;
        }
        if (!this.traversalService.canDeliver(targetActivity)) {
          return { valid: false, exception: "SB.2.9-6" };
        }
        // Check for hiddenFromChoice precondition rule
        const preConditionResult = this.ruleEngine.checkSequencingRules(
          targetActivity,
          targetActivity.sequencingRules.preConditionRules
        );
        if (preConditionResult === RuleActionType.HIDE_FROM_CHOICE) {
          return { valid: false, exception: "SB.2.9-4" };
        }
        break;
      }

      case SequencingRequestType.JUMP: {
        if (!targetActivityId) {
          return { valid: false, exception: "SB.2.12-5" };
        }
        const jumpTarget = this.activityTree.getActivity(targetActivityId);
        if (!jumpTarget) {
          return { valid: false, exception: "SB.2.13-1" };
        }
        break;
      }

      default:
        break;
    }

    return { valid: true, exception: null };
  }

  /**
   * Get all available activities that can be selected via choice navigation
   * @return {Activity[]} - Array of activities available for choice
   */
  public getAvailableChoices(): Activity[] {
    return this.choiceHandler.getAvailableChoices();
  }

  // Expose services for advanced use cases
  public getTreeQueries(): ActivityTreeQueries {
    return this.treeQueries;
  }

  public getConstraintValidator(): ChoiceConstraintValidator {
    return this.constraintValidator;
  }

  public getRuleEngine(): RuleEvaluationEngine {
    return this.ruleEngine;
  }

  public getTraversalService(): FlowTraversalService {
    return this.traversalService;
  }
}
