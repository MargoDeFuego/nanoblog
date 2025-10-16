<template>
  <section class="post-list">
    <PostFilter @search="handleSearch" />

    <div v-if="filteredPosts.length === 0">Нет постов для отображения</div>
    <div v-else>
      <div class="post-count">Всего записей: {{ filteredPosts.length }}</div>

      <PostItem
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
        @delete="handleDelete"
        @updated="refreshPosts"
      />
    </div>
  </section>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import PostItem from './PostItem.vue'
import PostFilter from './PostFilters.vue'

type Post = {
  id: number
  title: string
  content: string
  author: {
    id: number
    name: string
  }
  createdAt: string
  updatedAt?: string
}

const posts = ref<Post[]>([])
const filteredPosts = ref<Post[]>([])

const fetchPosts = async () => {
  const res = await fetch('http://localhost:3000/posts')
  const data = await res.json()
  posts.value = data
  filteredPosts.value = data // начальное значение
}

onMounted(fetchPosts)
const handleSearch = (query: string) => {
  const lower = query.toLowerCase()
  filteredPosts.value = posts.value.filter(post =>
    post.title.toLowerCase().includes(lower)
  )
}
const refreshPosts = async () => {
  await fetchPosts()
}

const handleDelete = async (id: number) => {
  await fetch(`http://localhost:3000/posts/${id}`, {
    method: 'DELETE'
  })
  await fetchPosts()
}
</script>

<style scoped>

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
