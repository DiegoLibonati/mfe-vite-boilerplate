import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import prefixSelector from "postcss-prefix-selector";

import type { UserConfig } from "vite";

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const isDev = mode === "development";

  return {
    plugins: [
      federation({
        name: "not-found",
        filename: "remoteEntry.js",
        exposes: {
          "./NotFoundApp": "./src/mount.tsx",
        },
        remotes: {
          shared: {
            type: "module",
            name: "shared",
            entry: env.VITE_REMOTE_SHARED_URL || "http://localhost:4000/remoteEntry.js",
          },
        },
        shared: {
          react: { singleton: true, requiredVersion: "^19.0.0" },
          "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        },
        dts: false,
      }),
      react(),
      cssInjectedByJsPlugin({ relativeCSSInjection: true }),
    ],
    css: {
      postcss: {
        plugins: [
          prefixSelector({
            prefix: '[data-mfe="not-found"]',
            transform: (prefix, selector, prefixedSelector) => {
              // The universal reset (`*`, `*::before`, `*::after`) must stay GLOBAL so it
              // reaches the real <html>/<body>. Scoped as `[data-mfe="x"] *` it only matches
              // the host's descendants, leaving the browser's default <body> margin in place —
              // that's the white gutter around the standalone MFE. The reset is idempotent, so
              // re-applying it globally inside the container is harmless.
              if (selector.startsWith("*")) return selector;
              // Page-level selectors style the MFE host element itself, not the real document,
              // so the MFE's cosmetic styles stay scoped when embedded in the container.
              if ([":root", "html", "body"].includes(selector)) return prefix;
              return prefixedSelector;
            },
          }),
        ],
      },
    },
    resolve: {
      alias: [
        { find: "@shared", replacement: path.resolve(import.meta.dirname, "../shared/src") },
        { find: "@tests", replacement: path.resolve(import.meta.dirname, "./__tests__") },
        { find: "@not-found", replacement: path.resolve(import.meta.dirname, "./src") },
      ],
    },
    server: {
      port: 3040,
      strictPort: true,
      host: "0.0.0.0",
      cors: true,
    },
    preview: {
      port: 3041,
      strictPort: true,
      cors: true,
    },
    build: {
      outDir: "dist",
      sourcemap: isDev,
      target: "esnext",
      minify: isDev ? false : "esbuild",
      modulePreload: false,
    },
  };
});
