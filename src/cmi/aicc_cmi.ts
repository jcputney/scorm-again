import * as Scorm12CMI from "./scorm12_cmi"
import {BaseCMI, checkValidFormat, CMIArray, CMIScore} from "./common"
import APIConstants from "../constants/api_constants"
import Regex from "../constants/regex"
import ErrorCodes from "../constants/error_codes"
import {AICCValidationError} from "../exceptions"

const aicc_constants = APIConstants.aicc
const aicc_regex = Regex.aicc
const aicc_error_codes = ErrorCodes.scorm12

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
function checkAICCValidFormat(
    value: string,
    regexPattern: string,
    allowEmptyString?: boolean,
): boolean {
    return checkValidFormat(
        value,
        regexPattern,
        aicc_error_codes.TYPE_MISMATCH,
        AICCValidationError,
        allowEmptyString,
    )
}

/**
 * CMI Class for AICC
 */
export class CMI extends Scorm12CMI.CMI {
    /**
     * Constructor for AICC CMI object
     * @param {boolean} initialized
     */
    constructor(initialized: boolean = false) {
        super(aicc_constants.cmi_children)
        if (initialized) this.initialize()
        this.student_preference = new AICCStudentPreferences()
        this.student_data = new AICCCMIStudentData()
        this.student_demographics = new CMIStudentDemographics()
        this.evaluation = new CMIEvaluation()
        this.paths = new CMIPaths()
    }

    public student_data: AICCCMIStudentData
    public student_preference: AICCStudentPreferences
    public student_demographics: CMIStudentDemographics
    public evaluation: CMIEvaluation
    public paths: CMIPaths

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    initialize() {
        super.initialize()
        this.student_preference?.initialize()
        this.student_data?.initialize()
        this.student_demographics?.initialize()
        this.evaluation?.initialize()
        this.paths?.initialize()
    }

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
     *      interactions: CMIInteractions,
     *      paths: CMIPaths
     *    }
     *  }
     */
    toJSON(): {
        suspend_data: string,
        launch_data: string,
        comments: string,
        comments_from_lms: string,
        core: Scorm12CMI.CMICore,
        objectives: Scorm12CMI.CMIObjectives,
        student_data: Scorm12CMI.CMIStudentData,
        student_preference: Scorm12CMI.CMIStudentPreference,
        student_demographics: CMIStudentDemographics,
        interactions: Scorm12CMI.CMIInteractions,
        evaluation: CMIEvaluation,
        paths: CMIPaths
    } {
        this.jsonString = true
        const result = {
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
        }
        delete this.jsonString
        return result
    }
}

/**
 * AICC Evaluation object
 */

class CMIEvaluation extends BaseCMI {
    /**
     * Constructor for AICC Evaluation object
     */
    constructor() {
        super()
        this.comments = new CMIEvaluationComments()
    }

    public comments: CMIEvaluationComments

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    initialize() {
        super.initialize()
        this.comments?.initialize()
    }

    /**
     * toJSON for cmi.evaluation object
     * @return {{comments: CMIEvaluationComments}}
     */
    toJSON(): {
        comments: CMIEvaluationComments
    } {
        this.jsonString = true
        const result = {
            comments: this.comments,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class representing AICC's cmi.evaluation.comments object
 */

class CMIEvaluationComments extends CMIArray {
    /**
     * Constructor for AICC Evaluation Comments object
     */
    constructor() {
        super({
            children: aicc_constants.comments_children,
            errorCode: aicc_error_codes.INVALID_SET_VALUE,
            errorClass: AICCValidationError,
        })
    }
}

/**
 * StudentPreferences class for AICC
 */

class AICCStudentPreferences extends Scorm12CMI.CMIStudentPreference {
    /**
     * Constructor for AICC Student Preferences object
     */
    constructor() {
        super(aicc_constants.student_preference_children)
        this.windows = new CMIArray({
            errorCode: aicc_error_codes.INVALID_SET_VALUE,
            errorClass: AICCValidationError,
            children: "",
        })
    }

    public windows: CMIArray

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    initialize() {
        super.initialize()
        this.windows?.initialize()
    }

    private _lesson_type = ""
    private _text_color = ""
    private _text_location = ""
    private _text_size = ""
    private _video = ""

    /**
     * Getter for _lesson_type
     * @return {string}
     */
    get lesson_type(): string {
        return this._lesson_type
    }

    /**
     * Setter for _lesson_type
     * @param {string} lesson_type
     */
    set lesson_type(lesson_type: string) {
        if (checkAICCValidFormat(lesson_type, aicc_regex.CMIString256)) {
            this._lesson_type = lesson_type
        }
    }

    /**
     * Getter for _text_color
     * @return {string}
     */
    get text_color(): string {
        return this._text_color
    }

    /**
     * Setter for _text_color
     * @param {string} text_color
     */
    set text_color(text_color: string) {
        if (checkAICCValidFormat(text_color, aicc_regex.CMIString256)) {
            this._text_color = text_color
        }
    }

    /**
     * Getter for _text_location
     * @return {string}
     */
    get text_location(): string {
        return this._text_location
    }

    /**
     * Setter for _text_location
     * @param {string} text_location
     */
    set text_location(text_location: string) {
        if (checkAICCValidFormat(text_location, aicc_regex.CMIString256)) {
            this._text_location = text_location
        }
    }

    /**
     * Getter for _text_size
     * @return {string}
     */
    get text_size(): string {
        return this._text_size
    }

    /**
     * Setter for _text_size
     * @param {string} text_size
     */
    set text_size(text_size: string) {
        if (checkAICCValidFormat(text_size, aicc_regex.CMIString256)) {
            this._text_size = text_size
        }
    }

    /**
     * Getter for _video
     * @return {string}
     */
    get video(): string {
        return this._video
    }

    /**
     * Setter for _video
     * @param {string} video
     */
    set video(video: string) {
        if (checkAICCValidFormat(video, aicc_regex.CMIString256)) {
            this._video = video
        }
    }

    /**
     * toJSON for cmi.student_preference
     *
     * @return {
     *    {
     *      audio: string,
     *      language: string,
     *      speed: string,
     *      text: string,
     *      text_color: string,
     *      text_location: string,
     *      text_size: string,
     *      video: string,
     *      windows: CMIArray
     *    }
     *  }
     */
    toJSON(): {
        audio: string,
        language: string,
        lesson_type: string,
        speed: string,
        text: string,
        text_color: string,
        text_location: string,
        text_size: string,
        video: string,
        windows: CMIArray
    } {
        this.jsonString = true
        const result = {
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
        }
        delete this.jsonString
        return result
    }
}

/**
 * StudentData class for AICC
 */

class AICCCMIStudentData extends Scorm12CMI.CMIStudentData {
    /**
     * Constructor for AICC StudentData object
     */
    constructor() {
        super(aicc_constants.student_data_children)
        this.tries = new CMITries()
    }

    public tries: CMITries

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    initialize() {
        super.initialize()
        this.tries?.initialize()
    }

    private _tries_during_lesson = ""

    /**
     * Getter for tries_during_lesson
     * @return {string}
     */
    get tries_during_lesson(): string {
        return this._tries_during_lesson
    }

    /**
     * Setter for _tries_during_lesson. Sets an error if trying to set after
     *  initialization.
     * @param {string} tries_during_lesson
     */
    set tries_during_lesson(tries_during_lesson: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._tries_during_lesson = tries_during_lesson
        }
    }

    /**
     * toJSON for cmi.student_data object
     * @return {
     *    {
     *      mastery_score: string,
     *      max_time_allowed: string,
     *      time_limit_action: string,
     *      tries: CMITries
     *    }
     *  }
     */
    toJSON(): {
        mastery_score: string,
        max_time_allowed: string,
        time_limit_action: string,
        tries: CMITries
    } {
        this.jsonString = true
        const result = {
            mastery_score: this.mastery_score,
            max_time_allowed: this.max_time_allowed,
            time_limit_action: this.time_limit_action,
            tries: this.tries,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class representing the AICC cmi.student_demographics object
 */

export class CMIStudentDemographics extends BaseCMI {
    /**
     * Constructor for AICC StudentDemographics object
     */
    constructor() {
        super()
    }

    private __children = aicc_constants.student_demographics_children
    private _city = ""
    private _class = ""
    private _company = ""
    private _country = ""
    private _experience = ""
    private _familiar_name = ""
    private _instructor_name = ""
    private _title = ""
    private _native_language = ""
    private _state = ""
    private _street_address = ""
    private _telephone = ""
    private _years_experience = ""

    /**
     * Getter for _children
     * @return {string}
     */
    get _children(): string {
        return this.__children
    }

    /**
     * Getter for city
     * @return {string}
     */
    get city(): string {
        return this._city
    }

    /**
     * Setter for _city. Sets an error if trying to set after
     *  initialization.
     * @param {string} city
     */
    set city(city: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._city = city
        }
    }

    /**
     * Getter for class
     * @return {string}
     */
    get class(): string {
        return this._class
    }

    /**
     * Setter for _class. Sets an error if trying to set after
     *  initialization.
     * @param {string} clazz
     */
    set class(clazz: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._class = clazz
        }
    }

    /**
     * Getter for company
     * @return {string}
     */
    get company(): string {
        return this._company
    }

    /**
     * Setter for _company. Sets an error if trying to set after
     *  initialization.
     * @param {string} company
     */
    set company(company: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._company = company
        }
    }

    /**
     * Getter for country
     * @return {string}
     */
    get country(): string {
        return this._country
    }

    /**
     * Setter for _country. Sets an error if trying to set after
     *  initialization.
     * @param {string} country
     */
    set country(country: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._country = country
        }
    }

    /**
     * Getter for experience
     * @return {string}
     */
    get experience(): string {
        return this._experience
    }

    /**
     * Setter for _experience. Sets an error if trying to set after
     *  initialization.
     * @param {string} experience
     */
    set experience(experience: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._experience = experience
        }
    }

    /**
     * Getter for familiar_name
     * @return {string}
     */
    get familiar_name(): string {
        return this._familiar_name
    }

    /**
     * Setter for _familiar_name. Sets an error if trying to set after
     *  initialization.
     * @param {string} familiar_name
     */
    set familiar_name(familiar_name: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._familiar_name = familiar_name
        }
    }

    /**
     * Getter for instructor_name
     * @return {string}
     */
    get instructor_name(): string {
        return this._instructor_name
    }

    /**
     * Setter for _instructor_name. Sets an error if trying to set after
     *  initialization.
     * @param {string} instructor_name
     */
    set instructor_name(instructor_name: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._instructor_name = instructor_name
        }
    }

    /**
     * Getter for title
     * @return {string}
     */
    get title(): string {
        return this._title
    }

    /**
     * Setter for _title. Sets an error if trying to set after
     *  initialization.
     * @param {string} title
     */
    set title(title: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._title = title
        }
    }

    /**
     * Getter for native_language
     * @return {string}
     */
    get native_language(): string {
        return this._native_language
    }

    /**
     * Setter for _native_language. Sets an error if trying to set after
     *  initialization.
     * @param {string} native_language
     */
    set native_language(native_language: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._native_language = native_language
        }
    }

    /**
     * Getter for state
     * @return {string}
     */
    get state(): string {
        return this._state
    }

    /**
     * Setter for _state. Sets an error if trying to set after
     *  initialization.
     * @param {string} state
     */
    set state(state: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._state = state
        }
    }

    /**
     * Getter for street_address
     * @return {string}
     */
    get street_address(): string {
        return this._street_address
    }

    /**
     * Setter for _street_address. Sets an error if trying to set after
     *  initialization.
     * @param {string} street_address
     */
    set street_address(street_address: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._street_address = street_address
        }
    }

    /**
     * Getter for telephone
     * @return {string}
     */
    get telephone(): string {
        return this._telephone
    }

    /**
     * Setter for _telephone. Sets an error if trying to set after
     *  initialization.
     * @param {string} telephone
     */
    set telephone(telephone: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._telephone = telephone
        }
    }

    /**
     * Getter for years_experience
     * @return {string}
     */
    get years_experience(): string {
        return this._years_experience
    }

    /**
     * Setter for _years_experience. Sets an error if trying to set after
     *  initialization.
     * @param {string} years_experience
     */
    set years_experience(years_experience: string) {
        if (this.initialized) {
            throw new AICCValidationError(aicc_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._years_experience = years_experience
        }
    }

    /**
     * toJSON for cmi.student_demographics object
     * @return {
     *      {
     *        city: string,
     *        class: string,
     *        company: string,
     *        country: string,
     *        experience: string,
     *        familiar_name: string,
     *        instructor_name: string,
     *        title: string,
     *        native_language: string,
     *        state: string,
     *        street_address: string,
     *        telephone: string,
     *        years_experience: string
     *      }
     *    }
     */
    toJSON(): {
        city: string,
        class: string,
        company: string,
        country: string,
        experience: string,
        familiar_name: string,
        instructor_name: string,
        title: string,
        native_language: string,
        state: string,
        street_address: string,
        telephone: string,
        years_experience: string
    } {
        this.jsonString = true
        const result = {
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
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class representing the AICC `cmi.paths` object
 */
export class CMIPaths extends CMIArray {
    /**
     * Constructor for inline Paths Array class
     */
    constructor() {
        super({
            children: aicc_constants.paths_children,
        })
    }
}

/**
 * Class for AICC Paths
 */
export class CMIPathsObject extends BaseCMI {
    /**
     * Constructor for AICC Paths objects
     */
    constructor() {
        super()
    }

    private _location_id = ""
    private _date = ""
    private _time = ""
    private _status = ""
    private _why_left = ""
    private _time_in_element = ""

    /**
     * Getter for _location_id
     * @return {string}
     */
    get location_id(): string {
        return this._location_id
    }

    /**
     * Setter for _location_id
     * @param {string} location_id
     */
    set location_id(location_id: string) {
        if (checkAICCValidFormat(location_id, aicc_regex.CMIString256)) {
            this._location_id = location_id
        }
    }

    /**
     * Getter for _date
     * @return {string}
     */
    get date(): string {
        return this._date
    }

    /**
     * Setter for _date
     * @param {string} date
     */
    set date(date: string) {
        if (checkAICCValidFormat(date, aicc_regex.CMIString256)) {
            this._date = date
        }
    }

    /**
     * Getter for _time
     * @return {string}
     */
    get time(): string {
        return this._time
    }

    /**
     * Setter for _time
     * @param {string} time
     */
    set time(time: string) {
        if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
            this._time = time
        }
    }

    /**
     * Getter for _status
     * @return {string}
     */
    get status(): string {
        return this._status
    }

    /**
     * Setter for _status
     * @param {string} status
     */
    set status(status: string) {
        if (checkAICCValidFormat(status, aicc_regex.CMIStatus2)) {
            this._status = status
        }
    }

    /**
     * Getter for _why_left
     * @return {string}
     */
    get why_left(): string {
        return this._why_left
    }

    /**
     * Setter for _why_left
     * @param {string} why_left
     */
    set why_left(why_left: string) {
        if (checkAICCValidFormat(why_left, aicc_regex.CMIString256)) {
            this._why_left = why_left
        }
    }

    /**
     * Getter for _time_in_element
     * @return {string}
     */
    get time_in_element(): string {
        return this._time_in_element
    }

    /**
     * Setter for _time_in_element
     * @param {string} time_in_element
     */
    set time_in_element(time_in_element: string) {
        if (checkAICCValidFormat(time_in_element, aicc_regex.CMITime)) {
            this._time_in_element = time_in_element
        }
    }

    /**
     * toJSON for cmi.paths.n object
     * @return {
     *    {
     *      location_id: string,
     *      date: string,
     *      time: string,
     *      status: string,
     *      why_left: string,
     *      time_in_element: string
     *    }
     *  }
     */
    toJSON(): {
        location_id: string,
        date: string,
        time: string,
        status: string,
        why_left: string,
        time_in_element: string
    } {
        this.jsonString = true
        const result = {
            location_id: this.location_id,
            date: this.date,
            time: this.time,
            status: this.status,
            why_left: this.why_left,
            time_in_element: this.time_in_element,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class representing the AICC cmi.student_data.tries object
 */
export class CMITries extends CMIArray {
    /**
     * Constructor for inline Tries Array class
     */
    constructor() {
        super({
            children: aicc_constants.tries_children,
        })
    }
}

/**
 * Class for AICC Tries
 */
export class CMITriesObject extends BaseCMI {
    /**
     * Constructor for AICC Tries object
     */
    constructor() {
        super()
        this.score = new CMIScore({
            score_children: aicc_constants.score_children,
            score_range: aicc_regex.score_range,
            invalidErrorCode: aicc_error_codes.INVALID_SET_VALUE,
            invalidTypeCode: aicc_error_codes.TYPE_MISMATCH,
            invalidRangeCode: aicc_error_codes.VALUE_OUT_OF_RANGE,
            errorClass: AICCValidationError,
        })
    }

    public score: CMIScore

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    initialize() {
        super.initialize()
        this.score?.initialize()
    }

    private _status = ""
    private _time = ""

    /**
     * Getter for _status
     * @return {string}
     */
    get status(): string {
        return this._status
    }

    /**
     * Setter for _status
     * @param {string} status
     */
    set status(status: string) {
        if (checkAICCValidFormat(status, aicc_regex.CMIStatus2)) {
            this._status = status
        }
    }

    /**
     * Getter for _time
     * @return {string}
     */
    get time(): string {
        return this._time
    }

    /**
     * Setter for _time
     * @param {string} time
     */
    set time(time: string) {
        if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
            this._time = time
        }
    }

    /**
     * toJSON for cmi.student_data.tries.n object
     * @return {
     *    {
     *      status: string,
     *      time: string,
     *      score: CMIScore
     *    }
     *  }
     */
    toJSON(): {
        status: string,
        time: string,
        score: CMIScore
    } {
        this.jsonString = true
        const result = {
            status: this.status,
            time: this.time,
            score: this.score,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class for cmi.student_data.attempt_records array
 */
export class CMIAttemptRecords extends CMIArray {
    /**
     * Constructor for inline Tries Array class
     */
    constructor() {
        super({
            children: aicc_constants.attempt_records_children,
        })
    }
}

/**
 * Class for AICC Attempt Records
 */
export class CMIAttemptRecordsObject extends BaseCMI {
    /**
     * Constructor for AICC Attempt Records object
     */
    constructor() {
        super()
        this.score = new CMIScore({
            score_children: aicc_constants.score_children,
            score_range: aicc_regex.score_range,
            invalidErrorCode: aicc_error_codes.INVALID_SET_VALUE,
            invalidTypeCode: aicc_error_codes.TYPE_MISMATCH,
            invalidRangeCode: aicc_error_codes.VALUE_OUT_OF_RANGE,
            errorClass: AICCValidationError,
        })
    }

    public score: CMIScore

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    initialize() {
        super.initialize()
        this.score?.initialize()
    }

    private _lesson_status = ""

    /**
     * Getter for _lesson_status
     * @return {string}
     */
    get lesson_status(): string {
        return this._lesson_status
    }

    /**
     * Setter for _lesson_status
     * @param {string} lesson_status
     */
    set lesson_status(lesson_status: string) {
        if (checkAICCValidFormat(lesson_status, aicc_regex.CMIStatus2)) {
            this._lesson_status = lesson_status
        }
    }

    /**
     * toJSON for cmi.student_data.attempt_records.n object
     * @return {
     *    {
     *         lesson_status: string,
     *         score: CMIScore
     *     }
     *  }
     */
    toJSON(): {
        lesson_status: string,
        score: CMIScore
    } {
        this.jsonString = true
        const result = {
            lesson_status: this.lesson_status,
            score: this.score,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class for AICC Evaluation Comments
 */
export class CMIEvaluationCommentsObject extends BaseCMI {
    /**
     * Constructor for Evaluation Comments
     */
    constructor() {
        super()
    }

    private _content = ""
    private _location = ""
    private _time = ""

    /**
     * Getter for _content
     * @return {string}
     */
    get content(): string {
        return this._content
    }

    /**
     * Setter for _content
     * @param {string} content
     */
    set content(content: string) {
        if (checkAICCValidFormat(content, aicc_regex.CMIString256)) {
            this._content = content
        }
    }

    /**
     * Getter for _location
     * @return {string}
     */
    get location(): string {
        return this._location
    }

    /**
     * Setter for _location
     * @param {string} location
     */
    set location(location: string) {
        if (checkAICCValidFormat(location, aicc_regex.CMIString256)) {
            this._location = location
        }
    }

    /**
     * Getter for _time
     * @return {string}
     */
    get time(): string {
        return this._time
    }

    /**
     * Setting for _time
     * @param {string} time
     */
    set time(time: string) {
        if (checkAICCValidFormat(time, aicc_regex.CMITime)) {
            this._time = time
        }
    }

    /**
     * toJSON for cmi.evaluation.comments.n object
     * @return {
     *    {
     *      content: string,
     *      location: string,
     *      time: string
     *    }
     *  }
     */
    toJSON(): {
        content: string,
        location: string,
        time: string
    } {
        this.jsonString = true
        const result = {
            content: this.content,
            location: this.location,
            time: this.time,
        }
        delete this.jsonString
        return result
    }
}