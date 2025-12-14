import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import zipPack from "vite-plugin-zip-pack";
import packageJson from "./package.json";

import "dotenv/config";

const platform = process.env.PLATFORM ?? "chrome";

// https://vitejs.dev/config/
export default defineConfig((env) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: env.mode === "development" ? false : undefined,
    emptyOutDir: true,
    rollupOptions: {
      input: ["index.html", "src/background.ts", "src/content.tsx", "src/inject-content-module.ts"],
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
      },
    },
    cssCodeSplit: false,
  },
  experimental: {
    renderBuiltUrl(file, { type, hostType }) {
      if (type === "asset" && hostType !== "html") {
        return {
          runtime: `chrome.runtime.getURL("${file}")`,
        };
      }
    },
  },
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
      quoteStyle: "double",
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/manifest.json",
          dest: ".",
          transform: (content) => {
            const manifest = JSON.parse(content);

            if (packageJson.version.includes("-")) {
              manifest.version = packageJson.version.split("-")[0];
              manifest.version_name = packageJson.version;
            } else {
              manifest.version = packageJson.version;
            }
            if (env.mode === "development") {
              manifest.version_name = packageJson.version + " (dev)";
            }

            if (platform === "chrome") {
              manifest.background = {
                service_worker: "background.js",
                type: "module",
              };
            }

            if (platform === "firefox") {
              manifest.background = {
                scripts: ["background.js"],
                type: "module",
              };
              manifest.browser_specific_settings = {
                gecko: {
                  id: "{ea2ad5bc-e458-414d-8565-5cfe9f7cf0c2}",
                  strict_min_version: "109.0",
                },
              };
            }

            return JSON.stringify(manifest, null, 4);
          },
        },
      ],
    }),
    env.mode === "production" &&
      zipPack({
        outDir: "releases",
        outFileName: `${packageJson.name}-v${packageJson.version}-${platform}.zip`,
        enableLogging: false,
      }),
  ],
}));
