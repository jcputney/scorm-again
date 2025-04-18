/******/ var __webpack_modules__ = ({

/***/ 12:
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

/***/ 64:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   kS: function() { return /* binding */ scorm12_regex; },
/* harmony export */   xt: function() { return /* binding */ scorm2004_regex; }
/* harmony export */ });
/* unused harmony export aicc_regex */
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: function() { return /* binding */ checkValidRange; },
/* harmony export */   q: function() { return /* binding */ checkValidFormat; }
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   J: function() { return /* binding */ BaseCMI; },
/* harmony export */   r: function() { return /* binding */ BaseRootCMI; }
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: function() { return /* binding */ CMIScore; }
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

/***/ 392:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: function() { return /* binding */ check12ValidRange; },
/* harmony export */   p: function() { return /* binding */ check12ValidFormat; }
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

/***/ 441:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   QP: function() { return /* binding */ scorm12_constants; },
/* harmony export */   _y: function() { return /* binding */ global_constants; },
/* harmony export */   zR: function() { return /* binding */ scorm2004_constants; }
/* harmony export */ });
/* unused harmony export aicc_constants */
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $: function() { return /* binding */ BaseScormValidationError; },
/* harmony export */   y: function() { return /* binding */ ValidationError; }
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

/***/ 557:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $o: function() { return /* binding */ addTwoDurations; },
/* harmony export */   Bj: function() { return /* binding */ memoize; },
/* harmony export */   Bq: function() { return /* binding */ flatten; },
/* harmony export */   J6: function() { return /* binding */ stringMatches; },
/* harmony export */   OI: function() { return /* binding */ getDurationAsSeconds; },
/* harmony export */   hw: function() { return /* binding */ formatMessage; },
/* harmony export */   sB: function() { return /* binding */ unflatten; },
/* harmony export */   xE: function() { return /* binding */ getSecondsAsISODuration; }
/* harmony export */ });
/* unused harmony exports SECONDS_PER_SECOND, SECONDS_PER_MINUTE, SECONDS_PER_HOUR, SECONDS_PER_DAY, getSecondsAsHHMMSS, getTimeAsSeconds, addHHMMSSTimeStrings, countDecimals */
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

/***/ 682:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: function() { return /* binding */ CMIArray; }
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  A: function() { return /* binding */ src_BaseAPI; }
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
/* harmony default export */ var src_BaseAPI = (BaseAPI);


/***/ }),

/***/ 878:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   t: function() { return /* binding */ Scorm12ValidationError; }
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
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: function() { return /* binding */ validationService; }
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

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  V: function() { return /* binding */ Scorm2004Impl; }
});

// EXTERNAL MODULE: ./node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(635);
// EXTERNAL MODULE: ./src/BaseAPI.ts + 7 modules
var BaseAPI = __webpack_require__(838);
// EXTERNAL MODULE: ./src/cmi/common/base_cmi.ts
var base_cmi = __webpack_require__(166);
// EXTERNAL MODULE: ./src/constants/api_constants.ts
var api_constants = __webpack_require__(441);
// EXTERNAL MODULE: ./src/exceptions.ts
var exceptions = __webpack_require__(519);
;// ./src/exceptions/scorm2004_exceptions.ts



var scorm2004_errors = api_constants/* scorm2004_constants */.zR.error_descriptions;
var Scorm2004ValidationError = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(Scorm2004ValidationError, _super);
    function Scorm2004ValidationError(CMIElement, errorCode) {
        var _this = this;
        if ({}.hasOwnProperty.call(scorm2004_errors, String(errorCode))) {
            _this = _super.call(this, CMIElement, errorCode, scorm2004_errors[String(errorCode)].basicMessage, scorm2004_errors[String(errorCode)].detailMessage) || this;
        }
        else {
            _this = _super.call(this, CMIElement, 101, scorm2004_errors["101"].basicMessage, scorm2004_errors["101"].detailMessage) || this;
        }
        Object.setPrototypeOf(_this, Scorm2004ValidationError.prototype);
        return _this;
    }
    return Scorm2004ValidationError;
}(exceptions/* ValidationError */.y));


// EXTERNAL MODULE: ./src/constants/error_codes.ts
var error_codes = __webpack_require__(12);
// EXTERNAL MODULE: ./src/cmi/common/validation.ts
var validation = __webpack_require__(144);
;// ./src/cmi/scorm2004/validation.ts



function check2004ValidFormat(CMIElement, value, regexPattern, allowEmptyString) {
    return (0,validation/* checkValidFormat */.q)(CMIElement, value, regexPattern, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, Scorm2004ValidationError, allowEmptyString);
}
function check2004ValidRange(CMIElement, value, rangePattern) {
    return (0,validation/* checkValidRange */.W)(CMIElement, value, rangePattern, error_codes/* scorm2004_errors */.Rf.VALUE_OUT_OF_RANGE, Scorm2004ValidationError);
}

// EXTERNAL MODULE: ./src/constants/regex.ts
var regex = __webpack_require__(64);
;// ./src/cmi/scorm2004/learner_preference.ts







var CMILearnerPreference = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMILearnerPreference, _super);
    function CMILearnerPreference() {
        var _this = _super.call(this, "cmi.learner_preference") || this;
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
            throw new Scorm2004ValidationError(this._cmi_element + "._children", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMILearnerPreference.prototype, "audio_level", {
        get: function () {
            return this._audio_level;
        },
        set: function (audio_level) {
            if (check2004ValidFormat(this._cmi_element + ".audio_level", audio_level, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                check2004ValidRange(this._cmi_element + ".audio_level", audio_level, regex/* scorm2004_regex */.xt.audio_range)) {
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
            if (check2004ValidFormat(this._cmi_element + ".language", language, regex/* scorm2004_regex */.xt.CMILang)) {
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
            if (check2004ValidFormat(this._cmi_element + ".delivery_speed", delivery_speed, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                check2004ValidRange(this._cmi_element + ".delivery_speed", delivery_speed, regex/* scorm2004_regex */.xt.speed_range)) {
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
            if (check2004ValidFormat(this._cmi_element + ".audio_captioning", audio_captioning, regex/* scorm2004_regex */.xt.CMISInteger) &&
                check2004ValidRange(this._cmi_element + ".audio_captioning", audio_captioning, regex/* scorm2004_regex */.xt.text_range)) {
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
var array = __webpack_require__(682);
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
            CMIElement: "cmi.interactions",
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
        var _this = _super.call(this, "cmi.interactions.n") || this;
        _this._id = "";
        _this._type = "";
        _this._timestamp = "";
        _this._weighting = "";
        _this._learner_response = "";
        _this._result = "";
        _this._latency = "";
        _this._description = "";
        _this.objectives = new array/* CMIArray */.B({
            CMIElement: "cmi.interactions.n.objectives",
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
            children: api_constants/* scorm2004_constants */.zR.objectives_children,
        });
        _this.correct_responses = new array/* CMIArray */.B({
            CMIElement: "cmi.interactions.n.correct_responses",
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
            CMIElement: "cmi.interactions.n.objectives",
            errorCode: error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT,
            errorClass: Scorm2004ValidationError,
            children: api_constants/* scorm2004_constants */.zR.objectives_children,
        });
        this.correct_responses = new array/* CMIArray */.B({
            CMIElement: "cmi.interactions.n.correct_responses",
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
            if (check2004ValidFormat(this._cmi_element + ".id", id, regex/* scorm2004_regex */.xt.CMILongIdentifier)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".type", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".type", type, regex/* scorm2004_regex */.xt.CMIType)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".timestamp", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".timestamp", timestamp, regex/* scorm2004_regex */.xt.CMITime)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".weighting", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".weighting", weighting, regex/* scorm2004_regex */.xt.CMIDecimal)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                var nodes = [];
                var response_type = LearnerResponses[this.type];
                if (response_type) {
                    if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
                        var delimiter = response_type.delimiter === "[,]" ? "," : response_type.delimiter;
                        nodes = learner_response.split(delimiter);
                    }
                    else {
                        nodes[0] = learner_response;
                    }
                    if (nodes.length > 0 && nodes.length <= response_type.max) {
                        var formatRegex = new RegExp(response_type.format);
                        for (var i = 0; i < nodes.length; i++) {
                            if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter2) {
                                var delimiter2 = response_type.delimiter2 === "[.]" ? "." : response_type.delimiter2;
                                var values = nodes[i].split(delimiter2);
                                if (values.length === 2) {
                                    if (!values[0].match(formatRegex)) {
                                        throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                    }
                                    else {
                                        if (!response_type.format2 ||
                                            !values[1].match(new RegExp(response_type.format2))) {
                                            throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                        }
                                    }
                                }
                                else {
                                    throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                }
                            }
                            else {
                                if (!nodes[i].match(formatRegex)) {
                                    throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                }
                                else {
                                    if (nodes[i] !== "" && response_type.unique) {
                                        for (var j = 0; j < i; j++) {
                                            if (nodes[i] === nodes[j]) {
                                                throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    else {
                        throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE);
                    }
                    this._learner_response = learner_response;
                }
                else {
                    throw new Scorm2004ValidationError(this._cmi_element + ".learner_response", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
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
            if (check2004ValidFormat(this._cmi_element + ".result", result, regex/* scorm2004_regex */.xt.CMIResult)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".latency", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".latency", latency, regex/* scorm2004_regex */.xt.CMITimespan)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".description", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".description", description, regex/* scorm2004_regex */.xt.CMILangString250, true)) {
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
            if (check2004ValidFormat(this._cmi_element + ".id", id, regex/* scorm2004_regex */.xt.CMILongIdentifier)) {
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
    function CMIInteractionsCorrectResponsesObject(parent) {
        var _this = _super.call(this, "cmi.interactions.n.correct_responses.n") || this;
        _this._pattern = "";
        _this._parent = parent;
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
            if (check2004ValidFormat(this._cmi_element + ".pattern", pattern, regex/* scorm2004_regex */.xt.CMIFeedback)) {
                if (this._parent && this._parent.type) {
                    var interactionType = this._parent.type;
                    var response = CorrectResponses[interactionType];
                    if (response) {
                        var isValid = true;
                        var nodes = [];
                        if (response === null || response === void 0 ? void 0 : response.delimiter) {
                            nodes = String(pattern).split(response.delimiter);
                        }
                        else {
                            nodes[0] = pattern;
                        }
                        if (nodes.length > 0 && nodes.length <= response.max) {
                            var formatRegex = new RegExp(response.format);
                            for (var i = 0; i < nodes.length && isValid; i++) {
                                if (response === null || response === void 0 ? void 0 : response.delimiter2) {
                                    var values = nodes[i].split(response.delimiter2);
                                    if (values.length === 2) {
                                        var matches = values[0].match(formatRegex);
                                        if (!matches) {
                                            isValid = false;
                                        }
                                        else if (!response.format2 || !values[1].match(new RegExp(response.format2))) {
                                            isValid = false;
                                        }
                                    }
                                    else {
                                        isValid = false;
                                    }
                                }
                                else {
                                    var matches = nodes[i].match(formatRegex);
                                    if ((!matches && pattern !== "") ||
                                        (!matches && interactionType === "true-false")) {
                                        isValid = false;
                                    }
                                }
                            }
                        }
                        else if (nodes.length > response.max) {
                            isValid = false;
                        }
                        if (!isValid) {
                            throw new Scorm2004ValidationError(this._cmi_element + ".pattern", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
                        }
                    }
                }
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
var score = __webpack_require__(209);
;// ./src/cmi/scorm2004/score.ts







var Scorm2004CMIScore = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(Scorm2004CMIScore, _super);
    function Scorm2004CMIScore() {
        var _this = _super.call(this, {
            CMIElement: "cmi.score",
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
            if (check2004ValidFormat(this._cmi_element + ".scaled", scaled, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                check2004ValidRange(this._cmi_element + ".scaled", scaled, regex/* scorm2004_regex */.xt.scaled_range)) {
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
            CMIElement: "cmi.comments_from_lms",
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
            CMIElement: "cmi.comments_from_learner",
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
        var _this = _super.call(this, "cmi.comments_from_learner.n") || this;
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
                throw new Scorm2004ValidationError(this._cmi_element + ".comment", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".comment", comment, regex/* scorm2004_regex */.xt.CMILangString4000, true)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".location", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".location", location, regex/* scorm2004_regex */.xt.CMIString250)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".timestamp", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".timestamp", timestamp, regex/* scorm2004_regex */.xt.CMITime)) {
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
            CMIElement: "cmi.objectives",
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
        var _this = _super.call(this, "cmi.objectives.n") || this;
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
            if (check2004ValidFormat(this._cmi_element + ".id", id, regex/* scorm2004_regex */.xt.CMILongIdentifier)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".success_status", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".success_status", success_status, regex/* scorm2004_regex */.xt.CMISStatus)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".completion_status", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".completion_status", completion_status, regex/* scorm2004_regex */.xt.CMICStatus)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".progress_measure", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".progress_measure", progress_measure, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                    check2004ValidRange(this._cmi_element + ".progress_measure", progress_measure, regex/* scorm2004_regex */.xt.progress_range)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".description", error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED);
            }
            else {
                if (check2004ValidFormat(this._cmi_element + ".description", description, regex/* scorm2004_regex */.xt.CMILangString250, true)) {
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
        var _this = _super.call(this, "cmi") || this;
        _this.__version = "1.0";
        _this.__children = api_constants/* scorm2004_constants */.zR.cmi_children;
        return _this;
    }
    Object.defineProperty(CMIMetadata.prototype, "_version", {
        get: function () {
            return this.__version;
        },
        set: function (_version) {
            throw new Scorm2004ValidationError(this._cmi_element + "._version", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMIMetadata.prototype, "_children", {
        get: function () {
            return this.__children;
        },
        set: function (_children) {
            throw new Scorm2004ValidationError(this._cmi_element + "._children", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
        var _this = _super.call(this, "cmi") || this;
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
                throw new Scorm2004ValidationError(this._cmi_element + ".learner_id", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
                throw new Scorm2004ValidationError(this._cmi_element + ".learner_name", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
        var _this = _super.call(this, "cmi") || this;
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
            if (check2004ValidFormat(this._cmi_element + ".completion_status", completion_status, regex/* scorm2004_regex */.xt.CMICStatus)) {
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
            if (check2004ValidFormat(this._cmi_element + ".success_status", success_status, regex/* scorm2004_regex */.xt.CMISStatus)) {
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
            if (check2004ValidFormat(this._cmi_element + ".progress_measure", progress_measure, regex/* scorm2004_regex */.xt.CMIDecimal) &&
                check2004ValidRange(this._cmi_element + ".progress_measure", progress_measure, regex/* scorm2004_regex */.xt.progress_range)) {
                this._progress_measure = progress_measure;
            }
        },
        enumerable: false,
        configurable: true
    });
    CMIStatus.prototype.reset = function () {
        this._initialized = false;
        this._completion_status = "unknown";
        this._success_status = "unknown";
        this._progress_measure = "";
    };
    return CMIStatus;
}(base_cmi/* BaseCMI */.J));


// EXTERNAL MODULE: ./src/utilities.ts
var utilities = __webpack_require__(557);
;// ./src/cmi/scorm2004/session.ts







var CMISession = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(CMISession, _super);
    function CMISession() {
        var _this = _super.call(this, "cmi") || this;
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
                throw new Scorm2004ValidationError(this._cmi_element + ".entry", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
                throw new Scorm2004ValidationError(this._cmi_element + ".exit", error_codes/* scorm2004_errors */.Rf.WRITE_ONLY_ELEMENT);
            }
            return this._exit;
        },
        set: function (exit) {
            if (check2004ValidFormat(this._cmi_element + ".exit", exit, regex/* scorm2004_regex */.xt.CMIExit, true)) {
                this._exit = exit;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CMISession.prototype, "session_time", {
        get: function () {
            if (!this.jsonString) {
                throw new Scorm2004ValidationError(this._cmi_element + ".session_time", error_codes/* scorm2004_errors */.Rf.WRITE_ONLY_ELEMENT);
            }
            return this._session_time;
        },
        set: function (session_time) {
            if (check2004ValidFormat(this._cmi_element + ".session_time", session_time, regex/* scorm2004_regex */.xt.CMITimespan)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".total_time", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
        var _this = _super.call(this, "cmi") || this;
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
            if (check2004ValidFormat(this._cmi_element + ".location", location, regex/* scorm2004_regex */.xt.CMIString1000)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".launch_data", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
            if (check2004ValidFormat(this._cmi_element + ".suspend_data", suspend_data, regex/* scorm2004_regex */.xt.CMIString64000, true)) {
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
        var _this = _super.call(this, "cmi") || this;
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
                throw new Scorm2004ValidationError(this._cmi_element + ".credit", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
                throw new Scorm2004ValidationError(this._cmi_element + ".mode", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
                throw new Scorm2004ValidationError(this._cmi_element + ".time_limit_action", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
                throw new Scorm2004ValidationError(this._cmi_element + ".max_time_allowed", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
        var _this = _super.call(this, "cmi") || this;
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
                throw new Scorm2004ValidationError(this._cmi_element + ".scaled_passing_score", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
                throw new Scorm2004ValidationError(this._cmi_element + ".completion_threshold", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
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
        var _this = _super.call(this, "cmi") || this;
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
var enums = __webpack_require__(573);
;// ./src/cmi/scorm2004/adl.ts









var ADL = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(ADL, _super);
    function ADL() {
        var _this = _super.call(this, "adl") || this;
        _this.data = new ADLData();
        _this._sequencing = null;
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
    Object.defineProperty(ADL.prototype, "sequencing", {
        get: function () {
            return this._sequencing;
        },
        set: function (sequencing) {
            this._sequencing = sequencing;
            if (sequencing) {
                sequencing.adlNav = this.nav;
                this.nav.sequencing = sequencing;
            }
        },
        enumerable: false,
        configurable: true
    });
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
        var _this = _super.call(this, "adl.nav") || this;
        _this._request = "_none_";
        _this._sequencing = null;
        _this.request_valid = new ADLNavRequestValid();
        return _this;
    }
    Object.defineProperty(ADLNav.prototype, "sequencing", {
        get: function () {
            return this._sequencing;
        },
        set: function (sequencing) {
            this._sequencing = sequencing;
        },
        enumerable: false,
        configurable: true
    });
    ADLNav.prototype.initialize = function () {
        var _a;
        _super.prototype.initialize.call(this);
        (_a = this.request_valid) === null || _a === void 0 ? void 0 : _a.initialize();
    };
    ADLNav.prototype.reset = function () {
        var _a;
        this._initialized = false;
        this._request = "_none_";
        this._sequencing = null;
        (_a = this.request_valid) === null || _a === void 0 ? void 0 : _a.reset();
    };
    Object.defineProperty(ADLNav.prototype, "request", {
        get: function () {
            return this._request;
        },
        set: function (request) {
            if (check2004ValidFormat(this._cmi_element + ".request", request, regex/* scorm2004_regex */.xt.NAVEvent)) {
                if (this._request !== request) {
                    this._request = request;
                    if (this._sequencing) {
                        this._sequencing.processNavigationRequest(request);
                    }
                }
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
            CMIElement: "adl.data",
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
        var _this = _super.call(this, "adl.data.n") || this;
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
            if (check2004ValidFormat(this._cmi_element + ".id", id, regex/* scorm2004_regex */.xt.CMILongIdentifier)) {
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
            if (check2004ValidFormat(this._cmi_element + ".store", store, regex/* scorm2004_regex */.xt.CMILangString4000)) {
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
        var _this = _super.call(this, "adl.nav.request_valid") || this;
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
                throw new Scorm2004ValidationError(this._cmi_element + ".continue", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            if (check2004ValidFormat(this._cmi_element + ".continue", _continue, regex/* scorm2004_regex */.xt.NAVBoolean)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".previous", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            if (check2004ValidFormat(this._cmi_element + ".previous", _previous, regex/* scorm2004_regex */.xt.NAVBoolean)) {
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
                throw new Scorm2004ValidationError(this._cmi_element + ".choice", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            if (typeof choice !== "object") {
                throw new Scorm2004ValidationError(this._cmi_element + ".choice", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            for (var key in choice) {
                if ({}.hasOwnProperty.call(choice, key)) {
                    if (check2004ValidFormat(this._cmi_element + ".choice." + key, choice[key], regex/* scorm2004_regex */.xt.NAVBoolean) &&
                        check2004ValidFormat(this._cmi_element + ".choice." + key, key, regex/* scorm2004_regex */.xt.NAVTarget)) {
                        var value = choice[key];
                        if (value === "true") {
                            this._choice[key] = enums/* NAVBoolean */.K$.TRUE;
                        }
                        else if (value === "false") {
                            this._choice[key] = enums/* NAVBoolean */.K$.FALSE;
                        }
                        else if (value === "unknown") {
                            this._choice[key] = enums/* NAVBoolean */.K$.UNKNOWN;
                        }
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
                throw new Scorm2004ValidationError(this._cmi_element + ".jump", error_codes/* scorm2004_errors */.Rf.READ_ONLY_ELEMENT);
            }
            if (typeof jump !== "object") {
                throw new Scorm2004ValidationError(this._cmi_element + ".jump", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            for (var key in jump) {
                if ({}.hasOwnProperty.call(jump, key)) {
                    if (check2004ValidFormat(this._cmi_element + ".jump." + key, jump[key], regex/* scorm2004_regex */.xt.NAVBoolean) &&
                        check2004ValidFormat(this._cmi_element + ".jump." + key, key, regex/* scorm2004_regex */.xt.NAVTarget)) {
                        var value = jump[key];
                        if (value === "true") {
                            this._jump[key] = enums/* NAVBoolean */.K$.TRUE;
                        }
                        else if (value === "false") {
                            this._jump[key] = enums/* NAVBoolean */.K$.FALSE;
                        }
                        else if (value === "unknown") {
                            this._jump[key] = enums/* NAVBoolean */.K$.UNKNOWN;
                        }
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


;// ./src/cmi/scorm2004/sequencing/sequencing_rules.ts





var RuleConditionOperator;
(function (RuleConditionOperator) {
    RuleConditionOperator["NOT"] = "not";
    RuleConditionOperator["AND"] = "and";
    RuleConditionOperator["OR"] = "or";
})(RuleConditionOperator || (RuleConditionOperator = {}));
var RuleConditionType;
(function (RuleConditionType) {
    RuleConditionType["SATISFIED"] = "satisfied";
    RuleConditionType["OBJECTIVE_STATUS_KNOWN"] = "objectiveStatusKnown";
    RuleConditionType["OBJECTIVE_MEASURE_KNOWN"] = "objectiveMeasureKnown";
    RuleConditionType["OBJECTIVE_MEASURE_GREATER_THAN"] = "objectiveMeasureGreaterThan";
    RuleConditionType["OBJECTIVE_MEASURE_LESS_THAN"] = "objectiveMeasureLessThan";
    RuleConditionType["COMPLETED"] = "completed";
    RuleConditionType["PROGRESS_KNOWN"] = "progressKnown";
    RuleConditionType["ATTEMPTED"] = "attempted";
    RuleConditionType["ATTEMPT_LIMIT_EXCEEDED"] = "attemptLimitExceeded";
    RuleConditionType["TIME_LIMIT_EXCEEDED"] = "timeLimitExceeded";
    RuleConditionType["OUTSIDE_AVAILABLE_TIME_RANGE"] = "outsideAvailableTimeRange";
    RuleConditionType["ALWAYS"] = "always";
})(RuleConditionType || (RuleConditionType = {}));
var RuleActionType;
(function (RuleActionType) {
    RuleActionType["SKIP"] = "skip";
    RuleActionType["DISABLED"] = "disabled";
    RuleActionType["HIDE_FROM_CHOICE"] = "hideFromChoice";
    RuleActionType["STOP_FORWARD_TRAVERSAL"] = "stopForwardTraversal";
    RuleActionType["EXIT_PARENT"] = "exitParent";
    RuleActionType["EXIT_ALL"] = "exitAll";
    RuleActionType["RETRY"] = "retry";
    RuleActionType["RETRY_ALL"] = "retryAll";
    RuleActionType["CONTINUE"] = "continue";
    RuleActionType["PREVIOUS"] = "previous";
    RuleActionType["EXIT"] = "exit";
})(RuleActionType || (RuleActionType = {}));
var RuleCondition = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(RuleCondition, _super);
    function RuleCondition(condition, operator, parameters) {
        if (condition === void 0) { condition = RuleConditionType.ALWAYS; }
        if (operator === void 0) { operator = null; }
        if (parameters === void 0) { parameters = new Map(); }
        var _this = _super.call(this, "ruleCondition") || this;
        _this._condition = RuleConditionType.ALWAYS;
        _this._operator = null;
        _this._parameters = new Map();
        _this._condition = condition;
        _this._operator = operator;
        _this._parameters = parameters;
        return _this;
    }
    RuleCondition.prototype.reset = function () {
        this._initialized = false;
    };
    Object.defineProperty(RuleCondition.prototype, "condition", {
        get: function () {
            return this._condition;
        },
        set: function (condition) {
            this._condition = condition;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RuleCondition.prototype, "operator", {
        get: function () {
            return this._operator;
        },
        set: function (operator) {
            this._operator = operator;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RuleCondition.prototype, "parameters", {
        get: function () {
            return this._parameters;
        },
        set: function (parameters) {
            this._parameters = parameters;
        },
        enumerable: false,
        configurable: true
    });
    RuleCondition.prototype.evaluate = function (activity) {
        switch (this._condition) {
            case RuleConditionType.SATISFIED:
                return activity.successStatus === enums/* SuccessStatus */.YE.PASSED;
            case RuleConditionType.OBJECTIVE_STATUS_KNOWN:
                return activity.objectiveMeasureStatus;
            case RuleConditionType.OBJECTIVE_MEASURE_KNOWN:
                return activity.objectiveMeasureStatus;
            case RuleConditionType.OBJECTIVE_MEASURE_GREATER_THAN: {
                var greaterThanValue = this._parameters.get("threshold") || 0;
                return (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure > greaterThanValue);
            }
            case RuleConditionType.OBJECTIVE_MEASURE_LESS_THAN: {
                var lessThanValue = this._parameters.get("threshold") || 0;
                return (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure < lessThanValue);
            }
            case RuleConditionType.COMPLETED:
                return activity.isCompleted;
            case RuleConditionType.PROGRESS_KNOWN:
                return activity.completionStatus !== "unknown";
            case RuleConditionType.ATTEMPTED:
                return activity.attemptCount > 0;
            case RuleConditionType.ATTEMPT_LIMIT_EXCEEDED: {
                var attemptLimit = this._parameters.get("attemptLimit") || 0;
                return attemptLimit > 0 && activity.attemptCount >= attemptLimit;
            }
            case RuleConditionType.TIME_LIMIT_EXCEEDED:
                return false;
            case RuleConditionType.OUTSIDE_AVAILABLE_TIME_RANGE:
                return false;
            case RuleConditionType.ALWAYS:
                return true;
            default:
                return false;
        }
    };
    RuleCondition.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            condition: this._condition,
            operator: this._operator,
            parameters: Object.fromEntries(this._parameters),
        };
        delete this.jsonString;
        return result;
    };
    return RuleCondition;
}(base_cmi/* BaseCMI */.J));

var SequencingRule = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(SequencingRule, _super);
    function SequencingRule(action, conditionCombination) {
        if (action === void 0) { action = RuleActionType.SKIP; }
        if (conditionCombination === void 0) { conditionCombination = RuleConditionOperator.AND; }
        var _this = _super.call(this, "sequencingRule") || this;
        _this._conditions = [];
        _this._action = RuleActionType.SKIP;
        _this._conditionCombination = RuleConditionOperator.AND;
        _this._action = action;
        _this._conditionCombination = conditionCombination;
        return _this;
    }
    SequencingRule.prototype.reset = function () {
        this._initialized = false;
        this._conditions = [];
    };
    Object.defineProperty(SequencingRule.prototype, "conditions", {
        get: function () {
            return this._conditions;
        },
        enumerable: false,
        configurable: true
    });
    SequencingRule.prototype.addCondition = function (condition) {
        if (!(condition instanceof RuleCondition)) {
            throw new Scorm2004ValidationError(this._cmi_element + ".conditions", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
        }
        this._conditions.push(condition);
    };
    SequencingRule.prototype.removeCondition = function (condition) {
        var index = this._conditions.indexOf(condition);
        if (index !== -1) {
            this._conditions.splice(index, 1);
            return true;
        }
        return false;
    };
    Object.defineProperty(SequencingRule.prototype, "action", {
        get: function () {
            return this._action;
        },
        set: function (action) {
            this._action = action;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingRule.prototype, "conditionCombination", {
        get: function () {
            return this._conditionCombination;
        },
        set: function (conditionCombination) {
            this._conditionCombination = conditionCombination;
        },
        enumerable: false,
        configurable: true
    });
    SequencingRule.prototype.evaluate = function (activity) {
        if (this._conditions.length === 0) {
            return true;
        }
        if (this._conditionCombination === RuleConditionOperator.AND) {
            return this._conditions.every(function (condition) { return condition.evaluate(activity); });
        }
        else if (this._conditionCombination === RuleConditionOperator.OR) {
            return this._conditions.some(function (condition) { return condition.evaluate(activity); });
        }
        return false;
    };
    SequencingRule.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            conditions: this._conditions,
            action: this._action,
            conditionCombination: this._conditionCombination,
        };
        delete this.jsonString;
        return result;
    };
    return SequencingRule;
}(base_cmi/* BaseCMI */.J));

var SequencingRules = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(SequencingRules, _super);
    function SequencingRules() {
        var _this = _super.call(this, "sequencingRules") || this;
        _this._preConditionRules = [];
        _this._exitConditionRules = [];
        _this._postConditionRules = [];
        return _this;
    }
    SequencingRules.prototype.reset = function () {
        this._initialized = false;
        this._preConditionRules = [];
        this._exitConditionRules = [];
        this._postConditionRules = [];
    };
    Object.defineProperty(SequencingRules.prototype, "preConditionRules", {
        get: function () {
            return this._preConditionRules;
        },
        enumerable: false,
        configurable: true
    });
    SequencingRules.prototype.addPreConditionRule = function (rule) {
        if (!(rule instanceof SequencingRule)) {
            throw new Scorm2004ValidationError(this._cmi_element + ".preConditionRules", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
        }
        this._preConditionRules.push(rule);
    };
    Object.defineProperty(SequencingRules.prototype, "exitConditionRules", {
        get: function () {
            return this._exitConditionRules;
        },
        enumerable: false,
        configurable: true
    });
    SequencingRules.prototype.addExitConditionRule = function (rule) {
        if (!(rule instanceof SequencingRule)) {
            throw new Scorm2004ValidationError(this._cmi_element + ".exitConditionRules", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
        }
        this._exitConditionRules.push(rule);
    };
    Object.defineProperty(SequencingRules.prototype, "postConditionRules", {
        get: function () {
            return this._postConditionRules;
        },
        enumerable: false,
        configurable: true
    });
    SequencingRules.prototype.addPostConditionRule = function (rule) {
        if (!(rule instanceof SequencingRule)) {
            throw new Scorm2004ValidationError(this._cmi_element + ".postConditionRules", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
        }
        this._postConditionRules.push(rule);
    };
    SequencingRules.prototype.evaluatePreConditionRules = function (activity) {
        for (var _i = 0, _a = this._preConditionRules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (rule.evaluate(activity)) {
                return rule.action;
            }
        }
        return null;
    };
    SequencingRules.prototype.evaluateExitConditionRules = function (activity) {
        for (var _i = 0, _a = this._exitConditionRules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (rule.evaluate(activity)) {
                return rule.action;
            }
        }
        return null;
    };
    SequencingRules.prototype.evaluatePostConditionRules = function (activity) {
        for (var _i = 0, _a = this._postConditionRules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (rule.evaluate(activity)) {
                return rule.action;
            }
        }
        return null;
    };
    SequencingRules.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            preConditionRules: this._preConditionRules,
            exitConditionRules: this._exitConditionRules,
            postConditionRules: this._postConditionRules,
        };
        delete this.jsonString;
        return result;
    };
    return SequencingRules;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/sequencing/rollup_rules.ts





var RollupActionType;
(function (RollupActionType) {
    RollupActionType["SATISFIED"] = "satisfied";
    RollupActionType["NOT_SATISFIED"] = "notSatisfied";
    RollupActionType["COMPLETED"] = "completed";
    RollupActionType["INCOMPLETE"] = "incomplete";
})(RollupActionType || (RollupActionType = {}));
var RollupConditionType;
(function (RollupConditionType) {
    RollupConditionType["SATISFIED"] = "satisfied";
    RollupConditionType["OBJECTIVE_STATUS_KNOWN"] = "objectiveStatusKnown";
    RollupConditionType["OBJECTIVE_MEASURE_KNOWN"] = "objectiveMeasureKnown";
    RollupConditionType["OBJECTIVE_MEASURE_GREATER_THAN"] = "objectiveMeasureGreaterThan";
    RollupConditionType["OBJECTIVE_MEASURE_LESS_THAN"] = "objectiveMeasureLessThan";
    RollupConditionType["COMPLETED"] = "completed";
    RollupConditionType["PROGRESS_KNOWN"] = "progressKnown";
    RollupConditionType["ATTEMPTED"] = "attempted";
    RollupConditionType["NOT_ATTEMPTED"] = "notAttempted";
    RollupConditionType["ALWAYS"] = "always";
})(RollupConditionType || (RollupConditionType = {}));
var RollupConsiderationType;
(function (RollupConsiderationType) {
    RollupConsiderationType["ALL"] = "all";
    RollupConsiderationType["ANY"] = "any";
    RollupConsiderationType["NONE"] = "none";
    RollupConsiderationType["AT_LEAST_COUNT"] = "atLeastCount";
    RollupConsiderationType["AT_LEAST_PERCENT"] = "atLeastPercent";
})(RollupConsiderationType || (RollupConsiderationType = {}));
var RollupCondition = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(RollupCondition, _super);
    function RollupCondition(condition, parameters) {
        if (condition === void 0) { condition = RollupConditionType.ALWAYS; }
        if (parameters === void 0) { parameters = new Map(); }
        var _this = _super.call(this, "rollupCondition") || this;
        _this._condition = RollupConditionType.ALWAYS;
        _this._parameters = new Map();
        _this._condition = condition;
        _this._parameters = parameters;
        return _this;
    }
    RollupCondition.prototype.reset = function () {
        this._initialized = false;
    };
    Object.defineProperty(RollupCondition.prototype, "condition", {
        get: function () {
            return this._condition;
        },
        set: function (condition) {
            this._condition = condition;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RollupCondition.prototype, "parameters", {
        get: function () {
            return this._parameters;
        },
        set: function (parameters) {
            this._parameters = parameters;
        },
        enumerable: false,
        configurable: true
    });
    RollupCondition.prototype.evaluate = function (activity) {
        switch (this._condition) {
            case RollupConditionType.SATISFIED:
                return activity.successStatus === enums/* SuccessStatus */.YE.PASSED;
            case RollupConditionType.OBJECTIVE_STATUS_KNOWN:
                return activity.objectiveMeasureStatus;
            case RollupConditionType.OBJECTIVE_MEASURE_KNOWN:
                return activity.objectiveMeasureStatus;
            case RollupConditionType.OBJECTIVE_MEASURE_GREATER_THAN: {
                var greaterThanValue = this._parameters.get("threshold") || 0;
                return (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure > greaterThanValue);
            }
            case RollupConditionType.OBJECTIVE_MEASURE_LESS_THAN: {
                var lessThanValue = this._parameters.get("threshold") || 0;
                return (activity.objectiveMeasureStatus && activity.objectiveNormalizedMeasure < lessThanValue);
            }
            case RollupConditionType.COMPLETED:
                return activity.isCompleted;
            case RollupConditionType.PROGRESS_KNOWN:
                return activity.completionStatus !== enums/* CompletionStatus */.lC.UNKNOWN;
            case RollupConditionType.ATTEMPTED:
                return activity.attemptCount > 0;
            case RollupConditionType.NOT_ATTEMPTED:
                return activity.attemptCount === 0;
            case RollupConditionType.ALWAYS:
                return true;
            default:
                return false;
        }
    };
    RollupCondition.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            condition: this._condition,
            parameters: Object.fromEntries(this._parameters),
        };
        delete this.jsonString;
        return result;
    };
    return RollupCondition;
}(base_cmi/* BaseCMI */.J));

var RollupRule = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(RollupRule, _super);
    function RollupRule(action, consideration, minimumCount, minimumPercent) {
        if (action === void 0) { action = RollupActionType.SATISFIED; }
        if (consideration === void 0) { consideration = RollupConsiderationType.ALL; }
        if (minimumCount === void 0) { minimumCount = 0; }
        if (minimumPercent === void 0) { minimumPercent = 0; }
        var _this = _super.call(this, "rollupRule") || this;
        _this._conditions = [];
        _this._action = RollupActionType.SATISFIED;
        _this._consideration = RollupConsiderationType.ALL;
        _this._minimumCount = 0;
        _this._minimumPercent = 0;
        _this._action = action;
        _this._consideration = consideration;
        _this._minimumCount = minimumCount;
        _this._minimumPercent = minimumPercent;
        return _this;
    }
    RollupRule.prototype.reset = function () {
        this._initialized = false;
        this._conditions = [];
    };
    Object.defineProperty(RollupRule.prototype, "conditions", {
        get: function () {
            return this._conditions;
        },
        enumerable: false,
        configurable: true
    });
    RollupRule.prototype.addCondition = function (condition) {
        if (!(condition instanceof RollupCondition)) {
            throw new Scorm2004ValidationError(this._cmi_element + ".conditions", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
        }
        this._conditions.push(condition);
    };
    RollupRule.prototype.removeCondition = function (condition) {
        var index = this._conditions.indexOf(condition);
        if (index !== -1) {
            this._conditions.splice(index, 1);
            return true;
        }
        return false;
    };
    Object.defineProperty(RollupRule.prototype, "action", {
        get: function () {
            return this._action;
        },
        set: function (action) {
            this._action = action;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RollupRule.prototype, "consideration", {
        get: function () {
            return this._consideration;
        },
        set: function (consideration) {
            this._consideration = consideration;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RollupRule.prototype, "minimumCount", {
        get: function () {
            return this._minimumCount;
        },
        set: function (minimumCount) {
            if (minimumCount >= 0) {
                this._minimumCount = minimumCount;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RollupRule.prototype, "minimumPercent", {
        get: function () {
            return this._minimumPercent;
        },
        set: function (minimumPercent) {
            if (minimumPercent >= 0 && minimumPercent <= 100) {
                this._minimumPercent = minimumPercent;
            }
        },
        enumerable: false,
        configurable: true
    });
    RollupRule.prototype.evaluate = function (children) {
        var _this = this;
        if (children.length === 0) {
            return false;
        }
        var matchingChildren = children.filter(function (child) {
            return _this._conditions.every(function (condition) { return condition.evaluate(child); });
        });
        switch (this._consideration) {
            case RollupConsiderationType.ALL:
                return matchingChildren.length === children.length;
            case RollupConsiderationType.ANY:
                return matchingChildren.length > 0;
            case RollupConsiderationType.NONE:
                return matchingChildren.length === 0;
            case RollupConsiderationType.AT_LEAST_COUNT:
                return matchingChildren.length >= this._minimumCount;
            case RollupConsiderationType.AT_LEAST_PERCENT: {
                var percent = (matchingChildren.length / children.length) * 100;
                return percent >= this._minimumPercent;
            }
            default:
                return false;
        }
    };
    RollupRule.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            conditions: this._conditions,
            action: this._action,
            consideration: this._consideration,
            minimumCount: this._minimumCount,
            minimumPercent: this._minimumPercent,
        };
        delete this.jsonString;
        return result;
    };
    return RollupRule;
}(base_cmi/* BaseCMI */.J));

var RollupRules = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(RollupRules, _super);
    function RollupRules() {
        var _this = _super.call(this, "rollupRules") || this;
        _this._rules = [];
        return _this;
    }
    RollupRules.prototype.reset = function () {
        this._initialized = false;
        this._rules = [];
    };
    Object.defineProperty(RollupRules.prototype, "rules", {
        get: function () {
            return this._rules;
        },
        enumerable: false,
        configurable: true
    });
    RollupRules.prototype.addRule = function (rule) {
        if (!(rule instanceof RollupRule)) {
            throw new Scorm2004ValidationError(this._cmi_element + ".rules", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
        }
        this._rules.push(rule);
    };
    RollupRules.prototype.removeRule = function (rule) {
        var index = this._rules.indexOf(rule);
        if (index !== -1) {
            this._rules.splice(index, 1);
            return true;
        }
        return false;
    };
    RollupRules.prototype.processRollup = function (activity) {
        if (!activity || activity.children.length === 0) {
            return;
        }
        var children = activity.children;
        var completionRollup = false;
        var successRollup = false;
        for (var _i = 0, _a = this._rules; _i < _a.length; _i++) {
            var rule = _a[_i];
            if (rule.evaluate(children)) {
                switch (rule.action) {
                    case RollupActionType.SATISFIED:
                        activity.successStatus = enums/* SuccessStatus */.YE.PASSED;
                        successRollup = true;
                        break;
                    case RollupActionType.NOT_SATISFIED:
                        activity.successStatus = enums/* SuccessStatus */.YE.FAILED;
                        successRollup = true;
                        break;
                    case RollupActionType.COMPLETED:
                        activity.completionStatus = enums/* CompletionStatus */.lC.COMPLETED;
                        activity.isCompleted = true;
                        completionRollup = true;
                        break;
                    case RollupActionType.INCOMPLETE:
                        activity.completionStatus = enums/* CompletionStatus */.lC.INCOMPLETE;
                        activity.isCompleted = false;
                        completionRollup = true;
                        break;
                }
            }
        }
        if (!completionRollup) {
            this._defaultCompletionRollup(activity, children);
        }
        if (!successRollup) {
            this._defaultSuccessRollup(activity, children);
        }
    };
    RollupRules.prototype._defaultCompletionRollup = function (activity, children) {
        var allCompleted = children.every(function (child) { return child.isCompleted; });
        if (allCompleted) {
            activity.completionStatus = enums/* CompletionStatus */.lC.COMPLETED;
            activity.isCompleted = true;
        }
        else {
            var anyIncomplete = children.some(function (child) { return child.completionStatus === enums/* CompletionStatus */.lC.INCOMPLETE; });
            if (anyIncomplete) {
                activity.completionStatus = enums/* CompletionStatus */.lC.INCOMPLETE;
                activity.isCompleted = false;
            }
        }
    };
    RollupRules.prototype._defaultSuccessRollup = function (activity, children) {
        var allSatisfied = children.every(function (child) { return child.successStatus === enums/* SuccessStatus */.YE.PASSED; });
        if (allSatisfied) {
            activity.successStatus = enums/* SuccessStatus */.YE.PASSED;
        }
        else {
            var anyNotSatisfied = children.some(function (child) { return child.successStatus === enums/* SuccessStatus */.YE.FAILED; });
            if (anyNotSatisfied) {
                activity.successStatus = enums/* SuccessStatus */.YE.FAILED;
            }
        }
    };
    RollupRules.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            rules: this._rules,
        };
        delete this.jsonString;
        return result;
    };
    return RollupRules;
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

;// ./src/cmi/scorm2004/sequencing/activity.ts







var Activity = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(Activity, _super);
    function Activity(id, title) {
        if (id === void 0) { id = ""; }
        if (title === void 0) { title = ""; }
        var _this = _super.call(this, "activity") || this;
        _this._id = "";
        _this._title = "";
        _this._children = [];
        _this._parent = null;
        _this._isVisible = true;
        _this._isActive = false;
        _this._isSuspended = false;
        _this._isCompleted = false;
        _this._completionStatus = enums/* CompletionStatus */.lC.UNKNOWN;
        _this._successStatus = enums/* SuccessStatus */.YE.UNKNOWN;
        _this._attemptCount = 0;
        _this._attemptCompletionAmount = 0;
        _this._attemptAbsoluteDuration = "PT0H0M0S";
        _this._attemptExperiencedDuration = "PT0H0M0S";
        _this._activityAbsoluteDuration = "PT0H0M0S";
        _this._activityExperiencedDuration = "PT0H0M0S";
        _this._objectiveSatisfiedStatus = false;
        _this._objectiveMeasureStatus = false;
        _this._objectiveNormalizedMeasure = 0;
        _this._id = id;
        _this._title = title;
        return _this;
    }
    Activity.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.initialize();
        }
    };
    Activity.prototype.reset = function () {
        this._initialized = false;
        this._isActive = false;
        this._isSuspended = false;
        this._isCompleted = false;
        this._completionStatus = enums/* CompletionStatus */.lC.UNKNOWN;
        this._successStatus = enums/* SuccessStatus */.YE.UNKNOWN;
        this._attemptCount = 0;
        this._attemptCompletionAmount = 0;
        this._attemptAbsoluteDuration = "PT0H0M0S";
        this._attemptExperiencedDuration = "PT0H0M0S";
        this._activityAbsoluteDuration = "PT0H0M0S";
        this._activityExperiencedDuration = "PT0H0M0S";
        this._objectiveSatisfiedStatus = false;
        this._objectiveMeasureStatus = false;
        this._objectiveNormalizedMeasure = 0;
        for (var _i = 0, _a = this._children; _i < _a.length; _i++) {
            var child = _a[_i];
            child.reset();
        }
    };
    Object.defineProperty(Activity.prototype, "id", {
        get: function () {
            return this._id;
        },
        set: function (id) {
            if (check2004ValidFormat(this._cmi_element + ".id", id, regex/* scorm2004_regex */.xt.CMILongIdentifier)) {
                this._id = id;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "title", {
        get: function () {
            return this._title;
        },
        set: function (title) {
            if (check2004ValidFormat(this._cmi_element + ".title", title, regex/* scorm2004_regex */.xt.CMILangString250)) {
                this._title = title;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "children", {
        get: function () {
            return this._children;
        },
        enumerable: false,
        configurable: true
    });
    Activity.prototype.addChild = function (child) {
        if (!(child instanceof Activity)) {
            throw new Scorm2004ValidationError(this._cmi_element + ".children", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
        }
        child._parent = this;
        this._children.push(child);
    };
    Activity.prototype.removeChild = function (child) {
        var index = this._children.indexOf(child);
        if (index !== -1) {
            this._children.splice(index, 1);
            child._parent = null;
            return true;
        }
        return false;
    };
    Object.defineProperty(Activity.prototype, "parent", {
        get: function () {
            return this._parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "isVisible", {
        get: function () {
            return this._isVisible;
        },
        set: function (isVisible) {
            this._isVisible = isVisible;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "isActive", {
        get: function () {
            return this._isActive;
        },
        set: function (isActive) {
            this._isActive = isActive;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "isSuspended", {
        get: function () {
            return this._isSuspended;
        },
        set: function (isSuspended) {
            this._isSuspended = isSuspended;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "isCompleted", {
        get: function () {
            return this._isCompleted;
        },
        set: function (isCompleted) {
            this._isCompleted = isCompleted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "completionStatus", {
        get: function () {
            return this._completionStatus;
        },
        set: function (completionStatus) {
            this._completionStatus = completionStatus;
            this._isCompleted = completionStatus === enums/* CompletionStatus */.lC.COMPLETED;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "successStatus", {
        get: function () {
            return this._successStatus;
        },
        set: function (successStatus) {
            this._successStatus = successStatus;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "attemptCount", {
        get: function () {
            return this._attemptCount;
        },
        enumerable: false,
        configurable: true
    });
    Activity.prototype.incrementAttemptCount = function () {
        this._attemptCount++;
    };
    Object.defineProperty(Activity.prototype, "objectiveMeasureStatus", {
        get: function () {
            return this._objectiveMeasureStatus;
        },
        set: function (objectiveMeasureStatus) {
            this._objectiveMeasureStatus = objectiveMeasureStatus;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Activity.prototype, "objectiveNormalizedMeasure", {
        get: function () {
            return this._objectiveNormalizedMeasure;
        },
        set: function (objectiveNormalizedMeasure) {
            this._objectiveNormalizedMeasure = objectiveNormalizedMeasure;
        },
        enumerable: false,
        configurable: true
    });
    Activity.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            id: this._id,
            title: this._title,
            isVisible: this._isVisible,
            isActive: this._isActive,
            isSuspended: this._isSuspended,
            isCompleted: this._isCompleted,
            completionStatus: this._completionStatus,
            successStatus: this._successStatus,
            attemptCount: this._attemptCount,
            attemptCompletionAmount: this._attemptCompletionAmount,
            attemptAbsoluteDuration: this._attemptAbsoluteDuration,
            attemptExperiencedDuration: this._attemptExperiencedDuration,
            activityAbsoluteDuration: this._activityAbsoluteDuration,
            activityExperiencedDuration: this._activityExperiencedDuration,
            objectiveSatisfiedStatus: this._objectiveSatisfiedStatus,
            objectiveMeasureStatus: this._objectiveMeasureStatus,
            objectiveNormalizedMeasure: this._objectiveNormalizedMeasure,
            children: this._children.map(function (child) { return child.toJSON(); }),
        };
        delete this.jsonString;
        return result;
    };
    return Activity;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/sequencing/activity_tree.ts





var ActivityTree = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(ActivityTree, _super);
    function ActivityTree() {
        var _this = _super.call(this, "activityTree") || this;
        _this._root = null;
        _this._currentActivity = null;
        _this._suspendedActivity = null;
        _this._activities = new Map();
        return _this;
    }
    ActivityTree.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        if (this._root) {
            this._root.initialize();
        }
    };
    ActivityTree.prototype.reset = function () {
        this._initialized = false;
        this._currentActivity = null;
        this._suspendedActivity = null;
        if (this._root) {
            this._root.reset();
        }
    };
    Object.defineProperty(ActivityTree.prototype, "root", {
        get: function () {
            return this._root;
        },
        set: function (root) {
            if (root !== null && !(root instanceof Activity)) {
                throw new Scorm2004ValidationError(this._cmi_element + ".root", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            this._root = root;
            if (root) {
                this._activities.set(root.id, root);
                this._addActivitiesToMap(root);
            }
        },
        enumerable: false,
        configurable: true
    });
    ActivityTree.prototype._addActivitiesToMap = function (activity) {
        for (var _i = 0, _a = activity.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this._activities.set(child.id, child);
            this._addActivitiesToMap(child);
        }
    };
    Object.defineProperty(ActivityTree.prototype, "currentActivity", {
        get: function () {
            return this._currentActivity;
        },
        set: function (activity) {
            if (activity !== null && !(activity instanceof Activity)) {
                throw new Scorm2004ValidationError(this._cmi_element + ".currentActivity", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            if (this._currentActivity) {
                this._currentActivity.isActive = false;
            }
            this._currentActivity = activity;
            if (activity) {
                activity.isActive = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ActivityTree.prototype, "suspendedActivity", {
        get: function () {
            return this._suspendedActivity;
        },
        set: function (activity) {
            if (activity !== null && !(activity instanceof Activity)) {
                throw new Scorm2004ValidationError(this._cmi_element + ".suspendedActivity", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            if (this._suspendedActivity) {
                this._suspendedActivity.isSuspended = false;
            }
            this._suspendedActivity = activity;
            if (activity) {
                activity.isSuspended = true;
            }
        },
        enumerable: false,
        configurable: true
    });
    ActivityTree.prototype.getActivity = function (id) {
        return this._activities.get(id);
    };
    ActivityTree.prototype.getAllActivities = function () {
        return Array.from(this._activities.values());
    };
    ActivityTree.prototype.getParent = function (activity) {
        return activity.parent;
    };
    ActivityTree.prototype.getChildren = function (activity) {
        return activity.children;
    };
    ActivityTree.prototype.getSiblings = function (activity) {
        if (!activity.parent) {
            return [];
        }
        return activity.parent.children.filter(function (child) { return child !== activity; });
    };
    ActivityTree.prototype.getNextSibling = function (activity) {
        if (!activity.parent) {
            return null;
        }
        var siblings = activity.parent.children;
        var index = siblings.indexOf(activity);
        if (index === -1 || index === siblings.length - 1) {
            return null;
        }
        return siblings[index + 1];
    };
    ActivityTree.prototype.getPreviousSibling = function (activity) {
        if (!activity.parent) {
            return null;
        }
        var siblings = activity.parent.children;
        var index = siblings.indexOf(activity);
        if (index <= 0) {
            return null;
        }
        return siblings[index - 1];
    };
    ActivityTree.prototype.getFirstChild = function (activity) {
        if (activity.children.length === 0) {
            return null;
        }
        return activity.children[0];
    };
    ActivityTree.prototype.getLastChild = function (activity) {
        if (activity.children.length === 0) {
            return null;
        }
        return activity.children[activity.children.length - 1];
    };
    ActivityTree.prototype.getCommonAncestor = function (activity1, activity2) {
        var path1 = [];
        var current = activity1;
        while (current) {
            path1.unshift(current);
            current = current.parent;
        }
        current = activity2;
        while (current) {
            if (path1.includes(current)) {
                return current;
            }
            current = current.parent;
        }
        return null;
    };
    ActivityTree.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            root: this._root,
            currentActivity: this._currentActivity ? this._currentActivity.id : null,
            suspendedActivity: this._suspendedActivity ? this._suspendedActivity.id : null,
        };
        delete this.jsonString;
        return result;
    };
    return ActivityTree;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/sequencing/sequencing_controls.ts


var SequencingControls = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(SequencingControls, _super);
    function SequencingControls() {
        var _this = _super.call(this, "sequencingControls") || this;
        _this._enabled = true;
        _this._choiceExit = true;
        _this._flow = false;
        _this._forwardOnly = false;
        _this._useCurrentAttemptObjectiveInfo = true;
        _this._useCurrentAttemptProgressInfo = true;
        _this._preventActivation = false;
        _this._constrainChoice = false;
        _this._rollupObjectiveSatisfied = true;
        _this._rollupProgressCompletion = true;
        _this._objectiveMeasureWeight = 1.0;
        return _this;
    }
    SequencingControls.prototype.reset = function () {
        this._initialized = false;
        this._enabled = true;
        this._choiceExit = true;
        this._flow = false;
        this._forwardOnly = false;
        this._useCurrentAttemptObjectiveInfo = true;
        this._useCurrentAttemptProgressInfo = true;
        this._preventActivation = false;
        this._constrainChoice = false;
        this._rollupObjectiveSatisfied = true;
        this._rollupProgressCompletion = true;
        this._objectiveMeasureWeight = 1.0;
    };
    Object.defineProperty(SequencingControls.prototype, "enabled", {
        get: function () {
            return this._enabled;
        },
        set: function (enabled) {
            this._enabled = enabled;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "choiceExit", {
        get: function () {
            return this._choiceExit;
        },
        set: function (choiceExit) {
            this._choiceExit = choiceExit;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "flow", {
        get: function () {
            return this._flow;
        },
        set: function (flow) {
            this._flow = flow;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "forwardOnly", {
        get: function () {
            return this._forwardOnly;
        },
        set: function (forwardOnly) {
            this._forwardOnly = forwardOnly;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "useCurrentAttemptObjectiveInfo", {
        get: function () {
            return this._useCurrentAttemptObjectiveInfo;
        },
        set: function (useCurrentAttemptObjectiveInfo) {
            this._useCurrentAttemptObjectiveInfo = useCurrentAttemptObjectiveInfo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "useCurrentAttemptProgressInfo", {
        get: function () {
            return this._useCurrentAttemptProgressInfo;
        },
        set: function (useCurrentAttemptProgressInfo) {
            this._useCurrentAttemptProgressInfo = useCurrentAttemptProgressInfo;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "preventActivation", {
        get: function () {
            return this._preventActivation;
        },
        set: function (preventActivation) {
            this._preventActivation = preventActivation;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "constrainChoice", {
        get: function () {
            return this._constrainChoice;
        },
        set: function (constrainChoice) {
            this._constrainChoice = constrainChoice;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "rollupObjectiveSatisfied", {
        get: function () {
            return this._rollupObjectiveSatisfied;
        },
        set: function (rollupObjectiveSatisfied) {
            this._rollupObjectiveSatisfied = rollupObjectiveSatisfied;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "rollupProgressCompletion", {
        get: function () {
            return this._rollupProgressCompletion;
        },
        set: function (rollupProgressCompletion) {
            this._rollupProgressCompletion = rollupProgressCompletion;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SequencingControls.prototype, "objectiveMeasureWeight", {
        get: function () {
            return this._objectiveMeasureWeight;
        },
        set: function (objectiveMeasureWeight) {
            if (objectiveMeasureWeight >= 0 && objectiveMeasureWeight <= 1) {
                this._objectiveMeasureWeight = objectiveMeasureWeight;
            }
        },
        enumerable: false,
        configurable: true
    });
    SequencingControls.prototype.isChoiceNavigationAllowed = function () {
        return this._enabled && !this._constrainChoice;
    };
    SequencingControls.prototype.isFlowNavigationAllowed = function () {
        return this._enabled && this._flow;
    };
    SequencingControls.prototype.isForwardNavigationAllowed = function () {
        return this._enabled && (!this._forwardOnly || this._flow);
    };
    SequencingControls.prototype.isBackwardNavigationAllowed = function () {
        return this._enabled && !this._forwardOnly;
    };
    SequencingControls.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            enabled: this._enabled,
            choiceExit: this._choiceExit,
            flow: this._flow,
            forwardOnly: this._forwardOnly,
            useCurrentAttemptObjectiveInfo: this._useCurrentAttemptObjectiveInfo,
            useCurrentAttemptProgressInfo: this._useCurrentAttemptProgressInfo,
            preventActivation: this._preventActivation,
            constrainChoice: this._constrainChoice,
            rollupObjectiveSatisfied: this._rollupObjectiveSatisfied,
            rollupProgressCompletion: this._rollupProgressCompletion,
            objectiveMeasureWeight: this._objectiveMeasureWeight,
        };
        delete this.jsonString;
        return result;
    };
    return SequencingControls;
}(base_cmi/* BaseCMI */.J));


;// ./src/cmi/scorm2004/sequencing/sequencing.ts








var Sequencing = (function (_super) {
    (0,tslib_es6/* __extends */.C6)(Sequencing, _super);
    function Sequencing() {
        var _this = _super.call(this, "sequencing") || this;
        _this._adlNav = null;
        _this._activityTree = new ActivityTree();
        _this._sequencingRules = new SequencingRules();
        _this._sequencingControls = new SequencingControls();
        _this._rollupRules = new RollupRules();
        return _this;
    }
    Sequencing.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this._activityTree.initialize();
        this._sequencingRules.initialize();
        this._sequencingControls.initialize();
        this._rollupRules.initialize();
    };
    Sequencing.prototype.reset = function () {
        this._initialized = false;
        this._activityTree.reset();
        this._sequencingRules.reset();
        this._sequencingControls.reset();
        this._rollupRules.reset();
    };
    Object.defineProperty(Sequencing.prototype, "activityTree", {
        get: function () {
            return this._activityTree;
        },
        set: function (activityTree) {
            if (!(activityTree instanceof ActivityTree)) {
                throw new Scorm2004ValidationError(this._cmi_element + ".activityTree", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            this._activityTree = activityTree;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sequencing.prototype, "sequencingRules", {
        get: function () {
            return this._sequencingRules;
        },
        set: function (sequencingRules) {
            if (!(sequencingRules instanceof SequencingRules)) {
                throw new Scorm2004ValidationError(this._cmi_element + ".sequencingRules", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            this._sequencingRules = sequencingRules;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sequencing.prototype, "sequencingControls", {
        get: function () {
            return this._sequencingControls;
        },
        set: function (sequencingControls) {
            if (!(sequencingControls instanceof SequencingControls)) {
                throw new Scorm2004ValidationError(this._cmi_element + ".sequencingControls", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            this._sequencingControls = sequencingControls;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sequencing.prototype, "rollupRules", {
        get: function () {
            return this._rollupRules;
        },
        set: function (rollupRules) {
            if (!(rollupRules instanceof RollupRules)) {
                throw new Scorm2004ValidationError(this._cmi_element + ".rollupRules", error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH);
            }
            this._rollupRules = rollupRules;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Sequencing.prototype, "adlNav", {
        get: function () {
            return this._adlNav;
        },
        set: function (adlNav) {
            this._adlNav = adlNav;
        },
        enumerable: false,
        configurable: true
    });
    Sequencing.prototype.processNavigationRequest = function (request) {
        if (!this._adlNav) {
            return false;
        }
        this._adlNav.request = request;
        var currentActivity = this._activityTree.currentActivity;
        if (!currentActivity) {
            return false;
        }
        var preConditionAction = this._sequencingRules.evaluatePreConditionRules(currentActivity);
        if (preConditionAction) {
            switch (preConditionAction) {
                case RuleActionType.SKIP:
                    return false;
                case RuleActionType.DISABLED:
                    return false;
                case RuleActionType.HIDE_FROM_CHOICE:
                    return false;
                case RuleActionType.STOP_FORWARD_TRAVERSAL:
                    return false;
                default:
                    break;
            }
        }
        switch (request) {
            case "continue":
                return this.processContinueRequest(currentActivity);
            case "previous":
                return this.processPreviousRequest(currentActivity);
            case "choice":
                return false;
            case "exit":
                return this.processExitRequest(currentActivity);
            case "exitAll":
                return this.processExitAllRequest();
            case "abandon":
                return this.processAbandonRequest(currentActivity);
            case "abandonAll":
                return this.processAbandonAllRequest();
            case "suspendAll":
                return this.processSuspendAllRequest(currentActivity);
            case "resumeAll":
                return this.processResumeAllRequest();
            default:
                return false;
        }
    };
    Sequencing.prototype.processContinueRequest = function (currentActivity) {
        if (!this._sequencingControls.isForwardNavigationAllowed()) {
            return false;
        }
        var nextActivity = this._activityTree.getNextSibling(currentActivity);
        if (!nextActivity) {
            return false;
        }
        var exitConditionAction = this._sequencingRules.evaluateExitConditionRules(currentActivity);
        if (exitConditionAction) {
            switch (exitConditionAction) {
                case RuleActionType.EXIT_PARENT: {
                    var parent_1 = currentActivity.parent;
                    if (parent_1) {
                        this._activityTree.currentActivity = parent_1;
                        return true;
                    }
                    return false;
                }
                case RuleActionType.EXIT_ALL:
                    this._activityTree.currentActivity = null;
                    return true;
                default:
                    break;
            }
        }
        this._activityTree.currentActivity = nextActivity;
        var postConditionAction = this._sequencingRules.evaluatePostConditionRules(nextActivity);
        if (postConditionAction) {
            switch (postConditionAction) {
                case RuleActionType.RETRY:
                    nextActivity.incrementAttemptCount();
                    return true;
                case RuleActionType.RETRY_ALL:
                    this._activityTree.getAllActivities().forEach(function (activity) {
                        activity.incrementAttemptCount();
                    });
                    return true;
                case RuleActionType.CONTINUE:
                    return this.processContinueRequest(nextActivity);
                case RuleActionType.PREVIOUS:
                    return this.processPreviousRequest(nextActivity);
                case RuleActionType.EXIT:
                    this._activityTree.currentActivity = currentActivity;
                    return true;
                default:
                    break;
            }
        }
        return true;
    };
    Sequencing.prototype.processPreviousRequest = function (currentActivity) {
        if (!this._sequencingControls.isBackwardNavigationAllowed()) {
            return false;
        }
        var previousActivity = this._activityTree.getPreviousSibling(currentActivity);
        if (!previousActivity) {
            return false;
        }
        var exitConditionAction = this._sequencingRules.evaluateExitConditionRules(currentActivity);
        if (exitConditionAction) {
            switch (exitConditionAction) {
                case RuleActionType.EXIT_PARENT: {
                    var parent_2 = currentActivity.parent;
                    if (parent_2) {
                        this._activityTree.currentActivity = parent_2;
                        return true;
                    }
                    return false;
                }
                case RuleActionType.EXIT_ALL:
                    this._activityTree.currentActivity = null;
                    return true;
                default:
                    break;
            }
        }
        this._activityTree.currentActivity = previousActivity;
        var postConditionAction = this._sequencingRules.evaluatePostConditionRules(previousActivity);
        if (postConditionAction) {
            switch (postConditionAction) {
                case RuleActionType.RETRY:
                    previousActivity.incrementAttemptCount();
                    return true;
                case RuleActionType.RETRY_ALL:
                    this._activityTree.getAllActivities().forEach(function (activity) {
                        activity.incrementAttemptCount();
                    });
                    return true;
                case RuleActionType.CONTINUE:
                    return this.processContinueRequest(previousActivity);
                case RuleActionType.PREVIOUS:
                    return this.processPreviousRequest(previousActivity);
                case RuleActionType.EXIT:
                    this._activityTree.currentActivity = currentActivity;
                    return true;
                default:
                    break;
            }
        }
        return true;
    };
    Sequencing.prototype.processExitRequest = function (currentActivity) {
        if (!this._sequencingControls.choiceExit) {
            return false;
        }
        var parent = currentActivity.parent;
        if (!parent) {
            return false;
        }
        this._activityTree.currentActivity = parent;
        return true;
    };
    Sequencing.prototype.processExitAllRequest = function () {
        if (!this._sequencingControls.choiceExit) {
            return false;
        }
        this._activityTree.currentActivity = null;
        return true;
    };
    Sequencing.prototype.processAbandonRequest = function (currentActivity) {
        var parent = currentActivity.parent;
        if (!parent) {
            return false;
        }
        this._activityTree.currentActivity = parent;
        return true;
    };
    Sequencing.prototype.processAbandonAllRequest = function () {
        this._activityTree.currentActivity = null;
        return true;
    };
    Sequencing.prototype.processSuspendAllRequest = function (currentActivity) {
        this._activityTree.suspendedActivity = currentActivity;
        this._activityTree.currentActivity = null;
        return true;
    };
    Sequencing.prototype.processResumeAllRequest = function () {
        var suspendedActivity = this._activityTree.suspendedActivity;
        if (!suspendedActivity) {
            return false;
        }
        this._activityTree.currentActivity = suspendedActivity;
        this._activityTree.suspendedActivity = null;
        return true;
    };
    Sequencing.prototype.processRollup = function () {
        var root = this._activityTree.root;
        if (!root) {
            return;
        }
        this._processRollupRecursive(root);
    };
    Sequencing.prototype._processRollupRecursive = function (activity) {
        for (var _i = 0, _a = activity.children; _i < _a.length; _i++) {
            var child = _a[_i];
            this._processRollupRecursive(child);
        }
        this._rollupRules.processRollup(activity);
    };
    Sequencing.prototype.toJSON = function () {
        this.jsonString = true;
        var result = {
            activityTree: this._activityTree,
            sequencingRules: this._sequencingRules,
            sequencingControls: this._sequencingControls,
            rollupRules: this._rollupRules,
        };
        delete this.jsonString;
        return result;
    };
    return Sequencing;
}(base_cmi/* BaseCMI */.J));


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
        _this._extractedScoItemIds = [];
        _this.cmi = new CMI();
        _this.adl = new ADL();
        _this._sequencing = new Sequencing();
        _this.adl.sequencing = _this._sequencing;
        if (settings === null || settings === void 0 ? void 0 : settings.sequencing) {
            _this.configureSequencing(settings.sequencing);
        }
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
        var _a, _b, _c;
        this.commonReset(settings);
        (_a = this.cmi) === null || _a === void 0 ? void 0 : _a.reset();
        (_b = this.adl) === null || _b === void 0 ? void 0 : _b.reset();
        (_c = this._sequencing) === null || _c === void 0 ? void 0 : _c.reset();
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
                                this.processListeners("SequenceNext", null, "next");
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
                if (this._extractedScoItemIds.length > 0) {
                    return String(this._extractedScoItemIds.includes(target));
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
                var objective = this.cmi.objectives.findObjectiveByIndex(index);
                objective_id_1 = objective ? objective.id : undefined;
            }
            var is_global = objective_id_1 && this.settings.globalObjectiveIds.includes(objective_id_1);
            if (is_global) {
                var global_index = this._globalObjectives.findIndex(function (obj) { return obj.id === objective_id_1; });
                if (global_index === -1) {
                    global_index = this._globalObjectives.length;
                    var newGlobalObjective = new CMIObjectivesObject();
                    newGlobalObjective.id = objective_id_1;
                    this._globalObjectives.push(newGlobalObjective);
                }
                var global_element = CMIElement.replace(element_base, "_globalObjectives.".concat(global_index));
                this._commonSetCMIValue("SetGlobalObjectiveValue", true, global_element, value);
            }
        }
        return this._commonSetCMIValue("SetValue", true, CMIElement, value);
    };
    Scorm2004Impl.prototype.getChildElement = function (CMIElement, value, foundFirstIndex) {
        if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.objectives\\.\\d+")) {
            return new CMIObjectivesObject();
        }
        if (foundFirstIndex) {
            if ((0,utilities/* stringMatches */.J6)(CMIElement, "cmi\\.interactions\\.\\d+\\.correct_responses\\.\\d+")) {
                return this.createCorrectResponsesObject(CMIElement, value);
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
    };
    Scorm2004Impl.prototype.createCorrectResponsesObject = function (CMIElement, value) {
        var parts = CMIElement.split(".");
        var index = Number(parts[2]);
        var interaction = this.cmi.interactions.childArray[index];
        if (this.isInitialized()) {
            if (typeof interaction === "undefined" || !interaction.type) {
                this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.DEPENDENCY_NOT_ESTABLISHED, CMIElement);
                return null;
            }
            else {
                this.checkDuplicateChoiceResponse(CMIElement, interaction, value);
                var response_type = CorrectResponses[interaction.type];
                if (response_type) {
                    this.checkValidResponseType(CMIElement, response_type, value, interaction.type);
                }
                else {
                    this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE, "Incorrect Response Type: ".concat(interaction.type));
                    return null;
                }
            }
        }
        if (this.lastErrorCode === "0") {
            return new CMIInteractionsCorrectResponsesObject(interaction);
        }
        return null;
    };
    Scorm2004Impl.prototype.checkValidResponseType = function (CMIElement, response_type, value, interaction_type) {
        var nodes = [];
        if (response_type === null || response_type === void 0 ? void 0 : response_type.delimiter) {
            nodes = String(value).split(response_type.delimiter);
        }
        else {
            nodes[0] = value;
        }
        if (nodes.length > 0 && nodes.length <= response_type.max) {
            this.checkCorrectResponseValue(CMIElement, interaction_type, nodes, value);
        }
        else if (nodes.length > response_type.max) {
            this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE, "Data Model Element Pattern Too Long: ".concat(value));
        }
    };
    Scorm2004Impl.prototype.checkDuplicateChoiceResponse = function (CMIElement, interaction, value) {
        var interaction_count = interaction.correct_responses._count;
        if (interaction.type === "choice") {
            for (var i = 0; i < interaction_count && this.lastErrorCode === "0"; i++) {
                var response = interaction.correct_responses.childArray[i];
                if (response.pattern === value) {
                    this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE, "".concat(value));
                }
            }
        }
    };
    Scorm2004Impl.prototype.validateCorrectResponse = function (CMIElement, value) {
        var parts = CMIElement.split(".");
        var index = Number(parts[2]);
        var pattern_index = Number(parts[4]);
        var interaction = this.cmi.interactions.childArray[index];
        var interaction_count = interaction.correct_responses._count;
        this.checkDuplicateChoiceResponse(CMIElement, interaction, value);
        var response_type = CorrectResponses[interaction.type];
        if (typeof response_type.limit === "undefined" || interaction_count <= response_type.limit) {
            this.checkValidResponseType(CMIElement, response_type, value, interaction.type);
            if ((this.lastErrorCode === "0" &&
                (!response_type.duplicate ||
                    !this.checkDuplicatedPattern(interaction.correct_responses, pattern_index, value))) ||
                (this.lastErrorCode === "0" && value === "")) {
            }
            else {
                if (this.lastErrorCode === "0") {
                    this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE, "Data Model Element Pattern Already Exists: ".concat(CMIElement, " - ").concat(value));
                }
            }
        }
        else {
            this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.GENERAL_SET_FAILURE, "Data Model Element Collection Limit Reached: ".concat(CMIElement, " - ").concat(value));
        }
    };
    Scorm2004Impl.prototype.getCMIValue = function (CMIElement) {
        return this._commonGetCMIValue("GetValue", true, CMIElement);
    };
    Scorm2004Impl.prototype.getLmsErrorMessageDetails = function (errorNumber, detail) {
        var basicMessage = "";
        var detailMessage = "";
        errorNumber = String(errorNumber);
        if (api_constants/* scorm2004_constants */.zR.error_descriptions[errorNumber]) {
            basicMessage = api_constants/* scorm2004_constants */.zR.error_descriptions[errorNumber].basicMessage;
            detailMessage = api_constants/* scorm2004_constants */.zR.error_descriptions[errorNumber].detailMessage;
        }
        return detail ? detailMessage : basicMessage;
    };
    Scorm2004Impl.prototype.checkDuplicatedPattern = function (correct_response, current_index, value) {
        var found = false;
        var count = correct_response._count;
        for (var i = 0; i < count && !found; i++) {
            if (i !== current_index && correct_response.childArray[i] === value) {
                found = true;
            }
        }
        return found;
    };
    Scorm2004Impl.prototype.checkCorrectResponseValue = function (CMIElement, interaction_type, nodes, value) {
        var response = CorrectResponses[interaction_type];
        if (!response) {
            this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "Incorrect Response Type: ".concat(interaction_type));
            return;
        }
        var formatRegex = new RegExp(response.format);
        for (var i = 0; i < nodes.length && this.lastErrorCode === "0"; i++) {
            if (interaction_type.match("^(fill-in|long-fill-in|matching|performance|sequencing)$")) {
                nodes[i] = this.removeCorrectResponsePrefixes(CMIElement, nodes[i]);
            }
            if (response === null || response === void 0 ? void 0 : response.delimiter2) {
                var values = nodes[i].split(response.delimiter2);
                if (values.length === 2) {
                    var matches = values[0].match(formatRegex);
                    if (!matches) {
                        this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "".concat(interaction_type, ": ").concat(value));
                    }
                    else {
                        if (!response.format2 || !values[1].match(new RegExp(response.format2))) {
                            this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "".concat(interaction_type, ": ").concat(value));
                        }
                    }
                }
                else {
                    this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "".concat(interaction_type, ": ").concat(value));
                }
            }
            else {
                var matches = nodes[i].match(formatRegex);
                if ((!matches && value !== "") || (!matches && interaction_type === "true-false")) {
                    this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "".concat(interaction_type, ": ").concat(value));
                }
                else {
                    if (interaction_type === "numeric" && nodes.length > 1) {
                        if (Number(nodes[0]) > Number(nodes[1])) {
                            this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "".concat(interaction_type, ": ").concat(value));
                        }
                    }
                    else {
                        if (nodes[i] !== "" && response.unique) {
                            for (var j = 0; j < i && this.lastErrorCode === "0"; j++) {
                                if (nodes[i] === nodes[j]) {
                                    this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "".concat(interaction_type, ": ").concat(value));
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    Scorm2004Impl.prototype.removeCorrectResponsePrefixes = function (CMIElement, node) {
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
                                this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "".concat(node));
                            }
                        }
                    }
                    seenLang = true;
                    break;
                case "case_matters":
                    if (!seenLang && !seenOrder && !seenCase) {
                        if (matches[3] !== "true" && matches[3] !== "false") {
                            this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "".concat(node));
                        }
                    }
                    seenCase = true;
                    break;
                case "order_matters":
                    if (!seenCase && !seenLang && !seenOrder) {
                        if (matches[3] !== "true" && matches[3] !== "false") {
                            this.throwSCORMError(CMIElement, error_codes/* scorm2004_errors */.Rf.TYPE_MISMATCH, "".concat(node));
                        }
                    }
                    seenOrder = true;
                    break;
            }
            node = node.substring(matches[1].length);
            matches = node.match(prefixRegex);
        }
        return node;
    };
    Scorm2004Impl.prototype.replaceWithAnotherScormAPI = function (newAPI) {
        this.cmi = newAPI.cmi;
        this.adl = newAPI.adl;
    };
    Scorm2004Impl.prototype.renderCommitCMI = function (terminateCommit) {
        var cmiExport = this.renderCMIToJSONObject();
        if (terminateCommit) {
            cmiExport.cmi.total_time = this.cmi.getCurrentTotalTime();
        }
        var result = [];
        var flattened = utilities/* flatten */.Bq(cmiExport);
        switch (this.settings.dataCommitFormat) {
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
    };
    Scorm2004Impl.prototype.renderCommitObject = function (terminateCommit) {
        var cmiExport = this.renderCommitCMI(terminateCommit);
        var totalTimeDuration = this.cmi.getCurrentTotalTime();
        var totalTimeSeconds = utilities/* getDurationAsSeconds */.OI(totalTimeDuration, regex/* scorm2004_regex */.xt.CMITimespan);
        var completionStatus = enums/* CompletionStatus */.lC.UNKNOWN;
        var successStatus = enums/* SuccessStatus */.YE.UNKNOWN;
        if (this.cmi.completion_status) {
            if (this.cmi.completion_status === "completed") {
                completionStatus = enums/* CompletionStatus */.lC.COMPLETED;
            }
            else if (this.cmi.completion_status === "incomplete") {
                completionStatus = enums/* CompletionStatus */.lC.INCOMPLETE;
            }
        }
        if (this.cmi.success_status) {
            if (this.cmi.success_status === "passed") {
                successStatus = enums/* SuccessStatus */.YE.PASSED;
            }
            else if (this.cmi.success_status === "failed") {
                successStatus = enums/* SuccessStatus */.YE.FAILED;
            }
        }
        var score = this.cmi.score;
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
    };
    Scorm2004Impl.prototype.storeData = function (terminateCommit) {
        return (0,tslib_es6/* __awaiter */.sH)(this, void 0, void 0, function () {
            var navRequest, commitObject, result;
            var _a, _b, _c;
            return (0,tslib_es6/* __generator */.YH)(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        if (terminateCommit) {
                            if (this.cmi.mode === "normal") {
                                if (this.cmi.credit === "credit") {
                                    if (this.cmi.completion_threshold && this.cmi.progress_measure) {
                                        if (this.cmi.progress_measure >= this.cmi.completion_threshold) {
                                            this.cmi.completion_status = "completed";
                                        }
                                        else {
                                            this.cmi.completion_status = "incomplete";
                                        }
                                    }
                                    if (this.cmi.scaled_passing_score && this.cmi.score.scaled) {
                                        if (this.cmi.score.scaled >= this.cmi.scaled_passing_score) {
                                            this.cmi.success_status = "passed";
                                        }
                                        else {
                                            this.cmi.success_status = "failed";
                                        }
                                    }
                                }
                            }
                        }
                        navRequest = false;
                        if (this.adl.nav.request !==
                            ((_c = (_b = (_a = this.startingData) === null || _a === void 0 ? void 0 : _a.adl) === null || _b === void 0 ? void 0 : _b.nav) === null || _c === void 0 ? void 0 : _c.request) &&
                            this.adl.nav.request !== "_none_") {
                            navRequest = true;
                        }
                        commitObject = this.getCommitObject(terminateCommit);
                        if (!(typeof this.settings.lmsCommitUrl === "string")) return [3, 2];
                        return [4, this.processHttpRequest(this.settings.lmsCommitUrl, {
                                commitObject: commitObject,
                            }, terminateCommit)];
                    case 1:
                        result = _d.sent();
                        if (navRequest &&
                            result.navRequest !== undefined &&
                            result.navRequest !== "" &&
                            typeof result.navRequest === "string") {
                            Function("\"use strict\";(() => { ".concat(result.navRequest, " })()"))();
                        }
                        else if ((result === null || result === void 0 ? void 0 : result.navRequest) && !navRequest) {
                            if (typeof result.navRequest === "object" &&
                                Object.hasOwnProperty.call(result.navRequest, "name")) {
                                this.processListeners(result.navRequest.name, result.navRequest.data);
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
    };
    Scorm2004Impl.prototype.configureSequencing = function (sequencingSettings) {
        if (sequencingSettings.activityTree) {
            this.configureActivityTree(sequencingSettings.activityTree);
        }
        if (sequencingSettings.sequencingRules) {
            this.configureSequencingRules(sequencingSettings.sequencingRules);
        }
        if (sequencingSettings.sequencingControls) {
            this.configureSequencingControls(sequencingSettings.sequencingControls);
        }
        if (sequencingSettings.rollupRules) {
            this.configureRollupRules(sequencingSettings.rollupRules);
        }
    };
    Scorm2004Impl.prototype.configureActivityTree = function (activityTreeSettings) {
        var rootActivity = this.createActivity(activityTreeSettings);
        var activityTree = this._sequencing.activityTree;
        activityTree.root = rootActivity;
        this._extractedScoItemIds = this.extractActivityIds(rootActivity);
    };
    Scorm2004Impl.prototype.extractActivityIds = function (activity) {
        var ids = [activity.id];
        for (var _i = 0, _a = activity.children; _i < _a.length; _i++) {
            var child = _a[_i];
            ids.push.apply(ids, this.extractActivityIds(child));
        }
        return ids;
    };
    Scorm2004Impl.prototype.createActivity = function (activitySettings) {
        var activity = new Activity(activitySettings.id, activitySettings.title);
        if (activitySettings.isVisible !== undefined) {
            activity.isVisible = activitySettings.isVisible;
        }
        if (activitySettings.isActive !== undefined) {
            activity.isActive = activitySettings.isActive;
        }
        if (activitySettings.isSuspended !== undefined) {
            activity.isSuspended = activitySettings.isSuspended;
        }
        if (activitySettings.isCompleted !== undefined) {
            activity.isCompleted = activitySettings.isCompleted;
        }
        if (activitySettings.children) {
            for (var _i = 0, _a = activitySettings.children; _i < _a.length; _i++) {
                var childSettings = _a[_i];
                var childActivity = this.createActivity(childSettings);
                activity.addChild(childActivity);
            }
        }
        return activity;
    };
    Scorm2004Impl.prototype.configureSequencingRules = function (sequencingRulesSettings) {
        var sequencingRules = this._sequencing.sequencingRules;
        if (sequencingRulesSettings.preConditionRules) {
            for (var _i = 0, _a = sequencingRulesSettings.preConditionRules; _i < _a.length; _i++) {
                var ruleSettings = _a[_i];
                var rule = this.createSequencingRule(ruleSettings);
                sequencingRules.addPreConditionRule(rule);
            }
        }
        if (sequencingRulesSettings.exitConditionRules) {
            for (var _b = 0, _c = sequencingRulesSettings.exitConditionRules; _b < _c.length; _b++) {
                var ruleSettings = _c[_b];
                var rule = this.createSequencingRule(ruleSettings);
                sequencingRules.addExitConditionRule(rule);
            }
        }
        if (sequencingRulesSettings.postConditionRules) {
            for (var _d = 0, _e = sequencingRulesSettings.postConditionRules; _d < _e.length; _d++) {
                var ruleSettings = _e[_d];
                var rule = this.createSequencingRule(ruleSettings);
                sequencingRules.addPostConditionRule(rule);
            }
        }
    };
    Scorm2004Impl.prototype.createSequencingRule = function (ruleSettings) {
        var rule = new SequencingRule(ruleSettings.action, ruleSettings.conditionCombination);
        for (var _i = 0, _a = ruleSettings.conditions; _i < _a.length; _i++) {
            var conditionSettings = _a[_i];
            var condition = new RuleCondition(conditionSettings.condition, conditionSettings.operator, new Map(Object.entries(conditionSettings.parameters || {})));
            rule.addCondition(condition);
        }
        return rule;
    };
    Scorm2004Impl.prototype.configureSequencingControls = function (sequencingControlsSettings) {
        var sequencingControls = this._sequencing.sequencingControls;
        if (sequencingControlsSettings.enabled !== undefined) {
            sequencingControls.enabled = sequencingControlsSettings.enabled;
        }
        if (sequencingControlsSettings.choiceExit !== undefined) {
            sequencingControls.choiceExit = sequencingControlsSettings.choiceExit;
        }
        if (sequencingControlsSettings.flow !== undefined) {
            sequencingControls.flow = sequencingControlsSettings.flow;
        }
        if (sequencingControlsSettings.forwardOnly !== undefined) {
            sequencingControls.forwardOnly = sequencingControlsSettings.forwardOnly;
        }
        if (sequencingControlsSettings.useCurrentAttemptObjectiveInfo !== undefined) {
            sequencingControls.useCurrentAttemptObjectiveInfo =
                sequencingControlsSettings.useCurrentAttemptObjectiveInfo;
        }
        if (sequencingControlsSettings.useCurrentAttemptProgressInfo !== undefined) {
            sequencingControls.useCurrentAttemptProgressInfo =
                sequencingControlsSettings.useCurrentAttemptProgressInfo;
        }
        if (sequencingControlsSettings.preventActivation !== undefined) {
            sequencingControls.preventActivation = sequencingControlsSettings.preventActivation;
        }
        if (sequencingControlsSettings.constrainChoice !== undefined) {
            sequencingControls.constrainChoice = sequencingControlsSettings.constrainChoice;
        }
        if (sequencingControlsSettings.rollupObjectiveSatisfied !== undefined) {
            sequencingControls.rollupObjectiveSatisfied =
                sequencingControlsSettings.rollupObjectiveSatisfied;
        }
        if (sequencingControlsSettings.rollupProgressCompletion !== undefined) {
            sequencingControls.rollupProgressCompletion =
                sequencingControlsSettings.rollupProgressCompletion;
        }
        if (sequencingControlsSettings.objectiveMeasureWeight !== undefined) {
            sequencingControls.objectiveMeasureWeight = sequencingControlsSettings.objectiveMeasureWeight;
        }
    };
    Scorm2004Impl.prototype.configureRollupRules = function (rollupRulesSettings) {
        var rollupRules = this._sequencing.rollupRules;
        if (rollupRulesSettings.rules) {
            for (var _i = 0, _a = rollupRulesSettings.rules; _i < _a.length; _i++) {
                var ruleSettings = _a[_i];
                var rule = this.createRollupRule(ruleSettings);
                rollupRules.addRule(rule);
            }
        }
    };
    Scorm2004Impl.prototype.createRollupRule = function (ruleSettings) {
        var rule = new RollupRule(ruleSettings.action, ruleSettings.consideration, ruleSettings.minimumCount, ruleSettings.minimumPercent);
        for (var _i = 0, _a = ruleSettings.conditions; _i < _a.length; _i++) {
            var conditionSettings = _a[_i];
            var condition = new RollupCondition(conditionSettings.condition, new Map(Object.entries(conditionSettings.parameters || {})));
            rule.addCondition(condition);
        }
        return rule;
    };
    return Scorm2004Impl;
}(BaseAPI/* default */.A));


var __webpack_exports__Scorm2004API = __webpack_exports__.V
export { __webpack_exports__Scorm2004API as Scorm2004API };
