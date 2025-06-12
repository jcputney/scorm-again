// test/facades/CrossFrameFacade.spec.ts
import { beforeEach, describe, expect, it, vi } from "vitest";
import CrossFrameAPI from "../../src/CrossFrameAPI";
import CrossFrameLMS from "../../src/CrossFrameLMS";
import { MessageData, MessageResponse } from "../../src/types/CrossFrame";

describe("CrossFrameAPI (cache-first)", () => {
  let client: any;
  let postSpy: any;

  beforeEach(() => {
    client = new CrossFrameAPI("https://lms.example.com");
    postSpy = vi.spyOn(window.parent, "postMessage").mockImplementation(() => {});
    // seed cache & errors
    client._cache.clear();
    client._lastError = "0";
  });

  it("LMSGetValue returns cache + posts", () => {
    client._cache.set("cmi.core.lesson_status", "incomplete");
    const v = client.LMSGetValue("cmi.core.lesson_status");
    expect(v).toBe("incomplete");
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({ method: "LMSGetValue", params: ["cmi.core.lesson_status"] }),
      "https://lms.example.com",
    );
  });

  it("LMSSetValue sync-caches and posts", () => {
    const r = client.LMSSetValue("cmi.score.raw", 95);
    expect(r).toBe("true");
    expect(client._cache.get("cmi.score.raw")).toBe("95");
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({ method: "LMSSetValue", params: ["cmi.score.raw", 95] }),
      "https://lms.example.com",
    );
  });

  it("captures error and updates lastError", async () => {
    postSpy.mockClear();
    // simulate LMS frame rejecting
    vi.spyOn(client as any, "_post").mockRejectedValue(new Error("402 Custom error"));
    client.LMSGetValue("cmi.core.lesson_status");
    await new Promise((r) => setTimeout(r, 0));
    expect(client._lastError).toBe("402");
    expect(client._cache.get("error_402")).toContain("Custom error");
  });

  it("handles timeout in _post method", async () => {
    vi.useFakeTimers();
    postSpy.mockClear();

    // Create a promise that will be rejected by the timeout
    const postPromise = (client as any)._post("LMSGetValue", ["cmi.core.lesson_status"]);

    // Fast-forward time to trigger the timeout
    vi.advanceTimersByTime(6000);

    // Verify the promise was rejected with a timeout error
    await expect(postPromise).rejects.toThrow("Timeout calling LMSGetValue");

    // Verify the pending request was removed
    expect((client as any)._pending.size).toBe(0);

    vi.useRealTimers();
  });

  it("handles _onMessage with valid response", () => {
    // Setup a pending request
    const messageId = "test-message-id";
    const resolveSpy = vi.fn();
    const rejectSpy = vi.fn();
    (client as any)._pending.set(messageId, { resolve: resolveSpy, reject: rejectSpy });

    // Create a mock message event with a successful response
    const mockEvent = {
      data: {
        messageId: messageId,
        result: "success-result",
        error: undefined,
      },
      origin: "https://lms.example.com",
      source: window.parent,
    };

    // Call _onMessage with the mock event
    (client as any)._onMessage(mockEvent);

    // Verify the resolve function was called with the result
    expect(resolveSpy).toHaveBeenCalledWith("success-result");
    expect(rejectSpy).not.toHaveBeenCalled();

    // Verify the pending request was removed
    expect((client as any)._pending.has(messageId)).toBe(false);
  });

  it("handles _onMessage with error response", () => {
    // Setup a pending request
    const messageId = "test-error-id";
    const resolveSpy = vi.fn();
    const rejectSpy = vi.fn();
    (client as any)._pending.set(messageId, { resolve: resolveSpy, reject: rejectSpy });

    // Create a mock message event with an error response
    const mockError = new Error("Test error");
    const mockEvent = {
      data: {
        messageId: messageId,
        result: undefined,
        error: mockError,
      },
      origin: "https://lms.example.com",
      source: window.parent,
    };

    // Call _onMessage with the mock event
    (client as any)._onMessage(mockEvent);

    // Verify the reject function was called with the error
    expect(rejectSpy).toHaveBeenCalledWith(mockError);
    expect(resolveSpy).not.toHaveBeenCalled();

    // Verify the pending request was removed
    expect((client as any)._pending.has(messageId)).toBe(false);
  });

  it("ignores _onMessage with invalid or unknown messageId", () => {
    // Setup a pending request
    const messageId = "test-message-id";
    const resolveSpy = vi.fn();
    const rejectSpy = vi.fn();
    (client as any)._pending.set(messageId, { resolve: resolveSpy, reject: rejectSpy });

    // Create a mock message event with an unknown messageId
    const mockEvent = {
      data: {
        messageId: "unknown-id",
        result: "success-result",
        error: undefined,
      },
      origin: "https://lms.example.com",
      source: window.parent,
    };

    // Call _onMessage with the mock event
    (client as any)._onMessage(mockEvent);

    // Verify neither function was called
    expect(resolveSpy).not.toHaveBeenCalled();
    expect(rejectSpy).not.toHaveBeenCalled();

    // Verify the pending request is still there
    expect((client as any)._pending.has(messageId)).toBe(true);

    // Test with a message event that doesn't have a messageId
    const invalidEvent = {
      data: {
        result: "success-result",
        error: undefined,
      },
      origin: "https://lms.example.com",
      source: window.parent,
    };

    // Call _onMessage with the invalid event
    (client as any)._onMessage(invalidEvent);

    // Verify neither function was called
    expect(resolveSpy).not.toHaveBeenCalled();
    expect(rejectSpy).not.toHaveBeenCalled();

    // Verify the pending request is still there
    expect((client as any)._pending.has(messageId)).toBe(true);

    // Test with a message from the wrong origin
    const wrongOriginEvent = {
      data: {
        messageId,
        result: "success-result",
        error: undefined,
      },
      origin: "https://evil.example.com",
      source: window.parent,
    };

    (client as any)._onMessage(wrongOriginEvent);

    expect(resolveSpy).not.toHaveBeenCalled();
    expect(rejectSpy).not.toHaveBeenCalled();
    expect((client as any)._pending.has(messageId)).toBe(true);

    // Test with a message from the wrong source window
    const wrongSourceEvent = {
      data: {
        messageId,
        result: "success-result",
        error: undefined,
      },
      origin: "https://lms.example.com",
      source: {} as Window,
    };

    (client as any)._onMessage(wrongSourceEvent);

    expect(resolveSpy).not.toHaveBeenCalled();
    expect(rejectSpy).not.toHaveBeenCalled();
    expect((client as any)._pending.has(messageId)).toBe(true);
  });

  it("handles Initialize/LMSInitialize calls", () => {
    // Test Initialize
    const initResult = client.Initialize();
    expect(initResult).toBe("true");
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({ method: "Initialize", params: [] }),
      "https://lms.example.com",
    );

    // Test LMSInitialize
    postSpy.mockClear();
    const lmsInitResult = client.LMSInitialize();
    expect(lmsInitResult).toBe("true");
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({ method: "LMSInitialize", params: [] }),
      "https://lms.example.com",
    );
  });

  it("handles Terminate/LMSFinish calls", () => {
    // Test Terminate
    const terminateResult = client.Terminate();
    expect(terminateResult).toBe("true");
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({ method: "Terminate", params: [] }),
      "https://lms.example.com",
    );

    // Test LMSFinish
    postSpy.mockClear();
    const lmsFinishResult = client.LMSFinish();
    expect(lmsFinishResult).toBe("true");
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({ method: "LMSFinish", params: [] }),
      "https://lms.example.com",
    );
  });

  it("handles Commit/LMSCommit calls", () => {
    // Test Commit
    const commitResult = client.Commit();
    expect(commitResult).toBe("true");
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({ method: "Commit", params: [] }),
      "https://lms.example.com",
    );

    // Test LMSCommit
    postSpy.mockClear();
    const lmsCommitResult = client.LMSCommit();
    expect(lmsCommitResult).toBe("true");
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({ method: "LMSCommit", params: [] }),
      "https://lms.example.com",
    );
  });

  it("handles GetLastError/LMSGetLastError calls", () => {
    // Set an error
    client._lastError = "101";

    // Test GetLastError
    const errorResult = client.GetLastError();
    expect(errorResult).toBe("101");

    // Test LMSGetLastError
    const lmsErrorResult = client.LMSGetLastError();
    expect(lmsErrorResult).toBe("101");
  });

  it("handles function parameters in _post method", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Call a method with a function parameter
    client.LMSSetValue("cmi.interactions.0.id", () => {});

    // Verify console.warn was called
    expect(consoleSpy).toHaveBeenCalledWith(
      "Dropping function param when posting SCORM call:",
      "LMSSetValue",
    );

    // Verify the parameter was replaced with undefined
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "LMSSetValue",
        params: ["cmi.interactions.0.id", undefined],
      }),
      "https://lms.example.com",
    );

    consoleSpy.mockRestore();
  });

  it("handles getFlattenedCMI call", async () => {
    // Mock the _post method to return a flattened CMI object
    const flattenedCMI = {
      "cmi.core.lesson_status": "incomplete",
      "cmi.core.score.raw": "80",
      "cmi.core.student_id": "12345",
    };

    vi.spyOn(client as any, "_post").mockResolvedValue(flattenedCMI);

    // Call a method that triggers getFlattenedCMI
    client.Initialize();

    // Wait for the async call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the cache was updated with the flattened CMI values
    expect(client._cache.get("cmi.core.lesson_status")).toBe("incomplete");
    expect(client._cache.get("cmi.core.score.raw")).toBe("80");
    expect(client._cache.get("cmi.core.student_id")).toBe("12345");
  });

  it("handles getFlattenedCMI error", async () => {
    // Mock the _post method to throw an error
    const mockError = new Error("500 Server error");
    vi.spyOn(client as any, "_post").mockRejectedValue(mockError);

    // Call a method that triggers getFlattenedCMI
    client.Initialize();

    // Wait for the async call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the error was captured
    expect(client._lastError).toBe("500");
    expect(client._cache.get("error_500")).toContain("Server error");
  });

  it("updates cache when GetValue resolves successfully", async () => {
    // Mock the _post method to return a value
    const postSpy = vi.spyOn(client as any, "_post").mockResolvedValue("completed");

    // Call GetValue
    client.LMSGetValue("cmi.core.lesson_status");

    // Wait for the async call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the cache was updated with the result
    expect(client._cache.get("cmi.core.lesson_status")).toBe("completed");
    expect(client._lastError).toBe("0");

    postSpy.mockRestore();
  });

  it("updates lastError when GetLastError resolves successfully", async () => {
    // Mock the _post method to return an error code
    const postSpy = vi.spyOn(client as any, "_post").mockResolvedValue("301");

    // Call GetLastError
    client.GetLastError();

    // Wait for the async call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify lastError was updated
    expect(client._lastError).toBe("301");

    postSpy.mockRestore();
  });

  it("returns empty string for unknown methods", () => {
    // Call an unknown method
    const result = client.UnknownMethod();

    // Verify it returns an empty string
    expect(result).toBe("");

    // Verify a postMessage was still sent
    expect(postSpy).toHaveBeenCalledWith(
      expect.objectContaining({ method: "UnknownMethod", params: [] }),
      "https://lms.example.com",
    );
  });

  it("handles errors without numeric codes using GENERAL error code", async () => {
    // Mock the _post method to throw an error without a numeric code
    const postSpy = vi
      .spyOn(client as any, "_post")
      .mockRejectedValue(new Error("Non-numeric error message"));

    // Call a method that will trigger the error
    client.LMSGetValue("cmi.core.lesson_status");

    // Wait for the async call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the error was captured with the GENERAL error code (101)
    expect(client._lastError).toBe("101");
    expect(client._cache.get("error_101")).toBe("Non-numeric error message");

    postSpy.mockRestore();
  });

  it("handles GetErrorString/LMSGetErrorString calls and caches error strings", async () => {
    // Mock the _post method to return an error string
    const postSpy = vi
      .spyOn(client as any, "_post")
      .mockResolvedValue("Error: Data Model Element Not Initialized");

    // Test GetErrorString
    const errorString = client.GetErrorString("403");
    expect(errorString).toBe(""); // Initial cache miss returns empty string

    // Wait for the async call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the cache was updated with the error string
    expect(client._cache.get("error_403")).toBe("Error: Data Model Element Not Initialized");

    // Test LMSGetErrorString
    postSpy.mockClear();
    const lmsErrorString = client.LMSGetErrorString("404");

    // Wait for the async call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the cache was updated
    expect(client._cache.get("error_404")).toBeDefined();

    postSpy.mockRestore();
  });

  it("handles GetDiagnostic/LMSGetDiagnostic calls and caches diagnostic info", async () => {
    // Mock the _post method to return diagnostic information
    const postSpy = vi
      .spyOn(client as any, "_post")
      .mockResolvedValue("Detailed diagnostic information for error 401");

    // Test GetDiagnostic
    const diagnostic = client.GetDiagnostic("401");
    expect(diagnostic).toBe(""); // Initial cache miss returns empty string

    // Wait for the async call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the cache was updated with the diagnostic info
    expect(client._cache.get("diag_401")).toBe("Detailed diagnostic information for error 401");

    // Test LMSGetDiagnostic
    postSpy.mockClear();
    const lmsDiagnostic = client.LMSGetDiagnostic("402");

    // Wait for the async call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify the cache was updated
    expect(client._cache.get("diag_402")).toBeDefined();

    postSpy.mockRestore();
  });

  it("returns cached error strings when available", () => {
    // Pre-populate cache with error string
    client._cache.set("error_301", "General Session Timeout");

    // Test GetErrorString with cached value
    const errorString = client.GetErrorString("301");
    expect(errorString).toBe("General Session Timeout");

    // Test LMSGetErrorString with cached value
    const lmsErrorString = client.LMSGetErrorString("301");
    expect(lmsErrorString).toBe("General Session Timeout");
  });

  it("returns cached diagnostic info when available", () => {
    // Pre-populate cache with diagnostic info
    client._cache.set("diag_101", "Detailed information about general exception");

    // Test GetDiagnostic with cached value
    const diagnostic = client.GetDiagnostic("101");
    expect(diagnostic).toBe("Detailed information about general exception");

    // Test LMSGetDiagnostic with cached value
    const lmsDiagnostic = client.LMSGetDiagnostic("101");
    expect(lmsDiagnostic).toBe("Detailed information about general exception");
  });
});

describe("CrossFrameLMS", () => {
  let apiMock: any;
  let server: any;
  let src: any;

  beforeEach(() => {
    apiMock = { LMSGetValue: vi.fn().mockReturnValue("completed") };
    server = new CrossFrameLMS(apiMock, "http://parent");
    src = { postMessage: vi.fn() };
  });

  it("processes valid call and replies", () => {
    const msg: MessageData = {
      messageId: "42",
      method: "LMSGetValue",
      params: ["cmi.core.lesson_status"],
    };
    // eslint-disable-next-line
    // @ts-ignore
    server["_process"](msg, src);
    expect(apiMock.LMSGetValue).toHaveBeenCalledWith("cmi.core.lesson_status");
    expect(src.postMessage).toHaveBeenCalledWith(
      { messageId: "42", result: "completed" },
      "http://parent",
    );
  });

  it("handles missing method with error", () => {
    const msg: MessageData = { messageId: "99", method: "foo", params: [] };
    // eslint-disable-next-line
    // @ts-ignore
    server["_process"](msg, src);
    const resp = (src.postMessage as any).mock.calls[0][0] as MessageResponse;
    expect(resp.error).toBeDefined();
    expect(resp.error!.message).toMatch(/not found/);
  });

  it("handles API method throwing an exception", () => {
    // Mock the API method to throw an error
    const errorMessage = "Test error message";
    apiMock.LMSGetValue = vi.fn().mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const msg: MessageData = {
      messageId: "42",
      method: "LMSGetValue",
      params: ["cmi.core.lesson_status"],
    };

    // eslint-disable-next-line
    // @ts-ignore
    server["_process"](msg, src);

    // Verify the error was captured and returned
    const resp = (src.postMessage as any).mock.calls[0][0] as MessageResponse;
    expect(resp.error).toBeDefined();
    expect(resp.error!.message).toBe(errorMessage);
    expect(resp.error!.stack).toBeDefined();
  });

  it("handles async API method resolving", async () => {
    apiMock.LMSGetValue = vi.fn().mockResolvedValue("asyncValue");
    const msg: MessageData = {
      messageId: "50",
      method: "LMSGetValue",
      params: ["cmi.core.lesson_status"],
    };
    // eslint-disable-next-line
    // @ts-ignore
    server["_process"](msg, src);
    await new Promise((r) => setTimeout(r, 0));
    expect(src.postMessage).toHaveBeenCalledWith(
      { messageId: "50", result: "asyncValue" },
      "http://parent",
    );
  });

  it("handles async API method rejecting", async () => {
    apiMock.LMSGetValue = vi.fn().mockRejectedValue(new Error("boom"));
    const msg: MessageData = {
      messageId: "51",
      method: "LMSGetValue",
      params: ["cmi.core.lesson_status"],
    };
    // eslint-disable-next-line
    // @ts-ignore
    server["_process"](msg, src);
    await new Promise((r) => setTimeout(r, 0));
    const resp = (src.postMessage as any).mock.calls[0][0] as MessageResponse;
    expect(resp.error).toBeDefined();
    expect(resp.error!.message).toBe("boom");
  });

  it("handles message events correctly", () => {
    // Create a spy on the _process method
    // eslint-disable-next-line
    // @ts-ignore
    const processSpy = vi.spyOn(server, "_process").mockImplementation(() => {});

    // Create a mock message event
    const mockEvent = {
      data: {
        messageId: "42",
        method: "LMSGetValue",
        params: ["cmi.core.lesson_status"],
      },
      origin: "http://parent",
      source: src,
    };

    // Call _onMessage with the mock event
    // eslint-disable-next-line
    // @ts-ignore
    server["_onMessage"](mockEvent);

    // Verify _process was called with the correct arguments
    expect(processSpy).toHaveBeenCalledWith(mockEvent.data, src);
  });

  it("ignores message events without messageId or method", () => {
    // Create a spy on the _process method
    // eslint-disable-next-line
    // @ts-ignore
    const processSpy = vi.spyOn(server, "_process").mockImplementation(() => {});

    // Create mock message events with missing fields
    const mockEventNoId = {
      data: {
        method: "LMSGetValue",
        params: ["cmi.core.lesson_status"],
      },
      origin: "http://parent",
      source: src,
    };

    const mockEventNoMethod = {
      data: {
        messageId: "42",
        params: ["cmi.core.lesson_status"],
      },
      origin: "http://parent",
      source: src,
    };

    // Call _onMessage with the mock events
    // eslint-disable-next-line
    // @ts-ignore
    server["_onMessage"](mockEventNoId);
    server["_onMessage"](mockEventNoMethod);

    // Verify _process was not called
    expect(processSpy).not.toHaveBeenCalled();
  });
});
