<template>
  <article class="post-item">
    <template v-if="!editing">
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>
      <p class="meta">👤 Автор: {{ post.author.name }}</p>
      <p class="meta">🕒 Дата: {{ formattedDate }}</p>
      <div class="actions">
        <button @click="startEditing">Редактировать</button>
        <button @click="$emit('delete', post.id)">Удалить</button>
      </div>
    </template>

    <form v-else @submit.prevent="submit">
      <h3>Редактировать пост</h3>
      <input v-model="title" placeholder="Заголовок" required />
      <textarea v-model="content" placeholder="Содержание" required></textarea>
      <input v-model="authorName" placeholder="Имя автора" required />
      <input type="datetime-local" v-model="createdAtLocal" required />

      <div class="actions">
        <button type="submit" :disabled="loading">Сохранить</button>
        <button type="button" @click="editing = false">Отмена</button>
      </div>
    </form>
  </article>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

function toLocalDateTimeInput(isoString: string): string {
  const date = new Date(isoString)
  const offset = date.getTimezoneOffset() * 60000 // в миллисекундах
  const local = new Date(date.getTime() - offset)
  return local.toISOString().slice(0, 16)
}


const startEditing = () => {
  editing.value = true
  console.log('🖊️ [PostItem] startEditing', props.post.id)
  emit('edit', props.post) // 🚀 отправляем наверх пост
}


const props = defineProps<{
  post: {
    id: number
    title: string
    content: string
    author: {
      id: number
      name: string
    }
    createdAt: string
  }
}>()

const emit = defineEmits(['delete', 'updated', 'edit']) // ✅ добавлено событие updated

const editing = ref(false)
const loading = ref(false)

const title = ref('')
const content = ref('')
const authorName = ref('')
const createdAtLocal = ref('')

watch(() => props.post, (newPost) => {
  title.value = newPost.title
  content.value = newPost.content
  authorName.value = newPost.author.name
  createdAtLocal.value = toLocalDateTimeInput(newPost.createdAt)
}, { immediate: true })

const formattedDate = computed(() =>
  new Date(props.post.createdAt).toLocaleString('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })
)

const submit = async () => {
  loading.value = true

  const updatedPost = {
    ...props.post,
    title: title.value,
    content: content.value,
    author: {
      ...props.post.author,
      name: authorName.value
    },
    createdAt: new Date(createdAtLocal.value).toISOString(), // сохраняем как UTC
    updatedAt: new Date().toISOString()
  }

  await fetch(`http://localhost:3000/posts/${props.post.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedPost)
  })

  emit('updated')
  editing.value = false
  loading.value = false
}

</script>

<style scoped>
.post-item {
  border: 1px solid #ccc;
  padding: 1rem;
  border-radius: 8px;
  background: #f9f9f9;
  margin-bottom: 1rem;
}

.post-item h2 {
  margin: 0 0 0.5rem;
}

.meta {
  font-size: 0.9rem;
  color: #666;
  margin: 0.2rem 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

textarea {
  height: 120px;
}

.actions {
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
