// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; // Ensure MDI icons are imported

const customLightTheme = {
  dark: false,
  colors: {
    background: '#f5f5f5', // Light grey background for the app
    surface: '#ffffff', // Card/paper background
    primary: '#4CAF50', // Green
    'primary-darken-1': '#388E3C',
    secondary: '#8BC34A', // Light Green
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    'green-darken-3': '#2E7D32', // Custom green from your app (used for main buttons)
    'red-darken-1': '#B71C1C', // Custom red from your app (used for logout)
    'grey-lighten-3': '#E0E0E0', // Custom grey from your app
  },
};

const customDarkTheme = {
  dark: true,
  colors: {
    background: '#121212', // Dark background for the app
    surface: '#1E1E1E', // Darker card/paper background
    primary: '#7CB342', // Lighter green/lime for primary in dark mode (e.g., 'Edit', 'Theme Toggle')
    'primary-darken-1': '#689F38', // A slightly darker shade for primary in dark mode
    secondary: '#DCE775', // Brighter secondary
    error: '#EF5350', // Brighter red for errors/delete in dark mode
    info: '#64B5F6', // Brighter info blue
    success: '#81C784', // Brighter success green
    warning: '#FFB300', // Brighter warning orange
    'green-darken-3': '#66BB6A', // VIBRANT GREEN for main buttons in dark mode (e.g., 'Log In', 'Add Task')
    'red-darken-1': '#E57373', // Brighter red for logout in dark mode
    'grey-lighten-3': '#424242', // Adjusted grey for dark mode
  },
};

// --- NEW HELPER FUNCTION TO DETERMINE INITIAL THEME ---
function getInitialTheme() {
  // 1. Check if a theme preference is stored in localStorage
  const storedTheme = localStorage.getItem('vue-task-manager-theme');
  if (storedTheme) {
    return storedTheme;
  }

  // 2. If no stored preference, detect OS preference
  // Use window.matchMedia for reliable OS theme detection
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // 3. Default to 'light' if no preference is found anywhere
  return 'light';
}
// -----------------------------------------------------

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: getInitialTheme(), // Set the initial theme using our new helper function
    themes: {
      light: customLightTheme,
      dark: customDarkTheme,
    },
  },
  icons: {
    defaultSet: 'mdi',
  },
});

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app');