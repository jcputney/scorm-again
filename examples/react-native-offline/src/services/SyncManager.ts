import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LogEntry {
  message: string;
  level: 'info' | 'warn' | 'error';
  timestamp: Date;
}

const MAX_LOGS = 100;
const STORAGE_KEYS = {
  LAST_SYNC: '@scorm-again:lastSyncResult',
  DEBUG_ENABLED: '@scorm-again:debugEnabled',
  LOGS: '@scorm-again:logs',
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

  async recordSyncResult(success: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify({ time: Date.now(), success }));
    this.addLog(success ? 'Offline data synced' : 'Offline data sync failed', success ? 'info' : 'error');
  }

  async getLastSyncResult(): Promise<{ time: Date; success: boolean } | null> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEYS.LAST_SYNC);
      if (!stored) {
        return null;
      }
      const result = JSON.parse(stored);
      return { time: new Date(result.time), success: result.success };
    } catch (error) {
      this.addLog(`Error reading last sync result: ${error}`, 'error');
      return null;
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
