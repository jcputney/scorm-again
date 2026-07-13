import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { global_constants } from "../../src/constants/api_constants";
import { AsynchronousHttpService } from "../../src/services/AsynchronousHttpService";
import { InternalSettings } from "../../src/types/api_types";

describe("AsynchronousHttpService commit lifecycle", () => {
  let fetchStub: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    fetchStub = vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("reports the general commit failure code when fetch rejects", async () => {
    const settings = {
      asyncModeBeaconBehavior: "never",
      commitRequestDataType: "application/json",
      fetchMode: "cors",
      requestHandler: (params: unknown) => params,
      responseHandler: async () => ({
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      }),
      xhrHeaders: {},
      xhrWithCredentials: false,
    } as InternalSettings;
    const service = new AsynchronousHttpService(settings, {
      GENERAL_COMMIT_FAILURE: 391,
    });
    const processListeners = vi.fn();
    fetchStub.mockRejectedValue(new Error("network failed"));

    service.processHttpRequest(
      "https://example.com/commit",
      { cmi: {} },
      false,
      vi.fn(),
      processListeners,
    );

    await vi.waitFor(() => {
      expect(processListeners).toHaveBeenCalledWith("CommitError", undefined, 391);
    });
  });
});
