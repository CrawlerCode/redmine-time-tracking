/**
 * Load "content.js" script as module
 */
(async () => {
  await import(chrome.runtime.getURL("content.js"));
})();
