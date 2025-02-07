import { getSettings } from "./provider/SettingsProvider";

/**
 * Open options page on install and set uninstall URL
 */
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage();
    chrome.runtime.setUninstallURL("https://github.com/CrawlerCode/redmine-time-tracking/discussions/1");
  }
});

/**
 * Register content script on configured Redmine URL
 * and re-register on Redmine URL change
 */
const registerContentScript = async () => {
  const settings = await getSettings();
  if (!settings.redmineURL) return;

  // Unregister content script
  await chrome.scripting
    .unregisterContentScripts({
      ids: ["content"],
    })
    .catch(() => undefined);

  // If showCurrentIssueTimer is disabled, do not register content script
  if (!settings.features.showCurrentIssueTimer) return;

  // Register content script
  await chrome.scripting.registerContentScripts([
    {
      id: "content",
      js: ["inject-content-module.js"],
      matches: [`${settings.redmineURL}/*`],
      runAt: "document_end",
    },
  ]);
};
registerContentScript();
chrome.runtime.onMessage.addListener((message) => {
  if (["settings-changed:redmineURL", "settings-changed:showCurrentIssueTimer"].includes(message)) {
    registerContentScript();
  }
});
