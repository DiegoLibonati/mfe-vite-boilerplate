import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";

import type { UserConfig } from "vite";

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const isDev = mode === "development";

  return {
    plugins: [
      federation({
        name: "container",
        remotes: {
          home: {
            type: "module",
            name: "home",
            entry: env.VITE_REMOTE_HOME_URL || "http://localhost:3010/remoteEntry.js",
          },
          about: {
            type: "module",
            name: "about",
            entry: env.VITE_REMOTE_ABOUT_URL || "http://localhost:3020/remoteEntry.js",
          },
          users: {
            type: "module",
            name: "users",
            entry: env.VITE_REMOTE_USERS_URL || "http://localhost:3030/remoteEntry.js",
          },
          notfound: {
            type: "module",
            name: "notfound",
            entry: env.VITE_REMOTE_NOTFOUND_URL || "http://localhost:3040/remoteEntry.js",
          },
          product: {
            type: "module",
            name: "product",
            entry: env.VITE_REMOTE_PRODUCT_URL || "http://localhost:3050/remoteEntry.js",
          },
          context: {
            type: "module",
            name: "context",
            entry: env.VITE_REMOTE_CONTEXT_URL || "http://localhost:3060/remoteEntry.js",
          },
        },
        shared: {
          react: { singleton: true, requiredVersion: "^19.0.0" },
          "react-dom": { singleton: true, requiredVersion: "^19.0.0" },
          "react-router-dom": { singleton: true, requiredVersion: "^7.0.0" },
        },
        dts: false,
      }),
      react(),
    ],
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
      port: 3000,
      open: false,
      host: "0.0.0.0",
      strictPort: true,
      cors: true,
      proxy: {
        "/api/users": {
          target: env.VITE_API_URL || "https://jsonplaceholder.typicode.com",
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api/, ""),
        },
      },
    },
    preview: {
      port: 3000,
      strictPort: true,
    },
    build: {
      outDir: "dist",
      sourcemap: isDev,
      target: "esnext",
      minify: "esbuild",
    },
  };
});
