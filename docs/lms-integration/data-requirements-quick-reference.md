# LMS Data Requirements Quick Reference

A condensed reference for what data your LMS must store and provide for each SCORM scenario.

---

## SCORM 1.2

### Data the LMS Provides at Launch

```
Required at every launch:
├── cmi.core.student_id          ← Learner ID from your system
├── cmi.core.student_name        ← Format: "Last, First"
├── cmi.core.lesson_mode         ← "normal" | "browse" | "review"
├── cmi.core.credit              ← "credit" | "no-credit"
└── cmi.core.entry               ← "ab-initio" | "resume"

From previous attempt (if resuming):
├── cmi.core.lesson_status       ← "not attempted" | "incomplete" | "completed" | "passed" | "failed" | "browsed"
├── cmi.core.lesson_location     ← Bookmark string (max 255 chars)
├── cmi.core.total_time          ← Format: HHHH:MM:SS.SS
├── cmi.core.score.raw           ← Number as string (0-100 range)
├── cmi.core.score.min           ← Number as string (0-100 range)
├── cmi.core.score.max           ← Number as string (0-100 range)
├── cmi.suspend_data             ← State data (max 4096 chars)
├── cmi.comments                 ← Learner feedback (max 4096 chars)
├── cmi.objectives.*             ← Previous objective data
└── cmi.student_preference.*     ← audio (-1 to 100), language, speed (-100 to 100), text (-1 to 1)

From manifest (read-only, set once):
├── cmi.launch_data              ← <adlcp:datafromlms> content
├── cmi.comments_from_lms        ← Read-only LMS comments (max 4096 chars)
├── cmi.student_data.mastery_score     ← Score threshold for "passed" (0-100)
├── cmi.student_data.max_time_allowed  ← Time limit (HHHH:MM:SS.SS)
└── cmi.student_data.time_limit_action ← "exit,message" | "exit,no message" | "continue,message" | "continue,no message"
```

**Important Notes:**
- All scores must be 0-100 range per SCORM 1.2 specification
- Exit values: `""` (empty), `"suspend"`, `"logout"`, `"time-out"`
- `session_time` is calculated by the library - only persist `total_time`

### Data the LMS Receives (Commit)

```
From commit endpoint, extract and store:
├── cmi.core.lesson_status       → Status tracking
├── cmi.core.lesson_location     → Bookmark for resume
├── cmi.core.score.*             → Score data (raw, min, max)
├── cmi.core.session_time        → Add to total_time (don't persist directly)
├── cmi.core.exit                → Determines next entry mode
├── cmi.suspend_data             → State for resume
├── cmi.comments                 → Learner feedback
├── cmi.objectives.*             → Per-objective tracking
├── cmi.interactions.*           → Question/response data
└── cmi.student_preference.*     → Learner preferences
```

### Minimum Storage Schema (SCORM 1.2)

```
ScoAttemptState:
├── scoId: string
├── learnerId: string
├── lessonStatus: string
├── location: string (max 255)
├── suspendData: string (max 4096)
├── comments: string (max 4096)
├── scoreRaw: number | null (0-100)
├── scoreMin: number | null (0-100)
├── scoreMax: number | null (0-100)
├── totalTimeSeconds: number
├── exitMode: string ("" | "suspend" | "logout" | "time-out")
├── objectives: JSON/structured data
├── interactions: JSON/structured data (optional)
├── learnerPreferences: { audio, language, speed, text }
└── lastUpdated: timestamp
```

---

## SCORM 2004

### Data the LMS Provides at Launch

```
Required at every launch:
├── cmi.learner_id               ← Learner ID from your system
├── cmi.learner_name             ← Any name format (LangString)
├── cmi.mode                     ← "normal" | "browse" | "review"
├── cmi.credit                   ← "credit" | "no-credit"
└── cmi.entry                    ← "ab-initio" | "resume" | "" (empty for review)

From previous attempt (if resuming):
├── cmi.completion_status        ← "unknown" | "not attempted" | "incomplete" | "completed"
├── cmi.success_status           ← "unknown" | "passed" | "failed"
├── cmi.location                 ← Bookmark (max 1000 chars)
├── cmi.suspend_data             ← State data (max 64000 chars)
├── cmi.total_time               ← ISO 8601 Duration (PTnHnMnS)
├── cmi.progress_measure         ← 0.0 to 1.0
├── cmi.score.scaled             ← -1.0 to 1.0
├── cmi.score.raw                ← Number
├── cmi.score.min                ← Number
├── cmi.score.max                ← Number
├── cmi.objectives.*             ← All objective data (ID is immutable once set)
├── cmi.interactions.*           ← All interaction data (optional)
├── cmi.comments_from_learner.*  ← Learner comments array
└── cmi.learner_preference.*     ← See defaults below

From manifest (read-only, set once):
├── cmi.launch_data              ← <adlcp:dataFromLMS> content
├── cmi.max_time_allowed         ← ISO 8601 Duration
├── cmi.time_limit_action        ← Action on time exceeded
├── cmi.comments_from_lms.*      ← Read-only LMS comments array
├── cmi.completion_threshold     ← 0.0-1.0, triggers auto-completion
└── cmi.scaled_passing_score     ← -1.0 to 1.0, triggers auto-pass/fail
```

### Learner Preference Defaults (SCORM 2004)

```javascript
{
  audio_level: "1",         // 0.0+ (default: 1.0)
  audio_captioning: "0",    // -1 = no preference, 0 = off, 1 = on (default: 0)
  delivery_speed: "1",      // 0.0+ (default: 1.0)
  language: ""              // ISO language code (default: "")
}
```

### Auto-Evaluation Behavior

**Important:** SCORM 2004 auto-evaluates status based on thresholds:

| Threshold Set | Condition | Result |
|---------------|-----------|--------|
| `completion_threshold` | `progress_measure >= threshold` | `completion_status = "completed"` |
| `completion_threshold` | `progress_measure < threshold` | `completion_status = "incomplete"` |
| `scaled_passing_score` | `score.scaled >= threshold` | `success_status = "passed"` |
| `scaled_passing_score` | `score.scaled < threshold` | `success_status = "failed"` |

The commit data will contain these auto-evaluated values.

### Data the LMS Receives (Commit)

```
From commit endpoint, extract and store:
├── cmi.completion_status        → Completion tracking (may be auto-evaluated)
├── cmi.success_status           → Pass/fail tracking (may be auto-evaluated)
├── cmi.location                 → Bookmark for resume
├── cmi.suspend_data             → State for resume
├── cmi.progress_measure         → Progress (0.0-1.0)
├── cmi.score.*                  → All score fields
├── cmi.session_time             → Add to total_time (ISO 8601)
├── cmi.exit                     → Determines next entry mode
├── cmi.objectives.*             → Per-objective tracking
├── cmi.interactions.*           → Question/response data
├── cmi.comments_from_learner.*  → Learner comments array
└── cmi.learner_preference.*     → Preferences

For sequenced courses, also extract:
├── adl.nav.request              → Navigation request (see below)
└── Global objectives            → Objectives with mapInfo targeting globals
```

### ADL Navigation Requests

```
adl.nav.request values:
├── "continue"                   → Move to next activity
├── "previous"                   → Move to previous activity
├── "{target=<id>}choice"        → Navigate to specific activity
├── "exit"                       → Exit current activity
├── "exitAll"                    → Exit all, end session
├── "abandon"                    → Abandon current activity
├── "abandonAll"                 → Abandon all activities
├── "suspendAll"                 → Suspend all activities
├── "jump"                       → Jump navigation (4th edition)
└── "_none_"                     → No navigation request
```

### Minimum Storage Schema (SCORM 2004)

```
ScoAttemptState:
├── scoId: string
├── learnerId: string
├── completionStatus: string
├── successStatus: string
├── location: string (max 1000)
├── suspendData: string (max 64000)
├── progressMeasure: number | null (0.0-1.0)
├── scoreScaled: number | null (-1.0 to 1.0)
├── scoreRaw: number | null
├── scoreMin: number | null
├── scoreMax: number | null
├── totalTimeSeconds: number
├── exitMode: string ("" | "suspend" | "logout" | "time-out" | "normal")
├── objectives: JSON/structured data
├── interactions: JSON/structured data
├── commentsFromLearner: JSON/structured data
├── learnerPreferences: JSON/structured data
└── lastUpdated: timestamp
```

### Additional Storage for Sequenced Courses

```
GlobalObjectiveState (per course attempt):
├── objectiveId: string
├── successStatus: string | null
├── completionStatus: string | null
├── progressMeasure: number | null
├── scoreScaled: number | null
├── scoreRaw: number | null
├── scoreMin: number | null
├── scoreMax: number | null
└── lastUpdated: timestamp

SequencingState (per course attempt):
├── currentActivityId: string | null
├── suspendedActivityId: string | null
├── serializedState: string (from library)
└── activityStates: [per-activity tracking]
```

---

## Entry Mode Decision

```
                    ┌──────────────────────────────┐
                    │   Is there previous state?   │
                    └──────────────┬───────────────┘
                                   │
                    ┌──────────────┴───────────────┐
                    ▼                              ▼
               No previous                    Has previous
                    │                              │
                    ▼                              ▼
            entry = "ab-initio"        ┌───────────────────────┐
                                       │ Was exit = "suspend"? │
                                       └───────────┬───────────┘
                                                   │
                                    ┌──────────────┴──────────────┐
                                    ▼                             ▼
                                   Yes                           No
                                    │                             │
                                    ▼                             ▼
                            entry = "resume"            entry = "ab-initio"
                                                        (or "" for SCORM 2004 review)
```

---

## Time Format Reference

### SCORM 1.2
- Format: `HHHH:MM:SS.SS`
- Example: `0001:30:45.50` = 1 hour, 30 minutes, 45.5 seconds
- Range: 0000:00:00.00 to 9999:99:99.99

### SCORM 2004
- Format: ISO 8601 Duration
- Example: `PT1H30M45.5S` = 1 hour, 30 minutes, 45.5 seconds
- Components: P[n]Y[n]M[n]DT[n]H[n]M[n]S

---

## Commit Object Structure

```typescript
interface CommitObject {
  // Summary fields (when renderCommonCommitFields: true)
  successStatus: "passed" | "failed" | "unknown";
  completionStatus: "completed" | "incomplete" | "not attempted" | "unknown";
  totalTimeSeconds: number;

  // Score summary
  score?: {
    raw?: number;
    min?: number;
    max?: number;
    scaled?: number;  // SCORM 2004 only
  };

  // Full runtime data tree
  runtimeData: {
    cmi: { /* all CMI data */ };
    adl?: { /* SCORM 2004 ADL data */ };
  };

  // Optional metadata (when autoPopulateCommitMetadata: true)
  courseId?: string;
  scoId?: string;
  learnerId?: string;
  learnerName?: string;
  sessionId?: string;
  activityId?: string;
  attempt?: number;
  commitId?: string;
}
```

### Commit Data Formats

| Format | Setting | Content-Type | Example |
|--------|---------|--------------|---------|
| JSON | `"json"` | `application/json` | `{"cmi":{"completion_status":"completed"}}` |
| Flattened | `"flattened"` | `application/json` | `{"cmi.completion_status":"completed"}` |
| Params | `"params"` | `application/x-www-form-urlencoded` | `cmi.completion_status=completed` |

---

## Multi-SCO State Tracking

### Per-Course Storage
```
CourseRegistration:
├── courseId
├── learnerId
├── currentScoId              ← Which SCO is active/last
├── overallStatus             ← Rolled-up status
├── overallScore              ← Calculated from SCO scores
├── totalTimeSeconds          ← Sum of all SCO times
└── scoStates[]               ← Array of ScoAttemptState
```

### Rollup Calculation Example
```javascript
// Completion: All SCOs must be completed
const allCompleted = scoStates.every(s =>
  ['completed', 'passed'].includes(s.status)
);

// Score: Average of SCO scores
const avgScore = scoStates
  .filter(s => s.scoreRaw != null)
  .reduce((sum, s) => sum + s.scoreRaw, 0) / scoStates.length;

// Status: Derive from completion and scores
let overallStatus = 'in_progress';
if (allCompleted) {
  overallStatus = avgScore >= passingScore ? 'passed' : 'completed';
}
```

---

## Common Settings Reference

### SCORM 1.2

```javascript
new Scorm12API({
  // Required
  lmsCommitUrl: "/api/scorm/commit",

  // Auto-commit
  autocommit: true,
  autocommitSeconds: 60,

  // Behavior
  mastery_override: true,              // Auto pass/fail from mastery_score
  autoCompleteLessonStatus: true,      // Auto-complete on LMSFinish

  // Multi-SCO
  globalStudentPreferences: true,      // Share prefs across SCOs

  // HTTP options
  xhrHeaders: { "X-Custom": "value" },
  xhrWithCredentials: false,

  // Logging
  logLevel: 4,                         // 1=DEBUG, 4=ERROR, 5=NONE
});
```

### SCORM 2004

```javascript
new Scorm2004API({
  // Required
  lmsCommitUrl: "/api/scorm/commit",

  // Auto-commit
  autocommit: true,
  autocommitSeconds: 60,

  // Behavior
  score_overrides_status: false,       // Allow score to override status
  autoProgress: false,                 // Auto-progress on completion

  // Beacon behavior
  useBeaconInsteadOfFetch: "on-terminate",  // "always" | "on-terminate" | "never"

  // Commit metadata
  autoPopulateCommitMetadata: true,
  courseId: "course-123",
  scoId: "sco-456",

  // Navigation validation
  scoItemIds: ["sco1", "sco2"],        // Valid navigation targets
  globalObjectiveIds: ["global-obj"],  // Shared objectives

  // Sequencing (for sequenced courses)
  sequencing: {
    activityTree: {...},
    eventListeners: {
      onActivityDelivery: (activity) => launchContent(activity),
      onNavigationValidityUpdate: (data) => updateNavUI(data),
      onRollupComplete: (activity) => updateStatus(activity)
    }
  }
});
```

---

## Endpoint Response Format

### Success
```json
{ "result": "true" }
```

### Failure
```json
{
  "result": "false",
  "errorCode": 391,
  "errorMessage": "Optional description"
}
```

**Note:** HTTP status should still be 200. The `result` field indicates success/failure.

### Beacon Requests

On `Terminate()`/`LMSFinish()`:
- Uses `navigator.sendBeacon()` by default
- **Fire-and-forget**: No response expected
- **Survives page close**: Ensures data is sent
- Make endpoint idempotent (may receive duplicates)
