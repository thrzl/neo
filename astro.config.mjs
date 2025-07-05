// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { transformerDirectives, presetWind3, presetTypography } from "unocss";

import sitemap from "@astrojs/sitemap";

import mdx from "@astrojs/mdx";
import { visualizer } from "rollup-plugin-visualizer";

// https://astro.build/config
export default defineConfig({
  integrations: [
    UnoCSS({
      injectReset: true,
      transformers: [transformerDirectives()],
      presets: [
        presetWind3(),
        presetTypography({
          cssExtend: {
            img: {
              "margin-left": "auto",
              "margin-right": "auto",
            },
            a: {
              "text-decoration":
                "underline dotted 2px var(--accent-bg, rgb(74 222 128))",
              "font-style": "italic",
            },
            "a:hover": {
              // "text-shadow": "0 0 0.125rem var(--accent-text, #fff)",
              "text-decoration":
                "underline wavy 1px var(--accent-bg-light, rgb(22 101 52))",
            },
            'input[type="checkbox"]:checked': {
              "background-color": "var(--accent-bg-light, rgb(22 101 52))",
              /* Add checkmark if desired */
            },
            'input[type="checkbox"]': {
              appearance: "none",
              width: "1.25rem",
              height: "1.25rem",
              "margin-right": "0.1rem",
              border: "2px solid var(--accent-bg-light, rgb(22 101 52))",
              "background-color": "transparent",
              "border-radius": "0.25rem",
              cursor: "pointer",
              display: "inline-block",
              "vertical-align": "middle",
            },
            "h1, h2, h3, h4, h5, h6": {
              "text-decoration":
                "underline wavy 1px var(--accent-bg, rgb(74 222 128))",
              width: "max-content",
            },
            "#footnote-label": {
              "text-transform": "lowercase",
            },
            ins: {
              "text-decoration": "underline wavy 1px",
              "font-style": "italic",
            },
            "li.task-list-item": {
              "list-style-type": "none",
            },
          },
        }),
      ],
    }),
    sitemap(),
    mdx(),
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
