import { RefObject, ResultObject } from "../types/api_types";
import { BaseCMI } from "../cmi/common/base_cmi";
export interface IBaseAPI {
    cmi: BaseCMI;
    startingData?: RefObject;
    initialize(callbackName: string, initializeMessage?: string, terminationMessage?: string): string;
    lmsInitialize(): string;
    lmsFinish(): string;
    lmsGetValue(CMIElement: string): string;
    lmsSetValue(CMIElement: string, value: any): string;
    lmsCommit(): string;
    lmsGetLastError(): string;
    lmsGetErrorString(CMIErrorCode: string | number): string;
    lmsGetDiagnostic(CMIErrorCode: string | number): string;
    storeData(_calculateTotalTime: boolean): Promise<ResultObject>;
    renderCommitCMI(_terminateCommit: boolean): RefObject | Array<any>;
    getLmsErrorMessageDetails(_errorNumber: string | number, _detail?: boolean): string;
    getCMIValue(_CMIElement: string): string;
    setCMIValue(_CMIElement: string, _value: any): string;
    validateCorrectResponse(_CMIElement: string, _value: any): void;
    getChildElement(_CMIElement: string, _value: any, _foundFirstIndex: boolean): BaseCMI | null;
}
