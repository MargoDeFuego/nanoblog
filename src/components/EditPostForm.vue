<template>
  <form @submit.prevent="submit">
    <h3>Редактировать пост</h3>
    <input v-model="title" placeholder="Заголовок" required />
    <textarea v-model="content" placeholder="Содержание" required></textarea>
    <button type="submit" :disabled="loading">Сохранить</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  post: {
    id: number
    title: string
    content: string
  }
}>()

const emit = defineEmits(['updated'])

const title = ref('')
const content = ref('')
const loading = ref(false)

watch(() => props.post, (newPost) => {
  title.value = newPost.title
  content.value = newPost.content
}, { immediate: true })

const submit = async () => {
  loading.value = true

  const updatedPost = {
    ...props.post,
    title: title.value,
    content: content.value,
    updatedAt: new Date().toISOString()
  }

  await fetch(`http://localhost:3000/posts/${props.post.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost)
  })

  emit('updated')
  loading.value = false
}
</script>

<style scoped>
form {
display: flex;
width: 100%;
max-width: 600px;
flex-direction: column;
justify-content: center;
margin: 0 auto 60px;
gap: 20px;
}
textarea{
  height: 150px;
}

</style>