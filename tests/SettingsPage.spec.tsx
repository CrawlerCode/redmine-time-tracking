import { test } from "../fixtures/chromeExtension";
import { createScreenshot } from "../screenshots/screenshot";

test("Render page", async ({ settingsPage, locale, colorScheme }) => {
  // Wait for the form to be rendered
  await settingsPage.page.waitForSelector("form");

  // Take a screenshot
  createScreenshot("settings", settingsPage.page, locale!, colorScheme!);
});
