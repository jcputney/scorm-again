# Player Event Adapter API Reference

The `PlayerEventAdapter` provides a simplified interface for integrating scorm-again events with your existing player UI.

## Installation

```javascript
import { PlayerEventAdapter } from 'scorm-again/utilities/PlayerEventAdapter';
```

## Basic Usage

```javascript
const adapter = new PlayerEventAdapter(api, {
  onNavigationStateChange: (state) => {
    // Update nav buttons based on state.canPrevious, state.canNext
  },
  onScoStatusChange: (scoId, status) => {
    // Update menu item for scoId with status.completion, status.score
  },
  onCourseProgressChange: (progress) => {
    // Update progress bar with progress.completionPct
  },
  onScoDelivery: (sco) => {
    // Load sco.launchUrl in content frame
  },
  onSessionEnd: (reason, data) => {
    // Show completion screen based on reason
  },
});
```

## Callbacks

### onNavigationStateChange

Called when navigation availability changes.

```typescript
interface NavigationState {
  canPrevious: boolean;
  canNext: boolean;
  canExit: boolean;
  choices: string[];      // Available choice targets
  validRequests: string[]; // Raw sequencing requests
}
```

### onScoStatusChange

Called when a SCO's status changes.

```typescript
interface ScoStatus {
  completion: 'not attempted' | 'incomplete' | 'completed' | 'unknown';
  success: 'passed' | 'failed' | 'unknown';
  score: number | null;
  scaledScore: number | null;
  location: string;
  timeSpent: number; // seconds
}
```

### onCourseProgressChange

Called when overall course progress changes.

```typescript
interface CourseProgress {
  completionPct: number;
  avgScore: number | null;
  totalTime: number;
  overallStatus: 'not attempted' | 'incomplete' | 'completed' | 'passed' | 'failed';
  completedCount: number;
  totalCount: number;
}
```

### onScoDelivery

Called when a SCO should be delivered.

```typescript
interface ScoDelivery {
  id: string;
  title: string;
  launchUrl: string;
  parameters: string;
}
```

### onSessionEnd

Called when the learning session ends.

```typescript
type SessionEndReason = 'complete' | 'suspend' | 'exit' | 'timeout' | 'abandon';

interface SessionEndData {
  exception?: string;
  navigationRequest?: string;
  progress: CourseProgress;
}
```

## With SCORM 2004 Sequencing

When using the sequencing engine, wire the adapter's handlers to sequencing events:

```javascript
const api = new Scorm2004API({
  sequencing: {
    enabled: true,
    activityTree: manifest.activities,
    eventListeners: {
      onNavigationValidityUpdate: (data) => adapter.handleNavigationValidityUpdate(data),
      onActivityDelivery: (activity) => adapter.handleActivityDelivery(activity),
      onRollupComplete: (activity) => adapter.handleRollupComplete(activity),
      onSequencingSessionEnd: (data) => adapter.handleSequencingSessionEnd(data),
    },
  },
});

const adapter = new PlayerEventAdapter(api, callbacks, config);
```

## Cleanup

Always call `destroy()` when unmounting the player:

```javascript
adapter.destroy();
```
