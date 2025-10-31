
<template>
  <nav>
    <router-link to="/">🏠 Панель</router-link>
    <router-link to="/editor">🎨 Создание палитры</router-link>
    <router-link to="/harmony">🌈 Цветовые гармонии</router-link>
    <router-link to="/accessibility">🧩 Проверка доступности</router-link>
  </nav>
  <router-view />
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f0f0f0;
}
router-link {
  text-decoration: none;
  color: #333;
}
router-link.router-link-active {
  font-weight: bold;
}
</style>
