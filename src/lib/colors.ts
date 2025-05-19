import { Vibrant } from "node-vibrant/browser";
import type { Palette } from "@vibrant/color";

export async function getDominantColor(src: string): Promise<Palette> {
	const vibrant = new Vibrant(src);
	return await vibrant.getPalette();
}

type PartialPalette = {
	Vibrant: {
		rgb: [number, number, number];
		population: number;
	};
	DarkVibrant: {
		rgb: [number, number, number];
		population: number;
	};
	LightVibrant: {
		rgb: [number, number, number];
		population: number;
	};
	Muted: {
		rgb: [number, number, number];
		population: number;
	};
	DarkMuted: {
		rgb: [number, number, number];
		population: number;
	};
	LightMuted: {
		rgb: [number, number, number];
		population: number;
	};
};

export const defaultPalette: PartialPalette = {
	Vibrant: {
		rgb: [127.5, 127.5, 127.5],
		population: 0,
	},
	DarkVibrant: {
		rgb: [66.3, 66.3, 66.3],
		population: 0,
	},
	LightVibrant: {
		rgb: [188.7, 188.7, 188.7],
		population: 0,
	},
	Muted: {
		rgb: [76.5, 76.5, 76.5],
		population: 0,
	},
	DarkMuted: {
		rgb: [52, 52, 52],
		population: 219,
	},
	LightMuted: {
		rgb: [76.5, 76.5, 76.5],
		population: 0,
	},
};
