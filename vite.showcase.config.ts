import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  root: resolve(__dirname, "showcase"),
  base: "/tourara/",
  plugins: [react()],
  resolve: {
    alias: {
      "@persianstudio/tourara": resolve(__dirname, "src/index.ts"),
    },
  },
  build: {
    outDir: resolve(__dirname, "showcase-dist"),
    emptyOutDir: true,
  },
  server: {
    port: 5173,
  },
});
