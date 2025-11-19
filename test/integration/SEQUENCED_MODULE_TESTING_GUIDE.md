# Sequenced Module Testing Guide

This guide provides a structured approach for implementing comprehensive integration tests for SCORM 2004 sequenced modules. The goal is to test **specification compliance**, not just module behavior.

## Pre-Implementation Research Phase

### Step 1: Parse and Analyze the Manifest

Before writing any tests, thoroughly analyze the module's `imsmanifest.xml`:

1. **Extract Sequencing Strategy**:
   - Read the manifest comments (often contain strategy descriptions)
   - Identify the sequencing approach (forced sequential, choice, flow, etc.)
   - Document the expected learner experience

2. **Map the Activity Tree**:
   - List all activities (items) in order
   - Identify which are SCOs vs. containers
   - Note parent-child relationships
   - Document activity identifiers and titles

3. **Extract Sequencing Rules**:
   - **PreConditionRules**: What must be true before an activity can be accessed?
   - **PostConditionRules**: What happens after an activity is completed?
   - **ExitConditionRules**: When can an activity be exited?
   - **Rule Actions**: `disabled`, `skip`, `skipTo`, `stopForwardTraversal`, `hiddenFromChoice`, etc.

4. **Extract Sequencing Controls**:
   - `choice`: Can learner choose activities?
   - `choiceExit`: Can learner exit via choice?
   - `flow`: Is flow navigation enabled?
   - `forwardOnly`: Can learner only move forward?
   - `useCurrentAttemptObjectiveInfo`: Use current attempt data?
   - `useCurrentAttemptProgressInfo`: Use current attempt progress?

5. **Extract Rollup Rules**:
   - `objectiveMeasureWeight`: How much does this activity contribute to parent score?
   - `rollupRules`: How are completion/satisfaction rolled up?
   - `childActivitySet`: Which children are considered (`all`, `any`, `atLeastCount`, etc.)?
   - `rollupConditions`: What conditions trigger rollup?
   - `rollupAction`: What action is taken (`completed`, `satisfied`, `objectiveMeasureWeight`, etc.)?

6. **Extract Objectives**:
   - Primary objectives for each activity
   - Secondary objectives
   - `mapInfo`: Global objective mappings
   - `readSatisfiedStatus` / `writeSatisfiedStatus`
   - `minNormalizedMeasure`: Passing score thresholds

7. **Extract Sequencing Collections**:
   - Reusable sequencing rules referenced by `IDRef`
   - Common rollup rules
   - Shared sequencing controls

### Step 2: Research SCORM 2004 Sequencing Specification

For each sequencing feature found in the manifest, research the **SCORM 2004 Sequencing and Navigation (SN) Book**:

1. **Navigation Request Types**:
   - `start`, `resumeAll`, `continue`, `previous`, `choice`, `jump`, `exit`, `exitAll`, `abandon`, `abandonAll`, `suspendAll`
   - When each is valid/invalid
   - Expected behavior for each

2. **Sequencing Rules**:
   - **PreConditionRule**: Evaluated before activity delivery
     - Conditions: `satisfied`, `objectiveStatusKnown`, `objectiveMeasureKnown`, `completed`, `activityProgressKnown`, `attempted`, `attemptLimitExceeded`, `timeLimitExceeded`, `outsideAvailableTimeRange`, `always`
     - Operators: `noOp`, `not`
     - Actions: `disabled`, `skip`, `skipTo`, `stopForwardTraversal`, `hiddenFromChoice`, `stopForwardTraversal`
   - **PostConditionRule**: Evaluated after activity completion
     - Same conditions/operators
     - Actions: `exit`, `exitAll`, `retry`, `retryAll`, `continue`, `previous`, `jump`
   - **ExitConditionRule**: Evaluated when exiting activity
     - Same conditions/operators
     - Actions: `exit`, `exitAll`, `retry`, `retryAll`, `continue`, `previous`, `jump`

3. **Rollup Rules**:
   - **Completion Rollup**: How `cmi.completion_status` is determined for parent activities
   - **Satisfaction Rollup**: How `cmi.success_status` is determined for parent activities
   - **Measure Rollup**: How scores are rolled up (weighted average, etc.)
   - **Rollup Considerations**: `requiredForSatisfied`, `requiredForNotSatisfied`, `requiredForCompleted`, `requiredForIncomplete`, `measureSatisfactionIfActive`

4. **Navigation Validity**:
   - `adl.nav.request_valid.continue`: When can learner continue?
   - `adl.nav.request_valid.previous`: When can learner go back?
   - `adl.nav.request_valid.choice.{target=activityId}`: When can learner choose a specific activity?
   - `adl.nav.request_valid.jump.{target=activityId}`: When can learner jump to a specific activity?

5. **Objective Tracking**:
   - Global objectives vs. local objectives
   - `mapInfo` for reading/writing objective status across activities
   - Objective satisfaction criteria
   - `minNormalizedMeasure` for passing scores

### Step 3: Launch Module and Observe Behavior

**IMPORTANT**: Observe the module's behavior, but **DO NOT** assume it's correct. Compare observed behavior to specification requirements.

1. **Launch the Module**:
   - Use browser tools to launch the module
   - Navigate through the module manually
   - Note what happens at each step

2. **Document Observed Behavior**:
   - Which activities are accessible initially?
   - What happens when you try to skip ahead?
   - Can you navigate backward?
   - When do objectives get satisfied?
   - How does completion status change?
   - What happens with scores?

3. **Compare to Specification**:
   - For each observed behavior, check: "Is this what the SCORM 2004 specification says should happen?"
   - If behavior differs from spec, note it as a potential bug (either in the module or in scorm-again)
   - **Test to the specification, not to the observed behavior**

### Step 4: Build Activity Tree Configuration

Based on manifest analysis, construct the activity tree configuration:

```typescript
const ACTIVITY_TREE = {
  id: "organization_id",
  title: "Organization Title",
  children: [
    {
      id: "activity_1_id",
      title: "Activity 1 Title",
      identifierref: "resource_1_id",
      objectives: [
        {
          objectiveID: "objective_id",
          isPrimary: true,
          mapInfo: [
            {
              targetObjectiveID: "global_objective_id",
              readSatisfiedStatus: true,
              writeSatisfiedStatus: true,
            },
          ],
        },
      ],
      sequencingRules: {
        preConditionRules: [
          {
            action: "disabled",
            conditionCombination: "any",
            conditions: [
              {
                condition: "satisfied",
                operator: "not",
                referencedObjective: "prerequisite_objective_id",
              },
            ],
          },
        ],
      },
      rollupRules: {
        objectiveMeasureWeight: 0.25,
        rollupRules: [
          {
            childActivitySet: "all",
            conditionCombination: "all",
            conditions: [
              {
                condition: "completed",
              },
            ],
            action: "completed",
          },
        ],
      },
    },
    // ... more activities
  ],
};
```

### Step 5: Write Specification-Based Tests

For each sequencing feature, write tests that verify **specification compliance**:

#### Test Template Structure

```typescript
test.describe(`ModuleName SCORM 2004 Integration (${wrapper.name})`, () => {
  // Compose universal test suites
  scormCommonApiTests(wrapper, moduleConfig);
  scorm2004DataModelTests(wrapper, moduleConfig);
  scorm2004NavigationTests(wrapper, { ...moduleConfig, hasSequencing: true });
  scorm2004InteractionsObjectivesTests(wrapper, moduleConfig);

  // Module-specific sequencing tests

  test("should enforce [SPECIFIC SEQUENCING RULE] per SCORM 2004 SN Book", async ({ page }) => {
    // 1. Setup: Configure sequencing with activity tree
    // 2. Action: Perform the action that should trigger the rule
    // 3. Assert: Verify behavior matches SCORM 2004 specification
    //    - Reference specific section of SN Book if applicable
  });

  test("should handle [NAVIGATION TYPE] navigation correctly per specification", async ({ page }) => {
    // Test navigation validity and behavior per SCORM 2004 spec
  });

  test("should rollup [COMPLETION/SATISFACTION/SCORE] correctly per rollup rules", async ({ page }) => {
    // Test rollup behavior matches manifest-defined rules
  });
});
```

#### Required Test Categories

1. **Sequencing Rules Tests**:
   - PreConditionRule enforcement (disabled, skip, etc.)
   - PostConditionRule enforcement (exit, retry, etc.)
   - ExitConditionRule enforcement
   - Rule condition evaluation (satisfied, completed, etc.)

2. **Navigation Tests**:
   - Navigation validity (`adl.nav.request_valid.*`)
   - Navigation request processing
   - Activity delivery
   - Current activity tracking

3. **Objective Tests**:
   - Global objective tracking
   - Objective satisfaction
   - Objective measure rollup
   - `mapInfo` read/write behavior

4. **Rollup Tests**:
   - Completion rollup (all activities must be completed)
   - Satisfaction rollup (all activities must be satisfied)
   - Score rollup (weighted average, etc.)
   - Rollup considerations

5. **Sequencing Controls Tests**:
   - Choice navigation (if enabled)
   - Flow navigation (if enabled)
   - Forward-only navigation (if enabled)

### Step 6: Reference SCORM 2004 Specification

For each test, document the specification reference:

```typescript
/**
 * Test: PreConditionRule with "disabled" action
 *
 * Specification: SCORM 2004 Sequencing and Navigation (SN) Book
 * - Section: PreConditionRule (SB.2.3)
 * - Rule Action: "disabled" (SB.2.3.1)
 * - Expected Behavior: Activity is visible but not accessible via choice or flow
 *
 * Manifest Analysis:
 * - Activity "etiquette_item" has preConditionRule checking if "playing_item" is satisfied
 * - If not satisfied, action="disabled" should prevent access
 */
test("should enforce preConditionRule disabled action per SCORM 2004 SN Book SB.2.3", async ({ page }) => {
  // Test implementation
});
```

### Step 7: Verify Implementation

Before considering tests complete:

1. **Run All Tests**: Ensure all tests pass across all browsers
2. **Check Specification Compliance**: Verify each test actually tests spec requirements
3. **Document Edge Cases**: Note any specification ambiguities or implementation differences
4. **Review Test Coverage**: Ensure all sequencing features from manifest are tested

## Common Pitfalls to Avoid

1. **Don't test to observed behavior**: If a module behaves incorrectly, test to the spec, not the bug
2. **Don't assume navigation validity updates immediately**: May need to process navigation requests
3. **Don't skip rollup testing**: Rollup rules are critical for completion/satisfaction
4. **Don't ignore sequencing collections**: Reusable rules must be properly configured
5. **Don't forget global objectives**: `mapInfo` is essential for cross-activity objective tracking

## Resources

- SCORM 2004 Sequencing and Navigation (SN) Book
- SCORM 2004 Run-Time Environment (RTE) Book
- SCORM 2004 Content Aggregation Model (CAM) Book
- Module manifest comments (often contain strategy descriptions)
- Existing test files for reference patterns

## Example: SequencingForcedSequential Analysis

See `test/integration/SequencingForcedSequential_SCORM20043rdEdition.spec.ts` for a complete example of:
- Manifest analysis
- Activity tree construction
- Specification-based testing
- Sequencing rule verification
- Navigation validity testing
- Objective tracking
- Rollup verification

## Quick Reference: SCORM 2004 Sequencing Key Concepts

### Navigation Validity States
- `"true"`: Navigation is valid and allowed
- `"false"`: Navigation is invalid and not allowed
- `"unknown"`: Navigation validity has not been determined yet

### Sequencing Rule Actions
- `disabled`: Activity is visible but not accessible
- `skip`: Activity is skipped during forward traversal
- `skipTo`: Skip to a specific activity
- `stopForwardTraversal`: Stop forward navigation
- `hiddenFromChoice`: Hide from choice navigation
- `exit`: Exit current activity
- `exitAll`: Exit all activities
- `retry`: Retry current activity
- `retryAll`: Retry all activities
- `continue`: Continue to next activity
- `previous`: Go to previous activity
- `jump`: Jump to specific activity

### Completion Status Values
- `"unknown"`: Status not determined
- `"not attempted"`: Activity not started
- `"incomplete"`: Activity started but not finished
- `"completed"`: Activity finished

### Success Status Values
- `"unknown"`: Status not determined
- `"passed"`: Activity passed (met passing score)
- `"failed"`: Activity failed (did not meet passing score)

### Objective Satisfaction
- Objectives are satisfied when `cmi.objectives.n.success_status` = `"passed"`
- Global objectives use `mapInfo` to read/write across activities
- `minNormalizedMeasure` defines the passing threshold (0.0 to 1.0)

### Rollup Child Activity Sets
- `all`: All child activities
- `any`: Any child activity
- `atLeastCount`: At least N child activities
- `allChildren`: All direct children only

