import { CommitObject, LogLevel } from "../types/api_types";
import { StringKeyMap } from "../utilities";
import { BaseCMI } from "../cmi/common/base_cmi";
import { ISerializationService } from "../interfaces/services";
export declare class SerializationService implements ISerializationService {
    loadFromFlattenedJSON(json: StringKeyMap, CMIElement: string | undefined, setCMIValue: (CMIElement: string, value: any) => void, isNotInitialized: () => boolean, setStartingData: (data: StringKeyMap) => void): void;
    loadFromJSON(json: {
        [key: string]: any;
    }, CMIElement: string | undefined, setCMIValue: (CMIElement: string, value: any) => void, isNotInitialized: () => boolean, setStartingData: (data: StringKeyMap) => void): void;
    renderCMIToJSONString(cmi: BaseCMI | StringKeyMap, sendFullCommit: boolean): string;
    renderCMIToJSONObject(cmi: BaseCMI | StringKeyMap, sendFullCommit: boolean): StringKeyMap;
    getCommitObject(terminateCommit: boolean, alwaysSendTotalTime: boolean, renderCommonCommitFields: boolean | ((commitObject: CommitObject) => boolean), renderCommitObject: (terminateCommit: boolean, includeTotalTime?: boolean) => CommitObject, renderCommitCMI: (terminateCommit: boolean, includeTotalTime?: boolean) => StringKeyMap | Array<any>, apiLogLevel: LogLevel): CommitObject | StringKeyMap | Array<any>;
}
