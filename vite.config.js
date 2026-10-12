import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import path from 'node:path'


export default defineConfig({
  base: '/apps/voracious-appetite/',
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    watch: {
      // Playwright writes these while the UI tests run against this dev
      // server. Watching them makes Vite reload the pages under test
      ignored: ['**/test-results/**', '**/playwright-report/**'],
    },
  },
  // Only needed if some legacy code expects `process.env` to exist
  // Vite 6 manages environment variables via import.meta.env.
  define: { 'process.env': {} },
})
