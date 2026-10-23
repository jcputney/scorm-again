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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type {
  WebViewNavigationEvent,
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
} from 'react-native-webview/lib/WebViewTypes';
import { Ionicons } from '@expo/vector-icons';
import NetInfo from '@react-native-community/netinfo';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as FileSystem from 'expo-file-system/legacy';
import { SyncIndicator } from '@/src/components/SyncIndicator';
import { useThemeColor } from '@/components/Themed';
import courseStorage from '@/src/services/CourseStorage';
import staticServer from '@/src/services/StaticServerService';
import SyncManager from '@/src/services/SyncManager';
import { LMS_COMMIT_URL, LEARNER_ID } from '@/src/constants';

interface MessagePayload {
  type: string;
  name?: string;
  errorCode?: number;
  level?: number | string;
  message?: string;
}

export default function PlayerScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const webViewRef = useRef<WebView<{}>>(null);

  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [courseTitle, setCourseTitle] = useState('SCORM Course');
  const [courseUrl, setCourseUrl] = useState<string | null>(null);
  const [injectionScript, setInjectionScript] = useState<string | null>(null);
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

  const sendNetworkStatus = (online: boolean) => {
    webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new CustomEvent('scorm-again:network-status', {
        detail: { online: ${online} }
      }));
      true;
    `);
  };

  // Monitor network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected === true && state.isInternetReachable !== false;
      setIsOnline(online);
      sendNetworkStatus(online);
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

        // Start the static server
        console.log('Starting static server...');
        await staticServer.start();
        console.log('Static server started');

        // Get HTTP URL for the course
        const url = staticServer.getPlayerUrl(courseId, launchFile);
        setCourseUrl(url);
        console.log('Course URL:', url);

        const scormPath = await courseStorage.getScormAgainPath();
        const [bundleText, bridgeText, version, debug] = await Promise.all([
          FileSystem.readAsStringAsync(scormPath),
          FileSystem.readAsStringAsync(courseStorage.getBridgePath()),
          courseStorage.getCourseScormVersion(courseId),
          SyncManager.isDebugEnabled(),
        ]);
        const config = {
          version,
          settings: {
            lmsCommitUrl: LMS_COMMIT_URL,
            enableOfflineSupport: true,
            courseId,
            autocommit: true,
            autocommitSeconds: 60,
            logLevel: debug ? 1 : 3,
          },
          cmi: version === '1.2' ? { core: { student_id: LEARNER_ID } } : { learner_id: LEARNER_ID },
        };
        const configText = `window.scormBridgeConfig = ${JSON.stringify(config)};`;
        setInjectionScript(bundleText + '\n' + configText + '\n' + bridgeText + '\ntrue;');

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
        case 'event':
          switch (payload.name) {
            case 'Initialize':
            case 'LMSInitialize':
              NetInfo.fetch().then((state) => {
                const online = state.isConnected === true && state.isInternetReachable !== false;
                setIsOnline(online);
                sendNetworkStatus(online);
              }).catch((err) => console.warn('Failed to read network status:', err));
              break;
            case 'OfflineDataSyncing':
              setIsSyncing(true);
              break;
            case 'OfflineDataSynced':
              setIsSyncing(false);
              SyncManager.recordSyncResult(true).catch((err) => console.error('Failed to record sync result:', err));
              break;
            case 'OfflineDataSyncFailed':
              setIsSyncing(false);
              SyncManager.recordSyncResult(false).catch((err) => console.error('Failed to record sync result:', err));
              Alert.alert('Sync Failed', 'Some course data could not be sent to the LMS.');
              break;
            case 'CommitError':
              console.warn('[scorm-again] CommitError:', payload.errorCode);
              break;
          }
          break;

        case 'log':
          if (Number(payload.level) >= 4) {
            console.error('[scorm-again]', payload.message);
          } else if (Number(payload.level) === 3) {
            console.warn('[scorm-again]', payload.message);
          } else {
            console.log('[scorm-again]', payload.message);
          }
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

        default:
          console.log('Unknown message type:', payload.type, event.nativeEvent.data);
      }
    } catch (err) {
      console.error('Error parsing WebView message:', err);
    }
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
  if (error || !courseUrl || !injectionScript) {
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
        <WebView<{}>
          ref={webViewRef}
          source={{ uri: courseUrl }}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          injectedJavaScriptBeforeContentLoaded={injectionScript}
          injectedJavaScriptBeforeContentLoadedForMainFrameOnly={true}
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

            true;
          `}
          originWhitelist={['*']}
          mixedContentMode="always"
          mediaPlaybackRequiresUserAction={false}
          onLoadStart={(e: WebViewNavigationEvent) => {
            console.log('WebView loading:', e.nativeEvent.url);
          }}
          onLoad={(e: WebViewNavigationEvent) => {
            console.log('WebView loaded:', e.nativeEvent.url);
          }}
          onError={(syntheticEvent: WebViewErrorEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.error('WebView error:', nativeEvent);
            Alert.alert('Error', `Failed to load: ${nativeEvent.description || 'Unknown error'}`);
          }}
          onHttpError={(syntheticEvent: WebViewHttpErrorEvent) => {
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
