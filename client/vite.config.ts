import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src') // Alias för "src"-mappen
        }
    },
    server: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000', // Din lokala backend
                changeOrigin: true,
                secure: false
            }
        }
    }
});
