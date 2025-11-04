<template>
  <form @submit.prevent="submit">
    <h3>Редактировать пост</h3>
    <input v-model="title" placeholder="Заголовок" required />
    <textarea v-model="content" placeholder="Содержание" required></textarea>
    <button type="submit" :disabled="loading">Сохранить</button>
    <button type="button" class="danger" @click="resetDraft">Сбросить черновик</button>

     <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'

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
const errorMessage = ref<string | null>(null) // ⚠️ добавлено поле ошибки

// ключ для локального черновика
const draftKey = computed(() => {
  const key = props.post?.id ? `editDraft_${props.post.id}` : ''
  console.log('🔑 [EditPostForm] draftKey =', key)
  return key
})

// следим за изменением поста
watch(() => props.post, (newPost) => {
  const savedDraft = localStorage.getItem(draftKey.value)
  if (savedDraft) {
    try {
      const parsed = JSON.parse(savedDraft)
      title.value = parsed.title ?? newPost.title
      content.value = parsed.content ?? newPost.content
      console.log('♻️ Восстановлен черновик для', draftKey.value, parsed)
    } catch {
      title.value = newPost.title
      content.value = newPost.content
    }
  } else {
    title.value = newPost.title
    content.value = newPost.content
  }
}, { immediate: true })

// debounce helper
function debounce<T extends (...args: any[]) => void>(fn: T, delay = 500) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}

// реальная функция сохранения
function saveDraft() {
  if (!draftKey.value) return
  const draft = { title: title.value, content: content.value }
  try {
    localStorage.setItem(draftKey.value, JSON.stringify(draft))
    console.log('💾 [EditPostForm] Черновик сохранён:', draftKey.value, draft)
  } catch (e) {
    console.warn('⚠️ [EditPostForm] Не удалось записать черновик:', e)
  }
}

// обёртка с debounce
const saveDraftDebounced = debounce(saveDraft, 500)

// автосохранение при каждом изменении
watch([title, content], ([t, c]) => {
  const draft = JSON.stringify({ title: t, content: c })
  localStorage.setItem(draftKey.value, draft)
  console.log('✏️ [EditPostForm] Detected change, triggering autosave...')
  saveDraftDebounced()
})

// восстановление при монтировании
onMounted(() => {
  console.log('🟢 EditPostForm открыт для поста', props.post.id)
})

// 🧾 отправка формы с обработкой ошибок
const submit = async () => {
  loading.value = true
  errorMessage.value = null // сбрасываем предыдущие ошибки

  const updatedPost = {
    ...props.post,
    title: title.value,
    content: content.value,
    updatedAt: new Date().toISOString()
  }

  try {
    const res = await fetch(`http://localhost:3000/posts/${props.post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })

    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`)
    }

    // удаляем черновик при успешном сохранении
    localStorage.removeItem(draftKey.value)
    emit('updated')
    console.log('✅ [EditPostForm] Пост успешно обновлён')
  } catch (err: any) {
    console.error('❌ [EditPostForm] Сервер недоступен или ошибка:', err)
    errorMessage.value = '⚠️ Сервер недоступен. Попробуйте позже.'
  } finally {
    loading.value = false
  }
}

// сброс черновика с алертом 
// // const resetDraft = () => { 
// // if (confirm('Удалить черновик и вернуть оригинал поста?')) { 
// // localStorage.removeItem(draftKey.value) 
// // title.value = props.post.title 
// // content.value = props.post.content 
// // console.log(🧹 [EditPostForm] Черновик сброшен (${draftKey.value})) 
// // } 
// // }

// сброс черновика без подтверждения
const resetDraft = () => {
  localStorage.removeItem(draftKey.value)
  title.value = props.post.title
  content.value = props.post.content
  console.log(`🧹 [EditPostForm] Черновик сброшен (${draftKey.value})`)
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
.error {
  color: #e74c3c;
  margin-top: 10px;
  text-align: center;
}
</style>
