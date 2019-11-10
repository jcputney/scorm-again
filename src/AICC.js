/*
 * Copyright (C) Noverant, Inc - All Rights Reserved Unauthorized copying of this file, via any
 * medium is strictly prohibited Proprietary and confidential
 */

// @flow
import Scorm12API from './Scorm12API';
import {
    CMIInteractionsCorrectResponsesObject,
    CMIInteractionsObject,
    CMIInteractionsObjectivesObject,
    CMIObjectivesObject
} from "./cmi/scorm12_cmi";
import {CMIEvaluationCommentsObject, CMITriesObject, NAV} from "./cmi/aicc_cmi";

class AICC extends Scorm12API {
    constructor() {
        super();

        this.nav = new NAV(this);
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
            newChild = new CMIInteractionsCorrectResponsesObject(this);
        } else if (this.stringContains(CMIElement, ".objectives")) {
            newChild = new CMIInteractionsObjectivesObject(this);
        } else if (this.stringContains(CMIElement, "cmi.interactions")) {
            newChild = new CMIInteractionsObject(this);
        } else if (this.stringContains(CMIElement, "cmi.evaluation.comments")) {
            newChild = new CMIEvaluationCommentsObject(this);
        } else if (this.stringContains(CMIElement, "cmi.student_data.tries")) {
            newChild = new CMITriesObject(this);
        }

        return newChild;
    }

    /**
     * Replace the whole API with another
     */
    replaceWithAnotherScormAPI(newAPI) {
        // Data Model
        this.cmi = newAPI.cmi;
        this.nav = newAPI.nav;
    }
}
