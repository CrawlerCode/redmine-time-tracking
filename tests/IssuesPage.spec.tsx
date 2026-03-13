import { expect, test } from "./fixtures/extension";

test("Issues page", async ({ page, issuesPage }) => {
  await issuesPage.waitForIssuesToLoad();

  await expect(page).toHaveScreenshot();
});

test("Start timer", async ({ page, issuesPage }) => {
  await issuesPage.waitForIssuesToLoad();

  await issuesPage.triggerTimerAction(0, "start");

  await page.clock.fastForward("01:33:07");
  await page.waitForTimeout(100);

  await expect(page).toHaveScreenshot();
});

test("Pause timer", async ({ page, issuesPage }) => {
  await issuesPage.waitForIssuesToLoad();

  await issuesPage.triggerTimerAction(2, "start");

  await page.clock.fastForward("42:00");

  await issuesPage.triggerTimerAction(2, "pause");

  await expect(page).toHaveScreenshot();
});

test("Search issues", async ({ page, issuesPage }) => {
  await issuesPage.waitForIssuesToLoad();

  await issuesPage.searchIssues("account");

  await expect(page).toHaveScreenshot();
});

test("Add spent time", async ({ page, issuesPage }) => {
  await issuesPage.waitForIssuesToLoad();

  await issuesPage.triggerTimerAction(0, "done");

  await issuesPage.fillSpentTimeForm();

  await expect(page).toHaveScreenshot();

  // await issuesPage.submitSpentTimeForm();
});

test("Open issue context menu", async ({ page, issuesPage }) => {
  await issuesPage.waitForIssuesToLoad();

  await page.click("[role=listitem][data-type='issue']", { button: "right", position: { x: 70, y: 20 } });

  await page.waitForSelector("[data-slot=context-menu-content]", { state: "visible" });

  await expect(page).toHaveScreenshot();
});

test("Open filter", async ({ page, issuesPage }) => {
  await issuesPage.waitForIssuesToLoad();

  // Open filter popover
  await page.click('[data-slot="popover-trigger"]');
  await page.waitForSelector('[data-slot="popover-content"]', { state: "visible" });

  // Select first project
  await page.click('[data-slot="combobox-chips"]');
  await page.click('[role="option"][data-slot="combobox-item"]');
  await page.keyboard.press("Escape");
  await page.waitForSelector('[data-slot="combobox-list"]', { state: "detached" });

  await expect(page).toHaveScreenshot();
});
