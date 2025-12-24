import { BaseCMI } from "../cmi/common/base_cmi";
import { LogLevelEnum } from "../constants";
import { StringKeyMap } from "../utilities";
import { ErrorCode } from "../constants/error_codes";
export interface CMIValueAccessContext {
    readonly errorCodes: ErrorCode;
    getLastErrorCode: () => string;
    setLastErrorCode: (errorCode: string) => void;
    throwSCORMError: (element: string, errorCode: number, message?: string) => void;
    isInitialized: () => boolean;
    validateCorrectResponse: (CMIElement: string, value: string) => void;
    checkForDuplicateId: (CMIElement: string, value: string) => boolean;
    getChildElement: (CMIElement: string, value: string, foundFirstIndex: boolean) => BaseCMI | null;
    apiLog: (methodName: string, message: string, level: LogLevelEnum) => void;
    checkObjectHasProperty: (obj: StringKeyMap, attr: string) => boolean;
    getDataModel: () => StringKeyMap;
}
export declare class CMIValueAccessService {
    private context;
    constructor(context: CMIValueAccessContext);
    private getUndefinedDataModelErrorCode;
    setCMIValue(methodName: string, scorm2004: boolean, CMIElement: string, value: string): string;
    getCMIValue(methodName: string, scorm2004: boolean, CMIElement: string): string | StringKeyMap | BaseCMI;
    private setFinalAttribute;
    private traverseToNextLevel;
    private handleSetArrayAccess;
    private validateGetAttribute;
    private handleGetArrayAccess;
}
//# sourceMappingURL=CMIValueAccessService.d.ts.map