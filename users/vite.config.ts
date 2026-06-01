import path from "path";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
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
        name: "users",
        filename: "remoteEntry.js",
        exposes: {
          "./UsersApp": "./src/Users.module.ts",
        },
        remotes: {
          shared: {
            type: "module",
            name: "shared",
            entry: env.VITE_REMOTE_SHARED_URL || "http://localhost:4000/remoteEntry.js",
          },
        },
        shared: {
          vue: { singleton: true, requiredVersion: "^3.5.0" },
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
            transform: (prefix, selector, prefixedSelector) => {
              if (selector.startsWith("*")) return selector;
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
        { find: "@users", replacement: path.resolve(import.meta.dirname, "./src") },
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
