<template>
  <p v-if="loading" class="info">⏳ Отправка...</p>
  <p v-if="successMessage" class="success">{{ successMessage }}</p>
  <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

  <form @submit.prevent="submit">
    <input v-model="title" placeholder="Заголовок" required />
    <textarea v-model="content" placeholder="Содержание" required></textarea>
    <input v-model="authorName" placeholder="Имя автора" required />

    <p class="timestamp">🕒 Время добавления: {{ formattedDate }}</p>

    <button type="submit" :disabled="loading">Добавить</button>
    <button type="button" @click="clearDraft" :disabled="loading">Сбросить черновик</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'

const emit = defineEmits(['add'])

const title = ref('')
const content = ref('')
const authorName = ref('Margo')
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const createdAt = ref(new Date())

const formattedDate = computed(() =>
  createdAt.value.toLocaleString('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
)

const clearDraft = () => {
  localStorage.removeItem('postDraft')
  title.value = ''
  content.value = ''
  authorName.value = ''
}

onMounted(() => {
  const savedDraft = localStorage.getItem('postDraft')
  if (savedDraft) {
    try {
      const { title: t, content: c, authorName: a } = JSON.parse(savedDraft)
      title.value = t || ''
      content.value = c || ''
      authorName.value = a || ''
    } catch (e) {
      console.warn('Ошибка при чтении черновика:', e)
    }
  }
})

function debounce(fn: Function, delay: number) {
  let timer: ReturnType<typeof setTimeout>
  return (...args: any[]) => {
    clearTimeout(timer)
    timer = setTimeout(() => { 
      console.log ('debounce triggered') 
      fn(...args)}, delay)
    
  }
}

const saveDraftDebounced = debounce(() => {
  const draft = {
    title: title.value,
    content: content.value,
    authorName: authorName.value
  }
  localStorage.setItem('postDraft', JSON.stringify(draft))
}, 500)

watch([title, content, authorName], saveDraftDebounced)

const submit = async () => {
  if (!title.value.trim() || !content.value.trim() || !authorName.value.trim()) {
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
    author: { id: 1, name: authorName.value },
    createdAt: createdAt.value.toISOString(),
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
    authorName.value = ''
    createdAt.value = new Date()
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

textarea {
  height: 150px;
}

.timestamp {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 10px;
}

.success {
  color: green;
  font-weight: bold;
}

.error {
  color: red;
  font-weight: bold;
}

.info {
  color: #555;
}
</style>
