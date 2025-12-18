import NetInfo, {
  NetInfoState,
  NetInfoSubscription,
} from "@react-native-community/netinfo";

export type NetworkStatusCallback = (online: boolean) => void;

export class NetworkStatus {
  private static instance: NetworkStatus;
  private _isOnline: boolean = true;
  private listeners: Set<NetworkStatusCallback> = new Set();
  private unsubscribe: NetInfoSubscription | null = null;

  private constructor() {}

  static getInstance(): NetworkStatus {
    if (!NetworkStatus.instance) {
      NetworkStatus.instance = new NetworkStatus();
    }
    return NetworkStatus.instance;
  }

  get isOnline(): boolean {
    return this._isOnline;
  }

  /**
   * Start monitoring network changes
   */
  startMonitoring(): void {
    if (this.unsubscribe) {
      return; // Already monitoring
    }

    // Get initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      this._isOnline = state.isConnected ?? false;
      this.notifyListeners();
    });

    // Subscribe to changes
    this.unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const wasOnline = this._isOnline;
      this._isOnline = state.isConnected ?? false;

      // Only notify if status changed
      if (wasOnline !== this._isOnline) {
        this.notifyListeners();
      }
    });
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = null;
    }
  }

  /**
   * Get current status
   */
  getStatus(): boolean {
    return this._isOnline;
  }

  /**
   * Add listener for changes
   * @returns Cleanup function to remove the listener
   */
  addListener(callback: NetworkStatusCallback): () => void {
    this.listeners.add(callback);

    // Return cleanup function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify all listeners of status change
   */
  private notifyListeners(): void {
    this.listeners.forEach((callback) => {
      try {
        callback(this._isOnline);
      } catch (error) {
        console.error("Error in network status listener:", error);
      }
    });
  }

  /**
   * Force refresh network status
   */
  async refresh(): Promise<boolean> {
    const state = await NetInfo.fetch();
    this._isOnline = state.isConnected ?? false;
    return this._isOnline;
  }
}

export default NetworkStatus.getInstance();
