import type { Rgb, Oklab } from "culori/fn";
import { convertRgbToOklab, convertOklabToRgb } from "culori/fn";

// oklab palette of bipolar - beige
export const defaultPalette: Oklab[] = [
  {
    mode: "oklab",
    l: 69.06602336138803,
    a: 0,
    b: 0,
  },
  {
    mode: "oklab",
    l: 29.11249592086589,
    a: 0.12069486237930604,
    b: -0.4174270801306612,
  },
  {
    mode: "oklab",
    l: 40.41316317433956,
    a: 0.17724679413204214,
    b: -0.2237753329012122,
  },
  {
    mode: "oklab",
    l: 42.52903400503874,
    a: -0.6038378576813876,
    b: 0.9063638438680073,
  },
];

export type RGBArray = [number, number, number];
export type CompletePalette = {
  palette: string[];
  dominant: string;
  textColor: string;
  secondaryTextColor: string;
};

function targetLuminance(bgLuminance: number, lighten = false) {
  if (lighten) {
    return 4.5 * (bgLuminance + 0.05) - 0.05;
  }
  return (bgLuminance + 0.05) / 4.5 - 0.05;
}

function oklabSaturation(color: Oklab) {
  return Math.sqrt(color.a ** 2 + color.b ** 2);
}

export function getPalette(colorThiefPalette: RGBArray[]): CompletePalette {
  let rawPalette: Oklab[] = (colorThiefPalette || defaultPalette).map(
    ([r, g, b]) => convertRgbToOklab({ r, g, b }), // manually convert to proper RGB type
  );

  if (rawPalette.length === 0) {
    // if no rawPalette, resort to default palette
    rawPalette = defaultPalette;
  }

  // biome-ignore lint/style/noNonNullAssertion: bro shut up i JUST checked it
  const rawDominant = rawPalette.shift()!;

  if (rawPalette.length < 3) {
    console.log("not enough colors");

    // if not enough colors, make everything else white/black
    const fillerColor =
      rawDominant.l > 0.6 ? { r: 0, b: 0, g: 0 } : { r: 255, b: 255, g: 255 };

    // keep original dominant color and whatever other colors we have
    rawPalette = [
      ...rawPalette,
      ...Array(Math.max(0, 4 - rawPalette.length)).fill(fillerColor),
    ].slice(0, 4);
  }

  const palette = rawPalette.sort(
    (a, b) => oklabSaturation(b) - oklabSaturation(a),
  );

  // calculate text color from dominant color luminance
  const textColor: Rgb =
    rawDominant.l / 100 > 0.6
      ? { r: 0, g: 0, b: 0, mode: "rgb" }
      : { r: 255, g: 255, b: 255, mode: "rgb" };

  const secondaryTextColor: Rgb =
    palette[0].l / 100 > 0.4
      ? { r: 0, g: 0, b: 0, mode: "rgb" }
      : { r: 255, g: 255, b: 255, mode: "rgb" };

  const result = {
    palette: palette
      .map(convertOklabToRgb)
      .map(({ r, g, b }) => rgbToString({ r, g, b, a: 1 })),
    textColor: rgbToString({ ...textColor, a: 1 }),
    dominant: oklabToRgbString(rawDominant),
    secondaryTextColor: rgbToString({ ...secondaryTextColor, a: 1 }),
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

function oklabToRgbString(color: Oklab) {
  const { r, g, b }: Rgb = convertOklabToRgb(color);
  console.log({ r, g, b });
  return rgbToString({ r, g, b, a: color.alpha || 1 });
}
