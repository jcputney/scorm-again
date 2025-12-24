import { Activity } from "../activity";
export declare enum SequencingRequestType {
    START = "start",
    RESUME_ALL = "resumeAll",
    CONTINUE = "continue",
    PREVIOUS = "previous",
    CHOICE = "choice",
    JUMP = "jump",
    EXIT = "exit",
    EXIT_PARENT = "exitParent",
    EXIT_ALL = "exitAll",
    ABANDON = "abandon",
    ABANDON_ALL = "abandonAll",
    SUSPEND_ALL = "suspendAll",
    RETRY = "retry",
    RETRY_ALL = "retryAll"
}
export declare enum DeliveryRequestType {
    DELIVER = "deliver",
    DO_NOT_DELIVER = "doNotDeliver"
}
export declare class SequencingResult {
    deliveryRequest: DeliveryRequestType;
    targetActivity: Activity | null;
    exception: string | null;
    endSequencingSession: boolean;
    constructor(deliveryRequest?: DeliveryRequestType, targetActivity?: Activity | null, exception?: string | null, endSequencingSession?: boolean);
}
export declare class FlowSubprocessResult {
    identifiedActivity: Activity | null;
    deliverable: boolean;
    exception: string | null;
    endSequencingSession: boolean;
    constructor(identifiedActivity: Activity | null, deliverable: boolean, exception?: string | null, endSequencingSession?: boolean);
}
export declare class ChoiceTraversalResult {
    activity: Activity | null;
    exception: string | null;
    constructor(activity: Activity | null, exception?: string | null);
}
export declare enum FlowSubprocessMode {
    FORWARD = "forward",
    BACKWARD = "backward"
}
//# sourceMappingURL=sequencing_request_types.d.ts.map