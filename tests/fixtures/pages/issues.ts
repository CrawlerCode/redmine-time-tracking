import { ExtensionPage } from "./base";

export class IssuesPage extends ExtensionPage {
  async waitForIssuesToLoad() {
    await this.page.waitForSelector("[role=listitem][data-type='issue'] [data-type='timer']");
  }

  async triggerTimerAction(idx: number, action: "start" | "pause" | "done") {
    // Find and click the appropriate button based on the action
    const issue = this.page.locator("[role=listitem][data-type='issue']").nth(idx);
    await issue.locator(`[data-action='timer-${action}']`).click();

    // Wait for the expected result of the action
    switch (action) {
      case "start":
        await issue.locator("[data-action='timer-pause']").waitFor();
        break;
      case "pause":
        await issue.locator("[data-action='timer-pause']").waitFor({ state: "detached" });
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

  async fillIssueForm({
    subject = "New issue",
    description = "Something went wrong",
  }: {
    subject?: string;
    description?: string;
  } = {}) {
    await this.page.waitForSelector("[role=dialog]");

    await this.page.fill('input[name="subject"]', subject);
    await this.page.fill('textarea[name="description"]', description);

    await this.page.focus('button[type="submit"]');
  }

  async dismissAlertAndScrollDialogToTop() {
    await this.page.click("[role=dialog] [role=alert] button");
    await this.page.waitForSelector("[role=dialog] [role=alert]", { state: "detached" });

    await this.page
      .locator("[data-slot='dialog-content']")
      .first()
      .evaluate((el) => {
        el.scrollTop = 0;
      });
  }
}
