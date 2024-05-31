import { defineConfig, devices } from "@playwright/test";

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html"]],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    ...["en", "de", "ru"]
      .map((locale) =>
        (["dark", "light"] as const).map((colorScheme) => ({
          name: `Chrome | ${locale} (${colorScheme})`,
          use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 548 }, colorScheme, locale, timezoneId: "Europe/Berlin" },
          fullyParallel: false,
        }))
      )
      .flat(),
  ],
});
