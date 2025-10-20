import { defineConfig } from "unocss";
import { transformerDirectives, presetWind3, presetTypography } from "unocss";

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
          "text-decoration": "underline dotted 1px var(--accent-bg)",
          "font-style": "italic",
        },
        "a:hover": {
          // "text-shadow": "0 0 0.125rem var(--accent-text, #fff)",
          "text-decoration": "underline wavy 1px var(--accent-bg-light)",
        },
        'input[type="checkbox"]:checked': {
          "background-color": "var(--accent-bg-light)",
          /* Add checkmark if desired */
        },
        'input[type="checkbox"]': {
          appearance: "none",
          width: "1.25rem",
          height: "1.25rem",
          "margin-right": "0.1rem",
          border: "2px solid var(--accent-bg-light)",
          "background-color": "transparent",
          "border-radius": "0.25rem",
          cursor: "pointer",
          display: "inline-block",
          "vertical-align": "middle",
        },
        "h1, h2, h3, h4, h5, h6": {
          "text-decoration": "underline wavy 1px var(--accent-bg)",
          width: "max-content",
          color: "var(--accent-text)",
          "margin-bottom": "0",
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
        "sup > a": {
          "text-decoration": "none",
          color: "var(--accent-bg) !important",
          "font-style": "normal",
        },
        pre: {
          "font-size": "0.8rem",
        },
        "*": {
          color: "var(--accent-text)",
        },
      },
    }),
  ],
});
