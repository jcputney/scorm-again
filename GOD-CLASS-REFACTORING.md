# God Class Refactoring Plan - Sequencing Module

## Problem Statement

The SCORM 2004 sequencing implementation has several "god classes" that are too large, have too many responsibilities, and contain significant code duplication. This makes the code:

1. **Hard to test** - Coverage is stuck at ~70% because duplicate code paths mean tests hit one implementation but miss the copy
2. **Hard to maintain** - Changes require updating multiple places
3. **Hard to understand** - 3000+ line files with 60-119 methods each

## The God Classes

| File | Lines | Methods | Coverage | Problem |
|------|-------|---------|----------|---------|
| `overall_sequencing_process.ts` | 3,733 | 119 | 83% | Orchestrates everything, duplicates validation |
| `sequencing_process.ts` | 3,036 | 63 | 70% | Duplicated constraint validation logic |
| `Scorm2004API.ts` | 3,253 | 65 | 86% | API + business logic mixed |
| `activity.ts` | 2,222 | ~60 | 95% | Data + behavior + validation mixed |
| `rollup_process.ts` | 1,718 | 41 | 83% | Large but more focused |
| `BaseAPI.ts` | 1,915 | 20 | 92% | Acceptable size for base class |

## Specific Issues in `sequencing_process.ts`

### Issue 1: Duplicated Constraint Validation (21 occurrences)

The same `constrainChoice`, `forwardOnly`, and `preventActivation` checks appear in multiple places:

```
Lines 569-578:  choiceSequencingRequestProcess() - constrainChoice backward check
Lines 2932-2937: validateConstraintsAtAncestorLevel() - SAME CHECK, different path
```

Tests hit lines 569-578 and pass, but lines 2932-2937 remain uncovered because they're duplicate code reached via `getAvailableChoices()`.

### Issue 2: Five Methods Doing the Same Thing

All of these validate choice constraints with slight variations:

- `validateChoicePathConstraints()` - 82 lines
- `validateConstraintsAtAncestorLevel()` - 81 lines
- `validateConstrainChoiceForFlow()` - 83 lines
- `evaluateConstrainChoiceForTraversal()` - 74 lines
- `checkConstrainedChoiceBoundary()` - 111 lines

**Total: 431 lines of overlapping validation logic**

### Issue 3: Methods Too Long

- `evaluateRuleConditions()` - 237 lines
- `choiceSequencingRequestProcess()` - 200 lines
- `flowTreeTraversalSubprocess()` - 129 lines
- `checkConstrainedChoiceBoundary()` - 111 lines

## Proposed Refactoring Strategy

### Phase 1: Extract Constraint Validators

Create a single `ChoiceConstraintValidator` class that handles ALL constraint validation:

```typescript
// New file: src/cmi/scorm2004/sequencing/validators/choice_constraint_validator.ts
export class ChoiceConstraintValidator {
  validateConstrainChoice(ancestor: Activity, current: Activity, target: Activity): ValidationResult
  validateForwardOnly(ancestor: Activity, current: Activity, target: Activity): ValidationResult
  validatePreventActivation(ancestor: Activity, target: Activity): ValidationResult
  validateAllAncestorConstraints(current: Activity, target: Activity): ValidationResult
}
```

This eliminates the 5 duplicate methods and 21 scattered constraint checks.

### Phase 2: Extract Request Handlers

Break `sequencing_process.ts` into focused request handlers:

```
src/cmi/scorm2004/sequencing/
├── sequencing_process.ts          # Coordinator only (~500 lines)
├── handlers/
│   ├── choice_request_handler.ts  # All choice logic
│   ├── flow_request_handler.ts    # Continue/Previous
│   ├── exit_request_handler.ts    # Exit/ExitAll/Abandon
│   └── retry_request_handler.ts   # Retry/RetryAll
├── validators/
│   ├── choice_constraint_validator.ts
│   └── navigation_validator.ts
└── traversal/
    ├── flow_traversal.ts
    └── choice_traversal.ts
```

### Phase 3: Simplify `overall_sequencing_process.ts`

This 3,733-line file orchestrates the sequencing loop. Extract:

- Termination logic → `termination_handler.ts`
- Delivery logic → `delivery_handler.ts`
- Navigation validity → `navigation_validity_service.ts`

### Phase 4: Refactor Tests Around New Structure

Current tests exercise the god classes through high-level entry points. After refactoring:

1. **Unit tests** for each extracted class (validators, handlers, traversal)
2. **Integration tests** for the coordinator classes
3. **Remove duplicate test scenarios** that exist only because code was duplicated

## Success Criteria

1. No source file > 800 lines
2. No class > 30 methods
3. Zero duplicated validation logic
4. Coverage > 85% on all sequencing files
5. All existing tests still pass

## Files to Read First

Before planning, read these to understand the current structure:

1. `/src/cmi/scorm2004/sequencing/sequencing_process.ts` - Lines 440-600 (choice handling)
2. `/src/cmi/scorm2004/sequencing/sequencing_process.ts` - Lines 2800-2950 (duplicate validation)
3. `/src/cmi/scorm2004/sequencing/overall_sequencing_process.ts` - Lines 1-200 (main loop)
4. `/test/cmi/scorm2004/sequencing/sequencing_process.spec.ts` - Understand test patterns

## Constraints

- Must maintain SCORM 2004 4th Edition compliance
- Must not break existing public API (`Scorm2004API`)
- Must maintain backward compatibility with existing LMS integrations
- Incremental refactoring preferred (one extraction at a time, tests passing between each)

## Questions to Answer During Planning

1. Which extraction provides the most value with least risk?
2. Can we refactor incrementally or does it need to be all-at-once?
3. Are there hidden dependencies between the duplicate code paths?
4. Should we add integration tests before refactoring as a safety net?
