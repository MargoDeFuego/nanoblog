<template>
  <section>
    <h1>{{ isEdit ? 'Редактирование' : 'Создание' }} палитры</h1>
    <input v-model="palette.name" placeholder="Название палитры" />

    <div class="colors">
      <div v-for="(color, index) in palette.colors" :key="color.id" class="color-row">
        <ColorSwatch :color="color" />
        <input v-model="color.hex" />
        <button @click="removeColor(index)">✖️</button>
      </div>
    </div>

    <button @click="addColor">➕ Добавить цвет</button>
    <button @click="save">💾 Сохранить</button>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { fetchPaletteById, savePalette } from '@/services/paletteApi';
import type { ColorPalette } from '@/types/palette';
import ColorSwatch from '@/components/ColorSwatch.vue';

const route = useRoute();
const router = useRouter();
const isEdit = !!route.params.id;

const palette = ref<ColorPalette>({
  id: route.params.id?.toString() || crypto.randomUUID(),
  name: '',
  colors: []
});

onMounted(async () => {
  if (isEdit) {
    const existing = await fetchPaletteById(palette.value.id);
    if (existing) palette.value = existing;
  }
});

function addColor() {
  palette.value.colors.push({
    id: crypto.randomUUID(),
    hex: '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6, '0'),
    rgb: { r: 0, g: 0, b: 0 },
    hsl: { h: 0, s: 0, l: 0 }
  });
}

function removeColor(index: number) {
  palette.value.colors.splice(index, 1);
}

async function save() {
  await savePalette(palette.value);
  router.push('/');
}
</script>

<style scoped>
.colors {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.color-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>