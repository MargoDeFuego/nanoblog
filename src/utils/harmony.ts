import type { Color } from '@/types/color';
import { hslToRgb, rgbToHex } from '@/utils/colorConversion';

export function generateAnalogous(base: Color): Color[] {
  const { h, s, l } = base.hsl;
  const offsets = [-30, 30];

  return offsets.map((offset) => {
    const newHue = (h + offset + 360) % 360;
    const rgb = hslToRgb(newHue, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    return {
      id: crypto.randomUUID(),
      hex,
      rgb,
      hsl: { h: newHue, s, l }
    };
  });
}

