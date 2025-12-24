import { Activity } from "../activity";
import { ActivityTree } from "../activity_tree";
import { ActivityTreeQueries } from "../utils/activity_tree_queries";
import { ChoiceConstraintValidator } from "../validators/choice_constraint_validator";
import { FlowTraversalService } from "../traversal/flow_traversal_service";
import { SequencingResult } from "../rules/sequencing_request_types";
export declare class ChoiceRequestHandler {
    private activityTree;
    private constraintValidator;
    private traversalService;
    private treeQueries;
    constructor(activityTree: ActivityTree, constraintValidator: ChoiceConstraintValidator, traversalService: FlowTraversalService, treeQueries: ActivityTreeQueries);
    handleChoice(targetActivityId: string, currentActivity: Activity | null): SequencingResult;
    handleJump(targetActivityId: string): SequencingResult;
    getAvailableChoices(): Activity[];
    private buildActivityPath;
    private choiceFlowSubprocess;
    private choiceFlowTreeTraversal;
    private enhancedChoiceTraversal;
    private terminateDescendentAttemptsProcess;
}
//# sourceMappingURL=choice_request_handler.d.ts.map