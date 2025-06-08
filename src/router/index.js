// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// Import your components
import App from '../App.vue';
import HomeView from '../views/HomeView.vue'; // Your main task manager view
import SignupView from '../views/SignupView.vue';
import LoginView from '../views/LoginView.vue';
import ResetPasswordView from '../views/ResetPasswordView.vue'; // If you included this

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView, // Your main task manager is now the protected view
    meta: { requiresAuth: true } // Mark as protected
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPasswordView
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Corrected this in previous step
  routes
});

// Navigation Guard to protect routes
// This flag helps ensure we only wait for auth state once on initial load
let authInitialCheckDone = false; // Renamed for clarity from authResolved

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  // If the initial auth check hasn't been done, wait for it
  if (!authInitialCheckDone) {
    await new Promise(resolve => {
      const unsubscribe = onAuthStateChanged(auth, user => {
        authInitialCheckDone = true; // Mark as done after the first state is known
        unsubscribe(); // Stop listening after the first state is known
        resolve(user);
      });
    });
  }

  // Get the *current* user after the initial check is complete
  const currentUser = auth.currentUser;

  if (requiresAuth && !currentUser) {
    // If route requires auth and no user is logged in, redirect to login
    next('/login');
  } else if ((to.path === '/login' || to.path === '/signup' || to.path === '/reset-password') && currentUser) {
    // If trying to access login/signup/reset-password while logged in, redirect to home
    next('/');
  } else {
    // Otherwise, proceed
    next();
  }
});

export default router;