// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro'
import { transformerDirectives } from 'unocss'

import svelte from '@astrojs/svelte';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), UnoCSS({
    injectReset: true,
    transformers: [transformerDirectives()]
  }), sitemap()],
  site: "https://thrizzle.nekoweb.org",
});