# Implementation Session Prompt

Copy and paste everything below the line into a new Claude Code session.

---

## Session: SCORM Gap Analysis Implementation

**Your role:** Orchestrator, code reviewer, and test runner. You do NOT write implementation code directly - you delegate to subagents.

**Implementation plan:** `docs/plans/2024-12-13-gap-analysis-implementation-plan.md`

**Gap analysis:** `docs/analysis/README.md`

### Workflow

For each work item (C1, C2, M1, etc.):

1. **Dispatch subagent** to implement the fix using the Task tool with a detailed prompt including:
   - The specific work item ID and description
   - Files to modify (from the plan)
   - Spec references
   - Expected implementation approach
   - Required tests (unit + integration where applicable)
   - Spec documentation to add to touched files

2. **Review the changes** when subagent completes:
   - Read the modified files
   - Verify implementation matches the plan
   - Check spec documentation was added
   - Look for any issues or oversights

3. **Run tests:**
   - `npm test` - unit tests
   - `npm run test:integration` - integration tests (for sequencing/navigation changes)
   - `npm run lint` - code quality

4. **Commit** if tests pass:
   ```
   fix(scope): description

   - Implements SPEC Section X.X.X requirement
   - Adds unit/integration tests
   - Adds spec documentation

   🤖 Generated with [Claude Code](https://claude.com/claude-code)

   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   ```

5. **Move to next item** or fix issues if tests fail

### Work Item Order

Execute in this order (severity-first):

**Critical:**
- C1: SCORM 1.2 interactions.n.objectives.n.id write-only
- C2: NB.2.1.x Navigation exceptions (13 codes)

**Major:**
- M1: SB.2.10.x Retry exceptions (3 codes)
- M2: SB.2.4.x Choice Traversal exceptions (3 codes)
- M3: Sequential array index validation

**Medium:**
- D1: Initialize argument validation
- D2: Terminate argument validation
- D3: Commit argument validation
- D4: GetErrorString("") verification
- D5: TB.2.3.x Termination exceptions (3 codes)

**Minor:**
- N1: CMIDecimal regex adjustment
- N2: cmi.exit="logout" deprecation warning
- N3: SB.2.1-4 Forward-only exception

**Cleanup:**
- X1: API layer spec documentation sweep
- X2: CMI layer spec documentation sweep

### Subagent Prompt Template

When dispatching implementation subagents, use this structure:

```
Implement work item [ID] from the SCORM gap analysis implementation plan.

**Task:** [Brief description]

**Files to modify:**
- [file1.ts]
- [file2.ts]

**Spec reference:** [SCORM X.X RTE Section Y.Y.Y]

**Implementation requirements:**
1. [Specific change 1]
2. [Specific change 2]
3. Add spec documentation to modified files using this pattern:
   /**
    * [Description]
    * Per [SPEC] Section [X.X.X]:
    * - [Key requirement]
    */

**Tests to add:**
- Unit: [test description]
- Integration: [test description] (if applicable)

**Error code:** [if applicable]

Read the implementation plan at docs/plans/2024-12-13-gap-analysis-implementation-plan.md for full details on this work item.
```

### Commands Reference

```bash
npm test                    # Run unit tests
npm run test:integration    # Run Playwright integration tests
npm run lint                # ESLint + Prettier check
npm run lint:fix            # Auto-fix lint issues
npm run build               # Verify build succeeds
```

### Starting Point

Begin by:
1. Reading the implementation plan: `docs/plans/2024-12-13-gap-analysis-implementation-plan.md`
2. Creating a TodoWrite list with all 15 work items
3. Starting with C1 (simplest critical item) - dispatch a subagent to implement it

Let's begin implementation.
