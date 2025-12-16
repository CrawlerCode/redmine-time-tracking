import { browser, defineBackground } from "#imports";
import { getSettings } from "@/provider/SettingsProvider";

export default defineBackground({
  type: "module",
  main: () => {
    /**
     * Open options page on install and set uninstall URL
     */
    browser.runtime.onInstalled.addListener(({ reason }) => {
      if (reason === browser.runtime.OnInstalledReason.INSTALL) {
        browser.runtime.openOptionsPage();
        browser.runtime.setUninstallURL("https://github.com/CrawlerCode/redmine-time-tracking/discussions/1");
      }
    });

    /**
     * Register content script initially and re-register on settings change
     */
    const registerContentScripts = async ({ unregister = false }: { unregister?: boolean } = {}) => {
      // Unregister existing content script
      if (unregister) {
        await browser.scripting
          .unregisterContentScripts({
            ids: ["content"],
          })
          .catch(() => undefined);
      }

      // Check settings
      const settings = await getSettings();
      if (!settings.redmineURL) return;
      if (!settings.features.showCurrentIssueTimer) return;

      // Register content script
      const url = new URL(settings.redmineURL);
      browser.scripting.registerContentScripts([
        {
          id: "content",
          js: ["content-scripts/content.js"],
          matches:
            import.meta.env.BROWSER === "firefox"
              ? [
                  url.port !== ""
                    ? // Firefox does not support ports in match patterns
                      `${url.protocol}//${url.hostname}${url.pathname}${url.pathname.endsWith("/") ? "" : "/"}*`
                    : `${url.toString()}${url.pathname.endsWith("/") ? "" : "/"}*`,
                ]
              : [`${url.toString()}${url.pathname.endsWith("/") ? "" : "/"}*`],
        },
      ]);
    };
    registerContentScripts();
    browser.runtime.onMessage.addListener((message) => {
      if (["settings-changed:redmineURL", "settings-changed:showCurrentIssueTimer"].includes(message)) {
        registerContentScripts({ unregister: true });
      }
    });
  },
});
