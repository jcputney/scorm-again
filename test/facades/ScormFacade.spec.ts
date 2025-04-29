/**
 * ScormFacade.spec.ts
 *
 * Tests for the ScormFacade class
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { createScormFacade, IScormFacade } from "../../src/facades/ScormFacade";
import { CompletionStatus, LogLevelEnum, SuccessStatus } from "../../src/constants/enums";

describe("ScormFacade", () => {
  describe("Factory function", () => {
    it("should create a ScormFacade instance with default settings", () => {
      const facade = createScormFacade("2004", { logLevel: LogLevelEnum.NONE });
      expect(facade).toBeDefined();
      expect(facade.isInitialized()).toBe(false);
    });

    it("should create a ScormFacade instance with specified API type", () => {
      const facade = createScormFacade("1.2", { logLevel: LogLevelEnum.NONE });
      expect(facade).toBeDefined();
      expect(facade.isInitialized()).toBe(false);
    });
  });

  describe("Basic API operations", () => {
    let facade: IScormFacade;

    beforeEach(() => {
      facade = createScormFacade("2004", { logLevel: LogLevelEnum.NONE });
    });

    it("should initialize the API", () => {
      const result = facade.initialize();
      expect(result).toBe(true);
      expect(facade.isInitialized()).toBe(true);
    });

    it("should terminate the API", () => {
      facade.initialize();
      const result = facade.terminate();
      expect(result).toBe(true);
      expect(facade.isInitialized()).toBe(false);
    });

    it("should get and set values", () => {
      facade.initialize();

      // Set a value
      const setResult = facade.setValue("cmi.completion_status", CompletionStatus.COMPLETED);
      expect(setResult).toBe(true);

      // Get the value back
      const value = facade.getValue("cmi.completion_status");
      expect(value).toBe(CompletionStatus.COMPLETED);
    });

    it("should commit changes", () => {
      facade.initialize();
      const result = facade.commit();
      expect(result).toBe(true);
    });

    it("should handle invalid operations", () => {
      facade.initialize();

      // Try to set a non-existent element
      const result = facade.setValue("cmi.non_existent_element", "invalid");
      expect(result).toBe(false);

      // Get error string for a known error code
      const errorString = facade.getErrorString(301); // Element not implemented
      expect(errorString).toBeTruthy();

      // Get diagnostic info for a known error code
      const diagnostic = facade.getDiagnostic(301); // Element not implemented
      expect(diagnostic).toBeTruthy();
    });
  });

  describe("Convenience methods", () => {
    let facade: IScormFacade;

    beforeEach(() => {
      facade = createScormFacade();
      facade.initialize();
    });

    it("should set completion status", () => {
      facade.setValue = vi.fn();

      facade.setStatus(CompletionStatus.COMPLETED);

      expect(facade.setValue).toHaveBeenCalledWith(
        "cmi.completion_status",
        CompletionStatus.COMPLETED,
      );
      // spy.restore() - not needed with vi.restoreAllMocks()
    });

    it("should set success status", () => {
      const spy = vi.spyOn(facade, "setValue");

      facade.setSuccessStatus(SuccessStatus.PASSED);

      expect(spy).toHaveBeenCalledWith("cmi.success_status", SuccessStatus.PASSED);
      // spy.restore() - not needed with vi.restoreAllMocks()
    });

    it("should set score", () => {
      const spy = vi.spyOn(facade, "setValue");

      facade.setScore(85);

      // Should set both raw and scaled scores
      expect(spy).toHaveBeenCalledWith("cmi.score.raw", 85);
      expect(spy).toHaveBeenCalledWith("cmi.score.scaled", 0.85);
      // spy.restore() - not needed with vi.restoreAllMocks()
    });

    it("should handle scores outside the valid range", () => {
      const spy = vi.spyOn(facade, "setValue");

      // Test with score > 100
      facade.setScore(120);
      expect(spy).toHaveBeenCalledWith("cmi.score.raw", 120);
      expect(spy).toHaveBeenCalledWith("cmi.score.scaled", 1);

      // Test with score < 0
      facade.setScore(-10);
      expect(spy).toHaveBeenCalledWith("cmi.score.raw", -10);
      expect(spy).toHaveBeenCalledWith("cmi.score.scaled", 0);

      // spy.restore() - not needed with vi.restoreAllMocks()
    });
  });

  describe("Event handling", () => {
    let facade: IScormFacade;
    const callback = vi.fn();

    beforeEach(() => {
      facade = createScormFacade();
      callback.mockReset();
    });

    it("should register and trigger event listeners", () => {
      facade.on("Initialize", callback);
      facade.initialize();

      expect(callback).toHaveBeenCalled();
    });

    it("should remove event listeners", () => {
      facade.on("Initialize", callback);
      facade.off("Initialize", callback);
      facade.initialize();

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
