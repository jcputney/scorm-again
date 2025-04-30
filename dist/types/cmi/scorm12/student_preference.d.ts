import { BaseCMI } from "../common/base_cmi";
export declare class CMIStudentPreference extends BaseCMI {
    private readonly __children;
    constructor(student_preference_children?: string);
    private _audio;
    private _language;
    private _speed;
    private _text;
    reset(): void;
    get _children(): string;
    set _children(_children: string);
    get audio(): string;
    set audio(audio: string);
    get language(): string;
    set language(language: string);
    get speed(): string;
    set speed(speed: string);
    get text(): string;
    set text(text: string);
    toJSON(): {
        audio: string;
        language: string;
        speed: string;
        text: string;
    };
}
