import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import SyncManager from '../../src/services/SyncManager';
import StorageService from '../../src/services/StorageService';

const SCORM_AGAIN_VERSION = '3.0.0-alpha.1';
const GITHUB_URL = 'https://github.com/jcputney/scorm-again';
const DOCS_URL = 'https://github.com/jcputney/scorm-again#readme';

export default function SettingsScreen() {
  const netInfo = useNetInfo();
  const [refreshing, setRefreshing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [storageUsed, setStorageUsed] = useState<number>(0);
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [syncTime, debug, storage] = await Promise.all([
        SyncManager.getLastSyncTime(),
        SyncManager.isDebugEnabled(),
        StorageService.getTotalStorageUsed(),
      ]);

      setLastSyncTime(syncTime);
      setDebugEnabled(debug);
      setStorageUsed(storage);
      setPendingCount(SyncManager.getPendingCount());
      setLogs(SyncManager.getLogs());
    } catch (error) {
      console.error('Error loading settings data:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleSync = async () => {
    if (!netInfo.isConnected) {
      Alert.alert('Offline', 'Cannot sync while offline. Please connect to the internet.');
      return;
    }

    setSyncing(true);
    try {
      await SyncManager.triggerSync();
      await loadData();
      Alert.alert('Success', 'Sync triggered successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to trigger sync');
      console.error('Sync error:', error);
    } finally {
      setSyncing(false);
    }
  };

  const handleClearStorage = () => {
    Alert.alert(
      'Clear All Courses',
      'This will delete all downloaded courses. This action cannot be undone. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearAllCourses();
              await loadData();
              Alert.alert('Success', 'All courses have been deleted');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear storage');
              console.error('Clear storage error:', error);
            }
          },
        },
      ],
    );
  };

  const handleToggleDebug = async (value: boolean) => {
    setDebugEnabled(value);
    await SyncManager.setDebugEnabled(value);
    await loadData();
  };

  const handleClearLogs = () => {
    Alert.alert('Clear Logs', 'Are you sure you want to clear all debug logs?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          await SyncManager.clearLogs();
          await loadData();
        },
      },
    ]);
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch((err) => {
      console.error('Failed to open URL:', err);
      Alert.alert('Error', 'Failed to open link');
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Never';
    return date.toLocaleString();
  };

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return '#ff3b30';
      case 'warn':
        return '#ff9500';
      case 'info':
      default:
        return '#007aff';
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Network Status Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Network Status</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons
              name={netInfo.isConnected ? 'wifi' : 'wifi-outline'}
              size={24}
              color={netInfo.isConnected ? '#34c759' : '#ff3b30'}
            />
            <Text style={styles.statusText}>
              {netInfo.isConnected ? 'Online' : 'Offline'}
            </Text>
            {netInfo.type && (
              <Text style={styles.statusSubtext}>({netInfo.type})</Text>
            )}
          </View>
        </View>
      </View>

      {/* Sync Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Synchronization</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={[
              styles.syncButton,
              (!netInfo.isConnected || syncing) && styles.syncButtonDisabled,
            ]}
            onPress={handleSync}
            disabled={!netInfo.isConnected || syncing}
          >
            {syncing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="sync" size={20} color="#fff" />
                <Text style={styles.syncButtonText}>Sync Now</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Pending Items:</Text>
            <Text style={styles.infoValue}>
              {pendingCount !== null ? pendingCount : 'Unknown'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Last Sync:</Text>
            <Text style={styles.infoValue}>{formatDate(lastSyncTime)}</Text>
          </View>
        </View>
      </View>

      {/* Storage Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Total Storage Used:</Text>
            <Text style={styles.infoValue}>
              {StorageService.formatBytes(storageUsed)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearStorage}
          >
            <Ionicons name="trash-outline" size={20} color="#ff3b30" />
            <Text style={styles.dangerButtonText}>Clear All Courses</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Debug Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>App Version:</Text>
            <Text style={styles.infoValue}>
              {Constants.expoConfig?.version || '1.0.0'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>scorm-again Version:</Text>
            <Text style={styles.infoValue}>{SCORM_AGAIN_VERSION}</Text>
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.infoLabel}>Show Debug Logs:</Text>
            <Switch value={debugEnabled} onValueChange={handleToggleDebug} />
          </View>

          {debugEnabled && (
            <>
              <TouchableOpacity
                style={styles.logViewerToggle}
                onPress={() => setShowLogs(!showLogs)}
              >
                <Text style={styles.logViewerToggleText}>
                  {showLogs ? 'Hide Logs' : 'Show Logs'} ({logs.length})
                </Text>
                <Ionicons
                  name={showLogs ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#007aff"
                />
              </TouchableOpacity>

              {showLogs && (
                <View style={styles.logViewer}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logHeaderText}>Recent Logs</Text>
                    <TouchableOpacity onPress={handleClearLogs}>
                      <Text style={styles.clearLogsText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={styles.logList} nestedScrollEnabled>
                    {logs.length === 0 ? (
                      <Text style={styles.noLogsText}>No logs yet</Text>
                    ) : (
                      logs.map((log, index) => (
                        <View key={index} style={styles.logEntry}>
                          <View
                            style={[
                              styles.logIndicator,
                              { backgroundColor: getLogLevelColor(log.level) },
                            ]}
                          />
                          <View style={styles.logContent}>
                            <Text style={styles.logMessage}>{log.message}</Text>
                            <Text style={styles.logTimestamp}>
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </Text>
                          </View>
                        </View>
                      ))
                    )}
                  </ScrollView>
                </View>
              )}
            </>
          )}
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleOpenLink(GITHUB_URL)}
          >
            <Ionicons name="logo-github" size={24} color="#333" />
            <Text style={styles.linkText}>View on GitHub</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.linkRow}
            onPress={() => handleOpenLink(DOCS_URL)}
          >
            <Ionicons name="book-outline" size={24} color="#333" />
            <Text style={styles.linkText}>Documentation</Text>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusSubtext: {
    fontSize: 14,
    color: '#666',
  },
  syncButton: {
    backgroundColor: '#007aff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  syncButtonDisabled: {
    backgroundColor: '#ccc',
  },
  syncButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ff3b30',
    marginTop: 12,
  },
  dangerButtonText: {
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: '600',
  },
  logViewerToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  logViewerToggleText: {
    fontSize: 14,
    color: '#007aff',
    fontWeight: '600',
  },
  logViewer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  clearLogsText: {
    fontSize: 14,
    color: '#ff3b30',
  },
  logList: {
    maxHeight: 300,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 8,
  },
  noLogsText: {
    textAlign: 'center',
    color: '#999',
    padding: 16,
    fontSize: 14,
  },
  logEntry: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  logContent: {
    flex: 1,
  },
  logMessage: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },
  logTimestamp: {
    fontSize: 11,
    color: '#999',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  linkText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 4,
  },
});
