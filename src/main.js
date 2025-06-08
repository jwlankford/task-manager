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
    'green-darken-3': '#2E7D32', // Custom green from your app
    'grey-lighten-3': '#E0E0E0', // Custom grey from your app
  },
};

const customDarkTheme = {
  dark: true,
  colors: {
    background: '#121212', // Dark background for the app
    surface: '#1E1E1E', // Darker card/paper background
    primary: '#66BB6A', // Lighter green for dark mode
    'primary-darken-1': '#4CAF50',
    secondary: '#AED581', // Lighter light green
    error: '#CF6679',
    info: '#2196F3',
    success: '#66BB6A',
    warning: '#FB8C00',
    'green-darken-3': '#4CAF50', // Adjust custom green for dark mode
    'grey-lighten-3': '#424242', // Adjust custom grey for dark mode
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', // Set a default here, but useThemeMode will override based on preference
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