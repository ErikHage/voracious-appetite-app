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
  // Only needed if some legacy code expects `process.env` to exist
  // Vite 6 manages environment variables via import.meta.env.
  define: { 'process.env': {} },
})
