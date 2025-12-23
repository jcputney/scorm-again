---
sidebar_position: 1
title: "Introduction"
description: "Overview of scorm-again: a modern, fully-tested JavaScript runtime for SCORM 1.2 and SCORM 2004"
---

# Introduction

scorm-again is a modern, fully-tested JavaScript runtime for SCORM 1.2 and SCORM 2004. It provides a stable, tested platform for running SCORM modules in your LMS or e-learning application.

## What is scorm-again?

scorm-again is a JavaScript library that implements the SCORM API specifications, allowing SCORM content to communicate with your Learning Management System (LMS). It handles all the complexity of SCORM compliance, validation, and data management so you can focus on building your LMS features.

The library is designed to be LMS-agnostic and can run without a backing LMS, logging all function calls and data instead of committing if an LMS endpoint is not configured.

## Key Features

### SCORM-Compliant Synchronous Commits
Commits now block and return actual LMS success/failure responses, ensuring SCORM compliance and preventing data loss. This is the proper way to implement SCORM commits according to the specification.

### SCORM 2004 Sequencing
Complete implementation of SCORM 2004 sequencing and navigation, including:
- All navigation request types (start, continue, previous, choice, jump, exit, suspend, etc.)
- Complete activity tree management with hierarchical activities
- Pre-condition, post-condition, and exit sequencing rules
- Rollup rules for status propagation
- Time-based sequencing and navigation request validation

### Cross-Frame Communication
Run SCORM content in sandboxed iframes while maintaining communication with the SCORM API in the parent frame. This feature provides:
- Secure isolation of SCORM content
- Support for cross-origin iframe communication
- Synchronous API behavior with asynchronous cache updates
- Compatibility with modern browsers and IE11

### Offline Support
Store and synchronize SCORM data when offline, perfect for mobile applications and remote learning scenarios:
- Automatic local storage when offline
- Synchronization when connectivity is restored
- Works across multiple platforms and devices

### Improved Validation
Stricter SCORM specification compliance with better error messages to help content developers identify and fix issues quickly.

### Event System
Comprehensive event listeners for tracking all API interactions, making it easy to build custom UI and monitoring solutions.

### Multiple Data Formats
Support for JSON, flattened, and parameter-based data commit formats to accommodate different LMS architectures.

## What scorm-again is NOT

It's important to understand what scorm-again does not provide:

1. **This is not an LMS** - scorm-again is a runtime library for SCORM APIs. You'll need to build or use an existing LMS to manage courses, users, and learning records.

2. **This does not handle SCORM package uploads** - scorm-again does not parse, validate, or extract SCORM packages. You'll need separate tools to handle package uploads and manifest parsing. (For Java-based manifest parsing, see [jcputney/elearning-module-parser](https://github.com/jcputney/elearning-module-parser))

3. **This is not a content authoring tool** - scorm-again provides the runtime environment for SCORM content, but does not create SCORM content.

## Target Audience

scorm-again is designed for:

- **LMS Developers** building custom learning management systems
- **E-learning Platform Developers** integrating SCORM support
- **Content Delivery Platform Developers** who need SCORM compliance
- **Mobile App Developers** building offline-capable learning applications
- **Enterprise Developers** building internal training platforms

## Architecture Overview

scorm-again follows a modular architecture with clear separation of concerns:

- **Core APIs**: Separate implementations for SCORM 1.2 (`Scorm12API`) and SCORM 2004 (`Scorm2004API`)
- **Service Layer**: Modular services for HTTP communication, validation, logging, event handling, and data serialization
- **CMI Data Models**: Structured, validated data models for each SCORM version
- **Cross-Frame Support**: Proxy-based communication for sandboxed iframe scenarios
- **Event System**: Comprehensive listeners for tracking all API interactions

## Browser Compatibility

scorm-again is compatible with:

- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Internet Explorer 11**: Requires a fetch polyfill
- **Node.js**: For server-side processing or testing
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Android Browser

## TypeScript Support

scorm-again is written in TypeScript and includes comprehensive type definitions, providing excellent IDE support and type safety for your SCORM integration.

## Next Steps

Ready to get started? Continue to the [Installation](./installation.md) guide to add scorm-again to your project, or jump to the [Quick Start](./quick-start.md) guide to see basic usage examples.

For detailed integration guidance, see the [LMS Integration Guide](/docs/lms-integration/integration-guide).
