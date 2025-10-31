<template>
  <section class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">🎨 Цветовые гармонии</h1>

    <!-- Ввод и выбор цвета -->
    <div class="flex items-center gap-3 mb-6">
      <input
        v-model="baseHex"
        type="text"
        class="border p-2 rounded w-32 text-center"
        placeholder="#ff0000"
      />
      <input
        type="color"
        v-model="baseHex"
        class="w-12 h-12 border rounded cursor-pointer"
      />
      <select v-model="schemeType" class="border p-2 rounded">
        <option value="analogous">Аналогичные</option>
        <option value="complementary">Дополнительные</option>
        <option value="triadic">Триадные</option>
      </select>
      <button @click="generate" class="bg-blue-600 text-white px-4 py-2 rounded shadow">
        Создать гармонии
      </button>
    </div>

    <!-- Отображение цветов -->
    <div v-if="colors.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="c in colors"
        :key="c.id"
        class="rounded-lg shadow p-3 text-center transition-transform hover:scale-105"
        :style="{ backgroundColor: c.hex, color: textColor(c.rgb) }"
      >
        <div class="font-bold mb-1">{{ c.hex }}</div>
        <div class="text-sm">Контраст с базовым: {{ contrast(c) }}:1</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { hexToRgb, rgbToHsl } from '@/utils/colorConversion'
import { generateColorSchemes } from '@/utils/colorSchemes'
import { contrastRatio } from '@/utils/contrast'
import type { Color } from '@/types/color'

const baseHex = ref('#ff0000')
const schemeType = ref<'analogous' | 'complementary' | 'triadic'>('analogous')
const colors = ref<Color[]>([])

function generate() {
  const rgb = hexToRgb(baseHex.value)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const baseColor: Color = { id: crypto.randomUUID(), hex: baseHex.value, rgb, hsl }
  const schemes = generateColorSchemes(baseColor)
  colors.value = schemes[schemeType.value]
}

function contrast(color: Color) {
  const baseRgb = hexToRgb(baseHex.value)
  return contrastRatio(baseRgb, color.rgb)
}

function textColor(rgb: { r: number; g: number; b: number }) {
  const L = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b
  return L > 128 ? '#000' : '#fff'
}
</script>

<style scoped>
.grid div {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
