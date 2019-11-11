import {BaseCMI, CMIArray, CMIScore} from './common';
import {learner_responses, scorm2004_constants, scorm2004_error_codes} from "../constants/api_constants";
import {scorm2004_regex} from "../regex";

const constants = scorm2004_constants;
const regex = scorm2004_regex;

function throwReadOnlyError(API) {
    API.throwSCORMError(scorm2004_error_codes.READ_ONLY_ELEMENT);
}

function throwWriteOnlyError(API) {
    API.throwSCORMError(scorm2004_error_codes.WRITE_ONLY_ELEMENT);
}

export class CMI extends BaseCMI {
    constructor(API) {
        super(API);

        this.learner_preference = new CMILearnerPreference(API);
    }

    #_version: "1.0";
    #_children = constants.cmi_children;
    #completion_status: "unknown";
    #completion_threshold: "";
    #credit: "credit";
    #entry: "";
    #exit: "";
    #launch_data: "";
    #learner_id: "";
    #learner_name: "";
    #location: "";
    #max_time_allowed: "";
    #mode: "normal";
    #progress_measure: "";
    #scaled_passing_score: "";
    #session_time: "PT0H0M0S";
    #success_status: "unknown";
    #suspend_data: "";
    #time_limit_action: "continue,no message";
    #total_time: "0";

    get _version() { return this.#_version; }
    set _version(_version) { throwReadOnlyError(); }

    get _children() { return this.#_children; }
    set _children(_children) { throwReadOnlyError(); }

    get completion_status() { return this.#completion_status; }
    set completion_status(completion_status) {
        if(this.API.checkValidFormat(completion_status, regex.CMICStatus)) {
            this.#completion_status = completion_status;
        }
    }

    get completion_threshold() { return this.#completion_threshold; }
    set completion_threshold(completion_threshold) { this.API.isNotInitialized() ? this.#completion_threshold = completion_threshold : throwReadOnlyError(); }

    get credit() { return this.#credit; }
    set credit(credit) { this.API.isNotInitialized() ? this.#credit = credit : throwReadOnlyError(); }

    get entry() { return this.#entry; }
    set entry(entry) { this.API.isNotInitialized() ? this.#entry = entry : throwReadOnlyError(); }

    get exit() { return (!this.jsonString) ? throwWriteOnlyError() : this.#exit; }
    set exit(exit) {
        if(this.API.checkValidFormat(exit, regex.CMIExit)) {
            this.#exit = exit;
        }
    }

    get launch_data() { return this.#launch_data; }
    set launch_data(launch_data) { this.API.isNotInitialized() ? this.#launch_data = launch_data : throwReadOnlyError(); }

    get learner_id() { return this.#learner_id; }
    set learner_id(learner_id) { this.API.isNotInitialized() ? this.#learner_id = learner_id : throwReadOnlyError(); }

    get learner_name() { return this.#learner_name; }
    set learner_name(learner_name) { this.API.isNotInitialized() ? this.#learner_name = learner_name : throwReadOnlyError(); }

    get location() { return this.#location; }
    set location(location) {
        if(this.API.checkValidFormat(location, regex.CMIString1000)) {
            this.#location = location;
        }
    }

    get max_time_allowed() { return this.#max_time_allowed; }
    set max_time_allowed(max_time_allowed) { this.API.isNotInitialized() ? this.#max_time_allowed = max_time_allowed : throwReadOnlyError(); }

    get mode() { return this.#mode; }
    set mode(mode) { this.API.isNotInitialized() ? this.#mode = mode : throwReadOnlyError(); }

    get progress_measure() { return this.#progress_measure; }
    set progress_measure(progress_measure) {
        if(this.API.checkValidFormat(progress_measure, regex.CMIDecimal)
            && this.API.checkValidRange(progress_measure, regex.progress_range)) {
            this.#progress_measure = progress_measure;
        }
    }

    get scaled_passing_score() { return this.#scaled_passing_score; }
    set scaled_passing_score(scaled_passing_score) { this.API.isNotInitialized() ? this.#scaled_passing_score = scaled_passing_score : throwReadOnlyError(); }

    get session_time() { return (!this.jsonString) ? this.API.throwSCORMError(405) : this.#session_time; }
    set session_time(session_time) {
        if(this.API.checkValidFormat(session_time, regex.CMITimespan)) {
            this.#session_time = session_time;
        }
    }
    
    get success_status() { return this.#success_status; }
    set success_status(success_status) {
        if(this.API.checkValidFormat(success_status, regex.CMISStatus)) {
            this.#success_status = success_status;
        }
    }

    get suspend_data() { return this.#suspend_data; }
    set suspend_data(suspend_data) {
        if(this.API.checkValidFormat(suspend_data, regex.CMIString64000)) {
            this.#suspend_data = suspend_data;
        }
    }

    get time_limit_action() { return this.#time_limit_action; }
    set time_limit_action(time_limit_action) { this.API.isNotInitialized() ? this.#time_limit_action = time_limit_action : throwReadOnlyError(); }

    get total_time() { return this.#total_time; }
    set total_time(total_time) { this.API.isNotInitialized() ? this.#total_time = total_time : throwReadOnlyError(); }

    comments_from_learner = new class extends CMIArray {
        constructor(API) {
            super({
                API: API,
                children: constants.comments_children,
                errorCode: 404
            });
        }
    };

    comments_from_lms = new class extends CMIArray {
        constructor(API) {
            super({
                API: API,
                children: constants.comments_children,
                errorCode: 404
            });
        }
    };

    interactions = new class extends CMIArray {
        constructor(API) {
            super({
                API: API,
                children: constants.interactions_children,
                errorCode: 404
            });
        }
    };

    objectives = new class extends CMIArray {
        constructor(API) {
            super({
                API: API,
                children: constants.objectives_children,
                errorCode: 404
            });
        }
    };
}

class CMILearnerPreference extends BaseCMI {
    constructor(API) {
        super(API);
    }

    #_children: constants.student_preference_children;
    #audio_level: "1";
    #language: "";
    #delivery_speed: "1";
    #audio_captioning: "0";

    get _children() { return this.#_children; }
    set _children(_children) { throwReadOnlyError(); }

    get audio_level() { return this.#audio_level; }
    set audio_level(audio_level) {
        if(this.API.checkValidFormat(audio_level, regex.CMIDecimal)
            && this.API.checkValidRange(audio_level, regex.audio_range)) {
            this.#audio_level = audio_level;
        }
    }

    get language() { return this.#language; }
    set language(language) {
        if(this.API.checkValidFormat(language, regex.CMILang)) {
            this.#language = language;
        }
    }

    get delivery_speed() { return this.#delivery_speed; }
    set delivery_speed(delivery_speed) {
        if(this.API.checkValidFormat(delivery_speed, regex.CMIDecimal)
            && this.API.checkValidRange(delivery_speed, regex.speed_range)) {
            this.#delivery_speed = delivery_speed;
        }
    }

    get audio_captioning() { return this.#audio_captioning; }
    set audio_captioning(audio_captioning) {
        if(this.API.checkValidFormat(audio_captioning, regex.CMISInteger)
            && this.API.checkValidRange(audio_captioning, regex.text_range)) {
            this.#audio_captioning = audio_captioning;
        }
    }
}

export class CMIInteractionsObject extends BaseCMI {
    constructor(API) {
        super(API);

        this.objectives = new CMIArray({
            API: API,
            errorCode: 404,
            children: constants.objectives_children
        });
        this.correct_responses = new CMIArray({
            API: API,
            errorCode: 404,
            children: constants.correct_responses_children
        });
    }

    #id: "";
    #type: "";
    #timestamp: "";
    #weighting: "";
    #learner_response: "";
    #result: "";
    #latency: "";
    #description: "";

    get id() { return this.#id; }
    set id(id) {
        if(this.API.checkValidFormat(id, regex.CMILongIdentifier)) {
            this.#id = id;
        }
    }

    get type() { return this.#type; }
    set type(type) {
        if(this.API.checkValidFormat(type, regex.CMIType)) {
            this.#type = type;
        }
    }

    get timestamp() { return this.#timestamp; }
    set timestamp(timestamp) {
        if(this.API.checkValidFormat(timestamp, regex.CMITime)) {
            this.#timestamp = timestamp;
        }
    }

    get weighting() { return this.#weighting; }
    set weighting(weighting) {
        if (this.API.checkValidFormat(weighting, regex.CMIDecimal)) {
            this.#weighting = weighting;
        }
    }

    get learner_response() { return this.#learner_response; }
    set learner_response(learner_response) {
        if(typeof this.type === 'undefined') {
            this.API.throwSCORMError(this.API.error.DEPENDENCY_NOT_ESTABLISHED);
        } else {
            let nodes = [];
            let response_type = learner_responses[this.type];
            if(response_type.delimiter !== '') {
                nodes = learner_response.split(response_type.delimiter);
            } else {
                nodes[0] = learner_response;
            }

            if((nodes.length > 0) && (nodes.length <= response_type.max)) {
                const formatRegex = new RegExp(response_type.format);
                for(let i = 0; (i < nodes.length) && (this.API.lastErrorCode === 0); i++) {
                    if(typeof response_type.delimiter2 !== 'undefined') {
                        let values = nodes[i].split(response_type.delimiter2);
                        if(values.length === 2) {
                            if(!values[0].match(formatRegex)) {
                                this.API.throwSCORMError(this.API.error.TYPE_MISMATCH);
                            } else {
                                if(!values[1].match(new RegExp(response_type.format2))) {
                                    this.API.throwSCORMError(this.API.error.TYPE_MISMATCH);
                                }
                            }
                        } else {
                            this.API.throwSCORMError(this.API.error.TYPE_MISMATCH);
                        }
                    } else {
                        if(!nodes[i].match(formatRegex)) {
                            this.API.throwSCORMError(this.API.error.TYPE_MISMATCH);
                        } else {
                            if(nodes[i] !== '' && response_type.unique) {
                                for(let j = 0; (j < i) && this.API.lastErrorCode === 0; j++) {
                                    if(nodes[i] === nodes[j]) {
                                        this.API.throwSCORMError(this.API.error.TYPE_MISMATCH);
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                this.API.throwSCORMError(this.API.error.GENERAL_SET_FAILURE);
            }
        }
    }

    get result() { return this.#result; }
    set result(result) {
        if(this.API.checkValidFormat(result, regex.CMIResult)) {
            this.#result = result;
        }
    }

    get latency() { return this.#latency; }
    set latency(latency) {
        if(this.API.checkValidFormat(latency, regex.CMITimespan)) {
            this.#latency = latency;
        }
    }

    get description() { return this.#description; }
    set description(description) {
        if(this.API.checkValidFormat(description, regex.CMILangString250)) {
            this.#description = description;
        }
    }
}

export class CMIObjectivesObject extends BaseCMI {
    constructor(API) {
        super(API);
    }

    #id: "";
    #success_status: "unknown"; // Allowed values: "passed", "failed", "unknown"
    #completion_status: "unknown"; // Allowed values: "completed", "incomplete", "not attempted", "unknown"
    #progress_measure: ""; // Data type: real (10,7). Range: 0.0 to 1.0
    #description: ""; // SPM 250 characters

    get id() { return this.#id; }
    set id(id) {
        if(this.API.checkValidFormat(id, regex.CMILongIdentifier)) {
            this.#id = id;
        }
    }

    get success_status() { return this.#success_status; }
    set success_status(success_status) {
        if(this.API.checkValidFormat(success_status, regex.CMISStatus)) {
            this.#success_status = success_status;
        }
    }

    get completion_status() { return this.#completion_status; }
    set completion_status(completion_status) {
        if(this.API.checkValidFormat(completion_status, regex.CMICStatus)) {
            this.#completion_status = completion_status;
        }
    }

    get progress_measure() { return this.#progress_measure; }
    set progress_measure(progress_measure) {
        if(this.API.checkValidFormat(progress_measure, regex.CMIDecimal)
            && this.API.checkValidRange(progress_measure, regex.progress_range)) {
            this.#progress_measure = progress_measure;
        }
    }

    get description() { return this.#description; }
    set description(description) {
        if(this.API.checkValidFormat(description, regex.CMILangString250)) {
            this.#description = description;
        }
    }

    score = new Scorm2004CMIScore(this.API);
}

class Scorm2004CMIScore extends CMIScore {
    constructor(API) {
        super(API, constants.score_children);
        this.max = "";
    }

    #scaled: "";

    get scaled() { return this.#scaled; }
    set scaled(scaled) {
        if(this.API.checkValidFormat(scaled, regex.CMIDecimal)
            && this.API.checkValidRange(scaled, regex.scaled_range)) {
            this.#scaled = scaled;
        }
    }
}

export class CMICommentsFromLearnerObject extends BaseCMI {
    constructor(API) {
        super(API);
    }
    #comment = "";
    #location = "";
    #timestamp = "";

    get comment() { return this.#comment; }
    set comment(comment) {
        if(this.API.checkValidFormat(comment, regex.CMILangString4000)) {
            this.#comment = comment;
        }
    }

    get location() { return this.#location; }
    set location(location) {
        if(this.API.checkValidFormat(location, regex.CMIString250)) {
            this.#location = location;
        }
    }

    get timestamp() { return this.#timestamp; }
    set timestamp(timestamp) {
        if(this.API.checkValidFormat(timestamp, regex.CMITime)) {
            this.#timestamp = timestamp;
        }
    }
}

export class CMICommentsFromLMSObject extends CMICommentsFromLearnerObject {
    constructor(API) {
        super(API);
    }

    set comment(comment) { this.API.isNotInitialized() ? this.comment = comment : throwReadOnlyError(); }

    set location(location) { this.API.isNotInitialized() ? this.location = location : throwReadOnlyError(); }

    set timestamp(timestamp) { this.API.isNotInitialized() ? this.timestamp = timestamp : throwReadOnlyError(); }
}

export class CMIInteractionsObjectivesObject extends BaseCMI {
    constructor(API) {
        super(API);
    }

    #id: "";

    get id() { return this.#id; }
    set id(id) {
        if(this.API.checkValidFormat(id, regex.CMILongIdentifier)) {
            this.#id = id;
        }
    }
}

export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
    constructor(API) {
        super(API);
    }

    #pattern: "";

    get pattern() { return this.#pattern; }
    set pattern(pattern) {
        if(this.API.checkValidFormat(pattern, regex.CMIFeedback)) {
            this.#pattern = pattern;
        }
    }
}

export class ADL extends BaseCMI {
    constructor(API) {
        super(API);
    }

    nav = new class extends BaseCMI {
        constructor(API) {
            super(API);
        }

        #request = "_none_"; // Allowed values: "continue", "previous", "choice", "jump", "exit", "exitAll", "abandon", "abandonAll", "_none_"

        get request() { return this.#request; }
        set request(request) {
            if(this.API.checkValidFormat(request, regex.NAVEvent)) {
                this.#request = request;
            }
        }

        request_valid = new class extends BaseCMI {
            constructor(API) {
                super(API);
            }

            #continue = "unknown"; // Allowed values: "true", "false", "unknown"
            #previous = "unknown"; // Allowed values: "true", "false", "unknown"

            get continue() { return this.#continue; }
            set continue(_) { API.throwSCORMError(404); }

            get previous() { return this.#previous; }
            set previous(_) { API.throwSCORMError(404); }

            choice = class {
                _isTargetValid = (_target) => "unknown";
            };

            jump = class {
                _isTargetValid = (_target) => "unknown";
            };
        }
    };
}
