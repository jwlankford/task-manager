<template>
  <v-app>
    <v-main class="d-flex align-center justify-center bg-grey-lighten-3">
      <v-container class="max-w-md">
        <v-card class="pa-6 rounded-xl elevation-12">
          <v-card-title class="text-h4 text-center text-green-darken-3 font-weight-bold mb-6">
            Reset Password
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

              <v-btn
                type="submit"
                color="green-darken-2"
                size="large"
                block
                :loading="loading"
                :disabled="loading || emailSent"
              >
                {{ emailSent ? 'Email Sent!' : 'Send Reset Email' }}
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
              <v-alert
                v-if="emailSent"
                type="success"
                class="mt-4"
                variant="tonal"
              >
                A password reset email has been sent to {{ email }}.
              </v-alert>
            </v-form>

            <div class="text-center mt-6">
              <router-link to="/login">Back to Login</router-link>
            </div>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/useAuth'; // Adjust path

const email = ref('');
const error = ref('');
const loading = ref(false);
const emailSent = ref(false);

const { resetPassword } = useAuth();

const handleSubmit = async () => {
  error.value = '';
  emailSent.value = false;
  loading.value = true;

  try {
    await resetPassword(email.value);
    emailSent.value = true;
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      error.value = 'No account found with this email.';
    } else {
      error.value = 'Failed to send reset email. Please try again.';
      console.error("Reset password error:", err.message);
    }
  } finally {
    loading.value = false;
  }
};
</script>