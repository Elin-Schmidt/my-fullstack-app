import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig([
    {
        files: ['**/*.{js,mjs,cjs,ts}'],
        ignores: ['**/node_modules/**', '**/dist/**'],
        languageOptions: { globals: globals.node },
        plugins: { js },
        extends: ['js/recommended']
    },
    tseslint.configs.recommended
]);
