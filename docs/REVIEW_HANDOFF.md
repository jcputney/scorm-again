# Code Review Handoff Prompt

Copy this entire prompt to start a new Claude Code session to continue the review:

---

## Context

I'm conducting a comprehensive pre-3.0.0 code review of the scorm-again library using parallel subagents. Each agent reviews ≤250 lines of code for:
- Spec inaccuracies (SCORM 1.2, SCORM 2004)
- Bugs
- Dead code
- Complexity
- Stale comments
- Missing spec references
- Untested code
- Security issues

**If code has a comment explaining why it deviates from spec, skip spec validation for that code.**

## Progress So Far

### Completed
- [x] Pre-flight checks (all tests pass, lint clean, tsc clean)
- [x] Wave 1: Core APIs (25 agents) - **COMPLETE**
  - Results saved to: `docs/review-results/WAVE1-CORE-APIS-SUMMARY.md`
  - **1 CRITICAL** (Function() constructor security issue), 9 HIGH, 36 MEDIUM, 68 LOW
  - Key issues: Function() security vulnerability (line 1359), console.log debug statements, dead {target=} code

### Wave 2 In Progress (retrieve with TaskOutput)

All 53 Wave 2 agents have been launched. Use TaskOutput to retrieve results:

#### overall_sequencing_process.ts (15 agents)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| a6d8fa4 | 1-276 | processNavigationRequest |
| afc9436 | 277-509 | navigationRequestProcess (SB.2.1) |
| acf31f2 | 510-757 | terminationRequestProcess (SB.2.2) |
| a4182eb | 758-998 | handleExitTermination |
| ac06483 | 999-1241 | handleExitAllTermination |
| a926825 | 1242-1490 | sequencingRequestProcess (SB.2.3) |
| a9b5271 | 1491-1739 | deliveryRequestProcess (SB.2.4) |
| a539d3b | 1740-1979 | contentDeliveryEnvironment (DB.2) |
| a39b805 | 1980-2229 | Activity state initialization |
| a34ebfb | 2230-2469 | Objective initialization |
| a44de0c | 2470-2711 | End attempt process |
| a56ecda | 2712-2959 | Rollup invocation |
| a909fc9 | 2960-3203 | Limit conditions check |
| a0ad0eb | 3204-3453 | Suspended activity handling |
| ab4f4e3 | 3454-3727 | Activity tree consistency |

#### sequencing_process.ts (12 agents)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| ab37d23 | 1-300 | Class definition |
| a7ea864 | 301-549 | Start sequencing (SB.2.5) |
| a0ff65d | 550-794 | Resume all (SB.2.6) |
| a443059 | 795-1038 | Continue (SB.2.7) |
| ae6f108 | 1039-1288 | Previous (SB.2.8) |
| ad6409e | 1289-1537 | Choice Part 1 (SB.2.9) |
| a7f9e5c | 1538-1785 | Choice Part 2 (SB.2.9) |
| a422db2 | 1786-2024 | Retry (SB.2.10) |
| acab9bc | 2025-2273 | Exit (SB.2.11) |
| a13ff2a | 2274-2516 | Flow subprocess (SB.2.3) |
| a6fcde8 | 2517-2749 | Choice traversal (SB.2.4) |
| aecd07d | 2750-3006 | Flow traversal (SB.2.2) |

#### rollup_process.ts (7 agents)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| ac611cd | 1-260 | Overall rollup (RB.1.5) |
| afa7a50 | 261-507 | Measure rollup (RB.1.1) |
| a685cc0 | 508-755 | Objective rollup (RB.1.2) |
| abb8f59 | 756-1001 | Activity progress (RB.1.3) |
| ae15210 | 1002-1251 | Rollup rule check (RB.1.4) |
| af0ecef | 1252-1497 | Check child for rollup |
| a487668 | 1498-1707 | Rollup action evaluation |

#### rollup_rules.ts (2 agents)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| af7853f | 1-250 | Rollup rule classes |
| ae48684 | 251-598 | Rollup condition evaluation |

#### sequencing_rules.ts (2 agents)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| a6af04a | 1-250 | Sequencing rule classes |
| ae0e0bf | 251-672 | Sequencing condition evaluation |

#### sequencing_controls.ts (1 agent)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| a4178fb | 1-527 | Sequencing control modes |

#### activity.ts (9 agents)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| abc46dc | 1-250 | Activity class definition |
| ab0be29 | 251-500 | Activity objective management |
| a18d38d | 501-750 | Activity state management |
| ac8a1e3 | 751-1000 | Activity tracking data |
| a9a85bc | 1001-1250 | Activity child management |
| a562bc1 | 1251-1500 | Activity navigation state |
| a1e512f | 1501-1750 | Activity limit conditions |
| a3fcb9d | 1751-2000 | Activity serialization |
| a468f2c | 2001-2222 | Activity deserialization |

#### activity_tree.ts (1 agent)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| acccee8 | 1-356 | ActivityTree class |

#### navigation_look_ahead.ts (2 agents)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| af07871 | 1-250 | Navigation UI state |
| a0ec4b6 | 251-477 | Choice activity visibility |

#### selection_randomization.ts (1 agent)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| abbd9a5 | 1-236 | Selection and randomization |

#### sequencing.ts (1 agent)
| Agent ID | Lines | Focus |
|----------|-------|-------|
| a82a640 | 1-271 | Sequencing class |

### Remaining Waves
- Wave 3: SCORM 2004 CMI (23 agents) - `cmi/scorm2004/*.ts`
- Wave 4: SCORM 1.2 + Common CMI (15 agents) - `cmi/scorm12/*.ts`, `cmi/common/*.ts`
- Wave 5: Services (17 agents) - `services/*.ts`
- Wave 6: Cross-Frame, Utils, Constants (25 agents)
- Wave 7: Types, Interfaces, ESM (16 agents)
- Wave 8: Cross-Cutting Analysis (5 agents)
- Wave 9: Consolidation

## Key Files

- **Review Plan**: `docs/plans/2025-12-21-comprehensive-code-review.md`
- **Wave 1 Results**: `docs/review-results/WAVE1-CORE-APIS-SUMMARY.md`
- **BaseAPI Results**: `docs/review-results/BASEAPI-SUMMARY.md`
- **Results Directory**: `docs/review-results/`

## How to Continue

1. **Retrieve Wave 2 agent results** using TaskOutput for the agent IDs listed above
2. **Save Wave 2 results** to `docs/review-results/WAVE2-SEQUENCING-SUMMARY.md`
3. **Continue with Wave 3**: Launch SCORM 2004 CMI agents per the plan

## Agent Prompt Template

```
You are code review agent [AGENT_ID] for scorm-again 3.0.0 release.

**Assignment:** [FILE_PATH] lines [START]-[END]
**Focus:** [SPECIFIC_FOCUS]

**Checklist:**
1. SPEC COMPLIANCE - [SPEC_REF]. Skip if comment explains deviation.
2. BUGS - Logic errors, null/undefined, edge cases
3. DEAD CODE - Unused functions, unreachable branches
4. COMPLEXITY - Functions >50 lines
5. STALE COMMENTS - Comments that don't match code
6. MISSING SPEC REFS - Complex logic without citations
7. UNTESTED CODE - Cross-ref with [TEST_FILES]
8. SECURITY - eval(), prototype pollution

Output JSON only:
{"agent_id": "[ID]", "file": "[PATH]", "lines": "[RANGE]", "findings": [...], "summary": {"critical": 0, "high": 0, "medium": 0, "low": 0, "lines_reviewed": N}}
```

## Commands

```bash
# Check test status
npm test

# Run lint
npm run lint

# Save results
cat > docs/review-results/[AGENT-ID].json << 'EOF'
{JSON_OUTPUT}
EOF
```

## Important Notes

1. Use `subagent_type="superpowers:code-reviewer"` for Task tool
2. Launch agents in batches to avoid overwhelming the system
3. Save results incrementally to `docs/review-results/`
4. Critical findings should be documented in `docs/CRITICAL_BLOCKERS.md`
5. Stop before context compaction and create a new handoff prompt

---

**Start by retrieving all Wave 2 agent results using TaskOutput, then continue with Wave 3.**
