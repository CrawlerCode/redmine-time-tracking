import { expect, test } from "./fixtures/extension";

test("Settings page", async ({ page, settingsPage }) => {
  await settingsPage.page.waitForSelector('[data-testid="connection-successful"]');

  await expect(page).toHaveScreenshot();
});
