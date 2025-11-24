// src/utils/colorUtils.ts

export function hexToRgb(hex: string) {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
}

export function getBrightness(hex: string): number {
  const { r, g, b } = hexToRgb(hex);

  // формула относительной яркости
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

export function isDark(hex: string): boolean {
  return getBrightness(hex) < 128;
}
