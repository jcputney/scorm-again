/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  CrossFrameClient: function() { return /* binding */ CrossFrameClient; },
  CrossFrameServer: function() { return /* binding */ CrossFrameServer; },
  createCrossFrameClient: function() { return /* binding */ createCrossFrameClient; },
  createCrossFrameServer: function() { return /* binding */ createCrossFrameServer; }
});

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

;// ./src/facades/CrossFrameFacade.ts

var CrossFrameServer = (function () {
    function CrossFrameServer(api, targetOrigin) {
        this._targetOrigin = "*";
        this._api = api;
        if (targetOrigin) {
            this._targetOrigin = targetOrigin;
        }
        window.addEventListener("message", this._handleMessage.bind(this));
        this._setupEventForwarding();
    }
    CrossFrameServer.prototype._handleMessage = function (event) {
        var data = event.data;
        if (!data || !data.messageId || !data.method) {
            return;
        }
        this._processMessage(data, event.source, event.origin);
    };
    CrossFrameServer.prototype._processMessage = function (data, source, origin) {
        var _a;
        var messageId = data.messageId, method = data.method, params = data.params;
        var result;
        var error;
        try {
            if (typeof this._api[method] === "function") {
                result = (_a = this._api)[method].apply(_a, params);
            }
            else {
                throw new Error("Method ".concat(method, " not found on API"));
            }
        }
        catch (e) {
            if (e instanceof Error) {
                error = {
                    message: e.message,
                    stack: e.stack,
                };
            }
            else {
                error = {
                    message: String(e),
                };
            }
        }
        var response = {
            messageId: messageId,
            result: result,
            error: error,
        };
        source.postMessage(response, this._targetOrigin);
    };
    CrossFrameServer.prototype._setupEventForwarding = function () {
        var _this = this;
        var frames = Array.from(document.querySelectorAll("iframe"));
        this._api.on("*", function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            frames.forEach(function (frame) {
                if (frame.contentWindow) {
                    frame.contentWindow.postMessage({
                        event: event,
                        args: args,
                    }, _this._targetOrigin);
                }
            });
        });
    };
    return CrossFrameServer;
}());

var CrossFrameClient = (function () {
    function CrossFrameClient(targetOrigin) {
        this._targetOrigin = "*";
        this._pendingRequests = new Map();
        this._eventListeners = new Map();
        this._messageIdCounter = 0;
        this._childFrames = new Set();
        this._isInitialized = false;
        this._lastError = "0";
        this._cache = new Map();
        if (targetOrigin) {
            this._targetOrigin = targetOrigin;
        }
        window.addEventListener("message", this._handleMessage.bind(this));
    }
    CrossFrameClient.prototype._handleMessage = function (event) {
        var _this = this;
        var data = event.data;
        var source = event.source;
        var isFromChildFrame = source !== window.parent && source !== window;
        if (data.messageId &&
            (data.result !== undefined || data.error !== undefined) &&
            !isFromChildFrame) {
            this._handleMethodResponse(data);
        }
        if (data.messageId && data.method && isFromChildFrame) {
            this._childFrames.add(source);
            var messageId_1 = data.messageId, method_1 = data.method, params = data.params;
            var forwardedMessageId_1 = "forwarded-".concat(messageId_1);
            this._pendingRequests.set(forwardedMessageId_1, {
                resolve: function (result) {
                    source.postMessage({
                        messageId: messageId_1,
                        result: result,
                    }, _this._targetOrigin);
                },
                reject: function (error) {
                    source.postMessage({
                        messageId: messageId_1,
                        error: error,
                    }, _this._targetOrigin);
                },
                source: source,
            });
            window.parent.postMessage({
                messageId: forwardedMessageId_1,
                method: method_1,
                params: params,
            }, this._targetOrigin);
            setTimeout(function () {
                if (_this._pendingRequests.has(forwardedMessageId_1)) {
                    var request = _this._pendingRequests.get(forwardedMessageId_1);
                    _this._pendingRequests.delete(forwardedMessageId_1);
                    if (request === null || request === void 0 ? void 0 : request.source) {
                        request.source.postMessage({
                            messageId: messageId_1,
                            error: {
                                message: "Timeout waiting for response to method ".concat(method_1),
                            },
                        }, _this._targetOrigin);
                    }
                }
            }, 5000);
        }
        if (data.event && !isFromChildFrame) {
            this._handleEvent.apply(this, __spreadArray([data.event], (data.args || []), false));
            this._forwardEventToChildFrames(data.event, data.args || []);
        }
    };
    CrossFrameClient.prototype._handleMethodResponse = function (data) {
        var messageId = data.messageId, result = data.result, error = data.error;
        var pendingRequest = this._pendingRequests.get(messageId);
        if (pendingRequest) {
            var resolve = pendingRequest.resolve, reject = pendingRequest.reject;
            if (error) {
                reject(error);
            }
            else {
                resolve(result);
            }
            this._pendingRequests.delete(messageId);
        }
    };
    CrossFrameClient.prototype._handleEvent = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var listeners = this._eventListeners.get(event);
        if (listeners) {
            listeners.forEach(function (listener) {
                try {
                    listener.apply(void 0, args);
                }
                catch (e) {
                    console.error("Error in event listener for ".concat(event, ":"), e);
                }
            });
        }
        var allListeners = this._eventListeners.get("*");
        if (allListeners) {
            allListeners.forEach(function (listener) {
                try {
                    listener.apply(void 0, __spreadArray([event], args, false));
                }
                catch (e) {
                    console.error("Error in \"*\" event listener for ".concat(event, ":"), e);
                }
            });
        }
    };
    CrossFrameClient.prototype._forwardEventToChildFrames = function (event, args) {
        var _this = this;
        this._childFrames.forEach(function (frame) {
            try {
                frame.postMessage({
                    event: event,
                    args: args,
                }, _this._targetOrigin);
            }
            catch (e) {
                console.error("Error forwarding event to child frame:", e);
            }
        });
    };
    CrossFrameClient.prototype._sendMessage = function (method, params) {
        var _this = this;
        if (params === void 0) { params = []; }
        return new Promise(function (resolve, reject) {
            var messageId = "".concat(Date.now(), "-").concat(_this._messageIdCounter++);
            _this._pendingRequests.set(messageId, { resolve: resolve, reject: reject });
            window.parent.postMessage({
                messageId: messageId,
                method: method,
                params: params,
            }, _this._targetOrigin);
            setTimeout(function () {
                if (_this._pendingRequests.has(messageId)) {
                    _this._pendingRequests.delete(messageId);
                    reject(new Error("Timeout waiting for response to method ".concat(method)));
                }
            }, 5000);
        });
    };
    CrossFrameClient.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._sendMessage("lmsInitialize")];
                    case 1:
                        result = _a.sent();
                        this._isInitialized = result === "true";
                        return [2, this._isInitialized];
                }
            });
        });
    };
    CrossFrameClient.prototype.lmsInitialize = function () {
        var _this = this;
        if (this._isInitialized) {
            this._lastError = "101";
            return "false";
        }
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.initialize()];
                    case 1:
                        result = _a.sent();
                        this._isInitialized = result;
                        this._lastError = result ? "0" : "101";
                        return [3, 3];
                    case 2:
                        e_1 = _a.sent();
                        this._lastError = "101";
                        this._isInitialized = false;
                        console.error("Error in lmsInitialize:", e_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); })();
        this._isInitialized = true;
        this._lastError = "0";
        return "true";
    };
    CrossFrameClient.prototype.Initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.initialize()];
            });
        });
    };
    CrossFrameClient.prototype.LMSInitialize = function () {
        return this.lmsInitialize();
    };
    CrossFrameClient.prototype.terminate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, success;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._sendMessage("lmsFinish")];
                    case 1:
                        result = _a.sent();
                        success = result === "true";
                        if (success) {
                            this._isInitialized = false;
                        }
                        return [2, success];
                }
            });
        });
    };
    CrossFrameClient.prototype.lmsFinish = function () {
        var _this = this;
        if (!this._isInitialized) {
            this._lastError = "301";
            return "false";
        }
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var result, e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.terminate()];
                    case 1:
                        result = _a.sent();
                        if (result) {
                            this._isInitialized = false;
                            this._lastError = "0";
                        }
                        else {
                            this._lastError = "101";
                        }
                        return [3, 3];
                    case 2:
                        e_2 = _a.sent();
                        this._lastError = "101";
                        console.error("Error in lmsFinish:", e_2);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); })();
        this._isInitialized = false;
        this._lastError = "0";
        return "true";
    };
    CrossFrameClient.prototype.Terminate = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.terminate()];
            });
        });
    };
    CrossFrameClient.prototype.LMSFinish = function () {
        return this.lmsFinish();
    };
    CrossFrameClient.prototype.getValue = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            var result, value, e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this._sendMessage("lmsGetValue", [element])];
                    case 1:
                        result = _a.sent();
                        value = String(result);
                        this._cache.set(element, value);
                        return [2, value];
                    case 2:
                        e_3 = _a.sent();
                        this._lastError = "101";
                        console.error("Error in getValue(".concat(element, "):"), e_3);
                        return [2, ""];
                    case 3: return [2];
                }
            });
        });
    };
    CrossFrameClient.prototype.lmsGetValue = function (element) {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var e_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getValue(element)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_4 = _a.sent();
                        this._lastError = "101";
                        console.error("Error in lmsGetValue(".concat(element, "):"), e_4);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); })();
        var cachedValue = this._cache.get(element);
        this._lastError = "0";
        return cachedValue || "";
    };
    CrossFrameClient.prototype.GetValue = function (element) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.getValue(element)];
            });
        });
    };
    CrossFrameClient.prototype.LMSGetValue = function (element) {
        return this.lmsGetValue(element);
    };
    CrossFrameClient.prototype.setValue = function (element, value) {
        return __awaiter(this, void 0, void 0, function () {
            var result, success, e_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this._sendMessage("lmsSetValue", [element, value])];
                    case 1:
                        result = _a.sent();
                        success = result === "true";
                        if (success) {
                            this._cache.set(element, String(value));
                        }
                        return [2, success];
                    case 2:
                        e_5 = _a.sent();
                        this._lastError = "101";
                        console.error("Error in setValue(".concat(element, ", ").concat(value, "):"), e_5);
                        return [2, false];
                    case 3: return [2];
                }
            });
        });
    };
    CrossFrameClient.prototype.lmsSetValue = function (element, value) {
        var _this = this;
        if (!this._isInitialized) {
            this._lastError = "301";
            return "false";
        }
        if (!element || element === "") {
            this._lastError = "201";
            return "false";
        }
        this._cache.set(element, String(value));
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var result, e_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.setValue(element, value)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            this._lastError = "201";
                        }
                        else {
                            this._lastError = "0";
                        }
                        return [3, 3];
                    case 2:
                        e_6 = _a.sent();
                        this._lastError = "101";
                        console.error("Error in lmsSetValue(".concat(element, ", ").concat(value, "):"), e_6);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); })();
        this._lastError = "0";
        return "true";
    };
    CrossFrameClient.prototype.SetValue = function (element, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.setValue(element, value)];
            });
        });
    };
    CrossFrameClient.prototype.LMSSetValue = function (element, value) {
        return this.lmsSetValue(element, value);
    };
    CrossFrameClient.prototype.commit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_7;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this._sendMessage("lmsCommit")];
                    case 1:
                        result = _a.sent();
                        return [2, result === "true"];
                    case 2:
                        e_7 = _a.sent();
                        this._lastError = "101";
                        console.error("Error in commit:", e_7);
                        return [2, false];
                    case 3: return [2];
                }
            });
        });
    };
    CrossFrameClient.prototype.lmsCommit = function () {
        var _this = this;
        if (!this._isInitialized) {
            this._lastError = "301";
            return "false";
        }
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var result, e_8;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.commit()];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            this._lastError = "101";
                        }
                        else {
                            this._lastError = "0";
                        }
                        return [3, 3];
                    case 2:
                        e_8 = _a.sent();
                        this._lastError = "101";
                        console.error("Error in lmsCommit:", e_8);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); })();
        this._lastError = "0";
        return "true";
    };
    CrossFrameClient.prototype.Commit = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.commit()];
            });
        });
    };
    CrossFrameClient.prototype.LMSCommit = function () {
        return this.lmsCommit();
    };
    CrossFrameClient.prototype.getLastError = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_9;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this._sendMessage("lmsGetLastError")];
                    case 1:
                        result = _a.sent();
                        this._lastError = String(result);
                        return [2, this._lastError];
                    case 2:
                        e_9 = _a.sent();
                        console.error("Error in getLastError:", e_9);
                        return [2, "101"];
                    case 3: return [2];
                }
            });
        });
    };
    CrossFrameClient.prototype.lmsGetLastError = function () {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var e_10;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getLastError()];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_10 = _a.sent();
                        console.error("Error in lmsGetLastError:", e_10);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); })();
        return this._lastError;
    };
    CrossFrameClient.prototype.GetLastError = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.getLastError()];
            });
        });
    };
    CrossFrameClient.prototype.LMSGetLastError = function () {
        return this.lmsGetLastError();
    };
    CrossFrameClient.prototype.getErrorString = function (errorCode) {
        return __awaiter(this, void 0, void 0, function () {
            var result, errorString, e_11;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this._sendMessage("lmsGetErrorString", [errorCode])];
                    case 1:
                        result = _a.sent();
                        errorString = String(result);
                        this._cache.set("error_".concat(errorCode), errorString);
                        return [2, errorString];
                    case 2:
                        e_11 = _a.sent();
                        console.error("Error in getErrorString(".concat(errorCode, "):"), e_11);
                        return [2, ""];
                    case 3: return [2];
                }
            });
        });
    };
    CrossFrameClient.prototype.lmsGetErrorString = function (errorCode) {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var e_12;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getErrorString(errorCode)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_12 = _a.sent();
                        console.error("Error in lmsGetErrorString(".concat(errorCode, "):"), e_12);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); })();
        var cachedValue = this._cache.get("error_".concat(errorCode));
        return cachedValue || "No error";
    };
    CrossFrameClient.prototype.GetErrorString = function (errorCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.getErrorString(errorCode)];
            });
        });
    };
    CrossFrameClient.prototype.LMSGetErrorString = function (errorCode) {
        return this.lmsGetErrorString(errorCode);
    };
    CrossFrameClient.prototype.getDiagnostic = function (errorCode) {
        return __awaiter(this, void 0, void 0, function () {
            var result, diagnostic, e_13;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this._sendMessage("lmsGetDiagnostic", [errorCode])];
                    case 1:
                        result = _a.sent();
                        diagnostic = String(result);
                        this._cache.set("diagnostic_".concat(errorCode), diagnostic);
                        return [2, diagnostic];
                    case 2:
                        e_13 = _a.sent();
                        console.error("Error in getDiagnostic(".concat(errorCode, "):"), e_13);
                        return [2, ""];
                    case 3: return [2];
                }
            });
        });
    };
    CrossFrameClient.prototype.lmsGetDiagnostic = function (errorCode) {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var e_14;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.getDiagnostic(errorCode)];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_14 = _a.sent();
                        console.error("Error in lmsGetDiagnostic(".concat(errorCode, "):"), e_14);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); })();
        var cachedValue = this._cache.get("diagnostic_".concat(errorCode));
        return cachedValue || "No diagnostic information available";
    };
    CrossFrameClient.prototype.GetDiagnostic = function (errorCode) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.getDiagnostic(errorCode)];
            });
        });
    };
    CrossFrameClient.prototype.LMSGetDiagnostic = function (errorCode) {
        return this.lmsGetDiagnostic(errorCode);
    };
    CrossFrameClient.prototype.isInitialized = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result, e_15;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this._sendMessage("isInitialized")];
                    case 1:
                        result = _a.sent();
                        this._isInitialized = Boolean(result);
                        return [2, this._isInitialized];
                    case 2:
                        e_15 = _a.sent();
                        console.error("Error in isInitialized:", e_15);
                        return [2, this._isInitialized];
                    case 3: return [2];
                }
            });
        });
    };
    CrossFrameClient.prototype.getIsInitialized = function () {
        var _this = this;
        (function () { return __awaiter(_this, void 0, void 0, function () {
            var e_16;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.isInitialized()];
                    case 1:
                        _a.sent();
                        return [3, 3];
                    case 2:
                        e_16 = _a.sent();
                        console.error("Error in getIsInitialized:", e_16);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        }); })();
        return this._isInitialized;
    };
    CrossFrameClient.prototype.on = function (event, callback) {
        if (!this._eventListeners.has(event)) {
            this._eventListeners.set(event, new Set());
        }
        var listeners = this._eventListeners.get(event);
        if (listeners) {
            listeners.add(callback);
        }
    };
    CrossFrameClient.prototype.off = function (event, callback) {
        var listeners = this._eventListeners.get(event);
        if (listeners) {
            listeners.delete(callback);
            if (listeners.size === 0) {
                this._eventListeners.delete(event);
            }
        }
    };
    return CrossFrameClient;
}());

function createCrossFrameServer(api, targetOrigin) {
    return new CrossFrameServer(api, targetOrigin);
}
function createCrossFrameClient(targetOrigin) {
    return new CrossFrameClient(targetOrigin);
}

var __webpack_export_target__ = window;
for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;