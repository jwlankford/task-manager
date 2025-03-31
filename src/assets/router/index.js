import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from '../views/Dashboard.vue';
import Categories from '../views/Categories.vue';

const routes = [
  { path: '/', name: 'Dashboard', component: Dashboard },
  { path: '/categories', name: 'Categories', component: Categories },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
