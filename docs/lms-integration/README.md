# LMS Integration Documentation

This directory contains comprehensive documentation for integrating the scorm-again library into a Learning Management System.

## Documents

### [Complete LMS Integration Guide](./lms-integration-guide.md)
The comprehensive guide covering all integration scenarios:
- Architecture overview
- Data model requirements (storage-agnostic)
- SCORM 1.2 single and multi-SCO integration
- SCORM 2004 single, multi-SCO, and sequenced integration
- Commit endpoint specification
- Error handling
- Session management
- Integration checklists

**Start here** if you're implementing SCORM support in your LMS for the first time.

### [Data Requirements Quick Reference](./data-requirements-quick-reference.md)
A condensed reference for quick lookups:
- What data to provide at launch (by version)
- What data to extract from commits
- Minimum storage schemas
- Entry mode decision flowchart
- Time format reference
- Commit object structure
- Common settings

**Use this** when you know the basics and need a quick reminder.

### [SCORM 1.2 Multi-SCO Guide](./scorm12-multi-sco-guide.md)
Detailed guide for multi-SCO SCORM 1.2 courses with helper utilities:
- State tracking utilities
- Sequencer implementation
- Rollup calculation
- Complete implementation examples

**Use this** when implementing multi-SCO support with the provided helper classes.

## Quick Start by Scenario

| Scenario | Start With |
|----------|------------|
| Single-SCO SCORM 1.2 | [Integration Guide - SCORM 1.2 Single-SCO](./lms-integration-guide.md#scorm-12-single-sco-launches) |
| Multi-SCO SCORM 1.2 | [SCORM 1.2 Multi-SCO Guide](./scorm12-multi-sco-guide.md) |
| Single-SCO SCORM 2004 | [Integration Guide - SCORM 2004 Single-SCO](./lms-integration-guide.md#scorm-2004-single-sco-launches) |
| Sequenced SCORM 2004 | [Integration Guide - Sequenced](./lms-integration-guide.md#scorm-2004-sequenced-modules) + [Sequencing Config](../sequencing_configuration.md) |

## Related Documentation

- [Sequencing Configuration](../sequencing_configuration.md) - SCORM 2004 sequencing setup
- [API Usage Examples](../api_usage/examples/) - Code examples
- [Offline Support](../offline_support.md) - Offline/mobile integration
- [Compliance Documentation](../compliance/) - Standard compliance details

## Integration Checklist Summary

### Minimum Viable SCORM 1.2 Integration
1. [ ] Parse imsmanifest.xml for course structure
2. [ ] Store course and SCO metadata
3. [ ] Create registration/enrollment records
4. [ ] Implement launch page with API initialization
5. [ ] Implement commit endpoint
6. [ ] Store learner progress (status, score, location, suspend_data)
7. [ ] Support resume (entry mode logic)

### Minimum Viable SCORM 2004 Integration
All of the above, plus:
1. [ ] Handle SCORM 2004 data model (larger fields, more elements)
2. [ ] Support completion_threshold auto-completion
3. [ ] Support scaled_passing_score auto-pass/fail
4. [ ] Handle objectives and interactions arrays

### Full SCORM 2004 Sequencing
All of the above, plus:
1. [ ] Parse sequencing rules from manifest
2. [ ] Configure sequencing in API
3. [ ] Handle global objectives
4. [ ] Implement activity delivery callbacks
5. [ ] Persist sequencing state
