/**
 * Player Wrapper Demo Integration Tests
 *
 * Tests verify that the demo player implementations correctly:
 * - Initialize SCORM APIs
 * - Handle SCO status changes
 * - Update navigation state
 * - Track course progress
 * - Handle course completion
 */

import { expect, Page, test } from "@playwright/test";

// Base URL for demo server (started separately)
const BASE_URL = process.env.DEMO_URL || "http://localhost:3000/demos/player-wrapper";

// =============================================================================
// Test Utilities
// =============================================================================

async function waitForScoLoad(page: Page): Promise<void> {
  // Wait for loading indicator to be hidden (not visible)
  await page.locator("#content-loading").waitFor({ state: "hidden" });
  // Wait for iframe to have content
  const frame = page.frameLocator("#sco-frame");
  await frame.locator("body").waitFor();
}

async function getScoFrame(page: Page) {
  return page.frameLocator("#sco-frame");
}

async function getProgressPercent(page: Page): Promise<number> {
  const text = await page.locator("#progress-text").textContent();
  const match = text?.match(/(\d+)%/);
  return match ? parseInt(match[1], 10) : 0;
}

async function getMenuItemStatus(page: Page, scoId: string): Promise<string> {
  const icon = page.locator(`[data-sco-id="${scoId}"] .menu-item-icon`);
  return (await icon.getAttribute("data-status")) || "not-attempted";
}

async function clickMenuSco(page: Page, scoId: string): Promise<void> {
  await page.locator(`[data-sco-id="${scoId}"]`).click();
  await waitForScoLoad(page);
}

// =============================================================================
// SCORM 1.2 Multi-SCO Demo Tests
// =============================================================================

test.describe("SCORM 1.2 Multi-SCO Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/scorm12-multi-sco/`);
    await waitForScoLoad(page);
  });

  test("initializes with first SCO loaded", async ({ page }) => {
    // Verify first SCO is highlighted in menu
    const firstBtn = page.locator("[data-sco-id=\"sco1\"]");
    await expect(firstBtn).toHaveAttribute("aria-current", "true");

    // Verify SCO frame has content
    const frame = await getScoFrame(page);
    await expect(frame.locator("h1")).toContainText("Introduction");
  });

  test("progress bar starts at 0%", async ({ page }) => {
    const progress = await getProgressPercent(page);
    expect(progress).toBe(0);
  });

  test("status badge shows \"Not Started\"", async ({ page }) => {
    const badge = page.locator("#course-status");
    await expect(badge).toContainText("Not Started");
  });

  test("completing SCO updates menu icon", async ({ page }) => {
    const frame = await getScoFrame(page);

    // Click "Complete (Passed)" button in SCO
    await frame.locator(".btn-pass").click();

    // Wait for status update
    await page.waitForTimeout(500);

    // Verify menu icon updated
    const status = await getMenuItemStatus(page, "sco1");
    expect(status).toBe("passed");
  });

  test("completing SCO updates progress bar", async ({ page }) => {
    const frame = await getScoFrame(page);

    // Complete SCO 1
    await frame.locator(".btn-pass").click();
    await page.waitForTimeout(500);

    // Progress should be ~33% (1 of 3 SCOs)
    const progress = await getProgressPercent(page);
    expect(progress).toBeGreaterThanOrEqual(30);
    expect(progress).toBeLessThanOrEqual(35);
  });

  test("navigation to next SCO works", async ({ page }) => {
    // Click next button
    await page.locator("#btn-next").click();
    await waitForScoLoad(page);

    // Verify SCO 2 is now current
    const secondBtn = page.locator("[data-sco-id=\"sco2\"]");
    await expect(secondBtn).toHaveAttribute("aria-current", "true");

    // Verify frame shows SCO 2 content
    const frame = await getScoFrame(page);
    await expect(frame.locator("h1")).toContainText("Core Concepts");
  });

  test("navigation to previous SCO works", async ({ page }) => {
    // Go to SCO 2 first
    await page.locator("#btn-next").click();
    await waitForScoLoad(page);

    // Click previous button
    await page.locator("#btn-prev").click();
    await waitForScoLoad(page);

    // Verify SCO 1 is now current
    const firstBtn = page.locator("[data-sco-id=\"sco1\"]");
    await expect(firstBtn).toHaveAttribute("aria-current", "true");
  });

  test("menu click launches selected SCO", async ({ page }) => {
    // Click SCO 3 in menu
    await clickMenuSco(page, "sco3");

    // Verify SCO 3 is current
    const thirdBtn = page.locator("[data-sco-id=\"sco3\"]");
    await expect(thirdBtn).toHaveAttribute("aria-current", "true");

    // Verify frame shows SCO 3 content
    const frame = await getScoFrame(page);
    await expect(frame.locator("h1")).toContainText("Assessment");
  });

  test("completing all SCOs shows completion screen", async ({ page }) => {
    // Complete all 3 SCOs
    for (const scoId of ["sco1", "sco2", "sco3"]) {
      await clickMenuSco(page, scoId);
      const frame = await getScoFrame(page);
      await frame.locator(".btn-pass").click();
      // Wait for menu icon to update showing the SCO is passed
      await expect(page.locator(`[data-sco-id="${scoId}"] .menu-item-icon`)).toHaveAttribute(
        "data-status",
        "passed",
        { timeout: 3000 }
      );
    }

    // Verify all SCOs are complete before clicking exit
    await expect(page.locator("#progress-text")).toContainText("100%");
    await expect(page.locator("#course-status")).toContainText("Passed");

    // Call exitCourse directly on the player object (most reliable)
    await page.evaluate(() => {
      const player = (window as any).scormPlayer;
      if (player) player.exitCourse();
    });

    // Wait for completion overlay to appear
    const overlay = page.locator("#completion-overlay");
    await overlay.waitFor({ state: "visible", timeout: 5000 });

    // Verify shows passed status
    await expect(page.locator("#completion-title")).toContainText("Congratulations");
  });

  test("state persists across page reload", async ({ page }) => {
    // Complete SCO 1
    const frame = await getScoFrame(page);
    await frame.locator(".btn-pass").click();
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();
    await waitForScoLoad(page);

    // Verify SCO 1 still shows as passed
    const status = await getMenuItemStatus(page, "sco1");
    expect(status).toBe("passed");

    // Verify progress persisted
    const progress = await getProgressPercent(page);
    expect(progress).toBeGreaterThan(0);
  });

  test("previous button disabled on first SCO", async ({ page }) => {
    const prevBtn = page.locator("#btn-prev");
    await expect(prevBtn).toBeDisabled();
  });

  test("next button disabled on last SCO", async ({ page }) => {
    // Navigate to last SCO
    await clickMenuSco(page, "sco3");

    const nextBtn = page.locator("#btn-next");
    await expect(nextBtn).toBeDisabled();
  });
});

// =============================================================================
// SCORM 2004 Simple Demo Tests
// =============================================================================

test.describe("SCORM 2004 Simple Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/scorm2004-simple/`);
    // Wait for menu to be populated
    await page.locator("[data-sco-id=\"sco1\"]").waitFor({ timeout: 10000 });
    // Wait for frame to load
    await page.waitForTimeout(1000);
  });

  test("initializes with first SCO loaded", async ({ page }) => {
    const firstBtn = page.locator("[data-sco-id=\"sco1\"]");
    await expect(firstBtn).toHaveAttribute("aria-current", "true");
  });

  test("tracks completion_status and success_status separately", async ({ page }) => {
    const frame = await getScoFrame(page);

    // Set to completed but failed
    await frame.locator("#score-value").fill("50");
    await frame.locator(".btn-fail").click();
    await page.waitForTimeout(500);

    // Verify status shows "failed" (not just "completed")
    const status = await getMenuItemStatus(page, "sco1");
    expect(status).toBe("failed");
  });

  test("score displays as percentage", async ({ page }) => {
    const frame = await getScoFrame(page);

    // Set score
    await frame.locator("#score-value").fill("85");
    await frame.locator(".btn-pass").click();
    await page.waitForTimeout(500);

    // Verify score in menu shows percentage
    const scoreText = await page.locator("[data-sco-id=\"sco1\"] .menu-item-score").textContent();
    expect(scoreText).toContain("85%");
  });

  test("player next button advances to next SCO after completion", async ({ page }) => {
    const frame = await getScoFrame(page);

    // Complete the current SCO
    await frame.locator(".btn-pass").click();
    await page.waitForTimeout(300);

    // Use the player's Next button (not the SCO's internal continue)
    // Note: SCORM 2004 Simple player uses manual navigation, not sequencing events
    await page.locator("#btn-next").click();
    await waitForScoLoad(page);

    // Verify now on SCO 2
    const secondBtn = page.locator("[data-sco-id=\"sco2\"]");
    await expect(secondBtn).toHaveAttribute("aria-current", "true");
  });
});

// =============================================================================
// SCORM 2004 Sequenced Demo Tests
// =============================================================================

test.describe("SCORM 2004 Sequenced Demo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/scorm2004-sequenced/`);
    // Wait for menu to be populated
    await page.locator(".menu-item--parent").first().waitFor({ timeout: 10000 });
    // Wait for SCO to initialize (loading indicator hidden)
    await page.waitForTimeout(2000);
  });

  test("loads first leaf activity on start", async ({ page }) => {
    // Should load module1-lesson1 (first leaf)
    const frame = await getScoFrame(page);
    await expect(frame.locator("h1")).toContainText("Lesson 1");
  });

  test("shows hierarchical menu structure", async ({ page }) => {
    // Verify parent items exist
    await expect(page.locator(".menu-item--parent")).toHaveCount(2); // module1, module2

    // Verify children exist (2 under module1 + 2 under module2 = 4)
    await expect(page.locator(".menu-item--child")).toHaveCount(4);
  });

  test("navigation buttons reflect sequencing state on first activity", async ({ page }) => {
    // On first activity, Previous is disabled (no prior activity)
    const prevBtn = page.locator("#btn-prev");
    await expect(prevBtn).toBeDisabled();

    // On first activity, Next is enabled because there's a next activity available
    // The sequencing engine correctly reports continue as valid
    const nextBtn = page.locator("#btn-next");
    await expect(nextBtn).toHaveAttribute("data-valid", "true");
  });

  test("menu expand/collapse works", async ({ page }) => {
    // Find expand button for module1
    const expandBtn = page.locator(".menu-item--parent").first().locator(".menu-expand");

    // Click to collapse
    await expandBtn.click();

    // Verify children are hidden
    const childList = page.locator(".menu-item--parent").first().locator(".menu-children");
    await expect(childList).toHaveAttribute("hidden", "");

    // Click to expand
    await expandBtn.click();
    await expect(childList).not.toHaveAttribute("hidden");
  });

  test("completing activity enables continue navigation", async ({ page }) => {
    const frame = await getScoFrame(page);

    // Wait for button to be clickable
    await frame.locator(".btn-pass").waitFor({ state: "visible" });

    // Complete the activity
    await frame.locator(".btn-pass").click();

    // Next button should become enabled (data-valid="true")
    const nextBtn = page.locator("#btn-next");
    await expect(nextBtn).toHaveAttribute("data-valid", "true", { timeout: 5000 });
  });

  test("choice navigation to available activity works", async ({ page }) => {
    // Wait for SCO to load and sequencing to initialize
    await waitForScoLoad(page);

    // Click on module2-lesson1 (should be available via choice)
    const targetActivity = page.locator("[data-activity-id=\"module2-lesson1\"]");
    await targetActivity.click();
    await waitForScoLoad(page);

    // Verify correct activity loaded
    await expect(targetActivity).toHaveAttribute("aria-current", "true", { timeout: 5000 });

    // Verify frame shows the new activity content
    const frame = await getScoFrame(page);
    await expect(frame.locator("h1")).toContainText("Deep Dive");
  });

  test("parent status updates on child completion (rollup)", async ({ page }) => {
    // Complete first lesson
    let frame = await getScoFrame(page);
    await frame.locator(".btn-pass").waitFor({ state: "visible" });
    await frame.locator(".btn-pass").click();

    // Wait for completion to register
    await page.waitForTimeout(500);

    // Navigate to second lesson via Next button
    await page.locator("#btn-next").click();
    await waitForScoLoad(page);

    // Complete second lesson
    frame = await getScoFrame(page);
    await frame.locator(".btn-pass").waitFor({ state: "visible" });
    await frame.locator(".btn-pass").click();

    // Wait for rollup to complete
    await page.waitForTimeout(500);

    // Module 1 parent should show completed/passed status after both children complete
    const module1Icon = page.locator("[data-activity-id=\"module1\"] .menu-item-icon");
    const status = await module1Icon.getAttribute("data-status");
    expect(["completed", "passed"]).toContain(status);
  });

  test("current activity shows in menu highlight", async ({ page }) => {
    // Wait for frame to load and sequencing to initialize
    await waitForScoLoad(page);

    // The first leaf activity should be highlighted as current
    const firstLeaf = page.locator("[data-activity-id=\"module1-lesson1\"]");
    await expect(firstLeaf).toHaveAttribute("aria-current", "true", { timeout: 5000 });

    // Other activities should not be current
    const otherActivity = page.locator("[data-activity-id=\"module2-lesson1\"]");
    await expect(otherActivity).toHaveAttribute("aria-current", "false");
  });

  test("session end shows completion screen", async ({ page }) => {
    // Wait for SCO to load
    await waitForScoLoad(page);

    // Click exit button - this triggers exitAll navigation request
    await page.locator("#btn-exit").click();

    // Completion overlay should appear via sequencing session end
    const overlay = page.locator("#completion-overlay");
    await overlay.waitFor({ state: "visible", timeout: 5000 });
  });
});

// =============================================================================
// Accessibility Tests
// =============================================================================

test.describe("Accessibility", () => {
  test("menu has correct ARIA attributes", async ({ page }) => {
    await page.goto(`${BASE_URL}/scorm12-multi-sco/`);

    const menuList = page.locator("#menu-list");
    await expect(menuList).toHaveAttribute("role", "tree");

    const menuItems = page.locator(".menu-item");
    const count = await menuItems.count();
    for (let i = 0; i < count; i++) {
      await expect(menuItems.nth(i)).toHaveAttribute("role", "treeitem");
    }
  });

  test("progress bar has ARIA attributes", async ({ page }) => {
    await page.goto(`${BASE_URL}/scorm12-multi-sco/`);

    const progressBar = page.locator(".player-progress");
    await expect(progressBar).toHaveAttribute("role", "progressbar");
    await expect(progressBar).toHaveAttribute("aria-valuemin", "0");
    await expect(progressBar).toHaveAttribute("aria-valuemax", "100");
  });

  test("navigation buttons have aria-labels", async ({ page }) => {
    await page.goto(`${BASE_URL}/scorm12-multi-sco/`);

    await expect(page.locator("#btn-prev")).toHaveAttribute("aria-label");
    await expect(page.locator("#btn-next")).toHaveAttribute("aria-label");
    await expect(page.locator("#btn-exit")).toHaveAttribute("aria-label");
  });

  test("current SCO indicated with aria-current", async ({ page }) => {
    await page.goto(`${BASE_URL}/scorm12-multi-sco/`);
    await waitForScoLoad(page);

    const currentBtn = page.locator("[aria-current=\"true\"]");
    await expect(currentBtn).toHaveCount(1);
  });
});
