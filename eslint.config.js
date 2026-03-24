// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  // Рекомендованные правила для JS
  js.configs.recommended,

  // TypeScript
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
    },
    rules: tsPlugin.configs.recommended.rules,
  },

  // React
  {
    files: ['**/*.{jsx,tsx}'],
    plugins: { react: reactPlugin },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // для новых версий React
    },
    settings: {
      react: {
        version: 'detect', // автоматически определяет версию React
      },
    },
  },

  // Prettier
  {
    files: ['**/*.{js,ts,jsx,tsx}'],
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },

  // Общие правила
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    rules: {
      semi: 'error',
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
  },

  // Игнорируемые папки
  {
    ignores: ['node_modules', 'dist'],
  },
]);
