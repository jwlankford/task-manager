// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles' // Import Vuetify styles
import { createVuetify } from 'vuetify' // Import Vuetify's createVuetify function
import * as components from 'vuetify/components' // Import all Vuetify components
import * as directives from 'vuetify/directives' // Import all Vuetify directives
import '@mdi/font/css/materialdesignicons.css' // Optional: Import Material Design Icons

const vuetify = createVuetify({
  components,
  directives,
  // Optional: You can configure themes, icons, etc. here
  icons: {
    defaultSet: 'mdi', // This is important if you use mdi fonts
  },
})

createApp(App)
  .use(vuetify) // Tell Vue to use Vuetify
  .mount('#app')