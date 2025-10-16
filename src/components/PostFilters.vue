<template>
  <div class="filters">
    <input
      type="text"
      v-model="query"
      placeholder="🔍 Поиск по заголовку..."
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

// 🔔 Объявляем событие
const emit = defineEmits(['search'])

// 🔍 Состояние поля
const query = ref('')

// ⏳ Функция debounce
function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// Обёртка для emit с задержкой
const debouncedSearch = debounce((value: string) => {
  console.log('Поиск отправлен:', value) // ← отладка
  emit('search', value)
}, 500)


// Следим за изменениями query
watch(query, (newValue) => {
  debouncedSearch(newValue)
})
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
