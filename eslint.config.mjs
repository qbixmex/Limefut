import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import neostandard from 'neostandard';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
      quotes: 'warn',
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
