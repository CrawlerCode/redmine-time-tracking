/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, chromium, type BrowserContext } from "@playwright/test";
import "dotenv/config";
import path from "path";
import { IssuesPage } from "./pages/issues";
import { SettingsPage } from "./pages/settings";
import { TimePage } from "./pages/time";
import { TimersPage } from "./pages/timers";

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  timersPages: TimersPage;
  issuesPage: IssuesPage;
  timePage: TimePage;
  settingsPage: SettingsPage;
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const pathToExtension = path.join(process.cwd(), ".output/chrome-mv3");
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
    // Setup redmine settings
    const settingsPage = await new SettingsPage(page, extensionId).goToPage(SettingsPage);
    await settingsPage.fillAndSaveRedmineSettings();

    // Go to default page
    await page.goto(`chrome-extension://${extensionId}/index.html`);

    await use(page);
  },
  timersPages: async ({ extensionId, page }, use) => {
    const timersPage = await new TimersPage(page, extensionId).goToPage(TimersPage);
    await use(timersPage);
  },
  issuesPage: async ({ extensionId, page }, use) => {
    const issuesPage = await new IssuesPage(page, extensionId).goToPage(IssuesPage);
    await use(issuesPage);
  },
  timePage: async ({ extensionId, page }, use) => {
    const timePage = await new TimePage(page, extensionId).goToPage(TimePage);
    await use(timePage);
  },
  settingsPage: async ({ extensionId, page }, use) => {
    const settingsPage = await new SettingsPage(page, extensionId).goToPage(SettingsPage);
    await use(settingsPage);
  },
});

export const expect = test.expect;
