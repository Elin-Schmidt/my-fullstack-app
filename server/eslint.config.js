import { defineConfig } from 'eslint/config';
import globals from 'globals';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

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
    pluginReact.configs.flat.recommended,
    {
        files: ['**/*.{js,mjs,cjs,ts,jsx,js}'],
        rules: {
            'react/react-in-jsx-scope': 'off'
        }
    }
]);
