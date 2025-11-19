import { expect, test } from "@playwright/test";
import { ensureApiInitialized } from "../helpers/scorm2004-helpers";

export type WrapperConfig = {
  name: string;
  path: string;
};

export type ModuleConfig = {
  path: string;
  hasSequencing?: boolean; // Whether the module has sequencing enabled
};

/**
 * SCORM 2004 Navigation test suite
 * Tests navigation requests and navigation button behavior
 *
 * Note: This function should be called within an existing test.describe block
 */
export function scorm2004NavigationTests(
  wrapper: WrapperConfig,
  module: ModuleConfig
) {
  // Tests are added to the current describe block context
  test("should handle navigation requests", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    // Test navigation request setting
    const navResults = await page.evaluate(() => {
      const results: any = {};

      // Set navigation request - use "continue" (without underscore) as per SCORM spec
      // The regex allows both "_continue" and "continue", but "continue" is the standard
      results.setContinue = window.API_1484_11.lmsSetValue(
        "adl.nav.request",
        "continue"
      );
      results.getContinue = window.API_1484_11.lmsGetValue("adl.nav.request");

      // Clear navigation request - use "_none_" instead of empty string (empty string is not valid)
      results.setNone = window.API_1484_11.lmsSetValue("adl.nav.request", "_none_");
      results.getNone = window.API_1484_11.lmsGetValue("adl.nav.request");

      // Test invalid navigation request
      results.setInvalid = window.API_1484_11.lmsSetValue(
        "adl.nav.request",
        "invalid_request"
      );
      results.getInvalidError = window.API_1484_11.lmsGetLastError();

      return results;
    });

    expect(navResults.setContinue).toBe("true");
    // The value might be stored as "continue" or "_continue" depending on implementation
    expect(["continue", "_continue"]).toContain(navResults.getContinue);
    expect(navResults.setNone).toBe("true");
    expect(navResults.getNone).toBe("_none_");
    expect(navResults.setInvalid).toBe("false");
    expect(navResults.getInvalidError).not.toBe("0");
  });

  test("should handle all navigation request types", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    const navTests = await page.evaluate(() => {
      const results: any = {};

      // Test all valid navigation requests
      results.setContinue = window.API_1484_11.lmsSetValue("adl.nav.request", "continue");
      results.getContinue = window.API_1484_11.lmsGetValue("adl.nav.request");

      results.setPrevious = window.API_1484_11.lmsSetValue("adl.nav.request", "previous");
      results.getPrevious = window.API_1484_11.lmsGetValue("adl.nav.request");

      results.setExit = window.API_1484_11.lmsSetValue("adl.nav.request", "exit");
      results.getExit = window.API_1484_11.lmsGetValue("adl.nav.request");

      results.setExitAll = window.API_1484_11.lmsSetValue("adl.nav.request", "exitAll");
      results.getExitAll = window.API_1484_11.lmsGetValue("adl.nav.request");

      results.setAbandon = window.API_1484_11.lmsSetValue("adl.nav.request", "abandon");
      results.getAbandon = window.API_1484_11.lmsGetValue("adl.nav.request");

      results.setAbandonAll = window.API_1484_11.lmsSetValue("adl.nav.request", "abandonAll");
      results.getAbandonAll = window.API_1484_11.lmsGetValue("adl.nav.request");

      results.setSuspendAll = window.API_1484_11.lmsSetValue("adl.nav.request", "suspendAll");
      results.getSuspendAll = window.API_1484_11.lmsGetValue("adl.nav.request");

      results.setNone = window.API_1484_11.lmsSetValue("adl.nav.request", "_none_");
      results.getNone = window.API_1484_11.lmsGetValue("adl.nav.request");

      return results;
    });

    // All valid navigation requests should succeed
    expect(navTests.setContinue).toBe("true");
    expect(navTests.setPrevious).toBe("true");
    expect(navTests.setExit).toBe("true");
    expect(navTests.setExitAll).toBe("true");
    expect(navTests.setAbandon).toBe("true");
    expect(navTests.setAbandonAll).toBe("true");
    expect(navTests.setSuspendAll).toBe("true");
    expect(navTests.setNone).toBe("true");

    // Values should be retrievable (may be normalized with underscores)
    expect(navTests.getNone).toBe("_none_");
  });

  test("should handle navigation button state", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    // Wait for wrapper to initialize
    await page.waitForTimeout(1000);

    const continueButton = page.locator("button[data-directive=\"continue\"]");
    const previousButton = page.locator("button[data-directive=\"previous\"]");

    if (module.hasSequencing === false) {
      // For non-sequenced modules, navigation buttons should be hidden
      const continueVisible = await continueButton.isVisible().catch(() => false);
      const previousVisible = await previousButton.isVisible().catch(() => false);

      // For non-sequenced modules, buttons should be hidden
      // (If they're visible, they should at least be disabled)
      if (continueVisible || previousVisible) {
        // If visible, they should be disabled for non-sequenced content
        const continueDisabled = await continueButton.isDisabled();
        const previousDisabled = await previousButton.isDisabled();
        expect(continueDisabled || previousDisabled).toBe(true);
      } else {
        // If hidden, that's the expected behavior for non-sequenced modules
        expect(continueVisible).toBe(false);
        expect(previousVisible).toBe(false);
      }
    } else {
      // For sequenced modules, buttons should be visible (though may be disabled based on state)
      // Just verify they exist and can be interacted with
      const continueExists = await continueButton.count();
      const previousExists = await previousButton.count();
      expect(continueExists).toBeGreaterThan(0);
      expect(previousExists).toBeGreaterThan(0);
    }
  });

  test("should handle Abandon and Suspend All buttons", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    // Wait for wrapper to initialize
    await page.waitForTimeout(1000);

    const abandonButton = page.locator("button[data-directive=\"abandon\"]");
    const suspendAllButton = page.locator("button[data-directive=\"suspendAll\"]");

    if (module.hasSequencing === false) {
      // For non-sequenced modules, these buttons should be hidden
      const abandonVisible = await abandonButton.isVisible().catch(() => false);
      const suspendAllVisible = await suspendAllButton.isVisible().catch(() => false);

      // For non-sequenced modules, navigation buttons should be hidden
      // If they're visible, they should be disabled
      if (abandonVisible || suspendAllVisible) {
        const abandonDisabled = await abandonButton.isDisabled();
        const suspendAllDisabled = await suspendAllButton.isDisabled();
        expect(abandonDisabled || suspendAllDisabled).toBe(true);
      } else {
        // Hidden is the expected behavior for non-sequenced modules
        expect(abandonVisible).toBe(false);
        expect(suspendAllVisible).toBe(false);
      }
    } else {
      // For sequenced modules, buttons should exist
      const abandonExists = await abandonButton.count();
      const suspendAllExists = await suspendAllButton.count();
      expect(abandonExists).toBeGreaterThan(0);
      expect(suspendAllExists).toBeGreaterThan(0);
    }
  });

  test("should handle hidden navigation buttons", async ({ page }) => {
    await page.goto(`${wrapper.path}?module=${module.path}`);
    await page.waitForLoadState("networkidle");

    // Ensure API is initialized
    await ensureApiInitialized(page);

    // Check that exitAll and abandonAll buttons are hidden by default
    const exitAllButton = page.locator("button[data-directive=\"exitAll\"]");
    const abandonAllButton = page.locator("button[data-directive=\"abandonAll\"]");

    // These buttons should be hidden (as per wrapper defaults)
    const exitAllHidden = await exitAllButton.evaluate((el) => {
      return el.hasAttribute("hidden") || el.classList.contains("is-hidden");
    });
    const abandonAllHidden = await abandonAllButton.evaluate((el) => {
      return el.hasAttribute("hidden") || el.classList.contains("is-hidden");
    });

    expect(exitAllHidden).toBe(true);
    expect(abandonAllHidden).toBe(true);
  });
}

