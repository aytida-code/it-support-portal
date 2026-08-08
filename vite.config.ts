import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 48577,
    strictPort: true,
    allowedHosts: ['.trycloudflare.com'],
  },
})
