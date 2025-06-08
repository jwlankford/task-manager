// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // Make sure 'path' is imported if you're using resolve.alias

export default defineConfig({
  plugins: [
    vue(), // This is for Vite's build/dev server
  ],
  resolve: {
    alias: {
      // Ensure this is correct for your project structure
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: 'jsdom',
    // THIS IS THE MOST CRITICAL PART FOR THE SYNTAXERROR:
    plugins: [
      vue(), // Ensure @vitejs/plugin-vue is also applied for Vitest
    ],
    // If you have any other Vitest specific options, they go here
    // e.g., setupFiles: ['./vitest.setup.js'],
    // globals: true,
  },
});