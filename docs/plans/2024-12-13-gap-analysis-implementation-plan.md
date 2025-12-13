# SCORM Gap Analysis Implementation Plan

**Date:** 2024-12-13
**Source:** Gap analysis in `docs/analysis/`
**Approach:** Severity-first, continuous delivery, feature-complete chunks

---

## Overview

15 work items addressing compliance gaps identified in the reference implementation comparison. Each item is independently committable with tests and documentation.

### Delivery Strategy
- **Commits:** One per work item (no PRs, local workflow)
- **Testing:** Unit + Integration + Conformance verification
- **Documentation:** Incremental as files are touched, final sweep at end
- **Order:** Critical → Major → Medium → Minor → Cleanup

### Commit Format
```
fix(scope): brief description

- Implements SPEC Section X.X.X requirement
- Adds unit tests for [specific behavior]
- Adds spec reference to [file/class]
```

---

## Critical Priority

### C1: SCORM 1.2 - Make interactions.n.objectives.n.id write-only

**Problem:** `cmi.interactions.n.objectives.n.id` has a public getter but should be write-only per spec.

| Aspect | Details |
|--------|---------|
| Files | `src/cmi/scorm12/interactions.ts` |
| Spec | SCORM 1.2 RTE Section 3.4.2.9.3 |
| Error Code | 404 (Write Only Element) |

**Implementation:**
```typescript
// Change from:
get id(): string { return this._id; }

// To:
get id(): string {
  throw new Scorm12ValidationError(
    this._cmi_element + ".id",
    scorm12_errors.WRITE_ONLY_ELEMENT as number
  );
}
```

**Tests:**
- Unit: `LMSGetValue("cmi.interactions.0.objectives.0.id")` throws error 404
- Unit: `LMSSetValue("cmi.interactions.0.objectives.0.id", "obj1")` succeeds
- Integration: Verify error returned through full API path

---

### C2: SCORM 2004 - Navigation Request exceptions (NB.2.1.x)

**Problem:** 13 Navigation Request Process exception codes are missing.

| Aspect | Details |
|--------|---------|
| Files | `src/constants/sequencing_exceptions.ts`, `src/cmi/scorm2004/sequencing/overall_sequencing_process.ts` |
| Spec | SCORM 2004 SN Book, NB.2.1 Navigation Request Process |

**Exception Codes to Add:**
```typescript
export const NavigationExceptions = {
  "NB.2.1-1": "Sequencing session already started",
  "NB.2.1-2": "Current activity not defined / sequencing not begun",
  "NB.2.1-3": "No suspended activity to resume",
  "NB.2.1-4": "Flow not enabled / current activity is root",
  "NB.2.1-5": "Violates control mode (forward only or flow disabled)",
  "NB.2.1-6": "Cannot move backward from root",
  "NB.2.1-7": "Forward/Backward navigation not supported",
  "NB.2.1-9": "Activity path empty",
  "NB.2.1-10": "Choice control disabled on parent",
  "NB.2.1-11": "Target activity does not exist",
  "NB.2.1-12": "Activity already terminated",
  "NB.2.1-13": "Undefined navigation request",
};
```

**Tests:**
- Unit: Each exception condition triggers correct code
- Integration: Navigation rejection scenarios via API

---

## Major Priority

### M1: SCORM 2004 - Retry Process exceptions (SB.2.10.x)

**Problem:** Retry sequencing request has no exception handling.

| Aspect | Details |
|--------|---------|
| Files | `src/constants/sequencing_exceptions.ts`, `src/cmi/scorm2004/sequencing/sequencing_process.ts` |
| Spec | SCORM 2004 SN Book, SB.2.10 Retry Sequencing Request Process |

**Exception Codes to Add:**
```typescript
export const RetryExceptions = {
  "SB.2.10-1": "Current activity not defined",
  "SB.2.10-2": "Activity is still active or suspended",
  "SB.2.10-3": "Flow subprocess returned false (nothing to deliver)",
};
```

**Tests:**
- Unit: Retry without current activity → SB.2.10-1
- Unit: Retry while activity active → SB.2.10-2
- Unit: Retry with no deliverable child → SB.2.10-3

---

### M2: SCORM 2004 - Choice Activity Traversal exceptions (SB.2.4.x)

**Problem:** Choice traversal subprocess missing edge case exceptions.

| Aspect | Details |
|--------|---------|
| Files | `src/constants/sequencing_exceptions.ts`, `src/cmi/scorm2004/sequencing/sequencing_process.ts` |
| Spec | SCORM 2004 SN Book, SB.2.4 Choice Activity Traversal Subprocess |

**Exception Codes to Add:**
```typescript
export const ChoiceTraversalExceptions = {
  "SB.2.4-1": "Stop forward traversal rule evaluates to true",
  "SB.2.4-2": "Constrained choice requires forward traversal from leaf",
  "SB.2.4-3": "Cannot walk backward from root of activity tree",
};
```

**Tests:**
- Unit: Activity with stopForwardTraversal=true blocks choice
- Unit: constrainedChoice + leaf + forward required
- Unit: Backward traversal from root rejected

---

### M3: Sequential array index validation

**Problem:** Array indices may not be enforced as sequential (0, 1, 2...).

| Aspect | Details |
|--------|---------|
| Files | `src/cmi/common/array.ts` or `src/BaseAPI.ts` |
| Spec | SCORM 1.2 RTE 3.4.2.6, SCORM 2004 RTE 4.2 |
| Error Code | 201 (Invalid Argument) or 351 (General Set Failure) |

**Implementation:**
```typescript
// In array setValue or _commonSetCMIValue:
if (index > this.childArray.length) {
  // Index must be sequential - can't skip indices
  throw new ValidationError(
    CMIElement,
    errorCodes.GENERAL_SET_FAILURE
  );
}
```

**Tests:**
- Unit: SetValue index 0 succeeds on empty array
- Unit: SetValue index 1 succeeds when 0 exists
- Unit: SetValue index 2 fails when only 0 exists (gap)
- Integration: Both SCORM 1.2 and 2004 enforce this

---

## Medium Priority

### D1: Initialize argument validation

**Problem:** Initialize() doesn't validate that argument is empty string.

| Aspect | Details |
|--------|---------|
| Files | `src/BaseAPI.ts`, `src/Scorm12API.ts`, `src/Scorm2004API.ts` |
| Spec | SCORM 1.2 RTE 3.4.3.1, SCORM 2004 RTE 3.1.2.1 |
| Error Code | 201 (Argument Error) |

**Implementation:**
```typescript
lmsInitialize(arg: string = ""): string {
  if (arg !== "") {
    this.throwSCORMError(this._error_codes.ARGUMENT_ERROR);
    return global_constants.SCORM_FALSE;
  }
  // ... existing logic
}
```

**Tests:**
- Unit: Initialize("") succeeds
- Unit: Initialize("foo") returns "false" with error 201
- Unit: Initialize() (no arg) succeeds (default "")

---

### D2: Terminate argument validation

**Problem:** Terminate() doesn't validate that argument is empty string.

| Aspect | Details |
|--------|---------|
| Files | `src/BaseAPI.ts` |
| Spec | SCORM 1.2 RTE 3.4.3.2, SCORM 2004 RTE 3.1.2.2 |
| Error Code | 201 (Argument Error) |

**Implementation:** Same pattern as D1.

**Tests:**
- Unit: Terminate("") succeeds
- Unit: Terminate("foo") returns "false" with error 201

---

### D3: Commit argument validation

**Problem:** Commit() doesn't validate that argument is empty string.

| Aspect | Details |
|--------|---------|
| Files | `src/BaseAPI.ts` |
| Spec | SCORM 1.2 RTE 3.4.4.1, SCORM 2004 RTE 3.1.2.5 |
| Error Code | 201 (Argument Error) |

**Implementation:** Same pattern as D1.

**Tests:**
- Unit: Commit("") succeeds
- Unit: Commit("foo") returns "false" with error 201

---

### D4: GetErrorString("") returns empty string

**Problem:** Need to verify GetErrorString("") returns "" per 3rd Edition.

| Aspect | Details |
|--------|---------|
| Files | `src/BaseAPI.ts` |
| Spec | SCORM 2004 3rd Edition Addendum |

**Current Code (verify correct):**
```typescript
getErrorString(callbackName: string, CMIErrorCode: string | number): string {
  let returnValue = "";
  if (CMIErrorCode !== null && CMIErrorCode !== "") {
    returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
  }
  return returnValue;  // Returns "" when CMIErrorCode is ""
}
```

**Tests:**
- Unit: GetErrorString("") === ""
- Unit: GetErrorString("0") returns "No Error"
- Unit: GetErrorString("999") returns "" (unknown code)

---

### D5: Termination exceptions (TB.2.3-3, -6, -7)

**Problem:** 3 termination edge case exceptions missing.

| Aspect | Details |
|--------|---------|
| Files | `src/constants/sequencing_exceptions.ts`, `src/cmi/scorm2004/sequencing/overall_sequencing_process.ts` |
| Spec | SCORM 2004 SN Book, TB.2.3 Termination Request Process |

**Exception Codes to Add:**
```typescript
// Add to TerminationExceptions:
"TB.2.3-3": "Nothing to suspend (root activity)",
"TB.2.3-6": "Nothing to abandon",
"TB.2.3-7": "Undefined termination request",
```

**Tests:**
- Unit: Suspend from root → TB.2.3-3
- Unit: Abandon with nothing active → TB.2.3-6
- Unit: Invalid termination request type → TB.2.3-7

---

## Minor Priority

### N1: CMIDecimal regex adjustment

**Problem:** Current regex is more restrictive than spec requires.

| Aspect | Details |
|--------|---------|
| Files | `src/constants/regex.ts` |
| Spec | SCORM 2004 RTE Appendix C |

**Current:**
```typescript
CMIDecimal: "^-?([0-9]{1,5})(\.[0-9]{1,18})?$"
```

**Proposed:**
```typescript
CMIDecimal: "^-?([0-9]+)(\.[0-9]+)?$"
// Or keep practical limits but document why:
CMIDecimal: "^-?([0-9]{1,10})(\.[0-9]{1,18})?$"  // Practical limits
```

**Tests:**
- Unit: Accept "123456.789" (currently rejected)
- Unit: Reject non-numeric strings
- Unit: Accept negative decimals

---

### N2: Deprecation warning for cmi.exit="logout"

**Problem:** "logout" is deprecated in 4th Edition but no warning is shown.

| Aspect | Details |
|--------|---------|
| Files | `src/cmi/scorm2004/session.ts` |
| Spec | SCORM 2004 4th Edition Addendum |

**Implementation:**
```typescript
set exit(exit: string) {
  if (exit === "logout") {
    console.warn(
      'SCORM 2004: cmi.exit value "logout" is deprecated per 4th Edition. ' +
      'Consider using "normal" or "suspend" instead.'
    );
  }
  if (check2004ValidFormat(this._cmi_element + ".exit", exit, scorm2004_regex.CMIExit, true)) {
    this._exit = exit;
  }
}
```

**Tests:**
- Unit: Setting "logout" logs warning (spy on console.warn)
- Unit: Setting "suspend" does not log warning
- Unit: "logout" is still accepted (just warned)

---

### N3: Flow Tree exception (SB.2.1-4)

**Problem:** Forward-only violation exception missing.

| Aspect | Details |
|--------|---------|
| Files | `src/constants/sequencing_exceptions.ts`, `src/cmi/scorm2004/sequencing/sequencing_process.ts` |
| Spec | SCORM 2004 SN Book, SB.2.1 Flow Tree Traversal Subprocess |

**Exception Code to Add:**
```typescript
// Add to FlowExceptions:
"SB.2.1-4": "Forward only violation - cannot traverse backward",
```

**Tests:**
- Unit: Backward flow when forwardOnly=true → SB.2.1-4

---

## Cleanup

### X1: API layer spec documentation

**Problem:** API methods lack spec references (unlike sequencing code).

| Aspect | Details |
|--------|---------|
| Files | `src/BaseAPI.ts`, `src/Scorm12API.ts`, `src/Scorm2004API.ts`, `src/AICC.ts` |

**Pattern:**
```typescript
/**
 * Initialize - Begins a communication session with the LMS
 *
 * Per SCORM 2004 RTE Section 3.1.2.1:
 * - Parameter must be empty string ("")
 * - Returns "true" on success, "false" on failure
 * - Sets error 103 if already initialized
 * - Sets error 104 if already terminated
 *
 * @param {string} arg - Must be empty string
 * @return {string} "true" or "false"
 */
Initialize(arg: string = ""): string { ... }
```

**Scope:**
- Initialize, Terminate, GetValue, SetValue, Commit
- GetLastError, GetErrorString, GetDiagnostic
- Any undocumented public methods

---

### X2: CMI layer spec documentation

**Problem:** CMI classes and validation patterns lack spec references.

| Aspect | Details |
|--------|---------|
| Files | `src/cmi/scorm12/*.ts`, `src/cmi/scorm2004/*.ts`, `src/constants/regex.ts` |

**Pattern for classes:**
```typescript
/**
 * CMI Objectives array for SCORM 1.2
 *
 * Per SCORM 1.2 RTE Section 3.4.2.6:
 * - Array of objective records
 * - Each objective: id (write-only), score (r/w), status (r/w)
 * - Indices must be sequential starting at 0
 *
 * @extends CMIArray
 */
export class CMIObjectives extends CMIArray { ... }
```

**Pattern for regex:**
```typescript
/**
 * SCORM 1.2 Data Type Definitions
 * Per SCORM 1.2 RTE Appendix A
 */
export const scorm12_regex = {
  /** CMIString256 - Character string, max 255 chars (RTE A.1) */
  CMIString256: "^[\\s\\S]{0,255}$",
  // ...
};
```

**Final Verification:**
```bash
# Find files without spec references
grep -rL "Per SCORM\|RTE Section\|SN Book" src/cmi/ src/*.ts
```

---

## Dependency Graph

```
C1 (interactions write-only) ─────────────────────────────────┐
C2 (NB.2.1.x navigation) ─────────────────────────────────────┤
M1 (SB.2.10.x retry) ─────────────────────────────────────────┤
M2 (SB.2.4.x choice traversal) ───────────────────────────────┤
M3 (array index validation) ──────────────────────────────────┤
D1 (Initialize arg) ──────────────────────────────────────────┤
D2 (Terminate arg) ───────────────────────────────────────────┤──► X1, X2 (doc sweep)
D3 (Commit arg) ──────────────────────────────────────────────┤
D4 (GetErrorString) ──────────────────────────────────────────┤
D5 (TB.2.3.x termination) ────────────────────────────────────┤
N1 (CMIDecimal regex) ────────────────────────────────────────┤
N2 (logout warning) ──────────────────────────────────────────┤
N3 (SB.2.1-4 forward-only) ───────────────────────────────────┘

All items are independent except:
- X1, X2 run last (document whatever wasn't touched)
```

---

## Verification Checklist

After all items complete:

- [ ] All unit tests pass (`npm test`)
- [ ] All integration tests pass (`npm run test:integration`)
- [ ] Lint passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Exception code coverage improved (target: 90%+)
- [ ] Spec documentation coverage improved (target: 80%+)
- [ ] No regressions in existing functionality

---

## Estimated Effort

| Priority | Items | Complexity | Est. Time |
|----------|-------|------------|-----------|
| Critical | 2 | High (C2), Low (C1) | 4-6 hours |
| Major | 3 | Medium | 3-4 hours |
| Medium | 5 | Low-Medium | 3-4 hours |
| Minor | 3 | Low | 1-2 hours |
| Cleanup | 2 | Low-Medium | 2-3 hours |
| **Total** | **15** | | **13-19 hours** |

---

**Plan Status:** Ready for implementation
**Created:** 2024-12-13
**Source Analysis:** `docs/analysis/README.md`
