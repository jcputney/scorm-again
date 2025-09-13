# SCORM 2004 Sequencing Integration

This document describes the enhanced SCORM 2004 sequencing features in scorm-again that make sequencing automatic and reduce LMS implementation burden.

## Overview

The enhanced sequencing system provides:

1. **Runtime Integration Hooks** - Automatic sequencing when content calls Initialize/Terminate
2. **Content Delivery Environment Process** - Complete DB.2 process implementation
3. **Automatic Rollup Triggers** - Rollup when CMI values change (completion_status, success_status, score)
4. **Enhanced Navigation Request Processing** - All navigation requests properly handled
5. **Sequencing Event System** - LMS can listen to sequencing events

## Key Features

### Automatic Runtime Integration

Sequencing automatically starts when `Initialize()` is called and processes navigation requests when `Terminate()` is called:

```javascript
// Create SCORM 2004 API with sequencing configuration
const api = new Scorm2004API({
  sequencing: {
    // Activity tree configuration
    activityTree: {
      id: "course_root",
      title: "My Course",
      children: [
        {
          id: "lesson_1",
          title: "Introduction",
          children: [
            { id: "sco_1_1", title: "Welcome" },
            { id: "sco_1_2", title: "Overview" }
          ]
        },
        {
          id: "lesson_2", 
          title: "Content",
          children: [
            { id: "sco_2_1", title: "Theory" },
            { id: "sco_2_2", title: "Practice" }
          ]
        }
      ]
    },
    // Runtime sequencing configuration
    autoRollupOnCMIChange: true,
    autoProgressOnCompletion: false,
    validateNavigationRequests: true,
    enableEventSystem: true,
    logLevel: 'info',
    // Event listeners
    eventListeners: {
      onActivityDelivery: (activity) => {
        console.log(`Deliver activity: ${activity.id} - ${activity.title}`);
        // LMS should launch the content for this activity
        launchContent(activity.id);
      },
      onActivityUnload: (activity) => {
        console.log(`Unload activity: ${activity.id}`);
        // LMS should unload current content
      },
      onNavigationRequest: (request, target) => {
        console.log(`Navigation: ${request}`, target);
      },
      onRollupComplete: (activity) => {
        console.log(`Rollup completed for: ${activity.id}`);
        // Update UI based on activity status changes
        updateNavigationUI(activity);
      }
    }
  }
});

// Normal SCORM usage - sequencing happens automatically
api.Initialize("");
api.SetValue("cmi.completion_status", "completed"); // Triggers automatic rollup
api.Terminate("");                                  // Processes navigation requests
```

### Automatic Rollup on CMI Changes

When learners update critical CMI values, rollup is triggered automatically:

```javascript
// These SetValue calls will automatically trigger rollup:
api.SetValue("cmi.completion_status", "completed");
api.SetValue("cmi.success_status", "passed");
api.SetValue("cmi.score.scaled", "0.85");
api.SetValue("cmi.progress_measure", "1.0");

// Rollup happens immediately, updating parent activities
// and triggering onRollupComplete events
```

### Navigation Request Processing

Navigation requests are processed through the complete Overall Sequencing Process:

```javascript
// Set navigation request
api.SetValue("adl.nav.request", "continue");
api.Terminate(""); // Automatically processes the request

// Or process directly
const success = api.processNavigationRequest("choice", "lesson_2");
if (success) {
  console.log("Navigation request processed successfully");
}

// Check navigation validity
const canContinue = api.GetValue("adl.nav.request_valid.continue");
const canGoToPrevious = api.GetValue("adl.nav.request_valid.previous"); 
const canChooseLessson2 = api.GetValue("adl.nav.request_valid.choice.{target=lesson_2}");
```

## Complete Example

Here's a complete example showing how an LMS can integrate with the enhanced sequencing:

```javascript
class SequencingEnabledLMS {
  constructor() {
    this.currentContent = null;
    this.api = null;
  }

  initializeCourse(manifest) {
    // Configure SCORM API with sequencing from manifest
    this.api = new Scorm2004API({
      sequencing: {
        activityTree: this.buildActivityTree(manifest),
        autoRollupOnCMIChange: true,
        enableEventSystem: true,
        eventListeners: {
          onActivityDelivery: (activity) => this.deliverActivity(activity),
          onActivityUnload: (activity) => this.unloadActivity(activity),
          onRollupComplete: (activity) => this.updateUI(activity),
          onSequencingError: (error, context) => this.handleError(error, context)
        }
      }
    });

    // Initialize - this will automatically start sequencing if configured
    this.api.Initialize("");
    
    // Get current sequencing state
    const state = this.api.getSequencingState();
    console.log("Sequencing initialized:", state);
  }

  deliverActivity(activity) {
    console.log(`Delivering activity: ${activity.id}`);
    
    // Unload current content
    if (this.currentContent) {
      this.unloadCurrentContent();
    }
    
    // Launch new content
    this.currentContent = activity;
    this.launchContent(activity.id);
    
    // Update navigation UI
    this.updateNavigationButtons(activity);
  }

  unloadActivity(activity) {
    console.log(`Unloading activity: ${activity.id}`);
    if (this.currentContent && this.currentContent.id === activity.id) {
      this.unloadCurrentContent();
      this.currentContent = null;
    }
  }

  updateUI(activity) {
    // Update progress indicators, navigation buttons, etc.
    console.log(`UI update for rollup: ${activity.id}`);
    this.updateProgressIndicators();
    this.updateNavigationButtons(activity);
  }

  handleNavigation(request, target) {
    // Process navigation request through enhanced sequencing
    const success = this.api.processNavigationRequest(request, target);
    
    if (!success) {
      console.warn(`Navigation request failed: ${request}`);
      // Show user feedback
    }
    
    return success;
  }

  updateNavigationButtons(activity) {
    // Check navigation validity using the API
    const canContinue = this.api.GetValue("adl.nav.request_valid.continue") === "true";
    const canPrevious = this.api.GetValue("adl.nav.request_valid.previous") === "true";
    
    // Enable/disable navigation buttons
    document.getElementById('continueBtn').disabled = !canContinue;
    document.getElementById('previousBtn').disabled = !canPrevious;
    
    // Update choice navigation options
    this.updateChoiceNavigation(activity);
  }

  buildActivityTree(manifest) {
    // Build activity tree from SCORM manifest
    // This would parse the imsmanifest.xml file
    return {
      id: manifest.identifier,
      title: manifest.title,
      children: manifest.organizations[0].items.map(item => this.buildActivity(item))
    };
  }

  // ... additional LMS methods
}

// Usage
const lms = new SequencingEnabledLMS();
lms.initializeCourse(manifestData);

// Navigation handling
document.getElementById('continueBtn').onclick = () => {
  lms.handleNavigation('continue');
};

document.getElementById('previousBtn').onclick = () => {
  lms.handleNavigation('previous');
};
```

## Advanced Configuration

### Sequencing Rules and Controls

```javascript
const api = new Scorm2004API({
  sequencing: {
    activityTree: { /* ... */ },
    
    // Sequencing rules
    sequencingRules: {
      preConditionRules: [
        {
          action: "SKIP",
          conditionCombination: "all",
          conditions: [
            {
              condition: "SATISFIED",
              operator: "no_op"
            }
          ]
        }
      ],
      exitConditionRules: [
        {
          action: "EXIT_ALL",
          conditionCombination: "any", 
          conditions: [
            {
              condition: "TIME_LIMIT_EXCEEDED",
              operator: "no_op"
            }
          ]
        }
      ]
    },
    
    // Sequencing controls
    sequencingControls: {
      flow: true,
      forwardOnly: false,
      choiceExit: true,
      rollupObjectiveSatisfied: true,
      rollupProgressCompletion: true
    },
    
    // Rollup rules
    rollupRules: {
      rules: [
        {
          action: "SATISFIED",
          consideration: "ALL",
          conditions: [
            {
              condition: "SATISFIED"
            }
          ]
        }
      ]
    }
  }
});
```

### Event System Integration

```javascript
// Set up comprehensive event handling
api.setSequencingEventListeners({
  onSequencingStart: (activity) => {
    console.log("Sequencing started with activity:", activity?.id);
    // Initialize course UI
  },
  
  onSequencingEnd: () => {
    console.log("Sequencing ended");
    // Clean up course UI
  },
  
  onActivityDelivery: (activity) => {
    console.log("Activity delivery:", activity.id, activity.title);
    // Launch activity content
    launchActivity(activity);
  },
  
  onActivityUnload: (activity) => {
    console.log("Activity unload:", activity.id);
    // Clean up activity content
  },
  
  onNavigationRequest: (request, target) => {
    console.log("Navigation request:", request, target);
    // Log navigation attempts
  },
  
  onRollupComplete: (activity) => {
    console.log("Rollup complete:", activity.id, activity.completionStatus);
    // Update progress tracking
    updateProgress(activity);
  },
  
  onSequencingError: (error, context) => {
    console.error("Sequencing error in", context, ":", error);
    // Handle sequencing errors
    showUserError("Navigation error occurred");
  }
});
```

## Migration Guide

### Migrating from Legacy Navigation

If you currently handle navigation manually:

```javascript
// OLD WAY - Manual navigation handling
api.addEventListener("Terminate", (event) => {
  const request = api.GetValue("adl.nav.request");
  if (request === "continue") {
    // Manual logic to find next activity
    const nextActivity = findNextActivity();
    launchActivity(nextActivity);
  }
});

// NEW WAY - Automatic sequencing
const api = new Scorm2004API({
  sequencing: {
    activityTree: courseStructure,
    eventListeners: {
      onActivityDelivery: (activity) => launchActivity(activity)
    }
  }
});
// Navigation is handled automatically!
```

### Benefits for LMS Developers

1. **Reduced Implementation Burden**: No need to implement complex sequencing logic
2. **Standards Compliance**: Full SCORM 2004 sequencing specification compliance
3. **Automatic Rollup**: Progress tracking happens automatically
4. **Event-Driven Architecture**: Clean separation of concerns
5. **Error Handling**: Built-in error handling and recovery
6. **Performance**: Optimized sequencing algorithms

## API Reference

### New Methods

- `getSequencingService()`: Get the sequencing service instance
- `setSequencingEventListeners(listeners)`: Set event listeners
- `updateSequencingConfiguration(config)`: Update configuration
- `getSequencingState()`: Get current sequencing state
- `processNavigationRequest(request, target?)`: Process navigation directly

### Configuration Options

See the `SequencingSettings` type definition for complete configuration options.

### Event Types

All sequencing events are available through the event listeners interface.

## Troubleshooting

### Common Issues

1. **Sequencing not starting**: Check that `activityTree` is configured
2. **Navigation not working**: Verify sequencing controls are properly set
3. **Rollup not triggered**: Ensure `autoRollupOnCMIChange` is enabled
4. **Events not firing**: Check that `enableEventSystem` is true

### Debug Mode

Enable debug logging for troubleshooting:

```javascript
const api = new Scorm2004API({
  sequencing: {
    logLevel: 'debug',
    // ... other config
  }
});
```

This will provide detailed logging of all sequencing operations.

## Runtime Hooks and Validity Updates

- Time providers (optional):
  - `now?: () => Date` to inject a clock for time checks (begin/end windows, attempt start times).
  - `getAttemptElapsedSeconds?: (activity) => number` to supply accurate elapsed seconds used by `timeLimitExceeded`.
- Per-target validity maps:
  - The library computes and emits `onNavigationValidityUpdate` with `{ continue, previous, choice, jump }` where `choice` and `jump` are `{ [activityId]: 'true'|'false' }`.
  - It also attempts to set `adl.nav.request_valid.choice/jump`; use the event payload for robust UI updates.

Example config:

```javascript
const api = new Scorm2004API({
  sequencing: {
    activityTree: {/*...*/},
    now: () => new Date(),
    getAttemptElapsedSeconds: (activity) => lmsTimer.getElapsed(activity.id),
    eventListeners: {
      onNavigationValidityUpdate: (validity) => updateNavUI(validity)
    }
  }
});
```
