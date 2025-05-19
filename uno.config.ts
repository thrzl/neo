import { defineConfig } from 'unocss'

export default defineConfig({
  safelist: ["transition-colors", "duration-500"],
  shortcuts: [
    {
      "link": "b-b-dotted b-b-1 b-b-cover-accent hover:text-glow hover:b-b-2",
      "divider": "b-muted-8 b-dotted b-8 b-b-0 h-0 p-0 my-8 w-1/4 mx-auto",
      "text-glow": "text-shadow-[0_0_0.125rem_white]"
    },
  ],
  theme: {
    colors: {
      cover: {
        base: "var(--accent-muted-dark, rgb(20 83 45))",
        muted: "var(--accent-bg-dark, rgb(22 101 52))",
        "mutedlight": "var(--accent-muted, rgb(22 101 52))",
        "bright": "var(--accent-muted-light, rgb(22 101 52))",
        accent: "var(--accent-bg, rgb(74 222 128))"
      }
    }
  },
})