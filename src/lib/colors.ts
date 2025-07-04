import { rgb } from "chroma-js/src/io/rgb/index.js";
import "chroma-js/src/ops/luminance.js";
import contrast from "chroma-js/src/utils/contrast.js";
// import "chroma-js/src/interpolator/rgb.js";
// import "chroma-js/src/interpolator/hsl.js";

export type RGBColor = [number, number, number];
export type CompletePalette = {
  palette: string[];
  dominant: string;
  textColor: string;
};

function targetLuminance(bgLuminance: number, lighten = false) {
  if (lighten) {
    return 4.5 * (bgLuminance + 0.05) - 0.05;
  }
  return (bgLuminance + 0.05) / 4.5 - 0.05;
}

export function getPalette(ct_palette: RGBColor[]) {
  const rawPalette = ct_palette.map((color) => rgb(...color));

  const rawDominant = rawPalette.shift() as chroma.Color;
  const dominant = `rgb(${rawDominant.rgb().join(", ")})`;

  // sort palette by contrast with dominant (highest first), and then convert to rgb
  if (getContrast(rawDominant, rawPalette[1]) < 0.2) {
    const bgLuminance = rawDominant.luminance();
    rawPalette[1] = rawPalette[1].luminance(
      targetLuminance(bgLuminance, bgLuminance < 0.5),
    );
  }
  const palette = rawPalette
    .sort((color) => -contrast(rawDominant, color))
    .map((color) => `rgb(${color.rgb().join(", ")})`);

  // calculate text color from dominant color luminance
  const textColor = rawDominant.luminance() > 0.4 ? "black" : "white";
  if (getContrast(rawDominant, rawPalette[0]) < 0.2) {
    palette[0] = textColor;
  }
  const result = { palette, textColor, dominant };
  console.log(result);
  return result;
}

function getContrast(color1: chroma.Color, color2: chroma.Color) {
  return Math.abs(color1.luminance() - color2.luminance());
}
