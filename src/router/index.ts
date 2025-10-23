import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Dashboard', component: () => import('../views/DashboardView.vue') },
  { path: '/editor/:id?', name: 'Editor', component: () => import('../views/PaletteEditorView.vue') },
  { path: '/harmony', name: 'Harmony', component: () => import('../views/HarmonyView.vue') },
  { path: '/accessibility', name: 'Accessibility', component: () => import('../views/AccessibilityView.vue') }
];

export default createRouter({
  history: createWebHistory(),
  routes
});