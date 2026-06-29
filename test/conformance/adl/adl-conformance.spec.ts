/**
 * ADL SCORM Layer-1 (RTE data-model) conformance suite.
 *
 * Discovers every JSON fixture under ./fixtures and replays it through the
 * shared runner. Each fixture is a clean, hand-authored port of a self-contained
 * ADL test case (provenance documented per-fixture in its `source` field and in
 * ./README.md). This suite is additive and independent of the rest of test/**.
 */
import { describe, it } from "vitest";
import { loadFixtures, runFixture } from "./runner";

describe("ADL RTE Layer-1 conformance (fixture-driven)", () => {
  const fixtures = loadFixtures();

  it("discovers at least one fixture", () => {
    if (fixtures.length === 0) {
      throw new Error("No ADL conformance fixtures were discovered under ./fixtures");
    }
  });

  for (const fixture of fixtures) {
    it(`${fixture.id} [SCORM ${fixture.scormVersion}]`, () => {
      runFixture(fixture);
    });
  }
});
