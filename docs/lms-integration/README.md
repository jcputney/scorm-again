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
- Error handling and error codes reference
- Session management
- Offline support overview
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
- **Complete settings reference**
- **Interaction response formats**
- **Field size limits**

**Use this** when you know the basics and need a quick reminder.

### [API Events Reference](./api-events-reference.md)
Complete reference for the event system:
- Registering and removing listeners
- Wildcard and element-specific patterns
- Core API events (Initialize, Terminate, GetValue, SetValue, Commit)
- Offline events (OfflineDataSynced, OfflineDataSyncFailed)
- Navigation events (SequenceNext, SequencePrevious)
- All 25+ sequencing events with payloads

**Use this** when implementing event-driven integrations or debugging.

### [Cross-Frame Communication Guide](./cross-frame-communication.md)
Guide for sandboxed iframe architectures:
- When to use cross-frame communication
- CrossFrameLMS (parent frame) setup
- CrossFrameAPI (child frame) setup
- Security considerations
- Complete working examples
- Troubleshooting

**Use this** when running SCORM content in isolated/sandboxed iframes.

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
| Sandboxed Iframes | [Cross-Frame Communication Guide](./cross-frame-communication.md) |
| Event-Driven Integration | [API Events Reference](./api-events-reference.md) |
| Offline/Mobile | [Integration Guide - Offline](./lms-integration-guide.md#offline-support-overview) + [Offline Support](../offline_support.md) |

## Related Documentation

- [Sequencing Configuration](../sequencing_configuration.md) - SCORM 2004 sequencing setup
- [API Usage Examples](../api_usage/examples/) - Code examples
- [Offline Support](../offline_support.md) - Offline/mobile integration
- [Compliance Documentation](../compliance/) - Standard compliance details
- [SCORM Specifications](../specifications/) - Detailed spec references

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

### Event-Driven Integration
1. [ ] Register listeners for status changes
2. [ ] Handle navigation events (SequenceNext, SequencePrevious)
3. [ ] Implement cleanup on unload
4. [ ] See [API Events Reference](./api-events-reference.md)

### Cross-Frame Integration
1. [ ] Set up CrossFrameLMS in parent frame
2. [ ] Configure CrossFrameAPI in content frame
3. [ ] Validate origins for security
4. [ ] See [Cross-Frame Communication Guide](./cross-frame-communication.md)
