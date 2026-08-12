---
sidebar_position: 2
title: Sequencing Configuration
description: Configure SCORM 2004 sequencing rules, navigation, and activity tree behavior
---

# SCORM 2004 Sequencing Configuration

This document explains how to configure SCORM 2004 sequencing in the scorm-again library.

## Overview

SCORM 2004 sequencing allows you to control the flow of content in a SCORM package. It defines how
learners navigate between activities, how activities are ordered, and how the status of activities
is determined based on the status of their children.

The scorm-again library provides a comprehensive implementation of SCORM 2004 sequencing that follows 
the IMS Simple Sequencing Specification and SCORM 2004 Sequencing and Navigation book. The implementation 
includes:

- Complete activity tree management with hierarchical activities
- All navigation request types (start, continue, previous, choice, jump, exit, suspend, etc.)
- Sequencing rules (pre-condition, post-condition, and exit rules)
- Rollup rules for propagating status from child to parent activities
- Full sequencing process implementation including all subprocesses
- Time-based sequencing features (time limits, tracked time, etc.)
- Navigation request validation through `adl.nav.request_valid`

## Configuration

To configure SCORM 2004 sequencing, you need to provide a `sequencing` object in the settings when
creating a SCORM 2004 API instance:

```javascript
import { Scorm2004API } from "scorm-again";

const api = new Scorm2004API({
   // Other settings...
   sequencing: {
      // Sequencing configuration...
   },
});
```

The `sequencing` object can contain the following properties:

- `activityTree`: Configures the activity tree, which defines the hierarchy of activities in the
  SCORM package.
- `sequencingRules`: Configures the sequencing rules, which define how navigation between activities
  is controlled.
- `sequencingControls`: Configures the sequencing controls, which define general behavior for
  sequencing.
- `rollupRules`: Configures the rollup rules, which define how the status of parent activities is
  determined based on the status of their children.
- `collections`: Reusable manifest sequencing collections, supplied as a keyed record or an array whose entries have `id`.
- `hideLmsUi` and `auxiliaryResources`: Package-level delivery UI data.
- `autoRollupOnCMIChange`: Compatibility behavior for immediate rollup. Leave `false` for SCORM-conforming end-attempt transfer.
- `eventListeners`: Sequencing lifecycle callbacks such as `onActivityDelivery`, `onRollupComplete`, and `onNavigationValidityUpdate`.

### Configuration Hooks

You can supply event listeners under `sequencing` to receive delivery and navigation-validity updates:

```javascript
const api = new Scorm2004API({
  sequencing: {
    activityTree: {/* ... */},

    eventListeners: {
      onActivityDelivery: (activity) => launchSco(activity.id),
      onNavigationValidityUpdate: (validity) => updateNavUI(validity),
    }
  }
});
```

### Activity Tree

The activity tree defines the hierarchy of activities in the SCORM package. Each activity has an ID,
a title, and can have child activities.

```javascript
sequencing: {
  activityTree: {
    id: 'root',
    title: 'Course',
    children: [
      {
        id: 'module1',
        title: 'Module 1',
        children: [
          {
            id: 'lesson1',
            title: 'Lesson 1'
          },
          {
            id: 'lesson2',
            title: 'Lesson 2'
          }
        ]
      },
      {
        id: 'module2',
        title: 'Module 2',
        children: [
          {
            id: 'lesson3',
            title: 'Lesson 3'
          },
          {
            id: 'lesson4',
            title: 'Lesson 4'
          }
        ]
      }
    ]
  }
}
```

Each activity can also have the following properties:

- `isVisible`: Whether the activity is visible to the learner (default: true)
- `isActive`: Whether the activity is currently active
- `isSuspended`: Whether the activity is suspended
- `attemptAbsoluteDurationLimit`: Maximum time allowed for an attempt (ISO 8601 duration)
- `activityAbsoluteDurationLimit`: Maximum time allowed for the activity (ISO 8601 duration)
- `beginTimeLimit`: Time window start for availability (ISO 8601 datetime)
- `endTimeLimit`: Time window end for availability (ISO 8601 datetime)
- `sequencingControls`: Activity-specific sequencing controls (overrides global controls)
- `sequencingRules`: Activity-specific sequencing rules
- `primaryObjective`, `objectives`: Learning objectives with satisfaction, measure, and map tracking
- `sequencingCollectionRefs`, `sequencingIdRef`: One or more reusable sequencing collection IDs

### Sequencing Rules

Sequencing rules define how navigation between activities is controlled. There are three types of
sequencing rules:

- `preConditionRules`: Rules that are evaluated before an activity is attempted.
- `exitConditionRules`: Rules that are evaluated when an activity is exited.
- `postConditionRules`: Rules that are evaluated after an activity is completed.

```javascript
sequencing: {
  sequencingRules: {
    preConditionRules: [
      {
        action: 'skip',
        conditionCombination: 'all',
        conditions: [
          {
            condition: 'completed',
            operator: 'not'
          }
        ]
      }
    ],
    exitConditionRules: [
      {
        action: 'exitParent',
        conditions: [
          {
            condition: 'completed'
          }
        ]
      }
    ],
    postConditionRules: [
      {
        action: 'continue',
        conditions: [
          {
            condition: 'completed'
          }
        ]
      }
    ]
  }
}
```

Each rule has an `action`, an optional `conditionCombination` (which can be `all` or `any`), and an
array of `conditions`. Each condition has a `condition` type, an optional `operator` (which can be
`not`), and optional `parameters`.

### Sequencing Controls

Sequencing controls define general behavior for sequencing. These can be set globally or per-activity.

```javascript
sequencing: {
  sequencingControls: {
    choice: true,                          // Allow choice navigation requests
    choiceExit: true,                      // Allow choice requests to exit the current activity
    flow: false,                           // Enable automatic flow to next activity
    forwardOnly: false,                    // Restrict navigation to forward only
    useCurrentAttemptObjectiveInfo: true,  // Use current attempt's objective info
    useCurrentAttemptProgressInfo: true,   // Use current attempt's progress info
    preventActivation: false,              // Prevent activation of descendant activities
    constrainChoice: false,                // Constrain choice navigation
    randomizationTiming: 'never',          // When to randomize: 'never', 'once', 'onEachNewAttempt'
    selectCount: null,                     // Number of children to select (null = all)
    reorderChildren: false,                // Allow reordering of child activities
    selectionTiming: 'never',              // When to select: 'never', 'once', 'onEachNewAttempt'
    tracked: true,                         // Track activity attempt data
    completionSetByContent: false,         // Completion status set by content
    objectiveSetByContent: false           // Objective status set by content
  }
}
```

### Rollup Rules

Rollup rules define how the status of parent activities is determined based on the status of their
children.

```javascript
sequencing: {
   rollupRules: {
      rules: [
         {
            action: "completed",
            consideration: "all",
            conditions: [
               {
                  condition: "completed",
               },
            ],
         },
         {
            action: "satisfied",
            consideration: "all",
            conditions: [
               {
                  condition: "satisfied",
               },
            ],
         },
      ],
   },
};
```

Each rule has an `action`, a `consideration` (which can be `all`, `any`, `none`, `atLeastCount`, or
`atLeastPercent`), optional `minimumCount` and `minimumPercent` values (for `atLeastCount` and
`atLeastPercent` considerations), and an array of `conditions`. Each condition has a `condition`
type and optional `parameters`.

## Example

Here's a complete example of configuring SCORM 2004 sequencing:

```javascript
import { Scorm2004API } from "scorm-again";

const api = new Scorm2004API({
   // Other settings...
   sequencing: {
      activityTree: {
         id: "root",
         title: "Course",
         children: [
            {
               id: "module1",
               title: "Module 1",
               children: [
                  {
                     id: "lesson1",
                     title: "Lesson 1",
                  },
                  {
                     id: "lesson2",
                     title: "Lesson 2",
                  },
               ],
            },
            {
               id: "module2",
               title: "Module 2",
               children: [
                  {
                     id: "lesson3",
                     title: "Lesson 3",
                  },
                  {
                     id: "lesson4",
                     title: "Lesson 4",
                  },
               ],
            },
         ],
      },
      sequencingRules: {
         preConditionRules: [
            {
               action: "skip",
               conditionCombination: "all",
               conditions: [
                  {
                     condition: "completed",
                     operator: "not",
                  },
               ],
            },
         ],
         exitConditionRules: [
            {
               action: "exitParent",
               conditions: [
                  {
                     condition: "completed",
                  },
               ],
            },
         ],
         postConditionRules: [
            {
               action: "continue",
               conditions: [
                  {
                     condition: "completed",
                  },
               ],
            },
         ],
      },
      sequencingControls: {
         enabled: true,
         choiceExit: true,
         flow: true,
         forwardOnly: false,
         useCurrentAttemptObjectiveInfo: true,
         useCurrentAttemptProgressInfo: true,
         preventActivation: false,
         constrainChoice: false,
         rollupObjectiveSatisfied: true,
         rollupProgressCompletion: true,
         objectiveMeasureWeight: 1.0,
      },
      rollupRules: {
         rules: [
            {
               action: "completed",
               consideration: "all",
               conditions: [
                  {
                     condition: "completed",
                  },
               ],
            },
            {
               action: "satisfied",
               consideration: "all",
               conditions: [
                  {
                     condition: "satisfied",
                  },
               ],
            },
         ],
      },
   },
});
```

This configuration creates a course with two modules, each with two lessons. It defines rules for
skipping completed activities, exiting to the parent when an activity is completed, and continuing
to the next activity when an activity is completed. It also defines rules for determining when a
parent activity is completed or satisfied based on its children.

## Navigation Requests

The SCORM 2004 API supports the following navigation requests through `adl.nav.request`:

- `start` - Start the sequencing session from the root
- `resumeAll` - Resume a suspended session
- `continue` - Navigate to the next activity in the sequence
- `previous` - Navigate to the previous activity in the sequence
- `choice` - Navigate to a specific activity (with `{target=<activityId>}` syntax)
- `jump` - Jump to a specific activity (with `{target=<activityId>}` syntax)
- `exit` - Exit the current activity
- `exitAll` - Exit all activities and end the session
- `abandon` - Abandon the current activity without recording results
- `abandonAll` - Abandon all activities
- `suspendAll` - Suspend all activities
- `retry` - Retry the current activity
- `retryAll` - Retry from the root activity
- `_none_` - No navigation request (default)

Example usage:
```javascript
// Simple navigation
api.SetValue("adl.nav.request", "continue");
api.Terminate("");

// Choice navigation with target
api.SetValue("adl.nav.request", "{target=lesson3}choice");
api.Terminate("");

// Check navigation validity
const canContinue = api.GetValue("adl.nav.request_valid.continue");
const canChooseLesson3 = api.GetValue("adl.nav.request_valid.choice.{target=lesson3}");
```

`Commit()` checkpoints SCO runtime data but does not end the activity attempt or process the
navigation request. Content-driven sequencing runs when the SCO calls `Terminate()`.

## Implementation Details

The sequencing implementation follows the algorithms defined in the SCORM 2004 Sequencing and Navigation book:

- **Overall Sequencing Process (OP)** - Main entry point for all sequencing requests
- **Sequencing Request Process (SB.2.12)** - Validates and processes navigation requests
- **Flow Subprocess (SB.2)** - Handles flow traversal through the activity tree
- **Choice Sequencing Request Process (SB.2.9)** - Handles choice navigation
- **Sequencing Rules Check Process (UP.2)** - Evaluates sequencing rules
- **Rollup Process (RB.1.4)** - Propagates status from children to parents
- **Delivery Request Process (DB.1.1)** - Prepares activities for delivery

The implementation maintains full state tracking, supports all navigation modes, and properly validates all requests according to the SCORM 2004 specification.

## LMS Integration Requirements

### What the LMS Must Provide

To enable SCORM 2004 sequencing, the LMS must extract and provide the following data from the SCORM package's imsmanifest.xml file:

#### 1. Activity Tree Structure

The LMS must parse the `<organization>` element and its nested `<item>` elements to build the activity tree:

```xml
<!-- Example from imsmanifest.xml -->
<organization identifier="ORG-001">
  <title>Sample Course</title>
  <item identifier="ACT-001" identifierref="RES-001">
    <title>Module 1</title>
    <item identifier="ACT-002" identifierref="RES-002">
      <title>Lesson 1.1</title>
    </item>
    <item identifier="ACT-003" identifierref="RES-003">
      <title>Lesson 1.2</title>
    </item>
  </item>
</organization>
```

This should be converted to:
```javascript
activityTree: {
  id: 'ORG-001',
  title: 'Sample Course',
  children: [
    {
      id: 'ACT-001',
      title: 'Module 1',
      children: [
        {
          id: 'ACT-002',
          title: 'Lesson 1.1'
        },
        {
          id: 'ACT-003',
          title: 'Lesson 1.2'
        }
      ]
    }
  ]
}
```

#### 2. Sequencing Rules

The LMS must parse `<imsss:sequencing>` elements within each `<item>`:

```xml
<item identifier="ACT-001">
  <imsss:sequencing>
    <imsss:sequencingRules>
      <imsss:preConditionRule>
        <imsss:ruleConditions conditionCombination="all">
          <imsss:ruleCondition condition="satisfied" operator="not"/>
        </imsss:ruleConditions>
        <imsss:ruleAction action="skip"/>
      </imsss:preConditionRule>
    </imsss:sequencingRules>
  </imsss:sequencing>
</item>
```

#### 3. Sequencing Controls

Parse `<imsss:controlMode>` elements:

```xml
<imsss:controlMode 
  choice="true" 
  choiceExit="true" 
  flow="false" 
  forwardOnly="false"/>
```

#### 4. Rollup Rules

Parse `<imsss:rollupRules>` elements:

```xml
<imsss:rollupRules>
  <imsss:rollupRule childActivitySet="all">
    <imsss:rollupConditions conditionCombination="any">
      <imsss:rollupCondition condition="satisfied"/>
    </imsss:rollupConditions>
    <imsss:rollupAction action="satisfied"/>
  </imsss:rollupRule>
</imsss:rollupRules>
```

### Data Flow

1. **Package Import**: When a SCORM 2004 package is imported, the LMS must:
   - Parse the imsmanifest.xml file
   - Extract the organization structure
   - Extract all sequencing information
   - Store this data in a format that can be provided to the API

2. **API Initialization**: When launching a SCO, the LMS must:
   - Retrieve the stored sequencing configuration
   - Restore persisted global objectives and sequencing state before exposing the API
   - Pass it to the Scorm2004API constructor via the `sequencing` setting
   - Optionally provide the list of valid SCO IDs via `scoItemIds`

3. **Runtime Navigation**: During execution:
   - The SCO sets `adl.nav.request` and calls `Terminate()`
   - The API ends the attempt, commits, processes sequencing, and emits `onActivityDelivery`
   - The LMS launches the delivered activity and resets SCO-local runtime data for the new SCO

### Example LMS Integration

```javascript
// 1. Parse manifest and extract sequencing data (done during package import)
const sequencingData = parseManifest(imsmanifestXML);

// 2. Initialize API with sequencing configuration
const api = new Scorm2004API({
  lmsCommitUrl: 'https://lms.example.com/api/commit',
  renderCommonCommitFields: true,
  
  // Provide the extracted sequencing configuration
  sequencing: {
    ...sequencingData,
    autoRollupOnCMIChange: false,
    eventListeners: {
      onActivityDelivery: (activity) => launchSco(activity.id),
      onActivityUnload: (activity) => unloadSco(activity.id),
      onNavigationValidityUpdate: (validity) => updateNavUI(validity),
    },
  },
  
  // Optional: provide list of valid SCO IDs for validation
  scoItemIds: extractScoIds(sequencingData),
  
  // Optional: provide runtime SCO validation
  scoItemIdValidator: (scoId) => {
    return lmsDatabase.validateScoId(scoId);
  }
});
```

### Endpoints Required

The normal `lmsCommitUrl` persists SCO runtime data and, with structured commits, the global-objective snapshot. An LMS that persists complete sequencing state also supplies the `sequencingStatePersistence` callbacks, typically backed by registration-scoped load/save/delete endpoints.

1. **Track Navigation Events**: Store navigation history for reporting
2. **Validate SCO Access**: Ensure learners can only access SCOs according to sequencing rules
3. **Update UI**: Reflect the current navigation state in the LMS interface

### Runtime Data Storage Considerations

#### Global Objectives

SCORM 2004 introduces the concept of **global objectives** - objectives that are shared across multiple SCOs within a package. The LMS must handle these specially:

1. **Identifying Global Objectives**: 
   - Global objectives are defined in the manifest with `<imsss:mapInfo>` elements
   - Map targets are discovered from `primaryObjective` and `objectives` in the activity tree
   - `globalObjectiveIds` is only for host-defined rows exposed directly to CMI outside manifest maps
   - When a SCO sets data for a global objective, it affects all SCOs that reference it

2. **Storage Requirements**:
   ```javascript
   // Normal objective data is stored per SCO:
   {
     "scoId": "SCO-001",
     "cmi": {
       "objectives": {
         "0": {
           "id": "local-obj-1",
           "success_status": "passed",
           "score": { "scaled": 0.85 }
         }
       }
     }
   }
   
   // Global objectives must be stored separately and shared:
   {
     "courseId": "COURSE-001",
     "globalObjectives": {
       "global-obj-1": {
         "satisfiedStatus": true,
         "satisfiedStatusKnown": true,
         "normalizedMeasure": 0.85,
         "normalizedMeasureKnown": true
       }
     }
   }
   ```

3. **Implementation in scorm-again**:
   - The sequencing engine resolves manifest objective maps from the activity tree
   - End Attempt transfers SCO runtime data to activity tracking and writes eligible objective maps
   - With `renderCommonCommitFields: true`, every SCORM 2004 structured commit includes a top-level `globalObjectives` snapshot
   - Restore that snapshot with `restoreGlobalObjectiveSnapshot()` before initial delivery

#### Suspend Data and Location

For sequenced courses, suspend data handling requires special attention:

- **Suspend Data**: When a learner suspends a SCO, the `cmi.suspend_data` must be preserved
- **Location**: The `cmi.location` indicates where the learner left off
- **Entry State**: The `cmi.entry` value indicates if this is a new attempt or resume
- **Activity State**: The sequencing engine tracks which activities are suspended

#### Attempt Management

Sequenced courses track attempts at multiple levels:

1. **Course-level attempts**: Overall attempts at the entire course
2. **Activity-level attempts**: Individual attempts at each activity
3. **Objective attempts**: Attempts at satisfying objectives

The LMS should store:
- Attempt count per activity
- Attempt duration and absolute duration
- Success/completion status per attempt
- Whether an attempt is suspended or active

### LMS Commit Data Handling

When the API sends commit data to the LMS, sequenced courses require special handling:

#### 1. What Data is Sent

With `renderCommonCommitFields: true`, scorm-again sends a structured `CommitObject` that includes:

```typescript
{
  // Core commit data
  successStatus: SuccessStatus;      // Enumerated success status
  completionStatus: CompletionStatus; // Enumerated completion status
  totalTimeSeconds: number;          // Total time in seconds
  runtimeData: {                     // SCO-local CMI data
    cmi: { /* all CMI data */ }
  };
  globalObjectives: {                // Registration-scoped sequencing snapshot
    [objectiveId: string]: GlobalObjectiveMapEntry
  };
  score?: ScoreObject;               // Optional score data
  
  // Optional metadata (if provided by LMS)
  commitId?: string;
  courseId?: string;
  learnerId?: string;
  learnerName?: string;
  sessionId?: string;
  activityId?: string;
}
```

The commit object does not contain the complete activity tracking tree. Persist that through
`sequencingStatePersistence` or explicit `saveSequencingState()` calls. The sequencing snapshot includes:
- Current activity ID
- Activity states (suspended, attempted, etc.)
- Sequencing request results
- Navigation history

`adl.nav.request` is processed inside the API at `Terminate()` and is not a separate structured
commit field.

#### 2. Global Objectives Handling

The LMS must:
1. **Extract global objectives** from the commit data
2. **Store them separately** from SCO-specific data
3. **Make them available** to other SCOs that reference them
4. **Load them** when initializing any SCO that uses them

Example LMS implementation:
```javascript
async function handleScormCommit(commitData) {
  // 1. Save SCO-specific data
  await saveScoData(commitData.scoId, commitData.runtimeData.cmi);
  
  // 2. Store the synchronized global-objective snapshot as one registration value
  await saveGlobalObjectives(courseId, commitData.globalObjectives ?? {});
  
  // 3. Update sequencing state
  await updateSequencingState(courseId, commitData.scoId, {
    attemptCount: commitData.attempt,
    isSuspended: commitData.runtimeData.cmi.exit === "suspend",
    completionStatus: commitData.runtimeData.cmi.completion_status,
    successStatus: commitData.runtimeData.cmi.success_status
  });
}

// Before the first delivery, restore shared objectives directly into the API.
api.restoreGlobalObjectiveSnapshot(await loadGlobalObjectives(courseId));
```

#### 3. Sequencing State Persistence

Provide a `sequencingStatePersistence` adapter to store the engine snapshot. For deterministic
resume, set `autoLoadOnInitialize: false`, await `loadSequencingState(metadata)`, restore the last
commit's global-objective snapshot, and only then expose the API and start delivery:

```javascript
const api = new Scorm2004API({
  ...settings,
  sequencingStatePersistence: {
    persistence,
    autoLoadOnInitialize: false,
    autoSaveOn: "commit",
  },
});

api.restoreGlobalObjectiveSnapshot(persistedGlobalObjectives);
await api.loadSequencingState({ learnerId, courseId, attemptNumber });
window.API_1484_11 = api;
```

`autoSaveOn` defaults to `"commit"` and includes termination commits. Use `"navigate"` to save
post-navigation state, or `"never"` when the LMS controls every save explicitly.

### API Reset Between SCOs

#### When to Reset the API

Each SCO needs a fresh SCORM communication session and SCO-local CMI model. A sequenced player may
keep one API instance and call `reset()` between delivered SCOs:

1. **Terminate the current SCO**: Call `Terminate()` which will commit any pending data
2. **Reset the API**: Call `api.reset()` to clear the current state
3. **Keep shared state**: `reset()` preserves the sequencing tree, tracking state, and global objectives
4. **Initialize the new SCO**: Load the new SCO's local runtime data, then let it call `Initialize()`

#### What Gets Reset

When `api.reset()` is called:
- SCO-local CMI and ADL data are cleared
- The API returns to the pre-initialize state for the next SCO
- Sequencing tracking and global objectives are preserved
- Sequencing callbacks configured through `sequencing.eventListeners` remain installed

#### Recommended Implementation

```javascript
let hasDeliveredSco = false;

const eventListeners = {
  onActivityDelivery: async (activity) => {
    if (hasDeliveredSco) {
      // The prior SCO has terminated before subsequent delivery events.
      api.reset();
    }
    api.loadFromJSON(await loadScoData(activity.id));
    hasDeliveredSco = true;
    launchSco(activity.id);
  },
};
```

#### Alternative Approach: Multiple API Instances

Some LMS implementations maintain separate API instances for each SCO, but they must explicitly
share persisted sequencing state and global-objective snapshots between instances:

```javascript
// Create a new API instance for each SCO
const apis = {};

function getApiForSco(scoId) {
  if (!apis[scoId]) {
    apis[scoId] = new Scorm2004API({
      // ... settings ...
      sequencing,
      renderCommonCommitFields: true,
    });
  }
  return apis[scoId];
}
```

The single-instance `reset()` flow is usually simpler for a sequenced player.

### Important Notes

- The sequencing configuration must be provided when the API is initialized
- The API handles all sequencing logic internally based on the SCORM 2004 specification
- The LMS is responsible for actually launching/switching SCOs based on navigation events
- All navigation validation is handled by the API through `adl.nav.request_valid`
- Persist and restore the structured commit's `globalObjectives` snapshot across SCOs
- Persist the activity tracking tree through `sequencingStatePersistence`
- The API should be reset between SCO launches to ensure clean state

## Recent Enhancements (Sequencing)

- Per-target request validity:
  - The library computes per-target maps for `choice` and `jump` and emits `onNavigationValidityUpdate` with `{ continue, previous, choice, jump, hideLmsUi, auxiliaryResources }`.
  - It attempts to set `adl.nav.request_valid.choice`/`jump` maps when writable; prefer the event payload for UI updates.
- New sequencing control:
  - `stopForwardTraversal` is honored when set (e.g., via a post-condition rule) to halt forward traversal through a cluster.
