<template>
  <div class="filters">
    <input
      type="text"
      v-model="query"
      @input="$emit('search', query)"
      placeholder="🔍 Поиск по заголовку..."
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')
defineEmits(['search'])
</script>

<style scoped>
.filters {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

input {
  padding: 0.6rem 1rem;
  width: 100%;
  max-width: 500px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
  background-color: #fff;
  color: #333;
}

input::placeholder {
  color: #999;
}

</style>



