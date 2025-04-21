// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro'

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), UnoCSS({
    injectReset: true,
  })],
  site: "https://thrizzle.nekoweb.org",
});