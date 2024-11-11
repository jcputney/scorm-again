import * as Scorm12CMI from "../scorm12/cmi";
import { aicc_constants } from "../../constants/api_constants";
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

/**
 * CMI Class for AICC
 */
export class CMI extends Scorm12CMI.CMI {
  /**
   * Constructor for AICC CMI object
   * @param {boolean} initialized
   */
  constructor(initialized: boolean = false) {
    super(aicc_constants.cmi_children);
    if (initialized) this.initialize();
    this.student_preference = new AICCStudentPreferences();
    this.student_data = new AICCCMIStudentData();
    this.student_demographics = new CMIStudentDemographics();
    this.evaluation = new CMIEvaluation();
    this.paths = new CMIPaths();
  }

  public override student_data: AICCCMIStudentData;
  public override student_preference: AICCStudentPreferences;
  public student_demographics: CMIStudentDemographics;
  public evaluation: CMIEvaluation;
  public paths: CMIPaths;

  /**
   * Called when the API has been initialized after the CMI has been created
   */
  override initialize() {
    super.initialize();
    this.student_preference?.initialize();
    this.student_data?.initialize();
    this.student_demographics?.initialize();
    this.evaluation?.initialize();
    this.paths?.initialize();
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
  override toJSON(): {
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
  } {
    this.jsonString = true;
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
    };
    delete this.jsonString;
    return result;
  }
}
