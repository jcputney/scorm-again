import { BaseCMI } from "../common/base_cmi";
export declare class CMILearner extends BaseCMI {
    private _learner_id;
    private _learner_name;
    constructor();
    get learner_id(): string;
    set learner_id(learner_id: string);
    get learner_name(): string;
    set learner_name(learner_name: string);
    reset(): void;
}
//# sourceMappingURL=learner.d.ts.map