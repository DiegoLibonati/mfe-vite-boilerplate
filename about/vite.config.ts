import path from "path";
import { defineConfig, loadEnv } from "vite";
import { transform } from "esbuild";
import angular from "@analogjs/vite-plugin-angular";
import { federation } from "@module-federation/vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import prefixSelector from "postcss-prefix-selector";

import type { Plugin, UserConfig } from "vite";

interface AboutConfig extends UserConfig {
  oxc?: false;
}

/**
 * Workaround for the @analogjs/vite-plugin-angular + Vite 7 + decorators interaction.
 *
 * Under Vite 7 the default transformer is oxc (Rolldown path), which here is disabled
 * via `oxc: false`. In that setup some `.ts/.tsx` files come back from the transform
 * pipeline with empty output (the decorator metadata Angular relies on is stripped),
 * leaving the module effectively blank.
 *
 * This plugin detects those empty-after-transform files, re-reads the original source
 * from disk and re-runs esbuild with `experimentalDecorators` enabled so Angular's
 * decorator metadata is preserved. Remove it only once the Analog plugin handles the
 * Vite 7 / oxc path natively — deleting it prematurely breaks the Angular remote build.
 */
export const tsTransformPlugin = (): Plugin => ({
  name: "ts-transform",
  async transform(code: string, id: string): Promise<{ code: string; map: string } | undefined> {
    if (!id.endsWith(".ts") && !id.endsWith(".tsx")) return;
    if (id.includes("node_modules") || id.includes("\0") || id.includes("virtual:")) return;
    if (code.trim() !== "") return;
    const { readFileSync } = await import("fs");
    code = readFileSync(id, "utf-8");
    const isTsx = id.endsWith(".tsx");
    const result = await transform(code, {
      loader: isTsx ? "tsx" : "ts",
      ...(isTsx && { jsx: "automatic" as const, jsxImportSource: "react" }),
      sourcemap: true,
      target: "esnext",
      tsconfigRaw: JSON.stringify({
        compilerOptions: { experimentalDecorators: true },
      }),
    });
    return { code: result.code, map: result.map };
  },
});

export default defineConfig(({ mode }): AboutConfig => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const isDev = mode === "development";

  return {
    plugins: [
      federation({
        name: "about",
        filename: "remoteEntry.js",
        exposes: {
          "./AboutApp": "./src/About.module.ts",
        },
        remotes: {
          shared: {
            type: "module",
            name: "shared",
            entry: env.VITE_REMOTE_SHARED_URL || "http://localhost:4000/remoteEntry.js",
          },
        },
        shared: {
          "@angular/core": { singleton: true, requiredVersion: "^19.2.0" },
          "@angular/common": { singleton: true, requiredVersion: "^19.2.0" },
          "@angular/compiler": { singleton: true, requiredVersion: "^19.2.0" },
          "@angular/platform-browser": { singleton: true, requiredVersion: "^19.2.0" },
        },
        dts: false,
      }),
      angular({ tsconfig: "./tsconfig.app.json" }),
      tsTransformPlugin(),
      cssInjectedByJsPlugin({ relativeCSSInjection: true }),
    ],
    oxc: false,
    css: {
      postcss: {
        plugins: [
          prefixSelector({
            prefix: '[data-mfe="about"]',
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
      mainFields: ["module"],
      alias: [
        { find: "@shared", replacement: path.resolve(import.meta.dirname, "../shared/src") },
        { find: "@tests", replacement: path.resolve(import.meta.dirname, "./__tests__") },
        { find: "@about", replacement: path.resolve(import.meta.dirname, "./src") },
      ],
    },
    server: {
      port: 3020,
      strictPort: true,
      host: "0.0.0.0",
      cors: true,
    },
    preview: {
      port: 3021,
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
