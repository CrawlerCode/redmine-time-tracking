import { ExtensionPage } from "./base";

export class SettingsPage extends ExtensionPage {
  async fillAndSaveRedmineSettings(redmineURL: string = process.env.TESTING_REDMINE_URL!, redmineApiKey: string = process.env.TESTING_REDMINE_API_KEY!) {
    // Wait for the edit form to be ready
    await this.page.waitForSelector('[name="redmineURL"]');

    // Insert redmine url and api key
    await this.page.fill('[name="redmineURL"]', redmineURL);
    await this.page.fill('[name="redmineApiKey"]', redmineApiKey);

    // Save settings
    await this.page.click('[type="submit"]');

    // Wait for the save confirmation toast to appear and close it
    await this.page.waitForSelector("[data-sonner-toast]");
    await this.page.evaluate(() => {
      document.querySelectorAll("[data-sonner-toast]").forEach((toast) => toast.remove());
    });

    // Wait for the connection successful message to be visible
    await this.page.waitForSelector('[data-testid="connection-successful"]');
  }
}
