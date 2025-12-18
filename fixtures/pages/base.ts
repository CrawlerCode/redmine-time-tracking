import { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(
    public page: Page,
    public extensionId: string,
    public path: string
  ) {}

  async goToPage<T extends BasePage>(pageClass: new (page: Page, extensionId: string) => T): Promise<T> {
    const pageInstance = new pageClass(this.page, this.extensionId);
    await pageInstance.page.goto(`chrome-extension://${this.extensionId}/index.html#/${pageInstance.path}`);
    return pageInstance;
  }
}
