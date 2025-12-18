# Using scorm-again with React Native for Offline Learning

> **Note:** A complete working example is available at `examples/react-native-offline/` in the scorm-again repository.

This guide demonstrates how to implement SCORM content in a React Native application with offline
support using scorm-again.

## Prerequisites

- React Native development environment set up
- Basic knowledge of React Native
- Understanding of SCORM packages

## Setup

### 1. Install Dependencies

First, install the necessary dependencies:

```bash
# Install core dependencies
npm install --save react-native-webview react-native-fs react-native-device-info react-native-zip-archive

# For handling network connectivity
npm install --save @react-native-community/netinfo

# For external storage access
npm install --save react-native-permissions react-native-blob-util
```

### 2. Project Structure

Create a directory structure for storing SCORM content:

```
/assets
  /scorm-again
    /api
      scorm-again.js (Copy the scorm-again.js here)
  /courses
    /course1
      (Unzipped SCORM content or course zip file)
```

### 3. Loading From External Storage (Recommended)

For production applications, it's recommended to load SCORM modules from external/shared storage
rather than bundling them with your app. This approach offers several advantages:

- Allows for larger course content beyond app size limitations
- Enables sharing courses between applications
- Makes content management more flexible for users
- Preserves content during app updates or reinstallation

#### Configure Required Permissions

First, set up the necessary permissions:

**Android**: Add to `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest ...>
    <!-- For all Android versions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <!-- For Android 10 (API 29) and below -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <!-- For Android 11+ specific directories -->
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE"
                     tools:ignore="ScopedStorage" />

    <application
        android:requestLegacyExternalStorage="true"
        ...>
        ...
    </application>
</manifest>
```

**iOS**: Add to `ios/YourAppName/Info.plist`:

```xml
<key>NSDocumentsFolderUsageDescription</key>
<string>Access to documents is required to store and load SCORM courses</string>
<key>NSDownloadsFolderUsageDescription</key>
<string>Access to downloads is required to import SCORM courses</string>
```

#### Implement External Storage Service

Create a utility service for managing SCORM content in external storage:

```jsx
// src/services/ExternalStorageService.js
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { unzip } from 'react-native-zip-archive';
import RNBlobUtil from 'react-native-blob-util';

class ExternalStorageService {
  constructor() {
    this.baseStoragePath = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return true;

    try {
      // Request permissions first
      await this.requestStoragePermission();

      // Set up base directory path based on platform
      if (Platform.OS === 'android') {
        // Use Download directory on Android
        // Note: On Android 10+ (API 29+), use app-specific directory for better compatibility
        // RNFS.ExternalStorageDirectoryPath may not be accessible on newer Android versions
        this.baseStoragePath = `${RNFS.DownloadDirectoryPath}/ScormContent`;
      } else if (Platform.OS === 'ios') {
        // Use Documents directory on iOS
        this.baseStoragePath = `${RNFS.DocumentDirectoryPath}/ScormContent`;
      } else {
        throw new Error('Unsupported platform');
      }

      // Create base directory if it doesn't exist
      const exists = await RNFS.exists(this.baseStoragePath);
      if (!exists) {
        await RNFS.mkdir(this.baseStoragePath);
      }

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize external storage:', error);
      return false;
    }
  }

  async requestStoragePermission() {
    if (Platform.OS === 'android') {
      const apiLevel = parseInt(Platform.Version, 10);

      if (apiLevel >= 30) { // Android 11+
        // For Android 11+, we need to request MANAGE_EXTERNAL_STORAGE
        // Note: This requires special handling - the user needs to
        // go to a system settings page to grant this permission
        const result = await check(PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE);
        if (result !== RESULTS.GRANTED) {
          // Ideally, guide user to system settings here
          throw new Error('Storage permission required for Android 11+');
        }
      } else {
        // For Android 10 and below, request READ/WRITE_EXTERNAL_STORAGE
        const readResult = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        const writeResult = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);

        if (readResult !== RESULTS.GRANTED || writeResult !== RESULTS.GRANTED) {
          throw new Error('Storage permissions required');
        }
      }
    } else if (Platform.OS === 'ios') {
      // iOS doesn't need explicit permissions for app Documents directory
      return true;
    }

    return true;
  }

  async getCourseDirectory(courseId) {
    await this.initialize();

    const courseDir = `${this.baseStoragePath}/${courseId}`;
    const exists = await RNFS.exists(courseDir);

    if (!exists) {
      await RNFS.mkdir(courseDir);
    }

    return courseDir;
  }

  async extractCourse(zipFilePath, courseId) {
    try {
      const courseDir = await this.getCourseDirectory(courseId);

      // Extract the course zip file
      await unzip(zipFilePath, courseDir);

      // Verify that the extracted content is valid
      const indexPath = `${courseDir}/index.html`;
      const indexExists = await RNFS.exists(indexPath);

      if (!indexExists) {
        throw new Error('Invalid SCORM package: No index.html found');
      }

      return courseDir;
    } catch (error) {
      console.error('Failed to extract course:', error);
      throw error;
    }
  }

  async downloadAndExtractCourse(courseId, downloadUrl) {
    try {
      await this.initialize();

      // Create a temporary download path
      const tempZipPath = `${RNFS.CachesDirectoryPath}/${courseId}.zip`;

      // Download the file
      const response = await RNBlobUtil.config({
        fileCache: true,
        path: tempZipPath,
      }).fetch('GET', downloadUrl);

      // Extract the course
      const courseDir = await this.extractCourse(tempZipPath, courseId);

      // Clean up the zip file
      await RNFS.unlink(tempZipPath);

      return courseDir;
    } catch (error) {
      console.error('Failed to download and extract course:', error);
      throw error;
    }
  }

  async listAvailableCourses() {
    try {
      await this.initialize();

      const courses = [];
      const items = await RNFS.readDir(this.baseStoragePath);

      for (const item of items) {
        if (item.isDirectory()) {
          // Check if it contains an index.html file
          const indexPath = `${item.path}/index.html`;
          const indexExists = await RNFS.exists(indexPath);

          if (indexExists) {
            courses.push({
              id: item.name,
              path: item.path,
              url: `file://${item.path}/index.html`,
            });
          }
        }
      }

      return courses;
    } catch (error) {
      console.error('Failed to list courses:', error);
      return [];
    }
  }

  getCourseUrl(coursePath) {
    return `file://${coursePath}/index.html`;
  }

  async deleteCourse(courseId) {
    try {
      const courseDir = await this.getCourseDirectory(courseId);
      await RNFS.unlink(courseDir);
      return true;
    } catch (error) {
      console.error('Failed to delete course:', error);
      return false;
    }
  }
}

export default new ExternalStorageService();
```

#### Modify the SCORM Player to Use External Storage

Update your SCORM player component to load content from external storage:

```jsx
// src/screens/ScormPlayerScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ExternalStorageService from '../services/ExternalStorageService';

const ScormPlayerScreen = ({ route }) => {
  const { courseId } = route.params || { courseId: 'course1' };
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [courseUrl, setCourseUrl] = useState(null);
  const [apiPath, setApiPath] = useState(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    // Setup network connectivity listener
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);

      // If we just came back online, try to sync data
      if (state.isConnected && webViewRef.current) {
        syncOfflineData();
      }
    });

    // Prepare the necessary files and paths
    prepareScormContent();

    // Cleanup network listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const prepareScormContent = async () => {
    try {
      // Step 1: Copy scorm-again.js API to app documents directory if needed
      const documentsDir = RNFS.DocumentDirectoryPath;
      const apiDir = `${documentsDir}/scorm-again/api`;

      const apiDirExists = await RNFS.exists(apiDir);
      if (!apiDirExists) {
        await RNFS.mkdir(apiDir, { NSURLIsExcludedFromBackupKey: true });
      }

      const apiJsPath = `${apiDir}/scorm-again.js`;
      const apiJsExists = await RNFS.exists(apiJsPath);

      if (!apiJsExists) {
        // Copy the API from the app bundle
        // Note: You'll need to use platform-specific code or copy from assets manually
        // For Android: await RNFS.copyFileAssets('scorm-again/api/scorm-again.js', apiJsPath);
        // For iOS: The file should be in the app bundle and can be accessed directly
        const assetPath = Platform.OS === 'android'
          ? 'scorm-again/api/scorm-again.js'
          : `${RNFS.MainBundlePath}/scorm-again/api/scorm-again.js`;

        if (Platform.OS === 'android') {
          await RNFS.copyFileAssets(assetPath, apiJsPath);
        } else {
          await RNFS.copyFile(assetPath, apiJsPath);
        }
      }

      setApiPath(`file://${apiJsPath}`);

      // Step 2: Initialize external storage and get course path
      await ExternalStorageService.initialize();

      // Get the course directory (will create if it doesn't exist)
      const courseDir = await ExternalStorageService.getCourseDirectory(courseId);

      // Check if the course exists (has an index.html file)
      const indexPath = `${courseDir}/index.html`;
      const indexExists = await RNFS.exists(indexPath);

      if (!indexExists) {
        // Course doesn't exist in external storage yet
        // In a real app, you might want to download it or extract from assets

        // For this example, we'll copy from app assets
        await copyExampleCourseFromAssets(courseDir);
      }

      // Get the URL for loading in the WebView
      const url = ExternalStorageService.getCourseUrl(courseDir);
      setCourseUrl(url);
      setIsLoading(false);
    } catch (error) {
      console.error('Error preparing SCORM content:', error);
      setErrorMessage(`Failed to prepare course: ${error.message}`);
      setIsLoading(false);
    }
  };

  const copyExampleCourseFromAssets = async (targetDir) => {
    try {
      // This is a simplified example - in a real app this would be more robust
      // Note: readDirAssets and copyFileAssets are Android-only
      // For a cross-platform solution, use react-native-fs differently or bundle courses in the app
      if (Platform.OS === 'android') {
        // Get a list of all course files from assets
        const courseFiles = await RNFS.readDirAssets(`courses/${courseId}`);

        // Copy each file to the external storage
        for (const file of courseFiles) {
          const relativePath = file.path.split(`courses/${courseId}/`)[1];
          const targetPath = `${targetDir}/${relativePath}`;

          // Create parent directories if needed
          const targetParentDir = targetPath.substring(0, targetPath.lastIndexOf('/'));
          await RNFS.mkdir(targetParentDir);

          // Copy the file
          await RNFS.copyFileAssets(file.path, targetPath);
        }
      } else {
        // For iOS, you would need to bundle the course differently
        // or download it from a remote source
        throw new Error('Course copying from assets is not implemented for iOS in this example');
      }
    } catch (error) {
      console.error('Error copying example course:', error);
      throw error;
    }
  };

  const injectScormAgain = () => {
    if (!webViewRef.current) return;

    const jsCode = `
      var scormAgainScript = document.createElement('script');
      scormAgainScript.src = '${apiPath}';
      scormAgainScript.onload = function() {
        // Initialize scorm-again with offline support
        window.API = new window.ScormAgain.SCORM2004API({
          enableOfflineSupport: true,
          courseId: '${courseId}',
          autocommit: true,
          autocommitSeconds: 60,
          syncOnInitialize: true,
          syncOnTerminate: true,
          logLevel: 4,
          onLogMessage: function(message, level) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'log',
              message: message,
              level: level
            }));
          }
        });

        // Notify when offline data is synced
        window.API.on('OfflineDataSynced', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'sync',
            status: 'success'
          }));
        });

        // Override the isDeviceOnline method to use our React state
        // TODO: This will be replaced with the new event API pattern in a future update
        window.API._offlineStorageService.isDeviceOnline = function() {
          return ${isOnline};
        };
      };
      document.head.appendChild(scormAgainScript);
      true;
    `;

    webViewRef.current.injectJavaScript(jsCode);
  };

  const syncOfflineData = () => {
    if (!isOnline || !webViewRef.current) return;

    const jsCode = `
      if (window.API && window.API._offlineStorageService) {
        window.API._offlineStorageService.syncOfflineData().then(function(success) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'sync',
            status: success ? 'success' : 'failed'
          }));
        });
      }
      true;
    `;

    webViewRef.current.injectJavaScript(jsCode);
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'log') {
        console.log('SCORM Log:', data.message);
      } else if (data.type === 'sync') {
        if (data.status === 'success') {
          Alert.alert('Sync Complete', 'SCORM data synchronized successfully');
        } else {
          Alert.alert('Sync Failed', 'Failed to synchronize some SCORM data');
        }
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading SCORM content...</Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="error" size={64} color="#d32f2f" />
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SCORM Course Player</Text>
        <View style={styles.headerActions}>
          <Icon
            name={isOnline ? 'wifi' : 'wifi-off'}
            size={24}
            color="#fff"
            style={styles.headerIcon}
          />
          <TouchableOpacity
            onPress={syncOfflineData}
            disabled={!isOnline}
            style={[styles.syncButton, !isOnline && styles.syncButtonDisabled]}
          >
            <Icon name="sync" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: courseUrl }}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowUniversalAccessFromFileURLs={true}
        onLoad={() => injectScormAgain()}
        onMessage={handleWebViewMessage}
        renderLoading={() => (
          <View style={styles.webViewLoading}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      />
    </View>
  );
};

// Styles remain the same
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
  },
  syncButton: {
    padding: 8,
  },
  syncButtonDisabled: {
    opacity: 0.5,
  },
  webView: {
    flex: 1,
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#d32f2f',
  },
});

export default ScormPlayerScreen;
```

#### Create a Course Library Screen

Implement a screen to browse and manage locally stored SCORM courses:

```jsx
// src/screens/CourseLibraryScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ExternalStorageService from '../services/ExternalStorageService';
import NetInfo from '@react-native-community/netinfo';

const CourseLibraryScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check network connectivity
    NetInfo.fetch().then(state => {
      setIsOnline(state.isConnected);
    });

    // Subscribe to network changes
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);
    });

    // Load available courses
    loadCourses();

    return () => {
      unsubscribe();
    };
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);

      // Initialize external storage
      await ExternalStorageService.initialize();

      // Get list of available courses
      const availableCourses = await ExternalStorageService.listAvailableCourses();
      setCourses(availableCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      Alert.alert('Error', 'Failed to load courses: ' + error.message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCourses();
  };

  const handleDownloadCourse = async () => {
    // In a real app, this would open a modal or screen to select a course to download
    Alert.alert(
      'Download Course',
      'Enter course details',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            // Example download URL and course ID
            downloadExampleCourse('example-course', 'https://example.com/courses/example-course.zip');
          },
        },
      ]
    );
  };

  const downloadExampleCourse = async (courseId, url) => {
    try {
      setIsLoading(true);

      // Show download progress (in a real app, use a progress indicator)
      Alert.alert('Downloading', 'Downloading course package...');

      // Download and extract the course
      await ExternalStorageService.downloadAndExtractCourse(courseId, url);

      // Refresh the course list
      await loadCourses();

      Alert.alert('Success', 'Course downloaded successfully!');
    } catch (error) {
      console.error('Error downloading course:', error);
      Alert.alert('Error', 'Failed to download course: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = (courseId) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await ExternalStorageService.deleteCourse(courseId);
              await loadCourses();
              Alert.alert('Success', 'Course deleted successfully!');
            } catch (error) {
              console.error('Error deleting course:', error);
              Alert.alert('Error', 'Failed to delete course: ' + error.message);
            }
          },
        },
      ]
    );
  };

  const renderCourseItem = ({ item }) => (
    <View style={styles.courseItem}>
      <TouchableOpacity
        style={styles.courseContent}
        onPress={() => navigation.navigate('ScormPlayer', { courseId: item.id })}
      >
        <Icon name="school" size={36} color="#2196F3" style={styles.courseIcon} />
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{item.id}</Text>
          <Text style={styles.coursePath}>{item.path}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteCourse(item.id)}
      >
        <Icon name="delete" size={24} color="#d32f2f" />
      </TouchableOpacity>
    </View>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Loading courses...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={courses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.coursesList}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="folder-open" size={64} color="#9e9e9e" />
            <Text style={styles.emptyText}>No SCORM courses found</Text>
            <Text style={styles.emptySubtext}>
              Tap the download button to add a course
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, !isOnline && styles.fabDisabled]}
        onPress={handleDownloadCourse}
        disabled={!isOnline}
      >
        <Icon name="cloud-download" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#757575',
  },
  coursesList: {
    padding: 16,
    paddingBottom: 80, // Space for FAB
  },
  courseItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  courseContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  courseIcon: {
    marginRight: 16,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  coursePath: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#757575',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9e9e9e',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabDisabled: {
    backgroundColor: '#9e9e9e',
  },
});

export default CourseLibraryScreen;
```

#### Benefits of External Storage

Using external storage for SCORM content provides several advantages:

1. **Flexible Storage Management**
   - Users can manage their storage space more effectively
   - Courses can be much larger than what would fit in app-specific storage
   - Content persists even if the app is uninstalled or updated

2. **Cross-App Compatibility**
   - Content can potentially be shared between different learning apps
   - Easier integration with device file managers and other tools

3. **User Control**
   - Users can manually add/remove content as needed
   - Simplifies backup and transfer of learning materials

4. **Reduced App Size**
   - Keeps your app's installed size smaller
   - Avoids storage issues related to app size limits

#### Important Considerations

When implementing external storage for SCORM content, keep these points in mind:

1. **Android Storage Access Framework**
   - For Android 11+ (API 30+), consider using the Storage Access Framework
   - `MANAGE_EXTERNAL_STORAGE` permission requires special justification in Play Store listings

2. **Content Validation**
   - Always validate SCORM packages before loading
   - Implement integrity checks to detect corrupted content

3. **Security**
   - Consider encrypting sensitive content when storing externally
   - Implement proper package signing and verification

4. **User Experience**
   - Provide clear UI for managing downloaded content
   - Implement proper error handling and retry mechanisms for downloads

## Implementation

### 1. Create the SCORM Player Component

Here's a complete implementation example:

```jsx
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import { unzip } from 'react-native-zip-archive';
import Icon from 'react-native-vector-icons/MaterialIcons';

const COURSE_ID = 'course1';

const ScormPlayerScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [coursePath, setCoursePath] = useState('');
  const [apiPath, setApiPath] = useState('');
  const webViewRef = useRef(null);

  useEffect(() => {
    // Setup network connectivity listener
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected);

      // If we just came back online, try to sync data
      if (state.isConnected && webViewRef.current) {
        syncOfflineData();
      }
    });

    // Prepare the necessary files and paths
    prepareLocalFiles();

    // Cleanup network listener on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  const prepareLocalFiles = async () => {
    try {
      const documentsDir = RNFS.DocumentDirectoryPath;

      // Create and copy API files
      const apiDir = `${documentsDir}/scorm-again/api`;
      const apiExists = await RNFS.exists(apiDir);

      if (!apiExists) {
        await RNFS.mkdir(apiDir, { NSURLIsExcludedFromBackupKey: true });

        // Copy scorm-again API from assets to documents directory
        // Note: Platform-specific implementation needed
        if (Platform.OS === 'android') {
          await RNFS.copyFileAssets(
            'scorm-again/api/scorm-again.js',
            `${apiDir}/scorm-again.js`
          );
        } else {
          // For iOS, copy from app bundle
          await RNFS.copyFile(
            `${RNFS.MainBundlePath}/scorm-again/api/scorm-again.js`,
            `${apiDir}/scorm-again.js`
          );
        }
      }

      setApiPath(`file://${apiDir}`);

      // Setup course directory
      const courseDir = `${documentsDir}/courses/${COURSE_ID}`;
      const courseExists = await RNFS.exists(courseDir);

      if (!courseExists) {
        await RNFS.mkdir(courseDir, { NSURLIsExcludedFromBackupKey: true });

        // Check if we need to extract a zip file
        const zipExists = await RNFS.exists(`${RNFS.MainBundlePath}/courses/${COURSE_ID}.zip`);

        if (zipExists) {
          // Extract the course zip file to the course directory
          await unzip(
            `${RNFS.MainBundlePath}/courses/${COURSE_ID}.zip`,
            courseDir
          );
        } else {
          // Copy unzipped course files instead
          // This is a simplified example - in a real app you'd need to copy all course files
          // Note: Platform-specific implementation needed
          if (Platform.OS === 'android') {
            await RNFS.copyFileAssets(
              `courses/${COURSE_ID}/index.html`,
              `${courseDir}/index.html`
            );
            // Copy other course files as needed
          } else {
            // For iOS, use different approach or download course package
            throw new Error('Course copying from assets not implemented for iOS in this example');
          }
        }
      }

      setCoursePath(`file://${courseDir}`);
      setIsLoading(false);
    } catch (error) {
      console.error('Error preparing local files:', error);
      Alert.alert('Error', 'Failed to prepare course files');
    }
  };

  const injectScormAgain = () => {
    const jsCode = `
      var scormAgainScript = document.createElement('script');
      scormAgainScript.src = '${apiPath}/scorm-again.js';
      scormAgainScript.onload = function() {
        // Initialize scorm-again with offline support
        window.API = new window.ScormAgain.SCORM2004API({
          enableOfflineSupport: true,
          courseId: '${COURSE_ID}',
          autocommit: true,
          autocommitSeconds: 60,
          syncOnInitialize: true,
          syncOnTerminate: true,
          logLevel: 4,
          onLogMessage: function(message, level) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'log',
              message: message,
              level: level
            }));
          }
        });

        // Notify when offline data is synced
        window.API.on('OfflineDataSynced', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'sync',
            status: 'success'
          }));
        });

        // Override the isDeviceOnline method to use our React state
        // TODO: This will be replaced with the new event API pattern in a future update
        window.API._offlineStorageService.isDeviceOnline = function() {
          return ${isOnline};
        };
      };
      document.head.appendChild(scormAgainScript);
      true;
    `;

    webViewRef.current?.injectJavaScript(jsCode);
  };

  const syncOfflineData = () => {
    if (isOnline && webViewRef.current) {
      const jsCode = `
        if (window.API && window.API._offlineStorageService) {
          window.API._offlineStorageService.syncOfflineData().then(function(success) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'sync',
              status: success ? 'success' : 'failed'
            }));
          });
        }
        true;
      `;
      webViewRef.current.injectJavaScript(jsCode);
    }
  };

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === 'log') {
        console.log('SCORM Log:', data.message);
      } else if (data.type === 'sync') {
        if (data.status === 'success') {
          Alert.alert('Sync Complete', 'SCORM data synchronized successfully');
        } else {
          Alert.alert('Sync Failed', 'Failed to synchronize some SCORM data');
        }
      }
    } catch (error) {
      console.error('Error handling WebView message:', error);
    }
  };

  const handleWebViewLoad = () => {
    injectScormAgain();
  };

  if (isLoading || !coursePath) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading SCORM content...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SCORM Course Player</Text>
        <View style={styles.headerActions}>
          <Icon
            name={isOnline ? 'wifi' : 'wifi-off'}
            size={24}
            color="#fff"
            style={styles.headerIcon}
          />
          <TouchableOpacity
            onPress={syncOfflineData}
            disabled={!isOnline}
            style={[styles.syncButton, !isOnline && styles.syncButtonDisabled]}
          >
            <Icon name="sync" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <WebView
        ref={webViewRef}
        source={{ uri: `${coursePath}/index.html` }}
        style={styles.webView}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onLoad={handleWebViewLoad}
        onMessage={handleWebViewMessage}
        renderLoading={() => (
          <View style={styles.webViewLoading}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 16,
  },
  syncButton: {
    padding: 8,
  },
  syncButtonDisabled: {
    opacity: 0.5,
  },
  webView: {
    flex: 1,
  },
  webViewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ScormPlayerScreen;
```

### 2. Usage in Your App

Include the SCORM player in your app's navigation:

```jsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ScormPlayerScreen from './src/screens/ScormPlayerScreen';
import HomeScreen from './src/screens/HomeScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Course Library' }}
        />
        <Stack.Screen
          name="ScormPlayer"
          component={ScormPlayerScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 3. Add Permission for Android

Add the following to your `AndroidManifest.xml` to ensure file access:

```xml
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <!-- ... rest of manifest ... -->
</manifest>
```

### 4. Configure iOS Permissions

Update your `Info.plist` file to allow loading local files:

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSAllowsLocalNetworking</key>
    <true/>
</dict>
```

## Key Features of This Implementation

### 1. Local HTTP Server (Recommended)

For best compatibility with SCORM packages, serve content through a local HTTP server rather than using `file://` URLs directly. This avoids CORS issues and ensures all JavaScript APIs work correctly.

```bash
npm install @dr.pogodin/react-native-static-server
```

See `examples/react-native-offline` for a complete implementation, or the [Troubleshooting Guide](troubleshooting.md#3b-local-web-server-for-scorm-content-recommended) for details.

### 2. Offline Support

- Detects device connectivity status and updates the scorm-again API accordingly
- Automatically syncs data when the device comes online
- Provides visual feedback on connectivity status

### 3. Local File Management

- Uses `react-native-fs` to manage file operations
- Extracts SCORM course content from zip files if needed
- Loads content from local filesystem instead of remote URLs

### 4. scorm-again Configuration

The scorm-again API is initialized with these key settings:

```javascript
{
  enableOfflineSupport: true,  // Enable offline capabilities
  courseId: 'course1',         // Unique identifier for the course
  autocommit: true,            // Automatically commit data
  syncOnInitialize: true,      // Try to sync when the API initializes
  syncOnTerminate: true,       // Try to sync when the API terminates
}
```

### 5. WebView Communication

- Uses `postMessage` to send data from the WebView to React Native
- Injects JavaScript to initialize scorm-again and handle messages
- Provides feedback via alerts when data is synchronized

## Advanced Topics

### 1. Managing Multiple Courses

For applications with multiple courses, consider implementing a course selection screen and managing
multiple course directories:

```jsx
// Example Course Selection Component
const CourseLibraryScreen = ({ navigation }) => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    // Load available courses
    loadAvailableCourses();
  }, []);

  const loadAvailableCourses = async () => {
    // Read courses from directory or API
    const availableCourses = [
      { id: 'course1', title: 'Introduction to SCORM', description: 'Learn the basics of SCORM' },
      { id: 'course2', title: 'Advanced Training', description: 'In-depth training module' },
    ];

    setCourses(availableCourses);
  };

  return (
    <FlatList
      data={courses}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.courseItem}
          onPress={() => navigation.navigate('ScormPlayer', { courseId: item.id })}
        >
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseDescription}>{item.description}</Text>
        </TouchableOpacity>
      )}
    />
  );
};
```

### 2. Downloading Courses

For downloading courses from a remote server:

```jsx
const downloadCourse = async (courseId, courseUrl) => {
  const documentsDir = RNFS.DocumentDirectoryPath;
  const courseZipPath = `${documentsDir}/downloads/${courseId}.zip`;
  const courseDir = `${documentsDir}/courses/${courseId}`;

  try {
    // Create directories if needed
    await RNFS.mkdir(`${documentsDir}/downloads`, { NSURLIsExcludedFromBackupKey: true });

    // Download the zip file
    const downloadResult = await RNFS.downloadFile({
      fromUrl: courseUrl,
      toFile: courseZipPath,
      progress: (res) => {
        const progress = (res.bytesWritten / res.contentLength) * 100;
        console.log(`Download progress: ${progress.toFixed(2)}%`);
      },
    }).promise;

    if (downloadResult.statusCode === 200) {
      // Create course directory
      await RNFS.mkdir(courseDir, { NSURLIsExcludedFromBackupKey: true });

      // Extract the zip file
      await unzip(courseZipPath, courseDir);

      // Remove the zip file to save space
      await RNFS.unlink(courseZipPath);

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error downloading course:', error);
    return false;
  }
};
```

## Performance Considerations

For optimal performance in React Native WebView:

1. **Memory Management**
   - Unload WebView content when not in use to free memory
   - Consider implementing a lightweight course viewer for course previews

2. **File Optimization**
   - Remove unnecessary files from SCORM packages before deployment
   - Consider lazy-loading large media files in the SCORM content

3. **WebView Configuration**
   - Use appropriate WebView settings for your content needs
   - Consider using `cacheEnabled={true}` for better performance

```jsx
// Example of optimized WebView settings
<WebView
  ref={webViewRef}
  source={{ uri: `${coursePath}/index.html` }}
  javaScriptEnabled={true}
  domStorageEnabled={true}
  cacheEnabled={true}
  thirdPartyCookiesEnabled={false}
  sharedCookiesEnabled={false}
  mediaPlaybackRequiresUserAction={true}
  androidLayerType="hardware"
  onLoad={handleWebViewLoad}
  onMessage={handleWebViewMessage}
/>
```

## Security Considerations

### 1. Content Validation

Always validate SCORM packages before loading them:

```jsx
const validateScormPackage = async (courseDir) => {
  // Check for required files
  const hasIndexFile = await RNFS.exists(`${courseDir}/index.html`);
  const hasImsManifest = await RNFS.exists(`${courseDir}/imsmanifest.xml`);

  if (!hasIndexFile || !hasImsManifest) {
    throw new Error('Invalid SCORM package: Missing required files');
  }

  // Additional validation can be performed here
  // e.g., content security checks, manifest validation, etc.

  return true;
};
```

### 2. Data Protection

For sensitive SCORM data, consider implementing encryption:

```jsx
// Using react-native-encrypted-storage for sensitive data
import EncryptedStorage from 'react-native-encrypted-storage';

// Storing encrypted SCORM data
const secureStorageScormData = async (courseId, data) => {
  try {
    await EncryptedStorage.setItem(
      `scorm_data_${courseId}`,
      JSON.stringify(data)
    );
  } catch (error) {
    console.error('Error storing encrypted data:', error);
  }
};

// Retrieving encrypted SCORM data
const retrieveSecureScormData = async (courseId) => {
  try {
    const data = await EncryptedStorage.getItem(`scorm_data_${courseId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving encrypted data:', error);
    return null;
  }
};
```

## Troubleshooting

### Common Issues

1. **WebView not loading local files**
   - Ensure file paths are correct (use `file://` protocol)
   - Check that you have proper permissions in your app manifests
   - Verify the files exist in the correct location

2. **JavaScript communication issues**
   - Make sure `javaScriptEnabled` is set to `true`
   - Check that `postMessage` and message handlers are properly implemented
   - Look for console errors in your development environment

3. **SCORM API not connecting**
   - Verify that scorm-again.js is properly loaded
   - Check the WebView console for JavaScript errors
   - Ensure your HTML content is correctly structured to work with SCORM

4. **File access problems**
   - Verify that the app has proper permissions
   - Check that directories are created with proper error handling
   - Ensure file paths are correctly formatted for the platform

### Critical: SCORM API Not Found ("Unable to find an API adapter")

Many SCORM courses use a standard API discovery algorithm that searches `window.parent` for the API. In a WebView, `window.parent === window`, which causes the search to fail. Additionally, many courses declare `var API = null;` at global scope, overwriting any API you've set.

**Solution**: Use `injectedJavaScriptBeforeContentLoaded` to set up APIs and override `window.parent`:

```jsx
<WebView
  injectedJavaScriptBeforeContentLoaded={`
    // Initialize both SCORM APIs
    var apiSettings = { autocommit: true, logLevel: 4 };

    // SCORM 2004
    window.API_1484_11 = new window.Scorm2004API(apiSettings);

    // SCORM 1.2 with getter protection (prevents 'var API = null' overwrite)
    var scorm12Instance = new window.Scorm12API(apiSettings);
    window._scorm12APIInstance = scorm12Instance;
    Object.defineProperty(window, 'API', {
      get: function() { return window._scorm12APIInstance; },
      set: function(val) { /* ignore */ },
      configurable: false
    });

    // Override window.parent for API discovery
    Object.defineProperty(window, 'parent', {
      get: function() {
        return {
          API_1484_11: window.API_1484_11,
          API: window._scorm12APIInstance,
          parent: null
        };
      },
      configurable: true
    });
    true;
  `}
  // ... other props
/>
```

**Important**: Use the full `scorm-again.min.js` bundle (not `scorm2004.min.js`) to support both SCORM 1.2 and SCORM 2004 courses.

See [Troubleshooting Guide](troubleshooting.md#3a-scorm-api-not-found-in-webview-critical) for detailed explanation.

### Alerts Not Displaying

WebView dialogs may not show. Forward them to native:

```javascript
window.alert = function(msg) {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    type: 'alert', message: String(msg)
  }));
};
```

Handle in your `onMessage` callback with React Native's `Alert.alert()`.

## Conclusion

This React Native implementation provides a robust foundation for integrating SCORM content with
offline support in your mobile applications. By leveraging scorm-again's offline capabilities and
React Native's WebView and file management features, you can deliver effective mobile learning
experiences even in disconnected environments.
