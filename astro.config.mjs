// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro'
import { transformerDirectives, presetWind3, presetTypography } from 'unocss'

import svelte from '@astrojs/svelte';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), UnoCSS({
    injectReset: true,
    transformers: [transformerDirectives()],
    presets: [presetWind3(), presetTypography()]
  }), sitemap()],
  site: "https://thrizzle.nekoweb.org",
});