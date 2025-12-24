import { CMIArray } from "../../cmi/common/array";
import { CMIInteractionsObject } from "../../cmi/scorm2004/interactions";
import { ResponseType } from "../../constants";
export interface ValidationContext {
    throwSCORMError: (element: string, errorCode: number, message?: string) => void;
    getLastErrorCode: () => string;
    checkCorrectResponseValue?: (CMIElement: string, interaction_type: string, nodes: Array<any>, value: any) => void;
}
export declare class Scorm2004ResponseValidator {
    private context;
    constructor(context: ValidationContext);
    checkValidResponseType(CMIElement: string, response_type: ResponseType, value: any, interaction_type: string): void;
    checkDuplicateChoiceResponse(CMIElement: string, interaction: CMIInteractionsObject, value: any): void;
    validateCorrectResponse(CMIElement: string, interaction: CMIInteractionsObject, value: any): void;
    checkDuplicatedPattern(correct_response: CMIArray, current_index: number, value: any): boolean;
    checkCorrectResponseValue(CMIElement: string, interaction_type: string, nodes: Array<any>, value: any): void;
    removeCorrectResponsePrefixes(CMIElement: string, node: string): any;
}
//# sourceMappingURL=response_validator.d.ts.map