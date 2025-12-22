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
};
export type Responses = {
    [key: string]: ResponseType;
};
//# sourceMappingURL=response_constants.d.ts.map