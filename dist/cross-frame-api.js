this.CrossFrameAPI = (function () {
  'use strict';

  function _define_property(obj, key, value) {
      if (key in obj) {
          Object.defineProperty(obj, key, {
              value: value,
              enumerable: true,
              configurable: true,
              writable: true
          });
      } else {
          obj[key] = value;
      }
      return obj;
  }
  function _object_spread(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property(target, key, source[key]);
          });
      }
      return target;
  }
  function ownKeys(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          keys.push.apply(keys, symbols);
      }
      return keys;
  }
  function _object_spread_props(target, source) {
      source = source != null ? source : {};
      if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
          ownKeys(Object(source)).forEach(function(key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
      }
      return target;
  }
  var global_errors = {
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
  _object_spread_props(_object_spread({}, global_errors), {
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
      // SCORM 1.2 has no out-of-range error code; an out-of-range value is reported
      // as 405 (incorrect data type), per the SCORM 1.2 RTE error table and the ADL
      // 1.2 CTS (DataModelValidator.checkScoreDecimal failure -> CMICategory 405).
      VALUE_OUT_OF_RANGE: 405,
      DEPENDENCY_NOT_ESTABLISHED: 408
  });
  _object_spread_props(_object_spread({}, global_errors), {
      INITIALIZATION_FAILED: 102,
      INITIALIZED: 103,
      TERMINATED: 104,
      TERMINATION_FAILURE: 111,
      TERMINATION_BEFORE_INIT: 112,
      MULTIPLE_TERMINATION: 113,
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

  function _array_like_to_array(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _array_with_holes(arr) {
      if (Array.isArray(arr)) return arr;
  }
  function _class_call_check(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties(Constructor, staticProps);
      return Constructor;
  }
  function _instanceof(left, right) {
      "@swc/helpers - instanceof";
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  function _iterable_to_array_limit(arr, i) {
      var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
      if (_i == null) return;
      var _arr = [];
      var _n = true;
      var _d = false;
      var _s, _e;
      try {
          for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
              _arr.push(_s.value);
              if (i && _arr.length === i) break;
          }
      } catch (err) {
          _d = true;
          _e = err;
      } finally{
          try {
              if (!_n && _i["return"] != null) _i["return"]();
          } finally{
              if (_d) throw _e;
          }
      }
      return _arr;
  }
  function _non_iterable_rest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _sliced_to_array(arr, i) {
      return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
  }
  function _type_of(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _unsupported_iterable_to_array(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
  }
  var __defProp = Object.defineProperty;
  var __defNormalProp = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField = function __publicField(obj, key, value) {
      return __defNormalProp(obj, (typeof key === "undefined" ? "undefined" : _type_of(key)) !== "symbol" ? key + "" : key, value);
  };
  var CrossFrameAPI = /*#__PURE__*/ function() {
      function CrossFrameAPI() {
          var targetOrigin = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "*", targetWindow = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : window.parent, options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          _class_call_check(this, CrossFrameAPI);
          var _options_timeout, _options_heartbeatInterval, _options_heartbeatTimeout;
          __publicField(this, "_cache", /* @__PURE__ */ new Map());
          __publicField(this, "_cacheTimestamps", /* @__PURE__ */ new Map());
          __publicField(this, "_lastError", "0");
          __publicField(this, "_pending", /* @__PURE__ */ new Map());
          __publicField(this, "_counter", 0);
          __publicField(this, "_origin");
          __publicField(this, "_targetWindow");
          __publicField(this, "_timeout");
          __publicField(this, "_heartbeatInterval");
          __publicField(this, "_heartbeatTimeout");
          __publicField(this, "_destroyed", false);
          __publicField(this, "_connected", true);
          __publicField(this, "_lastHeartbeatResponse", Date.now());
          __publicField(this, "_heartbeatTimer");
          __publicField(this, "_eventListeners", /* @__PURE__ */ new Map());
          __publicField(this, "_boundOnMessage");
          __publicField(this, "_handler", {
              get: function get(target, prop, receiver) {
                  if (typeof prop !== "string" || prop in target) {
                      var v = Reflect.get(target, prop, receiver);
                      return typeof v === "function" ? v.bind(target) : v;
                  }
                  var methodName = prop;
                  var isGet = methodName.endsWith("GetValue");
                  var isSet = methodName.startsWith("LMSSet") || methodName.endsWith("SetValue");
                  var isInit = methodName === "Initialize" || methodName === "LMSInitialize";
                  var isFinish = methodName === "Terminate" || methodName === "LMSFinish";
                  var isCommit = methodName === "Commit" || methodName === "LMSCommit";
                  var isErrorString = methodName === "GetErrorString" || methodName === "LMSGetErrorString";
                  var isDiagnostic = methodName === "GetDiagnostic" || methodName === "LMSGetDiagnostic";
                  return function() {
                      for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                          args[_key] = arguments[_key];
                      }
                      if (!CrossFrameAPI._validateArgs(args)) {
                          console.error("CrossFrameAPI: Invalid arguments for ".concat(methodName));
                          return "";
                      }
                      if (isSet && args.length >= 2) {
                          var key = args[0];
                          target._cache.set(key, String(args[1]));
                          target._cacheTimestamps.set(key, Date.now());
                          target._lastError = "0";
                      }
                      var requestTime = Date.now();
                      target._post(methodName, args).then(function(res) {
                          if (isGet && args.length >= 1) {
                              var _target__cacheTimestamps_get;
                              var key = args[0];
                              var localModTime = (_target__cacheTimestamps_get = target._cacheTimestamps.get(key)) !== null && _target__cacheTimestamps_get !== void 0 ? _target__cacheTimestamps_get : 0;
                              if (localModTime < requestTime) {
                                  target._cache.set(key, String(res));
                                  target._cacheTimestamps.delete(key);
                              }
                              target._lastError = "0";
                          }
                          if (isErrorString && args.length >= 1) {
                              var code = String(args[0]);
                              target._cache.set("error_".concat(code), String(res));
                          }
                          if (isDiagnostic && args.length >= 1) {
                              var code1 = String(args[0]);
                              target._cache.set("diag_".concat(code1), String(res));
                          }
                          if (methodName === "GetLastError" || methodName === "LMSGetLastError") {
                              target._lastError = String(res);
                          }
                      }).catch(function(err) {
                          return target._capture(methodName, err);
                      });
                      if (isGet && args.length >= 1) {
                          var _target__cache_get;
                          return (_target__cache_get = target._cache.get(args[0])) !== null && _target__cache_get !== void 0 ? _target__cache_get : "";
                      }
                      if (isErrorString && args.length >= 1) {
                          var _target__cache_get1;
                          var code = String(args[0]);
                          return (_target__cache_get1 = target._cache.get("error_".concat(code))) !== null && _target__cache_get1 !== void 0 ? _target__cache_get1 : "";
                      }
                      if (isDiagnostic && args.length >= 1) {
                          var _target__cache_get2;
                          var code1 = String(args[0]);
                          return (_target__cache_get2 = target._cache.get("diag_".concat(code1))) !== null && _target__cache_get2 !== void 0 ? _target__cache_get2 : "";
                      }
                      if (isInit || isFinish || isCommit || isSet) {
                          var result = "true";
                          target._post("getFlattenedCMI", []).then(function(all) {
                              if (all && (typeof all === "undefined" ? "undefined" : _type_of(all)) === "object") {
                                  var entries = Object.entries(all);
                                  entries.forEach(function(param) {
                                      var _param = _sliced_to_array(param, 2), key = _param[0], val = _param[1];
                                      var _target__cacheTimestamps_get;
                                      var localModTime = (_target__cacheTimestamps_get = target._cacheTimestamps.get(key)) !== null && _target__cacheTimestamps_get !== void 0 ? _target__cacheTimestamps_get : 0;
                                      if (localModTime < requestTime) {
                                          target._cache.set(key, val);
                                          target._cacheTimestamps.delete(key);
                                      }
                                  });
                              }
                              target._lastError = "0";
                          }).catch(function(err) {
                              return target._capture("getFlattenedCMI", err);
                          });
                          return result;
                      }
                      if (methodName === "GetLastError" || methodName === "LMSGetLastError") {
                          return target._lastError;
                      }
                      return "";
                  };
              }
          });
          this._origin = targetOrigin;
          this._targetWindow = targetWindow;
          this._timeout = (_options_timeout = options.timeout) !== null && _options_timeout !== void 0 ? _options_timeout : 5e3;
          this._heartbeatInterval = (_options_heartbeatInterval = options.heartbeatInterval) !== null && _options_heartbeatInterval !== void 0 ? _options_heartbeatInterval : 3e4;
          this._heartbeatTimeout = (_options_heartbeatTimeout = options.heartbeatTimeout) !== null && _options_heartbeatTimeout !== void 0 ? _options_heartbeatTimeout : 6e4;
          if (targetOrigin === "*") {
              console.warn("CrossFrameAPI: Using wildcard origin ('*') allows any origin to receive messages. This is insecure for production use. Specify an explicit origin (e.g., 'https://lms.example.com') to restrict message recipients.");
          }
          this._boundOnMessage = this._onMessage.bind(this);
          window.addEventListener("message", this._boundOnMessage);
          this._startHeartbeat();
          return new Proxy(this, this._handler);
      }
      _create_class(CrossFrameAPI, [
          {
              /**
     * Destroys this instance, removing event listeners and preventing further message processing.
     * Once destroyed, the instance cannot be reused.
     */ key: "destroy",
              value: function destroy() {
                  if (this._destroyed) return;
                  this._destroyed = true;
                  window.removeEventListener("message", this._boundOnMessage);
                  if (this._heartbeatTimer) {
                      clearInterval(this._heartbeatTimer);
                      this._heartbeatTimer = void 0;
                  }
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      for(var _iterator = Array.from(this._pending.values())[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                          var pending = _step.value;
                          clearTimeout(pending.timer);
                          pending.reject(new Error("CrossFrameAPI destroyed"));
                      }
                  } catch (err) {
                      _didIteratorError = true;
                      _iteratorError = err;
                  } finally{
                      try {
                          if (!_iteratorNormalCompletion && _iterator.return != null) {
                              _iterator.return();
                          }
                      } finally{
                          if (_didIteratorError) {
                              throw _iteratorError;
                          }
                      }
                  }
                  this._pending.clear();
                  this._cache.clear();
                  this._cacheTimestamps.clear();
                  this._eventListeners.clear();
              }
          },
          {
              /**
     * Subscribes to a CrossFrame event.
     * @param event - Event type to listen for
     * @param callback - Function to call when event occurs
     */ key: "on",
              value: function on(event, callback) {
                  var _this__eventListeners_get;
                  if (!this._eventListeners.has(event)) {
                      this._eventListeners.set(event, /* @__PURE__ */ new Set());
                  }
                  (_this__eventListeners_get = this._eventListeners.get(event)) === null || _this__eventListeners_get === void 0 ? void 0 : _this__eventListeners_get.add(callback);
              }
          },
          {
              /**
     * Unsubscribes from a CrossFrame event.
     * @param event - Event type to stop listening for
     * @param callback - Function to remove
     */ key: "off",
              value: function off(event, callback) {
                  var _this__eventListeners_get;
                  (_this__eventListeners_get = this._eventListeners.get(event)) === null || _this__eventListeners_get === void 0 ? void 0 : _this__eventListeners_get.delete(callback);
              }
          },
          {
              key: "connected",
              get: /**
     * Returns whether the connection to the LMS frame is currently active.
     */ function get() {
                  return this._connected;
              }
          },
          {
              /**
     * Emits an event to all registered listeners.
     */ key: "_emit",
              value: function _emit(event) {
                  var _this__eventListeners_get;
                  (_this__eventListeners_get = this._eventListeners.get(event.type)) === null || _this__eventListeners_get === void 0 ? void 0 : _this__eventListeners_get.forEach(function(cb) {
                      return cb(event);
                  });
              }
          },
          {
              /**
     * Starts the heartbeat mechanism for connection detection.
     */ key: "_startHeartbeat",
              value: function _startHeartbeat() {
                  var _this = this;
                  if (this._heartbeatTimer) {
                      clearInterval(this._heartbeatTimer);
                  }
                  this._heartbeatTimer = setInterval(function() {
                      if (_this._destroyed) return;
                      var timeSinceLastResponse = Date.now() - _this._lastHeartbeatResponse;
                      if (timeSinceLastResponse > _this._heartbeatTimeout && _this._connected) {
                          _this._connected = false;
                          _this._emit({
                              type: "connectionLost"
                          });
                      }
                      _this._sendHeartbeat();
                  }, this._heartbeatInterval);
              }
          },
          {
              /**
     * Sends a heartbeat ping to the LMS frame.
     */ key: "_sendHeartbeat",
              value: function _sendHeartbeat() {
                  var messageId = "hb-".concat(Date.now(), "-").concat(this._counter++);
                  var msg = {
                      messageId: messageId,
                      method: "__heartbeat__",
                      params: [],
                      isHeartbeat: true
                  };
                  this._targetWindow.postMessage(msg, this._origin);
              }
          },
          {
              /**
     * Send a message to the LMS frame and return a promise for its response.
     */ key: "_post",
              value: function _post(method, params) {
                  var _this = this;
                  if (this._destroyed) {
                      return Promise.reject(new Error("CrossFrameAPI destroyed"));
                  }
                  var messageId = "cfapi-".concat(Date.now(), "-").concat(this._counter++);
                  var requestTime = Date.now();
                  var safeParams = params.map(function(p) {
                      if (typeof p === "function") {
                          console.warn("Dropping function param when posting SCORM call:", method);
                          return void 0;
                      }
                      return p;
                  });
                  return new Promise(function(resolve, reject) {
                      var timer = setTimeout(function() {
                          if (_this._pending.has(messageId)) {
                              _this._pending.delete(messageId);
                              reject(new Error("Timeout calling ".concat(method)));
                          }
                      }, _this._timeout);
                      _this._pending.set(messageId, {
                          resolve: resolve,
                          reject: reject,
                          timer: timer,
                          requestTime: requestTime,
                          method: method
                      });
                      var msg = {
                          messageId: messageId,
                          method: method,
                          params: safeParams
                      };
                      _this._targetWindow.postMessage(msg, _this._origin);
                  });
              }
          },
          {
              /**
     * Handle incoming postMessage responses from the LMS frame.
     */ key: "_onMessage",
              value: function _onMessage(ev) {
                  if (this._destroyed) return;
                  if (this._origin !== "*" && ev.origin !== this._origin) {
                      return;
                  }
                  if (ev.source && ev.source !== this._targetWindow) {
                      return;
                  }
                  if (!CrossFrameAPI._isValidMessageResponse(ev.data)) return;
                  var data = ev.data;
                  if (data.isHeartbeat) {
                      this._lastHeartbeatResponse = Date.now();
                      if (!this._connected) {
                          this._connected = true;
                          this._emit({
                              type: "connectionRestored"
                          });
                      }
                      return;
                  }
                  var pending = this._pending.get(data.messageId);
                  if (!pending) return;
                  clearTimeout(pending.timer);
                  this._pending.delete(data.messageId);
                  if (data.error) {
                      if (data.error.message === "Rate limit exceeded") {
                          this._emit({
                              type: "rateLimited",
                              method: pending.method
                          });
                      }
                      pending.reject(data.error);
                  } else {
                      pending.resolve(data.result);
                  }
              }
          },
          {
              /**
     * Capture and cache SCORM errors.
     */ key: "_capture",
              value: function _capture(method, err) {
                  var _ref;
                  var errorMessage = "Unknown error";
                  if (_instanceof(err, Error)) {
                      errorMessage = err.message;
                  } else if ((typeof err === "undefined" ? "undefined" : _type_of(err)) === "object" && err !== null && "message" in err) {
                      errorMessage = String(err.message);
                  }
                  console.error("CrossFrameAPI ".concat(method, " error:"), err);
                  var match = /(?:error code|code)?\s*(\d{3})\b/i.exec(errorMessage);
                  var code = (_ref = match === null || match === void 0 ? void 0 : match[1]) !== null && _ref !== void 0 ? _ref : String(global_errors.GENERAL);
                  this._lastError = code;
                  this._cache.set("error_".concat(code), errorMessage);
              }
          }
      ], [
          {
              key: "_isValidMessageResponse",
              value: /**
     * Type guard to validate MessageResponse structure
     */ function _isValidMessageResponse(data) {
                  if ((typeof data === "undefined" ? "undefined" : _type_of(data)) !== "object" || data === null) return false;
                  var resp = data;
                  if (typeof resp.messageId !== "string" || resp.messageId.length === 0) return false;
                  if (resp.error !== void 0) {
                      if (_type_of(resp.error) !== "object" || resp.error === null) return false;
                      var err = resp.error;
                      if (typeof err.message !== "string") return false;
                      if (err.code !== void 0 && typeof err.code !== "string") return false;
                  }
                  if (resp.isHeartbeat !== void 0 && typeof resp.isHeartbeat !== "boolean") return false;
                  return true;
              }
          },
          {
              key: "_validateArgs",
              value: /**
     * Validates that args is an array and sanitizes it for safe use
     */ function _validateArgs(args) {
                  if (!Array.isArray(args)) return false;
                  return true;
              }
          }
      ]);
      return CrossFrameAPI;
  }();

  return CrossFrameAPI;

})();
//# sourceMappingURL=cross-frame-api.js.map
