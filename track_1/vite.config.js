import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        proxy: {
            '/api': {
                target: 'https://api.domafleet.io',
                changeOrigin: true,
                secure: true,
            },
            '/health': {
                target: 'https://api.domafleet.io',
                changeOrigin: true,
                secure: true,
            },
        },
    },
});
