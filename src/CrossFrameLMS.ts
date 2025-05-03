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
    const msg = ev.data as MessageData;
    if (!msg?.messageId || !msg.method) return;
    this._process(msg, ev.source as Window);
  }

  private _process(msg: MessageData, source: Window) {
    let result: any, error: any;
    try {
      const fn = (this._api as any)[msg.method];
      if (typeof fn !== "function") {
        error = {
          message: `Method ${msg.method} not found`,
        };
      } else {
        result = fn.apply(this._api, msg.params);
      }
    } catch (e: any) {
      error = { message: e.message, stack: e.stack };
    }
    const resp: MessageResponse = {
      messageId: msg.messageId,
      result,
      error,
    };
    source.postMessage(resp, this._origin);
  }
}
