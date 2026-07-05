import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const repoName = 'gaming-land-kids-2'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? `/${repoName}/` : '/',
  server: {
    host: '0.0.0.0',
    port: 5000,
    allowedHosts: true,
  },
}))
