import { test } from "../fixtures/chromeExtension";
import { createScreenshot } from "../screenshots/screenshot";

test("Render page", async ({ timePage, locale, colorScheme }) => {
  await timePage.waitForTimeEntriesToLoad();

  // Take a screenshot
  createScreenshot("time", timePage.page, locale!, colorScheme!);
});
