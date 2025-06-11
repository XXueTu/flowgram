import { defineConfig } from "@rsbuild/core";
import { pluginLess } from "@rsbuild/plugin-less";
import { pluginReact } from "@rsbuild/plugin-react";
import { getRsbuildProxyConfig } from "./src/config/proxy";

export default defineConfig({
  plugins: [pluginReact(), pluginLess()],
  source: {
    entry: {
      index: "./src/main.tsx",
    },
    /**
     * support inversify @injectable() and @inject decorators
     */
    decorators: {
      version: "legacy",
    },
  },
  html: {
    title: "demo",
  },
  output: {
    copy: [
      {
        from: "./node_modules/monaco-editor/min/vs",
        to: "vs",
      },
    ],
  },
  server: {
    proxy: getRsbuildProxyConfig(),
    historyApiFallback: true,
  },
});
