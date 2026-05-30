import path from "path";
import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import prefixSelector from "postcss-prefix-selector";

import type { UserConfig } from "vite";

export default defineConfig(({ mode }): UserConfig => {
  const isDev = mode === "development";

  return {
    plugins: [
      federation({
        name: "shared",
        filename: "remoteEntry.js",
        exposes: {
          "./sdk": "./src/exports.ts",
        },
        shared: {
          react: { singleton: true, requiredVersion: "^19.0.0" },
          "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        },
        dts: false,
      }),
      cssInjectedByJsPlugin({ relativeCSSInjection: true }),
    ],
    // shared is a LIBRARY remote consumed cross-framework (React, Vue, Angular hosts).
    // It must NOT carry React Fast Refresh: @vitejs/plugin-react injects a dev-only preamble
    // check that throws "@vitejs/plugin-react can't detect preamble" when shared's components
    // are loaded into a host page without the React preamble (Vue/Angular dev servers), which
    // also breaks the exposed barrel (LinkModule/ActionModule become undefined). So we compile
    // JSX with esbuild's automatic runtime instead of the React plugin (no Fast Refresh).
    esbuild: {
      jsx: "automatic",
      jsxImportSource: "react",
    },
    css: {
      postcss: {
        plugins: [
          prefixSelector({
            prefix: '[data-mfe="shared"]',
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
        { find: "@shared", replacement: path.resolve(import.meta.dirname, "./src") },
        { find: "@tests", replacement: path.resolve(import.meta.dirname, "./__tests__") },
      ],
    },
    server: {
      port: 4000,
      strictPort: true,
      host: "0.0.0.0",
      cors: true,
    },
    preview: {
      port: 4001,
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
