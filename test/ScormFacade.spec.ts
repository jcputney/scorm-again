/**
 * ScormFacade.spec.ts
 *
 * Tests for the ScormFacade class
 */

import { expect } from "expect";
import { describe, it } from "mocha";
import * as sinon from "sinon";
import { createScormFacade, IScormFacade } from "../src/facades/ScormFacade";
import { CompletionStatus, SuccessStatus } from "../src/constants/enums";

describe("ScormFacade", () => {
  describe("Factory function", () => {
    it("should create a ScormFacade instance with default settings", () => {
      const facade = createScormFacade();
      expect(facade).toBeDefined();
      expect(facade.isInitialized()).toBe(false);
    });

    it("should create a ScormFacade instance with specified API type", () => {
      const facade = createScormFacade("1.2");
      expect(facade).toBeDefined();
      expect(facade.isInitialized()).toBe(false);
    });
  });

  describe("Basic API operations", () => {
    let facade: IScormFacade;

    beforeEach(() => {
      facade = createScormFacade();
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
      const setResult = facade.setValue("cmi.completion_status", CompletionStatus.completed);
      expect(setResult).toBe(true);

      // Get the value back
      const value = facade.getValue("cmi.completion_status");
      expect(value).toBe(CompletionStatus.completed);
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
      const spy = sinon.spy(facade, "setValue");

      facade.setStatus(CompletionStatus.completed);

      expect(spy.calledWith("cmi.completion_status", CompletionStatus.completed)).toBe(true);
      spy.restore();
    });

    it("should set success status", () => {
      const spy = sinon.spy(facade, "setValue");

      facade.setSuccessStatus(SuccessStatus.passed);

      expect(spy.calledWith("cmi.success_status", SuccessStatus.passed)).toBe(true);
      spy.restore();
    });

    it("should set score", () => {
      const spy = sinon.spy(facade, "setValue");

      facade.setScore(85);

      // Should set both raw and scaled scores
      expect(spy.calledWith("cmi.score.raw", 85)).toBe(true);
      expect(spy.calledWith("cmi.score.scaled", 0.85)).toBe(true);
      spy.restore();
    });

    it("should handle scores outside the valid range", () => {
      const spy = sinon.spy(facade, "setValue");

      // Test with score > 100
      facade.setScore(120);
      expect(spy.calledWith("cmi.score.raw", 120)).toBe(true);
      expect(spy.calledWith("cmi.score.scaled", 1)).toBe(true);

      // Test with score < 0
      facade.setScore(-10);
      expect(spy.calledWith("cmi.score.raw", -10)).toBe(true);
      expect(spy.calledWith("cmi.score.scaled", 0)).toBe(true);

      spy.restore();
    });
  });

  describe("Event handling", () => {
    let facade: IScormFacade;
    let callback: sinon.SinonSpy;

    beforeEach(() => {
      facade = createScormFacade();
      callback = sinon.spy();
    });

    it("should register and trigger event listeners", () => {
      facade.on("Initialize", callback);
      facade.initialize();

      expect(callback.called).toBe(true);
    });

    it("should remove event listeners", () => {
      facade.on("Initialize", callback);
      facade.off("Initialize", callback);
      facade.initialize();

      expect(callback.called).toBe(false);
    });
  });
});
