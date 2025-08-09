this.CrossFrameAPI = (function () {
  'use strict';

  const global_errors = {
    GENERAL: 101};

  class CrossFrameAPI {
    constructor() {
      let targetOrigin = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "*";
      let targetWindow = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window.parent;
      this._cache = /* @__PURE__ */new Map();
      this._lastError = "0";
      this._pending = /* @__PURE__ */new Map();
      this._counter = 0;
      this._handler = {
        get: (target, prop, receiver) => {
          if (typeof prop !== "string" || prop in target) {
            const v = Reflect.get(target, prop, receiver);
            return typeof v === "function" ? v.bind(target) : v;
          }
          const methodName = prop;
          const isGet = methodName.endsWith("GetValue");
          const isSet = methodName.startsWith("LMSSet") || methodName.endsWith("SetValue");
          const isInit = methodName === "Initialize" || methodName === "LMSInitialize";
          const isFinish = methodName === "Terminate" || methodName === "LMSFinish";
          const isCommit = methodName === "Commit" || methodName === "LMSCommit";
          const isErrorString = methodName === "GetErrorString" || methodName === "LMSGetErrorString";
          const isDiagnostic = methodName === "GetDiagnostic" || methodName === "LMSGetDiagnostic";
          return function () {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }
            if (isSet && args.length >= 2) {
              target._cache.set(args[0], String(args[1]));
              target._lastError = "0";
            }
            target._post(methodName, args).then(res => {
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
            }).catch(err => target._capture(methodName, err));
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
              const result = "true";
              target._post("getFlattenedCMI", []).then(all => {
                Object.entries(all).forEach(_ref => {
                  let [key, val] = _ref;
                  target._cache.set(key, val);
                });
                target._lastError = "0";
              }).catch(err => target._capture("getFlattenedCMI", err));
              return result;
            }
            if (methodName === "GetLastError" || methodName === "LMSGetLastError") {
              return target._lastError;
            }
            return "";
          };
        }
      };
      this._origin = targetOrigin;
      this._targetWindow = targetWindow;
      window.addEventListener("message", this._onMessage.bind(this));
      return new Proxy(this, this._handler);
    }
    /** Send a message to the LMS frame and return a promise for its response */
    _post(method, params) {
      const messageId = `cfapi-${Date.now()}-${this._counter++}`;
      const safeParams = params.map(p => {
        if (typeof p === "function") {
          console.warn("Dropping function param when posting SCORM call:", method);
          return void 0;
        }
        return p;
      });
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          if (this._pending.has(messageId)) {
            this._pending.delete(messageId);
            reject(new Error(`Timeout calling ${method}`));
          }
        }, 5e3);
        this._pending.set(messageId, {
          resolve,
          reject,
          timer
        });
        const msg = {
          messageId,
          method,
          params: safeParams
        };
        this._targetWindow.postMessage(msg, this._origin);
      });
    }
    /** Handle incoming postMessage responses from the LMS frame */
    _onMessage(ev) {
      if (this._origin !== "*" && ev.origin !== this._origin) {
        return;
      }
      if (ev.source && ev.source !== this._targetWindow) {
        return;
      }
      const data = ev.data;
      if (!data?.messageId) return;
      const pending = this._pending.get(data.messageId);
      if (!pending) return;
      clearTimeout(pending.timer);
      this._pending.delete(data.messageId);
      if (data.error) pending.reject(data.error);else pending.resolve(data.result);
    }
    /** Capture and cache SCORM errors */
    _capture(method, err) {
      console.error(`CrossFrameAPI ${method} error:`, err);
      const match = /\b(\d{3})\b/.exec(err.message);
      const code = match ? match[1] : String(global_errors.GENERAL);
      this._lastError = code;
      this._cache.set(`error_${code}`, err.message);
    }
  }

  return CrossFrameAPI;

})();
