this.CrossFrameAPI = (function () {
  'use strict';

  const global_errors = {
    GENERAL: 101};

  class CrossFrameAPI {
    /**
     * Creates a new CrossFrameAPI instance.
     * @param targetOrigin - Origin to send messages to. Default "*" sends to any origin.
     * @param targetWindow - Window to send messages to. Default is window.parent.
     * @param options - Configuration options
     */
    constructor() {
      let targetOrigin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "*";
      let targetWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.parent;
      let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this._cache = /* @__PURE__ */new Map();
      this._cacheTimestamps = /* @__PURE__ */new Map();
      this._lastError = "0";
      this._pending = /* @__PURE__ */new Map();
      this._counter = 0;
      this._destroyed = false;
      this._connected = true;
      this._lastHeartbeatResponse = Date.now();
      this._eventListeners = /* @__PURE__ */new Map();
      this._handler = {
        get: (target, prop, receiver) => {
          if (typeof prop !== "string" || prop in target) {
            const v = Reflect.get(target, prop, receiver);
            return typeof v === "function" ? v.bind(target) : v;
          }
          const methodName = prop;
          const isGet = methodName.endsWith("GetValue");
          const isSet = methodName.startsWith("LMSSet") || methodName.endsWith("SetValue");
          const isInit = methodName === "Initialize" || methodName === "LMSInitialize";
          const isFinish = methodName === "Terminate" || methodName === "LMSFinish";
          const isCommit = methodName === "Commit" || methodName === "LMSCommit";
          const isErrorString = methodName === "GetErrorString" || methodName === "LMSGetErrorString";
          const isDiagnostic = methodName === "GetDiagnostic" || methodName === "LMSGetDiagnostic";
          return function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            if (!CrossFrameAPI._validateArgs(args)) {
              console.error(`CrossFrameAPI: Invalid arguments for ${methodName}`);
              return "";
            }
            if (isSet && args.length >= 2) {
              const key = args[0];
              target._cache.set(key, String(args[1]));
              target._cacheTimestamps.set(key, Date.now());
              target._lastError = "0";
            }
            const requestTime = Date.now();
            target._post(methodName, args).then(res => {
              if (isGet && args.length >= 1) {
                const key = args[0];
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
              if (methodName === "GetLastError" || methodName === "LMSGetLastError") {
                target._lastError = String(res);
              }
            }).catch(err => target._capture(methodName, err));
            if (isGet && args.length >= 1) {
              return target._cache.get(args[0]) ?? "";
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
              const result = "true";
              target._post("getFlattenedCMI", []).then(all => {
                if (all && typeof all === "object") {
                  const entries = Object.entries(all);
                  entries.forEach(_ref => {
                    let [key, val] = _ref;
                    const localModTime = target._cacheTimestamps.get(key) ?? 0;
                    if (localModTime < requestTime) {
                      target._cache.set(key, val);
                      target._cacheTimestamps.delete(key);
                    }
                  });
                }
                target._lastError = "0";
              }).catch(err => target._capture("getFlattenedCMI", err));
              return result;
            }
            if (methodName === "GetLastError" || methodName === "LMSGetLastError") {
              return target._lastError;
            }
            return "";
          };
        }
      };
      this._origin = targetOrigin;
      this._targetWindow = targetWindow;
      this._timeout = options.timeout ?? 5e3;
      this._heartbeatInterval = options.heartbeatInterval ?? 3e4;
      this._heartbeatTimeout = options.heartbeatTimeout ?? 6e4;
      if (targetOrigin === "*") {
        console.warn("CrossFrameAPI: Using wildcard origin ('*') allows any origin to receive messages. This is insecure for production use. Specify an explicit origin (e.g., 'https://lms.example.com') to restrict message recipients.");
      }
      this._boundOnMessage = this._onMessage.bind(this);
      window.addEventListener("message", this._boundOnMessage);
      this._startHeartbeat();
      return new Proxy(this, this._handler);
    }
    /**
     * Type guard to validate MessageResponse structure
     */
    static _isValidMessageResponse(data) {
      if (typeof data !== "object" || data === null) return false;
      const resp = data;
      if (typeof resp.messageId !== "string" || resp.messageId.length === 0) return false;
      if (resp.error !== void 0) {
        if (typeof resp.error !== "object" || resp.error === null) return false;
        const err = resp.error;
        if (typeof err.message !== "string") return false;
        if (err.code !== void 0 && typeof err.code !== "string") return false;
      }
      if (resp.isHeartbeat !== void 0 && typeof resp.isHeartbeat !== "boolean") return false;
      return true;
    }
    /**
     * Validates that args is an array and sanitizes it for safe use
     */
    static _validateArgs(args) {
      if (!Array.isArray(args)) return false;
      return true;
    }
    /**
     * Destroys this instance, removing event listeners and preventing further message processing.
     * Once destroyed, the instance cannot be reused.
     */
    destroy() {
      if (this._destroyed) return;
      this._destroyed = true;
      window.removeEventListener("message", this._boundOnMessage);
      if (this._heartbeatTimer) {
        clearInterval(this._heartbeatTimer);
        this._heartbeatTimer = void 0;
      }
      for (const pending of Array.from(this._pending.values())) {
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
    on(event, callback) {
      if (!this._eventListeners.has(event)) {
        this._eventListeners.set(event, /* @__PURE__ */new Set());
      }
      this._eventListeners.get(event)?.add(callback);
    }
    /**
     * Unsubscribes from a CrossFrame event.
     * @param event - Event type to stop listening for
     * @param callback - Function to remove
     */
    off(event, callback) {
      this._eventListeners.get(event)?.delete(callback);
    }
    /**
     * Returns whether the connection to the LMS frame is currently active.
     */
    get connected() {
      return this._connected;
    }
    /**
     * Emits an event to all registered listeners.
     */
    _emit(event) {
      this._eventListeners.get(event.type)?.forEach(cb => cb(event));
    }
    /**
     * Starts the heartbeat mechanism for connection detection.
     */
    _startHeartbeat() {
      if (this._heartbeatTimer) {
        clearInterval(this._heartbeatTimer);
      }
      this._heartbeatTimer = setInterval(() => {
        if (this._destroyed) return;
        const timeSinceLastResponse = Date.now() - this._lastHeartbeatResponse;
        if (timeSinceLastResponse > this._heartbeatTimeout && this._connected) {
          this._connected = false;
          this._emit({
            type: "connectionLost"
          });
        }
        this._sendHeartbeat();
      }, this._heartbeatInterval);
    }
    /**
     * Sends a heartbeat ping to the LMS frame.
     */
    _sendHeartbeat() {
      const messageId = `hb-${Date.now()}-${this._counter++}`;
      const msg = {
        messageId,
        method: "__heartbeat__",
        params: [],
        isHeartbeat: true
      };
      this._targetWindow.postMessage(msg, this._origin);
    }
    /**
     * Send a message to the LMS frame and return a promise for its response.
     */
    _post(method, params) {
      if (this._destroyed) {
        return Promise.reject(new Error("CrossFrameAPI destroyed"));
      }
      const messageId = `cfapi-${Date.now()}-${this._counter++}`;
      const requestTime = Date.now();
      const safeParams = params.map(p => {
        if (typeof p === "function") {
          console.warn("Dropping function param when posting SCORM call:", method);
          return void 0;
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
        this._pending.set(messageId, {
          resolve,
          reject,
          timer,
          requestTime,
          method
        });
        const msg = {
          messageId,
          method,
          params: safeParams
        };
        this._targetWindow.postMessage(msg, this._origin);
      });
    }
    /**
     * Handle incoming postMessage responses from the LMS frame.
     */
    _onMessage(ev) {
      if (this._destroyed) return;
      if (this._origin !== "*" && ev.origin !== this._origin) {
        return;
      }
      if (ev.source && ev.source !== this._targetWindow) {
        return;
      }
      if (!CrossFrameAPI._isValidMessageResponse(ev.data)) return;
      const data = ev.data;
      if (data.isHeartbeat) {
        this._lastHeartbeatResponse = Date.now();
        if (!this._connected) {
          this._connected = true;
          this._emit({
            type: "connectionRestored"
          });
        }
        return;
      }
      const pending = this._pending.get(data.messageId);
      if (!pending) return;
      clearTimeout(pending.timer);
      this._pending.delete(data.messageId);
      if (data.error) {
        if (data.error.message === "Rate limit exceeded") {
          this._emit({
            type: "rateLimited",
            method: pending.method
          });
        }
        pending.reject(data.error);
      } else {
        pending.resolve(data.result);
      }
    }
    /**
     * Capture and cache SCORM errors.
     */
    _capture(method, err) {
      let errorMessage = "Unknown error";
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        errorMessage = String(err.message);
      }
      console.error(`CrossFrameAPI ${method} error:`, err);
      const match = /(?:error code|code)?\s*(\d{3})\b/i.exec(errorMessage);
      const code = match?.[1] ?? String(global_errors.GENERAL);
      this._lastError = code;
      this._cache.set(`error_${code}`, errorMessage);
    }
  }

  return CrossFrameAPI;

})();
//# sourceMappingURL=cross-frame-api.js.map
