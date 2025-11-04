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
        @edit="handleEdit"
        @updated="refreshPosts"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import PostItem from './PostItem.vue'
import PostFilter from './PostFilters.vue'

type Post = {
  id: number
  title: string
  content: string
  author: { id: number; name: string }
  createdAt: string
  updatedAt?: string
}

// ✅ Получаем список постов от родителя
const props = defineProps<{
  posts: Post[]
}>()

const emit = defineEmits(['delete', 'edit', 'refresh'])

const searchQuery = ref('')

// ✅ фильтрация — работает локально, без загрузки
const filteredPosts = computed(() =>
  props.posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const handleSearch = (query: string) => {
  searchQuery.value = query
}

const handleEdit = (post: any) => {
  console.log('🖊️ [PostList] handleEdit triggered with:', post)
  emit('edit', post) // пробрасываем событие вверх в App.vue
}

const handleDelete = (id: number) => {
  emit('delete', id)
}

const refreshPosts = () => {
  emit('refresh')
}
</script>

<style scoped>
.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
