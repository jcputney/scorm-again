export declare const LearnerResponses: Responses;
export declare const CorrectResponses: Responses;
export type ResponseType = {
    format: string;
    max: number;
    delimiter: string;
    unique: boolean;
    duplicate?: boolean;
    format2?: string;
    delimiter2?: string;
    limit?: number;
    delimiter3?: string;
};
export type Responses = {
    [key: string]: ResponseType;
};
