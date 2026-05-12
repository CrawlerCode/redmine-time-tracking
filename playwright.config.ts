import { defineConfig, devices } from "@playwright/test";

const LANGUAGES = ["en", "de", "fr", "ru"] as const;
const COLOR_SCHEMES = ["dark"] as const;

/**
 * @see https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 1,
  workers: 3,
  timeout: 10_000,
  reporter: [["list"], ["html"]],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.02,
      pathTemplate: "{testDir}/screenshots{/projectName}/{testFilePath}/{testName}{ext}",
    },
  },
  projects: [
    ...LANGUAGES.map((locale) =>
      COLOR_SCHEMES.map((colorScheme) => ({
        name: `Chrome popup | ${colorScheme}/${locale}`,
        use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 548 }, colorScheme, locale, timezoneId: "Europe/Berlin" },
      }))
    ).flat(),
    ...LANGUAGES.map((locale) =>
      COLOR_SCHEMES.map((colorScheme) => ({
        name: `Chrome fullscreen | ${colorScheme}/${locale}`,
        use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 720 }, colorScheme, locale, timezoneId: "Europe/Berlin" },
      }))
    ).flat(),
  ],
});
