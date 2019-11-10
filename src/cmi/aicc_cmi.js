/*
 * Copyright (C) Noverant, Inc - All Rights Reserved Unauthorized copying of this file, via any
 * medium is strictly prohibited Proprietary and confidential
 */

import * as Scorm12CMI from './scorm12_cmi';
import {BaseCMI, CMIArray, CMIScore} from "./common";
import {aicc_constants} from "../constants";
import {aicc_regex} from "../regex";

const constants = aicc_constants;
const regex = aicc_regex;

export class CMI extends Scorm12CMI.CMI {
    constructor(API) {
        super(API, constants.cmi_children, new AICCCMIStudentData(API));

        this.evaluation = new CMIEvaluation(API);
    }
}

class CMIEvaluation extends BaseCMI {
    constructor(API) {
        super(API);
    }

    comments = new class extends CMIArray {
        constructor(API) {
            super(API, constants.comments_children, 402);
        }
    };
}

class AICCCMIStudentData extends Scorm12CMI.CMIStudentData {
    constructor(API) {
        super(API, constants.student_data_children);
    }

    #tries_during_lesson = "";

    get tries_during_lesson() { return this.#tries_during_lesson; }
    set tries_during_lesson(tries_during_lesson) { this.API.isNotInitialized() ? this.#tries_during_lesson = tries_during_lesson : this.throwReadOnlyError() }

    tries = new class extends CMIArray {
        constructor(API) {
            super(API, aicc_constants.tries_children);
        }
    };
}

export class CMITriesObject extends BaseCMI {
    constructor(API) {
        super(API);
    }

    #status = "";
    #time = "";

    get status() { return this.#status; }
    set status(status) {
        if(this.API.checkValidFormat(status, regex.CMIStatus2)) {
            this.#status = status;
        }
    }

    get time() { return this.#time; }
    set time(time) {
        if(this.API.checkValidFormat(time, regex.CMITime)) {
            this.#time = time;
        }
    }

    score = new CMIScore(API);
}

export class CMIEvaluationCommentsObject extends BaseCMI {
    constructor(API) {
        super(API);
    }

    #content = "";
    #location = "";
    #time = "";

    get content() { return this.#content; }
    set content(content) {
        if(this.API.checkValidFormat(content, regex.CMIString256)) {
            this.#content = content;
        }
    }

    get location() { return this.#location; }
    set location(location) {
        if(this.API.checkValidFormat(location, regex.CMIString256)) {
            this.#location = location;
        }
    }

    get time() { return this.#time; }
    set time(time) {
        if(this.API.checkValidFormat(time, regex.CMITime)) {
            this.#time = time;
        }
    }
}

export class NAV extends BaseCMI {
    constructor(API) {
        super(API);
    }

    #event = "";

    get event() { return (!this.jsonString) ? this.API.throwSCORMError(404) : this.#event; }
    set event(event) {
        if(this.API.checkValidFormat(event, regex.NAVEvent)) {
            this.#event = event;
        }
    }
}
