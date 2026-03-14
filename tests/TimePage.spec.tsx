import { expect, test } from "./fixtures/extension";

test("Time page", async ({ page, timePage }) => {
  await timePage.waitForTimeEntriesToLoad();

  await expect(page).toHaveScreenshot();
});

test("Open time entry context menu", async ({ page, timePage }) => {
  await timePage.waitForTimeEntriesToLoad();

  await page.click("[data-type='time-entry']", { button: "right" });
  await page.waitForSelector("[data-slot=context-menu-content]", { state: "visible" });

  await expect(page).toHaveScreenshot();
});
