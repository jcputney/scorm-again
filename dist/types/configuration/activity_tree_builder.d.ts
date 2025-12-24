import { Activity, ActivityObjective } from "../cmi/scorm2004/sequencing/activity";
import { ActivitySettings, ObjectiveSettings, SequencingCollectionSettings } from "../types/sequencing_types";
import { SequencingConfigurationBuilder } from "./sequencing_configuration_builder";
export declare class ActivityTreeBuilder {
    private sequencingCollections;
    private sequencingConfigBuilder;
    constructor(collections?: Record<string, SequencingCollectionSettings>, sequencingConfigBuilder?: SequencingConfigurationBuilder);
    setSequencingCollections(collections: Record<string, SequencingCollectionSettings>): void;
    createActivity(activitySettings: ActivitySettings): Activity;
    extractActivityIds(activity: Activity): string[];
    createActivityObjectiveFromSettings(objectiveSettings: ObjectiveSettings, isPrimary: boolean): ActivityObjective;
}
//# sourceMappingURL=activity_tree_builder.d.ts.map