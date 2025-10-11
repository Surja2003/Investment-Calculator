import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // Ignore build output and WIP/alternate files from lint
  globalIgnores(['dist', 'node_modules', 'public', 'docs', '**/*.new.jsx', '**/*.new.js']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      // Browser globals for client code by default
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Keep unused-vars as warning to avoid blocking dev due to UI placeholder vars
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]' }],
      // Allow non-component exports in context files without breaking fast-refresh in dev
      'react-refresh/only-export-components': 'off',
      // Reduce noise for empty try/catch stubs in data loaders
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },
  // Node environment overrides for server-side files
  {
    files: ['server/**/*.js', 'src/tests/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        process: true,
        __dirname: true,
        module: true,
        require: true,
      },
    },
    rules: {
      // Server/test code often uses different patterns; keep warnings minimal
      'no-undef': 'off',
    },
  },
])
