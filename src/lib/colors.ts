import ColorThief, { type RGBColor } from "colorthief";
import chroma from "chroma-js";

export type CompletePalette = {
  palette: string[];
  dominant: string;
  textColor: string;
};

function targetLuminance(bgLuminance: number, lighten = false) {
  if (lighten) {
    return 4.5 * (bgLuminance + 0.05) - 0.05;
  } else {
    return (bgLuminance + 0.05) / 4.5 - 0.05;
  }
}

const colorThief = new ColorThief();
export function getColor(img: HTMLImageElement): CompletePalette {
  let rawPalette = colorThief.getPalette(img, 4).map((color) => chroma(color));

  // get and remove the dominant color
  const rawDominant = rawPalette.shift() as chroma.Color;
  const dominant = `rgb(${rawDominant.rgb().join(", ")})`;

  // sort palette by contrast with dominant (highest first), and then convert to rgb
  if (getContrast(rawDominant.rgb(), rawPalette[1].rgb()) < 0.2) {
    const bgLuminance = rawDominant.luminance();
    rawPalette[1] = rawPalette[1].luminance(
      targetLuminance(bgLuminance, bgLuminance < 0.5),
    );
  }
  const palette = rawPalette
    .sort((color) => -chroma.contrast(rawDominant, color))
    .map((color) => `rgb(${color.rgb().join(", ")})`);

  // calculate text color from dominant color luminance
  const textColor = rawDominant.luminance() > 0.4 ? "black" : "white";
  console.log(rawDominant.luminance());
  if (getContrast(rawDominant.rgb(), rawPalette[0].rgb()) < 0.2) {
    palette[0] = textColor;
  }
  const result = { palette, textColor, dominant };
  console.log(result);
  return result;
}

function getContrast(
  color1: [number, number, number],
  color2: [number, number, number],
) {
  return Math.abs(luminance(color1) - luminance(color2));
}

export function getTextColor([r, g, b]: [number, number, number]) {
  return luminance([r, g, b]) > 0.5 ? "black" : "white";
}

export function luminance([r, g, b]: [number, number, number]): number {
  const a = [r, g, b].map((v) => {
    v = v / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}
