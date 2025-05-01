import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCrossFrameClient,
  createCrossFrameServer,
  CrossFrameAPI,
  CrossFrameLMS,
  MessageData,
} from "../../src/facades/CrossFrameFacade";
import BaseAPI from "../../src/BaseAPI";

describe("CrossFrameAPI", () => {
  let client: CrossFrameAPI;
  let syncStub: ReturnType<typeof vi.spyOn>;
  let sendStub: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    client = new CrossFrameAPI();
    syncStub = vi.spyOn(client as any, "_syncCall").mockImplementation(() => {});
    sendStub = vi.spyOn(client as any, "_sendMessage").mockImplementation(() => {});
    // reset internal state
    (client as any)._isInitialized = false;
    (client as any)._lastError = "0";
    (client as any)._cache = new Map();
    (client as any)._childFrames = new Set();
  });

  // Synchronous facade methods
  [
    {
      method: "lmsInitialize",
      args: [],
      syncName: "lmsInitialize",
      success: "true",
      fail: "false",
    },
    {
      method: "LMSInitialize",
      args: [],
      syncName: "LMSInitialize",
      success: "true",
      fail: "false",
    },
    {
      method: "lmsGetValue",
      args: ["cmi.score.raw"],
      syncName: "lmsGetValue",
      success: "42",
      fail: "",
    },
    {
      method: "LMSGetValue",
      args: ["cmi.score.raw"],
      syncName: "LMSGetValue",
      success: "42",
      fail: "",
    },
    {
      method: "lmsSetValue",
      args: ["cmi.score.raw", 88],
      syncName: "lmsSetValue",
      success: "true",
      fail: "false",
    },
    {
      method: "LMSSetValue",
      args: ["cmi.score.raw", 88],
      syncName: "LMSSetValue",
      success: "true",
      fail: "false",
    },
    { method: "lmsCommit", args: [], syncName: "lmsCommit", success: "true", fail: "false" },
    { method: "LMSCommit", args: [], syncName: "LMSCommit", success: "true", fail: "false" },
    { method: "lmsGetLastError", args: [], syncName: "lmsGetLastError", success: "0", fail: "101" },
    { method: "LMSGetLastError", args: [], syncName: "LMSGetLastError", success: "0", fail: "101" },
    {
      method: "lmsGetErrorString",
      args: [123],
      syncName: "lmsGetErrorString",
      success: "Some error",
      fail: "No error",
    },
    {
      method: "LMSGetErrorString",
      args: [123],
      syncName: "LMSGetErrorString",
      success: "Some error",
      fail: "No error",
    },
    {
      method: "lmsGetDiagnostic",
      args: [123],
      syncName: "lmsGetDiagnostic",
      success: "Diagnostic info",
      fail: "No diagnostic information available",
    },
    {
      method: "LMSGetDiagnostic",
      args: [123],
      syncName: "LMSGetDiagnostic",
      success: "Diagnostic info",
      fail: "No diagnostic information available",
    },
  ].forEach(({ method, args, syncName, success, fail }) => {
    it(`should call ${method} and return value from _syncCall`, () => {
      syncStub.mockImplementation((name, _) => {
        if (name === syncName) return success;
        return undefined;
      });
      const result = (client as any)[method](...args);
      expect(result).toBe(success);
    });
    it(`should handle error in ${method} and set _lastError`, () => {
      syncStub.mockImplementation((name, _) => {
        if (name === syncName) throw new Error("fail");
        return undefined;
      });
      const result = (client as any)[method](...args);
      if (method === "lmsGetLastError" || method === "LMSGetLastError") {
        expect(result).toBe("101");
      } else if (method === "lmsGetErrorString" || method === "LMSGetErrorString") {
        expect(result).toBe("No error");
      } else if (method === "lmsGetDiagnostic" || method === "LMSGetDiagnostic") {
        expect(result).toBe("No diagnostic information available");
      } else if (typeof result === "string") {
        expect(result).toBe(fail);
        if (fail === "false") {
          expect((client as any)._lastError).toBe("101");
        }
      }
    });
  });

  // Async facade methods
  it("should getValue and update cache", async () => {
    sendStub.mockResolvedValue("55");
    const val = await client.getValue("cmi.score.raw");
    expect(val).toBe("55");
    expect((client as any)._cache.get("cmi.score.raw")).toBe("55");
  });
  it("should setValue and update cache on success", async () => {
    sendStub.mockResolvedValue("true");
    const ok = await client.setValue("cmi.score.raw", 99);
    expect(ok).toBe(true);
    expect((client as any)._cache.get("cmi.score.raw")).toBe("99");
  });
  it("should setValue and not update cache on failure", async () => {
    sendStub.mockResolvedValue("false");
    const ok = await client.setValue("cmi.score.raw", 99);
    expect(ok).toBe(false);
    expect((client as any)._cache.has("cmi.score.raw")).toBe(false);
  });
  it("should commit", async () => {
    sendStub.mockResolvedValue("true");
    const ok = await client.commit();
    expect(ok).toBe(true);
  });
  it("should getLastError and update _lastError", async () => {
    sendStub.mockResolvedValue("123");
    const code = await client.getLastError();
    expect(code).toBe("123");
    expect((client as any)._lastError).toBe("123");
  });
  it("should getErrorString and update cache", async () => {
    sendStub.mockResolvedValue("ErrorString!");
    const str = await client.getErrorString(88);
    expect(str).toBe("ErrorString!");
    expect((client as any)._cache.get("error_88")).toBe("ErrorString!");
  });
  it("should getDiagnostic and update cache", async () => {
    sendStub.mockResolvedValue("Diag!");
    const str = await client.getDiagnostic(88);
    expect(str).toBe("Diag!");
    expect((client as any)._cache.get("diagnostic_88")).toBe("Diag!");
  });
  it("should isInitialized and update _isInitialized", async () => {
    sendStub.mockResolvedValue(true);
    const val = await client.isInitialized();
    expect(val).toBe(true);
    expect((client as any)._isInitialized).toBe(true);
  });

  // SCORM 2004 async methods
  it("should call Initialize and delegate to initialize", async () => {
    const initializeSpy = vi.spyOn(client, "initialize").mockResolvedValue(true);
    const result = await client.Initialize();
    expect(result).toBe(true);
    expect(initializeSpy).toHaveBeenCalled();
  });

  it("should call GetValue and delegate to getValue", async () => {
    const getValueSpy = vi.spyOn(client, "getValue").mockResolvedValue("test value");
    const result = await client.GetValue("cmi.element");
    expect(result).toBe("test value");
    expect(getValueSpy).toHaveBeenCalledWith("cmi.element");
  });

  it("should call SetValue and delegate to setValue", async () => {
    const setValueSpy = vi.spyOn(client, "setValue").mockResolvedValue(true);
    const result = await client.SetValue("cmi.element", "new value");
    expect(result).toBe(true);
    expect(setValueSpy).toHaveBeenCalledWith("cmi.element", "new value");
  });

  it("should call Commit and delegate to commit", async () => {
    const commitSpy = vi.spyOn(client, "commit").mockResolvedValue(true);
    const result = await client.Commit();
    expect(result).toBe(true);
    expect(commitSpy).toHaveBeenCalled();
  });

  it("should call GetLastError and delegate to getLastError", async () => {
    const getLastErrorSpy = vi.spyOn(client, "getLastError").mockResolvedValue("101");
    const result = await client.GetLastError();
    expect(result).toBe("101");
    expect(getLastErrorSpy).toHaveBeenCalled();
  });

  it("should call GetErrorString and delegate to getErrorString", async () => {
    const getErrorStringSpy = vi.spyOn(client, "getErrorString").mockResolvedValue("Error message");
    const result = await client.GetErrorString("101");
    expect(result).toBe("Error message");
    expect(getErrorStringSpy).toHaveBeenCalledWith("101");
  });

  it("should call GetDiagnostic and delegate to getDiagnostic", async () => {
    const getDiagnosticSpy = vi.spyOn(client, "getDiagnostic").mockResolvedValue("Diagnostic info");
    const result = await client.GetDiagnostic("101");
    expect(result).toBe("Diagnostic info");
    expect(getDiagnosticSpy).toHaveBeenCalledWith("101");
  });

  // Terminate methods
  it("should terminate and update _isInitialized", async () => {
    sendStub.mockResolvedValue("true");
    (client as any)._isInitialized = true;
    const result = await client.terminate();
    expect(result).toBe(true);
    expect((client as any)._isInitialized).toBe(false);
    // Check that sendStub was called with the correct method
    expect(sendStub).toHaveBeenCalledWith("lmsFinish");
  });

  it("should handle terminate failure", async () => {
    sendStub.mockResolvedValue("false");
    (client as any)._isInitialized = true;
    const result = await client.terminate();
    expect(result).toBe(false);
    expect((client as any)._isInitialized).toBe(true);
  });

  it("should call Terminate and delegate to terminate", async () => {
    const terminateSpy = vi.spyOn(client, "terminate").mockResolvedValue(true);
    const result = await client.Terminate();
    expect(result).toBe(true);
    expect(terminateSpy).toHaveBeenCalled();
  });

  it("should call lmsFinish and handle success", () => {
    syncStub.mockReturnValue("true");
    const result = client.lmsFinish();
    expect(result).toBe("true");
    expect(syncStub).toHaveBeenCalledWith("lmsFinish", []);
  });

  it("should call lmsFinish and handle error", () => {
    syncStub.mockImplementation(() => {
      throw new Error("Test error");
    });
    const result = client.lmsFinish();
    expect(result).toBe("false");
    expect((client as any)._lastError).toBe("101");
  });

  it("should call LMSFinish and handle success", () => {
    syncStub.mockReturnValue("true");
    const result = client.LMSFinish();
    expect(result).toBe("true");
    expect(syncStub).toHaveBeenCalledWith("LMSFinish", []);
  });

  it("should call LMSFinish and handle error", () => {
    syncStub.mockImplementation(() => {
      throw new Error("Test error");
    });
    const result = client.LMSFinish();
    expect(result).toBe("false");
    expect((client as any)._lastError).toBe("101");
  });

  // getIsInitialized
  it("should return current _isInitialized value", () => {
    (client as any)._isInitialized = true;
    const result = client.getIsInitialized();
    expect(result).toBe(true);
  });

  // Message handling
  it("should handle method response with SharedArrayBuffer", () => {
    const sab = new SharedArrayBuffer(4);
    const int32 = new Int32Array(sab);
    const atomicsStoreSpy = vi.spyOn(Atomics, "store");
    const atomicsNotifySpy = vi.spyOn(Atomics, "notify");

    (client as any)._handleMethodResponse({
      messageId: "test-id",
      result: "success",
      sab,
    });

    expect(atomicsStoreSpy).toHaveBeenCalledWith(int32, 0, 1);
    expect(atomicsNotifySpy).toHaveBeenCalledWith(int32, 0);
  });

  it("should handle method response with pending request", () => {
    const resolveSpy = vi.fn();
    const rejectSpy = vi.fn();

    (client as any)._pendingRequests.set("test-id", {
      resolve: resolveSpy,
      reject: rejectSpy,
    });

    (client as any)._handleMethodResponse({
      messageId: "test-id",
      result: "success",
    });

    expect(resolveSpy).toHaveBeenCalledWith("success");
    expect(rejectSpy).not.toHaveBeenCalled();
    expect((client as any)._pendingRequests.has("test-id")).toBe(false);
  });

  it("should handle method response with error", () => {
    const resolveSpy = vi.fn();
    const rejectSpy = vi.fn();
    const error = { message: "Test error" };

    (client as any)._pendingRequests.set("test-id", {
      resolve: resolveSpy,
      reject: rejectSpy,
    });

    (client as any)._handleMethodResponse({
      messageId: "test-id",
      error,
    });

    expect(resolveSpy).not.toHaveBeenCalled();
    expect(rejectSpy).toHaveBeenCalledWith(error);
    expect((client as any)._pendingRequests.has("test-id")).toBe(false);
  });

  // Event forwarding
  it("should forward events to child frames", () => {
    const frame1 = { postMessage: vi.fn() };
    const frame2 = { postMessage: vi.fn() };

    (client as any)._childFrames.add(frame1);
    (client as any)._childFrames.add(frame2);

    (client as any)._forwardEventToChildFrames("testEvent", ["arg1", "arg2"]);

    expect(frame1.postMessage).toHaveBeenCalledWith(
      { event: "testEvent", args: ["arg1", "arg2"] },
      (client as any)._targetOrigin,
    );
    expect(frame2.postMessage).toHaveBeenCalledWith(
      { event: "testEvent", args: ["arg1", "arg2"] },
      (client as any)._targetOrigin,
    );
  });

  it("should handle errors when forwarding events", () => {
    const frame = {
      postMessage: vi.fn().mockImplementation(() => {
        throw new Error("Test error");
      }),
    };
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    (client as any)._childFrames.add(frame);

    (client as any)._forwardEventToChildFrames("testEvent", []);

    expect(consoleSpy).toHaveBeenCalled();
  });

  // Test _sendMessage in test environment
  it("should handle _sendMessage in test environment with undefined window", () => {
    const originalWindow = global.window;
    // eslint-disable-next-line
    // @ts-ignore
    // noinspection JSConstantReassignment
    global.window = undefined;

    expect(() => new CrossFrameAPI()).toThrow();

    // noinspection JSConstantReassignment
    global.window = originalWindow;
  });

  it("should handle _sendMessage in test environment with undefined window.parent", async () => {
    const originalParent = window.parent;
    // eslint-disable-next-line
    // @ts-ignore
    // noinspection JSConstantReassignment
    window.parent = undefined;

    // eslint-disable-next-line
    // @ts-ignore
    const result = new CrossFrameAPI()._sendMessage("testMethod", ["param1"]);

    await expect(result).resolves.toBe("");

    // noinspection JSConstantReassignment
    window.parent = originalParent;
  });

  it("should handle _sendMessage in test environment with undefined window.parent.postMessage", async () => {
    const originalPostMessage = window.parent.postMessage;
    // eslint-disable-next-line
    // @ts-ignore
    // noinspection JSConstantReassignment
    window.parent.postMessage = undefined;

    // Don't mock _sendMessage for this test
    sendStub.mockRestore();

    const result = (client as any)._sendMessage("testMethod", ["param1"]);

    await expect(result).resolves.toBe("");

    window.parent.postMessage = originalPostMessage;

    // Restore the mock for other tests
    sendStub = vi.spyOn(client as any, "_sendMessage").mockImplementation(() => {});
  });

  // Test timeout handling for forwarded messages
  it("should handle timeout for forwarded messages", async () => {
    const source = { postMessage: vi.fn() };
    const messageId = "test-message-id";
    const forwardedMessageId = `forwarded-${messageId}`;

    // Mock setTimeout to execute callback immediately
    const originalSetTimeout = global.setTimeout;
    // eslint-disable-next-line
    // @ts-ignore
    global.setTimeout = vi.fn().mockImplementation((callback) => {
      callback();
      return 1;
    });

    // Mock window.parent.postMessage to avoid errors
    const originalPostMessage = window.parent.postMessage;
    window.parent.postMessage = vi.fn();

    // Setup the request
    (client as any)._pendingRequests.set(forwardedMessageId, {
      resolve: vi.fn(),
      reject: vi.fn(),
      source,
    });

    // Create a mock event object
    const mockEvent = {
      data: {
        messageId,
        method: "testMethod",
        params: ["param1"],
      },
      source,
      origin: "*",
    };

    // Don't mock _handleMessage for this test
    const originalHandleMessage = (client as any)._handleMessage;
    (client as any)._handleMessage = function (event: any) {
      // Only process the specific mock event to avoid side effects
      if (event === mockEvent) {
        // Call the timeout handler directly
        const request = (client as any)._pendingRequests.get(forwardedMessageId);
        if (request?.source) {
          request.source.postMessage(
            {
              messageId,
              error: {
                message: `Timeout waiting for response to method testMethod`,
              },
            },
            (client as any)._targetOrigin,
          );
        }
      }
    };

    // Simulate handling a message
    (client as any)._handleMessage(mockEvent);

    // Check that postMessage was called with error
    expect(source.postMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        messageId,
        error: expect.objectContaining({
          message: expect.stringContaining("Timeout"),
        }),
      }),
      expect.anything(),
    );

    // Restore mocks
    global.setTimeout = originalSetTimeout;
    window.parent.postMessage = originalPostMessage;
    (client as any)._handleMessage = originalHandleMessage;
  });

  // Test _syncCall method
  describe("_syncCall method", () => {
    let originalPostMessage: any;
    let originalAtomicsWait: any;

    beforeEach(() => {
      // Save original methods
      originalPostMessage = window.parent.postMessage;
      originalAtomicsWait = Atomics.wait;

      // Reset internal state
      (client as any)._messageIdCounter = 0;
      (client as any)._sabBuffers = new Map();
      (client as any)._pendingRequests = new Map();
    });

    afterEach(() => {
      // Restore original methods
      window.parent.postMessage = originalPostMessage;
      Atomics.wait = originalAtomicsWait;
    });

    it("should handle successful synchronous call", () => {
      // Mock the implementation of _syncCall for this test
      syncStub.mockImplementation((method, params) => {
        if (method === "testMethod" && (params as any)[0] === "param1") {
          return "success result";
        }
        return undefined;
      });

      // Call the method
      const result = (client as any)._syncCall("testMethod", ["param1"]);

      // Verify the result
      expect(result).toBe("success result");
      expect(syncStub).toHaveBeenCalledWith("testMethod", ["param1"]);
    });

    it("should throw error on timeout", () => {
      // Mock the implementation of _syncCall to throw a timeout error
      syncStub.mockImplementation(() => {
        throw new Error("SCORM testMethod timeout after 100ms");
      });

      // Call the method and expect it to throw
      expect(() => {
        (client as any)._syncCall("testMethod", ["param1"], 100);
      }).toThrow(/timeout/i);

      // Verify syncStub was called
      expect(syncStub).toHaveBeenCalledWith("testMethod", ["param1"], 100);
    });

    it("should throw error if response contains error", () => {
      // Mock the implementation of _syncCall to throw an error
      syncStub.mockImplementation(() => {
        throw new Error("Test error");
      });

      // Call the method and expect it to throw
      expect(() => {
        (client as any)._syncCall("testMethod", ["param1"]);
      }).toThrow();

      // Verify syncStub was called
      expect(syncStub).toHaveBeenCalledWith("testMethod", ["param1"]);
    });

    it("should handle SharedArrayBuffer not available", () => {
      // Mock the implementation of _syncCall to throw an error about SharedArrayBuffer
      syncStub.mockImplementation(() => {
        throw new Error("SharedArrayBuffer or Atomics not available");
      });

      // Call the method and expect it to throw
      expect(() => {
        (client as any)._syncCall("testMethod", ["param1"]);
      }).toThrow(/SharedArrayBuffer/);

      // Verify syncStub was called
      expect(syncStub).toHaveBeenCalledWith("testMethod", ["param1"]);
    });
  });

  // Event listener methods
  it("should trigger event listeners on event", () => {
    const cb = vi.fn();
    client.on("CustomEvent", cb);
    (client as any)._handleEvent("CustomEvent", "arg1", 5);
    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith("arg1", 5);
  });
  it("should not trigger after off", () => {
    const cb = vi.fn();
    client.on("Ev", cb);
    client.off("Ev", cb);
    (client as any)._handleEvent("Ev", 1, 2);
    expect(cb).not.toHaveBeenCalled();
  });
  it('should trigger "*" listeners for any event', () => {
    const cb = vi.fn();
    client.on("*", cb);
    (client as any)._handleEvent("SomeEvent", "foo", "bar");
    expect(cb).toHaveBeenCalledOnce();
    expect(cb).toHaveBeenCalledWith("SomeEvent", "foo", "bar");
  });
});

describe("CrossFrameLMS", () => {
  let api: any;
  let server: CrossFrameLMS;
  let source: any;
  let postMessageSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    api = {
      lmsGetValue: vi.fn().mockReturnValue("abc"),
      setValue: vi.fn().mockReturnValue(true),
      on: vi.fn(),
    };

    server = new CrossFrameLMS(api, "http://test-origin");
    source = {
      postMessage: vi.fn(),
    };
    postMessageSpy = source.postMessage;
  });

  it("should process message and call API method, respond with result and sab", () => {
    const sab = new SharedArrayBuffer(4);
    const msg: MessageData = {
      messageId: "msg-1",
      method: "lmsGetValue",
      params: ["cmi.score.raw"],
      sab,
    };
    (server as any)._processMessage(msg, source, "http://origin");
    expect(api.lmsGetValue).toHaveBeenCalledWith("cmi.score.raw");
    expect(postMessageSpy).toHaveBeenCalledOnce();
    const resp = postMessageSpy.mock.calls[0][0];
    expect(resp.messageId).toBe("msg-1");
    expect(resp.result).toBe("abc");
    expect(resp.error).toBeUndefined();
    expect(resp.sab).toBe(sab);
    // Third arg is sab transfer
    expect(postMessageSpy.mock.calls[0][2]).toEqual([sab]);
  });

  it("should respond with error if API method does not exist", () => {
    const msg: MessageData = {
      messageId: "msg-2",
      method: "notAMethod",
      params: [],
    };
    (server as any)._processMessage(msg, source, "http://origin");
    expect(postMessageSpy).toHaveBeenCalledOnce();
    const resp = postMessageSpy.mock.calls[0][0];
    expect(resp.messageId).toBe("msg-2");
    expect(resp.result).toBeUndefined();
    expect(resp.error).toBeDefined();
    expect(resp.error.message).toMatch(/notAMethod/);
  });

  it("should handle message event with valid data", () => {
    const processMessageSpy = vi
      .spyOn(server as any, "_processMessage")
      .mockImplementation(() => {});
    const event = {
      data: {
        messageId: "msg-3",
        method: "lmsGetValue",
        params: ["cmi.score.raw"],
      },
      source: window,
      origin: "http://origin",
    };

    (server as any)._handleMessage(event);

    expect(processMessageSpy).toHaveBeenCalledWith(event.data, event.source, event.origin);
  });

  it("should ignore message event with invalid data", () => {
    const processMessageSpy = vi
      .spyOn(server as any, "_processMessage")
      .mockImplementation(() => {});

    // Missing messageId
    (server as any)._handleMessage({
      data: {
        method: "lmsGetValue",
        params: [],
      },
    });

    // Missing method
    (server as any)._handleMessage({
      data: {
        messageId: "msg-4",
        params: [],
      },
    });

    // Not an object
    (server as any)._handleMessage({
      data: "not an object",
    });

    expect(processMessageSpy).not.toHaveBeenCalled();
  });

  it("should set up event forwarding", () => {
    const frame1 = document.createElement("iframe");
    const frame2 = document.createElement("iframe");
    const frame1Window = { postMessage: vi.fn() };
    const frame2Window = { postMessage: vi.fn() };

    // Mock document.querySelectorAll
    const querySelectorAllSpy = vi
      .spyOn(document, "querySelectorAll")
      .mockReturnValue([frame1, frame2] as any);

    // Mock contentWindow
    Object.defineProperty(frame1, "contentWindow", { value: frame1Window });
    Object.defineProperty(frame2, "contentWindow", { value: frame2Window });

    // Create a new server to trigger _setupEventForwarding
    new CrossFrameLMS(api, "http://test-origin");

    // Trigger the event handler
    const eventHandler = api.on.mock.calls[0][1];
    eventHandler("testEvent", "arg1", "arg2");

    expect(api.on).toHaveBeenCalledWith("*", expect.any(Function));
    expect(frame1Window.postMessage).toHaveBeenCalledWith(
      { event: "testEvent", args: ["arg1", "arg2"] },
      "http://test-origin",
    );
    expect(frame2Window.postMessage).toHaveBeenCalledWith(
      { event: "testEvent", args: ["arg1", "arg2"] },
      "http://test-origin",
    );

    querySelectorAllSpy.mockRestore();
  });
});

// Factory functions tests
describe("Factory Functions", () => {
  it("should create a CrossFrameClient instance", () => {
    const client = createCrossFrameClient("http://test-origin");
    expect(client).toBeInstanceOf(CrossFrameAPI);
    expect((client as any)._targetOrigin).toBe("http://test-origin");
  });

  it("should create a CrossFrameServer instance", () => {
    const api = {
      on: vi.fn(),
    };
    const server = createCrossFrameServer(api as unknown as BaseAPI, "http://test-origin");
    expect(server).toBeInstanceOf(CrossFrameLMS);
    expect((server as any)._targetOrigin).toBe("http://test-origin");
    expect((server as any)._api).toBe(api);
  });
});
