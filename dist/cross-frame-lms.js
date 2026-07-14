this.CrossFrameLMS = (function () {
  'use strict';

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
  function _type_of(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
  var _CrossFrameLMS = /*#__PURE__*/ function() {
      function _CrossFrameLMS(api) {
          var targetOrigin = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "*", options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          _class_call_check(this, _CrossFrameLMS);
          var _options_rateLimit;
          __publicField(this, "_api");
          __publicField(this, "_origin");
          __publicField(this, "_rateLimit");
          __publicField(this, "_requestTimes", []);
          __publicField(this, "_destroyed", false);
          __publicField(this, "_boundOnMessage");
          this._api = api;
          this._origin = targetOrigin;
          this._rateLimit = (_options_rateLimit = options.rateLimit) !== null && _options_rateLimit !== void 0 ? _options_rateLimit : 100;
          if (targetOrigin === "*") {
              console.warn("CrossFrameLMS: Using wildcard origin ('*') allows any origin to send messages. This is insecure for production use. Specify an explicit origin (e.g., 'https://content.example.com') to restrict message sources.");
          }
          this._boundOnMessage = this._onMessage.bind(this);
          window.addEventListener("message", this._boundOnMessage);
      }
      _create_class(_CrossFrameLMS, [
          {
              /**
     * Destroys this instance, removing event listeners and preventing further message processing.
     * Once destroyed, the instance cannot be reused.
     */ key: "destroy",
              value: function destroy() {
                  if (this._destroyed) return;
                  this._destroyed = true;
                  window.removeEventListener("message", this._boundOnMessage);
                  this._requestTimes.length = 0;
              }
          },
          {
              /**
     * Checks if the rate limit has been exceeded.
     * Uses a sliding window of 1 second.
     * @returns true if rate limit exceeded, false otherwise
     */ key: "_isRateLimited",
              value: function _isRateLimited() {
                  var now = Date.now();
                  this._requestTimes = this._requestTimes.filter(function(t) {
                      return now - t < 1e3;
                  });
                  if (this._requestTimes.length >= this._rateLimit) {
                      return true;
                  }
                  this._requestTimes.push(now);
                  return false;
              }
          },
          {
              /**
     * Handles incoming postMessage events from child frames.
     */ key: "_onMessage",
              value: function _onMessage(ev) {
                  if (this._destroyed) return;
                  if (this._origin !== "*" && ev.origin !== this._origin) {
                      return;
                  }
                  if (!_CrossFrameLMS._isValidMessageData(ev.data)) return;
                  var msg = ev.data;
                  if (!ev.source) return;
                  if (!("postMessage" in ev.source)) return;
                  var source = ev.source;
                  if (msg.isHeartbeat) {
                      var resp = {
                          messageId: msg.messageId,
                          isHeartbeat: true
                      };
                      source.postMessage(resp, this._origin);
                      return;
                  }
                  if (this._isRateLimited()) {
                      var resp1 = {
                          messageId: msg.messageId,
                          error: {
                              message: "Rate limit exceeded",
                              code: "101"
                          }
                      };
                      source.postMessage(resp1, this._origin);
                      return;
                  }
                  if (!_CrossFrameLMS.ALLOWED_METHODS.has(msg.method)) {
                      var resp2 = {
                          messageId: msg.messageId,
                          error: {
                              message: "Method not allowed: ".concat(msg.method),
                              code: "101"
                          }
                      };
                      source.postMessage(resp2, this._origin);
                      return;
                  }
                  this._process(msg, source);
              }
          },
          {
              /**
     * Processes a validated message by invoking the requested API method.
     */ key: "_process",
              value: function _process(msg, source) {
                  var _this = this;
                  var sendResponse = function sendResponse(result, error) {
                      var resp = {
                          messageId: msg.messageId
                      };
                      if (result !== void 0) resp.result = result;
                      if (error !== void 0) resp.error = error;
                      source.postMessage(resp, _this._origin);
                  };
                  try {
                      var fn = this._api[msg.method];
                      if (typeof fn !== "function") {
                          sendResponse(void 0, {
                              message: "Method ".concat(msg.method, " not found")
                          });
                          return;
                      }
                      var params = Array.isArray(msg.params) ? msg.params : [];
                      var result = fn.apply(this._api, params);
                      if (result && typeof result.then === "function") {
                          result.then(function(r) {
                              return sendResponse(r);
                          }).catch(function(e) {
                              var message = _instanceof(e, Error) ? e.message : "Unknown error";
                              var code = e && (typeof e === "undefined" ? "undefined" : _type_of(e)) === "object" && "code" in e && typeof e.code === "string" ? e.code : void 0;
                              var errorObj = {
                                  message: message
                              };
                              if (code !== void 0) {
                                  errorObj.code = code;
                              }
                              sendResponse(void 0, errorObj);
                          });
                      } else {
                          sendResponse(result);
                      }
                  } catch (e) {
                      var message = _instanceof(e, Error) ? e.message : "Unknown error";
                      var code = e && (typeof e === "undefined" ? "undefined" : _type_of(e)) === "object" && "code" in e && typeof e.code === "string" ? e.code : void 0;
                      var errorObj = {
                          message: message
                      };
                      if (code !== void 0) {
                          errorObj.code = code;
                      }
                      sendResponse(void 0, errorObj);
                  }
              }
          }
      ], [
          {
              key: "_isValidMessageData",
              value: /**
     * Type guard to validate MessageData structure
     */ function _isValidMessageData(data) {
                  if ((typeof data === "undefined" ? "undefined" : _type_of(data)) !== "object" || data === null) return false;
                  var msg = data;
                  if (typeof msg.messageId !== "string" || msg.messageId.length === 0) return false;
                  if (typeof msg.method !== "string" || msg.method.length === 0) return false;
                  if (msg.params !== void 0 && !Array.isArray(msg.params)) return false;
                  if (msg.isHeartbeat !== void 0 && typeof msg.isHeartbeat !== "boolean") return false;
                  return true;
              }
          }
      ]);
      return _CrossFrameLMS;
  }();
  /**
   * Strict allowlist of methods that can be invoked via cross-frame messages.
   * Only SCORM API methods and internal helpers are permitted.
   */ __publicField(_CrossFrameLMS, "ALLOWED_METHODS", /* @__PURE__ */ new Set([
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
      "getFlattenedCMI"
  ]));
  var CrossFrameLMS = _CrossFrameLMS;

  return CrossFrameLMS;

})();
//# sourceMappingURL=cross-frame-lms.js.map
