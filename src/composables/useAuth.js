// src/composables/useAuth.js
import { ref } from 'vue';
import { auth } from '@/firebaseConfig'; // Ensure this path is correct for your Firebase config
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword // Import createUserWithEmailAndPassword
} from 'firebase/auth';

// Reactive state for the current user and loading status
const currentUser = ref(null);
const authLoading = ref(true); // Set to true initially while checking auth state

// Initialize auth state listener once
onAuthStateChanged(auth, (user) => {
  currentUser.value = user;
  authLoading.value = false;
  console.log('Auth state changed:', user ? user.email : 'No user');
});

export function useAuth() {
  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Logged in successfully!');
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error; // Re-throw to be caught by component
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('Logged out successfully!');
    } catch (error) {
      console.error('Logout failed:', error.message);
      throw error; // Re-throw to be caught by component
    }
  };

  // ADD THIS NEW REGISTER FUNCTION
  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered successfully!');
    } catch (error) {
      console.error('Registration failed:', error.message);
      throw error; // Re-throw to be caught by component
    }
  };


  return {
    currentUser,
    authLoading,
    login,
    logout,
    register, // EXPOSE THE REGISTER FUNCTION
  };
}