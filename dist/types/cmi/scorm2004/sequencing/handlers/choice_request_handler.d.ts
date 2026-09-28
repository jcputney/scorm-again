import { Activity } from "../activity.js";
import { ActivityTree } from "../activity_tree.js";
import { ActivityTreeQueries } from "../utils/activity_tree_queries.js";
import { ChoiceConstraintValidator } from "../validators/choice_constraint_validator.js";
import { FlowTraversalService } from "../traversal/flow_traversal_service.js";
import { SequencingResult } from "../rules/sequencing_request_types.js";
export declare class ChoiceRequestHandler {
    private activityTree;
    private constraintValidator;
    private traversalService;
    private treeQueries;
    constructor(activityTree: ActivityTree, constraintValidator: ChoiceConstraintValidator, traversalService: FlowTraversalService, treeQueries: ActivityTreeQueries);
    handleChoice(targetActivityId: string, currentActivity: Activity | null): SequencingResult;
    handleJump(targetActivityId: string): SequencingResult;
    getAvailableChoices(): Activity[];
    private choiceFlowSubprocess;
    private choiceFlowTreeTraversal;
    private enhancedChoiceTraversal;
}
//# sourceMappingURL=choice_request_handler.d.ts.map