<template>
  <section>
    <h1>{{ isEdit ? 'Редактирование' : 'Создание' }} палитры</h1>

    <div v-if="loading">⏳ Загрузка...</div>
    <div v-else>
      <input
        v-model="palette.name"
        placeholder="Название палитры"
        required
      />

      <div class="colors">
        
            <div
    v-for="(color, index) in palette.colors"
    :key="color.id"
    class="color-row"
  >
    <ColorSwatch :color="color" />
    <input type="color" v-model="color.hex" @input="updateFromHex(color)" />
    <button @click="removeColor(index)">✖️</button>
    <button @click="createSchemes(color)">🎨 Схемы</button>
  </div>
      </div>

   

      <button @click="addColor">➕ Добавить цвет</button>
      <button @click="save">💾 Сохранить</button>
    </div>

   

    <p v-if="error" class="error">{{ error }}</p>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ColorPalette, Color } from '@/types/palette'
import ColorSwatch from '@/components/ColorSwatch.vue'
import { hexToRgb, rgbToHsl } from '@/utils/colorConverters'
import { generateColorSchemes } from '@/utils/colorSchemes'

const route = useRoute()
const router = useRouter()
const isEdit = !!route.params.id

const loading = ref(false)
const error = ref('')

const palette = ref<ColorPalette>({
  id: route.params.id?.toString() || crypto.randomUUID(),
  name: '',
  colors: []
})

function createSchemes(color: Color) {
  const schemes = generateColorSchemes(color.hsl)
  console.log('🎨 Generated schemes:', schemes)

  // например, можно добавить цвета из аналогичной палитры
  palette.value.colors.push(...schemes.analogous)
}

// ============================
// 🔹 Загрузка палитры по ID
// ============================
onMounted(async () => {
  if (isEdit) {
    try {
      loading.value = true
      const res = await fetch(`http://localhost:3000/palettes/${palette.value.id}`)
      if (!res.ok) throw new Error('Ошибка загрузки палитры')
      palette.value = await res.json()
    } catch (e: any) {
      error.value = e.message || 'Ошибка загрузки'
    } finally {
      loading.value = false
    }
  }
})

// ============================
// 🔹 Добавление цвета вручную
// ============================
function addColor() {
  palette.value.colors.push({
    id: crypto.randomUUID(),
    hex: '#000000',
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 }
  })
}

// ============================
// 🔹 Удаление цвета
// ============================
function removeColor(index: number) {
  palette.value.colors.splice(index, 1)
}

// ============================
// 🔹 Обновление RGB/HSL по HEX
// ============================
// Используем утилиты: hexToRgb(hex) -> {r,g,b}, затем rgbToHsl({r,g,b}) -> {h,s,l}
function updateFromHex(color: Color) {
  const hex = (color.hex || '').replace('#', '')
  if (hex.length === 6) {
    const rgb = hexToRgb('#' + hex) // hexToRgb ожидает строку с '#'
    color.rgb = rgb
    color.hsl = rgbToHsl(rgb)
    // Нормализуем hex в виде "#rrggbb"
    color.hex = '#' + hex.toLowerCase()
  }
}

// ============================
// 🔹 Сохранение палитры
// ============================
async function save() {
  try {
    loading.value = true
    const method = isEdit ? 'PUT' : 'POST'
    const url = isEdit
      ? `http://localhost:3000/palettes/${palette.value.id}`
      : 'http://localhost:3000/palettes'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(palette.value)
    })

    if (!res.ok) throw new Error(`Ошибка сохранения (${res.status})`)
    router.push('/')
  } catch (e: any) {
    error.value = e.message || 'Ошибка сохранения палитры'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.colors {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.color-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.hex-input {
  width: 80px;
}
.error {
  color: red;
  margin-top: 1rem;
}
</style>
