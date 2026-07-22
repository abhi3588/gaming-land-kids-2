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
// On GitHub Pages: https://<username>.github.io/<repo>/
// We use VITE_SITE_ORIGIN if provided at build time (e.g., via GitHub Actions env),
// otherwise fall back to a relative sitemap path (valid and recommended by Google).
const repoName = 'gaming-land-kids-2';
const BASE = process.env.VITE_BASE_URL || `/${repoName}/`;
const SITE_ORIGIN = process.env.VITE_SITE_ORIGIN || 'https://abhi3588.github.io';
const sitemapPath = `${SITE_ORIGIN}${BASE.replace(/\/$/, '')}/sitemap.xml`;

async function main() {
  if (!fs.existsSync(distDir)) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(1);
  }

  // 1. Sitemap
  await import('./generate-sitemap.mjs');

  // 2. robots.txt with absolute sitemap URL
  const robots = `User-agent: *
Allow: /

Sitemap: ${sitemapPath}
`;
  fs.writeFileSync(path.join(distDir, 'robots.txt'), robots);
  fs.writeFileSync(path.join(__dirname, '../public/robots.txt'), robots);

  // 3. SPA fallback (404.html)
  const indexFile = path.join(distDir, 'index.html');
  fs.copyFileSync(indexFile, path.join(distDir, '404.html'));

  // Count the URLs actually written into the sitemap so the build log reports
  // how many pages crawlers will discover (activities, quizzes, puzzles, etc.
  // are all auto-discovered from the content data by generate-sitemap.mjs).
  const sitemapFile = path.join(distDir, 'sitemap.xml');
  let pageCount = 0;
  if (fs.existsSync(sitemapFile)) {
    const sitemapContent = fs.readFileSync(sitemapFile, 'utf-8');
    pageCount = (sitemapContent.match(/<loc>/g) || []).length;
  }

  console.log(
    `postbuild: sitemap.xml generated with ${pageCount} crawled pages; robots.txt and 404.html (SPA fallback) written to dist/`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
