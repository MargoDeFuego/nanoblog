import axios from 'axios';
import { ColorPalette } from '../types/palette';

const BASE_URL = 'http://localhost:3000/palettes';

export async function fetchPalettes(): Promise<ColorPalette[]> {
  const res = await axios.get(BASE_URL);
  return res.data;
}

export async function fetchPaletteById(id: string): Promise<ColorPalette | null> {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
}

export async function savePalette(palette: ColorPalette): Promise<void> {
  await axios.post(BASE_URL, palette);
}

export async function deletePalette(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/${String(id)}`);
}