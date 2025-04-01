# SCORM Again Troubleshooting Guide

This guide provides solutions for common issues you might encounter when working with SCORM Again. It covers problems related to API initialization, data persistence, LMS communication, and more.

## Table of Contents
1. [API Initialization Issues](#api-initialization-issues)
2. [Data Persistence Problems](#data-persistence-problems)
3. [LMS Communication Errors](#lms-communication-errors)
4. [Content Display Issues](#content-display-issues)
5. [Tracking and Reporting Problems](#tracking-and-reporting-problems)
6. [Cross-Browser Compatibility](#cross-browser-compatibility)
7. [Performance Issues](#performance-issues)
8. [Error Code Reference](#error-code-reference)

## API Initialization Issues

### API Not Found

**Problem**: The SCORM API cannot be found by your content.

**Symptoms**:
- Console errors like "Cannot find API" or "API not found"
- Content loads but doesn't save progress
- LMS reports that the content never initialized

**Solutions**:
1. **Check API Discovery Implementation**:
   ```javascript
   function findAPI(win) {
     // Check if the API is directly available
     if (win.API_1484_11) {
       return { api: win.API_1484_11, version: '2004' };
     } else if (win.API) {
       return { api: win.API, version: '1.2' };
     }

     // Try to find the API in the parent window
     let findAttempts = 0;
     const MAX_ATTEMPTS = 10;

     while (win.parent && win.parent !== win && findAttempts < MAX_ATTEMPTS) {
       findAttempts++;
       win = win.parent;

       if (win.API_1484_11) {
         return { api: win.API_1484_11, version: '2004' };
       } else if (win.API) {
         return { api: win.API, version: '1.2' };
       }
     }

     return { api: null, version: null };
   }
   ```

2. **Verify Content Launch Method**: Ensure your content is launched through the LMS, not directly from the file system.

3. **Check for iFrame Issues**: If your content is in an iFrame, make sure it can access the parent window where the API might be located.

4. **Implement Fallback Mode**: Add a standalone mode for when the API isn't available:
   ```javascript
   const { api, version } = findAPI(window);
   if (!api) {
     console.warn('No SCORM API found. Running in standalone mode.');
     initializeStandaloneMode();
   }
   ```

### Initialization Failure

**Problem**: The API is found but fails to initialize.

**Symptoms**:
- LMSInitialize() or Initialize() returns "false"
- Error codes returned from GetLastError()
- Content loads but doesn't function properly

**Solutions**:
1. **Check Initialization Parameters**:
   ```javascript
   // SCORM 1.2 and AICC
   const result = window.API.LMSInitialize('');  // Empty string is required

   // SCORM 2004
   const result = window.API_1484_11.Initialize('');  // Empty string is required
   ```

2. **Verify Initialization Timing**: Make sure you're not trying to initialize the API multiple times or after it's already been terminated.

3. **Check Error Codes**:
   ```javascript
   if (result !== 'true') {
     const errorCode = window.API.LMSGetLastError();
     const errorString = window.API.LMSGetErrorString(errorCode);
     const diagnostic = window.API.LMSGetDiagnostic(errorCode);
     console.error(`Initialization failed: ${errorCode} - ${errorString} - ${diagnostic}`);
   }
   ```

4. **Implement Retry Logic**:
   ```javascript
   function initializeWithRetry(maxAttempts = 3) {
     let attempts = 0;
     let success = false;

     while (!success && attempts < maxAttempts) {
       attempts++;
       const result = window.API.LMSInitialize('');
       success = (result === 'true');

       if (!success) {
         console.warn(`Initialization attempt ${attempts} failed. Retrying...`);
         // Wait a moment before retrying
         setTimeout(() => {}, 500);
       }
     }

     return success;
   }
   ```

## Data Persistence Problems

### Data Not Saving

**Problem**: Changes made to CMI data are not being saved to the LMS.

**Symptoms**:
- Progress is lost between sessions
- Scores are not recorded
- Bookmarks don't work

**Solutions**:
1. **Ensure Proper Commit Calls**:
   ```javascript
   // After setting values, always commit
   window.API.LMSSetValue('cmi.core.lesson_status', 'completed');
   window.API.LMSCommit('');  // Don't forget to commit!
   ```

2. **Check for Commit Errors**:
   ```javascript
   const commitResult = window.API.LMSCommit('');
   if (commitResult !== 'true') {
     const errorCode = window.API.LMSGetLastError();
     console.error(`Commit failed: ${errorCode}`);
   }
   ```

3. **Implement Automatic Commits**:
   ```javascript
   // Set up automatic commits every 30 seconds
   const settings = {
     autocommit: true,
     autocommitSeconds: 30
   };
   window.API = new Scorm12API(settings);
   ```

4. **Verify Data Format**:
   ```javascript
   // SCORM 1.2 time format must be HH:MM:SS
   window.API.LMSSetValue('cmi.core.session_time', '01:30:00');

   // SCORM 2004 time format must be ISO 8601 duration
   window.API_1484_11.SetValue('cmi.session_time', 'PT1H30M0S');
   ```

### Suspend Data Size Limitations

**Problem**: Large suspend_data values are being truncated or not saving.

**Symptoms**:
- Complex state data is incomplete when resumed
- Console errors about data size
- Only partial data is recovered on resume

**Solutions**:
1. **Compress Data**:
   ```javascript
   function saveCompressedData(data) {
     // Convert to JSON string
     const jsonString = JSON.stringify(data);

     // Use a compression library like lz-string
     const compressed = LZString.compressToBase64(jsonString);

     // Save compressed data
     window.API.LMSSetValue('cmi.suspend_data', compressed);
     window.API.LMSCommit('');
   }

   function loadCompressedData() {
     const compressed = window.API.LMSGetValue('cmi.suspend_data');
     if (!compressed) return null;

     // Decompress
     const jsonString = LZString.decompressFromBase64(compressed);
     if (!jsonString) return null;

     // Parse JSON
     try {
       return JSON.parse(jsonString);
     } catch (e) {
       console.error('Error parsing suspend data:', e);
       return null;
     }
   }
   ```

2. **Use Chunking Strategy**:
   ```javascript
   // See the "Handling Large Data Sets" section in the common use cases documentation
   // for a complete implementation of data chunking
   ```

3. **Prioritize Critical Data**:
   ```javascript
   function saveEssentialData(allData) {
     // Extract only the most critical data
     const essentialData = {
       currentPage: allData.currentPage,
       completionStatus: allData.completionStatus,
       lastQuizScore: allData.quizResults?.score
     };

     // Save this smaller object
     window.API.LMSSetValue('cmi.suspend_data', JSON.stringify(essentialData));
     window.API.LMSCommit('');
   }
   ```

## LMS Communication Errors

### Network Errors

**Problem**: Communication with the LMS server fails due to network issues.

**Symptoms**:
- Console errors about failed network requests
- Commit calls return "false"
- Data doesn't persist between sessions

**Solutions**:
1. **Implement Offline Mode**:
   ```javascript
   // See the "Offline Learning with Synchronization" section in the common use cases documentation
   // for a complete implementation of offline mode
   ```

2. **Add Retry Logic**:
   ```javascript
   async function commitWithRetry(maxAttempts = 3) {
     let attempts = 0;
     let success = false;

     while (!success && attempts < maxAttempts) {
       attempts++;
       const result = window.API.LMSCommit('');
       success = (result === 'true');

       if (!success) {
         const errorCode = window.API.LMSGetLastError();
         console.warn(`Commit attempt ${attempts} failed with error ${errorCode}. Retrying...`);
         // Wait before retrying, with exponential backoff
         await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
       }
     }

     return success;
   }
   ```

3. **Handle Specific Error Codes**:
   ```javascript
   function handleCommitError(errorCode) {
     switch(errorCode) {
       case '101': // General exception
         console.error('General exception during commit. Will retry later.');
         queueForRetry();
         break;
       case '301': // Not initialized
         console.error('API not initialized. Attempting to reinitialize.');
         window.API.LMSInitialize('');
         break;
       // Handle other error codes
       default:
         console.error(`Unknown error during commit: ${errorCode}`);
     }
   }
   ```

### Cross-Domain Issues

**Problem**: API communication fails due to cross-domain restrictions.

**Symptoms**:
- Console errors about cross-origin frame access
- API discovery fails
- Security exceptions in the console

**Solutions**:
1. **Ensure Same-Origin Content**:
   Make sure your content is served from the same domain as the LMS, or that proper CORS headers are set.

2. **Use Proxy if Needed**:
   ```javascript
   const settings = {
     lmsCommitUrl: '/proxy-to-lms', // A server-side proxy on your domain
     xhrHeaders: {
       'X-Original-LMS-URL': 'https://actual-lms.com/endpoint'
     }
   };
   window.API = new Scorm12API(settings);
   ```

3. **Check iFrame Permissions**:
   If your content is in an iFrame, ensure it doesn't have `sandbox` attributes that restrict communication.

## Content Display Issues

### Content Not Displaying Correctly

**Problem**: Content doesn't display properly when launched through the LMS.

**Symptoms**:
- Missing assets (images, videos, etc.)
- Styling issues
- JavaScript errors in the console

**Solutions**:
1. **Use Relative Paths**:
   ```html
   <!-- Good -->
   <img src="./images/logo.png">
   <script src="./scripts/main.js"></script>

   <!-- Avoid -->
   <img src="/images/logo.png">
   <script src="C:/development/project/scripts/main.js"></script>
   ```

2. **Check Content Package Structure**:
   Ensure your SCORM package has the correct structure and all files are included.

3. **Verify MIME Types**:
   Make sure your server is serving files with the correct MIME types.

4. **Test in SCORM Cloud**:
   Use SCORM Cloud to test your content outside of your specific LMS to isolate LMS-specific issues.

### Responsive Design Issues

**Problem**: Content doesn't adapt well to the LMS's frame size.

**Symptoms**:
- Scrollbars appear unnecessarily
- Content is cut off
- Layout breaks at certain sizes

**Solutions**:
1. **Use Responsive Design Techniques**:
   ```css
   /* Use relative units */
   .container {
     width: 100%;
     max-width: 1200px;
     margin: 0 auto;
   }

   /* Use media queries */
   @media (max-width: 768px) {
     .sidebar {
       display: none;
     }
   }
   ```

2. **Adapt to Container Size**:
   ```javascript
   function resizeContent() {
     const container = document.getElementById('scorm-content');
     const parentHeight = window.innerHeight;
     const parentWidth = window.innerWidth;

     container.style.height = `${parentHeight}px`;
     container.style.width = `${parentWidth}px`;
   }

   window.addEventListener('resize', resizeContent);
   resizeContent(); // Call initially
   ```

3. **Communicate with Parent Frame**:
   ```javascript
   // Request more space from the parent frame if needed
   function requestMoreSpace(width, height) {
     if (window.parent && window.parent !== window) {
       window.parent.postMessage({
         type: 'resize-request',
         width: width,
         height: height
       }, '*');
     }
   }
   ```

## Tracking and Reporting Problems

### Completion Status Not Updating

**Problem**: Course completion status is not being properly reported to the LMS.

**Symptoms**:
- LMS shows course as incomplete even after completion
- Progress indicators don't update
- Certificates or next activities don't unlock

**Solutions**:
1. **Verify Correct Status Values**:
   ```javascript
   // SCORM 1.2
   window.API.LMSSetValue('cmi.core.lesson_status', 'completed'); // or 'passed', 'failed', 'incomplete', 'browsed', 'not attempted'

   // SCORM 2004
   window.API_1484_11.SetValue('cmi.completion_status', 'completed'); // 'completed', 'incomplete', 'not attempted', 'unknown'
   window.API_1484_11.SetValue('cmi.success_status', 'passed'); // 'passed', 'failed', 'unknown'
   ```

2. **Check Completion Requirements**:
   Some LMSs require both completion_status and success_status to be set in SCORM 2004:
   ```javascript
   // Set both for maximum compatibility
   window.API_1484_11.SetValue('cmi.completion_status', 'completed');
   window.API_1484_11.SetValue('cmi.success_status', 'passed');
   window.API_1484_11.Commit('');
   ```

3. **Verify Commit Timing**:
   ```javascript
   // Make sure to commit after setting status
   window.API.LMSSetValue('cmi.core.lesson_status', 'completed');
   const result = window.API.LMSCommit('');

   if (result !== 'true') {
     console.error('Failed to commit completion status');
     // Implement retry logic here
   }
   ```

4. **Check LMS Requirements**:
   Some LMSs have specific requirements for marking a course as complete:
   ```javascript
   // Some LMSs require progress_measure to be set
   window.API_1484_11.SetValue('cmi.progress_measure', '1.0');

   // Some require a minimum session time
   window.API_1484_11.SetValue('cmi.session_time', 'PT5M0S'); // 5 minutes
   ```

### Score Reporting Issues

**Problem**: Quiz scores are not being properly reported to the LMS.

**Symptoms**:
- Scores show as 0 or blank in the LMS
- Passing/failing status doesn't match the score
- Different scores shown in content vs. LMS reports

**Solutions**:
1. **Use Correct Score Format**:
   ```javascript
   // SCORM 1.2
   window.API.LMSSetValue('cmi.core.score.raw', '85'); // String value
   window.API.LMSSetValue('cmi.core.score.min', '0');
   window.API.LMSSetValue('cmi.core.score.max', '100');

   // SCORM 2004
   window.API_1484_11.SetValue('cmi.score.scaled', '0.85'); // Between 0 and 1
   window.API_1484_11.SetValue('cmi.score.raw', '85');
   window.API_1484_11.SetValue('cmi.score.min', '0');
   window.API_1484_11.SetValue('cmi.score.max', '100');
   ```

2. **Set Consistent Pass/Fail Status**:
   ```javascript
   // SCORM 1.2
   const score = 85;
   const passingScore = 70;
   window.API.LMSSetValue('cmi.core.score.raw', score.toString());
   window.API.LMSSetValue('cmi.core.lesson_status', score >= passingScore ? 'passed' : 'failed');

   // SCORM 2004
   const score = 85;
   const passingScore = 70;
   window.API_1484_11.SetValue('cmi.score.raw', score.toString());
   window.API_1484_11.SetValue('cmi.success_status', score >= passingScore ? 'passed' : 'failed');
   ```

3. **Use Mastery Score Override**:
   ```javascript
   // Use the mastery_override setting in SCORM Again
   const settings = {
     mastery_override: true
   };
   window.API = new Scorm12API(settings);

   // Set the mastery score and raw score
   window.API.LMSSetValue('cmi.student_data.mastery_score', '70');
   window.API.LMSSetValue('cmi.core.score.raw', '85');
   // The API will automatically set lesson_status to 'passed' or 'failed'
   ```

### Interaction Tracking Problems

**Problem**: Quiz question responses are not being properly tracked.

**Symptoms**:
- Question responses don't appear in LMS reports
- Interaction data is incomplete
- Error messages when setting interaction data

**Solutions**:
1. **Check Interaction Format**:
   ```javascript
   // SCORM 1.2
   window.API.LMSSetValue('cmi.interactions.0.id', 'question1');
   window.API.LMSSetValue('cmi.interactions.0.type', 'choice');
   window.API.LMSSetValue('cmi.interactions.0.student_response', 'a,c');
   window.API.LMSSetValue('cmi.interactions.0.correct_responses.0.pattern', 'a,c');
   window.API.LMSSetValue('cmi.interactions.0.result', 'correct');

   // SCORM 2004
   window.API_1484_11.SetValue('cmi.interactions.0.id', 'question1');
   window.API_1484_11.SetValue('cmi.interactions.0.type', 'choice');
   window.API_1484_11.SetValue('cmi.interactions.0.learner_response', 'a[,]c');
   window.API_1484_11.SetValue('cmi.interactions.0.correct_responses.0.pattern', 'a[,]c');
   window.API_1484_11.SetValue('cmi.interactions.0.result', 'correct');
   ```

2. **Set Interactions in Order**:
   ```javascript
   // Set interaction properties in the correct order
   // First set the ID and type
   window.API.LMSSetValue('cmi.interactions.0.id', 'question1');
   window.API.LMSSetValue('cmi.interactions.0.type', 'choice');

   // Then set responses and results
   window.API.LMSSetValue('cmi.interactions.0.student_response', 'a,c');
   window.API.LMSSetValue('cmi.interactions.0.correct_responses.0.pattern', 'a,c');
   window.API.LMSSetValue('cmi.interactions.0.result', 'correct');
   ```

3. **Verify Interaction Types**:
   ```javascript
   // Make sure to use the correct interaction type
   // SCORM 1.2 and 2004 types: 'true-false', 'choice', 'fill-in', 'matching', 'performance', 'sequencing', 'likert', 'numeric'
   // SCORM 2004 additional types: 'long-fill-in', 'other'

   // And use the correct response format for each type
   // For example, true-false in SCORM 2004:
   window.API_1484_11.SetValue('cmi.interactions.0.type', 'true-false');
   window.API_1484_11.SetValue('cmi.interactions.0.learner_response', 'true'); // Must be 'true' or 'false'
   ```

## Cross-Browser Compatibility

### Internet Explorer Issues

**Problem**: Content doesn't work properly in Internet Explorer.

**Symptoms**:
- JavaScript errors in IE but not in other browsers
- Features work in Chrome/Firefox but not in IE
- API communication fails only in IE

**Solutions**:
1. **Use Polyfills**:
   ```javascript
   // Include polyfills for modern JavaScript features
   // For example, for fetch API:
   if (!window.fetch) {
     // Include a fetch polyfill
     document.write('<script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.min.js"><\/script>');
   }

   // For Promise:
   if (!window.Promise) {
     document.write('<script src="https://cdn.jsdelivr.net/npm/promise-polyfill@8.2.3/dist/polyfill.min.js"><\/script>');
   }
   ```

2. **Avoid Modern Syntax**:
   ```javascript
   // Avoid arrow functions
   // Instead of:
   const handleClick = () => {
     console.log('Clicked');
   };

   // Use:
   function handleClick() {
     console.log('Clicked');
   }

   // Avoid template literals
   // Instead of:
   const message = `Hello, ${name}`;

   // Use:
   var message = 'Hello, ' + name;
   ```

3. **Use Transpilation**:
   Set up Babel to transpile your code to ES5:
   ```javascript
   // In your webpack.config.js or babel.config.js
   module.exports = {
     presets: [
       ['@babel/preset-env', {
         targets: {
           ie: '11'
         }
       }]
     ]
   };
   ```

### Mobile Browser Issues

**Problem**: Content doesn't work properly on mobile devices.

**Symptoms**:
- Touch interactions don't work as expected
- Layout issues on small screens
- Performance problems on mobile devices

**Solutions**:
1. **Use Responsive Design**:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

   ```css
   /* Use media queries for different screen sizes */
   @media (max-width: 768px) {
     .content {
       padding: 10px;
       font-size: 16px;
     }
   }
   ```

2. **Handle Touch Events**:
   ```javascript
   // Add support for both mouse and touch events
   const element = document.getElementById('interactive-element');

   // Mouse events
   element.addEventListener('mousedown', handleInteraction);

   // Touch events
   element.addEventListener('touchstart', function(e) {
     // Prevent default to avoid scrolling in some cases
     e.preventDefault();
     handleInteraction(e.touches[0]);
   });
   ```

3. **Optimize Performance**:
   ```javascript
   // Reduce animations on mobile
   const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

   if (isMobile) {
     // Simplify animations or disable non-essential features
     document.body.classList.add('mobile-optimized');
   }
   ```

## Performance Issues

### Slow Loading Times

**Problem**: Content takes too long to load.

**Symptoms**:
- Long delay before content is usable
- Blank screen for extended periods
- Browser performance warnings

**Solutions**:
1. **Optimize Asset Loading**:
   ```javascript
   // Lazy load non-critical resources
   function lazyLoadImages() {
     const images = document.querySelectorAll('img[data-src]');

     images.forEach(img => {
       if (isInViewport(img)) {
         img.src = img.dataset.src;
         img.removeAttribute('data-src');
       }
     });
   }

   window.addEventListener('scroll', lazyLoadImages);
   window.addEventListener('resize', lazyLoadImages);
   lazyLoadImages(); // Call initially
   ```

2. **Minimize API Calls**:
   ```javascript
   // Batch CMI value updates
   let pendingUpdates = {};

   function setCMIValue(key, value) {
     pendingUpdates[key] = value;

     // Debounce the actual API calls
     clearTimeout(window.updateTimeout);
     window.updateTimeout = setTimeout(flushUpdates, 100);
   }

   function flushUpdates() {
     for (const key in pendingUpdates) {
       window.API.LMSSetValue(key, pendingUpdates[key]);
     }

     window.API.LMSCommit('');
     pendingUpdates = {};
   }
   ```

3. **Reduce Initial Payload**:
   ```javascript
   // Load content progressively
   function loadModule(moduleId) {
     const moduleContainer = document.getElementById('module-container');

     // Show loading indicator
     moduleContainer.innerHTML = '<div class="loading">Loading...</div>';

     // Fetch module content
     fetch(`modules/${moduleId}.html`)
       .then(response => response.text())
       .then(html => {
         moduleContainer.innerHTML = html;
         // Initialize module scripts
         initializeModule(moduleId);
       })
       .catch(error => {
         console.error('Error loading module:', error);
         moduleContainer.innerHTML = '<div class="error">Failed to load content</div>';
       });
   }
   ```

### Memory Leaks

**Problem**: Content consumes increasing amounts of memory over time.

**Symptoms**:
- Browser becomes slower the longer the content is used
- Browser crashes or content freezes after extended use
- Memory usage warnings from browser

**Solutions**:
1. **Clean Up Event Listeners**:
   ```javascript
   // Bad: Event listeners that aren't removed
   function setupPage() {
     const button = document.getElementById('next-button');
     button.addEventListener('click', handleNextClick);
   }

   // Good: Keep references and remove listeners when done
   let nextButtonListener;

   function setupPage() {
     const button = document.getElementById('next-button');
     nextButtonListener = handleNextClick;
     button.addEventListener('click', nextButtonListener);
   }

   function cleanupPage() {
     const button = document.getElementById('next-button');
     if (button && nextButtonListener) {
       button.removeEventListener('click', nextButtonListener);
     }
   }
   ```

2. **Avoid Circular References**:
   ```javascript
   // Bad: Circular reference
   function createObject() {
     const parent = {};
     const child = { parent: parent };
     parent.child = child; // Creates a circular reference
     return parent;
   }

   // Good: Avoid circular references or use WeakMap/WeakSet
   function createObject() {
     const parent = {};
     const child = { parentId: 'parent1' }; // Reference by ID instead
     parent.child = child;
     return parent;
   }
   ```

3. **Dispose of Large Objects**:
   ```javascript
   // Clear large objects when they're no longer needed
   function loadModule(moduleId) {
     // Load large data
     fetch(`data/${moduleId}.json`)
       .then(response => response.json())
       .then(data => {
         // Use the data
         processData(data);

         // When done, explicitly clear references
         window.moduleData = null;
       });
   }
   ```

## Error Code Reference

This section provides a reference for common error codes you might encounter when using SCORM Again with different SCORM versions.

### SCORM 1.2 Error Codes

| Code | Description | Troubleshooting |
|------|-------------|-----------------|
| 0 | No error | Operation completed successfully |
| 101 | General exception | Check for syntax errors or invalid parameters |
| 201 | Invalid argument error | Verify the CMI element name and value format |
| 202 | Element cannot have children | You're trying to set a value on a leaf node |
| 203 | Element not an array - cannot have count | The element doesn't support indexed children |
| 301 | Not initialized | Call LMSInitialize before other API functions |
| 401 | Not implemented error | The function is not supported by this LMS |
| 402 | Invalid set value, element is a keyword | You're trying to set a read-only element |
| 403 | Element is read only | The element cannot be modified |
| 404 | Element is write only | The element cannot be read |
| 405 | Incorrect data type | The value doesn't match the expected data type |

### SCORM 2004 Error Codes

| Code | Description | Troubleshooting |
|------|-------------|-----------------|
| 0 | No error | Operation completed successfully |
| 101 | General exception | Check for syntax errors or invalid parameters |
| 102 | General initialization failure | Check if the API is available and properly initialized |
| 103 | Already initialized | The API has already been initialized |
| 104 | Content instance terminated | The API has been terminated |
| 111 | General termination failure | Error during termination process |
| 112 | Termination before initialization | Cannot terminate before initializing |
| 113 | Termination after termination | API already terminated |
| 122 | Retrieve data before initialization | Cannot get values before initializing |
| 123 | Retrieve data after termination | Cannot get values after terminating |
| 132 | Store data before initialization | Cannot set values before initializing |
| 133 | Store data after termination | Cannot set values after terminating |
| 142 | Commit before initialization | Cannot commit before initializing |
| 143 | Commit after termination | Cannot commit after terminating |
| 201 | General argument error | Invalid argument passed to API function |
| 301 | General get failure | Error retrieving the requested data |
| 351 | General set failure | Error setting the requested data |
| 391 | General commit failure | Error committing data to the LMS |
| 401 | Undefined data model element | The requested data model element doesn't exist |
| 402 | Unimplemented data model element | The element exists but isn't implemented |
| 403 | Data model element value not initialized | The element exists but has no value |
| 404 | Data model element is read only | Cannot set a value for a read-only element |
| 405 | Data model element is write only | Cannot get a value for a write-only element |
| 406 | Data model element type mismatch | The value doesn't match the expected data type |
| 407 | Data model element value out of range | The value is outside the allowed range |
| 408 | Data model dependency not established | A prerequisite element hasn't been set |

### Handling Error Codes

When you encounter an error code, you can use the following pattern to handle it:

```javascript
function handleAPIError(functionName, errorCode) {
  let errorString, diagnostic;

  if (window.API_1484_11) {
    // SCORM 2004
    errorString = window.API_1484_11.GetErrorString(errorCode);
    diagnostic = window.API_1484_11.GetDiagnostic(errorCode);
  } else if (window.API) {
    // SCORM 1.2
    errorString = window.API.LMSGetErrorString(errorCode);
    diagnostic = window.API.LMSGetDiagnostic(errorCode);
  }

  console.error(`Error in ${functionName}: ${errorCode} - ${errorString}`);
  console.debug(`Diagnostic: ${diagnostic}`);

  // Handle specific error codes
  switch(errorCode) {
    case '301': // Not initialized
      console.warn('API not initialized. Attempting to initialize...');
      initializeAPI();
      break;
    case '101': // General exception
      console.warn('General exception. Retrying operation...');
      // Implement retry logic
      break;
    // Add more specific error handling as needed
  }
}

// Example usage
const result = window.API.LMSSetValue('cmi.core.lesson_status', 'completed');
if (result !== 'true') {
  const errorCode = window.API.LMSGetLastError();
  handleAPIError('LMSSetValue', errorCode);
}
```

By understanding these error codes and implementing proper error handling, you can create more robust SCORM content that gracefully handles issues and provides better feedback to both users and developers.
