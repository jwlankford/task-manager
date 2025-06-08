<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
      <v-container class="max-w-md">
        <v-card class="pa-6 rounded-xl elevation-12">
          <v-card-title class="text-h4 text-center text-green-darken-3 font-weight-bold mb-6">
            Sign Up
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
                class="mb-4"
                type="password"
                required
              ></v-text-field>

              <v-text-field
                v-model="passwordConfirm"
                label="Confirm Password"
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
                Sign Up
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
              Already have an account? <router-link to="/login">Log In</router-link>
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
import { useAuth } from '@/composables/useAuth'; // Adjust path based on your project structure

const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
const error = ref('');
const loading = ref(false);

const { signup } = useAuth();
const router = useRouter();

const handleSubmit = async () => {
  if (password.value !== passwordConfirm.value) {
    error.value = 'Passwords do not match.';
    return;
  }

  error.value = '';
  loading.value = true;

  try {
    await signup(email.value, password.value);
    router.push('/'); // Redirect to the main task manager view after successful signup
  } catch (err) {
    // Firebase errors have a 'code' property
    if (err.code === 'auth/email-already-in-use') {
      error.value = 'This email is already in use.';
    } else if (err.code === 'auth/weak-password') {
      error.value = 'Password should be at least 6 characters.';
    } else {
      error.value = 'Failed to create an account. Please try again.';
      console.error("Signup error:", err.message);
    }
  } finally {
    loading.value = false;
  }
};
</script>