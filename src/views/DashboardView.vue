<template>
  <section>
    <h1>Панель управления</h1>
    <div v-if="loading">Загрузка палитр...</div>
    <div v-else-if="error">Ошибка: {{ error }}</div>
    <div v-else-if="palettes.length === 0">Нет сохранённых палитр</div>
    <ul v-else class="control_panel">
  <li v-for="palette in palettes" :key="palette.id" @mouseenter="console.log('ID:', palette.id)">

    <strong>{{ palette.name }}</strong>
    <div class="colors">
      <ColorSwatch v-for="c in palette.colors" :key="c.id" :color="c" />
    </div>
    <router-link :to="`/editor/${palette.id}`">✏️ Редактировать</router-link>
    <button @click="remove(palette.id)">🗑 Удалить</button>
    <div>{{ console.log('ID:', palette.id) }}</div>
  </li>
</ul>в
  </section>
</template>

<style>
.control_panel {
  display: flex;
  list-style: none;
  flex-direction: column;

}
.control_panel li{
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: flex-end;

}
.control_panel li .colors{
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

}
.control_panel li strong{
  margin-right: auto;


}
</style>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { fetchPalettes } from '@/services/paletteApi';
import type { ColorPalette } from '@/types/palette';

import ColorSwatch from '@/components/ColorSwatch.vue';
import { deletePalette } from '@/services/paletteApi';

async function remove(id: string) {
  await deletePalette(id);
  palettes.value = palettes.value.filter(p => p.id !== id);
}

const palettes = ref<ColorPalette[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    palettes.value = await fetchPalettes();
  } catch (e) {
    error.value = 'Не удалось загрузить палитры';
  } finally {
    loading.value = false;
  }
});
</script>