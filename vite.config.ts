import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const isProd = process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test";
const hmrDisable = { hostname: "localhost", port: 3001, protocol: "wss" };

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    hmr: isProd ? hmrDisable : true
  },
  css: {
    postcss: {
      plugins: [require("autoprefixer")()]
    }
  },
  build: {
    minify: isProd,
    outDir: "dist/client",
    ssrManifest: true
  },
  ssr: {
    noExternal: ["react-helmet-async"]
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});
