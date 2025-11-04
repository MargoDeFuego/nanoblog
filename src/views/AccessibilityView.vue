<template>
  <h1 class="text-2xl font-bold mb-4">🧩 Проверка доступности (WCAG контраст)</h1>
  <section class="p-6 max-w-3xl mx-auto">
    

    <!-- Ввод цветов -->
    <div class="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div class="flex items-center gap-2">
        <label class="w-20">Фон:</label>
        <input type="color" v-model="bgHex" class="w-12 h-12 border rounded cursor-pointer" />
        <input type="text" v-model="bgHex" class="border p-2 rounded w-28" />
      </div>

      <div class="flex items-center gap-2">
        <label class="w-20">Текст:</label>
        <input type="color" v-model="textHex" class="w-12 h-12 border rounded cursor-pointer" />
        <input type="text" v-model="textHex" class="border p-2 rounded w-28" />
      </div>

      <!-- Кнопку можно оставить как ручной пересчет -->
      <!-- <button
        @click="checkContrast"
        class="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
      >
        Проверить
      </button> -->
    </div>

    <!-- Результат -->
    <div
      v-if="result"
      class="p-6 rounded-lg shadow text-center transition-all duration-300"
      :style="{ backgroundColor: bgHex, color: textHex }"
    >
      <p class="text-lg font-bold mb-2">Тестовая надпись</p>
      <p>Коэффициент контраста: <b>{{ result.ratio.toFixed(2) }}</b>:1</p>

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
import { ref, watch } from 'vue'
import { hexToRgb } from '@/utils/colorConversion'
import { contrastRatio } from '@/utils/contrast'

type ContrastResult = {
  ratio: number
  wcagAA: boolean
  wcagAAA: boolean
}

const bgHex = ref('#ffffff')
const textHex = ref('#000000')
const result = ref<ContrastResult | null>(null)

// Основная функция проверки контраста
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

// Автоматический пересчет при каждом изменении цвета
watch([bgHex, textHex], () => {
  checkContrast()
}, { immediate: true })
</script>
<style>
 .max-w-3xl {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
 }
</style>
