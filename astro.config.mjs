// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro'
import { transformerDirectives } from 'unocss'

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), UnoCSS({
    injectReset: true,
    transformers: [transformerDirectives()]
  })],
  site: "https://thrizzle.nekoweb.org",
});