import { describe, expect, it } from "vitest";
import { appendQueryParam } from "../../src/utilities";

describe("appendQueryParam", () => {
  it("encodes the parameter name and appends to an existing query", () => {
    expect(appendQueryParam("https://example.com/commit?token=abc", "final commit", true)).toBe(
      "https://example.com/commit?token=abc&final%20commit=true",
    );
  });

  it("inserts the query parameter before a URL fragment", () => {
    expect(appendQueryParam("https://example.com/commit#status", "final", true)).toBe(
      "https://example.com/commit?final=true#status",
    );
  });
});
