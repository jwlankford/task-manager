// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Make sure this is correct

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import '@mdi/font/css/materialdesignicons.css' // Import MDI CSS

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});

createApp(App)
  .use(router) // <-- THIS IS KEY! It mounts your root component *via* the router.
  .use(vuetify)
  .mount('#app');