import { ExtensionPage } from "./base";

export class TimersPage extends ExtensionPage {
  async waitForTimersToLoad() {
    // Wait for the first timer to be rendered
    await this.page.waitForSelector("[role=listitem][data-type='timer-card']");
  }

  async searchTimers(query: string) {
    await this.page.keyboard.press("Control+KeyF");

    await this.page.fill("input[name=query]", query);

    await this.waitForTimersToLoad();
  }
}
