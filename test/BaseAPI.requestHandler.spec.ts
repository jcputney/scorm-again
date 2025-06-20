import { expect } from "expect";
import * as sinon from "sinon";
import { Scorm12API } from "../src/Scorm12API";
import { global_constants } from "../src/constants/api_constants";

describe("BaseAPI requestHandler Tests", () => {
  let api: Scorm12API;
  let requestHandlerSpy: sinon.SinonSpy;
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    // Stub the global fetch to prevent actual HTTP requests
    fetchStub = sinon.stub(global, "fetch");
    fetchStub.resolves(
      new Response(
        JSON.stringify({
          result: global_constants.SCORM_TRUE,
          errorCode: 0,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      )
    );

    // Create a spy for requestHandler
    requestHandlerSpy = sinon.spy((params) => {
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
    sinon.restore();
  });

  describe("requestHandler with immediate requests", () => {
    it("should call requestHandler during normal commit", async () => {
      api.lmsInitialize();
      api.lmsSetValue("cmi.core.student_name", "Test Student");
      
      // Force a commit
      await api.lmsCommit();

      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(requestHandlerSpy.calledOnce).toBe(true);
      
      // Verify the params were transformed
      const callArgs = fetchStub.firstCall.args[1];
      const bodyData = JSON.parse(callArgs.body);
      expect(bodyData._requestHandlerCalled).toBe(true);
    });

    it("should call requestHandler during terminate (immediate request)", async () => {
      api.lmsInitialize();
      api.lmsSetValue("cmi.core.student_name", "Test Student");
      
      // Call finish which triggers immediate commit
      const result = api.lmsFinish();
      expect(result).toBe(global_constants.SCORM_TRUE);

      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      // requestHandler should have been called
      expect(requestHandlerSpy.called).toBe(true);
      
      // Verify the params were transformed even for immediate request
      const callArgs = fetchStub.firstCall.args[1];
      const bodyData = JSON.parse(callArgs.body);
      expect(bodyData._requestHandlerCalled).toBe(true);
    });

    it("should pass through params when no requestHandler is provided", async () => {
      // Create API without requestHandler
      const apiNoHandler = new Scorm12API({
        lmsCommitUrl: "http://example.com/commit",
      });

      apiNoHandler.lmsInitialize();
      apiNoHandler.lmsSetValue("cmi.core.student_name", "Test Student");
      
      // Call finish
      const result = apiNoHandler.lmsFinish();
      expect(result).toBe(global_constants.SCORM_TRUE);

      // Wait a bit for async operations
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify fetch was called but params don't have the marker
      expect(fetchStub.called).toBe(true);
      const callArgs = fetchStub.firstCall.args[1];
      const bodyData = JSON.parse(callArgs.body);
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
      errorApi.lmsSetValue("cmi.core.student_name", "Test Student");
      
      // Call finish - should not throw
      const result = errorApi.lmsFinish();
      expect(result).toBe(global_constants.SCORM_TRUE);
    });
  });
});