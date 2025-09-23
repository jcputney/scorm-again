# SCORM 2004 Sequencing Integration Guide

This guide documents everything an LMS must do to run SCORM 2004 sequencing with `scorm-again`. It covers configuration, runtime integration, navigation/UI handling, auxiliary resources, persistence, and cross-frame deployments.

## 1. Runtime Requirements

- **Environment**: Browser capable of running the bundled `dist/scorm2004.min.js` (or the ESM build).
- **Hosting**: Serve the API bundle before launching SCO content. Expose it globally as `window.API_1484_11`.
- **Lifecycle**: LMS must call `Initialize()` when the SCO loads and `Terminate()` when the SCO exits. Sequence processing, navigation, rollup, and persistence hooks run inside those calls.
- **Node version (tooling)**: `npm run build:types` and tests require Node ≥ 20. Client browsers see prebuilt bundles, no transpilation needed.

```html
<script src="/dist/scorm2004.min.js"></script>
<script>
  window.API_1484_11 = new Scorm2004API(settings);
  // SCO runs Initialize/Terminate through the API facade.
</script>
```

## 2. Sequencing Configuration Data

The LMS supplies the manifest-equivalent sequencing tree at API construction time. A minimal configuration looks like this:

```ts
const settings = {
  globalObjectiveIds: ["GLOBAL_PRIMARY"],
  sequencing: {
    hideLmsUi: ["exitAll", "abandonAll"],
    auxiliaryResources: [
      { resourceId: "urn:lms:help", purpose: "help" },
      { resourceId: "urn:lms:glossary", purpose: "glossary" },
    ],
    collections: {
      clusteredModule: {
        sequencingControls: {
          flow: true,
          choice: false,
          selectionTiming: "once",
          randomizeChildren: true,
        },
        hideLmsUi: ["continue"],
        auxiliaryResources: [
          { resourceId: "urn:lms:cheatsheet", purpose: "job-aid" },
        ],
        selectionRandomizationState: {
          childOrder: ["modA", "modB"],
          selectedChildIds: ["modA"],
          hiddenFromChoiceChildIds: ["modB"],
        },
      },
    },
    activityTree: {
      id: "course_root",
      title: "Demo Course",
      auxiliaryResources: [{ resourceId: "urn:lms:root-notes", purpose: "notes" }],
      sequencingControls: {
        flow: true,
        stopForwardTraversal: false,
      },
      children: [
        {
          id: "moduleA",
          title: "Module A",
          sequencingCollectionRefs: ["clusteredModule"],
          primaryObjective: {
            objectiveID: "OBJ_MODULE_A",
            satisfiedByMeasure: true,
            minNormalizedMeasure: 0.8,
            mapInfo: [
              {
                targetObjectiveID: "GLOBAL_PRIMARY",
                readSatisfiedStatus: true,
                writeSatisfiedStatus: true,
                readNormalizedMeasure: true,
                writeNormalizedMeasure: true,
              },
            ],
          },
          children: [
            {
              id: "scoA1",
              title: "Introduction",
              hideLmsUi: ["previous"],
              auxiliaryResources: [
                { resourceId: "urn:lms:scoA1-job", purpose: "job-aid" },
              ],
            },
            { id: "scoA2", title: "Practice" },
          ],
        },
        {
          id: "moduleB",
          title: "Module B",
          auxiliaryResources: [
            { resourceId: "urn:lms:modB-help", purpose: "help" },
          ],
          sequencingControls: {
            flow: true,
            forwardOnly: true,
          },
          children: [
            { id: "scoB1", title: "Lecture" },
            { id: "scoB2", title: "Assessment" },
          ],
        },
      ],
    },
    autoRollupOnCMIChange: true,
    enableEventSystem: true,
    validateNavigationRequests: true,
    logLevel: "info",
    eventListeners: {}, // see Section 4
  },
};
```

### 2.1 Activity Settings Cheat Sheet

| Field | Description |
| --- | --- |
| `id`, `title` | Unique identifier and display title for each activity. |
| `children` | Nested `ActivitySettings` array; empty or omitted for leaf SCOs. |
| `isVisible`, `isHiddenFromChoice`, `isAvailable` | Manifest visibility flags. |
| `attemptLimit`, `beginTimeLimit`, `timeLimitAction`, etc. | Sequencing limit conditions. |
| `primaryObjective`, `objectives[]` | Per-activity objectives with optional map info. |
| `sequencingControls`, `sequencingRules`, `rollupRules`, `rollupConsiderations` | Per-node overrides. |
| `selectionRandomizationState` | Persisted selection/randomization data for deterministic resumes. |
| `hideLmsUi[]` | Additional LMS navigation hints. |
| `auxiliaryResources[]` | Array of `{ resourceId, purpose }` entries for job aids, help, etc. |
| `sequencingCollectionRefs` | One or many collection IDs to reuse shared settings. |

### 2.2 Collections

Collections let you define reusable sequencing bundles. A collection may contain controls, rules, rollup considerations, selection state, hide directives, and auxiliary resources. Activities reference collections via `sequencingCollectionRefs`; scorm-again merges collection data with per-activity settings (collection values apply first, activity overrides last).

### 2.3 Auxiliary Resources

`auxiliaryResources` appear at three levels:

1. **Global defaults** (`settings.sequencing.auxiliaryResources`)
2. **Collections** (shared defaults per cluster)
3. **Per activity** (`activity.auxiliaryResources`)

scorm-again merges them by resourceId (last writer wins) along the path from root → activity.

## 3. Event Listeners & LMS Shell Integration

Sequencing emits events when LMS shells register listeners via `API.setSequencingEventListeners`. Key callbacks:

- `onActivityDelivery(Activity)` – launch the SCO.
- `onActivityUnload(Activity)` – close the SCO frame and persist data.
- `onNavigationValidityUpdate(validity)` – update navigation UI and auxiliary resources. Payload:
  ```ts
  {
    continue: "true" | "false",
    previous: "true" | "false",
    choice: Record<string, "true" | "false">,
    jump: Record<string, "true" | "false">,
    hideLmsUi: HideLmsUiItem[],
    auxiliaryResources: AuxiliaryResource[],
  }
  ```
- `onSequencingStateChange(state)` – full snapshot for debugging dashboards.
- `onRollupComplete(Activity)` – update breadcrumbs/progress bars.
- `onSequencingError(message, context?)` – hook for LMS logging.

Example shell wiring:

```ts
API.setSequencingEventListeners({
  onActivityDelivery: (activity) => launchSco(activity.id),
  onActivityUnload: (activity) => closeSco(activity.id),
  onNavigationValidityUpdate: (validity) => {
    updateNavButtons(validity);
    renderAuxiliaryResources(validity.auxiliaryResources);
  },
  onSequencingStateChange: (state) => updateDiagnosticsPanel(state),
});
```

In wrappers (`test/integration/wrappers/*.html`) you can see the reference implementation: the navigation UI toggles hide directives and renders auxiliary resources dynamically.

## 4. Navigation Handling

- Use ADL navigation values to trigger sequencing transitions: set `adl.nav.request` and call `Commit()`. Example: `API.SetValue("adl.nav.request", "_continue"); API.Commit("");`.
- Honor `adl.nav.request_valid.*` (available in both the CMI tree and the event payload) to disable or grey-out illegal actions.
- For direct LMS actions (no ADL value) you can call `API.processNavigationRequest(type, targetId?)`. Returns `true` on success.
- Choice/jump requests require target IDs: `API.processNavigationRequest("choice", "moduleB")`.

## 5. Auxiliary Resource Consumption

The event payload provides the merged auxiliary resource list (`{ resourceId, purpose }`). The LMS should:

1. Render each entry in a help/job-aid panel.
2. Treat `resourceId` as a URI—either deep link or key into LMS storage.
3. Update the panel for each `onActivityDelivery` or `onNavigationValidityUpdate` call.

Wrapper implementations (`#aux-resources` lists) demonstrate a minimal UI.

## 6. Persistence & LMS Endpoints

Sequencing state can be persisted via a custom adapter so learners resume exactly where they left off (activity stack, randomization order, hide directives, auxiliary resources, global objective map, etc.). Provide `settings.sequencingStatePersistence`:

```ts
const persistence = {
  async saveState(serializedState: string, metadata: SequencingStateMetadata) {
    await fetch(`/api/scorm/state`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ metadata, state: serializedState }),
    });
    return true;
  },
  async loadState(metadata) {
    const res = await fetch(`/api/scorm/state?learner=${metadata.learnerId}&course=${metadata.courseId}`);
    if (!res.ok) return null;
    const { state } = await res.json();
    return state; // string or null
  },
  async clearState(metadata) {
    await fetch(`/api/scorm/state?learner=${metadata.learnerId}&course=${metadata.courseId}`, {
      method: 'DELETE',
    });
    return true;
  },
};
```

Recommended REST endpoints (adjust to your stack):

| Method | Endpoint | Payload | Purpose |
| --- | --- | --- | --- |
| `PUT` | `/api/scorm/state` | `{ metadata, state }` | Save serialized sequencing state. |
| `GET` | `/api/scorm/state?learner=...&course=...` | — | Load last saved state. Return `null` if none. |
| `DELETE` | `/api/scorm/state?learner=...&course=...` | — | Forget stored state (e.g., new attempt). |

Call `API.saveSequencingState(metadata)` during LMS checkpoints (e.g., commit, suspend). Call `API.loadSequencingState(metadata)` immediately after `Initialize()` when you resume a learner.

Use `metadata: { learnerId, courseId, attemptId? }` to scope storage.

## 7. Cross-Frame / Cross-Domain Deployments

If content runs in a different frame or domain, use the cross-frame facades:

- **LMS frame**: instantiate
  ```ts
  const server = createCrossFrameServer('2004', apiSettings, cmiDefaults);
  ```
  This wraps the real SCORM API and listens for `postMessage` calls.

- **Intermediate frame**: load `/test/integration/wrappers/cross-frame-intermediate.html` (or your derivative) to bridge LMS ↔ content.

- **Content frame**: import `createCrossFrameClient()` to obtain a SCORM API proxy that forwards commands to the LMS frame.

- **Origin restrictions**: set the `targetOrigin` when creating the server/client if you need strict cross-domain security.

The cross-frame wrapper in the repo demonstrates the pattern: it registers sequencing listeners, updates UI, and ensures hide directives/auxiliary resources render in the parent frame while the SCO stays sandboxed.

## 8. LMS UI Responsibilities

1. **Navigation buttons**: show/hide & enable/disable according to `hideLmsUi` and `request_valid` values.
2. **Auxiliary resources panel**: render the merged list every time `onActivityDelivery` or `onNavigationValidityUpdate` fires.
3. **Activity launch**: map `activity.id` → SCO URL. `activity.title` helps with breadcrumbs.
4. **Progress indicators**: use rollup events (`onRollupComplete`) and `API.getSequencingState()` to display completion/success.
5. **Error surfaces**: capture `onSequencingError` for support logs.

## 9. Testing & Validation

- Run the Vitest suites locally: `npm test -- SequencingConfiguration sequencing_process overall_sequencing_process SequencingPersistence`.
- Run Playwright UI checks: `npx playwright test test/integration/NavigationUi.spec.ts` (ensures hide directives + auxiliary resources render correctly in all wrappers).
- Provide LMS-side automated tests that:
  - Launch multiple SCOs, exercise navigation requests, and verify LMS UI honors `hideLmsUi`.
  - Randomize selection branches, suspend/resume, and confirm order persists.
  - Verify auxiliary resource lists match expectations per activity.

## 10. Integration Checklist

- [ ] Serve `scorm2004.min.js` (or ESM) and instantiate `Scorm2004API` with complete sequencing configuration.
- [ ] Register sequencing event listeners; update navigation controls and auxiliary resource panel on each event.
- [ ] Forward user navigation actions via `adl.nav.request` + `Commit` or `processNavigationRequest`.
- [ ] Implement persistence endpoints and wire `saveSequencingState` / `loadSequencingState` / `clearSequencingState`.
- [ ] Render auxiliary resources (default + per-activity) in learner UI.
- [ ] Handle cross-frame communication if content runs in another domain.
- [ ] Provide LMS logging for `onSequencingError`, `onSequencingDebug` as desired.
- [ ] Run Vitest + Playwright suites before rollout.

Following this guide ensures the LMS consumes every sequencing feature scorm-again exposes: collections, limit conditions, hide directives, auxiliary resources, randomization, persistence, and navigation events.
