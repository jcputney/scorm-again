// src/CrossFrameLMS.ts
import { CrossFrameLMSOptions, MessageData, MessageResponse } from "./types/CrossFrame";
import { IBaseAPI } from "./interfaces/IBaseAPI";

/**
 * Server-side SCORM adapter running in your LMS frame (lms.example.com).
 * Listens for postMessage from child (content) frames, invokes real API,
 * and posts back { messageId, result, error }.
 */
export default class CrossFrameLMS {
  private readonly _api: IBaseAPI;
  private readonly _origin: string;
  private readonly _rateLimit: number;
  private _requestTimes: number[] = [];
  private _destroyed = false;
  private readonly _boundOnMessage: (ev: MessageEvent) => void;

  /**
   * Strict allowlist of methods that can be invoked via cross-frame messages.
   * Only SCORM API methods and internal helpers are permitted.
   */
  private static readonly ALLOWED_METHODS = new Set([
    // SCORM 1.2 methods
    "LMSInitialize",
    "LMSFinish",
    "LMSGetValue",
    "LMSSetValue",
    "LMSCommit",
    "LMSGetLastError",
    "LMSGetErrorString",
    "LMSGetDiagnostic",
    // SCORM 2004 methods
    "Initialize",
    "Terminate",
    "GetValue",
    "SetValue",
    "Commit",
    "GetLastError",
    "GetErrorString",
    "GetDiagnostic",
    // Internal method for cache warming
    "getFlattenedCMI",
  ]);

  /**
   * Creates a new CrossFrameLMS instance.
   * @param api - The SCORM API instance to delegate calls to
   * @param targetOrigin - Origin to accept messages from. Default "*" accepts all origins.
   * @param options - Configuration options
   */
  constructor(api: IBaseAPI, targetOrigin: string = "*", options: CrossFrameLMSOptions = {}) {
    this._api = api;
    this._origin = targetOrigin;
    this._rateLimit = options.rateLimit ?? 100;

    // Warn about wildcard origin security implications
    if (targetOrigin === "*") {
      console.warn(
        "CrossFrameLMS: Using wildcard origin ('*') allows any origin to send messages. " +
          "This is insecure for production use. " +
          "Specify an explicit origin (e.g., 'https://content.example.com') to restrict message sources.",
      );
    }

    this._boundOnMessage = this._onMessage.bind(this);
    window.addEventListener("message", this._boundOnMessage);
  }

  /**
   * Destroys this instance, removing event listeners and preventing further message processing.
   * Once destroyed, the instance cannot be reused.
   */
  destroy(): void {
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
  private _isRateLimited(): boolean {
    const now = Date.now();
    // Remove requests older than 1 second
    this._requestTimes = this._requestTimes.filter((t) => now - t < 1000);
    if (this._requestTimes.length >= this._rateLimit) {
      return true;
    }
    this._requestTimes.push(now);
    return false;
  }

  /**
   * Type guard to validate MessageData structure
   */
  private static _isValidMessageData(data: unknown): data is MessageData {
    if (typeof data !== "object" || data === null) return false;

    const msg = data as Partial<MessageData>;

    // Required fields
    if (typeof msg.messageId !== "string" || msg.messageId.length === 0) return false;
    if (typeof msg.method !== "string" || msg.method.length === 0) return false;

    // params must be an array if present (required for apply())
    if (msg.params !== undefined && !Array.isArray(msg.params)) return false;

    // isHeartbeat must be boolean if present
    if (msg.isHeartbeat !== undefined && typeof msg.isHeartbeat !== "boolean") return false;

    return true;
  }

  /**
   * Handles incoming postMessage events from child frames.
   */
  private _onMessage(ev: MessageEvent): void {
    // Ignore messages if destroyed
    if (this._destroyed) return;

    // Validate the message origin unless all origins are allowed
    if (this._origin !== "*" && ev.origin !== this._origin) {
      return;
    }

    // CF-LMS-02: Validate that ev.data has the expected MessageData structure
    if (!CrossFrameLMS._isValidMessageData(ev.data)) return;

    const msg = ev.data;
    if (!ev.source) return;

    // Validate that ev.source is a Window with postMessage capability
    // ev.source can be Window, MessagePort, ServiceWorker, or null
    // We only handle Window sources for iframe communication
    if (!("postMessage" in ev.source)) return;

    const source = ev.source as Window;

    // Handle heartbeat separately (bypass rate limit and allowlist)
    if (msg.isHeartbeat) {
      const resp: MessageResponse = {
        messageId: msg.messageId,
        isHeartbeat: true,
      };
      source.postMessage(resp, this._origin);
      return;
    }

    // Check rate limit
    if (this._isRateLimited()) {
      // SCORM ERROR CODE USAGE: Using error code "101" for rate limiting
      //
      // While not a standard SCORM error code, "101" is used here to signal rate limiting
      // in cross-frame communication. Standard SCORM error codes are:
      // - SCORM 1.2: 0, 101, 201, 202, 203, 301, 401, 402, 403, 404, 405
      // - SCORM 2004: 0, 101, 102, 103, 201, 301, 351, 391, 401-408
      //
      // Using "101" (General Exception) is appropriate here because:
      // 1. It indicates a general error condition without exposing security details
      // 2. It's recognized by SCORM content as a non-zero error code
      // 3. It doesn't conflict with specific SCORM error semantics
      // 4. The actual error message "Rate limit exceeded" provides debug context
      //
      // The CrossFrameAPI detects this specific message to emit a "rateLimited" event,
      // allowing content to react appropriately (e.g., back off, show user message).
      const resp: MessageResponse = {
        messageId: msg.messageId,
        error: { message: "Rate limit exceeded", code: "101" },
      };
      source.postMessage(resp, this._origin);
      return;
    }

    // Check method allowlist
    if (!CrossFrameLMS.ALLOWED_METHODS.has(msg.method)) {
      const resp: MessageResponse = {
        messageId: msg.messageId,
        error: { message: `Method not allowed: ${msg.method}`, code: "101" },
      };
      source.postMessage(resp, this._origin);
      return;
    }

    this._process(msg, source);
  }

  /**
   * Processes a validated message by invoking the requested API method.
   */
  private _process(msg: MessageData, source: Window): void {
    const sendResponse = (result?: unknown, error?: { message: string; code?: string }) => {
      const resp: MessageResponse = { messageId: msg.messageId };
      if (result !== undefined) resp.result = result;
      if (error !== undefined) resp.error = error;
      source.postMessage(resp, this._origin);
    };

    try {
      const fn = (this._api as unknown as Record<string, unknown>)[msg.method];
      if (typeof fn !== "function") {
        sendResponse(undefined, { message: `Method ${msg.method} not found` });
        return;
      }

      // CF-LMS-01: Validate params is an array before apply()
      // This should never fail due to _isValidMessageData check, but defense in depth
      const params = Array.isArray(msg.params) ? msg.params : [];

      const result = fn.apply(this._api, params);

      if (result && typeof (result as Promise<unknown>).then === "function") {
        (result as Promise<unknown>)
          .then((r) => sendResponse(r))
          .catch((e: unknown) => {
            // ERROR CODE PRESERVATION: Extract error code from Error objects
            // SCORM API errors may include a numeric code property for specific error conditions.
            // We preserve this code to maintain proper error semantics across the cross-frame boundary.
            const message = e instanceof Error ? e.message : "Unknown error";
            const code =
              e && typeof e === "object" && "code" in e && typeof e.code === "string"
                ? e.code
                : undefined;
            const errorObj: { message: string; code?: string } = { message };
            if (code !== undefined) {
              errorObj.code = code;
            }
            sendResponse(undefined, errorObj);
          });
      } else {
        sendResponse(result);
      }
    } catch (e: unknown) {
      // ERROR CODE PRESERVATION: Extract error code from Error objects
      // SCORM API errors may include a numeric code property for specific error conditions.
      // We preserve this code to maintain proper error semantics across the cross-frame boundary.
      const message = e instanceof Error ? e.message : "Unknown error";
      const code =
        e && typeof e === "object" && "code" in e && typeof e.code === "string"
          ? e.code
          : undefined;
      const errorObj: { message: string; code?: string } = { message };
      if (code !== undefined) {
        errorObj.code = code;
      }
      sendResponse(undefined, errorObj);
    }
  }
}
