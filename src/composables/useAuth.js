// src/composables/useAuth.js
import { ref } from 'vue';
import { auth } from '@/firebaseConfig'; // Ensure this path is correct for your Firebase config
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  GoogleAuthProvider, // Import GoogleAuthProvider
  signInWithPopup     // Import signInWithPopup
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

  const register = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log('Registered successfully!');
    } catch (error) {
      console.error('Registration failed:', error.message);
      throw error; // Re-throw to be caught by component
    }
  };

  // ADD THIS NEW FUNCTION FOR GOOGLE SIGN-IN
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      console.log('Signed in with Google successfully!');
    } catch (error) {
      console.error('Google Sign-in failed:', error.message);
      // Handle specific errors, e.g., if popup was closed by user
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Google Sign-in cancelled by user.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        throw new Error('Google Sign-in cancelled (another popup request).');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        // This means user has already registered with email/password and tries to login with Google
        // You might want to link accounts or show a specific message here
        throw new Error('An account already exists with the same email address but different sign-in credentials. Please log in with your existing method.');
      }
      throw error; // Re-throw other errors
    }
  };

  return {
    currentUser,
    authLoading,
    login,
    logout,
    register,
    signInWithGoogle, // EXPOSE THE NEW GOOGLE SIGN-IN FUNCTION
  };
}