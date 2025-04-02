/******/ var __webpack_modules__ = ({

/***/ 56:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   K$: function() { return /* binding */ NAVBoolean; },
/* harmony export */   Mb: function() { return /* binding */ LogLevelEnum; },
/* harmony export */   YE: function() { return /* binding */ SuccessStatus; },
/* harmony export */   lC: function() { return /* binding */ CompletionStatus; }
/* harmony export */ });
var NAVBoolean = {
    UNKNOWN: "unknown",
    TRUE: "true",
    FALSE: "false",
};
var SuccessStatus = {
    PASSED: "passed",
    FAILED: "failed",
    UNKNOWN: "unknown",
};
var CompletionStatus = {
    COMPLETED: "completed",
    INCOMPLETE: "incomplete",
    UNKNOWN: "unknown",
};
var LogLevelEnum = {
    _: 0,
    DEBUG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
    NONE: 5,
};


/***/ }),

/***/ 176:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: function() { return /* binding */ CMIObjectives; },
/* harmony export */   N: function() { return /* binding */ CMIObjectivesObject; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(635);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(319);
/* harmony import */ var _common_score__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(434);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(340);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(417);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(797);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(179);
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(915);
/* harmony import */ var _common_array__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(589);









var CMIObjectives = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_8__/* .__extends */ .C6)(CMIObjectives, _super);
    function CMIObjectives() {
        return _super.call(this, {
            children: _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_constants */ .QP.objectives_children,
            errorCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_4__/* .scorm12_errors */ .Se.INVALID_SET_VALUE,
            errorClass: _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_5__/* .Scorm12ValidationError */ .t,
        }) || this;
    }
    return CMIObjectives;
}(_common_array__WEBPACK_IMPORTED_MODULE_7__/* .CMIArray */ .B));

var CMIObjectivesObject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_8__/* .__extends */ .C6)(CMIObjectivesObject, _super);
    function CMIObjectivesObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        _this._status = "";
        _this.score = new _common_score__WEBPACK_IMPORTED_MODULE_1__/* .CMIScore */ ._({
            score_children: _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_constants */ .QP.score_children,
            score_range: _constants_regex__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_regex */ .kS.score_range,
            invalidErrorCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_4__/* .scorm12_errors */ .Se.INVALID_SET_VALUE,
            invalidTypeCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_4__/* .scorm12_errors */ .Se.TYPE_MISMATCH,
            invalidRangeCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_4__/* .scorm12_errors */ .Se.VALUE_OUT_OF_RANGE,
            errorClass: _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_5__/* .Scorm12ValidationError */ .t,
        });
        return _this;
    }
    CMIObjectivesObject.prototype.reset = function () {
        var _a;
        this._initialized = false;
        this._id = "";
        this._status = "";
        (_a = this.score) === null || _a === void 0 ? void 0 : _a.reset();
    };
    Object.defineProperty(CMIObjectivesObject.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_6__/* .check12ValidFormat */ .p)(id, _constants_regex__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_regex */ .kS.CMIIdentifier)) {
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
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_6__/* .check12ValidFormat */ .p)(status, _constants_regex__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_regex */ .kS.CMIStatus2)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_0__/* .BaseCMI */ .J));



/***/ }),

/***/ 179:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: function() { return /* binding */ Scorm12ValidationError; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(635);
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(784);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(340);



var scorm12_errors = _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.error_descriptions;
var Scorm12ValidationError = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_2__/* .__extends */ .C6)(Scorm12ValidationError, _super);
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
}(_exceptions__WEBPACK_IMPORTED_MODULE_0__/* .ValidationError */ .y));



/***/ }),

/***/ 181:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: function() { return /* binding */ CMIStudentPreference; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(635);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(319);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(340);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(179);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(797);
/* harmony import */ var _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(819);






var CMIStudentPreference = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_5__/* .__extends */ .C6)(CMIStudentPreference, _super);
    function CMIStudentPreference(student_preference_children) {
        var _this = _super.call(this) || this;
        _this._audio = "";
        _this._language = "";
        _this._speed = "";
        _this._text = "";
        _this.__children = student_preference_children
            ? student_preference_children
            : _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.student_preference_children;
        return _this;
    }
    CMIStudentPreference.prototype.reset = function () {
        this._initialized = false;
    };
    Object.defineProperty(CMIStudentPreference.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentPreference.prototype, "audio", {
        get: function () {
            return this._audio;
        },
        set: function (audio) {
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScorm12Audio(audio)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScorm12Language(language)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScorm12Speed(speed)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScorm12Text(text)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_0__/* .BaseCMI */ .J));



/***/ }),

/***/ 273:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: function() { return /* binding */ src_BaseAPI; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(635);
// EXTERNAL MODULE: ./src/constants/api_constants.ts
var api_constants = __webpack_require__(340);
// EXTERNAL MODULE: ./src/utilities.ts
var utilities = __webpack_require__(864);
// EXTERNAL MODULE: ./src/constants/enums.ts
var enums = __webpack_require__(56);
;// ./src/constants/default_settings.ts



var DefaultSettings = {
    autocommit: false,
    autocommitSeconds: 10,
    asyncCommit: false,
    sendFullCommit: true,
    lmsCommitUrl: false,
    dataCommitFormat: "json",
    commitRequestDataType: "application/json;charset=UTF-8",
    autoProgress: false,
    logLevel: enums/* LogLevelEnum */.Mb.ERROR,
    selfReportSessionTime: false,
    alwaysSendTotalTime: false,
    renderCommonCommitFields: false,
    strict_errors: true,
    xhrHeaders: {},
    xhrWithCredentials: false,
    fetchMode: "cors",
    responseHandler: function (response) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function () {
            var responseText, httpResult;
            return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(typeof response !== "undefined")) return [3, 2];
                        return [4, response.text()];
                    case 1:
                        responseText = _a.sent();
                        httpResult = null;
                        if (responseText) {
                            httpResult = JSON.parse(responseText);
                        }
                        if (httpResult === null ||
                            !{}.hasOwnProperty.call(httpResult, "result")) {
                            if (response.status === 200) {
                                return [2, {
                                        result: api_constants/* global_constants */._y.SCORM_TRUE,
                                        errorCode: 0,
                                    }];
                            }
                            else {
                                return [2, {
                                        result: api_constants/* global_constants */._y.SCORM_FALSE,
                                        errorCode: 101,
                                    }];
                            }
                        }
                        else {
                            return [2, {
                                    result: httpResult.result,
                                    errorCode: httpResult.errorCode
                                        ? httpResult.errorCode
                                        : httpResult.result === api_constants/* global_constants */._y.SCORM_TRUE
                                            ? 0
                                            : 101,
                                }];
                        }
                        _a.label = 2;
                    case 2: return [2, {
                            result: api_constants/* global_constants */._y.SCORM_FALSE,
                            errorCode: 101,
                        }];
                }
            });
        });
    },
    requestHandler: function (commitObject) {
        return commitObject;
    },
    onLogMessage: defaultLogHandler,
    scoItemIds: [],
    scoItemIdValidator: false,
    globalObjectiveIds: [],
};
function defaultLogHandler(messageLevel, logMessage) {
    switch (messageLevel) {
        case "4":
        case 4:
        case "ERROR":
        case enums/* LogLevelEnum */.Mb.ERROR:
            console.error(logMessage);
            break;
        case "3":
        case 3:
        case "WARN":
        case enums/* LogLevelEnum */.Mb.WARN:
            console.warn(logMessage);
            break;
        case "2":
        case 2:
        case "INFO":
        case enums/* LogLevelEnum */.Mb.INFO:
            console.info(logMessage);
            break;
        case "1":
        case 1:
        case "DEBUG":
        case enums/* LogLevelEnum */.Mb.DEBUG:
            if (console.debug) {
                console.debug(logMessage);
            }
            else {
                console.log(logMessage);
            }
            break;
    }
}

;// ./src/helpers/scheduled_commit.ts

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
        var _this = this;
        if (!this._cancelled) {
            (function () { return (0,tslib_es6/* __awaiter */.sH)(_this, void 0, void 0, function () { return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this._API.commit(this._callback)];
                    case 1: return [2, _a.sent()];
                }
            }); }); })();
        }
    };
    return ScheduledCommit;
}());


;// ./src/services/HttpService.ts



var HttpService = (function () {
    function HttpService(settings, error_codes) {
        this.settings = settings;
        this.error_codes = error_codes;
    }
    HttpService.prototype.processHttpRequest = function (url_1, params_1) {
        return (0,tslib_es6/* __awaiter */.sH)(this, arguments, void 0, function (url, params, immediate, apiLog, processListeners) {
            var genericError, process;
            var _this = this;
            if (immediate === void 0) { immediate = false; }
            return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        genericError = {
                            result: api_constants/* global_constants */._y.SCORM_FALSE,
                            errorCode: this.error_codes.GENERAL,
                        };
                        if (immediate) {
                            this.performFetch(url, params).then(function (response) { return (0,tslib_es6/* __awaiter */.sH)(_this, void 0, void 0, function () {
                                return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4, this.transformResponse(response, processListeners)];
                                        case 1:
                                            _a.sent();
                                            return [2];
                                    }
                                });
                            }); });
                            return [2, {
                                    result: api_constants/* global_constants */._y.SCORM_TRUE,
                                    errorCode: 0,
                                }];
                        }
                        process = function (url, params, settings) { return (0,tslib_es6/* __awaiter */.sH)(_this, void 0, void 0, function () {
                            var response, e_1;
                            return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        params = settings.requestHandler(params);
                                        return [4, this.performFetch(url, params)];
                                    case 1:
                                        response = _a.sent();
                                        return [2, this.transformResponse(response, processListeners)];
                                    case 2:
                                        e_1 = _a.sent();
                                        apiLog("processHttpRequest", e_1, enums/* LogLevelEnum */.Mb.ERROR);
                                        processListeners("CommitError");
                                        return [2, genericError];
                                    case 3: return [2];
                                }
                            });
                        }); };
                        return [4, process(url, params, this.settings)];
                    case 1: return [2, _a.sent()];
                }
            });
        });
    };
    HttpService.prototype.performFetch = function (url, params) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function () {
            return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                return [2, fetch(url, {
                        method: "POST",
                        mode: this.settings.fetchMode,
                        body: params instanceof Array ? params.join("&") : JSON.stringify(params),
                        headers: (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, this.settings.xhrHeaders), { "Content-Type": this.settings.commitRequestDataType }),
                        credentials: this.settings.xhrWithCredentials ? "include" : undefined,
                        keepalive: true,
                    })];
            });
        });
    };
    HttpService.prototype.transformResponse = function (response, processListeners) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function () {
            var result, _a;
            return (0,tslib_es6/* __generator */.YH)(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof this.settings.responseHandler === "function")) return [3, 2];
                        return [4, this.settings.responseHandler(response)];
                    case 1:
                        _a = _b.sent();
                        return [3, 4];
                    case 2: return [4, response.json()];
                    case 3:
                        _a = _b.sent();
                        _b.label = 4;
                    case 4:
                        result = _a;
                        if (response.status >= 200 &&
                            response.status <= 299 &&
                            (result.result === true || result.result === api_constants/* global_constants */._y.SCORM_TRUE)) {
                            processListeners("CommitSuccess");
                            if (!Object.hasOwnProperty.call(result, "errorCode")) {
                                result.errorCode = 0;
                            }
                        }
                        else {
                            processListeners("CommitError");
                            if (!Object.hasOwnProperty.call(result, "errorCode")) {
                                result.errorCode = this.error_codes.GENERAL;
                            }
                        }
                        return [2, result];
                }
            });
        });
    };
    HttpService.prototype.updateSettings = function (settings) {
        this.settings = settings;
    };
    return HttpService;
}());


;// ./src/services/EventService.ts


var EventService = (function () {
    function EventService(apiLog) {
        this.apiLog = apiLog;
        this.listenerMap = new Map();
        this.listenerCount = 0;
    }
    EventService.prototype.parseListenerName = function (listenerName) {
        var listenerSplit = listenerName.split(".");
        if (listenerSplit.length === 0)
            return null;
        var functionName = listenerSplit[0];
        var CMIElement = null;
        if (listenerSplit.length > 1) {
            CMIElement = listenerName.replace("".concat(functionName, "."), "");
        }
        return { functionName: functionName, CMIElement: CMIElement };
    };
    EventService.prototype.on = function (listenerName, callback) {
        var _a;
        if (!callback)
            return;
        var listenerFunctions = listenerName.split(" ");
        for (var _i = 0, listenerFunctions_1 = listenerFunctions; _i < listenerFunctions_1.length; _i++) {
            var listenerFunction = listenerFunctions_1[_i];
            var parsedListener = this.parseListenerName(listenerFunction);
            if (!parsedListener)
                continue;
            var functionName = parsedListener.functionName, CMIElement = parsedListener.CMIElement;
            var listeners = (_a = this.listenerMap.get(functionName)) !== null && _a !== void 0 ? _a : [];
            listeners.push({
                functionName: functionName,
                CMIElement: CMIElement,
                callback: callback,
            });
            this.listenerMap.set(functionName, listeners);
            this.listenerCount++;
            this.apiLog("on", "Added event listener: ".concat(this.listenerCount), enums/* LogLevelEnum */.Mb.INFO, functionName);
        }
    };
    EventService.prototype.off = function (listenerName, callback) {
        if (!callback)
            return;
        var listenerFunctions = listenerName.split(" ");
        var _loop_1 = function (listenerFunction) {
            var parsedListener = this_1.parseListenerName(listenerFunction);
            if (!parsedListener)
                return "continue";
            var functionName = parsedListener.functionName, CMIElement = parsedListener.CMIElement;
            var listeners = this_1.listenerMap.get(functionName);
            if (!listeners)
                return "continue";
            var removeIndex = listeners.findIndex(function (obj) { return obj.CMIElement === CMIElement && obj.callback === callback; });
            if (removeIndex !== -1) {
                listeners.splice(removeIndex, 1);
                this_1.listenerCount--;
                if (listeners.length === 0) {
                    this_1.listenerMap.delete(functionName);
                }
                else {
                    this_1.listenerMap.set(functionName, listeners);
                }
                this_1.apiLog("off", "Removed event listener: ".concat(this_1.listenerCount), enums/* LogLevelEnum */.Mb.INFO, functionName);
            }
        };
        var this_1 = this;
        for (var _i = 0, listenerFunctions_2 = listenerFunctions; _i < listenerFunctions_2.length; _i++) {
            var listenerFunction = listenerFunctions_2[_i];
            _loop_1(listenerFunction);
        }
    };
    EventService.prototype.clear = function (listenerName) {
        var listenerFunctions = listenerName.split(" ");
        var _loop_2 = function (listenerFunction) {
            var parsedListener = this_2.parseListenerName(listenerFunction);
            if (!parsedListener)
                return "continue";
            var functionName = parsedListener.functionName, CMIElement = parsedListener.CMIElement;
            if (this_2.listenerMap.has(functionName)) {
                var listeners = this_2.listenerMap.get(functionName);
                var newListeners = listeners.filter(function (obj) { return obj.CMIElement !== CMIElement; });
                this_2.listenerCount -= listeners.length - newListeners.length;
                if (newListeners.length === 0) {
                    this_2.listenerMap.delete(functionName);
                }
                else {
                    this_2.listenerMap.set(functionName, newListeners);
                }
            }
        };
        var this_2 = this;
        for (var _i = 0, listenerFunctions_3 = listenerFunctions; _i < listenerFunctions_3.length; _i++) {
            var listenerFunction = listenerFunctions_3[_i];
            _loop_2(listenerFunction);
        }
    };
    EventService.prototype.processListeners = function (functionName, CMIElement, value) {
        this.apiLog(functionName, value, enums/* LogLevelEnum */.Mb.INFO, CMIElement);
        var listeners = this.listenerMap.get(functionName);
        if (!listeners)
            return;
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var listener = listeners_1[_i];
            var listenerHasCMIElement = !!listener.CMIElement;
            var CMIElementsMatch = false;
            if (CMIElement &&
                listener.CMIElement &&
                listener.CMIElement.endsWith("*")) {
                var prefix = listener.CMIElement.slice(0, -1);
                CMIElementsMatch = (0,utilities/* stringMatches */.J6)(CMIElement, prefix);
            }
            else {
                CMIElementsMatch = listener.CMIElement === CMIElement;
            }
            if (!listenerHasCMIElement || CMIElementsMatch) {
                this.apiLog("processListeners", "Processing listener: ".concat(listener.functionName), enums/* LogLevelEnum */.Mb.DEBUG, CMIElement);
                listener.callback(CMIElement, value);
            }
        }
    };
    EventService.prototype.reset = function () {
        this.listenerMap.clear();
        this.listenerCount = 0;
    };
    return EventService;
}());


;// ./src/services/SerializationService.ts


var SerializationService = (function () {
    function SerializationService() {
    }
    SerializationService.prototype.loadFromFlattenedJSON = function (json, CMIElement, loadFromJSON, setCMIValue, isNotInitialized) {
        if (CMIElement === void 0) { CMIElement = ""; }
        if (!isNotInitialized()) {
            console.error("loadFromFlattenedJSON can only be called before the call to lmsInitialize.");
            return;
        }
        var int_pattern = /^(cmi\.interactions\.)(\d+)\.(.*)$/;
        var obj_pattern = /^(cmi\.objectives\.)(\d+)\.(.*)$/;
        var interactions = [];
        var objectives = [];
        var others = [];
        for (var key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key)) {
                var intMatch = key.match(int_pattern);
                if (intMatch) {
                    interactions.push({
                        key: key,
                        value: json[key],
                        index: Number(intMatch[2]),
                        field: intMatch[3],
                    });
                    continue;
                }
                var objMatch = key.match(obj_pattern);
                if (objMatch) {
                    objectives.push({
                        key: key,
                        value: json[key],
                        index: Number(objMatch[2]),
                        field: objMatch[3],
                    });
                    continue;
                }
                others.push({ key: key, value: json[key] });
            }
        }
        interactions.sort(function (a, b) {
            if (a.index !== b.index) {
                return a.index - b.index;
            }
            if (a.field === "id")
                return -1;
            if (b.field === "id")
                return 1;
            if (a.field === "type")
                return -1;
            if (b.field === "type")
                return 1;
            return a.field.localeCompare(b.field);
        });
        objectives.sort(function (a, b) {
            if (a.index !== b.index) {
                return a.index - b.index;
            }
            if (a.field === "id")
                return -1;
            if (b.field === "id")
                return 1;
            return a.field.localeCompare(b.field);
        });
        others.sort(function (a, b) { return a.key.localeCompare(b.key); });
        var processItems = function (items) {
            items.forEach(function (item) {
                var obj = {};
                obj[item.key] = item.value;
                loadFromJSON((0,utilities/* unflatten */.sB)(obj), CMIElement);
            });
        };
        processItems(interactions);
        processItems(objectives);
        processItems(others);
    };
    SerializationService.prototype.loadFromJSON = function (json, CMIElement, setCMIValue, isNotInitialized, setStartingData) {
        if (CMIElement === void 0) { CMIElement = ""; }
        if (!isNotInitialized()) {
            console.error("loadFromJSON can only be called before the call to lmsInitialize.");
            return;
        }
        CMIElement = CMIElement !== undefined ? CMIElement : "cmi";
        setStartingData(json);
        for (var key in json) {
            if (Object.prototype.hasOwnProperty.call(json, key) && json[key]) {
                var currentCMIElement = (CMIElement ? CMIElement + "." : "") + key;
                var value = json[key];
                if (value.constructor === Array) {
                    for (var i = 0; i < value.length; i++) {
                        if (value[i]) {
                            var item = value[i];
                            var tempCMIElement = "".concat(currentCMIElement, ".").concat(i);
                            if (item.constructor === Object) {
                                this.loadFromJSON(item, tempCMIElement, setCMIValue, isNotInitialized, setStartingData);
                            }
                            else {
                                setCMIValue(tempCMIElement, item);
                            }
                        }
                    }
                }
                else if (value.constructor === Object) {
                    this.loadFromJSON(value, currentCMIElement, setCMIValue, isNotInitialized, setStartingData);
                }
                else {
                    setCMIValue(currentCMIElement, value);
                }
            }
        }
    };
    SerializationService.prototype.renderCMIToJSONString = function (cmi, sendFullCommit) {
        if (sendFullCommit) {
            return JSON.stringify({ cmi: cmi });
        }
        return JSON.stringify({ cmi: cmi }, function (k, v) { return (v === undefined ? null : v); }, 2);
    };
    SerializationService.prototype.renderCMIToJSONObject = function (cmi, sendFullCommit) {
        return JSON.parse(this.renderCMIToJSONString(cmi, sendFullCommit));
    };
    SerializationService.prototype.getCommitObject = function (terminateCommit, alwaysSendTotalTime, renderCommonCommitFields, renderCommitObject, renderCommitCMI, apiLogLevel) {
        var shouldTerminateCommit = terminateCommit || alwaysSendTotalTime;
        var commitObject = renderCommonCommitFields
            ? renderCommitObject(shouldTerminateCommit)
            : renderCommitCMI(shouldTerminateCommit);
        if ([enums/* LogLevelEnum */.Mb.DEBUG, "1", 1, "DEBUG"].includes(apiLogLevel)) {
            console.debug("Commit (terminated: " + (terminateCommit ? "yes" : "no") + "): ");
            console.debug(commitObject);
        }
        return commitObject;
    };
    return SerializationService;
}());


// EXTERNAL MODULE: ./src/exceptions.ts
var exceptions = __webpack_require__(784);
// EXTERNAL MODULE: ./src/cmi/common/array.ts
var array = __webpack_require__(589);
;// ./src/utils/type_guards.ts


function isValidationError(value) {
    return value instanceof exceptions/* ValidationError */.y;
}
function isError(value) {
    return value instanceof Error;
}
function isCMIArray(value) {
    return value instanceof array/* CMIArray */.B;
}

;// ./src/services/CMIDataService.ts





var CMIDataService = (function () {
    function CMIDataService(error_codes, apiLog, throwSCORMError, validateCorrectResponse, getChildElement, checkObjectHasProperty, errorHandlingService) {
        this._error_codes = error_codes;
        this._apiLog = apiLog;
        this._throwSCORMError = throwSCORMError;
        this._validateCorrectResponse = validateCorrectResponse;
        this._getChildElement = getChildElement;
        this._checkObjectHasProperty = checkObjectHasProperty;
        this._errorHandlingService = errorHandlingService;
    }
    CMIDataService.prototype.updateLastErrorCode = function (errorCode) {
        this._errorHandlingService.lastErrorCode = errorCode;
    };
    CMIDataService.prototype.throwSCORMError = function (errorNumber, message) {
        this._throwSCORMError(errorNumber, message);
    };
    CMIDataService.prototype.setCMIValue = function (cmi, methodName, scorm2004, CMIElement, value, isInitialized) {
        if (!CMIElement || CMIElement === "") {
            return api_constants/* global_constants */._y.SCORM_FALSE;
        }
        var structure = CMIElement.split(".");
        var refObject = cmi;
        var returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
        var foundFirstIndex = false;
        var invalidErrorMessage = "The data model element passed to ".concat(methodName, " (").concat(CMIElement, ") is not a valid SCORM data model element.");
        var invalidErrorCode = scorm2004
            ? this._error_codes.UNDEFINED_DATA_MODEL
            : this._error_codes.GENERAL;
        for (var idx = 0; idx < structure.length; idx++) {
            var attribute = structure[idx];
            if (idx === structure.length - 1) {
                if (scorm2004 && attribute.substring(0, 8) === "{target=") {
                    if (isInitialized) {
                        this.throwSCORMError(this._error_codes.READ_ONLY_ELEMENT);
                    }
                    else {
                        refObject = (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, refObject), { attribute: value });
                    }
                }
                else if (!this._checkObjectHasProperty(refObject, attribute)) {
                    this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                }
                else {
                    if ((0,utilities/* stringMatches */.J6)(CMIElement, "\\.correct_responses\\.\\d+") &&
                        isInitialized) {
                        this._validateCorrectResponse(CMIElement, value);
                    }
                    if (!scorm2004 || this._errorHandlingService.lastErrorCode === "0") {
                        refObject[attribute] = value;
                        returnValue = api_constants/* global_constants */._y.SCORM_TRUE;
                    }
                }
            }
            else {
                refObject = refObject[attribute];
                if (!refObject) {
                    this.throwSCORMError(invalidErrorCode, invalidErrorMessage);
                    break;
                }
                if (isCMIArray(refObject)) {
                    var index = parseInt(structure[idx + 1], 10);
                    if (!isNaN(index)) {
                        var item = refObject.childArray[index];
                        if (item) {
                            refObject = item;
                            foundFirstIndex = true;
                        }
                        else {
                            var newChild = this._getChildElement(CMIElement, value, foundFirstIndex);
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
        if (returnValue === api_constants/* global_constants */._y.SCORM_FALSE) {
            this._apiLog(methodName, "There was an error setting the value for: ".concat(CMIElement, ", value of: ").concat(value), enums/* LogLevelEnum */.Mb.WARN);
        }
        return returnValue;
    };
    CMIDataService.prototype.getCMIValue = function (cmi, methodName, scorm2004, CMIElement) {
        if (!CMIElement || CMIElement === "") {
            return "";
        }
        var structure = CMIElement.split(".");
        var refObject = cmi;
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
            if (isCMIArray(refObject)) {
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
                    this.throwSCORMError(this._error_codes.CHILDREN_ERROR);
                }
                else if (attribute === "_count") {
                    this.throwSCORMError(this._error_codes.COUNT_ERROR);
                }
            }
        }
        else {
            return refObject;
        }
    };
    return CMIDataService;
}());


;// ./src/services/ErrorHandlingService.ts



var ErrorHandlingService = (function () {
    function ErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails) {
        this._lastErrorCode = "0";
        this._errorCodes = errorCodes;
        this._apiLog = apiLog;
        this._getLmsErrorMessageDetails = getLmsErrorMessageDetails;
    }
    Object.defineProperty(ErrorHandlingService.prototype, "lastErrorCode", {
        get: function () {
            return this._lastErrorCode;
        },
        set: function (errorCode) {
            this._lastErrorCode = errorCode;
        },
        enumerable: false,
        configurable: true
    });
    ErrorHandlingService.prototype.throwSCORMError = function (errorNumber, message) {
        if (!message) {
            message = this._getLmsErrorMessageDetails(errorNumber);
        }
        this._apiLog("throwSCORMError", errorNumber + ": " + message, enums/* LogLevelEnum */.Mb.ERROR);
        this._lastErrorCode = String(errorNumber);
    };
    ErrorHandlingService.prototype.clearSCORMError = function (success) {
        if (success !== undefined && success !== api_constants/* global_constants */._y.SCORM_FALSE) {
            this._lastErrorCode = "0";
        }
    };
    ErrorHandlingService.prototype.handleValueAccessException = function (e, returnValue) {
        if (isValidationError(e)) {
            this._lastErrorCode = String(e.errorCode);
            returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
        }
        else {
            if (isError(e) && e.message) {
                console.error(e.message);
            }
            else {
                console.error(e);
            }
            this.throwSCORMError(this._errorCodes.GENERAL);
        }
        return returnValue;
    };
    Object.defineProperty(ErrorHandlingService.prototype, "errorCodes", {
        get: function () {
            return this._errorCodes;
        },
        enumerable: false,
        configurable: true
    });
    return ErrorHandlingService;
}());

function createErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails) {
    return new ErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails);
}

;// ./src/services/LoggingService.ts


var LoggingService = (function () {
    function LoggingService() {
        this._logLevel = enums/* LogLevelEnum */.Mb.ERROR;
        this._logHandler = defaultLogHandler;
    }
    LoggingService.getInstance = function () {
        if (!LoggingService._instance) {
            LoggingService._instance = new LoggingService();
        }
        return LoggingService._instance;
    };
    LoggingService.prototype.setLogLevel = function (level) {
        this._logLevel = level;
    };
    LoggingService.prototype.getLogLevel = function () {
        return this._logLevel;
    };
    LoggingService.prototype.setLogHandler = function (handler) {
        this._logHandler = handler;
    };
    LoggingService.prototype.log = function (messageLevel, logMessage) {
        if (this.shouldLog(messageLevel)) {
            this._logHandler(messageLevel, logMessage);
        }
    };
    LoggingService.prototype.error = function (logMessage) {
        this.log(enums/* LogLevelEnum */.Mb.ERROR, logMessage);
    };
    LoggingService.prototype.warn = function (logMessage) {
        this.log(enums/* LogLevelEnum */.Mb.WARN, logMessage);
    };
    LoggingService.prototype.info = function (logMessage) {
        this.log(enums/* LogLevelEnum */.Mb.INFO, logMessage);
    };
    LoggingService.prototype.debug = function (logMessage) {
        this.log(enums/* LogLevelEnum */.Mb.DEBUG, logMessage);
    };
    LoggingService.prototype.shouldLog = function (messageLevel) {
        var numericMessageLevel = this.getNumericLevel(messageLevel);
        var numericLogLevel = this.getNumericLevel(this._logLevel);
        return numericMessageLevel >= numericLogLevel;
    };
    LoggingService.prototype.getNumericLevel = function (level) {
        if (level === undefined)
            return enums/* LogLevelEnum */.Mb.NONE;
        if (typeof level === "number")
            return level;
        switch (level) {
            case "1":
            case "DEBUG":
                return enums/* LogLevelEnum */.Mb.DEBUG;
            case "2":
            case "INFO":
                return enums/* LogLevelEnum */.Mb.INFO;
            case "3":
            case "WARN":
                return enums/* LogLevelEnum */.Mb.WARN;
            case "4":
            case "ERROR":
                return enums/* LogLevelEnum */.Mb.ERROR;
            case "5":
            case "NONE":
                return enums/* LogLevelEnum */.Mb.NONE;
            default:
                return enums/* LogLevelEnum */.Mb.ERROR;
        }
    };
    return LoggingService;
}());

function getLoggingService() {
    return LoggingService.getInstance();
}

;// ./src/BaseAPI.ts












var BaseAPI = (function () {
    function BaseAPI(error_codes, settings, httpService, eventService, serializationService, cmiDataService, errorHandlingService, loggingService) {
        var _newTarget = this.constructor;
        this._settings = DefaultSettings;
        if (_newTarget === BaseAPI) {
            throw new TypeError("Cannot construct BaseAPI instances directly");
        }
        this.currentState = api_constants/* global_constants */._y.STATE_NOT_INITIALIZED;
        this._error_codes = error_codes;
        if (settings) {
            this.settings = settings;
        }
        this.apiLogLevel = this.settings.logLevel;
        this.selfReportSessionTime = this.settings.selfReportSessionTime;
        if (this.apiLogLevel === undefined) {
            this.apiLogLevel = enums/* LogLevelEnum */.Mb.NONE;
        }
        this._loggingService = loggingService || getLoggingService();
        this._loggingService.setLogLevel(this.apiLogLevel);
        if (this.settings.onLogMessage) {
            this._loggingService.setLogHandler(this.settings.onLogMessage);
        }
        this._httpService =
            httpService || new HttpService(this.settings, this._error_codes);
        this._eventService =
            eventService || new EventService(this.apiLog.bind(this));
        this._serializationService =
            serializationService || new SerializationService();
        this._errorHandlingService =
            errorHandlingService ||
                createErrorHandlingService(this._error_codes, this.apiLog.bind(this), this.getLmsErrorMessageDetails.bind(this));
        this._cmiDataService =
            cmiDataService ||
                new CMIDataService(this._error_codes, this.apiLog.bind(this), this.throwSCORMError.bind(this), this.validateCorrectResponse.bind(this), this.getChildElement.bind(this), this._checkObjectHasProperty.bind(this), this._errorHandlingService);
    }
    Object.defineProperty(BaseAPI.prototype, "lastErrorCode", {
        get: function () {
            var _a, _b;
            return (_b = (_a = this._errorHandlingService) === null || _a === void 0 ? void 0 : _a.lastErrorCode) !== null && _b !== void 0 ? _b : "0";
        },
        set: function (errorCode) {
            if (this._errorHandlingService) {
                this._errorHandlingService.lastErrorCode = errorCode;
            }
        },
        enumerable: false,
        configurable: true
    });
    BaseAPI.prototype.commonReset = function (settings) {
        this.apiLog("reset", "Called", enums/* LogLevelEnum */.Mb.INFO);
        this.settings = (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, this.settings), settings);
        this.clearScheduledCommit();
        this.currentState = api_constants/* global_constants */._y.STATE_NOT_INITIALIZED;
        this.lastErrorCode = "0";
        this._eventService.reset();
        this.startingData = undefined;
    };
    BaseAPI.prototype.initialize = function (callbackName, initializeMessage, terminationMessage) {
        var returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
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
            this.currentState = api_constants/* global_constants */._y.STATE_INITIALIZED;
            this.lastErrorCode = "0";
            returnValue = api_constants/* global_constants */._y.SCORM_TRUE;
            this.processListeners(callbackName);
        }
        this.apiLog(callbackName, "returned: " + returnValue, enums/* LogLevelEnum */.Mb.INFO);
        this.clearSCORMError(returnValue);
        return returnValue;
    };
    BaseAPI.prototype.apiLog = function (functionName, logMessage, messageLevel, CMIElement) {
        logMessage = (0,utilities/* formatMessage */.hw)(functionName, logMessage, CMIElement);
        if (messageLevel >= this.apiLogLevel) {
            this._loggingService.log(messageLevel, logMessage);
            if (this.settings.onLogMessage &&
                this.settings.onLogMessage !==
                    this._loggingService["_logHandler"]) {
                this.settings.onLogMessage(messageLevel, logMessage);
            }
        }
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
            var _a, _b, _c;
            var previousSettings = this._settings;
            this._settings = (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, this._settings), settings);
            (_a = this._httpService) === null || _a === void 0 ? void 0 : _a.updateSettings(this._settings);
            if (settings.logLevel !== undefined &&
                settings.logLevel !== previousSettings.logLevel) {
                this.apiLogLevel = settings.logLevel;
                (_b = this._loggingService) === null || _b === void 0 ? void 0 : _b.setLogLevel(settings.logLevel);
            }
            if (settings.onLogMessage !== undefined &&
                settings.onLogMessage !== previousSettings.onLogMessage) {
                (_c = this._loggingService) === null || _c === void 0 ? void 0 : _c.setLogHandler(settings.onLogMessage);
            }
        },
        enumerable: false,
        configurable: true
    });
    BaseAPI.prototype.terminate = function (callbackName, checkTerminated) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function () {
            var returnValue, result;
            var _a, _b;
            return (0,tslib_es6/* __generator */.YH)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
                        if (!this.checkState(checkTerminated, this._error_codes.TERMINATION_BEFORE_INIT, this._error_codes.MULTIPLE_TERMINATION)) return [3, 2];
                        this.currentState = api_constants/* global_constants */._y.STATE_TERMINATED;
                        return [4, this.storeData(true)];
                    case 1:
                        result = _c.sent();
                        if (((_a = result.errorCode) !== null && _a !== void 0 ? _a : 0) > 0) {
                            this.throwSCORMError(result.errorCode);
                        }
                        returnValue = (_b = result === null || result === void 0 ? void 0 : result.result) !== null && _b !== void 0 ? _b : api_constants/* global_constants */._y.SCORM_FALSE;
                        if (checkTerminated)
                            this.lastErrorCode = "0";
                        returnValue = api_constants/* global_constants */._y.SCORM_TRUE;
                        this.processListeners(callbackName);
                        _c.label = 2;
                    case 2:
                        this.apiLog(callbackName, "returned: " + returnValue, enums/* LogLevelEnum */.Mb.INFO);
                        this.clearSCORMError(returnValue);
                        return [2, returnValue];
                }
            });
        });
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
        this.apiLog(callbackName, ": returned: " + returnValue, enums/* LogLevelEnum */.Mb.INFO, CMIElement);
        if (returnValue === undefined) {
            return "";
        }
        this.clearSCORMError(returnValue);
        return returnValue;
    };
    BaseAPI.prototype.setValue = function (callbackName, commitCallback, checkTerminated, CMIElement, value) {
        if (value !== undefined) {
            value = String(value);
        }
        var returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
        if (this.checkState(checkTerminated, this._error_codes.STORE_BEFORE_INIT, this._error_codes.STORE_AFTER_TERM)) {
            if (checkTerminated)
                this.lastErrorCode = "0";
            try {
                returnValue = this.setCMIValue(CMIElement, value);
            }
            catch (e) {
                returnValue = this.handleValueAccessException(e, returnValue);
            }
            this.processListeners(callbackName, CMIElement, value);
        }
        if (returnValue === undefined) {
            returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
        }
        if (String(this.lastErrorCode) === "0") {
            if (this.settings.autocommit) {
                this.scheduleCommit(this.settings.autocommitSeconds * 1000, commitCallback);
            }
        }
        this.apiLog(callbackName, ": " + value + ": result: " + returnValue, enums/* LogLevelEnum */.Mb.INFO, CMIElement);
        this.clearSCORMError(returnValue);
        return returnValue;
    };
    BaseAPI.prototype.commit = function (callbackName_1) {
        return (0,tslib_es6/* __awaiter */.sH)(this, arguments, void 0, function (callbackName, checkTerminated) {
            var returnValue, result;
            var _a, _b;
            if (checkTerminated === void 0) { checkTerminated = false; }
            return (0,tslib_es6/* __generator */.YH)(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.clearScheduledCommit();
                        returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
                        if (!this.checkState(checkTerminated, this._error_codes.COMMIT_BEFORE_INIT, this._error_codes.COMMIT_AFTER_TERM)) return [3, 2];
                        return [4, this.storeData(false)];
                    case 1:
                        result = _c.sent();
                        if (((_a = result.errorCode) !== null && _a !== void 0 ? _a : 0) > 0) {
                            this.throwSCORMError(result.errorCode);
                        }
                        returnValue = (_b = result === null || result === void 0 ? void 0 : result.result) !== null && _b !== void 0 ? _b : api_constants/* global_constants */._y.SCORM_FALSE;
                        this.apiLog(callbackName, " Result: " + returnValue, enums/* LogLevelEnum */.Mb.DEBUG, "HttpRequest");
                        if (checkTerminated)
                            this.lastErrorCode = "0";
                        this.processListeners(callbackName);
                        _c.label = 2;
                    case 2:
                        this.apiLog(callbackName, "returned: " + returnValue, enums/* LogLevelEnum */.Mb.INFO);
                        this.clearSCORMError(returnValue);
                        return [2, returnValue];
                }
            });
        });
    };
    BaseAPI.prototype.getLastError = function (callbackName) {
        var returnValue = String(this.lastErrorCode);
        this.processListeners(callbackName);
        this.apiLog(callbackName, "returned: " + returnValue, enums/* LogLevelEnum */.Mb.INFO);
        return returnValue;
    };
    BaseAPI.prototype.getErrorString = function (callbackName, CMIErrorCode) {
        var returnValue = "";
        if (CMIErrorCode !== null && CMIErrorCode !== "") {
            returnValue = this.getLmsErrorMessageDetails(CMIErrorCode);
            this.processListeners(callbackName);
        }
        this.apiLog(callbackName, "returned: " + returnValue, enums/* LogLevelEnum */.Mb.INFO);
        return returnValue;
    };
    BaseAPI.prototype.getDiagnostic = function (callbackName, CMIErrorCode) {
        var returnValue = "";
        if (CMIErrorCode !== null && CMIErrorCode !== "") {
            returnValue = this.getLmsErrorMessageDetails(CMIErrorCode, true);
            this.processListeners(callbackName);
        }
        this.apiLog(callbackName, "returned: " + returnValue, enums/* LogLevelEnum */.Mb.INFO);
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
        return this._cmiDataService.setCMIValue(this, methodName, scorm2004, CMIElement, value, this.isInitialized());
    };
    BaseAPI.prototype._commonGetCMIValue = function (methodName, scorm2004, CMIElement) {
        return this._cmiDataService.getCMIValue(this, methodName, scorm2004, CMIElement);
    };
    BaseAPI.prototype.isInitialized = function () {
        return this.currentState === api_constants/* global_constants */._y.STATE_INITIALIZED;
    };
    BaseAPI.prototype.isNotInitialized = function () {
        return this.currentState === api_constants/* global_constants */._y.STATE_NOT_INITIALIZED;
    };
    BaseAPI.prototype.isTerminated = function () {
        return this.currentState === api_constants/* global_constants */._y.STATE_TERMINATED;
    };
    BaseAPI.prototype.on = function (listenerName, callback) {
        this._eventService.on(listenerName, callback);
    };
    BaseAPI.prototype.off = function (listenerName, callback) {
        this._eventService.off(listenerName, callback);
    };
    BaseAPI.prototype.clear = function (listenerName) {
        this._eventService.clear(listenerName);
    };
    BaseAPI.prototype.processListeners = function (functionName, CMIElement, value) {
        this._eventService.processListeners(functionName, CMIElement, value);
    };
    BaseAPI.prototype.throwSCORMError = function (errorNumber, message) {
        this._errorHandlingService.throwSCORMError(errorNumber, message);
    };
    BaseAPI.prototype.clearSCORMError = function (success) {
        this._errorHandlingService.clearSCORMError(success);
    };
    BaseAPI.prototype.loadFromFlattenedJSON = function (json, CMIElement) {
        if (!CMIElement) {
            CMIElement = "";
        }
        this._serializationService.loadFromFlattenedJSON(json, CMIElement, this.loadFromJSON.bind(this), this.setCMIValue.bind(this), this.isNotInitialized.bind(this));
    };
    BaseAPI.prototype.loadFromJSON = function (json, CMIElement) {
        var _this = this;
        if (CMIElement === void 0) { CMIElement = ""; }
        this._serializationService.loadFromJSON(json, CMIElement, this.setCMIValue.bind(this), this.isNotInitialized.bind(this), function (data) {
            _this.startingData = data;
        });
    };
    BaseAPI.prototype.renderCMIToJSONString = function () {
        return this._serializationService.renderCMIToJSONString(this.cmi, this.settings.sendFullCommit);
    };
    BaseAPI.prototype.renderCMIToJSONObject = function () {
        return this._serializationService.renderCMIToJSONObject(this.cmi, this.settings.sendFullCommit);
    };
    BaseAPI.prototype.processHttpRequest = function (url_1, params_1) {
        return (0,tslib_es6/* __awaiter */.sH)(this, arguments, void 0, function (url, params, immediate) {
            if (immediate === void 0) { immediate = false; }
            return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                return [2, this._httpService.processHttpRequest(url, params, immediate, this.apiLog.bind(this), this.processListeners.bind(this))];
            });
        });
    };
    BaseAPI.prototype.scheduleCommit = function (when, callback) {
        if (!this._timeout) {
            this._timeout = new ScheduledCommit(this, when, callback);
            this.apiLog("scheduleCommit", "scheduled", enums/* LogLevelEnum */.Mb.DEBUG, "");
        }
    };
    BaseAPI.prototype.clearScheduledCommit = function () {
        if (this._timeout) {
            this._timeout.cancel();
            this._timeout = undefined;
            this.apiLog("clearScheduledCommit", "cleared", enums/* LogLevelEnum */.Mb.DEBUG, "");
        }
    };
    BaseAPI.prototype._checkObjectHasProperty = function (StringKeyMap, attribute) {
        return (Object.hasOwnProperty.call(StringKeyMap, attribute) ||
            Object.getOwnPropertyDescriptor(Object.getPrototypeOf(StringKeyMap), attribute) != null ||
            attribute in StringKeyMap);
    };
    BaseAPI.prototype.handleValueAccessException = function (e, returnValue) {
        return this._errorHandlingService.handleValueAccessException(e, returnValue);
    };
    BaseAPI.prototype.getCommitObject = function (terminateCommit) {
        return this._serializationService.getCommitObject(terminateCommit, this.settings.alwaysSendTotalTime, this.settings.renderCommonCommitFields, this.renderCommitObject.bind(this), this.renderCommitCMI.bind(this), this.apiLogLevel);
    };
    return BaseAPI;
}());
/* harmony default export */ var src_BaseAPI = (BaseAPI);


/***/ }),

/***/ 319:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   J: function() { return /* binding */ BaseCMI; },
/* harmony export */   r: function() { return /* binding */ BaseRootCMI; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);

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
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(BaseRootCMI, _super);
    function BaseRootCMI() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BaseRootCMI;
}(BaseCMI));



/***/ }),

/***/ 331:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: function() { return /* binding */ NAV; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(635);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(319);
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(915);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(417);




var NAV = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_3__/* .__extends */ .C6)(NAV, _super);
    function NAV() {
        var _this = _super.call(this) || this;
        _this._event = "";
        return _this;
    }
    NAV.prototype.reset = function () {
        this._event = "";
        this._initialized = false;
    };
    Object.defineProperty(NAV.prototype, "event", {
        get: function () {
            return this._event;
        },
        set: function (event) {
            if (event === "" || (0,_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(event, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.NAVEvent)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_0__/* .BaseCMI */ .J));



/***/ }),

/***/ 340:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BR: function() { return /* binding */ aicc_constants; },
/* harmony export */   QP: function() { return /* binding */ scorm12_constants; },
/* harmony export */   _y: function() { return /* binding */ global_constants; },
/* harmony export */   zR: function() { return /* binding */ scorm2004_constants; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);

var global_constants = {
    SCORM_TRUE: "true",
    SCORM_FALSE: "false",
    STATE_NOT_INITIALIZED: 0,
    STATE_INITIALIZED: 1,
    STATE_TERMINATED: 2,
};
var scorm12_constants = {
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
var aicc_constants = (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__assign */ .Cl)((0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__assign */ .Cl)({}, scorm12_constants), {
    cmi_children: "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions,evaluation",
    student_preference_children: "audio,language,lesson_type,speed,text,text_color,text_location,text_size,video,windows",
    student_data_children: "attempt_number,tries,mastery_score,max_time_allowed,time_limit_action",
    student_demographics_children: "city,class,company,country,experience,familiar_name,instructor_name,title,native_language,state,street_address,telephone,years_experience",
    tries_children: "time,status,score",
    attempt_records_children: "score,lesson_status",
    paths_children: "location_id,date,time,status,why_left,time_in_element",
});
var scorm2004_constants = {
    cmi_children: "_version,comments_from_learner,comments_from_lms,completion_status,credit,entry,exit,interactions,launch_data,learner_id,learner_name,learner_preference,location,max_time_allowed,mode,objectives,progress_measure,scaled_passing_score,score,session_time,success_status,suspend_data,time_limit_action,total_time",
    comments_children: "comment,timestamp,location",
    score_children: "max,raw,scaled,min",
    objectives_children: "progress_measure,completion_status,success_status,description,score,id",
    correct_responses_children: "pattern",
    student_data_children: "mastery_score,max_time_allowed,time_limit_action",
    student_preference_children: "audio_level,audio_captioning,delivery_speed,language",
    interactions_children: "id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description",
    adl_data_children: "id,store",
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


/***/ }),

/***/ 417:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   kS: function() { return /* binding */ scorm12_regex; },
/* harmony export */   rN: function() { return /* binding */ aicc_regex; },
/* harmony export */   xt: function() { return /* binding */ scorm2004_regex; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);

var scorm12_regex = {
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
var aicc_regex = (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__assign */ .Cl)((0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__assign */ .Cl)({}, scorm12_regex), {
    CMIIdentifier: "^\\w{1,255}$",
});
var scorm2004_regex = {
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
    NAVEvent: "^(previous|continue|exit|exitAll|abandon|abandonAll|suspendAll|_none_|(\\{target=(?<choice_target>\\S{0,}[a-zA-Z0-9-_]+)})?choice|(\\{target=(?<jump_target>\\S{0,}[a-zA-Z0-9-_]+)})?jump)$",
    NAVBoolean: "^(unknown|true|false$)",
    NAVTarget: "^{target=\\S{0,}[a-zA-Z0-9-_]+}$",
    scaled_range: "-1#1",
    audio_range: "0#*",
    speed_range: "0#*",
    text_range: "-1#1",
    progress_range: "0#1",
};


/***/ }),

/***/ 434:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: function() { return /* binding */ CMIScore; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(635);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(340);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(417);
/* harmony import */ var _base_cmi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(319);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(797);
/* harmony import */ var _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(819);






var CMIScore = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_5__/* .__extends */ .C6)(CMIScore, _super);
    function CMIScore(params) {
        var _this = _super.call(this) || this;
        _this._raw = "";
        _this._min = "";
        _this.__children = params.score_children || _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__/* .scorm12_constants */ .QP.score_children;
        _this.__score_range = !params.score_range
            ? false
            : _constants_regex__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_regex */ .kS.score_range;
        _this._max = params.max || params.max === "" ? params.max : "100";
        _this.__invalid_error_code =
            params.invalidErrorCode || _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.INVALID_SET_VALUE;
        _this.__invalid_type_code =
            params.invalidTypeCode || _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.TYPE_MISMATCH;
        _this.__invalid_range_code =
            params.invalidRangeCode || _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.VALUE_OUT_OF_RANGE;
        _this.__decimal_regex = params.decimalRegex || _constants_regex__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_regex */ .kS.CMIDecimal;
        _this.__error_class = params.errorClass;
        return _this;
    }
    CMIScore.prototype.reset = function () {
        this._initialized = false;
    };
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScore(raw, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScore(min, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScore(max, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class)) {
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
}(_base_cmi__WEBPACK_IMPORTED_MODULE_2__/* .BaseCMI */ .J));



/***/ }),

/***/ 449:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: function() { return /* binding */ checkValidRange; },
/* harmony export */   q: function() { return /* binding */ checkValidFormat; }
/* harmony export */ });
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(864);

var checkValidFormat = (0,_utilities__WEBPACK_IMPORTED_MODULE_0__/* .memoize */ .Bj)(function (value, regexPattern, errorCode, errorClass, allowEmptyString) {
    if (typeof value !== "string") {
        return false;
    }
    var formatRegex = new RegExp(regexPattern);
    var matches = value.match(formatRegex);
    if (allowEmptyString && value === "") {
        return true;
    }
    if (value === undefined || !matches || matches[0] === "") {
        throw new errorClass(errorCode);
    }
    return true;
}, function (value, regexPattern, errorCode, _errorClass, allowEmptyString) {
    return "".concat(value, ":").concat(regexPattern, ":").concat(errorCode, ":").concat(allowEmptyString || false);
});
var checkValidRange = (0,_utilities__WEBPACK_IMPORTED_MODULE_0__/* .memoize */ .Bj)(function (value, rangePattern, errorCode, errorClass) {
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
}, function (value, rangePattern, errorCode, _errorClass) {
    return "".concat(value, ":").concat(rangePattern, ":").concat(errorCode);
});


/***/ }),

/***/ 532:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X: function() { return /* binding */ CMIStudentData; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(635);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(319);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(340);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(179);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(797);
/* harmony import */ var _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(819);






var CMIStudentData = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_5__/* .__extends */ .C6)(CMIStudentData, _super);
    function CMIStudentData(student_data_children) {
        var _this = _super.call(this) || this;
        _this._mastery_score = "";
        _this._max_time_allowed = "";
        _this._time_limit_action = "";
        _this.__children = student_data_children
            ? student_data_children
            : _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.student_data_children;
        return _this;
    }
    CMIStudentData.prototype.reset = function () {
        this._initialized = false;
    };
    Object.defineProperty(CMIStudentData.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentData.prototype, "mastery_score", {
        get: function () {
            return this._mastery_score;
        },
        set: function (mastery_score) {
            _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateReadOnly(this.initialized);
            this._mastery_score = mastery_score;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentData.prototype, "max_time_allowed", {
        get: function () {
            return this._max_time_allowed;
        },
        set: function (max_time_allowed) {
            _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateReadOnly(this.initialized);
            this._max_time_allowed = max_time_allowed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentData.prototype, "time_limit_action", {
        get: function () {
            return this._time_limit_action;
        },
        set: function (time_limit_action) {
            _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateReadOnly(this.initialized);
            this._time_limit_action = time_limit_action;
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_0__/* .BaseCMI */ .J));



/***/ }),

/***/ 589:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: function() { return /* binding */ CMIArray; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(635);
/* harmony import */ var _base_cmi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(319);
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(784);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(797);




var CMIArray = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_3__/* .__extends */ .C6)(CMIArray, _super);
    function CMIArray(params) {
        var _this = _super.call(this) || this;
        _this.__children = params.children;
        _this._errorCode = params.errorCode || _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.GENERAL;
        _this._errorClass = params.errorClass || _exceptions__WEBPACK_IMPORTED_MODULE_1__/* .BaseScormValidationError */ .$;
        _this.childArray = [];
        return _this;
    }
    CMIArray.prototype.reset = function (wipe) {
        if (wipe === void 0) { wipe = false; }
        this._initialized = false;
        if (wipe) {
            this.childArray = [];
        }
        else {
            for (var i = 0; i < this.childArray.length; i++) {
                this.childArray[i].reset();
            }
        }
    };
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
}(_base_cmi__WEBPACK_IMPORTED_MODULE_0__/* .BaseCMI */ .J));



/***/ }),

/***/ 635:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C6: function() { return /* binding */ __extends; },
/* harmony export */   Cl: function() { return /* binding */ __assign; },
/* harmony export */   YH: function() { return /* binding */ __generator; },
/* harmony export */   sH: function() { return /* binding */ __awaiter; }
/* harmony export */ });
/* unused harmony exports __rest, __decorate, __param, __esDecorate, __runInitializers, __propKey, __setFunctionName, __metadata, __createBinding, __exportStar, __values, __read, __spread, __spreadArrays, __spreadArray, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault, __classPrivateFieldGet, __classPrivateFieldSet, __classPrivateFieldIn, __addDisposableResource, __disposeResources */
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

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ({
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


/***/ }),

/***/ 784:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: function() { return /* binding */ BaseScormValidationError; },
/* harmony export */   y: function() { return /* binding */ ValidationError; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);

var BaseScormValidationError = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(BaseScormValidationError, _super);
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
    return BaseScormValidationError;
}(Error));

var ValidationError = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(ValidationError, _super);
    function ValidationError(errorCode, errorMessage, detailedMessage) {
        var _this = _super.call(this, errorCode) || this;
        _this._detailedMessage = "";
        _this.message = errorMessage;
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



/***/ }),

/***/ 797:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Rf: function() { return /* binding */ scorm2004_errors; },
/* harmony export */   Se: function() { return /* binding */ scorm12_errors; }
/* harmony export */ });
/* unused harmony export global_errors */
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);

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
    DEPENDENCY_NOT_ESTABLISHED: 101,
};
var scorm12_errors = (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__assign */ .Cl)((0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__assign */ .Cl)({}, global_errors), { RETRIEVE_BEFORE_INIT: 301, STORE_BEFORE_INIT: 301, COMMIT_BEFORE_INIT: 301, ARGUMENT_ERROR: 201, CHILDREN_ERROR: 202, COUNT_ERROR: 203, UNDEFINED_DATA_MODEL: 401, UNIMPLEMENTED_ELEMENT: 401, VALUE_NOT_INITIALIZED: 301, INVALID_SET_VALUE: 402, READ_ONLY_ELEMENT: 403, WRITE_ONLY_ELEMENT: 404, TYPE_MISMATCH: 405, VALUE_OUT_OF_RANGE: 407, DEPENDENCY_NOT_ESTABLISHED: 408 });
var scorm2004_errors = (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__assign */ .Cl)((0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__assign */ .Cl)({}, global_errors), { INITIALIZATION_FAILED: 102, INITIALIZED: 103, TERMINATED: 104, TERMINATION_FAILURE: 111, TERMINATION_BEFORE_INIT: 112, MULTIPLE_TERMINATIONS: 113, RETRIEVE_BEFORE_INIT: 122, RETRIEVE_AFTER_TERM: 123, STORE_BEFORE_INIT: 132, STORE_AFTER_TERM: 133, COMMIT_BEFORE_INIT: 142, COMMIT_AFTER_TERM: 143, ARGUMENT_ERROR: 201, GENERAL_GET_FAILURE: 301, GENERAL_SET_FAILURE: 351, GENERAL_COMMIT_FAILURE: 391, UNDEFINED_DATA_MODEL: 401, UNIMPLEMENTED_ELEMENT: 402, VALUE_NOT_INITIALIZED: 403, READ_ONLY_ELEMENT: 404, WRITE_ONLY_ELEMENT: 405, TYPE_MISMATCH: 406, VALUE_OUT_OF_RANGE: 407, DEPENDENCY_NOT_ESTABLISHED: 408 });


/***/ }),

/***/ 819:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: function() { return /* binding */ validationService; }
/* harmony export */ });
/* unused harmony export ValidationService */
/* harmony import */ var _cmi_common_validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(449);
/* harmony import */ var _cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(915);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(417);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(797);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(179);





var ValidationService = (function () {
    function ValidationService() {
    }
    ValidationService.prototype.validateScore = function (value, decimalRegex, scoreRange, invalidTypeCode, invalidRangeCode, errorClass) {
        return ((0,_cmi_common_validation__WEBPACK_IMPORTED_MODULE_0__/* .checkValidFormat */ .q)(value, decimalRegex, invalidTypeCode, errorClass) &&
            (!scoreRange ||
                (0,_cmi_common_validation__WEBPACK_IMPORTED_MODULE_0__/* .checkValidRange */ .W)(value, scoreRange, invalidRangeCode, errorClass)));
    };
    ValidationService.prototype.validateScorm12Audio = function (value) {
        return ((0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.CMISInteger) &&
            (0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidRange */ .h)(value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.audio_range));
    };
    ValidationService.prototype.validateScorm12Language = function (value) {
        return (0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.CMIString256);
    };
    ValidationService.prototype.validateScorm12Speed = function (value) {
        return ((0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.CMISInteger) &&
            (0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidRange */ .h)(value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.speed_range));
    };
    ValidationService.prototype.validateScorm12Text = function (value) {
        return ((0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.CMISInteger) &&
            (0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidRange */ .h)(value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.text_range));
    };
    ValidationService.prototype.validateReadOnly = function (initialized) {
        if (initialized) {
            throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_4__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.READ_ONLY_ELEMENT);
        }
    };
    return ValidationService;
}());

var validationService = new ValidationService();


/***/ }),

/***/ 833:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Oh: function() { return /* binding */ CMIInteractionsObjectivesObject; },
/* harmony export */   WP: function() { return /* binding */ CMIInteractionsObject; },
/* harmony export */   Xb: function() { return /* binding */ CMIInteractions; },
/* harmony export */   cb: function() { return /* binding */ CMIInteractionsCorrectResponsesObject; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(635);
/* harmony import */ var _common_array__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(589);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(340);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(797);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(179);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(319);
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(915);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(417);








var CMIInteractions = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_7__/* .__extends */ .C6)(CMIInteractions, _super);
    function CMIInteractions() {
        return _super.call(this, {
            children: _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.interactions_children,
            errorCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.INVALID_SET_VALUE,
            errorClass: _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t,
        }) || this;
    }
    return CMIInteractions;
}(_common_array__WEBPACK_IMPORTED_MODULE_0__/* .CMIArray */ .B));

var CMIInteractionsObject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_7__/* .__extends */ .C6)(CMIInteractionsObject, _super);
    function CMIInteractionsObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        _this._time = "";
        _this._type = "";
        _this._weighting = "";
        _this._student_response = "";
        _this._result = "";
        _this._latency = "";
        _this.objectives = new _common_array__WEBPACK_IMPORTED_MODULE_0__/* .CMIArray */ .B({
            errorCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.INVALID_SET_VALUE,
            errorClass: _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t,
            children: _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.objectives_children,
        });
        _this.correct_responses = new _common_array__WEBPACK_IMPORTED_MODULE_0__/* .CMIArray */ .B({
            errorCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.INVALID_SET_VALUE,
            errorClass: _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t,
            children: _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.correct_responses_children,
        });
        return _this;
    }
    CMIInteractionsObject.prototype.initialize = function () {
        var _a, _b;
        _super.prototype.initialize.call(this);
        (_a = this.objectives) === null || _a === void 0 ? void 0 : _a.initialize();
        (_b = this.correct_responses) === null || _b === void 0 ? void 0 : _b.initialize();
    };
    CMIInteractionsObject.prototype.reset = function () {
        var _a, _b;
        this._initialized = false;
        this._id = "";
        this._time = "";
        this._type = "";
        this._weighting = "";
        this._student_response = "";
        this._result = "";
        this._latency = "";
        (_a = this.objectives) === null || _a === void 0 ? void 0 : _a.reset();
        (_b = this.correct_responses) === null || _b === void 0 ? void 0 : _b.reset();
    };
    Object.defineProperty(CMIInteractionsObject.prototype, "id", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._id;
        },
        set: function (id) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(id, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIIdentifier)) {
                this._id = id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "time", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._time;
        },
        set: function (time) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(time, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMITime)) {
                this._time = time;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "type", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._type;
        },
        set: function (type) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(type, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIType)) {
                this._type = type;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "weighting", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._weighting;
        },
        set: function (weighting) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(weighting, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIDecimal) &&
                (0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidRange */ .h)(weighting, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.weighting_range)) {
                this._weighting = weighting;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "student_response", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._student_response;
        },
        set: function (student_response) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(student_response, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIFeedback, true)) {
                this._student_response = student_response;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "result", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._result;
        },
        set: function (result) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(result, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIResult)) {
                this._result = result;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "latency", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._latency;
        },
        set: function (latency) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(latency, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMITimespan)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_4__/* .BaseCMI */ .J));

var CMIInteractionsObjectivesObject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_7__/* .__extends */ .C6)(CMIInteractionsObjectivesObject, _super);
    function CMIInteractionsObjectivesObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        return _this;
    }
    CMIInteractionsObjectivesObject.prototype.reset = function () {
        this._initialized = false;
        this._id = "";
    };
    Object.defineProperty(CMIInteractionsObjectivesObject.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(id, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIIdentifier)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_4__/* .BaseCMI */ .J));

var CMIInteractionsCorrectResponsesObject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_7__/* .__extends */ .C6)(CMIInteractionsCorrectResponsesObject, _super);
    function CMIInteractionsCorrectResponsesObject() {
        var _this = _super.call(this) || this;
        _this._pattern = "";
        return _this;
    }
    CMIInteractionsCorrectResponsesObject.prototype.reset = function () {
        this._initialized = false;
        this._pattern = "";
    };
    Object.defineProperty(CMIInteractionsCorrectResponsesObject.prototype, "pattern", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._pattern;
        },
        set: function (pattern) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(pattern, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIFeedback, true)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_4__/* .BaseCMI */ .J));



/***/ }),

/***/ 864:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $o: function() { return /* binding */ addTwoDurations; },
/* harmony export */   Bj: function() { return /* binding */ memoize; },
/* harmony export */   Bq: function() { return /* binding */ flatten; },
/* harmony export */   HT: function() { return /* binding */ addHHMMSSTimeStrings; },
/* harmony export */   J6: function() { return /* binding */ stringMatches; },
/* harmony export */   OI: function() { return /* binding */ getDurationAsSeconds; },
/* harmony export */   UZ: function() { return /* binding */ getSecondsAsHHMMSS; },
/* harmony export */   f4: function() { return /* binding */ getTimeAsSeconds; },
/* harmony export */   hw: function() { return /* binding */ formatMessage; },
/* harmony export */   sB: function() { return /* binding */ unflatten; },
/* harmony export */   xE: function() { return /* binding */ getSecondsAsISODuration; }
/* harmony export */ });
/* unused harmony exports SECONDS_PER_SECOND, SECONDS_PER_MINUTE, SECONDS_PER_HOUR, SECONDS_PER_DAY, countDecimals */
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
var getSecondsAsHHMMSS = memoize(function (totalSeconds) {
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
});
var getSecondsAsISODuration = memoize(function (seconds) {
    if (!seconds || seconds <= 0) {
        return "PT0S";
    }
    var duration = "P";
    var remainder = seconds;
    var designationEntries = Object.entries(designations);
    designationEntries.forEach(function (_a) {
        var designationsKey = _a[0], current_seconds = _a[1];
        var value = Math.floor(remainder / current_seconds);
        remainder = remainder % current_seconds;
        if (countDecimals(remainder) > 2) {
            remainder = Number(Number(remainder).toFixed(2));
        }
        if (designationsKey === "S" && remainder > 0) {
            value += remainder;
        }
        if (value) {
            var needsTimeSeparator = (duration.indexOf("D") > 0 ||
                ["H", "M", "S"].includes(designationsKey)) &&
                duration.indexOf("T") === -1;
            if (needsTimeSeparator) {
                duration += "T";
            }
            duration += "".concat(value).concat(designationsKey);
        }
    });
    return duration;
});
var getTimeAsSeconds = memoize(function (timeString, timeRegex) {
    var _a;
    if (typeof timeString === "number" || typeof timeString === "boolean") {
        timeString = String(timeString);
    }
    if (typeof timeRegex === "string") {
        timeRegex = new RegExp(timeRegex);
    }
    if (!timeString || !((_a = timeString === null || timeString === void 0 ? void 0 : timeString.match) === null || _a === void 0 ? void 0 : _a.call(timeString, timeRegex))) {
        return 0;
    }
    var parts = timeString.split(":");
    var hours = Number(parts[0]);
    var minutes = Number(parts[1]);
    var seconds = Number(parts[2]);
    return hours * 3600 + minutes * 60 + seconds;
}, function (timeString, timeRegex) {
    var _a;
    var timeStr = typeof timeString === "string" ? timeString : String(timeString !== null && timeString !== void 0 ? timeString : "");
    var regexStr = typeof timeRegex === "string" ? timeRegex : ((_a = timeRegex === null || timeRegex === void 0 ? void 0 : timeRegex.toString()) !== null && _a !== void 0 ? _a : "");
    return "".concat(timeStr, ":").concat(regexStr);
});
var getDurationAsSeconds = memoize(function (duration, durationRegex) {
    var _a, _b, _c, _d;
    if (typeof durationRegex === "string") {
        durationRegex = new RegExp(durationRegex);
    }
    if (!duration || !((_a = duration === null || duration === void 0 ? void 0 : duration.match) === null || _a === void 0 ? void 0 : _a.call(duration, durationRegex))) {
        return 0;
    }
    var _e = (_d = (_c = (_b = new RegExp(durationRegex)).exec) === null || _c === void 0 ? void 0 : _c.call(_b, duration)) !== null && _d !== void 0 ? _d : [], years = _e[1], _ = _e[2], days = _e[4], hours = _e[5], minutes = _e[6], seconds = _e[7];
    var result = 0.0;
    result += Number(seconds) || 0.0;
    result += Number(minutes) * 60.0 || 0.0;
    result += Number(hours) * 3600.0 || 0.0;
    result += Number(days) * (60 * 60 * 24.0) || 0.0;
    result += Number(years) * (60 * 60 * 24 * 365.0) || 0.0;
    return result;
}, function (duration, durationRegex) {
    var _a;
    var durationStr = duration !== null && duration !== void 0 ? duration : "";
    var regexStr = typeof durationRegex === "string"
        ? durationRegex
        : ((_a = durationRegex === null || durationRegex === void 0 ? void 0 : durationRegex.toString()) !== null && _a !== void 0 ? _a : "");
    return "".concat(durationStr, ":").concat(regexStr);
});
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
            cur.forEach(function (item, i) {
                recurse(item, "".concat(prop, "[").concat(i, "]"));
            });
            if (cur.length === 0)
                result[prop] = [];
        }
        else {
            var keys = Object.keys(cur).filter(function (p) {
                return Object.prototype.hasOwnProperty.call(cur, p);
            });
            var isEmpty = keys.length === 0;
            keys.forEach(function (p) {
                recurse(cur[p], prop ? "".concat(prop, ".").concat(p) : p);
            });
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}
function unflatten(data) {
    "use strict";
    var _a;
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var result = {};
    var pattern = /\.?([^.[\]]+)|\[(\d+)]/g;
    Object.keys(data)
        .filter(function (p) { return Object.prototype.hasOwnProperty.call(data, p); })
        .forEach(function (p) {
        var _a, _b;
        var cur = result;
        var prop = "";
        var regex = new RegExp(pattern);
        Array.from({ length: (_b = (_a = p.match(new RegExp(pattern, "g"))) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 }, function () { return regex.exec(p); }).forEach(function (m) {
            var _a;
            if (m) {
                cur = ((_a = cur[prop]) !== null && _a !== void 0 ? _a : (cur[prop] = m[2] ? [] : {}));
                prop = m[2] || m[1];
            }
        });
        cur[prop] = data[p];
    });
    return ((_a = result[""]) !== null && _a !== void 0 ? _a : result);
}
function countDecimals(num) {
    var _a, _b, _c, _d;
    if (Math.floor(num) === num || ((_b = (_a = String(num)) === null || _a === void 0 ? void 0 : _a.indexOf) === null || _b === void 0 ? void 0 : _b.call(_a, ".")) < 0)
        return 0;
    var parts = (_c = num.toString().split(".")) === null || _c === void 0 ? void 0 : _c[1];
    return (_d = parts === null || parts === void 0 ? void 0 : parts.length) !== null && _d !== void 0 ? _d : 0;
}
function formatMessage(functionName, message, CMIElement) {
    var baseLength = 20;
    var paddedFunction = functionName.padEnd(baseLength);
    var messageString = "".concat(paddedFunction, ": ");
    if (CMIElement) {
        var CMIElementBaseLength = 70;
        messageString += CMIElement;
        messageString = messageString.padEnd(CMIElementBaseLength);
    }
    messageString += message !== null && message !== void 0 ? message : "";
    return messageString;
}
function stringMatches(str, tester) {
    return (str === null || str === void 0 ? void 0 : str.match(tester)) !== null;
}
function memoize(fn, keyFn) {
    var cache = new Map();
    return (function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var key = keyFn ? keyFn.apply(void 0, args) : JSON.stringify(args);
        return cache.has(key)
            ? cache.get(key)
            : (function () {
                var result = fn.apply(void 0, args);
                cache.set(key, result);
                return result;
            })();
    });
}


/***/ }),

/***/ 915:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: function() { return /* binding */ check12ValidRange; },
/* harmony export */   p: function() { return /* binding */ check12ValidFormat; }
/* harmony export */ });
/* harmony import */ var _common_validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(449);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(797);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(179);



function check12ValidFormat(value, regexPattern, allowEmptyString) {
    return (0,_common_validation__WEBPACK_IMPORTED_MODULE_0__/* .checkValidFormat */ .q)(value, regexPattern, _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_errors */ .Se.TYPE_MISMATCH, _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t, allowEmptyString);
}
function check12ValidRange(value, rangePattern, allowEmptyString) {
    if (!allowEmptyString && value === "") {
        throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t(_constants_error_codes__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_errors */ .Se.VALUE_OUT_OF_RANGE);
    }
    return (0,_common_validation__WEBPACK_IMPORTED_MODULE_0__/* .checkValidRange */ .W)(value, rangePattern, _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_errors */ .Se.VALUE_OUT_OF_RANGE, _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t);
}


/***/ }),

/***/ 916:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  j: function() { return /* binding */ AICCImpl; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(635);
// EXTERNAL MODULE: ./src/Scorm12API.ts
var Scorm12API = __webpack_require__(941);
// EXTERNAL MODULE: ./src/cmi/scorm12/cmi.ts + 1 modules
var cmi = __webpack_require__(989);
// EXTERNAL MODULE: ./src/constants/api_constants.ts
var api_constants = __webpack_require__(340);
// EXTERNAL MODULE: ./src/cmi/common/array.ts
var array = __webpack_require__(589);
// EXTERNAL MODULE: ./src/exceptions.ts
var exceptions = __webpack_require__(784);
;// ./src/exceptions/aicc_exceptions.ts



var aicc_errors = api_constants/* aicc_constants */.BR.error_descriptions;
var AICCValidationError = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(AICCValidationError, _super);
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
}(exceptions/* ValidationError */.y));


// EXTERNAL MODULE: ./src/cmi/common/base_cmi.ts
var base_cmi = __webpack_require__(319);
// EXTERNAL MODULE: ./src/constants/error_codes.ts
var error_codes = __webpack_require__(797);
// EXTERNAL MODULE: ./src/cmi/common/validation.ts
var validation = __webpack_require__(449);
;// ./src/cmi/aicc/validation.ts



function checkAICCValidFormat(value, regexPattern, allowEmptyString) {
    return (0,validation/* checkValidFormat */.q)(value, regexPattern, error_codes/* scorm12_errors */.Se.TYPE_MISMATCH, AICCValidationError, allowEmptyString);
}

// EXTERNAL MODULE: ./src/constants/regex.ts
var regex = __webpack_require__(417);
;// ./src/cmi/aicc/evaluation.ts








var CMIEvaluation = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIEvaluation, _super);
    function CMIEvaluation() {
        var _this = _super.call(this) || this;
        _this.comments = new CMIEvaluationComments();
        return _this;
    }
    CMIEvaluation.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        (_a = this.comments) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    CMIEvaluation.prototype.reset = function () {
        var _a;
        this._initialized = false;
        (_a = this.comments) === null || _a === void 0 ? void 0 : _a.reset();
    };
    CMIEvaluation.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            comments: this.comments,
        };
        delete this.jsonString;
        return result;
    };
    return CMIEvaluation;
}(base_cmi/* BaseCMI */.J));

var CMIEvaluationComments = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIEvaluationComments, _super);
    function CMIEvaluationComments() {
        return _super.call(this, {
            children: api_constants/* aicc_constants */.BR.comments_children,
            errorCode: error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE,
            errorClass: AICCValidationError,
        }) || this;
    }
    return CMIEvaluationComments;
}(array/* CMIArray */.B));
var CMIEvaluationCommentsObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIEvaluationCommentsObject, _super);
    function CMIEvaluationCommentsObject() {
        var _this = _super.call(this) || this;
        _this._content = "";
        _this._location = "";
        _this._time = "";
        return _this;
    }
    CMIEvaluationCommentsObject.prototype.reset = function () {
        this._initialized = false;
        this._content = "";
        this._location = "";
        this._time = "";
    };
    Object.defineProperty(CMIEvaluationCommentsObject.prototype, "content", {
        get: function () {
            return this._content;
        },
        set: function (content) {
            if (checkAICCValidFormat(content, regex/* aicc_regex */.rN.CMIString256)) {
                this._content = content;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIEvaluationCommentsObject.prototype, "location", {
        get: function () {
            return this._location;
        },
        set: function (location) {
            if (checkAICCValidFormat(location, regex/* aicc_regex */.rN.CMIString256)) {
                this._location = location;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIEvaluationCommentsObject.prototype, "time", {
        get: function () {
            return this._time;
        },
        set: function (time) {
            if (checkAICCValidFormat(time, regex/* aicc_regex */.rN.CMITime)) {
                this._time = time;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIEvaluationCommentsObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            content: this.content,
            location: this.location,
            time: this.time,
        };
        delete this.jsonString;
        return result;
    };
    return CMIEvaluationCommentsObject;
}(base_cmi/* BaseCMI */.J));


// EXTERNAL MODULE: ./src/cmi/scorm12/student_preference.ts
var student_preference = __webpack_require__(181);
;// ./src/cmi/aicc/student_preferences.ts








var AICCStudentPreferences = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(AICCStudentPreferences, _super);
    function AICCStudentPreferences() {
        var _this = _super.call(this, api_constants/* aicc_constants */.BR.student_preference_children) || this;
        _this._lesson_type = "";
        _this._text_color = "";
        _this._text_location = "";
        _this._text_size = "";
        _this._video = "";
        _this.windows = new array/* CMIArray */.B({
            errorCode: error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE,
            errorClass: AICCValidationError,
            children: "",
        });
        return _this;
    }
    AICCStudentPreferences.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        (_a = this.windows) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    Object.defineProperty(AICCStudentPreferences.prototype, "lesson_type", {
        get: function () {
            return this._lesson_type;
        },
        set: function (lesson_type) {
            if (checkAICCValidFormat(lesson_type, regex/* aicc_regex */.rN.CMIString256)) {
                this._lesson_type = lesson_type;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AICCStudentPreferences.prototype, "text_color", {
        get: function () {
            return this._text_color;
        },
        set: function (text_color) {
            if (checkAICCValidFormat(text_color, regex/* aicc_regex */.rN.CMIString256)) {
                this._text_color = text_color;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AICCStudentPreferences.prototype, "text_location", {
        get: function () {
            return this._text_location;
        },
        set: function (text_location) {
            if (checkAICCValidFormat(text_location, regex/* aicc_regex */.rN.CMIString256)) {
                this._text_location = text_location;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AICCStudentPreferences.prototype, "text_size", {
        get: function () {
            return this._text_size;
        },
        set: function (text_size) {
            if (checkAICCValidFormat(text_size, regex/* aicc_regex */.rN.CMIString256)) {
                this._text_size = text_size;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AICCStudentPreferences.prototype, "video", {
        get: function () {
            return this._video;
        },
        set: function (video) {
            if (checkAICCValidFormat(video, regex/* aicc_regex */.rN.CMIString256)) {
                this._video = video;
            }
        },
        enumerable: false,
        configurable: true
    });
    AICCStudentPreferences.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            audio: this.audio,
            language: this.language,
            lesson_type: this.lesson_type,
            speed: this.speed,
            text: this.text,
            text_color: this.text_color,
            text_location: this.text_location,
            text_size: this.text_size,
            video: this.video,
            windows: this.windows,
        };
        delete this.jsonString;
        return result;
    };
    return AICCStudentPreferences;
}(student_preference/* CMIStudentPreference */.G));


;// ./src/cmi/aicc/student_demographics.ts





var CMIStudentDemographics = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIStudentDemographics, _super);
    function CMIStudentDemographics() {
        var _this = _super.call(this) || this;
        _this.__children = api_constants/* aicc_constants */.BR.student_demographics_children;
        _this._city = "";
        _this._class = "";
        _this._company = "";
        _this._country = "";
        _this._experience = "";
        _this._familiar_name = "";
        _this._instructor_name = "";
        _this._title = "";
        _this._native_language = "";
        _this._state = "";
        _this._street_address = "";
        _this._telephone = "";
        _this._years_experience = "";
        return _this;
    }
    CMIStudentDemographics.prototype.reset = function () {
        this._initialized = false;
    };
    Object.defineProperty(CMIStudentDemographics.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "city", {
        get: function () {
            return this._city;
        },
        set: function (city) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._city = city;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "class", {
        get: function () {
            return this._class;
        },
        set: function (clazz) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._class = clazz;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "company", {
        get: function () {
            return this._company;
        },
        set: function (company) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._company = company;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "country", {
        get: function () {
            return this._country;
        },
        set: function (country) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._country = country;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "experience", {
        get: function () {
            return this._experience;
        },
        set: function (experience) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._experience = experience;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "familiar_name", {
        get: function () {
            return this._familiar_name;
        },
        set: function (familiar_name) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._familiar_name = familiar_name;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "instructor_name", {
        get: function () {
            return this._instructor_name;
        },
        set: function (instructor_name) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._instructor_name = instructor_name;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (title) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._title = title;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "native_language", {
        get: function () {
            return this._native_language;
        },
        set: function (native_language) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._native_language = native_language;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (state) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._state = state;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "street_address", {
        get: function () {
            return this._street_address;
        },
        set: function (street_address) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._street_address = street_address;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "telephone", {
        get: function () {
            return this._telephone;
        },
        set: function (telephone) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._telephone = telephone;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentDemographics.prototype, "years_experience", {
        get: function () {
            return this._years_experience;
        },
        set: function (years_experience) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._years_experience = years_experience;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIStudentDemographics.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            city: this.city,
            class: this.class,
            company: this.company,
            country: this.country,
            experience: this.experience,
            familiar_name: this.familiar_name,
            instructor_name: this.instructor_name,
            title: this.title,
            native_language: this.native_language,
            state: this.state,
            street_address: this.street_address,
            telephone: this.telephone,
            years_experience: this.years_experience,
        };
        delete this.jsonString;
        return result;
    };
    return CMIStudentDemographics;
}(base_cmi/* BaseCMI */.J));


// EXTERNAL MODULE: ./src/cmi/common/score.ts
var score = __webpack_require__(434);
;// ./src/cmi/aicc/tries.ts









var CMITries = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMITries, _super);
    function CMITries() {
        return _super.call(this, {
            children: api_constants/* aicc_constants */.BR.tries_children,
        }) || this;
    }
    return CMITries;
}(array/* CMIArray */.B));

var CMITriesObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMITriesObject, _super);
    function CMITriesObject() {
        var _this = _super.call(this) || this;
        _this._status = "";
        _this._time = "";
        _this.score = new score/* CMIScore */._({
            score_children: api_constants/* aicc_constants */.BR.score_children,
            score_range: regex/* aicc_regex */.rN.score_range,
            invalidErrorCode: error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE,
            invalidTypeCode: error_codes/* scorm12_errors */.Se.TYPE_MISMATCH,
            invalidRangeCode: error_codes/* scorm12_errors */.Se.VALUE_OUT_OF_RANGE,
            errorClass: AICCValidationError,
        });
        return _this;
    }
    CMITriesObject.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        (_a = this.score) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    CMITriesObject.prototype.reset = function () {
        var _a;
        this._initialized = false;
        this._status = "";
        this._time = "";
        (_a = this.score) === null || _a === void 0 ? void 0 : _a.reset();
    };
    Object.defineProperty(CMITriesObject.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            if (checkAICCValidFormat(status, regex/* aicc_regex */.rN.CMIStatus2)) {
                this._status = status;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMITriesObject.prototype, "time", {
        get: function () {
            return this._time;
        },
        set: function (time) {
            if (checkAICCValidFormat(time, regex/* aicc_regex */.rN.CMITime)) {
                this._time = time;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMITriesObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            status: this.status,
            time: this.time,
            score: this.score,
        };
        delete this.jsonString;
        return result;
    };
    return CMITriesObject;
}(base_cmi/* BaseCMI */.J));


// EXTERNAL MODULE: ./src/cmi/scorm12/student_data.ts
var student_data = __webpack_require__(532);
;// ./src/cmi/aicc/attempts.ts









var CMIAttemptRecords = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIAttemptRecords, _super);
    function CMIAttemptRecords() {
        return _super.call(this, {
            children: api_constants/* aicc_constants */.BR.attempt_records_children,
        }) || this;
    }
    return CMIAttemptRecords;
}(array/* CMIArray */.B));

var CMIAttemptRecordsObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIAttemptRecordsObject, _super);
    function CMIAttemptRecordsObject() {
        var _this = _super.call(this) || this;
        _this._lesson_status = "";
        _this.score = new score/* CMIScore */._({
            score_children: api_constants/* aicc_constants */.BR.score_children,
            score_range: regex/* aicc_regex */.rN.score_range,
            invalidErrorCode: error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE,
            invalidTypeCode: error_codes/* scorm12_errors */.Se.TYPE_MISMATCH,
            invalidRangeCode: error_codes/* scorm12_errors */.Se.VALUE_OUT_OF_RANGE,
            errorClass: AICCValidationError,
        });
        return _this;
    }
    CMIAttemptRecordsObject.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        this._lesson_status = "";
        (_a = this.score) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    CMIAttemptRecordsObject.prototype.reset = function () {
        var _a;
        this._initialized = false;
        (_a = this.score) === null || _a === void 0 ? void 0 : _a.reset();
    };
    Object.defineProperty(CMIAttemptRecordsObject.prototype, "lesson_status", {
        get: function () {
            return this._lesson_status;
        },
        set: function (lesson_status) {
            if (checkAICCValidFormat(lesson_status, regex/* aicc_regex */.rN.CMIStatus2)) {
                this._lesson_status = lesson_status;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIAttemptRecordsObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            lesson_status: this.lesson_status,
            score: this.score,
        };
        delete this.jsonString;
        return result;
    };
    return CMIAttemptRecordsObject;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/aicc/student_data.ts







var AICCCMIStudentData = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(AICCCMIStudentData, _super);
    function AICCCMIStudentData() {
        var _this = _super.call(this, api_constants/* aicc_constants */.BR.student_data_children) || this;
        _this._tries_during_lesson = "";
        _this.tries = new CMITries();
        _this.attempt_records = new CMIAttemptRecords();
        return _this;
    }
    AICCCMIStudentData.prototype.initialize = function () {
        var _a, _b;
        _super.prototype.initialize.call(this);
        (_a = this.tries) === null || _a === void 0 ? void 0 : _a.initialize();
        (_b = this.attempt_records) === null || _b === void 0 ? void 0 : _b.initialize();
    };
    AICCCMIStudentData.prototype.reset = function () {
        var _a, _b;
        this._initialized = false;
        (_a = this.tries) === null || _a === void 0 ? void 0 : _a.reset(true);
        (_b = this.attempt_records) === null || _b === void 0 ? void 0 : _b.reset(true);
    };
    Object.defineProperty(AICCCMIStudentData.prototype, "tries_during_lesson", {
        get: function () {
            return this._tries_during_lesson;
        },
        set: function (tries_during_lesson) {
            if (this.initialized) {
                throw new AICCValidationError(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
            }
            else {
                this._tries_during_lesson = tries_during_lesson;
            }
        },
        enumerable: false,
        configurable: true
    });
    AICCCMIStudentData.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            mastery_score: this.mastery_score,
            max_time_allowed: this.max_time_allowed,
            time_limit_action: this.time_limit_action,
            tries: this.tries,
            attempt_records: this.attempt_records,
        };
        delete this.jsonString;
        return result;
    };
    return AICCCMIStudentData;
}(student_data/* CMIStudentData */.X));


;// ./src/cmi/aicc/paths.ts






var CMIPaths = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIPaths, _super);
    function CMIPaths() {
        return _super.call(this, {
            children: api_constants/* aicc_constants */.BR.paths_children,
        }) || this;
    }
    return CMIPaths;
}(array/* CMIArray */.B));

var CMIPathsObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIPathsObject, _super);
    function CMIPathsObject() {
        var _this = _super.call(this) || this;
        _this._location_id = "";
        _this._date = "";
        _this._time = "";
        _this._status = "";
        _this._why_left = "";
        _this._time_in_element = "";
        return _this;
    }
    CMIPathsObject.prototype.reset = function () {
        this._initialized = false;
        this._location_id = "";
        this._date = "";
        this._time = "";
        this._status = "";
        this._why_left = "";
        this._time_in_element = "";
    };
    Object.defineProperty(CMIPathsObject.prototype, "location_id", {
        get: function () {
            return this._location_id;
        },
        set: function (location_id) {
            if (checkAICCValidFormat(location_id, regex/* aicc_regex */.rN.CMIString256)) {
                this._location_id = location_id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIPathsObject.prototype, "date", {
        get: function () {
            return this._date;
        },
        set: function (date) {
            if (checkAICCValidFormat(date, regex/* aicc_regex */.rN.CMIString256)) {
                this._date = date;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIPathsObject.prototype, "time", {
        get: function () {
            return this._time;
        },
        set: function (time) {
            if (checkAICCValidFormat(time, regex/* aicc_regex */.rN.CMITime)) {
                this._time = time;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIPathsObject.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            if (checkAICCValidFormat(status, regex/* aicc_regex */.rN.CMIStatus2)) {
                this._status = status;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIPathsObject.prototype, "why_left", {
        get: function () {
            return this._why_left;
        },
        set: function (why_left) {
            if (checkAICCValidFormat(why_left, regex/* aicc_regex */.rN.CMIString256)) {
                this._why_left = why_left;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIPathsObject.prototype, "time_in_element", {
        get: function () {
            return this._time_in_element;
        },
        set: function (time_in_element) {
            if (checkAICCValidFormat(time_in_element, regex/* aicc_regex */.rN.CMITime)) {
                this._time_in_element = time_in_element;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIPathsObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            location_id: this.location_id,
            date: this.date,
            time: this.time,
            status: this.status,
            why_left: this.why_left,
            time_in_element: this.time_in_element,
        };
        delete this.jsonString;
        return result;
    };
    return CMIPathsObject;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/aicc/cmi.ts








var CMI = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMI, _super);
    function CMI(initialized) {
        if (initialized === void 0) { initialized = false; }
        var _this = _super.call(this, api_constants/* aicc_constants */.BR.cmi_children) || this;
        if (initialized)
            _this.initialize();
        _this.student_preference = new AICCStudentPreferences();
        _this.student_data = new AICCCMIStudentData();
        _this.student_demographics = new CMIStudentDemographics();
        _this.evaluation = new CMIEvaluation();
        _this.paths = new CMIPaths();
        return _this;
    }
    CMI.prototype.initialize = function () {
        var _a, _b, _c, _d, _e;
        _super.prototype.initialize.call(this);
        (_a = this.student_preference) === null || _a === void 0 ? void 0 : _a.initialize();
        (_b = this.student_data) === null || _b === void 0 ? void 0 : _b.initialize();
        (_c = this.student_demographics) === null || _c === void 0 ? void 0 : _c.initialize();
        (_d = this.evaluation) === null || _d === void 0 ? void 0 : _d.initialize();
        (_e = this.paths) === null || _e === void 0 ? void 0 : _e.initialize();
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
            student_demographics: this.student_demographics,
            interactions: this.interactions,
            evaluation: this.evaluation,
            paths: this.paths,
        };
        delete this.jsonString;
        return result;
    };
    return CMI;
}(cmi/* CMI */.Y));


// EXTERNAL MODULE: ./src/cmi/scorm12/nav.ts
var nav = __webpack_require__(331);
// EXTERNAL MODULE: ./src/utilities.ts
var utilities = __webpack_require__(864);
;// ./src/AICC.ts









var AICCImpl = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(AICCImpl, _super);
    function AICCImpl(settings) {
        var _this = _super.call(this, settings) || this;
        _this.cmi = new CMI();
        _this.nav = new nav/* NAV */.A();
        return _this;
    }
    AICCImpl.prototype.getChildElement = function (CMIElement, value, foundFirstIndex) {
        var newChild = _super.prototype.getChildElement.call(this, CMIElement, value, foundFirstIndex);
        if (!newChild) {
            if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.evaluation\\.comments\\.\\d+")) {
                newChild = new CMIEvaluationCommentsObject();
            }
            else if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.student_data\\.tries\\.\\d+")) {
                newChild = new CMITriesObject();
            }
            else if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.student_data\\.attempt_records\\.\\d+")) {
                newChild = new CMIAttemptRecordsObject();
            }
            else if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.paths\\.\\d+")) {
                newChild = new CMIPathsObject();
            }
        }
        return newChild;
    };
    AICCImpl.prototype.replaceWithAnotherScormAPI = function (newAPI) {
        this.cmi = newAPI.cmi;
        this.nav = newAPI.nav;
    };
    return AICCImpl;
}(Scorm12API/* Scorm12API */.Y));



/***/ }),

/***/ 918:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  V: function() { return /* binding */ Scorm2004Impl; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(635);
// EXTERNAL MODULE: ./src/BaseAPI.ts + 9 modules
var BaseAPI = __webpack_require__(273);
// EXTERNAL MODULE: ./src/cmi/common/base_cmi.ts
var base_cmi = __webpack_require__(319);
// EXTERNAL MODULE: ./src/constants/api_constants.ts
var api_constants = __webpack_require__(340);
// EXTERNAL MODULE: ./src/exceptions.ts
var exceptions = __webpack_require__(784);
;// ./src/exceptions/scorm2004_exceptions.ts



var scorm2004_errors = api_constants/* scorm2004_constants */.zR.error_descriptions;
var Scorm2004ValidationError = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(Scorm2004ValidationError, _super);
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
}(exceptions/* ValidationError */.y));


// EXTERNAL MODULE: ./src/constants/error_codes.ts
var error_codes = __webpack_require__(797);
// EXTERNAL MODULE: ./src/cmi/common/validation.ts
var validation = __webpack_require__(449);
;// ./src/cmi/scorm2004/validation.ts



function check2004ValidFormat(value, regexPattern, allowEmptyString) {
    return (0,validation/* checkValidFormat */.q)(value, regexPattern, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, Scorm2004ValidationError, allowEmptyString);
}
function check2004ValidRange(value, rangePattern) {
    return (0,validation/* checkValidRange */.W)(value, rangePattern, error_codes/* scorm2004_errors */.Rf.VALUE_OUT_OF_RANGE, Scorm2004ValidationError);
}

// EXTERNAL MODULE: ./src/constants/regex.ts
var regex = __webpack_require__(417);
;// ./src/cmi/scorm2004/learner_preference.ts







var CMILearnerPreference = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMILearnerPreference, _super);
    function CMILearnerPreference() {
        var _this = _super.call(this) || this;
        _this.__children = api_constants/* scorm2004_constants */.zR.student_preference_children;
        _this._audio_level = "1";
        _this._language = "";
        _this._delivery_speed = "1";
        _this._audio_captioning = "0";
        return _this;
    }
    CMILearnerPreference.prototype.reset = function () {
        this._initialized = false;
    };
    Object.defineProperty(CMILearnerPreference.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMILearnerPreference.prototype, "audio_level", {
        get: function () {
            return this._audio_level;
        },
        set: function (audio_level) {
            if (check2004ValidFormat(audio_level, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                check2004ValidRange(audio_level, regex/* scorm2004_regex */.xt.audio_range)) {
                this._audio_level = audio_level;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMILearnerPreference.prototype, "language", {
        get: function () {
            return this._language;
        },
        set: function (language) {
            if (check2004ValidFormat(language, regex/* scorm2004_regex */.xt.CMILang)) {
                this._language = language;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMILearnerPreference.prototype, "delivery_speed", {
        get: function () {
            return this._delivery_speed;
        },
        set: function (delivery_speed) {
            if (check2004ValidFormat(delivery_speed, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                check2004ValidRange(delivery_speed, regex/* scorm2004_regex */.xt.speed_range)) {
                this._delivery_speed = delivery_speed;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMILearnerPreference.prototype, "audio_captioning", {
        get: function () {
            return this._audio_captioning;
        },
        set: function (audio_captioning) {
            if (check2004ValidFormat(audio_captioning, regex/* scorm2004_regex */.xt.CMISInteger) &&
                check2004ValidRange(audio_captioning, regex/* scorm2004_regex */.xt.text_range)) {
                this._audio_captioning = audio_captioning;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMILearnerPreference.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            audio_level: this.audio_level,
            language: this.language,
            delivery_speed: this.delivery_speed,
            audio_captioning: this.audio_captioning,
        };
        delete this.jsonString;
        return result;
    };
    return CMILearnerPreference;
}(base_cmi/* BaseCMI */.J));


// EXTERNAL MODULE: ./src/cmi/common/array.ts
var array = __webpack_require__(589);
;// ./src/constants/response_constants.ts

var LearnerResponses = {
    "true-false": {
        format: "^true$|^false$",
        max: 1,
        delimiter: "",
        unique: false,
    },
    choice: {
        format: regex/* scorm2004_regex */.xt.CMILongIdentifier,
        max: 36,
        delimiter: "[,]",
        unique: true,
    },
    "fill-in": {
        format: regex/* scorm2004_regex */.xt.CMILangString250,
        max: 10,
        delimiter: "[,]",
        unique: false,
    },
    "long-fill-in": {
        format: regex/* scorm2004_regex */.xt.CMILangString4000,
        max: 1,
        delimiter: "",
        unique: false,
    },
    matching: {
        format: regex/* scorm2004_regex */.xt.CMIShortIdentifier,
        format2: regex/* scorm2004_regex */.xt.CMIShortIdentifier,
        max: 36,
        delimiter: "[,]",
        delimiter2: "[.]",
        unique: false,
    },
    performance: {
        format: "^$|" + regex/* scorm2004_regex */.xt.CMIShortIdentifier,
        format2: regex/* scorm2004_regex */.xt.CMIDecimal + "|^$|" + regex/* scorm2004_regex */.xt.CMIShortIdentifier,
        max: 250,
        delimiter: "[,]",
        delimiter2: "[.]",
        unique: false,
    },
    sequencing: {
        format: regex/* scorm2004_regex */.xt.CMIShortIdentifier,
        max: 36,
        delimiter: "[,]",
        unique: false,
    },
    likert: {
        format: regex/* scorm2004_regex */.xt.CMIShortIdentifier,
        max: 1,
        delimiter: "",
        unique: false,
    },
    numeric: {
        format: regex/* scorm2004_regex */.xt.CMIDecimal,
        max: 1,
        delimiter: "",
        unique: false,
    },
    other: {
        format: regex/* scorm2004_regex */.xt.CMIString4000,
        max: 1,
        delimiter: "",
        unique: false,
    },
};
var CorrectResponses = {
    "true-false": {
        max: 1,
        delimiter: "",
        unique: false,
        duplicate: false,
        format: "^true$|^false$",
        limit: 1,
    },
    choice: {
        max: 36,
        delimiter: "[,]",
        unique: true,
        duplicate: false,
        format: regex/* scorm2004_regex */.xt.CMILongIdentifier,
    },
    "fill-in": {
        max: 10,
        delimiter: "[,]",
        unique: false,
        duplicate: false,
        format: regex/* scorm2004_regex */.xt.CMILangString250cr,
    },
    "long-fill-in": {
        max: 1,
        delimiter: "",
        unique: false,
        duplicate: true,
        format: regex/* scorm2004_regex */.xt.CMILangString4000,
    },
    matching: {
        max: 36,
        delimiter: "[,]",
        delimiter2: "[.]",
        unique: false,
        duplicate: false,
        format: regex/* scorm2004_regex */.xt.CMIShortIdentifier,
        format2: regex/* scorm2004_regex */.xt.CMIShortIdentifier,
    },
    performance: {
        max: 250,
        delimiter: "[,]",
        delimiter2: "[.]",
        delimiter3: "[:]",
        unique: false,
        duplicate: false,
        format: "^$|" + regex/* scorm2004_regex */.xt.CMIShortIdentifier,
        format2: regex/* scorm2004_regex */.xt.CMIDecimal + "|^$|" + regex/* scorm2004_regex */.xt.CMIShortIdentifier,
    },
    sequencing: {
        max: 36,
        delimiter: "[,]",
        unique: false,
        duplicate: false,
        format: regex/* scorm2004_regex */.xt.CMIShortIdentifier,
    },
    likert: {
        max: 1,
        delimiter: "",
        unique: false,
        duplicate: false,
        format: regex/* scorm2004_regex */.xt.CMIShortIdentifier,
        limit: 1,
    },
    numeric: {
        max: 2,
        delimiter: "[:]",
        unique: false,
        duplicate: false,
        format: regex/* scorm2004_regex */.xt.CMIDecimal,
        limit: 1,
    },
    other: {
        max: 1,
        delimiter: "",
        unique: false,
        duplicate: false,
        format: regex/* scorm2004_regex */.xt.CMIString4000,
        limit: 1,
    },
};

;// ./src/cmi/scorm2004/interactions.ts









var CMIInteractions = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIInteractions, _super);
    function CMIInteractions() {
        return _super.call(this, {
            children: api_constants/* scorm2004_constants */.zR.interactions_children,
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
        }) || this;
    }
    return CMIInteractions;
}(array/* CMIArray */.B));

var CMIInteractionsObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIInteractionsObject, _super);
    function CMIInteractionsObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        _this._type = "";
        _this._timestamp = "";
        _this._weighting = "";
        _this._learner_response = "";
        _this._result = "";
        _this._latency = "";
        _this._description = "";
        _this.objectives = new array/* CMIArray */.B({
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
            children: api_constants/* scorm2004_constants */.zR.objectives_children,
        });
        _this.correct_responses = new array/* CMIArray */.B({
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
            children: api_constants/* scorm2004_constants */.zR.correct_responses_children,
        });
        return _this;
    }
    CMIInteractionsObject.prototype.initialize = function () {
        var _a, _b;
        _super.prototype.initialize.call(this);
        (_a = this.objectives) === null || _a === void 0 ? void 0 : _a.initialize();
        (_b = this.correct_responses) === null || _b === void 0 ? void 0 : _b.initialize();
    };
    CMIInteractionsObject.prototype.reset = function () {
        this._initialized = false;
        this._id = "";
        this._type = "";
        this._timestamp = "";
        this._weighting = "";
        this._learner_response = "";
        this._result = "";
        this._latency = "";
        this._description = "";
        this.objectives = new array/* CMIArray */.B({
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
            children: api_constants/* scorm2004_constants */.zR.objectives_children,
        });
        this.correct_responses = new array/* CMIArray */.B({
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
            children: api_constants/* scorm2004_constants */.zR.correct_responses_children,
        });
    };
    Object.defineProperty(CMIInteractionsObject.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            if (check2004ValidFormat(id, regex/* scorm2004_regex */.xt.CMILongIdentifier)) {
                this._id = id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "type", {
        get: function () {
            return this._type;
        },
        set: function (type) {
            if (this.initialized && this._id === "") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(type, regex/* scorm2004_regex */.xt.CMIType)) {
                    this._type = type;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "timestamp", {
        get: function () {
            return this._timestamp;
        },
        set: function (timestamp) {
            if (this.initialized && this._id === "") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(timestamp, regex/* scorm2004_regex */.xt.CMITime)) {
                    this._timestamp = timestamp;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "weighting", {
        get: function () {
            return this._weighting;
        },
        set: function (weighting) {
            if (this.initialized && this._id === "") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(weighting, regex/* scorm2004_regex */.xt.CMIDecimal)) {
                    this._weighting = weighting;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "learner_response", {
        get: function () {
            return this._learner_response;
        },
        set: function (learner_response) {
            if (this.initialized && (this._type === "" || this._id === "")) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                var nodes = [];
                var response_type = LearnerResponses[this.type];
                if (response_type) {
                    if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
                        nodes = learner_response.split(response_type.delimiter);
                    }
                    else {
                        nodes[0] = learner_response;
                    }
                    if (nodes.length > 0 && nodes.length <= response_type.max) {
                        var formatRegex = new RegExp(response_type.format);
                        for (var i = 0; i < nodes.length; i++) {
                            if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter2) {
                                var values = nodes[i].split(response_type.delimiter2);
                                if (values.length === 2) {
                                    if (!values[0].match(formatRegex)) {
                                        throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                    }
                                    else {
                                        if (!response_type.format2 ||
                                            !values[1].match(new RegExp(response_type.format2))) {
                                            throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                        }
                                    }
                                }
                                else {
                                    throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                }
                            }
                            else {
                                if (!nodes[i].match(formatRegex)) {
                                    throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                }
                                else {
                                    if (nodes[i] !== "" && response_type.unique) {
                                        for (var j = 0; j < i; j++) {
                                            if (nodes[i] === nodes[j]) {
                                                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE);
                    }
                    this._learner_response = learner_response;
                }
                else {
                    throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "result", {
        get: function () {
            return this._result;
        },
        set: function (result) {
            if (check2004ValidFormat(result, regex/* scorm2004_regex */.xt.CMIResult)) {
                this._result = result;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "latency", {
        get: function () {
            return this._latency;
        },
        set: function (latency) {
            if (this.initialized && this._id === "") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(latency, regex/* scorm2004_regex */.xt.CMITimespan)) {
                    this._latency = latency;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (description) {
            if (this.initialized && this._id === "") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(description, regex/* scorm2004_regex */.xt.CMILangString250, true)) {
                    this._description = description;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIInteractionsObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            id: this.id,
            type: this.type,
            objectives: this.objectives,
            timestamp: this.timestamp,
            weighting: this.weighting,
            learner_response: this.learner_response,
            result: this.result,
            latency: this.latency,
            description: this.description,
            correct_responses: this.correct_responses,
        };
        delete this.jsonString;
        return result;
    };
    return CMIInteractionsObject;
}(base_cmi/* BaseCMI */.J));

var CMIInteractionsObjectivesObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIInteractionsObjectivesObject, _super);
    function CMIInteractionsObjectivesObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        return _this;
    }
    CMIInteractionsObjectivesObject.prototype.reset = function () {
        this._initialized = false;
        this._id = "";
    };
    Object.defineProperty(CMIInteractionsObjectivesObject.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            if (check2004ValidFormat(id, regex/* scorm2004_regex */.xt.CMILongIdentifier)) {
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
}(base_cmi/* BaseCMI */.J));

var CMIInteractionsCorrectResponsesObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIInteractionsCorrectResponsesObject, _super);
    function CMIInteractionsCorrectResponsesObject() {
        var _this = _super.call(this) || this;
        _this._pattern = "";
        return _this;
    }
    CMIInteractionsCorrectResponsesObject.prototype.reset = function () {
        this._initialized = false;
        this._pattern = "";
    };
    Object.defineProperty(CMIInteractionsCorrectResponsesObject.prototype, "pattern", {
        get: function () {
            return this._pattern;
        },
        set: function (pattern) {
            if (check2004ValidFormat(pattern, regex/* scorm2004_regex */.xt.CMIFeedback)) {
                this._pattern = pattern;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIInteractionsCorrectResponsesObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            pattern: this.pattern,
        };
        delete this.jsonString;
        return result;
    };
    return CMIInteractionsCorrectResponsesObject;
}(base_cmi/* BaseCMI */.J));


// EXTERNAL MODULE: ./src/cmi/common/score.ts
var score = __webpack_require__(434);
;// ./src/cmi/scorm2004/score.ts







var Scorm2004CMIScore = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(Scorm2004CMIScore, _super);
    function Scorm2004CMIScore() {
        var _this = _super.call(this, {
            score_children: api_constants/* scorm2004_constants */.zR.score_children,
            max: "",
            invalidErrorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            invalidTypeCode: error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH,
            invalidRangeCode: error_codes/* scorm2004_errors */.Rf.VALUE_OUT_OF_RANGE,
            decimalRegex: regex/* scorm2004_regex */.xt.CMIDecimal,
            errorClass: Scorm2004ValidationError,
        }) || this;
        _this._scaled = "";
        return _this;
    }
    Scorm2004CMIScore.prototype.reset = function () {
        this._initialized = false;
        this._scaled = "";
        this._raw = "";
        this._min = "";
        this._max = "";
    };
    Object.defineProperty(Scorm2004CMIScore.prototype, "scaled", {
        get: function () {
            return this._scaled;
        },
        set: function (scaled) {
            if (check2004ValidFormat(scaled, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                check2004ValidRange(scaled, regex/* scorm2004_regex */.xt.scaled_range)) {
                this._scaled = scaled;
            }
        },
        enumerable: false,
        configurable: true
    });
    Scorm2004CMIScore.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            scaled: this.scaled,
            raw: this.raw,
            min: this.min,
            max: this.max,
        };
        delete this.jsonString;
        return result;
    };
    return Scorm2004CMIScore;
}(score/* CMIScore */._));


;// ./src/cmi/scorm2004/comments.ts








var CMICommentsFromLMS = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMICommentsFromLMS, _super);
    function CMICommentsFromLMS() {
        return _super.call(this, {
            children: api_constants/* scorm2004_constants */.zR.comments_children,
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
        }) || this;
    }
    return CMICommentsFromLMS;
}(array/* CMIArray */.B));

var CMICommentsFromLearner = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMICommentsFromLearner, _super);
    function CMICommentsFromLearner() {
        return _super.call(this, {
            children: api_constants/* scorm2004_constants */.zR.comments_children,
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
        }) || this;
    }
    return CMICommentsFromLearner;
}(array/* CMIArray */.B));

var CMICommentsObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMICommentsObject, _super);
    function CMICommentsObject(readOnlyAfterInit) {
        if (readOnlyAfterInit === void 0) { readOnlyAfterInit = false; }
        var _this = _super.call(this) || this;
        _this._comment = "";
        _this._location = "";
        _this._timestamp = "";
        _this._comment = "";
        _this._location = "";
        _this._timestamp = "";
        _this._readOnlyAfterInit = readOnlyAfterInit;
        return _this;
    }
    CMICommentsObject.prototype.reset = function () {
        this._initialized = false;
    };
    Object.defineProperty(CMICommentsObject.prototype, "comment", {
        get: function () {
            return this._comment;
        },
        set: function (comment) {
            if (this.initialized && this._readOnlyAfterInit) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                if (check2004ValidFormat(comment, regex/* scorm2004_regex */.xt.CMILangString4000, true)) {
                    this._comment = comment;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICommentsObject.prototype, "location", {
        get: function () {
            return this._location;
        },
        set: function (location) {
            if (this.initialized && this._readOnlyAfterInit) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                if (check2004ValidFormat(location, regex/* scorm2004_regex */.xt.CMIString250)) {
                    this._location = location;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICommentsObject.prototype, "timestamp", {
        get: function () {
            return this._timestamp;
        },
        set: function (timestamp) {
            if (this.initialized && this._readOnlyAfterInit) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                if (check2004ValidFormat(timestamp, regex/* scorm2004_regex */.xt.CMITime)) {
                    this._timestamp = timestamp;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    CMICommentsObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            comment: this.comment,
            location: this.location,
            timestamp: this.timestamp,
        };
        delete this.jsonString;
        return result;
    };
    return CMICommentsObject;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/objectives.ts









var CMIObjectives = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIObjectives, _super);
    function CMIObjectives() {
        return _super.call(this, {
            children: api_constants/* scorm2004_constants */.zR.objectives_children,
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
        }) || this;
    }
    CMIObjectives.prototype.findObjectiveById = function (id) {
        return this.childArray.find(function (objective) { return objective.id === id; });
    };
    CMIObjectives.prototype.findObjectiveByIndex = function (index) {
        return this.childArray[index];
    };
    CMIObjectives.prototype.setObjectiveByIndex = function (index, objective) {
        this.childArray[index] = objective;
    };
    return CMIObjectives;
}(array/* CMIArray */.B));

var CMIObjectivesObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIObjectivesObject, _super);
    function CMIObjectivesObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        _this._success_status = "unknown";
        _this._completion_status = "unknown";
        _this._progress_measure = "";
        _this._description = "";
        _this.score = new Scorm2004CMIScore();
        return _this;
    }
    CMIObjectivesObject.prototype.reset = function () {
        this._initialized = false;
    };
    CMIObjectivesObject.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        (_a = this.score) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    Object.defineProperty(CMIObjectivesObject.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            if (check2004ValidFormat(id, regex/* scorm2004_regex */.xt.CMILongIdentifier)) {
                this._id = id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIObjectivesObject.prototype, "success_status", {
        get: function () {
            return this._success_status;
        },
        set: function (success_status) {
            if (this.initialized && this._id === "") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(success_status, regex/* scorm2004_regex */.xt.CMISStatus)) {
                    this._success_status = success_status;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIObjectivesObject.prototype, "completion_status", {
        get: function () {
            return this._completion_status;
        },
        set: function (completion_status) {
            if (this.initialized && this._id === "") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(completion_status, regex/* scorm2004_regex */.xt.CMICStatus)) {
                    this._completion_status = completion_status;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIObjectivesObject.prototype, "progress_measure", {
        get: function () {
            return this._progress_measure;
        },
        set: function (progress_measure) {
            if (this.initialized && this._id === "") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(progress_measure, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                    check2004ValidRange(progress_measure, regex/* scorm2004_regex */.xt.progress_range)) {
                    this._progress_measure = progress_measure;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIObjectivesObject.prototype, "description", {
        get: function () {
            return this._description;
        },
        set: function (description) {
            if (this.initialized && this._id === "") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(description, regex/* scorm2004_regex */.xt.CMILangString250, true)) {
                    this._description = description;
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIObjectivesObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            id: this.id,
            success_status: this.success_status,
            completion_status: this.completion_status,
            progress_measure: this.progress_measure,
            description: this.description,
            score: this.score,
        };
        delete this.jsonString;
        return result;
    };
    return CMIObjectivesObject;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/metadata.ts





var CMIMetadata = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIMetadata, _super);
    function CMIMetadata() {
        var _this = _super.call(this) || this;
        _this.__version = "1.0";
        _this.__children = api_constants/* scorm2004_constants */.zR.cmi_children;
        return _this;
    }
    Object.defineProperty(CMIMetadata.prototype, "_version", {
        get: function () {
            return this.__version;
        },
        set: function (_version) {
            throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIMetadata.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
        },
        enumerable: false,
        configurable: true
    });
    CMIMetadata.prototype.reset = function () {
        this._initialized = false;
    };
    return CMIMetadata;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/learner.ts




var CMILearner = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMILearner, _super);
    function CMILearner() {
        var _this = _super.call(this) || this;
        _this._learner_id = "";
        _this._learner_name = "";
        return _this;
    }
    Object.defineProperty(CMILearner.prototype, "learner_id", {
        get: function () {
            return this._learner_id;
        },
        set: function (learner_id) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._learner_id = learner_id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMILearner.prototype, "learner_name", {
        get: function () {
            return this._learner_name;
        },
        set: function (learner_name) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._learner_name = learner_name;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMILearner.prototype.reset = function () {
        this._initialized = false;
    };
    return CMILearner;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/status.ts




var CMIStatus = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIStatus, _super);
    function CMIStatus() {
        var _this = _super.call(this) || this;
        _this._completion_status = "unknown";
        _this._success_status = "unknown";
        _this._progress_measure = "";
        return _this;
    }
    Object.defineProperty(CMIStatus.prototype, "completion_status", {
        get: function () {
            return this._completion_status;
        },
        set: function (completion_status) {
            if (check2004ValidFormat(completion_status, regex/* scorm2004_regex */.xt.CMICStatus)) {
                this._completion_status = completion_status;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStatus.prototype, "success_status", {
        get: function () {
            return this._success_status;
        },
        set: function (success_status) {
            if (check2004ValidFormat(success_status, regex/* scorm2004_regex */.xt.CMISStatus)) {
                this._success_status = success_status;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStatus.prototype, "progress_measure", {
        get: function () {
            return this._progress_measure;
        },
        set: function (progress_measure) {
            if (check2004ValidFormat(progress_measure, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                check2004ValidRange(progress_measure, regex/* scorm2004_regex */.xt.progress_range)) {
                this._progress_measure = progress_measure;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIStatus.prototype.reset = function () {
        this._initialized = false;
        this._completion_status = "incomplete";
        this._success_status = "unknown";
        this._progress_measure = "";
    };
    return CMIStatus;
}(base_cmi/* BaseCMI */.J));


// EXTERNAL MODULE: ./src/utilities.ts
var utilities = __webpack_require__(864);
;// ./src/cmi/scorm2004/session.ts







var CMISession = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMISession, _super);
    function CMISession() {
        var _this = _super.call(this) || this;
        _this._entry = "";
        _this._exit = "";
        _this._session_time = "PT0H0M0S";
        _this._total_time = "";
        return _this;
    }
    Object.defineProperty(CMISession.prototype, "entry", {
        get: function () {
            return this._entry;
        },
        set: function (entry) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._entry = entry;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMISession.prototype, "exit", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.WRITE_ONLY_ELEMENT);
            }
            return this._exit;
        },
        set: function (exit) {
            if (check2004ValidFormat(exit, regex/* scorm2004_regex */.xt.CMIExit, true)) {
                this._exit = exit;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMISession.prototype, "session_time", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.WRITE_ONLY_ELEMENT);
            }
            return this._session_time;
        },
        set: function (session_time) {
            if (check2004ValidFormat(session_time, regex/* scorm2004_regex */.xt.CMITimespan)) {
                this._session_time = session_time;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMISession.prototype, "total_time", {
        get: function () {
            return this._total_time;
        },
        set: function (total_time) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._total_time = total_time;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMISession.prototype.getCurrentTotalTime = function () {
        var sessionTime = this._session_time;
        var startTime = this.start_time;
        if (typeof startTime !== "undefined" && startTime !== null) {
            var seconds = new Date().getTime() - startTime;
            sessionTime = utilities/* getSecondsAsISODuration */.xE(seconds / 1000);
        }
        return utilities/* addTwoDurations */.$o(this._total_time, sessionTime, regex/* scorm2004_regex */.xt.CMITimespan);
    };
    CMISession.prototype.reset = function () {
        this._initialized = false;
        this._entry = "";
        this._exit = "";
        this._session_time = "PT0H0M0S";
    };
    return CMISession;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/content.ts






var CMIContent = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIContent, _super);
    function CMIContent() {
        var _this = _super.call(this) || this;
        _this._location = "";
        _this._launch_data = "";
        _this._suspend_data = "";
        return _this;
    }
    Object.defineProperty(CMIContent.prototype, "location", {
        get: function () {
            return this._location;
        },
        set: function (location) {
            if (check2004ValidFormat(location, regex/* scorm2004_regex */.xt.CMIString1000)) {
                this._location = location;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIContent.prototype, "launch_data", {
        get: function () {
            return this._launch_data;
        },
        set: function (launch_data) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._launch_data = launch_data;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIContent.prototype, "suspend_data", {
        get: function () {
            return this._suspend_data;
        },
        set: function (suspend_data) {
            if (check2004ValidFormat(suspend_data, regex/* scorm2004_regex */.xt.CMIString64000, true)) {
                this._suspend_data = suspend_data;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIContent.prototype.reset = function () {
        this._initialized = false;
        this._location = "";
        this._suspend_data = "";
    };
    return CMIContent;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/settings.ts




var CMISettings = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMISettings, _super);
    function CMISettings() {
        var _this = _super.call(this) || this;
        _this._credit = "credit";
        _this._mode = "normal";
        _this._time_limit_action = "continue,no message";
        _this._max_time_allowed = "";
        return _this;
    }
    Object.defineProperty(CMISettings.prototype, "credit", {
        get: function () {
            return this._credit;
        },
        set: function (credit) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._credit = credit;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMISettings.prototype, "mode", {
        get: function () {
            return this._mode;
        },
        set: function (mode) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._mode = mode;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMISettings.prototype, "time_limit_action", {
        get: function () {
            return this._time_limit_action;
        },
        set: function (time_limit_action) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._time_limit_action = time_limit_action;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMISettings.prototype, "max_time_allowed", {
        get: function () {
            return this._max_time_allowed;
        },
        set: function (max_time_allowed) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._max_time_allowed = max_time_allowed;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMISettings.prototype.reset = function () {
        this._initialized = false;
    };
    return CMISettings;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/thresholds.ts




var CMIThresholds = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMIThresholds, _super);
    function CMIThresholds() {
        var _this = _super.call(this) || this;
        _this._scaled_passing_score = "";
        _this._completion_threshold = "";
        return _this;
    }
    Object.defineProperty(CMIThresholds.prototype, "scaled_passing_score", {
        get: function () {
            return this._scaled_passing_score;
        },
        set: function (scaled_passing_score) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._scaled_passing_score = scaled_passing_score;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIThresholds.prototype, "completion_threshold", {
        get: function () {
            return this._completion_threshold;
        },
        set: function (completion_threshold) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                this._completion_threshold = completion_threshold;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIThresholds.prototype.reset = function () {
        this._initialized = false;
    };
    return CMIThresholds;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/cmi.ts














var CMI = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMI, _super);
    function CMI(initialized) {
        if (initialized === void 0) { initialized = false; }
        var _this = _super.call(this) || this;
        _this.metadata = new CMIMetadata();
        _this.learner = new CMILearner();
        _this.status = new CMIStatus();
        _this.session = new CMISession();
        _this.content = new CMIContent();
        _this.settings = new CMISettings();
        _this.thresholds = new CMIThresholds();
        _this.learner_preference = new CMILearnerPreference();
        _this.score = new Scorm2004CMIScore();
        _this.comments_from_learner = new CMICommentsFromLearner();
        _this.comments_from_lms = new CMICommentsFromLMS();
        _this.interactions = new CMIInteractions();
        _this.objectives = new CMIObjectives();
        if (initialized)
            _this.initialize();
        return _this;
    }
    CMI.prototype.initialize = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        _super.prototype.initialize.call(this);
        (_a = this.metadata) === null || _a === void 0 ? void 0 : _a.initialize();
        (_b = this.learner) === null || _b === void 0 ? void 0 : _b.initialize();
        (_c = this.status) === null || _c === void 0 ? void 0 : _c.initialize();
        (_d = this.session) === null || _d === void 0 ? void 0 : _d.initialize();
        (_e = this.content) === null || _e === void 0 ? void 0 : _e.initialize();
        (_f = this.settings) === null || _f === void 0 ? void 0 : _f.initialize();
        (_g = this.thresholds) === null || _g === void 0 ? void 0 : _g.initialize();
        (_h = this.learner_preference) === null || _h === void 0 ? void 0 : _h.initialize();
        (_j = this.score) === null || _j === void 0 ? void 0 : _j.initialize();
        (_k = this.comments_from_learner) === null || _k === void 0 ? void 0 : _k.initialize();
        (_l = this.comments_from_lms) === null || _l === void 0 ? void 0 : _l.initialize();
        (_m = this.interactions) === null || _m === void 0 ? void 0 : _m.initialize();
        (_o = this.objectives) === null || _o === void 0 ? void 0 : _o.initialize();
    };
    CMI.prototype.reset = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        this._initialized = false;
        (_a = this.metadata) === null || _a === void 0 ? void 0 : _a.reset();
        (_b = this.learner) === null || _b === void 0 ? void 0 : _b.reset();
        (_c = this.status) === null || _c === void 0 ? void 0 : _c.reset();
        (_d = this.session) === null || _d === void 0 ? void 0 : _d.reset();
        (_e = this.content) === null || _e === void 0 ? void 0 : _e.reset();
        (_f = this.settings) === null || _f === void 0 ? void 0 : _f.reset();
        (_g = this.thresholds) === null || _g === void 0 ? void 0 : _g.reset();
        (_h = this.objectives) === null || _h === void 0 ? void 0 : _h.reset(false);
        (_j = this.interactions) === null || _j === void 0 ? void 0 : _j.reset(true);
        (_k = this.score) === null || _k === void 0 ? void 0 : _k.reset();
        (_l = this.comments_from_learner) === null || _l === void 0 ? void 0 : _l.reset();
        (_m = this.comments_from_lms) === null || _m === void 0 ? void 0 : _m.reset();
        (_o = this.learner_preference) === null || _o === void 0 ? void 0 : _o.reset();
    };
    Object.defineProperty(CMI.prototype, "_version", {
        get: function () {
            return this.metadata._version;
        },
        set: function (_version) {
            this.metadata._version = _version;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "_children", {
        get: function () {
            return this.metadata._children;
        },
        set: function (_children) {
            this.metadata._children = _children;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "completion_status", {
        get: function () {
            return this.status.completion_status;
        },
        set: function (completion_status) {
            this.status.completion_status = completion_status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "completion_threshold", {
        get: function () {
            return this.thresholds.completion_threshold;
        },
        set: function (completion_threshold) {
            this.thresholds.completion_threshold = completion_threshold;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "credit", {
        get: function () {
            return this.settings.credit;
        },
        set: function (credit) {
            this.settings.credit = credit;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "entry", {
        get: function () {
            return this.session.entry;
        },
        set: function (entry) {
            this.session.entry = entry;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "exit", {
        get: function () {
            this.session.jsonString = this.jsonString;
            return this.session.exit;
        },
        set: function (exit) {
            this.session.exit = exit;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "launch_data", {
        get: function () {
            return this.content.launch_data;
        },
        set: function (launch_data) {
            this.content.launch_data = launch_data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "learner_id", {
        get: function () {
            return this.learner.learner_id;
        },
        set: function (learner_id) {
            this.learner.learner_id = learner_id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "learner_name", {
        get: function () {
            return this.learner.learner_name;
        },
        set: function (learner_name) {
            this.learner.learner_name = learner_name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "location", {
        get: function () {
            return this.content.location;
        },
        set: function (location) {
            this.content.location = location;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "max_time_allowed", {
        get: function () {
            return this.settings.max_time_allowed;
        },
        set: function (max_time_allowed) {
            this.settings.max_time_allowed = max_time_allowed;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "mode", {
        get: function () {
            return this.settings.mode;
        },
        set: function (mode) {
            this.settings.mode = mode;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "progress_measure", {
        get: function () {
            return this.status.progress_measure;
        },
        set: function (progress_measure) {
            this.status.progress_measure = progress_measure;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "scaled_passing_score", {
        get: function () {
            return this.thresholds.scaled_passing_score;
        },
        set: function (scaled_passing_score) {
            this.thresholds.scaled_passing_score = scaled_passing_score;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "session_time", {
        get: function () {
            this.session.jsonString = this.jsonString;
            return this.session.session_time;
        },
        set: function (session_time) {
            this.session.session_time = session_time;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "success_status", {
        get: function () {
            return this.status.success_status;
        },
        set: function (success_status) {
            this.status.success_status = success_status;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "suspend_data", {
        get: function () {
            return this.content.suspend_data;
        },
        set: function (suspend_data) {
            this.content.suspend_data = suspend_data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "time_limit_action", {
        get: function () {
            return this.settings.time_limit_action;
        },
        set: function (time_limit_action) {
            this.settings.time_limit_action = time_limit_action;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "total_time", {
        get: function () {
            return this.session.total_time;
        },
        set: function (total_time) {
            this.session.total_time = total_time;
        },
        enumerable: false,
        configurable: true
    });
    CMI.prototype.getCurrentTotalTime = function () {
        return this.session.getCurrentTotalTime();
    };
    CMI.prototype.toJSON = function () {
        this.jsonString = true;
        this.session.jsonString = true;
        var result = {
            comments_from_learner: this.comments_from_learner,
            comments_from_lms: this.comments_from_lms,
            completion_status: this.completion_status,
            completion_threshold: this.completion_threshold,
            credit: this.credit,
            entry: this.entry,
            exit: this.exit,
            interactions: this.interactions,
            launch_data: this.launch_data,
            learner_id: this.learner_id,
            learner_name: this.learner_name,
            learner_preference: this.learner_preference,
            location: this.location,
            max_time_allowed: this.max_time_allowed,
            mode: this.mode,
            objectives: this.objectives,
            progress_measure: this.progress_measure,
            scaled_passing_score: this.scaled_passing_score,
            score: this.score,
            session_time: this.session_time,
            success_status: this.success_status,
            suspend_data: this.suspend_data,
            time_limit_action: this.time_limit_action,
        };
        delete this.jsonString;
        delete this.session.jsonString;
        return result;
    };
    return CMI;
}(base_cmi/* BaseRootCMI */.r));


// EXTERNAL MODULE: ./src/constants/enums.ts
var enums = __webpack_require__(56);
;// ./src/cmi/scorm2004/adl.ts









var ADL = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(ADL, _super);
    function ADL() {
        var _this = _super.call(this) || this;
        _this.data = new ADLData();
        _this.nav = new ADLNav();
        _this.data = new ADLData();
        return _this;
    }
    ADL.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        (_a = this.nav) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    ADL.prototype.reset = function () {
        var _a;
        this._initialized = false;
        (_a = this.nav) === null || _a === void 0 ? void 0 : _a.reset();
    };
    ADL.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            nav: this.nav,
            data: this.data,
        };
        delete this.jsonString;
        return result;
    };
    return ADL;
}(base_cmi/* BaseCMI */.J));

var ADLNav = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(ADLNav, _super);
    function ADLNav() {
        var _this = _super.call(this) || this;
        _this._request = "_none_";
        _this.request_valid = new ADLNavRequestValid();
        return _this;
    }
    ADLNav.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        (_a = this.request_valid) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    ADLNav.prototype.reset = function () {
        var _a;
        this._initialized = false;
        this._request = "_none_";
        (_a = this.request_valid) === null || _a === void 0 ? void 0 : _a.reset();
    };
    Object.defineProperty(ADLNav.prototype, "request", {
        get: function () {
            return this._request;
        },
        set: function (request) {
            if (check2004ValidFormat(request, regex/* scorm2004_regex */.xt.NAVEvent)) {
                this._request = request;
            }
        },
        enumerable: false,
        configurable: true
    });
    ADLNav.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            request: this.request,
        };
        delete this.jsonString;
        return result;
    };
    return ADLNav;
}(base_cmi/* BaseCMI */.J));

var ADLData = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(ADLData, _super);
    function ADLData() {
        return _super.call(this, {
            children: api_constants/* scorm2004_constants */.zR.adl_data_children,
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
        }) || this;
    }
    return ADLData;
}(array/* CMIArray */.B));

var ADLDataObject = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(ADLDataObject, _super);
    function ADLDataObject() {
        var _this = _super.call(this) || this;
        _this._id = "";
        _this._store = "";
        return _this;
    }
    ADLDataObject.prototype.reset = function () {
        this._initialized = false;
    };
    Object.defineProperty(ADLDataObject.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            if (check2004ValidFormat(id, regex/* scorm2004_regex */.xt.CMILongIdentifier)) {
                this._id = id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ADLDataObject.prototype, "store", {
        get: function () {
            return this._store;
        },
        set: function (store) {
            if (check2004ValidFormat(store, regex/* scorm2004_regex */.xt.CMILangString4000)) {
                this._store = store;
            }
        },
        enumerable: false,
        configurable: true
    });
    ADLDataObject.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            id: this._id,
            store: this._store,
        };
        delete this.jsonString;
        return result;
    };
    return ADLDataObject;
}(base_cmi/* BaseCMI */.J));

var ADLNavRequestValid = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(ADLNavRequestValid, _super);
    function ADLNavRequestValid() {
        var _this = _super.call(this) || this;
        _this._continue = "unknown";
        _this._previous = "unknown";
        _this._choice = {};
        _this._jump = {};
        return _this;
    }
    ADLNavRequestValid.prototype.reset = function () {
        this._initialized = false;
        this._continue = "unknown";
        this._previous = "unknown";
    };
    Object.defineProperty(ADLNavRequestValid.prototype, "continue", {
        get: function () {
            return this._continue;
        },
        set: function (_continue) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            if (check2004ValidFormat(_continue, regex/* scorm2004_regex */.xt.NAVBoolean)) {
                this._continue = _continue;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ADLNavRequestValid.prototype, "previous", {
        get: function () {
            return this._previous;
        },
        set: function (_previous) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            if (check2004ValidFormat(_previous, regex/* scorm2004_regex */.xt.NAVBoolean)) {
                this._previous = _previous;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ADLNavRequestValid.prototype, "choice", {
        get: function () {
            return this._choice;
        },
        set: function (choice) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            if (typeof choice !== "object") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            for (var key in choice) {
                if ({}.hasOwnProperty.call(choice, key)) {
                    if (check2004ValidFormat(choice[key], regex/* scorm2004_regex */.xt.NAVBoolean) &&
                        check2004ValidFormat(key, regex/* scorm2004_regex */.xt.NAVTarget)) {
                        this._choice[key] =
                            enums/* NAVBoolean */.K$[choice[key]];
                    }
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ADLNavRequestValid.prototype, "jump", {
        get: function () {
            return this._jump;
        },
        set: function (jump) {
            if (this.initialized) {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            if (typeof jump !== "object") {
                throw new Scorm2004ValidationError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            for (var key in jump) {
                if ({}.hasOwnProperty.call(jump, key)) {
                    if (check2004ValidFormat(jump[key], regex/* scorm2004_regex */.xt.NAVBoolean) &&
                        check2004ValidFormat(key, regex/* scorm2004_regex */.xt.NAVTarget)) {
                        this._jump[key] = enums/* NAVBoolean */.K$[jump[key]];
                    }
                }
            }
        },
        enumerable: false,
        configurable: true
    });
    ADLNavRequestValid.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            previous: this._previous,
            continue: this._continue,
            choice: this._choice,
            jump: this._jump,
        };
        delete this.jsonString;
        return result;
    };
    return ADLNavRequestValid;
}(base_cmi/* BaseCMI */.J));


;// ./src/constants/language_constants.ts
var ValidLanguages = [
    "aa",
    "ab",
    "ae",
    "af",
    "ak",
    "am",
    "an",
    "ar",
    "as",
    "av",
    "ay",
    "az",
    "ba",
    "be",
    "bg",
    "bh",
    "bi",
    "bm",
    "bn",
    "bo",
    "br",
    "bs",
    "ca",
    "ce",
    "ch",
    "co",
    "cr",
    "cs",
    "cu",
    "cv",
    "cy",
    "da",
    "de",
    "dv",
    "dz",
    "ee",
    "el",
    "en",
    "eo",
    "es",
    "et",
    "eu",
    "fa",
    "ff",
    "fi",
    "fj",
    "fo",
    "fr",
    "fy",
    "ga",
    "gd",
    "gl",
    "gn",
    "gu",
    "gv",
    "ha",
    "he",
    "hi",
    "ho",
    "hr",
    "ht",
    "hu",
    "hy",
    "hz",
    "ia",
    "id",
    "ie",
    "ig",
    "ii",
    "ik",
    "io",
    "is",
    "it",
    "iu",
    "ja",
    "jv",
    "ka",
    "kg",
    "ki",
    "kj",
    "kk",
    "kl",
    "km",
    "kn",
    "ko",
    "kr",
    "ks",
    "ku",
    "kv",
    "kw",
    "ky",
    "la",
    "lb",
    "lg",
    "li",
    "ln",
    "lo",
    "lt",
    "lu",
    "lv",
    "mg",
    "mh",
    "mi",
    "mk",
    "ml",
    "mn",
    "mo",
    "mr",
    "ms",
    "mt",
    "my",
    "na",
    "nb",
    "nd",
    "ne",
    "ng",
    "nl",
    "nn",
    "no",
    "nr",
    "nv",
    "ny",
    "oc",
    "oj",
    "om",
    "or",
    "os",
    "pa",
    "pi",
    "pl",
    "ps",
    "pt",
    "qu",
    "rm",
    "rn",
    "ro",
    "ru",
    "rw",
    "sa",
    "sc",
    "sd",
    "se",
    "sg",
    "sh",
    "si",
    "sk",
    "sl",
    "sm",
    "sn",
    "so",
    "sq",
    "sr",
    "ss",
    "st",
    "su",
    "sv",
    "sw",
    "ta",
    "te",
    "tg",
    "th",
    "ti",
    "tk",
    "tl",
    "tn",
    "to",
    "tr",
    "ts",
    "tt",
    "tw",
    "ty",
    "ug",
    "uk",
    "ur",
    "uz",
    "ve",
    "vi",
    "vo",
    "wa",
    "wo",
    "xh",
    "yi",
    "yo",
    "za",
    "zh",
    "zu",
    "aar",
    "abk",
    "ave",
    "afr",
    "aka",
    "amh",
    "arg",
    "ara",
    "asm",
    "ava",
    "aym",
    "aze",
    "bak",
    "bel",
    "bul",
    "bih",
    "bis",
    "bam",
    "ben",
    "tib",
    "bod",
    "bre",
    "bos",
    "cat",
    "che",
    "cha",
    "cos",
    "cre",
    "cze",
    "ces",
    "chu",
    "chv",
    "wel",
    "cym",
    "dan",
    "ger",
    "deu",
    "div",
    "dzo",
    "ewe",
    "gre",
    "ell",
    "eng",
    "epo",
    "spa",
    "est",
    "baq",
    "eus",
    "per",
    "fas",
    "ful",
    "fin",
    "fij",
    "fao",
    "fre",
    "fra",
    "fry",
    "gle",
    "gla",
    "glg",
    "grn",
    "guj",
    "glv",
    "hau",
    "heb",
    "hin",
    "hmo",
    "hrv",
    "hat",
    "hun",
    "arm",
    "hye",
    "her",
    "ina",
    "ind",
    "ile",
    "ibo",
    "iii",
    "ipk",
    "ido",
    "ice",
    "isl",
    "ita",
    "iku",
    "jpn",
    "jav",
    "geo",
    "kat",
    "kon",
    "kik",
    "kua",
    "kaz",
    "kal",
    "khm",
    "kan",
    "kor",
    "kau",
    "kas",
    "kur",
    "kom",
    "cor",
    "kir",
    "lat",
    "ltz",
    "lug",
    "lim",
    "lin",
    "lao",
    "lit",
    "lub",
    "lav",
    "mlg",
    "mah",
    "mao",
    "mri",
    "mac",
    "mkd",
    "mal",
    "mon",
    "mol",
    "mar",
    "may",
    "msa",
    "mlt",
    "bur",
    "mya",
    "nau",
    "nob",
    "nde",
    "nep",
    "ndo",
    "dut",
    "nld",
    "nno",
    "nor",
    "nbl",
    "nav",
    "nya",
    "oci",
    "oji",
    "orm",
    "ori",
    "oss",
    "pan",
    "pli",
    "pol",
    "pus",
    "por",
    "que",
    "roh",
    "run",
    "rum",
    "ron",
    "rus",
    "kin",
    "san",
    "srd",
    "snd",
    "sme",
    "sag",
    "slo",
    "sin",
    "slk",
    "slv",
    "smo",
    "sna",
    "som",
    "alb",
    "sqi",
    "srp",
    "ssw",
    "sot",
    "sun",
    "swe",
    "swa",
    "tam",
    "tel",
    "tgk",
    "tha",
    "tir",
    "tuk",
    "tgl",
    "tsn",
    "ton",
    "tur",
    "tso",
    "tat",
    "twi",
    "tah",
    "uig",
    "ukr",
    "urd",
    "uzb",
    "ven",
    "vie",
    "vol",
    "wln",
    "wol",
    "xho",
    "yid",
    "yor",
    "zha",
    "chi",
    "zho",
    "zul",
];
/* harmony default export */ var language_constants = (ValidLanguages);

;// ./src/scorm2004/validation.ts




function checkValidResponseType(response_type, value, interaction_type, throwSCORMError, checkCorrectResponseValue) {
    var nodes = [];
    if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
        nodes = String(value).split(response_type.delimiter);
    }
    else {
        nodes[0] = value;
    }
    if (nodes.length > 0 && nodes.length <= response_type.max) {
        checkCorrectResponseValue(interaction_type, nodes, value);
    }
    else if (nodes.length > response_type.max) {
        throwSCORMError(error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE, "Data Model Element Pattern Too Long");
    }
}
function checkDuplicateChoiceResponse(interaction, value, throwSCORMError, lastErrorCode) {
    var interaction_count = interaction.correct_responses._count;
    if (interaction.type === "choice") {
        for (var i = 0; i < interaction_count && lastErrorCode === "0"; i++) {
            var response = interaction.correct_responses.childArray[i];
            if (response.pattern === value) {
                throwSCORMError(error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE);
            }
        }
    }
}
function validateCorrectResponse(CMIElement, value, interaction, throwSCORMError, lastErrorCode, checkDuplicateChoiceResponseFn, checkValidResponseTypeFn, checkDuplicatedPatternFn, checkCorrectResponseValueFn) {
    var parts = CMIElement.split(".");
    var pattern_index = Number(parts[4]);
    var interaction_count = interaction.correct_responses._count;
    checkDuplicateChoiceResponseFn(interaction, value, throwSCORMError, lastErrorCode);
    var response_type = CorrectResponses[interaction.type];
    if (typeof response_type.limit === "undefined" ||
        interaction_count <= response_type.limit) {
        checkValidResponseTypeFn(response_type, value, interaction.type, throwSCORMError, checkCorrectResponseValueFn);
        if ((lastErrorCode === "0" &&
            (!response_type.duplicate ||
                !checkDuplicatedPatternFn(interaction.correct_responses, pattern_index, value))) ||
            (lastErrorCode === "0" && value === "")) {
        }
        else {
            if (lastErrorCode === "0") {
                throwSCORMError(error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE, "Data Model Element Pattern Already Exists");
            }
        }
    }
    else {
        throwSCORMError(error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE, "Data Model Element Collection Limit Reached");
    }
}
function checkDuplicatedPattern(correct_response, current_index, value) {
    var found = false;
    var count = correct_response._count;
    for (var i = 0; i < count && !found; i++) {
        if (i !== current_index && correct_response.childArray[i] === value) {
            found = true;
        }
    }
    return found;
}
function checkCorrectResponseValue(interaction_type, nodes, value, throwSCORMError, removeCorrectResponsePrefixes, lastErrorCode) {
    var response = CorrectResponses[interaction_type];
    var formatRegex = new RegExp(response.format);
    for (var i = 0; i < nodes.length && lastErrorCode === "0"; i++) {
        if (interaction_type.match("^(fill-in|long-fill-in|matching|performance|sequencing)$")) {
            nodes[i] = removeCorrectResponsePrefixes(nodes[i]);
        }
        if (response === null || response === void 0 ? void 0 : response.delimiter2) {
            var values = nodes[i].split(response.delimiter2);
            if (values.length === 2) {
                var matches = values[0].match(formatRegex);
                if (!matches) {
                    throwSCORMError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                }
                else {
                    if (!response.format2 ||
                        !values[1].match(new RegExp(response.format2))) {
                        throwSCORMError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                    }
                }
            }
            else {
                throwSCORMError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
        }
        else {
            var matches = nodes[i].match(formatRegex);
            if ((!matches && value !== "") ||
                (!matches && interaction_type === "true-false")) {
                throwSCORMError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            else {
                if (interaction_type === "numeric" && nodes.length > 1) {
                    if (Number(nodes[0]) > Number(nodes[1])) {
                        throwSCORMError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                    }
                }
                else {
                    if (nodes[i] !== "" && response.unique) {
                        for (var j = 0; j < i && lastErrorCode === "0"; j++) {
                            if (nodes[i] === nodes[j]) {
                                throwSCORMError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                            }
                        }
                    }
                }
            }
        }
    }
}
function removeCorrectResponsePrefixes(node, throwSCORMError) {
    var seenOrder = false;
    var seenCase = false;
    var seenLang = false;
    var prefixRegex = new RegExp("^({(lang|case_matters|order_matters)=([^}]+)})");
    var matches = node.match(prefixRegex);
    var langMatches = null;
    while (matches) {
        switch (matches[2]) {
            case "lang":
                langMatches = node.match(regex/* scorm2004_regex */.xt.CMILangcr);
                if (langMatches) {
                    var lang = langMatches[3];
                    if (lang !== undefined && lang.length > 0) {
                        if (!language_constants.includes(lang.toLowerCase())) {
                            throwSCORMError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                        }
                    }
                }
                seenLang = true;
                break;
            case "case_matters":
                if (!seenLang && !seenOrder && !seenCase) {
                    if (matches[3] !== "true" && matches[3] !== "false") {
                        throwSCORMError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                    }
                }
                seenCase = true;
                break;
            case "order_matters":
                if (!seenCase && !seenLang && !seenOrder) {
                    if (matches[3] !== "true" && matches[3] !== "false") {
                        throwSCORMError(error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                    }
                }
                seenOrder = true;
                break;
        }
        node = node.substring(matches[1].length);
        matches = node.match(prefixRegex);
    }
    return node;
}

;// ./src/scorm2004/cmi_element_handler.ts







function getChildElement(CMIElement, value, foundFirstIndex, createCorrectResponsesObject) {
    if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.objectives\\.\\d+")) {
        return new CMIObjectivesObject();
    }
    if (foundFirstIndex) {
        if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
            return createCorrectResponsesObject(CMIElement, value);
        }
        else if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")) {
            return new CMIInteractionsObjectivesObject();
        }
    }
    else if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.interactions\\.\\d+")) {
        return new CMIInteractionsObject();
    }
    if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.comments_from_learner\\.\\d+")) {
        return new CMICommentsObject();
    }
    else if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.comments_from_lms\\.\\d+")) {
        return new CMICommentsObject(true);
    }
    if ((0,utilities/* stringMatches */.J6)(CMIElement, "adl\\.data\\.\\d+")) {
        return new ADLDataObject();
    }
    return null;
}
function createCorrectResponsesObject(CMIElement, value, interactions, throwSCORMError, checkDuplicateChoiceResponse, checkValidResponseType, lastErrorCode, isInitialized, checkCorrectResponseValue) {
    var parts = CMIElement.split(".");
    var index = Number(parts[2]);
    var interaction = interactions[index];
    if (isInitialized) {
        if (typeof interaction === "undefined" || !interaction.type) {
            throwSCORMError(error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            return null;
        }
        else {
            checkDuplicateChoiceResponse(interaction, value, throwSCORMError, lastErrorCode);
            var response_type = CorrectResponses[interaction.type];
            if (response_type) {
                checkValidResponseType(response_type, value, interaction.type, throwSCORMError, checkCorrectResponseValue);
            }
            else {
                throwSCORMError(error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE, "Incorrect Response Type: " + interaction.type);
                return null;
            }
        }
    }
    if (lastErrorCode === "0") {
        return new CMIInteractionsCorrectResponsesObject();
    }
    return null;
}

;// ./src/scorm2004/cmi_value_handler.ts


function setCMIValue(CMIElement, value, commonSetCMIValue, globalObjectives, globalObjectiveIds, cmiObjectives) {
    if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.objectives\\.\\d+")) {
        var parts = CMIElement.split(".");
        var index = Number(parts[2]);
        var element_base = "cmi.objectives.".concat(index);
        var objective_id_1;
        var setting_id = (0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.objectives\\.\\d+\\.id");
        if (setting_id) {
            objective_id_1 = value;
        }
        else {
            var objective = cmiObjectives.findObjectiveByIndex(index);
            objective_id_1 = objective ? objective.id : undefined;
        }
        var is_global = objective_id_1 && globalObjectiveIds.includes(objective_id_1);
        if (is_global) {
            var global_index = globalObjectives.findIndex(function (obj) { return obj.id === objective_id_1; });
            if (global_index === -1) {
                global_index = globalObjectives.length;
                var newGlobalObjective = new CMIObjectivesObject();
                newGlobalObjective.id = objective_id_1;
                globalObjectives.push(newGlobalObjective);
            }
            var global_element = CMIElement.replace(element_base, "_globalObjectives.".concat(global_index));
            commonSetCMIValue("SetGlobalObjectiveValue", true, global_element, value);
        }
    }
    return commonSetCMIValue("SetValue", true, CMIElement, value);
}
function getCMIValue(CMIElement, commonGetCMIValue) {
    return commonGetCMIValue("GetValue", true, CMIElement);
}

;// ./src/scorm2004/data_serialization.ts




function renderCommitCMI(terminateCommit, cmi, settings, renderCMIToJSONObject) {
    var cmiExport = renderCMIToJSONObject();
    if (terminateCommit) {
        cmiExport.cmi.total_time = cmi.getCurrentTotalTime();
    }
    var result = [];
    var flattened = utilities/* flatten */.Bq(cmiExport);
    switch (settings.dataCommitFormat) {
        case "flattened":
            return utilities/* flatten */.Bq(cmiExport);
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
}
function renderCommitObject(terminateCommit, cmi, renderCommitCMIFn) {
    var cmiExport = renderCommitCMIFn(terminateCommit);
    var totalTimeDuration = cmi.getCurrentTotalTime();
    var totalTimeSeconds = utilities/* getDurationAsSeconds */.OI(totalTimeDuration, regex/* scorm2004_regex */.xt.CMITimespan);
    var completionStatus = enums/* CompletionStatus */.lC.UNKNOWN;
    var successStatus = enums/* SuccessStatus */.YE.UNKNOWN;
    if (cmi.completion_status) {
        if (cmi.completion_status === "completed") {
            completionStatus = enums/* CompletionStatus */.lC.COMPLETED;
        }
        else if (cmi.completion_status === "incomplete") {
            completionStatus = enums/* CompletionStatus */.lC.INCOMPLETE;
        }
    }
    if (cmi.success_status) {
        if (cmi.success_status === "passed") {
            successStatus = enums/* SuccessStatus */.YE.PASSED;
        }
        else if (cmi.success_status === "failed") {
            successStatus = enums/* SuccessStatus */.YE.FAILED;
        }
    }
    var score = cmi.score;
    var scoreObject = null;
    if (score) {
        scoreObject = {};
        if (!Number.isNaN(Number.parseFloat(score.raw))) {
            scoreObject.raw = Number.parseFloat(score.raw);
        }
        if (!Number.isNaN(Number.parseFloat(score.min))) {
            scoreObject.min = Number.parseFloat(score.min);
        }
        if (!Number.isNaN(Number.parseFloat(score.max))) {
            scoreObject.max = Number.parseFloat(score.max);
        }
        if (!Number.isNaN(Number.parseFloat(score.scaled))) {
            scoreObject.scaled = Number.parseFloat(score.scaled);
        }
    }
    var commitObject = {
        completionStatus: completionStatus,
        successStatus: successStatus,
        totalTimeSeconds: totalTimeSeconds,
        runtimeData: cmiExport,
    };
    if (scoreObject) {
        commitObject.score = scoreObject;
    }
    return commitObject;
}
function storeData(terminateCommit, cmi, adl, startingData, settings, getCommitObject, processHttpRequest, processListeners) {
    return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function () {
        var navRequest, commitObject, result;
        var _a, _b;
        return (0,tslib_es6/* __generator */.YH)(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (terminateCommit) {
                        if (cmi.mode === "normal") {
                            if (cmi.credit === "credit") {
                                if (cmi.completion_threshold && cmi.progress_measure) {
                                    if (cmi.progress_measure >= cmi.completion_threshold) {
                                        cmi.completion_status = "completed";
                                    }
                                    else {
                                        cmi.completion_status = "incomplete";
                                    }
                                }
                                if (cmi.scaled_passing_score && cmi.score.scaled) {
                                    if (cmi.score.scaled >= cmi.scaled_passing_score) {
                                        cmi.success_status = "passed";
                                    }
                                    else {
                                        cmi.success_status = "failed";
                                    }
                                }
                            }
                        }
                    }
                    navRequest = false;
                    if (adl.nav.request !== ((_b = (_a = startingData === null || startingData === void 0 ? void 0 : startingData.adl) === null || _a === void 0 ? void 0 : _a.nav) === null || _b === void 0 ? void 0 : _b.request) &&
                        adl.nav.request !== "_none_") {
                        navRequest = true;
                    }
                    commitObject = getCommitObject(terminateCommit);
                    if (!(typeof settings.lmsCommitUrl === "string")) return [3, 2];
                    return [4, processHttpRequest(settings.lmsCommitUrl, {
                            commitObject: commitObject,
                        }, terminateCommit)];
                case 1:
                    result = _c.sent();
                    if (navRequest &&
                        result.navRequest !== undefined &&
                        result.navRequest !== "") {
                        Function("\"use strict\";(() => { ".concat(result.navRequest, " })()"))();
                    }
                    else if ((result === null || result === void 0 ? void 0 : result.navRequest) && !navRequest) {
                        if (result.navRequest.name) {
                            processListeners(result.navRequest.name, result.navRequest.data);
                        }
                    }
                    return [2, result];
                case 2: return [2, {
                        result: "true",
                        errorCode: 0,
                    }];
            }
        });
    });
}

;// ./src/Scorm2004API.ts












var Scorm2004Impl = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(Scorm2004Impl, _super);
    function Scorm2004Impl(settings) {
        var _this = this;
        if (settings) {
            if (settings.mastery_override === undefined) {
                settings.mastery_override = false;
            }
        }
        _this = _super.call(this, error_codes/* scorm2004_errors */.Rf, settings) || this;
        _this._version = "1.0";
        _this._globalObjectives = [];
        _this.cmi = new CMI();
        _this.adl = new ADL();
        _this.Initialize = _this.lmsInitialize;
        _this.Terminate = _this.lmsFinish;
        _this.GetValue = _this.lmsGetValue;
        _this.SetValue = _this.lmsSetValue;
        _this.Commit = _this.lmsCommit;
        _this.GetLastError = _this.lmsGetLastError;
        _this.GetErrorString = _this.lmsGetErrorString;
        _this.GetDiagnostic = _this.lmsGetDiagnostic;
        return _this;
    }
    Scorm2004Impl.prototype.reset = function (settings) {
        var _a, _b;
        this.commonReset(settings);
        (_a = this.cmi) === null || _a === void 0 ? void 0 : _a.reset();
        (_b = this.adl) === null || _b === void 0 ? void 0 : _b.reset();
    };
    Object.defineProperty(Scorm2004Impl.prototype, "version", {
        get: function () {
            return this._version;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Scorm2004Impl.prototype, "globalObjectives", {
        get: function () {
            return this._globalObjectives;
        },
        enumerable: false,
        configurable: true
    });
    Scorm2004Impl.prototype.lmsInitialize = function () {
        this.cmi.initialize();
        return this.initialize("Initialize", "LMS was already initialized!", "LMS is already finished!");
    };
    Scorm2004Impl.prototype.lmsFinish = function () {
        var _this = this;
        (function () { return (0,tslib_es6/* __awaiter */.sH)(_this, void 0, void 0, function () {
            return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.internalFinish()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); })();
        return api_constants/* global_constants */._y.SCORM_TRUE;
    };
    Scorm2004Impl.prototype.internalFinish = function () {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function () {
            var result, navActions, request, choiceJumpRegex, matches, target, action;
            var _a, _b, _c, _d;
            return (0,tslib_es6/* __generator */.YH)(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4, this.terminate("Terminate", true)];
                    case 1:
                        result = _e.sent();
                        if (result === api_constants/* global_constants */._y.SCORM_TRUE) {
                            if (this.adl.nav.request !== "_none_") {
                                navActions = {
                                    continue: "SequenceNext",
                                    previous: "SequencePrevious",
                                    choice: "SequenceChoice",
                                    jump: "SequenceJump",
                                    exit: "SequenceExit",
                                    exitAll: "SequenceExitAll",
                                    abandon: "SequenceAbandon",
                                    abandonAll: "SequenceAbandonAll",
                                };
                                request = this.adl.nav.request;
                                choiceJumpRegex = new RegExp(regex/* scorm2004_regex */.xt.NAVEvent);
                                matches = request.match(choiceJumpRegex);
                                target = "";
                                if (matches) {
                                    if ((_a = matches.groups) === null || _a === void 0 ? void 0 : _a.choice_target) {
                                        target = (_b = matches.groups) === null || _b === void 0 ? void 0 : _b.choice_target;
                                        request = "choice";
                                    }
                                    else if ((_c = matches.groups) === null || _c === void 0 ? void 0 : _c.jump_target) {
                                        target = (_d = matches.groups) === null || _d === void 0 ? void 0 : _d.jump_target;
                                        request = "jump";
                                    }
                                }
                                action = navActions[request];
                                if (action) {
                                    this.processListeners(action, "adl.nav.request", target);
                                }
                            }
                            else if (this.settings.autoProgress) {
                                this.processListeners("SequenceNext");
                            }
                        }
                        return [2, result];
                }
            });
        });
    };
    Scorm2004Impl.prototype.lmsGetValue = function (CMIElement) {
        var adlNavRequestRegex = "^adl\\.nav\\.request_valid\\.(choice|jump)\\.{target=\\S{0,}([a-zA-Z0-9-_]+)}$";
        if ((0,utilities/* stringMatches */.J6)(CMIElement, adlNavRequestRegex)) {
            var matches = CMIElement.match(adlNavRequestRegex);
            var request = matches[1];
            var target = matches[2].replace("{target=", "").replace("}", "");
            if (request === "choice" || request === "jump") {
                if (this.settings.scoItemIdValidator) {
                    return String(this.settings.scoItemIdValidator(target));
                }
                return String(this.settings.scoItemIds.includes(target));
            }
        }
        return this.getValue("GetValue", true, CMIElement);
    };
    Scorm2004Impl.prototype.lmsSetValue = function (CMIElement, value) {
        return this.setValue("SetValue", "Commit", true, CMIElement, value);
    };
    Scorm2004Impl.prototype.lmsCommit = function () {
        var _this = this;
        if (this.settings.asyncCommit) {
            this.scheduleCommit(500, "Commit");
        }
        else {
            (function () { return (0,tslib_es6/* __awaiter */.sH)(_this, void 0, void 0, function () {
                return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.commit("Commit", false)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); })();
        }
        return api_constants/* global_constants */._y.SCORM_TRUE;
    };
    Scorm2004Impl.prototype.lmsGetLastError = function () {
        return this.getLastError("GetLastError");
    };
    Scorm2004Impl.prototype.lmsGetErrorString = function (CMIErrorCode) {
        return this.getErrorString("GetErrorString", CMIErrorCode);
    };
    Scorm2004Impl.prototype.lmsGetDiagnostic = function (CMIErrorCode) {
        return this.getDiagnostic("GetDiagnostic", CMIErrorCode);
    };
    Scorm2004Impl.prototype.setCMIValue = function (CMIElement, value) {
        return setCMIValue(CMIElement, value, this._commonSetCMIValue.bind(this), this._globalObjectives, this.settings.globalObjectiveIds, this.cmi.objectives);
    };
    Scorm2004Impl.prototype.getChildElement = function (CMIElement, value, foundFirstIndex) {
        return getChildElement(CMIElement, value, foundFirstIndex, this.createCorrectResponsesObject.bind(this));
    };
    Scorm2004Impl.prototype.createCorrectResponsesObject = function (CMIElement, value) {
        return createCorrectResponsesObject(CMIElement, value, this.cmi.interactions.childArray, this.throwSCORMError.bind(this), this.checkDuplicateChoiceResponse.bind(this), this.checkValidResponseType.bind(this), this.lastErrorCode, this.isInitialized(), this.checkCorrectResponseValue.bind(this));
    };
    Scorm2004Impl.prototype.checkValidResponseType = function (response_type, value, interaction_type) {
        checkValidResponseType(response_type, value, interaction_type, this.throwSCORMError.bind(this), this.checkCorrectResponseValue.bind(this));
    };
    Scorm2004Impl.prototype.checkDuplicateChoiceResponse = function (interaction, value) {
        checkDuplicateChoiceResponse(interaction, value, this.throwSCORMError.bind(this), this.lastErrorCode);
    };
    Scorm2004Impl.prototype.validateCorrectResponse = function (CMIElement, value) {
        var parts = CMIElement.split(".");
        var index = Number(parts[2]);
        var interaction = this.cmi.interactions.childArray[index];
        validateCorrectResponse(CMIElement, value, interaction, this.throwSCORMError.bind(this), this.lastErrorCode, this.checkDuplicateChoiceResponse.bind(this), this.checkValidResponseType.bind(this), this.checkDuplicatedPattern.bind(this), this.checkCorrectResponseValue.bind(this));
    };
    Scorm2004Impl.prototype.getCMIValue = function (CMIElement) {
        return getCMIValue(CMIElement, this._commonGetCMIValue.bind(this));
    };
    Scorm2004Impl.prototype.getLmsErrorMessageDetails = function (errorNumber, detail) {
        var basicMessage = "";
        var detailMessage = "";
        errorNumber = String(errorNumber);
        if (api_constants/* scorm2004_constants */.zR.error_descriptions[errorNumber]) {
            basicMessage =
                api_constants/* scorm2004_constants */.zR.error_descriptions[errorNumber].basicMessage;
            detailMessage =
                api_constants/* scorm2004_constants */.zR.error_descriptions[errorNumber].detailMessage;
        }
        return detail ? detailMessage : basicMessage;
    };
    Scorm2004Impl.prototype.checkDuplicatedPattern = function (correct_response, current_index, value) {
        return checkDuplicatedPattern(correct_response, current_index, value);
    };
    Scorm2004Impl.prototype.checkCorrectResponseValue = function (interaction_type, nodes, value) {
        checkCorrectResponseValue(interaction_type, nodes, value, this.throwSCORMError.bind(this), this.removeCorrectResponsePrefixes.bind(this), this.lastErrorCode);
    };
    Scorm2004Impl.prototype.removeCorrectResponsePrefixes = function (node) {
        return removeCorrectResponsePrefixes(node, this.throwSCORMError.bind(this));
    };
    Scorm2004Impl.prototype.replaceWithAnotherScormAPI = function (newAPI) {
        this.cmi = newAPI.cmi;
        this.adl = newAPI.adl;
    };
    Scorm2004Impl.prototype.renderCommitCMI = function (terminateCommit) {
        return renderCommitCMI(terminateCommit, this.cmi, this.settings, this.renderCMIToJSONObject.bind(this));
    };
    Scorm2004Impl.prototype.renderCommitObject = function (terminateCommit) {
        return renderCommitObject(terminateCommit, this.cmi, this.renderCommitCMI.bind(this));
    };
    Scorm2004Impl.prototype.storeData = function (terminateCommit) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function () {
            return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                return [2, storeData(terminateCommit, this.cmi, this.adl, this.startingData, this.settings, this.getCommitObject.bind(this), this.processHttpRequest.bind(this), this.processListeners.bind(this))];
            });
        });
    };
    return Scorm2004Impl;
}(BaseAPI/* default */.A));



/***/ }),

/***/ 941:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: function() { return /* binding */ Scorm12Impl; }
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(635);
/* harmony import */ var _cmi_scorm12_cmi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(989);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(864);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(340);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(797);
/* harmony import */ var _cmi_scorm12_objectives__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(176);
/* harmony import */ var _cmi_scorm12_interactions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(833);
/* harmony import */ var _cmi_scorm12_nav__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(331);
/* harmony import */ var _constants_enums__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(56);
/* harmony import */ var _BaseAPI__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(273);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(417);












var Scorm12Impl = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_10__/* .__extends */ .C6)(Scorm12Impl, _super);
    function Scorm12Impl(settings) {
        var _this = this;
        if (settings) {
            if (settings.mastery_override === undefined) {
                settings.mastery_override = false;
            }
        }
        _this = _super.call(this, _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se, settings) || this;
        _this.statusSetByModule = false;
        _this.cmi = new _cmi_scorm12_cmi__WEBPACK_IMPORTED_MODULE_0__/* .CMI */ .Y();
        _this.nav = new _cmi_scorm12_nav__WEBPACK_IMPORTED_MODULE_6__/* .NAV */ .A();
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
    Scorm12Impl.prototype.reset = function (settings) {
        var _a, _b;
        this.commonReset(settings);
        (_a = this.cmi) === null || _a === void 0 ? void 0 : _a.reset();
        (_b = this.nav) === null || _b === void 0 ? void 0 : _b.reset();
    };
    Scorm12Impl.prototype.lmsInitialize = function () {
        this.cmi.initialize();
        if (this.cmi.core.lesson_status) {
            this.statusSetByModule = true;
        }
        else {
            this.cmi.core.lesson_status = "not attempted";
        }
        return this.initialize("LMSInitialize", "LMS was already initialized!", "LMS is already finished!");
    };
    Scorm12Impl.prototype.lmsFinish = function () {
        var _this = this;
        (function () { return (0,tslib__WEBPACK_IMPORTED_MODULE_10__/* .__awaiter */ .sH)(_this, void 0, void 0, function () {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_10__/* .__generator */ .YH)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.internalFinish()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); })();
        return _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__/* .global_constants */ ._y.SCORM_TRUE;
    };
    Scorm12Impl.prototype.internalFinish = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_10__/* .__awaiter */ .sH)(this, void 0, void 0, function () {
            var result;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_10__/* .__generator */ .YH)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.terminate("LMSFinish", true)];
                    case 1:
                        result = _a.sent();
                        if (result === _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__/* .global_constants */ ._y.SCORM_TRUE) {
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
                        return [2, result];
                }
            });
        });
    };
    Scorm12Impl.prototype.lmsGetValue = function (CMIElement) {
        return this.getValue("LMSGetValue", false, CMIElement);
    };
    Scorm12Impl.prototype.lmsSetValue = function (CMIElement, value) {
        if (CMIElement === "cmi.core.lesson_status") {
            this.statusSetByModule = true;
        }
        return this.setValue("LMSSetValue", "LMSCommit", false, CMIElement, value);
    };
    Scorm12Impl.prototype.lmsCommit = function () {
        var _this = this;
        if (this.settings.asyncCommit) {
            this.scheduleCommit(500, "LMSCommit");
        }
        else {
            (function () { return (0,tslib__WEBPACK_IMPORTED_MODULE_10__/* .__awaiter */ .sH)(_this, void 0, void 0, function () {
                return (0,tslib__WEBPACK_IMPORTED_MODULE_10__/* .__generator */ .YH)(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.commit("LMSCommit", false)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); })();
        }
        return _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__/* .global_constants */ ._y.SCORM_TRUE;
    };
    Scorm12Impl.prototype.lmsGetLastError = function () {
        return this.getLastError("LMSGetLastError");
    };
    Scorm12Impl.prototype.lmsGetErrorString = function (CMIErrorCode) {
        return this.getErrorString("LMSGetErrorString", CMIErrorCode);
    };
    Scorm12Impl.prototype.lmsGetDiagnostic = function (CMIErrorCode) {
        return this.getDiagnostic("LMSGetDiagnostic", CMIErrorCode);
    };
    Scorm12Impl.prototype.setCMIValue = function (CMIElement, value) {
        return this._commonSetCMIValue("LMSSetValue", false, CMIElement, value);
    };
    Scorm12Impl.prototype.getCMIValue = function (CMIElement) {
        return this._commonGetCMIValue("getCMIValue", false, CMIElement);
    };
    Scorm12Impl.prototype.getChildElement = function (CMIElement, _value, foundFirstIndex) {
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_1__/* .stringMatches */ .J6)(CMIElement, "cmi\\.objectives\\.\\d+")) {
            return new _cmi_scorm12_objectives__WEBPACK_IMPORTED_MODULE_4__/* .CMIObjectivesObject */ .N();
        }
        else if (foundFirstIndex &&
            (0,_utilities__WEBPACK_IMPORTED_MODULE_1__/* .stringMatches */ .J6)(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
            return new _cmi_scorm12_interactions__WEBPACK_IMPORTED_MODULE_5__/* .CMIInteractionsCorrectResponsesObject */ .cb();
        }
        else if (foundFirstIndex &&
            (0,_utilities__WEBPACK_IMPORTED_MODULE_1__/* .stringMatches */ .J6)(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")) {
            return new _cmi_scorm12_interactions__WEBPACK_IMPORTED_MODULE_5__/* .CMIInteractionsObjectivesObject */ .Oh();
        }
        else if (!foundFirstIndex &&
            (0,_utilities__WEBPACK_IMPORTED_MODULE_1__/* .stringMatches */ .J6)(CMIElement, "cmi\\.interactions\\.\\d+")) {
            return new _cmi_scorm12_interactions__WEBPACK_IMPORTED_MODULE_5__/* .CMIInteractionsObject */ .WP();
        }
        return null;
    };
    Scorm12Impl.prototype.validateCorrectResponse = function (_CMIElement, _value) {
    };
    Scorm12Impl.prototype.getLmsErrorMessageDetails = function (errorNumber, detail) {
        var basicMessage = "No Error";
        var detailMessage = "No Error";
        errorNumber = String(errorNumber);
        if (_constants_api_constants__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_constants */ .QP.error_descriptions[errorNumber]) {
            basicMessage =
                _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_constants */ .QP.error_descriptions[errorNumber].basicMessage;
            detailMessage =
                _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_constants */ .QP.error_descriptions[errorNumber].detailMessage;
        }
        return detail ? detailMessage : basicMessage;
    };
    Scorm12Impl.prototype.replaceWithAnotherScormAPI = function (newAPI) {
        this.cmi = newAPI.cmi;
    };
    Scorm12Impl.prototype.renderCommitCMI = function (terminateCommit) {
        var cmiExport = this.renderCMIToJSONObject();
        if (terminateCommit) {
            cmiExport.cmi.core.total_time = this.cmi.getCurrentTotalTime();
        }
        var result = [];
        var flattened = _utilities__WEBPACK_IMPORTED_MODULE_1__/* .flatten */ .Bq(cmiExport);
        switch (this.settings.dataCommitFormat) {
            case "flattened":
                return _utilities__WEBPACK_IMPORTED_MODULE_1__/* .flatten */ .Bq(cmiExport);
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
    Scorm12Impl.prototype.renderCommitObject = function (terminateCommit) {
        var cmiExport = this.renderCommitCMI(terminateCommit);
        var totalTimeHHMMSS = this.cmi.getCurrentTotalTime();
        var totalTimeSeconds = _utilities__WEBPACK_IMPORTED_MODULE_1__/* .getTimeAsSeconds */ .f4(totalTimeHHMMSS, _constants_regex__WEBPACK_IMPORTED_MODULE_9__/* .scorm12_regex */ .kS.CMITimespan);
        var lessonStatus = this.cmi.core.lesson_status;
        var completionStatus = _constants_enums__WEBPACK_IMPORTED_MODULE_7__/* .CompletionStatus */ .lC.UNKNOWN;
        var successStatus = _constants_enums__WEBPACK_IMPORTED_MODULE_7__/* .SuccessStatus */ .YE.UNKNOWN;
        if (lessonStatus) {
            completionStatus =
                lessonStatus === "completed" || lessonStatus === "passed"
                    ? _constants_enums__WEBPACK_IMPORTED_MODULE_7__/* .CompletionStatus */ .lC.COMPLETED
                    : _constants_enums__WEBPACK_IMPORTED_MODULE_7__/* .CompletionStatus */ .lC.INCOMPLETE;
            if (lessonStatus === "passed") {
                successStatus = _constants_enums__WEBPACK_IMPORTED_MODULE_7__/* .SuccessStatus */ .YE.PASSED;
            }
            else if (lessonStatus === "failed") {
                successStatus = _constants_enums__WEBPACK_IMPORTED_MODULE_7__/* .SuccessStatus */ .YE.FAILED;
            }
        }
        var score = this.cmi.core.score;
        var scoreObject = null;
        if (score) {
            scoreObject = {};
            if (!Number.isNaN(Number.parseFloat(score.raw))) {
                scoreObject.raw = Number.parseFloat(score.raw);
            }
            if (!Number.isNaN(Number.parseFloat(score.min))) {
                scoreObject.min = Number.parseFloat(score.min);
            }
            if (!Number.isNaN(Number.parseFloat(score.max))) {
                scoreObject.max = Number.parseFloat(score.max);
            }
        }
        var commitObject = {
            successStatus: successStatus,
            completionStatus: completionStatus,
            runtimeData: cmiExport,
            totalTimeSeconds: totalTimeSeconds,
        };
        if (scoreObject) {
            commitObject.score = scoreObject;
        }
        return commitObject;
    };
    Scorm12Impl.prototype.storeData = function (terminateCommit) {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_10__/* .__awaiter */ .sH)(this, void 0, void 0, function () {
            var originalStatus, commitObject;
            var _a, _b, _c;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_10__/* .__generator */ .YH)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (terminateCommit) {
                            originalStatus = this.cmi.core.lesson_status;
                            if (!this.cmi.core.lesson_status ||
                                (!this.statusSetByModule &&
                                    this.cmi.core.lesson_status === "not attempted")) {
                                this.cmi.core.lesson_status = "completed";
                            }
                            if (this.cmi.core.lesson_mode === "normal") {
                                if (this.cmi.core.credit === "credit") {
                                    if (this.settings.mastery_override &&
                                        this.cmi.student_data.mastery_score !== "" &&
                                        this.cmi.core.score.raw !== "") {
                                        this.cmi.core.lesson_status =
                                            parseFloat(this.cmi.core.score.raw) >=
                                                parseFloat(this.cmi.student_data.mastery_score)
                                                ? "passed"
                                                : "failed";
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
                        commitObject = this.getCommitObject(terminateCommit);
                        if (!(typeof this.settings.lmsCommitUrl === "string")) return [3, 2];
                        return [4, this.processHttpRequest(this.settings.lmsCommitUrl, commitObject, terminateCommit)];
                    case 1: return [2, _d.sent()];
                    case 2: return [2, {
                            result: _constants_api_constants__WEBPACK_IMPORTED_MODULE_2__/* .global_constants */ ._y.SCORM_TRUE,
                            errorCode: 0,
                        }];
                }
            });
        });
    };
    return Scorm12Impl;
}(_BaseAPI__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .A));



/***/ }),

/***/ 989:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Y: function() { return /* binding */ CMI; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(635);
// EXTERNAL MODULE: ./src/constants/api_constants.ts
var api_constants = __webpack_require__(340);
// EXTERNAL MODULE: ./src/constants/error_codes.ts
var error_codes = __webpack_require__(797);
// EXTERNAL MODULE: ./src/constants/regex.ts
var regex = __webpack_require__(417);
// EXTERNAL MODULE: ./src/exceptions/scorm12_exceptions.ts
var scorm12_exceptions = __webpack_require__(179);
// EXTERNAL MODULE: ./src/cmi/common/base_cmi.ts
var base_cmi = __webpack_require__(319);
// EXTERNAL MODULE: ./src/cmi/scorm12/validation.ts
var validation = __webpack_require__(915);
// EXTERNAL MODULE: ./src/cmi/common/score.ts
var score = __webpack_require__(434);
// EXTERNAL MODULE: ./src/utilities.ts
var utilities = __webpack_require__(864);
;// ./src/cmi/aicc/core.ts









var CMICore = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMICore, _super);
    function CMICore() {
        var _this = _super.call(this) || this;
        _this.__children = api_constants/* scorm12_constants */.QP.core_children;
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
        _this.score = new score/* CMIScore */._({
            score_children: api_constants/* scorm12_constants */.QP.score_children,
            score_range: regex/* scorm12_regex */.kS.score_range,
            invalidErrorCode: error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE,
            invalidTypeCode: error_codes/* scorm12_errors */.Se.TYPE_MISMATCH,
            invalidRangeCode: error_codes/* scorm12_errors */.Se.VALUE_OUT_OF_RANGE,
            errorClass: scorm12_exceptions/* Scorm12ValidationError */.t,
        });
        return _this;
    }
    CMICore.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        (_a = this.score) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    CMICore.prototype.reset = function () {
        var _a;
        this._initialized = false;
        this._exit = "";
        this._entry = "";
        this._session_time = "00:00:00";
        (_a = this.score) === null || _a === void 0 ? void 0 : _a.reset();
    };
    Object.defineProperty(CMICore.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
            if ((0,validation/* check12ValidFormat */.p)(lesson_location, regex/* scorm12_regex */.kS.CMIString256, true)) {
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                if ((0,validation/* check12ValidFormat */.p)(lesson_status, regex/* scorm12_regex */.kS.CMIStatus)) {
                    this._lesson_status = lesson_status;
                }
            }
            else {
                if ((0,validation/* check12ValidFormat */.p)(lesson_status, regex/* scorm12_regex */.kS.CMIStatus2)) {
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.WRITE_ONLY_ELEMENT);
            }
            return this._exit;
        },
        set: function (exit) {
            if ((0,validation/* check12ValidFormat */.p)(exit, regex/* scorm12_regex */.kS.CMIExit, true)) {
                this._exit = exit;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "session_time", {
        get: function () {
            if (!this.jsonString) {
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.WRITE_ONLY_ELEMENT);
            }
            return this._session_time;
        },
        set: function (session_time) {
            if ((0,validation/* check12ValidFormat */.p)(session_time, regex/* scorm12_regex */.kS.CMITimespan)) {
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
            if ((0,validation/* check12ValidFormat */.p)(suspend_data, regex/* scorm12_regex */.kS.CMIString4096, true)) {
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
            sessionTime = utilities/* getSecondsAsHHMMSS */.UZ(seconds / 1000);
        }
        return utilities/* addHHMMSSTimeStrings */.HT(this._total_time, sessionTime, new RegExp(regex/* scorm12_regex */.kS.CMITimespan));
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
}(base_cmi/* BaseCMI */.J));


// EXTERNAL MODULE: ./src/cmi/scorm12/objectives.ts
var objectives = __webpack_require__(176);
// EXTERNAL MODULE: ./src/cmi/scorm12/student_data.ts
var scorm12_student_data = __webpack_require__(532);
// EXTERNAL MODULE: ./src/cmi/scorm12/student_preference.ts
var student_preference = __webpack_require__(181);
// EXTERNAL MODULE: ./src/cmi/scorm12/interactions.ts
var interactions = __webpack_require__(833);
;// ./src/cmi/scorm12/cmi.ts












var CMI = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMI, _super);
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
            : api_constants/* scorm12_constants */.QP.cmi_children;
        _this.core = new CMICore();
        _this.objectives = new objectives/* CMIObjectives */.C();
        _this.student_data = student_data ? student_data : new scorm12_student_data/* CMIStudentData */.X();
        _this.student_preference = new student_preference/* CMIStudentPreference */.G();
        _this.interactions = new interactions/* CMIInteractions */.Xb();
        return _this;
    }
    CMI.prototype.reset = function () {
        var _a, _b, _c;
        this._initialized = false;
        this._launch_data = "";
        this._comments = "";
        (_a = this.core) === null || _a === void 0 ? void 0 : _a.reset();
        this.objectives = new objectives/* CMIObjectives */.C();
        this.interactions = new interactions/* CMIInteractions */.Xb();
        (_b = this.student_data) === null || _b === void 0 ? void 0 : _b.reset();
        (_c = this.student_preference) === null || _c === void 0 ? void 0 : _c.reset();
    };
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
            throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
            if ((0,validation/* check12ValidFormat */.p)(comments, regex/* scorm12_regex */.kS.CMIString4096, true)) {
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
}(base_cmi/* BaseRootCMI */.r));



/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ !function() {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = function(exports, definition) {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ }();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ !function() {
/******/ 	__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ }();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VE: function() { return /* reexport safe */ _Scorm2004API__WEBPACK_IMPORTED_MODULE_2__.V; },
/* harmony export */   Yq: function() { return /* reexport safe */ _Scorm12API__WEBPACK_IMPORTED_MODULE_1__.Y; },
/* harmony export */   jr: function() { return /* reexport safe */ _AICC__WEBPACK_IMPORTED_MODULE_0__.j; }
/* harmony export */ });
/* harmony import */ var _AICC__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(916);
/* harmony import */ var _Scorm12API__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(941);
/* harmony import */ var _Scorm2004API__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(918);





var __webpack_exports__AICC = __webpack_exports__.jr;
var __webpack_exports__Scorm12API = __webpack_exports__.Yq;
var __webpack_exports__Scorm2004API = __webpack_exports__.VE;
export { __webpack_exports__AICC as AICC, __webpack_exports__Scorm12API as Scorm12API, __webpack_exports__Scorm2004API as Scorm2004API };

//# sourceMappingURL=scorm-again.js.map