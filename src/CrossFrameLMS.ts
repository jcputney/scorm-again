// src/CrossFrameLMS.ts
import { MessageData, MessageResponse } from "./types/CrossFrame";
import { IBaseAPI } from "./interfaces/IBaseAPI";

/**
 * Server‐side SCORM adapter running in your LMS frame (lms.example.com).
 * Listens for postMessage from child (content) frames, invokes real API,
 * and posts back { messageId, result, error }.
 */
export default class CrossFrameLMS {
  private readonly _api: IBaseAPI;
  private readonly _origin: string;

  constructor(api: IBaseAPI, targetOrigin: string = "*") {
    this._api = api;
    this._origin = targetOrigin;
    window.addEventListener("message", this._onMessage.bind(this));
  }

  private _onMessage(ev: MessageEvent) {
    // Validate the message origin unless all origins are allowed
    if (this._origin !== "*" && ev.origin !== this._origin) {
      return;
    }

    const msg = ev.data as MessageData;
    if (!msg?.messageId || !msg.method || !ev.source) return;

    this._process(msg, ev.source as Window);
  }

  private _process(msg: MessageData, source: Window) {
    const sendResponse = (result?: any, error?: { message: string; stack?: string }) => {
      const resp: MessageResponse = { messageId: msg.messageId };
      if (result !== undefined) resp.result = result;
      if (error !== undefined) resp.error = error;
      source.postMessage(resp, this._origin);
    };

    try {
      const fn = (this._api as any)[msg.method];
      if (typeof fn !== "function") {
        sendResponse(undefined, { message: `Method ${msg.method} not found` });
        return;
      }

      const result = fn.apply(this._api, msg.params);

      if (result && typeof (result as Promise<any>).then === "function") {
        (result as Promise<any>)
          .then((r) => sendResponse(r))
          .catch((e: any) => sendResponse(undefined, { message: e.message, stack: e.stack }));
      } else {
        sendResponse(result);
      }
    } catch (e: any) {
      sendResponse(undefined, { message: e.message, stack: e.stack });
    }
  }
}
