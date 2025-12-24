import { CMI } from "../../cmi/scorm2004/cmi";
import { BaseCMI } from "../../cmi/common/base_cmi";
import { Scorm2004ResponseValidator } from "./response_validator";
export interface CMIHandlerContext {
    cmi: CMI;
    isInitialized: () => boolean;
    throwSCORMError: (element: string, errorCode: number, message?: string) => void;
    getLastErrorCode: () => string;
}
export declare class Scorm2004CMIHandler {
    private context;
    private responseValidator;
    constructor(context: CMIHandlerContext, responseValidator: Scorm2004ResponseValidator);
    getChildElement(CMIElement: string, value: any, foundFirstIndex: boolean): BaseCMI | null;
    createCorrectResponsesObject(CMIElement: string, value: any): BaseCMI | null;
    evaluateCompletionStatus(): string;
    evaluateSuccessStatus(): string;
}
//# sourceMappingURL=cmi_handler.d.ts.map