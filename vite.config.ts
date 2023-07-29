import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

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
  plugins: [react()],
});
