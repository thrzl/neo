import { defineConfig } from "unocss";

export default defineConfig({
  safelist: ["transition-colors", "duration-500"],
  shortcuts: [
    {
      "text-glow": "text-shadow-[0_0_0.125rem_var(--accent-bg,#fff)]",
    },
    {
      link: "underline decoration-2 decoration-dotted hover:text-glow hover:decoration-wavy hover:decoration-1 decoration-cover-accent !hover:decoration-cover-bright",
    },
    { divider: "b-muted-8 b-dotted b-8 b-b-0 h-0 p-0 my-8 w-1/4 mx-auto" },
    { hunderline: "b-b-dotted b-b-1 b-b-cover-accent" },
  ],
  theme: {
    colors: {
      cover: {
        base: "var(--dominant)",
        muted: "var(--accent-bg)",
        mutedlight: "var(--accent-muted-light)",
        bright: "var(--accent-bg-light)",
        accent: "var(--accent-bg)",
        "text-color": "var(--accent-text)",
      },
    },
  },
});
