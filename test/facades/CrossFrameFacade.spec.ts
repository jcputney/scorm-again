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
      { messageId: "42", result: "completed", error: undefined },
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
});
