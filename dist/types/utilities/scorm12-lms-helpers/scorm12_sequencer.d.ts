import { ScoDefinition, NavigationSuggestion, ExitAction } from "./types";
import { ScoStateTracker } from "./sco_state_tracker";
export type ScoAvailabilityFilter = (sco: ScoDefinition, tracker: ScoStateTracker) => boolean;
export declare class Scorm12Sequencer {
    private _scoList;
    private _stateTracker;
    private _scoById;
    private _availabilityFilter;
    constructor(scoList: ScoDefinition[], stateTracker: ScoStateTracker, availabilityFilter?: ScoAvailabilityFilter);
    setAvailabilityFilter(filter: ScoAvailabilityFilter): void;
    getNextSco(currentScoId: string | null): ScoDefinition | null;
    getPreviousSco(currentScoId: string): ScoDefinition | null;
    getSco(scoId: string): ScoDefinition | undefined;
    getAllScos(): ScoDefinition[];
    getAvailableScos(): ScoDefinition[];
    getIncompleteScos(): ScoDefinition[];
    hasNext(currentScoId: string): boolean;
    hasPrevious(currentScoId: string): boolean;
    isScoAvailable(scoId: string): boolean;
    processExitAction(scoId: string, exitValue: ExitAction | string): NavigationSuggestion;
    getStartingSco(): ScoDefinition | null;
    getProgress(): {
        completed: number;
        total: number;
        percentage: number;
        currentIndex: number;
    };
    private _isAvailable;
    private _getFirstAvailableSco;
    private _getFirstIncompleteSco;
    private _handleNormalExit;
    private _handleTimeOut;
}
//# sourceMappingURL=scorm12_sequencer.d.ts.map