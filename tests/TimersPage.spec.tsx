import { test } from "../fixtures/chromeExtension";
import { TimersPage } from "../fixtures/pages/timers";
import { createScreenshot } from "../screenshots/screenshot";

test("Render page", async ({ issuesPage, locale, colorScheme }) => {
  await issuesPage.waitForIssuesToLoad();

  // Start some of the first 5 timers 3 times
  const issuesCount = await issuesPage.getIssuesCount();
  for (let i = 0; i < 3; i++) {
    const idx = Math.min(Math.floor(Math.random() * 5), issuesCount - 1);
    await issuesPage.startTimer(idx);

    // Wait random time
    await issuesPage.page.waitForTimeout(Math.floor(Math.random() * 1000 * 5));
  }

  // Go to timers page
  const timersPages = await issuesPage.goToPage(TimersPage);
  await timersPages.waitForTimersToLoad();
  await timersPages.page.waitForTimeout(500);

  // Take a screenshot
  createScreenshot("timers", timersPages.page, locale!, colorScheme!);
});
