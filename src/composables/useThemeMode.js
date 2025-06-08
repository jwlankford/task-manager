// src/composables/useThemeMode.js
import { ref, watchEffect, onMounted } from 'vue';
import { useTheme } from 'vuetify';

export function useThemeMode() {
  const theme = useTheme();
  const currentTheme = ref('light'); // Reactive state for the current theme name

  // Check initial preference from localStorage or OS
  onMounted(() => {
    const storedTheme = localStorage.getItem('task-manager-theme');
    if (storedTheme) {
      theme.global.name.value = storedTheme;
    } else {
      // Detect OS preference only if no stored theme
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      theme.global.name.value = prefersDark ? 'dark' : 'light';
    }
    currentTheme.value = theme.global.name.value; // Update reactive state
  });

  // Watch for changes in Vuetify's global theme name and update localStorage/currentTheme ref
  watchEffect(() => {
    const isDark = theme.global.current.value.dark;
    currentTheme.value = isDark ? 'dark' : 'light';
    localStorage.setItem('task-manager-theme', currentTheme.value);
  });

  const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  };

  // Expose currentTheme for icon changes in the UI
  return {
    currentTheme,
    toggleTheme,
  };
}