# SCORM 2004 Sequencing Configuration

This document explains how to configure SCORM 2004 sequencing in the SCORM Again library.

## Overview

SCORM 2004 sequencing allows you to control the flow of content in a SCORM package. It defines how learners navigate between activities, how activities are ordered, and how the status of activities is determined based on the status of their children.

The SCORM Again library provides a comprehensive implementation of SCORM 2004 sequencing, which can be configured through the API settings.

## Configuration

To configure SCORM 2004 sequencing, you need to provide a `sequencing` object in the settings when creating a SCORM 2004 API instance:

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

- `activityTree`: Configures the activity tree, which defines the hierarchy of activities in the SCORM package.
- `sequencingRules`: Configures the sequencing rules, which define how navigation between activities is controlled.
- `sequencingControls`: Configures the sequencing controls, which define general behavior for sequencing.
- `rollupRules`: Configures the rollup rules, which define how the status of parent activities is determined based on the status of their children.

### Activity Tree

The activity tree defines the hierarchy of activities in the SCORM package. Each activity has an ID, a title, and can have child activities.

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

- `isVisible`: Whether the activity is visible to the learner.
- `isActive`: Whether the activity is currently active.
- `isSuspended`: Whether the activity is suspended.
- `isCompleted`: Whether the activity is completed.

### Sequencing Rules

Sequencing rules define how navigation between activities is controlled. There are three types of sequencing rules:

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

Each rule has an `action`, an optional `conditionCombination` (which can be `all` or `any`), and an array of `conditions`. Each condition has a `condition` type, an optional `operator` (which can be `not`), and optional `parameters`.

### Sequencing Controls

Sequencing controls define general behavior for sequencing, such as whether flow navigation is enabled, whether choice navigation is constrained, etc.

```javascript
sequencing: {
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
    objectiveMeasureWeight: 1.0
  }
}
```

### Rollup Rules

Rollup rules define how the status of parent activities is determined based on the status of their children.

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

Each rule has an `action`, a `consideration` (which can be `all`, `any`, `none`, `atLeastCount`, or `atLeastPercent`), optional `minimumCount` and `minimumPercent` values (for `atLeastCount` and `atLeastPercent` considerations), and an array of `conditions`. Each condition has a `condition` type and optional `parameters`.

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

This configuration creates a course with two modules, each with two lessons. It defines rules for skipping completed activities, exiting to the parent when an activity is completed, and continuing to the next activity when an activity is completed. It also defines rules for determining when a parent activity is completed or satisfied based on its children.
