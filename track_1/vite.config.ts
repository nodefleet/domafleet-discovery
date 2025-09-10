import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
      '/doma': {
        target: 'https://api-testnet.doma.xyz',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/doma/, ''),
      },
    },
  },
})


