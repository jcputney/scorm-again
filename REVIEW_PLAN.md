# Comprehensive Pre-3.0.0 Release Code Review Plan

## Overview

This plan organizes a thorough code review of all 88 TypeScript source files (~32,000 lines of code) using **183 parallel subagents**, each reviewing **≤250 lines** while respecting method boundaries.

### Review Categories
1. **Spec Inaccuracies** - Code that doesn't match SCORM 1.2, SCORM 2004, or AICC specifications
2. **Bugs** - Logic errors, edge cases, race conditions, incorrect state management
3. **Dead Code** - Unused functions, unreachable branches, orphaned exports
4. **Unnecessarily Complex Code** - Over-engineering, premature abstraction, convoluted logic
5. **Stale Comments** - Comments that no longer match the code, TODOs that are done
6. **Missing Spec References** - Complex logic without specification section citations
7. **Untested Code** - Methods/branches without corresponding test coverage
8. **Security Issues** - XSS, injection, prototype pollution, unsafe parsing

**Note**: Code with comments explaining intentional spec deviations should be SKIPPED for spec validation.

---

## Agent Allocation Summary

| Category | Agents | Lines |
|----------|--------|-------|
| Core APIs (BaseAPI, Scorm12API, Scorm2004API) | 25 | ~5,500 |
| SCORM 2004 Sequencing Engine | 57 | ~13,000 |
| SCORM 2004 CMI Data Model | 23 | ~4,200 |
| SCORM 1.2 CMI Data Model | 11 | ~1,800 |
| Common CMI Components | 4 | ~600 |
| Services Layer | 17 | ~2,500 |
| Cross-Frame Communication | 3 | ~530 |
| Utilities | 14 | ~2,400 |
| Constants | 8 | ~1,500 |
| Types & Interfaces | 7 | ~800 |
| Exceptions & ESM | 9 | ~150 |
| Cross-Cutting Analysis | 5 | (all files) |
| **TOTAL** | **183 + 5** | ~32,000 |

---

## Domain 1: Core APIs (25 agents)

### BaseAPI.ts (9 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `API-BASE-01` | 1-305 | Constructor, settings initialization, error handling setup |
| `API-BASE-02` | 306-355 | Offline storage initialization |
| `API-BASE-03` | 356-625 | **LARGE BLOCK** - Main initialization logic (270 lines) |
| `API-BASE-04` | 626-874 | API logging, settings getter/setter, terminate |
| `API-BASE-05` | 875-1118 | getValue, setValue core logic |
| `API-BASE-06` | 1119-1362 | commit, data serialization |
| `API-BASE-07` | 1363-1598 | HTTP communication, request handling |
| `API-BASE-08` | 1599-1848 | Response processing, state management |
| `API-BASE-09` | 1849-1901 | Utility methods, cleanup |

**Spec Focus**: SCORM API method signatures, state machine, error codes

---

### Scorm2004API.ts (13 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `API-2004-01` | 1-322 | Constructor, settings, initialization |
| `API-2004-02` | 323-558 | lmsInitialize, lmsFinish |
| `API-2004-03` | 559-790 | lmsGetValue, completion/success evaluation |
| `API-2004-04` | 791-1025 | lmsSetValue, navigation handling |
| `API-2004-05` | 1026-1273 | lmsCommit, error methods |
| `API-2004-06` | 1274-1520 | Objective mapping, sequencing integration |
| `API-2004-07` | 1521-1770 | Data model element routing |
| `API-2004-08` | 1771-2019 | Validation helpers |
| `API-2004-09` | 2020-2257 | Reset logic, state restoration |
| `API-2004-10` | 2258-2490 | Activity tree integration |
| `API-2004-11` | 2491-2740 | Navigation request processing |
| `API-2004-12` | 2741-2988 | Sequencing callbacks |
| `API-2004-13` | 2989-3030 | Cleanup, exports |

**Spec Focus**: SCORM 2004 4th Edition RTE, SN, data model elements

---

### Scorm12API.ts (3 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `API-12-01` | 1-286 | Constructor, LMSInitialize, LMSFinish |
| `API-12-02` | 287-533 | LMSGetValue, LMSSetValue, validation |
| `API-12-03` | 534-596 | LMSCommit, error methods, cleanup |

**Spec Focus**: SCORM 1.2 RTE, CMI data model

---

## Domain 2: SCORM 2004 Sequencing Engine (57 agents)

### overall_sequencing_process.ts (16 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-OSP-01` | 1-276 | Class definition, processNavigationRequest |
| `SEQ-OSP-02` | 277-509 | navigationRequestProcess (SB.2.1) |
| `SEQ-OSP-03` | 510-757 | terminationRequestProcess (SB.2.2) |
| `SEQ-OSP-04` | 758-998 | handleExitTermination |
| `SEQ-OSP-05` | 999-1241 | handleExitAllTermination, handleAbandonTermination |
| `SEQ-OSP-06` | 1242-1490 | sequencingRequestProcess (SB.2.3) |
| `SEQ-OSP-07` | 1491-1739 | deliveryRequestProcess (SB.2.4) |
| `SEQ-OSP-08` | 1740-1979 | contentDeliveryEnvironment (DB.2) |
| `SEQ-OSP-09` | 1980-2229 | Activity state initialization |
| `SEQ-OSP-10` | 2230-2469 | Objective initialization |
| `SEQ-OSP-11` | 2470-2711 | End attempt process |
| `SEQ-OSP-12` | 2712-2959 | Rollup invocation |
| `SEQ-OSP-13` | 2960-3203 | Limit conditions check |
| `SEQ-OSP-14` | 3204-3453 | Suspended activity handling |
| `SEQ-OSP-15` | 3454-3692 | Activity tree consistency |
| `SEQ-OSP-16` | 3693-3727 | Exports, cleanup |

**Spec Focus**: SB.2.1-2.4, DB.2, UP.1-5

---

### sequencing_process.ts (13 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-SP-01` | 1-300 | Class definition, main entry points |
| `SEQ-SP-02` | 301-549 | Start sequencing request (SB.2.5) |
| `SEQ-SP-03` | 550-794 | Resume all sequencing request (SB.2.6) |
| `SEQ-SP-04` | 795-1038 | Continue sequencing request (SB.2.7) |
| `SEQ-SP-05` | 1039-1288 | Previous sequencing request (SB.2.8) |
| `SEQ-SP-06` | 1289-1537 | Choice sequencing request (SB.2.9) - Part 1 |
| `SEQ-SP-07` | 1538-1785 | Choice sequencing request (SB.2.9) - Part 2 |
| `SEQ-SP-08` | 1786-2024 | Retry sequencing request (SB.2.10) |
| `SEQ-SP-09` | 2025-2273 | Exit sequencing request (SB.2.11) |
| `SEQ-SP-10` | 2274-2516 | Flow subprocess (SB.2.3) |
| `SEQ-SP-11` | 2517-2749 | Choice activity traversal (SB.2.4) |
| `SEQ-SP-12` | 2750-2990 | Flow activity traversal (SB.2.2) |
| `SEQ-SP-13` | 2991-3006 | Exports |

**Spec Focus**: SB.2.5-2.12, SB.2.2-2.4

---

### rollup_process.ts (7 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-RP-01` | 1-260 | Class definition, overall rollup (RB.1.5) |
| `SEQ-RP-02` | 261-507 | Measure rollup process (RB.1.1) |
| `SEQ-RP-03` | 508-755 | Objective rollup using measure (RB.1.2) |
| `SEQ-RP-04` | 756-1001 | Activity progress rollup (RB.1.3) |
| `SEQ-RP-05` | 1002-1251 | Rollup rule check (RB.1.4) |
| `SEQ-RP-06` | 1252-1497 | Check child for rollup |
| `SEQ-RP-07` | 1498-1707 | Rollup action evaluation |

**Spec Focus**: RB.1.1-1.5

---

### rollup_rules.ts (3 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-RR-01` | 1-305 | RollupRule class, condition evaluation |
| `SEQ-RR-02` | 306-552 | Rollup action application |
| `SEQ-RR-03` | 553-598 | Helper methods |

---

### sequencing_rules.ts (3 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-SR-01` | 1-317 | SequencingRules class, condition classes |
| `SEQ-SR-02` | 318-560 | Pre/Post/Exit condition rules (SM.2) |
| `SEQ-SR-03` | 561-672 | Rule condition evaluation (UP.2) |

---

### sequencing_controls.ts (2 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-SC-01` | 1-313 | SequencingControls class, control modes |
| `SEQ-SC-02` | 314-527 | Constraint/limit condition checks |

---

### activity.ts (9 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-ACT-01` | 1-310 | Activity class, constructor, basic properties |
| `SEQ-ACT-02` | 311-555 | State tracking properties |
| `SEQ-ACT-03` | 556-793 | Objective management |
| `SEQ-ACT-04` | 794-1037 | Objective contribution to rollup |
| `SEQ-ACT-05` | 1038-1279 | Primary objective handling |
| `SEQ-ACT-06` | 1280-1526 | Global objective read/write |
| `SEQ-ACT-07` | 1527-1767 | Completion/progress tracking |
| `SEQ-ACT-08` | 1768-1988 | Attempt management |
| `SEQ-ACT-09` | 1989-2222 | Serialization, reset |

**Spec Focus**: TM.1.1, TM.1.2

---

### activity_tree.ts (2 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-AT-01` | 1-262 | ActivityTree class, traversal methods |
| `SEQ-AT-02` | 263-356 | findActivity, path utilities |

---

### navigation_look_ahead.ts (2 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-NLA-01` | 1-279 | NavigationLookAhead class, choice validation |
| `SEQ-NLA-02` | 280-477 | Hide/disable calculation |

---

### selection_randomization.ts (1 chunk)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-SELRAND-01` | 1-237 | Selection/Randomization process |

---

### sequencing.ts (1 chunk)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SEQ-SEQ-01` | 1-271 | Sequencing class, configuration |

---

## Domain 3: SCORM 2004 CMI Data Model (23 agents)

### cmi.ts (3 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `CMI-2004-01` | 1-277 | CMI class, core properties |
| `CMI-2004-02` | 278-506 | Collection management |
| `CMI-2004-03` | 507-569 | Serialization, reset |

---

### interactions.ts (4 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `CMI-INT-01` | 1-285 | CMIInteractionsObject, id/type/timestamp |
| `CMI-INT-02` | 286-535 | Weighting, learner_response |
| `CMI-INT-03` | 536-784 | Result, latency, pattern validation |
| `CMI-INT-04` | 785-834 | Objectives, correct_responses |

**Spec Focus**: CAM 4.1.11 - Interaction data types

---

### objectives.ts (2 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `CMI-OBJ-01` | 1-256 | CMIObjectivesObject, status tracking |
| `CMI-OBJ-02` | 257-322 | Score, completion |

---

### adl.ts (4 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `CMI-ADL-01` | 1-266 | ADL class, nav structure |
| `CMI-ADL-02` | 267-506 | Data collection |
| `CMI-ADL-03` | 507-751 | Request handling |
| `CMI-ADL-04` | 752-789 | Serialization |

---

### comments.ts (1 chunk)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `CMI-COM-01` | 1-188 | CMICommentsObject (from_learner/from_lms) |

---

### learner_preference.ts (1 chunk)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `CMI-LP-01` | 1-193 | Learner preferences (audio_level, language, etc.) |

---

### score.ts (1 chunk)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `CMI-SCO-01` | 1-101 | SCORM 2004 score (scaled, raw, min, max) |

---

### Supporting CMI (7 single-chunk files)

| Agent ID | File | Lines |
|----------|------|-------|
| `CMI-LRN-01` | learner.ts | 1-79 |
| `CMI-SES-01` | session.ts | 1-175 |
| `CMI-STA-01` | status.ts | 1-109 |
| `CMI-CNT-01` | content.ts | 1-105 |
| `CMI-THR-01` | thresholds.ts | 1-124 |
| `CMI-SET-01` | settings.ts | 1-154 |
| `CMI-META-01` | metadata.ts | 1-68 |

---

## Domain 4: SCORM 1.2 CMI Data Model (11 agents)

| Agent ID | File | Lines | Focus |
|----------|------|-------|-------|
| `CMI-12-01` | cmi.ts | 1-275 | CMI12 root class |
| `CMI-12-02` | core.ts | 1-264 | Core element Part 1 |
| `CMI-12-03` | core.ts | 265-488 | Core element Part 2 |
| `CMI-12-04` | interactions.ts | 1-264 | Interactions Part 1 |
| `CMI-12-05` | interactions.ts | 265-490 | Interactions Part 2 |
| `CMI-12-06` | objectives.ts | 1-139 | Objectives |
| `CMI-12-07` | student_data.ts | 1-226 | Student data |
| `CMI-12-08` | student_preference.ts | 1-158 | Student preference |
| `CMI-12-09` | nav.ts | 1-65 | Navigation |
| `CMI-12-10` | validation.ts | 1-54 | SCORM 1.2 validation |

**Spec Focus**: SCORM 1.2 RTE Book, CMI Data Model

---

## Domain 5: Common CMI Components (4 agents)

| Agent ID | File | Lines | Focus |
|----------|------|-------|-------|
| `CMI-COM-ARR-01` | array.ts | 1-91 | CMIArray class |
| `CMI-COM-BASE-01` | base_cmi.ts | 1-62 | BaseCMI class |
| `CMI-COM-SCO-01` | score.ts | 1-227 | Common score class |
| `CMI-COM-VAL-01` | validation.ts | 1-80 | Common validation |

---

## Domain 6: Services Layer (17 agents)

### SequencingService.ts (4 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SVC-SEQ-01` | 1-326 | Service initialization, tree management |
| `SVC-SEQ-02` | 327-567 | Navigation request handling |
| `SVC-SEQ-03` | 568-796 | State persistence |
| `SVC-SEQ-04` | 797-937 | Reset, cleanup |

---

### OfflineStorageService.ts (2 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SVC-OFF-01` | 1-281 | Storage, sync initialization |
| `SVC-OFF-02` | 282-472 | Data retrieval, conflict resolution |

---

### SerializationService.ts (2 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `SVC-SER-01` | 1-294 | Serialization methods |
| `SVC-SER-02` | 295-328 | Total time handling |

---

### HTTP Services (3 chunks)

| Agent ID | File | Lines |
|----------|------|-------|
| `SVC-HTTP-ASYNC-01` | AsynchronousHttpService.ts | 1-269 |
| `SVC-HTTP-ASYNC-02` | AsynchronousHttpService.ts | 270-273 |
| `SVC-HTTP-SYNC-01` | SynchronousHttpService.ts | 1-151 |

---

### Other Services (6 single-chunk files)

| Agent ID | File | Lines |
|----------|------|-------|
| `SVC-EVT-01` | EventService.ts | 1-255 |
| `SVC-ERR-01` | ErrorHandlingService.ts | 1-225 |
| `SVC-LOG-01` | LoggingService.ts | 1-160 |
| `SVC-VAL-01` | ValidationService.ts | 1-108 |
| `SVC-DEL-01` | ActivityDeliveryService.ts | 1-146 |

---

## Domain 7: Cross-Frame Communication (3 agents)

| Agent ID | File | Lines | Focus |
|----------|------|-------|-------|
| `XFRAME-API-01` | CrossFrameAPI.ts | 1-285 | Proxy setup, method forwarding |
| `XFRAME-API-02` | CrossFrameAPI.ts | 286-358 | Cache management |
| `XFRAME-LMS-01` | CrossFrameLMS.ts | 1-171 | Message handling, origin validation |

**Security Focus**: postMessage origin validation critical

---

## Domain 8: Utilities (14 agents)

### utilities.ts (3 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `UTIL-01` | 1-297 | String utilities, time formatting |
| `UTIL-02` | 298-520 | Data flattening, unflatten |
| `UTIL-03` | 521-617 | Validation helpers |

---

### PlayerEventAdapter.ts (2 chunks)

| Agent ID | Lines | Focus |
|----------|-------|-------|
| `UTIL-PEA-01` | 1-377 | Event adapter logic |
| `UTIL-PEA-02` | 378-428 | Cleanup, exports |

---

### scorm12-lms-helpers (8 chunks)

| Agent ID | File | Lines |
|----------|------|-------|
| `UTIL-S12-CRC-01` | course_rollup_calculator.ts | 1-290 |
| `UTIL-S12-CRC-02` | course_rollup_calculator.ts | 291-382 |
| `UTIL-S12-SCO-01` | sco_state_tracker.ts | 1-291 |
| `UTIL-S12-SCO-02` | sco_state_tracker.ts | 292-396 |
| `UTIL-S12-SEQ-01` | scorm12_sequencer.ts | 1-300 |
| `UTIL-S12-SEQ-02` | scorm12_sequencer.ts | 301-377 |
| `UTIL-S12-TIME-01` | time_utilities.ts | 1-142 |
| `UTIL-S12-TYPES-01` | types.ts | 1-167 |

---

## Domain 9: Constants (8 agents)

| Agent ID | File | Lines | Focus |
|----------|------|-------|-------|
| `CONST-API-01` | api_constants.ts | 1-259 | API constants |
| `CONST-REGEX-01` | regex.ts | 1-258 | Validation regex patterns |
| `CONST-LANG-01` | language_constants.ts | 1-394 | ISO language codes |
| `CONST-SEQ-01` | sequencing_exceptions.ts | 1-195 | Sequencing exception codes |
| `CONST-RESP-01` | response_constants.ts | 1-167 | Response patterns |
| `CONST-DEF-01` | default_settings.ts | 1-164 | Default configuration |
| `CONST-ERR-01` | error_codes.ts | 1-82 | Error code definitions |
| `CONST-ENUM-01` | enums.ts | 1-45 | Enumeration types |

**Spec Focus**: Error codes match SCORM specification tables

---

## Domain 10: Types & Interfaces (7 agents)

| Agent ID | File | Lines | Focus |
|----------|------|-------|-------|
| `TYPE-API-01` | api_types.ts | 1-273 | API type definitions |
| `TYPE-SEQ-01` | sequencing_types.ts | 1-290 | Sequencing types |
| `TYPE-XFRAME-01` | CrossFrame.ts | 1-59 | Cross-frame types |
| `TYPE-SCHED-01` | scheduled_commit.ts | 1-45 | Commit scheduling |
| `IFACE-SVC-01` | services.ts | 1-269 | Service interfaces Part 1 |
| `IFACE-SVC-02` | services.ts | 270-399 | Service interfaces Part 2 |
| `IFACE-API-01` | IBaseAPI.ts | 1-40 | Base API interface |

---

## Domain 11: Exceptions & ESM (9 agents)

| Agent ID | File | Lines |
|----------|------|-------|
| `EXC-01` | exceptions.ts | 1-73 |
| `EXC-12-01` | scorm12_exceptions.ts | 1-35 |
| `EXC-2004-01` | scorm2004_exceptions.ts | 1-35 |
| `ESM-01` | esm/ScormAgain.esm.ts | 1-6 |
| `ESM-02` | esm/Scorm2004API.esm.ts | 1-3 |
| `ESM-03` | esm/Scorm12API.esm.ts | 1-3 |
| `ESM-04` | esm/CrossFrameAPI.esm.ts | 1-9 |
| `ESM-05` | esm/CrossFrameLMS.esm.ts | 1-3 |
| `GLOBAL-01` | global.d.ts | 1-9 |

---

## Domain 12: Cross-Cutting Analysis (5 specialized agents)

These agents review ALL files for specific concerns:

| Agent ID | Focus | Scope |
|----------|-------|-------|
| `CC-TS-01` | TypeScript Quality | `any` types, unsafe casts, type guards |
| `CC-PERF-01` | Performance & Memory | Memory leaks, hot paths, O(n²) |
| `CC-ASYNC-01` | Async/Concurrency | Promises, race conditions, sendBeacon |
| `CC-BREAK-01` | Breaking Changes | API changes from 2.x |
| `CC-DEP-01` | Dependencies | Circular imports, unused exports |

---

## Agent Review Checklist

Each agent produces a JSON report covering:

```json
{
  "agent_id": "SEQ-OSP-01",
  "file": "src/cmi/scorm2004/sequencing/overall_sequencing_process.ts",
  "lines": "1-276",
  "findings": [
    {
      "severity": "HIGH",
      "category": "spec|bug|dead_code|complexity|comments|spec_ref|untested|security",
      "line": 123,
      "description": "What's wrong",
      "suggestion": "How to fix it",
      "spec_reference": "SCORM 2004 SB.2.1"
    }
  ],
  "summary": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0,
    "lines_reviewed": 276
  }
}
```

### Review Categories

1. **Spec Compliance** (if applicable)
   - Method signatures match specification
   - Data types follow spec definitions
   - Error codes are correct per spec
   - If deviation exists with explanatory comment → SKIP

2. **Bug Detection**
   - Edge cases handled correctly
   - Null/undefined checks present
   - State transitions valid
   - Error propagation correct

3. **Dead Code**
   - All functions used
   - All branches reachable
   - No orphaned imports

4. **Complexity**
   - Functions < 50 lines
   - No unnecessary abstraction
   - Clear separation of concerns

5. **Comments**
   - Comments match code behavior
   - No stale TODOs
   - JSDoc matches actual parameters

6. **Spec References**
   - Complex logic cites spec sections
   - Sequencing behaviors cite SB/RB/UP

7. **Test Coverage**
   - Cross-reference with test files
   - Flag untested methods

8. **Security**
   - No eval() with user input
   - postMessage origin validation
   - Safe JSON parsing

---

## Execution Strategy

### Phase 1: Launch All Domain Agents (183 agents)
All domain agents run in parallel, each focused on their specific 250-line chunk.

### Phase 2: Launch Cross-Cutting Agents (5 agents)
After domain agents complete, run cross-cutting analysis.

### Phase 3: Consolidation
- Merge all 188 agent reports
- Sort findings by severity
- Create actionable issue list

---

## Output Files

After completion:

1. **REVIEW_FINDINGS.md** - All findings sorted by severity
2. **CRITICAL_BLOCKERS.md** - Must-fix before 3.0.0
3. **BREAKING_CHANGES.md** - API changes from 2.x
4. **TECH_DEBT.md** - LOW findings for future work

---

## Pre-Flight Checks

```bash
# Ensure clean state before starting
npm test                    # All tests pass
npm run lint               # No lint errors
npm run test:coverage      # Baseline coverage
npx tsc --noEmit           # No TypeScript errors
git rev-parse HEAD         # Document commit hash
```

---

## Test File Mapping

For coverage analysis, each agent should reference these test directories:

| Source Pattern | Test Pattern |
|----------------|--------------|
| `src/BaseAPI.ts` | `test/api/BaseAPI*.spec.ts` |
| `src/Scorm2004API.ts` | `test/api/Scorm2004API*.spec.ts` |
| `src/Scorm12API.ts` | `test/api/Scorm12API*.spec.ts` |
| `src/cmi/scorm2004/sequencing/*.ts` | `test/cmi/scorm2004/sequencing/*.spec.ts` |
| `src/cmi/scorm2004/*.ts` | `test/cmi/scorm2004*.spec.ts` |
| `src/cmi/scorm12/*.ts` | `test/cmi/scorm12*.spec.ts` |
| `src/services/*.ts` | `test/services/*.spec.ts` |
| `src/utilities/*.ts` | `test/utilities/*.spec.ts` |

---

## Specification References

### SCORM 2004 4th Edition
- **RTE**: Data model, API signatures, error codes
- **SN**: Sequencing and Navigation behaviors
- **SB**: Sequencing Behavior pseudocode (SB.2.1-2.12)
- **UP**: Utility Processes (UP.1-5)
- **RB**: Rollup Behavior (RB.1.1-1.5)
- **TM**: Tracking Model (TM.1.1, TM.1.2)
- **DB**: Delivery Behavior (DB.2)
- **CAM**: Content Aggregation Model

### SCORM 1.2
- **RTE Book**: API and data model
- **CMI Data Model**: Element definitions
