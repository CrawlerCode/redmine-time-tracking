import { Page } from "@playwright/test";
import { BasePage } from "./base";

export class TimePage extends BasePage {
  constructor(page: Page, extensionId: string) {
    super(page, extensionId, "time");
  }

  async waitForTimeEntriesToLoad() {
    // Wait for the first time entry to be rendered
    await this.page.waitForSelector("[data-type='time-entry']");
  }
}
