import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Dev on 5173 — Docker uses 8080/8081; avoids slow/conflicting port hopping (8082…)
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
})
