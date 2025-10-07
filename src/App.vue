<template>
  <PostFilters @search="searchQuery = $event" />
  <NewPostForm @add="fetchPosts" />
  <PostList
    :posts="filteredPosts"
    @edit="editPost"
    @delete="deletePost"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import PostList from './components/PostList.vue'
import NewPostForm from './components/NewPostForm.vue'
import PostFilters from './components/PostFilters.vue'

const posts = ref<any[]>([])
const searchQuery = ref('')

const fetchPosts = async () => {
  const res = await fetch('http://localhost:3000/posts')
  posts.value = await res.json()
}

const filteredPosts = computed(() =>
  posts.value.filter(p => p.title.includes(searchQuery.value))
)

const deletePost = async (id: number) => {
  await fetch(`http://localhost:3000/posts/${id}`, { method: 'DELETE' })
  fetchPosts()
}

const editPost = (post: any) => {
  // логика редактирования
}

onMounted(fetchPosts)
</script>


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
</style>