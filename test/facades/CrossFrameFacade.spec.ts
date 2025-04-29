import { beforeEach, describe, expect, it, vi } from "vitest";
import { CrossFrameAPI, CrossFrameLMS, MessageData } from "../../src/facades/CrossFrameFacade";

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
      syncStub.mockImplementation((name, params) => {
        if (name === syncName) return success;
        return undefined;
      });
      const result = client[method](...args);
      expect(result).toBe(success);
    });
    it(`should handle error in ${method} and set _lastError`, () => {
      syncStub.mockImplementation((name, params) => {
        if (name === syncName) throw new Error("fail");
        return undefined;
      });
      const result = client[method](...args);
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
});
