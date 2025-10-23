<template>
  <div class="spinner">⏳ Загрузка...</div>
</template>

<style scoped>
.spinner {
  font-size: 1.2em;
  color: #666;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}
</style>