this.CrossFrameLMS = (function () {
  'use strict';

  class CrossFrameLMS {
    constructor(api) {
      let targetOrigin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "*";
      this._api = api;
      this._origin = targetOrigin;
      window.addEventListener("message", this._onMessage.bind(this));
    }
    _onMessage(ev) {
      if (this._origin !== "*" && ev.origin !== this._origin) {
        return;
      }
      const msg = ev.data;
      if (!msg?.messageId || !msg.method || !ev.source) return;
      this._process(msg, ev.source);
    }
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
        const result = fn.apply(this._api, msg.params);
        if (result && typeof result.then === "function") {
          result.then(r => sendResponse(r)).catch(e => sendResponse(void 0, {
            message: e.message,
            stack: e.stack
          }));
        } else {
          sendResponse(result);
        }
      } catch (e) {
        sendResponse(void 0, {
          message: e.message,
          stack: e.stack
        });
      }
    }
  }

  return CrossFrameLMS;

})();
