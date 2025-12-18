import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as FileSystem from 'expo-file-system';
import { SyncIndicator } from '@/src/components/SyncIndicator';
import { useThemeColor } from '@/components/Themed';
import courseStorage from '@/src/services/CourseStorage';
import staticServer from '@/src/services/StaticServerService';

interface MessagePayload {
  type: string;
  status?: string;
  level?: string;
  message?: string;
  title?: string;
}

export default function PlayerScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const webViewRef = useRef<WebView>(null);

  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [courseTitle, setCourseTitle] = useState('SCORM Course');
  const [courseUrl, setCourseUrl] = useState<string | null>(null);
  const [scormAgainScript, setScormAgainScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // Allow all orientations for player (app default is portrait only)
  useEffect(() => {
    async function unlockOrientation() {
      await ScreenOrientation.unlockAsync();
    }
    unlockOrientation();

    // Lock back to portrait when leaving
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected ?? false;
      setIsOnline(online);

      // Dispatch network status event to WebView
      if (webViewRef.current) {
        const script = `
          window.dispatchEvent(new CustomEvent('scorm-again:network-status', {
            detail: { online: ${online} }
          }));
          true;
        `;
        webViewRef.current.injectJavaScript(script);
      }
    });

    return () => unsubscribe();
  }, []);

  // Initialize static server and set up course
  useEffect(() => {
    async function setupCourse() {
      if (!courseId) {
        setError('No course ID provided');
        setIsLoading(false);
        return;
      }

      try {
        // Initialize storage (extracts built-in course and scorm-again if needed)
        await courseStorage.initialize();

        // Check if course exists
        const exists = await courseStorage.courseExists(courseId);
        if (!exists) {
          setError(`Course not found: ${courseId}`);
          setIsLoading(false);
          return;
        }

        // Get the launch file for URL construction
        const launchFile = await courseStorage.getCourseLaunchFile(courseId);
        console.log('Launch file:', launchFile);

        // Debug: List all files and directories in course
        const coursePath = await courseStorage.getCoursePath(courseId);
        console.log('Course path:', coursePath);
        try {
          const items = await FileSystem.readDirectoryAsync(coursePath);
          console.log('Items in course directory:', items);

          // List contents of each directory to help debug 404 issues
          for (const item of items) {
            const itemPath = `${coursePath}${item}`;
            const info = await FileSystem.getInfoAsync(itemPath);
            if (info.exists && info.isDirectory) {
              try {
                const subItems = await FileSystem.readDirectoryAsync(`${itemPath}/`);
                console.log(`Contents of ${item}/:`, subItems);
              } catch (e) {
                console.log(`Error listing ${item}/:`, e);
              }
            }
          }
        } catch (e) {
          console.log('Error listing files:', e);
        }

        // Start the static server
        console.log('Starting static server...');
        await staticServer.start();
        console.log('Static server started');

        // Get HTTP URL for the course
        const url = staticServer.getCourseUrl(courseId, launchFile);
        setCourseUrl(url);
        console.log('Course URL:', url);

        // Read scorm-again script content for inline injection
        const scormPath = await courseStorage.getScormAgainPath();
        console.log('Scorm-again path:', scormPath);
        try {
          const scriptContent = await FileSystem.readAsStringAsync(scormPath);
          setScormAgainScript(scriptContent);
          console.log('Scorm-again script loaded, length:', scriptContent.length);
        } catch (err) {
          console.error('Failed to read scorm-again script:', err);
          setError('Failed to load SCORM API');
          setIsLoading(false);
          return;
        }

        setCourseTitle(courseId);
        setIsLoading(false);
      } catch (err) {
        console.error('Error setting up course:', err);
        setError(`Failed to load course: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    }

    setupCourse();

    // Note: We don't stop the server on unmount because other courses might need it
    // The server is managed as a singleton that persists for the app session
  }, [courseId]);

  // Handle messages from WebView
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const payload: MessagePayload = JSON.parse(event.nativeEvent.data);

      switch (payload.type) {
        case 'sync':
          if (payload.status === 'success') {
            setIsSyncing(false);
            Alert.alert('Sync Complete', 'Course data synced successfully');
          } else if (payload.status === 'error') {
            setIsSyncing(false);
            Alert.alert('Sync Failed', 'Failed to sync course data');
          } else if (payload.status === 'start') {
            setIsSyncing(true);
          }
          break;

        case 'log':
          // Handle log messages from scorm-again
          console.log(`[SCORM] [${payload.level}] ${payload.message}`);
          break;

        case 'console':
          // Forward WebView console messages
          const prefix = `[WebView ${payload.level}]`;
          if (payload.level === 'error') {
            console.error(prefix, payload.message);
          } else if (payload.level === 'warn') {
            console.warn(prefix, payload.message);
          } else {
            console.log(prefix, payload.message);
          }
          break;

        case 'alert':
          // Show native alert for WebView alert/confirm calls
          Alert.alert(payload.title || 'Alert', payload.message || '');
          break;

        default:
          console.log('Unknown message type:', payload.type, event.nativeEvent.data);
      }
    } catch (err) {
      console.error('Error parsing WebView message:', err);
    }
  };

  // Create injection script - injects scorm-again directly before page loads
  const getInjectionScript = () => {
    if (!scormAgainScript || !courseId) return '';

    return `
      (function() {
        // Override dialog functions to use native alerts via postMessage
        window.alert = function(msg) {
          console.log('[ALERT]', msg);
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'alert',
              message: String(msg)
            }));
          }
        };
        window.confirm = function(msg) {
          console.log('[CONFIRM]', msg);
          // Note: confirm is synchronous in JS but we can't block for native response
          // Default to true for now - could implement async confirm if needed
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'alert',
              title: 'Confirm',
              message: String(msg)
            }));
          }
          return true;
        };
        window.prompt = function(msg, defaultVal) {
          console.log('[PROMPT]', msg);
          return defaultVal || '';
        };

        // Use postMessage for logging since console isn't forwarded yet
        function scormLog(msg) {
          console.log('[SCORM-INJECT] ' + msg);
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'console', level: 'log', message: '[SCORM-INJECT] ' + msg}));
          }
        }

        scormLog('Starting injection...');

        try {
          // Inject scorm-again.js inline
          ${scormAgainScript}

          scormLog('Script executed');
          scormLog('window.Scorm2004API exists: ' + (typeof window.Scorm2004API));
          scormLog('window.Scorm12API exists: ' + (typeof window.Scorm12API));

          var apiSettings = {
            enableOfflineSupport: true,
            courseId: '${courseId}',
            autocommit: true,
            autocommitSeconds: 60,
            logLevel: 1, // ERROR level only to reduce noise
          };

          // Initialize SCORM 2004 API (for SCORM 2004 courses)
          if (window.Scorm2004API) {
            scormLog('Creating Scorm2004API instance...');
            window.API_1484_11 = new window.Scorm2004API(apiSettings);
            scormLog('API_1484_11 created (SCORM 2004)');
          } else {
            scormLog('WARNING: Scorm2004API not found');
          }

          // Initialize SCORM 1.2 API (for SCORM 1.2 courses)
          if (window.Scorm12API) {
            scormLog('Creating Scorm12API instance...');
            var scorm12Instance = new window.Scorm12API(apiSettings);
            // Store the instance in a closure-protected variable
            window._scorm12APIInstance = scorm12Instance;
            // Use getter/setter to make window.API bulletproof against "var API = null"
            Object.defineProperty(window, 'API', {
              get: function() { return window._scorm12APIInstance; },
              set: function(val) {
                scormLog('Blocked attempt to set window.API to: ' + val);
                // Ignore - keep our instance
              },
              configurable: false  // Prevent redefinition
            });
            scormLog('API created (SCORM 1.2) - protected with getter');
            scormLog('API.LMSInitialize exists: ' + (typeof window.API.LMSInitialize));
          } else {
            scormLog('WARNING: Scorm12API not found');
          }

          // ADL Golf Examples use GetAPI() which searches window.parent
          // In a WebView, window.parent === window, so the search fails
          // Fix: Make window.parent return a fake parent that has both APIs
          Object.defineProperty(window, 'parent', {
            get: function() {
              return {
                API_1484_11: window.API_1484_11,  // SCORM 2004
                API: window._scorm12APIInstance,  // SCORM 1.2 (use protected instance)
                parent: null  // Stop parent chain traversal
              };
            },
            configurable: true
          });

          scormLog('window.parent override installed');

          // Set up sync event listeners on the active API
          var activeAPI = window.API_1484_11 || window.API;
          if (activeAPI && activeAPI.on) {
            activeAPI.on('OfflineDataSyncing', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'sync',
                status: 'start'
              }));
            });

            activeAPI.on('OfflineDataSynced', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'sync',
                status: 'success'
              }));
            });

            activeAPI.on('OfflineDataSyncFailed', function(error) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'sync',
                status: 'error'
              }));
            });
          }

          scormLog('SCORM APIs initialized - 1.2: ' + (typeof window.API) + ', 2004: ' + (typeof window.API_1484_11));

        } catch (e) {
          scormLog('ERROR: ' + e.message);
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'console', level: 'error', message: '[SCORM-INJECT] Error: ' + e.message + ' Stack: ' + e.stack}));
          }
        }
      })();
      true;
    `;
  };

  // Handle back button
  const handleBack = () => {
    Alert.alert(
      'Exit Course',
      'Are you sure you want to exit this course? Your progress has been saved.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', onPress: () => router.back(), style: 'destructive' },
      ]
    );
  };

  // Show loading screen
  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <ActivityIndicator size="large" color={tintColor} />
        <Text style={[styles.loadingText, { color: textColor }]}>Loading course...</Text>
      </View>
    );
  }

  // Show error screen
  if (error || !courseUrl || !scormAgainScript) {
    return (
      <View style={[styles.centerContainer, { backgroundColor }]}>
        <Ionicons name="alert-circle-outline" size={64} color="#ff3b30" />
        <Text style={[styles.errorTitle, { color: textColor }]}>Error Loading Course</Text>
        <Text style={[styles.errorMessage, { color: textColor }]}>
          {error || 'Failed to load course resources'}
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: tintColor }]} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate content padding for curved corners and safe areas
  const webViewStyle = {
    flex: 1,
    backgroundColor: 'transparent',
    // Add padding for landscape mode side curves
    marginLeft: !isPortrait ? insets.left : 0,
    marginRight: !isPortrait ? insets.right : 0,
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar barStyle="light-content" />

      {/* Safe area for top - black to blend with Dynamic Island */}
      <View style={[styles.safeTop, { height: insets.top, backgroundColor: '#000' }]} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: tintColor }]}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {courseTitle}
        </Text>

        <View style={styles.headerRight}>
          <Ionicons
            name={isOnline ? 'wifi' : 'wifi-outline'}
            size={20}
            color={isOnline ? '#fff' : '#ff9500'}
          />
          <SyncIndicator isSyncing={isSyncing} color="#fff" />
        </View>
      </View>

      {/* WebView - now uses HTTP URL from local server */}
      <View style={[styles.webviewContainer, { backgroundColor }]}>
        <WebView
          ref={webViewRef}
          source={{ uri: courseUrl }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScriptBeforeContentLoaded={getInjectionScript()}
          injectedJavaScript={`
            // Forward console.log to React Native
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;
            console.log = function(...args) {
              originalLog.apply(console, args);
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'console', level: 'log', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}));
            };
            console.error = function(...args) {
              originalError.apply(console, args);
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'console', level: 'error', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}));
            };
            console.warn = function(...args) {
              originalWarn.apply(console, args);
              window.ReactNativeWebView.postMessage(JSON.stringify({type: 'console', level: 'warn', message: args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ')}));
            };

            // Trigger resize to help ADL courses size their iframe correctly
            setTimeout(function() {
              window.dispatchEvent(new Event('resize'));
              // Also try calling SetupIFrame if it exists (ADL launchpage function)
              if (typeof SetupIFrame === 'function') {
                SetupIFrame();
              }
            }, 100);

            true;
          `}
          originWhitelist={['*']}
          mixedContentMode="always"
          mediaPlaybackRequiresUserAction={false}
          onLoadStart={(e) => {
            console.log('WebView loading:', e.nativeEvent.url);
          }}
          onLoad={(e) => {
            console.log('WebView loaded:', e.nativeEvent.url);
          }}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
            Alert.alert('Error', `Failed to load: ${nativeEvent.description || 'Unknown error'}`);
          }}
          onHttpError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView HTTP error:', nativeEvent);
          }}
          style={webViewStyle}
        />
      </View>

      {/* Footer safe area - minimal padding just for home indicator */}
      {insets.bottom > 0 && (
        <View style={[styles.safeBottom, { height: Math.min(insets.bottom, 20), backgroundColor }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeTop: {
    width: '100%',
  },
  safeBottom: {
    width: '100%',
  },
  webviewContainer: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  headerButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
