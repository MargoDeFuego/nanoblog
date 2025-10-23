<template>
  <div class="swatch" :style="{ backgroundColor: color.hex }" :title="color.hex"></div>
</template>

<script setup lang="ts">
import type { Color } from '@/types/color';
defineProps<{ color: Color }>();
</script>

<style scoped>
.swatch {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>