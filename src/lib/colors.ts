import type { Colord, RgbaColor } from "colord";
import { colord, extend } from "colord";
import harmoniesPlugin from "colord/plugins/harmonies";
import labPlugin from "colord/plugins/lab";

extend([harmoniesPlugin, labPlugin]);

function rgbToArray(color: RgbaColor) {
  return [color.r, color.g, color.b].join(", ");
}

export const defaultPalette: [number, number, number][] = [
  [210, 210, 210],
  [71, 71, 74],
  [108, 107, 109],
  [113, 116, 108],
];

export type RGBColor = [number, number, number];
export type CompletePalette = {
  palette: string[];
  dominant: string;
  textColor: string;
};

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        Number.parseInt(result[1], 16),
        Number.parseInt(result[2], 16),
        Number.parseInt(result[3], 16),
      ]
    : null;
}

function targetLuminance(bgLuminance: number, lighten = false) {
  if (lighten) {
    return 4.5 * (bgLuminance + 0.05) - 0.05;
  }
  return (bgLuminance + 0.05) / 4.5 - 0.05;
}

export function getPalette(ct_palette: RGBColor[]) {
  let rawPalette: Colord[] = (ct_palette || defaultPalette).map(([r, g, b]) =>
    colord({ r, g, b }),
  );

  if (rawPalette.length === 0) {
    rawPalette = defaultPalette.map(([r, g, b]) => colord({ r, g, b }));
  }

  // biome-ignore lint/style/noNonNullAssertion: bro shut up i JUST checked it
  const rawDominant = rawPalette.shift()!;

  if (rawPalette.length < 3) {
    const harmony = rawDominant.harmonies("analogous");
    rawPalette = [rawDominant, ...rawPalette, ...harmony.slice(1)].slice(0, 4);
    console.log(`harmonized rawPalette: ${rawPalette}`);
  }

  const dominant = rawDominant.toRgb();
  rawPalette = rawPalette.sort(
    (a, b) => colord(a).toHsl().s - colord(b).toHsl().s,
  );
  // sort palette by contrast with dominant (highest first), and then convert to rgb
  if (getContrast(rawDominant, rawPalette[1]) < 0.2) {
    const bgLuminance = rawDominant.brightness();
    const secondary = rawPalette[1].toHsl();
    // secondary.l = targetLuminance(bgLuminance, bgLuminance < 0.5);
    rawPalette[1] = colord(secondary);
  }
  const palette = rawPalette
    .sort((color) => -getContrast(rawDominant, color))
    .map((color) => rgbToString(color.toRgb()));

  // calculate text color from dominant color luminance
  const textColor =
    rawDominant.brightness() > 0.6
      ? { r: 0, g: 0, b: 0, a: 255 }
      : { r: 255, g: 255, b: 255, a: 255 };

  // if (getContrast(rawDominant, rawPalette[0]) < 0.2) {
  //   palette[0] = rgbToArray(textColor);
  //   rawPalette[0] = colord(textColor);
  // }
  const secondaryTextColor =
    rawPalette[0].brightness() > 0.4
      ? { r: 0, g: 0, b: 0, a: 255 }
      : { r: 255, g: 255, b: 255, a: 255 };

  const result = {
    palette,
    textColor: rgbToString(textColor),
    dominant: rgbToString(dominant),
    secondaryTextColor: rgbToString(secondaryTextColor),
  };
  return result;
}

function rgbToString({
  r,
  g,
  b,
  a,
}: {
  r: number;
  g: number;
  b: number;
  a: number;
}) {
  if (a > 0) {
    const colors = [r, g, b, a].join(",");
    return `rgba(${colors})`;
  }
  const colors = [r, g, b].join(",");
  return `rgb(${colors})`;
}

function getContrast(color1: Colord, color2: Colord) {
  return Math.abs(color1.brightness() - color2.brightness());
}
