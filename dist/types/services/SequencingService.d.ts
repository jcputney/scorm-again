import { Activity } from "../cmi/scorm2004/sequencing/activity";
import { Sequencing } from "../cmi/scorm2004/sequencing/sequencing";
import { OverallSequencingProcess } from "../cmi/scorm2004/sequencing/overall_sequencing_process";
import { SequencingResult } from "../cmi/scorm2004/sequencing/sequencing_process";
import { IEventService, ILoggingService } from "../interfaces/services";
import { CMI } from "../cmi/scorm2004/cmi";
import { ADL } from "../cmi/scorm2004/adl";
export interface SequencingEventListeners {
    onSequencingStart?: (activity: Activity) => void;
    onSequencingEnd?: () => void;
    onActivityDelivery?: (activity: Activity) => void;
    onActivityUnload?: (activity: Activity) => void;
    onNavigationRequest?: (request: string, target?: string) => void;
    onRollupComplete?: (activity: Activity) => void;
    onSequencingError?: (error: string, context?: string) => void;
    onSequencingDebug?: (event: string, data?: any) => void;
    onActivityAttemptStart?: (activity: Activity) => void;
    onActivityAttemptEnd?: (activity: Activity) => void;
    onLimitConditionCheck?: (activity: Activity, result: boolean) => void;
    onNavigationValidityUpdate?: (validity: any) => void;
    onSequencingStateChange?: (state: any) => void;
}
export interface SequencingConfiguration {
    autoRollupOnCMIChange?: boolean;
    autoProgressOnCompletion?: boolean;
    validateNavigationRequests?: boolean;
    enableEventSystem?: boolean;
    logLevel?: "debug" | "info" | "warn" | "error";
    now?: () => Date;
    getAttemptElapsedSeconds?: (activity: Activity) => number;
    getActivityElapsedSeconds?: (activity: Activity) => number;
}
export declare class SequencingService {
    private sequencing;
    private cmi;
    private adl;
    private eventService;
    private loggingService;
    private activityDeliveryService;
    private rollupProcess;
    private overallSequencingProcess;
    private sequencingProcess;
    private eventListeners;
    private configuration;
    private isInitialized;
    private isSequencingActive;
    private lastCMIValues;
    private lastSequencingResult;
    constructor(sequencing: Sequencing, cmi: CMI, adl: ADL, eventService: IEventService, loggingService: ILoggingService, configuration?: SequencingConfiguration);
    initialize(): string;
    terminate(): string;
    processNavigationRequest(request: string, targetActivityId?: string): boolean;
    triggerRollupOnCMIChange(cmiElement: string, oldValue: any, newValue: any): void;
    setEventListeners(listeners: SequencingEventListeners): void;
    updateConfiguration(config: Partial<SequencingConfiguration>): void;
    getSequencingState(): {
        isInitialized: boolean;
        isActive: boolean;
        currentActivity: Activity | null;
        rootActivity: Activity | null;
        lastSequencingResult: SequencingResult | null;
    };
    getOverallSequencingProcess(): OverallSequencingProcess | null;
    private setupCMIChangeWatchers;
    private initializeCMITracking;
    private shouldAutoStartSequencing;
    private startSequencing;
    private endSequencing;
    private triggerFinalRollup;
    private updateActivityFromCMI;
    private parseNavigationRequest;
    private handleActivityDelivery;
    private handleActivityUnload;
    private handleSequencingComplete;
    private handleSequencingError;
    private fireEvent;
    private fireDebugEvent;
    fireActivityAttemptStart(activity: Activity): void;
    fireActivityAttemptEnd(activity: Activity): void;
    fireLimitConditionCheck(activity: Activity, result: boolean): void;
    fireNavigationValidityUpdate(validity: any): void;
    fireSequencingStateChange(state: any): void;
    private handleSequencingProcessEvent;
    private log;
}
//# sourceMappingURL=SequencingService.d.ts.map