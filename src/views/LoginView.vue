<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
      <v-container class="max-w-md">
        <v-card class="pa-6 rounded-xl elevation-12">
          <v-card-title class="text-h4 text-center text-green-darken-3 font-weight-bold mb-6">
            Login
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="handleSubmit">
              <v-text-field
                v-model="email"
                label="Email"
                variant="outlined"
                density="comfortable"
                class="mb-4"
                type="email"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                label="Password"
                variant="outlined"
                density="comfortable"
                class="mb-6"
                type="password"
                required
              ></v-text-field>

              <v-btn
                type="submit"
                color="green-darken-2"
                size="large"
                block
                :loading="loading"
                :disabled="loading"
              >
                Login
              </v-btn>

              <v-alert
                v-if="error"
                type="error"
                class="mt-4"
                variant="tonal"
                closable
                @click:close="error = ''"
              >
                {{ error }}
              </v-alert>
            </v-form>

            <div class="text-center mt-6">
              Don't have an account? <router-link to="/signup">Sign Up</router-link>
            </div>
            <div class="text-center mt-2">
              <router-link to="/reset-password">Forgot Password?</router-link>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth'; // Adjust path

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);

const { login } = useAuth();
const router = useRouter();

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;

  try {
    await login(email.value, password.value);
    router.push('/'); // Redirect to the main task manager view after successful login
  } catch (err) {
    if (err.code === 'auth/invalid-credential') {
      error.value = 'Invalid email or password.';
    } else if (err.code === 'auth/user-not-found') {
      error.value = 'No account found with this email.';
    } else {
      error.value = 'Failed to log in. Please try again.';
      console.error("Login error:", err.message);
    }
  } finally {
    loading.value = false;
  }
};
</script>