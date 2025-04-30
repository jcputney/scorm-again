import { BaseCMI } from "../common/base_cmi";
export declare class CMILearnerPreference extends BaseCMI {
    private __children;
    private _audio_level;
    private _language;
    private _delivery_speed;
    private _audio_captioning;
    constructor();
    reset(): void;
    get _children(): string;
    set _children(_children: string);
    get audio_level(): string;
    set audio_level(audio_level: string);
    get language(): string;
    set language(language: string);
    get delivery_speed(): string;
    set delivery_speed(delivery_speed: string);
    get audio_captioning(): string;
    set audio_captioning(audio_captioning: string);
    toJSON(): {
        audio_level: string;
        language: string;
        delivery_speed: string;
        audio_captioning: string;
    };
}
