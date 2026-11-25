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
  // Vuetify 4's upgrade guide: pre-bundle the overlay stack, or the dev server
  // can serve two copies of it and an overlay opens behind another. The app
  // has none yet; FrAppShell's menus and command palette will
  optimizeDeps: {
    include: [
      'vuetify/components/VOverlay',
      'vuetify/components/VDialog',
      'vuetify/components/VMenu',
    ],
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
