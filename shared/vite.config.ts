import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import type { UserConfig } from "vite";

export default defineConfig(({ mode }): UserConfig => {
  const isDev = mode === "development";

  return {
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: /^@mfe\/shared$/,
          replacement: path.resolve(import.meta.dirname, "./src/exports.ts"),
        },
        { find: "@mfe/shared", replacement: path.resolve(import.meta.dirname, "./src") },
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
      lib: {
        entry: {
          exports: path.resolve(import.meta.dirname, "./src/exports.ts"),
          types: path.resolve(import.meta.dirname, "./src/types/index.ts"),
        },
        formats: ["es"],
      },
      rollupOptions: {
        external: ["react", "react-dom", "react/jsx-runtime"],
      },
    },
  };
});
