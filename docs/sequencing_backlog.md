# SCORM 2004 Sequencing Backlog & Worklog

This document tracks the outstanding feature work needed to close the gaps between
`scorm-again`'s current SCORM 2004 sequencing implementation and the behavioral
coverage described in ADL/IMS documentation and our internal guidelines.

It is intended to be self-sufficient: if progress pauses mid-stream, a future
engineer (or this agent) should be able to resume by reading only this file.

---

## Legend

- **Status** codes: `TODO`, `IN PROGRESS`, `DONE`, `BLOCKED`, `DEFERRED`
- **Priority**: 1 (highest) to 3 (lowest)
- **Refs**: pointers into source files, specs, or prior discussion for context

Each task records:

- Problem statement / spec gap
- Intended approach (kept up to date as work proceeds)
- Validation strategy (tests, manual checks)
- Current status notes / breadcrumbs

---

## Snapshot Summary (initial audit)

- Activity tree, sequencing processes, rollup, and state persistence exist.
- Public configuration surface (`SequencingSettings`, etc.) exposes only a
  subset of manifest-driven controls. Many sequencing behaviors can’t be
  toggled without patching internals.
- Objective collections and ADL extensions are acknowledged TODOs in code.
- Priority 1 gaps (choice validation, forward-only enforcement, etc.) remain.
- ADLnavigational UI hints (`adlnav:hideLMSUI`) and some limit conditions are
  absent.

---

## Task Backlog

| ID | Status | Priority | Title |
|----|--------|----------|-------|
| T1 | DONE | 1 | Expand sequencing configuration types to cover manifest controls |
| T2 | DONE | 1 | Wire per-activity limit conditions into configuration & evaluation |
| T3 | DONE | 1 | Implement objective collections (primary/additional) with mapInfo |
| T4 | DONE | 1 | Replace placeholder global objective map with real objective IDs |
| T5 | DONE | 1 | Resolve Priority 1 gaps in OverallSequencingProcess (choice/forward-only/etc.) |
| T6 | DONE | 2 | Support ADL constrained choice & rollup considerations |
| T7 | DONE | 2 | Surface randomization selection state via configuration & persistence |
| T8 | DONE | 2 | Honor `adlnav:hideLMSUI` by emitting UI directives |
| T9 | IN PROGRESS | 3 | Support sequencing collections (`ID` / `IDRef`) reuse |
| T10 | DONE | 3 | Add coverage for auxiliary resources metadata |

> **Note:** Some tasks may spawn sub-tasks; update the table accordingly.

---

## Detailed Task Notes

### T1 – Expand sequencing configuration types to cover manifest controls
- **Status:** DONE
- **Priority:** 1
- **Problem:** `SequencingControlsSettings` omits many manifest attributes
  (e.g., `choice`, `randomizationTiming`, `selectCount`, etc.), preventing LMS
  integrators from configuring behaviors that the engine already supports.
- **Scope:**
  - Extend `SequencingControlsSettings` (and related types) to include the
    missing booleans/enums.
  - Update `createActivity` / `configureSequencingControls` to apply them.
  - Ensure selection/randomization routines respect the new input.
- **Refs:**
  - `src/types/sequencing_types.ts`
  - `src/cmi/scorm2004/sequencing/sequencing_controls.ts`
  - `src/Scorm2004API.ts` (configure methods)
- **Validation:**
  - Unit tests ensuring configuration values propagate into `Activity`.
  - Sequencing process test verifying randomization/selection toggles.
- **Notes:** 2025-09-18 – Extended configuration types and API plumbing; added targeted vitest coverage (`SequencingConfiguration.spec.ts`).

### T2 – Wire per-activity limit conditions into configuration & evaluation
- **Status:** DONE
- **Priority:** 1
- **Problem:** Limit conditions (attempt/time windows) exist on `Activity` and
  RuleCondition evaluation, but the public config cannot set them.
- **Scope:**
  - Extend `ActivitySettings` with limit-related fields (attemptLimit,
    durations, begin/end times, timeLimitAction).
  - Update `createActivity` to populate these fields.
  - Add tests covering `attemptLimitExceeded`, `timeLimitExceeded`,
    `outsideAvailableTimeRange` conditions.
- **Refs:**
  - `src/cmi/scorm2004/sequencing/activity.ts`
  - `src/cmi/scorm2004/sequencing/sequencing_rules.ts`
- **Validation:** Unit tests around rule evaluation when fields are set.
- **Notes:** 2025-09-18 – Added limit-condition fields to `ActivitySettings`, plumbed through `Scorm2004API`, and introduced targeted vitest coverage for rule evaluation and configuration propagation.

### T3 – Implement objective collections (primary/additional) with mapInfo
- **Status:** DONE
- **Priority:** 1
- **Problem:** The engine references objectives but `Activity` lacks a concrete
  objective model; mapInfo/global objective links can’t be set.
- **Scope:**
  - Introduce objective data structures on `Activity`.
  - Allow configuration input for primary/additional objectives and mapInfo.
  - Ensure sequencing rules and rollup processes consult the new data.
- **Refs:**
  - Spec: SCORM 2004 Sequencing (Objective Data Model)
  - Code: `overall_sequencing_process.ts:2230-2269`, `rollup_process.ts:401-420`
- **Validation:** Integration-style tests verifying objective-based rules roll up.
- **Notes:** 2025-09-18 – Added primary/additional objective models with mapInfo, wired configuration through `Scorm2004API`, synchronized rollup/global handling, and expanded tests (`SequencingConfiguration`, `objective_mapping`).

### T4 – Replace placeholder global objective map with real objective IDs
- **Status:** DONE
- **Priority:** 1
- **Problem:** `collectGlobalObjectives` fabricates IDs per activity; global
  objective sharing (`adlseq:objectivesGlobalToSystem`) isn’t honored.
- **Scope:**
  - Tie global objective entries to configured objective IDs.
  - Support LMS-provided global objective persistence hooks.
  - Align with mapInfo from T3.
- **Refs:** `overall_sequencing_process.ts:2409-2476`
- **Validation:** Tests syncing mock global objectives across activities.
- **Notes:** 2025-09-18 – Begin aligning global objective map with configured IDs, auditing persistence and synchronization changes required.
- **Notes:** 2025-09-18 – Added real objective ID collection (with default fallback), serialized global objective map for persistence, and ensured rollup synchronization honors mapInfo directives.
- **Notes:** 2025-09-18 – Persisted global objective map through `Scorm2004API` save/load, synchronized `_globalObjectives` with sequencing map updates, and added API coverage verifying round-trip restoration.

### T5 – Resolve Priority 1 gaps in OverallSequencingProcess
- **Status:** DONE
- **Priority:** 1
- **Problem:** Sections marked “Priority 1 Gap” indicate incomplete spec
  behaviors (choice validation, forward-only checks, disabled detection, etc.).
- **Scope:**
  - Audit each gap-marked method, fill missing logic, and remove TODO markers.
  - Add tests covering edge cases: nested constrainChoice, forward-only
    ancestors, disabled/hidden detection.
- **Refs:** `overall_sequencing_process.ts:1431-1579`
- **Validation:** Unit tests for each scenario; ensure existing flows unaffected.
- **Notes:** Should follow after configuration fields are in place (T1/T2).
- **Notes:** 2025-09-18 – Plan: catalogue current "Priority 1 Gap" markers in OP.1, draft test matrix covering nested constrainChoice, forward-only ancestors, and disabled-from-choice branches, then implement fixes incrementally.
- **Notes:** 2025-09-18 – Added choice-navigation enforcement for `constrainChoice`, `preventActivation`, forward-only ancestors, precondition-disabled targets, `stopForwardTraversal` boundaries, and skipped siblings with Vitest coverage (`navigation_choice_constraints`).
- **Notes:** 2025-09-18 – Choice-path gap closed; traversal helpers now treat skipped/hidden/disabled siblings appropriately, matching sequencing-process flow checks.

### T6 – Support ADL constrained choice & rollup considerations
- **Status:** DONE
- **Priority:** 2
- **Problem:** ADL extensions (`adlseq:constrainedChoiceConsiderations`,
  `adlseq:rollupConsiderations`) aren’t represented in config or engine.
- **Scope:**
  - Extend configuration to accept ADL attributes.
  - Update sequencing/rollup logic to respect them.
- **Refs:** SCORM 2004 4th Edition, ADL XSDs in `test/integration/modules/...`
- **Validation:** Spec-based unit tests verifying constraints take effect.
- **Notes:** 2025-09-18 – Added rollup considerations settings (`requiredFor*`, `measureSatisfactionIfActive`) to sequencing types and activity model, plumbed through `Scorm2004API`, and updated `RollupProcess` default logic to honor them. Enhanced constrained-choice validation so `preventActivation` only blocks requests that would create new attempts, allowing re-entry into active branches. Coverage added in `rollup_processes` and `navigation_choice_constraints` specs.

### T7 – Surface randomization selection state via configuration & persistence
- **Status:** DONE
- **Priority:** 2
- **Problem:** Selection/randomization runs but initial state isn’t configurable
  nor persisted across sessions.
- **Scope:**
  - Allow configuration to set pre-randomized order or selection state.
  - Include processed children and selection metadata in serialized state.
- **Refs:** `selection_randomization.ts`, `serializeSequencingState`
- **Validation:** Tests showing repeat sessions maintain same randomized order.
- **Notes:** Surfaced configuration hooks for selection/randomization state, added persistence round-trip coverage (`SequencingConfiguration`, `SequencingPersistence`), and exercised START/CONTINUE traversal against pre-selected clusters (`sequencing_process`). Verified nested clusters, RESUME_ALL, and CHOICE navigation respect restored availability (`sequencing_process`, `overall_sequencing_process`).
- **Notes:** Complementary to T1/T2.

### T8 – Honor `adlnav:hideLMSUI`
- **Status:** DONE
- **Priority:** 2
- **Problem:** Manifest hints to hide LMS UI aren’t surfaced; LMS can’t react.
- **Scope:**
  - Add configuration field for hide directives (per activity/global).
  - Emit events or metadata so hosting LMS can adjust UI.
- **Refs:** Spec: ADL Navigation, `Scorm2004API` event hooks.
- **Validation:** Unit test ensuring directives appear in sequencing state/events.
- **Notes:** Surfaced hideLMSUI directives via configuration (global and per-activity), snapshot persistence, and navigation validity events; SequencingService relays the union to listeners so LMS UIs can react (`SequencingConfiguration`, `overall_sequencing_process`).

### T9 – Support sequencing collections (`ID` / `IDRef` reuse)
- **Status:** IN PROGRESS
- **Priority:** 3
- **Problem:** Shared sequencing definitions aren’t reusable; configuration
  requires duplication.
- **Scope:**
  - Allow configuration to reference shared rule/control bundles.
  - Maintain lookup map when building activities.
- **Refs:** Spec: `<imsss:sequencingCollection>`.
- **Validation:** Tests verifying multiple items reuse the same sequencing block.
- **Notes:** Added configuration support for shared sequencing collections (controls, rules, hide directives, selection state) with multi-ref union logic and regression coverage (`SequencingConfiguration`). Next: ensure integration harness consumes collection defaults and extend persistence coverage if collections introduce nested overrides.
- **Notes:** 2025-09-19 – Cross-frame and standard wrappers now listen for `onNavigationValidityUpdate`, update their LMS navigation controls, and surface the unioned `hideLmsUi` directives so shared collection defaults appear in the integration harness examples.
- **Notes:** 2025-09-19 – Surfaced auxiliary resources metadata through sequencing configuration, persistence, and integration wrappers; Playwright coverage now checks the rendered auxiliary resource list in all harness variants.

### T10 – Add coverage for auxiliary resources metadata
- **Status:** DONE
- **Priority:** 3
- **Problem:** `<imsss:auxiliaryResources>` is unsupported; manifests can’t
  expose supplemental navigation aids.
- **Scope:**
  - Extend configuration types and delivery events to surface auxiliary assets.
  - Provide event so LMS can render them.
- **Refs:** Spec section on Auxiliary Resources.
- **Validation:** API test ensuring metadata round-trips through state/events.

---

## Active Work Log

_This section is updated as work proceeds on each task._

- **2025-09-18:** Started T1. Plan: (a) extend `SequencingControlsSettings` to include missing control, selection, and randomization fields; (b) surface enums for selection/randomization timing; (c) wire `Scorm2004API` configuration paths; (d) add unit tests covering propagation and sequencing behavior.
- **2025-09-18:** Completed T1 — updated public configuration surface, applied settings within `Scorm2004API`, added per-activity override coverage, and expanded `test/api/SequencingConfiguration.spec.ts`. Vitest subset `SequencingConfiguration` passes.
- **2025-09-18:** Started T2 to expose limit-condition configuration and ensure corresponding rule evaluation is covered by tests.
- **2025-09-18:** Completed T2 — limit configuration now flows through API, and new tests (`SequencingConfiguration`, `rule_condition_limits`) validate propagation plus rule outcomes.
- **2025-09-18:** Started T3 to add objective collections/mapInfo support; initial step is auditing current placeholders in sequencing processes and designing data model updates.
- **2025-09-18:** Completed T3 — objective configuration now supports primary/additional collections with map info, rollup/global synchronization uses the new model, and automated tests cover configuration plus mapping behavior.
- **2025-09-18:** Started T4 to ensure global objective map uses configured IDs, including serialization/persistence updates.
- **2025-09-18:** T4 progress – global objective map now uses mapInfo target IDs (with defaults), sequencing state serialization/restoration includes the map, and integration tests updated.
- **2025-09-18:** Completed T4 — persisted the global objective map through API save/load, synchronized `_globalObjectives` with sequencing map updates, and added `SequencingPersistence` vitest coverage for round-trip validation.
- **2025-09-18:** T5 planning — inventory remaining OP.1 "Priority 1 Gap" markers, sketch test scenarios (nested constrainChoice, forward-only ancestors, disabled-from-choice), and line up required fixtures before implementation.
- **2025-09-18:** Started T7 — surfaced configuration and persistence of selection/randomization state; added targeted Vitest coverage for configuration overrides and state round-trips.
- **2025-09-18:** Extended T7 coverage — verified sequencing START/CONTINUE respects pre-selected child order using persisted state (`sequencing_process`). Next: validate multi-level cluster traversal and integration flows post-restore.
- **2025-09-18:** Added multi-level cluster regression ensuring nested selections remain honored across START/CONTINUE (`sequencing_process`).
- **2025-09-18:** Verified restored selection state for RESUME_ALL and CHOICE navigation, covering visibility enforcement and preserved ordering within clusters (`overall_sequencing_process`). Remaining: broaden to integration harness once restore plumbing exposed externally.
- **2025-09-18:** Started T8 — added hideLmsUi configuration plumbing, surfaced directives on navigation validity events/state snapshots, and covered default plus per-activity unions (`SequencingConfiguration`, `overall_sequencing_process`). Next: surface directives through SequencingService for integration harness consumers.
- **2025-09-18:** Continued T8 — SequencingService now emits hideLmsUi unions, closing the task.
- **2025-09-18:** Started T9 — introduced sequencing collections (shared controls/rules/hide directives/selection state) with per-activity references, multi-branch reuse, and persistence coverage (`SequencingConfiguration`, `SequencingPersistence`). Service events now emit unioned directives for integration consumers.
