// @ts-check
import { defineConfig } from 'astro/config';
import UnoCSS from 'unocss/astro'

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte(), UnoCSS({
    injectReset: true,
  })],
  image: {
    domains: ['coverartarchive.org', 'archive.org'],
    remotePatterns: [
      {
        "hostname": "**.archive.org"
      },
      {
        protocol: 'http'
      }
    ]
  }
});