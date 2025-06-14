// @ts-check
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import { transformerDirectives, presetWind3, presetTypography } from "unocss";

import svelte from "@astrojs/svelte";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
	integrations: [
		svelte(),
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
							"text-decoration": "none",
							"font-style": "italic",
							"border-bottom": "2px dotted var(--accent-bg, rgb(74 222 128))",
						},
						"a:hover": {
							"text-shadow": "0 0 0.125rem white",
							"border-bottom":
								"2px dotted var(--accent-muted-light, rgb(22 101 52))",
						},
						"h1, h2, h3, h4, h5, h6": {
							"border-bottom": "1px dotted var(--accent-bg, rgb(74 222 128))",
							width: "max-content",
						},
						"#footnote-label": {
							"text-transform": "lowercase",
						},
					},
				}),
			],
		}),
		sitemap(),
	],
	site: "https://thrizzle.nekoweb.org",
});
