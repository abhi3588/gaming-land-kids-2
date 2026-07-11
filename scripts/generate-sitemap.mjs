// Generates sitemap.xml from the real content data.
// Uses Vite's SSR module runner so we can import the app's data modules
// (which transitively reference .jsx components) without a custom Node loader.
// All <loc> values are resolved against the deploy base (GitHub Pages subpath),
// so the sitemap is correct without hardcoding a domain.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const repoName = 'gaming-land-kids-2';
const BASE = process.env.VITE_BASE_URL || `/${repoName}/`;
const join = (...p) => '/' + p.map((s) => String(s).replace(/^\/+|\/+$/g, '')).filter(Boolean).join('/');
const url = (...p) => join(BASE, ...p);

async function loadData() {
  const server = await createServer({
    configFile: path.join(__dirname, '../vite.config.js'),
    logLevel: 'error',
    server: { middlewareMode: true },
    appType: 'custom',
  });
  try {
    const mod = await server.ssrLoadModule('/src/kids-data.js');
    const puzzle = await server.ssrLoadModule('/src/components/puzzle/puzzle-data.js');
    const quiz = await server.ssrLoadModule('/src/components/quiz/quiz-data.js');
    return {
      gamesMeta: mod.gamesMeta,
      stories: mod.stories,
      storiesHindi: mod.storiesHindi,
      rhymes: mod.rhymes,
      funActivities: mod.funActivities,
      scienceActivities: mod.scienceActivities,
      moralActivities: mod.moralActivities,
      PUZZLE_CATEGORIES: puzzle.PUZZLE_CATEGORIES,
      QUIZ_CATEGORIES: quiz.QUIZ_CATEGORIES,
    };
  } finally {
    await server.close();
  }
}

const d = await loadData();

const urls = [
  { u: '/', c: 'weekly', p: 1.0 },
  { u: '/games', c: 'weekly', p: 0.9 },
  { u: '/stories', c: 'weekly', p: 0.9 },
  { u: '/stories/hi', c: 'monthly', p: 0.8 },
  { u: '/rhymes', c: 'monthly', p: 0.8 },
  { u: '/fun', c: 'monthly', p: 0.8 },
  { u: '/educational', c: 'monthly', p: 0.8 },
  { u: '/quiz', c: 'monthly', p: 0.8 },
  { u: '/puzzle', c: 'monthly', p: 0.8 },
];

d.gamesMeta.forEach((g) => urls.push({ u: `/games/${g.id}`, c: 'monthly', p: 0.7 }));
d.stories.forEach((s) => urls.push({ u: `/stories/${s.id}`, c: 'yearly', p: 0.7 }));
d.storiesHindi.forEach((s) => urls.push({ u: `/stories/hi/${s.id}`, c: 'yearly', p: 0.7 }));
d.rhymes.forEach((r) => urls.push({ u: `/rhymes/${r.id}`, c: 'yearly', p: 0.7 }));
d.funActivities.forEach((a) => urls.push({ u: `/fun/${a.id}`, c: 'yearly', p: 0.6 }));
d.scienceActivities.forEach((a) => urls.push({ u: `/educational/science/${a.id}`, c: 'yearly', p: 0.7 }));
d.moralActivities.forEach((a) => urls.push({ u: `/educational/moral/${a.id}`, c: 'yearly', p: 0.7 }));
d.PUZZLE_CATEGORIES.forEach((p) => urls.push({ u: `/puzzle/${p.id}`, c: 'yearly', p: 0.7 }));
d.QUIZ_CATEGORIES.forEach((q) => urls.push({ u: `/quiz/${q.id}`, c: 'monthly', p: 0.7 }));

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (x) => `  <url>
    <loc>${url(x.u)}</loc>
    <changefreq>${x.c}</changefreq>
    <priority>${x.p}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

const distDir = path.join(__dirname, '../dist');
if (fs.existsSync(distDir)) fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(__dirname, '../public/sitemap.xml'), xml);
console.log(`Generated sitemap.xml with ${urls.length} URLs (base: ${BASE})`);
