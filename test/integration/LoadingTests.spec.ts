import { expect, test } from "@playwright/test";

/**
 * Integration test to verify all SCORM modules can load without errors
 */
test.describe("Module Loading Tests", () => {

  test("All modules should load without errors", async ({ page }) => {
    // Navigate to the dist_test.html page using the HTTP server instead of file:// protocol
    // This is necessary for ESM modules to load properly
    await page.goto(`http://localhost:3000/test/integration/dist_test.html`);

    // Wait for the page to load and the SCORM API to be initialized
    await page.waitForLoadState("networkidle");

    // Wait for the tests to complete (we'll look for a specific element)
    await page.waitForSelector("#test-summary");

    // Get all module test results
    const failedTests = await page.$$eval(".error", (elements) => elements.length);

    // Verify that no tests failed
    expect(failedTests).toBe(0);

    // For extra validation, check that we have successful tests
    const successfulTests = await page.$$eval(".success", (elements) => elements.length);
    expect(successfulTests).toBeGreaterThan(0);

    // Validate individual module loadings through test results
    const testResults = await page.evaluate(() => {
      const results = {};
      document.querySelectorAll('[id$="-result"]').forEach((element) => {
        const id = element.id;
        results[id] = element.classList.contains("success");
      });
      return results;
    });

    // Check that all results are successful
    Object.entries(testResults).forEach(([id, success]) => {
      expect(success, `Module ${id} failed to load`).toBe(true);
    });
  });
});
