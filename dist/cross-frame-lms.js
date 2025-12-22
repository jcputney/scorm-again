this.CrossFrameLMS = (function () {
  'use strict';

  const _CrossFrameLMS = class _CrossFrameLMS {
    /**
     * Creates a new CrossFrameLMS instance.
     * @param api - The SCORM API instance to delegate calls to
     * @param targetOrigin - Origin to accept messages from. Default "*" accepts all origins.
     * @param options - Configuration options
     */
    constructor(api) {
      let targetOrigin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "*";
      let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      this._requestTimes = [];
      this._destroyed = false;
      this._api = api;
      this._origin = targetOrigin;
      this._rateLimit = options.rateLimit ?? 100;
      if (targetOrigin === "*") {
        console.warn("CrossFrameLMS: Using wildcard origin ('*') allows any origin to send messages. This is insecure for production use. Specify an explicit origin (e.g., 'https://content.example.com') to restrict message sources.");
      }
      this._boundOnMessage = this._onMessage.bind(this);
      window.addEventListener("message", this._boundOnMessage);
    }
    /**
     * Destroys this instance, removing event listeners and preventing further message processing.
     * Once destroyed, the instance cannot be reused.
     */
    destroy() {
      if (this._destroyed) return;
      this._destroyed = true;
      window.removeEventListener("message", this._boundOnMessage);
      this._requestTimes.length = 0;
    }
    /**
     * Checks if the rate limit has been exceeded.
     * Uses a sliding window of 1 second.
     * @returns true if rate limit exceeded, false otherwise
     */
    _isRateLimited() {
      const now = Date.now();
      this._requestTimes = this._requestTimes.filter(t => now - t < 1e3);
      if (this._requestTimes.length >= this._rateLimit) {
        return true;
      }
      this._requestTimes.push(now);
      return false;
    }
    /**
     * Type guard to validate MessageData structure
     */
    static _isValidMessageData(data) {
      if (typeof data !== "object" || data === null) return false;
      const msg = data;
      if (typeof msg.messageId !== "string" || msg.messageId.length === 0) return false;
      if (typeof msg.method !== "string" || msg.method.length === 0) return false;
      if (msg.params !== void 0 && !Array.isArray(msg.params)) return false;
      if (msg.isHeartbeat !== void 0 && typeof msg.isHeartbeat !== "boolean") return false;
      return true;
    }
    /**
     * Handles incoming postMessage events from child frames.
     */
    _onMessage(ev) {
      if (this._destroyed) return;
      if (this._origin !== "*" && ev.origin !== this._origin) {
        return;
      }
      if (!_CrossFrameLMS._isValidMessageData(ev.data)) return;
      const msg = ev.data;
      if (!ev.source) return;
      if (!("postMessage" in ev.source)) return;
      const source = ev.source;
      if (msg.isHeartbeat) {
        const resp = {
          messageId: msg.messageId,
          isHeartbeat: true
        };
        source.postMessage(resp, this._origin);
        return;
      }
      if (this._isRateLimited()) {
        const resp = {
          messageId: msg.messageId,
          error: {
            message: "Rate limit exceeded",
            code: "101"
          }
        };
        source.postMessage(resp, this._origin);
        return;
      }
      if (!_CrossFrameLMS.ALLOWED_METHODS.has(msg.method)) {
        const resp = {
          messageId: msg.messageId,
          error: {
            message: `Method not allowed: ${msg.method}`,
            code: "101"
          }
        };
        source.postMessage(resp, this._origin);
        return;
      }
      this._process(msg, source);
    }
    /**
     * Processes a validated message by invoking the requested API method.
     */
    _process(msg, source) {
      const sendResponse = (result, error) => {
        const resp = {
          messageId: msg.messageId
        };
        if (result !== void 0) resp.result = result;
        if (error !== void 0) resp.error = error;
        source.postMessage(resp, this._origin);
      };
      try {
        const fn = this._api[msg.method];
        if (typeof fn !== "function") {
          sendResponse(void 0, {
            message: `Method ${msg.method} not found`
          });
          return;
        }
        const params = Array.isArray(msg.params) ? msg.params : [];
        const result = fn.apply(this._api, params);
        if (result && typeof result.then === "function") {
          result.then(r => sendResponse(r)).catch(e => {
            const message = e instanceof Error ? e.message : "Unknown error";
            const code = e && typeof e === "object" && "code" in e && typeof e.code === "string" ? e.code : void 0;
            const errorObj = {
              message
            };
            if (code !== void 0) {
              errorObj.code = code;
            }
            sendResponse(void 0, errorObj);
          });
        } else {
          sendResponse(result);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        const code = e && typeof e === "object" && "code" in e && typeof e.code === "string" ? e.code : void 0;
        const errorObj = {
          message
        };
        if (code !== void 0) {
          errorObj.code = code;
        }
        sendResponse(void 0, errorObj);
      }
    }
  };
  /**
   * Strict allowlist of methods that can be invoked via cross-frame messages.
   * Only SCORM API methods and internal helpers are permitted.
   */
  _CrossFrameLMS.ALLOWED_METHODS = /* @__PURE__ */new Set([
  // SCORM 1.2 methods
  "LMSInitialize", "LMSFinish", "LMSGetValue", "LMSSetValue", "LMSCommit", "LMSGetLastError", "LMSGetErrorString", "LMSGetDiagnostic",
  // SCORM 2004 methods
  "Initialize", "Terminate", "GetValue", "SetValue", "Commit", "GetLastError", "GetErrorString", "GetDiagnostic",
  // Internal method for cache warming
  "getFlattenedCMI"]);
  let CrossFrameLMS = _CrossFrameLMS;

  return CrossFrameLMS;

})();
//# sourceMappingURL=cross-frame-lms.js.map
