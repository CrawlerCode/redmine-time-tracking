import { Page } from "@playwright/test";
import { RegisteredRouter, ValidateLinkOptions } from "@tanstack/react-router";
import type { IssuesPage } from "./issues";
import type { SettingsPage } from "./settings";
import type { TimePage } from "./time";
import type { TimersPage } from "./timers";

type Routes<TRouter extends RegisteredRouter = RegisteredRouter> = Exclude<ValidateLinkOptions<TRouter>["to"], "." | "..">;

export class ExtensionPage {
  constructor(
    public page: Page,
    private extensionURL: string,
    private route: Routes
  ) {}

  async goTo(route: "/"): Promise<ExtensionPage>;
  async goTo(route: "/timers"): Promise<TimersPage>;
  async goTo(route: "/issues"): Promise<IssuesPage>;
  async goTo(route: "/time"): Promise<TimePage>;
  async goTo(route: "/settings"): Promise<SettingsPage>;
  async goTo(route: Routes): Promise<ExtensionPage>;
  async goTo(route: Routes): Promise<ExtensionPage> {
    // Navigate to the page
    await this.page.goto(`${this.extensionURL}#${route}`);

    // Return the correct page object based on the route
    switch (route) {
      case this.route:
        return this;
      case "/":
        return new ExtensionPage(this.page, this.extensionURL, route);
      case "/timers": {
        const { TimersPage } = await import("./timers");
        return new TimersPage(this.page, this.extensionURL, route);
      }
      case "/issues": {
        const { IssuesPage } = await import("./issues");
        return new IssuesPage(this.page, this.extensionURL, route);
      }
      case "/time": {
        const { TimePage } = await import("./time");
        return new TimePage(this.page, this.extensionURL, route);
      }
      case "/settings": {
        const { SettingsPage } = await import("./settings");
        return new SettingsPage(this.page, this.extensionURL, route);
      }
      default:
        throw new Error(`Unknown route '${route satisfies never}'`);
    }
  }
}
