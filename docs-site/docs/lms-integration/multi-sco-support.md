---
sidebar_position: 4
title: SCORM 1.2 Multi-SCO Support
description: Guide for using scorm-again LMS helper utilities to implement multi-SCO SCORM 1.2 course support.
---
# SCORM 1.2 Multi-SCO Support

This guide explains how to use the scorm-again LMS helper utilities to implement multi-SCO SCORM 1.2 course support in your LMS.

## Overview

SCORM 1.2 does not define a sequencing specification - navigation between SCOs is entirely the LMS's responsibility. These utilities provide building blocks to help you implement:

- **State Tracking**: Track completion, scores, and time for each SCO
- **Navigation**: Determine next/previous SCO, handle exit actions
- **Rollup**: Calculate course-level scores, completion, and status

## Installation

The utilities are included with scorm-again:

```typescript
import {
  ScoStateTracker,
  Scorm12Sequencer,
  CourseRollupCalculator,
  ScoDefinition,
} from 'scorm-again/utilities/scorm12-lms-helpers';
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Your LMS                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │ State       │    │ Sequencer    │    │ Rollup        │  │
│  │ Tracker     │◄───│              │    │ Calculator    │  │
│  └─────┬───────┘    └──────────────┘    └───────┬───────┘  │
│        │                                        │          │
│        │         Updates state on               │          │
│        │         LMSCommit/LMSFinish            │          │
│        ▼                                        ▼          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Scorm12API                        │   │
│  └─────────────────────────────────────────────────────┘   │
│        ▲                                                   │
│        │ postMessage / direct calls                        │
│        │                                                   │
└────────┼───────────────────────────────────────────────────┘
         │
┌────────┴───────────────────────────────────────────────────┐
│                    SCO Content (iframe)                     │
└─────────────────────────────────────────────────────────────┘
```

## Complete Implementation Example

### Step 1: Define Your Course Structure

Parse your SCORM manifest to create SCO definitions:

```typescript
// From your imsmanifest.xml parsing
const scoDefinitions: ScoDefinition[] = [
  {
    id: 'sco_intro',
    title: 'Introduction',
    launchUrl: 'content/intro/index.html',
    masteryScore: 80,
    sequenceIndex: 0,
  },
  {
    id: 'sco_module1',
    title: 'Module 1: Basics',
    launchUrl: 'content/module1/index.html',
    masteryScore: 80,
    sequenceIndex: 1,
  },
  {
    id: 'sco_module2',
    title: 'Module 2: Advanced',
    launchUrl: 'content/module2/index.html',
    masteryScore: 80,
    sequenceIndex: 2,
  },
  {
    id: 'sco_assessment',
    title: 'Final Assessment',
    launchUrl: 'content/assessment/index.html',
    masteryScore: 70,
    maxTimeAllowed: '0001:00:00.00', // 1 hour
    timeLimitAction: 'exit,message',
    sequenceIndex: 3,
  },
];
```

### Step 2: Initialize the Utilities

```typescript
import Scorm12API from 'scorm-again';
import {
  ScoStateTracker,
  Scorm12Sequencer,
  CourseRollupCalculator,
} from 'scorm-again/utilities/scorm12-lms-helpers';

class MultiScoPlayer {
  private api: Scorm12API;
  private tracker: ScoStateTracker;
  private sequencer: Scorm12Sequencer;
  private calculator: CourseRollupCalculator;
  private currentScoId: string | null = null;

  constructor(scoDefinitions: ScoDefinition[]) {
    // Initialize state tracker
    this.tracker = new ScoStateTracker();

    // Initialize sequencer with your prerequisite system
    this.sequencer = new Scorm12Sequencer(
      scoDefinitions,
      this.tracker,
      (sco, tracker) => this.checkPrerequisites(sco.id)
    );

    // Initialize rollup calculator
    this.calculator = new CourseRollupCalculator(this.tracker, {
      scoreMethod: 'average',
      completionMethod: 'all',
      statusMethod: 'score_threshold',
      passingScore: 80,
    });

    // Initialize SCORM API
    this.api = new Scorm12API({
      autocommit: true,
      autocommitSeconds: 30,
      // Enable global preferences for multi-SCO
      globalStudentPreferences: true,
    });

    // Set up event handlers
    this.setupEventHandlers();
  }

  // Your existing prerequisite system
  private checkPrerequisites(scoId: string): boolean {
    // Implement your LMS's prerequisite logic here
    // Return true if the SCO can be launched
    return true;
  }

  private setupEventHandlers(): void {
    // Update state on every commit
    this.api.on('LMSCommit', (data) => {
      if (this.currentScoId) {
        this.tracker.updateFromCmiData(this.currentScoId, data.cmi);
        this.onStateChanged();
      }
    });

    // Handle SCO completion
    this.api.on('LMSFinish', (data) => {
      if (this.currentScoId) {
        // Final state update
        this.tracker.updateFromCmiData(this.currentScoId, data.cmi);

        // Get navigation suggestion
        const suggestion = this.sequencer.processExitAction(
          this.currentScoId,
          data.cmi.core?.exit || ''
        );

        this.handleExitSuggestion(suggestion);
      }
    });

    // Listen for state changes
    this.tracker.onStateChange((event) => {
      console.log(`SCO ${event.scoId} changed:`, event.changedFields);
      this.persistState();
    });
  }

  private onStateChanged(): void {
    // Recalculate course rollup
    const rollup = this.calculator.calculate();

    // Update UI
    this.updateProgressUI(rollup);

    // Check for course completion
    if (this.calculator.isCourseComplete()) {
      this.onCourseComplete(rollup);
    }
  }

  private handleExitSuggestion(suggestion: NavigationSuggestion): void {
    console.log('Navigation suggestion:', suggestion);

    switch (suggestion.action) {
      case 'continue':
        if (suggestion.targetScoId) {
          this.showContinuePrompt(suggestion.targetScoId);
        }
        break;

      case 'suspend':
        this.showSuspendMessage();
        break;

      case 'retry':
        this.showRetryPrompt(suggestion.targetScoId!);
        break;

      case 'exit':
        this.showCourseMenu();
        break;
    }
  }
}
```

### Step 3: Launching SCOs

```typescript
class MultiScoPlayer {
  // ... previous code ...

  async launchSco(scoId: string): Promise<void> {
    const sco = this.sequencer.getSco(scoId);
    if (!sco) {
      throw new Error(`SCO not found: ${scoId}`);
    }

    // Check availability (includes prerequisites)
    if (!this.sequencer.isScoAvailable(scoId)) {
      throw new Error(`SCO not available: ${scoId}`);
    }

    // Get existing state for resume
    const existingState = this.tracker.getScoState(scoId);

    // Configure API with SCO data
    this.api.loadFromJSON({
      cmi: {
        core: {
          student_id: this.studentId,
          student_name: this.studentName,
          lesson_status: existingState?.lessonStatus || 'not attempted',
          lesson_location: existingState?.lessonLocation || '',
          score: {
            raw: existingState?.score.raw?.toString() || '',
            min: existingState?.score.min?.toString() || '0',
            max: existingState?.score.max?.toString() || '100',
          },
          credit: 'credit',
          entry: existingState?.hasBeenLaunched ? 'resume' : 'ab-initio',
        },
        suspend_data: existingState?.suspendData || '',
        student_data: {
          mastery_score: sco.masteryScore?.toString() || '',
          max_time_allowed: sco.maxTimeAllowed || '',
          time_limit_action: sco.timeLimitAction || '',
        },
      },
    });

    // Mark as launched
    this.tracker.markLaunched(scoId);
    this.currentScoId = scoId;

    // Launch in iframe
    const iframe = document.getElementById('sco-frame') as HTMLIFrameElement;
    iframe.src = sco.launchUrl;
  }

  launchNext(): void {
    const nextSco = this.sequencer.getNextSco(this.currentScoId);
    if (nextSco) {
      this.launchSco(nextSco.id);
    }
  }

  launchPrevious(): void {
    if (this.currentScoId) {
      const prevSco = this.sequencer.getPreviousSco(this.currentScoId);
      if (prevSco) {
        this.launchSco(prevSco.id);
      }
    }
  }

  launchFirst(): void {
    const startSco = this.sequencer.getStartingSco();
    if (startSco) {
      this.launchSco(startSco.id);
    }
  }
}
```

### Step 4: Building the Course Menu

```typescript
class MultiScoPlayer {
  // ... previous code ...

  buildCourseMenu(): MenuItems[] {
    const scos = this.sequencer.getAllScos();
    const progress = this.sequencer.getProgress();

    return scos.map(sco => {
      const state = this.tracker.getScoState(sco.id);
      const isAvailable = this.sequencer.isScoAvailable(sco.id);

      return {
        id: sco.id,
        title: sco.title,
        status: state?.lessonStatus || 'not attempted',
        score: state?.score.raw,
        isAvailable,
        isCompleted: this.tracker.isCompleted(sco.id),
        isPassed: this.tracker.isPassed(sco.id),
        isCurrent: sco.id === this.currentScoId,
        onClick: isAvailable ? () => this.launchSco(sco.id) : undefined,
      };
    });
  }

  updateProgressUI(rollup: CourseRollupResult): void {
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = `${rollup.completionPercentage}%`;
    progressBar.textContent = `${rollup.completedCount}/${rollup.totalCount} Complete`;

    // Update score display
    const scoreDisplay = document.getElementById('score-display');
    if (rollup.score !== undefined) {
      scoreDisplay.textContent = `Score: ${rollup.score.toFixed(1)}%`;
    }

    // Update status badge
    const statusBadge = document.getElementById('status-badge');
    statusBadge.className = `status-${rollup.status}`;
    statusBadge.textContent = rollup.status;

    // Update time spent
    const timeDisplay = document.getElementById('time-display');
    timeDisplay.textContent = scormTimeToHumanReadable(rollup.totalTime);
  }
}
```

### Step 5: Persisting State

```typescript
class MultiScoPlayer {
  // ... previous code ...

  // Call this to save state to your database
  persistState(): void {
    const stateToSave = {
      scoStates: this.tracker.exportState(),
      courseRollup: this.calculator.calculate(),
      lastScoId: this.currentScoId,
      timestamp: new Date().toISOString(),
    };

    // Save to your LMS database
    this.lmsService.saveLearnerProgress(this.learnerId, this.courseId, stateToSave);
  }

  // Call this when course is resumed
  async restoreState(): Promise<void> {
    const savedState = await this.lmsService.getLearnerProgress(
      this.learnerId,
      this.courseId
    );

    if (savedState?.scoStates) {
      this.tracker.importState(savedState.scoStates);
    }
  }
}
```

### Step 6: Handling Course Completion

```typescript
class MultiScoPlayer {
  // ... previous code ...

  private onCourseComplete(rollup: CourseRollupResult): void {
    console.log('Course complete!', rollup);

    // Record completion in LMS
    this.lmsService.recordCompletion({
      learnerId: this.learnerId,
      courseId: this.courseId,
      status: rollup.status,
      score: rollup.score,
      totalTime: rollup.totalTime,
      completedAt: new Date(),
    });

    // Show completion UI
    this.showCompletionScreen(rollup);

    // Trigger any webhooks or integrations
    this.notifyCompletion(rollup);
  }
}
```

## Integrating Your Prerequisite System

Since your LMS already handles prerequisites, integrate it via the availability filter:

```typescript
const sequencer = new Scorm12Sequencer(
  scoDefinitions,
  tracker,
  (sco, tracker) => {
    // Your existing prerequisite check
    return myLms.prerequisites.evaluate(sco.id, tracker);
  }
);

// Or update it later
sequencer.setAvailabilityFilter((sco, tracker) => {
  // Complex prerequisite logic
  const prereqExpression = getPrerequisiteExpression(sco.id);
  return evaluatePrerequisites(prereqExpression, tracker);
});
```

## Rollup Configuration Options

Configure how course-level statistics are calculated:

```typescript
const calculator = new CourseRollupCalculator(tracker, {
  // How to calculate course score
  scoreMethod: 'average',  // 'average' | 'weighted' | 'highest' | 'lowest' | 'sum' | 'last'

  // For weighted scoring
  weights: new Map([
    ['sco_intro', 0.1],
    ['sco_module1', 0.3],
    ['sco_module2', 0.3],
    ['sco_assessment', 0.3],
  ]),

  // How to determine completion
  completionMethod: 'all',  // 'all' | 'any' | 'percentage'
  completionThreshold: 80,  // For 'percentage' method

  // How to determine pass/fail
  statusMethod: 'score_threshold',  // 'all_passed' | 'any_passed' | 'score_threshold' | 'completion_only'
  passingScore: 80,

  // Which statuses count as "completed"
  completedStatuses: ['passed', 'completed', 'failed'],
});
```

## Time Utilities

Helper functions for SCORM time format:

```typescript
import {
  parseScormTime,
  formatScormTime,
  addScormTime,
  scormTimeToHumanReadable,
  hasExceededTimeLimit,
} from 'scorm-again/utilities/scorm12-lms-helpers';

// Parse SCORM time to seconds
const seconds = parseScormTime('0001:30:45.50'); // 5445.5

// Format seconds to SCORM time
const scormTime = formatScormTime(5445.5); // '0001:30:45.50'

// Add times together
const total = addScormTime('0001:00:00.00', '0000:30:00.00'); // '0001:30:00.00'

// Human-readable format
const readable = scormTimeToHumanReadable('0001:30:45.50'); // '1h 30m 45s'

// Check time limits
const exceeded = hasExceededTimeLimit(currentTime, maxTimeAllowed);
```

## Event Handling

The state tracker emits events on state changes:

```typescript
tracker.onStateChange((event) => {
  console.log('SCO changed:', event.scoId);
  console.log('Changed fields:', event.changedFields);
  console.log('Previous state:', event.previousState);
  console.log('Current state:', event.currentState);

  // React to specific changes
  if (event.changedFields.includes('lessonStatus')) {
    if (event.currentState.lessonStatus === 'passed') {
      showPassedAnimation(event.scoId);
    }
  }
});
```

## Best Practices

1. **Always persist state** after `LMSCommit` and `LMSFinish` events
2. **Use global preferences** for consistent learner settings across SCOs
3. **Handle suspend properly** - preserve bookmark and suspend_data
4. **Validate prerequisites** before allowing SCO launch
5. **Show clear progress** - use rollup calculator for accurate stats
6. **Handle time limits** - check `maxTimeAllowed` and respond appropriately

## Troubleshooting

### SCO state not updating
Ensure you're calling `tracker.updateFromCmiData()` in your `LMSCommit` handler.

### Scores not rolling up correctly
Check that SCOs are setting `cmi.core.score.raw` (and optionally min/max).

### Navigation not working
Verify your prerequisite filter is returning `true` for available SCOs.

### Time not accumulating
Make sure SCOs are setting `cmi.core.session_time` before `LMSFinish`.
