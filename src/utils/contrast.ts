// src/utils/contrast.ts
import type { RGB } from '@/types/color'

function luminance({ r, g, b }: RGB): number {
  const a = [r, g, b].map(v => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2]
}

/**
 * Возвращает коэффициент контрастности (например, 4.5 означает 4.5:1)
 */
export function contrastRatio(rgb1: RGB, rgb2: RGB): number {
  const L1 = luminance(rgb1)
  const L2 = luminance(rgb2)
  const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
  return Math.round(ratio * 100) / 100
}


// Основная функция контраста
export function getContrastRatio(
  rgb1: { r: number; g: number; b: number },
  rgb2: { r: number; g: number; b: number }
): number {
  const L1 = luminance(rgb1)
const L2 = luminance(rgb2)

return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)

}