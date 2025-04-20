import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import type { UserConfig } from "vitest/config";

const isProd = process.env.NODE_ENV === "production";
const hmrDisable = { hostname: "localhost", port: 3001, protocol: "wss" };

const test = {
  globals: true,
  environment: "jsdom",
  setupFiles: ["src/__tests__/setupTests.ts"],
  threads: false,
  watch: false
} as UserConfig["test"];

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: { port: 3000, hmr: isProd ? hmrDisable : true },
//   build: {
//     minify: isProd ? true : false
//   },
//   root: "",
//   // @ts-ignore
//   test
// });

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/client",
    ssr: "src/client/entry-server.tsx",
    ssrManifest: true
  },
  server: {
    port: 8080
  }
});
