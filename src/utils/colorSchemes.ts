// src/utils/colorSchemes.ts
import { hslToRgb, rgbToHex } from '@/utils/colorConverters'
import type { Color } from '@/types/color'

export type HSL = { h: number; s: number; l: number }

/**
 * Принимает либо Color (объект), либо HSL.
 * Возвращает готовые массивы Color[] (включая id, hex, rgb, hsl).
 */
export function generateColorSchemes(input: Color | HSL) {
  // нормализуем вход к HSL
  const baseHsl: HSL = isColor(input) ? input.hsl : input

  const wrap = (v: number) => (v + 360) % 360
  const { h, s, l } = baseHsl

  const complementaryHsl: HSL[] = [{ h: wrap(h + 180), s, l }]
  const analogousHsl: HSL[] = [
    { h: wrap(h - 30), s, l },
    { h: wrap(h + 30), s, l }
  ]
  const triadicHsl: HSL[] = [
    { h: wrap(h + 120), s, l },
    { h: wrap(h + 240), s, l }
  ]

  function enrich(list: HSL[]): Color[] {
    return list.map(c => {
      const rgb = hslToRgb(c)   // предполагается: hslToRgb({h,s,l}) -> {r,g,b}
      const hex = rgbToHex(rgb) // rgbToHex({r,g,b}) -> "#rrggbb"
      return {
        id: crypto.randomUUID(),
        hex,
        rgb,
        hsl: c
      } as Color
    })
  }

  return {
    complementary: enrich(complementaryHsl),
    analogous: enrich(analogousHsl),
    triadic: enrich(triadicHsl)
  }
}

// type guard
function isColor(x: any): x is Color {
  return x && typeof x === 'object' && 'hsl' in x && 'hex' in x && 'rgb' in x
}
