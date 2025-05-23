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
      const msg = ev.data;
      if (!msg?.messageId || !msg.method) return;
      this._process(msg, ev.source);
    }
    _process(msg, source) {
      let result, error;
      try {
        const fn = this._api[msg.method];
        if (typeof fn !== "function") {
          error = {
            message: `Method ${msg.method} not found`
          };
        } else {
          result = fn.apply(this._api, msg.params);
        }
      } catch (e) {
        error = {
          message: e.message,
          stack: e.stack
        };
      }
      const resp = {
        messageId: msg.messageId,
        result,
        error
      };
      source.postMessage(resp, this._origin);
    }
  }

  return CrossFrameLMS;

})();
