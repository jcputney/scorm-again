# Common Use Cases for scorm-again

This document provides examples of common use cases and patterns when working with scorm-again.
These examples are
applicable across all supported standards (SCORM 1.2, and SCORM 2004) with minor syntax
differences.

## Table of Contents

1. [E-Learning Course Initialization](#e-learning-course-initialization)
2. [Tracking Course Completion](#tracking-course-completion)
3. [Quiz and Assessment Handling](#quiz-and-assessment-handling)
4. [Bookmarking and Resume Functionality](#bookmarking-and-resume-functionality)
5. [Multi-Page Content Navigation](#multi-page-content-navigation)
6. [Custom Data Persistence](#custom-data-persistence)
7. [Handling Different LMS Environments](#handling-different-lms-environments)
8. [Offline Learning with Synchronization](#offline-learning-with-synchronization)
9. [Multi-SCO Module Support](#multi-sco-module-support)

## E-Learning Course Initialization

### Basic Course Initialization Pattern

```javascript
// This pattern works for all standards with appropriate API variable names
function initializeCourse() {
   // Determine which API is available
   let api;
   if (window.API_1484_11) {
      // SCORM 2004
      api = window.API_1484_11;
      api.Initialize("");
   } else if (window.API) {
      // SCORM 1.2
      api = window.API;
      api.LMSInitialize("");
   } else {
      console.error("No SCORM API found!");
      return false;
   }

   // Load learner information
   let learnerId, learnerName;
   if (api === window.API_1484_11) {
      // SCORM 2004
      learnerId = api.GetValue("cmi.learner_id");
      learnerName = api.GetValue("cmi.learner_name");
   } else {
      // SCORM 1.2
      learnerId = api.LMSGetValue("cmi.core.student_id");
      learnerName = api.LMSGetValue("cmi.core.student_name");
   }

   console.log(`Course initialized for: ${learnerName} (${learnerId})`);
   return true;
}
```

### Detecting Entry Mode (New vs. Resume)

```javascript
function detectEntryMode() {
   let entryMode;

   if (window.API_1484_11) {
      // SCORM 2004
      entryMode = window.API_1484_11.GetValue("cmi.entry");
   } else if (window.API) {
      // SCORM 1.2
      entryMode = window.API.LMSGetValue("cmi.core.entry");
   }

   if (entryMode === "resume" || entryMode === "ab-initio") {
      console.log("Resuming previous session");
      loadSavedState();
   } else {
      console.log("Starting new session");
      initializeNewSession();
   }
}

function loadSavedState() {
   let suspendData, location;

   if (window.API_1484_11) {
      // SCORM 2004
      suspendData = window.API_1484_11.GetValue("cmi.suspend_data");
      location = window.API_1484_11.GetValue("cmi.location");
   } else if (window.API) {
      // SCORM 1.2
      suspendData = window.API.LMSGetValue("cmi.suspend_data");
      location = window.API.LMSGetValue("cmi.core.lesson_location");
   }

   if (suspendData) {
      try {
         const savedState = JSON.parse(suspendData);
         // Restore application state from savedState
         console.log("Restored state:", savedState);
      } catch (e) {
         console.error("Error parsing suspend data:", e);
      }
   }

   if (location) {
      // Navigate to the saved location
      console.log("Navigating to:", location);
      navigateToPage(location);
   }
}
```

## Tracking Course Completion

### Basic Completion Tracking

```javascript
function markCourseCompleted() {
   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SetValue("cmi.completion_status", "completed");
      window.API_1484_11.Commit("");
   } else if (window.API) {
      // SCORM 1.2
      window.API.LMSSetValue("cmi.core.lesson_status", "completed");
      window.API.LMSCommit("");
   }
}
```

### Progress-Based Completion

```javascript
function updateProgress(completedPages, totalPages) {
   const progressPercentage = (completedPages / totalPages) * 100;
   const progressDecimal = completedPages / totalPages;

   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SetValue("cmi.progress_measure", progressDecimal.toFixed(2));

      // If progress is 100%, mark as completed
      if (progressPercentage >= 100) {
         window.API_1484_11.SetValue("cmi.completion_status", "completed");
      } else {
         window.API_1484_11.SetValue("cmi.completion_status", "incomplete");
      }

      window.API_1484_11.Commit("");
   } else if (window.API) {
      // SCORM 1.2 (no direct progress measure, use suspend_data)
      const suspendData = window.API.LMSGetValue("cmi.suspend_data");
      let stateObj = {};

      try {
         stateObj = suspendData ? JSON.parse(suspendData) : {};
      } catch (e) {
         console.error("Error parsing suspend data:", e);
      }

      stateObj.progress = progressPercentage;

      window.API.LMSSetValue("cmi.suspend_data", JSON.stringify(stateObj));

      // If progress is 100%, mark as completed
      if (progressPercentage >= 100) {
         window.API.LMSSetValue("cmi.core.lesson_status", "completed");
      }

      window.API.LMSCommit("");
   }

   console.log(`Progress updated: ${progressPercentage.toFixed(1)}%`);
}
```

### Completion with Success Status

```javascript
function markCourseCompletedWithSuccess(passed) {
   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SetValue("cmi.completion_status", "completed");
      window.API_1484_11.SetValue("cmi.success_status", passed ? "passed" : "failed");
      window.API_1484_11.Commit("");
   } else if (window.API) {
      // SCORM 1.2
      window.API.LMSSetValue("cmi.core.lesson_status", passed ? "passed" : "failed");
      window.API.LMSCommit("");
   }

   console.log(`Course completed with ${passed ? "passing" : "failing"} status`);
}
```

## Quiz and Assessment Handling

### Recording Quiz Results

```javascript
function recordQuizResults(score, maxScore, passed) {
   if (window.API_1484_11) {
      // SCORM 2004
      const scaledScore = score / maxScore;

      window.API_1484_11.SetValue("cmi.score.raw", score.toString());
      window.API_1484_11.SetValue("cmi.score.min", "0");
      window.API_1484_11.SetValue("cmi.score.max", maxScore.toString());
      window.API_1484_11.SetValue("cmi.score.scaled", scaledScore.toFixed(2));

      window.API_1484_11.SetValue("cmi.success_status", passed ? "passed" : "failed");
      window.API_1484_11.SetValue("cmi.completion_status", "completed");

      window.API_1484_11.Commit("");
   } else if (window.API) {
      // SCORM 1.2
      window.API.LMSSetValue("cmi.core.score.raw", score.toString());
      window.API.LMSSetValue("cmi.core.score.min", "0");
      window.API.LMSSetValue("cmi.core.score.max", maxScore.toString());

      window.API.LMSSetValue("cmi.core.lesson_status", passed ? "passed" : "failed");

      window.API.LMSCommit("");
   }

   console.log(`Quiz completed: Score ${score}/${maxScore}, ${passed ? "Passed" : "Failed"}`);
}
```

### Tracking Individual Question Responses

```javascript
function recordQuestionResponse(
    questionIndex,
    questionId,
    questionType,
    userResponse,
    correctResponse,
    result,
    timeSpent,
) {
   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SetValue(`cmi.interactions.${questionIndex}.id`, questionId);
      window.API_1484_11.SetValue(`cmi.interactions.${questionIndex}.type`, questionType);
      window.API_1484_11.SetValue(
          `cmi.interactions.${questionIndex}.learner_response`,
          userResponse,
      );
      window.API_1484_11.SetValue(
          `cmi.interactions.${questionIndex}.correct_responses.0.pattern`,
          correctResponse,
      );
      window.API_1484_11.SetValue(`cmi.interactions.${questionIndex}.result`, result);
      window.API_1484_11.SetValue(
          `cmi.interactions.${questionIndex}.latency`,
          formatTimeSpent(timeSpent, true),
      );
      window.API_1484_11.SetValue(
          `cmi.interactions.${questionIndex}.timestamp`,
          new Date().toISOString(),
      );
   } else if (window.API) {
      // SCORM 1.2
      window.API.LMSSetValue(`cmi.interactions.${questionIndex}.id`, questionId);
      window.API.LMSSetValue(`cmi.interactions.${questionIndex}.type`, questionType);
      window.API.LMSSetValue(`cmi.interactions.${questionIndex}.student_response`, userResponse);
      window.API.LMSSetValue(
          `cmi.interactions.${questionIndex}.correct_responses.0.pattern`,
          correctResponse,
      );
      window.API.LMSSetValue(`cmi.interactions.${questionIndex}.result`, result);
      window.API.LMSSetValue(
          `cmi.interactions.${questionIndex}.latency`,
          formatTimeSpent(timeSpent, false),
      );
   }
}

// Helper function to format time spent in the correct format for each standard
function formatTimeSpent(milliseconds, isScorm2004) {
   if (isScorm2004) {
      // ISO 8601 Duration format for SCORM 2004
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;

      return `PT${hours}H${remainingMinutes}M${remainingSeconds}S`;
   } else {
      // HH:MM:SS format for SCORM 1.2
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;

      return `${hours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
   }
}
```

## Bookmarking and Resume Functionality

### Saving and Retrieving Bookmarks

```javascript
function saveBookmark(location) {
   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SetValue("cmi.location", location);
      window.API_1484_11.Commit("");
   } else if (window.API) {
      // SCORM 1.2
      window.API.LMSSetValue("cmi.core.lesson_location", location);
      window.API.LMSCommit("");
   }

   console.log(`Bookmark saved: ${location}`);
}

function getBookmark() {
   let bookmark = "";

   if (window.API_1484_11) {
      // SCORM 2004
      bookmark = window.API_1484_11.GetValue("cmi.location");
   } else if (window.API) {
      // SCORM 1.2
      bookmark = window.API.LMSGetValue("cmi.core.lesson_location");
   }

   console.log(`Retrieved bookmark: ${bookmark}`);
   return bookmark;
}
```

### Comprehensive Resume System

```javascript
function saveState(currentPage, userProgress, userSelections, quizResults) {
   // Create a state object to store in suspend_data
   const stateObj = {
      currentPage,
      userProgress,
      userSelections,
      quizResults,
      timestamp: new Date().toISOString(),
   };

   // Save the state object
   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SetValue("cmi.suspend_data", JSON.stringify(stateObj));
      window.API_1484_11.SetValue("cmi.location", currentPage.toString());
      window.API_1484_11.Commit("");
   } else if (window.API) {
      // SCORM 1.2
      window.API.LMSSetValue("cmi.suspend_data", JSON.stringify(stateObj));
      window.API.LMSSetValue("cmi.core.lesson_location", currentPage.toString());
      window.API.LMSCommit("");
   }

   console.log("State saved:", stateObj);
}

function loadState() {
   let stateObj = null;
   let location = "";

   if (window.API_1484_11) {
      // SCORM 2004
      const suspendData = window.API_1484_11.GetValue("cmi.suspend_data");
      location = window.API_1484_11.GetValue("cmi.location");

      if (suspendData) {
         try {
            stateObj = JSON.parse(suspendData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
         }
      }
   } else if (window.API) {
      // SCORM 1.2
      const suspendData = window.API.LMSGetValue("cmi.suspend_data");
      location = window.API.LMSGetValue("cmi.core.lesson_location");

      if (suspendData) {
         try {
            stateObj = JSON.parse(suspendData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
         }
      }
   }

   // If we have state data, restore it
   if (stateObj) {
      console.log("State loaded:", stateObj);

      // Restore application state
      if (stateObj.currentPage) {
         navigateToPage(stateObj.currentPage);
      } else if (location) {
         navigateToPage(location);
      }

      return stateObj;
   } else if (location) {
      // If we only have location data, navigate to that page
      navigateToPage(location);
      return {currentPage: location};
   }

   return null;
}

// Example function to navigate to a page (implementation would depend on your application)
function navigateToPage(page) {
   console.log(`Navigating to page: ${page}`);
   // Your navigation logic here
}
```

## Multi-Page Content Navigation

### Tracking Page Views

```javascript
// Array to store visited pages
let visitedPages = [];

function trackPageView(pageId) {
   // Add page to visited pages if not already there
   if (!visitedPages.includes(pageId)) {
      visitedPages.push(pageId);
   }

   // Save current page as bookmark
   saveBookmark(pageId);

   // Save visited pages in suspend data
   saveVisitedPages();

   console.log(`Page viewed: ${pageId}`);
}

function saveVisitedPages() {
   // Get existing suspend data
   let suspendData = {};

   if (window.API_1484_11) {
      // SCORM 2004
      const existingData = window.API_1484_11.GetValue("cmi.suspend_data");
      if (existingData) {
         try {
            suspendData = JSON.parse(existingData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
         }
      }

      // Update visited pages
      suspendData.visitedPages = visitedPages;

      // Save back to LMS
      window.API_1484_11.SetValue("cmi.suspend_data", JSON.stringify(suspendData));
      window.API_1484_11.Commit("");
   } else if (window.API) {
      // SCORM 1.2
      const existingData = window.API.LMSGetValue("cmi.suspend_data");
      if (existingData) {
         try {
            suspendData = JSON.parse(existingData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
         }
      }

      // Update visited pages
      suspendData.visitedPages = visitedPages;

      // Save back to LMS
      window.API.LMSSetValue("cmi.suspend_data", JSON.stringify(suspendData));
      window.API.LMSCommit("");
   }
}

function loadVisitedPages() {
   // Get suspend data
   let suspendData = {};

   if (window.API_1484_11) {
      // SCORM 2004
      const existingData = window.API_1484_11.GetValue("cmi.suspend_data");
      if (existingData) {
         try {
            suspendData = JSON.parse(existingData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
         }
      }
   } else if (window.API) {
      // SCORM 1.2
      const existingData = window.API.LMSGetValue("cmi.suspend_data");
      if (existingData) {
         try {
            suspendData = JSON.parse(existingData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
         }
      }
   }

   // Restore visited pages
   if (suspendData.visitedPages) {
      visitedPages = suspendData.visitedPages;
      console.log("Loaded visited pages:", visitedPages);
   }

   return visitedPages;
}
```

### Navigation Controls with SCORM 2004 Sequencing

```javascript
function goToNextPage() {
   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SequenceNext("");
   } else {
      // For SCORM 1.2, implement custom navigation
      const currentPage = getCurrentPage();
      const nextPage = getNextPageId(currentPage);
      navigateToPage(nextPage);
   }
}

function goToPreviousPage() {
   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SequencePrevious("");
   } else {
      // For SCORM 1.2, implement custom navigation
      const currentPage = getCurrentPage();
      const prevPage = getPreviousPageId(currentPage);
      navigateToPage(prevPage);
   }
}

function jumpToPage(pageId) {
   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SequenceChoice(pageId);
   } else {
      // For SCORM 1.2, implement custom navigation
      navigateToPage(pageId);
   }
}

// Helper functions (implementation would depend on your application)
function getCurrentPage() {
   // Return the current page ID
   return document.body.getAttribute("data-page-id") || "1";
}

function getNextPageId(currentPageId) {
   // Logic to determine the next page based on current page
   return (parseInt(currentPageId) + 1).toString();
}

function getPreviousPageId(currentPageId) {
   // Logic to determine the previous page based on current page
   return Math.max(1, parseInt(currentPageId) - 1).toString();
}
```

## Custom Data Persistence

### Storing and Retrieving Complex Data

```javascript
function saveCustomData(dataObject) {
   // Get existing suspend data
   let suspendData = {};

   if (window.API_1484_11) {
      // SCORM 2004
      const existingData = window.API_1484_11.GetValue("cmi.suspend_data");
      if (existingData) {
         try {
            suspendData = JSON.parse(existingData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
            suspendData = {};
         }
      }

      // Merge new data with existing data
      suspendData = {...suspendData, ...dataObject};

      // Save back to LMS
      window.API_1484_11.SetValue("cmi.suspend_data", JSON.stringify(suspendData));
      window.API_1484_11.Commit("");
   } else if (window.API) {
      // SCORM 1.2
      const existingData = window.API.LMSGetValue("cmi.suspend_data");
      if (existingData) {
         try {
            suspendData = JSON.parse(existingData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
            suspendData = {};
         }
      }

      // Merge new data with existing data
      suspendData = {...suspendData, ...dataObject};

      // Save back to LMS
      window.API.LMSSetValue("cmi.suspend_data", JSON.stringify(suspendData));
      window.API.LMSCommit("");
   }

   console.log("Custom data saved:", dataObject);
}

function getCustomData() {
   // Get suspend data
   let suspendData = {};

   if (window.API_1484_11) {
      // SCORM 2004
      const existingData = window.API_1484_11.GetValue("cmi.suspend_data");
      if (existingData) {
         try {
            suspendData = JSON.parse(existingData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
         }
      }
   } else if (window.API) {
      // SCORM 1.2
      const existingData = window.API.LMSGetValue("cmi.suspend_data");
      if (existingData) {
         try {
            suspendData = JSON.parse(existingData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
         }
      }
   }

   console.log("Custom data loaded:", suspendData);
   return suspendData;
}
```

### Handling Large Data Sets

```javascript
function saveChunkedData(dataObject) {
   // Convert data to JSON string
   const jsonString = JSON.stringify(dataObject);

   // Check if we need to chunk the data (SCORM typically has a limit around 4096 characters)
   const CHUNK_SIZE = 4000; // Slightly less than 4096 to be safe

   if (jsonString.length <= CHUNK_SIZE) {
      // Data fits in a single chunk
      saveCustomData({data: jsonString});
      return;
   }

   // Split data into chunks
   const chunks = [];
   for (let i = 0; i < jsonString.length; i += CHUNK_SIZE) {
      chunks.push(jsonString.substring(i, i + CHUNK_SIZE));
   }

   // Save chunk information
   const chunkInfo = {
      chunkCount: chunks.length,
      dataType: "chunked",
      timestamp: new Date().toISOString(),
   };

   // Save each chunk
   if (window.API_1484_11) {
      // SCORM 2004
      window.API_1484_11.SetValue("cmi.suspend_data", JSON.stringify(chunkInfo));
      window.API_1484_11.Commit("");

      // Save each chunk to a custom interaction
      for (let i = 0; i < chunks.length; i++) {
         window.API_1484_11.SetValue(`cmi.interactions.${i}.id`, `data_chunk_${i}`);
         window.API_1484_11.SetValue(`cmi.interactions.${i}.type`, "other");
         window.API_1484_11.SetValue(`cmi.interactions.${i}.learner_response`, chunks[i]);
      }
      window.API_1484_11.Commit("");
   } else if (window.API) {
      // SCORM 1.2
      window.API.LMSSetValue("cmi.suspend_data", JSON.stringify(chunkInfo));
      window.API.LMSCommit("");

      // Save each chunk to a custom interaction
      for (let i = 0; i < chunks.length; i++) {
         window.API.LMSSetValue(`cmi.interactions.${i}.id`, `data_chunk_${i}`);
         window.API.LMSSetValue(`cmi.interactions.${i}.type`, "other");
         window.API.LMSSetValue(`cmi.interactions.${i}.student_response`, chunks[i]);
      }
      window.API.LMSCommit("");
   }

   console.log(`Saved chunked data with ${chunks.length} chunks`);
}

function loadChunkedData() {
   // Get chunk information from suspend_data
   let chunkInfo = {};

   if (window.API_1484_11) {
      // SCORM 2004
      const suspendData = window.API_1484_11.GetValue("cmi.suspend_data");
      if (suspendData) {
         try {
            chunkInfo = JSON.parse(suspendData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
            return null;
         }
      }
   } else if (window.API) {
      // SCORM 1.2
      const suspendData = window.API.LMSGetValue("cmi.suspend_data");
      if (suspendData) {
         try {
            chunkInfo = JSON.parse(suspendData);
         } catch (e) {
            console.error("Error parsing suspend data:", e);
            return null;
         }
      }
   }

   // Check if we have chunked data
   if (!chunkInfo.dataType || chunkInfo.dataType !== "chunked" || !chunkInfo.chunkCount) {
      console.log("No chunked data found");
      return null;
   }

   // Retrieve all chunks
   const chunks = [];
   for (let i = 0; i < chunkInfo.chunkCount; i++) {
      let chunkData;

      if (window.API_1484_11) {
         // SCORM 2004
         chunkData = window.API_1484_11.GetValue(`cmi.interactions.${i}.learner_response`);
      } else if (window.API) {
         // SCORM 1.2
         chunkData = window.API.LMSGetValue(`cmi.interactions.${i}.student_response`);
      }

      if (chunkData) {
         chunks.push(chunkData);
      } else {
         console.error(`Failed to retrieve chunk ${i}`);
         return null;
      }
   }

   // Combine chunks and parse the data
   const jsonString = chunks.join("");
   try {
      const dataObject = JSON.parse(jsonString);
      console.log("Loaded chunked data:", dataObject);
      return dataObject;
   } catch (e) {
      console.error("Error parsing chunked data:", e);
      return null;
   }
}
```

## Handling Different LMS Environments

### Detecting API Availability

```javascript
function findAPI(win) {
   // Check if the API is directly available
   if (win.API_1484_11) {
      return {api: win.API_1484_11, version: "2004"};
   } else if (win.API) {
      return {api: win.API, version: "1.2"};
   }

   // Try to find the API in the parent window
   let findAttempts = 0;
   const MAX_ATTEMPTS = 10;

   while (win.parent && win.parent !== win && findAttempts < MAX_ATTEMPTS) {
      findAttempts++;
      win = win.parent;

      if (win.API_1484_11) {
         return {api: win.API_1484_11, version: "2004"};
      } else if (win.API) {
         return {api: win.API, version: "1.2"};
      }
   }

   // Try to find the API in the opener window
   if (window.opener && window.opener !== window) {
      const openerWin = window.opener;

      if (openerWin.API_1484_11) {
         return {api: openerWin.API_1484_11, version: "2004"};
      } else if (openerWin.API) {
         return {api: openerWin.API, version: "1.2"};
      }
   }

   return {api: null, version: null};
}

function initializeCourseWithAPIDetection() {
   const {api, version} = findAPI(window);

   if (!api) {
      console.error("No SCORM API found. Running in standalone mode.");
      initializeStandaloneMode();
      return false;
   }

   console.log(`Found SCORM API version: ${version}`);

   if (version === "2004") {
      api.Initialize("");
      const learnerId = api.GetValue("cmi.learner_id");
      const learnerName = api.GetValue("cmi.learner_name");
      console.log(`Course initialized for: ${learnerName} (${learnerId})`);
   } else {
      api.LMSInitialize("");
      const studentId = api.LMSGetValue("cmi.core.student_id");
      const studentName = api.LMSGetValue("cmi.core.student_name");
      console.log(`Course initialized for: ${studentName} (${studentId})`);
   }

   return true;
}

function initializeStandaloneMode() {
   // Set up a mock API for testing or standalone use
   console.log("Initializing standalone mode");

   // Create a mock storage using localStorage
   const mockStorage = {
      data: {},

      getValue: function (key) {
         return this.data[key] || "";
      },

      setValue: function (key, value) {
         this.data[key] = value;
         // Persist to localStorage
         localStorage.setItem("scorm_mock_data", JSON.stringify(this.data));
         return "true";
      },

      initialize: function () {
         // Load data from localStorage if available
         const savedData = localStorage.getItem("scorm_mock_data");
         if (savedData) {
            try {
               this.data = JSON.parse(savedData);
            } catch (e) {
               console.error("Error loading mock data:", e);
               this.data = {};
            }
         }
         return "true";
      },

      terminate: function () {
         // Ensure data is saved
         localStorage.setItem("scorm_mock_data", JSON.stringify(this.data));
         return "true";
      },

      commit: function () {
         // Persist to localStorage
         localStorage.setItem("scorm_mock_data", JSON.stringify(this.data));
         return "true";
      },
   };

   // Create mock SCORM 2004 API
   window.API_1484_11 = {
      Initialize: function () {
         return mockStorage.initialize();
      },
      Terminate: function () {
         return mockStorage.terminate();
      },
      GetValue: function (key) {
         return mockStorage.getValue(key);
      },
      SetValue: function (key, value) {
         return mockStorage.setValue(key, value);
      },
      Commit: function () {
         return mockStorage.commit();
      },
      GetLastError: function () {
         return "0";
      },
      GetErrorString: function () {
         return "";
      },
      GetDiagnostic: function () {
         return "";
      },
   };

   // Initialize with default learner data
   window.API_1484_11.SetValue("cmi.learner_id", "standalone_user");
   window.API_1484_11.SetValue("cmi.learner_name", "Standalone User");

   console.log("Standalone mode initialized");
}
```

### Adapting to Different LMS Implementations

```javascript
function adaptToLMS() {
   // Detect which LMS we're running in based on available features or behaviors
   let lmsType = detectLMSType();

   console.log(`Detected LMS type: ${lmsType}`);

   // Apply LMS-specific adaptations
   switch (lmsType) {
      case "moodle":
         applyMoodleAdaptations();
         break;
      case "blackboard":
         applyBlackboardAdaptations();
         break;
      case "canvas":
         applyCanvasAdaptations();
         break;
      case "scorm_cloud":
         applyScormCloudAdaptations();
         break;
      default:
         console.log("Using default LMS behavior");
   }
}

function detectLMSType() {
   // Try to detect the LMS based on URL, available objects, or behavior
   const url = window.location.href.toLowerCase();

   if (url.includes("moodle")) {
      return "moodle";
   } else if (url.includes("blackboard") || url.includes("bb-")) {
      return "blackboard";
   } else if (url.includes("canvas")) {
      return "canvas";
   } else if (url.includes("scorm.com") || url.includes("scormcloud")) {
      return "scorm_cloud";
   }

   // If URL detection fails, try behavior detection
   try {
      // Example: Some LMSs might have specific global objects
      if (window.MOODLE_SCORM_API) {
         return "moodle";
      } else if (window.BB_SCORM_API) {
         return "blackboard";
      }
   } catch (e) {
      console.error("Error during LMS detection:", e);
   }

   return "unknown";
}

// Example adaptations for different LMSs
function applyMoodleAdaptations() {
   // Moodle-specific adaptations
   console.log("Applying Moodle-specific adaptations");

   // Example: Moodle might have issues with certain data formats
   window.originalSetValue = window.API_1484_11
       ? window.API_1484_11.SetValue
       : window.API.LMSSetValue;

   if (window.API_1484_11) {
      window.API_1484_11.SetValue = function (key, value) {
         // Moodle-specific value transformations
         if (key === "cmi.interactions.n.result" && value === "unanticipated") {
            // Some LMSs might not support all result values
            value = "neutral";
         }
         return window.originalSetValue.call(this, key, value);
      };
   } else if (window.API) {
      window.API.LMSSetValue = function (key, value) {
         // Moodle-specific value transformations
         if (
             key.includes("cmi.interactions") &&
             key.includes(".result") &&
             value === "unanticipated"
         ) {
            value = "neutral";
         }
         return window.originalSetValue.call(this, key, value);
      };
   }
}

// Other LMS-specific adaptation functions would be implemented similarly
```

## Offline Learning with Synchronization

### Setting Up Offline Mode

```javascript
// Flag to track if we're in offline mode
let isOfflineMode = false;

// Storage for offline data
const offlineStorage = {
   data: {},
   pendingCommits: [],

   initialize: function () {
      // Load data from localStorage
      const savedData = localStorage.getItem("scorm_offline_data");
      const pendingCommits = localStorage.getItem("scorm_pending_commits");

      if (savedData) {
         try {
            this.data = JSON.parse(savedData);
         } catch (e) {
            console.error("Error loading offline data:", e);
            this.data = {};
         }
      }

      if (pendingCommits) {
         try {
            this.pendingCommits = JSON.parse(pendingCommits);
         } catch (e) {
            console.error("Error loading pending commits:", e);
            this.pendingCommits = [];
         }
      }

      return "true";
   },

   getValue: function (key) {
      return this.data[key] || "";
   },

   setValue: function (key, value) {
      this.data[key] = value;
      // Record the change for later synchronization
      this.pendingCommits.push({ key, value, timestamp: new Date().toISOString() });
      // Save to localStorage
      this.saveToLocalStorage();
      return "true";
   },

   commit: function () {
      // In offline mode, just save to localStorage
      this.saveToLocalStorage();
      return "true";
   },

   saveToLocalStorage: function () {
      localStorage.setItem("scorm_offline_data", JSON.stringify(this.data));
      localStorage.setItem("scorm_pending_commits", JSON.stringify(this.pendingCommits));
   },
};

function setupOfflineMode() {
   console.log("Setting up offline mode");
   isOfflineMode = true;

   // Initialize offline storage
   offlineStorage.initialize();

   // Create offline API proxies
   if (window.API_1484_11) {
      // Save original API
      window._originalAPI_1484_11 = window.API_1484_11;

      // Create proxy API
      window.API_1484_11 = {
         Initialize: function () {
            console.log("Initialize called in offline mode");
            return "true";
         },
         Terminate: function () {
            console.log("Terminate called in offline mode");
            return "true";
         },
         GetValue: function (key) {
            return offlineStorage.getValue(key);
         },
         SetValue: function (key, value) {
            return offlineStorage.setValue(key, value);
         },
         Commit: function () {
            return offlineStorage.commit();
         },
         GetLastError: function () {
            return "0";
         },
         GetErrorString: function () {
            return "";
         },
         GetDiagnostic: function () {
            return "";
         },
      };
   } else if (window.API) {
      // Save original API
      window._originalAPI = window.API;

      // Create proxy API
      window.API = {
         LMSInitialize: function () {
            console.log("LMSInitialize called in offline mode");
            return "true";
         },
         LMSFinish: function () {
            console.log("LMSFinish called in offline mode");
            return "true";
         },
         LMSGetValue: function (key) {
            return offlineStorage.getValue(key);
         },
         LMSSetValue: function (key, value) {
            return offlineStorage.setValue(key, value);
         },
         LMSCommit: function () {
            return offlineStorage.commit();
         },
         LMSGetLastError: function () {
            return "0";
         },
         LMSGetErrorString: function () {
            return "";
         },
         LMSGetDiagnostic: function () {
            return "";
         },
      };
   }

   console.log("Offline mode setup complete");
}

function detectOfflineStatus() {
   // Check if we're online
   const isOnline = navigator.onLine;

   if (!isOnline && !isOfflineMode) {
      console.log("Network connection lost. Switching to offline mode.");
      setupOfflineMode();
      return false;
   } else if (isOnline && isOfflineMode) {
      console.log("Network connection restored. Attempting to synchronize.");
      synchronizeWithLMS();
      return true;
   }

   return isOnline;
}

// Set up periodic checks for online status
function setupOfflineStatusMonitoring() {
   // Check immediately
   detectOfflineStatus();

   // Set up event listeners for online/offline events
   window.addEventListener("online", function () {
      console.log("Device is now online");
      synchronizeWithLMS();
   });

   window.addEventListener("offline", function () {
      console.log("Device is now offline");
      setupOfflineMode();
   });

   // Also check periodically
   setInterval(detectOfflineStatus, 30000); // Check every 30 seconds
}
```

### Synchronizing with LMS

```javascript
function synchronizeWithLMS() {
   console.log("Attempting to synchronize with LMS");

   // Check if we have pending commits
   if (!offlineStorage.pendingCommits || offlineStorage.pendingCommits.length === 0) {
      console.log("No pending commits to synchronize");

      // Restore original API if it exists
      restoreOriginalAPI();
      isOfflineMode = false;
      return;
   }

   // Try to find the API
   const { api, version } = findAPI(window);

   if (!api) {
      console.error("Cannot synchronize: No SCORM API found");
      return;
   }

   // Initialize the API
   let initResult;
   if (version === "2004") {
      initResult = api.Initialize("");
   } else {
      initResult = api.LMSInitialize("");
   }

   if (initResult !== "true") {
      console.error("Failed to initialize API for synchronization");
      return;
   }

   // Apply all pending commits
   let success = true;
   const pendingCommits = [...offlineStorage.pendingCommits]; // Create a copy

   for (const commit of pendingCommits) {
      let setResult;

      if (version === "2004") {
         setResult = api.SetValue(commit.key, commit.value);
      } else {
         setResult = api.LMSSetValue(commit.key, commit.value);
      }

      if (setResult !== "true") {
         console.error(`Failed to synchronize commit: ${commit.key} = ${commit.value}`);
         success = false;
         break;
      }

      // Remove from pending commits
      const index = offlineStorage.pendingCommits.findIndex(
         (c) => c.key === commit.key && c.timestamp === commit.timestamp,
      );
      if (index !== -1) {
         offlineStorage.pendingCommits.splice(index, 1);
      }
   }

   // Commit the changes
   let commitResult;
   if (version === "2004") {
      commitResult = api.Commit("");
   } else {
      commitResult = api.LMSCommit("");
   }

   if (commitResult !== "true") {
      console.error("Failed to commit synchronized changes");
      success = false;
   }

   // Terminate the API
   let terminateResult;
   if (version === "2004") {
      terminateResult = api.Terminate("");
   } else {
      terminateResult = api.LMSFinish("");
   }

   if (terminateResult !== "true") {
      console.error("Failed to terminate API after synchronization");
   }

   // Save updated pending commits list
   offlineStorage.saveToLocalStorage();

   if (success) {
      console.log("Synchronization completed successfully");

      // Restore original API if it exists
      restoreOriginalAPI();
      isOfflineMode = false;
   } else {
      console.error("Synchronization completed with errors");
   }
}

function restoreOriginalAPI() {
   if (window._originalAPI_1484_11) {
      window.API_1484_11 = window._originalAPI_1484_11;
      window._originalAPI_1484_11 = null;
   }

   if (window._originalAPI) {
      window.API = window._originalAPI;
      window._originalAPI = null;
   }

   console.log("Original API restored");
}

// Example usage
function initializeWithOfflineSupport() {
   // Try to initialize normally
   const { api, version } = findAPI(window);

   if (!api) {
      console.log("No SCORM API found. Setting up offline mode.");
      setupOfflineMode();
      return;
   }

   // Set up offline monitoring even if we're online now
   setupOfflineStatusMonitoring();

   // Initialize normally
   if (version === "2004") {
      api.Initialize("");
   } else {
      api.LMSInitialize("");
   }

   console.log("Initialized with offline support");
}
```

## Multi-SCO Module Support

Multi-SCO (Shareable Content Object) modules are SCORM packages that contain multiple independent
learning objects within a single course. Each SCO maintains its own CMI data (completion status,
scores, bookmarks, etc.) and can be launched independently by the LMS.

### Understanding Multi-SCO Architecture

In a multi-SCO course:

- The **LMS** is responsible for:
   - Parsing the manifest to identify all SCOs
   - Launching each SCO in sequence or based on learner choice
   - Persisting CMI data separately for each SCO
   - Managing navigation between SCOs

- The **scorm-again API** provides:
   - Session management via `reset()` for SCO transitions
   - Data pre-loading via `loadFromJSON()` for resuming SCOs
   - Commit metadata population for identifying which SCO is committing data
   - Event system for monitoring SCO lifecycle

### Basic Multi-SCO Setup (LMS-Side)

```javascript
import { Scorm12API } from 'scorm-again';

// Create a single API instance for the course
const api = new Scorm12API({
   lmsCommitUrl: '/api/scorm/commit',
   autoPopulateCommitMetadata: true,  // Automatically include SCO info in commits
   courseId: 'course-12345',
});

// Storage for each SCO's data (typically from your database)
const scoDataStore = {
   'sco-intro': { /* saved CMI data */ },
   'sco-module1': { /* saved CMI data */ },
   'sco-quiz': { /* saved CMI data */ },
};

/**
 * Launch a specific SCO
 * @param {string} scoId - The identifier for the SCO to launch
 */
function launchSCO(scoId) {
   // Reset the API for the new SCO
   api.reset({
      scoId: scoId,  // Identify which SCO is active
      autoPopulateCommitMetadata: true,
   });

   // Pre-load any saved data for this SCO
   const savedData = scoDataStore[scoId];
   if (savedData) {
      api.loadFromJSON(savedData);
   }

   // Launch the SCO content (implementation depends on your LMS)
   loadSCOContent(scoId);

   // The SCO will call LMSInitialize() when it loads
}

/**
 * Handle commit data from a SCO
 * This would typically be your server-side endpoint
 */
function handleCommit(commitObject) {
   // commitObject now includes:
   // - courseId: 'course-12345'
   // - scoId: 'sco-module1' (whichever SCO is active)
   // - learnerId: from cmi.core.student_id
   // - learnerName: from cmi.core.student_name
   // - successStatus, completionStatus, score, runtimeData, etc.

   // Save the data keyed by both courseId and scoId
   saveToDB(commitObject.courseId, commitObject.scoId, commitObject);
}
```

### Handling SCO Transitions

When a learner navigates from one SCO to another:

```javascript
// Listen for navigation events
api.on('SequenceNext', () => {
   const currentScoIndex = getCurrentScoIndex();
   const nextSco = scoList[currentScoIndex + 1];

   if (nextSco) {
      launchSCO(nextSco.id);
   } else {
      // Course complete
      showCourseComplete();
   }
});

api.on('SequencePrevious', () => {
   const currentScoIndex = getCurrentScoIndex();
   const prevSco = scoList[currentScoIndex - 1];

   if (prevSco) {
      launchSCO(prevSco.id);
   }
});

// Example: Sequential SCO launch
function launchNextSCO() {
   // Save current SCO data
   const currentData = api.renderCommitObject(true);
   scoDataStore[currentScoId] = currentData.runtimeData;

   // Move to next SCO
   const nextScoId = getNextScoId();
   launchSCO(nextScoId);
}
```

### Pre-loading Learner Data

When a learner resumes a previously-started SCO:

```javascript
// Example: Resume a SCO with saved data
function resumeSCO(scoId, savedCmiData) {
   api.reset({
      scoId: scoId,
      autoPopulateCommitMetadata: true,
   });

   // Load the saved CMI data before initialization
   // This MUST be done before the SCO calls LMSInitialize()
   api.loadFromJSON({
      cmi: {
         core: {
            student_id: savedCmiData.studentId,
            student_name: savedCmiData.studentName,
            lesson_status: savedCmiData.lessonStatus,
            lesson_location: savedCmiData.bookmark,
            score: {
               raw: savedCmiData.scoreRaw,
               min: savedCmiData.scoreMin,
               max: savedCmiData.scoreMax,
            },
         },
         suspend_data: savedCmiData.suspendData,
      },
   });

   // Now launch the SCO content
   loadSCOContent(scoId);
}
```

### Using requestHandler for Custom Commit Processing

If you need more control over commit data beyond `autoPopulateCommitMetadata`:

```javascript
const api = new Scorm12API({
   lmsCommitUrl: '/api/scorm/commit',
   courseId: 'course-12345',

   // Custom request handler for full control
   requestHandler: (commitObject) => {
      // Add custom fields
      return {
         ...commitObject,
         scoId: currentScoId,
         attemptNumber: currentAttempt,
         customField: 'custom-value',
         timestamp: new Date().toISOString(),
      };
   },
});
```

### SCORM 2004 Multi-SCO with Sequencing

SCORM 2004 has built-in sequencing support. When sequencing is active, `activityId` is
automatically populated from the sequencing service:

```javascript
import { Scorm2004API } from 'scorm-again';

const api = new Scorm2004API({
   lmsCommitUrl: '/api/scorm/commit',
   autoPopulateCommitMetadata: true,
   courseId: 'course-2004-xyz',
   scoId: 'activity-1',  // Can also be set; activityId comes from sequencing

   // Sequencing configuration
   sequencing: {
      // Your sequencing settings from the manifest
   },
});

// When autoPopulateCommitMetadata is true, commits include:
// - courseId: from settings
// - scoId: from settings
// - activityId: from the current sequencing activity (if sequencing is active)
// - learnerId: from cmi.learner_id
// - learnerName: from cmi.learner_name
```

### Settings Reference for Multi-SCO Support

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `courseId` | `string` | `""` | Identifier for the course (used in offline storage and commit metadata) |
| `scoId` | `string` | `""` | Identifier for the current SCO |
| `autoPopulateCommitMetadata` | `boolean` | `false` | When `true`, automatically includes `courseId`, `scoId`, `learnerId`, and `learnerName` in commit objects |

### CommitObject Metadata Fields

When `autoPopulateCommitMetadata` is enabled, the following fields are populated:

| Field | Source (SCORM 1.2) | Source (SCORM 2004) |
|-------|-------------------|---------------------|
| `courseId` | `settings.courseId` | `settings.courseId` |
| `scoId` | `settings.scoId` | `settings.scoId` |
| `learnerId` | `cmi.core.student_id` | `cmi.learner_id` |
| `learnerName` | `cmi.core.student_name` | `cmi.learner_name` |
| `activityId` | N/A | Current sequencing activity ID |

### Best Practices for Multi-SCO Implementation

1. **One API instance per course attempt** - Create a single API instance and use `reset()` for
   SCO transitions rather than creating new instances.

2. **Always call `reset()` before loading new SCO data** - This clears the previous SCO's state
   and prepares the API for the new SCO.

3. **Pre-load data before `LMSInitialize()`** - The `loadFromJSON()` method must be called before
   the SCO content calls `LMSInitialize()`.

4. **Use `autoPopulateCommitMetadata`** - This simplifies server-side processing by automatically
   including SCO identification in every commit.

5. **Store data by courseId + scoId** - Ensure your backend storage is keyed by both course and
   SCO identifiers to properly isolate each SCO's data.

6. **Handle navigation events** - Listen for `SequenceNext` and `SequencePrevious` events to
   manage SCO transitions.

7. **Re-register event listeners after reset** - Event listeners are cleared during `reset()`,
   so re-register them for each new SCO if needed.
