import { defineStore } from 'pinia';
import { shallowRef } from 'vue';
import { ColorPalette } from '../types/palette';

export const usePaletteStore = defineStore('palette', () => {
  const palettes = shallowRef<ColorPalette[]>([]);
  return { palettes };
});