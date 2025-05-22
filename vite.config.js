import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://graceful-strength-production-360f.up.railway.app',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})
