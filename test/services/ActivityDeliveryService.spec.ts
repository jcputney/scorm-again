import { describe, expect, it, vi, beforeEach } from "vitest";
import {
  ActivityDeliveryService,
  ActivityDeliveryCallbacks,
} from "../../src/services/ActivityDeliveryService";
import { Activity } from "../../src/cmi/scorm2004/sequencing/activity";
import {
  SequencingResult,
  DeliveryRequestType,
} from "../../src/cmi/scorm2004/sequencing/sequencing_process";
import { EventService } from "../../src/services/EventService";
import { LoggingService } from "../../src/services/LoggingService";

describe("ActivityDeliveryService", () => {
  let activityDeliveryService: ActivityDeliveryService;
  let eventService: EventService;
  let loggingService: LoggingService;
  let callbacks: ActivityDeliveryCallbacks;

  beforeEach(() => {
    eventService = new EventService(() => {});
    loggingService = new LoggingService();
    callbacks = {
      onDeliverActivity: vi.fn(),
      onUnloadActivity: vi.fn(),
      onSequencingComplete: vi.fn(),
      onSequencingError: vi.fn(),
    };
    activityDeliveryService = new ActivityDeliveryService(eventService, loggingService, callbacks);
  });

  describe("constructor", () => {
    it("should initialize with provided services and callbacks", () => {
      expect(activityDeliveryService).toBeDefined();
      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBeNull();
      expect(activityDeliveryService.getPendingDelivery()).toBeNull();
    });

    it("should initialize with empty callbacks if none provided", () => {
      const service = new ActivityDeliveryService(eventService, loggingService);
      expect(service).toBeDefined();
    });
  });

  describe("processSequencingResult", () => {
    it("should handle sequencing result with exception", () => {
      const loggingErrorSpy = vi.spyOn(loggingService, "error");
      const result: SequencingResult = {
        exception: "SB.2.1-1",
        deliveryRequest: DeliveryRequestType.NO_DELIVERY,
        targetActivity: null,
      };

      activityDeliveryService.processSequencingResult(result);

      expect(loggingErrorSpy).toHaveBeenCalledWith("Sequencing error: SB.2.1-1");
      expect(callbacks.onSequencingError).toHaveBeenCalledWith("SB.2.1-1");
      expect(callbacks.onSequencingComplete).not.toHaveBeenCalled();
    });

    it("should handle sequencing result with delivery request", () => {
      const activity = new Activity("activity1", "Activity 1");
      const result: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity,
      };

      const eventProcessSpy = vi.spyOn(eventService, "processListeners");
      const loggingInfoSpy = vi.spyOn(loggingService, "info");

      activityDeliveryService.processSequencingResult(result);

      expect(loggingInfoSpy).toHaveBeenCalledWith("Delivering activity: activity1 - Activity 1");
      expect(eventProcessSpy).toHaveBeenCalledWith("ActivityDelivery", "activity1", activity);
      expect(callbacks.onDeliverActivity).toHaveBeenCalledWith(activity);
      expect(callbacks.onSequencingComplete).toHaveBeenCalledWith(result);
      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBe(activity);
      expect(activity.isActive).toBe(true);
    });

    it("should handle sequencing result with no delivery request", () => {
      const result: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.NO_DELIVERY,
        targetActivity: null,
      };

      const loggingInfoSpy = vi.spyOn(loggingService, "info");

      activityDeliveryService.processSequencingResult(result);

      expect(loggingInfoSpy).toHaveBeenCalledWith("Sequencing completed with no delivery request");
      expect(callbacks.onSequencingComplete).toHaveBeenCalledWith(result);
    });

    it("should unload previous activity when delivering a new one", () => {
      const activity1 = new Activity("activity1", "Activity 1");
      const activity2 = new Activity("activity2", "Activity 2");

      // First delivery
      const result1: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity1,
      };
      activityDeliveryService.processSequencingResult(result1);

      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBe(activity1);
      expect(activity1.isActive).toBe(true);

      // Second delivery should unload first activity
      const result2: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity2,
      };

      const eventProcessSpy = vi.spyOn(eventService, "processListeners");
      const loggingInfoSpy = vi.spyOn(loggingService, "info");

      activityDeliveryService.processSequencingResult(result2);

      expect(loggingInfoSpy).toHaveBeenCalledWith("Unloading activity: activity1 - Activity 1");
      expect(eventProcessSpy).toHaveBeenCalledWith("ActivityUnload", "activity1", activity1);
      expect(callbacks.onUnloadActivity).toHaveBeenCalledWith(activity1);
      expect(activity1.isActive).toBe(false);

      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBe(activity2);
      expect(activity2.isActive).toBe(true);
    });

    it("should not unload activity if delivering the same activity", () => {
      const activity = new Activity("activity1", "Activity 1");

      // First delivery
      const result1: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity,
      };
      activityDeliveryService.processSequencingResult(result1);

      const unloadSpy = vi.spyOn(callbacks, "onUnloadActivity");

      // Second delivery of same activity
      activityDeliveryService.processSequencingResult(result1);

      expect(unloadSpy).not.toHaveBeenCalled();
      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBe(activity);
    });
  });

  describe("getCurrentDeliveredActivity", () => {
    it("should return null when no activity is delivered", () => {
      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBeNull();
    });

    it("should return the currently delivered activity", () => {
      const activity = new Activity("activity1", "Activity 1");
      const result: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity,
      };

      activityDeliveryService.processSequencingResult(result);
      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBe(activity);
    });
  });

  describe("getPendingDelivery", () => {
    it("should return null when no delivery is pending", () => {
      expect(activityDeliveryService.getPendingDelivery()).toBeNull();
    });

    it("should return null after delivery is complete", () => {
      const activity = new Activity("activity1", "Activity 1");
      const result: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity,
      };

      activityDeliveryService.processSequencingResult(result);
      expect(activityDeliveryService.getPendingDelivery()).toBeNull();
    });
  });

  describe("updateCallbacks", () => {
    it("should update callbacks", () => {
      const newCallbacks: ActivityDeliveryCallbacks = {
        onDeliverActivity: vi.fn(),
        onSequencingError: vi.fn(),
      };

      activityDeliveryService.updateCallbacks(newCallbacks);

      const activity = new Activity("activity1", "Activity 1");
      const result: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity,
      };

      activityDeliveryService.processSequencingResult(result);

      expect(newCallbacks.onDeliverActivity).toHaveBeenCalledWith(activity);
      // Original callback should not be called since it was overridden
      expect(callbacks.onDeliverActivity).not.toHaveBeenCalled();
    });

    it("should merge with existing callbacks", () => {
      const newCallbacks: ActivityDeliveryCallbacks = {
        onDeliverActivity: vi.fn(),
      };

      activityDeliveryService.updateCallbacks(newCallbacks);

      const result: SequencingResult = {
        exception: "SB.2.1-1",
        deliveryRequest: DeliveryRequestType.NO_DELIVERY,
        targetActivity: null,
      };

      activityDeliveryService.processSequencingResult(result);

      // New callback should be used
      expect(newCallbacks.onDeliverActivity).toBeDefined();
      // Original callbacks should still work for non-overridden callbacks
      expect(callbacks.onSequencingError).toHaveBeenCalledWith("SB.2.1-1");
    });
  });

  describe("reset", () => {
    it("should reset the delivery service", () => {
      const activity = new Activity("activity1", "Activity 1");
      const result: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity,
      };

      activityDeliveryService.processSequencingResult(result);
      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBe(activity);
      expect(activity.isActive).toBe(true);

      const eventProcessSpy = vi.spyOn(eventService, "processListeners");
      const loggingInfoSpy = vi.spyOn(loggingService, "info");

      activityDeliveryService.reset();

      expect(loggingInfoSpy).toHaveBeenCalledWith("Unloading activity: activity1 - Activity 1");
      expect(eventProcessSpy).toHaveBeenCalledWith("ActivityUnload", "activity1", activity);
      expect(callbacks.onUnloadActivity).toHaveBeenCalledWith(activity);
      expect(activity.isActive).toBe(false);
      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBeNull();
      expect(activityDeliveryService.getPendingDelivery()).toBeNull();
    });

    it("should handle reset when no activity is delivered", () => {
      expect(() => {
        activityDeliveryService.reset();
      }).not.toThrow();

      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBeNull();
      expect(activityDeliveryService.getPendingDelivery()).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("should handle delivery with missing target activity", () => {
      const result: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: null,
      };

      expect(() => {
        activityDeliveryService.processSequencingResult(result);
      }).not.toThrow();

      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBeNull();
    });

    it("should handle callbacks that throw errors", () => {
      const errorCallbacks: ActivityDeliveryCallbacks = {
        onDeliverActivity: vi.fn().mockImplementation(() => {
          throw new Error("Callback error");
        }),
        onSequencingComplete: vi.fn(),
      };

      const service = new ActivityDeliveryService(eventService, loggingService, errorCallbacks);
      const activity = new Activity("activity1", "Activity 1");
      const result: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity,
      };

      expect(() => {
        service.processSequencingResult(result);
      }).toThrow("Callback error");
    });

    it("should handle activity with undefined id and title", () => {
      const activity = new Activity("", "");
      const result: SequencingResult = {
        exception: null,
        deliveryRequest: DeliveryRequestType.DELIVER,
        targetActivity: activity,
      };

      const loggingInfoSpy = vi.spyOn(loggingService, "info");

      activityDeliveryService.processSequencingResult(result);

      expect(loggingInfoSpy).toHaveBeenCalledWith("Delivering activity:  - ");
      expect(activityDeliveryService.getCurrentDeliveredActivity()).toBe(activity);
    });
  });
});
