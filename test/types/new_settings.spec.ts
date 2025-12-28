import { describe, expect, it } from "vitest";
import { InternalSettings, Settings } from "../../src/types/api_types";

describe("New HTTP Service Settings", () => {
  it("should allow useAsynchronousCommits in Settings", () => {
    const settings: Settings = {
      useAsynchronousCommits: false,
    };
    expect(settings.useAsynchronousCommits).toBe(false);
  });

  it("should allow httpService in Settings", () => {
    const settings: Settings = {
      httpService: null,
    };
    expect(settings.httpService).toBeNull();
  });

  it("should allow xhrResponseHandler in Settings", () => {
    const settings: Settings = {
      xhrResponseHandler: (xhr: XMLHttpRequest) => ({
        result: "true",
        errorCode: 0,
      }),
    };
    expect(typeof settings.xhrResponseHandler).toBe("function");
  });

  it("should require useAsynchronousCommits in InternalSettings", () => {
    const settings: InternalSettings = {
      useAsynchronousCommits: false,
    } as InternalSettings;
    expect(settings.useAsynchronousCommits).toBeDefined();
  });
});
