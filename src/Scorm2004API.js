// @flow
import BaseAPI from './BaseAPI';
import {
    ADL,
    CMI,
    CMICommentsFromLearnerObject,
    CMICommentsFromLMSObject,
    CMIInteractionsCorrectResponsesObject,
    CMIInteractionsObject,
    CMIInteractionsObjectivesObject,
    CMIObjectivesObject
} from './cmi/scorm2004_cmi';
import * as Utilities from "./utilities";
import {correct_responses, scorm2004_constants, scorm2004_error_codes} from "./constants";
import {scorm2004_regex} from "./regex";

const constants = scorm2004_constants;
const valid_languages = constants.valid_languages;

class Scorm2004API extends BaseAPI {
    version: "1.0";

    constructor() {
        super(scorm2004_error_codes);

        this.cmi = new CMI(this);
        this.adl = new ADL(this);

        // Rename functions to match 2004 Spec
        this.Initialize = this.LMSInitialize;
        this.Terminate = this.LMSTerminate;
        this.GetValue = this.LMSGetValue;
        this.SetValue = this.LMSSetValue;
        this.Commit = this.LMSCommit;
        this.GetLastError = this.LMSGetLastError;
        this.GetErrorString = this.LMSGetErrorString;
        this.GetDiagnostic = this.LMSGetDiagnostic;
    }

    /**
     * @returns {string} bool
     */
    LMSInitialize() {
        return this.APIInitialize("Initialize");
    }

    /**
     * @returns {string} bool
     */
    LMSTerminate() {
        return this.APITerminate("Terminate", true);
    }

    /**
     * @param CMIElement
     * @returns {string}
     */
    LMSGetValue(CMIElement) {
        return this.APIGetValue("GetValue", true, CMIElement);
    }

    /**
     * @param CMIElement
     * @param value
     * @returns {string}
     */
    LMSSetValue(CMIElement, value) {
        return this.APISetValue("SetValue", true, CMIElement, value);
    }

    /**
     * Orders LMS to store all content parameters
     *
     * @returns {string} bool
     */
    LMSCommit() {
        return this.APICommit("Commit");
    }

    /**
     * Returns last error code
     *
     * @returns {string}
     */
    LMSGetLastError() {
        return this.APIGetLastError("GetLastError");
    }

    /**
     * Returns the errorNumber error description
     *
     * @param CMIErrorCode
     * @returns {string}
     */
    LMSGetErrorString(CMIErrorCode) {
        return this.APIGetErrorString("GetErrorString", CMIErrorCode);
    }

    /**
     * Returns a comprehensive description of the errorNumber error.
     *
     * @param CMIErrorCode
     * @returns {string}
     */
    LMSGetDiagnostic(CMIErrorCode) {
        return this.APIGetDiagnostic("GetDiagnostic", CMIErrorCode);
    }

    /**
     * Sets a value on the CMI Object
     *
     * @param CMIElement
     * @param value
     * @returns {string}
     */
    setCMIValue(CMIElement, value) {
        this._commonSetCMIValue("SetValue", true, CMIElement, value);
    }

    /**
     * Gets or builds a new child element to add to the array.
     *
     * @param CMIElement
     * @param value
     */
    getChildElement(CMIElement, value) {
        let newChild;

        if (this.stringContains(CMIElement, "cmi.objectives")) {
            newChild = new CMIObjectivesObject(this);
        } else if (this.stringContains(CMIElement, ".correct_responses")) {
            const parts = CMIElement.split('.');
            const index = Number(parts[2]);
            let interaction = this.cmi.interactions.childArray[index];
            if(typeof interaction.type === 'undefined') {
                this.throwSCORMError(scorm2004_error_codes.DEPENDENCY_NOT_ESTABLISHED);
            } else {
                let interaction_type = interaction.type;
                let interaction_count = interaction.correct_responses._count;
                if(interaction_type === 'choice') {
                    for(let i = 0; i < interaction_count && this.lastErrorCode === 0; i++) {
                        const response = interaction.correct_responses.childArray[i];
                        if(response.pattern === value) {
                            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
                        }
                    }
                }

                const response_type = correct_responses[interaction_type];
                let nodes = [];
                if(response_type.delimiter !== '') {
                    nodes = value.split(response_type.delimiter);
                } else {
                    nodes[0] = value;
                }

                if(nodes.length > 0 && nodes.length <= response_type.max) {
                    this.#checkCorrectResponseValue(interaction_type, nodes, value);
                } else if (nodes.length > response_type.max) {
                    this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, "Data Model Element Pattern Too Long");
                }
            }
            if(this.lastErrorCode === 0) {
                newChild = new CMIInteractionsCorrectResponsesObject(this);
            }
        } else if (this.stringContains(CMIElement, ".objectives")) {
            newChild = new CMIInteractionsObjectivesObject(this);
        } else if (this.stringContains(CMIElement, "cmi.interactions")) {
            newChild = new CMIInteractionsObject(this);
        } else if (this.stringContains(CMIElement, "cmi.comments_from_learner")) {
            newChild = new CMICommentsFromLearnerObject(this);
        } else if (this.stringContains(CMIElement, "cmi.comments_from_lms")) {
            newChild = new CMICommentsFromLMSObject(this);
        }

        return newChild;
    }

    validateCorrectResponse(CMIElement, value) {
        const parts = CMIElement.split('.');
        const index = Number(parts[2]);
        const pattern_index = Number(parts[4]);
        let interaction = this.cmi.interactions.childArray[index];

        let interaction_type = interaction.type;
        let interaction_count = interaction.correct_responses._count;
        if(interaction_type === 'choice') {
            for(let i = 0; i < interaction_count && this.lastErrorCode === 0; i++) {
                const response = interaction.correct_responses.childArray[i];
                if(response.pattern === value) {
                    this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE);
                }
            }
        }

        const response_type = scorm2004_constants.correct_responses[interaction_type];
        if(typeof response_type.limit !== 'undefined' || interaction_count < response_type.limit) {
            let nodes = [];
            if (response_type.delimiter !== '') {
                nodes = value.split(response_type.delimiter);
            } else {
                nodes[0] = value;
            }

            if(nodes.length > 0 && nodes.length <= response_type.max) {
                this.#checkCorrectResponseValue(interaction_type, nodes, value);
            } else if (nodes.length > response_type.max) {
                this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, "Data Model Element Pattern Too Long");
            }

            if(this.lastErrorCode === 0
                && (!response_type.duplicate || !this.#checkDuplicatedPattern(interaction.correct_responses, pattern_index, value))
                || (this.lastErrorCode === 0 && value === '')) {
                // do nothing, we want the inverse
            } else {
                if(this.lastErrorCode === 0) {
                    this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, "Data Model Element Pattern Already Exists");
                }
            }
        } else {
            this.throwSCORMError(scorm2004_error_codes.GENERAL_SET_FAILURE, "Data Model Element Collection Limit Reached");
        }
    }

    /**
     * Gets a value from the CMI Object
     *
     * @param CMIElement
     * @returns {*}
     */
    getCMIValue(CMIElement) {
        return this._commonGetCMIValue("GetValue", true,  CMIElement);
    }

    /**
     * Returns the message that corresponds to errorNumber.
     */
    getLmsErrorMessageDetails(errorNumber, detail) {
        let basicMessage = "";
        let detailMessage = "";

        // Set error number to string since inconsistent from modules if string or number
        errorNumber = String(errorNumber);
        if(constants.error_descriptions[errorNumber]) {
            basicMessage = constants.error_descriptions[errorNumber].basicMessage;
            detailMessage = constants.error_descriptions[errorNumber].detailMessage;
        }

        return detail ? detailMessage : basicMessage;
    }

    #checkDuplicatedPattern(correct_response, current_index, value) {
        let found = false;
        let count = correct_response._count;
        for(let i = 0; i < count && !found; i++) {
            if(i !== current_index && correct_response.childArray[i] === value) {
                found = true;
            }
        }
        return found;
    }

    #checkCorrectResponseValue(interaction_type, nodes, value) {
        const response = correct_responses[interaction_type];
        const formatRegex = new RegExp(response.format);
        for(let i = 0; i < nodes.length && this.lastErrorCode === 0; i++) {
            if(interaction_type.match('^(fill-in|long-fill-in|matching|performance|sequencing)$')) {
                nodes[i] = #removeCorrectResponsePrefixes(nodes[i]);
            }

            if(response.delimiter2 !== undefined) {
                let values = nodes[i].split(response.delimiter2);
                if(values.length === 2) {
                    let matches = values[0].match(formatRegex);
                    if(!matches) {
                        this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                    } else {
                        if(!values[1].match(new RegExp(response.format2))) {
                            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                        }
                    }
                } else {
                    this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                }
            } else {
                let matches = nodes[i].match(formatRegex);
                if((!matches && value !== '') || (!matches && interaction_type === 'true-false')) {
                    this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                } else {
                    if (interaction_type === 'numeric' && nodes.length > 1) {
                        if(Number(nodes[0]) > Number(nodes[1])) {
                            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                        }
                    } else {
                        if(nodes[i] !== '' && response.unique) {
                            for(let j = 0; j < i && this.lastErrorCode === 0; j++) {
                                if(nodes[i] === nodes[j]) {
                                    this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    #removeCorrectResponsePrefixes(node) {
        let seenOrder = false;
        let seenCase = false;
        let seenLang = false;

        let prefixRegex = '^(\{(lang|case_matters|order_matters)=([^\}]+)\})';
        let matches = node.match(prefixRegex);
        while(matches) {
            switch (matches[2]) {
                case 'lang':
                    let langMatches = node.match(scorm2004_regex.CMILangcr);
                    if(langMatches) {
                        let lang = langMatches[3];
                        if (lang !== undefined && lang.length > 0) {
                            if(valid_languages[lang.toLowerCase()] === undefined) {
                                this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                            }
                        }
                    }
                    seenLang = true;
                    break;
                case 'case_matters':
                    if(!seenLang && !seenOrder && !seenCase) {
                        if(matches[3] !== 'true' && matches[3] !== 'false') {
                            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                        }
                    }

                    seenCase = true;
                    break;
                case 'order_matters':
                    if(!seenCase && !seenLang && !seenOrder) {
                        if(matches[3] !== 'true' && matches[3] !== 'false') {
                            this.throwSCORMError(scorm2004_error_codes.TYPE_MISMATCH);
                        }
                    }

                    seenOrder = true;
                    break;
                default:
                    break;
            }
            node = node.substr(matches[1].length);
            matches = node.match(prefixRegex);
        }

        return node;
    }

    /**
     * Replace the whole API with another
     */
    replaceWithAnotherScormAPI(newAPI) {
        // Data Model
        this.cmi = newAPI.cmi;
        this.adl = newAPI.adl;
    }

    /**
     * Adds the current session time to the existing total time.
     */
    getCurrentTotalTime() {
        const totalTime = this.cmi.total_time;
        const sessionTime = this.cmi.session_time;

        const durationRegex = scorm2004_regex.CMITimespan;
        const totalSeconds = Utilities.getDurationAsSeconds(totalTime, durationRegex);
        const sessionSeconds = Utilities.getDurationAsSeconds(sessionTime, durationRegex);

        return Utilities.getSecondsAsISODuration(totalSeconds + sessionSeconds);
    }
}
