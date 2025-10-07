<template>
  <section class="post-list">
    <div v-if="posts.length === 0">Нет постов для отображения</div>
    <PostItem
      v-else
      v-for="post in posts"
      :key="post.id"
      :post="post"
      @edit="$emit('edit', post.id)"
      @delete="$emit('delete', post.id)"
    />
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
