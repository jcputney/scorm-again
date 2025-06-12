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
- `attemptExperiencedDurationLimit`: Maximum experienced time allowed (ISO 8601 duration)
- `activityAbsoluteDurationLimit`: Maximum time allowed for the activity (ISO 8601 duration)
- `activityExperiencedDurationLimit`: Maximum experienced time for the activity (ISO 8601 duration)
- `beginTimeLimit`: Time window start for availability (ISO 8601 datetime)
- `endTimeLimit`: Time window end for availability (ISO 8601 datetime)
- `sequencingControls`: Activity-specific sequencing controls (overrides global controls)
- `sequencingRules`: Activity-specific sequencing rules
- `objectives`: Learning objectives with satisfaction and measure tracking

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
    selectCount: 0,                        // Number of children to select (0 = all)
    reorderChildren: false,                // Allow reordering of child activities
    selectionTiming: 'never',              // When to select: 'never', 'once', 'onEachNewAttempt'
    trackedObjectives: true,               // Track objectives
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
      ];
   }
}
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

// Choice navigation with target
api.SetValue("adl.nav.request", "{target=lesson3}choice");

// Check navigation validity
const canContinue = api.GetValue("adl.nav.request_valid.continue");
const canChooseLesson3 = api.GetValue("adl.nav.request_valid.choice.{target=lesson3}");
```

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
   - Pass it to the Scorm2004API constructor via the `sequencing` setting
   - Optionally provide the list of valid SCO IDs via `scoItemIds`

3. **Runtime Navigation**: During execution:
   - The API handles all navigation requests through `adl.nav.request`
   - The LMS may listen for navigation events via the event system
   - The LMS should launch the appropriate SCO based on navigation results

### Example LMS Integration

```javascript
// 1. Parse manifest and extract sequencing data (done during package import)
const sequencingData = parseManifest(imsmanifestXML);

// 2. Initialize API with sequencing configuration
const api = new Scorm2004API({
  lmsCommitUrl: 'https://lms.example.com/api/commit',
  
  // Provide the extracted sequencing configuration
  sequencing: sequencingData,
  
  // Optional: provide list of valid SCO IDs for validation
  scoItemIds: extractScoIds(sequencingData),
  
  // Optional: provide runtime SCO validation
  scoItemIdValidator: (scoId) => {
    return lmsDatabase.validateScoId(scoId);
  }
});

// 3. Listen for navigation events
api.on('SequenceNext', () => {
  const nextActivity = api.adl.sequencing.getCurrentActivity();
  if (nextActivity) {
    launchSco(nextActivity.id);
  }
});

api.on('SequencePrevious', () => {
  const prevActivity = api.adl.sequencing.getCurrentActivity();
  if (prevActivity) {
    launchSco(prevActivity.id);
  }
});

api.on('SequenceChoice', (targetId) => {
  launchSco(targetId);
});

api.on('SequenceExit', () => {
  closeScoWindow();
});

api.on('SequenceExitAll', () => {
  endLearningSession();
});
```

### Endpoints Required

The LMS does not need any special endpoints for sequencing beyond the standard `lmsCommitUrl` for data persistence. However, the LMS may want to:

1. **Track Navigation Events**: Store navigation history for reporting
2. **Validate SCO Access**: Ensure learners can only access SCOs according to sequencing rules
3. **Update UI**: Reflect the current navigation state in the LMS interface

### Runtime Data Storage Considerations

#### Global Objectives

SCORM 2004 introduces the concept of **global objectives** - objectives that are shared across multiple SCOs within a package. The LMS must handle these specially:

1. **Identifying Global Objectives**: 
   - Global objectives are defined in the manifest with `<imsss:mapInfo>` elements
   - The API setting `globalObjectiveIds` should list all global objective IDs
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
         "success_status": "passed",
         "score": { "scaled": 0.85 }
       }
     }
   }
   ```

3. **Implementation in scorm-again**:
   - The API tracks global objectives in a separate `_globalObjectives` array internally
   - When setting objective data, it checks if the objective ID is in `globalObjectiveIds`
   - If it's a global objective, the data is also stored in the internal global objectives array
   - Currently, global objectives are not automatically included in the commit data - the LMS must extract them from the regular objectives array based on the `globalObjectiveIds` list

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

The scorm-again API sends a `CommitObject` that includes:

```typescript
{
  // Core commit data
  successStatus: SuccessStatus;      // Enumerated success status
  completionStatus: CompletionStatus; // Enumerated completion status
  totalTimeSeconds: number;          // Total time in seconds
  runtimeData: {                     // All CMI and ADL data
    cmi: { /* all CMI data */ },
    adl: { /* all ADL data */ }
  };
  score?: ScoreObject;               // Optional score data
  
  // Optional metadata (if provided by LMS)
  commitId?: string;
  courseId?: string;
  learnerId?: string;
  learnerName?: string;
  sessionId?: string;
  attemptNumber?: number;
}
```

**Important**: The API currently does NOT send additional sequencing-specific data like:
- Current activity ID
- Activity states (suspended, attempted, etc.)
- Sequencing request results
- Navigation history

The LMS must track this information separately based on:
- Navigation events fired by the API
- The `adl.nav.request` value in the commit data
- The `cmi.exit` value (suspend, normal, etc.)

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
  await saveScoData(commitData.scoId, commitData.cmi);
  
  // 2. Extract and save global objectives
  // Note: Global objectives are in the regular objectives array
  // The LMS must identify them using the globalObjectiveIds list
  const globalObjectiveIds = getGlobalObjectiveIds(courseId);
  
  if (commitData.cmi.objectives) {
    for (const [index, objective] of Object.entries(commitData.cmi.objectives)) {
      if (globalObjectiveIds.includes(objective.id)) {
        await saveGlobalObjective(courseId, objective.id, objective);
      }
    }
  }
  
  // 3. Update sequencing state
  await updateSequencingState(courseId, commitData.scoId, {
    attemptCount: commitData.attemptNumber,
    isSuspended: commitData.cmi.exit === "suspend",
    completionStatus: commitData.cmi.completion_status,
    successStatus: commitData.cmi.success_status
  });
}

// When launching a SCO, load both local and global data
async function initializeSco(scoId) {
  const localData = await loadScoData(scoId);
  const globalObjectives = await loadGlobalObjectives(courseId);
  
  // Merge global objectives into the local data
  if (globalObjectives) {
    localData.objectives = localData.objectives || {};
    for (const globalObj of globalObjectives) {
      // Find or create objective slot
      const index = findOrCreateObjectiveIndex(localData.objectives, globalObj.id);
      localData.objectives[index] = globalObj;
    }
  }
  
  return localData;
}
```

#### 3. Sequencing State Persistence

The LMS should maintain:
- Current activity ID
- Suspended activity IDs
- Activity attempt counts
- Navigation request history
- Time tracking per activity

### API Reset Between SCOs

#### When to Reset the API

The SCORM 2004 specification requires that each SCO gets a fresh API instance. When navigating between SCOs in a sequenced course:

1. **Terminate the current SCO**: Call `Terminate()` which will commit any pending data
2. **Reset the API**: Call `api.reset()` to clear the current state
3. **Preserve global state**: The LMS must preserve:
   - Global objectives
   - Sequencing state (current activity, suspended activities)
   - Learner information
   - Course-level attempt data
4. **Initialize for the new SCO**: Load the new SCO's data including any global objectives

#### What Gets Reset

When `api.reset()` is called:
- ✅ All CMI data is cleared
- ✅ All ADL data is cleared
- ✅ The sequencing engine state is reset
- ✅ Event listeners are preserved (unless explicitly cleared)
- ❌ Global objectives are currently cleared (this is a limitation - the LMS must reload them)

#### Recommended Implementation

```javascript
// 1. Handle navigation event
api.on('SequenceNext', async (eventName, CMIElement, targetScoId) => {
  // 2. Get current state before reset
  const currentGlobalObjectives = extractGlobalObjectives(api);
  const sequencingState = {
    currentActivity: targetScoId,
    suspendedActivities: getSuspendedActivities()
  };
  
  // 3. Reset the API
  api.reset();
  
  // 4. Reload configuration with preserved state
  const scoData = await loadScoData(targetScoId);
  const globalData = await loadGlobalObjectives(courseId);
  
  // 5. Initialize the new SCO with merged data
  api.loadFromJSON({
    cmi: {
      ...scoData,
      objectives: mergeObjectives(scoData.objectives, globalData)
    }
  });
  
  // 6. Launch the new SCO
  launchSco(targetScoId);
});
```

#### Alternative Approach: Multiple API Instances

Some LMS implementations maintain separate API instances for each SCO:

```javascript
// Create a new API instance for each SCO
const apis = {};

function getApiForSco(scoId) {
  if (!apis[scoId]) {
    apis[scoId] = new Scorm2004API({
      // ... settings ...
      globalObjectiveIds: globalObjectiveIds
    });
  }
  return apis[scoId];
}
```

This approach avoids the reset issue but requires more memory and careful state synchronization.

### Important Notes

- The sequencing configuration must be provided when the API is initialized
- The API handles all sequencing logic internally based on the SCORM 2004 specification
- The LMS is responsible for actually launching/switching SCOs based on navigation events
- All navigation validation is handled by the API through `adl.nav.request_valid`
- Global objectives require special handling and must be shared across SCOs
- The LMS must track sequencing state separately from CMI data
- The API should be reset between SCO launches to ensure clean state
