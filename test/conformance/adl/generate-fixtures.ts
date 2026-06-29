/**
 * Generate ADL Layer-1 conformance fixtures from the ADL test suite.
 *
 * Reads `Commands.properties` + the targeted `*.properties` cases, runs them through
 * decoder.ts, and writes one fixture per case to ./fixtures/generated/*.json. Also
 * prints a skip log (cases and steps that were dropped, with reasons) and runs a
 * self-check: re-decode the cases that were hand-authored (API, CM-01) and compare
 * the decoded step tuples against the committed hand-authored fixtures.
 *
 * Usage (not part of `npm test` — it regenerates committed fixtures on demand):
 *   npx tsx test/conformance/adl/generate-fixtures.ts [--adl <suiteRoot>]
 *
 * This is the ONLY file here that touches the filesystem / the external ADL suite.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { decodeCase, parseProperties } from "./decoder";
import type { Fixture, Step } from "./runner";

const DEFAULT_ADL_ROOT = "/Users/putneyj/git/SCORM-2004-4ed-Test-Suite/software_development";

function adlRoot(): string {
  const i = process.argv.indexOf("--adl");
  return i > -1 && process.argv[i + 1] ? process.argv[i + 1]! : DEFAULT_ADL_ROOT;
}

const HERE = dirname(fileURLToPath(import.meta.url));
const GENERATED_DIR = join(HERE, "fixtures", "generated");

/**
 * Which cases to decode. Layer-1, self-contained data-model cases only:
 *  - API: pure RTE + error codes
 *  - CM-*: completion/exit round-trips (+ launch-provided GETs, seeded)
 *  - DMB: the data-model element-binding matrix (entry/total_time/suspend/exit/...)
 * Skipped on purpose (logged below): DDM (multi-line XML adl.data buckets) and
 * DMI (8k+ generated steps) — deferred to a follow-up increment.
 */
function targetCases(testCasesDir: string): string[] {
  const all = readdirSync(testCasesDir).filter((f) => f.endsWith(".properties"));
  const ids = all.map((f) => f.replace(/\.properties$/, ""));
  return ids.filter((id) => id === "API" || id === "DMB" || /^CM-/.test(id)).sort();
}

function stepTuple(s: Step): string {
  const ret =
    s.expectedReturn === undefined
      ? "—"
      : typeof s.expectedReturn === "string"
        ? JSON.stringify(s.expectedReturn)
        : `match:${s.expectedReturn.match}`;
  return [s.method, s.element ?? "", s.value ?? "", ret, s.expectedErrorCode].join(" | ");
}

/** Compare decoded steps against a hand-authored fixture; return mismatch lines. */
function selfCheck(decoded: Fixture, hand: Fixture): string[] {
  const issues: string[] = [];
  const byId = new Map(hand.activities.map((a) => [a.id, a]));
  for (const act of decoded.activities) {
    const handAct = byId.get(act.id);
    if (!handAct) {
      issues.push(`activity ${act.id}: present in decoded, absent in hand-authored`);
      continue;
    }
    const n = Math.max(act.steps.length, handAct.steps.length);
    for (let i = 0; i < n; i++) {
      const d = act.steps[i];
      const h = handAct.steps[i];
      const dt = d ? stepTuple(d) : "(none)";
      const ht = h ? stepTuple(h) : "(none)";
      if (dt !== ht) {
        issues.push(`${act.id} step ${i}:\n      decoded: ${dt}\n      hand:    ${ht}`);
      }
    }
  }
  return issues;
}

function main(): void {
  const root = adlRoot();
  const testCasesDir = join(root, "TestSuite", "LMSRTE", "Courses", "TestCases");
  const commandsPath = join(
    root,
    "resources",
    "org",
    "adl",
    "testsuite",
    "rte",
    "lms",
    "util",
    "resources",
    "Commands.properties",
  );
  const dict = parseProperties(readFileSync(commandsPath, "utf-8"));

  rmSync(GENERATED_DIR, { recursive: true, force: true });
  mkdirSync(GENERATED_DIR, { recursive: true });

  const ids = targetCases(testCasesDir);
  let totalSteps = 0;
  let totalSkipped = 0;
  const emptyCases: string[] = [];
  const skipReasonCounts = new Map<string, number>();

  console.log(`# ADL Layer-1 fixture generation (${ids.length} target cases)\n`);

  for (const id of ids) {
    const text = readFileSync(join(testCasesDir, `${id}.properties`), "utf-8");
    const { fixture, skipped } = decodeCase(dict, text, id);
    // Namespace generated ids so they are distinct from the hand-authored gold
    // fixtures (e.g. generated "adl-API" vs hand-authored "API").
    fixture.id = `adl-${id}`;
    const steps = fixture.activities.reduce((n, a) => n + a.steps.length, 0);
    totalSteps += steps;
    totalSkipped += skipped.length;
    for (const s of skipped) {
      const category = s.reason.replace(/\(.*?\)/g, "(…)").replace(/ — .*/, "");
      skipReasonCounts.set(category, (skipReasonCounts.get(category) ?? 0) + 1);
    }

    if (fixture.activities.length === 0) {
      emptyCases.push(id);
      console.log(`- ${id}: 0 runnable steps (all sequencing/nav) — not emitted`);
      continue;
    }

    writeFileSync(
      join(GENERATED_DIR, `${id}.json`),
      JSON.stringify(fixture, null, 2) + "\n",
      "utf-8",
    );
    console.log(
      `- ${id}: ${fixture.activities.length} activities, ${steps} steps` +
        (skipped.length ? `, ${skipped.length} nav/other steps dropped` : ""),
    );
  }

  console.log(
    `\n# Totals: ${ids.length - emptyCases.length} fixtures, ${totalSteps} steps, ` +
      `${totalSkipped} steps dropped, ${emptyCases.length} empty cases skipped.`,
  );

  console.log(`\n# Dropped steps by reason`);
  [...skipReasonCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .forEach(([reason, n]) => console.log(`  ${n}x  ${reason}`));

  // Self-check against the hand-authored gold fixtures.
  console.log(`\n# Self-check (decoded vs hand-authored)`);
  const checks: { decodedId: string; handFile: string }[] = [
    { decodedId: "API", handFile: "api.json" },
  ];
  let mismatches = 0;
  for (const { decodedId, handFile } of checks) {
    const text = readFileSync(join(testCasesDir, `${decodedId}.properties`), "utf-8");
    const decoded = decodeCase(dict, text, decodedId).fixture;
    const hand = JSON.parse(readFileSync(join(HERE, "fixtures", handFile), "utf-8")) as Fixture;
    const issues = selfCheck(decoded, hand);
    if (issues.length === 0) {
      console.log(
        `- ${decodedId} vs ${handFile}: MATCH (${decoded.activities.reduce((n, a) => n + a.steps.length, 0)} steps)`,
      );
    } else {
      mismatches += issues.length;
      console.log(`- ${decodedId} vs ${handFile}: ${issues.length} MISMATCH`);
      for (const issue of issues) {
        console.log(`    * ${issue}`);
      }
    }
  }
  console.log(mismatches === 0 ? "\nSelf-check: PASS" : `\nSelf-check: ${mismatches} mismatches`);
}

main();
