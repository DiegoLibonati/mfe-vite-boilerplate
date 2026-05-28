import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { federation } from "@module-federation/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import prefixSelector from "postcss-prefix-selector";

import type { UserConfig } from "vite";

export default defineConfig(({ mode }): UserConfig => {
  const isDev = mode === "development";

  return {
    plugins: [
      federation({
        name: "users",
        filename: "remoteEntry.js",
        exposes: {
          "./UsersApp": "./src/mount.ts",
        },
        shared: {
          vue: { singleton: true, requiredVersion: "^3.5.0" },
          react: { singleton: true, requiredVersion: "^19.0.0" },
          "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
        },
        dts: false,
      }),
      vue(),
      cssInjectedByJsPlugin({ relativeCSSInjection: true }),
    ],
    css: {
      postcss: {
        plugins: [
          prefixSelector({
            prefix: '[data-mfe="users"]',
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
      port: 3030,
      strictPort: true,
      host: "0.0.0.0",
      cors: true,
    },
    preview: {
      port: 3031,
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
