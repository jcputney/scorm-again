# SCORM 1.2 RTE conformance — fixture coverage plan

Status: **plan / not yet implemented.** This is the work-list for growing the
`test/conformance/adl` harness to cover the SCORM 1.2 Run-Time Environment, the
same way the 2004 fixtures cover 2004.

## Why this is "Path A grounded by ADL", not a decoder port

The 2004 fixtures are machine-decoded from ADL's `SCORM-2004-4ed-Test-Suite`,
whose RTE cases are externalized as `*.properties` files (`decoder.ts` ports its
`LMSParser.java`). **The SCORM 1.2 CTS has no such format.** ADL's 1.2.7 "Self
Test" drives its RTE test from an applet + a single `SCOWrapper.htm`; the
expected return / error-code logic lives in **compiled Java**, not a parseable
grammar. So there is nothing for `decoder.ts` to consume.

What we *do* have is ADL's actual data-model validators, recovered by decompiling
the suite's `testsuite.jar` (`org.adl.datamodels.*`). Those classes are the
authoritative oracle for every binding, vocabulary, range, and error code below.
This plan therefore is: **hand-author 1.2 gold fixtures into the existing
version-agnostic runner, with every expected value cross-checked against the
decompiled ADL validator — not against scorm-again's own reading of the spec.**
That closes the author-bias gap (the same gap that let two 2004 bugs survive the
unit suite until the independently-authored ADL fixtures caught them).

### Provenance of the oracle

- Source jar: ADL SCORM 1.2 CTS 1.2.7 `testsuite.jar` (gpilearn mirror; SHA-256
  `06c1495b…`). Full distribution also archived (`SCORM1_2_TestSuite1_2_7ST.zip`,
  Wayback). **Vendor both before relying on them — adlnet.gov is dead and the
  mirrors are link-rot-prone.**
- Decompiled with fernflower; the classes that matter:
  - `org/adl/datamodels/cmi/CMICore.java` — core element bindings
  - `org/adl/datamodels/cmi/CMIScore.java` — score.{raw,min,max}
  - `org/adl/datamodels/DataModelValidator.java` — every `check*` validator + the vocabularies
  - `org/adl/datamodels/cmi/CMICategory.java` — the SetValue/GetValue → error-code mapping
  - `org/adl/datamodels/Element.java` — the `(default, validator, vocab, writeable, readable, mandatory)` element shape
  - `org/adl/datamodels/cmi/CMIInteractionData.java` / `CMIObjectiveData.java` — interactions & objectives sub-elements (source for the per-type tranche below)

## ADL's SCORM 1.2 error-code model (the spine)

From `CMICategory.doSet` (SetValue) and `determineElementValue` (GetValue). This
is the full set of codes the 1.2 CTS emits — note there is **no 407**:

| Condition | Code | ADL source |
|---|---|---|
| SetValue ok / GetValue ok | `0` | `doSet` success branch |
| Not implemented **and** mandatory | `401` | `doSet` (isImplemented false, isMandatory true) |
| Element read-only (writeable=false) on SetValue | `403` | `doSet` |
| Element write-only (readable=false) on GetValue | `404` | `determineElementValue` |
| Writeable, but value fails its `check*` validator | `405` | `doSet` validateType-false branch |
| `lesson_status` set to `"not attempted"` | `405` | `CMICore.performSet` special-case |
| Invalid leaf element inside a valid category (`getField` miss) | `201` | `doSet` / `determineElementValue` NoSuchField |
| `_count` requested on a non-array element | `203` | `determineElementValue` |
| Invalid category (`cmi.bogus.*`) | `401` | category `recNotImplementedError` |
| GetValue/SetValue before `LMSInitialize` | `301` | API layer (not datamodel) |

> **Key divergence to probe:** scorm-again's `error_codes.ts` defines
> `VALUE_OUT_OF_RANGE: 407` for SCORM 1.2, but 407 is **not a SCORM 1.2 code** and
> the ADL CTS returns **405** for an out-of-range score. See probe P1.

## Element binding table (cmi.core + score), from ADL

`W`=writeable, `R`=readable. Validator names link to the rules table below.

| Element | Validator | W | R | SetValue bad-type → | Read-only SetValue → | Write-only GetValue → |
|---|---|---|---|---|---|---|
| `cmi.core.student_id` | checkIdentifier | ✗ | ✓ | — | **403** | — |
| `cmi.core.student_name` | checkString255 | ✗ | ✓ | — | **403** | — |
| `cmi.core.lesson_location` | checkString255 | ✓ | ✓ | 405 | — | — |
| `cmi.core.credit` | checkVocabulary(Credit) | ✗ | ✓ | — | **403** | — |
| `cmi.core.lesson_status` | checkVocabulary(Status) | ✓ | ✓ | 405 (+ "not attempted"→405) | — | — |
| `cmi.core.entry` | checkVocabulary(Entry) | ✗ | ✓ | — | **403** | — |
| `cmi.core.total_time` | checkTimespan | ✗ | ✓ | — | **403** | — |
| `cmi.core.lesson_mode` | checkVocabulary(Mode) | ✗ | ✓ | — | **403** | — |
| `cmi.core.exit` | checkVocabulary(Exit) | ✓ | ✗ | 405 | — | **404** |
| `cmi.core.session_time` | checkTimespan | ✓ | ✗ | 405 | — | **404** |
| `cmi.core.score.raw` | checkScoreDecimal | ✓ | ✓ | 405 | — | — |
| `cmi.core.score.min` | checkScoreDecimal | ✓ | ✓ | 405 | — | — |
| `cmi.core.score.max` | checkScoreDecimal | ✓ | ✓ | 405 | — | — |

`cmi.core._children` = `student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time`
`cmi.core.score._children` = `raw,min,max`

## Validator rules table (exact ADL bounds — `DataModelValidator.java`)

The non-obvious bounds are where hand-authoring from memory goes wrong:

| Validator | Rule | Gotchas to encode as fixtures |
|---|---|---|
| `checkString255` | length ≤ 255 | 256 chars → 405; exactly 255 → ok |
| `checkString4096` | length ≤ 4096 | suspend_data / comments boundary |
| `checkScoreDecimal` | blank **OR** Double in **[0, 100]** | `""`→ok; `0`/`100`→ok; `150`/`-1`→405; `"abc"`→405 |
| `checkDecimal` | blank OR any Double | unbounded; used by interaction weighting/result-numeric |
| `checkVocabulary` | exact member of the named list; for `Result`, also any decimal | case-sensitive; `"Passed"`→405 |
| `checkIdentifier` | length ≤ 255, **no spaces**, non-blank | `"a b"`→405; `""`→405 |
| `checkInteger` | Integer in **[0, 65536]** | note 65536 (not 65535); `-1`→405 |
| `checkSInteger` | Integer in [-32768, 32768] | interaction numeric range |
| `checkTime` | `HH:MM:SS[.SS]`, HH∈[0,24], MM∈[0,60], 2-char seconds | lenient bounds (24/60 inclusive) |
| `checkTimespan` | `HHHH:MM:SS[.SS]`, HHHH∈[0,9999], MM∈[0,99] | blank→ok; used by session_time/total_time |

Vocabularies (verbatim from ADL):
- **Mode**: `normal, review, browse`
- **Status**: `passed, completed, failed, incomplete, browsed, not attempted` *(but SetValue "not attempted" → 405)*
- **Exit**: `"", time-out, suspend, logout`
- **Credit**: `credit, no-credit`
- **Entry**: `"", ab-initio, resume`
- **TimeLimitAction**: `"", exit,message, exit,no message, continue,message, continue,no message`
- **Interaction** (7 types): `true-false, choice, fill-in, matching, performance, likert, sequencing, numeric`
- **Result**: `correct, wrong, unanticipated, neutral` *(or any decimal)*

## The fixture checklist

Each item is one hand-authored `fixtures/scorm12-*.json` file (or activity)
against the existing runner (`scormVersion: "1.2"` → `Scorm12API`). The existing
`scorm12-roundtrip.json` already covers the **bold** subset — extend, don't
duplicate.

### Core data model
- [x] core round-trip: set/get `lesson_location`, `score.raw`, `lesson_status` *(exists)*
- [ ] every readable core element: launch-seed via `initialState`, GetValue back (`student_id`, `student_name`, `credit`, `entry`, `lesson_mode`, `total_time`)
- [ ] `_children` of `cmi.core` and `cmi.core.score` return the exact ADL strings
- [ ] blank-is-valid: `SetValue("cmi.core.score.raw","")` → `true`/`0`
- [ ] `score.min`/`score.max` round-trip

### Vocabularies (one valid + one invalid each → 405)
- [ ] `lesson_status`: `completed` ok; `Passed`/`done` → 405; **`not attempted` → 405**
- [ ] `exit` (write-only): `suspend` ok; GetValue `exit` → **404**
- [ ] `credit`/`entry`/`lesson_mode`: read-only, SetValue → **403**

### Numeric / range (the 405-not-407 tranche — see P1)
- [ ] `score.raw = "85"` ok; `= "150"` → **405**; `= "-1"` → **405**; `= "abc"` → **405**
- [ ] `score.raw = "100"` ok (boundary); `= "0"` ok

### Time formats
- [ ] `session_time = "00:30:00"` ok (write-only); GetValue → **404**
- [ ] `session_time` malformed (`"30 minutes"`, `"99:99:99"`) → **405**
- [ ] `total_time` is read-only → SetValue **403**

### Error-path coverage (every code provoked ≥ once)
- [ ] read-only **403**: `SetValue("cmi.core.student_id", …)` *(exists)*
- [ ] write-only **404**: `GetValue("cmi.core.exit")` / `GetValue("cmi.core.session_time")`
- [ ] type-mismatch **405**: `score.raw = "not-a-number"` *(exists)*
- [ ] invalid leaf **201**: `GetValue("cmi.core.bogus")`
- [ ] count-on-scalar **203**: `GetValue("cmi.core._count")`
- [ ] pre-init **301**: `GetValue`/`SetValue` before `Initialize`
- [ ] invalid category **401**: `SetValue("cmi.bogus.x", …)`

### Collections
- [ ] `cmi.objectives`: set `.0.id` (checkIdentifier — `"a b"` → 405), `.0.score.raw` (range), `.0.status` (Status vocab); `cmi.objectives._count` → `"1"` (string)
- [ ] `cmi.interactions`: `.0.id`, `.0.time` (checkTime), `.0.type` (Interaction vocab), `.0.weighting` (checkDecimal), `.0.result` (Result vocab-or-decimal), `.0.latency` (checkTime); `_count` → string
- [ ] **interactions correct_responses per type** — one fixture per ADL type using `CMIInteractionData.java` as the oracle: `true-false`, `choice`, `fill-in`, `matching`, `performance`, `likert`, `sequencing`, `numeric` (this is the richest source of new findings, mirroring 2004's DMI)
- [ ] `cmi.comments` (checkString4096) + `cmi.comments_from_lms` (read-only → 403)
- [ ] `cmi.student_data`: `mastery_score`/`max_time_allowed`/`time_limit_action` (read-only → 403; launch-seeded gets)
- [ ] `cmi.student_preference`: `audio` (checkSInteger), `language`, `speed`, `text` round-trip

## High-value divergence probes (do these first)

These are where ADL fidelity most likely catches a real scorm-again bug. Author
the fixture to the **ADL** expectation; if scorm-again differs, confirm against
spec and either fix the code or pin with `knownDivergence` (same protocol as the
2004 findings).

Probe outcomes (run 2026-06-29):

- **P1 — out-of-range score code. [FIXED]** `SetValue("cmi.core.score.raw","150")` returned **407** (not a valid 1.2 code); now **405**, matching ADL.
- **P2 — `lesson_status = "not attempted"`. [CONFORMANT]** scorm-again already returns **405**, independently matching ADL's special-case.
- **P3 — `_count` on a scalar. [CONFORMANT]** `GetValue("cmi.core._count")` → **203**.
- **P4 — invalid element. [FIXED]** `cmi.core.bogus` / `cmi.bogus.x` returned **101** (general exception); now **401** (not implemented). scorm-again maps all unknown elements to 401 and does not adopt ADL's 201-leaf/401-category split (documented residual divergence on the leaf).
- **P5 — blank clears, doesn't error. [FIXED]** `SetValue("cmi.core.score.raw","")` now returns **true/0** (was 405). Opt-in `allowEmptyString` on the SCORM 1.2 score only; SCORM 2004 unchanged.
- **P6 — identifier with space. [DELIBERATE — WON'T FIX]** `SetValue("cmi.objectives.0.id","obj 1")` is accepted (ADL rejects with 405). Intentionally tolerant of non-compliant identifiers to support real-world content shipping malformed ids; pinned as a known divergence, not a defect.

## Definition of done

1. Every **implemented** scorm-again 1.2 element (cross-checked against
   `src/cmi/scorm12/*.ts`) has ≥1 set/get round-trip fixture.
2. Each ADL 1.2 error code — `201, 203, 301, 401, 403, 404, 405` — is provoked by
   ≥1 fixture (402 if scorm-again implements the keyword-set path).
3. All 6 divergence probes resolved: code fixed to the ADL/spec expectation, or
   an explicit `knownDivergence` annotation + a finding noted in `README.md`.
4. All 7 interaction types have a `correct_responses` fixture derived from
   `CMIInteractionData.java`.
5. `npx vitest run test/conformance/adl` green; new fixtures self-contained
   (public API only), no shared state with the rest of `test/**`.

## Mechanics

- No new decoder. Add `fixtures/scorm12-*.json`; the existing `runner.ts` and
  `adl-conformance.spec.ts` discover them automatically.
- Keep each expected code traceable to a decompiled-validator citation in the
  fixture's `source` field (e.g. `"ADL CMICategory.doSet → 405; checkScoreDecimal range [0,100]"`).
- When in doubt, run the decompiled validator logic by hand against the value —
  it's the oracle, the spec prose is the tiebreaker.
