/**
 * Dev-only shim that lets the extension's UI (popup/options/sidepanel/index pages) be viewed
 * directly in a plain browser tab (e.g. the v0 preview), where no real `chrome` extension APIs exist.
 *
 * When the page is loaded as a real, unpacked extension, `chrome.runtime.id` is always defined, so
 * this shim is a no-op and the real extension APIs (via `wxt/browser`) are used as normal.
 *
 * When the page is loaded as a plain web page (no extension context), we install WXT's official
 * `fake-browser` test double onto `globalThis.chrome` *before* anything imports `wxt/browser`, so
 * storage, tabs, and runtime messaging behave like an in-memory mock instead of throwing.
 *
 * This file is only imported/executed in dev mode (see `main.tsx`) and is tree-shaken out of
 * production builds of the actual extension.
 */
import { fakeBrowser } from "wxt/testing/fake-browser";

const isRealExtensionContext = typeof chrome !== "undefined" && !!chrome.runtime?.id;

if (import.meta.env.DEV && !isRealExtensionContext) {
  // `fake-browser` doesn't implement `runtime.getManifest`, but it's used as a cache-buster
  // for the query persister, so we provide a minimal fake manifest here.
  fakeBrowser.runtime.getManifest = () =>
    ({
      manifest_version: 3,
      name: "Redmine Time Tracking (Preview)",
      version: "0.0.0-preview",
    }) as chrome.runtime.Manifest;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- intentionally patching the global `chrome` object for preview only
  (globalThis as any).chrome = fakeBrowser;
}
