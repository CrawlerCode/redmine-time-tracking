import react from "@vitejs/plugin-react";
import "dotenv/config";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import zipPack from "vite-plugin-zip-pack";
import packageJson from "./package.json";

const platform = process.env.PLATFORM ?? "chrome";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: ["index.html", "src/background.ts"],
      output: {
        entryFileNames: "[name].js",
      },
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "src/manifest.json",
          dest: ".",
          transform: (content) => {
            const manifest = JSON.parse(content);

            if (platform === "chrome") {
              manifest.background = {
                service_worker: "background.js",
              };
            }

            if (platform === "firefox") {
              manifest.background = {
                page: "background.js",
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
    zipPack({
      outDir: "releases",
      outFileName: `${packageJson.name}-v${packageJson.version}-${platform}.zip`,
      enableLogging: false,
    }),
  ],
});
