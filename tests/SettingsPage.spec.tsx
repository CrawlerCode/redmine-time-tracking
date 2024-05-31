import { test } from "../fixtures/chromeExtension";
import { createScreenshot } from "../screenshots/screenshot";

test("Render page", async ({ settingsPage: page, locale, colorScheme }) => {
  // Wait for the form to be rendered
  await page.waitForSelector("form");

  // Take a screenshot
  createScreenshot("settings", page, locale!, colorScheme!);
});
