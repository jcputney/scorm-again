import { Activity } from "../activity";
import { RollupProcess } from "../rollup_process";
export declare class GlobalObjectiveService {
    private globalObjectiveMap;
    private eventCallback;
    constructor(eventCallback?: (eventType: string, data?: any) => void);
    initialize(root: Activity | null): void;
    private collectObjectives;
    getMap(): Map<string, any>;
    getSnapshot(): Record<string, any>;
    restoreSnapshot(snapshot: Record<string, any>): void;
    updateObjective(objectiveId: string, objectiveData: any): void;
    synchronize(root: Activity | null, rollupProcess: RollupProcess): void;
    getObjective(objectiveId: string): any | undefined;
    hasObjective(objectiveId: string): boolean;
    getObjectiveIds(): string[];
    getObjectiveCount(): number;
    clear(): void;
    private serialize;
    private restore;
    private fireEvent;
}
//# sourceMappingURL=global_objective_service.d.ts.map