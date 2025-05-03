this.CrossFrameAPI = (function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  const global_errors = {
    GENERAL: 101,
    INITIALIZATION_FAILED: 101,
    INITIALIZED: 101,
    TERMINATED: 101,
    TERMINATION_FAILURE: 101,
    TERMINATION_BEFORE_INIT: 101,
    MULTIPLE_TERMINATION: 101,
    RETRIEVE_BEFORE_INIT: 101,
    RETRIEVE_AFTER_TERM: 101,
    STORE_BEFORE_INIT: 101,
    STORE_AFTER_TERM: 101,
    COMMIT_BEFORE_INIT: 101,
    COMMIT_AFTER_TERM: 101,
    ARGUMENT_ERROR: 101,
    CHILDREN_ERROR: 101,
    COUNT_ERROR: 101,
    GENERAL_GET_FAILURE: 101,
    GENERAL_SET_FAILURE: 101,
    GENERAL_COMMIT_FAILURE: 101,
    UNDEFINED_DATA_MODEL: 101,
    UNIMPLEMENTED_ELEMENT: 101,
    VALUE_NOT_INITIALIZED: 101,
    INVALID_SET_VALUE: 101,
    READ_ONLY_ELEMENT: 101,
    WRITE_ONLY_ELEMENT: 101,
    TYPE_MISMATCH: 101,
    VALUE_OUT_OF_RANGE: 101,
    DEPENDENCY_NOT_ESTABLISHED: 101
  };
  __spreadProps(__spreadValues({}, global_errors), {
    RETRIEVE_BEFORE_INIT: 301,
    STORE_BEFORE_INIT: 301,
    COMMIT_BEFORE_INIT: 301,
    ARGUMENT_ERROR: 201,
    CHILDREN_ERROR: 202,
    COUNT_ERROR: 203,
    UNDEFINED_DATA_MODEL: 401,
    UNIMPLEMENTED_ELEMENT: 401,
    VALUE_NOT_INITIALIZED: 301,
    INVALID_SET_VALUE: 402,
    READ_ONLY_ELEMENT: 403,
    WRITE_ONLY_ELEMENT: 404,
    TYPE_MISMATCH: 405,
    VALUE_OUT_OF_RANGE: 407,
    DEPENDENCY_NOT_ESTABLISHED: 408
  });
  __spreadProps(__spreadValues({}, global_errors), {
    INITIALIZATION_FAILED: 102,
    INITIALIZED: 103,
    TERMINATED: 104,
    TERMINATION_FAILURE: 111,
    TERMINATION_BEFORE_INIT: 112,
    MULTIPLE_TERMINATIONS: 113,
    RETRIEVE_BEFORE_INIT: 122,
    RETRIEVE_AFTER_TERM: 123,
    STORE_BEFORE_INIT: 132,
    STORE_AFTER_TERM: 133,
    COMMIT_BEFORE_INIT: 142,
    COMMIT_AFTER_TERM: 143,
    ARGUMENT_ERROR: 201,
    GENERAL_GET_FAILURE: 301,
    GENERAL_SET_FAILURE: 351,
    GENERAL_COMMIT_FAILURE: 391,
    UNDEFINED_DATA_MODEL: 401,
    UNIMPLEMENTED_ELEMENT: 402,
    VALUE_NOT_INITIALIZED: 403,
    READ_ONLY_ELEMENT: 404,
    WRITE_ONLY_ELEMENT: 405,
    TYPE_MISMATCH: 406,
    VALUE_OUT_OF_RANGE: 407,
    DEPENDENCY_NOT_ESTABLISHED: 408
  });

  class CrossFrameAPI {
    constructor(targetOrigin = "*") {
      this._cache = /* @__PURE__ */ new Map();
      this._lastError = "0";
      this._pending = /* @__PURE__ */ new Map();
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
          return (...args) => {
            var _a;
            if (isSet && args.length >= 2) {
              target._cache.set(args[0], String(args[1]));
              target._lastError = "0";
            }
            target._post(methodName, args).then((res) => {
              if (isGet && args.length >= 1) {
                target._cache.set(args[0], String(res));
                target._lastError = "0";
              }
              if (methodName === "GetLastError" || methodName === "LMSGetLastError") {
                target._lastError = String(res);
              }
            }).catch((err) => target._capture(methodName, err));
            if (isGet && args.length >= 1) {
              return (_a = target._cache.get(args[0])) != null ? _a : "";
            }
            if (isInit || isFinish || isCommit || isSet) {
              const result = "true";
              target._post("getFlattenedCMI", []).then((all) => {
                Object.entries(all).forEach(([key, val]) => {
                  target._cache.set(key, val);
                });
                target._lastError = "0";
              }).catch((err) => target._capture("getFlattenedCMI", err));
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
      window.addEventListener("message", this._onMessage.bind(this));
      return new Proxy(this, this._handler);
    }
    /** Send a message to the LMS frame and return a promise for its response */
    _post(method, params) {
      const messageId = `cfapi-${Date.now()}-${this._counter++}`;
      const safeParams = params.map((p) => {
        if (typeof p === "function") {
          console.warn("Dropping function param when posting SCORM call:", method);
          return void 0;
        }
        return p;
      });
      return new Promise((resolve, reject) => {
        this._pending.set(messageId, { resolve, reject });
        const msg = { messageId, method, params: safeParams };
        window.parent.postMessage(msg, this._origin);
        setTimeout(() => {
          if (this._pending.has(messageId)) {
            this._pending.delete(messageId);
            reject(new Error(`Timeout calling ${method}`));
          }
        }, 5e3);
      });
    }
    /** Handle incoming postMessage responses from the LMS frame */
    _onMessage(ev) {
      const data = ev.data;
      if (!(data == null ? void 0 : data.messageId)) return;
      const pending = this._pending.get(data.messageId);
      if (!pending) return;
      this._pending.delete(data.messageId);
      if (data.error) pending.reject(data.error);
      else pending.resolve(data.result);
    }
    /** Capture and cache SCORM errors */
    _capture(method, err) {
      console.error(`CrossFrameAPI ${method} error:`, err);
      const code = (/(\d{3})/.exec(err.message) || [])[1] || global_errors.GENERAL;
      this._lastError = String(code);
      this._cache.set(`error_${code}`, err.message);
    }
  }

  return CrossFrameAPI;

})();
//# sourceMappingURL=cross-frame-api.js.map
