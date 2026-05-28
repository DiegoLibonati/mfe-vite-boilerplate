import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import prefixSelector from "postcss-prefix-selector";

import type { UserConfig } from "vite";

export default defineConfig(({ mode }): UserConfig => {
  const isDev = mode === "development";

  return {
    plugins: [
      federation({
        name: "notfound",
        filename: "remoteEntry.js",
        exposes: {
          "./NotFoundApp": "./src/mount.tsx",
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
            prefix: '[data-mfe="notfound"]',
            transform: (prefix, selector, prefixedSelector) =>
              [":root", "html", "body"].includes(selector) ? prefix : prefixedSelector,
          }),
        ],
      },
    },
    resolve: {
      alias: [
        {
          find: /^@mfe\/shared$/,
          replacement: path.resolve(import.meta.dirname, "../shared/src/exports.ts"),
        },
        { find: "@mfe/shared", replacement: path.resolve(import.meta.dirname, "../shared/src") },
        { find: "@tests", replacement: path.resolve(import.meta.dirname, "./__tests__") },
        { find: "@", replacement: path.resolve(import.meta.dirname, "./src") },
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
