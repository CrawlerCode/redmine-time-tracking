import { ExtensionPage } from "./base";

export class TimePage extends ExtensionPage {
  async waitForTimeEntriesToLoad() {
    // Wait for the first time entry to be rendered
    await this.page.waitForSelector("[data-type='time-entry']");
  }
}
