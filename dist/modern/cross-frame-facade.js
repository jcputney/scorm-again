class CrossFrameLMS {
  /**
   * Constructor
   * @param {BaseAPI} api The API instance to use
   * @param targetOrigin The target origin for postMessage (default: "*")
   */
  constructor(api, targetOrigin) {
    this._targetOrigin = "*";
    this._api = api;
    if (targetOrigin) {
      this._targetOrigin = targetOrigin;
    }
    window.addEventListener("message", this._handleMessage.bind(this));
    this._setupEventForwarding();
  }
  /**
   * Handle messages from the client-side facade
   * @param event The message event
   */
  _handleMessage(event) {
    const data = event.data;
    if (!data || !data.messageId || !data.method) {
      return;
    }
    this._processMessage(data, event.source, event.origin);
  }
  /**
   * Process a message from the client-side facade
   * @param data The message data
   * @param source The source window
   * @param origin The origin of the message
   */
  _processMessage(data, source, origin) {
    const { messageId, method, params, sab } = data;
    let result;
    let error;
    try {
      if (typeof this._api[method] === "function") {
        result = this._api[method](...params);
      } else {
        throw new Error(`Method ${method} not found on API`);
      }
    } catch (e) {
      if (e instanceof Error) {
        error = {
          message: e.message,
          stack: e.stack
        };
      } else {
        error = {
          message: String(e)
        };
      }
    }
    const response = {
      messageId,
      result,
      error,
      sab
    };
    source.postMessage(response, this._targetOrigin, sab ? [sab] : void 0);
  }
  /**
   * Set up event forwarding from the API to the client-side facade
   */
  _setupEventForwarding() {
    this._api.on("*", (event, ...args) => {
      const frames = Array.from(document.querySelectorAll("iframe"));
      frames.forEach((frame) => {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage(
            {
              event,
              args
            },
            this._targetOrigin
          );
        }
      });
    });
  }
}
class CrossFrameAPI {
  /**
   * Constructor
   * @param targetOrigin The target origin for postMessage (default: "*")
   */
  constructor(targetOrigin) {
    this._targetOrigin = "*";
    this._pendingRequests = /* @__PURE__ */ new Map();
    this._eventListeners = /* @__PURE__ */ new Map();
    this._messageIdCounter = 0;
    this._childFrames = /* @__PURE__ */ new Set();
    // Track child frames that have sent messages
    this._isInitialized = false;
    this._lastError = "0";
    this._cache = /* @__PURE__ */ new Map();
    // Cache for synchronous operations
    this._sabBuffers = /* @__PURE__ */ new Map();
    if (targetOrigin) {
      this._targetOrigin = targetOrigin;
    }
    window.addEventListener("message", this._handleMessage.bind(this));
  }
  _syncCall(method, params, timeoutMs = 5e3) {
    try {
      const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
      const int32 = new Int32Array(sab);
      const messageId = `${Date.now()}-sync-${this._messageIdCounter++}`;
      this._sabBuffers.set(messageId, sab);
      window.parent.postMessage({ messageId, method, params, sab }, this._targetOrigin, [sab]);
      const status = Atomics.wait(int32, 0, 0, timeoutMs);
      this._sabBuffers.delete(messageId);
      const pending = this._pendingRequests.get(messageId) || {};
      this._pendingRequests.delete(messageId);
      if (status === "timed-out") {
        throw new Error(`SCORM ${method} timeout after ${timeoutMs}ms`);
      }
      if (pending.error) throw pending.error;
      return pending.result;
    } catch (e) {
      throw e;
    }
  }
  /**
   * Handle messages from the server-side facade and child frames
   * @param event The message event
   */
  _handleMessage(event) {
    const data = event.data;
    const source = event.source;
    const isFromChildFrame = source !== window.parent && source !== window;
    if (data.messageId && (data.result !== void 0 || data.error !== void 0) && !isFromChildFrame) {
      this._handleMethodResponse(data);
    }
    if (data.messageId && data.method && isFromChildFrame) {
      this._childFrames.add(source);
      const { messageId, method, params } = data;
      const forwardedMessageId = `forwarded-${messageId}`;
      this._pendingRequests.set(forwardedMessageId, {
        resolve: (result) => {
          source.postMessage(
            {
              messageId,
              result
            },
            this._targetOrigin
          );
        },
        reject: (error) => {
          source.postMessage(
            {
              messageId,
              error
            },
            this._targetOrigin
          );
        },
        source
      });
      window.parent.postMessage(
        {
          messageId: forwardedMessageId,
          method,
          params
        },
        this._targetOrigin
      );
      setTimeout(() => {
        if (this._pendingRequests.has(forwardedMessageId)) {
          const request = this._pendingRequests.get(forwardedMessageId);
          this._pendingRequests.delete(forwardedMessageId);
          if (request?.source) {
            request.source.postMessage(
              {
                messageId,
                error: {
                  message: `Timeout waiting for response to method ${method}`
                }
              },
              this._targetOrigin
            );
          }
        }
      }, 5e3);
    }
    if (data.event && !isFromChildFrame) {
      this._handleEvent(data.event, ...data.args || []);
      this._forwardEventToChildFrames(data.event, data.args || []);
    }
  }
  /**
   * Handle a method response from the server-side facade
   * @param data The response data
   */
  _handleMethodResponse(data) {
    const { messageId, result, error } = data;
    if (data.sab) {
      const int32 = new Int32Array(data.sab);
      Atomics.store(int32, 0, 1);
      Atomics.notify(int32, 0);
    }
    const pendingRequest = this._pendingRequests.get(messageId);
    if (pendingRequest) {
      const { resolve, reject } = pendingRequest;
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
      this._pendingRequests.delete(messageId);
    }
  }
  /**
   * Handle an event from the server-side facade
   * @param event The event name
   * @param args The event arguments
   */
  _handleEvent(event, ...args) {
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
    const allListeners = this._eventListeners.get("*");
    if (allListeners) {
      allListeners.forEach((listener) => {
        try {
          listener(event, ...args);
        } catch (e) {
          console.error(`Error in "*" event listener for ${event}:`, e);
        }
      });
    }
  }
  /**
   * Forward an event to all child frames
   * @param event The event name
   * @param args The event arguments
   */
  _forwardEventToChildFrames(event, args) {
    this._childFrames.forEach((frame) => {
      try {
        frame.postMessage(
          {
            event,
            args
          },
          this._targetOrigin
        );
      } catch (e) {
        console.error(`Error forwarding event to child frame:`, e);
      }
    });
  }
  /**
   * Send a message to the server-side facade
   * @param method The method to call
   * @param params The parameters to pass to the method
   * @returns A promise that resolves with the result of the method call
   */
  _sendMessage(method, params = []) {
    if (typeof window === "undefined" || typeof window.parent === "undefined" || typeof window.parent.postMessage !== "function") {
      return Promise.resolve("");
    }
    return new Promise((resolve, reject) => {
      const messageId = `${Date.now()}-${this._messageIdCounter++}`;
      this._pendingRequests.set(messageId, { resolve, reject });
      try {
        window.parent.postMessage(
          {
            messageId,
            method,
            params
          },
          this._targetOrigin
        );
        setTimeout(() => {
          if (this._pendingRequests.has(messageId)) {
            this._pendingRequests.delete(messageId);
            reject(new Error(`Timeout waiting for response to method ${method}`));
          }
        }, 5e3);
      } catch (e) {
        this._pendingRequests.delete(messageId);
        reject(e);
      }
    });
  }
  /**
   * Initialize the SCORM API (SCORM 1.2 style) - Asynchronous version
   * @returns Promise that resolves to true if initialization was successful
   */
  async initialize() {
    const result = await this._sendMessage("lmsInitialize");
    this._isInitialized = result === "true";
    return this._isInitialized;
  }
  /**
   * Initialize the SCORM API (SCORM 1.2 style) - Synchronous version
   * @returns "true" if initialization was successful, "false" otherwise
   */
  lmsInitialize() {
    try {
      return String(this._syncCall("lmsInitialize", []));
    } catch (e) {
      this._lastError = "101";
      return "false";
    }
  }
  /**
   * Initialize the SCORM API (SCORM 2004 style) - Asynchronous version
   * @returns Promise that resolves to true if initialization was successful
   */
  async Initialize() {
    return this.initialize();
  }
  /**
   * Initialize the SCORM API (SCORM 2004 style) - Synchronous version
   * @returns "true" if initialization was successful, "false" otherwise
   */
  LMSInitialize() {
    try {
      return String(this._syncCall("LMSInitialize", []));
    } catch (e) {
      this._lastError = "101";
      return "false";
    }
  }
  /**
   * Terminate the SCORM API (SCORM 1.2 style) - Asynchronous version
   * @returns Promise that resolves to true if termination was successful
   */
  async terminate() {
    const result = await this._sendMessage("lmsFinish");
    const success = result === "true";
    if (success) {
      this._isInitialized = false;
    }
    return success;
  }
  /**
   * Terminate the SCORM API (SCORM 1.2 style) - Synchronous version
   * @returns "true" if termination was successful, "false" otherwise
   */
  lmsFinish() {
    try {
      return String(this._syncCall("lmsFinish", []));
    } catch (e) {
      this._lastError = "101";
      return "false";
    }
  }
  /**
   * Terminate the SCORM API (SCORM 2004 style) - Asynchronous version
   * @returns Promise that resolves to true if termination was successful
   */
  async Terminate() {
    return this.terminate();
  }
  /**
   * Terminate the SCORM API (SCORM 2004 style) - Synchronous version
   * @returns "true" if termination was successful, "false" otherwise
   */
  LMSFinish() {
    try {
      return String(this._syncCall("LMSFinish", []));
    } catch (e) {
      this._lastError = "101";
      return "false";
    }
  }
  /**
   * Get a value from the SCORM API (SCORM 1.2 style) - Asynchronous version
   * @param element The CMI element to get
   * @returns Promise that resolves to the value of the CMI element
   */
  async getValue(element) {
    try {
      const result = await this._sendMessage("lmsGetValue", [element]);
      const value = String(result);
      this._cache.set(element, value);
      return value;
    } catch (e) {
      this._lastError = "101";
      console.error(`Error in getValue(${element}):`, e);
      return "";
    }
  }
  /**
   * Get a value from the SCORM API (SCORM 1.2 style) - Synchronous version
   * @param element The CMI element to get
   * @returns The value of the CMI element
   */
  lmsGetValue(element) {
    try {
      return String(this._syncCall("lmsGetValue", [element]));
    } catch (e) {
      this._lastError = "101";
      return "";
    }
  }
  /**
   * Get a value from the SCORM API (SCORM 2004 style) - Asynchronous version
   * @param element The CMI element to get
   * @returns Promise that resolves to the value of the CMI element
   */
  async GetValue(element) {
    return this.getValue(element);
  }
  /**
   * Get a value from the SCORM API (SCORM 2004 style) - Synchronous version
   * @param element The CMI element to get
   * @returns The value of the CMI element
   */
  LMSGetValue(element) {
    try {
      return String(this._syncCall("LMSGetValue", [element]));
    } catch (e) {
      this._lastError = "101";
      return "";
    }
  }
  /**
   * Set a value in the SCORM API (SCORM 1.2 style) - Asynchronous version
   * @param element The CMI element to set
   * @param value The value to set
   * @returns Promise that resolves to true if the value was set successfully
   */
  async setValue(element, value) {
    try {
      const result = await this._sendMessage("lmsSetValue", [element, value]);
      const success = result === "true";
      if (success) {
        this._cache.set(element, String(value));
      }
      return success;
    } catch (e) {
      this._lastError = "101";
      console.error(`Error in setValue(${element}, ${value}):`, e);
      return false;
    }
  }
  /**
   * Set a value in the SCORM API (SCORM 1.2 style) - Synchronous version
   * @param element The CMI element to set
   * @param value The value to set
   * @returns "true" if the value was set successfully, "false" otherwise
   */
  lmsSetValue(element, value) {
    try {
      return String(this._syncCall("lmsSetValue", [element, value]));
    } catch (e) {
      this._lastError = "101";
      return "false";
    }
  }
  /**
   * Set a value in the SCORM API (SCORM 2004 style) - Asynchronous version
   * @param element The CMI element to set
   * @param value The value to set
   * @returns Promise that resolves to true if the value was set successfully
   */
  async SetValue(element, value) {
    return this.setValue(element, value);
  }
  /**
   * Set a value in the SCORM API (SCORM 2004 style) - Synchronous version
   * @param element The CMI element to set
   * @param value The value to set
   * @returns "true" if the value was set successfully, "false" otherwise
   */
  LMSSetValue(element, value) {
    try {
      return String(this._syncCall("LMSSetValue", [element, value]));
    } catch (e) {
      this._lastError = "101";
      return "false";
    }
  }
  /**
   * Commit changes to the LMS (SCORM 1.2 style) - Asynchronous version
   * @returns Promise that resolves to true if the commit was successful
   */
  async commit() {
    try {
      const result = await this._sendMessage("lmsCommit");
      return result === "true";
    } catch (e) {
      this._lastError = "101";
      console.error("Error in commit:", e);
      return false;
    }
  }
  /**
   * Commit changes to the LMS (SCORM 1.2 style) - Synchronous version
   * @returns "true" if the commit was successful, "false" otherwise
   */
  lmsCommit() {
    try {
      return String(this._syncCall("lmsCommit", []));
    } catch (e) {
      this._lastError = "101";
      return "false";
    }
  }
  /**
   * Commit changes to the LMS (SCORM 2004 style) - Asynchronous version
   * @returns Promise that resolves to true if the commit was successful
   */
  async Commit() {
    return this.commit();
  }
  /**
   * Commit changes to the LMS (SCORM 2004 style) - Synchronous version
   * @returns "true" if the commit was successful, "false" otherwise
   */
  LMSCommit() {
    try {
      return String(this._syncCall("LMSCommit", []));
    } catch (e) {
      this._lastError = "101";
      return "false";
    }
  }
  /**
   * Get the last error code (SCORM 1.2 style) - Asynchronous version
   * @returns Promise that resolves to the last error code as a string
   */
  async getLastError() {
    try {
      const result = await this._sendMessage("lmsGetLastError");
      this._lastError = String(result);
      return this._lastError;
    } catch (e) {
      console.error("Error in getLastError:", e);
      return "101";
    }
  }
  /**
   * Get the last error code (SCORM 1.2 style) - Synchronous version
   * @returns The last error code as a string
   */
  lmsGetLastError() {
    try {
      return String(this._syncCall("lmsGetLastError", []));
    } catch (e) {
      return "101";
    }
  }
  /**
   * Get the last error code (SCORM 2004 style) - Asynchronous version
   * @returns Promise that resolves to the last error code as a string
   */
  async GetLastError() {
    return this.getLastError();
  }
  /**
   * Get the last error code (SCORM 2004 style) - Synchronous version
   * @returns The last error code as a string
   */
  LMSGetLastError() {
    try {
      return String(this._syncCall("LMSGetLastError", []));
    } catch (e) {
      return "101";
    }
  }
  /**
   * Get the error string for an error code (SCORM 1.2 style) - Asynchronous version
   * @param errorCode The error code
   * @returns Promise that resolves to the error string
   */
  async getErrorString(errorCode) {
    try {
      const result = await this._sendMessage("lmsGetErrorString", [errorCode]);
      const errorString = String(result);
      this._cache.set(`error_${errorCode}`, errorString);
      return errorString;
    } catch (e) {
      console.error(`Error in getErrorString(${errorCode}):`, e);
      return "";
    }
  }
  /**
   * Get the error string for an error code (SCORM 1.2 style) - Synchronous version
   * @param errorCode The error code
   * @returns The error string
   */
  lmsGetErrorString(errorCode) {
    try {
      return String(this._syncCall("lmsGetErrorString", [errorCode]));
    } catch (e) {
      return "No error";
    }
  }
  /**
   * Get the error string for an error code (SCORM 2004 style) - Asynchronous version
   * @param errorCode The error code
   * @returns Promise that resolves to the error string
   */
  async GetErrorString(errorCode) {
    return this.getErrorString(errorCode);
  }
  /**
   * Get the error string for an error code (SCORM 2004 style) - Synchronous version
   * @param errorCode The error code
   * @returns The error string
   */
  LMSGetErrorString(errorCode) {
    try {
      return String(this._syncCall("LMSGetErrorString", [errorCode]));
    } catch (e) {
      return "No error";
    }
  }
  /**
   * Get diagnostic information for an error code (SCORM 1.2 style) - Asynchronous version
   * @param errorCode The error code
   * @returns Promise that resolves to the diagnostic information
   */
  async getDiagnostic(errorCode) {
    try {
      const result = await this._sendMessage("lmsGetDiagnostic", [errorCode]);
      const diagnostic = String(result);
      this._cache.set(`diagnostic_${errorCode}`, diagnostic);
      return diagnostic;
    } catch (e) {
      console.error(`Error in getDiagnostic(${errorCode}):`, e);
      return "";
    }
  }
  /**
   * Get diagnostic information for an error code (SCORM 1.2 style) - Synchronous version
   * @param errorCode The error code
   * @returns The diagnostic information
   */
  lmsGetDiagnostic(errorCode) {
    try {
      return String(this._syncCall("lmsGetDiagnostic", [errorCode]));
    } catch (e) {
      return "No diagnostic information available";
    }
  }
  /**
   * Get diagnostic information for an error code (SCORM 2004 style) - Asynchronous version
   * @param errorCode The error code
   * @returns Promise that resolves to the diagnostic information
   */
  async GetDiagnostic(errorCode) {
    return this.getDiagnostic(errorCode);
  }
  /**
   * Get diagnostic information for an error code (SCORM 2004 style) - Synchronous version
   * @param errorCode The error code
   * @returns The diagnostic information
   */
  LMSGetDiagnostic(errorCode) {
    try {
      return String(this._syncCall("LMSGetDiagnostic", [errorCode]));
    } catch (e) {
      return "No diagnostic information available";
    }
  }
  /**
   * Check if the API is currently initialized - Asynchronous version
   * @returns Promise that resolves to true if the API is initialized
   */
  async isInitialized() {
    try {
      const result = await this._sendMessage("isInitialized");
      this._isInitialized = Boolean(result);
      return this._isInitialized;
    } catch (e) {
      console.error("Error in isInitialized:", e);
      return this._isInitialized;
    }
  }
  /**
   * Check if the API is currently initialized - Synchronous version
   * @returns True if the API is initialized, false otherwise
   */
  getIsInitialized() {
    return this._isInitialized;
  }
  /**
   * Register an event listener
   * @param event The event name
   * @param callback The callback function
   */
  on(event, callback) {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, /* @__PURE__ */ new Set());
    }
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      listeners.add(callback);
    }
  }
  /**
   * Remove an event listener
   * @param event The event name
   * @param callback The callback function
   */
  off(event, callback) {
    const listeners = this._eventListeners.get(event);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this._eventListeners.delete(event);
      }
    }
  }
}
function createCrossFrameServer(api, targetOrigin) {
  return new CrossFrameLMS(api, targetOrigin);
}
function createCrossFrameClient(targetOrigin) {
  return new CrossFrameAPI(targetOrigin);
}

export { CrossFrameAPI, CrossFrameLMS, createCrossFrameClient, createCrossFrameServer };
//# sourceMappingURL=cross-frame-facade.js.map
