interface ErrorDescription {
  basicMessage: string;
  detailMessage: string;
}

interface ErrorDescriptions {
  [key: string]: ErrorDescription;
}

interface ScormConstants {
  cmi_children: string;
  core_children: string;
  score_children: string;
  comments_children: string;
  objectives_children: string;
  correct_responses_children: string;
  student_data_children: string;
  student_preference_children: string;
  interactions_children: string;
  error_descriptions: ErrorDescriptions;
}

interface AiccConstants extends ScormConstants {
  student_demographics_children: string;
  tries_children: string;
  attempt_records_children: string;
  paths_children: string;
}

interface Scorm2004Constants {
  cmi_children: string;
  comments_children: string;
  score_children: string;
  objectives_children: string;
  correct_responses_children: string;
  student_data_children: string;
  student_preference_children: string;
  interactions_children: string;
  adl_data_children: string;
  error_descriptions: ErrorDescriptions;
}

interface GlobalConstants {
  SCORM_TRUE: string;
  SCORM_FALSE: string;
  STATE_NOT_INITIALIZED: number;
  STATE_INITIALIZED: number;
  STATE_TERMINATED: number;
}

export const global_constants: GlobalConstants = {
  SCORM_TRUE: "true",
  SCORM_FALSE: "false",
  STATE_NOT_INITIALIZED: 0,
  STATE_INITIALIZED: 1,
  STATE_TERMINATED: 2,
};

export const scorm12_constants: ScormConstants = {
  // Children lists
  cmi_children:
    "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions",
  core_children:
    "student_id,student_name,lesson_location,credit,lesson_status,entry,score,total_time,lesson_mode,exit,session_time",
  score_children: "raw,min,max",
  comments_children: "content,location,time",
  objectives_children: "id,score,status",
  correct_responses_children: "pattern",
  student_data_children: "mastery_score,max_time_allowed,time_limit_action",
  student_preference_children: "audio,language,speed,text",
  interactions_children:
    "id,objectives,time,type,correct_responses,weighting,student_response,result,latency",
  error_descriptions: {
    "101": {
      basicMessage: "General Exception",
      detailMessage:
        "No specific error code exists to describe the error. Use LMSGetDiagnostic for more information",
    },
    "201": {
      basicMessage: "Invalid argument error",
      detailMessage:
        "Indicates that an argument represents an invalid data model element or is otherwise incorrect.",
    },
    "202": {
      basicMessage: "Element cannot have children",
      detailMessage:
        'Indicates that LMSGetValue was called with a data model element name that ends in "_children" for a data model element that does not support the "_children" suffix.',
    },
    "203": {
      basicMessage: "Element not an array - cannot have count",
      detailMessage:
        'Indicates that LMSGetValue was called with a data model element name that ends in "_count" for a data model element that does not support the "_count" suffix.',
    },
    "301": {
      basicMessage: "Not initialized",
      detailMessage:
        "Indicates that an API call was made before the call to lmsInitialize.",
    },
    "401": {
      basicMessage: "Not implemented error",
      detailMessage:
        "The data model element indicated in a call to LMSGetValue or LMSSetValue is valid, but was not implemented by this LMS. SCORM 1.2 defines a set of data model elements as being optional for an LMS to implement.",
    },
    "402": {
      basicMessage: "Invalid set value, element is a keyword",
      detailMessage:
        'Indicates that LMSSetValue was called on a data model element that represents a keyword (elements that end in "_children" and "_count").',
    },
    "403": {
      basicMessage: "Element is read only",
      detailMessage:
        "LMSSetValue was called with a data model element that can only be read.",
    },
    "404": {
      basicMessage: "Element is write only",
      detailMessage:
        "LMSGetValue was called on a data model element that can only be written to.",
    },
    "405": {
      basicMessage: "Incorrect Data Type",
      detailMessage:
        "LMSSetValue was called with a value that is not consistent with the data format of the supplied data model element.",
    },
    "407": {
      basicMessage: "Element Value Out Of Range",
      detailMessage:
        "The numeric value supplied to a LMSSetValue call is outside of the numeric range allowed for the supplied data model element.",
    },
    "408": {
      basicMessage: "Data Model Dependency Not Established",
      detailMessage:
        "Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element.",
    },
  },
};
export const aicc_constants: AiccConstants = {
  ...scorm12_constants,
  ...{
    cmi_children:
      "core,suspend_data,launch_data,comments,objectives,student_data,student_preference,interactions,evaluation",
    student_preference_children:
      "audio,language,lesson_type,speed,text,text_color,text_location,text_size,video,windows",
    student_data_children:
      "attempt_number,tries,mastery_score,max_time_allowed,time_limit_action",
    student_demographics_children:
      "city,class,company,country,experience,familiar_name,instructor_name,title,native_language,state,street_address,telephone,years_experience",
    tries_children: "time,status,score",
    attempt_records_children: "score,lesson_status",
    paths_children: "location_id,date,time,status,why_left,time_in_element",
  },
};

export const scorm2004_constants: Scorm2004Constants = {
  // Children lists
  cmi_children:
    "_version,comments_from_learner,comments_from_lms,completion_status,credit,entry,exit,interactions,launch_data,learner_id,learner_name,learner_preference,location,max_time_allowed,mode,objectives,progress_measure,scaled_passing_score,score,session_time,success_status,suspend_data,time_limit_action,total_time",
  comments_children: "comment,timestamp,location",
  score_children: "max,raw,scaled,min",
  objectives_children:
    "progress_measure,completion_status,success_status,description,score,id",
  correct_responses_children: "pattern",
  student_data_children: "mastery_score,max_time_allowed,time_limit_action",
  student_preference_children:
    "audio_level,audio_captioning,delivery_speed,language",
  interactions_children:
    "id,type,objectives,timestamp,correct_responses,weighting,learner_response,result,latency,description",
  adl_data_children: "id,store",
  error_descriptions: {
    "0": {
      basicMessage: "No Error",
      detailMessage: "No error occurred, the previous API call was successful.",
    },
    "101": {
      basicMessage: "General Exception",
      detailMessage:
        "No specific error code exists to describe the error. Use GetDiagnostic for more information.",
    },
    "102": {
      basicMessage: "General Initialization Failure",
      detailMessage: "Call to Initialize failed for an unknown reason.",
    },
    "103": {
      basicMessage: "Already Initialized",
      detailMessage:
        "Call to Initialize failed because Initialize was already called.",
    },
    "104": {
      basicMessage: "Content Instance Terminated",
      detailMessage:
        "Call to Initialize failed because Terminate was already called.",
    },
    "111": {
      basicMessage: "General Termination Failure",
      detailMessage: "Call to Terminate failed for an unknown reason.",
    },
    "112": {
      basicMessage: "Termination Before Initialization",
      detailMessage:
        "Call to Terminate failed because it was made before the call to Initialize.",
    },
    "113": {
      basicMessage: "Termination After Termination",
      detailMessage:
        "Call to Terminate failed because Terminate was already called.",
    },
    "122": {
      basicMessage: "Retrieve Data Before Initialization",
      detailMessage:
        "Call to GetValue failed because it was made before the call to Initialize.",
    },
    "123": {
      basicMessage: "Retrieve Data After Termination",
      detailMessage:
        "Call to GetValue failed because it was made after the call to Terminate.",
    },
    "132": {
      basicMessage: "Store Data Before Initialization",
      detailMessage:
        "Call to SetValue failed because it was made before the call to Initialize.",
    },
    "133": {
      basicMessage: "Store Data After Termination",
      detailMessage:
        "Call to SetValue failed because it was made after the call to Terminate.",
    },
    "142": {
      basicMessage: "Commit Before Initialization",
      detailMessage:
        "Call to Commit failed because it was made before the call to Initialize.",
    },
    "143": {
      basicMessage: "Commit After Termination",
      detailMessage:
        "Call to Commit failed because it was made after the call to Terminate.",
    },
    "201": {
      basicMessage: "General Argument Error",
      detailMessage:
        "An invalid argument was passed to an API method (usually indicates that Initialize, Commit or Terminate did not receive the expected empty string argument.",
    },
    "301": {
      basicMessage: "General Get Failure",
      detailMessage:
        "Indicates a failed GetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.",
    },
    "351": {
      basicMessage: "General Set Failure",
      detailMessage:
        "Indicates a failed SetValue call where no other specific error code is applicable. Use GetDiagnostic for more information.",
    },
    "391": {
      basicMessage: "General Commit Failure",
      detailMessage:
        "Indicates a failed Commit call where no other specific error code is applicable. Use GetDiagnostic for more information.",
    },
    "401": {
      basicMessage: "Undefined Data Model Element",
      detailMessage:
        "The data model element name passed to GetValue or SetValue is not a valid SCORM data model element.",
    },
    "402": {
      basicMessage: "Unimplemented Data Model Element",
      detailMessage:
        "The data model element indicated in a call to GetValue or SetValue is valid, but was not implemented by this LMS. In SCORM 2004, this error would indicate an LMS that is not fully SCORM conformant.",
    },
    "403": {
      basicMessage: "Data Model Element Value Not Initialized",
      detailMessage:
        "Attempt to read a data model element that has not been initialized by the LMS or through a SetValue call. This error condition is often reached during normal execution of a SCO.",
    },
    "404": {
      basicMessage: "Data Model Element Is Read Only",
      detailMessage:
        "SetValue was called with a data model element that can only be read.",
    },
    "405": {
      basicMessage: "Data Model Element Is Write Only",
      detailMessage:
        "GetValue was called on a data model element that can only be written to.",
    },
    "406": {
      basicMessage: "Data Model Element Type Mismatch",
      detailMessage:
        "SetValue was called with a value that is not consistent with the data format of the supplied data model element.",
    },
    "407": {
      basicMessage: "Data Model Element Value Out Of Range",
      detailMessage:
        "The numeric value supplied to a SetValue call is outside of the numeric range allowed for the supplied data model element.",
    },
    "408": {
      basicMessage: "Data Model Dependency Not Established",
      detailMessage:
        "Some data model elements cannot be set until another data model element was set. This error condition indicates that the prerequisite element was not set before the dependent element.",
    },
  },
};
