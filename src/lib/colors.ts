import { Vibrant } from "node-vibrant/browser";
import type { Palette } from "@vibrant/color";

export async function getDominantColor(image: HTMLImageElement): Promise<Palette> {
    const vibrant = new Vibrant(image.src)
    return await vibrant.getPalette()
}