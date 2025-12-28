import { expect, test } from "@playwright/test";
import { configureWrapper } from "./helpers/scorm-common-helpers";

const MODULE_PATH =
  "/test/integration/modules/RuntimeBasicCalls_SCORM20043rdEdition/shared/launchpage.html";

// Minimal activity tree to enable sequencing (isSequencingAvailable() returns true)
// Without this, the wrapper hides all navigation buttons for non-sequenced content
const MINIMAL_ACTIVITY_TREE = {
  id: "root",
  title: "Navigation UI Test",
  sequencingControls: { choice: true, flow: true },
  children: [
    {
      id: "sco1",
      title: "Test SCO",
      identifierref: "test_resource",
    },
  ],
};

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
      // Configure wrapper with minimal activity tree before navigation
      // This ensures isSequencingAvailable() returns true so buttons are visible
      await configureWrapper(page, {
        sequencing: {
          activityTree: MINIMAL_ACTIVITY_TREE,
        },
      });

      await page.goto(`${wrapper.path}?module=${MODULE_PATH}`);

      // Wait for the sequencing API wiring to register and update the UI
      // The wrapper applies navigation state after a 100ms setTimeout, so wait for
      // the button to be both visible (not hidden) AND enabled (sequencing available)
      await page.waitForFunction(() => {
        const continueButton = document.querySelector<HTMLButtonElement>(
          "[data-directive='continue']",
        );
        return Boolean(continueButton && !continueButton.hidden && !continueButton.disabled);
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
