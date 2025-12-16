import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "wxt";

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
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      tailwindcss(),
    ],
  }),
  manifest: ({ browser }) => ({
    name: "__MSG_extName__",
    description: "__MSG_extDesc__",
    default_locale: "en",
    icons: {
      "16": "/icon/16.png",
      "48": "/icon/48.png",
      "128": "/icon/128.png",
    },
    author: {
      email: "crawlercode@outlook.de",
    },
    homepage_url: "https://github.com/CrawlerCode/redmine-time-tracking",
    permissions: ["storage", "tabs", "activeTab", "scripting"],
    host_permissions: ["http://*/*", "https://*/*"],
    ...(browser === "chrome" && {
      key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAk2PbuYr+evWm0U+t8XCn94jO0x0yydbdSqotCB9tC2NaYcnYhuOIrkDrAJg8DwUSvRbx2FXbacmf/CyI5fPivYmLDDL6D1VqabEhpVwNjTbj6V8lOy52C8Kl9ZA8WEvBZIsgU1bi54j2eg7B9lFZ3FIbavJB4Ezkny4eW+TdpUqcmoMxVybVeJ4q4jhzUFmEaHEmEyfzWLiUwYjEUzJkkzQYCTzZ0ZO1jWNnjfm5Y9IRSGPbzlChvigEhSuEs+DA2uZnr//mfr6xD97ryZY/i2HGeuxB3zZoIFR+FoFlp18ETJmEDO5ZEjEhl0Zb09yHlPah0IHDx6QjNcbxG3u31QIDAQAB",
    }),
    ...(browser === "firefox" && {
      browser_specific_settings: {
        gecko: {
          id: "{ea2ad5bc-e458-414d-8565-5cfe9f7cf0c2}",
          strict_min_version: "109.0",
        },
      },
    }),
  }),
  hooks: {
    "build:manifestGenerated": (wxt, manifest) => {
      if (wxt.config.mode === "development") {
        manifest.name += " [DEV]";
      }
    },
  },
  imports: false,
  webExt: {
    disabled: true,
  },
});
