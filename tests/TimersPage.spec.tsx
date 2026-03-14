import { expect, test } from "./fixtures/extension";

test.beforeEach(async ({ page, issuesPage }) => {
  await issuesPage.waitForIssuesToLoad();

  // Start some timers
  await issuesPage.triggerTimerAction(0, "start");
  await page.clock.fastForward("01:33:07");

  await issuesPage.triggerTimerAction(2, "start");
  await page.clock.fastForward("42:00");

  await issuesPage.triggerTimerAction(7, "start");
  await page.clock.fastForward("00:12:34");

  await issuesPage.goTo("/timers");
});

test("Timers page", async ({ page, timersPage }) => {
  await timersPage.waitForTimersToLoad();

  await expect(page).toHaveScreenshot();
});

test("Open timer context menu", async ({ page, timersPage }) => {
  await timersPage.waitForTimersToLoad();

  // Open context menu on the first timer
  await page.click("[data-type='timer-card']", { button: "right", position: { x: 70, y: 20 } });
  await page.waitForSelector("[data-slot=context-menu-content]", { state: "visible" });

  await expect(page).toHaveScreenshot();
});

test("Search timer", async ({ page, timersPage }) => {
  await timersPage.waitForTimersToLoad();

  await timersPage.searchTimers("");

  await expect(page).toHaveScreenshot();
});

test("Open done button", async ({ page, timersPage }) => {
  await timersPage.waitForTimersToLoad();

  // Click the done button on the first timer to open the create time entry form
  await page.locator("[data-type='timer']").first().locator("[role='button'][data-action='timer-done']").click();
  await page.waitForSelector("[role=dialog]");

  await expect(page).toHaveScreenshot();
});
