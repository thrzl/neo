import { defineConfig } from "unocss";

export default defineConfig({
	safelist: ["transition-colors", "duration-500"],
	shortcuts: [
		{ "text-glow": "text-shadow-[0_0_0.125rem_white]" },
		{
			link: "b-b-2 b-cover-accent b-dotted hover:text-glow !hover:b-cover-bright transition-colors duration-250 animate-linear",
		},
		{ divider: "b-muted-8 b-dotted b-8 b-b-0 h-0 p-0 my-8 w-1/4 mx-auto" },
		{ hunderline: "b-b-dotted b-b-1 b-b-cover-accent" },
	],
	theme: {
		colors: {
			cover: {
				base: "var(--accent-muted-dark, rgb(20 83 45))",
				muted: "var(--accent-bg-dark, rgb(22 101 52))",
				mutedlight: "var(--accent-muted, rgb(22 101 52))",
				bright: "var(--accent-muted-light, rgb(22 101 52))",
				accent: "var(--accent-bg, rgb(74 222 128))",
			},
		},
	},
});
