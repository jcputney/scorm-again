this.Scorm12API = (function () {
  'use strict';

  function _array_like_to_array$5(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _array_with_holes$2(arr) {
      if (Array.isArray(arr)) return arr;
  }
  function _array_without_holes$3(arr) {
      if (Array.isArray(arr)) return _array_like_to_array$5(arr);
  }
  function _iterable_to_array$3(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _iterable_to_array_limit$2(arr, i) {
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
  function _non_iterable_rest$2() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _non_iterable_spread$3() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _sliced_to_array$2(arr, i) {
      return _array_with_holes$2(arr) || _iterable_to_array_limit$2(arr, i) || _unsupported_iterable_to_array$5(arr, i) || _non_iterable_rest$2();
  }
  function _to_consumable_array$3(arr) {
      return _array_without_holes$3(arr) || _iterable_to_array$3(arr) || _unsupported_iterable_to_array$5(arr) || _non_iterable_spread$3();
  }
  function _unsupported_iterable_to_array$5(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$5(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$5(o, minLen);
  }
  var SECONDS_PER_MINUTE = 60;
  var SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
  var getSecondsAsHHMMSS = function getSecondsAsHHMMSS(totalSeconds) {
      if (!totalSeconds || totalSeconds <= 0) {
          return "00:00:00";
      }
      var hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
      var dateObj = new Date(totalSeconds * 1e3);
      var minutes = dateObj.getUTCMinutes();
      var seconds = dateObj.getSeconds();
      var ms = totalSeconds % 1;
      var msStr = "";
      if (countDecimals(ms) > 0) {
          if (countDecimals(ms) > 2) {
              msStr = ms.toFixed(2);
          } else {
              msStr = String(ms);
          }
          msStr = "." + msStr.split(".")[1];
      }
      return (hours + ":" + minutes + ":" + seconds).replace(/\b\d\b/g, "0$&") + msStr;
  };
  var getTimeAsSeconds = memoize(function(timeString, timeRegex) {
      if (typeof timeString === "number" || typeof timeString === "boolean") {
          timeString = String(timeString);
      }
      if (typeof timeRegex === "string") {
          timeRegex = new RegExp(timeRegex);
      }
      if (!timeString) {
          return 0;
      }
      if (!timeString.match(timeRegex)) {
          if (/^\d+(?:\.\d+)?$/.test(timeString)) {
              return Number(timeString);
          }
          return 0;
      }
      var parts = timeString.split(":");
      var hours = Number(parts[0]);
      var minutes = Number(parts[1]);
      var seconds = Number(parts[2]);
      return hours * 3600 + minutes * 60 + seconds;
  }, // Custom key function to handle RegExp objects which can't be stringified
  function(timeString, timeRegex) {
      var _ref;
      var timeStr = typeof timeString === "string" ? timeString : String(timeString !== null && timeString !== void 0 ? timeString : "");
      var regexStr = typeof timeRegex === "string" ? timeRegex : (_ref = timeRegex === null || timeRegex === void 0 ? void 0 : timeRegex.toString()) !== null && _ref !== void 0 ? _ref : "";
      return "".concat(timeStr, ":").concat(regexStr);
  });
  var getDurationAsSeconds = memoize(function(duration, durationRegex) {
      var _ref;
      var _duration_match, _exec, _this;
      if (typeof durationRegex === "string") {
          durationRegex = new RegExp(durationRegex);
      }
      if (!duration || !(duration === null || duration === void 0 ? void 0 : (_duration_match = duration.match) === null || _duration_match === void 0 ? void 0 : _duration_match.call(duration, durationRegex))) {
          return 0;
      }
      var _ref1 = _sliced_to_array$2((_ref = (_exec = (_this = new RegExp(durationRegex)).exec) === null || _exec === void 0 ? void 0 : _exec.call(_this, duration)) !== null && _ref !== void 0 ? _ref : [], 8), years = _ref1[1], months = _ref1[2], weeks = _ref1[3], days = _ref1[4], hours = _ref1[5], minutes = _ref1[6], seconds = _ref1[7];
      var result = 0;
      result += Number(seconds) || 0;
      result += Number(minutes) * 60 || 0;
      result += Number(hours) * 3600 || 0;
      result += Number(days) * (60 * 60 * 24) || 0;
      result += Number(weeks) * (60 * 60 * 24 * 7) || 0;
      result += Number(months) * (60 * 60 * 24 * 30) || 0;
      result += Number(years) * (60 * 60 * 24 * 365) || 0;
      return result;
  }, // Custom key function to handle RegExp objects which can't be stringified
  function(duration, durationRegex) {
      var _ref;
      var durationStr = duration !== null && duration !== void 0 ? duration : "";
      var regexStr = typeof durationRegex === "string" ? durationRegex : (_ref = durationRegex === null || durationRegex === void 0 ? void 0 : durationRegex.toString()) !== null && _ref !== void 0 ? _ref : "";
      return "".concat(durationStr, ":").concat(regexStr);
  });
  function addHHMMSSTimeStrings(first, second, timeRegex) {
      if (typeof timeRegex === "string") {
          timeRegex = new RegExp(timeRegex);
      }
      return getSecondsAsHHMMSS(getTimeAsSeconds(first, timeRegex) + getTimeAsSeconds(second, timeRegex));
  }
  function flatten(data) {
      var result = {};
      function recurse(cur, prop) {
          if (Object(cur) !== cur) {
              result[prop] = cur;
          } else if (Array.isArray(cur)) {
              cur.forEach(function(item, i) {
                  recurse(item, "".concat(prop, "[").concat(i, "]"));
              });
              if (cur.length === 0) result[prop] = [];
          } else {
              var keys = Object.keys(cur).filter(function(p) {
                  return Object.prototype.hasOwnProperty.call(cur, p);
              });
              var isEmpty = keys.length === 0;
              keys.forEach(function(p) {
                  recurse(cur[p], prop ? "".concat(prop, ".").concat(p) : p);
              });
              if (isEmpty && prop) result[prop] = {};
          }
      }
      recurse(data, "");
      return result;
  }
  function unflatten(data) {
      var _result_;
      if (Object(data) !== data || Array.isArray(data)) return data;
      var result = {};
      var pattern = /\.?([^.[\]]+)|\[(\d+)]/g;
      Object.keys(data).filter(function(p) {
          return Object.prototype.hasOwnProperty.call(data, p);
      }).forEach(function(p) {
          var _ref;
          var _p_match;
          var cur = result;
          var prop = "";
          var regex = new RegExp(pattern);
          Array.from({
              length: (_ref = (_p_match = p.match(new RegExp(pattern, "g"))) === null || _p_match === void 0 ? void 0 : _p_match.length) !== null && _ref !== void 0 ? _ref : 0
          }, function() {
              return regex.exec(p);
          }).forEach(function(m) {
              if (m) {
                  var _cur_prop;
                  cur = (_cur_prop = cur[prop]) !== null && _cur_prop !== void 0 ? _cur_prop : cur[prop] = m[2] ? [] : {};
                  prop = m[2] || m[1] || "";
              }
          });
          cur[prop] = data[p];
      });
      return (_result_ = result[""]) !== null && _result_ !== void 0 ? _result_ : result;
  }
  function countDecimals(num) {
      var _ref;
      var _String_indexOf, _String, _num_toString_split;
      if (Math.floor(num) === num || ((_String = String(num)) === null || _String === void 0 ? void 0 : (_String_indexOf = _String.indexOf) === null || _String_indexOf === void 0 ? void 0 : _String_indexOf.call(_String, ".")) < 0) return 0;
      var parts = (_num_toString_split = num.toString().split(".")) === null || _num_toString_split === void 0 ? void 0 : _num_toString_split[1];
      return (_ref = parts === null || parts === void 0 ? void 0 : parts.length) !== null && _ref !== void 0 ? _ref : 0;
  }
  function formatMessage(functionName, message, CMIElement) {
      var baseLength = 20;
      var messageString = functionName ? "".concat(String(functionName).padEnd(baseLength), ": ") : "";
      if (CMIElement) {
          var CMIElementBaseLength = 70;
          messageString += CMIElement;
          messageString = messageString.padEnd(CMIElementBaseLength);
      }
      messageString += message !== null && message !== void 0 ? message : "";
      return messageString;
  }
  function stringMatches(str, tester) {
      if (typeof str !== "string") {
          return false;
      }
      return new RegExp(tester).test(str);
  }
  function memoize(fn, keyFn) {
      var cache = /* @__PURE__ */ new Map();
      return function() {
          for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
              args[_key] = arguments[_key];
          }
          var key = keyFn ? keyFn.apply(void 0, _to_consumable_array$3(args)) : JSON.stringify(args);
          return cache.has(key) ? cache.get(key) : function() {
              var result = fn.apply(void 0, _to_consumable_array$3(args));
              cache.set(key, result);
              return result;
          }();
      };
  }

  var appendQueryParam = function appendQueryParam(url, name, value) {
      var fragmentIndex = url.indexOf("#");
      var baseUrl = fragmentIndex === -1 ? url : url.slice(0, fragmentIndex);
      var fragment = fragmentIndex === -1 ? "" : url.slice(fragmentIndex);
      var separator = baseUrl.includes("?") ? baseUrl.endsWith("?") || baseUrl.endsWith("&") ? "" : "&" : "?";
      var queryParam = "".concat(encodeURIComponent(name), "=").concat(encodeURIComponent(String(value)));
      return "".concat(baseUrl).concat(separator).concat(queryParam).concat(fragment);
  };

  function _assert_this_initialized$d(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$d(_this, derived, args) {
      derived = _get_prototype_of$d(derived);
      return _possible_constructor_return$d(_this, _is_native_reflect_construct$d() ? Reflect.construct(derived, args || [], _get_prototype_of$d(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$q(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$p(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$p(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$p(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get_prototype_of$d(o) {
      _get_prototype_of$d = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$d(o);
  }
  function _inherits$d(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$d(subClass, superClass);
  }
  function _possible_constructor_return$d(self, call) {
      if (call && (_type_of$o(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$d(self);
  }
  function _set_prototype_of$d(o, p) {
      _set_prototype_of$d = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$d(o, p);
  }
  function _type_of$o(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$d() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$d = function() {
          return !!result;
      })();
  }
  var __defProp$m = Object.defineProperty;
  var __defNormalProp$m = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$m(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$m = function __publicField(obj, key, value) {
      return __defNormalProp$m(obj, (typeof key === "undefined" ? "undefined" : _type_of$o(key)) !== "symbol" ? key + "" : key, value);
  };
  var BaseCMI = /*#__PURE__*/ function() {
      function BaseCMI(cmi_element) {
          _class_call_check$q(this, BaseCMI);
          /**
       * Flag used during JSON serialization to allow getter access without initialization checks.
       * When true, getters can be accessed before the API is initialized, which is necessary
       * for serializing the CMI data structure to JSON format.
       */ __publicField$m(this, "jsonString", false);
          __publicField$m(this, "_cmi_element");
          __publicField$m(this, "_initialized", false);
          this._cmi_element = cmi_element;
      }
      _create_class$p(BaseCMI, [
          {
              key: "initialized",
              get: /**
     * Getter for _initialized
     * @return {boolean}
     */ function get() {
                  return this._initialized;
              }
          },
          {
              /**
     * Called when the API has been initialized after the CMI has been created
     */ key: "initialize",
              value: function initialize() {
                  this._initialized = true;
              }
          }
      ]);
      return BaseCMI;
  }();
  var BaseRootCMI = /*#__PURE__*/ function(BaseCMI) {
      _inherits$d(BaseRootCMI, BaseCMI);
      function BaseRootCMI() {
          _class_call_check$q(this, BaseRootCMI);
          var _this;
          _this = _call_super$d(this, BaseRootCMI, arguments);
          __publicField$m(_this, "_start_time");
          return _this;
      }
      _create_class$p(BaseRootCMI, [
          {
              key: "start_time",
              get: /**
     * Start time of the session
     * @type {number | undefined}
     * @protected
     */ function get() {
                  return this._start_time;
              }
          },
          {
              /**
     * Setter for start_time. Can only be called once.
     */ key: "setStartTime",
              value: function setStartTime() {
                  if (this._start_time === void 0) {
                      this._start_time = /* @__PURE__ */ new Date().getTime();
                  } else {
                      throw new Error("Start time has already been set.");
                  }
              }
          }
      ]);
      return BaseRootCMI;
  }(BaseCMI);

  function _assert_this_initialized$c(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$c(_this, derived, args) {
      derived = _get_prototype_of$c(derived);
      return _possible_constructor_return$c(_this, _is_native_reflect_construct$c() ? Reflect.construct(derived, args || [], _get_prototype_of$c(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$p(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _construct(Parent, args, Class) {
      if (_is_native_reflect_construct$c()) {
          _construct = Reflect.construct;
      } else {
          _construct = function construct(Parent, args, Class) {
              var a = [
                  null
              ];
              a.push.apply(a, args);
              var Constructor = Function.bind.apply(Parent, a);
              var instance = new Constructor();
              if (Class) _set_prototype_of$c(instance, Class.prototype);
              return instance;
          };
      }
      return _construct.apply(null, arguments);
  }
  function _defineProperties$o(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$o(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$o(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get_prototype_of$c(o) {
      _get_prototype_of$c = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$c(o);
  }
  function _inherits$c(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$c(subClass, superClass);
  }
  function _is_native_function(fn) {
      return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }
  function _possible_constructor_return$c(self, call) {
      if (call && (_type_of$n(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$c(self);
  }
  function _set_prototype_of$c(o, p) {
      _set_prototype_of$c = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$c(o, p);
  }
  function _type_of$n(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _wrap_native_super(Class) {
      var _cache = typeof Map === "function" ? new Map() : undefined;
      _wrap_native_super = function wrapNativeSuper(Class) {
          if (Class === null || !_is_native_function(Class)) return Class;
          if (typeof Class !== "function") {
              throw new TypeError("Super expression must either be null or a function");
          }
          if (typeof _cache !== "undefined") {
              if (_cache.has(Class)) return _cache.get(Class);
              _cache.set(Class, Wrapper);
          }
          function Wrapper() {
              return _construct(Class, arguments, _get_prototype_of$c(this).constructor);
          }
          Wrapper.prototype = Object.create(Class.prototype, {
              constructor: {
                  value: Wrapper,
                  enumerable: false,
                  writable: true,
                  configurable: true
              }
          });
          return _set_prototype_of$c(Wrapper, Class);
      };
      return _wrap_native_super(Class);
  }
  function _is_native_reflect_construct$c() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$c = function() {
          return !!result;
      })();
  }
  var __defProp$l = Object.defineProperty;
  var __defNormalProp$l = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$l(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$l = function __publicField(obj, key, value) {
      return __defNormalProp$l(obj, (typeof key === "undefined" ? "undefined" : _type_of$n(key)) !== "symbol" ? key + "" : key, value);
  };
  var BaseScormValidationError = /*#__PURE__*/ function(Error1) {
      _inherits$c(BaseScormValidationError, Error1);
      function BaseScormValidationError(CMIElement, errorCode) {
          _class_call_check$p(this, BaseScormValidationError);
          var _this;
          _this = _call_super$c(this, BaseScormValidationError, [
              "".concat(CMIElement, " : ").concat(errorCode.toString())
          ]);
          __publicField$l(_this, "_errorCode");
          _this._errorCode = errorCode;
          Object.setPrototypeOf(_this, BaseScormValidationError.prototype);
          return _this;
      }
      _create_class$o(BaseScormValidationError, [
          {
              key: "errorCode",
              get: /**
     * Getter for _errorCode
     * @return {number}
     */ function get() {
                  return this._errorCode;
              }
          }
      ]);
      return BaseScormValidationError;
  }(_wrap_native_super(Error));
  var ValidationError = /*#__PURE__*/ function(BaseScormValidationError) {
      _inherits$c(ValidationError, BaseScormValidationError);
      function ValidationError(CMIElement, errorCode, errorMessage, detailedMessage) {
          _class_call_check$p(this, ValidationError);
          var _this;
          _this = _call_super$c(this, ValidationError, [
              CMIElement,
              errorCode
          ]);
          __publicField$l(_this, "_errorMessage");
          __publicField$l(_this, "_detailedMessage", "");
          _this.message = "".concat(CMIElement, " : ").concat(errorMessage);
          _this._errorMessage = errorMessage;
          if (detailedMessage) {
              _this._detailedMessage = detailedMessage;
          }
          Object.setPrototypeOf(_this, ValidationError.prototype);
          return _this;
      }
      _create_class$o(ValidationError, [
          {
              key: "errorMessage",
              get: /**
     * Getter for _errorMessage
     * @return {string}
     */ function get() {
                  return this._errorMessage;
              }
          },
          {
              key: "detailedMessage",
              get: /**
     * Getter for _detailedMessage
     * @return {string}
     */ function get() {
                  return this._detailedMessage;
              }
          }
      ]);
      return ValidationError;
  }(BaseScormValidationError);

  var global_constants = {
      SCORM_TRUE: "true",
      SCORM_FALSE: "false",
      STATE_NOT_INITIALIZED: 0,
      STATE_INITIALIZED: 1,
      STATE_TERMINATED: 2
  };
  var scorm12_constants = {
      // Children lists
      cmi_children: "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions",
      core_children: "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
      score_children: "raw,min,max",
      objectives_children: "id,score,status",
      correct_responses_children: "pattern",
      student_data_children: "mastery_score,max_time_allowed,time_limit_action",
      student_preference_children: "audio,language,speed,text",
      interactions_children: "id,objectives,time,type,correct_responses,weighting,student_response,result,latency",
      error_descriptions: {
          "0": {
              basicMessage: "No Error",
              detailMessage: "No error occurred, the previous API call was successful."
          },
          "101": {
              basicMessage: "General Exception",
              detailMessage: "No specific error code exists to describe the error."
          },
          "201": {
              basicMessage: "Invalid argument error",
              detailMessage: "Indicates that an argument represents an invalid data model element or is otherwise incorrect."
          },
          "202": {
              basicMessage: "Element cannot have children",
              detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_children" for a data model element that does not support the "_children" suffix.'
          },
          "203": {
              basicMessage: "Element not an array - cannot have count",
              detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_count" for a data model element that does not support the "_count" suffix.'
          },
          "301": {
              basicMessage: "Not initialized",
              detailMessage: "Indicates that an API call was made before the call to lmsInitialize."
          },
          "401": {
              basicMessage: "Not implemented error",
              detailMessage: "The data model element indicated in a call to LMSGetValue or LMSSetValue is valid, but was not implemented by this LMS. SCORM 1.2 defines a set of data model elements as being optional for an LMS to implement."
          },
          "402": {
              basicMessage: "Invalid set value, element is a keyword",
              detailMessage: 'Indicates that LMSSetValue was called on a data model element that represents a keyword (elements that end in "_children" and "_count").'
          },
          "403": {
              basicMessage: "Element is read only",
              detailMessage: "LMSSetValue was called with a data model element that can only be read."
          },
          "404": {
              basicMessage: "Element is write only",
              detailMessage: "LMSGetValue was called on a data model element that can only be written to."
          },
          "405": {
              basicMessage: "Incorrect Data Type",
              detailMessage: "LMSSetValue was called with a value that is not consistent with the data format of the supplied data model element."
          },
          "407": {
              basicMessage: "Element Value Out Of Range",
              detailMessage: "The numeric value supplied to a LMSSetValue call is outside of the numeric range allowed for the supplied data model element."
          },
          "408": {
              basicMessage: "Data Model Dependency Not Established",
              detailMessage: "Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element."
          }
      }
  };

  function _assert_this_initialized$b(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$b(_this, derived, args) {
      derived = _get_prototype_of$b(derived);
      return _possible_constructor_return$b(_this, _is_native_reflect_construct$b() ? Reflect.construct(derived, args || [], _get_prototype_of$b(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$o(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _get_prototype_of$b(o) {
      _get_prototype_of$b = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$b(o);
  }
  function _inherits$b(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$b(subClass, superClass);
  }
  function _possible_constructor_return$b(self, call) {
      if (call && (_type_of$m(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$b(self);
  }
  function _set_prototype_of$b(o, p) {
      _set_prototype_of$b = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$b(o, p);
  }
  function _type_of$m(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$b() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$b = function() {
          return !!result;
      })();
  }
  var scorm12_errors$1 = scorm12_constants.error_descriptions;
  var Scorm12ValidationError = /*#__PURE__*/ function(ValidationError) {
      _inherits$b(Scorm12ValidationError, ValidationError);
      function Scorm12ValidationError(CMIElement, errorCode) {
          _class_call_check$o(this, Scorm12ValidationError);
          var _this;
          if (({}).hasOwnProperty.call(scorm12_errors$1, String(errorCode))) {
              var _scorm12_errors_String, _scorm12_errors_String1;
              _this = _call_super$b(this, Scorm12ValidationError, [
                  CMIElement,
                  errorCode,
                  ((_scorm12_errors_String = scorm12_errors$1[String(errorCode)]) === null || _scorm12_errors_String === void 0 ? void 0 : _scorm12_errors_String.basicMessage) || "Unknown error",
                  (_scorm12_errors_String1 = scorm12_errors$1[String(errorCode)]) === null || _scorm12_errors_String1 === void 0 ? void 0 : _scorm12_errors_String1.detailMessage
              ]);
          } else {
              var _ref;
              var _scorm12_errors_101, _scorm12_errors_1011;
              _this = _call_super$b(this, Scorm12ValidationError, [
                  CMIElement,
                  101,
                  (_ref = (_scorm12_errors_101 = scorm12_errors$1["101"]) === null || _scorm12_errors_101 === void 0 ? void 0 : _scorm12_errors_101.basicMessage) !== null && _ref !== void 0 ? _ref : "General error",
                  (_scorm12_errors_1011 = scorm12_errors$1["101"]) === null || _scorm12_errors_1011 === void 0 ? void 0 : _scorm12_errors_1011.detailMessage
              ]);
          }
          Object.setPrototypeOf(_assert_this_initialized$b(_this), Scorm12ValidationError.prototype);
          return _assert_this_initialized$b(_this);
      }
      return Scorm12ValidationError;
  }(ValidationError);

  function _define_property$6(obj, key, value) {
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
  function _object_spread$6(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property$6(target, key, source[key]);
          });
      }
      return target;
  }
  function ownKeys$3(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          keys.push.apply(keys, symbols);
      }
      return keys;
  }
  function _object_spread_props$3(target, source) {
      source = source != null ? source : {};
      if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
          ownKeys$3(Object(source)).forEach(function(key) {
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
  var scorm12_errors = _object_spread_props$3(_object_spread$6({}, global_errors), {
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
  _object_spread_props$3(_object_spread$6({}, global_errors), {
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

  function _assert_this_initialized$a(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$a(_this, derived, args) {
      derived = _get_prototype_of$a(derived);
      return _possible_constructor_return$a(_this, _is_native_reflect_construct$a() ? Reflect.construct(derived, args || [], _get_prototype_of$a(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$n(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$n(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$n(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$n(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get_prototype_of$a(o) {
      _get_prototype_of$a = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$a(o);
  }
  function _inherits$a(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$a(subClass, superClass);
  }
  function _possible_constructor_return$a(self, call) {
      if (call && (_type_of$l(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$a(self);
  }
  function _set_prototype_of$a(o, p) {
      _set_prototype_of$a = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$a(o, p);
  }
  function _type_of$l(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$a() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$a = function() {
          return !!result;
      })();
  }
  var __defProp$k = Object.defineProperty;
  var __defNormalProp$k = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$k(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$k = function __publicField(obj, key, value) {
      return __defNormalProp$k(obj, (typeof key === "undefined" ? "undefined" : _type_of$l(key)) !== "symbol" ? key + "" : key, value);
  };
  var CMIArray = /*#__PURE__*/ function(BaseCMI) {
      _inherits$a(CMIArray, BaseCMI);
      function CMIArray(params) {
          _class_call_check$n(this, CMIArray);
          var _this;
          var _params_errorCode;
          _this = _call_super$a(this, CMIArray, [
              params.CMIElement
          ]);
          __publicField$k(_this, "_errorCode");
          __publicField$k(_this, "_errorClass");
          __publicField$k(_this, "__children");
          __publicField$k(_this, "childArray");
          _this.__children = params.children;
          _this._errorCode = (_params_errorCode = params.errorCode) !== null && _params_errorCode !== void 0 ? _params_errorCode : scorm12_errors.GENERAL;
          _this._errorClass = params.errorClass || BaseScormValidationError;
          _this.childArray = [];
          return _this;
      }
      _create_class$n(CMIArray, [
          {
              /**
     * Called when the API has been reset
     */ key: "reset",
              value: function reset() {
                  var wipe = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
                  this._initialized = false;
                  if (wipe) {
                      this.childArray = [];
                  } else {
                      for(var i = 0; i < this.childArray.length; i++){
                          var _this_childArray_i;
                          (_this_childArray_i = this.childArray[i]) === null || _this_childArray_i === void 0 ? void 0 : _this_childArray_i.reset();
                      }
                  }
              }
          },
          {
              key: "_children",
              get: /**
     * Getter for _children
     * @return {string}
     */ function get() {
                  return this.__children;
              },
              set: /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     */ function set(_children) {
                  throw new this._errorClass(this._cmi_element + "._children", this._errorCode);
              }
          },
          {
              key: "_count",
              get: /**
     * Getter for _count
     * @return {number}
     */ function get() {
                  return this.childArray.length;
              },
              set: /**
     * Setter for _count. Just throws an error.
     * @param {number} _count
     */ function set(_count) {
                  throw new this._errorClass(this._cmi_element + "._count", this._errorCode);
              }
          },
          {
              /**
     * toJSON for *.n arrays
     * @return {object}
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {};
                  for(var i = 0; i < this.childArray.length; i++){
                      result[i + ""] = this.childArray[i];
                  }
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return CMIArray;
  }(BaseCMI);

  var SuccessStatus = {
      PASSED: "passed",
      FAILED: "failed",
      UNKNOWN: "unknown"
  };
  var CompletionStatus = {
      COMPLETED: "completed",
      INCOMPLETE: "incomplete",
      UNKNOWN: "unknown"
  };
  var LogLevelEnum = {
      _: 0,
      DEBUG: 1,
      INFO: 2,
      WARN: 3,
      ERROR: 4,
      NONE: 5
  };

  function asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _async_to_generator$3(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$3(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function _ts_generator$3(thisArg, body) {
      var f, y, t, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
      return d(g, "next", {
          value: verb(0)
      }), d(g, "throw", {
          value: verb(1)
      }), d(g, "return", {
          value: verb(2)
      }), typeof Symbol === "function" && d(g, Symbol.iterator, {
          value: function() {
              return this;
          }
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(g && (g = 0, op[0] && (_ = 0)), _)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  var DefaultSettings = {
      autocommit: false,
      autocommitSeconds: 10,
      throttleCommits: false,
      useAsynchronousCommits: false,
      sendFullCommit: true,
      lmsCommitUrl: false,
      dataCommitFormat: "json",
      commitRequestDataType: "application/json;charset=UTF-8",
      autoProgress: false,
      logLevel: LogLevelEnum.ERROR,
      selfReportSessionTime: false,
      alwaysSendTotalTime: false,
      renderCommonCommitFields: false,
      autoCompleteLessonStatus: false,
      strict_errors: true,
      xhrHeaders: {},
      xhrWithCredentials: false,
      fetchMode: "cors",
      asyncModeBeaconBehavior: "never",
      includeCommitSequence: false,
      responseHandler: function responseHandler(response) {
          return _async_to_generator$3(function() {
              var httpResult, responseText;
              return _ts_generator$3(this, function(_state) {
                  switch(_state.label){
                      case 0:
                          if (!(typeof response !== "undefined")) return [
                              3,
                              8
                          ];
                          httpResult = null;
                          _state.label = 1;
                      case 1:
                          _state.trys.push([
                              1,
                              6,
                              ,
                              7
                          ]);
                          if (!(typeof response.json === "function")) return [
                              3,
                              3
                          ];
                          return [
                              4,
                              response.json()
                          ];
                      case 2:
                          httpResult = _state.sent();
                          return [
                              3,
                              5
                          ];
                      case 3:
                          if (!(typeof response.text === "function")) return [
                              3,
                              5
                          ];
                          return [
                              4,
                              response.text()
                          ];
                      case 4:
                          responseText = _state.sent();
                          if (responseText) {
                              httpResult = JSON.parse(responseText);
                          }
                          _state.label = 5;
                      case 5:
                          return [
                              3,
                              7
                          ];
                      case 6:
                          _state.sent();
                          return [
                              3,
                              7
                          ];
                      case 7:
                          if (httpResult === null || !({}).hasOwnProperty.call(httpResult, "result")) {
                              if (response.status === 200) {
                                  return [
                                      2,
                                      {
                                          result: global_constants.SCORM_TRUE,
                                          errorCode: 0
                                      }
                                  ];
                              } else {
                                  return [
                                      2,
                                      {
                                          result: global_constants.SCORM_FALSE,
                                          errorCode: 101
                                      }
                                  ];
                              }
                          } else {
                              return [
                                  2,
                                  {
                                      result: httpResult.result,
                                      errorCode: typeof httpResult.errorCode === "number" ? httpResult.errorCode : httpResult.result === true || httpResult.result === global_constants.SCORM_TRUE ? 0 : 101
                                  }
                              ];
                          }
                      case 8:
                          return [
                              2,
                              {
                                  result: global_constants.SCORM_FALSE,
                                  errorCode: 101
                              }
                          ];
                  }
              });
          })();
      },
      xhrResponseHandler: function xhrResponseHandler(xhr) {
          if (typeof xhr !== "undefined") {
              var httpResult = null;
              if (xhr.status >= 200 && xhr.status <= 299) {
                  try {
                      httpResult = JSON.parse(xhr.responseText);
                  } catch (e) {}
                  if (httpResult === null || !({}).hasOwnProperty.call(httpResult, "result")) {
                      return {
                          result: global_constants.SCORM_TRUE,
                          errorCode: 0
                      };
                  }
                  return {
                      result: httpResult.result,
                      errorCode: typeof httpResult.errorCode === "number" ? httpResult.errorCode : httpResult.result === true || httpResult.result === global_constants.SCORM_TRUE ? 0 : 101
                  };
              } else {
                  return {
                      result: global_constants.SCORM_FALSE,
                      errorCode: 101
                  };
              }
          }
          return {
              result: global_constants.SCORM_FALSE,
              errorCode: 101
          };
      },
      requestHandler: function requestHandler(commitObject) {
          return commitObject;
      },
      onLogMessage: defaultLogHandler,
      mastery_override: false,
      score_overrides_status: false,
      completion_status_on_failed: "completed",
      scoItemIds: [],
      scoItemIdValidator: false,
      globalObjectiveIds: [],
      // Offline support settings
      enableOfflineSupport: false,
      courseId: "",
      syncOnInitialize: true,
      syncOnTerminate: true,
      maxSyncAttempts: 5,
      // Multi-SCO support settings
      scoId: "",
      autoPopulateCommitMetadata: false,
      // HTTP service settings
      httpService: null,
      // Global learner preferences settings
      globalStudentPreferences: false
  };
  function defaultLogHandler(messageLevel, logMessage) {
      switch(messageLevel){
          case "4":
          case 4:
          case "ERROR":
          case LogLevelEnum.ERROR:
              console.error(logMessage);
              break;
          case "3":
          case 3:
          case "WARN":
          case LogLevelEnum.WARN:
              console.warn(logMessage);
              break;
          case "2":
          case 2:
          case "INFO":
          case LogLevelEnum.INFO:
              console.info(logMessage);
              break;
          case "1":
          case 1:
          case "DEBUG":
          case LogLevelEnum.DEBUG:
              if (console.debug) {
                  console.debug(logMessage);
              } else {
                  console.log(logMessage);
              }
              break;
      }
  }

  var scorm12_regex = {
      /** CMIString256 - Character string, max 255 chars (RTE A.1) */ CMIString256: "^[\\s\\S]{0,255}$",
      /** CMIString4096 - Character string, max 4096 chars (RTE A.1) */ CMIString4096: "^[\\s\\S]{0,4096}$",
      /**
     * CMIString64000 - Extended character string, max 64000 chars
     *
     * SPEC COMPLIANCE NOTE:
     * The SCORM 1.2 specification defines cmi.suspend_data as CMIString4096 (max 4096 chars).
     * This implementation intentionally increases the limit to 64000 chars (matching SCORM 2004)
     * for the following reasons:
     *
     * 1. Modern content frequently exceeds 4096 chars due to JSON state serialization,
     *    base64 encoding, complex bookmark data, and rich interaction tracking
     * 2. The 4096 limit was set in 2001 when content was simpler; modern authoring tools
     *    routinely generate larger suspend_data
     * 3. Most LMS systems can handle larger values - the API shouldn't be the bottleneck
     * 4. Content that gets rejected has no recovery path, causing data loss
     * 5. Aligns with SCORM 2004's more practical 64000 char limit
     *
     * Used by: cmi.suspend_data (SCORM 1.2)
     *
     * Strict spec pattern would be: ^[\s\S]{0,4096}$
     */ CMIString64000: "^[\\s\\S]{0,64000}$",
      /**
     * CMITime - Clock time in HH:MM:SS.SS format (RTE A.2)
     * Optional centiseconds (1-2 decimal digits) per spec.
     */ CMITime: "^(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)(\\.\\d{1,2})?$",
      /**
     * CMITimespan - Time interval in HHHH:MM:SS.SS format (RTE A.3)
     * We allow more digits for the hour to support values generated
     * by getSecondsAsHHMMSS which can produce larger hour values
     * (e.g., 17496:00:00 for very long durations).
     * Changed from minimum 2 digits to 1+ digits with no upper limit.
     */ CMITimespan: "^([0-9]+):([0-9]{2}):([0-9]{2})(\\.\\d{1,2})?$",
      /**
     * CMIInteger - Non-negative integer (RTE A.4)
     *
     * SPEC COMPLIANCE NOTE:
     * The SCORM 1.2 specification defines CMIInteger as 0-65536 range.
     * This implementation intentionally omits range validation to support
     * legacy content that may exceed this limit in _count fields or other
     * integer values. Real-world content often violates the spec by storing
     * larger values, and strict enforcement would break compatibility.
     *
     * Affected elements:
     * - cmi.objectives._count
     * - cmi.interactions._count
     * - cmi.interactions.n.objectives._count
     * - cmi.interactions.n.correct_responses._count
     */ CMIInteger: "^\\d+$",
      /** CMISInteger - Signed integer (RTE A.5) */ CMISInteger: "^-?([0-9]+)$",
      /**
     * CMIDecimal - Signed decimal (RTE A.6)
     * We set practical limits on decimals to prevent abuse while maintaining
     * broad compatibility with legacy content.
     * Increased from 3 to 10 digits before decimal to match SCORM 2004 behavior.
     */ CMIDecimal: "^-?([0-9]{0,10})(\\.[0-9]*)?$",
      /**
     * CMIIdentifier - Printable ASCII characters, max 255 chars (RTE A.7)
     *
     * SPEC COMPLIANCE NOTE:
     * The SCORM 1.2 specification defines CMIIdentifier as alphanumeric only:
     * letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_).
     * Spaces and periods are explicitly NOT allowed per spec.
     *
     * This implementation intentionally relaxes validation to accept all
     * printable ASCII characters (0x21-0x7E) plus whitespace to support
     * legacy content. Many real-world LMS systems and content packages use
     * identifiers that violate the strict spec (e.g., student IDs with spaces,
     * objective IDs with periods or special characters).
     *
     * Strict spec pattern would be: ^[A-Za-z0-9_-]{0,255}$
     *
     * Affected elements:
     * - cmi.core.student_id
     * - cmi.objectives.n.id
     * - cmi.interactions.n.id
     * - cmi.interactions.n.objectives.n.id
     */ CMIIdentifier: "^[\\u0021-\\u007E\\s]{0,255}$",
      /** CMICredit - Vocabulary: credit or no-credit (RTE 3.4.2.1.3) */ CMICredit: "^(credit|no-credit)$",
      /** CMIEntry - Vocabulary: ab-initio, resume, or empty (RTE 3.4.2.1.4) */ CMIEntry: "^(ab-initio|resume|)$",
      /** CMILessonMode - Vocabulary: normal, browse, or review (RTE 3.4.2.1.10) */ CMILessonMode: "^(normal|browse|review)$",
      /** CMITimeLimitAction - Vocabulary: action combinations (RTE 3.4.2.1.11) */ CMITimeLimitAction: "^(exit,message|exit,no message|continue,message|continue,no message)$",
      /**
     * CMIFeedback - Relaxed for compatibility (normally CMIString255)
     *
     * SPEC COMPLIANCE NOTE:
     * The SCORM 1.2 specification defines CMIFeedback as CMIString255 (max 255 chars)
     * with format varying by interaction type (see RTE 3.4.2.7.5, 3.4.2.7.7).
     *
     * This implementation intentionally relaxes validation for two reasons:
     *
     * 1. LENGTH: Many legacy content packages store responses exceeding 255 chars,
     *    especially for fill-in and performance interaction types. Strict enforcement
     *    would break existing content with no user-facing benefit.
     *
     * 2. FORMAT: The spec requires type-specific formats (e.g., true-false accepts
     *    only "0"/"1"/"t"/"f", choice accepts comma-separated single chars). However:
     *    - Format validation requires knowing interaction type at validation time
     *    - Legacy content often uses non-standard formats
     *    - The SCO is responsible for response evaluation, not the API
     *    - Strict format validation provides minimal benefit vs. compatibility cost
     *
     * Affected elements:
     * - cmi.interactions.n.student_response
     * - cmi.interactions.n.correct_responses.n.pattern
     *
     * Strict spec pattern would be: ^[\s\S]{0,255}$ with type-specific subpatterns
     */ CMIFeedback: "^.*$",
      /** CMIIndex - Pattern for array index extraction */ CMIIndex: "[._](\\d+).",
      /** CMIStatus - Lesson status vocabulary (RTE 3.4.2.2.3) */ CMIStatus: "^(passed|completed|failed|incomplete|browsed)$",
      /** CMIStatus2 - Extended status vocabulary with "not attempted" (RTE 3.4.2.6.2) */ CMIStatus2: "^(passed|completed|failed|incomplete|browsed|not attempted)$",
      /** CMIExit - Exit vocabulary (RTE 3.4.2.1.5) */ CMIExit: "^(time-out|suspend|logout|)$",
      /** CMIType - Interaction type vocabulary (RTE 3.4.2.7.2) */ CMIType: "^(true-false|choice|fill-in|matching|performance|sequencing|likert|numeric)$",
      /** CMIResult - Interaction result vocabulary (RTE 3.4.2.7.6) */ CMIResult: "^(correct|wrong|unanticipated|neutral|([0-9]{0,3})?(\\.[0-9]*)?)$",
      /** NAVEvent - Navigation event vocabulary (SCORM 1.2 extension) */ NAVEvent: "^(_?(previous|continue|start|resumeAll|exit|exitAll|abandon|abandonAll|suspendAll|retry|retryAll)|choice|jump|_none_)$",
      /** score_range - Valid score range 0-100 (RTE 3.4.2.2.2) */ score_range: "0#100",
      /** audio_range - Audio level range -1 to 100 (RTE 3.4.2.3.1) */ audio_range: "-1#100",
      /** speed_range - Playback speed range -100 to 100 (RTE 3.4.2.3.2) */ speed_range: "-100#100",
      /** weighting_range - Interaction weighting range -100 to 100 (RTE 3.4.2.7.4) */ weighting_range: "-100#100",
      /** text_range - Text display preference -1 to 1 (RTE 3.4.2.3.3) */ text_range: "-1#1"
  };
  var scorm2004_regex = {
      /** CMIString200 - Character string, max 200 chars (RTE C.1.1) */ CMIString200: "^[\\u0000-\\uFFFF]{0,200}$",
      /** CMIString250 - Character string, max 250 chars (RTE C.1.1) */ CMIString250: "^[\\u0000-\\uFFFF]{0,250}$",
      /** CMIString1000 - Character string, max 1000 chars (RTE C.1.1) */ CMIString1000: "^[\\u0000-\\uFFFF]{0,1000}$",
      /** CMIString4000 - Character string, max 4000 chars (RTE C.1.1) */ CMIString4000: "^[\\u0000-\\uFFFF]{0,4000}$",
      /** CMIString64000 - Character string, max 64000 chars (RTE C.1.1) */ CMIString64000: "^[\\u0000-\\uFFFF]{0,64000}$",
      /**
     * CMILang - Language code per RFC 1766/RFC 3066 (RTE C.1.2)
     * Primary tag: 1-8 characters (ISO 639-1: 2, ISO 639-2: 3, or i/x for IANA/private)
     * Subtag: 2-8 alphanumeric characters
     */ CMILang: "^([a-zA-Z]{1,8}|i|x)(-[a-zA-Z0-9-]{2,8})?$|^$",
      /** CMILangString250 - String with optional language tag, max 250 chars (RTE C.1.3) */ CMILangString250: "^({lang=([a-zA-Z]{1,8}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,250}$)?$",
      /** CMILangcr - Language tag pattern with content */ CMILangcr: "^(({lang=([a-zA-Z]{1,8}|i|x)?(-[a-zA-Z0-9-]{2,8})?}))(.*?)$",
      /** CMILangString250cr - String with optional language tag (carriage return variant) */ CMILangString250cr: "^(({lang=([a-zA-Z]{1,8}|i|x)?(-[a-zA-Z0-9-]{2,8})?})?(.{0,250})?)?$",
      /** CMILangString4000 - String with optional language tag, max 4000 chars (RTE C.1.3) */ CMILangString4000: "^({lang=([a-zA-Z]{1,8}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,4000}$)?$",
      /**
     * CMITime - ISO 8601 timestamp format (RTE C.1.4)
     * Year range expanded from 1970-2038 to 1970-9999 to support future dates
     */ CMITime: "^(19[7-9][0-9]|[2-9][0-9]{3})((-(0[1-9]|1[0-2]))((-(0[1-9]|[1-2][0-9]|3[0-1]))(T([0-1][0-9]|2[0-3])((:[0-5][0-9])((:[0-5][0-9])((\\.[0-9]{1,6})((Z|([+|-]([0-1][0-9]|2[0-3])))(:[0-5][0-9])?)?)?)?)?)?)?)?$",
      /** CMITimespan - ISO 8601 duration format (RTE C.1.5) */ CMITimespan: "^P(?:([.,\\d]+)Y)?(?:([.,\\d]+)M)?(?:([.,\\d]+)W)?(?:([.,\\d]+)D)?(?:T?(?:([.,\\d]+)H)?(?:([.,\\d]+)M)?(?:(\\d+(?:\\.\\d{1,2})?)S)?)?$",
      /** CMIInteger - Non-negative integer (RTE C.1.6) */ CMIInteger: "^\\d+$",
      /** CMISInteger - Signed integer (RTE C.1.7) */ CMISInteger: "^-?([0-9]+)$",
      /**
     * CMIDecimal - Signed decimal (RTE C.1.8)
     * Spec allows unlimited digits, but we set practical limits to prevent abuse
     * while maintaining broad compatibility:
     * - Up to 10 digits before decimal (supports values up to 10 billion)
     * - Up to 18 digits after decimal (maintains precision for scientific use)
     */ CMIDecimal: "^-?([0-9]{1,10})(\\.[0-9]{1,18})?$",
      /**
     * CMIIdentifier - Identifier with alphanumeric ending, max 250 chars (RTE C.1.9)
     * Must contain at least one word character (\w) and only allow: letters,
     * numbers, - ( ) + . : = @ ; $ _ ! * ' % / #
     * URN format is validated separately if string starts with "urn:"
     */ CMIIdentifier: "^(?=.*\\w)[\\w\\-\\(\\)\\+\\.\\:\\=\\@\\;\\$\\_\\!\\*\\'\\%\\/\\#]{1,250}$",
      /** CMIShortIdentifier - Short identifier conforming to URI syntax, max 250 chars (RTE C.1.10) */ CMIShortIdentifier: "^(?=.*\\w)[\\w\\-\\(\\)\\+\\.\\:\\=\\@\\;\\$\\_\\!\\*\\'\\%\\/\\#]{1,250}$",
      /** CMILongIdentifier - Long identifier supporting URN format, max 4000 chars (RTE C.1.11) */ CMILongIdentifier: "^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000}|.{1,4000})$",
      /** CMIFeedback - Unrestricted feedback text (RTE C.1.12) */ CMIFeedback: "^.*$",
      /** CMIIndex - Pattern for array index extraction */ CMIIndex: "[._](\\d+).",
      /** CMIIndexStore - Pattern for stored index notation */ CMIIndexStore: ".N(\\d+).",
      /** CMICStatus - Completion status vocabulary (RTE 4.1.4) */ CMICStatus: "^(completed|incomplete|not attempted|unknown)$",
      /** CMISStatus - Success status vocabulary (RTE 4.1.11) */ CMISStatus: "^(passed|failed|unknown)$",
      /** CMIExit - Exit vocabulary (RTE 4.1.3) */ CMIExit: "^(time-out|suspend|logout|normal)$",
      /** CMIType - Interaction type vocabulary (RTE 4.1.6.2) */ CMIType: "^(true-false|choice|fill-in|long-fill-in|matching|performance|sequencing|likert|numeric|other)$",
      /** CMIResult - Interaction result vocabulary (RTE 4.1.6.8) */ CMIResult: "^(correct|incorrect|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$",
      /** NAVEvent - Navigation event vocabulary (SN Book Table 4.4.2) */ NAVEvent: "^(_?(start|resumeAll|previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|retry|retryAll)|_none_|(\\{target=(?<choice_target>\\S{0,}[a-zA-Z0-9-_]+)})?choice|(\\{target=(?<jump_target>\\S{0,}[a-zA-Z0-9-_]+)})?jump)$",
      /** NAVBoolean - Navigation boolean vocabulary (SN Book) */ NAVBoolean: "^(unknown|true|false)$",
      /** NAVTarget - Navigation target pattern (SN Book) */ NAVTarget: "^{target=\\S{0,}[a-zA-Z0-9-_]+}$",
      /** scaled_range - Scaled score range -1 to 1 (RTE 4.1.10.1) */ scaled_range: "-1#1",
      /** audio_range - Audio level range 0 to 999.9999999 (RTE 4.1.7.1) */ audio_range: "0#999.9999999",
      /** speed_range - Playback speed range 0 to 999.9999999 (RTE 4.1.7.4) */ speed_range: "0#999.9999999",
      /** text_range - Text display preference -1 to 1 (RTE 4.1.7.5) */ text_range: "-1#1",
      /** progress_range - Progress measure range 0 to 1 (RTE 4.1.8) */ progress_range: "0#1"
  };

  function _define_property$5(obj, key, value) {
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
  function _object_spread$5(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property$5(target, key, source[key]);
          });
      }
      return target;
  }
  var NavigationExceptions = {
      "NB.2.1-1": "Sequencing session already started",
      "NB.2.1-2": "Current activity not defined / sequencing not begun",
      "NB.2.1-3": "No suspended activity to resume",
      "NB.2.1-4": "Flow not enabled / current activity is root",
      "NB.2.1-5": "Violates control mode (forward only or flow disabled)",
      "NB.2.1-6": "Cannot move backward from root",
      "NB.2.1-7": "Forward/Backward navigation not supported",
      "NB.2.1-8": "Forward-only constraint violation",
      "NB.2.1-9": "Activity path empty",
      "NB.2.1-10": "Choice control disabled on parent",
      "NB.2.1-11": "Target activity does not exist",
      "NB.2.1-12": "Activity already terminated",
      "NB.2.1-13": "Undefined navigation request",
      "NB.2.1-14": "No current activity for EXIT_ALL",
      "NB.2.1-15": "No current activity for ABANDON",
      "NB.2.1-16": "No current activity for ABANDON_ALL",
      "NB.2.1-17": "No current activity for SUSPEND_ALL",
      "NB.2.1-18": "Invalid navigation request type"
  };
  var TerminationExceptions = {
      "TB.2.3-1": "No current activity to terminate",
      "TB.2.3-2": "Current activity already terminated",
      "TB.2.3-3": "Nothing to suspend (root activity)",
      "TB.2.3-4": "Cannot EXIT_PARENT from root activity",
      "TB.2.3-5": "Activity path is empty during suspend",
      "TB.2.3-6": "Nothing to abandon",
      "TB.2.3-7": "Undefined termination request"
  };
  var FlowTreeTraversalExceptions = {
      "SB.2.1-2": "No available children to deliver",
      "SB.2.1-3": "Reached beginning of course",
      "SB.2.1-4": "Forward only violation - cannot traverse backward"
  };
  var FlowActivityTraversalExceptions = {
      "SB.2.2-1": "Flow control disabled on parent",
      "SB.2.2-2": "Activity not available"
  };
  var ContinueExceptions = {
      "SB.2.7-1": "Sequencing session not begun (current activity not terminated)",
      "SB.2.7-2": "Cannot continue - flow disabled or no activity available"
  };
  var PreviousExceptions = {
      "SB.2.8-1": "Current activity not terminated",
      "SB.2.8-2": "Cannot go previous - at beginning or forwardOnly enabled"
  };
  var ChoiceExceptions = {
      "SB.2.9-1": "Target activity does not exist",
      "SB.2.9-2": "Target activity not in tree",
      "SB.2.9-3": "Cannot choose root activity",
      "SB.2.9-4": "Activity hidden from choice",
      "SB.2.9-5": "Choice control is not allowed",
      "SB.2.9-6": "Current activity not terminated",
      "SB.2.9-7": "No activity available from target",
      "SB.2.9-8": "choiceExit prevents navigation outside ancestor subtree"
  };
  var ChoiceTraversalExceptions = {
      "SB.2.4-1": "Stop forward traversal rule evaluates to true",
      "SB.2.4-2": "Constrained choice requires forward traversal from leaf",
      "SB.2.4-3": "Cannot walk backward from root of activity tree"
  };
  var RetryExceptions = {
      "SB.2.10-1": "Current activity not defined",
      "SB.2.10-2": "Activity is still active or suspended",
      "SB.2.10-3": "Flow subprocess returned false (nothing to deliver)"
  };
  var ExitExceptions = {
      "SB.2.11-1": "Exit not allowed - no parent",
      "SB.2.11-2": "Exit not allowed by sequencing controls"
  };
  var SequencingRequestExceptions = {
      "SB.2.12-1": "No current activity",
      "SB.2.12-5": "No target activity specified",
      "SB.2.12-6": "Undefined sequencing request"
  };
  var JumpExceptions = {
      "SB.2.13-1": "Target activity does not exist",
      "SB.2.13-2": "Target activity not in tree",
      "SB.2.13-3": "Target not available"
  };
  var StartExceptions = {
      "SB.2.5-1": "No activity tree",
      "SB.2.5-2": "Sequencing session already begun",
      "SB.2.5-3": "No activity available"
  };
  var ResumeExceptions = {
      "SB.2.6-1": "No suspended activity",
      "SB.2.6-2": "Current activity already defined"
  };
  var SuspendExceptions = {
      "SB.2.15-1": "Cannot suspend root"
  };
  _object_spread$5({}, NavigationExceptions, TerminationExceptions, FlowTreeTraversalExceptions, FlowActivityTraversalExceptions, ContinueExceptions, PreviousExceptions, ChoiceExceptions, ChoiceTraversalExceptions, RetryExceptions, ExitExceptions, SequencingRequestExceptions, JumpExceptions, StartExceptions, ResumeExceptions, SuspendExceptions);

  function asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _async_to_generator$2(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function _class_call_check$m(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$m(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$m(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$m(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _type_of$k(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _ts_generator$2(thisArg, body) {
      var f, y, t, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
      return d(g, "next", {
          value: verb(0)
      }), d(g, "throw", {
          value: verb(1)
      }), d(g, "return", {
          value: verb(2)
      }), typeof Symbol === "function" && d(g, Symbol.iterator, {
          value: function() {
              return this;
          }
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(g && (g = 0, op[0] && (_ = 0)), _)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  var __defProp$j = Object.defineProperty;
  var __defNormalProp$j = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$j(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$j = function __publicField(obj, key, value) {
      return __defNormalProp$j(obj, (typeof key === "undefined" ? "undefined" : _type_of$k(key)) !== "symbol" ? key + "" : key, value);
  };
  var ScheduledCommit = /*#__PURE__*/ function() {
      function ScheduledCommit(API, when, callback) {
          _class_call_check$m(this, ScheduledCommit);
          __publicField$j(this, "_API");
          __publicField$j(this, "_cancelled", false);
          __publicField$j(this, "_timeout");
          __publicField$j(this, "_callback");
          this._API = API;
          this._timeout = setTimeout(this.wrapper.bind(this), when);
          this._callback = callback;
      }
      _create_class$m(ScheduledCommit, [
          {
              /**
     * Cancel any currently scheduled commit
     */ key: "cancel",
              value: function cancel() {
                  this._cancelled = true;
                  if (this._timeout) {
                      clearTimeout(this._timeout);
                  }
              }
          },
          {
              /**
     * Wrap the API commit call to check if the call has already been canceled
     */ key: "wrapper",
              value: function wrapper() {
                  var _this = this;
                  if (!this._cancelled) {
                      if (this._API.isInitialized()) {
                          (function() {
                              return _async_to_generator$2(function() {
                                  return _ts_generator$2(this, function(_state) {
                                      switch(_state.label){
                                          case 0:
                                              return [
                                                  4,
                                                  this._API.commit(this._callback, false, "autocommit")
                                              ];
                                          case 1:
                                              return [
                                                  2,
                                                  _state.sent()
                                              ];
                                      }
                                  });
                              }).call(_this);
                          })();
                      }
                  }
              }
          }
      ]);
      return ScheduledCommit;
  }();

  var HIDE_LMS_UI_TOKENS = [
      "continue",
      "previous",
      "exit",
      "exitAll",
      "abandon",
      "abandonAll",
      "suspendAll"
  ];

  function _assert_this_initialized$9(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$9(_this, derived, args) {
      derived = _get_prototype_of$9(derived);
      return _possible_constructor_return$9(_this, _is_native_reflect_construct$9() ? Reflect.construct(derived, args || [], _get_prototype_of$9(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$l(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$l(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$l(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$l(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$l(Constructor, staticProps);
      return Constructor;
  }
  function _get_prototype_of$9(o) {
      _get_prototype_of$9 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$9(o);
  }
  function _inherits$9(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$9(subClass, superClass);
  }
  function _possible_constructor_return$9(self, call) {
      if (call && (_type_of$j(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$9(self);
  }
  function _set_prototype_of$9(o, p) {
      _set_prototype_of$9 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$9(o, p);
  }
  function _type_of$j(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$9() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$9 = function() {
          return !!result;
      })();
  }
  var __defProp$i = Object.defineProperty;
  var __defNormalProp$i = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$i(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$i = function __publicField(obj, key, value) {
      return __defNormalProp$i(obj, (typeof key === "undefined" ? "undefined" : _type_of$j(key)) !== "symbol" ? key + "" : key, value);
  };
  var _RuleCondition = /*#__PURE__*/ function(BaseCMI) {
      _inherits$9(_RuleCondition, BaseCMI);
      function _RuleCondition() {
          var condition = arguments.length > 0 && arguments[0] !== void 0 /* ALWAYS */  ? arguments[0] : "always", operator = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null, parameters = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : /* @__PURE__ */ new Map();
          _class_call_check$l(this, _RuleCondition);
          var _this;
          _this = _call_super$9(this, _RuleCondition, [
              "ruleCondition"
          ]);
          __publicField$i(_this, "_condition", "always" /* ALWAYS */ );
          __publicField$i(_this, "_operator", null);
          __publicField$i(_this, "_parameters", /* @__PURE__ */ new Map());
          __publicField$i(_this, "_referencedObjective", null);
          _this._condition = condition;
          _this._operator = operator;
          _this._parameters = parameters;
          return _this;
      }
      _create_class$l(_RuleCondition, [
          {
              /**
     * Called when the API needs to be reset
     */ key: "reset",
              value: function reset() {
                  this._initialized = false;
                  this._condition = "always" /* ALWAYS */ ;
                  this._operator = null;
                  this._parameters = /* @__PURE__ */ new Map();
              }
          },
          {
              key: "condition",
              get: /**
     * Getter for condition
     * @return {RuleConditionType}
     */ function get() {
                  return this._condition;
              },
              set: /**
     * Setter for condition
     * @param {RuleConditionType} condition
     */ function set(condition) {
                  this._condition = condition;
              }
          },
          {
              key: "operator",
              get: /**
     * Getter for operator
     * @return {RuleConditionOperator | null}
     */ function get() {
                  return this._operator;
              },
              set: /**
     * Setter for operator
     * @param {RuleConditionOperator | null} operator
     */ function set(operator) {
                  this._operator = operator;
              }
          },
          {
              key: "parameters",
              get: /**
     * Getter for parameters
     * @return {Map<string, any>}
     */ function get() {
                  return this._parameters;
              },
              set: /**
     * Setter for parameters
     * @param {Map<string, any>} parameters
     */ function set(parameters) {
                  this._parameters = parameters;
              }
          },
          {
              key: "referencedObjective",
              get: function get() {
                  return this._referencedObjective;
              },
              set: function set(objectiveId) {
                  this._referencedObjective = objectiveId;
              }
          },
          {
              key: "resolveReferencedObjective",
              value: function resolveReferencedObjective(activity) {
                  var _this = this;
                  var _activity_primaryObjective;
                  if (!this._referencedObjective) {
                      return null;
                  }
                  if (((_activity_primaryObjective = activity.primaryObjective) === null || _activity_primaryObjective === void 0 ? void 0 : _activity_primaryObjective.id) === this._referencedObjective) {
                      return activity.primaryObjective;
                  }
                  var objectives = activity.objectives || [];
                  return objectives.find(function(obj) {
                      return obj.id === _this._referencedObjective;
                  }) || null;
              }
          },
          {
              /**
     * Evaluate the condition for an activity
     * @param {Activity} activity - The activity to evaluate the condition for
     * @return {boolean} - True if the condition is met, false otherwise
     */ key: "evaluate",
              value: function evaluate(activity) {
                  var result;
                  var referencedObjective = this.resolveReferencedObjective(activity);
                  switch(this._condition){
                      case "satisfied" /* SATISFIED */ :
                      case "objectiveSatisfied" /* OBJECTIVE_SATISFIED */ :
                          if (referencedObjective) {
                              result = referencedObjective.satisfiedStatus === true;
                          } else {
                              result = activity.successStatus === SuccessStatus.PASSED || activity.objectiveSatisfiedStatus === true;
                          }
                          break;
                      case "objectiveStatusKnown" /* OBJECTIVE_STATUS_KNOWN */ :
                          result = referencedObjective ? !!referencedObjective.measureStatus : !!activity.objectiveMeasureStatus;
                          break;
                      case "objectiveMeasureKnown" /* OBJECTIVE_MEASURE_KNOWN */ :
                          result = referencedObjective ? !!referencedObjective.measureStatus : !!activity.objectiveMeasureStatus;
                          break;
                      case "objectiveMeasureGreaterThan" /* OBJECTIVE_MEASURE_GREATER_THAN */ :
                          {
                              var greaterThanValue = this._parameters.get("threshold") || 0;
                              var measureStatus = referencedObjective ? referencedObjective.measureStatus : activity.objectiveMeasureStatus;
                              var measureValue = referencedObjective ? referencedObjective.normalizedMeasure : activity.objectiveNormalizedMeasure;
                              result = !!measureStatus && measureValue > greaterThanValue;
                              break;
                          }
                      case "objectiveMeasureLessThan" /* OBJECTIVE_MEASURE_LESS_THAN */ :
                          {
                              var lessThanValue = this._parameters.get("threshold") || 0;
                              var measureStatus1 = referencedObjective ? referencedObjective.measureStatus : activity.objectiveMeasureStatus;
                              var measureValue1 = referencedObjective ? referencedObjective.normalizedMeasure : activity.objectiveNormalizedMeasure;
                              result = !!measureStatus1 && measureValue1 < lessThanValue;
                              break;
                          }
                      case "completed" /* COMPLETED */ :
                      case "activityCompleted" /* ACTIVITY_COMPLETED */ :
                          if (referencedObjective) {
                              result = referencedObjective.completionStatus === CompletionStatus.COMPLETED;
                          } else {
                              result = activity.isCompleted;
                          }
                          break;
                      case "progressKnown" /* PROGRESS_KNOWN */ :
                      case "activityProgressKnown" /* ACTIVITY_PROGRESS_KNOWN */ :
                          if (referencedObjective) {
                              result = referencedObjective.completionStatus !== CompletionStatus.UNKNOWN;
                          } else {
                              result = activity.completionStatus !== "unknown";
                          }
                          break;
                      case "attempted" /* ATTEMPTED */ :
                          result = activity.attemptCount > 0;
                          break;
                      case "attemptLimitExceeded" /* ATTEMPT_LIMIT_EXCEEDED */ :
                          result = activity.hasAttemptLimitExceeded();
                          break;
                      case "timeLimitExceeded" /* TIME_LIMIT_EXCEEDED */ :
                          result = this.evaluateTimeLimitExceeded(activity);
                          break;
                      case "outsideAvailableTimeRange" /* OUTSIDE_AVAILABLE_TIME_RANGE */ :
                          result = this.evaluateOutsideAvailableTimeRange(activity);
                          break;
                      case "always" /* ALWAYS */ :
                          result = true;
                          break;
                      case "never" /* NEVER */ :
                          result = false;
                          break;
                      default:
                          result = false;
                          break;
                  }
                  if (this._operator === "not" /* NOT */ ) {
                      result = !result;
                  }
                  return result;
              }
          },
          {
              /**
     * Evaluate if time limit has been exceeded
     * @param {Activity} activity - The activity to evaluate
     * @return {boolean}
     * @private
     */ key: "evaluateTimeLimitExceeded",
              value: function evaluateTimeLimitExceeded(activity) {
                  var limit = activity.timeLimitDuration;
                  if (!limit && activity.attemptAbsoluteDurationLimit) {
                      limit = activity.attemptAbsoluteDurationLimit;
                  }
                  if (!limit) {
                      return false;
                  }
                  var limitSeconds = getDurationAsSeconds(limit, scorm2004_regex.CMITimespan);
                  if (limitSeconds <= 0) {
                      return false;
                  }
                  var elapsedSeconds = 0;
                  if (_RuleCondition._getElapsedSecondsHook) {
                      try {
                          var hookResult = _RuleCondition._getElapsedSecondsHook(activity);
                          if (typeof hookResult === "number" && !Number.isNaN(hookResult) && hookResult >= 0) {
                              elapsedSeconds = hookResult;
                          }
                      } catch (unused) {
                          elapsedSeconds = 0;
                      }
                  }
                  if (elapsedSeconds === 0 && activity.attemptExperiencedDuration) {
                      var attemptDurationSeconds = getDurationAsSeconds(activity.attemptExperiencedDuration, scorm2004_regex.CMITimespan);
                      if (attemptDurationSeconds > 0) {
                          elapsedSeconds = attemptDurationSeconds;
                      }
                  }
                  if (elapsedSeconds === 0 && activity.attemptAbsoluteStartTime) {
                      try {
                          var start = new Date(activity.attemptAbsoluteStartTime).getTime();
                          var nowMs = _RuleCondition._now().getTime();
                          if (!Number.isNaN(start) && !Number.isNaN(nowMs) && nowMs >= start) {
                              elapsedSeconds = (nowMs - start) / 1e3;
                          }
                      } catch (unused) {
                          elapsedSeconds = 0;
                      }
                  }
                  return elapsedSeconds > limitSeconds;
              }
          },
          {
              /**
     * Evaluate if activity is outside available time range
     * @param {Activity} activity - The activity to evaluate
     * @return {boolean}
     * @private
     */ key: "evaluateOutsideAvailableTimeRange",
              value: function evaluateOutsideAvailableTimeRange(activity) {
                  var beginTime = activity.beginTimeLimit;
                  var endTime = activity.endTimeLimit;
                  if (!beginTime && !endTime) {
                      return false;
                  }
                  var now = _RuleCondition._now();
                  if (beginTime) {
                      var beginDate = new Date(beginTime);
                      if (now < beginDate) {
                          return true;
                      }
                  }
                  if (endTime) {
                      var endDate = new Date(endTime);
                      if (now > endDate) {
                          return true;
                      }
                  }
                  return false;
              }
          },
          {
              /**
     * Parse ISO 8601 duration to milliseconds
     * Uses the standard getDurationAsSeconds utility which supports full ISO 8601 format
     * including date components (years, months, weeks, days) and time components (hours, minutes, seconds).
     * @param {string} duration - ISO 8601 duration string (e.g., "PT1H30M", "P1D", "P1Y2M3DT4H5M6S")
     * @return {number} - Duration in milliseconds
     * @private
     */ key: "parseISO8601Duration",
              value: function parseISO8601Duration(duration) {
                  var seconds = getDurationAsSeconds(duration, scorm2004_regex.CMITimespan);
                  return seconds * 1e3;
              }
          },
          {
              /**
     * toJSON for RuleCondition
     * @return {object}
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      condition: this._condition,
                      operator: this._operator,
                      parameters: Object.fromEntries(this._parameters)
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ], [
          {
              key: "setNowProvider",
              value: /**
     * Allow integrators to override the clock used for time-based rules.
     */ function setNowProvider(now) {
                  if (typeof now === "function") {
                      _RuleCondition._now = now;
                  }
              }
          },
          {
              key: "setElapsedSecondsHook",
              value: /**
     * Allow integrators to set an elapsed seconds hook for time limit calculations
     */ function setElapsedSecondsHook(hook) {
                  _RuleCondition._getElapsedSecondsHook = hook;
              }
          }
      ]);
      return _RuleCondition;
  }(BaseCMI);
  // Optional, overridable provider for current time (LMS may set via SequencingService)
  __publicField$i(_RuleCondition, "_now", function() {
      return /* @__PURE__ */ new Date();
  });
  // Optional, overridable hook for getting elapsed seconds
  __publicField$i(_RuleCondition, "_getElapsedSecondsHook");

  var SelectionTiming = /* @__PURE__ */ function(SelectionTiming2) {
      SelectionTiming2["NEVER"] = "never";
      SelectionTiming2["ONCE"] = "once";
      SelectionTiming2["ON_EACH_NEW_ATTEMPT"] = "onEachNewAttempt";
      return SelectionTiming2;
  }(SelectionTiming || {});
  var RandomizationTiming = /* @__PURE__ */ function(RandomizationTiming2) {
      RandomizationTiming2["NEVER"] = "never";
      RandomizationTiming2["ONCE"] = "once";
      RandomizationTiming2["ON_EACH_NEW_ATTEMPT"] = "onEachNewAttempt";
      return RandomizationTiming2;
  }(RandomizationTiming || {});

  function _array_like_to_array$4(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _array_without_holes$2(arr) {
      if (Array.isArray(arr)) return _array_like_to_array$4(arr);
  }
  function _class_call_check$k(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$k(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$k(Constructor, protoProps, staticProps) {
      if (staticProps) _defineProperties$k(Constructor, staticProps);
      return Constructor;
  }
  function _iterable_to_array$2(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _non_iterable_spread$2() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _to_consumable_array$2(arr) {
      return _array_without_holes$2(arr) || _iterable_to_array$2(arr) || _unsupported_iterable_to_array$4(arr) || _non_iterable_spread$2();
  }
  function _unsupported_iterable_to_array$4(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$4(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$4(o, minLen);
  }
  var SelectionRandomization = /*#__PURE__*/ function() {
      function SelectionRandomization() {
          _class_call_check$k(this, SelectionRandomization);
      }
      _create_class$k(SelectionRandomization, null, [
          {
              key: "selectChildrenProcess",
              value: /**
     * Select Children Process (SR.1)
     * Selects a subset of child activities based on selection controls
     * @param {Activity} activity - The parent activity whose children need to be selected
     * @return {Activity[]} - The selected child activities
     */ function selectChildrenProcess(activity) {
                  var controls = activity.sequencingControls;
                  var children = _to_consumable_array$2(activity.children);
                  if (controls.selectionTiming === SelectionTiming.NEVER) {
                      return children;
                  }
                  if (controls.selectionTiming === SelectionTiming.ONCE && controls.selectionCountStatus) {
                      return children;
                  }
                  if (controls.selectionTiming !== SelectionTiming.ONCE && !controls.selectionCountStatus) {
                      return children;
                  }
                  var selectCount = controls.selectCount;
                  if (selectCount === null || selectCount >= children.length) {
                      if (controls.selectionTiming === SelectionTiming.ONCE) {
                          controls.selectionCountStatus = true;
                      }
                      return children;
                  }
                  var selectedChildren = [];
                  var availableIndices = children.map(function(_, index) {
                      return index;
                  });
                  for(var i = 0; i < selectCount; i++){
                      if (availableIndices.length === 0) break;
                      var randomIndex = Math.floor(Math.random() * availableIndices.length);
                      var childIndex = availableIndices[randomIndex];
                      if (childIndex !== void 0 && children[childIndex]) {
                          selectedChildren.push(children[childIndex]);
                      }
                      availableIndices.splice(randomIndex, 1);
                  }
                  if (controls.selectionTiming === SelectionTiming.ONCE) {
                      controls.selectionCountStatus = true;
                  }
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      for(var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                          var child = _step.value;
                          if (!selectedChildren.includes(child)) {
                              child.isHiddenFromChoice = true;
                              child.isAvailable = false;
                          }
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
                  return selectedChildren;
              }
          },
          {
              key: "randomizeChildrenProcess",
              value: /**
     * Randomize Children Process (SR.2)
     * Randomizes the order of child activities based on randomization controls
     * @param {Activity} activity - The parent activity whose children need to be randomized
     * @return {Activity[]} - The randomized child activities
     */ function randomizeChildrenProcess(activity) {
                  var _activity_children;
                  var controls = activity.sequencingControls;
                  var children = _to_consumable_array$2(activity.children);
                  if (controls.randomizationTiming === RandomizationTiming.NEVER) {
                      return children;
                  }
                  if (controls.randomizationTiming === RandomizationTiming.ONCE && controls.reorderChildren) {
                      return children;
                  }
                  if (!controls.randomizeChildren) {
                      return children;
                  }
                  var randomizedChildren = _to_consumable_array$2(children);
                  for(var i = randomizedChildren.length - 1; i > 0; i--){
                      var j = Math.floor(Math.random() * (i + 1));
                      var tempI = randomizedChildren[i];
                      var tempJ = randomizedChildren[j];
                      if (tempI && tempJ) {
                          randomizedChildren[i] = tempJ;
                          randomizedChildren[j] = tempI;
                      }
                  }
                  if (controls.randomizationTiming === RandomizationTiming.ONCE) {
                      controls.reorderChildren = true;
                  }
                  activity.children.length = 0;
                  (_activity_children = activity.children).push.apply(_activity_children, _to_consumable_array$2(randomizedChildren));
                  return randomizedChildren;
              }
          },
          {
              key: "applySelectionAndRandomization",
              value: /**
     * Apply selection and randomization to an activity
     * This combines both SR.1 and SR.2 processes
     * @param {Activity} activity - The parent activity
     * @param {boolean} isNewAttempt - Whether this is a new attempt on the activity
     * @return {Activity[]} - The processed child activities
     */ function applySelectionAndRandomization(activity) {
                  var isNewAttempt = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                  var controls = activity.sequencingControls;
                  if (!isNewAttempt && (activity.isActive || activity.isSuspended)) {
                      return activity.children;
                  }
                  var shouldApplySelection = false;
                  var shouldApplyRandomization = false;
                  if (controls.selectionTiming === SelectionTiming.ON_EACH_NEW_ATTEMPT) {
                      shouldApplySelection = isNewAttempt;
                      if (isNewAttempt) {
                          controls.selectionCountStatus = true;
                      }
                  } else if (controls.selectionTiming === SelectionTiming.ONCE) {
                      shouldApplySelection = !controls.selectionCountStatus;
                  }
                  if (controls.randomizationTiming === RandomizationTiming.ON_EACH_NEW_ATTEMPT) {
                      shouldApplyRandomization = isNewAttempt;
                      if (isNewAttempt) {
                          controls.reorderChildren = false;
                      }
                  } else if (controls.randomizationTiming === RandomizationTiming.ONCE) {
                      shouldApplyRandomization = !controls.reorderChildren;
                  }
                  if (shouldApplySelection) {
                      this.selectChildrenProcess(activity);
                  }
                  if (shouldApplyRandomization) {
                      this.randomizeChildrenProcess(activity);
                  }
                  var processedChildren = activity.children.filter(function(child) {
                      return child.isAvailable;
                  });
                  activity.setProcessedChildren(processedChildren);
                  return processedChildren;
              }
          },
          {
              key: "isSelectionNeeded",
              value: /**
     * Check if selection is needed for an activity
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if selection is needed
     */ function isSelectionNeeded(activity) {
                  var controls = activity.sequencingControls;
                  if (controls.selectionTiming === SelectionTiming.NEVER) {
                      return false;
                  }
                  if (controls.selectionTiming === SelectionTiming.ONCE && controls.selectionCountStatus) {
                      return false;
                  }
                  return controls.selectCount !== null && controls.selectCount < activity.children.length;
              }
          },
          {
              key: "isRandomizationNeeded",
              value: /**
     * Check if randomization is needed for an activity
     * @param {Activity} activity - The activity to check
     * @return {boolean} - True if randomization is needed
     */ function isRandomizationNeeded(activity) {
                  var controls = activity.sequencingControls;
                  if (controls.randomizationTiming === RandomizationTiming.NEVER) {
                      return false;
                  }
                  if (controls.randomizationTiming === RandomizationTiming.ONCE && controls.reorderChildren) {
                      return false;
                  }
                  return controls.randomizeChildren;
              }
          }
      ]);
      return SelectionRandomization;
  }();

  function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _async_to_generator$1(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function _class_call_check$j(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$j(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$j(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$j(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _define_property$4(obj, key, value) {
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
  function _instanceof$5(left, right) {
      "@swc/helpers - instanceof";
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  function _object_spread$4(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property$4(target, key, source[key]);
          });
      }
      return target;
  }
  function ownKeys$2(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          keys.push.apply(keys, symbols);
      }
      return keys;
  }
  function _object_spread_props$2(target, source) {
      source = source != null ? source : {};
      if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
          ownKeys$2(Object(source)).forEach(function(key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
      }
      return target;
  }
  function _type_of$i(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _ts_generator$1(thisArg, body) {
      var f, y, t, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
      return d(g, "next", {
          value: verb(0)
      }), d(g, "throw", {
          value: verb(1)
      }), d(g, "return", {
          value: verb(2)
      }), typeof Symbol === "function" && d(g, Symbol.iterator, {
          value: function() {
              return this;
          }
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(g && (g = 0, op[0] && (_ = 0)), _)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  var __defProp$h = Object.defineProperty;
  var __defNormalProp$h = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$h(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$h = function __publicField(obj, key, value) {
      return __defNormalProp$h(obj, (typeof key === "undefined" ? "undefined" : _type_of$i(key)) !== "symbol" ? key + "" : key, value);
  };
  var AsynchronousHttpService = /*#__PURE__*/ function() {
      function AsynchronousHttpService(settings, error_codes) {
          _class_call_check$j(this, AsynchronousHttpService);
          __publicField$h(this, "reportsRequestCompletion", true);
          __publicField$h(this, "settings");
          __publicField$h(this, "error_codes");
          this.settings = settings;
          this.error_codes = error_codes;
      }
      _create_class$j(AsynchronousHttpService, [
          {
              /**
     * Sends HTTP requests asynchronously to the LMS
     * Returns immediate success - actual result handled via events
     *
     * WARNING: This is NOT SCORM-compliant. Always returns optimistic success immediately.
     * The actual HTTP request happens in the background, and success/failure is reported
     * via CommitSuccess/CommitError events, but NOT to the SCO's commit call.
     *
     * @param {string} url - The URL endpoint to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
     * @param {boolean} immediate - Whether to send the request immediately without waiting
     * @param {Function} apiLog - Function to log API messages with appropriate levels
     * @param {Function} processListeners - Function to trigger event listeners for commit events
     * @param {CommitMetadata} metadata - Metadata describing the captured commit
     * @param {Function} onRequestComplete - Callback invoked after the background request settles
     * @return {ResultObject} - Immediate optimistic success result
     */ key: "processHttpRequest",
              value: function processHttpRequest(url, params) {
                  var immediate = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, apiLog = arguments.length > 3 ? arguments[3] : void 0, processListeners = arguments.length > 4 ? arguments[4] : void 0, metadata = arguments.length > 5 ? arguments[5] : void 0, onRequestComplete = arguments.length > 6 ? arguments[6] : void 0;
                  this._performAsyncRequest(url, params, immediate, apiLog, processListeners, metadata, onRequestComplete);
                  return {
                      result: global_constants.SCORM_TRUE,
                      errorCode: 0
                  };
              }
          },
          {
              key: "_performAsyncRequest",
              value: /**
     * Performs the async request in the background
     * @param {string} url - The URL to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
     * @param {boolean} immediate - Whether this is an immediate request
     * @param apiLog - Function to log API messages
     * @param {Function} processListeners - Function to process event listeners
     * @param {CommitMetadata} metadata - Metadata describing the captured commit
     * @param {Function} onRequestComplete - Callback invoked after the request settles
     * @private
     */ function _performAsyncRequest(url, params, immediate, apiLog, processListeners, metadata, onRequestComplete) {
                  return _async_to_generator$1(function() {
                      var handledParams, processedParams, response, result, e, message;
                      return _ts_generator$1(this, function(_state) {
                          switch(_state.label){
                              case 0:
                                  _state.trys.push([
                                      0,
                                      6,
                                      7,
                                      8
                                  ]);
                                  handledParams = metadata === void 0 ? this.settings.requestHandler(params) : this.settings.requestHandler(params, metadata);
                                  processedParams = handledParams;
                                  if (!(immediate && this.settings.asyncModeBeaconBehavior !== "never")) return [
                                      3,
                                      2
                                  ];
                                  return [
                                      4,
                                      this.performBeacon(url, processedParams)
                                  ];
                              case 1:
                                  response = _state.sent();
                                  return [
                                      3,
                                      4
                                  ];
                              case 2:
                                  return [
                                      4,
                                      this.performFetch(url, processedParams)
                                  ];
                              case 3:
                                  response = _state.sent();
                                  _state.label = 4;
                              case 4:
                                  return [
                                      4,
                                      this.transformResponse(response, processListeners)
                                  ];
                              case 5:
                                  result = _state.sent();
                                  if (this._isSuccessResponse(response, result)) {
                                      processListeners("CommitSuccess");
                                  } else {
                                      processListeners("CommitError", void 0, result.errorCode);
                                  }
                                  return [
                                      3,
                                      8
                                  ];
                              case 6:
                                  e = _state.sent();
                                  message = _instanceof$5(e, Error) ? e.message : String(e);
                                  apiLog("processHttpRequest", "Async request failed: ".concat(message), LogLevelEnum.ERROR);
                                  processListeners("CommitError", void 0, this.error_codes.GENERAL_COMMIT_FAILURE || 391);
                                  return [
                                      3,
                                      8
                                  ];
                              case 7:
                                  onRequestComplete === null || onRequestComplete === void 0 ? void 0 : onRequestComplete();
                                  return [
                                      7
                                  ];
                              case 8:
                                  return [
                                      2
                                  ];
                          }
                      });
                  }).call(this);
              }
          },
          {
              /**
     * Prepares the request body and content type based on params type
     * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
     * @return {Object} - Object containing body and contentType
     * @private
     */ key: "_prepareRequestBody",
              value: function _prepareRequestBody(params) {
                  var body = _instanceof$5(params, Array) ? params.join("&") : JSON.stringify(params);
                  var contentType = _instanceof$5(params, Array) ? "application/x-www-form-urlencoded" : this.settings.commitRequestDataType;
                  return {
                      body: body,
                      contentType: contentType
                  };
              }
          },
          {
              key: "performFetch",
              value: /**
     * Perform the fetch request to the LMS
     * @param {string} url - The URL to send the request to
     * @param {StringKeyMap|Array} params - The parameters to include in the request
     * @return {Promise<Response>} - The response from the LMS
     * @private
     */ function performFetch(url, params) {
                  return _async_to_generator$1(function() {
                      var _this__prepareRequestBody, body, contentType, init;
                      return _ts_generator$1(this, function(_state) {
                          if (this.settings.asyncModeBeaconBehavior === "always") {
                              return [
                                  2,
                                  this.performBeacon(url, params)
                              ];
                          }
                          _this__prepareRequestBody = this._prepareRequestBody(params), body = _this__prepareRequestBody.body, contentType = _this__prepareRequestBody.contentType;
                          init = {
                              method: "POST",
                              mode: this.settings.fetchMode,
                              body: body,
                              headers: _object_spread_props$2(_object_spread$4({}, this.settings.xhrHeaders), {
                                  "Content-Type": contentType
                              }),
                              keepalive: true
                          };
                          if (this.settings.xhrWithCredentials) {
                              init.credentials = "include";
                          }
                          return [
                              2,
                              fetch(url, init)
                          ];
                      });
                  }).call(this);
              }
          },
          {
              key: "performBeacon",
              value: /**
     * Perform the beacon request to the LMS
     * @param {string} url - The URL to send the request to
     * @param {StringKeyMap|Array} params - The parameters to include in the request
     * @return {Promise<Response>} - A promise that resolves with a mock Response object
     * @private
     */ function performBeacon(url, params) {
                  return _async_to_generator$1(function() {
                      var _this, _this__prepareRequestBody, body, contentType, beaconSuccess;
                      return _ts_generator$1(this, function(_state) {
                          _this = this;
                          _this__prepareRequestBody = this._prepareRequestBody(params), body = _this__prepareRequestBody.body, contentType = _this__prepareRequestBody.contentType;
                          beaconSuccess = navigator.sendBeacon(url, new Blob([
                              body
                          ], {
                              type: contentType
                          }));
                          return [
                              2,
                              Promise.resolve({
                                  status: beaconSuccess ? 200 : 0,
                                  ok: beaconSuccess,
                                  json: function json() {
                                      return _async_to_generator$1(function() {
                                          return _ts_generator$1(this, function(_state) {
                                              return [
                                                  2,
                                                  {
                                                      result: beaconSuccess ? "true" : "false",
                                                      errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL_COMMIT_FAILURE || 391
                                                  }
                                              ];
                                          });
                                      }).call(_this);
                                  },
                                  text: function text() {
                                      return _async_to_generator$1(function() {
                                          return _ts_generator$1(this, function(_state) {
                                              return [
                                                  2,
                                                  JSON.stringify({
                                                      result: beaconSuccess ? "true" : "false",
                                                      errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL_COMMIT_FAILURE || 391
                                                  })
                                              ];
                                          });
                                      }).call(_this);
                                  }
                              })
                          ];
                      });
                  }).call(this);
              }
          },
          {
              key: "transformResponse",
              value: /**
     * Transforms the response from the LMS to a ResultObject
     * @param {Response} response - The response from the LMS
     * @param {Function} processListeners - Function to process event listeners
     * @return {Promise<ResultObject>} - The transformed response
     * @private
     */ function transformResponse(response, processListeners) {
                  return _async_to_generator$1(function() {
                      var result, _tmp, parseError, responseText;
                      return _ts_generator$1(this, function(_state) {
                          switch(_state.label){
                              case 0:
                                  _state.trys.push([
                                      0,
                                      5,
                                      ,
                                      7
                                  ]);
                                  if (!(typeof this.settings.responseHandler === "function")) return [
                                      3,
                                      2
                                  ];
                                  return [
                                      4,
                                      this.settings.responseHandler(response)
                                  ];
                              case 1:
                                  _tmp = _state.sent();
                                  return [
                                      3,
                                      4
                                  ];
                              case 2:
                                  return [
                                      4,
                                      response.json()
                                  ];
                              case 3:
                                  _tmp = _state.sent();
                                  _state.label = 4;
                              case 4:
                                  result = _tmp;
                                  return [
                                      3,
                                      7
                                  ];
                              case 5:
                                  parseError = _state.sent();
                                  return [
                                      4,
                                      response.text().catch(function() {
                                          return "Unable to read response text";
                                      })
                                  ];
                              case 6:
                                  responseText = _state.sent();
                                  return [
                                      2,
                                      {
                                          result: global_constants.SCORM_FALSE,
                                          errorCode: this.error_codes.GENERAL_COMMIT_FAILURE || 391,
                                          errorMessage: "Failed to parse LMS response: ".concat(_instanceof$5(parseError, Error) ? parseError.message : String(parseError)),
                                          errorDetails: JSON.stringify({
                                              status: response.status,
                                              statusText: response.statusText,
                                              url: response.url,
                                              responseText: responseText.substring(0, 500),
                                              // Limit response text to avoid huge logs
                                              parseError: _instanceof$5(parseError, Error) ? parseError.message : String(parseError)
                                          })
                                      }
                                  ];
                              case 7:
                                  if (!Object.hasOwnProperty.call(result, "errorCode")) {
                                      result.errorCode = this._isSuccessResponse(response, result) ? 0 : this.error_codes.GENERAL_COMMIT_FAILURE || 391;
                                  }
                                  if (!this._isSuccessResponse(response, result)) {
                                      result.errorDetails = _object_spread$4({
                                          status: response.status,
                                          statusText: response.statusText,
                                          url: response.url
                                      }, result.errorDetails);
                                  }
                                  return [
                                      2,
                                      result
                                  ];
                          }
                      });
                  }).call(this);
              }
          },
          {
              /**
     * Determines if a response is successful based on status code and result
     * @param {Response} response - The HTTP response
     * @param {ResultObject} result - The parsed result object
     * @return {boolean} - Whether the response is successful
     * @private
     */ key: "_isSuccessResponse",
              value: function _isSuccessResponse(response, result) {
                  var value = result.result;
                  return response.status >= 200 && response.status <= 299 && (value === true || value === "true" || value === global_constants.SCORM_TRUE);
              }
          },
          {
              /**
     * Updates the service settings
     * @param {Settings} settings - The new settings
     */ key: "updateSettings",
              value: function updateSettings(settings) {
                  this.settings = settings;
              }
          }
      ]);
      return AsynchronousHttpService;
  }();

  function _class_call_check$i(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$i(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$i(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$i(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _instanceof$4(left, right) {
      "@swc/helpers - instanceof";
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  function _type_of$h(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  var __defProp$g = Object.defineProperty;
  var __defNormalProp$g = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$g(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$g = function __publicField(obj, key, value) {
      return __defNormalProp$g(obj, (_type_of$h(key)) !== "symbol" ? key + "" : key, value);
  };
  var TARGET_ATTRIBUTE_PREFIX = "{target=";
  function getErrorCode(errorCodes, key) {
      var code = errorCodes[key];
      if (code === void 0) {
          var _errorCodes_GENERAL;
          if (typeof console !== "undefined" && console.warn) {
              console.warn("CMIValueAccessService: Unknown error code key: ".concat(key));
          }
          return (_errorCodes_GENERAL = errorCodes["GENERAL"]) !== null && _errorCodes_GENERAL !== void 0 ? _errorCodes_GENERAL : 0;
      }
      return code;
  }
  var CMIValueAccessService = /*#__PURE__*/ function() {
      function CMIValueAccessService(context) {
          _class_call_check$i(this, CMIValueAccessService);
          __publicField$g(this, "context");
          this.context = context;
      }
      _create_class$i(CMIValueAccessService, [
          {
              /**
     * Gets the appropriate error code for undefined data model elements.
     * Both SCORM 2004 and SCORM 1.2 use UNDEFINED_DATA_MODEL (401): an
     * unrecognized element is "Not implemented", not a general exception. SCORM
     * 1.2 previously returned GENERAL (101) here, which is non-conformant — the
     * ADL 1.2 CTS and the SCORM 1.2 RTE spec expect 401 for an unknown element.
     */ key: "getUndefinedDataModelErrorCode",
              value: function getUndefinedDataModelErrorCode() {
                  return getErrorCode(this.context.errorCodes, "UNDEFINED_DATA_MODEL");
              }
          },
          {
              /**
     * Sets a value on a CMI element path
     *
     * @param {string} methodName - The API method name for logging
     * @param {boolean} scorm2004 - Whether this is SCORM 2004
     * @param {string} CMIElement - The CMI element path
     * @param {string} value - The value to set (all SCORM values are strings)
     * @return {string} "true" or "false"
     */ key: "setCMIValue",
              value: function setCMIValue(methodName, scorm2004, CMIElement, value) {
                  if (!CMIElement || CMIElement === "") {
                      if (scorm2004) {
                          this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "GENERAL_SET_FAILURE"), "The data model element was not specified");
                      }
                      return global_constants.SCORM_FALSE;
                  }
                  this.context.setLastErrorCode("0");
                  var structure = CMIElement.split(".");
                  var refObject = this.context.getDataModel();
                  var returnValue = global_constants.SCORM_FALSE;
                  var foundFirstIndex = false;
                  var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
                  var invalidErrorCode = this.getUndefinedDataModelErrorCode();
                  for(var idx = 0; idx < structure.length; idx++){
                      var attribute = structure[idx];
                      if (idx === structure.length - 1) {
                          returnValue = this.setFinalAttribute(refObject, attribute, value, CMIElement, scorm2004, invalidErrorCode, invalidErrorMessage);
                          break;
                      } else {
                          var traverseResult = this.traverseToNextLevel(refObject, structure, idx, value, CMIElement, scorm2004, foundFirstIndex, invalidErrorCode, invalidErrorMessage);
                          if (traverseResult.error) {
                              break;
                          }
                          refObject = traverseResult.refObject;
                          idx = traverseResult.idx;
                          foundFirstIndex = traverseResult.foundFirstIndex;
                      }
                  }
                  if (returnValue === global_constants.SCORM_FALSE) {
                      this.context.apiLog(methodName, "There was an error setting the value for: ".concat(CMIElement, ", value of: ").concat(value), LogLevelEnum.WARN);
                  }
                  return returnValue;
              }
          },
          {
              /**
     * Gets a value from a CMI element path
     *
     * @param {string} methodName - The API method name for logging
     * @param {boolean} scorm2004 - Whether this is SCORM 2004
     * @param {string} CMIElement - The CMI element path
     * @return The value at the element path, or empty string on error (per SCORM spec)
     */ key: "getCMIValue",
              value: function getCMIValue(methodName, scorm2004, CMIElement) {
                  if (!CMIElement || CMIElement === "") {
                      if (scorm2004) {
                          this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "GENERAL_GET_FAILURE"), "The data model element was not specified");
                      }
                      return "";
                  }
                  if (scorm2004 && CMIElement.endsWith("._version") && CMIElement !== "cmi._version") {
                      this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "GENERAL_GET_FAILURE"), "The _version keyword was used incorrectly");
                      return "";
                  }
                  this.context.setLastErrorCode("0");
                  var structure = CMIElement.split(".");
                  var refObject = this.context.getDataModel();
                  var attribute = null;
                  var uninitializedErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") has not been initialized.");
                  var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
                  var invalidErrorCode = this.getUndefinedDataModelErrorCode();
                  for(var idx = 0; idx < structure.length; idx++){
                      attribute = structure[idx];
                      var validationResult = this.validateGetAttribute(refObject, attribute, CMIElement, scorm2004, invalidErrorCode, invalidErrorMessage, idx === structure.length - 1);
                      if (validationResult.returnValue !== void 0) {
                          return validationResult.returnValue;
                      }
                      if (validationResult.error) {
                          return "";
                      }
                      if (attribute !== void 0 && attribute !== null) {
                          refObject = refObject[attribute];
                          if (refObject === void 0) {
                              this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                              break;
                          }
                      } else {
                          this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                          break;
                      }
                      if (_instanceof$4(refObject, CMIArray)) {
                          var arrayResult = this.handleGetArrayAccess(refObject, structure, idx, CMIElement, uninitializedErrorMessage);
                          if (arrayResult.error) {
                              return "";
                          }
                          refObject = arrayResult.refObject;
                          idx = arrayResult.idx;
                      }
                  }
                  if (refObject === null || refObject === void 0) {
                      if (!scorm2004) {
                          if (attribute === "_children") {
                              this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "CHILDREN_ERROR"), void 0);
                          } else if (attribute === "_count") {
                              this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "COUNT_ERROR"), void 0);
                          }
                      }
                      return "";
                  }
                  return refObject;
              }
          },
          {
              /**
     * Sets the final attribute value in the CMI path
     */ key: "setFinalAttribute",
              value: function setFinalAttribute(refObject, attribute, value, CMIElement, scorm2004, invalidErrorCode, invalidErrorMessage) {
                  if (scorm2004 && (attribute === null || attribute === void 0 ? void 0 : attribute.startsWith(TARGET_ATTRIBUTE_PREFIX))) {
                      if (this.context.isInitialized()) {
                          this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "READ_ONLY_ELEMENT"));
                          return global_constants.SCORM_FALSE;
                      }
                      return global_constants.SCORM_TRUE;
                  }
                  if (typeof attribute === "undefined" || !this.context.checkObjectHasProperty(refObject, attribute)) {
                      this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                      return global_constants.SCORM_FALSE;
                  }
                  if (stringMatches(CMIElement, "\\.correct_responses\\.\\d+$") && this.context.isInitialized() && attribute !== "pattern") {
                      this.context.validateCorrectResponse(CMIElement, value);
                      if (this.context.getLastErrorCode() !== "0") {
                          this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "TYPE_MISMATCH"));
                          return global_constants.SCORM_FALSE;
                      }
                  }
                  if (!scorm2004 || this.context.getLastErrorCode() === "0") {
                      if (typeof attribute === "undefined" || attribute === "__proto__" || attribute === "constructor") {
                          this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                          return global_constants.SCORM_FALSE;
                      }
                      if (scorm2004 && attribute === "id" && this.context.isInitialized()) {
                          var duplicateError = this.context.checkForDuplicateId(CMIElement, value);
                          if (duplicateError) {
                              this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "GENERAL_SET_FAILURE"));
                              return global_constants.SCORM_FALSE;
                          }
                      }
                      refObject[attribute] = value;
                      return global_constants.SCORM_TRUE;
                  }
                  return global_constants.SCORM_FALSE;
              }
          },
          {
              /**
     * Traverses to the next level in the CMI path
     */ key: "traverseToNextLevel",
              value: function traverseToNextLevel(refObject, structure, idx, value, CMIElement, scorm2004, foundFirstIndex, invalidErrorCode, invalidErrorMessage) {
                  var attribute = structure[idx];
                  if (typeof attribute === "undefined" || !this.context.checkObjectHasProperty(refObject, attribute)) {
                      this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                      return {
                          refObject: refObject,
                          idx: idx,
                          foundFirstIndex: foundFirstIndex,
                          error: true
                      };
                  }
                  refObject = refObject[attribute];
                  if (!refObject) {
                      this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                      return {
                          refObject: refObject,
                          idx: idx,
                          foundFirstIndex: foundFirstIndex,
                          error: true
                      };
                  }
                  if (_instanceof$4(refObject, CMIArray)) {
                      var arrayResult = this.handleSetArrayAccess(refObject, structure, idx, value, CMIElement, scorm2004, foundFirstIndex, invalidErrorCode, invalidErrorMessage);
                      if (arrayResult.error) {
                          return {
                              refObject: refObject,
                              idx: idx,
                              foundFirstIndex: foundFirstIndex,
                              error: true
                          };
                      }
                      return arrayResult;
                  }
                  return {
                      refObject: refObject,
                      idx: idx,
                      foundFirstIndex: foundFirstIndex,
                      error: false
                  };
              }
          },
          {
              /**
     * Handles array access during set operations
     */ key: "handleSetArrayAccess",
              value: function handleSetArrayAccess(refObject, structure, idx, value, CMIElement, scorm2004, foundFirstIndex, invalidErrorCode, invalidErrorMessage) {
                  var index = parseInt(structure[idx + 1] || "0", 10);
                  if (!isNaN(index)) {
                      var item = refObject.childArray[index];
                      if (item) {
                          return {
                              refObject: item,
                              idx: idx + 1,
                              foundFirstIndex: true,
                              error: false
                          };
                      } else {
                          if (index > refObject.childArray.length) {
                              var errorCode = scorm2004 ? getErrorCode(this.context.errorCodes, "GENERAL_SET_FAILURE") : getErrorCode(this.context.errorCodes, "INVALID_SET_VALUE") || getErrorCode(this.context.errorCodes, "GENERAL_SET_FAILURE");
                              this.context.throwSCORMError(CMIElement, errorCode, "Cannot set array element at index ".concat(index, ". Array indices must be sequential. Current array length is ").concat(refObject.childArray.length, ", expected index ").concat(refObject.childArray.length, "."));
                              return {
                                  refObject: refObject,
                                  idx: idx,
                                  foundFirstIndex: foundFirstIndex,
                                  error: true
                              };
                          }
                          var newChild = this.context.getChildElement(CMIElement, value, foundFirstIndex);
                          if (!newChild) {
                              if (this.context.getLastErrorCode() === "0") {
                                  this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                              }
                              return {
                                  refObject: refObject,
                                  idx: idx,
                                  foundFirstIndex: foundFirstIndex,
                                  error: true
                              };
                          } else {
                              if (refObject.initialized) newChild.initialize();
                              refObject.childArray[index] = newChild;
                              return {
                                  refObject: newChild,
                                  idx: idx + 1,
                                  foundFirstIndex: true,
                                  error: false
                              };
                          }
                      }
                  }
                  return {
                      refObject: refObject,
                      idx: idx,
                      foundFirstIndex: foundFirstIndex,
                      error: false
                  };
              }
          },
          {
              /**
     * Validates an attribute during get operations
     */ key: "validateGetAttribute",
              value: function validateGetAttribute(refObject, attribute, CMIElement, scorm2004, invalidErrorCode, invalidErrorMessage, isFinalAttribute) {
                  if (!scorm2004) {
                      if (isFinalAttribute) {
                          if (typeof attribute === "undefined" || !this.context.checkObjectHasProperty(refObject, attribute)) {
                              if (attribute === "_children") {
                                  this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "CHILDREN_ERROR"));
                              } else if (attribute === "_count") {
                                  this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "COUNT_ERROR"));
                              } else {
                                  this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                              }
                              return {
                                  error: true
                              };
                          }
                      }
                  } else {
                      var attrStr = String(attribute);
                      if (attrStr.startsWith(TARGET_ATTRIBUTE_PREFIX) && typeof refObject._isTargetValid == "function") {
                          var target = attrStr.substring(TARGET_ATTRIBUTE_PREFIX.length, attrStr.length - 1);
                          return {
                              error: false,
                              returnValue: refObject._isTargetValid(target)
                          };
                      } else if (typeof attribute === "undefined" || !this.context.checkObjectHasProperty(refObject, attribute)) {
                          if (attribute === "_children") {
                              this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "GENERAL_GET_FAILURE"), "The data model element does not have children");
                              return {
                                  error: true
                              };
                          } else if (attribute === "_count") {
                              this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "GENERAL_GET_FAILURE"), "The data model element is not a collection and therefore does not have a count");
                              return {
                                  error: true
                              };
                          }
                          this.context.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                          return {
                              error: true
                          };
                      }
                  }
                  return {
                      error: false
                  };
              }
          },
          {
              /**
     * Handles array access during get operations
     */ key: "handleGetArrayAccess",
              value: function handleGetArrayAccess(refObject, structure, idx, CMIElement, uninitializedErrorMessage) {
                  var index = parseInt(structure[idx + 1] || "", 10);
                  if (!isNaN(index)) {
                      var item = refObject.childArray[index];
                      if (item) {
                          return {
                              refObject: item,
                              idx: idx + 1,
                              error: false
                          };
                      } else {
                          this.context.throwSCORMError(CMIElement, getErrorCode(this.context.errorCodes, "VALUE_NOT_INITIALIZED"), uninitializedErrorMessage);
                          return {
                              refObject: refObject,
                              idx: idx,
                              error: true
                          };
                      }
                  }
                  return {
                      refObject: refObject,
                      idx: idx,
                      error: false
                  };
              }
          }
      ]);
      return CMIValueAccessService;
  }();

  function _class_call_check$h(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$h(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$h(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$h(Constructor.prototype, protoProps);
      if (staticProps) _defineProperties$h(Constructor, staticProps);
      return Constructor;
  }
  function _type_of$g(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  var __defProp$f = Object.defineProperty;
  var __defNormalProp$f = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$f(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$f = function __publicField(obj, key, value) {
      return __defNormalProp$f(obj, (typeof key === "undefined" ? "undefined" : _type_of$g(key)) !== "symbol" ? key + "" : key, value);
  };
  var _LoggingService = /*#__PURE__*/ function() {
      function _LoggingService() {
          _class_call_check$h(this, _LoggingService);
          __publicField$f(this, "_logLevel", LogLevelEnum.ERROR);
          __publicField$f(this, "_logHandler");
          this._logHandler = defaultLogHandler;
      }
      _create_class$h(_LoggingService, [
          {
              /**
     * Set the log level
     *
     * @param {LogLevel} level - The log level to set
     */ key: "setLogLevel",
              value: function setLogLevel(level) {
                  this._logLevel = level;
              }
          },
          {
              /**
     * Get the current log level
     *
     * @returns {LogLevel} The current log level
     */ key: "getLogLevel",
              value: function getLogLevel() {
                  return this._logLevel;
              }
          },
          {
              /**
     * Set a custom log handler
     *
     * @param {Function} handler - The function to handle log messages
     */ key: "setLogHandler",
              value: function setLogHandler(handler) {
                  this._logHandler = handler;
              }
          },
          {
              /**
     * Log a message if the message level is greater than or equal to the current log level
     *
     * @param {LogLevel} messageLevel - The level of the message
     * @param {string} logMessage - The message to log
     *
     * @security LOG-INJECTION
     * Be aware that logMessage is passed through to the log handler without sanitization.
     * When logging user-controlled data (e.g., SCORM CMI values from content, URL parameters,
     * postMessage payloads), consider the following risks:
     *
     * 1. Log injection: Malicious input containing newlines or ANSI codes could pollute logs
     *    or create fake log entries that mislead security monitoring.
     *
     * 2. Information disclosure: Sensitive data in logs may be exposed to unauthorized viewers
     *    with log access (developers, support staff, aggregation systems).
     *
     * 3. Log storage exhaustion: Extremely large or repeated values could fill disk space
     *    or cause performance degradation in log processing systems.
     *
     * Defensive patterns:
     * - Truncate long values before logging (e.g., logMessage.substring(0, 500))
     * - Strip or escape newlines and control characters
     * - Redact sensitive fields (PII, credentials, session tokens)
     * - Implement custom log handlers that sanitize before writing to external systems
     * - Use structured logging formats (JSON) that escape values properly
     *
     * Example of safe logging for user-controlled data:
     * ```typescript
     * const sanitized = userInput.replace(/[\r\n\x00-\x1F\x7F]/g, '').substring(0, 200);
     * loggingService.info(`User input: ${sanitized}`);
     * ```
     */ key: "log",
              value: function log(messageLevel, logMessage) {
                  if (this.shouldLog(messageLevel)) {
                      this._logHandler(messageLevel, logMessage);
                  }
              }
          },
          {
              /**
     * Log a message at ERROR level
     *
     * @param {string} logMessage - The message to log
     */ key: "error",
              value: function error(logMessage) {
                  this.log(LogLevelEnum.ERROR, logMessage);
              }
          },
          {
              /**
     * Log a message at WARN level
     *
     * @param {string} logMessage - The message to log
     */ key: "warn",
              value: function warn(logMessage) {
                  this.log(LogLevelEnum.WARN, logMessage);
              }
          },
          {
              /**
     * Log a message at INFO level
     *
     * @param {string} logMessage - The message to log
     */ key: "info",
              value: function info(logMessage) {
                  this.log(LogLevelEnum.INFO, logMessage);
              }
          },
          {
              /**
     * Log a message at DEBUG level
     *
     * @param {string} logMessage - The message to log
     */ key: "debug",
              value: function debug(logMessage) {
                  this.log(LogLevelEnum.DEBUG, logMessage);
              }
          },
          {
              /**
     * Determine if a message should be logged based on its level and the current log level
     *
     * @param {LogLevel} messageLevel - The level of the message
     * @returns {boolean} Whether the message should be logged
     */ key: "shouldLog",
              value: function shouldLog(messageLevel) {
                  var numericMessageLevel = this.getNumericLevel(messageLevel);
                  var numericLogLevel = this.getNumericLevel(this._logLevel);
                  return numericMessageLevel >= numericLogLevel;
              }
          },
          {
              /**
     * Convert a log level to its numeric value
     *
     * @param {LogLevel} level - The log level to convert
     * @returns {number} The numeric value of the log level
     */ key: "getNumericLevel",
              value: function getNumericLevel(level) {
                  if (level === void 0) return LogLevelEnum.NONE;
                  if (typeof level === "number") return level;
                  var normalized = typeof level === "string" ? level.toUpperCase() : level;
                  switch(normalized){
                      case "1":
                      case "DEBUG":
                          return LogLevelEnum.DEBUG;
                      case "2":
                      case "INFO":
                          return LogLevelEnum.INFO;
                      case "3":
                      case "WARN":
                          return LogLevelEnum.WARN;
                      case "4":
                      case "ERROR":
                          return LogLevelEnum.ERROR;
                      case "5":
                      case "NONE":
                          return LogLevelEnum.NONE;
                      default:
                          return LogLevelEnum.ERROR;
                  }
              }
          }
      ], [
          {
              key: "getInstance",
              value: /**
     * Get the singleton instance of LoggingService
     *
     * @returns {LoggingService} The singleton instance
     */ function getInstance() {
                  if (!_LoggingService._instance) {
                      _LoggingService._instance = new _LoggingService();
                  }
                  return _LoggingService._instance;
              }
          }
      ]);
      return _LoggingService;
  }();
  __publicField$f(_LoggingService, "_instance");
  var LoggingService = _LoggingService;
  function getLoggingService() {
      return LoggingService.getInstance();
  }

  function _class_call_check$g(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$g(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$g(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$g(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _instanceof$3(left, right) {
      "@swc/helpers - instanceof";
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  function _type_of$f(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  var __defProp$e = Object.defineProperty;
  var __defNormalProp$e = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$e(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$e = function __publicField(obj, key, value) {
      return __defNormalProp$e(obj, (typeof key === "undefined" ? "undefined" : _type_of$f(key)) !== "symbol" ? key + "" : key, value);
  };
  var ErrorHandlingService = /*#__PURE__*/ function() {
      function ErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails, loggingService) {
          _class_call_check$g(this, ErrorHandlingService);
          __publicField$e(this, "_lastErrorCode", "0");
          __publicField$e(this, "_lastDiagnostic", "");
          __publicField$e(this, "_errorCodes");
          __publicField$e(this, "_apiLog");
          __publicField$e(this, "_getLmsErrorMessageDetails");
          __publicField$e(this, "_loggingService");
          this._errorCodes = errorCodes;
          this._apiLog = apiLog;
          this._getLmsErrorMessageDetails = getLmsErrorMessageDetails;
          this._loggingService = loggingService || getLoggingService();
      }
      _create_class$g(ErrorHandlingService, [
          {
              key: "lastErrorCode",
              get: /**
     * Get the last error code
     *
     * @return {string} - The last error code
     */ function get() {
                  return this._lastErrorCode;
              },
              set: /**
     * Set the last error code
     *
     * @param {string} errorCode - The error code to set
     */ function set(errorCode) {
                  this._lastErrorCode = errorCode;
              }
          },
          {
              key: "lastDiagnostic",
              get: /**
     * Get the last custom diagnostic message
     *
     * @return {string} - The last custom diagnostic message, or empty string if none
     */ function get() {
                  return this._lastDiagnostic;
              }
          },
          {
              /**
     * Throws a SCORM error
     *
     * @param {string} CMIElement
     * @param {number} errorNumber - The error number
     * @param {string} message - The error message
     * @throws {ValidationError} - If throwException is true, throws a ValidationError
     */ key: "throwSCORMError",
              value: function throwSCORMError(CMIElement, errorNumber, message) {
                  this._lastDiagnostic = message || "";
                  if (!message) {
                      message = this._getLmsErrorMessageDetails(errorNumber, true);
                  }
                  var formattedMessage = "SCORM Error ".concat(errorNumber, ": ").concat(message).concat(CMIElement ? " [Element: ".concat(CMIElement, "]") : "");
                  this._apiLog("throwSCORMError", errorNumber + ": " + message, LogLevelEnum.ERROR, CMIElement);
                  this._loggingService.error(formattedMessage);
                  this._lastErrorCode = String(errorNumber);
              }
          },
          {
              /**
     * Clears the last SCORM error code on success.
     *
     * @param {string} success - Whether the operation was successful
     */ key: "clearSCORMError",
              value: function clearSCORMError(success) {
                  if (success !== void 0 && success !== global_constants.SCORM_FALSE) {
                      this._lastErrorCode = "0";
                  }
              }
          },
          {
              /**
     * Handles exceptions that occur when accessing or setting CMI values.
     *
     * This method provides centralized error handling for exceptions that occur during
     * CMI data operations. It differentiates between different types of errors and
     * handles them appropriately:
     *
     * 1. ValidationError: These are expected errors from the validation system that
     *    indicate a specific SCORM error condition (like invalid data format or range).
     *    For these errors, the method:
     *    - Sets the lastErrorCode to the error code from the ValidationError
     *    - Returns SCORM_FALSE to indicate failure to the caller
     *
     * 2. Standard JavaScript Error: For general JavaScript errors (like TypeError,
     *    ReferenceError, etc.), the method:
     *    - Logs the error message with stack trace to the logging service
     *    - Sets a general SCORM error
     *    - Returns SCORM_FALSE to indicate failure
     *
     * 3. Unknown exceptions: For any other type of exception that doesn't match the
     *    above categories, the method:
     *    - Logs the entire exception object to the logging service
     *    - Sets a general SCORM error
     *    - Returns SCORM_FALSE to indicate failure
     *
     * This method is critical for maintaining SCORM compliance by ensuring that
     * all errors are properly translated into the appropriate SCORM error codes.
     *
     * @param {string} CMIElement
     * @param {ValidationError|Error|unknown} e - The exception that was thrown
     * @param {string} returnValue - The default return value (typically an empty string)
     * @return {string} - Either the original returnValue or SCORM_FALSE if an error occurred
     *
     * @example
     * try {
     *   const value = getCMIValue("cmi.core.score.raw");
     *   return value;
     * } catch (e) {
     *   return handleValueAccessException(e, "");
     * }
     */ key: "handleValueAccessException",
              value: function handleValueAccessException(CMIElement, e, returnValue) {
                  if (_instanceof$3(e, ValidationError)) {
                      var validationError = e;
                      this._lastErrorCode = String(validationError.errorCode);
                      this._lastDiagnostic = "";
                      var errorMessage = "Validation Error ".concat(validationError.errorCode, ": ").concat(validationError.message, " [Element: ").concat(CMIElement, "]");
                      this._loggingService.warn(errorMessage);
                      returnValue = global_constants.SCORM_FALSE;
                  } else if (_instanceof$3(e, Error)) {
                      var errorType = e.constructor.name;
                      var errorMessage1 = "".concat(errorType, ": ").concat(e.message, " [Element: ").concat(CMIElement, "]");
                      var stackTrace = e.stack || "";
                      this._loggingService.error("".concat(errorMessage1, "\n").concat(stackTrace));
                      this.throwSCORMError(CMIElement, this._errorCodes.GENERAL, "".concat(errorType, ": ").concat(e.message));
                      returnValue = global_constants.SCORM_FALSE;
                  } else {
                      var errorMessage2 = "Unknown error occurred while accessing [Element: ".concat(CMIElement, "]");
                      this._loggingService.error(errorMessage2);
                      try {
                          var errorDetails = JSON.stringify(e);
                          this._loggingService.error("Error details: ".concat(errorDetails));
                      } catch (jsonError) {
                          this._loggingService.error("Could not stringify error object for details");
                      }
                      this.throwSCORMError(CMIElement, this._errorCodes.GENERAL, "Unknown error");
                      returnValue = global_constants.SCORM_FALSE;
                  }
                  return returnValue;
              }
          },
          {
              key: "errorCodes",
              get: /**
     * Get the error codes object
     *
     * @return {ErrorCode} - The error codes object
     */ function get() {
                  return this._errorCodes;
              }
          }
      ]);
      return ErrorHandlingService;
  }();
  function createErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails, loggingService) {
      return new ErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails, loggingService);
  }

  function _class_call_check$f(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$f(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$f(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$f(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _type_of$e(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  var __defProp$d = Object.defineProperty;
  var __defNormalProp$d = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$d(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$d = function __publicField(obj, key, value) {
      return __defNormalProp$d(obj, (typeof key === "undefined" ? "undefined" : _type_of$e(key)) !== "symbol" ? key + "" : key, value);
  };
  var EventService = /*#__PURE__*/ function() {
      function EventService(apiLog) {
          _class_call_check$f(this, EventService);
          // Map of function names to listeners for faster lookups
          __publicField$d(this, "listenerMap", /* @__PURE__ */ new Map());
          // Total count of listeners for logging
          __publicField$d(this, "listenerCount", 0);
          // Function to log API messages
          __publicField$d(this, "apiLog");
          this.apiLog = apiLog;
      }
      _create_class$f(EventService, [
          {
              /**
     * Parses a listener name into its components
     *
     * @param {string} listenerName - The name of the listener
     * @returns {ParsedListener|null} - The parsed listener information or null if invalid
     */ key: "parseListenerName",
              value: function parseListenerName(listenerName) {
                  if (!listenerName) return null;
                  var listenerSplit = listenerName.split(".");
                  var functionName = listenerSplit[0];
                  var CMIElement = null;
                  if (listenerSplit.length > 1) {
                      CMIElement = listenerName.replace("".concat(functionName, "."), "");
                  }
                  return {
                      functionName: functionName !== null && functionName !== void 0 ? functionName : listenerName,
                      CMIElement: CMIElement
                  };
              }
          },
          {
              /**
     * Provides a mechanism for attaching to a specific SCORM event
     *
     * @param {string} listenerName - The name of the listener
     * @param {Function} callback - The callback function to execute when the event occurs
     */ key: "on",
              value: function on(listenerName, callback) {
                  if (!callback) return;
                  var listenerFunctions = listenerName.split(" ");
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      for(var _iterator = listenerFunctions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                          var listenerFunction = _step.value;
                          var _this_listenerMap_get;
                          var parsedListener = this.parseListenerName(listenerFunction);
                          if (!parsedListener) continue;
                          var functionName = parsedListener.functionName, CMIElement = parsedListener.CMIElement;
                          var listeners = (_this_listenerMap_get = this.listenerMap.get(functionName)) !== null && _this_listenerMap_get !== void 0 ? _this_listenerMap_get : [];
                          listeners.push({
                              functionName: functionName,
                              CMIElement: CMIElement,
                              callback: callback
                          });
                          this.listenerMap.set(functionName, listeners);
                          this.listenerCount++;
                          this.apiLog("on", "Added event listener: ".concat(this.listenerCount), LogLevelEnum.INFO, functionName);
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
              }
          },
          {
              /**
     * Provides a mechanism for detaching a specific SCORM event listener
     *
     * @param {string} listenerName - The name of the listener to remove
     * @param {Function} callback - The callback function to remove
     */ key: "off",
              value: function off(listenerName, callback) {
                  if (!callback) return;
                  var listenerFunctions = listenerName.split(" ");
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      var _this, _loop = function() {
                          var listenerFunction = _step.value;
                          var parsedListener = _this.parseListenerName(listenerFunction);
                          if (!parsedListener) return "continue";
                          var functionName = parsedListener.functionName, CMIElement = parsedListener.CMIElement;
                          var listeners = _this.listenerMap.get(functionName);
                          if (!listeners) return "continue";
                          var removeIndex = listeners.findIndex(function(obj) {
                              return obj.CMIElement === CMIElement && obj.callback === callback;
                          });
                          if (removeIndex !== -1) {
                              listeners.splice(removeIndex, 1);
                              _this.listenerCount--;
                              if (listeners.length === 0) {
                                  _this.listenerMap.delete(functionName);
                              }
                              _this.apiLog("off", "Removed event listener: ".concat(_this.listenerCount), LogLevelEnum.INFO, functionName);
                          }
                      };
                      for(var _iterator = listenerFunctions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_this = this, _loop();
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
              }
          },
          {
              /**
     * Provides a mechanism for clearing all listeners from a specific SCORM event
     *
     * Note: clear() differs from off() in CMIElement matching behavior:
     * - clear() with CMIElement=null removes ALL listeners for the function
     * - off() requires exact CMIElement match AND callback match
     * This allows clear() to remove all listeners at once, while off() is surgical.
     *
     * @param {string} listenerName - The name of the listener to clear
     */ key: "clear",
              value: function clear(listenerName) {
                  var listenerFunctions = listenerName.split(" ");
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      var _this, _loop = function() {
                          var listenerFunction = _step.value;
                          var parsedListener = _this.parseListenerName(listenerFunction);
                          if (!parsedListener) return "continue";
                          var functionName = parsedListener.functionName, CMIElement = parsedListener.CMIElement;
                          if (_this.listenerMap.has(functionName)) {
                              var listeners = _this.listenerMap.get(functionName);
                              var newListeners = CMIElement === null ? [] : listeners.filter(function(obj) {
                                  return obj.CMIElement !== CMIElement;
                              });
                              _this.listenerCount -= listeners.length - newListeners.length;
                              if (newListeners.length === 0) {
                                  _this.listenerMap.delete(functionName);
                              } else {
                                  _this.listenerMap.set(functionName, newListeners);
                              }
                          }
                      };
                      for(var _iterator = listenerFunctions[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true)_this = this, _loop();
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
              }
          },
          {
              /**
     * Processes any 'on' listeners that have been created
     *
     * @param {string} functionName - The name of the function that triggered the event
     * @param {string} CMIElement - The CMI element that was affected
     * @param {any} value - The value that was set
     * @param {CommitEventContext} context - Optional context for commit lifecycle events
     */ key: "processListeners",
              value: function processListeners(functionName, CMIElement, value, context) {
                  this.apiLog(functionName, value, LogLevelEnum.INFO, CMIElement);
                  var listeners = this.listenerMap.get(functionName);
                  if (!listeners) return;
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      for(var _iterator = listeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                          var listener = _step.value;
                          var listenerHasCMIElement = !!listener.CMIElement;
                          var CMIElementsMatch = false;
                          if (CMIElement && listener.CMIElement) {
                              if (listener.CMIElement.endsWith("*")) {
                                  var prefix = listener.CMIElement.slice(0, -1);
                                  CMIElementsMatch = CMIElement.startsWith(prefix);
                              } else {
                                  CMIElementsMatch = listener.CMIElement === CMIElement;
                              }
                          }
                          if (!listenerHasCMIElement || CMIElementsMatch) {
                              this.apiLog("processListeners", "Processing listener: ".concat(listener.functionName), LogLevelEnum.DEBUG, CMIElement);
                              if (functionName.startsWith("Sequence")) {
                                  listener.callback(value);
                              } else if (functionName === "CommitError") {
                                  if (context !== void 0) {
                                      listener.callback(value, context);
                                  } else {
                                      listener.callback(value);
                                  }
                              } else if (functionName === "CommitSuccess") {
                                  if (context !== void 0) {
                                      listener.callback(context);
                                  } else {
                                      listener.callback();
                                  }
                              } else {
                                  listener.callback(CMIElement, value);
                              }
                          }
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
              }
          },
          {
              /**
     * Resets the event service by clearing all listeners
     */ key: "reset",
              value: function reset() {
                  this.listenerMap.clear();
                  this.listenerCount = 0;
              }
          }
      ]);
      return EventService;
  }();

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
      try {
          var info = gen[key](arg);
          var value = info.value;
      } catch (error) {
          reject(error);
          return;
      }
      if (info.done) {
          resolve(value);
      } else {
          Promise.resolve(value).then(_next, _throw);
      }
  }
  function _async_to_generator(fn) {
      return function() {
          var self = this, args = arguments;
          return new Promise(function(resolve, reject) {
              var gen = fn.apply(self, args);
              function _next(value) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
              }
              function _throw(err) {
                  asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
              }
              _next(undefined);
          });
      };
  }
  function _class_call_check$e(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$e(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$e(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$e(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _define_property$3(obj, key, value) {
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
  function _instanceof$2(left, right) {
      "@swc/helpers - instanceof";
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  function _object_spread$3(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property$3(target, key, source[key]);
          });
      }
      return target;
  }
  function ownKeys$1(object, enumerableOnly) {
      var keys = Object.keys(object);
      if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          keys.push.apply(keys, symbols);
      }
      return keys;
  }
  function _object_spread_props$1(target, source) {
      source = source != null ? source : {};
      if (Object.getOwnPropertyDescriptors) {
          Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
          ownKeys$1(Object(source)).forEach(function(key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
          });
      }
      return target;
  }
  function _type_of$d(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _ts_generator(thisArg, body) {
      var f, y, t, _ = {
          label: 0,
          sent: function() {
              if (t[0] & 1) throw t[1];
              return t[1];
          },
          trys: [],
          ops: []
      }, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype), d = Object.defineProperty;
      return d(g, "next", {
          value: verb(0)
      }), d(g, "throw", {
          value: verb(1)
      }), d(g, "return", {
          value: verb(2)
      }), typeof Symbol === "function" && d(g, Symbol.iterator, {
          value: function() {
              return this;
          }
      }), g;
      function verb(n) {
          return function(v) {
              return step([
                  n,
                  v
              ]);
          };
      }
      function step(op) {
          if (f) throw new TypeError("Generator is already executing.");
          while(g && (g = 0, op[0] && (_ = 0)), _)try {
              if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
              if (y = 0, t) op = [
                  op[0] & 2,
                  t.value
              ];
              switch(op[0]){
                  case 0:
                  case 1:
                      t = op;
                      break;
                  case 4:
                      _.label++;
                      return {
                          value: op[1],
                          done: false
                      };
                  case 5:
                      _.label++;
                      y = op[1];
                      op = [
                          0
                      ];
                      continue;
                  case 7:
                      op = _.ops.pop();
                      _.trys.pop();
                      continue;
                  default:
                      if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                          _ = 0;
                          continue;
                      }
                      if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                          _.label = op[1];
                          break;
                      }
                      if (op[0] === 6 && _.label < t[1]) {
                          _.label = t[1];
                          t = op;
                          break;
                      }
                      if (t && _.label < t[2]) {
                          _.label = t[2];
                          _.ops.push(op);
                          break;
                      }
                      if (t[2]) _.ops.pop();
                      _.trys.pop();
                      continue;
              }
              op = body.call(thisArg, _);
          } catch (e) {
              op = [
                  6,
                  e
              ];
              y = 0;
          } finally{
              f = t = 0;
          }
          if (op[0] & 5) throw op[1];
          return {
              value: op[0] ? op[1] : void 0,
              done: true
          };
      }
  }
  var __defProp$c = Object.defineProperty;
  var __defNormalProp$c = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$c(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$c = function __publicField(obj, key, value) {
      return __defNormalProp$c(obj, (typeof key === "undefined" ? "undefined" : _type_of$d(key)) !== "symbol" ? key + "" : key, value);
  };
  var OfflineStorageService = /*#__PURE__*/ function() {
      function OfflineStorageService(settings, error_codes, apiLog) {
          _class_call_check$e(this, OfflineStorageService);
          __publicField$c(this, "apiLog", apiLog);
          __publicField$c(this, "settings");
          __publicField$c(this, "error_codes");
          __publicField$c(this, "storeName", "scorm_again_offline_data");
          __publicField$c(this, "syncQueue", "scorm_again_sync_queue");
          __publicField$c(this, "isOnline", navigator.onLine);
          __publicField$c(this, "syncInProgress", false);
          __publicField$c(this, "boundOnlineStatusChangeHandler");
          __publicField$c(this, "boundCustomNetworkStatusHandler");
          this.settings = settings;
          this.error_codes = error_codes;
          this.boundOnlineStatusChangeHandler = this.handleOnlineStatusChange.bind(this);
          this.boundCustomNetworkStatusHandler = this.handleCustomNetworkStatus.bind(this);
          window.addEventListener("online", this.boundOnlineStatusChangeHandler);
          window.addEventListener("offline", this.boundOnlineStatusChangeHandler);
          window.addEventListener("scorm-again:network-status", this.boundCustomNetworkStatusHandler);
      }
      _create_class$e(OfflineStorageService, [
          {
              /**
     * Handle changes in online status
     */ key: "handleOnlineStatusChange",
              value: function handleOnlineStatusChange() {
                  var _this = this;
                  var wasOnline = this.isOnline;
                  this.isOnline = navigator.onLine;
                  if (!wasOnline && this.isOnline) {
                      this.apiLog("OfflineStorageService", "Device is back online, attempting to sync...", LogLevelEnum.INFO);
                      this.syncOfflineData().then(function(success) {
                          if (success) {
                              _this.apiLog("OfflineStorageService", "Sync completed successfully", LogLevelEnum.INFO);
                          } else {
                              _this.apiLog("OfflineStorageService", "Sync failed", LogLevelEnum.ERROR);
                          }
                      }, function(error) {
                          _this.apiLog("OfflineStorageService", "Error during sync: ".concat(error), LogLevelEnum.ERROR);
                      });
                  } else if (wasOnline && !this.isOnline) {
                      this.apiLog("OfflineStorageService", "Device is offline, data will be stored locally", LogLevelEnum.INFO);
                  }
              }
          },
          {
              /**
     * Handle custom network status events from external code
     * This allows mobile apps or other external code to programmatically update network status
     * @param {Event} event - The custom event containing network status
     */ key: "handleCustomNetworkStatus",
              value: function handleCustomNetworkStatus(event) {
                  var _this = this;
                  if (!_instanceof$2(event, CustomEvent)) {
                      this.apiLog("OfflineStorageService", "Invalid network status event received", LogLevelEnum.WARN);
                      return;
                  }
                  var online = event.detail.online;
                  if (typeof online !== "boolean") {
                      this.apiLog("OfflineStorageService", "Invalid online status value in custom event", LogLevelEnum.WARN);
                      return;
                  }
                  var wasOnline = this.isOnline;
                  this.isOnline = online;
                  this.apiLog("OfflineStorageService", "Network status updated via custom event: ".concat(online ? "online" : "offline"), LogLevelEnum.INFO);
                  if (!wasOnline && this.isOnline) {
                      this.apiLog("OfflineStorageService", "Device is back online, attempting to sync...", LogLevelEnum.INFO);
                      this.syncOfflineData().then(function(success) {
                          if (success) {
                              _this.apiLog("OfflineStorageService", "Sync completed successfully", LogLevelEnum.INFO);
                          } else {
                              _this.apiLog("OfflineStorageService", "Sync failed", LogLevelEnum.ERROR);
                          }
                      }, function(error) {
                          _this.apiLog("OfflineStorageService", "Error during sync: ".concat(error), LogLevelEnum.ERROR);
                      });
                  } else if (wasOnline && !this.isOnline) {
                      this.apiLog("OfflineStorageService", "Device is offline, data will be stored locally", LogLevelEnum.INFO);
                  }
              }
          },
          {
              /**
     * Store commit data offline
     * @param {string} courseId - Identifier for the course
     * @param {CommitObject} commitData - The data to store offline
     * @param {OfflineCommitMetadata} metadata - Metadata captured with the original commit
     * @returns {ResultObject} - Result of the storage operation
     */ key: "storeOffline",
              value: function storeOffline(courseId, commitData, metadata) {
                  try {
                      var queueItem = _object_spread$3({
                          id: "".concat(courseId, "_").concat(Date.now(), "_").concat(Math.random().toString(36).substring(2, 9)),
                          courseId: courseId,
                          timestamp: Date.now(),
                          data: commitData,
                          syncAttempts: 0
                      }, (metadata === null || metadata === void 0 ? void 0 : metadata.isTerminateCommit) !== void 0 ? {
                          isTerminateCommit: metadata.isTerminateCommit
                      } : {}, (metadata === null || metadata === void 0 ? void 0 : metadata.sequence) !== void 0 ? {
                          sequence: metadata.sequence
                      } : {});
                      var currentQueue = this.getFromStorage(this.syncQueue) || [];
                      currentQueue.push(queueItem);
                      this.saveToStorage(this.syncQueue, currentQueue);
                      this.saveToStorage("".concat(this.storeName, "_").concat(courseId), commitData);
                      this.apiLog("OfflineStorageService", "Stored data offline for course ".concat(courseId), LogLevelEnum.INFO);
                      return {
                          result: global_constants.SCORM_TRUE,
                          errorCode: 0
                      };
                  } catch (error) {
                      var _this_error_codes_GENERAL;
                      var errorMessage = _instanceof$2(error, Error) ? error.message : String(error);
                      var isQuotaError = errorMessage.includes("storage quota");
                      this.apiLog("OfflineStorageService", isQuotaError ? "storage quota exceeded - cannot store offline data for course ".concat(courseId) : "Error storing offline data: ".concat(error), LogLevelEnum.ERROR);
                      return {
                          result: global_constants.SCORM_FALSE,
                          errorCode: (_this_error_codes_GENERAL = this.error_codes.GENERAL) !== null && _this_error_codes_GENERAL !== void 0 ? _this_error_codes_GENERAL : 0
                      };
                  }
              }
          },
          {
              key: "getOfflineData",
              value: /**
     * Get the stored offline data for a course
     * @param {string} courseId - Identifier for the course
     * @returns {Promise<CommitObject|null>} - The stored data or null if not found
     */ function getOfflineData(courseId) {
                  return _async_to_generator(function() {
                      var data;
                      return _ts_generator(this, function(_state) {
                          try {
                              data = this.getFromStorage("".concat(this.storeName, "_").concat(courseId));
                              return [
                                  2,
                                  data || null
                              ];
                          } catch (error) {
                              this.apiLog("OfflineStorageService", "Error retrieving offline data: ".concat(error), LogLevelEnum.ERROR);
                              return [
                                  2,
                                  null
                              ];
                          }
                          return [
                              2
                          ];
                      });
                  }).call(this);
              }
          },
          {
              key: "syncOfflineData",
              value: /**
     * Synchronize offline data with the LMS when connection is available
     * @returns {Promise<boolean>} - Success status of synchronization
     */ function syncOfflineData() {
                  return _async_to_generator(function() {
                      var syncQueue, remainingQueue, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, item, _this_settings_maxSyncAttempts, maxAttempts, syncResult, error, err, error1;
                      return _ts_generator(this, function(_state) {
                          switch(_state.label){
                              case 0:
                                  if (this.syncInProgress || !this.isOnline) {
                                      return [
                                          2,
                                          false
                                      ];
                                  }
                                  this.syncInProgress = true;
                                  _state.label = 1;
                              case 1:
                                  _state.trys.push([
                                      1,
                                      12,
                                      ,
                                      13
                                  ]);
                                  syncQueue = this.getFromStorage(this.syncQueue) || [];
                                  if (syncQueue.length === 0) {
                                      this.syncInProgress = false;
                                      return [
                                          2,
                                          true
                                      ];
                                  }
                                  this.apiLog("OfflineStorageService", "Found ".concat(syncQueue.length, " items to sync"), LogLevelEnum.INFO);
                                  remainingQueue = [];
                                  _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                                  _state.label = 2;
                              case 2:
                                  _state.trys.push([
                                      2,
                                      9,
                                      10,
                                      11
                                  ]);
                                  _iterator = syncQueue[Symbol.iterator]();
                                  _state.label = 3;
                              case 3:
                                  if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done)) return [
                                      3,
                                      8
                                  ];
                                  item = _step.value;
                                  maxAttempts = (_this_settings_maxSyncAttempts = this.settings.maxSyncAttempts) !== null && _this_settings_maxSyncAttempts !== void 0 ? _this_settings_maxSyncAttempts : 5;
                                  if (item.syncAttempts >= maxAttempts) {
                                      this.apiLog("OfflineStorageService", "Removing abandoned item ".concat(item.id, " after ").concat(maxAttempts, " failed sync attempts"), LogLevelEnum.WARN);
                                      return [
                                          3,
                                          7
                                      ];
                                  }
                                  _state.label = 4;
                              case 4:
                                  _state.trys.push([
                                      4,
                                      6,
                                      ,
                                      7
                                  ]);
                                  return [
                                      4,
                                      this.sendDataToLMS(item.data, _object_spread$3({}, item.isTerminateCommit !== void 0 ? {
                                          isTerminateCommit: item.isTerminateCommit
                                      } : {}, item.sequence !== void 0 ? {
                                          sequence: item.sequence
                                      } : {}))
                                  ];
                              case 5:
                                  syncResult = _state.sent();
                                  if (syncResult.result === true || syncResult.result === global_constants.SCORM_TRUE) {
                                      this.apiLog("OfflineStorageService", "Successfully synced item ".concat(item.id), LogLevelEnum.INFO);
                                  } else {
                                      item.syncAttempts++;
                                      remainingQueue.push(item);
                                      this.apiLog("OfflineStorageService", "Failed to sync item ".concat(item.id, ", attempt #").concat(item.syncAttempts), LogLevelEnum.WARN);
                                  }
                                  return [
                                      3,
                                      7
                                  ];
                              case 6:
                                  error = _state.sent();
                                  item.syncAttempts++;
                                  remainingQueue.push(item);
                                  this.apiLog("OfflineStorageService", "Error syncing item ".concat(item.id, ": ").concat(error), LogLevelEnum.ERROR);
                                  return [
                                      3,
                                      7
                                  ];
                              case 7:
                                  _iteratorNormalCompletion = true;
                                  return [
                                      3,
                                      3
                                  ];
                              case 8:
                                  return [
                                      3,
                                      11
                                  ];
                              case 9:
                                  err = _state.sent();
                                  _didIteratorError = true;
                                  _iteratorError = err;
                                  return [
                                      3,
                                      11
                                  ];
                              case 10:
                                  try {
                                      if (!_iteratorNormalCompletion && _iterator.return != null) {
                                          _iterator.return();
                                      }
                                  } finally{
                                      if (_didIteratorError) {
                                          throw _iteratorError;
                                      }
                                  }
                                  return [
                                      7
                                  ];
                              case 11:
                                  this.saveToStorage(this.syncQueue, remainingQueue);
                                  this.apiLog("OfflineStorageService", "Sync completed. ".concat(syncQueue.length - remainingQueue.length, " items synced, ").concat(remainingQueue.length, " items remaining"), LogLevelEnum.INFO);
                                  this.syncInProgress = false;
                                  return [
                                      2,
                                      true
                                  ];
                              case 12:
                                  error1 = _state.sent();
                                  this.apiLog("OfflineStorageService", "Error during sync process: ".concat(error1), LogLevelEnum.ERROR);
                                  this.syncInProgress = false;
                                  return [
                                      2,
                                      false
                                  ];
                              case 13:
                                  return [
                                      2
                                  ];
                          }
                      });
                  }).call(this);
              }
          },
          {
              key: "sendDataToLMS",
              value: /**
     * Send data to the LMS when online
     * @param {CommitObject} data - The data to send to the LMS
     * @param {OfflineCommitMetadata} metadata - Metadata captured with the original commit
     * @returns {Promise<ResultObject>} - Result of the sync operation
     */ function sendDataToLMS(data, metadata) {
                  return _async_to_generator(function() {
                      var configuredCommitUrl, _ref, lmsCommitUrl, processedData, requestUrl, init, response, result, _tmp, error;
                      return _ts_generator(this, function(_state) {
                          switch(_state.label){
                              case 0:
                                  configuredCommitUrl = this.settings.lmsCommitUrl;
                                  if (!configuredCommitUrl) {
                                      return [
                                          2,
                                          {
                                              result: global_constants.SCORM_FALSE,
                                              errorCode: this.error_codes.GENERAL || 101
                                          }
                                      ];
                                  }
                                  _state.label = 1;
                              case 1:
                                  _state.trys.push([
                                      1,
                                      7,
                                      ,
                                      8
                                  ]);
                                  lmsCommitUrl = String(configuredCommitUrl);
                                  processedData = this.settings.requestHandler(data, _object_spread$3({
                                      isTerminateCommit: (_ref = metadata === null || metadata === void 0 ? void 0 : metadata.isTerminateCommit) !== null && _ref !== void 0 ? _ref : false,
                                      trigger: "offline-replay"
                                  }, (metadata === null || metadata === void 0 ? void 0 : metadata.sequence) !== void 0 ? {
                                      sequence: metadata.sequence
                                  } : {}));
                                  requestUrl = (metadata === null || metadata === void 0 ? void 0 : metadata.isTerminateCommit) && this.settings.terminateCommitParam ? appendQueryParam(lmsCommitUrl, this.settings.terminateCommitParam, "true") : lmsCommitUrl;
                                  init = {
                                      method: "POST",
                                      mode: this.settings.fetchMode,
                                      body: JSON.stringify(processedData),
                                      headers: _object_spread_props$1(_object_spread$3({}, this.settings.xhrHeaders), {
                                          "Content-Type": this.settings.commitRequestDataType
                                      })
                                  };
                                  if (this.settings.xhrWithCredentials) {
                                      init.credentials = "include";
                                  }
                                  return [
                                      4,
                                      fetch(requestUrl, init)
                                  ];
                              case 2:
                                  response = _state.sent();
                                  if (!(typeof this.settings.responseHandler === "function")) return [
                                      3,
                                      4
                                  ];
                                  return [
                                      4,
                                      this.settings.responseHandler(response)
                                  ];
                              case 3:
                                  _tmp = _state.sent();
                                  return [
                                      3,
                                      6
                                  ];
                              case 4:
                                  return [
                                      4,
                                      response.json()
                                  ];
                              case 5:
                                  _tmp = _state.sent();
                                  _state.label = 6;
                              case 6:
                                  result = _tmp;
                                  if (response.status >= 200 && response.status <= 299 && (result.result === true || result.result === global_constants.SCORM_TRUE)) {
                                      if (!Object.hasOwnProperty.call(result, "errorCode")) {
                                          result.errorCode = 0;
                                      }
                                      return [
                                          2,
                                          result
                                      ];
                                  } else {
                                      if (!Object.hasOwnProperty.call(result, "errorCode")) {
                                          result.errorCode = this.error_codes.GENERAL;
                                      }
                                      return [
                                          2,
                                          result
                                      ];
                                  }
                              case 7:
                                  error = _state.sent();
                                  this.apiLog("OfflineStorageService", "Error sending data to LMS: ".concat(error), LogLevelEnum.ERROR);
                                  return [
                                      2,
                                      {
                                          result: global_constants.SCORM_FALSE,
                                          errorCode: this.error_codes.GENERAL || 101
                                      }
                                  ];
                              case 8:
                                  return [
                                      2
                                  ];
                          }
                      });
                  }).call(this);
              }
          },
          {
              /**
     * Check if the device is currently online
     * @returns {boolean} - Online status
     */ key: "isDeviceOnline",
              value: function isDeviceOnline() {
                  return this.isOnline;
              }
          },
          {
              // noinspection JSValidateJSDoc
              /**
     * Get item from localStorage
     * @param {string} key - The key to retrieve
     * @returns {T|null} - The retrieved data
     */ key: "getFromStorage",
              value: function getFromStorage(key) {
                  var storedData = localStorage.getItem(key);
                  if (storedData) {
                      try {
                          return JSON.parse(storedData);
                      } catch (e) {
                          return null;
                      }
                  }
                  return null;
              }
          },
          {
              /**
     * Save item to localStorage
     * @param {string} key - The key to store under
     * @param {any} data - The data to store
     * @returns {void}
     * @throws {Error} Re-throws QuotaExceededError for handling upstream
     */ key: "saveToStorage",
              value: function saveToStorage(key, data) {
                  try {
                      localStorage.setItem(key, JSON.stringify(data));
                  } catch (error) {
                      if (_instanceof$2(error, DOMException) && error.name === "QuotaExceededError") {
                          throw new Error("storage quota exceeded - localStorage is full", {
                              cause: error
                          });
                      }
                      throw error;
                  }
              }
          },
          {
              key: "hasPendingOfflineData",
              value: /**
     * Check if there is pending offline data for a course
     * @param {string} courseId - Identifier for the course
     * @returns {Promise<boolean>} - Whether there is pending data
     */ function hasPendingOfflineData(courseId) {
                  return _async_to_generator(function() {
                      var queue;
                      return _ts_generator(this, function(_state) {
                          queue = this.getFromStorage(this.syncQueue) || [];
                          return [
                              2,
                              queue.some(function(item) {
                                  return item.courseId === courseId;
                              })
                          ];
                      });
                  }).call(this);
              }
          },
          {
              /**
     * Update the service settings
     * @param {Settings} settings - The new settings
     */ key: "updateSettings",
              value: function updateSettings(settings) {
                  this.settings = settings;
              }
          },
          {
              /**
     * Clean up event listeners
     * Should be called when the service is no longer needed
     */ key: "destroy",
              value: function destroy() {
                  window.removeEventListener("online", this.boundOnlineStatusChangeHandler);
                  window.removeEventListener("offline", this.boundOnlineStatusChangeHandler);
                  window.removeEventListener("scorm-again:network-status", this.boundCustomNetworkStatusHandler);
              }
          }
      ]);
      return OfflineStorageService;
  }();

  function _type_of$c(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  var checkValidFormat = memoize(function(CMIElement, value, regexPattern, errorCode, errorClass, allowEmptyString) {
      if (typeof value !== "string") {
          return false;
      }
      var formatRegex = new RegExp(regexPattern);
      var matches = value.match(formatRegex);
      if (allowEmptyString && value === "") {
          return true;
      }
      if (!matches || matches[0] === "") {
          throw new errorClass(CMIElement, errorCode);
      }
      return true;
  }, // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  function(CMIElement, value, regexPattern, errorCode, _errorClass, allowEmptyString) {
      var valueKey = typeof value === "string" ? value : "[".concat(typeof value === "undefined" ? "undefined" : _type_of$c(value), "]");
      return "".concat(CMIElement, ":").concat(valueKey, ":").concat(regexPattern, ":").concat(errorCode, ":").concat(allowEmptyString || false);
  });
  var checkValidRange = memoize(function(CMIElement, value, rangePattern, errorCode, errorClass) {
      var ranges = rangePattern.split("#");
      value = Number(value);
      if (isNaN(value)) {
          throw new errorClass(CMIElement, errorCode);
      }
      var minBound = ranges[0];
      var maxBound = ranges[1];
      var hasMinimum = minBound !== void 0 && minBound !== "";
      var hasMaximum = maxBound !== void 0 && maxBound !== "" && maxBound !== "*";
      if (hasMinimum && value < Number(minBound)) {
          throw new errorClass(CMIElement, errorCode);
      }
      if (hasMaximum && value > Number(maxBound)) {
          throw new errorClass(CMIElement, errorCode);
      }
      return true;
  }, // Custom key function that excludes the error class from the cache key
  // since it can't be stringified and doesn't affect the validation result
  function(CMIElement, value, rangePattern, errorCode, _errorClass) {
      return "".concat(CMIElement, ":").concat(value, ":").concat(rangePattern, ":").concat(errorCode);
  });

  function _array_like_to_array$3(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _array_without_holes$1(arr) {
      if (Array.isArray(arr)) return _array_like_to_array$3(arr);
  }
  function _class_call_check$d(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$d(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$d(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$d(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _define_property$2(obj, key, value) {
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
  function _iterable_to_array$1(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _non_iterable_spread$1() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _object_spread$2(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property$2(target, key, source[key]);
          });
      }
      return target;
  }
  function _to_consumable_array$1(arr) {
      return _array_without_holes$1(arr) || _iterable_to_array$1(arr) || _unsupported_iterable_to_array$3(arr) || _non_iterable_spread$1();
  }
  function _type_of$b(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _unsupported_iterable_to_array$3(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$3(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$3(o, minLen);
  }
  var __defProp$b = Object.defineProperty;
  var __defNormalProp$b = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$b(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$b = function __publicField(obj, key, value) {
      return __defNormalProp$b(obj, (typeof key === "undefined" ? "undefined" : _type_of$b(key)) !== "symbol" ? key + "" : key, value);
  };
  var DeliveryRequest = function DeliveryRequest() {
      var valid = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false, targetActivity = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null, exception = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : null;
      _class_call_check$d(this, DeliveryRequest);
      __publicField$b(this, "valid");
      __publicField$b(this, "targetActivity");
      __publicField$b(this, "exception");
      this.valid = valid;
      this.targetActivity = targetActivity;
      this.exception = exception;
  };
  var _DeliveryHandler = /*#__PURE__*/ function() {
      function _DeliveryHandler(activityTree, rollupProcess, globalObjectiveMap) {
          var adlNav = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : null, eventCallback = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : null, options = arguments.length > 5 ? arguments[5] : void 0;
          _class_call_check$d(this, _DeliveryHandler);
          __publicField$b(this, "activityTree");
          __publicField$b(this, "rollupProcess");
          __publicField$b(this, "globalObjectiveMap");
          __publicField$b(this, "adlNav");
          __publicField$b(this, "eventCallback");
          __publicField$b(this, "now");
          __publicField$b(this, "defaultHideLmsUi");
          __publicField$b(this, "defaultAuxiliaryResources");
          __publicField$b(this, "_deliveryInProgress", false);
          __publicField$b(this, "contentDelivered", false);
          __publicField$b(this, "checkActivityCallback", null);
          __publicField$b(this, "invalidateCacheCallback", null);
          __publicField$b(this, "updateNavigationValidityCallback", null);
          __publicField$b(this, "clearSuspendedActivityCallback", null);
          this.activityTree = activityTree;
          this.rollupProcess = rollupProcess;
          this.globalObjectiveMap = globalObjectiveMap;
          this.adlNav = adlNav;
          this.eventCallback = eventCallback;
          this.now = (options === null || options === void 0 ? void 0 : options.now) || function() {
              return /* @__PURE__ */ new Date();
          };
          this.defaultHideLmsUi = (options === null || options === void 0 ? void 0 : options.defaultHideLmsUi) ? _to_consumable_array$1(options.defaultHideLmsUi) : [];
          this.defaultAuxiliaryResources = (options === null || options === void 0 ? void 0 : options.defaultAuxiliaryResources) ? options.defaultAuxiliaryResources.map(function(resource) {
              return _object_spread$2({}, resource);
          }) : [];
      }
      _create_class$d(_DeliveryHandler, [
          {
              /**
     * Set callback to check activity validity
     */ key: "setCheckActivityCallback",
              value: function setCheckActivityCallback(callback) {
                  this.checkActivityCallback = callback;
              }
          },
          {
              /**
     * Set callback to invalidate navigation cache after state changes
     */ key: "setInvalidateCacheCallback",
              value: function setInvalidateCacheCallback(callback) {
                  this.invalidateCacheCallback = callback;
              }
          },
          {
              /**
     * Set callback to update navigation validity
     */ key: "setUpdateNavigationValidityCallback",
              value: function setUpdateNavigationValidityCallback(callback) {
                  this.updateNavigationValidityCallback = callback;
              }
          },
          {
              /**
     * Set callback to clear suspended activity
     */ key: "setClearSuspendedActivityCallback",
              value: function setClearSuspendedActivityCallback(callback) {
                  this.clearSuspendedActivityCallback = callback;
              }
          },
          {
              /**
     * Check if content delivery is currently in progress
     * Used to prevent re-entrant termination requests during delivery
     */ key: "isDeliveryInProgress",
              value: function isDeliveryInProgress() {
                  return this._deliveryInProgress;
              }
          },
          {
              /**
     * Check if content has been delivered
     */ key: "hasContentBeenDelivered",
              value: function hasContentBeenDelivered() {
                  return this.contentDelivered;
              }
          },
          {
              /**
     * Reset content delivered flag
     */ key: "resetContentDelivered",
              value: function resetContentDelivered() {
                  this.contentDelivered = false;
              }
          },
          {
              /**
     * Set content delivered flag
     * @param {boolean} value - The value to set
     */ key: "setContentDelivered",
              value: function setContentDelivered(value) {
                  this.contentDelivered = value;
              }
          },
          {
              /**
     * Delivery Request Process
     * Validates if an activity can be delivered
     * @spec SN Book: DB.1.1 (Delivery Request Process)
     * @param {Activity} activity - The activity to deliver
     * @return {DeliveryRequest} - The delivery validation result
     */ key: "processDeliveryRequest",
              value: function processDeliveryRequest(activity) {
                  this.fireEvent("onDeliveryRequestProcessing", {
                      activity: activity.id,
                      timestamp: /* @__PURE__ */ new Date().toISOString()
                  });
                  if (activity.children.length > 0) {
                      return new DeliveryRequest(false, null, "DB.1.1-1");
                  }
                  var activityPath = this.getActivityPath(activity, true);
                  if (activityPath.length === 0) {
                      return new DeliveryRequest(false, null, "DB.1.1-2");
                  }
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      for(var _iterator = activityPath[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                          var pathActivity = _step.value;
                          var checkResult = this.checkActivityCallback ? this.checkActivityCallback(pathActivity) : true;
                          if (!checkResult) {
                              return new DeliveryRequest(false, null, "DB.1.1-3");
                          }
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
                  return new DeliveryRequest(true, activity);
              }
          },
          {
              /**
     * Content Delivery Environment Process
     * Handles the delivery of content to the learner
     * @spec SN Book: DB.2 (Content Delivery Environment Process)
     * @param {Activity} activity - The activity to deliver
     */ key: "contentDeliveryEnvironmentProcess",
              value: function contentDeliveryEnvironmentProcess(activity) {
                  this._deliveryInProgress = true;
                  try {
                      var isResuming = activity.isSuspended;
                      if (this.activityTree.suspendedActivity) {
                          if (this.clearSuspendedActivityCallback) {
                              this.clearSuspendedActivityCallback();
                          }
                      }
                      var activityPath = this.getActivityPath(activity, true);
                      var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                      try {
                          for(var _iterator = activityPath[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                              var pathActivity = _step.value;
                              if (!pathActivity.isActive) {
                                  if (isResuming || pathActivity.isSuspended) {
                                      pathActivity.isSuspended = false;
                                  } else {
                                      pathActivity.incrementAttemptCount();
                                  }
                                  pathActivity.isActive = true;
                                  SelectionRandomization.applySelectionAndRandomization(pathActivity, pathActivity.attemptCount <= 1);
                              }
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
                      this.activityTree.currentActivity = activity;
                      this.initializeForDelivery(activity);
                      this.setupAttemptTracking(activity);
                      this.contentDelivered = true;
                      if (this.adlNav && this.updateNavigationValidityCallback) {
                          this.updateNavigationValidityCallback();
                      }
                      this.fireDeliveryEvent(activity);
                  } finally{
                      this._deliveryInProgress = false;
                  }
              }
          },
          {
              /**
     * Initialize Activity For Delivery (DB.2.2)
     * Set up initial tracking states for a delivered activity
     * @param {Activity} activity - The activity being delivered
     */ key: "initializeForDelivery",
              value: function initializeForDelivery(activity) {
                  if (activity.completionStatus === "unknown") {
                      if (activity.children.length === 0) {
                          activity.completionStatus = "not attempted";
                      }
                  }
                  if (activity.objectiveSatisfiedStatus === null) {
                      activity.objectiveSatisfiedStatus = false;
                  }
                  if (activity.progressMeasure === null) {
                      activity.progressMeasure = 0;
                      activity.progressMeasureStatus = false;
                  }
                  if (activity.objectiveNormalizedMeasure === null) {
                      activity.objectiveNormalizedMeasure = 0;
                      activity.objectiveMeasureStatus = false;
                  }
                  activity.attemptAbsoluteDuration = "PT0H0M0S";
                  activity.attemptExperiencedDuration = "PT0H0M0S";
                  activity.isAvailable = true;
              }
          },
          {
              /**
     * Setup Activity Attempt Tracking
     * Initialize attempt tracking information per SCORM 2004 4th Edition
     * @param {Activity} activity - The activity being delivered
     */ key: "setupAttemptTracking",
              value: function setupAttemptTracking(activity) {
                  activity.wasSkipped = false;
                  activity.attemptAbsoluteStartTime = this.now().toISOString();
                  if (!activity.location) {
                      activity.location = "";
                  }
                  activity.activityAttemptActive = true;
                  if (!activity.learnerPrefs) {
                      activity.learnerPrefs = {
                          audioCaptioning: "0",
                          audioLevel: "1",
                          deliverySpeed: "1",
                          language: ""
                      };
                  }
              }
          },
          {
              /**
     * Fire Activity Delivery Event
     * Notify listeners that an activity has been delivered
     * @param {Activity} activity - The activity that was delivered
     */ key: "fireDeliveryEvent",
              value: function fireDeliveryEvent(activity) {
                  try {
                      if (this.eventCallback) {
                          this.eventCallback("onActivityDelivery", activity);
                      }
                      console.debug("Activity delivered: ".concat(activity.id, " - ").concat(activity.title));
                  } catch (error) {
                      console.warn("Failed to fire activity delivery event: ".concat(error));
                  }
              }
          },
          {
              /**
     * Get effective hideLmsUi for an activity
     * Merges default and activity-specific hideLmsUi directives
     * @param {Activity | null} activity - The activity
     * @return {HideLmsUiItem[]} - Ordered list of hideLmsUi directives
     */ key: "getEffectiveHideLmsUi",
              value: function getEffectiveHideLmsUi(activity) {
                  var seen = /* @__PURE__ */ new Set();
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      for(var _iterator = this.defaultHideLmsUi[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                          var directive = _step.value;
                          seen.add(directive);
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
                  var current = activity;
                  while(current){
                      var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                      try {
                          for(var _iterator1 = current.hideLmsUi[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                              var directive1 = _step1.value;
                              seen.add(directive1);
                          }
                      } catch (err) {
                          _didIteratorError1 = true;
                          _iteratorError1 = err;
                      } finally{
                          try {
                              if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                  _iterator1.return();
                              }
                          } finally{
                              if (_didIteratorError1) {
                                  throw _iteratorError1;
                              }
                          }
                      }
                      current = current.parent;
                  }
                  return _DeliveryHandler.HIDE_LMS_UI_ORDER.filter(function(directive) {
                      return seen.has(directive);
                  });
              }
          },
          {
              /**
     * Get effective auxiliary resources for an activity
     * Merges default and activity-specific resources
     * @param {Activity | null} activity - The activity
     * @return {AuxiliaryResource[]} - Merged auxiliary resources
     */ key: "getEffectiveAuxiliaryResources",
              value: function getEffectiveAuxiliaryResources(activity) {
                  var merged = /* @__PURE__ */ new Map();
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      for(var _iterator = this.defaultAuxiliaryResources[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                          var resource = _step.value;
                          if (resource.resourceId) {
                              merged.set(resource.resourceId, _object_spread$2({}, resource));
                          }
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
                  var lineage = [];
                  var current = activity;
                  while(current){
                      lineage.push(current);
                      current = current.parent;
                  }
                  var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                  try {
                      for(var _iterator1 = lineage.reverse()[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                          var node = _step1.value;
                          var _iteratorNormalCompletion2 = true, _didIteratorError2 = false, _iteratorError2 = undefined;
                          try {
                              for(var _iterator2 = node.auxiliaryResources[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true){
                                  var resource1 = _step2.value;
                                  if (resource1.resourceId) {
                                      merged.set(resource1.resourceId, _object_spread$2({}, resource1));
                                  }
                              }
                          } catch (err) {
                              _didIteratorError2 = true;
                              _iteratorError2 = err;
                          } finally{
                              try {
                                  if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                                      _iterator2.return();
                                  }
                              } finally{
                                  if (_didIteratorError2) {
                                      throw _iteratorError2;
                                  }
                              }
                          }
                      }
                  } catch (err) {
                      _didIteratorError1 = true;
                      _iteratorError1 = err;
                  } finally{
                      try {
                          if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                              _iterator1.return();
                          }
                      } finally{
                          if (_didIteratorError1) {
                              throw _iteratorError1;
                          }
                      }
                  }
                  return Array.from(merged.values());
              }
          },
          {
              /**
     * Get content activity data for a delivered activity
     * @param {Activity} activity - The activity
     * @return {ContentActivityData} - Content activity data
     */ key: "getContentActivityData",
              value: function getContentActivityData(activity) {
                  var _activity_completionThreshold;
                  return {
                      hideLmsUi: this.getEffectiveHideLmsUi(activity),
                      auxiliaryResources: this.getEffectiveAuxiliaryResources(activity),
                      location: activity.location || "",
                      credit: activity.credit || "credit",
                      launchData: activity.launchData || "",
                      maxTimeAllowed: activity.attemptAbsoluteDurationLimit || "",
                      completionThreshold: ((_activity_completionThreshold = activity.completionThreshold) === null || _activity_completionThreshold === void 0 ? void 0 : _activity_completionThreshold.toString()) || "",
                      timeLimitAction: activity.timeLimitAction || "continue,no message"
                  };
              }
          },
          {
              /**
     * Get Activity Path (Helper for DB.1.1)
     * Forms the activity path from root to target activity, inclusive
     * @param {Activity} activity - The target activity
     * @param {boolean} includeActivity - Whether to include the target in the path
     * @return {Activity[]} - Array of activities from root to target
     */ key: "getActivityPath",
              value: function getActivityPath(activity) {
                  var includeActivity = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
                  var path = [];
                  var current = activity;
                  while(current !== null){
                      path.unshift(current);
                      current = current.parent;
                  }
                  if (!includeActivity && path.length > 0) {
                      path.pop();
                  }
                  return path;
              }
          },
          {
              /**
     * Fire a sequencing event
     * @param {string} eventType - The type of event
     * @param {any} data - Event data
     */ key: "fireEvent",
              value: function fireEvent(eventType, data) {
                  try {
                      if (this.eventCallback) {
                          this.eventCallback(eventType, data);
                      }
                  } catch (error) {
                      console.warn("Failed to fire sequencing event ".concat(eventType, ": ").concat(error));
                  }
              }
          }
      ]);
      return _DeliveryHandler;
  }();
  __publicField$b(_DeliveryHandler, "HIDE_LMS_UI_ORDER", _to_consumable_array$1(HIDE_LMS_UI_TOKENS));

  function _class_call_check$c(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$c(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$c(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$c(Constructor.prototype, protoProps);
      return Constructor;
  }
  var SerializationService = /*#__PURE__*/ function() {
      function SerializationService() {
          _class_call_check$c(this, SerializationService);
      }
      _create_class$c(SerializationService, [
          {
              /**
     * Loads CMI data from a flattened JSON object with special handling for arrays and ordering.
     *
     * This method implements a complex algorithm for loading flattened JSON data into the CMI
     * object structure. It handles several key challenges:
     *
     * 1. Ordering dependencies: Some CMI elements (like interactions and objectives) must be
     *    loaded in a specific order to ensure proper initialization.
     *
     * 2. Array handling: Interactions and objectives are stored as arrays, and their properties
     *    must be loaded in the correct order (e.g., 'id' and 'type' must be set before other properties).
     *
     * 3. Unflattening: The method converts flattened dot notation (e.g., "cmi.objectives.0.id")
     *    back into nested objects before loading.
     *
     * The algorithm works by:
     * - Categorizing keys into interactions, objectives, and other properties
     * - Sorting interactions to prioritize 'id' and 'type' fields within each index
     * - Sorting objectives to prioritize 'id' fields within each index
     * - Processing each category in order: interactions, objectives, then other properties
     *
     * @param {StringKeyMap} json - The flattened JSON object with dot notation keys
     * @param {string} CMIElement - The CMI element to start from (usually empty or "cmi")
     * @param {Function} setCMIValue - Function to set CMI value
     * @param {Function} isNotInitialized - Function to check if API is not initialized
     *
     * @param setStartingData
     * @example
     * // Example of flattened JSON input:
     * // {
     * //   "cmi.objectives.0.id": "obj1",
     * //   "cmi.objectives.0.score.raw": "80",
     * //   "cmi.interactions.0.id": "int1",
     * //   "cmi.interactions.0.type": "choice",
     * //   "cmi.interactions.0.result": "correct"
     * // }
     */ key: "loadFromFlattenedJSON",
              value: function loadFromFlattenedJSON(json) {
                  var _this = this;
                  var CMIElement = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", setCMIValue = arguments.length > 2 ? arguments[2] : void 0, isNotInitialized = arguments.length > 3 ? arguments[3] : void 0, setStartingData = arguments.length > 4 ? arguments[4] : void 0;
                  if (!isNotInitialized()) {
                      console.error("loadFromFlattenedJSON can only be called before the call to lmsInitialize.");
                      return;
                  }
                  var int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
                  var obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;
                  var interactions = [];
                  var objectives = [];
                  var others = [];
                  for(var key in json){
                      if (Object.prototype.hasOwnProperty.call(json, key)) {
                          var intMatch = key.match(int_pattern);
                          if (intMatch) {
                              interactions.push({
                                  key: key,
                                  value: json[key],
                                  index: Number(intMatch[2]),
                                  field: intMatch[3] || ""
                              });
                              continue;
                          }
                          var objMatch = key.match(obj_pattern);
                          if (objMatch) {
                              objectives.push({
                                  key: key,
                                  value: json[key],
                                  index: Number(objMatch[2]),
                                  field: objMatch[3] || ""
                              });
                              continue;
                          }
                          others.push({
                              key: key,
                              value: json[key]
                          });
                      }
                  }
                  interactions.sort(function(a, b) {
                      if (a.index !== b.index) {
                          return a.index - b.index;
                      }
                      if (a.field === "id") return -1;
                      if (b.field === "id") return 1;
                      if (a.field === "type") return -1;
                      if (b.field === "type") return 1;
                      return a.field.localeCompare(b.field);
                  });
                  objectives.sort(function(a, b) {
                      if (a.index !== b.index) {
                          return a.index - b.index;
                      }
                      if (a.field === "id") return -1;
                      if (b.field === "id") return 1;
                      return a.field.localeCompare(b.field);
                  });
                  others.sort(function(a, b) {
                      return a.key.localeCompare(b.key);
                  });
                  var processItems = function processItems(items) {
                      items.forEach(function(item) {
                          var obj = {};
                          obj[item.key] = item.value;
                          _this.loadFromJSON(unflatten(obj), CMIElement, setCMIValue, isNotInitialized, setStartingData);
                      });
                  };
                  processItems(interactions);
                  processItems(objectives);
                  processItems(others);
              }
          },
          {
              /**
     * Loads CMI data from a nested JSON object with recursive traversal.
     *
     * This method implements a recursive algorithm for loading nested JSON data into the CMI
     * object structure. It handles several key aspects:
     *
     * 1. Recursive traversal: The method recursively traverses the nested JSON structure,
     *    building CMI element paths as it goes (e.g., "cmi.core.student_id").
     *
     * 2. Type-specific handling: Different data types are handled differently:
     *    - Arrays: Each array element is processed individually with its index in the path
     *    - Objects: Recursively processed with updated path
     *    - Primitives: Set directly using setCMIValue
     *
     * 3. Initialization check: Ensures the method is only called before API initialization
     *
     * 4. Starting data storage: Stores the original JSON data for potential future use
     *
     * The algorithm works by:
     * - First storing the complete JSON object via setStartingData
     * - Iterating through each property in the JSON object
     * - For each property, determining its type and handling it accordingly
     * - Building the CMI element path as it traverses the structure
     * - Setting values at the appropriate paths using setCMIValue
     *
     * @param {{[key: string]: any}} json - The nested JSON object to load
     * @param {string} CMIElement - The CMI element to start from (usually empty or "cmi")
     * @param {Function} setCMIValue - Function to set CMI value at a specific path
     * @param {Function} isNotInitialized - Function to check if API is not initialized
     * @param {Function} setStartingData - Function to store the original JSON data
     *
     * @example
     * // Example of nested JSON input:
     * // {
     * //   "core": {
     * //     "student_id": "12345",
     * //     "student_name": "John Doe"
     * //   },
     * //   "objectives": [
     * //     { "id": "obj1", "score": { "raw": 80 } },
     * //     { "id": "obj2", "score": { "raw": 90 } }
     * //   ]
     * // }
     */ key: "loadFromJSON",
              value: function loadFromJSON(json) {
                  var CMIElement = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", setCMIValue = arguments.length > 2 ? arguments[2] : void 0, isNotInitialized = arguments.length > 3 ? arguments[3] : void 0, setStartingData = arguments.length > 4 ? arguments[4] : void 0;
                  if (!isNotInitialized()) {
                      console.error("loadFromJSON can only be called before the call to lmsInitialize.");
                      return;
                  }
                  CMIElement = CMIElement !== void 0 ? CMIElement : "cmi";
                  setStartingData(json);
                  for(var key in json){
                      if (Object.prototype.hasOwnProperty.call(json, key) && json[key]) {
                          var currentCMIElement = (CMIElement ? CMIElement + "." : "") + key;
                          var value = json[key];
                          if (value.constructor === Array) {
                              for(var i = 0; i < value.length; i++){
                                  if (value[i]) {
                                      var item = value[i];
                                      var tempCMIElement = "".concat(currentCMIElement, ".").concat(i);
                                      if (item.constructor === Object) {
                                          this.loadFromJSON(item, tempCMIElement, setCMIValue, isNotInitialized, setStartingData);
                                      } else {
                                          setCMIValue(tempCMIElement, item);
                                      }
                                  }
                              }
                          } else if (value.constructor === Object) {
                              this.loadFromJSON(value, currentCMIElement, setCMIValue, isNotInitialized, setStartingData);
                          } else {
                              setCMIValue(currentCMIElement, value);
                          }
                      }
                  }
              }
          },
          {
              /**
     * Render the CMI object to JSON for sending to an LMS.
     *
     * @param {BaseCMI|StringKeyMap} cmi - The CMI object
     * @param {boolean} sendFullCommit - Whether to send the full commit
     * @return {string}
     */ key: "renderCMIToJSONString",
              value: function renderCMIToJSONString(cmi, sendFullCommit) {
                  if (sendFullCommit) {
                      return JSON.stringify({
                          cmi: cmi
                      });
                  }
                  return JSON.stringify({
                      cmi: cmi
                  }, function(k, v) {
                      return v === void 0 ? null : v;
                  }, 2);
              }
          },
          {
              /**
     * Returns a JS object representing the current cmi
     * @param {BaseCMI|StringKeyMap} cmi - The CMI object
     * @param {boolean} sendFullCommit - Whether to send the full commit
     * @return {object}
     */ key: "renderCMIToJSONObject",
              value: function renderCMIToJSONObject(cmi, sendFullCommit) {
                  return JSON.parse(this.renderCMIToJSONString(cmi, sendFullCommit));
              }
          },
          {
              /**
     * Builds the commit object to be sent to the LMS
     * @param {boolean} terminateCommit - Whether this is a termination commit
     * @param {boolean} alwaysSendTotalTime - Whether to always send total time
     * @param {boolean|Function} renderCommonCommitFields - Whether to render common commit fields
     * @param {Function} renderCommitObject - Function to render commit object
     * @param {Function} renderCommitCMI - Function to render commit CMI
     * @param {LogLevel} apiLogLevel - The API log level
     * @return {CommitObject|StringKeyMap|Array<any>}
     */ key: "getCommitObject",
              value: function getCommitObject(terminateCommit, alwaysSendTotalTime, renderCommonCommitFields, renderCommitObject, renderCommitCMI, apiLogLevel) {
                  var includeTotalTime = alwaysSendTotalTime || terminateCommit;
                  var commitObject = renderCommonCommitFields ? renderCommitObject(terminateCommit, includeTotalTime) : renderCommitCMI(terminateCommit, includeTotalTime);
                  if ([
                      LogLevelEnum.DEBUG,
                      "1",
                      1,
                      "DEBUG"
                  ].includes(apiLogLevel)) {
                      console.debug("Commit (terminated: " + (terminateCommit ? "yes" : "no") + "): ");
                      console.debug(commitObject);
                  }
                  return commitObject;
              }
          }
      ]);
      return SerializationService;
  }();

  function _array_like_to_array$2(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _array_with_holes$1(arr) {
      if (Array.isArray(arr)) return arr;
  }
  function _class_call_check$b(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$b(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$b(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$b(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _instanceof$1(left, right) {
      "@swc/helpers - instanceof";
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  function _iterable_to_array_limit$1(arr, i) {
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
  function _non_iterable_rest$1() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _sliced_to_array$1(arr, i) {
      return _array_with_holes$1(arr) || _iterable_to_array_limit$1(arr, i) || _unsupported_iterable_to_array$2(arr, i) || _non_iterable_rest$1();
  }
  function _type_of$a(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _unsupported_iterable_to_array$2(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$2(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$2(o, minLen);
  }
  var __defProp$a = Object.defineProperty;
  var __defNormalProp$a = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$a(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$a = function __publicField(obj, key, value) {
      return __defNormalProp$a(obj, (typeof key === "undefined" ? "undefined" : _type_of$a(key)) !== "symbol" ? key + "" : key, value);
  };
  var SynchronousHttpService = /*#__PURE__*/ function() {
      function SynchronousHttpService(settings, error_codes) {
          _class_call_check$b(this, SynchronousHttpService);
          __publicField$a(this, "settings");
          __publicField$a(this, "error_codes");
          this.settings = settings;
          this.error_codes = error_codes;
      }
      _create_class$b(SynchronousHttpService, [
          {
              /**
     * Sends synchronous HTTP requests to the LMS
     * @param {string} url - The URL endpoint to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The data to send to the LMS
     * @param {boolean} immediate - Whether this is a termination commit (use sendBeacon)
     * @param {Function} _apiLog - Function to log API messages (unused in synchronous mode - errors returned directly)
     * @param {Function} _processListeners - Function to trigger event listeners (unused in synchronous mode - no async events)
     * @param {CommitMetadata} metadata - Metadata describing the captured commit
     * @param {Function} _onRequestComplete - Completion callback (unused because requests settle before return)
     * @return {ResultObject} - The result of the request (synchronous)
     *
     * @remarks
     * The apiLog and processListeners parameters are part of the IHttpService interface contract
     * but are not used by SynchronousHttpService because:
     * - Synchronous XHR blocks until complete, so errors are returned directly to the caller
     * - No async events need to be triggered (CommitSuccess/CommitError) since results are synchronous
     * - AsynchronousHttpService uses these parameters to handle background request results
     */ key: "processHttpRequest",
              value: function processHttpRequest(url, params) {
                  var immediate = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, metadata = arguments.length > 5 ? arguments[5] : void 0;
                  if (immediate) {
                      return this._handleImmediateRequest(url, params, metadata);
                  }
                  return this._performSyncXHR(url, params, metadata);
              }
          },
          {
              /**
     * Handles an immediate request using sendBeacon
     * @param {string} url - The URL to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
     * @param {CommitMetadata} metadata - Metadata describing the captured commit
     * @return {ResultObject} - The result based on beacon success
     * @private
     */ key: "_handleImmediateRequest",
              value: function _handleImmediateRequest(url, params, metadata) {
                  var handledPayload = metadata === void 0 ? this.settings.requestHandler(params) : this.settings.requestHandler(params, metadata);
                  var requestPayload = handledPayload !== null && handledPayload !== void 0 ? handledPayload : params;
                  var body = this._prepareRequestBody(requestPayload).body;
                  var beaconSuccess = navigator.sendBeacon(url, new Blob([
                      body
                  ], {
                      type: "text/plain;charset=UTF-8"
                  }));
                  return {
                      result: beaconSuccess ? "true" : "false",
                      errorCode: beaconSuccess ? 0 : this.error_codes.GENERAL_COMMIT_FAILURE || 391
                  };
              }
          },
          {
              /**
     * Performs a synchronous XMLHttpRequest
     * @param {string} url - The URL to send the request to
     * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
     * @param {CommitMetadata} metadata - Metadata describing the captured commit
     * @return {ResultObject} - The result of the request
     * @private
     */ key: "_performSyncXHR",
              value: function _performSyncXHR(url, params, metadata) {
                  var handledPayload = metadata === void 0 ? this.settings.requestHandler(params) : this.settings.requestHandler(params, metadata);
                  var requestPayload = handledPayload !== null && handledPayload !== void 0 ? handledPayload : params;
                  var _this__prepareRequestBody = this._prepareRequestBody(requestPayload), body = _this__prepareRequestBody.body, contentType = _this__prepareRequestBody.contentType;
                  var xhr = new XMLHttpRequest();
                  xhr.open("POST", url, false);
                  xhr.setRequestHeader("Content-Type", contentType);
                  Object.entries(this.settings.xhrHeaders).forEach(function(param) {
                      var _param = _sliced_to_array$1(param, 2), key = _param[0], value = _param[1];
                      xhr.setRequestHeader(key, String(value));
                  });
                  if (this.settings.xhrWithCredentials) {
                      xhr.withCredentials = true;
                  }
                  try {
                      xhr.send(body);
                      return this.settings.xhrResponseHandler(xhr);
                  } catch (e) {
                      var message = _instanceof$1(e, Error) ? e.message : String(e);
                      return {
                          result: global_constants.SCORM_FALSE,
                          errorCode: this.error_codes.GENERAL_COMMIT_FAILURE || 391,
                          errorMessage: message
                      };
                  }
              }
          },
          {
              /**
     * Prepares the request body and content type based on params type
     * @param {CommitObject|StringKeyMap|Array} params - The parameters to include in the request
     * @return {Object} - Object containing body and contentType
     * @private
     */ key: "_prepareRequestBody",
              value: function _prepareRequestBody(params) {
                  var body = _instanceof$1(params, Array) ? params.join("&") : JSON.stringify(params);
                  var contentType = _instanceof$1(params, Array) ? "application/x-www-form-urlencoded" : this.settings.commitRequestDataType;
                  return {
                      body: body,
                      contentType: contentType
                  };
              }
          },
          {
              /**
     * Updates the service settings
     * @param {InternalSettings} settings - The new settings
     */ key: "updateSettings",
              value: function updateSettings(settings) {
                  this.settings = settings;
              }
          }
      ]);
      return SynchronousHttpService;
  }();

  function check12ValidFormat(CMIElement, value, regexPattern, allowEmptyString) {
      return checkValidFormat(CMIElement, value, regexPattern, scorm12_errors.TYPE_MISMATCH, Scorm12ValidationError, allowEmptyString);
  }
  function check12ValidRange(CMIElement, value, rangePattern, allowEmptyString) {
      if (value === "") {
          {
              throw new Scorm12ValidationError(CMIElement, scorm12_errors.VALUE_OUT_OF_RANGE);
          }
      }
      return checkValidRange(CMIElement, value, rangePattern, scorm12_errors.VALUE_OUT_OF_RANGE, Scorm12ValidationError);
  }

  function _class_call_check$a(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$a(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$a(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$a(Constructor.prototype, protoProps);
      return Constructor;
  }
  var ValidationService = /*#__PURE__*/ function() {
      function ValidationService() {
          _class_call_check$a(this, ValidationService);
      }
      _create_class$a(ValidationService, [
          {
              /**
     * Validates a score property (raw, min, max)
     *
     * @param {string} CMIElement
     * @param {string} value - The value to validate
     * @param {string} decimalRegex - The regex pattern for decimal validation
     * @param {string | false} scoreRange - The range pattern for score validation, or false if no range validation is needed
     * @param {number} invalidTypeCode - The error code for invalid type
     * @param {number} invalidRangeCode - The error code for invalid range
     * @param {typeof BaseScormValidationError} errorClass - The error class to use for validation errors
     * @param {boolean} allowEmptyString - When true, an empty string is accepted (clears the value).
     *                                     SCORM 1.2 score elements may be blank per the ADL 1.2 CTS
     *                                     (DataModelValidator.checkScoreDecimal treats blank as valid).
     * @return {boolean} - True if validation passes, throws an error otherwise
     */ key: "validateScore",
              value: function validateScore(CMIElement, value, decimalRegex, scoreRange, invalidTypeCode, invalidRangeCode, errorClass) {
                  var allowEmptyString = arguments.length > 7 && arguments[7] !== void 0 ? arguments[7] : false;
                  if (allowEmptyString && value === "") {
                      return true;
                  }
                  return checkValidFormat(CMIElement, value, decimalRegex, invalidTypeCode, errorClass) && (!scoreRange || checkValidRange(CMIElement, value, scoreRange, invalidRangeCode, errorClass));
              }
          },
          {
              /**
     * Validates a SCORM 1.2 audio property
     *
     * @spec SCORM 1.2 RTE 3.4.2.3.1 - Audio preference validation
     * @param {string} CMIElement
     * @param {string} value - The value to validate
     * @return {boolean} - True if validation passes, throws an error otherwise
     */ key: "validateScorm12Audio",
              value: function validateScorm12Audio(CMIElement, value) {
                  return check12ValidFormat(CMIElement, value, scorm12_regex.CMISInteger) && check12ValidRange(CMIElement, value, scorm12_regex.audio_range);
              }
          },
          {
              /**
     * Validates a SCORM 1.2 language property
     *
     * @spec SCORM 1.2 RTE 3.4.2.3.2 - Language preference validation
     * @param {string} CMIElement
     * @param {string} value - The value to validate
     * @return {boolean} - True if validation passes, throws an error otherwise
     */ key: "validateScorm12Language",
              value: function validateScorm12Language(CMIElement, value) {
                  return check12ValidFormat(CMIElement, value, scorm12_regex.CMIString256);
              }
          },
          {
              /**
     * Validates a SCORM 1.2 speed property
     *
     * @spec SCORM 1.2 RTE 3.4.2.3.3 - Speed preference validation
     * @param {string} CMIElement
     * @param {string} value - The value to validate
     * @return {boolean} - True if validation passes, throws an error otherwise
     */ key: "validateScorm12Speed",
              value: function validateScorm12Speed(CMIElement, value) {
                  return check12ValidFormat(CMIElement, value, scorm12_regex.CMISInteger) && check12ValidRange(CMIElement, value, scorm12_regex.speed_range);
              }
          },
          {
              /**
     * Validates a SCORM 1.2 text property
     *
     * @spec SCORM 1.2 RTE 3.4.2.3.4 - Text preference validation
     * @param {string} CMIElement
     * @param {string} value - The value to validate
     * @return {boolean} - True if validation passes, throws an error otherwise
     */ key: "validateScorm12Text",
              value: function validateScorm12Text(CMIElement, value) {
                  return check12ValidFormat(CMIElement, value, scorm12_regex.CMISInteger) && check12ValidRange(CMIElement, value, scorm12_regex.text_range);
              }
          },
          {
              /**
     * Validates if a property is read-only
     *
     * @param {string} CMIElement
     * @param {boolean} initialized - Whether the object is initialized
     * @throws {BaseScormValidationError} - Throws an error if the object is initialized
     */ key: "validateReadOnly",
              value: function validateReadOnly(CMIElement, initialized) {
                  if (initialized) {
                      throw new Scorm12ValidationError(CMIElement, scorm12_errors.READ_ONLY_ELEMENT);
                  }
              }
          }
      ]);
      return ValidationService;
  }();
  var validationService = new ValidationService();

  function _array_like_to_array$1(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _array_without_holes(arr) {
      if (Array.isArray(arr)) return _array_like_to_array$1(arr);
  }
  function _class_call_check$9(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$9(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$9(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$9(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _define_property$1(obj, key, value) {
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
  function _instanceof(left, right) {
      "@swc/helpers - instanceof";
      if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
          return !!right[Symbol.hasInstance](left);
      } else {
          return left instanceof right;
      }
  }
  function _iterable_to_array(iter) {
      if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _non_iterable_spread() {
      throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _object_spread$1(target) {
      for(var i = 1; i < arguments.length; i++){
          var source = arguments[i] != null ? arguments[i] : {};
          var ownKeys = Object.keys(source);
          if (typeof Object.getOwnPropertySymbols === "function") {
              ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                  return Object.getOwnPropertyDescriptor(source, sym).enumerable;
              }));
          }
          ownKeys.forEach(function(key) {
              _define_property$1(target, key, source[key]);
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
  function _to_consumable_array(arr) {
      return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array$1(arr) || _non_iterable_spread();
  }
  function _type_of$9(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _unsupported_iterable_to_array$1(o, minLen) {
      if (!o) return;
      if (typeof o === "string") return _array_like_to_array$1(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor) n = o.constructor.name;
      if (n === "Map" || n === "Set") return Array.from(n);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$1(o, minLen);
  }
  var __defProp$9 = Object.defineProperty;
  var __defNormalProp$9 = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$9(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$9 = function __publicField(obj, key, value) {
      return __defNormalProp$9(obj, (typeof key === "undefined" ? "undefined" : _type_of$9(key)) !== "symbol" ? key + "" : key, value);
  };
  var BaseAPI = /*#__PURE__*/ function _target() {
      function BaseAPI(error_codes, settings, httpService, eventService, serializationService, cmiDataService, errorHandlingService, loggingService, offlineStorageService) {
          var _this = this;
          _class_call_check$9(this, BaseAPI);
          __publicField$9(this, "_timeout");
          __publicField$9(this, "_error_codes");
          __publicField$9(this, "_settings", DefaultSettings);
          __publicField$9(this, "_httpService");
          __publicField$9(this, "_eventService");
          __publicField$9(this, "_serializationService");
          __publicField$9(this, "_errorHandlingService");
          __publicField$9(this, "_loggingService");
          __publicField$9(this, "_offlineStorageService");
          __publicField$9(this, "_cmiValueAccessService");
          __publicField$9(this, "_courseId", "");
          __publicField$9(this, "_pendingCommitCount", 0);
          /**
       * Monotonic sequence for commits captured by this API instance. It is
       * intentionally not reset by reset().
       */ __publicField$9(this, "_commitSequence", 0);
          __publicField$9(this, "_commitSettleWaiters", []);
          /**
       * Canonical paths of every CMI element that has been explicitly assigned a
       * value via SetValue / loadFromJSON (both funnel through _commonSetCMIValue).
       * Used by standards that must tell "implemented but never set" apart from a
       * legitimately empty value when answering GetValue (SCORM 2004 error 403).
       * Cleared on reset so a fresh SCO attempt starts with nothing "set".
       */ __publicField$9(this, "_setCMIElements", /* @__PURE__ */ new Set());
          __publicField$9(this, "startingData");
          __publicField$9(this, "currentState");
          if ((_instanceof(this, BaseAPI) ? this.constructor : void 0) === BaseAPI) {
              throw new TypeError("Cannot construct BaseAPI instances directly");
          }
          this.currentState = global_constants.STATE_NOT_INITIALIZED;
          this._error_codes = error_codes;
          if (settings) {
              this.settings = _object_spread$1({}, DefaultSettings, settings);
          }
          if ((settings === null || settings === void 0 ? void 0 : settings.asyncCommit) !== void 0 && settings.useAsynchronousCommits === void 0 && settings.throttleCommits === void 0) {
              console.warn("DEPRECATED: 'asyncCommit' setting is deprecated and will be removed in a future version. Use 'useAsynchronousCommits: true' and 'throttleCommits: true' instead.");
              if (settings.asyncCommit) {
                  this.settings.useAsynchronousCommits = true;
                  this.settings.throttleCommits = true;
              }
          }
          if (!this.settings.useAsynchronousCommits && this.settings.throttleCommits) {
              console.warn("throttleCommits cannot be used with synchronous commits. Setting throttleCommits to false.");
              this.settings.throttleCommits = false;
          }
          this._loggingService = loggingService || getLoggingService();
          this._loggingService.setLogLevel(this.settings.logLevel);
          if (this.settings.onLogMessage) {
              this._loggingService.setLogHandler(this.settings.onLogMessage);
          } else {
              this._loggingService.setLogHandler(defaultLogHandler);
          }
          if (httpService) {
              this._httpService = httpService;
          } else if (this.settings.httpService) {
              this._httpService = this.settings.httpService;
          } else {
              if (this.settings.useAsynchronousCommits) {
                  console.warn("WARNING: useAsynchronousCommits=true is not SCORM compliant. Commit failures will not be reported to the SCO, which may cause data loss. This setting should only be used for specific legacy compatibility cases.");
                  this._httpService = new AsynchronousHttpService(this.settings, this._error_codes);
              } else {
                  this._httpService = new SynchronousHttpService(this.settings, this._error_codes);
              }
          }
          this._eventService = eventService || new EventService(function(functionName, message, level, element) {
              return _this.apiLog(functionName, message, level, element);
          });
          this._serializationService = serializationService || new SerializationService();
          this._errorHandlingService = errorHandlingService || createErrorHandlingService(this._error_codes, function(functionName, message, level, element) {
              return _this.apiLog(functionName, message, level || LogLevelEnum.ERROR, element);
          }, function(errorNumber, detail) {
              return _this.getLmsErrorMessageDetails(errorNumber, detail);
          });
          if (this.settings.enableOfflineSupport) {
              this._offlineStorageService = offlineStorageService || new OfflineStorageService(this.settings, this._error_codes, function(functionName, message, level, element) {
                  return _this.apiLog(functionName, message, level, element);
              });
              if (this.settings.courseId) {
                  this._courseId = this.settings.courseId;
              }
              if (this.settings.syncOnTerminate) {
                  this._eventService.on("BeforeTerminate", function() {
                      var _this__offlineStorageService;
                      if (((_this__offlineStorageService = _this._offlineStorageService) === null || _this__offlineStorageService === void 0 ? void 0 : _this__offlineStorageService.isDeviceOnline()) && _this._courseId) {
                          _this._offlineStorageService.hasPendingOfflineData(_this._courseId).then(function(hasPendingData) {
                              if (hasPendingData) {
                                  var _this__offlineStorageService;
                                  _this.apiLog("BeforeTerminate", "Syncing pending offline data before termination", LogLevelEnum.INFO);
                                  return (_this__offlineStorageService = _this._offlineStorageService) === null || _this__offlineStorageService === void 0 ? void 0 : _this__offlineStorageService.syncOfflineData();
                              }
                          }).then(function(syncSuccess) {
                              if (syncSuccess) {
                                  _this.processListeners("OfflineDataSynced");
                              } else if (syncSuccess === false) {
                                  _this.processListeners("OfflineDataSyncFailed");
                              }
                          }).catch(function(error) {
                              _this.apiLog("BeforeTerminate", "Error syncing offline data: ".concat(error), LogLevelEnum.ERROR);
                              _this.processListeners("OfflineDataSyncFailed");
                          });
                      }
                  });
              }
              if (this._offlineStorageService && this._courseId) {
                  this._offlineStorageService.getOfflineData(this._courseId).then(function(offlineData) {
                      if (offlineData) {
                          _this.apiLog("constructor", "Found offline data to restore", LogLevelEnum.INFO);
                          _this.loadFromJSON(offlineData.runtimeData);
                      }
                  }).catch(function(error) {
                      _this.apiLog("constructor", "Error retrieving offline data: ".concat(error), LogLevelEnum.ERROR);
                  });
              }
          }
          var cmiValueAccessContext = {
              errorCodes: this._error_codes,
              getLastErrorCode: function getLastErrorCode() {
                  return _this.lastErrorCode;
              },
              setLastErrorCode: function setLastErrorCode(errorCode) {
                  _this.lastErrorCode = errorCode;
              },
              throwSCORMError: function throwSCORMError(element, errorCode, message) {
                  return _this.throwSCORMError(element, errorCode, message);
              },
              isInitialized: function isInitialized() {
                  return _this.isInitialized();
              },
              validateCorrectResponse: function validateCorrectResponse(CMIElement, value) {
                  return _this.validateCorrectResponse(CMIElement, value);
              },
              checkForDuplicateId: function checkForDuplicateId(CMIElement, value) {
                  return _this._checkForDuplicateId(CMIElement, value);
              },
              getChildElement: function getChildElement(CMIElement, value, foundFirstIndex) {
                  return _this.getChildElement(CMIElement, value, foundFirstIndex);
              },
              apiLog: function apiLog(methodName, message, level) {
                  return _this.apiLog(methodName, message, level);
              },
              checkObjectHasProperty: function checkObjectHasProperty(obj, attr) {
                  return _this._checkObjectHasProperty(obj, attr);
              },
              getDataModel: function getDataModel() {
                  return _this;
              }
          };
          this._cmiValueAccessService = new CMIValueAccessService(cmiValueAccessContext);
      }
      _create_class$9(BaseAPI, [
          {
              key: "lastErrorCode",
              get: /**
     * Get the last error code
     * @return {string}
     */ function get() {
                  var _ref;
                  var _this__errorHandlingService;
                  return (_ref = (_this__errorHandlingService = this._errorHandlingService) === null || _this__errorHandlingService === void 0 ? void 0 : _this__errorHandlingService.lastErrorCode) !== null && _ref !== void 0 ? _ref : "0";
              },
              set: /**
     * Set the last error code
     * @param {string} errorCode
     */ function set(errorCode) {
                  if (this._errorHandlingService) {
                      this._errorHandlingService.lastErrorCode = errorCode;
                  }
              }
          },
          {
              key: "eventService",
              get: /**
     * Protected getter for eventService
     * @return {IEventService}
     */ function get() {
                  return this._eventService;
              }
          },
          {
              key: "loggingService",
              get: /**
     * Protected getter for loggingService
     * @return {ILoggingService}
     */ function get() {
                  return this._loggingService;
              }
          },
          {
              /**
     * Common reset method for all APIs. New settings are merged with the existing settings.
     * @param {Settings} settings
     * @protected
     */ key: "commonReset",
              value: function commonReset(settings) {
                  this.apiLog("reset", "Called", LogLevelEnum.INFO);
                  this.settings = _object_spread$1({}, this.settings, settings);
                  this.clearScheduledCommit();
                  this.currentState = global_constants.STATE_NOT_INITIALIZED;
                  this.lastErrorCode = "0";
                  this._eventService.reset();
                  this.startingData = {};
                  this._setCMIElements.clear();
                  if (this._offlineStorageService) {
                      this._offlineStorageService.updateSettings(this.settings);
                      if (settings === null || settings === void 0 ? void 0 : settings.courseId) {
                          this._courseId = settings.courseId;
                      }
                  }
              }
          },
          {
              /**
     * Initialize the API
     * @param {string} callbackName
     * @param {string} initializeMessage
     * @param {string} terminationMessage
     * @return {string}
     */ key: "initialize",
              value: function initialize(callbackName, initializeMessage, terminationMessage) {
                  var _this = this;
                  var returnValue = global_constants.SCORM_FALSE;
                  if (this.isInitialized()) {
                      this.throwSCORMError("api", this._error_codes.INITIALIZED, initializeMessage);
                  } else if (this.isTerminated()) {
                      this.throwSCORMError("api", this._error_codes.TERMINATED, terminationMessage);
                  } else {
                      if (this.settings.selfReportSessionTime) {
                          this.cmi.setStartTime();
                      }
                      this.currentState = global_constants.STATE_INITIALIZED;
                      this.lastErrorCode = "0";
                      returnValue = global_constants.SCORM_TRUE;
                      this.processListeners(callbackName);
                      if (this.settings.enableOfflineSupport && this._offlineStorageService && this._courseId && this.settings.syncOnInitialize && this._offlineStorageService.isDeviceOnline()) {
                          this._offlineStorageService.hasPendingOfflineData(this._courseId).then(function(hasPendingData) {
                              if (hasPendingData) {
                                  var _this__offlineStorageService;
                                  _this.apiLog(callbackName, "Syncing pending offline data on initialization", LogLevelEnum.INFO);
                                  (_this__offlineStorageService = _this._offlineStorageService) === null || _this__offlineStorageService === void 0 ? void 0 : _this__offlineStorageService.syncOfflineData().then(function(syncSuccess) {
                                      if (syncSuccess) {
                                          _this.apiLog(callbackName, "Successfully synced offline data", LogLevelEnum.INFO);
                                          _this.processListeners("OfflineDataSynced");
                                      }
                                  });
                              }
                          });
                      }
                  }
                  this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
                  this.clearSCORMError(returnValue);
                  return returnValue;
              }
          },
          {
              /**
     * Logging for all SCORM actions
     *
     * @param {string} functionName
     * @param {string} logMessage
     * @param {number} messageLevel
     * @param {string} CMIElement
     */ key: "apiLog",
              value: function apiLog(functionName, logMessage, messageLevel, CMIElement) {
                  logMessage = formatMessage(functionName, logMessage, CMIElement);
                  this._loggingService.log(messageLevel, logMessage);
              }
          },
          {
              key: "settings",
              get: /**
     * Getter for _settings
     * @return {InternalSettings}
     */ function get() {
                  return this._settings;
              },
              set: /**
     * Setter for _settings
     * @param {Settings} settings
     */ function set(settings) {
                  var _this__httpService;
                  var previousSettings = this._settings;
                  this._settings = _object_spread$1({}, this._settings, settings);
                  (_this__httpService = this._httpService) === null || _this__httpService === void 0 ? void 0 : _this__httpService.updateSettings(this._settings);
                  if (settings.logLevel !== void 0 && settings.logLevel !== previousSettings.logLevel) {
                      var _this__loggingService;
                      (_this__loggingService = this._loggingService) === null || _this__loggingService === void 0 ? void 0 : _this__loggingService.setLogLevel(settings.logLevel);
                  }
                  if (settings.onLogMessage !== void 0 && settings.onLogMessage !== previousSettings.onLogMessage) {
                      var _this__loggingService1;
                      (_this__loggingService1 = this._loggingService) === null || _this__loggingService1 === void 0 ? void 0 : _this__loggingService1.setLogHandler(settings.onLogMessage);
                  }
              }
          },
          {
              key: "pendingCommitCount",
              get: /**
     * Gets the number of captured commit requests that have not yet settled.
     *
     * @return {number} The number of in-flight commits
     */ function get() {
                  return this._pendingCommitCount;
              }
          },
          {
              /**
     * Resolves when all currently in-flight commits have settled. A timeout is
     * best-effort: the promise resolves when it elapses even if commits remain,
     * and callers can inspect pendingCommitCount afterward to detect that case.
     *
     * @param {Object} [options] - Settle options
     * @param {number} [options.timeoutMs] - Maximum time to wait in milliseconds
     * @return {Promise<void>} A promise that resolves after the drain or timeout
     */ key: "whenCommitsSettled",
              value: function whenCommitsSettled(options) {
                  var _this = this;
                  if (this._pendingCommitCount === 0) {
                      return Promise.resolve();
                  }
                  return new Promise(function(resolve) {
                      var waiter = {
                          resolve: resolve
                      };
                      if ((options === null || options === void 0 ? void 0 : options.timeoutMs) !== void 0) {
                          waiter.timeoutId = setTimeout(function() {
                              var waiterIndex = _this._commitSettleWaiters.indexOf(waiter);
                              if (waiterIndex === -1) {
                                  return;
                              }
                              _this._commitSettleWaiters.splice(waiterIndex, 1);
                              resolve();
                          }, options.timeoutMs);
                      }
                      _this._commitSettleWaiters.push(waiter);
                  });
              }
          },
          {
              /** Resolve and clear every waiter after the pending count reaches zero. */ key: "_flushCommitSettleWaiters",
              value: function _flushCommitSettleWaiters() {
                  var waiters = this._commitSettleWaiters.splice(0);
                  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                  try {
                      for(var _iterator = waiters[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                          var waiter = _step.value;
                          if (waiter.timeoutId !== void 0) {
                              clearTimeout(waiter.timeoutId);
                          }
                          waiter.resolve();
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
              }
          },
          {
              /**
     * Terminates the current run of the API
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @return {string}
     */ key: "terminate",
              value: function terminate(callbackName, checkTerminated) {
                  var returnValue = global_constants.SCORM_TRUE;
                  var stateCheckPassed = false;
                  if (this.isNotInitialized()) {
                      var _this__error_codes_TERMINATION_BEFORE_INIT;
                      var errorCode = (_this__error_codes_TERMINATION_BEFORE_INIT = this._error_codes.TERMINATION_BEFORE_INIT) !== null && _this__error_codes_TERMINATION_BEFORE_INIT !== void 0 ? _this__error_codes_TERMINATION_BEFORE_INIT : 0;
                      this.throwSCORMError("api", errorCode);
                      if (errorCode === 112) returnValue = global_constants.SCORM_FALSE;
                  } else if (checkTerminated && this.isTerminated()) {
                      var _this__error_codes_MULTIPLE_TERMINATION;
                      var errorCode1 = (_this__error_codes_MULTIPLE_TERMINATION = this._error_codes.MULTIPLE_TERMINATION) !== null && _this__error_codes_MULTIPLE_TERMINATION !== void 0 ? _this__error_codes_MULTIPLE_TERMINATION : 0;
                      this.throwSCORMError("api", errorCode1);
                      if (errorCode1 === 113) returnValue = global_constants.SCORM_FALSE;
                  } else {
                      var _result_errorCode;
                      stateCheckPassed = true;
                      this.processListeners("BeforeTerminate");
                      var result = this.storeData(true, "terminate");
                      if (((_result_errorCode = result.errorCode) !== null && _result_errorCode !== void 0 ? _result_errorCode : 0) > 0) {
                          var _result_errorCode1;
                          if (result.errorMessage) {
                              this.apiLog("terminate", "Terminate failed with error: ".concat(result.errorMessage), LogLevelEnum.ERROR);
                          }
                          if (result.errorDetails) {
                              this.apiLog("terminate", "Error details: ".concat(JSON.stringify(result.errorDetails)), LogLevelEnum.DEBUG);
                          }
                          this.throwSCORMError("api", (_result_errorCode1 = result.errorCode) !== null && _result_errorCode1 !== void 0 ? _result_errorCode1 : 0);
                          returnValue = global_constants.SCORM_FALSE;
                      } else {
                          var _ref;
                          this.currentState = global_constants.STATE_TERMINATED;
                          if (checkTerminated) this.lastErrorCode = "0";
                          var resultValue = (_ref = result === null || result === void 0 ? void 0 : result.result) !== null && _ref !== void 0 ? _ref : global_constants.SCORM_TRUE;
                          returnValue = typeof resultValue === "boolean" ? String(resultValue) : resultValue;
                      }
                      this.processListeners(callbackName);
                  }
                  this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
                  if (stateCheckPassed) {
                      this.clearSCORMError(returnValue);
                  }
                  return returnValue;
              }
          },
          {
              /**
     * Get the value of the CMIElement.
     *
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @param {string} CMIElement
     * @return {string}
     */ key: "getValue",
              value: function getValue(callbackName, checkTerminated, CMIElement) {
                  var _this__error_codes_RETRIEVE_BEFORE_INIT, _this__error_codes_RETRIEVE_AFTER_TERM;
                  var returnValue = "";
                  if (this.checkState(checkTerminated, (_this__error_codes_RETRIEVE_BEFORE_INIT = this._error_codes.RETRIEVE_BEFORE_INIT) !== null && _this__error_codes_RETRIEVE_BEFORE_INIT !== void 0 ? _this__error_codes_RETRIEVE_BEFORE_INIT : 0, (_this__error_codes_RETRIEVE_AFTER_TERM = this._error_codes.RETRIEVE_AFTER_TERM) !== null && _this__error_codes_RETRIEVE_AFTER_TERM !== void 0 ? _this__error_codes_RETRIEVE_AFTER_TERM : 0)) {
                      try {
                          returnValue = this.getCMIValue(CMIElement);
                      } catch (e) {
                          returnValue = this.handleValueAccessException(CMIElement, e, returnValue);
                      }
                      if (this.lastErrorCode === "0") {
                          this.checkUninitializedGet(CMIElement, returnValue);
                      }
                      this.processListeners(callbackName, CMIElement);
                  }
                  this.apiLog(callbackName, ": returned: " + returnValue, LogLevelEnum.INFO, CMIElement);
                  if (returnValue === void 0) {
                      return "";
                  }
                  if (this.lastErrorCode === "0") {
                      this.clearSCORMError(returnValue);
                  }
                  var rawReturn = returnValue;
                  if (typeof rawReturn === "number" || typeof rawReturn === "boolean") {
                      return String(rawReturn);
                  }
                  return returnValue;
              }
          },
          {
              /**
     * Sets the value of the CMIElement.
     *
     * @param {string} callbackName
     * @param {string} commitCallback
     * @param {boolean} checkTerminated
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */ key: "setValue",
              value: function setValue(callbackName, commitCallback, checkTerminated, CMIElement, value) {
                  var _this__error_codes_STORE_BEFORE_INIT, _this__error_codes_STORE_AFTER_TERM;
                  if (value !== void 0) {
                      value = String(value);
                  }
                  var returnValue = global_constants.SCORM_FALSE;
                  if (this.checkState(checkTerminated, (_this__error_codes_STORE_BEFORE_INIT = this._error_codes.STORE_BEFORE_INIT) !== null && _this__error_codes_STORE_BEFORE_INIT !== void 0 ? _this__error_codes_STORE_BEFORE_INIT : 0, (_this__error_codes_STORE_AFTER_TERM = this._error_codes.STORE_AFTER_TERM) !== null && _this__error_codes_STORE_AFTER_TERM !== void 0 ? _this__error_codes_STORE_AFTER_TERM : 0)) {
                      try {
                          returnValue = this.setCMIValue(CMIElement, value);
                      } catch (e) {
                          returnValue = this.handleValueAccessException(CMIElement, e, returnValue);
                      }
                      this.processListeners(callbackName, CMIElement, value);
                  }
                  if (returnValue === void 0) {
                      returnValue = global_constants.SCORM_FALSE;
                  }
                  if (String(this.lastErrorCode) === "0") {
                      if (this.settings.autocommit) {
                          this.scheduleCommit(this.settings.autocommitSeconds * 1e3, commitCallback);
                      }
                  }
                  this.apiLog(callbackName, ": " + value + ": result: " + returnValue, LogLevelEnum.INFO, CMIElement);
                  if (this.lastErrorCode === "0") {
                      this.clearSCORMError(returnValue);
                  }
                  return returnValue;
              }
          },
          {
              /**
     * Orders LMS to store all content parameters
     * @param {string} callbackName
     * @param {boolean} checkTerminated
     * @param {CommitTrigger} trigger - What initiated the commit
     * @return {string}
     */ key: "commit",
              value: function commit(callbackName) {
                  var _this = this;
                  var checkTerminated = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false, trigger = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "manual";
                  this.clearScheduledCommit();
                  var returnValue = global_constants.SCORM_TRUE;
                  if (this.isNotInitialized()) {
                      var _this__error_codes_COMMIT_BEFORE_INIT;
                      var errorCode = (_this__error_codes_COMMIT_BEFORE_INIT = this._error_codes.COMMIT_BEFORE_INIT) !== null && _this__error_codes_COMMIT_BEFORE_INIT !== void 0 ? _this__error_codes_COMMIT_BEFORE_INIT : 0;
                      this.throwSCORMError("api", errorCode);
                      if (errorCode === 142) returnValue = global_constants.SCORM_FALSE;
                  } else if (checkTerminated && this.isTerminated()) {
                      var _this__error_codes_COMMIT_AFTER_TERM;
                      var errorCode1 = (_this__error_codes_COMMIT_AFTER_TERM = this._error_codes.COMMIT_AFTER_TERM) !== null && _this__error_codes_COMMIT_AFTER_TERM !== void 0 ? _this__error_codes_COMMIT_AFTER_TERM : 0;
                      this.throwSCORMError("api", errorCode1);
                      if (errorCode1 === 143) returnValue = global_constants.SCORM_FALSE;
                  } else {
                      var _result_errorCode, _ref;
                      var result = this.storeData(false, trigger);
                      var errorCode2 = (_result_errorCode = result.errorCode) !== null && _result_errorCode !== void 0 ? _result_errorCode : 0;
                      if (errorCode2 > 0) {
                          if (result.errorMessage) {
                              this.apiLog("commit", "Commit failed with error: ".concat(result.errorMessage), LogLevelEnum.ERROR);
                          }
                          if (result.errorDetails) {
                              this.apiLog("commit", "Error details: ".concat(JSON.stringify(result.errorDetails)), LogLevelEnum.DEBUG);
                          }
                          this.throwSCORMError("api", errorCode2);
                      }
                      var resultValue = (_ref = result === null || result === void 0 ? void 0 : result.result) !== null && _ref !== void 0 ? _ref : global_constants.SCORM_FALSE;
                      returnValue = typeof resultValue === "boolean" ? String(resultValue) : resultValue;
                      this.apiLog(callbackName, " Result: " + returnValue, LogLevelEnum.DEBUG, "HttpRequest");
                      if (checkTerminated && errorCode2 === 0) this.lastErrorCode = "0";
                      this.processListeners(callbackName);
                      if (this.settings.enableOfflineSupport && this._offlineStorageService && this._offlineStorageService.isDeviceOnline() && this._courseId) {
                          this._offlineStorageService.hasPendingOfflineData(this._courseId).then(function(hasPendingData) {
                              if (hasPendingData) {
                                  var _this__offlineStorageService;
                                  _this.apiLog(callbackName, "Syncing pending offline data", LogLevelEnum.INFO);
                                  (_this__offlineStorageService = _this._offlineStorageService) === null || _this__offlineStorageService === void 0 ? void 0 : _this__offlineStorageService.syncOfflineData().then(function(syncSuccess) {
                                      if (syncSuccess) {
                                          _this.apiLog(callbackName, "Successfully synced offline data", LogLevelEnum.INFO);
                                          _this.processListeners("OfflineDataSynced");
                                      } else {
                                          _this.apiLog(callbackName, "Failed to sync some offline data", LogLevelEnum.WARN);
                                      }
                                  });
                              }
                          });
                      }
                  }
                  this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
                  if (!this.isNotInitialized() && !(checkTerminated && this.isTerminated())) {
                      this.clearSCORMError(returnValue);
                  }
                  return returnValue;
              }
          },
          {
              /**
     * Returns last error code
     * @param {string} callbackName
     * @return {string}
     */ key: "getLastError",
              value: function getLastError(callbackName) {
                  var returnValue = String(this.lastErrorCode);
                  this.processListeners(callbackName);
                  this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
                  return returnValue;
              }
          },
          {
              /**
     * Returns the errorNumber error description
     *
     * @param {string} callbackName
     * @param {(string|number)} CMIErrorCode
     * @return {string} - Error description string (max 255 chars per spec)
     */ key: "getErrorString",
              value: function getErrorString(callbackName, CMIErrorCode) {
                  var returnValue = "";
                  if (CMIErrorCode !== null && CMIErrorCode !== "") {
                      returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
                      this.processListeners(callbackName);
                  }
                  if (returnValue.length > 255) {
                      returnValue = returnValue.substring(0, 255);
                  }
                  this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
                  return returnValue;
              }
          },
          {
              /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param {string} callbackName
     * @param {(string|number)} CMIErrorCode
     * @return {string}
     */ key: "getDiagnostic",
              value: function getDiagnostic(callbackName, CMIErrorCode) {
                  var returnValue = "";
                  var errorCode = CMIErrorCode === "" ? String(this.lastErrorCode) : CMIErrorCode;
                  if (errorCode !== null && errorCode !== "") {
                      var customDiagnostic = this._errorHandlingService.lastDiagnostic;
                      if (customDiagnostic && String(errorCode) === String(this.lastErrorCode)) {
                          returnValue = customDiagnostic;
                      } else {
                          returnValue = this.getLmsErrorMessageDetails(errorCode, true);
                      }
                      this.processListeners(callbackName);
                  }
                  if (returnValue.length > 255) {
                      returnValue = returnValue.substring(0, 255);
                  }
                  this.apiLog(callbackName, "returned: " + returnValue, LogLevelEnum.INFO);
                  return returnValue;
              }
          },
          {
              /**
     * Checks the LMS state and ensures it has been initialized.
     *
     * @param {boolean} checkTerminated
     * @param {number} beforeInitError
     * @param {number} afterTermError
     * @return {boolean}
     */ key: "checkState",
              value: function checkState(checkTerminated, beforeInitError, afterTermError) {
                  if (this.isNotInitialized()) {
                      this.throwSCORMError("api", beforeInitError);
                      return false;
                  } else if (checkTerminated && this.isTerminated()) {
                      this.throwSCORMError("api", afterTermError);
                      return false;
                  }
                  return true;
              }
          },
          {
              /**
     * Checks if setting an ID would create a duplicate in the objectives or interactions array.
     * Per SCORM 2004 RTE Section 4.1.5/4.1.6: IDs must be unique within their respective arrays.
     *
     * @param {string} CMIElement - The element path (e.g., "cmi.objectives.0.id")
     * @param {string} value - The ID value being set
     * @return {boolean} - True if a duplicate would be created, false otherwise
     * @protected
     */ key: "_checkForDuplicateId",
              value: function _checkForDuplicateId(CMIElement, value) {
                  var getCMIArrayProperty = function getCMIArrayProperty(obj, prop) {
                      if (obj && (typeof obj === "undefined" ? "undefined" : _type_of$9(obj)) === "object" && prop in obj) {
                          var value2 = obj[prop];
                          return _instanceof(value2, CMIArray) ? value2 : void 0;
                      }
                      return void 0;
                  };
                  var hasDuplicateId = function hasDuplicateId(array, currentIndex, idValue) {
                      for(var i = 0; i < array.childArray.length; i++){
                          if (i !== currentIndex) {
                              var child = array.childArray[i];
                              if (child && (typeof child === "undefined" ? "undefined" : _type_of$9(child)) === "object" && "id" in child && child.id === idValue) {
                                  return true;
                              }
                          }
                      }
                      return false;
                  };
                  var objectivesMatch = CMIElement.match(/^cmi\.objectives\.(\d+)\.id$/);
                  if (objectivesMatch && objectivesMatch[1]) {
                      var currentIndex = parseInt(objectivesMatch[1], 10);
                      var objectives = getCMIArrayProperty(this.cmi, "objectives");
                      if (objectives) {
                          return hasDuplicateId(objectives, currentIndex, value);
                      }
                      return false;
                  }
                  var interactionsMatch = CMIElement.match(/^cmi\.interactions\.(\d+)\.id$/);
                  if (interactionsMatch && interactionsMatch[1]) {
                      var currentIndex1 = parseInt(interactionsMatch[1], 10);
                      var interactions = getCMIArrayProperty(this.cmi, "interactions");
                      if (interactions) {
                          return hasDuplicateId(interactions, currentIndex1, value);
                      }
                      return false;
                  }
                  var interactionObjectivesMatch = CMIElement.match(/^cmi\.interactions\.(\d+)\.objectives\.(\d+)\.id$/);
                  if (interactionObjectivesMatch && interactionObjectivesMatch[1] && interactionObjectivesMatch[2]) {
                      var interactionIndex = parseInt(interactionObjectivesMatch[1], 10);
                      var currentObjIndex = parseInt(interactionObjectivesMatch[2], 10);
                      var interactions1 = getCMIArrayProperty(this.cmi, "interactions");
                      if (interactions1) {
                          var interaction = interactions1.childArray[interactionIndex];
                          if (interaction) {
                              var objectives1 = getCMIArrayProperty(interaction, "objectives");
                              if (objectives1) {
                                  return hasDuplicateId(objectives1, currentObjIndex, value);
                              }
                          }
                      }
                      return false;
                  }
                  return false;
              }
          },
          {
              /**
     * Returns the message that corresponds to errorNumber
     * APIs that inherit BaseAPI should override this function
     *
     * @param {(string|number)} _errorNumber
     * @param {boolean} _detail
     * @return {string}
     * @abstract
     */ key: "getLmsErrorMessageDetails",
              value: function getLmsErrorMessageDetails(_errorNumber) {
                  throw new Error("The getLmsErrorMessageDetails method has not been implemented");
              }
          },
          {
              /**
     * Gets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @return {string}
     * @abstract
     */ key: "getCMIValue",
              value: function getCMIValue(_CMIElement) {
                  throw new Error("The getCMIValue method has not been implemented");
              }
          },
          {
              /**
     * Sets the value for the specific element.
     * APIs that inherit BaseAPI should override this function
     *
     * @param {string} _CMIElement
     * @param {any} _value
     * @return {string}
     * @abstract
     */ key: "setCMIValue",
              value: function setCMIValue(_CMIElement, _value) {
                  throw new Error("The setCMIValue method has not been implemented");
              }
          },
          {
              /**
     * Shared API method to set a value for a given element.
     * Delegates to CMIValueAccessService for the complex traversal logic.
     *
     * @param {string} methodName
     * @param {boolean} scorm2004
     * @param {string} CMIElement
     * @param {any} value
     * @return {string}
     */ key: "_commonSetCMIValue",
              value: function _commonSetCMIValue(methodName, scorm2004, CMIElement, value) {
                  var result = this._cmiValueAccessService.setCMIValue(methodName, scorm2004, CMIElement, value);
                  if (result === global_constants.SCORM_TRUE) {
                      this._setCMIElements.add(CMIElement);
                  }
                  return result;
              }
          },
          {
              /**
     * Gets a value from the CMI Object.
     * Delegates to CMIValueAccessService for the complex traversal logic.
     *
     * @param {string} methodName
     * @param {boolean} scorm2004
     * @param {string} CMIElement
     * @return {any}
     */ key: "_commonGetCMIValue",
              value: function _commonGetCMIValue(methodName, scorm2004, CMIElement) {
                  return this._cmiValueAccessService.getCMIValue(methodName, scorm2004, CMIElement);
              }
          },
          {
              /**
     * Hook invoked by getValue after a successful resolution. Standards that must
     * distinguish "implemented but never set, no default value" from a
     * legitimately empty value override this to raise VALUE_NOT_INITIALIZED.
     * Default is a no-op, so SCORM 1.2 / AICC keep returning "" with code 0.
     *
     * @param {string} _CMIElement - the element that was read
     * @param {any} _returnValue - the value getCMIValue resolved
     * @protected
     */ key: "checkUninitializedGet",
              value: function checkUninitializedGet(_CMIElement, _returnValue) {}
          },
          {
              /**
     * Returns true if the API's current state is STATE_INITIALIZED
     *
     * @return {boolean}
     */ key: "isInitialized",
              value: function isInitialized() {
                  return this.currentState === global_constants.STATE_INITIALIZED;
              }
          },
          {
              /**
     * Returns true if the API's current state is STATE_NOT_INITIALIZED
     *
     * @return {boolean}
     */ key: "isNotInitialized",
              value: function isNotInitialized() {
                  return this.currentState === global_constants.STATE_NOT_INITIALIZED;
              }
          },
          {
              /**
     * Returns true if the API's current state is STATE_TERMINATED
     *
     * @return {boolean}
     */ key: "isTerminated",
              value: function isTerminated() {
                  return this.currentState === global_constants.STATE_TERMINATED;
              }
          },
          {
              /**
     * Provides a mechanism for attaching to a specific SCORM event.
     * This method allows you to register a callback function that will be executed
     * when the specified event occurs.
     *
     * @param {string} listenerName - The name of the event to listen for (e.g., "Initialize", "Terminate", "GetValue", "SetValue", "Commit")
     * @param {function} callback - The function to execute when the event occurs. The callback will receive relevant event data.
     * @example
     * // Listen for Initialize events
     * api.on("Initialize", function() {
     *   console.log("API has been initialized");
     * });
     *
     * // Listen for SetValue events
     * api.on("SetValue", function(element, value) {
     *   console.log("Setting " + element + " to " + value);
     * });
     */ key: "on",
              value: function on(listenerName, callback) {
                  this._eventService.on(listenerName, callback);
              }
          },
          {
              /**
     * Provides a mechanism for detaching a specific SCORM event listener.
     * This method removes a previously registered callback for an event.
     * Both the event name and the callback reference must match what was used in the 'on' method.
     *
     * @param {string} listenerName - The name of the event to stop listening for
     * @param {function} callback - The callback function to remove
     * @example
     * // Remove a specific listener
     * const myCallback = function() { console.log("API initialized"); };
     * api.on("Initialize", myCallback);
     * // Later, when you want to remove it:
     * api.off("Initialize", myCallback);
     */ key: "off",
              value: function off(listenerName, callback) {
                  this._eventService.off(listenerName, callback);
              }
          },
          {
              /**
     * Provides a mechanism for clearing all listeners from a specific SCORM event.
     * This method removes all callbacks registered for the specified event.
     *
     * @param {string} listenerName - The name of the event to clear all listeners for
     * @example
     * // Remove all listeners for the Initialize event
     * api.clear("Initialize");
     */ key: "clear",
              value: function clear(listenerName) {
                  this._eventService.clear(listenerName);
              }
          },
          {
              /**
     * Processes any 'on' listeners that have been created for a specific event.
     * This method is called internally when SCORM events occur to notify all registered listeners.
     * It triggers all callback functions registered for the specified event.
     *
     * @param {string} functionName - The name of the function/event that occurred
     * @param {string} CMIElement - Optional CMI element involved in the event
     * @param {any} value - Optional value associated with the event
     * @param {CommitEventContext} context - Optional context for commit lifecycle events
     */ key: "processListeners",
              value: function processListeners(functionName, CMIElement, value, context) {
                  if (context !== void 0) {
                      this._eventService.processListeners(functionName, CMIElement, value, context);
                  } else {
                      this._eventService.processListeners(functionName, CMIElement, value);
                  }
              }
          },
          {
              /**
     * Throws a SCORM error with the specified error number and optional message.
     * This method sets the last error code and can be used to indicate that an operation failed.
     * The error number should correspond to one of the standard SCORM error codes.
     *
     * @param {string} CMIElement
     * @param {number} errorNumber - The SCORM error code to set
     * @param {string} message - Optional custom error message to provide additional context
     * @example
     * // Throw a "not initialized" error
     * this.throwSCORMError(301, "The API must be initialized before calling GetValue");
     */ key: "throwSCORMError",
              value: function throwSCORMError(CMIElement, errorNumber, message) {
                  this._errorHandlingService.throwSCORMError(CMIElement, errorNumber !== null && errorNumber !== void 0 ? errorNumber : 0, message);
              }
          },
          {
              /**
     * Clears the last SCORM error code when an operation succeeds.
     * This method is typically called after successful API operations to reset the error state.
     * It only clears the error if the success parameter is "true".
     *
     * @param {string} success - A string indicating whether the operation succeeded ("true" or "false")
     * @example
     * // Clear error after successful operation
     * this.clearSCORMError("true");
     */ key: "clearSCORMError",
              value: function clearSCORMError(success) {
                  this._errorHandlingService.clearSCORMError(success);
              }
          },
          {
              /**
     * Load the CMI from a flattened JSON object.
     * This method populates the CMI data model from a flattened JSON structure
     * where keys represent CMI element paths (e.g., "cmi.core.student_id").
     *
     * @param {StringKeyMap} json - The flattened JSON object containing CMI data
     * @param {string} CMIElement - Optional base CMI element path to prepend to all keys
     * @example
     * // Load data from a flattened JSON structure
     * api.loadFromFlattenedJSON({
     *   "cmi.core.student_id": "12345",
     *   "cmi.core.student_name": "John Doe",
     *   "cmi.core.lesson_status": "incomplete"
     * });
     */ key: "loadFromFlattenedJSON",
              value: function loadFromFlattenedJSON(json, CMIElement) {
                  var _this = this;
                  if (!CMIElement) {
                      CMIElement = "";
                  }
                  this._serializationService.loadFromFlattenedJSON(json, CMIElement, function(CMIElement2, value) {
                      return _this.setCMIValue(CMIElement2, value);
                  }, function() {
                      return _this.isNotInitialized();
                  }, function(data) {
                      _this.startingData = data;
                  });
              }
          },
          {
              /**
     * Returns a flattened JSON object representing the current CMI data.
     */ key: "getFlattenedCMI",
              value: function getFlattenedCMI() {
                  return flatten(this.renderCMIToJSONObject());
              }
          },
          {
              /**
     * Loads CMI data from a hierarchical JSON object.
     * This method populates the CMI data model from a nested JSON structure
     * that mirrors the CMI object hierarchy.
     *
     * @param {StringKeyMap} json - The hierarchical JSON object containing CMI data
     * @param {string} CMIElement - Optional base CMI element path to prepend to all keys
     * @example
     * // Load data from a hierarchical JSON structure
     * api.loadFromJSON({
     *   core: {
     *     student_id: "12345",
     *     student_name: "John Doe",
     *     lesson_status: "incomplete"
     *   },
     *   objectives: [
     *     { id: "obj1", score: { raw: 85 } }
     *   ]
     * });
     */ key: "loadFromJSON",
              value: function loadFromJSON(json) {
                  var _this = this;
                  var CMIElement = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
                  if ((!CMIElement || CMIElement === "") && !Object.hasOwnProperty.call(json, "cmi") && !Object.hasOwnProperty.call(json, "adl")) {
                      CMIElement = "cmi";
                  }
                  this._serializationService.loadFromJSON(json, CMIElement, function(CMIElement2, value) {
                      return _this.setCMIValue(CMIElement2, value);
                  }, function() {
                      return _this.isNotInitialized();
                  }, function(data) {
                      _this.startingData = data;
                  });
              }
          },
          {
              /**
     * Render the CMI object to a JSON string for sending to an LMS.
     * This method serializes the current CMI data model to a JSON string.
     * The output format is controlled by the sendFullCommit setting.
     *
     * @return {string} A JSON string representation of the CMI data
     * @example
     * // Get the current CMI data as a JSON string
     * const jsonString = api.renderCMIToJSONString();
     * console.log(jsonString); // '{"core":{"student_id":"12345",...}}'
     */ key: "renderCMIToJSONString",
              value: function renderCMIToJSONString() {
                  return this._serializationService.renderCMIToJSONString(this.cmi, this.settings.sendFullCommit);
              }
          },
          {
              /**
     * Returns a JavaScript object representing the current CMI data.
     * This method creates a plain JavaScript object that mirrors the
     * structure of the CMI data model, suitable for further processing.
     *
     * @return {StringKeyMap} A JavaScript object representing the CMI data
     * @example
     * // Get the current CMI data as a JavaScript object
     * const cmiObject = api.renderCMIToJSONObject();
     * console.log(cmiObject.core.student_id); // "12345"
     */ key: "renderCMIToJSONObject",
              value: function renderCMIToJSONObject() {
                  return this._serializationService.renderCMIToJSONObject(this.cmi, this.settings.sendFullCommit);
              }
          },
          {
              /**
     * Process an HTTP request
     *
     * @param {string} url - The URL to send the request to
     * @param {CommitObject | StringKeyMap | Array<any>} params - The parameters to send
     * @param {boolean} immediate - Whether to send the request immediately without waiting
     * @param {CommitTrigger} [trigger] - What initiated the commit
     * @returns {ResultObject} - The result of the request
     */ key: "processHttpRequest",
              value: function processHttpRequest(url, params) {
                  var _this = this;
                  var immediate = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false, trigger = arguments.length > 3 ? arguments[3] : void 0;
                  var sequence = ++this._commitSequence;
                  this._pendingCommitCount += 1;
                  var settled = false;
                  var completionDeferred = false;
                  var settle = function settle() {
                      if (settled) {
                          return;
                      }
                      settled = true;
                      _this._pendingCommitCount -= 1;
                      if (_this._pendingCommitCount === 0) {
                          _this._flushCommitSettleWaiters();
                      }
                  };
                  try {
                      var resolvedTrigger = trigger !== null && trigger !== void 0 ? trigger : immediate ? "terminate" : "manual";
                      var finalParams = params;
                      if (immediate && this.settings.terminateCommitPayloadField) {
                          var field = this.settings.terminateCommitPayloadField;
                          if (Array.isArray(finalParams)) {
                              finalParams = _to_consumable_array(finalParams).concat([
                                  "".concat(encodeURIComponent(field), "=true")
                              ]);
                          } else if (finalParams && (typeof finalParams === "undefined" ? "undefined" : _type_of$9(finalParams)) === "object") {
                              finalParams = _object_spread_props(_object_spread$1({}, finalParams), _define_property$1({}, field, true));
                          }
                      }
                      if (this.settings.includeCommitSequence === true) {
                          if (Array.isArray(finalParams)) {
                              finalParams = _to_consumable_array(finalParams).concat([
                                  "commitSequence=".concat(sequence)
                              ]);
                          } else if (finalParams && (typeof finalParams === "undefined" ? "undefined" : _type_of$9(finalParams)) === "object") {
                              finalParams = _object_spread_props(_object_spread$1({}, finalParams), {
                                  commitSequence: sequence
                              });
                          }
                      }
                      var finalUrl = immediate && this.settings.terminateCommitParam ? appendQueryParam(url, this.settings.terminateCommitParam, "true") : url;
                      var metadata = {
                          isTerminateCommit: immediate,
                          trigger: resolvedTrigger,
                          sequence: sequence
                      };
                      var context = {
                          url: finalUrl,
                          trigger: resolvedTrigger,
                          isTerminateCommit: immediate,
                          sequence: sequence
                      };
                      if (this.settings.enableOfflineSupport && this._offlineStorageService && !this._offlineStorageService.isDeviceOnline() && this._courseId) {
                          this.apiLog("processHttpRequest", "Device is offline, storing data locally", LogLevelEnum.INFO);
                          if (finalParams && (typeof finalParams === "undefined" ? "undefined" : _type_of$9(finalParams)) === "object" && "cmi" in finalParams) {
                              return this._offlineStorageService.storeOffline(this._courseId, finalParams, {
                                  isTerminateCommit: immediate,
                                  sequence: sequence
                              });
                          } else {
                              var _this__error_codes_GENERAL;
                              this.apiLog("processHttpRequest", "Invalid commit data format for offline storage", LogLevelEnum.ERROR);
                              return {
                                  result: global_constants.SCORM_FALSE,
                                  errorCode: (_this__error_codes_GENERAL = this._error_codes.GENERAL) !== null && _this__error_codes_GENERAL !== void 0 ? _this__error_codes_GENERAL : 101
                              };
                          }
                      }
                      var apiLog = function apiLog(functionName, message, level, element) {
                          return _this.apiLog(functionName, message, level, element);
                      };
                      var processListeners = function processListeners(functionName, CMIElement, value) {
                          if (functionName === "CommitSuccess" || functionName === "CommitError") {
                              if (functionName === "CommitError" && typeof value === "number") {
                                  context.errorCode = value;
                              }
                              settle();
                              _this.processListeners(functionName, CMIElement, value, context);
                          } else {
                              _this.processListeners(functionName, CMIElement, value);
                          }
                      };
                      var result = this._httpService.processHttpRequest(finalUrl, finalParams, immediate, apiLog, processListeners, metadata, settle);
                      completionDeferred = this._httpService.reportsRequestCompletion === true;
                      return result;
                  } finally{
                      if (!completionDeferred) {
                          settle();
                      }
                  }
              }
          },
          {
              /**
     * Schedules a commit operation to occur after a specified delay.
     * This method is used to implement auto-commit functionality, where data
     * is periodically sent to the LMS without requiring explicit commit calls.
     *
     * @param {number} when - The number of milliseconds to wait before committing
     * @param {string} callback - The name of the commit event callback
     * @example
     * // Schedule a commit to happen in 60 seconds
     * api.scheduleCommit(60000, "commit");
     */ key: "scheduleCommit",
              value: function scheduleCommit(when, callback) {
                  if (!this._timeout) {
                      this._timeout = new ScheduledCommit(this, when, callback);
                      this.apiLog("scheduleCommit", "scheduled", LogLevelEnum.DEBUG, "");
                  }
              }
          },
          {
              /**
     * Clears and cancels any currently scheduled commits.
     * This method is typically called when an explicit commit is performed
     * or when the API is terminated, to prevent redundant commits.
     *
     * @example
     * // Cancel any pending scheduled commits
     * api.clearScheduledCommit();
     */ key: "clearScheduledCommit",
              value: function clearScheduledCommit() {
                  if (this._timeout) {
                      this._timeout.cancel();
                      this._timeout = void 0;
                      this.apiLog("clearScheduledCommit", "cleared", LogLevelEnum.DEBUG, "");
                  }
              }
          },
          {
              /**
     * Checks if an object has a specific property, using multiple detection methods.
     * This method performs a thorough check for property existence by:
     * 1. Checking if it's an own property using Object.hasOwnProperty
     * 2. Checking if it's defined in the prototype with a property descriptor
     * 3. Checking if it's accessible via the 'in' operator (includes inherited properties)
     *
     * @param {StringKeyMap} StringKeyMap - The object to check for the property
     * @param {string} attribute - The property name to look for
     * @return {boolean} True if the property exists on the object or its prototype chain
     * @private
     *
     * @example
     * // Check for an own property
     * const obj = { name: "John" };
     * this._checkObjectHasProperty(obj, "name"); // Returns true
     *
     * @example
     * // Check for an inherited property
     * class Parent { get type() { return "parent"; } }
     * const child = Object.create(new Parent());
     * this._checkObjectHasProperty(child, "type"); // Returns true
     *
     * @example
     * // Check for a non-existent property
     * const obj = { name: "John" };
     * this._checkObjectHasProperty(obj, "age"); // Returns false
     */ key: "_checkObjectHasProperty",
              value: function _checkObjectHasProperty(obj, attribute) {
                  if (obj === null || obj === void 0 || (typeof obj === "undefined" ? "undefined" : _type_of$9(obj)) !== "object") {
                      return false;
                  }
                  return Object.hasOwnProperty.call(obj, attribute) || Object.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), attribute) != null || attribute in obj;
              }
          },
          {
              /**
     * Handles exceptions that occur when accessing CMI values.
     * This method delegates to the ErrorHandlingService to process exceptions
     * that occur during CMI data operations, ensuring consistent error handling
     * throughout the API.
     *
     * @param {string} CMIElement
     * @param {any} e - The exception that was thrown
     * @param {string} returnValue - The default return value to use if an error occurs
     * @return {string} Either the original returnValue or SCORM_FALSE if an error occurred
     * @private
     *
     * @example
     * // Handle a validation error when getting a CMI value
     * try {
     *   return this.getCMIValue("cmi.core.score.raw");
     * } catch (e) {
     *   return this.handleValueAccessException(e, "");
     * }
     *
     * @example
     * // Handle a general error when setting a CMI value
     * try {
     *   this.setCMIValue("cmi.core.lesson_status", "completed");
     *   return "true";
     * } catch (e) {
     *   return this.handleValueAccessException(e, "false");
     * }
     */ key: "handleValueAccessException",
              value: function handleValueAccessException(CMIElement, e, returnValue) {
                  if (_instanceof(e, ValidationError)) {
                      this.lastErrorCode = String(e.errorCode);
                      if (returnValue !== "") {
                          returnValue = global_constants.SCORM_FALSE;
                      }
                      this.throwSCORMError(CMIElement, e.errorCode, e.errorMessage);
                  } else {
                      if (_instanceof(e, Error) && e.message) {
                          this.throwSCORMError(CMIElement, this._error_codes.GENERAL, e.message);
                      } else {
                          this.throwSCORMError(CMIElement, this._error_codes.GENERAL, "Unknown error");
                      }
                  }
                  return returnValue;
              }
          },
          {
              /**
     * Builds the commit object to be sent to the LMS.
     * This method delegates to the SerializationService to create a properly
     * formatted object containing the CMI data that needs to be sent to the LMS.
     * The format and content of the commit object depend on whether this is a
     * regular commit or a termination commit.
     *
     * @param {boolean} terminateCommit - Whether this is a termination commit
     * @return {CommitObject|StringKeyMap|Array} The formatted commit object
     * @protected
     *
     * @example
     * // Create a regular commit object
     * const regularCommit = this.getCommitObject(false);
     * // Result might be: { cmi: { core: { lesson_status: "incomplete" } } }
     *
     * @example
     * // Create a termination commit object (includes total_time)
     * const terminationCommit = this.getCommitObject(true);
     * // Result might be: { cmi: { core: { lesson_status: "completed", total_time: "PT1H30M" } } }
     */ key: "getCommitObject",
              value: function getCommitObject(terminateCommit) {
                  var _this = this;
                  return this._serializationService.getCommitObject(terminateCommit, this.settings.alwaysSendTotalTime, this.settings.renderCommonCommitFields, function(terminateCommit2, includeTotalTime) {
                      return _this.renderCommitObject(terminateCommit2, includeTotalTime);
                  }, function(terminateCommit2, includeTotalTime) {
                      return _this.renderCommitCMI(terminateCommit2, includeTotalTime);
                  }, this.settings.logLevel);
              }
          }
      ]);
      return BaseAPI;
  }();

  function _assert_this_initialized$8(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$8(_this, derived, args) {
      derived = _get_prototype_of$8(derived);
      return _possible_constructor_return$8(_this, _is_native_reflect_construct$8() ? Reflect.construct(derived, args || [], _get_prototype_of$8(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$8(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$8(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$8(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$8(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get_prototype_of$8(o) {
      _get_prototype_of$8 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$8(o);
  }
  function _inherits$8(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$8(subClass, superClass);
  }
  function _possible_constructor_return$8(self, call) {
      if (call && (_type_of$8(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$8(self);
  }
  function _set_prototype_of$8(o, p) {
      _set_prototype_of$8 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$8(o, p);
  }
  function _type_of$8(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$8() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$8 = function() {
          return !!result;
      })();
  }
  var __defProp$8 = Object.defineProperty;
  var __defNormalProp$8 = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$8(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$8 = function __publicField(obj, key, value) {
      return __defNormalProp$8(obj, (typeof key === "undefined" ? "undefined" : _type_of$8(key)) !== "symbol" ? key + "" : key, value);
  };
  var CMIScore = /*#__PURE__*/ function(BaseCMI) {
      _inherits$8(CMIScore, BaseCMI);
      function CMIScore(params) {
          _class_call_check$8(this, CMIScore);
          var _this;
          var _params_allowEmptyString;
          _this = _call_super$8(this, CMIScore, [
              params.CMIElement
          ]);
          __publicField$8(_this, "__children");
          /**
       * Score range validation pattern (e.g., "0#100" for SCORM 1.2).
       * Set to `false` to disable range validation (e.g., for SCORM 2004 where scores have no upper bound).
       * This property is intentionally unused in the base class but provides subclass flexibility.
       */ __publicField$8(_this, "__score_range");
          __publicField$8(_this, "__invalid_error_code");
          __publicField$8(_this, "__invalid_type_code");
          __publicField$8(_this, "__invalid_range_code");
          __publicField$8(_this, "__decimal_regex");
          __publicField$8(_this, "__error_class");
          /**
       * When true, an empty string is a valid value (clears the element). SCORM 1.2
       * score elements may be blank per the ADL 1.2 CTS; SCORM 2004 leaves this off.
       */ __publicField$8(_this, "__allow_empty_string");
          __publicField$8(_this, "_raw", "");
          __publicField$8(_this, "_min", "");
          __publicField$8(_this, "_max");
          _this.__children = params.score_children || scorm12_constants.score_children;
          _this.__score_range = !params.score_range ? false : scorm12_regex.score_range;
          _this._max = params.max || params.max === "" ? params.max : "100";
          _this.__invalid_error_code = params.invalidErrorCode || scorm12_errors.INVALID_SET_VALUE;
          _this.__invalid_type_code = params.invalidTypeCode || scorm12_errors.TYPE_MISMATCH;
          _this.__invalid_range_code = params.invalidRangeCode || scorm12_errors.VALUE_OUT_OF_RANGE;
          _this.__decimal_regex = params.decimalRegex || scorm12_regex.CMIDecimal;
          _this.__error_class = params.errorClass;
          _this.__allow_empty_string = (_params_allowEmptyString = params.allowEmptyString) !== null && _params_allowEmptyString !== void 0 ? _params_allowEmptyString : false;
          return _this;
      }
      _create_class$8(CMIScore, [
          {
              /**
     * Called when the API has been reset
     *
     * SCORE-01: Resets _raw and _min to empty strings to match subclass behavior.
     * _max is NOT reset here as it has a non-trivial default ("100") that is
     * handled by the constructor or reinitialization logic.
     */ key: "reset",
              value: function reset() {
                  this._initialized = false;
                  this._raw = "";
                  this._min = "";
              }
          },
          {
              key: "_children",
              get: /**
     * Getter for _children
     * @return {string}
     */ function get() {
                  return this.__children;
              },
              set: /**
     * Setter for _children. Just throws an error.
     * @param {string} _children
     */ function set(_children) {
                  throw new this.__error_class(this._cmi_element + "._children", this.__invalid_error_code);
              }
          },
          {
              key: "raw",
              get: /**
     * Getter for _raw
     * @return {string}
     */ function get() {
                  return this._raw;
              },
              set: /**
     * Setter for _raw
     * @param {string} raw
     */ function set(raw) {
                  if (validationService.validateScore(this._cmi_element + ".raw", raw, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class, this.__allow_empty_string)) {
                      this._raw = raw;
                  }
              }
          },
          {
              key: "min",
              get: /**
     * Getter for _min
     * @return {string}
     */ function get() {
                  return this._min;
              },
              set: /**
     * Setter for _min
     * @param {string} min
     */ function set(min) {
                  if (validationService.validateScore(this._cmi_element + ".min", min, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class, this.__allow_empty_string)) {
                      this._min = min;
                  }
              }
          },
          {
              key: "max",
              get: /**
     * Getter for _max
     * @return {string}
     */ function get() {
                  return this._max;
              },
              set: /**
     * Setter for _max
     * @param {string} max
     */ function set(max) {
                  if (validationService.validateScore(this._cmi_element + ".max", max, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class, this.__allow_empty_string)) {
                      this._max = max;
                  }
              }
          },
          {
              /**
     * Gets score object with numeric values
     * @return {ScoreObject}
     */ key: "getScoreObject",
              value: function getScoreObject() {
                  var scoreObject = {};
                  if (!Number.isNaN(Number.parseFloat(this.raw))) {
                      scoreObject.raw = Number.parseFloat(this.raw);
                  }
                  if (!Number.isNaN(Number.parseFloat(this.min))) {
                      scoreObject.min = Number.parseFloat(this.min);
                  }
                  if (!Number.isNaN(Number.parseFloat(this.max))) {
                      scoreObject.max = Number.parseFloat(this.max);
                  }
                  return scoreObject;
              }
          },
          {
              /**
     * toJSON for *.score
     * @return {
     *    {
     *      min: string,
     *      max: string,
     *      raw: string
     *    }
     *    }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      raw: this.raw,
                      min: this.min,
                      max: this.max
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return CMIScore;
  }(BaseCMI);

  function _assert_this_initialized$7(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$7(_this, derived, args) {
      derived = _get_prototype_of$7(derived);
      return _possible_constructor_return$7(_this, _is_native_reflect_construct$7() ? Reflect.construct(derived, args || [], _get_prototype_of$7(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$7(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$7(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$7(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$7(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get$2(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) {
          _get$2 = Reflect.get;
      } else {
          _get$2 = function get(target, property, receiver) {
              var base = _super_prop_base$2(target, property);
              if (!base) return;
              var desc = Object.getOwnPropertyDescriptor(base, property);
              if (desc.get) {
                  return desc.get.call(receiver || target);
              }
              return desc.value;
          };
      }
      return _get$2(target, property, receiver || target);
  }
  function _get_prototype_of$7(o) {
      _get_prototype_of$7 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$7(o);
  }
  function _inherits$7(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$7(subClass, superClass);
  }
  function _possible_constructor_return$7(self, call) {
      if (call && (_type_of$7(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$7(self);
  }
  function _set_prototype_of$7(o, p) {
      _set_prototype_of$7 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$7(o, p);
  }
  function _super_prop_base$2(object, property) {
      while(!Object.prototype.hasOwnProperty.call(object, property)){
          object = _get_prototype_of$7(object);
          if (object === null) break;
      }
      return object;
  }
  function _type_of$7(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$7() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$7 = function() {
          return !!result;
      })();
  }
  var __defProp$7 = Object.defineProperty;
  var __defNormalProp$7 = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$7(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$7 = function __publicField(obj, key, value) {
      return __defNormalProp$7(obj, (typeof key === "undefined" ? "undefined" : _type_of$7(key)) !== "symbol" ? key + "" : key, value);
  };
  var CMICore = /*#__PURE__*/ function(BaseCMI) {
      _inherits$7(CMICore, BaseCMI);
      function CMICore() {
          _class_call_check$7(this, CMICore);
          var _this;
          _this = _call_super$7(this, CMICore, [
              "cmi.core"
          ]);
          __publicField$7(_this, "score");
          __publicField$7(_this, "__children", scorm12_constants.core_children);
          __publicField$7(_this, "_student_id", "");
          __publicField$7(_this, "_student_name", "");
          __publicField$7(_this, "_lesson_location", "");
          __publicField$7(_this, "_credit", "");
          __publicField$7(_this, "_lesson_status", "not attempted");
          __publicField$7(_this, "_entry", "");
          __publicField$7(_this, "_total_time", "");
          __publicField$7(_this, "_lesson_mode", "normal");
          __publicField$7(_this, "_exit", "");
          __publicField$7(_this, "_session_time", "00:00:00");
          __publicField$7(_this, "_suspend_data", "");
          _this.score = new CMIScore({
              CMIElement: "cmi.core.score",
              score_children: scorm12_constants.score_children,
              score_range: scorm12_regex.score_range,
              invalidErrorCode: scorm12_errors.INVALID_SET_VALUE,
              invalidTypeCode: scorm12_errors.TYPE_MISMATCH,
              invalidRangeCode: scorm12_errors.VALUE_OUT_OF_RANGE,
              errorClass: Scorm12ValidationError,
              // SCORM 1.2 score elements may be set blank (clears the value), per ADL 1.2 CTS.
              allowEmptyString: true
          });
          return _this;
      }
      _create_class$7(CMICore, [
          {
              /**
     * Called when the API has been initialized after the CMI has been created
     */ key: "initialize",
              value: function initialize() {
                  var _this_score;
                  _get$2(_get_prototype_of$7(CMICore.prototype), "initialize", this).call(this);
                  (_this_score = this.score) === null || _this_score === void 0 ? void 0 : _this_score.initialize();
              }
          },
          {
              /**
     * Called when the API has been reset
     */ key: "reset",
              value: function reset() {
                  var _this_score;
                  this._initialized = false;
                  this._exit = "";
                  this._entry = "";
                  this._session_time = "00:00:00";
                  (_this_score = this.score) === null || _this_score === void 0 ? void 0 : _this_score.reset();
              }
          },
          {
              key: "_children",
              get: /**
     * Getter for __children
     * @return {string}
     * @private
     */ function get() {
                  return this.__children;
              },
              set: /**
     * Setter for __children. Just throws an error.
     * @param {string} _children
     * @private
     */ function set(_children) {
                  throw new Scorm12ValidationError(this._cmi_element + "._children", scorm12_errors.INVALID_SET_VALUE);
              }
          },
          {
              key: "student_id",
              get: /**
     * Getter for _student_id
     * @return {string}
     */ function get() {
                  return this._student_id;
              },
              set: /**
     * Setter for _student_id. Can only be called before  initialization.
     * @param {string} student_id
     */ function set(student_id) {
                  if (this.initialized) {
                      throw new Scorm12ValidationError(this._cmi_element + ".student_id", scorm12_errors.READ_ONLY_ELEMENT);
                  } else {
                      this._student_id = student_id;
                  }
              }
          },
          {
              key: "student_name",
              get: /**
     * Getter for _student_name
     * @return {string}
     */ function get() {
                  return this._student_name;
              },
              set: /**
     * Setter for _student_name. Can only be called before  initialization.
     * @param {string} student_name
     */ function set(student_name) {
                  if (this.initialized) {
                      throw new Scorm12ValidationError(this._cmi_element + ".student_name", scorm12_errors.READ_ONLY_ELEMENT);
                  } else {
                      this._student_name = student_name;
                  }
              }
          },
          {
              key: "lesson_location",
              get: /**
     * Getter for _lesson_location
     * @return {string}
     */ function get() {
                  return this._lesson_location;
              },
              set: /**
     * Setter for _lesson_location
     * @param {string} lesson_location
     */ function set(lesson_location) {
                  if (check12ValidFormat(this._cmi_element + ".lesson_location", lesson_location, scorm12_regex.CMIString256, true)) {
                      this._lesson_location = lesson_location;
                  }
              }
          },
          {
              key: "credit",
              get: /**
     * Getter for _credit
     * @return {string}
     */ function get() {
                  return this._credit;
              },
              set: /**
     * Setter for _credit. Can only be called before  initialization.
     * @param {string} credit
     */ function set(credit) {
                  if (this.initialized) {
                      throw new Scorm12ValidationError(this._cmi_element + ".credit", scorm12_errors.READ_ONLY_ELEMENT);
                  } else {
                      if (check12ValidFormat(this._cmi_element + ".credit", credit, scorm12_regex.CMICredit, true)) {
                          this._credit = credit;
                      }
                  }
              }
          },
          {
              key: "lesson_status",
              get: /**
     * Getter for _lesson_status
     * @spec RTE 3.4.2.1.7 - cmi.core.lesson_status
     * @return {string}
     */ function get() {
                  return this._lesson_status;
              },
              set: /**
     * Setter for _lesson_status
     * @spec RTE 3.4.2.1.7 - cmi.core.lesson_status
     * @param {string} lesson_status
     */ function set(lesson_status) {
                  if (this.initialized) {
                      if (check12ValidFormat(this._cmi_element + ".lesson_status", lesson_status, scorm12_regex.CMIStatus)) {
                          this._lesson_status = lesson_status;
                      }
                  } else {
                      if (check12ValidFormat(this._cmi_element + ".lesson_status", lesson_status, scorm12_regex.CMIStatus2)) {
                          this._lesson_status = lesson_status;
                      }
                  }
              }
          },
          {
              key: "entry",
              get: /**
     * Getter for _entry
     * @return {string}
     */ function get() {
                  return this._entry;
              },
              set: /**
     * Setter for _entry. Can only be called before  initialization.
     * @param {string} entry
     */ function set(entry) {
                  if (this.initialized) {
                      throw new Scorm12ValidationError(this._cmi_element + ".entry", scorm12_errors.READ_ONLY_ELEMENT);
                  } else {
                      if (check12ValidFormat(this._cmi_element + ".entry", entry, scorm12_regex.CMIEntry, true)) {
                          this._entry = entry;
                      }
                  }
              }
          },
          {
              key: "total_time",
              get: /**
     * Getter for _total_time
     * @spec RTE 3.4.2.1.13 - cmi.core.total_time
     * @return {string}
     */ function get() {
                  return this._total_time;
              },
              set: /**
     * Setter for _total_time. Can only be called before  initialization.
     * @spec RTE 3.4.2.1.13 - cmi.core.total_time
     * @param {string} total_time
     */ function set(total_time) {
                  if (this.initialized) {
                      throw new Scorm12ValidationError(this._cmi_element + ".total_time", scorm12_errors.READ_ONLY_ELEMENT);
                  } else {
                      if (check12ValidFormat(this._cmi_element + ".total_time", total_time, scorm12_regex.CMITimespan, true)) {
                          if (total_time) {
                              var totalSeconds = getTimeAsSeconds(total_time, scorm12_regex.CMITimespan);
                              this._total_time = getSecondsAsHHMMSS(totalSeconds);
                          } else {
                              this._total_time = total_time;
                          }
                      }
                  }
              }
          },
          {
              key: "lesson_mode",
              get: /**
     * Getter for _lesson_mode
     * @return {string}
     */ function get() {
                  return this._lesson_mode;
              },
              set: /**
     * Setter for _lesson_mode. Can only be called before  initialization.
     * @param {string} lesson_mode
     */ function set(lesson_mode) {
                  if (this.initialized) {
                      throw new Scorm12ValidationError(this._cmi_element + ".lesson_mode", scorm12_errors.READ_ONLY_ELEMENT);
                  } else {
                      if (check12ValidFormat(this._cmi_element + ".lesson_mode", lesson_mode, scorm12_regex.CMILessonMode)) {
                          this._lesson_mode = lesson_mode;
                      }
                  }
              }
          },
          {
              key: "exit",
              get: /**
     * Getter for _exit. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".exit", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._exit;
              },
              set: /**
     * Setter for _exit
     *
     * @spec RTE 3.4.2.1.4 - cmi.core.exit
     *
     * SPEC COMPLIANCE NOTE:
     * The SCORM 1.2 specification defines exit vocabulary as: "time-out", "suspend", "logout", or ""
     * The value "normal" is NOT part of the SCORM 1.2 vocabulary (it's a SCORM 2004 value).
     *
     * This implementation accepts "normal" and normalizes it to "" (empty string) for the
     * following reasons:
     *
     * 1. Legacy content authored for SCORM 2004 sometimes runs in SCORM 1.2 mode
     * 2. Some authoring tools incorrectly use "normal" for SCORM 1.2 content
     * 3. Rejecting "normal" would break content with no user benefit
     * 4. Empty string ("") has the same semantic meaning as "normal" (regular exit)
     * 5. A console warning is logged to help developers identify the issue
     *
     * Strict spec vocabulary: "time-out" | "suspend" | "logout" | ""
     *
     * @param {string} exit
     */ function set(exit) {
                  if (exit === "normal") {
                      console.warn("SCORM 1.2: Received non-standard value 'normal' for cmi.core.exit; normalizing to empty string.");
                      exit = "";
                  }
                  if (check12ValidFormat(this._cmi_element + ".exit", exit, scorm12_regex.CMIExit, true)) {
                      this._exit = exit;
                  }
              }
          },
          {
              key: "session_time",
              get: /**
     * Getter for _session_time. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".session_time", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._session_time;
              },
              set: /**
     * Setter for _session_time
     * @param {string} session_time
     */ function set(session_time) {
                  if (check12ValidFormat(this._cmi_element + ".session_time", session_time, scorm12_regex.CMITimespan)) {
                      var totalSeconds = getTimeAsSeconds(session_time, scorm12_regex.CMITimespan);
                      this._session_time = getSecondsAsHHMMSS(totalSeconds);
                  }
              }
          },
          {
              key: "suspend_data",
              get: /**
     * Getter for _suspend_data
     * @return {string}
     */ function get() {
                  return this._suspend_data;
              },
              set: /**
     * Setter for _suspend_data
     *
     * SPEC COMPLIANCE NOTE:
     * Uses CMIString64000 (64000 char limit) instead of spec-defined CMIString4096.
     * See scorm12_regex.CMIString64000 documentation for rationale.
     *
     * @param {string} suspend_data
     */ function set(suspend_data) {
                  if (check12ValidFormat(this._cmi_element + ".suspend_data", suspend_data, scorm12_regex.CMIString64000, true)) {
                      this._suspend_data = suspend_data;
                  }
              }
          },
          {
              /**
     * Adds the current session time to the existing total time.
     * @param {number} start_time
     * @return {string}
     */ key: "getCurrentTotalTime",
              value: function getCurrentTotalTime(start_time) {
                  var sessionTime = this._session_time;
                  if (typeof start_time !== "undefined") {
                      var seconds = /* @__PURE__ */ new Date().getTime() - start_time;
                      sessionTime = getSecondsAsHHMMSS(seconds / 1e3);
                  }
                  return addHHMMSSTimeStrings(this._total_time, sessionTime, new RegExp(scorm12_regex.CMITimespan));
              }
          },
          {
              /**
     * toJSON for cmi.core
     *
     * @return {
     *    {
     *      student_name: string,
     *      entry: string,
     *      exit: string,
     *      score: CMIScore,
     *      student_id: string,
     *      lesson_mode: string,
     *      lesson_location: string,
     *      lesson_status: string,
     *      credit: string,
     *      session_time: string
     *    }
     *  }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      student_id: this.student_id,
                      student_name: this.student_name,
                      lesson_location: this.lesson_location,
                      credit: this.credit,
                      lesson_status: this.lesson_status,
                      entry: this.entry,
                      lesson_mode: this.lesson_mode,
                      exit: this.exit,
                      session_time: this.session_time,
                      score: this.score
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return CMICore;
  }(BaseCMI);

  function _assert_this_initialized$6(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$6(_this, derived, args) {
      derived = _get_prototype_of$6(derived);
      return _possible_constructor_return$6(_this, _is_native_reflect_construct$6() ? Reflect.construct(derived, args || [], _get_prototype_of$6(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$6(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$6(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$6(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$6(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get_prototype_of$6(o) {
      _get_prototype_of$6 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$6(o);
  }
  function _inherits$6(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$6(subClass, superClass);
  }
  function _possible_constructor_return$6(self, call) {
      if (call && (_type_of$6(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$6(self);
  }
  function _set_prototype_of$6(o, p) {
      _set_prototype_of$6 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$6(o, p);
  }
  function _type_of$6(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$6() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$6 = function() {
          return !!result;
      })();
  }
  var __defProp$6 = Object.defineProperty;
  var __defNormalProp$6 = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$6(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$6 = function __publicField(obj, key, value) {
      return __defNormalProp$6(obj, (typeof key === "undefined" ? "undefined" : _type_of$6(key)) !== "symbol" ? key + "" : key, value);
  };
  var CMIObjectives = /*#__PURE__*/ function(CMIArray) {
      _inherits$6(CMIObjectives, CMIArray);
      function CMIObjectives() {
          _class_call_check$6(this, CMIObjectives);
          return _call_super$6(this, CMIObjectives, [
              {
                  CMIElement: "cmi.objectives",
                  children: scorm12_constants.objectives_children,
                  errorCode: scorm12_errors.INVALID_SET_VALUE,
                  errorClass: Scorm12ValidationError
              }
          ]);
      }
      return CMIObjectives;
  }(CMIArray);
  var CMIObjectivesObject = /*#__PURE__*/ function(BaseCMI) {
      _inherits$6(CMIObjectivesObject, BaseCMI);
      function CMIObjectivesObject() {
          _class_call_check$6(this, CMIObjectivesObject);
          var _this;
          _this = _call_super$6(this, CMIObjectivesObject, [
              "cmi.objectives.n"
          ]);
          __publicField$6(_this, "score");
          __publicField$6(_this, "_id", "");
          __publicField$6(_this, "_status", "");
          _this.score = new CMIScore({
              CMIElement: "cmi.objectives.n.score",
              score_children: scorm12_constants.score_children,
              score_range: scorm12_regex.score_range,
              invalidErrorCode: scorm12_errors.INVALID_SET_VALUE,
              invalidTypeCode: scorm12_errors.TYPE_MISMATCH,
              invalidRangeCode: scorm12_errors.VALUE_OUT_OF_RANGE,
              errorClass: Scorm12ValidationError,
              // SCORM 1.2 score elements may be set blank (clears the value), per ADL 1.2 CTS.
              allowEmptyString: true
          });
          return _this;
      }
      _create_class$6(CMIObjectivesObject, [
          {
              /**
     * Called when the API has been reset
     */ key: "reset",
              value: function reset() {
                  var _this_score;
                  this._initialized = false;
                  this._id = "";
                  this._status = "";
                  (_this_score = this.score) === null || _this_score === void 0 ? void 0 : _this_score.reset();
              }
          },
          {
              key: "id",
              get: /**
     * Getter for _id
     * @spec RTE 3.4.2.6.1 - cmi.objectives.n.id
     * @return {string}
     */ function get() {
                  return this._id;
              },
              set: /**
     * Setter for _id
     * @spec RTE 3.4.2.6.1 - cmi.objectives.n.id
     * @param {string} id
     */ function set(id) {
                  if (check12ValidFormat(this._cmi_element + ".id", id, scorm12_regex.CMIIdentifier)) {
                      this._id = id;
                  }
              }
          },
          {
              key: "status",
              get: /**
     * Getter for _status
     * @spec RTE 3.4.2.6.3 - cmi.objectives.n.status
     * @return {string}
     */ function get() {
                  return this._status;
              },
              set: /**
     * Setter for _status
     * @spec RTE 3.4.2.6.3 - cmi.objectives.n.status
     * @param {string} status
     */ function set(status) {
                  if (check12ValidFormat(this._cmi_element + ".status", status, scorm12_regex.CMIStatus2)) {
                      this._status = status;
                  }
              }
          },
          {
              /**
     * toJSON for cmi.objectives.n
     *
     * The `jsonString` flag pattern used here serves a specific purpose:
     * - Setting `jsonString = true` before accessing properties bypasses initialization checks
     * - This allows JSON serialization to read write-only or uninitialized properties
     * - Without this flag, accessing certain properties would throw SCORM validation errors
     * - The flag is reset to `false` after serialization to restore normal validation behavior
     * - This pattern is used throughout SCORM-Again for controlled property access during export
     *
     * @return {
     *    {
     *      id: string,
     *      status: string,
     *      score: CMIScore
     *    }
     *  }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      id: this.id,
                      status: this.status,
                      score: this.score
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return CMIObjectivesObject;
  }(BaseCMI);

  function _assert_this_initialized$5(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$5(_this, derived, args) {
      derived = _get_prototype_of$5(derived);
      return _possible_constructor_return$5(_this, _is_native_reflect_construct$5() ? Reflect.construct(derived, args || [], _get_prototype_of$5(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$5(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$5(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$5(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$5(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get_prototype_of$5(o) {
      _get_prototype_of$5 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$5(o);
  }
  function _inherits$5(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$5(subClass, superClass);
  }
  function _possible_constructor_return$5(self, call) {
      if (call && (_type_of$5(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$5(self);
  }
  function _set_prototype_of$5(o, p) {
      _set_prototype_of$5 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$5(o, p);
  }
  function _type_of$5(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$5() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$5 = function() {
          return !!result;
      })();
  }
  var __defProp$5 = Object.defineProperty;
  var __defNormalProp$5 = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$5(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$5 = function __publicField(obj, key, value) {
      return __defNormalProp$5(obj, (typeof key === "undefined" ? "undefined" : _type_of$5(key)) !== "symbol" ? key + "" : key, value);
  };
  function parseTimeAllowed(value, fieldName) {
      try {
          check12ValidFormat(fieldName, value, scorm12_regex.CMITimespan, true);
          var totalSeconds = getTimeAsSeconds(value, scorm12_regex.CMITimespan);
          return getSecondsAsHHMMSS(totalSeconds);
      } catch (e) {}
      try {
          check12ValidFormat(fieldName, value, scorm2004_regex.CMITimespan, true);
          var totalSeconds1 = getDurationAsSeconds(value, scorm2004_regex.CMITimespan);
          return getSecondsAsHHMMSS(totalSeconds1);
      } catch (e) {}
      throw new Scorm12ValidationError(fieldName, scorm12_errors.TYPE_MISMATCH);
  }
  var CMIStudentData = /*#__PURE__*/ function(BaseCMI) {
      _inherits$5(CMIStudentData, BaseCMI);
      function CMIStudentData(student_data_children) {
          _class_call_check$5(this, CMIStudentData);
          var _this;
          _this = _call_super$5(this, CMIStudentData, [
              "cmi.student_data"
          ]);
          __publicField$5(_this, "__children");
          __publicField$5(_this, "_mastery_score", "");
          __publicField$5(_this, "_max_time_allowed", "");
          __publicField$5(_this, "_time_limit_action", "");
          _this.__children = student_data_children ? student_data_children : scorm12_constants.student_data_children;
          return _this;
      }
      _create_class$5(CMIStudentData, [
          {
              /**
     * Called when the API has been reset
     */ key: "reset",
              value: function reset() {
                  this._initialized = false;
              }
          },
          {
              key: "_children",
              get: /**
     * Getter for __children
     * @return {string}
     * @private
     */ function get() {
                  return this.__children;
              },
              set: /**
     * Setter for __children. Just throws an error.
     * @param {string} _children
     * @private
     */ function set(_children) {
                  throw new Scorm12ValidationError(this._cmi_element + "._children", scorm12_errors.INVALID_SET_VALUE);
              }
          },
          {
              key: "mastery_score",
              get: /**
     * Getter for _mastery_score
     * @return {string}
     */ function get() {
                  return this._mastery_score;
              },
              set: /**
     * Setter for _mastery_score. Can only be called before initialization.
     * @param {string} mastery_score
     */ function set(mastery_score) {
                  validationService.validateReadOnly(this._cmi_element + ".mastery_score", this.initialized);
                  if (mastery_score === void 0 || mastery_score === null) {
                      return;
                  }
                  var normalizedMasteryScore = mastery_score;
                  if (typeof normalizedMasteryScore !== "string") {
                      normalizedMasteryScore = String(normalizedMasteryScore);
                  }
                  if (normalizedMasteryScore === "") {
                      this._mastery_score = mastery_score;
                      return;
                  }
                  if (check12ValidFormat(this._cmi_element + ".mastery_score", normalizedMasteryScore, scorm12_regex.CMIDecimal) && check12ValidRange(this._cmi_element + ".mastery_score", normalizedMasteryScore, scorm12_regex.score_range)) {
                      this._mastery_score = normalizedMasteryScore;
                  }
              }
          },
          {
              key: "max_time_allowed",
              get: /**
     * Getter for _max_time_allowed
     * @return {string}
     */ function get() {
                  return this._max_time_allowed;
              },
              set: /**
     * Setter for _max_time_allowed. Can only be called before initialization.
     * @param {string} max_time_allowed
     */ function set(max_time_allowed) {
                  validationService.validateReadOnly(this._cmi_element + ".max_time_allowed", this.initialized);
                  if (max_time_allowed === void 0 || max_time_allowed === null) {
                      return;
                  }
                  var normalizedValue = typeof max_time_allowed === "string" ? max_time_allowed : String(max_time_allowed);
                  if (normalizedValue === "") {
                      this._max_time_allowed = "";
                      return;
                  }
                  this._max_time_allowed = parseTimeAllowed(normalizedValue, this._cmi_element + ".max_time_allowed");
              }
          },
          {
              key: "time_limit_action",
              get: /**
     * Getter for _time_limit_action
     * @return {string}
     */ function get() {
                  return this._time_limit_action;
              },
              set: /**
     * Setter for _time_limit_action. Can only be called before initialization.
     * @param {string} time_limit_action
     */ function set(time_limit_action) {
                  validationService.validateReadOnly(this._cmi_element + ".time_limit_action", this.initialized);
                  if (time_limit_action === void 0 || time_limit_action === null) {
                      return;
                  }
                  var normalizedValue = typeof time_limit_action === "string" ? time_limit_action : String(time_limit_action);
                  if (check12ValidFormat(this._cmi_element + ".time_limit_action", normalizedValue, scorm12_regex.CMITimeLimitAction, true)) {
                      this._time_limit_action = normalizedValue;
                  }
              }
          },
          {
              /**
     * toJSON for cmi.student_data
     *
     * @return {
     *    {
     *      max_time_allowed: string,
     *      time_limit_action: string,
     *      mastery_score: string
     *    }
     *  }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      mastery_score: this.mastery_score,
                      max_time_allowed: this.max_time_allowed,
                      time_limit_action: this.time_limit_action
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return CMIStudentData;
  }(BaseCMI);

  function _assert_this_initialized$4(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$4(_this, derived, args) {
      derived = _get_prototype_of$4(derived);
      return _possible_constructor_return$4(_this, _is_native_reflect_construct$4() ? Reflect.construct(derived, args || [], _get_prototype_of$4(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$4(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$4(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$4(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$4(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get_prototype_of$4(o) {
      _get_prototype_of$4 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$4(o);
  }
  function _inherits$4(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$4(subClass, superClass);
  }
  function _possible_constructor_return$4(self, call) {
      if (call && (_type_of$4(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$4(self);
  }
  function _set_prototype_of$4(o, p) {
      _set_prototype_of$4 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$4(o, p);
  }
  function _type_of$4(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$4() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$4 = function() {
          return !!result;
      })();
  }
  var __defProp$4 = Object.defineProperty;
  var __defNormalProp$4 = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$4(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$4 = function __publicField(obj, key, value) {
      return __defNormalProp$4(obj, (typeof key === "undefined" ? "undefined" : _type_of$4(key)) !== "symbol" ? key + "" : key, value);
  };
  var CMIStudentPreference = /*#__PURE__*/ function(BaseCMI) {
      _inherits$4(CMIStudentPreference, BaseCMI);
      function CMIStudentPreference(student_preference_children) {
          _class_call_check$4(this, CMIStudentPreference);
          var _this;
          _this = _call_super$4(this, CMIStudentPreference, [
              "cmi.student_preference"
          ]);
          __publicField$4(_this, "__children");
          __publicField$4(_this, "_audio", "");
          __publicField$4(_this, "_language", "");
          __publicField$4(_this, "_speed", "");
          __publicField$4(_this, "_text", "");
          _this.__children = student_preference_children ? student_preference_children : scorm12_constants.student_preference_children;
          return _this;
      }
      _create_class$4(CMIStudentPreference, [
          {
              /**
     * Called when the API has been reset
     */ key: "reset",
              value: function reset() {
                  this._initialized = false;
              }
          },
          {
              key: "_children",
              get: /**
     * Getter for __children
     * @return {string}
     * @private
     */ function get() {
                  return this.__children;
              },
              set: /**
     * Setter for __children. Just throws an error.
     * @param {string} _children
     * @private
     */ function set(_children) {
                  throw new Scorm12ValidationError(this._cmi_element + "._children", scorm12_errors.INVALID_SET_VALUE);
              }
          },
          {
              key: "audio",
              get: /**
     * Getter for _audio
     * @spec RTE 3.4.2.3.1 - cmi.student_preference.audio
     * @return {string}
     */ function get() {
                  return this._audio;
              },
              set: /**
     * Setter for _audio
     * @spec RTE 3.4.2.3.1 - cmi.student_preference.audio
     * @param {string} audio
     */ function set(audio) {
                  if (validationService.validateScorm12Audio(this._cmi_element + ".audio", audio)) {
                      this._audio = audio;
                  }
              }
          },
          {
              key: "language",
              get: /**
     * Getter for _language
     * @spec RTE 3.4.2.3.2 - cmi.student_preference.language
     * @return {string}
     */ function get() {
                  return this._language;
              },
              set: /**
     * Setter for _language
     * @spec RTE 3.4.2.3.2 - cmi.student_preference.language
     * @param {string} language
     */ function set(language) {
                  if (validationService.validateScorm12Language(this._cmi_element + ".language", language)) {
                      this._language = language;
                  }
              }
          },
          {
              key: "speed",
              get: /**
     * Getter for _speed
     * @spec RTE 3.4.2.3.3 - cmi.student_preference.speed
     * @return {string}
     */ function get() {
                  return this._speed;
              },
              set: /**
     * Setter for _speed
     * @spec RTE 3.4.2.3.3 - cmi.student_preference.speed
     * @param {string} speed
     */ function set(speed) {
                  if (validationService.validateScorm12Speed(this._cmi_element + ".speed", speed)) {
                      this._speed = speed;
                  }
              }
          },
          {
              key: "text",
              get: /**
     * Getter for _text
     * @spec RTE 3.4.2.3.4 - cmi.student_preference.text
     * @return {string}
     */ function get() {
                  return this._text;
              },
              set: /**
     * Setter for _text
     * @spec RTE 3.4.2.3.4 - cmi.student_preference.text
     * @param {string} text
     */ function set(text) {
                  if (validationService.validateScorm12Text(this._cmi_element + ".text", text)) {
                      this._text = text;
                  }
              }
          },
          {
              /**
     * toJSON for cmi.student_preference
     *
     * @return {
     *    {
     *      audio: string,
     *      language: string,
     *      speed: string,
     *      text: string
     *    }
     *  }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      audio: this.audio,
                      language: this.language,
                      speed: this.speed,
                      text: this.text
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return CMIStudentPreference;
  }(BaseCMI);

  function _assert_this_initialized$3(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$3(_this, derived, args) {
      derived = _get_prototype_of$3(derived);
      return _possible_constructor_return$3(_this, _is_native_reflect_construct$3() ? Reflect.construct(derived, args || [], _get_prototype_of$3(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$3(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$3(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$3(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$3(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get$1(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) {
          _get$1 = Reflect.get;
      } else {
          _get$1 = function get(target, property, receiver) {
              var base = _super_prop_base$1(target, property);
              if (!base) return;
              var desc = Object.getOwnPropertyDescriptor(base, property);
              if (desc.get) {
                  return desc.get.call(receiver || target);
              }
              return desc.value;
          };
      }
      return _get$1(target, property, receiver || target);
  }
  function _get_prototype_of$3(o) {
      _get_prototype_of$3 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$3(o);
  }
  function _inherits$3(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$3(subClass, superClass);
  }
  function _possible_constructor_return$3(self, call) {
      if (call && (_type_of$3(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$3(self);
  }
  function _set_prototype_of$3(o, p) {
      _set_prototype_of$3 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$3(o, p);
  }
  function _super_prop_base$1(object, property) {
      while(!Object.prototype.hasOwnProperty.call(object, property)){
          object = _get_prototype_of$3(object);
          if (object === null) break;
      }
      return object;
  }
  function _type_of$3(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$3() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$3 = function() {
          return !!result;
      })();
  }
  var __defProp$3 = Object.defineProperty;
  var __defNormalProp$3 = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$3(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$3 = function __publicField(obj, key, value) {
      return __defNormalProp$3(obj, (typeof key === "undefined" ? "undefined" : _type_of$3(key)) !== "symbol" ? key + "" : key, value);
  };
  var CMIInteractions = /*#__PURE__*/ function(CMIArray) {
      _inherits$3(CMIInteractions, CMIArray);
      function CMIInteractions() {
          _class_call_check$3(this, CMIInteractions);
          return _call_super$3(this, CMIInteractions, [
              {
                  CMIElement: "cmi.interactions",
                  children: scorm12_constants.interactions_children,
                  errorCode: scorm12_errors.INVALID_SET_VALUE,
                  errorClass: Scorm12ValidationError
              }
          ]);
      }
      return CMIInteractions;
  }(CMIArray);
  var CMIInteractionsObject = /*#__PURE__*/ function(BaseCMI) {
      _inherits$3(CMIInteractionsObject, BaseCMI);
      function CMIInteractionsObject() {
          _class_call_check$3(this, CMIInteractionsObject);
          var _this;
          _this = _call_super$3(this, CMIInteractionsObject, [
              "cmi.interactions.n"
          ]);
          __publicField$3(_this, "objectives");
          __publicField$3(_this, "correct_responses");
          __publicField$3(_this, "_id", "");
          __publicField$3(_this, "_time", "");
          __publicField$3(_this, "_type", "");
          __publicField$3(_this, "_weighting", "");
          __publicField$3(_this, "_student_response", "");
          __publicField$3(_this, "_result", "");
          __publicField$3(_this, "_latency", "");
          _this.objectives = new CMIArray({
              CMIElement: "cmi.interactions.n.objectives",
              errorCode: scorm12_errors.INVALID_SET_VALUE,
              errorClass: Scorm12ValidationError,
              children: scorm12_constants.objectives_children
          });
          _this.correct_responses = new CMIArray({
              CMIElement: "cmi.interactions.correct_responses",
              errorCode: scorm12_errors.INVALID_SET_VALUE,
              errorClass: Scorm12ValidationError,
              children: scorm12_constants.correct_responses_children
          });
          return _this;
      }
      _create_class$3(CMIInteractionsObject, [
          {
              /**
     * Called when the API has been initialized after the CMI has been created
     */ key: "initialize",
              value: function initialize() {
                  var _this_objectives, _this_correct_responses;
                  _get$1(_get_prototype_of$3(CMIInteractionsObject.prototype), "initialize", this).call(this);
                  (_this_objectives = this.objectives) === null || _this_objectives === void 0 ? void 0 : _this_objectives.initialize();
                  (_this_correct_responses = this.correct_responses) === null || _this_correct_responses === void 0 ? void 0 : _this_correct_responses.initialize();
              }
          },
          {
              /**
     * Called when the API has been reset
     */ key: "reset",
              value: function reset() {
                  var _this_objectives, _this_correct_responses;
                  this._initialized = false;
                  this._id = "";
                  this._time = "";
                  this._type = "";
                  this._weighting = "";
                  this._student_response = "";
                  this._result = "";
                  this._latency = "";
                  (_this_objectives = this.objectives) === null || _this_objectives === void 0 ? void 0 : _this_objectives.reset();
                  (_this_correct_responses = this.correct_responses) === null || _this_correct_responses === void 0 ? void 0 : _this_correct_responses.reset();
              }
          },
          {
              key: "id",
              get: /**
     * Getter for _id. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".id", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._id;
              },
              set: /**
     * Setter for _id
     * @param {string} id
     */ function set(id) {
                  if (check12ValidFormat(this._cmi_element + ".id", id, scorm12_regex.CMIIdentifier)) {
                      this._id = id;
                  }
              }
          },
          {
              key: "time",
              get: /**
     * Getter for _time. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".time", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._time;
              },
              set: /**
     * Setter for _time
     * @param {string} time
     */ function set(time) {
                  if (check12ValidFormat(this._cmi_element + ".time", time, scorm12_regex.CMITime)) {
                      this._time = time;
                  }
              }
          },
          {
              key: "type",
              get: /**
     * Getter for _type. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".type", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._type;
              },
              set: /**
     * Setter for _type
     * @param {string} type
     */ function set(type) {
                  if (check12ValidFormat(this._cmi_element + ".type", type, scorm12_regex.CMIType)) {
                      this._type = type;
                  }
              }
          },
          {
              key: "weighting",
              get: /**
     * Getter for _weighting. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".weighting", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._weighting;
              },
              set: /**
     * Setter for _weighting
     * @param {string} weighting
     */ function set(weighting) {
                  if (check12ValidFormat(this._cmi_element + ".weighting", weighting, scorm12_regex.CMIDecimal) && check12ValidRange(this._cmi_element + ".weighting", weighting, scorm12_regex.weighting_range)) {
                      this._weighting = weighting;
                  }
              }
          },
          {
              key: "student_response",
              get: /**
     * Getter for _student_response. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".student_response", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._student_response;
              },
              set: /**
     * Setter for _student_response
     * @param {string} student_response
     */ function set(student_response) {
                  if (check12ValidFormat(this._cmi_element + ".student_response", student_response, scorm12_regex.CMIFeedback, true)) {
                      this._student_response = student_response;
                  }
              }
          },
          {
              key: "result",
              get: /**
     * Getter for _result. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".result", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._result;
              },
              set: /**
     * Setter for _result
     * @spec RTE 3.4.2.7.6 - cmi.interactions.n.result
     * Per SCORM 1.2 spec, valid values are "correct", "wrong", "unanticipated", "neutral", or a numeric score.
     * The spec requires "wrong" not "incorrect" for failed interactions.
     * @param {string} result
     */ function set(result) {
                  var normalizedResult = result;
                  if (result === "incorrect") {
                      normalizedResult = "wrong";
                      console.warn("SCORM 1.2: Received non-standard value 'incorrect' for cmi.interactions.n.result; normalizing to 'wrong'.");
                  }
                  if (check12ValidFormat(this._cmi_element + ".result", normalizedResult, scorm12_regex.CMIResult)) {
                      this._result = normalizedResult;
                  }
              }
          },
          {
              key: "latency",
              get: /**
     * Getter for _latency. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".latency", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._latency;
              },
              set: /**
     * Setter for _latency
     * @param {string} latency
     */ function set(latency) {
                  if (check12ValidFormat(this._cmi_element + ".latency", latency, scorm12_regex.CMITimespan)) {
                      var totalSeconds = getTimeAsSeconds(latency, scorm12_regex.CMITimespan);
                      this._latency = getSecondsAsHHMMSS(totalSeconds);
                  }
              }
          },
          {
              /**
     * toJSON for cmi.interactions.n
     *
     * @return {
     *    {
     *      id: string,
     *      time: string,
     *      type: string,
     *      weighting: string,
     *      student_response: string,
     *      result: string,
     *      latency: string,
     *      objectives: CMIArray,
     *      correct_responses: CMIArray
     *    }
     *  }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      id: this.id,
                      time: this.time,
                      type: this.type,
                      weighting: this.weighting,
                      student_response: this.student_response,
                      result: this.result,
                      latency: this.latency,
                      objectives: this.objectives,
                      correct_responses: this.correct_responses
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return CMIInteractionsObject;
  }(BaseCMI);
  var CMIInteractionsObjectivesObject = /*#__PURE__*/ function(BaseCMI) {
      _inherits$3(CMIInteractionsObjectivesObject, BaseCMI);
      function CMIInteractionsObjectivesObject() {
          _class_call_check$3(this, CMIInteractionsObjectivesObject);
          var _this;
          _this = _call_super$3(this, CMIInteractionsObjectivesObject, [
              "cmi.interactions.n.objectives.n"
          ]);
          __publicField$3(_this, "_id", "");
          return _this;
      }
      _create_class$3(CMIInteractionsObjectivesObject, [
          {
              /**
     * Called when the API has been reset
     */ key: "reset",
              value: function reset() {
                  this._initialized = false;
                  this._id = "";
              }
          },
          {
              key: "id",
              get: /**
     * Getter for _id. Should only be called during JSON export.
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".id", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._id;
              },
              set: /**
     * Setter for _id
     * @param {string} id
     */ function set(id) {
                  if (check12ValidFormat(this._cmi_element + ".id", id, scorm12_regex.CMIIdentifier)) {
                      this._id = id;
                  }
              }
          },
          {
              /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      id: this.id
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return CMIInteractionsObjectivesObject;
  }(BaseCMI);
  var CMIInteractionsCorrectResponsesObject = /*#__PURE__*/ function(BaseCMI) {
      _inherits$3(CMIInteractionsCorrectResponsesObject, BaseCMI);
      function CMIInteractionsCorrectResponsesObject() {
          _class_call_check$3(this, CMIInteractionsCorrectResponsesObject);
          var _this;
          _this = _call_super$3(this, CMIInteractionsCorrectResponsesObject, [
              "cmi.interactions.correct_responses.n"
          ]);
          __publicField$3(_this, "_pattern", "");
          return _this;
      }
      _create_class$3(CMIInteractionsCorrectResponsesObject, [
          {
              /**
     * Called when the API has been reset
     */ key: "reset",
              value: function reset() {
                  this._initialized = false;
                  this._pattern = "";
              }
          },
          {
              key: "pattern",
              get: /**
     * Getter for _pattern
     * @return {string}
     */ function get() {
                  if (!this.jsonString) {
                      throw new Scorm12ValidationError(this._cmi_element + ".pattern", scorm12_errors.WRITE_ONLY_ELEMENT);
                  }
                  return this._pattern;
              },
              set: /**
     * Setter for _pattern
     * @param {string} pattern
     */ function set(pattern) {
                  if (check12ValidFormat(this._cmi_element + ".pattern", pattern, scorm12_regex.CMIFeedback, true)) {
                      this._pattern = pattern;
                  }
              }
          },
          {
              /**
     * toJSON for cmi.interactions.correct_responses.n
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      pattern: this._pattern
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return CMIInteractionsCorrectResponsesObject;
  }(BaseCMI);

  function _assert_this_initialized$2(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$2(_this, derived, args) {
      derived = _get_prototype_of$2(derived);
      return _possible_constructor_return$2(_this, _is_native_reflect_construct$2() ? Reflect.construct(derived, args || [], _get_prototype_of$2(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$2(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$2(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$2(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get(target, property, receiver) {
      if (typeof Reflect !== "undefined" && Reflect.get) {
          _get = Reflect.get;
      } else {
          _get = function get(target, property, receiver) {
              var base = _super_prop_base(target, property);
              if (!base) return;
              var desc = Object.getOwnPropertyDescriptor(base, property);
              if (desc.get) {
                  return desc.get.call(receiver || target);
              }
              return desc.value;
          };
      }
      return _get(target, property, receiver || target);
  }
  function _get_prototype_of$2(o) {
      _get_prototype_of$2 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$2(o);
  }
  function _inherits$2(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$2(subClass, superClass);
  }
  function _possible_constructor_return$2(self, call) {
      if (call && (_type_of$2(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$2(self);
  }
  function _set_prototype_of$2(o, p) {
      _set_prototype_of$2 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$2(o, p);
  }
  function _super_prop_base(object, property) {
      while(!Object.prototype.hasOwnProperty.call(object, property)){
          object = _get_prototype_of$2(object);
          if (object === null) break;
      }
      return object;
  }
  function _type_of$2(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$2() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$2 = function() {
          return !!result;
      })();
  }
  var __defProp$2 = Object.defineProperty;
  var __defNormalProp$2 = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$2(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$2 = function __publicField(obj, key, value) {
      return __defNormalProp$2(obj, (typeof key === "undefined" ? "undefined" : _type_of$2(key)) !== "symbol" ? key + "" : key, value);
  };
  var CMI = /*#__PURE__*/ function(BaseRootCMI) {
      _inherits$2(CMI, BaseRootCMI);
      function CMI(cmi_children, student_data, initialized) {
          _class_call_check$2(this, CMI);
          var _this;
          _this = _call_super$2(this, CMI, [
              "cmi"
          ]);
          __publicField$2(_this, "__children", "");
          __publicField$2(_this, "__version", "3.4");
          __publicField$2(_this, "_launch_data", "");
          __publicField$2(_this, "_comments", "");
          __publicField$2(_this, "_comments_from_lms", "");
          __publicField$2(_this, "core");
          __publicField$2(_this, "objectives");
          __publicField$2(_this, "student_data");
          __publicField$2(_this, "student_preference");
          __publicField$2(_this, "interactions");
          if (initialized) _this.initialize();
          _this.__children = cmi_children ? cmi_children : scorm12_constants.cmi_children;
          _this.core = new CMICore();
          _this.objectives = new CMIObjectives();
          _this.student_data = student_data ? student_data : new CMIStudentData();
          _this.student_preference = new CMIStudentPreference();
          _this.interactions = new CMIInteractions();
          return _this;
      }
      _create_class$2(CMI, [
          {
              /**
     * Called when the API has been reset
     *
     * CMI-03: Uses consistent ?.reset() pattern for all child objects.
     * Objectives and interactions use reset(true) to clear arrays completely.
     */ key: "reset",
              value: function reset() {
                  var _this_core, _this_objectives, _this_interactions, _this_student_data, _this_student_preference;
                  this._initialized = false;
                  this._launch_data = "";
                  this._comments = "";
                  (_this_core = this.core) === null || _this_core === void 0 ? void 0 : _this_core.reset();
                  (_this_objectives = this.objectives) === null || _this_objectives === void 0 ? void 0 : _this_objectives.reset(true);
                  (_this_interactions = this.interactions) === null || _this_interactions === void 0 ? void 0 : _this_interactions.reset(true);
                  (_this_student_data = this.student_data) === null || _this_student_data === void 0 ? void 0 : _this_student_data.reset();
                  (_this_student_preference = this.student_preference) === null || _this_student_preference === void 0 ? void 0 : _this_student_preference.reset();
              }
          },
          {
              /**
     * Called when the API has been initialized after the CMI has been created
     */ key: "initialize",
              value: function initialize() {
                  var _this_core, _this_objectives, _this_student_data, _this_student_preference, _this_interactions;
                  _get(_get_prototype_of$2(CMI.prototype), "initialize", this).call(this);
                  (_this_core = this.core) === null || _this_core === void 0 ? void 0 : _this_core.initialize();
                  (_this_objectives = this.objectives) === null || _this_objectives === void 0 ? void 0 : _this_objectives.initialize();
                  (_this_student_data = this.student_data) === null || _this_student_data === void 0 ? void 0 : _this_student_data.initialize();
                  (_this_student_preference = this.student_preference) === null || _this_student_preference === void 0 ? void 0 : _this_student_preference.initialize();
                  (_this_interactions = this.interactions) === null || _this_interactions === void 0 ? void 0 : _this_interactions.initialize();
              }
          },
          {
              /**
     * toJSON for cmi
     *
     * @return {
     *    {
     *      suspend_data: string,
     *      launch_data: string,
     *      comments: string,
     *      comments_from_lms: string,
     *      core: CMICore,
     *      objectives: CMIObjectives,
     *      student_data: CMIStudentData,
     *      student_preference: CMIStudentPreference,
     *      interactions: CMIInteractions
     *    }
     *  }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      suspend_data: this.suspend_data,
                      launch_data: this.launch_data,
                      comments: this.comments,
                      comments_from_lms: this.comments_from_lms,
                      core: this.core,
                      objectives: this.objectives,
                      student_data: this.student_data,
                      student_preference: this.student_preference,
                      interactions: this.interactions
                  };
                  this.jsonString = false;
                  return result;
              }
          },
          {
              key: "_version",
              get: /**
     * Getter for __version
     * @return {string}
     */ function get() {
                  return this.__version;
              },
              set: /**
     * Setter for __version. Just throws an error.
     * @param {string} _version
     */ function set(_version) {
                  throw new Scorm12ValidationError(this._cmi_element + "._version", scorm12_errors.INVALID_SET_VALUE);
              }
          },
          {
              key: "_children",
              get: /**
     * Getter for __children
     * @return {string}
     */ function get() {
                  return this.__children;
              },
              set: /**
     * Setter for __version. Just throws an error.
     * @param {string} _children
     */ function set(_children) {
                  throw new Scorm12ValidationError(this._cmi_element + "._children", scorm12_errors.INVALID_SET_VALUE);
              }
          },
          {
              key: "suspend_data",
              get: /**
     * Getter for _suspend_data
     * @return {string}
     */ function get() {
                  var _this_core;
                  return (_this_core = this.core) === null || _this_core === void 0 ? void 0 : _this_core.suspend_data;
              },
              set: /**
     * Setter for _suspend_data
     * @param {string} suspend_data
     */ function set(suspend_data) {
                  if (this.core) {
                      this.core.suspend_data = suspend_data;
                  }
              }
          },
          {
              key: "launch_data",
              get: /**
     * Getter for _launch_data
     * @return {string}
     */ function get() {
                  return this._launch_data;
              },
              set: /**
     * Setter for _launch_data. Can only be called before initialization.
     *
     * SPEC COMPLIANCE NOTE:
     * The SCORM 1.2 specification defines launch_data as CMIString4096 (max 4096 chars).
     * This implementation intentionally omits length validation because:
     *
     * 1. launch_data is LMS-provided data, not SCO-provided - the LMS is responsible
     *    for ensuring valid data is provided to content
     * 2. This setter is only callable before API initialization (read-only to SCO)
     * 3. Real-world LMS systems may provide launch_data exceeding 4096 chars
     * 4. Rejecting oversized LMS data would break content with no recovery path
     *
     * Unlike cmi.suspend_data and cmi.comments (which SCOs write), launch_data
     * comes from the LMS manifest/configuration, so strict validation here would
     * penalize content for LMS decisions outside SCO control.
     *
     * @param {string} launch_data
     */ function set(launch_data) {
                  if (this.initialized) {
                      throw new Scorm12ValidationError(this._cmi_element + ".launch_data", scorm12_errors.READ_ONLY_ELEMENT);
                  } else {
                      this._launch_data = launch_data;
                  }
              }
          },
          {
              key: "comments",
              get: /**
     * Getter for _comments
     * @return {string}
     */ function get() {
                  return this._comments;
              },
              set: /**
     * Setter for _comments
     * @param {string} comments
     */ function set(comments) {
                  if (check12ValidFormat(this._cmi_element + ".comments", comments, scorm12_regex.CMIString4096, true)) {
                      this._comments = comments;
                  }
              }
          },
          {
              key: "comments_from_lms",
              get: /**
     * Getter for _comments_from_lms
     * @return {string}
     */ function get() {
                  return this._comments_from_lms;
              },
              set: /**
     * Setter for _comments_from_lms. Can only be called before  initialization.
     * @param {string} comments_from_lms
     */ function set(comments_from_lms) {
                  if (this.initialized) {
                      throw new Scorm12ValidationError(this._cmi_element + ".comments_from_lms", scorm12_errors.READ_ONLY_ELEMENT);
                  } else {
                      this._comments_from_lms = comments_from_lms;
                  }
              }
          },
          {
              /**
     * Adds the current session time to the existing total time.
     *
     * @return {string}
     */ key: "getCurrentTotalTime",
              value: function getCurrentTotalTime() {
                  return this.core.getCurrentTotalTime(this.start_time);
              }
          }
      ]);
      return CMI;
  }(BaseRootCMI);

  function _assert_this_initialized$1(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super$1(_this, derived, args) {
      derived = _get_prototype_of$1(derived);
      return _possible_constructor_return$1(_this, _is_native_reflect_construct$1() ? Reflect.construct(derived, args || [], _get_prototype_of$1(_this).constructor) : derived.apply(_this, args));
  }
  function _class_call_check$1(instance, Constructor) {
      if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
      }
  }
  function _defineProperties$1(target, props) {
      for(var i = 0; i < props.length; i++){
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
      }
  }
  function _create_class$1(Constructor, protoProps, staticProps) {
      if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
      return Constructor;
  }
  function _get_prototype_of$1(o) {
      _get_prototype_of$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of$1(o);
  }
  function _inherits$1(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of$1(subClass, superClass);
  }
  function _possible_constructor_return$1(self, call) {
      if (call && (_type_of$1(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized$1(self);
  }
  function _set_prototype_of$1(o, p) {
      _set_prototype_of$1 = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of$1(o, p);
  }
  function _type_of$1(obj) {
      "@swc/helpers - typeof";
      return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
  }
  function _is_native_reflect_construct$1() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct$1 = function() {
          return !!result;
      })();
  }
  var __defProp$1 = Object.defineProperty;
  var __defNormalProp$1 = function __defNormalProp(obj, key, value) {
      return key in obj ? __defProp$1(obj, key, {
          enumerable: true,
          configurable: true,
          writable: true,
          value: value
      }) : obj[key] = value;
  };
  var __publicField$1 = function __publicField(obj, key, value) {
      return __defNormalProp$1(obj, (_type_of$1(key)) !== "symbol" ? key + "" : key, value);
  };
  var NAV = /*#__PURE__*/ function(BaseCMI) {
      _inherits$1(NAV, BaseCMI);
      function NAV() {
          _class_call_check$1(this, NAV);
          var _this;
          _this = _call_super$1(this, NAV, [
              "cmi.nav"
          ]);
          __publicField$1(_this, "_event", "");
          return _this;
      }
      _create_class$1(NAV, [
          {
              /**
     * Called when the API has been reset
     *
     * This method is invoked during the following session lifecycle events:
     * - When the API is reset via LMSFinish() followed by a new LMSInitialize()
     * - Between SCO transitions in multi-SCO courses (when one SCO ends and another begins)
     * - When the LMS explicitly resets the API instance
     * - During API cleanup and reinitialization cycles
     *
     * Resets all navigation state to prepare for a new session.
     */ key: "reset",
              value: function reset() {
                  this._event = "";
                  this._initialized = false;
              }
          },
          {
              key: "event",
              get: /**
     * Getter for _event
     * @return {string}
     */ function get() {
                  return this._event;
              },
              set: /**
     * Setter for _event
     * @param {string} event
     */ function set(event) {
                  if (event === "" || check12ValidFormat(this._cmi_element + ".event", event, scorm12_regex.NAVEvent)) {
                      this._event = event;
                  }
              }
          },
          {
              /**
     * toJSON for nav object
     * @return {
     *    {
     *      event: string
     *    }
     *  }
     */ key: "toJSON",
              value: function toJSON() {
                  this.jsonString = true;
                  var result = {
                      event: this.event
                  };
                  this.jsonString = false;
                  return result;
              }
          }
      ]);
      return NAV;
  }(BaseCMI);

  function _array_like_to_array(arr, len) {
      if (len == null || len > arr.length) len = arr.length;
      for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
      return arr2;
  }
  function _array_with_holes(arr) {
      if (Array.isArray(arr)) return arr;
  }
  function _assert_this_initialized(self) {
      if (self === void 0) {
          throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }
      return self;
  }
  function _call_super(_this, derived, args) {
      derived = _get_prototype_of(derived);
      return _possible_constructor_return(_this, _is_native_reflect_construct() ? Reflect.construct(derived, args || [], _get_prototype_of(_this).constructor) : derived.apply(_this, args));
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
  function _get_prototype_of(o) {
      _get_prototype_of = Object.setPrototypeOf ? Object.getPrototypeOf : function getPrototypeOf(o) {
          return o.__proto__ || Object.getPrototypeOf(o);
      };
      return _get_prototype_of(o);
  }
  function _inherits(subClass, superClass) {
      if (typeof superClass !== "function" && superClass !== null) {
          throw new TypeError("Super expression must either be null or a function");
      }
      subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
              value: subClass,
              writable: true,
              configurable: true
          }
      });
      if (superClass) _set_prototype_of(subClass, superClass);
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
  function _possible_constructor_return(self, call) {
      if (call && (_type_of(call) === "object" || typeof call === "function")) {
          return call;
      }
      return _assert_this_initialized(self);
  }
  function _set_prototype_of(o, p) {
      _set_prototype_of = Object.setPrototypeOf || function setPrototypeOf(o, p) {
          o.__proto__ = p;
          return o;
      };
      return _set_prototype_of(o, p);
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
  function _is_native_reflect_construct() {
      try {
          var result = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
      } catch (_) {}
      return (_is_native_reflect_construct = function() {
          return !!result;
      })();
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
  var _Scorm12API = /*#__PURE__*/ function(BaseAPI) {
      _inherits(_Scorm12API, BaseAPI);
      function _Scorm12API(settings, httpService) {
          _class_call_check(this, _Scorm12API);
          var _this;
          var settingsCopy = settings ? _object_spread({}, settings) : void 0;
          if (settingsCopy) {
              if (settingsCopy.mastery_override === void 0) {
                  settingsCopy.mastery_override = true;
              }
          }
          _this = _call_super(this, _Scorm12API, [
              scorm12_errors,
              settingsCopy,
              httpService
          ]);
          __publicField(_this, "statusSetByModule", false);
          __publicField(_this, "cmi");
          __publicField(_this, "nav");
          __publicField(_this, "LMSInitialize");
          __publicField(_this, "LMSFinish");
          __publicField(_this, "LMSGetValue");
          __publicField(_this, "LMSSetValue");
          __publicField(_this, "LMSCommit");
          __publicField(_this, "LMSGetLastError");
          __publicField(_this, "LMSGetErrorString");
          __publicField(_this, "LMSGetDiagnostic");
          _this.cmi = new CMI();
          _this.nav = new NAV();
          if (_this.settings.globalStudentPreferences && _Scorm12API._globalLearnerPrefs) {
              if (_Scorm12API._globalLearnerPrefs.audio !== "") {
                  _this.cmi.student_preference.audio = _Scorm12API._globalLearnerPrefs.audio;
              }
              if (_Scorm12API._globalLearnerPrefs.language !== "") {
                  _this.cmi.student_preference.language = _Scorm12API._globalLearnerPrefs.language;
              }
              if (_Scorm12API._globalLearnerPrefs.speed !== "") {
                  _this.cmi.student_preference.speed = _Scorm12API._globalLearnerPrefs.speed;
              }
              if (_Scorm12API._globalLearnerPrefs.text !== "") {
                  _this.cmi.student_preference.text = _Scorm12API._globalLearnerPrefs.text;
              }
          }
          _this.LMSInitialize = _this.lmsInitialize;
          _this.LMSFinish = _this.lmsFinish;
          _this.LMSGetValue = _this.lmsGetValue;
          _this.LMSSetValue = _this.lmsSetValue;
          _this.LMSCommit = _this.lmsCommit;
          _this.LMSGetLastError = _this.lmsGetLastError;
          _this.LMSGetErrorString = _this.lmsGetErrorString;
          _this.LMSGetDiagnostic = _this.lmsGetDiagnostic;
          return _this;
      }
      _create_class(_Scorm12API, [
          {
              /**
     * Called when the API needs to be reset
     */ key: "reset",
              value: function reset(settings) {
                  var _this_cmi, _this_nav;
                  this.commonReset(settings);
                  (_this_cmi = this.cmi) === null || _this_cmi === void 0 ? void 0 : _this_cmi.reset();
                  (_this_nav = this.nav) === null || _this_nav === void 0 ? void 0 : _this_nav.reset();
                  this.statusSetByModule = false;
              }
          },
          {
              /**
     * LMSInitialize - Begins a communication session with the LMS
     *
     * Per SCORM 1.2 RTE Section 3.4.3.1:
     * - Parameter must be empty string ("")
     * - Returns "true" on success, "false" on failure
     * - Sets error 101 if already initialized
     * - Sets error 101 if already terminated
     * - Initializes cmi.core.lesson_status to "not attempted" if not already set
     *
     * @param {string} parameter - Must be an empty string per SCORM 1.2 specification
     * @return {string} "true" or "false"
     */ key: "lmsInitialize",
              value: function lmsInitialize() {
                  var parameter = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
                  if (parameter !== "") {
                      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
                      return global_constants.SCORM_FALSE;
                  }
                  this.cmi.initialize();
                  if (this.cmi.core.lesson_status) {
                      this.statusSetByModule = true;
                  } else {
                      this.cmi.core.lesson_status = "not attempted";
                  }
                  return this.initialize("LMSInitialize", "LMS was already initialized!", "LMS is already finished!");
              }
          },
          {
              /**
     * LMSFinish - Ends the communication session and persists data
     *
     * Per SCORM 1.2 RTE Section 3.4.3.2:
     * - Parameter must be empty string ("")
     * - Returns "true" on success, "false" on failure
     * - Commits all data to persistent storage
     * - Sets error 101 if not initialized
     * - Sets error 101 if already terminated
     * - Processes navigation events (continue/previous) if nav.event is set
     *
     * @param {string} parameter - Must be an empty string per SCORM 1.2 specification
     * @return {string} "true" or "false"
     */ key: "lmsFinish",
              value: function lmsFinish() {
                  var parameter = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
                  if (parameter !== "") {
                      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
                      return global_constants.SCORM_FALSE;
                  }
                  var result = this.terminate("LMSFinish", true);
                  if (result === global_constants.SCORM_TRUE) {
                      if (this.nav.event !== "") {
                          if (this.nav.event === "continue") {
                              this.processListeners("SequenceNext");
                          } else {
                              this.processListeners("SequencePrevious");
                          }
                      } else if (this.settings.autoProgress) {
                          this.processListeners("SequenceNext");
                      }
                  }
                  return result;
              }
          },
          {
              /**
     * LMSGetValue - Retrieves a value from the CMI data model
     *
     * Per SCORM 1.2 RTE Section 3.4.3.3:
     * - Returns the value of the specified CMI element
     * - Returns empty string if element has no value
     * - Sets error 101 if not initialized
     * - Sets error 301 if element is not implemented (invalid element)
     * - Sets error 201 if element is write-only
     * - Sets error 202 if element is not initialized
     *
     * @param {string} CMIElement - The CMI element path (e.g., "cmi.core.score.raw")
     * @return {string} The value of the element, or empty string
     */ key: "lmsGetValue",
              value: function lmsGetValue(CMIElement) {
                  return this.getValue("LMSGetValue", false, CMIElement);
              }
          },
          {
              /**
     * LMSSetValue - Sets a value in the CMI data model
     *
     * Per SCORM 1.2 RTE Section 3.4.3.4:
     * - Sets the value of the specified CMI element
     * - Returns "true" on success, "false" on failure
     * - Sets error 101 if not initialized
     * - Sets error 301 if element is not implemented (invalid element)
     * - Sets error 351 if element exceeds maximum length
     * - Sets error 201 if element is read-only
     * - Sets error 405 if incorrect data type
     * - Triggers autocommit if enabled
     *
     * @param {string} CMIElement - The CMI element path (e.g., "cmi.core.lesson_status")
     * @param {any} value - The value to set
     * @return {string} "true" or "false"
     */ key: "lmsSetValue",
              value: function lmsSetValue(CMIElement, value) {
                  if (CMIElement === "cmi.core.lesson_status") {
                      this.statusSetByModule = true;
                  }
                  return this.setValue("LMSSetValue", "LMSCommit", false, CMIElement, value);
              }
          },
          {
              /**
     * LMSCommit - Requests immediate persistence of data to the LMS
     *
     * Per SCORM 1.2 RTE Section 3.4.4.1:
     * - Parameter must be empty string ("")
     * - Requests persistence of all data set since last successful commit
     * - Returns "true" on success, "false" on failure
     * - Sets error 101 if not initialized
     * - Sets error 391 if commit failed
     * - Does not terminate the communication session
     *
     * @param {string} parameter - Must be an empty string per SCORM 1.2 specification
     * @return {string} "true" or "false"
     */ key: "lmsCommit",
              value: function lmsCommit() {
                  var parameter = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
                  if (parameter !== "") {
                      this.throwSCORMError("api", this._error_codes.ARGUMENT_ERROR);
                      return global_constants.SCORM_FALSE;
                  }
                  if (this.settings.throttleCommits) {
                      this.scheduleCommit(500, "LMSCommit");
                      return global_constants.SCORM_TRUE;
                  } else {
                      return this.commit("LMSCommit", false);
                  }
              }
          },
          {
              /**
     * LMSGetLastError - Returns the error code from the last API call
     *
     * Per SCORM 1.2 RTE Section 3.4.4.2:
     * - Returns the error code that resulted from the last API call
     * - Returns "0" if no error occurred
     * - Can be called at any time (even before LMSInitialize)
     * - Does not change the current error state
     * - Should be called after each API call to check for errors
     *
     * @return {string} Error code as a string (e.g., "0", "101", "301")
     */ key: "lmsGetLastError",
              value: function lmsGetLastError() {
                  return this.getLastError("LMSGetLastError");
              }
          },
          {
              /**
     * LMSGetErrorString - Returns a short description for an error code
     *
     * Per SCORM 1.2 RTE Section 3.4.4.3:
     * - Returns a textual description for the specified error code
     * - Returns empty string if error code is not recognized
     * - Can be called at any time (even before LMSInitialize)
     * - Does not change the current error state
     * - Used to provide user-friendly error messages
     *
     * @param {string} CMIErrorCode - The error code to get the description for
     * @return {string} Short error description
     */ key: "lmsGetErrorString",
              value: function lmsGetErrorString(CMIErrorCode) {
                  return this.getErrorString("LMSGetErrorString", CMIErrorCode);
              }
          },
          {
              /**
     * LMSGetDiagnostic - Returns detailed diagnostic information for an error
     *
     * Per SCORM 1.2 RTE Section 3.4.4.4:
     * - Returns detailed diagnostic information for the specified error code
     * - Implementation-specific; can include additional context or debugging info
     * - Returns empty string if no diagnostic information is available
     * - Can be called at any time (even before LMSInitialize)
     * - Does not change the current error state
     * - Used for debugging and troubleshooting
     *
     * @param {string} CMIErrorCode - The error code to get diagnostic information for
     * @return {string} Detailed diagnostic information
     */ key: "lmsGetDiagnostic",
              value: function lmsGetDiagnostic(CMIErrorCode) {
                  return this.getDiagnostic("LMSGetDiagnostic", CMIErrorCode);
              }
          },
          {
              /**
     * Sets a value on the CMI Object
     *
     * @param {string} CMIElement
     * @param {*} value
     * @return {string}
     */ key: "setCMIValue",
              value: function setCMIValue(CMIElement, value) {
                  var result = this._commonSetCMIValue("LMSSetValue", false, CMIElement, value);
                  if (result === global_constants.SCORM_TRUE && this.settings.globalStudentPreferences) {
                      if (CMIElement === "cmi.student_preference.audio") {
                          this._updateGlobalPreference("audio", value);
                      } else if (CMIElement === "cmi.student_preference.language") {
                          this._updateGlobalPreference("language", value);
                      } else if (CMIElement === "cmi.student_preference.speed") {
                          this._updateGlobalPreference("speed", value);
                      } else if (CMIElement === "cmi.student_preference.text") {
                          this._updateGlobalPreference("text", value);
                      }
                  }
                  return result;
              }
          },
          {
              /**
     * Updates a specific field in the global learner preferences storage
     * @param {string} field - The preference field to update
     * @param {string} value - The value to set
     * @private
     */ key: "_updateGlobalPreference",
              value: function _updateGlobalPreference(field, value) {
                  if (!_Scorm12API._globalLearnerPrefs) {
                      _Scorm12API._globalLearnerPrefs = {
                          audio: "",
                          language: "",
                          speed: "",
                          text: ""
                      };
                  }
                  _Scorm12API._globalLearnerPrefs[field] = value;
              }
          },
          {
              /**
     * Gets a value from the CMI Object
     *
     * @param {string} CMIElement
     * @return {*}
     */ key: "getCMIValue",
              value: function getCMIValue(CMIElement) {
                  return this._commonGetCMIValue("getCMIValue", false, CMIElement);
              }
          },
          {
              /**
     * Gets or builds a new child element to add to the array.
     *
     * @param {string} CMIElement
     * @param {*} _value
     * @param {boolean} foundFirstIndex
     * @return {BaseCMI|null}
     */ key: "getChildElement",
              value: function getChildElement(CMIElement, _value, foundFirstIndex) {
                  if (stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
                      return new CMIObjectivesObject();
                  } else if (foundFirstIndex && stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
                      return new CMIInteractionsCorrectResponsesObject();
                  } else if (foundFirstIndex && stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")) {
                      return new CMIInteractionsObjectivesObject();
                  } else if (!foundFirstIndex && stringMatches(CMIElement, "cmi\\.interactions\\.\\d+")) {
                      return new CMIInteractionsObject();
                  }
                  return null;
              }
          },
          {
              /**
     * Validates Correct Response values
     *
     * @param {string} _CMIElement
     * @param {*} _value
     */ key: "validateCorrectResponse",
              value: function validateCorrectResponse(_CMIElement, _value) {}
          },
          {
              /**
     * Returns the message that corresponds to errorNumber.
     *
     * @param {number|string} errorNumber
     * @param {boolean} detail
     * @return {string}
     */ key: "getLmsErrorMessageDetails",
              value: function getLmsErrorMessageDetails(errorNumber, detail) {
                  var basicMessage = "No Error";
                  var detailMessage = "No Error";
                  errorNumber = String(errorNumber);
                  if (scorm12_constants.error_descriptions[errorNumber]) {
                      var _scorm12_constants_error_descriptions_errorNumber, _scorm12_constants_error_descriptions_errorNumber1;
                      basicMessage = ((_scorm12_constants_error_descriptions_errorNumber = scorm12_constants.error_descriptions[errorNumber]) === null || _scorm12_constants_error_descriptions_errorNumber === void 0 ? void 0 : _scorm12_constants_error_descriptions_errorNumber.basicMessage) || basicMessage;
                      detailMessage = ((_scorm12_constants_error_descriptions_errorNumber1 = scorm12_constants.error_descriptions[errorNumber]) === null || _scorm12_constants_error_descriptions_errorNumber1 === void 0 ? void 0 : _scorm12_constants_error_descriptions_errorNumber1.detailMessage) || detailMessage;
                  }
                  return detail ? detailMessage : basicMessage;
              }
          },
          {
              /**
     * Replace the whole API with another
     *
     * @param {Scorm12API} newAPI
     */ key: "replaceWithAnotherScormAPI",
              value: function replaceWithAnotherScormAPI(newAPI) {
                  this.cmi = newAPI.cmi;
              }
          },
          {
              /**
     * Render the cmi object to the proper format for LMS commit
     *
     * @param {boolean} terminateCommit - Whether this is a termination commit
     * @param {boolean} includeTotalTime - Whether to include total time in the commit data
     * @return {object|Array}
     */ key: "renderCommitCMI",
              value: function renderCommitCMI(terminateCommit) {
                  var includeTotalTime = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                  var cmiExport = this.renderCMIToJSONObject();
                  if (terminateCommit || includeTotalTime) {
                      cmiExport.cmi.core.total_time = this.cmi.getCurrentTotalTime();
                  }
                  var flattened = flatten(cmiExport);
                  switch(this.settings.dataCommitFormat){
                      case "flattened":
                          return flattened;
                      case "params":
                          return Object.entries(flattened).map(function(param) {
                              var _param = _sliced_to_array(param, 2), item = _param[0], value = _param[1];
                              return "".concat(item, "=").concat(value);
                          });
                      case "json":
                      default:
                          return cmiExport;
                  }
              }
          },
          {
              /**
     * Render the cmi object to the proper format for LMS commit
     * @param {boolean} terminateCommit - Whether this is a termination commit
     * @param {boolean} includeTotalTime - Whether to include total time in the commit data
     * @return {CommitObject}
     */ key: "renderCommitObject",
              value: function renderCommitObject(terminateCommit) {
                  var includeTotalTime = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
                  var _this_cmi_core_score, _this_cmi_core, _this_cmi;
                  var cmiExport = this.renderCommitCMI(terminateCommit, includeTotalTime);
                  var calculateTotalTime = terminateCommit || includeTotalTime;
                  var totalTimeHHMMSS = calculateTotalTime ? this.cmi.getCurrentTotalTime() : "";
                  var totalTimeSeconds = getTimeAsSeconds(totalTimeHHMMSS, scorm12_regex.CMITimespan);
                  var lessonStatus = this.cmi.core.lesson_status;
                  var completionStatus = CompletionStatus.UNKNOWN;
                  var successStatus = SuccessStatus.UNKNOWN;
                  if (lessonStatus) {
                      completionStatus = lessonStatus === "completed" || lessonStatus === "passed" ? CompletionStatus.COMPLETED : CompletionStatus.INCOMPLETE;
                      if (lessonStatus === "passed") {
                          successStatus = SuccessStatus.PASSED;
                      } else if (lessonStatus === "failed") {
                          successStatus = SuccessStatus.FAILED;
                      }
                  }
                  var scoreObject = ((_this_cmi = this.cmi) === null || _this_cmi === void 0 ? void 0 : (_this_cmi_core = _this_cmi.core) === null || _this_cmi_core === void 0 ? void 0 : (_this_cmi_core_score = _this_cmi_core.score) === null || _this_cmi_core_score === void 0 ? void 0 : _this_cmi_core_score.getScoreObject()) || {};
                  var commitObject = {
                      successStatus: successStatus,
                      completionStatus: completionStatus,
                      runtimeData: cmiExport,
                      totalTimeSeconds: totalTimeSeconds
                  };
                  if (scoreObject) {
                      commitObject.score = scoreObject;
                  }
                  if (this.settings.autoPopulateCommitMetadata) {
                      if (this.settings.courseId) {
                          commitObject.courseId = this.settings.courseId;
                      }
                      if (this.settings.scoId) {
                          commitObject.scoId = this.settings.scoId;
                      }
                      if (this.cmi.core.student_id) {
                          commitObject.learnerId = this.cmi.core.student_id;
                      }
                      if (this.cmi.core.student_name) {
                          commitObject.learnerName = this.cmi.core.student_name;
                      }
                  }
                  return commitObject;
              }
          },
          {
              /**
     * Attempts to store the data to the LMS
     *
     * @param {boolean} terminateCommit
     * @param {CommitTrigger} [trigger] - What initiated the commit
     * @return {ResultObject}
     */ key: "storeData",
              value: function storeData(terminateCommit, trigger) {
                  if (terminateCommit) {
                      var originalStatus = this.cmi.core.lesson_status;
                      if (this.cmi.core.lesson_mode === "browse") {
                          var _this_startingData_cmi_core, _this_startingData_cmi, _this_startingData;
                          var startingStatus = ((_this_startingData = this.startingData) === null || _this_startingData === void 0 ? void 0 : (_this_startingData_cmi = _this_startingData.cmi) === null || _this_startingData_cmi === void 0 ? void 0 : (_this_startingData_cmi_core = _this_startingData_cmi.core) === null || _this_startingData_cmi_core === void 0 ? void 0 : _this_startingData_cmi_core.lesson_status) || "";
                          if (startingStatus === "" && originalStatus === "not attempted") {
                              this.cmi.core.lesson_status = "browsed";
                              return this.processCommitData(terminateCommit, trigger);
                          }
                      }
                      if (!this.cmi.core.lesson_status || !this.statusSetByModule && this.cmi.core.lesson_status === "not attempted") {
                          this.cmi.core.lesson_status = this.settings.autoCompleteLessonStatus ? "completed" : "incomplete";
                      }
                      if (this.cmi.core.lesson_mode === "normal") {
                          if (this.cmi.core.credit === "credit") {
                              if (this.settings.mastery_override && this.cmi.student_data.mastery_score !== "" && this.cmi.core.score.raw !== "") {
                                  var rawScore = parseFloat(this.cmi.core.score.raw);
                                  var masteryScore = parseFloat(this.cmi.student_data.mastery_score);
                                  if (!isNaN(rawScore) && !isNaN(masteryScore)) {
                                      this.cmi.core.lesson_status = rawScore >= masteryScore ? "passed" : "failed";
                                  }
                              }
                          }
                      }
                      if (this.settings.score_overrides_status && this.statusSetByModule && this.cmi.core.lesson_mode === "normal" && this.cmi.core.credit === "credit" && this.cmi.student_data.mastery_score !== "" && this.cmi.core.score.raw !== "") {
                          var rawScore1 = parseFloat(this.cmi.core.score.raw);
                          var masteryScore1 = parseFloat(this.cmi.student_data.mastery_score);
                          if (!isNaN(rawScore1) && !isNaN(masteryScore1)) {
                              if (rawScore1 >= masteryScore1) {
                                  this.cmi.core.lesson_status = "passed";
                              } else {
                                  this.cmi.core.lesson_status = "failed";
                              }
                          }
                      }
                  }
                  return this.processCommitData(terminateCommit, trigger);
              }
          },
          {
              key: "processCommitData",
              value: function processCommitData(terminateCommit, trigger) {
                  var commitObject = this.getCommitObject(terminateCommit);
                  if (typeof this.settings.lmsCommitUrl === "string") {
                      return this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit, trigger);
                  } else {
                      return {
                          result: global_constants.SCORM_TRUE,
                          errorCode: 0
                      };
                  }
              }
          }
      ], [
          {
              key: "clearGlobalPreferences",
              value: /**
     * Clear the global learner preferences storage
     * @public
     */ function clearGlobalPreferences() {
                  _Scorm12API._globalLearnerPrefs = null;
              }
          }
      ]);
      return _Scorm12API;
  }(BaseAPI);
  /**
   * Static global storage for learner preferences
   * When globalStudentPreferences is enabled, preferences persist across SCO instances
   * @private
   */ __publicField(_Scorm12API, "_globalLearnerPrefs", null);
  var Scorm12API = _Scorm12API;

  return Scorm12API;

})();
//# sourceMappingURL=scorm12.js.map
