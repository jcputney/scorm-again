/******/ (function() { // webpackBootstrap
/******/ 	"use strict";

;// ./node_modules/tslib/tslib.es6.mjs
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

/* harmony default export */ var tslib_es6 = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
});

;// ./src/constants/api_constants.ts

var global = {
    SCORM_TRUE: "true",
    SCORM_FALSE: "false",
    STATE_NOT_INITIALIZED: 0,
    STATE_INITIALIZED: 1,
    STATE_TERMINATED: 2,
    LOG_LEVEL_DEBUG: 1,
    LOG_LEVEL_INFO: 2,
    LOG_LEVEL_WARNING: 3,
    LOG_LEVEL_ERROR: 4,
    LOG_LEVEL_NONE: 5,
};
var scorm12 = {
    cmi_children: "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions",
    core_children: "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
    score_children: "raw,min,max",
    comments_children: "content,location,time",
    objectives_children: "id,score,status",
    correct_responses_children: "pattern",
    student_data_children: "mastery_score,max_time_allowed,time_limit_action",
    student_preference_children: "audio,language,speed,text",
    interactions_children: "id,objectives,time,type,correct_responses,weighting,student_response,result,latency",
    error_descriptions: {
        "101": {
            basicMessage: "General Exception",
            detailMessage: "No specific error code exists to describe the error. Use LMSGetDiagnostic for more information",
        },
        "201": {
            basicMessage: "Invalid argument error",
            detailMessage: "Indicates that an argument represents an invalid data model element or is otherwise incorrect.",
        },
        "202": {
            basicMessage: "Element cannot have children",
            detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_children" for a data model element that does not support the "_children" suffix.',
        },
        "203": {
            basicMessage: "Element not an array - cannot have count",
            detailMessage: 'Indicates that LMSGetValue was called with a data model element name that ends in "_count" for a data model element that does not support the "_count" suffix.',
        },
        "301": {
            basicMessage: "Not initialized",
            detailMessage: "Indicates that an API call was made before the call to lmsInitialize.",
        },
        "401": {
            basicMessage: "Not implemented error",
            detailMessage: "The data model element indicated in a call to LMSGetValue or LMSSetValue is valid, but was not implemented by this LMS. SCORM 1.2 defines a set of data model elements as being optional for an LMS to implement.",
        },
        "402": {
            basicMessage: "Invalid set value, element is a keyword",
            detailMessage: 'Indicates that LMSSetValue was called on a data model element that represents a keyword (elements that end in "_children" and "_count").',
        },
        "403": {
            basicMessage: "Element is read only",
            detailMessage: "LMSSetValue was called with a data model element that can only be read.",
        },
        "404": {
            basicMessage: "Element is write only",
            detailMessage: "LMSGetValue was called on a data model element that can only be written to.",
        },
        "405": {
            basicMessage: "Incorrect Data Type",
            detailMessage: "LMSSetValue was called with a value that is not consistent with the data format of the supplied data model element.",
        },
        "407": {
            basicMessage: "Element Value Out Of Range",
            detailMessage: "The numeric value supplied to a LMSSetValue call is outside of the numeric range allowed for the supplied data model element.",
        },
        "408": {
            basicMessage: "Data Model Dependency Not Established",
            detailMessage: "Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element.",
        },
    },
};
var aicc = __assign(__assign({}, scorm12), {
    cmi_children: "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions,evaluation",
    student_preference_children: "audio,language,lesson_type,speed,text,text_color,text_location,text_size,video,windows",
    student_data_children: "attempt_number,tries,mastery_score,max_time_allowed,time_limit_action",
    student_demographics_children: "city,class,company,country,experience,familiar_name,instructor_name,title,native_language,state,street_address,telephone,years_experience",
    tries_children: "time,status,score",
    attempt_records_children: "score,lesson_status",
    paths_children: "location_id,date,time,status,why_left,time_in_element",
});
var scorm2004 = {
    cmi_children: "_version,comments_from_learner,comments_from_lms,completion_status,credit,entry,exit,interactions,launch_data,learner_id,learner_name,learner_preference,location,max_time_allowed,mode,objectives,progress_measure,scaled_passing_score,score,session_time,success_status,suspend_data,time_limit_action,total_time",
    comments_children: "comment,timestamp,location",
    score_children: "max,raw,scaled,min",
    objectives_children: "progress_measure,completion_status,success_status,description,score,id",
    correct_responses_children: "pattern",
    student_data_children: "mastery_score,max_time_allowed,time_limit_action",
    student_preference_children: "audio_level,audio_captioning,delivery_speed,language",
    interactions_children: "id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description",
    error_descriptions: {
        "0": {
            basicMessage: "No Error",
            detailMessage: "No error occurred, the previous API call was successful.",
        },
        "101": {
            basicMessage: "General Exception",
            detailMessage: "No specific error code exists to describe the error. Use GetDiagnostic for more information.",
        },
        "102": {
            basicMessage: "General Initialization Failure",
            detailMessage: "Call to Initialize failed for an unknown reason.",
        },
        "103": {
            basicMessage: "Already Initialized",
            detailMessage: "Call to Initialize failed because Initialize was already called.",
        },
        "104": {
            basicMessage: "Content Instance Terminated",
            detailMessage: "Call to Initialize failed because Terminate was already called.",
        },
        "111": {
            basicMessage: "General Termination Failure",
            detailMessage: "Call to Terminate failed for an unknown reason.",
        },
        "112": {
            basicMessage: "Termination Before Initialization",
            detailMessage: "Call to Terminate failed because it was made before the call to Initialize.",
        },
        "113": {
            basicMessage: "Termination After Termination",
            detailMessage: "Call to Terminate failed because Terminate was already called.",
        },
        "122": {
            basicMessage: "Retrieve Data Before Initialization",
            detailMessage: "Call to GetValue failed because it was made before the call to Initialize.",
        },
        "123": {
            basicMessage: "Retrieve Data After Termination",
            detailMessage: "Call to GetValue failed because it was made after the call to Terminate.",
        },
        "132": {
            basicMessage: "Store Data Before Initialization",
            detailMessage: "Call to SetValue failed because it was made before the call to Initialize.",
        },
        "133": {
            basicMessage: "Store Data After Termination",
            detailMessage: "Call to SetValue failed because it was made after the call to Terminate.",
        },
        "142": {
            basicMessage: "Commit Before Initialization",
            detailMessage: "Call to Commit failed because it was made before the call to Initialize.",
        },
        "143": {
            basicMessage: "Commit After Termination",
            detailMessage: "Call to Commit failed because it was made after the call to Terminate.",
        },
        "201": {
            basicMessage: "General Argument Error",
            detailMessage: "An invalid argument was passed to an API method (usually indicates that Initialize, Commit or Terminate did not receive the expected empty string argument.",
        },
        "301": {
            basicMessage: "General Get Failure",
            detailMessage: "Indicates a failed GetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.",
        },
        "351": {
            basicMessage: "General Set Failure",
            detailMessage: "Indicates a failed SetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.",
        },
        "391": {
            basicMessage: "General Commit Failure",
            detailMessage: "Indicates a failed Commit call where no other specific error code is applicable. Use GetDiagnostic for more information.",
        },
        "401": {
            basicMessage: "Undefined Data Model Element",
            detailMessage: "The data model element name passed to GetValue or SetValue is not a valid SCORM data model element.",
        },
        "402": {
            basicMessage: "Unimplemented Data Model Element",
            detailMessage: "The data model element indicated in a call to GetValue or SetValue is valid, but was not implemented by this LMS. In SCORM 2004, this error would indicate an LMS that is not fully SCORM conformant.",
        },
        "403": {
            basicMessage: "Data Model Element Value Not Initialized",
            detailMessage: "Attempt to read a data model element that has not been initialized by the LMS or through a SetValue call. This error condition is often reached during normal execution of a SCO.",
        },
        "404": {
            basicMessage: "Data Model Element Is Read Only",
            detailMessage: "SetValue was called with a data model element that can only be read.",
        },
        "405": {
            basicMessage: "Data Model Element Is Write Only",
            detailMessage: "GetValue was called on a data model element that can only be written to.",
        },
        "406": {
            basicMessage: "Data Model Element Type Mismatch",
            detailMessage: "SetValue was called with a value that is not consistent with the data format of the supplied data model element.",
        },
        "407": {
            basicMessage: "Data Model Element Value Out Of Range",
            detailMessage: "The numeric value supplied to a SetValue call is outside of the numeric range allowed for the supplied data model element.",
        },
        "408": {
            basicMessage: "Data Model Dependency Not Established",
            detailMessage: "Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element.",
        },
    },
};
var APIConstants = {
    global: global,
    scorm12: scorm12,
    aicc: aicc,
    scorm2004: scorm2004,
};
/* harmony default export */ var api_constants = (APIConstants);

;// ./src/constants/error_codes.ts

var error_codes_global = {
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
    DEPENDENCY_NOT_ESTABLISHED: 101,
};
var error_codes_scorm12 = __assign(__assign({}, error_codes_global), { RETRIEVE_BEFORE_INIT: 301, STORE_BEFORE_INIT: 301, COMMIT_BEFORE_INIT: 301, ARGUMENT_ERROR: 201, CHILDREN_ERROR: 202, COUNT_ERROR: 203, UNDEFINED_DATA_MODEL: 401, UNIMPLEMENTED_ELEMENT: 401, VALUE_NOT_INITIALIZED: 301, INVALID_SET_VALUE: 402, READ_ONLY_ELEMENT: 403, WRITE_ONLY_ELEMENT: 404, TYPE_MISMATCH: 405, VALUE_OUT_OF_RANGE: 407, DEPENDENCY_NOT_ESTABLISHED: 408 });
var error_codes_scorm2004 = __assign(__assign({}, error_codes_global), { INITIALIZATION_FAILED: 102, INITIALIZED: 103, TERMINATED: 104, TERMINATION_FAILURE: 111, TERMINATION_BEFORE_INIT: 112, MULTIPLE_TERMINATIONS: 113, RETRIEVE_BEFORE_INIT: 122, RETRIEVE_AFTER_TERM: 123, STORE_BEFORE_INIT: 132, STORE_AFTER_TERM: 133, COMMIT_BEFORE_INIT: 142, COMMIT_AFTER_TERM: 143, ARGUMENT_ERROR: 201, GENERAL_GET_FAILURE: 301, GENERAL_SET_FAILURE: 351, GENERAL_COMMIT_FAILURE: 391, UNDEFINED_DATA_MODEL: 401, UNIMPLEMENTED_ELEMENT: 402, VALUE_NOT_INITIALIZED: 403, READ_ONLY_ELEMENT: 404, WRITE_ONLY_ELEMENT: 405, TYPE_MISMATCH: 406, VALUE_OUT_OF_RANGE: 407, DEPENDENCY_NOT_ESTABLISHED: 408 });
var ErrorCodes = {
    scorm12: error_codes_scorm12,
    scorm2004: error_codes_scorm2004,
};
/* harmony default export */ var error_codes = (ErrorCodes);

;// ./src/constants/regex.ts

var regex_scorm12 = {
    CMIString256: "^.{0,255}$",
    CMIString4096: "^.{0,4096}$",
    CMITime: "^(?:[01]\\d|2[0123]):(?:[012345]\\d):(?:[012345]\\d)$",
    CMITimespan: "^([0-9]{2,}):([0-9]{2}):([0-9]{2})(.[0-9]{1,2})?$",
    CMIInteger: "^\\d+$",
    CMISInteger: "^-?([0-9]+)$",
    CMIDecimal: "^-?([0-9]{0,3})(.[0-9]*)?$",
    CMIIdentifier: "^[\\u0021-\\u007E\\s]{0,255}$",
    CMIFeedback: "^.{0,255}$",
    CMIIndex: "[._](\\d+).",
    CMIStatus: "^(passed|completed|failed|incomplete|browsed)$",
    CMIStatus2: "^(passed|completed|failed|incomplete|browsed|not attempted)$",
    CMIExit: "^(time-out|suspend|logout|)$",
    CMIType: "^(true-false|choice|fill-in|matching|performance|sequencing|likert|numeric)$",
    CMIResult: "^(correct|wrong|unanticipated|neutral|([0-9]{0,3})?(\\.[0-9]*)?)$",
    NAVEvent: "^(previous|continue)$",
    score_range: "0#100",
    audio_range: "-1#100",
    speed_range: "-100#100",
    weighting_range: "-100#100",
    text_range: "-1#1",
};
var regex_aicc = __assign(__assign({}, regex_scorm12), {
    CMIIdentifier: "^\\w{1,255}$",
});
var regex_scorm2004 = {
    CMIString200: "^[\\u0000-\\uFFFF]{0,200}$",
    CMIString250: "^[\\u0000-\\uFFFF]{0,250}$",
    CMIString1000: "^[\\u0000-\\uFFFF]{0,1000}$",
    CMIString4000: "^[\\u0000-\\uFFFF]{0,4000}$",
    CMIString64000: "^[\\u0000-\\uFFFF]{0,64000}$",
    CMILang: "^([a-zA-Z]{2,3}|i|x)(-[a-zA-Z0-9-]{2,8})?$|^$",
    CMILangString250: "^({lang=([a-zA-Z]{2,3}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,250}$)?$",
    CMILangcr: "^(({lang=([a-zA-Z]{2,3}|i|x)?(-[a-zA-Z0-9-]{2,8})?}))(.*?)$",
    CMILangString250cr: "^(({lang=([a-zA-Z]{2,3}|i|x)?(-[a-zA-Z0-9-]{2,8})?})?(.{0,250})?)?$",
    CMILangString4000: "^({lang=([a-zA-Z]{2,3}|i|x)(-[a-zA-Z0-9-]{2,8})?})?((?!{.*$).{0,4000}$)?$",
    CMITime: "^(19[7-9]{1}[0-9]{1}|20[0-2]{1}[0-9]{1}|203[0-8]{1})((-(0[1-9]{1}|1[0-2]{1}))((-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1}))(T([0-1]{1}[0-9]{1}|2[0-3]{1})((:[0-5]{1}[0-9]{1})((:[0-5]{1}[0-9]{1})((\\.[0-9]{1,2})((Z|([+|-]([0-1]{1}[0-9]{1}|2[0-3]{1})))(:[0-5]{1}[0-9]{1})?)?)?)?)?)?)?)?$",
    CMITimespan: "^P(?:([.,\\d]+)Y)?(?:([.,\\d]+)M)?(?:([.,\\d]+)W)?(?:([.,\\d]+)D)?(?:T?(?:([.,\\d]+)H)?(?:([.,\\d]+)M)?(?:([.,\\d]+)S)?)?$",
    CMIInteger: "^\\d+$",
    CMISInteger: "^-?([0-9]+)$",
    CMIDecimal: "^-?([0-9]{1,5})(\\.[0-9]{1,18})?$",
    CMIIdentifier: "^\\S{1,250}[a-zA-Z0-9]$",
    CMIShortIdentifier: "^[\\w\\.\\-\\_]{1,250}$",
    CMILongIdentifier: "^(?:(?!urn:)\\S{1,4000}|urn:[A-Za-z0-9-]{1,31}:\\S{1,4000}|.{1,4000})$",
    CMIFeedback: "^.*$",
    CMIIndex: "[._](\\d+).",
    CMIIndexStore: ".N(\\d+).",
    CMICStatus: "^(completed|incomplete|not attempted|unknown)$",
    CMISStatus: "^(passed|failed|unknown)$",
    CMIExit: "^(time-out|suspend|logout|normal)$",
    CMIType: "^(true-false|choice|fill-in|long-fill-in|matching|performance|sequencing|likert|numeric|other)$",
    CMIResult: "^(correct|incorrect|unanticipated|neutral|-?([0-9]{1,4})(\\.[0-9]{1,18})?)$",
    NAVEvent: "^(previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|{target=\\S{0,200}[a-zA-Z0-9]}choice|jump)$",
    NAVBoolean: "^(unknown|true|false$)",
    NAVTarget: "^(previous|continue|choice.{target=\\S{0,200}[a-zA-Z0-9]})$",
    scaled_range: "-1#1",
    audio_range: "0#*",
    speed_range: "0#*",
    text_range: "-1#1",
    progress_range: "0#1",
};
var Regex = {
    aicc: regex_aicc,
    scorm12: regex_scorm12,
    scorm2004: regex_scorm2004,
};
/* harmony default export */ var regex = (Regex);

;// ./src/cmi/common.ts




var scorm12_constants = api_constants.scorm12;
var scorm12_regex = regex.scorm12;
var scorm12_error_codes = error_codes.scorm12;
var BaseScormValidationError = (function (_super) {
    __extends(BaseScormValidationError, _super);
    function BaseScormValidationError(errorCode) {
        var _this = _super.call(this, errorCode.toString()) || this;
        _this._errorCode = errorCode;
        _this.name = "ScormValidationError";
        return _this;
    }
    Object.defineProperty(BaseScormValidationError.prototype, "errorCode", {
        get: function () {
            return this._errorCode;
        },
        enumerable: false,
        configurable: true
    });
    BaseScormValidationError.prototype.setMessage = function (message) {
        this.message = message;
    };
    return BaseScormValidationError;
}(Error));

var BaseScorm12ValidationError = (function (_super) {
    __extends(BaseScorm12ValidationError, _super);
    function BaseScorm12ValidationError(errorCode) {
        var _this = _super.call(this, errorCode) || this;
        _this.name = "Scorm12ValidationError";
        return _this;
    }
    return BaseScorm12ValidationError;
}(BaseScormValidationError));

var BaseScorm2004ValidationError = (function (_super) {
    __extends(BaseScorm2004ValidationError, _super);
    function BaseScorm2004ValidationError(errorCode) {
        var _this = _super.call(this, errorCode) || this;
        _this.name = "Scorm2004ValidationError";
        return _this;
    }
    return BaseScorm2004ValidationError;
}(BaseScormValidationError));

function checkValidFormat(value, regexPattern, errorCode, errorClass, allowEmptyString) {
    var formatRegex = new RegExp(regexPattern);
    var matches = value.match(formatRegex);
    if (allowEmptyString && value === "") {
        return true;
    }
    if (value === undefined || !matches || matches[0] === "") {
        throw new errorClass(errorCode);
    }
    return true;
}
function checkValidRange(value, rangePattern, errorCode, errorClass) {
    var ranges = rangePattern.split("#");
    value = value * 1.0;
    if (value >= ranges[0]) {
        if (ranges[1] === "*" || value <= ranges[1]) {
            return true;
        }
        else {
            throw new errorClass(errorCode);
        }
    }
    else {
        throw new errorClass(errorCode);
    }
}
var BaseCMI = (function () {
    function BaseCMI() {
        this.jsonString = false;
        this._initialized = false;
    }
    Object.defineProperty(BaseCMI.prototype, "initialized", {
        get: function () {
            return this._initialized;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseCMI.prototype, "start_time", {
        get: function () {
            return this._start_time;
        },
        enumerable: false,
        configurable: true
    });
    BaseCMI.prototype.initialize = function () {
        this._initialized = true;
    };
    BaseCMI.prototype.setStartTime = function () {
        this._start_time = new Date().getTime();
    };
    return BaseCMI;
}());

var BaseRootCMI = (function (_super) {
    __extends(BaseRootCMI, _super);
    function BaseRootCMI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BaseRootCMI;
}(BaseCMI));

var CMIScore = (function (_super) {
    __extends(CMIScore, _super);
    function CMIScore(params) {
        var _this = _super.call(this) || this;
        _this._raw = "";
        _this._min = "";
        _this.__children = params.score_children || scorm12_constants.score_children;
        _this.__score_range = !params.score_range
            ? false
            : scorm12_regex.score_range;
        _this._max = params.max || params.max === "" ? params.max : "100";
        _this.__invalid_error_code =
            params.invalidErrorCode || scorm12_error_codes.INVALID_SET_VALUE;
        _this.__invalid_type_code =
            params.invalidTypeCode || scorm12_error_codes.TYPE_MISMATCH;
        _this.__invalid_range_code =
            params.invalidRangeCode || scorm12_error_codes.VALUE_OUT_OF_RANGE;
        _this.__decimal_regex = params.decimalRegex || scorm12_regex.CMIDecimal;
        _this.__error_class = params.errorClass;
        return _this;
    }
    Object.defineProperty(CMIScore.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new this.__error_class(this.__invalid_error_code);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIScore.prototype, "raw", {
        get: function () {
            return this._raw;
        },
        set: function (raw) {
            if (checkValidFormat(raw, this.__decimal_regex, this.__invalid_type_code, this.__error_class) &&
                (!this.__score_range ||
                    checkValidRange(raw, this.__score_range, this.__invalid_range_code, this.__error_class))) {
                this._raw = raw;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIScore.prototype, "min", {
        get: function () {
            return this._min;
        },
        set: function (min) {
            if (checkValidFormat(min, this.__decimal_regex, this.__invalid_type_code, this.__error_class) &&
                (!this.__score_range ||
                    checkValidRange(min, this.__score_range, this.__invalid_range_code, this.__error_class))) {
                this._min = min;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIScore.prototype, "max", {
        get: function () {
            return this._max;
        },
        set: function (max) {
            if (checkValidFormat(max, this.__decimal_regex, this.__invalid_type_code, this.__error_class) &&
                (!this.__score_range ||
                    checkValidRange(max, this.__score_range, this.__invalid_range_code, this.__error_class))) {
                this._max = max;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIScore.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            raw: this.raw,
            min: this.min,
            max: this.max,
        };
        delete this.jsonString;
        return result;
    };
    return CMIScore;
}(BaseCMI));

var CMIArray = (function (_super) {
    __extends(CMIArray, _super);
    function CMIArray(params) {
        var _this = _super.call(this) || this;
        _this.__children = params.children;
        _this._errorCode = params.errorCode || scorm12_error_codes.GENERAL;
        _this._errorClass = params.errorClass || BaseScorm12ValidationError;
        _this.childArray = [];
        return _this;
    }
    Object.defineProperty(CMIArray.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new this._errorClass(this._errorCode);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIArray.prototype, "_count", {
        get: function () {
            return this.childArray.length;
        },
        set: function (_count) {
            throw new this._errorClass(this._errorCode);
        },
        enumerable: false,
        configurable: true
    });
    CMIArray.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {};
        for (var i = 0; i < this.childArray.length; i++) {
            result[i + ""] = this.childArray[i];
        }
        delete this.jsonString;
        return result;
    };
    return CMIArray;
}(BaseCMI));


;// ./src/exceptions.ts



var scorm12_errors = api_constants.scorm12.error_descriptions;
var aicc_errors = api_constants.aicc.error_descriptions;
var scorm2004_errors = api_constants.scorm2004.error_descriptions;
var ValidationError = (function (_super) {
    __extends(ValidationError, _super);
    function ValidationError(errorCode, errorMessage, detailedMessage) {
        var _this = _super.call(this, errorCode) || this;
        _this._detailedMessage = "";
        _this.setMessage(errorMessage);
        _this._errorMessage = errorMessage;
        if (detailedMessage) {
            _this._detailedMessage = detailedMessage;
        }
        return _this;
    }
    Object.defineProperty(ValidationError.prototype, "errorMessage", {
        get: function () {
            return this._errorMessage;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ValidationError.prototype, "detailedMessage", {
        get: function () {
            return this._detailedMessage;
        },
        enumerable: false,
        configurable: true
    });
    return ValidationError;
}(BaseScormValidationError));

var Scorm12ValidationError = (function (_super) {
    __extends(Scorm12ValidationError, _super);
    function Scorm12ValidationError(errorCode) {
        var _this = this;
        if ({}.hasOwnProperty.call(scorm12_errors, String(errorCode))) {
            _this = _super.call(this, errorCode, scorm12_errors[String(errorCode)].basicMessage, scorm12_errors[String(errorCode)].detailMessage) || this;
        }
        else {
            _this = _super.call(this, 101, scorm12_errors["101"].basicMessage, scorm12_errors["101"].detailMessage) || this;
        }
        return _this;
    }
    return Scorm12ValidationError;
}(ValidationError));

var AICCValidationError = (function (_super) {
    __extends(AICCValidationError, _super);
    function AICCValidationError(errorCode) {
        var _this = this;
        if ({}.hasOwnProperty.call(aicc_errors, String(errorCode))) {
            _this = _super.call(this, errorCode, aicc_errors[String(errorCode)].basicMessage, aicc_errors[String(errorCode)].detailMessage) || this;
        }
        else {
            _this = _super.call(this, 101, aicc_errors["101"].basicMessage, aicc_errors["101"].detailMessage) || this;
        }
        return _this;
    }
    return AICCValidationError;
}(ValidationError));

var Scorm2004ValidationError = (function (_super) {
    __extends(Scorm2004ValidationError, _super);
    function Scorm2004ValidationError(errorCode) {
        var _this = this;
        if ({}.hasOwnProperty.call(scorm2004_errors, String(errorCode))) {
            _this = _super.call(this, errorCode, scorm2004_errors[String(errorCode)].basicMessage, scorm2004_errors[String(errorCode)].detailMessage) || this;
        }
        else {
            _this = _super.call(this, 101, scorm2004_errors["101"].basicMessage, scorm2004_errors["101"].detailMessage) || this;
        }
        return _this;
    }
    return Scorm2004ValidationError;
}(ValidationError));


;// ./src/utilities.ts
var SECONDS_PER_SECOND = 1.0;
var SECONDS_PER_MINUTE = 60;
var SECONDS_PER_HOUR = 60 * SECONDS_PER_MINUTE;
var SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;
var designations = {
    D: SECONDS_PER_DAY,
    H: SECONDS_PER_HOUR,
    M: SECONDS_PER_MINUTE,
    S: SECONDS_PER_SECOND,
};
function getSecondsAsHHMMSS(totalSeconds) {
    if (!totalSeconds || totalSeconds <= 0) {
        return "00:00:00";
    }
    var hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
    var dateObj = new Date(totalSeconds * 1000);
    var minutes = dateObj.getUTCMinutes();
    var seconds = dateObj.getSeconds();
    var ms = totalSeconds % 1.0;
    var msStr = "";
    if (countDecimals(ms) > 0) {
        if (countDecimals(ms) > 2) {
            msStr = ms.toFixed(2);
        }
        else {
            msStr = String(ms);
        }
        msStr = "." + msStr.split(".")[1];
    }
    return ((hours + ":" + minutes + ":" + seconds).replace(/\b\d\b/g, "0$&") + msStr);
}
function getSecondsAsISODuration(seconds) {
    if (!seconds || seconds <= 0) {
        return "PT0S";
    }
    var duration = "P";
    var remainder = seconds;
    for (var designationsKey in designations) {
        var current_seconds = designations[designationsKey];
        var value = Math.floor(remainder / current_seconds);
        remainder = remainder % current_seconds;
        if (countDecimals(remainder) > 2) {
            remainder = Number(Number(remainder).toFixed(2));
        }
        if (designationsKey === "S" && remainder > 0) {
            value += remainder;
        }
        if (value) {
            if ((duration.indexOf("D") > 0 ||
                designationsKey === "H" ||
                designationsKey === "M" ||
                designationsKey === "S") &&
                duration.indexOf("T") === -1) {
                duration += "T";
            }
            duration += "".concat(value).concat(designationsKey);
        }
    }
    return duration;
}
function getTimeAsSeconds(timeString, timeRegex) {
    if (typeof timeString === "number" || typeof timeString === "boolean") {
        timeString = String(timeString);
    }
    if (typeof timeRegex === "string") {
        timeRegex = new RegExp(timeRegex);
    }
    if (!timeString || !timeString.match(timeRegex)) {
        return 0;
    }
    var parts = timeString.split(":");
    var hours = Number(parts[0]);
    var minutes = Number(parts[1]);
    var seconds = Number(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
}
function getDurationAsSeconds(duration, durationRegex) {
    if (typeof durationRegex === "string") {
        durationRegex = new RegExp(durationRegex);
    }
    if (!duration || !duration.match(durationRegex)) {
        return 0;
    }
    var _a = new RegExp(durationRegex).exec(duration) || [], years = _a[1], _ = _a[2], days = _a[4], hours = _a[5], minutes = _a[6], seconds = _a[7];
    var result = 0.0;
    result += Number(seconds) || 0.0;
    result += Number(minutes) * 60.0 || 0.0;
    result += Number(hours) * 3600.0 || 0.0;
    result += Number(days) * (60 * 60 * 24.0) || 0.0;
    result += Number(years) * (60 * 60 * 24 * 365.0) || 0.0;
    return result;
}
function addTwoDurations(first, second, durationRegex) {
    var regex = typeof durationRegex === "string"
        ? new RegExp(durationRegex)
        : durationRegex;
    return getSecondsAsISODuration(getDurationAsSeconds(first, regex) + getDurationAsSeconds(second, regex));
}
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
        }
        else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++) {
                recurse(cur[i], prop + "[" + i + "]");
                if (l === 0)
                    result[prop] = [];
            }
        }
        else {
            var isEmpty = true;
            for (var p in cur) {
                if ({}.hasOwnProperty.call(cur, p)) {
                    isEmpty = false;
                    recurse(cur[p], prop ? prop + "." + p : p);
                }
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}
function unflatten(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var regex = /\.?([^.[\]]+)|\[(\d+)]/g;
    var result = {};
    for (var p in data) {
        if ({}.hasOwnProperty.call(data, p)) {
            var cur = result;
            var prop = "";
            var m = regex.exec(p);
            while (m) {
                cur = cur[prop] || (cur[prop] = m[2] ? [] : {});
                prop = m[2] || m[1];
                m = regex.exec(p);
            }
            cur[prop] = data[p];
        }
    }
    return result[""] || result;
}
function countDecimals(num) {
    if (Math.floor(num) === num || String(num).indexOf(".") < 0)
        return 0;
    var parts = num.toString().split(".")[1];
    return parts.length || 0;
}

;// ./src/BaseAPI.ts






var global_constants = api_constants.global;
var BaseAPI_scorm12_error_codes = error_codes.scorm12;
function debounce(func, wait, immediate) {
    if (immediate === void 0) { immediate = false; }
    var timeout;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var context = this;
        var later = function () {
            timeout = null;
            if (!immediate)
                func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        if (timeout)
            clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow)
            func.apply(context, args);
    };
}
var DefaultSettings = {
    autocommit: false,
    autocommitSeconds: 10,
    asyncCommit: false,
    sendBeaconCommit: false,
    lmsCommitUrl: false,
    dataCommitFormat: "json",
    commitRequestDataType: "application/json;charset=UTF-8",
    autoProgress: false,
    logLevel: global_constants.LOG_LEVEL_ERROR,
    selfReportSessionTime: false,
    alwaysSendTotalTime: false,
    strict_errors: true,
    xhrHeaders: {},
    xhrWithCredentials: false,
    responseHandler: function (response) {
        return __awaiter(this, void 0, void 0, function () {
            var httpResult, _a, _c;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        if (!(typeof response !== "undefined")) return [3, 2];
                        _c = (_a = JSON).parse;
                        return [4, response.text()];
                    case 1:
                        httpResult = _c.apply(_a, [_e.sent()]);
                        if (httpResult === null ||
                            !{}.hasOwnProperty.call(httpResult, "result")) {
                            if (response.status === 200) {
                                return [2, {
                                        result: global_constants.SCORM_TRUE,
                                        errorCode: 0,
                                    }];
                            }
                            else {
                                return [2, {
                                        result: global_constants.SCORM_FALSE,
                                        errorCode: 101,
                                    }];
                            }
                        }
                        else {
                            return [2, {
                                    result: httpResult.result,
                                    errorCode: httpResult.errorCode
                                        ? httpResult.errorCode
                                        : httpResult.result === global_constants.SCORM_TRUE
                                            ? 0
                                            : 101,
                                }];
                        }
                        _e.label = 2;
                    case 2: return [2, {
                            result: global_constants.SCORM_FALSE,
                            errorCode: 101,
                        }];
                }
            });
        });
    },
    requestHandler: function (commitObject) {
        return commitObject;
    },
    onLogMessage: function (messageLevel, logMessage) {
        switch (messageLevel) {
            case global_constants.LOG_LEVEL_ERROR:
                console.error(logMessage);
                break;
            case global_constants.LOG_LEVEL_WARNING:
                console.warn(logMessage);
                break;
            case global_constants.LOG_LEVEL_INFO:
                console.info(logMessage);
                break;
            case global_constants.LOG_LEVEL_DEBUG:
                if (console.debug) {
                    console.debug(logMessage);
                }
                else {
                    console.log(logMessage);
                }
                break;
        }
    },
};
var BaseAPI = (function () {
    function BaseAPI(error_codes, settings) {
        var _newTarget = this.constructor;
        this._settings = DefaultSettings;
        if (_newTarget === BaseAPI) {
            throw new TypeError("Cannot construct BaseAPI instances directly");
        }
        this.currentState = global_constants.STATE_NOT_INITIALIZED;
        this.lastErrorCode = "0";
        this.listenerArray = [];
        this._error_codes = error_codes;
        if (settings) {
            this.settings = settings;
        }
        this.apiLogLevel = this.settings.logLevel;
        this.selfReportSessionTime = this.settings.selfReportSessionTime;
    }
    BaseAPI.prototype.initialize = function (callbackName, initializeMessage, terminationMessage) {
        var returnValue = global_constants.SCORM_FALSE;
        if (this.isInitialized()) {
            this.throwSCORMError(this._error_codes.INITIALIZED, initializeMessage);
        }
        else if (this.isTerminated()) {
            this.throwSCORMError(this._error_codes.TERMINATED, terminationMessage);
        }
        else {
            if (this.selfReportSessionTime) {
                this.cmi.setStartTime();
            }
            this.currentState = global_constants.STATE_INITIALIZED;
            this.lastErrorCode = "0";
            returnValue = global_constants.SCORM_TRUE;
            this.processListeners(callbackName);
        }
        this.apiLog(callbackName, "returned: " + returnValue, global_constants.LOG_LEVEL_INFO);
        this.clearSCORMError(returnValue);
        return returnValue;
    };
    Object.defineProperty(BaseAPI.prototype, "error_codes", {
        get: function () {
            return this._error_codes;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseAPI.prototype, "settings", {
        get: function () {
            return this._settings;
        },
        set: function (settings) {
            this._settings = __assign(__assign({}, this._settings), settings);
        },
        enumerable: false,
        configurable: true
    });
    BaseAPI.prototype.terminate = function (callbackName, checkTerminated) {
        var returnValue = global_constants.SCORM_FALSE;
        if (this.checkState(checkTerminated, this._error_codes.TERMINATION_BEFORE_INIT, this._error_codes.MULTIPLE_TERMINATION)) {
            this.currentState = global_constants.STATE_TERMINATED;
            var result = this.storeData(true);
            if (typeof result.errorCode !== "undefined" && result.errorCode > 0) {
                this.throwSCORMError(result.errorCode);
            }
            returnValue =
                typeof result !== "undefined" && result.result
                    ? result.result
                    : global_constants.SCORM_FALSE;
            if (checkTerminated)
                this.lastErrorCode = "0";
            returnValue = global_constants.SCORM_TRUE;
            this.processListeners(callbackName);
        }
        this.apiLog(callbackName, "returned: " + returnValue, global_constants.LOG_LEVEL_INFO);
        this.clearSCORMError(returnValue);
        return returnValue;
    };
    BaseAPI.prototype.getValue = function (callbackName, checkTerminated, CMIElement) {
        var returnValue = "";
        if (this.checkState(checkTerminated, this._error_codes.RETRIEVE_BEFORE_INIT, this._error_codes.RETRIEVE_AFTER_TERM)) {
            if (checkTerminated)
                this.lastErrorCode = "0";
            try {
                returnValue = this.getCMIValue(CMIElement);
            }
            catch (e) {
                returnValue = this.handleValueAccessException(e, returnValue);
            }
            this.processListeners(callbackName, CMIElement);
        }
        this.apiLog(callbackName, ": returned: " + returnValue, global_constants.LOG_LEVEL_INFO, CMIElement);
        this.clearSCORMError(returnValue);
        return returnValue;
    };
    BaseAPI.prototype.setValue = function (callbackName, commitCallback, checkTerminated, CMIElement, value) {
        if (value !== undefined) {
            value = String(value);
        }
        var returnValue = global_constants.SCORM_FALSE;
        if (this.checkState(checkTerminated, this._error_codes.STORE_BEFORE_INIT, this._error_codes.STORE_AFTER_TERM)) {
            if (checkTerminated)
                this.lastErrorCode = "0";
            try {
                returnValue = this.setCMIValue(CMIElement, value);
            }
            catch (e) {
                this.handleValueAccessException(e, returnValue);
            }
            this.processListeners(callbackName, CMIElement, value);
        }
        if (returnValue === undefined) {
            returnValue = global_constants.SCORM_FALSE;
        }
        if (String(this.lastErrorCode) === "0") {
            if (this.settings.autocommit && !this._timeout) {
                this.scheduleCommit(this.settings.autocommitSeconds * 1000, commitCallback);
            }
        }
        this.apiLog(callbackName, ": " + value + ": result: " + returnValue, global_constants.LOG_LEVEL_INFO, CMIElement);
        this.clearSCORMError(returnValue);
        return returnValue;
    };
    BaseAPI.prototype.commit = function (callbackName, checkTerminated) {
        if (checkTerminated === void 0) { checkTerminated = false; }
        this.clearScheduledCommit();
        var returnValue = global_constants.SCORM_FALSE;
        if (this.checkState(checkTerminated, this._error_codes.COMMIT_BEFORE_INIT, this._error_codes.COMMIT_AFTER_TERM)) {
            var result = this.storeData(false);
            if (result.errorCode && result.errorCode > 0) {
                this.throwSCORMError(result.errorCode);
            }
            returnValue =
                typeof result !== "undefined" && result.result
                    ? result.result
                    : global_constants.SCORM_FALSE;
            this.apiLog(callbackName, " Result: " + returnValue, global_constants.LOG_LEVEL_DEBUG, "HttpRequest");
            if (checkTerminated)
                this.lastErrorCode = "0";
            this.processListeners(callbackName);
        }
        this.apiLog(callbackName, "returned: " + returnValue, global_constants.LOG_LEVEL_INFO);
        this.clearSCORMError(returnValue);
        return returnValue;
    };
    BaseAPI.prototype.getLastError = function (callbackName) {
        var returnValue = String(this.lastErrorCode);
        this.processListeners(callbackName);
        this.apiLog(callbackName, "returned: " + returnValue, global_constants.LOG_LEVEL_INFO);
        return returnValue;
    };
    BaseAPI.prototype.getErrorString = function (callbackName, CMIErrorCode) {
        var returnValue = "";
        if (CMIErrorCode !== null && CMIErrorCode !== "") {
            returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
            this.processListeners(callbackName);
        }
        this.apiLog(callbackName, "returned: " + returnValue, global_constants.LOG_LEVEL_INFO);
        return returnValue;
    };
    BaseAPI.prototype.getDiagnostic = function (callbackName, CMIErrorCode) {
        var returnValue = "";
        if (CMIErrorCode !== null && CMIErrorCode !== "") {
            returnValue = this.getLmsErrorMessageDetails(CMIErrorCode, true);
            this.processListeners(callbackName);
        }
        this.apiLog(callbackName, "returned: " + returnValue, global_constants.LOG_LEVEL_INFO);
        return returnValue;
    };
    BaseAPI.prototype.checkState = function (checkTerminated, beforeInitError, afterTermError) {
        if (this.isNotInitialized()) {
            this.throwSCORMError(beforeInitError);
            return false;
        }
        else if (checkTerminated && this.isTerminated()) {
            this.throwSCORMError(afterTermError);
            return false;
        }
        return true;
    };
    BaseAPI.prototype.apiLog = function (functionName, logMessage, messageLevel, CMIElement) {
        logMessage = this.formatMessage(functionName, logMessage, CMIElement);
        if (messageLevel >= this.apiLogLevel) {
            this.settings.onLogMessage(messageLevel, logMessage);
        }
    };
    BaseAPI.prototype.formatMessage = function (functionName, message, CMIElement) {
        var baseLength = 20;
        var messageString = "";
        messageString += functionName;
        var fillChars = baseLength - messageString.length;
        for (var i = 0; i < fillChars; i++) {
            messageString += " ";
        }
        messageString += ": ";
        if (CMIElement) {
            var CMIElementBaseLength = 70;
            messageString += CMIElement;
            fillChars = CMIElementBaseLength - messageString.length;
            for (var j = 0; j < fillChars; j++) {
                messageString += " ";
            }
        }
        if (message) {
            messageString += message;
        }
        return messageString;
    };
    BaseAPI.prototype.stringMatches = function (str, tester) {
        return (str === null || str === void 0 ? void 0 : str.match(tester)) !== null;
    };
    BaseAPI.prototype._checkObjectHasProperty = function (refObject, attribute) {
        return (Object.hasOwnProperty.call(refObject, attribute) ||
            Object.getOwnPropertyDescriptor(Object.getPrototypeOf(refObject), attribute) != null ||
            attribute in refObject);
    };
    BaseAPI.prototype.getLmsErrorMessageDetails = function (_errorNumber, _detail) {
        if (_detail === void 0) { _detail = false; }
        throw new Error("The getLmsErrorMessageDetails method has not been implemented");
    };
    BaseAPI.prototype.getCMIValue = function (_CMIElement) {
        throw new Error("The getCMIValue method has not been implemented");
    };
    BaseAPI.prototype.setCMIValue = function (_CMIElement, _value) {
        throw new Error("The setCMIValue method has not been implemented");
    };
    BaseAPI.prototype._commonSetCMIValue = function (methodName, scorm2004, CMIElement, value) {
        if (!CMIElement || CMIElement === "") {
            return global_constants.SCORM_FALSE;
        }
        var structure = CMIElement.split(".");
        var refObject = this;
        var returnValue = global_constants.SCORM_FALSE;
        var foundFirstIndex = false;
        var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
        var invalidErrorCode = scorm2004
            ? this._error_codes.UNDEFINED_DATA_MODEL
            : this._error_codes.GENERAL;
        for (var idx = 0; idx < structure.length; idx++) {
            var attribute = structure[idx];
            if (idx === structure.length - 1) {
                if (scorm2004 &&
                    attribute.substring(0, 8) === "{target=" &&
                    typeof refObject._isTargetValid == "function") {
                    this.throwSCORMError(this._error_codes.READ_ONLY_ELEMENT);
                }
                else if (!this._checkObjectHasProperty(refObject, attribute)) {
                    this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                }
                else {
                    if (this.isInitialized() &&
                        this.stringMatches(CMIElement, "\\.correct_responses\\.\\d+")) {
                        this.validateCorrectResponse(CMIElement, value);
                    }
                    if (!scorm2004 || this.lastErrorCode === "0") {
                        refObject[attribute] = value;
                        returnValue = global_constants.SCORM_TRUE;
                    }
                }
            }
            else {
                refObject = refObject[attribute];
                if (!refObject) {
                    this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                    break;
                }
                if (refObject instanceof CMIArray) {
                    var index = parseInt(structure[idx + 1], 10);
                    if (!isNaN(index)) {
                        var item = refObject.childArray[index];
                        if (item) {
                            refObject = item;
                            foundFirstIndex = true;
                        }
                        else {
                            var newChild = this.getChildElement(CMIElement, value, foundFirstIndex);
                            foundFirstIndex = true;
                            if (!newChild) {
                                this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                            }
                            else {
                                if (refObject.initialized)
                                    newChild.initialize();
                                refObject.childArray.push(newChild);
                                refObject = newChild;
                            }
                        }
                        idx++;
                    }
                }
            }
        }
        if (returnValue === global_constants.SCORM_FALSE) {
            this.apiLog(methodName, "There was an error setting the value for: ".concat(CMIElement, ", value of: ").concat(value), global_constants.LOG_LEVEL_WARNING);
        }
        return returnValue;
    };
    BaseAPI.prototype._commonGetCMIValue = function (methodName, scorm2004, CMIElement) {
        if (!CMIElement || CMIElement === "") {
            return "";
        }
        var structure = CMIElement.split(".");
        var refObject = this;
        var attribute = null;
        var uninitializedErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") has not been initialized.");
        var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
        var invalidErrorCode = scorm2004
            ? this._error_codes.UNDEFINED_DATA_MODEL
            : this._error_codes.GENERAL;
        for (var idx = 0; idx < structure.length; idx++) {
            attribute = structure[idx];
            if (!scorm2004) {
                if (idx === structure.length - 1) {
                    if (!this._checkObjectHasProperty(refObject, attribute)) {
                        this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                        return;
                    }
                }
            }
            else {
                if (String(attribute).substring(0, 8) === "{target=" &&
                    typeof refObject._isTargetValid == "function") {
                    var target = String(attribute).substring(8, String(attribute).length - 9);
                    return refObject._isTargetValid(target);
                }
                else if (!this._checkObjectHasProperty(refObject, attribute)) {
                    this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                    return;
                }
            }
            refObject = refObject[attribute];
            if (refObject === undefined) {
                this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                break;
            }
            if (refObject instanceof CMIArray) {
                var index = parseInt(structure[idx + 1], 10);
                if (!isNaN(index)) {
                    var item = refObject.childArray[index];
                    if (item) {
                        refObject = item;
                    }
                    else {
                        this.throwSCORMError(this._error_codes.VALUE_NOT_INITIALIZED, uninitializedErrorMessage);
                        break;
                    }
                    idx++;
                }
            }
        }
        if (refObject === null || refObject === undefined) {
            if (!scorm2004) {
                if (attribute === "_children") {
                    this.throwSCORMError(BaseAPI_scorm12_error_codes.CHILDREN_ERROR);
                }
                else if (attribute === "_count") {
                    this.throwSCORMError(BaseAPI_scorm12_error_codes.COUNT_ERROR);
                }
            }
        }
        else {
            return refObject;
        }
    };
    BaseAPI.prototype.isInitialized = function () {
        return this.currentState === global_constants.STATE_INITIALIZED;
    };
    BaseAPI.prototype.isNotInitialized = function () {
        return this.currentState === global_constants.STATE_NOT_INITIALIZED;
    };
    BaseAPI.prototype.isTerminated = function () {
        return this.currentState === global_constants.STATE_TERMINATED;
    };
    BaseAPI.prototype.on = function (listenerName, callback) {
        if (!callback)
            return;
        var listenerFunctions = listenerName.split(" ");
        for (var i = 0; i < listenerFunctions.length; i++) {
            var listenerSplit = listenerFunctions[i].split(".");
            if (listenerSplit.length === 0)
                return;
            var functionName = listenerSplit[0];
            var CMIElement = null;
            if (listenerSplit.length > 1) {
                CMIElement = listenerName.replace(functionName + ".", "");
            }
            this.listenerArray.push({
                functionName: functionName,
                CMIElement: CMIElement,
                callback: callback,
            });
            this.apiLog("on", "Added event listener: ".concat(this.listenerArray.length), global_constants.LOG_LEVEL_INFO, functionName);
        }
    };
    BaseAPI.prototype.off = function (listenerName, callback) {
        if (!callback)
            return;
        var listenerFunctions = listenerName.split(" ");
        var _loop_1 = function (i) {
            var listenerSplit = listenerFunctions[i].split(".");
            if (listenerSplit.length === 0)
                return { value: void 0 };
            var functionName = listenerSplit[0];
            var CMIElement = null;
            if (listenerSplit.length > 1) {
                CMIElement = listenerName.replace(functionName + ".", "");
            }
            var removeIndex = this_1.listenerArray.findIndex(function (obj) {
                return obj.functionName === functionName &&
                    obj.CMIElement === CMIElement &&
                    obj.callback === callback;
            });
            if (removeIndex !== -1) {
                this_1.listenerArray.splice(removeIndex, 1);
                this_1.apiLog("off", "Removed event listener: ".concat(this_1.listenerArray.length), global_constants.LOG_LEVEL_INFO, functionName);
            }
        };
        var this_1 = this;
        for (var i = 0; i < listenerFunctions.length; i++) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
    };
    BaseAPI.prototype.clear = function (listenerName) {
        var listenerFunctions = listenerName.split(" ");
        var _loop_2 = function (i) {
            var listenerSplit = listenerFunctions[i].split(".");
            if (listenerSplit.length === 0)
                return { value: void 0 };
            var functionName = listenerSplit[0];
            var CMIElement = null;
            if (listenerSplit.length > 1) {
                CMIElement = listenerName.replace(functionName + ".", "");
            }
            this_2.listenerArray = this_2.listenerArray.filter(function (obj) {
                return obj.functionName !== functionName && obj.CMIElement !== CMIElement;
            });
        };
        var this_2 = this;
        for (var i = 0; i < listenerFunctions.length; i++) {
            var state_2 = _loop_2(i);
            if (typeof state_2 === "object")
                return state_2.value;
        }
    };
    BaseAPI.prototype.processListeners = function (functionName, CMIElement, value) {
        this.apiLog(functionName, value, global_constants.LOG_LEVEL_INFO, CMIElement);
        for (var i = 0; i < this.listenerArray.length; i++) {
            var listener = this.listenerArray[i];
            var functionsMatch = listener.functionName === functionName;
            var listenerHasCMIElement = !!listener.CMIElement;
            var CMIElementsMatch = false;
            if (CMIElement &&
                listener.CMIElement &&
                listener.CMIElement.substring(listener.CMIElement.length - 1) === "*") {
                CMIElementsMatch =
                    CMIElement.indexOf(listener.CMIElement.substring(0, listener.CMIElement.length - 1)) === 0;
            }
            else {
                CMIElementsMatch = listener.CMIElement === CMIElement;
            }
            if (functionsMatch && (!listenerHasCMIElement || CMIElementsMatch)) {
                this.apiLog("processListeners", "Processing listener: ".concat(listener.functionName), global_constants.LOG_LEVEL_INFO, CMIElement);
                listener.callback(CMIElement, value);
            }
        }
    };
    BaseAPI.prototype.throwSCORMError = function (errorNumber, message) {
        if (!message) {
            message = this.getLmsErrorMessageDetails(errorNumber);
        }
        this.apiLog("throwSCORMError", errorNumber + ": " + message, global_constants.LOG_LEVEL_ERROR);
        this.lastErrorCode = String(errorNumber);
    };
    BaseAPI.prototype.clearSCORMError = function (success) {
        if (success !== undefined && success !== global_constants.SCORM_FALSE) {
            this.lastErrorCode = "0";
        }
    };
    BaseAPI.prototype.loadFromFlattenedJSON = function (json, CMIElement) {
        var _this = this;
        if (!this.isNotInitialized()) {
            console.error("loadFromFlattenedJSON can only be called before the call to lmsInitialize.");
            return;
        }
        function testPattern(a, c, a_pattern) {
            var a_match = a.match(a_pattern);
            var c_match;
            if (a_match !== null && (c_match = c.match(a_pattern)) !== null) {
                var a_num = Number(a_match[2]);
                var c_num = Number(c_match[2]);
                if (a_num === c_num) {
                    if (a_match[3] === "id") {
                        return -1;
                    }
                    else if (a_match[3] === "type") {
                        if (c_match[3] === "id") {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    }
                    else {
                        return 1;
                    }
                }
                return a_num - c_num;
            }
            return null;
        }
        var int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
        var obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;
        var result = Object.keys(json).map(function (key) {
            return [String(key), json[key]];
        });
        result.sort(function (_a, _c) {
            var a = _a[0], _b = _a[1];
            var c = _c[0], _d = _c[1];
            var test;
            if ((test = testPattern(a, c, int_pattern)) !== null) {
                return test;
            }
            if ((test = testPattern(a, c, obj_pattern)) !== null) {
                return test;
            }
            if (a < c) {
                return -1;
            }
            if (a > c) {
                return 1;
            }
            return 0;
        });
        var obj;
        result.forEach(function (element) {
            obj = {};
            obj[element[0]] = element[1];
            _this.loadFromJSON(unflatten(obj), CMIElement);
        });
    };
    BaseAPI.prototype.loadFromJSON = function (json, CMIElement) {
        if (!this.isNotInitialized()) {
            console.error("loadFromJSON can only be called before the call to lmsInitialize.");
            return;
        }
        CMIElement = CMIElement !== undefined ? CMIElement : "cmi";
        this.startingData = json;
        for (var key in json) {
            if ({}.hasOwnProperty.call(json, key) && json[key]) {
                var currentCMIElement = (CMIElement ? CMIElement + "." : "") + key;
                var value = json[key];
                if (value["childArray"]) {
                    for (var i = 0; i < value["childArray"].length; i++) {
                        this.loadFromJSON(value["childArray"][i], currentCMIElement + "." + i);
                    }
                }
                else if (value.constructor === Object) {
                    this.loadFromJSON(value, currentCMIElement);
                }
                else {
                    this.setCMIValue(currentCMIElement, value);
                }
            }
        }
    };
    BaseAPI.prototype.renderCMIToJSONString = function () {
        var cmi = this.cmi;
        return JSON.stringify({ cmi: cmi });
    };
    BaseAPI.prototype.renderCMIToJSONObject = function () {
        return JSON.parse(this.renderCMIToJSONString());
    };
    BaseAPI.prototype.processHttpRequest = function (url, params, immediate) {
        var _this = this;
        if (immediate === void 0) { immediate = false; }
        var api = this;
        var genericError = {
            result: global_constants.SCORM_FALSE,
            errorCode: this.error_codes.GENERAL,
        };
        var process = function (url, params, settings) { return __awaiter(_this, void 0, void 0, function () {
            var response, result, _a, e_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 6, , 7]);
                        params = settings.requestHandler(params);
                        return [4, fetch(url, {
                                method: "POST",
                                body: params instanceof Array ? params.join("&") : JSON.stringify(params),
                                headers: __assign(__assign({}, settings.xhrHeaders), { "Content-Type": settings.commitRequestDataType }),
                                credentials: settings.xhrWithCredentials ? "include" : undefined,
                                keepalive: true,
                            })];
                    case 1:
                        response = _c.sent();
                        if (!(typeof settings.responseHandler === "function")) return [3, 3];
                        return [4, settings.responseHandler(response)];
                    case 2:
                        _a = _c.sent();
                        return [3, 5];
                    case 3: return [4, response.json()];
                    case 4:
                        _a = _c.sent();
                        _c.label = 5;
                    case 5:
                        result = _a;
                        if (response.status >= 200 &&
                            response.status <= 299 &&
                            (result.result === true ||
                                result.result === global_constants.SCORM_TRUE)) {
                            api.processListeners("CommitSuccess");
                        }
                        else {
                            api.processListeners("CommitError");
                        }
                        return [2, result];
                    case 6:
                        e_1 = _c.sent();
                        this.apiLog("processHttpRequest", e_1, global_constants.LOG_LEVEL_ERROR);
                        api.processListeners("CommitError");
                        return [2, genericError];
                    case 7: return [2];
                }
            });
        }); };
        var debouncedProcess = debounce(process, 500, immediate);
        debouncedProcess(url, params, this.settings);
        return {
            result: global_constants.SCORM_TRUE,
            errorCode: 0,
        };
    };
    BaseAPI.prototype.scheduleCommit = function (when, callback) {
        this._timeout = new ScheduledCommit(this, when, callback);
        this.apiLog("scheduleCommit", "scheduled", global_constants.LOG_LEVEL_DEBUG, "");
    };
    BaseAPI.prototype.clearScheduledCommit = function () {
        if (this._timeout) {
            this._timeout.cancel();
            this._timeout = undefined;
            this.apiLog("clearScheduledCommit", "cleared", global_constants.LOG_LEVEL_DEBUG, "");
        }
    };
    BaseAPI.prototype.handleValueAccessException = function (e, returnValue) {
        if (e instanceof ValidationError) {
            this.lastErrorCode = String(e.errorCode);
            returnValue = global_constants.SCORM_FALSE;
        }
        else {
            if (e instanceof Error && e.message) {
                console.error(e.message);
            }
            else {
                console.error(e);
            }
            this.throwSCORMError(this._error_codes.GENERAL);
        }
        return returnValue;
    };
    return BaseAPI;
}());
/* harmony default export */ var src_BaseAPI = (BaseAPI);
var ScheduledCommit = (function () {
    function ScheduledCommit(API, when, callback) {
        this._cancelled = false;
        this._API = API;
        this._timeout = setTimeout(this.wrapper.bind(this), when);
        this._callback = callback;
    }
    ScheduledCommit.prototype.cancel = function () {
        this._cancelled = true;
        if (this._timeout) {
            clearTimeout(this._timeout);
        }
    };
    ScheduledCommit.prototype.wrapper = function () {
        if (!this._cancelled) {
            this._API.commit(this._callback);
        }
    };
    return ScheduledCommit;
}());

;// ./src/cmi/scorm12_cmi.ts







var scorm12_cmi_scorm12_constants = api_constants.scorm12;
var scorm12_cmi_scorm12_regex = regex.scorm12;
var scorm12_cmi_scorm12_error_codes = error_codes.scorm12;
function check12ValidFormat(value, regexPattern, allowEmptyString) {
    return checkValidFormat(value, regexPattern, scorm12_cmi_scorm12_error_codes.TYPE_MISMATCH, Scorm12ValidationError, allowEmptyString);
}
function check12ValidRange(value, rangePattern, allowEmptyString) {
    if (!allowEmptyString && value === "") {
        throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.VALUE_OUT_OF_RANGE);
    }
    return checkValidRange(value, rangePattern, scorm12_cmi_scorm12_error_codes.VALUE_OUT_OF_RANGE, Scorm12ValidationError);
}
var CMI = (function (_super) {
    __extends(CMI, _super);
    function CMI(cmi_children, student_data, initialized) {
        var _this = _super.call(this) || this;
        _this.__children = "";
        _this.__version = "3.4";
        _this._launch_data = "";
        _this._comments = "";
        _this._comments_from_lms = "";
        if (initialized)
            _this.initialize();
        _this.__children = cmi_children
            ? cmi_children
            : scorm12_cmi_scorm12_constants.cmi_children;
        _this.core = new CMICore();
        _this.objectives = new CMIObjectives();
        _this.student_data = student_data ? student_data : new CMIStudentData();
        _this.student_preference = new CMIStudentPreference();
        _this.interactions = new CMIInteractions();
        return _this;
    }
    CMI.prototype.initialize = function () {
        var _a, _b, _c, _d, _e;
        _super.prototype.initialize.call(this);
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.initialize();
        (_b = this.objectives) === null || _b === void 0 ? void 0 : _b.initialize();
        (_c = this.student_data) === null || _c === void 0 ? void 0 : _c.initialize();
        (_d = this.student_preference) === null || _d === void 0 ? void 0 : _d.initialize();
        (_e = this.interactions) === null || _e === void 0 ? void 0 : _e.initialize();
    };
    CMI.prototype.toJSON = function () {
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
            interactions: this.interactions,
        };
        delete this.jsonString;
        return result;
    };
    Object.defineProperty(CMI.prototype, "_version", {
        get: function () {
            return this.__version;
        },
        set: function (_version) {
            throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "suspend_data", {
        get: function () {
            var _a;
            return (_a = this.core) === null || _a === void 0 ? void 0 : _a.suspend_data;
        },
        set: function (suspend_data) {
            if (this.core) {
                this.core.suspend_data = suspend_data;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "launch_data", {
        get: function () {
            return this._launch_data;
        },
        set: function (launch_data) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._launch_data = launch_data;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "comments", {
        get: function () {
            return this._comments;
        },
        set: function (comments) {
            if (check12ValidFormat(comments, scorm12_cmi_scorm12_regex.CMIString4096, true)) {
                this._comments = comments;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "comments_from_lms", {
        get: function () {
            return this._comments_from_lms;
        },
        set: function (comments_from_lms) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._comments_from_lms = comments_from_lms;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMI.prototype.getCurrentTotalTime = function () {
        return this.core.getCurrentTotalTime(this.start_time);
    };
    return CMI;
}(BaseRootCMI));

var CMICore = (function (_super) {
    __extends(CMICore, _super);
    function CMICore() {
        var _this = _super.call(this) || this;
        _this.__children = scorm12_cmi_scorm12_constants.core_children;
        _this._student_id = "";
        _this._student_name = "";
        _this._lesson_location = "";
        _this._credit = "";
        _this._lesson_status = "not attempted";
        _this._entry = "";
        _this._total_time = "";
        _this._lesson_mode = "normal";
        _this._exit = "";
        _this._session_time = "00:00:00";
        _this._suspend_data = "";
        _this.score = new CMIScore({
            score_children: scorm12_cmi_scorm12_constants.score_children,
            score_range: scorm12_cmi_scorm12_regex.score_range,
            invalidErrorCode: scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE,
            invalidTypeCode: scorm12_cmi_scorm12_error_codes.TYPE_MISMATCH,
            invalidRangeCode: scorm12_cmi_scorm12_error_codes.VALUE_OUT_OF_RANGE,
            errorClass: Scorm12ValidationError,
        });
        return _this;
    }
    CMICore.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        (_a = this.score) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    Object.defineProperty(CMICore.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "student_id", {
        get: function () {
            return this._student_id;
        },
        set: function (student_id) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._student_id = student_id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "student_name", {
        get: function () {
            return this._student_name;
        },
        set: function (student_name) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._student_name = student_name;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "lesson_location", {
        get: function () {
            return this._lesson_location;
        },
        set: function (lesson_location) {
            if (check12ValidFormat(lesson_location, scorm12_cmi_scorm12_regex.CMIString256, true)) {
                this._lesson_location = lesson_location;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "credit", {
        get: function () {
            return this._credit;
        },
        set: function (credit) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._credit = credit;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "lesson_status", {
        get: function () {
            return this._lesson_status;
        },
        set: function (lesson_status) {
            if (this.initialized) {
                if (check12ValidFormat(lesson_status, scorm12_cmi_scorm12_regex.CMIStatus)) {
                    this._lesson_status = lesson_status;
                }
            }
            else {
                if (check12ValidFormat(lesson_status, scorm12_cmi_scorm12_regex.CMIStatus2)) {
                    this._lesson_status = lesson_status;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "entry", {
        get: function () {
            return this._entry;
        },
        set: function (entry) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._entry = entry;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "total_time", {
        get: function () {
            return this._total_time;
        },
        set: function (total_time) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._total_time = total_time;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "lesson_mode", {
        get: function () {
            return this._lesson_mode;
        },
        set: function (lesson_mode) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._lesson_mode = lesson_mode;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "exit", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._exit;
        },
        set: function (exit) {
            if (check12ValidFormat(exit, scorm12_cmi_scorm12_regex.CMIExit, true)) {
                this._exit = exit;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "session_time", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._session_time;
        },
        set: function (session_time) {
            if (check12ValidFormat(session_time, scorm12_cmi_scorm12_regex.CMITimespan)) {
                this._session_time = session_time;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "suspend_data", {
        get: function () {
            return this._suspend_data;
        },
        set: function (suspend_data) {
            if (check12ValidFormat(suspend_data, scorm12_cmi_scorm12_regex.CMIString4096, true)) {
                this._suspend_data = suspend_data;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMICore.prototype.getCurrentTotalTime = function (start_time) {
        var sessionTime = this._session_time;
        var startTime = start_time;
        if (typeof startTime !== "undefined" && startTime !== null) {
            var seconds = new Date().getTime() - startTime;
            sessionTime = getSecondsAsHHMMSS(seconds / 1000);
        }
        return addHHMMSSTimeStrings(this._total_time, sessionTime, new RegExp(scorm12_cmi_scorm12_regex.CMITimespan));
    };
    CMICore.prototype.toJSON = function () {
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
            score: this.score,
        };
        delete this.jsonString;
        return result;
    };
    return CMICore;
}(BaseCMI));

var CMIObjectives = (function (_super) {
    __extends(CMIObjectives, _super);
    function CMIObjectives() {
        return _super.call(this, {
            children: scorm12_cmi_scorm12_constants.objectives_children,
            errorCode: scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE,
            errorClass: Scorm12ValidationError,
        }) || this;
    }
    return CMIObjectives;
}(CMIArray));

var CMIStudentData = (function (_super) {
    __extends(CMIStudentData, _super);
    function CMIStudentData(student_data_children) {
        var _this = _super.call(this) || this;
        _this._mastery_score = "";
        _this._max_time_allowed = "";
        _this._time_limit_action = "";
        _this.__children = student_data_children
            ? student_data_children
            : scorm12_cmi_scorm12_constants.student_data_children;
        return _this;
    }
    Object.defineProperty(CMIStudentData.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentData.prototype, "mastery_score", {
        get: function () {
            return this._mastery_score;
        },
        set: function (mastery_score) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._mastery_score = mastery_score;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentData.prototype, "max_time_allowed", {
        get: function () {
            return this._max_time_allowed;
        },
        set: function (max_time_allowed) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._max_time_allowed = max_time_allowed;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentData.prototype, "time_limit_action", {
        get: function () {
            return this._time_limit_action;
        },
        set: function (time_limit_action) {
            if (this.initialized) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.READ_ONLY_ELEMENT);
            }
            else {
                this._time_limit_action = time_limit_action;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIStudentData.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            mastery_score: this.mastery_score,
            max_time_allowed: this.max_time_allowed,
            time_limit_action: this.time_limit_action,
        };
        delete this.jsonString;
        return result;
    };
    return CMIStudentData;
}(BaseCMI));

var CMIStudentPreference = (function (_super) {
    __extends(CMIStudentPreference, _super);
    function CMIStudentPreference(student_preference_children) {
        var _this = _super.call(this) || this;
        _this._audio = "";
        _this._language = "";
        _this._speed = "";
        _this._text = "";
        _this.__children = student_preference_children
            ? student_preference_children
            : scorm12_cmi_scorm12_constants.student_preference_children;
        return _this;
    }
    Object.defineProperty(CMIStudentPreference.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentPreference.prototype, "audio", {
        get: function () {
            return this._audio;
        },
        set: function (audio) {
            if (check12ValidFormat(audio, scorm12_cmi_scorm12_regex.CMISInteger) &&
                check12ValidRange(audio, scorm12_cmi_scorm12_regex.audio_range)) {
                this._audio = audio;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentPreference.prototype, "language", {
        get: function () {
            return this._language;
        },
        set: function (language) {
            if (check12ValidFormat(language, scorm12_cmi_scorm12_regex.CMIString256)) {
                this._language = language;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentPreference.prototype, "speed", {
        get: function () {
            return this._speed;
        },
        set: function (speed) {
            if (check12ValidFormat(speed, scorm12_cmi_scorm12_regex.CMISInteger) &&
                check12ValidRange(speed, scorm12_cmi_scorm12_regex.speed_range)) {
                this._speed = speed;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentPreference.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (text) {
            if (check12ValidFormat(text, scorm12_cmi_scorm12_regex.CMISInteger) &&
                check12ValidRange(text, scorm12_cmi_scorm12_regex.text_range)) {
                this._text = text;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIStudentPreference.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            audio: this.audio,
            language: this.language,
            speed: this.speed,
            text: this.text,
        };
        delete this.jsonString;
        return result;
    };
    return CMIStudentPreference;
}(BaseCMI));

var CMIInteractions = (function (_super) {
    __extends(CMIInteractions, _super);
    function CMIInteractions() {
        return _super.call(this, {
            children: scorm12_cmi_scorm12_constants.interactions_children,
            errorCode: scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE,
            errorClass: Scorm12ValidationError,
        }) || this;
    }
    return CMIInteractions;
}(CMIArray));

var CMIInteractionsObject = (function (_super) {
    __extends(CMIInteractionsObject, _super);
    function CMIInteractionsObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        _this._time = "";
        _this._type = "";
        _this._weighting = "";
        _this._student_response = "";
        _this._result = "";
        _this._latency = "";
        _this.objectives = new CMIArray({
            errorCode: scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE,
            errorClass: Scorm12ValidationError,
            children: scorm12_cmi_scorm12_constants.objectives_children,
        });
        _this.correct_responses = new CMIArray({
            errorCode: scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE,
            errorClass: Scorm12ValidationError,
            children: scorm12_cmi_scorm12_constants.correct_responses_children,
        });
        return _this;
    }
    CMIInteractionsObject.prototype.initialize = function () {
        var _a, _b;
        _super.prototype.initialize.call(this);
        (_a = this.objectives) === null || _a === void 0 ? void 0 : _a.initialize();
        (_b = this.correct_responses) === null || _b === void 0 ? void 0 : _b.initialize();
    };
    Object.defineProperty(CMIInteractionsObject.prototype, "id", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._id;
        },
        set: function (id) {
            if (check12ValidFormat(id, scorm12_cmi_scorm12_regex.CMIIdentifier)) {
                this._id = id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "time", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._time;
        },
        set: function (time) {
            if (check12ValidFormat(time, scorm12_cmi_scorm12_regex.CMITime)) {
                this._time = time;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "type", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._type;
        },
        set: function (type) {
            if (check12ValidFormat(type, scorm12_cmi_scorm12_regex.CMIType)) {
                this._type = type;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "weighting", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._weighting;
        },
        set: function (weighting) {
            if (check12ValidFormat(weighting, scorm12_cmi_scorm12_regex.CMIDecimal) &&
                check12ValidRange(weighting, scorm12_cmi_scorm12_regex.weighting_range)) {
                this._weighting = weighting;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "student_response", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._student_response;
        },
        set: function (student_response) {
            if (check12ValidFormat(student_response, scorm12_cmi_scorm12_regex.CMIFeedback, true)) {
                this._student_response = student_response;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "result", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._result;
        },
        set: function (result) {
            if (check12ValidFormat(result, scorm12_cmi_scorm12_regex.CMIResult)) {
                this._result = result;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "latency", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._latency;
        },
        set: function (latency) {
            if (check12ValidFormat(latency, scorm12_cmi_scorm12_regex.CMITimespan)) {
                this._latency = latency;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIInteractionsObject.prototype.toJSON = function () {
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
            correct_responses: this.correct_responses,
        };
        delete this.jsonString;
        return result;
    };
    return CMIInteractionsObject;
}(BaseCMI));

var CMIObjectivesObject = (function (_super) {
    __extends(CMIObjectivesObject, _super);
    function CMIObjectivesObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        _this._status = "";
        _this.score = new CMIScore({
            score_children: scorm12_cmi_scorm12_constants.score_children,
            score_range: scorm12_cmi_scorm12_regex.score_range,
            invalidErrorCode: scorm12_cmi_scorm12_error_codes.INVALID_SET_VALUE,
            invalidTypeCode: scorm12_cmi_scorm12_error_codes.TYPE_MISMATCH,
            invalidRangeCode: scorm12_cmi_scorm12_error_codes.VALUE_OUT_OF_RANGE,
            errorClass: Scorm12ValidationError,
        });
        return _this;
    }
    Object.defineProperty(CMIObjectivesObject.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            if (check12ValidFormat(id, scorm12_cmi_scorm12_regex.CMIIdentifier)) {
                this._id = id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIObjectivesObject.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            if (check12ValidFormat(status, scorm12_cmi_scorm12_regex.CMIStatus2)) {
                this._status = status;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIObjectivesObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            id: this.id,
            status: this.status,
            score: this.score,
        };
        delete this.jsonString;
        return result;
    };
    return CMIObjectivesObject;
}(BaseCMI));

var CMIInteractionsObjectivesObject = (function (_super) {
    __extends(CMIInteractionsObjectivesObject, _super);
    function CMIInteractionsObjectivesObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        return _this;
    }
    Object.defineProperty(CMIInteractionsObjectivesObject.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            if (check12ValidFormat(id, scorm12_cmi_scorm12_regex.CMIIdentifier)) {
                this._id = id;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIInteractionsObjectivesObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            id: this.id,
        };
        delete this.jsonString;
        return result;
    };
    return CMIInteractionsObjectivesObject;
}(BaseCMI));

var CMIInteractionsCorrectResponsesObject = (function (_super) {
    __extends(CMIInteractionsCorrectResponsesObject, _super);
    function CMIInteractionsCorrectResponsesObject() {
        var _this = _super.call(this) || this;
        _this._pattern = "";
        return _this;
    }
    Object.defineProperty(CMIInteractionsCorrectResponsesObject.prototype, "pattern", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm12ValidationError(scorm12_cmi_scorm12_error_codes.WRITE_ONLY_ELEMENT);
            }
            return this._pattern;
        },
        set: function (pattern) {
            if (check12ValidFormat(pattern, scorm12_cmi_scorm12_regex.CMIFeedback, true)) {
                this._pattern = pattern;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIInteractionsCorrectResponsesObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            pattern: this._pattern,
        };
        delete this.jsonString;
        return result;
    };
    return CMIInteractionsCorrectResponsesObject;
}(BaseCMI));

var NAV = (function (_super) {
    __extends(NAV, _super);
    function NAV() {
        var _this = _super.call(this) || this;
        _this._event = "";
        return _this;
    }
    Object.defineProperty(NAV.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (event) {
            if (check12ValidFormat(event, scorm12_cmi_scorm12_regex.NAVEvent)) {
                this._event = event;
            }
        },
        enumerable: false,
        configurable: true
    });
    NAV.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            event: this.event,
        };
        delete this.jsonString;
        return result;
    };
    return NAV;
}(BaseCMI));


;// ./src/Scorm12API.ts






var Scorm12API_scorm12_constants = api_constants.scorm12;
var Scorm12API_global_constants = api_constants.global;
var Scorm12API_scorm12_error_codes = error_codes.scorm12;
var Scorm12API = (function (_super) {
    __extends(Scorm12API, _super);
    function Scorm12API(settings) {
        var _this = this;
        if (settings) {
            if (settings.mastery_override === undefined) {
                settings.mastery_override = false;
            }
        }
        _this = _super.call(this, Scorm12API_scorm12_error_codes, settings) || this;
        _this.cmi = new CMI();
        _this.nav = new NAV();
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
    Scorm12API.prototype.lmsInitialize = function () {
        this.cmi.initialize();
        return this.initialize("LMSInitialize", "LMS was already initialized!", "LMS is already finished!");
    };
    Scorm12API.prototype.lmsFinish = function () {
        var result = this.terminate("LMSFinish", true);
        if (result === Scorm12API_global_constants.SCORM_TRUE) {
            if (this.nav.event !== "") {
                if (this.nav.event === "continue") {
                    this.processListeners("SequenceNext");
                }
                else {
                    this.processListeners("SequencePrevious");
                }
            }
            else if (this.settings.autoProgress) {
                this.processListeners("SequenceNext");
            }
        }
        return result;
    };
    Scorm12API.prototype.lmsGetValue = function (CMIElement) {
        return this.getValue("LMSGetValue", false, CMIElement);
    };
    Scorm12API.prototype.lmsSetValue = function (CMIElement, value) {
        return this.setValue("LMSSetValue", "LMSCommit", false, CMIElement, value);
    };
    Scorm12API.prototype.lmsCommit = function () {
        return this.commit("LMSCommit", false);
    };
    Scorm12API.prototype.lmsGetLastError = function () {
        return this.getLastError("LMSGetLastError");
    };
    Scorm12API.prototype.lmsGetErrorString = function (CMIErrorCode) {
        return this.getErrorString("LMSGetErrorString", CMIErrorCode);
    };
    Scorm12API.prototype.lmsGetDiagnostic = function (CMIErrorCode) {
        return this.getDiagnostic("LMSGetDiagnostic", CMIErrorCode);
    };
    Scorm12API.prototype.setCMIValue = function (CMIElement, value) {
        return this._commonSetCMIValue("LMSSetValue", false, CMIElement, value);
    };
    Scorm12API.prototype.getCMIValue = function (CMIElement) {
        return this._commonGetCMIValue("getCMIValue", false, CMIElement);
    };
    Scorm12API.prototype.getChildElement = function (CMIElement, _value, foundFirstIndex) {
        if (this.stringMatches(CMIElement, "cmi\\.objectives\\.\\d+")) {
            return new CMIObjectivesObject();
        }
        else if (foundFirstIndex &&
            this.stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
            return new CMIInteractionsCorrectResponsesObject();
        }
        else if (foundFirstIndex &&
            this.stringMatches(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")) {
            return new CMIInteractionsObjectivesObject();
        }
        else if (!foundFirstIndex &&
            this.stringMatches(CMIElement, "cmi\\.interactions\\.\\d+")) {
            return new CMIInteractionsObject();
        }
        return null;
    };
    Scorm12API.prototype.validateCorrectResponse = function (_CMIElement, _value) {
    };
    Scorm12API.prototype.getLmsErrorMessageDetails = function (errorNumber, detail) {
        var basicMessage = "No Error";
        var detailMessage = "No Error";
        errorNumber = String(errorNumber);
        if (Scorm12API_scorm12_constants.error_descriptions[errorNumber]) {
            basicMessage =
                Scorm12API_scorm12_constants.error_descriptions[errorNumber].basicMessage;
            detailMessage =
                Scorm12API_scorm12_constants.error_descriptions[errorNumber].detailMessage;
        }
        return detail ? detailMessage : basicMessage;
    };
    Scorm12API.prototype.replaceWithAnotherScormAPI = function (newAPI) {
        this.cmi = newAPI.cmi;
    };
    Scorm12API.prototype.renderCommitCMI = function (terminateCommit) {
        var cmiExport = this.renderCMIToJSONObject();
        if (terminateCommit) {
            cmiExport.cmi.core.total_time = this.cmi.getCurrentTotalTime();
        }
        var result = [];
        var flattened = flatten(cmiExport);
        switch (this.settings.dataCommitFormat) {
            case "flattened":
                return flatten(cmiExport);
            case "params":
                for (var item in flattened) {
                    if ({}.hasOwnProperty.call(flattened, item)) {
                        result.push("".concat(item, "=").concat(flattened[item]));
                    }
                }
                return result;
            case "json":
            default:
                return cmiExport;
        }
    };
    Scorm12API.prototype.storeData = function (terminateCommit) {
        var _a, _b, _c;
        if (terminateCommit) {
            var originalStatus = this.cmi.core.lesson_status;
            if (originalStatus === "not attempted") {
                this.cmi.core.lesson_status = "completed";
            }
            if (this.cmi.core.lesson_mode === "normal") {
                if (this.cmi.core.credit === "credit") {
                    if (this.settings.mastery_override &&
                        this.cmi.student_data.mastery_score !== "" &&
                        this.cmi.core.score.raw !== "") {
                        if (parseFloat(this.cmi.core.score.raw) >=
                            parseFloat(this.cmi.student_data.mastery_score)) {
                            this.cmi.core.lesson_status = "passed";
                        }
                        else {
                            this.cmi.core.lesson_status = "failed";
                        }
                    }
                }
            }
            else if (this.cmi.core.lesson_mode === "browse") {
                if ((((_c = (_b = (_a = this.startingData) === null || _a === void 0 ? void 0 : _a.cmi) === null || _b === void 0 ? void 0 : _b.core) === null || _c === void 0 ? void 0 : _c.lesson_status) || "") === "" &&
                    originalStatus === "not attempted") {
                    this.cmi.core.lesson_status = "browsed";
                }
            }
        }
        var commitObject = this.renderCommitCMI(terminateCommit || this.settings.alwaysSendTotalTime);
        if (this.apiLogLevel === Scorm12API_global_constants.LOG_LEVEL_DEBUG) {
            console.debug("Commit (terminated: " + (terminateCommit ? "yes" : "no") + "): ");
            console.debug(commitObject);
        }
        if (typeof this.settings.lmsCommitUrl === "string") {
            return this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit);
        }
        else {
            return {
                result: Scorm12API_global_constants.SCORM_TRUE,
                errorCode: 0,
            };
        }
    };
    return Scorm12API;
}(src_BaseAPI));
/* harmony default export */ var src_Scorm12API = (Scorm12API);

;// ./src/exports/scorm12.js


window.Scorm12API = src_Scorm12API;

/******/ })()
;
//# sourceMappingURL=scorm12.js.map