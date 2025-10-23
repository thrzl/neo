import type { Rgb, Oklab } from "culori/fn";
import { convertRgbToOklab, convertOklabToRgb } from "culori/fn";

const printOklab = ({ l, a, b }: Oklab) => {
  const rgb = oklabToRgbString({ l, a, b, mode: "oklab" });
  console.log(`%c oklab(${l}, ${a}, ${b})`, `background-color: ${rgb}`);
};

window.printOklab = printOklab;

window.printPalette = (palette: Oklab[]) => {
  palette.forEach(printOklab);
};

// palette of bipolar - beige
export const defaultPalette: Rgb[] = [
  { r: 189, g: 149, b: 93, mode: "rgb" },
  { r: 114, g: 113, b: 168, mode: "rgb" },
  { r: 127, g: 174, b: 98, mode: "rgb" },
  { r: 57, g: 82, b: 38, mode: "rgb" },
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

  const isOrange = hue > 40 && hue < 80;
  const isDark = color.l / 100 < 0.6;
  const isDull = chroma / 100 < 0.03;

  console.log(`isOrange: ${isOrange} (hue: ${hue})`);
  console.log(`isDark: ${isDark} (luminance: ${color.l})`);
  console.log(`isDull: ${isDull} (chroma: ${chroma / 100})`);

  return isOrange && isDark && isDull; // its prolly brown
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

  // now we should check if all but one color is roughly achromatic. if not, then we shouldnt care about browns
  const shouldBrownCheck = !(
    rawPalette.filter((color) => Math.sqrt(color.a ** 2 + color.b ** 2) > 0.03)
      .length < 2 &&
    oklabBrownCheck(
      rawPalette.toSorted((a, b) => oklabSaturation(b) - oklabSaturation(a))[0],
    )
  );

  console.log(`shouldBrownCheck: ${shouldBrownCheck}`);

  // then we can find colors with a hue difference of less than 15 deg.. (and theyre not brown)
  const secondaryCandidates = rawPalette.filter(
    (color) =>
      Math.abs(oklabHue(color) - trueSecondaryHue) <= 15 &&
      (shouldBrownCheck ? !oklabBrownCheck(color) : true),
  );

  // and then we can get the most saturated one!
  const newSecondary = secondaryCandidates.sort(
    (a, b) => oklabSaturation(b) - oklabSaturation(a),
  )[0];

  // if we found a better secondary choice, use that
  // otherwise just sort by saturation
  const saturationSort = (a: Oklab, b: Oklab) =>
    oklabSaturation(b) -
    oklabSaturation(a) -
    (shouldBrownCheck && oklabBrownCheck(b) ? 100 : 0); // harsh penalty for being brown
  const palette = newSecondary
    ? [
        newSecondary,
        ...rawPalette.filter((color) => color !== newSecondary),
      ].filter(Boolean)
    : rawPalette;
  palette.sort(saturationSort);
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
