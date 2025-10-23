<template>
  <section>
    <h1>Проверка доступности</h1>
    <input v-model="hex1" placeholder="#000000" />
    <input v-model="hex2" placeholder="#ffffff" />
    <button @click="check">Проверить</button>

    <div v-if="ratio !== null">
      <p>Коэффициент контрастности: {{ ratio.toFixed(2) }}</p>
      <p v-if="ratio >= 4.5">✅ Проходит WCAG AA</p>
      <p v-else>❌ Недостаточный контраст</p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { hexToRgb, rgbToHsl } from '@/utils/colorConversion';
import { getContrastRatio } from '@/utils/contrast';
import type { Color } from '@/types/color';

const hex1 = ref('#000000');
const hex2 = ref('#ffffff');
const ratio = ref<number | null>(null);

function check() {
  const rgb1 = hexToRgb(hex1.value);
  const rgb2 = hexToRgb(hex2.value);
  const hsl1 = rgbToHsl(rgb1.r, rgb1.g, rgb1.b);
  const hsl2 = rgbToHsl(rgb2.r, rgb2.g, rgb2.b);

  const color1: Color = { id: '1', hex: hex1.value, rgb: rgb1, hsl: hsl1 };
  const color2: Color = { id: '2', hex: hex2.value, rgb: rgb2, hsl: hsl2 };

  ratio.value = getContrastRatio(color1, color2);
}
</script>