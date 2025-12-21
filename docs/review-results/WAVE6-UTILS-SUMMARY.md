# Wave 6: Cross-Frame, Utils, Constants Code Review Summary

**Date:** 2025-12-21
**Files Reviewed:** 20+ files in `src/CrossFrame*.ts`, `src/utilities*.ts`, `src/constants/`
**Total Agents:** 26
**Lines Reviewed:** ~3,500 lines

## Summary Statistics

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 2 |
| Medium | 5 |
| Low | 38 |

## High Severity Findings

### 1. [CF-LMS-01] Missing Validation for ev.source Type
- **File:** CrossFrameLMS.ts:99
- **Issue:** `ev.source` is cast to `Window` without validating it's actually a Window object (could be MessagePort or ServiceWorker)
- **Impact:** Unsafe type assertion could cause runtime errors
- **Fix:** Add type guard: `if (!ev.source || !('postMessage' in ev.source)) return;`

### 2. [CF-API2-01] Origin Validation Allows Wildcard with Source Check
- **File:** CrossFrameAPI.ts:303-308
- **Issue:** When targetOrigin is '*', origin check is skipped but source window validation still runs, creating inconsistent security model
- **Impact:** Confusing security configuration
- **Fix:** Add documentation explaining security model and log warning when '*' is used

## Medium Severity Findings

### Security Issues (3 findings)
| File | Line | Issue |
|------|------|-------|
| CrossFrameLMS.ts | 98 | Unsafe type assertion on ev.data without validation |
| CrossFrameLMS.ts | 148 | Arbitrary property access on API object without hasOwnProperty check |
| CrossFrameAPI.ts | 154 | Default wildcard origin accepts messages from any source |

### Logic Issues (2 findings)
| File | Line | Issue |
|------|------|-------|
| CrossFrameAPI.ts | 232 | Heartbeat timer not cleared before starting (could create multiples) |
| CrossFrameAPI.ts | 333 | Rate limit event emits 'unknown' method instead of actual method |

## Low Severity Findings (38 total)

### Categories
- **Security Concerns:** 6 findings
- **Missing Spec References:** 8 findings
- **Untested Code:** 10 findings
- **Stale Comments:** 5 findings
- **Complexity Issues:** 5 findings
- **Dead Code:** 4 findings

## Agent Results by File

### CrossFrame Files (3 agents)
| File | Lines | Critical | High | Medium | Low |
|------|-------|----------|------|--------|-----|
| CrossFrameAPI.ts (1-180) | 0 | 0 | 1 | 7 |
| CrossFrameAPI.ts (181-358) | 0 | 1 | 2 | 9 |
| CrossFrameLMS.ts (1-171) | 0 | 1 | 4 | 6 |

### Constants Files (10 agents)
| File | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| api_constants.ts | 0 | 0 | 0 | 3 |
| regex.ts | 0 | 0 | 0 | 4 |
| error_codes.ts | 0 | 0 | 0 | 2 |
| enums.ts | 0 | 0 | 0 | 2 |
| default_settings.ts | 0 | 0 | 0 | 3 |
| language_constants.ts | 0 | 0 | 0 | 2 |
| response_constants.ts | 0 | 0 | 0 | 1 |
| sequencing_exceptions.ts | 0 | 0 | 0 | 2 |

### Utility Files (8 agents)
| File | Critical | High | Medium | Low |
|------|----------|------|--------|-----|
| utilities.ts | 0 | 0 | 0 | 6 |
| time_utilities.ts | 0 | 0 | 0 | 2 |
| PlayerEventAdapter.ts | 0 | 0 | 0 | 4 |
| sco_state_tracker.ts | 0 | 0 | 0 | 3 |
| course_rollup_calculator.ts | 0 | 0 | 0 | 3 |
| scorm12_sequencer.ts | 0 | 0 | 0 | 3 |
| exceptions files | 0 | 0 | 0 | 2 |

## Recommended Actions

### Must Fix Before 3.0.0 Release
1. [ ] Add ev.source type validation in CrossFrameLMS (HIGH)
2. [ ] Document and warn about wildcard origin security implications (HIGH)
3. [ ] Add hasOwnProperty check for property access on API object (MEDIUM)

### Should Fix
4. [ ] Add ev.data structural validation before type assertion
5. [ ] Clear heartbeat timer before starting new one
6. [ ] Include actual method name in rate limit events
7. [ ] Validate msg.params is an array before apply()

### Nice to Have
8. [ ] Add security test cases for prototype pollution attempts
9. [ ] Improve error message extraction to preserve error codes
10. [ ] Add spec references to method type detection comments
