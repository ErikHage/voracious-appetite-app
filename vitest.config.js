import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js'

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['spec/unit/**/*.spec.js'],
    setupFiles: ['spec/setup.js'],
    server: {
      deps: {
        // Vuetify imports its own CSS, which must go through Vite
        inline: ['vuetify'],
      },
    },
    env: {
      VITE_RECIPE_SERVICE_V0_BASE_URL: 'https://api.test/recipes-service',
      VITE_ASSET_BASE_PATH: '/assets-test',
      VITE_APPLICATION_ID: 'test-application-id',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**'],
    },
  },
}))
