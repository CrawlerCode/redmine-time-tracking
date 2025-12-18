import { Page } from "@playwright/test";
import { BasePage } from "./base";

export class SettingsPage extends BasePage {
  constructor(page: Page, extensionId: string) {
    super(page, extensionId, "settings");
  }

  async fillAndSaveRedmineSettings(redmineURL: string = process.env.REDMINE_URL!, redmineApiKey: string = process.env.REDMINE_API_KEY!) {
    // Wait for redmine url and api key inputs
    await this.page.waitForSelector('[name="redmineURL"]');
    await this.page.waitForTimeout(100);

    // Insert redmine url and api key
    await this.page.fill('[name="redmineURL"]', redmineURL);
    await this.page.fill('[name="redmineApiKey"]', redmineApiKey);

    // Save settings
    await this.page.click('[type="submit"]');

    // Wait for alert (settings saved)
    await this.page.waitForSelector("[data-sonner-toast]");
  }
}
