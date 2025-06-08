import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
// Import auth directly from firebaseConfig for use in router guard
import { auth } from '@/firebaseConfig'; // Adjust path if firebaseConfig is elsewhere

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { requiresAuth: false }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Navigation guard to protect routes
router.beforeEach((to, from, next) => {
  // Use auth.currentUser directly, which is synchronous and available
  const currentUser = auth.currentUser;

  if (to.meta.requiresAuth && !currentUser) {
    // If route requires auth and no user is logged in, redirect to login
    next('/login');
  } else if ((to.name === 'login' || to.name === 'register') && currentUser) {
    // If already logged in, redirect from login/register to home
    next('/');
  } else {
    // Otherwise, proceed to the route
    next();
  }
});

export default router;