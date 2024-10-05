import {BaseCMI, BaseRootCMI, checkValidFormat, checkValidRange, CMIArray, CMIScore,} from "./common"
import APIConstants from "../constants/api_constants"
import ErrorCodes from "../constants/error_codes"
import Regex from "../constants/regex"
import {Scorm12ValidationError} from "../exceptions"
import * as Util from "../utilities"

const scorm12_constants = APIConstants.scorm12
const scorm12_regex = Regex.scorm12
const scorm12_error_codes = ErrorCodes.scorm12

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} regexPattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check12ValidFormat(
    value: string,
    regexPattern: string,
    allowEmptyString?: boolean,
): boolean {
    return checkValidFormat(
        value,
        regexPattern,
        scorm12_error_codes.TYPE_MISMATCH,
        Scorm12ValidationError,
        allowEmptyString,
    )
}

/**
 * Helper method, no reason to have to pass the same error codes every time
 * @param {string} value
 * @param {string} rangePattern
 * @param {boolean} allowEmptyString
 * @return {boolean}
 */
export function check12ValidRange(
    value: any,
    rangePattern: string,
    allowEmptyString?: boolean,
): boolean {
    if (!allowEmptyString && value === "") {
        throw new Scorm12ValidationError(scorm12_error_codes.VALUE_OUT_OF_RANGE);
    }

    return checkValidRange(
        value,
        rangePattern,
        scorm12_error_codes.VALUE_OUT_OF_RANGE,
        Scorm12ValidationError,
    )
}

/**
 * Class representing the cmi object for SCORM 1.2
 */
export class CMI extends BaseRootCMI {
    private readonly __children: string = ""
    private __version: string = "3.4"
    private _launch_data: string = ""
    private _comments: string = ""
    private _comments_from_lms: string = ""

    /**
     * Constructor for the SCORM 1.2 cmi object
     * @param {string} cmi_children
     * @param {(CMIStudentData|AICCCMIStudentData)} student_data
     * @param {boolean} initialized
     */
    constructor(cmi_children?: string, student_data?: CMIStudentData, initialized?: boolean) {
        super()
        if (initialized) this.initialize()
        this.__children = cmi_children
            ? cmi_children
            : scorm12_constants.cmi_children
        this.core = new CMICore()
        this.objectives = new CMIObjectives()
        this.student_data = student_data ? student_data : new CMIStudentData()
        this.student_preference = new CMIStudentPreference()
        this.interactions = new CMIInteractions()
    }

    public core: CMICore
    public objectives: CMIObjectives
    public student_data: CMIStudentData
    public student_preference: CMIStudentPreference
    public interactions: CMIInteractions

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    initialize() {
        super.initialize()
        this.core?.initialize()
        this.objectives?.initialize()
        this.student_data?.initialize()
        this.student_preference?.initialize()
        this.interactions?.initialize()
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
     *      interactions: CMIInteractions
     *    }
     *  }
     */
    toJSON(): {
        suspend_data: string,
        launch_data: string,
        comments: string,
        comments_from_lms: string,
        core: CMICore,
        objectives: CMIObjectives,
        student_data: CMIStudentData,
        student_preference: CMIStudentPreference,
        interactions: CMIInteractions,
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
            interactions: this.interactions,
        }
        delete this.jsonString
        return result
    }

    /**
     * Getter for __version
     * @return {string}
     */
    get _version(): string {
        return this.__version
    }

    /**
     * Setter for __version. Just throws an error.
     * @param {string} _version
     */
    set _version(_version: string) {
        throw new Scorm12ValidationError(scorm12_error_codes.INVALID_SET_VALUE)
    }

    /**
     * Getter for __children
     * @return {string}
     */
    get _children(): string {
        return this.__children
    }

    /**
     * Setter for __version. Just throws an error.
     * @param {string} _children
     */
    set _children(_children: string) {
        throw new Scorm12ValidationError(scorm12_error_codes.INVALID_SET_VALUE)
    }

    /**
     * Getter for _suspend_data
     * @return {string}
     */
    get suspend_data(): string {
        return this.core?.suspend_data
    }

    /**
     * Setter for _suspend_data
     * @param {string} suspend_data
     */
    set suspend_data(suspend_data: string) {
        if (this.core) {
            this.core.suspend_data = suspend_data
        }
    }

    /**
     * Getter for _launch_data
     * @return {string}
     */
    get launch_data(): string {
        return this._launch_data
    }

    /**
     * Setter for _launch_data. Can only be called before  initialization.
     * @param {string} launch_data
     */
    set launch_data(launch_data: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._launch_data = launch_data
        }
    }

    /**
     * Getter for _comments
     * @return {string}
     */
    get comments(): string {
        return this._comments
    }

    /**
     * Setter for _comments
     * @param {string} comments
     */
    set comments(comments: string) {
        if (check12ValidFormat(comments, scorm12_regex.CMIString4096, true)) {
            this._comments = comments
        }
    }

    /**
     * Getter for _comments_from_lms
     * @return {string}
     */
    get comments_from_lms(): string {
        return this._comments_from_lms
    }

    /**
     * Setter for _comments_from_lms. Can only be called before  initialization.
     * @param {string} comments_from_lms
     */
    set comments_from_lms(comments_from_lms: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._comments_from_lms = comments_from_lms
        }
    }

    /**
     * Adds the current session time to the existing total time.
     *
     * @return {string}
     */
    getCurrentTotalTime(): string {
        return this.core.getCurrentTotalTime(this.start_time)
    }
}
/**
 * Class representing the cmi.core object
 * @extends BaseCMI
 */

export class CMICore extends BaseCMI {
    /**
     * Constructor for cmi.core
     */
    constructor() {
        super()
        this.score = new CMIScore({
            score_children: scorm12_constants.score_children,
            score_range: scorm12_regex.score_range,
            invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
            invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
            invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
            errorClass: Scorm12ValidationError,
        })
    }

    public readonly score: CMIScore

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    initialize() {
        super.initialize()
        this.score?.initialize()
    }

    private __children = scorm12_constants.core_children
    private _student_id = ""
    private _student_name = ""
    private _lesson_location = ""
    private _credit = ""
    private _lesson_status = "not attempted"
    private _entry = ""
    private _total_time = ""
    private _lesson_mode = "normal"
    private _exit = ""
    private _session_time = "00:00:00"
    private _suspend_data = ""

    /**
     * Getter for __children
     * @return {string}
     * @private
     */
    get _children(): string {
        return this.__children
    }

    /**
     * Setter for __children. Just throws an error.
     * @param {string} _children
     * @private
     */
    set _children(_children: string) {
        throw new Scorm12ValidationError(scorm12_error_codes.INVALID_SET_VALUE)
    }

    /**
     * Getter for _student_id
     * @return {string}
     */
    get student_id(): string {
        return this._student_id
    }

    /**
     * Setter for _student_id. Can only be called before  initialization.
     * @param {string} student_id
     */
    set student_id(student_id: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._student_id = student_id
        }
    }

    /**
     * Getter for _student_name
     * @return {string}
     */
    get student_name(): string {
        return this._student_name
    }

    /**
     * Setter for _student_name. Can only be called before  initialization.
     * @param {string} student_name
     */
    set student_name(student_name: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._student_name = student_name
        }
    }

    /**
     * Getter for _lesson_location
     * @return {string}
     */
    get lesson_location(): string {
        return this._lesson_location
    }

    /**
     * Setter for _lesson_location
     * @param {string} lesson_location
     */
    set lesson_location(lesson_location: string) {
        if (
            check12ValidFormat(
                lesson_location,
                scorm12_regex.CMIString256,
                true,
            )
        ) {
            this._lesson_location = lesson_location
        }
    }

    /**
     * Getter for _credit
     * @return {string}
     */
    get credit(): string {
        return this._credit
    }

    /**
     * Setter for _credit. Can only be called before  initialization.
     * @param {string} credit
     */
    set credit(credit: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._credit = credit
        }
    }

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
        if (this.initialized) {
            if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus)) {
                this._lesson_status = lesson_status
            }
        } else {
            if (check12ValidFormat(lesson_status, scorm12_regex.CMIStatus2)) {
                this._lesson_status = lesson_status
            }
        }
    }

    /**
     * Getter for _entry
     * @return {string}
     */
    get entry(): string {
        return this._entry
    }

    /**
     * Setter for _entry. Can only be called before  initialization.
     * @param {string} entry
     */
    set entry(entry: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._entry = entry
        }
    }

    /**
     * Getter for _total_time
     * @return {string}
     */
    get total_time(): string {
        return this._total_time
    }

    /**
     * Setter for _total_time. Can only be called before  initialization.
     * @param {string} total_time
     */
    set total_time(total_time: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._total_time = total_time
        }
    }

    /**
     * Getter for _lesson_mode
     * @return {string}
     */
    get lesson_mode(): string {
        return this._lesson_mode
    }

    /**
     * Setter for _lesson_mode. Can only be called before  initialization.
     * @param {string} lesson_mode
     */
    set lesson_mode(lesson_mode: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._lesson_mode = lesson_mode
        }
    }

    /**
     * Getter for _exit. Should only be called during JSON export.
     * @return {string}
     */
    get exit(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._exit
    }

    /**
     * Setter for _exit
     * @param {string} exit
     */
    set exit(exit: string) {
        if (check12ValidFormat(exit, scorm12_regex.CMIExit, true)) {
            this._exit = exit
        }
    }

    /**
     * Getter for _session_time. Should only be called during JSON export.
     * @return {string}
     */
    get session_time(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._session_time
    }

    /**
     * Setter for _session_time
     * @param {string} session_time
     */
    set session_time(session_time: string) {
        if (check12ValidFormat(session_time, scorm12_regex.CMITimespan)) {
            this._session_time = session_time
        }
    }

    /**
     * Getter for _suspend_data
     * @return {string}
     */
    get suspend_data(): string {
        return this._suspend_data
    }

    /**
     * Setter for _suspend_data
     * @param {string} suspend_data
     */
    set suspend_data(suspend_data: string) {
        if (check12ValidFormat(suspend_data, scorm12_regex.CMIString4096, true)) {
            this._suspend_data = suspend_data
        }
    }

    /**
     * Adds the current session time to the existing total time.
     * @param {number} start_time
     * @return {string}
     */
    getCurrentTotalTime(start_time: number|undefined): string {
        let sessionTime = this._session_time
        const startTime = start_time

        if (typeof startTime !== "undefined" && startTime !== null) {
            const seconds = new Date().getTime() - startTime
            sessionTime = Util.getSecondsAsHHMMSS(seconds / 1000)
        }

        return Util.addHHMMSSTimeStrings(
            this._total_time,
            sessionTime,
            new RegExp(scorm12_regex.CMITimespan),
        )
    }

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
     */
    toJSON(): {
        student_name: string,
        entry: string,
        exit: string,
        score: CMIScore,
        student_id: string,
        lesson_mode: string,
        lesson_location: string,
        lesson_status: string,
        credit: string,
        session_time: string,
    } {
        this.jsonString = true
        const result = {
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
        }
        delete this.jsonString
        return result
    }
}
/**
 * Class representing SCORM 1.2's `cmi.objectives` object
 * @extends CMIArray
 */

export class CMIObjectives extends CMIArray {
    /**
     * Constructor for `cmi.objectives`
     */
    constructor() {
        super({
            children: scorm12_constants.objectives_children,
            errorCode: scorm12_error_codes.INVALID_SET_VALUE,
            errorClass: Scorm12ValidationError,
        })
    }
}
/**
 * Class representing SCORM 1.2's cmi.student_data object
 * @extends BaseCMI
 */

export class CMIStudentData extends BaseCMI {
    private __children
    private _mastery_score = ""
    private _max_time_allowed = ""
    private _time_limit_action = ""

    /**
     * Constructor for cmi.student_data
     * @param {string} student_data_children
     */
    constructor(student_data_children?: string) {
        super()
        this.__children = student_data_children
            ? student_data_children
            : scorm12_constants.student_data_children
    }

    /**
     * Getter for __children
     * @return {string}
     * @private
     */
    get _children(): string {
        return this.__children
    }

    /**
     * Setter for __children. Just throws an error.
     * @param {string} _children
     * @private
     */
    set _children(_children: string) {
        throw new Scorm12ValidationError(scorm12_error_codes.INVALID_SET_VALUE)
    }

    /**
     * Getter for _master_score
     * @return {string}
     */
    get mastery_score(): string {
        return this._mastery_score
    }

    /**
     * Setter for _master_score. Can only be called before  initialization.
     * @param {string} mastery_score
     */
    set mastery_score(mastery_score: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._mastery_score = mastery_score
        }
    }

    /**
     * Getter for _max_time_allowed
     * @return {string}
     */
    get max_time_allowed(): string {
        return this._max_time_allowed
    }

    /**
     * Setter for _max_time_allowed. Can only be called before  initialization.
     * @param {string} max_time_allowed
     */
    set max_time_allowed(max_time_allowed: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._max_time_allowed = max_time_allowed
        }
    }

    /**
     * Getter for _time_limit_action
     * @return {string}
     */
    get time_limit_action(): string {
        return this._time_limit_action
    }

    /**
     * Setter for _time_limit_action. Can only be called before  initialization.
     * @param {string} time_limit_action
     */
    set time_limit_action(time_limit_action: string) {
        if (this.initialized) {
            throw new Scorm12ValidationError(scorm12_error_codes.READ_ONLY_ELEMENT)
        } else {
            this._time_limit_action = time_limit_action
        }
    }

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
     */
    toJSON(): {
        mastery_score: string,
        max_time_allowed: string,
        time_limit_action: string,
    } {
        this.jsonString = true
        const result = {
            mastery_score: this.mastery_score,
            max_time_allowed: this.max_time_allowed,
            time_limit_action: this.time_limit_action,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class representing SCORM 1.2's cmi.student_preference object
 * @extends BaseCMI
 */
export class CMIStudentPreference extends BaseCMI {
    private __children

    /**
     * Constructor for cmi.student_preference
     * @param {string} student_preference_children
     */
    constructor(student_preference_children?: string) {
        super()
        this.__children = student_preference_children
            ? student_preference_children
            : scorm12_constants.student_preference_children
    }

    private _audio = ""
    private _language = ""
    private _speed = ""
    private _text = ""

    /**
     * Getter for __children
     * @return {string}
     * @private
     */
    get _children(): string {
        return this.__children
    }

    /**
     * Setter for __children. Just throws an error.
     * @param {string} _children
     * @private
     */
    set _children(_children: string) {
        throw new Scorm12ValidationError(scorm12_error_codes.INVALID_SET_VALUE)
    }

    /**
     * Getter for _audio
     * @return {string}
     */
    get audio(): string {
        return this._audio
    }

    /**
     * Setter for _audio
     * @param {string} audio
     */
    set audio(audio: string) {
        if (
            check12ValidFormat(audio, scorm12_regex.CMISInteger) &&
            check12ValidRange(audio, scorm12_regex.audio_range)
        ) {
            this._audio = audio
        }
    }

    /**
     * Getter for _language
     * @return {string}
     */
    get language(): string {
        return this._language
    }

    /**
     * Setter for _language
     * @param {string} language
     */
    set language(language: string) {
        if (check12ValidFormat(language, scorm12_regex.CMIString256)) {
            this._language = language
        }
    }

    /**
     * Getter for _speed
     * @return {string}
     */
    get speed(): string {
        return this._speed
    }

    /**
     * Setter for _speed
     * @param {string} speed
     */
    set speed(speed: string) {
        if (
            check12ValidFormat(speed, scorm12_regex.CMISInteger) &&
            check12ValidRange(speed, scorm12_regex.speed_range)
        ) {
            this._speed = speed
        }
    }

    /**
     * Getter for _text
     * @return {string}
     */
    get text(): string {
        return this._text
    }

    /**
     * Setter for _text
     * @param {string} text
     */
    set text(text: string) {
        if (
            check12ValidFormat(text, scorm12_regex.CMISInteger) &&
            check12ValidRange(text, scorm12_regex.text_range)
        ) {
            this._text = text
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
     *      text: string
     *    }
     *  }
     */
    toJSON(): {
        audio: string,
        language: string,
        speed: string,
        text: string,
    } {
        this.jsonString = true
        const result = {
            audio: this.audio,
            language: this.language,
            speed: this.speed,
            text: this.text,
        }
        delete this.jsonString
        return result
    }
}
/**
 * Class representing SCORM 1.2's `cmi.interactions` object
 * @extends BaseCMI
 */

export class CMIInteractions extends CMIArray {
    /**
     * Constructor for `cmi.interactions`
     */
    constructor() {
        super({
            children: scorm12_constants.interactions_children,
            errorCode: scorm12_error_codes.INVALID_SET_VALUE,
            errorClass: Scorm12ValidationError,
        })
    }
}
/**
 * Class representing SCORM 1.2's cmi.interactions.n object
 * @extends BaseCMI
 */

export class CMIInteractionsObject extends BaseCMI {
    /**
     * Constructor for cmi.interactions.n object
     */
    constructor() {
        super()
        this.objectives = new CMIArray({
            errorCode: scorm12_error_codes.INVALID_SET_VALUE,
            errorClass: Scorm12ValidationError,
            children: scorm12_constants.objectives_children,
        })
        this.correct_responses = new CMIArray({
            errorCode: scorm12_error_codes.INVALID_SET_VALUE,
            errorClass: Scorm12ValidationError,
            children: scorm12_constants.correct_responses_children,
        })
    }

    public readonly objectives: CMIArray
    public readonly correct_responses: CMIArray

    /**
     * Called when the API has been initialized after the CMI has been created
     */
    initialize() {
        super.initialize()
        this.objectives?.initialize()
        this.correct_responses?.initialize()
    }

    private _id = ""
    private _time = ""
    private _type = ""
    private _weighting = ""
    private _student_response = ""
    private _result = ""
    private _latency = ""

    /**
     * Getter for _id. Should only be called during JSON export.
     * @return {string}
     */
    get id(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._id
    }

    /**
     * Setter for _id
     * @param {string} id
     */
    set id(id: string) {
        if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
            this._id = id
        }
    }

    /**
     * Getter for _time. Should only be called during JSON export.
     * @return {string}
     */
    get time(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._time
    }

    /**
     * Setter for _time
     * @param {string} time
     */
    set time(time: string) {
        if (check12ValidFormat(time, scorm12_regex.CMITime)) {
            this._time = time
        }
    }

    /**
     * Getter for _type. Should only be called during JSON export.
     * @return {string}
     */
    get type(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._type
    }

    /**
     * Setter for _type
     * @param {string} type
     */
    set type(type: string) {
        if (check12ValidFormat(type, scorm12_regex.CMIType)) {
            this._type = type
        }
    }

    /**
     * Getter for _weighting. Should only be called during JSON export.
     * @return {string}
     */
    get weighting(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._weighting
    }

    /**
     * Setter for _weighting
     * @param {string} weighting
     */
    set weighting(weighting: string) {
        if (
            check12ValidFormat(weighting, scorm12_regex.CMIDecimal) &&
            check12ValidRange(weighting, scorm12_regex.weighting_range)
        ) {
            this._weighting = weighting
        }
    }

    /**
     * Getter for _student_response. Should only be called during JSON export.
     * @return {string}
     */
    get student_response(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._student_response
    }

    /**
     * Setter for _student_response
     * @param {string} student_response
     */
    set student_response(student_response: string) {
        if (
            check12ValidFormat(
                student_response,
                scorm12_regex.CMIFeedback,
                true,
            )
        ) {
            this._student_response = student_response
        }
    }

    /**
     * Getter for _result. Should only be called during JSON export.
     * @return {string}
     */
    get result(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._result
    }

    /**
     * Setter for _result
     * @param {string} result
     */
    set result(result: string) {
        if (check12ValidFormat(result, scorm12_regex.CMIResult)) {
            this._result = result
        }
    }

    /**
     * Getter for _latency. Should only be called during JSON export.
     * @return {string}
     */
    get latency(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._latency
    }

    /**
     * Setter for _latency
     * @param {string} latency
     */
    set latency(latency: string) {
        if (check12ValidFormat(latency, scorm12_regex.CMITimespan)) {
            this._latency = latency
        }
    }

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
     */
    toJSON(): {
        id: string,
        time: string,
        type: string,
        weighting: string,
        student_response: string,
        result: string,
        latency: string,
        objectives: CMIArray,
        correct_responses: CMIArray,
    } {
        this.jsonString = true
        const result = {
            id: this.id,
            time: this.time,
            type: this.type,
            weighting: this.weighting,
            student_response: this.student_response,
            result: this.result,
            latency: this.latency,
            objectives: this.objectives,
            correct_responses: this.correct_responses,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class representing SCORM 1.2's cmi.objectives.n object
 * @extends BaseCMI
 */
export class CMIObjectivesObject extends BaseCMI {
    /**
     * Constructor for cmi.objectives.n
     */
    constructor() {
        super()
        this.score = new CMIScore({
            score_children: scorm12_constants.score_children,
            score_range: scorm12_regex.score_range,
            invalidErrorCode: scorm12_error_codes.INVALID_SET_VALUE,
            invalidTypeCode: scorm12_error_codes.TYPE_MISMATCH,
            invalidRangeCode: scorm12_error_codes.VALUE_OUT_OF_RANGE,
            errorClass: Scorm12ValidationError,
        })
    }

    public readonly score: CMIScore

    private _id = ""
    private _status = ""

    /**
     * Getter for _id
     * @return {string}
     */
    get id(): string {
        return this._id
    }

    /**
     * Setter for _id
     * @param {string} id
     */
    set id(id: string) {
        if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
            this._id = id
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
        if (check12ValidFormat(status, scorm12_regex.CMIStatus2)) {
            this._status = status
        }
    }

    /**
     * toJSON for cmi.objectives.n
     * @return {
     *    {
     *      id: string,
     *      status: string,
     *      score: CMIScore
     *    }
     *  }
     */
    toJSON(): {
        id: string,
        status: string,
        score: CMIScore,
    } {
        this.jsonString = true
        const result = {
            id: this.id,
            status: this.status,
            score: this.score,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class representing SCORM 1.2's cmi.interactions.n.objectives.n object
 * @extends BaseCMI
 */
export class CMIInteractionsObjectivesObject extends BaseCMI {
    /**
     * Constructor for cmi.interactions.n.objectives.n
     */
    constructor() {
        super()
    }

    private _id = ""

    /**
     * Getter for _id
     * @return {string}
     */
    get id(): string {
        return this._id
    }

    /**
     * Setter for _id
     * @param {string} id
     */
    set id(id: string) {
        if (check12ValidFormat(id, scorm12_regex.CMIIdentifier)) {
            this._id = id
        }
    }

    /**
     * toJSON for cmi.interactions.n.objectives.n
     * @return {
     *    {
     *      id: string
     *    }
     *  }
     */
    toJSON(): {
        id: string,
    } {
        this.jsonString = true
        const result = {
            id: this.id,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class representing SCORM 1.2's cmi.interactions.correct_responses.n object
 * @extends BaseCMI
 */
export class CMIInteractionsCorrectResponsesObject extends BaseCMI {
    /**
     * Constructor for cmi.interactions.correct_responses.n
     */
    constructor() {
        super()
    }

    private _pattern = ""

    /**
     * Getter for _pattern
     * @return {string}
     */
    get pattern(): string {
        if (!this.jsonString) {
            throw new Scorm12ValidationError(scorm12_error_codes.WRITE_ONLY_ELEMENT)
        }
        return this._pattern
    }

    /**
     * Setter for _pattern
     * @param {string} pattern
     */
    set pattern(pattern: string) {
        if (check12ValidFormat(pattern, scorm12_regex.CMIFeedback, true)) {
            this._pattern = pattern
        }
    }

    /**
     * toJSON for cmi.interactions.correct_responses.n
     * @return {
     *    {
     *      pattern: string
     *    }
     *  }
     */
    toJSON(): {
        pattern: string,
    } {
        this.jsonString = true
        const result = {
            pattern: this._pattern,
        }
        delete this.jsonString
        return result
    }
}

/**
 * Class for AICC Navigation object
 */
export class NAV extends BaseCMI {
    /**
     * Constructor for NAV object
     */
    constructor() {
        super()
    }

    private _event = ""

    /**
     * Getter for _event
     * @return {string}
     */
    get event(): string {
        return this._event
    }

    /**
     * Setter for _event
     * @param {string} event
     */
    set event(event: string) {
        if (check12ValidFormat(event, scorm12_regex.NAVEvent)) {
            this._event = event
        }
    }

    /**
     * toJSON for nav object
     * @return {
     *    {
     *      event: string
     *    }
     *  }
     */
    toJSON(): {
        event: string,
    } {
        this.jsonString = true
        const result = {
            event: this.event,
        }
        delete this.jsonString
        return result
    }
}