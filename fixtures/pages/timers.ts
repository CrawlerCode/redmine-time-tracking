import { Page } from "@playwright/test";
import { BasePage } from "./base";

export class TimersPage extends BasePage {
  constructor(page: Page, extensionId: string) {
    super(page, extensionId, "timers");
  }

  async waitForTimersToLoad() {
    // Wait for the first timer to be rendered
    await this.page.waitForSelector("[data-type='timer']");
  }
}
