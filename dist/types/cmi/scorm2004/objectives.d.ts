import { CMIArray } from "../common/array";
import { BaseCMI } from "../common/base_cmi";
import { Scorm2004CMIScore } from "./score";
export declare class CMIObjectives extends CMIArray {
    constructor();
    findObjectiveById(id: string): CMIObjectivesObject | undefined;
    findObjectiveByIndex(index: number): CMIObjectivesObject;
    setObjectiveByIndex(index: number, objective: CMIObjectivesObject): void;
}
export declare class CMIObjectivesObject extends BaseCMI {
    private _id;
    private _success_status;
    private _completion_status;
    private _progress_measure;
    private _description;
    constructor();
    reset(): void;
    score: Scorm2004CMIScore;
    initialize(): void;
    get id(): string;
    set id(id: string);
    get success_status(): string;
    set success_status(success_status: string);
    get completion_status(): string;
    set completion_status(completion_status: string);
    get progress_measure(): string;
    set progress_measure(progress_measure: string);
    get description(): string;
    set description(description: string);
    toJSON(): {
        id: string;
        success_status: string;
        completion_status: string;
        progress_measure: string;
        description: string;
        score: Scorm2004CMIScore;
    };
}
