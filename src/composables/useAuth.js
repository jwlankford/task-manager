// src/composables/useAuth.js
import { ref } from 'vue'; // No need for onMounted, onUnmounted here
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';

// These will be globally reactive and update whenever the auth state changes
// The onAuthStateChanged listener runs once on app load and then on every auth state change.
const currentUser = ref(null);
const authLoading = ref(true);

// This listener should be set up only once when the app starts
// It's outside the useAuth function so it runs on app initialization
// and continuously listens for changes.
onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
  authLoading.value = false;
});

export function useAuth() {
  // The functions inside here are called within component setup()
  // so they have access to component context if needed, but for auth
  // operations, they just need the 'auth' instance.

  const signup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  return {
    currentUser,    // Export the reactive ref
    authLoading,    // Export the reactive ref
    signup,
    login,
    logout,
    resetPassword,
  };
}