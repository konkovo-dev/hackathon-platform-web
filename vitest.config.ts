import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  test: {
    // Глобальные API (describe, it, expect) без импорта
    globals: true,

    // happy-dom для тестирования React-компонентов
    environment: 'happy-dom',

    // Setup файл (MSW, matchers)
    setupFiles: ['./tests/setup/vitest.setup.ts'],

    // Паттерны для поиска тестов
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],

    // Исключения
    exclude: ['node_modules', '.next', 'tests/e2e/**'],

    // Coverage
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        'src/shared/i18n/generated.ts',
        'src/shared/api/*.schema.ts',
        'src/app/layout.tsx',
        'src/app/**/page.tsx',
        'src/app/providers.tsx',
      ],
      thresholds: {
        lines: 60,
        functions: 60,
        branches: 60,
        statements: 60,
      },
    },
  },

  // Алиасы (такие же, как в tsconfig.json)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@tests': path.resolve(__dirname, './tests'),
    },
  },
})
