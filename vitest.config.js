import { fileURLToPath } from 'node:url'
import { mergeConfig, defineConfig, configDefaults } from 'vitest/config'
import viteConfig from './vite.config'
import vue from '@vitejs/plugin-vue' // Or other framework plugins like @vitejs/plugin-react

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      exclude: [...configDefaults.exclude, 'e2e/**'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
    plugins: [vue()], // Ensure your framework plugin is here
    base: process.env.NODE_ENV === 'production'
      ? '/task-manager/' // IMPORTANT: Replace 'task-manager' with your actual repository name
      : '/'
  }),
)
