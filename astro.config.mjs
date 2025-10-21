// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";
import { visualizer } from "rollup-plugin-visualizer";
import swc from "@rollup/plugin-swc";

// https://astro.build/config
export default defineConfig({
  integrations: [UnoCSS({ injectReset: true }), sitemap(), mdx()],
  site: "https://thrizzle.nekoweb.org",
  vite: {
    plugins: [
      visualizer({
        emitFile: true,
        filename: "stats.html",
        gzipSize: true,
        brotliSize: true,
      }),
      swc({
        include: /\.[jt]sx?$/,
        exclude: /\.css$/,
      }),
    ],
  },
});
