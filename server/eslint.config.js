import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default defineConfig([
    { files: ['**/*.{js,mjs,cjs,ts,jsx,js}'] },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,js}'],
        languageOptions: { globals: globals.browser }
    },
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,js}'],
        plugins: { js },
        extends: ['js/recommended']
    },
    tseslint.configs.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,js}'],
        rules: {
            'react/react-in-jsx-scope': 'off'
        }
    }
]);
