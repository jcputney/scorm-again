import { CMIArray } from "../common/array";
import { CMIStudentPreference } from "../scorm12/student_preference";
export declare class AICCStudentPreferences extends CMIStudentPreference {
    constructor();
    windows: CMIArray;
    initialize(): void;
    private _lesson_type;
    private _text_color;
    private _text_location;
    private _text_size;
    private _video;
    get lesson_type(): string;
    set lesson_type(lesson_type: string);
    get text_color(): string;
    set text_color(text_color: string);
    get text_location(): string;
    set text_location(text_location: string);
    get text_size(): string;
    set text_size(text_size: string);
    get video(): string;
    set video(video: string);
    toJSON(): {
        audio: string;
        language: string;
        lesson_type: string;
        speed: string;
        text: string;
        text_color: string;
        text_location: string;
        text_size: string;
        video: string;
        windows: CMIArray;
    };
}
