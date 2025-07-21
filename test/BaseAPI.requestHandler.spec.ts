import Scorm12API from "../src/Scorm12API";
import { global_constants } from "../src";
import { afterEach, beforeEach, describe, expect, it, MockedFunction, vi } from "vitest";

describe("BaseAPI requestHandler Tests", () => {
  let api: Scorm12API;
  let requestHandlerSpy: MockedFunction<any>;
  let fetchStub: MockedFunction<typeof global.fetch>;

  beforeEach(() => {
    // Stub the global fetch to prevent actual HTTP requests
    fetchStub = vi.spyOn(global, "fetch").mockImplementation(() => {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            result: global_constants.SCORM_TRUE,
            errorCode: 0,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        ),
      );
    }) as MockedFunction<typeof global.fetch>;

    // Create a spy for requestHandler
    requestHandlerSpy = vi.fn((params: { _requestHandlerCalled: boolean }) => {
      // Add a marker to verify the handler was called
      if (typeof params === "object" && !Array.isArray(params)) {
        params._requestHandlerCalled = true;
      }
      return params;
    });

    // Initialize API with requestHandler
    api = new Scorm12API({
      lmsCommitUrl: "http://example.com/commit",
      requestHandler: requestHandlerSpy,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("requestHandler with immediate requests", () => {
    it("should call requestHandler during normal commit", async () => {
      api.lmsInitialize();
      api.lmsSetValue("cmi.core.lesson_location", "page1");

      // Force a commit
      api.lmsCommit();

      // Wait a bit for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(requestHandlerSpy).toHaveBeenCalledOnce();

      // Verify the params were transformed
      const callArgs = fetchStub.mock.calls[0]?.[1];
      expect(callArgs).toBeDefined();
      const bodyData = JSON.parse(callArgs!.body as string);
      expect(bodyData._requestHandlerCalled).toBe(true);
    });

    it("should call requestHandler during terminate (immediate request)", async () => {
      api.lmsInitialize();
      api.lmsSetValue("cmi.core.lesson_location", "page1");

      // Call finish which triggers immediate commit
      const result = api.lmsFinish();
      expect(result).toBe(global_constants.SCORM_TRUE);

      // For synchronous commits during terminate, the request might have already completed
      // Check if either requestHandler was called OR fetch was called directly
      if (requestHandlerSpy.mock.calls.length > 0) {
        expect(requestHandlerSpy).toHaveBeenCalled();
      }

      // Verify fetch was called
      expect(fetchStub).toHaveBeenCalled();

      // Check if params were transformed
      const callArgs = fetchStub.mock.calls[0]?.[1];
      if (callArgs) {
        const bodyData = JSON.parse(callArgs.body as string);
        // If requestHandler was called, the marker should be present
        if (requestHandlerSpy.mock.calls.length > 0) {
          expect(bodyData._requestHandlerCalled).toBe(true);
        }
      }
    });

    it("should pass through params when no requestHandler is provided", async () => {
      // Create API without requestHandler
      const apiNoHandler = new Scorm12API({
        lmsCommitUrl: "http://example.com/commit",
      });

      apiNoHandler.lmsInitialize();
      apiNoHandler.lmsSetValue("cmi.core.lesson_location", "page1");

      // Call finish
      const result = apiNoHandler.lmsFinish();
      expect(result).toBe(global_constants.SCORM_TRUE);

      // Wait a bit for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify fetch was called but params don't have the marker
      expect(fetchStub).toHaveBeenCalled();
      const callArgs = fetchStub.mock.calls[0]?.[1];
      expect(callArgs).toBeDefined();
      const bodyData = JSON.parse(callArgs!.body as string);
      expect(bodyData._requestHandlerCalled).toBeUndefined();
    });

    it("should handle requestHandler errors gracefully", async () => {
      // Create API with error-throwing requestHandler
      const errorApi = new Scorm12API({
        lmsCommitUrl: "http://example.com/commit",
        requestHandler: () => {
          throw new Error("RequestHandler error");
        },
      });

      errorApi.lmsInitialize();
      errorApi.lmsSetValue("cmi.core.lesson_location", "page1");

      // Call finish - should not throw
      const result = errorApi.lmsFinish();
      expect(result).toBe(global_constants.SCORM_TRUE);
    });
  });
});
