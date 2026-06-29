/// <reference types="vite/client" />
/**
 * Fixture-driven runner for ADL SCORM Layer-1 (RTE data-model) conformance cases.
 *
 * Each fixture is a clean JSON description of an ADL test case (or a self-contained
 * slice of one). The runner instantiates the correct scorm-again API, optionally
 * seeds launch-provided state, replays the RTE command sequence, and asserts the
 * return value + GetLastError code after every step.
 *
 * This is PURELY ADDITIVE test tooling. It does not import or touch any other test
 * suite and only reads the public scorm-again API surface. Fixtures are discovered
 * with Vite/Vitest's import.meta.glob, so there is no Node filesystem dependency.
 *
 * See ./README.md for the fixture schema and provenance of each fixture.
 */
import { expect } from "vitest";
import Scorm12API from "../../../src/Scorm12API";
import Scorm2004API from "../../../src/Scorm2004API";
import { LogLevelEnum } from "../../../src/constants/enums";
import type { StringKeyMap } from "../../../src/utilities";

/** The RTE methods a Layer-1 case can invoke. */
export type RteMethod =
  | "Initialize"
  | "Terminate"
  | "Commit"
  | "GetValue"
  | "SetValue"
  | "GetLastError"
  | "GetErrorString"
  | "GetDiagnostic";

/**
 * A return-value matcher. Use a plain string for an exact match (including ""
 * for the ADL "emptyCS" marker), or a matcher object for the cases where the
 * ADL suite only constrains the shape of an implementation-defined string.
 *  - `{ match: "nonEmptyMax255" }` models the ADL "less255" marker: a non-empty
 *    string no longer than 255 characters (used for GetErrorString /
 *    GetDiagnostic wording, which is implementation-defined).
 */
export type ExpectedReturn = string | { match: "nonEmptyMax255" };

/**
 * Documents a real, confirmed divergence between scorm-again and the ADL
 * expectation for a single step. When present, `expectedReturn` /
 * `expectedErrorCode` remain the ADL-faithful (spec-required) values, but the
 * runner asserts the divergent value scorm-again actually produces today
 * (`actualReturn` / `actualErrorCode`). This keeps the suite green while
 * pinning the current behaviour: if scorm-again is fixed, this assertion fails
 * loudly and prompts us to retire the annotation.
 */
export interface KnownDivergence {
  /** Actual return value scorm-again produces (omit if only the code diverges). */
  actualReturn?: string;
  /** Actual GetLastError code scorm-again produces (omit if only the return diverges). */
  actualErrorCode?: string;
  /** One-line description of the finding. */
  finding: string;
  /** ADL case key + spec reference. */
  reference: string;
}

export interface Step {
  /** Which RTE method to call. */
  method: RteMethod;
  /** CMI element path for GetValue / SetValue (e.g. "cmi.location"). */
  element?: string;
  /**
   * The single string argument for the call:
   *  - SetValue: the value to store
   *  - Initialize / Terminate / Commit: the parameter (should be "" to succeed)
   *  - GetErrorString / GetDiagnostic: the error code to look up
   */
  value?: string;
  /** Expected return value; omit to skip the return-value assertion. */
  expectedReturn?: ExpectedReturn;
  /** Expected GetLastError code immediately after the call (numeric string). */
  expectedErrorCode: string;
  /** Confirmed scorm-again divergence; see {@link KnownDivergence}. */
  knownDivergence?: KnownDivergence;
}

export interface Activity {
  /** Identifier matching the ADL Act{N}V{V} attempt this slice came from. */
  id: string;
  /** Optional per-activity launch state; overrides the fixture-level initialState. */
  initialState?: StringKeyMap;
  steps: Step[];
}

export interface Fixture {
  /** Unique fixture id; surfaced in failure messages. */
  id: string;
  scormVersion: "1.2" | "2004";
  /** ADL provenance note (which .properties case + keys this came from). */
  source?: string;
  /** Launch-provided state seeded before Initialize for every activity. */
  initialState?: StringKeyMap;
  activities: Activity[];
}

type ScormApi = Scorm12API | Scorm2004API;

function buildApi(version: "1.2" | "2004", initialState?: StringKeyMap): ScormApi {
  const api: ScormApi =
    version === "1.2"
      ? new Scorm12API({ logLevel: LogLevelEnum.NONE })
      : new Scorm2004API({ logLevel: LogLevelEnum.NONE });
  if (initialState) {
    // Seed launch-provided values exactly as an LMS would before handing the
    // API to the SCO. loadFromJSON applies values without the SCO-facing
    // read-only restrictions, since the content session has not started yet.
    api.loadFromJSON(initialState, "");
  }
  return api;
}

function callMethod(api: ScormApi, step: Step): string {
  switch (step.method) {
    case "Initialize":
      return api.lmsInitialize(step.value ?? "");
    case "Terminate":
      return api.lmsFinish(step.value ?? "");
    case "Commit":
      return api.lmsCommit(step.value ?? "");
    case "GetValue":
      return api.lmsGetValue(step.element ?? "");
    case "SetValue":
      return api.lmsSetValue(step.element ?? "", step.value);
    case "GetLastError":
      return api.lmsGetLastError();
    case "GetErrorString":
      return api.lmsGetErrorString(step.value ?? "");
    case "GetDiagnostic":
      return api.lmsGetDiagnostic(step.value ?? "");
    default: {
      const exhaustive: never = step.method;
      throw new Error(`Unsupported RTE method: ${String(exhaustive)}`);
    }
  }
}

function describeStep(step: Step): string {
  const arg =
    step.method === "GetValue"
      ? step.element
      : step.method === "SetValue"
        ? `${step.element} = ${JSON.stringify(step.value)}`
        : step.value !== undefined
          ? JSON.stringify(step.value)
          : "";
  return `${step.method}(${arg ?? ""})`;
}

function assertReturn(expected: ExpectedReturn, actual: string, where: string): void {
  if (typeof expected === "string") {
    expect(actual, `${where}: expected return ${JSON.stringify(expected)}`).toBe(expected);
    return;
  }
  // matcher object
  expect(typeof actual, `${where}: expected a string return`).toBe("string");
  expect(
    actual.length > 0 && actual.length <= 255,
    `${where}: expected non-empty string <= 255 chars, got ${JSON.stringify(actual)}`,
  ).toBe(true);
}

/**
 * Run a single fixture: one fresh API per activity, replay every step, and
 * assert the return value and resulting error code with a precise location in
 * the failure message (fixture id > activity id > step index).
 */
export function runFixture(fixture: Fixture): void {
  for (const activity of fixture.activities) {
    const seed = activity.initialState ?? fixture.initialState;
    const api = buildApi(fixture.scormVersion, seed);

    activity.steps.forEach((step, index) => {
      const where = `[${fixture.id} > ${activity.id} > step ${index}] ${describeStep(step)}`;
      const actualReturn = callMethod(api, step);
      // GetLastError does not mutate the error state, so reading it here is a
      // faithful check of the code the step left behind.
      const actualError = api.lmsGetLastError();

      const div = step.knownDivergence;
      if (div) {
        // Pin scorm-again's current (non-conformant) behaviour so a future fix
        // surfaces here. The ADL-faithful expectation lives in expectedReturn /
        // expectedErrorCode and is intentionally not asserted while diverged.
        if (div.actualReturn !== undefined) {
          expect(actualReturn, `${where}: known-divergence return drift`).toBe(div.actualReturn);
        }
        if (div.actualErrorCode !== undefined) {
          expect(actualError, `${where}: known-divergence error-code drift`).toBe(
            div.actualErrorCode,
          );
        }
        return;
      }

      if (step.expectedReturn !== undefined) {
        assertReturn(step.expectedReturn, actualReturn, where);
      }
      expect(actualError, `${where}: expected GetLastError ${step.expectedErrorCode}`).toBe(
        step.expectedErrorCode,
      );
    });
  }
}

/**
 * Load every fixture: the hand-authored gold cases in ./fixtures plus the
 * auto-decoded corpus in ./fixtures/generated (produced by generate-fixtures.ts).
 * Sorted by path for stable ordering.
 *
 * Uses Vite/Vitest's import.meta.glob (eager) instead of reading the directory
 * off disk, so the suite carries no Node `fs`/`path` dependency and stays
 * browser-safe. Each JSON module exposes the parsed fixture as its default export.
 */
export function loadFixtures(): Fixture[] {
  const modules = import.meta.glob(["./fixtures/*.json", "./fixtures/generated/*.json"], {
    eager: true,
  }) as Record<string, { default: Fixture }>;
  return Object.entries(modules)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([, module]) => module.default);
}
