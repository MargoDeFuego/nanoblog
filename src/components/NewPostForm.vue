<template>
  <p v-if="loading" class="info">⏳ Отправка...</p>
  <p v-if="successMessage" class="success">{{ successMessage }}</p>
  <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

  <form @submit.prevent="submit">
    <input v-model="title" placeholder="Заголовок" required />
    <textarea v-model="content" placeholder="Содержание" required></textarea>
    <button type="submit" :disabled="loading">Добавить</button>
    <button type="button" @click="clearDraft" :disabled="loading">Сбросить черновик</button>

  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

const emit = defineEmits(['add'])

const title = ref('')
const content = ref('')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const clearDraft = () => {
  localStorage.removeItem('postDraft')
  title.value = ''
  content.value = ''
}


onMounted(() => {
  const savedDraft = localStorage.getItem('postDraft')
  if (savedDraft) {
    const { title: t, content: c } = JSON.parse(savedDraft)
    title.value = t
    content.value = c
  }
})

watch([title, content], ([newTitle, newContent]) => {
  const draft = {
    title: newTitle,
    content: newContent
  }
  localStorage.setItem('postDraft', JSON.stringify(draft))
})

const submit = async () => {
  if (!title.value.trim() || !content.value.trim()) {
    errorMessage.value = 'Пожалуйста, заполните все поля.'
    successMessage.value = ''
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  const newPost = {
    title: title.value,
    content: content.value,
    author: { id: 1, name: 'Margo' },
    createdAt: new Date().toISOString(),
    published: true
  }

  try {
    const res = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })

    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`)
    }

    emit('add', newPost)
    successMessage.value = 'Пост успешно добавлен!'
    localStorage.removeItem('postDraft')
    title.value = ''
    content.value = ''
  } catch (error) {
    errorMessage.value = 'Ошибка при отправке. Попробуйте ещё раз.'
  } finally {
    loading.value = false
  }
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
