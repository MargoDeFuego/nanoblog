<template>
  <form @submit.prevent="submit">
    <input v-model="title" placeholder="Заголовок" required />
    <textarea v-model="content" placeholder="Содержание" required></textarea>
    <button type="submit" :disabled="loading">Добавить</button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const title = ref('')
const content = ref('')
const loading = ref(false)

defineEmits(['add'])

const submit = async () => {
  if (!title.value || !content.value) return

  loading.value = true

  const newPost = {
    title: title.value,
    content: content.value,
    author: { id: 1, name: 'Margo' },
    createdAt: new Date().toISOString(),
    published: true
  }

  await fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost)
  })

  
const emit = defineEmits(['add'])

emit('add', newPost)


  title.value = ''
  content.value = ''
  loading.value = false
}
</script>
