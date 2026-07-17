import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import neostandard from 'neostandard';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    'node_modules/**',
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'src/generated',
  ]),
  ...neostandard({ semi: true }),
  {
    rules: {
      '@stylistic/quotes': ['warn', 'single', { avoidEscape: true }],
      '@stylistic/jsx-quotes': ['warn', 'prefer-double'],
      '@stylistic/space-before-function-paren': 'off',
      '@stylistic/comma-dangle': 'off',
      '@stylistic/multiline-ternary': 'off',
      '@stylistic/jsx-curly-spacing': 'off',
      'react/jsx-handler-names': 'off',
      '@stylistic/indent': 'off',
      indent: 'off',
      camelcase: 'off',
      'no-tabs': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],
      '@next/next/no-img-element': 'off',
      'no-unused-vars': 'warn',
      'no-undef': 'off',
      'space-before-function-paren': 'off',
      'comma-dangle': ['warn', 'always-multiline'],
      '@next/next/no-html-link-for-pages': 'off',
      'multiline-ternary': 'off',
    },
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      'src/generated/prisma/**',
    ],
  },
]);

export default eslintConfig;
