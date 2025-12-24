import { Activity } from "../activity";

/**
 * Enum for sequencing request types
 * These represent the various navigation requests that can be made in SCORM 2004
 */
export enum SequencingRequestType {
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
  RETRY_ALL = "retryAll",
}

/**
 * Enum for delivery request types
 */
export enum DeliveryRequestType {
  DELIVER = "deliver",
  DO_NOT_DELIVER = "doNotDeliver",
}

/**
 * Class representing the result of a sequencing process
 */
export class SequencingResult {
  public deliveryRequest: DeliveryRequestType;
  public targetActivity: Activity | null;
  public exception: string | null;
  public endSequencingSession: boolean;

  constructor(
    deliveryRequest: DeliveryRequestType = DeliveryRequestType.DO_NOT_DELIVER,
    targetActivity: Activity | null = null,
    exception: string | null = null,
    endSequencingSession: boolean = false
  ) {
    this.deliveryRequest = deliveryRequest;
    this.targetActivity = targetActivity;
    this.exception = exception;
    this.endSequencingSession = endSequencingSession;
  }
}

/**
 * Result of Flow Subprocess (SB.2.3)
 * Used internally to propagate endSequencingSession flag through flow processes
 */
export class FlowSubprocessResult {
  public identifiedActivity: Activity | null;
  public deliverable: boolean;
  public exception: string | null;
  public endSequencingSession: boolean;

  constructor(
    identifiedActivity: Activity | null,
    deliverable: boolean,
    exception: string | null = null,
    endSequencingSession: boolean = false
  ) {
    this.identifiedActivity = identifiedActivity;
    this.deliverable = deliverable;
    this.exception = exception;
    this.endSequencingSession = endSequencingSession;
  }
}

/**
 * Result of Choice Traversal Subprocess (SB.2.4)
 * Used internally to propagate exception information from choice traversal
 */
export class ChoiceTraversalResult {
  public activity: Activity | null;
  public exception: string | null;

  constructor(activity: Activity | null, exception: string | null = null) {
    this.activity = activity;
    this.exception = exception;
  }
}

/**
 * Enum for flow subprocess modes
 */
export enum FlowSubprocessMode {
  FORWARD = "forward",
  BACKWARD = "backward",
}
