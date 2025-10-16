
<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

import PostList from './components/PostList.vue'
import NewPostForm from './components/NewPostForm.vue'
//import PostFilters from './components/PostFilters.vue'
import EditPostForm from './components/EditPostForm.vue'

const posts = ref<any[]>([])
const searchQuery = ref('')

const fetchPosts = async () => {
  try {
    const res = await fetch('/api/posts')

    if (!res.ok) {
      throw new Error(`Ошибка HTTP: ${res.status}`)
    }
    posts.value = await res.json()
  } catch (error) {
    console.error('Ошибка при загрузке постов:', error)
  }
}

const filteredPosts = computed(() =>
  posts.value.filter(p =>
    p.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)


const deletePost = async (id: number) => {
  await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' })
  fetchPosts()
}

const selectedPost = ref<any | null>(null)
const editPost = async (post: any) => {
  selectedPost.value = post
  try {
    const updatedPost = {
      ...post,
      title: post.title + '...', 
      updatedAt: new Date().toISOString()
    }

    await fetch(`http://localhost:3000/posts/${post.id}`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPost)
    })

    await fetchPosts() 
  } catch (error) {
    console.error('Ошибка при редактировании поста:', error)
  }
}

const onPostUpdated = async () => {
  console.log('Форма скрыта')
  selectedPost.value = null
  await nextTick(fetchPosts) 
}

onMounted(fetchPosts)
</script>

<template>
  <PostFilters @search="searchQuery = $event" />
  <NewPostForm @add="fetchPosts" />
  <PostList
    :posts="filteredPosts"
    @edit="editPost"
    @delete="deletePost"
  />
  <EditPostForm
    v-if="selectedPost"
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