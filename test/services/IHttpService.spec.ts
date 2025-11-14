import { describe, it, expect } from "vitest";
import { IHttpService } from "../../src/interfaces/services";
import { ResultObject } from "../../src/types/api_types";
import { global_constants } from "../../src/constants/api_constants";

describe("IHttpService Interface", () => {
  it("should define processHttpRequest with synchronous ResultObject return", () => {
    // Create a mock implementation
    const mockService: IHttpService = {
      processHttpRequest: () => ({
        result: global_constants.SCORM_TRUE,
        errorCode: 0,
      }),
      updateSettings: () => {},
    };

    const result = mockService.processHttpRequest(
      "http://test.com",
      {},
      false,
      () => {},
      () => {},
    );

    // Should return ResultObject directly, not Promise
    expect(result).toHaveProperty("result");
    expect(result).toHaveProperty("errorCode");
    expect(result.result).toBe(global_constants.SCORM_TRUE);
  });
});
