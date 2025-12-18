import { test } from "../fixtures/chromeExtension";
import { createScreenshot } from "../screenshots/screenshot";

test("Start timer", async ({ issuesPage, locale, colorScheme }) => {
  await issuesPage.waitForIssuesToLoad();

  // Start one of the first 3 timers
  const idx = Math.min(Math.floor(Math.random() * 3), (await issuesPage.getIssuesCount()) - 1);
  await issuesPage.startTimer(idx);

  // Wait random time
  await issuesPage.page.waitForTimeout(Math.floor(Math.random() * 1000 * 5));

  // Take a screenshot
  createScreenshot("issues", issuesPage.page, locale!, colorScheme!);
});

test("Search by text", async ({ issuesPage, locale, colorScheme }) => {
  await issuesPage.waitForIssuesToLoad();

  // Search for "dynamic"
  await issuesPage.openSearch();
  await issuesPage.searchByText("dynamic");

  // Take a screenshot
  createScreenshot("issues-search", issuesPage.page, locale!, colorScheme!);
});

test("Add spent time", async ({ issuesPage, locale, colorScheme }) => {
  await issuesPage.waitForIssuesToLoad();

  await issuesPage.openSpentTimeForm();
  await issuesPage.fillSpentTimeForm();

  // Take a screenshot
  createScreenshot("issues-add-spent-time", issuesPage.page, locale!, colorScheme!);

  await issuesPage.submitSpentTimeForm();
});

test("Open issue context menu", async ({ issuesPage, locale, colorScheme }) => {
  // Open context menu on the first issue
  await issuesPage.page.click("[role=listitem][data-type='issue']", {
    button: "right",
    position: { x: 70, y: 15 },
  });

  // Wait for context menu
  await issuesPage.page.waitForSelector("[data-slot=context-menu-content]");
  await issuesPage.page.waitForTimeout(500);

  // Take a screenshot
  createScreenshot("issues-context-menu", issuesPage.page, locale!, colorScheme!);
});
