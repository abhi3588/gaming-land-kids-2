import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deploy base. GitHub Pages serves this project at a subpath
// (https://<user>.github.io/gaming-land-kids-2/). Vite injects this as
// import.meta.env.BASE_URL, which the SEO layer uses for every canonical/
// OG/sitemap/manifest URL so nothing is hardcoded to a domain.
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
