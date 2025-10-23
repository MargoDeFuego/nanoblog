<template>
  <section>
    <h1>Цветовые гармонии</h1>
    <input v-model="baseHex" placeholder="#ff0000" />
    <button @click="generate">Создать гармонии</button>

    <div v-if="colors.length">
      <h2>Аналогичные:</h2>
      <ul>
        <li v-for="c in colors" :key="c.id">{{ c.hex }}</li>
      </ul>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { hexToRgb, rgbToHsl } from '@/utils/colorConversion';
import { generateAnalogous } from '@/utils/harmony';
import type { Color } from '@/types/color';

const baseHex = ref('#ff0000');
const colors = ref<Color[]>([]);

function generate() {
  const rgb = hexToRgb(baseHex.value);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const baseColor: Color = {
    id: crypto.randomUUID(),
    hex: baseHex.value,
    rgb,
    hsl
  };
  colors.value = generateAnalogous(baseColor);
}
</script>