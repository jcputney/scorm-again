# Prompt Template for Sequenced Module Testing

Use this prompt when starting work on a new sequenced SCORM 2004 module:

---

## Prompt

I need to implement comprehensive integration tests for the `[MODULE_NAME]` SCORM 2004 sequenced module located at `test/integration/modules/[MODULE_NAME]/`.

**CRITICAL REQUIREMENT**: Test to the **SCORM 2004 Sequencing and Navigation (SN) Book specification**, NOT to observed module behavior. If the module behaves incorrectly, test to the spec, not the bug.

### Phase 1: Research and Analysis

1. **Parse and analyze the manifest** (`imsmanifest.xml`):
   - Extract sequencing strategy (read manifest comments for descriptions)
   - Map the complete activity tree (all activities, parent-child relationships)
   - Extract ALL sequencing rules:
     - PreConditionRules (conditions, operators, actions)
     - PostConditionRules (conditions, operators, actions)
     - ExitConditionRules (conditions, operators, actions)
   - Extract sequencing controls (choice, flow, forwardOnly, etc.)
   - Extract rollup rules (completion, satisfaction, measure rollup)
   - Extract objectives (primary, secondary, mapInfo, minNormalizedMeasure)
   - Extract sequencing collections (reusable rules)

2. **Research SCORM 2004 Sequencing Specification**:
   - For each sequencing feature found, reference the SCORM 2004 SN Book
   - Document expected behavior per specification
   - Note specification section references (e.g., "SB.2.3" for PreConditionRule)

3. **Launch and observe the module** (for understanding only):
   - Launch the module in a browser
   - Navigate through it manually
   - Document observed behavior
   - **BUT**: Compare observed behavior to specification - if it differs, test to the spec, not the observation

### Phase 2: Implementation

4. **Build the activity tree configuration**:
   - Create `ACTIVITY_TREE` constant matching the manifest structure
   - Include all activities, objectives, sequencing rules, and rollup rules
   - Reference `test/integration/SequencingForcedSequential_SCORM20043rdEdition.spec.ts` for structure

5. **Write specification-based tests**:
   - Compose universal test suites (scormCommonApiTests, scorm2004DataModelTests, etc.)
   - Write module-specific tests for:
     - Sequencing rules enforcement (per SCORM 2004 SN Book)
     - Navigation validity and behavior (per specification)
     - Objective tracking (global objectives, mapInfo, satisfaction)
     - Rollup behavior (completion, satisfaction, score per rollup rules)
     - Sequencing controls (choice, flow, etc. if enabled)
   - For each test, include JSDoc comments referencing:
     - SCORM 2004 SN Book section
     - Manifest analysis findings
     - Expected behavior per specification

6. **Verify implementation**:
   - All tests must pass across all browsers
   - Each test must verify specification compliance, not just module behavior
   - Document any specification ambiguities or implementation differences

### Reference Files

- Guide: `test/integration/SEQUENCED_MODULE_TESTING_GUIDE.md`
- Example: `test/integration/SequencingForcedSequential_SCORM20043rdEdition.spec.ts`
- Helpers: `test/integration/helpers/scorm2004-helpers.ts`
- Suites: `test/integration/suites/scorm2004-*.ts`

### Key Principles

- **Test to specification, not observation**: If module behavior differs from spec, test what the spec says should happen
- **Document specification references**: Each test should reference the relevant SCORM 2004 SN Book section
- **Cover all sequencing features**: Every sequencing rule, control, and rollup rule from the manifest must be tested
- **Verify navigation validity**: Test `adl.nav.request_valid.*` states per specification
- **Test rollup behavior**: Verify completion, satisfaction, and score rollup match manifest-defined rules

---

## Example Usage

Replace `[MODULE_NAME]` with the actual module name, e.g.:

"I need to implement comprehensive integration tests for the `SequencingChoice_SCORM20043rdEdition` SCORM 2004 sequenced module located at `test/integration/modules/SequencingChoice_SCORM20043rdEdition/`..."


