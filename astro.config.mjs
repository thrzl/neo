// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";
import { visualizer } from "rollup-plugin-visualizer";

import playformCompress from "@playform/compress";

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({ injectReset: true }),
    sitemap(),
    mdx(),
    playformCompress(),
  ],
  site: "https://thrizzle.nekoweb.org",
  vite: {
    plugins: [
      visualizer({
        emitFile: true,
        filename: "stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  },
});