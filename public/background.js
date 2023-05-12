chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.runtime.openOptionsPage();
    chrome.runtime.setUninstallURL("https://github.com/CrawlerCode/redmine-time-tracking/discussions/1");
  }
});
