import type { Color } from '@/types/color';

function luminance({ r, g, b }: { r: number; g: number; b: number }): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function getContrastRatio(c1: Color, c2: Color): number {
  const lum1 = luminance(c1.rgb);
  const lum2 = luminance(c2.rgb);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}