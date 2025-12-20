import { describe, it, expect, vi } from "vitest";
import Scorm12API from "../../src/Scorm12API";
import { SynchronousHttpService } from "../../src/services/SynchronousHttpService";
import { AsynchronousHttpService } from "../../src/services/AsynchronousHttpService";

describe("BaseAPI HTTP Service Selection", () => {
  it("should use SynchronousHttpService by default", () => {
    const api = new Scorm12API();
    // Access private _httpService via reflection
    const service = (api as any)._httpService;
    expect(service).toBeInstanceOf(SynchronousHttpService);
  });

  it("should use AsynchronousHttpService when useAsynchronousCommits=true", () => {
    const api = new Scorm12API({ useAsynchronousCommits: true });
    const service = (api as any)._httpService;
    expect(service).toBeInstanceOf(AsynchronousHttpService);
  });

  it("should warn when useAsynchronousCommits=true", () => {
    const warnSpy = vi.spyOn(console, "warn");
    new Scorm12API({ useAsynchronousCommits: true });
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("WARNING: useAsynchronousCommits=true is not SCORM compliant"),
    );
    warnSpy.mockRestore();
  });

  it("should use injected httpService from settings", () => {
    const customService = new SynchronousHttpService({} as any, {} as any);
    const api = new Scorm12API({ httpService: customService });
    const service = (api as any)._httpService;
    expect(service).toBe(customService);
  });

  it("should use injected httpService from constructor", () => {
    const customService = new AsynchronousHttpService({} as any, {} as any);
    const api = new Scorm12API({}, customService);
    const service = (api as any)._httpService;
    expect(service).toBe(customService);
  });

  it("should force throttleCommits=false when useAsynchronousCommits=false", () => {
    const warnSpy = vi.spyOn(console, "warn");
    const api = new Scorm12API({
      useAsynchronousCommits: false,
      throttleCommits: true,
    });
    expect((api as any).settings.throttleCommits).toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("throttleCommits cannot be used with synchronous commits"),
    );
    warnSpy.mockRestore();
  });

  it("should allow throttleCommits=true when useAsynchronousCommits=true", () => {
    const api = new Scorm12API({
      useAsynchronousCommits: true,
      throttleCommits: true,
    });
    expect((api as any).settings.throttleCommits).toBe(true);
  });

  describe("asyncCommit backwards compatibility", () => {
    it("should enable useAsynchronousCommits and throttleCommits when asyncCommit=true", () => {
      const warnSpy = vi.spyOn(console, "warn");
      const api = new Scorm12API({ asyncCommit: true });
      expect((api as any).settings.useAsynchronousCommits).toBe(true);
      expect((api as any).settings.throttleCommits).toBe(true);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("DEPRECATED: 'asyncCommit' setting is deprecated"),
      );
      warnSpy.mockRestore();
    });

    it("should not enable async settings when asyncCommit=false", () => {
      const warnSpy = vi.spyOn(console, "warn");
      const api = new Scorm12API({ asyncCommit: false });
      expect((api as any).settings.useAsynchronousCommits).toBe(false);
      expect((api as any).settings.throttleCommits).toBe(false);
      // Should still warn about deprecation
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining("DEPRECATED: 'asyncCommit' setting is deprecated"),
      );
      warnSpy.mockRestore();
    });

    it("should prefer explicit new settings over asyncCommit", () => {
      const warnSpy = vi.spyOn(console, "warn");
      const api = new Scorm12API({
        asyncCommit: true,
        useAsynchronousCommits: false, // Explicit setting takes precedence
      });
      expect((api as any).settings.useAsynchronousCommits).toBe(false);
      // No deprecation warning when new settings are explicitly set
      expect(warnSpy).not.toHaveBeenCalledWith(expect.stringContaining("DEPRECATED"));
      warnSpy.mockRestore();
    });

    it("should use AsynchronousHttpService when asyncCommit=true", () => {
      const api = new Scorm12API({ asyncCommit: true });
      const service = (api as any)._httpService;
      expect(service).toBeInstanceOf(AsynchronousHttpService);
    });
  });
});
