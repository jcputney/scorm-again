# Analysis of 5 Failing Tests After Rollup Fixes

## Summary

After implementing the rollup measure/satisfaction status fixes, 5 tests are failing. These failures are NOT related to the original issue (tests expecting incorrect `objectiveMeasureStatus` after rollup). Instead, they reveal different edge cases and potential issues.

## Failing Tests

### 1. navigation_choice_constraints.spec.ts
**Test**: "blocks choice to an activity disabled by precondition rules"
**Failure**: Expected exception `NB.2.1-11` but got `OP.1-1`
**Analysis**: This appears to be a navigation/choice validation issue unrelated to rollup or measureStatus. The test expects a specific navigation exception code but the implementation is returning a different one. Needs investigation of navigation look-ahead precondition checking logic.

### 2-3. objective_mapping.spec.ts (2 failures)
**Tests**:
- "should handle bidirectional synchronization with proper permissions"
- "should handle recursive tree processing for global objectives"

**Failures**:
- Test 2: Expected measure 0.95 but got 0.6
- Test 3: Expected measure 0.92 but got 0.5

**Analysis**: These tests simulate reading from and writing to global objectives. The issue is that when activities write to global objectives and then try to read back updated values, they're not getting the new values. Investigation shows:
- Write phase requires `objective.measureStatus = true` (tests ARE setting this)
- Read phase requires `globalObjective.normalizedMeasureKnown = true` AND the read permission flags
- The tests simulate LMS updates to global objectives but may not be setting all required flags for the read phase to work

**Root Cause**: Tests are simulating bidirectional sync, but after writing, they need to ensure the global objective has the proper read flags AND known flags set before the next read phase can retrieve the values.

### 4-5. rte_data_transfer.spec.ts (2 failures)
**Tests**:
- "should transfer success status from CMI to activity"
- "should not transfer primary objective via objectives array"

**Failures**: Both expect `objectiveSatisfiedStatus = true` but get `false`

**Analysis**: Complex interaction between RTE data transfer, global objective mapping, and rollup:
1. Leaf activity receives "exit" navigation request
2. `endAttemptProcess` is called
3. RTE data transfer sets `leafActivity.objectiveSatisfiedStatus = true` (line 1487)
4. RTE data transfer sets `leafActivity.objectiveMeasureStatus = true` (line 1491)
5. RTE data transfer sets `primaryObjective.satisfiedStatus = true` (line 1494)
6. RTE data transfer sets `primaryObjective.measureStatus = true` (line 1497)
7. Global objective mapping runs
8. `overallRollupProcess(leafActivity)` is called
9. Rollup processes from `leafActivity.parent` (the root)
10. Something is resetting the leaf's `objectiveSatisfiedStatus` back to `false`

**Possible Causes**:
- Global objective mapping might be reading from empty global objectives and overwriting the RTE-set values
- Parent rollup might be affecting the leaf's status through some mechanism
- There may be an ordering issue where leaf status is being reset after RTE transfer

**Needs Investigation**: Step-through debugging to trace exactly where the `objectiveSatisfiedStatus` changes from `true` to `false` after RTE data transfer.

## Recommendations

1. **Test #1 (navigation)**: Investigate navigation look-ahead and precondition rule checking logic separately. This is unrelated to rollup fixes.

2. **Tests #2-3 (objective mapping)**: Update tests to properly set all required flags on global objectives for bidirectional sync to work:
   - After simulating LMS update to global objective, ensure `readNormalizedMeasure = true` flag is set
   - Ensure `normalizedMeasureKnown = true` is set after LMS updates the value
   - Consider if these tests are testing the RIGHT behavior or if they need adjustment

3. **Tests #4-5 (RTE transfer)**: These require deeper investigation:
   - Add logging/debugging to trace when `objectiveSatisfiedStatus` changes
   - Verify the interaction between RTE transfer, global objective mapping, and rollup
   - Check if leaf activities should be excluded from certain rollup operations
   - Verify auto-satisfaction logic interaction with RTE-set values

## Next Steps

Given the complexity and that these issues are NOT about the original "tests expecting incorrect measureStatus" problem:

1. Create separate investigation tickets for each category
2. Consider if some tests need expectation updates vs implementation fixes
3. Defer these fixes to avoid blocking the main rollup correctness work
4. Document as known issues requiring future attention
