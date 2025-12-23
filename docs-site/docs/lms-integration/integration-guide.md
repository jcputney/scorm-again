---
sidebar_position: 1
title: LMS Integration Guide
description: Complete guide for integrating scorm-again into a Learning Management System, covering all launch scenarios, data requirements, and runtime responsibilities.
---
# LMS Integration Guide

This guide provides a comprehensive, language-agnostic reference for integrating the scorm-again library into a Learning Management System. It covers all launch scenarios, data requirements, storage considerations, and runtime responsibilities.

**Assumptions:**
- Your LMS can parse SCORM content packages (imsmanifest.xml)
- Your LMS can serve SCORM content to learners via iframe or popup
- Your LMS has a mechanism for persisting learner data

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Model Requirements](#data-model-requirements)
3. [SCORM 1.2 Integration](#scorm-12-integration)
   - [Single-SCO Launches](#scorm-12-single-sco-launches)
   - [Multi-SCO Launches](#scorm-12-multi-sco-launches)
4. [SCORM 2004 Integration](#scorm-2004-integration)
   - [Single-SCO Launches](#scorm-2004-single-sco-launches)
   - [Multi-SCO Launches](#scorm-2004-multi-sco-launches)
   - [Sequenced Modules](#scorm-2004-sequenced-modules)
5. [Commit Endpoint Specification](#commit-endpoint-specification)
6. [Entry Mode Decision Logic](#entry-mode-decision-logic)
7. [Error Handling](#error-handling)
8. [Session Management](#session-management)
9. [Integration Checklists](#integration-checklists)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              YOUR LMS                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────────┐    │
│  │ Package Parser   │   │ Launch Manager   │   │ Commit Handler       │    │
│  │ (Import Phase)   │   │ (Runtime)        │   │ (Endpoint)           │    │
│  └────────┬─────────┘   └────────┬─────────┘   └──────────┬───────────┘    │
│           │                      │                        │                 │
│           ▼                      ▼                        ▼                 │
│  ┌──────────────────────────────────────────────────────────────────┐      │
│  │                      Data Storage Layer                          │      │
│  │  (Course Structure, Learner State, Runtime Data, Sequencing)     │      │
│  └──────────────────────────────────────────────────────────────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP Commit / postMessage
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         scorm-again Library                                  │
│  ┌──────────────────┐   ┌──────────────────┐   ┌──────────────────────┐    │
│  │ API Instance     │   │ CMI Data Model   │   │ Sequencing Engine    │    │
│  │ (Scorm12API or   │   │ (Runtime State)  │   │ (SCORM 2004 only)    │    │
│  │  Scorm2004API)   │   │                  │   │                      │    │
│  └──────────────────┘   └──────────────────┘   └──────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ JavaScript API calls
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SCORM Content (SCO)                                  │
│  Runs in iframe, calls API.LMSInitialize(), SetValue(), etc.                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Responsibilities

| Component | Responsibility |
|-----------|---------------|
| **Package Parser** | Extract course structure, sequencing rules, SCO metadata from manifest |
| **Launch Manager** | Initialize API with correct data, manage SCO lifecycle |
| **Commit Handler** | Receive runtime data, persist to storage, return success/failure |
| **scorm-again** | Provide SCORM-compliant API, manage runtime state, handle sequencing |
| **SCO Content** | Call API methods, report progress/scores/completion |

---

## Data Model Requirements

This section defines the data your LMS must store. The structure is storage-agnostic—adapt to your database technology (relational, document, key-value, etc.).

### Core Entities

#### 1. Course

Represents an imported SCORM package.

```
Course
├── id: string (unique identifier)
├── title: string
├── version: string (SCORM version: "1.2" | "2004")
├── scormEdition: string (for 2004: "2nd" | "3rd" | "4th")
├── importedAt: timestamp
├── packageHash: string (for duplicate detection)
│
├── structure: CourseStructure (see below)
└── metadata: CourseMetadata (optional publisher info, etc.)
```

#### 2. Course Structure

Defines the organization and items within a course.

```
CourseStructure
├── organizationId: string (from manifest <organization identifier="">)
├── organizationTitle: string
├── items: [CourseItem] (ordered list)
│
└── sequencingCollection: [SequencingDefinition] (SCORM 2004 only, for reusable rules)
```

#### 3. Course Item (SCO or Asset)

Each launchable or structural item in the course.

```
CourseItem
├── id: string (from <item identifier="">)
├── title: string
├── resourceIdentifier: string (from <item identifierref="">)
├── launchUrl: string (resolved from resource href)
├── scormType: "sco" | "asset" (SCOs are trackable, assets are not)
├── sequenceIndex: integer (order within parent)
├── parentItemId: string | null (for hierarchical structures)
├── isVisible: boolean (default true)
│
├── parameters: string (query parameters for launch URL)
├── prerequisites: string (SCORM 1.2 only, AICC script syntax)
│
│ // Read-only data from manifest (provided to SCO, not modifiable)
├── masteryScore: number | null (0-100 for 1.2, -1 to 1 scaled for 2004)
├── maxTimeAllowed: string | null (time format varies by version)
├── timeLimitAction: string | null ("exit,message", etc.)
├── dataFromLms: string | null (launch_data content)
├── completionThreshold: number | null (SCORM 2004 only, 0.0-1.0)
├── scaledPassingScore: number | null (SCORM 2004 only, -1.0 to 1.0)
│
│ // Sequencing (SCORM 2004 only)
├── sequencingRules: SequencingRules | null
├── sequencingControls: SequencingControls | null
├── rollupRules: RollupRules | null
├── objectives: [ObjectiveDefinition] | null
├── deliveryControls: DeliveryControls | null
│
└── children: [CourseItem] (for nested items)
```

#### 4. Learner

Basic learner information.

```
Learner
├── id: string (unique identifier in your system)
├── displayName: string (format for SCORM: "Last, First" for 1.2, any format for 2004)
├── email: string | null
└── externalId: string | null (if synced from external system)
```

#### 5. Course Registration

Links a learner to a course (enrollment).

```
CourseRegistration
├── id: string (unique identifier)
├── courseId: string (references Course)
├── learnerId: string (references Learner)
├── registeredAt: timestamp
├── expiresAt: timestamp | null
│
├── currentAttempt: integer (1-based, increments on new attempt)
├── currentScoId: string | null (last/current SCO)
│
│ // Course-level rollup (calculated from SCO states)
├── overallStatus: string ("not_started" | "in_progress" | "completed" | "passed" | "failed")
├── overallScore: number | null
├── totalTimeSeconds: number
│
├── startedAt: timestamp | null
├── completedAt: timestamp | null
└── lastAccessedAt: timestamp | null
```

#### 6. Attempt

Represents a single attempt at a course (may contain multiple SCO attempts).

```
Attempt
├── id: string (unique identifier)
├── registrationId: string (references CourseRegistration)
├── attemptNumber: integer (1, 2, 3, ...)
├── startedAt: timestamp
├── completedAt: timestamp | null
├── status: string ("active" | "suspended" | "completed" | "abandoned")
│
│ // Sequencing state (SCORM 2004 only)
├── sequencingState: SequencingState | null
└── globalObjectives: GlobalObjectiveState | null
```

#### 7. SCO Attempt State

The runtime data for a single SCO within an attempt.

```
ScoAttemptState
├── id: string (unique identifier)
├── attemptId: string (references Attempt)
├── scoId: string (references CourseItem)
├── attemptNumber: integer (attempt at this specific SCO)
│
│ // Core tracking data
├── completionStatus: string
├── successStatus: string
├── lessonStatus: string (SCORM 1.2 only, combined field)
├── location: string | null (bookmark, max 255 chars for 1.2, 1000 for 2004)
├── suspendData: string | null (max 4096 chars for 1.2, 64000 for 2004)
│
│ // Score data
├── scoreRaw: number | null
├── scoreMin: number | null
├── scoreMax: number | null
├── scoreScaled: number | null (SCORM 2004 only, -1.0 to 1.0)
│
│ // Progress (SCORM 2004 only)
├── progressMeasure: number | null (0.0 to 1.0)
│
│ // Time tracking
├── totalTimeSeconds: number (accumulated across sessions)
├── sessionTimeSeconds: number (current/last session)
│
│ // Entry tracking
├── entryMode: string ("ab-initio" | "resume" | "")
├── exitMode: string ("" | "suspend" | "logout" | "normal" | "timeout" for 2004)
│
│ // Detailed runtime data (store as structured data or JSON)
├── objectives: [ObjectiveState]
├── interactions: [InteractionState]
├── comments: [CommentState] | null (SCORM 2004)
├── learnerPreferences: LearnerPreferenceState
│
│ // Session tracking
├── firstLaunchedAt: timestamp | null
├── lastLaunchedAt: timestamp | null
├── lastCommitAt: timestamp | null
├── sessionCount: integer
│
│ // Full CMI snapshot (optional, for debugging/audit)
└── rawCmiData: object | null
```

#### 8. Objective State

Per-objective tracking data.

```
ObjectiveState
├── id: string (objective identifier, required for SCORM 2004)
├── index: integer (position in objectives array)
│
│ // SCORM 1.2 fields
├── score_raw: number | null
├── score_min: number | null
├── score_max: number | null
├── status: string | null ("passed", "completed", "failed", etc.)
│
│ // SCORM 2004 fields
├── success_status: string | null ("passed", "failed", "unknown")
├── completion_status: string | null ("completed", "incomplete", "not attempted", "unknown")
├── progress_measure: number | null (0.0 to 1.0)
├── score_scaled: number | null (-1.0 to 1.0)
├── description: string | null (localizable)
│
└── isGlobal: boolean (true if this is a shared global objective)
```

#### 9. Interaction State

Question/interaction response data.

```
InteractionState
├── id: string (interaction identifier)
├── index: integer (position in interactions array)
├── type: string ("true-false", "choice", "fill-in", "long-fill-in", "matching", "performance", "sequencing", "likert", "numeric", "other")
├── timestamp: string (ISO 8601 for 2004, CMITime for 1.2)
├── weighting: number | null
├── learner_response: string (encoded per type)
├── result: string ("correct", "incorrect", "unanticipated", "neutral", or numeric)
├── latency: string (time format)
├── description: string | null (SCORM 2004)
├── correct_responses: [CorrectResponsePattern]
└── objectives: [string] (objective IDs this interaction relates to)
```

#### 10. Global Objective State (SCORM 2004 Only)

Objectives shared across multiple SCOs.

```
GlobalObjectiveState
├── attemptId: string (references Attempt)
├── objectiveId: string (global objective identifier from manifest)
│
├── success_status: string | null
├── completion_status: string | null
├── progress_measure: number | null
├── score_scaled: number | null
├── score_raw: number | null
├── score_min: number | null
└── score_max: number | null
```

#### 11. Sequencing State (SCORM 2004 Only)

Runtime sequencing state for a course attempt.

```
SequencingState
├── attemptId: string (references Attempt)
├── currentActivityId: string | null
├── suspendedActivityId: string | null
│
│ // Per-activity tracking
├── activityStates: [ActivityState]
│
│ // Serialized state (if using library's built-in serialization)
└── serializedState: string | null
```

```
ActivityState
├── activityId: string
├── isActive: boolean
├── isSuspended: boolean
├── attemptCount: integer
├── attemptAbsoluteDuration: number (seconds)
├── attemptExperiencedDuration: number (seconds)
│
├── completionStatus: string
├── progressMeasure: number | null
├── completionSetByContent: boolean
│
├── objectiveSatisfied: boolean | null
├── objectiveMeasure: number | null
├── objectiveSetByContent: boolean
│
└── objectiveStates: [ActivityObjectiveState]
```

#### 12. Learner Preferences

Per-learner preferences that may persist across SCOs.

```
LearnerPreferenceState
│ // SCORM 1.2
├── audio: number | null (-1 to 100, -1 = off)
├── language: string | null (ISO language code)
├── speed: number | null (-100 to 100)
├── text: number | null (-1 to 1, -1 = off)
│
│ // SCORM 2004 (different data types than 1.2)
├── audio_level: number | null (0.0+, default: 1.0)
├── audio_captioning: integer | null (-1, 0, or 1; default: 0)
│   // -1 = no preference, 0 = captioning off, 1 = captioning on
├── delivery_speed: number | null (0.0+, default: 1.0)
└── language: string | null (ISO language code, default: "")
```

### Entity Relationships

```
Course (1) ─────────────────────────── (N) CourseItem
   │                                         │
   │                                         │ (self-referencing for hierarchy)
   │                                         │
   └──── (N) CourseRegistration             └── (1) Parent CourseItem
              │
              │
              └──── (N) Attempt
                         │
                         ├──── (N) ScoAttemptState
                         │           │
                         │           ├── (N) ObjectiveState
                         │           └── (N) InteractionState
                         │
                         ├──── (1) SequencingState (SCORM 2004)
                         │           │
                         │           └── (N) ActivityState
                         │
                         └──── (N) GlobalObjectiveState (SCORM 2004)

Learner (1) ──── (N) CourseRegistration
```

---

## SCORM 1.2 Integration

### SCORM 1.2 Single-SCO Launches

#### Data Required at Launch

The LMS must provide the following data before the SCO calls `LMSInitialize()`:

| Data Element | CMI Path | Source | Required | Notes |
|--------------|----------|--------|----------|-------|
| Student ID | `cmi.core.student_id` | Learner entity | **Yes** | Unique learner identifier |
| Student Name | `cmi.core.student_name` | Learner entity | **Yes** | Format: "Last, First" |
| Lesson Status | `cmi.core.lesson_status` | Previous ScoAttemptState | No | Empty if new attempt |
| Lesson Location | `cmi.core.lesson_location` | Previous ScoAttemptState | No | Bookmark, max 255 chars |
| Lesson Mode | `cmi.core.lesson_mode` | LMS Decision | **Yes** | "normal", "browse", "review" |
| Credit | `cmi.core.credit` | LMS Decision | **Yes** | "credit" or "no-credit" |
| Entry | `cmi.core.entry` | LMS Decision | **Yes** | "ab-initio" or "resume" |
| Total Time | `cmi.core.total_time` | Previous ScoAttemptState | No | Format: HHHH:MM:SS.SS |
| Score Raw | `cmi.core.score.raw` | Previous ScoAttemptState | No | Must be 0-100 range |
| Score Min | `cmi.core.score.min` | Previous ScoAttemptState | No | Must be 0-100 range |
| Score Max | `cmi.core.score.max` | Previous ScoAttemptState | No | Must be 0-100 range |
| Suspend Data | `cmi.suspend_data` | Previous ScoAttemptState | No | Max 4096 chars |
| Launch Data | `cmi.launch_data` | CourseItem.dataFromLms | No | Read-only, from manifest |
| Comments | `cmi.comments` | Previous ScoAttemptState | No | Learner feedback, max 4096 chars |
| Comments from LMS | `cmi.comments_from_lms` | LMS | No | Read-only, max 4096 chars |
| Mastery Score | `cmi.student_data.mastery_score` | CourseItem.masteryScore | No | Read-only, 0-100, from manifest |
| Max Time Allowed | `cmi.student_data.max_time_allowed` | CourseItem.maxTimeAllowed | No | Read-only, format: HHHH:MM:SS |
| Time Limit Action | `cmi.student_data.time_limit_action` | CourseItem.timeLimitAction | No | Read-only, from manifest |
| Objectives | `cmi.objectives.n.*` | Previous ScoAttemptState | No | Previous objective states |
| Student Preferences | `cmi.student_preference.*` | Previous ScoAttemptState | No | audio, language, speed, text |

**Important Notes:**

- **Score Normalization**: All SCORM 1.2 scores must be normalized to 0-100 range per specification.
- **Exit Mode Values**: Valid values for `cmi.core.exit` are: `""` (empty), `"suspend"`, `"logout"`, `"time-out"`.
- **Session Time**: `cmi.core.session_time` is calculated by the library and is write-only. Only `total_time` should be persisted between sessions.

#### Launch Implementation

```javascript
// 1. Create API instance
const api = new Scorm12API({
  lmsCommitUrl: "/api/scorm/1.2/commit",
  autocommit: true,
  autocommitSeconds: 60,

  // mastery_override: When true (default), if mastery_score is set and the learner's
  // score meets or exceeds it, the API will automatically set lesson_status to "passed".
  // If the score is below mastery_score, it will be set to "failed".
  // Set to false if you want the SCO to control pass/fail status entirely.
  mastery_override: true
});

// 2. Load data before SCO starts
api.loadFromJSON({
  cmi: {
    core: {
      student_id: learner.id,
      student_name: formatName(learner),  // "Last, First"
      lesson_status: previousState?.lessonStatus || "",
      lesson_location: previousState?.location || "",
      lesson_mode: determineLessonMode(registration, sco),
      credit: determineCredit(registration),
      entry: previousState?.suspendData ? "resume" : "ab-initio",
      total_time: previousState?.totalTime || "0000:00:00.00",
      score: {
        raw: previousState?.scoreRaw?.toString() || "",
        min: previousState?.scoreMin?.toString() || "0",
        max: previousState?.scoreMax?.toString() || "100"
      }
    },
    suspend_data: previousState?.suspendData || "",
    launch_data: sco.dataFromLms || "",

    // Comments - learner feedback (read/write)
    comments: previousState?.comments || "",
    // Comments from LMS - instructor/system feedback (read-only, set before init)
    comments_from_lms: lmsComments || "",

    student_data: {
      mastery_score: sco.masteryScore?.toString() || "",
      max_time_allowed: sco.maxTimeAllowed || "",
      time_limit_action: sco.timeLimitAction || ""
    },

    // Restore objectives if resuming
    objectives: previousState?.objectives || {},

    // Restore learner preferences
    student_preference: previousState?.learnerPreferences || {
      audio: "",      // -1 to 100 (-1 = off)
      language: "",   // ISO language code
      speed: "",      // -100 to 100
      text: ""        // -1 to 1 (-1 = off)
    }
  }
});

// 3. Attach to window for SCO discovery
window.API = api;

// 4. Launch SCO in iframe
contentFrame.src = sco.launchUrl;
```

#### Handling Commit Data

When your commit endpoint receives data, extract and store:

```javascript
async function handleScorm12Commit(commitData, registration, scoId) {
  const cmi = commitData.runtimeData?.cmi || commitData.cmi;

  // Extract core data
  const scoState = {
    scoId: scoId,
    attemptId: registration.currentAttemptId,

    // Status
    lessonStatus: cmi.core?.lesson_status || "not attempted",

    // Location/Bookmark
    location: cmi.core?.lesson_location || null,
    suspendData: cmi.suspend_data || null,

    // Score (must be 0-100 range per SCORM 1.2 spec)
    scoreRaw: parseFloat(cmi.core?.score?.raw) || null,
    scoreMin: parseFloat(cmi.core?.score?.min) || null,
    scoreMax: parseFloat(cmi.core?.score?.max) || null,

    // Time (parse HHHH:MM:SS.SS format)
    // NOTE: Only persist total_time. session_time is transient and calculated
    // by the library - it represents the current session only.
    totalTimeSeconds: parseScorm12Time(cmi.core?.total_time),

    // Exit mode - determines next launch's entry value
    // Valid values: "" (normal), "suspend", "logout", "time-out"
    exitMode: cmi.core?.exit || "",

    // Comments from learner (max 4096 chars)
    comments: cmi.comments || null,

    // Objectives
    objectives: extractObjectives(cmi.objectives),

    // Interactions
    interactions: extractInteractions(cmi.interactions),

    // Preferences (persist for resume)
    learnerPreferences: {
      audio: cmi.student_preference?.audio,       // -1 to 100
      language: cmi.student_preference?.language, // ISO language code
      speed: cmi.student_preference?.speed,       // -100 to 100
      text: cmi.student_preference?.text          // -1 to 1
    },

    // Metadata
    lastCommitAt: new Date()
  };

  await saveScoAttemptState(scoState);

  // Update registration rollup
  await updateRegistrationStatus(registration, scoState);

  return { result: "true" };
}
```

---

### SCORM 1.2 Multi-SCO Launches

Multi-SCO courses require additional coordination since SCORM 1.2 has no sequencing specification.

#### Additional Storage Requirements

Per-registration, track:
- Current SCO ID
- SCO navigation order (from manifest sequence or custom LMS rules)
- Per-SCO state (as described above)
- Course-level rollup calculations

#### Launch Manager Implementation

```javascript
class Scorm12MultiScoManager {
  constructor(course, registration, learner) {
    this.course = course;
    this.registration = registration;
    this.learner = learner;
    this.currentScoId = null;
    this.api = null;
  }

  async launchSco(scoId) {
    const sco = this.course.items.find(i => i.id === scoId);
    if (!sco || sco.scormType !== 'sco') {
      throw new Error(`Invalid SCO: ${scoId}`);
    }

    // Check prerequisites (LMS-defined logic)
    if (!this.checkPrerequisites(sco)) {
      throw new Error(`Prerequisites not met for: ${scoId}`);
    }

    // Get previous state for this SCO
    const previousState = await this.getScoState(scoId);

    // If switching SCOs, reset the API
    if (this.api && this.currentScoId !== scoId) {
      this.api.reset();
    }

    // Create or reconfigure API
    if (!this.api) {
      this.api = new Scorm12API({
        lmsCommitUrl: `/api/scorm/commit/${this.registration.id}/${scoId}`,
        autocommit: true,
        autocommitSeconds: 60,

        // globalStudentPreferences: When true, learner preferences (audio, language,
        // speed, text) are stored in memory and shared across all SCOs in the session.
        // When a learner changes preferences in one SCO, those preferences are
        // automatically available when they navigate to another SCO.
        // When false (default), each SCO has isolated preferences.
        // For multi-SCO courses, this should typically be true.
        globalStudentPreferences: true
      });

      this.setupEventHandlers();
    }

    // Load SCO data
    this.api.loadFromJSON({
      cmi: {
        core: {
          student_id: this.learner.id,
          student_name: formatName(this.learner),
          lesson_status: previousState?.lessonStatus || "",
          lesson_location: previousState?.location || "",
          lesson_mode: "normal",
          credit: "credit",
          entry: previousState?.suspendData ? "resume" : "ab-initio",
          total_time: formatScorm12Time(previousState?.totalTimeSeconds || 0),
          score: {
            raw: previousState?.scoreRaw?.toString() || "",
            min: previousState?.scoreMin?.toString() || "0",
            max: previousState?.scoreMax?.toString() || "100"
          }
        },
        suspend_data: previousState?.suspendData || "",
        launch_data: sco.dataFromLms || "",
        student_data: {
          mastery_score: sco.masteryScore?.toString() || "",
          max_time_allowed: sco.maxTimeAllowed || "",
          time_limit_action: sco.timeLimitAction || ""
        }
      }
    });

    // Update tracking
    this.currentScoId = scoId;
    await this.updateRegistration({ currentScoId: scoId });

    // Launch
    window.API = this.api;
    document.getElementById('content-frame').src = sco.launchUrl;
  }

  setupEventHandlers() {
    // Handle navigation requests from content
    this.api.on('SequenceNext', () => {
      const nextSco = this.getNextSco(this.currentScoId);
      if (nextSco) {
        this.launchSco(nextSco.id);
      } else {
        this.showCourseComplete();
      }
    });

    this.api.on('SequencePrevious', () => {
      const prevSco = this.getPreviousSco(this.currentScoId);
      if (prevSco) {
        this.launchSco(prevSco.id);
      }
    });

    this.api.on('LMSFinish', async () => {
      // SCO terminated, update rollup
      await this.updateCourseRollup();
    });
  }

  checkPrerequisites(sco) {
    // Implement your prerequisite logic
    // SCORM 1.2 uses AICC script syntax in <prerequisites>
    // Most LMSs implement simpler "previous must be complete" logic
    if (!sco.prerequisites) return true;

    // Example: simple sequential prerequisite
    const prevSco = this.getPreviousSco(sco.id);
    if (prevSco) {
      const prevState = this.getScoStateSync(prevSco.id);
      return ['completed', 'passed'].includes(prevState?.lessonStatus);
    }
    return true;
  }

  async updateCourseRollup() {
    const allScoStates = await this.getAllScoStates();
    const scos = this.course.items.filter(i => i.scormType === 'sco');

    // Calculate completion
    const completedCount = allScoStates.filter(s =>
      ['completed', 'passed'].includes(s.lessonStatus)
    ).length;
    const completionPct = (completedCount / scos.length) * 100;

    // Calculate average score
    const scores = allScoStates
      .filter(s => s.scoreRaw !== null)
      .map(s => s.scoreRaw);
    const avgScore = scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : null;

    // Calculate total time
    const totalTime = allScoStates.reduce(
      (sum, s) => sum + (s.totalTimeSeconds || 0), 0
    );

    // Determine overall status
    let overallStatus = 'not_started';
    if (allScoStates.some(s => s.lessonStatus)) {
      overallStatus = 'in_progress';
    }
    if (completedCount === scos.length) {
      overallStatus = 'completed';
      // Check if all passed
      const allPassed = allScoStates.every(s =>
        s.lessonStatus === 'passed' ||
        (s.lessonStatus === 'completed' && s.scoreRaw >= (scos.find(sc => sc.id === s.scoId)?.masteryScore || 0))
      );
      if (allPassed) {
        overallStatus = 'passed';
      }
    }

    await this.updateRegistration({
      overallStatus,
      overallScore: avgScore,
      totalTimeSeconds: totalTime,
      completedAt: overallStatus === 'completed' || overallStatus === 'passed'
        ? new Date() : null
    });
  }
}
```

---

## SCORM 2004 Integration

### SCORM 2004 Single-SCO Launches

#### Data Required at Launch

| Data Element | CMI Path | Source | Required | Notes |
|--------------|----------|--------|----------|-------|
| Learner ID | `cmi.learner_id` | Learner entity | **Yes** | Unique identifier |
| Learner Name | `cmi.learner_name` | Learner entity | **Yes** | Any format (LangString) |
| Completion Status | `cmi.completion_status` | Previous state | No | "completed", "incomplete", "not attempted", "unknown" |
| Success Status | `cmi.success_status` | Previous state | No | "passed", "failed", "unknown" |
| Location | `cmi.location` | Previous state | No | Bookmark, max 1000 chars |
| Suspend Data | `cmi.suspend_data` | Previous state | No | Max 64000 chars |
| Total Time | `cmi.total_time` | Previous state | No | ISO 8601 Duration (PTnHnMnS) |
| Mode | `cmi.mode` | LMS Decision | **Yes** | "normal", "browse", "review" |
| Credit | `cmi.credit` | LMS Decision | **Yes** | "credit", "no-credit" |
| Entry | `cmi.entry` | LMS Decision | **Yes** | "ab-initio", "resume", "" |
| Launch Data | `cmi.launch_data` | CourseItem | No | Read-only, from manifest |
| Max Time Allowed | `cmi.max_time_allowed` | CourseItem | No | Read-only, ISO 8601 |
| Time Limit Action | `cmi.time_limit_action` | CourseItem | No | Read-only |
| Completion Threshold | `cmi.completion_threshold` | CourseItem | No | Read-only, 0.0-1.0 |
| Scaled Passing Score | `cmi.scaled_passing_score` | CourseItem | No | Read-only, -1.0 to 1.0 |
| Progress Measure | `cmi.progress_measure` | Previous state | No | 0.0-1.0 |
| Score (all fields) | `cmi.score.*` | Previous state | No | scaled, raw, min, max |
| Objectives | `cmi.objectives.n.*` | Previous state | No | All objective data |
| Comments from LMS | `cmi.comments_from_lms.n.*` | LMS | No | Read-only |

#### Auto-Evaluation of Status Fields

**Important:** SCORM 2004 implements automatic evaluation of `completion_status` and `success_status` based on thresholds set from the manifest. This is a critical behavior to understand:

**Completion Status Auto-Evaluation:**
When `cmi.completion_threshold` is set (from manifest `<adlcp:completionThreshold>`):
- If `cmi.progress_measure` >= `completion_threshold` → returns `"completed"`
- If `cmi.progress_measure` < `completion_threshold` → returns `"incomplete"`
- If `progress_measure` is not set → returns `"unknown"`

**Success Status Auto-Evaluation:**
When `cmi.scaled_passing_score` is set (from manifest `<imsss:minNormalizedMeasure>`):
- If `cmi.score.scaled` >= `scaled_passing_score` → returns `"passed"`
- If `cmi.score.scaled` < `scaled_passing_score` → returns `"failed"`
- If `score.scaled` is not set → returns `"unknown"`

**Implication for LMS:** The values returned by `GetValue("cmi.completion_status")` and `GetValue("cmi.success_status")` may be dynamically computed, not the stored values. Your commit handler will receive these auto-evaluated values.

#### Launch Implementation

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: "/api/scorm/2004/commit",
  autocommit: true,
  autocommitSeconds: 60
});

api.loadFromJSON({
  cmi: {
    learner_id: learner.id,
    learner_name: learner.displayName,

    // Status (may be auto-evaluated if thresholds are set)
    completion_status: previousState?.completionStatus || "unknown",
    success_status: previousState?.successStatus || "unknown",

    // Location and suspend data
    location: previousState?.location || "",
    suspend_data: previousState?.suspendData || "",

    // Time (ISO 8601 Duration format)
    total_time: previousState?.totalTime || "PT0S",

    // Mode and credit
    mode: determineLessonMode(registration, sco),
    credit: determineCredit(registration),
    // entry: "" (empty) should be used for "review" mode
    entry: determineEntry(previousState, sco.mode),

    // Manifest data (read-only, triggers auto-evaluation if set)
    launch_data: sco.dataFromLms || "",
    max_time_allowed: sco.maxTimeAllowed || "",
    time_limit_action: sco.timeLimitAction || "",
    completion_threshold: sco.completionThreshold?.toString() || "",
    scaled_passing_score: sco.scaledPassingScore?.toString() || "",

    // Progress and score
    progress_measure: previousState?.progressMeasure?.toString() || "",
    score: {
      scaled: previousState?.scoreScaled?.toString() || "",
      raw: previousState?.scoreRaw?.toString() || "",
      min: previousState?.scoreMin?.toString() || "",
      max: previousState?.scoreMax?.toString() || ""
    },

    // Complex data
    objectives: previousState?.objectives || {},
    interactions: previousState?.interactions || {},

    // Comments from LMS - array of {comment, location, timestamp}
    // Each comment has: comment (string), location (string, max 250 chars),
    // timestamp (ISO 8601 format). These are read-only after initialization.
    comments_from_lms: lmsComments || {},

    // Comments from learner - can be set by SCO
    comments_from_learner: previousState?.commentsFromLearner || {},

    // Learner preferences with correct default values
    learner_preference: previousState?.learnerPreferences || {
      audio_level: "1",         // 0.0+ (default: 1.0)
      audio_captioning: "0",    // -1, 0, or 1 (default: 0 = off)
      delivery_speed: "1",      // 0.0+ (default: 1.0)
      language: ""              // ISO language code (default: "")
    }
  }
});

window.API_1484_11 = api;
contentFrame.src = sco.launchUrl;
```

#### Objective ID Immutability

**Important:** In SCORM 2004, once `cmi.objectives.n.id` is set, it cannot be changed. Attempting to change an objective ID will result in error code 351 (GENERAL_SET_FAILURE). Objective IDs must be set before other objective properties. This is per SCORM 2004 specification.

---

### SCORM 2004 Multi-SCO Launches

Similar to single-SCO but with:
- API reset between SCO transitions
- State management per SCO
- Course-level rollup

This is appropriate when the course has multiple SCOs but does NOT use SCORM 2004 sequencing.

---

### SCORM 2004 Sequenced Modules

Sequenced courses use the SCORM 2004 Sequencing and Navigation specification. The library handles sequencing logic internally.

#### Additional Manifest Data Required

Parse from `<imsss:sequencing>` elements:

```javascript
// Activity tree structure
const activityTree = {
  id: "root",
  title: organization.title,
  children: parseItems(organization.items),
  sequencingControls: parseControlMode(organization),
  sequencingRules: parseSequencingRules(organization),
  rollupRules: parseRollupRules(organization),
  objectives: parseObjectives(organization)
};

// Helper to parse items recursively
function parseItems(items) {
  return items.map(item => ({
    id: item.identifier,
    title: item.title,
    isVisible: item.isvisible !== "false",
    children: item.children ? parseItems(item.children) : [],

    // Sequencing data
    sequencingControls: parseControlMode(item),
    sequencingRules: parseSequencingRules(item),
    rollupRules: parseRollupRules(item),
    objectives: parseObjectives(item),

    // Time limits
    attemptAbsoluteDurationLimit: item.attemptAbsoluteDurationLimit,
    attemptExperiencedDurationLimit: item.attemptExperiencedDurationLimit,
    beginTimeLimit: item.beginTimeLimit,
    endTimeLimit: item.endTimeLimit,

    // Delivery controls
    deliveryControls: {
      completionSetByContent: item.completionSetByContent !== "false",
      objectiveSetByContent: item.objectiveSetByContent !== "false"
    }
  }));
}
```

#### Sequencing Configuration

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: "/api/scorm/2004/commit",

  // Sequencing configuration
  sequencing: {
    activityTree: activityTree,

    // Optional: provide time functions
    now: () => new Date(),
    getAttemptElapsedSeconds: (activity) => {
      return getElapsedSecondsForActivity(activity.id);
    },

    // Event listeners for LMS coordination
    eventListeners: {
      // Called when a new activity should be delivered
      onActivityDelivery: (activity) => {
        console.log(`Deliver activity: ${activity.id}`);
        launchActivityContent(activity);
      },

      // Called when navigation validity changes (for UI updates)
      onNavigationValidityUpdate: (validity) => {
        updateNavigationUI({
          canContinue: validity.continue,
          canPrevious: validity.previous,
          choiceTargets: validity.choice,
          jumpTargets: validity.jump
        });
      },

      // Called when rollup completes
      onRollupComplete: (rootActivity) => {
        console.log('Rollup complete, root status:', rootActivity.completionStatus);
      }
    }
  },

  // Valid SCO IDs for navigation validation
  scoItemIds: extractScoIds(activityTree),

  // Or provide custom validator
  scoItemIdValidator: (scoId) => {
    return database.validateScoId(scoId);
  },

  // Global objectives that persist across SCOs
  globalObjectiveIds: extractGlobalObjectiveIds(activityTree)
});
```

#### Global Objectives

Global objectives require special handling:

**Identifying Global Objectives (from manifest):**
```xml
<imsss:objectives>
  <imsss:primaryObjective objectiveID="primary-obj" satisfiedByMeasure="true">
    <imsss:mapInfo targetObjectiveID="global-objective-1" readSatisfiedStatus="true" writeSatisfiedStatus="true"/>
  </imsss:primaryObjective>
</imsss:objectives>
```

**Storing Global Objectives:**
```javascript
// When handling commit data
async function handleSequencedCommit(commitData, registration) {
  const cmi = commitData.runtimeData?.cmi;
  const globalObjectiveIds = registration.globalObjectiveIds;

  // Save SCO-specific data
  await saveScoAttemptState(commitData.scoId, cmi);

  // Extract and save global objectives separately
  if (cmi.objectives) {
    for (const [index, obj] of Object.entries(cmi.objectives)) {
      if (globalObjectiveIds.includes(obj.id)) {
        await saveGlobalObjective(registration.attemptId, obj);
      }
    }
  }
}

// When launching a SCO, merge global objectives
async function prepareObjectivesForLaunch(scoId, attemptId, globalObjectiveIds) {
  const localObjectives = await getScoObjectives(scoId, attemptId);
  const globalObjectives = await getGlobalObjectives(attemptId);

  // Merge global objectives into local array based on mapInfo
  const merged = { ...localObjectives };
  let nextIndex = Object.keys(merged).length;

  for (const globalObj of globalObjectives) {
    // Check if this SCO references this global objective
    if (scoReferencesGlobalObjective(scoId, globalObj.id)) {
      // Find or create slot
      const existingIndex = Object.entries(merged)
        .find(([_, obj]) => obj.id === globalObj.id)?.[0];

      if (existingIndex !== undefined) {
        merged[existingIndex] = { ...merged[existingIndex], ...globalObj };
      } else {
        merged[nextIndex++] = globalObj;
      }
    }
  }

  return merged;
}
```

#### Sequencing State Persistence

```javascript
// Configure state persistence callbacks
const api = new Scorm2004API({
  // ... other settings ...

  sequencingStatePersistence: {
    persistence: {
      saveState: async (stateData, metadata) => {
        await database.saveSequencingState({
          learnerId: metadata.learnerId,
          courseId: metadata.courseId,
          attemptNumber: metadata.attemptNumber,
          stateData: stateData,  // Serialized string
          updatedAt: new Date()
        });
        return true;
      },

      loadState: async (metadata) => {
        const record = await database.getSequencingState({
          learnerId: metadata.learnerId,
          courseId: metadata.courseId,
          attemptNumber: metadata.attemptNumber
        });
        return record?.stateData || null;
      },

      clearState: async (metadata) => {
        await database.deleteSequencingState({
          learnerId: metadata.learnerId,
          courseId: metadata.courseId,
          attemptNumber: metadata.attemptNumber
        });
        return true;
      }
    },

    autoSaveOn: 'commit',  // Save on every commit
    compress: true,         // Compress state data
    maxStateSize: 50000     // Max 50KB
  }
});
```

#### Handling Activity Transitions

```javascript
// Listen for sequencing events
api.on('SequenceNext', () => {
  // Library handles this internally if sequencing is configured
  // The onActivityDelivery callback will be invoked
});

api.on('SequenceChoice', (eventName, element, targetId) => {
  // Content requested specific activity
  console.log(`Choice navigation to: ${targetId}`);
});

api.on('SequenceExit', () => {
  // Exit current activity
});

api.on('SequenceExitAll', () => {
  // Exit entire course
  showCourseExitScreen();
});

// When transitioning between activities:
async function onActivityDelivery(activity) {
  // 1. Get previous state for this activity
  const previousState = await getScoAttemptState(
    registration.currentAttemptId,
    activity.id
  );

  // 2. Get global objectives
  const globalObjectives = await prepareObjectivesForLaunch(
    activity.id,
    registration.currentAttemptId,
    registration.globalObjectiveIds
  );

  // 3. Reset API for new activity
  api.reset({
    // Preserve sequencing settings
    sequencing: api.settings.sequencing
  });

  // 4. Load new activity data
  api.loadFromJSON({
    cmi: {
      learner_id: learner.id,
      learner_name: learner.displayName,
      entry: previousState?.suspendData ? "resume" : "ab-initio",
      // ... other CMI data from previousState
      objectives: globalObjectives
    }
  });

  // 5. Launch content
  contentFrame.src = activity.launchUrl;
}
```

---

## Commit Endpoint Specification

### Request Format

**URL:** Configurable via `lmsCommitUrl` setting

**Method:** POST

**Content-Type:** Depends on `commitRequestDataType` setting (default: `application/json`)

**Body Format:** Depends on `dataCommitFormat` setting:

#### JSON Format (default, `dataCommitFormat: "json"`)

```json
{
  "successStatus": "passed",
  "completionStatus": "completed",
  "totalTimeSeconds": 3600,
  "score": {
    "raw": 85,
    "min": 0,
    "max": 100,
    "scaled": 0.85
  },
  "runtimeData": {
    "cmi": {
      "completion_status": "completed",
      "success_status": "passed",
      "location": "page_15",
      "suspend_data": "base64encodeddata...",
      "score": {
        "scaled": "0.85",
        "raw": "85",
        "min": "0",
        "max": "100"
      },
      "objectives": {
        "0": {
          "id": "obj-1",
          "success_status": "passed",
          "completion_status": "completed",
          "score": { "scaled": "0.9" }
        }
      },
      "interactions": {
        "0": {
          "id": "q1",
          "type": "choice",
          "learner_response": "a",
          "result": "correct"
        }
      }
    },
    "adl": {
      "nav": {
        "request": "continue"
      }
    }
  },
  "courseId": "course-123",
  "scoId": "sco-456",
  "learnerId": "learner-789",
  "learnerName": "John Smith"
}
```

#### Flattened Format (`dataCommitFormat: "flattened"`)

```json
{
  "cmi.completion_status": "completed",
  "cmi.success_status": "passed",
  "cmi.score.scaled": "0.85",
  "cmi.score.raw": "85",
  "cmi.objectives.0.id": "obj-1",
  "cmi.objectives.0.success_status": "passed"
}
```

#### Params Format (`dataCommitFormat: "params"`)

```
cmi.completion_status=completed&cmi.success_status=passed&cmi.score.scaled=0.85
```

### Response Format

**Success Response:**
```json
{
  "result": "true"
}
```

**Error Response:**
```json
{
  "result": "false",
  "errorCode": 391,
  "errorMessage": "Database write failed"
}
```

### Termination Commits

On `Terminate()` / `LMSFinish()`, the library uses `navigator.sendBeacon()` for reliability. This is a fire-and-forget request that doesn't wait for response.

**Important:** Ensure your endpoint can handle beacon requests (no response expected, small payload).

### Custom Response Handling

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: "/api/scorm/commit",

  // For synchronous XMLHttpRequest (default)
  xhrResponseHandler: (xhr) => {
    const response = JSON.parse(xhr.responseText);
    return {
      result: response.success ? "true" : "false",
      errorCode: response.error?.code || 0
    };
  },

  // For fetch API (if useAsynchronousCommits: true)
  responseHandler: async (response) => {
    const data = await response.json();
    return {
      result: data.success ? "true" : "false",
      errorCode: data.error?.code || 0
    };
  }
});
```

---

## Entry Mode Decision Logic

The `entry` field tells the SCO whether this is a fresh start or resume.

### Decision Matrix

| Condition | Entry Value |
|-----------|-------------|
| First launch ever, no previous data | `"ab-initio"` |
| Previous exit was `"suspend"` | `"resume"` |
| Previous exit was `"suspend"` with suspend_data | `"resume"` |
| Previous exit was `""` (normal) | `"ab-initio"` or `""` |
| Previous exit was `"logout"` | `"ab-initio"` or `""` |
| Previous exit was `"time-out"` (SCORM 2004) | LMS decision |
| Learner explicitly starting new attempt | `"ab-initio"` |
| Lesson mode is `"review"` | `""` (empty) |

### Implementation

```javascript
function determineEntry(previousState, lessonMode) {
  // Review mode doesn't use entry
  if (lessonMode === "review") {
    return "";
  }

  // No previous state = new attempt
  if (!previousState) {
    return "ab-initio";
  }

  // Check exit mode from previous session
  const exitMode = previousState.exitMode;

  // SCORM 1.2
  if (exitMode === "suspend" || previousState.suspendData) {
    return "resume";
  }

  // SCORM 2004 adds more exit types
  if (exitMode === "suspend") {
    return "resume";
  }

  // Normal completion or logout = new attempt
  return "ab-initio";
}
```

---

## Error Handling

### API Error Codes

The library returns specific error codes. Your endpoint should handle:

| Code | Meaning | LMS Action |
|------|---------|------------|
| 0 | No error | Success |
| 101 | General exception | Log and retry |
| 301 | Not initialized | Log error |
| 391 | General commit failure | Retry with backoff |
| 405 | Write-only element | N/A (API prevents) |

### Commit Failure Handling

```javascript
// The library handles commit failures internally
// Your endpoint should return meaningful errors

async function commitHandler(req, res) {
  try {
    await saveData(req.body);
    res.json({ result: "true" });
  } catch (error) {
    console.error('Commit failed:', error);

    // Return structured error
    res.status(200).json({  // Note: Still 200 status
      result: "false",
      errorCode: 391,
      errorMessage: error.message
    });
  }
}
```

### Network Failure Handling

For termination commits using `sendBeacon`:
- No response is received
- Implement server-side retry logic
- Use idempotency keys to prevent duplicates

```javascript
const api = new Scorm2004API({
  lmsCommitUrl: "/api/scorm/commit",

  // Transform request to include idempotency key
  requestHandler: (commitObject) => {
    return {
      ...commitObject,
      idempotencyKey: generateUUID(),
      timestamp: Date.now()
    };
  }
});
```

---

## Session Management

### Multiple Concurrent Sessions

If a learner might have multiple browser tabs/windows:

1. **Use session identifiers**
```javascript
const sessionId = generateUUID();
api.loadFromJSON({
  cmi: {
    // ... other data
  }
});

// Include session ID in commits via requestHandler
```

2. **Detect stale sessions**
```javascript
// On commit, check if this session is still active
async function commitHandler(data) {
  const activeSession = await getActiveSession(data.learnerId, data.courseId);

  if (activeSession && activeSession.id !== data.sessionId) {
    // Another session is active
    return {
      result: "false",
      errorCode: 391,
      errorMessage: "Session expired"
    };
  }

  // Process commit...
}
```

### Browser Close Handling

The library uses `sendBeacon` for termination to survive browser close, but:

1. **Implement auto-commit**
```javascript
const api = new Scorm2004API({
  autocommit: true,
  autocommitSeconds: 30  // Commit every 30 seconds
});
```

2. **Handle incomplete sessions**
```javascript
// Scheduled job to clean up abandoned sessions
async function cleanupAbandonedSessions() {
  const staleThreshold = Date.now() - (30 * 60 * 1000); // 30 minutes

  const staleSessions = await database.findSessions({
    lastCommitAt: { $lt: new Date(staleThreshold) },
    status: 'active'
  });

  for (const session of staleSessions) {
    await database.updateSession(session.id, {
      status: 'abandoned',
      exitMode: 'abnormal'
    });
  }
}
```

---

## Integration Checklists

### SCORM 1.2 Single-SCO Checklist

**Package Import:**
- [ ] Parse `<organization>` for structure
- [ ] Extract `<item>` metadata (title, identifier, identifierref)
- [ ] Parse `<adlcp:masteryscore>` from resources
- [ ] Parse `<adlcp:maxtimeallowed>`
- [ ] Parse `<adlcp:timelimitaction>`
- [ ] Parse `<adlcp:datafromlms>`
- [ ] Resolve launch URL from resource href

**Storage Setup:**
- [ ] Create Course record
- [ ] Create CourseItem records
- [ ] Learner registration mechanism
- [ ] ScoAttemptState storage

**Runtime - Launch:**
- [ ] Create/configure Scorm12API instance
- [ ] Set `lmsCommitUrl`
- [ ] Load learner info (`student_id`, `student_name`)
- [ ] Load previous state if resuming
- [ ] Load manifest data (`mastery_score`, `launch_data`, etc.)
- [ ] Determine `entry` mode
- [ ] Determine `lesson_mode` and `credit`
- [ ] Attach API to `window.API`
- [ ] Launch SCO in iframe

**Runtime - Commit:**
- [ ] Endpoint receives POST requests
- [ ] Parse CMI data from request body
- [ ] Extract `lesson_status`, `location`, `suspend_data`
- [ ] Extract score data
- [ ] Parse time values
- [ ] Save to ScoAttemptState
- [ ] Return success/failure response

**Runtime - Termination:**
- [ ] Handle `sendBeacon` requests
- [ ] Update final state
- [ ] Calculate total time
- [ ] Update registration status

---

### SCORM 1.2 Multi-SCO Checklist

All of the above, plus:

**Package Import:**
- [ ] Parse all `<item>` elements (ordered)
- [ ] Handle nested items if present
- [ ] Parse `<prerequisites>` elements
- [ ] Store sequence/order information

**Storage:**
- [ ] Track state per SCO
- [ ] Store current SCO pointer
- [ ] Course-level rollup fields

**Runtime:**
- [ ] Enable `globalStudentPreferences: true`
- [ ] Implement SCO navigation (next/previous)
- [ ] Implement prerequisite checking
- [ ] Call `api.reset()` between SCOs
- [ ] Calculate course rollup on commit

---

### SCORM 2004 Single-SCO Checklist

**Package Import:**
- [ ] Parse SCORM 2004 namespace elements
- [ ] Extract `<adlcp:completionThreshold>`
- [ ] Extract `<imsss:minNormalizedMeasure>` (scaled passing score)
- [ ] Parse time limits (ISO 8601 format)

**Storage:**
- [ ] Support larger suspend_data (64KB)
- [ ] Store scaled scores (-1 to 1)
- [ ] Store progress_measure
- [ ] Separate completion_status and success_status
- [ ] Store objectives with full data model
- [ ] Store interactions with full data model

**Runtime:**
- [ ] Create Scorm2004API instance
- [ ] Attach to `window.API_1484_11`
- [ ] Load all SCORM 2004 CMI fields
- [ ] Handle auto-completion based on threshold
- [ ] Handle auto-pass/fail based on scaled_passing_score

---

### SCORM 2004 Sequenced Checklist

All of the above, plus:

**Package Import:**
- [ ] Parse `<imsss:sequencing>` elements
- [ ] Parse `<imsss:controlMode>` attributes
- [ ] Parse `<imsss:sequencingRules>` (pre/post/exit)
- [ ] Parse `<imsss:rollupRules>`
- [ ] Parse `<imsss:objectives>` with `<imsss:mapInfo>`
- [ ] Identify global objectives
- [ ] Parse `<imsss:deliveryControls>`
- [ ] Build complete activity tree

**Storage:**
- [ ] Store sequencing configuration
- [ ] Store global objectives separately
- [ ] Store per-activity state
- [ ] Store sequencing runtime state

**Runtime Configuration:**
- [ ] Configure `sequencing.activityTree`
- [ ] Configure `sequencing.eventListeners`
- [ ] Set `scoItemIds` or `scoItemIdValidator`
- [ ] Set `globalObjectiveIds`
- [ ] Configure `sequencingStatePersistence` if needed

**Runtime Handling:**
- [ ] Handle `onActivityDelivery` callback
- [ ] Handle `onNavigationValidityUpdate` for UI
- [ ] Merge global objectives on SCO launch
- [ ] Extract global objectives on commit
- [ ] Reset API between activity transitions
- [ ] Preserve sequencing state across sessions

---

## API Settings Reference

This section documents all configuration settings available when creating API instances.

### Core Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `lmsCommitUrl` | `string \| false` | `false` | URL for commit endpoint. Set to `false` to disable HTTP commits. |
| `autocommit` | `boolean` | `false` | Enable periodic auto-commit to LMS. |
| `autocommitSeconds` | `number` | `60` | Interval in seconds between auto-commits. |
| `dataCommitFormat` | `string` | `"json"` | Format for commit data: `"json"`, `"flattened"`, or `"params"`. |
| `commitRequestDataType` | `string` | `"application/json"` | Content-Type header for commit requests. |
| `sendFullCommit` | `boolean` | `true` | Send full CMI data on every commit vs. only changed values. |

### HTTP Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `useAsynchronousCommits` | `boolean` | `false` | Use async fetch instead of sync XMLHttpRequest. **Note:** Async mode returns optimistic success; actual result comes via events. |
| `throttleCommits` | `boolean` | `false` | Throttle rapid successive commits (only with async mode). |
| `xhrHeaders` | `object` | `{}` | Custom headers to include in commit requests. |
| `xhrWithCredentials` | `boolean` | `false` | Include credentials (cookies) in cross-origin requests. |
| `fetchMode` | `string` | `"cors"` | Fetch mode for async requests: `"cors"`, `"no-cors"`, `"same-origin"`, `"navigate"`. |
| `useBeaconInsteadOfFetch` | `string` | `"on-terminate"` | When to use sendBeacon: `"always"`, `"on-terminate"`, `"never"`. |
| `httpService` | `IHttpService \| null` | `null` | Custom HTTP service implementation. |

### Response Handlers

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `responseHandler` | `function` | Built-in | Custom handler for fetch responses: `(response: Response) => Promise<ResultObject>` |
| `xhrResponseHandler` | `function` | Built-in | Custom handler for XHR responses: `(xhr: XMLHttpRequest) => ResultObject` |
| `requestHandler` | `function` | Identity | Transform commit object before sending: `(commitObject) => transformedObject` |

### Logging

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `logLevel` | `LogLevel` | `4` (ERROR) | Logging verbosity: `1`/`"DEBUG"`, `2`/`"INFO"`, `3`/`"WARN"`, `4`/`"ERROR"`, `5`/`"NONE"` |
| `onLogMessage` | `function` | `undefined` | Custom log handler: `(level: LogLevel, message: string) => void` |

### SCORM 1.2 Specific Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `mastery_override` | `boolean` | `true` | When mastery_score is set, auto-set lesson_status to "passed"/"failed" based on score. |
| `autoCompleteLessonStatus` | `boolean` | `true` | Auto-set lesson_status to "completed" on LMSFinish if no status was set by content. |
| `globalStudentPreferences` | `boolean` | `false` | Share student_preference values across SCOs within a session (for multi-SCO). |

### SCORM 2004 Specific Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `score_overrides_status` | `boolean` | `false` | Allow score to override success_status even when status is already set. |
| `completion_status_on_failed` | `string` | `undefined` | Set completion_status to this value (`"completed"` or `"incomplete"`) when success_status is "failed". |
| `autoProgress` | `boolean` | `false` | Auto-progress through activities on completion (requires sequencing). |

### Time Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `selfReportSessionTime` | `boolean` | `false` | Allow content to set session_time directly instead of library calculating it. |
| `alwaysSendTotalTime` | `boolean` | `false` | Always include total_time in commits, even if unchanged. |

### Error Handling

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `strict_errors` | `boolean` | `true` | Strictly validate all data model operations per SCORM spec. |

### Commit Metadata Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `renderCommonCommitFields` | `boolean` | `true` | Include `successStatus`, `completionStatus`, `totalTimeSeconds`, `score` at top level of commit. |
| `autoPopulateCommitMetadata` | `boolean` | `false` | Include `courseId`, `scoId`, `learnerId`, `learnerName` in commit object. |
| `courseId` | `string` | `undefined` | Course identifier for commit metadata. |
| `scoId` | `string` | `undefined` | SCO identifier for commit metadata. |

### Navigation Validation Settings (SCORM 2004)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `scoItemIds` | `string[]` | `undefined` | Valid SCO item IDs for navigation validation. |
| `scoItemIdValidator` | `function \| false` | `undefined` | Custom validator: `(scoItemId: string) => boolean`. Set to `false` to disable. |
| `globalObjectiveIds` | `string[]` | `undefined` | IDs of objectives shared across SCOs. |

### Sequencing Settings (SCORM 2004)

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `sequencing` | `SequencingSettings` | `undefined` | Full sequencing configuration object. See [Sequencing Configuration](#sequencing-configuration-reference). |
| `sequencingStatePersistence` | `object` | `undefined` | Callbacks for persisting/loading sequencing state. See [Sequencing State Persistence](#sequencing-state-persistence). |

### Offline Support Settings

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `enableOfflineSupport` | `boolean` | `false` | Enable offline data storage and sync. |
| `syncOnInitialize` | `boolean` | `true` | Attempt to sync offline data on Initialize. |
| `syncOnTerminate` | `boolean` | `true` | Attempt to sync offline data on Terminate. |
| `maxSyncAttempts` | `number` | `3` | Maximum retry attempts for sync operations. |

---

## Sequencing Events Reference (SCORM 2004)

The sequencing engine emits events for LMS coordination. Configure listeners via `sequencing.eventListeners`.

### Navigation Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `onNavigationRequest` | `(request: string, target?: string) => void` | Navigation request received from content (continue, previous, choice, etc.) |
| `onNavigationRequestProcessing` | `(data: {request, targetActivityId}) => void` | Navigation request is being processed |
| `onNavigationValidityUpdate` | `(data: {currentActivity, validRequests}) => void` | Valid navigation options changed (for UI updates) |

### Activity Lifecycle Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `onSequencingStart` | `(activity: Activity) => void` | Sequencing session started |
| `onSequencingEnd` | `() => void` | Sequencing session ended |
| `onActivityDelivery` | `(activity: Activity) => void` | **Critical:** Activity should be delivered to learner |
| `onActivityUnload` | `(activity: Activity) => void` | Activity is being unloaded |
| `onActivitySuspended` | `(data: {activity}) => void` | Activity was suspended |
| `onSuspendedActivityCleanup` | `(data: {activity}) => void` | Suspended activity state was cleaned up |

### Rollup Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `onRollupComplete` | `(activity: Activity) => void` | Rollup calculation completed |
| `onAutoCompletion` | `(data: {activity, completionStatus}) => void` | Activity auto-completed based on children |
| `onAutoSatisfaction` | `(data: {activity, satisfiedStatus}) => void` | Activity auto-satisfied based on measure |

### Termination Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `onTerminationRequestProcessing` | `(data: {request, hasSequencingRequest, currentActivity}) => void` | Termination request being processed |
| `onSequencingSessionEnd` | `(data: {reason, exception?, navigationRequest?}) => void` | Sequencing session ended with details |
| `onPostConditionEvaluated` | `(data: {activity, result, iteration}) => void` | Post-condition rule evaluated |
| `onPostConditionExitParent` | `(data: {activity}) => void` | Post-condition triggered exit to parent |
| `onPostConditionExitAll` | `(data: {activity}) => void` | Post-condition triggered exit all |
| `onMultiLevelExitAction` | `(data: {activity}) => void` | Multi-level exit action triggered |

### Delivery Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `onDeliveryRequestProcessing` | `(data: {request, target}) => void` | Delivery request being processed |

### Global Objective Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `onGlobalObjectiveMapInitialized` | `(data: {count}) => void` | Global objective map initialized |
| `onGlobalObjectiveMapError` | `(data: {error}) => void` | Error initializing global objectives |
| `onGlobalObjectiveUpdated` | `(data: {objectiveId, field, value}) => void` | Global objective value updated |
| `onGlobalObjectiveUpdateError` | `(data: {objectiveId, error}) => void` | Error updating global objective |

### Limit Condition Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `onLimitConditionCheck` | `(data: {activity, limitType, exceeded}) => void` | Limit condition checked |

### Error and Debug Events

| Event | Callback Signature | Description |
|-------|-------------------|-------------|
| `onSequencingError` | `(error: string, context?: string) => void` | Sequencing error occurred |
| `onSuspendError` | `(data: {activity, error}) => void` | Error during suspend operation |
| `onStateInconsistency` | `(data: {activity, issue}) => void` | State inconsistency detected |
| `onSequencingDebug` | `(data: {message, context?}) => void` | Debug information (when logLevel is debug) |

### Event Configuration Example

```javascript
const api = new Scorm2004API({
  sequencing: {
    activityTree: activityTree,
    eventListeners: {
      // Critical - handle activity delivery
      onActivityDelivery: (activity) => {
        console.log(`Launching: ${activity.id}`);
        launchContent(activity);
      },

      // Update navigation UI
      onNavigationValidityUpdate: (data) => {
        setNavEnabled('continue', data.validRequests.includes('continue'));
        setNavEnabled('previous', data.validRequests.includes('previous'));
      },

      // Track completion
      onRollupComplete: (activity) => {
        if (activity.id === 'root') {
          console.log('Course rollup complete');
          updateCourseStatus(activity);
        }
      },

      // Handle session end
      onSequencingSessionEnd: (data) => {
        console.log(`Session ended: ${data.reason}`);
        if (data.reason === 'exitAll') {
          showCourseCompletionScreen();
        }
      },

      // Debug during development
      onSequencingDebug: (data) => {
        console.debug('[Sequencing]', data.message, data.context);
      }
    }
  }
});
```

---

## Sequencing Configuration Reference

### Activity Tree Structure

```javascript
{
  id: "root",                    // Activity identifier
  title: "Course Title",         // Display title
  isVisible: true,               // Visible in navigation
  isActive: false,               // Currently active
  isSuspended: false,            // Currently suspended
  attemptLimit: null,            // Max attempts (null = unlimited)
  children: [                    // Child activities
    {
      id: "module-1",
      title: "Module 1",
      children: [...],
      sequencingRules: {...},
      sequencingControls: {...},
      rollupRules: {...},
      objectives: [...]
    }
  ],
  sequencingControls: {...},
  sequencingRules: {...},
  rollupRules: {...}
}
```

### Sequencing Controls

```javascript
{
  enabled: true,                       // Enable sequencing for this activity
  choice: true,                        // Allow direct choice navigation
  choiceExit: true,                    // Allow exit via choice
  flow: true,                          // Enable continue/previous
  forwardOnly: false,                  // Restrict to forward navigation only
  preventActivation: false,            // Prevent activity activation
  constrainChoice: false,              // Constrain choice to available activities
  stopForwardTraversal: false,         // Stop forward traversal at this activity

  // Rollup controls
  rollupObjectiveSatisfied: true,      // Include in objective satisfaction rollup
  rollupProgressCompletion: true,      // Include in progress completion rollup
  objectiveMeasureWeight: 1.0,         // Weight for measure rollup

  // Selection and randomization
  selectionTiming: "once",             // When to select: "once", "onEachNewAttempt"
  selectCount: null,                   // Number of children to select (null = all)
  randomizeChildren: false,            // Randomize child order
  randomizationTiming: "once",         // When to randomize

  // Attempt info
  useCurrentAttemptObjectiveInfo: true,  // Use current attempt for objective info
  useCurrentAttemptProgressInfo: true,   // Use current attempt for progress info

  // Delivery controls (for leaf activities)
  completionSetByContent: true,        // Content sets completion (vs. LMS auto-set)
  objectiveSetByContent: true          // Content sets objective (vs. LMS auto-set)
}
```

### Sequencing Rules

```javascript
{
  preConditionRules: [                 // Evaluated before delivery
    {
      action: "skip",                  // "skip", "disabled", "hiddenFromChoice", "stopForwardTraversal"
      conditionCombination: "all",     // "all" (AND), "any" (OR)
      conditions: [
        {
          condition: "satisfied",      // See condition types below
          operator: "not",             // "not" or empty for positive
          referencedObjective: "obj-1" // Objective to check (if applicable)
        }
      ]
    }
  ],
  postConditionRules: [                // Evaluated after completion
    {
      action: "exitParent",            // "exitParent", "exitAll", "retry", "retryAll", "continue", "previous"
      conditions: [...]
    }
  ],
  exitConditionRules: [                // Evaluated on exit
    {
      action: "exit",
      conditions: [...]
    }
  ]
}
```

**Rule Condition Types:**
- `satisfied`, `objectiveStatusKnown`, `objectiveMeasureKnown`, `objectiveMeasureGreaterThan`, `objectiveMeasureLessThan`
- `completed`, `activityProgressKnown`, `attempted`, `attemptLimitExceeded`
- `timeLimitExceeded`, `outsideAvailableTimeRange`
- `always`

### Rollup Rules

```javascript
{
  rules: [
    {
      action: "satisfied",             // "satisfied", "notSatisfied", "completed", "incomplete"
      consideration: "all",            // "all", "any", "none", "atLeastCount", "atLeastPercent"
      minimumCount: 0,                 // For "atLeastCount"
      minimumPercent: 0,               // For "atLeastPercent"
      conditions: [
        {
          condition: "completed",      // "satisfied", "objectiveStatusKnown", "objectiveMeasureKnown",
                                       // "completed", "activityProgressKnown", "attempted"
          parameters: {}               // Optional parameters
        }
      ]
    }
  ]
}
```

### Objective Map Info (Global Objectives)

```javascript
{
  objectiveID: "local-objective",
  satisfiedByMeasure: true,
  minNormalizedMeasure: 0.8,
  mapInfo: [
    {
      targetObjectiveID: "global-objective-1",  // Global objective to map to
      readSatisfiedStatus: true,                // Read from global
      writeSatisfiedStatus: true,               // Write to global
      readNormalizedMeasure: true,
      writeNormalizedMeasure: true,
      readCompletionStatus: false,
      writeCompletionStatus: false,
      readProgressMeasure: false,
      writeProgressMeasure: false,
      readRawScore: false,
      writeRawScore: false,
      readMinScore: false,
      writeMinScore: false,
      readMaxScore: false,
      writeMaxScore: false
    }
  ]
}
```

---

## Commit Object Reference

The commit object sent to your endpoint contains these fields:

### Top-Level Fields (when `renderCommonCommitFields: true`)

| Field | Type | Description |
|-------|------|-------------|
| `successStatus` | `string` | `"passed"`, `"failed"`, or `"unknown"` |
| `completionStatus` | `string` | `"completed"`, `"incomplete"`, `"not attempted"`, or `"unknown"` |
| `totalTimeSeconds` | `number` | Accumulated time across all sessions |
| `score` | `object` | Optional score object with `raw`, `min`, `max`, `scaled` |

### Metadata Fields (when `autoPopulateCommitMetadata: true`)

| Field | Type | Description |
|-------|------|-------------|
| `courseId` | `string` | Course identifier |
| `scoId` | `string` | SCO identifier |
| `learnerId` | `string` | Learner identifier |
| `learnerName` | `string` | Learner display name |
| `sessionId` | `string` | Session identifier |
| `activityId` | `string` | Activity identifier (sequenced courses) |
| `attempt` | `number` | Attempt number |
| `commitId` | `string` | Unique commit identifier |

### Runtime Data

The `runtimeData` field contains the full CMI tree:

```javascript
{
  runtimeData: {
    cmi: {
      // SCORM 2004 fields
      completion_status: "completed",
      success_status: "passed",
      location: "page_15",
      suspend_data: "...",
      progress_measure: "0.85",
      score: {
        scaled: "0.85",
        raw: "85",
        min: "0",
        max: "100"
      },
      total_time: "PT1H30M",
      session_time: "PT0H15M",
      exit: "suspend",

      objectives: {
        0: {
          id: "obj-1",
          success_status: "passed",
          completion_status: "completed",
          progress_measure: "1.0",
          score: { scaled: "0.9" },
          description: "Complete module 1"
        }
      },

      interactions: {
        0: {
          id: "q1",
          type: "choice",
          timestamp: "2024-01-15T10:30:00Z",
          weighting: "1",
          learner_response: "a",
          result: "correct",
          latency: "PT0H0M5S",
          description: "Question about topic X",
          objectives: { 0: { id: "obj-1" } },
          correct_responses: { 0: { pattern: "a" } }
        }
      },

      comments_from_learner: {
        0: {
          comment: "Great course!",
          location: "module-3",
          timestamp: "2024-01-15T10:35:00Z"
        }
      },

      learner_preference: {
        audio_level: "1",
        audio_captioning: "0",
        delivery_speed: "1",
        language: "en"
      }
    },

    adl: {
      nav: {
        request: "continue",           // Navigation request from content
        request_valid: {
          continue: "true",
          previous: "true",
          choice: { "sco-2": "true" }
        }
      },
      data: {                          // Shared data across SCOs
        0: {
          id: "shared-data-1",
          store: "stored value"
        }
      }
    }
  }
}
```

### Commit Data Formats

**JSON Format** (`dataCommitFormat: "json"`):
Standard nested JSON object as shown above.

**Flattened Format** (`dataCommitFormat: "flattened"`):
```json
{
  "cmi.completion_status": "completed",
  "cmi.success_status": "passed",
  "cmi.score.scaled": "0.85",
  "cmi.objectives.0.id": "obj-1",
  "cmi.objectives.0.success_status": "passed"
}
```

**Params Format** (`dataCommitFormat: "params"`):
```
cmi.completion_status=completed&cmi.success_status=passed&cmi.score.scaled=0.85
```

### Beacon Behavior

On `Terminate()` / `LMSFinish()`, the library uses `navigator.sendBeacon()` by default (configurable via `useBeaconInsteadOfFetch`):

- **Fire-and-forget**: No response is received or expected
- **Survives page unload**: Ensures data is sent even if user closes browser
- **Small payload limit**: ~64KB maximum (varies by browser)
- **Server considerations**: Your endpoint should handle these requests idempotently

```javascript
// To always use fetch (and block on Terminate):
new Scorm2004API({
  useBeaconInsteadOfFetch: "never"
});

// To always use beacon (fire-and-forget for all commits):
new Scorm2004API({
  useBeaconInsteadOfFetch: "always"
});
```

---

## ADL Data Model Elements (SCORM 2004)

### adl.nav.request

Used by content to request navigation:

| Value | Description |
|-------|-------------|
| `"continue"` | Move to next activity |
| `"previous"` | Move to previous activity |
| `"{target=<id>}choice"` | Navigate to specific activity by ID |
| `"exit"` | Exit current activity |
| `"exitAll"` | Exit all activities and end session |
| `"abandon"` | Abandon current activity |
| `"abandonAll"` | Abandon all activities |
| `"suspendAll"` | Suspend all activities |
| `"_none_"` | No navigation request |
| `"jump"` | Jump navigation (SCORM 2004 4th edition) |

### adl.nav.request_valid

Read-only elements indicating navigation validity:

| Element | Type | Description |
|---------|------|-------------|
| `adl.nav.request_valid.continue` | `string` | `"true"` or `"false"` |
| `adl.nav.request_valid.previous` | `string` | `"true"` or `"false"` |
| `adl.nav.request_valid.choice.{target}` | `string` | `"true"` or `"false"` for each target |
| `adl.nav.request_valid.jump.{target}` | `string` | `"true"` or `"false"` (4th edition) |

### adl.data

Shared data bucket for cross-SCO communication:

| Element | Access | Description |
|---------|--------|-------------|
| `adl.data._count` | RO | Number of data stores |
| `adl.data.n.id` | RO | Data store identifier |
| `adl.data.n.store` | RW | Data store content (max 64000 chars) |

---

## Error Codes Reference

When API calls fail, `GetLastError()` returns an error code. Use these tables to understand and handle errors.

### SCORM 1.2 Error Codes

| Code | Name | Meaning | LMS Action |
|------|------|---------|------------|
| 0 | No Error | Operation succeeded | None required |
| 101 | General Exception | Unspecified error | Log and investigate |
| 201 | Invalid Argument Error | Bad parameter to API call | Check API call syntax |
| 202 | Element Cannot Have Children | Requested `.children` on leaf element | Fix CMI path |
| 203 | Element Not An Array | Requested `._count` on non-array | Fix CMI path |
| 301 | Not Initialized | API call before LMSInitialize() | Initialize first |
| 401 | Not Implemented | Element not supported | Check element name |
| 402 | Invalid Set Value | Value doesn't meet requirements | Validate value format |
| 403 | Element Is Read Only | Tried to write read-only element | Don't write to this element |
| 404 | Element Is Write Only | Tried to read write-only element | Don't read this element |
| 405 | Incorrect Data Type | Wrong value type for element | Check value format |

### SCORM 2004 Error Codes

| Code | Name | Meaning | LMS Action |
|------|------|---------|------------|
| 0 | No Error | Operation succeeded | None required |
| 101 | General Exception | Unspecified error | Log and investigate |
| 102 | General Initialization Failure | Initialize() failed | Check server connectivity |
| 103 | Already Initialized | Initialize() called twice | Ignore or fix content |
| 104 | Content Instance Terminated | API used after Terminate() | Session ended, cannot continue |
| 111 | General Termination Failure | Terminate() failed | Log error, data may be lost |
| 112 | Termination Before Initialization | Terminate() before Initialize() | Fix content |
| 113 | Termination After Termination | Terminate() called twice | Ignore |
| 122 | Retrieve Before Initialization | GetValue() before Initialize() | Initialize first |
| 123 | Retrieve After Termination | GetValue() after Terminate() | Session ended |
| 132 | Store Before Initialization | SetValue() before Initialize() | Initialize first |
| 133 | Store After Termination | SetValue() after Terminate() | Session ended |
| 142 | Commit Before Initialization | Commit() before Initialize() | Initialize first |
| 143 | Commit After Termination | Commit() after Terminate() | Session ended |
| 201 | General Argument Error | Invalid API argument | Check call syntax |
| 301 | General Get Failure | GetValue() failed | Check element path |
| 351 | General Set Failure | SetValue() failed | Check element/value |
| 391 | General Commit Failure | Commit() failed | Check server, retry |
| 401 | Undefined Data Model Element | Unknown CMI element | Check element spelling |
| 402 | Unimplemented Data Model Element | Element not supported | Use different element |
| 403 | Data Model Element Value Not Initialized | Reading unset element | Set value first or handle empty |
| 404 | Data Model Element Is Read Only | Writing read-only element | Don't write to this element |
| 405 | Data Model Element Is Write Only | Reading write-only element | Don't read this element |
| 406 | Data Model Element Type Mismatch | Wrong value type | Check expected format |
| 407 | Data Model Element Value Out Of Range | Value outside valid range | Check min/max |
| 408 | Data Model Dependency Not Established | Missing prerequisite | Set required fields first (e.g., ID before score) |

### Error Recovery Strategies

#### Transient Errors (391 - Commit Failure)

```javascript
api.on("CommitError", function() {
  const errorCode = api.GetLastError();
  if (errorCode === "391") {
    // Retry with exponential backoff
    retryCommit(attempts + 1);
  }
});
```

#### Session Errors (104, 123, 133, 143)

These indicate the session has ended. Do not retry - inform user or redirect:

```javascript
if (["104", "123", "133", "143"].includes(errorCode)) {
  showMessage("Your session has ended. Progress has been saved.");
  redirectToCourseListing();
}
```

#### Content Errors (408 - Dependency)

Common with objectives - ensure ID is set first:

```javascript
// Error 408 often means: set ID before other properties
api.SetValue("cmi.objectives.0.id", "obj_1");  // Set ID first!
api.SetValue("cmi.objectives.0.score.raw", "85");
```

---

## Offline Support Overview

Enable offline support for mobile or unreliable connectivity scenarios.

### Configuration

```javascript
const api = new Scorm2004API({
  enableOfflineSupport: true,
  courseId: "course_123",        // Required for offline storage key
  syncOnInitialize: true,        // Sync when SCO starts
  syncOnTerminate: true,         // Sync when SCO ends
  maxSyncAttempts: 5             // Retries before giving up
});
```

### Events

Listen for sync status:

```javascript
api.on("OfflineDataSynced", function() {
  hideOfflineIndicator();
});

api.on("OfflineDataSyncFailed", function() {
  showOfflineWarning("Your progress is saved locally and will sync when online.");
});
```

### How It Works

1. When offline, commits are stored in IndexedDB
2. On next Initialize (or when online), queued commits are sent
3. Failed syncs retry up to `maxSyncAttempts` times
4. Data persists locally until successfully synced

### Related Documentation

- [Offline Support Guide](/docs/advanced/offline-support) - Full offline capabilities
- [API Events Reference](./api-events-reference.md) - Offline events

---

## Data Model Practical Notes

### Session Time vs Total Time

| Field | Persistence | Calculation |
|-------|-------------|-------------|
| `session_time` | Don't persist | Calculated by API during session |
| `total_time` | **Persist** | Accumulated across all sessions |

The API automatically calculates `session_time` from Initialize to Terminate. You persist `total_time` and provide it at launch; the API adds the current session time on commit.

### Credit vs No-Credit Mode

| Mode | `cmi.credit` | Effect |
|------|--------------|--------|
| Credit | `"credit"` | Score and status count toward completion |
| No-Credit | `"no-credit"` | Tracking only, doesn't affect completion |

Set `cmi.credit` at launch based on whether this attempt should count.

### Entry Mode Logic

```
if (hasSuspendData AND exitWas("suspend")) → entry = "resume"
else if (hasAttemptRecord) → entry = "" (re-entry)
else → entry = "ab-initio" (first time)
```

See [Entry Mode Decision Logic](#entry-mode-decision-logic) for full logic.

---

## Additional Resources

- [SCORM 1.2 Multi-SCO Guide](./multi-sco-support.md) - Detailed helper utilities
- [Sequencing Configuration](/docs/advanced/sequencing) - Complete sequencing reference
- [Offline Support](/docs/advanced/offline-support) - Offline/mobile integration

---

## Version History

- **v1.1** - Added comprehensive Settings Reference, Sequencing Events Reference, Sequencing Configuration Reference, Commit Object Reference, and ADL Data Model Elements
- **v1.0** - Initial comprehensive guide
