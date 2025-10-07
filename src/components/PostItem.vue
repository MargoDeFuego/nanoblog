<template>
  <article class="post-item">
    <h2>{{ post.title }}</h2>
    <p>{{ post.content }}</p>
    <div class="actions">
      <button @click="$emit('edit', post.id)">Редактировать</button>
      <button @click="$emit('delete', post.id)">Удалить</button>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{
  post: {
    id: number
    title: string
    content: string
  }
}>()

defineEmits(['edit', 'delete'])
</script>

<style scoped>
.post-item {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  background: #f9f9f9;
}

.post-item h2 {
  margin: 0 0 0.5rem;
}

.actions {
  margin-top: 1rem;
  display: flex;
  gap: 0.5rem;
}

button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #eee;
}
</style>
