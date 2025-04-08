/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 12:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Se: () => (/* binding */ scorm12_errors)
/* harmony export */ });
/* unused harmony exports global_errors, scorm2004_errors */
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

/***/ 34:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   G: () => (/* binding */ CMIStudentPreference)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(166);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(441);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(878);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(888);






var CMIStudentPreference = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIStudentPreference, _super);
    function CMIStudentPreference(student_preference_children) {
        var _this = _super.call(this, "cmi.student_preference") || this;
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
            throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t(this._cmi_element + "._children", _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentPreference.prototype, "audio", {
        get: function () {
            return this._audio;
        },
        set: function (audio) {
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScorm12Audio(this._cmi_element + ".audio", audio)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScorm12Language(this._cmi_element + ".language", language)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScorm12Speed(this._cmi_element + ".speed", speed)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScorm12Text(this._cmi_element + ".text", text)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_5__/* .BaseCMI */ .J));



/***/ }),

/***/ 64:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   kS: () => (/* binding */ scorm12_regex)
/* harmony export */ });
/* unused harmony exports aicc_regex, scorm2004_regex */
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
    CMITime: "^(19[7-9]{1}[0-9]{1}|20[0-2]{1}[0-9]{1}|203[0-8]{1})((-(0[1-9]{1}|1[0-2]{1}))((-(0[1-9]{1}|[1-2]{1}[0-9]{1}|3[0-1]{1}))(T([0-1]{1}[0-9]{1}|2[0-3]{1})((:[0-5]{1}[0-9]{1})((:[0-5]{1}[0-9]{1})((\\.[0-9]{1,6})((Z|([+|-]([0-1]{1}[0-9]{1}|2[0-3]{1})))(:[0-5]{1}[0-9]{1})?)?)?)?)?)?)?)?$",
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
    audio_range: "0#999.9999999",
    speed_range: "0#999.9999999",
    text_range: "-1#1",
    progress_range: "0#1",
};


/***/ }),

/***/ 144:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ checkValidRange),
/* harmony export */   q: () => (/* binding */ checkValidFormat)
/* harmony export */ });
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(557);

var checkValidFormat = (0,_utilities__WEBPACK_IMPORTED_MODULE_0__/* .memoize */ .Bj)(function (CMIElement, value, regexPattern, errorCode, errorClass, allowEmptyString) {
    if (typeof value !== "string") {
        return false;
    }
    var formatRegex = new RegExp(regexPattern);
    var matches = value.match(formatRegex);
    if (allowEmptyString && value === "") {
        return true;
    }
    if (value === undefined || !matches || matches[0] === "") {
        throw new errorClass(CMIElement, errorCode);
    }
    return true;
}, function (CMIElement, value, regexPattern, errorCode, _errorClass, allowEmptyString) {
    var valueKey = typeof value === "string" ? value : "[".concat(typeof value, "]");
    return "".concat(CMIElement, ":").concat(valueKey, ":").concat(regexPattern, ":").concat(errorCode, ":").concat(allowEmptyString || false);
});
var checkValidRange = (0,_utilities__WEBPACK_IMPORTED_MODULE_0__/* .memoize */ .Bj)(function (CMIElement, value, rangePattern, errorCode, errorClass) {
    var ranges = rangePattern.split("#");
    value = value * 1.0;
    if (value >= ranges[0]) {
        if (ranges[1] === "*" || value <= ranges[1]) {
            return true;
        }
        else {
            throw new errorClass(CMIElement, errorCode);
        }
    }
    else {
        throw new errorClass(CMIElement, errorCode);
    }
}, function (CMIElement, value, rangePattern, errorCode, _errorClass) {
    return "".concat(CMIElement, ":").concat(value, ":").concat(rangePattern, ":").concat(errorCode);
});


/***/ }),

/***/ 166:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   J: () => (/* binding */ BaseCMI),
/* harmony export */   r: () => (/* binding */ BaseRootCMI)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);

var BaseCMI = (function () {
    function BaseCMI(cmi_element) {
        this.jsonString = false;
        this._initialized = false;
        this._cmi_element = cmi_element;
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

/***/ 209:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ CMIScore)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(441);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64);
/* harmony import */ var _base_cmi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(166);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(888);






var CMIScore = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIScore, _super);
    function CMIScore(params) {
        var _this = _super.call(this, params.CMIElement) || this;
        _this._raw = "";
        _this._min = "";
        _this.__children = params.score_children || _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.score_children;
        _this.__score_range = !params.score_range ? false : _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.score_range;
        _this._max = params.max || params.max === "" ? params.max : "100";
        _this.__invalid_error_code = params.invalidErrorCode || _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.INVALID_SET_VALUE;
        _this.__invalid_type_code = params.invalidTypeCode || _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.TYPE_MISMATCH;
        _this.__invalid_range_code = params.invalidRangeCode || _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.VALUE_OUT_OF_RANGE;
        _this.__decimal_regex = params.decimalRegex || _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.CMIDecimal;
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
            throw new this.__error_class(this._cmi_element + "._children", this.__invalid_error_code);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIScore.prototype, "raw", {
        get: function () {
            return this._raw;
        },
        set: function (raw) {
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScore(this._cmi_element + ".raw", raw, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScore(this._cmi_element + ".min", min, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class)) {
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
            if (_services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateScore(this._cmi_element + ".max", max, this.__decimal_regex, this.__score_range, this.__invalid_type_code, this.__invalid_range_code, this.__error_class)) {
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
}(_base_cmi__WEBPACK_IMPORTED_MODULE_5__/* .BaseCMI */ .J));



/***/ }),

/***/ 251:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X: () => (/* binding */ CMIStudentData)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(166);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(441);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(878);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);
/* harmony import */ var _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(888);






var CMIStudentData = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIStudentData, _super);
    function CMIStudentData(student_data_children) {
        var _this = _super.call(this, "cmi.student_data") || this;
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
            throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t(this._cmi_element + "._children", _constants_error_codes__WEBPACK_IMPORTED_MODULE_3__/* .scorm12_errors */ .Se.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIStudentData.prototype, "mastery_score", {
        get: function () {
            return this._mastery_score;
        },
        set: function (mastery_score) {
            _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateReadOnly(this._cmi_element + ".mastery_score", this.initialized);
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
            _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateReadOnly(this._cmi_element + ".max_time_allowed", this.initialized);
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
            _services_ValidationService__WEBPACK_IMPORTED_MODULE_4__/* .validationService */ .v.validateReadOnly(this._cmi_element + ".time_limit_action", this.initialized);
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_5__/* .BaseCMI */ .J));



/***/ }),

/***/ 368:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Y: () => (/* binding */ CMI)
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(635);
// EXTERNAL MODULE: ./src/constants/api_constants.ts
var api_constants = __webpack_require__(441);
// EXTERNAL MODULE: ./src/constants/error_codes.ts
var error_codes = __webpack_require__(12);
// EXTERNAL MODULE: ./src/constants/regex.ts
var regex = __webpack_require__(64);
// EXTERNAL MODULE: ./src/exceptions/scorm12_exceptions.ts
var scorm12_exceptions = __webpack_require__(878);
// EXTERNAL MODULE: ./src/cmi/common/base_cmi.ts
var base_cmi = __webpack_require__(166);
// EXTERNAL MODULE: ./src/cmi/scorm12/validation.ts
var validation = __webpack_require__(392);
// EXTERNAL MODULE: ./src/cmi/common/score.ts
var score = __webpack_require__(209);
// EXTERNAL MODULE: ./src/utilities.ts
var utilities = __webpack_require__(557);
;// ./src/cmi/aicc/core.ts









var CMICore = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMICore, _super);
    function CMICore() {
        var _this = _super.call(this, "cmi.core") || this;
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
            CMIElement: "cmi.core.score",
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
            throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + "._children", error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".student_id", error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".student_name", error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
            if ((0,validation/* check12ValidFormat */.p)(this._cmi_element + ".lesson_location", lesson_location, regex/* scorm12_regex */.kS.CMIString256, true)) {
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".credit", error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                if ((0,validation/* check12ValidFormat */.p)(this._cmi_element + ".lesson_status", lesson_status, regex/* scorm12_regex */.kS.CMIStatus)) {
                    this._lesson_status = lesson_status;
                }
            }
            else {
                if ((0,validation/* check12ValidFormat */.p)(this._cmi_element + ".lesson_status", lesson_status, regex/* scorm12_regex */.kS.CMIStatus2)) {
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".entry", error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".total_time", error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".lesson_mode", error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".exit", error_codes/* scorm12_errors */.Se.WRITE_ONLY_ELEMENT);
            }
            return this._exit;
        },
        set: function (exit) {
            if ((0,validation/* check12ValidFormat */.p)(this._cmi_element + ".exit", exit, regex/* scorm12_regex */.kS.CMIExit, true)) {
                this._exit = exit;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMICore.prototype, "session_time", {
        get: function () {
            if (!this.jsonString) {
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".session_time", error_codes/* scorm12_errors */.Se.WRITE_ONLY_ELEMENT);
            }
            return this._session_time;
        },
        set: function (session_time) {
            if ((0,validation/* check12ValidFormat */.p)(this._cmi_element + ".session_time", session_time, regex/* scorm12_regex */.kS.CMITimespan)) {
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
            if ((0,validation/* check12ValidFormat */.p)(this._cmi_element + ".suspend_data", suspend_data, regex/* scorm12_regex */.kS.CMIString4096, true)) {
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
var objectives = __webpack_require__(531);
// EXTERNAL MODULE: ./src/cmi/scorm12/student_data.ts
var scorm12_student_data = __webpack_require__(251);
// EXTERNAL MODULE: ./src/cmi/scorm12/student_preference.ts
var student_preference = __webpack_require__(34);
// EXTERNAL MODULE: ./src/cmi/scorm12/interactions.ts
var interactions = __webpack_require__(426);
;// ./src/cmi/scorm12/cmi.ts












var CMI = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMI, _super);
    function CMI(cmi_children, student_data, initialized) {
        var _this = _super.call(this, "cmi") || this;
        _this.__children = "";
        _this.__version = "3.4";
        _this._launch_data = "";
        _this._comments = "";
        _this._comments_from_lms = "";
        if (initialized)
            _this.initialize();
        _this.__children = cmi_children ? cmi_children : api_constants/* scorm12_constants */.QP.cmi_children;
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
            throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + "._version", error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMI.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + "._children", error_codes/* scorm12_errors */.Se.INVALID_SET_VALUE);
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".launch_data", error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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
            if ((0,validation/* check12ValidFormat */.p)(this._cmi_element + ".comments", comments, regex/* scorm12_regex */.kS.CMIString4096, true)) {
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
                throw new scorm12_exceptions/* Scorm12ValidationError */.t(this._cmi_element + ".comments_from_lms", error_codes/* scorm12_errors */.Se.READ_ONLY_ELEMENT);
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



/***/ }),

/***/ 392:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ check12ValidRange),
/* harmony export */   p: () => (/* binding */ check12ValidFormat)
/* harmony export */ });
/* harmony import */ var _common_validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(878);



function check12ValidFormat(CMIElement, value, regexPattern, allowEmptyString) {
    return (0,_common_validation__WEBPACK_IMPORTED_MODULE_0__/* .checkValidFormat */ .q)(CMIElement, value, regexPattern, _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_errors */ .Se.TYPE_MISMATCH, _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t, allowEmptyString);
}
function check12ValidRange(CMIElement, value, rangePattern, allowEmptyString) {
    if (!allowEmptyString && value === "") {
        throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t(CMIElement, _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_errors */ .Se.VALUE_OUT_OF_RANGE);
    }
    return (0,_common_validation__WEBPACK_IMPORTED_MODULE_0__/* .checkValidRange */ .W)(CMIElement, value, rangePattern, _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_errors */ .Se.VALUE_OUT_OF_RANGE, _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .Scorm12ValidationError */ .t);
}


/***/ }),

/***/ 426:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Oh: () => (/* binding */ CMIInteractionsObjectivesObject),
/* harmony export */   WP: () => (/* binding */ CMIInteractionsObject),
/* harmony export */   Xb: () => (/* binding */ CMIInteractions),
/* harmony export */   cb: () => (/* binding */ CMIInteractionsCorrectResponsesObject)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);
/* harmony import */ var _common_array__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(682);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(441);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(878);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(166);
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(392);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(64);








var CMIInteractions = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIInteractions, _super);
    function CMIInteractions() {
        return _super.call(this, {
            CMIElement: "cmi.interactions",
            children: _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.interactions_children,
            errorCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.INVALID_SET_VALUE,
            errorClass: _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t,
        }) || this;
    }
    return CMIInteractions;
}(_common_array__WEBPACK_IMPORTED_MODULE_4__/* .CMIArray */ .B));

var CMIInteractionsObject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIInteractionsObject, _super);
    function CMIInteractionsObject() {
        var _this = _super.call(this, "cmi.interactions.n") || this;
        _this._id = "";
        _this._time = "";
        _this._type = "";
        _this._weighting = "";
        _this._student_response = "";
        _this._result = "";
        _this._latency = "";
        _this.objectives = new _common_array__WEBPACK_IMPORTED_MODULE_4__/* .CMIArray */ .B({
            CMIElement: "cmi.interactions.n.objectives",
            errorCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.INVALID_SET_VALUE,
            errorClass: _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t,
            children: _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.objectives_children,
        });
        _this.correct_responses = new _common_array__WEBPACK_IMPORTED_MODULE_4__/* .CMIArray */ .B({
            CMIElement: "cmi.interactions.correct_responses",
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
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(this._cmi_element + ".id", _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._id;
        },
        set: function (id) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(this._cmi_element + ".id", id, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIIdentifier)) {
                this._id = id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "time", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(this._cmi_element + ".time", _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._time;
        },
        set: function (time) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(this._cmi_element + ".time", time, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMITime)) {
                this._time = time;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "type", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(this._cmi_element + ".type", _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._type;
        },
        set: function (type) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(this._cmi_element + ".type", type, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIType)) {
                this._type = type;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "weighting", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(this._cmi_element + ".weighting", _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._weighting;
        },
        set: function (weighting) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(this._cmi_element + ".weighting", weighting, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIDecimal) &&
                (0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidRange */ .h)(this._cmi_element + ".weighting", weighting, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.weighting_range)) {
                this._weighting = weighting;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "student_response", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(this._cmi_element + ".student_response", _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._student_response;
        },
        set: function (student_response) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(this._cmi_element + ".student_response", student_response, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIFeedback, true)) {
                this._student_response = student_response;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "result", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(this._cmi_element + ".result", _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._result;
        },
        set: function (result) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(this._cmi_element + ".result", result, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIResult)) {
                this._result = result;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIInteractionsObject.prototype, "latency", {
        get: function () {
            if (!this.jsonString) {
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(this._cmi_element + ".latency", _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._latency;
        },
        set: function (latency) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(this._cmi_element + ".latency", latency, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMITimespan)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_7__/* .BaseCMI */ .J));

var CMIInteractionsObjectivesObject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIInteractionsObjectivesObject, _super);
    function CMIInteractionsObjectivesObject() {
        var _this = _super.call(this, "cmi.interactions.n.objectives.n") || this;
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
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(this._cmi_element + ".id", id, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIIdentifier)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_7__/* .BaseCMI */ .J));

var CMIInteractionsCorrectResponsesObject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIInteractionsCorrectResponsesObject, _super);
    function CMIInteractionsCorrectResponsesObject() {
        var _this = _super.call(this, "cmi.interactions.correct_responses.n") || this;
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
                throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(this._cmi_element + ".pattern", _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.WRITE_ONLY_ELEMENT);
            }
            return this._pattern;
        },
        set: function (pattern) {
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_5__/* .check12ValidFormat */ .p)(this._cmi_element + ".pattern", pattern, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIFeedback, true)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_7__/* .BaseCMI */ .J));



/***/ }),

/***/ 441:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QP: () => (/* binding */ scorm12_constants),
/* harmony export */   _y: () => (/* binding */ global_constants)
/* harmony export */ });
/* unused harmony exports aicc_constants, scorm2004_constants */
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

/***/ 519:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: () => (/* binding */ BaseScormValidationError),
/* harmony export */   y: () => (/* binding */ ValidationError)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);

var BaseScormValidationError = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(BaseScormValidationError, _super);
    function BaseScormValidationError(CMIElement, errorCode) {
        var _this = _super.call(this, "".concat(CMIElement, " : ").concat(errorCode.toString())) || this;
        _this._errorCode = errorCode;
        Object.setPrototypeOf(_this, BaseScormValidationError.prototype);
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
    function ValidationError(CMIElement, errorCode, errorMessage, detailedMessage) {
        var _this = _super.call(this, CMIElement, errorCode) || this;
        _this._detailedMessage = "";
        _this.message = "".concat(CMIElement, " : ").concat(errorMessage);
        _this._errorMessage = errorMessage;
        if (detailedMessage) {
            _this._detailedMessage = detailedMessage;
        }
        Object.setPrototypeOf(_this, ValidationError.prototype);
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

/***/ 531:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C: () => (/* binding */ CMIObjectives),
/* harmony export */   N: () => (/* binding */ CMIObjectivesObject)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(166);
/* harmony import */ var _common_score__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(209);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(441);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(64);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(878);
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(392);
/* harmony import */ var _common_array__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(682);









var CMIObjectives = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIObjectives, _super);
    function CMIObjectives() {
        return _super.call(this, {
            CMIElement: "cmi.objectives",
            children: _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.objectives_children,
            errorCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.INVALID_SET_VALUE,
            errorClass: _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t,
        }) || this;
    }
    return CMIObjectives;
}(_common_array__WEBPACK_IMPORTED_MODULE_4__/* .CMIArray */ .B));

var CMIObjectivesObject = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIObjectivesObject, _super);
    function CMIObjectivesObject() {
        var _this = _super.call(this, "cmi.objectives.n") || this;
        _this._id = "";
        _this._status = "";
        _this.score = new _common_score__WEBPACK_IMPORTED_MODULE_5__/* .CMIScore */ ._({
            CMIElement: "cmi.objectives.n.score",
            score_children: _constants_api_constants__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_constants */ .QP.score_children,
            score_range: _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.score_range,
            invalidErrorCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.INVALID_SET_VALUE,
            invalidTypeCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.TYPE_MISMATCH,
            invalidRangeCode: _constants_error_codes__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_errors */ .Se.VALUE_OUT_OF_RANGE,
            errorClass: _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t,
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
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_7__/* .check12ValidFormat */ .p)(this._cmi_element + ".id", id, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIIdentifier)) {
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
            if ((0,_validation__WEBPACK_IMPORTED_MODULE_7__/* .check12ValidFormat */ .p)(this._cmi_element + ".status", status, _constants_regex__WEBPACK_IMPORTED_MODULE_6__/* .scorm12_regex */ .kS.CMIStatus2)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_8__/* .BaseCMI */ .J));



/***/ }),

/***/ 557:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bj: () => (/* binding */ memoize),
/* harmony export */   Bq: () => (/* binding */ flatten),
/* harmony export */   HT: () => (/* binding */ addHHMMSSTimeStrings),
/* harmony export */   J6: () => (/* binding */ stringMatches),
/* harmony export */   UZ: () => (/* binding */ getSecondsAsHHMMSS),
/* harmony export */   f4: () => (/* binding */ getTimeAsSeconds),
/* harmony export */   hw: () => (/* binding */ formatMessage),
/* harmony export */   sB: () => (/* binding */ unflatten)
/* harmony export */ });
/* unused harmony exports SECONDS_PER_SECOND, SECONDS_PER_MINUTE, SECONDS_PER_HOUR, SECONDS_PER_DAY, getSecondsAsISODuration, getDurationAsSeconds, addTwoDurations, countDecimals */
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
    return (hours + ":" + minutes + ":" + seconds).replace(/\b\d\b/g, "0$&") + msStr;
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
            var needsTimeSeparator = (duration.indexOf("D") > 0 || ["H", "M", "S"].includes(designationsKey)) &&
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
    var regexStr = typeof durationRegex === "string" ? durationRegex : ((_a = durationRegex === null || durationRegex === void 0 ? void 0 : durationRegex.toString()) !== null && _a !== void 0 ? _a : "");
    return "".concat(durationStr, ":").concat(regexStr);
});
function addTwoDurations(first, second, durationRegex) {
    var regex = typeof durationRegex === "string" ? new RegExp(durationRegex) : durationRegex;
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
            var keys = Object.keys(cur).filter(function (p) { return Object.prototype.hasOwnProperty.call(cur, p); });
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
        Array.from({ length: (_b = (_a = p.match(new RegExp(pattern, "g"))) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0 }, function () {
            return regex.exec(p);
        }).forEach(function (m) {
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

/***/ 573:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Mb: () => (/* binding */ LogLevelEnum),
/* harmony export */   YE: () => (/* binding */ SuccessStatus),
/* harmony export */   lC: () => (/* binding */ CompletionStatus)
/* harmony export */ });
/* unused harmony export NAVBoolean */
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

/***/ 586:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (/* binding */ NAV)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);
/* harmony import */ var _common_base_cmi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(166);
/* harmony import */ var _validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(392);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64);




var NAV = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(NAV, _super);
    function NAV() {
        var _this = _super.call(this, "cmi.nav") || this;
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
            if (event === "" ||
                (0,_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(this._cmi_element + ".event", event, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.NAVEvent)) {
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
}(_common_base_cmi__WEBPACK_IMPORTED_MODULE_3__/* .BaseCMI */ .J));



/***/ }),

/***/ 635:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   C6: () => (/* binding */ __extends),
/* harmony export */   Cl: () => (/* binding */ __assign),
/* harmony export */   YH: () => (/* binding */ __generator),
/* harmony export */   sH: () => (/* binding */ __awaiter)
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

/***/ 682:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ CMIArray)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);
/* harmony import */ var _base_cmi__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(166);
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(519);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);




var CMIArray = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(CMIArray, _super);
    function CMIArray(params) {
        var _this = _super.call(this, params.CMIElement) || this;
        _this.__children = params.children;
        _this._errorCode = params.errorCode || _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_errors */ .Se.GENERAL;
        _this._errorClass = params.errorClass || _exceptions__WEBPACK_IMPORTED_MODULE_2__/* .BaseScormValidationError */ .$;
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
            throw new this._errorClass(this._cmi_element + "._children", this._errorCode);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIArray.prototype, "_count", {
        get: function () {
            return this.childArray.length;
        },
        set: function (_count) {
            throw new this._errorClass(this._cmi_element + "._count", this._errorCode);
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
}(_base_cmi__WEBPACK_IMPORTED_MODULE_3__/* .BaseCMI */ .J));



/***/ }),

/***/ 838:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: () => (/* binding */ src_BaseAPI)
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(635);
// EXTERNAL MODULE: ./src/constants/api_constants.ts
var api_constants = __webpack_require__(441);
// EXTERNAL MODULE: ./src/utilities.ts
var utilities = __webpack_require__(557);
// EXTERNAL MODULE: ./src/constants/enums.ts
var enums = __webpack_require__(573);
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
                        if (httpResult === null || !{}.hasOwnProperty.call(httpResult, "result")) {
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
                            if (!Object.hasOwnProperty.call(result, "errorCode")) {
                                result.errorCode = this.error_codes.GENERAL;
                            }
                            processListeners("CommitError", null, result.errorCode);
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
        this.listenerMap = new Map();
        this.listenerCount = 0;
        this.apiLog = apiLog;
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
            if (CMIElement && listener.CMIElement) {
                if (listener.CMIElement.endsWith("*")) {
                    var prefix = listener.CMIElement.slice(0, -1);
                    CMIElementsMatch = CMIElement.startsWith(prefix);
                }
                else {
                    CMIElementsMatch = listener.CMIElement === CMIElement;
                }
            }
            if (!listenerHasCMIElement || CMIElementsMatch) {
                this.apiLog("processListeners", "Processing listener: ".concat(listener.functionName), enums/* LogLevelEnum */.Mb.DEBUG, CMIElement);
                if (functionName.startsWith("Sequence")) {
                    listener.callback(value);
                }
                else if (functionName === "CommitError") {
                    listener.callback(value);
                }
                else if (functionName === "CommitSuccess") {
                    listener.callback();
                }
                else {
                    listener.callback(CMIElement, value);
                }
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
    SerializationService.prototype.loadFromFlattenedJSON = function (json, CMIElement, setCMIValue, isNotInitialized, setStartingData) {
        var _this = this;
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
                _this.loadFromJSON((0,utilities/* unflatten */.sB)(obj), CMIElement, setCMIValue, isNotInitialized, setStartingData);
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
var exceptions = __webpack_require__(519);
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

;// ./src/services/ErrorHandlingService.ts




var ErrorHandlingService = (function () {
    function ErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails, loggingService) {
        this._lastErrorCode = "0";
        this._errorCodes = errorCodes;
        this._apiLog = apiLog;
        this._getLmsErrorMessageDetails = getLmsErrorMessageDetails;
        this._loggingService = loggingService || getLoggingService();
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
    ErrorHandlingService.prototype.throwSCORMError = function (CMIElement, errorNumber, message) {
        if (!message) {
            message = this._getLmsErrorMessageDetails(errorNumber, true);
        }
        var formattedMessage = "SCORM Error ".concat(errorNumber, ": ").concat(message).concat(CMIElement ? " [Element: ".concat(CMIElement, "]") : "");
        this._apiLog("throwSCORMError", errorNumber + ": " + message, enums/* LogLevelEnum */.Mb.ERROR, CMIElement);
        this._loggingService.error(formattedMessage);
        this._lastErrorCode = String(errorNumber);
    };
    ErrorHandlingService.prototype.clearSCORMError = function (success) {
        if (success !== undefined && success !== api_constants/* global_constants */._y.SCORM_FALSE) {
            this._lastErrorCode = "0";
        }
    };
    ErrorHandlingService.prototype.handleValueAccessException = function (CMIElement, e, returnValue) {
        if (e instanceof exceptions/* ValidationError */.y) {
            var validationError = e;
            this._lastErrorCode = String(validationError.errorCode);
            var errorMessage = "Validation Error ".concat(validationError.errorCode, ": ").concat(validationError.message, " [Element: ").concat(CMIElement, "]");
            this._loggingService.warn(errorMessage);
            returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
        }
        else if (e instanceof Error) {
            var errorType = e.constructor.name;
            var errorMessage = "".concat(errorType, ": ").concat(e.message, " [Element: ").concat(CMIElement, "]");
            var stackTrace = e.stack || "";
            console.error(e.message);
            this._loggingService.error("".concat(errorMessage, "\n").concat(stackTrace));
            this.throwSCORMError(CMIElement, this._errorCodes.GENERAL, "".concat(errorType, ": ").concat(e.message));
        }
        else {
            var errorMessage = "Unknown error occurred while accessing [Element: ".concat(CMIElement, "]");
            console.error(e);
            this._loggingService.error(errorMessage);
            try {
                var errorDetails = JSON.stringify(e);
                this._loggingService.error("Error details: ".concat(errorDetails));
            }
            catch (jsonError) {
                this._loggingService.error("Could not stringify error object for details");
            }
            this.throwSCORMError(CMIElement, this._errorCodes.GENERAL, "Unknown error");
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

function createErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails, loggingService) {
    return new ErrorHandlingService(errorCodes, apiLog, getLmsErrorMessageDetails, loggingService);
}

// EXTERNAL MODULE: ./src/cmi/common/array.ts
var array = __webpack_require__(682);
;// ./src/BaseAPI.ts













var BaseAPI = (function () {
    function BaseAPI(error_codes, settings, httpService, eventService, serializationService, cmiDataService, errorHandlingService, loggingService) {
        var _newTarget = this.constructor;
        var _this = this;
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
        this._httpService = httpService || new HttpService(this.settings, this._error_codes);
        this._eventService =
            eventService ||
                new EventService(function (functionName, message, level, element) {
                    return _this.apiLog(functionName, message, level, element);
                });
        this._serializationService = serializationService || new SerializationService();
        this._errorHandlingService =
            errorHandlingService ||
                createErrorHandlingService(this._error_codes, function (functionName, message, level, element) {
                    return _this.apiLog(functionName, message, level, element);
                }, function (errorNumber, detail) { return _this.getLmsErrorMessageDetails(errorNumber, detail); });
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
            this.throwSCORMError("api", this._error_codes.INITIALIZED, initializeMessage);
        }
        else if (this.isTerminated()) {
            this.throwSCORMError("api", this._error_codes.TERMINATED, terminationMessage);
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
                this.settings.onLogMessage !== this._loggingService["_logHandler"]) {
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
            if (settings.logLevel !== undefined && settings.logLevel !== previousSettings.logLevel) {
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
                            this.throwSCORMError("api", result.errorCode);
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
            try {
                returnValue = this.getCMIValue(CMIElement);
            }
            catch (e) {
                returnValue = this.handleValueAccessException(CMIElement, e, returnValue);
            }
            this.processListeners(callbackName, CMIElement);
        }
        this.apiLog(callbackName, ": returned: " + returnValue, enums/* LogLevelEnum */.Mb.INFO, CMIElement);
        if (returnValue === undefined) {
            return "";
        }
        if (this.lastErrorCode === "0") {
            this.clearSCORMError(returnValue);
        }
        return returnValue;
    };
    BaseAPI.prototype.setValue = function (callbackName, commitCallback, checkTerminated, CMIElement, value) {
        if (value !== undefined) {
            value = String(value);
        }
        var returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
        if (this.checkState(checkTerminated, this._error_codes.STORE_BEFORE_INIT, this._error_codes.STORE_AFTER_TERM)) {
            try {
                returnValue = this.setCMIValue(CMIElement, value);
            }
            catch (e) {
                returnValue = this.handleValueAccessException(CMIElement, e, returnValue);
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
        if (this.lastErrorCode === "0") {
            this.clearSCORMError(returnValue);
        }
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
                            this.throwSCORMError("api", result.errorCode);
                        }
                        returnValue = (_b = result === null || result === void 0 ? void 0 : result.result) !== null && _b !== void 0 ? _b : api_constants/* global_constants */._y.SCORM_FALSE;
                        this.apiLog(callbackName, " Result: " + returnValue, enums/* LogLevelEnum */.Mb.DEBUG, "HttpRequest");
                        if (checkTerminated)
                            this.lastErrorCode = "0";
                        this.processListeners(callbackName);
                        _c.label = 2;
                    case 2:
                        this.apiLog(callbackName, "returned: " + returnValue, enums/* LogLevelEnum */.Mb.INFO);
                        if (this.lastErrorCode === "0") {
                            this.clearSCORMError(returnValue);
                        }
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
            this.throwSCORMError("api", beforeInitError);
            return false;
        }
        else if (checkTerminated && this.isTerminated()) {
            this.throwSCORMError("api", afterTermError);
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
        if (!CMIElement || CMIElement === "") {
            return api_constants/* global_constants */._y.SCORM_FALSE;
        }
        this.lastErrorCode = "0";
        var structure = CMIElement.split(".");
        var refObject = this;
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
                    if (this.isInitialized()) {
                        this.throwSCORMError(CMIElement, this._error_codes.READ_ONLY_ELEMENT);
                        break;
                    }
                    else {
                        refObject = (0,tslib_es6/* __assign */.Cl)((0,tslib_es6/* __assign */.Cl)({}, refObject), { attribute: value });
                    }
                }
                else if (!this._checkObjectHasProperty(refObject, attribute)) {
                    this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                    break;
                }
                else {
                    if ((0,utilities/* stringMatches */.J6)(CMIElement, "\\.correct_responses\\.\\d+$") &&
                        this.isInitialized() &&
                        attribute !== "pattern") {
                        this.validateCorrectResponse(CMIElement, value);
                        if (this.lastErrorCode !== "0") {
                            this.throwSCORMError(CMIElement, this._error_codes.TYPE_MISMATCH);
                            break;
                        }
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
                    this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                    break;
                }
                if (refObject instanceof array/* CMIArray */.B) {
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
                                if (this.lastErrorCode === "0") {
                                    this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                                }
                                break;
                            }
                            else {
                                if (refObject.initialized)
                                    newChild.initialize();
                                refObject.childArray[index] = newChild;
                                refObject = newChild;
                            }
                        }
                        idx++;
                    }
                }
            }
        }
        if (returnValue === api_constants/* global_constants */._y.SCORM_FALSE) {
            this.apiLog(methodName, "There was an error setting the value for: ".concat(CMIElement, ", value of: ").concat(value), enums/* LogLevelEnum */.Mb.WARN);
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
                        this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
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
                    this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                    return;
                }
            }
            refObject = refObject[attribute];
            if (refObject === undefined) {
                this.throwSCORMError(CMIElement, invalidErrorCode, invalidErrorMessage);
                break;
            }
            if (refObject instanceof array/* CMIArray */.B) {
                var index = parseInt(structure[idx + 1], 10);
                if (!isNaN(index)) {
                    var item = refObject.childArray[index];
                    if (item) {
                        refObject = item;
                    }
                    else {
                        this.throwSCORMError(CMIElement, this._error_codes.VALUE_NOT_INITIALIZED, uninitializedErrorMessage);
                        break;
                    }
                    idx++;
                }
            }
        }
        if (refObject === null || refObject === undefined) {
            if (!scorm2004) {
                if (attribute === "_children") {
                    this.throwSCORMError(CMIElement, this._error_codes.CHILDREN_ERROR, undefined);
                }
                else if (attribute === "_count") {
                    this.throwSCORMError(CMIElement, this._error_codes.COUNT_ERROR, undefined);
                }
            }
        }
        else {
            return refObject;
        }
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
    BaseAPI.prototype.throwSCORMError = function (CMIElement, errorNumber, message) {
        this._errorHandlingService.throwSCORMError(CMIElement, errorNumber, message);
    };
    BaseAPI.prototype.clearSCORMError = function (success) {
        this._errorHandlingService.clearSCORMError(success);
    };
    BaseAPI.prototype.loadFromFlattenedJSON = function (json, CMIElement) {
        var _this = this;
        if (!CMIElement) {
            CMIElement = "";
        }
        this._serializationService.loadFromFlattenedJSON(json, CMIElement, function (CMIElement, value) { return _this.setCMIValue(CMIElement, value); }, function () { return _this.isNotInitialized(); }, function (data) {
            _this.startingData = data;
        });
    };
    BaseAPI.prototype.loadFromJSON = function (json, CMIElement) {
        var _this = this;
        if (CMIElement === void 0) { CMIElement = ""; }
        this._serializationService.loadFromJSON(json, CMIElement, function (CMIElement, value) { return _this.setCMIValue(CMIElement, value); }, function () { return _this.isNotInitialized(); }, function (data) {
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
            var _this = this;
            if (immediate === void 0) { immediate = false; }
            return (0,tslib_es6/* __generator */.YH)(this, function (_a) {
                return [2, this._httpService.processHttpRequest(url, params, immediate, function (functionName, message, level, element) { return _this.apiLog(functionName, message, level, element); }, function (functionName, CMIElement, value) { return _this.processListeners(functionName, CMIElement, value); })];
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
    BaseAPI.prototype.handleValueAccessException = function (CMIElement, e, returnValue) {
        if (e instanceof exceptions/* ValidationError */.y) {
            this.lastErrorCode = String(e.errorCode);
            returnValue = api_constants/* global_constants */._y.SCORM_FALSE;
            this.throwSCORMError(CMIElement, e.errorCode, e.errorMessage);
        }
        else {
            if (e instanceof Error && e.message) {
                console.error(e.message);
                this.throwSCORMError(CMIElement, this._error_codes.GENERAL, e.message);
            }
            else {
                console.error(e);
                this.throwSCORMError(CMIElement, this._error_codes.GENERAL, "Unknown error");
            }
        }
        return returnValue;
    };
    BaseAPI.prototype.getCommitObject = function (terminateCommit) {
        var _this = this;
        return this._serializationService.getCommitObject(terminateCommit, this.settings.alwaysSendTotalTime, this.settings.renderCommonCommitFields, function (terminateCommit) { return _this.renderCommitObject(terminateCommit); }, function (terminateCommit) { return _this.renderCommitCMI(terminateCommit); }, this.apiLogLevel);
    };
    return BaseAPI;
}());
/* harmony default export */ const src_BaseAPI = (BaseAPI);


/***/ }),

/***/ 878:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: () => (/* binding */ Scorm12ValidationError)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(635);
/* harmony import */ var _exceptions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(519);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(441);



var scorm12_errors = _constants_api_constants__WEBPACK_IMPORTED_MODULE_0__/* .scorm12_constants */ .QP.error_descriptions;
var Scorm12ValidationError = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_1__/* .__extends */ .C6)(Scorm12ValidationError, _super);
    function Scorm12ValidationError(CMIElement, errorCode) {
        var _this = this;
        if ({}.hasOwnProperty.call(scorm12_errors, String(errorCode))) {
            _this = _super.call(this, CMIElement, errorCode, scorm12_errors[String(errorCode)].basicMessage, scorm12_errors[String(errorCode)].detailMessage) || this;
        }
        else {
            _this = _super.call(this, CMIElement, 101, scorm12_errors["101"].basicMessage, scorm12_errors["101"].detailMessage) || this;
        }
        Object.setPrototypeOf(_this, Scorm12ValidationError.prototype);
        return _this;
    }
    return Scorm12ValidationError;
}(_exceptions__WEBPACK_IMPORTED_MODULE_2__/* .ValidationError */ .y));



/***/ }),

/***/ 888:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ validationService)
/* harmony export */ });
/* unused harmony export ValidationService */
/* harmony import */ var _cmi_common_validation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(144);
/* harmony import */ var _cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(392);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(12);
/* harmony import */ var _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(878);





var ValidationService = (function () {
    function ValidationService() {
    }
    ValidationService.prototype.validateScore = function (CMIElement, value, decimalRegex, scoreRange, invalidTypeCode, invalidRangeCode, errorClass) {
        return ((0,_cmi_common_validation__WEBPACK_IMPORTED_MODULE_0__/* .checkValidFormat */ .q)(CMIElement, value, decimalRegex, invalidTypeCode, errorClass) &&
            (!scoreRange || (0,_cmi_common_validation__WEBPACK_IMPORTED_MODULE_0__/* .checkValidRange */ .W)(CMIElement, value, scoreRange, invalidRangeCode, errorClass)));
    };
    ValidationService.prototype.validateScorm12Audio = function (CMIElement, value) {
        return ((0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(CMIElement, value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.CMISInteger) &&
            (0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidRange */ .h)(CMIElement, value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.audio_range));
    };
    ValidationService.prototype.validateScorm12Language = function (CMIElement, value) {
        return (0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(CMIElement, value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.CMIString256);
    };
    ValidationService.prototype.validateScorm12Speed = function (CMIElement, value) {
        return ((0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(CMIElement, value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.CMISInteger) &&
            (0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidRange */ .h)(CMIElement, value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.speed_range));
    };
    ValidationService.prototype.validateScorm12Text = function (CMIElement, value) {
        return ((0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidFormat */ .p)(CMIElement, value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.CMISInteger) &&
            (0,_cmi_scorm12_validation__WEBPACK_IMPORTED_MODULE_1__/* .check12ValidRange */ .h)(CMIElement, value, _constants_regex__WEBPACK_IMPORTED_MODULE_2__/* .scorm12_regex */ .kS.text_range));
    };
    ValidationService.prototype.validateReadOnly = function (CMIElement, initialized) {
        if (initialized) {
            throw new _exceptions_scorm12_exceptions__WEBPACK_IMPORTED_MODULE_3__/* .Scorm12ValidationError */ .t(CMIElement, _constants_error_codes__WEBPACK_IMPORTED_MODULE_4__/* .scorm12_errors */ .Se.READ_ONLY_ELEMENT);
        }
    };
    return ValidationService;
}());

var validationService = new ValidationService();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scorm12API: () => (/* binding */ Scorm12Impl)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(635);
/* harmony import */ var _cmi_scorm12_cmi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(368);
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(557);
/* harmony import */ var _constants_api_constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(441);
/* harmony import */ var _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);
/* harmony import */ var _cmi_scorm12_objectives__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(531);
/* harmony import */ var _cmi_scorm12_interactions__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(426);
/* harmony import */ var _cmi_scorm12_nav__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(586);
/* harmony import */ var _constants_enums__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(573);
/* harmony import */ var _BaseAPI__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(838);
/* harmony import */ var _constants_regex__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(64);












var Scorm12Impl = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__extends */ .C6)(Scorm12Impl, _super);
    function Scorm12Impl(settings) {
        var _this = this;
        if (settings) {
            if (settings.mastery_override === undefined) {
                settings.mastery_override = false;
            }
        }
        _this = _super.call(this, _constants_error_codes__WEBPACK_IMPORTED_MODULE_1__/* .scorm12_errors */ .Se, settings) || this;
        _this.statusSetByModule = false;
        _this.cmi = new _cmi_scorm12_cmi__WEBPACK_IMPORTED_MODULE_2__/* .CMI */ .Y();
        _this.nav = new _cmi_scorm12_nav__WEBPACK_IMPORTED_MODULE_3__/* .NAV */ .A();
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
        (function () { return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__awaiter */ .sH)(_this, void 0, void 0, function () {
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__generator */ .YH)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.internalFinish()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        }); })();
        return _constants_api_constants__WEBPACK_IMPORTED_MODULE_4__/* .global_constants */ ._y.SCORM_TRUE;
    };
    Scorm12Impl.prototype.internalFinish = function () {
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__awaiter */ .sH)(this, void 0, void 0, function () {
            var result;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__generator */ .YH)(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, this.terminate("LMSFinish", true)];
                    case 1:
                        result = _a.sent();
                        if (result === _constants_api_constants__WEBPACK_IMPORTED_MODULE_4__/* .global_constants */ ._y.SCORM_TRUE) {
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
            (function () { return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__awaiter */ .sH)(_this, void 0, void 0, function () {
                return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__generator */ .YH)(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.commit("LMSCommit", false)];
                        case 1:
                            _a.sent();
                            return [2];
                    }
                });
            }); })();
        }
        return _constants_api_constants__WEBPACK_IMPORTED_MODULE_4__/* .global_constants */ ._y.SCORM_TRUE;
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
        if ((0,_utilities__WEBPACK_IMPORTED_MODULE_5__/* .stringMatches */ .J6)(CMIElement, "cmi\\.objectives\\.\\d+")) {
            return new _cmi_scorm12_objectives__WEBPACK_IMPORTED_MODULE_6__/* .CMIObjectivesObject */ .N();
        }
        else if (foundFirstIndex &&
            (0,_utilities__WEBPACK_IMPORTED_MODULE_5__/* .stringMatches */ .J6)(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
            return new _cmi_scorm12_interactions__WEBPACK_IMPORTED_MODULE_7__/* .CMIInteractionsCorrectResponsesObject */ .cb();
        }
        else if (foundFirstIndex &&
            (0,_utilities__WEBPACK_IMPORTED_MODULE_5__/* .stringMatches */ .J6)(CMIElement, "cmi\\.interactions\\.\\d+\\.objectives\\.\\d+")) {
            return new _cmi_scorm12_interactions__WEBPACK_IMPORTED_MODULE_7__/* .CMIInteractionsObjectivesObject */ .Oh();
        }
        else if (!foundFirstIndex && (0,_utilities__WEBPACK_IMPORTED_MODULE_5__/* .stringMatches */ .J6)(CMIElement, "cmi\\.interactions\\.\\d+")) {
            return new _cmi_scorm12_interactions__WEBPACK_IMPORTED_MODULE_7__/* .CMIInteractionsObject */ .WP();
        }
        return null;
    };
    Scorm12Impl.prototype.validateCorrectResponse = function (_CMIElement, _value) {
    };
    Scorm12Impl.prototype.getLmsErrorMessageDetails = function (errorNumber, detail) {
        var basicMessage = "No Error";
        var detailMessage = "No Error";
        errorNumber = String(errorNumber);
        if (_constants_api_constants__WEBPACK_IMPORTED_MODULE_4__/* .scorm12_constants */ .QP.error_descriptions[errorNumber]) {
            basicMessage = _constants_api_constants__WEBPACK_IMPORTED_MODULE_4__/* .scorm12_constants */ .QP.error_descriptions[errorNumber].basicMessage;
            detailMessage = _constants_api_constants__WEBPACK_IMPORTED_MODULE_4__/* .scorm12_constants */ .QP.error_descriptions[errorNumber].detailMessage;
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
        var flattened = _utilities__WEBPACK_IMPORTED_MODULE_5__/* .flatten */ .Bq(cmiExport);
        switch (this.settings.dataCommitFormat) {
            case "flattened":
                return _utilities__WEBPACK_IMPORTED_MODULE_5__/* .flatten */ .Bq(cmiExport);
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
        var totalTimeSeconds = _utilities__WEBPACK_IMPORTED_MODULE_5__/* .getTimeAsSeconds */ .f4(totalTimeHHMMSS, _constants_regex__WEBPACK_IMPORTED_MODULE_8__/* .scorm12_regex */ .kS.CMITimespan);
        var lessonStatus = this.cmi.core.lesson_status;
        var completionStatus = _constants_enums__WEBPACK_IMPORTED_MODULE_9__/* .CompletionStatus */ .lC.UNKNOWN;
        var successStatus = _constants_enums__WEBPACK_IMPORTED_MODULE_9__/* .SuccessStatus */ .YE.UNKNOWN;
        if (lessonStatus) {
            completionStatus =
                lessonStatus === "completed" || lessonStatus === "passed"
                    ? _constants_enums__WEBPACK_IMPORTED_MODULE_9__/* .CompletionStatus */ .lC.COMPLETED
                    : _constants_enums__WEBPACK_IMPORTED_MODULE_9__/* .CompletionStatus */ .lC.INCOMPLETE;
            if (lessonStatus === "passed") {
                successStatus = _constants_enums__WEBPACK_IMPORTED_MODULE_9__/* .SuccessStatus */ .YE.PASSED;
            }
            else if (lessonStatus === "failed") {
                successStatus = _constants_enums__WEBPACK_IMPORTED_MODULE_9__/* .SuccessStatus */ .YE.FAILED;
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
        return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__awaiter */ .sH)(this, void 0, void 0, function () {
            var originalStatus, commitObject;
            var _a, _b, _c;
            return (0,tslib__WEBPACK_IMPORTED_MODULE_0__/* .__generator */ .YH)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (terminateCommit) {
                            originalStatus = this.cmi.core.lesson_status;
                            if (!this.cmi.core.lesson_status ||
                                (!this.statusSetByModule && this.cmi.core.lesson_status === "not attempted")) {
                                this.cmi.core.lesson_status = "completed";
                            }
                            if (this.cmi.core.lesson_mode === "normal") {
                                if (this.cmi.core.credit === "credit") {
                                    if (this.settings.mastery_override &&
                                        this.cmi.student_data.mastery_score !== "" &&
                                        this.cmi.core.score.raw !== "") {
                                        this.cmi.core.lesson_status =
                                            parseFloat(this.cmi.core.score.raw) >= parseFloat(this.cmi.student_data.mastery_score)
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
                            result: _constants_api_constants__WEBPACK_IMPORTED_MODULE_4__/* .global_constants */ ._y.SCORM_TRUE,
                            errorCode: 0,
                        }];
                }
            });
        });
    };
    return Scorm12Impl;
}(_BaseAPI__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .A));


var __webpack_export_target__ = window;
for(var __webpack_i__ in __webpack_exports__) __webpack_export_target__[__webpack_i__] = __webpack_exports__[__webpack_i__];
if(__webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;