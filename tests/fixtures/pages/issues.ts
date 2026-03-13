import { ExtensionPage } from "./base";

export class IssuesPage extends ExtensionPage {
  async waitForIssuesToLoad() {
    await this.page.waitForSelector("[role=listitem][data-type='issue']");
  }

  async triggerTimerAction(idx: number, action: "start" | "pause" | "done") {
    // Get issues list
    const issues = await this.page.$$("[role=listitem][data-type='issue']");
    if (idx >= issues.length) {
      throw new Error(`Issue index ${idx} is out of bounds, only ${issues.length} issues available`);
    }

    // Find and click the appropriate button based on the action
    const button = await issues[idx].$(`[data-type='${action}-timer']`);
    await button?.click();

    // Wait for the expected result of the action
    switch (action) {
      case "start":
        await issues[idx].waitForSelector("[data-type='pause-timer']");
        break;
      case "pause":
        await issues[idx].waitForSelector("[data-type='pause-timer']", { state: "detached" });
        break;
      case "done":
        await this.page.waitForSelector("[role=dialog]");
        break;
    }
  }

  async searchIssues(query: string) {
    await this.page.keyboard.press("Control+KeyF");

    await this.page.fill("input[name=query]", query);

    await this.waitForIssuesToLoad();
  }

  async fillSpentTimeForm({ hours = "2.00", comments = "Added new feature" }: { hours?: string; comments?: string } = {}) {
    // Wait that the dialog is open
    await this.page.waitForSelector("[role=dialog]");

    // Fill form
    await this.page.fill('input[name="hours"]', hours);
    await this.page.fill('input[name="comments"]', comments);
    await this.page.click('[data-slot="input-group"]:has(+ input[name="activity_id"])>input[role="combobox"]');
    await this.page.click('[role="option"][data-slot="combobox-item"]');
    await this.page.waitForSelector('[data-slot="combobox-list"]', { state: "detached" });

    await this.page.focus('button[type="submit"]');
  }

  async submitSpentTimeForm() {
    // Check that the dialog is open
    await this.page.waitForSelector("[role=dialog]");

    await this.page.click('button[type="submit"]');

    // Wait for modal to close
    await this.page.waitForSelector("[role=dialog]", { state: "detached" });
  }
}
