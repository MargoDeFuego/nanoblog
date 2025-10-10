<template>
  <section class="post-list">
    <div v-if="posts.length === 0">Нет постов для отображения</div>
    <div v-else> 
      <div class="post-count">Всего записей: {{ posts.length }}</div>
    
    <PostItem
  
  v-for="post in posts"
  :key="post.id"
  :post="post"
  @edit="$emit('edit', post)"      
  @delete="$emit('delete', post.id)"
  /></div>

  </section>
</template>

<script setup lang="ts">
import PostItem from './PostItem.vue'

defineProps<{
  posts: {
    id: number
    title: string
    content: string
  }[]
}>()

defineEmits(['edit', 'delete'])
</script>

<style scoped>

.post-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
