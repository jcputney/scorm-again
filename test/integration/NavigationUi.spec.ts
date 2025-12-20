import { expect, test } from "@playwright/test";

const MODULE_PATH =
  "/test/integration/modules/RuntimeBasicCalls_SCORM20043rdEdition/shared/launchpage.html";

type WrapperConfig = {
  name: string;
  path: string;
};

const wrappers: WrapperConfig[] = [
  {
    name: "ESM",
    path: "/test/integration/wrappers/scorm2004-wrapper-esm.html",
  },
  {
    name: "Cross-frame",
    path: "/test/integration/wrappers/scorm2004-wrapper-cross-frame.html",
  },
];

wrappers.forEach((wrapper) => {
  test.describe(`SCORM 2004 navigation UI (${wrapper.name})`, () => {
    test("honors default hideLmsUi directives", async ({ page }) => {
      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);

      // Wait for the sequencing API wiring to register and update the UI
      await page.waitForFunction(() => {
        const continueButton = document.querySelector<HTMLButtonElement>(
          "[data-directive='continue']",
        );
        return Boolean(continueButton && !continueButton.hidden);
      });

      const continueButton = page.locator("[data-directive='continue']");
      await expect(continueButton).toBeVisible();
      await expect(continueButton).toBeEnabled();

      const previousButton = page.locator("[data-directive='previous']");
      await expect(previousButton).toBeVisible();

      const exitAllButton = page.locator("[data-directive='exitAll']");
      await expect(exitAllButton).toBeHidden();

      const abandonAllButton = page.locator("[data-directive='abandonAll']");
      await expect(abandonAllButton).toBeHidden();

      const hideList = page.locator("#hide-directives");
      await expect(hideList).toContainText("exitAll");
      await expect(hideList).toContainText("abandonAll");

      const auxList = page.locator("#aux-resources li");
      await expect(auxList).toHaveCount(2);
      const auxItems = await auxList.allTextContents();
      expect(
        auxItems.some((text) => text.includes("help") && text.includes("urn:scorm-again:help")),
      ).toBe(true);
      expect(
        auxItems.some(
          (text) => text.includes("glossary") && text.includes("urn:scorm-again:glossary"),
        ),
      ).toBe(true);
    });
  });
});
