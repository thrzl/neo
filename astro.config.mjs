// @ts-check
import { defineConfig } from 'astro/config';

import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
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