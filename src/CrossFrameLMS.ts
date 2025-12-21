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
   * Handles incoming postMessage events from child frames.
   */
  private _onMessage(ev: MessageEvent): void {
    // Ignore messages if destroyed
    if (this._destroyed) return;

    // Validate the message origin unless all origins are allowed
    if (this._origin !== "*" && ev.origin !== this._origin) {
      return;
    }

    // CF-LMS-02: Validate that ev.data is a valid message object before casting
    if (typeof ev.data !== "object" || ev.data === null) return;

    const msg = ev.data as MessageData;
    if (!msg?.messageId || !msg.method || !ev.source) return;

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

      const result = fn.apply(this._api, msg.params);

      if (result && typeof (result as Promise<unknown>).then === "function") {
        (result as Promise<unknown>)
          .then((r) => sendResponse(r))
          .catch((e: unknown) => {
            const message = e instanceof Error ? e.message : "Unknown error";
            sendResponse(undefined, { message });
          });
      } else {
        sendResponse(result);
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Unknown error";
      sendResponse(undefined, { message });
    }
  }
}
