import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import prettier from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      prettier,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-empty-interface': 0,
      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': [
        'error',
        {
          semi: false,
          singleQuote: true,
          tabWidth: 2,
          useTabs: false,
          trailingComma: 'es5',
          endOfLine: 'auto',
        },
      ],
    },
  },
  {
    files: ['**/*.js', '**/*.mjs'], // Apply only to JavaScript files
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false,
          printWidth: 180,
          singleQuote: true,
          tabWidth: 2,
          useTabs: false,
          trailingComma: 'es5',
          endOfLine: 'auto',
        },
      ],
    },
  },
]
