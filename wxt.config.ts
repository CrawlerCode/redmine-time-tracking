import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "wxt";
import pkg from "./package.json";

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: "src",
  vite: () => ({
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        quoteStyle: "double",
      }),
      react(),
      babel({
        presets: [reactCompilerPreset()],
      } as Parameters<typeof babel>[0]),
      tailwindcss(),
    ],
  }),
  manifest: ({ browser, mode }) => ({
    name: "Redmine Time Tracking",
    description: "__MSG_extDesc__",
    default_locale: "en",
    icons: {
      "16": "/icon/16.png",
      "48": "/icon/48.png",
      "128": "/icon/128.png",
    },
    homepage_url: "https://github.com/CrawlerCode/redmine-time-tracking",
    permissions: ["storage", "tabs", "activeTab", "scripting"],
    host_permissions: ["http://*/*", "https://*/*"],
    ...(browser === "chrome" && {
      key:
        mode === "release"
          ? "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk2PbuYr+evWm0U+t8XCn94jO0x0yydbdSqotCB9tC2NaYcnYhuOIrkDrAJg8DwUSvRbx2FXbacmf/CyI5fPivYmLDDL6D1VqabEhpVwNjTbj6V8lOy52C8Kl9ZA8WEvBZIsgU1bi54j2eg7B9lFZ3FIbavJB4Ezkny4eW+TdpUqcmoMxVybVeJ4q4jhzUFmEaHEmEyfzWLiUwYjEUzJkkzQYCTzZ0ZO1jWNnjfm5Y9IRSGPbzlChvigEhSuEs+DA2uZnr//mfr6xD97ryZY/i2HGeuxB3zZoIFR+FoFlp18ETJmEDO5ZEjEhl0Zb09yHlPah0IHDx6QjNcbxG3u31QIDAQAB"
          : "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlm4d4x15I7iewgVp3cR51dCrwYINnvmmG/NjzK9Fg/LyzFLvRBqNftIqP4+fJas56CN2fNiFQNfdk8ACQJMKk8yd6fDeDs1/l/AseSWXM7GdbGDacj9lkZnL6jFHUrIxuwiHesE0W/I5o3Ep5ZXHnifjd7D9KEXswnvSWzmZXAtVNQu8DQXdNZO94N8i5ESLNdi78fmoeNIYaqieu5y0tlyMcvnOKiR3BHRAAN9bA0E/XvoazaL4KELcQbkh0T3nFhjSFDNHJAWlMkCvDGLC01RVLrkQW2ar9R5sAeyPmSx7HfgpzeBStwhDuOJ8s7Ed6WGCBaTll0WLQBxPYfV7qwIDAQAB",
      minimum_chrome_version: "122",
    }),
    ...(browser === "firefox" && {
      browser_specific_settings: {
        gecko: {
          id: "{ea2ad5bc-e458-414d-8565-5cfe9f7cf0c2}",
          strict_min_version: "127.0",
          data_collection_permissions: {
            required: ["none"],
          },
        },
      },
    }),
  }),
  hooks: {
    "build:manifestGenerated": (wxt, manifest) => {
      if (wxt.config.mode === "development") {
        manifest.name += " (DEV)";
        manifest.version_name = `${manifest.version}-dev`;
      } else if (wxt.config.mode === "release") {
        if (!/^\d+\.\d+\.\d+$/.test(pkg.version)) {
          throw new Error("Invalid version format for 'release' build. Expected format x.x.x (e.g. 1.0.0)");
        }
      } else if (wxt.config.mode === "pre-release") {
        const versionMatch = pkg.version.match(/^(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)-(?<distributionChannel>beta|alpha|canary)\.(?<preReleaseIdentifier>\d+)$/);
        if (!versionMatch?.groups) {
          throw new Error("Invalid version format for 'pre-release' build. Expected format x.x.x-channel.x (e.g. 1.0.0-beta.1)");
        }
        const { major, minor, patch, distributionChannel, preReleaseIdentifier } = versionMatch.groups;
        const build = (distributionChannel === "beta" ? 2000 : distributionChannel === "alpha" ? 1000 : 0) + Number(preReleaseIdentifier);
        manifest.name += ` (${distributionChannel.toUpperCase()})`;
        manifest.version = `${major}.${minor}.${patch}.${build}`;
        manifest.version_name = pkg.version;
      }
    },
  },
  imports: false,
  webExt: {
    disabled: true,
  },
});
