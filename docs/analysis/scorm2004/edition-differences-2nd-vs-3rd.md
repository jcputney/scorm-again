# SCORM 2004 Edition Differences: 2nd vs 3rd Edition

**Analysis Date:** 2025-12-13
**Reference Implementations Compared:**
- 2nd Edition: `/reference/scorm20042ndedition/`
- 3rd Edition: `/reference/scorm20043rdedition/`

## Executive Summary

The SCORM 2004 3rd Edition introduced several important corrections and clarifications to the 2nd Edition specification. The reference implementations reflect these changes primarily in:

1. **Code formatting** - Consistent indentation (tabs to spaces)
2. **API behavior** - Critical GetErrorString() behavior change
3. **Sequencing logic** - Enhanced choice validation and navigation handling
4. **Error handling** - New error codes for specific edge cases
5. **Termination process** - Timing of exit attribute reset moved to Initialize()

## Key Behavioral Differences

### 1. API: GetErrorString() Behavior Change

**Impact:** HIGH - Affects conformance test compliance

**2nd Edition:**
```javascript
function RunTimeApi_GetErrorString(arg){
  this.WriteAuditLog("GetErrorString('" + arg + "')");
  var returnValue = "";
  if (arg === ""){
    returnValue = this.ErrorString;  // Returns most recent error
  }
  else{
    if (SCORM2004_ErrorStrings[arg] !== null && SCORM2004_ErrorStrings[arg] !== undefined){
      returnValue = SCORM2004_ErrorStrings[arg];
    }
  }
  this.WriteAuditReturnValue(returnValue);
  return returnValue;
}
```

**3rd Edition:**
```javascript
function RunTimeApi_GetErrorString(arg){
  this.WriteAuditLog("GetErrorString('" + arg + "')");
  var returnValue = "";
  if (arg === ""){
    //updated Test Suite prohibits sending most recent error, March 2007
    //returnValue = this.ErrorString;
    returnValue = "";  // CHANGED: Now returns empty string
  }
  else{
    if (SCORM2004_ErrorStrings[arg] !== null && SCORM2004_ErrorStrings[arg] !== undefined){
      returnValue = SCORM2004_ErrorStrings[arg];
    }
  }
  this.WriteAuditReturnValue(returnValue);
  return returnValue;
}
```

**Analysis:**
The 3rd Edition test suite requires GetErrorString("") to return an empty string rather than the most recent error message. This is a specification clarification - GetErrorString() should only return error descriptions for specific error codes, not for empty string arguments.

**Compliance Impact:**
Content that relies on GetErrorString("") to retrieve the last error message will break. Proper implementation requires passing the actual error code.

---

### 2. API: Initialize() Exit Attribute Reset

**Impact:** MEDIUM - Affects session state management

**2nd Edition:**
```javascript
function RunTimeApi_InitializeForDelivery(activity){
  this.RunTimeData = activity.RunTime;
  this.LearningObject = activity.LearningObject;
  this.Activity = activity;
  this.CloseOutSessionCalled = false;
  if (Control.Package.Properties.ResetRunTimeDataTiming == RESET_RT_DATA_TIMING_WHEN_EXIT_IS_NOT_SUSPEND){
    if (this.RunTimeData.Exit != SCORM_EXIT_SUSPEND && this.RunTimeData.Exit != SCORM_EXIT_LOGOUT){
      var atts = {ev:'ResetRuntime',
        ai:activity.ItemIdentifier, at:activity.LearningObject.Title};
      this.WriteHistoryLog("", atts);
      this.RunTimeData.ResetState();
    }
  }
  //reset the nav request so it is not executed again
  this.RunTimeData.NavRequest = SCORM_RUNTIME_NAV_REQUEST_NONE;
  // NOTE: Exit is NOT reset here in 2nd edition
  this.Initialized = false;
  // ...
}

function RunTimeApi_Initialize(arg){
  // ... validation ...
  this.TrackedSessionTimePrevCall = 0;
  this.SessionTotalTimeReportedPrevCall = 0;
  // NOTE: Exit is NOT reset here either
  this.Initialized = true;
  returnValue = SCORM_TRUE;
  // ...
}
```

**3rd Edition:**
```javascript
function RunTimeApi_InitializeForDelivery(activity){
  // ... same setup code ...
  //reset the nav request so it is not executed again
  this.RunTimeData.NavRequest = SCORM_RUNTIME_NAV_REQUEST_NONE;
  // Still NOT reset here
  this.Initialized = false;
  // ...
}

function RunTimeApi_Initialize(arg){
  // ... validation ...
  this.TrackedSessionTimePrevCall = 0;
  this.SessionTotalTimeReportedPrevCall = 0;
  //reset exit per addendum 3.2
  this.RunTimeData.Exit = SCORM_EXIT_UNKNOWN;  // ADDED in 3rd edition
  this.Initialized = true;
  returnValue = SCORM_TRUE;
  // ...
}
```

**Analysis:**
The 3rd Edition addendum 3.2 requires that `cmi.exit` be reset to "unknown" when Initialize() is called. This ensures that each new attempt starts with a clean exit state, preventing carry-over from previous attempts.

**Compliance Impact:**
Without this reset, the exit value from a previous attempt could incorrectly influence the current attempt's behavior. This is critical for proper suspend/resume logic.

---

### 3. API: Terminate() Session Cleanup Removed

**Impact:** LOW - Internal cleanup optimization

**2nd Edition:**
```javascript
function RunTimeApi_Terminate(arg){
  // ... validation ...
  else{
    var historyAtts = {ev:'ApiTerminate'};
    if (this.Activity) {
      historyAtts.ai = this.Activity.ItemIdentifier;
    }
    this.WriteHistoryLog("", historyAtts);
    this.LookAheadSessionClose();  // PRESENT in 2nd edition
    this.CloseOutSession("Terminiate");  // Note: typo "Terminiate"
    this.RunLookAheadSequencerIfNeeded();
    // ...
  }
}
```

**3rd Edition:**
```javascript
function RunTimeApi_Terminate(arg){
  // ... validation ...
  else{
    var historyAtts = {ev:'ApiTerminate'};
    if (this.Activity) {
      historyAtts.ai = this.Activity.ItemIdentifier;
    }
    this.WriteHistoryLog("", historyAtts);
    // this.LookAheadSessionClose() call REMOVED
    this.CloseOutSession("Terminate");  // Typo fixed
    this.RunLookAheadSequencerIfNeeded();
    // ...
  }
}
```

**Analysis:**
The `LookAheadSessionClose()` call was removed, likely because it's redundant with `CloseOutSession()` or handled elsewhere. Also note the typo fix from "Terminiate" to "Terminate".

---

### 4. Sequencing: Choice Request Process - Enhanced Error Codes

**Impact:** HIGH - Affects choice navigation validation

**2nd Edition:**
```javascript
// No special error code constants defined
function Sequencer_ChoiceSequencingRequestProcess(targetActivity, callingLog){
  // ... validation logic ...

  // Generic error handling without specific codes
  if (activityPath[i].IsActive() === false &&
      activityPath[i].LearningObject.ItemIdentifier != commonAncestor.LearningObject.ItemIdentifier &&
      activityPath[i].GetPreventActivation() === true){
    this.LogSeq("[SB.2.9]9.3.3.1. Exit Choice Sequencing Request Process (Delivery Request: n/a; Exception: SB.2.9-6)", logParent);
    returnValue = new Sequencer_ChoiceSequencingRequestProcessResult(null, "SB.2.9-6",
      IntegrationImplementation.GetString("You cannot select '{0}' at this time.", activityPath[i].GetTitle()), false);
    this.LogSeqReturn(returnValue, logParent);
    return returnValue;
  }
}
```

**3rd Edition:**
```javascript
// New error code constants defined in sequencer.js
var CONTROL_CHOICE_EXIT_ERROR_NAV = "NB.2.1-8";
var CONTROL_CHOICE_EXIT_ERROR_CHOICE = "SB.2.9-7";
var PREVENT_ACTIVATION_ERROR = "SB.2.9-6";
var CONSTRAINED_CHOICE_ERROR = "SB.2.9-8";

function Sequencer_ChoiceSequencingRequestProcess(targetActivity, callingLog){
  // ... validation logic ...

  // Using named constant for clarity
  if (activityPath[i].IsActive() === false &&
      activityPath[i].LearningObject.ItemIdentifier != commonAncestor.LearningObject.ItemIdentifier &&
      activityPath[i].GetPreventActivation() === true){
    this.LogSeq("[SB.2.9]9.3.3.1. Exit Choice Sequencing Request Process (Delivery Request: n/a; Exception: " + PREVENT_ACTIVATION_ERROR + ")", logParent);
    returnValue = new Sequencer_ChoiceSequencingRequestProcessResult(null, PREVENT_ACTIVATION_ERROR,
      IntegrationImplementation.GetString("You cannot select '{0}' at this time.  Please select another menu item to continue with '{0}.'", activityPath[i].GetTitle()), false);
    this.LogSeqReturn(returnValue, logParent);
    return returnValue;
  }
}
```

**Analysis:**
The 3rd Edition introduces named constants for specific error conditions under which ADL requires invalid choices to be hidden rather than merely disabled. This provides better traceability between the specification and implementation.

**New Error Constants:**
- `CONTROL_CHOICE_EXIT_ERROR_NAV` - "NB.2.1-8" - Navigation control errors
- `CONTROL_CHOICE_EXIT_ERROR_CHOICE` - "SB.2.9-7" - Choice control errors
- `PREVENT_ACTIVATION_ERROR` - "SB.2.9-6" - Prevent activation violations
- `CONSTRAINED_CHOICE_ERROR` - "SB.2.9-8" - Constrained choice violations

---

### 5. Sequencing: Global Objective Reset Function

**Impact:** MEDIUM - Affects objective state management

**3rd Edition Added:**
```javascript
function Sequencer_ResetGlobalObjectives(){
  var global;
  for (var obj in this.GlobalObjectives){
    global = this.GlobalObjectives[obj];
    global.ResetState();
  }
}
```

**Analysis:**
New function to reset all global objectives. This is likely needed for proper handling of course retries and re-initialization scenarios.

---

### 6. Sequencing: Path Traversal Enhancement

**Impact:** MEDIUM - Affects activity path calculations

**2nd Edition:**
```javascript
function Sequencer_GetPathToAncestorInclusive(activity, ancestorActivity) {
  var aryParentActivities = new Array();
  var index = 0;
  aryParentActivities[index] = activity;
  index++;
  while (activity.ParentActivity !== null && activity != ancestorActivity){
    activity = activity.ParentActivity;
    aryParentActivities[index] = activity;
    index++;
  }
  return aryParentActivities;
}
```

**3rd Edition:**
```javascript
function Sequencer_GetPathToAncestorInclusive(activity, ancestorActivity, includeActivity){
  var aryParentActivities = new Array();
  var index = 0;
  if (includeActivity == null || includeActivity == undefined){
    includeActivity === true;  // Note: should be = not ===
  }
  aryParentActivities[index] = activity;
  index++;
  while (activity.ParentActivity !== null && activity != ancestorActivity){
    activity = activity.ParentActivity;
    aryParentActivities[index] = activity;
    index++;
  }
  if (includeActivity === false){
    aryParentActivities.splice(0,1);
  }
  return aryParentActivities;
}
```

**Analysis:**
Added optional `includeActivity` parameter to control whether the starting activity is included in the path. However, note there's a bug in the default value assignment (uses `===` instead of `=`).

---

### 7. Sequencing: Ancestor Finding for Rollup

**Impact:** MEDIUM - Affects rollup optimization

**3rd Edition Added:**
```javascript
function Sequencer_FindDistinctAncestorsOfActivitySet(activityArray){
  var distinctAncestors = new Array();
  for (var activityIndex=0; activityIndex<activityArray.length; activityIndex++){
    var nextActivity = activityArray[activityIndex];
    if (nextActivity !== null) {
      var activityPath = this.GetActivityPath(nextActivity, true);
      for (var i=0; i < activityPath.length; i++) {
        var isDistinct = true;
        for (var j=0; j < distinctAncestors.length; j++) {
          if (activityPath[i] == distinctAncestors[j]) {
            isDistinct = false;
            break;
          }
        }
        if (isDistinct) {
          distinctAncestors[distinctAncestors.length] = activityPath[i];
        }
      }
    }
  }
  return distinctAncestors;
}
```

**Analysis:**
New helper function to find all distinct ancestors of a set of activities. This likely supports more efficient rollup processing when multiple activities are affected by global objective changes.

---

### 8. Sequencing: Improved Last Activity Detection

**Impact:** MEDIUM - Affects sequencing flow control

**2nd Edition:**
```javascript
function Sequencer_IsActivityLastOverall(activity, logParent){
  Debug.AssertError("Parent log not passed.", (logParent === undefined || logParent === null));
  var orderedListOfActivities = this.GetOrderedListOfActivities(logParent);
  if (activity == orderedListOfActivities[orderedListOfActivities.length - 1]) {
    this.LogSeq("The activity " + activity + " is the last overall activity", logParent);
    return true;
  }
  this.LogSeq("The activity " + activity + " is not the last overall activity", logParent);
  return false;
}
```

**3rd Edition:**
```javascript
function Sequencer_IsActivityLastOverall(activity, logParent){
  Debug.AssertError("Parent log not passed.", (logParent === undefined || logParent === null));
  var orderedListOfActivities = this.GetOrderedListOfActivities(logParent);
  var lastAvailableActivity = null;
  for (var i = (orderedListOfActivities.length - 1); i >= 0; i--){
    if (orderedListOfActivities[i].IsAvailable()){
      lastAvailableActivity = orderedListOfActivities[i];
      i = -1;  // break the loop
    }
  }
  if (activity == lastAvailableActivity){
    this.LogSeq("The activity " + activity + " is the last overall activity", logParent);
    return true;
  }
  this.LogSeq("The activity " + activity + " is not the last overall activity", logParent);
  return false;
}
```

**Analysis:**
Critical fix! The 2nd Edition only checked if an activity was last in the tree, but the 3rd Edition correctly checks if it's the last **available** activity. This prevents considering unavailable activities (hidden, skipped, etc.) as potential navigation targets.

---

### 9. Code Formatting Changes

**Impact:** LOW - No behavioral change

All files changed from tab-based indentation to 2-space indentation. Example:

**2nd Edition:**
```javascript
function RunTimeApi(learnerId, learnerName){
        this.LearnerId = learnerId;
        this.LearnerName = learnerName;
        // ... (tab-indented)
}
```

**3rd Edition:**
```javascript
function RunTimeApi(learnerId, learnerName){
  this.LearnerId = learnerId;
  this.LearnerName = learnerName;
  // ... (space-indented)
}
```

---

### 10. Overall Sequencing Process: Comments Updated

**Impact:** NONE - Documentation only

**2nd Edition:**
```javascript
//NOTE - this code is not obsolete, the GetExitAction will always return DisplayMessage
```

**3rd Edition:**
```javascript
//NOTE - this code is now obsolete, the GetExitAction will always return DisplayMessage
```

**Analysis:**
Comment typo fix: "not obsolete" → "now obsolete". The code is vestigial but retained for compatibility.

---

## Files with Differences

Based on analysis, the following files have substantive changes:

### High Impact (Behavioral Changes):
1. **api.js** - GetErrorString() behavior, Initialize() exit reset
2. **sequencer.js** - New error code constants, helper functions
3. **choice-sequencing-request-process.js** - Enhanced validation with named error codes
4. **overall-sequencing-process.js** - Comment clarification

### Medium Impact (Logic Enhancements):
5. **end-attempt-process.js** - Spacing/formatting only
6. **overall-rollup-process.js** - Comment cleanup
7. **navigation-request-process.js** - Formatting only
8. **activity-progress-rollup-process.js** - Formatting only

### All Other Files:
- Formatting changes only (tabs → spaces)

---

## Recommendations for Implementation

### Critical Updates Required:

1. **GetErrorString("")** - Must return empty string, not last error
   ```javascript
   // WRONG (2nd Edition):
   if (arg === "") return this.ErrorString;

   // CORRECT (3rd Edition):
   if (arg === "") return "";
   ```

2. **Initialize() Exit Reset** - Must reset exit to "unknown"
   ```javascript
   function Initialize(arg) {
     // ... validation ...
     this.RunTimeData.Exit = SCORM_EXIT_UNKNOWN;  // Required!
     this.Initialized = true;
     return SCORM_TRUE;
   }
   ```

3. **IsActivityLastOverall()** - Must check availability
   ```javascript
   // Find last AVAILABLE activity, not just last in tree
   for (var i = list.length - 1; i >= 0; i--) {
     if (list[i].IsAvailable()) {
       return activity == list[i];
     }
   }
   ```

### Optional Enhancements:

1. Add named error code constants for better code clarity
2. Implement ResetGlobalObjectives() for retry scenarios
3. Add FindDistinctAncestorsOfActivitySet() for rollup optimization
4. Fix GetPathToAncestorInclusive() default parameter bug

---

## Test Coverage Implications

Content that passed 2nd Edition conformance tests may fail 3rd Edition tests due to:

1. **GetErrorString("")** behavior change
2. **Exit attribute** not being reset properly
3. **Last activity** detection considering unavailable activities

Conformance tests should verify:
- GetErrorString("") returns ""
- cmi.exit resets to "unknown" on Initialize()
- Navigation considers activity availability, not just tree position
- Hidden activities due to prevent activation are properly blocked

---

## Conclusion

The SCORM 2004 3rd Edition represents important corrections to ambiguities in the 2nd Edition specification. The changes are primarily:

- **Specification clarifications** (GetErrorString behavior)
- **Bug fixes** (last activity detection, exit reset)
- **Enhancements** (named error codes, helper functions)
- **Code quality** (consistent formatting, typo fixes)

Implementations should prioritize the high-impact behavioral changes, particularly:
1. GetErrorString("") returning ""
2. Initialize() resetting exit to "unknown"
3. IsActivityLastOverall() checking availability

These changes ensure proper conformance with the updated test suite and improve interoperability between SCORM 2004 implementations.
