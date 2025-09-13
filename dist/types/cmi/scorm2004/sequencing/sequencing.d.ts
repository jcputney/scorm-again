import { BaseCMI } from "../../common/base_cmi";
import { Activity } from "./activity";
import { ActivityTree } from "./activity_tree";
import { SequencingRules } from "./sequencing_rules";
import { SequencingControls } from "./sequencing_controls";
import { RollupRules } from "./rollup_rules";
import { ADLNav } from "../adl";
export declare class Sequencing extends BaseCMI {
    private _activityTree;
    private _sequencingRules;
    private _sequencingControls;
    private _rollupRules;
    private _adlNav;
    constructor();
    initialize(): void;
    reset(): void;
    get activityTree(): ActivityTree;
    set activityTree(activityTree: ActivityTree);
    get sequencingRules(): SequencingRules;
    set sequencingRules(sequencingRules: SequencingRules);
    get sequencingControls(): SequencingControls;
    set sequencingControls(sequencingControls: SequencingControls);
    get rollupRules(): RollupRules;
    set rollupRules(rollupRules: RollupRules);
    get adlNav(): ADLNav | null;
    set adlNav(adlNav: ADLNav | null);
    processRollup(): void;
    private _processRollupRecursive;
    getCurrentActivity(): Activity | null;
    getRootActivity(): Activity | null;
    toJSON(): object;
}
//# sourceMappingURL=sequencing.d.ts.map