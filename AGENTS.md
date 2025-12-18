# Repository Guidelines

## Project Structure & Module Organization
- `src/` TypeScript source (APIs: `Scorm12API.ts`, `Scorm2004API.ts`; facades: `CrossFrameAPI.ts`, `CrossFrameLMS.ts`; utilities, constants, types).
- `test/` Unit tests (`**/*.spec.ts`) and integration tests under `test/integration/`.
- `dist/` Build output (CJS `dist/*.js` and ESM `dist/esm/*.js`, types in `dist/types/`).
- `docs/`, `examples/` Documentation and usage examples.
- Entry exports are named; see `src/index.ts`.

## Build, Test, and Development Commands
- Install: `npm ci` (Node >= 20).
- Build (dev/prod): `npm run build` / `npm run build:prod`.
- Types only: `npm run build:types`; all: `npm run build:all`.
- Watch compile: `npm run compile:dev`.
- Unit tests: `npm test` (Vitest, jsdom); coverage: `npm run test:coverage`.
- Integration: `npm run test:integration` (starts local server via Playwright config). For local debug: `npm run test:integration:setup` then `npm run test:integration:server`.
- Lint/format: `npm run lint`, `npm run lint:fix`, `npm run prettier`.

## Coding Style & Naming Conventions
- TypeScript, ESM modules. Strict compiler options (`tsconfig.json`).
- Indentation: 2 spaces; LF endings (`.editorconfig`).
- Prefer named exports; keep API file names in PascalCase (e.g., `Scorm2004API.ts`), directories lower-case; functions `camelCase`, classes `PascalCase`, constants `UPPER_SNAKE_CASE` in `src/constants/*`.
- Use ESLint + Prettier before committing.

## Testing Guidelines
- Unit tests live in `test/**/*.spec.ts`; integration tests in `test/integration/` (require build).
- Use Vitest matchers; UI mode: `npm run test:ui` for focused runs.
- Maintain/add coverage for new code paths; coverage config excludes generated/types and some facades (see `vitest.config.ts`).

## Commit & Pull Request Guidelines
- Use Conventional Commits (e.g., `feat:`, `fix:`, `docs:`). Releases use `standard-version`; do not bump versions manually.
- Before PR: `npm run lint` and `npm test` (and run integration when applicable).
- PRs should include: a clear description, linked issues, rationale, and test updates. Update `docs/` or examples when behavior changes.

## Security & Configuration Tips
- Target Node >= 20; browser support follows `package.json#browserslist`.
- Avoid introducing globals; code runs in browser and test `jsdom` environments.
