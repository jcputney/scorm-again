import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SyncManager from '../services/SyncManager';

interface SyncContextType {
  shouldSync: boolean;
  markSyncComplete: () => void;
  triggerSync: () => Promise<void>;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

const SYNC_TRIGGER_KEY = '@scorm-again:syncTrigger';
let lastCheckedTimestamp = '0';

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const [shouldSync, setShouldSync] = useState(false);

  const checkForSyncTrigger = useCallback(async () => {
    try {
      const timestamp = await AsyncStorage.getItem(SYNC_TRIGGER_KEY);
      if (timestamp && timestamp !== lastCheckedTimestamp) {
        lastCheckedTimestamp = timestamp;
        setShouldSync(true);
      }
    } catch (error) {
      console.error('Error checking sync trigger:', error);
    }
  }, []);

  useEffect(() => {
    // Check immediately
    checkForSyncTrigger();

    // Then check periodically
    const interval = setInterval(checkForSyncTrigger, 1000);

    return () => clearInterval(interval);
  }, [checkForSyncTrigger]);

  const markSyncComplete = useCallback(() => {
    setShouldSync(false);
  }, []);

  const triggerSync = useCallback(async () => {
    await SyncManager.triggerSync();
    // The periodic check will pick this up and set shouldSync to true
  }, []);

  return (
    <SyncContext.Provider value={{ shouldSync, markSyncComplete, triggerSync }}>
      {children}
    </SyncContext.Provider>
  );
}

export function useSyncContext() {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
}
