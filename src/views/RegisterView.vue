<template>
  <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
    <v-container class="max-w-xs">
      <v-card class="pa-6 rounded-xl elevation-12">
        <v-card-title class="text-h4 text-center text-green-darken-3 font-weight-bold mb-6">
          Register
        </v-card-title>

        <v-card-text>
          <v-form @submit.prevent="handleRegister">
            <v-text-field
              v-model="email"
              label="Email"
              variant="outlined"
              prepend-inner-icon="mdi-email"
              class="mb-4"
              type="email"
              required
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              class="mb-4"
              required
              autocomplete="new-password"
            ></v-text-field>

            <v-text-field
              v-model="confirmPassword"
              label="Confirm Password"
              :type="showConfirmPassword ? 'text' : 'password'"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
              variant="outlined"
              prepend-inner-icon="mdi-lock"
              class="mb-4"
              required
              autocomplete="new-password"
            ></v-text-field>

            <v-alert
              v-if="error"
              type="error"
              density="compact"
              class="mb-4"
              closable
            >{{ error }}</v-alert>

            <v-btn
              color="green-darken-3"
              variant="elevated"
              block
              size="large"
              type="submit"
              :loading="loading"
              :disabled="loading || !email || !password || !confirmPassword"
              class="mb-4"
            >
              Register
            </v-btn>
          </v-form>

          <v-divider class="my-4" text="OR"></v-divider>

          <v-btn
            color="white"
            class="elevation-2 text-none"
            block
            size="large"
            prepend-icon="mdi-google"
            :loading="loading"
            :disabled="loading"
            @click="handleGoogleSignIn"
          >
            Sign up with Google
          </v-btn>


          <v-divider class="my-4"></v-divider>

          <div class="text-center">
            <p>Already have an account?</p>
            <v-btn
              variant="text"
              color="green-darken-3"
              @click="router.push('/login')"
            >
              Login Here
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { useThemeMode } from '@/composables/useThemeMode'; // Import the theme composable

// Call the theme composable to initialize theme based on OS/localStorage
useThemeMode();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const loading = ref(false);

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const { register, signInWithGoogle } = useAuth();
const router = useRouter();

const handleRegister = async () => {
  error.value = '';
  loading.value = true;

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.';
    loading.value = false;
    return;
  }

  try {
    await register(email.value, password.value);
    router.push('/');
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'Email already in use. Please try logging in.';
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Password should be at least 6 characters.';
    } else {
      error.value = 'Registration failed. Please try again.';
      console.error("Registration error:", err.message);
    }
  } finally {
    loading.value = false;
  }
};

const handleGoogleSignIn = async () => {
  error.value = '';
  loading.value = true;
  try {
    await signInWithGoogle();
    router.push('/');
  } catch (err) {
    error.value = err.message || 'Failed to sign up with Google. Please try again.';
    console.error("Google Sign-up error:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Add any specific styles for the Register view here */
</style>