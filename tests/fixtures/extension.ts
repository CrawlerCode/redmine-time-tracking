/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, chromium, type BrowserContext } from "@playwright/test";
import path from "path";
import { ExtensionPage } from "./pages/base";
import type { IssuesPage } from "./pages/issues";
import type { SettingsPage } from "./pages/settings";
import type { TimePage } from "./pages/time";
import type { TimersPage } from "./pages/timers";

import dotenv from "dotenv";
dotenv.config({ path: "tests/.env.test", quiet: true });

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
  extensionURL: string;
  extensionPage: ExtensionPage;
  timersPage: TimersPage;
  issuesPage: IssuesPage;
  timePage: TimePage;
  settingsPage: SettingsPage;
}>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    const pathToExtension = path.join(process.cwd(), ".output/chrome-mv3");
    const context = await chromium.launchPersistentContext("", {
      headless: false,
      args: [`--disable-extensions-except=${pathToExtension}`, `--load-extension=${pathToExtension}`, `--hide-scrollbars`],
    });

    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent("serviceworker");

    const extensionId = background.url().split("/")[2]!;

    await use(extensionId);
  },
  extensionURL: async ({ extensionId }, use) => {
    await use(`chrome-extension://${extensionId}/index.html`);
  },
  extensionPage: async ({ extensionURL, page }, use) => {
    // Freeze the time to a fixed point
    await page.clock.install({ time: new Date(process.env.TESTING_FREEZE_TIME!) });

    const extensionPage = new ExtensionPage(page, extensionURL, "/");

    // Setup redmine settings
    const settingsPage = await extensionPage.goTo("/settings");
    await settingsPage.fillAndSaveRedmineSettings();

    // Go to default page
    await extensionPage.goTo("/");

    await use(extensionPage);
  },
  timersPage: async ({ extensionPage }, use) => {
    const timersPage = await extensionPage.goTo("/timers");
    await use(timersPage);
  },
  issuesPage: async ({ extensionPage }, use) => {
    const issuesPage = await extensionPage.goTo("/issues");
    await use(issuesPage);
  },
  timePage: async ({ extensionPage }, use) => {
    const timePage = await extensionPage.goTo("/time");
    await use(timePage);
  },
  settingsPage: async ({ extensionPage }, use) => {
    const settingsPage = await extensionPage.goTo("/settings");
    await use(settingsPage);
  },
});

export const expect = test.expect;
