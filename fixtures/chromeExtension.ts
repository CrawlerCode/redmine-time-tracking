import { test as base, chromium, type BrowserContext, type Page } from "@playwright/test";
import "dotenv/config";
import path from "path";

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  issuesPage: Page;
  timePage: Page;
  settingsPage: Page;
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const pathToExtension = path.join(process.cwd(), "dist");
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [process.env.CI ? `--headless=new` : "", `--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`],
    });

    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2];

    await use(extensionId);
  },
  page: async ({ extensionId, page }, use) => {
    // To to settings page
    await page.goto(`chrome-extension://${extensionId}/index.html#/settings`);

    // Wait for redmine url and api key inputs
    await page.waitForSelector('[name="redmineURL"]');
    await page.waitForTimeout(100);

    // Insert redmine url and api key
    await page.fill('[name="redmineURL"]', process.env.REDMINE_URL!);
    await page.fill('[name="redmineApiKey"]', process.env.REDMINE_API_KEY!);

    // Save settings
    await page.click('[type="submit"]');

    // Wait for alert (settings saved)
    await page.waitForSelector('[role="alert"]');

    // Go to default page
    await page.goto(`chrome-extension://${extensionId}/index.html`);

    await use(page);
  },
  issuesPage: async ({ extensionId, page }, use) => {
    // Go to issues page
    await page.goto(`chrome-extension://${extensionId}/index.html?location=popup#/issues`);

    await use(page);
  },
  timePage: async ({ extensionId, page }, use) => {
    // Go to time page
    await page.goto(`chrome-extension://${extensionId}/index.html?location=popup#/time`);

    await use(page);
  },
  settingsPage: async ({ extensionId, page }, use) => {
    // Go to settings page
    await page.goto(`chrome-extension://${extensionId}/index.html?location=popup#/settings`);

    await use(page);
  },
});
export const expect = test.expect;
