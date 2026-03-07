import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 2022,
      sourceType: 'module'
    },
    files: ['**/*.{js,jsx,ts,tsx}'],
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      // ❌ УБИРАЕМ ВСЁ про react-refresh
    }
  },
  {
    ignores: [
      'node_modules/**', 
      'dist/**', 
      '**/*.config.*',
      '**/lib/**'  // ← Добавляем игнор lib
    ]
  }
);
