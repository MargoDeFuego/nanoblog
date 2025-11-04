<template>
  <section class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-center">Интерактивный цветовой круг с гармониями</h1>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-6 mb-6">
      <!-- Цветовой круг (drag only) -->
      <canvas
        ref="colorWheel"
        width="260"
        height="260"
        class="cursor-grab rounded-full shadow-lg"
        @pointerdown.prevent="onPointerDown"
      ></canvas>

      <!-- Управление -->
      <div class="flex flex-col items-center gap-4 w-60">
        <div class="w-24 h-24 rounded-full border shadow" :style="{ backgroundColor: baseHex }"></div>

        <select v-model="schemeType" class="border p-2 rounded w-full text-center">
          <option value="analogous">Аналогичные</option>
          <option value="complementary">Дополнительные</option>
          <option value="triadic">Триадные</option>
        </select>

        <div class="w-full">
          <label class="text-sm text-gray-600">Насыщенность: {{ (saturation * 100).toFixed(0) }}%</label>
          <input type="range" min="0" max="1" step="0.01" v-model.number="saturation" class="w-full" />
        </div>

        <div class="w-full">
          <label class="text-sm text-gray-600">Яркость: {{ (lightness * 100).toFixed(0) }}%</label>
          <input type="range" min="0" max="1" step="0.01" v-model.number="lightness" class="w-full" />
        </div>
      </div>
    </div>

    <!-- Автоматическая цветовая гармония -->
    <div v-if="colors.length" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      <div
        v-for="c in colors"
        :key="c.id"
        class="rounded-lg shadow p-3 text-center transition-all duration-300"
        :style="{ backgroundColor: c.hex, color: textColor(c.rgb) }"
      >
        <div class="font-bold mb-1">{{ c.hex }}</div>
        <div class="text-sm">Контраст: {{ contrast(c).toFixed(2) }}:1</div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { hexToRgb, rgbToHsl, hslToRgb, hslToHex } from '@/utils/colorConversion'
import { generateColorSchemes } from '@/utils/colorSchemes'
import { contrastRatio } from '@/utils/contrast'
import type { Color } from '@/types/color'

/* --- состояния --- */
const baseHex = ref('#ff0000')
const schemeType = ref<'analogous' | 'complementary' | 'triadic'>('analogous')
const colors = ref<Color[]>([])
const colorWheel = ref<HTMLCanvasElement | null>(null)

const saturation = ref(1) // 0..1 (ползунок)
const lightness = ref(0.5) // 0..1 (ползунок)

/* маркер (позиция на canvas) */
const marker = ref<{ x: number; y: number }>({ x: 0, y: 0 })
const harmonyMarkers = ref<{ x: number; y: number; color: string }[]>([])

/* флаги drag */
const pointerActive = ref(false)

/* --- Вспомогательные --- */
function canvasCenterAndRadius() {
  const canvas = colorWheel.value
  if (!canvas) return { cx: 0, cy: 0, radius: 0 }
  const cx = canvas.width / 2
  const cy = canvas.height / 2
  const radius = Math.min(canvas.width, canvas.height) / 2
  return { cx, cy, radius }
}

/* --- отрисовка цветового круга --- */
function drawWheel() {
  const canvas = colorWheel.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  const { cx, cy, radius } = canvasCenterAndRadius()

  const img = ctx.createImageData(canvas.width, canvas.height)
  const data = img.data

  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const dx = x - cx
      const dy = y - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > radius) continue
      // hue by angle, sat by radial position
      let angle = Math.atan2(dy, dx) * 180 / Math.PI
      if (angle < 0) angle += 360
      const hue = angle
      const satPerc = (dist / radius) * 100 * saturation.value // scale radial sat by global saturation
      const lPerc = lightness.value * 100
      const rgb = hslToRgb(hue, satPerc, lPerc)
      const idx = (y * canvas.width + x) * 4
      data[idx] = rgb.r
      data[idx + 1] = rgb.g
      data[idx + 2] = rgb.b
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(img, 0, 0)

  // draw harmony markers and main marker on top
  drawHarmonyMarkers(ctx)
  drawMarker(ctx)
}

/* --- маркеры --- */
function drawMarker(ctx: CanvasRenderingContext2D) {
  const { x, y } = marker.value
  ctx.save()
  ctx.beginPath()
  ctx.arc(x, y, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.lineWidth = 2
  ctx.strokeStyle = '#000'
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(x, y, 3.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.restore()
}

function drawHarmonyMarkers(ctx: CanvasRenderingContext2D) {
  harmonyMarkers.value.forEach((m) => {
    ctx.save()
    ctx.beginPath()
    ctx.arc(m.x, m.y, 6, 0, Math.PI * 2)
    ctx.fillStyle = m.color
    ctx.fill()
    ctx.lineWidth = 1.5
    ctx.strokeStyle = 'rgba(255,255,255,0.9)'
    ctx.stroke()
    ctx.restore()
  })
}

/* --- расчёт позиции маркера по hue и saturation --- */
function setMarkerByHue(hue: number) {
  const canvas = colorWheel.value
  if (!canvas) return
  const { cx, cy, radius } = canvasCenterAndRadius()
  const rMarker = Math.max(8, (radius - 10) * saturation.value) // радиус для маркера зависит от ползунка насыщенности
  const angle = (hue * Math.PI) / 180
  marker.value = {
    x: cx + Math.cos(angle) * rMarker,
    y: cy + Math.sin(angle) * rMarker,
  }
}

/* --- обновляем маркеры гармоний (на основе hue) --- */
function updateHarmonyMarkers(baseHue: number) {
  const canvas = colorWheel.value
  if (!canvas) return
  const { cx, cy, radius } = canvasCenterAndRadius()
  const rMarker = Math.max(8, (radius - 10) * saturation.value)

  const offsets =
    schemeType.value === 'triadic'
      ? [120, 240]
      : schemeType.value === 'analogous'
      ? [-30, 30]
      : schemeType.value === 'complementary'
      ? [180]
      : []

  harmonyMarkers.value = offsets.map((off) => {
    const hue = (baseHue + off + 360) % 360
    const angle = (hue * Math.PI) / 180
    const x = cx + Math.cos(angle) * rMarker
    const y = cy + Math.sin(angle) * rMarker
    const colorHex = hslToHex(hue, saturation.value * 100, lightness.value * 100)
    return { x, y, color: colorHex }
  })
}

/* --- при движении указателя: рассчитываем hue по углу и ставим маркер на соответствующую окружность --- */
function handlePointerMove(clientX: number, clientY: number) {
  const canvas = colorWheel.value
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const { cx, cy, radius } = canvasCenterAndRadius()
  const x = clientX - rect.left
  const y = clientY - rect.top
  const dx = x - cx
  const dy = y - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist < 6) return // очень близко к центру — игнорируем
  // angle
  let angle = Math.atan2(dy, dx) * 180 / Math.PI
  if (angle < 0) angle += 360
  const hue = angle
  // выставляем маркер на окружность с радиусом, зависящим от saturation.value
  setMarkerByHue(hue)
  // собираем финальный HEX по текущим ползункам
  const sPerc = saturation.value * 100
  const lPerc = lightness.value * 100
  baseHex.value = hslToHex(hue, sPerc, lPerc)
  // обновляем схемы и маркеры
  updateSchemeInternal(hue)
  // перерисовываем
  drawWheel()
}

/* --- pointer handlers (pointer events — работают и при таче) --- */
function onPointerDown(e: PointerEvent) {
  pointerActive.value = true
  ;(e.target as Element).setPointerCapture?.(e.pointerId)
  handlePointerMove(e.clientX, e.clientY)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp, { once: true })
}

function onPointerMove(e: PointerEvent) {
  if (!pointerActive) return
  handlePointerMove(e.clientX, e.clientY)
}
function onPointerUp(e: PointerEvent) {
 pointerActive.value = false
  window.removeEventListener('pointermove', onPointerMove)
  // release capture if set
  try {
    (e.target as Element).releasePointerCapture?.(e.pointerId)
  } catch {}
}

/* --- обновление схемы (внутренний, принимает hue чтобы не переопределять) --- */
function updateSchemeInternal(optionalHue?: number) {
  // если optionalHue задан — используем его, иначе берем из baseHex
  let hue: number
  if (typeof optionalHue === 'number') hue = optionalHue
  else {
    const rgb = hexToRgb(baseHex.value)
    hue = rgbToHsl(rgb.r, rgb.g, rgb.b).h
  }

  const sPerc = saturation.value * 100
  const lPerc = lightness.value * 100
  // build baseColor using hue and current sliders
  const adjustedHex = hslToHex(hue, sPerc, lPerc)
  const rgb = hexToRgb(adjustedHex)
  const baseColor: Color = { id: crypto.randomUUID(), hex: adjustedHex, rgb, hsl: { h: hue, s: sPerc, l: lPerc } }
  const schemes = generateColorSchemes(baseColor)
  colors.value = schemes[schemeType.value]
  updateHarmonyMarkers(hue)
}

/* прокси-обёртка для внешнего вызова */
function updateScheme() {
  updateSchemeInternal()
}

/* --- утилиты --- */
function contrast(color: Color) {
  const baseRgb = hexToRgb(baseHex.value)
  return contrastRatio(baseRgb, color.rgb)
}
function textColor(rgb: { r: number; g: number; b: number }) {
  const L = 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b
  return L > 128 ? '#000' : '#fff'
}

/* горячая инициализация при mount */
onMounted(async () => {
  await nextTick()
  const canvas = colorWheel.value
  if (!canvas) return
  // выставляем маркер по текущему baseHex
  const rgb0 = hexToRgb(baseHex.value)
  const hsl0 = rgbToHsl(rgb0.r, rgb0.g, rgb0.b)
  setMarkerByHue(hsl0.h)
  updateSchemeInternal(hsl0.h)
  drawWheel()
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  window.removeEventListener('pointerup', onPointerUp)
})

/* --- реактивность: при смене ползунков или типа схемы пересчёт и перерисовка --- */
watch([saturation, lightness], () => {
  // нужно обновить позицию маркера (радиус) и перерисовать
  const rgb = hexToRgb(baseHex.value)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  setMarkerByHue(hsl.h) // изменяет координаты в соответствии с новым saturation
  updateSchemeInternal(hsl.h)
  drawWheel()
})

watch([schemeType], () => {
  // обновляем маркеры гармоний
  const rgb = hexToRgb(baseHex.value)
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
  updateSchemeInternal(hsl.h)
  drawWheel()
})
</script>

<style scoped>
canvas {
  border-radius: 50%;
  transition: box-shadow 0.15s;
}
canvas:active {
  cursor: grabbing;
}
input[type='range'] {
  accent-color: #3b82f6;
}
.grid div {
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
