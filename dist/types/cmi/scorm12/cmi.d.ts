import { BaseRootCMI } from "../common/base_cmi.js";
import { CMICore } from "./core.js";
import { CMIObjectives } from "./objectives.js";
import { CMIStudentData } from "./student_data.js";
import { CMIStudentPreference } from "./student_preference.js";
import { CMIInteractions } from "./interactions.js";
export declare class CMI extends BaseRootCMI {
    private readonly __children;
    private __version;
    private _launch_data;
    private _comments;
    private _comments_from_lms;
    constructor(cmi_children?: string, student_data?: CMIStudentData, initialized?: boolean);
    core: CMICore;
    objectives: CMIObjectives;
    student_data: CMIStudentData;
    student_preference: CMIStudentPreference;
    interactions: CMIInteractions;
    reset(): void;
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
        interactions: CMIInteractions;
    };
    get _version(): string;
    set _version(_version: string);
    get _children(): string;
    set _children(_children: string);
    get suspend_data(): string;
    set suspend_data(suspend_data: string);
    get launch_data(): string;
    set launch_data(launch_data: string);
    get comments(): string;
    set comments(comments: string);
    get comments_from_lms(): string;
    set comments_from_lms(comments_from_lms: string);
    getCurrentTotalTime(): string;
}
//# sourceMappingURL=cmi.d.ts.map