import { browser, defineBackground } from "#imports";
import { runLocalIssuesMigration } from "@/hooks/useLocalIssues";
import { getStorage, removeStorage } from "@/hooks/useStorage";
import { runTimersMigration } from "@/hooks/useTimers";
import { getSettings, runSettingsMigration } from "@/provider/SettingsProvider";

export default defineBackground({
  type: "module",
  main: () => {
    (async () => {
      // Run settings migration on startup
      await runSettingsMigration();

      // Legacy issue data migration. TODO: Remove in future releases
      const legacyIssues = await getStorage<
        | Record<
            number,
            {
              active: boolean;
              start?: number;
              time: number;
              pinned: boolean;
              remembered: boolean;
            }
          >
        | undefined
      >("issues", undefined);
      if (legacyIssues && Object.keys(legacyIssues).length > 0) {
        await runTimersMigration(legacyIssues);
        await runLocalIssuesMigration(legacyIssues);
        await removeStorage("issues");
      }

      browser.runtime.onInstalled.addListener(({ reason }) => {
        if (reason === browser.runtime.OnInstalledReason.INSTALL) {
          // Open options page on install
          browser.runtime.openOptionsPage();

          // Open discussion page on uninstall to collect feedback
          browser.runtime.setUninstallURL("https://github.com/CrawlerCode/redmine-time-tracking/discussions/1");
        }
      });

      const registerContentScripts = async () => {
        // Unregister existing content script
        await browser.scripting
          .unregisterContentScripts({
            ids: ["content"],
          })
          .catch(() => undefined);

        // Check settings
        const settings = await getSettings();
        if (!settings.redmineURL) return;
        if (!settings.features.showCurrentIssueTimer) return;

        // Register content script
        const url = new URL(settings.redmineURL);
        await browser.scripting.registerContentScripts([
          {
            id: "content",
            js: ["content-scripts/content.js"],
            matches:
              import.meta.env.BROWSER === "firefox"
                ? // Firefox does not support ports in match patterns
                  [`${url.protocol}//${url.hostname}${url.pathname}${url.pathname.endsWith("/") ? "" : "/"}*`]
                : [`${url.toString()}${url.pathname.endsWith("/") ? "" : "/"}*`],
          },
        ]);
      };

      /**
       * Register content script initially and re-register on settings change
       */
      await registerContentScripts();
      browser.runtime.onMessage.addListener(async (message) => {
        if (["settings-changed:redmineURL", "settings-changed:showCurrentIssueTimer"].includes(message)) {
          await registerContentScripts();
        }
      });
    })();
  },
});
