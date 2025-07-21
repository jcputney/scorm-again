import { Activity } from "../cmi/scorm2004/sequencing/activity";
import { SequencingResult } from "../cmi/scorm2004/sequencing/sequencing_process";
import { EventService } from "./EventService";
import { LoggingService } from "./LoggingService";
export interface ActivityDeliveryCallbacks {
    onDeliverActivity?: (activity: Activity) => void;
    onUnloadActivity?: (activity: Activity) => void;
    onSequencingComplete?: (result: SequencingResult) => void;
    onSequencingError?: (error: string) => void;
}
export declare class ActivityDeliveryService {
    private eventService;
    private loggingService;
    private callbacks;
    private currentDeliveredActivity;
    private pendingDelivery;
    constructor(eventService: EventService, loggingService: LoggingService, callbacks?: ActivityDeliveryCallbacks);
    processSequencingResult(result: SequencingResult): void;
    private deliverActivity;
    private unloadActivity;
    getCurrentDeliveredActivity(): Activity | null;
    getPendingDelivery(): Activity | null;
    updateCallbacks(callbacks: ActivityDeliveryCallbacks): void;
    reset(): void;
}
//# sourceMappingURL=ActivityDeliveryService.d.ts.map