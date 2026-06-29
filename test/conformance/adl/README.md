# ADL RTE Layer-1 conformance fixtures

A small, fixture-driven harness that replays **ADL SCORM Run-Time Environment
(RTE) data-model** test cases against scorm-again and asserts the API return
value + `GetLastError` code after every step.

This is **Layer 1 only**: the RTE data model (Initialize/Terminate/Commit,
GetValue/SetValue, error codes). It deliberately does **not** cover Layer 2
(sequencing & navigation). It is additive and self-contained — it imports only
the public scorm-again API and shares nothing with the rest of `test/**`.

## Layout

```
test/conformance/adl/
  adl-conformance.spec.ts   # discovers fixtures, runs each through the runner
  runner.ts                 # builds the API, seeds state, replays steps, asserts
  decoder.ts                # TS port of the ADL LMSParser; .properties -> Fixture
  generate-fixtures.ts      # CLI: decode the ADL suite -> fixtures/generated/*.json
  fixtures/*.json           # hand-authored "gold" cases
  fixtures/generated/*.json # auto-decoded corpus (do not hand-edit; regenerated)
  README.md
```

Run just this suite:

```bash
npx vitest run test/conformance/adl
```

It is also picked up by the normal `npm test` (vitest `include: test/**/*.spec.ts`).

Regenerate the auto-decoded corpus from the ADL suite (not part of `npm test`):

```bash
npx tsx test/conformance/adl/generate-fixtures.ts [--adl <suiteRoot>]
```

This prints a per-case summary, a grouped "dropped steps by reason" log, and a
self-check that re-decodes `API.properties` and diffs the decoded steps against
the hand-authored `fixtures/api.json` (must report `Self-check: PASS`).

## Fixture schema

```jsonc
{
  "id": "API",                       // unique; shown in failure messages
  "scormVersion": "2004",            // "1.2" | "2004" -> picks Scorm12API / Scorm2004API
  "source": "ADL ... provenance",    // which .properties case + keys this came from
  "initialState": { "cmi": { ... } }, // optional: launch state seeded for every activity
  "activities": [
    {
      "id": "Act3V1",                // matches the ADL Act{N}V{V} attempt
      "initialState": { ... },       // optional: overrides fixture-level initialState
      "steps": [
        { "method": "Initialize", "expectedReturn": "true", "expectedErrorCode": "0" },
        { "method": "SetValue", "element": "cmi.location", "value": "p2",
          "expectedReturn": "true", "expectedErrorCode": "0" },
        { "method": "GetValue", "element": "cmi.location",
          "expectedReturn": "p2", "expectedErrorCode": "0" },
        { "method": "GetErrorString", "value": "0",
          "expectedReturn": { "match": "nonEmptyMax255" }, "expectedErrorCode": "0" }
      ]
    }
  ]
}
```

- **One fresh API per activity.** Each `Act{N}V{V}` in an ADL case is a separate
  SCO launch, so the runner builds a new API per activity and replays its steps
  in order.
- **`method`** is one of `Initialize | Terminate | Commit | GetValue | SetValue |
  GetLastError | GetErrorString | GetDiagnostic`.
- **`value`** is the single string argument: the value for `SetValue`, the
  parameter for `Initialize`/`Terminate`/`Commit` (must be `""` to succeed), or
  the error code to look up for `GetErrorString`/`GetDiagnostic`.
- **`expectedReturn`** is an exact string match (including `""` for the ADL
  `emptyCS` marker). Omit it to skip the return check. For implementation-defined
  strings (the ADL `less255` marker on `GetErrorString`/`GetDiagnostic`) use
  `{ "match": "nonEmptyMax255" }` — a non-empty string ≤ 255 chars — since the
  wording is not fixed by the spec.
- **`expectedErrorCode`** is the numeric `GetLastError` string expected
  immediately after the step. `GetLastError`/`GetErrorString`/`GetDiagnostic` do
  not mutate the error state, so the runner can read it back safely.
- **`initialState`** seeds launch-provided values (manifest data an LMS would set
  before launch, e.g. `cmi.max_time_allowed`, `cmi.scaled_passing_score`,
  `cmi.learner_id`) via `loadFromJSON` before `Initialize`. Use the
  `{ "cmi": { ... } }` shape. This is the mechanism for porting launch-dependent
  ADL GET cases.
- **`knownDivergence`** (optional, per step) records a confirmed scorm-again
  divergence from the ADL/spec expectation. `expectedReturn`/`expectedErrorCode`
  stay ADL-faithful; the runner instead pins scorm-again's current
  (`actualReturn`/`actualErrorCode`) so the suite stays green **and** a future fix
  fails loudly, prompting the annotation's removal. The auto-decoder attaches one
  to every uninitialized-element GET (the 403 finding below); for generated
  fixtures it is applied by `decoder.ts`, not hand-edited.

## Fixtures & provenance

### Hand-authored gold cases (`fixtures/*.json`)

| Fixture | SCORM | Ported from | What it proves |
|---|---|---|---|
| `api.json` | 2004 | `API.properties` (Act2V1, Act3V1), verbatim | Pre-init state errors (122/132/142), argument error (201), already-initialized (103), empty-element get/set failures (301/351), `GetErrorString`/`GetDiagnostic` for known/unknown codes, location round-trip. Fully self-contained. Also the decoder's self-check target. |
| `cm-01-launch-seeded.json` | 2004 | `CM-01.properties` — curated GET subset | Seeding launch-provided `cmi.max_time_allowed` / `cmi.scaled_passing_score` via per-activity `initialState`, then reading them back. A curated subset (not a 1:1 decode). |
| `cm-data-model-errors.json` | 2004 | Hand-authored from the 2004 RTE element bindings (cf. `DMB.properties`) | Read-only write (404), vocabulary/type-mismatch (406), out-of-range (407), then a valid set/get. |
| `scorm12-roundtrip.json` | 1.2 | Pattern-derived (the ADL 4th Ed suite has no 1.2 cases) | SCORM 1.2 core element round-trip plus read-only (403) and type-mismatch (405) write failures. |

### Auto-decoded corpus (`fixtures/generated/*.json`)

`decoder.ts` is a TypeScript port of the Layer-1 decoding in the ADL suite's
`LMSParser.java`. `generate-fixtures.ts` runs it over the self-contained
data-model cases (`API`, all `CM-*`, `DMB`) and writes one `adl-<case>.json`
fixture each (currently **34 fixtures, 555 steps**). These are machine-generated —
regenerate with the command above, do not hand-edit.

The decoder was validated before use: re-decoding `API.properties` reproduces the
hand-authored `api.json` step-for-step (the generator's `Self-check: PASS`).

### How ADL commands decode

ADL cases live in `…/TestSuite/LMSRTE/Courses/TestCases/*.properties` as
`Act{N}V{V}.commands.{i}` keys. Each command is `METHOD->arg->expectedReturn->expectedErrorCode`,
with abbreviations resolved through
`…/resources/org/adl/testsuite/rte/lms/util/resources/Commands.properties`
(`I`=Initialize, `T`=Terminate, `C`=Commit, `GET`=GetValue, `SET`=SetValue,
`GLE`=GetLastError, `GES`=GetErrorString, `GeDi`=GetDiagnostic; `c`=cmi,
`a`=adl, `LOC`=location, `MAXTA`=max_time_allowed, `SPS`=scaled_passing_score,
`X`=exit, `t`=true, `f`=false, `less255`/`emptyCS` are value markers). `~` joins
element segments (`c~MAXTA` → `cmi.max_time_allowed`); in `SET`, `!` separates the
trailing element segment from its value (`c~LOC!test` →
`SetValue("cmi.location","test")`). Unknown tokens resolve to themselves (so numeric
array indices and literal values pass through), mirroring `Resources.getString`.
The authoritative grammar is `…/src/org/adl/testsuite/rte/lms/util/LMSParser.java`.

**Dropped during decoding** (logged, grouped, by `generate-fixtures.ts`): the
sequencing/nav layer (`adl.nav.request` GET/SET, ~120 steps), `compareObjIds`
(`COI`), `&id&` objective-by-id addressing (not a SCORM index), and launch-provided
GETs of `cmi.completion_status` / `cmi.success_status` (derived by the API from
persisted progress_measure/score — not faithfully seedable). Whole cases skipped:
`DDM` (multi-line XML `adl.data` buckets) and `DMI` (8k+ generated steps) — both
deferred to a follow-up increment.

## Conformance findings

**1. `GetValue` did not reset a stale error code on success (SCORM 2004) — FIXED.**
ADL `API.properties` Act3V1 step 19 (`GET->c~LOC->test->0`) requires the current
error code to be `0` after a successful `GetValue`, even though the prior step
(`GetValue("")`) left `301`. scorm-again returned the correct value (`"test"`) but
left the error code at `301`. Root cause: `CMIValueAccessService.setCMIValue`
calls `setLastErrorCode("0")` on entry, so a successful `SetValue` clears the
prior error, but `getCMIValue` had no equivalent reset. Per SCORM 2004 RTE /
IEEE 1484.11.2, every successful `GetValue` must set the current error code to 0.
**Fixed** in `src/services/CMIValueAccessService.ts` (`getCMIValue` now calls
`setLastErrorCode("0")` after the empty-element / `_version` guards, before
resolving the element, so failures below still set their own code). The
`knownDivergence` annotation on step 19 has been removed; the fixture now asserts
error code `0` and passes for the right reason (SCORM 1.2 GetValue shares the same
path and behaves correctly too).

**2. `GetValue` of an uninitialized element returned `""`/0 instead of error 403
(SCORM 2004) — FIXED.** Surfaced by the auto-decoded `DMB` case: e.g.
`GET->c~SD->->403` (get `cmi.suspend_data` before any set) and the equivalent for
`cmi.scaled_passing_score`. ADL / SCORM 2004 RTE / IEEE 1484.11.2 expect error
`403` (value not initialized) for an implemented, writable element with no
spec-defined default that is read before being set; scorm-again returned `""`
with error `0`. The authoritative ADL scope is broad — besides those two,
`cmi.location`, `cmi.max_time_allowed`, `cmi.completion_threshold`,
`cmi.progress_measure`, `cmi.score.{scaled,raw,min,max}`, and every
`objectives.N.{score.*,progress_measure,description}` /
`interactions.N.{weighting,type,timestamp,result,latency,learner_response,description}`
/ `comments_from_learner.N.timestamp`.

A first prototype that threw `VALUE_NOT_INITIALIZED` from the raw getters broke
**110 existing tests across 15 files** — those getters are also read by
serialization/commit/rollup, and much of the suite relies on read-before-set
returning `""`. **Fixed** by gating 403 at the public `GetValue` boundary only
(never the getters): `Scorm2004API.checkUninitializedGet` (invoked from
`BaseAPI.getValue` after an otherwise-successful resolution) raises 403 when the
resolved value is `""`, the element was never written, and it appears in a
`NO_DEFAULT_2004_ELEMENTS` table (array indices normalized to `N`). "Never
written" reuses a new `BaseAPI._setCMIElements` set populated on every successful
`SetValue`, `loadFromJSON`, and global-objective restore (all route through
`_commonSetCMIValue`), so an explicit `SetValue(x, "")` still reads back as
`""`/0; any non-empty value — including one written by internal
sequencing/activity-tree paths that bypass `_commonSetCMIValue` — is already
initialized and never trips the gate. SCORM 1.2 / AICC inherit the no-op
`BaseAPI.checkUninitializedGet` and are unchanged. The `knownDivergence`
annotations (6 steps across `DMB`) have been removed; those steps now assert the
spec-faithful `403`. The full unit suite stays green — nothing in it codified
read-before-set returning `""` for a no-default element.

Deliberate boundaries of the gate (verified, not bugs):
- **Array `.id` is intentionally excluded** from `NO_DEFAULT_2004_ELEMENTS`
  (`objectives.N.id`, `interactions.N.id`, `interactions.N.objectives.N.id`).
  Reading a *missing* array entry already yields 403 during traversal; a
  materialized-but-id-empty row is a separate concern. Reading an unset `.id`
  therefore still returns `""`/0 (conservative under-coverage, never a false 403).
- **An LMS that seeds an explicit empty string** for a no-default element via
  `loadFromJSON` (e.g. `{cmi:{suspend_data:""}}`) will read it back as 403, not
  `""`/0. `SerializationService.loadFromJSON` drops falsy leaves by design — it
  must, because the full-commit serializer emits `""` for unset numeric fields
  (`score.min` etc.) and the validators reject `""` on reload, so loading empties
  would break commit→reload round-trips. Across a commit boundary an explicit
  empty and "never set" are already indistinguishable (both serialize to `""`),
  so 403 is the spec-correct answer for the common "never set" case. The
  unambiguous within-session case (`SetValue(x, "")` then `GetValue(x)`) is
  handled correctly via `_setCMIElements`.

**3. `cmi.*._count` returned a number, not a SCORM string (SCORM 2004) — FIXED.**
`api.lmsGetValue("cmi.objectives._count")` returned the number `0`, but
IEEE 1484.11.2 `GetValue` must return a characterstring (`"0"`). **Fixed** in
`src/BaseAPI.ts` (`getValue` now coerces numeric/boolean data-model values to a
string at the public return path, leaving the `_count` getter — and its internal
numeric consumers — untouched). The decoder no longer special-cases `._count` GETs;
they assert the real string return. (11 `_count` assertions across 5 existing tests
that asserted the numeric return were updated to expect the string.)

## Adding more cases / scaling

The auto-decoder now drives coverage; two ways to grow it:

1. **Widen the auto-decoder.** Add case ids to `targetCases()` in
   `generate-fixtures.ts` and regenerate. The next tranches are `DDM` (needs
   multi-line `.properties` values + `adl.data` bucket-id addressing) and `DMI`
   (8k+ generated SET/GET validations — the richest source of new findings, but
   large enough to warrant its own pass). Both are out of scope here and logged as
   skipped. If scorm-again diverges from an ADL expectation, **do not bend the
   fixture** — extend `annotateKnownDivergence()` in `decoder.ts` with the verified
   actual behaviour and add a finding above.

2. **Hand-author** a focused gold fixture in `fixtures/*.json` for a behaviour the
   decoder can't yet express (e.g. SCORM 1.2, or a curated launch-seeded slice).

When adding launch-dependent GETs, prefer `initialState` seeding (the decoder does
this automatically for concrete values) over expecting scorm-again to invent
manifest data.
