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

function oklabHue(color: Oklab) {
  const rawDeg = Math.atan2(color.b, color.a) * (180 / Math.PI);
  return (rawDeg + 360) % 360;
}

function oklabBrownCheck(color: Oklab) {
  const hue = oklabHue(color); // degrees
  const chroma = Math.sqrt(color.a ** 2 + color.b ** 2);

  const isOrange = hue > 35 && hue < 80;
  const isDark = color.l / 100 < 0.6;
  const isDull = chroma / 100 < 0.3;

  console.log(`isOrange: ${isOrange} (hue: ${hue})`);
  console.log(`isDark: ${isDark} (luminance: ${color.l})`);
  console.log(`isDull: ${isDull} (chroma: ${chroma / 100})`);

  return isOrange && isDark && isDull; // its prolly orange
}

window.brownCheck = oklabBrownCheck;

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
      rawDominant.l / 100 > 0.6 ? { l: 0, b: 0, a: 0 } : { l: 100, b: 0, 1: 0 };

    // keep original dominant color and whatever other colors we have
    rawPalette = [
      ...rawPalette,
      ...Array(Math.max(0, 4 - rawPalette.length)).fill(fillerColor),
    ].slice(0, 4);
  }
  console.log(rawPalette);
  window.rawPalette = rawPalette;

  // change secondary color to the most saturated form of itself that we received
  // first we gotta get the hue of the color
  const trueSecondaryHue = oklabHue(rawPalette[0]);

  // then we can find colors with a hue difference of less than 15 deg.. (and theyre not brown)
  const secondaryCandidates = rawPalette
    .slice(1)
    .filter(
      (color) =>
        Math.abs(oklabHue(color) - trueSecondaryHue) <= 15 &&
        !oklabBrownCheck(color),
    );

  // and then we can get the most saturated one!
  const newSecondary = secondaryCandidates.sort(
    (a, b) => oklabSaturation(b) - oklabSaturation(a),
  )[0];

  // if we found a better secondary choice, use that
  // otherwise just sort by saturation
  const palette = newSecondary
    ? [
        newSecondary,
        ...rawPalette.filter((color) => color !== newSecondary),
      ].filter(Boolean)
    : rawPalette.sort(
        (a, b) =>
          oklabSaturation(b) -
          oklabSaturation(a) -
          (oklabBrownCheck(b) ? 100 : 0), // harsh penalty for being brown
      );
  window.palette = palette;

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
  return rgbToString({
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
    a: color.alpha || 1,
  });
}

const printOklab = ({ l, a, b }: Oklab) => {
  const rgb = oklabToRgbString({ l, a, b, mode: "oklab" });
  console.log(`%c oklab(${l}, ${a}, ${b})`, `background-color: ${rgb}`);
};

window.printOklab = printOklab;

window.printPalette = (palette: Oklab[]) => {
  palette.forEach(printOklab);
};
