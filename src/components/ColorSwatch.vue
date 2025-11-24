<template>
  <div
    class="swatch"
    :style="{ backgroundColor: color.hex }"
    :title="color.hex"
    :class="{ dark }"
  ></div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Color } from '@/types/color'
import { isDark } from '@/utils/colorUtils'

// получаем пропсы
const props = defineProps<{ color: Color }>()

// вычисляем тёмный цвет или нет
const dark = computed(() => isDark(props.color.hex))

// отслеживаем изменение
watch(dark, (value) => {
  console.log('🌓 Тёмный цвет?', value)
})
</script>

<style scoped>
.swatch {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
}

/* если цвет тёмный — добавляем стиль */
.swatch.dark {
  border-color: black;
}
</style>
