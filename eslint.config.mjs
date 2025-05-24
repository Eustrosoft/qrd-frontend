import angularEslint from '@angular-eslint/eslint-plugin';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import js from '@eslint/js';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['projects/**/*'],
  },
  {
    plugins: {
      '@angular-eslint': angularEslint,
      '@typescript-eslint': typescriptEslint,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
    },
    rules: {
      quotes: ['error', 'single'],
      semi: ['warn', 'always'],
      'no-console': 'warn',
      'no-multiple-empty-lines': [
        'warn',
        {
          max: 2,
        },
      ],
      'comma-dangle': ['error', 'always-multiline'],
      'no-trailing-spaces': 'error',
      'no-irregular-whitespace': 'warn',
      eqeqeq: 'error',
      'no-empty': 'error',
      'max-len': [
        'warn',
        {
          code: 165,
          ignorePattern: '^import\\s.+\\sfrom\\s.+;$',
        },
      ],
      'no-var': 'error',
      'arrow-parens': 'error',
      'no-extra-semi': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-else-return': 'warn',
      'no-debugger': 'error',
      'no-multi-spaces': 'error',
      'prefer-template': 'error',
      'object-curly-spacing': ['error', 'always'],
      'prefer-const': 'error',
      'no-extra-parens': [
        'error',
        'all',
        {
          nestedBinaryExpressions: false,
        },
      ],
      'comma-spacing': 'error',
      'no-extra-boolean-cast': 'error',
      'no-useless-return': 'warn',
      'no-useless-escape': 'error',
      'no-useless-concat': 'error',
      'no-multi-assign': 'error',
      'no-new-object': 'error',
      'no-extra-label': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-this-alias': 'error',
      '@typescript-eslint/array-type': [
        'error',
        {
          default: 'array',
        },
      ],
      '@typescript-eslint/no-empty-interface': 'error',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-readonly": "error",
      "@typescript-eslint/prefer-optional-chain": "error",
      '@typescript-eslint/explicit-function-return-type': ['error', { allowIIFEs: true }],
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            accessors: 'off',
            constructors: 'no-public',
            methods: 'explicit',
            properties: 'explicit',
            parameterProperties: 'off',
          },
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use a plain object instead',
        },
      ],
      'eol-last': ['error', 'always'],
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/no-queries-metadata-property': 'error',
      '@angular-eslint/no-pipe-impure': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/no-output-rename': 'warn',
      '@angular-eslint/no-output-native': 'warn',
      '@angular-eslint/no-inputs-metadata-property': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',
      '@angular-eslint/no-conflicting-lifecycle': 'warn',
    },
  },
  ...compat.extends('plugin:@angular-eslint/template/recommended').map((config) => ({
    ...config,
    files: ['**/*.html'],
  })),
  ...compat.extends('plugin:@angular-eslint/template/accessibility').map((config) => ({
    ...config,
    files: ['**/*.html'],
  })),
  {
    files: ['**/*.html'],
    rules: {},
  },
];
