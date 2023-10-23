import react from "@vitejs/plugin-react";
import path from "node:path";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { defineConfig } from "vite";

export default defineConfig(() => {
  const configuration = {
    plugins: [peerDepsExternal(), react()],
    build: {
      minify: false,
      lib: {
        name: "gantt-task-react",
        entry: path.resolve(__dirname, "src/index.tsx"),
        formats: ["es", "umd"],
        fileName: format => `gantt-task-react.${format}.js`,
      },
    },
    test: {
      environment: "jsdom",
      coverage: {
        reporter: ["text", "html"],
      },
    },
  };
  return configuration;
});
