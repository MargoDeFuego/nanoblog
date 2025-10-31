<template>
  <section class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">🧩 Проверка доступности (WCAG контраст)</h1>

    <div class="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div class="flex items-center gap-2">
        <label class="w-20">Фон:</label>
        <input type="color" v-model="bgHex" class="w-12 h-12 border rounded" />
        <input type="text" v-model="bgHex" class="border p-2 rounded w-28" />
      </div>

      <div class="flex items-center gap-2">
        <label class="w-20">Текст:</label>
        <input type="color" v-model="textHex" class="w-12 h-12 border rounded" />
        <input type="text" v-model="textHex" class="border p-2 rounded w-28" />
      </div>

      <button
        @click="checkContrast"
        class="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Проверить
      </button>
    </div>

    <div
      v-if="result"
      class="p-6 rounded-lg shadow text-center"
      :style="{ backgroundColor: bgHex, color: textHex }"
    >
      <p class="text-lg font-bold mb-2">Тестовая надпись</p>
      <p>Коэффициент контраста: {{ result.ratio }}:1</p>
      <p :class="{ 'text-green-700': result.wcagAA, 'text-red-700': !result.wcagAA }">
        WCAG AA: {{ result.wcagAA ? '✅ проходит' : '❌ не проходит' }}
      </p>
      <p :class="{ 'text-green-700': result.wcagAAA, 'text-red-700': !result.wcagAAA }">
        WCAG AAA: {{ result.wcagAAA ? '✅ проходит' : '❌ не проходит' }}
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { hexToRgb } from '@/utils/colorConversion'
import { contrastRatio } from '@/utils/contrast'

type ContrastResult = {
  ratio: number
  wcagAA: boolean // >= 4.5
  wcagAAA: boolean // >= 7
}

const bgHex = ref('#ffffff')
const textHex = ref('#000000')
const result = ref<ContrastResult | null>(null)

function checkContrast() {
  const bg = hexToRgb(bgHex.value)
  const text = hexToRgb(textHex.value)
  const ratio = contrastRatio(bg, text)
  result.value = {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
  }
}
</script>
