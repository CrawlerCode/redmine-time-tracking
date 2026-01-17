import { Page } from "@playwright/test";
import { BasePage } from "./base";

export class IssuesPage extends BasePage {
  constructor(page: Page, extensionId: string) {
    super(page, extensionId, "issues");
  }

  async waitForIssuesToLoad() {
    await this.page.waitForSelector("[role=listitem][data-type='issue']");
  }

  async getIssuesCount() {
    const issues = await this.page.$$("[role=listitem][data-type='issue']");
    return issues.length;
  }

  async startTimer(idx: number) {
    // Get issues list
    const issues = await this.page.$$("[role=listitem][data-type='issue']");
    if (idx >= issues.length) {
      throw new Error(`Cannot start timer for issue index ${idx}, only ${issues.length} issues available`);
    }

    // Find and click start button
    const startButton = await issues[idx].$("[data-type='start-timer']");
    await startButton?.click();
  }

  async openSearch() {
    await this.page.keyboard.press("Control+KeyF");
  }

  async searchByText(text: string) {
    await this.page.fill("input[name=query]", text);

    await this.waitForIssuesToLoad();
  }

  async openSpentTimeForm() {
    // Click on the first issue done-timer button to open spent time form
    await this.page.click('[role="button"][data-type="done-timer"]');
  }

  async fillSpentTimeForm({ hours = (1 + Math.random() * 3).toFixed(2), comments = "Added new feature" }: { hours?: string; comments?: string } = {}) {
    // Wait that the dialog is open
    await this.page.waitForSelector("[role=dialog]");

    // Fill form
    await this.page.fill('input[name="hours"]', hours);
    await this.page.fill('input[name="comments"]', comments);
    await this.page.click('[data-slot="input-group"]:has(+ input[name="activity_id"])>input[role="combobox"]');
    await this.page.click('[data-slot="combobox-item"][role="option"]');
    await this.page.waitForSelector('[data-slot="combobox-list"]', { state: "detached" });

    await this.page.focus('button[type="submit"]');
  }

  async submitSpentTimeForm() {
    // Check that the dialog is open
    await this.page.waitForSelector("[role=dialog]");

    // Submit form
    await this.page.click('button[type="submit"]');

    // Wait for modal to close
    await this.page.waitForSelector("[role=dialog]", { state: "detached" });
  }
}
