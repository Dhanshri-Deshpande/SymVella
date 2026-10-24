import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    proxy: {
      '/gnani-api': {
        target: 'https://api.vachana.ai',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gnani-api/, '')
      },
      '/gnani-platform': {
        target: 'https://api.inya.ai',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/gnani-platform/, '')
      }
    }
  }
})
