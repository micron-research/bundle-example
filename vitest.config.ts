import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    extensions: ['.js', '.ts']
  },
  test: {
    include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    passWithNoTests: false,
    coverage: {
      all: true,
      provider: 'istanbul',
      reportsDirectory: './docs/coverage',
      reporter: ['text', 'json', 'html'],
      include: ['**'],
    },
  },
});
