// src/CrossFrameAPI.ts
import {
  CrossFrameAPIOptions,
  CrossFrameEvent,
  CrossFrameEventCallback,
  MessageData,
  MessageResponse,
} from "./types/CrossFrame";
import { global_errors } from "./constants/error_codes";

/**
 * Pending request tracking with timestamp for cache merge protection
 */
interface PendingRequest {
  resolve: (v: unknown) => void;
  reject: (e: unknown) => void;
  timer: ReturnType<typeof setTimeout>;
  requestTime: number;
}

/**
 * Client-side SCORM facade running in your content frame.
 * Returns cached/default values synchronously, then fires off an async
 * postMessage to the LMS frame to refresh cache and error state.
 */
export default class CrossFrameAPI {
  private _cache = new Map<string, string>();
  private _cacheTimestamps = new Map<string, number>();
  private _lastError = "0";
  private _pending = new Map<string, PendingRequest>();
  private _counter = 0;
  private readonly _origin: string;
  private readonly _targetWindow: Window;
  private readonly _timeout: number;
  private readonly _heartbeatInterval: number;
  private readonly _heartbeatTimeout: number;

  private _destroyed = false;
  private _connected = true;
  private _lastHeartbeatResponse = Date.now();
  private _heartbeatTimer?: ReturnType<typeof setInterval>;
  private _eventListeners = new Map<string, Set<CrossFrameEventCallback>>();
  private readonly _boundOnMessage: (ev: MessageEvent) => void;

  private _handler: ProxyHandler<CrossFrameAPI> = {
    get: (target, prop, receiver) => {
      // If it's an existing property/method, return it
      if (typeof prop !== "string" || prop in target) {
        const v = Reflect.get(target, prop, receiver);
        return typeof v === "function" ? v.bind(target) : v;
      }

      // Otherwise treat prop as a SCORM call
      const methodName = prop;
      const isGet = methodName.endsWith("GetValue");
      const isSet =
        methodName.startsWith("LMSSet") || methodName.endsWith("SetValue");
      const isInit =
        methodName === "Initialize" || methodName === "LMSInitialize";
      const isFinish =
        methodName === "Terminate" || methodName === "LMSFinish";
      const isCommit = methodName === "Commit" || methodName === "LMSCommit";
      const isErrorString =
        methodName === "GetErrorString" || methodName === "LMSGetErrorString";
      const isDiagnostic =
        methodName === "GetDiagnostic" || methodName === "LMSGetDiagnostic";

      return (...args: unknown[]): string => {
        // Synchronous cache update for setter calls
        if (isSet && args.length >= 2) {
          const key = args[0] as string;
          target._cache.set(key, String(args[1]));
          target._cacheTimestamps.set(key, Date.now());
          target._lastError = "0";
        }

        // Capture request time for cache merge protection
        const requestTime = Date.now();

        // Fire off async postMessage to refresh cache and error
        target
          ._post(methodName, args)
          .then((res) => {
            if (isGet && args.length >= 1) {
              const key = args[0] as string;
              // Only update if not locally modified after request was sent
              const localModTime = target._cacheTimestamps.get(key) ?? 0;
              if (localModTime < requestTime) {
                target._cache.set(key, String(res));
                target._cacheTimestamps.delete(key);
              }
              target._lastError = "0";
            }
            if (isErrorString && args.length >= 1) {
              const code = String(args[0]);
              target._cache.set(`error_${code}`, String(res));
            }
            if (isDiagnostic && args.length >= 1) {
              const code = String(args[0]);
              target._cache.set(`diag_${code}`, String(res));
            }
            if (
              methodName === "GetLastError" ||
              methodName === "LMSGetLastError"
            ) {
              target._lastError = String(res);
            }
          })
          .catch((err) => target._capture(methodName, err));

        // Return synchronously
        if (isGet && args.length >= 1) {
          return target._cache.get(args[0] as string) ?? "";
        }
        if (isErrorString && args.length >= 1) {
          const code = String(args[0]);
          return target._cache.get(`error_${code}`) ?? "";
        }
        if (isDiagnostic && args.length >= 1) {
          const code = String(args[0]);
          return target._cache.get(`diag_${code}`) ?? "";
        }
        if (isInit || isFinish || isCommit || isSet) {
          // Immediately return "true"
          const result = "true";
          // Then warm cache with timestamp protection:
          target
            ._post("getFlattenedCMI", [])
            .then((all: unknown) => {
              if (all && typeof all === "object") {
                const entries = Object.entries(all as Record<string, string>);
                entries.forEach(([key, val]) => {
                  // Only update if not locally modified after request was sent
                  const localModTime = target._cacheTimestamps.get(key) ?? 0;
                  if (localModTime < requestTime) {
                    target._cache.set(key, val);
                    target._cacheTimestamps.delete(key);
                  }
                });
              }
              // reset error
              target._lastError = "0";
            })
            .catch((err) => target._capture("getFlattenedCMI", err));
          return result;
        }
        if (methodName === "GetLastError" || methodName === "LMSGetLastError") {
          return target._lastError;
        }
        return "";
      };
    },
  };

  /**
   * Creates a new CrossFrameAPI instance.
   * @param targetOrigin - Origin to send messages to. Default "*" sends to any origin.
   * @param targetWindow - Window to send messages to. Default is window.parent.
   * @param options - Configuration options
   */
  constructor(
    targetOrigin: string = "*",
    targetWindow: Window = window.parent,
    options: CrossFrameAPIOptions = {},
  ) {
    this._origin = targetOrigin;
    this._targetWindow = targetWindow;
    this._timeout = options.timeout ?? 5000;
    this._heartbeatInterval = options.heartbeatInterval ?? 30000;
    this._heartbeatTimeout = options.heartbeatTimeout ?? 60000;

    this._boundOnMessage = this._onMessage.bind(this);
    window.addEventListener("message", this._boundOnMessage);
    this._startHeartbeat();

    return new Proxy(this, this._handler);
  }

  /**
   * Destroys this instance, removing event listeners and preventing further message processing.
   * Once destroyed, the instance cannot be reused.
   */
  destroy(): void {
    if (this._destroyed) return;
    this._destroyed = true;
    window.removeEventListener("message", this._boundOnMessage);
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = undefined;
    }
    // Reject all pending requests
    for (const [, pending] of this._pending) {
      clearTimeout(pending.timer);
      pending.reject(new Error("CrossFrameAPI destroyed"));
    }
    this._pending.clear();
    this._cache.clear();
    this._cacheTimestamps.clear();
    this._eventListeners.clear();
  }

  /**
   * Subscribes to a CrossFrame event.
   * @param event - Event type to listen for
   * @param callback - Function to call when event occurs
   */
  on(event: string, callback: CrossFrameEventCallback): void {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, new Set());
    }
    this._eventListeners.get(event)!.add(callback);
  }

  /**
   * Unsubscribes from a CrossFrame event.
   * @param event - Event type to stop listening for
   * @param callback - Function to remove
   */
  off(event: string, callback: CrossFrameEventCallback): void {
    this._eventListeners.get(event)?.delete(callback);
  }

  /**
   * Returns whether the connection to the LMS frame is currently active.
   */
  get connected(): boolean {
    return this._connected;
  }

  /**
   * Emits an event to all registered listeners.
   */
  private _emit(event: CrossFrameEvent): void {
    this._eventListeners.get(event.type)?.forEach((cb) => cb(event));
  }

  /**
   * Starts the heartbeat mechanism for connection detection.
   */
  private _startHeartbeat(): void {
    this._heartbeatTimer = setInterval(() => {
      if (this._destroyed) return;

      // Check if we've missed heartbeats
      const timeSinceLastResponse = Date.now() - this._lastHeartbeatResponse;
      if (timeSinceLastResponse > this._heartbeatTimeout && this._connected) {
        this._connected = false;
        this._emit({ type: "connectionLost" });
      }

      // Send heartbeat ping
      this._sendHeartbeat();
    }, this._heartbeatInterval);
  }

  /**
   * Sends a heartbeat ping to the LMS frame.
   */
  private _sendHeartbeat(): void {
    const messageId = `hb-${Date.now()}-${this._counter++}`;
    const msg: MessageData = {
      messageId,
      method: "__heartbeat__",
      params: [],
      isHeartbeat: true,
    };
    this._targetWindow.postMessage(msg, this._origin);
  }

  /**
   * Send a message to the LMS frame and return a promise for its response.
   */
  private _post(method: string, params: unknown[]): Promise<unknown> {
    if (this._destroyed) {
      return Promise.reject(new Error("CrossFrameAPI destroyed"));
    }

    const messageId = `cfapi-${Date.now()}-${this._counter++}`;
    const requestTime = Date.now();

    // Deep-clean params of non-cloneables (e.g. functions)
    const safeParams = params.map((p) => {
      if (typeof p === "function") {
        console.warn(
          "Dropping function param when posting SCORM call:",
          method,
        );
        return undefined;
      }
      return p;
    });

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        if (this._pending.has(messageId)) {
          this._pending.delete(messageId);
          reject(new Error(`Timeout calling ${method}`));
        }
      }, this._timeout);

      this._pending.set(messageId, { resolve, reject, timer, requestTime });
      const msg: MessageData = { messageId, method, params: safeParams };
      this._targetWindow.postMessage(msg, this._origin);
    });
  }

  /**
   * Handle incoming postMessage responses from the LMS frame.
   */
  private _onMessage(ev: MessageEvent): void {
    if (this._destroyed) return;

    // Validate the message origin and source unless all origins are allowed
    if (this._origin !== "*" && ev.origin !== this._origin) {
      return;
    }
    if (ev.source && ev.source !== this._targetWindow) {
      return;
    }

    const data = ev.data as MessageResponse;
    if (!data?.messageId) return;

    // Handle heartbeat response
    if (data.isHeartbeat) {
      this._lastHeartbeatResponse = Date.now();
      if (!this._connected) {
        this._connected = true;
        this._emit({ type: "connectionRestored" });
      }
      return;
    }

    // Handle regular response
    const pending = this._pending.get(data.messageId);
    if (!pending) return;

    clearTimeout(pending.timer);
    this._pending.delete(data.messageId);

    if (data.error) {
      // Check if rate limited and emit event
      if (data.error.message === "Rate limit exceeded") {
        this._emit({ type: "rateLimited", method: "unknown" });
      }
      pending.reject(data.error);
    } else {
      pending.resolve(data.result);
    }
  }

  /**
   * Capture and cache SCORM errors.
   */
  private _capture(method: string, err: unknown): void {
    const errorMessage =
      err instanceof Error
        ? err.message
        : typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : "Unknown error";

    console.error(`CrossFrameAPI ${method} error:`, err);
    const match = /\b(\d{3})\b/.exec(errorMessage);
    const code = match ? match[1] : String(global_errors.GENERAL);
    this._lastError = code;
    this._cache.set(`error_${code}`, errorMessage);
  }
}
