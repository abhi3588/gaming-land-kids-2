// Post-build step (runs automatically after `vite build` via npm "postbuild"):
//  1. Generate sitemap.xml from content data (writes into dist/ and public/).
//  2. Write robots.txt with an absolute sitemap URL.
//  3. Copy dist/index.html -> dist/404.html so deep-linked client routes
//     (e.g. /gaming-land-kids-2/games/ocean-match) resolve on GitHub Pages.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '../dist');

// Resolve the deployed origin so robots.txt can point at an absolute sitemap.
// On GitHub Pages we don't know the username at build time, so we derive it
// from the public site URL embedded by the deploy job when available, else
// fall back to a relative sitemap path (valid and recommended by Google).
const repoName = 'gaming-land-kids-2';
const BASE = process.env.VITE_BASE_URL || `/${repoName}/`;
const sitemapPath = `${BASE.replace(/\/$/, '')}/sitemap.xml`;

async function main() {
  if (!fs.existsSync(distDir)) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(1);
  }

  // 1. Sitemap
  await import('./generate-sitemap.mjs');

  // 2. robots.txt
  const robots = `User-agent: *
Allow: /

Sitemap: ${sitemapPath}
`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robots);
  fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robots);

  // 3. SPA fallback (404.html)
  const indexFile = path.join(distDir, 'index.html');
  fs.copyFileSync(indexFile, path.join(distDir, '404.html'));

  console.log('postbuild: sitemap.xml, robots.txt, and 404.html (SPA fallback) written to dist/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
