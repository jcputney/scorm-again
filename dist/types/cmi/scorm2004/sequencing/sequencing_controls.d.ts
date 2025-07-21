import { BaseCMI } from "../../common/base_cmi";
export declare enum SelectionTiming {
    NEVER = "never",
    ONCE = "once",
    ON_EACH_NEW_ATTEMPT = "onEachNewAttempt"
}
export declare enum RandomizationTiming {
    NEVER = "never",
    ONCE = "once",
    ON_EACH_NEW_ATTEMPT = "onEachNewAttempt"
}
export declare class SequencingControls extends BaseCMI {
    private _enabled;
    private _choice;
    private _choiceExit;
    private _flow;
    private _forwardOnly;
    private _useCurrentAttemptObjectiveInfo;
    private _useCurrentAttemptProgressInfo;
    private _preventActivation;
    private _constrainChoice;
    private _rollupObjectiveSatisfied;
    private _rollupProgressCompletion;
    private _objectiveMeasureWeight;
    private _selectionTiming;
    private _selectCount;
    private _selectionCountStatus;
    private _randomizeChildren;
    private _randomizationTiming;
    private _reorderChildren;
    constructor();
    reset(): void;
    get enabled(): boolean;
    set enabled(enabled: boolean);
    get choice(): boolean;
    set choice(choice: boolean);
    get choiceExit(): boolean;
    set choiceExit(choiceExit: boolean);
    get flow(): boolean;
    set flow(flow: boolean);
    get forwardOnly(): boolean;
    set forwardOnly(forwardOnly: boolean);
    get useCurrentAttemptObjectiveInfo(): boolean;
    set useCurrentAttemptObjectiveInfo(useCurrentAttemptObjectiveInfo: boolean);
    get useCurrentAttemptProgressInfo(): boolean;
    set useCurrentAttemptProgressInfo(useCurrentAttemptProgressInfo: boolean);
    get preventActivation(): boolean;
    set preventActivation(preventActivation: boolean);
    get constrainChoice(): boolean;
    set constrainChoice(constrainChoice: boolean);
    get rollupObjectiveSatisfied(): boolean;
    set rollupObjectiveSatisfied(rollupObjectiveSatisfied: boolean);
    get rollupProgressCompletion(): boolean;
    set rollupProgressCompletion(rollupProgressCompletion: boolean);
    get objectiveMeasureWeight(): number;
    set objectiveMeasureWeight(objectiveMeasureWeight: number);
    isChoiceNavigationAllowed(): boolean;
    isFlowNavigationAllowed(): boolean;
    isForwardNavigationAllowed(): boolean;
    isBackwardNavigationAllowed(): boolean;
    get selectionTiming(): SelectionTiming;
    set selectionTiming(selectionTiming: SelectionTiming);
    get selectCount(): number | null;
    set selectCount(selectCount: number | null);
    get selectionCountStatus(): boolean;
    set selectionCountStatus(selectionCountStatus: boolean);
    get randomizeChildren(): boolean;
    set randomizeChildren(randomizeChildren: boolean);
    get randomizationTiming(): RandomizationTiming;
    set randomizationTiming(randomizationTiming: RandomizationTiming);
    get reorderChildren(): boolean;
    set reorderChildren(reorderChildren: boolean);
    toJSON(): object;
}
//# sourceMappingURL=sequencing_controls.d.ts.map