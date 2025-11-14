# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Build Commands
- `npm run build` - Standard build with source maps
- `npm run build:prod` - Production build (optimized, conditional source maps)
- `npm run build:all` - Build + generate TypeScript types
- `npm run compile:dev` - Watch mode for development

### Test Commands
- `npm test` - Run all unit tests (Vitest)
- `npm run test:coverage` - Generate coverage reports
- `npm run test:integration` - Run Playwright integration tests
- `npm run test:performance` - Run performance benchmarks
- `npm run test:ui` - Interactive test UI for debugging

### Code Quality
- `npm run lint` - ESLint + Prettier check
- `npm run lint:fix` - Auto-fix linting issues and format code
- **Important**: Always run `npm run lint:fix` after making changes to ensure code follows project standards

### Release Commands
- `npm run release:alpha` - Alpha release
- `npm run release:beta` - Beta release
- `npm run release` - Full release workflow

## High-Level Architecture

### API Structure
The project implements three e-learning standards as separate APIs that inherit from a common BaseAPI:
- **AICC.ts** - AICC standard implementation
- **Scorm12API.ts** - SCORM 1.2 implementation  
- **Scorm2004API.ts** - SCORM 2004 implementation with advanced sequencing

### Cross-Frame Communication
The project includes a proxy-based façade pattern for sandboxed iframe communication:
- **CrossFrameLMS** - Parent frame component that receives postMessage calls
- **CrossFrameAPI** - Child frame proxy that provides synchronous API with async cache updates

### Service Layer Architecture
All APIs use a modular service layer (`src/services/`):
- **SynchronousHttpService** (default) / **AsynchronousHttpService** (legacy) - Handle LMS communication
- **EventService** - Manages event listeners for all API method calls
- **ValidationService** - Validates CMI data according to each standard's rules
- **SerializationService** - Handles JSON/flattened/params data formats
- **OfflineStorageService** - Manages offline data storage and synchronization
- **LoggingService** - Configurable logging with different levels
- **ErrorHandlingService** - Standardized error management across APIs

### HTTP Service Architecture

The project provides two HTTP service implementations:

- **SynchronousHttpService** (default) - SCORM-compliant using synchronous XMLHttpRequest
  - Blocks until LMS responds
  - Returns actual success/failure to SCO
  - Uses `sendBeacon()` for termination commits
  - Cannot be throttled

- **AsynchronousHttpService** (legacy) - Not SCORM-compliant
  - Returns immediate optimistic success
  - Actual result handled via events (CommitSuccess/CommitError)
  - Can be throttled
  - Should only be used for specific legacy compatibility

Selection is automatic based on `useAsynchronousCommits` setting, or can be overridden via `httpService` setting.

### CMI Data Models
Each standard has its own CMI implementation in `src/cmi/`:
- Common components shared across standards in `cmi/common/`
- Standard-specific implementations follow their respective specifications
- SCORM 2004 includes complex sequencing models in `cmi/scorm2004/sequencing/`

### Build System
The project uses Rollup to create multiple build targets:
- IIFE bundles for browsers (with Babel for IE11 support)
- ES modules for modern bundlers
- Separate minified versions for production
- Individual entry points for each API to optimize bundle size

### Testing Strategy
- **Unit Tests**: Vitest with jsdom for DOM simulation
- **Integration Tests**: Playwright for real browser testing
- **Property Tests**: fast-check for validation logic
- **Performance Tests**: Custom benchmarks for optimization
- Tests mirror source structure in `test/` directory

### Key Design Patterns
1. **Inheritance**: All APIs extend BaseAPI for shared functionality
2. **Event-Driven**: Comprehensive event system for tracking all interactions
3. **Service-Oriented**: Modular services for separation of concerns
4. **Proxy Pattern**: Cross-frame communication using JavaScript Proxy
5. **Factory Pattern**: Settings objects configure API behavior

### Important Implementation Details
- All APIs attach to `window` object for SCORM content discovery
- Supports multiple data commit formats (JSON, flattened, params)
- Includes offline support with automatic synchronization
- Implements SCORM 2004 sequencing and navigation
- Provides hooks for request/response transformation
- Maintains backward compatibility with legacy content