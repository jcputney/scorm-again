/**
 * CrossFrameFacade.ts
 *
 * This file implements a cross-frame facade for the scorm-again API.
 * It allows communication between frames from different domains using the postMessage API.
 */

import BaseAPI from "../BaseAPI";

/**
 * Type for the message data
 */
export type MessageData = {
  messageId: string;
  method: string;
  params: unknown[];
  sab?: SharedArrayBuffer;
};

/**
 * Type for the message response
 */
export type MessageResponse = {
  messageId: string;
  result?: unknown;
  error?: {
    message: string;
    stack?: string;
  };
  sab?: SharedArrayBuffer;
};

/**
 * Interface for the CrossFrameFacade
 */
export interface ICrossFrameFacade {
  /**
   * Initialize the SCORM API (SCORM 1.2 style) - Asynchronous version
   * @returns Promise that resolves to true if initialization was successful
   */
  initialize(): Promise<boolean>;

  /**
   * Initialize the SCORM API (SCORM 1.2 style) - Synchronous version
   * @returns "true" if initialization was successful, "false" otherwise
   */
  lmsInitialize(): string;

  /**
   * Initialize the SCORM API (SCORM 2004 style) - Asynchronous version
   * @returns Promise that resolves to true if initialization was successful
   */
  Initialize(): Promise<boolean>;

  /**
   * Initialize the SCORM API (SCORM 2004 style) - Synchronous version
   * @returns "true" if initialization was successful, "false" otherwise
   */
  LMSInitialize(): string;

  /**
   * Terminate the SCORM API (SCORM 1.2 style) - Asynchronous version
   * @returns Promise that resolves to true if termination was successful
   */
  terminate(): Promise<boolean>;

  /**
   * Terminate the SCORM API (SCORM 1.2 style) - Synchronous version
   * @returns "true" if termination was successful, "false" otherwise
   */
  lmsFinish(): string;

  /**
   * Terminate the SCORM API (SCORM 2004 style) - Asynchronous version
   * @returns Promise that resolves to true if termination was successful
   */
  Terminate(): Promise<boolean>;

  /**
   * Terminate the SCORM API (SCORM 2004 style) - Synchronous version
   * @returns "true" if termination was successful, "false" otherwise
   */
  LMSFinish(): string;

  /**
   * Get a value from the SCORM API (SCORM 1.2 style) - Asynchronous version
   * @param element The CMI element to get
   * @returns Promise that resolves to the value of the CMI element
   */
  getValue(element: string): Promise<string>;

  /**
   * Get a value from the SCORM API (SCORM 1.2 style) - Synchronous version
   * @param element The CMI element to get
   * @returns The value of the CMI element
   */
  lmsGetValue(element: string): string;

  /**
   * Get a value from the SCORM API (SCORM 2004 style) - Asynchronous version
   * @param element The CMI element to get
   * @returns Promise that resolves to the value of the CMI element
   */
  GetValue(element: string): Promise<string>;

  /**
   * Get a value from the SCORM API (SCORM 2004 style) - Synchronous version
   * @param element The CMI element to get
   * @returns The value of the CMI element
   */
  LMSGetValue(element: string): string;

  /**
   * Set a value in the SCORM API (SCORM 1.2 style) - Asynchronous version
   * @param element The CMI element to set
   * @param value The value to set
   * @returns Promise that resolves to true if the value was set successfully
   */
  setValue(element: string, value: string | number | boolean): Promise<boolean>;

  /**
   * Set a value in the SCORM API (SCORM 1.2 style) - Synchronous version
   * @param element The CMI element to set
   * @param value The value to set
   * @returns "true" if the value was set successfully, "false" otherwise
   */
  lmsSetValue(element: string, value: string | number | boolean): string;

  /**
   * Set a value in the SCORM API (SCORM 2004 style) - Asynchronous version
   * @param element The CMI element to set
   * @param value The value to set
   * @returns Promise that resolves to true if the value was set successfully
   */
  SetValue(element: string, value: string | number | boolean): Promise<boolean>;

  /**
   * Set a value in the SCORM API (SCORM 2004 style) - Synchronous version
   * @param element The CMI element to set
   * @param value The value to set
   * @returns "true" if the value was set successfully, "false" otherwise
   */
  LMSSetValue(element: string, value: string | number | boolean): string;

  /**
   * Commit changes to the LMS (SCORM 1.2 style) - Asynchronous version
   * @returns Promise that resolves to true if the commit was successful
   */
  commit(): Promise<boolean>;

  /**
   * Commit changes to the LMS (SCORM 1.2 style) - Synchronous version
   * @returns "true" if the commit was successful, "false" otherwise
   */
  lmsCommit(): string;

  /**
   * Commit changes to the LMS (SCORM 2004 style) - Asynchronous version
   * @returns Promise that resolves to true if the commit was successful
   */
  Commit(): Promise<boolean>;

  /**
   * Commit changes to the LMS (SCORM 2004 style) - Synchronous version
   * @returns "true" if the commit was successful, "false" otherwise
   */
  LMSCommit(): string;

  /**
   * Get the last error code (SCORM 1.2 style) - Asynchronous version
   * @returns Promise that resolves to the last error code as a string
   */
  getLastError(): Promise<string>;

  /**
   * Get the last error code (SCORM 1.2 style) - Synchronous version
   * @returns The last error code as a string
   */
  lmsGetLastError(): string;

  /**
   * Get the last error code (SCORM 2004 style) - Asynchronous version
   * @returns Promise that resolves to the last error code as a string
   */
  GetLastError(): Promise<string>;

  /**
   * Get the last error code (SCORM 2004 style) - Synchronous version
   * @returns The last error code as a string
   */
  LMSGetLastError(): string;

  /**
   * Get the error string for an error code (SCORM 1.2 style) - Asynchronous version
   * @param errorCode The error code
   * @returns Promise that resolves to the error string
   */
  getErrorString(errorCode: string | number): Promise<string>;

  /**
   * Get the error string for an error code (SCORM 1.2 style) - Synchronous version
   * @param errorCode The error code
   * @returns The error string
   */
  lmsGetErrorString(errorCode: string | number): string;

  /**
   * Get the error string for an error code (SCORM 2004 style) - Asynchronous version
   * @param errorCode The error code
   * @returns Promise that resolves to the error string
   */
  GetErrorString(errorCode: string | number): Promise<string>;

  /**
   * Get the error string for an error code (SCORM 2004 style) - Synchronous version
   * @param errorCode The error code
   * @returns The error string
   */
  LMSGetErrorString(errorCode: string | number): string;

  /**
   * Get diagnostic information for an error code (SCORM 1.2 style) - Asynchronous version
   * @param errorCode The error code
   * @returns Promise that resolves to the diagnostic information
   */
  getDiagnostic(errorCode: string | number): Promise<string>;

  /**
   * Get diagnostic information for an error code (SCORM 1.2 style) - Synchronous version
   * @param errorCode The error code
   * @returns The diagnostic information
   */
  lmsGetDiagnostic(errorCode: string | number): string;

  /**
   * Get diagnostic information for an error code (SCORM 2004 style) - Asynchronous version
   * @param errorCode The error code
   * @returns Promise that resolves to the diagnostic information
   */
  GetDiagnostic(errorCode: string | number): Promise<string>;

  /**
   * Get diagnostic information for an error code (SCORM 2004 style) - Synchronous version
   * @param errorCode The error code
   * @returns The diagnostic information
   */
  LMSGetDiagnostic(errorCode: string | number): string;

  /**
   * Check if the API is currently initialized - Asynchronous version
   * @returns Promise that resolves to true if the API is initialized
   */
  isInitialized(): Promise<boolean>;

  /**
   * Check if the API is currently initialized - Synchronous version
   * @returns True if the API is initialized, false otherwise
   */
  getIsInitialized(): boolean;

  /**
   * Register an event listener
   * @param event The event name
   * @param callback The callback function
   */
  on(event: string, callback: (...args: unknown[]) => void): void;

  /**
   * Remove an event listener
   * @param event The event name
   * @param callback The callback function
   */
  off(event: string, callback: (...args: unknown[]) => void): void;
}

/**
 * Server-side facade that runs in the parent frame where the API is initialized.
 * This facade listens for messages from the client-side facade and proxies them to the actual API.
 */
export class CrossFrameLMS {
  private readonly _api: BaseAPI;
  private readonly _targetOrigin: string = "*";

  /**
   * Constructor
   * @param {BaseAPI} api The API instance to use
   * @param targetOrigin The target origin for postMessage (default: "*")
   */
  constructor(api: BaseAPI, targetOrigin?: string) {
    this._api = api;

    // Set target origin if provided
    if (targetOrigin) {
      this._targetOrigin = targetOrigin;
    }

    // Listen for messages from the client-side facade
    window.addEventListener("message", this._handleMessage.bind(this));

    // Set up event forwarding
    this._setupEventForwarding();
  }

  /**
   * Handle messages from the client-side facade
   * @param event The message event
   */
  private _handleMessage(event: MessageEvent) {
    const data = event.data as MessageData;

    // Ignore messages that don't have the expected format
    if (!data || !data.messageId || !data.method) {
      return;
    }

    // Process the message
    this._processMessage(data, event.source as Window, event.origin);
  }

  /**
   * Process a message from the client-side facade
   * @param data The message data
   * @param source The source window
   * @param origin The origin of the message
   */
  private _processMessage(data: MessageData, source: Window, origin: string) {
    const { messageId, method, params, sab } = data;
    let result: any;
    let error: any;

    try {
      // Call the appropriate method on the API
      if (typeof (this._api as unknown as Record<string, Function>)[method] === "function") {
        result = (this._api as unknown as Record<string, Function>)[method](...params);
      } else {
        throw new Error(`Method ${method} not found on API`);
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        error = {
          message: e.message,
          stack: e.stack,
        };
      } else {
        error = {
          message: String(e),
        };
      }
    }

    // Send the response back to the client-side facade
    const response: MessageResponse = {
      messageId,
      result,
      error,
      sab,
    };

    source.postMessage(response, this._targetOrigin, sab ? [sab] : undefined);
  }

  /**
   * Set up event forwarding from the API to the client-side facade
   */
  private _setupEventForwarding() {
    // Get all frames that might contain client-side facades
    const frames = Array.from(document.querySelectorAll("iframe"));

    // Forward all events from the API to the client-side facades
    this._api.on("*", (event: string, ...args: any[]) => {
      // Send the event to all frames
      frames.forEach((frame) => {
        if (frame.contentWindow) {
          frame.contentWindow.postMessage(
            {
              event,
              args,
            },
            this._targetOrigin,
          );
        }
      });
    });
  }
}

/**
 * Client-side facade that runs in the child frame where the module is loaded.
 * This facade sends messages to the server-side facade and provides the same interface as the actual API.
 */
export class CrossFrameAPI implements ICrossFrameFacade {
  private _targetOrigin: string = "*";
  private _pendingRequests: Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
      source?: Window; // Source window for forwarding responses
    }
  > = new Map();
  private _eventListeners: Map<string, Set<(...args: unknown[]) => void>> = new Map();
  private _messageIdCounter: number = 0;
  private _childFrames: Set<Window> = new Set(); // Track child frames that have sent messages
  private _isInitialized: boolean = false;
  private _lastError: string = "0";
  private _cache: Map<string, string> = new Map(); // Cache for synchronous operations
  private _sabBuffers: Map<string, SharedArrayBuffer> = new Map();

  private _syncCall(method: string, params: any[], timeoutMs = 5000): any {
    const sab = new SharedArrayBuffer(Int32Array.BYTES_PER_ELEMENT);
    const int32 = new Int32Array(sab);
    const messageId = `${Date.now()}-sync-${this._messageIdCounter++}`;
    // store sab for matching responses
    this._sabBuffers.set(messageId, sab);
    // send the call, transferring sab
    window.parent.postMessage({ messageId, method, params, sab }, this._targetOrigin, [sab]);
    // block until notified
    const status = Atomics.wait(int32, 0, 0, timeoutMs);
    // cleanup
    this._sabBuffers.delete(messageId);
    const pending = this._pendingRequests.get(messageId) || {};
    this._pendingRequests.delete(messageId);
    if (status === "timed-out") {
      throw new Error(`SCORM ${method} timeout after ${timeoutMs}ms`);
    }
    if ((pending as any).error) throw (pending as any).error;
    return (pending as any).result;
  }

  /**
   * Constructor
   * @param targetOrigin The target origin for postMessage (default: "*")
   */
  constructor(targetOrigin?: string) {
    // Set target origin if provided
    if (targetOrigin) {
      this._targetOrigin = targetOrigin;
    }

    // Listen for messages from the server-side facade and child frames
    window.addEventListener("message", this._handleMessage.bind(this));
  }

  /**
   * Handle messages from the server-side facade and child frames
   * @param event The message event
   */
  private _handleMessage(event: MessageEvent) {
    const data = event.data;
    const source = event.source as Window;

    // Check if the message is from a child frame
    const isFromChildFrame = source !== window.parent && source !== window;

    // Handle method responses from parent frame
    if (
      data.messageId &&
      (data.result !== undefined || data.error !== undefined) &&
      !isFromChildFrame
    ) {
      this._handleMethodResponse(data);
    }

    // Handle method requests from child frames
    if (data.messageId && data.method && isFromChildFrame) {
      // Add the child frame to our set of known frames
      this._childFrames.add(source);

      // Forward the message to the parent frame, but keep track of the source
      const { messageId, method, params } = data;
      const forwardedMessageId = `forwarded-${messageId}`;

      // Store the promise callbacks with the source window
      this._pendingRequests.set(forwardedMessageId, {
        resolve: (result) => {
          // Forward the result back to the child frame
          source.postMessage(
            {
              messageId,
              result,
            },
            this._targetOrigin,
          );
        },
        reject: (error) => {
          // Forward the error back to the child frame
          source.postMessage(
            {
              messageId,
              error,
            },
            this._targetOrigin,
          );
        },
        source,
      });

      // Forward the message to the parent frame
      window.parent.postMessage(
        {
          messageId: forwardedMessageId,
          method,
          params,
        },
        this._targetOrigin,
      );

      // Set a timeout to clean up if no response is received
      setTimeout(() => {
        if (this._pendingRequests.has(forwardedMessageId)) {
          const request = this._pendingRequests.get(forwardedMessageId);
          this._pendingRequests.delete(forwardedMessageId);
          if (request?.source) {
            request.source.postMessage(
              {
                messageId,
                error: {
                  message: `Timeout waiting for response to method ${method}`,
                },
              },
              this._targetOrigin,
            );
          }
        }
      }, 5000);
    }

    // Handle events from parent frame
    if (data.event && !isFromChildFrame) {
      this._handleEvent(data.event, ...(data.args || []));

      // Forward events to child frames
      this._forwardEventToChildFrames(data.event, data.args || []);
    }
  }

  /**
   * Handle a method response from the server-side facade
   * @param data The response data
   */
  private _handleMethodResponse(data: MessageResponse) {
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
  private _handleEvent(event: string, ...args: any[]) {
    const listeners = this._eventListeners.get(event);

    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (e: unknown) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }

    // Also trigger listeners for the "*" event
    const allListeners = this._eventListeners.get("*");

    if (allListeners) {
      allListeners.forEach((listener) => {
        try {
          listener(event, ...args);
        } catch (e: unknown) {
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
  private _forwardEventToChildFrames(event: string, args: unknown[]) {
    // Send the event to all child frames
    this._childFrames.forEach((frame) => {
      try {
        frame.postMessage(
          {
            event,
            args,
          },
          this._targetOrigin,
        );
      } catch (e: unknown) {
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
  private _sendMessage(
    method: string,
    params: (string | number | boolean)[] = [],
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const messageId = `${Date.now()}-${this._messageIdCounter++}`;

      // Store the promise callbacks
      this._pendingRequests.set(messageId, { resolve, reject });

      // Send the message to the parent frame
      window.parent.postMessage(
        {
          messageId,
          method,
          params,
        },
        this._targetOrigin,
      );

      // Set a timeout to reject the promise if no response is received
      setTimeout(() => {
        if (this._pendingRequests.has(messageId)) {
          this._pendingRequests.delete(messageId);
          reject(new Error(`Timeout waiting for response to method ${method}`));
        }
      }, 5000);
    });
  }

  /**
   * Initialize the SCORM API (SCORM 1.2 style) - Asynchronous version
   * @returns Promise that resolves to true if initialization was successful
   */
  async initialize(): Promise<boolean> {
    const result = await this._sendMessage("lmsInitialize");
    this._isInitialized = result === "true";
    return this._isInitialized;
  }

  /**
   * Initialize the SCORM API (SCORM 1.2 style) - Synchronous version
   * @returns "true" if initialization was successful, "false" otherwise
   */
  lmsInitialize(): string {
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
  async Initialize(): Promise<boolean> {
    return this.initialize();
  }

  /**
   * Initialize the SCORM API (SCORM 2004 style) - Synchronous version
   * @returns "true" if initialization was successful, "false" otherwise
   */
  LMSInitialize(): string {
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
  async terminate(): Promise<boolean> {
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
  lmsFinish(): string {
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
  async Terminate(): Promise<boolean> {
    return this.terminate();
  }

  /**
   * Terminate the SCORM API (SCORM 2004 style) - Synchronous version
   * @returns "true" if termination was successful, "false" otherwise
   */
  LMSFinish(): string {
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
  async getValue(element: string): Promise<string> {
    try {
      const result = await this._sendMessage("lmsGetValue", [element]);
      const value = String(result);
      // Cache the result for synchronous operations
      this._cache.set(element, value);
      return value;
    } catch (e) {
      this._lastError = "101"; // General exception
      console.error(`Error in getValue(${element}):`, e);
      return "";
    }
  }

  /**
   * Get a value from the SCORM API (SCORM 1.2 style) - Synchronous version
   * @param element The CMI element to get
   * @returns The value of the CMI element
   */
  lmsGetValue(element: string): string {
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
  async GetValue(element: string): Promise<string> {
    return this.getValue(element);
  }

  /**
   * Get a value from the SCORM API (SCORM 2004 style) - Synchronous version
   * @param element The CMI element to get
   * @returns The value of the CMI element
   */
  LMSGetValue(element: string): string {
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
  async setValue(element: string, value: string | number | boolean): Promise<boolean> {
    try {
      const result = await this._sendMessage("lmsSetValue", [element, value]);
      const success = result === "true";
      if (success) {
        // Update the cache with the new value
        this._cache.set(element, String(value));
      }
      return success;
    } catch (e) {
      this._lastError = "101"; // General exception
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
  lmsSetValue(element: string, value: string | number | boolean): string {
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
  async SetValue(element: string, value: string | number | boolean): Promise<boolean> {
    return this.setValue(element, value);
  }

  /**
   * Set a value in the SCORM API (SCORM 2004 style) - Synchronous version
   * @param element The CMI element to set
   * @param value The value to set
   * @returns "true" if the value was set successfully, "false" otherwise
   */
  LMSSetValue(element: string, value: string | number | boolean): string {
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
  async commit(): Promise<boolean> {
    try {
      const result = await this._sendMessage("lmsCommit");
      return result === "true";
    } catch (e) {
      this._lastError = "101"; // General exception
      console.error("Error in commit:", e);
      return false;
    }
  }

  /**
   * Commit changes to the LMS (SCORM 1.2 style) - Synchronous version
   * @returns "true" if the commit was successful, "false" otherwise
   */
  lmsCommit(): string {
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
  async Commit(): Promise<boolean> {
    return this.commit();
  }

  /**
   * Commit changes to the LMS (SCORM 2004 style) - Synchronous version
   * @returns "true" if the commit was successful, "false" otherwise
   */
  LMSCommit(): string {
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
  async getLastError(): Promise<string> {
    try {
      const result = await this._sendMessage("lmsGetLastError");
      this._lastError = String(result);
      return this._lastError;
    } catch (e) {
      console.error("Error in getLastError:", e);
      return "101"; // General exception
    }
  }

  /**
   * Get the last error code (SCORM 1.2 style) - Synchronous version
   * @returns The last error code as a string
   */
  lmsGetLastError(): string {
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
  async GetLastError(): Promise<string> {
    return this.getLastError();
  }

  /**
   * Get the last error code (SCORM 2004 style) - Synchronous version
   * @returns The last error code as a string
   */
  LMSGetLastError(): string {
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
  async getErrorString(errorCode: string | number): Promise<string> {
    try {
      const result = await this._sendMessage("lmsGetErrorString", [errorCode]);
      const errorString = String(result);
      // Cache the result for synchronous operations
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
  lmsGetErrorString(errorCode: string | number): string {
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
  async GetErrorString(errorCode: string | number): Promise<string> {
    return this.getErrorString(errorCode);
  }

  /**
   * Get the error string for an error code (SCORM 2004 style) - Synchronous version
   * @param errorCode The error code
   * @returns The error string
   */
  LMSGetErrorString(errorCode: string | number): string {
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
  async getDiagnostic(errorCode: string | number): Promise<string> {
    try {
      const result = await this._sendMessage("lmsGetDiagnostic", [errorCode]);
      const diagnostic = String(result);
      // Cache the result for synchronous operations
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
  lmsGetDiagnostic(errorCode: string | number): string {
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
  async GetDiagnostic(errorCode: string | number): Promise<string> {
    return this.getDiagnostic(errorCode);
  }

  /**
   * Get diagnostic information for an error code (SCORM 2004 style) - Synchronous version
   * @param errorCode The error code
   * @returns The diagnostic information
   */
  LMSGetDiagnostic(errorCode: string | number): string {
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
  async isInitialized(): Promise<boolean> {
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
  getIsInitialized(): boolean {
    // Start the asynchronous operation in the background to update _isInitialized
    (async () => {
      try {
        await this.isInitialized();
      } catch (e) {
        console.error("Error in getIsInitialized:", e);
      }
    })();

    // Return the current value of _isInitialized
    return this._isInitialized;
  }

  /**
   * Register an event listener
   * @param event The event name
   * @param callback The callback function
   */
  on(event: string, callback: (...args: unknown[]) => void): void {
    if (!this._eventListeners.has(event)) {
      this._eventListeners.set(event, new Set());
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
  off(event: string, callback: (...args: unknown[]) => void): void {
    const listeners = this._eventListeners.get(event);

    if (listeners) {
      listeners.delete(callback);

      if (listeners.size === 0) {
        this._eventListeners.delete(event);
      }
    }
  }
}

/**
 * Factory function to create a CrossFrameServer instance
 * @param {BaseAPI} api The API instance to use
 * @param targetOrigin The target origin for postMessage
 * @returns A CrossFrameServer instance
 */
export function createCrossFrameServer(api: BaseAPI, targetOrigin?: string): CrossFrameLMS {
  return new CrossFrameLMS(api, targetOrigin);
}

/**
 * Factory function to create a CrossFrameClient instance
 * @param targetOrigin The target origin for postMessage
 * @returns A CrossFrameClient instance
 */
export function createCrossFrameClient(targetOrigin?: string): CrossFrameAPI {
  return new CrossFrameAPI(targetOrigin);
}
