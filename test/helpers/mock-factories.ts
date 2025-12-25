/**
 * Shared mock factories for SCORM 2004 sequencing tests
 *
 * This module provides type-safe mock creation utilities that can be used
 * across test files to reduce duplication and ensure consistency.
 */

import { vi } from "vitest";
import { Activity, RollupConsiderationsConfig } from "../../src/cmi/scorm2004/sequencing/activity";
import { RollupCondition } from "../../src/cmi/scorm2004/sequencing/rollup_rules";
import { CompletionStatus, SuccessStatus } from "../../src/constants/enums";
import { MeasureRollupProcessor } from "../../src/cmi/scorm2004/sequencing/rollup/measure_rollup";
import { ObjectiveRollupProcessor } from "../../src/cmi/scorm2004/sequencing/rollup/objective_rollup";
import { ProgressRollupProcessor } from "../../src/cmi/scorm2004/sequencing/rollup/progress_rollup";
import {
  GlobalObjectiveMapEntry,
  Settings,
  SequencingStateMetadata,
} from "../../src/types/api_types";
import { CMI } from "../../src/cmi/scorm2004/cmi";
import { ADL } from "../../src/cmi/scorm2004/adl";
import { Sequencing } from "../../src/cmi/scorm2004/sequencing/sequencing";
import { SequencingService } from "../../src/services/SequencingService";
import { OverallSequencingProcess } from "../../src/cmi/scorm2004/sequencing/overall_sequencing_process";
import {
  GlobalObjectiveContext,
  GlobalObjectiveManager,
} from "../../src/objectives/global_objective_manager";
import { PersistenceContext } from "../../src/persistence/sequencing_state_persistence";

// ============================================================================
// Activity Mock Options
// ============================================================================

/**
 * Options for creating mock Activity objects
 */
export interface MockActivityOptions {
  id?: string;
  title?: string;
  tracked?: boolean;
  rollupObjectiveSatisfied?: boolean;
  rollupProgressCompletion?: boolean;
  attemptProgressStatus?: boolean;
  attemptCount?: number;
  isSuspended?: boolean;
  wasSkipped?: boolean;
  isAvailable?: boolean;
  requiredForSatisfied?: string;
  requiredForNotSatisfied?: string;
  requiredForCompleted?: string;
  requiredForIncomplete?: string;
  objectiveSatisfiedStatus?: boolean | null;
  objectiveMeasureStatus?: boolean;
  successStatus?: SuccessStatus;
  completionStatus?: CompletionStatus | string;
  progressMeasureStatus?: boolean;
  isCompleted?: boolean;
  activityAttemptActive?: boolean;
  isActive?: boolean;
  children?: Activity[];
  flow?: boolean;
  sequencingRules?: {
    preConditionRules: unknown[];
  };
}

/**
 * Creates a mock Activity object for testing rollup and sequencing logic
 *
 * @param options - Configuration options for the mock activity
 * @returns A mock Activity object
 */
export function createMockActivity(options: MockActivityOptions = {}): Activity {
  const id = options.id ?? `activity-${Math.random().toString(36).substring(2, 11)}`;

  return {
    id,
    title: options.title ?? id,
    sequencingControls: {
      tracked: options.tracked !== false,
      rollupObjectiveSatisfied: options.rollupObjectiveSatisfied !== false,
      rollupProgressCompletion: options.rollupProgressCompletion !== false,
      flow: options.flow ?? false,
    },
    attemptProgressStatus: options.attemptProgressStatus ?? true,
    attemptCount: options.attemptCount ?? 1,
    isSuspended: options.isSuspended ?? false,
    wasSkipped: options.wasSkipped ?? false,
    isAvailable: options.isAvailable !== false,
    requiredForSatisfied: options.requiredForSatisfied ?? "always",
    requiredForNotSatisfied: options.requiredForNotSatisfied ?? "always",
    requiredForCompleted: options.requiredForCompleted ?? "always",
    requiredForIncomplete: options.requiredForIncomplete ?? "always",
    objectiveSatisfiedStatus: options.objectiveSatisfiedStatus ?? null,
    objectiveMeasureStatus: options.objectiveMeasureStatus ?? false,
    successStatus: options.successStatus ?? SuccessStatus.UNKNOWN,
    completionStatus: options.completionStatus ?? CompletionStatus.UNKNOWN,
    progressMeasureStatus: options.progressMeasureStatus ?? false,
    isCompleted: options.isCompleted ?? false,
    activityAttemptActive: options.activityAttemptActive ?? false,
    isActive: options.isActive ?? false,
    children: options.children ?? [],
    sequencingRules: options.sequencingRules ?? { preConditionRules: [] },
  } satisfies Partial<Activity> as unknown as Activity;
}

// ============================================================================
// RollupCondition Mock
// ============================================================================

/**
 * Creates a mock RollupCondition with a typed evaluate function
 *
 * @param evaluateFn - Function to evaluate the condition against an activity
 * @returns A mock RollupCondition
 */
export function createMockCondition(evaluateFn: (activity: Activity) => boolean): RollupCondition {
  return {
    evaluate: evaluateFn,
  } satisfies Pick<RollupCondition, "evaluate"> as unknown as RollupCondition;
}

// ============================================================================
// RollupConsiderationsConfig
// ============================================================================

/**
 * Creates a default RollupConsiderationsConfig for testing
 *
 * @param overrides - Optional overrides for specific fields
 * @returns A RollupConsiderationsConfig object
 */
export function createMockRollupConsiderations(
  overrides: Partial<RollupConsiderationsConfig> = {},
): RollupConsiderationsConfig {
  return {
    measureSatisfactionIfActive: true,
    requiredForSatisfied: "always",
    requiredForNotSatisfied: "always",
    requiredForCompleted: "always",
    requiredForIncomplete: "always",
    ...overrides,
  } satisfies RollupConsiderationsConfig;
}

// ============================================================================
// Processor Mocks
// ============================================================================

/**
 * Options for mock processors
 */
export interface MockProcessorOptions {
  measureRollupResult?: Activity[];
}

/**
 * Return type for createMockProcessors
 */
export interface MockProcessors {
  measureProcessor: MeasureRollupProcessor;
  objectiveProcessor: ObjectiveRollupProcessor;
  progressProcessor: ProgressRollupProcessor;
}

/**
 * Creates mock rollup processors for testing CrossClusterProcessor
 *
 * @param options - Configuration options for the mock processors
 * @returns An object containing mock measure, objective, and progress processors
 */
export function createMockProcessors(options: MockProcessorOptions = {}): MockProcessors {
  const measureProcessor = {
    measureRollupProcess: vi.fn().mockReturnValue(options.measureRollupResult ?? []),
  } satisfies Pick<MeasureRollupProcessor, "measureRollupProcess">;

  const objectiveProcessor = {
    objectiveRollupProcess: vi.fn(),
  } satisfies Pick<ObjectiveRollupProcessor, "objectiveRollupProcess">;

  const progressProcessor = {
    activityProgressRollupProcess: vi.fn(),
  } satisfies Pick<ProgressRollupProcessor, "activityProgressRollupProcess">;

  return {
    measureProcessor: measureProcessor as unknown as MeasureRollupProcessor,
    objectiveProcessor: objectiveProcessor as unknown as ObjectiveRollupProcessor,
    progressProcessor: progressProcessor as unknown as ProgressRollupProcessor,
  };
}

// ============================================================================
// Overall Process Mocks
// ============================================================================

/**
 * Options for creating mock OverallSequencingProcess
 */
export interface MockOverallProcessOptions {
  sequencingState?: Record<string, unknown>;
  contentDelivered?: boolean;
  globalObjectiveMap?: Map<string, GlobalObjectiveMapEntry>;
  globalObjectiveMapSnapshot?: Record<string, GlobalObjectiveMapEntry>;
}

/**
 * Return type for createMockOverallProcess
 */
export interface MockOverallProcess {
  getSequencingState: ReturnType<typeof vi.fn>;
  hasContentBeenDelivered: ReturnType<typeof vi.fn>;
  restoreSequencingState: ReturnType<typeof vi.fn>;
  setContentDelivered: ReturnType<typeof vi.fn>;
  getGlobalObjectiveMap: ReturnType<typeof vi.fn>;
  getGlobalObjectiveMapSnapshot: ReturnType<typeof vi.fn>;
  updateGlobalObjective: ReturnType<typeof vi.fn>;
}

/**
 * Creates a mock OverallSequencingProcess for testing
 *
 * @param options - Configuration options for the mock process
 * @returns A mock OverallSequencingProcess object
 */
export function createMockOverallProcess(
  options: MockOverallProcessOptions = {},
): MockOverallProcess {
  return {
    getSequencingState: vi.fn().mockReturnValue(options.sequencingState ?? {}),
    hasContentBeenDelivered: vi.fn().mockReturnValue(options.contentDelivered ?? false),
    restoreSequencingState: vi.fn(),
    setContentDelivered: vi.fn(),
    getGlobalObjectiveMap: vi.fn().mockReturnValue(options.globalObjectiveMap ?? new Map()),
    getGlobalObjectiveMapSnapshot: vi
      .fn()
      .mockReturnValue(options.globalObjectiveMapSnapshot ?? {}),
    updateGlobalObjective: vi.fn(),
  } satisfies MockOverallProcess;
}

/**
 * Creates a mock SequencingService for testing
 */
export function createMockSequencingService(
  overallProcess?: ReturnType<typeof createMockOverallProcess>,
) {
  return {
    getOverallSequencingProcess: vi.fn().mockReturnValue(overallProcess ?? null),
  } as unknown as SequencingService;
}

// ============================================================================
// Settings Mocks
// ============================================================================

/**
 * Options for mock persistence configuration
 */
export interface MockPersistenceConfig {
  stateVersion?: string;
  compress?: boolean;
  maxStateSize?: number;
  debugPersistence?: boolean;
  saveState?: ReturnType<typeof vi.fn>;
  loadState?: ReturnType<typeof vi.fn>;
}

/**
 * Creates mock Settings object for testing
 *
 * @param persistenceConfig - Optional configuration for sequencing state persistence
 * @returns A mock Settings object
 */
export function createMockSettings(persistenceConfig?: MockPersistenceConfig): Settings {
  return {
    sequencingStatePersistence: persistenceConfig
      ? {
          stateVersion: persistenceConfig.stateVersion ?? "1.0",
          compress: persistenceConfig.compress,
          maxStateSize: persistenceConfig.maxStateSize,
          debugPersistence: persistenceConfig.debugPersistence,
          persistence: {
            saveState: persistenceConfig.saveState ?? vi.fn().mockResolvedValue(true),
            loadState: persistenceConfig.loadState ?? vi.fn().mockResolvedValue(null),
          },
        }
      : undefined,
    courseId: "test-course",
    globalObjectiveIds: [],
  } satisfies Partial<Settings> as Settings;
}

// ============================================================================
// ADL and Sequencing Mocks
// ============================================================================

/**
 * Creates a mock ADL object for testing
 */
export function createMockADL(): ADL {
  return {
    nav: {
      request: "_none_",
      request_valid: {},
    },
  } as unknown as ADL;
}

/**
 * Creates a mock Sequencing object for testing
 */
export function createMockSequencing(currentActivity?: { id: string }): Sequencing {
  return {
    getCurrentActivity: vi.fn().mockReturnValue(currentActivity ?? null),
  } as unknown as Sequencing;
}

// ============================================================================
// Context Mocks
// ============================================================================

/**
 * Creates a mock GlobalObjectiveContext for testing GlobalObjectiveManager
 */
export function createMockGlobalObjectiveContext(
  overrides: Partial<GlobalObjectiveContext> = {},
): GlobalObjectiveContext {
  return {
    getSettings: vi.fn().mockReturnValue({ globalObjectiveIds: [] }),
    cmi: {
      objectives: {
        findObjectiveById: vi.fn().mockReturnValue(null),
        childArray: [],
      },
    } as unknown as CMI,
    sequencing: null,
    sequencingService: null,
    commonSetCMIValue: vi.fn().mockReturnValue("true"),
    ...overrides,
  };
}

/**
 * Creates a mock PersistenceContext for testing SequencingStatePersistence
 */
export function createMockPersistenceContext(
  overrides: Partial<PersistenceContext> = {},
): PersistenceContext {
  return {
    getSettings: vi.fn().mockReturnValue(createMockSettings()),
    apiLog: vi.fn(),
    adl: createMockADL(),
    sequencing: createMockSequencing(),
    sequencingService: null,
    learnerId: "test-learner",
    ...overrides,
  };
}

// ============================================================================
// Type Guard Utilities
// ============================================================================

/**
 * Type guard to check if a value is a Vitest mock function
 *
 * Performs robust checking to verify the value has the expected mock structure
 * including the mock.calls array that Vitest provides.
 *
 * @param value - The value to check
 * @returns True if the value is a Vitest mock function
 */
export function isMockFunction(value: unknown): value is ReturnType<typeof vi.fn> {
  if (typeof value !== "function" || !("mock" in value)) {
    return false;
  }

  const mockValue = value as { mock?: unknown };
  if (typeof mockValue.mock !== "object" || mockValue.mock === null) {
    return false;
  }

  const mock = mockValue.mock as { calls?: unknown };
  return Array.isArray(mock.calls);
}

/**
 * Filters mock calls from an event callback by event type
 *
 * @typeParam T - The type of the event payload
 * @param eventCallback - The mock event callback function
 * @param eventType - The event type string to filter by
 * @returns An array of matching event calls as [eventType, payload] tuples
 */
export function getEventCallsByType<T = unknown>(
  eventCallback: ReturnType<typeof vi.fn>,
  eventType: string,
): Array<[string, T]> {
  return eventCallback.mock.calls.filter((call): call is [string, T] => call[0] === eventType);
}
