/**
 * ADL Layer-1 (RTE data-model) command decoder.
 *
 * A TypeScript port of the Layer-1 decoding in the ADL test suite's
 * `LMSParser.java` (+ `Resources.getString` / `Commands.properties`). It reads an
 * ADL `*.properties` test case and emits a {@link Fixture} consumed by this
 * folder's runner. It decodes ONLY the `Act{N}V{V}.commands.{i}` RTE tokens; the
 * sequencing/navigation layer (UIQ/UIA/CUI, `adl.nav.request`) is out of scope and
 * is dropped (and logged) per step.
 *
 * Pure functions only — no filesystem access. `generate-fixtures.ts` drives it.
 *
 * Grammar (from LMSParser.java), token = `METHOD->arg->expected->errorCode`:
 *  - method: I doInitialize, T doTerminate, C doCommit, GET doGetValue,
 *    SET doSetValue, GES doGetErrorString, GLE doGetLastError, GeDi doGetDiagnostic,
 *    COI compareObjIds (dropped).
 *  - element segments join on `~`; in SET the final segment splits on `!` into
 *    (final-element-segment, set-value). Each segment is resolved via
 *    Commands.properties; UNKNOWN keys resolve to the key itself (so numeric array
 *    indices and literal values like "P5Y6M4DT12H30M58S" pass through) — this
 *    mirrors `Resources.getString` returning `iKey` on MissingResourceException.
 *  - expected-value markers: `less255` -> a non-empty string <=255 chars matcher;
 *    `emptyCS` / empty -> "".
 */
import type { Activity, ExpectedReturn, Fixture, Step, RteMethod } from "./runner";

/** Why a single command token was not turned into a runnable step. */
export interface SkippedStep {
  activityId: string;
  command: string;
  reason: string;
}

export interface DecodeResult {
  fixture: Fixture;
  skipped: SkippedStep[];
}

const METHOD_BY_TOKEN: Record<string, RteMethod | "compareObjIds"> = {
  I: "Initialize",
  T: "Terminate",
  C: "Commit",
  GET: "GetValue",
  SET: "SetValue",
  GLE: "GetLastError",
  GES: "GetErrorString",
  GeDi: "GetDiagnostic",
  COI: "compareObjIds",
};

/**
 * Parse a Java `.properties` text into a key->value map. Handles `#`/`!` comment
 * lines, blank lines, trailing-backslash line continuation, and splits each entry
 * on its first unescaped `=` or `:`. Sufficient for Commands.properties and the
 * single-line RTE test cases (multi-line cases such as DDM are not targeted).
 */
export function parseProperties(text: string): Map<string, string> {
  const map = new Map<string, string>();
  const rawLines = text.split(/\r?\n/);
  const logical: string[] = [];

  for (let i = 0; i < rawLines.length; i++) {
    let line = rawLines[i]!;
    // Join continuation lines (odd number of trailing backslashes continues).
    while (/\\$/.test(line) && (line.match(/\\+$/)?.[0].length ?? 0) % 2 === 1) {
      line = line.slice(0, -1) + (rawLines[++i] ?? "");
    }
    logical.push(line);
  }

  for (const line of logical) {
    const trimmed = line.replace(/^\s+/, "");
    if (trimmed === "" || trimmed.startsWith("#") || trimmed.startsWith("!")) {
      continue;
    }
    const sep = firstSeparatorIndex(trimmed);
    if (sep === -1) {
      continue;
    }
    const key = trimmed.slice(0, sep).trim();
    const value = trimmed.slice(sep + 1).replace(/^\s+/, "");
    map.set(key, value);
  }
  return map;
}

function firstSeparatorIndex(line: string): number {
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "\\") {
      i++; // skip escaped char
      continue;
    }
    if (ch === "=" || ch === ":") {
      return i;
    }
  }
  return -1;
}

/** Resolve a token via the dictionary; unknown keys return the key itself. */
function resolve(dict: Map<string, string>, token: string): string {
  return dict.has(token) ? dict.get(token)! : token;
}

/**
 * Resolve a GET element path: split on `~`, resolve each segment, join with `.`.
 * A segment may carry an embedded interaction type marker (`SEG!TYPE`); only the
 * element part before `!` contributes to the path.
 */
export function resolveElement(dict: Map<string, string>, token: string): string {
  if (!token.includes("~")) {
    return token;
  }
  return token
    .split("~")
    .map((seg) => {
      const bang = seg.indexOf("!");
      return resolve(dict, bang > -1 ? seg.slice(0, bang) : seg);
    })
    .join(".");
}

/**
 * Resolve a SET parameter (`element!value`). The `~`-joined segments form the
 * element path; the final segment splits on `!` into (final element segment, set
 * value). Replicates every length branch of `parseSetCommandsDMParams` — they all
 * reduce to this once unknown keys resolve to themselves.
 */
export function parseSetParams(
  dict: Map<string, string>,
  token: string,
): { element: string; setValue: string } {
  const segs = token.split("~");
  const last = segs[segs.length - 1]!;
  let finalElementSeg: string;
  let valueToken: string;
  if (last.endsWith("!")) {
    finalElementSeg = last.slice(0, -1);
    valueToken = "";
  } else {
    const bang = last.indexOf("!");
    finalElementSeg = bang > -1 ? last.slice(0, bang) : last;
    valueToken = bang > -1 ? last.slice(bang + 1) : "";
  }
  const elementParts = segs.slice(0, -1).map((s) => resolve(dict, s));
  elementParts.push(resolve(dict, finalElementSeg));
  return { element: elementParts.join("."), setValue: resolve(dict, valueToken) };
}

/** Map a raw expected-value token to the runner's ExpectedReturn. */
function resolveExpectedReturn(dict: Map<string, string>, rawToken: string): ExpectedReturn {
  if (rawToken === "less255") {
    return { match: "nonEmptyMax255" };
  }
  if (rawToken === "" || rawToken === "emptyCS") {
    return "";
  }
  return resolve(dict, rawToken);
}

/** A decoded step plus the raw expected token (kept for launch-seed detection). */
interface DecodedStep {
  step: Step;
  rawExpectedToken: string;
}

type CommandOutcome = DecodedStep | { skip: string };

function decodeCommand(dict: Map<string, string>, rawValue: string): CommandOutcome {
  const parts = rawValue.split("->");
  const method = METHOD_BY_TOKEN[parts[0]!];
  if (method === undefined) {
    return { skip: `unknown method token "${parts[0]}"` };
  }
  if (method === "compareObjIds") {
    return { skip: "compareObjIds (not an RTE data-model call)" };
  }

  const errorCode = parts[parts.length - 1] ?? "";
  const middle = parts.slice(2, parts.length - 1);
  const rawExpectedToken = middle.length > 0 ? middle[middle.length - 1]! : "";
  const expectedReturn = resolveExpectedReturn(dict, rawExpectedToken);

  switch (method) {
    case "GetLastError":
      return { step: { method, expectedReturn, expectedErrorCode: errorCode }, rawExpectedToken };

    case "GetErrorString":
    case "GetDiagnostic":
      return {
        step: { method, value: parts[1] ?? "", expectedReturn, expectedErrorCode: errorCode },
        rawExpectedToken,
      };

    case "Initialize":
    case "Commit":
    case "Terminate": {
      const param = resolveElement(dict, parts[1] ?? "");
      const step: Step = { method, expectedReturn, expectedErrorCode: errorCode };
      if (param !== "") {
        step.value = param;
      }
      return { step, rawExpectedToken };
    }

    case "GetValue": {
      const element = resolveElement(dict, parts[1] ?? "");
      if (element.startsWith("adl.nav")) {
        return { skip: `adl.nav sequencing GET (${element})` };
      }
      if (element.includes("&")) {
        return { skip: `objective-by-id addressing (${element}) — &id& is not a SCORM index` };
      }
      return {
        step: { method, element, expectedReturn, expectedErrorCode: errorCode },
        rawExpectedToken,
      };
    }

    case "SetValue": {
      const { element, setValue } = parseSetParams(dict, parts[1] ?? "");
      if (element.startsWith("adl.nav")) {
        return { skip: `adl.nav sequencing SET (${element})` };
      }
      if (element.includes("&")) {
        return { skip: `objective-by-id addressing (${element}) — &id& is not a SCORM index` };
      }
      return {
        step: { method, element, value: setValue, expectedReturn, expectedErrorCode: errorCode },
        rawExpectedToken,
      };
    }
  }
}

/** Set a value at a dotted CMI path, creating nested objects/arrays as needed. */
function setNested(root: Record<string, unknown>, path: string, value: string): void {
  const parts = path.split(".");
  let cursor: Record<string, unknown> | unknown[] = root;
  for (let i = 0; i < parts.length; i++) {
    const key = parts[i]!;
    const isLast = i === parts.length - 1;
    const nextIsIndex = !isLast && /^\d+$/.test(parts[i + 1]!);
    if (isLast) {
      assignChild(cursor, key, value);
    } else {
      const existing = readChild(cursor, key);
      if (existing === undefined) {
        const created: Record<string, unknown> | unknown[] = nextIsIndex ? [] : {};
        assignChild(cursor, key, created);
        cursor = created;
      } else {
        cursor = existing as Record<string, unknown> | unknown[];
      }
    }
  }
}

function readChild(cursor: Record<string, unknown> | unknown[], key: string): unknown {
  return Array.isArray(cursor) ? cursor[Number(key)] : cursor[key];
}

function assignChild(
  cursor: Record<string, unknown> | unknown[],
  key: string,
  value: unknown,
): void {
  if (Array.isArray(cursor)) {
    cursor[Number(key)] = value;
  } else {
    cursor[key] = value;
  }
}

/**
 * Decode one ADL `.properties` case into a Fixture.
 *
 * Each `Act{N}V{V}` attempt becomes one activity (a fresh API in the runner).
 * A GET that expects a concrete, non-empty value with error code 0 for an element
 * NOT produced by an earlier SET in the same activity is treated as launch-provided
 * (manifest data, or state the LMS persisted from a prior attempt) and seeded into
 * that activity's `initialState`, mirroring how the LMS would supply it at launch.
 */
export function decodeCase(
  dict: Map<string, string>,
  propsText: string,
  caseId: string,
): DecodeResult {
  const props = parseProperties(propsText);
  const skipped: SkippedStep[] = [];

  // Group command keys (Act{N}V{V}.commands.{i}) by activity, ordered by index.
  const byActivity = new Map<string, { index: number; raw: string }[]>();
  const keyRe = /^(Act\d+[a-z]?V\d+)\.commands\.(\d+)$/;
  for (const [key, value] of props) {
    const m = key.match(keyRe);
    if (!m) {
      continue;
    }
    const activityId = m[1]!;
    const list = byActivity.get(activityId) ?? [];
    list.push({ index: Number(m[2]), raw: value });
    byActivity.set(activityId, list);
  }

  const activities: Activity[] = [];
  for (const [activityId, commands] of orderedActivities(byActivity)) {
    commands.sort((a, b) => a.index - b.index);

    const decoded: { step: Step; rawExpectedToken: string; command: string }[] = [];
    for (const { index, raw } of commands) {
      const outcome = decodeCommand(dict, raw);
      const command = `commands.${index}=${raw}`;
      if ("skip" in outcome) {
        skipped.push({ activityId, command, reason: outcome.skip });
        continue;
      }
      decoded.push({ ...outcome, command });
    }

    const { steps, initialState } = resolveActivity(dict, caseId, activityId, decoded, skipped);
    if (steps.length === 0) {
      continue; // wholly sequencing/nav activity
    }
    const activity: Activity = { id: activityId, steps };
    if (initialState) {
      activity.initialState = initialState;
    }
    activities.push(activity);
  }

  const fixture: Fixture = {
    id: caseId,
    scormVersion: "2004",
    source: `Auto-decoded from ADL TestSuite/LMSRTE/Courses/TestCases/${caseId}.properties via decoder.ts (Layer-1 RTE commands only; sequencing/nav steps dropped).`,
    activities,
  };
  return { fixture, skipped };
}

/** completion/success status are derived by the API, so cannot be launch-seeded directly. */
const EVALUATED_STATUS = new Set(["cmi.completion_status", "cmi.success_status"]);

/**
 * Walk an activity's decoded steps to (a) seed launch-provided GET values, (b) drop
 * launch GETs of dynamically-evaluated status (not directly seedable), and
 * (c) annotate the confirmed VALUE_NOT_INITIALIZED (403) divergence. Returns the
 * final step list and optional initialState.
 */
function resolveActivity(
  dict: Map<string, string>,
  caseId: string,
  activityId: string,
  decoded: { step: Step; rawExpectedToken: string; command: string }[],
  skipped: SkippedStep[],
): { steps: Step[]; initialState?: Record<string, unknown> } {
  const setElements = new Set<string>();
  const root: Record<string, unknown> = {};
  let seededAny = false;
  const steps: Step[] = [];

  for (const { step, rawExpectedToken, command } of decoded) {
    if (step.method === "SetValue" && step.expectedErrorCode === "0" && step.element) {
      setElements.add(step.element);
    } else if (step.method === "GetValue" && step.element) {
      const launchProvided =
        step.expectedErrorCode === "0" &&
        !step.element.startsWith("adl.") &&
        !setElements.has(step.element) &&
        !/\.(_count|_children|_version)$/.test(step.element) &&
        rawExpectedToken !== "" &&
        rawExpectedToken !== "emptyCS";

      if (launchProvided && EVALUATED_STATUS.has(step.element)) {
        skipped.push({
          activityId,
          command,
          reason: `launch-provided ${step.element} is derived by the API from persisted progress_measure/score; not directly seedable`,
        });
        continue; // drop this step
      }
      if (launchProvided) {
        setNested(root, step.element, resolve(dict, rawExpectedToken));
        seededAny = true;
      }
      annotateKnownDivergence(step, caseId);
    }
    steps.push(step);
  }

  return seededAny ? { steps, initialState: root } : { steps };
}

/**
 * Attach a knownDivergence for confirmed scorm-again deviations so the suite stays
 * green while pinning current behaviour (and fails loudly if it changes).
 */
function annotateKnownDivergence(step: Step, caseId: string): void {
  if (step.method === "GetValue" && step.expectedErrorCode === "403") {
    // Confirmed: a successful GetValue of an uninitialized rw element returns ""/0
    // instead of error 403 (value not initialized).
    step.knownDivergence = {
      actualReturn: "",
      actualErrorCode: "0",
      finding:
        'GetValue of an uninitialized data-model element returns ""/0 instead of error 403 (value not initialized).',
      reference: `ADL ${caseId} ${step.element}; SCORM 2004 RTE / IEEE 1484.11.2 error 403 VALUE_NOT_INITIALIZED`,
    };
  }
}

/** Activities in first-appearance order (Map preserves insertion order). */
function orderedActivities(
  byActivity: Map<string, { index: number; raw: string }[]>,
): [string, { index: number; raw: string }[]][] {
  return [...byActivity.entries()];
}
