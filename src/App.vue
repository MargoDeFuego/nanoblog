<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

import PostList from './components/PostList.vue'
import NewPostForm from './components/NewPostForm.vue'
import EditPostForm from './components/EditPostForm.vue'
// import PostFilters from './components/PostFilters.vue'

const posts = ref<any[]>([])
const searchQuery = ref('')
const selectedPost = ref<any | null>(null)

const EDITING_KEY = 'editingPostId' // ключ для localStorage

// 🔄 Загрузка постов
const fetchPosts = async () => {
  try {
    const res = await fetch('http://localhost:3000/posts')
    if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`)
    posts.value = await res.json()
  } catch (error) {
    console.error('Ошибка при загрузке постов:', error)
  }
}

// 🔍 Поиск
const filteredPosts = computed(() =>
  posts.value.filter(p =>
    p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

// 🗑️ Удаление поста
const deletePost = async (id: number) => {
  try {
    await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' })

    // если удалили редактируемый пост — очищаем хранилище
    const editingId = localStorage.getItem(EDITING_KEY)
    if (editingId && Number(editingId) === id) {
      localStorage.removeItem(EDITING_KEY)
      selectedPost.value = null
    }

    await fetchPosts()
  } catch (error) {
    console.error('Ошибка при удалении поста:', error)
  }
}

// ✏️ Начало редактирования поста
const startEditPost = (post: any) => {
  console.log('🖊️ [App.vue] startEditPost called with:', post)
  console.log('▶ [App.vue] startEditPost called for post id:', post?.id)
  selectedPost.value = { ...post } // делаем копию, чтобы не менять оригинал
  localStorage.setItem(EDITING_KEY, String(post.id))
  console.log('✏️ Начато редактирование поста', post.id)
}

// ✅ После сохранения поста
const onPostUpdated = async () => {
  console.log('✅ Пост сохранён и форма закрыта')
  selectedPost.value = null
  localStorage.removeItem(EDITING_KEY)
  await nextTick(fetchPosts)
}

// 📦 При монтировании: загрузка постов и восстановление редактируемого
onMounted(async () => {
  console.log('🌀 [App.vue] onMounted - fetching posts...')
  await fetchPosts()

  const editingId = localStorage.getItem(EDITING_KEY)
  console.log('🧩 [App.vue] editingId from localStorage =', editingId)
  if (editingId) {
    const id = Number(editingId)
    const found = posts.value.find(p => p.id === id)
    console.log('🔍 [App.vue] found post for restore =', found)
    if (found) {
      selectedPost.value = found
      console.log('♻️ Восстановлено редактирование поста', id)
    } else {
      console.warn('⚠️ [App.vue] No post found for saved editingId, removing key')
      localStorage.removeItem(EDITING_KEY)
      console.log('❌ [App.vue] No post found for stored id — cleanup done')
    }
  }
})
</script>

<template>
  <!-- <PostFilters @search="searchQuery = $event" /> -->
  <NewPostForm @add="fetchPosts" />

  <PostList
    v-if="!selectedPost"
    :posts="filteredPosts"
    @edit="startEditPost"
    @delete="deletePost"
    @refresh="fetchPosts"
  />

  <EditPostForm
    v-else
    :post="selectedPost"
    @updated="onPostUpdated"
  />
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #42b983;
}

.info {
  color: #3498db;
  text-align: center;
  margin-bottom: 1rem;
}

.success {
  color: #2ecc71;
  text-align: center;
  margin-bottom: 1rem;
}

.error {
  color: #e74c3c;
  text-align: center;
  margin-bottom: 1rem;
}
</style>
