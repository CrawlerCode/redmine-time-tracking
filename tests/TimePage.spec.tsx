import { test } from "../fixtures/chromeExtension";
import { createScreenshot } from "../screenshots/screenshot";

test("Render page", async ({ timePage: page, locale, colorScheme }) => {
  // Wait for the first time entry to be rendered
  await page.waitForSelector("[data-type='time-entry']");

  // Take a screenshot
  createScreenshot("time", page, locale!, colorScheme!);
});
