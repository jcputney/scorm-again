import { CompletionStatus, SuccessStatus } from "../constants/enums";
export interface IActivity {
    readonly id: string;
    readonly title: string;
    readonly isVisible: boolean;
    readonly isActive: boolean;
    readonly isSuspended: boolean;
    readonly isCompleted: boolean;
    readonly completionStatus: CompletionStatus;
    readonly successStatus: SuccessStatus;
    readonly attemptCount: number;
    readonly objectiveSatisfiedStatus: boolean;
    readonly objectiveMeasureStatus: boolean;
    readonly objectiveNormalizedMeasure: number;
    readonly parent: IActivity | null;
    readonly children: IActivity[];
    readonly isHiddenFromChoice: boolean;
    readonly isAvailable: boolean;
    readonly location: string;
    readonly progressMeasure: number;
    readonly progressMeasureStatus: boolean;
}
//# sourceMappingURL=activity_types.d.ts.map