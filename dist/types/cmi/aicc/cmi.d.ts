import * as Scorm12CMI from "../scorm12/cmi";
import { CMIEvaluation } from "./evaluation";
import { AICCStudentPreferences } from "./student_preferences";
import { CMIStudentDemographics } from "./student_demographics";
import { AICCCMIStudentData } from "./student_data";
import { CMIPaths } from "./paths";
import { CMICore } from "./core";
import { CMIObjectives } from "../scorm12/objectives";
import { CMIStudentData } from "../scorm12/student_data";
import { CMIStudentPreference } from "../scorm12/student_preference";
import { CMIInteractions } from "../scorm12/interactions";
export declare class CMI extends Scorm12CMI.CMI {
    constructor(initialized?: boolean);
    student_data: AICCCMIStudentData;
    student_preference: AICCStudentPreferences;
    student_demographics: CMIStudentDemographics;
    evaluation: CMIEvaluation;
    paths: CMIPaths;
    initialize(): void;
    toJSON(): {
        suspend_data: string;
        launch_data: string;
        comments: string;
        comments_from_lms: string;
        core: CMICore;
        objectives: CMIObjectives;
        student_data: CMIStudentData;
        student_preference: CMIStudentPreference;
        student_demographics: CMIStudentDemographics;
        interactions: CMIInteractions;
        evaluation: CMIEvaluation;
        paths: CMIPaths;
    };
}
