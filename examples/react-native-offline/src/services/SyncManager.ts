import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LogEntry {
  message: string;
  level: 'info' | 'warn' | 'error';
  timestamp: Date;
}

const MAX_LOGS = 100;
const STORAGE_KEYS = {
  LAST_SYNC: '@scorm-again:lastSyncTime',
  DEBUG_ENABLED: '@scorm-again:debugEnabled',
  LOGS: '@scorm-again:logs',
  SYNC_TRIGGER: '@scorm-again:syncTrigger',
};

export class SyncManager {
  private static instance: SyncManager;
  private logs: LogEntry[] = [];

  private constructor() {
    this.loadLogs();
  }

  static getInstance(): SyncManager {
    if (!SyncManager.instance) {
      SyncManager.instance = new SyncManager();
    }
    return SyncManager.instance;
  }

  async triggerSync(): Promise<void> {
    this.addLog('Manual sync triggered', 'info');

    // Store a timestamp that WebViews can check for
    const timestamp = Date.now().toString();
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_TRIGGER, timestamp);

    // Update last sync time
    await this.updateLastSyncTime();

    this.addLog('Sync request broadcast to active sessions', 'info');
  }

  getPendingCount(): number | null {
    // This would require inspecting localStorage via WebView
    // For now, return null to indicate "Unknown"
    // Future implementation could use a hidden WebView to read localStorage
    return null;
  }

  async getLastSyncTime(): Promise<Date | null> {
    try {
      const timestamp = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      return timestamp ? new Date(parseInt(timestamp, 10)) : null;
    } catch (error) {
      this.addLog(`Error reading last sync time: ${error}`, 'error');
      return null;
    }
  }

  async updateLastSyncTime(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, Date.now().toString());
    } catch (error) {
      this.addLog(`Error updating last sync time: ${error}`, 'error');
    }
  }

  addLog(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
    const entry: LogEntry = {
      message,
      level,
      timestamp: new Date(),
    };

    this.logs.unshift(entry);

    // Keep only the most recent logs
    if (this.logs.length > MAX_LOGS) {
      this.logs = this.logs.slice(0, MAX_LOGS);
    }

    // Persist logs to storage
    this.saveLogs();
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  async clearLogs(): Promise<void> {
    this.logs = [];
    await AsyncStorage.removeItem(STORAGE_KEYS.LOGS);
    this.addLog('Logs cleared', 'info');
  }

  async isDebugEnabled(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEYS.DEBUG_ENABLED);
      return value === 'true';
    } catch (error) {
      return false;
    }
  }

  async setDebugEnabled(enabled: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DEBUG_ENABLED, enabled.toString());
      this.addLog(`Debug mode ${enabled ? 'enabled' : 'disabled'}`, 'info');
    } catch (error) {
      this.addLog(`Error setting debug mode: ${error}`, 'error');
    }
  }

  private async loadLogs(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LOGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.logs = parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp),
        }));
      }
    } catch (error) {
      // If loading fails, start with fresh logs
      this.logs = [];
    }
  }

  private async saveLogs(): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(this.logs));
    } catch (error) {
      // Silently fail to avoid infinite loop
    }
  }
}

export default SyncManager.getInstance();
