import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      src: decodeURIComponent(new URL('./src', import.meta.url).pathname),
    },
  },
  test: {
    // Unit tests only. Cypress owns cypress/e2e/**/*.test.* and the component
    // specs in src/{components,utils}/**/*.test.*, so keep Vitest out of those.
    include: ['src/data/**/*.test.ts'],
    environment: 'node',
  },
})
