// src/CrossFrameAPI.ts
import { MessageData, MessageResponse } from "./types/CrossFrame";
import { global_errors } from "./constants/error_codes";

/**
 * Client-side SCORM façade running in your content frame.
 * Returns cached/default values synchronously, then fires off an async
 * postMessage to the LMS frame to refresh cache and error state.
 */
export default class CrossFrameAPI {
  private _cache = new Map<string, string>();
  private _lastError = "0";
  private _pending = new Map<string, { resolve: (v: any) => void; reject: (e: any) => void }>();
  private _counter = 0;
  private readonly _origin: string;
  private readonly _targetWindow: Window;

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
      const isSet = methodName.startsWith("LMSSet") || methodName.endsWith("SetValue");
      const isInit = methodName === "Initialize" || methodName === "LMSInitialize";
      const isFinish = methodName === "Terminate" || methodName === "LMSFinish";
      const isCommit = methodName === "Commit" || methodName === "LMSCommit";
      const isErrorString = methodName === "GetErrorString" || methodName === "LMSGetErrorString";
      const isDiagnostic = methodName === "GetDiagnostic" || methodName === "LMSGetDiagnostic";

      return (...args: any[]): string => {
        // Synchronous cache update for setter calls
        if (isSet && args.length >= 2) {
          target._cache.set(args[0], String(args[1]));
          target._lastError = "0";
        }

        // Fire off async postMessage to refresh cache and error
        target
          ._post(methodName, args)
          .then((res) => {
            if (isGet && args.length >= 1) {
              target._cache.set(args[0], String(res));
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
          })
          .catch((err) => target._capture(methodName, err));

        // Return synchronously
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
          // Immediately return “true”
          const result = "true";
          // Then warm cache:
          target
            ._post("getFlattenedCMI", [])
            .then((all: Record<string, string>) => {
              Object.entries(all).forEach(([key, val]) => {
                target._cache.set(key, val);
              });
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

  constructor(targetOrigin: string = "*", targetWindow: Window = window.parent) {
    this._origin = targetOrigin;
    this._targetWindow = targetWindow;
    window.addEventListener("message", this._onMessage.bind(this));
    return new Proxy(this, this._handler);
  }

  /** Send a message to the LMS frame and return a promise for its response */
  private _post(method: string, params: any[]): Promise<any> {
    const messageId = `cfapi-${Date.now()}-${this._counter++}`;

    // Deep‐clean params of non-cloneables (e.g. functions)
    const safeParams = params.map((p) => {
      if (typeof p === "function") {
        console.warn("Dropping function param when posting SCORM call:", method);
        return undefined;
      }
      return p;
    });

    return new Promise((resolve, reject) => {
      this._pending.set(messageId, { resolve, reject });
      const msg: MessageData = { messageId, method, params: safeParams };
      this._targetWindow.postMessage(msg, this._origin);
      // Optional timeout
      setTimeout(() => {
        if (this._pending.has(messageId)) {
          this._pending.delete(messageId);
          reject(new Error(`Timeout calling ${method}`));
        }
      }, 5000);
    });
  }

  /** Handle incoming postMessage responses from the LMS frame */
  private _onMessage(ev: MessageEvent) {
    // Validate the message origin and source unless all origins are allowed
    if (this._origin !== "*" && ev.origin !== this._origin) {
      return;
    }
    if (ev.source && ev.source !== this._targetWindow) {
      return;
    }
    const data = ev.data as MessageResponse;
    if (!data?.messageId) return;
    const pending = this._pending.get(data.messageId);
    if (!pending) return;
    this._pending.delete(data.messageId);
    if (data.error) pending.reject(data.error);
    else pending.resolve(data.result);
  }

  /** Capture and cache SCORM errors */
  private _capture(method: string, err: any) {
    console.error(`CrossFrameAPI ${method} error:`, err);
    const match = /\b(\d{3})\b/.exec(err.message);
    const code = match ? match[1] : String(global_errors.GENERAL);
    this._lastError = code;
    this._cache.set(`error_${code}`, err.message);
  }
}
